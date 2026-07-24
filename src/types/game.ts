/**
 * HOLLYWOOD RISING - Core Game Data Models (Phase 1 Grounded)
 */

export type Personality = 'Confident' | 'Funny' | 'Calm' | 'Aggressive' | 'Charming' | 'Mysterious';

export type Gender = 'Male' | 'Female' | 'Non-Binary';

export type RoleType = 'Lead' | 'Principal' | 'Support' | 'Recurring' | 'Guest Star' | 'Cameo' | 'Background';

export type ThemeOption = 'Hollywood Gold' | 'Midnight Blue' | 'Royal Purple' | 'Emerald Green' | 'Crimson Red' | 'Silver';

export type TalentCategory = 'acting' | 'voice' | 'comedy' | 'drama' | 'action' | 'dancing';

export interface PlayerTalents {
  acting: number;  // 0 -> 100
  voice: number;   // 0 -> 100
  comedy: number;  // 0 -> 100
  drama: number;   // 0 -> 100
  action: number;  // 0 -> 100
  dancing: number; // 0 -> 100
}

export interface ActingCourse {
  id: string;
  name: string;
  teacher: string;
  description: string;
  category: TalentCategory;
  cost: number; // Tuitions $150 -> $25,000
  durationWeeks: number; // 1 -> 40 Weeks
  weeklyEnergyCost: number; // 5 -> 30 Energy
  talentReward: {
    talent: TalentCategory;
    amount: number; // +3 -> +25
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite' | 'Masterclass';
  requiresUnionMember: boolean; // Locked behind SAG-AFTRA Membership
}

export interface ActiveCourse {
  id: string;
  courseId: string;
  name: string;
  teacher: string;
  category: TalentCategory;
  talentReward: {
    talent: TalentCategory;
    amount: number;
  };
  totalWeeks: number;
  weeksCompleted: number;
  weeklyEnergyCost: number;
  isPaused: boolean; // True if player lacked weekly energy
  enrolledWeek: number;
  enrolledYear: number;
}

export interface AgentInfo {
  id: string;
  name: string;
  agencyName: string;
  avatarUrl: string;
  commissionPercent: number; // 10% to 15%
  minTalentAverage: number;
  minLeadRoles: number;
  minFameXp: number;
  perks: string;
  signed: boolean;
}

export interface PlayerRepresentation {
  agent?: AgentInfo;
  manager?: {
    id: string;
    name: string;
    company: string;
    commissionPercent: number;
    signed: boolean;
  };
}

export interface PlayerEmpire {
  indieStudioOwned: boolean;
  studioName?: string;
  realEstateUnits: number;
  weeklyBusinessIncome: number;
}

export interface CompletedCourseRecord {
  id: string;
  courseId: string;
  name: string;
  teacher: string;
  category: TalentCategory;
  talentReward: {
    talent: TalentCategory;
    amount: number;
  };
  completionWeek: number;
  completionYear: number;
}

export interface PlayerStats {
  acting: number;
  comedy: number;
  drama: number;
  action: number;
  reputation: number; // 0 to 100
  lookAppeal: number; // 0 to 100
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  country: string;
  city: string;
  avatarUrl: string;
  personality: Personality;
  dateWeek: number; // Starts at week 1
  dateYear: number; // Starts at 2026
  money: number; // e.g. $2,500
  energy: number; // 0 to 100
  maxEnergy: number; // 100
  fans: number; // Starts at 0
  fameXp: number; // Starts at 0 XP
  moviesCompleted: number; // Starts at 0
  awardsWon: number; // Starts at 0
  leadRolesCount: number; // Starts at 0 - REQUIRED FOR SAG MEMBERSHIP (Needs 4)
  principalRolesCount: number; // Starts at 0
  isUnionMember: boolean; // SAG-AFTRA Membership (Locked initially)
  talents: PlayerTalents; // Phase 2: 6 Permanent Talents
  activeCourses: ActiveCourse[]; // Phase 2: Max 2 Active Courses
  availableSchoolCourses?: ActingCourse[]; // Phase 2: 4 Weekly Generated Courses
  completedCourseIds?: string[];
  completedCourseRecords?: CompletedCourseRecord[];
  representation?: PlayerRepresentation;
  empire?: PlayerEmpire;
  datingProfile?: DatingProfile;
  activeRelationshipId?: string;
  weddingVenue?: 'Church' | 'Beach' | 'Luxury Hotel' | 'Private Estate';
  engagementRingValue?: number;
  hasPrenup?: boolean;
  childrenCount?: number;
  childrenSchoolType?: 'Public School' | 'Private School' | 'Boarding School' | 'University';
}

export interface DatingProfile {
  gender: Gender;
  age: number;
  country: string;
  preference: 'Men' | 'Women' | 'Everyone';
  created: boolean;
}

export interface CallboardProject {
  id: string;
  posterUrl: string;
  title: string;
  genre: string;
  productionCompany: string;
  studio: string;
  director: string;
  producer: string;
  budget: number; // e.g., $5,000,000
  filmingWeeks: number; // e.g. 4 weeks
  estimatedReleaseWindow: string; // e.g. "Fall 2026"
  roleType: RoleType;
  salary: number; // e.g. $2,500
  description: string;
  decisionTimeWeeks: number; // Wait duration: 3, 5, 8, 12, 18, 25, 40
}

export interface AuditionApplication {
  id: string;
  projectId: string;
  movieTitle: string;
  posterUrl: string;
  roleType: RoleType;
  salary: number;
  filmingWeeks: number;
  weeksRemaining: number; // Countdown to audition decision
  status: 'Waiting' | 'Casting' | 'Callback' | 'Decision Pending';
  appliedWeek: number;
  appliedYear: number;
}

export interface BookedProject {
  id: string;
  projectId: string;
  movieTitle: string;
  posterUrl: string;
  roleType: RoleType;
  salary: number;
  totalFilmingWeeks: number;
  weeksRemaining: number;
  isFilmingComplete: boolean;
  boostedThisTurn?: boolean;
}

export interface ReleasedMovie {
  id: string;
  movieTitle: string;
  posterUrl: string;
  roleType: RoleType;
  playerEarnings: number;
  openingWeekendGross: number;
  domesticGross: number;
  worldwideGross: number;
  audienceRating: number; // %
  criticRating: number; // %
  boxOfficePosition: number; // #1, #2, etc.
  weeksInCinemas: number;
  awardsWon: number;
  inCinemas: boolean;
}

export type InboxCategory = 'CASTING' | 'RELATIONSHIPS' | 'FINANCE' | 'TUTORIAL' | 'BUSINESS';

export interface InboxMessage {
  id: string;
  category: InboxCategory;
  sender: string;
  senderRole: string;
  senderAvatar: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  actionRequired?: boolean;
}

export type RelationshipStage = 
  | 'Stranger' 
  | 'Match' 
  | 'Chatting' 
  | 'Dating' 
  | 'Exclusive' 
  | 'Boyfriend/Girlfriend' 
  | 'Engaged' 
  | 'Married' 
  | 'Parents';

export interface NpcProfile {
  id: string;
  name: string;
  avatar: string;
  gender: Gender;
  age: number;
  country: string;
  occupation: string;
  biography: string;
  personality: Personality;
  lifestyle: string;
  relationshipGoals: string;
  relationshipLevel: number; // 0 to 100
  stage: RelationshipStage;
  weeksInCurrentStage: number; // Tracking time in stage (e.g. min 104 weeks for dating before engagement)
}

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  iconName: string;
  affinityBoost: number;
  description: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  activeSlot: 1 | 2 | 3;
  theme: ThemeOption;
  hasSeenTutorial: boolean;
}

export interface SaveData {
  version: string;
  lastSavedAt: string;
  slotNumber: 1 | 2 | 3;
  player: Player;
  callboard: CallboardProject[];
  auditions: AuditionApplication[];
  bookedProjects: BookedProject[];
  releasedMovies: ReleasedMovie[];
  inbox: InboxMessage[];
  relationships: NpcProfile[];
  settings: GameSettings;
}
