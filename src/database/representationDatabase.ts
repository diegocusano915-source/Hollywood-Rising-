/**
 * HOLLYWOOD RISING - Agents & Managers Marketplace Database
 * 28 Talent Agents + 28 Personal Managers across 4 tiers with ratings.
 * All names, agencies and firms are original fictional creations for Hollywood Rising.
 * Nothing is imported from real agencies or other games.
 */

import { AgentInfo, ManagerInfo } from '../types/game';

const AVATAR_BASE = 'https://images.unsplash.com/';
const AV = (id: string) => `${AVATAR_BASE}${id}?w=150&auto=format&fit=crop`;

const PORTRAITS = [
  'photo-1500648767791-00dcc994a43e',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1494790108377-be9c29b29330',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1534528741775-53994a69daeb',
  'photo-1531123897727-8f129e1688ce',
  'photo-1544005313-94ddf0286df2',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1573496359142-b8d87734a5a2',
  'photo-1580489944761-15a19d654956',
  'photo-1560250097-0b93528c311a',
  'photo-1573497019940-1c28c88b4f3e',
  'photo-1506794778202-cad84cf45f1d',
  'photo-1589156280159-27698a70f29e',
  'photo-1519345182560-3f2917c472ef',
  'photo-1535713875002-d1d0cf377fde',
  'photo-1524504388940-b1c1722653e1',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1547425260-76bcadfb4f2c',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1438761681033-6461ffad8d80',
  'photo-1521119989659-a83eee488004',
  'photo-1519699047748-de8e457a634e',
  'photo-1500648767791-00dcc994a43e',
  'photo-1492562080023-ab3db95bfbce',
  'photo-1463453091185-61582044d556',
  'photo-1508214751196-bcfd4ca60f91',
  'photo-1544725176-7c40e5a71c5e',
];

interface AgentSeed {
  n: string;
  agency: string;
  spec: string;
  tier: 1 | 2 | 3 | 4;
  rating: number;
  cut: number;
  lead: number;
  contract: number;
  penalty: number;
  cap: number;
  fan: number;
  neg: number;
  res: number;
  royalty: string;
  perks: string;
}

