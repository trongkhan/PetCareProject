import { BaseScreen } from '@/components/BaseScreen';
import { LoadingState } from '@/components/LoadingState';
import { useTranslation } from '@/hooks/useTranslation';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PetHeaderTrigger } from './components/PetHeaderTrigger';
import { PetPickerSheet } from './components/PetPickerSheet';
import { QuickLogCard } from './components/QuickLogCard';
import { SectionCard } from './components/SectionCard';
import { VaccinationWarning } from './components/VaccinationWarning';
import { useStyles } from './home.styles';
import { handleUICallback } from './home.uiCallback';
import { useViewModel } from './home.viewModel';

const HomeScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t } = useTranslation();

  const { selectors, handlers } = useViewModel({ handleUICallback });
  const [pickerVisible, setPickerVisible] = useState(false);
  const openPicker = useCallback(() => setPickerVisible(true), []);
  const closePicker = useCallback(() => setPickerVisible(false), []);

  const renderFeedingCard = useCallback(() => {
    const count = selectors.todayMeals.length;
    const latest = selectors.todayMeals[0];
    return (
      <SectionCard icon="silverware-fork-knife" title={t('home.feeding.title')} onPress={handlers.navigateFeeding}>
        {count === 0 ? (
          <Text variant="bodyMedium" style={[styles.emptyItalic, { color: theme.colors.onSurfaceVariant }]}>
            {t('home.feeding.empty')}
          </Text>
        ) : (
          <View style={styles.tightGap}>
            <Text variant="bodyMedium" style={[styles.countLabel, { color: theme.colors.primary }]}>
              {t('home.feeding.count', { count })}
            </Text>
            {latest && (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {t(`mealType.${latest.type}`)} · {latest.food}
              </Text>
            )}
          </View>
        )}
      </SectionCard>
    );
  }, [selectors.todayMeals, handlers.navigateFeeding, theme, t, styles]);

  const renderHealthCard = useCallback(() => {
    const hasVaccination = selectors.upcomingVaccinations.length > 0;
    return (
      <SectionCard icon="heart-pulse" title={t('home.health.title')} onPress={handlers.navigateHealth}>
        <View style={styles.tightGap}>
          {selectors.pet && (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('home.health.currentWeight', { weight: selectors.pet.weight })}
            </Text>
          )}
          {hasVaccination ? (
            <Text variant="bodyMedium" style={styles.warningText}>
              {t('home.health.vaccinationSoon')}
            </Text>
          ) : (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
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
          <Text variant="bodyMedium" style={[styles.emptyItalic, { color: theme.colors.onSurfaceVariant }]}>
            {t('home.reminders.empty')}
          </Text>
        ) : (
          <View style={styles.tightGap}>
            <Text variant="bodyMedium" style={[styles.countLabel, { color: theme.colors.primary }]}>
              {t('home.reminders.count', { count: enabled.length })}
            </Text>
            {next && (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {next.time} · {next.title}
              </Text>
            )}
          </View>
        )}
      </SectionCard>
    );
  }, [selectors.upcomingReminders, handlers.navigateReminders, theme, t, styles]);

  const renderHeaderLeft = useCallback(() => (
    <PetHeaderTrigger pet={selectors.pet!} onPress={openPicker} />
  ), [selectors.pet, openPicker]);

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
          <Text variant="headlineSmall" style={[styles.noPetTitle, { color: theme.colors.onSurface }]}>
            {t('home.noPetTitle')}
          </Text>
          <Text variant="bodyMedium" style={[styles.noPetSubtitle, { color: theme.colors.onSurfaceVariant }]}>
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
    <BaseScreen
      edges={['top']}
      fab={{ onPress: handlers.navigateCreatePet, accessibilityLabel: t('pets.createTitle') }}
      headerLeft={renderHeaderLeft}
    >
      <PetPickerSheet
        visible={pickerVisible}
        pets={selectors.allPets}
        activePetId={selectors.pet.id}
        onSwitch={handlers.switchPet}
        onCreate={handlers.navigateCreatePet}
        onClose={closePicker}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <VaccinationWarning vaccinations={selectors.upcomingVaccinations} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(70).duration(400)}>
          <QuickLogCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(140).duration(400)} style={styles.sections}>
          <Text variant="labelLarge" style={[styles.sectionsLabel, { color: theme.colors.onSurfaceVariant }]}>
            {t('home.activity')}
          </Text>
          {renderFeedingCard()}
          {renderHealthCard()}
          {renderRemindersCard()}
          <SectionCard icon="map-marker-radius" title={t('tag.title')} onPress={handlers.navigateTag}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('tag.homeHint')}
            </Text>
          </SectionCard>
        </Animated.View>
      </ScrollView>
    </BaseScreen>
  );
};

HomeScreenComp.displayName = 'HomeScreen';
export const HomeScreen = React.memo(HomeScreenComp);
