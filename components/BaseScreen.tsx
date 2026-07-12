import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { AppHeader } from './AppHeader';

interface BaseScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  /** Show the global header (language + settings buttons). Defaults to true. */
  header?: boolean;
  /** Optional title shown in the global header. Falls back to the app name. */
  headerTitle?: string;
}

export function BaseScreen({
  children,
  edges = ['top', 'bottom'],
  style,
  header = true,
  headerTitle,
}: BaseScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }, style]}
      edges={edges}
    >
      {header && <AppHeader title={headerTitle} />}
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
