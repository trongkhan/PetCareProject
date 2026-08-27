import { AuthService } from '@/services/AuthService';
import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
  session: Session | null;
  user: User | null;
  /** True until the initial session has been loaded from storage. */
  initializing: boolean;
  init: () => void;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signInAsGuest: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initializing: true,

  init: () => {
    AuthService.getSession().then((session) => {
      set({ session, user: session?.user ?? null, initializing: false });
    });
    AuthService.onAuthStateChange((session) => {
      set({ session, user: session?.user ?? null, initializing: false });
    });
  },

  signInWithPassword: (email, password) => AuthService.signInWithPassword(email, password),

  signUp: (email, password) => AuthService.signUp(email, password),

  signInAsGuest: () => AuthService.signInAsGuest(),

  signOut: () => AuthService.signOut(),
}));
