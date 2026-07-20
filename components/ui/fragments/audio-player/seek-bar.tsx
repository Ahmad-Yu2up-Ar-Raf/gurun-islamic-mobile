import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { useAudioStore } from '@/components/ui/core/block/audio/store/use-audio-store';

export function SeekBar() {
  const playback = useAudioStore((s) => s.playback);
  const seekTo = useAudioStore((s) => s.seekTo);

  if (playback.status === 'idle' || playback.status === 'error') return null;

  const position = 'position' in playback ? playback.position : 0;
  const duration = 'duration' in playback ? playback.duration : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View className="w-full flex-row items-center gap-2 px-3">
      <Text className="font-poppins_regular text-xs text-muted-foreground">
        {formatTime(position)}
      </Text>
      <View className="flex-1">
        <Slider
          style={{ height: 32 }}
          minimumValue={0}
          maximumValue={Math.max(duration, 1)}
          value={position}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="#dc2626"
          maximumTrackTintColor="#363636"
          thumbTintColor="#dc2626"
        />
      </View>
      <Text className="font-poppins_regular text-xs text-muted-foreground">
        {formatTime(Math.max(duration - position, 0))}
      </Text>
    </View>
  );
}
