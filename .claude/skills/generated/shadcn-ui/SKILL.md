---
name: shadcn-ui
description: "Skill for the Shadcn-ui area of Gurun. 56 symbols across 34 files."
---

# Shadcn-ui

56 symbols | 34 files | Cohesion: 99%

## When to Use

- Working with code in `components/`
- Understanding how cn, TabsLayout, Wrapper work
- Modifying shadcn-ui-related functionality

## Key Files

| File | Symbols |
|------|---------|
| `components/ui/fragments/shadcn-ui/dropdown-menu.tsx` | DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem (+4) |
| `components/ui/fragments/shadcn-ui/card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent (+1) |
| `components/ui/fragments/shadcn-ui/tabs.tsx` | Tabs, TabsList, TabsTrigger, TabsContent |
| `components/ui/fragments/shadcn-ui/avatar.tsx` | Avatar, AvatarImage, AvatarFallback |
| `components/ui/fragments/shadcn-ui/alert.tsx` | Alert, AlertTitle, AlertDescription |
| `components/ui/fragments/shadcn-ui/radio-group.tsx` | RadioGroup, RadioGroupItem |
| `components/ui/core/block/dzikir/components/filter-carousel.tsx` | FiltersCarousel, FilterButton |
| `lib/utils.ts` | cn |
| `app/(drawer)/(tabs)/_layout.tsx` | TabsLayout |
| `components/ui/core/layout/wrapper.tsx` | Wrapper |

## Entry Points

Start here when exploring this area:

- **`cn`** (Function) — `lib/utils.ts:3`
- **`TabsLayout`** (Function) — `app/(drawer)/(tabs)/_layout.tsx:20`
- **`Wrapper`** (Function) — `components/ui/core/layout/wrapper.tsx:25`
- **`HeaderComponent`** (Function) — `components/ui/core/layout/nav.tsx:38`
- **`MenuCard`** (Function) — `components/ui/fragments/custom-ui/card/menu-card.tsx:20`

## Key Symbols

| Symbol | Type | File | Line |
|--------|------|------|------|
| `cn` | Function | `lib/utils.ts` | 3 |
| `TabsLayout` | Function | `app/(drawer)/(tabs)/_layout.tsx` | 20 |
| `Wrapper` | Function | `components/ui/core/layout/wrapper.tsx` | 25 |
| `HeaderComponent` | Function | `components/ui/core/layout/nav.tsx` | 38 |
| `MenuCard` | Function | `components/ui/fragments/custom-ui/card/menu-card.tsx` | 20 |
| `HadistCard` | Function | `components/ui/fragments/custom-ui/card/hadist-card.tsx` | 23 |
| `DoaCard` | Function | `components/ui/fragments/custom-ui/card/doa-card.tsx` | 24 |
| `AsmaulHusnaCard` | Function | `components/ui/fragments/custom-ui/card/asmaul-husna-card.tsx` | 21 |
| `QuranHeader` | Function | `components/ui/core/block/quran/components/quran-header.tsx` | 7 |
| `ProgressReadCard` | Function | `components/ui/core/block/quran/components/progress-card.tsx` | 21 |
| `SuraHeader` | Function | `components/ui/core/block/surah/components/sura-header.tsx` | 22 |
| `AyatCard` | Function | `components/ui/core/block/surah/components/ayat-card.tsx` | 32 |
| `DzikirCard` | Function | `components/ui/core/block/dzikir/components/dzikir-card.tsx` | 25 |
| `Textarea` | Function | `components/ui/fragments/shadcn-ui/textarea.tsx` | 3 |
| `Text` | Function | `components/ui/fragments/shadcn-ui/text.tsx` | 66 |
| `Tabs` | Function | `components/ui/fragments/shadcn-ui/tabs.tsx` | 5 |
| `TabsList` | Function | `components/ui/fragments/shadcn-ui/tabs.tsx` | 14 |
| `TabsTrigger` | Function | `components/ui/fragments/shadcn-ui/tabs.tsx` | 30 |
| `TabsContent` | Function | `components/ui/fragments/shadcn-ui/tabs.tsx` | 59 |
| `Switch` | Function | `components/ui/fragments/shadcn-ui/switch.tsx` | 4 |

## How to Explore

1. `gitnexus_context({name: "cn"})` — see callers and callees
2. `gitnexus_query({query: "shadcn-ui"})` — find related execution flows
3. Read key files listed above for implementation details
