import { Pet } from '@/models/types/Pet';
import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const PRESS_SCALE = 0.95;
// Loose/bouncy on the way down, snappier settle on the way back up — a
// spring (not withTiming) so it visibly overshoots/glides into place
// instead of just linearly interpolating in a fixed duration.
const PRESS_SPRING = { damping: 12, stiffness: 180 };
const RELEASE_SPRING = { damping: 14, stiffness: 220 };

interface Props {
  pet: Pet;
  onPress: () => void;
}

/** The header's left slot on Home: avatar + pet name, tappable to open PetPickerSheet. Scales
 *  down slightly on press (no ripple/dimming — it sits in the header chrome, not a content row,
 *  but a totally static press felt raw with nothing acknowledging the tap). */
export function PetHeaderTrigger({ pet, onPress }: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(PRESS_SCALE, PRESS_SPRING);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, RELEASE_SPRING);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.touchable}>
      <Animated.View style={[styles.row, animatedStyle]}>
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
          style={[styles.name, { color: theme.colors.onSurface }]}
        >
          {pet.name}
        </Text>
        <Icon source="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
      </Animated.View>
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
