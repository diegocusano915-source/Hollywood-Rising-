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
  netWorth?: number;
  industryRespect?: number; // 0-100
  publicReputation?: number; // 0-100
  criticReputation?: number; // 0-100
}

export interface DatingProfile {
  gender: Gender;
  age: number;
  country: string;
  preference: 'Men' | 'Women' | 'Everyone';
  created: boolean;
}

export type ProjectCategory =
  | 'Feature Film'
  | 'Streaming Original'
  | 'Independent Film'
  | 'TV Series'
  | 'Voice Acting'
  | 'Motion Capture'
  | 'Cameo';

export interface ProposedContract {
  salary: number;
  backendPercent: number;
  profitSharePercent: number;
  boxOfficeBonus: number;
}

export interface CallboardProject {
  id: string;
  posterUrl: string;
  title: string;
  genre: string;
  category?: ProjectCategory;
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
  requiredFameXp?: number;
  requiredActing?: number;
  coStars?: string[];
  isSequel?: boolean;
  parentMovieTitle?: string;
  isFranchise?: boolean;
  franchisePart?: number;
  maxFranchisePart?: number;
  isTvSeries?: boolean;
  tvSeason?: number;
  maxTvSeason?: number;
  proposedContract?: ProposedContract;
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
  studio?: string;
  director?: string;
}

export type ProductionStage =
  | 'Pending Negotiation'
  | 'Contract Signed'
  | 'Pre-Production'
  | 'Filming'
  | 'Post Production'
  | 'Editing'
  | 'Color Grading'
  | 'Sound Mixing'
  | 'Visual Effects'
  | 'Marketing Campaign'
  | 'Distribution Preparation'
  | 'Ready for Release'
  | 'Marketing'
  | 'Premiere'
  | 'Released'
  | 'Completed';

export interface ReleaseConfig {
  releaseWeekOffset: number; // 0 = immediate, 1 = next week, etc.
  releaseWeekText: string;
  marketingBudget: number;
  marketingName: string;
  marketingHypeBonus: number;
  screens: number;
  screenOptionName: string;
  screenCost: number;
  screenMultiplier: number;
  premiereType: 'No Premiere' | 'Local Premiere' | 'Standard Premiere' | 'Hollywood Red Carpet' | 'World Premiere';
  premiereCost: number;
  premiereHypeBonus: number;
}

export interface ProductionLogEvent {
  week: number;
  year: number;
  stage: string;
  eventText: string;
  type: 'info' | 'warning' | 'success' | 'delay' | 'milestone';
}

export interface BookedProject {
  id: string;
  projectId: string;
  movieTitle: string;
  posterUrl: string;
  roleType: RoleType;
  category?: ProjectCategory;
  salary: number;
  totalFilmingWeeks: number;
  weeksRemaining: number;
  isFilmingComplete: boolean;
  boostedThisTurn?: boolean;
  studio?: string;
  director?: string;
  genre?: string;
  budget?: number;
  location?: string;
  backendPercent?: number;
  profitSharePercent?: number;
  boxOfficeBonus?: number;
  status?: ProductionStage;
  stageWeeksRemaining?: number;
  totalStageWeeks?: number;
  productionLog?: ProductionLogEvent[];
  marketingCampaign?: 'Small' | 'Medium' | 'Blockbuster' | 'Luxury Premiere';
  hypeScore?: number;
  trailerViews?: number;
  socialBuzz?: number;
  directorSatisfaction?: 'Excellent' | 'Good' | 'Neutral' | 'Concerned' | 'Disappointed' | 'Furious';
  directorTrust?: number;
  studioConfidence?: number;
  isBlacklistedByDirector?: boolean;
  weeklyPerformance?: number;
  promotionLevel?: number;
  castChemistry?: number;
  activeRisk?: 'Low' | 'Moderate' | 'High' | 'Critical';
  boxOfficeGross?: number;
  criticRating?: number;
  awardBuzz?: 'Low' | 'Moderate' | 'High' | 'Oscar Frontrunner';
  coStars?: string[];
  testScreeningScore?: number;
  isTvSeries?: boolean;
  tvSeason?: number;
  isSequel?: boolean;
  parentMovieTitle?: string;
}

