import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { differenceInMonths, differenceInYears } from 'date-fns';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, ScrollView, UIManager, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Divider, FAB, Icon, Surface, Text, useTheme } from 'react-native-paper';
import { useStyles } from './styles';
import type { IHomeScreenUICallback } from './types';
import { handleUICallback } from './uiCallback';
import { useViewModel } from './viewModel';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Chó', cat: 'Mèo', bird: 'Chim', hamster: 'Hamster', fish: 'Cá', rabbit: 'Thỏ', other: 'Khác',
};

function calcPetAge(birthday: string): string {
  const birth = new Date(birthday + 'T00:00:00');
  const now = new Date();
  const years = differenceInYears(now, birth);
  if (years >= 1) return `${years} tuổi`;
  const months = differenceInMonths(now, birth);
  return months <= 0 ? 'Dưới 1 tháng' : `${months} tháng tuổi`;
}

const HomeScreenComp = () => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const handleUICallbackFn = useCallback(
    (action: IHomeScreenUICallback) => handleUICallback(action),
    [],
  );

  const { selectors, handlers } = useViewModel({ handleUICallback: handleUICallbackFn });

  const [expanded, setExpanded] = useState(false);
  const chevronAnim = useRef(new Animated.Value(0)).current;
  const activePetId = selectors.pet?.id;

  const collapsePanel = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(false);
    Animated.timing(chevronAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [chevronAnim]);

  // collapse when switching pets
  React.useEffect(() => { collapsePanel(); }, [activePetId]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => {
      Animated.timing(chevronAnim, {
        toValue: prev ? 0 : 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
      return !prev;
    });
  }, [chevronAnim]);

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
    const pet = selectors.pet;
    const chevronRotate = chevronAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <Surface style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
        <Pressable onPress={toggleExpanded} style={styles.headerTouchable}>
          <Text variant="headlineMedium" style={[styles.headerName, { color: theme.colors.onPrimaryContainer }]}>
            {pet.name}
          </Text>
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <Icon source="chevron-down" size={24} color={theme.colors.onPrimaryContainer} />
          </Animated.View>
        </Pressable>

        <View style={styles.chipRow}>
          <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
            {SPECIES_LABELS[pet.species] ?? pet.species}
          </Chip>
          {pet.breed ? (
            <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
              {pet.breed}
            </Chip>
          ) : null}
          <Chip compact style={{ backgroundColor: theme.colors.primary }} textStyle={{ color: theme.colors.onPrimary }}>
            {pet.weight} kg
          </Chip>
          {pet.birthday ? (
            <Chip compact style={{ backgroundColor: theme.colors.secondary }} textStyle={{ color: theme.colors.onSecondary }}>
              {calcPetAge(pet.birthday)}
            </Chip>
          ) : null}
        </View>

        {expanded && (
          <View style={styles.expandedPanel}>
            <Divider style={{ backgroundColor: theme.colors.primary, opacity: 0.2, marginBottom: Spacing.sm }} />

            <View style={styles.infoRow}>
              <Icon source={pet.gender === 'male' ? 'gender-male' : 'gender-female'} size={16} color={theme.colors.onPrimaryContainer} />
              <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                {pet.gender === 'male' ? 'Đực' : 'Cái'}
              </Text>
            </View>

            {pet.birthday ? (
              <View style={styles.infoRow}>
                <Icon source="cake-variant" size={16} color={theme.colors.onPrimaryContainer} />
                <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                  {new Date(pet.birthday + 'T00:00:00').toLocaleDateString('vi-VN')}
                </Text>
              </View>
            ) : null}

            {pet.notes ? (
              <View style={styles.infoRow}>
                <Icon source="note-text-outline" size={16} color={theme.colors.onPrimaryContainer} />
                <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, flex: 1 }}>
                  {pet.notes}
                </Text>
              </View>
            ) : null}

            {pet.allergies.length > 0 ? (
              <View style={styles.infoRow}>
                <Icon source="alert-circle-outline" size={16} color={theme.colors.onPrimaryContainer} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, flex: 1 }}>
                  {pet.allergies.map((a, i) => (
                    <Chip key={i} compact style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} textStyle={{ fontSize: 11, color: theme.colors.onPrimaryContainer }}>
                      {a}
                    </Chip>
                  ))}
                </View>
              </View>
            ) : null}

            <Button
              mode="text"
              compact
              onPress={() => handlers.navigatePetProfile(pet.id)}
              textColor={theme.colors.onPrimaryContainer}
              style={styles.profileLink}
              icon="arrow-right"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              Xem hồ sơ đầy đủ
            </Button>
          </View>
        )}
      </Surface>
    );
  }, [selectors.pet, handlers, styles, theme, expanded, chevronAnim, toggleExpanded]);

  const renderVaccinationWarning = useCallback(() => {
    if (selectors.upcomingVaccinations.length === 0) return null;
    return (
      <Card mode="contained" style={{ backgroundColor: '#FFF8E1', marginBottom: Spacing.sm }}>
        <Card.Content style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }}>
          <Text style={{ fontSize: 20 }}>💉</Text>
          <View style={{ flex: 1 }}>
            <Text variant="titleSmall" style={{ color: '#E65100', fontWeight: '700' }}>
              Sắp đến lịch tiêm phòng
            </Text>
            {selectors.upcomingVaccinations.map(v => (
              <Text key={v.id} variant="bodySmall" style={{ color: '#BF360C', marginTop: 2 }}>
                {v.title} — {new Date(v.nextDue! + 'T00:00:00').toLocaleDateString('vi-VN')}
              </Text>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  }, [selectors.upcomingVaccinations]);

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
        {renderVaccinationWarning()}
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
