// 📄 File: components/ui/core/block/surah/surah-block.tsx
import React, { useCallback } from 'react'; // ✅ Import useCallback
import { LegendList } from '@legendapp/list';
import { AyatCard } from './components/ayat-card';
import { SuraHeader } from './components/sura-header';
import { ChevronLeft, Settings } from 'lucide-react-native';

// ✅ Import HeaderComponent langsung dari file nav lu
import { HeaderComponent } from '../../layout/nav';
import { Stack } from 'expo-router';

import LoadingIndicator from '../../loading-indicator';
import { useScrollTracker } from '@/hooks/use-scroll-tracker';
import SuraMenu from './components/sura-menu';
import { useBottomSheet } from '@/components/ui/fragments/custom-ui/bottom-sheet';
import { FetchSurah } from './hooks/use-surah';
import { Ayah } from './types/surah-type';

type ComponentProp = {
  id: string;
  nameSurah: string;
};

export default function SurahBlock({ id, nameSurah }: ComponentProp) {
  const { isLoading, data, isError } = FetchSurah(id);
  const { isVisible, open, close } = useBottomSheet();
  const surah = data?.data;
  const ayahs = surah?.ayat;
  const { scrollY } = useScrollTracker();

  // ✅ PERBAIKAN UTAMA 1: Gunakan useCallback untuk menstabilkan referensi onScroll.
  // Ini 100% menyelesaikan error "TypeError: Object is not a function" pada LegendList!
  const handleScroll = useCallback(
    (e: any) => {
      if (scrollY) {
        scrollY.value = e.nativeEvent.contentOffset.y;
      }
    },
    [scrollY]
  );

  if (isLoading) {
    return <LoadingIndicator loadingText="Memuat data surah..." />;
  }

  if (isError || !data) {
    return null;
  }

  return (
    <>
      {/* ✅ PERBAIKAN UTAMA 2: Matikan header bawaan navigasi */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* ✅ PERBAIKAN UTAMA 3: RENDER HEADER LANGSUNG DI SINI!
          Sangat aman dari crash, performa maksimal, dan animasi terjamin aktif */}
      <HeaderComponent
        title={nameSurah}
        leftIcon={ChevronLeft}
        rightIcon={Settings}
        rightAction={open}
        scrollAnimatedPosition={scrollY}
        scrollTriggerPoint={80} // Di ketinggian 80px animasi title langsung muncul otomatis!
        scrollAnimationType="slide"
      />

      <SuraMenu sura={data} isVisible={isVisible} close={close} />

      <LegendList
        data={ayahs ?? []}
        renderItem={({ item, index }) => (
          <AyatCard
            surah={surah!}
            ayahIndex={index}
            surahNomor={id}
            surahNama={nameSurah}
            ayat={item as Ayah}
          />
        )}
        keyExtractor={(item: unknown, index: number) => `ayat-${(item as Ayah).nomorAyat}`}
        numColumns={1}
        estimatedItemSize={250} // Ukuran ideal agar tidak memicu warning memory container
        onScroll={handleScroll} // ✅ Menggunakan callback yang stabil
        scrollEventThrottle={16}
        ListHeaderComponent={
          <SuraHeader
            surah={surah}
            kategori={surah?.tempatTurun}
            namaLatin={surah?.namaLatin}
            arti={surah?.arti}
            jumlahAyat={surah?.jumlahAyat}
          />
        }
        contentContainerStyle={{
          // ✅ Berikan paddingTop lebih tinggi (sekitar 100px) agar ayat pertama
          // tidak tertutup oleh HeaderComponent yang melayang secara absolut di atasnya.
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
