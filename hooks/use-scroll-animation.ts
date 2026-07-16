import { useMemo } from 'react';
import {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  type SharedValue,
} from 'react-native-reanimated';

/**
 * Custom hook for scroll-triggered animations
 * FIXED: Follows Reanimated strict mode best practices
 * @param scrollPosition - SharedValue from Animated scroll
 * @param triggerPoint - Height in pixels to start animation
 * @param animationType - Type of animation: 'fade' | 'slide' | 'scale'
 * @returns Animated style object ready to be used in Animated.View
 */
export const useScrollAnimation = (
  scrollPosition: SharedValue<number> | undefined,
  triggerPoint: number = 100,
  animationType: 'fade' | 'slide' | 'scale' = 'fade'
) => {
  // ✅ Memoize config to prevent unnecessary recalculations
  const config = useMemo(
    () => ({
      triggerPoint,
      animationType,
    }),
    [triggerPoint, animationType]
  );

  return useAnimatedStyle(() => {
    // ✅ Check if scrollPosition exists in worklet context
    if (!scrollPosition) {
      return {};
    }

    // ✅ Use interpolate for smooth calculations
    const progress = interpolate(
      scrollPosition.value,
      [0, config.triggerPoint],
      [0, 1],
      Extrapolate.CLAMP
    );

    // ✅ Apply animation based on type
    switch (config.animationType) {
      case 'fade':
        return { opacity: progress };

      case 'slide':
        return {
          opacity: progress,
          transform: [{ translateY: (1 - progress) * 10 }],
        };

      case 'scale':
        return {
          opacity: progress,
          transform: [{ scale: 0.8 + progress * 0.2 }],
        };

      default:
        return { opacity: progress };
    }
  }, [scrollPosition, config]);
};
