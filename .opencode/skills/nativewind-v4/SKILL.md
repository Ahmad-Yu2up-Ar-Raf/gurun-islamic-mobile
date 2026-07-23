---
name: nativewind-v4
description: NativeWind v4 styling patterns with HSL theme and dark mode
---

# NativeWind v4 — Styling Patterns

## HSL Theme System

All color tokens live in `global.css` as HSL triplets consumed by `tailwind.config.js` via `hsl(var(--token))`. NativeWind v4 reads these through its Tailwind preset.

### Light (`:root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `26, 54%, 97%` | Warm cream page bg |
| `--foreground` | `0 0% 12.1569%` | Near-black body text |
| `--card` | `37, 79%, 89%` | Card/surface bg |
| `--card-foreground` | `0 0% 12.1569%` | Card text |
| `--popover` | `26, 54%, 97%` | Popover/dropdown bg |
| `--popover-foreground` | `0 0% 12.1569%` | Popover text |
| `--primary` | `37.1014 100% 59.4118%` | Gold/amber accent (buttons, links) |
| `--primary-foreground` | `26, 54%, 97%` | Text on primary bg |
| `--secondary` | `29.7391 74.1935% 30.3922%` | Dark amber accent |
| `--secondary-foreground` | `26, 54%, 97%` | Text on secondary bg |
| `--muted` | `60 4.8% 95.9%` | Subtle bg (code blocks, skeleton) |
| `--muted-foreground` | `25 5.3% 44.7%` | Muted/secondary text |
| `--accent` | `38.0488 100% 91.9608%` | Hover/active bg |
| `--accent-foreground` | `29.7391 74.1935% 30.3922%` | Text on accent bg |
| `--destructive` | `346.8367 77.1654% 49.8039%` | Red destructive actions |
| `--destructive-foreground` | `26, 54%, 97%` | Text on destructive |
| `--border` | `0 0% 89.8039%` | Card/input borders |
| `--input` | `26, 54%, 97%` | Input field bg |
| `--ring` | `37.1014 100% 59.4118%` | Focus ring (matches primary) |
| `--chart-1` | `37.1014 100% 59.4118%` | Chart series colors |
| `--chart-2` | `29.7391 74.1935% 30.3922%` | |
| `--chart-3` | `40.1575 100% 75.098%` | |
| `--chart-4` | `25.6 29.6443% 50.3922%` | |
| `--chart-5` | `48 96.6387% 76.6667%` | |
| `--sidebar` | `26, 54%, 97%` | Sidebar bg |
| `--sidebar-foreground` | `0 0% 12.1569%` | Sidebar text |
| `--sidebar-primary` | `37.1014 100% 59.4118%` | Sidebar accent |
| `--sidebar-primary-foreground` | `26, 54%, 97%` | Text on sidebar primary |
| `--sidebar-accent` | `30, 50%, 98%` | Sidebar hover state |
| `--sidebar-accent-foreground` | `0 0% 12.1569%` | Text on sidebar accent |
| `--sidebar-border` | `0 0% 89.8039%` | Sidebar borders |
| `--sidebar-ring` | `37.1014 100% 59.4118%` | Sidebar focus ring |

### Dark (` .dark:root`)

| Token | Value | Notes |
|-------|-------|-------|
| `--background` | `0 0% 7.0588%` | Near-black bg |
| `--foreground` | `30, 50%, 98%` | Warm off-white text |
| `--card` | `0 0% 11.7647%` | Dark card bg |
| `--card-foreground` | `30, 50%, 98%` | |
| `--popover` | `0 0% 11.7647%` | |
| `--popover-foreground` | `30, 50%, 98%` | |
| `--primary` | `37.1014 100% 59.4118%` | Same gold — primary unchanged |
| `--primary-foreground` | `0 0% 7.0588%` | Dark text on primary |
| `--secondary` | `25.6 29.6443% 50.3922%` | Muted/desaturated |
| `--secondary-foreground` | `26, 54%, 97%` | |
| `--muted` | `0 0% 16.4706%` | Dark muted bg |
| `--muted-foreground` | `240 5.0279% 64.902%` | Grayish muted text |
| `--accent` | `37.5 30.7692% 15.2941%` | Dark gold accent |
| `--accent-foreground` | `37.1014 100% 59.4118%` | Gold text on accent |
| `--destructive` | `0 62.8205% 30.5882%` | Darker red |
| `--destructive-foreground` | `30, 50%, 98%` | |
| `--border` | `0 0% 16.4706%` | Dark border |
| `--input` | `0 0% 11.7647%` | Dark input bg |
| `--ring` | `37.1014 100% 59.4118%` | Same gold ring |
| `--chart-1` | `37.1014 100% 59.4118%` | Chart — dark variant |
| `--chart-2` | `25.6 29.6443% 50.3922%` | |
| `--chart-3` | `32.1327 94.6188% 43.7255%` | |
| `--chart-4` | `43.2558 96.4126% 56.2745%` | |
| `--chart-5` | `20.9091 91.6667% 14.1176%` | |
| `--sidebar` | `0 0% 7.0588%` | |
| `--sidebar-foreground` | `30, 50%, 98%` | |
| `--sidebar-primary` | `37.1014 100% 59.4118%` | |
| `--sidebar-primary-foreground` | `0 0% 7.0588%` | |
| `--sidebar-accent` | `0 0% 16.4706%` | |
| `--sidebar-accent-foreground` | `30, 50%, 98%` | |
| `--sidebar-border` | `0 0% 16.4706%` | |
| `--sidebar-ring` | `37.1014 100% 59.4118%` | |

