import { z } from 'zod';

// Schemas that validate the AI extraction output before the app trusts it.
// Mirror CreateMealInput / CreateHealthRecordInput (minus petId).

export const extractedMealSchema = z.object({
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'treat']).optional(),
  food: z.string().optional(),
  amount: z.number().optional(),
  unit: z.enum(['grams', 'cups', 'ml']).optional(),
  brand: z.string().optional(),
  notes: z.string().optional(),
});

export const extractedHealthSchema = z.object({
  type: z.enum(['vaccination', 'vet_visit', 'medication', 'weight', 'deworming', 'other']).optional(),
  title: z.string().optional(),
  date: z.string().optional(),
  nextDue: z.string().optional(),
  cost: z.number().optional(),
  notes: z.string().optional(),
});

export const extractResultSchema = z.object({
  kind: z.enum(['meal', 'health', 'unknown']),
  meal: extractedMealSchema.optional(),
  health: extractedHealthSchema.optional(),
});

export type ExtractedMeal = z.infer<typeof extractedMealSchema>;
export type ExtractedHealth = z.infer<typeof extractedHealthSchema>;
export type ExtractResult = z.infer<typeof extractResultSchema>;

/** Validate raw AI output; returns a safe result (kind 'unknown' if invalid). */
export function parseExtractResult(raw: unknown): ExtractResult {
  const parsed = extractResultSchema.safeParse(raw);
  return parsed.success ? parsed.data : { kind: 'unknown' };
}
