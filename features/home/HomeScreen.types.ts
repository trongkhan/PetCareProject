export enum HomeScreenActionsEnum {
  NavigateCreatePet = 'NavigateCreatePet',
  NavigatePetProfile = 'NavigatePetProfile',
  NavigateFeeding = 'NavigateFeeding',
  NavigateReminders = 'NavigateReminders',
}

export interface IHomeScreenUICallback {
  type: HomeScreenActionsEnum;
  payload?: Record<string, unknown>;
}
