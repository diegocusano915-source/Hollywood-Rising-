/**
 * HOLLYWOOD RISING - Local Storage Service & Initial Data Generators
 * Phase 1 Grounded Architecture with 3 Save Slots
 */

import {
  SaveData,
  Player,
  CallboardProject,
  ProjectCategory,
  InboxMessage,
  NpcProfile,
  GiftItem,
  GameSettings,
  RoleType,
  PlayerTalents,
} from '../types/game';
import { generateWeeklyCourses } from './actingSchoolDatabase';

const STORAGE_KEY_PREFIX = 'hollywood_rising_slot_';

export const DEFAULT_TALENTS: PlayerTalents = {
  acting: 0,
  voice: 0,
  comedy: 0,
  drama: 0,
  action: 0,
  dancing: 0,
};

export const DEFAULT_PLAYER: Player = {
  id: 'player_001',
  firstName: '',
  lastName: '',
  gender: 'Male',
  age: 21,
  country: 'United States',
  city: 'Los Angeles',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  personality: 'Confident',
  dateWeek: 1,
  dateYear: 2026,
  money: 2500,
  energy: 100,
  maxEnergy: 100,
  fans: 0,
  fameXp: 0,
  moviesCompleted: 0,
  awardsWon: 0,
  leadRolesCount: 0,
  principalRolesCount: 0,
  isUnionMember: false,
  talents: { ...DEFAULT_TALENTS },
  activeCourses: [],
  availableSchoolCourses: [],
  completedCourseIds: [],
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  activeSlot: 1,
  theme: 'Hollywood Gold',
  hasSeenTutorial: false,
};

// 10-15 Gift Store Items
export const GIFT_ITEMS: GiftItem[] = [
  { id: 'gift_1', name: 'Fresh Red Roses', price: 50, iconName: 'Flower2', affinityBoost: 5, description: 'A classic bouquet of crimson roses.' },
  { id: 'gift_2', name: 'Artisan Chocolates', price: 100, iconName: 'Gift', affinityBoost: 8, description: 'Handcrafted Swiss dark truffles.' },
  { id: 'gift_3', name: 'Designer Perfume', price: 250, iconName: 'Sparkles', affinityBoost: 12, description: 'Exclusive French eau de parfum.' },
  { id: 'gift_4', name: 'Rooftop Luxury Dinner', price: 500, iconName: 'Wine', affinityBoost: 20, description: '5-star dinner overlooking Beverly Hills.' },
  { id: 'gift_5', name: 'Italian Leather Bag', price: 1500, iconName: 'ShoppingBag', affinityBoost: 30, description: 'Handcrafted designer handbag.' },
  { id: 'gift_6', name: 'Diamond Earrings', price: 3000, iconName: 'Gem', affinityBoost: 45, description: '18k white gold sparkling studs.' },
  { id: 'gift_7', name: 'Luxury Swiss Watch', price: 7500, iconName: 'Watch', affinityBoost: 60, description: 'Automatic chronograph timepiece.' },
  { id: 'gift_8', name: 'First-Class Paris Vacation', price: 15000, iconName: 'Plane', affinityBoost: 80, description: '7-day romantic getaway in Paris.' },
  { id: 'gift_9', name: 'Italian Sports Car', price: 60000, iconName: 'Car', affinityBoost: 100, description: 'Sleek luxury convertible.' },
  { id: 'gift_10', name: 'Custom Diamond Necklace', price: 100000, iconName: 'Crown', affinityBoost: 120, description: 'One-of-a-kind Hollywood gala piece.' },
];

const MOVIE_TITLES = [
  'Crimson Echo', 'Sunset Boulevard Noir', 'Starlight Symphony', 'Malibu Shadows',
  'Beverly Heist', 'Neon Horizon', 'Chasing Dreams', 'Echoes of Venice',
  'Pacific Crest', 'The Last Applause', 'Velvet Dynasty', 'Silver Screen Secrets',
  'Tinseltown Requiem', 'Golden Hour', 'Ocean Avenue', 'Rodeo Drive Drama',
];

