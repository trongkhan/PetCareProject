import { supabase } from '@/services/supabase';
import type { Session } from '@supabase/supabase-js';

/**
 * Client for Supabase Auth. Wraps every `supabase.auth.*` call the app makes
 * so authStore (state only, per ARCHITECTURE.md) never talks to the network
 * client directly.
 */
export const AuthService = {
  /** Current session, if any, resolved from storage (no network round-trip). */
  getSession: (): Promise<Session | null> =>
    supabase.auth.getSession().then(({ data }) => data.session),

  /** Fires on sign-in/sign-out/token-refresh, including the initial load. */
  onAuthStateChange: (callback: (session: Session | null) => void) =>
    supabase.auth.onAuthStateChange((_event, session) => callback(session)),

  signInWithPassword: async (email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  },

  signUp: async (email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? { error: error.message } : {};
  },

  // Real Supabase session (session.user.is_anonymous === true) with no
  // email/password — the auth gate in the root layout treats it like any
  // other signed-in session. Can be upgraded to a real account later via
  // supabase.auth.updateUser({ email, password }).
  signInAsGuest: async (): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signInAnonymously();
    return error ? { error: error.message } : {};
  },

  signOut: (): Promise<void> => supabase.auth.signOut().then(() => undefined),
};
