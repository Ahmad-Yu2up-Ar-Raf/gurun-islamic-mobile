import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';

import { Button } from '../../fragments/shadcn-ui/button';

import { Icon } from '../../fragments/shadcn-ui/icon';

import { router } from 'expo-router';

import { cn } from '@/lib/utils';
import Animated, { type SharedValue } from 'react-native-reanimated';

import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { LucideIcon, Search } from 'lucide-react-native';
import { MenuSheet } from './menu-sheet';

export interface ScreenOptionsParams {
  title?: string;
  transparent?: boolean;
  leftIcon?: LucideIcon;
  leftAction?: () => void;
  rightIcon?: LucideIcon;

  RigthComponent?: React.ReactNode | undefined;
  rightAction?: () => void;
  className?: string;
  scrollAnimatedPosition?: SharedValue<number>;
  scrollTriggerPoint?: number;
  scrollAnimationType?: 'fade' | 'slide' | 'scale';
  children?: React.ReactNode;
}

interface HeaderComponentProps extends ScreenOptionsParams {}

export function HeaderComponent({
  title,
  transparent = true,
  RigthComponent,
  leftIcon: LeftIcon,
  leftAction,
  children,
  rightIcon: RightIcon,
  rightAction,
  className,
  scrollAnimatedPosition,
  scrollTriggerPoint = 100,
  scrollAnimationType = 'slide',
}: HeaderComponentProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';

  const handleLeave = () => {
    router.back();
  };

  const bgColor = transparent ? 'transparent' : THEME[currentTheme].background;

  const animatedTitleStyle = useScrollAnimation(
    scrollAnimatedPosition,
    scrollTriggerPoint,
    scrollAnimationType
  );
  return (
    <>
      <View
        style={{ paddingTop: insets.top + 10, backgroundColor: bgColor }}
        className={cn('flex-row items-center justify-between px-6 pb-3', className)}>
        <View className="z-50 w-10 items-start" pointerEvents="box-none">
          {LeftIcon ? (
            <Button
              variant={'ghost'}
              onPress={leftAction ?? handleLeave}
              size="icon"
              className="size-12 rounded-full">
              <Icon as={LeftIcon} className="size-6" />
            </Button>
          ) : (
            <MenuSheet />
          )}
        </View>
        {title || scrollAnimatedPosition ? (
          <View
            className="absolute inset-0 top-1/2 -translate-y-4 transform items-center justify-center px-5 pb-0"
            style={{ paddingTop: insets.top + 5 }}>
            <Animated.View
              style={animatedTitleStyle}
              className="flex-1 items-center justify-center">
              <Text
                variant="h4"
                className="line-clamp-1 text-center font-teko_semibold text-2xl tracking-tighter"
                numberOfLines={1}>
                {title}
              </Text>
            </Animated.View>
          </View>
        ) : title ? (
          <View
            className="absolute inset-0 top-1/2 -translate-y-4 transform items-center justify-center px-5 pb-0"
            style={{ paddingTop: insets.top + 5 }}>
            <View className="flex-1 items-center justify-center">
              <Text
                variant="h4"
                className="line-clamp-1 text-center font-teko_semibold text-2xl tracking-tighter"
                numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>
        ) : (
          <View className="items-center justify-center gap-7 text-center">
            <View className="w-fit flex-row items-center gap-1">
              {/* <View className="size-12 scale-[.70]">
                <LogoAdaptive />
              </View> */}

              <Text
                variant="h3"
                className="font-figtree_bold text-center text-2xl tracking-tighter text-primary">
                LiveUp
              </Text>
            </View>
          </View>
        )}

        <View className="z-50 items-end" pointerEvents="box-none">
          {RigthComponent ? (
            RigthComponent
          ) : RightIcon ? (
            <Button
              variant={'ghost'}
              onPress={rightAction ?? handleLeave}
              size="icon"
              className={cn(`size-10 rounded-full`)}>
              <Icon as={RightIcon} className="size-5" />
            </Button>
          ) : (
            <Button variant={'ghost'} size="icon" className={cn(`size-10 rounded-full`)}>
              <Icon as={Search} className="size-5" />
            </Button>
          )}
        </View>
      </View>

      {children}
    </>
  );
}

export const SCREEN_OPTIONS = ({
  title,
  transparent = true,
  leftIcon,
  leftAction,
  rightIcon,
  RigthComponent,
  rightAction,
  className,
  children,
  scrollAnimatedPosition,
  scrollTriggerPoint,
  scrollAnimationType,
}: ScreenOptionsParams) => ({
  headerShown: true,
  header: () => (
    <HeaderComponent
      title={title}
      className={className}
      transparent={transparent}
      leftIcon={leftIcon}
      leftAction={leftAction}
      rightIcon={rightIcon}
      RigthComponent={RigthComponent}
      children={children}
      rightAction={rightAction}
      scrollAnimatedPosition={scrollAnimatedPosition}
      scrollTriggerPoint={scrollTriggerPoint}
      scrollAnimationType={scrollAnimationType}
    />
  ),
});
