import { FabBottomOffset, FabClearance, Spacing, TabBarClearance } from '@/constants/theme';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from './AppHeader';

interface BaseScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  header?: boolean;
  headerTitle?: string;
  /** Replaces the header's default title text with a custom node. */
  headerLeft?: () => React.ReactNode;
  fab?: {
    icon?: string;
    onPress: () => void;
    accessibilityLabel?: string;
  };
  avoidKeyboard?: boolean;
  /**
   * Reserves bottom space equal to the floating tab bar's height (or, when
   * `fab` is set, the larger clearance the FAB already needs to float above
   * it) so a screen's content/fixed bottom controls never end up under it.
   * Default true — a screen only sets this false when it manages its own
   * bottom-safe-area spacing (e.g. a screen with no scrollable content and
   * nothing pinned near the bottom edge).
   */
  bottomBarClearance?: boolean;
}

export function BaseScreen({
  children,
  edges = ['top', 'bottom'],
  style,
  header = true,
  headerTitle,
  headerLeft,
  fab,
  avoidKeyboard = true,
  bottomBarClearance = true,
}: BaseScreenProps) {
  const theme = useTheme();
  const clearance = bottomBarClearance ? (fab ? FabClearance : TabBarClearance) : 0;
  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }, style]}
      edges={edges}
    >
      {header && <AppHeader title={headerTitle} renderLeft={headerLeft} />}
      <View style={[styles.flex, { paddingBottom: clearance }]}>
        {avoidKeyboard ? (
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {children}
          </KeyboardAvoidingView>
        ) : (
          children
        )}
      </View>
      {fab ? (
        <Animated.View entering={ZoomIn.delay(150).duration(300)} style={styles.fabPosition}>
          <FAB
            icon={fab.icon ?? 'plus'}
            style={[
              styles.fabShadow,
              { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary },
            ]}
            color={theme.colors.onPrimary}
            onPress={fab.onPress}
            accessibilityLabel={fab.accessibilityLabel}
          />
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  fabPosition: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: FabBottomOffset,
  },
  fabShadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
});
