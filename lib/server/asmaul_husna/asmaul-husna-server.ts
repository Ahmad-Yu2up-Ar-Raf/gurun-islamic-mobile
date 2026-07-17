// lib/server/AsmaulHusna/AsmaulHusna-server.ts
import { Datum, AsmaulHusnaResponse } from '@/type/asmaul-husna';

const BASE_URL = 'https://asmaul-husna-api.vercel.app/api/all';

/**
 * fetchAllAsmaulHusna
 */
export async function fetchAllAsmaulHusna(): Promise<Datum[]> {
  const url = BASE_URL;
  const res = await fetch(url);
  ``;

  if (!res.ok) {
    throw new Error(`fetchAllAsmaulHusna failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as AsmaulHusnaResponse | null;
  if (!json || !Array.isArray(json.data)) {
    throw new Error('fetchAllAsmaulHusna: unexpected response shape');
  }

  return json.data;
}
