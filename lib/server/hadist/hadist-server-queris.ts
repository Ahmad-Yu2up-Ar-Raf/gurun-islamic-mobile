// lib/server/Hadist/Hadist-server-queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchAllHadist } from './hadist-server';
import { Datum } from '@/type/hadist-type';

export type HadistListFilters = {
  search?: string;
};

export const HadistKeys = {
  all: ['Hadist'] as const,
  lists: () => [...HadistKeys.all, 'list'] as const,
  list: (filters?: HadistListFilters) => [...HadistKeys.lists(), filters ?? {}] as const,
  detail: (nomor: number) => [...HadistKeys.all, 'detail', nomor] as const,
};

/** list query — fetch all then filter client-side */
export function HadistListQueryOptions(filters?: HadistListFilters) {
  return queryOptions({
    queryKey: HadistKeys.list(filters),
    queryFn: async (): Promise<Datum[]> => {
      const all = await fetchAllHadist();
      if (!filters) return all;
      const q = filters.search?.trim().toLowerCase() ?? '';
      return all.filter((s) => {
        const matchSearch =
          !q ||
          s.judul.toLowerCase().includes(q) ||
          s.arab.toLowerCase().includes(q) ||
          s.indo.toLowerCase().includes(q) ||
          s.no.toLowerCase().includes(q);

        return matchSearch;
      });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
