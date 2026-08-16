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
  marketCap: number; // calculated: sharePrice * sharesOutstanding
  sharesOutstanding: number;
  revenue: number; // annual revenue $
  profit: number; // annual profit $
  debt: number; // total debt $
  growthRate: number; // % annual growth
  investorConfidence: number; // 0-100
  ceoRating: number; // 0-100
  newsSentiment: number; // -100 to +100
  volatility: VolatilityRating;
  rating: CompanyRating;
  dividendYieldPct: number;
  history: string;
  movies: string[];
  series: string[];
  upcomingProjects: string[];
  news: string[];
  chartData: number[]; // last 12 weeks
  status: CompanyStatus;
  weeksSinceListing?: number;
  weakStreak?: number;
  listedWeek?: number;
  listedYear?: number;
  institutionalOwnershipPct: number;
  insiderOwnershipPct: number;
  publicOwnershipPct: number;
  playerSharesOwned: number;
  playerAvgBuyPrice: number;
  boardSeatsTotal: number;
  playerBoardMember: boolean;
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
            whales: Array.isArray(parsed.whales) ? parsed.whales : INITIAL_WHALES,
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
      whales: INITIAL_WHALES,
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
  public static processEndWeek(playerWeek: number, playerYear: number, playerMoney: number): {
    updatedState: EconomyMarketState;
    headlineNews: string[];
    /** Structured crypto events (listings, delists, regimes) → inbox messages */
    cryptoEvents: Array<{ kind: string; subject: string; body: string; important: boolean }>;
    /** Forced-liquidation proceeds credited to the player this week */
    delistPayouts: number;
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
          };

          s.stocks.unshift(newStock);

          const launchNews = `WALL STREET IPO: ${ipo.companyName} (${ipo.ticker}) goes public at $${launchPrice}/share with $${(launchMarketCap / 1000000).toFixed(1)}M market cap!`;
          headlineNews.push(launchNews);

          return { ...ipo, status: 'Completed', weeksUntilLaunch: 0 };
        }
        return { ...ipo, weeksUntilLaunch: nextWeeks };
      }
      return ipo;
    });

    // 5. PERIODICALLY GENERATE NEW IPOS (Every 4 weeks)
    if (playerWeek % 4 === 0 && s.ipos.filter((i) => i.status === 'Upcoming').length < 3) {
      const newIpoNames = [
        { name: 'Vanguard AI VFX', ticker: 'VVFX', ind: 'Artificial Intelligence & Visual Tech', price: 24.0, rev: 120000000, profit: 18000000, debt: 20000000, desc: 'Next-gen cloud rendering pipeline for streaming platforms.' },
        { name: 'Metropolis Soundstages', ticker: 'METR', ind: 'Real Estate & Studios', price: 15.5, rev: 210000000, profit: 34000000, debt: 80000000, desc: 'Luxury film studio soundstage complex in Atlanta & Los Angeles.' },
        { name: 'Aura Fitness & Wellness', ticker: 'AURA', ind: 'Healthcare & Wellness', price: 28.0, rev: 95000000, profit: 14000000, debt: 10000000, desc: 'Celebrity wellness clinics and biometrics monitoring tech.' },
        { name: 'Starlight Live Streaming', ticker: 'STRT', ind: 'Media & Interactive', price: 12.0, rev: 68000000, profit: 5000000, debt: 12000000, desc: 'Interactive live red carpet streaming and fan monetization app.' },
      ];

      const pick = newIpoNames[Math.floor(Math.random() * newIpoNames.length)];
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
    delete (s as any)._delistPayouts;
    return { updatedState: s, headlineNews, cryptoEvents, delistPayouts };
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
      };
    }

    const totalDollarRevenue = coinAmount * coin.price;
    // ---- REALIZED PnL → CRYPTO TAX (fed weekly into the tax engine) ----
    const avgBuy = coin.playerAvgBuyPrice || 0;
    const realizedPerUnit = coin.price - avgBuy;
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
      message: `SWAP EXECUTED: Sold ${coinAmount.toFixed(4)} $${coin.symbol} receiving $${totalDollarRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!${taxNote}`,
      totalDollarRevenue,
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
    playerMoney: number
  ): { success: boolean; message: string } {
    const s = this.getMarketState();
    const deploymentCost = 100000;

    if (playerMoney < deploymentCost) {
      return { success: false, message: `Smart contract deployment fee requires $${deploymentCost.toLocaleString()}.` };
    }

    const cleanSymbol = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'STAR';

    const playerCoin: CryptoCoin = {
      id: `crypto_player_${Date.now()}`,
      name: coinName,
      symbol: cleanSymbol,
      price: initialPrice,
      prevPrice: initialPrice,
      change24h: 25.0,
      change7d: 50.0,
      marketCap: initialPrice * 10000000,
      circulatingSupply: 10000000,
      volume24h: 15000000,
      popularity: Math.min(100, Math.floor((playerFameXp || 0) / 100) + 50),
      communityStrength: 95,
      volatility: 'Extreme Degen',
      sector: 'Celebrity Fan Token',
      risk: 'High',
      techDescription: `Official celebrity fan cryptocurrency deployed on Hollywood Web3 Exchange. Price fluctuates with career fame and movie box office hits.`,
      sparkline: [initialPrice * 0.5, initialPrice * 0.75, initialPrice],
      news: `${coinName} ($${cleanSymbol}) launches on Web3 exchange powered by celebrity stardom!`,
      isMyCoin: true,
      status: 'TopLeader',
      playerHoldings: 1000000, // 10% founder allocation
      playerAvgBuyPrice: initialPrice,
    };

    s.cryptoCoins.unshift(playerCoin);
    s.playerCustomCryptosCount = (s.playerCustomCryptosCount || 0) + 1;
    this.saveMarketState(s);

    return {
      success: true,
      message: `WEB3 TOKEN DEPLOYED! $${cleanSymbol} (${coinName}) is now live with 1,000,000 token founder allocation!`,
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
export function generateEndlessStudio(): Omit<StockCompany, 'playerSharesOwned' | 'playerAvgBuyPrice' | 'playerBoardMember'> {
  const prefix = rand(STUDIO_PREFIX);
  const suffix = rand(STUDIO_SUFFIX);
  const ticker = (prefix.slice(0, 2) + suffix.slice(0, 1)).toUpperCase();
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
      const newStudio = generateEndlessStudio();
      (newStudio as any).listedWeek = playerWeek;
      (newStudio as any).listedYear = playerYear;
      s.stocks.push(newStudio);
      news.push(`🏦 NEW IPO: ${newStudio.name} (${newStudio.ticker}) begins trading at $${newStudio.sharePrice}!`);
    }
  }

  return news;
}
