# Gurun Flutter — Design System

Ported 1:1 from the legacy `global.css` HSL tokens (canonical source).
Implemented in `lib/app/app_colors.dart` + `lib/app/theme.dart`.
`ThemeMode.system` by default; manual override persisted from Settings.

## Colors

| Token | Light (hex) | Dark (hex) | Flutter slot |
|-------|-------------|------------|--------------|
| `background` | `#FBF7F3` | `#121212` | `surface` / scaffold |
| `foreground` | `#1F1F1F` | `#FCFAF7` | `onSurface` |
| `card` | `#F9E8CD` | `#1E1E1E` | `surfaceContainer` |
| `popover` | `#FBF7F3` | `#1E1E1E` | `surfaceContainerHigh` |
| `primary` | `#FFB030` | `#FFB030` | `primary` (gold anchor, both modes) |
| `primary-foreground` | `#FBF7F3` | `#121212` | `onPrimary` (mode-dependent!) |
| `secondary` | `#874D14` | `#A67B5B` | `secondary` |
| `muted` | `#F4F5F4` | `#2A2A2A` | `surfaceContainerLowest` |
| `muted-foreground` | `#78716C` | `#A1A1AA` | `onSurfaceVariant` |
| `accent` | `#FFF0D6` | `#332A1B` | `tertiaryContainer` |
| `destructive` | `#E11D48` | `#7F1D1D` | `error` |
| `border` | `#E5E5E5` | `#2A2A2A` | `outline` / dividers (0.5pt) |

Shadows: light `y4 / blur10 / 5%`, dark `y6 / blur15 / 40%`
(`AppShadows.cardOf`). Radius: 12 / 10 / 8 (`AppRadius`).

## Typography (all bundled in `assets/fonts/`, offline-safe)

| Usage | Family | Weights | Flutter |
|-------|--------|---------|---------|
| Latin UI | Poppins | 400/500/600/700 | `TextTheme`: display 34/700, title 22/600, headline 17/600, body 17/400, subhead 15/400, caption 12/400 |
| Display / numerals | Teko (variable) | 300–700 | `TekoText`, `tekoStyle()` |
| Home clock | Schluber | — | `schluberStyle()` (88sp, secondary) |
| Arabic script | Arabic Naskh (variable) | — | `ArabicText` (RTL, line-height 1.9) |

Rules: screens use `ThemedText` variants only — never raw `fontSize`.
Never cap `textScaler` globally; rows flex instead.

## Spacing & motion

4pt grid: `xs4 / sm8 / md16 / lg24 / xl32 / xxl48` (`AppSpacing`).
Screen edge padding = 16. Durations: fast 150 / base 250 / slow 400
(`AppMotion`). Animate transform/opacity only; wrap animated subtrees in
`RepaintBoundary` (see Qibla dial, seek-bar in Wave 2).

## Component contract (`lib/ui/core/`)

Variants (`primary/secondary/ghost/destructive`), sizes mapping to spacing
tokens, pressed/disabled/loading states on every tappable, accessibility
labels on icon-only controls. Do not wrap what the framework owns (`Switch`
styling lives in `SwitchTheme`, tab bar in `NavigationBarTheme`).
