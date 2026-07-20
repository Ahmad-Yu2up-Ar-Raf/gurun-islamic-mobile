---
name: app
description: "Skill for the App area of Gurun. 5 symbols across 4 files."
---

# App

5 symbols | 4 files | Cohesion: 80%

## When to Use

- Working with code in `app/`
- Understanding how useBootstrap, fetchJadwalShalat, registerTrackPlayer work
- Modifying app-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `app/_layout.tsx` | useAndroidSystemBars, AppBootstrap |
| `hooks/use-bootstrap.ts` | useBootstrap |
| `components/ui/core/block/home/services/jadwal-service.ts` | fetchJadwalShalat |
| `components/ui/core/block/audio/services/audio-track-service.ts` | registerTrackPlayer |

## Entry Points

Start here when exploring this area:

- **`useBootstrap`** (Function) — `hooks/use-bootstrap.ts:12`
- **`fetchJadwalShalat`** (Function) — `components/ui/core/block/home/services/jadwal-service.ts:9`
- **`registerTrackPlayer`** (Function) — `components/ui/core/block/audio/services/audio-track-service.ts:4`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `useBootstrap` | Function | `hooks/use-bootstrap.ts` | 12 |
| `fetchJadwalShalat` | Function | `components/ui/core/block/home/services/jadwal-service.ts` | 9 |
| `registerTrackPlayer` | Function | `components/ui/core/block/audio/services/audio-track-service.ts` | 4 |
| `useAndroidSystemBars` | Function | `app/_layout.tsx` | 36 |
| `AppBootstrap` | Function | `app/_layout.tsx` | 48 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `AppBootstrap → Normalize` | cross_community | 8 |
| `AppBootstrap → FetchProvinsiList` | cross_community | 7 |
| `AppBootstrap → FetchKabkotaList` | cross_community | 7 |
| `AppBootstrap → CleanAddressPart` | cross_community | 6 |
| `QiblaBlock → FetchJadwalShalat` | cross_community | 4 |
| `HomeBlock → FetchJadwalShalat` | cross_community | 4 |
| `AppBootstrap → FetchJadwalShalat` | intra_community | 3 |
| `AppBootstrap → RegisterTrackPlayer` | intra_community | 3 |

## Connected Areas

| Area | Connections |
|------|-------------|
| Hooks | 1 calls |

## How to Explore

1. `gitnexus_context({name: "useBootstrap"})` — see callers and callees
2. `gitnexus_query({query: "app"})` — find related execution flows
3. Read key files listed above for implementation details
