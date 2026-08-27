import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { Avatar, Button, Divider, List, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { useStyles } from './account.styles';
import { useViewModel } from './account.viewModel';
import { handleUICallback } from './account.uiCallback';

interface ListRowIconProps {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

function renderSettingsLeftIcon(props: ListRowIconProps) {
  return <List.Icon {...props} icon="cog-outline" />;
}

function renderSettingsRightIcon(props: ListRowIconProps) {
  return <List.Icon {...props} icon="chevron-right" />;
}

function navigateToSettings() {
  router.push('/settings');
}

const AccountScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const { selectors, handlers } = useViewModel({ handleUICallback });

  return (
    <BaseScreen headerTitle={t('account.title')} edges={['top']}>
      <View style={styles.header}>
        <Avatar.Icon size={72} icon="account" />
        <Text variant="labelMedium" style={styles.signedInAs}>
          {t('account.signedInAs')}
        </Text>
        <Text variant="titleMedium" style={styles.email}>
          {selectors.email}
        </Text>
      </View>

      <Divider />
      <List.Item
        title={t('account.settings')}
        left={renderSettingsLeftIcon}
        right={renderSettingsRightIcon}
        onPress={navigateToSettings}
      />
      <Divider />

      <View style={styles.footer}>
        <Button
          mode="outlined"
          icon="logout"
          onPress={handlers.signOut}
          textColor={theme.colors.error}
          style={styles.signOut}
        >
          {t('auth.signOut')}
        </Button>
      </View>
    </BaseScreen>
  );
};

AccountScreenComp.displayName = 'AccountScreen';
export const AccountScreen = React.memo(AccountScreenComp);
