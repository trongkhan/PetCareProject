import { randomUUID } from 'expo-crypto';
import db from '../db/client';
import { Meal, CreateMealInput } from '../types/Meal';

function rowToMeal(row: Record<string, unknown>): Meal {
  return {
    id: row.id as string,
    petId: row.pet_id as string,
    type: row.type as Meal['type'],
    food: row.food as string,
    amount: row.amount as number,
    unit: row.unit as Meal['unit'],
    brand: row.brand as string | undefined,
    notes: row.notes as string | undefined,
    timestamp: row.timestamp as string,
  };
}

export const MealRepository = {
  getByPetId(petId: string, limit = 50): Meal[] {
    const rows = db.getAllSync<Record<string, unknown>>(
      'SELECT * FROM meals WHERE pet_id = ? ORDER BY timestamp DESC LIMIT ?',
      [petId, limit]
    );
    return rows.map(rowToMeal);
  },

  getTodayByPetId(petId: string): Meal[] {
    const today = new Date().toISOString().split('T')[0];
    const rows = db.getAllSync<Record<string, unknown>>(
      "SELECT * FROM meals WHERE pet_id = ? AND date(timestamp) = ? ORDER BY timestamp DESC",
      [petId, today]
    );
    return rows.map(rowToMeal);
  },

  create(input: CreateMealInput): Meal {
    const id = randomUUID();
    const timestamp = input.timestamp ?? new Date().toISOString();
    db.runSync(
      `INSERT INTO meals (id, pet_id, type, food, amount, unit, brand, notes, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, input.petId, input.type, input.food, input.amount, input.unit, input.brand ?? null, input.notes ?? null, timestamp]
    );
    const row = db.getFirstSync<Record<string, unknown>>('SELECT * FROM meals WHERE id = ?', [id]);
    return rowToMeal(row!);
  },

  delete(id: string): void {
    db.runSync('DELETE FROM meals WHERE id = ?', [id]);
  },
};
