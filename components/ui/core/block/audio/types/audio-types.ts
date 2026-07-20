export type ReciterCode = '01' | '02' | '03' | '04' | '05' | '06';

export interface QueueItem {
  id: string;
  surahNumber: number;
  ayahNumber?: number;
  title: string;
  url: string;
  artist: string;
  duration?: number;
}

export type QueueMode = 'ayah' | 'surah';

export interface QueueState {
  mode: QueueMode;
  surahNumber: number;
  reciterCode: ReciterCode;
  items: QueueItem[];
  currentIndex: number;
}

export type PlaybackStatus =
  | { status: 'idle' }
  | { status: 'loading'; track: QueueItem }
  | { status: 'buffering'; track: QueueItem }
  | { status: 'playing'; track: QueueItem; position: number; duration: number }
  | { status: 'paused'; track: QueueItem; position: number; duration: number }
  | { status: 'seeking'; track: QueueItem }
  | { status: 'completed'; track: QueueItem }
  | { status: 'error'; track: QueueItem | null; error: string };
