/**
 * HOLLYWOOD RISING - Global Social Media Engine & Data Service (Phase 2)
 * Connects Twitter/X, Instagram, YouTube, Official Website, Fan Club, Sponsorships, Writers & Analytics.
 * All social events originate from actual gameplay.
 */

import { Player, InboxMessage } from '../types/game';
import { SocialPost, HiredWriter, PremiumState, RedditPost, RedditComment, TelegramStory, MarqueeJob } from '../types/world';
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
}

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
          if (this.state.youtubeReviewWeeksLeft === undefined) this.state.youtubeReviewWeeksLeft = 0;
          if (this.state.youtubeCommunityStrikes === undefined) this.state.youtubeCommunityStrikes = 0;
          if (this.state.youtubeCopyrightStrikes === undefined) this.state.youtubeCopyrightStrikes = 0;
          if (!this.state.youtubeAlgorithmStatus) this.state.youtubeAlgorithmStatus = 'Observing New Creator';
          if (!this.state.youtubeChannelHealth) this.state.youtubeChannelHealth = 'Good Standing';
          if (!this.state.npcYouTubeChannels) this.state.npcYouTubeChannels = DEFAULT_NPC_YOUTUBE_CHANNELS;
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
        body: `Dear ${player.firstName},\n\nI have reviewed your Hollywood portfolio, recent filmography (${playerLeadRoles} Lead Roles), and public standing (${playerFame.toLocaleString()} Fame XP). My agency is pleased to accept your retainer proposal.\n\nBeginning this week, my team will craft and publish ${writer.postsPerWeek} automated high-engagement strategic posts per week directly on your official social feed. We will also monitor fan comments and optimize your follower growth.\n\nWeekly Retainer Fee: $${weeklyCost.toLocaleString()}\n\nWelcome to our client roster!\n\nBest regards,\n${writer.name}\n${writer.agencyName || 'Hollywood PR Media Group'}`,
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
  } {
    const state = this.getState();

    // 1. Reset Weekly Posts
    let baseWeeklyPosts = 2;
    const hiredWriter = state.writers.find((w) => w.hired);
    if (hiredWriter) {
      baseWeeklyPosts += Math.min(10, Math.floor(hiredWriter.postsPerWeek / 2));
    }

    const spentPostsThisWeek = Math.max(0, baseWeeklyPosts - state.postsRemainingThisWeek);
    state.postsRemainingThisWeek = baseWeeklyPosts;

    const socialPosts: string[] = [];
    const socialTrending: string[] = [];
    const socialReputation: string[] = [];
    let fanGrowth = 0;
    let weeklySponsorshipIncome = 0;
    let writerWeeklyCost = 0;

    // 2. Process PR Writers (Automated posting & Engagement boost)
    let writerPostCount = 0;
    if (hiredWriter) {
      hiredWriter.postsThisWeek = 0;
      if (hiredWriter.contractWeeksRemaining > 0) {
        hiredWriter.contractWeeksRemaining -= 1;
      }

      if (player.money >= hiredWriter.weeklyCost) {
        writerWeeklyCost = hiredWriter.weeklyCost;
        writerPostCount = Math.min(4, Math.max(1, Math.floor(hiredWriter.postsPerWeek / 2)));

        // Ghostwriter posts on player feed — references REAL events (releases, box office, awards)
        const mainPlatform: PlatformType = 'Twitter';
        if (state.createdPlatforms[mainPlatform]) {
          const latestRealMovie = saveData?.releasedMovies && saveData.releasedMovies.length > 0 ? saveData.releasedMovies[0] : null;
          const realTitle = latestRealMovie?.movieTitle || '';
          const realGross = latestRealMovie?.worldwideGross || 0;
          const realAud = latestRealMovie?.audienceRating || 0;
          const realAwards = (player as any).awardsWon || 0;
          const writerPostTemplates = [
            realTitle
              ? `'${realTitle}' is IN THEATERS NOW! ${realGross > 0 ? `Already past $${(realGross / 1000000).toFixed(1)}M worldwide ` : ''}— thank you to every single fan who showed up! 🎬🍿 #${realTitle.replace(/[^a-zA-Z0-9]/g, '')}`
              : `Behind the scenes in Hollywood! Working hard with top directors on upcoming projects. Special thanks to all the amazing fans supporting the journey! 🎬✨`,
            realTitle
              ? `The critics are loving '${realTitle}' (${realAud}% audience score)! This is only the beginning of the ride. 🔥`
              : `Exciting development meeting with major studio executives today. Big announcements coming very soon for all supporters! 🍿🔥`,
            realAwards > 0
              ? `What a season it's been — ${realAwards} award(s) and counting. Grateful beyond words. ❤️🏆`
              : `Reflecting on the dedication and craft required for every single scene. Grateful for this Hollywood journey and the best fanbase! ❤️`,
            `On set preparing for a demanding role. The hustle never stops in Los Angeles! Stay tuned! 🎭✨`,
          ];

          for (let i = 0; i < writerPostCount; i++) {
            const autoPostText = writerPostTemplates[i % writerPostTemplates.length];
            const currentFollowers = state.followers[mainPlatform] || 100;
            const eng = this.calculatePostEngagement(
              currentFollowers,
              state.verification[mainPlatform] || 'NONE',
              player,
              true
            );

            // Writer quality boost
            const boostFactor = 1 + (hiredWriter.qualityBoost || 15) / 100;
            eng.likes = Math.floor(eng.likes * boostFactor);
            eng.shares = Math.floor(eng.shares * boostFactor);
            eng.followerGain = Math.floor(eng.followerGain * boostFactor);

            const newPost: SocialPost = {
              id: `post_auto_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
              authorName: `${player.firstName} ${player.lastName}`,
              authorHandle: `@${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`,
              authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
              platform: mainPlatform,
              tab: 'PLAYER_FEED',
              text: autoPostText,
              likes: eng.likes,
              comments: eng.commentsCount,
              retweets: eng.shares,
              shares: eng.shares,
              timestamp: 'Just now',
              isPlayer: true,
              isNpc: false,
              sentiment: 'Positive',
              generatedByWriter: true,
            };

            const autoComments = this.generateNpcCommentsForPost(newPost.id, autoPostText, 35, player);
            newPost.comments = autoComments.length;

            state.playerPosts[mainPlatform].unshift(newPost);
            state.postComments[newPost.id] = autoComments;

            // Add real follower gains directly to platform and total fans
            state.followers[mainPlatform] = (state.followers[mainPlatform] || 0) + eng.followerGain;
            fanGrowth += eng.followerGain;
          }

          socialPosts.push(`✍️ Ghostwriter ${hiredWriter.name} published ${writerPostCount} strategic posts on your feed (+${fanGrowth.toLocaleString()} new followers).`);
        }
      }
    }

    // 3. Process Organic Follower Growth (ONLY IF ACTIVE)
    const hasActiveMovieInTheaters = (saveData?.releasedMovies || []).some((m: any) => (m.weeksInTheaters || 0) > 0);
    const hasRecentMovieRelease = (saveData?.releasedMovies || []).some((m: any) => (m.weeksInTheaters || 0) <= 4);
    const playerPostedActive = spentPostsThisWeek > 0;

    let organicGrowth = 0;
    // FIXED: No fake simulation - only real posting/writer activity gives followers, different per platform, max 500B, all start at 0
    if (playerPostedActive || writerPostCount > 0) {
      const fameFactor = Math.floor((player.fameXp || 0) * 0.7);
      const activityMultiplier = playerPostedActive ? 1.5 : 1.2;

      organicGrowth = Math.floor(fameFactor * activityMultiplier * (0.6 + Math.random() * 0.4));
      if (organicGrowth > 0) {
        fanGrowth += organicGrowth;

        // Distribute with DIFFERENT followers per platform (not equal) - organic, max 500B cap
        const activePlatforms = (Object.keys(state.createdPlatforms) as PlatformType[]).filter(
          (p) => state.createdPlatforms[p]
        );

        if (activePlatforms.length > 0) {
          const platformWeights: Record<string, number> = { Twitter: 0.35, Instagram: 0.40, YouTube: 0.15, Facebook: 0.05, Reddit: 0.03, Telegram: 0.02 };
          const totalWeight = activePlatforms.reduce((sum, plat) => sum + (platformWeights[plat] || 0.1), 0);
          activePlatforms.forEach((plat) => {
            const weight = (platformWeights[plat] || 0.1) / totalWeight;
            const platformGrowth = Math.floor(organicGrowth * weight * (0.8 + Math.random() * 0.4));
            const capped = Math.min(500000000000, (state.followers[plat] || 0) + platformGrowth);
            const actualGain = capped - (state.followers[plat] || 0);
            state.followers[plat] = capped;
            // Cap total at 500B per platform
            if ((state.followers[plat] || 0) > 500000000000) state.followers[plat] = 500000000000;
          });
        }
        socialPosts.push(`📈 Gained +${organicGrowth.toLocaleString()} organic followers from active Hollywood visibility.`);
      }
    } else {
      // Inactive week - ZERO passive growth!
      socialPosts.push(`📲 No social media posts or film releases this week. Organic follower growth was stagnant.`);
    }

    player.fans = (player.fans || 0) + fanGrowth;

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
    if (state.createdPlatforms.YouTube) {
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

      // 7c. Process Organic Video Growth & Algorithm Tracking
      let totalYtRevenueThisWeek = 0;
      let totalNewViewsThisWeek = 0;
      let totalNewWatchHrsThisWeek = 0;
      let totalNewSubsThisWeek = 0;

      state.youtubeVideos.forEach((vid) => {
        // Organic view velocity
        let baseVelocity = 0;
        if (state.youtubeSubscribers < 100) {
          // Small creator uploads: 5 to 120 views
          baseVelocity = Math.floor(Math.random() * 45) + 5;
        } else if (state.youtubeSubscribers < 1000) {
          baseVelocity = Math.floor(state.youtubeSubscribers * (0.1 + Math.random() * 0.2)) + 15;
        } else {
          baseVelocity = Math.floor(state.youtubeSubscribers * (0.05 + Math.random() * 0.15)) + 50;
        }

        // Category & Movie Bonus
        if (vid.category === 'TRAILER') {
          baseVelocity = Math.floor(baseVelocity * 3.5) + (player.fameXp * 5);
        } else if (vid.category === 'BEHIND_SCENES' || vid.category === 'INTERVIEW') {
          baseVelocity = Math.floor(baseVelocity * 1.8);
        }

        // Evergreen or decay
        if (vid.isEvergreen) {
          baseVelocity = Math.floor(baseVelocity * 0.8) + 10;
        } else {
          const weeksOld = Math.max(1, (player.dateWeek || 1) - vid.uploadWeek);
          baseVelocity = Math.floor(baseVelocity / Math.pow(1.8, weeksOld));
        }

        const newViews = Math.max(0, baseVelocity);
        vid.views += newViews;
        totalNewViewsThisWeek += newViews;

        // Watch Time (Hours)
        const durationSec = vid.durationSec || 600;
        const retention = (vid.retentionPercent || 50) / 100;
        const newWatchHrs = parseFloat(((newViews * durationSec * retention) / 3600).toFixed(1));
        vid.watchTimeHours = parseFloat(((vid.watchTimeHours || 0) + newWatchHrs).toFixed(1));
        totalNewWatchHrsThisWeek += newWatchHrs;

        // Likes, Comments, Shares, Subs
        if (newViews > 0) {
          const newLikes = Math.floor(newViews * ((vid.ctrPercent || 5) / 100) * 0.8);
          const newComments = Math.floor(newViews * 0.02);
          const newShares = Math.floor(newViews * 0.01);
          const newSubs = Math.floor(newViews * 0.012);

          vid.likes += newLikes;
          vid.commentsCount += newComments;
          vid.shares = (vid.shares || 0) + newShares;
          vid.subscribersGained = (vid.subscribersGained || 0) + newSubs;
          totalNewSubsThisWeek += newSubs;
        }

        // Monetization & AdSense Payout (ONLY IF APPROVED!)
        if (state.youtubeMonetizationStatus === 'APPROVED' && newViews > 0) {
          const cpm = 4.50 + Math.random() * 1.50; // $4.50 - $6.00 CPM
          const rev = Math.floor((newViews / 1000) * cpm);
          vid.estimatedRevenue += rev;
          totalYtRevenueThisWeek += rev;
        } else {
          // Unmonetized videos earn $0 revenue!
          vid.estimatedRevenue = vid.estimatedRevenue || 0;
        }
      });

      // Update Channel Totals
      state.youtubeWatchHours = parseFloat(((state.youtubeWatchHours || 0) + totalNewWatchHrsThisWeek).toFixed(1));
      state.youtubeSubscribers = (state.youtubeSubscribers || 0) + totalNewSubsThisWeek;
      state.youtubeTotalViews = (state.youtubeTotalViews || 0) + totalNewViewsThisWeek;

      if (totalYtRevenueThisWeek > 0) {
        socialPosts.push(`📺 Generated $${totalYtRevenueThisWeek.toLocaleString()} in YouTube AdSense revenue!`);
      }

      // 7d. Update Algorithm Status dynamically
      if (state.youtubeTotalViews < 500) {
        state.youtubeAlgorithmStatus = 'Observing New Creator';
      } else if (state.youtubeTotalViews < 5000) {
        state.youtubeAlgorithmStatus = 'Gaining Initial Momentum';
      } else if (state.youtubeTotalViews < 25000) {
        state.youtubeAlgorithmStatus = 'Niche Recommendation Push';
      } else if (state.youtubeTotalViews < 100000) {
        state.youtubeAlgorithmStatus = 'Algorithmic Distribution';
      } else {
        state.youtubeAlgorithmStatus = 'Viral Creator Powerhouse';
      }

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

    const activePlatforms = (Object.keys(state.createdPlatforms) as PlatformType[]).filter((p) => state.createdPlatforms[p]);
    const totalYtRevenueThisWeek = state.youtubeVideos.reduce((sum, v) => sum + (v.estimatedRevenue || 0), 0);

    // 8. Record Social Analytics Snapshot
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

    this.saveState(state);

    return {
      socialPosts,
      socialTrending,
      socialReputation,
      fanGrowth,
      weeklySponsorshipIncome,
      writerWeeklyCost,
      youtubeRevenue: totalYtRevenueThisWeek,
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
        if (!usedHandles.has(vip.handle)) {
          usedHandles.add(vip.handle);
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
      const roll = Math.random();
      let text = '';
      if (roll < 0.62) {
        text = positivePool[Math.floor(Math.random() * positivePool.length)];
      } else if (roll < 0.82) {
        text = neutralPool.length > 0 ? neutralPool[Math.floor(Math.random() * neutralPool.length)] : positivePool[Math.floor(Math.random() * positivePool.length)];
      } else {
        text = negativePool.length > 0 ? negativePool[Math.floor(Math.random() * negativePool.length)] : positivePool[Math.floor(Math.random() * positivePool.length)];
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
  maxContractWeeks: number;
  cancelFee: number;
  minFame: number;
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

// 24-WRITER POOL: 4 tiers x 6 specialties
export const SOCIAL_WRITER_POOL: SocialWriter[] = [
  // TIER 1 — Junior Bloggers ($250-400/wk)
  { id: 'w_j1', name: 'Nina Vale', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Film Reviewer', weeklyCost: 250, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 30, cancelFee: 500, minFame: 0, bio: 'Fresh film blog voice covering indie releases.', avatar: WRITER_AVATARS[0], agencyName: 'The Daily Marquee Blog' },
  { id: 'w_j2', name: 'Caleb Frost', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Gossip & Celebrity', weeklyCost: 275, postsPerWeek: 3, qualityBoost: 9, maxContractWeeks: 30, cancelFee: 550, minFame: 0, bio: 'Sunset Strip gossip columnist in training.', avatar: WRITER_AVATARS[1], agencyName: 'Sunset Scoop' },
  { id: 'w_j3', name: 'Rhea Patel', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Lifestyle & Brand', weeklyCost: 260, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 30, cancelFee: 520, minFame: 0, bio: 'Lifestyle writer for emerging talent.', avatar: WRITER_AVATARS[2], agencyName: 'La La Life Blog' },
  { id: 'w_j4', name: 'Oscar Bennet', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Film Reviewer', weeklyCost: 240, postsPerWeek: 2, qualityBoost: 7, maxContractWeeks: 30, cancelFee: 480, minFame: 0, bio: 'Movie lover writing honest reviews.', avatar: WRITER_AVATARS[3], agencyName: 'Popcorn Prophet' },
  { id: 'w_j5', name: 'Lena Cruz', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Awards Watch', weeklyCost: 280, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 30, cancelFee: 560, minFame: 0, bio: 'Tracks the awards season calendar.', avatar: WRITER_AVATARS[4], agencyName: 'The Reel Report' },
  { id: 'w_j6', name: 'Dante Fox', tier: 1, tierLabel: 'Tier 1 · Junior Blogger', specialty: 'Business & Trade', weeklyCost: 300, postsPerWeek: 2, qualityBoost: 8, maxContractWeeks: 30, cancelFee: 600, minFame: 0, bio: 'Reports on Hollywood money moves.', avatar: WRITER_AVATARS[5], agencyName: 'Studio Gate' },
  // TIER 2 — Content Writers ($600-900/wk)
  { id: 'w_c1', name: 'Ava Reed', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Film Reviewer', weeklyCost: 650, postsPerWeek: 4, qualityBoost: 18, maxContractWeeks: 30, cancelFee: 1500, minFame: 300, bio: 'Hollywood Insider blogger covering releases and red carpets.', avatar: WRITER_AVATARS[0], agencyName: 'Hollywood Insider Blog Network' },
  { id: 'w_c2', name: 'Jaxon Cole', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Gossip & Celebrity', weeklyCost: 600, postsPerWeek: 5, qualityBoost: 20, maxContractWeeks: 30, cancelFee: 1400, minFame: 500, bio: 'Gossip Wire specialist in celebrity news.', avatar: WRITER_AVATARS[1], agencyName: 'Gossip Wire Media' },
  { id: 'w_c3', name: 'Sierra Lane', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Film Reviewer', weeklyCost: 750, postsPerWeek: 4, qualityBoost: 22, maxContractWeeks: 30, cancelFee: 1700, minFame: 600, bio: 'Cinema Review Collective critic.', avatar: WRITER_AVATARS[2], agencyName: 'Cinema Review Collective' },
  { id: 'w_c4', name: 'Dylan Cross', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Awards Watch', weeklyCost: 800, postsPerWeek: 5, qualityBoost: 24, maxContractWeeks: 30, cancelFee: 1800, minFame: 800, bio: 'AwardsWatch blogger with insider buzz.', avatar: WRITER_AVATARS[3], agencyName: 'AwardsWatch Blog Network' },
  { id: 'w_c5', name: 'Mika Sato', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'International', weeklyCost: 900, postsPerWeek: 4, qualityBoost: 22, maxContractWeeks: 30, cancelFee: 2000, minFame: 1000, bio: 'Tokyo cinema blogger with global reach.', avatar: WRITER_AVATARS[4], agencyName: 'Asia Cinema Blog Network' },
  { id: 'w_c6', name: 'Ethan Brooks', tier: 2, tierLabel: 'Tier 2 · Content Writer', specialty: 'Business & Trade', weeklyCost: 850, postsPerWeek: 4, qualityBoost: 21, maxContractWeeks: 30, cancelFee: 1900, minFame: 900, bio: 'Trade reporter for financing and deals.', avatar: WRITER_AVATARS[5], agencyName: 'The Marquee Trade Desk' },
  // TIER 3 — Senior Publicists ($1,200-2,000/wk)
  { id: 'w_s1', name: 'Sophia Sterling', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'PR & Lifestyle', weeklyCost: 1250, postsPerWeek: 6, qualityBoost: 35, maxContractWeeks: 30, cancelFee: 4000, minFame: 2000, bio: 'Sterling PR Media Group senior publicist.', avatar: WRITER_AVATARS[0], agencyName: 'Sterling PR Media Group' },
  { id: 'w_s2', name: 'Marcus Hayes', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Awards Watch', weeklyCost: 1500, postsPerWeek: 6, qualityBoost: 40, maxContractWeeks: 30, cancelFee: 5000, minFame: 2500, bio: 'Beverly Hills PR specialist for campaigns.', avatar: WRITER_AVATARS[1], agencyName: 'Beverly Hills PR Specialists' },
  { id: 'w_s3', name: 'Isabella Fontaine', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Film Reviewer', weeklyCost: 1400, postsPerWeek: 6, qualityBoost: 38, maxContractWeeks: 30, cancelFee: 4600, minFame: 2200, bio: 'Trades-level critic and reporter.', avatar: WRITER_AVATARS[2], agencyName: 'Redwood Review Desk' },
  { id: 'w_s4', name: 'Andre Whitfield', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Business & Trade', weeklyCost: 1600, postsPerWeek: 7, qualityBoost: 42, maxContractWeeks: 30, cancelFee: 5200, minFame: 3000, bio: 'Variety-style entertainment business reporter.', avatar: WRITER_AVATARS[3], agencyName: 'The Marquee Business Desk' },
  { id: 'w_s5', name: 'Camille Dubois', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'Gossip & Celebrity', weeklyCost: 1300, postsPerWeek: 7, qualityBoost: 36, maxContractWeeks: 30, cancelFee: 4200, minFame: 2000, bio: 'Celebrity features writer with sources.', avatar: WRITER_AVATARS[4], agencyName: 'Fame Focus Media' },
  { id: 'w_s6', name: 'Lucas Meyer', tier: 3, tierLabel: 'Tier 3 · Senior Publicist', specialty: 'International', weeklyCost: 2000, postsPerWeek: 6, qualityBoost: 40, maxContractWeeks: 30, cancelFee: 6000, minFame: 3500, bio: 'Global press tour specialist.', avatar: WRITER_AVATARS[5], agencyName: 'Global Press Group' },
  // TIER 4 — Elite Ghostwriters ($3,000-5,000/wk)
  { id: 'w_e1', name: 'Vanguard Global PR', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'PR & Lifestyle', weeklyCost: 3200, postsPerWeek: 8, qualityBoost: 70, maxContractWeeks: 30, cancelFee: 12000, minFame: 6000, bio: 'Top-tier global PR agency with 24/7 account management.', avatar: WRITER_AVATARS[0], agencyName: 'Vanguard Global Communications Inc.' },
  { id: 'w_e2', name: 'Julian Cross', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Awards Watch', weeklyCost: 3800, postsPerWeek: 9, qualityBoost: 80, maxContractWeeks: 30, cancelFee: 14000, minFame: 8000, bio: 'Oscar campaign whisperer.', avatar: WRITER_AVATARS[1], agencyName: 'Cross Campaigns' },
  { id: 'w_e3', name: 'Victoria Reign', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Gossip & Celebrity', weeklyCost: 3500, postsPerWeek: 10, qualityBoost: 75, maxContractWeeks: 30, cancelFee: 13000, minFame: 7500, bio: 'The most connected celebrity writer in Hollywood.', avatar: WRITER_AVATARS[2], agencyName: 'Reign Media' },
  { id: 'w_e4', name: 'Silas Monroe', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Film Reviewer', weeklyCost: 3000, postsPerWeek: 8, qualityBoost: 65, maxContractWeeks: 30, cancelFee: 11000, minFame: 5000, bio: 'Legendary critic with a trusted byline.', avatar: WRITER_AVATARS[3], agencyName: 'The Marquee Review' },
  { id: 'w_e5', name: 'Gabriella Romano', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'Business & Trade', weeklyCost: 4500, postsPerWeek: 10, qualityBoost: 85, maxContractWeeks: 30, cancelFee: 16000, minFame: 10000, bio: 'Power broker of entertainment finance news.', avatar: WRITER_AVATARS[4], agencyName: 'Romano Partners Media' },
  { id: 'w_e6', name: 'Theodore Vance', tier: 4, tierLabel: 'Tier 4 · Elite Ghostwriter', specialty: 'International', weeklyCost: 5000, postsPerWeek: 12, qualityBoost: 90, maxContractWeeks: 30, cancelFee: 18000, minFame: 12000, bio: 'Global superstar ghostwriter.', avatar: WRITER_AVATARS[5], agencyName: 'Sterling Heights Media' },
];

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

// ---------- WRITERS (hire 1, max 30 weeks, cancel fee) ----------
export function hireSocialWriter(
  state: SocialsState,
  writerId: string,
  money: number
): { success: boolean; message: string; newMoney: number } {
  const existing = state.writers.find((w) => w.hired);
  if (existing) return { success: false, message: 'You already have a hired writer. Cancel their contract first.', newMoney: money };
  const w = SOCIAL_WRITER_POOL.find((x) => x.id === writerId);
  if (!w) return { success: false, message: 'Writer not found.', newMoney: money };
  if (money < w.weeklyCost) return { success: false, message: `Insufficient funds — ${w.name} costs $${w.weeklyCost}/wk.`, newMoney: money };
  state.writers = state.writers.map((wr) => wr.hired ? wr : wr);
  state.writers.push({
    id: w.id,
    name: w.name,
    tier: w.tier === 1 ? 'Low' : w.tier === 2 ? 'Medium' : w.tier === 3 ? 'Elite' : 'Elite',
    weeklyCost: w.weeklyCost,
    postsPerWeek: w.postsPerWeek,
    contractWeeksRemaining: w.maxContractWeeks,
    postsThisWeek: 0,
    qualityBoost: w.qualityBoost,
    hired: true,
    agencyName: w.agencyName,
    minFame: w.minFame,
    bio: w.bio,
    avatar: w.avatar,
  });
  return { success: true, message: `${w.name} (${w.agencyName}) hired for ${w.maxContractWeeks} weeks!`, newMoney: money };
}

export function fireSocialWriter(state: SocialsState, money: number): { success: boolean; message: string; newMoney: number } {
  const existing = state.writers.find((w) => w.hired);
  if (!existing) return { success: false, message: 'No writer hired.', newMoney: money };
  const pool = SOCIAL_WRITER_POOL.find((w) => w.id === existing.id);
  const fee = pool ? pool.cancelFee : 1000;
  if (money < fee) return { success: false, message: `Insufficient funds for cancellation fee ($${fee}).`, newMoney: money };
  state.writers = state.writers.filter((w) => w.id !== existing.id);
  return { success: true, message: `${existing.name} fired. Paid $${fee} cancellation fee.`, newMoney: money - fee };
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
  const latest = movies[0];
  const awards = player?.awardsWon || 0;
  const premium = state.premium || { tier: 'none', plan: 'none', expiresWeek: 0, expiresYear: 0 };

  // 1. PREMIUM EXPIRY
  if (premium.tier !== 'none') {
    if (year > premium.expiresYear || (year === premium.expiresYear && week > premium.expiresWeek)) {
      state.premium = { tier: 'none', plan: 'none', expiresWeek: 0, expiresYear: 0 };
      messages.push('⏳ Your platform Premium subscription expired.');
    }
  }

  // 2. WRITER AUTO-POSTS (1 hired writer posts on EVERY platform about REAL events)
  const writer = state.writers.find((w) => w.hired);
  if (writer && writer.contractWeeksRemaining > 0) {
    writer.contractWeeksRemaining -= 1;
    const boost = writer.qualityBoost || 10;
    const realEvent = latest
      ? { title: latest.movieTitle, gross: latest.worldwideGross || 0, aud: latest.audienceRating || 0 }
      : null;

    // Twitter (For You = player feed)
    if (realEvent) {
      const t = [
        `'${realEvent.title}' is IN THEATERS — $${(realEvent.gross / 1000000).toFixed(1)}M worldwide! 🎬`,
        `The critics are raving about '${realEvent.title}' (${realEvent.aud}% audience score)!`,
        awards > 0 ? `🏆 ${awards} award(s) this season — what a year it's been!` : `Excited about what's next — stay tuned!`,
      ];
      state.playerPosts.Twitter = state.playerPosts.Twitter || [];
      state.playerPosts.Twitter.unshift({
        id: `w_tw_${Date.now()}`,
        authorName: `${player.firstName} ${player.lastName}`,
        authorHandle: `@${(player.firstName || 'actor').toLowerCase()}${(player.lastName || '').toLowerCase()}`,
        authorAvatar: player.avatarUrl || '',
        platform: 'Twitter',
        tab: 'PLAYER_FEED',
        text: t[Math.floor(Math.random() * t.length)],
        likes: Math.floor(50 + fameXp * 0.5 + boost),
        comments: Math.floor(10 + fameXp * 0.2),
        retweets: Math.floor(20 + fameXp * 0.3),
        shares: 0,
        timestamp: 'Just now',
        isPlayer: true,
        isNpc: false,
        sentiment: 'Positive',
        generatedByWriter: true,
      });
    }
    // Instagram caption/story
    if (realEvent) {
      state.instagramPosts = state.instagramPosts || [];
      state.instagramPosts.unshift({
        id: `w_ig_${Date.now()}`,
        imageUrl: latest?.posterUrl || player.avatarUrl || '',
        caption: `Behind the scenes of '${realEvent.title}' 🎬 #${realEvent.title.replace(/[^a-zA-Z0-9]/g, '')}`,
        likes: Math.floor(80 + fameXp * 0.6 + boost),
        comments: Math.floor(12 + fameXp * 0.15),
        username: `${player.firstName}${player.lastName}`,
        timestamp: 'Just now',
        isPlayer: true,
      } as any);
    }
    // YouTube video publish + algorithm tracker
    if (realEvent) {
      state.youtubeVideos = state.youtubeVideos || [];
      state.youtubeVideos.unshift({
        id: `w_yt_${Date.now()}`,
        title: `'${realEvent.title}' — Official Trailer & BTS`,
        views: Math.floor(youtubeAlgorithmViews(state.youtubeAlgorithm.lifetimeVideos, fameXp, state.youtubeAlgorithm.discovered)),
        likes: 0,
        comments: 0,
        thumbnailUrl: latest?.posterUrl || player.avatarUrl || '',
        channelName: `${player.firstName} ${player.lastName}`,
        duration: '2:15',
        isPlayer: true,
        isLive: false,
      } as any);
      state.youtubeAlgorithm.lifetimeVideos += 1;
      if (state.youtubeAlgorithm.lifetimeVideos >= 55 && !state.youtubeAlgorithm.discovered) {
        state.youtubeAlgorithm.discovered = true;
        messages.push('🚀 The YouTube algorithm has discovered your channel — your videos are being pushed to new audiences!');
      }
    }
    // Facebook post
    state.facebookPosts = state.facebookPosts || [];
    state.facebookPosts.unshift({
      id: `w_fb_${Date.now()}`,
      authorName: `${player.firstName} ${player.lastName}`,
      authorHandle: '',
      authorAvatar: player.avatarUrl || '',
      platform: 'Facebook',
      tab: 'PLAYER_FEED',
      text: realEvent
        ? `So proud of '${realEvent.title}' — $${(realEvent.gross / 1000000).toFixed(1)}M worldwide! Thank you to everyone who came out. ❤️`
        : `Grateful for this incredible journey. More announcements coming soon! ✨`,
      likes: Math.floor(100 + fameXp * 0.8 + boost),
      comments: Math.floor(15 + fameXp * 0.2),
      retweets: 0,
      shares: Math.floor(30 + fameXp * 0.4),
      timestamp: 'Just now',
      isPlayer: true,
      isNpc: false,
      sentiment: 'Positive',
      generatedByWriter: true,
    } as any);
    // The Marquee professional post
    state.marqueePosts = state.marqueePosts || [];
    state.marqueePosts.unshift({
      id: `w_mq_${Date.now()}`,
      authorName: `${player.firstName} ${player.lastName}`,
      authorHandle: '',
      authorAvatar: player.avatarUrl || '',
      platform: 'Twitter',
      tab: 'PLAYER_FEED',
      text: realEvent
        ? `Thrilled to share that '${realEvent.title}' has earned $${(realEvent.gross / 1000000).toFixed(1)}M at the worldwide box office. Grateful to the studio and the incredible cast and crew.`
        : `Excited for what's next in this chapter of my career.`,
      likes: Math.floor(40 + fameXp * 0.4 + boost),
      comments: Math.floor(8 + fameXp * 0.1),
      retweets: 0,
      shares: Math.floor(10 + fameXp * 0.2),
      timestamp: 'Just now',
      isPlayer: true,
      isNpc: false,
      sentiment: 'Positive',
      generatedByWriter: true,
    } as any);
    // Reddit promo thread
    state.redditPosts = state.redditPosts || [];
    if (realEvent) {
      state.redditPosts.unshift({
        id: `w_rd_${Date.now()}`,
        subreddit: 'r/HollywoodRising',
        author: `u/${(player.firstName || 'actor').toLowerCase()}${(player.lastName || '').toLowerCase()}`,
        title: `I'm ${player.firstName} ${player.lastName}, star of '${realEvent.title}' — ask me anything! 🎬`,
        text: `AMA! Ask me anything about '${realEvent.title}', the box office run, or my career.`,
        upvotes: Math.floor(30 + fameXp * 0.4 + boost),
        commentCount: Math.floor(5 + fameXp * 0.1),
        isPlayer: true,
        isNpc: false,
        flair: 'AMA',
        timeText: 'Just now',
        week,
        year,
      });
    }
    // Telegram channel post + subscriber growth
    state.telegramStories = state.telegramStories || [];
    state.telegramStories.unshift({
      id: `w_tg_${Date.now()}`,
      author: `${player.firstName} ${player.lastName}`,
      text: realEvent ? `📣 '${realEvent.title}' is in theaters now — $${(realEvent.gross / 1000000).toFixed(1)}M worldwide!` : `📣 New week, new moves. Stay tuned.`,
      hoursLeft: 24,
      isPlayer: true,
      week,
      year,
    });
    const subGrowth = Math.floor(2 + fameXp * 0.4 + boost);
    state.telegramChannelSubs = (state.telegramChannelSubs || 0) + subGrowth;

    messages.push(`✍️ ${writer.name} published content across your platforms (+${subGrowth} Telegram channel subs).`);
    if (writer.contractWeeksRemaining <= 0) {
      messages.push(`✅ Writer contract with ${writer.name} completed.`);
    }
  }

  // 3. CREATOR STUDIO — ad revenue share (Premium only, real impressions)
  const totalPosts = Object.values(state.playerPosts || {}).reduce((a: number, arr: any[]) => a + (arr?.length || 0), 0);
  const impressions = totalPosts * Math.floor(500 + fameXp * 3);
  state.creatorStudio.totalImpressions += impressions;
  if (premium.tier !== 'none') {
    weeklyAdRevenue = Math.floor(impressions * 0.004 * (premium.tier === 'pro' ? 2 : premium.tier === 'plus' ? 1.5 : 1));
    state.creatorStudio.totalAdRevenue += weeklyAdRevenue;
    state.creatorStudio.weeklyAdRevenue = weeklyAdRevenue;
    moneyDelta = weeklyAdRevenue;
    if (weeklyAdRevenue > 0) messages.push(`💰 Creator Studio ad revenue: +$${weeklyAdRevenue.toLocaleString()} (${impressions.toLocaleString()} impressions)`);
  }

  // 4. Reddit karma from real engagement
  state.redditKarma = (state.redditKarma || 0) + Math.floor(state.redditPosts.filter((p) => p.isPlayer).length * (2 + fameXp * 0.05));

  // 5. Marquee connections grow with projects
  state.marqueeConnections = (state.marqueeConnections || 0) + Math.floor((movies.length - (state as any)._lastMarqueeMovies || 0) * 2);
  (state as any)._lastMarqueeMovies = movies.length;

  return { messages, weeklyAdRevenue, moneyDelta };
}
