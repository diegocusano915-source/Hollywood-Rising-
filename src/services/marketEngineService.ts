/**
 * HOLLYWOOD RISING - INVISIBLE MARKET ENGINE & LIVING ECONOMY V2
 * (STOCK MARKET • IPOs • CRYPTOCURRENCY • MARKET CYCLES • NEWS)
 *
 * Grounded background simulation calculated every End Week (7 days).
 * Zero fake simulation: Prices, valuations, earnings, and news are computed
 * directly from company fundamentals, economic cycles, investor confidence,
 * industry performance, and player/NPC decisions.
 */

export type EconomicCycle =
  | 'Bull Market'
  | 'Bear Market'
  | 'Market Correction'
  | 'Recovery'
  | 'Economic Boom'
  | 'Economic Slowdown'
  | 'Recession';

export type VolatilityRating = 'Low' | 'Moderate' | 'High' | 'Volatile' | 'Extreme Degen';
export type CompanyRating = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
export type CompanyStatus = 'Public' | 'Acquired' | 'Bankrupt' | 'TakenPrivate' | 'Delisted' | 'Pre-IPO';

/**
 * A REAL studio production on a stock studio's slate. Films progress
 * DEV → CASTING (roles ship to the player's callboard) → FILMING → POST →
 * RELEASED (box office rolls, stock price reacts).
 */
export interface StudioProduction {
  id: string;
  title: string;
  genre: string;
  budget: number;
  stage: 'DEVELOPMENT' | 'CASTING' | 'FILMING' | 'POST' | 'RELEASED';
  weeksInStage: number;
  stageWeeksTotal: number;
  /** How many casting roles this film shipped to the callboard */
  castingRolesSent?: number;
  releasedWeek?: number;
  releasedYear?: number;
  gross?: number;
  wasHit?: boolean;
}

export interface StockCompany {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  ceo: string;
  logo: string;
  sharePrice: number;
  prevPrice: number;
  changePct: number;
  marketCap: number;
  sharesOutstanding: number;
  revenue: number;
  profit: number;
  debt: number;
  growthRate: number;
  investorConfidence: number;
  ceoRating: number;
  newsSentiment: number;
  volatility: VolatilityRating;
  rating: string;
  dividendYieldPct: number;
  history: string;
  movies: string[];
  series: string[];
  upcomingProjects: string[];
  news: string[];
  chartData: number[];
  status: string;
  weeksSinceListing?: number;
  weakStreak?: number;
  listedWeek?: number;
  listedYear?: number;
  institutionalOwnershipPct?: number;
  insiderOwnershipPct?: number;
  publicOwnershipPct?: number;
  playerSharesOwned: number;
  playerAvgBuyPrice: number;
  boardSeatsTotal?: number;
  playerBoardMember?: boolean;
  /** Live production slate — the studio's real pipeline */
  slate?: StudioProduction[];
  /** 0-100 rolling health of the slate (hits vs flops) */
  slateHealth?: number;
  /** Film-producing studios get slates; tech/exhibitor stocks don't */
  isFilmStudio?: boolean;
}

export interface IpoCompany {
  id: string;
  companyName: string;
  ticker: string;
  industry: string;
  ipoPrice: number;
  sharesOffered: number;
  initialMarketCap: number;
  investorInterest: number; // 0-100
  riskRating: 'Low' | 'Moderate' | 'High' | 'Extreme';
  growthRating: 'Stable' | 'High Growth' | 'Hyper Growth' | 'Turnaround';
  companyFundamentals: {
    revenue: number;
    profit: number;
    debt: number;
  };
  weeksUntilLaunch: number; // e.g. 1 to 4 weeks
  isPlayerIpo?: boolean;
  playerSubscribedShares?: number;
  status: 'Upcoming' | 'Live Today' | 'Completed' | 'Cancelled';
  description: string;
}

/**
 * LIVE CAREER FEED for the player's fan token — the coin's price reacts to
 * real weekly career state (fame momentum, box office, fanbase size).
 */
export interface PlayerCoinContext {
  fameXp: number;
  fameDeltaPct: number;           // this week's fame momentum, %
  lastReleasePerformance: number; // -1 (flop) .. 0 (no release) .. +1 (blockbuster)
  fanCount: number;
}

export interface FounderDumpReport {
  symbol: string;
  coinName: string;
  tokensSold: number;
  supplyPct: number;
  slipPct: number;
  proceeds: number;
  priceBefore: number;
  priceAfter: number;
  trustBefore: number;
  trustAfter: number;
}

/** Token amounts in exchange shorthand: 1.50B / 240.0M / 15.2K */
export function fmtTokens(n: number): string {
  if (!Number.isFinite(n)) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(Math.round(n));
}

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  prevPrice: number;
  change24h: number; // weekly change %
  change7d: number;
  marketCap: number;
  circulatingSupply: number;
  volume24h: number;
  popularity: number; // 0-100
  communityStrength: number; // 0-100
  volatility: VolatilityRating;
  sector: string;
  risk: 'Low' | 'Medium' | 'High' | 'Extreme Degen';
  techDescription: string;
  sparkline: number[];
  news: string;
  isMyCoin?: boolean;
  status: 'Active' | 'Delisted' | 'RugPulled' | 'TopLeader';
  playerHoldings: number;
  playerAvgBuyPrice: number;
  weeksSinceListing?: number;
  weakStreak?: number;
  listedWeek?: number;
  listedYear?: number;
  /** Consecutive weeks of declining health — drives delist votes */
  delistStreak?: number;
  /** Tokens airdropped to the community so far (founder wallet gives them up) */
  communityAirdropped?: number;
  /** Unique community holders gained through airdrops */
  airdropHolders?: number;
  /** Absolute week (year*52+week) of the last airdrop — enforces cooldown */
  lastAirdropWeek?: number;
  /** Consecutive airdrops — each extra one dims the effect (community fatigue) */
  airdropStreak?: number;
  /** Weeks of airdrop buzz left — decaying price tailwind */
  buzzWeeksLeft?: number;
  /** Formally under delist review — shown to player as warning */
  delistWarning?: boolean;
  /** All-time-high price tracker */
  athPrice?: number;
  /** Sector emoji icon for the market list */
  icon?: string;
}

/** Living crypto market regime — bull runs, bears, pumps, crashes */
export interface CryptoRegime {
  type: 'NEUTRAL' | 'BULL' | 'BEAR' | 'PUMP' | 'CRASH' | 'RECOVERY';
  weeksRemaining: number;
  weeksTotal: number;
  strength: number; // 0.5 – 1.5 intensity multiplier
}

/** Exchange wire event — listings, delists, pumps, regime shifts */
export interface CryptoWireEvent {
  id: string;
  week: number;
  year: number;
  kind: 'LISTING' | 'DELIST_VOTE' | 'DELISTED' | 'PUMP' | 'DUMP' | 'REGIME' | 'WHALE';
  symbol?: string;
  title: string;
  sub: string;
}

/** A studio production casting role shipped to the player's callboard */
export interface StudioCastingCall {
  productionRef: string;
  title: string;
  genre: string;
  budget: number;
  studioName: string;
  studioTicker: string;
  role: {
    roleType: 'Lead' | 'Principal' | 'Support';
    salary: number;
    requiredFameXp: number;
    filmingWeeks: number;
  };
}

export interface MarketTransaction {
  id: string;
  assetType: 'STOCK' | 'CRYPTO' | 'IPO';
  assetId: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL' | 'SUBSCRIBE';
  units: number;
  pricePerUnit: number;
  totalCost: number;
  week: number;
  year: number;
  timestamp: string;
}

export interface NpcWhale {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  capital: number;
  strategy: 'Value Investor' | 'Growth Tech' | 'Crypto Degen' | 'Momentum' | 'Distressed Assets';
  winRatePct: number;
  totalProfit: number;
  topPositions: string[];
  copyTradeActive: boolean;
  copyTradeFeePct: number;
}

export interface EconomicNews {
  id: string;
  week: number;
  year: number;
  title: string;
  body: string;
  category: 'MACRO' | 'STOCK' | 'CRYPTO' | 'IPO' | 'BUSINESS';
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'CRASH' | 'BOOM';
  affectedAssetSymbol?: string;
}

export interface EconomyMarketState {
  currentWeek: number;
  currentYear: number;
  cycle: EconomicCycle;
  cycleDurationWeeks: number;
  inflationRate: number;
  interestRate: number;
  gdpGrowthRate: number;
  investorConfidenceIndex: number;
  industryStrengths: Record<string, number>; // industry -> 0 to 100
  stocks: StockCompany[];
  ipos: IpoCompany[];
  cryptoCoins: CryptoCoin[];
  whales: NpcWhale[];
  news: EconomicNews[];
  transactions: MarketTransaction[];
  playerCustomIposCount: number;
  playerCustomCryptosCount: number;
  /** Living crypto market regime (bull/bear/pump/crash cycles) */
  cryptoRegime?: CryptoRegime;
  /** Exchange wire — listings, delists, pumps, regime shifts (newest first) */
  cryptoWire?: CryptoWireEvent[];
  /** Absolute week (year*52+week) when the next new coin lists */
  nextCryptoListingWeek?: number;
  /** Realized crypto gains this week, fed to the tax engine (taxable) */
  pendingCryptoGains?: number;
  /** Realized crypto losses this week, offset gains before taxing */
  pendingCryptoLosses?: number;
  /** Absolute week (year*52+week) when the next new STUDIO launches (IPO) */
  nextStudioLaunchWeek?: number;
  /** Last week's market-cap rank of the player's fan token (flippening detector) */
  playerCoinPrevRank?: number;
  /** True after the player rug-pulled their fan token — exchange blacklist, no new launches */
  playerRugPulled?: boolean;
}

/** Seed slates + flags on the studio list (used at init AND save migration) */
function ensureStudioSlates(stocks: StockCompany[], week: number, year: number): void {
  const FILM_IDS = new Set(['disney', 'netflix', 'wbd', 'paramount', 'sony', 'a24']);
  for (const st of stocks) {
    if (typeof st.isFilmStudio !== 'boolean') {
      st.isFilmStudio = FILM_IDS.has(st.id) || st.industry.includes('Cinema') || st.industry.includes('Studio') || st.industry.includes('Film') || st.industry.includes('Streaming');
    }
    if (st.isFilmStudio && (!st.slate || st.slate.length === 0)) {
      st.slate = seedSlate(st.id);
      st.slateHealth = 50 + Math.floor(Math.random() * 30);
    }
  }
}

const LOCAL_STORAGE_KEY = 'HOLLYWOOD_RISING_MARKET_ENGINE_V2';

