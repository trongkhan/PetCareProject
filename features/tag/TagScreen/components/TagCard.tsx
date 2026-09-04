import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { Button, Divider, IconButton, Switch, Text, TextInput, useTheme } from 'react-native-paper';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate } from '@/utils/format';
import type { Tag, TagScan } from '@/models/types/Tag';
import { useStyles } from '../tag.styles';

interface Props {
  tag: Tag;
  scans: TagScan[];
  publicUrl: string;
  onToggleLost: (lost: boolean) => void;
  onSaveContact: (phone: string, note: string) => void;
  onDelete: () => void;
}

const openInMaps = (lat: number, lng: number) =>
  Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`);

export function TagCard({ tag, scans, publicUrl, onToggleLost, onSaveContact, onDelete }: Props) {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t, language } = useTranslation();
  const [phone, setPhone] = useState(tag.contactPhone ?? '');
  const [note, setNote] = useState(tag.contactNote ?? '');

  const dirty = phone !== (tag.contactPhone ?? '') || note !== (tag.contactNote ?? '');

  return (
    <View
      style={[
        styles.card,
        { borderColor: theme.colors.outlineVariant, backgroundColor: theme.colors.surface },
      ]}
    >
      {/* Header: code block + delete */}
      <View style={styles.headerRow}>
        <View style={styles.codeBlock}>
          <Text variant="labelSmall" style={[styles.codeCaption, { color: theme.colors.onSurfaceVariant }]}>
            {t('tag.code')}
          </Text>
          <Text variant="titleLarge" style={[styles.code, { color: theme.colors.onSurface }]}>
            {tag.code}
          </Text>
        </View>
        {tag.lost ? <View style={[styles.statusDot, { backgroundColor: theme.colors.error }]} /> : null}
        <IconButton icon="delete-outline" size={20} onPress={onDelete} style={styles.deleteBtn} />
      </View>

      {/* Public URL to write on the tag */}
      <View style={styles.urlGroup}>
        <View style={[styles.urlBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text selectable variant="bodySmall" style={[styles.url, { color: theme.colors.primary }]}>
            {publicUrl}
          </Text>
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('tag.urlHint')}
        </Text>
      </View>

      <Divider />

      {/* Lost toggle */}
      <View style={styles.lostRow}>
        <Text
          variant="titleSmall"
          style={{ color: tag.lost ? theme.colors.error : theme.colors.onSurface }}
        >
          {tag.lost ? t('tag.lostOn') : t('tag.lostOff')}
        </Text>
        <Switch value={tag.lost} onValueChange={onToggleLost} color={theme.colors.error} />
      </View>

      <Divider />

      {/* Contact shown to finders */}
      <View style={styles.group}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('tag.contactSection')}
        </Text>
        <TextInput
          mode="outlined"
          dense
          label={t('tag.phone')}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput mode="outlined" dense label={t('tag.note')} value={note} onChangeText={setNote} />
        {dirty ? (
          <Button mode="contained-tonal" onPress={() => onSaveContact(phone, note)} style={styles.saveBtn}>
            {t('tag.saveContact')}
          </Button>
        ) : null}
      </View>

      <Divider />

      {/* Sightings */}
      <View style={styles.group}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('tag.scans', { count: scans.length })}
        </Text>
        {scans.length === 0 ? (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {t('tag.noScans')}
          </Text>
        ) : (
          scans.map((s) => (
            <View key={s.id} style={styles.scanItem}>
              <View style={styles.scanMeta}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {formatDate(s.scannedAt, language)}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {s.lat != null && s.lng != null
                    ? `${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}`
                    : t('tag.noLocation')}
                </Text>
              </View>
              {s.lat != null && s.lng != null ? (
                <Button compact mode="text" onPress={() => openInMaps(s.lat!, s.lng!)}>
                  {t('tag.openMap')}
                </Button>
              ) : null}
            </View>
          ))
        )}
      </View>
    </View>
  );
}
