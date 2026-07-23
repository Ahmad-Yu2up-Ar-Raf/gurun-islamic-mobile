// components/ProgressReadCard.tsx (atau file ayat-card.tsx lu)
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react'; // ✅ Hapus import useState
import { cn } from '@/lib/utils';
import { View, ViewProps } from 'react-native';
import { Text } from '../../../../fragments/shadcn-ui/text';

import { Bookmark, MoreHorizontal, PlayCircleIcon, Share2Icon } from 'lucide-react-native';
import { Button } from '../../../../fragments/shadcn-ui/button';
import { Icon } from '../../../../fragments/shadcn-ui/icon';
import {
  addBookmark,
  BookmarkType,
  removeBookmark,
  useBookmarkStore, // ✅ Import ini biar kita bisa subscribe langsung
} from '../store/use-bookmark-store';
import { Ayah } from '../types/surah-type';

type componentProps = ViewProps & {
  className?: string;
  ayat: Ayah;
  surahNomor: string;
  surahNama: string;
};

export function AyatCard({ className, surahNomor, surahNama, ayat, ...props }: componentProps) {
  const audio = ayat.audio['01'] ?? ayat.audio['02']; // ✅ audio belum dipakai tapi aman
  const id = `${surahNomor}:${ayat.nomorAyat}`;
  const audioId = `${surahNomor}-${ayat.nomorAyat}`; // ✅ audioId belum dipakai tapi aman

  // ✅ PERBAIKAN UTAMA: Kita membuang isBookmarked dan useState!
  // Kita subscribe langsung secara spesifik. Jika store berubah, ayat ini akan mengecek
  // apakah ID miliknya ada di dalam array Bookmark global.
  const isSaved = useBookmarkStore((state) =>
    state.Bookmark.some((bookmark) => bookmark.id === id)
  );

  const BookmarkData: BookmarkType = {
    ...ayat,
    id: id,
  };

  const ToggleBookmark = () => {
    // ✅ Kita tidak perlu lagi mengatur setSaved manual secara lokal.
    // Zustand yang akan mengurus UI perubahannya secara otomatis.
    if (isSaved) {
      removeBookmark(id);
    } else {
      addBookmark(BookmarkData);
    }
  };

  return (
    <>
      <Card
        className={cn(
          'mb-2.5 w-full gap-1 rounded-none border-b border-b-muted-foreground/10 bg-background transition-all duration-200',
          className
        )}
        {...props}>
        <CardContent className="w-full items-center justify-between gap-8 px-1">
          <View className="w-full flex-row items-center justify-between">
            <View className="content-center overflow-hidden rounded-2xl bg-primary/10 px-4 py-0.5 text-center">
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
              <Button variant={'ghost'} size={'icon'} className="size-5 h-fit p-0">
                <Icon className="size-full text-muted-foreground" as={PlayCircleIcon} />
              </Button>
              <Button
                onPress={ToggleBookmark}
                variant={'ghost'}
                size={'sm'}
                className="size-5 h-fit p-0">
                <Icon
                  as={Bookmark}
                  className={cn(
                    'size-full text-muted-foreground',
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
