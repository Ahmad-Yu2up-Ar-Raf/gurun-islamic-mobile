import { cn } from '@/lib/utils';
import Animated, {
  type AnimatedRef,
  type AnimatedScrollViewProps,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, type StyleProp, type ViewStyle, Platform } from 'react-native';

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
  scrollRef?: AnimatedRef<Animated.ScrollView>;
  onScroll?: AnimatedScrollViewProps['onScroll'];
  containerClassName?: string;

  edges?: ('top' | 'bottom' | 'left' | 'right')[];

  scrollViewStyle?: AnimatedStyle<StyleProp<ViewStyle>>;

  contentContainerStyle?: StyleProp<ViewStyle>;

  animatedScrollHandler?: AnimatedScrollViewProps['onScroll'];
};

export function Wrapper({
  children,
  scrollRef,
  onScroll,
  className,
  containerClassName,
  edges = [],
  scrollViewStyle,
  contentContainerStyle,
  animatedScrollHandler,
}: WrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={edges} className={cn('flex flex-1 px-8', containerClassName)}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={animatedScrollHandler ?? onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName={cn('flex-col pt-0   gap-3 relative', className)}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        style={scrollViewStyle}>
        {children}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
