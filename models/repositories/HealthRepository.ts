import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import db from '../db/client';
import { CreateHealthRecordInput, HealthRecord, WeightEntry } from '../types/HealthRecord';

function rowToRecord(row: Record<string, unknown>): HealthRecord {
  return {
    id: row.id as string,
    petId: row.pet_id as string,
    type: row.type as HealthRecord['type'],
    title: row.title as string,
    date: row.date as string,
    nextDue: row.next_due as string | undefined,
    notes: row.notes as string,
    cost: row.cost as number | undefined,
    attachments: JSON.parse(row.attachments as string),
    createdAt: row.created_at as string,
  };
}

export const HealthRepository = {
  getByPetId(petId: string): HealthRecord[] {
    const rows = db.getAllSync<Record<string, unknown>>(
      'SELECT * FROM health_records WHERE pet_id = ? ORDER BY date DESC',
      [petId]
    );
    return rows.map(rowToRecord);
  },

  getByType(petId: string, type: HealthRecord['type']): HealthRecord[] {
    const rows = db.getAllSync<Record<string, unknown>>(
      'SELECT * FROM health_records WHERE pet_id = ? AND type = ? ORDER BY date DESC',
      [petId, type]
    );
    return rows.map(rowToRecord);
  },

  getWeightHistory(petId: string): WeightEntry[] {
    const rows = db.getAllSync<Record<string, unknown>>(
      "SELECT id, pet_id, notes as weight, date FROM health_records WHERE pet_id = ? AND type = 'weight' ORDER BY date ASC",
      [petId]
    );
    return rows.map(row => ({
      id: row.id as string,
      petId: row.pet_id as string,
      weight: parseFloat(row.weight as string),
      date: row.date as string,
    }));
  },

  create(input: CreateHealthRecordInput): HealthRecord {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.runSync(
      `INSERT INTO health_records (id, pet_id, type, title, date, next_due, notes, cost, attachments, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.petId,
        input.type,
        input.title,
        input.date,
        input.nextDue ?? null,
        input.notes ?? '',
        input.cost ?? null,
        JSON.stringify(input.attachments ?? []),
        now,
      ]
    );
    const row = db.getFirstSync<Record<string, unknown>>('SELECT * FROM health_records WHERE id = ?', [id]);
    return rowToRecord(row!);
  },

  delete(id: string): void {
    db.runSync('DELETE FROM health_records WHERE id = ?', [id]);
  },
};
