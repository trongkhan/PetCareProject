import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { SelectableChip } from '@/components/SelectableChip';
import { DatePickerField } from '@/components/DatePickerField';
import { CreateHealthRecordInput, HealthRecordType } from '@/models/types/HealthRecord';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: Omit<CreateHealthRecordInput, 'petId'>) => void;
}

const RECORD_TYPES: HealthRecordType[] = [
  'vaccination',
  'vet_visit',
  'medication',
  'weight',
  'deworming',
  'other',
];

const today = () => new Date().toISOString().split('T')[0];
const NEEDS_NEXT_DUE: HealthRecordType[] = ['vaccination', 'deworming', 'medication'];

export function AddHealthRecordDialog({ visible, onDismiss, onSubmit }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [type, setType] = useState<HealthRecordType>('vaccination');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [nextDue, setNextDue] = useState('');
  const [notes, setNotes] = useState('');
  const [cost, setCost] = useState('');
  const [weightKg, setWeightKg] = useState('');

  const isWeightType = type === 'weight';

  const reset = useCallback(() => {
    setType('vaccination');
    setTitle('');
    setDate(today());
    setNextDue('');
    setNotes('');
    setCost('');
    setWeightKg('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (isWeightType) {
      if (!weightKg.trim() || !date) return;
      onSubmit({ type: 'weight', title: t('healthType.weight'), date, notes: weightKg.trim() });
    } else {
      if (!title.trim() || !date) return;
      onSubmit({
        type,
        title: title.trim(),
        date,
        nextDue: nextDue || undefined,
        notes: notes.trim() || undefined,
        cost: cost.trim() ? parseFloat(cost) : undefined,
      });
    }
    reset();
    onDismiss();
  }, [isWeightType, weightKg, title, date, type, nextDue, notes, cost, onSubmit, reset, onDismiss, t]);

  const handleDismiss = useCallback(() => { reset(); onDismiss(); }, [reset, onDismiss]);

  const renderTypeSection = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('health.dialog.typeLabel')}</Text>
      <View style={styles.chipRow}>
        {RECORD_TYPES.map(r => (
          <SelectableChip
            key={r}
            label={t(`healthType.${r}`)}
            selected={type === r}
            onPress={() => setType(r)}
          />
        ))}
      </View>
    </View>
  ), [type, theme, t]);

  const renderMainFields = useCallback(() => {
    if (isWeightType) {
      return (
        <>
          <TextInput
            label={t('health.dialog.weightLabel')}
            value={weightKg}
            onChangeText={setWeightKg}
            mode="outlined"
            keyboardType="decimal-pad"
            right={<TextInput.Affix text="kg" />}
          />
          <DatePickerField label={t('health.dialog.weightDateLabel')} value={date} onChange={setDate} />
        </>
      );
    }
    return (
      <>
        <TextInput
          label={t('health.dialog.titleLabel')}
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          placeholder={t('health.dialog.titlePlaceholder')}
        />
        <DatePickerField label={t('health.dialog.dateLabel')} value={date} onChange={setDate} />
        {NEEDS_NEXT_DUE.includes(type) && (
          <DatePickerField
            label={t('health.dialog.nextDueLabel')}
            value={nextDue}
            onChange={setNextDue}
          />
        )}
      </>
    );
  }, [isWeightType, weightKg, title, date, nextDue, type, t]);

  const renderExtraFields = useCallback(() => (
    <>
      <TextInput
        label={t('health.dialog.costLabel')}
        value={cost}
        onChangeText={setCost}
        mode="outlined"
        keyboardType="numeric"
        placeholder={t('health.dialog.costPlaceholder')}
        right={<TextInput.Affix text="₫" />}
      />
      <TextInput
        label={t('health.dialog.notesLabel')}
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        placeholder={t('health.dialog.notesPlaceholder')}
      />
    </>
  ), [cost, notes, t]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss} style={styles.dialog}>
        <Dialog.Title>{t('health.dialog.title')}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.content}>
            {renderTypeSection()}
            {renderMainFields()}
            {!isWeightType && renderExtraFields()}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>{t('common.cancel')}</Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={isWeightType ? !weightKg.trim() || !date : !title.trim() || !date}
          >
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
