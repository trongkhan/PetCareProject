import { router } from 'expo-router';
import { CreatePetScreenActionsEnum, ICreatePetScreenUICallback } from './CreatePetScreen.types';

export const handleUICallback = (action: ICreatePetScreenUICallback): void => {
  switch (action.type) {
    case CreatePetScreenActionsEnum.NavigateBack:
      router.back();
      break;
    case CreatePetScreenActionsEnum.NavigateHome:
      router.replace('/');
      break;
    default:
      break;
  }
};
