import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('petcare.db');

db.execSync(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS pets (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    photo TEXT,
    species TEXT NOT NULL,
    breed TEXT NOT NULL DEFAULT '',
    birthday TEXT,
    adopted_date TEXT,
    gender TEXT NOT NULL DEFAULT 'male',
    weight REAL NOT NULL DEFAULT 0,
    microchip TEXT,
    allergies TEXT NOT NULL DEFAULT '[]',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meals (
    id TEXT PRIMARY KEY NOT NULL,
    pet_id TEXT NOT NULL,
    type TEXT NOT NULL,
    food TEXT NOT NULL,
    amount REAL NOT NULL,
    unit TEXT NOT NULL DEFAULT 'grams',
    brand TEXT,
    notes TEXT,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS health_records (
    id TEXT PRIMARY KEY NOT NULL,
    pet_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    next_due TEXT,
    notes TEXT NOT NULL DEFAULT '',
    cost REAL,
    attachments TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY NOT NULL,
    pet_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    frequency TEXT NOT NULL,
    time TEXT NOT NULL,
    date TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    last_triggered TEXT,
    notification_id TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
  );
`);

// Migrations: add new columns that may not exist in older DB instances
const existingCols = db.getAllSync<{ name: string }>('PRAGMA table_info(pets)').map(c => c.name);
if (!existingCols.includes('photo')) {
  db.runSync('ALTER TABLE pets ADD COLUMN photo TEXT');
}

export default db;
