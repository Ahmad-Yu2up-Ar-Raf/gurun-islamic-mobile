import type { SuraType } from '../../quran/types/quran-type';
import type { Surah } from '../../surah/types/surah-type';
import type { AudioLockScreenMetadata, AudioTrack } from '../types/audio-type';
import { DEFAULT_RECITER_KEY, RECITERS, type ReciterKey } from '../data/reciters';

const CDN_BASE = 'https://cdn.equran.id/audio-full';

export const padSurahNomor = (nomor: number): string => String(nomor).padStart(3, '0');

export const isReciterKey = (key: string): key is ReciterKey => key in RECITERS;

export const resolveAudioUrl = (
  audioFull: { [key: string]: string } | undefined,
  reciterKey: string,
  surahNomor: number
): string => {
  const key: ReciterKey = isReciterKey(reciterKey) ? reciterKey : DEFAULT_RECITER_KEY;
  const payloadUrl = audioFull?.[key];
  if (payloadUrl) return payloadUrl;
  return `${CDN_BASE}/${RECITERS[key].slug}/${padSurahNomor(surahNomor)}.mp3`;
};

export const toAudioTrack = (
  surah: Pick<SuraType, 'nomor' | 'namaLatin' | 'nama' | 'arti' | 'jumlahAyat' | 'audioFull'>,
  reciterKey: string = DEFAULT_RECITER_KEY
): AudioTrack => ({
  surahNomor: surah.nomor,
  namaLatin: surah.namaLatin,
  namaArab: surah.nama,
  arti: surah.arti,
  jumlahAyat: surah.jumlahAyat,
  reciterKey: isReciterKey(reciterKey) ? reciterKey : DEFAULT_RECITER_KEY,
  audioUrl: resolveAudioUrl(surah.audioFull, reciterKey, surah.nomor),
});

export const toAudioTrackFromDetail = (
  surah: Pick<Surah, 'nomor' | 'namaLatin' | 'nama' | 'arti' | 'jumlahAyat' | 'audioFull'>,
  reciterKey: string = DEFAULT_RECITER_KEY
): AudioTrack => toAudioTrack(surah, reciterKey);

export const buildQueue = (
  surahs: SuraType[],
  startNomor: number,
  reciterKey: string = DEFAULT_RECITER_KEY
): { queue: AudioTrack[]; index: number } => {
  const ordered = [...surahs].sort((a, b) => a.nomor - b.nomor);
  const startIndex = Math.max(
    0,
    ordered.findIndex((s) => s.nomor === startNomor)
  );
  const queue = [...ordered.slice(startIndex), ...ordered.slice(0, startIndex)].map((s) =>
    toAudioTrack(s, reciterKey)
  );
  return { queue, index: 0 };
};

export const remapQueueReciter = (queue: AudioTrack[], reciterKey: string): AudioTrack[] => {
  const key: ReciterKey = isReciterKey(reciterKey) ? reciterKey : DEFAULT_RECITER_KEY;
  return queue.map((track) => ({
    ...track,
    reciterKey: key,
    audioUrl: `${CDN_BASE}/${RECITERS[key].slug}/${padSurahNomor(track.surahNomor)}.mp3`,
  }));
};

export const toLockScreenMetadata = (track: AudioTrack): AudioLockScreenMetadata => ({
  title: `QS. ${track.namaLatin}`,
  artist: RECITERS[track.reciterKey as ReciterKey]?.label ?? track.reciterKey,
  albumTitle: 'Gurun · Quran',
  ...(track.artworkUrl ? { artworkUrl: track.artworkUrl } : {}),
});
