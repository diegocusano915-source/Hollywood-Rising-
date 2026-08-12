/**
 * HOLLYWOOD RISING - Network System Data Models (Phase 4)
 * Complete TypeScript interfaces for all 13 Network features.
 */

export type NetworkFeatureId =
  | 'JOB_BOARD'
  | 'HEALTH'
  | 'PROPERTIES'
  | 'VEHICLES'
  | 'NET_WORTH'
  | 'BANK'
  | 'VAULT'
  | 'SECURITY'
  | 'SYNDICATION'
  | 'BANKABLE_100'
  | 'FORBES_LIST'
  | 'FINANCIAL_ADVISOR'
  | 'ESTATE_PLANNING'
  | 'FINANCIAL_REPUTATION'
  | 'FUTURE_EXPANSION';

// 1. JOB BOARD
export interface JobItem {
  id: string;
  title: string;
  company: string;
  category: 'Part-Time' | 'Entertainment' | 'Corporate' | 'Luxury';
  weeklySalary: number;
  energyCost: number;
  maxWeeks: number;
  currentWeek: number;
  isEntertainment: boolean;
  networkingBonus: number; // +Fame/XP boost per week
  description: string;
}

export interface ActiveJob extends JobItem {
  weeksRemaining: number;
  totalEarned: number;
}

// 2. HEALTH & WELLNESS
export interface HealthService {
  id: string;
  name: string;
  category: 'Gym' | 'Spa' | 'Therapy' | 'Medical' | 'Cosmetic';
  cost: number;
  weeklyCost?: number;
  energyBonus: number;
  actingBonus?: number;
  relationshipBonus?: number;
  description: string;
  isSubscription?: boolean;
}

export interface HealthInsurancePlan {
  id: string;
  providerName: string;
  tier: 'Basic' | 'Standard' | 'Premium' | 'Elite' | 'Executive';
  weeklyCost: number;
  coveragePercent: number; // 20% to 95%
  recoverySpeedBonusPercent: number;
  treatmentQualityBonusPercent: number;
  description: string;
}

export interface MedicalRecordEntry {
  id: string;
  week: number;
  year: number;
  type:
    | 'Checkup'
    | 'Consultation'
    | 'Specialist'
    | 'Emergency'
    | 'Therapy'
    | 'Dental'
    | 'Vision'
    | 'Vaccination'
    | 'Screening'
    | 'Injury'
    | 'Insurance Claim';
  title: string;
  doctorNotes: string;
  cost: number;
  insuranceCoveredAmount: number;
  outOfPocket: number;
}

export interface AnnualHealthReportData {
  year: number;
  overallScore: number;
  physicalScore: number;
  mentalScore: number;
  fitnessScore: number;
  sleepScore: number;
  stressScore: number;
  lifestyleRating: 'Elite Athlete' | 'Optimal Mogul' | 'Healthy' | 'Moderate Risk' | 'Critical Burnout';
  doctorRecommendations: string[];
}

export interface HealthEventEntry {
  id: string;
  week: number;
  year: number;
  title: string;
  category: 'Cold' | 'Food Poisoning' | 'Injury' | 'Strain' | 'Fatigue' | 'Burnout Warning' | 'Exhaustion';
  severity: 'Mild' | 'Moderate' | 'Severe';
  description: string;
  activeImpact: string;
  resolved: boolean;
}

export interface PlayerHealthState {
  // Core Metrics (0-100)
  healthScore: number; // Overall Health
  physicalHealth: number;
  mentalHealth: number;
  energy: number;
  stress: number;
  happiness: number;
  burnoutRisk: number;
  fitnessLevel: number;
  sleepQuality: number;
  nutritionLevel: number;

  // Sleep Specs
  sleepHours: number;
  fatigueLevel: number;

  // Active Insurance & Diet
  activeInsurancePlanId: string | null;
  activeDietId: string | null;
  weeklyDietCost: number;

  // Active Subscriptions
  activeGymId: string | null;
  weeklyHealthExpense: number;

  // Bonuses & Legacy Compatibility
  energyMaxBonus: number;
  cosmeticAppealBonus: number;

  // History & Records
  treatmentHistory: { name: string; week: number; cost: number }[];
  medicalRecords: MedicalRecordEntry[];
  annualReports: AnnualHealthReportData[];
  activeHealthEvents: HealthEventEntry[];
}

// 3. PROPERTIES
export type PropertyTier = 'Small' | 'Medium' | 'High' | 'Elite';

export interface PropertyItem {
  id: string;
  name: string;
  location: string;
  tier: PropertyTier;
  price: number;
  downPayment: number; // 20%
  weeklyMortgage: number;
  weeklyUpkeep: number;
  weeklyRentIncome: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  description: string;
  isOwned: boolean;
  isMortgaged?: boolean;
  mortgageRemaining?: number;
  isPrimaryResidence?: boolean;
  isRentedOut?: boolean;
}

// 4. VEHICLES
export type VehicleTier = 'Small' | 'Medium' | 'High' | 'Elite';

