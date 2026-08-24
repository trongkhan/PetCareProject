import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { Spacing } from '@/constants/theme';

interface Props {
  /** Announced to screen readers while the screen loads. */
  accessibilityLabel?: string;
}

/** Centred spinner used while a screen's first data load is in flight. */
export function LoadingState({ accessibilityLabel }: Props) {
  const theme = useTheme();
  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
});
