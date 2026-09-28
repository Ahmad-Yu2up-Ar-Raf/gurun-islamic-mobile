# Full Surah Audio Player — PRD & Architecture Blueprint

> **Status:** Phase 1 — Planning only. No feature code written.
> **Owner:** Gurun Islamic Mobile (`gurun-islamic-mobile`)
> **Target:** `docs/prd/full-surah-audio-player-prd.md`
> **Stack:** Expo SDK 57 · React Native 0.86 · TypeScript strict · Expo Router v4 · NativeWind v4 · Reanimated 4 · TanStack Query v5 · Ky · Zustand + persist · `expo-audio ~57.0.5`
> **Vision:** Spotify-like global streaming for full-Surah recitations.

---

## 1. Executive Summary & System Objectives

### 1.1 Core goals

1. **Global persistent player** — a floating mini-player visible on every screen (Home, Quran, Qibla, Settings, drawer screens, `surah/[id]`) with play/pause, next/previous, seek, queue access, and live position/duration.
2. **True background + lock-screen playback** — recitation continues when navigating, backgrounding, or locking the device, with OS media controls (title, reciter, artwork, play/pause/next/prev/seek).
3. **Smart queue** — playing a Surah builds a 114-Surah queue; auto-advance on track end; shuffle / repeat-off / repeat-all / repeat-one; reciter switch rebuilds URLs without losing position in queue order.
4. **Zero-regression integration** — follow the existing feature-block pattern, HSL theme tokens, and state split (TanStack = server, Zustand = client). No new tabs, no splash blocking, no second design system.

### 1.2 UX vision (Spotify model, Quran-adapted)

- **Mini-player:** bottom-anchored floating bar above the tab bar → artwork tile (Surah number calligraphy), Surah Latin name + reciter, play/pause, next, tappable progress hairline. Tap expands.
- **Expanded player:** full-screen sheet (formSheet-style) → large artwork, Arabic/Latin title, reciter selector, seek slider with buffered indicator, skip ±10s, shuffle/repeat, queue list, sleep timer (Phase 2 stretch).
- **Per-ayah affordance (later):** `ayat-card.tsx` play button currently decorative — Phase 2 wires it to "play from this ayah" only after full-Surah core ships. Out of MVP scope.

### 1.3 KPIs / acceptance thresholds

| Metric | Target |
|---|---|
| Tap-to-first-audio latency (cached metadata, Wi-Fi) | < 1.5 s |
| Track-change gap (auto-advance) | < 800 ms perceived |
| Background survival (audio keeps playing 10 min locked) | 100% on test devices |
| Lock-screen metadata correctness (title/reciter/artwork) | 100% |
| Mini-player frame rate (Reanimated, release build) | 60 fps (120 fps where ProMotion enabled) |
| No regression: cold start / splash time | ±0 ms (player lazy-inits) |
| TypeScript `npx tsc --noEmit` | clean |
| `git status` after Phase 1 | only `docs/prd/**` touched |

---

## 2. Discovery Report (evidence-based, Phase 0)

### 2.1 Scanned files & versions

