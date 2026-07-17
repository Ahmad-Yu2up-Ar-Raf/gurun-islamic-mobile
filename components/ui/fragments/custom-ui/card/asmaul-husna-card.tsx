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

import { Datum } from '@/type/asmaul-husna';

type componentProps = ViewProps & {
  className?: string;
  asmaulHusna: Datum;
};

export function AsmaulHusnaCard({ className, asmaulHusna, ...props }: componentProps) {
  return (
    <Card
      className={cn(
        'mb-3 h-full w-full flex-1 flex-row items-center gap-0 rounded-2xl border border-border bg-background p-3 transition-all duration-200',
        className
      )}
      {...props}>
      <CardContent className="h-full w-full gap-1 rounded-none p-0 px-1">
        <CardHeader className="relative z-40 w-full flex-row items-center gap-5 p-0 py-0">
          {/* <Text className="font-poppins_bold text-base">{asmaulHusna.no}</Text> */}

          <CardTitle className="w-fit flex-1 font-poppins_semibold text-sm tracking-tighter">
            {asmaulHusna.urutan}
          </CardTitle>
        </CardHeader>
        <CardDescription
          variant={'small'}
          className="line-clamp-2 w-full pl-8 text-right font-arabic text-lg leading-relaxed text-foreground">
          {asmaulHusna.arab}
        </CardDescription>
        {/* MOSQUE (absolute, right background) */}

        <Text
          variant={'default'}
          className="text -foreground line-clamp-2 w-full font-poppins_medium text-xs leading-relaxed">
          {asmaulHusna.latin}
        </Text>
        <Text
          variant={'muted'}
          className="tracing-tigther line-clamp-1 w-full font-poppins_medium text-[9px] leading-relaxed text-muted-foreground/80">
          {asmaulHusna.arti}
        </Text>
      </CardContent>
    </Card>
  );
}
