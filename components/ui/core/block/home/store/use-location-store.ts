// hooks/use-location-store.ts
//
// Single responsibility: hold the current location state. Nothing else.
// No fetching, no GPS logic — that lives in use-location-bootstrap.ts.
// Persisted (same pattern as use-bookmark-store.ts already in this project)
// so the app has a last-known location instantly on next launch, instead of
// flashing a hardcoded default while waiting for fresh GPS.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Coordinates, LocationState, LocationStatus } from '../types/prayer-types';

interface LocationStore extends LocationState {
  setLocation: (province: string, city: string, coordinates: Coordinates) => void;
  setStatus: (status: LocationStatus, error?: string | null) => void;
}

// Bogor fallback — mirrors the previous default used in use-prayer-context.tsx.
const DEFAULT_STATE: LocationState = {
  province: 'Jawa Barat',
  city: 'Kota Bogor',
  coordinates: { latitude: -6.595, longitude: 106.806 },
  status: 'idle',
  error: null,
};

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
      // Only persist raw state, never the action functions.
      partialize: (state) => ({
        province: state.province,
        city: state.city,
        coordinates: state.coordinates,
        status: state.status,
        error: state.error,
      }),
    }
  )
);

/* ── Stable selectors ────────────────────────────────────────────────────
 * Each selector reads exactly one field, so a component using only
 * `useProvince()` never re-renders when `coordinates` changes, etc.
 */
export const useProvince = () => useLocationStore((s) => s.province);
export const useCity = () => useLocationStore((s) => s.city);
export const useCoordinates = () => useLocationStore((s) => s.coordinates);
export const useLocationStatus = () => useLocationStore((s) => s.status);
