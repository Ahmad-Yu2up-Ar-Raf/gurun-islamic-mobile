import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Text } from '../../../../fragments/shadcn-ui/text';

import { Bookmark, CirclePause, CirclePlay, MoreHorizontal, Share2Icon } from 'lucide-react-native';
import { Button } from '../../../../fragments/shadcn-ui/button';
import { Icon } from '../../../../fragments/shadcn-ui/icon';
import {
  addBookmark,
  BookmarkType,
  removeBookmark,
  useBookmarkStore,
} from '../store/use-bookmark-store';
import type { Ayah, Surah } from '../types/surah-type';
import {
  useAudioStore,
  useCurrentTrack,
} from '@/components/ui/core/block/audio/store/use-audio-store';

type componentProps = ViewProps & {
  className?: string;
  ayat: Ayah;
  surah: Surah;
  ayahIndex: number;
  surahNomor: string;
  surahNama: string;
};

export function AyatCard({
  className,
  surahNomor,
  surahNama,
  surah,
  ayahIndex,
  ayat,
  ...props
}: componentProps) {
  const id = `${surahNomor}:${ayat.nomorAyat}`;
  const isSaved = useBookmarkStore((state) =>
    state.Bookmark.some((bookmark) => bookmark.id === id)
  );

  const playAyah = useAudioStore((s) => s.playAyah);
  const currentTrack = useCurrentTrack();
  const isActive = currentTrack?.id === id;
  const isPlaying = isActive;

  const BookmarkData: BookmarkType = {
    ...ayat,
    id: id,
  };

  const ToggleBookmark = () => {
    if (isSaved) {
      removeBookmark(id);
    } else {
      addBookmark(BookmarkData);
    }
  };

  const handlePlay = () => {
    playAyah(surah, ayahIndex);
  };

  return (
    <>
      <Card
        className={cn(
          'mb-2.5 w-full gap-1 rounded-none border-b border-b-muted-foreground/10 transition-all duration-200',
          isActive ? 'bg-primary/5' : 'bg-background',
          className
        )}
        {...props}>
        <CardContent className="w-full items-center justify-between gap-8 px-1">
          <View className="w-full flex-row items-center justify-between">
            <View
              className={cn(
                'content-center overflow-hidden rounded-2xl px-4 py-0.5 text-center',
                isActive ? 'bg-primary/20' : 'bg-primary/10'
              )}>
              <Text className="m-auto font-poppins_semibold text-sm">
                {surahNomor}:{ayat.nomorAyat}
              </Text>
            </View>
            <Button variant={'ghost'} className="size-4 h-fit p-0" size={'sm'}>
              <Icon as={MoreHorizontal} className="size-full" />
            </Button>
          </View>

          <View className="w-full gap-7">
            <CardHeader className="w-full gap-5 p-0">
              <CardTitle
                variant={'muted'}
                className="w-full text-right font-arabic text-2xl leading-relaxed text-foreground">
                {ayat.teksArab}
              </CardTitle>

              <CardDescription className="w-full text-left font-poppins_medium text-sm leading-relaxed text-secondary">
                {ayat.teksLatin}
              </CardDescription>
              <Text className="w-full text-left font-poppins_regular text-sm leading-relaxed text-muted-foreground">
                {ayat.teksIndonesia}
              </Text>
            </CardHeader>

            <CardFooter className="w-full flex-row items-center justify-start gap-5 p-0">
              <Button
                onPress={handlePlay}
                variant={'ghost'}
                size={'icon'}
                className="size-5 h-fit p-0">
                <Icon
                  className={cn('size-full', isPlaying ? 'text-primary' : 'text-muted-foreground')}
                  as={isPlaying ? CirclePause : CirclePlay}
                />
              </Button>
              <Button
                onPress={ToggleBookmark}
                variant={'ghost'}
                size={'sm'}
                className="size-5 h-fit p-0">
                <Icon
                  as={Bookmark}
                  className={cn(
                    'size-full',
                    isSaved
                      ? 'fill-primary text-primary dark:fill-secondary dark:text-secondary'
                      : 'text-muted-foreground'
                  )}
                />
              </Button>
              <Button variant={'ghost'} size={'sm'} className="size-5 h-fit p-0.5">
                <Icon as={Share2Icon} className="size-full text-muted-foreground" />
              </Button>
            </CardFooter>
          </View>
        </CardContent>
      </Card>
    </>
  );
}
