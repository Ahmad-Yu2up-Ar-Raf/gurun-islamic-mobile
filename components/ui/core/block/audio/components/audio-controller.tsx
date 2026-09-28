import { useAudioPlaybackEngine } from '../hooks/use-audio-player';

export function AudioController() {
  useAudioPlaybackEngine();
  return null;
}
