/**
 * HOLLYWOOD RISING - World System Data Models (Phase 3)
 */

export type WorldFeatureId =
  | 'BOX_OFFICE'
  | 'REPRESENTATION'
  | 'STREAMING'
  | 'BANKROLL'
  | 'TV_STATIONS'
  | 'RADIO_STATIONS'
  | 'PERSONAL_STUDIO'
  | 'SOCIALS'
  | 'AWARDS'
  | 'LAWYERS'
  | 'STOCK_COIN'
  | 'STAR_STOCKS'
  | 'FILMING_LOCATIONS'
  | 'ENDORSEMENTS'
  | 'STUDIO_RELATIONSHIPS';

export interface BoxOfficeItem {
  id: string;
  title: string;
  type: 'Movie' | 'Series';
  currentRank: number;
  previousRank: number | null;
  weeklyGross: number;
  domesticGross: number;
  internationalGross: number;
  worldwideGross: number;
  lifetimeGross: number;
  weeksReleased: number;
  weeksInRelease?: number; // legacy alias
  grossWorldwide?: number; // legacy alias
  grossDomestic?: number; // legacy alias
  grossInternational?: number; // legacy alias
  movement: 'NEW' | 'UP' | 'DOWN' | 'STABLE' | 'OUT' | 'RE-ENTRY';
  trend?: 'UP' | 'DOWN' | 'STABLE';
  studio: string;
  genres: string[];
  posterUrl: string;
  isPlayerMovie?: boolean;
  playerMovieId?: string;
  budget?: number;
  marketing?: number;
  criticRating?: number;
  audienceRating?: number;
  wordOfMouth?: number;
  inTheaters?: boolean;
  releaseWeek?: number;
  releaseYear?: number;
  openingWeekendGross?: number;
  viewership?: number; // for TV series
  sequelPart?: number;
  seriesSeason?: number;
  director?: string;
  leadActor?: string; // assigned at release for the Awards Night (real movies only)
  // Dynamic Theatrical Run Engine
  previousWeeklyGross?: number;
  expansionWeeksLeft?: number;
  expansionCooldownWeek?: number;
  extendedRun?: boolean;
  awardBoostWeeks?: number;
  awardBumpRemaining?: number;
}

export type RecordCategoryType =
  | 'Highest Opening Weekend'
  | 'Highest Lifetime Gross'
  | 'Longest #1'
  | 'Biggest Flop'
  | 'Highest ROI'
  | 'Fastest to $100M'
  | 'Fastest to $500M';

export interface BoxOfficeRecordItem {
  id: string;
  recordType: RecordCategoryType;
  movieTitle: string;
  studio: string;
  valueFormatted: string;
  numericValue: number;
  year: number;
  posterUrl?: string;
  isPlayerMovie?: boolean;
  description?: string;
}

export interface StudioPerformance {
  id: string;
  studioName: string;
  logoUrl: string;
  totalReleases: number;
  hitsCount: number; // 3x+ ROI
  flopsCount: number; // <0.8x ROI
  totalWorldwideGross: number;
  marketSharePct: number;
  averageGross: number;
  reputationScore: number; // 0-100
  topReleaseTitle?: string;
}

export interface StreamingPlatform {
  id: string;
  name: string;
  logoUrl: string;
  color: string;
  subscribers: string;
  status: 'Neutral' | 'Partner' | 'Exclusive';
  exclusiveDealsCount: number;
  moviesLicensed: number;
  seriesLicensed: number;
  moneyEarned: number;
}

export interface PitchOffer {
  id: string;
  title: string;
  type: 'Movie' | 'Series';
  offeredUpfront: number;
  royaltyPct: number;
  platformId: string;
}

export interface BankrollOpportunity {
  id: string;
  title: string;
  type: 'Movie' | 'Series' | 'Streaming Original';
  budget: number;
  weeksRemaining: number;
  expectedReturnPct: number;
  risk: 'Low' | 'Medium' | 'High' | 'Extreme';
  productionProgress: number; // 0 to 100%
  investedAmount: number;
  isInvested: boolean;
  outcomeStatus?: 'Pending' | 'Success' | 'Blockbuster' | 'Flop';
  payoutAmount?: number;
}

export interface TvStation {
  id: string;
  name: string;
  showName: string;
  host: string;
  viewerReach: string;
  imageUrl: string;
  activeInterviewOffer?: {
    id: string;
    topic: string;
    fameXpReward: number;
    cashReward: number;
    expiresWeeks: number;
  };
}

export interface RadioStation {
  id: string;
  name: string;
  host: string;
  listeners: string;
  imageUrl: string;
  activeInterviewOffer?: {
    id: string;
    topic: string;
    fansReward: number;
    expiresWeeks: number;
  };
}

export interface PersonalStudioProject {
  id: string;
  title: string;
  type: 'Movie' | 'Series';
  budget: number;
  cast: string[];
  location: string;
  studioName: string;
  phase: 'Development' | 'Production' | 'Post-Production' | 'Released';
  releaseStrategy: 'Theatrical' | 'Streaming' | 'Worldwide';
  progressWeeks: number;
  totalWeeks: number;
}

