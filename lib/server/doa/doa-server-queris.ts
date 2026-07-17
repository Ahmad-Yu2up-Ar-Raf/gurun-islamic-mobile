// lib/server/Doa/Doa-server-queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchAllDoa } from './doa-server';
import { DOAResponse } from '@/type/doa-type';

export type DoaListFilters = {
  search?: string;
};

export const DoaKeys = {
  all: ['Doa'] as const,
  lists: () => [...DoaKeys.all, 'list'] as const,
  list: (filters?: DoaListFilters) => [...DoaKeys.lists(), filters ?? {}] as const,
  detail: (nomor: number) => [...DoaKeys.all, 'detail', nomor] as const,
};

/** list query — fetch all then filter client-side */
export function DoaListQueryOptions(filters?: DoaListFilters) {
  return queryOptions({
    queryKey: DoaKeys.list(filters),
    queryFn: async (): Promise<DOAResponse[]> => {
      const all = await fetchAllDoa();
      if (!filters) return all;
      const q = filters.search?.trim().toLowerCase() ?? '';
      return all.filter((s) => {
        const matchSearch =
          !q ||
          s.judul.toLowerCase().includes(q) ||
          s.latin.toLowerCase().includes(q) ||
          s.terjemah.toLowerCase().includes(q);

        return matchSearch;
      });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