const DIRECTORS = [
  'Christopher Nolan', 'Greta Gerwig', 'Denis Villeneuve', 'Martin Scorsese',
  'Quentin Tarantino', 'Ava DuVernay', 'Guillermo del Toro', 'Steven Spielberg',
];

const STUDIOS = [
  'Paramount Pictures', 'Universal Studios', 'Warner Bros.', 'A24',
  'Searchlight Pictures', 'Sony Pictures', 'Lionsgate', 'Blumhouse',
];

const PRODUCERS = [
  'Jason Blum', 'Kathleen Kennedy', 'Kevin Feige', 'Emma Thomas',
  'Jerry Bruckheimer', 'Gale Anne Hurd', 'Megan Ellison',
];

const GENRES = ['Drama', 'Thriller', 'Action', 'Romance', 'Comedy', 'Sci-Fi', 'Horror', 'Indie'];

const CALLBOARD_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=400',
];

export function getActorTier(fameXp: number): 'Beginner' | 'Rising Actor' | 'Established Star' | 'A-List' {
  if (fameXp >= 800) return 'A-List';
  if (fameXp >= 300) return 'Established Star';
  if (fameXp >= 100) return 'Rising Actor';
  return 'Beginner';
}

export function generateSinglePrincipalRole(playerFameXp: number = 0, seedIndex: number = 0): CallboardProject {
  const tier = getActorTier(playerFameXp);
  const posterUrl = CALLBOARD_POSTERS[Math.floor(Math.random() * CALLBOARD_POSTERS.length)];
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const title = MOVIE_TITLES[Math.floor(Math.random() * MOVIE_TITLES.length)];
  const director = DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)];
  const producer = PRODUCERS[Math.floor(Math.random() * PRODUCERS.length)];

  let salary = 5000;
  let budget = 10000000;
  let studio = 'A24';
  let category: ProjectCategory = 'Feature Film';
  let description = 'Principal dramatic role offering pivotal narrative depth.';
  let roleType: RoleType = Math.random() > 0.5 ? 'Lead' : 'Principal';

  if (tier === 'Beginner') {
    salary = Math.floor(3000 + Math.random() * 5000);
    budget = Math.floor(2000000 + Math.random() * 6000000);
    studio = ['A24', 'Blumhouse', 'Sundance Workshop', 'Indie Syndicate', 'Neon'][Math.floor(Math.random() * 5)];
    category = Math.random() > 0.4 ? 'Independent Film' : 'Feature Film';
    description = `Promising ${category.toLowerCase()} seeking a co-lead principal actor to anchor pivotal dramatic arcs.`;
  } else if (tier === 'Rising Actor') {
    salary = Math.floor(15000 + Math.random() * 30000);
    budget = Math.floor(15000000 + Math.random() * 30000000);
    studio = ['Lionsgate', 'Focus Features', 'Hulu Originals', 'Sony Pictures', 'Netflix'][Math.floor(Math.random() * 5)];
    category = Math.random() > 0.5 ? 'Feature Film' : 'TV Series';
    description = `High-profile studio ${category.toLowerCase()} casting a co-lead principal character with intense screen presence.`;
  } else if (tier === 'Established Star') {
    salary = Math.floor(60000 + Math.random() * 140000);
    budget = Math.floor(50000000 + Math.random() * 90000000);
    studio = ['Warner Bros.', 'Universal Pictures', 'Paramount Pictures', 'HBO Max'][Math.floor(Math.random() * 4)];
    category = 'Feature Film';
    description = `Major theatrical release seeking a marquee principal/lead actor to star opposite A-list talent.`;
  } else { // A-List
    salary = Math.floor(300000 + Math.random() * 1200000);
    budget = Math.floor(150000000 + Math.random() * 200000000);
    studio = ['Marvel Studios', 'Universal Blockbusters', 'Paramount Tentpoles', 'Searchlight Pictures'][Math.floor(Math.random() * 4)];
    category = 'Feature Film';
    description = `Global tentpole blockbuster franchise offering prime awards exposure and worldwide box office backend.`;
    roleType = 'Lead';
  }

  return {
    id: `proj_p_${Date.now()}_${seedIndex}_${Math.random().toString(36).substr(2, 4)}`,
    posterUrl,
    title,
    genre,
    category,
    productionCompany: `${studio} Pictures`,
    studio,
    director,
    producer,
    budget,
    filmingWeeks: Math.floor(4 + Math.random() * 5),
    estimatedReleaseWindow: `Q${Math.floor(1 + Math.random() * 4)} 2027`,
    roleType,
    salary,
    description,
    decisionTimeWeeks: Math.floor(2 + Math.random() * 4),
    requiredFameXp: tier === 'A-List' ? 500 : tier === 'Established Star' ? 200 : tier === 'Rising Actor' ? 50 : 0,
    requiredActing: Math.max(10, Math.floor(playerFameXp / 5)),
    coStars: ['Timothée Chalamet', 'Zendaya', 'Florence Pugh'].slice(0, 2),
    proposedContract: {
      salary,
      backendPercent: roleType === 'Lead' ? 3.0 : 1.5,
      profitSharePercent: roleType === 'Lead' ? 5.0 : 2.0,
      boxOfficeBonus: salary * 2,
    },
  };
}

