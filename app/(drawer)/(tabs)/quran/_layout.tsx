import React from 'react';

import { router, Stack } from 'expo-router';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={SCREEN_OPTIONS({ title: 'Quran', transparent: false })} />
      <Stack.Screen name="[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />

      {/* Tambahkan screen lain di sini jika ada nested routes */}
    </Stack>
  );
}
