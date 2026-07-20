import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';

import { BasmallahDark, Basmallah } from '../../../../fragments/svg/basmalah';
import { useColorScheme } from 'nativewind';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { CirclePlay } from 'lucide-react-native';
import { useAudioStore, usePlayback } from '@/components/ui/core/block/audio/store/use-audio-store';
import type { Surah } from '@/components/ui/core/block/surah/types/surah-type';

type componentProps = ViewProps & {
  className?: string;
  namaLatin: string | undefined;
  arti: string | undefined;
  kategori: string | undefined;
  jumlahAyat: number | undefined;
  surah?: Surah;
};

export function SuraHeader({
  className,
  namaLatin,
  arti,
  kategori,
  jumlahAyat,
  surah,
  ...props
}: componentProps) {
  const { colorScheme } = useColorScheme();
  const playSurah = useAudioStore((s) => s.playSurah);
  const playback = usePlayback();
  const currentTheme = colorScheme ?? 'light';

  const isPlayingThis =
    surah != null &&
    playback.status !== 'idle' &&
    playback.status !== 'error' &&
    'track' in playback &&
    playback.track?.surahNumber === surah.nomor;

  const handlePlaySurah = () => {
    if (surah) playSurah(surah);
  };

  return (
    <Card className={cn('mb-5 w-full p-0 pb-0 pt-4', className)} {...props}>
      <CardContent className="h-fit w-full gap-2 p-0">
        <CardHeader className="relative z-40 w-full gap-2 px-0 py-0 text-center">
          <CardTitle className="text-center font-poppins_semibold text-2xl tracking-tighter text-secondary">
            {namaLatin}
          </CardTitle>

          <CardDescription className="px-16 text-center font-poppins_medium text-xs text-muted-foreground">
            {arti} • {jumlahAyat} Ayah
          </CardDescription>
        </CardHeader>
        <View className="w-full flex-row items-center justify-center gap-2.5 text-center">
          <View>
            {currentTheme === 'light' ? (
              <Basmallah className="w-3/4" />
            ) : (
              <BasmallahDark className="w-3/4" />
            )}
          </View>
        </View>

        {surah && (
          <View className="mt-4 flex-row items-center justify-center">
            <Button
              onPress={handlePlaySurah}
              variant={isPlayingThis ? 'default' : 'outline'}
              className="flex-row items-center gap-2 rounded-full px-6 py-2">
              <Icon as={CirclePlay} className="size-5" />
              <CardDescription className="font-poppins_semibold text-sm">
                {isPlayingThis ? 'Memutar...' : 'Putar Surah'}
              </CardDescription>
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
}
