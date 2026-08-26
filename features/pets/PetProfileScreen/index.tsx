import React, { useCallback } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Appbar, Button, Card, Chip, Divider, List, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { LoadingState } from '@/components/LoadingState';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate } from '@/utils/format';
import { WeightChart } from './components/WeightChart';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';

interface Props {
  petId: string;
}

interface ListRowIconProps {
  color?: string;
  style?: StyleProp<ViewStyle>;
}

function renderBreedIcon(props: ListRowIconProps) {
  return <List.Icon {...props} icon="dog" />;
}

function renderWeightIcon(props: ListRowIconProps) {
  return <List.Icon {...props} icon="scale-bathroom" />;
}

function renderBirthdayIcon(props: ListRowIconProps) {
  return <List.Icon {...props} icon="cake-variant" />;
}

function renderMicrochipIcon(props: ListRowIconProps) {
  return <List.Icon {...props} icon="chip" />;
}

function renderNotesIcon(props: ListRowIconProps) {
  return <List.Icon {...props} icon="note-text" />;
}

const PetProfileScreenComp = ({ petId }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t, language } = useTranslation();

  const { selectors, handlers } = useViewModel({ petId, handleUICallback });

  const renderHeroCard = useCallback(() => {
    if (!selectors.pet) return null;
    return (
      <Card mode="elevated" style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          {selectors.pet.photo ? (
            <Image source={{ uri: selectors.pet.photo }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
                {selectors.pet.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text variant="headlineMedium" style={[styles.petName, { color: theme.colors.onSurface }]}>
            {selectors.pet.name}
          </Text>
          <View style={styles.chipRow}>
            <Chip compact icon="paw">{t(`species.${selectors.pet.species}`)}</Chip>
            <Chip compact icon={selectors.pet.gender === 'male' ? 'gender-male' : 'gender-female'}>
              {selectors.pet.gender === 'male' ? t('gender.male') : t('gender.female')}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  }, [selectors.pet, styles, theme, t]);

  const renderAllergiesIcon = useCallback((props: ListRowIconProps) => (
    <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />
  ), [theme]);

  const renderAllergiesDescription = useCallback(() => (
    <View style={styles.allergyRow}>
      {selectors.pet!.allergies.map((item, idx) => (
        <Chip key={idx} compact icon="alert-circle"
          style={styles.allergyChip}
          textStyle={styles.allergyChipText}>
          {item}
        </Chip>
      ))}
    </View>
  ), [selectors.pet, styles]);

  const renderDetails = useCallback(() => {
    if (!selectors.pet) return null;
    return (
      <Card mode="outlined">
        <List.Item
          title={t('pets.breed')}
          description={selectors.pet.breed || t('pets.notUpdated')}
          left={renderBreedIcon}
        />
        <Divider />
        <List.Item
          title={t('pets.weight')}
          description={`${selectors.pet.weight} kg`}
          left={renderWeightIcon}
        />
        {selectors.pet.birthday && (
          <>
            <Divider />
            <List.Item
              title={t('pets.birthday')}
              description={formatDate(selectors.pet.birthday, language)}
              left={renderBirthdayIcon}
            />
          </>
        )}
        {selectors.pet.microchip && (
          <>
            <Divider />
            <List.Item
              title="Microchip"
              description={selectors.pet.microchip}
              left={renderMicrochipIcon}
            />
          </>
        )}
        {selectors.pet.allergies.length > 0 && (
          <>
            <Divider />
            <List.Item
              title={t('pets.allergies')}
              description={renderAllergiesDescription}
              left={renderAllergiesIcon}
            />
          </>
        )}
        {selectors.pet.notes && (
          <>
            <Divider />
            <List.Item
              title={t('pets.notes')}
              description={selectors.pet.notes}
              left={renderNotesIcon}
            />
          </>
        )}
      </Card>
    );
  }, [selectors.pet, t, language, renderAllergiesDescription, renderAllergiesIcon]);


  const renderDeleteButton = useCallback(() => (
    <Button
      mode="outlined"
      textColor={theme.colors.error}
      style={[styles.deleteButton, { borderColor: theme.colors.error }]}
      icon="delete"
      onPress={handlers.confirmDeletePet}
    >
      {t('pets.deleteButton')}
    </Button>
  ), [handlers.confirmDeletePet, styles, theme, t]);

  if (selectors.isLoading) {
    return (
      <BaseScreen header={false} edges={['bottom']} bottomBarClearance={false}>
        <LoadingState accessibilityLabel={t('pets.profileTitle')} />
      </BaseScreen>
    );
  }

  if (!selectors.pet) {
    return (
      <BaseScreen header={false} edges={['bottom']} style={styles.center} bottomBarClearance={false}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>{t('pets.notFound')}</Text>
        <Button onPress={handlers.navigateBack} style={{ marginTop: Spacing.md }}>{t('pets.goBack')}</Button>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen header={false} edges={['bottom']} bottomBarClearance={false}>
      <ScreenHeader title={t('pets.profileTitle')} onBack={handlers.navigateBack}>
        <Appbar.Action icon="pencil" onPress={handlers.navigateEdit} />
      </ScreenHeader>

      <ScrollView contentContainerStyle={styles.content}>
        {renderHeroCard()}
        {renderDetails()}
        {selectors.pet && (
          <WeightChart
            weightHistory={selectors.weightHistory}
            currentWeight={selectors.pet.weight}
          />
        )}
        {renderDeleteButton()}
      </ScrollView>
    </BaseScreen>
  );
};

PetProfileScreenComp.displayName = 'PetProfileScreen';
export const PetProfileScreen = React.memo(PetProfileScreenComp);
