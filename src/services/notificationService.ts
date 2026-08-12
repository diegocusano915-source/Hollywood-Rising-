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
import { collectNotificationItems, buildNudge, buildRepeatSummary } from './notificationEngine';

const SCHEDULED_IDS = [100, 101, 102, 103, 104, 105, 110];

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
            body: 'This is a test — from now on you\u2019ll get real alerts (bids, offers, deadlines) when you\u2019re away from the game.',
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

        const items = collectNotificationItems(save);
        const nudge = buildNudge(save);
        const list: PhoneNotificationInput[] = [];

        // 2-5 hour "come online" nudge referencing real pending items
        const nudgeHours = 2 + Math.floor(Math.random() * 3); // 2, 3 or 4 h
        list.push({
          id: 100,
          title: nudge.title,
          body: nudge.body,
          schedule: { at: new Date(Date.now() + nudgeHours * 3600 * 1000) },
        });

        // Real deadline alerts staggered through the first 36h away
        const realItems = items
          .filter((i) => i.kind === 'DEADLINE' || i.kind === 'STATUS')
          .slice(0, 4);
        const delays = [6, 12, 24, 36];
        realItems.forEach((item, idx) => {
          list.push({
            id: 101 + idx,
            title: `📬 ${item.icon} ${item.title}`,
            body: `Come online — ${item.body}`,
            schedule: { at: new Date(Date.now() + delays[idx] * 3600 * 1000) },
          });
        });

        // Daily repeating reminder (cancelled the moment they return)
        list.push({
          id: 110,
          title: '📬 Still waiting for you',
          body: buildRepeatSummary(save),
          schedule: { on: { hour: new Date().getHours(), minute: new Date().getMinutes() }, repeats: true },
        });

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
