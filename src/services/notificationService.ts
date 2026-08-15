/**
 * HOLLYWOOD RISING - Offline Phone Notification Service (REAL EVENTS ONLY)
 * Schedules phone notifications from real game state when the player closes
 * the app:
 *   - One "come online" nudge 2-5 hours after leaving (randomized)
 *   - Real deadline alerts staggered over the first 36h away
 *   - A daily repeating reminder (cancelled the moment they return)
 * Every notification references a real offer, bid, deadline or stat.
 * Capacitor Local Notifications on Android; graceful no-op on web.
 */

import { SaveData } from '../types/game';
import { collectNotificationItems, buildNudge, buildRepeatSummary, buildBatchMessages } from './notificationEngine';

// 12 slots: one every ~47 minutes covers ~9.5 hours away, then it stops
// (no endless overnight pinging)
const SCHEDULED_IDS = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111];
const BATCH_COUNT = 12;
const ROTATION_KEY = 'HR_NOTIF_ROTATION';

interface PhoneNotificationInput {
  id: number;
  title: string;
  body: string;
  schedule: { at: Date } | { on: { hour: number; minute: number }; repeats: boolean };
  extra?: Record<string, unknown>;
}

class NotificationService {
  private latestSave: SaveData | null = null;
  private isCapacitorAvailable: boolean = false;
  private listenersAttached: boolean = false;
  private scheduledCount: number = 0;

  constructor() {
    this.init();
  }

  private async init() {
    if (typeof window === 'undefined') return;
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      if (LocalNotifications) this.isCapacitorAvailable = true;
    } catch {
      this.isCapacitorAvailable = false;
    }

    if (this.listenersAttached) return;
    this.listenersAttached = true;

    // Player closes / backgrounds the app -> schedule real notifications
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.scheduleAwayNotifications();
      } else {
        this.cancelPendingNotifications();
      }
    });
    window.addEventListener('beforeunload', () => {
      this.scheduleAwayNotifications();
    });
  }

  /** GameContext pushes the latest save so scheduling always uses current state. */
  public refreshContext(save: SaveData | null) {
    this.latestSave = save;
  }

  public async requestPermissions(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (this.isCapacitorAvailable) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const perm = await LocalNotifications.requestPermissions();
        return perm.display === 'granted';
      } catch {
        return false;
      }
    }
    if ('Notification' in window) {
      try {
        return (await Notification.requestPermission()) === 'granted';
      } catch {
        return false;
      }
    }
    return false;
  }

  /** Fires one test notification ~2 seconds from now (for settings preview). */
  public async sendTestNotification(): Promise<boolean> {
    if (!this.isCapacitorAvailable) return false;
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999,
            title: '📬 Notifications are live',
            body: 'This is a test — from now on you\u2019ll get real alerts (bids, offers, deadlines) every ~47 minutes while you\u2019re away.',
            schedule: { at: new Date(Date.now() + 2000) },
            sound: 'default',
            smallIcon: 'ic_launcher',
          },
        ],
      });
      return true;
    } catch {
      return false;
    }
  }

  /** Schedule real-event phone notifications when the player leaves the app. */
  public async scheduleAwayNotifications() {
    const save = this.latestSave;
    if (!save?.player) return;

    // Player turned phone notifications off
    if (save.settings?.offlineNotifications === false) {
      await this.cancelPendingNotifications();
      return;
    }

    // 1. Native Capacitor scheduling (real Android builds)
    if (this.isCapacitorAvailable) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await LocalNotifications.cancel({ notifications: SCHEDULED_IDS.map((id) => ({ id })) });

        // Rotating content: advance the start offset every time the player leaves
        let offset = 0;
        try { offset = Number(localStorage.getItem(ROTATION_KEY) || '0'); } catch {}
        const batch = buildBatchMessages(save, BATCH_COUNT, offset);
        try { localStorage.setItem(ROTATION_KEY, String((offset + 1) % 8)); } catch {}

        // Every 46-50 minutes (jittered per batch), starting ~47 min after leaving
        const intervalMin = 46 + Math.floor(Math.random() * 5); // 46..50
        const list: PhoneNotificationInput[] = batch.map((msg, i) => ({
          id: 100 + i,
          title: msg.title,
          body: msg.body,
          schedule: { at: new Date(Date.now() + (i + 1) * intervalMin * 60 * 1000) },
        }));

        await LocalNotifications.schedule({ notifications: list });
        this.scheduledCount = list.length;
        return;
      } catch (e) {
        console.warn('Capacitor LocalNotifications schedule failed', e);
      }
    }

    // 2. Web fallback: nothing reliable to schedule in-browser across sessions — no-op.
    this.scheduledCount = 0;
  }

  /** Clear all pending phone notifications (player is back online). */
  public async cancelPendingNotifications() {
    if (!this.isCapacitorAvailable) return;
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.cancel({ notifications: SCHEDULED_IDS.map((id) => ({ id })) });
      await LocalNotifications.cancel({ notifications: [{ id: 999 }] });
      this.scheduledCount = 0;
    } catch {}
  }

  public isNativeAvailable(): boolean {
    return this.isCapacitorAvailable;
  }
}

export const notificationService = new NotificationService();
