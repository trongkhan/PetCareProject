import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { PetGender } from '@/models/types/Pet';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SegmentedControl } from '@/components/SegmentedControl';

interface Props {
  value: PetGender;
  onChange: (value: PetGender) => void;
}

export function GenderSelector({ value, onChange }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        {t('gender.label')}
      </Text>
      <SegmentedControl
        value={value}
        onValueChange={val => onChange(val as PetGender)}
        buttons={[
          { value: 'male', label: t('gender.male') },
          { value: 'female', label: t('gender.female') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  label: { marginBottom: Spacing.sm },
});
