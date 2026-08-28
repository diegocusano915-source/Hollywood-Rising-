/**
 * HOLLYWOOD RISING - Global Social Media Engine & Data Service (Phase 2)
 * Connects Twitter/X, Instagram, YouTube, Official Website, Fan Club, Sponsorships, Writers & Analytics.
 * All social events originate from actual gameplay.
 */

import { Player, InboxMessage } from '../types/game';
import { SocialPost, HiredWriter, PremiumState, RedditPost, RedditComment, TelegramStory, MarqueeJob } from '../types/world';
import { monthOfWeek, closingMonthOfWeek } from '../utils/calendar';
import { RepresentationService } from './representationService';

export type PlatformType = 'Twitter' | 'Facebook' | 'Instagram' | 'Reddit' | 'YouTube' | 'Telegram';
export type VerificationType = 'NONE' | 'BLUE' | 'GOLD';

export interface PostComment {
  id: string;
  postId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  badge?: VerificationType;
  text: string;
  timestamp: string;
  likes: number;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  senderHandle: string;
  senderAvatar: string;
  senderBadge?: VerificationType;
  text: string;
  timestamp: string;
  read: boolean;
  category: 'FAN' | 'STUDIO' | 'VERIFICATION' | 'BUSINESS' | 'BRAND';
}

export interface VerificationRequest {
  platform: PlatformType;
  status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  badgeAwarded?: VerificationType;
  rejectionReasons?: string[];
  submittedDate?: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  category: 'MOVIE_PREMIERE' | 'BEHIND_SCENES' | 'RED_CARPET' | 'AWARD_NIGHT' | 'LUXURY_LIFESTYLE' | 'DAILY_VLOG';
  likes: number;
  commentsCount: number;
  timestamp: string;
  location?: string;
}

export interface InstagramStory {
  id: string;
  authorName: string;
  authorAvatar: string;
  badge?: VerificationType;
  mediaUrl: string;
  caption: string;
  timestamp: string;
  seen: boolean;
}

export interface InstagramReel {
  id: string;
  title: string;
  videoThumbnail: string;
  audioTag: string;
  views: number;
  likes: number;
  commentsCount: number;
  durationSec: number;
}

export type YouTubeMonetizationStatus =
  | 'NOT_ELIGIBLE'
  | 'ELIGIBLE'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  category: 'TRAILER' | 'VLOG' | 'INTERVIEW' | 'BEHIND_SCENES' | 'LIVESTREAM' | 'AWARD_SPEECH' | 'ANNOUNCEMENT';
  views: number;
  likes: number;
  commentsCount: number;
  watchTimeHours: number;
  retentionPercent: number;
  ctrPercent: number;
  shares: number;
  subscribersGained: number;
  estimatedRevenue: number;
  uploadWeek: number;
  uploadYear: number;
  duration: string;
  durationSec: number;
  isEvergreen: boolean;
  /** Publish-slot reach multiplier (Sat 7PM prime = 1.18) */
  slotBoost?: number;
  /** Pre-flight algorithm score at publish time (0-100) */
  algoScore?: number;
}

/** A payout requested from the YT mini-bank — clears in 1-5 weeks */
export interface YouTubePendingPayout {
  id: string;
  gross: number;
  taxWithheld: number;
  net: number;
  weeksRemaining: number;
  totalWeeks: number;
  requestedWeek: number;
  requestedYear: number;
}

/** A video scheduled to publish on a future week + audience slot */
export interface YouTubeScheduledUpload {
  id: string;
  title: string;
  category: YouTubeVideo['category'];
  slotBoost: number;
  slotLabel: string;
  algoScore: number;
  publishWeek: number;
  publishYear: number;
  createdWeek: number;
  createdYear: number;
}

/**
 * CHANNEL AUTHORITY LADDER — the slow burn. Weekly view ceilings are hard
 * caps per tier; crossing 1M lifetime views realistically requires Tier 4+
 * which takes 1-2 game years of consistent uploads. XP: +9/upload, +5 bonus
 * for score ≥70, engagement drips, −4 for skipped weeks after channel start.
 */
export const YT_AUTHORITY_TIERS = [
  { tier: 1, name: 'Cold Start',        minXp: 0,    weeklyViewCap: 300,    rpm: 0 },
  { tier: 2, name: 'Rising Creator',    minXp: 130,  weeklyViewCap: 2500,   rpm: 2.0 },
  { tier: 3, name: 'Established Channel', minXp: 420, weeklyViewCap: 18000, rpm: 3.0 },
  { tier: 4, name: 'Featured Creator',  minXp: 900,  weeklyViewCap: 90000,  rpm: 4.0 },
  { tier: 5, name: 'Premium Creator',   minXp: 1600, weeklyViewCap: 260000, rpm: 5.0 },
] as const;

export function ytAuthorityTier(xp: number): (typeof YT_AUTHORITY_TIERS)[number] {
  let t: (typeof YT_AUTHORITY_TIERS)[number] = YT_AUTHORITY_TIERS[0];
  for (const tier of YT_AUTHORITY_TIERS) if (xp >= tier.minXp) t = tier;
  return t;
}

/** Publish slots — audience windows with real reach multipliers */
export const YT_SLOTS = [
  { id: 'mon_9am', label: 'Monday 9AM', boost: 1.02, hint: 'dead scroll hours' },
  { id: 'noon', label: 'Weekday Noon', boost: 1.06, hint: 'decent lunch traffic' },
  { id: 'sun_10am', label: 'Sunday 10AM', boost: 1.08, hint: 'weekend slow browse' },
  { id: 'fri_5pm', label: 'Friday 5PM', boost: 1.11, hint: 'pre-weekend binge wave' },
  { id: 'sat_7pm', label: 'Saturday 7PM PRIME', boost: 1.18, hint: 'your audience peak' },
] as const;

export const YT_PAYOUT_TAX_PCT = 0.2; // 20% withheld at transfer request
/** Creator-income tax now applies to EVERY social bank (YT, IG, X). */
export const SOCIAL_BANK_TAX_PCT = 0.2;
/** Minimum bank balance that can be transferred out (real payout threshold). */
export const SOCIAL_BANK_MIN_TRANSFER = 20;

// ============================================================
// GRAM CREATOR HQ — Instagram reach-tier system. NO fake
// followers, NO fake simulation: reach is tier-capped, converts
// to REAL followers (state.followers.Instagram) at a small rate,
// and bonus revenue accrues to the IG mini-bank only.
// ============================================================

/** An Instagram creator post (scheduled → published into the real feed) */
export interface InstagramCreatorPost {
  id: string;
  caption: string;
  postType: 'PHOTO' | 'CAROUSEL' | 'REEL' | 'STORY' | 'COLLAB' | 'BTS';
  slotBoost: number;
  slotLabel: string;
  algoScore: number;
  publishWeek: number;
  publishYear: number;
  createdWeek: number;
  createdYear: number;
  /** Set when published — graded by real reach */
  published?: boolean;
  reach?: number;
  likes?: number;
  saves?: number;
  followersGained?: number;
  revenue?: number;
}

/** IG reach tiers — HARD weekly reach ceilings per authority tier */
export const IG_AUTHORITY_TIERS = [
  { tier: 1, name: 'Test Audience',    minXp: 0,    weeklyReachCap: 2500,   rpm: 0 },
  { tier: 2, name: 'Explore Batches',  minXp: 120,  weeklyReachCap: 20000,  rpm: 1.8 },
  { tier: 3, name: 'Featured Gram',    minXp: 400,  weeklyReachCap: 140000, rpm: 2.8 },
  { tier: 4, name: 'Viral Candidate',  minXp: 900,  weeklyReachCap: 700000, rpm: 3.8 },
  { tier: 5, name: 'Gram Elite',       minXp: 1600, weeklyReachCap: 2000000, rpm: 4.8 },
] as const;

export function igAuthorityTier(xp: number): (typeof IG_AUTHORITY_TIERS)[number] {
  let t: (typeof IG_AUTHORITY_TIERS)[number] = IG_AUTHORITY_TIERS[0];
  for (const tier of IG_AUTHORITY_TIERS) if (xp >= tier.minXp) t = tier;
  return t;
}

/** IG audience slots with real reach multipliers */
export const IG_SLOTS = [
  { id: 'mon_11am', label: 'Weekday 11AM', boost: 1.05, hint: 'late-morning scroll' },
  { id: 'wed_2pm', label: 'Weekday 2PM', boost: 1.09, hint: 'lunch-scroll wave' },
  { id: 'fri_8pm', label: 'Friday 8PM', boost: 1.11, hint: 'pre-weekend night scroll' },
  { id: 'sat_7pm', label: 'Saturday 7PM PRIME', boost: 1.15, hint: 'your audience peak' },
] as const;

export const IG_PAYOUT_TAX_PCT = 0.2; // 20% withheld at IG transfer request

// ============================================================
// X CREATOR HQ — Twitter/X impressions-tier system. Same rules
// as YouTube/Instagram: NO fake followers — impressions convert
// at a small real rate into the account's TRUE follower count,
// and ad-revenue payouts accrue to the X mini-bank only after
// the real-follower gate (5,000) is passed.
// ============================================================

/** A scheduled/published X creator tweet */
export interface TwitterCreatorPost {
  id: string;
  text: string;
  tweetType: 'HOT_TAKE' | 'THREAD' | 'BTS_CLIP' | 'POLL' | 'TRENDING_REACT' | 'MEDIA_DROP';
  slotBoost: number;
  slotLabel: string;
  algoScore: number;
  publishWeek: number;
  publishYear: number;
  createdWeek: number;
  createdYear: number;
  published?: boolean;
  impressions?: number;
  likes?: number;
  reposts?: number;
  replies?: number;
  followersGained?: number;
  revenue?: number;
}

/** X impression tiers — HARD weekly caps per authority tier */
export const TW_AUTHORITY_TIERS = [
  { tier: 1, name: 'Testing You',     minXp: 0,    weeklyImpressionCap: 3000,   rpm: 0 },
  { tier: 2, name: 'Getting Reach',   minXp: 110,  weeklyImpressionCap: 25000,  rpm: 1.6 },
  { tier: 3, name: 'Timeline Regular', minXp: 380, weeklyImpressionCap: 160000, rpm: 2.6 },
  { tier: 4, name: 'Trendsetter',     minXp: 880,  weeklyImpressionCap: 800000, rpm: 3.6 },
  { tier: 5, name: 'X Elite',         minXp: 1600, weeklyImpressionCap: 2500000, rpm: 4.6 },
] as const;

export function twAuthorityTier(xp: number): (typeof TW_AUTHORITY_TIERS)[number] {
  let t: (typeof TW_AUTHORITY_TIERS)[number] = TW_AUTHORITY_TIERS[0];
  for (const tier of TW_AUTHORITY_TIERS) if (xp >= tier.minXp) t = tier;
  return t;
}

/** X audience slots with real impression multipliers */
export const TW_SLOTS = [
  { id: 'mon_8am', label: 'Weekday 8AM', boost: 1.06, hint: 'morning-coffee scroll' },
  { id: 'wed_12pm', label: 'Weekday Noon', boost: 1.08, hint: 'lunch-break timeline' },
  { id: 'fri_6pm', label: 'Friday 6PM', boost: 1.12, hint: 'end-of-week dump' },
  { id: 'sat_9pm', label: 'Saturday 9PM PRIME', boost: 1.16, hint: 'night-scroll peak' },
] as const;

export const TW_PAYOUT_TAX_PCT = 0.2;
/** Payouts unlock at this many REAL followers (plus tier 2+) */
export const TW_PAYOUT_FOLLOWER_GATE = 5000;

/** X pre-flight algorithm score */
export function computeTwAlgoScore(input: {
  text: string;
  tweetType: TwitterCreatorPost['tweetType'];
  slotBoost: number;
  authorityXp: number;
  hasActiveMovie: boolean;
}): { score: number; factors: Array<{ label: string; value: number; tip: string }> } {
  const t = input.text.trim();
  let hookScore = 30;
  if (t.length >= 20) hookScore += 8;
  if (/\d/.test(t)) hookScore += 12;
  if (/(nobody|everyone|truth|unpopular|hot take|day \d|thread|behind|just|finally|never)/i.test(t)) hookScore += 20;
  if (/[?!]/.test(t)) hookScore += 6;
  if (t.length > 0 && t.length < 10) hookScore -= 12;
  hookScore = Math.max(5, Math.min(100, hookScore));

  let typeScore = 55;
  if (input.tweetType === 'BTS_CLIP') typeScore = input.hasActiveMovie ? 90 : 35;
  else if (input.tweetType === 'HOT_TAKE') typeScore = 78;
  else if (input.tweetType === 'THREAD') typeScore = 70;
  else if (input.tweetType === 'TRENDING_REACT') typeScore = 72;
  else if (input.tweetType === 'POLL') typeScore = 60;
  else if (input.tweetType === 'MEDIA_DROP') typeScore = 62;

  const slotScoreC = Math.max(30, Math.min(100, Math.round((input.slotBoost - 1) * 320 + 55)));
  const authScore = Math.max(8, Math.min(100, Math.round(input.authorityXp / 16)));

  const score = Math.round(hookScore * 0.3 + typeScore * 0.3 + slotScoreC * 0.15 + authScore * 0.25);
  return {
    score,
    factors: [
      { label: 'Hook strength', value: hookScore, tip: /\d/.test(t) ? 'Number + pattern words — strong hook.' : 'Open with a number or "Nobody/Everyone/Truth" pattern for +12.' },
      { label: 'Type fit', value: typeScore, tip: input.tweetType === 'BTS_CLIP' && !input.hasActiveMovie ? 'BTS clips score low without a movie in production/theaters.' : 'Good fit for your current career state.' },
      { label: 'Slot timing', value: slotScoreC, tip: input.slotBoost >= 1.14 ? 'Prime night-scroll window.' : 'Sat 9PM PRIME adds the biggest first-hour impressions.' },
      { label: 'Account authority', value: authScore, tip: authScore < 40 ? 'Testing phase: impressions capped hard. Consistency is the only fix.' : 'Authority raising your impression ceiling.' },
    ],
  };
}

/** IG pre-flight algorithm score (caption hook, type fit, slot, authority) */
export function computeIgAlgoScore(input: {
  caption: string;
  postType: InstagramCreatorPost['postType'];
  slotBoost: number;
  authorityXp: number;
  hasActiveMovie: boolean;
}): { score: number; factors: Array<{ label: string; value: number; tip: string }> } {
  const c = input.caption.trim();
  let capScore = 30;
  if (c.length >= 15) capScore += 10;
  if (/\d/.test(c)) capScore += 14;
  if (/(day|days|behind|first|secret|truth|set|story|never|last|on set|bts)/i.test(c)) capScore += 18;
  if (c.length > 0 && c.length < 8) capScore -= 10;
  if (/[?!]/.test(c)) capScore += 6;
  capScore = Math.max(5, Math.min(100, capScore));

  let typeScore = 55;
  if (input.postType === 'BTS') typeScore = input.hasActiveMovie ? 92 : 35;
  else if (input.postType === 'REEL') typeScore = 80;
  else if (input.postType === 'CAROUSEL') typeScore = 72;
  else if (input.postType === 'COLLAB') typeScore = 68;
  else if (input.postType === 'STORY') typeScore = 50;
  else if (input.postType === 'PHOTO') typeScore = 58;

  const slotScoreC = Math.max(30, Math.min(100, Math.round((input.slotBoost - 1) * 340 + 55)));
  const authScore = Math.max(8, Math.min(100, Math.round(input.authorityXp / 16)));

  const score = Math.round(capScore * 0.3 + typeScore * 0.3 + slotScoreC * 0.15 + authScore * 0.25);
  return {
    score,
    factors: [
      { label: 'Caption hook', value: capScore, tip: /\d/.test(c) ? 'Number + emotion detected — saves incoming.' : 'Add a number and emotion in line one for +14.' },
      { label: 'Save potential', value: typeScore, tip: input.postType === 'BTS' && !input.hasActiveMovie ? 'BTS scores low without a movie in production/theaters.' : 'Type fits your current career state.' },
      { label: 'Slot timing', value: slotScoreC, tip: input.slotBoost >= 1.13 ? 'Prime window — most of your followers scrolling.' : 'Sat 7PM PRIME adds the biggest first-hour reach.' },
      { label: 'Account authority', value: authScore, tip: authScore < 40 ? 'Test-audience phase: reach is capped hard. Consistency is the only fix.' : 'Authority raising your reach ceiling.' },
    ],
  };
}

/**
 * Pre-flight algorithm score (0-100) — mirrors what the weekly engine will
 * use. Factors: title strength, category fit (BTS needs a live movie),
 * slot timing, channel authority.
 */
export function computeYtAlgoScore(input: {
  title: string;
  category: YouTubeVideo['category'];
  slotBoost: number;
  authorityXp: number;
  hasActiveMovie: boolean;
}): { score: number; factors: Array<{ label: string; value: number; tip: string }> } {
  const t = input.title.trim();
  let titleScore = 30;
  if (t.length >= 25) titleScore += 12;
  if (/\d/.test(t)) titleScore += 14; // numbers perform
  if (/(first|secret|truth|day|days|behind|story|changed|spent|inside)/i.test(t)) titleScore += 18; // proven patterns
  if (t.length > 0 && t.length < 12) titleScore -= 10; // lazy titles die
  titleScore = Math.max(5, Math.min(100, titleScore));

  let typeScore = 55;
  if (input.category === 'BEHIND_SCENES') typeScore = input.hasActiveMovie ? 90 : 35;
  else if (input.category === 'TRAILER') typeScore = input.hasActiveMovie ? 82 : 60;
  else if (input.category === 'INTERVIEW') typeScore = 62;
  else if (input.category === 'AWARD_SPEECH') typeScore = 75;
  else if (input.category === 'LIVESTREAM') typeScore = 58;

  const slotScore = Math.round((input.slotBoost - 1) * 320 + 55); // 1.02→58, 1.18→82... clamp
  const slotScoreC = Math.max(30, Math.min(100, slotScore));

  const authScore = Math.max(8, Math.min(100, Math.round(input.authorityXp / 16)));

  const score = Math.round(titleScore * 0.3 + typeScore * 0.3 + slotScoreC * 0.15 + authScore * 0.25);
  return {
    score,
    factors: [
      { label: 'Title strength', value: titleScore, tip: /\d/.test(t) ? 'Numbers + stakes detected — strong.' : 'Add a number and stakes ("30 Days...", "$1M...") for +14.' },
      { label: 'Type relevance', value: typeScore, tip: input.category === 'BEHIND_SCENES' && !input.hasActiveMovie ? 'BTS scores low without a movie in production/theaters.' : 'Good fit for your current career state.' },
      { label: 'Slot timing', value: slotScoreC, tip: input.slotBoost >= 1.15 ? 'Prime window — your audience peaks here.' : 'Sat 7PM PRIME adds the biggest first-week boost.' },
      { label: 'Channel authority', value: authScore, tip: authScore < 40 ? 'Cold start: the algorithm tests you on small audiences. Consistency is the only fix.' : 'Authority working for you.' },
    ],
  };
}

export interface NpcYouTubeChannel {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  category: 'MOVIE_REVIEWS' | 'ENTERTAINMENT_NEWS' | 'ACTOR' | 'STUDIO' | 'DIRECTOR' | 'FAN_REACT' | 'INTERVIEW' | 'GOSSIP';
  subscribers: number;
  verified: boolean;
  latestVideo?: {
    title: string;
    views: number;
    thumbnailUrl: string;
    timeAgo: string;
  };
}

export const YOUTUBE_MONETIZATION_REQUIREMENTS = {
  minSubscribers: 1000,
  minWatchHours: 4000,
  maxCommunityStrikes: 0,
  maxCopyrightStrikes: 0,
  reviewWeeksMin: 2,
  reviewWeeksMax: 4,
};

export const DEFAULT_NPC_YOUTUBE_CHANNELS: NpcYouTubeChannel[] = [
  {
    id: 'npc_yt_1',
    name: 'CinemaCritique Pro',
    handle: '@cinemacritiquepro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
    category: 'MOVIE_REVIEWS',
    subscribers: 1450000,
    verified: true,
    latestVideo: {
      title: 'Top 10 Most Anticipated Hollywood Movies of 2026',
      views: 380000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop',
      timeAgo: '2 days ago',
    },
  },
  {
    id: 'npc_yt_2',
    name: 'Hollywood Pulse Daily',
    handle: '@hollywoodpulse_yt',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
    category: 'ENTERTAINMENT_NEWS',
    subscribers: 2800000,
    verified: true,
    latestVideo: {
      title: 'Box Office Explosions & A-List Casting Rumors Breakdown',
      views: 890000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop',
      timeAgo: '1 day ago',
    },
  },
  {
    id: 'npc_yt_3',
    name: 'CinePhile Reactions',
    handle: '@cinephilereacts',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop',
    category: 'FAN_REACT',
    subscribers: 620000,
    verified: true,
    latestVideo: {
      title: 'Film Student Reacts to Insane Hollywood Stunts & VFX!',
      views: 210000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop',
      timeAgo: '3 days ago',
    },
  },
  {
    id: 'npc_yt_4',
    name: 'Paramount Official',
    handle: '@paramountpictures',
    avatar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop',
    category: 'STUDIO',
    subscribers: 12500000,
    verified: true,
    latestVideo: {
      title: 'Summer Blockbuster Slate - Official Teaser Showcase',
      views: 4500000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop',
      timeAgo: '5 days ago',
    },
  },
  {
    id: 'npc_yt_5',
    name: 'Tea & Hollywood Drama',
    handle: '@teahollywood',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop',
    category: 'GOSSIP',
    subscribers: 940000,
    verified: false,
    latestVideo: {
      title: 'Behind closed doors: Who is secretly dating on set?',
      views: 520000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop',
      timeAgo: '4 hours ago',
    },
  },
  {
    id: 'npc_yt_6',
    name: 'The Hot Seat Interviews',
    handle: '@hotseatinterviews',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop',
    category: 'INTERVIEW',
    subscribers: 1800000,
    verified: true,
    latestVideo: {
      title: 'Unfiltered 30-Min Deep Dive with Oscar-Nominated Directors',
      views: 640000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop',
      timeAgo: '4 days ago',
    },
  },
];

export interface SponsorshipDeal {
  id: string;
  brandName: string;
  brandCategory: 'Luxury Fashion' | 'Automotive' | 'Watches' | 'Technology' | 'Streaming' | 'Beverage' | 'Travel';
  brandLogo: string;
  deliverable: string;
  lumpSumPayout: number;
  weeklyPayout: number;
  durationWeeks: number;
  weeksRemaining: number;
  status: 'OFFER' | 'ACTIVE' | 'COMPLETED' | 'DECLINED';
  minFollowersRequired: number;
  minFameRequired: number;
}

export interface FanFeedItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  membershipTier: 'FREE' | 'SILVER' | 'GOLD_VIP';
  text: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
}

export interface SocialAnalyticsSnapshot {
  week: number;
  year: number;
  totalFollowers: number;
  weeklyImpressions: number;
  engagementRatePercent: number;
  topPostText: string;
  topAudienceCountry: string;
  topPlatform: PlatformType;
}

export interface SocialsState {
  createdPlatforms: Record<PlatformType, boolean>;
  followers: Record<PlatformType, number>;
  following: Record<PlatformType, number>;
  verification: Record<PlatformType, VerificationType>;
  verificationRequests: Record<PlatformType, VerificationRequest>;
  playerPosts: Record<PlatformType, SocialPost[]>;
  postComments: Record<string, PostComment[]>;
  bookmarkedIds: string[];
  messages: DirectMessage[];
  writers: HiredWriter[];
  postsRemainingThisWeek: number;
  lastProcessedWeek?: number;

  // Phase 2 Ecosystem Additions
  instagramPosts: InstagramPost[];
  instagramStories: InstagramStory[];
  instagramReels: InstagramReel[];

  youtubeVideos: YouTubeVideo[];
  youtubeSubscribers: number;
  youtubeWatchHours: number;
  youtubeTotalViews: number;
  youtubeMonetizationStatus: YouTubeMonetizationStatus;
  youtubeReviewWeeksLeft: number;
  youtubeCommunityStrikes: number;
  youtubeCopyrightStrikes: number;
  youtubeAlgorithmStatus: string;
  youtubeChannelHealth: string;
  npcYouTubeChannels: NpcYouTubeChannel[];

  sponsorshipDeals: SponsorshipDeal[];
  fanFeed: FanFeedItem[];
  analyticsHistory: SocialAnalyticsSnapshot[];
  trendingTopics: string[];

  // SOCIAL MEDIA HUB V2 (7 platforms)
  premium: PremiumState;
  youtubeAlgorithm: { lifetimeVideos: number; discovered: boolean };
  facebookPosts: SocialPost[];
  redditPosts: RedditPost[];
  redditComments: RedditComment[];
  marqueePosts: SocialPost[];
  marqueeJobs: MarqueeJob[];
  telegramStories: TelegramStory[];
  telegramChannelSubs: number;
  redditKarma: number;
  marqueeConnections: number;
  facebookFriends: number;
  creatorStudio: { totalImpressions: number; totalAdRevenue: number; weeklyAdRevenue: number };
  // SOCIAL ACCOUNTS V3: separate account creation per platform + per-platform weekly activity
  socialAccounts?: Record<string, { handle: string; createdWeek: number; createdYear: number }>;
  postsThisWeekByPlatform?: Record<string, number>;
  // ---- YOUTUBE CREATOR HQ (v4) ----
  /** Channel authority XP — drives tier caps (the slow burn) */
  youtubeAuthorityXp?: number;
  /** YT mini-bank: accrued AdSense balance waiting to be transferred */
  youtubeBalance?: number;
  /** Transfers in flight (tax already withheld, clears in 1-5 weeks) */
  youtubePendingPayouts?: YouTubePendingPayout[];
  /** Videos scheduled to publish on future weeks */
  youtubeScheduled?: YouTubeScheduledUpload[];
  /** Lifetime uploads (authority consistency tracking) */
  youtubeLifetimeUploads?: number;
  /** Consecutive weeks with at least one upload/video published */
  youtubeUploadStreak?: number;
  /** Last week/year the weekly processor ran (scheduling anchor) */
  lastProcessedYear?: number;
  // ---- GRAM CREATOR HQ (Instagram v4) ----
  /** IG authority XP — drives reach-tier caps */
  instagramAuthorityXp?: number;
  /** IG mini-bank: accrued Creator Bonus balance */
  instagramBalance?: number;
  /** IG transfers in flight (tax withheld, clear in 1-5 weeks) */
  instagramPendingPayouts?: YouTubePendingPayout[];
  /** IG posts scheduled to publish on future weeks */
  instagramScheduled?: InstagramCreatorPost[];
  /** Published creator posts (graded by real reach) */
  instagramCreatorPosts?: InstagramCreatorPost[];
  /** Lifetime creator posts (consistency tracking) */
  instagramLifetimePosts?: number;
  /** Consecutive weeks with at least one creator post */
  instagramPostStreak?: number;
  /** Creator Bonus accrued last week (bank display) */
  instagramAccruedLastWeek?: number;
  // ---- X CREATOR HQ (Twitter v4) ----
  twitterAuthorityXp?: number;
  twitterBalance?: number;
  twitterPendingPayouts?: YouTubePendingPayout[];
  twitterScheduled?: TwitterCreatorPost[];
  twitterCreatorPosts?: TwitterCreatorPost[];
  twitterLifetimePosts?: number;
  twitterPostStreak?: number;
  twitterAccruedLastWeek?: number;
  /** How many manual feed posts have been converted into tracked creator tweets */
  twitterTrackedFeedCount?: number;
  /** Global monthly social earnings tracker — hard cap $25K, floor $5K when active */
  socialMonthlyEarnings?: { year: number; month: string; accrued: number; postsCounted: number };
  /** Real revenue accrued THIS week per bank — powers every social bank panel */
  socialWeeklyAccrued?: { youtube: number; instagram: number; twitter: number; week: number; year: number };
  /** Lifetime gross earnings per bank — real cumulative, never resets */
  socialLifetimeEarned?: { youtube: number; instagram: number; twitter: number; facebook: number; reddit: number; telegram: number };
  /** Balances for platforms without ad engines yet (deposits + future earnings) */
  facebookBalance?: number;
  redditBalance?: number;
  telegramBalance?: number;
  /** Live NPC hype for the player's fan token — decays weekly while the coin trades */
  playerCoinHype?: { symbol: string; coinName: string; weeksLeft: number };
}

