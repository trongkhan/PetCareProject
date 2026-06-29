import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ActivityIndicator, Appbar, Button, Card, Chip, Divider, List, Text, useTheme,
} from 'react-native-paper';
import { format } from 'date-fns';
import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { useStyles } from './styles';
import { useViewModel } from './viewModel';
import { handleUICallback } from './uiCallback';
import type { IPetProfileScreenUICallback } from './types';

interface Props {
  petId: string;
}

const SPECIES_LABELS: Record<string, string> = {
  dog: 'Chó', cat: 'Mèo', bird: 'Chim', hamster: 'Hamster', fish: 'Cá', rabbit: 'Thỏ', other: 'Khác',
};

const PetProfileScreenComp = ({ petId }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);

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
          <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
              {selectors.pet.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            {selectors.pet.name}
          </Text>
          <View style={styles.chipRow}>
            <Chip compact icon="paw">{SPECIES_LABELS[selectors.pet.species] ?? selectors.pet.species}</Chip>
            <Chip compact icon={selectors.pet.gender === 'male' ? 'gender-male' : 'gender-female'}>
              {selectors.pet.gender === 'male' ? 'Đực' : 'Cái'}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  }, [selectors.pet, styles, theme]);

  const renderDetails = useCallback(() => {
    if (!selectors.pet) return null;
    return (
      <Card mode="outlined">
        <List.Item
          title="Giống"
          description={selectors.pet.breed || 'Chưa cập nhật'}
          left={props => <List.Icon {...props} icon="dog" />}
        />
        <Divider />
        <List.Item
          title="Cân nặng"
          description={`${selectors.pet.weight} kg`}
          left={props => <List.Icon {...props} icon="scale-bathroom" />}
        />
        {selectors.pet.birthday && (
          <>
            <Divider />
            <List.Item
              title="Ngày sinh"
              description={new Date(selectors.pet.birthday).toLocaleDateString('vi-VN')}
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
        {selectors.pet.notes && (
          <>
            <Divider />
            <List.Item
              title="Ghi chú"
              description={selectors.pet.notes}
              left={props => <List.Icon {...props} icon="note-text" />}
            />
          </>
        )}
      </Card>
    );
  }, [selectors.pet]);

  const renderWeightChart = useCallback(() => {
    const history = selectors.weightHistory.slice(-8);
    const maxW = history.length > 0 ? Math.max(...history.map(e => e.weight)) : 1;
    return (
      <Card mode="outlined">
        <Card.Content style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>Lịch sử cân nặng</Text>
            {selectors.pet && (
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Hiện tại: {selectors.pet.weight} kg
              </Text>
            )}
          </View>
          {history.length === 0 ? (
            <View style={styles.chartEmpty}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
                Chưa có dữ liệu — thêm từ tab Sức khỏe
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.chartArea}>
                {history.map(entry => (
                  <View key={entry.id} style={{ flex: 1, alignItems: 'center' }}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(8, (entry.weight / maxW) * 80),
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    />
                    <Text style={[styles.barLabel, { color: theme.colors.onSurfaceVariant }]}>
                      {entry.weight}
                    </Text>
                    <Text style={[styles.barLabel, { color: theme.colors.onSurfaceVariant }]}>
                      {format(new Date(entry.date), 'dd/MM')}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    );
  }, [selectors.weightHistory, selectors.pet, styles, theme]);

  const renderDeleteButton = useCallback(() => (
    <Button
      mode="outlined"
      textColor={theme.colors.error}
      style={[styles.deleteButton, { borderColor: theme.colors.error }]}
      icon="delete"
      onPress={handlers.confirmDeletePet}
    >
      Xóa thú cưng
    </Button>
  ), [handlers.confirmDeletePet, styles, theme]);

  if (selectors.isLoading) {
    return (
      <BaseScreen edges={['bottom']} style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  if (!selectors.pet) {
    return (
      <BaseScreen edges={['bottom']} style={styles.center}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>Không tìm thấy thú cưng</Text>
        <Button onPress={handlers.navigateBack} style={{ marginTop: Spacing.md }}>Quay lại</Button>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen edges={['bottom']}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={handlers.navigateBack} />
        <Appbar.Content title="Hồ sơ thú cưng" />
        <Appbar.Action icon="pencil" onPress={handlers.navigateEdit} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {renderHeroCard()}
        {renderDetails()}
        {renderWeightChart()}
        {renderDeleteButton()}
      </ScrollView>
    </BaseScreen>
  );
};

PetProfileScreenComp.displayName = 'PetProfileScreen';
export const PetProfileScreen = React.memo(PetProfileScreenComp);
