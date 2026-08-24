import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { PET_THEMES, type PetThemeConfig } from '@/constants/petThemes';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  value: string;
  onChange: (themeId: string) => void;
}

interface SwatchProps {
  petTheme: PetThemeConfig;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

/** One colour swatch — memoized so picking a theme only re-renders the two swatches whose selected state changed. */
const Swatch = React.memo(function Swatch({ petTheme, isSelected, onSelect }: SwatchProps) {
  const handlePress = useCallback(() => onSelect(petTheme.id), [onSelect, petTheme.id]);
  return (
    <Pressable
      onPress={handlePress}
      style={[styles.swatch, { backgroundColor: petTheme.primary }, isSelected && styles.swatchSelected]}
    >
      {isSelected && <Icon source="check" size={18} color={petTheme.onPrimary} />}
    </Pressable>
  );
});

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
        {PET_THEMES.map(pt => (
          <Swatch key={pt.id} petTheme={pt} isSelected={pt.id === value} onSelect={onChange} />
        ))}
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
