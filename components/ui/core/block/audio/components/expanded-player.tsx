import * as React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { LegendList } from '@legendapp/list';
import {
  FastForward,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Rewind,
  Shuffle,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { cn } from '@/lib/utils';
import { RECITERS } from '../data/reciters';
import { isReciterKey } from '../services/audio-service';
import type { AudioTrack } from '../types/audio-type';
import { useActiveTrack, useAudioStatus, useAudioStore } from '../store/use-audio-store';
import { useTransportControls } from '../hooks/use-audio-queue';
import { ReciterPicker } from './reciter-picker';
import { useAudioProgressShared } from '../hooks/use-audio-player';

const formatTime = (sec: number): string => {
  const clamped = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export function ExpandedPlayer() {
  const track = useActiveTrack();
  const status = useAudioStatus();
  const queue = useAudioStore((s) => s.queue ?? []);
  const index = useAudioStore((s) => s.index);

  return (
    <View className="flex-1 bg-background px-5 pb-8 pt-2">
      <View className="flex-row items-center justify-between pb-1">
        <Text className="font-poppins_semibold text-sm uppercase text-muted-foreground">
          Now Playing
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close player"
          hitSlop={12}
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Icon as={X} size={24} className="text-foreground" />
        </Pressable>
      </View>
      {!track ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Text className="font-poppins_medium text-base text-foreground">Nothing queued yet</Text>
          <Text className="font-poppins_regular text-sm text-muted-foreground">
            Open a surah and press play to start listening.
          </Text>
        </View>
      ) : (
        <LegendList
          data={queue}
          keyExtractor={(item) => (item as AudioTrack).audioUrl}
          estimatedItemSize={64}
          recycleItems={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListHeaderComponent={<PlayerChrome />}
          ListEmptyComponent={
            <View className="items-center py-6">
              <Text className="font-poppins_regular text-sm text-muted-foreground">
                Queue is empty.
              </Text>
            </View>
          }
          renderItem={({ item, index: rowIndex }) => (
            <QueueRow track={item as AudioTrack} rowIndex={rowIndex} active={rowIndex === index} />
          )}
        />
      )}
      {status === 'error' && track && <PlayerError />}
    </View>
  );
}

function PlayerChrome() {
  const track = useActiveTrack();
  const status = useAudioStatus();
  const positionSec = useAudioStore((s) => s.positionSec);
  const durationSec = useAudioStore((s) => s.durationSec);
  const bufferedSec = useAudioStore((s) => s.bufferedSec);
  const shuffle = useAudioStore((s) => s.shuffle);
  const repeat = useAudioStore((s) => s.repeat);
  const transport = useTransportControls();
  if (!track) return null;
  const playing = status === 'playing';
  const busy = status === 'loading' || status === 'buffering';
  const reciterLabel = isReciterKey(track.reciterKey)
    ? RECITERS[track.reciterKey].label
    : track.reciterKey;
  const tap = (action: () => void) => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Visual feedback stands alone.
    }
    action();
  };
  const skipBy = (delta: number) => transport.seekBy(delta);

  return (
    <View className="gap-4 pb-4">
      <View className="items-center gap-2 pt-2">
        <View className="size-44 items-center justify-center rounded-3xl bg-primary/15">
          <Text className="font-teko_semibold text-7xl leading-none text-secondary">
            {track.surahNomor}
          </Text>
        </View>
        <Text className="text-center font-arabic text-2xl text-foreground">{track.namaArab}</Text>
        <Text className="text-center font-poppins_semibold text-lg text-foreground">
          {track.namaLatin}
        </Text>
        <Text className="text-center font-poppins_regular text-sm text-muted-foreground">
          {reciterLabel} • {track.jumlahAyat} ayat
        </Text>
      </View>
      <SeekSlider positionSec={positionSec} durationSec={durationSec} bufferedSec={bufferedSec} />
      <View className="flex-row items-center justify-center gap-5">
        <ControlButton label="Back 10 seconds" onPress={() => tap(() => skipBy(-10))}>
          <Icon as={Rewind} size={24} className="text-foreground" />
        </ControlButton>
        <ControlButton label="Previous surah" onPress={() => tap(transport.prev)}>
          <Icon as={SkipBack} size={28} className="text-foreground" />
        </ControlButton>
        <ControlButton
          label={playing ? 'Pause recitation' : 'Play recitation'}
          primary
          large
          onPress={() => tap(transport.toggle)}>
          {busy ? (
            <ActivityIndicator size="small" className="text-primary-foreground" />
          ) : (
            <Icon as={playing ? Pause : Play} size={30} className="text-primary-foreground" />
          )}
        </ControlButton>
        <ControlButton label="Next surah" onPress={() => tap(transport.next)}>
          <Icon as={SkipForward} size={28} className="text-foreground" />
        </ControlButton>
        <ControlButton label="Forward 10 seconds" onPress={() => tap(() => skipBy(10))}>
          <Icon as={FastForward} size={24} className="text-foreground" />
        </ControlButton>
      </View>
      <View className="flex-row items-center justify-center gap-6">
        <ControlButton
          label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
          highlighted={shuffle}
          onPress={() => tap(transport.toggleShuffle)}>
          <Icon
            as={Shuffle}
            size={22}
            className={shuffle ? 'text-secondary' : 'text-muted-foreground'}
          />
        </ControlButton>
        <ControlButton
          label={`Repeat mode: ${repeat}`}
          highlighted={repeat !== 'off'}
          onPress={() => tap(transport.cycleRepeat)}>
          <Icon
            as={repeat === 'one' ? Repeat1 : Repeat}
            size={22}
            className={repeat !== 'off' ? 'text-secondary' : 'text-muted-foreground'}
          />
        </ControlButton>
      </View>
      <View className="gap-2">
        <Text className="font-poppins_semibold text-xs uppercase text-muted-foreground">
          Reciter
        </Text>
        <ReciterPicker />
      </View>
      <Text className="pt-1 font-poppins_semibold text-xs uppercase text-muted-foreground">
        Up next
      </Text>
    </View>
  );
}

