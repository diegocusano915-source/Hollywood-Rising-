/**
 * HOLLYWOOD RISING - Empire System Types
 * Complete Phase 5 Empire Architecture Interface Definitions
 */

export type EmpireFeatureId =
  | 'HOLDING_COMPANY'
  | 'BUSINESS_VENTURES'
  | 'REAL_ESTATE'
  | 'RIVALRIES'
  | 'ELITE_CLUB'
  | 'ACTING_ACADEMY'
  | 'TAX_REVENUE'
  | 'ACHIEVEMENTS'
  | 'LEGACY'
  | 'CORPORATE_BOARD'
  | 'GLOBAL_EXPANSION'
  | 'FOUNDATION'
  | 'EMPIRE_DASHBOARD'
  | 'SECURITY'
  | 'INVESTMENTS'
  | 'REPORTS';

export type ExecutiveRole =
  | 'CEO'
  | 'COO'
  | 'CFO'
  | 'Marketing Director'
  | 'Creative Director'
  | 'Legal Counsel'
  | 'HR Director'
  | 'Studio President'
  | 'Operations Director';

export interface Executive {
  id: string;
  name: string;
  role: ExecutiveRole;
  salary: number;
  bonus: number;
  efficiency: number; // 1 - 100
  morale: number; // 1 - 100
  leadership: number; // 1 - 100
  experience: number; // 1 - 100
  negotiation: number; // 1 - 100
  creativity: number; // 1 - 100
  loyalty: number; // 1 - 100
  performance: number; // 1 - 100
  avatarUrl: string;
  background: string;
  yearsEmployed: number;
}

export interface HoldingCompany {
  isFormed: boolean;
  name: string;
  logo: string; // Icon or Emblem identifier
  headquarters: string; // 'Beverly Hills' | 'Manhattan' | 'London' | 'Tokyo' | 'Paris' | 'Dubai'
  industryFocus: string;
  ceoName: string;
  executives: Executive[];
  equitySharePercent: number;
  dividendPayoutRate: number; // Percent
  totalValuation: number;
}

export interface BusinessProduct {
  id: string;
  name: string;
  price: number;
  productionCost: number;
  weeklySales: number;
  rating: number; // 1.0 - 5.0
  reviewsCount: number;
  weeklyRevenue: number;
  launchWeek: number;
  launchYear: number;
}

export type BusinessEmployeeRole =
  | 'CEO'
  | 'Manager'
  | 'Engineer'
  | 'Developer'
  | 'Designer'
  | 'Marketing'
  | 'HR'
  | 'Security'
  | 'Lawyer'
  | 'Accountant'
  | 'Support'
  | 'Warehouse';

export interface BusinessStaffGroup {
  role: BusinessEmployeeRole;
  count: number;
  weeklyCostPerPerson: number;
}

export interface BusinessCompetitor {
  id: string;
  name: string;
  marketShare: number;
  priceLevel: 'Budget' | 'Standard' | 'Premium' | 'Luxury';
  rating: number;
  recentAction: string;
}

export interface BusinessBranch {
  id: string;
  locationName: string;
  staffCount: number;
  weeklyRevenue: number;
  weeklyRent: number;
  status: 'Active' | 'Under Renovation' | 'Closing';
}

export type BusinessPerformanceTrend =
  | 'Growing'
  | 'Declining'
  | 'Industry Leader'
  | 'Losing Market Share'
  | 'Recovering'
  | 'Bankrupt'
  | 'Stable';

export interface BusinessVenture {
  id: string;
  name: string;
  industry: string; // 30+ choices
  logo: string;
  cashPool: number;
  weeklyRevenue: number;
  weeklyExpenses: number;
  netProfit: number;
  totalValuation: number;
  marketShare: number; // percent
  customerRating: number; // 1.0 - 5.0
  isPublic: boolean;
  totalShares: number;
  sharePrice: number;
  products: BusinessProduct[];
  staff: BusinessStaffGroup[];
  branches?: BusinessBranch[];
  branchesCount?: number;
  employeeBonusPercent?: number;
  salaryMultiplier?: number;
  performanceTrend?: BusinessPerformanceTrend;
  executives: Executive[];
  competitors: BusinessCompetitor[];
  status: 'Active' | 'Distressed' | 'Bankrupt' | 'Acquired' | 'Sold';
  fundingRaised: number;
  foundedWeek: number;
  foundedYear: number;
}

