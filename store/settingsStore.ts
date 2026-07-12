import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'vi',
      colorScheme: 'system',
      notificationsEnabled: true,
      setLanguage: (language) => set({ language }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
    }),
    {
      name: 'petcare-settings',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user preferences, not the setter functions.
      partialize: (state) => ({
        language: state.language,
        colorScheme: state.colorScheme,
        notificationsEnabled: state.notificationsEnabled,
      }),
    },
  ),
);
