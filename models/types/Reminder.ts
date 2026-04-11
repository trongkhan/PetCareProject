export type ReminderType =
  | 'feeding'
  | 'medication'
  | 'vaccination'
  | 'grooming'
  | 'vet'
  | 'deworming'
  | 'flea_tick'
  | 'custom';

export type ReminderFrequency =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface Reminder {
  id: string;
  petId: string;
  type: ReminderType;
  title: string;
  frequency: ReminderFrequency;
  time: string; // HH:mm
  date?: string; // ISO date string — for 'once' reminders
  enabled: boolean;
  lastTriggered?: string;
  notificationId?: string; // expo-notifications identifier
  createdAt: string;
}

export interface CreateReminderInput {
  petId: string;
  type: ReminderType;
  title: string;
  frequency: ReminderFrequency;
  time: string;
  date?: string;
  enabled?: boolean;
}
