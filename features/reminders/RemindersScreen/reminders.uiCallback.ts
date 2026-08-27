import { RemindersScreenActionsEnum, IRemindersScreenUICallback } from './reminders.types';

export const handleUICallback = (action: IRemindersScreenUICallback): void => {
  switch (action.type) {
    case RemindersScreenActionsEnum.OpenAddReminderDialog:
      // Dialog visibility is managed in the screen component via state
      break;
    default:
      break;
  }
};
