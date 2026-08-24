export enum AuthScreenActionsEnum {
  TogglePasswordVisibility = 'TogglePasswordVisibility',
}

export interface IAuthScreenUICallback {
  type: AuthScreenActionsEnum;
  payload?: Record<string, unknown>;
}
