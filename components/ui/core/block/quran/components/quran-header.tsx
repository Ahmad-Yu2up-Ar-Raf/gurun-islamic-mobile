import { View } from 'react-native';
import React from 'react';
import { Text } from '../../../../fragments/shadcn-ui/text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/fragments/shadcn-ui/tabs';
import { ProgressReadCard } from './progress-card';
import { cn } from '@/lib/utils';

export default function QuranHeader() {
  const [value, setValue] = React.useState('surah');

  return (
    <View className="mb-2 gap-6 px-1.5">
      <ProgressReadCard />

      {/* <Text variant={'h3'} className="font-poppins_semibold tracking-tighter">
          Al Quran
        </Text> */}
      <Tabs value={value} onValueChange={setValue} className="w-full px-1">
        <TabsList className="w-full gap-0 bg-background p-0">
          <TabsTrigger value="surah" className="w-full flex-1">
            <Text
              className={cn(
                'text-secondary',
                value == 'surah' && 'font-poppins_bold text-secondary dark:text-secondary'
              )}>
              Surah
            </Text>
          </TabsTrigger>
          <TabsTrigger value="juz" className="w-full flex-1">
            <Text
              className={cn(
                'text-secondary',
                value == 'juz' && 'font-poppins_bold text-secondary dark:text-secondary'
              )}>
              Juz
            </Text>
          </TabsTrigger>
          <TabsTrigger value="page" className="w-full flex-1">
            <Text
              className={cn(
                'text-secondary',
                value == 'page' && 'font-poppins_bold text-secondary dark:text-secondary'
              )}>
              Page
            </Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </View>
  );
}
