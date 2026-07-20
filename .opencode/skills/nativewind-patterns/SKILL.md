---
name: nativewind-patterns
description: NativeWind v4 + TailwindCSS v3 conventions for Gurun Expo project
---

# NativeWind Patterns

## Setup

- Metro: `withNativeWind(config, { input: './global.css', inlineRem: 16 })`
- Babel: `['babel-preset-expo', { jsxImportSource: 'nativewind' }]`, `'nativewind/babel'`
- TypeScript: `nativewind-env.d.ts` with `/// <reference types="nativewind/types" />`
- Dark mode: `darkMode: 'class'` in tailwind.config — toggle via `useColorScheme()` from `nativewind`

## Styling Rules

- **Use `cn()` from `@/lib/utils`** for conditional classes: `cn('base', condition && 'active')`
- cn() combines `clsx` + `twMerge` for proper class merging
- **Never use inline `style={}`** unless required (Animated values, transform matrices)
- **Font families** use Tailwind classes: `font-poppins_regular`, `font-poppins_semibold`, `font-teko_bold`, `font-schluber`, `font-arabic`
- **Dark mode** via `.dark` class on root — CSS variables in `:root` and `.dark:root`

## Theme Tokens (global.css)

All colors are HSL CSS variables:
```css
--primary: 37.1014 100% 59.4118%;  /* Gold — stays same in dark mode */
--background: 26 54% 97%;           /* Warm cream (light) */
--background-dark: 0 0% 7%;         /* Near-black (dark) */
```

Access via Tailwind: `bg-background`, `text-primary`, `border-border`, `bg-secondary`

Available shadcn-style color tokens:
`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`

## Responsive & Platform

- Use `useColorScheme()` for theme — not `useWindowDimensions` for colors
- Platform-specific: `{Platform.OS === 'android' && ...}` in JSX, not CSS
- Safe area: `useSafeAreaInsets()` from `react-native-safe-area-context`

## Anti-patterns

- ❌ `className="text-primary text-lg"` → ✅ `cn('text-primary', 'text-lg')`
- ❌ Duplicating HSL values in components → ✅ Always reference via Tailwind class
- ❌ `style={{ color: '#333' }}` → ✅ `className="text-foreground"`
