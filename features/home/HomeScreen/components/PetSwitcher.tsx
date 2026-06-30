import { Spacing } from '@/constants/theme';
import { Pet } from '@/models/types/Pet';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface Props {
  pets: Pet[];
  activePetId: string | undefined;
  onSwitch: (petId: string) => void;
}

export function PetSwitcher({ pets, activePetId, onSwitch }: Props) {
  const theme = useTheme();
  if (pets.length === 0) return null;
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {pets.map(p => {
          const isActive = p.id === activePetId;
          return (
            <Pressable key={p.id} onPress={() => onSwitch(p.id)} style={styles.item}>
              <View style={[styles.ring, { borderColor: isActive ? theme.colors.primary : 'transparent' }]}>
                {p.photo ? (
                  <Image source={{ uri: p.photo }} style={styles.photo} contentFit="cover" />
                ) : (
                  <View style={[styles.circle, { backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceVariant }]}>
                    <Text style={[styles.initial, { color: isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                      {p.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                numberOfLines={1}
                style={[styles.name, { color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: isActive ? '700' : '400' }]}
              >
                {p.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  row: { paddingHorizontal: Spacing.md, gap: Spacing.lg, alignItems: 'center' },
  item: { alignItems: 'center', gap: 4, minWidth: 56 },
  ring: { width: 60, height: 60, borderRadius: 30, borderWidth: 2.5, padding: 3, justifyContent: 'center', alignItems: 'center' },
  circle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  photo: { width: 50, height: 50, borderRadius: 25 },
  initial: { fontSize: 22, fontWeight: '700' },
  name: { fontSize: 12, textAlign: 'center', maxWidth: 64 },
});
