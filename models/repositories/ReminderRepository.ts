import { randomUUID } from 'expo-crypto';
import db from '../db/client';
import { Reminder, CreateReminderInput } from '../types/Reminder';

function rowToReminder(row: Record<string, unknown>): Reminder {
  return {
    id: row.id as string,
    petId: row.pet_id as string,
    type: row.type as Reminder['type'],
    title: row.title as string,
    frequency: row.frequency as Reminder['frequency'],
    time: row.time as string,
    date: row.date as string | undefined,
    enabled: (row.enabled as number) === 1,
    lastTriggered: row.last_triggered as string | undefined,
    notificationId: row.notification_id as string | undefined,
    createdAt: row.created_at as string,
  };
}

export const ReminderRepository = {
  getByPetId(petId: string): Reminder[] {
    const rows = db.getAllSync<Record<string, unknown>>(
      'SELECT * FROM reminders WHERE pet_id = ? ORDER BY created_at DESC',
      [petId]
    );
    return rows.map(rowToReminder);
  },

  getEnabled(petId: string): Reminder[] {
    const rows = db.getAllSync<Record<string, unknown>>(
      'SELECT * FROM reminders WHERE pet_id = ? AND enabled = 1 ORDER BY time ASC',
      [petId]
    );
    return rows.map(rowToReminder);
  },

  create(input: CreateReminderInput): Reminder {
    const id = randomUUID();
    const now = new Date().toISOString();
    db.runSync(
      `INSERT INTO reminders (id, pet_id, type, title, frequency, time, date, enabled, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, input.petId, input.type, input.title, input.frequency, input.time, input.date ?? null, input.enabled !== false ? 1 : 0, now]
    );
    const row = db.getFirstSync<Record<string, unknown>>('SELECT * FROM reminders WHERE id = ?', [id]);
    return rowToReminder(row!);
  },

  setEnabled(id: string, enabled: boolean, notificationId?: string): void {
    db.runSync(
      'UPDATE reminders SET enabled = ?, notification_id = ? WHERE id = ?',
      [enabled ? 1 : 0, notificationId ?? null, id]
    );
  },

  delete(id: string): void {
    db.runSync('DELETE FROM reminders WHERE id = ?', [id]);
  },
};
