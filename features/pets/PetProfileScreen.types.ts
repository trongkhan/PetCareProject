export enum PetProfileScreenActionsEnum {
  NavigateBack = 'NavigateBack',
  NavigateHome = 'NavigateHome',
  ConfirmDeletePet = 'ConfirmDeletePet',
}

export interface IPetProfileScreenUICallback {
  type: PetProfileScreenActionsEnum;
  payload?: Record<string, unknown>;
}
