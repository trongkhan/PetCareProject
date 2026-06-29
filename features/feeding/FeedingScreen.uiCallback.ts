import { FeedingScreenActionsEnum, IFeedingScreenUICallback } from './FeedingScreen.types';

export const handleUICallback = (action: IFeedingScreenUICallback): void => {
  switch (action.type) {
    case FeedingScreenActionsEnum.OpenAddMealDialog:
      // Dialog visibility is managed in the screen component via state
      break;
    default:
      break;
  }
};
