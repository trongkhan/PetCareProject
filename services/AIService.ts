import { supabase } from '@/services/supabase';

/**
 * Client for the Senly AI backend (Supabase Edge Functions).
 * `supabase.functions.invoke` automatically attaches the signed-in user's
 * JWT + the anon apikey, so these calls are authenticated by construction.
 * The Gemini key never touches the app — it lives in the backend secrets.
 */
async function invoke<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(fn, { body });
  if (error) throw error;
  return data as T;
}

// --- structured output shapes (validated with zod in task #5 before use) ---
export interface ExtractedMeal {
  type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'treat';
  food?: string;
  amount?: number;
  unit?: 'grams' | 'cups' | 'ml';
  brand?: string;
  notes?: string;
}
export interface ExtractedHealth {
  type?: 'vaccination' | 'vet_visit' | 'medication' | 'weight' | 'deworming' | 'other';
  title?: string;
  date?: string;
  nextDue?: string;
  cost?: number;
  notes?: string;
}
export interface ExtractResult {
  kind: 'meal' | 'health' | 'unknown';
  meal?: ExtractedMeal;
  health?: ExtractedHealth;
}

type Language = 'vi' | 'en';

export const AIService = {
  /** Parse free text into a structured meal/health log. */
  extract: (text: string, language: Language, today: string) =>
    invoke<{ data: ExtractResult }>('ai-extract', { text, language, today }).then((r) => r.data),

  /** Ask the pet-care assistant a question. */
  chat: (message: string, language: Language, petContext?: unknown) =>
    invoke<{ answer: string }>('ai-chat', { message, language, petContext }).then((r) => r.answer),

  /** Get a short daily insight from the pet's data. */
  insight: (petContext: unknown, language: Language) =>
    invoke<{ insight: string }>('ai-insight', { petContext, language }).then((r) => r.insight),
};
