---
name: islamic-app-domain
description: Islamic app domain patterns — prayer times, Quran, Qibla, Arabic typography, adhan, audio recitation
---

# Islamic App Domain Skill

## Fonts (tailwind.config.js)

| Class | Font | Usage |
|-------|------|-------|
| `font-arabic` | Noto Naskh Arabic | Quran verses, Arabic text |
| `font-schluber` | Schluber (calligraphy) | Decorative headings (Hero section) |
| `font-poppins_regular` | Poppins 400 | Body, transliteration |
| `font-poppins_medium` | Poppins 500 | Body emphasis |
| `font-poppins_semibold` | Poppins 600 | Card titles |
| `font-poppins_bold` | Poppins 700 | Strong emphasis |
| `font-teko_light/regular/medium/semibold/bold` | Teko 300-700 | Display/counter text |

Loaded in `app/_layout.tsx` via `useFonts()`, font files from `@expo-google-fonts/*` and `assets/fonts/`.

## API Source

Primary API via Ky client (`api/client.ts`): `https://equran.id/api/`

**Note:** Doa, Hadist, Asmaul Husna, and Dzikir blocks use a **separate API** at `https://muslim-api-three.vercel.app/` — not equran.id.

### equran.id Endpoints

| Endpoint | Method | Params | Response shape | Cache |
|----------|--------|--------|---------------|-------|
| `v2/shalat/provinsi` | GET | — | `{ code, message, data: string[] }` | TanStack |
| `v2/shalat/kabkota` | POST | `{ provinsi }` | `{ code, message, data: string[] }` | TanStack |
| `v2/shalat` | POST | `{ provinsi, kabkota }` | `{ code, message, data: JadwalShalatData }` | TanStack, 1h stale |
| `v2/surat` | GET | — | `{ code, message, data: SuraType[] }` | TanStack, high stale |
| `v2/surat/{id}` | GET | surah ID | `{ code, message, data: Surah }` | TanStack, high stale |

### Key Response Types

`JadwalHarianRaw`: `{ tanggal, tanggal_lengkap (ISO date), hari, imsak, subuh, terbit, dhuha, dzuhur, ashar, maghrib, isya }` — all times as `"HH:mm"` strings.

`Surah`: `{ nomor, nama (arabic), namaLatin, jumlahAyat, tempatTurun, arti, deskripsi, audioFull, ayat[] }`

`Ayah`: `{ nomorAyat, teksArab, teksLatin, teksIndonesia, audio: { [key]: url } }` — audio keys are qari IDs like `'01'`, `'02'`.

`SuraType` (list): `{ nomor, nama, namaLatin, jumlahAyat, tempatTurun, arti, deskripsi, audioFull }`

### TanStack Query Patterns

- Prayer schedule: `queryKey: ['prayer-schedule', province, city, dateString]`, `staleTime: 1hr`
- Surah list: `queryKey: ['quran']`, cache aggressively (114 surahs, rarely change)
- Single surah: `queryKey: ['surah', id, \`surah-${id}\`]`
- Region lists: fetched ad-hoc during bootstrap, not persisted in store

## Location Flow

```
app/_layout.tsx
  └─ useLocationBootstrap()  ← called once as side effect
       ├─ Request GPS permission (expo-location)
       ├─ getCurrentPositionAsync() → coords
       ├─ reverseGeocodeAsync(coords) → { region, city }
       ├─ fuzzy-resolve against equran.id wilayah API
       │   (fetchProvinsiList → resolveBestMatch → fetchKabkotaList → resolveBestMatch)
       └─ write → useLocationStore.setLocation(province, city, coordinates)
```

- Location store is **Zustand + persist** (AsyncStorage via `createJSONStorage`).
- Fallback: `{ province: 'Jawa Barat', city: 'Kota Bogor', coordinates: { lat: -6.595, lng: 106.806 } }`.
- Watch position updates: `distanceInterval: 500m`, `timeInterval: 5min`.
- Stable selectors (`useProvince`, `useCity`, `useCoordinates`) prevent wasted re-renders.
- Use `useLocationStore.getState().setStatus()` for status updates outside React components.

## Prayer Time Pipeline

1. `usePrayer()` in `hooks/use-prayer.ts` — the single hook UI components consume
2. Composes: `useProvince()` + `useCity()` from store → `usePrayerTime({ province, city })`
3. `usePrayerTime` → `fetchJadwalShalat` → returns monthly schedule → `findTodayJadwal` extracts today
4. `buildTodayPrayerSchedule(jadwalToday, now, city, province)` — pure function, safe to call every second
5. Tick via `useSecondClock()` — 1s interval, isolated to consumers only
6. Returns `TodayPrayerSchedule` with `jadwal[]`, `nextPrayer`, `remaining`, `currentPrayer`

