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

import { Text } from '../../shadcn-ui/text';
import { Button } from '../../shadcn-ui/button';
import { Datum } from '@/type/hadist-type';
import { Icon } from '../../shadcn-ui/icon';
import { MoreHorizontal } from 'lucide-react-native';

type componentProps = ViewProps & {
  className?: string;
  hadist: Datum;
};

export function HadistCard({ className, hadist, ...props }: componentProps) {
  return (
    <Card
      className={cn(
        'overflow-hnoden h-fit w-full flex-row items-center gap-0 rounded-none border-b border-border bg-background pb-6 transition-all duration-200',
        className
      )}
      {...props}>
      <CardContent className="h-fit w-full gap-5 rounded-none px-1">
        <CardHeader className="w-full flex-row items-center justify-between gap-9 p-0">
          <View className="w-full flex-1 flex-row content-center items-start gap-4 overflow-hidden px-0 py-0 text-center">
            <Text className="font-poppins_bold text-base">{hadist.no}</Text>
            <CardTitle className="w-fit flex-1 font-poppins_semibold text-sm tracking-tighter">
              {hadist.judul}
            </CardTitle>
          </View>
          <Button variant={'ghost'} className="size-4 h-fit p-0" size={'sm'}>
            <Icon as={MoreHorizontal} className="size-full" />
          </Button>
        </CardHeader>

        <CardDescription
          variant={'small'}
          className="line-clamp-2 w-full pl-8 text-right font-arabic text-base leading-relaxed text-foreground">
          {hadist.arab}
        </CardDescription>
        {/* MOSQUE (absolute, right background) */}

        <Text
          variant={'muted'}
          className="line-clamp-2 w-full text-justify font-poppins_medium text-xs leading-relaxed text-muted-foreground/80">
          {hadist.indo}
        </Text>
      </CardContent>
    </Card>
  );
}
