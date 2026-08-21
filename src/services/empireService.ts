/**
 * HOLLYWOOD RISING - Empire System Service
 * Central Data Manager, Simulation Engine, and Storage Handler for Phase 5 Empire Scene
 */

import { Player } from '../types/game';
import { FAME_XP_MULTIPLIER } from './fameService';
import { processRivalriesWeek } from './rivalryService';
import {
  RealEstatePhase,
  RealEstateType,
  EmpireFullState,
  Executive,
  HoldingCompany,
  BusinessVenture,
  CommercialRealEstate,
  RivalryNPC,
  EliteNPC,
  EliteClubState,
  ActingAcademyState,
  TaxBreakdown,
  EmpireAchievement,
  LegacyState,
  CorporateBoardState,
  GlobalRegion,
  FoundationState,
  EliteEventOption,
  BoardSeatOption,
  GlobalHubOption,
  FoundationCauseOption,
  SecurityPackage,
  InvestmentOpportunity,
  AcquisitionTargetCompany,
} from '../types/empire';

const EMPIRE_STORAGE_KEY = 'hollywood_rising_empire_save_v1';

// Initial Elite NPCs Pool
export const INITIAL_ELITE_NPCS: EliteNPC[] = [
  {
    id: 'elite_1',
    name: 'Leonardo Vance',
    title: 'A-List Oscar Winning Actor',
    gender: 'Male',
    category: 'Actor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    age: 44,
    nationality: 'American',
    netWorth: 260000000,
    companyName: 'Appian Way Productions',
    socialHandle: '@leovance',
    relationshipScore: 10,
    status: 'Acquaintance',
  },
  {
    id: 'elite_2',
    name: 'Seraphina Sterling',
    title: 'Pop Superstar & Fashion Icon',
    gender: 'Female',
    category: 'Musician',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    age: 31,
    nationality: 'British',
    netWorth: 410000000,
    companyName: 'Sterling Beauty Co.',
    socialHandle: '@seraphina',
    relationshipScore: 5,
    status: 'Acquaintance',
  },
  {
    id: 'elite_3',
    name: 'Marcus "The Titan" Thorne',
    title: 'NBA Superstar & Venture Investor',
    gender: 'Male',
    category: 'Athlete',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    age: 33,
    nationality: 'American',
    netWorth: 580000000,
    companyName: 'Thorne Capital Partners',
    socialHandle: '@marcustitan',
    relationshipScore: 0,
    status: 'Acquaintance',
  },
  {
    id: 'elite_4',
    name: 'Elon Musk-esque Tech Titan',
    title: 'Founder & CEO of X-Aero Tech',
    gender: 'Male',
    category: 'Tech CEO',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    age: 48,
    nationality: 'South African / US',
    netWorth: 180000000000,
    companyName: 'X-Aero Technologies',
    socialHandle: '@xaerotech',
    relationshipScore: -5,
    status: 'Acquaintance',
  },
  {
    id: 'elite_5',
    name: 'Princess Sophia of Savoy',
    title: 'European Royalty & Arts Patron',
    gender: 'Female',
    category: 'Royal Family',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    age: 29,
    nationality: 'Italian',
    netWorth: 1200000000,
    companyName: 'Savoy Heritage Trust',
    socialHandle: '@princess_sophia',
    relationshipScore: 15,
    status: 'Acquaintance',
  },
  {
    id: 'elite_6',
    name: 'Harrison Ford-esque Director',
    title: 'Legendary Blockbuster Director',
    gender: 'Male',
    category: 'Director',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    age: 62,
    nationality: 'American',
    netWorth: 950000000,
    companyName: 'Lightwave Cinema Arts',
    socialHandle: '@director_lightwave',
    relationshipScore: 20,
    status: 'Acquaintance',
  },
  {
    id: 'elite_7',
    name: 'Madame Vivienne Arnault',
    title: 'Chairwoman of LVMH Luxury Group',
    gender: 'Female',
    category: 'Luxury Mogul',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    age: 56,
    nationality: 'French',
    netWorth: 45000000000,
    companyName: 'Arnault Luxury Group',
    socialHandle: '@arnault_luxury',
    relationshipScore: 0,
    status: 'Acquaintance',
  },
  {
    id: 'elite_8',
    name: 'Senator Arthur Pendelton',
    title: 'US Senate Appropriations Chair',
    gender: 'Male',
    category: 'Politician',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    age: 61,
    nationality: 'American',
    netWorth: 42000000,
    companyName: 'Pendelton Foundation',
    socialHandle: '@senator_pendelton',
    relationshipScore: 0,
    status: 'Acquaintance',
  },
];

// Initial Available VIP Event Options
export const ELITE_EVENT_CATALOG: EliteEventOption[] = [
  {
    id: 'evt_charity_gala',
    title: 'Metropolitan Charity Gala',
    category: 'Charity Gala',
    cost: 50000,
    minFameRequired: 500,
    description: 'Black-tie fundraising banquet with Hollywood elites and billionaires.',
  },
  {
    id: 'evt_premiere',
    title: 'Red Carpet Movie Premiere',
    category: 'Movie Premiere',
    cost: 25000,
    minFameRequired: 300,
    description: 'Host exclusive after-party for top studio executives and critics.',
  },
  {
    id: 'evt_yacht',
    title: 'Monaco Superyacht Weekend',
    category: 'Yacht Weekend',
    cost: 250000,
    minFameRequired: 1500,
    description: 'Ultra-private networking weekend on a 200ft yacht in the French Riviera.',
  },
  {
    id: 'evt_summit',
    title: 'Global Tech & Film Innovation Summit',
    category: 'Tech Summit',
    cost: 100000,
    minFameRequired: 1000,
    description: 'Keynote panels and deal-making dinners with Silicon Valley venture capital.',
  },
  {
    id: 'evt_casino',
    title: 'High-Stakes Casino VIP Night',
    category: 'Casino Night',
    cost: 150000,
    minFameRequired: 800,
    description: 'High-roller poker night in Monte Carlo with oil tycoons and sports stars.',
  },
  {
    id: 'evt_island',
    title: 'Private Island Executive Retreat',
    category: 'Island Retreat',
    cost: 500000,
    minFameRequired: 3000,
    description: 'Exclusive 3-day island summit to discuss mega-mergers and studio deals.',
  },
];

export const BOARD_SEAT_CATALOG: BoardSeatOption[] = [
  { companyName: 'Paramount Global', industry: 'Film Studio', annualCompensation: 270000, stockOptionsGrant: 950000, minFameRequired: 100 },
  { companyName: 'Nike Inc.', industry: 'Apparel & Sports', annualCompensation: 250000, stockOptionsGrant: 900000, minFameRequired: 250 },
  { companyName: 'Sony Pictures', industry: 'Entertainment', annualCompensation: 280000, stockOptionsGrant: 1000000, minFameRequired: 400 },
  { companyName: 'Warner Bros. Discovery', industry: 'Film & Media', annualCompensation: 300000, stockOptionsGrant: 1200000, minFameRequired: 600 },
  { companyName: 'Netflix Inc.', industry: 'Streaming Media', annualCompensation: 400000, stockOptionsGrant: 1800000, minFameRequired: 800 },
  { companyName: 'The Walt Disney Company', industry: 'Entertainment', annualCompensation: 350000, stockOptionsGrant: 1500000, minFameRequired: 1000 },
  { companyName: 'LVMH Moët Hennessy', industry: 'Luxury Goods', annualCompensation: 450000, stockOptionsGrant: 2000000, minFameRequired: 1500 },
  { companyName: 'Apple Inc.', industry: 'Technology', annualCompensation: 500000, stockOptionsGrant: 2500000, minFameRequired: 2000 },
];

export const GLOBAL_HUB_CATALOG: GlobalHubOption[] = [
  { cityName: 'London', country: 'United Kingdom', cost: 1000000, weeklyExpense: 25000, regionalBonus: 'Access to European film tax credits & West End theatre' },
  { cityName: 'Tokyo', country: 'Japan', cost: 1500000, weeklyExpense: 35000, regionalBonus: 'Dominance in Asian gaming & anime distribution hubs' },
  { cityName: 'Paris', country: 'France', cost: 1200000, weeklyExpense: 30000, regionalBonus: 'Haute couture fashion partnerships & Cannes networking' },
  { cityName: 'Dubai', country: 'United Arab Emirates', cost: 2000000, weeklyExpense: 40000, regionalBonus: 'Zero corporate tax rate & Middle East luxury real estate' },
  { cityName: 'Seoul', country: 'South Korea', cost: 900000, weeklyExpense: 22000, regionalBonus: 'K-Drama & K-Pop global syndication rights' },
  { cityName: 'Beijing', country: 'China', cost: 2500000, weeklyExpense: 50000, regionalBonus: 'Access to massive Chinese theatrical box office market' },
];

export const FOUNDATION_CAUSES_CATALOG: FoundationCauseOption[] = [
  { name: 'Hollywood Classic Film Preservation', category: 'Arts & Culture', goodwillBoost: 15, description: 'Restoring historic nitrate 35mm master prints for national archives.' },
  { name: 'Underrepresented Actors Scholarship Fund', category: 'Education', goodwillBoost: 20, description: 'Full tuition conservatory grants for promising young performers.' },
  { name: 'Motion Picture Pension & Medical Relief', category: 'Healthcare', goodwillBoost: 18, description: 'Supporting elderly crew members and retired studio technicians.' },
  { name: 'Global Wildlife & Ocean Conservation', category: 'Environment', goodwillBoost: 25, description: 'Funding marine sanctuaries and rainforest preservation fleets.' },
];