- `package.json` — `expo ~57.0.25`, `expo-audio ~57.0.5`, `react 19.2.3`, `react-native 0.86.3`, `@tanstack/react-query ^5.90.21`, `ky ^2.0.2`, `react-native-reanimated 4.5.1`, `react-native-worklets 0.10.1`, `nativewind ^4.2.1`, `expo-router ~57.0.23`, `expo-haptics ~57.0.3`. **No `zustand`, no `@react-native-async-storage/async-storage`, no `expo-av` in `dependencies`** (see §2.4 gap).
- `app/_layout.tsx:58-66` — root `Provider > Stack((drawer), surah) + PortalHost`. Only mount point that survives all navigation.
- `app/(drawer)/_layout.tsx:102-162` — Drawer (`initialRouteName=(tabs)`); `app/(drawer)/(tabs)/_layout.tsx:16-145` — Tabs (Home/Quran/Qibla/Settings), `tabBarStyle.height = 70 + insets.bottom` (`:36`).
- `api/client.ts:1-11` — Ky, `baseUrl = EXPO_PUBLIC_API_URL ?? https://equran.id/api/`, no timeout/retry/hooks.
- `components/ui/core/block/quran/` — `use-quran.ts:5-10` (`queryKey ['quran']`, `api.get('v2/surat')`), `types/quran-type.ts:1-21` (`audioFull: {[key:string]:string}`), `data/quran-data.json` (all 114 full-Surah CDN URLs, currently unimported reference data).
- `components/ui/core/block/surah/` — `use-surah.ts:6-11` (`queryKey ['surah', id, 'surah-'+id]` — redundant 3rd element), `types/surah-type.ts:1-34` (`audioFull`, `ayat[].audio`), `surah-block.tsx:24-100` (LegendList + HeaderComponent), `ayat-card.tsx:34-99` (audio extracted but unused; play button has no `onPress`), `sura-header.tsx:57-61` (full-Surah Play commented out).
- `components/provider/provider.tsx:16-57` — QueryClient (`staleTime 60s`, `gcTime 5m`, `retry 1`) + ThemeProvider + StatusBar. No ClerkProvider, no SafeAreaProvider, no GestureHandlerRootView at root.
- `app.json:1-39` — plugins include bare `"expo-audio"` (`:30`); **missing** `enableBackgroundPlayback`, `ios.UIBackgroundModes`, Android foreground-service permissions.
- `ARCHITECTURE.md`, `DESIGN.md`, `README.md`, `AGENTS.md` — conventions captured in §2.3. `docs/` directory exists but is **empty**; `README.md:194` roadmap has unchecked `- [ ] Audio Quran with multiple reciters`.

### 2.2 Audio module state today

`expo-audio` is installed + registered as a plugin but **completely unwired**: zero imports of `useAudioPlayer`/`AudioPlayer`/`setAudioModeAsync` in `app/`, `components/`, `hooks/`, `lib/`, `api/`. No `expo-av`. Playback is greenfield; no migration needed.

### 2.3 Conventions the PRD aligns with

- Feature blocks: `components/ui/core/block/<feature>/{components,hooks,store,services,types,utils}` (`ARCHITECTURE.md:50-64`).
- State split: TanStack (server) / Zustand+、使用persist (client) (`ARCHITECTURE.md:40-48`).
- Styling: NativeWind classes + HSL vars in `global.css`, fonts `poppins_*/teko_*/schluber/arabic`, 21 shadcn primitives, `cn()` util, Prettier (`printWidth 100, singleQuote, bracketSameLine, es5`), `<800 lines/file, <50 lines/function`, immutability, try/catch + user-friendly messages (`AGENTS.md:46-52`).
- Design tokens for player: `primary` gold `37 100% 59%` (play/progress anchor), `card`/`accent` surfaces, `radius 0.75rem` (`DESIGN.md`, `global.css`, `lib/theme.ts`).

### 2.4 Gaps / risks found (must fix in Phase 2)

| # | Gap | Evidence | Fix in Phase 2 |
|---|---|---|---|
| G1 | `zustand` + `@react-native-async-storage/async-storage` imported but absent from `package.json` | `use-bookmark-store.ts:1-3`, `use-location-store.ts:9-11`, `package.json:12-73` | `npx expo install zustand @react-native-async-storage/async-storage` |
| G2 | No background-audio config | `app.json:12-20,26-34` | `expo-audio` plugin `enableBackgroundPlayback: true` + `ios.infoPlist.UIBackgroundModes: ["audio"]` + Android `FOREGROUND_SERVICE*` permissions |
| G3 | No lock-screen wiring | zero `setActiveForLockScreen` hits | `player.setActiveForLockScreen(true, {title, artist, artworkUrl})` + `interruptionMode: doNotMix` |
| G4 | Redundant surah query key | `use-surah.ts:8` | collapse to `['surah', id]` |
| G5 | Gesture + SafeArea providers not at root (player needs drag-to-expand + insets) | `provider.tsx:35-57`, `GestureHandlerRootView` only in drawer layout | hoist `GestureHandlerRootView` + `SafeAreaProvider` into `Provider` |
| G6 | Clerk docs claim vs code (no `ClerkProvider`) | `package.json:13`, grep zero hits | out of audio scope — note only, do not touch auth in Phase 2 |

