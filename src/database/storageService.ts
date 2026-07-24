/**
 * HOLLYWOOD RISING - Local Storage Service & Initial Data Generators
 * Phase 1 Grounded Architecture with 3 Save Slots
 */

import {
  SaveData,
  Player,
  CallboardProject,
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
  firstName: 'Jordan',
  lastName: 'Vance',
  gender: 'Male',
  age: 21,
  country: 'United States',
  city: 'Los Angeles',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
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

export function generateCallboardProjects(count: number = 5): CallboardProject[] {
  const roleTypes: RoleType[] = ['Lead', 'Principal', 'Support', 'Recurring', 'Guest Star', 'Cameo', 'Background'];
  const posterImages = [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
  ];

  const decisionTimes = [3, 5, 8, 12, 18, 25, 40];

  const projects: CallboardProject[] = [];

  for (let i = 0; i < count; i++) {
    const title = MOVIE_TITLES[Math.floor(Math.random() * MOVIE_TITLES.length)];
    const roleType = roleTypes[Math.floor(Math.random() * roleTypes.length)];
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const studio = STUDIOS[Math.floor(Math.random() * STUDIOS.length)];

    let salary = 1200;
    let budget = 3500000;
    let filmingWeeks = 4;

    if (roleType === 'Lead') {
      salary = Math.floor(15000 + Math.random() * 35000);
      budget = Math.floor(25000000 + Math.random() * 75000000);
      filmingWeeks = Math.floor(6 + Math.random() * 6);
    } else if (roleType === 'Principal') {
      salary = Math.floor(8000 + Math.random() * 12000);
      budget = Math.floor(15000000 + Math.random() * 35000000);
      filmingWeeks = Math.floor(4 + Math.random() * 4);
    } else if (roleType === 'Support') {
      salary = Math.floor(4000 + Math.random() * 6000);
      budget = Math.floor(5000000 + Math.random() * 15000000);
      filmingWeeks = Math.floor(3 + Math.random() * 3);
    } else if (roleType === 'Recurring' || roleType === 'Guest Star') {
      salary = Math.floor(2500 + Math.random() * 3500);
      budget = Math.floor(3000000 + Math.random() * 8000000);
      filmingWeeks = Math.floor(2 + Math.random() * 3);
    } else { // Cameo / Background
      salary = Math.floor(500 + Math.random() * 1000);
      budget = Math.floor(1000000 + Math.random() * 3000000);
      filmingWeeks = Math.floor(1 + Math.random() * 2);
    }

    const decisionTimeWeeks = decisionTimes[Math.floor(Math.random() * decisionTimes.length)];

    projects.push({
      id: `proj_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
      posterUrl: posterImages[i % posterImages.length],
      title: `${title}`,
      genre,
      productionCompany: `${studio} Productions`,
      studio,
      director: DIRECTORS[Math.floor(Math.random() * DIRECTORS.length)],
      producer: PRODUCERS[Math.floor(Math.random() * PRODUCERS.length)],
      budget,
      filmingWeeks,
      estimatedReleaseWindow: `Q${Math.floor(1 + Math.random() * 4)} 2027`,
      roleType,
      salary,
      description: `A compelling ${genre.toLowerCase()} production seeking dedicated actors to bring authentic performance to ${title}.`,
      decisionTimeWeeks,
    });
  }

  return projects;
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
      body: 'Welcome to Los Angeles! Apply for roles on the Callboard (costs 20 Energy). Track pending callbacks in Auditions, manage bookings in Filming, and aim for SAG Membership ($2,000 + 4 Lead Roles).',
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
      body: 'To unlock professional auditions, major studio access, and residual payments, you must accumulate $2,000 in cash AND complete 4 Lead Roles in feature or indie films. Principal or Support roles do NOT count toward membership.',
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

export class StorageService {
  /** Get key for slot */
  private static getSlotKey(slot: 1 | 2 | 3): string {
    return `${STORAGE_KEY_PREFIX}${slot}`;
  }

  /** Load save data for active slot */
  public static loadSaveData(slot: 1 | 2 | 3 = 1): SaveData {
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
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`Failed to load slot ${slot}, initializing defaults`, e);
    }
    return this.createNewSaveData(DEFAULT_PLAYER, slot);
  }

  /** Create new save data for slot */
  public static createNewSaveData(player: Player, slot: 1 | 2 | 3 = 1): SaveData {
    const newPlayer: Player = {
      ...DEFAULT_PLAYER,
      ...player,
      talents: player.talents ? { ...player.talents } : { ...DEFAULT_TALENTS },
      activeCourses: player.activeCourses || [],
      completedCourseIds: player.completedCourseIds || [],
      availableSchoolCourses: generateWeeklyCourses([]),
    };

    const data: SaveData = {
      version: '1.0.0',
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

  /** Save state to localStorage */
  public static saveGameData(data: SaveData, slot?: 1 | 2 | 3): boolean {
    try {
      const activeSlot = slot || data.slotNumber || 1;
      data.lastSavedAt = new Date().toISOString();
      data.slotNumber = activeSlot;
      localStorage.setItem(this.getSlotKey(activeSlot), JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
      return false;
    }
  }

  /** Delete slot save data */
  public static deleteSaveData(slot: 1 | 2 | 3): SaveData {
    localStorage.removeItem(this.getSlotKey(slot));
    return this.createNewSaveData(DEFAULT_PLAYER, slot);
  }

  /** Reset current slot data completely */
  public static resetSaveData(slot: 1 | 2 | 3 = 1): SaveData {
    return this.deleteSaveData(slot);
  }
}
