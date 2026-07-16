import React from 'react';
import { Wrapper } from '../layout/wrapper';

import { Stack } from 'expo-router';

import { batasiKata } from '@/hooks/use-word';
import {
  Bell,
  ChevronLeft,
  Edit,
  LogOutIcon,
  Moon,
  Pen,
  Pencil,
  PenLine,
  Settings,
  Share2,
  Shield,
} from 'lucide-react-native';
import { View } from 'react-native';
import { Button } from '../../fragments/shadcn-ui/button';
import { Icon } from '../../fragments/shadcn-ui/icon';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Text } from '../../fragments/shadcn-ui/text';
import { cn } from '@/lib/utils';
import { MenuDetail } from '@/type';
import { Switch } from '../../fragments/shadcn-ui/switch';
import MenuCard from '../../fragments/custom-ui/card/menu-card';
import { SCREEN_OPTIONS } from '../layout/nav';
export default function ProfileBlock() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const menuDetails2: MenuDetail[] = [
    {
      Label: 'Settings',
      icon: Settings,
    },

    {
      Label: 'Dark Mode',
      icon: Moon,
      rigthComponent: (
        <Switch
          checked={colorScheme === 'dark'}
          onCheckedChange={toggleColorScheme}
          id="toggle-dark-mode"
          nativeID="toggle-dark-mode"
        />
      ),

      onPress: toggleColorScheme,
    },

    {
      Label: 'Mode liburan',
      icon: Bell,
    },
  ];

  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primaryForeground;

  return (
    <>
      <Stack.Screen
        options={SCREEN_OPTIONS({
          title: 'Profile',
          leftIcon: ChevronLeft,
          rightIcon: Settings,
        })}
      />
      <Wrapper
        className="flex-1 content-start items-start justify-start gap-0 pt-11"
        edges={['bottom', 'left', 'right']}>
        <MenuCard MenuList={menuDetails2} />
      </Wrapper>
    </>
  );
}
