// components/ProgressReadCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';

import { Text } from '../../../../fragments/shadcn-ui/text';

import { Datum } from '@/type/dzikir-type';
import { MoreHorizontal } from 'lucide-react-native';
import { Button } from '../../../../fragments/shadcn-ui/button';
import { Icon } from '../../../../fragments/shadcn-ui/icon';

type componentProps = ViewProps & {
  className?: string;
  dzikir: Datum;
  index: number;
};

export function DzikirCard({ className, dzikir, index, ...props }: componentProps) {
  return (
    <Card
      className={cn(
        'overflow-hnoden h-fit w-full flex-row items-center gap-0 rounded-none border-b border-border bg-background pb-6 transition-all duration-200',
        className
      )}
      {...props}>
      <CardContent className="h-fit w-full gap-9 rounded-none px-1">
        <View className="w-full flex-row items-center justify-between">
          <View className="content-center overflow-hidden rounded-2xl bg-primary/10 px-4 py-0.5 text-center">
            <Text className="m-auto font-poppins_medium text-sm capitalize">
              {dzikir.ulang} - {dzikir.type}
            </Text>
          </View>
          <Button variant={'ghost'} className="size-4 h-fit p-0" size={'sm'}>
            <Icon as={MoreHorizontal} className="size-full" />
          </Button>
        </View>
        <CardHeader className="relative z-40 w-full flex-row items-center gap-5 p-0 py-0">
          <CardTitle className="line-clamp-2 w-full pl-8 text-right font-arabic text-base leading-relaxed text-foreground">
            {dzikir.arab}
          </CardTitle>
        </CardHeader>
        <CardDescription
          variant={'small'}
          className="line-clamp-2 w-full text-justify font-poppins_medium text-xs leading-relaxed text-muted-foreground/80">
          {dzikir.indo}
        </CardDescription>
        {/* MOSQUE (absolute, right background) */}
      </CardContent>
    </Card>
  );
}
