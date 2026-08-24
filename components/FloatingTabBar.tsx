import { Fonts, Radius, Spacing, TabBar } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INDICATOR_INSET = Spacing.xs;

interface TabBarItemProps {
  isFocused: boolean;
  color: string;
  label: string;
  icon: React.ReactNode;
  accessibilityLabel: string;
  onPress: () => void;
}

/** One tab's icon + label — memoized so a tab press only re-renders the two items whose focus state actually changed. */
const TabBarItem = React.memo(function TabBarItem({
  isFocused,
  color,
  label,
  icon,
  accessibilityLabel,
  onPress,
}: TabBarItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.item}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
      <Text variant="labelSmall" style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
});

/**
 * A pill that floats above the screen with transparent gutters on either
 * side (Dogo-style), instead of Paper/React Navigation's edge-to-edge bar.
 *
 * Built as a fully custom `tabBar` render prop rather than styling the
 * default bar via `tabBarStyle` — on Android, the native bottom-tab surface
 * doesn't reliably honour `left`/`right`/`borderRadius` on that style object
 * (it kept rendering full-width with only the top corners rounded), so this
 * renders the pill as a plain View we control end to end.
 */
export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const numRoutes = state.routes.length;

  // Slides a highlight pill behind the focused tab instead of just recolouring
  // icon/label — measured off the bar's own width (routes share it evenly)
  // rather than per-item onLayout, since every item is a flex:1 slice.
  const pillWidth = useSharedValue(0);
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    if (pillWidth.value === 0) return;
    const itemWidth = pillWidth.value / numRoutes;
    indicatorX.value = withTiming(state.index * itemWidth, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  }, [state.index, numRoutes, pillWidth, indicatorX]);

  const onPillLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      pillWidth.value = width;
      // Snap to the focused tab on first measurement, no slide from x=0.
      indicatorX.value = (width / numRoutes) * state.index;
    },
    [numRoutes, state.index, pillWidth, indicatorX],
  );

  // Centralizes the tabPress event + navigate logic so each item only closes
  // over its own route/isFocused, not the whole handler body.
  const handleTabPress = useCallback(
    (routeKey: string, routeName: string, isFocused: boolean) => {
      const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(routeName);
    },
    [navigation],
  );

  const indicatorStyle = useAnimatedStyle(() => ({
    width: pillWidth.value > 0 ? pillWidth.value / numRoutes - INDICATOR_INSET * 2 : 0,
    transform: [{ translateX: indicatorX.value + INDICATOR_INSET }],
  }));

  // The highlight pill sliding behind the focused tab.
  const renderIndicator = useCallback(() => (
    <Animated.View
      pointerEvents="none"
      style={[styles.indicator, indicatorStyle, { backgroundColor: theme.colors.primaryContainer }]}
    />
  ), [indicatorStyle, theme]);

  // One <TabBarItem> per route.
  const renderTabs = useCallback(() => (
    state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const isFocused = state.index === index;
      const color = isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant;
      const label = options.title ?? route.name;

      return (
        <TabBarItem
          key={route.key}
          isFocused={isFocused}
          color={color}
          label={label}
          icon={options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
          accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
          onPress={() => handleTabPress(route.key, route.name, isFocused)}
        />
      );
    })
  ), [state.routes, state.index, descriptors, theme, handleTabPress]);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { paddingHorizontal: Spacing.lg, paddingBottom: insets.bottom + TabBar.floatGap },
      ]}
    >
      <View
        onLayout={onPillLayout}
        style={[
          styles.pill,
          {
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.onSurface,
            shadowOpacity: theme.dark ? 0.5 : 0.15,
          },
        ]}
      >
        {renderIndicator()}
        {renderTabs()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  pill: {
    flexDirection: 'row',
    height: TabBar.height,
    borderRadius: Radius.full,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  indicator: {
    position: 'absolute',
    top: INDICATOR_INSET,
    bottom: INDICATOR_INSET,
    left: 0,
    borderRadius: Radius.full,
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: { fontFamily: Fonts.headingSemiBold, fontSize: 11 },
});
