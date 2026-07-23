---
name: expo-router-v4
description: Expo Router v4 file-based routing patterns for this project
---

# Expo Router v4 — Routing Patterns

## Architecture

This project uses Expo Router v4 file-based routing: `app/` directory maps to screens.

```
app/
├── _layout.tsx              # Root Stack
├── (drawer)/                # Drawer navigator group
│   ├── _layout.tsx          # Drawer layout
│   └── (tabs)/              # Tab navigator inside drawer
│       ├── _layout.tsx      # Tab layout
│       ├── index.tsx        # Home tab
│       ├── quran/           # Quran tab (folder for nested routes)
│       │   ├── _layout.tsx
│       │   └── index.tsx
│       ├── qibla.tsx        # Qibla tab
│       └── settings.tsx     # Settings tab
├── doa.tsx                  # Drawer screen
├── dzikir.tsx               # Drawer screen
├── hadist.tsx               # Drawer screen
├── asmaul-husna.tsx         # Drawer screen
├── surah/                   # Stack group
│   ├── _layout.tsx          # Surah stack layout
│   └── [id].tsx             # Dynamic route
├── +not-found.tsx           # 404 catch-all
└── +html.tsx                # Web HTML wrapper
```

**Key patterns:**

| Pattern | Code |
|---------|------|
| Stack → Drawer → Tabs | Three-level nesting via layouts |
| Dynamic routes | `surah/[id].tsx` → `/surah/114` |
| Drawer screens | Flat routes under root Stack, registered as `Drawer.Screen` |
| Tab groups | Routes inside `(tabs)/` — tabs at bottom |
| Typed routes enabled | `"experiments": { "typedRoutes": true }` in `app.json` |

## Deep Linking

**Scheme** is configured in `app.json` at `expo.scheme` (`"saraya"`).

```json
// app.json — scheme enables universal links
{
  "expo": {
    "scheme": "saraya",
    "experiments": { "typedRoutes": true }
  }
}
```

Navigate from external links: `saraya://surah/114` or `saraya://doa`. Expo Router auto-maps deep links to file paths. No manual linking config needed unless overriding.

**Linking config override** (if needed): pass `linking` to root `<Stack>`:

```tsx
<Stack
  linking={{
    prefixes: ['saraya://', 'https://gurun.app'],
    config: {
      screens: {
        '(drawer)': {
          screens: {
            '(tabs)': '',
            doa: 'doa',
            dzikir: 'dzikir',
            hadist: 'hadist',
            asmaul_husna: 'asmaul-husna',
          },
        },
        surah: 'surah/:id',
      },
    },
  }}
/>
```

## Auth Guard / Protected Routes

Clerk is available. Wrap root layout to protect all routes:

```tsx
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Stack, Redirect } from 'expo-router';

function ProtectedLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;
  return <Stack />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ProtectedLayout />
    </ClerkProvider>
  );
}
```

**Per-route guard** — same pattern in individual screens. **Auth routes** live in `app/(auth)/sign-in.tsx` / `sign-up.tsx` (outside ProtectedLayout).

## Modal & Form Sheet

**Expo Router v4** supports `presentation` on Stack screens:

```tsx
// In any _layout.tsx:
<Stack.Screen
  name="filter-modal"
  options={{
    presentation: 'modal',       // iOS modal from bottom
    animation: 'slide_from_bottom',
  }}
/>
```

Available presentation values: `'modal'`, `'formSheet'` (iOS), `'transparentModal'`, `'containedModal'`.

Create modals as flat files in `app/` or inside a `(modals)/` group:

```
app/(modals)/_layout.tsx   // Stack with modal screenOptions
app/(modals)/filter.tsx
```

Navigate: `router.push('/(modals)/filter')`.

## Tab vs Drawer Best Practices

| Use Case | Navigator |
|----------|-----------|
| Main app shell with hamburger menu | Drawer |
| Bottom navigation (primary destinations) | Tabs inside Drawer |
| Standalone full-screen screens (e.g., surah detail) | Stack (not in Drawer/Tabs) |

**Rules for this project:**

1. **Drawer** is the main navigator — holds the hamburger menu. All non-tab drawers (doa, dzikir, hadist, asmaul_husna) are `Drawer.Screen` entries in `(drawer)/_layout.tsx`.
2. **Tabs** live inside the drawer — 4 tabs (Home, Quran, Qibla, Settings). Use `<Tabs>` from `expo-router`, not `@react-navigation/bottom-tabs`.
3. **Standalone screens** (surah, modals) are outside `(drawer)/` in their own Stack.
4. **`headerShown: false` everywhere** — custom headers handled by `SCREEN_OPTIONS` helper.
5. `drawerItemStyle: { display: 'none' }` on all `Drawer.Screen` entries — custom drawer rendered via `drawerContent` prop.

## Dynamic Route Params & Typed Routes

**File-based params** — `surah/[id].tsx` creates a route `/surah/:id`.

```tsx
// app/surah/[id].tsx
import { useLocalSearchParams, Redirect } from 'expo-router';

// ✅ typed via generics — keys are strings
const { id, name } = useLocalSearchParams<{ id?: string; name?: string }>();
```

**Navigate with params:**

```tsx
router.push({
  pathname: '/surah/[id]',
  params: { id: '114', name: 'An-Nas' },
});
// → /surah/114?name=An-Nas
```

**`typedRoutes: true`** (enabled in `app.json`) — `router.push` and `<Link>` are type-checked against file routes. All paths autocomplete.

```tsx
<Link href="/doa">Doa</Link>               // ✅ typed
<Link href="/(drawer)/(tabs)/quran">Quran</Link> // ✅ typed
```

**`useGlobalSearchParams`** — for params from any screen in the navigation stack (e.g., deep links). Prefer `useLocalSearchParams` for current-route params.

| Hook | Scope |
|------|-------|
| `useLocalSearchParams` | Params for the current screen route |
| `useGlobalSearchParams` | Params from any screen in the stack |

## Adding a Screen

1. Create file in `app/` (e.g., `app/about.tsx`)
2. If inside a navigator group, put it in the right `(group)/` directory
3. If it needs params, use `[param].tsx` convention
4. If inside drawer, register it as `Drawer.Screen` in `(drawer)/_layout.tsx`
5. Link: `router.push('/path')` or `<Link href="/path">`
