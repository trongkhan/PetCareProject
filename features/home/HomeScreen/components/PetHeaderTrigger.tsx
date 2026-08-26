import { Pet } from '@/models/types/Pet';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

interface Props {
  pet: Pet;
  onPress: () => void;
}

/** The header's left slot on Home: avatar + pet name, tappable to open PetPickerSheet. No press
 *  feedback (no ripple/dimming) — it sits in the header chrome, not a content row. */
export function PetHeaderTrigger({ pet, onPress }: Props) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.touchable}>
      <View style={styles.row}>
        {pet.photo ? (
          <Image source={{ uri: pet.photo }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: theme.colors.primary }]}>
            <Text variant="bodyMedium" style={[styles.avatarInitial, { color: theme.colors.onPrimary }]}>
              {pet.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text
          variant="headlineSmall"
          numberOfLines={1}
          style={[styles.name, { color: theme.colors.onSurface }]}
        >
          {pet.name}
        </Text>
        <Icon source="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchable: { flex: 1, borderRadius: 8 },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarFallback: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  name: { flexShrink: 1, fontWeight: 'normal' },
  avatarInitial: { fontSize: 14, fontWeight: '700' },
});
