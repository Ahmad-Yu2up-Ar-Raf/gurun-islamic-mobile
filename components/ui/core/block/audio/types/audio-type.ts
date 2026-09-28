export type RepeatMode = 'off' | 'all' | 'one';

export type AudioStatus = 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'error';

export interface AudioTrack {
  surahNomor: number;
  namaLatin: string;
  namaArab: string;
  arti: string;
  jumlahAyat: number;
  reciterKey: string;
  audioUrl: string;
  artworkUrl?: string;
  durationSec?: number;
}

export interface AudioLockScreenMetadata {
  title: string;
  artist: string;
  albumTitle: string;
  artworkUrl?: string;
}

export interface PersistedAudioPrefs {
  reciterKey: string;
  shuffle: boolean;
  repeat: RepeatMode;
  lastSurahNomor: number | null;
  lastPositionSec: number;
}
