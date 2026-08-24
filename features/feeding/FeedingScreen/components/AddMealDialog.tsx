import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SelectableChip } from '@/components/SelectableChip';
import { useTranslation } from '@/hooks/useTranslation';
import { CreateMealInput, MealType, MealUnit } from '@/models/types/Meal';
import { Spacing } from '@/constants/theme';

export interface MealPrefill {
  type?: MealType;
  food?: string;
  amount?: number;
  unit?: MealUnit;
  brand?: string;
  notes?: string;
}

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: Omit<CreateMealInput, 'petId'>) => void;
  /** Seed values (e.g. from AI quick-log) applied when the dialog opens. */
  initial?: MealPrefill;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'treat'];

export function AddMealDialog({ visible, onDismiss, onSubmit, initial }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [type, setType] = useState<MealType>('breakfast');
  const [food, setFood] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState<MealUnit>('grams');
  const [brand, setBrand] = useState('');
  const [notes, setNotes] = useState('');

  // Seed the form from `initial` each time the dialog opens.
  const initialRef = useRef(initial);
  initialRef.current = initial;
  useEffect(() => {
    if (!visible) return;
    const p = initialRef.current;
    if (!p) return;
    if (p.type) setType(p.type);
    if (p.food) setFood(p.food);
    if (p.amount != null) setAmount(String(p.amount));
    if (p.unit) setUnit(p.unit);
    if (p.brand) setBrand(p.brand);
    if (p.notes) setNotes(p.notes);
  }, [visible]);

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
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('feeding.dialog.mealType')}</Text>
      <View style={styles.chipRow}>
        {MEAL_TYPES.map(m => (
          <SelectableChip
            key={m}
            label={t(`mealType.${m}`)}
            selected={type === m}
            onPress={() => setType(m)}
          />
        ))}
      </View>
    </View>
  ), [type, theme, t]);

  const renderFoodFields = useCallback(() => (
    <>
      <TextInput
        label={t('feeding.dialog.foodLabel')}
        value={food}
        onChangeText={setFood}
        mode="outlined"
        placeholder={t('feeding.dialog.foodPlaceholder')}
      />
      <TextInput
        label={t('feeding.dialog.amountLabel')}
        value={amount}
        onChangeText={setAmount}
        mode="outlined"
        keyboardType="decimal-pad"
      />
    </>
  ), [food, amount, t]);

  const renderUnitSection = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('feeding.dialog.unit')}</Text>
      <SegmentedControl
        value={unit}
        onValueChange={val => setUnit(val as MealUnit)}
        buttons={[
          { value: 'grams', label: 'gram' },
          { value: 'cups', label: 'cup' },
          { value: 'ml', label: 'ml' },
        ]}
      />
    </View>
  ), [unit, theme, t]);

  const renderOptionalFields = useCallback(() => (
    <>
      <TextInput
        label={t('feeding.dialog.brandLabel')}
        value={brand}
        onChangeText={setBrand}
        mode="outlined"
        placeholder={t('feeding.dialog.brandPlaceholder')}
      />
      <TextInput
        label={t('feeding.dialog.notesLabel')}
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={2}
      />
    </>
  ), [brand, notes, t]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss} style={styles.dialog}>
        <Dialog.Title>{t('feeding.dialog.title')}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView contentContainerStyle={styles.content}>
            {renderTypeSection()}
            {renderFoodFields()}
            {renderUnitSection()}
            {renderOptionalFields()}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>{t('common.cancel')}</Button>
          <Button mode="contained" onPress={handleSubmit} disabled={!food.trim()}>
            {t('common.save')}
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
