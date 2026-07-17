// utils/prayer-time.ts
//
// Pure functions only — no React, no side effects. Easy to unit test in
// isolation. This is where "today's raw jadwal + current time" becomes the
// realtime TodayPrayerSchedule model the rest of the app consumes.

import type {
  JadwalHarianRaw,
  PrayerName,
  PrayerScheduleItem,
  PrayerStatus,
  TodayPrayerSchedule,
} from '../types/prayer-types';

/** Order matters — this defines the chronological sequence used everywhere below. */
export const PRAYER_ORDER: PrayerName[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

const PRAYER_LABELS: Record<PrayerName, string> = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya',
};

export function getPrayerLabel(name: PrayerName): string {
  return PRAYER_LABELS[name];
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

/** Parses an "HH:mm" string into a real Date, anchored to the given base date. */
function parseTimeOnDate(time: string, base: Date): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(base);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/** Formats a millisecond duration as "HH:mm:ss". Clamped to zero, never negative. */
export function formatDuration(ms: number): string {
  const clamped = Math.max(0, ms);
  const hours = Math.floor(clamped / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1_000);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function endOfDay(base: Date): Date {
  const result = new Date(base);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Builds the realtime derived schedule for "today" from the raw API entry.
 * Pure function: same (jadwalToday, now) input always produces the same output —
 * safe to call every second from a ticking hook without surprises.
 */
export function buildTodayPrayerSchedule(
  jadwalToday: JadwalHarianRaw,
  now: Date,
  city: string,
  province: string
): TodayPrayerSchedule {
  const base = new Date(jadwalToday.tanggal_lengkap);
  const times = PRAYER_ORDER.map((name) => parseTimeOnDate(jadwalToday[name], base));

  // currentIndex = index of the prayer whose window we are currently inside.
  // -1 means "before Subuh" — no prayer window has started yet today.
  let currentIndex = -1;
  for (let i = 0; i < times.length; i += 1) {
    if (now >= times[i]) currentIndex = i;
  }

  const nextIndex = currentIndex < PRAYER_ORDER.length - 1 ? currentIndex + 1 : null;
  // Edge case: after Isya there's no more "today" data (scope is today-only by
  // design). We fall back to a countdown to midnight; once the date rolls over,
  // the query key in use-prayer-time.ts changes and this recomputes correctly
  // against tomorrow's real schedule.
  const nextPrayer: PrayerName = nextIndex !== null ? PRAYER_ORDER[nextIndex] : 'subuh';
  const nextPrayerTime = nextIndex !== null ? times[nextIndex] : endOfDay(base);
  const remainingMs = nextPrayerTime.getTime() - now.getTime();

  const jadwal: PrayerScheduleItem[] = PRAYER_ORDER.map((name, index) => {
    let status: PrayerStatus;
    if (index === currentIndex) status = 'aktif';
    else if (index === nextIndex) status = 'selanjutnya';
    else if (index < currentIndex) status = 'selesai';
    else status = 'menanti';

    const sisaMs = times[index].getTime() - now.getTime();

    return {
      sholat: name,
      time: jadwalToday[name],
      sisa_waktu: status === 'selesai' ? '00:00:00' : formatDuration(sisaMs),
      status,
    };
  });

  return {
    hari: jadwalToday.hari,
    date: jadwalToday.tanggal_lengkap,
    jadwal,
    nextPrayer,
    remaining: formatDuration(remainingMs),
    currentPrayer: currentIndex >= 0 ? PRAYER_ORDER[currentIndex] : null,
    city,
    province,
  };
}

/** Finds today's entry inside a full month of schedule data. Returns null if not found. */
export function findTodayJadwal(jadwal: JadwalHarianRaw[], now: Date): JadwalHarianRaw | null {
  const todayKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return jadwal.find((item) => item.tanggal_lengkap === todayKey) ?? null;
}
