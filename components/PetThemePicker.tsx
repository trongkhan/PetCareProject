import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { PET_THEMES } from '@/constants/petThemes';
import { Spacing } from '@/constants/theme';

interface Props {
  value: string;
  onChange: (themeId: string) => void;
}

export function PetThemePicker({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        Màu sắc
      </Text>
      <View style={styles.row}>
        {PET_THEMES.map(t => {
          const isSelected = t.id === value;
          return (
            <Pressable
              key={t.id}
              onPress={() => onChange(t.id)}
              style={[
                styles.swatch,
                { backgroundColor: t.primary },
                isSelected && styles.swatchSelected,
              ]}
            >
              {isSelected && (
                <Icon source="check" size={18} color={t.onPrimary} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  label: {},
  row: { flexDirection: 'row', gap: Spacing.md },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
