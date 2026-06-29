import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Spacing } from '@/constants/theme';

interface Props {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

export function DatePickerField({ label, value, onChange }: Props) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  const parsed = value ? new Date(value) : new Date();
  const display = value
    ? new Date(value).toLocaleDateString('vi-VN')
    : 'Chọn ngày';

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
            {display}
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
              mode="date"
              display="spinner"
              locale="vi-VN"
              onChange={(_, selected) => {
                if (selected) {
                  onChange(selected.toISOString().split('T')[0]);
                }
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
