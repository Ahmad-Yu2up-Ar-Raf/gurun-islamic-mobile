// lib/server/AsmaulHusna/AsmaulHusna-server-queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchAllAsmaulHusna } from './asmaul-husna-server';
import { Datum as DzikirDatum } from '@/type/dzikir-type';
import { Datum as AsmaulHusnaDatum } from '@/type/asmaul-husna';

export type AsmaulHusnaListFilters = {
  search?: string;
};

export const AsmaulHusnaKeys = {
  all: ['AsmaulHusna'] as const,
  lists: () => [...AsmaulHusnaKeys.all, 'list'] as const,
  list: (filters?: AsmaulHusnaListFilters) => [...AsmaulHusnaKeys.lists(), filters ?? {}] as const,
  detail: (nomor: number) => [...AsmaulHusnaKeys.all, 'detail', nomor] as const,
};

/** list query — fetch all then filter client-side */
export function AsmaulHusnaListQueryOptions(filters?: AsmaulHusnaListFilters) {
  return queryOptions({
    queryKey: AsmaulHusnaKeys.list(filters),
    queryFn: async (): Promise<AsmaulHusnaDatum[]> => {
      const all = await fetchAllAsmaulHusna();
      if (!filters) return all;
      const q = filters.search?.trim().toLowerCase() ?? '';
      return all.filter((s) => {
        const matchSearch =
          !q ||
          s.arab.toLowerCase().includes(q) ||
          s.latin.toLowerCase().includes(q) ||
          s.arti.toLowerCase().includes(q);

        return matchSearch;
      });
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
