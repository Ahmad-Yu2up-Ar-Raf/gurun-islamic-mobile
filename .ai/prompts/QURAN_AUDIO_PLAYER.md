# MISSION: PRODUCTION-GRADE SPOTIFY-LIKE AUDIO ARCHITECTURE FOR DEEN MUSLIM

## CONTEXT
The objective is to engineer a world-class, highly robust audio playback architecture for the Quran module in the Deen Muslim application. This is NOT just a UI feature; it requires a deep system-level design matching Spotify's standards. The architecture must handle single Ayah playback, continuous full Surah playback, background execution, robust caching, and OS-level media integration.

## CORE TECHNOLOGY STACK
- **Audio Engine:** `react-native-track-player` (Required for background audio, preloading, and OS media session control).
- **State Management:** `Zustand` (Global Audio Store).
- **Animations:** `React Native Reanimated` (For 60fps UI widgets).
- **Styling:** `NativeWind`.

## 1. AUDIO DOMAIN ARCHITECTURE
The system must be decoupled into strict layers:
1. `Audio Layer` (Native OS binding)
2. `Track Player Service` (Wrapper for react-native-track-player)
3. `Audio Repository` (Data fetching & formatting)
4. `Audio Queue Manager` (Track sequencing)
5. `Playback Controller` (Business logic)
6. `Global Zustand Store` (UI State bridging)
7. `UI Components` (Mini Player, Ayah Card, Surah Header)

## 2. STRICT AUDIO STATE MACHINE
UI must strictly react to these derived states from the engine:
`Idle` -> `Loading` -> `Buffering` -> `Playing` -> `Paused` -> `Seeking` -> `Completed` -> `Error`.

## 3. QUEUE & LIFECYCLE MANAGEMENT
- **Initialization:** App Launch -> Init Audio -> Setup Service -> Ready.
- **Queue System:** Must support Next, Previous, Auto-Continue, and preserving the queue state.
- **Conflict Resolution (Critical):** 
  - Playing Ayah + Click Full Surah = Stop Ayah, Play Surah.
  - Playing Surah + Click Ayah = Pause Surah, Play Ayah.

## 4. AUDIO SESSION MANAGER (OS INTEGRATION)
- **Audio Focus:** Handle `ducking` (lowering volume for nav voices) and `pausing` (for incoming calls).
- **Bluetooth/Headset:** Auto-pause when headset is disconnected; wait for user input to resume.
- **Background & Lock Screen:** Full integration with Android Media Session and iOS `MPRemoteCommandCenter`.

## 5. PERFORMANCE & CACHING STRATEGY
- **Perceived Zero Latency:** True zero-loading for remote URLs is impossible. You MUST use aggressive preloading, track prefetching, and memory caching so the playback *feels* instant.
- **Metrics:** Target <50ms for player open, <100ms for play execution. Ensure zero memory leaks and strictly one audio engine instance.

## 6. FUTURE-PROOFING (DESIGN ONLY)
The architecture must be designed to easily adapt to these future features without core rewrites:
- Offline Downloads (Surah/Ayah)
- Playback Speed adjustment
- Sleep Timer
- Continue Listening (saving last position)

## 7. UI/UX REQUIREMENTS
- **Ayah Card:** Instant fire-and-forget play button.
- **Surah Header:** Elegant 'Play Full Surah' trigger.
- **Floating Mini-Player:** Global widget positioned above the bottom nav. Slides up (Reanimated) when active. Contains metadata, Play/Pause, Next/Prev, OS-synced progress bar, and a 'Close/Stop' button.