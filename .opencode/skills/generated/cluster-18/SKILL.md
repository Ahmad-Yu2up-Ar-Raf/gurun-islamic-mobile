---
name: cluster-18
description: "Skill for the Cluster_18 area of Gurun. 4 symbols across 2 files."
---

# Cluster_18

4 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `components/`
- Understanding how getReciterByCode, getReciterName, getReciterSlug work
- Modifying cluster_18-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `components/ui/core/block/audio/utils/reciter-map.ts` | getReciterByCode, getReciterName, getReciterSlug |
| `components/ui/core/block/audio/utils/audio-urls.ts` | buildSurahUrl |

## Entry Points

Start here when exploring this area:

- **`getReciterByCode`** (Function) — `components/ui/core/block/audio/utils/reciter-map.ts:17`
- **`getReciterName`** (Function) — `components/ui/core/block/audio/utils/reciter-map.ts:21`
- **`getReciterSlug`** (Function) — `components/ui/core/block/audio/utils/reciter-map.ts:25`
- **`buildSurahUrl`** (Function) — `components/ui/core/block/audio/utils/audio-urls.ts:4`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `getReciterByCode` | Function | `components/ui/core/block/audio/utils/reciter-map.ts` | 17 |
| `getReciterName` | Function | `components/ui/core/block/audio/utils/reciter-map.ts` | 21 |
| `getReciterSlug` | Function | `components/ui/core/block/audio/utils/reciter-map.ts` | 25 |
| `buildSurahUrl` | Function | `components/ui/core/block/audio/utils/audio-urls.ts` | 4 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `BuildSurahUrl → GetReciterByCode` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "getReciterByCode"})` — see callers and callees
2. `gitnexus_query({query: "cluster_18"})` — find related execution flows
3. Read key files listed above for implementation details
