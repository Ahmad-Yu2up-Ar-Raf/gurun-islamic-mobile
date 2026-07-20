---
name: react-query-patterns
description: TanStack Query v5 conventions for Gurun Expo project
---

# TanStack Query Patterns

## Configuration

Configured in `components/provider/provider.tsx`:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,     // 1 minute
      gcTime: 5 * 60 * 1000,    // 5 minutes
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: 'online',
    },
  },
});
```

## Focus Management (React Native)

```typescript
import { focusManager } from '@tanstack/react-query';
import { AppState } from 'react-native';

// In Provider component:
useEffect(() => {
  const sub = AppState.addEventListener('change', (status) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  });
  return () => sub.remove();
}, []);
```

## Query Key Convention

```
['resource', ...params]
```

Examples:
- `['prayer-schedule', province, city, dateString]`
- `['surah-list']`
- `['surah-detail', surahId]`

## Prefetching

Prefetch on bootstrap so data loads immediately:
```typescript
queryClient.prefetchQuery({
  queryKey: ['prayer-schedule', province, city, today],
  queryFn: () => fetchJadwalShalat(province, city),
  staleTime: 60 * 60 * 1000, // 1 hour for prefetched data
});
```

## Server Functions & Options

- API calls: `block/<feature>/services/<name>-service.ts` or `lib/server/<feature>/`
- Query options: co-located with server functions (e.g. `lib/server/doa/doa-server-queris.ts`)
- HTTP client: Ky singleton at `api/client.ts` with env-based base URL

## Rules

- **Never store server data in Zustand** — TanStack Query handles caching
- `staleTime > 0` for all queries to avoid redundant network calls
- Use `networkMode: 'online'` — don't retry when offline (let user know)
- Error handling: wrap queryFn in try/catch, return user-friendly messages
- Mutations: use `onSuccess`/`onSettled` for cache invalidation