const AGENT_SEEDS: AgentSeed[] = [
  // TIER 1 - BOUTIQUE (rating 30-55)
  { n: 'Nora Blake', agency: 'Lakeshore Talent', spec: 'Film Agent', tier: 1, rating: 42, cut: 9, lead: 8, contract: 52, penalty: 18000, cap: 12, fan: 10, neg: 5, res: 0.8, royalty: '2-4%', perks: 'Submit for indie features & festival circuit.' },
  { n: 'Elias Moreno', agency: 'Sunset Avenue Artists', spec: 'TV Agent', tier: 1, rating: 38, cut: 10, lead: 8, contract: 52, penalty: 15000, cap: 10, fan: 9, neg: 4, res: 0.7, royalty: '2-3%', perks: 'Pitches pilots & guest-star arcs.' },
  { n: 'Priya Raman', agency: 'Harbor & Vine', spec: 'Voice & MoCap Agent', tier: 1, rating: 45, cut: 8, lead: 7, contract: 52, penalty: 20000, cap: 15, fan: 11, neg: 5, res: 0.9, royalty: '3-5%', perks: 'Animation & motion-capture roles.' },
  { n: 'Derek Cole', agency: 'Bluebird Represents', spec: 'Film Agent', tier: 1, rating: 51, cut: 10, lead: 6, contract: 78, penalty: 26000, cap: 15, fan: 12, neg: 6, res: 1, royalty: '3-4%', perks: 'Strong relationship with indie studios.' },
  { n: 'Amara Okafor', agency: 'Kingsley Partners', spec: 'Commercial & Web Agent', tier: 1, rating: 33, cut: 9, lead: 8, contract: 52, penalty: 12000, cap: 8, fan: 8, neg: 4, res: 0.6, royalty: '2-3%', perks: 'Commercials & branded content.' },
  { n: 'Felix Grant', agency: 'Marigold Management', spec: 'TV Agent', tier: 1, rating: 47, cut: 10, lead: 6, contract: 78, penalty: 22000, cap: 12, fan: 10, neg: 5, res: 0.8, royalty: '2-4%', perks: 'Daytime & streaming series roles.' },
  { n: 'Sienna Brooks', agency: 'Crestline Talent', spec: 'Film Agent', tier: 1, rating: 54, cut: 11, lead: 5, contract: 78, penalty: 30000, cap: 15, fan: 13, neg: 6, res: 1, royalty: '3-4%', perks: 'Fast submissions, strong indie network.' },
  // TIER 2 - MID-MARKET (rating 55-75)
  { n: 'Marcus Bennett', agency: 'Silverline Artists', spec: 'Film Agent', tier: 2, rating: 62, cut: 13, lead: 5, contract: 104, penalty: 65000, cap: 40, fan: 16, neg: 9, res: 1.3, royalty: '4-6%', perks: 'Mid-budget studio submissions.' },
  { n: 'Isabella Fontaine', agency: 'Redwood Talent Group', spec: 'TV Agent', tier: 2, rating: 58, cut: 12, lead: 6, contract: 104, penalty: 55000, cap: 35, fan: 14, neg: 8, res: 1.2, royalty: '4-5%', perks: 'Premium cable & streaming series.' },
  { n: 'Jordan Pierce', agency: 'Atlas Artist Agency', spec: 'Film Agent', tier: 2, rating: 68, cut: 14, lead: 4, contract: 130, penalty: 90000, cap: 55, fan: 18, neg: 10, res: 1.5, royalty: '5-7%', perks: 'Feature film packaging.' },
  { n: 'Camille Dubois', agency: 'Juniper Management', spec: 'Voice & MoCap Agent', tier: 2, rating: 56, cut: 12, lead: 6, contract: 104, penalty: 50000, cap: 30, fan: 15, neg: 8, res: 1.1, royalty: '4-6%', perks: 'AAA animation & game roles.' },
  { n: 'Andre Whitfield', agency: 'Northwood Talent', spec: 'Film Agent', tier: 2, rating: 71, cut: 14, lead: 4, contract: 130, penalty: 110000, cap: 60, fan: 19, neg: 11, res: 1.6, royalty: '5-7%', perks: 'Studio relationships + salary leverage.' },
  { n: 'Lena Petrova', agency: 'Harbor & Vine', spec: 'TV Agent', tier: 2, rating: 60, cut: 13, lead: 5, contract: 104, penalty: 70000, cap: 40, fan: 16, neg: 9, res: 1.3, royalty: '4-6%', perks: 'Streaming original series.' },
  { n: "Gavin O'Shea", agency: 'Crestline Talent', spec: 'Film Agent', tier: 2, rating: 74, cut: 15, lead: 4, contract: 130, penalty: 120000, cap: 60, fan: 20, neg: 12, res: 1.7, royalty: '6-8%', perks: 'Tentpole supporting leads.' },
  // TIER 3 - MAJOR (rating 75-88)
  { n: 'Maya Sterling', agency: 'Lakeshore Entertainment', spec: 'Film Agent', tier: 3, rating: 79, cut: 16, lead: 3, contract: 156, penalty: 350000, cap: 100, fan: 24, neg: 14, res: 2.1, royalty: '6-9%', perks: 'Major studio first-look access.' },
  { n: 'Dominic Hale', agency: 'Blackwood Artists', spec: 'Film Agent', tier: 3, rating: 82, cut: 17, lead: 3, contract: 182, penalty: 450000, cap: 120, fan: 26, neg: 15, res: 2.3, royalty: '7-10%', perks: 'Blockbuster casting priorities.' },
  { n: 'Valentina Rossi', agency: 'Apex Artist Collective', spec: 'International Agent', tier: 3, rating: 77, cut: 16, lead: 3, contract: 156, penalty: 320000, cap: 90, fan: 23, neg: 13, res: 2, royalty: '6-8%', perks: 'Global productions & co-productions.' },
  { n: 'Omar Haddad', agency: 'Summit Talent Group', spec: 'TV Agent', tier: 3, rating: 80, cut: 17, lead: 3, contract: 182, penalty: 400000, cap: 110, fan: 25, neg: 15, res: 2.2, royalty: '7-9%', perks: 'Flagship series leads.' },
  { n: 'Grace Linden', agency: 'Quill & Vine Talent', spec: 'Franchise Agent', tier: 3, rating: 85, cut: 18, lead: 3, contract: 208, penalty: 600000, cap: 140, fan: 28, neg: 17, res: 2.5, royalty: '8-12%', perks: 'Franchise packaging & sequel leverage.' },
  { n: 'Tobias Reyes', agency: 'Monarch Artists', spec: 'Film Agent', tier: 3, rating: 78, cut: 16, lead: 3, contract: 156, penalty: 360000, cap: 100, fan: 24, neg: 14, res: 2.1, royalty: '6-9%', perks: 'Award-season campaign support.' },
  { n: 'Helena Marsh', agency: 'Sterling Heights Talent', spec: 'Film & TV Agent', tier: 3, rating: 87, cut: 19, lead: 2, contract: 208, penalty: 750000, cap: 150, fan: 30, neg: 18, res: 2.8, royalty: '8-12%', perks: 'Top-tier studio & streamer access.' },
  // TIER 4 - ELITE (rating 88-99)
  { n: 'Julian Frost', agency: 'Lakeshore Entertainment', spec: 'Franchise Agent', tier: 4, rating: 91, cut: 20, lead: 2, contract: 260, penalty: 1500000, cap: 200, fan: 34, neg: 21, res: 3.4, royalty: '10-15%', perks: 'Franchise architect — parts 2-5 packaging.' },
  { n: 'Naomi Ashford', agency: 'Blackwood Artists', spec: 'A-List Film Agent', tier: 4, rating: 94, cut: 21, lead: 2, contract: 286, penalty: 2000000, cap: 230, fan: 36, neg: 23, res: 3.8, royalty: '12-18%', perks: 'Tentpole leads + backend points.' },
  { n: 'Sebastian Cross', agency: 'Apex Artist Collective', spec: 'Global Superstar Agent', tier: 4, rating: 96, cut: 22, lead: 2, contract: 312, penalty: 2600000, cap: 250, fan: 38, neg: 25, res: 4.2, royalty: '12-20%', perks: 'Global blockbusters, $100M+ packages.' },
  { n: 'Vivian Chase', agency: 'Summit Talent Group', spec: 'Film & TV Agent', tier: 4, rating: 90, cut: 20, lead: 2, contract: 260, penalty: 1400000, cap: 190, fan: 33, neg: 20, res: 3.2, royalty: '10-15%', perks: 'Dual film + premium series strategy.' },
  { n: 'Rafael Montez', agency: 'Quill & Vine Talent', spec: 'Franchise Architect', tier: 4, rating: 93, cut: 21, lead: 2, contract: 286, penalty: 1900000, cap: 220, fan: 35, neg: 22, res: 3.6, royalty: '12-18%', perks: 'Multi-film franchise commitments.' },
  { n: 'Alina Volkova', agency: 'Monarch Artists', spec: 'International Icon Agent', tier: 4, rating: 89, cut: 20, lead: 2, contract: 260, penalty: 1300000, cap: 180, fan: 32, neg: 20, res: 3.1, royalty: '10-14%', perks: 'Global market crossovers.' },
  { n: 'Theodore Vance', agency: 'Sterling Heights Talent', spec: 'Legendary Agent', tier: 4, rating: 98, cut: 22, lead: 2, contract: 312, penalty: 2800000, cap: 250, fan: 40, neg: 26, res: 4.5, royalty: '15-25%', perks: 'The most connected desk in Hollywood.' },
];

