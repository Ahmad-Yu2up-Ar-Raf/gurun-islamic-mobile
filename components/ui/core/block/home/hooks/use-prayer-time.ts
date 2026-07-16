// hooks/use-prayer-time.ts
//
// Single responsibility: talk to the prayer-schedule API (via the existing
// `services/jadwal-service.ts`, which itself reuses the project's existing
// ky `api` client — no new HTTP client created) and expose ONLY today's raw
// schedule entry. Consumers never touch the monthly array.

import { useQuery } from '@tanstack/react-query';
import { fetchJadwalShalat } from '../services/jadwal-service';
import { findTodayJadwal } from '../utils/prayer-time';
import type { JadwalHarianRaw } from '../types/prayer-types';

interface UsePrayerTimeParams {
  province: string;
  city: string;
}

export function usePrayerTime({ province, city }: UsePrayerTimeParams) {
  return useQuery({
    // Keying by date (not just province/city) means the cache naturally
    // refetches once the day rolls over — no manual invalidation needed.
    queryKey: ['prayer-schedule', province, city, new Date().toDateString()],
    queryFn: () => fetchJadwalShalat(province, city),
    enabled: Boolean(province && city),
    // The monthly schedule for a fixed month/region never changes mid-day —
    // safe to treat as fresh for a long time, avoiding redundant requests.
    staleTime: 60 * 60 * 1000, // 1 hour
    select: (data): JadwalHarianRaw | null => findTodayJadwal(data.jadwal, new Date()),
  });
}
