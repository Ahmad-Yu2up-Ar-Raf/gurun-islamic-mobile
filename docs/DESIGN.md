# Gurun — Design System

## Theme mode

- **Light**: default `:root` CSS variables.
- **Dark**: `.dark:root` class applied by NativeWind `useColorScheme()`.
- Toggle mechanism: system preference or manual `useColorScheme()` override.

## Color palette (HSL)

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `26 54% 97%` | `0 0% 7%` |
| `--foreground` | `0 0% 12%` | `30 50% 98%` |
| `--card` | `37 79% 89%` | `0 0% 12%` |
| `--primary` | `37 100% 59%` | `37 100% 59%` (same — gold anchor) |
| `--secondary` | `30 74% 30%` | `26 30% 50%` |
| `--muted` | `60 5% 96%` | `0 0% 16%` |
| `--accent` | `38 100% 92%` | `38 31% 15%` |
| `--destructive` | `347 77% 50%` | `0 63% 31%` |
| `--border` | `0 0% 90%` | `0 0% 16%` |
| `--radius` | `0.75rem` | `0.75rem` |

- Variables defined in `global.css`.
- Tailwind config maps these via `hsl(var(--<name>))`.
- React Navigation theme in `lib/theme.ts` maps `NAV_THEME` for native navigators.

## Typography

| Family | Weights | Usage |
|--------|---------|-------|
| **Poppins** | 400, 500, 600, 700 | Primary UI (body, labels, buttons) |
| **Teko** | 300, 400, 500, 600, 700 | Headings, display text |
| **Schluber** | 1 weight (custom) | Logo/brand texts |
| **Noto Naskh Arabic** | Variable (1 weight loaded) | Arabic script (Quran, Asmaul Husna) |

Loaded via `expo-font` in `app/_layout.tsx`. Font family names in Tailwind:
`poppins_regular`, `poppins_medium`, `poppins_semibold`, `poppins_bold`,
`teko_light`, `teko_regular`, `teko_medium`, `teko_semibold`, `teko_bold`,
`schluber`, `arabic`.

## Spacing & sizing

- Base unit: `0.25rem` (Tailwind default).
- Border radius: `--radius: 0.75rem` with `lg: var(--radius)`, `md: calc(var(--radius) - 2px)`, `sm: calc(var(--radius) - 4px)`.
- Shadows: custom shadow tokens in `global.css` (`--shadow-*`) with different opacity for light/dark modes.

## Icon system

- Custom SVG icon components at `components/ui/fragments/svg/`.
- Icons: Kabbah, Quran (book), Masjid (mosque), Home, Setting.
- Lucide React Native for any additional icons not covered by custom SVGs.

## Component library

21 shadcn/ui-inspired primitives at `components/ui/fragments/shadcn-ui/`:
- Text, Button, Card, Avatar, Badge, Switch, Tabs, Dialog, DropdownMenu,
  Popover, RadioGroup, Separator, Checkbox, Label, Portal, Slot, Input, etc.

Config in `components.json`:
- Style: `new-york`
- Aliases: `@/components/ui/fragments/shadcn-ui`, `@/lib/utils`
- Tailwind base color: `neutral`

## Navigation bar

- Expo Navigation Bar for Android system bar.
- Android edge-to-edge enabled (`edgeToEdgeEnabled: true` in `app.json`).
- `useAndroidSystemBars()` hook in root layout syncs bar style with theme.