### 2.5 Key technical finding (corrects the brief's assumption)

Current `expo-audio` (SDK 57, verified against Expo docs 2026) **natively supports** background + lock-screen:

- Plugin option `enableBackgroundPlayback: true`, `setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' })`, and `player.setActiveForLockScreen(true, metadata)` with title/artist/album/artwork. Android **requires** lock-screen activation for sustained background (> ~3 min OS limit).
- Therefore **no new native audio dependency is needed for MVP**. `react-native-track-player` remains a documented upgrade path (§7) for gapless/crossfade, download-for-offline, Android Auto/CarPlay — at the cost of a dev build + config plugin + service file. Decision: **ship MVP on `expo-audio`; revisit only if gapless or car integrations are requested.**

---

## 3. Skills Discovered & Activated

From `.agents/skills/` + `skills-lock.json` (52 entries audited). Activated for this PRD:

| Skill | Relevance to audio player |
|---|---|
| `expo-overview` | Router gate — confirmed Expo SDK 57, routed to leaf skills, pinned-version docs rule |
| `expo-data-fetching` | Four-states screens, React Query caching/offline, `EXPO_PUBLIC_` env, SecureStore boundary |
| `expo-router` | Route placement — player must live in root `_layout`, never in `(drawer)`/`(tabs)`; formSheet for expanded player |
| `expo-animation` | 60 fps motion — Reanimated worklets, transform/opacity only, spring on gesture, press feedback, reduced motion |
| `expo-design-system` | Single theme source — extend HSL tokens, no second system; reusable player primitives |
| `expo-native-ui` | Native idioms — semantic colors, safe-area, `expo-image`, haptics, no custom chrome on Android |
| `react-navigation` | Drawer/Stack/Tabs nesting, safe-area insets, tab-bar anchor (`70 + insets.bottom`) |
| `react-native-best-practices` | Perf triage — measure→optimize, atomic Zustand selectors, LegendList/FlashList, no `setState`-per-frame |
| `vercel-react-native-skills` | List virtualization, GPU-only animation props, `Pressable`, image optimization |
| `writing-user-docs` | PRD voice — goal-organized, unhappy paths, no internal jargon in user-facing copy |
| `brainstorming` | Process — this task classified **architectural** (new subsystem) → written spec + plan, approval-gated |
| `writing-plans` | Phase 2 roadmap format — bite-sized tasks with files, interfaces, tests, commits |

Not activated (out of scope): `eas-*` (no store submission in MVP), `expo-module/brownfield` (no native code), `expo-upgrade` (stay on SDK 57), taste/image skills (follow existing design system, no rebrand).

---

## 4. Feature Specifications & User Flows

### 4.1 F1 — Global Floating Mini-Player

- **Anchor:** sibling of `<Stack>` inside `Provider` in `app/_layout.tsx:59-64` (only zone surviving Drawer + Tabs + `surah/[id]` pushes). Absolute-positioned `bottom = tabBarHeight (70 + insets.bottom) + 8`, `pointerEvents="box-none"` wrapper.
- **Layout:** `[artwork tile: Surah number in Teko] [title block: namaLatin (Poppins SemiBold) + reciter (caption)] [prev] [play/pause 48dp] [next]` + 2px progress hairline (primary gold) across the top edge of the bar.
- **Behavior:** hidden when queue empty; slide-up enter/exit (Reanimated `entering/exiting`, transform+opacity only); press scales `0.97` in 100–150 ms + light haptic on commit; tap (not on buttons) expands to full player; persists across all routes.
- **States:** loading (skeleton shimmer, no spinner blink), buffering (indeterminate hairline + retained metadata), error (inline retry, retained last track), empty (unmounted — never a blank bar).