export type RealEstateType =
  | 'Hotel'
  | 'Office Tower'
  | 'Shopping Mall'
  | 'Film Lot'
  | 'Apartment Complex'
  | 'Resort'
  | 'Industrial Building'
  | 'Warehouse';

export type PropertyOccupancyStatus =
  | 'Owned'
  | 'Occupied'
  | 'Vacant'
  | 'Rented'
  | 'Under Renovation';

export interface CommercialRealEstate {
  id: string;
  name: string;
  type: RealEstateType;
  location: string;
  purchasePrice: number;
  currentValuation: number;
  weeklyRentalIncome: number;
  weeklyMaintenanceCost: number;
  occupancyRate: number; // percent
  occupancyStatus?: PropertyOccupancyStatus;
  tierLevel: number; // 1 - 5
  isLeased: boolean;
  imageUrl: string;
}

// SECURITY TYPES
export type SecurityCategory =
  | 'Personal Bodyguards'
  | 'Executive Protection'
  | 'Home Security'
  | 'Office Security'
  | 'Cyber Security'
  | 'Travel Security'
  | 'Family Security'
  | 'Event Security';

export interface SecurityPackage {
  id: string;
  name: string;
  category: SecurityCategory;
  weeklyCost: number;
  protectionRating: number; // 1 - 100
  description: string;
  isHired: boolean;
}

export interface SecurityIncident {
  id: string;
  title: string;
  category: SecurityCategory;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  prevented: boolean;
  week: number;
  year: number;
  description: string;
}

export interface SecurityState {
  activePackages: SecurityPackage[];
  incidents: SecurityIncident[];
  overallSecurityScore: number;
}

// INVESTMENT TYPES
export type InvestmentSector =
  | 'Film Studios'
  | 'Technology'
  | 'Retail'
  | 'Healthcare'
  | 'Media'
  | 'Hospitality'
  | 'Real Estate'
  | 'Sports';

export interface InvestmentOpportunity {
  id: string;
  title: string;
  companyName: string;
  sector: InvestmentSector;
  sharePrice: number;
  totalSharesAvailable: number;
  volatility: 'Low' | 'Medium' | 'High' | 'Extreme';
  dividendYieldPercent: number;
  description: string;
  historicalReturnPercent: number;
}

export interface InvestmentPortfolioItem {
  id: string;
  opportunityId: string;
  companyName: string;
  sector: InvestmentSector;
  sharesOwned: number;
  averageBuyPrice: number;
  currentSharePrice: number;
  totalInvested: number;
  currentValue: number;
  totalDividendsEarned: number;
}

export interface InvestmentState {
  portfolio: InvestmentPortfolioItem[];
  totalInvested: number;
  totalCurrentValue: number;
  weeklyDividendYield: number;
}

// REPORT TYPES
export type ReportPeriod = 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';

export interface BusinessReport {
  id: string;
  period: ReportPeriod;
  week: number;
  year: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  activeBusinessesCount: number;
  topPerformingBusiness: string;
  executiveSummary: string;
  growthRatePercent: number;
}

export interface ReportsState {
  reportsHistory: BusinessReport[];
}

// CORPORATE BOARD & ACQUISITIONS
export interface AcquisitionRequirement {
  minCash: number;
  minBusinessRep: number;
  minStudioRep: number;
  minInvestorConfidence: number;
  minOwnerRelation: number;
  minIndustryRep: number;
  minFinancialStability: number;
}

export interface AcquisitionTargetCompany {
  id: string;
  companyName: string;
  industry: string;
  valuation: number;
  askingPrice: number;
  weeklyRevenue: number;
  weeklyExpenses: number;
  debtLevel: number;
  growthPotential: number; // 1-100
  requirements: AcquisitionRequirement;
  description: string;
  isAcquired?: boolean;
}

export type RivalryLevel =
  | 'Calm'
  | 'Tension'
  | 'Rival'
  | 'Feud'
  | 'Arch Rival'
  | 'Legendary Rival';

export interface RivalryTimelineEvent {
  id: string;
  week: number;
  year: number;
  eventText: string;
  category?: 'Award' | 'Audition' | 'Social Media' | 'Legal' | 'Business' | 'Interview' | 'Peace' | 'General';
}

