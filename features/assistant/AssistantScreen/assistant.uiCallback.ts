import { AssistantScreenActionsEnum, IAssistantScreenUICallback } from './assistant.types';

export const handleUICallback = (action: IAssistantScreenUICallback): void => {
  switch (action.type) {
    case AssistantScreenActionsEnum.ScrollToLatest:
      // List position is managed in the screen component via FlatList
      break;
    default:
      break;
  }
};
