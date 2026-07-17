// components/ProgressReadCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React, { useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { StyleSheet, useWindowDimensions, View, ViewProps } from 'react-native';
import { Text } from '../../../../fragments/shadcn-ui/text';
 
import QuranSVG from '@/components/ui/fragments/svg/quran-animation';

const CARD_HEIGHT = 125; // visual card height (px)
const CARD_HORIZONTAL_PADDING = 11; // padding inside left content
const MOSQUE_SCALE_MULT = 1.15; // mosque width = mosqueHeight * multiplier
const MOSQUE_RIGHT_OVERFLOW = -20; // negative offset to slightly overflow right edge
const MOSQUE_BOTTOM_OVERFLOW = -51; // negative offset to slightly overflow bottom

export function ProgressReadCard({ className, ...props }: ViewProps) {
  const { width: screenWidth } = useWindowDimensions();

  const CARD_TOTAL_WIDTH = Math.round(screenWidth - CARD_HORIZONTAL_PADDING * 1); // used for gradient width

  // mosque size: mosque will be slightly taller than CARD_HEIGHT for aesthetic overlap
  const mosqueHeight = Math.round(CARD_HEIGHT * 1.6);
  const mosqueWidth = Math.round(mosqueHeight * MOSQUE_SCALE_MULT);

  // stable gradient id
  const gradientIdRef = useRef<string>(`rg-${Math.random().toString(36).slice(2, 9)}`);
  const gradientId = gradientIdRef.current;
  // const { lastRead } = useLastRead();

  return (
    <Card
      className={cn('w-full overflow-hidden p-0', className)}
      style={{ height: CARD_HEIGHT }}
      {...props}>
      <CardContent
        className="h-full w-full p-0"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        }}>
        <CardHeader className="relative z-40 w-full gap-3.5 px-7 py-0">
          <Text className="m-0 p-0 font-poppins_medium text-xs tracking-tight text-foreground/70">
            Daily Quran
          </Text>

          <View className="gap-0">
            <CardTitle className="font-teko_semibold text-4xl tracking-tighter text-secondary">
              Bismillah
            </CardTitle>

            <CardDescription className="font-poppins_medium text-xs text-muted-foreground">
              Time to recite
            </CardDescription>
          </View>
        </CardHeader>
      </CardContent>
      <View className="absolute bottom-[-40] right-[-10] z-0  size-44">
        <QuranSVG />
      </View>
    </Card>
  );
}
