import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { SelectableChip } from '@/components/SelectableChip';
import { TimePickerField } from '@/components/TimePickerField';
import { DatePickerField } from '@/components/DatePickerField';
import { CreateReminderInput, ReminderFrequency, ReminderType } from '@/models/types/Reminder';
import { Spacing } from '@/constants/theme';
import type { MD3Theme } from 'react-native-paper';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: Omit<CreateReminderInput, 'petId'>) => void;
}

const REMINDER_TYPES: { value: ReminderType; label: string }[] = [
  { value: 'feeding', label: 'Ăn uống' },
  { value: 'medication', label: 'Thuốc' },
  { value: 'vaccination', label: 'Tiêm phòng' },
  { value: 'grooming', label: 'Vệ sinh' },
  { value: 'vet', label: 'Thú y' },
  { value: 'deworming', label: 'Tẩy giun' },
  { value: 'flea_tick', label: 'Bọ chét' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

const FREQUENCIES: { value: ReminderFrequency; label: string }[] = [
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Mỗi quý' },
  { value: 'yearly', label: 'Hàng năm' },
  { value: 'once', label: 'Một lần' },
];

export function AddReminderDialog({ visible, onDismiss, onSubmit }: Props) {
  const theme = useTheme();

  const [type, setType] = useState<ReminderType>('feeding');
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<ReminderFrequency>('daily');
  const [time, setTime] = useState('07:00');
  const [date, setDate] = useState('');

  const reset = useCallback(() => {
    setType('feeding');
    setTitle('');
    setFrequency('daily');
    setTime('07:00');
    setDate('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !time) return;
    onSubmit({
      type,
      title: title.trim(),
      frequency,
      time,
      date: frequency === 'once' ? date || undefined : undefined,
    });
    reset();
    onDismiss();
  }, [title, time, type, frequency, date, onSubmit, reset, onDismiss]);

  const handleDismiss = useCallback(() => { reset(); onDismiss(); }, [reset, onDismiss]);

  const renderTypeSection = useCallback((t: MD3Theme) => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: t.colors.onSurfaceVariant }}>Loại nhắc nhở</Text>
      <View style={styles.chipRow}>
        {REMINDER_TYPES.map(r => (
          <SelectableChip
            key={r.value}
            label={r.label}
            selected={type === r.value}
            onPress={() => setType(r.value)}
          />
        ))}
      </View>
    </View>
  ), [type]);

  const renderTitleField = useCallback(() => (
    <TextInput
      label="Tiêu đề *"
      value={title}
      onChangeText={setTitle}
      mode="outlined"
      placeholder="VD: Cho ăn buổi sáng..."
    />
  ), [title]);

  const renderFrequencySection = useCallback((t: MD3Theme) => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: t.colors.onSurfaceVariant }}>Tần suất</Text>
      <View style={styles.chipRow}>
        {FREQUENCIES.map(f => (
          <SelectableChip
            key={f.value}
            label={f.label}
            selected={frequency === f.value}
            onPress={() => setFrequency(f.value)}
          />
        ))}
      </View>
    </View>
  ), [frequency]);

  const renderTimeAndDate = useCallback(() => (
    <>
      <TimePickerField
        label="Giờ nhắc *"
        value={time}
        onChange={setTime}
      />
      {frequency === 'once' && (
        <DatePickerField
          label="Ngày nhắc"
          value={date}
          onChange={setDate}
        />
      )}
    </>
  ), [time, frequency, date]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss} style={styles.dialog}>
        <Dialog.Title>Thêm nhắc nhở</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.content}>
            {renderTypeSection(theme)}
            {renderTitleField()}
            {renderFrequencySection(theme)}
            {renderTimeAndDate()}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>Hủy</Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!title.trim() || !time}
          >
            Lưu
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: { maxHeight: '90%' },
  scrollArea: { paddingHorizontal: 0 },
  content: { padding: Spacing.md, gap: Spacing.md },
  field: { gap: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
