// lib/server/Hadist/Hadist-server.ts
import { Datum, HadistResponse } from '@/type/hadist-type';

const BASE_URL = 'https://muslim-api-three.vercel.app/v1/hadits';

/**
 * fetchAllHadist
 */
export async function fetchAllHadist(): Promise<Datum[]> {
  const url = BASE_URL;
  const res = await fetch(url);
  ``;

  if (!res.ok) {
    throw new Error(`fetchAllHadist failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as HadistResponse | null;
  if (!json || !Array.isArray(json.data)) {
    throw new Error('fetchAllHadist: unexpected response shape');
  }

  return json.data;
}
