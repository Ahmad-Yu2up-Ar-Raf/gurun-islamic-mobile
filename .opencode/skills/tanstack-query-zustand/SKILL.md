---
name: tanstack-query-zustand
description: State management split — TanStack Query v5 for server state, Zustand for client state
---

# TanStack Query v5 + Zustand — State Patterns

## Architecture Split

| Concern | Tool | Why |
|---------|------|-----|
| Server/API data | TanStack Query v5 | Caching, refetch, stale-while-revalidate |
| Client-only state | Zustand (no persist) | UI state, ephemeral flags |
| Persisted client state | Zustand + persist middleware | Location, bookmarks, preferences |
| Auth | Clerk (`@clerk/clerk-expo`) | Dedicated auth provider |

## Project Setup

**Query client** in `components/provider/provider.tsx:16-33`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, gcTime: 300_000, retry: 1, retryDelay: 1000,
      refetchOnWindowFocus: true, refetchOnReconnect: true, refetchOnMount: true,
      networkMode: 'online' },
    mutations: { retry: 1, networkMode: 'online' },
  },
});
```

**Focus management:** `AppState` listener calls `focusManager.setFocused()` (provider.tsx:38-46).

**API client** at `api/client.ts` — Ky instance, base URL from `EXPO_PUBLIC_API_URL` (default `https://equran.id/api/`).

## TanStack Query Patterns

### Fetch with stale-while-revalidate

Override `staleTime` per query by data volatility:

```typescript
// Prayer schedule — 1hr stale (monthly data, never changes midday)
useQuery({
  queryKey: ['prayer-schedule', province, city, new Date().toDateString()],
  queryFn: () => fetchJadwalShalat(province, city),
  enabled: Boolean(province && city),
  staleTime: 60 * 60 * 1000,
  select: (data) => findTodayJadwal(data.jadwal, new Date()),
});

// Surah list — stable, uses global default (1min)
useQuery({ queryKey: ['quran'], queryFn: () => api.get('v2/surat').json<QuranResponse>() });

// Single surah detail
useQuery({ queryKey: ['surah', id], queryFn: () => api.get(`v2/surat/${id}`).json<SurahResponse>() });
```

**Recommended staleTime:** Prayer schedule: 1hr | Surah list: 30min | Single surah: 1hr | Qibla: 0 | Asmaul Husna: `Infinity`.

### React Query v5 specifics

- `queryKey` is a tuple — order determines cache hash. Prefix with domain, then unique IDs.
- `gcTime` replaces `cacheTime` (default 5min post-unmount).
- `select` transforms data client-side — avoids storing derived values in Zustand.
- `queryOptions` helper for reusable config (not yet in project):

```typescript
export const surahOptions = (id: string) => queryOptions({
  queryKey: ['surah', id],
  queryFn: () => api.get(`v2/surat/${id}`).json<SurahResponse>(),
  staleTime: 60 * 60 * 1000,
});
// useQuery(surahOptions(id))
```

### Mutation and invalidation

```typescript
useMutation({
  mutationFn: (data: BookmarkType) => api.post('bookmark', { json: data }).json(),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surah'] }),
});
```

### Optimistic updates

```typescript
useMutation({
  mutationFn: (id: string) => api.delete(`bookmark/${id}`),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
    const prev = queryClient.getQueryData(['bookmarks']);
    queryClient.setQueryData(['bookmarks'], (old: BookmarkType[]) => old.filter((b) => b.id !== id));
    return { prev };
  },
  onError: (_err, _id, ctx) => queryClient.setQueryData(['bookmarks'], ctx?.prev),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
});
```

### Prefetching

The bootstrap flow (`use-location-bootstrap`) resolves GPS → reverse-geocode → equran's wilayah API → writes `province`/`city` into `use-location-store`. The `usePrayerTime` query has `enabled: Boolean(province && city)`, so it auto-fires once location hydrates — this IS the prefetch.

For explicit prefetch (e.g. next surah):
```typescript
queryClient.prefetchQuery({
  queryKey: ['surah', nextId],
  queryFn: () => api.get(`v2/surat/${nextId}`).json<SurahResponse>(),
  staleTime: 60 * 60 * 1000,
});
```

### Error handling

- Global: `retry: 1, retryDelay: 1000` — fail fast on mobile.
- Per-query: override `retry` for critical endpoints.
- Global handler: `queryClient.getQueryCache().subscribe` for toast on errors.
- Offline: `networkMode: 'online'` fails immediately offline. Use `'offlineFirst'` if persisted cache is needed.

## Zustand Patterns

### Client-only state (no persist)

```typescript
const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
```

### Persisted state (canonical: `use-location-store.ts`)

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setLocation: (province, city, coordinates) =>
        set({ province, city, coordinates, status: 'ready', error: null }),
      setStatus: (status, error = null) => set({ status, error }),
    }),
    {
      name: 'location-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ /* whitelist fields to persist (not actions) */ }),
    }
  )
);

// Stable selectors — one field per selector, prevents unnecessary re-renders
export const useProvince = () => useLocationStore((s) => s.province);
export const useCity = () => useLocationStore((s) => s.city);
```

### Actions outside React

```typescript
// In async callbacks / services — no hook needed
const setStatus = useLocationStore.getState().setStatus;

// Module-level actions (bookmark store pattern)
export const addBookmark = (ayat: BookmarkType) =>
  useBookmarkStore.setState((s) => ({ Bookmark: [...s.Bookmark, ayat] }));
```

## Zustand + TanStack Query Bridge

| State lives on… | Use |
|-----------------|-----|
| Server (equran.id API) | TanStack Query |
| Device, survives restarts | Zustand + persist |
| Device, ephemeral | Zustand plain |

**Never** store API response data in Zustand. Need longer caching? Bump `staleTime` on the query. Zustand is for client-only state: location, bookmark IDs, UI flags, theme preference.

## Service Layer

Services (`services/*.ts`) are **pure async functions** — no React, no hooks, no state. They call the Ky `api` client and return typed data. Hooks wrap them with TanStack Query.

```typescript
export async function fetchJadwalShalat(provinsi: string, kabkota: string): Promise<JadwalShalatData> {
  const res = await api.post('v2/shalat', { json: { provinsi, kabkota } }).json<JadwalShalatResponse>();
  return res.data;
}
```
