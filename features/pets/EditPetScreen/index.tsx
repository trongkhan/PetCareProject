import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ActivityIndicator, Appbar, Button, Chip, SegmentedButtons, Surface, Text, TextInput, useTheme,
} from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { DatePickerField } from '@/components/DatePickerField';
import { PetGender, PetSpecies } from '@/models/types/Pet';
import { Spacing } from '@/constants/theme';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IEditPetScreenUICallback } from './types';

interface Props {
  petId: string;
}

const SPECIES: { value: PetSpecies; label: string }[] = [
  { value: 'dog', label: 'Chó' },
  { value: 'cat', label: 'Mèo' },
  { value: 'bird', label: 'Chim' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'rabbit', label: 'Thỏ' },
  { value: 'other', label: 'Khác' },
];

const EditPetScreenComp = ({ petId }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [weight, setWeight] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');

  const handleUICallbackFn = useCallback(
    (action: IEditPetScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ petId, handleUICallback: handleUICallbackFn });

  useEffect(() => {
    if (selectors.pet) {
      setName(selectors.pet.name);
      setSpecies(selectors.pet.species);
      setBreed(selectors.pet.breed);
      setGender(selectors.pet.gender);
      setWeight(selectors.pet.weight.toString());
      setBirthday(selectors.pet.birthday ?? '');
      setNotes(selectors.pet.notes ?? '');
    }
  }, [selectors.pet]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    handlers.savePet({
      name: name.trim(),
      species,
      breed: breed.trim(),
      gender,
      weight: parseFloat(weight) || 0,
      birthday: birthday || undefined,
      notes: notes.trim(),
    });
  }, [name, species, breed, gender, weight, birthday, notes, handlers]);

  const renderSpeciesSelector = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: Spacing.sm }}>
        Loài
      </Text>
      <View style={styles.chipRow}>
        {SPECIES.map(s => (
          <Chip
            key={s.value}
            selected={species === s.value}
            onPress={() => setSpecies(s.value)}
            showSelectedCheck={false}
            style={species === s.value ? { backgroundColor: theme.colors.primaryContainer } : undefined}
          >
            {s.label}
          </Chip>
        ))}
      </View>
    </View>
  ), [species, styles, theme]);

  const renderGenderSelector = useCallback(() => (
    <View style={styles.field}>
      <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: Spacing.sm }}>
        Giới tính
      </Text>
      <SegmentedButtons
        value={gender}
        onValueChange={val => setGender(val as PetGender)}
        buttons={[
          { value: 'male', label: 'Đực' },
          { value: 'female', label: 'Cái' },
        ]}
      />
    </View>
  ), [gender, styles, theme]);

  const renderSubmitButton = useCallback(() => (
    <Surface style={[styles.submitArea, { backgroundColor: theme.colors.background }]} elevation={0}>
      <Button
        mode="contained"
        onPress={handleSave}
        disabled={!name.trim() || selectors.isSaving}
        loading={selectors.isSaving}
        style={styles.submitButton}
        contentStyle={{ paddingVertical: Spacing.xs }}
      >
        Lưu thay đổi
      </Button>
    </Surface>
  ), [handleSave, name, selectors.isSaving, styles, theme]);

  if (selectors.isLoading) {
    return (
      <BaseScreen edges={['bottom']} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen edges={['bottom']}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={handlers.navigateBack} />
        <Appbar.Content title="Chỉnh sửa thú cưng" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Tên thú cưng *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        {renderSpeciesSelector()}

        <TextInput
          label="Giống"
          value={breed}
          onChangeText={setBreed}
          mode="outlined"
          style={styles.input}
        />

        {renderGenderSelector()}

        <TextInput
          label="Cân nặng (kg)"
          value={weight}
          onChangeText={setWeight}
          mode="outlined"
          keyboardType="decimal-pad"
          style={styles.input}
          right={<TextInput.Affix text="kg" />}
        />

        <DatePickerField
          label="Ngày sinh (tùy chọn)"
          value={birthday}
          onChange={setBirthday}
        />

        <TextInput
          label="Ghi chú (tùy chọn)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder="Dị ứng, bệnh nền, đặc điểm..."
        />

        {renderSubmitButton()}
      </ScrollView>
    </BaseScreen>
  );
};

EditPetScreenComp.displayName = 'EditPetScreen';
export const EditPetScreen = React.memo(EditPetScreenComp);
