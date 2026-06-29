import { Spacing } from '@/constants/theme';
import { HealthRecord } from '@/models/types/HealthRecord';
import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface Props {
  vaccinations: HealthRecord[];
}

export function VaccinationWarning({ vaccinations }: Props) {
  if (vaccinations.length === 0) return null;
  return (
    <Card mode="contained" style={{ backgroundColor: '#FFF8E1' }}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }}>
        <Text style={{ fontSize: 20 }}>💉</Text>
        <View style={{ flex: 1 }}>
          <Text variant="titleSmall" style={{ color: '#E65100', fontWeight: '700' }}>
            Sắp đến lịch tiêm phòng
          </Text>
          {vaccinations.map(v => (
            <Text key={v.id} variant="bodySmall" style={{ color: '#BF360C', marginTop: 2 }}>
              {v.title} — {new Date(v.nextDue! + 'T00:00:00').toLocaleDateString('vi-VN')}
            </Text>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}
