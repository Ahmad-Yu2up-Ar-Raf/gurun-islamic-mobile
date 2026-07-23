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

import { BasmallahDark, Basmallah } from '../../../../fragments/svg/basmalah';
import { useColorScheme } from 'nativewind';

type componentProps = ViewProps & {
  className?: string;
  namaLatin: string | undefined;
  arti: string | undefined;
  kategori: string | undefined;
  jumlahAyat: number | undefined;
};

export function SuraHeader({
  className,
  namaLatin,
  arti,
  kategori,
  jumlahAyat,
  ...props
}: componentProps) {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  return (
    <Card className={cn('mb-5 w-full p-0 pb-0 pt-4', className)} {...props}>
      <CardContent className="h-fit w-full gap-2 p-0">
        {/* LEFT content: flex 1 with right padding reserved for mosque */}
        <CardHeader className="relative z-40 w-full gap-2 px-0 py-0 text-center">
          <CardTitle className="text-center font-poppins_semibold text-2xl tracking-tighter text-secondary">
            {namaLatin}
          </CardTitle>

          <CardDescription className="px-16 text-center font-poppins_medium text-xs text-muted-foreground">
            {arti} • {jumlahAyat} Ayah
          </CardDescription>
        </CardHeader>
        <View className="w-full flex-row items-center justify-center gap-2.5 text-center">
          <View>
            {currentTheme === 'light' ? (
              <Basmallah className="w-3/4" />
            ) : (
              <BasmallahDark className="w-3/4" />
            )}
          </View>
        </View>
        {/* FULL-WIDTH RADIAL GRADIENT (absolute, covers whole card width) */}
      </CardContent>
      {/* <View className="absolute -bottom-2 right-1 z-50">
        <Button className="size-11 w-fit rounded-2xl p-3">
          <Icon as={Play} className="size-full fill-primary-foreground text-primary-foreground" />
        </Button>
      </View> */}
    </Card>
  );
}
