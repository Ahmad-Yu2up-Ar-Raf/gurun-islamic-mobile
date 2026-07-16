// lib/server/Dzikir/dzikir-server-queries.ts
//
// ARSITEKTUR:
//   - DzikirListFilters sekarang pakai `types?: Type[]` (array) → multi-select
//   - Filter dilakukan client-side setelah fetch semua data
//   - queryKey mengandung filters → TanStack otomatis re-fetch saat filter berubah
//   - staleTime 5 menit → data di-cache, switch filter tidak re-fetch ke network
//     selama cache masih fresh (hanya re-compute filter dari cache)

import { queryOptions } from '@tanstack/react-query';
import { fetchAllDzikir } from './dzikir-server';
import { Datum, Type } from '@/type/dzikir-type';

// ─── Filter shape ─────────────────────────────────────────────────────────────
// `types` adalah array agar mendukung multi-select:
//   []            → tidak ada filter aktif → tampilkan semua
//   ['pagi']      → hanya pagi
//   ['pagi','solat'] → pagi DAN solat (union, bukan intersection)
export type DzikirListFilters = {
  search?: string;
  types?: Type[]; // ← CHANGED: was `type?: Type`, now array for multi-select
};

// ─── Query Keys ───────────────────────────────────────────────────────────────
// Key mengandung filters object → setiap kombinasi filter punya cache entry sendiri
// Ini memungkinkan instant switching antar filter kombinasi yang sudah pernah di-fetch
export const DzikirKeys = {
  all: ['Dzikir'] as const,
  lists: () => [...DzikirKeys.all, 'list'] as const,

  // Normalisasi key: sort types array agar ['pagi','solat'] === ['solat','pagi']
  // Ini mencegah cache miss akibat urutan filter yang berbeda
  list: (filters?: DzikirListFilters) => {
    const normalizedFilters = filters
      ? {
          ...filters,
          types: filters.types ? [...filters.types].sort() : undefined,
        }
      : {};
    return [...DzikirKeys.lists(), normalizedFilters] as const;
  },

  detail: (id: string) => [...DzikirKeys.all, 'detail', id] as const,
};

// ─── List Query Options ───────────────────────────────────────────────────────
// Reusable di seluruh app: cukup pass `filters` yang berbeda
// TanStack Query handle dedup + caching otomatis berdasarkan queryKey
export function DzikirListQueryOptions(filters?: DzikirListFilters) {
  return queryOptions({
    queryKey: DzikirKeys.list(filters),

    queryFn: async (): Promise<Datum[]> => {
      // Fetch semua data sekali → di-cache oleh TanStack
      // Filter dilakukan in-memory → switch filter = instant, tanpa network call
      const all = await fetchAllDzikir();
      if (!filters) return all;

      const q = filters.search?.trim().toLowerCase() ?? '';

      // `types` kosong atau undefined → tampilkan semua (no type filter)
      const hasTypeFilter = (filters.types?.length ?? 0) > 0;

      return all.filter((item) => {
        // Search filter: match arab atau terjemahan indo
        const matchSearch =
          !q || item.arab.toLowerCase().includes(q) || item.indo.toLowerCase().includes(q);

        // Type filter: item.type harus ada di dalam array types yang dipilih
        // Jika tidak ada filter type → semua lolos
        const matchType = !hasTypeFilter || filters.types!.includes(item.type);

        return matchSearch && matchType;
      });
    },

    // Data dianggap fresh selama 5 menit → switch filter tidak trigger network call
    // jika data root ('Dzikir','list',{}) masih di cache
    staleTime: 5 * 60 * 1000,

    // Data tetap di memory 30 menit sejak terakhir digunakan
    gcTime: 30 * 60 * 1000,

    retry: 1,
  });
}
