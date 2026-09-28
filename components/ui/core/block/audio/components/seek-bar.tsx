import * as React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, SharedValue } from 'react-native-reanimated';
import { useAudioProgressShared } from '../hooks/use-audio-player';

export function SeekBar() {
  const { progress } = useAudioProgressShared();
  const fillStyle = useAnimatedStyle(() => ({ width: `${(progress as any).value * 100}%` }));

  return (
    <View className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
      <Animated.View style={fillStyle} className="h-full rounded-full bg-primary" />
    </View>
  );
}
