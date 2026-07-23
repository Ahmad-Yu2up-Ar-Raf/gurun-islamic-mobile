# Gurun

A modern Muslim companion for everyday worship — fast, private, and beautifully crafted with React Native & Expo.

Gurun combines accurate prayer times, a precision Qibla compass, digital Quran, Asmaul Husna, daily duas, dhikr, and hadith into one lightweight, ad-free mobile experience. Built with developer-quality architecture and a strong focus on performance, accessibility, and clean design.

[![Expo](https://img.shields.io/badge/Expo-57-black?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86-blue?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![NativeWind](https://img.shields.io/badge/NativeWind_v4-TailwindCSS-38B2AC?logo=tailwindcss)](https://www.nativewind.dev)
[![Zustand](https://img.shields.io/badge/Zustand-Store-FFB000)](https://zustand-demo.pmnd.rs)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery)](https://tanstack.com/query)
[![Expo Router](https://img.shields.io/badge/Expo_Router-v4-000020?logo=expo)](https://docs.expo.dev/router/introduction/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Why Gurun?

Most Islamic apps are either bloated with features you don't need or poorly maintained. Gurun takes a different approach.

**Fast by default.** No splash-screen splash, no janky scrolling, no unnecessary re-renders. Built with Reanimated worklets, efficient list recycling, and selective state subscriptions.

**Privacy first.** No analytics SDKs, no tracking, no ads. Your location data stays on your device.

**Beautiful on every device.** A cohesive design system spanning 21 UI primitives, custom typography (Poppins, Teko, Noto Naskh Arabic for Arabic script), and full light/dark mode with HSL-driven tokens.

**Architecture you can trust.** Feature-based modules, pure business logic separated from React, TanStack Query for server state, Zustand for client state, and TypeScript strict mode throughout.

## Features

| Feature | Description | Status |
|---|---|---|
| Prayer Times | Location-based daily schedule with real-time countdown and automatic province/city detection | Active |
| Qibla Finder | High-precision compass using device sensors with 60 FPS animation and automatic fallback to Google Qibla Finder | Active |
| Holy Quran | Browse and read surahs with Arabic text, Latin transliteration, and Indonesian translation | Active |
| Asmaul Husna | 99 Names of Allah with Arabic script, transliteration, and meaning | Active |
| Daily Duas | Curated collection of authentic daily supplications | Active |
| Dhikr | Interactive digital dhikr guide with type-based filtering (morning, evening, after prayer) and counter | Active |
| Hadith | Collection of authenticated hadiths | Active |

<!-- ## Screenshots

> Replace these placeholders with actual screenshots before publishing.

### Light Mode

<p align="center">
  <img src="docs/screenshots/light-mode.png" width="250" alt="Light Mode" />
  <img src="docs/screenshots/dark-mode.png" width="250" alt="Dark Mode" />
</p>

### Features

<p align="center">
  <img src="docs/screenshots/prayer-times.png" width="250" alt="Prayer Times" />
  <img src="docs/screenshots/quran.png" width="250" alt="Quran" />
  <img src="docs/screenshots/qibla.png" width="250" alt="Qibla" />
  <img src="docs/screenshots/asmaul-husna.png" width="250" alt="Asmaul Husna" />
  <img src="docs/screenshots/dzikir.png" width="250" alt="Dhikr" />
  <img src="docs/screenshots/daily-duas.png" width="250" alt="Daily Duas" />
</p> -->

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (0.86) via Expo SDK 57 |
| Language | TypeScript (strict mode) |
| Routing | Expo Router v4 (file-based) |
| Styling | NativeWind v4 (TailwindCSS) |
| State (Client) | Zustand with persist middleware |
| State (Server) | TanStack Query v5 |
| UI Primitives | 21 shadcn/ui-inspired mobile components |
| HTTP Client | Ky |
| Icons | Lucide React Native |
| Animation | React Native Reanimated 4 |
| Gestures | React Native Gesture Handler |
| Haptics | Expo Haptics |
| Sensors | Expo Sensors + AnimatedSensor |
| Navigation | React Navigation v7 (Drawer + Tabs + Stack) |
| Lists | @legendapp/list (high-performance recycler) |
| Prayer/Qibla | Adhan |
| Audio | Expo Audio |
| Secure Storage | Expo Secure Store |
| Date Utilities | date-fns |

## Project Structure

```txt
.
├── app/                          # Expo Router — file-based routing
│   ├── _layout.tsx               # Root layout (fonts, splash, providers)
│   ├── +not-found.tsx            # 404 screen
│   ├── (drawer)/                 # Drawer navigator
│   │   ├── _layout.tsx           # Sidebar + navigation
│   │   ├── (tabs)/               # Bottom tabs (Home, Quran, Qibla, Settings)
│   │   ├── doa/                  # Daily duas
│   │   ├── dzikir/               # Dhikr
│   │   ├── hadist/               # Hadith
│   │   └── asmaul_husna.tsx      # 99 Names of Allah
│   └── surah/                    # Dynamic surah detail route
│       └── [id].tsx
│
├── components/
│   ├── provider/                 # App-level providers
│   └── ui/
│       ├── core/block/           # Screen-level feature blocks
│       │   ├── home/             # Prayer times (hooks, services, store, types)
│       │   ├── qibla/            # Qibla compass (hooks, utils)
│       │   ├── quran/            # Quran listing (hooks, store, types)
│       │   ├── surah/            # Surah detail (hooks, store, types)
│       │   ├── doa-block.tsx
│       │   ├── dzikir-block.tsx
│       │   ├── hadist-block.tsx
│       │   └── asmaul-husna-block.tsx
│       ├── core/layout/          # Nav, wrapper, menu sheet
│       ├── fragments/shadcn-ui/  # 21 reusable UI primitives
│       ├── fragments/custom-ui/  # Domain-specific composites
│       └── fragments/svg/        # Custom SVG components + icons
│
├── hooks/                        # Shared hooks
├── api/                          # HTTP client (Ky)
├── lib/                          # Shared libraries
│   ├── server/                   # API functions + TanStack Query options
│   ├── storage/                  # AsyncStorage persistence
│   ├── theme.ts                  # Light/dark theme tokens
│   └── utils.ts                  # cn() utility
├── type/                         # TypeScript type definitions
│
├── assets/                       # Fonts, images, splash SVGs
├── global.css                    # Tailwind + HSL CSS variables
├── tailwind.config.js            # Custom theme (colors, fonts, animations)
├── app.json                      # Expo configuration
├── tsconfig.json                 # Strict TypeScript config
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`) or `npx expo`
- iOS Simulator (macOS, Xcode) or Android Emulator / physical device with Expo Go

### Installation

```bash
git clone https://github.com/your-username/gurun.git
cd gurun
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=https://equran.id/api/
```

### Run Development Server

```bash
npx expo start
```

Scan the QR code with Expo Go (Android/iOS), or press:

- `a` — open on Android emulator
- `i` — open on iOS simulator
- `w` — open in web browser

## Contributing

Contributions are welcome and encouraged. This project follows standard open-source practices.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing conventions: TypeScript strict mode, feature-module organization, and the established data-fetching pattern with TanStack Query.

## Roadmap

- [ ] Prayer notifications with customizable alerts
- [ ] Offline Quran with full local caching
- [ ] Bookmark and last-read tracking for Quran
- [ ] Prayer history and statistics
- [ ] Home screen widget support (iOS + Android)
- [ ] Multi-language support (English, Arabic, Indonesian)
- [ ] Audio Quran with multiple reciters
- [ ] Islamic calendar with Hijri date
- [ ] Mosque finder with nearby locations

## Performance

Gurun is built with performance as a first-class concern:

- **60 FPS animations** — Reanimated worklets run on the UI thread, never blocking JS
- **Efficient list rendering** — `@legendapp/list` with view recycling prevents memory growth
- **Selective re-renders** — Zustand selector pattern and `React.memo` limit component updates
- **Optimized assets** — Custom fonts subsetted to required weights, SVG icons are tree-shakeable
- **Smart caching** — TanStack Query with aggressive `staleTime`/`gcTime` reduces network requests

## License

MIT &copy; Ahmad Yusuf Ar-Rafi

---

<p align="center">
  Built with ❤️ for the Muslim community.
  <br />
  Star on GitHub &middot; Fork &middot; Contribute
</p>
# Demo note
