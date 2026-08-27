export enum HealthScreenActionsEnum {
  OpenAddRecordDialog = 'OpenAddRecordDialog',
}

export interface IHealthScreenUICallback {
  type: HealthScreenActionsEnum;
  payload?: Record<string, unknown>;
}