export interface ReleasedMovie {
  id: string;
  movieTitle: string;
  posterUrl: string;
  roleType: RoleType;
  category?: ProjectCategory;
  playerEarnings: number;
  openingWeekendGross: number;
  domesticGross: number;
  worldwideGross: number;
  audienceRating: number; // %
  criticRating: number; // %
  boxOfficePosition: number; // #1, #2, etc.
  weeksInCinemas: number;
  awardsWon: number;
  awardsNominated?: number;
  streamingRevenue?: number;
  lifetimeRoyalties?: number;
  internationalGross?: number;
  fycCampaignLevel?: 'None' | 'Ads' | 'Screenings' | 'Dinners' | 'Blitz';
  fycCampaignSpent?: number;
  inCinemas: boolean;
  studio?: string;
  director?: string;
  genre?: string;
  budget?: number;
  releaseWeek?: number;
  releaseYear?: number;
  cast?: string[];
  marketingCampaign?: string;
  isSequel?: boolean;
  parentMovieTitle?: string;
  isFranchise?: boolean;
  franchisePart?: number;
  isTvSeries?: boolean;
  tvSeason?: number;
  coStarNames?: string[];
  criticScore?: number;
  audienceScore?: number;
  boxOfficeGross?: number;
}

export interface TrophyItem {
  id: string;
  awardType:
    | 'Academy Award'
    | 'Golden Globe'
    | 'BAFTA'
    | 'SAG Award'
    | 'Emmy'
    | 'Critics Choice'
    | 'Independent Spirit'
    | 'Festival Award'
    | 'Lifetime Achievement';
  category: string; // e.g., 'Best Actor in a Leading Role'
  year: number;
  movieTitle: string;
  studio?: string;
  director?: string;
  speechStyle?: 'Funny' | 'Emotional' | 'Political' | 'Short' | 'Long';
  speechQuote?: string;
  photoUrl?: string;
  dateText?: string;
}

export interface AwardRecord {
  id: string;
  year: number;
  eventName:
    | 'Oscars'
    | 'Golden Globes'
    | 'BAFTA'
    | 'SAG Awards'
    | 'Emmys'
    | 'Critics Choice'
    | 'Independent Spirit';
  category: string;
  winnerTitle: string;
  winnerName: string;
  nominees?: { title: string; name: string; isPlayer: boolean }[];
  isPlayerWinner?: boolean;
  isPlayerNominated?: boolean;
  movieTitle?: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  week: number;
  category: 'ROLE' | 'RELEASE' | 'AWARD' | 'EMPIRE' | 'RELATIONSHIP' | 'MILESTONE';
  title: string;
  description: string;
  iconType?: string;
  movieTitle?: string;
}

export type InboxCategory =
  | 'ALL'
  | 'CAREER'
  | 'BUSINESS'
  | 'SOCIAL'
  | 'MEDIA'
  | 'FINANCE'
  | 'LEGAL'
  | 'AWARDS'
  | 'PERSONAL'
  | 'SYSTEM'
  | 'EVENTS'
  // Legacy mappings
  | 'CASTING'
  | 'RELATIONSHIPS'
  | 'TUTORIAL';

export interface InboxMessage {
  id: string;
  category: InboxCategory;
  sender: string;
  senderRole?: string;
  senderAvatar?: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  actionRequired?: boolean;
  archived?: boolean;
  dateWeek?: number;
  dateYear?: number;
}

export type RelationshipStage = 
  | 'Stranger' 
  | 'Acquaintance'
  | 'Friend'
  | 'Close Friend'
  | 'Dating' 
  | 'Exclusive' 
  | 'Partner' 
  | 'Engaged' 
  | 'Married' 
  | 'Family'
  | 'Match' 
  | 'Chatting' 
  | 'Boyfriend/Girlfriend' 
  | 'Parents';

export type NpcTrait = 
  | 'Romantic'
  | 'Ambitious'
  | 'Funny'
  | 'Private'
  | 'Family-Oriented'
  | 'Career-Focused'
  | 'Introverted'
  | 'Extroverted'
  | 'Confident'
  | 'Jealous'
  | 'Kind'
  | 'Serious'
  | 'Independent';

export interface RelationshipHistoryEvent {
  id: string;
  type: 'MEETING' | 'DATE' | 'ACTIVITY' | 'STAGE_CHANGE' | 'PRENUP' | 'PROPOSAL' | 'WEDDING' | 'CHILD' | 'ARGUMENT' | 'BREAKUP' | 'EVENT';
  title: string;
  description: string;
  timestamp: string;
  impact?: string;
}

