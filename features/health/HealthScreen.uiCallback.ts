import { HealthScreenActionsEnum, IHealthScreenUICallback } from './HealthScreen.types';

export const handleUICallback = (action: IHealthScreenUICallback): void => {
  switch (action.type) {
    case HealthScreenActionsEnum.OpenAddRecordDialog:
      // Dialog visibility is managed in the screen component via state
      break;
    default:
      break;
  }
};
