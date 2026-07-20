---
name: services
description: "Skill for the Services area of Gurun. 5 symbols across 1 files."
---

# Services

5 symbols | 1 files | Cohesion: 89%

## When to Use

- Working with code in `components/`
- Understanding how fetchProvinsiList, fetchKabkotaList, resolveOfficialRegion work
- Modifying services-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `components/ui/core/block/home/services/wilayah-service.ts` | fetchProvinsiList, fetchKabkotaList, normalize, resolveBestMatch, resolveOfficialRegion |

## Entry Points

Start here when exploring this area:

- **`fetchProvinsiList`** (Function) — `components/ui/core/block/home/services/wilayah-service.ts:15`
- **`fetchKabkotaList`** (Function) — `components/ui/core/block/home/services/wilayah-service.ts:20`
- **`resolveOfficialRegion`** (Function) — `components/ui/core/block/home/services/wilayah-service.ts:58`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `fetchProvinsiList` | Function | `components/ui/core/block/home/services/wilayah-service.ts` | 15 |
| `fetchKabkotaList` | Function | `components/ui/core/block/home/services/wilayah-service.ts` | 20 |
| `resolveOfficialRegion` | Function | `components/ui/core/block/home/services/wilayah-service.ts` | 58 |
| `normalize` | Function | `components/ui/core/block/home/services/wilayah-service.ts` | 27 |
| `resolveBestMatch` | Function | `components/ui/core/block/home/services/wilayah-service.ts` | 37 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `AppBootstrap → Normalize` | cross_community | 8 |
| `AppBootstrap → FetchProvinsiList` | cross_community | 7 |
| `AppBootstrap → FetchKabkotaList` | cross_community | 7 |

## How to Explore

1. `gitnexus_context({name: "fetchProvinsiList"})` — see callers and callees
2. `gitnexus_query({query: "services"})` — find related execution flows
3. Read key files listed above for implementation details
