import { parseExtractResult, type ExtractResult } from '@/services/aiSchemas';
import { supabase } from '@/services/supabase';

export type { ExtractResult } from '@/services/aiSchemas';

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

type Language = 'vi' | 'en';

export const AIService = {
  /** Parse free text into a structured, zod-validated meal/health log. */
  extract: (text: string, language: Language, today: string): Promise<ExtractResult> =>
    invoke<{ data: unknown }>('ai-extract', { text, language, today }).then((r) =>
      parseExtractResult(r.data),
    ),

  /** Ask the pet-care assistant a question. */
  chat: (message: string, language: Language, petContext?: unknown) =>
    invoke<{ answer: string }>('ai-chat', { message, language, petContext }).then((r) => r.answer),

  /** Get a short daily insight from the pet's data. */
  insight: (petContext: unknown, language: Language) =>
    invoke<{ insight: string }>('ai-insight', { petContext, language }).then((r) => r.insight),
};
