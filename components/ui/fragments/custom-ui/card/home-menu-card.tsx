// components/ui/fragments/custom-ui/card/home-menu-card.tsx
//
// Section navigasi fitur — dibangun dari scratch tanpa NavgateCard dependency.
// Minimalis: icon + label + chevron arrow, grouped dalam satu card.

import React from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import {
  Bot,
  BookOpen,
  HandMetal,
  Star,
  ScrollText,
  Newspaper,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Separator } from '@/components/ui/fragments/shadcn-ui/separator';
import { Card, CardContent } from '@/components/ui/fragments/shadcn-ui/card';
import { THEME } from '@/lib/theme';

// ─── Menu config ──────────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  icon: LucideIcon;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Dzikir', icon: HandMetal, route: '/(drawer)/dzikir' },
  { label: 'Doa', icon: BookOpen, route: '/(drawer)/doa' },
  { label: 'Asmaul Husna', icon: Star, route: '/(drawer)/asmaul_husna' },
  { label: 'Hadist', icon: ScrollText, route: '/(drawer)/hadist' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeMenuCard() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  return (
    <View className="gap-2">
      <Text className="px-1 font-poppins_semibold text-xs uppercase tracking-widest text-muted-foreground">
        Fitur
      </Text>

      <Card className="overflow-hidden rounded-2xl border border-border p-0">
        <CardContent className="p-0">
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;
            const IconComp = item.icon;

            return (
              <React.Fragment key={item.route}>
                <Pressable
                  onPress={() => router.push(item.route as any)}
                  className="flex-row items-center justify-between px-5 py-4 active:bg-accent">
                  {/* Left: icon + label */}
                  <View className="flex-row items-center gap-4">
                    <IconComp size={20} color={theme.mutedForeground} />
                    <Text className="font-poppins_medium text-[14.5px] text-foreground">
                      {item.label}
                    </Text>
                  </View>

                  {/* Right: chevron */}
                  <ChevronRight size={16} color={theme.mutedForeground} />
                </Pressable>

                {!isLast && <Separator />}
              </React.Fragment>
            );
          })}
        </CardContent>
      </Card>
    </View>
  );
}
