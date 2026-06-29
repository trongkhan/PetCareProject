import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Card, FAB, Text, useTheme } from 'react-native-paper';
import { PetHeaderCard } from './components/PetHeaderCard';
import { PetSwitcher } from './components/PetSwitcher';
import { VaccinationWarning } from './components/VaccinationWarning';
import { useStyles } from './styles';
import type { IHomeScreenUICallback } from './types';
import { handleUICallback } from './uiCallback';
import { useViewModel } from './viewModel';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Sáng', lunch: 'Trưa', dinner: 'Tối', snack: 'Ăn vặt', treat: 'Thưởng',
};

const HomeScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const handleUICallbackFn = useCallback(
    (action: IHomeScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderTodayMeals = useCallback(() => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: Spacing.sm }}>
        Bữa ăn hôm nay
      </Text>
      {selectors.todayMeals.length === 0 ? (
        <Card mode="outlined">
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
              Chưa ghi nhận bữa ăn nào hôm nay
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={handlers.navigateFeeding}>Ghi bữa ăn</Button>
          </Card.Actions>
        </Card>
      ) : (
        selectors.todayMeals.map(meal => (
          <Card key={meal.id} mode="outlined" style={styles.card}>
            <Card.Content>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>{meal.food}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {MEAL_LABELS[meal.type] ?? meal.type}{meal.amount ? ` · ${meal.amount} ${meal.unit}` : ''}
              </Text>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  ), [selectors.todayMeals, handlers, styles, theme]);

  const renderUpcomingReminders = useCallback(() => (
    <View style={styles.section}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: Spacing.sm }}>
        Nhắc nhở sắp tới
      </Text>
      {selectors.upcomingReminders.length === 0 ? (
        <Card mode="outlined">
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
              Không có nhắc nhở nào
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={handlers.navigateReminders}>Thêm nhắc nhở</Button>
          </Card.Actions>
        </Card>
      ) : (
        selectors.upcomingReminders.slice(0, 3).map(reminder => (
          <Card key={reminder.id} mode="outlined" style={styles.card}>
            <Card.Content>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>{reminder.title}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {reminder.time} · {reminder.frequency}
              </Text>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  ), [selectors.upcomingReminders, handlers, styles, theme]);

  if (selectors.isLoading) {
    return (
      <BaseScreen edges={['top']} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  if (!selectors.pet) {
    return (
      <BaseScreen edges={['top']} style={styles.center}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, marginBottom: Spacing.sm }}>
          Chưa có thú cưng nào
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: Spacing.lg }}>
          Thêm thú cưng đầu tiên của bạn
        </Text>
        <Button mode="contained" onPress={handlers.navigateCreatePet} icon="plus">
          Thêm thú cưng
        </Button>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen edges={['top']}>
      <PetSwitcher
        pets={selectors.allPets}
        activePetId={selectors.pet.id}
        onSwitch={handlers.switchPet}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <PetHeaderCard
          key={selectors.pet.id}
          pet={selectors.pet}
          onNavigateProfile={handlers.navigatePetProfile}
        />
        <VaccinationWarning vaccinations={selectors.upcomingVaccinations} />
        {renderTodayMeals()}
        {renderUpcomingReminders()}
      </ScrollView>
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={handlers.navigateCreatePet}
      />
    </BaseScreen>
  );
};

HomeScreenComp.displayName = 'HomeScreen';
export const HomeScreen = React.memo(HomeScreenComp);