export interface RivalryNPC {
  id: string;
  name: string;
  role: 'Actor' | 'Director' | 'Producer' | 'Studio Executive' | 'Tech Billionaire' | 'Pop Star';
  avatarUrl: string;
  relationshipLevel: RivalryLevel;
  heatLevel: RivalryLevel;
  rivalryScore: number; // 0 - 100
  cause: string;
  weekStarted: number;
  yearStarted: number;
  career: string;
  moviesTogether: string[];
  awardsCompared: { playerWon: number; rivalWon: number };
  socialMediaActivity: {
    followersCount: number;
    sentiment: 'Aggressive' | 'Passive-Aggressive' | 'Mocking' | 'Respectful';
    trendingHashtag: string;
  };
  timeline: RivalryTimelineEvent[];
  fansCount: number;
  legalHistory: string[];
  businessHistory: string[];
  lastEventDescription: string;
  mediaHeadlines: string[];
  directorSupport: string;
  studioReaction: string;
  peaceProposed?: boolean;
  isBlocked?: boolean;
}

export type EliteCategory =
  | 'Actor'
  | 'Musician'
  | 'Athlete'
  | 'Billionaire'
  | 'Tech CEO'
  | 'Director'
  | 'Fashion Icon'
  | 'Luxury Mogul'
  | 'Royal Family'
  | 'Politician';

export interface EliteNPC {
  id: string;
  name: string;
  title: string;
  gender: 'Male' | 'Female';
  category: EliteCategory;
  avatarUrl: string;
  age: number;
  nationality: string;
  netWorth: number;
  companyName: string;
  socialHandle: string;
  relationshipScore: number; // -100 to +100
  status: 'Acquaintance' | 'Member' | 'Close VIP' | 'Business Partner' | 'Rival' | 'Romantic Interest';
}

export interface EliteEventOption {
  id: string;
  title: string;
  category:
    | 'Charity Gala'
    | 'Movie Premiere'
    | 'Private Party'
    | 'Business Summit'
    | 'Luxury Auction'
    | 'Casino Night'
    | 'Yacht Weekend'
    | 'Award After Party'
    | 'Fashion Show'
    | 'Tech Summit'
    | 'Island Retreat'
    | 'Investor Meeting';
  cost: number;
  minFameRequired: number;
  description: string;
}

export interface EliteEventLog {
  id: string;
  eventTitle: string;
  week: number;
  year: number;
  attendeesCount: number;
  outcome: string;
  impactText: string;
}

export interface EliteClubState {
  isMember: boolean;
  joinedWeek?: number;
  joinedYear?: number;
  yearlyDuesPaid: boolean;
  eliteNpcs: EliteNPC[];
  eventHistory: EliteEventLog[];
}

export interface AcademyStudent {
  id: string;
  name: string;
  talentType: string;
  skillRating: number;
  tuitionPaid: number;
  status: 'Enrolled' | 'Graduated' | 'Star Actor';
  currentFilmCredit?: string;
}

export interface ActingAcademyState {
  isOpen: boolean;
  name: string;
  campusLevel: number;
  teachersCount: number;
  students: AcademyStudent[];
  totalGraduates: number;
  weeklyTuitionIncome: number;
  weeklyOperationalCost: number;
  scholarshipsAwarded: number;
}

export interface AuditRecord {
  week: number;
  year: number;
  passed: boolean;
  penaltyOrSavings: number;
  note: string;
}

export interface TaxBreakdown {
  incomeTax: number;
  corporateTax: number;
  propertyTax: number;
  luxuryTax: number;
  internationalTax: number;
  capitalGainsTax: number;
  accountantTier: 'None' | 'Standard CPA' | 'Boutique Firm' | 'Elite Offshore Tax Attorneys';
  totalTaxDue: number;
  taxSaved: number;
  auditRiskPercent: number;
  auditHistory: AuditRecord[];
}

export interface EmpireAchievement {
  id: string;
  title: string;
  description: string;
  category: 'Career' | 'Business' | 'Awards' | 'Empire' | 'Social Media' | 'Money' | 'Secret';
  rewardCash: number;
  rewardFameXp: number;
  isUnlocked: boolean;
  unlockedWeek?: number;
  unlockedYear?: number;
  progress: number;
  maxProgress: number;
}

