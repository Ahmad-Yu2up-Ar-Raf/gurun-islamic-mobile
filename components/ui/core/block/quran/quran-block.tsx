import React from 'react';
import QuranHeader from './components/quran-header';
import { LegendList } from '@legendapp/list';
import { SurahCard } from './components/surah-card';
import { FetchQuran } from './hooks/use-quran';
import LoadingIndicator from '../../loading-indicator';
import { View } from 'react-native';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Wrapper } from '../../layout/wrapper';

export default function QuranBlock() {
  const { isLoading, data, isError, error } = FetchQuran();
  const quran = data?.data;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
      <Wrapper
        edges={['top']}
        className="m-auto justify-end overflow-visible"
        containerClassName="content-end overflow-visible">
        <View className="flex-1 items-center justify-center">
          <Text
            variant="muted"
            className="sr-only m-auto mt-3 text-center text-sm text-destructive">
            {error.message}
          </Text>
        </View>
      </Wrapper>
    );
  }
  return (
    <>
      <LegendList
        data={quran ?? []}
        renderItem={({ item }) => <SurahCard sura={item} />}
        keyExtractor={(item) => `surah-${item.nomor}`}
        numColumns={1}
        onEndReachedThreshold={1.5}
        ListHeaderComponent={QuranHeader}
        contentContainerStyle={{ paddingTop: 25, paddingBottom: 100, paddingHorizontal: 10 }}
        className="px-5"
        estimatedItemSize={200}
        maintainVisibleContentPosition
        recycleItems
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}
