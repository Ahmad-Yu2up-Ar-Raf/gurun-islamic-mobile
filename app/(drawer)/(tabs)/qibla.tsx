import HomeBlock from '@/components/ui/core/block/home/home-block';
import QiblaBlock from '@/components/ui/core/block/qibla/qibla-block';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';

import { Link, Stack } from 'expo-router';

import * as React from 'react';

export default function Screen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS({ title: 'Qibla Finder' })} />
      <QiblaBlock />
    </>
  );
}
