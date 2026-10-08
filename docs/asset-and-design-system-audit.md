# Asset & Design-System Audit — RN Reference vs Flutter Port

> Phase: research / audit only. No production code changed. All RN paths under `C:\Dev\Mobile\gurun-islamic-mobile`; Flutter paths under `C:\Dev\Mobile\gurun-flutter`.

## 1. Asset inventory

### 1.1 RN: everything visual is inline SVG, not raster

`assets/` holds only logos (`logo.png`, `adaptive-logo.png`, `logo.svg`, `splash.svg`) + 2 fonts. Zero `require('@/assets/…png')` in screens — all illustration is one of 18 files in `components/ui/fragments/svg/`:

| SVG fragment | Size | Used in | Flutter equivalent today |
|---|---|---|---|
| `mosque.tsx` (silhouette, 439×249, theme-tinted) | 439×249 | Home hero (`hero-section.tsx:76-78`) | **MISSING** — procedural radial only (`home_view.dart:192-205`) |
| `quran-animation.tsx` (open Quran on rehal) | — | Quran header card (`progress-card.tsx:64-66`) | **MISSING** — `menu_book 176 @15%` watermark (`quran_view.dart:106-114`) |
| `basmalah.tsx` (+ dark variant) | 239×85 | Surah header (`sura-header.tsx:53-57`) | **MISSING** — Naskh text 22 (`surah_view.dart:110-115`) |
| `kabbah.tsx` | 25×25 | Qibla marker | Approximated by `Icons.mosque 15` (`qibla_view.dart:135`) |
| `arrow.tsx` | 40×87 | Qibla needle | Approximated by `Icons.navigation 102` (`:119`) |
| `pollygon.tsx` | 15×13 | Qibla marker | dropped |
| `logo-app.tsx` | 80×80 | Drawer/about | dropped (drawer is text-only) |
| `icons/home|quran|masjid|kabbah|dua|tasbih|sujjud|setting.tsx` | 24×24-ish | Tab bar + menus (tint-aware `fill`) | **MISSING** — Material icons throughout |
| `icons/makkah-icon.tsx`, `icons/pray-time/zuhur.tsx` | — | Prayer cards (same sun for all 5) | n/a (cards missing entirely) |
| `reactangle.tsx` | 414×358 | decorative | dropped |

Flutter `assets/` holds **7 font files, 0 images/vectors**; `pubspec.yaml:83-86` has no `assets:` stanza. `flutter_svg ^2.3.0` (`pubspec.yaml:49`) is declared but has **zero imports in `lib/`** — dependency without a single call site.

### 1.2 Icon mapping table (RN lucide → Flutter today → target)

RN uses **exclusively `lucide-react-native@0.545`** (zero `expo/vector-icons` hits). Sizing: direct `size={n}` or `Icon as={…} className="size-*"` via cssInterop (`icon.tsx:13-43`, default 14).

| Screen / usage | RN (lucide, size) | Flutter today | Target for parity |
|---|---|---|---|
| Tab Home | custom `home.tsx` SVG 24, tint fill | `Icons.home_outlined/home` (`router.dart:106-107`) | Port 4 tab SVGs, tint-aware |
| Tab Quran | custom `quran.tsx` SVG | `Icons.menu_book_outlined/menu_book` | port |
| Tab Qibla | custom `masjid.tsx`/`kabbah.tsx` | `Icons.explore_outlined/explore` | port |
| Tab Settings | custom `setting.tsx` | `Icons.settings_outlined/settings` | port |
| Header left (all screens) | hamburger/menu | `Icons.menu` — OK | keep |
| Header right Home | gear-in-circle | `Icons.search` (`home_view.dart:86`) — **wrong** | gear → settings sheet/route |
| Header right others | search/gear | `menu`/`chevron_left` mix | per-screen spec in plan |
| Fitur rows | `home-menu-card.tsx:66,73` (20 + ChevronRight 16) | `wb_sunny/book/star/history` + `chevron_right 16` — OK shape, wrong glyphs | port custom glyphs or lucide equivalents |
| Ayah footer | PlayCircle/Bookmark/Share2 (`size-5`) | `play_circle_outline/bookmark/share_outlined` 20 — OK | keep Material (lucide-style outline matches) |
| Cards (`doa/hadist/dzikir`) | `MoreHorizontal` | `more_horiz 16` — OK | keep |
| Qibla fallback button | `CameraIcon 16` | `AppButton` without leading icon (`qibla_view.dart:252-255`) | add camera glyph |
| Chips active | n/a (pill) | `cancel 15` (`filter_chips.dart:89`) — OK | keep |

