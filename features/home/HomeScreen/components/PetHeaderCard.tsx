import { Spacing } from '@/constants/theme';
import { differenceInMonths, differenceInYears } from 'date-fns';
import { Pet } from '@/models/types/Pet';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { Button, Chip, Divider, Icon, Surface, Text, useTheme } from 'react-native-paper';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Chó', cat: 'Mèo', bird: 'Chim', hamster: 'Hamster', fish: 'Cá', rabbit: 'Thỏ', other: 'Khác',
};

function calcPetAge(birthday: string): string {
  const birth = new Date(birthday + 'T00:00:00');
  const now = new Date();
  const years = differenceInYears(now, birth);
  if (years >= 1) return `${years} tuổi`;
  const months = differenceInMonths(now, birth);
  return months <= 0 ? 'Dưới 1 tháng' : `${months} tháng tuổi`;
}

interface Props {
  pet: Pet;
  onNavigateProfile: (petId: string) => void;
}

export function PetHeaderCard({ pet, onNavigateProfile }: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => {
      Animated.timing(chevronAnim, {
        toValue: prev ? 0 : 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      return !prev;
    });
  }, [chevronAnim]);

  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
      <Pressable onPress={toggleExpanded} style={styles.touchable}>
        <View style={styles.nameRow}>
          {pet.photo ? (
            <Image source={{ uri: pet.photo }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: theme.colors.primary }]}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.onPrimary }}>
                {pet.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text variant="headlineMedium" style={[styles.name, { color: theme.colors.onPrimaryContainer }]}>
            {pet.name}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Icon source="chevron-down" size={24} color={theme.colors.onPrimaryContainer} />
        </Animated.View>
      </Pressable>

      <View style={styles.chipRow}>
        <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
          {SPECIES_LABELS[pet.species] ?? pet.species}
        </Chip>
        {pet.breed ? (
          <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
            {pet.breed}
          </Chip>
        ) : null}
        <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
          {pet.weight} kg
        </Chip>
        {pet.birthday ? (
          <Chip compact style={{ backgroundColor: theme.colors.secondary }} textStyle={{ color: theme.colors.onSecondary }}>
            {calcPetAge(pet.birthday)}
          </Chip>
        ) : null}
      </View>

      {expanded && (
        <View style={styles.expandedPanel}>
          <Divider style={{ backgroundColor: theme.colors.primary, opacity: 0.2, marginBottom: Spacing.sm }} />

          <View style={styles.infoRow}>
            <Icon source={pet.gender === 'male' ? 'gender-male' : 'gender-female'} size={16} color={theme.colors.onPrimaryContainer} />
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
              {pet.gender === 'male' ? 'Đực' : 'Cái'}
            </Text>
          </View>

          {pet.birthday ? (
            <View style={styles.infoRow}>
              <Icon source="cake-variant" size={16} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                {new Date(pet.birthday + 'T00:00:00').toLocaleDateString('vi-VN')}
              </Text>
            </View>
          ) : null}

          {pet.notes ? (
            <View style={styles.infoRow}>
              <Icon source="note-text-outline" size={16} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, flex: 1 }}>
                {pet.notes}
              </Text>
            </View>
          ) : null}

          {pet.allergies.length > 0 ? (
            <View style={styles.infoRow}>
              <Icon source="alert-circle-outline" size={16} color={theme.colors.onPrimaryContainer} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, flex: 1 }}>
                {pet.allergies.map((a, i) => (
                  <Chip key={i} compact style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} textStyle={{ fontSize: 11, color: theme.colors.onPrimaryContainer }}>
                    {a}
                  </Chip>
                ))}
              </View>
            </View>
          ) : null}

          <Button
            mode="text"
            compact
            onPress={() => onNavigateProfile(pet.id)}
            textColor={theme.colors.onPrimaryContainer}
            style={styles.profileLink}
            icon="arrow-right"
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            Xem hồ sơ đầy đủ
          </Button>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: Spacing.lg, gap: Spacing.sm },
  touchable: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  name: { fontWeight: '700', flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  expandedPanel: { gap: Spacing.xs },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs },
  profileLink: { alignSelf: 'flex-start', marginTop: Spacing.xs },
});
