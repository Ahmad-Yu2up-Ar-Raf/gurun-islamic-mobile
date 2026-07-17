// services/jadwal-service.ts
//
// Single responsibility: fetch the monthly prayer schedule. Nothing else —
// no filtering, no status computation, no React. That logic lives in
// utils/prayer-time.ts and hooks/use-prayer.ts respectively.

import { api } from '@/api/client';
import type { JadwalShalatData, JadwalShalatResponse } from '../types/prayer-types';

export async function fetchJadwalShalat(
  provinsi: string,
  kabkota: string
): Promise<JadwalShalatData> {
  const res = await api
    .post('v2/shalat', { json: { provinsi, kabkota } })
    .json<JadwalShalatResponse>();
  return res.data;
}
