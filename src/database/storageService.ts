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
  if (fameXp >= 60) return 'Rising Actor';
  return 'Beginner';
}

export function calculatePlayerStarRating(player: Player): number {
  const acting = player.talents?.acting || 0;
  const drama = player.talents?.drama || 0;
  const comedy = player.talents?.comedy || 0;
  const fame = Math.min(40, (player.fameXp || 0) / 15);
  const unionBonus = player.isUnionMember ? 15 : 0;
  const leadBonus = Math.min(20, (player.leadRolesCount || 0) * 4);
  const avgTalent = (acting * 0.4 + drama * 0.3 + comedy * 0.3);
  
  return Math.min(100, Math.max(5, Math.round(avgTalent * 0.4 + fame + unionBonus + leadBonus)));
}

export function generateSinglePrincipalRole(playerFameXp: number = 0, seedIndex: number = 0, franchiseInfo?: { parentTitle: string; part: number; isTv?: boolean; season?: number }): CallboardProject {
  const tier = getActorTier(playerFameXp);
  const posterUrl = CALLBOARD_POSTERS[Math.floor(Math.random() * CALLBOARD_POSTERS.length)];
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const baseTitle = franchiseInfo?.parentTitle || MOVIE_TITLES[Math.floor(Math.random() * MOVIE_TITLES.length)];
  const director = DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)];
  const producer = PRODUCERS[Math.floor(Math.random() * PRODUCERS.length)];

  let title = baseTitle;
  let isFranchise = false;
  let franchisePart = 1;
  let isTvSeries = franchiseInfo?.isTv || false;
  let tvSeason = franchiseInfo?.season || 1;

  if (franchiseInfo) {
    if (franchiseInfo.isTv) {
      isTvSeries = true;
      tvSeason = franchiseInfo.season || 2;
      title = `${baseTitle}: Season ${tvSeason}`;
    } else {
      isFranchise = true;
      franchisePart = franchiseInfo.part || 2;
      const subtitle = franchisePart === 2 ? 'The Sequel' : franchisePart === 3 ? 'Trilogy Finale' : franchisePart === 4 ? 'Resurgence' : 'The Final Chapter';
      title = `${baseTitle} (Part ${franchisePart}: ${subtitle})`;
    }
  }

  let salary = 2500;
  let budget = 1200000;
  let studio = 'Sundance Workshop';
  let category: ProjectCategory = isTvSeries ? 'TV Series' : 'Independent Film';
  let description = 'Indie dramatic feature seeking a committed principal actor.';
  let roleType: RoleType = 'Principal';

  if (tier === 'Beginner') {
    // Realistic Beginner Pay: $1,200 - $3,500
    salary = Math.floor(1200 + Math.random() * 2300);
    budget = Math.floor(600000 + Math.random() * 1800000);
    studio = ['A24', 'Blumhouse', 'Sundance Workshop', 'Indie Syndicate', 'Neon'][Math.floor(Math.random() * 5)];
    category = Math.random() > 0.4 ? 'Independent Film' : 'Short Film';
    description = `Low-budget ${category.toLowerCase()} casting a principal actor for raw, naturalistic dialogue.`;
    roleType = 'Principal';
  } else if (tier === 'Rising Actor') {
    // Rising Pay: $15,000 - $45,000
    salary = Math.floor(15000 + Math.random() * 30000);
    budget = Math.floor(12000000 + Math.random() * 25000000);
    studio = ['Lionsgate', 'Focus Features', 'Hulu Originals', 'Sony Pictures', 'Netflix'][Math.floor(Math.random() * 5)];
    category = isTvSeries ? 'TV Series' : 'Feature Film';
    description = `Studio mid-budget ${category.toLowerCase()} casting a co-lead principal actor with strong charisma.`;
    roleType = Math.random() > 0.4 ? 'Lead' : 'Principal';
  } else if (tier === 'Established Star') {
    // Established Pay: $60,000 - $180,000
    salary = Math.floor(60000 + Math.random() * 120000);
    budget = Math.floor(45000000 + Math.random() * 65000000);
    studio = ['Warner Bros.', 'Universal Pictures', 'Paramount Pictures', 'HBO Max'][Math.floor(Math.random() * 4)];
    category = 'Feature Film';
    description = `Major theatrical production seeking a recognized lead actor for global release.`;
    roleType = 'Lead';
  } else {
    // A-List Franchise Blockbuster: $400,000 - $1,500,000
    salary = Math.floor(400000 + Math.random() * 1100000);
    budget = Math.floor(120000000 + Math.random() * 150000000);
    studio = ['Marvel Studios', 'Universal Blockbusters', 'Paramount Tentpoles', 'Searchlight Pictures'][Math.floor(Math.random() * 4)];
    category = 'Feature Film';
    description = `Tier-1 global theatrical tentpole with worldwide marketing campaign and box office backend.`;
    roleType = 'Lead';
  }

  // Multiplier for Franchise sequels
  if (franchisePart > 1) {
    salary = Math.floor(salary * (1 + (franchisePart - 1) * 0.35));
    budget = Math.floor(budget * (1 + (franchisePart - 1) * 0.4));
  }
  if (isTvSeries && tvSeason > 1) {
    salary = Math.floor(salary * (1 + Math.min(10, tvSeason - 1) * 0.2));
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
    decisionTimeWeeks: Math.floor(2 + Math.random() * 3),
    requiredFameXp: tier === 'A-List' ? 500 : tier === 'Established Star' ? 200 : tier === 'Rising Actor' ? 50 : 0,
    requiredActing: Math.max(10, Math.floor(playerFameXp / 5)),
    coStars: ['Timothée Chalamet', 'Zendaya', 'Florence Pugh'].slice(0, 2),
    isFranchise,
    franchisePart,
    maxFranchisePart: 5,
    isTvSeries,
    tvSeason,
    maxTvSeason: 15,
    isSequel: franchisePart > 1 || tvSeason > 1,
    parentMovieTitle: baseTitle,
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

  let salary = 800;
  let budget = 400000;
  if (tier === 'Beginner') {
    salary = Math.floor(750 + Math.random() * 1200);
    budget = Math.floor(250000 + Math.random() * 800000);
  } else if (tier === 'Rising Actor') {
    salary = Math.floor(4500 + Math.random() * 12000);
    budget = Math.floor(5000000 + Math.random() * 15000000);
  } else {
    salary = Math.floor(25000 + Math.random() * 50000);
    budget = Math.floor(30000000 + Math.random() * 60000000);
  }

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
    description: `Supporting role delivering key dramatic scenes and ensemble dialogue.`,
    decisionTimeWeeks: Math.floor(2 + Math.random() * 3),
    requiredFameXp: tier === 'A-List' ? 250 : tier === 'Established Star' ? 100 : 0,
    requiredActing: 0,
  };
}

