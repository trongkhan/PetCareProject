import { router } from 'expo-router';
import { HomeScreenActionsEnum, IHomeScreenUICallback } from './HomeScreen.types';

export const handleUICallback = (action: IHomeScreenUICallback): void => {
  switch (action.type) {
    case HomeScreenActionsEnum.NavigateCreatePet:
      router.push('/pet/create');
      break;
    case HomeScreenActionsEnum.NavigatePetProfile:
      router.push(`/pet/${action.payload?.petId as string}`);
      break;
    case HomeScreenActionsEnum.NavigateFeeding:
      router.push('/(tabs)/feeding');
      break;
    case HomeScreenActionsEnum.NavigateReminders:
      router.push('/(tabs)/reminders');
      break;
    default:
      break;
  }
};
