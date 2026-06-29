export enum EditPetScreenActionsEnum {
  NavigateBack = 'NavigateBack',
  SaveSuccess = 'SaveSuccess',
}

export interface IEditPetScreenUICallback {
  type: EditPetScreenActionsEnum;
}
