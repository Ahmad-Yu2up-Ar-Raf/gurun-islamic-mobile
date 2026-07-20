import TrackPlayer, { Capability, Event, State } from 'react-native-track-player';

let isInitialized = false;

export async function registerTrackPlayer() {
  if (isInitialized) return;

  try {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
    });

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
    });

    isInitialized = true;
  } catch (error) {
    console.error('Failed to setup TrackPlayer:', error);
  }
}

export function mapTrackPlayerState(state: State | undefined): PlaybackStateLabel {
  switch (state) {
    case State.Playing:
      return 'playing';
    case State.Paused:
      return 'paused';
    case State.Buffering:
      return 'buffering';
    case State.Loading:
      return 'loading';
    case State.Stopped:
      return 'idle';
    case State.Ended:
      return 'completed';
    case State.Error:
      return 'error';
    default:
      return 'idle';
  }
}

type PlaybackStateLabel =
  'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'seeking' | 'completed' | 'error';
