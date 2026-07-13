import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, List, Text, useTheme } from 'react-native-paper';

const AccountScreenComp = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <BaseScreen headerTitle={t('account.title')} edges={['top']}>
      <View style={styles.header}>
        <Avatar.Icon size={72} icon="account" />
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('account.signedInAs')}
        </Text>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {user?.email ?? '—'}
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
          onPress={signOut}
          textColor={theme.colors.error}
          style={{ borderColor: theme.colors.error }}
        >
          {t('auth.signOut')}
        </Button>
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.lg },
  footer: { padding: Spacing.lg },
});

AccountScreenComp.displayName = 'AccountScreen';
export const AccountScreen = React.memo(AccountScreenComp);