export interface SocialAccount {
  platform: 'Twitter' | 'Facebook' | 'Instagram' | 'Reddit' | 'YouTube' | 'Telegram';
  handle: string;
  followers: number;
  following: number;
  verified: boolean;
  monetizationActive: boolean;
  bio?: string;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  platform: 'Twitter' | 'Facebook' | 'Instagram' | 'Reddit' | 'YouTube' | 'Telegram';
  tab: 'PLAYER_FEED' | 'NPC_FEED';
  text: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  retweets: number;
  shares: number;
  timestamp: string;
  isPlayer: boolean;
  isNpc: boolean;
  sentiment: 'Positive' | 'Neutral' | 'Viral' | 'Criticism';
  generatedByWriter?: boolean;
}

export interface HiredWriter {
  id: string;
  name: string;
  tier: 'Low' | 'Medium' | 'Elite';
  weeklyCost: number;
  postsPerWeek: number;
  contractWeeksRemaining: number;
  postsThisWeek: number;
  qualityBoost: number;
  hired: boolean;
  agencyName?: string;
  minFame?: number;
  minLeadRoles?: number;
  bio?: string;
  avatar?: string;
}

export type AwardPrestige = 'Local' | 'Regional' | 'National' | 'International' | 'Global' | 'Legendary';

export type AwardPrediction = 'Current Favorite' | 'Strong Contender' | 'Dark Horse' | 'Outside Chance' | 'Long Shot';

export type AwardSeasonStage =
  | 'Eligibility'
  | 'Industry Predictions'
  | 'Official Nominees'
  | 'Media Campaign'
  | 'Red Carpet'
  | 'Award Ceremony'
  | 'Winner Announcement'
  | 'After Party'
  | 'Entertainment News';

export interface AwardItem {
  id: string;
  eventName: string; // e.g. Oscars, Emmys, Golden Globes, SAG Awards, Cannes, BAFTA, Critics Choice
  categoryName: string;
  prestige: AwardPrestige;
  workTitle: string;
  nomineeName: string;
  isPlayer?: boolean;
  status: 'Eligible' | 'Nominated' | 'Won' | 'Lost' | 'Eliminated';
  year: number;
  stage?: AwardSeasonStage;
  prediction?: AwardPrediction;
  votingScore?: number;
  campaignSpent?: number;
  description?: string;
  winnerName?: string;
  winnerWork?: string;
}

export interface AwardCampaignOption {
  id: string;
  name: string;
  type: 'Interviews' | 'Magazine Covers' | 'Premieres' | 'Talk Shows' | 'Special Screenings' | 'Fan Events';
  cost: number;
  votingScoreBoost: number;
  fameXpBoost: number;
  description: string;
}

export interface CareerAwardHistory {
  totalWins: number;
  totalNominations: number;
  totalFinalists: number;
  ceremoniesAttended: number;
  currentStreak: number;
  bestStreak: number;
  recordsLog: {
    id: string;
    year: number;
    eventName: string;
    categoryName: string;
    workTitle: string;
    result: 'Won' | 'Nominated' | 'Lost';
    votingScore: number;
  }[];
}

export interface LawFirm {
  id: string;
  name: string;
  logoUrl: string;
  bio: string;
  winRate: number; // e.g. 94%
  specialty: string;
  retainerFee: number;
  tier: 'Standard' | 'Elite' | 'Ultra Luxury';
  isHired: boolean;
}

export interface LegalCase {
  id: string;
  title: string;
  plaintiff: string;
  defendant: string;
  damages: number;
  status: 'Active' | 'Settled' | 'Won' | 'Lost';
  progressWeeks: number;
}

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  holdings: number;
  isMyCoin?: boolean;
  news?: string;
}

export interface CryptoWhale {
  id: string;
  name: string;
  avatar: string;
  winRatePct: number;
  totalProfit: number;
  copyTradeActive: boolean;
}

export interface StarStock {
  id: string;
  name: string;
  ticker: string;
  ceo?: string;
  price: number;
  changePct: number;
  marketCap: string;
  sharesOwned: number;
  sector: string;
  history?: string;
  recentMovies?: string[];
  recentSeries?: string[];
  news?: string;
}

export interface FilmingLocation {
  id: string;
  country: string;
  city: string;
  taxIncentivePct: number; // e.g. 35%
  permitCost: number;
  weatherRating: number; // 1-100
  travelCost: number;
  flagUrl: string;
}

export interface EndorsementOffer {
  id: string;
  brandName: string;
  category: 'Local' | 'Regional' | 'National' | 'Global' | 'Luxury';
  payPerYear: number;
  durationYears: number;
  requirements: string;
  isSigned: boolean;
}

export interface StudioRelationship {
  id: string;
  studioName: string;
  logoUrl: string;
  relationshipLevel: 'Enemy' | 'Neutral' | 'Trusted' | 'Preferred Actor' | 'Legend';
  points: number; // 0 to 100
  activeContract?: string;
}
