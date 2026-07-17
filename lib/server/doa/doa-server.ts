// lib/server/Doa/Doa-server.ts
import { DOAResponse } from '@/type/doa-type';

const BASE_URL = 'https://open-api.my.id/api/doa';

/**
 * fetchAllDoa
 */
export async function fetchAllDoa(): Promise<DOAResponse[]> {
  const url = BASE_URL;
  const res = await fetch(url);
  ``;

  if (!res.ok) {
    throw new Error(`fetchAllDoa failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as DOAResponse | null;
  if (!json || !Array.isArray(json)) {
    throw new Error('fetchAllDoa: unexpected response shape');
  }

  return json;
}
