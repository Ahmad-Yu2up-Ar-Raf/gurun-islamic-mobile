// components/ui/core/block/quran-block.tsx
// ✅ ADDED: Loading skeleton yang proper + error state dengan retry
import React from 'react';
import { RefreshControl, View, StyleSheet } from 'react-native';
import { Text } from '../../fragments/shadcn-ui/text';
import { HadistListQueryOptions } from '@/lib/server/hadist/hadist-server-queris';
import { useQuery } from '@tanstack/react-query';

import { LegendList } from '@legendapp/list';
import { HadistCard } from '../../fragments/custom-ui/card/hadist-card';
// ─── Skeleton item ───

import LoadingIndicator from '../loading-indicator';
export default function HadistBlock() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery(HadistListQueryOptions());

  // ✅ Loading state — tampilkan skeleton, bukan blank screen
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // ✅ Error state dengan tombol retry
  if (isError) {
    return (
      <View style={styles.center}>
        <Text className="mb-4 text-center text-muted-foreground">Gagal memuat data hadist</Text>
        <Text className="tefxt-primary font-poppins_semibold" onPress={() => refetch()}>
          Coba lagi
        </Text>
      </View>
    );
  }

  return (
    <>
      <LegendList
        data={data ?? []}
        renderItem={({ item }) => <HadistCard hadist={item} />}
        keyExtractor={(item) => `hadist-${item.no}`}
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
