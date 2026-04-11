import { useState, useEffect, useCallback } from 'react';
import { Reminder, CreateReminderInput } from '@/models/types/Reminder';
import { ReminderRepository } from '@/models/repositories/ReminderRepository';
import { NotificationService } from '@/services/NotificationService';
import { useActivePetStore } from '@/store/activePetStore';

interface RemindersViewModel {
  reminders: Reminder[];
  isLoading: boolean;
  addReminder: (input: Omit<CreateReminderInput, 'petId'>) => Promise<void>;
  toggleReminder: (id: string, enabled: boolean) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useRemindersViewModel(): RemindersViewModel {
  const { activePetId } = useActivePetStore();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    if (!activePetId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      setReminders(ReminderRepository.getByPetId(activePetId));
    } finally {
      setIsLoading(false);
    }
  }, [activePetId]);

  useEffect(() => { load(); }, [load]);

  const addReminder = useCallback(async (input: Omit<CreateReminderInput, 'petId'>) => {
    if (!activePetId) return;
    const saved = ReminderRepository.create({ ...input, petId: activePetId });
    const notificationId = await NotificationService.scheduleReminder(saved);
    if (notificationId) {
      ReminderRepository.setEnabled(saved.id, true, notificationId);
    }
    setReminders(prev => [{ ...saved, notificationId: notificationId ?? undefined }, ...prev]);
  }, [activePetId]);

  const toggleReminder = useCallback(async (id: string, enabled: boolean) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    if (enabled) {
      const notificationId = await NotificationService.scheduleReminder(reminder);
      ReminderRepository.setEnabled(id, true, notificationId ?? undefined);
      setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: true, notificationId: notificationId ?? undefined } : r));
    } else {
      if (reminder.notificationId) await NotificationService.cancelReminder(reminder.notificationId);
      ReminderRepository.setEnabled(id, false);
      setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: false } : r));
    }
  }, [reminders]);

  const deleteReminder = useCallback(async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder?.notificationId) await NotificationService.cancelReminder(reminder.notificationId);
    ReminderRepository.delete(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  }, [reminders]);

  return { reminders, isLoading, addReminder, toggleReminder, deleteReminder, refresh: load };
}
