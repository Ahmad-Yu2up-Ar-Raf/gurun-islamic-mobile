import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { Wrapper } from './layout/wrapper';
import { Text } from '../fragments/shadcn-ui/text';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';

export default function LoadingIndicator({ loadingText }: { loadingText?: string }) {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const primaryColor = THEME[currentTheme].primary;

  return (
    <Wrapper
      edges={['top']}
      className="m-auto justify-end overflow-visible"
      containerClassName="content-end overflow-visible">
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={primaryColor} />
        <Text variant="muted" className="sr-only m-auto mt-3 text-center text-sm">
          {loadingText || 'Memuat data...'}
        </Text>
      </View>
    </Wrapper>
  );
}
``;
