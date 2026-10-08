# Gurun Flutter — Agent Guide

Flutter port of the Gurun Muslim companion app. The legacy
codebase (`../gurun-islamic-mobile/`) is **read-only reference** — never modify it.

## Commands

| Command | What it does |
|---------|-------------|
| `flutter analyze` | Static analysis gate — must report `No issues found!` |
| `dart format lib test` | Formatter — run after every code change |
| `flutter run -d emulator-5554` | Run on the Pixel 10 emulator (from `gurun-flutter/`) |
| `flutter test` | Widget/unit tests in `test/` |

SDK: Flutter 3.47.6 / Dart 3.13.5 (`C:/Dev/tools/flutter`). No lint/test
scripts beyond the Flutter CLI — run the above manually before finishing.

## Architecture (MVVM + Repository)

- **Routing**: `go_router` in `lib/app/router.dart`. `StatefulShellRoute`
  with 4 tabs (Home `/home`, Quran `/quran`, Qibla `/qibla`, Settings
  `/settings`) + drawer destinations (`/doa`, `/dzikir`, `/hadist`,
  `/asmaul-husna`) + detail (`/quran/:id`). No `/player` route (Wave 2).
- **State**: Riverpod. `Notifier` = client state (theme, region, bookmarks,
  dzikir filter, countdown); `FutureProvider` = server state (Quran, Surah,
  content lists, prayer schedule). All providers in `lib/app/providers.dart`.
- **Data**: Dio clients per host in `lib/data/services/api_clients.dart`
  (equran, open-api, muslim-api, asmaul-api; 15s timeouts; typed
  `ApiException`). TTL caches in repositories (Quran/Surah 30m, content 5m,
  prayer 1h). Heavy JSON parsed via `compute()` isolates.
- **Domain**: pure Dart in `lib/domain/` (`prayer_schedule.dart`,
  `angle_math.dart`) — no framework imports, unit-testable.
- **UI**: `lib/ui/core/` primitives (`AppScaffold`, `ThemedText`,
  `ArabicText`, `TekoText`, `AppButton`, `CountPill`, loading/error/empty
  states, `FilterCarousel`) + `lib/ui/features/<name>/views/`.
- **Theme**: `lib/app/app_colors.dart` (HSL→hex tokens) + `lib/app/theme.dart`
  (`ColorScheme` light/dark, Poppins/Teko text ramp). `ThemeMode.system`
  default, persisted toggle in Settings.
- **Fonts** (bundled, offline-safe): Poppins 400/500/600/700, Teko variable,
  Schluber, Arabic Naskh — declared in `pubspec.yaml`, files in
  `assets/fonts/`.

## Bootstrap flow

`main.dart` → `ProviderScope` → `GurunApp`: theme/region/bookmark notifiers
self-restore from SharedPreferences on `build()`; splash shows until the
first frame. Prayer schedule pre-warms via `todayScheduleProvider`.

## Hard boundaries (never violate)

1. **Audio exclusion** (until Wave 2): no `just_audio`/`audio_service`
   packages, no `ui/features/audio/`, no player UI. Surah play icons render
   inert — keep them that way.
2. **No placeholders**: build fully styled widgets, never stub screens.
3. **ViewModels stay in providers**: feature `view_models/` dirs are reserved;
   today the Notifiers in `providers.dart` carry that role.
4. **Strict casts**: no `dynamic` leaks, no unused imports — `flutter analyze`
   must stay at zero issues.

## Skill map (`.agents/skills/`)

| Intent | Skill |
|--------|-------|
| Project structure / new feature | `flutter-apply-architecture-best-practices` |
| Routing, tabs, deep links | `flutter-setup-declarative-routing` |
| HTTP, Dio, isolate parsing | `flutter-use-http-package` |
| Models (`fromJson`) | `flutter-implement-json-serialization` |
| Widget/unit tests | `flutter-add-widget-test`, `dart-add-unit-test` |
| Layout bugs, overflow | `flutter-fix-layout-issues`, `flutter-build-responsive-layout` |
| Static analysis workflow | `dart-run-static-analysis` |
| Emulator driving, screenshots, crash logs | `mobile-automation` |

If a task matches a skill, load its `SKILL.md` first and follow it exactly.

## Key references

- `docs/flutter-migration-plan.md` — migration source of truth (Phases 1–2).
- `docs/ARCHITECTURE.md` — route tree, layers, data flows.
- `docs/DESIGN.md` — token tables and typography map.
- `docs/prd/full-surah-audio-player-prd.md` — Wave 2 audio input (do not implement yet).
- `docs/report/audio-performance-analysis.md` — perf evidence behind Wave 2.
