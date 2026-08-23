import type { ExtractResult } from '@/services/aiSchemas';
import { create } from 'zustand';

/**
 * Holds a pending AI-parsed log so the Home quick-log input can hand it to the
 * Feeding / Health screen, which opens its Add dialog pre-filled.
 */
interface QuickLogState {
  pending: ExtractResult | null;
  setPending: (result: ExtractResult) => void;
  clear: () => void;
}

export const useQuickLogStore = create<QuickLogState>((set) => ({
  pending: null,
  setPending: (pending) => set({ pending }),
  clear: () => set({ pending: null }),
}));
