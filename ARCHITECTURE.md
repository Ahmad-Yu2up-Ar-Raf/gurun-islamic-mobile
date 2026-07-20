# Gurun — Architecture Guide

## Routing tree

```
Stack (root)
├── (drawer)                           # Drawer navigator (swipeable sidebar)
│   ├── (tabs)                         # Bottom tab navigator
│   │   ├── index                      # Home — prayer times, countdown
│   │   ├── quran                      # Surah listing
│   │   ├── qibla                      # Qibla compass
│   │   └── settings                   # App settings
│   ├── doa                            # Daily duas (drawer screen)
│   ├── dzikir                         # Dhikr counter (drawer screen)
│   ├── hadist                         # Hadith collection (drawer screen)
│   └── asmaul_husna                   # 99 Names of Allah (drawer screen)
└── surah/[id]                         # Surah detail (pushed on stack)
```

- `initialRouteName="(tabs)"` in Drawer — Home loads first.
- All screens have `headerShown: false` — custom headers handled within blocks.
- Stack uses `animation: 'slide_from_right'` for native-feel transitions.

## Bootstrap flow

```
app/_layout.tsx
  1. Prevent splash auto-hide
  2. Configure Reanimated logger (warn, strict: false)
  3. Load fonts (Poppins ×4, Teko ×5, Schluber, Arabic) via useFonts
  4. useAndroidSystemBars() — navigation bar color syncs with theme
  5. useBootstrap():
     a. Hydrate location Zustand store (persisted province/city or GPS)
     b. Wait for hydration + fonts
     c. Pre-fetch prayer schedule via TanStack Query
     d. Hide splash screen
  6. Render Provider → Stack → PortalHost
```

## State strategy

| Concern | Tool | Location |
|---------|------|----------|
| Server data (Quran, doa, hadist, asmaul husna) | TanStack Query v5 | `lib/server/<feature>/` |
| Prayer schedule | TanStack Query v5 (prefetched on bootstrap) | `block/home/services/` |
| Client location (province, city) | Zustand + persist | `block/home/store/` |
| Theme preference | NativeWind `useColorScheme()` | Global |
| Auth tokens | Clerk + SecureStore | `components/provider/` |

## Feature block structure

Each feature follows the same pattern:

```
block/<feature>/
├── components/       # Local UI sub-components
├── hooks/            # Feature-specific hooks (e.g. useLocationBootstrap)
├── store/            # Zustand store (client state only)
├── services/         # API call functions
├── types/            # TypeScript interfaces
└── utils/            # Pure utility functions
```

Examples: `home/`, `qibla/`, `quran/`, `surah/`.

## Data layers

```
Screen (app/ route)
  └── Block (components/ui/core/block/<feature>/<feature>-block.tsx)
      ├── hooks/use-<feature>.ts       → TanStack Query useQuery/useMutation
      ├── services/<feature>-service.ts → calls api/client.ts (Ky)
      └── store/use-<feature>-store.ts  → Zustand (client state only)
```

## API layer

- Single Ky instance at `api/client.ts` with base URL from `EXPO_PUBLIC_API_URL`.
- API functions in `block/<feature>/services/` or `lib/server/<feature>/`.
- TanStack Query options co-located with server functions (e.g. `lib/server/doa/doa-server-queris.ts`).

## Component layer hierarchy

```
Provider (Clerk, TanStack Query, Theme)
  └── Core Layout (Drawer, Tabs, navigation)
      └── Feature Block (screen-level)
          └── Fragments (shadcn-ui / custom-ui / svg)
```

- `shadcn-ui/` — 21 reusable primitives (button, text, card, etc.)
- `custom-ui/` — domain-specific composite components
- `svg/` — custom icon components (Kabbah, Masjid, Quran, Home, Settings)
