/**
 * HOLLYWOOD RISING - Representation Service
 * Data Manager & Simulation Engine for Representation Scene
 */

import { Player, BookedProject, ReleasedMovie } from '../types/game';
import {
  RepresentationFullState,
  PRAgencyTier,
  LawFirmTier,
  PRCampaign,
  ScandalItem,
  BrandDealOffer,
  MajorSponsorship,
  MediaCenterItem,
  MerchProduct,
  ArchivedContract,
  RegionalAgency,
  GalleryPhoto,
  CharityCause,
} from '../types/representation';

const STORAGE_KEY = 'HOLLYWOOD_REPRESENTATION_STATE_V3';

const INITIAL_REGIONAL_AGENCIES: RegionalAgency[] = [
  {
    id: 'NORTH_AMERICA',
    regionName: 'North America',
    headquarters: 'Los Angeles & New York',
    minFameXpRequired: 0,
    isUnlocked: true,
    signedAgencyName: 'CAA / WME Talent Agency',
    commissionPercent: 10,
    perks: 'Direct access to Hollywood majors, Netflix, and HBO Max.',
  },
  {
    id: 'EUROPE',
    regionName: 'Europe',
    headquarters: 'London & Paris',
    minFameXpRequired: 150,
    isUnlocked: false,
    commissionPercent: 12,
    perks: 'Unlocks BAFTA contendors, European luxury fashion galas, and BBC drama leads.',
  },
  {
    id: 'ASIA',
    regionName: 'Asia-Pacific',
    headquarters: 'Tokyo, Beijing & Seoul',
    minFameXpRequired: 300,
    isUnlocked: false,
    commissionPercent: 15,
    perks: 'Unlocks East Asian blockbuster co-productions, anime voice leads, and tech ambassadorships.',
  },
  {
    id: 'SOUTH_AMERICA',
    regionName: 'South America',
    headquarters: 'São Paulo & Buenos Aires',
    minFameXpRequired: 450,
    isUnlocked: false,
    commissionPercent: 12,
    perks: 'Unlocks Latin American festival circuits, telenovela guest spots, and streaming hits.',
  },
  {
    id: 'AFRICA',
    regionName: 'Africa',
    headquarters: 'Johannesburg & Lagos',
    minFameXpRequired: 600,
    isUnlocked: false,
    commissionPercent: 10,
    perks: 'Unlocks Nollywood cinema features and Pan-African cultural ambassadorships.',
  },
  {
    id: 'AUSTRALIA',
    regionName: 'Australia & Oceania',
    headquarters: 'Sydney & Melbourne',
    minFameXpRequired: 750,
    isUnlocked: false,
    commissionPercent: 10,
    perks: 'Unlocks Fox Studios Australia productions and Pacific oceania brand sponsorships.',
  },
];

export const INITIAL_REPRESENTATION_STATE: RepresentationFullState = {
  pr: {
    hiredAgencyTier: 'None',
    weeklyRetainerFee: 0,
    activeCampaigns: [],
    scandals: [],
    mediaTrainingLevel: 0,
    pressReleasesIssued: 0,
  },
  lawFirm: {
    hiredFirmTier: 'None',
    weeklyRetainerFee: 0,
    trademarks: [],
    lawsuits: [],
    contractsReviewedCount: 0,
    willsReviewed: false,
  },
  brandOffers: [],
  sponsorships: [],
  mediaCenter: [],
  fanClub: {
    isCreated: false,
    name: '',
    membersCount: 0,
    freeMembers: 0,
    silverMembers: 0,
    goldVipMembers: 0,
    weeklyDuesRevenue: 0,
    announcements: [],
    hostedEventsCount: 0,
  },
  merchandise: [],
  reputation: {
    publicReputation: 0,
    industryReputation: 0,
    professionalism: 0,
    publicTrust: 0,
    controversyIndex: 0,
    worldwidePopularity: 0,
  },
  contractsArchive: [],
  regionalAgencies: INITIAL_REGIONAL_AGENCIES,
  website: {
    isLaunched: false,
    domainName: '',
    designTier: 'Basic',
    weeklyVisitors: 0,
    hasBio: true,
    hasFilmography: true,
    hasAwards: true,
    hasUpcomingProjects: true,
    hasBusinessPortfolio: true,
  },
  mediaGallery: [],
  charities: [],
};

