import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { WeightEntry } from '@/models/types/HealthRecord';
import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface Props {
  weightHistory: WeightEntry[];
  currentWeight: number;
}

export function WeightChart({ weightHistory, currentWeight }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const history = weightHistory.slice(-8);
  const maxW = history.length > 0 ? Math.max(...history.map(e => e.weight)) : 1;

  return (
    <Card mode="outlined">
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>{t('pets.chart.title')}</Text>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('pets.chart.current')}: {currentWeight} kg
          </Text>
        </View>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
              {t('pets.chart.empty')}
            </Text>
          </View>
        ) : (
          <View style={styles.chartArea}>
            {history.map(entry => (
              <View key={entry.id} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(8, (entry.weight / maxW) * 80),
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                  {entry.weight}
                </Text>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                  {format(new Date(entry.date), 'dd/MM')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: { padding: Spacing.md, gap: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  empty: { height: 80, justifyContent: 'center', alignItems: 'center' },
  chartArea: { height: 100, flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingTop: Spacing.sm },
  bar: { alignSelf: 'stretch', borderRadius: 4, minHeight: 4 },
  label: { fontSize: 10, textAlign: 'center', marginTop: 2 },
});
