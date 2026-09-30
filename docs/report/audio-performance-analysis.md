# Audio Performance Analysis — Full Surah Player (Expo Go, Pixel 10 Emulator)

Date: 2026-09-30 · SDK 57 · RN 0.86 · Reanimated 4.5.1 · expo-audio ~57.0.5
Scope: `components/ui/core/block/audio/` + `app/player.tsx` + triggers in `surah-block`/`sura-header`.

## 1. Baseline emulator metrics (Pixel_10a, Expo Go, dev)

| Action                                | Observation                                                                                                                                                                                                                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cold Home render                      | Clean, countdown ticking, no crash                                                                                                                                                                                                                                                                 |
| Quran list load (`v2/surat`)          | Spinner → full list in ~5 s wall (API healthy)                                                                                                                                                                                                                                                     |
| Surah detail open                     | Instant                                                                                                                                                                                                                                                                                            |
| Play tap → sheet + audio start        | Sheet + position 0:26 within round trips — **no 5 s freeze reproduced** on this path                                                                                                                                                                                                               |
| Next (Fatihah → Baqarah 125 min file) | Track switched, buffering → playing; position advancing                                                                                                                                                                                                                                            |
| Prev at 0:51 (> 3 s)                  | Correct restart to 0:00, spinner cleared, pause icon shown                                                                                                                                                                                                                                         |
| logcat `host.exp.exponent`            | Repeated `Skipped 30–128 frames` (~0.5–2.1 s stalls); one 500 ms GC (`freed 23MB`); `Davey!` 700–2800 ms frames with huge `QueueBufferDuration` (emulator GPU); AudioTrack HAL stalls; bluetooth `MediaPlayerWrapper` metadata-sync timeout spam (Expo Go background-service limitation, harmless) |
| logcat JS errors                      | **None** — no RedBox, no `getSnapshot`, no hook-order errors                                                                                                                                                                                                                                       |

Interpretation: the UI thread is alive and transport actions execute, but the main thread suffers periodic multi-second stalls. Two stall sources are environmental (emulator software GPU, ExoPlayer progressive download + decode of 50–150 MB full-surah MP3s, GC pressure in dev). The rest are code defects below — all fixable without changing architecture.

## 2. Root causes found by code inspection (ranked by impact)

### P0 — `useSharedValue` called at module scope (Rules-of-Hooks violation)

- `hooks/use-audio-player.ts:14-15`: `useSharedValue` executes outside any component. In Reanimated 4 this binds to whatever dispatcher happens to exist (or none) — undefined behavior, crash risk on Fast Refresh/reload.
- `components/expanded-player.tsx:270-274`: same violation **plus dead code** (`knobStyle`/`knobAnimatedStyle` never rendered).
- Fix: `makeMutable()` (designed for module scope) + delete dead code.

### P0 — Play button dead while loading (perceived freeze)

- `store.toggle()` is a no-op unless status is exactly `playing`/`paused`. During the multi-second buffer of a huge MP3, taps do nothing → user hammers Play → "frozen".
- Fix: `toggle()` from `loading`/`buffering` → `paused`; engine already respects `paused` (never auto-plays into it).

### P1 — Unconditional `/player` push stacks duplicate sheets

- `usePlaySurah` calls `router.push('/player')` on every Play tap, even when the sheet is already open → stacked modals, extra LegendList mounts (114 rows each), back-button maze.
- Fix: skip push when `usePathname() === '/player'`.

### P1 — No preloading; every track change cold-buffers a giant file

- `expo-audio` exports `preload(source)` (verified in `ExpoAudio.d.ts:383`) but nothing calls it. Each Next/auto-advance starts ExoPlayer from zero on a 50–150 MB stream.
- Fix: after a track loads, `preload(queue[index+1])` fire-and-forget (wrap-around aware, guarded try/catch).

### P2 — Fragile `(progress as any)` casts

- `seek-bar.tsx:8`, `expanded-player.tsx:217-222`: casts hide the SharedValue type; break silently if the hook shape changes.
- Fix: type module globals as `SharedValue<number>` once; casts disappear.

### P2 — Persist writes on every 1 Hz pump

- `onStatus` → `set` → `persist` serializes + AsyncStorage write every second during playback. Small payload, but pure overhead.
- Fix (deferred to Phase 2): split high-frequency ticker out of the persisted store or throttle `partialize` writes. Not the 5 s freeze (writes are async), so Phase 2.

### Ruled out (measured or traced)

- `player.replace()`/`play()`: sync JSI SharedObject calls, non-blocking.
- Zustand pump: delta-gated (`PUMP_DELTA_SEC`), ~1 Hz, small subtree re-renders only.
- `remapQueueReciter`/`buildQueue`: 114 cheap string ops, sub-millisecond.
- `runTransport` throttle: correct, no pile-up.
- LogBox banner: dev-only noise (deduped to a single instance), zero runtime cost beyond first paint.

## 3. Best-practice TODO plan

### Phase 1 (this change — unblock main thread, kill invalid hooks)

- [x] `makeMutable` for module-scope shared values; delete dead module hooks
- [x] `toggle()` honors pause intent while loading/buffering
- [x] Guard duplicate `/player` pushes
- [x] Preload next track after current loads
- [x] Remove `as any` casts via proper `SharedValue<number>` typing
- [x] `tsc --noEmit` clean + Prettier + emulator re-test

### Phase 2 (follow-up, needs device time)

- [ ] Decouple 1 Hz ticker from persisted Zustand (separate ephemeral store or direct shared-value writes from the pump)
- [ ] `downloadFirst` for the active track on Wi-Fi to eliminate rebuffer stalls
- [ ] Release-build profiling on slowest physical device (Expo Go numbers are not representative)
- [ ] Revisit `updateInterval` 1000 ms vs time-label smoothness trade-off
- [ ] Task 6 hardening (resume pill, README/ARCHITECTURE updates)

## 4. Verification (emulator, post-fix)

- Play → sheet + audio, no hook errors, no RedBox
- Next/Prev/reciter/rapid taps responsive; pause-during-load honored
- `tsc --noEmit` exit 0; Prettier applied