export function generateSingleSupportingRole(playerFameXp: number = 0, seedIndex: number = 0): CallboardProject {
  const tier = getActorTier(playerFameXp);
  const posterUrl = CALLBOARD_POSTERS[Math.floor(Math.random() * CALLBOARD_POSTERS.length)];
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const title = `${MOVIE_TITLES[Math.floor(Math.random() * MOVIE_TITLES.length)]}`;
  const studio = STUDIOS[Math.floor(Math.random() * STUDIOS.length)];
  const roleType: RoleType = Math.random() > 0.5 ? 'Support' : 'Recurring';

  const salaryMultiplier = tier === 'A-List' ? 10 : tier === 'Established Star' ? 5 : tier === 'Rising Actor' ? 2.5 : 1;
  const salary = Math.floor((2500 + Math.random() * 3500) * salaryMultiplier);
  const budget = Math.floor((5000000 + Math.random() * 10000000) * salaryMultiplier);

  return {
    id: `proj_s_${Date.now()}_${seedIndex}_${Math.random().toString(36).substr(2, 4)}`,
    posterUrl,
    title,
    genre,
    category: Math.random() > 0.5 ? 'Independent Film' : 'TV Series',
    productionCompany: `${studio} Productions`,
    studio,
    director: DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)],
    producer: PRODUCERS[Math.floor(Math.random() * PRODUCERS.length)],
    budget,
    filmingWeeks: Math.floor(2 + Math.random() * 3),
    estimatedReleaseWindow: `Q${Math.floor(1 + Math.random() * 4)} 2027`,
    roleType,
    salary,
    description: `Supporting role delivering crucial key scene performances and ensemble dialogue.`,
    decisionTimeWeeks: Math.floor(2 + Math.random() * 4),
    requiredFameXp: 0,
    requiredActing: 10,
    coStars: ['Adam Driver', 'Margot Robbie'].slice(0, 1),
    proposedContract: {
      salary,
      backendPercent: 0.5,
      profitSharePercent: 1.0,
      boxOfficeBonus: salary,
    },
  };
}

