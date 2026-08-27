export enum FeedingScreenActionsEnum {
  OpenAddMealDialog = 'OpenAddMealDialog',
}

export interface IFeedingScreenUICallback {
  type: FeedingScreenActionsEnum;
  payload?: Record<string, unknown>;
}
