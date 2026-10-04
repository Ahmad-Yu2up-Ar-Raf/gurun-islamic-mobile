import * as React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router, usePathname } from 'expo-router';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  SlideInUp,
  SlideOutDown,
  useReducedMotion,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { cn } from '@/lib/utils';
import { RECITERS } from '../data/reciters';
import { isReciterKey } from '../services/audio-service';
import { useActiveTrack, useAudioStatus, useAudioStore } from '../store/use-audio-store';
import { useTransportControls } from '../hooks/use-audio-queue';
import { SeekBar } from './seek-bar';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
export const MiniPlayer = React.memo(function MiniPlayer() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const track = useActiveTrack();
  const status = useAudioStatus();
  const drawerOpen = useAudioStore((s) => s.drawerOpen);
  const positionSec = useAudioStore((s) => s.positionSec);
  const durationSec = useAudioStore((s) => s.durationSec);
  const transport = useTransportControls();

  const commit = React.useCallback((action: () => void) => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics unavailable — visual feedback stands alone.
    }
    action();
  }, []);

  const store = useAudioStore.getState();
  const handlePlay = React.useCallback(() => {
    if (status === 'error') return commit(() => store.playTrack(track));
    return commit(transport.toggle);
  }, [status, track, commit, transport, store]);

  const playing = status === 'playing';
  const busy = status === 'loading' || status === 'buffering';
  const reciterLabel = isReciterKey(track?.reciterKey ?? '')
    ? (RECITERS[track!.reciterKey as keyof typeof RECITERS]?.label ?? track!.reciterKey)
    : (track?.reciterKey ?? '');

  if (!track || drawerOpen || pathname === '/player') return null;

  return (
    <Animated.View
      entering={reducedMotion ? FadeIn.duration(150) : SlideInUp.duration(250)}
      exiting={reducedMotion ? FadeIn.duration(150) : SlideOutDown.duration(200)}
      pointerEvents="box-none"
      className="absolute inset-x-3"
      style={{ bottom: 70 + insets.bottom + 8 }}>
      <View className="overflow-hidden rounded-2xl bg-card">
        <View className="flex-row items-center gap-2 px-4 py-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open player for ${track.namaLatin}`}
            onPress={() => router.push('/player')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="font-poppins_semibold text-sm leading-tight text-secondary">
              {track.namaLatin}
            </Text>
            <Text
              numberOfLines={1}
              className="font-poppins_regular text-xs leading-tight text-muted-foreground">
              {status === 'error' ? 'Could not load — tap play to retry' : reciterLabel}
            </Text>
          </Pressable>
          <PlayerButton label={`Play previous surah`} onPress={() => commit(transport.prev)}>
            <Icon as={SkipBack} size={19} className="text-secondary" />
          </PlayerButton>
          <PlayerButton
            label={playing ? 'Pause recitation' : 'Play recitation'}
            primary
            onPress={handlePlay}>
            {busy ? (
              <ActivityIndicator size="small" className="text-primary-foreground" />
            ) : (
              <Icon
                as={playing ? Pause : Play}
                size={19}
                className="fill-primary-foreground text-primary-foreground"
              />
            )}
          </PlayerButton>
          <PlayerButton label="Play next surah" onPress={() => commit(transport.next)}>
            <Icon as={SkipForward} size={19} className="text-secondary" />
          </PlayerButton>
        </View>
        <View className="px-2">
          <SeekBar />
        </View>
      </View>
    </Animated.View>
  );
});

function PlayerButton({
  children,
  label,
  primary = false,
  onPress,
}: {
  children: React.ReactNode;
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      size={'icon'}
      variant={primary ? 'default' : 'ghost'}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      className={cn(
        'size-9 items-center justify-center rounded-full'
        //  && 'bg-primary active:bg-primary/60'
      )}>
      {children}
    </Button>
  );
}