// INITIAL GROUNDED STOCK LIST
const INITIAL_STOCKS: StockCompany[] = [
  {
    id: 'disney',
    name: 'Walt Disney Co',
    ticker: 'DIS',
    industry: 'Entertainment Conglomerate',
    ceo: 'Bob Iger',
    logo: '🎬',
    sharePrice: 112.45,
    prevPrice: 110.0,
    changePct: 2.23,
    marketCap: 205800000000,
    sharesOutstanding: 1830000000,
    revenue: 88900000000,
    profit: 3200000000,
    debt: 45000000000,
    growthRate: 5.4,
    investorConfidence: 85,
    ceoRating: 88,
    newsSentiment: 35,
    volatility: 'Low',
    rating: 'A+',
    dividendYieldPct: 1.2,
    history: 'Founded in 1923, Disney controls Lucasfilm, Marvel, Pixar, and Disney+ streaming network.',
    movies: ['Avengers: Secret Wars', 'Frozen 3', 'Avatar: Fire and Ash'],
    series: ['The Mandalorian S4', 'Daredevil: Born Again'],
    upcomingProjects: ['Pirates of the Caribbean Reboot', 'Star Wars: New Jedi Order'],
    news: [
      'Disney+ reports 4.2M new quarterly subscribers boosting media division revenue.',
      'Box office projections for upcoming Marvel slate revised upward following Comic-Con teaser.',
    ],
    chartData: [102, 104, 103, 106, 108, 110, 112.45],
    status: 'Public',
    institutionalOwnershipPct: 68,
    insiderOwnershipPct: 2,
    publicOwnershipPct: 30,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 12,
    playerBoardMember: false,
  },
  {
    id: 'netflix',
    name: 'Netflix Inc',
    ticker: 'NFLX',
    industry: 'Streaming Giant',
    ceo: 'Ted Sarandos & Greg Peters',
    logo: '🔴',
    sharePrice: 685.1,
    prevPrice: 693.4,
    changePct: -1.2,
    marketCap: 295400000000,
    sharesOutstanding: 431000000,
    revenue: 33700000000,
    profit: 5400000000,
    debt: 14000000000,
    growthRate: 11.2,
    investorConfidence: 90,
    ceoRating: 92,
    newsSentiment: 20,
    volatility: 'Moderate',
    rating: 'A+',
    dividendYieldPct: 0.0,
    history: 'Pioneer of video streaming services worldwide with over 270 Million paid subscribers.',
    movies: ['Glass Onion 2', 'Extraction 3', 'Red Notice Sequel'],
    series: ['Stranger Things S5', 'Wednesday S2', 'Squid Game S3'],
    upcomingProjects: ['Bioshock Feature Adaptation', 'Narnia Universe Reboot'],
    news: [
      'Global subscriber base reaches all-time high of 278 Million.',
      'Ad-supported tier revenue grows 150% year-over-year exceeding Wall Street targets.',
    ],
    chartData: [640, 652, 665, 670, 690, 693.4, 685.1],
    status: 'Public',
    institutionalOwnershipPct: 82,
    insiderOwnershipPct: 3,
    publicOwnershipPct: 15,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 10,
    playerBoardMember: false,
  },
  {
    id: 'wbd',
    name: 'Warner Bros. Discovery',
    ticker: 'WBD',
    industry: 'Studio & Cable Media',
    ceo: 'David Zaslav',
    logo: '🛡️',
    sharePrice: 8.25,
    prevPrice: 8.1,
    changePct: 1.85,
    marketCap: 20300000000,
    sharesOutstanding: 2460000000,
    revenue: 41300000000,
    profit: 850000000,
    debt: 39000000000,
    growthRate: 2.1,
    investorConfidence: 62,
    ceoRating: 65,
    newsSentiment: -5,
    volatility: 'High',
    rating: 'B',
    dividendYieldPct: 0.0,
    history: 'Historic Hollywood studio behind DC Studios, HBO Max, CNN, and Harry Potter franchise.',
    movies: ['Superman: Legacy', 'The Batman Part II', 'Dune: Part Three'],
    series: ['House of the Dragon S3', 'The Last of Us S2'],
    upcomingProjects: ['Harry Potter HBO Series', 'DCU Chapter One Slate'],
    news: [
      'Max streaming service achieves international profitability ahead of schedule.',
      'Debt reduction strategy pays down $2.4B in high-interest bonds.',
    ],
    chartData: [9.2, 8.8, 8.5, 8.1, 7.9, 8.1, 8.25],
    status: 'Public',
    institutionalOwnershipPct: 61,
    insiderOwnershipPct: 4,
    publicOwnershipPct: 35,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 11,
    playerBoardMember: false,
  },
  {
    id: 'paramount',
    name: 'Paramount Global',
    ticker: 'PARA',
    industry: 'Film & TV Studio',
    ceo: 'David Ellison (Skydance)',
    logo: '🏔️',
    sharePrice: 11.8,
    prevPrice: 11.2,
    changePct: 5.36,
    marketCap: 7800000000,
    sharesOutstanding: 661000000,
    revenue: 29800000000,
    profit: 420000000,
    debt: 14600000000,
    growthRate: 3.5,
    investorConfidence: 70,
    ceoRating: 80,
    newsSentiment: 40,
    volatility: 'High',
    rating: 'B+',
    dividendYieldPct: 1.8,
    history: 'Legendary Melrose Avenue studio holding Mission Impossible, Top Gun, and Paramount+.',
    movies: ['Mission: Impossible 8', 'Top Gun 3', 'Gladiator II'],
    series: ['Yellowstone Franchise', 'Tulsa King S2'],
    upcomingProjects: ['Star Trek Origin Movie', 'Transformers & G.I. Joe Crossover'],
    news: [
      'Skydance merger approval finalized unlocking $2B equity injection.',
      'Paramount+ subscriber growth accelerates behind Taylor Sheridan universe.',
    ],
    chartData: [10.5, 10.8, 11.0, 11.1, 11.3, 11.2, 11.8],
    status: 'Public',
    institutionalOwnershipPct: 74,
    insiderOwnershipPct: 10,
    publicOwnershipPct: 16,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 9,
    playerBoardMember: false,
  },
  {
    id: 'sony',
    name: 'Sony Group Corp',
    ticker: 'SONY',
    industry: 'Entertainment & Gaming',
    ceo: 'Kenichiro Yoshida',
    logo: '🎮',
    sharePrice: 88.5,
    prevPrice: 86.2,
    changePct: 2.67,
    marketCap: 110200000000,
    sharesOutstanding: 1245000000,
    revenue: 89000000000,
    profit: 7800000000,
    debt: 21000000000,
    growthRate: 8.2,
    investorConfidence: 88,
    ceoRating: 90,
    newsSentiment: 30,
    volatility: 'Low',
    rating: 'A+',
    dividendYieldPct: 0.9,
    history: 'Japanese tech & entertainment titan operating PlayStation, Sony Pictures, and Sony Music.',
    movies: ['Spider-Man: Beyond the Spider-Verse', 'Venom: The Last Dance'],
    series: ['The Last of Us S2 (Co-Prod)', 'God of War Live Action'],
    upcomingProjects: ['Uncharted 2', 'Ghost of Tsushima Feature Film'],
    news: [
      'PlayStation 5 sales cross 60 Million units boosting digital software margins.',
      'Sony Pictures theatrical distribution revenue jumps 22% quarter-over-quarter.',
    ],
    chartData: [82, 83.5, 85, 84, 86, 86.2, 88.5],
    status: 'Public',
    institutionalOwnershipPct: 58,
    insiderOwnershipPct: 5,
    publicOwnershipPct: 37,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 12,
    playerBoardMember: false,
  },
  {
    id: 'a24',
    name: 'A24 Indie Films Inc',
    ticker: 'A24',
    industry: 'Independent Cinema',
    ceo: 'Daniel Katz & David Fenkel',
    logo: '👁️',
    sharePrice: 42.0,
    prevPrice: 40.5,
    changePct: 3.7,
    marketCap: 3500000000,
    sharesOutstanding: 83333333,
    revenue: 450000000,
    profit: 85000000,
    debt: 120000000,
    growthRate: 18.5,
    investorConfidence: 94,
    ceoRating: 95,
    newsSentiment: 60,
    volatility: 'Moderate',
    rating: 'A',
    dividendYieldPct: 0.0,
    history: 'Prestige indie studio behind Oscar winners Everything Everywhere All at Once and Civil War.',
    movies: ['Civil War', 'Heretic', 'Babygirl'],
    series: ['Euphoria S3', 'The Sympathizer'],
    upcomingProjects: ['Death of a Unicorn', 'A24 Action Blockbuster Initiative'],
    news: [
      'A24 secures $225M private equity line to expand into mid-budget action & sci-fi films.',
      'Critic acclaim sweep adds 12 nomination awards across international festivals.',
    ],
    chartData: [34, 36, 37.5, 39, 40, 40.5, 42.0],
    status: 'Public',
    institutionalOwnershipPct: 45,
    insiderOwnershipPct: 35,
    publicOwnershipPct: 20,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 7,
    playerBoardMember: false,
  },
  {
    id: 'nvda',
    name: 'Nvidia AI Systems',
    ticker: 'NVDA',
    industry: 'Artificial Intelligence & Visual Tech',
    ceo: 'Jensen Huang',
    logo: '⚡',
    sharePrice: 125.0,
    prevPrice: 120.5,
    changePct: 3.73,
    marketCap: 3070000000000,
    sharesOutstanding: 24560000000,
    revenue: 96000000000,
    profit: 52000000000,
    debt: 11000000000,
    growthRate: 122.0,
    investorConfidence: 98,
    ceoRating: 99,
    newsSentiment: 75,
    volatility: 'Volatile',
    rating: 'A+',
    dividendYieldPct: 0.1,
    history: 'Global AI compute leader powering visual effects, neural rendering, and Hollywood CGI pipelines.',
    movies: ['Omniverse Virtual Production Engine'],
    series: ['Real-Time CGI AI Infrastructure'],
    upcomingProjects: ['Blackwell B200 AI Chipsets for VFX Studios'],
    news: [
      'Quarterly revenue breaks records driven by Hollywood AI visual effects demand.',
      'Jensen Huang unveils real-time photorealistic AI rendering platform.',
    ],
    chartData: [108, 112, 115, 118, 122, 120.5, 125.0],
    status: 'Public',
    institutionalOwnershipPct: 67,
    insiderOwnershipPct: 4,
    publicOwnershipPct: 29,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 12,
    playerBoardMember: false,
  },
  {
    id: 'amc',
    name: 'AMC Entertainment',
    ticker: 'AMC',
    industry: 'Retail & Cinema Chains',
    ceo: 'Adam Aron',
    logo: '🍿',
    sharePrice: 4.85,
    prevPrice: 5.0,
    changePct: -3.0,
    marketCap: 1400000000,
    sharesOutstanding: 288600000,
    revenue: 4800000000,
    profit: -180000000,
    debt: 4200000000,
    growthRate: -2.5,
    investorConfidence: 45,
    ceoRating: 58,
    newsSentiment: -15,
    volatility: 'Extreme Degen',
    rating: 'C',
    dividendYieldPct: 0.0,
    history: 'World largest movie theater chain operating over 10,000 screens globally.',
    movies: ['Concert Film Exclusives (Taylor Swift & Beyonce)'],
    series: [],
    upcomingProjects: ['Gourmet Concession Popcorn Retail Expansion'],
    news: [
      'AMC announces debt refinancing extending maturity dates out to 2029.',
      'Concession revenue per patron hits record high of $7.85.',
    ],
    chartData: [5.8, 5.5, 5.3, 5.1, 4.9, 5.0, 4.85],
    status: 'Public',
    institutionalOwnershipPct: 28,
    insiderOwnershipPct: 1,
    publicOwnershipPct: 71,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 9,
    playerBoardMember: false,
    isFilmStudio: false,
  },
  {
    id: 'universal',
    name: 'Universal Pictures',
    ticker: 'UVX',
    industry: 'Film & TV Studio',
    ceo: 'Donna Langley',
    logo: '🌐',
    sharePrice: 62.4,
    prevPrice: 60.8,
    changePct: 2.6,
    marketCap: 57000000000,
    sharesOutstanding: 913000000,
    revenue: 32000000000,
    profit: 4200000000,
    debt: 22000000000,
    growthRate: 6.8,
    investorConfidence: 84,
    ceoRating: 86,
    newsSentiment: 25,
    volatility: 'Moderate',
    rating: 'A',
    dividendYieldPct: 1.6,
    history: 'Oldest surviving American film studio, home of the Fast saga and Jurassic World.',
    movies: ['Fast X: Part 2', 'Jurassic World: Rebirth'],
    series: [],
    upcomingProjects: ['Wicked: For Good'],
    news: ['Theme park revenue crosses $10B annual run-rate.'],
    chartData: [57, 58.4, 57.9, 59.8, 60.1, 60.8, 62.4],
    status: 'Public',
    institutionalOwnershipPct: 78,
    insiderOwnershipPct: 5,
    publicOwnershipPct: 17,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 11,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'lionsgate',
    name: 'Lionsgate Films',
    ticker: 'LGF',
    industry: 'Independent Cinema',
    ceo: 'Jon Feltheimer',
    logo: '🦁',
    sharePrice: 9.7,
    prevPrice: 9.3,
    changePct: 4.3,
    marketCap: 2200000000,
    sharesOutstanding: 227000000,
    revenue: 3900000000,
    profit: 120000000,
    debt: 2200000000,
    growthRate: 3.4,
    investorConfidence: 66,
    ceoRating: 74,
    newsSentiment: 15,
    volatility: 'High',
    rating: 'BB',
    dividendYieldPct: 0.0,
    history: 'Independent powerhouse behind John Wick and The Hunger Games.',
    movies: ['John Wick: Ballerina', 'Hunger Games: Sunrise'],
    series: [],
    upcomingProjects: ['Now You See Me 3'],
    news: ['John Wick TV spin-off ordered to series.'],
    chartData: [8.2, 8.5, 8.4, 8.9, 9.0, 9.3, 9.7],
    status: 'Public',
    institutionalOwnershipPct: 68,
    insiderOwnershipPct: 8,
    publicOwnershipPct: 24,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 9,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'blumhouse',
    name: 'Blumhouse Productions',
    ticker: 'BLUM',
    industry: 'Independent Cinema',
    ceo: 'Jason Blum',
    logo: '👻',
    sharePrice: 17.3,
    prevPrice: 15.9,
    changePct: 8.8,
    marketCap: 1700000000,
    sharesOutstanding: 98000000,
    revenue: 620000000,
    profit: 95000000,
    debt: 180000000,
    growthRate: 14.2,
    investorConfidence: 78,
    ceoRating: 88,
    newsSentiment: 40,
    volatility: 'High',
    rating: 'BB+',
    dividendYieldPct: 0.0,
    history: 'Micro-budget horror empire: $5M films, $200M grosses.',
    movies: ['Five Nights at Freddys 2', 'The Exorcism'],
    series: [],
    upcomingProjects: ['M3GAN Universe Expansion'],
    news: ['Horror slate averages 8.2x return on production budget.'],
    chartData: [12.8, 13.5, 13.2, 14.4, 14.9, 15.9, 17.3],
    status: 'Public',
    institutionalOwnershipPct: 55,
    insiderOwnershipPct: 18,
    publicOwnershipPct: 27,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 7,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'legendary',
    name: 'Legendary Entertainment',
    ticker: 'LGND',
    industry: 'Film & TV Studio',
    ceo: 'Josh Grode',
    logo: '🐉',
    sharePrice: 41.8,
    prevPrice: 39.5,
    changePct: 5.8,
    marketCap: 10400000000,
    sharesOutstanding: 249000000,
    revenue: 3400000000,
    profit: 410000000,
    debt: 2500000000,
    growthRate: 9.6,
    investorConfidence: 76,
    ceoRating: 80,
    newsSentiment: 22,
    volatility: 'High',
    rating: 'A-',
    dividendYieldPct: 0.0,
    history: 'Kaiju and blockbuster specialist — MonsterVerse and Dune.',
    movies: ['Dune: Part Three', 'Godzilla x Kong 2'],
    series: [],
    upcomingProjects: ['MonsterVerse Series'],
    news: ['Dune franchise crosses $1.4B combined gross.'],
    chartData: [34.5, 35.9, 35.2, 37.4, 38.1, 39.5, 41.8],
    status: 'Public',
    institutionalOwnershipPct: 72,
    insiderOwnershipPct: 9,
    publicOwnershipPct: 19,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 9,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'mgm',
    name: 'Amazon MGM Studios',
    ticker: 'AMGM',
    industry: 'Streaming Giant',
    ceo: 'Jennifer Salke',
    logo: '🦁',
    sharePrice: 88.9,
    prevPrice: 87.1,
    changePct: 2.1,
    marketCap: 94000000000,
    sharesOutstanding: 1057000000,
    revenue: 40000000000,
    profit: 2100000000,
    debt: 58000000000,
    growthRate: 8.9,
    investorConfidence: 88,
    ceoRating: 85,
    newsSentiment: 30,
    volatility: 'Moderate',
    rating: 'A+',
    dividendYieldPct: 0.0,
    history: 'MGM plus Amazon deep pockets — Bond franchise custodian.',
    movies: ['Bond 26', 'Road House Legacy'],
    series: [],
    upcomingProjects: ['Bond TV Universe'],
    news: ['Bond 26 director search narrows to three finalists.'],
    chartData: [82, 83.5, 84.1, 85.9, 86.2, 87.1, 88.9],
    status: 'Public',
    institutionalOwnershipPct: 84,
    insiderOwnershipPct: 6,
    publicOwnershipPct: 10,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 12,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'searchlight',
    name: 'Searchlight Pictures',
    ticker: 'SLGT',
    industry: 'Independent Cinema',
    ceo: 'Matthew Greenfield',
    logo: '🔎',
    sharePrice: 28.6,
    prevPrice: 27.9,
    changePct: 2.5,
    marketCap: 2600000000,
    sharesOutstanding: 91000000,
    revenue: 800000000,
    profit: 90000000,
    debt: 300000000,
    growthRate: 5.2,
    investorConfidence: 74,
    ceoRating: 82,
    newsSentiment: 28,
    volatility: 'Moderate',
    rating: 'BBB+',
    dividendYieldPct: 0.8,
    history: 'Awards-season specialists with 4 Best Picture wins.',
    movies: ['The Banshees Follow-Up', 'Nomadland Director Next'],
    series: [],
    upcomingProjects: ['Untitled Awards Contender'],
    news: ['Three films on this year\'s Best Picture longlist.'],
    chartData: [25.9, 26.4, 26.2, 27.1, 27.4, 27.9, 28.6],
    status: 'Public',
    institutionalOwnershipPct: 61,
    insiderOwnershipPct: 12,
    publicOwnershipPct: 27,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 9,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'applefilms',
    name: 'Apple Original Films',
    ticker: 'APLF',
    industry: 'Streaming Giant',
    ceo: 'Matt Dentler',
    logo: '🍎',
    sharePrice: 214.5,
    prevPrice: 209.8,
    changePct: 2.2,
    marketCap: 3200000000000,
    sharesOutstanding: 14920000000,
    revenue: 380000000000,
    profit: 96000000000,
    debt: 98000000000,
    growthRate: 7.4,
    investorConfidence: 94,
    ceoRating: 90,
    newsSentiment: 35,
    volatility: 'Low',
    rating: 'AAA',
    dividendYieldPct: 0.5,
    history: 'Bottomless budgets, A-list bidding wars, awards bait.',
    movies: ['Killers of the Flower Moon Follow-Up'],
    series: [],
    upcomingProjects: ['$200M Sci-Fi Epic Deal'],
    news: ['Signs first-look deal with A-list director for 3 pictures.'],
    chartData: [198, 202, 204, 206, 207, 209.8, 214.5],
    status: 'Public',
    institutionalOwnershipPct: 80,
    insiderOwnershipPct: 2,
    publicOwnershipPct: 18,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 12,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll Studios',
    ticker: 'CRNY',
    industry: 'Entertainment & Gaming',
    ceo: 'Rahul Purini',
    logo: '🍥',
    sharePrice: 33.2,
    prevPrice: 31.4,
    changePct: 5.7,
    marketCap: 7800000000,
    sharesOutstanding: 235000000,
    revenue: 1900000000,
    profit: 210000000,
    debt: 400000000,
    growthRate: 18.4,
    investorConfidence: 80,
    ceoRating: 79,
    newsSentiment: 32,
    volatility: 'High',
    rating: 'A-',
    dividendYieldPct: 0.0,
    history: 'Anime distribution giant moving into original production.',
    movies: ['Demon Slayer: Infinity Trilogy'],
    series: [],
    upcomingProjects: ['Original Anime Slate x6'],
    news: ['Anime box office share triples in 3 years.'],
    chartData: [27.4, 28.6, 28.9, 30.1, 30.4, 31.4, 33.2],
    status: 'Public',
    institutionalOwnershipPct: 70,
    insiderOwnershipPct: 7,
    publicOwnershipPct: 23,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 9,
    playerBoardMember: false,
    isFilmStudio: true,
  },
  {
    id: 'neon',
    name: 'NEON Films',
    ticker: 'NEON',
    industry: 'Independent Cinema',
    ceo: 'Tom Quinn',
    logo: '🌕',
    sharePrice: 12.1,
    prevPrice: 11.2,
    changePct: 8.0,
    marketCap: 730000000,
    sharesOutstanding: 60000000,
    revenue: 210000000,
    profit: 24000000,
    debt: 60000000,
    growthRate: 21.5,
    investorConfidence: 72,
    ceoRating: 81,
    newsSentiment: 38,
    volatility: 'High',
    rating: 'B+',
    dividendYieldPct: 0.0,
    history: 'Indie upstart that keeps winning Oscars on shoestring budgets.',
    movies: ['Parasite Director Next', 'Body Horror Breakout'],
    series: [],
    upcomingProjects: ['Festival Acquisition War Chest'],
    news: ['Wins heated bidding war at Sundance — $17M.'],
    chartData: [9.1, 9.8, 9.6, 10.4, 10.8, 11.2, 12.1],
    status: 'Public',
    institutionalOwnershipPct: 48,
    insiderOwnershipPct: 22,
    publicOwnershipPct: 30,
    playerSharesOwned: 0,
    playerAvgBuyPrice: 0,
    boardSeatsTotal: 7,
    playerBoardMember: false,
    isFilmStudio: true,
  },
];

// INITIAL GROUNDED CRYPTO LIST
const INITIAL_CRYPTO: CryptoCoin[] = [
  {
    id: 'c_hollywood',
    name: 'HollywoodCoin',
    symbol: '$HOLLYWOOD',
    price: 14.5,
    prevPrice: 12.8,
    change24h: 13.28,
    change7d: 28.4,
    marketCap: 850000000,
    circulatingSupply: 58620000,
    volume24h: 42000000,
    popularity: 92,
    communityStrength: 88,
    volatility: 'Moderate',
    sector: 'Entertainment Utility',
    risk: 'Medium',
    techDescription: 'The primary reserve cryptocurrency powering studio financing, box office ticketing and VIP Hollywood events.',
    sparkline: [11.2, 11.8, 12.1, 13.0, 12.8, 13.9, 14.5],
    news: 'Major studio announces film financing integration with $HOLLYWOOD.',
    status: 'TopLeader',
    playerHoldings: 0,
    playerAvgBuyPrice: 0,
  },
  {
    id: 'c_gossip',
    name: 'Paparazzi Gossip',
    symbol: '$GOSSIP',
    price: 0.45,
    prevPrice: 0.52,
    change24h: -13.46,
    change7d: -32.1,
    marketCap: 45000000,
    circulatingSupply: 100000000,
    volume24h: 18500000,
    popularity: 85,
    communityStrength: 72,
    volatility: 'Extreme Degen',
    sector: 'Meme & Gossip',
    risk: 'Extreme Degen',
    techDescription: 'Decentralized celebrity rumor prediction market coin driven by paparazzi scoops and viral news.',
    sparkline: [0.82, 0.75, 0.68, 0.55, 0.58, 0.52, 0.45],
    news: 'Top celebrity scandal leaks trigger $18M volume surge on $GOSSIP.',
    status: 'Active',
    playerHoldings: 0,
    playerAvgBuyPrice: 0,
  },
  {
    id: 'c_aifilm',
    name: 'AI Cinema Token',
    symbol: '$AIFILM',
    price: 8.2,
    prevPrice: 7.1,
    change24h: 15.49,
    change7d: 42.0,
    marketCap: 320000000,
    circulatingSupply: 39020000,
    volume24h: 31000000,
    popularity: 89,
    communityStrength: 90,
    volatility: 'High',
    sector: 'AI Compute & VFX',
    risk: 'Medium',
    techDescription: 'GPU compute utility token used to render AI video effects and automated voice dubbing for studios.',
    sparkline: [5.2, 5.8, 6.4, 7.0, 6.8, 7.1, 8.2],
    news: 'VFX Guild partnership grants compute credits for $AIFILM stakers.',
    status: 'TopLeader',
    playerHoldings: 0,
    playerAvgBuyPrice: 0,
  },
  {
    id: 'c_studio',
    name: 'Studio Decentralized',
    symbol: '$STUDIO',
    price: 3.1,
    prevPrice: 3.0,
    change24h: 3.33,
    change7d: 8.5,
    marketCap: 180000000,
    circulatingSupply: 58064000,
    volume24h: 12000000,
    popularity: 78,
    communityStrength: 82,
    volatility: 'Moderate',
    sector: 'Film DAO Financing',
    risk: 'Low',
    techDescription: 'DAO governance coin allowing token holders to vote on indie script greenlights and profit distribution.',
    sparkline: [2.7, 2.8, 2.9, 3.0, 2.95, 3.0, 3.1],
    news: '$STUDIO DAO greenlights $12M sci-fi thriller starring A-list cast.',
    status: 'Active',
    playerHoldings: 0,
    playerAvgBuyPrice: 0,
  },
  {
    id: 'c_oscar',
    name: 'Oscar Gold',
    symbol: '$OSCAR',
    price: 25.0,
    prevPrice: 22.5,
    change24h: 11.11,
    change7d: 22.0,
    marketCap: 500000000,
    circulatingSupply: 20000000,
    volume24h: 28000000,
    popularity: 91,
    communityStrength: 85,
    volatility: 'High',
    sector: 'Award Season Speculation',
    risk: 'High',
    techDescription: 'Prestige token backing award ceremony prediction pools and red carpet VIP gala access.',
    sparkline: [18.0, 19.5, 20.0, 21.5, 22.0, 22.5, 25.0],
    news: 'Award season predictions launch driving record TV viewership & token volume.',
    status: 'Active',
    playerHoldings: 0,
    playerAvgBuyPrice: 0,
  },
];

