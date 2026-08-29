/**
 * HOLLYWOOD RISING - Royalty Engine Service (Phase 5)
 * Realistic Hollywood Royalty & Backend Simulation Engine.
 * Replaces linear gross % with contract-based, role-based, decaying residual models.
 */

import { ReleasedMovie } from '../types/game';
import { BoxOfficeItem } from '../types/world';

export interface DetailedRoyaltyBreakdown {
  salary: number; // Upfront salary (earned during filming)
  residuals: number; // SAG-AFTRA theatrical & television residuals
  backend: number; // Net profit share & box office performance bonuses
  streamingRoyalties: number; // SVOD/AVOD streaming licensing
  merchandiseRoyalties: number; // Toy, gaming & merchandise licensing
  syndicationRoyalties: number; // TV broadcast syndication
  internationalRoyalties: number; // Foreign territorial distribution
  totalGrossRoyalties: number; // Total gross royalty earnings
  taxes: number; // Tax withholding (approx 25%)
  netRoyalties: number; // Net earnings after taxes
  logs: string[];
}

export class RoyaltyEngineService {
  /**
   * Calculates realistic weekly royalties for a released movie or TV show.
   */
  public static calculateWeeklyRoyalty(
    movie: ReleasedMovie,
    chartItem?: BoxOfficeItem
  ): DetailedRoyaltyBreakdown {
    const logs: string[] = [];
    const weeklyGross = chartItem?.weeklyGross || 0;
    const worldwideGross = chartItem?.worldwideGross || movie.worldwideGross || 0;
    const budget = movie.budget || 25000000;
    const weeksInCinemas = chartItem?.weeksReleased || movie.weeksInCinemas || 1;
    const inTheaters = chartItem?.inTheaters ?? movie.inCinemas;

    const roleType = movie.roleType || 'Lead';
    const roleMultiplier =
      roleType === 'Lead'
        ? 1.0
        : roleType === 'Support'
        ? 0.55
        : roleType === 'Principal'
        ? 0.3
        : 0.15; // Cameo / Guest / Recurring

    // 1. RESIDUALS (SAG-AFTRA)
    let residuals = 0;
    if (inTheaters && weeklyGross > 0) {
      // Base residual percentage on weekly box office gross (~0.05% for Lead)
      const basePct = 0.0005 * roleMultiplier;
      // Decay factor per week in release (decays ~18% each week)
      const decayFactor = Math.pow(0.82, Math.max(0, weeksInCinemas - 1));
      residuals = Math.round(weeklyGross * basePct * decayFactor);

      // Sanity cap: $1,000 - $15,000 / week depending on role and weekly gross
      residuals = Math.min(15000 * roleMultiplier, Math.max(500, residuals));
    } else {
      // Post-Theatrical long tail — derived from the movie's REAL gross and
      // decaying weekly. No random faucets: a flop trickles out fast, a
      // blockbuster classic keeps paying for years. Below $20/wk it ends.
      const tailDecay = Math.pow(0.9, Math.max(0, weeksInCinemas - 8));
      residuals = Math.floor(worldwideGross * 0.000004 * roleMultiplier * tailDecay);
      if (residuals < 20) residuals = 0;
    }

    // 2. BACKEND PROFIT SHARE / BOX OFFICE BONUSES
    let backend = 0;
    // Hollywood Rule: Backend ONLY pays if the film is PROFITABLE! (Gross > Budget * 2.2)
    const isProfitable = worldwideGross > budget * 2.2;

    if (isProfitable) {
      const backendPct = (movie as any).backendPercent || (movie as any).profitSharePercent || 0;
      if (backendPct > 0 && weeklyGross > 0) {
        // Studio net revenue is approx 45% of box office gross
        const studioNetWeekly = weeklyGross * 0.45;
        // Backend share scaled realistically
        backend = Math.round(studioNetWeekly * (backendPct / 100));
        // Cap backend weekly to sensible scale ($2,000 - $35,000)
        backend = Math.min(35000, backend);
      } else if ((movie as any).boxOfficeBonus && worldwideGross >= 100000000 && weeksInCinemas === 4) {
        // One-time Box Office Milestone Bonus
        backend = Math.round((movie as any).boxOfficeBonus);
        logs.push(`🏆 BOX OFFICE MILESTONE BONUS: Received $${backend.toLocaleString()} for breaking $100M Box Office!`);
      }
    }

    // 3. STREAMING ROYALTIES
    let streamingRoyalties = 0;
    const isStreamingOrVOD = (movie as any).category === 'Streaming Original' || weeksInCinemas > 6 || !inTheaters;
    if (isStreamingOrVOD) {
      // Payout scales with what the movie ACTUALLY earned and its rating,
      // decaying weekly — no flat weekly faucet.
      const audienceRating = movie.audienceRating || 50;
      const streamDecay = Math.pow(0.94, Math.max(0, weeksInCinemas - 8));
      streamingRoyalties = Math.floor(
        worldwideGross * 0.000008 * (audienceRating / 100) * roleMultiplier * streamDecay
      );
      if (streamingRoyalties < 15) streamingRoyalties = 0;
    }

    // 4. MERCHANDISE ROYALTIES
    let merchandiseRoyalties = 0;
    const merchGenres = ['Action', 'Sci-Fi', 'Animation', 'Fantasy', 'Adventure'];
    if (worldwideGross >= 300000000 && merchGenres.includes(movie.genre || '')) {
      // Franchise merch only pays while the property is hot — decays weekly.
      const merchDecay = Math.pow(0.9, Math.max(0, weeksInCinemas - 8));
      merchandiseRoyalties = Math.floor(worldwideGross * 0.000005 * roleMultiplier * merchDecay);
      if (merchandiseRoyalties < 25) merchandiseRoyalties = 0;
    }

    // 5. TV SYNDICATION & INTERNATIONAL DISTRIBUTION
    let syndicationRoyalties = 0;
    if (movie.category === 'TV Series' || (movie as any).isTvSeries) {
      // Syndication deals are struck off the show's production value and
      // decay as the library ages — never a flat random weekly check.
      const synDecay = Math.pow(0.93, Math.max(0, weeksInCinemas - 8));
      syndicationRoyalties = Math.floor(budget * 0.0004 * roleMultiplier * synDecay);
      if (syndicationRoyalties < 20) syndicationRoyalties = 0;
    }

    let internationalRoyalties = 0;
    if (chartItem && chartItem.internationalGross > 100000000 && inTheaters) {
      internationalRoyalties = Math.round((1000 + Math.random() * 2500) * roleMultiplier);
    }

    // TOTAL GROSS & TAXES
    const totalGrossRoyalties =
      residuals +
      backend +
      streamingRoyalties +
      merchandiseRoyalties +
      syndicationRoyalties +
      internationalRoyalties;

    const taxes = Math.round(totalGrossRoyalties * 0.25);
    const netRoyalties = totalGrossRoyalties - taxes;

    if (totalGrossRoyalties > 0) {
      logs.push(
        `💰 ROYALTY PAYOUT: '${movie.movieTitle}' generated $${totalGrossRoyalties.toLocaleString()} gross royalties ($${residuals.toLocaleString()} Residuals, $${backend.toLocaleString()} Backend, $${streamingRoyalties.toLocaleString()} Streaming).`
      );
    }

    return {
      salary: 0,
      residuals,
      backend,
      streamingRoyalties,
      merchandiseRoyalties,
      syndicationRoyalties,
      internationalRoyalties,
      totalGrossRoyalties,
      taxes,
      netRoyalties,
      logs,
    };
  }
}
