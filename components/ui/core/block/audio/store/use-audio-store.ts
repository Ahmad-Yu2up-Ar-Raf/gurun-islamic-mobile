import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from 'react-native-track-player';
import type { Surah } from '@/components/ui/core/block/surah/types/surah-type';
import {
  type PlaybackStatus,
  type QueueItem,
  type QueueState,
  type ReciterCode,
} from '@/components/ui/core/block/audio/types/audio-types';
import {
  buildSurahQueue,
  buildAyahQueue,
} from '@/components/ui/core/block/audio/services/surah-audio-service';

interface AudioStore {
  playback: PlaybackStatus;
  queue: QueueState;

  setPlaybackState: (state: PlaybackStatus) => void;
  setQueue: (queue: QueueState) => void;

  playAyah: (surah: Surah, ayahIndex: number) => Promise<void>;
  playSurah: (surah: Surah) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrevious: () => Promise<void>;
  stop: () => Promise<void>;
  setReciter: (code: ReciterCode) => void;
}

const DEFAULT_QUEUE: QueueState = {
  mode: 'surah',
  surahNumber: 1,
  reciterCode: '01',
  items: [],
  currentIndex: 0,
};

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      playback: { status: 'idle' },
      queue: { ...DEFAULT_QUEUE },

      setPlaybackState: (state) => set({ playback: state }),

      setQueue: (queue) => set({ queue }),

      playAyah: async (surah, ayahIndex) => {
        const { queue } = get();
        const reciter = queue.reciterCode;

        try {
          const items = buildAyahQueue(surah, reciter);

          if (ayahIndex < 0 || ayahIndex >= items.length) return;
          if (!items[ayahIndex].url) return;

          const track = items[ayahIndex];
          const isSameSurah = queue.surahNumber === surah.nomor;

          if (queue.mode === 'ayah' && isSameSurah && queue.items.length > 0) {
            /* Rule C: Same surah, different ayah — skip without reset */
            set({
              playback: { status: 'buffering', track },
              queue: { ...queue, items, currentIndex: ayahIndex },
            });
            await TrackPlayer.skip(ayahIndex);
            await TrackPlayer.play();
            return;
          }

          /* Rule B: Full Surah → Ayah  |  Rule D: Cross-surah Ayah → Ayah */
          set({
            playback: { status: 'loading', track },
            queue: {
              mode: 'ayah',
              surahNumber: surah.nomor,
              reciterCode: reciter,
              items,
              currentIndex: ayahIndex,
            },
          });

          await TrackPlayer.reset();
          await TrackPlayer.add(items);
          if (ayahIndex > 0) await TrackPlayer.skip(ayahIndex);
          await TrackPlayer.play();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Playback failed';
          set({ playback: { status: 'error', track: null, error: message } });
        }
      },

      playSurah: async (surah) => {
        const { queue } = get();
        const reciter = queue.reciterCode;

        try {
          const items = buildSurahQueue(surah, reciter);
          const track = items[0];

          if (!track.url) return;

          /* Rule A: Ayah → Full Surah (always reset — queue structure differs) */
          set({
            playback: { status: 'loading', track },
            queue: {
              mode: 'surah',
              surahNumber: surah.nomor,
              reciterCode: reciter,
              items,
              currentIndex: 0,
            },
          });

          await TrackPlayer.reset();
          await TrackPlayer.add(items);
          await TrackPlayer.play();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Playback failed';
          set({ playback: { status: 'error', track: null, error: message } });
        }
      },

      togglePlayPause: async () => {
        const { playback } = get();
        try {
          const state = await TrackPlayer.getPlaybackState();
          if (state.state === 'playing') {
            await TrackPlayer.pause();
          } else {
            await TrackPlayer.play();
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Toggle failed';
          set({
            playback:
              playback.status === 'error'
                ? playback
                : { status: 'error', track: null, error: message },
          });
        }
      },

      seekTo: async (position) => {
        const { playback } = get();
        if (playback.status === 'idle') return;

        set({
          playback:
            playback.status === 'playing' || playback.status === 'paused'
              ? { ...playback, status: 'seeking' as const }
              : playback,
        });

        try {
          await TrackPlayer.seekTo(position);
        } catch (error) {
          /* seek errors are non-critical — swallow */
        }
      },

      skipNext: async () => {
        const { queue } = get();
        if (queue.mode !== 'ayah' || queue.currentIndex >= queue.items.length - 1) return;

        const nextIndex = queue.currentIndex + 1;
        try {
          await TrackPlayer.skipToNext();
          set({
            queue: { ...queue, currentIndex: nextIndex },
          });
        } catch (error) {
          /* skip errors are non-critical */
        }
      },

      skipPrevious: async () => {
        const { queue } = get();
        if (queue.currentIndex <= 0) return;

        const prevIndex = queue.currentIndex - 1;
        try {
          await TrackPlayer.skipToPrevious();
          set({
            queue: { ...queue, currentIndex: prevIndex },
          });
        } catch (error) {
          /* skip errors are non-critical */
        }
      },

      stop: async () => {
        try {
          await TrackPlayer.reset();
        } catch (error) {
          /* stop errors are non-critical */
        }
        set({
          playback: { status: 'idle' },
          queue: { ...DEFAULT_QUEUE },
        });
      },

      setReciter: (code) =>
        set((state) => ({
          queue: { ...state.queue, reciterCode: code },
        })),
    }),
    {
      name: 'audio-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        reciterCode: state.queue.reciterCode,
        surahNumber: state.queue.surahNumber,
        lastPosition:
          state.playback.status === 'playing' || state.playback.status === 'paused'
            ? state.playback.position
            : 0,
      }),
    }
  )
);

/* ── Stable selectors ──────────────────────────────────────────────────── */
export const usePlayback = () => useAudioStore((s) => s.playback);
export const useQueue = () => useAudioStore((s) => s.queue);
export const useReciter = () => useAudioStore((s) => s.queue.reciterCode);
export const useCurrentTrack = () => {
  const playback = useAudioStore((s) => s.playback);
  if (playback.status === 'idle' || playback.status === 'error') return null;
  return playback.track;
};
