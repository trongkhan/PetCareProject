import { create } from 'zustand';

type Language = 'vi' | 'en';
type ColorScheme = 'light' | 'dark' | 'system';

interface SettingsState {
  language: Language;
  colorScheme: ColorScheme;
  notificationsEnabled: boolean;
  setLanguage: (lang: Language) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'vi',
  colorScheme: 'system',
  notificationsEnabled: true,
  setLanguage: (language) => set({ language }),
  setColorScheme: (colorScheme) => set({ colorScheme }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
}));
