import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import { SelectableChip } from '@/components/SelectableChip';
import { CreateMealInput, MealType, MealUnit } from '@/models/types/Meal';
import { Spacing } from '@/constants/theme';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: Omit<CreateMealInput, 'petId'>) => void;
}

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Sáng' },
  { value: 'lunch', label: 'Trưa' },
  { value: 'dinner', label: 'Tối' },
  { value: 'snack', label: 'Ăn vặt' },
  { value: 'treat', label: 'Thưởng' },
];

export function AddMealDialog({ visible, onDismiss, onSubmit }: Props) {
  const theme = useTheme();

  const [type, setType] = useState<MealType>('breakfast');
  const [food, setFood] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<MealUnit>('grams');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');

  const reset = useCallback(() => {
    setType('breakfast');
    setFood('');
    setAmount('');
    setUnit('grams');
    setBrand('');
    setNotes('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!food.trim()) return;
    onSubmit({
      type,
      food: food.trim(),
      amount: parseFloat(amount) || 0,
      unit,
      brand: brand.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    reset();
    onDismiss();
  }, [food, amount, type, unit, brand, notes, onSubmit, reset, onDismiss]);

  const handleDismiss = useCallback(() => { reset(); onDismiss(); }, [reset, onDismiss]);

  const renderTypeSection = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Loại bữa</Text>
      <View style={styles.chipRow}>
        {MEAL_TYPES.map(m => (
          <SelectableChip
            key={m.value}
            label={m.label}
            selected={type === m.value}
            onPress={() => setType(m.value)}
          />
        ))}
      </View>
    </View>
  ), [type, theme]);

  const renderFoodFields = useCallback(() => (
    <>
      <TextInput
        label="Tên thức ăn *"
        value={food}
        onChangeText={setFood}
        mode="outlined"
        placeholder="VD: Hạt Royal Canin, Pate Whiskas..."
      />
      <TextInput
        label="Lượng (tùy chọn)"
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="decimal-pad"
      />
    </>
  ), [food, amount]);

  const renderUnitSection = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Đơn vị</Text>
      <SegmentedButtons
        value={unit}
        onValueChange={val => setUnit(val as MealUnit)}
        buttons={[
          { value: 'grams', label: 'gram' },
          { value: 'cups', label: 'cup' },
          { value: 'ml', label: 'ml' },
        ]}
      />
    </View>
  ), [unit, theme]);

  const renderOptionalFields = useCallback(() => (
    <>
      <TextInput
        label="Thương hiệu"
        value={brand}
        onChangeText={setBrand}
        mode="outlined"
        placeholder="VD: Royal Canin, Whiskas..."
      />
      <TextInput
        label="Ghi chú"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={2}
      />
    </>
  ), [brand, notes]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss} style={styles.dialog}>
        <Dialog.Title>Ghi bữa ăn</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.content}>
            {renderTypeSection()}
            {renderFoodFields()}
            {renderUnitSection()}
            {renderOptionalFields()}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>Hủy</Button>
          <Button mode="contained" onPress={handleSubmit} disabled={!food.trim()}>
            Lưu
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: { maxHeight: '85%' },
  scrollArea: { paddingHorizontal: 0 },
  content: { padding: Spacing.md, gap: Spacing.md },
  field: { gap: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
