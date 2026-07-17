import React from 'react';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';
import { Stack } from 'expo-router';
import FiltersCarousel from '@/components/ui/fragments/custom-ui/carousel/filter-carousel';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={SCREEN_OPTIONS({ title: 'Hadist' })} />
      {/* Tambahkan screen lain di sini jika ada nested routes */}
    </Stack>
  );
}