interface ManagerSeed {
  n: string;
  company: string;
  spec: string;
  tier: 1 | 2 | 3 | 4;
  rating: number;
  salary: number;
  cap: number;
  cut: number;
  contract: number;
  penalty: number;
  perks: string;
}

const MANAGER_SEEDS: ManagerSeed[] = [
  // TIER 1
  { n: 'Chloe Mercer', company: 'Mercer Wealth Partners', spec: 'Bankroll & local endorsements', tier: 1, rating: 41, salary: 45000, cap: 25, cut: 5, contract: 52, penalty: 12000, perks: 'Indie financing discovery.' },
  { n: 'David Lin', company: 'Lin Capital Group', spec: 'Indie financing', tier: 1, rating: 36, salary: 40000, cap: 20, cut: 5, contract: 52, penalty: 10000, perks: 'Small-budget bankroll deals.' },
  { n: 'Rosa Delgado', company: 'Delgado & Co Management', spec: 'Endorsements & local press', tier: 1, rating: 48, salary: 55000, cap: 30, cut: 6, contract: 52, penalty: 18000, perks: 'Regional brand deals.' },
  { n: 'Ethan Brooks', company: 'Brooks Financial Advisory', spec: 'Bankroll & TV bookings', tier: 1, rating: 52, salary: 60000, cap: 30, cut: 6, contract: 78, penalty: 20000, perks: 'Local TV interview bookings.' },
  { n: 'Nadia Rahman', company: 'Rahman Business Group', spec: 'Brand partnerships', tier: 1, rating: 44, salary: 48000, cap: 22, cut: 5, contract: 52, penalty: 15000, perks: 'Startup brand ambassadorships.' },
  { n: 'Owen Gallagher', company: 'Gallagher Asset Management', spec: 'Radio & TV interviews', tier: 1, rating: 50, salary: 58000, cap: 28, cut: 6, contract: 78, penalty: 19000, perks: 'Radio tour bookings.' },
  { n: 'Simone Wright', company: 'Wright Global Partners', spec: 'Financial planning', tier: 1, rating: 54, salary: 65000, cap: 30, cut: 6, contract: 78, penalty: 22000, perks: 'Income structuring.' },
  // TIER 2
  { n: 'Marcus Chen', company: 'Chen Capital Partners', spec: 'Bankroll & syndication', tier: 2, rating: 62, salary: 95000, cap: 80, cut: 7, contract: 104, penalty: 55000, perks: 'Mid-tier film financing syndicates.' },
  { n: 'Avery Stone', company: 'Stone Group Management', spec: 'TV/radio + endorsements', tier: 2, rating: 58, salary: 85000, cap: 70, cut: 7, contract: 104, penalty: 45000, perks: 'Network interview bookings.' },
  { n: 'Isabelle Laurent', company: 'Laurent Financial', spec: 'Franchise packaging', tier: 2, rating: 67, salary: 115000, cap: 100, cut: 8, contract: 130, penalty: 80000, perks: 'Negotiates sequel packages.' },
  { n: 'Nathan Cole', company: 'Cole Business Advisors', spec: 'Corporate sponsorships', tier: 2, rating: 71, salary: 130000, cap: 110, cut: 8, contract: 130, penalty: 90000, perks: 'Mid-major brand sponsorships.' },
  { n: 'Tessa Nguyen', company: 'Nguyen Capital', spec: 'Angel investing', tier: 2, rating: 60, salary: 90000, cap: 75, cut: 7, contract: 104, penalty: 50000, perks: 'Early-stage media investments.' },
  { n: 'Malik Johnson', company: 'Johnson Enterprises', spec: 'Bankroll + IPO prep', tier: 2, rating: 73, salary: 140000, cap: 120, cut: 8, contract: 156, penalty: 100000, perks: 'Studio co-financing.' },
  { n: 'Penelope Grant', company: 'Grant & Hale Management', spec: 'International deals', tier: 2, rating: 69, salary: 120000, cap: 105, cut: 8, contract: 130, penalty: 85000, perks: 'Foreign co-production money.' },
  // TIER 3
  { n: 'Julian Mercer', company: 'Mercer Capital Partners', spec: 'Franchise empire building', tier: 3, rating: 79, salary: 220000, cap: 220, cut: 9, contract: 156, penalty: 250000, perks: 'Multi-film franchise financing.' },
  { n: 'Victor Hale', company: 'Hale Financial Group', spec: 'Studio co-finance', tier: 3, rating: 83, salary: 280000, cap: 260, cut: 10, contract: 182, penalty: 380000, perks: 'Co-finance studio slates.' },
  { n: 'Serena Park', company: 'Park Global Management', spec: 'Corporate sponsorships + TV', tier: 3, rating: 77, salary: 200000, cap: 200, cut: 9, contract: 156, penalty: 230000, perks: 'Global brand sponsorships.' },
  { n: 'Derek Sullivan', company: 'Sullivan Capital', spec: 'Bankroll + global deals', tier: 3, rating: 85, salary: 300000, cap: 280, cut: 10, contract: 182, penalty: 420000, perks: 'International co-financing.' },
  { n: 'Olivia Bennett', company: 'Bennett Asset Group', spec: 'Angel investing + franchises', tier: 3, rating: 81, salary: 250000, cap: 240, cut: 10, contract: 182, penalty: 350000, perks: 'Series A media rounds.' },
  { n: 'Lucas Meyer', company: 'Meyer Ventures', spec: 'Radio/TV empire', tier: 3, rating: 76, salary: 190000, cap: 190, cut: 9, contract: 156, penalty: 220000, perks: 'Premium interview & press tours.' },
  { n: 'Gabriella Romano', company: 'Romano Partners', spec: 'Media conglomerate deals', tier: 3, rating: 87, salary: 340000, cap: 300, cut: 10, contract: 208, penalty: 500000, perks: 'Merger-scale media deals.' },
  // TIER 4
  { n: 'Alexander Quinn', company: 'Quinn Capital Group', spec: 'Global empire architect', tier: 4, rating: 91, salary: 550000, cap: 420, cut: 11, contract: 260, penalty: 1100000, perks: 'Studio equity + global packages.' },
  { n: 'Katherine Stone', company: 'Stone Global Partners', spec: 'Franchise + IPO mastermind', tier: 4, rating: 94, salary: 750000, cap: 480, cut: 12, contract: 286, penalty: 1600000, perks: 'Backend points on everything.' },
  { n: 'Jonathan Pierce', company: 'Pierce Holdings', spec: 'Tentpole packaging', tier: 4, rating: 96, salary: 900000, cap: 500, cut: 12, contract: 312, penalty: 2100000, perks: 'Sources $500M in deals.' },
  { n: 'Victoria Ashford', company: 'Ashford Capital', spec: 'A-List money management', tier: 4, rating: 90, salary: 500000, cap: 400, cut: 11, contract: 260, penalty: 1000000, perks: 'Elite wealth + deal sourcing.' },
  { n: 'Daniel Cross', company: 'Cross Financial Group', spec: 'Studio equity deals', tier: 4, rating: 92, salary: 600000, cap: 450, cut: 11, contract: 286, penalty: 1300000, perks: 'Profit participation structures.' },
  { n: 'Amelia Foster', company: 'Foster Global Management', spec: 'International expansion', tier: 4, rating: 89, salary: 480000, cap: 380, cut: 11, contract: 260, penalty: 950000, perks: 'Global market entry.' },
  { n: 'Robert Sterling', company: 'Sterling Capital Group', spec: 'Legendary dealmaker', tier: 4, rating: 98, salary: 1200000, cap: 500, cut: 12, contract: 312, penalty: 2500000, perks: 'The most powerful money manager in Hollywood.' },
];

