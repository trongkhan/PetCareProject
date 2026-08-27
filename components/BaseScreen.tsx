import { FabBottomOffset, FabClearance, Spacing, TabBarClearance } from '@/constants/theme';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { FAB, Portal, useTheme } from 'react-native-paper';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Edge, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  /**
   * Gives this screen its own Portal.Host instead of using the app-level one
   * from PaperProvider. Needed ONLY for a screen presented as a native modal
   * (react-native-screens `presentation: 'modal'`, e.g. pet/create,
   * pet/edit) — that modal is its own native surface sitting in front of the
   * root Portal.Host, so a descendant <Portal> (DatePickerField's bottom
   * sheet, a Dialog) mounts there but renders invisibly, covered by the
   * modal. Default false: a screen living inside the tabs navigator must
   * NOT set this — its own Portal.Host would sit inside that screen's own
   * subtree, which is BEHIND the floating tab bar (a sibling the tab
   * navigator renders on top, outside any one screen), so a Portal meant to
   * float above everything — a picker sheet opened from the header, say —
   * would render underneath the tab bar instead of the root host it needs.
   */
  ownPortalHost?: boolean;
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
  ownPortalHost = false,
}: BaseScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // FloatingTabBar positions itself with `insets.bottom + TabBar.floatGap`
  // from the true screen edge — TabBarClearance/FabClearance are the fixed
  // part of that (the bar's own height + gap), not the device's home-
  // indicator inset. A screen whose SafeAreaView already reserves the
  // bottom edge (edges includes 'bottom') has that inset covered there
  // already; adding it again here would double it. Every tab screen
  // (Home/Assistant/Account) omits 'bottom' from edges specifically so this
  // clearance is the ONLY thing reserving it — those need it added here, or
  // content sits exactly on top of where the floating bar actually renders.
  const clearance = bottomBarClearance
    ? (fab ? FabClearance : TabBarClearance) + (edges.includes('bottom') ? 0 : insets.bottom)
    : 0;
  const screen = (
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

  return ownPortalHost ? <Portal.Host>{screen}</Portal.Host> : screen;
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