### 4.2 F2 — Expanded Full-Screen Player

- **Presentation:** `presentation: 'formSheet'` route or `@expo/ui` BottomSheet (check `expo-ui` first per skill rule); grabber visible; detents `[0.5, 1.0]`; liquid-glass background on iOS 26+.
- **Content:** large artwork (Surah number + Arabic name), title/artist/reciter selector (6 reciters), seek slider (position/duration/buffered), skip ±10 s, shuffle + repeat cycle button, queue list (LegendList, active row highlighted), close affordance.
- **Motion:** shared-element-ish expand via spring `{ duration: 300, dampingRatio: 0.8 }`; progress bar fill = absolutely-positioned width-animated childless view (the one legal `width` animation); reduced-motion path drops translation/overshoot, keeps opacity.

### 4.3 F3 — Queue Management

- **Model:** `queue: AudioTrack[]` (built from 114-Surah list order starting at chosen Surah), `index`, `shuffle: boolean`, `repeat: 'off' | 'all' | 'one'`.
- **Flows:** track end → if `repeat-one` replay; else `index+1` (wrap if `repeat-all` or shuffle pool); manual next/prev (prev restarts track if position > 3 s, else steps back); reciter change → remap `audioUrl` for all queued tracks, keep `index`; queue reorder/remove (expanded player only, MVP: remove + jump-to).
- **Edge cases:** single-Surah repeat-one loop; end-of-queue with `repeat-off` → pause + stay on last frame (do not unmount bar); network loss mid-track → retain position, show inline "offline — retry", resume on reconnect (React Query `networkMode: 'online'` precedent).

### 4.4 F4 — Background & Lock-Screen

- **Config (Phase 2):** `expo-audio` plugin `{ enableBackgroundPlayback: true }`; `ios.infoPlist.UIBackgroundModes: ["audio"]`; Android `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK`, `WAKE_LOCK` (+ `foregroundServiceType: "mediaPlayback"` per SDK 57 docs check at build time).
- **Session:** on player init `setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' })`.
- **Lock-screen:** on each track load `player.setActiveForLockScreen(true, { title: namaLatin, artist: reciterName, albumTitle: 'Gurun · Quran', artworkUrl })`; on pause-end-of-queue keep last metadata; on teardown `setActiveForLockScreen(false)`.
- **Interruptions:** phone call / Siri / another app → OS ducks/pauses per `doNotMix`; on `playbackStatusUpdate` paused-by-interruption show mini-player paused state (no auto-resume surprise — user resumes explicitly; auto-resume only if interruption was transient duck).
- **Android rule:** lock-screen activation is **required** for > ~3 min background; Phase 2 must call it before `play()`, never after.

### 4.5 Non-goals (MVP)

Per-ayah gapless chaining, word-level highlighting, downloads/offline cache, sleep timer, speed control beyond 1×/1.25×/1.5×, CarPlay/Android Auto, widgets, multi-reciter mixing. Each is a named Phase 3 candidate, not MVP.

---

## 5. Data & API Integration Contract

### 5.1 Source endpoints (existing, reuse)

- List: `GET v2/surat` → `QuranResponse { data: SuraType[] }` (`quran-type.ts:1-21`). Hook `FetchQuran` (`use-quran.ts:5-10`).
- Detail: `GET v2/surat/{id}` → `SurahResponse { data: Surah }` (`surah-type.ts:1-5`). Hook `FetchSurah` (`use-surah.ts:6-11`).
- Ky base: `api/client.ts:3-6`. No changes to base URL; add per-call `timeout` only inside the new audio service if needed (do not alter shared client defaults without review).

