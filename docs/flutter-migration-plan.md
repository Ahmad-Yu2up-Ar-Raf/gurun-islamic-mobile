# Flutter Migration Plan — Gurun (Deep Muslim) · Phase 1: Deep Scan & Blueprint

> **Status:** Phase 1 — planning only. No Flutter code bootstrapped, no React Native code modified.
> **Source checkout:** `C:\Dev\Mobile\gurun-islamic-mobile\` (Expo SDK 57, RN 0.86.3, React 19.2.3)
> **Target:** new sibling `C:\Dev\Mobile\gurun-flutter\` (does not exist yet — create in Phase 2)
> **Goal:** eliminate audio/animation jank while keeping strict 1:1 UI/UX and design-system match.
> **Skills applied:** `assess-react-native-migration`, `flutter-apply-architecture-best-practices`, `expo-overview`, `expo-design-system`, `expo-data-fetching`, `expo-router`, `flutter-use-http-package`, `flutter-setup-declarative-routing`

---

## 1. Source inventory (observed)

### 1.1 Platform inventory

| Client | Path / evidence | Access |
|---|---|---|
| Expo RN iOS+Android (single codebase) | `package.json:39,61`, `app.json:2-48`, `app/_layout.tsx` | Accessible — full scan done |
| Web (Metro static export) | `app.json:23-27`, `app/+html.tsx`, `react-native-web:69` | Accessible, out of migration scope |
| Separate native iOS/Android repos | None found; no `ios/`, `android/`, no sibling in `C:\Dev\Mobile\` | Confirmed not to exist |
| Backend | Third-party read-only APIs only (no owned server) | No migration needed |

Decision implication (per `assess-react-native-migration`): single-codebase product with recoverable behavior and replaceable native deps → **Path B greenfield sibling** recommended. Brownfield (RN+Flutter interop in one binary) rejected: dual runtime, dual bridge, host-boundary cost exceeds benefit for a full-app cutover.

### 1.2 Route map (Expo Router → Flutter `go_router`)

Source: `app/` scan + `app/_layout.tsx:62-71`.

| Current route | Renders | Flutter target |
|---|---|---|
| `Stack (root)` → `(drawer)` → `(tabs)/index` (Home) | `home/home-block.tsx` (hero + pray-time sections) | `/home` branch of `StatefulShellRoute` |
| `(tabs)/qibla` | `home-block` + `qibla/qibla-block.tsx` | `/qibla` branch |
| `(tabs)/quran/index` | `quran/quran-block.tsx` | `/quran` branch |
| `(tabs)/quran/[id]` | `surah/surah-block.tsx` | `/quran/:id` sub-route (`context.push`) |
| `(tabs)/settings/index` | `profile-block.tsx` | `/settings` branch |
| `(drawer)/doa` | `doa-block.tsx` | `/doa` (drawer destination) |
| `(drawer)/dzikir` | `dzikir/dzikir-block.tsx` | `/dzikir` |
| `(drawer)/hadist` | `hadist-block.tsx` | `/hadist` |
| `(drawer)/asmaul_husna` | `asmaul-husna-block.tsx` | `/asmaul-husna` |
| `player` (root `Stack.Screen animation:fade`) | `ExpandedPlayer` | Full-screen `/player` (`context.push`, fade transition) |
| `+not-found` | 404 | `GoRouter.errorBuilder` |

Drawer + 4 tabs + 4 drawer screens + 1 detail + 1 player = 11 destinations. `MiniPlayer` is a persistent shell overlay (`_layout.tsx:73`), not a route — replicate as shell-level widget above `navigationShell` in `ScaffoldWithNavBar`.

### 1.3 Feature blocks and data ownership

| Block | Store (Zustand) | Server (TanStack Query) | Media/sensors |
|---|---|---|---|
| `home` (prayer) | `use-location-store.ts` persist (`location-store`, province/city/coords) | `usePrayerTime`: `['prayer-schedule',province,city,date]` → `fetchJadwalShalat` via `ky`, `staleTime 1h`, `select:findTodayJadwal` | `expo-location` GPS + watch; 1 s clock hook |
| `qibla` | None (Reanimated SharedValues only) | None (`adhan.Qibla(coords)`) | `useAnimatedSensor(ROTATION)` + `watchHeadingAsync`; worklet rotate, transform-only (good) |
| `quran` list | None | `['quran']` → `api.get('v2/surat')`, default 60 s stale | Queue source via `queryClient.getQueryData(['quran'])` |
| `surah` detail | `useBookmarkStore` persist (`bookmark-store`); `use-apperance-store.ts` empty | `['surah',id]` → `api.get('v2/surat/{id}')` | Play trigger `usePlaySurah()`; per-ayah `audio` field extracted but play button has no `onPress` (decorative) |
| `doa` | None | `DoaKeys.list(filters)` → `open-api.my.id/api/doa`, `5m/30m`, client filter | None |
| `dzikir` | None (local `useState` filter) | `DzikirKeys.list({types})` → `muslim-api-three…/dzikir`, `5m/30m`, client filter | None |
| `hadist` | None | `HadistKeys.list({search})` → `muslim-api-three…/hadits`, `5m/30m` | None |
| `asmaul_husna` | None | Inline `useQuery` (same `5m/30m` options in `lib/server/asmaul_husna/`) | None |
| `audio` | `useAudioStore` persist (`audio-player-store`, partialize reciter/shuffle/repeat/lastSurah/lastPos) | No query; `preload(nextUrl)`, `updateInterval 1000`, 350 ms transport throttle | Sole `expo-audio` consumer (`useAudioPlayer`, `useAudioPlayerStatus`, `setAudioModeAsync`, lock-screen); `makeMutable` progress/duration |

API client: `api/client.ts:1-11` — bare `ky.create({ baseUrl: EXPO_PUBLIC_API_URL ?? https://equran.id/api/ })`, no timeout/retry/hooks. Providers: `provider.tsx:18-35` — `staleTime 60s, gcTime 5m, retry 1`; `GestureHandlerRootView + SafeAreaProvider + QueryClientProvider + ThemeProvider(NAV_THEME)`.

---

## 2. Design-system 1:1 mapping (the benchmark)

Per `expo-design-system`: the existing system is the source of truth — extend it, don't invent a second one. Storage format changes (CSS vars → Dart), scales/names preserved.

### 2.1 Color tokens → Flutter `ColorScheme`

Source of truth: `global.css:6-113` (HSL vars), mirrored for nav in `lib/theme.ts:3-63`. `darkMode:'class'` (`tailwind.config.js:5`), `.dark:root` overrides, `userInterfaceStyle:automatic` (`app.json:10`).

| Token | Light (HSL) | Dark (HSL) | Flutter target |
|---|---|---|---|
| `background` | `26 54% 97%` | `0 0% 7.06%` | `ColorScheme.background` |
| `foreground` | `0 0% 12.16%` | `30 50% 98%` | `ColorScheme.onSurface` / `onBackground` |
| `card` | `37 79% 89%` | `0 0% 11.76%` | `ColorScheme.surfaceContainer` (cards, sheets) |
| `popover` | `26 54% 97%` | `0 0% 11.76%` | `ColorScheme.surfaceContainerHigh` (menus, dialogs) |
| `primary` | `37.10 100% 59.41%` both modes | same | `ColorScheme.primary` (fixed accent) |
| `primary-foreground` | `26 54% 97%` | `0 0% 7.06%` | `ColorScheme.onPrimary` (mode-dependent!) |
| `secondary` | `29.74 74.19% 30.39%` | `25.6 29.64% 50.39%` | `ColorScheme.secondary` |
| `muted` | `60 4.8% 95.9%` | `0 0% 16.47%` | `ColorScheme.surfaceContainerLowest` |
| `muted-foreground` | `25 5.3% 44.7%` | `240 5.03% 64.9%` | `ColorScheme.onSurfaceVariant` |
| `accent` | `38.05 100% 91.96%` | `37.5 30.77% 15.29%` | `ColorScheme.tertiaryContainer` + `onTertiaryContainer` |
| `destructive` | `346.84 77.17% 49.8%` | `0 62.82% 30.59%` | `ColorScheme.error` + `onError` |
| `border` / `input` / `ring` | `0 0% 89.8%` / bg / primary | `0 0% 16.47%` / card / primary | `DividerTheme`+`OutlineInputBorder` / `fillColor` / `focusColor` |
| `chart-1..5`, `sidebar*` | `global.css:26-38,81-93` | same block | Charts/sidebar `ThemeExtension` (only if used — grep before porting) |

> **Known conflict (must fix in port, not copy):** `lib/theme.ts:20-21` light `muted hsl(30,50%,98%) / mutedForeground hsl(30 30.4% 30.4%)` diverges from `global.css:17-18` (`60 4.8% 95.9% / 25 5.3% 44.7%`). Canonical = `global.css` (what NativeWind actually renders). Port the CSS values; file the RN divergence as a bug, do not replicate both.
>
> **HSL syntax:** source mixes `26, 54%, 97%` and `0 0% 12%`. Normalize to space syntax and convert once via `HSLColor.fromAHSL(...).toColor()` in a generated `app_colors.dart`; assert round-trip against computed hex in widget tests.

Strategy: hand-rolled `ThemeData.light/dark` + one `AppColors` extension (no new design-system package). Dark mode via `ThemeMode.system`. Shadows: light `y4 blur10 a0.05`, dark `y6 blur15 a0.4` (`global.css:43-56,98-111`) → `BoxShadow` tokens `card/raised/overlay`.

### 2.2 Typography → `TextTheme`

`app/_layout.tsx:35-47` loads 11 families; `tailwind.config.js:68-83` maps them.

| Tailwind class | Font file | Flutter `TextStyle.fontFamily` |
|---|---|---|
| `font-poppins_regular/medium/semibold/bold` | `@expo-google-fonts/poppins` 400/500/600/700 | `Poppins` w400/w500/w600/w700 |
| `font-teko_light/regular/medium/semibold/bold` | `@expo-google-fonts/teko` 300–700 | `Teko` w300–w700 (display/numerals) |
| `font-schluber` | `assets/fonts/Schluber.otf` | `Schluber` (declare in `pubspec.yaml`) |
| `font-arabic` | `assets/fonts/NotoNaskhArabic-VariableFont_wght.ttf` | `Arabic` — Arabic script only, `TextDirection.rtl`, line-height ≥1.9 |
| `--font-sans Inter` | Never loaded (CSS fallback only) | Do not port; Poppins is the real sans |

Rule (from skill): named styles, not raw sizes. Map the 6-step ramp (`largeTitle 34/700 → caption 12/400`) to `displayLarge/titleLarge/titleMedium/bodyLarge/bodyMedium/labelSmall`. Keep `allowFontScaling` equivalent: never cap `textScaler` globally; use flexible rows.

### 2.3 Shape, spacing, motion

- Radius: `lg 0.75rem (12), md 10, sm 8` (`tailwind.config.js:45-49`) + `borderCurve:continuous` equivalent → `RoundedRectangleBorder` / `ClipRRect` 12/10/8, capsules `9999`.
- Spacing: Tailwind `0.25rem` base = 4 pt grid → `AppSpacing xs4/sm8/md16/lg24/xl32/xxl48`. Screen edge = 16.
- Motion: `accordion 0.2s ease-out`, theme `fast150/base250/slow400` → `AppMotion` durations + `Curves.easeOut`; Reanimated worklet → implicit/`AnimationController` on UI thread (Dart has no JS bridge — this whole lag class disappears if you avoid layout anims).

### 2.4 Components (21 primitives + 6 custom)

`components/ui/fragments/shadcn-ui/` (21): `alert, avatar, badge, button, card, checkbox, dropdown-menu, icon, image, input, label, native-only-animated-view, popover, radio-group, separator, skeleton, spinner, switch, tabs, text, textarea`. `custom-ui/` (6): `bottom-sheet, asmaul-husna-card, doa-card, hadist-card, home-menu-card, menu-card`. `lib/utils.ts` `cn()` = `clsx+twMerge` → Dart: no equivalent needed (no utility-class merging; variants are constructor params with `copyWith`).

Per-component contract for the port: variants (`primary/secondary/ghost/destructive`), sizes (`sm/md/lg` → spacing/type tokens), states (default/pressed/disabled/loading — pressed via `MaterialState`/`GestureDetector`, never missing), `style`-last override, accessibility role/label. Do not wrap what Flutter already owns (`Switch`, headers, dialogs) — style via theme.

---

## 3. Package replacement matrix (1:1, latest stable at Phase 2 kickoff)

Verify versions with `flutter pub outdated` at kickoff; names below are the recommendation, versions float.

| Current (pinned) | Role | Flutter replacement | Why (perf-relevant) |
|---|---|---|---|
| `expo-router ~57.0.23` + `@react-navigation/* v7` | File-based routing, drawer+tabs+stack | `go_router` (+ `StatefulShellRoute.indexedStack` for 4 tabs; drawer via `Scaffold.drawer`) | Declarative, deep-link ready; persistent tab state without remount (see skill `flutter-setup-declarative-routing`) |
| `react-native 0.86.3` + `expo ~57.0.25` | Runtime | Flutter stable SDK | AOT compiled, no JS bridge; layout anims run on UI thread by default |
| `nativewind ^4.2.1` + `tailwindcss ^3.4.14` | Utility styling | Hand-rolled `ThemeData` + `ThemeExtension(AppColors, AppSpacing, AppMotion)` | Zero runtime class resolution; tokens compile-time constants |
| `21 rn-primitives/*` + `shadcn` wrappers + `class-variance-authority, clsx, tailwind-merge` | Primitives | Flutter Material/Cupertino + small `ui/core` widget set | Native controls, no variant-merge runtime |
| `zustand ^5.0.15` + persist + `@react-native-async-storage` | Client state (location, audio, bookmarks) | `flutter_riverpod` (or `riverpod`) + `shared_preferences` (prefs) + `hive_ce` (queues/bookmarks) | Compile-safe providers, selective `ref.watch` = Zustand selectors; persist off the hot path (see §5) |
| `@tanstack/react-query ^5.90.21` | Server cache (stale/GC/retry/focus) | `riverpod` `FutureProvider/AsyncNotifier` + `dio` interceptors (cache: `dio_cache_interceptor`) | Same stale/GC semantics; `compute()` JSON parsing off UI thread (skill `flutter-use-http-package`) |
| `ky ^2.0.2` (bare, no timeout) | HTTP | `dio` (+ `pretty_dio_logger` dev only) | Timeouts, cancel tokens, interceptors (auth/refresh), per-host options for the 4 API hosts |
| `expo-audio ~57.0.5` | Playback, preload, lock-screen | `just_audio` + `audio_service` (`just_audio_background`) + `audio_session` | Background isolate + ExoPlayer/AVPlayer gapless, real notification controls (Expo Go limitation disappears in real build) |
| `react-native-reanimated 4.5.1` + `worklets 0.10.1` + `gesture-handler 2.32` | Compass, sheets, press, carousel | Flutter `AnimationController`/`AnimatedBuilder` + `sensors_plus` (rotation vector) + `flutter_compass` fallback | 120 Hz capable; no worklet/bridge split to manage |
| `@legendapp/list ^2.0.19` | Virtualized lists (6 screens) | `ListView.builder` / `CustomScrollView`+Slivers (built-in virtualization) | No package needed — virtualization is framework-level |
| `expo-sensors ~57.0.3` + `expo-location ~57.0.20` | Compass heading, GPS | `geolocator` + `sensors_plus` (+ `flutter_compass` where needed) | Stream-based, permission-aware |
| `adhan ^4.4.3` | Prayer calc, Qibla bearing | `adhan` (Dart port — verify API parity: `PrayerTimes`, `Qibla`) else port pure math from `qibla/utils/angle-utils.ts` + `home/utils/prayer-time.ts` (both pure, trivially portable) | Keeps calculation identical; test against known coordinates |
| `expo-secure-store` + `expo-asset` + `expo-image`, `expo-linear-gradient`, `expo-haptics`, `expo-splash-screen`, `expo-status-bar`, `expo-system-ui`, `expo-linking`, `expo-web-browser`, `expo-constants` | Platform services | `flutter_secure_storage`, `cached_network_image`, `flutter_svg`, `vibration`/`haptic_feedback`, `flutter_native_splash`, `system_ui` via `SystemChrome`, `app_links`, `url_launcher`, `package_info_plus` | One capability → one maintained plugin; no Expo Go vs dev-build split |
| `@clerk/clerk-expo ^2.16.1` | Auth (currently unused — no `ClerkProvider` found) | Defer. If auth returns: `flutter_appauth` (OAuth) + `flutter_secure_storage` | Do not port dead code; spec auth fresh in Phase 2 |
| `lucide-react-native ^0.545` | Icons | `lucide_icons` (or `phosphor_flutter` if glyph coverage better) | Same glyph language |
| `date-fns ^4.1` | Dates | `intl` + Dart `DateTime`/`Duration` | Hijri later: `hijri` package (roadmap item) |
| `react-native-svg 15.15`, `react-native-safe-area-context`, `react-native-screens`, `react-native-pager-view`, `reanimated-carousel` | Infra/UI | `flutter_svg`, `SafeArea`, `go_router` transitions, `smooth_page_indicator` | Framework or single-purpose |
| `ky` 4 hosts | `equran.id`, `open-api.my.id/doa`, `muslim-api-three…/dzikir+hadits`, `asmaul-husna-api…`, `cdn.equran.id/audio-full` | One `Dio` instance per host (different timeouts: JSON 15 s, audio stream progressive, CDN cache-first) | Isolates the 50–150 MB audio path from JSON path |

---

## 4. State + data-fetching strategy (maps `expo-data-fetching` 4-states)

- **Split preserved:** Riverpod async providers = server state (replaces TanStack); synchronous `Notifier`s = client state (replaces Zustand). Never mix: ViewModels hold UI state, Repositories own cache/sync (skill `flutter-apply-architecture-best-practices`).
- **Every screen gets 4 states** (loading/error/empty/content). Current code mostly does this via TanStack; keep it: `AsyncValue.when(data/error/loading)` + `ListEmptyComponent` equivalent (`SliverFillRemaining` with action). Refresh keeps stale content (`ref.invalidate` + previous data visible, inline retry).
- **Stale/GC parity:** provider defaults were `60s/5m` — too hot for static Quran. Flutter defaults: Surah list/detail `stale 30m / GC 24h + Hive persist`; prayer schedule `stale 1h / GC 12h` keyed `[province,city,date]`; doa/dzikir/hadist/asmaul `5m/30m` (as today). `refetchOnReconnect` via `connectivity_plus` listener, not focus polling.
- **Persist off the hot path (audio fix):** today `onStatus` 1 Hz writes through persisted Zustand (`use-audio-store.ts:134-149`). Flutter: hot position lives in a non-persisted `ValueNotifier`/Riverpod `StateProvider`; persist (Hive) debounced ≥15 s + on pause/track-change only (`reciterKey/shuffle/repeat/lastSurah/lastPos` — same `PersistedAudioPrefs` shape in `audio-type.ts:24-30`).
- **JSON parsing:** `compute(parseX, body)` isolate for Surah detail + 114-item lists (skill pattern). Never parse 1 MB+ Arabic JSON on UI thread.
- **Errors:** typed `ApiException(status,code)` per host; mutations disabled while pending, draft retained on failure (skill rule).

---

## 5. Performance root causes → Flutter fixes

Evidence: `docs/report/audio-performance-analysis.md` (Expo Go, 30–128 skipped frames, `Davey 700–2800ms`, 23 MB GC, HAL stalls) + code scan.

| # | Root cause (observed file) | Flutter fix (Phase 2 requirement) |
|---|---|---|
| P0 | 50–150 MB full-surah MP3 progressive stream, `preload(next)` only, no offline cache | `just_audio` progressive + `dio` `downloadFirst` cache (Hive-indexed, LRU ≤1 GB) + per-ayah fallback chaining; cache-first for replayed surahs |
| P0 | 1 Hz `store.onStatus` through persisted Zustand → AsyncStorage write + re-render fan-out | Decouple ticker: engine writes `progress: ValueNotifier<double>` (UI-thread, `ListenableBuilder` only under seek-bar/time labels); store update throttled ≥1 Hz non-persisted; Hive persist debounced |
| P1 | `expanded-player.tsx:209-214` animates `width%`/`left%` (layout, not transform/opacity) | Animate `Transform.scaleX` / `SlideTransition` / `CustomPainter` progress only; `RepaintBoundary` around seek-bar |
| P1 | Queue 114 rows via `queue.map + View` (unvirtualized) vs LegendList elsewhere | `ListView.builder` + `const` rows + `AutomaticKeepAlives` off for queue; never `Column(map)` for >20 items |
| P1 | Quran/Surah `staleTime 60s` refetch churn on tab switches | `30m/24h` + Hive persist; `select`-equivalent (derive today-schedule in Repository, not View) |
| P2 | `ky` no timeout → hung prayers on bad network; `networkMode:online` blocks offline resolve | `dio` 15 s connect/receive timeouts, 1 retry w/ backoff, offline-first: serve Hive cache + inline banner |
| P2 | 350 ms transport throttle duplicated (`runTransport` static + hook ref) | Single `debounce/throttle` in ViewModel command; ignore taps <300 ms at the gesture layer |
| P2 | Expo Go-only artifacts (HAL stalls, no lock-screen, `IN_EXPO_GO` branch) | Real `audio_service` notification + `UIBackgroundModes`/`FOREGROUND_SERVICE` equivalents declared from day one; profile on release builds only (`flutter run --release`, DevTools timeline) |
| P3 | Location bootstrap side-effect in layout + GPS watch leaks | Repository-owned `PositionStream` with `cancelOnDispose`; prayer query `enabled` only when province+city resolved |

Goal: 60 fps sustained, 120 Hz on ProMotion for compass + seek-bar + list scroll (transform/opacity/repaint-bounded, zero UI-thread JSON/audio I/O).

---

## 6. 60/120 fps playbook (this app specifically)

1. **Ticker isolation:** only `MiniPlayer` progress dot, `SeekBar`, and time labels listen to position. Everything else (`queue list`, `reciter picker`, headers) is `const` or listens to track-identity only.
2. **Compass:** `sensors_plus` rotation-vector stream → `Transform.rotate` on a `RepaintBoundary`-wrapped dial; no `setState` above the dial; fallback to `flutter_compass` heading where rotation-vector absent. Mirror `angle-utils.ts` shortest-rotation math to avoid 359→0 snap.
3. **Lists:** `ListView.builder(itemExtent` where rows uniform: Quran/Surah/Doa/Dzikir/Hadist/Asmaul) + `SliverAppBar` headers; `estimatedItemSize` equivalents become real `itemExtent`. Arabic rows: `Text` with `Arabic` family, `softWrap`, precomputed `strutStyle` to stop layout thrash.
4. **Images/SVG:** `cached_network_image` + `flutter_svg` pre-cached; no runtime `HairlineWidth` equivalents in build methods — hoist to theme.
5. **Startup:** `flutter_native_splash` until fonts + Hive + location-prefs hydrated (mirrors `AppBootstrap` gate in `_layout.tsx:34-58`); pre-warm prayer query before first frame.
6. **Release-only profiling:** `flutter run --release --trace-startup`, DevTools shader/watermark checks; fix jank with `RepaintBoundary` + `compute`, never with more state.

---

## 7. Proposed target structure (relative to `C:\Dev\Mobile\`)

```text
C:\Dev\Mobile\
├── gurun-islamic-mobile\      # RN source — READ ONLY, never modified by migration
└── gurun-flutter\             # NEW in Phase 2 (flutter create --org com.gurun gurun)
    ├── lib/
    │   ├── main.dart          # usePathUrlStrategy (web) + runApp + splash gate
    │   ├── app/
    │   │   ├── router.dart    # GoRouter: StatefulShellRoute(4 tabs) + drawer + /quran/:id + /player
    │   │   ├── theme.dart     # ColorScheme light/dark + TextTheme + AppColors/Spacing/Motion extensions
    │   │   └── bootstrap.dart # font/Hive/location/prayer prewarm (mirrors AppBootstrap)
    │   ├── data/
    │   │   ├── models/        # quran.dart, surah.dart, doa.dart, dzikir.dart, hadist.dart, asmaul_husna.dart (freezed + fromJson)
    │   │   ├── services/      # dio clients (equran, open_api, muslim_api, asmaul_api, cdn), audio_handler, location_service, qibla_service
    │   │   └── repositories/ # prayer_repository, quran_repository, content_repository, audio_repository (cache+offline)
    │   ├── domain/
    │   │   ├── models/        # AudioTrack, TodayPrayerSchedule, PersistedAudioPrefs (clean, UI-safe)
    │   │   └── use_cases/     # build_today_schedule, build_audio_queue, remap_reciter (pure, tested)
    │   └── ui/
    │       ├── core/          # app_scaffold, themed_text, app_button, app_card, empty_state, error_view, skeleton
    │       └── features/
    │           ├── home/{views,view_models}/
    │           ├── qibla/{views,view_models}/
    │           ├── quran/{views,view_models}/
    │           ├── surah/{views,view_models}/
    │           ├── doa|dzikir|hadist|asmaul_husna/{views,view_models}/
    │           ├── audio/{views (mini_player, expanded_player, seek_bar, reciter_picker),view_models}/
    │           └── settings/{views,view_models}/
    ├── assets/fonts/          # Schluber.otf + NotoNaskhArabic-VF (copied, LICENSE-checked)
    ├── test/                  # use-case + repository + ViewModel tests (no golden UI tests in MVP)
    └── pubspec.yaml           # go_router, riverpod, dio, just_audio, audio_service, hive_ce, geolocator, sensors_plus, adhan
```

Follows `flutter-apply-architecture-best-practices` hybrid: UI grouped by feature, data/domain by type; View → ViewModel (`ChangeNotifier`) → Repository → Service.

---

## 8. Phase 2 blueprint + Todo

### Wave 0 — Scaffold & tokens (1–2 days)
- [ ] `flutter create` sibling `gurun-flutter`; verify `flutter doctor`; pin SDK in `pubspec.yaml`
- [ ] Port `global.css` → `app_colors.dart` (HSL→Color round-trip test); `theme.dart` light/dark; fonts in `pubspec.yaml`
- [ ] `router.dart` shell (4 tabs + drawer + `/player` + error page); `bootstrap.dart` splash gate
- [ ] Dio hosts + Hive init + Riverpod scope; `compute()` JSON parsing helper

### Wave 1 — Read-only parity (Quran/Surah/Doa/Dzikir/Hadist/Asmaul/Home/Qibla)
- [ ] Repositories + `AsyncNotifier`s with §4 stale/GC; 4-states on every screen; `ListView.builder` everywhere
- [ ] Home: location repo + prayer schedule use-case (port `prayer-time.ts` pure logic, test vs fixtures)
- [ ] Qibla: dial + shortest-rotation + accuracy fallback (mirror `use-qibla.ts:107-137` semantics)
- [ ] Visual QA vs RN screenshots (light+dark, Arabic RTL, large-text) — 1:1 sign-off per screen

### Wave 2 — Audio (the perf milestone)
- [ ] `audio_handler` (just_audio+audio_service): queue build from cached Quran list, reciter remap (`CDN_BASE/{slug}/{001-114}.mp3`, default `05`), preload-next, lock-screen metadata (`QS. {latin} / reciter / Gurun · Quran`)
- [ ] Ticker decoupling + debounced persist; transform-only seek-bar; virtualized queue; `downloadFirst` offline cache
- [ ] Release-build profiling: cold start, skip/next latency, background + headset + interruption cases

### Wave 3 — Harden & ship prep
- [ ] Offline banners, timeouts/retries, deep links (`gurun://` + applinks), icons/splash, `FOREGROUND_SERVICE`/BG-audio declarations
- [ ] Widget + integration tests for player + prayer countdown; DevTools 60/120 fps evidence
- [ ] Store metadata; cutover checklist (no OTA lane — full binary release)

---

## 9. Risks, unknowns, residual risks

- **Adhan Dart parity (unknown):** verify `adhan` pub package against `adhan@4.4.3` for Jakarta coords before Wave 1; fallback = port pure TS (small, owned).
- **CDN durability (assumed):** `cdn.equran.id/audio-full` + 3 content APIs are third-party with no SLA — cache aggressively, add per-host fallback/error copy.
- **Clerk (blocked/deferred):** dependency present, zero usage — exclude from MVP; re-spec if login returns.
- **Scope gate (per skill):** single Expo codebase inspected; no hidden native repos — confidence high. Doc claims about 60 fps/LegendList/audio-wiring were stale (see §10); plan uses code, not docs, as truth.

## 10. Verification (Phase 1 read-only proof)

- New file: `docs/flutter-migration-plan.md` (this document) — only write performed.
- Unmodified: all `.tsx/.ts/config` sources; verify with `git status --porcelain` showing only `docs/flutter-migration-plan.md` (plus pre-existing worktree state).
- `C:\Dev\Mobile\` contains no `gurun-flutter\` yet — sibling creation explicitly deferred to Phase 2.
- No `flutter create`, `flutter pub add`, or RN edits executed in this phase.

## Appendix — pinned source versions (from `package.json`)

`expo ~57.0.25 · react-native 0.86.3 · react 19.2.3 · expo-router ~57.0.23 · reanimated 4.5.1 · worklets 0.10.1 · nativewind ^4.2.1 · tailwindcss ^3.4.14 · zustand ^5.0.15 · @tanstack/react-query ^5.90.21 · ky ^2.0.2 · expo-audio ~57.0.5 · @legendapp/list ^2.0.19 · adhan ^4.4.3 · expo-location ~57.0.20 · expo-sensors ~57.0.3 · async-storage ^2.2.0 · clerk ^2.16.1 (unused)`