Prayer time derivation (`utils/prayer-time.ts`):
- `PRAYER_ORDER = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya']`
- `parseTimeOnDate("HH:mm", baseDate)` — parses directly, assumes local time
- Status: `'aktif' | 'selanjutnya' | 'menanti' | 'selesai'`

## Timezone Handling

equran.id returns times in **UTC+7** (WIB). The `parseTimeOnDate` function in `prayer-time.ts` parses `HH:mm` as **local time** — this is correct for users within WIB but **wrong for users in WITA/WIT**. For those users, subtract the offset before parsing:
```
// WITA (UTC+8) user: subtract 1 hour from equran.id times
const local = `${String(Number(hh) - 1).padStart(2, '0')}:${mm}`;
```

## Typography — Arabic & RTL

- Arabic text: `<Text className="w-full text-right font-arabic text-2xl leading-relaxed text-foreground">`
- Key classes: `font-arabic`, `text-right`, `leading-relaxed`/`leading-loose`, `pl-8` (padding-left compensates RTL alignment)
- Transliteration: `font-poppins_medium`, `text-left` (left-aligned below Arabic)
- Translation: `font-poppins_regular`, `text-muted-foreground`
- Mixed Arabic/Latin layouts: `flex-row items-center justify-between` — Arabic right, controls left
- Surah names in Latin: `font-teko_medium` for display headings
- Calligraphy decorative: `font-schluber uppercase` (used in Hero section Bismillah)

## Adhan Library (v4.4.3)

```
import { Coordinates, CalculationMethod, PrayerTimes, Madhab, Qibla } from 'adhan';
```

**Qibla calculation:**
```
const coords = new Coordinates(latitude, longitude);
const bearing = Qibla(coords);  // returns degrees from North
```

**Prayer times (available in lib, not yet used in this project):**
```
const coords = new Coordinates(lat, lng);
const params = CalculationMethod.MuslimWorldLeague();
params.madhab = Madhab.Shafi;
const times = new PrayerTimes(coords, date, params);
times.fajr;  // Date object
times.maghrib;
```

Calculation methods: `MuslimWorldLeague`, `Egyptian`, `Karachi`, `UmmAlQura`, `Dubai`, `Qatar`, `Kuwait`, `MoonsightingCommittee`, `Singapore`, `Tehran`, `NorthAmerica`, `Other`.

## Qibla Compass (use-qibla.ts)

Architecture — two parallel systems:

| Layer | Thread | Frequency | Source | Purpose |
|-------|--------|-----------|--------|---------|
| Animation | UI (worklet) | 60fps | `useAnimatedSensor(SensorType.ROTATION)` | Arrow + compass ring rotation |
| Text/state | JS | ~10/sec | `Location.watchHeadingAsync()` | Accuracy, loading, error |

**Key patterns:**
- `Qibla(coordinates)` from adhan returns bearing (degrees from North)
- Gyroscope yaw → heading conversion: `heading = normalizeAngle(-yawDeg)`
- Arrow rotation: `normalizeAngle(qiblaBearing - heading)`
- Compass ring: `rotate: ${-heading}deg`
- Hysteresis threshold: 5° facing, 8° for leaving-facing (prevents rapid toggle)
- `useFocusEffect` to start/stop sensors on screen focus
- Use `useAnimatedReaction` for tracking state changes on UI thread

## expo-audio (v57)

Available but not yet integrated into feature blocks. Key API:

```
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { setAudioModeAsync } from 'expo-audio';

// Configure playback
await setAudioModeAsync({ playsInSilentModeIOS: true });

// Player
const player = useAudioPlayer({ uri: audioUrl });
const status = useAudioPlayerStatus(player);
// status.playing, status.durationMillis, status.currentTime

// Playlist
import { useAudioPlaylist } from 'expo-audio';
```

Audio URLs come from `ayah.audio['01']` / `surah.audioFull['01']` — `'01'` is Abdullah Al-Juhany (default qari at equran.id).

## Common Pitfalls

1. **Timezone**: equran.id returns HH:mm in UTC+7. Use `parseTimeOnDate` for WIB users; offset for WITA/WIT users.
2. **Region name matching**: equran.id requires exact strings from its own API. Always resolve GPS output through `wilayah-service.ts` fuzzy-matching — never send raw reverse-geocode output.
3. **Surah cache**: 114 surahs never change — use high `staleTime`/`gcTime`.
4. **Monthly schedule**: The v2 shalat endpoint returns a full month. Use `findTodayJadwal()` to extract today's entry — the query key's date dependency naturally triggers refetch at midnight.
5. **Qibla sensor lifecycle**: Must use `useFocusEffect` (not plain `useEffect`) to start/stop magnetometer with screen focus, preventing the compass from draining battery on background screens.
6. **Arabic/Latin spacing**: Arabic glyphs at same `text-2xl` appear larger than Latin. Reduce Arabic font size by 1-2 steps when mixing in the same layout.
