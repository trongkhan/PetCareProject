import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, FAB, Surface, Text, useTheme } from 'react-native-paper';
import { useStyles } from './styles';
import type { IHomeScreenUICallback } from './types';
import { handleUICallback } from './uiCallback';
import { useViewModel } from './viewModel';

const HomeScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const handleUICallbackFn = useCallback(
    (action: IHomeScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const renderPetSwitcher = useCallback(() => {
    if (selectors.allPets.length === 0) return null;
    return (
      <View style={[styles.switcherContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherRow}>
          {selectors.allPets.map(p => {
            const isActive = p.id === selectors.pet?.id;
            return (
              <Pressable key={p.id} onPress={() => handlers.switchPet(p.id)} style={styles.switcherItem}>
                <View style={[
                  styles.avatarRing,
                  { borderColor: isActive ? theme.colors.primary : 'transparent' },
                ]}>
                  <View style={[
                    styles.avatarCircle,
                    { backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceVariant },
                  ]}>
                    <Text style={[styles.avatarInitial, { color: isActive ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                      {p.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text
                  numberOfLines={1}
                  style={[styles.switcherName, { color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: isActive ? '700' : '400' }]}
                >
                  {p.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }, [selectors.allPets, selectors.pet, handlers, styles, theme]);

  const renderPetHeader = useCallback(() => {
    if (!selectors.pet) return null;
    return (
      <Surface style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
          {selectors.pet.name}
        </Text>
        <View style={styles.chipRow}>
          <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
            {selectors.pet.species}
          </Chip>
          {selectors.pet.breed ? (
            <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
              {selectors.pet.breed}
            </Chip>
          ) : null}
          <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
            {selectors.pet.weight} kg
          </Chip>
        </View>
        <Button
          mode="text"
          compact
          onPress={() => handlers.navigatePetProfile(selectors.pet!.id)}
          textColor={theme.colors.onPrimaryContainer}
          style={styles.profileLink}
        >
          Xem hồ sơ
        </Button>
      </Surface>
    );
  }, [selectors.pet, handlers, styles, theme]);

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
                {meal.type} · {meal.amount} {meal.unit}
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
      {renderPetSwitcher()}
      <ScrollView contentContainerStyle={styles.content}>
        {renderPetHeader()}
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
