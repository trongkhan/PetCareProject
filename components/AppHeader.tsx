import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface AppHeaderProps {
  /** Title shown on the left. Defaults to the app name. Ignored when `renderLeft` is set. */
  title?: string;
  /** Replaces the default title text with a custom node (e.g. an avatar + name trigger). */
  renderLeft?: () => React.ReactNode;
}

export function AppHeader({ title, renderLeft }: AppHeaderProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const setColorScheme = useSettingsStore((s) => s.setColorScheme);

  const isDark = theme.dark;

  const toggleTheme = useCallback(
    () => setColorScheme(isDark ? 'light' : 'dark'),
    [isDark, setColorScheme],
  );
  const openSettings = useCallback(() => router.push('/settings'), []);

  const renderTitle = useCallback(() => (
    <Text
      variant="headlineSmall"
      numberOfLines={1}
      style={[styles.title, { color: theme.colors.onSurface }]}
    >
      {title ?? t('common.appName')}
    </Text>
  ), [theme, title, t]);

  const renderActions = useCallback(() => (
    <View style={styles.actions}>
      <IconButton
        icon={isDark ? 'weather-night' : 'white-balance-sunny'}
        size={24}
        iconColor={theme.colors.onSurfaceVariant}
        onPress={toggleTheme}
        accessibilityLabel={t('common.theme')}
      />
      <IconButton
        icon="cog-outline"
        size={24}
        iconColor={theme.colors.onSurfaceVariant}
        onPress={openSettings}
        accessibilityLabel={t('common.settings')}
      />
    </View>
  ), [isDark, theme, toggleTheme, openSettings, t]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderLeft ? renderLeft() : renderTitle()}
      {renderActions()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  // Baloo 2 (theme.fonts.titleLarge) already carries the weight — a plain
  // '700' here fights the custom family the way AuthScreen's appName had to
  // guard against.
  title: { flex: 1, fontWeight: 'normal' },
  actions: { flexDirection: 'row', alignItems: 'center' },
});
