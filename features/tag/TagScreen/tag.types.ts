export enum TagScreenActionsEnum {
  CreateTag = 'CreateTag',
}

export interface ITagScreenUICallback {
  type: TagScreenActionsEnum;
  payload?: Record<string, unknown>;
}
