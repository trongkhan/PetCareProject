import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Surface, TextInput, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { DatePickerField } from '@/components/DatePickerField';
import { AvatarPicker } from '@/components/AvatarPicker';
import { PetThemePicker } from '@/components/PetThemePicker';
import { DEFAULT_PET_THEME_ID } from '@/constants/petThemes';
import { PetGender, PetSpecies } from '@/models/types/Pet';
import { Spacing } from '@/constants/theme';
import { useActivePetStore } from '@/store/activePetStore';
import { useTranslation } from '@/hooks/useTranslation';
import { GenderSelector } from '../components/GenderSelector';
import { SpeciesSelector } from '../components/SpeciesSelector';
import { useStyles } from './editPet.styles';
import { useViewModel } from './editPet.viewModel';
import { handleUICallback } from './editPet.uiCallback';

interface Props {
  petId: string;
}

const EditPetScreenComp = ({ petId }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();
  const { setActivePetTheme } = useActivePetStore();

  const [photo, setPhoto] = useState<string | null>(null);
  const [petTheme, setPetTheme] = useState(DEFAULT_PET_THEME_ID);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [weight, setWeight] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notes, setNotes] = useState('');

  const { selectors, handlers } = useViewModel({ petId, handleUICallback });

  useEffect(() => {
    if (selectors.pet) {
      setPhoto(selectors.pet.photo ?? null);
      setPetTheme(selectors.pet.petTheme ?? DEFAULT_PET_THEME_ID);
      setName(selectors.pet.name);
      setSpecies(selectors.pet.species);
      setBreed(selectors.pet.breed);
      setGender(selectors.pet.gender);
      setWeight(selectors.pet.weight.toString());
      setBirthday(selectors.pet.birthday ?? '');
      setNotes(selectors.pet.notes ?? '');
    }
  }, [selectors.pet]);

  const handleThemeChange = useCallback((themeId: string) => {
    setPetTheme(themeId);
    setActivePetTheme(themeId);
  }, [setActivePetTheme]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    handlers.savePet({
      photo,
      petTheme,
      name: name.trim(),
      species,
      breed: breed.trim(),
      gender,
      weight: parseFloat(weight) || 0,
      birthday: birthday || undefined,
      notes: notes.trim(),
    });
  }, [photo, name, species, breed, gender, weight, birthday, notes, handlers]);

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
        {t('pets.editSubmit')}
      </Button>
    </Surface>
  ), [handleSave, name, selectors.isSaving, styles, theme, t]);

  if (selectors.isLoading) {
    return (
      <BaseScreen header={false} edges={['bottom']} bottomBarClearance={false}>
        <LoadingState accessibilityLabel={t('pets.editTitle')} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen header={false} edges={['bottom']}>
      <ScreenHeader statusBarHeight={0} title={t('pets.editTitle')} onBack={handlers.navigateBack} />

      <ScrollView contentContainerStyle={styles.content} style={{ flex: 1 }}>
        <AvatarPicker photo={photo} name={name} size={96} onChange={setPhoto} />
        <PetThemePicker value={petTheme} onChange={handleThemeChange} />

        <TextInput
          label={t('pets.nameRequired')}
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <SpeciesSelector value={species} onChange={setSpecies} />

        <TextInput
          label={t('pets.breed')}
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

EditPetScreenComp.displayName = 'EditPetScreen';
export const EditPetScreen = React.memo(EditPetScreenComp);
