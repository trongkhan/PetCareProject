export type HealthRecordType =
  | 'vaccination'
  | 'vet_visit'
  | 'medication'
  | 'weight'
  | 'deworming'
  | 'other';

export interface HealthRecord {
  id: string;
  petId: string;
  type: HealthRecordType;
  title: string;
  date: string; // ISO date string
  nextDue?: string; // ISO date string
  notes: string;
  cost?: number; // VND
  attachments: string[]; // local file URIs
  createdAt: string;
}

export interface CreateHealthRecordInput {
  petId: string;
  type: HealthRecordType;
  title: string;
  date: string;
  nextDue?: string;
  notes?: string;
  cost?: number;
  attachments?: string[];
}

export interface WeightEntry {
  id: string;
  petId: string;
  weight: number; // kg
  date: string; // ISO date string
}
