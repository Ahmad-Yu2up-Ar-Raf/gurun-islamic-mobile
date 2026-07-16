// components/ui/core/block/home-block.tsx

import { Dimensions, View, useWindowDimensions } from 'react-native';
import React from 'react';

import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import MosqueBackground from '@/components/ui/fragments/svg/mosque';

import { LinearGradient } from 'expo-linear-gradient';
import { useCurrentTime } from '@/hooks/use-current-time';

import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Separator } from '@/components/ui/fragments/shadcn-ui/separator';
const SCREEN_WIDTH = Dimensions.get('window').width;

const HERO_HEIGHT = SCREEN_WIDTH * 0.76;

type componentsProps = {
  nextPrayer: string;
  remaining: string;
  city: string;
  dateString: string;
};

export default function HeroSection({ nextPrayer, remaining, city, dateString }: componentsProps) {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const backgroundColor = THEME[currentTheme].background;
  const currentTime = useCurrentTime();
  return (
    <View
      style={{ height: HERO_HEIGHT, position: 'relative', overflow: 'visible' }}
      className="mb-16 items-center justify-center">
      <BackgroundGradient backgroundColor={backgroundColor} />

      {/* Jam besar */}
      <View className="absolute z-10 w-full flex-row">
        <Text className="z-10 w-1/2 gap-1 pr-7 text-right font-schluber text-8xl uppercase text-secondary">
          {currentTime.hour}
        </Text>
        <Text className="z-10 w-1/2 gap-1 pl-7 text-left font-schluber text-8xl uppercase text-secondary">
          {currentTime.minute}
        </Text>
      </View>
      <Text className="absolute z-10 mb-1 ml-1 text-center font-schluber text-8xl uppercase text-secondary">
        :
      </Text>

      {/* Info shalat + lokasi */}
      <View className="absolute -bottom-5 z-[999999999] flex-row">
        <View className="flex-1 gap-1 pr-4 text-right">
          <Text variant="muted" className="text-right text-xs uppercase">
            remaining time
          </Text>
          <Text
            variant="h4"
            className="text-right font-poppins_semibold text-base capitalize tracking-tighter">
            {nextPrayer} {remaining}
          </Text>
        </View>
        <Separator className="h-full w-0.5 bg-secondary/10" />
        <View className="flex-1 gap-1 pl-4 text-left">
          <Text variant="muted" className="line-clamp-1 text-left text-xs uppercase">
            {dateString || '...'}
          </Text>
          <Text className="line-clamp-1 text-left font-poppins_semibold text-base tracking-tighter">
            {city}
          </Text>
        </View>
      </View>

      {/* Masjid */}
      <View className="absolute -bottom-6 z-[20] scale-110">
        <MosqueBackground />
      </View>

      {/* Gradient fade */}
      <LinearGradient
        colors={
          currentTheme === 'dark'
            ? ['hsl(0 0% 11.7647%)', 'hsl(0 0% 7.0588%)']
            : ['hsl(37, 79%, 89%)', 'hsl(26, 54%, 97%)']
        }
        locations={[0, 1]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 300,
          zIndex: 1005,
          bottom: -60,
        }}
      />
    </View>
  );
}

// ─── BackgroundGradient ───────────────────────────────────────────────────────

const BackgroundGradient = ({ backgroundColor }: { backgroundColor?: string }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${width} ${HERO_HEIGHT}`}
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="radialGradient"
            gradientUnits="userSpaceOnUse"
            cx={width / 2}
            cy={HERO_HEIGHT * 0.88}
            r={width * 0.9}>
            <Stop offset="0" stopColor="hsl(37, 100%, 52%)" stopOpacity={1} />
            <Stop offset="0.4" stopColor="hsl(37, 100%, 60%)" stopOpacity={0.8} />
            <Stop offset="0.75" stopColor={backgroundColor} stopOpacity={6} />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={HERO_HEIGHT} fill="url(#radialGradient)" />
      </Svg>
    </View>
  );
};
