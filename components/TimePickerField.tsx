import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Spacing } from '@/constants/theme';

interface Props {
  label: string;
  value: string; // HH:MM
  onChange: (value: string) => void;
}

function parseTime(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function TimePickerField({ label, value, onChange }: Props) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  const parsed = parseTime(value || '07:00');

  return (
    <>
      <TouchableRipple
        onPress={() => setShow(true)}
        style={[styles.field, { borderColor: theme.colors.outline, borderRadius: 4 }]}
        rippleColor={theme.colors.primaryContainer}
      >
        <View style={styles.fieldContent}>
          <Text variant="labelSmall" style={[styles.labelText, { color: theme.colors.primary }]}>
            {label}
          </Text>
          <Text variant="bodyLarge" style={{ color: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}>
            {value || 'Chọn giờ'}
          </Text>
        </View>
      </TouchableRipple>

      <Modal visible={show} transparent animationType="fade">
        <View style={styles.overlay}>
          <Surface style={[styles.sheet, { backgroundColor: theme.colors.surface }]} elevation={3}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: Spacing.sm }}>
              {label}
            </Text>
            <DateTimePicker
              value={parsed}
              mode="time"
              display="spinner"
              is24Hour
              onChange={(_, selected) => {
                if (selected) onChange(formatTime(selected));
              }}
              style={styles.picker}
            />
            <Button mode="contained" onPress={() => setShow(false)} style={styles.confirmBtn}>
              Xác nhận
            </Button>
          </Surface>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
    minHeight: 56,
    justifyContent: 'center',
  },
  fieldContent: { gap: 2 },
  labelText: { fontSize: 12 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  picker: { width: '100%' },
  confirmBtn: { marginTop: Spacing.md },
});
