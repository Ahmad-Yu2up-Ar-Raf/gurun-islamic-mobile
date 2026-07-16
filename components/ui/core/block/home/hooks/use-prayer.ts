// hooks/use-prayer.ts
//
// The single hook UI components consume — drop-in replacement for the old
// `usePrayer()` from use-prayer-context.tsx. Every field that HomeBlock and
// QiblaBlock previously destructured is preserved, plus the new fields
// requested (province, todayPrayerSchedule). Pure composition: this file
// owns ZERO business logic itself — it wires together the location store,
// the schedule query, and a 1s clock tick, then derives the realtime model
// via the pure functions in utils/prayer-time.ts.

import { useEffect, useState } from 'react';
import { useCity, useCoordinates, useProvince } from '../store/use-location-store';
import { usePrayerTime } from '../hooks/use-prayer-time';
import { buildTodayPrayerSchedule } from '../utils/prayer-time';
import type { Coordinates, PrayerName, TodayPrayerSchedule } from '../types/prayer-types';

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

/** Ticks once per second — isolated here so only consumers of this hook
 *  re-render on each tick, never the whole app (unlike the old Context). */
function useSecondClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return now;
}

export interface PrayerHookValue {
  coordinates: Coordinates;
  nextPrayer: PrayerName | '';
  remaining: string;
  city: string;
  province: string;
  dateString: string;
  hour: string;
  minute: string;
  /** Full realtime derived model — null while the schedule hasn't loaded yet. */
  todayPrayerSchedule: TodayPrayerSchedule | null;
  isLoading: boolean;
}

export function usePrayer(): PrayerHookValue {
  const province = useProvince();
  const city = useCity();
  const coordinates = useCoordinates();
  const now = useSecondClock();

  const { data: jadwalToday, isLoading } = usePrayerTime({ province, city });

  const todayPrayerSchedule = jadwalToday
    ? buildTodayPrayerSchedule(jadwalToday, now, city, province)
    : null;

  return {
    coordinates,
    nextPrayer: todayPrayerSchedule?.nextPrayer ?? '',
    remaining: todayPrayerSchedule?.remaining ?? '00:00:00',
    city,
    province,
    dateString: now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    hour: pad(now.getHours()),
    minute: pad(now.getMinutes()),
    todayPrayerSchedule,
    isLoading,
  };
}
