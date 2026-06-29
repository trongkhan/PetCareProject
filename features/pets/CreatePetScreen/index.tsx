import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Appbar, Button, Surface, TextInput, useTheme,
} from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { DatePickerField } from '@/components/DatePickerField';
import { PetGender, PetSpecies } from '@/models/types/Pet';
import { Spacing } from '@/constants/theme';
import { GenderSelector } from '../components/GenderSelector';
import { SpeciesSelector } from '../components/SpeciesSelector';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { ICreatePetScreenUICallback } from './types';

const CreatePetScreenComp = () => {
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
    (action: ICreatePetScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const handleCreate = useCallback(() => {
    if (!name.trim()) return;
    handlers.createPet({
      name: name.trim(),
      species,
      breed: breed.trim(),
      gender,
      weight: parseFloat(weight) || 0,
      birthday: birthday || undefined,
      notes: notes.trim() || undefined,
    });
  }, [name, species, breed, gender, weight, birthday, notes, handlers]);


  const renderSubmitButton = useCallback(() => (
    <Surface style={[styles.submitArea, { backgroundColor: theme.colors.background }]} elevation={0}>
      <Button
        mode="contained"
        onPress={handleCreate}
        disabled={!name.trim() || selectors.isSubmitting}
        loading={selectors.isSubmitting}
        style={styles.submitButton}
        contentStyle={{ paddingVertical: Spacing.xs }}
      >
        Tạo thú cưng
      </Button>
    </Surface>
  ), [handleCreate, name, selectors.isSubmitting, styles, theme]);

  return (
    <BaseScreen edges={['bottom']}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={handlers.navigateBack} />
        <Appbar.Content title="Thêm thú cưng" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Tên thú cưng *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <SpeciesSelector value={species} onChange={setSpecies} />

        <TextInput
          label="Giống (VD: Corgi, Maine Coon...)"
          value={breed}
          onChangeText={setBreed}
          mode="outlined"
          style={styles.input}
        />

        <GenderSelector value={gender} onChange={setGender} />

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

CreatePetScreenComp.displayName = 'CreatePetScreen';
export const CreatePetScreen = React.memo(CreatePetScreenComp);
