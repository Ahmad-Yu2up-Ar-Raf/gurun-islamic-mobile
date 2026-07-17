// app/surah/[id].tsx
// ✅ Simple and clean: no Provider wrapper needed
import React from 'react';

import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import SurahBlock from '@/components/ui/core/block/surah/surah-block';
import { ChevronLeft, MoreHorizontal, PlayCircleIcon } from 'lucide-react-native';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';

export default function Page() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const nomor = params?.id;
  const nameSurah = params?.name ?? 'Surah';

  if (!nomor || !nameSurah) {
    return <Redirect href={'/(drawer)/(tabs)/quran'} />;
  }

  return (
    <>
      {/* <Stack.Screen
        options={SCREEN_OPTIONS({
          title: nameSurah,

          leftIcon: ChevronLeft,
        })}
      /> */}
      <SurahBlock id={nomor} nameSurah={nameSurah} />
    </>
  );
}
