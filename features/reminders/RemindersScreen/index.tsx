import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, IconButton, Switch, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useTranslation } from '@/hooks/useTranslation';
import { AddReminderDialog } from './components/AddReminderDialog';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IRemindersScreenUICallback } from './types';

const RemindersScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleUICallbackFn = useCallback(
    (action: IRemindersScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderSectionHeader = useCallback(() => (
    <View style={styles.sectionHeader}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
        {t('reminders.header', { count: selectors.reminders.length })}
      </Text>
    </View>
  ), [selectors.reminders.length, styles, theme, t]);

  const renderReminderList = useCallback(() => {
    if (selectors.reminders.length === 0) {
      return (
        <EmptyState
          icon="bell-outline"
          title={t('reminders.empty')}
          description={t('reminders.emptyHint')}
          actionLabel={t('reminders.addAction')}
          onAction={() => setDialogVisible(true)}
        />
      );
    }
    return (
      <>
        {selectors.reminders.map(reminder => (
          <Card
            key={reminder.id}
            mode="outlined"
            style={[styles.card, !reminder.enabled && styles.disabled]}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardText}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                    {reminder.title}
                  </Text>
                  {reminder.enabled && reminder.notificationId && (
                    <Text style={{ fontSize: 12 }}>🔔</Text>
                  )}
                </View>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {reminder.time} · {t(`frequency.${reminder.frequency}`)}
                </Text>
              </View>
              <View style={styles.actions}>
                <Switch
                  value={reminder.enabled}
                  onValueChange={val => handlers.toggleReminder(reminder.id, val)}
                  color={theme.colors.primary}
                />
                <IconButton
                  icon="delete-outline"
                  iconColor={theme.colors.error}
                  size={20}
                  style={styles.deleteIcon}
                  onPress={() => handlers.deleteReminder(reminder.id)}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </>
    );
  }, [selectors.reminders, handlers, styles, theme, t]);

  if (selectors.isLoading) {
    return (
      <BaseScreen header={false} edges={['bottom']}>
        <LoadingState accessibilityLabel={t('reminders.title')} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen header={false} edges={['bottom']} fab={{ onPress: () => setDialogVisible(true), accessibilityLabel: t('reminders.addAction') }}>
      <ScreenHeader title={t('reminders.title')} />
      <AddReminderDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handlers.addReminder}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {renderSectionHeader()}
        {renderReminderList()}
      </ScrollView>

    </BaseScreen>
  );
};

RemindersScreenComp.displayName = 'RemindersScreen';
export const RemindersScreen = React.memo(RemindersScreenComp);
