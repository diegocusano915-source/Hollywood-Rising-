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

export type StreamingBudgetTier = 'Mega' | 'Major' | 'Mid' | 'Indie';

export interface StreamingDeal {
  id: string;
  projectTitle: string;
  projectType: 'Movie' | 'Series';
  platformId: string;
  exclusive: boolean;
  upfront: number;
  royaltyRate: number; // % of gross per week
  weeklyRoyalty: number;
  startWeek: number;
  startYear: number;
  weeksRemaining: number;
  totalWeeks: number;
  movieRefId?: string;
}

export interface StreamingPlatform {
  id: string;
  name: string;
  logoUrl: string;
  color: string;
  subscribers: string;
  subscriberBase: number;
  status: 'Neutral' | 'Partner' | 'Exclusive';
  exclusiveDealsCount: number;
  moviesLicensed: number;
  seriesLicensed: number;
  moneyEarned: number;
  // Streaming rewire: personality
  budgetTier: StreamingBudgetTier;
  genrePrefs: string[];
  reputation: number; // 0-100
  activeDeals?: StreamingDeal[];
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

export type TvStationType = 'Morning' | 'Entertainment' | 'Late Night' | 'News' | 'Sports' | 'International';

export interface TvInterviewOffer {
  id: string;
  stationId: string;
  topic: string;
  status: 'PENDING' | 'READY' | 'DONE' | 'MISSED';
  scheduledInWeeks: number; // countdown until the interview airs
  fameXpReward: number;
  cashReward: number;
  fansReward: number;
  source: 'MANAGER' | 'STATION';
  bookedWeek: number;
  bookedYear: number;
}

export interface TvStation {
  id: string;
  name: string;
  showName: string;
  host: string; // original fictional host (simulated, connected to the game)
  stationType: TvStationType;
  viewerReach: string;
  viewerBase: number; // numeric for fan math
  imageUrl: string;
  minFame: number;
  minMovies: number;
  activeInterviewOffer?: TvInterviewOffer;
}

export interface TvAnswerChoice {
  text: string;
  style: 'WITTY' | 'HUMBLE' | 'CONTROVERSIAL';
  repChange: number; // reputation delta
  fansMult: number; // fans multiplier (0.5 - 2)
  scandalRisk: number; // 0-0.3 chance to spark a minor scandal
  crowdReaction: string; // host reaction line
}

export interface TvQuestion {
  id: string;
  question: string;
  context: 'movie' | 'boxoffice' | 'award' | 'scandal' | 'personal' | 'career' | 'fun';
  answers: TvAnswerChoice[];
}

export interface TvInterviewResult {
  stationName: string;
  host: string;
  questionsAsked: number;
  cashEarned: number;
  fansGained: number;
  fameXpGained: number;
  reputationChange: number;
  scandalTriggered: boolean;
  reactions: string[];
}

export type RadioStationType = 'HipHop' | 'Top40' | 'Talk' | 'News' | 'International' | 'Morning';

export interface RadioStation {
  id: string;
  name: string;
  host: string; // original fictional host
  stationType: RadioStationType;
  listeners: string;
  listenerBase: number;
  imageUrl: string;
  minFame: number;
  minMovies: number;
  activeInterviewOffer?: {
    id: string;
    topic: string;
    status: 'PENDING' | 'READY' | 'DONE' | 'MISSED';
    scheduledInWeeks: number;
    fameXpReward: number;
    cashReward: number;
    fansReward: number;
    source: 'AGENT' | 'STATION';
    bookedWeek: number;
    bookedYear: number;
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
  views?: number;
  badge?: 'NONE' | 'BLUE' | 'GOLD' | 'GRAY';
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
  platform?: string; // lowercase platform id this writer is retained for (e.g. 'twitter')
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

// ============ SOCIAL MEDIA HUB V2 (7 platforms) ============
export type PremiumTierId = 'none' | 'premium' | 'plus' | 'pro';
export interface PremiumState {
  tier: PremiumTierId;
  plan: 'none' | 'monthly' | 'yearly';
  expiresWeek: number;
  expiresYear: number;
}

export interface RedditPost {
  id: string;
  subreddit: string;
  author: string;
  title: string;
  text: string;
  upvotes: number;
  commentCount: number;
  isPlayer: boolean;
  isNpc: boolean;
  flair?: string;
  timeText: string;
  week: number;
  year: number;
}

export interface RedditComment {
  id: string;
  postId: string;
  author: string;
  text: string;
  upvotes: number;
  isPlayer: boolean;
}

export interface TelegramStory {
  id: string;
  author: string;
  text: string;
  hoursLeft: number;
  isPlayer: boolean;
  week: number;
  year: number;
}

export interface MarqueeJob {
  id: string;
  studio: string;
  title: string;
  roleType: string;
  budget: number;
  salary: number;
  requiredMovies: number;
  requiredFame: number;
  status: 'OPEN' | 'APPLIED' | 'FILLED';
  week: number;
  year: number;
}

export interface SocialHubStats {
  twitterFollowers: number;
  instagramFollowers: number;
  youtubeSubscribers: number;
  facebookFriends: number;
  marqueeConnections: number;
  redditKarma: number;
  telegramChannelSubs: number;
}
