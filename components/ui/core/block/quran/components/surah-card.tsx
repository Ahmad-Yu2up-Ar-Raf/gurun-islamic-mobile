import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import { Pressable, View, ViewProps } from 'react-native';

import Meccah from '../../../../fragments/svg/icons/makkah-icon';
import { Text } from '../../../../fragments/shadcn-ui/text';
import MasjidIcon from '../../../../fragments/svg/icons/masjid';
import { router } from 'expo-router';
import { SuraType } from '../types/quran-type';

type componentProps = ViewProps & {
  className?: string;
  sura: SuraType;
};

export function SurahCard({ className, sura, ...props }: componentProps) {
  const navigateToSurah = ({ id }: { id: number }) => {
    router.push({
      pathname: '/surah/[id]',
      params: { id: id, name: sura.namaLatin },
    });
  };

  return (
    <Card
      className={cn('w-full h-fit  my-0 p-0 overflow-hidden bg-background transition-all duration-200', className)}
      {...props}>
      <Pressable
        onPress={() => navigateToSurah({ id: sura.nomor })}
        className=" border-b py-7 border-border active:opacity-40">
        <CardContent className="h-full w-full flex-row items-center justify-between px-1">
          {/* LEFT content: flex 1 with right padding reserved for mosque */}
          <CardHeader className="relative z-40 w-fit flex-row items-center gap-6 p-0 py-0">
            <View className="relative size-10 content-center text-center">
              <Text className="absolute right-0.5 top-0.5 m-auto font-poppins_semibold text-3xl text-secondary">
                ۝
              </Text>
              <Text className="m-auto font-poppins_semibold text-xs text-secondary">
                {sura.nomor > 9 ? sura.nomor : sura.nomor}
              </Text>
            </View>
            <View className="gap-0">
              <CardTitle className="font-poppins_medium text-base tracking-tighter">
                {sura.namaLatin}
              </CardTitle>
              <View className="flex-row items-center gap-1">
                <Text className="ffont-poppins_medium text-sm text-muted-foreground">
                  {sura.tempatTurun}
                </Text>
                <Text
                  variant={'muted'}
                  className="font-poppins_medium text-sm text-muted-foreground/40">
                  •
                </Text>
                <CardDescription className="font-poppins_medium text-sm text-muted-foreground">
                  {sura.jumlahAyat} Ayah
                </CardDescription>
              </View>
            </View>
          </CardHeader>
          {/* FULL-WIDTH RADIAL GRADIENT (absolute, covers whole card width) */}
          <Text variant={'muted'} className="font-poppins_medium text-lg text-secondary">
            {sura.nama}
          </Text>
          {/* MOSQUE (absolute, right background) */}
        </CardContent>
      </Pressable>
    </Card>
  );
}
