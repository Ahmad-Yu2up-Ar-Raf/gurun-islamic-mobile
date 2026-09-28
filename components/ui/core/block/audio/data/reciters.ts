export const RECITERS = {
  '01': { slug: 'Abdullah-Al-Juhany', label: 'Abdullah Al-Juhany' },
  '02': { slug: 'Abdul-Muhsin-Al-Qasim', label: 'Abdul Muhsin Al-Qasim' },
  '03': { slug: 'Abdurrahman-as-Sudais', label: 'Abdurrahman as-Sudais' },
  '04': { slug: 'Ibrahim-Al-Dossari', label: 'Ibrahim Al-Dossari' },
  '05': { slug: 'Misyari-Rasyid-Al-Afasi', label: 'Misyari Rasyid Al-Afasi' },
  '06': { slug: 'Yasser-Al-Dosari', label: 'Yasser Al-Dosari' },
} as const;

export type ReciterKey = keyof typeof RECITERS;

export const RECITER_KEYS = Object.keys(RECITERS) as ReciterKey[];

export const DEFAULT_RECITER_KEY: ReciterKey = '05';
