import * as Notifications from 'expo-notifications';
import { Reminder } from '@/models/types/Reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleReminder(reminder: Reminder): Promise<string | null> {
    try {
      const [hour, minute] = reminder.time.split(':').map(Number);

      const trigger: Notifications.NotificationTriggerInput =
        reminder.frequency === 'once' && reminder.date
          ? { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(reminder.date) }
          : {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour,
              minute,
            };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: 'Đến giờ chăm sóc thú cưng rồi!',
          data: { reminderId: reminder.id },
        },
        trigger,
      });

      return notificationId;
    } catch {
      return null;
    }
  },

  async cancelReminder(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
