# Gurun

A modern Muslim companion app for daily worship, built with React Native and Expo.

Gurun is designed to deliver a fast, elegant, privacy-focused mobile experience for prayer times, Quran reading, Qibla direction, daily duas, Asmaul Husna, and dhikr.

[![Expo](https://img.shields.io/badge/Expo-56-black?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-TailwindCSS-38B2AC)](https://www.nativewind.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-State%20Management-FFB000)](https://zustand-demo.pmnd.rs/)
[![React Query](https://img.shields.io/badge/TanStack%20Query-Server%20State-FF4154)](https://tanstack.com/query/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Introduction

Gurun is a modern Islamic lifestyle application built for Muslims who want a clean, fast, and reliable mobile companion for everyday worship.

It combines location-aware prayer times, a smooth Qibla finder, Quran reading, Asmaul Husna, daily duas, and dhikr into a single lightweight app experience.

The project is built with developer experience in mind:
- scalable architecture
- reusable UI blocks
- clean state management
- strong TypeScript typing
- modern Expo-based mobile tooling

## Why Gurun?

Most Islamic apps solve the same problems, but not all of them solve them with the same quality.

Gurun focuses on:
- speed over clutter
- simplicity over complexity
- privacy over heavy tracking
- modern native UX over generic templates
- clean architecture over tightly coupled logic

The result is a Muslim companion app that feels lightweight, responsive, and maintainable while still being feature-rich.

## Features

| Feature | Description | Status |
| --- | --- | --- |
| Prayer Times | Location-based prayer schedules with real-time countdown and next prayer calculation | Active |
| Qibla Finder | High-precision Qibla direction with smooth compass motion and fallback support | Active |
| Quran Reader | Digital Quran reading experience with fast navigation and clean presentation | Active |
| Asmaul Husna | 99 Names of Allah with Arabic text, transliteration, and meaning | Active |
| Daily Duas | Collection of daily supplications for common worship needs | Active |
| Dhikr | Interactive dhikr guidance and counter experience | Active |

## Screenshots

> Replace these placeholders with actual screenshots before publishing.

### Light Mode
![Light Mode](docs/screenshots/light-mode.png)

### Dark Mode
![Dark Mode](docs/screenshots/dark-mode.png)

### Prayer Times
![Prayer Times](docs/screenshots/prayer-times.png)

### Quran
![Quran](docs/screenshots/quran.png)

### Qibla
![Qibla](docs/screenshots/qibla.png)

### Asmaul Husna
![Asmaul Husna](docs/screenshots/asmaul-husna.png)

### Dzikir
![Dzikir](docs/screenshots/dzikir.png)

### Daily Duas
![Daily Duas](docs/screenshots/daily-duas.png)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React Native |
| Framework | Expo SDK 56 |
| Language | TypeScript |
| State Management | Zustand |
| Server State | TanStack Query |
| Networking | Ky |
| Routing | Expo Router v4 |
| Styling | NativeWind |
| UI System | Shadcn UI-inspired mobile components |
| Icons | Lucide React Native |
| Animation | React Native Reanimated |
| Gestures | React Native Gesture Handler |
| Haptics | Expo Haptics |
| Navigation | React Navigation v7 |
| Theme | Custom light/dark design system |

## Project Structure

```txt
.
├── app/
│   ├── _layout.tsx
│   ├── +html.tsx
│   ├── +not-found.tsx
│   └── (drawer)/
│       ├── (tabs)/
│       ├── doa/
│       ├── dzikir/
│       ├── hadist/
│       ├── asmaul_husna.tsx
│       └── qibla.tsx
├── assets/
├── components/
│   ├── provider/
│   └── ui/
├── hooks/
├── api/
├── lib/
├── services/
├── types/
├── utils/
├── global.css
├── tailwind.config.js
├── app.json
├── babel.config.js
└── tsconfig.json