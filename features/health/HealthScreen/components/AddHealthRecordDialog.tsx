import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { SelectableChip } from '@/components/SelectableChip';
import { DatePickerField } from '@/components/DatePickerField';
import { CreateHealthRecordInput, HealthRecordType } from '@/models/types/HealthRecord';
import { Spacing } from '@/constants/theme';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: Omit<CreateHealthRecordInput, 'petId'>) => void;
}

const RECORD_TYPES: { value: HealthRecordType; label: string }[] = [
  { value: 'vaccination', label: 'Tiêm phòng' },
  { value: 'vet_visit', label: 'Khám thú y' },
  { value: 'medication', label: 'Thuốc' },
  { value: 'weight', label: 'Cân nặng' },
  { value: 'deworming', label: 'Tẩy giun' },
  { value: 'other', label: 'Khác' },
];

const today = () => new Date().toISOString().split('T')[0];
const NEEDS_NEXT_DUE: HealthRecordType[] = ['vaccination', 'deworming', 'medication'];

export function AddHealthRecordDialog({ visible, onDismiss, onSubmit }: Props) {
  const theme = useTheme();

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
      onSubmit({ type: 'weight', title: 'Cân nặng', date, notes: weightKg.trim() });
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
  }, [isWeightType, weightKg, title, date, type, nextDue, notes, cost, onSubmit, reset, onDismiss]);

  const handleDismiss = useCallback(() => { reset(); onDismiss(); }, [reset, onDismiss]);

  const renderTypeSection = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Loại hồ sơ</Text>
      <View style={styles.chipRow}>
        {RECORD_TYPES.map(r => (
          <SelectableChip
            key={r.value}
            label={r.label}
            selected={type === r.value}
            onPress={() => setType(r.value)}
          />
        ))}
      </View>
    </View>
  ), [type, theme]);

  const renderMainFields = useCallback(() => {
    if (isWeightType) {
      return (
        <>
          <TextInput
            label="Cân nặng (kg) *"
            value={weightKg}
            onChangeText={setWeightKg}
            mode="outlined"
            keyboardType="decimal-pad"
            right={<TextInput.Affix text="kg" />}
          />
          <DatePickerField label="Ngày cân *" value={date} onChange={setDate} />
        </>
      );
    }
    return (
      <>
        <TextInput
          label="Tiêu đề *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          placeholder="VD: Vắc-xin dại, Khám định kỳ..."
        />
        <DatePickerField label="Ngày thực hiện *" value={date} onChange={setDate} />
        {NEEDS_NEXT_DUE.includes(type) && (
          <DatePickerField
            label="Ngày tái khám / nhắc tiếp theo"
            value={nextDue}
            onChange={setNextDue}
          />
        )}
      </>
    );
  }, [isWeightType, weightKg, title, date, nextDue, type]);

  const renderExtraFields = useCallback(() => (
    <>
      <TextInput
        label="Chi phí (VND)"
        value={cost}
        onChangeText={setCost}
        mode="outlined"
        keyboardType="numeric"
        placeholder="VD: 150000"
        right={<TextInput.Affix text="đ" />}
      />
      <TextInput
        label="Ghi chú"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        placeholder="Chẩn đoán, phác đồ điều trị..."
      />
    </>
  ), [cost, notes]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss} style={styles.dialog}>
        <Dialog.Title>Thêm hồ sơ sức khỏe</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.content}>
            {renderTypeSection()}
            {renderMainFields()}
            {!isWeightType && renderExtraFields()}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>Hủy</Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={isWeightType ? !weightKg.trim() || !date : !title.trim() || !date}
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
