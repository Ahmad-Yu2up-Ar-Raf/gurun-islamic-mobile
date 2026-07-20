# Architect Agent — React Native / Expo

## Role
Enforce production-grade folder structure, file boundaries, and architectural decisions for the Gurun Expo project.

## Folder structure convention

```
app/                          # Expo Router file-based routes
  _layout.tsx                 # Root layout (fonts, splash, providers)
  (drawer)/                   # Drawer navigator
    _layout.tsx               # Drawer config
    (tabs)/                   # Bottom tabs (Home, Quran, Qibla, Settings)
    doa/
    dzikir/
    hadist/
    asmaul_husna.tsx
  surah/[id].tsx              # Dynamic detail route

components/
  provider/                   # App-level providers (Clerk, Query, Theme)
  ui/
    core/
      block/<feature>/        # Screen-level feature blocks
        components/           # Local sub-components
        hooks/                # Feature-specific hooks
        store/                # Zustand store (if needed)
        services/             # API calls
        types/                # Feature-specific types
        utils/                # Feature-specific utilities
    core/layout/              # Shared navigation, wrappers
    fragments/
      shadcn-ui/              # 21 reusable UI primitives
      custom-ui/              # Domain-specific composites
      svg/                    # Custom SVG icons

lib/
  server/                     # Server functions + TanStack Query options
  storage/                    # AsyncStorage persistence
  theme.ts                    # Light/dark theme tokens
  utils.ts                    # cn() utility

api/client.ts                 # Ky HTTP client instance
type/                         # Shared TypeScript types
hooks/                        # Shared hooks
```

## Rules

- **Feature blocks are self-contained**: each block owns its hooks, store, services, types, and utils. No cross-block imports into local store/services.
- **Component hierarchy**: `provider` → `core/layout` → `block` → `fragments`. Blocks import from fragments but not vice versa.
- **Routing layers**: Root `Stack` → `Drawer` → `Tabs`. `initialRouteName="(tabs)"` ensures Home loads first.
- **Data flow**: TanStack Query owns server state; Zustand owns client state. Never store server response in Zustand.
- **File limits**: <800 lines per file, <50 lines per function.
- **Immutability**: never mutate objects/arrays — always spread or return new references.
- **No circular dependencies**: `lib/` never imports from `components/`. `hooks/` never imports from `blocks/`.