const TIER_NAMES: Record<1 | 2 | 3 | 4, string> = {
  1: 'Boutique',
  2: 'Mid-Market',
  3: 'Major',
  4: 'Elite',
};

export const AGENT_POOL: AgentInfo[] = AGENT_SEEDS.map((s, i) => ({
  id: `agent_${i + 1}`,
  name: s.n,
  agencyName: s.agency,
  avatarUrl: AV(PORTRAITS[i % PORTRAITS.length]),
  commissionPercent: s.cut,
  minTalentAverage: 0,
  minLeadRoles: 0,
  minFameXp: s.tier === 1 ? 0 : s.tier === 2 ? 300 : s.tier === 3 ? 1500 : 4000,
  perks: s.perks,
  signed: false,
  tier: s.tier,
  tierName: TIER_NAMES[s.tier],
  rating: s.rating,
  specialty: s.spec,
  contractLengthWeeks: s.contract,
  weeksRemaining: s.contract,
  breachPenalty: s.penalty,
  leadFlowWeeks: s.lead,
  dealCap: s.cap * 1000000,
  fanBonusPercent: s.fan,
  negotiationBonus: s.neg,
  residualBonusPercent: s.res,
  royaltyRangeText: s.royalty,
  pitchMessage: `${s.n} of ${s.agency} believes in your star power. "${s.spec}." Review the offer below.`,
}));

