---
name: custom-ui
description: "Skill for the Custom-ui area of Gurun. 7 symbols across 2 files."
---

# Custom-ui

7 symbols | 2 files | Cohesion: 100%

## When to Use

- Working with code in `components/`
- Understanding how BottomSheet, scrollTo, handlePress work
- Modifying custom-ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `components/ui/fragments/custom-ui/bottom-sheet.tsx` | BottomSheet, scrollTo, handlePress, animateClose, handleBackdropPress (+1) |
| `components/ui/core/block/surah/surah-block.tsx` | SurahBlock |

## Entry Points

Start here when exploring this area:

- **`BottomSheet`** (Function) — `components/ui/fragments/custom-ui/bottom-sheet.tsx:139`
- **`scrollTo`** (Function) — `components/ui/fragments/custom-ui/bottom-sheet.tsx:203`
- **`handlePress`** (Function) — `components/ui/fragments/custom-ui/bottom-sheet.tsx:218`
- **`animateClose`** (Function) — `components/ui/fragments/custom-ui/bottom-sheet.tsx:224`
- **`handleBackdropPress`** (Function) — `components/ui/fragments/custom-ui/bottom-sheet.tsx:277`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `BottomSheet` | Function | `components/ui/fragments/custom-ui/bottom-sheet.tsx` | 139 |
| `scrollTo` | Function | `components/ui/fragments/custom-ui/bottom-sheet.tsx` | 203 |
| `handlePress` | Function | `components/ui/fragments/custom-ui/bottom-sheet.tsx` | 218 |
| `animateClose` | Function | `components/ui/fragments/custom-ui/bottom-sheet.tsx` | 224 |
| `handleBackdropPress` | Function | `components/ui/fragments/custom-ui/bottom-sheet.tsx` | 277 |
| `useBottomSheet` | Function | `components/ui/fragments/custom-ui/bottom-sheet.tsx` | 311 |
| `SurahBlock` | Function | `components/ui/core/block/surah/surah-block.tsx` | 23 |

## How to Explore

1. `gitnexus_context({name: "BottomSheet"})` — see callers and callees
2. `gitnexus_query({query: "custom-ui"})` — find related execution flows
3. Read key files listed above for implementation details