export function generateSingleMinorRole(playerFameXp: number = 0, seedIndex: number = 0): CallboardProject {
  const tier = getActorTier(playerFameXp);
  const posterUrl = CALLBOARD_POSTERS[Math.floor(Math.random() * CALLBOARD_POSTERS.length)];
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const studio = STUDIOS[Math.floor(Math.random() * STUDIOS.length)];
  const categories: ProjectCategory[] = ['Streaming Original', 'TV Series', 'Voice Acting', 'Motion Capture'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const roleType: RoleType = category === 'Voice Acting' ? 'Recurring' : category === 'Motion Capture' ? 'Support' : 'Guest Star';

  const salaryMultiplier = tier === 'A-List' ? 8 : tier === 'Established Star' ? 4 : tier === 'Rising Actor' ? 2 : 1;
  const salary = Math.floor((1200 + Math.random() * 2000) * salaryMultiplier);
  const budget = Math.floor((3000000 + Math.random() * 8000000) * salaryMultiplier);

  return {
    id: `proj_m_${Date.now()}_${seedIndex}_${Math.random().toString(36).substr(2, 4)}`,
    posterUrl,
    title: `${MOVIE_TITLES[Math.floor(Math.random() * MOVIE_TITLES.length)]}`,
    genre,
    category,
    productionCompany: `${studio} Digital`,
    studio,
    director: DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)],
    producer: PRODUCERS[Math.floor(Math.random() * PRODUCERS.length)],
    budget,
    filmingWeeks: Math.floor(1 + Math.random() * 2),
    estimatedReleaseWindow: `Q${Math.floor(1 + Math.random() * 4)} 2027`,
    roleType,
    salary,
    description: `Specialized ${category.toLowerCase()} role calling for dynamic performance in concise shooting schedule.`,
    decisionTimeWeeks: Math.floor(2 + Math.random() * 3),
    requiredFameXp: 0,
    requiredActing: 5,
    proposedContract: {
      salary,
      backendPercent: 0,
      profitSharePercent: 0.5,
      boxOfficeBonus: Math.floor(salary * 0.5),
    },
  };
}

/**
 * MANDATORY FAILSAFE VALIDATION
 * Guarantees every weekly Callboard refresh ALWAYS contains:
 * - Minimum 2 Principal Roles (Lead or Principal)
 * - Minimum 2 Supporting Roles (Support or Recurring)
 * - Minimum 1 Minor / Cameo Role (Guest Star, Cameo, Background, Voice, MoCap)
 */
export function validateAndEnforceCallboardRoster(
  currentProjects: CallboardProject[],
  playerFameXp: number = 0
): CallboardProject[] {
  let roster = [...currentProjects];

  // Count existing role types
  let principalCount = roster.filter(p => p.roleType === 'Lead' || p.roleType === 'Principal').length;
  let supportCount = roster.filter(p => p.roleType === 'Support' || p.roleType === 'Recurring').length;
  let minorCount = roster.filter(p => p.roleType === 'Cameo' || p.roleType === 'Guest Star' || p.roleType === 'Background').length;

  // FAILSAFE 1: Enforce Minimum 2 Principal Roles
  while (principalCount < 2) {
    const newPrincipal = generateSinglePrincipalRole(playerFameXp, roster.length + 1);
    roster.unshift(newPrincipal);
    principalCount++;
  }

  // FAILSAFE 2: Enforce Minimum 2 Supporting Roles
  while (supportCount < 2) {
    const newSupport = generateSingleSupportingRole(playerFameXp, roster.length + 1);
    roster.push(newSupport);
    supportCount++;
  }

  // FAILSAFE 3: Enforce Minimum 1 Minor Role
  while (minorCount < 1) {
    const newMinor = generateSingleMinorRole(playerFameXp, roster.length + 1);
    roster.push(newMinor);
    minorCount++;
  }

  return roster;
}

export function generateCallboardProjects(count: number = 7, playerFameXp: number = 0): CallboardProject[] {
  const projects: CallboardProject[] = [];

  // Always seed initial batch with guaranteed mix
  projects.push(generateSinglePrincipalRole(playerFameXp, 1));
  projects.push(generateSinglePrincipalRole(playerFameXp, 2));
  projects.push(generateSingleSupportingRole(playerFameXp, 3));
  projects.push(generateSingleSupportingRole(playerFameXp, 4));
  projects.push(generateSingleMinorRole(playerFameXp, 5));

  while (projects.length < count) {
    const r = Math.random();
    if (r < 0.4) {
      projects.push(generateSinglePrincipalRole(playerFameXp, projects.length + 1));
    } else if (r < 0.75) {
      projects.push(generateSingleSupportingRole(playerFameXp, projects.length + 1));
    } else {
      projects.push(generateSingleMinorRole(playerFameXp, projects.length + 1));
    }
  }

  // Run mandatory validation filter
  return validateAndEnforceCallboardRoster(projects, playerFameXp);
}

