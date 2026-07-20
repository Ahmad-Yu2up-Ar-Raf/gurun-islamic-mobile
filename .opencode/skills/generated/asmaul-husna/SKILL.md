---
name: asmaul-husna
description: "Skill for the Asmaul_husna area of Gurun. 3 symbols across 3 files."
---

# Asmaul_husna

3 symbols | 3 files | Cohesion: 100%

## When to Use

- Working with code in `lib/`
- Understanding how fetchAllAsmaulHusna, AsmaulHusnaListQueryOptions, AsmaulHusnaBlock work
- Modifying asmaul_husna-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `lib/server/asmaul_husna/asmaul-husna-server.ts` | fetchAllAsmaulHusna |
| `lib/server/asmaul_husna/asmaul-husna-server-queris.ts` | AsmaulHusnaListQueryOptions |
| `components/ui/core/block/asmaul-husna-block.tsx` | AsmaulHusnaBlock |

## Entry Points

Start here when exploring this area:

- **`fetchAllAsmaulHusna`** (Function) — `lib/server/asmaul_husna/asmaul-husna-server.ts:8`
- **`AsmaulHusnaListQueryOptions`** (Function) — `lib/server/asmaul_husna/asmaul-husna-server-queris.ts:18`
- **`AsmaulHusnaBlock`** (Function) — `components/ui/core/block/asmaul-husna-block.tsx:13`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `fetchAllAsmaulHusna` | Function | `lib/server/asmaul_husna/asmaul-husna-server.ts` | 8 |
| `AsmaulHusnaListQueryOptions` | Function | `lib/server/asmaul_husna/asmaul-husna-server-queris.ts` | 18 |
| `AsmaulHusnaBlock` | Function | `components/ui/core/block/asmaul-husna-block.tsx` | 13 |

## Execution Flows

| Flow | Type | Steps |
|------|------|-------|
| `AsmaulHusnaBlock → FetchAllAsmaulHusna` | intra_community | 3 |

## How to Explore

1. `gitnexus_context({name: "fetchAllAsmaulHusna"})` — see callers and callees
2. `gitnexus_query({query: "asmaul_husna"})` — find related execution flows
3. Read key files listed above for implementation details
