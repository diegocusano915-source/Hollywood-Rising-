/**
 * HOLLYWOOD RISING - STREAMING PLATFORM ENGINE (rewire)
 * Real platforms (Netflix, Prime, etc.), bidding + negotiation,
 * exclusive/non-exclusive deals, weekly streaming royalties.
 * Persisted in localStorage; wired into the weekly loop.
 */

import { StreamingPlatform, StreamingDeal } from '../types/world';
import { INITIAL_STREAMING_PLATFORMS } from '../database/worldDatabase';

const KEY = 'HR_STREAMING_V2';

export interface PlatformState {
  platforms: StreamingPlatform[];
  pendingBids: {
    id: string;
    platformId: string;
    projectTitle: string;
    projectType: 'Movie' | 'Series';
    movieRefId?: string;
    upfront: number;
    royaltyRate: number;
    exclusive: boolean;
    weeksLeft: number; // real offer window: 3 weeks to answer
    status: 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED' | 'EXPIRED';
  }[];
  /** Movies already licensed in an NPC studio↔platform deal (no re-licensing) */
  licensedMovieIds?: string[];
}

function defaultState(): PlatformState {
  return {
    platforms: INITIAL_STREAMING_PLATFORMS.map((p) => ({ ...p, activeDeals: [] })),
    pendingBids: [],
  };
}

export function loadStreamingState(): PlatformState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const def = defaultState();
      return {
        platforms: parsed.platforms?.length ? parsed.platforms : def.platforms,
        pendingBids: (parsed.pendingBids || []).map((b: any) => ({
          ...b,
          weeksLeft: b.weeksLeft ?? (b.status === 'PENDING' ? 3 : 0),
        })),
      };
    }
  } catch {}
  const def = defaultState();
  saveStreamingState(def);
  return def;
}

