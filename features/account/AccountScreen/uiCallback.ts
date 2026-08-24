import { AccountScreenActionsEnum, IAccountScreenUICallback } from './types';

export const handleUICallback = (action: IAccountScreenUICallback): void => {
  switch (action.type) {
    case AccountScreenActionsEnum.OpenSettings:
      // Navigation is handled in the screen component via expo-router
      break;
    default:
      break;
  }
};
