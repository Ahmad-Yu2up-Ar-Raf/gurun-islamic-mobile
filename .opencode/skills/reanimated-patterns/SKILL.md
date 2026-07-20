---
name: reanimated-patterns
description: React Native Reanimated 4 patterns for Gurun Expo project
---

# Reanimated Patterns

## Configuration

- Logger: `configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false })` in root layout
- `strict: false` avoids noisy warnings from legitimate patterns

## Core Patterns

### Shared Values (UI Thread)

```typescript
import { useSharedValue, withSpring, withTiming, useAnimatedStyle } from 'react-native-reanimated';

function AnimatedComponent() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Animate on event:
  opacity.value = withTiming(1, { duration: 300 });
  scale.value = withSpring(1.2);
}
```

### Gesture Handler Integration

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const pan = Gesture.Pan()
  .onUpdate((e) => {
    offsetX.value = e.translationX;
  })
  .onEnd(() => {
    offsetX.value = withSpring(0);
  });
```

### Carousel (react-native-reanimated-carousel)

- Installed: `react-native-reanimated-carousel` v4
- Use for swipeable content (Qibla, Onboarding, etc.)
- Pages are React Native views, not WebViews

## Rules

- **Always use worklets** for animations — never `requestAnimationFrame` or JS timer-based animation
- Animated styles go in `useAnimatedStyle()` — not inline `style={}`
- `useSharedValue` over `useState` for any value that changes more than ~1x/second
- Avoid `useState` + `useEffect` for animation triggers — use `useDerivedValue` or worklets
- Gesture + animation: Gesture Handler `onUpdate` → update shared value → animated style

## Anti-patterns

- ❌ Layout animations without `layout` prop on Animated.View
- ❌ `setTimeout` for delayed animations → ✅ `withDelay()` or `withTiming({ duration, delay })`
- ❌ Reading shared value outside worklet without `.value` property
