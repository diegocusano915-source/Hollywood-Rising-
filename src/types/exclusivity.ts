/**
 * HOLLYWOOD RISING \u2014 Exclusivity clause types.
 * Real contract law for fame: brands lock categories, breaches cost money
 * and reputation, and blacklists are remembered.
 */

import { BrandCategory } from './representation';

export type ExclusivitySource =
  | 'ENDORSEMENT'      // brand deal from the agent / endorsements desk
  | 'SPONSORSHIP'      // major sponsorship
  | 'MOVIE_PARTNER'    // brand partner attached to a film the player stars in
  | 'STREAMING_SERIES'; // series regular lock (no other streaming series)

/** Special lock category for streaming series exclusivity. */
export type LockCategory = BrandCategory | 'Streaming';

export interface ExclusivityClause {
  id: string;
  source: ExclusivitySource;
  brandName: string;
  category: LockCategory;
  /** Absolute week (year*52 + week) the clause started */
  startedAbsoluteWeek: number;
  /** Absolute week (year*52 + week) the clause expires */
  expiresAbsoluteWeek: number;
  /** Breach penalty in cash: 2x the deal fee */
  penaltyAmount: number;
  /** Linked deal id (brandOffers / sponsorships) terminated on breach */
  linkedDealId?: string;
  /** Human description for the breach notice */
  description: string;
}

export interface BrandBlacklistEntry {
  brandName: string;
  untilAbsoluteWeek: number;
}

export interface BreachRecord {
  id: string;
  week: number;
  year: number;
  description: string;
  penaltyAmount: number;
  reputationHit: number;
}

export interface ExclusivityState {
  clauses: ExclusivityClause[];
  blacklist: BrandBlacklistEntry[];
  breaches: BreachRecord[];
}

export interface ConflictCheckResult {
  conflicts: Array<{
    clause: ExclusivityClause;
    /** What the player is about to do that breaches it */
    reason: string;
  }>;
}
