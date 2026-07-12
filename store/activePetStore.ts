import { create } from 'zustand';
import { DEFAULT_PET_THEME_ID } from '@/constants/petThemes';

interface ActivePetState {
  activePetId: string | null;
  activePetTheme: string;
  setActivePetId: (id: string | null) => void;
  setActivePetTheme: (themeId: string) => void;
}

export const useActivePetStore = create<ActivePetState>((set) => ({
  activePetId: null,
  activePetTheme: DEFAULT_PET_THEME_ID,
  setActivePetId: (id) => set({ activePetId: id }),
  setActivePetTheme: (themeId) => set({ activePetTheme: themeId }),
}));
