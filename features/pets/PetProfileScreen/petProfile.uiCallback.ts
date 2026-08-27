import { Alert } from 'react-native';
import { router } from 'expo-router';
import { translate } from '@/hooks/useTranslation';
import { PetProfileScreenActionsEnum, IPetProfileScreenUICallback } from './petProfile.types';

export const handleUICallback = (action: IPetProfileScreenUICallback): void => {
  switch (action.type) {
    case PetProfileScreenActionsEnum.NavigateBack:
      router.back();
      break;
    case PetProfileScreenActionsEnum.NavigateHome:
      router.replace('/');
      break;
    case PetProfileScreenActionsEnum.NavigateEdit: {
      const { petId } = action.payload as { petId: string };
      router.push({ pathname: '/pet/edit', params: { id: petId } });
      break;
    }
    case PetProfileScreenActionsEnum.ConfirmDeletePet: {
      const { petName, onConfirm } = action.payload as { petName: string; onConfirm: () => void };
      Alert.alert(translate('pets.deleteConfirmTitle'), translate('pets.deleteConfirmMessage', { name: petName }), [
        { text: translate('common.cancel'), style: 'cancel' },
        {
          text: translate('common.delete'),
          style: 'destructive',
          onPress: () => {
            onConfirm();
            router.replace('/');
          },
        },
      ]);
      break;
    }
    default:
      break;
  }
};
