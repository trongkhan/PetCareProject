import { router } from 'expo-router';
import { EditPetScreenActionsEnum, IEditPetScreenUICallback } from './editPet.types';

export const handleUICallback = (action: IEditPetScreenUICallback): void => {
  switch (action.type) {
    case EditPetScreenActionsEnum.NavigateBack:
    case EditPetScreenActionsEnum.SaveSuccess:
      router.back();
      break;
    default:
      break;
  }
};