export class RepresentationService {
  private static cachedState: RepresentationFullState | null = null;

  public static getState(): RepresentationFullState {
    if (this.cachedState) return this.cachedState;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);

        // Deep merge: overwrite only the keys that exist in parsed,
        // but keep default structure for any missing section.
        const defaultState = { ...INITIAL_REPRESENTATION_STATE };

        const merged: RepresentationFullState = {
          ...defaultState,
          ...parsed,
          // Arrays and objects that need special handling to prevent missing sub-properties:
          pr: parsed.pr
            ? {
                ...defaultState.pr,
                ...parsed.pr,
                activeCampaigns: Array.isArray(parsed.pr.activeCampaigns) ? parsed.pr.activeCampaigns : defaultState.pr.activeCampaigns,
                scandals: Array.isArray(parsed.pr.scandals) ? parsed.pr.scandals : defaultState.pr.scandals,
              }
            : defaultState.pr,
          lawFirm: parsed.lawFirm
            ? {
                ...defaultState.lawFirm,
                ...parsed.lawFirm,
                trademarks: Array.isArray(parsed.lawFirm.trademarks) ? parsed.lawFirm.trademarks : defaultState.lawFirm.trademarks,
                lawsuits: Array.isArray(parsed.lawFirm.lawsuits) ? parsed.lawFirm.lawsuits : defaultState.lawFirm.lawsuits,
              }
            : defaultState.lawFirm,
          brandOffers: Array.isArray(parsed.brandOffers) ? parsed.brandOffers : defaultState.brandOffers,
          sponsorships: Array.isArray(parsed.sponsorships) ? parsed.sponsorships : defaultState.sponsorships,
          mediaCenter: Array.isArray(parsed.mediaCenter) ? parsed.mediaCenter : defaultState.mediaCenter,
          fanClub: parsed.fanClub
            ? {
                ...defaultState.fanClub,
                ...parsed.fanClub,
                announcements: Array.isArray(parsed.fanClub.announcements) ? parsed.fanClub.announcements : defaultState.fanClub.announcements,
              }
            : defaultState.fanClub,
          merchandise: Array.isArray(parsed.merchandise) ? parsed.merchandise : defaultState.merchandise,
          reputation: parsed.reputation
            ? { ...defaultState.reputation, ...parsed.reputation }
            : defaultState.reputation,
          contractsArchive: Array.isArray(parsed.contractsArchive) ? parsed.contractsArchive : defaultState.contractsArchive,
          regionalAgencies: Array.isArray(parsed.regionalAgencies) ? parsed.regionalAgencies : defaultState.regionalAgencies,
          website: parsed.website
            ? { ...defaultState.website, ...parsed.website }
            : defaultState.website,
          mediaGallery: Array.isArray(parsed.mediaGallery) ? parsed.mediaGallery : defaultState.mediaGallery,
          charities: Array.isArray(parsed.charities) ? parsed.charities : defaultState.charities,
        };

