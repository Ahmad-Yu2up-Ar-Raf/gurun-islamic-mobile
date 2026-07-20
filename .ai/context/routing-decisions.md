# Routing Architecture Decisions

## Decision: Expo Router v4 with Stack → Drawer → Tabs

**Context:** Root layout uses `Stack` navigator with `headerShown: false` and `animation: 'slide_from_right'`. Drawer is the primary navigation container, containing both bottom tabs and standalone screens.

**Rationale:**
- File-based routing matches app directory structure
- Drawer provides top-level navigation for major sections (Doa, Dzikir, Hadist, Asmaul Husna)
- Tabs provide quick switching for the 4 primary features (Home, Quran, Qibla, Settings)
- Stack handles detail routes (surah/[id]) with slide animation

**Structure:**
```
Stack (root, no headers)
  └── Drawer (swipeable sidebar, initialRoute: (tabs))
      ├── Tabs (bottom tab bar: Home, Quran, Qibla, Settings)
      └── Drawer screens (Doa, Dzikir, Hadist, Asmaul Husna)
  └── Stack screen (surah/[id])
```

**Trade-offs:**
- Drawer content is currently rendered via custom component (not default drawer items)
- Menu items are defined in DRAWER_MENU array but rendering is commented out — drawer currently shows branding only
- Navigation is programmatic via `router.push()`

**Decision Date:** Initial project setup
