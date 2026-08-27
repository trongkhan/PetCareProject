export interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export enum AssistantScreenActionsEnum {
  ScrollToLatest = 'ScrollToLatest',
}

export interface IAssistantScreenUICallback {
  type: AssistantScreenActionsEnum;
  payload?: Record<string, unknown>;
}
