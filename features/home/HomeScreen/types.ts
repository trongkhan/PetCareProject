export enum HomeScreenActionsEnum {
  NavigateCreatePet = 'NavigateCreatePet',
  NavigatePetProfile = 'NavigatePetProfile',
  NavigateFeeding = 'NavigateFeeding',
  NavigateHealth = 'NavigateHealth',
  NavigateReminders = 'NavigateReminders',
}

export interface IHomeScreenUICallback {
  type: HomeScreenActionsEnum;
  payload?: Record<string, unknown>;
}
