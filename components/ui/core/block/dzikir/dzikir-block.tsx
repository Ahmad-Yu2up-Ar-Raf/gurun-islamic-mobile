// components/ui/core/block/dzikir-block.tsx
//
// ARSITEKTUR STATE MANAGEMENT:
//
//   ┌─────────────────────────────────────────────────┐
//   │                  DzikirBlock                    │
//   │                                                 │
//   │  useState: selectedTypes → Type[]               │
//   │                  │                              │
//   │                  ├──→ FiltersCarousel            │
//   │                  │     (controlled, multi-select)│
//   │                  │                              │
//   │                  └──→ DzikirListQueryOptions     │
//   │                        (queryKey berubah →      │
//   │                         TanStack re-compute)    │
//   └─────────────────────────────────────────────────┘
//
// FLOW:
//   1. User klik filter "Pagi" → setSelectedTypes(['pagi'])
//   2. queryKey berubah: ['Dzikir','list',{types:['pagi']}]
//   3. TanStack cek cache → kalau miss: jalankan queryFn
//   4. queryFn fetch semua data (di-cache) → filter in-memory
//   5. LegendList re-render dengan data filtered
//   6. Klik "Pagi" + "Solat" → queryKey: ['Dzikir','list',{types:['pagi','solat']}]
//   7. Instant jika cache root masih fresh (staleTime 5 menit)

import React, { useState, useCallback } from 'react';
import { RefreshControl, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { LegendList } from '@legendapp/list';

import { Text } from '../../../fragments/shadcn-ui/text';
import { SCREEN_OPTIONS } from '@/components/ui/core/layout/nav';
import { DzikirListQueryOptions } from '@/components/ui/core/block/dzikir/server/dzikir-server-queris';
import { DzikirCard } from './components/dzikir-card';
import LoadingIndicator from '../../loading-indicator';
import FiltersCarousel, { FilterOption } from './components/filter-carousel';
import { Type } from '@/type/dzikir-type';

// ─── Filter options untuk fitur Dzikir ────────────────────────────────────────
// Definisikan di luar komponen → tidak re-create setiap render
const DZIKIR_FILTER_OPTIONS: FilterOption<Type>[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Pagi', value: Type.Pagi }, // 'pagi'
  { label: 'Shalat', value: Type.Solat }, // 'solat'
  { label: 'Sore', value: Type.Sore }, // 'sore'
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DzikirBlock() {
  // ✅ Filter state dikelola di sini — satu-satunya source of truth
  // selectedTypes: [] → semua, ['pagi'] → pagi only, ['pagi','solat'] → keduanya
  const [selectedTypes, setSelectedTypes] = useState<Type[]>([]);

  // ✅ Query otomatis re-run saat selectedTypes berubah (queryKey berubah)
  // Tidak perlu manual invalidate — TanStack handle via queryKey
  const { data, isLoading, isError, refetch, isRefetching } = useQuery(
    DzikirListQueryOptions({
      types: selectedTypes,
    })
  );

  // ✅ Callback stable dengan useCallback agar tidak trigger re-render FiltersCarousel
  const handleFilterChange = useCallback((selected: Type[]) => {
    setSelectedTypes(selected);
  }, []);

  // ─── States ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text className="mb-4 text-center text-muted-foreground">Gagal memuat data dzikir</Text>
        <Text className="font-poppins_semibold text-primary" onPress={() => refetch()}>
          Coba lagi
        </Text>
      </View>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: 'Dzikir',
          // ✅ FiltersCarousel sekarang controlled:
          //    - selectedValues: state aktif saat ini
          //    - onChange: update state → trigger re-query otomatis
          children: (
            <FiltersCarousel<Type>
              options={DZIKIR_FILTER_OPTIONS}
              selectedValues={selectedTypes}
              onChange={handleFilterChange}
              multiSelect // ← aktifkan multi-select
            />
          ),
        })}
      />

      <LegendList
        data={data ?? []}
        renderItem={({ item, index }) => <DzikirCard index={index} dzikir={item} />}
        keyExtractor={(item, index) => `dzikir-${item.type}-${index}`}
        numColumns={1}
        onEndReachedThreshold={1.5}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
        className="px-5"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        maintainVisibleContentPosition
        recycleItems
        showsVerticalScrollIndicator={false}
        // ✅ Empty state saat filter aktif tapi tidak ada hasil
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text className="text-center font-poppins_medium text-muted-foreground">
              {selectedTypes.length > 0
                ? `Tidak ada dzikir untuk filter yang dipilih`
                : 'Tidak ada data'}
            </Text>
          </View>
        }
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});
