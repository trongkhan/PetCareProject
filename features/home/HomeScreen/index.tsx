import { BaseScreen } from '@/components/BaseScreen';
import { LoadingState } from '@/components/LoadingState';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PetHeaderCard } from './components/PetHeaderCard';
import { PetSwitcher } from './components/PetSwitcher';
import { QuickLogCard } from './components/QuickLogCard';
import { SectionCard } from './components/SectionCard';
import { VaccinationWarning } from './components/VaccinationWarning';
import { useStyles } from './styles';
import type { IHomeScreenUICallback } from './types';
import { handleUICallback } from './uiCallback';
import { useViewModel } from './viewModel';

const HomeScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const handleUICallbackFn = useCallback(
    (action: IHomeScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderFeedingCard = useCallback(() => {
    const count = selectors.todayMeals.length;
    const latest = selectors.todayMeals[0];
    return (
      <SectionCard icon="silverware-fork-knife" title={t('home.feeding.title')} onPress={handlers.navigateFeeding}>
        {count === 0 ? (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
            {t('home.feeding.empty')}
          </Text>
        ) : (
          <View style={{ gap: 2 }}>
            <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
              {t('home.feeding.count', { count })}
            </Text>
            {latest && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {t(`mealType.${latest.type}`)} · {latest.food}
              </Text>
            )}
          </View>
        )}
      </SectionCard>
    );
  }, [selectors.todayMeals, handlers.navigateFeeding, theme, t]);

  const renderHealthCard = useCallback(() => {
    const hasVaccination = selectors.upcomingVaccinations.length > 0;
    return (
      <SectionCard icon="heart-pulse" title={t('home.health.title')} onPress={handlers.navigateHealth}>
        <View style={{ gap: 2 }}>
          {selectors.pet && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('home.health.currentWeight', { weight: selectors.pet.weight })}
            </Text>
          )}
          {hasVaccination ? (
            <Text variant="bodySmall" style={styles.warningText}>
              {t('home.health.vaccinationSoon')}
            </Text>
          ) : (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('home.health.noVaccination')}
            </Text>
          )}
        </View>
      </SectionCard>
    );
  }, [selectors.pet, selectors.upcomingVaccinations, handlers.navigateHealth, theme, t, styles]);

  const renderRemindersCard = useCallback(() => {
    const enabled = selectors.upcomingReminders.filter(r => r.enabled);
    const next = enabled[0];
    return (
      <SectionCard icon="bell-outline" title={t('home.reminders.title')} onPress={handlers.navigateReminders}>
        {enabled.length === 0 ? (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
            {t('home.reminders.empty')}
          </Text>
        ) : (
          <View style={{ gap: 2 }}>
            <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
              {t('home.reminders.count', { count: enabled.length })}
            </Text>
            {next && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {next.time} · {next.title}
              </Text>
            )}
          </View>
        )}
      </SectionCard>
    );
  }, [selectors.upcomingReminders, handlers.navigateReminders, theme, t]);

  if (selectors.isLoading) {
    return (
      <BaseScreen header={false} edges={['top']}>
        <LoadingState accessibilityLabel={t('common.appName')} />
      </BaseScreen>
    );
  }

  if (!selectors.pet) {
    return (
      <BaseScreen edges={['top']}>
        <View style={styles.center}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, marginBottom: Spacing.sm }}>
            {t('home.noPetTitle')}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: Spacing.lg }}>
            {t('home.noPetSubtitle')}
          </Text>
          <Button mode="contained" onPress={handlers.navigateCreatePet} icon="plus">
            {t('home.addPet')}
          </Button>
        </View>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen edges={['top']} fab={{ onPress: handlers.navigateCreatePet, accessibilityLabel: t('pets.createTitle') }}>
      <PetSwitcher
        pets={selectors.allPets}
        activePetId={selectors.pet.id}
        onSwitch={handlers.switchPet}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <PetHeaderCard
            key={selectors.pet.id}
            pet={selectors.pet}
            onNavigateProfile={handlers.navigatePetProfile}
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(70).duration(400)}>
          <VaccinationWarning vaccinations={selectors.upcomingVaccinations} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(140).duration(400)}>
          <QuickLogCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(210).duration(400)} style={styles.sections}>
          <Text variant="labelLarge" style={[styles.sectionsLabel, { color: theme.colors.onSurfaceVariant }]}>
            {t('home.activity')}
          </Text>
          {renderFeedingCard()}
          {renderHealthCard()}
          {renderRemindersCard()}
        </Animated.View>
      </ScrollView>
    </BaseScreen>
  );
};

HomeScreenComp.displayName = 'HomeScreen';
export const HomeScreen = React.memo(HomeScreenComp);
