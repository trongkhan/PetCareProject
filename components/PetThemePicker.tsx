import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { PET_THEMES } from '@/constants/petThemes';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  value: string;
  onChange: (themeId: string) => void;
}

export function PetThemePicker({ value, onChange }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('themePicker.label')}
        </Text>
        <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
          {t(`petTheme.${value}`)}
        </Text>
      </View>
      <View style={styles.row}>
        {PET_THEMES.map(pt => {
          const isSelected = pt.id === value;
          return (
            <Pressable
              key={pt.id}
              onPress={() => onChange(pt.id)}
              style={[
                styles.swatch,
                { backgroundColor: pt.primary },
                isSelected && styles.swatchSelected,
              ]}
            >
              {isSelected && (
                <Icon source="check" size={18} color={pt.onPrimary} />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
