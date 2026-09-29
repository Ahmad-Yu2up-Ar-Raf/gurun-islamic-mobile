import { Dimensions } from 'react-native';
import React from 'react';
import { Wrapper } from '../../layout/wrapper';
import { usePrayer } from './hooks/use-prayer';

import HeroSection from './components/section/hero-section';
import PrayTimeSection from './components/section/pray-time-section';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeBlock() {
  const { nextPrayer, remaining, city, dateString, todayPrayerSchedule } = usePrayer();

  return (
    <Wrapper containerClassName="px-0" edges={['bottom']}>
      <HeroSection
        nextPrayer={nextPrayer}
        remaining={remaining}
        city={city}
        dateString={dateString}
      />
      {/* <PrayTimeSection PrayerSchedule={todayPrayerSchedule?.jadwal || []} /> */}
    </Wrapper>
  );
}
