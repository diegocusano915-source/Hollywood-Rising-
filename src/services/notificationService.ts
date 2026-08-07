/**
 * HOLLYWOOD RISING - Local Notification & Player Re-Engagement Service
 * Automatically schedules 10-15 engaging Hollywood industry notifications
 * when the player is away from the game for too long (2h, 6h, 12h, 24h, 48h, 3d, 5d, 7d).
 * Supports both Capacitor Native Android LocalNotifications and Web Notification API.
 */

import { Player } from '../types/game';

export interface HollywoodNotification {
  id: number;
  title: string;
  body: string;
  delayHours: number;
  iconName: string;
}

export const HOLLYWOOD_RE_ENGAGEMENT_NOTIFICATIONS: HollywoodNotification[] = [
  {
    id: 101,
    title: '🎬 Urgent Casting Callback!',
    body: "Christopher Nolan's casting director just sent an urgent callback script! Check your Hollywood Inbox before submissions close.",
    delayHours: 2,
    iconName: 'clapperboard',
  },
  {
    id: 102,
    title: '⚡ Energy Fully Recharged!',
    body: 'Your actor energy is back at 100/100! Your next feature film scene is ready to shoot on the studio lot.',
    delayHours: 4,
    iconName: 'zap',
  },
  {
    id: 103,
    title: '💰 Box Office Royalty Deposit!',
    body: 'Your theatrical release crossed $45,000,000! Collect your box office royalties, salary residuals and backend payouts.',
    delayHours: 8,
    iconName: 'dollar',
  },
  {
    id: 104,
    title: '📰 Hollywood Insider Front-Page Story!',
    body: 'Variety & Hollywood Insider just published a breaking trade story about your character! Check what film critics are saying.',
    delayHours: 12,
    iconName: 'newspaper',
  },
  {
    id: 105,
    title: '🌟 Academy Awards Campaign Notice!',
    body: 'Oscar voting opens in 48 hours! Launch your For Your Consideration (FYC) trade advertising blitz now.',
    delayHours: 24,
    iconName: 'award',
  },
  {
    id: 106,
    title: '🤝 Luxury Brand Deal Proposal!',
    body: 'Balenciaga and Rolex sent multi-million dollar endorsement contracts to your Hollywood Inbox!',
    delayHours: 36,
    iconName: 'handshake',
  },
  {
    id: 107,
    title: '👑 Conglomerate Dividend Payouts!',
    body: 'Your commercial real estate, film lots and business ventures generated weekly profits. Collect your mogul dividend cash!',
    delayHours: 48,
    iconName: 'crown',
  },
  {
    id: 108,
    title: '⚔️ Hollywood Rivalry Alert!',
    body: 'Your Hollywood rival just challenged your opening weekend box office numbers in a viral Variety magazine interview!',
    delayHours: 60,
    iconName: 'swords',
  },
  {
    id: 109,
    title: '💌 Romance & Dating Update!',
    body: 'Your partner sent a surprise luxury anniversary gift and invited you to a private dinner at Chateau Marmont tonight!',
    delayHours: 72,
    iconName: 'heart',
  },
  {
    id: 110,
    title: '🏛️ SAG-AFTRA Guild Notice!',
    body: 'You have pending guild pension contributions and health plan benefits ready for review at the union headquarters.',
    delayHours: 96,
    iconName: 'shield',
  },
  {
    id: 111,
    title: '📈 Web3 Crypto & Stock Bull Market!',
    body: 'HollywoodCoin and entertainment stocks entered a massive Bull Market cycle! Audit your portfolio valuations.',
    delayHours: 120,
    iconName: 'trending-up',
  },
  {
    id: 112,
    title: '🎟️ Red Carpet World Premiere!',
    body: 'The paparazzi and luxury limousine are waiting outside your Bel-Air estate for tonight\'s world premiere screening!',
    delayHours: 144,
    iconName: 'sparkles',
  },
  {
    id: 113,
    title: '🎓 Acting Academy Masterclass Open!',
    body: 'Conservatory enrollment for masterclasses in Method Acting and Stage Stunts is now open for this semester.',
    delayHours: 168,
    iconName: 'graduation-cap',
  },
  {
    id: 114,
    title: '📣 Paparazzi PR Crisis Alert!',
    body: 'Behind-the-scenes footage leaked on Sunset Boulevard! Work with your PR agency to issue an official press statement.',
    delayHours: 192,
    iconName: 'megaphone',
  },
  {
    id: 115,
    title: '🏆 Hollywood Mogul Opportunity!',
    body: 'A commercial production studio lot is up for private acquisition. Expand your Hollywood empire today!',
    delayHours: 216,
    iconName: 'building',
  },
];

class NotificationService {
  private hasRequestedPermission: boolean = false;
  private isCapacitorAvailable: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    if (typeof window === 'undefined') return;

    // Check Capacitor native plugin availability
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      if (LocalNotifications) {
        this.isCapacitorAvailable = true;
      }
    } catch {
      this.isCapacitorAvailable = false;
    }

    // Attach visibility listener to automatically schedule re-engagement notifications when player leaves
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

  /** Request notification permissions from user on first launch */
  public async requestPermissions(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    this.hasRequestedPermission = true;

    // Try Capacitor Native
    if (this.isCapacitorAvailable) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display === 'granted') return true;
      } catch {}
    }

    // Try Web Notification API
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      } catch {}
    }

    return false;
  }

  /** Schedules the 15 engaging notifications when player backgrounds the game */
  public async scheduleAwayNotifications(player?: Player) {
    const actorName = player?.firstName ? `${player.firstName} ${player.lastName}` : 'Hollywood Star';

    // 1. Try Native Capacitor LocalNotifications
    if (this.isCapacitorAvailable) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        
        // Cancel existing pending notifications
        await LocalNotifications.cancel({
          notifications: HOLLYWOOD_RE_ENGAGEMENT_NOTIFICATIONS.map((n) => ({ id: n.id })),
        });

        // Schedule 15 staggered notifications
        const notificationsToSchedule = HOLLYWOOD_RE_ENGAGEMENT_NOTIFICATIONS.map((n) => {
          const scheduleDate = new Date(Date.now() + n.delayHours * 3600 * 1000);
          return {
            id: n.id,
            title: n.title,
            body: n.body.replace('your character', actorName),
            schedule: { at: scheduleDate },
            sound: 'default',
            smallIcon: 'ic_launcher',
            actionTypeId: 'OPEN_GAME',
            extra: { playerName: actorName },
          };
        });

        await LocalNotifications.schedule({ notifications: notificationsToSchedule });
        return;
      } catch (e) {
        console.warn('Capacitor LocalNotifications schedule failed, falling back to Web API', e);
      }
    }

    // 2. Web Notification fallback
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        // Schedule in-browser timeouts for current active session
        HOLLYWOOD_RE_ENGAGEMENT_NOTIFICATIONS.slice(0, 3).forEach((n) => {
          const delayMs = n.delayHours * 3600 * 1000;
          if (delayMs <= 86400000) { // Within 24h
            setTimeout(() => {
              try {
                new Notification(n.title, {
                  body: n.body.replace('your character', actorName),
                  icon: '/icon.png',
                });
              } catch {}
            }, delayMs);
          }
        });
      } catch {}
    }
  }

  /** Clears notifications when player returns online */
  public async cancelPendingNotifications() {
    if (this.isCapacitorAvailable) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        await LocalNotifications.cancel({
          notifications: HOLLYWOOD_RE_ENGAGEMENT_NOTIFICATIONS.map((n) => ({ id: n.id })),
        });
      } catch {}
    }
  }
}

export const notificationService = new NotificationService();
