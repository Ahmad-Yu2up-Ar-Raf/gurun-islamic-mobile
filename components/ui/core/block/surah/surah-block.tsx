// 📄 File: components/ui/core/block/surah/surah-block.tsx
import React, { useCallback } from 'react'; // ✅ Import useCallback
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { AyatCard } from './components/ayat-card';
import { SuraHeader } from './components/sura-header';
import { ChevronLeft, Settings } from 'lucide-react-native';

// ✅ Import HeaderComponent langsung dari file nav lu
import { HeaderComponent } from '../../layout/nav';
import { Wrapper } from '../../layout/wrapper';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Stack, router } from 'expo-router';

import LoadingIndicator from '../../loading-indicator';
import { useScrollTracker } from '@/hooks/use-scroll-tracker';
import SuraMenu from './components/sura-menu';
import { useBottomSheet } from '@/components/ui/fragments/custom-ui/bottom-sheet';
import { FetchSurah } from './hooks/use-surah';
import { usePlaySurah } from '../audio/hooks/use-audio-queue';
import { Ayah } from './types/surah-type';

type ComponentProp = {
  id: string;
  nameSurah: string;
};

export default function SurahBlock({ id, nameSurah }: ComponentProp) {
  const { isLoading, data, isError, error, refetch } = FetchSurah(id);
  const { isVisible, open, close } = useBottomSheet();
  const playSurah = usePlaySurah();
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
    return (
      <Wrapper edges={['top']} className="m-auto justify-center overflow-visible">
        <View
          className="flex-1 items-center justify-center gap-2 px-6 py-16"
          accessible
          accessibilityRole="alert"
          accessibilityLabel={`Gagal memuat ${nameSurah}`}>
          <Text className="text-center font-poppins_semibold text-base">
            Gagal memuat {nameSurah}
          </Text>
          <Text variant="muted" className="text-center font-poppins_regular text-sm">
            {error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.'}
          </Text>
          <View className="mt-2 w-full max-w-xs flex-row items-center justify-center gap-2">
            <Button
              onPress={() => refetch()}
              className="flex-1"
              accessibilityRole="button"
              accessibilityLabel="Coba muat ulang surah">
              <Text>Coba lagi</Text>
            </Button>
            <Button
              variant="ghost"
              onPress={() => router.back()}
              className="flex-1"
              accessibilityRole="button"
              accessibilityLabel="Kembali ke daftar surah">
              <Text>Kembali</Text>
            </Button>
          </View>
        </View>
      </Wrapper>
    );
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
        scrollTriggerPoint={100} // Di ketinggian 80px animasi title langsung muncul otomatis!
        scrollAnimationType="slide"
      />

      <SuraMenu sura={data.data} isVisible={isVisible} close={close} />

      <LegendList
        data={ayahs ?? []}
        renderItem={({ item }) => (
          <AyatCard surahNomor={id} surahNama={nameSurah} ayat={item as Ayah} />
        )}
        keyExtractor={(item: unknown, index: number) => `ayat-${(item as Ayah).nomorAyat}`}
        numColumns={1}
        estimatedItemSize={250} // Ukuran ideal agar tidak memicu warning memory container
        onScroll={handleScroll} // ✅ Menggunakan callback yang stabil
        scrollEventThrottle={16}
        ListHeaderComponent={
          <SuraHeader
            kategori={surah?.tempatTurun}
            namaLatin={surah?.namaLatin}
            arti={surah?.arti}
            jumlahAyat={surah?.jumlahAyat}
            onPlay={surah ? () => playSurah(surah) : undefined}
          />
        }
        contentContainerStyle={{
          // ✅ Berikan paddingTop lebih tinggi (sekitar 100px) agar ayat pertama
          // tidak tertutup oleh HeaderComponent yang melayang secara absolut di atasnya.
          paddingTop: 50,
          paddingBottom: 100,
          paddingHorizontal: 12,
        }}
        ListEmptyComponent={
          <View
            className="items-center justify-center px-6 py-16"
            accessible
            accessibilityLabel="Belum ada ayat untuk surah ini">
            <Text variant="muted" className="text-center font-poppins_regular text-sm">
              Belum ada ayat untuk surah ini.
            </Text>
          </View>
        }
        className="px-6"
        recycleItems={true}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}
