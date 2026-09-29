import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AudioStatus, AudioTrack, RepeatMode } from '../types/audio-type';
import { DEFAULT_RECITER_KEY } from '../data/reciters';
import { remapQueueReciter } from '../services/audio-service';

interface AudioPlayerState {
  queue: AudioTrack[];
  index: number;
  reciterKey: string;
  status: AudioStatus;
  positionSec: number;
  durationSec: number;
  bufferedSec: number;
  shuffle: boolean;
  repeat: RepeatMode;
  errorMsg: string | null;
  playTrack: (track: AudioTrack, queue?: AudioTrack[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (sec: number) => void;
  setReciter: (key: string) => void;
  setQueue: (queue: AudioTrack[], index: number) => void;
  onStatus: (positionSec: number, durationSec: number, bufferedSec: number) => void;
  setStatus: (status: AudioStatus) => void;
  seekRequestSec: number | null;
  clearSeekRequest: () => void;
  removeTrack: (at: number) => void;
  setRepeat: (repeat: RepeatMode) => void;
  toggleShuffle: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  setError: (message: string) => void;
  clear: () => void;
}

const INITIAL_SESSION = {
  queue: [] as AudioTrack[],
  index: 0,
  status: 'idle' as AudioStatus,
  positionSec: 0,
  durationSec: 0,
  bufferedSec: 0,
  errorMsg: null as string | null,
  seekRequestSec: null as number | null,
};

export const useAudioStore = create<AudioPlayerState>()(
  persist(
    (set) => ({
      ...INITIAL_SESSION,
      reciterKey: DEFAULT_RECITER_KEY,
      shuffle: false,
      repeat: 'off' as RepeatMode,
      drawerOpen: false,
      playTrack: (track, queue) =>
        set(() => ({
          queue: queue ?? [track],
          index: queue
            ? Math.max(
                0,
                queue.findIndex((t) => t.audioUrl === track.audioUrl)
              )
            : 0,
          status: 'loading' as AudioStatus,
          positionSec: 0,
          durationSec: 0,
          bufferedSec: 0,
          errorMsg: null,
        })),
      toggle: () =>
        set((state) => {
          if (state.status === 'playing') return { status: 'paused' as AudioStatus };
          if (state.status === 'paused') return { status: 'playing' as AudioStatus };
          return {};
        }),
      next: () =>
        set((state) => {
          if (state.queue.length === 0) return {};
          const nextIndex = state.index + 1;
          if (nextIndex >= state.queue.length) {
            if (state.repeat !== 'all') return {};
            return { index: 0, status: 'loading' as AudioStatus, positionSec: 0 };
          }
          return { index: nextIndex, status: 'loading' as AudioStatus, positionSec: 0 };
        }),
      prev: () =>
        set((state) => {
          if (state.queue.length === 0) return {};
          if (state.positionSec > 3) return { positionSec: 0, seekRequestSec: 0 };
          return { index: Math.max(0, state.index - 1), positionSec: 0 };
        }),
      seekTo: (sec) =>
        set((state) => {
          const target = Math.min(Math.max(0, sec), state.durationSec || sec);
          return { positionSec: target, seekRequestSec: target };
        }),
      clearSeekRequest: () => set(() => ({ seekRequestSec: null })),
      setRepeat: (repeat) => set(() => ({ repeat })),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      setDrawerOpen: (open) => set(() => ({ drawerOpen: open })),
      removeTrack: (at) =>
        set((state) => {
          if (at < 0 || at >= state.queue.length) return {};
          const queue = state.queue.filter((_, i) => i !== at);
          if (queue.length === 0) return { ...INITIAL_SESSION };
          if (at > state.index) return { queue };
          if (at < state.index) return { queue, index: state.index - 1 };
          return {
            queue,
            index: Math.min(state.index, queue.length - 1),
            status: 'loading' as AudioStatus,
            positionSec: 0,
            errorMsg: null,
          };
        }),
      setReciter: (key) =>
        set((state) => ({
          reciterKey: key,
          queue: remapQueueReciter(state.queue, key),
        })),
      setQueue: (queue, index) =>
        set(() => ({
          queue,
          index: Math.min(Math.max(0, index), Math.max(0, queue.length - 1)),
          status: 'loading' as AudioStatus,
          positionSec: 0,
        })),
      onStatus: (positionSec, durationSec, bufferedSec) =>
        set(() => ({ positionSec, durationSec, bufferedSec })),
      setStatus: (status) => set(() => ({ status })),
      setError: (message) => set(() => ({ status: 'error' as AudioStatus, errorMsg: message })),
      clear: () => set(() => ({ ...INITIAL_SESSION })),
    }),
    {
      name: 'audio-player-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        reciterKey: state.reciterKey,
        shuffle: state.shuffle,
        repeat: state.repeat,
        lastSurahNomor: state.queue[state.index]?.surahNomor ?? null,
        lastPositionSec: state.positionSec,
      }),
    }
  )
);

export const useAudioQueue = () => useAudioStore((s) => s.queue ?? []);
export const useAudioIndex = () => useAudioStore((s) => s.index);
export const useActiveTrack = () => useAudioStore((s) => (s.queue ?? [])[s.index] ?? null);
export const useAudioStatus = () => useAudioStore((s) => s.status);
export const useAudioPosition = () => useAudioStore((s) => s.positionSec);
export const useAudioReciterKey = () => useAudioStore((s) => s.reciterKey);
export const useAudioProgress = () =>
  useAudioStore(
    useShallow((s) => ({
      positionSec: s.positionSec,
      durationSec: s.durationSec,
      bufferedSec: s.bufferedSec,
    }))
  );
export const useAudioDrawerOpen = () => useAudioStore((s) => s.drawerOpen);
