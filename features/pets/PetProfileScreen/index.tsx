import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ActivityIndicator, Appbar, Button, Card, Chip, Divider, List, Text, useTheme,
} from 'react-native-paper';
import { BaseScreen } from '@/components/BaseScreen';
import { Spacing } from '@/constants/theme';
import { WeightChart } from './components/WeightChart';
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
              description={new Date(selectors.pet.birthday + 'T00:00:00').toLocaleDateString('vi-VN')}
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
              title="Dị ứng / Bệnh nền"
              description={() => (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {selectors.pet!.allergies.map((item, idx) => (
                    <Chip key={idx} compact icon="alert-circle" style={{ backgroundColor: '#FFF3E0' }}
                      textStyle={{ color: '#E65100', fontSize: 11 }}>
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
              title="Ghi chú"
              description={selectors.pet.notes}
              left={props => <List.Icon {...props} icon="note-text" />}
            />
          </>
        )}
      </Card>
    );
  }, [selectors.pet]);


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
