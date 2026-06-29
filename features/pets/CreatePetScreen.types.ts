export enum CreatePetScreenActionsEnum {
  NavigateBack = 'NavigateBack',
  NavigateHome = 'NavigateHome',
}

export interface ICreatePetScreenUICallback {
  type: CreatePetScreenActionsEnum;
  payload?: Record<string, unknown>;
}
