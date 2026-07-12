import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface AppHeaderProps {
  /** Title shown on the left. Defaults to the app name. */
  title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const setColorScheme = useSettingsStore((s) => s.setColorScheme);

  const isDark = theme.dark;

  const toggleTheme = () => setColorScheme(isDark ? 'light' : 'dark');
  const openSettings = () => router.push('/settings');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text
        variant="titleLarge"
        numberOfLines={1}
        style={[styles.title, { color: theme.colors.onSurface }]}
      >
        {title ?? t('common.appName')}
      </Text>

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
  title: { flex: 1, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center' },
});
