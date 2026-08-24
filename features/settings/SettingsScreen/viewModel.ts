import { useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { ColorSchemePreference, ISettingsScreenUICallback, Language } from './types';

interface UseViewModelProps {
  handleUICallback: (action: ISettingsScreenUICallback) => void;
}

interface Selectors {
  language: Language;
  colorScheme: ColorSchemePreference;
  notificationsEnabled: boolean;
}

interface Handlers {
  setLanguage: (value: string) => void;
  setColorScheme: (value: string) => void;
  setNotificationsEnabled: (value: boolean) => void;
}

export const useViewModel = ({ handleUICallback: _handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const language = useSettingsStore((s) => s.language);
  const setLanguageRaw = useSettingsStore((s) => s.setLanguage);
  const colorScheme = useSettingsStore((s) => s.colorScheme);
  const setColorSchemeRaw = useSettingsStore((s) => s.setColorScheme);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  // SegmentedButtons hands back a plain string; narrowing belongs here, not in the View.
  const setLanguage = useCallback((value: string) => {
    setLanguageRaw(value as Language);
  }, [setLanguageRaw]);

  const setColorScheme = useCallback((value: string) => {
    setColorSchemeRaw(value as ColorSchemePreference);
  }, [setColorSchemeRaw]);

  return {
    selectors: { language, colorScheme, notificationsEnabled },
    handlers: { setLanguage, setColorScheme, setNotificationsEnabled },
  };
};
