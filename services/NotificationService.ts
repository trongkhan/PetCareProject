import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder } from '@/models/types/Reminder';

const T = Notifications.SchedulableTriggerInputTypes;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function parseHM(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: isNaN(h) ? 8 : h, minute: isNaN(m) ? 0 : m };
}

function buildTrigger(reminder: Reminder): Notifications.NotificationTriggerInput {
  const { hour, minute } = parseHM(reminder.time);
  const now = new Date();

  switch (reminder.frequency) {
    case 'once': {
      const base = reminder.date ? new Date(reminder.date + 'T00:00:00') : new Date();
      base.setHours(hour, minute, 0, 0);
      // if the time already passed today for 'once', fire as soon as possible
      if (base <= now) base.setDate(base.getDate() + 1);
      return { type: T.DATE, date: base };
    }
    case 'daily':
      return { type: T.DAILY, hour, minute };

    case 'weekly':
      return {
        type: T.WEEKLY,
        weekday: now.getDay() + 1, // JS getDay(): 0(Sun)–6(Sat) → expo: 1(Sun)–7(Sat)
        hour,
        minute,
      };

    case 'monthly':
      return {
        type: T.MONTHLY,
        day: now.getDate(),
        hour,
        minute,
      };

    case 'quarterly': {
      const d = new Date(now);
      d.setMonth(d.getMonth() + 3);
      d.setHours(hour, minute, 0, 0);
      return { type: T.DATE, date: d };
    }

    case 'yearly':
      if (Platform.OS === 'ios') {
        return {
          type: T.YEARLY,
          day: now.getDate(),
          month: now.getMonth(), // 0-based per expo-notifications spec
          hour,
          minute,
        };
      } else {
        const d = new Date(now);
        d.setFullYear(d.getFullYear() + 1);
        d.setHours(hour, minute, 0, 0);
        return { type: T.DATE, date: d };
      }

    default:
      return { type: T.DAILY, hour, minute };
  }
}

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleReminder(reminder: Reminder, petName?: string): Promise<string | null> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: petName ? `Nhắc nhở cho ${petName}` : 'Đến giờ chăm sóc thú cưng rồi!',
          sound: true,
          data: { reminderId: reminder.id },
        },
        trigger: buildTrigger(reminder),
      });
      return id;
    } catch (e) {
      console.warn('[NotificationService] scheduleReminder failed:', e);
      return null;
    }
  },

  async cancelReminder(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch { /* already cancelled */ }
  },

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async getScheduled(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
  },
};
