---
name: zustand-patterns
description: Zustand state management conventions for Gurun Expo project
---

# Zustand Patterns

## Store Location

- Feature-scoped stores live next to their block: `components/ui/core/block/<feature>/store/use-<name>-store.ts`
- Shared stores: `lib/storage/` for cross-feature concerns

## Store Creation

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@/lib/storage/async-storage';

interface LocationState {
  province: string | null;
  city: string | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  setLocation: (province: string, city: string) => void;
}
```

## Selectors (Performance)

- **Always use selectors** to prevent unnecessary re-renders:
  ```typescript
  // ✅ Correct — only re-renders when `city` changes
  const city = useLocationStore((s) => s.city);
  ```
- ❌ Never `const { city, province } = useLocationStore()` in a frequently-rendering component
- For multiple values, use shallow comparison:
  ```typescript
  import { shallow } from 'zustand/shallow';
  const { city, province } = useLocationStore((s) => ({ city: s.city, province: s.province }), shallow);
  ```

## Persist Middleware

- Use for data that survives app restarts: location preferences, bookmarks, settings
- Storage: `createJSONStorage(() => AsyncStorage)` — never default `localStorage` (not available on RN)
- `onFinishHydration()` callback for bootstrap sequencing

```typescript
const useStore = create(
  persist(
    (set) => ({
      // ...state + actions
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ province: state.province, city: state.city }),
    }
  )
);
```

## Rules

- **Never store server data** in Zustand — use TanStack Query for server state
- Zustand is for: UI state (modals, panels), user preferences, cached location
- Actions update state immutably (spread, not mutate)
- Store interfaces should be flat — avoid nested objects in state