### Non-color Tokens

`--radius: 0.75rem` — border radius base. In tailwind config: `rounded-lg` = `var(--radius)`, `rounded-md` = `calc(var(--radius) - 2px)`, `rounded-sm` = `calc(var(--radius) - 4px)`.

`--shadow-*` — custom shadow stacks. Dark mode has deeper shadows (larger `--shadow-y`, higher `--shadow-opacity`).

## Usage in Components

Tokens become Tailwind utility classes via `tailwind.config.js`:

```tsx
<View className="bg-background p-4">
  <Text className="text-foreground font-poppins_regular">Body</Text>
</View>
<View className="bg-card">
  <Text className="text-card-foreground">Card title</Text>
</View>
<Button className="bg-primary" />
```

The `cn()` helper (`clsx` + `tailwind-merge`) resolves conflicts:

```tsx
import { cn } from '@/lib/utils';
cn('bg-background p-4', className) // className overrides
```

### Shadcn/ui Component Pattern

Components use `class-variance-authority` (cva) for variants:

- **Button**: Variants `default` (`bg-primary`), `destructive` (`bg-destructive`), `outline` (`border border-border bg-background`), `secondary` (`bg-secondary`), `ghost` (hover-only).
- **Card**: `bg-card` with `text-card-foreground` via `TextClassContext` provider.
- **Text**: Default `text-foreground` with variants `h1`-`h4`, `p`, `muted` (`text-muted-foreground`), `lead`, `large`, `small`, `code`.

Text component automatically uses `TextClassContext` from a parent (e.g. `<Card>` sets `text-card-foreground` so children inherit it).

## Dark Mode

`tailwind.config.js` sets `darkMode: 'class'`. The `.dark` class on root element (`<html>` DOM or RN view) toggles all theme variables.

### Common Patterns

```tsx
// Static dark bg
<View className="bg-white dark:bg-gray-900" />

// Using theme tokens (auto-switch via CSS variable)
<View className="bg-background" />            // light cream → dark near-black
<Text className="text-foreground" />           // near-black → off-white
<View className="border border-border" />      // light gray → dark gray

// Conditional via useColorScheme
import { useColorScheme } from 'nativewind';
const { colorScheme, toggleColorScheme } = useColorScheme();
// colorScheme: 'light' | 'dark'

// Token transparency modifiers
<View className="bg-primary/80" />              // 80% opacity primary
<View className="dark:bg-primary/20" />         // 20% primary only in dark
```

## Font Families

Defined in `tailwind.config.js` `theme.extend.fontFamily`. All classes use underscore separators matching the config key:

| Class | Font | Weight |
|-------|------|--------|
| `font-poppins_regular` | Poppins | 400 |
| `font-poppins_medium` | Poppins | 500 |
| `font-poppins_semibold` | Poppins | 600 |
| `font-poppins_bold` | Poppins | 700 |
| `font-teko_light` | Teko | 300 |
| `font-teko_regular` | Teko | 400 |
| `font-teko_medium` | Teko | 500 |
| `font-teko_semibold` | Teko | 600 |
| `font-teko_bold` | Teko | 700 |
| `font-schluber` | Schluber | custom |
| `font-arabic` | Noto Naskh Arabic | — |

`<Text>` component defaults to `font-poppins_regular`.

## Responsive Breakpoints

NativeWind uses Tailwind breakpoint utilities. On React Native these are **static** (based on screen width at mount, no live resize):

| Prefix | Min width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |

```tsx
// Tablet: side-by-side; phone: stacked
<View className="flex-col sm:flex-row" />
```

## When to Add a Token

1. Add HSL variable to both `:root` and `.dark:root` in `global.css`
2. Add mapping in `tailwind.config.js` `theme.extend.colors`
3. Use `bg-{name}` / `text-{name}-foreground` in components
