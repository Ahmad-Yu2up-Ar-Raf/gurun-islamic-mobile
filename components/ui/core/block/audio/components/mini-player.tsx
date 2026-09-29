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
      <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <View className="px-3 pt-2">
          <SeekBar />
        </View>
        <View className="flex-row items-center gap-3 px-3 py-2.5">
          <View className="size-11 items-center justify-center rounded-xl bg-primary/15">
            <Text className="font-teko_semibold text-xl leading-none text-secondary">
              {track.surahNomor}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open player for ${track.namaLatin}`}
            onPress={() => router.push('/player')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="font-poppins_semibold text-sm leading-tight text-foreground">
              {track.namaLatin}
            </Text>
            <Text
              numberOfLines={1}
              className="font-poppins_regular text-xs leading-tight text-muted-foreground">
              {status === 'error' ? 'Could not load — tap play to retry' : reciterLabel}
            </Text>
          </Pressable>
          <PlayerButton label={`Play previous surah`} onPress={() => commit(transport.prev)}>
            <Icon as={SkipBack} size={22} className="text-foreground" />
          </PlayerButton>
          <PlayerButton
            label={playing ? 'Pause recitation' : 'Play recitation'}
            primary
            onPress={handlePlay}>
            {busy ? (
              <ActivityIndicator size="small" className="text-primary-foreground" />
            ) : (
              <Icon as={playing ? Pause : Play} size={24} className="text-primary-foreground" />
            )}
          </PlayerButton>
          <PlayerButton label="Play next surah" onPress={() => commit(transport.next)}>
            <Icon as={SkipForward} size={22} className="text-foreground" />
          </PlayerButton>
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      className={cn('size-12 items-center justify-center rounded-full', primary && 'bg-primary')}>
      {children}
    </Pressable>
  );
}