// INITIAL IPOS
const INITIAL_IPOS: IpoCompany[] = [
  {
    id: 'ipo_cybervision',
    companyName: 'ProPredict Analytics Studios',
    ticker: 'PPRD',
    industry: 'Predictive Analytics & Forecasting',
    ipoPrice: 18.0,
    sharesOffered: 25000000,
    initialMarketCap: 450000000,
    investorInterest: 92,
    riskRating: 'Moderate',
    growthRating: 'Hyper Growth',
    companyFundamentals: {
      revenue: 85000000,
      profit: 12000000,
      debt: 15000000,
    },
    weeksUntilLaunch: 2,
    status: 'Upcoming',
    description: 'Generative AI platform specialized in 3D visual effects, digital actor de-aging, and virtual sets.',
  },
  {
    id: 'ipo_gigagaming',
    companyName: 'GigaGaming Interactive',
    ticker: 'GIGA',
    industry: 'Gaming & ESports',
    ipoPrice: 32.5,
    sharesOffered: 40000000,
    initialMarketCap: 1300000000,
    investorInterest: 84,
    riskRating: 'Low',
    growthRating: 'High Growth',
    companyFundamentals: {
      revenue: 340000000,
      profit: 48000000,
      debt: 65000000,
    },
    weeksUntilLaunch: 1,
    status: 'Upcoming',
    description: 'AAA gaming studio producing cinematic story games adapted from blockbuster movie franchises.',
  },
  {
    id: 'ipo_apexenergy',
    companyName: 'Apex Studio Renewables',
    ticker: 'APEX',
    industry: 'Energy & Infrastructure',
    ipoPrice: 22.0,
    sharesOffered: 50000000,
    initialMarketCap: 1100000000,
    investorInterest: 75,
    riskRating: 'Low',
    growthRating: 'Stable',
    companyFundamentals: {
      revenue: 520000000,
      profit: 72000000,
      debt: 180000000,
    },
    weeksUntilLaunch: 3,
    status: 'Upcoming',
    description: 'Clean solar & battery microgrid developer supplying 100% green energy to Hollywood film soundstages.',
  },
];

// INITIAL WHALES
const INITIAL_WHALES: NpcWhale[] = [
  {
    id: 'w_spilberg',
    name: 'Satoshi Spielberg',
    handle: '@SatoshiSpielberg',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
    capital: 450000000,
    strategy: 'Value Investor',
    winRatePct: 88,
    totalProfit: 125000000,
    topPositions: ['DIS', 'NFLX', '$HOLLYWOOD'],
    copyTradeActive: false,
    copyTradeFeePct: 2.5,
  },
  {
    id: 'w_dicaprio',
    name: 'Whale DiCaprio',
    handle: '@WhaleDiCaprio',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop',
    capital: 280000000,
    strategy: 'Crypto Degen',
    winRatePct: 76,
    totalProfit: 84000000,
    topPositions: ['$GOSSIP', '$AIFILM', 'A24'],
    copyTradeActive: false,
    copyTradeFeePct: 3.0,
  },
  {
    id: 'w_blackrock',
    name: 'BlackRock Hollywood Fund',
    handle: '@BlackRockCinema',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop',
    capital: 2500000000,
    strategy: 'Growth Tech',
    winRatePct: 92,
    totalProfit: 680000000,
    topPositions: ['NVDA', 'SONY', 'NFLX'],
    copyTradeActive: false,
    copyTradeFeePct: 1.5,
  },
];

/** Generate the remaining whale roster procedurally (47 total: 3 curated + 44 generated) */
const WHALE_NAMES_A = ['Dmitri', 'Ingrid', 'Rajesh', 'Camille', 'Stefan', 'Yuki', 'Baptiste', 'Olga', 'Kwame', 'Priya', 'Lars', 'Fatima', 'Viktor', 'Renata', 'Dario', 'Sanne', 'Tariq', 'Mei', 'Jonas', 'Alba', 'Ferran', 'Zofia', 'Idris', 'Nadia', 'Cato', 'Lucia', 'Emre', 'Solveig', 'Amadou', 'Bianca', 'Ravi', 'Kirsten', 'Mateo', 'Anouk', 'Farid', 'Delia', 'Bruno', 'Esme', 'Kiran', 'Petra', 'Silas', 'Vera', 'Omar', 'Talia', 'Nils', 'Rosa'];
const WHALE_NAMES_B = ['Kovac', 'Lindqvist', 'Mehta', 'Beaumont', 'Novak', 'Tanaka', 'Laurent', 'Petrov', 'Mensah', 'Rao', 'Berg', 'Al-Rashid', 'Degen', 'Costa', 'Hoffman', 'Visser', 'Aziz', 'Chen', 'Weber', 'Marin', 'Sato', 'Kowalski', 'Bakker', 'Sokolov', 'Yilmaz', 'Nielsen', 'Diallo', 'Moretti', 'Okafor', 'Nakamura', 'Petit', 'Larsen', 'Silva', 'de Vries', 'Haddad', 'Rossi', 'Fischer', 'Dubois', 'Sharma', 'Horak', 'Jansen', 'Marchetti', 'Diop', 'Fontaine', 'Andersen', 'Vargas'];
const WHALE_STRATS: NpcWhale['strategy'][] = ['Value Investor', 'Growth Tech', 'Crypto Degen', 'Momentum', 'Distressed Assets'];
const WHALE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop',
];
// Deterministic-seeded so the roster is stable across loads
function buildWhaleRoster(): NpcWhale[] {
  let seed = 20260816;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) | 0; return Math.abs(seed) / 2147483647; };
  const roster: NpcWhale[] = [...INITIAL_WHALES];
  for (let i = 0; i < 44; i++) {
    const name = `${WHALE_NAMES_A[i]} ${WHALE_NAMES_B[i]}`;
    const capital = Math.floor(20000000 + rnd() * 900000000);
    // top positions from the real coin pool + stocks
    const coinPicks = ['$HOLLYWOOD', '$AIFILM', '$OSCAR', '$RED', '$STUDIO', '$BOX', '$GOSSIP', '$SCRIPT'];
    const stockPicks = ['DIS', 'NFLX', 'AAPL', 'SONY', 'A24', 'UVX'];
    const top: string[] = [];
    const nPos = 2 + Math.floor(rnd() * 2);
    for (let p = 0; p < nPos; p++) top.push(rnd() < 0.5 ? coinPicks[Math.floor(rnd() * coinPicks.length)] : stockPicks[Math.floor(rnd() * stockPicks.length)]);
    roster.push({
      id: `w_gen_${i}`,
      name,
      handle: `@${WHALE_NAMES_A[i]}${WHALE_NAMES_B[i]}`,
      avatar: WHALE_AVATARS[i % WHALE_AVATARS.length],
      capital,
      strategy: WHALE_STRATS[Math.floor(rnd() * WHALE_STRATS.length)],
      winRatePct: 48 + Math.floor(rnd() * 45),
      totalProfit: Math.floor(capital * (rnd() * 1.8)),
      topPositions: [...new Set(top)],
      copyTradeActive: false,
      copyTradeFeePct: Math.round((1 + rnd() * 3.5) * 10) / 10,
    });
  }
  return roster;
}
const FULL_WHALE_ROSTER = buildWhaleRoster();

// ============================================================
// ENDLESS COIN GENERATOR — real-market style. Hundreds of
// possible names/symbols; coins list with real market caps,
// drift with regime + events, and can be delisted for dying.
// ============================================================
const COIN_NAME_A = ['Star', 'Neon', 'Velvet', 'Lunar', 'Apex', 'Nova', 'Golden', 'Silver', 'Echo', 'Prime', 'Hyper', 'Crimson', 'Astro', 'Metro', 'Pulse', 'Zenith', 'Orbit', 'Rogue', 'Titan', 'Mirage', 'Sable', 'Vertex', 'Halo', 'Crown', 'Marquee', 'Reel', 'Spotlight', 'Backlot', 'Casting', 'Premiere', 'Sundance', 'Cannes', 'Tabloid', 'Limelight', 'Silver Screen', 'Cameo', 'Encore'];
const COIN_NAME_B = ['Coin', 'Token', 'Chain', 'DAO', 'Pay', 'Verse', 'Link', 'Fi', 'Cash', 'Swap', 'Labs', 'Protocol', 'Stake', 'Inu', 'Dust', 'Vault', 'Ledger', 'Guild'];
const COIN_SECTORS: Array<{ sector: string; icon: string; risk: CryptoCoin['risk']; vol: VolatilityRating; desc: string[] }> = [
  { sector: 'Entertainment Utility', icon: '🎬', risk: 'Medium', vol: 'Moderate', desc: ['Powers studio financing rails and box-office settlement.', 'Utility rail for ticketing, premieres and VIP experiences.'] },
  { sector: 'Meme & Gossip', icon: '🎲', risk: 'Extreme Degen', vol: 'Extreme Degen', desc: ['Pure degen meme coin driven by paparazzi cycles.', 'Community rumor market with zero fundamentals and pure vibes.'] },
  { sector: 'AI Compute & VFX', icon: '🤖', risk: 'High', vol: 'High', desc: ['GPU compute credits for AI rendering and de-aging VFX.', 'Decentralized render farm token for streaming pipelines.'] },
  { sector: 'Film DAO Financing', icon: '🎥', risk: 'Medium', vol: 'Moderate', desc: ['DAO governance over indie script greenlights and profit splits.', 'Treasury coin funding mid-budget features via community vote.'] },
  { sector: 'Event Access', icon: '🎪', risk: 'High', vol: 'High', desc: ['Backstage passes, festival queues and red-carpet NFT gates.', 'VIP access token for premieres and award-season events.'] },
  { sector: 'Payment & Ticketing', icon: '🎟️', risk: 'Low', vol: 'Low', desc: ['Theater-chain payment rail with staking rebates on tickets.', 'Global cinema loyalty and settlement network.'] },
  { sector: 'Talent Discovery', icon: '🦈', risk: 'High', vol: 'High', desc: ['Scouting marketplace where holders back unsigned talent.', 'Reputation stakes for casting-call verdicts.'] },
  { sector: 'Streaming Rights', icon: '📺', risk: 'Medium', vol: 'Moderate', desc: ['Fractional streaming licensing and residual distribution.', 'Rights vault coin paying weekly residual yield.'] },
  { sector: 'Celebrity Fan Token', icon: '👑', risk: 'High', vol: 'High', desc: ['Official fan-governance token with meet-and-greet lotteries.', 'Fan club currency for merch drops and polls.'] },
  { sector: 'Real Estate & Studios', icon: '🏢', risk: 'Low', vol: 'Low', desc: ['Fractional soundstage ownership with rental yield.', 'Tokenized LA studio lots paying weekly rent.'] },
];

const coinTicker = (name: string): string => {
  const words = name.replace(/[^a-zA-Z ]/g, '').split(' ').filter(Boolean);
  if (words.length >= 2) {
    const t = (words[0].slice(0, 2) + words[1].slice(0, 2)).toUpperCase();
    return t.length >= 3 ? t.slice(0, 4) : `${t}X`;
  }
  return `${words[0].slice(0, 3).toUpperCase()}X`;
};

/** Generate one fully-formed coin. Market cap between minCap..maxCap (log scale). */
const generateCoin = (usedSymbols: Set<string>, minCap: number, maxCap: number, week: number, year: number): CryptoCoin => {
  let name = '';
  let symbol = '';
  let tries = 0;
  do {
    const a = COIN_NAME_A[Math.floor(Math.random() * COIN_NAME_A.length)];
    const b = COIN_NAME_B[Math.floor(Math.random() * COIN_NAME_B.length)];
    name = `${a} ${b}`;
    symbol = `$${coinTicker(name)}${Math.random() < 0.3 ? Math.floor(Math.random() * 90 + 10) : ''}`;
    tries++;
  } while ((usedSymbols.has(symbol) || symbol.length > 6) && tries < 80);
  usedSymbols.add(symbol);

  const sec = COIN_SECTORS[Math.floor(Math.random() * COIN_SECTORS.length)];
  // log-uniform market cap
  const t = Math.random();
  const marketCap = Math.round(minCap * Math.pow(maxCap / minCap, t));
  const price = Math.max(
    0.0001,
    Math.round((marketCap / (50000000 + Math.random() * 150000000)) * (marketCap < 20000000 ? 0.001 + Math.random() * 0.9 : 0.5 + Math.random() * 30) * 10000) / 10000
  );
  const supply = Math.max(1000000, Math.round(marketCap / Math.max(0.0001, price)));
  const riskRoll = Math.random();
  const risk = sec.risk === 'Extreme Degen' ? 'Extreme Degen' : riskRoll < 0.5 ? sec.risk : riskRoll < 0.8 ? 'High' : 'Extreme Degen';

  return {
    id: `coin_gen_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    symbol,
    price,
    prevPrice: price,
    change24h: 0,
    change7d: 0,
    marketCap,
    circulatingSupply: supply,
    volume24h: Math.round(marketCap * (0.05 + Math.random() * 0.25)),
    popularity: 30 + Math.floor(Math.random() * 55),
    communityStrength: 35 + Math.floor(Math.random() * 55),
    volatility: risk === 'Extreme Degen' ? 'Extreme Degen' : risk === 'High' ? 'High' : sec.vol,
    sector: sec.sector,
    risk,
    techDescription: sec.desc[Math.floor(Math.random() * sec.desc.length)],
    sparkline: [price],
    news: '',
    status: 'Active',
    playerHoldings: 0,
    playerAvgBuyPrice: 0,
    weeksSinceListing: 0,
    listedWeek: week,
    listedYear: year,
    delistStreak: 0,
    athPrice: price,
    icon: sec.icon,
  };
};

/** Build a fresh batch of coins (used at init top-up and weekly listings). */
const generateCoinBatch = (count: number, minCap: number, maxCap: number, existing: CryptoCoin[], week: number, year: number): CryptoCoin[] => {
  const used = new Set(existing.map((c) => c.symbol));
  const out: CryptoCoin[] = [];
  for (let i = 0; i < count; i++) out.push(generateCoin(used, minCap, maxCap, week, year));
  return out;
};

// ============================================================
// STUDIO PRODUCTION ENGINE — real slates that feed the callboard
// ============================================================
const FILM_TITLE_A = ['Midnight', 'Velvet', 'Crimson', 'Neon', 'Sable', 'Golden', 'Silent', 'Broken', 'Electric', 'Paper', 'Frozen', 'Hollow', 'Radiant', 'Wandering', 'Last', 'First', 'Wild', 'Scarlet', 'Marble', 'Distant'];
const FILM_TITLE_B = ['Hour', 'Catechism', 'Symphony', 'Confessions', 'Kingdom', 'Requiem', 'Cathedral', 'Mirage', 'Protocol', 'Lullaby', 'Highway', 'Garden', 'Detective', 'Dynasty', 'Vertigo', 'Boulevard', 'Testament', 'Cassette', 'Aurora', 'Paradox'];
const FILM_TITLE_PREFIX = ['The', 'A', 'Beyond the', 'After the', 'House of', 'Songs of', 'Chronicles of'];
const FILM_GENRES = ['Drama', 'Thriller', 'Sci-Fi', 'Horror', 'Action', 'Comedy', 'Biopic', 'Crime Epic', 'Musical', 'War Film', 'Romance', 'Fantasy'];

const genFilmTitle = (): string => {
  const roll = Math.random();
  if (roll < 0.4) return `${pickStr(FILM_TITLE_A)} ${pickStr(FILM_TITLE_B)}`;
  if (roll < 0.7) return `${pickStr(FILM_TITLE_PREFIX)} ${pickStr(FILM_TITLE_A)} ${pickStr(FILM_TITLE_B)}`;
  return `${pickStr(FILM_TITLE_A)} ${pickStr(FILM_TITLE_A)} ${pickStr(FILM_TITLE_B)}`;
};
function pickStr<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

/** Create one production for a studio slate */
export function generateProduction(id: string): StudioProduction {
  const budgetTier = Math.random();
  const budget = budgetTier < 0.35 ? 5000000 + Math.floor(Math.random() * 15000000)      // indie $5-20M
    : budgetTier < 0.75 ? 20000000 + Math.floor(Math.random() * 60000000)                 // mid $20-80M
    : 80000000 + Math.floor(Math.random() * 180000000);                                    // tentpole $80-260M
  return {
    id: `prod_${id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: genFilmTitle(),
    genre: pickStr(FILM_GENRES),
    budget,
    stage: 'DEVELOPMENT',
    weeksInStage: 0,
    stageWeeksTotal: 2 + Math.floor(Math.random() * 3), // dev 2-4 wks
  };
}

/** Seed a full slate for a film studio (2-4 productions across stages) */
function seedSlate(studioId: string): StudioProduction[] {
  const slate: StudioProduction[] = [];
  const n = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const p = generateProduction(studioId);
    // stagger stages so the pipeline feels alive from week one
    const r = Math.random();
    if (r < 0.3) { p.stage = 'CASTING'; p.weeksInStage = 0; p.stageWeeksTotal = 2 + Math.floor(Math.random() * 2); }
    else if (r < 0.55) { p.stage = 'FILMING'; p.weeksInStage = Math.floor(Math.random() * 3); p.stageWeeksTotal = 4 + Math.floor(p.budget / 20000000) + Math.floor(Math.random() * 4); }
    else if (r < 0.7) { p.stage = 'POST'; p.weeksInStage = Math.floor(Math.random() * 2); p.stageWeeksTotal = 3 + Math.floor(Math.random() * 5); }
    slate.push(p);
  }
  return slate;
}

