import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Card, Chip, FAB, IconButton, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { AddHealthRecordDialog } from './AddHealthRecordDialog';
import { useStyles } from './HealthScreen.styles';
import { useViewModel } from './HealthScreen.viewModel';
import { handleUICallback } from './HealthScreen.uiCallback';
import type { IHealthScreenUICallback } from './HealthScreen.types';

const TYPE_LABELS: Record<string, string> = {
  vaccination: 'Tiêm phòng',
  vet_visit: 'Khám thú y',
  medication: 'Thuốc',
  weight: 'Cân nặng',
  deworming: 'Tẩy giun',
  other: 'Khác',
};

const HealthScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleUICallbackFn = useCallback(
    (action: IHealthScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderVaccinationsHeader = useCallback(() => (
    <View style={styles.sectionHeader}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
        Tiêm phòng ({selectors.vaccinations.length})
      </Text>
    </View>
  ), [selectors.vaccinations.length, styles, theme]);

  const renderVaccinations = useCallback(() => {
    if (selectors.vaccinations.length === 0) {
      return (
        <Card mode="outlined">
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
              Chưa có lịch sử tiêm phòng
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
                  {new Date(record.date).toLocaleDateString('vi-VN')}
                  {record.nextDue ? ` → tiếp theo: ${new Date(record.nextDue).toLocaleDateString('vi-VN')}` : ''}
                </Text>
                {record.cost ? (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {record.cost.toLocaleString('vi-VN')}đ
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
  }, [selectors.vaccinations, handlers, styles, theme]);

  const renderAllRecords = useCallback(() => {
    if (selectors.records.length === 0) return null;
    return (
      <>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Tất cả hồ sơ ({selectors.records.length})
        </Text>
        {selectors.records.map(record => (
          <Card key={record.id} mode="outlined" style={styles.card}>
            <Card.Content style={{ gap: Spacing.xs }}>
              <View style={styles.recordHeader}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, flex: 1 }}>
                  {record.title}
                </Text>
                <Chip compact textStyle={{ fontSize: 11 }}>
                  {TYPE_LABELS[record.type] ?? record.type}
                </Chip>
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {new Date(record.date).toLocaleDateString('vi-VN')}
                {record.cost ? ` · ${record.cost.toLocaleString('vi-VN')}đ` : ''}
              </Text>
              {record.notes ? (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {record.notes}
                </Text>
              ) : null}
            </Card.Content>
          </Card>
        ))}
      </>
    );
  }, [selectors.records, styles, theme]);

  if (selectors.isLoading) {
    return (
      <BaseScreen edges={[]} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen edges={[]}>
      <AddHealthRecordDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handlers.addRecord}
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
