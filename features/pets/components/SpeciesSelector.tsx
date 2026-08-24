import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { PetSpecies } from '@/models/types/Pet';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SelectableChip } from '@/components/SelectableChip';

const SPECIES: PetSpecies[] = ['dog', 'cat', 'bird', 'hamster', 'rabbit', 'other'];

interface Props {
  value: PetSpecies;
  onChange: (value: PetSpecies) => void;
}

export function SpeciesSelector({ value, onChange }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: Spacing.sm }}>
        {t('pets.speciesLabel')}
      </Text>
      <View style={styles.chipRow}>
        {SPECIES.map(s => (
          <SelectableChip
            key={s}
            label={t(`species.${s}`)}
            selected={value === s}
            onPress={() => onChange(s)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
