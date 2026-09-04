import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { Button, Card, IconButton, Switch, Text, TextInput, useTheme } from 'react-native-paper';
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
    <Card mode="outlined" style={styles.card}>
      <Card.Content style={styles.cardBody}>
        {/* Code + delete */}
        <View style={styles.row}>
          <View style={styles.codeRow}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('tag.code')}
            </Text>
            <Text variant="titleMedium" style={styles.code}>{tag.code}</Text>
          </View>
          <IconButton icon="delete-outline" size={20} onPress={onDelete} />
        </View>

        {/* Public URL to write on the tag (QR/NFC) */}
        <Text selectable variant="bodySmall" style={[styles.url, { color: theme.colors.primary }]}>
          {publicUrl}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('tag.urlHint')}
        </Text>

        {/* Lost toggle */}
        <View style={styles.lostRow}>
          <Text variant="titleSmall" style={{ color: tag.lost ? theme.colors.error : theme.colors.onSurface }}>
            {tag.lost ? t('tag.lostOn') : t('tag.lostOff')}
          </Text>
          <Switch value={tag.lost} onValueChange={onToggleLost} color={theme.colors.error} />
        </View>

        {/* Contact shown to finders */}
        <TextInput
          mode="outlined"
          dense
          label={t('tag.phone')}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          mode="outlined"
          dense
          label={t('tag.note')}
          value={note}
          onChangeText={setNote}
        />
        {dirty ? (
          <Button mode="contained-tonal" onPress={() => onSaveContact(phone, note)}>
            {t('tag.saveContact')}
          </Button>
        ) : null}

        {/* Sightings */}
        <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
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
                <Text variant="bodyMedium">{formatDate(s.scannedAt, language)}</Text>
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
      </Card.Content>
    </Card>
  );
}
