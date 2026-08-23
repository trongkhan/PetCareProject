import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Appbar, Card, Chip, FAB, IconButton, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useQuickLogStore } from '@/store/quickLogStore';
import { formatCurrency, formatDate } from '@/utils/format';
import { AddHealthRecordDialog, type HealthPrefill } from './components/AddHealthRecordDialog';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IHealthScreenUICallback } from './types';

const HealthScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t, language } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [prefill, setPrefill] = useState<HealthPrefill | undefined>(undefined);

  // Open the dialog pre-filled when the Home quick-log routed a health record here.
  const pending = useQuickLogStore((s) => s.pending);
  const clearQuickLog = useQuickLogStore((s) => s.clear);
  useEffect(() => {
    if (pending?.kind === 'health') {
      setPrefill(pending.health);
      setDialogVisible(true);
      clearQuickLog();
    }
  }, [pending, clearQuickLog]);

  const handleUICallbackFn = useCallback(
    (action: IHealthScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderVaccinationsHeader = useCallback(() => (
    <View style={styles.sectionHeader}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
        {t('health.vaccinationsHeader', { count: selectors.vaccinations.length })}
      </Text>
    </View>
  ), [selectors.vaccinations.length, styles, theme, t]);

  const renderVaccinations = useCallback(() => {
    if (selectors.vaccinations.length === 0) {
      return (
        <Card mode="outlined">
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
              {t('health.noVaccinations')}
            </Text>
          </Card.Content>
        </Card>
      );
    }
    return (
      <>
        {selectors.vaccinations.map(record => (
          <Card key={record.id} mode="outlined" style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardText}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>{record.title}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {formatDate(record.date, language)}
                  {record.nextDue ? t('health.nextDue', { date: formatDate(record.nextDue, language) }) : ''}
                </Text>
                {record.cost ? (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {formatCurrency(record.cost, language)}
                  </Text>
                ) : null}
              </View>
              <IconButton
                icon="delete-outline"
                iconColor={theme.colors.error}
                size={20}
                onPress={() => handlers.deleteRecord(record.id)}
              />
            </Card.Content>
          </Card>
        ))}
      </>
    );
  }, [selectors.vaccinations, handlers, styles, theme, t, language]);

  const renderAllRecords = useCallback(() => {
    if (selectors.records.length === 0) return null;
    return (
      <>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          {t('health.allRecordsHeader', { count: selectors.records.length })}
        </Text>
        {selectors.records.map(record => (
          <Card key={record.id} mode="outlined" style={styles.card}>
            <Card.Content style={{ gap: Spacing.xs }}>
              <View style={styles.recordHeader}>
                {record.type === 'weight' ? (
                  <Text variant="titleSmall" style={{ color: theme.colors.primary, flex: 1 }}>
                    {record.notes} kg
                  </Text>
                ) : (
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface, flex: 1 }}>
                    {record.title}
                  </Text>
                )}
                <Chip compact textStyle={{ fontSize: 11 }}>
                  {t(`healthType.${record.type}`)}
                </Chip>
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {formatDate(record.date, language)}
                {record.cost ? ` · ${formatCurrency(record.cost, language)}` : ''}
              </Text>
              {record.type !== 'weight' && record.notes ? (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {record.notes}
                </Text>
              ) : null}
            </Card.Content>
          </Card>
        ))}
      </>
    );
  }, [selectors.records, styles, theme, t, language]);

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
        <Appbar.Content title={t('health.title')} />
      </Appbar.Header>
      <AddHealthRecordDialog
        visible={dialogVisible}
        onDismiss={() => { setDialogVisible(false); setPrefill(undefined); }}
        onSubmit={handlers.addRecord}
        initial={prefill}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {renderVaccinationsHeader()}
        {renderVaccinations()}
        {renderAllRecords()}
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

HealthScreenComp.displayName = 'HealthScreen';
export const HealthScreen = React.memo(HealthScreenComp);
