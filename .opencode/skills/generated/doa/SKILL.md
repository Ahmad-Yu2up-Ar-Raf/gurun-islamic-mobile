---
name: doa
description: "Skill for the Doa area of Gurun. 3 symbols across 3 files."
---

# Doa

3 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `lib/`
- Understanding how fetchAllDoa, DoaListQueryOptions, DoaBlock work
- Modifying doa-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `lib/server/doa/doa-server.ts` | fetchAllDoa |
| `lib/server/doa/doa-server-queris.ts` | DoaListQueryOptions |
| `components/ui/core/block/doa-block.tsx` | DoaBlock |

## Entry Points

Start here when exploring this area:

- **`fetchAllDoa`** (Function) — `lib/server/doa/doa-server.ts:8`
- **`DoaListQueryOptions`** (Function) — `lib/server/doa/doa-server-queris.ts:17`
- **`DoaBlock`** (Function) — `components/ui/core/block/doa-block.tsx:14`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `fetchAllDoa` | Function | `lib/server/doa/doa-server.ts` | 8 |
| `DoaListQueryOptions` | Function | `lib/server/doa/doa-server-queris.ts` | 17 |
| `DoaBlock` | Function | `components/ui/core/block/doa-block.tsx` | 14 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `DoaBlock → FetchAllDoa` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "fetchAllDoa"})` — see callers and callees
2. `gitnexus_query({query: "doa"})` — find related execution flows
3. Read key files listed above for implementation details
