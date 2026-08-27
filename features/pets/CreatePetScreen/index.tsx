import { AvatarPicker } from '@/components/AvatarPicker';
import { BaseScreen } from '@/components/BaseScreen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DatePickerField } from '@/components/DatePickerField';
import { Spacing } from '@/constants/theme';
import { PetGender, PetSpecies } from '@/models/types/Pet';
import { useTranslation } from '@/hooks/useTranslation';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Surface, TextInput, useTheme } from 'react-native-paper';
import { GenderSelector } from '../components/GenderSelector';
import { SpeciesSelector } from '../components/SpeciesSelector';
import { useStyles } from './createPet.styles';
import { handleUICallback } from './createPet.uiCallback';
import { useViewModel } from './createPet.viewModel';

const CreatePetScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [weight, setWeight] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');

  const { selectors, handlers } = useViewModel({ handleUICallback });

  const handleCreate = useCallback(() => {
    if (!name.trim()) return;
    handlers.createPet({
      photo,
      name: name.trim(),
      species,
      breed: breed.trim(),
      gender,
      weight: parseFloat(weight) || 0,
      birthday: birthday || undefined,
      notes: notes.trim() || undefined,
    });
  }, [name, handlers, photo, species, breed, gender, weight, birthday, notes]);

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
        {t('pets.createSubmit')}
      </Button>
    </Surface>
  ), [handleCreate, name, selectors.isSubmitting, styles, theme, t]);

  return (
    <BaseScreen header={false} edges={['bottom']} bottomBarClearance={false}>
      <ScreenHeader title={t('pets.createTitle')} onBack={handlers.navigateBack} />

      <ScrollView contentContainerStyle={styles.content} style={{ flex: 1 }}>
        <AvatarPicker photo={photo} name={name} size={96} onChange={setPhoto} />

        <TextInput
          label={t('pets.nameRequired')}
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <SpeciesSelector value={species} onChange={setSpecies} />

        <TextInput
          label={t('pets.breedHint')}
          value={breed}
          onChangeText={setBreed}
          mode="outlined"
          style={styles.input}
        />

        <GenderSelector value={gender} onChange={setGender} />

        <TextInput
          label={t('pets.weightKg')}
          value={weight}
          onChangeText={setWeight}
          mode="outlined"
          keyboardType="decimal-pad"
          style={styles.input}
          right={<TextInput.Affix text="kg" />}
        />

        <DatePickerField
          label={t('pets.birthdayOptional')}
          value={birthday}
          onChange={setBirthday}
        />

        <TextInput
          label={t('pets.notesOptional')}
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          placeholder={t('pets.notesPlaceholder')}
        />
      </ScrollView>

      {renderSubmitButton()}
    </BaseScreen>
  );
};

CreatePetScreenComp.displayName = 'CreatePetScreen';
export const CreatePetScreen = React.memo(CreatePetScreenComp);
