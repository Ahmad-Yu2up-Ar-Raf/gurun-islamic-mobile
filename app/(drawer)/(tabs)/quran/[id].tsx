// app/(drawer)/(tabs)/quran/[id].tsx
// Nested inside the Quran tab Stack so the bottom tab bar stays visible.
import React from 'react';

import { Redirect, useLocalSearchParams } from 'expo-router';
import SurahBlock from '@/components/ui/core/block/surah/surah-block';

function isValidSurahId(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (!/^\d+$/.test(value)) return false;
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 114;
}

export default function QuranDetailScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const rawName = Array.isArray(params?.name) ? params.name[0] : params?.name;
  const nameSurah = rawName && rawName.length > 0 ? rawName : 'Surah';

  if (!isValidSurahId(id)) {
    return <Redirect href="/(drawer)/(tabs)/quran" />;
  }

  return <SurahBlock id={id} nameSurah={nameSurah} />;
}