export function saveStreamingState(state: PlatformState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

// PLATFORM PERSONALITIES (from INITIAL data + sensible defaults)
export function platformPersonality(p: StreamingPlatform) {
  const tier = p.budgetTier || 'Mid';
  const multipliers = { Mega: 1.0, Major: 0.72, Mid: 0.5, Indie: 0.32 };
  return {
    budgetMult: multipliers[tier] || 0.5,
    tierLabel: tier === 'Mega' ? 'Mega-budget streamer' : tier === 'Major' ? 'Major streamer' : tier === 'Mid' ? 'Mid-market platform' : 'Indie platform',
  };
}

// GENERATE A REAL BID from a platform for a project
export function generateBid(
  platform: StreamingPlatform,
  projectTitle: string,
  projectType: 'Movie' | 'Series',
  overallRating: number,
  budget: number,
  gross: number,
  exclusive: boolean,
  movieRefId?: string
): { upfront: number; royaltyRate: number } {
  const { budgetMult } = platformPersonality(platform);
  // Real math: rating + budget + gross track record + platform size
  const ratingFactor = overallRating / 100;
  const sizeFactor = Math.min(1, (platform.subscriberBase || 100000000) / 300000000);
  const grossFactor = Math.min(1.5, Math.max(0.1, gross / Math.max(1, budget)));
  const upfront = Math.max(
    500000,
    Math.floor(budget * 0.12 * ratingFactor * budgetMult * sizeFactor * (exclusive ? 1.5 : 0.75))
  );
  // royalty rate 0.5% - 3.5% based on exclusivity + reputation
  const royaltyRate = Math.round((exclusive ? 0.02 : 0.009) * (0.6 + ratingFactor) * (platform.reputation || 60) * 100) / 100;
  return { upfront: Math.min(upfront, 4000000000), royaltyRate: Math.min(3.5, Math.max(0.5, royaltyRate)) };
}

// Submit a pitch -> creates a pending bid
export function submitPitch(
  state: PlatformState,
  platformId: string,
  projectTitle: string,
  projectType: 'Movie' | 'Series',
  overallRating: number,
  budget: number,
  gross: number,
  exclusive: boolean,
  movieRefId?: string
): { success: boolean; message: string } {
  const platform = state.platforms.find((p) => p.id === platformId);
  if (!platform) return { success: false, message: 'Platform not found.' };
  const bid = generateBid(platform, projectTitle, projectType, overallRating, budget, gross, exclusive, movieRefId);
  state.pendingBids.unshift({
    id: `bid_${Date.now()}`,
    platformId,
    projectTitle,
    projectType,
    movieRefId,
    upfront: bid.upfront,
    royaltyRate: bid.royaltyRate,
    exclusive,
    weeksLeft: 3, // platforms hold their offer for 3 weeks
    status: 'PENDING',
  });
  saveStreamingState(state);
  return { success: true, message: `${platform.name} reviewed your pitch — they've made an offer!` };
}

// Accept a bid -> deal active, upfront paid, platform status Partner/Exclusive
export function acceptBid(state: PlatformState, bidId: string): { success: boolean; message: string; upfront: number } {
  const bid = state.pendingBids.find((b) => b.id === bidId && b.status === 'PENDING');
  if (!bid) return { success: false, message: 'Bid not found or already handled.', upfront: 0 };
  bid.status = 'ACCEPTED';
  const platform = state.platforms.find((p) => p.id === bid.platformId);
  if (platform) {
    const deal: StreamingDeal = {
      id: `deal_${Date.now()}`,
      projectTitle: bid.projectTitle,
      projectType: bid.projectType,
      platformId: bid.platformId,
      exclusive: bid.exclusive,
      upfront: bid.upfront,
      royaltyRate: bid.royaltyRate,
      weeklyRoyalty: 0,
      startWeek: 1,
      startYear: 2026,
      weeksRemaining: bid.exclusive ? 52 : 26,
      totalWeeks: bid.exclusive ? 52 : 26,
      movieRefId: bid.movieRefId,
    };
    platform.activeDeals = platform.activeDeals || [];
    platform.activeDeals.unshift(deal);
    platform.moviesLicensed += bid.projectType === 'Movie' ? 1 : 0;
    platform.seriesLicensed += bid.projectType === 'Series' ? 1 : 0;
    platform.moneyEarned += bid.upfront;
    platform.status = bid.exclusive ? 'Exclusive' : 'Partner';
    platform.exclusiveDealsCount += bid.exclusive ? 1 : 0;
  }
  saveStreamingState(state);
  return { success: true, message: `Deal signed with ${platform?.name}! Upfront $${bid.upfront.toLocaleString()} deposited.`, upfront: bid.upfront };
}

// Counter: player asks more -> platform responds (60% accept, else keeps original)
export function counterBid(state: PlatformState, bidId: string, extraPct: number): { success: boolean; message: string; newUpfront: number } {
  const bid = state.pendingBids.find((b) => b.id === bidId && b.status === 'PENDING');
  if (!bid) return { success: false, message: 'Bid not found.', newUpfront: 0 };
  const platform = state.platforms.find((p) => p.id === bid.platformId);
  const accepted = Math.random() < 0.6;
  if (accepted) {
    bid.upfront = Math.floor(bid.upfront * (1 + extraPct / 100));
    const accept = acceptBid(state, bidId);
    return { success: true, message: `${platform?.name} accepted your counter! ${accept.message}`, newUpfront: bid.upfront };
  }
  bid.status = 'COUNTERED';
  saveStreamingState(state);
  return { success: false, message: `${platform?.name} declined your counter but keeps the original offer on the table.`, newUpfront: 0 };
}

export function rejectBid(state: PlatformState, bidId: string) {
  const bid = state.pendingBids.find((b) => b.id === bidId && b.status === 'PENDING');
  if (bid) { bid.status = 'REJECTED'; saveStreamingState(state); }
}

// WEEKLY BID WINDOWS: platforms hold their offer for 3 weeks, then withdraw it.
// Returns real inbox messages (expiry warning + withdrawn).
export function processBidsWeekly(
  state: PlatformState,
  week: number,
  year: number
): { messages: { subject: string; body: string; date: string; read: boolean }[] } {
  const messages: { subject: string; body: string; date: string; read: boolean }[] = [];
  state.pendingBids.forEach((b) => {
    if (b.status !== 'PENDING') return;
    const platform = state.platforms.find((p) => p.id === b.platformId);
    b.weeksLeft = (b.weeksLeft ?? 3) - 1;
    if (b.weeksLeft <= 0) {
      b.status = 'EXPIRED';
      messages.push({
        subject: `❌ ${platform?.name || 'A platform'} withdrew their bid`,
        body: `You didn't answer in time, so ${platform?.name || 'the platform'} pulled their ${'$' + b.upfront.toLocaleString()} offer for "${b.projectTitle}". The offer window is gone.`,
        date: `Week ${week}, ${year}`,
        read: false,
      });
    } else if (b.weeksLeft === 1) {
      messages.push({
        subject: `⏳ ${platform?.name || 'A platform'} bid expires NEXT WEEK`,
        body: `Their ${'$' + b.upfront.toLocaleString()} offer for "${b.projectTitle}" is in its final week. Accept, counter or let it go.`,
        date: `Week ${week}, ${year}`,
        read: false,
      });
    }
  });
  saveStreamingState(state);
  return { messages };
}

// WEEKLY ROYALTIES: real viewership-based, recorded into studio financials
export function processStreamingRoyaltiesWeek(
  state: PlatformState,
  player: any,
  studioFinancials?: { unshift: (f: any) => void },
  week: number = 1,
  year: number = 2026
): { moneyDelta: number; messages: string[] } {
  let moneyDelta = 0;
  const messages: string[] = [];
  state.platforms.forEach((platform) => {
    (platform.activeDeals || []).forEach((deal) => {
      if (deal.weeksRemaining <= 0) return;
      deal.weeksRemaining -= 1;
      // Real viewership: based on player fame + platform size + gross
      const gross = 0; // replaced below
      const views = Math.floor(
        ((player?.fameXp || 0) * 500 + (platform.subscriberBase || 100000000) * 0.002) *
        (0.8 + Math.random() * 0.4)
      );
      const fullWeekly = Math.floor(views * (deal.royaltyRate / 100) * 0.5);
      // NPC studio deals: the player only receives their backend percentage —
      // the studio keeps the rest of the royalty pool
      const weekly = deal.npcDeal && deal.playerCutPct
        ? Math.floor((fullWeekly * deal.playerCutPct) / 100)
        : fullWeekly;
      deal.weeklyRoyalty = weekly;
      moneyDelta += weekly;
      if (studioFinancials) {
        studioFinancials.unshift({
          id: `fin_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          projectTitle: deal.projectTitle,
          type: 'INCOME',
          category: deal.npcDeal ? 'Streaming (backend)' : 'Streaming',
          amount: weekly,
          week,
          year,
        });
      }
    });
  });
  if (moneyDelta > 0) messages.push(`📺 Streaming royalties this week: +$${moneyDelta.toLocaleString()}`);
  saveStreamingState(state);
  return { moneyDelta, messages };
}

// ---------------------------------------------------------------------------
// NPC LICENSING — when a movie the player STARRED IN (but doesn't own) ends
// its theatrical run, the studio and the platforms negotiate streaming rights
// themselves. The player never pitches; they just receive their contractual
// backend percentage, reported to the inbox with the exact numbers.
// ---------------------------------------------------------------------------

export interface NpcLicensingResult {
  messages: { subject: string; body: string; date: string; read: boolean }[];
}

/** Backend points by role — the real-world shape of star residuals. */
function backendPctFor(roleType: string, fameXp: number): number {
  const base = roleType === 'Lead' ? 3.5 : roleType === 'Principal' ? 2.25 : 1.5;
  const fameBonus = Math.min(1.5, fameXp / 20000); // legends negotiate better clauses
  return Math.round(Math.min(6, base + fameBonus) * 100) / 100;
}

export function processNpcLicensingWeek(
  state: PlatformState,
  player: any,
  releasedMovies: any[],
  week: number,
  year: number
): NpcLicensingResult {
  const messages: NpcLicensingResult['messages'] = [];
  if (!Array.isArray(releasedMovies)) return { messages };

  const licensed = new Set<string>([
    ...(state.licensedMovieIds || []),
    // deals the player signed themselves also lock the title
    ...state.platforms.flatMap((p) => (p.activeDeals || []).map((d) => d.movieRefId).filter(Boolean) as string[]),
  ]);

  for (const movie of releasedMovies) {
    // Eligible: theatrical run concluded, real rating exists, not yet licensed,
    // and the studio (not the player) controls the rights — i.e. any film the
    // player acted in. One negotiation chance per movie per week (30%).
    const runEnded = movie.inCinemas === false && (movie.weeksInCinemas || 0) >= 8;
    if (!runEnded || licensed.has(movie.id) || Math.random() > 0.3) continue;

    // The studio picks a platform — bigger subscriber bases attract bigger deals
    const weighted = [...state.platforms].sort(
      (a, b) => (b.subscriberBase || 0) * Math.random() - (a.subscriberBase || 0) * Math.random()
    );
    const platform = weighted[0];
    if (!platform) continue;

    const exclusive = Math.random() < 0.7;
    const overall = Math.round(((movie.audienceRating || 60) + (movie.criticRating || 60)) / 2);
    const budget = movie.budget || Math.max(1000000, Math.floor((movie.worldwideGross || 0) / 3));
    const bid = generateBid(platform, movie.movieTitle, movie.isTvSeries ? 'Series' : 'Movie', overall, budget, movie.worldwideGross || 0, exclusive, movie.id);
    // Studio-to-platform license fees run well above single-actor pitches
    const licenseFee = Math.floor(bid.upfront * (2 + Math.random()));
    const playerPct = backendPctFor(movie.roleType || 'Supporting', player?.fameXp || 0);
    const signingBonus = Math.floor((licenseFee * playerPct) / 100);

    const deal: StreamingDeal = {
      id: `deal_npc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      projectTitle: movie.movieTitle,
      projectType: movie.isTvSeries ? 'Series' : 'Movie',
      platformId: platform.id,
      exclusive,
      upfront: licenseFee,
      royaltyRate: bid.royaltyRate,
      weeklyRoyalty: 0,
      startWeek: week,
      startYear: year,
      weeksRemaining: exclusive ? 52 : 26,
      totalWeeks: exclusive ? 52 : 26,
      movieRefId: movie.id,
      npcDeal: true,
      playerCutPct: playerPct,
      studioName: movie.studio || 'The Studio',
    };
    platform.activeDeals = platform.activeDeals || [];
    platform.activeDeals.unshift(deal);
    platform.moviesLicensed += deal.projectType === 'Movie' ? 1 : 0;
    platform.seriesLicensed += deal.projectType === 'Series' ? 1 : 0;
    platform.moneyEarned += licenseFee;
    platform.status = exclusive ? 'Exclusive' : 'Partner';
    licensed.add(movie.id);

    messages.push({
      subject: `📺 ${platform.name} x ${deal.studioName}: "${movie.movieTitle}" streaming deal closed — your cut ${playerPct}%`,
      body:
        `${deal.studioName} and ${platform.name} negotiated the streaming rights for "${movie.movieTitle}" (your role: ${movie.roleType}) without you lifting a finger.\n\n` +
        `• License fee: $${licenseFee.toLocaleString()} (${exclusive ? 'EXCLUSIVE' : 'non-exclusive'}, ${deal.weeksRemaining} week window)\n` +
        `• Your backend: ${playerPct}% as ${movie.roleType}\n` +
        `• Signing bonus deposited: $${signingBonus.toLocaleString()}\n` +
        `• Weekly residuals: ${playerPct}% of the deal's royalty pool, paid every week the title stays live\n\n` +
        `The studio keeps the rest — that's the business. Your residuals flow automatically into your weekly income.`,
      date: `Week ${week}, ${year}`,
      read: false,
    });

    // The signing bonus is real money — drained by the caller this same week
    pendingNpcBonuses += signingBonus;
  }

  state.licensedMovieIds = Array.from(licensed).slice(-200);
  saveStreamingState(state);
  return { messages };
}

/** Real signing bonuses earned by NPC deals this week (drained on read). */
let pendingNpcBonuses = 0;
export function drainNpcSigningBonuses(): number {
  const v = pendingNpcBonuses;
  pendingNpcBonuses = 0;
  return v;
}
