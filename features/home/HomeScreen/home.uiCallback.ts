import { router } from 'expo-router';
import { HomeScreenActionsEnum, IHomeScreenUICallback } from './home.types';

export const handleUICallback = (action: IHomeScreenUICallback): void => {
  switch (action.type) {
    case HomeScreenActionsEnum.NavigateCreatePet:
      router.push('/pet/create');
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
    case HomeScreenActionsEnum.NavigateTag:
      router.push('/tag');
      break;
    default:
      break;
  }
};
