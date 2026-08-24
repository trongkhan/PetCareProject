import React, { useState, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Portal, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate } from '@/utils/format';
import { WheelPicker } from './WheelPicker';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 + 10 }, (_, i) => String(1990 + i));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
function makeDays(month: number, year: number) {
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => String(i + 1).padStart(2, '0'));
}

interface Props {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

function parseDate(value: string) {
  if (!value) { const n = new Date(); return { d: n.getDate(), m: n.getMonth() + 1, y: n.getFullYear() }; }
  const dt = new Date(value + 'T00:00:00');
  return { d: dt.getDate(), m: dt.getMonth() + 1, y: dt.getFullYear() };
}

export function DatePickerField({ label, value, onChange }: Props) {
  const theme = useTheme();
  const { t, language } = useTranslation();
  const [show, setShow] = useState(false);
  const init = parseDate(value);
  const [day, setDay] = useState(init.d);
  const [month, setMonth] = useState(init.m);
  const [year, setYear] = useState(init.y);

  useEffect(() => {
    const p = parseDate(value);
    setDay(p.d); setMonth(p.m); setYear(p.y);
  }, [value]);

  const days = makeDays(month, year);
  const safeDay = Math.min(day, days.length);
  const yearIdx = Math.max(0, YEARS.indexOf(String(year)));

  const handleConfirm = useCallback(() => {
    const d = Math.min(day, new Date(year, month, 0).getDate());
    onChange(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    setShow(false);
  }, [day, month, year, onChange]);

  const handleDayChange = useCallback((i: number) => setDay(i + 1), []);
  const handleMonthChange = useCallback((i: number) => setMonth(i + 1), []);
  const handleYearChange = useCallback((i: number) => setYear(parseInt(YEARS[i])), []);
  const openPicker = useCallback(() => setShow(true), []);
  const closePicker = useCallback(() => setShow(false), []);

  const display = value ? formatDate(value, language) : t('datePicker.placeholder');

  // The closed field — a single-line "label + current value" row that opens the sheet.
  const renderTrigger = useCallback(() => (
    <TouchableRipple
      onPress={openPicker}
      style={[styles.field, { borderColor: theme.colors.outline }]}
      rippleColor={theme.colors.primaryContainer}
    >
      <View style={styles.fieldContent}>
        <Text variant="labelSmall" style={[styles.label, { color: theme.colors.primary }]}>{label}</Text>
        <Text variant="bodyLarge" style={{ color: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}>
          {display}
        </Text>
      </View>
    </TouchableRipple>
  ), [openPicker, theme, label, value, display]);

  // The bottom sheet — day/month/year wheels + confirm, only mounted while `show`.
  const renderSheet = useCallback(() => (
    <Portal>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} />
        <Surface style={[styles.sheet, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: Spacing.sm }}>
            {label}
          </Text>
          <View style={styles.colLabels}>
            {[{ label: t('datePicker.day'), flex: 1 }, { label: t('datePicker.month'), flex: 1 }, { label: t('datePicker.year'), flex: 2 }].map(c => (
              <Text key={c.label} style={[styles.colLabel, { color: theme.colors.onSurfaceVariant, flex: c.flex }]}>{c.label}</Text>
            ))}
          </View>
          <View style={styles.pickers}>
            <WheelPicker flex={1} items={days} selectedIndex={safeDay - 1} onChange={handleDayChange} />
            <WheelPicker flex={1} items={MONTHS} selectedIndex={month - 1} onChange={handleMonthChange} />
            <WheelPicker flex={2} items={YEARS} selectedIndex={yearIdx} onChange={handleYearChange} />
          </View>
          <Button mode="contained" onPress={handleConfirm} style={{ marginTop: Spacing.md }}>
            {t('common.confirm')}
          </Button>
        </Surface>
      </View>
    </Portal>
  ), [closePicker, theme, label, t, days, safeDay, handleDayChange, month, handleMonthChange, yearIdx, handleYearChange, handleConfirm]);

  return (
    <>
      {renderTrigger()}
      {show && renderSheet()}
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
  colLabels: { flexDirection: 'row', marginBottom: 4 },
  colLabel: { fontSize: 11, textAlign: 'center' },
  pickers: { flexDirection: 'row', gap: Spacing.xs },
});
