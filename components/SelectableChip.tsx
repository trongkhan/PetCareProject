import React from 'react';
import { Chip, useTheme } from 'react-native-paper';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableChip({ label, selected, onPress }: Props) {
  const theme = useTheme();
  return (
    <Chip
      selected={selected}
      onPress={onPress}
      showSelectedCheck={false}
      style={{
        backgroundColor: selected
          ? theme.colors.primaryContainer
          : theme.colors.surfaceVariant,
      }}
      textStyle={{
        color: selected
          ? theme.colors.onPrimaryContainer
          : theme.colors.onSurfaceVariant,
      }}
    >
      {label}
    </Chip>
  );
}
