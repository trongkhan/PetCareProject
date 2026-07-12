import { BaseScreen } from '@/components/BaseScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Divider, List, SegmentedButtons, Switch, useTheme } from 'react-native-paper';
import { useStyles } from './styles';

const SettingsScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const colorScheme = useSettingsStore((s) => s.colorScheme);
  const setColorScheme = useSettingsStore((s) => s.setColorScheme);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  return (
    <BaseScreen header={false} edges={['bottom']}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('settings.title')} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <List.Subheader>{t('settings.language')}</List.Subheader>
        <View style={styles.section}>
          <SegmentedButtons
            style={styles.segmented}
            value={language}
            onValueChange={(v) => setLanguage(v as 'vi' | 'en')}
            buttons={[
              { value: 'vi', label: t('language.vi') },
              { value: 'en', label: t('language.en') },
            ]}
          />
        </View>

        <Divider />

        <List.Subheader>{t('settings.appearance')}</List.Subheader>
        <View style={styles.section}>
          <SegmentedButtons
            style={styles.segmented}
            value={colorScheme}
            onValueChange={(v) => setColorScheme(v as 'light' | 'dark' | 'system')}
            buttons={[
              { value: 'light', label: t('settings.themeLight'), icon: 'white-balance-sunny' },
              { value: 'dark', label: t('settings.themeDark'), icon: 'weather-night' },
              { value: 'system', label: t('settings.themeSystem'), icon: 'cellphone' },
            ]}
          />
        </View>

        <Divider />

        <List.Subheader>{t('settings.notifications')}</List.Subheader>
        <List.Item
          title={t('settings.notifications')}
          description={t('settings.notificationsDesc')}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          )}
        />
      </ScrollView>
    </BaseScreen>
  );
};

SettingsScreenComp.displayName = 'SettingsScreen';
export const SettingsScreen = React.memo(SettingsScreenComp);
