import { create } from 'zustand';

interface ActivePetState {
  activePetId: string | null;
  setActivePetId: (id: string | null) => void;
}

export const useActivePetStore = create<ActivePetState>((set) => ({
  activePetId: null,
  setActivePetId: (id) => set({ activePetId: id }),
}));
