import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Linking, Share, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, Divider, IconButton, Switch, Text, TextInput, useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
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
  const [copied, setCopied] = useState(false);

  const dirty = phone !== (tag.contactPhone ?? '') || note !== (tag.contactNote ?? '');
  const located = scans.filter((s) => s.lat != null && s.lng != null);

  const copy = async () => {
    await Clipboard.setStringAsync(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const share = () => Share.share({ message: publicUrl });

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

      {/* QR of the public URL */}
      <View style={styles.qrWrap}>
        <View style={styles.qrBox}>
          <QRCode value={publicUrl} size={148} backgroundColor="#ffffff" color="#141216" />
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('tag.qrHint')}
        </Text>
      </View>

      {/* Public URL + actions */}
      <View style={styles.urlGroup}>
        <View style={[styles.urlBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text selectable variant="bodySmall" style={[styles.url, { color: theme.colors.primary }]}>
            {publicUrl}
          </Text>
        </View>
        <View style={styles.urlActions}>
          <Button
            compact
            mode="contained-tonal"
            icon={copied ? 'check' : 'content-copy'}
            onPress={copy}
          >
            {copied ? t('tag.copied') : t('tag.copy')}
          </Button>
          <Button compact mode="text" icon="share-variant" onPress={share}>
            {t('tag.share')}
          </Button>
        </View>
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

        {located.length > 0 ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: located[0].lat!,
              longitude: located[0].lng!,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {located.map((s) => (
              <Marker
                key={s.id}
                coordinate={{ latitude: s.lat!, longitude: s.lng! }}
                title={tag.petName ?? tag.code}
                description={formatDate(s.scannedAt, language)}
              />
            ))}
          </MapView>
        ) : null}

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
