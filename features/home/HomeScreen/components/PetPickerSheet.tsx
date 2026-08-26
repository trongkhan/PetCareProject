import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { Pet } from '@/models/types/Pet';
import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Portal, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';

interface Props {
  visible: boolean;
  pets: Pet[];
  activePetId: string | undefined;
  onSwitch: (petId: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

/** Bottom sheet listing every pet, tap to switch the active one. Opened from PetHeaderTrigger. */
export function PetPickerSheet({ visible, pets, activePetId, onSwitch, onCreate, onClose }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSwitch = useCallback((petId: string) => {
    onSwitch(petId);
    onClose();
  }, [onSwitch, onClose]);

  const handleCreate = useCallback(() => {
    onClose();
    onCreate();
  }, [onCreate, onClose]);

  const renderHeader = useCallback(() => (
    <Text variant="titleMedium" style={[styles.header, { color: theme.colors.onSurface }]}>
      {t('pets.switchTitle')}
    </Text>
  ), [theme, t]);

  const renderPetRow = useCallback((p: Pet) => {
    const isActive = p.id === activePetId;
    return (
      <TouchableRipple key={p.id} onPress={() => handleSwitch(p.id)} style={styles.row} rippleColor={theme.colors.primaryContainer}>
        <View style={styles.rowContent}>
          {p.photo ? (
            <Image source={{ uri: p.photo }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceVariant }]}>
              <Text variant="bodyMedium" style={[styles.avatarInitial, { color: isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                {p.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.textCol}>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: isActive ? '700' : '400' }}>
              {p.name}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t(`species.${p.species}`)} · {p.weight} kg
            </Text>
          </View>
          {isActive ? <Icon source="check-circle" size={22} color={theme.colors.primary} /> : null}
        </View>
      </TouchableRipple>
    );
  }, [activePetId, handleSwitch, theme, t]);

  const renderCreateRow = useCallback(() => (
    <TouchableRipple onPress={handleCreate} style={styles.row} rippleColor={theme.colors.primaryContainer}>
      <View style={styles.rowContent}>
        <View style={[styles.avatarFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Icon source="plus" size={18} color={theme.colors.onSurfaceVariant} />
        </View>
        <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
          {t('home.addPet')}
        </Text>
      </View>
    </TouchableRipple>
  ), [handleCreate, theme, t]);

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Surface style={[styles.sheet, { backgroundColor: theme.colors.surface }]} elevation={4}>
          {renderHeader()}
          {pets.map(renderPetRow)}
          {renderCreateRow()}
        </Surface>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  row: { borderRadius: 12 },
  rowContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  textCol: { flex: 1, gap: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 16, fontWeight: '700' },
  header: { marginBottom: Spacing.md },
});
