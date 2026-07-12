import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Appbar, Card, FAB, IconButton, Switch, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
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
        <Card mode="outlined">
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
              {t('reminders.empty')}
            </Text>
          </Card.Content>
        </Card>
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
      <BaseScreen header={false} edges={['bottom']} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen header={false} edges={['bottom']}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('reminders.title')} />
      </Appbar.Header>
      <AddReminderDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handlers.addReminder}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {renderSectionHeader()}
        {renderReminderList()}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => setDialogVisible(true)}
      />
    </BaseScreen>
  );
};

RemindersScreenComp.displayName = 'RemindersScreen';
export const RemindersScreen = React.memo(RemindersScreenComp);
