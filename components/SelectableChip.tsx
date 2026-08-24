import React from 'react';
import { Chip, useTheme } from 'react-native-paper';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/**
 * The app's single chip. Selection always reads in the primary (teal) container
 * so it matches every other selected state; unselected chips stay neutral with
 * an outline rather than falling back to Paper's peach secondaryContainer,
 * which otherwise made unselected chips louder than the selected one.
 */
export function SelectableChip({ label, selected, onPress }: Props) {
  const theme = useTheme();
  return (
    <Chip
      selected={selected}
      onPress={onPress}
      showSelectedCheck={false}
      accessibilityState={{ selected }}
      style={{
        backgroundColor: selected ? theme.colors.primaryContainer : theme.colors.surface,
        borderColor: selected ? theme.colors.primary : theme.colors.outlineVariant,
        borderWidth: 1,
      }}
      textStyle={{
        color: selected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
        fontWeight: selected ? '700' : '400',
      }}
    >
      {label}
    </Chip>
  );
}
