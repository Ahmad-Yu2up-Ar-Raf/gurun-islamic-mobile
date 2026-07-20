import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-react-native';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { SeekBar } from '@/components/ui/fragments/audio-player/seek-bar';
import {
  useAudioStore,
  usePlayback,
  useCurrentTrack,
} from '@/components/ui/core/block/audio/store/use-audio-store';

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 };

export function MiniPlayer() {
  const playback = usePlayback();
  const track = useCurrentTrack();
  const togglePlayPause = useAudioStore((s) => s.togglePlayPause);
  const skipNext = useAudioStore((s) => s.skipNext);
  const skipPrevious = useAudioStore((s) => s.skipPrevious);
  const stop = useAudioStore((s) => s.stop);

  const translateY = useSharedValue(300);
  const prevActive = useRef(false);

  const isActive = playback.status !== 'idle' && playback.status !== 'error';

  useEffect(() => {
    if (isActive && !prevActive.current) {
      translateY.value = withSpring(0, SPRING_CONFIG);
    } else if (!isActive && prevActive.current) {
      translateY.value = withSpring(300, SPRING_CONFIG);
    }
    prevActive.current = isActive;
  }, [isActive, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isPlaying = playback.status === 'playing' || playback.status === 'buffering';

  if (!isActive) return null;

  return (
    <Animated.View
      className="absolute bottom-16 left-0 right-0 z-50 mx-2 rounded-2xl border border-border bg-background/95 shadow-lg backdrop-blur"
      style={animatedStyle}>
      <View className="flex-row items-center gap-3 px-4 pt-3">
        <Pressable onPress={stop} className="p-1">
          <Icon as={X} className="size-4 text-muted-foreground" />
        </Pressable>

        <View className="flex-1">
          <Text className="font-poppins_semibold text-sm text-foreground" numberOfLines={1}>
            {track?.title ?? ''}
          </Text>
          <Text className="font-poppins_regular text-xs text-muted-foreground" numberOfLines={1}>
            {track?.artist ?? ''}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <Pressable onPress={skipPrevious} className="p-2">
            <Icon as={SkipBack} className="size-5 text-foreground" />
          </Pressable>
          <Pressable onPress={togglePlayPause} className="rounded-full bg-primary p-2.5">
            <Icon
              as={isPlaying ? Pause : Play}
              className="size-5 text-primary-foreground"
              fill="currentColor"
            />
          </Pressable>
          <Pressable onPress={skipNext} className="p-2">
            <Icon as={SkipForward} className="size-5 text-foreground" />
          </Pressable>
        </View>
      </View>

      <SeekBar />
    </Animated.View>
  );
}
