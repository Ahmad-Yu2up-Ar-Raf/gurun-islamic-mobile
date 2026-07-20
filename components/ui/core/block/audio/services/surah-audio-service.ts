import type { Surah } from '@/components/ui/core/block/surah/types/surah-type';
import type { QueueItem } from '@/components/ui/core/block/audio/types/audio-types';
import { getReciterName, getReciterSlug } from '@/components/ui/core/block/audio/utils/reciter-map';

const CDN_BASE = 'https://cdn.equran.id/audio-full';

function buildSurahAudioUrl(reciterCode: string, surahNumber: number): string {
  const slug = getReciterSlug(reciterCode);
  const padded = String(surahNumber).padStart(3, '0');
  return `${CDN_BASE}/${slug}/${padded}.mp3`;
}

export function buildSurahQueue(surah: Surah, reciterCode: string): QueueItem[] {
  const url = surah.audioFull[reciterCode] ?? buildSurahAudioUrl(reciterCode, surah.nomor);
  const artist = getReciterName(reciterCode);

  return [
    {
      id: `surah-${surah.nomor}`,
      surahNumber: surah.nomor,
      title: surah.namaLatin,
      url,
      artist,
    },
  ];
}

export function buildAyahQueue(surah: Surah, reciterCode: string): QueueItem[] {
  const artist = getReciterName(reciterCode);

  return surah.ayat.map((ayah, index) => ({
    id: `${surah.nomor}:${ayah.nomorAyat}`,
    surahNumber: surah.nomor,
    ayahNumber: ayah.nomorAyat,
    title: `${surah.namaLatin} : ${ayah.nomorAyat}`,
    url: ayah.audio[reciterCode] ?? '',
    artist,
  }));
}
