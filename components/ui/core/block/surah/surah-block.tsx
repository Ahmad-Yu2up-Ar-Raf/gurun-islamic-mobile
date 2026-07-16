import React from 'react';

import { Text } from '../../../fragments/shadcn-ui/text';
import { useQuery } from '@tanstack/react-query';
import { LegendList } from '@legendapp/list';
import Animated from 'react-native-reanimated'; // Import Reanimated
import { AyatCard } from './components/ayat-card';
import { SuraHeader } from './components/sura-header';
import { ChevronLeft, MoreHorizontal, Settings, Settings2 } from 'lucide-react-native';
import { SCREEN_OPTIONS } from '../../layout/nav';
import { router, Stack } from 'expo-router';

import LoadingIndicator from '../../loading-indicator';

import { useScrollTracker } from '@/hooks/use-scroll-tracker';

import SuraMenu from './components/sura-menu';
import { useBottomSheet } from '@/components/ui/fragments/custom-ui/bottom-sheet';
import { FetchSurah } from './hooks/use-surah';
import { Ayah } from './types/surah-type';

// ✅ Bungkus LegendList biar support Reanimated
const AnimatedLegendList = Animated.createAnimatedComponent(LegendList);

type ComponentProp = {
  id: string;
  nameSurah: string;
};

export default function SurahBlock({ id, nameSurah }: ComponentProp) {
  const { isLoading, data, refetch, isError, error, isRefetching } = FetchSurah(id);
  const { isVisible, open, close } = useBottomSheet();
  const surah = data?.data;
  const ayahs = surah?.ayat;
  const { scrollY, scrollHandler } = useScrollTracker();

  if (isLoading)
    return (
      <>
        <LoadingIndicator loadingText="Memuat data surah..." />
      </>
    );

  if (isError || !data) {
    return <></>;
  }

  return (
    <>
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: nameSurah,
          rightAction() {
            open();
          },
          leftIcon: ChevronLeft,
          rightIcon: Settings,
          scrollAnimatedPosition: scrollY,
          scrollTriggerPoint: 80,
          scrollAnimationType: 'slide',
        })}
      />
      <SuraMenu sura={data} isVisible={isVisible} close={close} />
      <AnimatedLegendList
        data={ayahs ?? []}
        renderItem={({ item }) => (
          <AyatCard surahNomor={id} surahNama={nameSurah} ayat={item as Ayah} />
        )}
        keyExtractor={(item: unknown, index: number) => `ayat-${(item as Ayah).nomorAyat}`}
        numColumns={1}
        // ✅ NAIKKAN JADI 900 ATAU 1000.
        // Ini memastikan "scroll budget" cukup menampung ayat-ayat raksasa di Al-Baqarah.
        estimatedItemSize={900}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <SuraHeader
            kategori={surah?.tempatTurun}
            namaLatin={surah?.namaLatin}
            arti={surah?.arti}
            jumlahAyat={surah?.jumlahAyat}
          />
        }
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
          paddingHorizontal: 12,
        }}
        className="px-6"
        recycleItems={true}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}
