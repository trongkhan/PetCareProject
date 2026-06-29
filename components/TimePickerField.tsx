import React, { useState, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Portal, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Spacing } from '@/constants/theme';
import { WheelPicker } from './WheelPicker';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

interface Props {
  label: string;
  value: string; // HH:MM
  onChange: (value: string) => void;
}

function parseTime(value: string) {
  const [h, m] = (value || '07:00').split(':').map(Number);
  return { hour: isNaN(h) ? 7 : h, minute: isNaN(m) ? 0 : m };
}

export function TimePickerField({ label, value, onChange }: Props) {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const init = parseTime(value);
  const [hour, setHour] = useState(init.hour);
  const [minute, setMinute] = useState(init.minute);

  useEffect(() => {
    const t = parseTime(value);
    setHour(t.hour); setMinute(t.minute);
  }, [value]);

  const handleConfirm = useCallback(() => {
    onChange(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    setShow(false);
  }, [hour, minute, onChange]);

  return (
    <>
      <TouchableRipple
        onPress={() => setShow(true)}
        style={[styles.field, { borderColor: theme.colors.outline }]}
        rippleColor={theme.colors.primaryContainer}
      >
        <View style={styles.fieldContent}>
          <Text variant="labelSmall" style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>
          <Text variant="bodyLarge" style={{ color: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}>
            {value || 'Chọn giờ'}
          </Text>
        </View>
      </TouchableRipple>

      {show && (
        <Portal>
          <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setShow(false)} />
            <Surface style={[styles.sheet, { backgroundColor: theme.colors.surface }]} elevation={4}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: Spacing.sm }}>
                {label}
              </Text>
              <View style={styles.colLabels}>
                <Text style={[styles.colLabel, { color: theme.colors.onSurfaceVariant, flex: 1 }]}>Giờ</Text>
                <View style={styles.colonSpace} />
                <Text style={[styles.colLabel, { color: theme.colors.onSurfaceVariant, flex: 1 }]}>Phút</Text>
              </View>
              <View style={styles.pickers}>
                <WheelPicker flex={1} items={HOURS} selectedIndex={hour} onChange={setHour} />
                <View style={styles.colon}>
                  <Text style={[styles.colonText, { color: theme.colors.onSurface }]}>:</Text>
                </View>
                <WheelPicker flex={1} items={MINUTES} selectedIndex={minute} onChange={setMinute} />
              </View>
              <Button mode="contained" onPress={handleConfirm} style={{ marginTop: Spacing.md }}>
                Xác nhận
              </Button>
            </Surface>
          </View>
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1, borderRadius: 4,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.xs, paddingBottom: Spacing.sm,
    minHeight: 56, justifyContent: 'center',
  },
  fieldContent: { gap: 2 },
  label: { fontSize: 12 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: Spacing.lg, paddingBottom: Spacing.xxl,
  },
  colLabels: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  colLabel: { fontSize: 11, textAlign: 'center' },
  colonSpace: { width: 28 },
  pickers: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  colon: { width: 28, alignItems: 'center', paddingBottom: 8 },
  colonText: { fontSize: 28, fontWeight: '700' },
});