export interface VehicleItem {
  id: string;
  name: string;
  brand: string;
  tier: VehicleTier;
  price: number;
  weeklyUpkeep: number; // Maintenance & insurance
  cloutBonus: number; // Social media/fame bonus
  topSpeed: string;
  imageUrl: string;
  description: string;
  isOwned: boolean;
  isPrimaryDrive?: boolean;
}

// 5. NET WORTH
export interface FinancialSummary {
  cash: number;
  checkingBalance: number;
  savingsBalance: number;
  businessBalance: number;
  investmentBalance: number;
  propertyValue: number;
  propertyDebt: number;
  vehicleValue: number;
  vaultValue: number;
  bankLoans: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  weeklyIncome: number;
  weeklyExpenses: number;
  weeklyNetChange: number;
  careerHighNetWorth: number;
  history: { week: number; netWorth: number }[];
}

// 6. BANK & FINANCIAL REPUTATION
export type FinancialReputationRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';

export interface GeneratedLoanOffer {
  id: string;
  title: string; // 'Starter Loan', 'Business Expansion Loan', 'Studio Growth Loan', 'Luxury Investment Loan', 'Corporate Acquisition Loan'
  type: 'Personal Loan' | 'Business Line' | 'Mortgage' | 'Emergency Credit' | 'Studio Growth' | 'Acquisition';
  principal: number;
  interestRatePct: number;
  weeklyPayment: number;
  weeksLength: number;
  totalRepayment: number;
  riskRating: 'Low' | 'Moderate' | 'High' | 'Extreme';
  requirements: {
    minCreditScore: number;
    minNetWorth: number;
    minWeeklyIncome: number;
    minReputationScore?: number;
  };
  description: string;
}

export interface BankLoan {
  id: string;
  type: 'Personal Loan' | 'Business Line' | 'Mortgage' | 'Emergency Credit' | 'Studio Growth' | 'Acquisition';
  title?: string;
  principal: number;
  balanceRemaining: number;
  weeklyPayment: number;
  interestRatePct: number;
  weeksRemaining: number;
  weeksLength?: number;
  approvalWeek?: number;
  status: 'ACTIVE' | 'PAID_OFF' | 'REFINANCED' | 'DEFAULTED';
}

export interface TransactionRecord {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  week: number;
}

export interface FinancialReport {
  id: string;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  week: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  incomeBreakdown: {
    movieRoyalties: number;
    actingJobs: number;
    businessProfit: number;
    dividends: number;
    propertyRent: number;
    other: number;
  };
  expenseBreakdown: {
    taxes: number;
    loanRepayments: number;
    propertyUpkeep: number;
    vehicleUpkeep: number;
    securityCosts: number;
    advisorRetainers: number;
    productionCosts: number;
    marketingCosts: number;
    other: number;
  };
  netWorth: number;
  creditScore: number;
}

export interface BankAccount {
  checkingBalance: number;
  savingsBalance: number;
  savingsApy: number; // weekly interest
  businessBalance: number;
  investmentBalance: number;
  offshoreBalance: number;
  offshoreApy: number;
  creditScore: number; // 300 - 850 (starts at 320)
  loansRepaidCount?: number; // Multiple successfully repaid loans
  onTimePaymentsCount?: number; // On-time weekly repayments
  missedPaymentsCount?: number; // Missed or late repayments
  loanDefaultsCount?: number; // Total defaulted loans
  creditAgeWeeks?: number; // Long repayment history (weeks)
  bankReputation: number; // 0-100
  reputationRating: FinancialReputationRating;
  activeLoans: BankLoan[];
  loanHistory: BankLoan[];
  preGeneratedOffers: GeneratedLoanOffer[];
  transactionHistory: TransactionRecord[];
  financialReports?: FinancialReport[];
  creditCards?: string[]; // card names owned
  autoSaveEnabled?: boolean;
  savingsGoal?: number;
  lifetimeInterestEarned?: number;
  taxComplianceScore?: number; // 0-100
  auditRiskPct?: number; // 0-100
  taxRetainerPaid?: boolean;
  // CREDIT SCORE MULTI-FACTOR (v2)
  cardUsageCount?: number; // times card used
  cardOnTimeCount?: number; // card payments on time
  cardMaxedCount?: number; // times card usage maxed (penalty)
  wealthFactorEarned?: boolean; // already got wealth boost
  weeklyIncomeHistory?: number[]; // last 8 weeks income for stability
  lastCreditBoostWeek?: number;
  creditBreakdown?: { factor: string; points: number }[];
}

// 7. VAULT & AUCTIONS
export type VaultCategory =
  | 'Awards'
  | 'Watches'
  | 'Jewelry'
  | 'Gold'
  | 'Scripts & Props'
  | 'Art'
  | 'Collectibles';

export interface VaultItem {
  id: string;
  name: string;
  category: VaultCategory;
  estimatedValue: number;
  purchasePrice: number;
  acquiredWeek: number;
  rarity: 'Rare' | 'Very Rare' | 'Exquisite' | 'Legendary' | 'One-of-a-Kind';
  description: string;
  imageUrl?: string;
}

