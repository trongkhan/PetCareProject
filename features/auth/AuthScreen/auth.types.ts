// No screen-local actions currently route through handleUICallback (Google/
// Apple/Guest are handled directly by the viewModel) — kept as an empty enum
// so the folder still matches this project's index/viewModel/uiCallback shape.
export enum AuthScreenActionsEnum {}

export interface IAuthScreenUICallback {
  type: AuthScreenActionsEnum;
  payload?: Record<string, unknown>;
}
