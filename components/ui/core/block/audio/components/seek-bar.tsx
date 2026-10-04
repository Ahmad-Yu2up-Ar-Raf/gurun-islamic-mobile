import * as React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useAudioProgressShared } from '../hooks/use-audio-player';

export function SeekBar() {
  const { progress } = useAudioProgressShared();
  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View className="h-1 w-full overflow-hidden rounded-full bg-primary/10">
      <Animated.View style={fillStyle} className="h-full rounded-full bg-primary" />
    </View>
  );
}
