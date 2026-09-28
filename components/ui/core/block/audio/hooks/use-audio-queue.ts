import * as React from 'react';
import { router } from 'expo-router';
import { queryClient } from '@/components/provider/provider';
import type { QuranResponse } from '../../quran/types/quran-type';
import type { Surah } from '../../surah/types/surah-type';
import type { RepeatMode } from '../types/audio-type';
import { buildQueue, toAudioTrackFromDetail } from '../services/audio-service';
import { useAudioStore } from '../store/use-audio-store';

const TRANSPORT_THROTTLE_MS = 350;
const REPEAT_ORDER: RepeatMode[] = ['off', 'all', 'one'];

export const runTransport = (action: () => void): boolean => {
  const now = Date.now();
  if (now - runTransport.lastTransportAt < TRANSPORT_THROTTLE_MS) return false;
  runTransport.lastTransportAt = now;
  action();
  return true;
};
runTransport.lastTransportAt = 0;

export function useTransportControls() {
  const lastTransportAtRef = React.useRef(0);
  const throttledAction = React.useCallback((action: () => void) => {
    const now = Date.now();
    if (now - lastTransportAtRef.current < TRANSPORT_THROTTLE_MS) return false;
    lastTransportAtRef.current = now;
    action();
    return true;
  }, []);

  return React.useMemo(
    () => ({
      toggle: () => throttledAction(() => useAudioStore.getState().toggle()),
      next: () => throttledAction(() => useAudioStore.getState().next()),
      prev: () => throttledAction(() => useAudioStore.getState().prev()),
      seekBy: (delta: number) =>
        throttledAction(() => {
          const { positionSec, seekTo } = useAudioStore.getState();
          seekTo(positionSec + delta);
        }),
      cycleRepeat: () =>
        throttledAction(() => {
          const { repeat, setRepeat } = useAudioStore.getState();
          setRepeat(REPEAT_ORDER[(REPEAT_ORDER.indexOf(repeat) + 1) % REPEAT_ORDER.length]);
        }),
      toggleShuffle: () => throttledAction(() => useAudioStore.getState().toggleShuffle()),
      selectReciter: (key: string) =>
        throttledAction(() => useAudioStore.getState().setReciter(key)),
    }),
    [throttledAction]
  );
}

export function usePlaySurah() {
  return React.useCallback((detail: Surah) => {
    const store = useAudioStore.getState();
    const reciterKey = store.reciterKey;
    const track = toAudioTrackFromDetail(detail, reciterKey);
    try {
      const cached = queryClient.getQueryData<QuranResponse>(['quran']);
      const list = cached?.data;
      if (list && list.length > 0) {
        const { queue } = buildQueue(list, detail.nomor, reciterKey);
        store.playTrack(track, queue);
      } else {
        store.playTrack(track);
      }
      router.push('/player');
    } catch {
      store.setError('Could not start playback.');
    }
  }, []);
}
