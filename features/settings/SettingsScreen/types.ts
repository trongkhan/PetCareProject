export type Language = 'vi' | 'en';
export type ColorSchemePreference = 'light' | 'dark' | 'system';

export enum SettingsScreenActionsEnum {
  ChangeColorScheme = 'ChangeColorScheme',
}

export interface ISettingsScreenUICallback {
  type: SettingsScreenActionsEnum;
  payload?: Record<string, unknown>;
}