export const MANAGER_POOL: ManagerInfo[] = MANAGER_SEEDS.map((s, i) => ({
  id: `manager_${i + 1}`,
  name: s.n,
  company: s.company,
  commissionPercent: s.cut,
  signed: false,
  avatarUrl: AV(PORTRAITS[(i + 3) % PORTRAITS.length]),
  tier: s.tier,
  tierName: TIER_NAMES[s.tier],
  rating: s.rating,
  specialty: s.spec,
  yearlySalary: s.salary,
  contractLengthWeeks: s.contract,
  weeksRemaining: s.contract,
  breachPenalty: s.penalty,
  dealCap: s.cap * 1000000,
  perks: s.perks,
  pitchMessage: `${s.n} of ${s.company} wants to handle your money. "${s.spec}."`,
}));

export const getAgentById = (id: string): AgentInfo | undefined =>
  AGENT_POOL.find((a) => a.id === id);

export const getManagerById = (id: string): ManagerInfo | undefined =>
  MANAGER_POOL.find((m) => m.id === id);

// NPC Fan names for the Fan Club feed
export const NPC_FAN_NAMES = [
  'Jessica Miller', 'Tyler Brooks', 'Amara Chen', 'Liam Foster', 'Sofia Reyes',
  'Noah Williams', 'Emma Johnson', 'Lucas Garcia', 'Olivia Martin', 'Ethan Davis',
  'Ava Thompson', 'Mason Rodriguez', 'Isabella Lee', 'James Wilson', 'Mia Anderson',
  'Benjamin Thomas', 'Charlotte Moore', 'Elijah Jackson', 'Amelia White', 'Henry Harris',
  'Harper Clark', 'Leo Lewis', 'Ella Robinson', 'Jack Walker', 'Grace Young',
  'Daniel King', 'Chloe Wright', 'Matthew Scott', 'Lily Green', 'Ryan Baker',
  'Zoe Adams', 'Nathan Hill', 'Ruby Torres', 'Caleb Nguyen', 'Stella Kim',
];