### 5.2 Audio URL resolution

```ts
// Reciter keys are opaque "01".."06" in equran.id payloads.
export const RECITERS = {
  '01': { slug: 'Abdullah-Al-Juhany', label: 'Abdullah Al-Juhany' },
  '02': { slug: 'Abdul-Muhsin-Al-Qasim', label: 'Abdul Muhsin Al-Qasim' },
  '03': { slug: 'Abdurrahman-as-Sudais', label: 'Abdurrahman as-Sudais' },
  '04': { slug: 'Ibrahim-Al-Dossari', label: 'Ibrahim Al-Dossari' },
  '05': { slug: 'Misyari-Rasyid-Al-Afasi', label: 'Misyari Rasyid Al-Afasi' },
  '06': { slug: 'Yasser-Al-Dosari', label: 'Yasser Al-Dosari' },
} as const;
// Full-surah canonical form: https://cdn.equran.id/audio-full/<slug>/<NNN>.mp3
// where NNN = zero-padded surah nomor. Prefer payload audioFull[key]; fall back to slug template.
```

- **Source of truth at runtime = API payload** (`audioFull[reciterKey]`), never the reference `quran-data.json` (unimported legacy snapshot).
- Persist only `reciterKey` + last `surahNomor`/`positionSec` (transient); never persist full URLs (they can rotate CDN hosts).

### 5.3 `AudioTrack` canonical shape (new, Phase 2)

```ts
export interface AudioTrack {
  surahNomor: number;      // 1..114
  namaLatin: string;        // "Al-Fatihah"
  namaArab: string;         // "الفاتحة"
  arti: string;             // Indonesian meaning
  jumlahAyat: number;
  reciterKey: keyof typeof RECITERS; // '01'..'06'
  audioUrl: string;         // resolved full-surah mp3
  artworkUrl?: string;      // local asset or generated tile (lock-screen)
  durationSec?: number;     // filled from player status
}
```

### 5.4 Zustand store model (new, Phase 2)

```ts
export type RepeatMode = 'off' | 'all' | 'one';
export interface AudioPlayerState {
  queue: AudioTrack[]; index: number; reciterKey: string;
  status: 'idle' | 'loading' | 'buffering' | 'playing' | 'paused' | 'error';
  positionSec: number; durationSec: number; bufferedSec: number;
  shuffle: boolean; repeat: RepeatMode; errorMsg?: string;
  playTrack: (t: AudioTrack, queue?: AudioTrack[]) => void;
  toggle: () => void; next: () => void; prev: () => void;
  seekTo: (sec: number) => void; setReciter: (k: string) => void;
  setQueue: (q: AudioTrack[], i: number) => void;
  onStatus: (p: number, d: number, b: number) => void; // throttled status pump
  setError: (m: string) => void; clear: () => void;
}
// Persist (name: 'audio-player-store'): { reciterKey, shuffle, repeat, lastSurahNomor, lastPositionSec } only.
// Never persist: queue URLs, live position ticker, player instance.
```

Follow `use-location-store.ts:28-58` + `use-bookmark-store.ts:18-35` patterns (`create<T>()(persist(..., { name, storage: createJSONStorage(() => AsyncStorage), partialize }))`, stable selectors, immutable updates).

### 5.5 TanStack usage (no new server cache for bytes)

Audio bytes stream via `expo-audio`; TanStack caches **metadata only** (Surah list/detail). Reuse `FetchQuran`/`FetchSurah`; fix `FetchSurah` key to `['surah', id]`; set `staleTime` for list (e.g. 30 min — Surah metadata is static) while keeping provider defaults for the rest. Queue building reads from cached list data — no extra network call when tapping play from Quran list.

---

## 6. Technical Architecture & Component Breakdown

### 6.1 Proposed file structure (Phase 2 only — not created in Phase 1)

