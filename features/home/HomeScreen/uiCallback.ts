import { router } from 'expo-router';
import { HomeScreenActionsEnum, IHomeScreenUICallback } from './types';

export const handleUICallback = (action: IHomeScreenUICallback): void => {
  switch (action.type) {
    case HomeScreenActionsEnum.NavigateCreatePet:
      router.push('/pet/create');
      break;
    case HomeScreenActionsEnum.NavigatePetProfile:
      router.push(`/pet/${action.payload?.petId as string}`);
      break;
    case HomeScreenActionsEnum.NavigateFeeding:
      router.push('/feeding');
      break;
    case HomeScreenActionsEnum.NavigateHealth:
      router.push('/health');
      break;
    case HomeScreenActionsEnum.NavigateReminders:
      router.push('/reminders');
      break;
    default:
      break;
  }
};
