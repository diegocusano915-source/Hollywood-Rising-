/**
 * HOLLYWOOD RISING - Offline Phone Notification Service (REAL EVENTS ONLY)
 * When the player leaves the app, schedules a rotating batch of DIFFERENT
 * real-event notifications every ~46-50 minutes for the next ~12 hours.
 * Short "come online" pings on the phone — full details stay hidden inside
 * the game (Notification Center / While You Were Away digest).
 */

import { SaveData } from '../types/game';
import { collectNotificationItems, buildNudge, buildRepeatSummary } from './notificationEngine';

// 12 pings at ~47-min intervals covering ~9.4h (fits Android's scheduling)
const PING_COUNT = 12;
const PING_INTERVAL_MS = 47 * 60 * 1000; // 46-50 min cadence
const SCHEDULED_IDS = Array.from({ length: PING_COUNT }, (_, i) => 200 + i);

interface PhoneNotificationInput {
  id: number;
  title: string;
  body: string;
  schedule: { at: Date };
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

  public async sendTestNotification(): Promise<boolean> {
    if (!this.isCapacitorAvailable) return false;
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999,
            title: '📬 Offline alerts are live',
            body: 'Every ~47 min you\u2019re away, you\u2019ll get a different real alert. Details wait for you inside the game.',
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

  /** Builds a rotating pool of DIFFERENT real messages from current state. */
  private buildPool(save: SaveData): { title: string; body: string }[] {
    const p = save.player;
    const weekRef = `Week ${p?.dateWeek || 1}, ${p?.dateYear || 2026}`;
    const name = p?.firstName || 'Star';
    const money = (p?.money || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const fans = (p?.fans || 0).toLocaleString();
    const fame = (p?.fameXp || 0).toLocaleString();
    const items = collectNotificationItems(save);
    const deadlines = items.filter((i) => i.kind === 'DEADLINE');
    const pending = buildRepeatSummary(save);

    const pool: { title: string; body: string }[] = [];

    // Real deadline alerts first (each different)
    deadlines.slice(0, 6).forEach((d) => {
      pool.push({
        title: `📬 ${d.icon} ${d.title}`,
        body: `${d.body} ${weekRef} — details inside the game.`,
      });
    });

    // Stat nudges with REAL current numbers
    pool.push({ title: '🎬 Your career is live', body: `${name}, ${weekRef} is waiting — you're at ${fame} fame, ${fans} fans, ${money}. Come back and keep it moving.` });
    pool.push({ title: '💼 Cash status', body: `Your account: ${money}. A few more good roles and the next big payday is yours. ${weekRef}.` });
    pool.push({ title: '🌟 Fame check', body: `You're at ${fame} Fame XP — every course, release and interview pushes it higher. ${weekRef}.` });
    pool.push({ title: '🎟️ Your fans are waiting', body: `${fans} fans follow your journey — they post, they hype, they wait for your next move. ${weekRef}.` });
    pool.push({ title: '🎥 The cameras are rolling', body: `Your productions are moving without you — check in to keep everything on schedule. ${weekRef}.` });

    // Pending count reminders
    pool.push({ title: '📬 Still waiting for you', body: pending });
    pool.push({ title: '⏰ Deadlines don\u2019t wait', body: pending });

    // Generic come-online prompts (short, no fake content)
    pool.push({ title: `🎬 ${name}, come online`, body: `The next big break is one decision away. ${weekRef}.` });
    pool.push({ title: '📬 New update waiting', body: `Open the game to see what's new — ${weekRef} is live.` });
    pool.push({ title: '✨ Something is ready for you', body: `Check your Notification Center — real offers, bids and deadlines are waiting. ${weekRef}.` });

    return pool;
  }

  /** Schedule ~47-min rotating notifications while the player is away. */
  public async scheduleAwayNotifications() {
    const save = this.latestSave;
    if (!save?.player) return;

    if (save.settings?.offlineNotifications === false) {
      await this.cancelPendingNotifications();
      return;
    }

    if (this.isCapacitorAvailable) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await LocalNotifications.cancel({ notifications: SCHEDULED_IDS.map((id) => ({ id })) });

        const pool = this.buildPool(save);
        const list: PhoneNotificationInput[] = [];

        for (let i = 0; i < PING_COUNT; i++) {
          // Rotate through the pool; wrap + shuffle offset so pings differ
          const msg = pool[(i * 2 + 1) % pool.length] || pool[0];
          const at = new Date(Date.now() + (i + 1) * PING_INTERVAL_MS);
          list.push({ id: 200 + i, title: msg.title, body: msg.body, schedule: { at } });
        }

        await LocalNotifications.schedule({ notifications: list });
        this.scheduledCount = list.length;
        return;
      } catch (e) {
        console.warn('Capacitor LocalNotifications schedule failed', e);
      }
    }
    this.scheduledCount = 0;
  }

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