```
components/ui/core/block/audio/
├── types/audio-type.ts            # AudioTrack, RepeatMode, lock-screen metadata
├── data/reciters.ts               # RECITERS map (key → slug/label)
├── services/audio-service.ts      # URL resolver, queue builder, metadata mapper (pure, no React)
├── store/use-audio-store.ts       # Zustand + persist (partialize) — client state only
├── hooks/use-audio-player.ts      # expo-audio binding: useAudioPlayer + status pump + lock-screen + interruptions
├── hooks/use-audio-queue.ts       # next/prev/shuffle/repeat transitions (pure logic over store)
├── components/mini-player.tsx     # floating bar (memo, selectors only)
├── components/expanded-player.tsx # formSheet route content + queue list
├── components/reciter-picker.tsx  # 6-reciter selector
└── components/seek-bar.tsx        # slider + buffered + timestamps (tabular-nums)
app/
├── _layout.tsx                    # MOD: mount <MiniPlayer/> + <AudioController/> beside <Stack>
└── player.tsx (or (drawer)/player) # NEW formSheet expanded player route (exact path TBD in Phase 2)
```

All files < 800 lines, functions < 50 lines, `@/` imports, Prettier config, try/catch + user messages.

### 6.2 Runtime wiring

```
<Provider> (adds GestureHandlerRootView + SafeAreaProvider in Phase 2)
 ├── <Stack/> (all existing routes untouched)
 ├── <AudioController/>  # invisible: owns useAudioPlayer instance + lock-screen + interruptions
 ├── <MiniPlayer/>       # visible floating bar, absolute above tab bar
 └── <PortalHost/>
```

- **Single player instance** for the app lifetime (never per-screen). `useAudioPlayer(source, 500ms)` in `AudioController`; source swaps on `queue[index]` change.
- **Status pump:** `player` status subscription → throttled `onStatus(position, duration, buffered)` → Zustand. UI subscribes via narrow selectors (`useAudioStore(s => s.positionSec)`) so the ticker re-renders only the seek bar, never the whole tree.
- **Progress animation:** seek bar fill on UI thread (Reanimated shared value driven by store position at ~2 Hz + `withTiming` interpolation between pumps — never `setState`-per-frame from gesture; gestures use `Gesture.Pan` + shared values, commit via `scheduleOnRN` only on release).

### 6.3 Integration with existing tokens & primitives

- Compose from shadcn primitives (`button`, `text`, `card`, `slider-equivalent`, `separator`) + Lucide (`Play/Pause/SkipBack/SkipForward/Shuffle/Repeat/X`) + custom SVG only for artwork tile.
- Colors: `bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary` progress, `text-secondary` accents. Dark mode via existing `.dark` class — no new palettes.
- Typography: `font-poppins_semibold` titles, `font-poppins_regular` reciter line, `font-teko_medium` artwork numeral, `font-arabic` Arabic name in expanded player.

### 6.4 Error handling matrix

| Failure | UX | Recovery |
|---|---|---|
| Track URL 404 / CDN error | inline "Couldn't load this recitation — try another reciter" + Retry | auto-suggest next reciter key; log `surahNomor+reciterKey` |
| Network loss mid-play | retain position, "Waiting for connection…" | resume on reconnect; no queue loss |
| Interruption (call) | pause + paused icon on lock-screen | manual resume (no surprise audio) |
| Background kill (OS) | on relaunch restore `lastSurahNomor/lastPositionSec` from persist | "Resume Al-Baqarah 1:24?" pill |
| Seek beyond duration | clamp | — |

---

## 7. Alternatives Considered

| Option | Verdict |
|---|---|
| **A. `expo-audio` (chosen for MVP)** — already installed, `enableBackgroundPlayback` + `setActiveForLockScreen`, Expo Go-friendly iteration, no native code | ✅ Ship MVP on this |
| B. `react-native-track-player` — full queue/gapless, car integrations, rich notification | Deferred: needs dev build + service + plugin; revisit for gapless/offline Phase 3 |
| C. `expo-av` (legacy) | Rejected: deprecated path, skill mandates `expo-audio not expo-av` |
| D. Per-ayah chaining (114× audio-partial stitching) | Rejected for MVP: gap/seek complexity; full-Surah `audioFull` URLs already exist |

