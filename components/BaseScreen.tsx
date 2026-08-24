import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { AppHeader } from './AppHeader';

interface BaseScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  /** Show the global header (language + settings buttons). Defaults to true. */
  header?: boolean;
  /** Optional title shown in the global header. Falls back to the app name. */
  headerTitle?: string;
  /**
   * Floating action button shown bottom-right, in the app's primary colour.
   * Extracted here because Home, Feeding, Health and Reminders all rendered
   * an identical FAB (icon="plus", same position/colours) and only differed
   * in what pressing it opened.
   */
  fab?: {
    icon?: string;
    onPress: () => void;
    accessibilityLabel?: string;
  };
}

export function BaseScreen({
  children,
  edges = ['top', 'bottom'],
  style,
  header = true,
  headerTitle,
  fab,
}: BaseScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }, style]}
      edges={edges}
    >
      {header && <AppHeader title={headerTitle} />}
      {children}
      {fab ? (
        <FAB
          icon={fab.icon ?? 'plus'}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color={theme.colors.onPrimary}
          onPress={fab.onPress}
          accessibilityLabel={fab.accessibilityLabel}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.lg },
});
