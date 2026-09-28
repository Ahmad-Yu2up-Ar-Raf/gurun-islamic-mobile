import * as React from 'react';
import Constants from 'expo-constants';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { toLockScreenMetadata } from '../services/audio-service';
import type { AudioTrack } from '../types/audio-type';
import { useAudioStore } from '../store/use-audio-store';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

const IN_EXPO_GO = Constants.appOwnership === 'expo';
const PUMP_DELTA_SEC = 0.8;
const PUMP_INTERVAL_MS = 1000;

let globalProgressSharedValue: SharedValue<number> | null = null;
let globalDurationSharedValue: SharedValue<number> | null = null;

function getGlobalProgress() {
  if (!globalProgressSharedValue) {
    globalProgressSharedValue = useSharedValue<number>(0);
    globalDurationSharedValue = useSharedValue<number>(0);
  }
  return { progress: globalProgressSharedValue, duration: globalDurationSharedValue };
}

const activateLockScreen = (player: ReturnType<typeof useAudioPlayer>, track: AudioTrack) => {
  if (IN_EXPO_GO) {
    console.warn(
      '[audio] Lock-screen controls unavailable in Expo Go — playback continues without them. Use a dev build for background services.'
    );
    return;
  }
  try {
    player.setActiveForLockScreen(true, toLockScreenMetadata(track));
  } catch (error) {
    console.warn('[audio] Failed to activate lock-screen controls:', error);
  }
};

export function useAudioPlaybackEngine() {
  const player = useAudioPlayer(undefined, { updateInterval: PUMP_INTERVAL_MS });
  const playerStatus = useAudioPlayerStatus(player);
  const { progress, duration } = getGlobalProgress();
  const loadedUrlRef = React.useRef<string | null>(null);
  const finishedUrlRef = React.useRef<string | null>(null);
  const lastPumpRef = React.useRef<{ url: string | null; position: number; duration: number }>({
    url: null,
    position: -1,
    duration: -1,
  });
  const queue = useAudioStore((s) => s.queue);
  const index = useAudioStore((s) => s.index);
  const status = useAudioStore((s) => s.status);
  const seekRequestSec = useAudioStore((s) => s.seekRequestSec);
  const track = queue[index] ?? null;

  React.useEffect(() => {
    try {
      void setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
    } catch {
      useAudioStore.getState().setError('Audio session unavailable on this device.');
    }
  }, []);

  React.useEffect(() => {
    const store = useAudioStore.getState();
    if (!track) {
      if (loadedUrlRef.current) {
        loadedUrlRef.current = null;
        try {
          player.pause();
          player.clearLockScreenControls();
        } catch {
          store.setError('Could not stop playback.');
        }
      }
      return;
    }
    const sourceChanged = loadedUrlRef.current !== track.audioUrl;
    try {
      if (status === 'loading' || sourceChanged) {
        if (status === 'loading') finishedUrlRef.current = null;
        if (sourceChanged) {
          player.replace({ uri: track.audioUrl });
          loadedUrlRef.current = track.audioUrl;
          finishedUrlRef.current = track.audioUrl;
          activateLockScreen(player, track);
        }
        if (status !== 'paused' && !player.playing) player.play();
      } else if (status === 'paused') {
        if (player.playing) player.pause();
      } else if (status === 'playing' && !player.playing) {
        player.play();
      }
    } catch {
      store.setError('Could not load this recitation. Try another reciter.');
    }
  }, [player, track, status]);

  React.useEffect(() => {
    if (seekRequestSec == null) return;
    try {
      void player
        .seekTo(seekRequestSec)
        .catch(() => useAudioStore.getState().setError('Could not seek.'));
    } catch {
      useAudioStore.getState().setError('Could not seek.');
    }
    useAudioStore.getState().clearSeekRequest();
  }, [player, seekRequestSec]);

  React.useEffect(() => {
    const store = useAudioStore.getState();
    if (playerStatus.error) {
      store.setError(playerStatus.error);
      return;
    }
    const dur = playerStatus.duration || 0;
    const lastPump = lastPumpRef.current;
    const trackUrl = track?.audioUrl ?? null;
    const positionMoved = Math.abs(playerStatus.currentTime - lastPump.position) >= PUMP_DELTA_SEC;
    if (
      trackUrl !== lastPump.url ||
      positionMoved ||
      dur !== lastPump.duration ||
      playerStatus.didJustFinish
    ) {
      lastPumpRef.current = { url: trackUrl, position: playerStatus.currentTime, duration: dur };
      store.onStatus(playerStatus.currentTime, dur, dur);
      if (progress && duration) {
        progress.value = dur > 0 ? playerStatus.currentTime / dur : 0;
        duration.value = dur;
      }
    }
    if (playerStatus.playing && finishedUrlRef.current) finishedUrlRef.current = null;
    if (playerStatus.didJustFinish && track && finishedUrlRef.current !== track.audioUrl) {
      finishedUrlRef.current = track.audioUrl;
      advanceAfterFinish(player);
    } else if (
      playerStatus.playing &&
      (store.status === 'loading' || store.status === 'buffering')
    ) {
      store.setStatus('playing');
    } else if (playerStatus.isBuffering && store.status === 'playing') {
      store.setStatus('buffering');
    }
  }, [player, playerStatus, track]);
}

const advanceAfterFinish = (player: ReturnType<typeof useAudioPlayer>) => {
  const store = useAudioStore.getState();
  const { queue, index, repeat, shuffle } = store;
  if (queue.length === 0) return;
  if (repeat === 'one' && queue[index]) {
    try {
      void player.seekTo(0).then(() => player.play());
      store.setStatus('playing');
    } catch {
      store.setError('Could not replay this recitation.');
    }
    return;
  }
  if (shuffle && queue.length > 1) {
    const pool = queue.map((_, i) => i).filter((i) => i !== index);
    store.setQueue(queue, pool[Math.floor(Math.random() * pool.length)]);
    return;
  }
  const atEnd = index + 1 >= queue.length;
  if (atEnd && repeat !== 'all') {
    store.setStatus('paused');
    return;
  }
  store.next();
};

export function useAudioProgressShared() {
  return getGlobalProgress();
}
