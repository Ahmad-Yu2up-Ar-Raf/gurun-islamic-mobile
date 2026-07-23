---
name: reanimated-4
description: Reanimated 4 animation patterns — worklets, shared values, gestures
---

# Reanimated 4 — Animation Patterns

## Core Concepts

- **`useSharedValue(initial)`** — animation state on UI thread, access via `.value`
- **Worklets** — functions with `'worklet'` directive, run on UI thread (no closure capture, no JS APIs)
- **`useAnimatedStyle(() => ({...}))`** — reactive styles, return a style object
- **Animations**: `withTiming()`, `withSpring()`, `withSequence()`, `withRepeat()`, `withDelay()`
- **`useDerivedValue(() => ...)`** — computed shared value, auto-updates when dependencies change

## Gesture Handler + Reanimated

Use `Gesture.Pan()`, `Gesture.Tap()`, `Gesture.Pinch()`, `Gesture.Rotation()` with shared values:

```typescript
const offset = useSharedValue(0);
const context = useSharedValue({ y: 0 });

const pan = Gesture.Pan()
  .onStart(() => { context.value = { y: offset.value }; })
  .onUpdate((e) => { offset.value = context.value.y + e.translationY; })
  .onEnd((e) => {
    offset.value = e.velocityY > 800 ? withSpring(0) : withSpring(offset.value);
  });

// Compose gestures — Gesture.Race (first wins), Gesture.Simultaneous, Gesture.Exclusive
const gesture = Gesture.Race(pan, Gesture.Tap().onEnd(() => runOnJS(onTap)()));

// Ponytail: Gesture.Race avoids fighting between tap and drag on the same handle
```

Wrap in `<GestureDetector gesture={gesture}>` inside `<GestureHandlerRootView>`.

## Layout Animations (Entering / Exiting)

Reanimated provides built-in entering/exit animations. Import from `react-native-reanimated`:

```typescript
import { FadeIn, FadeOut, SlideInRight, SlideOutLeft, ZoomIn } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(300)} exiting={FadeOut}>
  {/* content */}
</Animated.View>
```

Common presets: `FadeIn`/`FadeOut`, `SlideInRight`/`SlideOutLeft`, `SlideInUp`/`SlideInDown`,
`ZoomIn`/`ZoomOut`. Chained modifiers: `.duration(ms)`, `.delay(ms)`, `.springify()`.

## react-native-reanimated-carousel

This project uses `react-native-reanimated-carousel`. The library provides a `Carousel` component that exposes scroll offset as a `SharedValue` for custom per-item animations:

```typescript
import Carousel, { ICarouselInstance, TCarouselProps } from 'react-native-reanimated-carousel';

// Custom item animation with useDerivedValue + interpolate:
const animationStyle = (value: number) => {
  'worklet';
  const scale = interpolate(value, [-1, 0, 1], [0.85, 1, 0.85], Extrapolate.CLAMP);
  const opacity = interpolate(value, [-1, 0, 1], [0.5, 1, 0.5], Extrapolate.CLAMP);
  return { transform: [{ scale }], opacity };
};

<Carousel
  data={items}
  renderItem={({ item }) => <YourItem />}
  customAnimation={animationStyle}
  loop
  autoPlay
  onSnapToItem={(i) => console.log(i)}
/>
```

Key patterns from the codebase:
- `customAnimation` receives a `value` (-1/0/1) — use `interpolate()` to map to transforms/opacity
- `useDerivedValue` for computing carousel progress from offset
- `onSnapToItem`, `onScrollStart`, `onScrollEnd` — run on JS thread via `runOnJS` internally
- `scrollTo({ index, animated: true })` via ref

## Scroll-Based Animations

```typescript
import { useSharedValue, useAnimatedScrollHandler, interpolate, Extrapolate } from 'react-native-reanimated';

const scrollY = useSharedValue(0);

const scrollHandler = useAnimatedScrollHandler({
  onScroll: (event) => { scrollY.value = event.contentOffset.y; },
});

const animatedStyle = useAnimatedStyle(() => {
  const progress = interpolate(scrollY.value, [0, 100], [0, 1], Extrapolate.CLAMP);
  return { opacity: progress, transform: [{ translateY: (1 - progress) * 10 }] };
});
```

Scroll handler variants: `onBeginDrag`, `onEndDrag`, `onMomentumBegin`, `onMomentumEnd`.

## Qibla Compass Rotation

Project-specific pattern for smooth 60fps compass rotation using `useAnimatedSensor`:

```typescript
import { useAnimatedSensor, SensorType } from 'react-native-reanimated';

const rotationSensor = useAnimatedSensor(SensorType.ROTATION, { interval: 'auto' });

// Compass ring rotates opposite to heading
const compassRingStyle = useAnimatedStyle(() => {
  const { yaw } = rotationSensor.sensor.value;
  return { transform: [{ rotate: `${-yawToHeading(yaw)}deg` }] };
});

// Arrow points to qibla
const arrowStyle = useAnimatedStyle(() => {
  const { yaw } = rotationSensor.sensor.value;
  const heading = yawToHeading(yaw);
  return { transform: [{ rotate: `${normalizeAngle(qiblaBearing - heading)}deg` }] };
});

// Derived values for JS consumption (no JS thread blocking)
const rotationToQibla = useDerivedValue(() => shortestRotation(heading, qibla));
```

Key: sensor data lives on UI thread at 60fps. Use `useAnimatedReaction` to bridge UI→JS for haptics or side effects. Magnetometer (JS thread, throttled) is only for accuracy/loading, not animation.

## Performance Best Practices

1. **Worklet rules**: Inside `'worklet'`, don't access React state/refs or call non-Reanimated functions. Use `runOnJS(fn)(args)` to bridge to JS thread.

2. **`useDerivedValue` > `useAnimatedStyle` for computation**: If a value is used by multiple animated styles, compute once with `useDerivedValue`.

3. **`useAnimatedReaction` for UI→JS sync**: Reacts to shared value changes without re-rendering components — use for haptics, logging, state that doesn't affect animation.

4. **Sensor data stays on UI thread**: Don't funnel sensor values through JS state. Keep `useAnimatedSensor` reads inside worklets.

5. **`withSpring` tuning for bottom sheets**: Use `{ damping: 28, stiffness: 280, mass: 0.9, overshootClamping: true }` for snappy sheets without bounce.

6. **`withTiming` callback**: Use `withTiming(target, { duration: 300 }, (finished) => { if (finished) runOnJS(callback)(); })` for post-animation side effects.

7. **Shared values don't trigger React re-renders** — use `useDerivedValue` or `useAnimatedReaction` if you need to react. Don't read `.value` on JS thread outside effects/callbacks.

8. **Avoid `console.log` in worklets** — it kills performance. Use `runOnJS(console.log)(...)` or remove entirely.

9. **`interpolate` with `Extrapolate.CLAMP`** to prevent values going out of bounds.

## Pitfalls

1. Don't read shared values outside worklets without `.value`
2. Don't call random functions inside worklets — only `runOnJS` for JS thread calls
3. Shared value changes don't trigger React re-renders — use `useDerivedValue` if needed
4. Don't mutate objects/arrays in worklets — spread or return new references
5. `Gesture.Race()` vs `Gesture.Simultaneous()` — Race cancels the loser, Simultaneous fires both
6. Reanimated logger: `strict: false` configured in app bootstrap