/** Monthly social-earnings envelope: real-engine range $5,000-$25,000 */
export const SOCIAL_MONTHLY_CAP = 25000;
export const SOCIAL_MONTHLY_FLOOR = 5000;

const STORAGE_KEY = 'HOLLYWOOD_SOCIALS_FULL_STATE_V3';

// 1. GOVERNMENT ACCOUNTS (14 Official Accounts)
export const GOVERNMENT_ACCOUNTS = [
  {
    name: 'California Film Commission',
    handle: '@ca_film_commission',
    avatar: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Official State of California agency administering $330M annual film & TV tax credit incentives.',
  },
  {
    name: 'LA Dept of Cultural Affairs',
    handle: '@la_culture_dept',
    avatar: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Promoting arts, theater, public exhibits, and cultural heritage across Los Angeles County.',
  },
  {
    name: 'LA Department of Transportation',
    handle: '@ladot_official',
    avatar: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Official LA traffic & street management. Advisory for production road closures & permits.',
  },
  {
    name: 'LAPD Media Relations',
    handle: '@lapd_official',
    avatar: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Los Angeles Police Department Public Information Directorate. Public safety & stunt security.',
  },
  {
    name: 'Visit California Tourism',
    handle: '@visit_california',
    avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Showcasing California’s iconic filming locations, beaches, and red carpet landmarks.',
  },
  {
    name: 'National Endowment for Arts',
    handle: '@arts_gov',
    avatar: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'US Federal agency awarding grants and preserving national artistic excellence.',
  },
  {
    name: 'LA Economic Development Corp',
    handle: '@laedc_official',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Driving entertainment industry job growth, soundstage investment, and economic expansion.',
  },
  {
    name: 'US Cultural Diplomacy Bureau',
    handle: '@us_diplomacy_arts',
    avatar: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Fostering international cinema exchanges and global film festival delegations.',
  },
  {
    name: 'LAFD Pyrotechnic & Stunts',
    handle: '@lafd_official',
    avatar: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Los Angeles Fire Department safety inspection division for explosive & hazardous stunt sets.',
  },
  {
    name: 'US Dept of Commerce Media',
    handle: '@us_commerce_dept',
    avatar: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Monitoring international film export revenues, copyright protection, and media trade.',
  },
  {
    name: 'CA Franchise Tax Board',
    handle: '@ca_tax_board',
    avatar: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Official tax compliance and entertainment loan-out corporation guidance for California.',
  },
  {
    name: 'LA Parks and Recreation',
    handle: '@la_parks_rec',
    avatar: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Managing Griffith Park, Runyon Canyon, and municipal outdoor filming venues.',
  },
  {
    name: 'US National Film Registry',
    handle: '@us_film_council',
    avatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Preserving culturally, historically, and aesthetically significant motion pictures.',
  },
  {
    name: 'City of Beverly Hills Civic',
    handle: '@beverlyhills_gov',
    avatar: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=120&auto=format&fit=crop',
    badge: 'GOLD' as VerificationType,
    category: 'Government',
    bio: 'Beverly Hills municipal council, Rodeo Drive event permits, and civic announcements.',
  },
];

// GOVERNMENT POST TEMPLATES
export const GOVERNMENT_POST_TEMPLATES = [
  { account: GOVERNMENT_ACCOUNTS[0], text: 'NOTICE: Applications for CA Film & TV Tax Credit Program open next Monday. $330M allocated for qualified soundstage productions. 🎬 California remains the capital of cinema.' },
  { account: GOVERNMENT_ACCOUNTS[1], text: 'ANNOUNCEMENT: Grants awarded to 24 local Los Angeles indie theater groups and youth performing arts academies! Investing in the future of storytelling.' },
  { account: GOVERNMENT_ACCOUNTS[2], text: 'TRAFFIC ADVISORY: Sunset Blvd between Vine St and Highland Ave will undergo rolling closures this weekend for permitted studio filming. Plan alternate routes.' },
  { account: GOVERNMENT_ACCOUNTS[3], text: 'PUBLIC SAFETY: LAPD Media Division congratulates local production crews for flawless safety protocols during last night’s downtown stunt sequence.' },
  { account: GOVERNMENT_ACCOUNTS[4], text: 'DESTINATION HIGHLIGHT: Big Sur coastline and Monterey County see record production bookings this quarter. Discover California’s breathtaking cinematic landscapes.' },
  { account: GOVERNMENT_ACCOUNTS[5], text: 'NATIONAL ARTS BRIEF: Federal Endowment awards $15M in national grants to support scriptwriting workshops and cinema preservation initiatives nationwide.' },
  { account: GOVERNMENT_ACCOUNTS[6], text: 'ECONOMIC UPDATE: Los Angeles entertainment sector generated over $32 Billion in economic activity, supporting 185,000 direct industry jobs.' },
  { account: GOVERNMENT_ACCOUNTS[7], text: 'GLOBAL ARTS DIPLOMACY: US Cultural Bureau leads delegation to Cannes Film Festival to expand international co-production treaties.' },
  { account: GOVERNMENT_ACCOUNTS[8], text: 'SAFETY BULLETIN: LAFD reminds all special effects coordinators that flame & pyrotechnic permits must be submitted 10 days prior to filming.' },
  { account: GOVERNMENT_ACCOUNTS[9], text: 'TRADE REPORT: American theatrical film exports grew 11.4% year-over-year, driven by blockbuster international box office performance.' },
  { account: GOVERNMENT_ACCOUNTS[10], text: 'TAX GUIDANCE: Friendly reminder to entertainment loan-out corporations regarding annual S-Corp state filings due by the end of Q2.' },
  { account: GOVERNMENT_ACCOUNTS[11], text: 'LOCATION PERMITS: Griffith Observatory and Pan Pacific Park open spring reservation slots for commercial photography and feature film permits.' },
  { account: GOVERNMENT_ACCOUNTS[12], text: 'FILM REGISTRY: 25 additional landmark motion pictures added to the National Film Registry for permanent archival preservation.' },
  { account: GOVERNMENT_ACCOUNTS[13], text: 'CIVIC ADVISORY: Wilshire Boulevard red carpet preparations underway for annual charity gala. Valet and pedestrian access updated.' },
];

// STREAMING ACCOUNTS
export const STREAMING_ACCOUNTS = [
  { name: 'Netstar Streaming', handle: '@netstarapp', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType },
  { name: 'NovaStream Originals', handle: '@novastream_app', avatar: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType },
  { name: 'HBO Max Official', handle: '@hbomax', avatar: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType },
  { name: 'Paramount+ Cinema', handle: '@paramountplus', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType },
];

export const STREAMING_VIEW_COUNTS = [
  '12.4K Views',
  '148.2K Views',
  '2.1M Views',
  '18.6M Views',
  '95.4M Views',
  '210.8M Views',
  '472.1M Views',
  '715.3M Views',
  '1.2 Billion Views',
];