export function generateInitialInbox(): InboxMessage[] {
  return [
    {
      id: 'msg_welcome',
      category: 'TUTORIAL',
      sender: 'Hollywood Talent Guild',
      senderRole: 'Industry Advisor',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      subject: 'Welcome to Hollywood! Core Gameplay Guide',
      body: 'Welcome to Los Angeles! Apply for roles on the Callboard (costs 20 Energy). Track pending callbacks in Auditions, manage bookings in Filming, and aim for SAG Membership ($2,000 + 4 Principal / Lead Roles).',
      date: 'Week 1, 2026',
      read: false,
    },
    {
      id: 'msg_sag_info',
      category: 'FINANCE',
      sender: 'SAG-AFTRA Membership Office',
      senderRole: 'Guild Director',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      subject: 'SAG-AFTRA Membership Qualifications',
      body: 'To unlock professional auditions, major studio access, and residual payments, you must accumulate $2,000 in cash AND complete 4 Principal or Lead Roles in feature or indie films. Both Principal and Lead roles count toward membership.',
      date: 'Week 1, 2026',
      read: false,
    },
  ];
}

export function generateNpcProfiles(count: number = 8): NpcProfile[] {
  const names = [
    'Aria Vance', 'Julian Hayes', 'Sienna Brooks', 'Leo Sterling',
    'Maya Lin', 'Sebastian Cole', 'Camila Reyes', 'Dante Rossi',
    'Gemma Heart', 'Oliver Knight', 'Chloe Bennett', 'Xavier Reed',
  ];
  const occupations = ['Film Director', 'Screenwriter', 'Celebrity Photographer', 'Fashion Designer', 'Cinematographer', 'Stunt Coordinator', 'Indie Producer', 'Talent Agent'];
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  ];

  const profiles: NpcProfile[] = [];

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    profiles.push({
      id: `npc_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
      name,
      avatar: avatars[i % avatars.length],
      gender: i % 2 === 0 ? 'Female' : 'Male',
      age: Math.floor(21 + Math.random() * 12),
      country: 'United States',
      occupation: occupations[i % occupations.length],
      biography: `Passionate ${occupations[i % occupations.length].toLowerCase()} based in West Hollywood. Passionate about art, cinema, and fine dining.`,
      personality: i % 2 === 0 ? 'Charming' : 'Confident',
      lifestyle: 'Active, Hollywood Socialite, Coffee Connoisseur',
      relationshipGoals: 'Long-term partnership with a driven creative.',
      relationshipLevel: 0,
      stage: 'Stranger',
      weeksInCurrentStage: 0,
    });
  }

  return profiles;
}

export interface SaveSlotSummary {
  slotNumber: number;
  customTitle?: string;
  hasData: boolean;
  playerName: string;
  avatarUrl: string;
  year: number;
  week: number;
  fameLevel: string;
  netWorth: number;
  money: number;
  moviesCompleted: number;
  awardsWon: number;
  currentMovie?: string;
  currentStudio?: string;
  lastSavedAt: string;
  hasBackup: boolean;
}

export class StorageService {
  /** Get key for slot */
  private static getSlotKey(slot: number): string {
    return `${STORAGE_KEY_PREFIX}${slot}`;
  }

  /** Get backup key for slot */
  private static getBackupKey(slot: number): string {
    return `${STORAGE_KEY_PREFIX}${slot}_backup`;
  }

  /** Get title key for slot */
  private static getTitleKey(slot: number): string {
    return `${STORAGE_KEY_PREFIX}${slot}_title`;
  }

  /** Get save slot title */
  public static getSlotTitle(slot: number): string {
    return localStorage.getItem(this.getTitleKey(slot)) || `Save Slot ${slot}`;
  }

  /** Set save slot title */
  public static setSlotTitle(slot: number, title: string): void {
    localStorage.setItem(this.getTitleKey(slot), title);
  }

  /** Load save data for active slot */
  public static loadSaveData(slot: number = 1): SaveData {
    try {
      const raw = localStorage.getItem(this.getSlotKey(slot));
      if (raw) {
        const parsed = JSON.parse(raw) as SaveData;
        if (parsed && parsed.player) {
          // Sanitize Phase 2 fields
          if (!parsed.player.talents) {
            parsed.player.talents = { ...DEFAULT_TALENTS };
          } else {
            parsed.player.talents = {
              acting: parsed.player.talents.acting ?? 0,
              voice: parsed.player.talents.voice ?? 0,
              comedy: parsed.player.talents.comedy ?? 0,
              drama: parsed.player.talents.drama ?? 0,
              action: parsed.player.talents.action ?? 0,
              dancing: parsed.player.talents.dancing ?? 0,
            };
          }
          if (!parsed.player.activeCourses) {
            parsed.player.activeCourses = [];
          }
          if (!parsed.player.completedCourseIds) {
            parsed.player.completedCourseIds = [];
          }
          if (!parsed.player.availableSchoolCourses || parsed.player.availableSchoolCourses.length === 0) {
            parsed.player.availableSchoolCourses = generateWeeklyCourses(parsed.player.completedCourseIds);
          }
          if (!parsed.trophies) parsed.trophies = [];
          if (!parsed.awardHistory) parsed.awardHistory = [];
          if (!parsed.careerTimeline) parsed.careerTimeline = [];
          if (parsed.player.fameXp === undefined) parsed.player.fameXp = 0;
          if (parsed.player.industryRespect === undefined) parsed.player.industryRespect = 50;
          if (parsed.player.publicReputation === undefined) parsed.player.publicReputation = 50;
          if (parsed.player.criticReputation === undefined) parsed.player.criticReputation = 50;

          parsed.callboard = validateAndEnforceCallboardRoster(parsed.callboard || [], parsed.player.fameXp || 0);
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`Failed to load slot ${slot}, initializing defaults`, e);
    }
    return this.createNewSaveData(DEFAULT_PLAYER, slot);
  }

  /** Create new save data for slot */
  public static createNewSaveData(player: Player, slot: number = 1): SaveData {
    const newPlayer: Player = {
      ...DEFAULT_PLAYER,
      ...player,
      talents: player.talents ? { ...player.talents } : { ...DEFAULT_TALENTS },
      activeCourses: player.activeCourses || [],
      completedCourseIds: player.completedCourseIds || [],
      availableSchoolCourses: generateWeeklyCourses([]),
    };

    const data: SaveData = {
      version: '1.4.0',
      lastSavedAt: new Date().toISOString(),
      slotNumber: slot,
      player: newPlayer,
      callboard: generateCallboardProjects(5),
      auditions: [],
      bookedProjects: [],
      releasedMovies: [],
      inbox: generateInitialInbox(),
      relationships: generateNpcProfiles(8),
      settings: {
        ...DEFAULT_SETTINGS,
        activeSlot: slot,
      },
    };
    this.saveGameData(data, slot);
    return data;
  }

  /** Save state to localStorage & create backup */
  public static saveGameData(data: SaveData, slot?: number): boolean {
    try {
      const activeSlot = slot || data.slotNumber || 1;
      const key = this.getSlotKey(activeSlot);

      // Create backup before overwrite if current raw exists
      const existing = localStorage.getItem(key);
      if (existing) {
        localStorage.setItem(this.getBackupKey(activeSlot), existing);
      }

      data.lastSavedAt = new Date().toISOString();
      data.slotNumber = activeSlot;
      const json = JSON.stringify(data);
      localStorage.setItem(key, json);
      return true;
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
      return false;
    }
  }

  /** Restore slot from backup */
  public static restoreBackupSave(slot: number): SaveData | null {
    try {
      const backupRaw = localStorage.getItem(this.getBackupKey(slot));
      if (backupRaw) {
        const parsed = JSON.parse(backupRaw) as SaveData;
        if (parsed && parsed.player) {
          localStorage.setItem(this.getSlotKey(slot), backupRaw);
          return parsed;
        }
      }
    } catch (e) {
      console.error(`Failed to restore backup for slot ${slot}`, e);
    }
    return null;
  }

  /** Get summaries for all 5 save slots */
  public static getSaveSlotSummaries(): SaveSlotSummary[] {
    const summaries: SaveSlotSummary[] = [];
    for (let s = 1; s <= 5; s++) {
      const raw = localStorage.getItem(this.getSlotKey(s));
      const hasBackup = !!localStorage.getItem(this.getBackupKey(s));
      const customTitle = this.getSlotTitle(s);

      if (raw) {
        try {
          const parsed = JSON.parse(raw) as SaveData;
          if (parsed && parsed.player) {
            const currentMovie = parsed.bookedProjects?.[0]?.movieTitle || parsed.releasedMovies?.[0]?.movieTitle || 'None';
            const currentStudio = parsed.bookedProjects?.[0]?.studio || 'Independent';

            summaries.push({
              slotNumber: s,
              customTitle,
              hasData: true,
              playerName: `${parsed.player.firstName} ${parsed.player.lastName}`,
              avatarUrl: parsed.player.avatarUrl || DEFAULT_PLAYER.avatarUrl,
              year: parsed.player.dateYear || 2026,
              week: parsed.player.dateWeek || 1,
              fameLevel: getActorTier(parsed.player.fameXp || 0),
              netWorth: parsed.player.netWorth || parsed.player.money || 0,
              money: parsed.player.money || 0,
              moviesCompleted: parsed.player.moviesCompleted || 0,
              awardsWon: parsed.player.awardsWon || 0,
              currentMovie,
              currentStudio,
              lastSavedAt: parsed.lastSavedAt || new Date().toISOString(),
              hasBackup,
            });
            continue;
          }
        } catch (e) {
          console.warn(`Error parsing slot summary for slot ${s}`, e);
        }
      }

      summaries.push({
        slotNumber: s,
        customTitle,
        hasData: false,
        playerName: 'Empty Save Slot',
        avatarUrl: DEFAULT_PLAYER.avatarUrl,
        year: 2026,
        week: 1,
        fameLevel: 'Beginner',
        netWorth: 0,
        money: 0,
        moviesCompleted: 0,
        awardsWon: 0,
        lastSavedAt: '-',
        hasBackup: false,
      });
    }
    return summaries;
  }

  /** Export Save Data as JSON string */
  public static exportSaveToJson(slot: number): string | null {
    try {
      const raw = localStorage.getItem(this.getSlotKey(slot));
      if (!raw) return null;
      // Sanity check JSON
      const parsed = JSON.parse(raw);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.error(`Export save failed for slot ${slot}`, e);
      return null;
    }
  }

  /** Import Save Data from JSON string into target slot */
  public static importSaveFromJson(jsonString: string, targetSlot: number): { success: boolean; message: string; saveData?: SaveData } {
    try {
      const parsed = JSON.parse(jsonString) as SaveData;
      if (!parsed || typeof parsed !== 'object' || !parsed.player || !parsed.player.firstName) {
        return { success: false, message: 'Invalid save file structure. Missing player profile data.' };
      }

      parsed.slotNumber = targetSlot;
      parsed.lastSavedAt = new Date().toISOString();

      const key = this.getSlotKey(targetSlot);
      localStorage.setItem(key, JSON.stringify(parsed));

      return {
        success: true,
        message: `Successfully imported save for ${parsed.player.firstName} ${parsed.player.lastName} into Slot ${targetSlot}!`,
        saveData: parsed,
      };
    } catch (e: any) {
      return { success: false, message: `Failed to parse import JSON: ${e?.message || 'Unknown error'}` };
    }
  }

  /** Delete slot save data */
  public static deleteSaveData(slot: number): SaveData {
    localStorage.removeItem(this.getSlotKey(slot));
    localStorage.removeItem(this.getBackupKey(slot));
    return this.createNewSaveData(DEFAULT_PLAYER, slot);
  }

  /** Reset current slot data completely */
  public static resetSaveData(slot: number = 1): SaveData {
    return this.deleteSaveData(slot);
  }
}
