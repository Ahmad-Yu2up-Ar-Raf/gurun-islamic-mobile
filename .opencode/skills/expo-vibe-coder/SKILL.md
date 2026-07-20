# SKILL: expo-vibe-coder

## PURPOSE
To enforce strict React Native, Expo Router, and NativeWind best practices in the Gurun project.

## TRIGGERS
Run this skill automatically when user asks to "create a new screen", "build a component", or "fetch API data".

## RULES TO ENFORCE
1. **NativeWind strictly:** Never use `StyleSheet.create`. Always use `className`. Use `cn()` from `@/lib/utils` for conditional styling.
2. **TanStack Query Caching:** When creating API fetches, ALWAYS set a `staleTime`. Never leave it at the default `0` unless explicitly asked.
3. **Zustand Scope:** Zustand is ONLY for client state (like user location or theme). Never put API responses (like Quran verses or prayer times) inside Zustand.
4. **Imports:** Always use absolute imports (`@/components/ui/`, `@/lib/server/`) instead of relative paths (`../../`).
5. **Reanimated:** Ensure all animations run on the UI thread using `useAnimatedStyle` and `withTiming`/`withSpring`.

## EXECUTION
When writing components, wrap the output in a try/catch block if it involves async operations. Default to functional components with Arrow Functions.