// NPC celebrities for the scandal system (original fictional stars)
export const NPC_CELEBRITY_POOL: { name: string; rating: number; avatarUrl: string }[] = [
  { name: 'Marcus Hayes', rating: 89, avatarUrl: AV('photo-1507003211169-0a1dd7228f2d') },
  { name: 'Seraphina Sterling', rating: 87, avatarUrl: AV('photo-1494790108377-be9c29b29330') },
  { name: 'Damon Kincaid', rating: 84, avatarUrl: AV('photo-1472099645785-5658abf4ff4e') },
  { name: 'Chloe Laurent', rating: 86, avatarUrl: AV('photo-1534528741775-53994a69daeb') },
  { name: 'Alexander Vance', rating: 82, avatarUrl: AV('photo-1500648767791-00dcc994a43e') },
  { name: 'Sophia Sterling', rating: 88, avatarUrl: AV('photo-1580489944761-15a19d654956') },
  { name: 'Gabriel Stone', rating: 81, avatarUrl: AV('photo-1506794778202-cad84cf45f1d') },
  { name: 'Victoria Reign', rating: 90, avatarUrl: AV('photo-1544005313-94ddf0286df2') },
  { name: 'Julian Cross', rating: 79, avatarUrl: AV('photo-1519085360753-af0119f7cbe7') },
  { name: 'Isadora Vega', rating: 85, avatarUrl: AV('photo-1531123897727-8f129e1688ce') },
  { name: 'Caspian Cole', rating: 77, avatarUrl: AV('photo-1560250097-0b93528c311a') },
  { name: 'Nadia Frost', rating: 83, avatarUrl: AV('photo-1573496359142-b8d87734a5a2') },
];

// Blogger handles used by smear campaigns & real-event posts
export const BLOGGER_HANDLES = [
  { name: 'The Reel Report', handle: '@thereelreport' },
  { name: 'Popcorn Prophet', handle: '@popcornprophet' },
  { name: 'Sunset Scoop', handle: '@sunsetscoop' },
  { name: 'Box Office Buzz', handle: '@boxofficebuzz' },
  { name: 'The Daily Marquee', handle: '@thedailymarquee' },
  { name: 'Red Carpet Rumor', handle: '@redcarpetrumor' },
  { name: 'Studio Gate', handle: '@studiogate' },
  { name: 'Fame Focus', handle: '@famefocus' },
];

