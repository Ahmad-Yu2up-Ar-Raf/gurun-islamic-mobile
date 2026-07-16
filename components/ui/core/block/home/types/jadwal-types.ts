// jadwal-types.ts
//
// ⚠️ Deprecated location — kept only so any existing import of this exact
// path doesn't break. The real, corrected definitions now live in
// types/prayer-types.ts (this file previously typed `tanggal_lengkap` as
// `Date`, which is wrong: the API returns a plain ISO string like
// "2026-06-01", not a Date instance — JSON has no Date type).
//
// Prefer importing from '@/types/prayer-types' directly in new code.

export type {
  JadwalShalatResponse as JadwalResponse,
  JadwalShalatData as Data,
  JadwalHarianRaw as Jadwal,
} from '../types/prayer-types';
