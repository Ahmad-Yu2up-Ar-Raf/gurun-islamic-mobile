// types/prayer-types.ts
//
// Single source of truth for every prayer/location-related shape in the app.
// Split into three sections: (1) raw equran.id API responses, (2) location
// store shape, (3) the derived/application-friendly model UI actually consumes.

/* ============================================================
 * 1) RAW API RESPONSES (equran.id) — never expose these to UI
 * ============================================================ */

export interface ProvinsiListResponse {
  code: number;
  message: string;
  data: string[];
}

export interface KabkotaListResponse {
  code: number;
  message: string;
  data: string[];
}

/** One day entry inside the monthly schedule, exactly as the API returns it. */
export interface JadwalHarianRaw {
  tanggal: number;
  /** ISO date string, e.g. "2026-06-01" — the API sends a string, NOT a Date. */
  tanggal_lengkap: string;
  hari: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface JadwalShalatData {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: JadwalHarianRaw[];
}

export interface JadwalShalatResponse {
  code: number;
  message: string;
  data: JadwalShalatData;
}

/* ============================================================
 * 2) LOCATION STORE — minimal, persisted, GPS-synced
 * ============================================================ */

export type LocationStatus = 'idle' | 'locating' | 'ready' | 'error';

/** Raw GPS coordinates — needed by Qibla compass, NOT a computed value. */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  /** Must exactly match a value from GET /v2/shalat/provinsi, e.g. "Jawa Barat". */
  province: string;
  /** Must exactly match a value from POST /v2/shalat/kabkota, e.g. "Kota Bogor". */
  city: string;
  coordinates: Coordinates;
  status: LocationStatus;
  error: string | null;
}

/* ============================================================
 * 3) DERIVED MODEL — what UI / consumers actually work with
 * ============================================================ */

/** Only the 5 core daily prayers — imsak/terbit/dhuha are intentionally excluded. */
export type PrayerName = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

/**
 * 'aktif'      → waktu sholat ini sedang berlangsung sekarang
 * 'selanjutnya'→ waktu sholat berikutnya yang akan datang
 * 'menanti'    → belum waktunya, masih jauh
 * 'selesai'    → sudah lewat (bukan yang aktif sekarang)
 *
 * Note: 'selesai' ditambahkan di luar 3 status yang diminta
 * (aktif/selanjutnya/menanti) karena tanpa status ini, waktu sholat yang sudah lewat (mis. Subuh
 * setelah Dzuhur tiba) akan salah ditandai "menanti" — padahal sudah selesai.
 * Murni perbaikan korektif, tidak mengubah 3 status inti yang diminta.
 */
export type PrayerStatus = 'aktif' | 'selanjutnya' | 'menanti' | 'selesai';

export interface PrayerScheduleItem {
  sholat: PrayerName;
  time: string;
  /** Format jam:menit:detik, dihitung ulang setiap detik. */
  sisa_waktu: string;
  status: PrayerStatus;
}

/** The full derived model for "today" — this is what use-prayer.ts exposes. */
export interface TodayPrayerSchedule {
  hari: string;
  date: string;
  jadwal: PrayerScheduleItem[];
  nextPrayer: PrayerName;
  remaining: string;
  currentPrayer: PrayerName | null;
  city: string;
  province: string;
}