// Award-season actor pool — assigned to real NPC box office movies at release.
// These names are original fictional stars for Hollywood Rising.
export const AWARD_ACTOR_POOL: { name: string; talent: number; avatarUrl: string }[] = [
  { name: 'Marcus Hayes', talent: 92, avatarUrl: AV('photo-1507003211169-0a1dd7228f2d') },
  { name: 'Seraphina Sterling', talent: 90, avatarUrl: AV('photo-1494790108377-be9c29b29330') },
  { name: 'Damon Kincaid', talent: 88, avatarUrl: AV('photo-1472099645785-5658abf4ff4e') },
  { name: 'Chloe Laurent', talent: 89, avatarUrl: AV('photo-1534528741775-53994a69daeb') },
  { name: 'Alexander Vance', talent: 86, avatarUrl: AV('photo-1500648767791-00dcc994a43e') },
  { name: 'Sophia Sterling', talent: 91, avatarUrl: AV('photo-1580489944761-15a19d654956') },
  { name: 'Gabriel Stone', talent: 85, avatarUrl: AV('photo-1506794778202-cad84cf45f1d') },
  { name: 'Victoria Reign', talent: 93, avatarUrl: AV('photo-1544005313-94ddf0286df2') },
  { name: 'Julian Cross', talent: 84, avatarUrl: AV('photo-1519085360753-af0119f7cbe7') },
  { name: 'Isadora Vega', talent: 88, avatarUrl: AV('photo-1531123897727-8f129e1688ce') },
  { name: 'Caspian Cole', talent: 82, avatarUrl: AV('photo-1560250097-0b93528c311a') },
  { name: 'Nadia Frost', talent: 87, avatarUrl: AV('photo-1573496359142-b8d87734a5a2') },
  { name: 'Theo Blackwood', talent: 90, avatarUrl: AV('photo-1519345182560-3f2917c472ef') },
  { name: 'Riley Quinn', talent: 83, avatarUrl: AV('photo-1535713875002-d1d0cf377fde') },
  { name: 'Anya Petrova', talent: 86, avatarUrl: AV('photo-1524504388940-b1c1722653e1') },
  { name: 'Lorenzo Diaz', talent: 81, avatarUrl: AV('photo-1529626455594-4ff0802cfb7e') },
  { name: 'Margot Vance', talent: 89, avatarUrl: AV('photo-1547425260-76bcadfb4f2c') },
  { name: 'Silas Monroe', talent: 84, avatarUrl: AV('photo-1438761681033-6461ffad8d80') },
  { name: 'Callie Winters', talent: 82, avatarUrl: AV('photo-1521119989659-a83eee488004') },
  { name: 'Devon Pierce', talent: 85, avatarUrl: AV('photo-1519699047748-de8e457a634e') },
  { name: 'Athena Cole', talent: 87, avatarUrl: AV('photo-1492562080023-ab3db95bfbce') },
  { name: 'Remington Fox', talent: 80, avatarUrl: AV('photo-1463453091185-61582044d556') },
  { name: 'Scarlett Rain', talent: 91, avatarUrl: AV('photo-1508214751196-bcfd4ca60f91') },
  { name: 'Ezra Knight', talent: 83, avatarUrl: AV('photo-1544725176-7c40e5a71c5e') },
  { name: 'Dahlia Monroe', talent: 88, avatarUrl: AV('photo-1544005313-94ddf0286df2') },
  { name: 'Finn Callahan', talent: 79, avatarUrl: AV('photo-1500648767791-00dcc994a43e') },
  { name: 'Ivy Laurent', talent: 85, avatarUrl: AV('photo-1494790108377-be9c29b29330') },
  { name: 'Oscar Bennett', talent: 78, avatarUrl: AV('photo-1507003211169-0a1dd7228f2d') },
  { name: 'Petra Novak', talent: 86, avatarUrl: AV('photo-1534528741775-53994a69daeb') },
  { name: 'Hugo Steele', talent: 84, avatarUrl: AV('photo-1472099645785-5658abf4ff4e') },
  { name: 'Lila Fontaine', talent: 89, avatarUrl: AV('photo-1531123897727-8f129e1688ce') },
  { name: 'Roman Ash', talent: 82, avatarUrl: AV('photo-1519085360753-af0119f7cbe7') },
  { name: 'Nina Vale', talent: 83, avatarUrl: AV('photo-1580489944761-15a19d654956') },
  { name: 'Cyrus Dawn', talent: 80, avatarUrl: AV('photo-1506794778202-cad84cf45f1d') },
  { name: 'Freya Storm', talent: 87, avatarUrl: AV('photo-1524504388940-b1c1722653e1') },
  { name: 'Julian Mercer', talent: 81, avatarUrl: AV('photo-1529626455594-4ff0802cfb7e') },
  { name: 'Camille Noir', talent: 90, avatarUrl: AV('photo-1547425260-76bcadfb4f2c') },
  { name: 'Dante Rivera', talent: 79, avatarUrl: AV('photo-1519345182560-3f2917c472ef') },
  { name: 'Elara Vance', talent: 85, avatarUrl: AV('photo-1438761681033-6461ffad8d80') },
  { name: 'Miles Calloway', talent: 88, avatarUrl: AV('photo-1535713875002-d1d0cf377fde') },
];
