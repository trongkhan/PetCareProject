import { randomUUID } from 'expo-crypto';
import db from '../db/client';
import { Pet, CreatePetInput } from '../types/Pet';

function rowToPet(row: Record<string, unknown>): Pet {
  return {
    id: row.id as string,
    name: row.name as string,
    photo: row.photo as string | undefined,
    species: row.species as Pet['species'],
    breed: row.breed as string,
    birthday: row.birthday as string | undefined,
    adoptedDate: row.adopted_date as string | undefined,
    gender: row.gender as Pet['gender'],
    weight: row.weight as number,
    microchip: row.microchip as string | undefined,
    allergies: JSON.parse(row.allergies as string),
    notes: row.notes as string,
    createdAt: row.created_at as string,
  };
}

export const PetRepository = {
  getAll(): Pet[] {
    const rows = db.getAllSync<Record<string, unknown>>(
      'SELECT * FROM pets ORDER BY created_at DESC'
    );
    return rows.map(rowToPet);
  },

  getById(id: string): Pet | null {
    const row = db.getFirstSync<Record<string, unknown>>(
      'SELECT * FROM pets WHERE id = ?',
      [id]
    );
    return row ? rowToPet(row) : null;
  },

  create(input: CreatePetInput): Pet {
    const id = randomUUID();
    const now = new Date().toISOString();
    db.runSync(
      `INSERT INTO pets (id, name, photo, species, breed, birthday, adopted_date, gender, weight, microchip, allergies, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name,
        input.photo ?? null,
        input.species,
        input.breed,
        input.birthday ?? null,
        input.adoptedDate ?? null,
        input.gender,
        input.weight,
        input.microchip ?? null,
        JSON.stringify(input.allergies ?? []),
        input.notes ?? '',
        now,
      ]
    );
    return this.getById(id)!;
  },

  update(id: string, input: Partial<CreatePetInput>): Pet | null {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) { fields.push('name = ?'); values.push(input.name); }
    if (input.photo !== undefined) { fields.push('photo = ?'); values.push(input.photo); }
    if (input.species !== undefined) { fields.push('species = ?'); values.push(input.species); }
    if (input.breed !== undefined) { fields.push('breed = ?'); values.push(input.breed); }
    if (input.birthday !== undefined) { fields.push('birthday = ?'); values.push(input.birthday); }
    if (input.adoptedDate !== undefined) { fields.push('adopted_date = ?'); values.push(input.adoptedDate); }
    if (input.gender !== undefined) { fields.push('gender = ?'); values.push(input.gender); }
    if (input.weight !== undefined) { fields.push('weight = ?'); values.push(input.weight); }
    if (input.microchip !== undefined) { fields.push('microchip = ?'); values.push(input.microchip); }
    if (input.allergies !== undefined) { fields.push('allergies = ?'); values.push(JSON.stringify(input.allergies)); }
    if (input.notes !== undefined) { fields.push('notes = ?'); values.push(input.notes); }

    if (fields.length === 0) return this.getById(id);

    values.push(id);
    db.runSync(`UPDATE pets SET ${fields.join(', ')} WHERE id = ?`, values as string[]);
    return this.getById(id);
  },

  delete(id: string): void {
    db.runSync('DELETE FROM pets WHERE id = ?', [id]);
  },
};