export function generateSingleMinorRole(playerFameXp: number = 0, seedIndex: number = 0): CallboardProject {
  const posterUrl = CALLBOARD_POSTERS[Math.floor(Math.random() * CALLBOARD_POSTERS.length)];
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const title = `${MOVIE_TITLES[Math.floor(Math.random() * MOVIE_TITLES.length)]}`;
  const studio = ['Indie Lab', 'Film School Showcase', 'Commercial Agency', 'Web Series Lab'][Math.floor(Math.random() * 4)];
  const roleType: RoleType = Math.random() > 0.5 ? 'Cameo' : 'Background';
  const salary = Math.floor(300 + Math.random() * 500);
  const budget = Math.floor(50000 + Math.random() * 200000);

  return {
    id: `proj_m_${Date.now()}_${seedIndex}_${Math.random().toString(36).substr(2, 4)}`,
    posterUrl,
    title,
    genre,
    category: 'Commercial / Web',
    productionCompany: `${studio}`,
    studio,
    director: 'Independent Filmmaker',
    producer: 'Line Producer',
    budget,
    filmingWeeks: 1,
    estimatedReleaseWindow: 'Next Month',
    roleType,
    salary,
    description: 'Minor commercial or background day-player role. Ideal for beginners building early experience.',
    decisionTimeWeeks: 1,
    requiredFameXp: 0,
    requiredActing: 0,
  };
}

/**
 * MANDATORY FAILSAFE VALIDATION - UPDATED 10-25 ENDLESS POOL, NO FAKE
 * Guarantees every weekly Callboard refresh ALWAYS contains:
 * - 10 to 25 total movies/series (endless pool)
 * - Minimum 3-5 Principal Roles (Lead or Principal) - above 10 total
 * - No fake simulation - all real generated projects
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

  // FAILSAFE 1: Enforce Minimum 3-5 Principal Roles (random 3-5)
  const targetPrincipal = 3 + Math.floor(Math.random() * 3); // 3-5
  while (principalCount < targetPrincipal) {
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

  // ENSURE 10-25 total - endless pool, no fake simulation
  const targetTotal = 20 + Math.floor(Math.random() * 6); // 20-25 as requested
  while (roster.length < 10) {
    const r = Math.random();
    if (r < 0.5) {
      roster.push(generateSinglePrincipalRole(playerFameXp, roster.length + 1));
    } else if (r < 0.8) {
      roster.push(generateSingleSupportingRole(playerFameXp, roster.length + 1));
    } else {
      roster.push(generateSingleMinorRole(playerFameXp, roster.length + 1));
    }
  }
  // Trim if over 25 (keep endless but cap at 25)
  if (roster.length > 25) {
    roster = roster.slice(0, 25);
  }
  // Shuffle for variety
  for (let i = roster.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roster[i], roster[j]] = [roster[j], roster[i]];
  }

  return roster;
}

export function generateCallboardProjects(count: number = 20 + Math.floor(Math.random() * 6), playerFameXp: number = 0): CallboardProject[] { // 20-25 endless pool as requested
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
      hasCreatedCharacter: Boolean(newPlayer.firstName && newPlayer.firstName.trim().length > 0 && newPlayer.firstName !== 'Jordan'),
      player: newPlayer,
      callboard: generateCallboardProjects(20 + Math.floor(Math.random() * 6)), // 20-25 initial as requested
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
