# UI Gap Analysis — RN Reference vs Flutter Port (1:1 Parity Audit)

> **Phase:** Research / audit only. No production code changed for this report.
> **Reference:** legacy Expo app `C:\Dev\Mobile\gurun-islamic-mobile` (read-only) + live Expo Go run on Pixel 10 Pro XL (emulator-5554, 2026-10-08).
> **Subject:** Flutter port `C:\Dev\Mobile\gurun-flutter\lib` (24 dart files) + prior-session MCP captures of the Flutter build on the same emulator.
> **Benchmarks:** all 12 files in `ui_benchmark_refactor/` (100% covered, §8).

## How to read this document

Each screen section has: (a) what the benchmark + RN code show, (b) what Flutter does today with exact `lib/…:line` citations, (c) the delta list. Severity: **P0** = broken/wrong vs reference, **P1** = visibly off, **P2** = polish/nice-to-have. All RN citations are absolute paths under `C:\Dev\Mobile\gurun-islamic-mobile`; all Flutter citations under `C:\Dev\Mobile\gurun-flutter\lib`.

---

## 1. Home (`home.png` + live Expo Go capture)

### 1.1 Reference (RN)

* `components/core/block/home/home-block.tsx:10-24`: `HeroSection` + `PrayTimeSection`. **No `Fitur` menu** — `home-menu-card.tsx:43-83` is orphaned (zero importers).
* Hero (`hero-section.tsx:19-130`): container `SCREEN_WIDTH*0.76`; **mosque silhouette SVG** (`mosque.tsx:5-11`, 439×249, theme-tinted card color) absolute `-bottom-6 scale-110`; **radial gold glow** (`RadialGradient`, stops `hsl(37,100%,52%) → /0.8 → background`); **fade gradient** below mosque (light `hsl(37,79%,89%)→hsl(26,54%,97%)`); Schluber split clock `text-8xl` secondary with **crescent-moon colon detail** (visible in benchmark); info row `remaining time / {nextPrayer} {remaining}` + divider + `dateString / city`; `PrayTimeSection` (`pray-time-section.tsx:11-33`): `Prayer Times` header + horizontal scroll of 5 cards (`pray-time-card.tsx:25`: `w-[6.6em] bg-card/40`, sun icon, name `poppins_medium`, time `poppins_semibold lg`).
* Header: hamburger left, `Gurun` center, gear-in-circle right. Tab bar: **custom SVG icons** (house, quran-stand, kaaba, gear), active = brown/secondary.
* Live behavior (emulator, Expo Go): clock `13:31`, countdown `Ashar 01:14:04 → 01:13:50` **ticking every second**; cards `Subuh 04:19, Dzuhur 11:44, Ashar 14:46, Maghrib 17:54`.

### 1.2 Flutter today (`ui/features/home/views/home_view.dart`)

* `_HeroClock:175-290`: radial glow only (`RadialGradient … stops [0,0.4,0.75]`, `:194-205`); **no mosque SVG, no fade gradient**; Schluber 88 clock with plain `:` (`:229`); info row present (`:230-285`).
* `_FiturMenu:102-173` (Dzikir/Doa/Asmaul/Hadist rows) **replaces** the Prayer Times section — a scope deviation from the reference (comment at `:70` admits `PrayTimeSection is commented out in RN`, but the live RN app *does* render it).
* Header: `menu` + `search` icons (`:82,86`); reference has hamburger + **gear** (Flutter shows search — wrong action).
* Tab bar: Material `home_outlined/menu_book_outlined/explore_outlined/settings_outlined` (`router.dart:105-124`) vs custom SVGs.

### 1.3 Deltas

| # | Delta | Severity |
|---|---|---|
| H-1 | Missing mosque silhouette hero asset (RN `mosque.tsx`, `hero-section.tsx:76-78`) | P0 |
| H-2 | Missing fade gradient under hero (RN `hero-section.tsx:81-96`) | P1 |
| H-3 | Radial glow stops/colors differ (RN gold `52%→60%` vs Flutter `primary→primary .8→surface .06`) | P1 |
| H-4 | Clock lacks crescent-moon colon ornament | P2 |
| H-5 | Entire `Prayer Times` card carousel missing (replaced by Fitur menu) | P0 |
| H-6 | Header right action is search; reference is settings gear | P1 |
| H-7 | Bottom nav uses Material icons; reference uses custom SVG set | P1 |
| H-8 | Drawer is branding-only (`app_scaffold.dart:58-101`); reference drawer lists 8 emoji destinations (`sheet-menu.png`, `(drawer)/_layout.tsx:24-35`) | P1 |

---

## 2. Quran list (`quran.png`)

### 2.1 Reference

