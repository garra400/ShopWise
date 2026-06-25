/**
 * Local expiry reminders — fully on-device, no server (expo-notifications).
 *
 * Schedules a notification the day before each non-consumed product expires,
 * so the user is nudged to use it in time. Everything is a NO-OP on web
 * (expo-notifications can't schedule local notifications in the browser) and
 * never throws to the UI — notifications must never crash the app.
 *
 * Only meaningfully testable on a real device / APK (not Expo web).
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { differenceInCalendarDays, parse } from 'date-fns';
import { Product } from '@/types';

const CHANNEL_ID = 'expiry';

// How the notification behaves if it arrives while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function parseIso(iso: string): Date {
  return parse(iso, 'yyyy-MM-dd', new Date());
}

/** Ensure the Android channel exists and notification permission is granted. */
export async function ensureNotificationSetup(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Validade',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

/**
 * Reschedule all expiry reminders: cancels the existing ones and, when enabled,
 * schedules one per non-consumed product for 9am the day before it expires.
 * Idempotent and safe to call on every product/settings change.
 */
export async function syncExpiryNotifications(products: Product[], enabled: boolean): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) return;

    const granted = await ensureNotificationSetup();
    if (!granted) return;

    const now = new Date();
    for (const p of products) {
      if (p.consumed) continue;

      const expiry = parseIso(p.expiryDate);
      // Fire at 9am the day before expiry.
      const fireDate = new Date(expiry);
      fireDate.setDate(fireDate.getDate() - 1);
      fireDate.setHours(9, 0, 0, 0);
      if (fireDate.getTime() <= now.getTime()) continue; // don't schedule past reminders

      const days = differenceInCalendarDays(expiry, now);
      const when = days <= 1 ? 'amanhã' : `em ${days} dias`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'ShopWise',
          body: `${p.name} vence ${when} — que tal usar antes de estragar?`,
          data: { productId: p.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireDate,
          channelId: CHANNEL_ID,
        },
      });
    }
  } catch {
    // Never let a notification error reach the UI.
  }
}
