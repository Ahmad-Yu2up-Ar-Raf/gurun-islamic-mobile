// app/(drawer)/_layout.tsx
//
// ✅ Drawer adalah navigator utama.
// Semua top-level route (tabs, doa, article) terdaftar di sini.
// headerShown: false di semua screen → custom header via SCREEN_OPTIONS yang handle.
//
// ⚠️ initialRouteName="(tabs)" memastikan Home (tabs/index)
// yang pertama muncul saat app dibuka.

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { DrawerContentScrollView, type DrawerContentComponentProps } from 'expo-router/drawer';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Menu Config ──────────────────────────────────────────────────────────────

const DRAWER_MENU = [
  { label: '🏠  Home', route: '/(drawer)/(tabs)/', match: '/(tabs)' },
  { label: '📖  Quran', route: '/(drawer)/(tabs)/quran', match: '/quran' },
  { label: '🕌  Qibla', route: '/(drawer)/(tabs)/qibla', match: '/qibla' },
  { label: '🤲 Doa', route: '/(drawer)/doa', match: '/doa' },
  { label: '📚  Dzikir', route: '/(drawer)/dzikir', match: '/dzikir' },
  { label: '⭐ Asmaul Husna', route: '/(drawer)/asmaul_husna', match: '/asmaul_husna' },

  { label: '📖 Hadist', route: '/(drawer)/hadist', match: '/hadist' },

  { label: '⚙️  Settings', route: '/(drawer)/(tabs)/settings', match: '/settings' },
] as const;

// ─── Custom Drawer Content ────────────────────────────────────────────────────

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        paddingTop: insets.top + 8,
        backgroundColor: THEME[currentTheme].background,
      }}>
      {/* Branding */}
      <View className="px-5 pb-5">
        <Text className="font-schluber text-2xl tracking-tight">Gurun</Text>
        <Text className="mt-0.5 font-poppins_regular text-xs text-muted-foreground">
          Islamic Companion App
        </Text>
      </View>

      {/* Divider */}
      <View
        className="mx-4 mb-3"
        style={{
          height: 0.5,
          backgroundColor: THEME[currentTheme].mutedForeground,
          opacity: 0.2,
        }}
      />

      {/* Menu Items */}
      {/* <View className="gap-0.5 px-3">
        {DRAWER_MENU.map((item) => {
          const isActive = pathname.includes(item.match);
          return (
            <Pressable
              key={item.route}
              onPress={() => {
                router.push(item.route as any);
                props.navigation.closeDrawer();
              }}
              className="flex-row items-center rounded-xl px-4 py-3 active:opacity-60"
              style={{
                backgroundColor: isActive ? THEME[currentTheme].muted : 'transparent',
              }}>
              <Text
                className={
                  isActive
                    ? 'font-poppins_semibold text-sm text-secondary'
                    : 'font-poppins_medium text-sm'
                }>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View> */}
    </DrawerContentScrollView>
  );
}

// ─── Drawer Layout ────────────────────────────────────────────────────────────

export default function DrawerLayout() {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        // ✅ (tabs)/index.tsx = halaman pertama yang tampil
        initialRouteName="(tabs)"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false, // custom header yang handle
          drawerType: 'slide',
          drawerStyle: {
            backgroundColor: THEME[currentTheme].background,
            width: 280,
          },
          overlayColor: 'rgba(0,0,0,0.35)',
          swipeEnabled: true,
          swipeEdgeWidth: 50,
        }}>
        {/* ✅ (tabs) — entry point utama, berisi Home/Quran/Qibla/Settings */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            drawerItemStyle: { display: 'none' }, // hide — pakai CustomDrawerContent
          }}
        />

        {/* ✅ doa & article sekarang di dalam Drawer */}
        {/* MenuSheet di kedua screen ini juga bisa trigger drawer */}
        <Drawer.Screen
          name="doa"
          options={{
            drawerLabel: 'Doa',
            drawerItemStyle: { display: 'none' },
          }}
        />

        <Drawer.Screen
          name="dzikir"
          options={{
            drawerLabel: 'Dzikir',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="hadist"
          options={{
            drawerLabel: 'Hadist',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="asmaul_husna"
          options={{
            drawerLabel: 'Asmaul Husna',
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
