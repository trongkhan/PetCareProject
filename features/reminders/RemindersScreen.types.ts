export enum RemindersScreenActionsEnum {
  OpenAddReminderDialog = 'OpenAddReminderDialog',
}

export interface IRemindersScreenUICallback {
  type: RemindersScreenActionsEnum;
  payload?: Record<string, unknown>;
}
