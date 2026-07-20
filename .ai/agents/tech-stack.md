# Tech Stack Agent — React Native / Expo

## Expo Router v4 (file-based)

- Routes mirror `app/` directory structure.
- Root layout (`app/_layout.tsx`) uses `Stack` with `headerShown: false` and `animation: 'slide_from_right'`.
- `(drawer)/_layout.tsx` wraps all top-level routes in a `Drawer` navigator.
- `(tabs)/_layout.tsx` defines bottom tab bar (Home, Quran, Qibla, Settings) with custom SVG icons.
- Standalone drawer screens: `doa/`, `dzikir/`, `hadist/`, `asmaul_husna.tsx`.
- Dynamic routes: `surah/[id].tsx`.
- `typedRoutes: true` enabled in `app.json` for type-safe navigation.
- Use `router.push()` from `expo-router` for programmatic navigation.

## NativeWind v4 + TailwindCSS v3

- Babel preset: `[['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel']`.
- Metro config: `withNativeWind(config, { input: './global.css', inlineRem: 16 })`.
- Dark mode via `.dark:root` CSS class — toggle with `useColorScheme()` from `nativewind`.
- Theme tokens are HSL CSS variables in `global.css` (`--primary`, `--secondary`, `--background`, etc.).
- Custom font families in `tailwind.config.js`: `poppins_*`, `teko_*`, `schluber`, `arabic`.
- CSS variables exposed via `tailwind.config.js` `colors` block mapping to `hsl(var(--<name>))`.
- Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for conditional classes.

## Zustand (client state)

- Feature-scoped stores next to their block in `store/use-<name>-store.ts`.
- Persist middleware for data that survives app restarts (location, preferences).
- Subscribe with selectors to prevent unnecessary re-renders:
  `const status = useLocationStore((s) => s.status)`.
- Zustand handles: location, theme preference, UI state. Never cache server data here.

## TanStack Query v5 (server state)

- Configured in `components/provider/provider.tsx`:
  - `staleTime: 60 * 1000` (1 min)
  - `gcTime: 5 * 60 * 1000` (5 min)
  - `retry: 1`
- Query keys follow convention: `['resource', ...params]` e.g. `['prayer-schedule', province, city, date]`.
- Prefetch on bootstrap in `useBootstrap()` for prayer schedule.
- Focus management via `AppState` listener → `focusManager.setFocused()`.
- Server functions live in `lib/server/<feature>/` alongside TanStack Query options.

## Ky (HTTP client)

- Singleton at `api/client.ts`.
- Base URL from `EXPO_PUBLIC_API_URL` env var, fallback to `https://equran.id/api/`.
- Default headers: `Accept: application/json`, `Content-Type: application/json`.

## Reanimated 4

- Animations run on UI thread via worklets.
- Logger configured `{ level: ReanimatedLogLevel.warn, strict: false }` to avoid strict mode warnings.
- Use `useSharedValue`, `useAnimatedStyle`, `withTiming`/`withSpring` for performant animations.
- Gesture handling via `react-native-gesture-handler` primitives.

## Clerk Auth

- OAuth/email authentication via `@clerk/clerk-expo`.
- Tokens stored in `expo-secure-store`.
- Auth session via `expo-auth-session` + `expo-web-browser`.

## Installed Skills (AI Agent Skills)

The project has the following AI skills available (loaded on-demand by OpenCode):

**External (`.agents/skills/`):**
- `code-reviewer` — Diff-aware code review before commit
- `react-native-best-practices` — RN bundle optimization, JS profiling, native profiling (Callstack)
- `vercel-react-native-skills` — RN/Expo best practices for performant mobile apps (Vercel)
- `expo-tailwind-setup` — Tailwind CSS configuration for Expo projects (Expo)
- `pr-description-writer` — PR body + test plan generation
- `skill-creator` — Scaffold new SKILL.md files for custom skills

**Custom (`.opencode/skills/`):**
- `nativewind-patterns` — NativeWind v4 + Tailwind v3 conventions
- `zustand-patterns` — Zustand with persist and selector best practices
- `reanimated-patterns` — Reanimated 4 worklet-based animations
- `react-query-patterns` — TanStack Query v5 patterns
- `ecc-brain` — Security, coding style, Git conventions
- `use-tinyfish` — Web search/fetch
- `expo-vibe-coder` — Expo-specific patterns

## Other conventions

- **Lists**: `@legendapp/list` for high-performance recycler views (avoids FlashList issues).
- **Fonts**: loaded in `app/_layout.tsx` via `useFonts` from `expo-font`. Custom fonts: Schluber.otf, NotoNaskhArabic.
- **Safe area**: `react-native-safe-area-context` for insets.
- **Navigation bar**: `expo-navigation-bar` for Android system bar styling.
- **Reanimated carousel**: `react-native-reanimated-carousel` for swipeable content.
