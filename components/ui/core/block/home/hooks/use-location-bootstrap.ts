// hooks/use-location-bootstrap.ts
//
// Single responsibility: own the GPS → reverse-geocode → resolve-against-
// equran.id pipeline, and write the result into use-location-store.
//
// This replaces the old initializePrayerData()/<PrayerProvider> combo. It's
// a plain hook (not a Provider) — call it once near the app root and it does
// its job as a side effect. No wrapper component needed.

import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../store/use-location-store';
import { resolveOfficialRegion } from '../services/wilayah-service';

// Re-resolve location at most this often, to stay "synced with realtime GPS"
// without hammering reverse-geocode + equran's wilayah API on every tiny move.
const WATCH_DISTANCE_INTERVAL_METERS = 500;
const WATCH_TIME_INTERVAL_MS = 5 * 60 * 1000;

function cleanAddressPart(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/^Kecamatan\s+/i, '')
    .replace(/^Kabupaten\s+/i, '')
    .replace(/^Kota\s+/i, '')
    .trim();
}

async function resolveAndStore(coords: Location.LocationObjectCoords): Promise<void> {
  const setLocation = useLocationStore.getState().setLocation;

  const [place] = await Location.reverseGeocodeAsync(coords);
  const guessedProvince = cleanAddressPart(place?.region);
  const guessedCity = cleanAddressPart(place?.city ?? place?.subregion);

  if (!guessedProvince || !guessedCity) return;

  const resolved = await resolveOfficialRegion(guessedProvince, guessedCity);
  if (!resolved) return;

  setLocation(resolved.province, resolved.city, {
    latitude: coords.latitude,
    longitude: coords.longitude,
  });
}

/** Call once near the app root (e.g. inside the root layout component). */
export function useLocationBootstrap(): void {
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;
    const setStatus = useLocationStore.getState().setStatus;

    async function start() {
      setStatus('locating');
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setStatus('error', 'Izin lokasi ditolak');
          return;
        }

        const initialPosition = await Location.getCurrentPositionAsync({});
        if (cancelled) return;
        await resolveAndStore(initialPosition.coords);

        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: WATCH_DISTANCE_INTERVAL_METERS,
            timeInterval: WATCH_TIME_INTERVAL_MS,
          },
          (position) => {
            void resolveAndStore(position.coords);
          }
        );
      } catch {
        if (!cancelled) setStatus('error', 'Lokasi tidak tersedia, memakai lokasi default');
      }
    }

    start();

    return () => {
      cancelled = true;
      subscriptionRef.current?.remove();
    };
  }, []);
}
