---
name: hooks
description: "Skill for the Hooks area of Gurun. 28 symbols across 10 files."
---

# Hooks

28 symbols | 10 files | Cohesion: 85%

## When to Use

- Working with code in `components/`
- Understanding how QiblaBlock, normalizeAngle, shortestRotation work
- Modifying hooks-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `components/ui/core/block/qibla/utils/angle-utils.ts` | normalizeAngle, shortestRotation, radianToDegree, lerpAngle, smoothAngle (+1) |
| `components/ui/core/block/home/utils/prayer-time.ts` | parseTimeOnDate, endOfDay, buildTodayPrayerSchedule, pad, formatDuration (+1) |
| `components/ui/core/block/home/hooks/use-location-bootstrap.ts` | cleanAddressPart, resolveAndStore, useLocationBootstrap, start |
| `components/ui/core/block/qibla/hooks/use-qibla.ts` | yawToHeading, useQibla, startHeading |
| `components/ui/core/block/home/hooks/use-prayer.ts` | pad, useSecondClock, usePrayer |
| `hooks/use-current-time.ts` | pad, useCurrentTime |
| `components/ui/core/block/qibla/qibla-block.tsx` | QiblaBlock |
| `components/ui/core/block/home/home-block.tsx` | HomeBlock |
| `components/ui/core/block/home/hooks/use-prayer-time.ts` | usePrayerTime |
| `components/ui/core/block/home/components/section/hero-section.tsx` | HeroSection |

## Entry Points

Start here when exploring this area:

- **`QiblaBlock`** (Function) — `components/ui/core/block/qibla/qibla-block.tsx:216`
- **`normalizeAngle`** (Function) — `components/ui/core/block/qibla/utils/angle-utils.ts:12`
- **`shortestRotation`** (Function) — `components/ui/core/block/qibla/utils/angle-utils.ts:26`
- **`radianToDegree`** (Function) — `components/ui/core/block/qibla/utils/angle-utils.ts:39`
- **`lerpAngle`** (Function) — `components/ui/core/block/qibla/utils/angle-utils.ts:60`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `QiblaBlock` | Function | `components/ui/core/block/qibla/qibla-block.tsx` | 216 |
| `normalizeAngle` | Function | `components/ui/core/block/qibla/utils/angle-utils.ts` | 12 |
| `shortestRotation` | Function | `components/ui/core/block/qibla/utils/angle-utils.ts` | 26 |
| `radianToDegree` | Function | `components/ui/core/block/qibla/utils/angle-utils.ts` | 39 |
| `lerpAngle` | Function | `components/ui/core/block/qibla/utils/angle-utils.ts` | 60 |
| `smoothAngle` | Function | `components/ui/core/block/qibla/utils/angle-utils.ts` | 74 |
| `clampAngle` | Function | `components/ui/core/block/qibla/utils/angle-utils.ts` | 88 |
| `useQibla` | Function | `components/ui/core/block/qibla/hooks/use-qibla.ts` | 94 |
| `startHeading` | Function | `components/ui/core/block/qibla/hooks/use-qibla.ts` | 199 |
| `HomeBlock` | Function | `components/ui/core/block/home/home-block.tsx` | 9 |
| `buildTodayPrayerSchedule` | Function | `components/ui/core/block/home/utils/prayer-time.ts` | 61 |
| `usePrayer` | Function | `components/ui/core/block/home/hooks/use-prayer.ts` | 45 |
| `formatDuration` | Function | `components/ui/core/block/home/utils/prayer-time.ts` | 42 |
| `findTodayJadwal` | Function | `components/ui/core/block/home/utils/prayer-time.ts` | 116 |
| `usePrayerTime` | Function | `components/ui/core/block/home/hooks/use-prayer-time.ts` | 17 |
| `useLocationBootstrap` | Function | `components/ui/core/block/home/hooks/use-location-bootstrap.ts` | 46 |
| `start` | Function | `components/ui/core/block/home/hooks/use-location-bootstrap.ts` | 53 |
| `useCurrentTime` | Function | `hooks/use-current-time.ts` | 6 |
| `HeroSection` | Function | `components/ui/core/block/home/components/section/hero-section.tsx` | 27 |
| `yawToHeading` | Function | `components/ui/core/block/qibla/hooks/use-qibla.ts` | 74 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `AppBootstrap → Normalize` | cross_community | 8 |
| `AppBootstrap → FetchProvinsiList` | cross_community | 7 |
| `AppBootstrap → FetchKabkotaList` | cross_community | 7 |
| `AppBootstrap → CleanAddressPart` | cross_community | 6 |
| `QiblaBlock → Pad` | cross_community | 5 |
| `HomeBlock → Pad` | cross_community | 5 |
| `QiblaBlock → FetchJadwalShalat` | cross_community | 4 |
| `QiblaBlock → ParseTimeOnDate` | cross_community | 4 |
| `QiblaBlock → EndOfDay` | cross_community | 4 |
| `QiblaBlock → RadianToDegree` | intra_community | 4 |

## Connected Areas

| Area | Connections |
|------|-------------|
| App | 1 calls |
| Services | 1 calls |

## How to Explore

1. `gitnexus_context({name: "QiblaBlock"})` — see callers and callees
2. `gitnexus_query({query: "hooks"})` — find related execution flows
3. Read key files listed above for implementation details
