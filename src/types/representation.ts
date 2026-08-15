/**
 * HOLLYWOOD RISING - Representation System Data Models
 * Defines data structures for the 13 Representation features:
 * 1. Public Relations
 * 2. Law Firm
 * 3. Brand Partnerships
 * 4. Sponsorships
 * 5. Media Center
 * 6. Fan Club
 * 7. Merchandise
 * 8. Image & Reputation
 * 9. Contract Archive
 * 10. International Representation
 * 11. Official Website
 * 12. Media Gallery
 * 13. Charity & Public Causes
 */

export type RepresentationFeatureId =
  | 'TALENT_AGENTS'
  | 'PERSONAL_MANAGERS'
  | 'HOLLYWOOD_INSIDER'
  | 'PUBLIC_RELATIONS'
  | 'LAW_FIRM'
  | 'BRAND_PARTNERSHIPS'
  | 'SPONSORSHIPS'
  | 'MEDIA_CENTER'
  | 'FAN_CLUB'
  | 'MERCHANDISE'
  | 'IMAGE_REPUTATION'
  | 'CONTRACT_ARCHIVE'
  | 'INTERNATIONAL_REP'
  | 'OFFICIAL_WEBSITE'
  | 'MEDIA_GALLERY'
  | 'CHARITY_CAUSES';

// 1. PUBLIC RELATIONS
export type PRAgencyTier = 'None' | 'Specialist' | 'Boutique Agency' | 'A-List PR Firm';

