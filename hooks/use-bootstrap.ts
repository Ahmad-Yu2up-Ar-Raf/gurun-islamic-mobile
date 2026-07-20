import { useEffect, useState, useRef } from 'react';
import { useLocationBootstrap } from '@/components/ui/core/block/home/hooks/use-location-bootstrap';
import {
  useLocationStore,
  useLocationStatus,
} from '@/components/ui/core/block/home/store/use-location-store';
import { queryClient } from '@/components/provider/provider';
import { fetchJadwalShalat } from '@/components/ui/core/block/home/services/jadwal-service';
import { registerTrackPlayer } from '@/components/ui/core/block/audio/services/audio-track-service';

const BOOTSTRAP_TIMEOUT_MS = 10_000;

export function useBootstrap() {
  const [hydrated, setHydrated] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const status = useLocationStatus();

  useLocationBootstrap();

  useEffect(() => {
    const unsub = useLocationStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useLocationStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), BOOTSTRAP_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  const ready = hydrated && (status === 'ready' || status === 'error' || timedOut);

  const hasBootstrapped = useRef(false);
  useEffect(() => {
    if (ready && !hasBootstrapped.current) {
      hasBootstrapped.current = true;

      const { province, city } = useLocationStore.getState();
      if (province && city) {
        queryClient.prefetchQuery({
          queryKey: ['prayer-schedule', province, city, new Date().toDateString()],
          queryFn: () => fetchJadwalShalat(province, city),
          staleTime: 60 * 60 * 1000,
        });
      }

      registerTrackPlayer();
    }
  }, [ready]);

  return { isReady: ready, isBootstrapping: !ready };
}
