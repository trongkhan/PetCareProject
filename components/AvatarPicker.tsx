import React, { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Icon, Text, useTheme } from 'react-native-paper';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  photo?: string | null;
  name: string;
  size?: number;
  onChange: (uri: string | null) => void;
}

export function AvatarPicker({ photo, name, size = 96, onChange }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const pick = useCallback(async (from: 'library' | 'camera') => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ImagePicker = require('expo-image-picker');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { saveAvatar } = require('@/utils/imageStorage');

    const perm = from === 'library'
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;

    const result = from === 'library'
      ? await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

    if (!result.canceled && result.assets[0]) {
      const uri = await saveAvatar(result.assets[0].uri, uuidv4());
      onChange(uri);
    }
  }, [onChange]);

  const onPress = useCallback(() => {
    const buttons: { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }[] = [
      { text: t('avatarPicker.library'), onPress: () => pick('library') },
      { text: t('avatarPicker.camera'), onPress: () => pick('camera') },
    ];
    if (photo) {
      buttons.push({ text: t('avatarPicker.remove'), style: 'destructive', onPress: () => onChange(null) });
    }
    buttons.push({ text: t('common.cancel'), style: 'cancel' });
    Alert.alert(t('avatarPicker.title'), t('avatarPicker.message'), buttons);
  }, [photo, pick, onChange, t]);

  const badgeSize = size * 0.3;

  return (
    <Pressable onPress={onPress} style={[styles.wrapper, { width: size, height: size }]}>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.initial, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={{ fontSize: size * 0.38, fontWeight: '700', color: theme.colors.primary }}>
            {(name.charAt(0) || '?').toUpperCase()}
          </Text>
        </View>
      )}
      <View style={[
        styles.badge,
        {
          backgroundColor: theme.colors.primary,
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
        },
      ]}>
        <Icon source="camera" size={Math.floor(size * 0.17)} color={theme.colors.onPrimary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', alignSelf: 'center' },
  initial: { justifyContent: 'center', alignItems: 'center' },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
