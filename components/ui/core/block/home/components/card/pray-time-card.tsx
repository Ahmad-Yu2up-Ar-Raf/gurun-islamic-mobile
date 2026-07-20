import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/fragments/shadcn-ui/card';
import ZuhurIcon from '@/components/ui/fragments/svg/icons/pray-time/zuhur';
import { PrayerScheduleItem } from '../../types/prayer-types';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';

type componentsProps = {
  Pray: PrayerScheduleItem;
};

export default function PrayTimeCard({ Pray }: componentsProps) {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;

  return (
    <Card className="flex w-[6.6em] content-center justify-center gap-4 bg-card/40 px-0 py-4">
      <CardHeader className="flex content-center items-center justify-center p-0">
        <ZuhurIcon fill={tintColor} />
      </CardHeader>
      <CardContent className="flex content-center items-center justify-center gap-0">
        <CardTitle className="font-poppins_medium  tracking-tighter text-sm capitalize">{Pray.sholat}</CardTitle>
        <CardDescription className="font-poppins_semibold text-base text-foreground">
          {Pray.time}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
