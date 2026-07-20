# State Management Strategy

## Decision: TanStack Query v5 (server) + Zustand (client)

**Context:** This project uses a dual state management approach. TanStack Query v5 handles all server-sourced data (prayer schedules, Quran, doa, hadist, asmaul husna). Zustand with persist middleware handles client-only state that needs to survive app restarts.

## Separation of Concerns

| Category | Tool | Examples |
|----------|------|---------|
| Server data | TanStack Query | Prayer schedule, surah list, surah detail, doa list, hadist, asmaul husna |
| Server cache invalidation | TanStack Query | refetch, staleTime, gcTime |
| Client state (persisted) | Zustand + persist | Location (province, city), bookmarks, user preferences |
| Client state (ephemeral) | Zustand or useState | UI state (open panels, active tab, animation progress) |
| Theme | NativeWind useColorScheme | Light/dark mode |

## Key Rules

1. **Never store server responses in Zustand** — TanStack Query handles caching, dedup, and background refetch
2. **Feature-scoped stores** — Each feature block owns its own Zustand store file in `store/use-<name>-store.ts`
3. **Selectors for performance** — Subscribe with `useStore((s) => s.field)` to prevent unnecessary re-renders
4. **persist for survival** — Only data that should survive app restart (location, bookmarks, preferences)
5. **Prefetch strategically** — Bootstrap prefetches prayer schedule; other data loads on screen mount

## Configuration

TanStack Query: `staleTime: 60s`, `gcTime: 5min`, `retry: 1`, focus management via `AppState`
Zustand: `createJSONStorage(() => AsyncStorage)` for React Native
