// components/ui/core/block/quran-block.tsx
// ✅ ADDED: Loading skeleton yang proper + error state dengan retry
import React from 'react';
import { ActivityIndicator, RefreshControl, View, StyleSheet } from 'react-native';
import { Text } from '../../fragments/shadcn-ui/text';
import { DoaListQueryOptions } from '@/lib/server/doa/doa-server-queris';
import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '../../fragments/shadcn-ui/skeleton';
import { LegendList } from '@legendapp/list';
import { DoaCard } from '../../fragments/custom-ui/card/doa-card';
// ─── Skeleton item ───

import LoadingIndicator from '../loading-indicator';
export default function DoaBlock() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery(DoaListQueryOptions());

  // ✅ Loading state — tampilkan skeleton, bukan blank screen
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // ✅ Error state dengan tombol retry
  if (isError) {
    return (
      <View style={styles.center}>
        <Text className="mb-4 text-center text-muted-foreground">Gagal memuat data doa</Text>
        <Text className="tefxt-primary font-poppins_semibold" onPress={() => refetch()}>
          Coba lagi
        </Text>
      </View>
    );
  }
  console.log('Fetched doas:', data); // Debug: pastikan data muncul di console
  return (
    <>
      <LegendList
        data={data ?? []}
        renderItem={({ item }) => <DoaCard doa={item} />}
        keyExtractor={(item) => `doa-${item.id}`}
        numColumns={1}
        onEndReachedThreshold={1.5}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
        className="px-5"
        // ✅ Pull to refresh
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        maintainVisibleContentPosition
        recycleItems
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  skeletonTextGroup: {
    flex: 1,
    gap: 4,
  },
  skeletonBox: {
    backgroundColor: 'hsl(30, 50%, 93%)',
    opacity: 0.7,
  },
});
