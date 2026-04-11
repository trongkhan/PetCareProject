import AsyncStorage from '@react-native-async-storage/async-storage';

// Thin wrapper around AsyncStorage for typed key-value storage (app preferences)
export const StorageService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export const STORAGE_KEYS = {
  ACTIVE_PET_ID: 'active_pet_id',
  SETTINGS: 'settings',
  ONBOARDING_DONE: 'onboarding_done',
} as const;
