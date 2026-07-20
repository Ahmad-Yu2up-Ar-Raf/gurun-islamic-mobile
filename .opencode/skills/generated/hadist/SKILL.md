---
name: hadist
description: "Skill for the Hadist area of Gurun. 3 symbols across 3 files."
---

# Hadist

3 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `lib/`
- Understanding how fetchAllHadist, HadistListQueryOptions, HadistBlock work
- Modifying hadist-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `lib/server/hadist/hadist-server.ts` | fetchAllHadist |
| `lib/server/hadist/hadist-server-queris.ts` | HadistListQueryOptions |
| `components/ui/core/block/hadist-block.tsx` | HadistBlock |

## Entry Points

Start here when exploring this area:

- **`fetchAllHadist`** (Function) — `lib/server/hadist/hadist-server.ts:8`
- **`HadistListQueryOptions`** (Function) — `lib/server/hadist/hadist-server-queris.ts:17`
- **`HadistBlock`** (Function) — `components/ui/core/block/hadist-block.tsx:13`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `fetchAllHadist` | Function | `lib/server/hadist/hadist-server.ts` | 8 |
| `HadistListQueryOptions` | Function | `lib/server/hadist/hadist-server-queris.ts` | 17 |
| `HadistBlock` | Function | `components/ui/core/block/hadist-block.tsx` | 13 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `HadistBlock → FetchAllHadist` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "fetchAllHadist"})` — see callers and callees
2. `gitnexus_query({query: "hadist"})` — find related execution flows
3. Read key files listed above for implementation details
