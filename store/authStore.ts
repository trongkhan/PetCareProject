import { supabase } from '@/services/supabase';
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
    supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, user: data.session?.user ?? null, initializing: false });
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, initializing: false });
    });
  },

  signInWithPassword: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? { error: error.message } : {};
  },

  // Real Supabase session (session.user.is_anonymous === true) with no
  // email/password — the auth gate in the root layout treats it like any
  // other signed-in session. Can be upgraded to a real account later via
  // supabase.auth.updateUser({ email, password }).
  signInAsGuest: async () => {
    const { error } = await supabase.auth.signInAnonymously();
    return error ? { error: error.message } : {};
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
