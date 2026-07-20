import { View, ScrollView } from 'react-native';
import React from 'react';
import { PrayerScheduleItem } from '../../types/prayer-types';
import PrayTimeCard from '../card/pray-time-card';
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';

type componentProps = {
  PrayerSchedule: PrayerScheduleItem[];
};

function SkeletonCard() {
  return (
    <View className="flex w-[6.5em] items-center justify-center gap-4 rounded-2xl bg-card/40 px-0 py-4">
      <Skeleton className="size-10 rounded-full bg-secondary/20" />
      <View className="items-center gap-1">
        <Skeleton className="h-3 w-14 bg-secondary/20" />
        <Skeleton className="h-4 w-16 bg-secondary/20" />
      </View>
    </View>
  );
}

export default function PrayTimeSection({ PrayerSchedule }: componentProps) {
  const loading = PrayerSchedule.length === 0;
  const items = loading ? Array.from({ length: 5 }) : PrayerSchedule;

  return (
    <View className="w-full items-center gap-6">
      <View className="flex w-full flex-row items-center justify-between px-7">
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
          {loading
            ? items.map((_, index) => <SkeletonCard key={`skel-${index}`} />)
            : (items as PrayerScheduleItem[]).map((pray, index) => (
                <PrayTimeCard key={`pray-${pray.sholat}-${index}`} Pray={pray} />
              ))}
        </ScrollView>
      </View>
    </View>
  );
}
