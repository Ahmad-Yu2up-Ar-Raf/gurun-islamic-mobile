// lib/server/Dzikir/Dzikir-server.ts
import { Datum, DzikirResponse } from '@/type/dzikir-type';

const BASE_URL = 'https://muslim-api-three.vercel.app/v1/dzikir';

/**
 * fetchAllDzikir
 */
export async function fetchAllDzikir(): Promise<Datum[]> {
  const url = BASE_URL;
  const res = await fetch(url);
  ``;

  if (!res.ok) {
    throw new Error(`fetchAllDzikir failed: HTTP ${res.status}`);
  }

  const json = (await res.json()) as DzikirResponse | null;
  if (!json || !Array.isArray(json.data)) {
    throw new Error('fetchAllDzikir: unexpected response shape');
  }

  return json.data;
}
