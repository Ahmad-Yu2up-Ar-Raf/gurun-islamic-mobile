// components/provider/provider.tsx
// ✅ FIXED: Removed duplicate <PortalHost /> — it belongs ONLY in root _layout.tsx
import React from 'react';
import { NAV_THEME } from '@/lib/theme';

import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { ThemeProvider, type Theme } from 'expo-router/react-navigation';
type ComponentProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 menit
      gcTime: 5 * 60 * 1000, // 5 menit
      retry: 1, // fail fast
      retryDelay: 1000, // flat 1s delay
      refetchOnWindowFocus: true, // via focusManager
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

export default function Provider({ children }: ComponentProps) {
  const { colorScheme } = useColorScheme();

  React.useEffect(() => {
    // ✅ Best practice TanStack Query RN: gunakan focusManager
    // bukan queryClient.refetchQueries() saat app kembali ke foreground
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light'] as Theme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export { queryClient };
