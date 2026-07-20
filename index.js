import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from 'expo-router/entry';

TrackPlayer.registerPlaybackService(() =>
  require('./components/ui/core/block/audio/services/playback-service')
);

registerRootComponent(App);