        this.cachedState = merged;
        return merged;
      }
    } catch (e) {
      console.error('Error reading Representation state from storage:', e);
    }

    this.cachedState = { ...INITIAL_REPRESENTATION_STATE };
    this.saveState(this.cachedState);
    return this.cachedState;
  }

  public static saveState(state: RepresentationFullState): void {
    this.cachedState = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving Representation state:', e);
    }
  }

  /**
   * Called during End Week in GameContext
   */
  public static processEndWeek(
    player: Player,
    bookedProjects: BookedProject[] = [],
    releasedMovies: ReleasedMovie[] = []
  ): { weeklyEarnings: number; weeklyExpenses: number; notifications: string[]; prWeeklyCost?: number; lawWeeklyCost?: number; fanClubDues?: number; merchProfit?: number } {
    const state = this.getState();
    let weeklyEarnings = 0;
    let weeklyExpenses = 0;
    const notifications: string[] = [];

    // 1. Deduct PR Retainer Fee
    if (state.pr.hiredAgencyTier !== 'None' && state.pr.weeklyRetainerFee > 0) {
      if (player.money >= state.pr.weeklyRetainerFee) {
        weeklyExpenses += state.pr.weeklyRetainerFee;
      } else {
        notifications.push(
          `⚠️ Insufficient funds for PR Retainer ($${state.pr.weeklyRetainerFee.toLocaleString()}). PR Agency service paused.`
        );
      }
    }

    // 2. Deduct Law Firm Retainer Fee
    if (state.lawFirm.hiredFirmTier !== 'None' && state.lawFirm.weeklyRetainerFee > 0) {
      if (player.money >= state.lawFirm.weeklyRetainerFee) {
        weeklyExpenses += state.lawFirm.weeklyRetainerFee;
      } else {
        notifications.push(
          `⚠️ Insufficient funds for Legal Retainer ($${state.lawFirm.weeklyRetainerFee.toLocaleString()}). Law Firm service paused.`
        );
      }
    }

    // 3. Update Active PR Campaigns
    state.pr.activeCampaigns = state.pr.activeCampaigns.map((camp) => {
      if (camp.status === 'ACTIVE') {
        const rem = camp.weeksRemaining - 1;
        if (rem <= 0) {
          // Campaign completed -> boost reputation & trust
          state.reputation.publicReputation = Math.min(100, state.reputation.publicReputation + camp.reputationImpact);
          state.reputation.publicTrust = Math.min(100, state.reputation.publicTrust + camp.trustImpact);
          notifications.push(`📣 PR Campaign Completed: "${camp.title}"! Boosted Reputation & Trust.`);
          return { ...camp, weeksRemaining: 0, status: 'COMPLETED' };
        }
        return { ...camp, weeksRemaining: rem };
      }
      return camp;
    });

    // 4. Process Active Brand Deals
    state.brandOffers = state.brandOffers.map((offer) => {
      if (offer.status === 'ACTIVE') {
        weeklyEarnings += offer.weeklyPayment;
        const rem = offer.weeksRemaining - 1;
        if (rem <= 0) {
          notifications.push(`🤝 Brand Partnership with ${offer.brandName} successfully completed!`);
          return { ...offer, weeksRemaining: 0, status: 'COMPLETED' };
        }
        return { ...offer, weeksRemaining: rem };
      }
      return offer;
    });

    // 5. Generate Brand Offers if Player Has Earned Fame - BALANCED TIER 1 (requires Fame 200 + 1 movie + 1000 fans, no offers first 4 weeks)
    const hasCompletedMovieForBrand = (player.moviesCompleted || 0) >= 1;
    const hasFanBaseForBrand = (player.fans || 0) >= 1000;
    const meetsFameForBrand = player.fameXp >= 200;
    const isIncubationPeriod = (player.dateWeek || 1) <= 4 && (player.dateYear || 2026) === 2026 && (player.moviesCompleted || 0) === 0;
    if (meetsFameForBrand && hasCompletedMovieForBrand && hasFanBaseForBrand && !isIncubationPeriod) {
      const activePendingCount = state.brandOffers.filter(
        (b) => b.status === 'OFFER_PENDING' || b.status === 'ACTIVE'
      ).length;

      if (activePendingCount < 2 && Math.random() < 0.20) {
        const generatedOffer = this.generateBrandOfferForPlayer(player);
        if (generatedOffer) {
          state.brandOffers.unshift(generatedOffer);
          notifications.push(`📩 New Brand Partnership offer received from ${generatedOffer.brandName}!`);
        }
      }
    }

    // 6. Generate Major Sponsorship Offers - BALANCED TIER 1 (requires Fame 500 + 2 movies + 5000 fans + SAG, no offers first 4 weeks)
    const hasCompletedMoviesForSponsor = (player.moviesCompleted || 0) >= 2;
    const hasFanBaseForSponsor = (player.fans || 0) >= 5000;
    const isSagForSponsor = player.isUnionMember === true;
    const meetsFameForSponsor = player.fameXp >= 500;
    const isIncubationForSponsor = (player.dateWeek || 1) <= 4;
    if (meetsFameForSponsor && hasCompletedMoviesForSponsor && hasFanBaseForSponsor && isSagForSponsor && !isIncubationForSponsor) {
      const activeSponsorsCount = state.sponsorships.filter((s) => s.status === 'ACTIVE' || s.status === 'OFFER').length;
      if (activeSponsorsCount < 1 && Math.random() < 0.15) {
        const sponsorOffer = this.generateSponsorshipOfferForPlayer(player);
        if (sponsorOffer) {
          state.sponsorships.unshift(sponsorOffer);
          notifications.push(`🎯 Major Sponsorship offer received from ${sponsorOffer.sponsorName}!`);
        }
      }
    }

    // 7. Process Fan Club Revenue & Growth
    if (state.fanClub.isCreated) {
      // Fan club members grow based on player's overall fans count
      const totalFans = Math.max(10, player.fans || 0);
      const targetMembers = Math.floor(totalFans * 0.25);
      if (state.fanClub.membersCount < targetMembers) {
        const growth = Math.max(5, Math.floor((targetMembers - state.fanClub.membersCount) * 0.1));
        state.fanClub.membersCount += growth;
        state.fanClub.freeMembers = Math.floor(state.fanClub.membersCount * 0.7);
        state.fanClub.silverMembers = Math.floor(state.fanClub.membersCount * 0.22);
        state.fanClub.goldVipMembers = Math.floor(state.fanClub.membersCount * 0.08);
      }

      // Calculate weekly dues revenue ($2 per Silver, $10 per Gold)
      const dues = state.fanClub.silverMembers * 2 + state.fanClub.goldVipMembers * 10;
      state.fanClub.weeklyDuesRevenue = dues;
      weeklyEarnings += dues;
    }

    // 8. Process Merchandise Weekly Sales
    if (state.merchandise.length > 0) {
      let totalMerchProfit = 0;
      state.merchandise = state.merchandise.map((item) => {
        if (item.inventory > 0) {
          // Demand scales with fans & popularity
          const baseDemand = Math.floor(Math.max(2, (player.fans || 10) * 0.05 + state.reputation.worldwidePopularity * 2));
          const salesThisWeek = Math.min(item.inventory, baseDemand);
          const revenue = salesThisWeek * item.sellingPrice;
          const cost = salesThisWeek * item.unitCost;
          const profit = revenue - cost;

          totalMerchProfit += profit;

          return {
            ...item,
            inventory: item.inventory - salesThisWeek,
            weeklySales: salesThisWeek,
            totalSold: item.totalSold + salesThisWeek,
            totalRevenue: item.totalRevenue + revenue,
            totalProfit: item.totalProfit + profit,
          };
        }
        return { ...item, weeklySales: 0 };
      });

      if (totalMerchProfit > 0) {
        weeklyEarnings += totalMerchProfit;
      }
    }

    // 9. Process Website Traffic
    if (state.website.isLaunched) {
      const activeMoviesCount = releasedMovies ? releasedMovies.filter((m) => m.inCinemas).length : 0;
      const baseVisitors = Math.floor(
        (player.fans || 50) * 0.05 + player.fameXp * 5 + activeMoviesCount * 1500 + (state.fanClub.isCreated ? 100 : 0)
      );
      state.website.weeklyVisitors = Math.max(10, baseVisitors);
    }

    // 10. Sync Contracts Archive with Booked Projects & Released Movies
    this.syncContractsArchive(state, player, bookedProjects, releasedMovies);

    // 11. Sync Media Gallery with Released Movies
    this.syncMediaGallery(state, player, releasedMovies);

    const prWeeklyCost = state.pr.hiredAgencyTier !== 'None' ? state.pr.weeklyRetainerFee : 0;
    const lawWeeklyCost = state.lawFirm.hiredFirmTier !== 'None' ? state.lawFirm.weeklyRetainerFee : 0;
    const fanClubDues = state.fanClub.isCreated ? state.fanClub.weeklyDuesRevenue : 0;
    const merchProfit = state.merchandise.reduce((sum, item) => sum + (item.weeklySales ? item.weeklySales * (item.sellingPrice - item.unitCost) : 0), 0);

    // Update regional agencies unlock status based on Fame
    state.regionalAgencies = state.regionalAgencies.map((agency) => {
      if (!agency.isUnlocked && player.fameXp >= agency.minFameXpRequired) {
        notifications.push(`🌍 Regional Representation Unlocked in ${agency.regionName}!`);
        return { ...agency, isUnlocked: true };
      }
      return agency;
    });

    this.saveState(state);

    return { weeklyEarnings, weeklyExpenses, prWeeklyCost, lawWeeklyCost, fanClubDues, merchProfit, notifications };
  }

  // Generate realistic Brand Offers based on player stats
  private static generateBrandOfferForPlayer(player: Player): BrandDealOffer | null {
    const BRANDS: { name: string; category: BrandDealOffer['brandCategory']; logoUrl: string; deliverable: string }[] = [
      { name: 'Balenciaga', category: 'Fashion', logoUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150', deliverable: 'Red Carpet Gala Wardrobe & Billboard Campaign' },
      { name: 'Gucci', category: 'Fashion', logoUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150', deliverable: 'Global Milan Fashion Week Brand Ambassadorship' },
      { name: 'Rolex', category: 'Luxury Watch', logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150', deliverable: 'Exclusive Oscar Night Timepiece Placement' },
      { name: 'Apple Vision', category: 'Tech', logoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150', deliverable: 'Spatial Cinema Product Endorsement' },
      { name: 'Perrier', category: 'Beverage', logoUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=150', deliverable: 'Cannes Film Festival Hospitality Sponsorship' },
      { name: 'Porsche', category: 'Automotive', logoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150', deliverable: 'Malibu Driving Commercial & Social Media Spot' },
      { name: 'Sephora Beauty', category: 'Beauty', logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150', deliverable: 'Signature Fragrance & Makeup Collection Line' },
    ];

    const chosen = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const id = `brand_offer_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const weeklyPayment = Math.floor(300 + (player.fameXp || 0) * 12 + Math.random() * 200); // Balanced: was 180+ fame*85 (too high early)
    const lengthWeeks = [4, 8, 12, 26][Math.floor(Math.random() * 4)];

    return {
      id,
      brandName: chosen.name,
      brandCategory: chosen.category,
      brandLogoUrl: chosen.logoUrl,
      contractLengthWeeks: lengthWeeks,
      weeklyPayment,
      totalValue: weeklyPayment * lengthWeeks,
      requiredFame: Math.max(10, player.fameXp - 5),
      requiredReputation: 40,
      status: 'OFFER_PENDING',
      weeksRemaining: lengthWeeks,
      deliverables: chosen.deliverable,
    };
  }

  // Generate Major Sponsorship Offers
  private static generateSponsorshipOfferForPlayer(player: Player): MajorSponsorship | null {
    const SPONSORS: { name: string; category: MajorSponsorship['category']; perk: string }[] = [
      { name: 'Nike Worldwide', category: 'Sports Brands', perk: 'Custom Signature Footwear Line & $50,000 Annual Apparel Allowance' },
      { name: 'Mercedes-Maybach', category: 'Cars', perk: 'Complimentary Chauffeur V12 Maybach Sedan for all Hollywood Events' },
      { name: 'Leica Cameras', category: 'Technology', perk: 'Custom 24K Gold Leica M11 Camera & Cannes Festival Lounge VIP Access' },
      { name: 'Omega Watches', category: 'Luxury Brands', perk: 'Custom Tourbillon Timepiece & Private Jet Flight Hours' },
      { name: 'Chanel Haute Couture', category: 'Fashion', perk: 'Exclusive Met Gala Wardrobe Design & Paris Front-Row Seats' },
      { name: 'Sony Pictures Streaming', category: 'Streaming', perk: 'First-Look Producer Deal & Custom Bel-Air Screening Room Setup' },
    ];

    const chosen = SPONSORS[Math.floor(Math.random() * SPONSORS.length)];
    const id = `spons_offer_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const weeklyVal = Math.floor(500 + (player.fameXp || 0) * 8 + Math.random() * 300); // Balanced: was 400+fame*120

    return {
      id,
      sponsorName: chosen.name,
      category: chosen.category,
      annualValue: weeklyVal * 52,
      weeklyValue: weeklyVal,
      perksDescription: chosen.perk,
      requiredFameXp: 40,
      requiredMoviesCount: 1,
      status: 'OFFER',
      weeksRemaining: 52,
    };
  }

  // Sync Contracts Archive
  private static syncContractsArchive(
    state: RepresentationFullState,
    player: Player,
    bookedProjects: BookedProject[],
    releasedMovies: ReleasedMovie[]
  ): void {
    const existingIds = new Set(state.contractsArchive.map((c) => c.id));

    // Booked projects contracts
    bookedProjects.forEach((bp) => {
      const id = `contract_movie_${bp.id}`;
      if (!existingIds.has(id)) {
        state.contractsArchive.unshift({
          id,
          title: `Film Production Agreement: "${bp.movieTitle}"`,
          contractType: 'MOVIE',
          counterparty: 'Hollywood Production Studio',
          valueText: `$${bp.salary.toLocaleString()}`,
          dateSigned: `Week ${player.dateWeek}, ${player.dateYear}`,
          status: 'ACTIVE',
          details: `Role: ${bp.roleType}. Duration: ${bp.totalFilmingWeeks} Filming Weeks. Includes SAG-AFTRA minimum rates and standard back-end residual terms.`,
        });
      }
    });

    // Released movies contracts
    releasedMovies.forEach((rm) => {
      const id = `contract_movie_released_${rm.id}`;
      if (!existingIds.has(id)) {
        state.contractsArchive.unshift({
          id,
          title: `Released Feature Contract: "${rm.movieTitle}"`,
          contractType: 'MOVIE',
          counterparty: 'Global Distribution Studio',
          valueText: `$${rm.playerEarnings.toLocaleString()} + Box Office Residuals`,
          dateSigned: `Week ${player.dateWeek}, ${player.dateYear}`,
          status: 'COMPLETED',
          details: `Role: ${rm.roleType}. Worldwide Box Office: $${rm.worldwideGross.toLocaleString()}. Rotten Tomatoes Audience: ${rm.audienceRating}%.`,
        });
      }
    });
  }

  // Sync Media Gallery
  private static syncMediaGallery(
    state: RepresentationFullState,
    player: Player,
    releasedMovies: ReleasedMovie[]
  ): void {
    const existingIds = new Set(state.mediaGallery.map((p) => p.id));

    releasedMovies.forEach((rm) => {
      const posterId = `gallery_poster_${rm.id}`;
      if (!existingIds.has(posterId)) {
        state.mediaGallery.unshift({
          id: posterId,
          title: `Official Film Poster: "${rm.movieTitle}"`,
          category: 'Movie Poster',
          imageUrl: rm.posterUrl,
          caption: `Official theatrical release poster for "${rm.movieTitle}". Worldwide Gross: $${rm.worldwideGross.toLocaleString()}.`,
          dateEarned: `Week ${player.dateWeek}, ${player.dateYear}`,
        });
      }
    });
  }
}