function SeekSlider({
  positionSec,
  durationSec,
  bufferedSec,
}: {
  positionSec: number;
  durationSec: number;
  bufferedSec: number;
}) {
  const { progress } = useAudioProgressShared();
  const buffered = useSharedValue<number>(0);
  const trackWidth = React.useRef(0);

  React.useEffect(() => {
    if (durationSec > 0) {
      buffered.value = Math.min(1, Math.max(0, bufferedSec / durationSec));
    }
  }, [bufferedSec, durationSec]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  const bufferedStyle = useAnimatedStyle(() => ({ width: `${buffered.value * 100}%` }));
  const knobStyle = useAnimatedStyle(() => ({
    left: `${progress.value * 100}%`,
    transform: [{ translateX: -7 }],
  }));

  const seekToFraction = (locationX: number) => {
    if (trackWidth.current <= 0 || durationSec <= 0) return;
    const fraction = Math.min(1, Math.max(0, locationX / trackWidth.current));
    useAudioStore.getState().seekTo(fraction * durationSec);
  };

  return (
    <View className="gap-1.5">
      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel="Seek"
        accessibilityValue={{ now: Math.floor(positionSec), max: Math.floor(durationSec) }}
        onLayout={(e) => {
          trackWidth.current = e.nativeEvent.layout.width;
        }}
        onPress={(e) => seekToFraction(e.nativeEvent.locationX)}>
        <View className="h-6 justify-center">
          <View className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <Animated.View
              style={bufferedStyle}
              className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/40"
            />
            <Animated.View
              style={fillStyle}
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
            />
          </View>
          <Animated.View style={knobStyle} className="absolute size-3.5 rounded-full bg-primary" />
        </View>
      </Pressable>
      <View className="flex-row justify-between">
        <Text
          style={{ fontVariant: ['tabular-nums'] }}
          className="font-poppins_regular text-xs text-muted-foreground">
          {formatTime(positionSec)}
        </Text>
        <Text
          style={{ fontVariant: ['tabular-nums'] }}
          className="font-poppins_regular text-xs text-muted-foreground">
          {formatTime(durationSec)}
        </Text>
      </View>
    </View>
  );
}

const QueueRow = React.memo(function QueueRow({
  track,
  rowIndex,
  active,
}: {
  track: AudioTrack;
  rowIndex: number;
  active: boolean;
}) {
  const jump = () => useAudioStore.getState().setQueue(useAudioStore.getState().queue, rowIndex);
  const remove = () => useAudioStore.getState().removeTrack(rowIndex);

  return (
    <View className={cn('flex-row items-center gap-3 rounded-xl px-2 py-2', active && 'bg-accent')}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Play ${track.namaLatin}`}
        onPress={jump}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        className="min-w-0 flex-1 flex-row items-center gap-3">
        <Text
          style={{ fontVariant: ['tabular-nums'] }}
          className={cn(
            'w-8 text-center font-teko_medium text-lg',
            active ? 'text-secondary' : 'text-muted-foreground'
          )}>
          {track.surahNomor}
        </Text>
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className={cn(
              'font-poppins_medium text-sm',
              active ? 'text-secondary' : 'text-foreground'
            )}>
            {track.namaLatin}
          </Text>
          <Text numberOfLines={1} className="font-poppins_regular text-xs text-muted-foreground">
            {track.jumlahAyat} ayat
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove ${track.namaLatin} from queue`}
        hitSlop={8}
        onPress={remove}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
        <Icon as={X} size={18} className="text-muted-foreground" />
      </Pressable>
    </View>
  );
});

function PlayerError() {
  const track = useActiveTrack();
  const retry = () => {
    if (track) useAudioStore.getState().playTrack(track);
  };
  return (
    <View className="items-center gap-2 border-t border-border pt-3">
      <Text className="text-center font-poppins_regular text-sm text-muted-foreground">
        Could not load this recitation. Try another reciter.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retry playback"
        onPress={retry}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        className="rounded-full bg-primary px-5 py-2">
        <Text className="font-poppins_semibold text-sm text-primary-foreground">Retry</Text>
      </Pressable>
    </View>
  );
}

function ControlButton({
  children,
  label,
  primary = false,
  large = false,
  highlighted = false,
  onPress,
}: {
  children: React.ReactNode;
  label: string;
  primary?: boolean;
  large?: boolean;
  highlighted?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      className={cn(
        'items-center justify-center rounded-full',
        large ? 'size-16' : 'size-12',
        primary && 'bg-primary',
        highlighted && !primary && 'bg-accent'
      )}>
      {children}
    </Pressable>
  );
}
