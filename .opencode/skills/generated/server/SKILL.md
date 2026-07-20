---
name: server
description: "Skill for the Server area of Gurun. 3 symbols across 3 files."
---

# Server

3 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `components/`
- Understanding how DzikirBlock, fetchAllDzikir, DzikirListQueryOptions work
- Modifying server-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `components/ui/core/block/dzikir/dzikir-block.tsx` | DzikirBlock |
| `components/ui/core/block/dzikir/server/dzikir-server.ts` | fetchAllDzikir |
| `components/ui/core/block/dzikir/server/dzikir-server-queris.ts` | DzikirListQueryOptions |

## Entry Points

Start here when exploring this area:

- **`DzikirBlock`** (Function) — `components/ui/core/block/dzikir/dzikir-block.tsx:51`
- **`fetchAllDzikir`** (Function) — `components/ui/core/block/dzikir/server/dzikir-server.ts:8`
- **`DzikirListQueryOptions`** (Function) — `components/ui/core/block/dzikir/server/dzikir-server-queris.ts:48`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `DzikirBlock` | Function | `components/ui/core/block/dzikir/dzikir-block.tsx` | 51 |
| `fetchAllDzikir` | Function | `components/ui/core/block/dzikir/server/dzikir-server.ts` | 8 |
| `DzikirListQueryOptions` | Function | `components/ui/core/block/dzikir/server/dzikir-server-queris.ts` | 48 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `DzikirBlock → FetchAllDzikir` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "DzikirBlock"})` — see callers and callees
2. `gitnexus_query({query: "server"})` — find related execution flows
3. Read key files listed above for implementation details
