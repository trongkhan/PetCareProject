import { SettingsScreenActionsEnum, ISettingsScreenUICallback } from './types';

export const handleUICallback = (action: ISettingsScreenUICallback): void => {
  switch (action.type) {
    case SettingsScreenActionsEnum.ChangeColorScheme:
      // The theme is applied from settingsStore; the screen re-renders from it
      break;
    default:
      break;
  }
};