export interface PrenupTerms {
  protectCash: boolean;
  protectSavings: boolean;
  protectBusinesses: boolean;
  protectRealEstate: boolean;
  protectInvestments: boolean;
  protectRoyalties: boolean;
  protectLuxuryAssets: boolean;
  protectFutureEarnings: boolean;
  protectInheritance: boolean;
  protectDebtResponsibility: boolean;
  lawyerReviewed?: boolean;
  status: 'NOT_STARTED' | 'DRAFTED' | 'LAWYER_REVIEW' | 'AGREED' | 'REJECTED' | 'SKIPPED';
  npcNotes?: string;
}

export interface ChildRecord {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  age: number;
  schoolType: 'Public School' | 'Private School' | 'Boarding School' | 'University';
  personality: string;
  birthYear: number;
  birthWeek: number;
}

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
  personalityTraits?: NpcTrait[];
  lifestyle: string;
  relationshipGoals: string;
  relationshipLevel: number; // 0 to 100 (Affinity)
  trustLevel?: number; // 0 to 100
  compatibilityScore?: number; // 0 to 100
  stage: RelationshipStage;
  weeksInCurrentStage: number; // Tracking time in stage
  matchStatus?: 'ACCEPTED' | 'DECLINED' | 'IGNORED' | 'BUSY' | 'ALREADY_DATING' | 'CAREER_FOCUSED' | 'NOT_INTERESTED' | 'LOW_COMPATIBILITY';
  matchDeclineReason?: string;
  prenupTerms?: PrenupTerms;
  history?: RelationshipHistoryEvent[];
  children?: ChildRecord[];
  lastInteractionWeek?: number;
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
  activeSlot: number;
  theme: ThemeOption;
  hasSeenTutorial: boolean;
  deviceFrameMode?: 'phone' | 'tablet' | 'foldable' | 'responsive';
}

export interface WeeklyRecapData {
  week: number;
  year: number;
  dateRangeText: string;
  energyRestored: number;
  expensesPaid: number;

  // CAREER
  career: {
    movies: string[];
    series: string[];
    auditions: string[];
    castingResults: string[];
    filmingProgress: string[];
    training: string[];
  };

  // FINANCE
  finance: {
    income: number;
    expenses: number;
    salary: number;
    royalties: number;
    residuals?: number;
    backend?: number;
    streamingRoyalties?: number;
    merchandiseRoyalties?: number;
    syndicationRoyalties?: number;
    internationalRoyalties?: number;
    businessIncome: number;
    propertyIncome: number;
    boxOfficeWeeklyGross?: number;
    endorsementIncome?: number;
    taxes: number;
    netWeeklyChange: number;
  };

  // SOCIAL
  social: {
    followersGained: number;
    following: number;
    posts: string[];
    trending: string[];
    fanGrowth: number;
    reputationChanges: string[];
  };

  // WORLD
  world: {
    news: string[];
    tv: string[];
    radio: string[];
    streaming: string[];
    awards: string[];
    industryEvents: string[];
  };

  // NETWORK
  network: {
    bank: string[];
    savings: string[];
    properties: string[];
    vehicles: string[];
    security: string[];
    vault: string[];
    forbes: string[];
  };

  // EMPIRE
  empire: {
    businesses: string[];
    holdingCompany: string[];
    eliteClub: string[];
    realEstate: string[];
    board: string[];
    expansion: string[];
  };

  // REPRESENTATION
  representation: {
    pr: string[];
    contracts: string[];
    media: string[];
    brandDeals: string[];
    sponsorships: string[];
    lawFirm: string[];
  };

  // COMING NEXT WEEK
  comingNextWeek: {
    upcomingAuditions: string[];
    moviePremieres: string[];
    awardShows: string[];
    contractDeadlines: string[];
    businessLaunches: string[];
    propertyPayments: string[];
  };
}

export interface SaveData {
  version: string;
  lastSavedAt: string;
  slotNumber: number;
  hasCreatedCharacter?: boolean;
  player: Player;
  callboard: CallboardProject[];
  auditions: AuditionApplication[];
  bookedProjects: BookedProject[];
  releasedMovies: ReleasedMovie[];
  inbox: InboxMessage[];
  relationships: NpcProfile[];
  settings: GameSettings;
  trophies?: TrophyItem[];
  awardHistory?: AwardRecord[];
  careerTimeline?: TimelineEvent[];
}

