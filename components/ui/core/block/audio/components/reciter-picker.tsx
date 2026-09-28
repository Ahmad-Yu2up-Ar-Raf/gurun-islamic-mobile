import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { cn } from '@/lib/utils';
import { RECITER_KEYS, RECITERS } from '../data/reciters';
import { useTransportControls } from '../hooks/use-audio-queue';
import { useAudioStore } from '../store/use-audio-store';

export const ReciterPicker = React.memo(function ReciterPicker() {
  const reciterKey = useAudioStore((s) => s.reciterKey);
  const transport = useTransportControls();

  return (
    <View className="flex-row flex-wrap gap-2">
      {RECITER_KEYS.map((key) => {
        const active = key === reciterKey;
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={`Reciter ${RECITERS[key].label}`}
            accessibilityState={{ selected: active }}
            onPress={() => transport.selectReciter(key)}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            className={cn(
              'rounded-full border px-3 py-1.5',
              active ? 'border-primary bg-primary/15' : 'border-border bg-card'
            )}>
            <Text
              className={cn(
                'font-poppins_medium text-xs',
                active ? 'text-secondary' : 'text-muted-foreground'
              )}>
              {RECITERS[key].label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});