export interface PRCampaign {
  id: string;
  type: 'PRESS_RELEASE' | 'CRISIS_MANAGEMENT' | 'PUBLIC_STATEMENT' | 'MEDIA_TRAINING' | 'INTERVIEW_PREP';
  title: string;
  description: string;
  cost: number;
  reputationImpact: number;
  trustImpact: number;
  weeksDuration: number;
  weeksRemaining: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface ScandalItem {
  id: string;
  title: string;
  cause: string;
  severity: 'MINOR' | 'MODERATE' | 'CRITICAL';
  reputationDamage: number;
  weekOccurred: number;
  yearOccurred: number;
  resolved: boolean;
  resolutionStrategy?: string;
  story?: string;
  source?: 'EVENT' | 'NPC_ATTACK' | 'PLAYER_ACTION' | 'INTERVIEW';
  instigator?: string;
  fansLost?: number;
  resolutionNote?: string;
}

export type FanClubTierId = 'backstage' | 'frontRow' | 'redCarpet' | 'directorSuite' | 'legendCircle';

export interface FanClubFeedItem {
  id: string;
  author: string;
  tier: FanClubTierId | 'Staff';
  text: string;
  likes: number;
  week: number;
  year: number;
  isPlayer?: boolean;
}

export interface PRState {
  hiredAgencyTier: PRAgencyTier;
  weeklyRetainerFee: number;
  activeCampaigns: PRCampaign[];
  scandals: ScandalItem[];
  mediaTrainingLevel: number; // 0 - 100
  pressReleasesIssued: number;
}

// 2. LAW FIRM
export type LawFirmTier = 'None' | 'Solo Attorney' | 'Entertainment Law Boutique' | 'Beverly Hills Elite Legal';

export interface LawsuitItem {
  id: string;
  title: string;
  claimant: string;
  type: 'CONTRACT_DISPUTE' | 'COPYRIGHT_DISPUTE' | 'SLANDER_DEFAMATION' | 'ACQUISITION_DISPUTE';
  demandedAmount: number;
  status: 'ACTIVE' | 'SETTLED' | 'WON' | 'LOST';
  resolutionNote?: string;
  weekFiled: number;
  yearFiled: number;
}

export interface TrademarkItem {
  id: string;
  name: string;
  category: 'FILM_TITLE' | 'BRAND_NAME' | 'CHARACTER_NAME' | 'MERCH_LINE';
  registeredDate: string;
  registrationCost: number;
}

export interface LawFirmState {
  hiredFirmTier: LawFirmTier;
  weeklyRetainerFee: number;
  trademarks: TrademarkItem[];
  lawsuits: LawsuitItem[];
  contractsReviewedCount: number;
  willsReviewed: boolean;
}

// 3. BRAND PARTNERSHIPS
export type BrandCategory = 'Fashion' | 'Beauty' | 'Tech' | 'Beverage' | 'Automotive' | 'Luxury Watch';

export interface BrandDealOffer {
  id: string;
  brandName: string;
  brandCategory: BrandCategory;
  brandLogoUrl: string;
  contractLengthWeeks: number;
  weeklyPayment: number;
  totalValue: number;
  requiredFame: number;
  requiredReputation: number;
  status: 'OFFER_PENDING' | 'ACTIVE' | 'COMPLETED' | 'DECLINED' | 'EXPIRED';
  weeksRemaining: number;
  dateSigned?: string;
  deliverables: string;
}

// 4. SPONSORSHIPS
export type SponsorshipCategory =
  | 'Sports Brands'
  | 'Luxury Brands'
  | 'Technology'
  | 'Fashion'
  | 'Cars'
  | 'Streaming'
  | 'Food';

export interface MajorSponsorship {
  id: string;
  sponsorName: string;
  category: SponsorshipCategory;
  annualValue: number;
  weeklyValue: number;
  perksDescription: string;
  requiredFameXp: number;
  requiredMoviesCount: number;
  status: 'OFFER' | 'ACTIVE' | 'EXPIRED';
  weeksRemaining: number;
}

// 5. MEDIA CENTER
export type MediaItemType =
  | 'Article'
  | 'TV Interview'
  | 'Radio Interview'
  | 'Magazine Cover'
  | 'Podcast'
  | 'News Report'
  | 'Press Conference'
  | 'Movie Promotion';

export interface MediaCenterItem {
  id: string;
  type: MediaItemType;
  title: string;
  source: string;
  dateText: string;
  snippet: string;
  fameGained: number;
  reputationImpact: number;
  imageUrl?: string;
}

// 6. FAN CLUB
export interface FanClubState {
  isCreated: boolean;
  name: string;
  createdWeek?: number;
  createdYear?: number;
  membersCount: number;
  freeMembers: number;
  silverMembers: number;
  goldVipMembers: number;
  weeklyDuesRevenue: number;
  announcements: { id: string; title: string; content: string; date: string }[];
  hostedEventsCount: number;
  tierCounts: Record<FanClubTierId, number>;
  feed: FanClubFeedItem[];
}

// 7. MERCHANDISE
export type MerchProductCategory = 'Shirts' | 'Hoodies' | 'Caps' | 'Posters' | 'Accessories' | 'Movie Memorabilia';

export interface MerchProduct {
  id: string;
  name: string;
  category: MerchProductCategory;
  unitCost: number;
  sellingPrice: number;
  inventory: number;
  totalSold: number;
  weeklySales: number;
  totalRevenue: number;
  totalProfit: number;
  vipOnly?: boolean; // Legend Circle fans only
  movieTied?: string; // movie title it's tied to
  limitedDrop?: boolean; // limited-time drop (buzz)
  dropWeeksLeft?: number;
}

// 8. IMAGE & REPUTATION
export interface ReputationMetrics {
  publicReputation: number; // 0 - 100
  industryReputation: number; // 0 - 100
  professionalism: number; // 0 - 100
  publicTrust: number; // 0 - 100
  controversyIndex: number; // 0 - 100
  worldwidePopularity: number; // 0 - 100
}

// 9. CONTRACT ARCHIVE
export type ContractType = 'MOVIE' | 'SERIES' | 'ENDORSEMENT' | 'SPONSORSHIP' | 'BUSINESS' | 'LEGAL';

export interface ArchivedContract {
  id: string;
  title: string;
  contractType: ContractType;
  counterparty: string;
  valueText: string;
  dateSigned: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
  details: string;
}

// 10. INTERNATIONAL REPRESENTATION
export type GlobalRegionId = 'NORTH_AMERICA' | 'EUROPE' | 'ASIA' | 'AFRICA' | 'SOUTH_AMERICA' | 'AUSTRALIA';

export interface RegionalAgency {
  id: GlobalRegionId;
  regionName: string;
  headquarters: string;
  minFameXpRequired: number;
  isUnlocked: boolean;
  signedAgencyName?: string;
  commissionPercent: number;
  perks: string;
}

// 11. OFFICIAL WEBSITE
export interface WebsiteState {
  isLaunched: boolean;
  domainName: string;
  designTier: 'Basic' | 'Sleek Modern' | 'Custom Luxury Portal';
  weeklyVisitors: number;
  hasBio: boolean;
  hasFilmography: boolean;
  hasAwards: boolean;
  hasUpcomingProjects: boolean;
  hasBusinessPortfolio: boolean;
  launchWeek?: number;
  launchYear?: number;
  // Website v2
  weeklyIncome?: number;
  totalIncome?: number;
  adEnabled?: boolean;
  merchEnabled?: boolean;
  boostLevel?: number; // paid marketing boosts (1-5)
  visitsHistory?: number[];
}

// 12. MEDIA GALLERY
export type MediaGalleryCategory =
  | 'Movie Poster'
  | 'Magazine Cover'
  | 'Award Photo'
  | 'Red Carpet'
  | 'Interview'
  | 'Promotional';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: MediaGalleryCategory;
  imageUrl: string;
  caption: string;
  dateEarned: string;
}

// 13. CHARITY & PUBLIC CAUSES
export interface CharityCause {
  id: string;
  name: string;
  category: 'Hospitals' | 'Schools' | 'Foundations' | 'Scholarships' | 'Disaster Relief' | 'Film Education' | 'Community Projects';
  description: string;
  totalDonated: number;
  isFoundationEstablished: boolean;
  foundationName?: string;
  reputationBonus: number;
  trustBonus: number;
  legacyScoreBonus: number;
}

// FULL REPRESENTATION STATE
export interface RepresentationFullState {
  pr: PRState;
  lawFirm: LawFirmState;
  brandOffers: BrandDealOffer[];
  sponsorships: MajorSponsorship[];
  mediaCenter: MediaCenterItem[];
  fanClub: FanClubState;
  merchandise: MerchProduct[];
  reputation: ReputationMetrics;
  contractsArchive: ArchivedContract[];
  regionalAgencies: RegionalAgency[];
  website: WebsiteState;
  mediaGallery: GalleryPhoto[];
  charities: CharityCause[];
  // Weekly rotating agent/manager marketplace (talent representation)
  offersWeek?: number;
  weeklyAgentIds?: string[];
  weeklyManagerIds?: string[];
  pendingAgentPitches?: string[];
  pendingManagerPitches?: string[];
}

