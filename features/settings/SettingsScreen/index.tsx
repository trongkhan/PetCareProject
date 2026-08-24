import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, List, Switch, useTheme } from 'react-native-paper';
import { SegmentedControl } from '@/components/SegmentedControl';
import { BaseScreen } from '@/components/BaseScreen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { ISettingsScreenUICallback } from './types';

const SettingsScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const handleUICallbackFn = useCallback(
    (action: ISettingsScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  return (
    <BaseScreen header={false} edges={['bottom']}>
      <ScreenHeader title={t('settings.title')} />

      <ScrollView contentContainerStyle={styles.content}>
        <List.Subheader>{t('settings.language')}</List.Subheader>
        <View style={styles.section}>
          <SegmentedControl
            style={styles.segmented}
            value={selectors.language}
            onValueChange={handlers.setLanguage}
            buttons={[
              { value: 'vi', label: t('language.vi') },
              { value: 'en', label: t('language.en') },
            ]}
          />
        </View>

        <Divider />

        <List.Subheader>{t('settings.appearance')}</List.Subheader>
        <View style={styles.section}>
          <SegmentedControl
            style={styles.segmented}
            value={selectors.colorScheme}
            onValueChange={handlers.setColorScheme}
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
              value={selectors.notificationsEnabled}
              onValueChange={handlers.setNotificationsEnabled}
            />
          )}
        />
      </ScrollView>
    </BaseScreen>
  );
};

SettingsScreenComp.displayName = 'SettingsScreen';
export const SettingsScreen = React.memo(SettingsScreenComp);