export class MarketEngineService {
  private static state: EconomyMarketState | null = null;

  /**
   * Load or initialize the persistent market state
   */
  public static getMarketState(): EconomyMarketState {
    if (this.state) return this.state;

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: EconomyMarketState = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.stocks) && Array.isArray(parsed.cryptoCoins)) {
          this.state = {
            ...parsed,
            stocks: parsed.stocks,
            cryptoCoins: parsed.cryptoCoins,
            ipos: Array.isArray(parsed.ipos) ? parsed.ipos : INITIAL_IPOS,
            whales: parsed.whales && parsed.whales.length >= 40 ? parsed.whales : FULL_WHALE_ROSTER,
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
            news: Array.isArray(parsed.news) ? parsed.news : [],
            cryptoWire: Array.isArray((parsed as any).cryptoWire) ? (parsed as any).cryptoWire : [],
            industryStrengths: parsed.industryStrengths || {
              'Entertainment Conglomerate': 85,
              'Streaming Giant': 88,
              'Studio & Cable Media': 65,
              'Film & TV Studio': 72,
              'Entertainment & Gaming': 90,
              'Independent Cinema': 92,
              'Artificial Intelligence & Visual Tech': 98,
              'Retail & Cinema Chains': 50,
              'Gaming & ESports': 86,
              'Energy & Infrastructure': 80,
            },
          };
          // ---- LIVING MARKET MIGRATION (v3) ----
          // Top up legacy 12-coin saves into the endless pool (55 coins)
          const live = this.state.cryptoCoins.filter((c) => c.status === 'Active' || c.status === 'TopLeader');
          if (live.length < 40) {
            this.state.cryptoCoins = [
              ...this.state.cryptoCoins,
              ...generateCoinBatch(55 - live.length, 4000000, 900000000, this.state.cryptoCoins, this.state.currentWeek || 1, this.state.currentYear || 2026),
            ];
          }
          if (!this.state.cryptoRegime) {
            this.state.cryptoRegime = { type: 'NEUTRAL', weeksRemaining: 6, weeksTotal: 6, strength: 1 };
          }
          if (typeof this.state.nextCryptoListingWeek !== 'number') {
            this.state.nextCryptoListingWeek = (this.state.currentYear || 2026) * 52 + (this.state.currentWeek || 1) + 10 + Math.floor(Math.random() * 3);
          }
          if (typeof this.state.pendingCryptoGains !== 'number') this.state.pendingCryptoGains = 0;
          if (typeof this.state.pendingCryptoLosses !== 'number') this.state.pendingCryptoLosses = 0;
          // Tag legacy coins with sector icons once
          this.state.cryptoCoins.forEach((c) => {
            if (!c.icon) {
              const sec = COIN_SECTORS.find((s) => s.sector === c.sector);
              c.icon = sec ? sec.icon : '🪙';
            }
            if (typeof c.weeksSinceListing !== 'number') c.weeksSinceListing = 30 + Math.floor(Math.random() * 40);
            if (typeof c.delistStreak !== 'number') c.delistStreak = 0;
            if (typeof c.athPrice !== 'number') c.athPrice = c.price;
          });
          // ---- STUDIO MARKET MIGRATION (v4) ----
          // Legacy saves: append the new launch studios (dedup by ticker)
          const knownTickers = new Set(this.state.stocks.map((s) => s.ticker));
          for (const st of INITIAL_STOCKS) {
            if (!knownTickers.has(st.ticker)) {
              const fresh = JSON.parse(JSON.stringify(st));
              fresh.playerSharesOwned = 0;
              fresh.playerAvgBuyPrice = 0;
              fresh.playerBoardMember = false;
              this.state.stocks.push(fresh);
            }
          }
          ensureStudioSlates(this.state.stocks, this.state.currentWeek || 1, this.state.currentYear || 2026);
          if (typeof this.state.nextStudioLaunchWeek !== 'number') {
            this.state.nextStudioLaunchWeek = (this.state.currentYear || 2026) * 52 + (this.state.currentWeek || 1) + 10 + Math.floor(Math.random() * 3);
          }
          return this.state;
        }
      }
    } catch (e) {
      console.warn('Failed to parse market engine state, reinitializing default state.', e);
    }

    this.state = {
      currentWeek: 1,
      currentYear: 2026,
      cycle: 'Bull Market',
      cycleDurationWeeks: 8,
      inflationRate: 2.8,
      interestRate: 4.5,
      gdpGrowthRate: 3.2,
      investorConfidenceIndex: 82,
      industryStrengths: {
        'Entertainment Conglomerate': 85,
        'Streaming Giant': 88,
        'Studio & Cable Media': 65,
        'Film & TV Studio': 72,
        'Entertainment & Gaming': 90,
        'Independent Cinema': 92,
        'Artificial Intelligence & Visual Tech': 98,
        'Retail & Cinema Chains': 50,
        'Gaming & ESports': 86,
        'Energy & Infrastructure': 80,
      },
      stocks: INITIAL_STOCKS,
      ipos: INITIAL_IPOS,
      cryptoCoins: [
        ...INITIAL_CRYPTO,
        // Endless pool: new games launch with a full market of 55 coins
        ...generateCoinBatch(55 - INITIAL_CRYPTO.length, 4000000, 900000000, INITIAL_CRYPTO, 1, 2026),
      ],
      cryptoRegime: { type: 'BULL', weeksRemaining: 8, weeksTotal: 8, strength: 1.1 },
      cryptoWire: [],
      nextCryptoListingWeek: 2026 * 52 + 1 + 11,
      pendingCryptoGains: 0,
      pendingCryptoLosses: 0,
      nextStudioLaunchWeek: 2026 * 52 + 1 + 11,
      whales: FULL_WHALE_ROSTER,
      news: [
        {
          id: 'n_init_1',
          week: 1,
          year: 2026,
          title: 'HOLLYWOOD WALL STREET MARKET OPEN',
          body: 'Global box office surge and streaming subscriber growth propel Hollywood equities and crypto assets into a strong Bull Market.',
          category: 'MACRO',
          impact: 'BOOM',
        },
      ],
      transactions: [],
      playerCustomIposCount: 0,
      playerCustomCryptosCount: 0,
    };

    // Seed live production slates on every film studio
    ensureStudioSlates(this.state.stocks, 1, 2026);

    this.saveMarketState();
    return this.state;
  }

  /**
   * Save state to localStorage
   */
  public static saveMarketState(newState?: EconomyMarketState): void {
    if (newState) {
      this.state = newState;
    }
    if (this.state) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.error('Error persisting market engine state:', e);
      }
    }
  }

  /**
   * INVISIBLE MARKET ENGINE - CORE END WEEK PROCESSOR
   * Runs automatically every End Week (7 days).
   * ZERO fake numbers: Price updates, company fundamentals, cycle shifts, news,
   * and market developments are calculated deterministically.
   */
  public static processEndWeek(playerWeek: number, playerYear: number, playerMoney: number, playerCoinCtx?: PlayerCoinContext): {
    updatedState: EconomyMarketState;
    headlineNews: string[];
    /** Structured crypto events (listings, delists, regimes) → inbox messages */
    cryptoEvents: Array<{ kind: string; subject: string; body: string; important: boolean }>;
    /** Forced-liquidation proceeds credited to the player this week */
    delistPayouts: number;
    /** Net whale copy-trade P&L this week (real cash, applied by caller) */
    whaleCopyPnl: number;
    /** Studio casting calls → real NPC roles for the player's callboard */
    studioCastingCalls: StudioCastingCall[];
    /** Studio events (new studio listings, big releases) → inbox messages */
    studioEvents: Array<{ kind: string; subject: string; body: string; important: boolean }>;
  } {
    const s = this.getMarketState();
    s.currentWeek = playerWeek;
    s.currentYear = playerYear;

    const headlineNews: string[] = [];

    // 1. PROCESS ECONOMIC CYCLES
    s.cycleDurationWeeks -= 1;
    if (s.cycleDurationWeeks <= 0) {
      const cycles: EconomicCycle[] = [
        'Bull Market',
        'Market Correction',
        'Economic Boom',
        'Economic Slowdown',
        'Bear Market',
        'Recovery',
        'Recession',
      ];
      const nextCycleIndex = Math.floor(Math.random() * cycles.length);
      s.cycle = cycles[nextCycleIndex];
      s.cycleDurationWeeks = Math.floor(Math.random() * 8) + 6; // 6 to 14 weeks duration

      // Adjust Macro parameters based on new cycle
      if (s.cycle === 'Bull Market' || s.cycle === 'Economic Boom') {
        s.investorConfidenceIndex = Math.min(98, s.investorConfidenceIndex + 12);
        s.interestRate = Math.max(2.5, s.interestRate - 0.5);
        s.gdpGrowthRate = Math.min(5.5, s.gdpGrowthRate + 0.8);
      } else if (s.cycle === 'Bear Market' || s.cycle === 'Recession') {
        s.investorConfidenceIndex = Math.max(25, s.investorConfidenceIndex - 18);
        s.interestRate = Math.min(8.5, s.interestRate + 0.75);
        s.gdpGrowthRate = Math.max(-2.5, s.gdpGrowthRate - 1.2);
      } else {
        s.investorConfidenceIndex = 60 + Math.floor(Math.random() * 20);
      }

      const cycleNews = `ECONOMY UPDATE: Financial markets transition into a ${s.cycle.toUpperCase()} cycle. Investor confidence index at ${s.investorConfidenceIndex} pts.`;
      s.news.unshift({
        id: `news_cycle_${playerWeek}_${Date.now()}`,
        week: playerWeek,
        year: playerYear,
        title: `MARKET CYCLE SHIFT: ${s.cycle.toUpperCase()}`,
        body: cycleNews,
        category: 'MACRO',
        impact: s.cycle === 'Bull Market' || s.cycle === 'Economic Boom' ? 'BOOM' : s.cycle === 'Bear Market' || s.cycle === 'Recession' ? 'CRASH' : 'NEUTRAL',
      });
      headlineNews.push(cycleNews);
    }

    // Cycle multiplier for asset price calculations
    let cycleMultiplier = 0;
    if (s.cycle === 'Economic Boom') cycleMultiplier = 0.04;
    else if (s.cycle === 'Bull Market') cycleMultiplier = 0.025;
    else if (s.cycle === 'Recovery') cycleMultiplier = 0.015;
    else if (s.cycle === 'Market Correction') cycleMultiplier = -0.02;
    else if (s.cycle === 'Economic Slowdown') cycleMultiplier = -0.03;
    else if (s.cycle === 'Bear Market') cycleMultiplier = -0.045;
    else if (s.cycle === 'Recession') cycleMultiplier = -0.07;

    // 2. PROCESS STOCKS (GROUNDED FORMULA)
    s.stocks = s.stocks.map((stock) => {
      if (stock.status !== 'Public') return stock;

      // Quarterly Earnings update every 12 weeks
      if (playerWeek % 12 === 0) {
        const growthFactor = 1 + (stock.growthRate / 100) * 0.25;
        stock.revenue = Math.round(stock.revenue * growthFactor);
        stock.profit = Math.round(stock.profit * (growthFactor + (Math.random() * 0.04 - 0.02)));
        if (stock.profit < 0) stock.debt = Math.round(stock.debt * 1.05);
      }

      // Calculate Financial Health Score (-1.0 to +1.0)
      const profitMargin = stock.revenue > 0 ? stock.profit / stock.revenue : -0.1;
      const debtRatio = stock.marketCap > 0 ? stock.debt / stock.marketCap : 1.0;
      const healthScore = profitMargin * 2 - debtRatio * 0.3 + (stock.growthRate / 100) + (stock.ceoRating / 200) - 0.5;

      // Industry Strength modifier
      const indStrength = (s.industryStrengths[stock.industry] || 70) / 100 - 0.7;

      // News Sentiment modifier
      const newsModifier = stock.newsSentiment / 500;

      // Organic Variance
      const randomVariance = (Math.random() - 0.48) * (stock.volatility === 'Volatile' || stock.volatility === 'Extreme Degen' ? 0.08 : stock.volatility === 'High' ? 0.05 : 0.025);

      // Total Change % calculation
      const calculatedChangePct = (cycleMultiplier + healthScore * 0.02 + indStrength * 0.015 + newsModifier + randomVariance) * 100;
      const roundedChangePct = Math.round(calculatedChangePct * 100) / 100;

      const prevPrice = stock.sharePrice;
      const newPrice = Math.max(0.1, Math.round(prevPrice * (1 + roundedChangePct / 100) * 100) / 100);
      const newMarketCap = Math.round(newPrice * stock.sharesOutstanding);

      // Update Chart Data (keep last 12 weeks)
      const newChart = [...(stock.chartData || []), newPrice].slice(-12);

      // Trigger Company Events
      let eventNews: string | null = null;
      if (roundedChangePct > 7.0) {
        eventNews = `${stock.name} (${stock.ticker}) surges +${roundedChangePct}% following stellar quarterly revenue projections.`;
      } else if (roundedChangePct < -8.0) {
        eventNews = `${stock.name} (${stock.ticker}) drops ${roundedChangePct}% amid sector headwinds and market turbulence.`;
      }

      if (eventNews && Math.random() < 0.4) {
        headlineNews.push(eventNews);
        stock.news = [eventNews, ...(stock.news || [])].slice(0, 5);
      }

      return {
        ...stock,
        prevPrice,
        sharePrice: newPrice,
        changePct: roundedChangePct,
        marketCap: newMarketCap,
        chartData: newChart,
      };
    });

    // 2b. STUDIO SLATE LIFECYCLE — real productions progress weekly; casting
    //     stages ship NPC roles to the player's callboard; releases roll box
    //     office and move the studio's stock. New studios list every 10-12 wks.
    const studioCastingCalls: StudioCastingCall[] = [];
    const studioEvents: Array<{ kind: string; subject: string; body: string; important: boolean }> = [];

    s.stocks = s.stocks.map((stock) => {
      if (stock.status !== 'Public' || !stock.isFilmStudio) return stock;
      let slate = stock.slate ? [...stock.slate] : [];
      let sharePrice = stock.sharePrice;
      let changePct = stock.changePct;
      let newsSentiment = stock.newsSentiment;
      let slateHealth = stock.slateHealth ?? 60;

      slate = slate.map((prod) => {
        const p = { ...prod, weeksInStage: prod.weeksInStage + 1 };

        if (p.weeksInStage < p.stageWeeksTotal) return p;

        // ---- STAGE TRANSITION ----
        if (p.stage === 'DEVELOPMENT') {
          p.stage = 'CASTING';
          p.weeksInStage = 0;
          p.stageWeeksTotal = 2 + Math.floor(Math.random() * 2);
          headlineNews.push(`${stock.name} greenlights "${p.title}" (${p.genre}, $${(p.budget / 1000000).toFixed(0)}M) — casting opens.`);
          return p;
        }

        if (p.stage === 'CASTING') {
          p.stage = 'FILMING';
          p.weeksInStage = 0;
          p.stageWeeksTotal = 4 + Math.floor(p.budget / 25000000) + Math.floor(Math.random() * 5);
          p.castingRolesSent = 1 + Math.floor(Math.random() * 2);
          // >>> THE REAL CONNECTION: roles ship to the player's callboard <<<
          const leadRoll = Math.random();
          const roles: StudioCastingCall['role'][] = [];
          const fameTier = p.budget >= 80000000 ? 300 + Math.floor(Math.random() * 500)
            : p.budget >= 20000000 ? 80 + Math.floor(Math.random() * 250)
            : Math.floor(Math.random() * 70);
          if (leadRoll < 0.45 || p.castingRolesSent > 1) {
            roles.push({
              roleType: 'Lead',
              salary: Math.round(p.budget * (0.008 + Math.random() * 0.012)),
              requiredFameXp: fameTier,
              filmingWeeks: p.stageWeeksTotal,
            });
          }
          if (roles.length < p.castingRolesSent) {
            roles.push({
              roleType: 'Principal',
              salary: Math.round(p.budget * (0.002 + Math.random() * 0.003)),
              requiredFameXp: Math.floor(fameTier * 0.6),
              filmingWeeks: p.stageWeeksTotal,
            });
          }
          for (const r of roles) {
            studioCastingCalls.push({
              productionRef: p.id,
              title: p.title,
              genre: p.genre,
              budget: p.budget,
              studioName: stock.name,
              studioTicker: stock.ticker,
              role: r,
            });
          }
          headlineNews.push(`CALLBOARD: ${stock.name} is casting ${roles.map((r) => r.roleType).join(' + ')} for "${p.title}" — apply now.`);
          return p;
        }

        if (p.stage === 'FILMING') {
          p.stage = 'POST';
          p.weeksInStage = 0;
          p.stageWeeksTotal = 3 + Math.floor(Math.random() * 5);
          return p;
        }

        if (p.stage === 'POST') {
          // RELEASE: roll real box office from budget + slate health + luck
          p.stage = 'RELEASED';
          p.weeksInStage = 0;
          p.releasedWeek = playerWeek;
          p.releasedYear = playerYear;
          const luck = Math.random();
          const healthBoost = (slateHealth - 50) / 220; // -0.23..+0.23
          const mult = Math.max(0.15, 0.9 + healthBoost + (luck < 0.12 ? 2.2 + Math.random() * 1.6 : luck < 0.5 ? 0.4 + Math.random() * 0.8 : -0.35 + Math.random() * 0.55));
          p.gross = Math.round(p.budget * mult);
          p.wasHit = p.gross >= p.budget * 2;

          // Stock reacts for real
          const stockMove = p.wasHit ? 3 + Math.random() * 6 : p.gross >= p.budget * 1.2 ? 1 + Math.random() * 2 : -(1.5 + Math.random() * 5);
          sharePrice = Math.max(0.5, Math.round(sharePrice * (1 + stockMove / 100) * 100) / 100);
          changePct = Math.round((changePct + stockMove) * 100) / 100;
          newsSentiment = Math.max(-100, Math.min(100, newsSentiment + (p.wasHit ? 15 : p.gross < p.budget * 0.8 ? -18 : 3)));
          slateHealth = Math.max(5, Math.min(100, slateHealth + (p.wasHit ? 7 : p.gross < p.budget * 0.8 ? -8 : 1)));

          const verdict = p.wasHit ? 'HIT' : p.gross >= p.budget * 1.2 ? 'SOLID' : p.gross >= p.budget * 0.8 ? 'SOFT' : 'FLOP';
          const relNews = `${stock.name}'s "${p.title}" opens to $${(p.gross / 1000000).toFixed(1)}M worldwide — ${verdict}! ${stock.ticker} ${stockMove >= 0 ? '+' : ''}${stockMove.toFixed(1)}%.`;
          headlineNews.push(relNews);
          stock.news = [relNews, ...(stock.news || [])].slice(0, 5);
          return p;
        }
        return p; // RELEASED stays archived
      });

      // Greenlight new developments to keep the pipeline alive (2-4 active)
      const active = slate.filter((p) => p.stage !== 'RELEASED').length;
      if (active < 2 || (active < 4 && Math.random() < 0.35 * (slateHealth / 70))) {
        slate.push(generateProduction(stock.id));
      }
      // Archive trim: keep last 4 released
      const released = slate.filter((p) => p.stage === 'RELEASED');
      if (released.length > 4) {
        const drop = new Set(released.slice(0, released.length - 4).map((p) => p.id));
        slate = slate.filter((p) => !drop.has(p.id));
      }

      return {
        ...stock,
        slate,
        slateHealth,
        sharePrice,
        changePct,
        newsSentiment,
        marketCap: Math.round(sharePrice * stock.sharesOutstanding),
      };
    });

    // 2c. NEW STUDIO LAUNCH — every 10-12 weeks a new studio lists directly
    if (typeof s.nextStudioLaunchWeek !== 'number') {
      s.nextStudioLaunchWeek = playerYear * 52 + playerWeek + 10 + Math.floor(Math.random() * 3);
    }
    if (playerYear * 52 + playerWeek >= s.nextStudioLaunchWeek) {
      const fresh = generateEndlessStudio(new Set(s.stocks.map((x) => x.ticker))) as StockCompany;
      // normalize to the full StockCompany shape: generator returns a
      // single news string + omits player position fields (crash source)
      fresh.news = Array.isArray(fresh.news) ? fresh.news : [String(fresh.news)];
      fresh.playerSharesOwned = 0;
      fresh.playerAvgBuyPrice = 0;
      fresh.playerBoardMember = false;
      fresh.isFilmStudio = true;
      fresh.slate = seedSlate(fresh.id);
      fresh.slateHealth = 55 + Math.floor(Math.random() * 25);
      fresh.listedWeek = playerWeek;
      fresh.listedYear = playerYear;
      fresh.weeksSinceListing = 0;
      s.stocks.unshift(fresh);
      const capM = (fresh.marketCap / 1000000).toFixed(0);
      headlineNews.push(`NEW STUDIO LISTING: ${fresh.name} (${fresh.ticker}) lists on Wall Street West at $${fresh.sharePrice} — $${capM}M cap, slate already in production.`);
      studioEvents.push({
        kind: 'STUDIO_LISTING',
        subject: `🏛️ NEW STUDIO LISTED: ${fresh.name} (${fresh.ticker})`,
        body: `A new studio just listed on Wall Street West.\n\n• ${fresh.name} (${fresh.ticker})\n• Industry: ${fresh.industry}\n• Share price: $${fresh.sharePrice}\n• Market cap: $${capM}M\n• CEO: ${fresh.ceo}\n\n${fresh.history}\n\nThe studio already has ${fresh.slate.length} productions in its pipeline — its casting calls will appear on your Callboard. Shares are tradable now.`,
        important: false,
      });
      s.nextStudioLaunchWeek = playerYear * 52 + playerWeek + 10 + Math.floor(Math.random() * 3);
    }

    // 3. PROCESS CRYPTOCURRENCY MARKET — LIVING MARKET EDITION
    //    Regime cycles (bull/bear/pump/crash), per-coin events (pumps, dumps,
    //    hacks, partnerships), delist votes, and ATH tracking. Everything
    //    drifts — nothing is static.
    const cryptoEvents: Array<{ kind: string; subject: string; body: string; important: boolean }> = [];
    const wire: CryptoWireEvent[] = s.cryptoWire || [];
    const pushWire = (e: Omit<CryptoWireEvent, 'id' | 'week' | 'year'>) => {
      wire.unshift({ ...e, id: `wire_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, week: playerWeek, year: playerYear });
    };
    if (wire.length > 60) wire.length = 60;

    // ---- 3a. REGIME LIFECYCLE ----
    if (!s.cryptoRegime) s.cryptoRegime = { type: 'NEUTRAL', weeksRemaining: 6, weeksTotal: 6, strength: 1 };
    s.cryptoRegime.weeksRemaining -= 1;
    if (s.cryptoRegime.weeksRemaining <= 0) {
      const roll = Math.random();
      const nextType: CryptoRegime['type'] =
        roll < 0.32 ? 'NEUTRAL'
        : roll < 0.57 ? 'BULL'
        : roll < 0.72 ? 'BEAR'
        : roll < 0.82 ? 'PUMP'
        : roll < 0.87 ? 'CRASH'
        : 'RECOVERY';
      const short = nextType === 'PUMP' || nextType === 'CRASH';
      s.cryptoRegime = {
        type: nextType,
        weeksRemaining: short ? 2 + Math.floor(Math.random() * 4) : 7 + Math.floor(Math.random() * 10),
        weeksTotal: 0,
        strength: 0.6 + Math.random() * 0.9,
      };
      s.cryptoRegime.weeksTotal = s.cryptoRegime.weeksRemaining;
      const labels: Record<CryptoRegime['type'], string> = {
        NEUTRAL: 'Markets cool off — sideways chop ahead',
        BULL: '🐂 BULL RUN begins — capital floods into crypto',
        BEAR: '🐻 BEAR MARKET begins — risk-off across the board',
        PUMP: '🚀 PUMP CYCLE detected — degens ape everything',
        CRASH: '💥 MARKET CRASH — liquidations cascade',
        RECOVERY: '🌱 RECOVERY phase — accumulation resumes',
      };
      pushWire({ kind: 'REGIME', title: labels[nextType], sub: `Regime shift · est. ${s.cryptoRegime.weeksTotal} weeks · strength ${(s.cryptoRegime.strength * 100).toFixed(0)}%` });
      headlineNews.push(`CRYPTO MARKET: ${labels[nextType]} (est. ${s.cryptoRegime.weeksTotal} weeks).`);
      cryptoEvents.push({
        kind: 'REGIME',
        subject: `STAR EXCHANGE MARKET ALERT: ${labels[nextType]}`,
        body: `The Star Exchange regime has shifted.\n\nNew regime: ${nextType} · expected duration ~${s.cryptoRegime.weeksTotal} weeks · intensity ${(s.cryptoRegime.strength * 100).toFixed(0)}%.\n\n${
          nextType === 'BULL' ? 'Historically, coins drift upward 1-4% weekly in bull regimes — but so do corrections.'
          : nextType === 'BEAR' ? 'Expect broad downward drift. Cash is a position — and so is buying the fear.'
          : nextType === 'PUMP' ? 'Short violent cycles. Meme and degen coins can rip 30-120% — and dump just as fast.'
          : nextType === 'CRASH' ? 'Everything bleeds this week. Only the strongest communities hold support.'
          : nextType === 'RECOVERY' ? 'Smart money re-enters. Quality coins bottom first.'
          : 'Choppy, range-bound price action. Slow grind both ways.'
        }`,
        important: nextType === 'CRASH' || nextType === 'PUMP',
      });
    }

    // Regime → average weekly drift per coin (%)
    const regime = s.cryptoRegime;
    const regimeDrift: Record<CryptoRegime['type'], number> = {
      NEUTRAL: 0.1,
      BULL: 1.8 * regime.strength,
      BEAR: -1.9 * regime.strength,
      PUMP: 5.5 * regime.strength,
      CRASH: -6.5 * regime.strength,
      RECOVERY: 2.4 * regime.strength,
    };
    const baseDrift = regimeDrift[regime.type];

    // Pumps concentrate on a few lucky coins
    const pumpWinners = new Set<string>();
    if (regime.type === 'PUMP') {
      const degenCoins = s.cryptoCoins.filter((c) => (c.status === 'Active' || c.status === 'TopLeader') && (c.risk === 'Extreme Degen' || c.risk === 'High'));
      const n = Math.min(degenCoins.length, 3 + Math.floor(Math.random() * 4));
      for (let i = 0; i < n; i++) pumpWinners.add(degenCoins[Math.floor(Math.random() * degenCoins.length)]?.id);
    }

    s.cryptoCoins = s.cryptoCoins.map((coin) => {
      if (coin.status !== 'Active' && coin.status !== 'TopLeader') return coin;

      // ---- per-coin movement ----
      const vol = coin.volatility === 'Extreme Degen' ? 0.16 : coin.volatility === 'High' ? 0.09 : coin.volatility === 'Moderate' ? 0.05 : 0.03;
      const communityMod = (coin.communityStrength - 50) / 1800;
      let changePct = baseDrift * (coin.risk === 'Extreme Degen' ? 1.6 : coin.risk === 'High' ? 1.25 : coin.risk === 'Medium' ? 1 : 0.75)
        + communityMod * 100 * 0.5
        + (Math.random() - 0.49) * vol * 100;
      if (pumpWinners.has(coin.id)) changePct += 25 + Math.random() * 85;

      // ---- PLAYER FAN TOKEN: career-driven price discovery ----
      // The coin's own charter: "Price fluctuates with career fame and movie
      // box office hits." Real weekly career state moves it — fame momentum,
      // box office outcomes and fanbase scale all price in, and celebrity
      // tokens overheat extra in BULL/PUMP manias.
      let buzzWeeksLeft = coin.buzzWeeksLeft || 0;
      let buzzNote = '';
      if (coin.isMyCoin && playerCoinCtx) {
        const famePull = Math.max(-12, Math.min(12, playerCoinCtx.fameDeltaPct * 0.45));
        const releasePull = Math.max(-26, Math.min(26, playerCoinCtx.lastReleasePerformance * 26));
        const fanPull = Math.min(6, playerCoinCtx.fanCount / 60000);
        changePct += famePull + releasePull + fanPull;
        if (regime.type === 'BULL' || regime.type === 'PUMP') changePct *= 1.25;
        // fame bleeding out → holders lose faith faster than the market
        if (playerCoinCtx.fameDeltaPct < -8) changePct -= 4;
        // airdrop buzz: decaying weekly tailwind while claim volume runs hot
        if (buzzWeeksLeft > 0) {
          const buzzPower = Math.min(18, 5 + ((coin.airdropHolders || 0) / Math.max(1, coin.circulatingSupply)) * 60) * (buzzWeeksLeft / 3);
          changePct += buzzPower;
          buzzNote = buzzWeeksLeft === 3
            ? `$${coin.symbol} airdrop claims running hot — new holders pile in!`
            : `$${coin.symbol} airdrop buzz still lifting volume.`;
          if (buzzNote) {
            coin.news = buzzNote;
            headlineNews.push(`CRYPTO: ${buzzNote}`);
          }
          buzzWeeksLeft -= 1;
        }
        // consecutive weekly decay of the airdrop streak (fatigue resets slowly)
        if (buzzWeeksLeft === 0 && (coin.airdropStreak || 0) > 0 && Math.random() < 0.25) {
          coin.airdropStreak = Math.max(0, (coin.airdropStreak || 0) - 1);
        }
      }

      // ---- coin events (4% weekly per coin) ----
      let eventLabel = '';
      if (Math.random() < 0.04) {
        const evRoll = Math.random();
        if (evRoll < 0.3) { changePct += 18 + Math.random() * 35; eventLabel = 'major partnership announced'; }
        else if (evRoll < 0.55) { changePct -= 18 + Math.random() * 30; eventLabel = 'whale dump detected'; }
        else if (evRoll < 0.72) { changePct += 35 + Math.random() * 70; eventLabel = 'viral celebrity endorsement'; }
        else if (evRoll < 0.86) { changePct -= 30 + Math.random() * 45; eventLabel = 'smart contract exploit'; }
        else { changePct -= 50 + Math.random() * 50; eventLabel = 'RUG PULL ATTEMPT — team wallets moving'; }
      }

      changePct = Math.round(changePct * 100) / 100;
      const prevPrice = coin.price;
      const newPrice = Math.max(0.000001, Math.round(prevPrice * (1 + changePct / 100) * 1000000) / 1000000);
      const newMarketCap = Math.round(newPrice * coin.circulatingSupply);
      const newSparkline = [...(coin.sparkline || []), newPrice].slice(-12);
      const newATH = Math.max(coin.athPrice || newPrice, newPrice);

      // volume + community drift with regime
      const volMult = regime.type === 'PUMP' || regime.type === 'CRASH' ? 1.8 : regime.type === 'BEAR' ? 0.6 : 1;
      const newVolume = Math.max(1000, Math.round(coin.volume24h * (0.85 + Math.random() * 0.3) * volMult * (1 + changePct / 200)));
      const newCommunity = Math.max(5, Math.min(100, Math.round(coin.communityStrength + (changePct > 8 ? 2 : changePct < -8 ? -2 : 0) + (Math.random() - 0.5))));
      const newPopularity = Math.max(5, Math.min(100, Math.round(coin.popularity + (Math.abs(changePct) > 20 ? 4 : 0) + (Math.random() - 0.55))));

      if (eventLabel) {
        const eNews = `$${coin.symbol} ${eventLabel} — price ${changePct >= 0 ? 'up' : 'down'} ${Math.abs(changePct).toFixed(1)}%!`;
        coin.news = eNews;
        headlineNews.push(`CRYPTO: ${eNews}`);
        pushWire({ kind: changePct >= 0 ? 'PUMP' : 'DUMP', symbol: coin.symbol, title: `${coin.name} ${eventLabel}`, sub: `${coin.symbol} ${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}% this week` });
      } else if (Math.abs(changePct) > 18) {
        const cNews = `$${coin.symbol} ${changePct > 0 ? 'rallies' : 'crashes'} ${Math.abs(changePct).toFixed(1)}% on heavy volume.`;
        coin.news = cNews;
        headlineNews.push(`CRYPTO: ${cNews}`);
        pushWire({ kind: changePct > 0 ? 'PUMP' : 'DUMP', symbol: coin.symbol, title: `${coin.name} ${changePct > 0 ? 'rallies' : 'crashes'} ${Math.abs(changePct).toFixed(1)}%`, sub: `${coin.symbol} weekly move · regime ${regime.type}` });
      }

      // ---- delist health tracking (new coins exempt 8 weeks; player coins & leaders exempt) ----
      let delistStreak = coin.delistStreak || 0;
      let delistWarning = coin.delistWarning || false;
      const age = (coin.weeksSinceListing || 0) + 1;
      const wasFalling = (coin.change7d || 0) < -5 && changePct < 0;
      const weak = !coin.isMyCoin && coin.status !== 'TopLeader' && age > 8 && (wasFalling || newVolume < newMarketCap * 0.01);
      delistStreak = weak ? delistStreak + 1 : 0;

      return {
        ...coin,
        prevPrice,
        price: newPrice,
        change24h: changePct,
        change7d: Math.round((changePct + (coin.change7d || 0)) / 2 * 100) / 100,
        marketCap: newMarketCap,
        volume24h: newVolume,
        popularity: newPopularity,
        communityStrength: newCommunity,
        sparkline: newSparkline,
        athPrice: newATH,
        weeksSinceListing: age,
        delistStreak,
        delistWarning,
        buzzWeeksLeft: coin.isMyCoin ? buzzWeeksLeft : (coin.buzzWeeksLeft || 0),
      };
    });

    // ---- 3b. DELIST VOTES & REMOVALS ----
    const delistRemovals: Array<{ coin: CryptoCoin; payout: number }> = [];
    s.cryptoCoins = s.cryptoCoins.filter((coin) => {
      if ((coin.status !== 'Active' && coin.status !== 'TopLeader') || coin.isMyCoin) return true;
      const streak = coin.delistStreak || 0;
      // 6 weak weeks → formal delist vote (warning)
      if (streak >= 6 && !coin.delistWarning) {
        coin.delistWarning = true;
        pushWire({ kind: 'DELIST_VOTE', symbol: coin.symbol, title: `${coin.name} under delist review`, sub: `${coin.symbol} · 6 weeks of declining health · exit now or ride it out` });
        headlineNews.push(`DELIST REVIEW: $${coin.symbol} (${coin.name}) flagged after 6 weak weeks — holders should review positions.`);
        cryptoEvents.push({
          kind: 'DELIST_VOTE',
          subject: `⚠ DELIST REVIEW: ${coin.name} (${coin.symbol})`,
          body: `The Star Exchange listing committee has placed ${coin.name} (${coin.symbol}) under formal delist review.\n\nReason: 6 consecutive weeks of declining health (falling price and drying volume).\n\nIf conditions do not improve within 4 weeks, the coin will be REMOVED from the exchange. Any holdings will be auto-liquidated at a 40% discount.\n\nYou currently hold ${(coin.playerHoldings || 0).toFixed(4)} ${coin.symbol}. Consider your position.`,
          important: (coin.playerHoldings || 0) > 0,
        });
      }
      // Warning active + 4 more weak weeks (streak >= 10) → delisted
      if (coin.delistWarning && streak >= 10) {
        const holdings = coin.playerHoldings || 0;
        const payout = Math.floor(holdings * coin.price * 0.6); // forced liquidation at 40% discount
        coin.status = 'Delisted';
        if (holdings > 0) delistRemovals.push({ coin, payout });
        pushWire({ kind: 'DELISTED', symbol: coin.symbol, title: `${coin.name} DELISTED from Star Exchange`, sub: `${coin.symbol} removed after sustained decline${holdings > 0 ? ` · your ${holdings.toFixed(2)} tokens force-sold at −40%` : ''}` });
        headlineNews.push(`DELISTED: $${coin.symbol} (${coin.name}) removed from the exchange${holdings > 0 ? ` — holder positions liquidated at 40% discount` : ''}.`);
        cryptoEvents.push({
          kind: 'DELISTED',
          subject: `❌ DELISTED: ${coin.name} (${coin.symbol}) — position liquidated`,
          body: `${coin.name} (${coin.symbol}) has been removed from the Star Exchange after a sustained decline.\n\nYour ${holdings.toFixed(4)} tokens were auto-liquidated at a 40% delist discount.\nProceeds credited: $${payout.toLocaleString()}\n\nDelist events are part of a living market — cut weak positions early when delist review is announced.`,
          important: holdings > 0,
        });
        return false; // remove from tradable list
      }
      // Recovery clears the warning
      if (coin.delistWarning && streak === 0) coin.delistWarning = false;
      return true;
    });

    // Pay out forced liquidations (creditable via GameContext)
    if (delistRemovals.length > 0) {
      (s as any)._delistPayouts = delistRemovals.reduce((a, r) => a + r.payout, 0);
    }

    // ---- 3c-0. PLAYER COIN COMPETITION RANK (vs every live NPC coin) ----
    const myLiveCoin = s.cryptoCoins.find((c) => c.isMyCoin && (c.status === 'Active' || c.status === 'TopLeader'));
    if (myLiveCoin) {
      const liveRanked = s.cryptoCoins
        .filter((c) => c.status === 'Active' || c.status === 'TopLeader')
        .sort((a, b) => b.marketCap - a.marketCap);
      const myRank = liveRanked.findIndex((c) => c.id === myLiveCoin.id) + 1;
      const prevRank: number = s.playerCoinPrevRank || 0;
      if (myRank > 0 && prevRank > 0 && myRank < prevRank && myRank <= 20) {
        const passed = liveRanked[myRank]; // the coin now directly below us
        pushWire({ kind: 'PUMP', symbol: myLiveCoin.symbol, title: `FLIPPENING: $${myLiveCoin.symbol} passes ${passed ? '$' + passed.symbol : 'a rival'}`, sub: `Week-end rank #${myRank} of ${liveRanked.length} by market cap` });
        headlineNews.push(`FLIPPENING (week-end): $${myLiveCoin.symbol} holds #${myRank} of ${liveRanked.length} on the Star Exchange${passed ? `, having flipped $${passed.symbol}` : ''}. Live rank can move with mid-week pumps.`);
        cryptoEvents.push({
          kind: 'PUMP',
          subject: `📈 FLIPPENING: $${myLiveCoin.symbol} is now the #${myRank} coin on the exchange`,
          body: `${myLiveCoin.name} (${myLiveCoin.symbol}) just flipped ${passed ? `${passed.name} ($${passed.symbol})` : 'a rival token'} by market cap.\n\n• New rank: #${myRank} of ${liveRanked.length} live coins\n• Market cap: $${myLiveCoin.marketCap.toLocaleString()}\n• Price: $${myLiveCoin.price < 1 ? myLiveCoin.price.toFixed(4) : myLiveCoin.price.toFixed(2)}\n\nYour fan token is competing with — and beating — real exchange tokens. Keep the career hot and the community strong; every rank above you is a rival to flip.`,
          important: myRank <= 5,
        });
      }
      s.playerCoinPrevRank = myRank;
    }

    // ---- 3c. NEW LISTINGS — every 10-12 weeks, GOOD market caps ----
    if (typeof s.nextCryptoListingWeek !== 'number') {
      s.nextCryptoListingWeek = playerYear * 52 + playerWeek + 10 + Math.floor(Math.random() * 3);
    }
    if (playerYear * 52 + playerWeek >= s.nextCryptoListingWeek) {
      const freshCoins = generateCoinBatch(1 + Math.floor(Math.random() * 2), 40000000, 350000000, s.cryptoCoins, playerWeek, playerYear);
      s.cryptoCoins.push(...freshCoins);
      for (const fc of freshCoins) {
        pushWire({ kind: 'LISTING', symbol: fc.symbol, title: `${fc.name} (${fc.symbol}) JUST LISTED`, sub: `${fc.sector} · market cap $${(fc.marketCap / 1000000).toFixed(0)}M · entry $${fc.price < 1 ? fc.price.toFixed(4) : fc.price.toFixed(2)}` });
        headlineNews.push(`NEW LISTING: ${fc.name} (${fc.symbol}) lists on the Star Exchange at a $${(fc.marketCap / 1000000).toFixed(0)}M market cap!`);
        cryptoEvents.push({
          kind: 'LISTING',
          subject: `🆕 NEW LISTING: ${fc.name} (${fc.symbol}) is now tradable`,
          body: `A new coin just listed on the Star Exchange.\n\n• Name: ${fc.name} (${fc.symbol})\n• Sector: ${fc.sector}\n• Listing market cap: $${fc.marketCap.toLocaleString()}\n• Entry price: $${fc.price < 1 ? fc.price.toFixed(4) : fc.price.toFixed(2)}\n• Risk: ${fc.risk} · Volatility: ${fc.volatility}\n\n${fc.techDescription}\n\nNew listings are volatile — early movers can catch the listing pump, and late ones the dump. Trade accordingly.`,
          important: false,
        });
      }
      // schedule the next listing 10-12 weeks out
      s.nextCryptoListingWeek = playerYear * 52 + playerWeek + 10 + Math.floor(Math.random() * 3);
    }

    s.cryptoWire = wire;

    // 3b. WHALE COPY-TRADE — copied whales mirror their coin moves into
    //     the player's P&L weekly, sized to the player's cash. Wins and
    //     losses are real; the fee applies to profits only.
    {
      const copiers = s.whales.filter((w) => w.copyTradeActive);
      if (copiers.length > 0) {
        const copyEvents: Array<{ kind: string; subject: string; body: string; important: boolean }> = [];
        let copyPnlTotal = 0;
        for (const w of copiers) {
          const sym = w.topPositions.find((p) => p.startsWith('$'));
          const coin = sym ? s.cryptoCoins.find((c) => c.symbol === sym && (c.status === 'Active' || c.status === 'TopLeader')) : undefined;
          if (!coin) continue;
          const alloc = Math.min(Math.max(500, Math.floor(playerMoney * (0.02 + Math.random() * 0.06))), Math.floor(playerMoney * 0.10));
          if (alloc <= 0) continue;
          const fee = (w.copyTradeFeePct || 2) / 100;
          const coinMove = coin.change24h / 100; // the coin's real drift this week
          const whaleWin = Math.random() * 100 < w.winRatePct;
          const pnl = Math.floor(alloc * (coinMove !== 0 ? coinMove : (whaleWin ? 0.03 + Math.random() * 0.09 : -0.02 - Math.random() * 0.06)));
          const feeDue = pnl > 0 ? Math.floor(pnl * fee) : 0;
          copyPnlTotal += pnl - feeDue;
          copyEvents.push({
            kind: 'COPY',
            subject: `🐋 Copy-trade ${pnl - feeDue >= 0 ? 'profit' : 'loss'}: ${w.name} (${pnl - feeDue >= 0 ? '+' : '−'}$${Math.abs(pnl - feeDue).toLocaleString()})`,
            body: `${w.name} (${w.strategy}, ${w.winRatePct}% WR) ${pnl >= 0 ? 'closed a winning' : 'took a losing'} ${coin.symbol} position this week${coinMove !== 0 ? ` — the coin moved ${(coinMove * 100).toFixed(1)}%` : ''}.\n\nYour mirrored P&L: ${pnl >= 0 ? '+' : '−'}$${Math.abs(pnl).toLocaleString()}\nCopy fee (${w.copyTradeFeePct}% of profit): ${feeDue > 0 ? `−$${feeDue.toLocaleString()}` : '$0'}\nNET: ${pnl - feeDue >= 0 ? '+' : '−'}$${Math.abs(pnl - feeDue).toLocaleString()}`,
            important: false,
          });
        }
        if (copyPnlTotal !== 0) (s as any).__whaleCopyPnl = copyPnlTotal;
        if (copyEvents.length > 0) {
          const prev = (s as any).cryptoEvents || [];
          (s as any).cryptoEvents = [...copyEvents, ...prev];
        }
      }
    }

    // 4. PROCESS IPOS & NEW LAUNCHES
    s.ipos = s.ipos.map((ipo) => {
      if (ipo.status === 'Upcoming') {
        const nextWeeks = ipo.weeksUntilLaunch - 1;
        if (nextWeeks <= 0) {
          // LAUNCH DAY! Transition into a public stock company
          const openingMultiplier = 1 + (ipo.investorInterest - 50) / 100 + (Math.random() * 0.2 - 0.1);
          const launchPrice = Math.max(1.0, Math.round(ipo.ipoPrice * openingMultiplier * 100) / 100);
          const launchShares = ipo.sharesOffered * 2;
          const launchMarketCap = Math.round(launchPrice * launchShares);

          const newStock: StockCompany = {
            id: ipo.id,
            name: ipo.companyName,
            ticker: ipo.ticker,
            industry: ipo.industry,
            ceo: ipo.isPlayerIpo ? 'Player / Founder' : 'Executive Board',
            logo: '🚀',
            sharePrice: launchPrice,
            prevPrice: ipo.ipoPrice,
            changePct: Math.round(((launchPrice - ipo.ipoPrice) / ipo.ipoPrice) * 100 * 100) / 100,
            marketCap: launchMarketCap,
            sharesOutstanding: launchShares,
            revenue: ipo.companyFundamentals.revenue,
            profit: ipo.companyFundamentals.profit,
            debt: ipo.companyFundamentals.debt,
            growthRate: ipo.growthRating === 'Hyper Growth' ? 45 : 20,
            investorConfidence: ipo.investorInterest,
            ceoRating: 85,
            newsSentiment: 50,
            volatility: 'High',
            rating: 'A',
            dividendYieldPct: 0.0,
            history: ipo.description,
            movies: [],
            series: [],
            upcomingProjects: ['Post-IPO Expansion'],
            news: [`${ipo.companyName} (${ipo.ticker}) successfully completes Wall Street IPO trading at $${launchPrice}!`],
            chartData: [ipo.ipoPrice, launchPrice],
            status: 'Public',
            institutionalOwnershipPct: 55,
            insiderOwnershipPct: 25,
            publicOwnershipPct: 20,
            playerSharesOwned: ipo.playerSubscribedShares || 0,
            playerAvgBuyPrice: ipo.ipoPrice,
            boardSeatsTotal: 9,
            playerBoardMember: (ipo.playerSubscribedShares || 0) > launchShares * 0.05,
          } as StockCompany;

          // Media/film IPOs get a live production slate like any real studio
          const filmIpo = /studio|film|entertainment|media|cinema|picture/i.test(ipo.industry);
          if (filmIpo) {
            newStock.isFilmStudio = true;
            newStock.slate = seedSlate(newStock.id);
            newStock.slateHealth = 55 + Math.floor(Math.random() * 20);
          }

          // ANTI-REPEAT guard: if this ticker somehow already trades, complete
          // the IPO without inserting a duplicate listing (no repeat inbox)
          if (!s.stocks.some((st) => st.ticker === newStock.ticker)) {
            s.stocks.unshift(newStock);
          }

          const launchNews = `WALL STREET IPO: ${ipo.companyName} (${ipo.ticker}) goes public at $${launchPrice}/share with $${(launchMarketCap / 1000000).toFixed(1)}M market cap!`;
          headlineNews.push(launchNews);

          return { ...ipo, status: 'Completed', weeksUntilLaunch: 0 };
        }
        return { ...ipo, weeksUntilLaunch: nextWeeks };
      }
      return ipo;
    });

    // 5. PERIODICALLY GENERATE NEW IPOS (Every 4 weeks)
    // ANTI-REPEAT: a company may only ever IPO once — candidates are filtered
    // against every ticker that already exists as a stock, an upcoming IPO or
    // a completed IPO. When the curated pool is exhausted, endless procedural
    // companies file instead (no duplicate listings, ever).
    if (playerWeek % 4 === 0 && s.ipos.filter((i) => i.status === 'Upcoming').length < 3) {
      const newIpoNames = [
        { name: 'Vanguard AI VFX', ticker: 'VVFX', ind: 'Artificial Intelligence & Visual Tech', price: 24.0, rev: 120000000, profit: 18000000, debt: 20000000, desc: 'Next-gen cloud rendering pipeline for streaming platforms.' },
        { name: 'Metropolis Soundstages', ticker: 'METR', ind: 'Real Estate & Studios', price: 15.5, rev: 210000000, profit: 34000000, debt: 80000000, desc: 'Luxury film studio soundstage complex in Atlanta & Los Angeles.' },
        { name: 'Aura Fitness & Wellness', ticker: 'AURA', ind: 'Healthcare & Wellness', price: 28.0, rev: 95000000, profit: 14000000, debt: 10000000, desc: 'Celebrity wellness clinics and biometrics monitoring tech.' },
        { name: 'Starlight Live Streaming', ticker: 'STRT', ind: 'Media & Interactive', price: 12.0, rev: 68000000, profit: 5000000, debt: 12000000, desc: 'Interactive live red carpet streaming and fan monetization app.' },
      ];

      // Everything already traded / filed is off the table
      const usedTickers = new Set<string>([
        ...s.stocks.map((st) => st.ticker),
        ...s.ipos.map((i) => i.ticker),
      ]);
      let candidates = newIpoNames.filter((n) => !usedTickers.has(n.ticker));

      // Endless fallback: procedural companies so new IPO filings never repeat
      if (candidates.length === 0) {
        const p1 = ['Helios', 'Kestrel', 'Northgate', 'Lumen', 'Ironwood', 'Cobalt', 'Marlowe', 'Verity', 'Halcyon', 'Sable', 'Onyx', 'Crestline', 'Vesper', 'Ardent', 'Solstice'];
        const p2 = ['Dynamics', 'Media Group', 'Interactive', 'Pictures Holdings', 'Technologies', 'Studios Trust', 'Networks', 'Labs', 'Capital Entertainment', 'Systems'];
        const inds = ['Media & Interactive', 'Entertainment & Gaming', 'Artificial Intelligence & Visual Tech', 'Real Estate & Studios', 'Consumer & Lifestyle'];
        const nm = `${p1[Math.floor(Math.random() * p1.length)]} ${p2[Math.floor(Math.random() * p2.length)]}`;
        let tk = nm.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 4);
        while (usedTickers.has(tk)) tk = tk.slice(0, 3) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const rv = Math.floor(30000000 + Math.random() * 220000000);
        candidates = [{
          name: nm,
          ticker: tk,
          ind: inds[Math.floor(Math.random() * inds.length)],
          price: Math.round((8 + Math.random() * 32) * 10) / 10,
          rev: rv,
          profit: Math.floor(rv * (0.05 + Math.random() * 0.2)),
          debt: Math.floor(rv * Math.random() * 0.5),
          desc: 'Freshly filed venture with a growing content pipeline and institutional backing.',
        }];
      }

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const freshIpo: IpoCompany = {
        id: `ipo_gen_${Date.now()}`,
        companyName: pick.name,
        ticker: pick.ticker,
        industry: pick.ind,
        ipoPrice: pick.price,
        sharesOffered: 30000000,
        initialMarketCap: pick.price * 30000000,
        investorInterest: 75 + Math.floor(Math.random() * 20),
        riskRating: 'Moderate',
        growthRating: 'High Growth',
        companyFundamentals: { revenue: pick.rev, profit: pick.profit, debt: pick.debt },
        weeksUntilLaunch: Math.floor(Math.random() * 3) + 2,
        status: 'Upcoming',
        description: pick.desc,
      };

      s.ipos.unshift(freshIpo);
      headlineNews.push(`NEW IPO ANNOUNCEMENT: ${pick.name} (${pick.ticker}) files for Wall Street initial public offering!`);
    }

    // (Crypto listings are handled by the living market section above —
    // every 10-12 weeks with real market caps, wire events and inbox alerts)

    // ENDLESS MARKET (v2): infinite stock bankruptcies, acquisitions
    try {
      const endlessNews = processEndlessMarket(s, playerWeek, playerYear);
      headlineNews.push(...endlessNews);
    } catch (e) {
      console.error('Endless market error:', e);
    }

    this.saveMarketState(s);
    const delistPayouts = (s as any)._delistPayouts || 0;
    const whaleCopyPnl = (s as any).__whaleCopyPnl || 0;
    const whaleEvents = ((s as any).cryptoEvents as any[] | undefined) || [];
    delete (s as any)._delistPayouts;
    delete (s as any).__whaleCopyPnl;
    delete (s as any).cryptoEvents;
    return { updatedState: s, headlineNews, cryptoEvents: [...whaleEvents, ...cryptoEvents], delistPayouts, whaleCopyPnl, studioCastingCalls, studioEvents };
  }

  /**
   * BUY STOCK SHARES
   */
  public static buyStock(ticker: string, count: number, playerMoney: number): {
    success: boolean;
    message: string;
    totalCost: number;
  } {
    const s = this.getMarketState();
    const stock = s.stocks.find((st) => st.ticker === ticker || st.id === ticker);
    if (!stock) return { success: false, message: 'Stock not found on Wall Street Exchange.', totalCost: 0 };

    const totalCost = stock.sharePrice * count;
    if (playerMoney < totalCost) {
      return {
        success: false,
        message: `Insufficient Cash! Buying ${count} shares of ${stock.ticker} costs $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
        totalCost,
      };
    }

    const prevOwned = stock.playerSharesOwned || 0;
    const prevAvg = stock.playerAvgBuyPrice || stock.sharePrice;
    const newTotalShares = prevOwned + count;
    const newAvgPrice = (prevOwned * prevAvg + totalCost) / newTotalShares;

    stock.playerSharesOwned = newTotalShares;
    stock.playerAvgBuyPrice = newAvgPrice;

    // Check Board Seat Eligibility (>5% of company shares)
    if (newTotalShares >= stock.sharesOutstanding * 0.05) {
      stock.playerBoardMember = true;
    }

    s.transactions.unshift({
      id: `tx_${Date.now()}`,
      assetType: 'STOCK',
      assetId: stock.id,
      symbol: stock.ticker,
      name: stock.name,
      type: 'BUY',
      units: count,
      pricePerUnit: stock.sharePrice,
      totalCost,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });

    this.saveMarketState(s);

    return {
      success: true,
      message: `Successfully executed BUY order for ${count} share(s) of ${stock.name} (${stock.ticker}) at $${stock.sharePrice.toFixed(2)}/share ($${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`,
      totalCost,
    };
  }

  /**
   * SELL STOCK SHARES
   */
  public static sellStock(ticker: string, count: number): {
    success: boolean;
    message: string;
    totalRevenue: number;
  } {
    const s = this.getMarketState();
    const stock = s.stocks.find((st) => st.ticker === ticker || st.id === ticker);
    if (!stock) return { success: false, message: 'Stock not found.', totalRevenue: 0 };

    const owned = stock.playerSharesOwned || 0;
    if (owned < count) {
      return {
        success: false,
        message: `Execution error: You only own ${owned} share(s) of ${stock.ticker}.`,
        totalRevenue: 0,
      };
    }

    const totalRevenue = stock.sharePrice * count;
    stock.playerSharesOwned = owned - count;
    if (stock.playerSharesOwned <= 0) {
      stock.playerSharesOwned = 0;
      stock.playerAvgBuyPrice = 0;
      stock.playerBoardMember = false;
    }

    s.transactions.unshift({
      id: `tx_${Date.now()}`,
      assetType: 'STOCK',
      assetId: stock.id,
      symbol: stock.ticker,
      name: stock.name,
      type: 'SELL',
      units: count,
      pricePerUnit: stock.sharePrice,
      totalCost: totalRevenue,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });

    this.saveMarketState(s);

    return {
      success: true,
      message: `Successfully executed SELL order for ${count} share(s) of ${stock.name} (${stock.ticker}) receiving $${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`,
      totalRevenue,
    };
  }

  /**
   * SUBSCRIBE TO IPO PRE-ORDER
   */
  public static subscribeIpo(ipoId: string, sharesCount: number, playerMoney: number): {
    success: boolean;
    message: string;
    totalCost: number;
  } {
    const s = this.getMarketState();
    const ipo = s.ipos.find((i) => i.id === ipoId);
    if (!ipo || ipo.status !== 'Upcoming') {
      return { success: false, message: 'IPO is not active for pre-order subscription.', totalCost: 0 };
    }

    const totalCost = ipo.ipoPrice * sharesCount;
    if (playerMoney < totalCost) {
      return {
        success: false,
        message: `Insufficient cash! Pre-subscribing ${sharesCount} shares costs $${totalCost.toLocaleString()}.`,
        totalCost,
      };
    }

    ipo.playerSubscribedShares = (ipo.playerSubscribedShares || 0) + sharesCount;

    s.transactions.unshift({
      id: `tx_ipo_${Date.now()}`,
      assetType: 'IPO',
      assetId: ipo.id,
      symbol: ipo.ticker,
      name: ipo.companyName,
      type: 'SUBSCRIBE',
      units: sharesCount,
      pricePerUnit: ipo.ipoPrice,
      totalCost,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });

    this.saveMarketState(s);

    return {
      success: true,
      message: `IPO SUBSCRIPTION CONFIRMED: Reserved ${sharesCount} pre-IPO shares of ${ipo.companyName} (${ipo.ticker}) at $${ipo.ipoPrice}/share!`,
      totalCost,
    };
  }

  /**
   * BUY CRYPTOCURRENCY
   */
  public static buyCrypto(symbol: string, dollarAmount: number, playerMoney: number): {
    success: boolean;
    message: string;
    coinAmount: number;
  } {
    const s = this.getMarketState();
    const coin = s.cryptoCoins.find((c) => c.symbol === symbol || c.id === symbol);
    if (!coin) return { success: false, message: 'Cryptocurrency coin not found.', coinAmount: 0 };

    if (playerMoney < dollarAmount) {
      return {
        success: false,
        message: `Insufficient Cash! Required: $${dollarAmount.toLocaleString()}.`,
        coinAmount: 0,
      };
    }

    const coinAmount = dollarAmount / coin.price;
    const prevHoldings = coin.playerHoldings || 0;
    const prevAvg = coin.playerAvgBuyPrice || coin.price;
    const newHoldings = prevHoldings + coinAmount;
    const newAvg = (prevHoldings * prevAvg + dollarAmount) / newHoldings;

    coin.playerHoldings = newHoldings;
    coin.playerAvgBuyPrice = newAvg;

    s.transactions.unshift({
      id: `tx_c_${Date.now()}`,
      assetType: 'CRYPTO',
      assetId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      type: 'BUY',
      units: coinAmount,
      pricePerUnit: coin.price,
      totalCost: dollarAmount,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });

    this.saveMarketState(s);

    return {
      success: true,
      message: `SWAP EXECUTED: Bought ${coinAmount.toFixed(4)} $${coin.symbol} for $${dollarAmount.toLocaleString()} at $${coin.price.toFixed(2)}/token!`,
      coinAmount,
    };
  }

  /**
   * SELL CRYPTOCURRENCY
   */
  public static sellCrypto(symbol: string, coinAmount: number): {
    success: boolean;
    message: string;
    totalDollarRevenue: number;
    dumpReport?: FounderDumpReport;
  } {
    const s = this.getMarketState();
    const coin = s.cryptoCoins.find((c) => c.symbol === symbol || c.id === symbol);
    if (!coin) return { success: false, message: 'Coin not found.', totalDollarRevenue: 0 };

    const owned = coin.playerHoldings || 0;
    if (owned < coinAmount) {
      return {
        success: false,
        message: `Error: You only hold ${owned.toFixed(4)} tokens of $${coin.symbol}.`,
        totalDollarRevenue: 0,
      } as any;
    }

    // ---- FOUNDER-SIZE DUMP IMPACT on your own fan token ----
    // Selling more than 2% of circulating supply moves the market against
    // you: slippage on the fill, then a real price crash + community damage.
    // No more free spot-price exits for the founder wallet.
    let fillPrice = coin.price;
    let dumpNote = '';
    let dumpReport: FounderDumpReport | undefined;
    if (coin.isMyCoin) {
      const frac = coinAmount / Math.max(1, coin.circulatingSupply);
      if (frac > 0.02) {
        const priceBefore = coin.price;
        const trustBefore = coin.communityStrength;
        const slip = Math.min(0.55, 0.25 + frac * 5.5);
        fillPrice = coin.price * (1 - slip);
        coin.price = Math.max(0.000001, Math.round(coin.price * (1 - Math.min(0.6, frac * 3)) * 1000000) / 1000000);
        coin.marketCap = Math.round(coin.price * coin.circulatingSupply);
        coin.communityStrength = Math.max(3, Math.round(coin.communityStrength - frac * 80));
        coin.news = `$${coin.symbol} FOUNDER WALLET DUMP — ${(frac * 100).toFixed(1)}% of supply sold. Community in revolt.`;
        dumpNote = ` Founder dump of ${(frac * 100).toFixed(1)}% of supply: ${(slip * 100).toFixed(0)}% slippage eaten, price crashed to $${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toFixed(2)}, community trust damaged.`;
        dumpReport = {
          symbol: coin.symbol,
          coinName: coin.name,
          tokensSold: coinAmount,
          supplyPct: Math.round(frac * 10000) / 100,
          slipPct: Math.round(slip * 100),
          proceeds: Math.round(coinAmount * fillPrice),
          priceBefore,
          priceAfter: coin.price,
          trustBefore,
          trustAfter: coin.communityStrength,
        };
      }
    }

    const totalDollarRevenue = Math.round(coinAmount * fillPrice * 100) / 100;
    // ---- REALIZED PnL → CRYPTO TAX (fed weekly into the tax engine) ----
    const avgBuy = coin.playerAvgBuyPrice || 0;
    const realizedPerUnit = fillPrice - avgBuy;
    const realizedPnl = realizedPerUnit * coinAmount;
    if (realizedPnl > 0) {
      s.pendingCryptoGains = (s.pendingCryptoGains || 0) + Math.floor(realizedPnl);
    } else if (realizedPnl < 0) {
      s.pendingCryptoLosses = (s.pendingCryptoLosses || 0) + Math.floor(-realizedPnl);
    }
    const taxNote = realizedPnl > 0
      ? ` Taxable gain of $${Math.floor(realizedPnl).toLocaleString()} recorded — withholding applies this week.`
      : realizedPnl < 0
      ? ` Realized loss of $${Math.floor(-realizedPnl).toLocaleString()} offsets this week's crypto gains.`
      : '';
    coin.playerHoldings = owned - coinAmount;
    if (coin.playerHoldings <= 0.00001) {
      coin.playerHoldings = 0;
      coin.playerAvgBuyPrice = 0;
    }

    s.transactions.unshift({
      id: `tx_c_${Date.now()}`,
      assetType: 'CRYPTO',
      assetId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      type: 'SELL',
      units: coinAmount,
      pricePerUnit: coin.price,
      totalCost: totalDollarRevenue,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });

    this.saveMarketState(s);

    return {
      success: true,
          message: `SWAP EXECUTED: Sold ${coinAmount.toFixed(4)} $${coin.symbol} receiving $${totalDollarRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!${taxNote}${dumpNote}`,
      totalDollarRevenue,
      dumpReport,
    };
  }

  /**
   * NET CRYPTO TAXABLE GAINS — consumed weekly by GameContext and fed into
   * the tax engine as 'crypto' income. Losses offset gains; net below zero
   * reports 0 (no fake negative income).
   */
  public static consumePendingCryptoTax(): number {
    const s = this.getMarketState();
    const gains = s.pendingCryptoGains || 0;
    const losses = s.pendingCryptoLosses || 0;
    const net = Math.max(0, gains - losses);
    s.pendingCryptoGains = 0;
    s.pendingCryptoLosses = Math.max(0, losses - gains);
    this.saveMarketState(s);
    return net;
  }

  /**
   * LATE GAME: LAUNCH PLAYER'S OWN IPO COMPANY ON WALL STREET
   */
  public static launchPlayerIpo(
    companyName: string,
    ticker: string,
    industry: string,
    ipoPrice: number,
    valuation: number,
    playerMoney: number
  ): { success: boolean; message: string } {
    const s = this.getMarketState();
    const filingFee = 500000;

    if (playerMoney < filingFee) {
      return { success: false, message: `Wall Street SEC Filing fee requires $${filingFee.toLocaleString()} cash.` };
    }

    const cleanTicker = ticker.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'MOGUL';

    const playerIpo: IpoCompany = {
      id: `ipo_player_${Date.now()}`,
      companyName,
      ticker: cleanTicker,
      industry,
      ipoPrice,
      sharesOffered: Math.round(valuation / ipoPrice / 2),
      initialMarketCap: valuation,
      investorInterest: 88,
      riskRating: 'Moderate',
      growthRating: 'Hyper Growth',
      companyFundamentals: {
        revenue: Math.round(valuation * 0.15),
        profit: Math.round(valuation * 0.03),
        debt: 0,
      },
      weeksUntilLaunch: 2,
      isPlayerIpo: true,
      status: 'Upcoming',
      description: `Public IPO company founded by Hollywood Titan moguls. Listed on Wall Street.`,
    };

    s.ipos.unshift(playerIpo);
    s.playerCustomIposCount = (s.playerCustomIposCount || 0) + 1;
    this.saveMarketState(s);

    return {
      success: true,
      message: `WALL STREET FILING APPROVED! ${companyName} (${cleanTicker}) IPO scheduled for listing in 2 weeks!`,
    };
  }

  /**
   * LATE GAME: LAUNCH PLAYER'S OWN CELEBRITY CRYPTOCURRENCY
   */
  public static launchPlayerCrypto(
    coinName: string,
    symbol: string,
    initialPrice: number,
    playerFameXp: number,
    playerMoney: number,
    tokenomics?: { totalSupply?: number; founderPct?: number; airdropPct?: number; liquidityPct?: number }
  ): { success: boolean; message: string } {
    const s = this.getMarketState();
    const deploymentCost = 100000;

    if (s.playerRugPulled) {
      return { success: false, message: 'EXCHANGE BLACKLIST: after your rug pull, the Star Exchange will never approve another token from you.' };
    }
    const alreadyLaunched = s.cryptoCoins.find((c) => c.isMyCoin && (c.status === 'Active' || c.status === 'TopLeader'));
    if (alreadyLaunched) {
      return { success: false, message: `You already have $${alreadyLaunched.symbol} live on the exchange.` };
    }

    if (playerMoney < deploymentCost) {
      return { success: false, message: `Smart contract deployment fee requires $${deploymentCost.toLocaleString()}.` };
    }

    // ---- TOKENOMICS: real allocation split (must total exactly 100%) ----
    const founderPct = Math.round(tokenomics?.founderPct ?? 90);
    const airdropPct = Math.round(tokenomics?.airdropPct ?? 5);
    const liquidityPct = Math.round(tokenomics?.liquidityPct ?? 5);
    if (founderPct + airdropPct + liquidityPct !== 100) {
      return { success: false, message: `Tokenomics must total 100% — you set Founder ${founderPct}% + Airdrop ${airdropPct}% + Liquidity ${liquidityPct}%.` };
    }
    if (founderPct < 10 || founderPct > 95) return { success: false, message: 'Founder allocation must be between 10% and 95%.' };
    if (airdropPct < 0 || liquidityPct < 0) return { success: false, message: 'Allocations cannot be negative.' };
    const totalSupply = Math.max(1000000, Math.min(100000000000, Math.floor(tokenomics?.totalSupply ?? 10000000)));

    const cleanSymbol = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'STAR';
    const founderAllocation = Math.floor((totalSupply * founderPct) / 100);
    const launchAirdrop = Math.floor((totalSupply * airdropPct) / 100);
    const launchLiquidity = Math.floor((totalSupply * liquidityPct) / 100);

    const playerCoin: CryptoCoin = {
      id: `crypto_player_${Date.now()}`,
      name: coinName,
      symbol: cleanSymbol,
      price: initialPrice,
      prevPrice: initialPrice,
      change24h: 25.0,
      change7d: 50.0,
      marketCap: Math.round(initialPrice * totalSupply),
      circulatingSupply: totalSupply,
      volume24h: 15000000 + launchLiquidity,
      popularity: Math.min(100, Math.floor((playerFameXp || 0) / 100) + 50),
      communityStrength: Math.min(100, 90 + (launchAirdrop > 0 ? 6 : 0)),
      volatility: 'Extreme Degen',
      sector: 'Celebrity Fan Token',
      risk: 'High',
      techDescription: `Official celebrity fan cryptocurrency deployed on Hollywood Web3 Exchange. Tokenomics: ${founderPct}% founder, ${airdropPct}% community airdrop, ${liquidityPct}% liquidity. Price fluctuates with career fame and movie box office hits.`,
      sparkline: [initialPrice * 0.5, initialPrice * 0.75, initialPrice],
      news: launchAirdrop > 0
        ? `${coinName} ($${cleanSymbol}) launches with a ${fmtTokens(launchAirdrop)} token community airdrop!`
        : `${coinName} ($${cleanSymbol}) launches on Web3 exchange powered by celebrity stardom!`,
      isMyCoin: true,
      status: 'TopLeader',
      playerHoldings: founderAllocation,
      playerAvgBuyPrice: initialPrice,
      communityAirdropped: launchAirdrop,
      airdropHolders: launchAirdrop > 0 ? Math.min(50000, Math.floor(launchAirdrop / 40)) : 0,
      airdropStreak: launchAirdrop > 0 ? 1 : 0,
      buzzWeeksLeft: launchAirdrop > 0 ? 3 : 0,
    };

    s.cryptoCoins.unshift(playerCoin);
    s.playerCustomCryptosCount = (s.playerCustomCryptosCount || 0) + 1;
    this.saveMarketState(s);

    const airdropNote = launchAirdrop > 0
      ? ` ${fmtTokens(launchAirdrop)} tokens airdropped to the community at launch — ${fmtTokens(playerCoin.airdropHolders || 0)} new holders, launch buzz live for 3 weeks!`
      : '';
    return {
      success: true,
      message: `WEB3 TOKEN DEPLOYED! $${cleanSymbol} (${coinName}) live with ${fmtTokens(founderAllocation)} founder allocation (${founderPct}%) and ${fmtTokens(launchLiquidity)} liquidity (${liquidityPct}%).${airdropNote}`,
    };
  }

  // ==========================================================
  // FOUNDER OPS — the player controls their own fan token
  // ==========================================================

  /**
   * COMMUNITY AIRDROP — give real founder tokens away for free.
   * Costs allocation, gains holders, trust and 3 weeks of decaying
   * price buzz. Consecutive airdrops fade (community fatigue); a
   * 2-week cooldown stops spamming.
   */
  public static airdropToCommunity(
    symbol: string,
    tokenAmount: number,
    currentWeek: number
  ): { success: boolean; message: string; holdersGained: number; socialText?: string } {
    if (!Number.isFinite(tokenAmount) || tokenAmount < 1000) {
      return { success: false, message: 'Minimum airdrop is 1,000 tokens.', holdersGained: 0 };
    }
    const s = this.getMarketState();
    const coin = s.cryptoCoins.find((c) => c.isMyCoin && (c.id === symbol || c.symbol === symbol) && (c.status === 'Active' || c.status === 'TopLeader'));
    if (!coin) return { success: false, message: 'Your fan token is not live on the exchange.', holdersGained: 0 };
    if ((coin.playerHoldings || 0) < tokenAmount) {
      return { success: false, message: `Insufficient founder allocation — you hold ${fmtTokens(coin.playerHoldings || 0)} $${coin.symbol}.`, holdersGained: 0 };
    }
    const lastWeek: number = coin.lastAirdropWeek || 0;
    if (lastWeek > 0 && currentWeek - lastWeek < 2) {
      return { success: false, message: `Airdrop cooldown — the community is still claiming the last drop. Next airdrop week: ${lastWeek + 2}.`, holdersGained: 0 };
    }

    // fatigue: each consecutive airdrop dims the effect
    const streak = (coin.airdropStreak || 0) + 1;
    const effectMult = Math.max(0.2, 1 - (streak - 1) * 0.3);
    const supplyFrac = tokenAmount / Math.max(1, coin.circulatingSupply);
    const sizeFactor = Math.min(1, supplyFrac * 20); // 5% of supply = full effect

    const holdersGained = Math.floor(Math.min(50000, tokenAmount / 40) * effectMult);
    coin.playerHoldings = (coin.playerHoldings || 0) - tokenAmount;
    coin.communityAirdropped = (coin.communityAirdropped || 0) + tokenAmount;
    coin.airdropHolders = (coin.airdropHolders || 0) + holdersGained;
    coin.lastAirdropWeek = currentWeek;
    coin.airdropStreak = streak;
    coin.buzzWeeksLeft = Math.min(4, Math.max(coin.buzzWeeksLeft || 0, 3));
    coin.communityStrength = Math.max(3, Math.min(100, Math.round(coin.communityStrength + (3 + 10 * sizeFactor) * effectMult)));
    coin.popularity = Math.min(100, Math.round(coin.popularity + 6 * effectMult));
    // announcement pop + panic-buy volume
    coin.prevPrice = coin.price;
    coin.price = Math.max(0.000001, Math.round(coin.price * (1 + (0.02 + 0.04 * sizeFactor) * effectMult) * 1000000) / 1000000);
    coin.marketCap = Math.round(coin.price * coin.circulatingSupply);
    coin.volume24h += Math.round(tokenAmount * coin.price * 2);
    coin.sparkline = [...(coin.sparkline || []), coin.price].slice(-12);
    const fatigueHit = effectMult < 0.6;
    if (fatigueHit) coin.communityStrength = Math.max(3, coin.communityStrength - 3);
    coin.news = `🪂 $${coin.symbol} AIRDROP — ${fmtTokens(tokenAmount)} tokens to the community. ${fmtTokens(coin.airdropHolders || 0)} total holders!`;

    s.transactions.unshift({
      id: `tx_air_${Date.now()}`,
      assetType: 'CRYPTO',
      assetId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      type: 'SELL',
      units: tokenAmount,
      pricePerUnit: 0,
      totalCost: 0,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });
    this.saveMarketState(s);

    const fatigueNote = fatigueHit ? ' ⚠️ Community fatigue detected — trust dipped. Space out future airdrops.' : '';
    return {
      success: true,
      holdersGained,
      socialText: `🪂 $${coin.symbol} AIRDROP IS LIVE! ${fmtTokens(tokenAmount)} tokens, FREE, to the community. Claim → hold → we ride. First come, first served. 🚀`,
      message: `AIRDROP EXECUTED: ${fmtTokens(tokenAmount)} $${coin.symbol} distributed free — ${holdersGained.toLocaleString()} new holders, trust ${coin.communityStrength}/100, buzz live 3 weeks.${fatigueNote}`,
    };
  }

  /**
   * Preview a founder-size sell WITHOUT executing: live slippage estimate
   * for the order panel so the consequences are readable before confirming.
   */
  public static estimateFounderSellImpact(symbol: string, coinAmount: number): { fillPrice: number; slipPct: number; revenue: number } | null {
    const s = this.getMarketState();
    const coin = s.cryptoCoins.find((c) => c.isMyCoin && (c.id === symbol || c.symbol === symbol));
    if (!coin || !coinAmount || coinAmount <= 0) return null;
    const frac = coinAmount / Math.max(1, coin.circulatingSupply);
    if (frac <= 0.02) return { fillPrice: coin.price, slipPct: 0, revenue: coinAmount * coin.price };
    const slip = Math.min(0.55, 0.25 + frac * 5.5);
    const fillPrice = coin.price * (1 - slip);
    return { fillPrice, slipPct: Math.round(slip * 100), revenue: coinAmount * fillPrice };
  }

  /**
   * FOUNDER LIQUIDITY INJECTION — spend real cash to pump your coin.
   * Price impact scales with injection size vs market cap (capped, with
   * diminishing returns like a real buy wall). The cash is spent — gone
   * into the treasury, buying a pump that the market can still fade.
   */
  public static injectCashIntoMyCoin(
    symbol: string,
    dollarAmount: number,
    playerMoney: number
  ): { success: boolean; message: string; newPrice: number } {
    if (!Number.isFinite(dollarAmount) || dollarAmount < 10000) {
      return { success: false, message: 'Minimum liquidity injection is $10,000.', newPrice: 0 };
    }
    const s = this.getMarketState();
    const coin = s.cryptoCoins.find((c) => c.isMyCoin && (c.id === symbol || c.symbol === symbol) && (c.status === 'Active' || c.status === 'TopLeader'));
    if (!coin) return { success: false, message: 'Your fan token is not live on the exchange.', newPrice: 0 };
    if (playerMoney < dollarAmount) {
      return { success: false, message: `Insufficient cash. Injection requires $${dollarAmount.toLocaleString()}.`, newPrice: 0 };
    }

    const impactRatio = dollarAmount / Math.max(1, coin.marketCap);
    const priceMult = 1 + Math.min(0.6, impactRatio * 0.9); // real buy wall, capped at +60%
    coin.prevPrice = coin.price;
    coin.price = Math.max(0.000001, Math.round(coin.price * priceMult * 1000000) / 1000000);
    coin.marketCap = Math.round(coin.price * coin.circulatingSupply);
    coin.volume24h += Math.round(dollarAmount * 3);
    coin.communityStrength = Math.min(100, coin.communityStrength + 4);
    coin.popularity = Math.min(100, coin.popularity + 6);
    coin.change24h = Math.round(((coin.price / Math.max(0.000001, coin.prevPrice) - 1) * 100 + (coin.change24h || 0)) * 100) / 100;
    coin.sparkline = [...(coin.sparkline || []), coin.price].slice(-12);
    coin.news = `$${coin.symbol} TREASURY INJECTION — founder deploys $${dollarAmount.toLocaleString()} liquidity support!`;

    s.transactions.unshift({
      id: `tx_inj_${Date.now()}`,
      assetType: 'CRYPTO',
      assetId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      type: 'BUY',
      units: dollarAmount / coin.price,
      pricePerUnit: coin.price,
      totalCost: dollarAmount,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });
    this.saveMarketState(s);

    return {
      success: true,
      newPrice: coin.price,
      message: `LIQUIDITY INJECTED: $${dollarAmount.toLocaleString()} deployed — $${coin.symbol} pumps ${((priceMult - 1) * 100).toFixed(1)}% to $${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toFixed(2)} (mcap $${(coin.marketCap / 1000000).toFixed(1)}M). Cash is spent — the market can still fade it.`,
    };
  }

  /**
   * RUG PULL — the founder exit scam. Sells the entire founder allocation
   * into the market at once with catastrophic slippage, kills the coin,
   * and returns the fan/community/legal consequences for GameContext to
   * apply. You only get one: the exchange blacklists you forever.
   */
  public static rugPullMyCoin(): {
    success: boolean;
    message: string;
    proceeds: number;
    consequences?: {
      fansLostPct: number;
      fameHitPct: number;
      reputationHit: number;
      industryRespectHit: number;
      fine: number;
      coinName: string;
      symbol: string;
    };
  } {
    const s = this.getMarketState();
    const coin = s.cryptoCoins.find((c) => c.isMyCoin && (c.status === 'Active' || c.status === 'TopLeader'));
    if (!coin) return { success: false, message: 'No live fan token to rug.', proceeds: 0 };
    const holdings = coin.playerHoldings || 0;
    if (holdings <= 0) return { success: false, message: 'You hold no founder allocation to dump.', proceeds: 0 };

    const supplyFrac = holdings / Math.max(1, coin.circulatingSupply);
    const slippage = Math.min(0.85, 0.35 + supplyFrac * 0.6); // 35% floor, worse the bigger the dump
    const grossValue = holdings * coin.price;
    const proceeds = Math.max(0, Math.round(grossValue * (1 - slippage)));

    coin.prevPrice = coin.price;
    coin.price = Math.max(0.000001, Math.round(coin.price * 0.02 * 1000000) / 1000000); // -98%
    coin.marketCap = Math.round(coin.price * coin.circulatingSupply);
    coin.volume24h = Math.round(coin.volume24h * 4); // panic volume
    coin.communityStrength = 3;
    coin.popularity = 5;
    coin.playerHoldings = 0;
    coin.playerAvgBuyPrice = 0;
    coin.status = 'RugPulled';
    coin.news = `$${coin.symbol} RUG PULL — founder wallet drained all liquidity. Investors wiped out.`;
    s.playerRugPulled = true;

    s.transactions.unshift({
      id: `tx_rug_${Date.now()}`,
      assetType: 'CRYPTO',
      assetId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      type: 'SELL',
      units: holdings,
      pricePerUnit: coin.price,
      totalCost: proceeds,
      week: s.currentWeek,
      year: s.currentYear,
      timestamp: `W${s.currentWeek}, ${s.currentYear}`,
    });

    // Rival celebrity/degen tokens soak up the fleeing liquidity
    s.cryptoCoins = s.cryptoCoins.map((c) =>
      c.id === coin.id ? c : (c.sector === 'Celebrity Fan Token' || c.risk === 'Extreme Degen') && (c.status === 'Active' || c.status === 'TopLeader')
        ? { ...c, volume24h: Math.round(c.volume24h * 1.4), popularity: Math.min(100, c.popularity + 5) }
        : c
    );
    this.saveMarketState(s);

    const consequences = {
      fansLostPct: Math.round(30 + Math.random() * 15),          // 30-45% of fans gone
      fameHitPct: Math.round(12 + Math.random() * 8),            // 12-20% fame wipe
      reputationHit: 12,
      industryRespectHit: 10,
      fine: Math.round(proceeds * 0.5),                          // regulators claw back half
      coinName: coin.name,
      symbol: coin.symbol,
    };

    return {
      success: true,
      proceeds,
      consequences,
      message: `RUG PULL EXECUTED on $${coin.symbol}: dumped ${holdings.toLocaleString()} tokens through ${(slippage * 100).toFixed(0)}% slippage for $${proceeds.toLocaleString()}. The coin is dead (-98%). Regulators, fans and the exchange are coming for you.`,
    };
  }

  /**
   * Live competitive snapshot of the player's fan token for the founder console.
   */
  public static getMyCoinStatus(): {
    coin: CryptoCoin | null;
    ruggedCoin: CryptoCoin | null;
    rank: number;
    totalLive: number;
    leader: CryptoCoin | null;
    blacklisted: boolean;
  } {
    const s = this.getMarketState();
    const live = s.cryptoCoins
      .filter((c) => c.status === 'Active' || c.status === 'TopLeader')
      .sort((a, b) => b.marketCap - a.marketCap);
    const coin = live.find((c) => c.isMyCoin) || null;
    const ruggedCoin = s.cryptoCoins.find((c) => c.isMyCoin && c.status === 'RugPulled') || null;
    return {
      coin,
      ruggedCoin,
      rank: coin ? live.findIndex((c) => c.id === coin.id) + 1 : 0,
      totalLive: live.length,
      leader: live[0] && live[0].id !== coin?.id ? live[0] : live[1] || null,
      blacklisted: !!s.playerRugPulled,
    };
  }
}

// ============================================================
// ENDLESS MARKET ENGINE (v2) — invisible procedural pool
// Coin generation + lifecycle now lives in the LIVING CRYPTO MARKET
// section above (regimes, listings, delists). This block keeps the
// endless STUDIO generator for stock bankruptcies/acquisitions.
// ============================================================

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const STUDIO_PREFIX = ['Apex', 'Stellar', 'Meridian', 'Cascade', 'Ironclad', 'Sunburst', 'Northstar', 'Vanguard', 'Golden', 'Silverline', 'Bluebird', 'Redwood', 'Crestline', 'Atlas', 'Monarch', 'Quill', 'Summit', 'Harbor', 'Sterling', 'Blackwood'];
const STUDIO_SUFFIX = ['Studios', 'Pictures', 'Entertainment', 'Films', 'Productions', 'Media', 'Pictures Group', 'Works', 'Cinema', 'Motion Co.', 'Pictures Co.', 'Entertainment Group', 'Films Co.', 'Studios Group'];

// ENDLESS STUDIO GENERATOR
export function generateEndlessStudio(existingTickers?: Set<string>): Omit<StockCompany, 'playerSharesOwned' | 'playerAvgBuyPrice' | 'playerBoardMember'> {
  const prefix = rand(STUDIO_PREFIX);
  const suffix = rand(STUDIO_SUFFIX);
  // ANTI-REPEAT: re-roll until the ticker is unique on the exchange
  let ticker = (prefix.slice(0, 2) + suffix.slice(0, 1)).toUpperCase();
  if (existingTickers) {
    let attempts = 0;
    while (existingTickers.has(ticker) && attempts < 40) {
      ticker = (prefix.slice(0, 2) + suffix.slice(0, 1)).toUpperCase() + String.fromCharCode(65 + Math.floor(Math.random() * 26));
      attempts++;
    }
  }
  const price = Math.round((5 + Math.random() * 60) * 100) / 100;
  const shares = Math.floor(10000000 + Math.random() * 90000000);
  const revenue = Math.floor(20000000 + Math.random() * 900000000);
  const profit = Math.floor(revenue * (0.03 + Math.random() * 0.2));
  const debt = Math.floor(revenue * (0.1 + Math.random() * 0.7));
  return {
    id: `stk_gen_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: `${prefix} ${suffix}`,
    ticker,
    industry: 'Media & Entertainment',
    ceo: rand(['Marcus Hayes', 'Seraphina Sterling', 'Damon Kincaid', 'Victoria Reign', 'Gabriel Stone', 'Nadia Frost']),
    logo: '🎬',
    sharePrice: price,
    prevPrice: price * 0.97,
    changePct: 3.1,
    marketCap: Math.floor(price * shares),
    sharesOutstanding: shares,
    revenue,
    profit,
    debt,
    growthRate: Math.floor(5 + Math.random() * 40),
    investorConfidence: Math.floor(45 + Math.random() * 45),
    ceoRating: Math.floor(55 + Math.random() * 40),
    newsSentiment: Math.floor(40 + Math.random() * 50),
    volatility: (['Low', 'Moderate', 'High'] as const)[Math.floor(Math.random() * 3)],
    rating: (['CCC', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA'] as const)[Math.floor(Math.random() * 5)],
    dividendYieldPct: Math.round((Math.random() * 3) * 100) / 100,
    history: `${prefix} ${suffix} is a mid-cap studio expanding across film, streaming and distribution.`,
    movies: [],
    series: [],
    upcomingProjects: ['Slate Expansion', 'Streaming Push', 'Franchise Development'],
    news: `${prefix} ${suffix} (${ticker}) goes public on Wall Street!`,
    chartData: [price * 0.9, price],
    status: 'Public',
    institutionalOwnershipPct: 50,
    insiderOwnershipPct: 20,
    publicOwnershipPct: 30,
    boardSeatsTotal: 9,
    playerBoardMember: false,
    weeksSinceListing: 0,
    weakStreak: 0,
    listedWeek: 1,
    listedYear: 2026,
  } as any;
}

// PROCESS ENDLESS LISTINGS + LIFECYCLES (call inside processEndWeek)
export function processEndlessMarket(s: any, playerWeek: number, playerYear: number): string[] {
  const news: string[] = [];

  // ---- COINS ----
  // Coin lifecycle (regimes, listings, delists) is handled by the living
  // crypto market section in processEndWeek — nothing to do here anymore.

  // ---- STUDIOS ----
  s.stocks = (s.stocks || []).map((st: any) => {
    if (st.status !== 'Public') return st;
    st.weeksSinceListing = (st.weeksSinceListing || 0) + 1;
    const price = st.sharePrice || 1;
    const weak = price < 1.5;
    st.weakStreak = weak ? (st.weakStreak || 0) + 1 : 0;
    // BANKRUPT: weak 6 weeks straight AND debt > 6x revenue
    const bankrupt = st.weakStreak >= 6 && (st.debt || 0) > (st.revenue || 1) * 6;
    if (bankrupt) {
      st.status = 'Bankrupt';
      st.news = `${st.name} (${st.ticker}) declares BANKRUPTCY. Shareholders wiped out.`;
      news.push(`💥 BANKRUPT: ${st.name} (${st.ticker}) collapsed under massive debt. Stock is worthless.`);
    }
    return st;
  });
  // ACQUISITIONS: healthy studio (cap >= 3x) buys a weak one; shareholders get +25% premium
  const publics = (s.stocks || []).filter((x: any) => x.status === 'Public');
  const weakTargets = publics.filter((x: any) => x.weakStreak >= 3 && (x.sharePrice || 1) < 8);
  if (weakTargets.length > 0 && publics.length >= 2) {
    const target = weakTargets[0];
    const acquirers = publics.filter((x: any) => x.id !== target.id && (x.marketCap || 0) >= (target.marketCap || 1) * 3 && x.weakStreak === 0);
    if (acquirers.length > 0 && Math.random() < 0.5) {
      const acquirer = acquirers[Math.floor(Math.random() * acquirers.length)];
      target.status = 'Acquired';
      target.news = `${target.name} (${target.ticker}) acquired by ${acquirer.name} — shareholders paid a 25% premium.`;
      news.push(`🤝 ACQUISITION: ${acquirer.name} (${acquirer.ticker}) acquired ${target.name} (${target.ticker})!`);
    }
  }
  // New endless studio IPOs every 4 weeks (keep up to 12 public)
  if (playerWeek % 4 === 0) {
    const publicCount = (s.stocks || []).filter((x: any) => x.status === 'Public').length;
    if (publicCount < 12) {
      const newStudio = generateEndlessStudio(new Set(s.stocks.map((x) => x.ticker))) as StockCompany;
      // normalize to the full StockCompany shape (news array + player fields)
      newStudio.news = Array.isArray(newStudio.news) ? newStudio.news : [String(newStudio.news)];
      newStudio.playerSharesOwned = 0;
      newStudio.playerAvgBuyPrice = 0;
      newStudio.playerBoardMember = false;
      (newStudio as any).listedWeek = playerWeek;
      (newStudio as any).listedYear = playerYear;
      s.stocks.push(newStudio);
      news.push(`🏦 NEW IPO: ${newStudio.name} (${newStudio.ticker}) begins trading at $${newStudio.sharePrice}!`);
    }
  }

  return news;
}
