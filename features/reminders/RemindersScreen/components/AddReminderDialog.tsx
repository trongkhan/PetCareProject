import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { SelectableChip } from '@/components/SelectableChip';
import { TimePickerField } from '@/components/TimePickerField';
import { DatePickerField } from '@/components/DatePickerField';
import { useTranslation } from '@/hooks/useTranslation';
import { CreateReminderInput, ReminderFrequency, ReminderType } from '@/models/types/Reminder';
import { Spacing } from '@/constants/theme';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: Omit<CreateReminderInput, 'petId'>) => void;
}

const REMINDER_TYPES: ReminderType[] = [
  'feeding',
  'medication',
  'vaccination',
  'grooming',
  'vet',
  'deworming',
  'flea_tick',
  'custom',
];

const FREQUENCIES: ReminderFrequency[] = [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
  'once',
];

export function AddReminderDialog({ visible, onDismiss, onSubmit }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

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

  const renderTypeSection = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('reminders.dialog.typeLabel')}</Text>
      <View style={styles.chipRow}>
        {REMINDER_TYPES.map(r => (
          <SelectableChip
            key={r}
            label={t(`reminders.type.${r}`)}
            selected={type === r}
            onPress={() => setType(r)}
          />
        ))}
      </View>
    </View>
  ), [type, theme, t]);

  const renderTitleField = useCallback(() => (
    <TextInput
      label={t('reminders.dialog.titleLabel')}
      value={title}
      onChangeText={setTitle}
      mode="outlined"
      placeholder={t('reminders.dialog.titlePlaceholder')}
    />
  ), [title, t]);

  const renderFrequencySection = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('reminders.dialog.frequencyLabel')}</Text>
      <View style={styles.chipRow}>
        {FREQUENCIES.map(f => (
          <SelectableChip
            key={f}
            label={t(`frequency.${f}`)}
            selected={frequency === f}
            onPress={() => setFrequency(f)}
          />
        ))}
      </View>
    </View>
  ), [frequency, theme, t]);

  const renderTimeAndDate = useCallback(() => (
    <>
      <TimePickerField label={t('reminders.dialog.timeLabel')} value={time} onChange={setTime} />
      {frequency === 'once' && (
        <DatePickerField label={t('reminders.dialog.dateLabel')} value={date} onChange={setDate} />
      )}
    </>
  ), [time, frequency, date, t]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss} style={styles.dialog}>
        <Dialog.Title>{t('reminders.dialog.title')}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.content}>
            {renderTypeSection()}
            {renderTitleField()}
            {renderFrequencySection()}
            {renderTimeAndDate()}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>{t('common.cancel')}</Button>
          <Button mode="contained" onPress={handleSubmit} disabled={!title.trim() || !time}>
            {t('common.save')}
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
