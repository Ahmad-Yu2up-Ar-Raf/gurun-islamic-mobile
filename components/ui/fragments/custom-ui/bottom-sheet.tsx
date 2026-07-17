import { Text } from '../shadcn-ui/text';
import { View } from 'react-native';
import { useKeyboardHeight } from '@/hooks/use-keyboard-height';

import React, { useEffect } from 'react';
import { Dimensions, Modal, ScrollView, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Tuned so the sheet decelerates into place without crossing (and bouncing back from)
// its target value. overshootClamping is what actually removes the "boing" feel —
// tweaking damping/stiffness alone can't guarantee zero overshoot across devices.
const SHEET_SPRING_CONFIG = {
  damping: 28,
  stiffness: 280,
  mass: 0.9,
  overshootClamping: true,
} as const;

// How far (as a fraction of the sheet's own open height) the user has to drag down
// before release counts as "let go to dismiss" instead of "snap back open".
const DISMISS_DISTANCE_RATIO = 0.25;
// A fast downward flick dismisses even if the distance threshold above wasn't reached.
const DISMISS_VELOCITY_THRESHOLD = 800;
// Expands the draggable/tappable area around the handle without changing how it looks.
const HANDLE_HIT_SLOP = { top: 12, bottom: 12, left: 24, right: 24 };

type BottomSheetContentProps = {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
  rBottomSheetStyle: any;
  className?: string;
  panGesture: any;
  disablePanGesture?: boolean;
  maxContentHeight: number;
  onMeasureChrome: (height: number) => void;
  onMeasureContent: (height: number) => void;
  onHandlePress?: () => void;
};

// Component for the bottom sheet content.
// Sizing: the {handle + title} block is measured via onLayout ("chrome"), and the
// ScrollView's real content height is measured via onContentSizeChange — independent
// of however much of it is actually visible. The parent combines the two to figure out
// how tall the sheet should be (fit-content, capped at maxSnapPoint).
const BottomSheetContent = ({
  children,
  title,
  style,
  rBottomSheetStyle,
  className,
  panGesture,
  disablePanGesture,
  maxContentHeight,
  onMeasureChrome,
  onMeasureContent,
  onHandlePress,
}: BottomSheetContentProps) => {
  // Tap-to-close on the handle, composed with the drag gesture so a quick tap and a
  // drag never fight each other — Gesture.Race lets whichever one activates first win.
  const tapGesture = Gesture.Tap()
    .hitSlop(HANDLE_HIT_SLOP)
    .onEnd((_event, success) => {
      if (success && onHandlePress) runOnJS(onHandlePress)();
    });

  const handleGesture = disablePanGesture ? tapGesture : Gesture.Race(tapGesture, panGesture);

  return (
    <Animated.View
      className={cn('absolute w-full rounded-t-xl bg-background', className)}
      style={[
        {
          height: SCREEN_HEIGHT,
          top: SCREEN_HEIGHT,
        },
        rBottomSheetStyle,
        style,
      ]}>
      {/* Chrome: handle + title. Measured as one block so title's presence/height is
          automatically accounted for without hardcoding any numbers. */}
      <View onLayout={(e) => onMeasureChrome(e.nativeEvent.layout.height)}>
        {/* Handle — the ONLY part of the sheet that owns the drag gesture. */}
        <GestureDetector gesture={handleGesture}>
          <View className="w-full items-center py-3">
            <View className="h-1.5 w-16 rounded-full bg-muted-foreground/30" />
          </View>
        </GestureDetector>

        {/* Title */}
        {title && (
          <View className="mx-4 mt-4 pb-2">
            <Text variant={'h1'} className="text-center">
              {title}
            </Text>
          </View>
        )}
      </View>

      {/* Content. No flex-1 here on purpose: without it the ScrollView sizes itself to
          its own content (fit-content), and maxHeight only kicks in to cap + enable
          scrolling once content actually exceeds maxSnapPoint. No Gesture Handler /
          Pan is attached anywhere in this subtree, so its native scroll responder
          never has to compete with the sheet's drag gesture. */}
      <ScrollView
        style={{ maxHeight: maxContentHeight }}
        contentContainerClassName="p-4 pb-10"
        onContentSizeChange={(_width, height) => onMeasureContent(height)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </Animated.View>
  );
};

type BottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Fraction (0–1) of the screen the sheet may grow up to. Defaults to the full screen. */
  maxSnapPoint?: number;
  enableBackdropDismiss?: boolean;
  title?: string;
  style?: ViewStyle;
  className?: string;
  disablePanGesture?: boolean;
};

export function BottomSheet({
  isVisible,
  className,
  onClose,
  children,
  maxSnapPoint = 1,
  enableBackdropDismiss = true,
  title,
  style,
  disablePanGesture = false,
}: BottomSheetProps) {
  const { keyboardHeight, isKeyboardVisible } = useKeyboardHeight();

  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const opacity = useSharedValue(0);
  const keyboardHeightSV = useSharedValue(0);
  // Mirrors `openHeight` on the UI thread so gesture worklets can read it without
  // bouncing back to JS.
  const openHeightSV = useSharedValue(0);

  const [modalVisible, setModalVisible] = React.useState(false);
  // Natural height of {handle + title}, measured via onLayout.
  const [chromeHeight, setChromeHeight] = React.useState(0);
  // Natural height of the scrollable content, measured via onContentSizeChange —
  // this is the *full* content height regardless of how much is currently clipped.
  const [contentHeight, setContentHeight] = React.useState(0);

  const maxAllowedHeight = maxSnapPoint * SCREEN_HEIGHT;
  // Fit-content height, clamped to the configured maximum. This is what the sheet
  // actually animates to — there's no array of stops anymore, just this one value.
  const openHeight = Math.min(chromeHeight + contentHeight, maxAllowedHeight);
  // Whatever's left for the ScrollView once chrome has taken its share. Content
  // smaller than this just renders at its natural size; content larger gets capped
  // here and becomes scrollable automatically (no extra boolean/flag needed).
  const maxContentHeight = Math.max(maxAllowedHeight - chromeHeight, 0);

  useEffect(() => {
    openHeightSV.value = openHeight;
  }, [openHeight]);

  // Open/close lifecycle. Position is only animated once we have a real measurement
  // (openHeight > 0) so there's no visible jump from a fallback height to the real one.
  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(0, SHEET_SPRING_CONFIG);
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && openHeight > 0) {
      translateY.value = withSpring(-openHeight, SHEET_SPRING_CONFIG);
    }
  }, [isVisible, openHeight]);

  // Function to animate the sheet to a specific destination
  const scrollTo = (destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, SHEET_SPRING_CONFIG);
  };

  // Keep the sheet clear of the keyboard while open.
  useEffect(() => {
    keyboardHeightSV.value = keyboardHeight;

    if (isVisible && openHeight > 0) {
      const destination = isKeyboardVisible ? -openHeight - keyboardHeight : -openHeight;
      scrollTo(destination);
    }
  }, [keyboardHeight, isKeyboardVisible, isVisible, openHeight]);

  const handlePress = () => {
    // With a single snap point there's nothing to "cycle" through anymore —
    // tapping the handle is just a convenient extra way to dismiss.
    animateClose();
  };

  const animateClose = () => {
    'worklet';
    translateY.value = withSpring(0, SHEET_SPRING_CONFIG);
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  };

  // Lives ONLY on the handle (see BottomSheetContent) — it is never attached to the
  // body/ScrollView, so dragging content can never be hijacked into resizing the sheet.
  const panGesture = Gesture.Pan()
    .hitSlop(HANDLE_HIT_SLOP)
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY;
      const minY = -openHeightSV.value - keyboardHeightSV.value;
      translateY.value = Math.min(0, Math.max(newY, minY));
    })
    .onEnd((event) => {
      const velocity = event.velocityY;
      // How far down (in px) the sheet has been dragged away from fully open.
      const draggedDistance = translateY.value + openHeightSV.value;
      const dismissDistance = openHeightSV.value * DISMISS_DISTANCE_RATIO;

      const shouldDismiss =
        draggedDistance > dismissDistance || velocity > DISMISS_VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        animateClose();
        return;
      }

      // Otherwise, settle back at the fully open position (keyboard-aware).
      const openPosition = -openHeightSV.value - keyboardHeightSV.value;
      scrollTo(openPosition);
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleBackdropPress = () => {
    if (enableBackdropDismiss) {
      animateClose();
    }
  };

  return (
    <Modal visible={modalVisible} transparent statusBarTranslucent animationType="none">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View className="flex-1 bg-black/80" style={rBackdropStyle}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <Animated.View className="flex-1" />
          </TouchableWithoutFeedback>

          <BottomSheetContent
            children={children}
            title={title}
            className={className}
            style={style}
            rBottomSheetStyle={rBottomSheetStyle}
            panGesture={panGesture}
            disablePanGesture={disablePanGesture}
            maxContentHeight={maxContentHeight}
            onMeasureChrome={setChromeHeight}
            onMeasureContent={setContentHeight}
            onHandlePress={handlePress}
          />
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

// Hook for managing bottom sheet state
export function useBottomSheet() {
  const [isVisible, setIsVisible] = React.useState(false);

  const open = React.useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = React.useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return {
    isVisible,
    open,
    close,
    toggle,
  };
}
