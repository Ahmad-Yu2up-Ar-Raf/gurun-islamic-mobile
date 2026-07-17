import { View } from 'react-native';
import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { ChevronRight, LogOut } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/fragments/shadcn-ui/card';
import { MenuDetail } from '@/type';
import { Separator } from '../../shadcn-ui/separator';

type componentProps = {
  MenuList: MenuDetail[];
  className?: string;
  buttonClassName?: string;
  hideLastSeparator?: boolean;
  // onSignOut(): Promise<void>;
};

export default function MenuCard({
  MenuList,
  className,
  buttonClassName,
  // onSignOut,
  hideLastSeparator = false,
}: componentProps) {
  return (
    <Card
      className={cn(
        'm-auto h-fit w-full content-start items-start justify-start overflow-hidden rounded-xl border-0 p-0 shadow-none bg-transparent',
        className
      )}>
      <CardContent className="w-full overflow-hidden p-0">
        {MenuList.map((detail, i) => {
          const isLastItem = i === MenuList.length - 1;
          const showSeparator = hideLastSeparator ? true : !isLastItem;

          return (
            <React.Fragment key={`menu-item-${i}`}>
              <Button
                id="menu-button"
                variant="outline"
                onPress={detail.onPress}
                className={cn(
                  'h-fit w-full justify-between rounded-2xl border-0 bg-background px-0 py-4 active:bg-accent dark:bg-background dark:active:bg-input/50',
                  buttonClassName
                )}>
                <View className="flex-row items-center gap-5">
                  {detail.icon && (
                    <View className="rounded-2xl bg-primary/10 p-2">
                      <Icon as={detail.icon} size={21} className="rounded-xl text-primary" />
                    </View>
                  )}
                  <Text variant="h3" className="font-poppins_medium text-base">
                    {detail.Label}
                  </Text>
                </View>

                {detail.rigthComponent ? (
                  detail.rigthComponent
                ) : (
                  <View className="flex-row items-center gap-1">
                    <Text variant="p" className="m-0 p-0">
                      {detail.Value}
                    </Text>
                    <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
                  </View>
                )}
              </Button>
            </React.Fragment>
          );
        })}
        <Separator className="my-4 w-full bg-muted-foreground/10" />
        <Button
          id="log-out-button"
          variant="outline"
          // onPress={onSignOut}
          className={cn(
            'h-fit w-full justify-between rounded-2xl border-0 bg-background px-0 py-4 active:bg-accent dark:bg-background dark:active:bg-input/50',
            buttonClassName
          )}>
          <View className="flex-row items-center gap-5">
            <View className="rounded-2xl bg-destructive/10 p-2">
              <Icon as={LogOut} size={21} className="rounded-xl text-destructive" />
            </View>

            <Text variant="h3" className="font-poppins_medium text-base text-destructive">
              Log Out
            </Text>
          </View>
        </Button>
      </CardContent>
    </Card>
  );
}
