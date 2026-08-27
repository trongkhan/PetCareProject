export enum AccountScreenActionsEnum {
  OpenSettings = 'OpenSettings',
}

export interface IAccountScreenUICallback {
  type: AccountScreenActionsEnum;
  payload?: Record<string, unknown>;
}