export interface LegacyMilestone {
  id: string;
  title: string;
  category: 'Career' | 'Movie' | 'Business' | 'Award' | 'Empire' | 'Philanthropy';
  week: number;
  year: number;
  dateText: string;
  description: string;
  statValue?: string;
}

export interface LegacyState {
  hallOfFameRank: string;
  hallOfFameScore: number;
  museumName?: string;
  greatestMovie?: string;
  peakNetWorth: number;
  lifetimeEarnings: number;
  lifetimeBoxOffice: number;
  businessEmpireValuation: number;
  realEstateValuation: number;
  philanthropyDonatedTotal: number;
  walkOfFameStar: boolean;
  autobiographyPublished: boolean;
  milestones: LegacyMilestone[];
  highestGrossingFilm?: { title: string; gross: number };
  mostAwardedFilm?: { title: string; awardsCount: number };
  awardsWonCount: number;
  totalMoviesActed: number;
  totalMoviesDirected: number;
  totalBusinessesCreated: number;
  totalGlobalHubsBuilt: number;
  worldRecordsCount: number;
}

export interface BoardResolution {
  week: number;
  year: number;
  title: string;
  passed: boolean;
  votesFor: number;
  votesAgainst: number;
}

export interface CorporateBoardState {
  chairmanName: string;
  boardMembers: Executive[];
  quarterlyApprovalRate: number;
  recentResolutions: BoardResolution[];
}

export interface GlobalRegion {
  id: 'north_america' | 'south_america' | 'europe' | 'africa' | 'asia' | 'australia';
  name: string;
  flagEmoji: string;
  taxRate: number;
  marketDemand: 'Explosive' | 'High' | 'Moderate' | 'Emerging';
  regulatoryFriction: 'Low' | 'Medium' | 'Strict';
  officesBuilt: number;
  regionalRevenue: number;
  localCompetitorsCount: number;
}

export interface FoundationCause {
  id: string;
  name: string;
  category: 'Hospitals' | 'Schools' | 'Scholarships' | 'Film Grants' | 'Disaster Relief' | 'Community Projects';
  totalDonated: number;
  impactRating: number;
  publicGoodwillBonus: number;
}

export interface BoardSeatOption {
  companyName: string;
  industry: string;
  annualCompensation: number;
  stockOptionsGrant: number;
  minFameRequired: number;
}

export interface GlobalHubOption {
  cityName: string;
  country: string;
  cost: number;
  weeklyExpense: number;
  regionalBonus: string;
}

export interface GlobalOffice {
  id: string;
  cityName: string;
  country: string;
  regionalBonus: string;
  establishmentCost: number;
  weeklyOperatingExpense: number;
  weeklyRegionalRevenue: number;
  localStaffCount: number;
  establishedWeek: number;
  establishedYear: number;
}

export interface FoundationCauseOption {
  name: string;
  category: string;
  goodwillBoost: number;
  description: string;
}

export interface BoardSeat {
  id: string;
  companyName: string;
  industry: string;
  annualCompensation: number;
  stockOptionsGrant: number;
  votingPowerSharesPercent: number;
  boardMeetingFrequency: 'Quarterly' | 'Annual';
  status: 'Active' | 'Resigned';
  joinedWeek: number;
  joinedYear: number;
}

export interface FoundationState {
  isEstablished: boolean;
  name: string;
  endowmentPool: number;
  totalDonated: number;
  goodwillScore: number;
  taxDeductionsClaimed: number;
  causes: FoundationCause[];
}

export interface EmpireFullState {
  lastProcessedWeek: number;
  lastProcessedYear: number;
  migrationVersion?: number;
  holdingCompany: HoldingCompany;
  businesses: BusinessVenture[];
  realEstate: CommercialRealEstate[];
  rivalries: RivalryNPC[];
  eliteClub: EliteClubState;
  actingAcademy: ActingAcademyState;
  taxState: TaxBreakdown;
  achievements: EmpireAchievement[];
  legacy: LegacyState;
  corporateBoard: CorporateBoardState;
  boardSeats: BoardSeat[];
  globalRegions: GlobalRegion[];
  globalHubs: GlobalOffice[];
  foundation: FoundationState;
  security?: SecurityState;
  investments?: InvestmentState;
  reports?: ReportsState;
  acquisitionsCatalog?: AcquisitionTargetCompany[];
  empireLogs: { id: string; title: string; description: string; week: number; year: number }[];
}
