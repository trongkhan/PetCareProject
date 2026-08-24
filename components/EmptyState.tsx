import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import { Spacing } from '@/constants/theme';

interface Props {
  /** Material Community icon name. */
  icon: string;
  title: string;
  description?: string;
  /** Optional call to action, so an empty screen is never a dead end. */
  actionLabel?: string;
  onAction?: () => void;
  /** Compact variant for empty sections inside an otherwise populated screen. */
  compact?: boolean;
}

/**
 * Shared empty state. Replaces the outlined-card-with-italic-grey-text pattern
 * that six places repeated, which offered no icon and no way forward.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}: Props) {
  const theme = useTheme();

  const renderIcon = useCallback(() => (
    <View
      style={[
        styles.iconCircle,
        compact && styles.iconCircleCompact,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
    >
      <Icon source={icon} size={compact ? 22 : 34} color={theme.colors.onPrimaryContainer} />
    </View>
  ), [compact, theme, icon]);

  const renderDescription = useCallback(() => (
    description ? (
      <Text variant="bodySmall" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        {description}
      </Text>
    ) : null
  ), [description, theme]);

  const renderAction = useCallback(() => (
    actionLabel && onAction ? (
      <Button
        mode="contained-tonal"
        icon="plus"
        onPress={onAction}
        style={styles.action}
        buttonColor={theme.colors.primaryContainer}
        textColor={theme.colors.onPrimaryContainer}
      >
        {actionLabel}
      </Button>
    ) : null
  ), [actionLabel, onAction, theme]);

  return (
    <View style={compact ? styles.compact : styles.root}>
      {renderIcon()}
      <Text
        variant={compact ? 'bodyMedium' : 'titleMedium'}
        style={[styles.title, { color: theme.colors.onSurface }]}
      >
        {title}
      </Text>
      {renderDescription()}
      {renderAction()}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg, gap: Spacing.xs },
  compact: { alignItems: 'center', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md, gap: Spacing.xs },
  iconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  iconCircleCompact: { width: 44, height: 44, borderRadius: 22, marginBottom: 0 },
  title: { textAlign: 'center' },
  description: { textAlign: 'center' },
  action: { marginTop: Spacing.md },
});
