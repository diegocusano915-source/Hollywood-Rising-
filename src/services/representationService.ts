/**
 * HOLLYWOOD RISING - Representation Service
 * Data Manager & Simulation Engine for Representation Scene
 */

import { Player, BookedProject, ReleasedMovie } from '../types/game';
import { AgentInfo, ManagerInfo } from '../types/game';
import { AGENT_POOL, MANAGER_POOL, NPC_FAN_NAMES, NPC_CELEBRITY_POOL, BLOGGER_HANDLES } from '../database/representationDatabase';
import { FanClubTierId } from '../types/representation';
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
    tierCounts: { backstage: 0, frontRow: 0, redCarpet: 0, directorSuite: 0, legendCircle: 0 },
    feed: [],
  },
  offersWeek: 0,
  weeklyAgentIds: [],
  weeklyManagerIds: [],
  pendingAgentPitches: [],
  pendingManagerPitches: [],
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
                tierCounts: parsed.fanClub.tierCounts ? { ...defaultState.fanClub.tierCounts, ...parsed.fanClub.tierCounts } : defaultState.fanClub.tierCounts,
                feed: Array.isArray(parsed.fanClub.feed) ? parsed.fanClub.feed : defaultState.fanClub.feed,
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
    const hasCompletedMovieForBrand = (player.moviesCompleted || 0) >= 2;
    const hasFanBaseForBrand = (player.fans || 0) >= 2000;
    const meetsFameForBrand = player.fameXp >= 300; // Level 2
    const isIncubationPeriod = player.fameXp < 300; // Level 2 - no brands until Level 2
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

    // 6. Generate Major Sponsorship Offers - MANAGER-GATED (corporate sponsorships only
    // come through your Personal Manager; Fame 800 + 5 movies + 10000 fans + SAG also required)
    const hasCompletedMoviesForSponsor = (player.moviesCompleted || 0) >= 5;
    const hasFanBaseForSponsor = (player.fans || 0) >= 10000;
    const isSagForSponsor = player.isUnionMember === true;
    const meetsFameForSponsor = player.fameXp >= 800;
    const hasManagerForSponsor = !!player.representation?.manager?.signed;
    if (hasManagerForSponsor && meetsFameForSponsor && hasCompletedMoviesForSponsor && hasFanBaseForSponsor && isSagForSponsor) {
      const activeSponsorsCount = state.sponsorships.filter((s) => s.status === 'ACTIVE' || s.status === 'OFFER').length;
      if (activeSponsorsCount < 1 && Math.random() < 0.15) {
        const sponsorOffer = this.generateSponsorshipOfferForPlayer(player);
        if (sponsorOffer) {
          state.sponsorships.unshift(sponsorOffer);
          notifications.push(`🎯 Major Sponsorship offer received from ${sponsorOffer.sponsorName} (via ${player.representation.manager.name})!`);
        }
      }
    }

    // 6b. ACTIVE MAJOR SPONSORSHIP PAYOUTS (real weekly money, manager takes his cut)
    if (state.sponsorships.length > 0) {
      const criticalScandalActive = state.pr.scandals.some((sc) => !sc.resolved && sc.severity === 'CRITICAL');
      state.sponsorships = state.sponsorships.map((sp) => {
        if (sp.status === 'ACTIVE' && sp.weeksRemaining > 0) {
          sp.weeksRemaining -= 1;
          if (criticalScandalActive) {
            notifications.push(`⏸️ ${sp.sponsorName} paused payouts while your CRITICAL scandal is active.`);
            return sp;
          }
          let pay = sp.weeklyValue || 0;
          let mgrCut = 0;
          if (player.representation?.manager?.signed) {
            mgrCut = Math.floor(pay * ((player.representation.manager.commissionPercent || 8) / 100));
            pay -= mgrCut;
          }
          weeklyEarnings += pay;
          notifications.push(`💰 ${sp.sponsorName} sponsorship paid $${pay.toLocaleString()} this week${mgrCut > 0 ? ` (manager cut $${mgrCut.toLocaleString()})` : ''}.`);
          if (sp.weeksRemaining <= 0) {
            sp.status = 'EXPIRED';
            notifications.push(`✅ Sponsorship concluded: ${sp.sponsorName}.`);
          }
        }
        return sp;
      });
    }

    // 7. FAN CLUB — REBUILT: 5 tiers, yearly dues paid in weekly installments, real feed
    if (state.fanClub.isCreated) {
      const totalFans = Math.max(10, player.fans || 0);
      const targetMembers = Math.floor(totalFans * 0.25);

      // Real growth sources: fan count, fresh releases (surge), award momentum
      const freshRelease = releasedMovies && releasedMovies[0] && (releasedMovies[0].weeksInCinemas || 99) <= 2;
      const surgeMult = freshRelease ? 1.18 : 1;
      // Real shrinkage: active CRITICAL scandals cause cancellations
      const criticalScandals = state.pr.scandals.filter((sc) => !sc.resolved && sc.severity === 'CRITICAL').length;
      const cancelMult = criticalScandals > 0 ? 0.9 : 1;

      if (state.fanClub.membersCount < targetMembers * surgeMult) {
        const growth = Math.max(5, Math.floor((targetMembers * surgeMult - state.fanClub.membersCount) * 0.12));
        state.fanClub.membersCount = Math.max(0, Math.floor((state.fanClub.membersCount + growth) * cancelMult));
      } else if (criticalScandals > 0) {
        state.fanClub.membersCount = Math.max(0, Math.floor(state.fanClub.membersCount * cancelMult));
      }

      // 5-TIER SPLIT (Backstage -> Legend Circle)
      const mc = state.fanClub.membersCount;
      const backstage = Math.floor(mc * 0.5);
      const frontRow = Math.floor(mc * 0.26);
      const redCarpet = Math.floor(mc * 0.14);
      const directorSuite = Math.floor(mc * 0.07);
      const legendCircle = Math.max(0, mc - backstage - frontRow - redCarpet - directorSuite);
      state.fanClub.tierCounts = { backstage, frontRow, redCarpet, directorSuite, legendCircle };
      // Keep legacy fields in sync
      state.fanClub.freeMembers = backstage + frontRow;
      state.fanClub.silverMembers = redCarpet;
      state.fanClub.goldVipMembers = directorSuite + legendCircle;

      // YEARLY DUES (paid in weekly installments): $100 / $350 / $1,000 / $5,000 / $8,000
      const yearlyDues: Record<FanClubTierId, number> = { backstage: 100, frontRow: 350, redCarpet: 1000, directorSuite: 5000, legendCircle: 8000 };
      const dues = Math.floor(
        (backstage * yearlyDues.backstage +
          frontRow * yearlyDues.frontRow +
          redCarpet * yearlyDues.redCarpet +
          directorSuite * yearlyDues.directorSuite +
          legendCircle * yearlyDues.legendCircle) /
          52
      );
      state.fanClub.weeklyDuesRevenue = dues;
      weeklyEarnings += dues;

      // FAN CLUB FEED: NPC members react to your REAL events (no fake simulation)
      if (releasedMovies && releasedMovies.length > 0) {
        const latest = releasedMovies[0];
        const templates = [
          `Just watched "${latest.movieTitle}" for the 3rd time — INCREDIBLE. 🔥`,
          `When is the sequel to "${latest.movieTitle}" dropping?? I need answers!`,
          `The member screening for "${latest.movieTitle}" was AMAZING. Worth every dollar. 🎬`,
          `${player.firstName} ${player.lastName} is on another level this year. Legend Circle since Day 1. 🫡`,
          `Got my membership renewed — best decision ever. The exclusive posts are gold. ✨`,
          `That ${latest.criticRating || 80}% critic score on "${latest.movieTitle}"? Deserved every point.`,
        ];
        const tierChoices: FanClubTierId[] = ['backstage', 'frontRow', 'redCarpet', 'directorSuite', 'legendCircle'];
        for (let i = 0; i < 3; i++) {
          const author = NPC_FAN_NAMES[Math.floor(Math.random() * NPC_FAN_NAMES.length)];
          const text = templates[Math.floor(Math.random() * templates.length)];
          if (!state.fanClub.feed.some((f) => f.author === author && f.text === text)) {
            state.fanClub.feed.unshift({
              id: `fc_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
              author,
              tier: tierChoices[Math.floor(Math.random() * tierChoices.length)],
              text,
              likes: Math.floor(Math.random() * 400) + 5,
              week: player.dateWeek,
              year: player.dateYear,
            });
          }
        }
        state.fanClub.feed = state.fanClub.feed.slice(0, 60);
      }
    }

    // 7b. SCANDAL ENGINE — fame-based frequency, real-event sources, NPC attacks
    const scandalGen = this.maybeGenerateScandal(state, player, bookedProjects, releasedMovies);
    if (scandalGen.scandal) {
      state.pr.scandals.unshift(scandalGen.scandal);
      notifications.push(`📰 SCANDAL: ${scandalGen.scandal.title}`);
      if (scandalGen.fansGained) {
        player.fans = (player.fans || 0) + scandalGen.fansGained;
        notifications.push(`💪 Smear campaign exposed — fans rallied: +${scandalGen.fansGained.toLocaleString()} fans!`);
      }
    }

    // SCANDAL CONSEQUENCES (weekly while unresolved)
    const unresolvedScandals = state.pr.scandals.filter((sc) => !sc.resolved);
    if (unresolvedScandals.length > 0) {
      const hasCritical = unresolvedScandals.some((sc) => sc.severity === 'CRITICAL');
      const bleedRate = hasCritical ? 0.015 : 0.006;
      const lost = Math.floor((player.fans || 0) * bleedRate);
      if (lost > 0) {
        player.fans = Math.max(0, (player.fans || 0) - lost);
        notifications.push(`📉 ${lost.toLocaleString()} fans unfollowed due to active scandal coverage.`);
      }
      state.reputation.publicReputation = Math.max(0, (state.reputation.publicReputation || 0) - unresolvedScandals.length * 1.2);
      state.reputation.publicTrust = Math.max(0, (state.reputation.publicTrust || 0) - unresolvedScandals.length * 1.0);
      state.reputation.controversyIndex = Math.min(100, (state.reputation.controversyIndex || 0) + unresolvedScandals.length * 2);
    } else {
      state.reputation.controversyIndex = Math.max(0, (state.reputation.controversyIndex || 0) - 3);
    }

    // 7c. WEEKLY REPRESENTATION MARKETPLACE ROTATION (10 agents + 10 managers per week)
    this.rotateWeeklyOffers(player.dateWeek, player);

    // 7f. FOUNDATION PASSIVE GROWTH (only when a foundation exists — real, earned)
    const foundation = state.charities.find((c) => c.isFoundationEstablished);
    if (foundation && foundation.totalDonated > 0) {
      const weeklyGain = Math.min(2, Math.max(1, Math.floor(foundation.totalDonated / 10000000)));
      state.reputation.publicReputation = Math.min(100, (state.reputation.publicReputation || 0) + weeklyGain);
      state.reputation.publicTrust = Math.min(100, (state.reputation.publicTrust || 0) + weeklyGain);
      const weeklyFans = Math.min(5000, Math.floor(foundation.totalDonated / 200000));
      if (weeklyFans > 0) {
        player.fans = (player.fans || 0) + weeklyFans;
        notifications.push(`🌱 Your foundation's good work grew goodwill: +${weeklyFans.toLocaleString()} fans this week.`);
      }
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

    // 9. Process Website Traffic + REAL revenue (ads $0.02/visitor, merch $0.03/visitor)
    if (state.website.isLaunched) {
      const activeMoviesCount = releasedMovies ? releasedMovies.filter((m) => m.inCinemas).length : 0;
      const boostMult = 1 + Math.max(0, ((state.website.boostLevel || 1) - 1)) * 0.4; // +40% visitors per boost level
      const baseVisitors = Math.floor(
        ((player.fans || 50) * 0.05 + player.fameXp * 5 + activeMoviesCount * 1500 + (state.fanClub.isCreated ? 100 : 0)) * boostMult
      );
      state.website.weeklyVisitors = Math.max(10, baseVisitors);

      // REAL website income — paid into weekly earnings like every other system
      const webAds = state.website.adEnabled ? Math.floor(state.website.weeklyVisitors * 0.02) : 0;
      const webMerch = state.website.merchEnabled ? Math.floor(state.website.weeklyVisitors * 0.03) : 0;
      const webTotal = webAds + webMerch;
      if (webTotal > 0) {
        weeklyEarnings += webTotal;
        state.website.weeklyIncome = (state.website.weeklyIncome || 0) + webTotal;
        state.website.totalIncome = (state.website.totalIncome || 0) + webTotal;
        notifications.push(
          `🌐 Website revenue: +$${webTotal.toLocaleString()} this week` +
          (webAds > 0 ? ` (ads $${webAds.toLocaleString()})` : '') +
          (webMerch > 0 ? ` (merch $${webMerch.toLocaleString()})` : '')
        );
      }
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
      // AWARD-WIN PHOTOS (real: only when the movie actually won awards)
      if ((rm.awardsWon || 0) > 0) {
        const awardId = `gallery_award_${rm.id}`;
        if (!existingIds.has(awardId)) {
          state.mediaGallery.unshift({
            id: awardId,
            title: `Award Win: "${rm.movieTitle}" (${rm.awardsWon} trophy)`,
            category: 'Award Photo',
            imageUrl: rm.posterUrl,
            caption: `Celebrating ${rm.awardsWon} award win(s) for "${rm.movieTitle}". A night to remember.`,
            dateEarned: `Week ${player.dateWeek}, ${player.dateYear}`,
          });
        }
      }
      // RED CARPET PREMIERE PHOTOS (real: when released)
      const carpetId = `gallery_carpet_${rm.id}`;
      if (!existingIds.has(carpetId) && rm.inCinemas) {
        state.mediaGallery.unshift({
          id: carpetId,
          title: `Red Carpet Premiere: "${rm.movieTitle}"`,
          category: 'Red Carpet',
          imageUrl: rm.posterUrl,
          caption: `The world premiere of "${rm.movieTitle}" — photographers everywhere.`,
          dateEarned: `Week ${player.dateWeek}, ${player.dateYear}`,
        });
      }
    });
  }

  // ============================================================
  // SCANDAL ENGINE
  // ============================================================
  public static hasActiveCriticalScandal(): boolean {
    try {
      const state = this.getState();
      return state.pr.scandals.some((sc) => !sc.resolved && sc.severity === 'CRITICAL');
    } catch {
      return false;
    }
  }

  public static getActiveScandals(): ScandalItem[] {
    try {
      return this.getState().pr.scandals.filter((sc) => !sc.resolved);
    } catch {
      return [];
    }
  }

  private static maybeGenerateScandal(
    state: RepresentationFullState,
    player: Player,
    bookedProjects: BookedProject[],
    releasedMovies: ReleasedMovie[]
  ): { scandal: ScandalItem | null; fansGained: number } {
    const fame = player.fameXp || 0;
    // Fame-based frequency (realistic: bigger star = more scrutiny)
    let chance = 0;
    if (fame < 500) chance = 0.004;
    else if (fame < 5000) chance = 0.06;
    else if (fame < 25000) chance = 0.10;
    else chance = 0.15;
    if (Math.random() > chance) return { scandal: null, fansGained: 0 };

    const week = player.dateWeek || 1;
    const year = player.dateYear || 2026;
    const activeFilming = bookedProjects.find((b) => b.status === 'Filming');
    const latestMovie = releasedMovies && releasedMovies.length > 0 ? releasedMovies[0] : null;
    const isFlop = latestMovie && (latestMovie.worldwideGross || 0) < (latestMovie.budget || 1500000) * 1.1;
    const pendingDeal = bookedProjects.find((b) => b.status === 'Pending Negotiation');
    const isBigSpender = (player.money || 0) > 20000000;

    const eventOptions: { title: string; story: string; sev: ScandalItem['severity']; damage: number }[] = [];
    if (activeFilming) {
      eventOptions.push({
        title: `On-Set Drama: "${activeFilming.movieTitle}" Feud Rumors`,
        story: `Tabloids claim tension between you and a co-star on the set of "${activeFilming.movieTitle}". Anonymous crew members sold stories about icy silences between takes.`,
        sev: 'MINOR',
        damage: 8,
      });
    }
    if (isFlop && latestMovie) {
      eventOptions.push({
        title: `Box Office Flop Scrutiny: "${latestMovie.movieTitle}"`,
        story: `Critics are questioning whether the $${((latestMovie.budget || 1500000) / 1000000).toFixed(1)}M budget for "${latestMovie.movieTitle}" was justified after its soft $${((latestMovie.worldwideGross || 0) / 1000000).toFixed(1)}M run. Your name is in the headline.`,
        sev: 'MODERATE',
        damage: 18,
      });
    }
    if (pendingDeal) {
      eventOptions.push({
        title: `Contract Leak: "${pendingDeal.movieTitle}" Negotiations Exposed`,
        story: `A "studio insider" leaked your salary demands for "${pendingDeal.movieTitle}" to the trades. Executives are reportedly annoyed by the public negotiation.`,
        sev: 'MODERATE',
        damage: 15,
      });
    }
    if (isBigSpender) {
      eventOptions.push({
        title: 'Paparazzi: The $20M Lifestyle Under Fire',
        story: 'Candid photos show you dropping six figures on private jets and VIP tables. Commentators call it tone-deaf while your fans defend your right to spend.',
        sev: 'MINOR',
        damage: 10,
      });
    }

    // NPC ATTACK (competitive): rivals fund bloggers to defame you
    let npcAttack: { scandal: ScandalItem | null; fansGained: number } | null = null;
    if (fame >= 1500 && Math.random() < 0.45) {
      const npc = NPC_CELEBRITY_POOL[Math.floor(Math.random() * NPC_CELEBRITY_POOL.length)];
      const blogger = BLOGGER_HANDLES[Math.floor(Math.random() * BLOGGER_HANDLES.length)];
      const lawTier = state.lawFirm.hiredFirmTier;
      const baseWin = lawTier === 'Beverly Hills Elite Legal' ? 0.28 : lawTier === 'Entertainment Law Boutique' ? 0.4 : lawTier === 'Solo Attorney' ? 0.5 : 0.62;
      const smearLands = Math.random() < baseWin;
      if (smearLands) {
        npcAttack = {
          scandal: {
            id: `scandal_npc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            title: `Smear Campaign: ${npc.name} Funded Bloggers to Defame You`,
            cause: `Competitive attack from ${npc.name} (${blogger.name})`,
            severity: 'CRITICAL',
            reputationDamage: 30,
            weekOccurred: week,
            yearOccurred: year,
            resolved: false,
            story: `${blogger.name} published a series of anonymous hit pieces. Sources confirm ${npc.name} quietly paid for the campaign after your careers collided.`,
            source: 'NPC_ATTACK',
            instigator: npc.name,
          },
          fansGained: 0,
        };
      } else {
        // BACKFIRE: exposed smear = fans rally for you
        const rallied = Math.floor((player.fans || 0) * 0.01) + 500;
        state.reputation.publicReputation = Math.min(100, (state.reputation.publicReputation || 0) + 6);
        state.reputation.publicTrust = Math.min(100, (state.reputation.publicTrust || 0) + 5);
        npcAttack = {
          scandal: {
            id: `scandal_backfire_${Date.now()}`,
            title: `Smear Campaign EXPOSED: ${npc.name} Humiliated`,
            cause: `Backfired attack from ${npc.name}`,
            severity: 'MINOR',
            reputationDamage: 0,
            weekOccurred: week,
            yearOccurred: year,
            resolved: true,
            resolutionStrategy: 'EXPOSED',
            resolutionNote: `Forensic bloggers traced the smear back to ${npc.name}. Their reputation is damaged, yours is stronger.`,
            source: 'NPC_ATTACK',
            instigator: npc.name,
          },
          fansGained: rallied,
        };
      }
    }

    if (npcAttack && npcAttack.scandal) return npcAttack;

    if (eventOptions.length === 0) {
      // Generic paparazzi / noise — only for established stars
      if (fame < 1500) return { scandal: null, fansGained: 0 };
      eventOptions.push({
        title: 'Paparazzi Chase Outside a Sunset Blvd. Hotel',
        story: 'Photos surfaced of you leaving a private event looking exhausted. Commentators are reading too much into a tired face.',
        sev: 'MINOR',
        damage: 6,
      });
    }

    const picked = eventOptions[Math.floor(Math.random() * eventOptions.length)];
    return {
      scandal: {
        id: `scandal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: picked.title,
        cause: picked.story,
        severity: picked.sev,
        reputationDamage: picked.damage,
        weekOccurred: week,
        yearOccurred: year,
        resolved: false,
        story: picked.story,
        source: 'EVENT',
      },
      fansGained: 0,
    };
  }

  // Resolve a scandal with one of 4 strategies — lawyers are wired in for defense
  public static resolveScandal(
    scandalId: string,
    strategy: 'LAWYER' | 'PR' | 'APOLOGIZE' | 'DENY',
    player: Player
  ): { success: boolean; message: string; reputationChange: number; fansChange: number; cashCost: number } {
    const state = this.getState();
    const scandal = state.pr.scandals.find((sc) => sc.id === scandalId);
    if (!scandal || scandal.resolved) {
      return { success: false, message: 'Scandal not found or already resolved.', reputationChange: 0, fansChange: 0, cashCost: 0 };
    }

    const severityMult = scandal.severity === 'CRITICAL' ? 1 : scandal.severity === 'MODERATE' ? 0.6 : 0.3;
    const lawTier = state.lawFirm.hiredFirmTier;
    const prTier = state.pr.hiredAgencyTier;
    let reputationChange = 0;
    let fansChange = 0;
    let cashCost = 0;
    let note = '';
    let pressStatement = '';

    if (strategy === 'LAWYER') {
      const baseWin = lawTier === 'Beverly Hills Elite Legal' ? 0.85 : lawTier === 'Entertainment Law Boutique' ? 0.68 : lawTier === 'Solo Attorney' ? 0.52 : 0.35;
      cashCost = lawTier === 'None' ? 15000 + Math.floor(15000 * severityMult) : Math.floor(2500 + 5000 * severityMult);
      if (player.money < cashCost) {
        return { success: false, message: `Insufficient funds for legal defense ($${cashCost.toLocaleString()}).`, reputationChange: 0, fansChange: 0, cashCost };
      }
      const win = Math.random() < baseWin;
      if (win) {
        reputationChange = 6 + severityMult * 5;
        fansChange = Math.floor((player.fans || 0) * 0.008) + 200;
        note =
          scandal.source === 'NPC_ATTACK'
            ? `Your legal team exposed the smear campaign, filed a defamation countersuit and got the hit pieces retracted. ${scandal.instigator || 'The instigator'} issued a quiet apology.`
            : `${lawTier} issued cease-and-desist letters, secured retractions, and the coverage died down.`;
        pressStatement = `${lawTier} issued a legal statement on behalf of ${player.firstName} ${player.lastName}: "${note}"`;
        state.pr.pressReleasesIssued += 1;
      } else {
        reputationChange = -3 - severityMult * 3;
        fansChange = -Math.floor((player.fans || 0) * 0.006);
        note = 'The legal battle dragged on and coverage worsened before a quiet settlement.';
      }
    } else if (strategy === 'PR') {
      cashCost = prTier === 'None' ? 25000 + Math.floor(25000 * severityMult) : 5000 + state.pr.weeklyRetainerFee;
      if (player.money < cashCost) {
        return { success: false, message: `Insufficient funds for a PR offensive ($${cashCost.toLocaleString()}).`, reputationChange: 0, fansChange: 0, cashCost };
      }
      reputationChange = 4 + severityMult * 3;
      fansChange = Math.floor((player.fans || 0) * 0.005);
      note = 'Your PR team blanketed the trades with friendly coverage, booked sympathetic interviews and steered the narrative.';
      pressStatement = `PR statement issued by ${prTier} on behalf of ${player.firstName} ${player.lastName}: official response to "${scandal.title}".`;
      state.pr.pressReleasesIssued += 1;
    } else if (strategy === 'APOLOGIZE') {
      reputationChange = -3 - severityMult * 3;
      fansChange = Math.floor((player.fans || 0) * 0.012) + 300;
      note = 'You owned it publicly. Many fans respect the honesty — memes continue regardless.';
    } else {
      // DENY & RIDE IT OUT
      reputationChange = -5 - severityMult * 5;
      fansChange = -Math.floor((player.fans || 0) * 0.02);
      note = 'You denied everything and stayed silent. The story kept running without your voice in it.';
    }

    if (cashCost > 0) player.money = Math.max(0, (player.money || 0) - cashCost);
    scandal.resolved = true;
    scandal.resolutionStrategy = strategy;
    scandal.resolutionNote = note;
    state.reputation.publicReputation = Math.max(0, Math.min(100, (state.reputation.publicReputation || 0) + reputationChange));
    state.reputation.publicTrust = Math.max(0, Math.min(100, (state.reputation.publicTrust || 0) + reputationChange * 0.8));
    state.reputation.controversyIndex = Math.max(0, (state.reputation.controversyIndex || 0) - 10);
    if (player) player.fans = Math.max(0, (player.fans || 0) + fansChange);
    this.saveState(state);

    return {
      success: true,
      message: note + (pressStatement ? `\n\n📰 ${pressStatement}` : ''),
      reputationChange,
      fansChange,
      cashCost,
    };
  }

  // Player hires bloggers to smear a rival — risky, can backfire into a slander lawsuit
  public static launchSmearCampaign(targetName: string, cost: number, player: Player): { success: boolean; message: string } {
    const state = this.getState();
    if (!player || (player.money || 0) < cost) {
      return { success: false, message: `Insufficient funds for a smear campaign ($${cost.toLocaleString()}).` };
    }
    player.money -= cost;
    const fame = player.fameXp || 0;
    const lawProtection = state.lawFirm.hiredFirmTier !== 'None' ? 0.15 : 0;
    const caughtChance = Math.max(0.15, Math.min(0.6, 0.45 - lawProtection));
    const caught = Math.random() < caughtChance;

    if (caught) {
      const demanded = 50000 + fame * 5;
      state.lawFirm.lawsuits.unshift({
        id: `lawsuit_smear_${Date.now()}`,
        title: `SLANDER/DEFAMATION: ${targetName} v. ${player.firstName} ${player.lastName}`,
        claimant: targetName,
        type: 'SLANDER_DEFAMATION',
        demandedAmount: demanded,
        status: 'ACTIVE',
        weekFiled: player.dateWeek,
        yearFiled: player.dateYear,
      });
      state.reputation.publicTrust = Math.max(0, (state.reputation.publicTrust || 0) - 12);
      this.saveState(state);
      return {
        success: false,
        message: `CAUGHT! ${targetName}'s team traced the bloggers back to you. You're being sued for slander ($${demanded.toLocaleString()}) and your public trust dropped.`,
      };
    }

    state.reputation.publicReputation = Math.min(100, (state.reputation.publicReputation || 0) + 3);
    this.saveState(state);
    return {
      success: true,
      message: `Smear campaign launched against ${targetName}. The bloggers are running with the story — and you got away clean. (+3 Public Reputation)`,
    };
  }

  // ============================================================
  // WEEKLY MARKETPLACE (10 agents + 10 managers rotate weekly)
  // ============================================================
  public static rotateWeeklyOffers(week: number, player: Player): void {
    const state = this.getState();
    if (state.offersWeek === week && state.weeklyAgentIds && state.weeklyManagerIds) return;

    const signedAgentId = player?.representation?.agent?.id;
    const signedManagerId = player?.representation?.manager?.id;
    const unsignedAgents = AGENT_POOL.filter((a) => a.id !== signedAgentId);
    const unsignedManagers = MANAGER_POOL.filter((m) => m.id !== signedManagerId);

    const shuffledA = [...unsignedAgents].sort(() => Math.random() - 0.5);
    const shuffledM = [...unsignedManagers].sort(() => Math.random() - 0.5);

    state.weeklyAgentIds = shuffledA.slice(0, 10).map((a) => a.id);
    state.weeklyManagerIds = shuffledM.slice(0, 10).map((m) => m.id);
    state.offersWeek = week;

    // AGENTS & MANAGERS PITCH THEMSELVES when the player is doing well
    const fame = player?.fameXp || 0;
    const pendingPitches = state.pendingAgentPitches || [];
    if (fame >= 800 && pendingPitches.length < 2 && Math.random() < 0.14) {
      const eligible = shuffledA.filter((a) => (a.minFameXp || 0) <= fame * 1.4);
      if (eligible.length > 0) {
        const pick = eligible[Math.floor(Math.random() * eligible.length)];
        state.pendingAgentPitches = [...pendingPitches, pick.id];
      }
    }
    const pendingMgrs = state.pendingManagerPitches || [];
    if (fame >= 1500 && pendingMgrs.length < 2 && Math.random() < 0.12) {
      const eligibleM = shuffledM.filter((m) => (m.tier || 1) <= (fame >= 8000 ? 4 : fame >= 3000 ? 3 : 2));
      if (eligibleM.length > 0) {
        const pick = eligibleM[Math.floor(Math.random() * eligibleM.length)];
        state.pendingManagerPitches = [...pendingMgrs, pick.id];
      }
    }

    this.saveState(state);
  }

  public static getWeeklyAgents(): AgentInfo[] {
    try {
      const state = this.getState();
      const ids = state.weeklyAgentIds || [];
      const list = ids.map((id) => AGENT_POOL.find((a) => a.id === id)).filter(Boolean) as AgentInfo[];
      if (list.length === 0) {
        const shuffled = [...AGENT_POOL].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);
      }
      return list;
    } catch {
      return AGENT_POOL.slice(0, 10);
    }
  }

  public static getWeeklyManagers(): ManagerInfo[] {
    try {
      const state = this.getState();
      const ids = state.weeklyManagerIds || [];
      const list = ids.map((id) => MANAGER_POOL.find((m) => m.id === id)).filter(Boolean) as ManagerInfo[];
      if (list.length === 0) {
        const shuffled = [...MANAGER_POOL].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);
      }
      return list;
    } catch {
      return MANAGER_POOL.slice(0, 10);
    }
  }

  // Player announcement to the fan club feed
  public static postFanClubFeed(text: string, player: Player): { success: boolean; message: string } {
    const state = this.getState();
    if (!state.fanClub.isCreated) {
      return { success: false, message: 'Create your Fan Club first!' };
    }
    state.fanClub.feed.unshift({
      id: `fc_player_${Date.now()}`,
      author: `${player.firstName} ${player.lastName}`,
      tier: 'Staff',
      text,
      likes: Math.floor(Math.random() * 900) + 100,
      week: player.dateWeek,
      year: player.dateYear,
      isPlayer: true,
    });
    state.fanClub.feed = state.fanClub.feed.slice(0, 60);
    this.saveState(state);
    return { success: true, message: 'Posted to your Fan Club feed!' };
  }

}
