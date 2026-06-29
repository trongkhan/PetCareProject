export enum PetProfileScreenActionsEnum {
  NavigateBack = 'NavigateBack',
  NavigateHome = 'NavigateHome',
  NavigateEdit = 'NavigateEdit',
  ConfirmDeletePet = 'ConfirmDeletePet',
}

export interface IPetProfileScreenUICallback {
  type: PetProfileScreenActionsEnum;
  payload?: Record<string, unknown>;
}
