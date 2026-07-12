import { useTranslation } from '@/hooks/useTranslation';
import { HealthRecord } from '@/models/types/HealthRecord';
import { formatDate } from '@/utils/format';
import React from 'react';
import { View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useStyles } from './vaccinationWarningStyles';

interface Props {
  vaccinations: HealthRecord[];
}

export function VaccinationWarning({ vaccinations }: Props) {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t, language } = useTranslation();
  if (vaccinations.length === 0) return null;
  return (
    <Card mode="contained" style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.emoji}>💉</Text>
        <View style={styles.body}>
          <Text variant="titleSmall" style={styles.title}>
            {t('home.health.vaccinationWarningTitle')}
          </Text>
          {vaccinations.map(v => (
            <Text key={v.id} variant="bodySmall" style={styles.item}>
              {v.title} — {formatDate(v.nextDue!, language)}
            </Text>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}
