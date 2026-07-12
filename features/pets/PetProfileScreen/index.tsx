import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import {
  ActivityIndicator, Appbar, Button, Card, Chip, Divider, List, Text, useTheme,
} from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate } from '@/utils/format';
import { WeightChart } from './components/WeightChart';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IPetProfileScreenUICallback } from './types';

interface Props {
  petId: string;
}

const PetProfileScreenComp = ({ petId }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t, language } = useTranslation();

  const handleUICallbackFn = useCallback(
    (action: IPetProfileScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ petId, handleUICallback: handleUICallbackFn });

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
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
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

  const renderDetails = useCallback(() => {
    if (!selectors.pet) return null;
    return (
      <Card mode="outlined">
        <List.Item
          title={t('pets.breed')}
          description={selectors.pet.breed || t('pets.notUpdated')}
          left={props => <List.Icon {...props} icon="dog" />}
        />
        <Divider />
        <List.Item
          title={t('pets.weight')}
          description={`${selectors.pet.weight} kg`}
          left={props => <List.Icon {...props} icon="scale-bathroom" />}
        />
        {selectors.pet.birthday && (
          <>
            <Divider />
            <List.Item
              title={t('pets.birthday')}
              description={formatDate(selectors.pet.birthday, language)}
              left={props => <List.Icon {...props} icon="cake-variant" />}
            />
          </>
        )}
        {selectors.pet.microchip && (
          <>
            <Divider />
            <List.Item
              title="Microchip"
              description={selectors.pet.microchip}
              left={props => <List.Icon {...props} icon="chip" />}
            />
          </>
        )}
        {selectors.pet.allergies.length > 0 && (
          <>
            <Divider />
            <List.Item
              title={t('pets.allergies')}
              description={() => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {selectors.pet!.allergies.map((item, idx) => (
                    <Chip key={idx} compact icon="alert-circle"
                      style={styles.allergyChip}
                      textStyle={styles.allergyChipText}>
                      {item}
                    </Chip>
                  ))}
                </View>
              )}
              left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
            />
          </>
        )}
        {selectors.pet.notes && (
          <>
            <Divider />
            <List.Item
              title={t('pets.notes')}
              description={selectors.pet.notes}
              left={props => <List.Icon {...props} icon="note-text" />}
            />
          </>
        )}
      </Card>
    );
  }, [selectors.pet, theme, styles, t, language]);


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
      <BaseScreen header={false} edges={['bottom']} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  if (!selectors.pet) {
    return (
      <BaseScreen header={false} edges={['bottom']} style={styles.center}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>{t('pets.notFound')}</Text>
        <Button onPress={handlers.navigateBack} style={{ marginTop: Spacing.md }}>{t('pets.goBack')}</Button>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen header={false} edges={['bottom']}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={handlers.navigateBack} />
        <Appbar.Content title={t('pets.profileTitle')} />
        <Appbar.Action icon="pencil" onPress={handlers.navigateEdit} />
      </Appbar.Header>

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