export interface AuctionLot {
  id: string;
  title: string;
  category: VaultCategory;
  startingBid: number;
  currentBid: number;
  highBidder: string;
  item: VaultItem;
  isPlayerItem?: boolean;
  bidsCount: number;
  status: 'UPCOMING' | 'LIVE' | 'SOLD';
}

// 8. SECURITY
export type SecurityRole =
  | 'Bodyguards'
  | 'Drivers'
  | 'Residence Guards'
  | 'Travel Guards'
  | 'Studio Guards'
  | 'Vault Guards'
  | 'Cyber Specialists'
  | 'Private Investigators'
  | 'Medical Response Team'
  | 'K9 Unit';

export interface SecurityPersonnelItem {
  id: string;
  name: string;
  role: SecurityRole;
  weeklySalary: number;
  trainingLevel: 'Standard' | 'Tactical' | 'Elite' | 'Special Forces';
  isHired: boolean;
  contractWeeksRemaining: number;
  equipment: string[];
}

export interface SecurityPackage {
  id: string;
  name: string;
  category: 'Bodyguards' | 'Home Defense' | 'Cyber Security' | 'Executive Protection' | 'Travel Security' | 'Property Security' | 'Vault Security';
  weeklyCost: number;
  protectionRatingBonus: number; // %
  description: string;
  isHired: boolean;
}

export interface SecurityReport {
  week: number;
  incidentName: string;
  status: 'THWARTED' | 'WARNING' | 'BREACHED';
  details: string;
}

// 9. SYNDICATION
export interface RoyaltySource {
  id: string;
  title: string;
  type: 'Movie' | 'TV Series';
  releaseYear: number;
  weeklyRoyaltyAmount: number;
  totalRoyaltiesEarned: number;
  syndicationTier: 'Local TV' | 'Cable Network' | 'Global Streaming' | 'Worldwide Broadcast';
  isHit: boolean;
}

// 10. BANKABLE 100
export interface BankableStar {
  rank: number;
  name: string;
  starRating: '5 Stars' | '4.5 Stars' | '4 Stars' | '3.5 Stars' | '3 Stars' | '2 Stars' | '1 Star';
  avgBoxOfficeGross: string;
  quotePerFilm: string;
  primaryGenre: string;
  isPlayer: boolean;
  score: number;
}

// 11. FORBES LIST
export interface ForbesCelebrity {
  rank: number;
  name: string;
  category: 'Actor' | 'Director' | 'Producer' | 'Musician' | 'Mogul';
  netWorth: number;
  topAsset: string;
  isPlayer: boolean;
}

// 12. FINANCIAL ADVISOR
export type AdvisorTier = 'Small' | 'Medium' | 'High' | 'Elite';

export interface FinancialAdvisor {
  id: string;
  name: string;
  firm: string;
  tier: AdvisorTier;
  weeklyRetainer: number;
  taxReductionPct: number; // reduces weekly expenses
  loanDiscountPct: number; // lowers loan interest rates
  description: string;
  avatar: string;
}

export interface AdvisorWeeklyReport {
  week: number;
  summary: string;
  recommendations: string[];
  taxSaved: number;
}

// 13. ESTATE PLANNING
export type EstateWillStatus =
  | 'NOT_STARTED'
  | 'WRITTEN_DRAFT'
  | 'SENT_TO_LAWYER'
  | 'LAWYER_REVIEWED'
  | 'CORRECTIONS_PENDING'
  | 'PLAYER_APPROVED'
  | 'OFFICIALLY_REGISTERED';

export interface HeirItem {
  id: string;
  name: string;
  relation: string; // 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Friend' | 'Business Partner' | 'Manager' | 'Charity' | 'Foundation' | 'Studio'
  percentage: number;
  condition?: string;
}

export interface EstatePlan {
  willCreated: boolean;
  status: EstateWillStatus;
  spousePct: number;
  childrenPct: number;
  charityPct: number;
  trustFundBalance: number;
  foundationName: string;
  foundationBalance: number;
  foundationImpactScore: number;
  lawyerReviewNotes?: string;
  contestedByFamily?: boolean;
  legalChallengeDetails?: string;
  heirAllocations?: HeirItem[];
  selectedLawyerId?: string;
  lastUpdatedWeek?: number;
  willHistory?: { week: number; event: string }[];
}

// COMBINED NETWORK STATE PERSISTED IN LOCALSTORAGE
export interface NetworkFullState {
  migrationVersion?: number;
  lastProcessedWeek: number;
  lastProcessedYear: number;
  activeJobs: ActiveJob[];
  healthState: PlayerHealthState;
  properties: PropertyItem[];
  vehicles: VehicleItem[];
  bankAccount: BankAccount;
  vaultItems: VaultItem[];
  auctionLots: AuctionLot[];
  securityPackages: SecurityPackage[];
  securityPersonnel?: SecurityPersonnelItem[];
  securityLogs: SecurityReport[];
  syndicationSources: RoyaltySource[];
  hiredAdvisorId: string | null;
  advisorReports: AdvisorWeeklyReport[];
  estatePlan: EstatePlan;
  watchlist: string[];
  forbesList?: ForbesCelebrity[];
  bankableStarsList?: BankableStar[];
}
