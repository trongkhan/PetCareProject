export enum HomeScreenActionsEnum {
  NavigateCreatePet = 'NavigateCreatePet',
  NavigateFeeding = 'NavigateFeeding',
  NavigateHealth = 'NavigateHealth',
  NavigateReminders = 'NavigateReminders',
  NavigateTag = 'NavigateTag',
}

export interface IHomeScreenUICallback {
  type: HomeScreenActionsEnum;
  payload?: Record<string, unknown>;
}
