import { Spacing } from '@/constants/theme';
import { PetGender } from '@/models/types/Pet';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text, useTheme } from 'react-native-paper';

interface Props {
  value: PetGender;
  onChange: (value: PetGender) => void;
}

export function GenderSelector({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: Spacing.sm }}>
        Giới tính
      </Text>
      <SegmentedButtons
        value={value}
        onValueChange={val => onChange(val as PetGender)}
        buttons={[
          { value: 'male', label: 'Đực' },
          { value: 'female', label: 'Cái' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
});
