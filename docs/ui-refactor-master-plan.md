# UI Refactor Master Plan — Restoring 1:1 Parity

> Phase: planning only. **Do not implement** until this plan is approved. All changes below are UI-layer; data/domain layers are healthy and untouched. Preserves the Wave 2 audio-exclusion boundary (play icons stay inert; settings sheet stays content-empty like RN).

## 0. Ground truths established by the audit

* Tokens are faithful — drift is in *application*, not values (`app_colors.dart` ≈ `global.css`).
* Countdown ticks correctly; the "dead timer" perception = missing Prayer Times carousel + 3 narrow edge bugs (plan §2).
* `flutter_svg` + `lucide_icons` are declared but unused — the refactor either uses or removes them.
* Artikel feed has no Flutter counterpart and postdates the migration spec — needs a scope ruling before Wave 1 work (R-1 below).

## 1. Phased roadmap

### Phase A — Assets & icon foundation (unblocks everything visual)

* A1. Port 11 SVGs (§3 of asset audit) into `assets/svg/`, declare `assets/svg/` in `pubspec.yaml`, add a `SvgTint` helper (colorFilter wrapper). Verify each renders via `flutter_svg` in isolation (widget smoke test per asset).
* A2. Adopt-or-remove ruling: use `lucide_icons` for outline rows (play/bookmark/share/more/camera) or delete dep. Port 4 custom tab SVGs regardless (tint-aware, active=secondary).
* A3. Add shared recipes: `AppCard` (surfaceContainer, radius 12, `AppShadows.cardOf`), `SectionHeader`, `HairlineDivider`. Migrate existing cards onto them. Gate: `flutter analyze` zero + screenshot diff of Asmaul grid unchanged.

### Phase B — Home 1:1 (biggest visual win)

* B1. Hero: mosque SVG (`-bottom-6 scale-110`, card-tint) + radial glow re-stopped to RN values (`hsl(37,100%,52%) → 60%/.8 → background`) + fade gradient below mosque (both modes).
* B2. Clock: crescent-moon colon ornament; keep Schluber 88 split layout.
* B3. Replace `Fitur` menu with `Prayer Times` carousel: header + horizontal scroll of 5 `PrayTimeCard`s (`w 6.6em`, `bg-card/40`, sun icon primary, name medium, time semibold). Keep drawer destinations reachable via the real drawer (B5).
* B4. Header right action: search → settings gear (open settings sheet/route).
* B5. Drawer: 8 destinations with emoji/SVG marks per `(drawer)/_layout.tsx:24-35` + `Gurun / Islamic Companion App` branding (benchmark `sheet-menu.png`).
* Gate: MCP screenshot vs `home.png` + live RN capture — clock, countdown, 5 cards, mosque, tabs.

### Phase C — Quran + Surah 1:1

* C1. Quran header card: cream rounded card + Teko `Bismillah` + rehal SVG positioned `-bottom-40 -right-10`; brown tab underline.
* C2. Surah rows: tune density to `py-7` rhythm; keep medallion approximation (or port ornate ring SVG — P2).
* C3. Surah header: cream rounded card + title/subtitle + Basmalah SVG (theme-aware variant).
* C4. Ayah rows: Latin → semibold secondary; spacing pass (`gap-7` rhythm, `mb-2.5`, `px-1`); footer icons keep Material outline set.
* C5. Settings gear opens bottom-sheet chrome (empty content, matching RN `sura-menu.tsx:21`) — ready for Wave 2.
* Gate: MCP screenshots vs `surah.png` + `surah-scrolled.png`; Latin color sampled secondary.

### Phase D — Qibla, lists, drawer destinations (P1/P2 sweep)

* D1. Needle → teardrop SVG; Kaaba marker onto ring per RN layering; cardinal dots; dark-mode glow.
* D2. Lists (Doa/Dzikir/Hadist/Asmaul): chip-token check in dark mode, Arabic 18→base scale check, fix `solat`→ API-matching filter value (`dzikir_view.dart:12`), camera glyph on fallback button.
* D3. Settings screen: needs benchmarks (`settings.png` light/dark) before restyle.
* Gate: full-screen MCP sweep, every screen light + dark.

### Phase E — Countdown hardening (§2 below) + dark-mode pass

* Dark-mode MCP run of every screen (never done); fix dark card/border tones.
* Countdown edge fixes + widget tests (pure-Dart, no device needed).

## 2. Prayer countdown resolution spec

Findings recap (`prayer_schedule.dart`, `home_view.dart:29-68`, `providers.dart:166-175` vs RN `use-prayer.ts`, `prayer-time.ts`):

1. **Post-Isya mislabel** — `nextPrayerTarget` fallback returns `(Subuh, 23:59:59)` when no `next` status exists (`:159-162`). Fix: compute tomorrow's Subuh from the next day's schedule when available (extend repository fetch by one day), else keep countdown but label honestly (e.g. next prayer name from tomorrow fetch); never show a same-day 23:59:59 target as a prayer time.
2. **Empty-schedule stall** — `findTodayJadwal == null` → provider caches `[]` forever (`providers.dart:173`), UI pins `00:00:00`. Fix: on empty, provider retries once after 60s (or surfaces error state with retry instead of silent zeros); add month-boundary unit test.
3. **Unsafe parse** — `_at`/`nextPrayerTarget` `int.parse` throws on `''` (API default in `prayer_models.dart:19-25`). Fix: `tryParse` + skip malformed entries; provider maps to error state, never red-screens.
4. **Unit tests** (new, pure Dart): post-Isya rollover, month-boundary null, malformed time strings, `formatDuration` clamp. These run in `flutter test` without a device.

## 3. Quality gates & MCP visual-regression protocol

* Per-phase gate: `flutter analyze` zero → `dart format` → `flutter build apk --debug` → install → MCP `list_elements` (structure) + `take_screenshot` (visual) vs the benchmark PNG for that screen.
* Coverage matrix must include: every benchmark screen × light/dark × (list states: loading/content/error where applicable). New benchmarks needed: `settings.png` (both modes), `hadist.png`, dark variants of home/quran/surah.
* Rulings log (decisions needing your call before execution):
  * **R-1 Artikel**: build the feed screen (needs API + design spec) or declare out-of-scope?
  * **R-2 Fitur menu**: RN doesn't render it; plan removes it in B3. Keep anywhere (e.g. drawer only) or delete?
  * **R-3 Dark-mode reference**: benchmarks are mixed-mode; dark truth = `global.css .dark` + live Expo dark run — acceptable, or require designer shots?
  * **R-4 Ornate medallion/calligraphy fidelity**: approximate with text glyphs (cheap) or commission exact SVGs?

## 4. work estimates (for planning only)

A: 0.5–1d · B: 1–2d · C: 1–2d · D: 1d · E: 0.5–1d. Total ≈ 4–7d solo, gated per phase. No data-layer, routing, or state-management changes required.
