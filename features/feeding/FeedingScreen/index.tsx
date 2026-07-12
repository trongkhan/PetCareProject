import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Appbar, Card, FAB, IconButton, Text, useTheme } from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate } from '@/utils/format';
import { AddMealDialog } from './components/AddMealDialog';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IFeedingScreenUICallback } from './types';

const FeedingScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const { t, language } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleUICallbackFn = useCallback(
    (action: IFeedingScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderSectionHeader = useCallback(() => (
    <View style={styles.sectionHeader}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
        {t('feeding.todayHeader', { count: selectors.todayMeals.length })}
      </Text>
    </View>
  ), [selectors.todayMeals.length, styles, theme, t]);

  const renderTodayMeals = useCallback(() => {
    if (selectors.todayMeals.length === 0) {
      return (
        <Card mode="outlined">
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
              {t('feeding.empty')}
            </Text>
          </Card.Content>
        </Card>
      );
    }
    return (
      <>
        {selectors.todayMeals.map(meal => (
          <Card key={meal.id} mode="outlined" style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardText}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>{meal.food}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t(`mealType.${meal.type}`)} · {meal.amount} {meal.unit}
                  {meal.brand ? ` · ${meal.brand}` : ''}
                </Text>
                {meal.notes ? (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {meal.notes}
                  </Text>
                ) : null}
              </View>
              <IconButton
                icon="delete-outline"
                iconColor={theme.colors.error}
                size={20}
                onPress={() => handlers.deleteMeal(meal.id)}
              />
            </Card.Content>
          </Card>
        ))}
      </>
    );
  }, [selectors.todayMeals, handlers, styles, theme, t]);

  const renderMealHistory = useCallback(() => {
    const historyMeals = selectors.meals.filter(m => !selectors.todayMeals.find(t => t.id === m.id));
    if (historyMeals.length === 0) return null;
    return (
      <>
        <Text variant="titleMedium" style={[styles.historyTitle, { color: theme.colors.onSurface }]}>
          {t('feeding.historyHeader')}
        </Text>
        {historyMeals.slice(0, 20).map(meal => (
          <Card key={meal.id} mode="outlined" style={styles.card}>
            <Card.Content>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>{meal.food}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {formatDate(meal.timestamp, language)} · {t(`mealType.${meal.type}`)}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </>
    );
  }, [selectors.meals, selectors.todayMeals, styles, theme, t, language]);

  if (selectors.isLoading) {
    return (
      <BaseScreen header={false} edges={['bottom']} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen header={false} edges={['bottom']}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('feeding.title')} />
      </Appbar.Header>
      <AddMealDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handlers.logMeal}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {renderSectionHeader()}
        {renderTodayMeals()}
        {renderMealHistory()}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => setDialogVisible(true)}
      />
    </BaseScreen>
  );
};

FeedingScreenComp.displayName = 'FeedingScreen';
export const FeedingScreen = React.memo(FeedingScreenComp);
