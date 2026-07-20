// app/_layout.tsx
import '@/global.css';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { useFonts } from 'expo-font';
import Provider from '@/components/provider/provider';
import { useBootstrap } from '@/hooks/use-bootstrap';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { Teko_300Light } from '@expo-google-fonts/teko/300Light';
import { Teko_400Regular } from '@expo-google-fonts/teko/400Regular';
import { Teko_500Medium } from '@expo-google-fonts/teko/500Medium';
import { Teko_600SemiBold } from '@expo-google-fonts/teko/600SemiBold';
import { Teko_700Bold } from '@expo-google-fonts/teko/700Bold';

import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme } from 'nativewind';
import { Platform } from 'react-native';
import { THEME } from '@/lib/theme';

import { MiniPlayer } from '@/components/ui/fragments/audio-player/mini-player';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});
export default function RootLayout() {
  return <AppBootstrap />;
}

function useAndroidSystemBars() {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';

  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (typeof NavigationBar.setStyle !== 'function') return;
    const btnStyle: 'light' | 'dark' = currentTheme === 'dark' ? 'light' : 'dark';
    NavigationBar.setStyle(btnStyle);
  }, [currentTheme]);
}

function AppBootstrap() {
  const [fontsLoaded, fontError] = useFonts({
    Schluber: require('@/assets/fonts/Schluber.otf'),
    Arabic: require('@/assets/fonts/NotoNaskhArabic-VariableFont_wght.ttf'),
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Teko_300Light,
    Teko_400Regular,
    Teko_500Medium,
    Teko_600SemiBold,
    Teko_700Bold,
  });

  useAndroidSystemBars();
  const { isReady } = useBootstrap();
  const canShow = fontsLoaded && isReady;

  React.useEffect(() => {
    if (!canShow && !fontError) return;
    SplashScreen.hideAsync();
  }, [canShow, fontError]);

  if (!canShow && !fontError) return null;

  return (
    <Provider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="surah" options={{ headerShown: false }} />
      </Stack>
      <MiniPlayer />
      <PortalHost />
    </Provider>
  );
}