// NPC MEDIA & CELEBRITY ACCOUNTS
export const MEDIA_AND_NPC_ACCOUNTS = [
  { name: 'Hollywood Pulse', handle: '@hollywoodpulse', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Media' },
  { name: 'Variety Wire', handle: '@varietywire', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Media' },
  { name: 'ScreenWire', handle: '@screenwire', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Media' },
  { name: 'The Velvet Rope', handle: '@velvetrope', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Media' },
  { name: 'Fame Insider', handle: '@fameinsider', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Media' },
  { name: 'Warner Bros Studios', handle: '@warnerbros', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType, category: 'Studio' },
  { name: 'Universal Pictures', handle: '@universalpics', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType, category: 'Studio' },
  { name: 'Silver Peak Studios', handle: '@silverpeakstudios', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType, category: 'Studio' },
  { name: 'Marcus Hayes', handle: '@marcushayes_official', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Actor' },
  { name: 'Seraphina Sterling', handle: '@seraphina_s', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Actor' },
  { name: 'Sofia Fischer', handle: '@sofia_fischer_dir', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, category: 'Director' },
  { name: 'Apex Luxury Apparel', handle: '@apexluxury', avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType, category: 'Brand' },
];

export const GENERAL_NPC_HEADLINES = [
  'BREAKING: Summer box office figures shatter 5-year records as theater attendance spikes worldwide!',
  'RUMOR: Major studio in secret bidding war for upcoming $150M superhero trilogy script.',
  'SAG-AFTRA casting directors issue urgent callboard for fresh action-thriller lead actors.',
  'Behind the scenes: Directors discuss the industry-wide shift toward practical stunts over CGI.',
  'Red Carpet Preview: Award season predictions hint at major snubs and surprise frontrunners.',
  'Leaked memos reveal upcoming sci-fi blockbuster budget expanded to $180M.',
  'Exclusive interview: Leading casting directors share what impresses them during chemistry reads.',
  'Gossip Roundup: Chateau Marmont post-premiere party draws Hollywood royalty and A-listers.',
  'Legal Briefing: Major studio copyright dispute settled out of court for undisclosed millions.',
  'PR Strategy: How celebrity endorsement contracts are evolving in the digital streaming era.',
  'BOX OFFICE UPDATE: Sci-Fi epic passes $500M international threshold in record 3 weeks.',
];

// CONTEXTUAL COMMENT POOL
export const FAN_COMMENT_POOL = [
  'First! Love your work so much! ❤️',
  'Always dropping quality content on here!',
  'Need an update on your next movie ASAP! 🎬',
  'So inspiring to watch your journey in Hollywood.',
  'Is a sequel coming out soon?!',
  'Such a legendary talent! 👑',
  'This post just made my day!',
  'Can we get a behind-the-scenes look next time?',
  'Underrated star, deserves way more hype!',
  'Representing the industry so well!',
  'Watching your career grow has been amazing!',
  'Best actor of this generation, period. 🔥',
  'Hope to meet you at a premiere one day!',
  'Stay shining! Hollywood needs more genuine talent.',
  'The dedication is unmatched! 🙌',
];

export const FILM_COMMENT_POOL = [
  'Can’t wait to see this on the big screen! 🍿',
  'The cinematography in your last project was insane!',
  'Is this for an upcoming theatrical release or streaming?',
  'Marking my calendar for opening weekend!',
  'Loved your performance in the recent film, pure craft.',
  'Standing ovation material right here! 👏',
  'Hope you get nominated for Best Lead Actor!',
  'This looks like another blockbuster in the making.',
];

export const BUSINESS_COMMENT_POOL = [
  'Boss moves! Love seeing actors build real business empires.',
  'Is this new venture hiring? Congrats on expanding your empire!',
  'Smart diversification. True mogul mindset in Hollywood.',
  'Congratulations on the expansion! Big things ahead.',
];

export const VIP_VERIFIED_COMMENTS = [
  { name: 'Sofia Fischer', handle: '@sofia_fischer_dir', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, text: 'Great seeing this energy! Let’s discuss that script idea soon. 🎬' },
  { name: 'Hollywood Pulse', handle: '@hollywoodpulse', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, text: 'Covering this update in our upcoming industry newsletter! ✨' },
  { name: 'Marcus Hayes', handle: '@marcushayes_official', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, text: 'Keep crushing it my friend! 🙌' },
];

export class SocialsService {
  private static state: SocialsState | null = null;

  public static getState(): SocialsState {
    if (this.state) return this.state;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.state = JSON.parse(raw);
        if (this.state) {
          if (this.state.youtubeWatchHours === undefined) this.state.youtubeWatchHours = 0;
          if (!this.state.youtubeMonetizationStatus) this.state.youtubeMonetizationStatus = 'NOT_ELIGIBLE';
          // ---- CREATOR HQ MIGRATION (v4) ----
          if (typeof this.state.youtubeAuthorityXp !== 'number') {
            // Seed authority from existing channel so long-time creators keep progress
            const lifetimeVids = this.state.youtubeAlgorithm?.lifetimeVideos || this.state.youtubeVideos.length;
            const viewsSeed = Math.floor((this.state.youtubeTotalViews || 0) / 1000);
            this.state.youtubeAuthorityXp = Math.min(1500, lifetimeVids * 9 + viewsSeed);
          }
          if (typeof this.state.youtubeBalance !== 'number') this.state.youtubeBalance = 0;
          if (!Array.isArray(this.state.youtubePendingPayouts)) this.state.youtubePendingPayouts = [];
          // Lifetime earned: seed from current balances once (honest baseline —
          // history before this field existed is baked into what you hold)
          if (!this.state.socialLifetimeEarned) {
            this.state.socialLifetimeEarned = {
              youtube: this.state.youtubeBalance || 0,
              instagram: 0, twitter: 0, facebook: 0, reddit: 0, telegram: 0,
            };
            if (typeof this.state.instagramBalance === 'number') this.state.socialLifetimeEarned.instagram = this.state.instagramBalance;
            if (typeof this.state.twitterBalance === 'number') this.state.socialLifetimeEarned.twitter = this.state.twitterBalance;
          }
          if (!Array.isArray(this.state.youtubeScheduled)) this.state.youtubeScheduled = [];
          if (typeof this.state.youtubeLifetimeUploads !== 'number') this.state.youtubeLifetimeUploads = this.state.youtubeVideos.length;
          if (typeof this.state.youtubeUploadStreak !== 'number') this.state.youtubeUploadStreak = 0;
          // ---- GRAM HQ MIGRATION (v4) ----
          if (typeof this.state.instagramAuthorityXp !== 'number') {
            // Seed from real account size so existing accounts keep progress
            const igFollowers = this.state.followers.Instagram || 0;
            this.state.instagramAuthorityXp = Math.min(1500, Math.floor(igFollowers / 40));
          }
          if (typeof this.state.instagramBalance !== 'number') this.state.instagramBalance = 0;
          if (!Array.isArray(this.state.instagramPendingPayouts)) this.state.instagramPendingPayouts = [];
          if (!Array.isArray(this.state.instagramScheduled)) this.state.instagramScheduled = [];
          if (!Array.isArray(this.state.instagramCreatorPosts)) this.state.instagramCreatorPosts = [];
          if (typeof this.state.instagramLifetimePosts !== 'number') this.state.instagramLifetimePosts = 0;
          if (typeof this.state.instagramPostStreak !== 'number') this.state.instagramPostStreak = 0;
          // ---- X HQ MIGRATION (v4) ----
          if (typeof this.state.twitterAuthorityXp !== 'number') {
            const twFollowers = this.state.followers.Twitter || 0;
            this.state.twitterAuthorityXp = Math.min(1500, Math.floor(twFollowers / 40));
          }
          if (typeof this.state.twitterBalance !== 'number') this.state.twitterBalance = 0;
          if (!Array.isArray(this.state.twitterPendingPayouts)) this.state.twitterPendingPayouts = [];
          if (!Array.isArray(this.state.twitterScheduled)) this.state.twitterScheduled = [];
          if (!Array.isArray(this.state.twitterCreatorPosts)) this.state.twitterCreatorPosts = [];
          if (typeof this.state.twitterLifetimePosts !== 'number') this.state.twitterLifetimePosts = 0;
          if (typeof this.state.twitterPostStreak !== 'number') this.state.twitterPostStreak = 0;
          // Seed the tracked count so OLD feed posts don't retroactively convert
          if (typeof this.state.twitterTrackedFeedCount !== 'number') {
            this.state.twitterTrackedFeedCount = (this.state.playerPosts?.Twitter?.length) || 0;
          }
          if (!this.state.socialMonthlyEarnings) {
            this.state.socialMonthlyEarnings = { year: this.state.lastProcessedYear || 2026, month: 'January', accrued: 0, postsCounted: 0 };
          }
          if (this.state.youtubeReviewWeeksLeft === undefined) this.state.youtubeReviewWeeksLeft = 0;
          if (this.state.youtubeCommunityStrikes === undefined) this.state.youtubeCommunityStrikes = 0;
          if (this.state.youtubeCopyrightStrikes === undefined) this.state.youtubeCopyrightStrikes = 0;
          if (!this.state.youtubeAlgorithmStatus) this.state.youtubeAlgorithmStatus = 'Observing New Creator';
          if (!this.state.youtubeChannelHealth) this.state.youtubeChannelHealth = 'Good Standing';
          if (!this.state.npcYouTubeChannels) this.state.npcYouTubeChannels = DEFAULT_NPC_YOUTUBE_CHANNELS;
          if (!this.state.socialAccounts) this.state.socialAccounts = {};
          if (!this.state.postsThisWeekByPlatform) this.state.postsThisWeekByPlatform = {};
        }
        return this.state!;
      }
    } catch (e) {
      console.warn('Failed to parse Socials State', e);
    }

    // Default initial state
    this.state = {
      createdPlatforms: {
        Twitter: localStorage.getItem('TWITTER_ACCOUNT_CREATED') === 'true',
        Facebook: localStorage.getItem('FACEBOOK_ACCOUNT_CREATED') === 'true',
        Instagram: localStorage.getItem('INSTAGRAM_ACCOUNT_CREATED') === 'true',
        Reddit: localStorage.getItem('REDDIT_ACCOUNT_CREATED') === 'true',
        YouTube: localStorage.getItem('YOUTUBE_ACCOUNT_CREATED') === 'true',
        Telegram: localStorage.getItem('TELEGRAM_ACCOUNT_CREATED') === 'true',
      },
      followers: {
        Twitter: parseInt(localStorage.getItem('TWITTER_FOLLOWERS') || '0', 10),
        Facebook: parseInt(localStorage.getItem('FACEBOOK_FOLLOWERS') || '0', 10),
        Instagram: parseInt(localStorage.getItem('INSTAGRAM_FOLLOWERS') || '0', 10),
        Reddit: parseInt(localStorage.getItem('REDDIT_FOLLOWERS') || '0', 10),
        YouTube: parseInt(localStorage.getItem('YOUTUBE_FOLLOWERS') || '0', 10),
        Telegram: parseInt(localStorage.getItem('TELEGRAM_FOLLOWERS') || '0', 10),
      },
      following: {
        Twitter: parseInt(localStorage.getItem('TWITTER_FOLLOWING') || '0', 10),
        Facebook: parseInt(localStorage.getItem('FACEBOOK_FOLLOWING') || '0', 10),
        Instagram: parseInt(localStorage.getItem('INSTAGRAM_FOLLOWING') || '0', 10),
        Reddit: parseInt(localStorage.getItem('REDDIT_FOLLOWING') || '0', 10),
        YouTube: parseInt(localStorage.getItem('YOUTUBE_FOLLOWING') || '0', 10),
        Telegram: parseInt(localStorage.getItem('TELEGRAM_FOLLOWING') || '0', 10),
      },
      verification: {
        Twitter: 'NONE',
        Facebook: 'NONE',
        Instagram: 'NONE',
        Reddit: 'NONE',
        YouTube: 'NONE',
        Telegram: 'NONE',
      },
      verificationRequests: {
        Twitter: { platform: 'Twitter', status: 'NONE' },
        Facebook: { platform: 'Facebook', status: 'NONE' },
        Instagram: { platform: 'Instagram', status: 'NONE' },
        Reddit: { platform: 'Reddit', status: 'NONE' },
        YouTube: { platform: 'YouTube', status: 'NONE' },
        Telegram: { platform: 'Telegram', status: 'NONE' },
      },
      playerPosts: {
        Twitter: [],
        Facebook: [],
        Instagram: [],
        Reddit: [],
        YouTube: [],
        Telegram: [],
      },
      postComments: {},
      bookmarkedIds: [],
      messages: [
        {
          id: 'msg_init',
          senderName: 'Hollywood Guild Welcome',
          senderHandle: '@hollywood_guild',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
          senderBadge: 'BLUE',
          text: 'Welcome to the official Hollywood Social Network Portal! Create accounts to start building your fanbase.',
          timestamp: 'Week 1',
          read: false,
          category: 'FAN',
        },
      ],
      writers: [
        {
          id: 'w_1',
          name: 'Liam Vance',
          tier: 'Low',
          agencyName: 'Westside Copywriting & PR',
          weeklyCost: 350,
          postsPerWeek: 3,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 15,
          hired: false,
          minFame: 500,
          minLeadRoles: 0,
          bio: 'Junior freelance copywriter. Helps emerging talent maintain consistent posting schedules and community interactions.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
        },
        {
          id: 'w_2',
          name: 'Sophia Sterling',
          tier: 'Medium',
          agencyName: 'Sterling PR Media Group',
          weeklyCost: 1250,
          postsPerWeek: 5,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 35,
          hired: false,
          minFame: 2500,
          minLeadRoles: 1,
          bio: 'Experienced studio publicist. Specializes in promo rollouts, red carpet coverage, and follower retention.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop',
        },
        {
          id: 'w_3',
          name: 'Marcus Hayes',
          tier: 'Elite',
          agencyName: 'Beverly Hills PR Specialists',
          weeklyCost: 4500,
          postsPerWeek: 8,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 75,
          hired: false,
          minFame: 12000,
          minLeadRoles: 3,
          bio: 'A-List celebrity ghostwriter. Crafts high-converting viral campaigns for award nominees and major studio leads.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
        },
        {
          id: 'w_4',
          name: 'Vanguard Global PR',
          tier: 'Elite',
          agencyName: 'Vanguard Global Communications Inc.',
          weeklyCost: 12500,
          postsPerWeek: 12,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 150,
          hired: false,
          minFame: 40000,
          minLeadRoles: 5,
          bio: 'Top-tier global PR agency with 24/7 account management, viral algorithm strategies, and international press pushes.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop',
        },
        // 5-15 hireable bloggers - even if not hired they post when connected to game (not random, must happen)
        {
          id: 'b_1',
          name: 'Ava Reed - Hollywood Insider Blogger',
          tier: 'Low',
          agencyName: 'Hollywood Insider Blog Network',
          weeklyCost: 250,
          postsPerWeek: 4,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 10,
          hired: false,
          minFame: 300,
          minLeadRoles: 0,
          bio: 'Insider blogger covering movie releases, scandals, and red carpets. Posts when your film releases or scandal hits - always tags you.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop',
        },
        {
          id: 'b_2',
          name: 'Jaxon Cole - Gossip & Defamation Wire',
          tier: 'Medium',
          agencyName: 'Gossip Wire Media',
          weeklyCost: 600,
          postsPerWeek: 5,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 20,
          hired: false,
          minFame: 800,
          minLeadRoles: 0,
          bio: 'Gossip blogger specializing in defamation and scandal. If not hired, posts negative takes when you get a scandal - tags you.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
        },
        {
          id: 'b_3',
          name: 'Sierra Lane - Film Review Blogger',
          tier: 'Medium',
          agencyName: 'Cinema Review Collective',
          weeklyCost: 750,
          postsPerWeek: 4,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 25,
          hired: false,
          minFame: 1200,
          minLeadRoles: 1,
          bio: 'Film review blogger. Posts box office and critic reviews when your movie releases - always connected to your film.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
        },
        {
          id: 'b_4',
          name: 'Dylan Cross - Awards Watch Blogger',
          tier: 'Elite',
          agencyName: 'AwardsWatch Blog Network',
          weeklyCost: 1200,
          postsPerWeek: 5,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 35,
          hired: false,
          minFame: 2500,
          minLeadRoles: 1,
          bio: 'Awards season blogger. Posts when you are nominated or win, and when your film is in awards discussion.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop',
        },
        {
          id: 'b_5',
          name: 'Mika Sato - Tokyo Cinema Blog',
          tier: 'Elite',
          agencyName: 'Asia Cinema Blog Network',
          weeklyCost: 1500,
          postsPerWeek: 4,
          contractWeeksRemaining: 0,
          postsThisWeek: 0,
          qualityBoost: 30,
          hired: false,
          minFame: 3000,
          minLeadRoles: 2,
          bio: 'International blogger. Posts when you expand to global hubs or release internationally.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop',
        },
      ],
      postsRemainingThisWeek: 2,

      instagramPosts: [],
      instagramStories: [
        {
          id: 'st_1',
          authorName: 'Hollywood Pulse',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
          badge: 'BLUE',
          mediaUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop',
          caption: 'Red carpet glamour at the Hollywood premier gala tonight!',
          timestamp: '2h ago',
          seen: false,
        },
        {
          id: 'st_2',
          authorName: 'Warner Bros Studios',
          authorAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop',
          badge: 'GOLD',
          mediaUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop',
          caption: 'Soundstage 4 setup complete. Major production rolling next week! 🎬',
          timestamp: '5h ago',
          seen: false,
        },
      ],
      instagramReels: [
        {
          id: 'reel_1',
          title: 'Behind the Stunts: Practical FX vs CGI',
          videoThumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop',
          audioTag: 'Original Audio - Stunt Coordinator Guild',
          views: 1250000,
          likes: 98000,
          commentsCount: 2400,
          durationSec: 30,
        },
        {
          id: 'reel_2',
          title: 'Hollywood Red Carpet Transformation',
          videoThumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop',
          audioTag: 'Trending - Glamour Beats V2',
          views: 3400000,
          likes: 245000,
          commentsCount: 6800,
          durationSec: 15,
        },
      ],

      youtubeVideos: [],
      youtubeSubscribers: 0,
      youtubeWatchHours: 0,
      youtubeTotalViews: 0,
      youtubeMonetizationStatus: 'NOT_ELIGIBLE',
      youtubeAuthorityXp: 0,
      youtubeBalance: 0,
      youtubePendingPayouts: [],
      youtubeScheduled: [],
      youtubeLifetimeUploads: 0,
      youtubeUploadStreak: 0,
      instagramAuthorityXp: 0,
      instagramBalance: 0,
      instagramPendingPayouts: [],
      instagramScheduled: [],
      instagramCreatorPosts: [],
      instagramLifetimePosts: 0,
      instagramPostStreak: 0,
      instagramAccruedLastWeek: 0,
      twitterAuthorityXp: 0,
      twitterBalance: 0,
      twitterPendingPayouts: [],
      twitterScheduled: [],
      twitterCreatorPosts: [],
      twitterLifetimePosts: 0,
      twitterPostStreak: 0,
      twitterAccruedLastWeek: 0,
      twitterTrackedFeedCount: 0,
      socialMonthlyEarnings: { year: 2026, month: 'January', accrued: 0, postsCounted: 0 },
      youtubeReviewWeeksLeft: 0,
      youtubeCommunityStrikes: 0,
      youtubeCopyrightStrikes: 0,
      youtubeAlgorithmStatus: 'Observing New Creator',
      youtubeChannelHealth: 'Good Standing',
      npcYouTubeChannels: DEFAULT_NPC_YOUTUBE_CHANNELS,

      sponsorshipDeals: [], // BALANCED: Removed pre-seeded fake offers - sponsorships now only appear after Fame 500 + fans 10000 (Tier 1)
      fanFeed: [], // FIXED: Removed auto Jessica Miller comment - fan club starts empty
      premium: { tier: 'none', plan: 'none', expiresWeek: 0, expiresYear: 0 },
      youtubeAlgorithm: { lifetimeVideos: 0, discovered: false },
      facebookPosts: [],
      redditPosts: [],
      redditComments: [],
      marqueePosts: [],
      marqueeJobs: [],
      telegramStories: [],
      telegramChannelSubs: 0,
      redditKarma: 0,
      marqueeConnections: 0,
      facebookFriends: 0,
      creatorStudio: { totalImpressions: 0, totalAdRevenue: 0, weeklyAdRevenue: 0 },
      socialAccounts: {},
      postsThisWeekByPlatform: {},
      analyticsHistory: [],
      trendingTopics: ['#HollywoodRising', '#BoxOfficeRecord', '#OscarBuzz', '#SAGAwards', '#CaliforniaFilm'],
    };

    this.saveState(this.state);
    return this.state;
  }

  public static saveState(state: SocialsState): void {
    this.state = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save Socials state', e);
    }
  }

  // ============================================================
  // SOCIAL ACCOUNTS V3 — separate account creation per platform
  // ============================================================
  public static readonly PLATFORM_IDS = ['twitter', 'instagram', 'youtube', 'facebook', 'marquee', 'reddit', 'telegram'] as const;
  public static readonly PLATFORM_LABEL: Record<string, string> = {
    twitter: 'Twitter / X',
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
    marquee: 'The Marquee',
    reddit: 'Reddit',
    telegram: 'Telegram',
  };
  // Platforms with a writer-postable feed (Marquee is a professional network — no ghostwriters)
  public static readonly WRITER_PLATFORMS = ['twitter', 'instagram', 'youtube', 'facebook', 'reddit', 'telegram'] as const;

  private static pidToFeed(pid: string): PlatformType | null {
    const map: Record<string, PlatformType> = {
      twitter: 'Twitter', instagram: 'Instagram', youtube: 'YouTube',
      facebook: 'Facebook', reddit: 'Reddit', telegram: 'Telegram',
    };
    return map[pid] || null;
  }

  private static legacyActive(state: SocialsState, pid: string): boolean {
    const feed = SocialsService.pidToFeed(pid);
    if (feed && (state.followers[feed] || 0) > 0) return true;
    if (feed && state.createdPlatforms && state.createdPlatforms[feed]) return true;
    if (pid === 'marquee' && (state.marqueeConnections || 0) > 0) return true;
    return false;
  }

  /** Does the player have a created account on this platform? Legacy saves with
   *  existing progress are auto-materialized with a default handle. */
  public static hasAccount(pid: string, player?: any): boolean {
    const state = this.getState();
    if (!state.socialAccounts) state.socialAccounts = {};
    if (!state.socialAccounts[pid] && player && this.legacyActive(state, pid)) {
      state.socialAccounts[pid] = {
        handle: `@${String(player.firstName || 'player').toLowerCase()}${String(player.lastName || '').toLowerCase()}`,
        createdWeek: player.dateWeek || 1,
        createdYear: player.dateYear || 2026,
      };
      this.saveState(state);
    }
    return !!state.socialAccounts[pid];
  }

  public static getHandle(pid: string, player: any): string {
    const acc = this.getState().socialAccounts?.[pid];
    if (acc) return acc.handle;
    return `@${String(player?.firstName || 'player').toLowerCase()}${String(player?.lastName || '').toLowerCase()}`;
  }

  /** Create (open) a social account with the player's chosen handle. */
  public static createAccount(
    pid: string,
    handle: string,
    player: any
  ): { success: boolean; message: string; handle: string } {
    const state = this.getState();
    if (!state.socialAccounts) state.socialAccounts = {};
    if (state.socialAccounts[pid]) return { success: false, message: `You already have a ${SocialsService.PLATFORM_LABEL[pid] || pid} account.`, handle: state.socialAccounts[pid].handle };

    let clean = String(handle || '').trim().replace(/\s+/g, '_');
    if (!clean) return { success: false, message: 'Choose a name for your account first.', handle: '' };
    if (!clean.startsWith('@') && (pid === 'twitter' || pid === 'instagram' || pid === 'reddit' || pid === 'telegram' || pid === 'youtube' || pid === 'marquee')) clean = `@${clean}`;
    if (clean.length < 3) return { success: false, message: 'Account name must be at least 3 characters.', handle: '' };

    state.socialAccounts[pid] = {
      handle: clean.slice(0, 24),
      createdWeek: player?.dateWeek || 1,
      createdYear: player?.dateYear || 2026,
    };
    this.saveState(state);
    return { success: true, message: `${SocialsService.PLATFORM_LABEL[pid] || pid} account created — welcome, ${clean}!`, handle: clean };
  }

  /** Track that the player (or their writer) posted on a platform this week. */
  public static notePlayerPost(pid: string): void {
    const state = this.getState();
    if (!state.postsThisWeekByPlatform) state.postsThisWeekByPlatform = {};
    state.postsThisWeekByPlatform[pid] = (state.postsThisWeekByPlatform[pid] || 0) + 1;
    this.saveState(state);
  }

  /**
   * AIRDROP ANNOUNCEMENT — auto-posted on X (and Telegram if the account
   * exists) the moment the founder airdrops tokens. Reach scales from the
   * REAL follower count of each platform; airdrop posts skew viral because
   * free money travels. Returns followers + fans gained for the caller.
   */
  public static postAirdropAnnouncement(player: any, input: { symbol: string; coinName: string; tokenAmount: number; fmtAmount: string }): { success: boolean; message: string; followersGained: number; fansGained: number } {
    const state = this.getState();
    const targets: Array<{ pid: string; feed: PlatformType }> = [
      { pid: 'twitter', feed: 'Twitter' },
      { pid: 'telegram', feed: 'Telegram' },
    ];
    const active = targets.filter((t) => this.hasAccount(t.pid, player));
    if (active.length === 0) {
      return { success: false, message: 'No social account to announce on — create your X account to broadcast airdrops.', followersGained: 0, fansGained: 0 };
    }

    const text = `🪂 $${input.symbol} AIRDROP IS LIVE! ${input.fmtAmount} tokens, FREE, to the community. Claim → hold → we ride. First come, first served. 🚀`;
    const playerHandle = SocialsService.getHandle('twitter', player);
    let followersGained = 0;

    for (const t of active) {
      const followers = state.followers[t.feed] || 0;
      // airdrop posts reach 25-60% of the platform's real follower base
      const views = Math.floor(followers * (0.25 + Math.random() * 0.35));
      const likes = Math.floor(views * (0.04 + Math.random() * 0.04)); // free money engages harder
      const shares = Math.floor(views * 0.02);                          // claim-referral spread
      const comments = Math.floor(views * 0.006);

      const post: SocialPost = {
        id: `post_airdrop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        authorName: `${player.firstName} ${player.lastName}`,
        authorHandle: playerHandle,
        authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
        platform: t.feed,
        tab: 'PLAYER_FEED',
        text,
        likes,
        comments,
        retweets: shares,
        shares,
        views,
        timestamp: 'Just now',
        isPlayer: true,
        isNpc: false,
        sentiment: 'Viral',
      };
      state.playerPosts[t.feed] = state.playerPosts[t.feed] || [];
      state.playerPosts[t.feed].unshift(post);
      // viral reach converts to followers at 0.8-1.6% (airdrop refugees follow the faucet)
      const gained = Math.floor(views * (0.008 + Math.random() * 0.008));
      followersGained += gained;
      state.followers[t.feed] = Math.min(500000000000, followers + gained);
    }
    this.saveState(state);

    return {
      success: true,
      followersGained,
      fansGained: followersGained, // fans grow 1:1 with real social followers
      message: `Airdrop posted to ${active.map((t) => t.feed).join(' + ')} — ${followersGained.toLocaleString()} new followers.`,
    };
  }

  // ---- NPC COIN CHATTER — crypto personas react to the player's fan token ----

  /** Crypto-native NPC accounts that trade celebrity fan tokens. */
  public static readonly CRYPTO_NPC_ACCOUNTS = [
    { name: 'DegenDuke', handle: '@degenduke_eth', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&auto=format&fit=crop', badge: 'NONE' as VerificationType, tone: 'hype' },
    { name: 'ChainQueen', handle: '@chainqueen.sol', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, tone: 'hype' },
    { name: 'RugDetective', handle: '@rugdetective', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, tone: 'audit' },
    { name: 'MoonOrRekt', handle: '@moonorrekt', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop', badge: 'NONE' as VerificationType, tone: 'chart' },
    { name: 'AirdropAddict', handle: '@airdropaddict', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop', badge: 'NONE' as VerificationType, tone: 'claimer' },
    { name: 'TokenTrending', handle: '@tokentrending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', badge: 'GOLD' as VerificationType, tone: 'news' },
    { name: 'WhaleWatcher', handle: '@whalewatch_wsb', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop', badge: 'BLUE' as VerificationType, tone: 'chart' },
    { name: 'FanTokenFanatic', handle: '@fantokenfanatic', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop', badge: 'NONE' as VerificationType, tone: 'claimer' },
  ];

  private static cryptoNpcPost(kind: 'claim' | 'hype' | 'chart' | 'audit', input: { symbol: string; coinName: string; holders?: number; pricePct?: number; rank?: number }): SocialPost {
    const acc = SocialsService.CRYPTO_NPC_ACCOUNTS[Math.floor(Math.random() * SocialsService.CRYPTO_NPC_ACCOUNTS.length)];
    const mcapText = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${Math.round(n / 1e6)}M`);
    const texts: Record<string, string[]> = {
      claim: [
        `🪂 JUST CLAIMED ${input.symbol} airdrop from @${input.coinName.toLowerCase().replace(/\s+/g, '')}! Free tokens just for holding the fan base. Team actually delivered. Claims still live, move fast 🚀 #Airdrop`,
        `${input.symbol} AIRDROP LANDED IN MY WALLET ✅ Founder said community first — respect. The flip side of fame tokens is real. Who else got in?`,
        `wake up babes, new ${input.symbol} airdrop just dropped 🪂 celebrity coins usually rug — this one came from an actual star with a real career. Watched.`,
      ],
      hype: [
        `Everyone sleeping on $${input.symbol}. Celebrity fan tokens print when their star releases movies — this founder has the hottest career in Hollywood right now. Do the math 🔥`,
        `$${input.symbol} community is DIFFERENT. Holders actually show up because they're fans of the work, not chart watchers. This is how fan tokens survive.`,
        `PSA: $${input.symbol} isn't another dead celeb coin. Real utility = access + bragging rights when ${input.coinName} drops something new. Volume tells the story. 📈`,
      ],
      chart: [
        `$${input.symbol} weekly: ${input.pricePct !== undefined && input.pricePct >= 0 ? '+' : ''}${(input.pricePct ?? 0).toFixed(1)}% · holders ${(input.holders || 0).toLocaleString()} · structured growth, no blow-off top yet. One to watch 👀`,
        `Ranking check: $${input.symbol} sits at ${input.rank ? '#' + input.rank : 'a climbing spot'} by market cap on Star Exchange. Fan tokens rarely hold a chart like this without paid promo. This one has organic flow.`,
      ],
      audit: [
        `Audited the $${input.symbol} contract basics: allocations published at launch (${input.holders ? (input.holders).toLocaleString() + ' tracked claimers' : 'real holder spread'}), no honeypot logic visible, liquidity locked pattern OK. Not financial advice — but it's not a rug template either. ✅`,
        `RUG-CHECK: $${input.symbol} passed the sniff test. Founder wallet visible on-chain and NOT dumping. Rare air for celebrity tokens.`,
      ],
    };
    const pool = texts[kind];
    const text = pool[Math.floor(Math.random() * pool.length)];
    const views = Math.floor(40000 + Math.random() * 900000);
    return {
      id: `npc_coin_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      authorName: acc.name,
      authorHandle: acc.handle,
      authorAvatar: acc.avatar,
      badge: acc.badge,
      platform: 'Twitter',
      tab: 'NPC_FEED',
      text,
      likes: Math.floor(views * (0.03 + Math.random() * 0.05)),
      comments: Math.floor(views * 0.004),
      retweets: Math.floor(views * 0.01),
      shares: Math.floor(views * 0.008),
      views,
      timestamp: `${Math.floor(Math.random() * 20) + 1}h ago`,
      isPlayer: false,
      isNpc: true,
      sentiment: kind === 'audit' ? 'Neutral' : 'Viral',
    };
  }

  /**
   * FIRE THE HYPE ENGINE after an airdrop: NPC recipients post claims
   * immediately, and a multi-week hype tail keeps crypto personas posting
   * about the coin (charts, audits, hype) while it trades.
   */
  public static igniteCoinHype(input: { symbol: string; coinName: string; holders: number }): void {
    const state = this.getState();
    state.playerPosts.Twitter = state.playerPosts.Twitter || [];
    // instant reactions: 3-5 claim posts right now
    const n = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      state.playerPosts.Twitter.unshift(SocialsService.cryptoNpcPost('claim', input));
    }
    // plus one analyst post on the launch stats
    state.playerPosts.Twitter.unshift(SocialsService.cryptoNpcPost('chart', input));
    // keep the tail burning
    state.playerCoinHype = { symbol: input.symbol, coinName: input.coinName, weeksLeft: 4 };
    this.saveState(state);
  }

  /** Weekly hype tick: decays, then spawns continuing NPC chatter while alive. */
  public static tickCoinHype(coinState?: { pricePct?: number; rank?: number; holders?: number }): string[] {
    const state = this.getState();
    const h = state.playerCoinHype;
    if (!h || h.weeksLeft <= 0) return [];
    state.playerPosts.Twitter = state.playerPosts.Twitter || [];
    const lines: string[] = [];
    const kinds: Array<'hype' | 'chart' | 'audit'> = ['hype', 'chart', 'audit'];
    const count = h.weeksLeft >= 3 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      state.playerPosts.Twitter.unshift(SocialsService.cryptoNpcPost(kinds[Math.floor(Math.random() * kinds.length)], {
        symbol: h.symbol,
        coinName: h.coinName,
        holders: coinState?.holders,
        pricePct: coinState?.pricePct,
        rank: coinState?.rank,
      }));
    }
    lines.push(`💬 Crypto X is still talking about $${h.symbol} — ${count} fresh takes from trader accounts.`);
    h.weeksLeft -= 1;
    if (h.weeksLeft <= 0) delete state.playerCoinHype;
    this.saveState(state);
    return lines;
  }

  /**
   * FOUNDER DUMP FALLOUT — crypto X turns on the founder after a big sell.
   * Whale alerts, outrage, audit-detective posts. Real follower dip on X
   * (holders unfollow a dumper). Returns recap lines for the caller.
   */
  public static spawnFounderDumpChatter(report: { symbol: string; supplyPct: number; slipPct: number; priceBefore: number; priceAfter: number }): string[] {
    const state = this.getState();
    state.playerPosts.Twitter = state.playerPosts.Twitter || [];
    const dropPct = ((report.priceBefore - report.priceAfter) / Math.max(0.000001, report.priceBefore)) * 100;
    const texts = [
      `🚨 WHALE ALERT: $${report.symbol} founder wallet just moved ${(report.supplyPct).toFixed(1)}% of supply to the exchange. Price ${dropPct >= 0 ? '-' : ''}${dropPct.toFixed(1)}% and falling. Do NOT catch this knife.`,
      `$${report.symbol} community is FURIOUS right now. Founder ate ${(report.slipPct)}% slippage and still cashed out. Order book was thinner than they thought. 🩸`,
      `RugDetective here: $${report.symbol} founder dumping ${(report.supplyPct).toFixed(1)}% of supply is NOT a rug (they kept the project alive) — but the trust scores are bleeding. Watch the community metrics before buying dips.`,
      `Sold my entire $${report.symbol} bag the second I saw the founder wallet move. Learned that lesson on three celebrity tokens last year. Never again.`,
      `$${report.symbol} down ${dropPct.toFixed(1)}% on founder liquidation. Exchange will be watching this one closely — founder-scale gains don't slip past the tax desk. 🧾`,
    ];
    const n = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const acc = SocialsService.CRYPTO_NPC_ACCOUNTS[Math.floor(Math.random() * SocialsService.CRYPTO_NPC_ACCOUNTS.length)];
      const views = Math.floor(60000 + Math.random() * 1200000); // dumps travel FASTER than airdrops
      state.playerPosts.Twitter.unshift({
        id: `npc_dump_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
        authorName: acc.name,
        authorHandle: acc.handle,
        authorAvatar: acc.avatar,
        badge: acc.badge,
        platform: 'Twitter',
        tab: 'NPC_FEED',
        text: texts[Math.floor(Math.random() * texts.length)],
        likes: Math.floor(views * (0.05 + Math.random() * 0.06)),
        comments: Math.floor(views * 0.008),
        retweets: Math.floor(views * 0.015),
        shares: Math.floor(views * 0.01),
        views,
        timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
        isPlayer: false,
        isNpc: true,
        sentiment: 'Criticism',
      });
    }
    // real follower dip — X holders unfollow a founder who dumps on them
    const dip = Math.floor((state.followers.Twitter || 0) * (0.03 + Math.random() * 0.05));
    if (dip > 0) state.followers.Twitter = Math.max(0, (state.followers.Twitter || 0) - dip);
    this.saveState(state);
    return [`🚨 Crypto X reacts to your $${report.symbol} dump — ${n} posts, mostly critical. ${dip.toLocaleString()} X followers walked.`, `🧾 Exchange reporting flagged the liquidation — expect the tax desk to open an emergency audit.`];
  }

  /** Player manual posting limit per platform per week. */
  public static readonly PLAYER_POSTS_PER_WEEK = 2;

  /** How many manual posts the player has left on a platform this week. */
  public static playerPostsLeft(pid: string): number {
    const state = this.getState();
    const used = state.postsThisWeekByPlatform?.[pid] || 0;
    return Math.max(0, SocialsService.PLAYER_POSTS_PER_WEEK - used);
  }

  /**
   * Pitch/Hire a ghostwriter/PR writer. Checks player qualifications,
   * generates an acceptance or rejection InboxMessage, and returns status.
   */
  public static pitchWriter(
    writerId: string,
    player: Player
  ): { success: boolean; message: string; inboxMsg: InboxMessage } {
    const state = this.getState();
    const writer = state.writers.find((w) => w.id === writerId);

    if (!writer) {
      throw new Error('Writer not found');
    }

    const minFame = writer.minFame || 0;
    const minLeadRoles = writer.minLeadRoles || 0;
    const weeklyCost = writer.weeklyCost;

    const playerFame = player.fameXp || 0;
    const playerLeadRoles = player.leadRolesCount || 0;
    const playerMoney = player.money || 0;

    const hasFame = playerFame >= minFame;
    const hasRoles = playerLeadRoles >= minLeadRoles;
    const hasCash = playerMoney >= weeklyCost * 2;

    const dateStr = `Week ${player.dateWeek || 1}, ${player.dateYear || 2026}`;

    if (hasFame && hasRoles && hasCash) {
      // Unhire any previous writer & hire selected writer
      state.writers.forEach((w) => {
        if (w.id === writerId) {
          w.hired = true;
          w.contractWeeksRemaining = 12;
        } else {
          w.hired = false;
        }
      });

      this.saveState(state);

      const inboxMsg: InboxMessage = {
        id: `msg_writer_accept_${Date.now()}`,
        category: 'SOCIAL',
        sender: writer.name,
        senderRole: writer.agencyName || 'PR & Ghostwriting Agency',
        senderAvatar: writer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
        subject: `RETAINER ACCEPTED: ${writer.name} joins your PR Team!`,
        body: `Dear ${player.firstName},\n\nI have reviewed your Hollywood portfolio, recent filmography (${playerLeadRoles} Lead Roles), and public standing (${playerFame.toLocaleString()} Fame XP). My agency is pleased to accept your retainer proposal.\n\nBeginning this week, my team will craft and publish 2 detailed strategic posts per week directly on your official ${SocialsService.PLATFORM_LABEL[writer.platform || 'twitter'] || 'social'} feed. We will also monitor fan comments and optimize your follower growth.\n\nWeekly Retainer Fee: $${weeklyCost.toLocaleString()}\n\nWelcome to our client roster!\n\nBest regards,\n${writer.name}\n${writer.agencyName || 'Hollywood PR Media Group'}`,
        date: dateStr,
        read: false,
      };

      return {
        success: true,
        message: `✍️ Retainer ACCEPTED! ${writer.name} is now managing your social media. Confirmation sent to Inbox.`,
        inboxMsg,
      };
    } else {
      const reasons: string[] = [];
      if (!hasFame) reasons.push(`Requires ${minFame.toLocaleString()} Fame XP (Your current: ${playerFame.toLocaleString()})`);
      if (!hasRoles) reasons.push(`Requires ${minLeadRoles} Lead Roles (Your current: ${playerLeadRoles})`);
      if (!hasCash) reasons.push(`Requires at least $${(weeklyCost * 2).toLocaleString()} liquid cash reserves (Your current: $${playerMoney.toLocaleString()})`);

      const inboxMsg: InboxMessage = {
        id: `msg_writer_decline_${Date.now()}`,
        category: 'SOCIAL',
        sender: writer.name,
        senderRole: writer.agencyName || 'PR & Ghostwriting Agency',
        senderAvatar: writer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
        subject: `RETAINER DECLINED: Offer from ${player.firstName} ${player.lastName}`,
        body: `Dear ${player.firstName},\n\nThank you for reaching out to my agency regarding PR representation and ghostwriting services.\n\nAfter auditing your current Hollywood standing, our board has concluded that your profile does not currently meet our client criteria:\n${reasons.map((r) => `• ${r}`).join('\n')}\n\nWe cannot take on your account at this time. We invite you to re-apply once you have expanded your filmography and increased your industry visibility.\n\nSincerely,\n${writer.name}\n${writer.agencyName || 'Hollywood PR Media Group'}`,
        date: dateStr,
        read: false,
      };

      return {
        success: false,
        message: `❌ Retainer DECLINED by ${writer.name}. Check your Inbox for their evaluation response.`,
        inboxMsg,
      };
    }
  }

  /**
   * Process weekly social media simulation on advanceWeek().
   * Resets weekly posts, calculates organic growth, processes writers, sponsorship offers,
   * fan club dues, website traffic, and generates recap data.
   */
  public static processEndWeek(
    player: Player,
    saveData?: any
  ): {
    socialPosts: string[];
    socialTrending: string[];
    socialReputation: string[];
    fanGrowth: number;
    weeklySponsorshipIncome: number;
    writerWeeklyCost?: number;
    youtubeRevenue?: number;
    expiredWriters?: Array<{ name: string; agencyName?: string; platform?: string; avatar?: string }>;
    /** YT mini-bank payouts that cleared this week → credit + inbox */
    ytPayoutArrivals?: Array<{ net: number; tax: number; gross: number; weeks: number }>;
    /** IG mini-bank payouts that cleared this week → credit + inbox */
    igPayoutArrivals?: Array<{ net: number; tax: number; gross: number; weeks: number }>;
    /** X mini-bank payouts that cleared this week → credit + inbox */
    twPayoutArrivals?: Array<{ net: number; tax: number; gross: number; weeks: number }>;
    /** YT ad revenue ACCRUED to the bank this week (display only — not wallet income) */
    youtubeAccruedToBank?: number;
    /** IG Creator Bonus ACCRUED to the bank this week (display only) */
    instagramAccruedToBank?: number;
  } {
    const state = this.getState();

    // ---- MONTHLY SOCIAL EARNINGS TRACKER ----
    // One global envelope across all platforms: real-engine range
    // $5,000 (active floor) to $25,000 (hard cap). Rolls over on month
    // change; month-end payouts are handled at section 7h.
    const monthNow = monthOfWeek(player.dateWeek || 1);
    if (!state.socialMonthlyEarnings || state.socialMonthlyEarnings.month !== monthNow || state.socialMonthlyEarnings.year !== (player.dateYear || 2026)) {
      state.socialMonthlyEarnings = { year: player.dateYear || 2026, month: monthNow, accrued: 0, postsCounted: 0 };
    }
    const remainingMonthlyCap = (): number => Math.max(0, SOCIAL_MONTHLY_CAP - (state.socialMonthlyEarnings?.accrued || 0));

    // Hired writers — each retained for ONE platform (posting handled below).
    // Player manual posts are capped at SocialsService.PLAYER_POSTS_PER_WEEK per platform.
    const hiredWriters = state.writers.filter((w) => w.hired);
    state.postsRemainingThisWeek = SocialsService.PLAYER_POSTS_PER_WEEK;

    const socialPosts: string[] = [];
    const socialTrending: string[] = [];
    const socialReputation: string[] = [];
    const expiredWriters: Array<{ name: string; agencyName?: string; platform?: string; avatar?: string }> = [];
    const ytPayoutArrivals: Array<{ net: number; tax: number; gross: number; weeks: number }> = [];
    const igPayoutArrivals: Array<{ net: number; tax: number; gross: number; weeks: number }> = [];
    const twPayoutArrivals: Array<{ net: number; tax: number; gross: number; weeks: number }> = [];
    let fanGrowth = 0;
    let weeklySponsorshipIncome = 0;
    let writerWeeklyCost = 0;

    // 2. Process PR Writers — SEPARATE WRITERS PER PLATFORM: each hired writer
    // auto-posts ONLY on the platform they were retained for
    const latestRealMovie = saveData?.releasedMovies && saveData.releasedMovies.length > 0 ? saveData.releasedMovies[0] : null;
    const realTitle = latestRealMovie?.movieTitle || '';
    const realGross = latestRealMovie?.worldwideGross || 0;
    const realAud = latestRealMovie?.audienceRating || 0;
    const realAwards = (player as any).awardsWon || 0;
    const realCritic = latestRealMovie?.criticRating || 0;
    const realOpening = latestRealMovie?.openingWeekendGross || 0;
    const realPosition = latestRealMovie?.boxOfficePosition || 0;
    const realWeeks = latestRealMovie?.weeksInCinemas || 0;
    const realIntl = latestRealMovie?.internationalGross || 0;
    const realRole = latestRealMovie?.roleType === 'Lead' ? 'leading' : latestRealMovie?.roleType === 'Principal' ? 'principal' : 'supporting';
    const tag = realTitle ? realTitle.replace(/[^a-zA-Z0-9]/g, '') : '';
    const mM = (v: number) => `$${(v / 1000000).toFixed(1)}M`;
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    // Endless writer copy — the writer draws from the deep topic pool with
    // real data baked in and their specialty coloring the voice. Millions of
    // combinations; a feed never repeats.
    const writerPostData: WriterPostData = {
      title: realTitle,
      gross: realGross,
      opening: realOpening,
      position: realPosition,
      aud: realAud,
      critic: realCritic,
      intl: realIntl,
      weeks: realWeeks,
      awards: realAwards,
      role: realRole,
      firstName: player.firstName,
      tag,
    };

    const usedWriterTexts = new Set<string>();

    for (const hiredWriter of hiredWriters) {
      hiredWriter.postsThisWeek = 0;
      if (hiredWriter.contractWeeksRemaining > 0) {
        hiredWriter.contractWeeksRemaining -= 1;
      }
      if (hiredWriter.contractWeeksRemaining <= 0) {
        hiredWriter.hired = false;
        socialPosts.push(`📄 ${hiredWriter.name}'s ${SocialsService.PLATFORM_LABEL[hiredWriter.platform || 'twitter'] || ''} retainer expired.`);
        expiredWriters.push({ name: hiredWriter.name, agencyName: hiredWriter.agencyName, platform: hiredWriter.platform, avatar: hiredWriter.avatar });
        continue;
      }

      const pid = hiredWriter.platform || 'twitter';
      const feed = SocialsService.pidToFeed(pid);
      if (!feed || !this.hasAccount(pid, player)) continue;
      if (player.money < writerWeeklyCost + hiredWriter.weeklyCost) continue; // can't afford this writer this week

      writerWeeklyCost += hiredWriter.weeklyCost;
      // 2 posts every week; a 3rd "bonus" post can land while the movie is
      // still in theaters (fresh numbers = fresh news worth posting)
      const count = 2 + (realTitle && (latestRealMovie as any)?.inCinemas && Math.random() < 0.4 ? 1 : 0);

      const playerHandle = SocialsService.getHandle(pid, player);
      // Writer's specialty colors the voice — pool writer from SOCIAL_WRITER_POOL
      const poolWriter = SOCIAL_WRITER_POOL.find((w) => w.id === hiredWriter.id);
      // WRITER-POST REACH IS TIER-DRIVEN (real floors, not follower-scaled):
      // T1 5K-50K · T2 50K-150K · T3 150K-500K · T4 500K-2M per post.
      // Likes scale from the impressions at realistic ratios.
      const wrTier = poolWriter?.tier ?? 1;
      const tierFloor = [5000, 50000, 150000, 500000][wrTier - 1] || 5000;
      const tierCeil = [50000, 150000, 500000, 2000000][wrTier - 1] || 50000;
      const wrViews = Math.floor(tierFloor + Math.random() * (tierCeil - tierFloor));
      const wrLikes = Math.floor(wrViews * (0.02 + Math.random() * 0.03));
      const wrShares = Math.floor(wrViews * 0.008);
      const wrComments = Math.floor(wrViews * 0.004);
      for (let i = 0; i < count; i++) {
        const autoPostText = drawWriterPoolPost(poolWriter?.specialty || 'Film Reviewer', writerPostData, usedWriterTexts);

        const newPost: SocialPost = {
          id: `post_auto_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
          authorName: `${player.firstName} ${player.lastName}`,
          authorHandle: playerHandle,
          authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
          platform: feed,
          tab: 'PLAYER_FEED',
          text: autoPostText,
          likes: wrLikes,
          comments: wrComments,
          retweets: wrShares,
          shares: wrShares,
          views: wrViews,
          timestamp: 'Just now',
          isPlayer: true,
          isNpc: false,
          sentiment: 'Positive',
          generatedByWriter: true,
        };

        const autoComments = this.generateNpcCommentsForPost(newPost.id, autoPostText, 35, player);
        newPost.comments = autoComments.length;

        state.playerPosts[feed].unshift(newPost);
        state.postComments[newPost.id] = autoComments;

        // Separate fans: gains land ONLY on this writer's platform —
        // real reach converts to followers at 0.4-0.9% (impressions-driven)
        const wrFollowers = Math.floor(wrViews * (0.004 + Math.random() * 0.005));
        state.followers[feed] = Math.min(500000000000, (state.followers[feed] || 0) + wrFollowers);
        fanGrowth += wrFollowers;
      }

      // writer activity counts as platform activity for organic growth
      if (!state.postsThisWeekByPlatform) state.postsThisWeekByPlatform = {};
      state.postsThisWeekByPlatform[pid] = (state.postsThisWeekByPlatform[pid] || 0) + count;

      socialPosts.push(`✍️ ${hiredWriter.name} published ${count} strategic posts on ${SocialsService.PLATFORM_LABEL[pid] || pid}.`);
    }

    // 3. SEPARATE PER-PLATFORM ORGANIC GROWTH — each platform grows only from
    // ITS OWN activity (your posts + your writer there). Inactive platforms
    // are stagnant. No account = no growth at all.
    // NOTE: Twitter, Instagram & YouTube are owned by their CREATOR HQ
    // engines (tier-capped impressions/reach/views → real follower
    // conversion) — the generic organic loop must NOT also grow them or
    // it would double-count followers.
    const HQ_PLATFORMS = new Set(['twitter', 'instagram', 'youtube']);
    const fameFactor = Math.floor((player.fameXp || 0) * 0.7);
    const platformWeights: Record<string, number> = { twitter: 0.35, instagram: 0.40, youtube: 0.15, facebook: 0.05, reddit: 0.03, telegram: 0.02 };
    const growthLines: string[] = [];
    const activePids: string[] = [];
    for (const pid of SocialsService.WRITER_PLATFORMS) {
      if (!this.hasAccount(pid, player)) continue;
      const posts = state.postsThisWeekByPlatform?.[pid] || 0;
      if (posts > 0) activePids.push(pid);
      if (HQ_PLATFORMS.has(pid)) continue; // HQ engines grow these
      if (posts <= 0) continue;

      const activityMultiplier = 1.2 + Math.min(1.2, posts * 0.15);
      const weight = platformWeights[pid] || 0.1;
      const g = Math.floor(fameFactor * activityMultiplier * weight * (0.8 + Math.random() * 0.4));
      if (g > 0) {
        const feed = SocialsService.pidToFeed(pid)!;
        const capped = Math.min(500000000000, (state.followers[feed] || 0) + g);
        const actual = capped - (state.followers[feed] || 0);
        state.followers[feed] = capped;
        fanGrowth += actual;
        growthLines.push(`+${actual.toLocaleString()} on ${SocialsService.PLATFORM_LABEL[pid] || pid}`);
      }
    }

    // Recap line reflects ALL tracked activity — manual posts, writer posts
    // AND creator-HQ platforms (their growth is reported by their engines).
    if (growthLines.length > 0 && activePids.length > 0) {
      socialPosts.push(`📈 Platform activity on ${activePids.map((p) => SocialsService.PLATFORM_LABEL[p] || p).join(', ')} — organic growth: ${growthLines.join(' · ')}.`);
    } else if (activePids.length > 0) {
      socialPosts.push(`📈 Platform activity on ${activePids.map((p) => SocialsService.PLATFORM_LABEL[p] || p).join(', ')} — follower growth reported by their creator engines.`);
    } else {
      socialPosts.push(`📲 No platform activity this week — every account was stagnant. Post on a platform (or hire a writer there) to grow it.`);
    }

    // weekly activity counters reset
    state.postsThisWeekByPlatform = {};

    // FOLLOWERS ARE NOT GAME FANS: player.fans grows ONLY from movie
    // releases and award wins. Social followers live on the platforms.

    // 4. Update Dynamic Trending Topics based on actual gameplay
    const newTrends: string[] = [];
    if (saveData && saveData.releasedMovies && saveData.releasedMovies.length > 0) {
      const latestMovie = saveData.releasedMovies[0];
      const rawTitle = latestMovie.movieTitle || (latestMovie as any).title || '';
      if (rawTitle) {
        const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9]/g, '');
        if (cleanTitle) {
          newTrends.push(`#${cleanTitle}`);
          newTrends.push(`#${cleanTitle}BoxOffice`);
        }
        // STREAMING MILESTONE POST: platforms talk about YOUR movie while it's fresh
        const weeksOut = latestMovie.weeksInCinemas || latestMovie.weeksInTheaters || 99;
        if (weeksOut <= 4 && (latestMovie.worldwideGross || 0) > 0) {
          const views = Math.max(800000, Math.round((latestMovie.worldwideGross || 0) / 6));
          const viewsText = views >= 1000000000 ? `${(views / 1000000000).toFixed(1)}B` : views >= 1000000 ? `${(views / 1000000).toFixed(1)}M` : `${(views / 1000).toFixed(0)}K`;
          socialPosts.push(`📺 Streaming platforms spotlighting '${rawTitle}' — ${viewsText} global views this month!`);
        }
      }
    }
    if (player.awardsWon > 0) {
      newTrends.push('#AwardWinner');
    }
    newTrends.push('#HollywoodRising');
    newTrends.push('#FilmIncentives');
    newTrends.push('#RedCarpet');

    state.trendingTopics = newTrends;
    if (newTrends.length > 0) {
      socialTrending.push(`🔥 Trending Tag: ${newTrends[0]}`);
    }

    // 5. Process Active Sponsorship Deals
    state.sponsorshipDeals.forEach((deal) => {
      if (deal.status === 'ACTIVE' && deal.weeksRemaining > 0) {
        deal.weeksRemaining -= 1;
        weeklySponsorshipIncome += deal.weeklyPayout;
        socialPosts.push(`💰 Received $${deal.weeklyPayout.toLocaleString()} weekly payout from ${deal.brandName} sponsorship!`);

        if (deal.weeksRemaining <= 0) {
          deal.status = 'COMPLETED';
          socialPosts.push(`✅ Concluded sponsorship contract with ${deal.brandName}.`);
        }
      }
    });

    // 6. Generate New Brand Sponsorship Offers if requirements met
    const totalFollowersNow = Object.values(state.followers).reduce((a, b) => a + b, 0);
    // Level 3: Sponsorships only after Fame 800 + 10000 followers + 5 movies + SAG, no spam until Level 3
    const hasMoviesForSocialSponsor = (player.moviesCompleted || 0) >= 5;
    const hasSagForSocialSponsor = player.isUnionMember === true;
    const isIncubation = player.fameXp < 800; // Level 3
    if (totalFollowersNow >= 10000 && player.fameXp >= 800 && hasMoviesForSocialSponsor && hasSagForSocialSponsor && !isIncubation) {
      const pendingOffersCount = state.sponsorshipDeals.filter((d) => d.status === 'OFFER').length;
      if (pendingOffersCount < 1 && Math.random() < 0.15) {
        const brandNames = ['Gucci', 'Porsche', 'Apple', 'Ferrari', 'Netflix', 'Red Bull', 'Armani', 'Sony'];
        const chosenBrand = brandNames[Math.floor(Math.random() * brandNames.length)];
        const newDeal: SponsorshipDeal = {
          id: `sp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          brandName: `${chosenBrand} Official`,
          brandCategory: 'Luxury Fashion',
          brandLogo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150',
          deliverable: `Global Brand Ambassador & 2 Social Posts`,
          lumpSumPayout: Math.floor(totalFollowersNow * 0.8),
          weeklyPayout: Math.floor(totalFollowersNow * 0.15),
          durationWeeks: 4,
          weeksRemaining: 4,
          status: 'OFFER',
          minFollowersRequired: 25000,
          minFameRequired: 50,
        };
        state.sponsorshipDeals.unshift(newDeal);
        state.messages.unshift({
          id: `msg_sp_${Date.now()}`,
          senderName: `${chosenBrand} Partnerships`,
          senderHandle: `@${chosenBrand.toLowerCase()}_pr`,
          senderAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&auto=format&fit=crop',
          senderBadge: 'GOLD',
          text: `We would love to sponsor you as our Hollywood Brand Ambassador! Check your Sponsorships tab for contract details.`,
          timestamp: 'Week ' + player.dateWeek,
          read: false,
          category: 'BRAND',
        });
      }
    }

    // 7. Update YouTube Channel Stats & Organic Algorithm Simulation
    if (this.hasAccount('youtube', player)) {
      // 7a. Monetization Application Review Processing
      if (state.youtubeMonetizationStatus === 'UNDER_REVIEW') {
        state.youtubeReviewWeeksLeft = Math.max(0, (state.youtubeReviewWeeksLeft || 1) - 1);
        if (state.youtubeReviewWeeksLeft <= 0) {
          if ((state.youtubeCommunityStrikes || 0) === 0 && (state.youtubeCopyrightStrikes || 0) === 0) {
            state.youtubeMonetizationStatus = 'APPROVED';
            socialPosts.push(`🎉 CONGRATULATIONS! Your YouTube channel has been APPROVED for Monetization & Partner Program! AdSense revenue is now ACTIVE!`);
          } else {
            state.youtubeMonetizationStatus = 'REJECTED';
            socialPosts.push(`❌ Your YouTube Monetization application was REJECTED due to policy guidelines. Clean up your channel and re-apply.`);
          }
        } else {
          socialPosts.push(`⏳ YouTube Partner Program review in progress (${state.youtubeReviewWeeksLeft} week(s) remaining).`);
        }
      }

      // 7b. Monetization Requirement Check (1,000 Subs & 4,000 Watch Hours)
      if (state.youtubeMonetizationStatus === 'NOT_ELIGIBLE' || state.youtubeMonetizationStatus === 'REJECTED') {
        if (state.youtubeSubscribers >= 1000 && state.youtubeWatchHours >= 4000) {
          state.youtubeMonetizationStatus = 'ELIGIBLE';
          socialPosts.push(`⭐ You unlocked YouTube Monetization! (1,000 Subs & 4,000 Watch Hours reached). Click 'Apply for Monetization' in YouTube Studio.`);
        }
      }

      // 7c. THE ALGORITHM — tier-capped slow burn. Weekly view ceilings are
      //     HARD caps per authority tier; 1M lifetime views needs Tier 4+
      //     (1-2 game years of consistent uploads). Revenue accrues to the
      //     YT mini-bank (youtubeBalance) — only transfers reach the player.
      let totalYtRevenueThisWeek = 0;
      let totalNewViewsThisWeek = 0;
      let totalNewWatchHrsThisWeek = 0;
      let totalNewSubsThisWeek = 0;
      const tier = ytAuthorityTier(state.youtubeAuthorityXp || 0);

      // Publish any scheduled uploads due this week
      const publishedThisWeek: YouTubeScheduledUpload[] = [];
      state.youtubeScheduled = (state.youtubeScheduled || []).filter((sched) => {
        const due = sched.publishYear * 52 + sched.publishWeek <= (player.dateYear || 2026) * 52 + (player.dateWeek || 1);
        if (due) {
          publishedThisWeek.push(sched);
          const boost = sched.slotBoost || 1;
          state.youtubeVideos.unshift({
            id: `ytv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            title: sched.title,
            thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop',
            category: sched.category,
            views: 0,
            likes: 0,
            commentsCount: 0,
            watchTimeHours: 0,
            retentionPercent: Math.min(95, 35 + Math.round(sched.algoScore * 0.45)),
            ctrPercent: Math.min(14, 2 + Math.round(sched.algoScore * 0.09)),
            shares: 0,
            subscribersGained: 0,
            estimatedRevenue: 0,
            uploadWeek: player.dateWeek || 1,
            uploadYear: player.dateYear || 2026,
            duration: `${6 + Math.floor(Math.random() * 12)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            durationSec: 400 + Math.floor(Math.random() * 900),
            isEvergreen: false,
            slotBoost: boost,
            algoScore: sched.algoScore,
          });
          // Authority: every upload builds the channel (+ bonus for strong scores)
          state.youtubeAuthorityXp = (state.youtubeAuthorityXp || 0) + 9 + (sched.algoScore >= 70 ? 5 : 0);
          state.youtubeLifetimeUploads = (state.youtubeLifetimeUploads || 0) + 1;
          state.youtubeUploadStreak = (state.youtubeUploadStreak || 0) + 1;
          if (state.socialMonthlyEarnings) state.socialMonthlyEarnings.postsCounted++;
          return false;
        }
        return true;
      });
      for (const pub of publishedThisWeek) {
        socialPosts.push(`📺 PUBLISHED (scheduled): "${pub.title}" — ${pub.slotLabel}. Algorithm score ${pub.algoScore}.`);
      }
      // Consistency decay: a skipped week bleeds authority once uploads exist
      if (publishedThisWeek.length === 0 && (state.youtubeLifetimeUploads || 0) > 0) {
        state.youtubeAuthorityXp = Math.max(0, (state.youtubeAuthorityXp || 0) - 4);
        state.youtubeUploadStreak = 0;
      }

      // Active videos share the tier cap (last 6 weeks only get real push)
      const activeVideos = state.youtubeVideos.filter(
        (v) => (player.dateYear || 2026) * 52 + (player.dateWeek || 1) - (v.uploadYear * 52 + v.uploadWeek) <= 6
      );
      const capShare = tier.weeklyViewCap / Math.max(1, Math.min(activeVideos.length, 4));

      state.youtubeVideos.forEach((vid) => {
        const weeksOld = Math.max(0, (player.dateYear || 2026) * 52 + (player.dateWeek || 1) - (vid.uploadYear * 52 + vid.uploadWeek));
        const isActive = weeksOld <= 6;
        if (!isActive) return; // old videos are frozen history (no zombie growth)

        // Per-video score from real CTR/retention + publish-time score
        const score = Math.min(100, Math.round((vid.algoScore || 50) * 0.4 + vid.ctrPercent * 4 * 0.3 + vid.retentionPercent * 0.3));
        let velocity = capShare * (0.25 + (score / 100) * 0.75);

        // Category relevance
        if (vid.category === 'TRAILER') velocity *= 1.5;
        else if (vid.category === 'BEHIND_SCENES' || vid.category === 'AWARD_SPEECH') velocity *= 1.3;
        else if (vid.category === 'LIVESTREAM') velocity *= 0.8;

        // Slot timing + fame pull (fame helps but never overrides the cap)
        velocity *= vid.slotBoost || 1;
        velocity *= 1 + Math.min(0.6, (player.fameXp || 0) / 2500);

        // Early-life decay curve: week 0 smaller (test audience), peak wk 1-2, fade
        const lifeMult = weeksOld === 0 ? 0.4 : weeksOld === 1 ? 1 : weeksOld === 2 ? 0.85 : Math.pow(0.55, weeksOld - 2);
        velocity *= lifeMult;

        const newViews = Math.max(0, Math.floor(velocity * (0.8 + Math.random() * 0.4)));
        vid.views += newViews;
        totalNewViewsThisWeek += newViews;

        const durationSec = vid.durationSec || 600;
        const retention = (vid.retentionPercent || 50) / 100;
        const newWatchHrs = parseFloat(((newViews * durationSec * retention) / 3600).toFixed(1));
        vid.watchTimeHours = parseFloat(((vid.watchTimeHours || 0) + newWatchHrs).toFixed(1));
        totalNewWatchHrsThisWeek += newWatchHrs;

        if (newViews > 0) {
          const newLikes = Math.floor(newViews * ((vid.ctrPercent || 5) / 100) * 0.8);
          const newComments = Math.floor(newViews * 0.02);
          const newSubs = Math.floor(newViews * 0.012);
          vid.likes += newLikes;
          vid.commentsCount += newComments;
          vid.shares = (vid.shares || 0) + Math.floor(newViews * 0.01);
          vid.subscribersGained = (vid.subscribersGained || 0) + newSubs;
          totalNewSubsThisWeek += newSubs;
        }

        // Monetized revenue accrues to the YT MINI-BANK (not the wallet),
        // clamped by the global $25K monthly social envelope
        if (state.youtubeMonetizationStatus === 'APPROVED' && newViews > 0 && remainingMonthlyCap() > 0) {
          const rpm = tier.rpm + Math.random() * 0.8;
          const rev = Math.min(Math.floor((newViews / 1000) * rpm), remainingMonthlyCap());
          vid.estimatedRevenue += rev;
          totalYtRevenueThisWeek += rev;
          if (state.socialMonthlyEarnings) state.socialMonthlyEarnings.accrued += rev;
        }
      });

      // Engagement authority drip: performing channels build trust
      if (totalNewViewsThisWeek > 0) {
        state.youtubeAuthorityXp = (state.youtubeAuthorityXp || 0) + Math.min(6, Math.floor(totalNewViewsThisWeek / 800));
      }

      // YT BANK: accrue revenue + tick pending payouts
      if (totalYtRevenueThisWeek > 0) {
        state.youtubeBalance = (state.youtubeBalance || 0) + totalYtRevenueThisWeek;
        if (!state.socialLifetimeEarned) state.socialLifetimeEarned = { youtube: 0, instagram: 0, twitter: 0, facebook: 0, reddit: 0, telegram: 0 };
        state.socialLifetimeEarned.youtube += totalYtRevenueThisWeek;
        state.creatorStudio.totalAdRevenue += totalYtRevenueThisWeek;
        state.creatorStudio.weeklyAdRevenue = totalYtRevenueThisWeek;
      } else {
        state.creatorStudio.weeklyAdRevenue = 0;
      }
      (state as any).__ytAccrued = totalYtRevenueThisWeek;
      const ytArrivals: Array<{ net: number; tax: number; gross: number; weeks: number }> = [];
      state.youtubePendingPayouts = (state.youtubePendingPayouts || []).filter((po) => {
        po.weeksRemaining -= 1;
        if (po.weeksRemaining <= 0) {
          ytArrivals.push({ net: po.net, tax: po.taxWithheld, gross: po.gross, weeks: po.totalWeeks });
          return false;
        }
        return true;
      });
      ytPayoutArrivals.push(...ytArrivals);

      // Update Channel Totals
      state.youtubeWatchHours = parseFloat(((state.youtubeWatchHours || 0) + totalNewWatchHrsThisWeek).toFixed(1));
      state.youtubeSubscribers = (state.youtubeSubscribers || 0) + totalNewSubsThisWeek;
      state.youtubeTotalViews = (state.youtubeTotalViews || 0) + totalNewViewsThisWeek;

      if (totalYtRevenueThisWeek > 0) {
        socialPosts.push(`📺 YT ad revenue +$${totalYtRevenueThisWeek.toLocaleString()} → Creator Bank (balance $${(state.youtubeBalance || 0).toLocaleString()}).`);
      }

      // 7d. Update Algorithm Status from the authority ladder
      state.youtubeAlgorithmStatus = `Tier ${tier.tier} · ${tier.name} — weekly push capped at ${tier.weeklyViewCap.toLocaleString()} views`;

      // 7e. NPC Channels Activity
      if (state.npcYouTubeChannels) {
        state.npcYouTubeChannels.forEach((npc) => {
          const gain = Math.floor(Math.random() * 5000) + 1000;
          npc.subscribers += gain;
          if (npc.latestVideo) {
            npc.latestVideo.views += Math.floor(Math.random() * 25000) + 2000;
          }
        });
      }
    }

    // 7f. GRAM CREATOR HQ — Instagram reach-tier engine. NO fake followers:
    //     reach is tier-capped, converts at a small real rate into the
    //     account's TRUE follower count, and bonus revenue only accrues to
    //     the IG mini-bank once the account passes 10K real followers.
    let igAccruedThisWeek = 0;
    if (this.hasAccount('instagram', player)) {
      const igTier = igAuthorityTier(state.instagramAuthorityXp || 0);
      const igFollowersNow = state.followers.Instagram || 0;
      // REVENUE GATE: Gram Creator Bonuses require an ACTIVE PREMIUM
      // subscription — paying for premium is the only way posts earn.
      const igBonusActive = PremiumService.getActive(state);

      // Publish scheduled posts due this week (real feed posts + graded records)
      const igPublished: InstagramCreatorPost[] = [];
      state.instagramScheduled = (state.instagramScheduled || []).filter((sched) => {
        const due = sched.publishYear * 52 + sched.publishWeek <= (player.dateYear || 2026) * 52 + (player.dateWeek || 1);
        if (due) { igPublished.push(sched); return false; }
        return true;
      });
      let igNewFollowers = 0;
      for (const pub of igPublished) {
        state.instagramCreatorPosts = state.instagramCreatorPosts || [];
        state.instagramCreatorPosts.unshift({ ...pub, published: true });
        state.instagramAuthorityXp = (state.instagramAuthorityXp || 0) + 9 + (pub.algoScore >= 70 ? 5 : 0);
        state.instagramLifetimePosts = (state.instagramLifetimePosts || 0) + 1;
        state.instagramPostStreak = (state.instagramPostStreak || 0) + 1;
        if (state.socialMonthlyEarnings) state.socialMonthlyEarnings.postsCounted++;
      }
      if (igPublished.length === 0 && (state.instagramLifetimePosts || 0) > 0) {
        state.instagramAuthorityXp = Math.max(0, (state.instagramAuthorityXp || 0) - 4);
        state.instagramPostStreak = 0;
      }

      // Reach on active creator posts (last 3 weeks), tier-capped and shared
      const igActive = (state.instagramCreatorPosts || []).filter(
        (p) => (player.dateYear || 2026) * 52 + (player.dateWeek || 1) - (p.publishYear * 52 + p.publishWeek) <= 3
      );
      const igCapShare = igTier.weeklyReachCap / Math.max(1, Math.min(igActive.length, 4));
      for (const post of igActive) {
        const weeksOld = Math.max(0, (player.dateYear || 2026) * 52 + (player.dateWeek || 1) - (post.publishYear * 52 + post.publishWeek));
        let reach = igCapShare * (0.25 + (post.algoScore / 100) * 0.75);
        if (post.postType === 'REEL') reach *= 1.45;
        else if (post.postType === 'CAROUSEL' || post.postType === 'BTS') reach *= 1.2;
        else if (post.postType === 'STORY') reach *= 0.6;
        reach *= post.slotBoost || 1;
        reach *= 1 + Math.min(0.5, (player.fameXp || 0) / 3000);
        const lifeMult = weeksOld === 0 ? 0.45 : weeksOld === 1 ? 1 : Math.pow(0.4, weeksOld - 1);
        reach *= lifeMult;

        const wkReach = Math.max(0, Math.floor(reach * (0.8 + Math.random() * 0.4)));
        post.reach = (post.reach || 0) + wkReach;

        // REAL engagement from real reach
        const likeRate = 0.04 + (post.algoScore / 100) * 0.04;
        const wkLikes = Math.floor(wkReach * likeRate);
        const wkSaves = Math.floor(wkReach * (post.postType === 'REEL' || post.postType === 'BTS' ? 0.035 : 0.02));
        post.likes = (post.likes || 0) + wkLikes;
        post.saves = (post.saves || 0) + wkSaves;

        // REAL follower conversion — the account's true follower count moves
        const wkFollowers = Math.floor(wkReach * (0.006 + (post.algoScore / 100) * 0.006));
        post.followersGained = (post.followersGained || 0) + wkFollowers;
        igNewFollowers += wkFollowers;

        // Creator Bonus revenue → IG mini-bank (PREMIUM subscribers only,
        // clamped by the global $25K monthly envelope)
        if (igBonusActive && wkReach > 0 && remainingMonthlyCap() > 0) {
          const rev = Math.min(Math.floor((wkReach / 1000) * (igTier.rpm + Math.random() * 0.6)), remainingMonthlyCap());
          post.revenue = (post.revenue || 0) + rev;
          igAccruedThisWeek += rev;
          if (state.socialMonthlyEarnings) state.socialMonthlyEarnings.accrued += rev;
        }
      }
      if (igNewFollowers > 0) {
        state.followers.Instagram = Math.min(500000000000, igFollowersNow + igNewFollowers);
        fanGrowth += igNewFollowers;
      }
      if (igAccruedThisWeek > 0) {
        state.instagramBalance = (state.instagramBalance || 0) + igAccruedThisWeek;
        if (!state.socialLifetimeEarned) state.socialLifetimeEarned = { youtube: 0, instagram: 0, twitter: 0, facebook: 0, reddit: 0, telegram: 0 };
        state.socialLifetimeEarned.instagram += igAccruedThisWeek;
        socialPosts.push(`📸 IG Creator Bonus +$${igAccruedThisWeek.toLocaleString()} → Gram Bank (balance $${(state.instagramBalance || 0).toLocaleString()}).`);
      }
      // Engagement authority drip
      if (igActive.length > 0 && (state.instagramCreatorPosts || [])[0]?.reach) {
        state.instagramAuthorityXp = (state.instagramAuthorityXp || 0) + Math.min(5, Math.floor(((state.instagramCreatorPosts[0].reach || 0)) / 6000));
      }

      // IG payout ticks
      const igArrivals: Array<{ net: number; tax: number; gross: number; weeks: number }> = [];
      state.instagramPendingPayouts = (state.instagramPendingPayouts || []).filter((po) => {
        po.weeksRemaining -= 1;
        if (po.weeksRemaining <= 0) {
          igArrivals.push({ net: po.net, tax: po.taxWithheld, gross: po.gross, weeks: po.totalWeeks });
          return false;
        }
        return true;
      });
      igPayoutArrivals.push(...igArrivals);
      state.instagramAccruedLastWeek = igAccruedThisWeek;
      (state as any).__igAccrued = igAccruedThisWeek;
    }

    // 7g. X CREATOR HQ — Twitter impressions-tier engine. NO fake followers:
    //     impressions convert at a small real rate into the account's TRUE
    //     follower count; ad payouts accrue to the X mini-bank only after
    //     the 5,000 real-follower gate.
    if (this.hasAccount('twitter', player)) {
      const twTier = twAuthorityTier(state.twitterAuthorityXp || 0);
      const twFollowersNow = state.followers.Twitter || 0;
      // REVENUE GATE: ads revenue requires an ACTIVE PREMIUM subscription —
      // paying for premium is the only way tweets earn.
      const twPayoutsActive = PremiumService.getActive(state);

      // Publish scheduled tweets due this week (scheduling API still available)
      const twPublished: TwitterCreatorPost[] = [];
      state.twitterScheduled = (state.twitterScheduled || []).filter((sched) => {
        const due = sched.publishYear * 52 + sched.publishWeek <= (player.dateYear || 2026) * 52 + (player.dateWeek || 1);
        if (due) { twPublished.push(sched); return false; }
        return true;
      });
      // Convert NEW manual feed posts into tracked creator tweets — the
      // composer on the platform drives the engine (no fake content).
      const twFeed = state.playerPosts.Twitter || [];
      const twTracked = state.twitterTrackedFeedCount ?? twFeed.length;
      if (twFeed.length > twTracked) {
        const freshPosts = twFeed.slice(0, twFeed.length - twTracked);
        for (const fp of freshPosts) {
          const inferred: TwitterCreatorPost['tweetType'] =
            (fp.text || '').length > 180 ? 'THREAD' : (fp.text || '').includes('?') ? 'POLL' : 'HOT_TAKE';
          const sc = computeTwAlgoScore({
            text: fp.text || '',
            tweetType: inferred,
            slotBoost: 1.0,
            authorityXp: state.twitterAuthorityXp || 0,
            hasActiveMovie: false,
          });
          twPublished.push({
            id: `twc_feed_${fp.id}`,
            text: fp.text || '',
            tweetType: inferred,
            slotBoost: 1.0,
            slotLabel: 'Standard post',
            algoScore: sc.score,
            publishWeek: player.dateWeek || 1,
            publishYear: player.dateYear || 2026,
            createdWeek: player.dateWeek || 1,
            createdYear: player.dateYear || 2026,
          });
        }
        state.twitterTrackedFeedCount = twFeed.length;
      }
      for (const pub of twPublished) {
        state.twitterCreatorPosts = state.twitterCreatorPosts || [];
        state.twitterCreatorPosts.unshift({ ...pub, published: true });
        state.twitterAuthorityXp = (state.twitterAuthorityXp || 0) + 9 + (pub.algoScore >= 70 ? 5 : 0);
        state.twitterLifetimePosts = (state.twitterLifetimePosts || 0) + 1;
        state.twitterPostStreak = (state.twitterPostStreak || 0) + 1;
        if (state.socialMonthlyEarnings) state.socialMonthlyEarnings.postsCounted++;
      }
      if (twPublished.length === 0 && (state.twitterLifetimePosts || 0) > 0) {
        state.twitterAuthorityXp = Math.max(0, (state.twitterAuthorityXp || 0) - 4);
        state.twitterPostStreak = 0;
      }

      // Impressions on active tweets (last 3 weeks), tier-capped and shared
      const twActive = (state.twitterCreatorPosts || []).filter(
        (p) => (player.dateYear || 2026) * 52 + (player.dateWeek || 1) - (p.publishYear * 52 + p.publishWeek) <= 3
      );
      const twCapShare = twTier.weeklyImpressionCap / Math.max(1, Math.min(twActive.length, 4));
      let twNewFollowers = 0;
      let twAccrued = 0;
      for (const post of twActive) {
        const weeksOld = Math.max(0, (player.dateYear || 2026) * 52 + (player.dateWeek || 1) - (post.publishYear * 52 + post.publishWeek));
        let imps = twCapShare * (0.25 + (post.algoScore / 100) * 0.75);
        if (post.tweetType === 'HOT_TAKE') imps *= 1.4;
        else if (post.tweetType === 'THREAD' || post.tweetType === 'BTS_CLIP') imps *= 1.2;
        else if (post.tweetType === 'POLL') imps *= 0.85;
        imps *= post.slotBoost || 1;
        imps *= 1 + Math.min(0.5, (player.fameXp || 0) / 3000);
        const lifeMult = weeksOld === 0 ? 0.45 : weeksOld === 1 ? 1 : Math.pow(0.4, weeksOld - 1);
        imps *= lifeMult;

        const wkImps = Math.max(0, Math.floor(imps * (0.8 + Math.random() * 0.4)));
        post.impressions = (post.impressions || 0) + wkImps;

        // REAL engagement from real impressions
        const likeRate = 0.03 + (post.algoScore / 100) * 0.035;
        post.likes = (post.likes || 0) + Math.floor(wkImps * likeRate);
        post.reposts = (post.reposts || 0) + Math.floor(wkImps * (0.004 + (post.algoScore / 100) * 0.006));
        post.replies = (post.replies || 0) + Math.floor(wkImps * 0.003);

        // REAL follower conversion — the true count only moves by this
        const wkFollowers = Math.floor(wkImps * (0.004 + (post.algoScore / 100) * 0.005));
        post.followersGained = (post.followersGained || 0) + wkFollowers;
        twNewFollowers += wkFollowers;

        // Ad-revenue payouts → X mini-bank (PREMIUM subscribers only,
        // clamped by the global $25K monthly envelope)
        if (twPayoutsActive && wkImps > 0 && remainingMonthlyCap() > 0) {
          const rev = Math.min(Math.floor((wkImps / 1000) * (twTier.rpm + Math.random() * 0.6)), remainingMonthlyCap());
          post.revenue = (post.revenue || 0) + rev;
          twAccrued += rev;
          if (state.socialMonthlyEarnings) state.socialMonthlyEarnings.accrued += rev;
        }
      }
      if (twNewFollowers > 0) {
        state.followers.Twitter = Math.min(500000000000, twFollowersNow + twNewFollowers);
        fanGrowth += twNewFollowers;
      }
      (state as any).__twAccrued = twAccrued;
      if (twAccrued > 0) {
        state.twitterBalance = (state.twitterBalance || 0) + twAccrued;
        if (!state.socialLifetimeEarned) state.socialLifetimeEarned = { youtube: 0, instagram: 0, twitter: 0, facebook: 0, reddit: 0, telegram: 0 };
        state.socialLifetimeEarned.twitter += twAccrued;
        socialPosts.push(`𝕏 Ad revenue +$${twAccrued.toLocaleString()} → X Bank (balance $${(state.twitterBalance || 0).toLocaleString()}).`);
      }
      state.twitterAccruedLastWeek = twAccrued;

      // X payout ticks
      const twArrivals: Array<{ net: number; tax: number; gross: number; weeks: number }> = [];
      state.twitterPendingPayouts = (state.twitterPendingPayouts || []).filter((po) => {
        po.weeksRemaining -= 1;
        if (po.weeksRemaining <= 0) {
          twArrivals.push({ net: po.net, tax: po.taxWithheld, gross: po.gross, weeks: po.totalWeeks });
          return false;
        }
        return true;
      });
      twPayoutArrivals.push(...twArrivals);
    }

    // Extra platform banks (Facebook / Reddit / Telegram): payout ticks —
    // deposits and any future earnings clear through the same pipeline.
    const extraArrivals: Array<{ net: number; tax: number; gross: number; weeks: number; platform: string }> = [];
    for (const pid of ['facebook', 'reddit', 'telegram'] as const) {
      const qf = `${pid}PendingPayouts`;
      const queue = (state as any)[qf] || [];
      if (queue.length === 0) continue;
      (state as any)[qf] = (queue as Array<YouTubePendingPayout & { _platform?: string }>).filter((po) => {
        po.weeksRemaining -= 1;
        if (po.weeksRemaining <= 0) {
          extraArrivals.push({ net: po.net, tax: po.taxWithheld, gross: po.gross, weeks: po.totalWeeks, platform: pid });
          return false;
        }
        return true;
      });
    }
    if (extraArrivals.length > 0) {
      // Credit straight to the wallet via the existing transfer-arrival path
      for (const a of extraArrivals) {
        twPayoutArrivals.push({ net: a.net, tax: a.tax, gross: a.gross, weeks: a.weeks });
        socialPosts.push(`💸 ${SocialsService.PLATFORM_LABEL[a.platform] || a.platform} bank transfer cleared: $${a.net.toLocaleString()} net.`);
      }
    }

    // 7h. MONTH-END SOCIAL PAYOUT — the ONLY way bank money leaves. On the
    //     closing week of each month: active creators get the $5K floor
    //     top-up if under it, every platform balance pays out automatically
    //     (YouTube is the ONLY platform taxed at 20%), and each payout
    //     clears to the wallet in 1-5 weeks with an inbox notice.
    const closingMonth = closingMonthOfWeek(player.dateWeek || 1, (player.dateWeek || 1) === 52);
    if (closingMonth) {
      const me = state.socialMonthlyEarnings!;
      const premiumActive = PremiumService.getActive(state);
      const ytMonetized = state.youtubeMonetizationStatus === 'APPROVED';
      const eligibleForFloor = (premiumActive || ytMonetized) && me.postsCounted >= 2;

      // $5,000 monthly floor for active premium/monetized creators
      if (eligibleForFloor && me.accrued < SOCIAL_MONTHLY_FLOOR) {
        const topUp = SOCIAL_MONTHLY_FLOOR - me.accrued;
        me.accrued = SOCIAL_MONTHLY_FLOOR;
        if (ytMonetized && this.hasAccount('youtube', player)) state.youtubeBalance = (state.youtubeBalance || 0) + topUp;
        else if (premiumActive && this.hasAccount('instagram', player)) state.instagramBalance = (state.instagramBalance || 0) + topUp;
        else if (premiumActive && this.hasAccount('twitter', player)) state.twitterBalance = (state.twitterBalance || 0) + topUp;
        socialPosts.push(`🏦 CREATOR SUPPORT: monthly earnings topped up to the $${SOCIAL_MONTHLY_FLOOR.toLocaleString()} floor (active creator minimum).`);
      }

      // Auto-payout every platform balance — YouTube taxed, others not
      const startPending = (
        arr: YouTubePendingPayout[] | undefined,
        gross: number,
        tax: number,
        platform: 'YouTube' | 'Instagram' | 'Twitter',
      ) => {
        const net = gross - tax;
        const weeks = 1 + Math.floor(Math.random() * 5);
        const list = arr || [];
        list.push({
          id: `mp_${platform}_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          gross, taxWithheld: tax, net,
          weeksRemaining: weeks, totalWeeks: weeks,
          requestedWeek: player.dateWeek || 1, requestedYear: player.dateYear || 2026,
        });
        return list;
      };

      const ytBal = state.youtubeBalance || 0;
      if (ytBal > 0) {
        const tax = Math.round(ytBal * YT_PAYOUT_TAX_PCT);
        state.youtubePendingPayouts = startPending(state.youtubePendingPayouts, ytBal, tax, 'YouTube');
        state.youtubeBalance = 0;
        socialPosts.push(`🏦 MONTH-END PAYOUT: YouTube $${ytBal.toLocaleString()} — $${tax.toLocaleString()} tax withheld (20%). Clears in 1-5 weeks.`);
      }
      const igBal = state.instagramBalance || 0;
      if (igBal > 0) {
        const igTax = Math.round(igBal * SOCIAL_BANK_TAX_PCT);
        state.instagramPendingPayouts = startPending(state.instagramPendingPayouts, igBal, igTax, 'Instagram');
        state.instagramBalance = 0;
        socialPosts.push(`🏦 MONTH-END PAYOUT: Instagram $${igBal.toLocaleString()} — $${igTax.toLocaleString()} creator tax withheld (20%). Clears in 1-5 weeks.`);
      }
      const twBal = state.twitterBalance || 0;
      if (twBal > 0) {
        const twTax = Math.round(twBal * SOCIAL_BANK_TAX_PCT);
        state.twitterPendingPayouts = startPending(state.twitterPendingPayouts, twBal, twTax, 'Twitter');
        state.twitterBalance = 0;
        socialPosts.push(`🏦 MONTH-END PAYOUT: X $${twBal.toLocaleString()} — $${twTax.toLocaleString()} creator tax withheld (20%). Clears in 1-5 weeks.`);
      }
      // Extra platform banks (Facebook / Reddit / Telegram) auto-pay at
      // month-end with the same 20% creator tax.
      for (const pid of ['facebook', 'reddit', 'telegram'] as const) {
        const bal = SocialsService.getSocialBankBalance(pid);
        if (bal > 0) {
          const pTax = Math.round(bal * SOCIAL_BANK_TAX_PCT);
          (state as any)[`${pid}PendingPayouts`] = startPending((state as any)[`${pid}PendingPayouts`], bal, pTax, pid.toUpperCase() as any);
          const f = SocialsService.bankField(pid);
          (state as any)[f] = 0;
          socialPosts.push(`🏦 MONTH-END PAYOUT: ${SocialsService.PLATFORM_LABEL[pid] || pid} $${bal.toLocaleString()} — $${pTax.toLocaleString()} creator tax withheld (20%). Clears in 1-5 weeks.`);
        }
      }
      if (ytBal === 0 && igBal === 0 && twBal === 0 && !eligibleForFloor) {
        socialPosts.push(`🏦 MONTH-END: no social payout — banks are empty. Posts only earn revenue with Premium (or YouTube monetization).`);
      }
    }

    const activePlatforms = (Object.keys(state.createdPlatforms) as PlatformType[]).filter((p) => state.createdPlatforms[p]);

    // 8. Record Social Analytics Snapshot
    state.lastProcessedWeek = player.dateWeek;
    state.lastProcessedYear = player.dateYear;
    state.analyticsHistory.unshift({
      week: player.dateWeek,
      year: player.dateYear,
      totalFollowers: totalFollowersNow,
      weeklyImpressions: totalFollowersNow * 12 + 1500,
      engagementRatePercent: parseFloat((3.5 + Math.random() * 2.0).toFixed(1)),
      topPostText: state.playerPosts.Twitter[0]?.text || 'No recent tweets',
      topAudienceCountry: 'United States (42%)',
      topPlatform: activePlatforms[0] || 'Twitter',
    });

    if (state.analyticsHistory.length > 20) {
      state.analyticsHistory = state.analyticsHistory.slice(0, 20);
    }

    // Weekly accrual snapshot for every bank panel (real revenue this week)
    state.socialWeeklyAccrued = {
      youtube: (state as any).__ytAccrued || 0,
      instagram: (state as any).__igAccrued || 0,
      twitter: (state as any).__twAccrued || 0,
      week: player.dateWeek || 1,
      year: player.dateYear || 2026,
    };

    this.saveState(state);

    const accruedThisWeek = (state.creatorStudio && (state as any).__ytAccrued) || 0;
    const igAccrued = ((state as any).__igAccrued) || 0;
    delete (state as any).__ytAccrued;
    delete (state as any).__igAccrued;
    delete (state as any).__twAccrued;

    return {
      socialPosts,
      socialTrending,
      socialReputation,
      fanGrowth,
      weeklySponsorshipIncome,
      writerWeeklyCost,
      youtubeRevenue: accruedThisWeek,
      ytPayoutArrivals,
      igPayoutArrivals,
      twPayoutArrivals,
      youtubeAccruedToBank: accruedThisWeek,
      instagramAccruedToBank: igAccrued,
      expiredWriters,
    };
  }

  /**
   * UNIVERSAL SOCIAL BANK TRANSFER — move a bank balance toward the player's
   * account. Minimum $20, 20% creator tax withheld on every platform, funds
   * clear in 1-5 weeks through the same real payout pipeline as month-end.
   */
  public static transferSocialBankToAccount(
    platform: string,
    player: { dateWeek?: number; dateYear?: number }
  ): { success: boolean; message: string; net?: number; tax?: number } {
    const state = this.getState();
    const balField = SocialsService.bankField(platform);
    const queueField = `${platform}PendingPayouts`;
    const label = `${SocialsService.PLATFORM_LABEL[platform] || platform} Bank`;
    if (!balField || typeof (state as any)[balField] === 'undefined') {
      // platforms without a dedicated balance field still work — field is created on demand
    }
    const balance = (state as any)[balField] || 0;
    if (balance < SOCIAL_BANK_MIN_TRANSFER) {
      return { success: false, message: `${label} holds $${balance.toLocaleString()} — transfers need at least $${SOCIAL_BANK_MIN_TRANSFER.toLocaleString()} accrued.` };
    }
    const tax = Math.round(balance * SOCIAL_BANK_TAX_PCT);
    const net = balance - tax;
    const weeks = 1 + Math.floor(Math.random() * 5);
    (state as any)[balField] = 0;
    const queue = (state as any)[queueField] || [];
    queue.push({
      id: `xfer_${platform}_${Date.now()}`,
      gross: balance,
      taxWithheld: tax,
      net,
      weeksRemaining: weeks,
      totalWeeks: weeks,
      requestedWeek: player?.dateWeek || state.lastProcessedWeek || 1,
      requestedYear: player?.dateYear || state.lastProcessedYear || 2026,
    });
    (state as any)[queueField] = queue;
    this.saveState(state);
    return {
      success: true,
      net,
      tax,
      message: `${label}: $${balance.toLocaleString()} transfer requested — $${tax.toLocaleString()} creator tax (20%) withheld, $${net.toLocaleString()} net clears to your account in ${weeks} week${weeks === 1 ? '' : 's'}.`,
    };
  }

  // ---- UNIVERSAL SOCIAL BANK HELPERS (all six platforms) ----

  /** Balance field mapping for every platform bank. */
  private static bankField(platform: string): string {
    return ({
      youtube: 'youtubeBalance', instagram: 'instagramBalance', twitter: 'twitterBalance',
      facebook: 'facebookBalance', reddit: 'redditBalance', telegram: 'telegramBalance',
    } as Record<string, string>)[platform] || '';
  }

  public static getSocialBankBalance(platform: string): number {
    const state = this.getState();
    const f = SocialsService.bankField(platform);
    return f ? ((state as any)[f] || 0) : 0;
  }

  /**
   * DEPOSIT your own cash into a platform bank — no tax on the way in
   * (it's already your money; the 20% creator tax applies on earnings
   * leaving through transfers/payouts). Fuel for giveaways and stunts.
   */
  public static depositToSocialBank(
    platform: string,
    amount: number,
    playerMoney: number
  ): { success: boolean; message: string } {
    if (!Number.isFinite(amount) || amount < 100) {
      return { success: false, message: 'Minimum deposit is $100.' };
    }
    if (playerMoney < amount) {
      return { success: false, message: `Insufficient cash — deposit needs $${amount.toLocaleString()}.` };
    }
    const f = SocialsService.bankField(platform);
    if (!f) return { success: false, message: 'Unknown platform bank.' };
    const state = this.getState();
    (state as any)[f] = ((state as any)[f] || 0) + amount;
    this.saveState(state);
    return { success: true, message: `Deposited $${amount.toLocaleString()} into ${platform} bank — no tax on deposits. Bank now holds $${((state as any)[f]).toLocaleString()}.` };
  }

  /** Lifetime gross earned per bank — cumulative, never resets. */
  public static getLifetimeEarned(platform: string): number {
    const s = this.getState().socialLifetimeEarned;
    return (s as any)?.[platform] || 0;
  }

  /** Credit earned revenue to a bank + its lifetime tracker (internal). */
  public static creditBankEarnings(platform: string, gross: number): void {
    if (!gross || gross <= 0) return;
    const f = SocialsService.bankField(platform);
    if (!f) return;
    const state = this.getState();
    (state as any)[f] = ((state as any)[f] || 0) + gross;
    if (!state.socialLifetimeEarned) {
      state.socialLifetimeEarned = { youtube: 0, instagram: 0, twitter: 0, facebook: 0, reddit: 0, telegram: 0 };
    }
    (state.socialLifetimeEarned as any)[platform] += gross;
  }

  /**
   * CREATOR HQ — schedule a video for a future week + audience slot.
   * Score is computed at schedule time and baked into the video at publish.
   */
  public static scheduleYouTubeVideo(input: {
    title: string;
    category: YouTubeVideo['category'];
    slotId: string;
    weeksFromNow: number; // 1-4
    hasActiveMovie: boolean;
  }): { success: boolean; message: string; score?: number } {
    const state = this.getState();
    if (!this.hasAccount('youtube')) return { success: false, message: 'Create your YouTube account first.' };
    const title = input.title.trim();
    if (!title) return { success: false, message: 'Enter a title — the algorithm scans it.' };

    const slot = YT_SLOTS.find((s) => s.id === input.slotId) || YT_SLOTS[0];
    const weeks = Math.max(1, Math.min(4, Math.floor(input.weeksFromNow)));
    const curWeek = state.lastProcessedWeek || 1;
    const curYear = state.lastProcessedYear || 2026;
    let targetWeek = curWeek + weeks;
    let targetYear = curYear;
    if (targetWeek > 52) { targetWeek -= 52; targetYear += 1; }

    const { score } = computeYtAlgoScore({
      title,
      category: input.category,
      slotBoost: slot.boost,
      authorityXp: state.youtubeAuthorityXp || 0,
      hasActiveMovie: input.hasActiveMovie,
    });

    state.youtubeScheduled = state.youtubeScheduled || [];
    if (state.youtubeScheduled.length >= 4) {
      return { success: false, message: 'Max 4 scheduled videos. Let some publish first.' };
    }
    state.youtubeScheduled.push({
      id: `yts_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title,
      category: input.category,
      slotBoost: slot.boost,
      slotLabel: slot.label,
      algoScore: score,
      publishWeek: targetWeek,
      publishYear: targetYear,
      createdWeek: curWeek,
      createdYear: curYear,
    });
    this.saveState(state);
    return {
      success: true,
      message: `Scheduled "${title}" — ${slot.label}, Week ${targetWeek}${targetWeek !== curWeek + weeks ? '' : ''}, ${targetYear}. Algorithm score ${score}.`,
      score,
    };
  }

  /**
   * CREATOR HQ — transfer from the YT mini-bank to the player wallet.
   * 20% tax withheld up front; funds clear in 1-5 weeks with an inbox notice.
   */
  public static requestYouTubePayout(amount: number): { success: boolean; message: string } {
    const state = this.getState();
    if (state.youtubeMonetizationStatus !== 'APPROVED') {
      return { success: false, message: 'Channel not monetized yet (1,000 subs + 4,000 watch hours + review).' };
    }
    const amt = Math.floor(amount);
    if (isNaN(amt) || amt <= 0) return { success: false, message: 'Enter an amount to transfer.' };
    const balance = state.youtubeBalance || 0;
    if (amt > balance) {
      return { success: false, message: `Insufficient Creator Bank balance — available $${balance.toLocaleString()}.` };
    }
    const tax = Math.round(amt * YT_PAYOUT_TAX_PCT);
    const net = amt - tax;
    const weeks = 1 + Math.floor(Math.random() * 5); // 1-5 weeks clearing
    state.youtubeBalance = balance - amt;
    state.youtubePendingPayouts = state.youtubePendingPayouts || [];
    state.youtubePendingPayouts.push({
      id: `ytp_${Date.now()}`,
      gross: amt,
      taxWithheld: tax,
      net,
      weeksRemaining: weeks,
      totalWeeks: weeks,
      requestedWeek: state.lastProcessedWeek || 1,
      requestedYear: state.lastProcessedYear || 2026,
    });
    this.saveState(state);
    return {
      success: true,
      message: `Transfer initiated: $${amt.toLocaleString()} requested — $${tax.toLocaleString()} tax withheld (20%). $${net.toLocaleString()} clears to your wallet in ~${weeks} week${weeks > 1 ? 's' : ''}.`,
    };
  }

  /**
   * GRAM HQ — schedule a creator post for a future week + slot.
   */
  public static scheduleInstagramPost(input: {
    caption: string;
    postType: InstagramCreatorPost['postType'];
    slotId: string;
    weeksFromNow: number;
    hasActiveMovie: boolean;
  }): { success: boolean; message: string; score?: number } {
    const state = this.getState();
    if (!this.hasAccount('instagram')) return { success: false, message: 'Create your Instagram account first.' };
    const caption = input.caption.trim();
    if (!caption) return { success: false, message: 'Write a caption — the algorithm scans the first line.' };

    const slot = IG_SLOTS.find((s) => s.id === input.slotId) || IG_SLOTS[0];
    const weeks = Math.max(1, Math.min(4, Math.floor(input.weeksFromNow)));
    const curWeek = state.lastProcessedWeek || 1;
    const curYear = state.lastProcessedYear || 2026;
    let targetWeek = curWeek + weeks;
    let targetYear = curYear;
    if (targetWeek > 52) { targetWeek -= 52; targetYear += 1; }

    const igFollowers = state.followers.Instagram || 0;
    if (input.postType === 'COLLAB' && igFollowers < 10000) {
      return { success: false, message: `Brand Collab posts unlock at 10,000 followers — you have ${igFollowers.toLocaleString()}.` };
    }

    const { score } = computeIgAlgoScore({
      caption,
      postType: input.postType,
      slotBoost: slot.boost,
      authorityXp: state.instagramAuthorityXp || 0,
      hasActiveMovie: input.hasActiveMovie,
    });

    state.instagramScheduled = state.instagramScheduled || [];
    if (state.instagramScheduled.length >= 4) {
      return { success: false, message: 'Max 4 scheduled posts. Let some publish first.' };
    }
    state.instagramScheduled.push({
      id: `igc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      caption,
      postType: input.postType,
      slotBoost: slot.boost,
      slotLabel: slot.label,
      algoScore: score,
      publishWeek: targetWeek,
      publishYear: targetYear,
      createdWeek: curWeek,
      createdYear: curYear,
    });
    this.saveState(state);
    return {
      success: true,
      message: `Scheduled — ${slot.label}, Week ${targetWeek}, ${targetYear}. Algorithm score ${score}.`,
      score,
    };
  }

  /**
   * GRAM HQ — transfer from the IG mini-bank. 20% tax withheld up front;
   * clears in 1-5 weeks with an inbox notice.
   */
  public static requestInstagramPayout(amount: number): { success: boolean; message: string } {
    const state = this.getState();
    const igFollowers = state.followers.Instagram || 0;
    if (igFollowers < 10000) {
      return { success: false, message: `Creator Bonuses unlock at 10,000 followers — you have ${igFollowers.toLocaleString()}.` };
    }
    const amt = Math.floor(amount);
    if (isNaN(amt) || amt <= 0) return { success: false, message: 'Enter an amount to transfer.' };
    const balance = state.instagramBalance || 0;
    if (amt > balance) {
      return { success: false, message: `Insufficient Gram Bank balance — available $${balance.toLocaleString()}.` };
    }
    const tax = Math.round(amt * IG_PAYOUT_TAX_PCT);
    const net = amt - tax;
    const weeks = 1 + Math.floor(Math.random() * 5);
    state.instagramBalance = balance - amt;
    state.instagramPendingPayouts = state.instagramPendingPayouts || [];
    state.instagramPendingPayouts.push({
      id: `igp_${Date.now()}`,
      gross: amt,
      taxWithheld: tax,
      net,
      weeksRemaining: weeks,
      totalWeeks: weeks,
      requestedWeek: state.lastProcessedWeek || 1,
      requestedYear: state.lastProcessedYear || 2026,
    });
    this.saveState(state);
    return {
      success: true,
      message: `Transfer initiated: $${amt.toLocaleString()} requested — $${tax.toLocaleString()} tax withheld (20%). $${net.toLocaleString()} clears in ~${weeks} week${weeks > 1 ? 's' : ''}.`,
    };
  }

  /**
   * X HQ — schedule a creator tweet for a future week + slot.
   */
  public static scheduleTwitterPost(input: {
    text: string;
    tweetType: TwitterCreatorPost['tweetType'];
    slotId: string;
    weeksFromNow: number;
    hasActiveMovie: boolean;
  }): { success: boolean; message: string; score?: number } {
    const state = this.getState();
    if (!this.hasAccount('twitter')) return { success: false, message: 'Create your X account first.' };
    const text = input.text.trim();
    if (!text) return { success: false, message: 'Write the tweet — the algorithm scans the hook.' };

    const slot = TW_SLOTS.find((s) => s.id === input.slotId) || TW_SLOTS[0];
    const weeks = Math.max(1, Math.min(4, Math.floor(input.weeksFromNow)));
    const curWeek = state.lastProcessedWeek || 1;
    const curYear = state.lastProcessedYear || 2026;
    let targetWeek = curWeek + weeks;
    let targetYear = curYear;
    if (targetWeek > 52) { targetWeek -= 52; targetYear += 1; }

    const { score } = computeTwAlgoScore({
      text,
      tweetType: input.tweetType,
      slotBoost: slot.boost,
      authorityXp: state.twitterAuthorityXp || 0,
      hasActiveMovie: input.hasActiveMovie,
    });

    state.twitterScheduled = state.twitterScheduled || [];
    if (state.twitterScheduled.length >= 4) {
      return { success: false, message: 'Max 4 scheduled tweets. Let some publish first.' };
    }
    state.twitterScheduled.push({
      id: `twc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text,
      tweetType: input.tweetType,
      slotBoost: slot.boost,
      slotLabel: slot.label,
      algoScore: score,
      publishWeek: targetWeek,
      publishYear: targetYear,
      createdWeek: curWeek,
      createdYear: curYear,
    });
    this.saveState(state);
    return {
      success: true,
      message: `Scheduled — ${slot.label}, Week ${targetWeek}, ${targetYear}. Algorithm score ${score}.`,
      score,
    };
  }

  /**
   * X HQ — transfer from the X mini-bank. Requires 5,000 REAL followers.
   * 20% tax withheld up front; clears in 1-5 weeks with an inbox notice.
   */
  public static requestTwitterPayout(amount: number): { success: boolean; message: string } {
    const state = this.getState();
    const twFollowers = state.followers.Twitter || 0;
    if (twFollowers < TW_PAYOUT_FOLLOWER_GATE) {
      return { success: false, message: `Ad-revenue payouts unlock at ${TW_PAYOUT_FOLLOWER_GATE.toLocaleString()} REAL followers — you have ${twFollowers.toLocaleString()}.` };
    }
    const amt = Math.floor(amount);
    if (isNaN(amt) || amt <= 0) return { success: false, message: 'Enter an amount to transfer.' };
    const balance = state.twitterBalance || 0;
    if (amt > balance) {
      return { success: false, message: `Insufficient X Bank balance — available $${balance.toLocaleString()}.` };
    }
    const tax = Math.round(amt * TW_PAYOUT_TAX_PCT);
    const net = amt - tax;
    const weeks = 1 + Math.floor(Math.random() * 5);
    state.twitterBalance = balance - amt;
    state.twitterPendingPayouts = state.twitterPendingPayouts || [];
    state.twitterPendingPayouts.push({
      id: `twp_${Date.now()}`,
      gross: amt,
      taxWithheld: tax,
      net,
      weeksRemaining: weeks,
      totalWeeks: weeks,
      requestedWeek: state.lastProcessedWeek || 1,
      requestedYear: state.lastProcessedYear || 2026,
    });
    this.saveState(state);
    return {
      success: true,
      message: `Transfer initiated: $${amt.toLocaleString()} requested — $${tax.toLocaleString()} tax withheld (20%). $${net.toLocaleString()} clears in ~${weeks} week${weeks > 1 ? 's' : ''}.`,
    };
  }

  /**
   * Evaluate Player Verification Request based on actual gameplay criteria.
   */
  public static evaluateVerificationRequest(
    platform: PlatformType,
    player: Player
  ): { approved: boolean; badge: VerificationType; reasons: string[] } {
    const state = this.getState();
    const followers = state.followers[platform] || 0;

    const reasons: string[] = [];

    const meetsFollowers = followers >= 50000;
    const meetsFame = player.fameXp >= 500;
    const meetsMovies = (player.moviesCompleted || 0) >= 1;
    const meetsUnion = player.isUnionMember;

    const hasBusiness = (player.empire && player.empire.weeklyBusinessIncome > 0) || (player.empire && player.empire.indieStudioOwned);
    const hasGlobalFollowers = followers >= 5000000;

    if (hasBusiness || hasGlobalFollowers) {
      return { approved: true, badge: 'GOLD', reasons: [] };
    }

    if (meetsFollowers || meetsFame || meetsMovies || meetsUnion) {
      return { approved: true, badge: 'BLUE', reasons: [] };
    }

    if (!meetsFollowers) {
      reasons.push(`• Requires at least 50,000 Followers on ${platform} (Current: ${followers.toLocaleString()})`);
    }
    if (!meetsFame) {
      reasons.push(`• Requires at least 500 Fame XP (Current: ${player.fameXp})`);
    }
    if (!meetsMovies) {
      reasons.push(`• Requires at least 1 completed theatrical/TV project`);
    }
    if (!meetsUnion) {
      reasons.push(`• Requires active SAG-AFTRA Guild membership`);
    }

    return { approved: false, badge: 'NONE', reasons };
  }

  /**
   * Calculate realistic post engagement metrics based on actual followers and verification.
   */
  public static calculatePostEngagement(
    followers: number,
    verification: VerificationType,
    player: Player,
    hasPRWriter: boolean
  ): { likes: number; commentsCount: number; shares: number; bookmarks: number; views: number; followerGain: number } {
    if (followers === 0 && player.fameXp === 0 && (player.moviesCompleted || 0) === 0) {
      return {
        likes: Math.floor(Math.random() * 3),
        commentsCount: 0,
        shares: 0,
        bookmarks: 0,
        views: Math.floor(Math.random() * 15) + 2,
        followerGain: Math.floor(Math.random() * 3),
      };
    }

    const verificationMultiplier = verification === 'GOLD' ? 2.2 : verification === 'BLUE' ? 1.5 : 1.0;
    const fameMultiplier = 1 + player.fameXp / 1000;
    const prMultiplier = hasPRWriter ? 1.3 : 1.0;

    const totalReachFactor = verificationMultiplier * fameMultiplier * prMultiplier;

    const baseLikes = Math.max(1, Math.floor(followers * (0.02 + Math.random() * 0.03) * totalReachFactor));
    const likes = Math.min(baseLikes, 5000000);

    const commentsCount = Math.floor(likes * (0.04 + Math.random() * 0.06));
    const shares = Math.floor(likes * (0.06 + Math.random() * 0.08));
    const bookmarks = Math.floor(likes * (0.03 + Math.random() * 0.05));
    const views = Math.floor(likes * (12 + Math.random() * 20));

    let followerGain = 0;
    if (followers < 500) {
      followerGain = Math.floor(Math.random() * 8) + 1;
    } else if (followers < 10000) {
      followerGain = Math.floor(Math.random() * 35) + 3;
    } else if (followers < 500000) {
      followerGain = Math.floor(Math.random() * 250) + 20;
    } else if (followers < 5000000) {
      followerGain = Math.floor(Math.random() * 2200) + 150;
    } else if (followers < 50000000) {
      followerGain = Math.floor(Math.random() * 15000) + 800;
    } else {
      followerGain = Math.floor(Math.random() * 85000) + 5000;
    }

    return { likes, commentsCount, shares, bookmarks, views, followerGain };
  }

  /**
   * Generate realistic NPC comments tailored specifically to post content,
   * active keywords, movie titles, and player context.
   */
  public static generateNpcCommentsForPost(
    postId: string,
    postText: string,
    count: number,
    player: Player
  ): PostComment[] {
    const comments: PostComment[] = [];
    const textLower = postText.toLowerCase();

    // Determine target count strictly between 20 and 100 comments
    let targetCount = count;
    if (!targetCount || targetCount < 20 || targetCount > 100) {
      const fameBonus = Math.min(25, Math.floor((player.fameXp || 0) / 40));
      const followerBonus = Math.min(25, Math.floor(Math.log10(Math.max(10, player.fans || 1000)) * 6));
      targetCount = Math.min(100, Math.max(20, 25 + Math.floor(Math.random() * 30) + fameBonus + followerBonus));
    }

    // Specific context & mood detection
    const isTrailer = textLower.includes('trailer') || textLower.includes('teaser') || textLower.includes('clip') || textLower.includes('preview') || textLower.includes('poster') || textLower.includes('first look');
    const isSetBts = textLower.includes('set') || textLower.includes('behind') || textLower.includes('bts') || textLower.includes('filming') || textLower.includes('stunt') || textLower.includes('camera') || textLower.includes('wrap');
    const isRedCarpet = textLower.includes('red carpet') || textLower.includes('premiere') || textLower.includes('gala') || textLower.includes('fashion') || textLower.includes('vogue') || textLower.includes('fit') || textLower.includes('look') || textLower.includes('dress');
    const isAward = textLower.includes('award') || textLower.includes('oscar') || textLower.includes('globes') || textLower.includes('trophy') || textLower.includes('nominee') || textLower.includes('winner');
    const isWealthFlex = textLower.includes('million') || textLower.includes('mansion') || textLower.includes('yacht') || textLower.includes('car') || textLower.includes('rolex') || textLower.includes('luxury') || textLower.includes('bought') || textLower.includes('rich') || textLower.includes('estate');
    const isWriterPR = textLower.includes('pr') || textLower.includes('team') || textLower.includes('agency') || textLower.includes('official') || textLower.includes('announcement') || textLower.includes('contract');
    const isVlogLifestyle = textLower.includes('vlog') || textLower.includes('workout') || textLower.includes('gym') || textLower.includes('daily') || textLower.includes('coffee') || textLower.includes('la') || textLower.includes('routine');

    // Sentiment Pools for Topic Contexts
    const positivePool: string[] = [];
    const neutralPool: string[] = [];
    const negativePool: string[] = [];

    if (isTrailer) {
      positivePool.push(
        "Saw the trailer for this! The cinematography and vocal delivery look 10/10. Opening night ticket locked! 🎟️🎬",
        "The intensity in your eyes during that teaser snippet... absolute cinematic perfection!",
        "RottenTomatoes needs to give this 100% already. Can't wait for opening weekend!",
        "This performance is going to silence all the critics. Full Oscar buzz incoming! 🏆",
        "Replaying that trailer clip on loop! The sound design and acting are next level.",
        "This teaser literally gave me chills! Highest anticipated release of the year! 🔥"
      );
      neutralPool.push(
        "Is this getting an IMAX release or standard digital first? Script seems intriguing.",
        "What's the official runtime for this cut? Hope they didn't trim the character arcs.",
        "Who composed the score for this trailer? Music sounds familiar.",
        "Is this adapted from a novel or an original screenplay?"
      );
      negativePool.push(
        "Overhyped trailer honestly... let's see if the box office numbers actually reflect the noise.",
        "Visuals look okay, but hopefully the CGI is finished before opening night.",
        "Trailer showed way too much of the second act. Why do studios keep doing this?",
        "Main premise feels a bit derivative of 90s cinema, but let's see."
      );
    } else if (isSetBts) {
      positivePool.push(
        "The sheer dedication you put into every single scene is insane! Love seeing the behind-the-scenes hustle. 🎬",
        "Working with a director of that caliber must be incredible. Legendary combo!",
        "This is why you're leading major Hollywood projects—the work ethic speaks for itself! 🔥",
        "Appreciate you giving us fans a glimpse into the actual filming process!",
        "Set design and practical lighting look unreal! Pure filmmaking craft. 🙌"
      );
      neutralPool.push(
        "Are you doing your own stunts or working with a double for this sequence?",
        "How many weeks of principal photography are left on location?",
        "What camera package are you guys shooting on? Looks like 70mm glass.",
        "Which studio soundstage are you filming at in LA?"
      );
      negativePool.push(
        "Hope the crew is getting paid overtime for those night shoots.",
        "Behind-the-scenes photos look hectic. Hopefully production stays on budget.",
        "Let's hope the final edit cuts out the filler scenes."
      );
    } else if (isRedCarpet) {
      positivePool.push(
        "This look belongs on the cover of Vogue! Best dressed actor in Hollywood right now 🔥✨",
        "The red carpet visuals are unmatched. Absolutely stunning styling!",
        "Stylist did an 11/10 job on this look. Pure Hollywood elegance.",
        "Stole the entire show at the premiere! Iconic look! 📸",
        "The confidence and poise on that carpet... true movie star energy!"
      );
      neutralPool.push(
        "Who is the designer behind that suit/gown? Needs a brand tag!",
        "Were there any other cast members at the premiere tonight?",
        "Where is the official afterparty taking place?"
      );
      negativePool.push(
        "Outfit choice is a bit experimental... preferred last year's gala fit.",
        "Felt a bit rushed during the carpet interview segment, but okay.",
        "Too much PR hype surrounding this premiere."
      );
    } else if (isAward) {
      positivePool.push(
        "Nobody deserved this nomination/award more! Years of hard work paying off 🏆❤️",
        "Standing ovation from the entire theater! Truly well-earned success.",
        "Your speech brought tears to my eyes. So proud to be a fan!",
        "First of many major Hollywood trophies! Keep setting the bar higher! ✨"
      );
      neutralPool.push(
        "Was this voted on by the Academy branch or the critics association?",
        "Who were the other nominees in this category this year?",
        "When does the ceremony highlight broadcast nationwide?"
      );
      negativePool.push(
        "Category was super competitive this year, surprising win.",
        "Felt like another nominee had a stronger narrative, but congrats regardless.",
        "Award shows have become so political lately."
      );
    } else if (isWealthFlex) {
      positivePool.push(
        "Real mogul energy! Love seeing actors build generational wealth in Hollywood. 💰👑",
        "Hard work pays off! Earned every single cent through relentless talent.",
        "Inspired by the drive and business mindset. Keep securing the bag! 🔥",
        "Living the true Hollywood dream. Absolute inspiration!"
      );
      neutralPool.push(
        "Is this property in Bel-Air or Malibu? Looks like prime real estate.",
        "What's the valuation on that asset portfolio currently?",
        "Did you buy this through your holding company or personal account?"
      );
      negativePool.push(
        "Must be nice flexing luxury assets while indie filmmakers struggle for funding.",
        "A bit flashier than usual, stay humble out there.",
        "Hollywood wealth posts always draw mixed opinions."
      );
    } else if (isWriterPR) {
      positivePool.push(
        "Great official update from the team! Appreciate the clear communication with the fanbase. 👏",
        "Exciting news! Your PR team and representation are doing incredible work.",
        "Love seeing the career expanding into new heights. We stay supporting! 🔥",
        "Major moves being made! Big respect to the whole team behind you."
      );
      neutralPool.push(
        "Will there be an official press conference or Q&A following this update?",
        "Which agency is managing this rollout?",
        "When do contract terms officially take effect?"
      );
      negativePool.push(
        "Felt like standard corporate PR speak, but good for business I guess.",
        "PR team is spinning this update hard today."
      );
    } else {
      positivePool.push(
        `Always love seeing updates from ${player.firstName}! Never miss a post. ❤️`,
        "Watching your career grow from early auditions to major stardom has been amazing!",
        "Best actor of our generation hands down! Keep pushing limits! 🔥",
        "Hollywood is lucky to have talent like this. Can't wait for what's next!",
        "The growth in your acting craft over the past few years is insane. Respect! 👏",
        "Sharing this with everyone! Keep making great cinema!",
        "Your filmography is becoming one of the cleanest in modern Hollywood! 🎬",
        "Always bringing authentic energy to every role and post!"
      );
      neutralPool.push(
        "Looking forward to hearing about your next signed script or contract.",
        "How is the current filming schedule looking for the rest of the year?",
        "Any upcoming podcast or radio interviews planned soon?",
        "Hope you get some rest between these back-to-back projects!"
      );
      negativePool.push(
        "Hoping the next role is more grounded and less mainstream blockbuster.",
        "Let's see if this momentum holds up through next quarter.",
        "Early work felt more raw, but still solid overall."
      );
    }

    // Fill default fallback comments if needed
    FAN_COMMENT_POOL.forEach((c) => positivePool.push(c));
    FILM_COMMENT_POOL.forEach((c) => positivePool.push(c));
    BUSINESS_COMMENT_POOL.forEach((c) => positivePool.push(c));

    // --- NPC Comment Deduplication ---
    // Modifiers that get appended to base comments to create unique variants.
    // With ~50 base texts × ~18 modifiers = ~900 unique combos per pool.
    const COMMENT_MODIFIERS = [
      '', '', '', '', // empty = use base text (5/18 chance)
      ' 💯', ' 🔥', ' ❤️', ' 👏', ' 🙌', ' ✨',
      ' So real for this.', ' No cap.', ' Huge!',
      ' Just facts.', ' This is it.', ' Underrated take.',
      ' People need to hear this.', ' Preach!', ' Speaks volumes.',
      ' Can\'t argue with that.', ' Well said.', ' Big facts.',
    ];
    const usedTexts = new Set<string>();

    // Shuffle a pool so we cycle through all items before repeating any
    const shuffleArray = (arr: string[]): string[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const shuffledPositive = shuffleArray(positivePool);
    const shuffledNeutral = shuffleArray(neutralPool);
    const shuffledNegative = shuffleArray(negativePool);
    let posIdx = 0, neuIdx = 0, negIdx = 0;

    const pickUniqueText = (pool: string[], shuffled: string[], idxRef: { value: number }): string => {
      // Try base text from shuffled pool first (cycle through all before repeating)
      for (let attempt = 0; attempt < 12; attempt++) {
        const base = shuffled[idxRef.value % shuffled.length];
        idxRef.value++;
        const mod = COMMENT_MODIFIERS[Math.floor(Math.random() * COMMENT_MODIFIERS.length)];
        const text = `${base}${mod}`;
        if (!usedTexts.has(text)) {
          usedTexts.add(text);
          return text;
        }
      }
      // Fallback: random from full pool with a numeric suffix
      const base = pool[Math.floor(Math.random() * pool.length)];
      return `${base} (${Math.floor(Math.random() * 9999) + 1})`;
    };

    // NPC Handle Generator Arrays (Guarantees NO duplicate handles per post)
    const usedHandles = new Set<string>();
    const FIRST_NAMES = [
      'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Chris', 'Riley', 'Avery', 'Dakota',
      'Ethan', 'Chloe', 'Liam', 'Olivia', 'Noah', 'Ava', 'Lucas', 'Sophia', 'Mason', 'Isabella',
      'Logan', 'Mia', 'James', 'Harper', 'Benjamin', 'Evelyn', 'Jacob', 'Abigail', 'Michael', 'Emily',
      'Daniel', 'Ella', 'Henry', 'Elizabeth', 'Jackson', 'Camila', 'Sebastian', 'Luna', 'Aiden', 'Sofia',
      'David', 'Aaliyah', 'Joseph', 'Scarlett', 'Carter', 'Victoria', 'Owen', 'Madison', 'Wyatt', 'Eleanor',
      'Dylan', 'Grace', 'Luke', 'Chloe', 'Gabriel', 'Penelope', 'Anthony', 'Layla', 'Isaac', 'Riley'
    ];
    const LAST_NAMES = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
      'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
    ];
    const PREFIXES = ['cinema_', 'film_', 'movie_', 'hollywood_', 'star_', 'screen_', 'boxoffice_', 'la_', 'reel_', 'the_real_', 'daily_', 'popculture_', 'redcarpet_', 'cinephile_'];
    const SUFFIXES = ['_fan', '_geek', '_lover', '_la', '_99', '_21', '_official', '_daily', '_vibe', '_pro', '_junkie', '_critic', '_club', '_vault', '_hq', '_zone'];

    const AVATARS = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop'
    ];

    for (let i = 0; i < targetCount; i++) {
      // 10% chance to insert VIP / Verified Accounts if player has high fame
      if (player.fameXp > 80 && Math.random() < 0.10 && VIP_VERIFIED_COMMENTS.length > 0) {
        const vip = VIP_VERIFIED_COMMENTS[Math.floor(Math.random() * VIP_VERIFIED_COMMENTS.length)];
        if (!usedHandles.has(vip.handle) && !usedTexts.has(vip.text)) {
          usedHandles.add(vip.handle);
          usedTexts.add(vip.text);
          comments.push({
            id: `cmt_vip_${postId}_${i}_${Math.random().toString(36).substring(2, 6)}`,
            postId,
            authorName: vip.name,
            authorHandle: vip.handle,
            authorAvatar: vip.avatar,
            badge: vip.badge,
            text: vip.text,
            timestamp: `${Math.floor(Math.random() * 20) + 1}m ago`,
            likes: Math.floor(Math.random() * 1200) + 150,
          });
          continue;
        }
      }

      // Generate unique name and handle
      const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const name = `${fn} ${ln}`;

      const pref = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
      const suff = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
      let handle = `@${pref}${fn.toLowerCase()}${suff}`;

      let tries = 0;
      while (usedHandles.has(handle) && tries < 20) {
        tries++;
        handle = `@${pref}${fn.toLowerCase()}_${Math.floor(Math.random() * 9999)}`;
      }
      usedHandles.add(handle);

      const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

      // Pick reaction sentiment: 62% Positive, 20% Neutral, 18% Negative
      // Uses deduplication — same text never appears twice within a post
      const roll = Math.random();
      let text = '';
      if (roll < 0.62) {
        text = pickUniqueText(positivePool, shuffledPositive, { value: posIdx });
        posIdx++;
      } else if (roll < 0.82) {
        text = neutralPool.length > 0
          ? pickUniqueText(neutralPool, shuffledNeutral, { value: neuIdx })
          : pickUniqueText(positivePool, shuffledPositive, { value: posIdx });
        neuIdx++;
      } else {
        text = negativePool.length > 0
          ? pickUniqueText(negativePool, shuffledNegative, { value: negIdx })
          : pickUniqueText(positivePool, shuffledPositive, { value: posIdx });
        negIdx++;
      }

      // Realistic timestamps spread throughout the last few hours
      const minutesAgo = Math.floor(Math.random() * 180) + 1;
      const timeStr = minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`;

      // Likes scale with fame and position in list
      const baseLikes = Math.floor(Math.random() * 80) + 2;
      const fameLikes = Math.floor((player.fameXp || 0) * (Math.random() * 0.8));

      comments.push({
        id: `cmt_${postId}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        postId,
        authorName: name,
        authorHandle: handle,
        authorAvatar: avatar,
        badge: Math.random() < 0.05 ? 'BLUE' : 'NONE',
        text,
        timestamp: timeStr,
        likes: baseLikes + fameLikes,
      });
    }

    return comments;
  }

  /**
   * Generate endless batch of realistic NPC & Government posts.
   * When a player movie context is provided, streaming platforms & bloggers
   * post about the player's REAL releases (no fake simulation).
   */
  public static generateNpcPostsBatch(
    platform: PlatformType,
    count: number,
    ctx?: { playerName?: string; releasedMovies?: any[]; fans?: number; fameXp?: number }
  ): SocialPost[] {
    const posts: SocialPost[] = [];
    const latestMovie = ctx?.releasedMovies && ctx.releasedMovies.length > 0 ? ctx.releasedMovies[0] : null;
    const playerTag = ctx?.playerName || 'the breakout star';

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      // Streaming & blogger posts reference REAL player movies when available
      const playerMovieActive = !!latestMovie && roll < 0.55;

      if (playerMovieActive && latestMovie) {
        const isStreaming = Math.random() < 0.5;
        const views = Math.max(800000, Math.round((latestMovie.worldwideGross || 80000000) / 6));
        const viewsText = views >= 1000000000 ? `${(views / 1000000000).toFixed(1)}B` : views >= 1000000 ? `${(views / 1000000).toFixed(1)}M` : `${(views / 1000).toFixed(0)}K`;
        const title = latestMovie.movieTitle || latestMovie.title || '';
        if (isStreaming) {
          const streamAcc = STREAMING_ACCOUNTS[Math.floor(Math.random() * STREAMING_ACCOUNTS.length)];
          posts.push({
            id: `stream_post_real_${platform}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
            authorName: streamAcc.name,
            authorHandle: streamAcc.handle,
            authorAvatar: streamAcc.avatar,
            badge: streamAcc.badge || ('GOLD' as VerificationType),
            platform,
            tab: 'NPC_FEED',
            text: `STREAMING SPOTLIGHT: '${title}' pulls ${viewsText} views across global accounts this month! 🎬🍿 #${title.replace(/[^a-zA-Z0-9]/g, '')}`,
            likes: Math.floor(Math.random() * 85000) + 5000,
            comments: Math.floor(Math.random() * 4500) + 200,
            retweets: Math.floor(Math.random() * 12000) + 800,
            shares: Math.floor(Math.random() * 3000) + 150,
            views: Math.floor(1000000 + Math.random() * 400000000),
            timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
            isPlayer: false,
            isNpc: true,
            sentiment: 'Viral',
          });
        } else {
          const blogger = MEDIA_AND_NPC_ACCOUNTS[Math.floor(Math.random() * MEDIA_AND_NPC_ACCOUNTS.length)];
          const critic = latestMovie.criticRating || latestMovie.criticScore || 70;
          const templates = [
            `BLOGGER REVIEW: '${title}' — critics at ${critic}% and audiences can't stop talking. Is this the year of ${playerTag}? 🎬`,
            `BOX OFFICE BUZZ: '${title}' keeps climbing the charts. ${playerTag} just proved the doubters wrong.`,
            `HOT TAKE: '${title}' might be the most underrated release of the year. Watch it before the hype catches up. 🍿`,
            `THE REEL REPORT: '${title}' is a certified crowd-pleaser — ${critic}% on the critic meter. ${playerTag} is on a heater. 🔥`,
          ];
          const text = templates[i % templates.length];
          posts.push({
            id: `blogger_post_real_${platform}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
            authorName: blogger.name,
            authorHandle: blogger.handle,
            authorAvatar: blogger.avatar,
            badge: (blogger as any).badge || (Math.random() < 0.5 ? ('BLUE' as VerificationType) : ('NONE' as VerificationType)),
            platform,
            tab: 'NPC_FEED',
            text,
            likes: Math.floor(Math.random() * 22000) + 400,
            comments: Math.floor(Math.random() * 1400) + 30,
            retweets: Math.floor(Math.random() * 3500) + 80,
            shares: Math.floor(Math.random() * 900) + 20,
            views: Math.floor(500000 + Math.random() * 400000000),
            timestamp: `${Math.floor(Math.random() * 22) + 1}h ago`,
            isPlayer: false,
            isNpc: true,
            sentiment: 'Positive',
          });
        }
        continue;
      }

      if (roll < 0.25) {
        const govIndex = Math.floor(Math.random() * GOVERNMENT_POST_TEMPLATES.length);
        const govItem = GOVERNMENT_POST_TEMPLATES[govIndex];

        posts.push({
          id: `gov_post_${platform}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
          authorName: govItem.account.name,
          authorHandle: govItem.account.handle,
          authorAvatar: govItem.account.avatar,
          badge: 'GRAY' as VerificationType,
          platform,
          tab: 'NPC_FEED',
          text: govItem.text,
          likes: Math.floor(Math.random() * 15000) + 1200,
          comments: Math.floor(Math.random() * 850) + 50,
          retweets: Math.floor(Math.random() * 2500) + 150,
          shares: Math.floor(Math.random() * 600) + 30,
          views: Math.floor(200000 + Math.random() * 300000000),
          timestamp: `${Math.floor(Math.random() * 18) + 1}h ago`,
          isPlayer: false,
          isNpc: true,
          sentiment: 'Positive',
        });
      } else if (roll < 0.45) {
        const streamAcc = STREAMING_ACCOUNTS[Math.floor(Math.random() * STREAMING_ACCOUNTS.length)];
        const viewStr = STREAMING_VIEW_COUNTS[Math.floor(Math.random() * STREAMING_VIEW_COUNTS.length)];
        const shows = ['Cyberpunk 2099', 'Shadow City', 'Stranger Things', 'House of the Dragon', 'The Last of Us'];
        const show = shows[Math.floor(Math.random() * shows.length)];

        posts.push({
          id: `stream_post_${platform}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
          authorName: streamAcc.name,
          authorHandle: streamAcc.handle,
          authorAvatar: streamAcc.avatar,
          platform,
          tab: 'NPC_FEED',
          text: `STREAMING SPOTLIGHT: '${show}' reaches ${viewStr} across global accounts this month! Is Season 3 coming soon? 🎬🍿`,
          likes: Math.floor(Math.random() * 85000) + 5000,
          comments: Math.floor(Math.random() * 4500) + 200,
          retweets: Math.floor(Math.random() * 12000) + 800,
          shares: Math.floor(Math.random() * 3000) + 150,
          timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
          isPlayer: false,
          isNpc: true,
          sentiment: 'Viral',
        });
      } else {
        const source = MEDIA_AND_NPC_ACCOUNTS[Math.floor(Math.random() * MEDIA_AND_NPC_ACCOUNTS.length)];
        const headline = GENERAL_NPC_HEADLINES[Math.floor(Math.random() * GENERAL_NPC_HEADLINES.length)];

        posts.push({
          id: `npc_post_${platform}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
          authorName: source.name,
          authorHandle: source.handle,
          authorAvatar: source.avatar,
          badge: (source as any).badge || (Math.random() < 0.45 ? ('BLUE' as VerificationType) : ('NONE' as VerificationType)),
          platform,
          tab: 'NPC_FEED',
          text: headline,
          likes: Math.floor(Math.random() * 22000) + 400,
          comments: Math.floor(Math.random() * 1400) + 30,
          retweets: Math.floor(Math.random() * 3500) + 80,
          shares: Math.floor(Math.random() * 900) + 20,
          views: Math.floor(100000 + Math.random() * 400000000),
          timestamp: `${Math.floor(Math.random() * 22) + 1}h ago`,
          isPlayer: false,
          isNpc: true,
          sentiment: 'Positive',
        });
      }
    }

    return posts;
  }

  /**
   * Apply for YouTube Monetization (Partner Program)
   */
  public static applyForYouTubeMonetization(): { success: boolean; message: string } {
    const state = this.getState();
    if (
      (state.youtubeSubscribers || 0) < YOUTUBE_MONETIZATION_REQUIREMENTS.minSubscribers ||
      (state.youtubeWatchHours || 0) < YOUTUBE_MONETIZATION_REQUIREMENTS.minWatchHours
    ) {
      return {
        success: false,
        message: `Requirements not met: Must have ${YOUTUBE_MONETIZATION_REQUIREMENTS.minSubscribers.toLocaleString()} Subscribers and ${YOUTUBE_MONETIZATION_REQUIREMENTS.minWatchHours.toLocaleString()} Watch Hours.`,
      };
    }
    if (state.youtubeMonetizationStatus === 'UNDER_REVIEW') {
      return { success: false, message: 'Your application is already under review.' };
    }
    if (state.youtubeMonetizationStatus === 'APPROVED') {
      return { success: false, message: 'Your channel is already monetized!' };
    }

    state.youtubeMonetizationStatus = 'UNDER_REVIEW';
    state.youtubeReviewWeeksLeft = Math.floor(Math.random() * 3) + 2; // 2 to 4 weeks
    this.saveState(state);
    return {
      success: true,
      message: `Application submitted! Partner Program review will take approx ${state.youtubeReviewWeeksLeft} weeks.`,
    };
  }
}

// ============================================================
// SOCIAL MEDIA HUB V2 — PREMIUM, WRITERS, ALGORITHM, CREATOR STUDIO
// ============================================================

export const PREMIUM_TIERS = {
  premium: { name: 'Premium', monthly: 22, yearly: 220, tick: 'BLUE', boost: 1.35 },
  plus: { name: 'Premium+', monthly: 30, yearly: 300, tick: 'GOLD', boost: 1.6 },
  pro: { name: 'Premium++', monthly: 150, yearly: 1500, tick: 'GRAY', boost: 2.0 },
} as const;

export interface SocialWriter {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  tierLabel: string;
  specialty: string;
  weeklyCost: number;
  postsPerWeek: number;
  qualityBoost: number;
  maxContractWeeks: number;  // absolute max player can choose (40)
  cancelFee: number;
  minFame: number;
  minMovies: number;
  minFans: number;
  bio: string;
  avatar: string;
  agencyName: string;
}

const WRITER_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop',
];

// 24-WRITER POOL: 4 tiers x 6 specialties — player picks contract length 5-40 weeks
export const SOCIAL_WRITER_POOL: SocialWriter[] = [
  // TIER 1 — Junior Bloggers ($250-400/wk) — anyone can apply, 90% accept if meets reqs
  { id: 'w_j1', name: 'Nina Vale', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Film Reviewer', weeklyCost: 250, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 40, cancelFee: 500, minFame: 0, minMovies: 0, minFans: 0, bio: 'Fresh film blog voice covering indie releases.', avatar: WRITER_AVATARS[0], agencyName: 'The Daily Marquee Blog' },
  { id: 'w_j2', name: 'Caleb Frost', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Gossip & Celebrity', weeklyCost: 275, postsPerWeek: 3, qualityBoost: 9, maxContractWeeks: 40, cancelFee: 550, minFame: 0, minMovies: 0, minFans: 0, bio: 'Sunset Strip gossip columnist in training.', avatar: WRITER_AVATARS[1], agencyName: 'Sunset Scoop' },
  { id: 'w_j3', name: 'Rhea Patel', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Lifestyle & Brand', weeklyCost: 260, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 40, cancelFee: 520, minFame: 0, minMovies: 0, minFans: 0, bio: 'Lifestyle writer for emerging talent.', avatar: WRITER_AVATARS[2], agencyName: 'La La Life Blog' },
  { id: 'w_j4', name: 'Oscar Bennet', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Film Reviewer', weeklyCost: 240, postsPerWeek: 2, qualityBoost: 7, maxContractWeeks: 40, cancelFee: 480, minFame: 0, minMovies: 0, minFans: 0, bio: 'Movie lover writing honest reviews.', avatar: WRITER_AVATARS[3], agencyName: 'Popcorn Prophet' },
  { id: 'w_j5', name: 'Lena Cruz', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Awards Watch', weeklyCost: 280, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 40, cancelFee: 560, minFame: 0, minMovies: 0, minFans: 0, bio: 'Tracks the awards season calendar.', avatar: WRITER_AVATARS[4], agencyName: 'The Reel Report' },
  { id: 'w_j6', name: 'Dante Fox', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Business & Trade', weeklyCost: 300, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 40, cancelFee: 600, minFame: 0, minMovies: 0, minFans: 0, bio: 'Reports on Hollywood money moves.', avatar: WRITER_AVATARS[5], agencyName: 'Studio Gate' },
  // TIER 2 — Content Writers ($600-900/wk) — need 1+ movie, 80% accept if meets reqs
  { id: 'w_c1', name: 'Ava Reed', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Film Reviewer', weeklyCost: 650, postsPerWeek: 4, qualityBoost: 18, maxContractWeeks: 40, cancelFee: 1500, minFame: 300, minMovies: 1, minFans: 0, bio: 'Hollywood Insider blogger covering releases and red carpets.', avatar: WRITER_AVATARS[0], agencyName: 'Hollywood Insider Blog Network' },
  { id: 'w_c2', name: 'Jaxon Cole', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Gossip & Celebrity', weeklyCost: 600, postsPerWeek: 5, qualityBoost: 20, maxContractWeeks: 40, cancelFee: 1400, minFame: 500, minMovies: 1, minFans: 0, bio: 'Gossip Wire specialist in celebrity news.', avatar: WRITER_AVATARS[1], agencyName: 'Gossip Wire Media' },
  { id: 'w_c3', name: 'Sierra Lane', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Film Reviewer', weeklyCost: 750, postsPerWeek: 4, qualityBoost: 22, maxContractWeeks: 40, cancelFee: 1700, minFame: 600, minMovies: 1, minFans: 0, bio: 'Cinema Review Collective critic.', avatar: WRITER_AVATARS[2], agencyName: 'Cinema Review Collective' },
  { id: 'w_c4', name: 'Dylan Cross', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Awards Watch', weeklyCost: 800, postsPerWeek: 5, qualityBoost: 24, maxContractWeeks: 40, cancelFee: 1800, minFame: 800, minMovies: 2, minFans: 0, bio: 'AwardsWatch blogger with insider buzz.', avatar: WRITER_AVATARS[3], agencyName: 'AwardsWatch Blog Network' },
  { id: 'w_c5', name: 'Mika Sato', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'International', weeklyCost: 900, postsPerWeek: 4, qualityBoost: 22, maxContractWeeks: 40, cancelFee: 2000, minFame: 1000, minMovies: 2, minFans: 0, bio: 'Tokyo cinema blogger with global reach.', avatar: WRITER_AVATARS[4], agencyName: 'Asia Cinema Blog Network' },
  { id: 'w_c6', name: 'Ethan Brooks', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Business & Trade', weeklyCost: 850, postsPerWeek: 4, qualityBoost: 21, maxContractWeeks: 40, cancelFee: 1900, minFame: 900, minMovies: 2, minFans: 0, bio: 'Trade reporter for financing and deals.', avatar: WRITER_AVATARS[5], agencyName: 'The Marquee Trade Desk' },
  // TIER 3 — Senior Publicists ($1,200-2,000/wk) — need 3+ movies, 5K+ fans, 70% accept
  { id: 'w_s1', name: 'Sophia Sterling', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'PR & Lifestyle', weeklyCost: 1250, postsPerWeek: 6, qualityBoost: 35, maxContractWeeks: 40, cancelFee: 4000, minFame: 2000, minMovies: 3, minFans: 5000, bio: 'Sterling PR Media Group senior publicist.', avatar: WRITER_AVATARS[0], agencyName: 'Sterling PR Media Group' },
  { id: 'w_s2', name: 'Marcus Hayes', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Awards Watch', weeklyCost: 1500, postsPerWeek: 6, qualityBoost: 40, maxContractWeeks: 40, cancelFee: 5000, minFame: 2500, minMovies: 3, minFans: 5000, bio: 'Beverly Hills PR specialist for campaigns.', avatar: WRITER_AVATARS[1], agencyName: 'Beverly Hills PR Specialists' },
  { id: 'w_s3', name: 'Isabella Fontaine', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Film Reviewer', weeklyCost: 1400, postsPerWeek: 6, qualityBoost: 38, maxContractWeeks: 40, cancelFee: 4600, minFame: 2200, minMovies: 3, minFans: 5000, bio: 'Trades-level critic and reporter.', avatar: WRITER_AVATARS[2], agencyName: 'Redwood Review Desk' },
  { id: 'w_s4', name: 'Andre Whitfield', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Business & Trade', weeklyCost: 1600, postsPerWeek: 7, qualityBoost: 42, maxContractWeeks: 40, cancelFee: 5200, minFame: 3000, minMovies: 4, minFans: 8000, bio: 'Variety-style entertainment business reporter.', avatar: WRITER_AVATARS[3], agencyName: 'The Marquee Business Desk' },
  { id: 'w_s5', name: 'Camille Dubois', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Gossip & Celebrity', weeklyCost: 1300, postsPerWeek: 7, qualityBoost: 36, maxContractWeeks: 40, cancelFee: 4200, minFame: 2000, minMovies: 3, minFans: 5000, bio: 'Celebrity features writer with sources.', avatar: WRITER_AVATARS[4], agencyName: 'Fame Focus Media' },
  { id: 'w_s6', name: 'Lucas Meyer', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'International', weeklyCost: 2000, postsPerWeek: 6, qualityBoost: 40, maxContractWeeks: 40, cancelFee: 6000, minFame: 3500, minMovies: 4, minFans: 8000, bio: 'Global press tour specialist.', avatar: WRITER_AVATARS[5], agencyName: 'Global Press Group' },
  // TIER 4 — Elite Ghostwriters ($3,000-5,000/wk) — need 5+ movies, 50K+ fans, 60% accept
  { id: 'w_e1', name: 'Vanguard Global PR', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'PR & Lifestyle', weeklyCost: 3200, postsPerWeek: 8, qualityBoost: 70, maxContractWeeks: 40, cancelFee: 12000, minFame: 6000, minMovies: 5, minFans: 50000, bio: 'Top-tier global PR agency with 24/7 account management.', avatar: WRITER_AVATARS[0], agencyName: 'Vanguard Global Communications Inc.' },
  { id: 'w_e2', name: 'Julian Cross', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Awards Watch', weeklyCost: 3800, postsPerWeek: 9, qualityBoost: 80, maxContractWeeks: 40, cancelFee: 14000, minFame: 8000, minMovies: 5, minFans: 50000, bio: 'Oscar campaign whisperer.', avatar: WRITER_AVATARS[1], agencyName: 'Cross Campaigns' },
  { id: 'w_e3', name: 'Victoria Reign', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Gossip & Celebrity', weeklyCost: 3500, postsPerWeek: 10, qualityBoost: 75, maxContractWeeks: 40, cancelFee: 13000, minFame: 7500, minMovies: 5, minFans: 50000, bio: 'The most connected celebrity writer in Hollywood.', avatar: WRITER_AVATARS[2], agencyName: 'Reign Media' },
  { id: 'w_e4', name: 'Silas Monroe', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Film Reviewer', weeklyCost: 3000, postsPerWeek: 8, qualityBoost: 65, maxContractWeeks: 40, cancelFee: 11000, minFame: 5000, minMovies: 5, minFans: 50000, bio: 'Legendary critic with a trusted byline.', avatar: WRITER_AVATARS[3], agencyName: 'The Marquee Review' },
  { id: 'w_e5', name: 'Gabriella Romano', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Business & Trade', weeklyCost: 4500, postsPerWeek: 10, qualityBoost: 85, maxContractWeeks: 40, cancelFee: 16000, minFame: 10000, minMovies: 6, minFans: 75000, bio: 'Power broker of entertainment finance news.', avatar: WRITER_AVATARS[4], agencyName: 'Romano Partners Media' },
  { id: 'w_e6', name: 'Theodore Vance', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'International', weeklyCost: 5000, postsPerWeek: 12, qualityBoost: 90, maxContractWeeks: 40, cancelFee: 18000, minFame: 12000, minMovies: 6, minFans: 100000, bio: 'Global superstar ghostwriter.', avatar: WRITER_AVATARS[5], agencyName: 'Sterling Heights Media' },
];

// ============================================================
// ENDLESS WRITER POST POOL
// A deep slot library the writer draws from every post: openers ×
// topic bodies × specialty flavor × closers. Bodies are template
// functions so REAL game numbers bake in. With 15+ openers,
// 60+ bodies (drawn 2 per post), 7 specialty flavors and 18
// closers, the effective combination space is in the millions —
// a feed never repeats.
// ============================================================

interface WriterPostData {
  title: string;
  gross: number;
  opening: number;
  position: number;
  aud: number;
  critic: number;
  intl: number;
  weeks: number;
  awards: number;
  role: string;
  firstName: string;
  tag: string;
}

const wMoney = (v: number): string =>
  v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${Math.round(v / 1000)}K`;

const WRITER_POOL_OPENERS_MOVIE: Array<(d: WriterPostData) => string> = [
  (d) => `Quick '${d.title}' update from the press road:`,
  (d) => `Numbers just came in from the studio —`,
  (d) => `I keep re-reading the reviews for '${d.title}' and shaking my head:`,
  (d) => `Someone pinched me on set today:`,
  (d) => `Note from the '${d.title}' publicity desk:`,
  (d) => `Alright, you've earned some real news:`,
  (d) => `Catching my breath between interviews to tell you:`,
  (d) => `The trades called this morning. Here's the truth:`,
  (d) => `Sitting in the editing bay thinking about this:`,
  (d) => `To everyone who showed up for '${d.title}' this month:`,
  (d) => `My phone hasn't stopped buzzing since the '${d.title}' premiere —`,
  (d) => `Long day on the lot, one thing left to do:`,
  (d) => `The studio marketing team just unlocked the numbers, so:`,
  (d) => `Between takes, between meetings, one honest post:`,
  (d) => `Screening room was packed tonight and I'm still processing it:`,
  (d) => `Filed under things I'll tell the grandkids:`,
];

const WRITER_POOL_OPENERS_GENERAL: Array<() => string> = [
  () => `Catching you up from my corner of Hollywood:`,
  () => `Note from the desk this morning:`,
  () => `Real talk before the day starts:`,
  () => `Something I've been sitting on all week:`,
  () => `Alright, time for a proper update:`,
  () => `From today's production meeting:`,
  () => `Quick career note before it gets loud:`,
  () => `The kind of week that deserves a real post:`,
  () => `Coffee's cold, notes are long, here we go:`,
  () => `No press release needed for this one:`,
  () => `Somewhere between a rehearsal and a red carpet:`,
  () => `Clearing the drafts folder — you get the truth:`,
  () => `Hollywood moves fast, so let me slow one thing down:`,
  () => `Writing this from the back of a car on Cahuenga:`,
];

const WRITER_POOL_BODIES_BOXOFFICE: Array<(d: WriterPostData) => string> = [
  (d) => `'${d.title}' is now at ${wMoney(d.gross)} worldwide and still climbing.`,
  (d) => `we opened at ${wMoney(d.opening)} — above every projection the studio showed me.`,
  (d) => `we're sitting at #${d.position} on the box office chart right now.`,
  (d) => `${wMoney(d.intl)} of the total comes from overseas — this movie is traveling the world.`,
  (d) => `${d.weeks} weeks in theaters and people are STILL buying tickets.`,
  (d) => `second-weekend holds like this one are the rarest thing in the business.`,
  (d) => `the studio just greenlit a bigger marketing push — they smell a hit.`,
  (d) => `exhibitors are adding screens instead of cutting them. Read that again.`,
];
const WRITER_POOL_BODIES_REVIEWS: Array<(d: WriterPostData) => string> = [
  (d) => `the audience score is holding strong at ${d.aud}%.`,
  (d) => `critics have us at ${d.critic}% — the write-ups have been surreal.`,
  (d) => `a critic called the performance "career-defining" and I've read it nine times.`,
  (d) => `the reviews keep using words like "fearless" and "transformed".`,
  (d) => `even the tough reviews had good things to say about the third act.`,
  (d) => `word of mouth is doing what no ad campaign could.`,
];
const WRITER_POOL_BODIES_CRAFT: Array<(d: WriterPostData) => string> = [
  (d) => `playing a ${d.role} role took everything I had — dialect coaches, stunt weeks, 4AM call times.`,
  (d) => `the physical prep alone was three months of training most people never see.`,
  (d) => `I kept a private journal in the character's voice. It's strange and I love it.`,
  (d) => `there's a scene we shot 22 times and take 19 is the one in the movie.`,
  (d) => `the script changed my idea of what I'm capable of. That's the honest answer.`,
  (d) => `I said yes to this project because it scared me. Still does, a little.`,
  (d) => `deleted scenes exist that would break your heart. Maybe one day.`,
  (d) => `every choice in this performance was fought for, nothing was accidental.`,
];
const WRITER_POOL_BODIES_SET: Array<(d: WriterPostData) => string> = [
  (d) => `the crew behind this one is the real story: gaffers, editors, sound — hundreds of artists.`,
  (d) => `craft services aside, the best part of the shoot was the people.`,
  (d) => `our stunt coordinator should be a household name after this.`,
  (d) => `16-hour days, zero complaints. This crew was different.`,
  (d) => `the director ran set like a family dinner — loud, warm, relentless.`,
  (d) => `behind every frame you're watching: a small city working in the dark.`,
];
const WRITER_POOL_BODIES_FANS: Array<(d: WriterPostData) => string> = [
  (d) => `someone camped outside the theater in a costume from the movie. Legend.`,
  (d) => `your DMs, edits, and theories are all I read on Sundays.`,
  (d) => `a fan letter from Ohio is taped to my mirror right now.`,
  (d) => `the premiere crowd chanted the title. I get chills typing that.`,
  (d) => `I see every fan art post. Every single one. Keep them coming.`,
  (d) => `theater owners say groups are coming back in costumes. You did that.`,
];
const WRITER_POOL_BODIES_TRADE: Array<(d: WriterPostData) => string> = [
  (d) => `three scripts on the desk, one I genuinely can't stop thinking about.`,
  (d) => `the next role scares me a little, which is how I know it's the right one.`,
  (d) => `development meetings all week, real decisions coming soon.`,
  (d) => `the trades keep guessing. They're mostly wrong. Mostly.`,
  (d) => `my team says don't post this. Posting it anyway: something big is close.`,
  (d) => `meetings in three studios this week and a very good problem choosing.`,
];
const WRITER_POOL_BODIES_TRAINING: Array<(d: WriterPostData) => string> = [
  (d) => `training is stacking up — dialect sessions in the morning, stunt work in the afternoon.`,
  (d) => `reading, training, auditioning — the unglamorous engine of this career.`,
  (d) => `the character I'm building right now is unlike anything you've seen from me.`,
  (d) => `gym at 5, script at 7, set at 9. This is the fun part.`,
  (d) => `learned a new accent this month. My neighbors think I've lost it.`,
  (d) => `rehearsal footage exists that will never, ever be released. It's that raw.`,
];
const WRITER_POOL_BODIES_LIFESTYLE: Array<(d: WriterPostData) => string> = [
  (d) => `took one day off. Drove to the ocean. Thought about absolutely nothing.`,
  (d) => `${d.firstName}'s honest review of fame so far: surreal, exhausting, worth it.`,
  (d) => `found the diner I used to wait tables at. Left the biggest tip of my life.`,
  (d) => `still drives the same car. Still forgets that sometimes people notice.`,
  (d) => `gratitude list this week: work, health, and whoever invented cold brew.`,
];
const WRITER_POOL_BODIES_INDUSTRY: Array<(d: WriterPostData) => string> = [
  (d) => `the industry is changing fast and the good work still finds a way.`,
  (d) => `every job on a set matters. This business runs on hundreds of hands.`,
  (d) => `streaming, theatrical, whatever's next — a great story wins every time.`,
  (d) => `Hollywood will humble you on a Tuesday and crown you by Friday.`,
  (d) => `the people who last in this town are the ones who keep studying.`,
];

/** Specialty-flavored lines — the writer's voice, not just the actor's */
const WRITER_SPECIALTY_FLAVOR: Record<string, Array<(d: WriterPostData) => string>> = {
  'Film Reviewer': [
    (d) => `critics' consensus is forming and it lands on the performance — pinned review incoming.`,
    (d) => `consider this your spoiler-free nudge: see it on the biggest screen you can find.`,
    (d) => `the letterboxd crowd has opinions. Loud ones. Correct ones.`,
  ],
  'Gossip & Celebrity': [
    (d) => `yes, the tabloids ran the story. No, it wasn't true. Yes, this post is the correction.`,
    (d) => `spotted at the same restaurant as a certain director. Draw your own conclusions (correctly).`,
    (d) => `the gossip pages need content, so here's an exclusive: hard work is the secret.`,
  ],
  'Awards Watch': [
    (d) => `the awards tracking boards just moved this performance up the leaderboard.`,
    (d) => `buzz season is officially open and the campaign schedule is already wild.`,
    (d) => `the words "campaign" and "contender" are being used in the same sentence as '${d.title}'.`,
  ],
  'Business & Trade': [
    (d) => `the financing behind this one is a story itself — international pre-sales did heavy lifting.`,
    (d) => `back-end points negotiated on this deal were the smartest signature of the year.`,
    (d) => `analysts are revising the quarter's projections upward. Upward.`,
  ],
  International: [
    (d) => `premiere passport stamps this month: three countries, one tux.`,
    (d) => `the overseas press asked better questions than anyone. Facts.`,
    (d) => `dubbed, subtitled, pirated, loved — cinema travels farther than any of us.`,
  ],
  'PR & Lifestyle': [
    (d) => `brand meetings went long but the vision is very, very clear.`,
    (d) => `the press tour wardrobe reveal is going to break the internet. Scheduled and everything.`,
    (d) => `red carpet prep is a sport and we are in training.`,
  ],
};

const WRITER_POOL_CLOSERS: Array<(d: WriterPostData) => string> = [
  (d) => `Thank you for being on this ride with me. ❤️`,
  (d) => `More news very soon — stay close. 👀`,
  (d) => `This is all yours, not mine. 🙏`,
  (d) => `Keep showing up and I'll keep earning it. 🎬`,
  (d) => `Details when the embargo lifts. 🔒`,
  (d) => `Drop your predictions below. 💬`,
  (d) => `Grateful beyond words tonight. ✨`,
  (d) => `We're just getting started. 🔥`,
  (d) => `Tell me where you're watching from. 🌍`,
  (d) => `Reply with your favorite scene. No wrong answers.`,
  (d) => `Half of this industry is showing up. You're the other half.`,
  (d) => `Screenshots of this post will age beautifully. 📸`,
  (d) => `Next update lands with actual receipts. 🧾`,
  (d) => `Stay weird, stay kind, buy the popcorn. 🍿`,
  (d) => `#${d.tag || 'HollywoodRising'}`,
  (d) => `#${d.tag || 'HollywoodRising'} #NowWatching`,
  (d) => `Book the tickets. Thank me after. 🎟️`,
  (d) => `The best is genuinely ahead. Believe that. ⚡`,
];

/**
 * Draw one endless-pool post for a writer. Real movie data bakes into the
 * bodies; the writer's specialty colors the voice; weekly dedupe keeps the
 * same sentence from appearing twice in one week.
 */
export function drawWriterPoolPost(
  specialty: string,
  data: WriterPostData,
  usedTexts: Set<string>
): string {
  const pickT = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Topic pools — box office & review lines only exist when real numbers do
  const topics: Array<Array<(d: WriterPostData) => string>> = [WRITER_POOL_BODIES_CRAFT, WRITER_POOL_BODIES_SET, WRITER_POOL_BODIES_FANS, WRITER_POOL_BODIES_TRADE, WRITER_POOL_BODIES_TRAINING, WRITER_POOL_BODIES_LIFESTYLE, WRITER_POOL_BODIES_INDUSTRY];
  if (data.gross > 0 || data.opening > 0 || data.position > 0 || data.weeks > 1) topics.push(WRITER_POOL_BODIES_BOXOFFICE);
  if (data.aud > 0 || data.critic > 0) topics.push(WRITER_POOL_BODIES_REVIEWS);

  const openers = data.title ? WRITER_POOL_OPENERS_MOVIE : WRITER_POOL_OPENERS_GENERAL;
  const flavor = WRITER_SPECIALTY_FLAVOR[specialty] || WRITER_SPECIALTY_FLAVOR['Film Reviewer'];

  for (let attempt = 0; attempt < 8; attempt++) {
    // 2 topic sentences from DIFFERENT topics, 40% chance of a specialty line
    const t1 = pickT(pickT(topics))(data);
    let t2 = pickT(pickT(topics))(data);
    if (t2 === t1) t2 = pickT(pickT(topics))(data);
    const fl = Math.random() < 0.4 ? ` ${pickT(flavor)(data)}` : '';
    const text = `${pickT(openers)(data)} ${t1} ${t2}${fl} ${pickT(WRITER_POOL_CLOSERS)(data)}`;
    if (!usedTexts.has(text)) {
      usedTexts.add(text);
      return text;
    }
  }
  return `${pickT(openers)(data)} ${pickT(pickT(topics))(data)} ${pickT(WRITER_POOL_CLOSERS)(data)}`;
}

// ---------- PREMIUM ----------
export class PremiumService {
  static getActive(state: SocialsState): boolean {
    const p = state.premium || { tier: 'none', plan: 'none', expiresWeek: 0, expiresYear: 0 };
    return p.tier !== 'none' && (p.plan === 'none' || true);
  }
  static boostFor(state: SocialsState): number {
    const p = state.premium;
    if (!p || p.tier === 'none') return 1;
    return PREMIUM_TIERS[p.tier].boost;
  }
  static tickName(state: SocialsState): string {
    const p = state.premium;
    if (!p || p.tier === 'none') return 'NONE';
    return PREMIUM_TIERS[p.tier].tick;
  }
  static purchase(
    state: SocialsState,
    tier: 'premium' | 'plus' | 'pro',
    plan: 'monthly' | 'yearly',
    money: number,
    week: number,
    year: number
  ): { success: boolean; message: string; newMoney: number } {
    const cfg = PREMIUM_TIERS[tier];
    const cost = plan === 'monthly' ? cfg.monthly : cfg.yearly;
    if (money < cost) return { success: false, message: `Insufficient funds — ${cfg.name} ${plan} costs $${cost}.`, newMoney: money };
    const weeks = plan === 'monthly' ? 4 : 52;
    state.premium = { tier, plan, expiresWeek: (week + weeks - 1) % 52 + 1, expiresYear: year + Math.floor((week + weeks - 1) / 52) };
    return { success: true, message: `${cfg.name} (${plan}) activated — ${weeks} weeks!`, newMoney: money - cost };
  }
}

// ---------- YOUTUBE ALGORITHM (invisible tracker) ----------
export function youtubeAlgorithmViews(lifetimeVideos: number, fameXp: number, discovered: boolean): number {
  // New channels are invisible (0-100 views). After ~55 posts the algorithm pushes videos out.
  if (!discovered) {
    if (lifetimeVideos >= 55) return Math.floor(500 + fameXp * 8 + Math.random() * 2000);
    return Math.floor(Math.random() * 100); // 0-100 views until the algorithm picks you up
  }
  return Math.floor(2000 + fameXp * 60 + Math.random() * fameXp * 20);
}

// ---------- WRITERS (SEPARATE per platform: 1 each, contract 5-40 weeks, cancel fee) ----------
// Contract length the player may choose when applying
export const WRITER_MIN_CONTRACT_WEEKS = 5;
export const WRITER_MAX_CONTRACT_WEEKS = 40;
export const WRITER_CONTRACT_CHOICES = [5, 10, 15, 20, 25, 30, 35, 40];

// Base acceptance odds when the player MEETS every requirement, by tier.
const WRITER_ACCEPT_BASE: Record<number, number> = { 1: 0.9, 2: 0.8, 3: 0.7, 4: 0.6 };
// Lucky-break odds when portfolio requirements (movies/fans) are NOT met —
// the "invisible checker". Fame is a hard lock; movies/fans only lower odds.
const WRITER_ACCEPT_LONGSHOT = 0.15;

interface WriterPitchContext {
  writerName: string;
  agency: string;
  playerName: string;
  tierLabel: string;
  specialty: string;
  platformLabel: string;
  weeks: number;
  weeklyCost: number;
  totalCost: number;
  fameXp: number;
  movies: number;
  fans: number;
  missing: string[];
}

// 13 ACCEPTANCE templates — varied tone, all personalized with real data
const WRITER_ACCEPT_TEMPLATES: Array<(c: WriterPitchContext) => { subject: string; body: string }> = [
  (c) => ({
    subject: `RETAINER ACCEPTED — ${c.writerName} is officially on your team!`,
    body: `Dear ${c.playerName},\n\nI reviewed your portfolio this morning (${c.movies} credits, ${c.fans.toLocaleString()} fans, ${c.fameXp.toLocaleString()} Fame XP) and I'm signing on the dotted line. Great material to work with.\n\nFor the next ${c.weeks} weeks I'll publish 2 detailed strategic posts per week on your ${c.platformLabel} feed — real releases, real numbers, real momentum.\n\nWeekly retainer: $${c.weeklyCost.toLocaleString()}\nTotal contract value: $${c.totalCost.toLocaleString()}\n\nLet's build something. First post drops this week.\n\n— ${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `YES — let's work together (${c.weeks}-week retainer confirmed)`,
    body: `Hey ${c.playerName}!\n\nHonestly? I've been watching your career from afar for a while. When your application landed on my desk I may have said "finally" out loud.\n\n${c.tierLabel} to ${c.specialty.toLowerCase()} — you came to the right desk. ${c.weeks} weeks, 2 posts a week on ${c.platformLabel}, zero fluff, all signal.\n\n$${c.weeklyCost.toLocaleString()}/wk starting immediately.\n\nTalk soon,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `CONTRACT EXECUTED: ${c.writerName} × ${c.playerName} (${c.weeks} weeks)`,
    body: `${c.playerName},\n\nFollowing a standard audit of your public standing — Fame XP ${c.fameXp.toLocaleString()}, ${c.movies} completed projects, ${c.fans.toLocaleString()} fans — ${c.agency} is pleased to confirm acceptance of your retainer offer.\n\nTerms: ${c.weeks} weeks · $${c.weeklyCost.toLocaleString()}/week · ${c.platformLabel} exclusivity · 2 posts weekly.\n\nOur editorial calendar for your account is already drafted.\n\nRegards,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `You're in. I start Monday.`,
    body: `${c.playerName},\n\nShort note: I read your application twice, checked your numbers, and called my editor. We're doing this.\n\n${c.weeks} weeks on ${c.platformLabel}. I know exactly the angle we're taking — your story writes itself if someone just pays attention. I do.\n\nInvoice: $${c.weeklyCost.toLocaleString()}/wk.\n\n— ${c.writerName}`,
  }),
  (c) => ({
    subject: `WELCOME ABOARD — ${c.agency} accepts your retainer!`,
    body: `Dear ${c.playerName},\n\nOn behalf of the entire ${c.agency} team, welcome aboard! ${c.writerName} here will be your dedicated ${c.specialty.toLowerCase()} voice for the next ${c.weeks} weeks.\n\nYour profile passed our client criteria with room to spare:\n• Fame XP: ${c.fameXp.toLocaleString()}\n• Completed projects: ${c.movies}\n• Fanbase: ${c.fans.toLocaleString()}\n\nExpect your first ${c.platformLabel} post within days.\n\nWarm regards,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `Re: Your retainer application — ACCEPTED ✔`,
    body: `${c.playerName},\n\nQuick reply to your application: yes.\n\nSlightly longer reply: yes, because your trajectory is exactly the kind of story my readers follow. ${c.movies} credits in and climbing — I know an ascending curve when I see one.\n\n${c.weeks} weeks · ${c.platformLabel} · $${c.weeklyCost.toLocaleString()}/wk. Locked in.\n\n${c.writerName}`,
  }),
  (c) => ({
    subject: `RETAINER CONFIRMED — the paperwork is done!`,
    body: `Dear ${c.playerName},\n\nThe board reviewed your application over lunch and it was the fastest unanimous yes we've had all quarter.\n\n${c.writerName}, ${c.specialty}, at your service for ${c.weeks} weeks. Your ${c.platformLabel} feed is about to get a lot more interesting — expect release coverage, industry insight, and the kind of detail fans actually share.\n\nWeekly fee: $${c.weeklyCost.toLocaleString()}.\n\nSincerely,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `We say yes to very few. You're one of them.`
    , body: `${c.playerName},\n\nI'll be direct: I turn down most retainer offers because most profiles are noise. Yours has signal — ${c.movies} real credits and a fanbase that actually engages (${c.fans.toLocaleString()} strong).\n\n${c.weeks} weeks on ${c.platformLabel}. $${c.weeklyCost.toLocaleString()}/wk. I only take accounts I can be proud of a year from now.\n\nWelcome.\n\n— ${c.writerName}\n${c.agency}` }),
  (c) => ({
    subject: `ACCEPTANCE NOTICE: ${c.writerName} joins ${c.playerName}'s PR team`,
    body: `Dear ${c.playerName},\n\nPlease find below confirmation of our agreed engagement:\n\n• Writer: ${c.writerName} (${c.tierLabel})\n• Specialty: ${c.specialty}\n• Platform: ${c.platformLabel} (exclusive)\n• Duration: ${c.weeks} weeks\n• Retainer: $${c.weeklyCost.toLocaleString()} per week\n• Deliverables: 2 detailed posts per week minimum\n\nWe look forward to an excellent collaboration.\n\nYours sincerely,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `Okay, I'm interested. Actually — I'm in.`
    , body: `${c.playerName},\n\nI drafted a polite decline. Then I looked at your numbers again and deleted it.\n\n${c.fameXp.toLocaleString()} Fame XP, ${c.movies} credits, ${c.fans.toLocaleString()} fans — this is a career on the move, and ${c.platformLabel} is about to hear all about it. ${c.weeks} weeks. Let's go.\n\n$${c.weeklyCost.toLocaleString()}/wk — worth every cent, and I intend to prove it.\n\n${c.writerName}` }),
  (c) => ({
    subject: `CONGRATULATIONS — your application stood out!`,
    body: `Dear ${c.playerName},\n\nWe received a high volume of retainer applications this month. Yours was among the very few we accepted.\n\nYour combination of momentum (${c.fameXp.toLocaleString()} Fame XP) and an engaged fanbase (${c.fans.toLocaleString()} fans) makes you an ideal client for ${c.writerName}'s ${c.specialty.toLowerCase()} desk.\n\n${c.weeks}-week engagement begins now. First ${c.platformLabel} post: this week.\n\nCongratulations again,\n${c.agency}`,
  }),
  (c) => ({
    subject: `Signed, sealed, delivered — I'm yours for ${c.weeks} weeks`,
    body: `Hey ${c.playerName}!\n\nContract's signed and my coffee's cold from reading through your entire filmography. ${c.movies} projects — some hidden gems in there the trades completely missed. That's content gold.\n\n${c.platformLabel} is getting 2 posts a week from me about your career, and people are going to notice.\n\n$${c.weeklyCost.toLocaleString()}/wk. Easiest money you'll spend this year.\n\nCheers,\n${c.writerName}`,
  }),
  (c) => ({
    subject: `FORMAL ACCEPTANCE — Retainer Agreement (${c.writerName})`,
    body: `Dear ${c.playerName},\n\nThis letter confirms ${c.agency}'s acceptance of your retainer application.\n\nOur evaluation noted the following: consistent career progression, verifiable credits (${c.movies}), and measurable public support (${c.fans.toLocaleString()} fans). All client criteria satisfied.\n\nEngagement terms: ${c.weeks} weeks, $${c.weeklyCost.toLocaleString()} weekly, ${c.platformLabel} exclusivity, minimum 2 posts per week.\n\nWe are honored to represent your voice.\n\nFormally yours,\n${c.writerName}\n${c.agency}`,
  }),
];

// 12 DECLINE templates — varied reasons and tones, all explain what's missing
const WRITER_DECLINE_TEMPLATES: Array<(c: WriterPitchContext) => { subject: string; body: string }> = [
  (c) => ({
    subject: `RETAINER DECLINED — ${c.writerName}'s evaluation`,
    body: `Dear ${c.playerName},\n\nThank you for your interest in my ${c.specialty.toLowerCase()} services.\n\nAfter reviewing your application, I'm unable to take you on at this time:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nThis isn't a no forever — it's a no for now. Build the portfolio and try me again.\n\nSincerely,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `Re: Your application — not this time`,
    body: `Hey ${c.playerName},\n\nI'll be straight with you: I can't sell a story that isn't there yet.\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nThe good news? Stories change fast in this town. Go book the work, and my inbox stays open.\n\n${c.writerName}`,
  }),
  (c) => ({
    subject: `APPLICATION STATUS: Unsuccessful`,
    body: `Dear ${c.playerName},\n\nThank you for applying for representation with ${c.agency}.\n\nFollowing our standard client audit, your application did not meet our current criteria:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nWe encourage you to reapply once these areas have developed. Applications are reassessed every season.\n\nRegards,\nClient Relations\n${c.agency}`,
  }),
  (c) => ({
    subject: `I have to pass — here's why (and how to fix it)`,
    body: `${c.playerName},\n\nNobody tells actors the truth in this town, so here it is: I can't take your account yet.\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nBut you're reading a decline from someone who checks credits weekly. Get these numbers up and apply again — I keep notes.\n\n— ${c.writerName}`,
  }),
  (c) => ({
    subject: `RETAINER OFFER DECLINED — portfolio under review threshold`,
    body: `Dear ${c.playerName},\n\n${c.agency} maintains strict client thresholds to protect both our writers and our readership. Unfortunately your current standing falls below them:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nWe wish you every success in your career and welcome future applications.\n\nSincerely,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `Not yet, ${c.playerName}. Not yet.`
    , body: `${c.playerName},\n\nI've been doing this long enough to know the difference between "no" and "not yet." This is the second one.\n\nWhat's holding it back:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nFix that, and the next email you send me gets a yes. I'd bet my byline on it.\n\n— ${c.writerName}` }),
  (c) => ({
    subject: `Your application — honest feedback enclosed`,
    body: `Dear ${c.playerName},\n\nI'm declining your retainer offer, but I'm not going to leave you guessing like most agencies do.\n\nThe gaps:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nWriters follow momentum. Give us something to write about and we will — eagerly.\n\nBest,\n${c.writerName}\n${c.agency}`,
  }),
  (c) => ({
    subject: `DECLINED — ${c.agency} client roster at capacity for your tier`,
    body: `Dear ${c.playerName},\n\nAfter careful consideration we must decline your application.\n\nOur assessment identified the following:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\n${c.agency} reassesses eligibility every quarter. Your application will remain on file.\n\nRespectfully,\nClient Services\n${c.agency}`,
  }),
  (c) => ({
    subject: `The story isn't ready. You might be.`
    , body: `${c.playerName},\n\nA good ${c.specialty.toLowerCase()} knows when there's enough story to tell. Right now there isn't — not for my rates, not for my readers.\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nBut between you and me? The ones who get declined and come back swinging are the ones worth covering.\n\nSee you on the other side of it.\n${c.writerName}` }),
  (c) => ({
    subject: `RE: Retainer application — unable to accept`,
    body: `Dear ${c.playerName},\n\nThank you for considering ${c.writerName} for your ${c.platformLabel} coverage.\n\nUnfortunately, our evaluation found your current profile below our minimum client standards:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nWe hope this changes soon — Hollywood moves fast.\n\nSincerely,\n${c.writerName}`,
  }),
  (c) => ({
    subject: `Application outcome: DECLINED (details inside)`,
    body: `Dear ${c.playerName},\n\nWe regret to inform you that your retainer application was unsuccessful this cycle.\n\nEvaluator notes:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nPlease note: declined applicants are welcome to reapply after material career developments.\n\nKind regards,\nThe Editorial Board\n${c.agency}`,
  }),
  (c) => ({
    subject: `I said no — but read this part twice`,
    body: `${c.playerName},\n\nThe no is because of this:\n${c.missing.map((m) => `• ${m}`).join('\n')}\n\nNow the part to read twice: every single one of those numbers moves with one booking, one release, one break. Mine did too, once.\n\nReapply when they move. I'll remember this email.\n\n— ${c.writerName}\n${c.agency}`,
  }),
];

/**
 * Pitch a writer — the INVISIBLE CHECKER. The writer audits the player's real
 * portfolio (fame, movies, fans) and rolls acceptance odds by tier. Fame below
 * minimum is a hard lock; movies/fans shortfalls lower odds to a longshot.
 * Always produces a personalized InboxMessage (accept or decline) drawn from
 * 25 rotating templates. On acceptance the writer is hired for the chosen
 * contract length (5-40 weeks).
 */
export function pitchSocialWriter(
  state: SocialsState,
  writerId: string,
  money: number,
  player: { fameXp: number; moviesCompleted: number; fans: number; firstName: string; lastName: string; dateWeek: number; dateYear: number },
  platform: string,
  weeks: number
): { success: boolean; message: string; inboxMsg: InboxMessage; newMoney: number; hired: boolean } {
  const pid = platform || 'twitter';
  const label = SocialsService.PLATFORM_LABEL[pid] || pid;
  const emptyMsg = (subject: string, body: string): InboxMessage => ({
    id: `msg_writer_error_${Date.now()}`,
    category: 'SOCIAL',
    sender: 'Writer Relations Desk',
    senderRole: 'Automated Notice',
    subject,
    body,
    date: `Week ${player.dateWeek || 1}, ${player.dateYear || 2026}`,
    read: false,
  });

  const existing = state.writers.find((w) => w.hired && (w.platform || 'twitter') === pid);
  if (existing) return { success: false, message: `${label} already has a writer (${existing.name}). Cancel that contract first.`, inboxMsg: emptyMsg('Application blocked', 'You already have a writer under contract for this platform.'), newMoney: money, hired: false };
  const busyElsewhere = state.writers.find((w) => w.hired && w.id === writerId);
  if (busyElsewhere) return { success: false, message: `${busyElsewhere.name} is already retained for ${SocialsService.PLATFORM_LABEL[busyElsewhere.platform || 'twitter'] || 'another platform'}.`, inboxMsg: emptyMsg('Application blocked', 'This writer is already on another platform contract.'), newMoney: money, hired: false };
  const w = SOCIAL_WRITER_POOL.find((x) => x.id === writerId);
  if (!w) return { success: false, message: 'Writer not found.', inboxMsg: emptyMsg('Application error', 'Writer record not found.'), newMoney: money, hired: false };

  // Clamp contract length to the legal range
  const chosenWeeks = Math.max(WRITER_MIN_CONTRACT_WEEKS, Math.min(WRITER_MAX_CONTRACT_WEEKS, Math.floor(weeks || WRITER_MIN_CONTRACT_WEEKS)));

  if (money < w.weeklyCost) return { success: false, message: `Insufficient funds — ${w.name} costs $${w.weeklyCost}/wk.`, inboxMsg: emptyMsg('Application blocked', 'You cannot cover the first week retainer.'), newMoney: money, hired: false };

  // ----- INVISIBLE CHECKER: portfolio audit -----
  const fameXp = player.fameXp || 0;
  const movies = player.moviesCompleted || 0;
  const fans = player.fans || 0;

  const meetsFame = fameXp >= w.minFame;
  const meetsMovies = movies >= w.minMovies;
  const meetsFans = fans >= w.minFans;

  const missing: string[] = [];
  if (!meetsMovies && w.minMovies > 0) missing.push(`Requires ${w.minMovies} completed projects — you have ${movies}`);
  if (!meetsFans && w.minFans > 0) missing.push(`Requires ${w.minFans.toLocaleString()} fans — you have ${fans.toLocaleString()}`);
  if (!meetsFame) missing.push(`Requires ${w.minFame.toLocaleString()} Fame XP — you have ${fameXp.toLocaleString()}`);

  const allMet = meetsFame && meetsMovies && meetsFans;
  // "Barely" = meets everything but sits within 15% above a threshold
  const barely = allMet && (
    (w.minMovies > 0 && movies < w.minMovies * 1.15) ||
    (w.minFans > 0 && fans < w.minFans * 1.15) ||
    (w.minFame > 0 && fameXp < w.minFame * 1.15)
  );

  let acceptChance = allMet
    ? (barely ? WRITER_ACCEPT_BASE[w.tier] - 0.15 : WRITER_ACCEPT_BASE[w.tier])
    : WRITER_ACCEPT_LONGSHOT;
  // Fame shortfall below 50% of requirement = automatic pass, no longshot
  if (!meetsFame && fameXp < w.minFame * 0.5) acceptChance = 0;

  const accepted = Math.random() < acceptChance;

  const ctx: WriterPitchContext = {
    writerName: w.name,
    agency: w.agencyName,
    playerName: `${player.firstName} ${player.lastName}`.trim(),
    tierLabel: w.tierLabel,
    specialty: w.specialty,
    platformLabel: label,
    weeks: chosenWeeks,
    weeklyCost: w.weeklyCost,
    totalCost: w.weeklyCost * chosenWeeks,
    fameXp,
    movies,
    fans,
    missing,
  };

  const templates = accepted ? WRITER_ACCEPT_TEMPLATES : WRITER_DECLINE_TEMPLATES;
  const tpl = templates[Math.floor(Math.random() * templates.length)](ctx);

  const inboxMsg: InboxMessage = {
    id: `msg_writer_${accepted ? 'accept' : 'decline'}_${w.id}_${Date.now()}`,
    category: 'SOCIAL',
    sender: w.name,
    senderRole: w.agencyName,
    senderAvatar: w.avatar,
    subject: tpl.subject,
    body: tpl.body,
    date: `Week ${player.dateWeek || 1}, ${player.dateYear || 2026}`,
    read: false,
    dateWeek: player.dateWeek,
    dateYear: player.dateYear,
  };

  if (!accepted) {
    return {
      success: false,
      message: `❌ ${w.name} DECLINED your offer — full evaluation sent to your Inbox.`,
      inboxMsg,
      newMoney: money,
      hired: false,
    };
  }

  state.writers = state.writers.filter((wr) => !(wr.hired && (wr.platform || 'twitter') === pid));
  state.writers.push({
    id: w.id,
    name: w.name,
    tier: w.tier === 1 ? 'Low' : w.tier === 2 ? 'Medium' : 'Elite',
    weeklyCost: w.weeklyCost,
    postsPerWeek: w.postsPerWeek,
    contractWeeksRemaining: chosenWeeks,
    postsThisWeek: 0,
    qualityBoost: w.qualityBoost,
    hired: true,
    agencyName: w.agencyName,
    minFame: w.minFame,
    minMovies: w.minMovies,
    minFans: w.minFans,
    bio: w.bio,
    avatar: w.avatar,
    platform: pid,
  });
  return {
    success: true,
    message: `✍️ ${w.name} ACCEPTED! ${chosenWeeks}-week ${label} contract — confirmation in Inbox.`,
    inboxMsg,
    newMoney: money,
    hired: true,
  };
}

export function fireSocialWriter(state: SocialsState, money: number, platform?: string): { success: boolean; message: string; newMoney: number } {
  const pid = platform || 'twitter';
  const label = SocialsService.PLATFORM_LABEL[pid] || pid;
  const existing = state.writers.find((w) => w.hired && (w.platform || 'twitter') === pid);
  if (!existing) return { success: false, message: `No writer hired for ${label}.`, newMoney: money };
  const pool = SOCIAL_WRITER_POOL.find((w) => w.id === existing.id);
  const fee = pool ? pool.cancelFee : 1000;
  if (money < fee) return { success: false, message: `Insufficient funds for cancellation fee ($${fee}).`, newMoney: money };
  state.writers = state.writers.filter((w) => w !== existing);
  return { success: true, message: `${existing.name} dropped from ${label}. Paid $${fee} cancellation fee.`, newMoney: money - fee };
}


// ============================================================
// WEEKLY HUB PROCESSOR — called every END WEEK from GameContext
// Premium expiry, writer auto-posts on all 7 platforms, YouTube
// algorithm tracker, Creator Studio ad revenue, real-event content.
// ============================================================
export function processSocialHubWeek(
  state: SocialsState,
  player: any,
  saveData: any
): { messages: string[]; weeklyAdRevenue: number; moneyDelta: number } {
  const messages: string[] = [];
  let weeklyAdRevenue = 0;
  let moneyDelta = 0;

  const week = player?.dateWeek || 1;
  const year = player?.dateYear || 2026;
  const fameXp = player?.fameXp || 0;
  const movies = saveData?.releasedMovies || [];
  const premium = state.premium || { tier: 'none', plan: 'none', expiresWeek: 0, expiresYear: 0 };

  // 1. PREMIUM EXPIRY
  if (premium.tier !== 'none') {
    if (year > premium.expiresYear || (year === premium.expiresYear && week > premium.expiresWeek)) {
      state.premium = { tier: 'none', plan: 'none', expiresWeek: 0, expiresYear: 0 };
      messages.push('⏳ Your platform Premium subscription expired.');
    }
  }

  // 3. CREATOR STUDIO — impressions tracking for the analytics panel only.
  //    ALL revenue flows through the platform BANKS (monthly payout system);
  //    this legacy path no longer pays money directly to the wallet.
  //    NOTE: creatorStudio.weeklyAdRevenue holds the YT engine's accrual —
  //    do not zero it here.
  const totalPosts = Object.values(state.playerPosts || {}).reduce((a: number, arr: any[]) => a + (arr?.length || 0), 0);
  const impressions = totalPosts * Math.floor(500 + fameXp * 3);
  state.creatorStudio.totalImpressions += impressions;

  // 4. Reddit karma from real engagement
  state.redditKarma = (state.redditKarma || 0) + Math.floor(state.redditPosts.filter((p) => p.isPlayer).length * (2 + fameXp * 0.05));

  // 5. Marquee connections grow with projects
  state.marqueeConnections = (state.marqueeConnections || 0) + Math.floor((movies.length - (state as any)._lastMarqueeMovies || 0) * 2);
  (state as any)._lastMarqueeMovies = movies.length;

  return { messages, weeklyAdRevenue, moneyDelta };
}
