import { View, ScrollView } from 'react-native';
import React from 'react';
import { PrayerScheduleItem } from '../../types/prayer-types';
import PrayTimeCard from '../card/pray-time-card';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';

type componentProps = {
  PrayerSchedule: PrayerScheduleItem[];
};

export default function PrayTimeSection({ PrayerSchedule }: componentProps) {
  return (
    <View className="w-full items-center gap-6">
      <View className="flex w-full flex-row items-center justify-between px-6">
        <View className="flex flex-row items-center gap-4">
          <View className="flex flex-row items-center font-poppins_semibold">
            <Text className="font-poppins_semibold text-xl tracking-tighter">Prayer Times</Text>
          </View>
        </View>
      </View>
      <View className="flex w-full flex-row flex-wrap gap-0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 25, gap: 8 }}>
          {PrayerSchedule.map((pray, index) => (
            <PrayTimeCard key={`pray-${pray.sholat}-${index}`} Pray={pray} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
