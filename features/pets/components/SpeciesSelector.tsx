import { Spacing } from '@/constants/theme';
import { PetSpecies } from '@/models/types/Pet';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';

const SPECIES: { value: PetSpecies; label: string }[] = [
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'bird', label: 'Chim' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'rabbit', label: 'Thỏ' },
  { value: 'other', label: 'Khác' },
];

interface Props {
  value: PetSpecies;
  onChange: (value: PetSpecies) => void;
}

export function SpeciesSelector({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: Spacing.sm }}>
        Loài
      </Text>
      <View style={styles.chipRow}>
        {SPECIES.map(s => (
          <Chip
            key={s.value}
            selected={value === s.value}
            onPress={() => onChange(s.value)}
            showSelectedCheck={false}
            style={value === s.value ? { backgroundColor: theme.colors.primaryContainer } : undefined}
          >
            {s.label}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
