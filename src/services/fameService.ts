/**
 * HOLLYWOOD RISING - Fame & Reputation Engine (Phase 6)
 * Calculates actor Fame Levels, XP progress bars, and career reputation.
 */

export interface FameLevelInfo {
  level: number;
  title: string;
  currentXp: number;
  minXp: number;
  maxXp: number;
  progressPct: number;
  xpToNextLevel: number;
  badgeColor: string;
}

export interface LevelReward {
  cash: number;
  energy: number;
  unlocks: string[];
}

export interface FameLevelInfo {
  level: number;
  title: string;
  currentXp: number;
  minXp: number;
  maxXp: number;
  progressPct: number;
  xpToNextLevel: number;
  badgeColor: string;
  reward?: LevelReward;
}

export class FameService {
  /**
   * Calculates detailed level information from total Fame XP.
   */
  public static getFameLevelDetails(fameXp: number): FameLevelInfo {
    const xp = Math.max(0, fameXp || 0);

    if (xp < 250) {
      return {
        level: 1,
        title: 'Unknown',
        currentXp: xp,
        minXp: 0,
        maxXp: 250,
        progressPct: Math.min(100, Math.round((xp / 250) * 100)),
        xpToNextLevel: 250 - xp,
        badgeColor: 'border-gray-500/40 bg-gray-500/20 text-gray-300',
        reward: { cash: 1000, energy: 30, unlocks: ['Basic Auditions', 'Indie Feature Roles', 'Local PR'] },
      };
    } else if (xp < 750) {
      return {
        level: 2,
        title: 'Emerging Talent',
        currentXp: xp,
        minXp: 250,
        maxXp: 750,
        progressPct: Math.min(100, Math.round(((xp - 250) / 500) * 100)),
        xpToNextLevel: 750 - xp,
        badgeColor: 'border-sky-500/40 bg-sky-500/20 text-sky-300',
        reward: { cash: 5000, energy: 50, unlocks: ['TV Guest Stars', 'Talent Agent Representation', 'Principal Film Roles'] },
      };
    } else if (xp < 2000) {
      return {
        level: 3,
        title: 'Recognized Actor',
        currentXp: xp,
        minXp: 750,
        maxXp: 2000,
        progressPct: Math.min(100, Math.round(((xp - 750) / 1250) * 100)),
        xpToNextLevel: 2000 - xp,
        badgeColor: 'border-purple-500/40 bg-purple-500/20 text-purple-300',
        reward: { cash: 15000, energy: 50, unlocks: ['Studio Lead Roles', 'SAG-AFTRA Membership Eligibility', 'Red Carpet World Premieres'] },
      };
    } else if (xp < 5000) {
      return {
        level: 4,
        title: 'Hollywood Star',
        currentXp: xp,
        minXp: 2000,
        maxXp: 5000,
        progressPct: Math.min(100, Math.round(((xp - 2000) / 3000) * 100)),
        xpToNextLevel: 5000 - xp,
        badgeColor: 'border-amber-500/40 bg-amber-500/20 text-amber-300',
        reward: { cash: 50000, energy: 50, unlocks: ['A-List $100M Blockbusters', 'Executive Producer Credits', 'PR Agency Retainers'] },
      };
    } else if (xp < 12000) {
      return {
        level: 5,
        title: 'International Superstar',
        currentXp: xp,
        minXp: 5000,
        maxXp: 12000,
        progressPct: Math.min(100, Math.round(((xp - 5000) / 7000) * 100)),
        xpToNextLevel: 12000 - xp,
        badgeColor: 'border-rose-500/40 bg-rose-500/20 text-rose-300',
        reward: { cash: 200000, energy: 50, unlocks: ['Global Brand Sponsorships', 'Custom Production Studio Banner', 'Franchise Sequel Deals'] },
      };
    } else {
      const legendLevel = 6 + Math.floor((xp - 12000) / 10000);
      const minXp = 12000 + (legendLevel - 6) * 10000;
      const maxXp = minXp + 10000;
      const progressPct = Math.min(100, Math.round(((xp - minXp) / 10000) * 100));
      const xpToNextLevel = maxXp - xp;

      return {
        level: legendLevel,
        title: legendLevel === 6 ? 'Living Legend' : `Living Legend Tier ${legendLevel - 5}`,
        currentXp: xp,
        minXp,
        maxXp,
        progressPct,
        xpToNextLevel,
        badgeColor: 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg shadow-amber-500/20',
        reward: { cash: 500000 * (legendLevel - 5), energy: 50, unlocks: ['Studio Mogul Privileges', 'Lifetime Achievement Trophy', 'Hall of Fame Honors'] },
      };
    }
  }

  /**
   * Returns exact XP values for specific career milestones.
   */
  public static getMilestoneXp(action: 'MOVIE_RELEASE' | 'GUEST_STAR' | 'LEAD_ROLE' | 'OSCAR_NOM' | 'OSCAR_WIN' | 'MAGAZINE' | 'INTERVIEW' | 'MAJOR_AWARD'): number {
    switch (action) {
      case 'MOVIE_RELEASE':
        return 250;
      case 'GUEST_STAR':
        return 80;
      case 'LEAD_ROLE':
        return 300;
      case 'OSCAR_NOM':
        return 500;
      case 'OSCAR_WIN':
        return 1000;
      case 'MAGAZINE':
        return 60;
      case 'INTERVIEW':
        return 40;
      case 'MAJOR_AWARD':
        return 250;
      default:
        return 50;
    }
  }
}