* `quran-header.tsx:8-51` + `progress-card.tsx:48-66`: cream card `Daily Quran / Bismillah (Teko 4xl secondary) / Time to recite` with **open-Quran-on-stand illustration** (`quran-animation` SVG, absolute `-bottom-40 -right-10 size-44`).
* Tabs Surah/Juz/Page with **brown underline indicator**; only Surah functional.
* `surah-card.tsx:23-83`: ornate circular number medallion, `namaLatin poppins_medium base`, `tempatTurun • jumlahAyat Ayah muted sm`, Arabic right **brown/secondary**; hairline dividers; `py-7` row density.

### 2.2 Flutter today (`quran_view.dart`)

* `_ProgressCard:72-120`: cream container h125 with `menu_book 176 @ .15 opacity` (`:106-114`) instead of the rehal illustration — reads as a watermark, not artwork.
* Tabs `:122-168` switch visual state only (Juz/Page don't filter — same as RN, acceptable).
* `_SurahRow:170-258`: `۝` glyph + number badge (reasonable medallion approximation), correct text stack, Arabic `20 secondary` (`:252`), dividers present.

### 2.3 Deltas

| # | Delta | Severity |
|---|---|---|
| Q-1 | Quran-on-stand illustration missing (watermark icon instead) | P0 |
| Q-2 | Row density/airiness differs (`py-7` vs `pad v28` + badge 40px) — minor | P2 |
| Q-3 | Tab underline styling vs reference brown indicator | P2 |

---

## 3. Surah detail (`surah.png`, `surah-scrolled.png`, `surah-setting-drawwer.png`)

### 3.1 Reference

* `sura-header.tsx:27-75`: **cream rounded card** (`Card mb-5 pt-4`) with `namaLatin 2xl secondary`, `arti • n Ayah muted xs`, **Basmalah calligraphy SVG** (`Basmallah/BasmallahDark w-3/4`, theme-aware). Play button exists but commented out (`:63-72`).
* `ayat-card.tsx:33-124`: pill `{s}:{a}` (`bg-primary/10 rounded-2xl`, semibold sm) + `MoreHorizontal` right; Arabic `text-2xl` right relaxed; **Latin `poppins_medium sm` in secondary (brown/gold)**; translation `poppins_regular sm muted`; footer play/bookmark/share ghost row; `border-b muted/10` separators.
* Scrolled state: compact header (`Al-Fatihah` title + back + gear), same rows.
* Settings sheet (`sura-menu.tsx:21`): **empty white sheet** in RN today (Wave 2 placeholder) — parity target is the sheet chrome, not content.

### 3.2 Flutter today (`surah_view.dart`)

* `_SuraHeader:74-120`: **no card** — plain centered column; basmalah is small Naskh text (`:110-115`, size 22) instead of calligraphy art.
* `_AyatCard:122-200`: correct skeleton (CountPill + `more_horiz`, Arabic 24 right h1.9, Latin, translation, 3-icon footer, bottom border). Latin uses `bodyMedium` default color, **not secondary brown** (`:162`).
* Header is `SliverAppBar` floating with `chevron_left` + `settings_outlined` (inert, `:39`) — matches scrolled benchmark chrome.
* No prev/next navigation in either codebase (RN has none; audio queue only) — not a gap.

### 3.3 Deltas

| # | Delta | Severity |
|---|---|---|
| S-1 | Header card missing (cream rounded container) | P0 |
| S-2 | Basmalah calligraphy SVG missing (plain Naskh text instead) | P0 |
| S-3 | Latin transliteration color: reference secondary brown; Flutter default on-surface | P1 |
| S-4 | Ayah row rhythm differs (RN `gap-7/mb-2.5/px-1` vs Flutter `h28/m b10/pad h4 v16`) — needs 1:1 spacing pass | P1 |
| S-5 | Settings sheet chrome missing (RN shows empty sheet; Flutter gear is inert no-op) | P2 (Wave 2 will fill it) |

---

## 4. Qibla (`qibla.png` dark dial, `qibla-placeholder.png` light fallback)

### 4.1 Reference

* Dial (`qibla-block.tsx:64-145`): 292px ring, **gold border** (`border-primary` 4px), N/W/E/S labels + dot markers, **teardrop needle** (`ArrowSvg`), Kaaba marker pinned on ring, degree readout `poppins_semibold xl`, `Device angle to qibla` caption, facing pill. Dark-mode screenshot shows gold-on-black with background glow streak.
* Fallback (`:273-300`): Kaaba icon 48, `Sensor tidak tersedia` headline + message, **cream pill button** `Coba Camera Mode` with camera icon → Google Qibla Finder embed.

### 4.2 Flutter today (`qibla_view.dart`)

* `_Compass:70-187`: ring + `navigation 102` arrow + Kaaba box + facing pill — structurally equivalent. Verified live on emulator: `295°`, `Rotate the phone 65° to the left`.
* `_SensorError:221-260`: same fallback incl. camera-mode button → same URL.

### 4.3 Deltas

| # | Delta | Severity |
|---|---|---|
| B-1 | Needle is Material `navigation` arrow; reference is a teardrop/arrow SVG | P1 |
| B-2 | Missing cardinal dot markers + dark-mode glow treatment | P2 |
| B-3 | Missing haptic-on-facing + accuracy plumbing (RN `use-qibla.ts:256,269`; accuracy label computed but unrendered even in RN) | P2 |
| B-4 | Kaaba marker styling differs (RN `KabbahIcon` on ring vs Flutter white box center) | P1 |

---

## 5. Dzikir (`dzikir.png`, dark) / Doa (`dua.png`, dark)

### 5.1 Reference

* Filter chips: active = **solid gold pill** (`Semua`), inactive = outline pills (`dzikir-block.tsx:43-68`, `FiltersCarousel`).
* Cards: brown pill `{ulang} - {type}` + `MoreHorizontal`; Arabic right; translation gray; footer-less; hairline dividers.
* Doa: `{id} judul` bold header + `...`; Arabic; Latin gray; `Meaning: terjemah` gray.

### 5.2 Flutter today (`dzikir_view.dart`, `doa_view.dart`)

* `FilterCarousel` + `_Chip` (`filter_chips.dart:66-115`): ChoiceChip gold-selected — close to reference.
* `_DzikirCard` / `_DoaCard`: same geometry (CountPill, Arabic 18 max2, caption translation). **Data nit:** filter value `'solat'` vs label `Shalat` (`dzikir_view.dart:12`) — must equal API `type` or chip yields empty.
* Doa verified on emulator against dead upstream: correct `Gagal memuat data doa / ApiException(402)` + `Coba lagi` — error path works.

### 5.3 Deltas

| # | Delta | Severity |
|---|---|---|
| D-1 | Chip selected/unselected colors need token check vs gold/outline reference (dark-mode shots) | P1 |
| D-2 | Arabic size 18 vs reference `base`; translation color/line-height | P2 |
| D-3 | `solat` vs `Shalat` filter value mismatch risk | P1 |

---

## 6. Asmaul Husna (`asmaul-husna.png`, dark)

Reference: 2-col cards with number, Arabic right, Latin, truncated arti — `asmaul-husna-card.tsx:22-58` (`rounded-2xl border p-3`). Flutter `_AsmaulCell` (`asmaul_husna_view.dart:55-95`): same structure (`surface`, outline border, `lg12`, Arabic 20, arti max1). **Closest to 1:1 already.** Delta: dark-mode border/card tones + `arti 9px` scale — P2.

## 7. Artikel (`artikel.png`) — screen missing in Flutter

Reference shows an `ARTIKEL` feed (chips Semua/Dunia/Filantropi/…, category pill, title, rounded thumbnail, author row). **No Artikel route, provider, or model exists in Flutter** (`router.dart`, `providers.dart`). The RN route inventory from the audit (Phase 1 migration plan §1.2) lists 11 destinations with no artikel feed either — this benchmark may postdate the migration spec. Decision required: in-scope (new Wave 1 screen + API + thumbnail caching) or explicitly out-of-scope. Treated as **P0-scope-question**, not a regression.

## 8. Benchmark coverage (12/12)

| File | Maps to | Verdict |
|---|---|---|
| `home.png` | Home (RN `home-block.tsx` → Flutter `home_view.dart`) | §1, 8 deltas |
| `quran.png` | Quran list | §2, 3 deltas |
| `surah.png` | Surah detail top | §3 |
| `surah-scrolled.png` | Surah scrolled + compact header | §3, chrome matches |
| `surah-setting-drawwer.png` | Surah settings sheet (empty in RN too) | §3 S-5 |
| `sheet-menu.png` | App drawer (8 emoji destinations) | §1 H-8 |
| `qibla.png` | Qibla dial (dark) | §4 |
| `qibla-placeholder.png` | Qibla sensor fallback (light) | §4, structure matches |
| `dzikir.png` | Dzikir list (dark) | §5 |
| `dua.png` | Doa list (dark) | §5 |
| `asmaul-husna.png` | Asmaul grid (dark) | §6, near-parity |
| `artikel.png` | Artikel feed — **no Flutter counterpart** | §7 scope question |

Settings screen has no benchmark — captured as a doc gap (recommend adding `settings.png` light/dark in the plan's QA gates).

## 9. Prayer countdown — correction of the reported failure

The report of "countdown not updating" does **not** reproduce as a tick failure: Flutter `CountdownNotifier` (`home_view.dart:29-64`) re-runs `_compute()` every second with fresh `DateTime.now()` and re-parses targets (`prayer_schedule.dart:140-163`); MCP trees showed `02:18:11 → 02:17:18 → … → 02:05:14` decrementing live, matching RN's `useSecondClock` + per-render `buildTodayPrayerSchedule` (`use-prayer.ts:23-56`). Real defects are narrower (see master plan §2): post-Isya mislabel (counts to 23:59:59 as "Subuh"), empty-schedule permanent `00:00:00` stall, unguarded `int.parse` on empty API time strings. The *perceived* breakage is most likely the **missing Prayer Times carousel** (H-5): users see no prayer data below the hero, so the countdown reads as dead.
