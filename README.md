# Gurun (Flutter)

A modern Muslim companion for everyday worship — prayer times, Qibla
compass, Quran, Asmaul Husna, duas, dhikr, and hadith. This is the Flutter
port of the legacy app (`../gurun-islamic-mobile`, read-only reference),
rebuilt for 60/120fps animation and jank-free audio (Wave 2).

## Stack

Flutter 3.47 / Dart 3.13 · `go_router` (tabs + drawer) · `flutter_riverpod`
(state) · `dio` (HTTP) · `hive_ce` + `shared_preferences` (persistence) ·
`geolocator` + `flutter_compass` + `adhan` (location/Qibla).

## Prerequisites

- Flutter SDK 3.47.6 / Dart 3.13.5
- Verify with `flutter doctor` before first run

## Run it

```bash
cd gurun-flutter
flutter doctor
flutter pub get
flutter run -d emulator-5554   # Pixel 10 emulator, see docs/AGENTS.md
```

Gates before finishing work: `flutter analyze` (zero issues) +
`dart format lib test`.

## Project layout

```
lib/app/       # theme, colors, router, providers, bootstrap
lib/data/      # dio services, models, TTL repositories
lib/domain/    # pure use-cases (prayer schedule, angle math)
lib/ui/core/   # design-system primitives
lib/ui/features/*/views/  # Home, Qibla, Quran, Surah, Doa, Dzikir,
                           # Hadist, Asmaul Husna, Settings
docs/          # agent guide, architecture, design system, migration plan
.agents/skills # Flutter/Dart/mobile agent skills (see skills-lock.json)
```

## Docs

- `docs/AGENTS.md` — contributor/agent guide (start here).
- `docs/ARCHITECTURE.md` — routes, layers, data flows.
- `docs/DESIGN.md` — color/typography/spacing tokens.
- `docs/flutter-migration-plan.md` — migration source of truth.
- `docs/prd/`, `docs/report/` — audio PRD + perf evidence (Wave 2 input).

## Status

Wave 1 done: 9 static screens at 1:1 UI parity, audio explicitly excluded
(Surah play buttons render inert). Next: Wave 2 audio engine.

MIT © Ahmad Yusuf Ar-Rafi
