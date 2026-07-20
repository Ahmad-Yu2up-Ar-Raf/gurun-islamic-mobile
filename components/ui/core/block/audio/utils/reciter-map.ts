import type { ReciterCode } from '@/components/ui/core/block/audio/types/audio-types';

export interface ReciterInfo {
  code: ReciterCode;
  name: string;
  slug: string;
}

export const RECITERS: ReciterInfo[] = [
  { code: '01', name: 'Abdullah Al-Juhany', slug: 'Abdullah-Al-Juhany' },
  { code: '02', name: 'Abdul Muhsin Al-Qasim', slug: 'Abdul-Muhsin-Al-Qasim' },
  { code: '03', name: 'Abdurrahman As-Sudais', slug: 'Abdurrahman-as-Sudais' },
  { code: '04', name: 'Ibrahim Al-Dossari', slug: 'Ibrahim-Al-Dossari' },
  { code: '05', name: 'Misyari Rasyid Al-Afasi', slug: 'Misyari-Rasyid-Al-Afasi' },
  { code: '06', name: 'Yasser Al-Dosari', slug: 'Yasser-Al-Dosari' },
];

export function getReciterByCode(code: string): ReciterInfo | undefined {
  return RECITERS.find((r) => r.code === code);
}

export function getReciterName(code: string): string {
  return getReciterByCode(code)?.name ?? '';
}

export function getReciterSlug(code: string): string {
  return getReciterByCode(code)?.slug ?? '';
}
