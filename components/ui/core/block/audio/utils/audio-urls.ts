import { getReciterSlug } from '@/components/ui/core/block/audio/utils/reciter-map';

const CDN_BASE = 'https://cdn.equran.id/audio-full';

export function buildSurahUrl(reciterCode: string, surahNumber: number): string {
  const slug = getReciterSlug(reciterCode);
  const padded = String(surahNumber).padStart(3, '0');
  return `${CDN_BASE}/${slug}/${padded}.mp3`;
}