---

## 8. Phase 2 Step-by-Step Implementation Roadmap

> Each task is bite-sized (2–5 min steps: failing check → minimal change → verify → commit). Stop after each task for review.

### Task 1 — Dependencies & config (no UI)

- `npx expo install zustand @react-native-async-storage/async-storage` (G1).
- `app.json`: `expo-audio` → `["expo-audio", { "enableBackgroundPlayback": true }]`; add `ios.infoPlist.UIBackgroundModes: ["audio"]`; add Android `permissions: [FOREGROUND_SERVICE, FOREGROUND_SERVICE_MEDIA_PLAYBACK, WAKE_LOCK]` + verify `foregroundServiceType` per SDK 57 docs at build time.
- Verify: `npx tsc --noEmit` clean; `npx expo prebuild --dry-run` (or `eas build --profile development` notes) shows background modes present.

### Task 2 — Audio domain core (pure logic + store, no player yet)

- Create `block/audio/types/audio-type.ts`, `data/reciters.ts`, `services/audio-service.ts` (URL resolver + queue builder + `Surah→AudioTrack` mapper), `store/use-audio-store.ts` (shape §5.4, partialize).
- Fix `use-surah.ts` query key → `['surah', id]`.
- Verify: unit-check resolver for Surah 1/2/114 × 6 reciters against `audioFull` payload shape; store partialize excludes live ticker.

### Task 3 — Headless playback controller

- Create `hooks/use-audio-player.ts` (single `useAudioPlayer`, `setAudioModeAsync`, `setActiveForLockScreen`, interruption handling, end-of-track → queue advance) + invisible `AudioController` mounted in `app/_layout.tsx`.
- Hoist `GestureHandlerRootView` + `SafeAreaProvider` into `Provider`.
- Verify: foreground play/pause/seek on one Surah; background 10-min locked test; lock-screen shows correct metadata.

### Task 4 — Mini-player UI

- Create `components/mini-player.tsx` + `seek-bar.tsx`; mount `<MiniPlayer/>` in root layout above tab bar (`70 + insets.bottom + 8`).
- Wire play/pause/next/prev + progress hairline + buffering/error states; Reanimated enter/exit; haptics.
- Verify: visible on Home/Quran/Qibla/Settings/drawer screens/`surah/[id]`; 60 fps release-build check on slowest device.

### Task 5 — Expanded player + queue UI

- New formSheet route + `expanded-player.tsx` + `reciter-picker.tsx` + queue list; wire shuffle/repeat/reciter-switch/removal.
- Wire `sura-header.tsx` Play button (uncomment path) → `playTrack(surah, fullQueue)`; leave `ayat-card` per-ayah play for Phase 3.
- Verify: auto-advance across ≥3 Surahs; reciter switch keeps queue index; repeat/shuffle matrix; reduced-motion path.

### Task 6 — Hardening & docs

- Error matrix (§6.4) + resume-from-persist pill; `README.md` roadmap checkbox (`Audio Quran with multiple reciters` → Active); `ARCHITECTURE.md` audio section.
- Final verify: `npx tsc --noEmit`, Prettier check, `git status` scoped, release-build device pass (background + lock-screen + interruptions + offline).

---

## 9. Verification Protocol (Phase 1 — run now)

1. `docs/prd/full-surah-audio-player-prd.md` exists and is populated — this file.
2. `git status --porcelain` shows **only** `docs/prd/**` (zero `app/`/`components/`/`lib/`/`hooks/` contamination).
3. `skills-lock.json` audio/mobile-relevant skills audited and referenced — §3.

---

*End of PRD. Awaiting user review and explicit approval before Phase 2 implementation.*