// Initial Achievements
export const INITIAL_ACHIEVEMENTS: EmpireAchievement[] = [
  // CAREER (15)
  { id: 'ach_c_1', title: 'Step Into The Spotlight', description: 'Complete your first audition.', category: 'Career', rewardCash: 2500, rewardFameXp: 50, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_c_2', title: 'First Acting Role', description: 'Land your very first acting role.', category: 'Career', rewardCash: 5000, rewardFameXp: 100, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_c_3', title: 'Big Screen Debut', description: 'Star in your first feature film.', category: 'Career', rewardCash: 12500, rewardFameXp: 250, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_c_4', title: 'Rising Star', description: 'Reach 1,000 Fame XP.', category: 'Career', rewardCash: 25000, rewardFameXp: 500, isUnlocked: false, progress: 0, maxProgress: 1000 },
  { id: 'ach_c_5', title: 'A-List Powerhouse', description: 'Reach 10,000 Fame XP.', category: 'Career', rewardCash: 75000, rewardFameXp: 1250, isUnlocked: false, progress: 0, maxProgress: 10000 },
  { id: 'ach_c_6', title: 'Living Legend', description: 'Reach 50,000 Fame XP.', category: 'Career', rewardCash: 250000, rewardFameXp: 5000, isUnlocked: false, progress: 0, maxProgress: 50000 },
  { id: 'ach_c_7', title: 'Workaholic Actor', description: 'Complete 10 acting roles.', category: 'Career', rewardCash: 37500, rewardFameXp: 750, isUnlocked: false, progress: 0, maxProgress: 10 },
  { id: 'ach_c_8', title: 'Cinema Veteran', description: 'Complete 25 acting roles.', category: 'Career', rewardCash: 100000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 25 },
  { id: 'ach_c_9', title: 'Filmography Titan', description: 'Complete 50 acting roles.', category: 'Career', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 50 },
  { id: 'ach_c_10', title: 'Blockbuster Lead', description: 'Star in a film earning $100M+ Box Office.', category: 'Career', rewardCash: 125000, rewardFameXp: 1000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_c_11', title: 'Billion Dollar Actor', description: 'Accumulate $1 Billion lifetime Box Office.', category: 'Career', rewardCash: 500000, rewardFameXp: 5000, isUnlocked: false, progress: 0, maxProgress: 1000000000 },
  { id: 'ach_c_12', title: "Director's Vision", description: 'Direct your first feature film.', category: 'Career', rewardCash: 75000, rewardFameXp: 1000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_c_13', title: 'Executive Producer', description: 'Executive produce a feature film.', category: 'Career', rewardCash: 100000, rewardFameXp: 1250, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_c_14', title: 'Academy Scholar', description: 'Enroll and complete an Acting Academy course.', category: 'Career', rewardCash: 25000, rewardFameXp: 400, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_c_15', title: 'Flawless Masterpiece', description: 'Star in a film rated 90%+ by critics.', category: 'Career', rewardCash: 150000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 1 },

  // BUSINESS (10)
  { id: 'ach_b_1', title: 'First Venture', description: 'Launch your first business venture.', category: 'Business', rewardCash: 25000, rewardFameXp: 250, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_b_2', title: 'Serial Entrepreneur', description: 'Own 3 active business ventures.', category: 'Business', rewardCash: 75000, rewardFameXp: 750, isUnlocked: false, progress: 0, maxProgress: 3 },
  { id: 'ach_b_3', title: 'Corporate Empire', description: 'Own 5 active business ventures.', category: 'Business', rewardCash: 150000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 5 },
  { id: 'ach_b_4', title: 'Holding Conglomerate', description: 'Form your official Holding Company.', category: 'Business', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_b_5', title: 'Wall Street Bell', description: 'Take a business public via an IPO.', category: 'Business', rewardCash: 500000, rewardFameXp: 4000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_b_6', title: '$10M Valuation', description: 'Build a business with $10,000,000 valuation.', category: 'Business', rewardCash: 125000, rewardFameXp: 1250, isUnlocked: false, progress: 0, maxProgress: 10000000 },
  { id: 'ach_b_7', title: 'Hollywood Unicorn', description: 'Build a business with $100,000,000 valuation.', category: 'Business', rewardCash: 500000, rewardFameXp: 5000, isUnlocked: false, progress: 0, maxProgress: 100000000 },
  { id: 'ach_b_8', title: 'Billion Dollar Conglomerate', description: 'Reach $1,000,000,000 Holding Company valuation.', category: 'Business', rewardCash: 1250000, rewardFameXp: 10000, isUnlocked: false, progress: 0, maxProgress: 1000000000 },
  { id: 'ach_b_9', title: 'Passive Cash Engine', description: 'Generate $100,000+ weekly passive business income.', category: 'Business', rewardCash: 250000, rewardFameXp: 2000, isUnlocked: false, progress: 0, maxProgress: 100000 },
  { id: 'ach_b_10', title: 'Boardroom Titan', description: 'Secure a corporate board seat at a major enterprise.', category: 'Business', rewardCash: 200000, rewardFameXp: 1750, isUnlocked: false, progress: 0, maxProgress: 1 },

  // AWARDS (10)
  { id: 'ach_a_1', title: 'First Nomination', description: 'Receive your first major award nomination.', category: 'Awards', rewardCash: 12500, rewardFameXp: 250, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_a_2', title: 'Golden Statuette', description: 'Win your first major acting award.', category: 'Awards', rewardCash: 50000, rewardFameXp: 750, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_a_3', title: 'Triple Crown Winner', description: 'Win 3 major acting awards.', category: 'Awards', rewardCash: 125000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 3 },
  { id: 'ach_a_4', title: 'Trophy Room Overflow', description: 'Win 10 major acting awards.', category: 'Awards', rewardCash: 375000, rewardFameXp: 3750, isUnlocked: false, progress: 0, maxProgress: 10 },
  { id: 'ach_a_5', title: 'Academy Award Honor', description: 'Win an Oscar for Best Actor.', category: 'Awards', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_a_6', title: 'Best Director Gold', description: 'Win a Best Director Award.', category: 'Awards', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_a_7', title: 'Palme d’Or Glory', description: 'Win a prestigious international film festival prize.', category: 'Awards', rewardCash: 175000, rewardFameXp: 2000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_a_8', title: 'Double Winner', description: 'Win both Acting and Producing awards in the same ceremony.', category: 'Awards', rewardCash: 300000, rewardFameXp: 3000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_a_9', title: 'Lifetime Achievement', description: 'Receive the Hollywood Lifetime Achievement Award.', category: 'Awards', rewardCash: 500000, rewardFameXp: 5000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_a_10', title: 'Dominant Dynasty', description: 'Accumulate 20+ career awards and honors.', category: 'Awards', rewardCash: 750000, rewardFameXp: 7500, isUnlocked: false, progress: 0, maxProgress: 20 },

  // EMPIRE (10)
  { id: 'ach_e_1', title: 'Prime Property', description: 'Purchase your first commercial real estate property.', category: 'Empire', rewardCash: 50000, rewardFameXp: 500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_e_2', title: 'Studio Production Lot', description: 'Acquire a full Hollywood Film Production Lot.', category: 'Empire', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_e_3', title: 'Real Estate Baron', description: 'Own 5 commercial properties.', category: 'Empire', rewardCash: 375000, rewardFameXp: 3000, isUnlocked: false, progress: 0, maxProgress: 5 },
  { id: 'ach_e_4', title: 'Bel-Air Elite', description: 'Join the exclusive Hollywood Elite Club.', category: 'Empire', rewardCash: 125000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_e_5', title: 'Philanthropic Legacy', description: 'Establish your Global Philanthropic Foundation.', category: 'Empire', rewardCash: 150000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_e_6', title: '$1M Benefactor', description: 'Donate over $1,000,000 to charity causes.', category: 'Empire', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 1000000 },
  { id: 'ach_e_7', title: 'International Footprint', description: 'Build your first overseas regional office.', category: 'Empire', rewardCash: 20000, rewardFameXp: 200, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_e_8', title: 'Global Hegemony', description: 'Build regional hubs in 3 continents.', category: 'Empire', rewardCash: 75000, rewardFameXp: 750, isUnlocked: false, progress: 0, maxProgress: 3 },
  { id: 'ach_e_9', title: 'Acting Conservatory', description: 'Found the Hollywood Acting Academy.', category: 'Empire', rewardCash: 175000, rewardFameXp: 1750, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_e_10', title: 'Terrazzo Star', description: 'Unveil your Walk of Fame Star on Hollywood Blvd.', category: 'Empire', rewardCash: 500000, rewardFameXp: 5000, isUnlocked: false, progress: 0, maxProgress: 1 },

  // SOCIAL MEDIA (10)
  { id: 'ach_s_1', title: '100K Followers', description: 'Reach 100,000 social media followers.', category: 'Social Media', rewardCash: 12500, rewardFameXp: 250, isUnlocked: false, progress: 0, maxProgress: 100000 },
  { id: 'ach_s_2', title: '1M Followers', description: 'Reach 1,000,000 social media followers.', category: 'Social Media', rewardCash: 50000, rewardFameXp: 750, isUnlocked: false, progress: 0, maxProgress: 1000000 },
  { id: 'ach_s_3', title: '10M Followers', description: 'Reach 10,000,000 social media followers.', category: 'Social Media', rewardCash: 150000, rewardFameXp: 2000, isUnlocked: false, progress: 0, maxProgress: 10000000 },
  { id: 'ach_s_4', title: '100M Super Icon', description: 'Reach 100,000,000 social media followers.', category: 'Social Media', rewardCash: 500000, rewardFameXp: 5000, isUnlocked: false, progress: 0, maxProgress: 100000000 },
  { id: 'ach_s_5', title: '1 Billion Followers', description: 'Reach 1 Billion global social media followers.', category: 'Social Media', rewardCash: 2500000, rewardFameXp: 12500, isUnlocked: false, progress: 0, maxProgress: 1000000000 },
  { id: 'ach_s_6', title: '#1 World Trend', description: 'Trend #1 worldwide on social media.', category: 'Social Media', rewardCash: 100000, rewardFameXp: 1250, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_s_7', title: 'Viral Sensationalist', description: 'Post content receiving over 10M engagements.', category: 'Social Media', rewardCash: 175000, rewardFameXp: 1750, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_s_8', title: 'Blue Checkmark Elite', description: 'Achieve verified status across all networks.', category: 'Social Media', rewardCash: 25000, rewardFameXp: 500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_s_9', title: 'PR Controversy Master', description: 'Defuse a major public media scandal.', category: 'Social Media', rewardCash: 125000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_s_10', title: 'Global Fan Army', description: 'Mobilize 500,000 registered fan club members.', category: 'Social Media', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 500000 },

  // MONEY (10)
  { id: 'ach_m_1', title: 'Six-Figure Bankroll', description: 'Accumulate $100,000 in liquid cash.', category: 'Money', rewardCash: 10000, rewardFameXp: 150, isUnlocked: false, progress: 0, maxProgress: 100000 },
  { id: 'ach_m_2', title: 'Liquid Millionaire', description: 'Accumulate $1,000,000 in liquid cash.', category: 'Money', rewardCash: 50000, rewardFameXp: 750, isUnlocked: false, progress: 0, maxProgress: 1000000 },
  { id: 'ach_m_3', title: '$10M Cash Reserve', description: 'Accumulate $10,000,000 in liquid cash.', category: 'Money', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 10000000 },
  { id: 'ach_m_4', title: '$100M Warchest', description: 'Accumulate $100,000,000 in liquid cash.', category: 'Money', rewardCash: 1000000, rewardFameXp: 7500, isUnlocked: false, progress: 0, maxProgress: 100000000 },
  { id: 'ach_m_5', title: 'Billionaire Status', description: 'Reach $1 Billion total net worth.', category: 'Money', rewardCash: 5000000, rewardFameXp: 25000, isUnlocked: false, progress: 0, maxProgress: 1000000000 },
  { id: 'ach_m_6', title: 'Forbes 100 List', description: 'Secure a spot on the Forbes Richest Celebrities list.', category: 'Money', rewardCash: 500000, rewardFameXp: 5000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_m_7', title: 'Forbes #1 Rank', description: 'Reach #1 Richest Celebrity on Forbes.', category: 'Money', rewardCash: 2500000, rewardFameXp: 12500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_m_8', title: 'Mega Acting Payday', description: 'Earn $10M+ from a single movie contract.', category: 'Money', rewardCash: 375000, rewardFameXp: 3750, isUnlocked: false, progress: 0, maxProgress: 10000000 },
  { id: 'ach_m_9', title: 'High Tax Shield', description: 'Save $250,000+ in taxes through elite CPA planning.', category: 'Money', rewardCash: 150000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 250000 },
  { id: 'ach_m_10', title: 'Half-Million Weekly Cashflow', description: 'Generate $500,000+ total weekly income.', category: 'Money', rewardCash: 750000, rewardFameXp: 6000, isUnlocked: false, progress: 0, maxProgress: 500000 },

  // SECRET / HIDDEN (5)
  { id: 'ach_h_1', title: 'Arch Enemy Feud', description: 'Escalate a rivalry to Arch Rival or Legendary Rival status.', category: 'Secret', rewardCash: 125000, rewardFameXp: 1500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_h_2', title: 'Bestselling Memoir', description: 'Publish your autobiography "Rise of the Mogul".', category: 'Secret', rewardCash: 150000, rewardFameXp: 1750, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_h_3', title: 'Peace Summit Diplomat', description: 'Successfully end an Arch Rivalry via Chateau Marmont truce.', category: 'Secret', rewardCash: 200000, rewardFameXp: 2000, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_h_4', title: 'Tax Optimization Wizard', description: 'Achieve 0% effective tax rate with offshore attorneys.', category: 'Secret', rewardCash: 250000, rewardFameXp: 2500, isUnlocked: false, progress: 0, maxProgress: 1 },
  { id: 'ach_h_5', title: 'Hollywood Overlord', description: 'Reach 50,000+ Hall of Fame Legacy points.', category: 'Secret', rewardCash: 1000000, rewardFameXp: 10000, isUnlocked: false, progress: 0, maxProgress: 50000 },
];

// Initial Global Regions
export const INITIAL_GLOBAL_REGIONS: GlobalRegion[] = [
  {
    id: 'north_america',
    name: 'North America (USA / Canada)',
    flagEmoji: '🇺🇸',
    taxRate: 0.25,
    marketDemand: 'Explosive',
    regulatoryFriction: 'Low',
    officesBuilt: 1, // Default home market
    regionalRevenue: 0,
    localCompetitorsCount: 15,
  },
  {
    id: 'europe',
    name: 'Europe (UK / France / Germany)',
    flagEmoji: '🇪🇺',
    taxRate: 0.28,
    marketDemand: 'High',
    regulatoryFriction: 'Medium',
    officesBuilt: 0,
    regionalRevenue: 0,
    localCompetitorsCount: 12,
  },
  {
    id: 'asia',
    name: 'Asia-Pacific (Japan / China / SK)',
    flagEmoji: '🌏',
    taxRate: 0.20,
    marketDemand: 'Explosive',
    regulatoryFriction: 'Strict',
    officesBuilt: 0,
    regionalRevenue: 0,
    localCompetitorsCount: 20,
  },
  {
    id: 'south_america',
    name: 'South America (Brazil / Mexico)',
    flagEmoji: '🇲🇽',
    taxRate: 0.18,
    marketDemand: 'Moderate',
    regulatoryFriction: 'Medium',
    officesBuilt: 0,
    regionalRevenue: 0,
    localCompetitorsCount: 8,
  },
  {
    id: 'australia',
    name: 'Australia & Oceania',
    flagEmoji: '🇦🇺',
    taxRate: 0.22,
    marketDemand: 'Moderate',
    regulatoryFriction: 'Low',
    officesBuilt: 0,
    regionalRevenue: 0,
    localCompetitorsCount: 6,
  },
  {
    id: 'africa',
    name: 'Africa & Middle East (UAE / SA)',
    flagEmoji: '🇦🇪',
    taxRate: 0.12,
    marketDemand: 'Emerging',
    regulatoryFriction: 'Medium',
    officesBuilt: 0,
    regionalRevenue: 0,
    localCompetitorsCount: 5,
  },
];

// Initial Security Packages
export const INITIAL_SECURITY_PACKAGES: SecurityPackage[] = [
  { id: 'sec_1', name: 'Personal Armed Bodyguard Detail', category: 'Personal Bodyguards', weeklyCost: 5000, protectionRating: 35, description: '24/7 armed personal protection officers.', isHired: false },
  { id: 'sec_2', name: 'Executive Protection Taskforce', category: 'Executive Protection', weeklyCost: 12000, protectionRating: 60, description: 'Tactical convoy and C-suite defensive detail.', isHired: false },
  { id: 'sec_3', name: 'Home Estate Perimeter Defense', category: 'Home Security', weeklyCost: 8000, protectionRating: 50, description: 'Safehouses, motion sensors, biometrics & estate guards.', isHired: false },
  { id: 'sec_4', name: 'Corporate HQ Armed Security', category: 'Office Security', weeklyCost: 10000, protectionRating: 55, description: 'Building access control, guards and lobby security.', isHired: false },
  { id: 'sec_5', name: 'Cyber Warfare & Anti-Hack Shield', category: 'Cyber Security', weeklyCost: 7500, protectionRating: 65, description: 'Encrypted communications, firewalls & anti-doxxing.', isHired: false },
  { id: 'sec_6', name: 'Overseas Travel Escort Unit', category: 'Travel Security', weeklyCost: 15000, protectionRating: 75, description: 'Armored transport, private jets & diplomatic clearance.', isHired: false },
  { id: 'sec_7', name: 'Family High-Risk Protection', category: 'Family Security', weeklyCost: 14000, protectionRating: 80, description: 'Discreet protection detail for loved ones.', isHired: false },
  { id: 'sec_8', name: 'Red Carpet & VIP Event Contingent', category: 'Event Security', weeklyCost: 9000, protectionRating: 60, description: 'Crowd control, paparazzi management & anti-pestering.', isHired: false },
];

// Initial Investment Opportunities
export const INITIAL_INVESTMENT_OPPORTUNITIES: InvestmentOpportunity[] = [
  { id: 'inv_1', title: 'Paragon Pictures Stock', companyName: 'Paragon Cinema Group', sector: 'Film Studios', sharePrice: 45, totalSharesAvailable: 100000, volatility: 'Medium', dividendYieldPercent: 3.2, description: 'Major Hollywood motion picture studio.', historicalReturnPercent: 8.5 },
  { id: 'inv_2', title: 'Apex AI Quantum Systems', companyName: 'Apex Quantum Tech', sector: 'Technology', sharePrice: 125, totalSharesAvailable: 50000, volatility: 'High', dividendYieldPercent: 1.2, description: 'Cutting-edge AI infrastructure provider.', historicalReturnPercent: 18.2 },
  { id: 'inv_3', title: 'Luxe Retail Holdings', companyName: 'Luxe Retail Group', sector: 'Retail', sharePrice: 65, totalSharesAvailable: 80000, volatility: 'Low', dividendYieldPercent: 4.5, description: 'High-end luxury fashion boutique operator.', historicalReturnPercent: 6.8 },
  { id: 'inv_4', title: 'BioVanguard Medical', companyName: 'BioVanguard Health', sector: 'Healthcare', sharePrice: 88, totalSharesAvailable: 60000, volatility: 'Medium', dividendYieldPercent: 2.8, description: 'Biotech & longevity clinical research.', historicalReturnPercent: 11.4 },
  { id: 'inv_5', title: 'Global Vision Media', companyName: 'Vision Broadcast Network', sector: 'Media', sharePrice: 35, totalSharesAvailable: 150000, volatility: 'Low', dividendYieldPercent: 5.2, description: 'International news and streaming broadcaster.', historicalReturnPercent: 5.1 },
  { id: 'inv_6', title: 'Sovereign Hotel & Resorts', companyName: 'Sovereign Luxury Group', sector: 'Hospitality', sharePrice: 110, totalSharesAvailable: 40000, volatility: 'Medium', dividendYieldPercent: 4.0, description: '5-Star luxury resort and hotel operator.', historicalReturnPercent: 9.3 },
  { id: 'inv_7', title: 'Manhattan Tower REIT', companyName: 'Manhattan Real Estate Trust', sector: 'Real Estate', sharePrice: 95, totalSharesAvailable: 70000, volatility: 'Low', dividendYieldPercent: 6.5, description: 'Commercial skyscrapers in NYC & LA.', historicalReturnPercent: 7.2 },
  { id: 'inv_8', title: 'Prime Athletic League', companyName: 'Prime Sports Franchise', sector: 'Sports', sharePrice: 210, totalSharesAvailable: 25000, volatility: 'High', dividendYieldPercent: 2.1, description: 'Global professional sports league owner.', historicalReturnPercent: 14.0 },
];

// Initial Acquisition Targets
export const INITIAL_ACQUISITION_CATALOG: AcquisitionTargetCompany[] = [
  {
    id: 'acq_1',
    companyName: 'Starlight Cinema Lot',
    industry: 'Film Studios',
    valuation: 15000000,
    askingPrice: 15000000,
    weeklyRevenue: 280000,
    weeklyExpenses: 190000,
    debtLevel: 1200000,
    growthPotential: 82,
    description: 'Iconic 12-soundstage Hollywood production lot in Burbank.',
    requirements: {
      minCash: 15000000,
      minBusinessRep: 50,
      minStudioRep: 60,
      minInvestorConfidence: 50,
      minOwnerRelation: 60,
      minIndustryRep: 55,
      minFinancialStability: 60,
    },
  },
  {
    id: 'acq_2',
    companyName: 'StreamPulse Media Network',
    industry: 'Media & Streaming',
    valuation: 28000000,
    askingPrice: 28000000,
    weeklyRevenue: 520000,
    weeklyExpenses: 340000,
    debtLevel: 2500000,
    growthPotential: 91,
    description: 'Direct-to-consumer video streaming app with 12M subscribers.',
    requirements: {
      minCash: 28000000,
      minBusinessRep: 60,
      minStudioRep: 50,
      minInvestorConfidence: 65,
      minOwnerRelation: 55,
      minIndustryRep: 60,
      minFinancialStability: 65,
    },
  },
  {
    id: 'acq_3',
    companyName: 'CyberCore AI Game Studio',
    industry: 'Technology',
    valuation: 12000000,
    askingPrice: 12000000,
    weeklyRevenue: 210000,
    weeklyExpenses: 130000,
    debtLevel: 800000,
    growthPotential: 88,
    description: 'AAA gaming developer specializing in photorealistic cinema engines.',
    requirements: {
      minCash: 12000000,
      minBusinessRep: 45,
      minStudioRep: 40,
      minInvestorConfidence: 55,
      minOwnerRelation: 50,
      minIndustryRep: 50,
      minFinancialStability: 50,
    },
  },
  {
    id: 'acq_4',
    companyName: 'Maison de Paris Couture',
    industry: 'Retail & Fashion',
    valuation: 18000000,
    askingPrice: 18000000,
    weeklyRevenue: 310000,
    weeklyExpenses: 210000,
    debtLevel: 1500000,
    growthPotential: 78,
    description: 'Centuries-old Parisian haute couture fashion and perfume house.',
    requirements: {
      minCash: 18000000,
      minBusinessRep: 55,
      minStudioRep: 45,
      minInvestorConfidence: 60,
      minOwnerRelation: 65,
      minIndustryRep: 60,
      minFinancialStability: 55,
    },
  },
  {
    id: 'acq_5',
    companyName: 'Bel-Air Grand Hotel & Golf Club',
    industry: 'Hospitality',
    valuation: 35000000,
    askingPrice: 35000000,
    weeklyRevenue: 650000,
    weeklyExpenses: 410000,
    debtLevel: 4000000,
    growthPotential: 85,
    description: 'Ultra-exclusive 5-star hotel and championship golf resort.',
    requirements: {
      minCash: 35000000,
      minBusinessRep: 70,
      minStudioRep: 65,
      minInvestorConfidence: 75,
      minOwnerRelation: 70,
      minIndustryRep: 70,
      minFinancialStability: 75,
    },
  },
  {
    id: 'acq_6',
    companyName: 'Apex Talent Agency',
    industry: 'Representation',
    valuation: 8000000,
    askingPrice: 8000000,
    weeklyRevenue: 150000,
    weeklyExpenses: 90000,
    debtLevel: 500000,
    growthPotential: 75,
    description: 'Premier Hollywood talent and literary representation agency.',
    requirements: {
      minCash: 8000000,
      minBusinessRep: 40,
      minStudioRep: 50,
      minInvestorConfidence: 45,
      minOwnerRelation: 55,
      minIndustryRep: 50,
      minFinancialStability: 45,
    },
  },
];

export const createInitialEmpireState = (player: Player): EmpireFullState => {
  return {
    lastProcessedWeek: player.dateWeek || 1,
    lastProcessedYear: player.dateYear || 2026,
    migrationVersion: 1,

    holdingCompany: {
      isFormed: false,
      name: `${player.lastName} Global Holdings`,
      logo: 'Building2',
      headquarters: 'Beverly Hills',
      industryFocus: 'Media & Entertainment',
      ceoName: `${player.firstName} ${player.lastName}`,
      executives: [],
      equitySharePercent: 100,
      dividendPayoutRate: 5,
      totalValuation: 0,
    },

    businesses: [],
    realEstate: [],
    rivalries: [],

    eliteClub: {
      isMember: false,
      yearlyDuesPaid: false,
      eliteNpcs: INITIAL_ELITE_NPCS,
      eventHistory: [],
    },

    actingAcademy: {
      isOpen: false,
      name: `${player.lastName} Conservatory of Dramatic Arts`,
      campusLevel: 1,
      teachersCount: 0,
      students: [],
      totalGraduates: 0,
      weeklyTuitionIncome: 0,
      weeklyOperationalCost: 0,
      scholarshipsAwarded: 0,
    },

    taxState: {
      incomeTax: 0,
      corporateTax: 0,
      propertyTax: 0,
      luxuryTax: 0,
      internationalTax: 0,
      capitalGainsTax: 0,
      accountantTier: 'None',
      totalTaxDue: 0,
      taxSaved: 0,
      auditRiskPercent: 5,
      auditHistory: [],
    },

    achievements: INITIAL_ACHIEVEMENTS,

    legacy: {
      hallOfFameRank: 'Upcoming Talent',
      hallOfFameScore: 0,
      museumName: `${player ? player.lastName : 'Mogul'} Legacy Estate`,
      greatestMovie: 'None Yet',
      peakNetWorth: player ? player.money : 100000,
      lifetimeEarnings: player ? player.money : 100000,
      lifetimeBoxOffice: 0,
      businessEmpireValuation: 0,
      realEstateValuation: 0,
      philanthropyDonatedTotal: 0,
      walkOfFameStar: false,
      autobiographyPublished: false,
      milestones: [
        {
          id: 'ms_start',
          title: 'Career Launch in Hollywood',
          category: 'Career',
          week: player ? player.dateWeek : 1,
          year: player ? player.dateYear : 2026,
          dateText: `Week ${player ? player.dateWeek : 1}, ${player ? player.dateYear : 2026}`,
          description: 'Began the journey in West Hollywood with big dreams.',
          statValue: `$${(player ? player.money : 100000).toLocaleString()}`,
        },
      ],
      awardsWonCount: 0,
      totalMoviesActed: 0,
      totalMoviesDirected: 0,
      totalBusinessesCreated: 0,
      totalGlobalHubsBuilt: 0,
      worldRecordsCount: 0,
    },

    corporateBoard: {
      chairmanName: `${player ? player.firstName : 'Mogul'} ${player ? player.lastName : 'Founder'}`,
      boardMembers: [],
      quarterlyApprovalRate: 100,
      recentResolutions: [],
    },

    boardSeats: [],
    globalRegions: INITIAL_GLOBAL_REGIONS,
    globalHubs: [],

    foundation: {
      isEstablished: false,
      name: `${player ? player.lastName : 'Mogul'} Global Philanthropic Foundation`,
      endowmentPool: 0,
      totalDonated: 0,
      goodwillScore: 0,
      taxDeductionsClaimed: 0,
      causes: [
        {
          id: 'cause_hospitals',
          name: "Children's Health & Medical Research",
          category: 'Hospitals',
          totalDonated: 0,
          impactRating: 0,
          publicGoodwillBonus: 0,
        },
      ],
    },

    security: {
      activePackages: INITIAL_SECURITY_PACKAGES,
      incidents: [],
      overallSecurityScore: 20,
    },

    investments: {
      portfolio: [],
      totalInvested: 0,
      totalCurrentValue: 0,
      weeklyDividendYield: 0,
    },

    reports: {
      reportsHistory: [],
    },

    acquisitionsCatalog: INITIAL_ACQUISITION_CATALOG,

    empireLogs: [],
  };
};

export class EmpireService {
  public static getState(player?: Player): EmpireFullState {
    return this.loadState(player);
  }

  public static loadState(player?: Player): EmpireFullState {
    try {
      // Build a clean default state based on the current player (or a dummy)
      const dummyPlayer = player || {
        id: 'p_1',
        firstName: 'Mogul',
        lastName: 'Founder',
        money: 100000,
        dateWeek: 1,
        dateYear: 2026,
      } as Player;
      const defaultState = createInitialEmpireState(dummyPlayer);

      const data = localStorage.getItem(EMPIRE_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);

        // Deep merge: overwrite only the keys that exist in parsed,
        // but keep default structure for any missing section.
        const merged: EmpireFullState = {
          ...defaultState,
          ...parsed,
          // Arrays and objects that need special handling to prevent missing sub-properties:
          holdingCompany: parsed.holdingCompany
            ? { ...defaultState.holdingCompany, ...parsed.holdingCompany }
            : defaultState.holdingCompany,
          businesses: Array.isArray(parsed.businesses) ? parsed.businesses : defaultState.businesses,
          realEstate: Array.isArray(parsed.realEstate) ? parsed.realEstate : defaultState.realEstate,
          rivalries: Array.isArray(parsed.rivalries) ? parsed.rivalries : defaultState.rivalries,
          eliteClub: parsed.eliteClub
            ? { ...defaultState.eliteClub, ...parsed.eliteClub }
            : defaultState.eliteClub,
          actingAcademy: parsed.actingAcademy
            ? { ...defaultState.actingAcademy, ...parsed.actingAcademy }
            : defaultState.actingAcademy,
          taxState: parsed.taxState
            ? { ...defaultState.taxState, ...parsed.taxState }
            : defaultState.taxState,
          legacy: parsed.legacy
            ? { ...defaultState.legacy, ...parsed.legacy }
            : defaultState.legacy,
          corporateBoard: parsed.corporateBoard
            ? { ...defaultState.corporateBoard, ...parsed.corporateBoard }
            : defaultState.corporateBoard,
          foundation: parsed.foundation
            ? { ...defaultState.foundation, ...parsed.foundation }
            : defaultState.foundation,
          boardSeats: Array.isArray(parsed.boardSeats) ? parsed.boardSeats : defaultState.boardSeats,
          globalHubs: Array.isArray(parsed.globalHubs) ? parsed.globalHubs : defaultState.globalHubs,
          globalRegions: Array.isArray(parsed.globalRegions) ? parsed.globalRegions : defaultState.globalRegions,
          security: parsed.security
            ? { ...defaultState.security, ...parsed.security }
            : defaultState.security,
          investments: parsed.investments
            ? { ...defaultState.investments, ...parsed.investments }
            : defaultState.investments,
          reports: parsed.reports
            ? { ...defaultState.reports, ...parsed.reports }
            : defaultState.reports,
          acquisitionsCatalog: Array.isArray(parsed.acquisitionsCatalog)
            ? parsed.acquisitionsCatalog
            : defaultState.acquisitionsCatalog,
          achievements: parsed.achievements?.length
            ? (() => {
                // Merge achievements: keep existing progress, fill missing from defaults
                const existingMap = new Map<string, EmpireAchievement>((parsed.achievements || []).map((a: EmpireAchievement) => [a.id, a]));
                return defaultState.achievements.map((initAch) => {
                  const existing = existingMap.get(initAch.id);
                  return existing ? { ...initAch, ...existing } : initAch;
                });
              })()
            : defaultState.achievements,
          empireLogs: Array.isArray(parsed.empireLogs) ? parsed.empireLogs : defaultState.empireLogs,
        };

        return merged;
      }
      // No saved data, return fresh state and save it
      EmpireService.saveState(defaultState);
      return defaultState;
    } catch (e) {
      console.warn('Failed to parse Empire state from storage, resetting to default.', e);
      const dummyPlayer = player || {
        id: 'p_1',
        firstName: 'Mogul',
        lastName: 'Founder',
        money: 100000,
        dateWeek: 1,
        dateYear: 2026,
      } as Player;
      const fresh = createInitialEmpireState(dummyPlayer);
      EmpireService.saveState(fresh);
      return fresh;
    }
  }

  public static saveState(state: EmpireFullState): void {
    try {
      localStorage.setItem(EMPIRE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save Empire state to storage', e);
    }
  }

  // CENTRAL END WEEK TICK ENGINE FOR EMPIRE SCENE
  // ---- REAL ESTATE ACTIONS (rent out, stop renting, upgrade/renovate) ----

  /** Lease a property to commercial tenants: occupancy starts realistic,
   *  rent is priced off live valuation by the weekly tick. */
  public static rentOutProperty(state: EmpireFullState, propertyId: string): { ok: boolean; message: string; state: EmpireFullState } {
    const prop = state.realEstate.find((r) => r.id === propertyId);
    if (!prop) return { ok: false, message: 'Property not found.', state };
    if (prop.isLeased) return { ok: false, message: `${prop.name} is already rented out.`, state };
    const next: EmpireFullState = {
      ...state,
      realEstate: state.realEstate.map((r) =>
        r.id === propertyId ? { ...r, isLeased: true, occupancyRate: 78 + Math.floor(Math.random() * 15), occupancyStatus: 'Rented' as const } : r
      ),
    };
    this.saveState(next);
    return { ok: true, message: `${prop.name} leased to commercial tenants — rent starts next weekly tick.`, state: next };
  }

  /** Move back in / leave vacant: rent stops immediately. */
  public static stopRentingProperty(state: EmpireFullState, propertyId: string): { ok: boolean; message: string; state: EmpireFullState } {
    const prop = state.realEstate.find((r) => r.id === propertyId);
    if (!prop) return { ok: false, message: 'Property not found.', state };
    const next: EmpireFullState = {
      ...state,
      realEstate: state.realEstate.map((r) =>
        r.id === propertyId ? { ...r, isLeased: false, weeklyRentalIncome: 0, occupancyRate: 0, occupancyStatus: 'Vacant' as const } : r
      ),
    };
    this.saveState(next);
    return { ok: true, message: `${prop.name} vacated — rental income stopped.`, state: next };
  }

  /** Renovate: cost 25% of CURRENT valuation, +30% valuation, tier +1 (max 5),
   *  stronger rental yield. Old saves cap at tier 5 too. */
  public static upgradeRealEstate(
    state: EmpireFullState,
    propertyId: string,
    playerMoney: number
  ): { ok: boolean; message: string; state: EmpireFullState; cost: number } {
    const prop = state.realEstate.find((r) => r.id === propertyId);
    if (!prop) return { ok: false, message: 'Property not found.', state, cost: 0 };
    if (prop.tierLevel >= 5) return { ok: false, message: `${prop.name} is already Tier 5 — fully renovated.`, state, cost: 0 };
    const cost = Math.floor(prop.currentValuation * 0.25);
    if (playerMoney < cost) return { ok: false, message: `Renovation needs $${cost.toLocaleString()} (you have $${playerMoney.toLocaleString()}).`, state, cost };
    const next: EmpireFullState = {
      ...state,
      realEstate: state.realEstate.map((r) =>
        r.id === propertyId
          ? {
              ...r,
              tierLevel: r.tierLevel + 1,
              upgradesDone: (r.upgradesDone || 0) + 1,
              currentValuation: Math.floor(r.currentValuation * 1.3),
              valuationHistory: [...(r.valuationHistory || []), Math.floor(r.currentValuation * 1.3)].slice(-26),
            }
          : r
      ),
    };
    this.saveState(next);
    return { ok: true, message: `${prop.name} renovated to Tier ${prop.tierLevel + 1} — valuation +30%.`, state: next, cost };
  }

  public static processEndWeek(player: Player, currentState?: EmpireFullState, opts?: { bestBoxOfficeGross?: number; lifetimeBoxOfficeGross?: number }): { updatedState: EmpireFullState; weeklyCashYield: number; logMessages: string[]; achievementsCash: number; achievementsXp: number } {
    const loadedState = currentState || EmpireService.loadState(player);
    let state: EmpireFullState = JSON.parse(JSON.stringify(loadedState));
    const logMessages: string[] = [];
    let netWeeklyCashYield = 0;

    const week = player.dateWeek;
    const year = player.dateYear;

    state.lastProcessedWeek = week;
    state.lastProcessedYear = year;

    // 1. BUSINESS VENTURES SIMULATION
    let totalBusinessRevenue = 0;
    let totalBusinessExpenses = 0;

    state.businesses = state.businesses.map((biz) => {
      if (biz.status === 'Bankrupt' || biz.status === 'Sold') return biz;

      // Calculate Product Revenues
      let productRevSum = 0;
      biz.products = biz.products.map((prod) => {
        // Sales fluctuation
        const marketDemandMultiplier = 0.85 + Math.random() * 0.35;
        const salesThisWeek = Math.floor(prod.weeklySales * marketDemandMultiplier);
        const rev = Math.floor(salesThisWeek * prod.price);
        productRevSum += rev;

        return {
          ...prod,
          weeklyRevenue: rev,
        };
      });

      // Calculate Staff Salaries
      let staffExpenses = 0;
      biz.staff.forEach((grp) => {
        staffExpenses += grp.count * grp.weeklyCostPerPerson;
      });

      // Executive Salaries
      let execExpenses = 0;
      biz.executives.forEach((exec) => {
        execExpenses += Math.floor(exec.salary / 52);
      });

      const totalWeeklyExpenses = staffExpenses + execExpenses + Math.floor(productRevSum * 0.15); // Operations/overhead
      const totalWeeklyRev = productRevSum;
      const profit = totalWeeklyRev - totalWeeklyExpenses;

      totalBusinessRevenue += totalWeeklyRev;
      totalBusinessExpenses += totalWeeklyExpenses;

      // Update business cash pool
      let newCashPool = biz.cashPool + profit;
      let newStatus: BusinessVenture['status'] = biz.status;

      if (newCashPool < 0) {
        if (biz.status === 'Active') {
          newStatus = 'Distressed';
          logMessages.push(`⚠️ Business Alert: ${biz.name} is distressed! Cash pool depleted to $${newCashPool.toLocaleString()}.`);
        } else if (biz.status === 'Distressed' && newCashPool < -100000) {
          newStatus = 'Bankrupt';
          logMessages.push(`🚨 BUSINESS BANKRUPT: ${biz.name} declared bankruptcy due to negative cash flow.`);
        }
      } else if (biz.status === 'Distressed' && newCashPool > 25000) {
        newStatus = 'Active';
        logMessages.push(`✅ ${biz.name} recovered to Active status!`);
      }

      // Valuation calculation
      const annualizedProfit = Math.max(10000, profit * 52);
      const computedValuation = Math.max(50000, Math.floor(annualizedProfit * 8 + newCashPool));

      // Competitor Action simulation
      if (Math.random() < 0.2 && biz.competitors.length > 0) {
        const compIdx = Math.floor(Math.random() * biz.competitors.length);
        const comp = biz.competitors[compIdx];
        const actions = [
          'launched aggressive marketing discount',
          'poached two senior engineers',
          'released rival product line',
          'expanded into European retail stores',
        ];
        const act = actions[Math.floor(Math.random() * actions.length)];
        comp.recentAction = act;
      }

      // LIVE TREND from real revenue history (last 4 weeks vs prior 4)
      const revHist = [...(biz.revenueHistory || []), totalWeeklyRev].slice(-26);
      let liveTrend: BusinessVenture['performanceTrend'] = biz.performanceTrend || 'Stable';
      if (revHist.length >= 8) {
        const recent = revHist.slice(-4).reduce((a: number, b: number) => a + b, 0);
        const prior = revHist.slice(-8, -4).reduce((a: number, b: number) => a + b, 0);
        const pct = prior > 0 ? (recent - prior) / prior : 0;
        if (newStatus === 'Distressed') liveTrend = 'Recovering';
        else if (biz.marketShare >= 20) liveTrend = 'Industry Leader';
        else if (pct > 0.12) liveTrend = 'Growing';
        else if (pct < -0.12) liveTrend = 'Losing Market Share';
        else liveTrend = 'Stable';
      }

      return {
        ...biz,
        cashPool: newCashPool,
        weeklyRevenue: totalWeeklyRev,
        revenueHistory: revHist,
        performanceTrend: liveTrend,
        weeklyExpenses: totalWeeklyExpenses,
        netProfit: profit,
        totalValuation: computedValuation,
        status: newStatus,
      };
    });

    // 2. COMMERCIAL REAL ESTATE \u2014 LIVING MARKET (phase shifts every 3-4
    //    weeks; prices rise AND fall like the real market)
    let totalRentalIncome = 0;
    let totalPropertyMaintenance = 0;

    if (!state.realEstateMarket) state.realEstateMarket = { phase: 'Stable', weeksUntilShift: 4 };
    const reMarket = state.realEstateMarket;
    reMarket.weeksUntilShift -= 1;
    if (reMarket.weeksUntilShift <= 0) {
      const phases: RealEstatePhase[] = ['Hot', 'Stable', 'Cooling', 'Slump'];
      reMarket.phase = phases[Math.floor(Math.random() * phases.length)];
      reMarket.weeksUntilShift = 3 + Math.floor(Math.random() * 2); // 3-4 weeks
      const phaseNews: Record<RealEstatePhase, string> = {
        Hot: '\u{1F525} PROPERTY MARKET: rate cuts + tech relocations \u2014 commercial real estate is HOT. Values climbing fast.',
        Stable: '\u{1F3E0} PROPERTY MARKET: steady hands \u2014 valuations holding a stable drift.',
        Cooling: '\u{1F327}\uFE0F PROPERTY MARKET: higher financing costs \u2014 commercial values are COOLING.',
        Slump: '\u{1F4C9} PROPERTY MARKET: credit squeeze \u2014 a Slump is on. Values sliding week over week.',
      };
      logMessages.push(phaseNews[reMarket.phase]);
    }
    const driftByPhase: Record<RealEstatePhase, [number, number]> = {
      Hot: [0.008, 0.016],
      Stable: [0.0005, 0.003],
      Cooling: [-0.005, -0.002],
      Slump: [-0.012, -0.006],
    };
    const [driftLo, driftHi] = driftByPhase[reMarket.phase];
    const yieldByType: Record<RealEstateType, number> = {
      Hotel: 0.0016, 'Office Tower': 0.0014, 'Shopping Mall': 0.0013, 'Film Lot': 0.0019,
      'Apartment Complex': 0.0012, Resort: 0.0015, 'Industrial Building': 0.0010, Warehouse: 0.0009,
    };

    state.realEstate = state.realEstate.map((prop) => {
      // Valuation drifts with the market phase + small property noise
      const drift = driftLo + Math.random() * (driftHi - driftLo);
      const noise = (Math.random() - 0.5) * 0.002;
      const updatedValuation = Math.max(100000, Math.floor(prop.currentValuation * (1 + drift + noise)));

      // Occupancy breathes weekly for leased properties (real vacancy risk)
      let occupancy = prop.occupancyRate;
      if (prop.isLeased) {
        occupancy = Math.min(100, Math.max(55, Math.round(occupancy + (Math.random() - 0.45) * 6)));
      } else {
        occupancy = 0;
      }

      // Rent is earned ONLY when leased out, priced off live valuation
      const weeklyRent = prop.isLeased
        ? Math.max(1, Math.floor(updatedValuation * (yieldByType[prop.type] || 0.0012) * (occupancy / 100) * (1 + (prop.tierLevel - 1) * 0.1)))
        : 0;
      totalRentalIncome += weeklyRent;
      totalPropertyMaintenance += prop.weeklyMaintenanceCost;

      const history = [...(prop.valuationHistory || [prop.purchasePrice]), updatedValuation].slice(-26);

      return {
        ...prop,
        currentValuation: updatedValuation,
        weeklyRentalIncome: weeklyRent,
        occupancyRate: occupancy,
        occupancyStatus: prop.isLeased ? 'Rented' : 'Vacant',
        valuationHistory: history,
      };
    });

    const netRealEstateYield = totalRentalIncome - totalPropertyMaintenance;
    netWeeklyCashYield += netRealEstateYield;

    // 2b. GLOBAL OFFICES \u2014 regional demand drifts weekly; revenue follows it
    let hubsRevenue = 0;
    let hubsExpense = 0;
    for (const hub of state.globalHubs) {
      hub.regionDemandPct = Math.min(150, Math.max(60, Math.round((hub.regionDemandPct || 100) + (Math.random() - 0.48) * 8)));
      const demandMult = (hub.regionDemandPct || 100) / 100;
      hub.weeklyRegionalRevenue = Math.max(1, Math.floor(hub.weeklyOperatingExpense * 2.5 * demandMult * (0.9 + Math.random() * 0.2)));
      hub.revenueHistory = [...(hub.revenueHistory || []), hub.weeklyRegionalRevenue - hub.weeklyOperatingExpense].slice(-26);
      hubsRevenue += hub.weeklyRegionalRevenue;
      hubsExpense += hub.weeklyOperatingExpense;
    }
    if (hubsRevenue - hubsExpense !== 0) {
      netWeeklyCashYield += hubsRevenue - hubsExpense;
    }
    // Regional markets breathe: demand labels shift, competitors move
    if ((state.globalRegions || []).length > 0 && Math.random() < 0.35) {
      const region = state.globalRegions[Math.floor(Math.random() * state.globalRegions.length)];
      const demands: GlobalRegion['marketDemand'][] = ['Emerging', 'Moderate', 'High', 'Explosive'];
      const next = demands[Math.floor(Math.random() * demands.length)];
      if (next !== region.marketDemand) {
        region.marketDemand = next;
        region.localCompetitorsCount = Math.max(1, region.localCompetitorsCount + (Math.random() < 0.5 ? -1 : 1));
        logMessages.push(`\u{1F30F} GLOBAL DESK: ${region.name} market demand shifts to ${next} (competitors: ${region.localCompetitorsCount}).`);
      }
      region.regionalRevenue = state.globalHubs
        .filter((h) => h.country.toLowerCase().includes(region.name.split(' ')[0].toLowerCase()))
        .reduce((a, h) => a + h.weeklyRegionalRevenue, region.regionalRevenue);
    }

    // 2c. FOUNDATION \u2014 the endowment compounds weekly (0.15%), goodwill pays
    //     a real reputation dividend to the player when earned
    let foundationNet = 0;
    if (state.foundation.isEstablished && state.foundation.endowmentPool > 0) {
      const growth = Math.floor(state.foundation.endowmentPool * 0.0015);
      state.foundation.endowmentPool += growth;
      foundationNet = growth;
      state.foundation.endowmentHistory = [
        ...(state.foundation.endowmentHistory || []),
        state.foundation.endowmentPool,
      ].slice(-26);
      // Strong goodwill genuinely lifts public reputation (real, capped)
      if (state.foundation.goodwillScore >= 70 && week % 4 === 0) {
        player.publicReputation = Math.min(100, (player.publicReputation ?? 50) + 1);
        logMessages.push(`\u2764\uFE0F FOUNDATION: goodwill work lifts your public reputation (+1).`);
      }
    }

    // 2d. WEEKLY REPORT SNAPSHOT \u2014 a real consolidated income statement from
    //     this week's actual processing (businesses, properties, hubs, academy)
    {
      const bizRev = state.businesses.filter((b) => b.status === 'Active' || b.status === 'Distressed').reduce((a, b) => a + b.weeklyRevenue, 0);
      const bizExp = state.businesses.filter((b) => b.status === 'Active' || b.status === 'Distressed').reduce((a, b) => a + b.weeklyExpenses, 0);
      const reRev = state.realEstate.reduce((a, r) => a + r.weeklyRentalIncome, 0);
      const reExp = state.realEstate.reduce((a, r) => a + r.weeklyMaintenanceCost, 0);
      const academyNet = state.actingAcademy.isOpen
        ? state.actingAcademy.weeklyTuitionIncome - state.actingAcademy.weeklyOperationalCost
        : 0;
      const totalRev = bizRev + reRev + hubsRevenue + Math.max(0, academyNet);
      const totalExp = bizExp + reExp + hubsExpense + Math.max(0, -academyNet);
      const topBiz = [...state.businesses].sort((a, b) => b.netProfit - a.netProfit)[0]?.name || 'None';
      state.reports.reportsHistory = [
        {
          id: `rep_w_${year}_${week}`,
          period: 'Weekly' as const,
          week,
          year,
          totalRevenue: totalRev,
          totalExpenses: totalExp,
          netProfit: totalRev - totalExp,
          activeBusinessesCount: state.businesses.filter((b) => b.status === 'Active').length,
          topPerformingBusiness: topBiz,
          executiveSummary: `Week ${week}, ${year} consolidated statement from live operations.`,
          growthRatePercent: 0,
          segments: { business: bizRev - bizExp, realEstate: reRev - reExp, hubs: hubsRevenue - hubsExpense, academy: academyNet, dividends: 0 },
        },
        ...(state.reports.reportsHistory || []),
      ].slice(-78); // 78 weekly snapshots \u2248 18 months of books
      void foundationNet;
    }

    // 3. ACTING ACADEMY SIMULATION
    if (state.actingAcademy.isOpen) {
      const studentCount = state.actingAcademy.students.length;
      const tuitionPerStudent = 1200 + state.actingAcademy.campusLevel * 400;
      const weeklyTuition = studentCount * tuitionPerStudent;
      const opCost = 3000 + state.actingAcademy.teachersCount * 1800 + state.actingAcademy.campusLevel * 2500;
      const academyNet = weeklyTuition - opCost;

      state.actingAcademy.weeklyTuitionIncome = weeklyTuition;
      state.actingAcademy.weeklyOperationalCost = opCost;
      netWeeklyCashYield += academyNet;

      // Student progression
      state.actingAcademy.students = state.actingAcademy.students.map((std) => {
        const skillGain = Math.floor(1 + Math.random() * 3 + state.actingAcademy.teachersCount * 0.5);
        const newRating = Math.min(100, std.skillRating + skillGain);
        let newStatus = std.status;

        if (newRating >= 80 && std.status === 'Enrolled') {
          newStatus = 'Graduated';
          state.actingAcademy.totalGraduates += 1;
          logMessages.push(`🎓 Acting Academy: Student ${std.name} graduated with high honors (${newRating}/100 skill)!`);
        } else if (newRating >= 95 && std.status === 'Graduated') {
          newStatus = 'Star Actor';
          logMessages.push(`🌟 Hollywood Breakout: Academy graduate ${std.name} landed a lead role in a feature film!`);
        }

        return {
          ...std,
          skillRating: newRating,
          status: newStatus,
        };
      });
    }

    // 3.5 INVESTMENTS — REAL WEEKLY DIVIDENDS (annual yield / 52 on current value)
    if (state.investments && (state.investments.portfolio || []).length > 0) {
      const oppMap = new Map(INITIAL_INVESTMENT_OPPORTUNITIES.map((o) => [o.id, o]));
      let weeklyDiv = 0;
      state.investments.portfolio = state.investments.portfolio.map((item) => {
        const opp = oppMap.get(item.opportunityId);
        const rate = opp?.dividendYieldPercent || 0;
        const weekly = Math.floor((item.currentValue || 0) * (rate / 100) / 52);
        if (weekly > 0) {
          item.totalDividendsEarned = (item.totalDividendsEarned || 0) + weekly;
          weeklyDiv += weekly;
        }
        return item;
      });
      state.investments.weeklyDividendYield = weeklyDiv;
      if (weeklyDiv > 0) {
        netWeeklyCashYield += weeklyDiv;
        logMessages.push(`📈 Investment dividends paid: +$${weeklyDiv.toLocaleString()} this week.`);
      }
    }

    // 4. TAXES: real engine (taxEngine.ts) runs weekly in GameContext — real
    // withholding, real deductions, year-end filing. No fake numbers here.
    // (taxState.accountantTier is set by the Tax view and read by the engine.)

    // 5. HOLDING COMPANY VALUATION UPDATE (+ weekly history snapshot)
    if (state.holdingCompany.isFormed) {
      const bizValSum = state.businesses.reduce((acc, b) => acc + (b.status !== 'Bankrupt' ? b.totalValuation : 0), 0);
      const reValSum = state.realEstate.reduce((acc, r) => acc + r.currentValuation, 0);
      state.holdingCompany.totalValuation = Math.floor(bizValSum + reValSum);
      state.holdingCompany.valuationHistory = [
        ...(state.holdingCompany.valuationHistory || []),
        state.holdingCompany.totalValuation,
      ].slice(-26);
    }

    // 5b. INVESTMENTS RETIRED \u2014 the module duplicated Star Stocks / Wall Street
    //     West. Existing portfolios liquidate once at 95% (exit fee) into real
    //     cash via the weekly yield; the Empire tile is gone for good.
    if (state.investments && (state.investments.portfolio || []).length > 0) {
      const liquidation = state.investments.portfolio.reduce(
        (acc, item) => acc + Math.floor((item.currentValue || 0) * 0.95),
        0
      );
      state.investments.portfolio = [];
      state.investments.weeklyDividendYield = 0;
      if (liquidation > 0) {
        netWeeklyCashYield += liquidation;
        logMessages.push('\u{1F4E2} INVESTMENTS & EQUITY CLOSED: Wall Street West now runs all public markets. Your portfolio liquidated at 95% \u2014 $' + liquidation.toLocaleString() + ' credited this week.');
      }
    }

    // 6. ACHIEVEMENTS CHECKER (70 ACHIEVEMENTS) — REAL STATS ONLY (fixed sources)
    const fameXP = (player as any).fameXp || 0;
    const rolesCount = (player as any).moviesCompleted || 0;
    const leadRoles = (player as any).leadRolesCount || 0;
    const principalRoles = (player as any).principalRolesCount || 0;
    const lifetimeBoxOffice = state.legacy.lifetimeBoxOffice || 0;
    const totalAwards = (player as any).awardsWon || 0;
    const activeBizCount = (state.businesses || []).filter((b) => b?.status === 'Active').length;
    const totalDonated = (state.foundation.endowmentPool || 0) + (state.foundation.totalDonated || 0);
    const socialFollowers = (player as any).fans || 0;
    const liquidCash = player.money || 0;
    const totalValuation = state.holdingCompany.isFormed ? state.holdingCompany.totalValuation : 0;
    const netWorth = totalValuation + liquidCash;
    let achievementsCash = 0;
    let achievementsXp = 0;

    // ONE-TIME BACKPAY: achievements unlocked before the payout engine existed
    // were displayed with rewards that never reached the player. Pay them all
    // once (real money + XP), then flag the migration so it never repeats.
    if ((state as any).achievementPayoutVersion !== 1) {
      (state.achievements || []).forEach((ach) => {
        if (ach?.isUnlocked) {
          achievementsCash += ach.rewardCash || 0;
          achievementsXp += ach.rewardFameXp || 0;
        }
      });
      (state as any).achievementPayoutVersion = 1;
      if (achievementsCash > 0) {
        logMessages.push(`🏆 ACHIEVEMENT BACKPAY: ${(state.achievements || []).filter((a) => a?.isUnlocked).length} unlocked achievement rewards paid out (+$${Math.floor(achievementsCash * 0.5).toLocaleString()} / +${Math.max(1, Math.floor(achievementsXp * FAME_XP_MULTIPLIER))} XP).`);
      }
    }

    state.achievements = (state.achievements || []).map((ach) => {
      if (ach.isUnlocked) return ach;

      let currentProg = ach.progress;
      let shouldUnlock = false;

      switch (ach.id) {
        // Career
        case 'ach_c_1': if (rolesCount >= 1 || fameXP >= 1) shouldUnlock = true; break;
        case 'ach_c_2': if (rolesCount >= 1) shouldUnlock = true; break;
        case 'ach_c_3': if (rolesCount >= 1) shouldUnlock = true; break;
        case 'ach_c_4': currentProg = Math.min(1000, fameXP); if (fameXP >= 1000) shouldUnlock = true; break;
        case 'ach_c_5': currentProg = Math.min(10000, fameXP); if (fameXP >= 10000) shouldUnlock = true; break;
        case 'ach_c_6': currentProg = Math.min(50000, fameXP); if (fameXP >= 50000) shouldUnlock = true; break;
        case 'ach_c_7': currentProg = Math.min(10, rolesCount); if (rolesCount >= 10) shouldUnlock = true; break;
        case 'ach_c_8': currentProg = Math.min(25, rolesCount); if (rolesCount >= 25) shouldUnlock = true; break;
        case 'ach_c_9': currentProg = Math.min(50, rolesCount); if (rolesCount >= 50) shouldUnlock = true; break;
        case 'ach_c_10': if (lifetimeBoxOffice >= 100000000) shouldUnlock = true; break;
        case 'ach_c_11': currentProg = Math.min(1000000000, lifetimeBoxOffice); if (lifetimeBoxOffice >= 1000000000) shouldUnlock = true; break;
        case 'ach_c_12': if (state.legacy.totalMoviesDirected >= 1) shouldUnlock = true; break;
        case 'ach_c_13': if (rolesCount >= 3) shouldUnlock = true; break;
        case 'ach_c_14': if (state.actingAcademy.isOpen) shouldUnlock = true; break;
        case 'ach_c_15': if (rolesCount >= 1 && fameXP >= 1200) shouldUnlock = true; break;

        // Business
        case 'ach_b_1': if ((state.businesses || []).length >= 1) shouldUnlock = true; break;
        case 'ach_b_2': currentProg = Math.min(3, activeBizCount); if (activeBizCount >= 3) shouldUnlock = true; break;
        case 'ach_b_3': currentProg = Math.min(5, activeBizCount); if (activeBizCount >= 5) shouldUnlock = true; break;
        case 'ach_b_4': if (state.holdingCompany.isFormed) shouldUnlock = true; break;
        case 'ach_b_5': if ((state.businesses || []).some((b) => b?.isPublic)) shouldUnlock = true; break;
        case 'ach_b_6': if ((state.businesses || []).some((b) => b?.totalValuation >= 10000000)) shouldUnlock = true; break;
        case 'ach_b_7': if ((state.businesses || []).some((b) => b?.totalValuation >= 100000000)) shouldUnlock = true; break;
        case 'ach_b_8': if (totalValuation >= 1000000000) shouldUnlock = true; break;
        case 'ach_b_9': if (totalBusinessRevenue >= 100000) shouldUnlock = true; break;
        case 'ach_b_10': if ((state.boardSeats || []).length >= 1) shouldUnlock = true; break;

        // Awards
        case 'ach_a_1': if (totalAwards >= 1 || fameXP >= 800) shouldUnlock = true; break;
        case 'ach_a_2': if (totalAwards >= 1) shouldUnlock = true; break;
        case 'ach_a_3': currentProg = Math.min(3, totalAwards); if (totalAwards >= 3) shouldUnlock = true; break;
        case 'ach_a_4': currentProg = Math.min(10, totalAwards); if (totalAwards >= 10) shouldUnlock = true; break;
        case 'ach_a_5': if (totalAwards >= 1) shouldUnlock = true; break;
        case 'ach_a_6': if (state.legacy.totalMoviesDirected >= 1 && totalAwards >= 1) shouldUnlock = true; break;
        case 'ach_a_7': if (totalAwards >= 2) shouldUnlock = true; break;
        case 'ach_a_8': if (totalAwards >= 3) shouldUnlock = true; break;
        case 'ach_a_9': if (fameXP >= 25000 || totalAwards >= 5) shouldUnlock = true; break;
        case 'ach_a_10': currentProg = Math.min(20, totalAwards); if (totalAwards >= 20) shouldUnlock = true; break;

        // Empire
        case 'ach_e_1': if ((state.realEstate || []).length >= 1) shouldUnlock = true; break;
        case 'ach_e_2': if ((state.realEstate || []).some((r) => r?.type === 'Film Lot')) shouldUnlock = true; break;
        case 'ach_e_3': currentProg = Math.min(5, (state.realEstate || []).length); if ((state.realEstate || []).length >= 5) shouldUnlock = true; break;
        case 'ach_e_4': if (state.eliteClub.isMember) shouldUnlock = true; break;
        case 'ach_e_5': if (state.foundation.isEstablished) shouldUnlock = true; break;
        case 'ach_e_6': currentProg = Math.min(1000000, totalDonated); if (totalDonated >= 1000000) shouldUnlock = true; break;
        case 'ach_e_7': if ((state.globalHubs || []).length >= 1 || (state.globalRegions || []).some((r) => r?.id !== 'north_america' && r?.officesBuilt > 0)) shouldUnlock = true; break; // FIXED: Exclude home office
        case 'ach_e_8': if ((state.globalHubs || []).length >= 3 || (state.globalRegions || []).filter((r) => r?.id !== 'north_america' && r?.officesBuilt > 0).length >= 3) shouldUnlock = true; break; // FIXED: Exclude home
        case 'ach_e_9': if (state.actingAcademy.isOpen) shouldUnlock = true; break;
        case 'ach_e_10': if (state.legacy.walkOfFameStar) shouldUnlock = true; break;

        // Social Media
        case 'ach_s_1': currentProg = Math.min(100000, socialFollowers); if (socialFollowers >= 100000) shouldUnlock = true; break;
        case 'ach_s_2': currentProg = Math.min(1000000, socialFollowers); if (socialFollowers >= 1000000) shouldUnlock = true; break;
        case 'ach_s_3': currentProg = Math.min(10000000, socialFollowers); if (socialFollowers >= 10000000) shouldUnlock = true; break;
        case 'ach_s_4': currentProg = Math.min(100000000, socialFollowers); if (socialFollowers >= 100000000) shouldUnlock = true; break;
        case 'ach_s_5': currentProg = Math.min(1000000000, socialFollowers); if (socialFollowers >= 1000000000) shouldUnlock = true; break;
        case 'ach_s_6': if (socialFollowers >= 500000 || fameXP >= 5000) shouldUnlock = true; break;
        case 'ach_s_7': if (socialFollowers >= 1000000) shouldUnlock = true; break;
        case 'ach_s_8': if (fameXP >= 2000) shouldUnlock = true; break;
        case 'ach_s_9': if ((state.rivalries || []).some((r) => (r?.timeline || []).some((t) => t?.category === 'Social Media' || t?.category === 'Peace'))) shouldUnlock = true; break;
        case 'ach_s_11': if (fameXP >= 500) shouldUnlock = true; break;
        case 'ach_s_10': if (socialFollowers >= 500000) shouldUnlock = true; break;

        // Money
        case 'ach_m_1': currentProg = Math.min(100000, liquidCash); if (liquidCash >= 100000) shouldUnlock = true; break;
        case 'ach_m_2': currentProg = Math.min(1000000, liquidCash); if (liquidCash >= 1000000) shouldUnlock = true; break;
        case 'ach_m_3': currentProg = Math.min(10000000, liquidCash); if (liquidCash >= 10000000) shouldUnlock = true; break;
        case 'ach_m_4': currentProg = Math.min(100000000, liquidCash); if (liquidCash >= 100000000) shouldUnlock = true; break;
        case 'ach_m_5': currentProg = Math.min(1000000000, netWorth); if (netWorth >= 1000000000) shouldUnlock = true; break;
        case 'ach_m_6': if (netWorth >= 50000000) shouldUnlock = true; break;
        case 'ach_m_7': if (netWorth >= 500000000) shouldUnlock = true; break;
        case 'ach_m_8': if (liquidCash >= 10000000) shouldUnlock = true; break;
        case 'ach_m_9': if (state.taxState.taxSaved >= 250000) shouldUnlock = true; break;
        case 'ach_m_10': if (totalBusinessRevenue + totalRentalIncome >= 500000) shouldUnlock = true; break;

        // Secret
        case 'ach_h_1': if ((state.rivalries || []).some((r) => r?.relationshipLevel === 'Arch Rival' || r?.relationshipLevel === 'Legendary Rival')) shouldUnlock = true; break;
        case 'ach_h_2': if (state.legacy.autobiographyPublished) shouldUnlock = true; break;
        case 'ach_h_3': if ((state.rivalries || []).some((r) => (r?.timeline || []).some((t) => t?.category === 'Peace'))) shouldUnlock = true; break;
        case 'ach_h_4': if (state.taxState.accountantTier === 'Elite Offshore Tax Attorneys') shouldUnlock = true; break;
        case 'ach_h_5': if (state.legacy.hallOfFameScore >= 50000) shouldUnlock = true; break;
        case 'ach_p_1': if (principalRoles >= 1) shouldUnlock = true; break;
        case 'ach_p_2': currentProg = Math.min(4, principalRoles); if (principalRoles >= 4) shouldUnlock = true; break;
        case 'ach_l_1': if (leadRoles >= 1) shouldUnlock = true; break;
        case 'ach_l_2': currentProg = Math.min(8, leadRoles); if (leadRoles >= 8) shouldUnlock = true; break;
      }

      if (shouldUnlock) {
        logMessages.push(`🏆 ACHIEVEMENT UNLOCKED: "${ach.title}"! (+ $${Math.floor(ach.rewardCash * 0.5).toLocaleString()} / +${Math.max(1, Math.floor(ach.rewardFameXp * FAME_XP_MULTIPLIER))} XP)`);
        // REAL PAYOUT: cash + XP returned via achievementsCash/achievementsXp and
        // paid out by GameContext at the end of the week (single source of truth —
        // direct mutation here would be overwritten by the weekly reconciliation)
        achievementsCash += ach.rewardCash;
        achievementsXp += ach.rewardFameXp;
        return {
          ...ach,
          isUnlocked: true,
          unlockedWeek: week,
          unlockedYear: year,
          progress: ach.maxProgress,
        };
      }

      return {
        ...ach,
        progress: currentProg,
      };
    });

    // 7. LEGACY SCORE & MILESTONE UPDATE
    const totalEmpireValue = (state.holdingCompany.isFormed ? state.holdingCompany.totalValuation : 0) + player.money;
    // REAL CAREER SYNC — legacy stats mirror the player's actual career file
    // every week (movies, awards, lifetime gross, lifetime earnings)
    state.legacy.totalMoviesActed = Math.max(state.legacy.totalMoviesActed || 0, player.moviesCompleted || 0);
    state.legacy.awardsWonCount = Math.max(state.legacy.awardsWonCount || 0, player.awardsWon || 0);
    if (opts?.lifetimeBoxOfficeGross) {
      state.legacy.lifetimeBoxOffice = Math.max(state.legacy.lifetimeBoxOffice || 0, opts.lifetimeBoxOfficeGross);
    }
    state.legacy.lifetimeEarnings = Math.max(state.legacy.lifetimeEarnings || 0, (player.netWorth || 0) + (player.money || 0));
    state.legacy.businessEmpireValuation = state.businesses
      .filter((b) => b.status !== 'Bankrupt' && b.status !== 'Sold')
      .reduce((a, b) => a + b.totalValuation, 0);
    state.legacy.realEstateValuation = state.realEstate.reduce((a, r) => a + r.currentValuation, 0);
    state.legacy.totalGlobalHubsBuilt = state.globalHubs.length;
    state.legacy.philanthropyDonatedTotal = (state.foundation.totalDonated || 0) + (state.foundation.endowmentPool || 0);

    if (totalEmpireValue > state.legacy.peakNetWorth) {
      state.legacy.peakNetWorth = totalEmpireValue;
    }

    const calculatedLegacyScore = Math.floor(
      (state.legacy.lifetimeBoxOffice / 100000) +
      (totalEmpireValue / 1000000) +
      (state.legacy.awardsWonCount * 500) +
      (totalDonated / 50000) +
      (state.legacy.walkOfFameStar ? 5000 : 0) +
      (state.legacy.autobiographyPublished ? 2500 : 0) +
      (state.globalHubs.length * 1000)
    );
    state.legacy.hallOfFameScore = Math.max(state.legacy.hallOfFameScore || 0, calculatedLegacyScore);

    if (calculatedLegacyScore > 50000) {
      state.legacy.hallOfFameRank = 'All-Time Immortal Legend';
    } else if (totalEmpireValue > 1000000000) {
      state.legacy.hallOfFameRank = 'Billionaire Titan';
    } else if (totalEmpireValue > 100000000) {
      state.legacy.hallOfFameRank = 'Hollywood Mogul';
    } else if (totalEmpireValue > 10000000) {
      state.legacy.hallOfFameRank = 'A-List Power Player';
    } else if (totalEmpireValue > 1000000) {
      state.legacy.hallOfFameRank = 'Rising Multi-Millionaire';
    }

    // 8. RIVALRY WAR ROOM WEEKLY TICK (strikes, decay, resolutions, natural spawn)
    // All outcomes resolve against the player's real career stats; effects are
    // applied straight to the live player object the same tick.
    try {
      const rivalTick = processRivalriesWeek(state, player, opts?.bestBoxOfficeGross || 0, week, year);
      for (const m of rivalTick.logMessages) logMessages.push(m);
      if (rivalTick.fansDelta !== 0) player.fans = Math.max(0, (player.fans || 0) + rivalTick.fansDelta);
      if (rivalTick.fameXpDelta !== 0) player.fameXp = Math.max(0, (player.fameXp || 0) + rivalTick.fameXpDelta);
      if (rivalTick.repDelta !== 0) player.publicReputation = Math.min(100, Math.max(0, (player.publicReputation ?? 50) + rivalTick.repDelta));
    } catch (e) {
      console.warn('Rivalry weekly tick error:', e);
    }

    EmpireService.saveState(state);

    return {
      updatedState: state,
      weeklyCashYield: netWeeklyCashYield,
      logMessages,
      achievementsCash,
      achievementsXp,
    };
  }
}
