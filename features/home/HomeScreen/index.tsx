import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, FAB, Icon, Text, useTheme } from 'react-native-paper';
import { PetHeaderCard } from './components/PetHeaderCard';
import { PetSwitcher } from './components/PetSwitcher';
import { VaccinationWarning } from './components/VaccinationWarning';
import { useStyles } from './styles';
import type { IHomeScreenUICallback } from './types';
import { handleUICallback } from './uiCallback';
import { useViewModel } from './viewModel';

const MEAL_TYPE_LABELS: Record<string, string> = {
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

  const renderSectionCard = useCallback(({
    icon, title, onPress, children,
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    children: React.ReactNode;
  }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Card mode="outlined" style={styles.sectionCard}>
        <Card.Content style={styles.sectionCardContent}>
          <View style={styles.sectionCardLeft}>
            <View style={styles.sectionCardHeader}>
              <Icon source={icon} size={18} color={theme.colors.primary} />
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {title}
              </Text>
            </View>
            <View style={styles.sectionCardBody}>
              {children}
            </View>
          </View>
          <Icon source="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  ), [styles, theme]);

  const renderFeedingCard = useCallback(() => {
    const count = selectors.todayMeals.length;
    const latest = selectors.todayMeals[0];
    return renderSectionCard({
      icon: 'silverware-fork-knife',
      title: 'Bữa ăn hôm nay',
      onPress: handlers.navigateFeeding,
      children: count === 0 ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
          Chưa ghi nhận bữa ăn nào
        </Text>
      ) : (
        <View style={{ gap: 2 }}>
          <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
            {count} bữa hôm nay
          </Text>
          {latest && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {MEAL_TYPE_LABELS[latest.type] ?? latest.type} · {latest.food}
            </Text>
          )}
        </View>
      ),
    });
  }, [selectors.todayMeals, handlers.navigateFeeding, renderSectionCard, theme]);

  const renderHealthCard = useCallback(() => {
    const hasVaccination = selectors.upcomingVaccinations.length > 0;
    return renderSectionCard({
      icon: 'heart-pulse',
      title: 'Sức khỏe',
      onPress: handlers.navigateHealth,
      children: (
        <View style={{ gap: 2 }}>
          {selectors.pet && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Cân nặng hiện tại: {selectors.pet.weight} kg
            </Text>
          )}
          {hasVaccination ? (
            <Text variant="bodySmall" style={{ color: '#E65100', fontWeight: '600' }}>
              💉 Sắp đến lịch tiêm phòng
            </Text>
          ) : (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Không có lịch tiêm phòng sắp tới
            </Text>
          )}
        </View>
      ),
    });
  }, [selectors.pet, selectors.upcomingVaccinations, handlers.navigateHealth, renderSectionCard, theme]);

  const renderRemindersCard = useCallback(() => {
    const enabled = selectors.upcomingReminders.filter(r => r.enabled);
    const next = enabled[0];
    return renderSectionCard({
      icon: 'bell-outline',
      title: 'Nhắc nhở',
      onPress: handlers.navigateReminders,
      children: enabled.length === 0 ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
          Không có nhắc nhở nào đang bật
        </Text>
      ) : (
        <View style={{ gap: 2 }}>
          <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
            {enabled.length} nhắc nhở đang bật
          </Text>
          {next && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {next.time} · {next.title}
            </Text>
          )}
        </View>
      ),
    });
  }, [selectors.upcomingReminders, handlers.navigateReminders, renderSectionCard, theme]);

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
        <View style={styles.sections}>
          <Text variant="labelLarge" style={[styles.sectionsLabel, { color: theme.colors.onSurfaceVariant }]}>
            HOẠT ĐỘNG
          </Text>
          {renderFeedingCard()}
          {renderHealthCard()}
          {renderRemindersCard()}
        </View>
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
