import React, { useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Avatar, Button, Divider, List, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IAccountScreenUICallback } from './types';

const AccountScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const handleUICallbackFn = useCallback(
    (action: IAccountScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

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
        left={(p) => <List.Icon {...p} icon="cog-outline" />}
        right={(p) => <List.Icon {...p} icon="chevron-right" />}
        onPress={() => router.push('/settings')}
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
