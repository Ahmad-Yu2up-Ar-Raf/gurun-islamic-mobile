# Gurun Flutter — Architecture Guide

## Route tree (`lib/app/router.dart`)

```
StatefulShellRoute (bottom NavigationBar, state preserved per tab)
├── /home                  # Home — hero clock, countdown, Fitur menu
├── /quran                 # Surah listing
│   └── /quran/:id         # Surah detail (pushed, id validated 1–114)
├── /qibla                 # Qibla compass
└── /settings              # Profile settings (theme toggle)
/doa                       # Daily duas (drawer destination)
/dzikir                    # Dhikr + type filter (drawer destination)
/hadist                    # Hadith collection (drawer destination)
/asmaul-husna               # 99 Names grid (drawer destination)
```

- `initialLocation: '/home'`. Unknown routes hit `errorBuilder`.
- `Scaffold.drawer` carries Gurun branding only; the `Fitur` menu on Home
  routes to the four drawer destinations.
- No `/player` route — audio arrives in Wave 2.

## Layer map

```
lib/
├── main.dart              # binding init → ProviderScope(GurunApp)
├── app/
│   ├── router.dart        # GoRouter + ScaffoldWithNavBar
│   ├── theme.dart         # buildAppTheme(light/dark) + Teko/Schluber styles
│   ├── app_colors.dart    # hex tokens, spacing, radius, motion, shadows
│   ├── providers.dart     # ALL Riverpod providers (client + server state)
│   └── bootstrap.dart     # pre-warm gate + ProviderScope entry
├── data/
│   ├── services/
│   │   └── api_clients.dart   # 4 Dio hosts + ApiException + getAndParse()
│   ├── models/                # surah/content/prayer models + compute() parsers
│   └── repositories/          # TTL caches (repositories.dart, device_repositories.dart)
├── domain/
│   ├── angle_math.dart        # normalizeAngle, shortestRotation (pure)
│   └── use_cases/
│       └── prayer_schedule.dart  # buildTodaySchedule, countdown targets (pure)
└── ui/
    ├── core/              # scaffold, text, buttons, pills, states, chips
    └── features/<f>/views/  # one ConsumerWidget screen per feature
```

View → Provider (Notifier/FutureProvider) → Repository → Service.
Domain holds no Flutter imports. Views hold no parsing, no HTTP, no math.

## Data flows

| Screen | Provider | Repository | Endpoint |
|--------|----------|------------|----------|
| Home countdown | `countdownProvider` (1s ticker) + `todayScheduleProvider` | `PrayerRepository` (1h TTL) | `POST v2/shalat {provinsi, kabkota}` |
| Qibla | `_compassProvider` (stream) + `regionProvider` | `LocationRepository` (prefs + GPS) | on-device (`adhan` bearing) |
| Quran | `quranListProvider` (30m TTL) | `QuranRepository` | `GET v2/surat` |
| Surah `:id` | `surahDetailProvider(id)` (30m TTL) | `QuranRepository` | `GET v2/surat/{id}` |
| Doa / Hadist / Dzikir / Asmaul | `*ListProvider` (5m TTL) | `ContentRepository` | open-api / muslim-api / asmaul-api |
| Bookmarks | `bookmarkProvider` (persisted string list) | `BookmarkRepository` | SharedPreferences only |

Every list screen renders 4 states: loading (`LoadingState`), error
(`ErrorState` + retry → `ref.invalidate`), empty (`EmptyState`), content
(`ListView.builder` / `GridView.builder`). Refresh keeps stale content via
`RefreshIndicator` + invalidate.

## Bootstrap flow

1. `WidgetsFlutterBinding.ensureInitialized()`, `runApp(ProviderScope(...))`.
2. Theme/region/bookmark notifiers restore persisted prefs on first build.
3. First frame renders; prayer schedule pre-warms in the background.
4. Countdown ticks at 1Hz; compass streams heading; lists fetch once per TTL.