`lucide_icons ^0.257.0` (`pubspec.yaml:56`) is declared but **unused** — either adopt it for the outline-style rows (play/bookmark/share/more) or remove it in the execution phase to cut dead weight. Custom tab/hero SVGs must still be hand-ported regardless.

## 2. Design-token drift analysis

### 2.1 Colors — values match, wiring drifts

Flutter `app_colors.dart:7-52` hex values are faithful HSL→hex conversions of `global.css` (spot-checked: background `#FBF7F3`/`#121212`, card `#F9E8CD`/`#1E1E1E`, primary `#FFB030` both modes, secondary `#874D14`/`#A67B5B`). **No palette drift in the tokens themselves.** Drift is in *application*:

| Token use | RN | Flutter | Gap |
|---|---|---|---|
| Card surface | `bg-card/40` prayer cards, cream `Card` header on surah | `CardThemeData surface, elevation 0, BorderRadius.zero` (`theme.dart:86-91`) — flat by default | Radius/elevation applied ad-hoc per widget; no shared card recipe → inconsistent corners (12 vs 10 vs 0) |
| Latin transliteration | `text-secondary` (brown) — surah, dzikir pill text | default on-surface (`surah_view.dart:162`) | P1 color misuse |
| Arabic accent | `text-secondary` (quran rows, `surah-card.tsx:75-77`) | `20 secondary` — OK (`quran_view.dart:252`) | keep |
| Muted text | `text-muted-foreground` | `onSurfaceVariant` — OK | keep |
| Dividers | `border-border`, `border-b-muted/10` | `outline` / `onSurfaceVariant a0.1` — OK | keep |
| Gold chip active | solid primary + dark text | `ChoiceChip selected primary` — verify `onPrimary` text (`filter_chips.dart`) | check vs benchmark |
| Dark-mode surfaces | `.dark:root` card `#1E1E1E`, bg `#121212` | mapped — OK | verify on-device dark run (never MCP-tested) |

### 2.2 Typography — scale matches, two misuses

* Poppins ramp (`theme.dart:40-47`: 34/700, 22/600, 17/600, 17/400, 15/400, 12/400) mirrors the 6-step RN ramp; Teko (`tekoStyle`, default 30w600) and Schluber (`schluberStyle`, default 72 secondary) wired. Font files all present and declared.
* Misuses: (a) Latin transliteration should be semibold secondary per RN (`ayat-card.tsx:88-90`) but renders regular on-surface; (b) surah header title hierarchy (RN `2xl secondary` over `xs muted` over art) flattened in Flutter.
* Arabic: Naskh with `h1.9` both sides (`themed_text.dart:46-77` vs `font-arabic … leading-relaxed`); sizes 24 (ayah) vs RN `text-2xl` — equivalent. Header basmalah art gap is asset, not type.

### 2.3 Shape / elevation / motion

* Radius tokens exist (`AppRadius 12/10/8/full`, `AppMotion 150/250/400`, `AppShadows.cardOf`) and mirror `global.css` (`--radius .75rem`, shadow specs) — but **no shared Card/Button recipe consumes them**, so each view hardcodes its own (surah none, asmaul `lg12`, chips stadium, buttons `lg`). RN gets consistency free via shadcn `card.tsx`/`button.tsx` variants.
* Shadows: RN light `y4/blur10/5%`, dark `y6/blur15/40%` — Flutter `AppShadows.cardOf` encodes the same, yet **no view applies a shadow** (flat cards everywhere). Benchmark light screens show soft card lift (Quran header card, prayer cards).
* Motion: RN accordion 200ms + Reanimated worklets (compass 120Hz-capable); Flutter compass rebuilds via Riverpod stream (functionally 60fps on emulator, verified) but without `RepaintBoundary` discipline outside the dial — fine for now, revisit in perf pass.

## 3. Missing-asset recovery list (for the execution phase)

1. `mosque.tsx` → port to `assets/svg/mosque.svg` (keep theme-tint via `colorFilter`), 439×249.
2. `quran-animation.tsx` (rehal) → `assets/svg/quran_rehal.svg`.
3. `basmalah.tsx` + dark variant → `assets/svg/basmalah.svg` (+ `basmalah_dark.svg`).
4. Tab set: `home, quran, masjid/kabbah, setting` → `assets/svg/tab_*.svg` with tint `fill`.
5. `arrow.tsx` (needle), `kabbah.tsx`, `pollygon.tsx` → qibla set.
6. `logo-app.tsx` → drawer/about branding.
7. Radial/fade hero gradients stay procedural (they already are in RN — `react-native-svg`); reimplement with `RadialGradient` + `LinearGradient` matched to the exact stops in `hero-section.tsx:103-130,81-96`.
8. Decide `lucide_icons`: adopt for outline rows or delete the dependency.
