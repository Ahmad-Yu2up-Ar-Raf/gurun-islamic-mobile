// services/wilayah-service.ts
//
// Single responsibility: talk to equran.id's region-lookup endpoints and
// resolve a "fuzzy" device-reported location (from expo-location reverse
// geocoding) into the EXACT string the prayer-schedule endpoint requires.
//
// Why this exists: equran.id's docs explicitly state "Nama provinsi dan
// kabupaten/kota harus sesuai dengan data dari API" (must match exactly).
// GPS reverse-geocode gives inconsistent formatting ("Kab Bogor" vs
// "Kab. Bogor" vs just "Bogor"), so we never send that directly — we always
// resolve it against equran's own official lists first.

import { api } from '@/api/client';
import type { KabkotaListResponse, ProvinsiListResponse } from '../types/prayer-types';

export async function fetchProvinsiList(): Promise<string[]> {
  const res = await api.get('v2/shalat/provinsi').json<ProvinsiListResponse>();
  return res.data;
}

export async function fetchKabkotaList(provinsi: string): Promise<string[]> {
  const res = await api
    .post('v2/shalat/kabkota', { json: { provinsi } })
    .json<KabkotaListResponse>();
  return res.data;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/^kab\.?\s+/, 'kab ')
    .replace(/^kota\s+/, 'kota ')
    .replace(/[.\s]+/g, ' ')
    .trim();
}

/** Returns the official list entry that best matches a loosely-formatted guess, or null. */
function resolveBestMatch(officialList: string[], guess: string): string | null {
  const normalizedGuess = normalize(guess);

  const exact = officialList.find((item) => normalize(item) === normalizedGuess);
  if (exact) return exact;

  const partial = officialList.find(
    (item) => normalize(item).includes(normalizedGuess) || normalizedGuess.includes(normalize(item))
  );
  return partial ?? null;
}

export interface ResolvedRegion {
  province: string;
  city: string;
}

/**
 * Resolves a device-reported {region, city/subregion} pair into equran.id's
 * exact official strings. Falls back gracefully if no match is found.
 */
export async function resolveOfficialRegion(
  guessedProvince: string,
  guessedCity: string
): Promise<ResolvedRegion | null> {
  const provinsiList = await fetchProvinsiList();
  const province = resolveBestMatch(provinsiList, guessedProvince);
  if (!province) return null;

  const kabkotaList = await fetchKabkotaList(province);
  const city = resolveBestMatch(kabkotaList, guessedCity);
  if (!city) return null;

  return { province, city };
}
