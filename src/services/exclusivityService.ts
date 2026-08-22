/**
 * HOLLYWOOD RISING \u2014 Exclusivity Engine
 *
 * Real contract mechanics:
 *  - Signing a deal creates a clause: the brand's CATEGORY is locked for the
 *    contract term (competitors' offers become unacceptably risky to sign).
 *  - Taking conflicting work anyway = BREACH: 2x fee penalty in cash, the
 *    original deal terminates instantly, the brand blacklists you, and both
 *    public reputation and industry respect take a real hit.
 *  - Everything is computed from real state on real events \u2014 nothing fires
 *    on render, nothing is invented.
 */

import { ExclusivityClause, ExclusivityState, ExclusivitySource, LockCategory } from '../types/exclusivity';

const STORAGE_KEY = 'HR_EXCLUSIVITY_V1';
const BREACH_PENALTY_MULT = 2;      // 2x the deal fee
const BREACH_REP_HIT = 5;           // publicReputation -5 per breach
const BREACH_RESPECT_HIT = 5;       // industryRespect -5 per breach
const BLACKLIST_WEEKS = 78;         // ~18 months of brand memory

function absWeek(week: number, year: number): number {
  return year * 52 + week;
}

function defaultState(): ExclusivityState {
  return { clauses: [], blacklist: [], breaches: [] };
}

export class ExclusivityService {
  private static state: ExclusivityState | null = null;

  public static getState(): ExclusivityState {
    if (this.state) return this.state;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ExclusivityState;
        this.state = {
          clauses: Array.isArray(parsed.clauses) ? parsed.clauses : [],
          blacklist: Array.isArray(parsed.blacklist) ? parsed.blacklist : [],
          breaches: Array.isArray(parsed.breaches) ? parsed.breaches : [],
        };
        return this.state;
      }
    } catch {}
    this.state = defaultState();
    this.save();
    return this.state;
  }

  /** Test hook: drop the in-memory cache (tests reseed storage). */
  public static resetCache(): void {
    this.state = null;
  }

  private static save(): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)); } catch {}
  }

  // ------------------------------------------------------------------
  // CLAUSE CREATION \u2014 called on the real signing/booking events
  // ------------------------------------------------------------------

  public static recordClause(input: {
    source: ExclusivitySource;
    brandName: string;
    category: LockCategory;
    startWeek: number;
    startYear: number;
    durationWeeks: number;
    dealFee: number;
    linkedDealId?: string;
    description: string;
  }): ExclusivityClause {
    const st = this.getState();
    // One clause per source+brand: refresh (extend) if re-signed
    const existingIdx = st.clauses.findIndex(c => c.source === input.source && c.brandName === input.brandName && c.category === input.category);
    const clause: ExclusivityClause = {
      id: `excl_${input.source}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      source: input.source,
      brandName: input.brandName,
      category: input.category,
      startedAbsoluteWeek: absWeek(input.startWeek, input.startYear),
      expiresAbsoluteWeek: absWeek(input.startWeek, input.startYear) + Math.max(1, input.durationWeeks),
      penaltyAmount: Math.floor(input.dealFee * BREACH_PENALTY_MULT),
      linkedDealId: input.linkedDealId,
      description: input.description,
    };
    if (existingIdx >= 0) st.clauses[existingIdx] = clause;
    else st.clauses.push(clause);
    this.save();
    return clause;
  }

  // ------------------------------------------------------------------
  // QUERIES \u2014 locked categories, blocking reasons, blacklist checks
  // ------------------------------------------------------------------

  /** Active clauses only (expired ones are pruned by the weekly tick). */
  public static activeClauses(currentWeek: number, currentYear: number): ExclusivityClause[] {
    const now = absWeek(currentWeek, currentYear);
    return this.getState().clauses.filter(c => c.expiresAbsoluteWeek > now);
  }

  public static isBlacklisted(brandName: string, currentWeek: number, currentYear: number): boolean {
    const now = absWeek(currentWeek, currentYear);
    return this.getState().blacklist.some(b => b.brandName === brandName && b.untilAbsoluteWeek > now);
  }

  /**
   * Why can't this brand offer be signed? Locked if an active clause holds
   * the category for a DIFFERENT brand, or this brand blacklisted the player.
   */
  public static offerBlockReason(
    brandName: string,
    category: LockCategory,
    currentWeek: number,
    currentYear: number
  ): string | null {
    if (this.isBlacklisted(brandName, currentWeek, currentYear)) {
      return `${brandName} has blacklisted you over a breached deal \u2014 no offers until they forget.`;
    }
    const blocker = this.activeClauses(currentWeek, currentYear).find(
      c => c.category === category && c.brandName !== brandName
    );
    if (blocker) {
      const w = blocker.expiresAbsoluteWeek - absWeek(currentWeek, currentYear);
      return `Exclusive to ${blocker.brandName} (${blocker.category}) for ${w} more week${w === 1 ? '' : 's'} \u2014 breach penalty $${blocker.penaltyAmount.toLocaleString()}`;
    }
    return null;
  }

  /** Locked categories for UI badges. */
  public static lockedCategories(currentWeek: number, currentYear: number): LockCategory[] {
    return Array.from(new Set(this.activeClauses(currentWeek, currentYear).map(c => c.category)));
  }

  // ------------------------------------------------------------------
  // BREACH \u2014 the player took conflicting work. Real consequences.
  // ------------------------------------------------------------------

  public static applyBreach(
    clause: ExclusivityClause,
    conflictingWork: string,
    player: { money: number; publicReputation?: number; industryRespect?: number; dateWeek: number; dateYear: number },
    terminateLinkedDeal?: (dealId: string) => void
  ): { penaltyPaid: number; message: string } {
    const st = this.getState();
    const now = absWeek(player.dateWeek, player.dateYear);

    // 1. Cash penalty (clamped to what the player has \u2014 debt isn't modeled)
    const penaltyPaid = Math.max(0, Math.min(clause.penaltyAmount, player.money));
    player.money -= penaltyPaid;

    // 2. Reputation + industry respect \u2014 real, visible
    player.publicReputation = Math.max(0, (player.publicReputation ?? 50) - BREACH_REP_HIT);
    player.industryRespect = Math.max(0, (player.industryRespect ?? 50) - BREACH_RESPECT_HIT);

    // 3. Terminate the linked deal instantly
    if (clause.linkedDealId && terminateLinkedDeal) {
      terminateLinkedDeal(clause.linkedDealId);
    }

    // 4. The brand blacklists the player
    const existing = st.blacklist.find(b => b.brandName === clause.brandName);
    const until = now + BLACKLIST_WEEKS;
    if (existing) existing.untilAbsoluteWeek = Math.max(existing.untilAbsoluteWeek, until);
    else st.blacklist.push({ brandName: clause.brandName, untilAbsoluteWeek: until });

    // 5. Remove the breached clause + record history
    st.clauses = st.clauses.filter(c => c.id !== clause.id);
    st.breaches.unshift({
      id: `breach_${Date.now()}`,
      week: player.dateWeek,
      year: player.dateYear,
      description: `Broke ${clause.source === 'STREAMING_SERIES' ? 'streaming series exclusivity' : `exclusivity with ${clause.brandName}`} by taking: ${conflictingWork}`,
      penaltyAmount: penaltyPaid,
      reputationHit: BREACH_REP_HIT,
    });
    if (st.breaches.length > 20) st.breaches.length = 20;
    this.save();

    const message =
      `CONTRACT BREACH \u2014 EXCLUSIVITY VIOLATION\n\n` +
      `${clause.description}\n\n` +
      `You broke the clause by taking: ${conflictingWork}\n\n` +
      `PENALTIES APPLIED:\n` +
      `\u2022 Cash penalty paid: $${penaltyPaid.toLocaleString()} (2x deal fee)\n` +
      `\u2022 ${clause.linkedDealId ? 'Original deal TERMINATED immediately\n\u2022 ' : ''}${clause.brandName} blacklisted you for ~18 months\n` +
      `\u2022 Public reputation -${BREACH_REP_HIT} (now ${player.publicReputation})\n` +
      `\u2022 Industry respect -${BREACH_RESPECT_HIT} (now ${player.industryRespect})\n\n` +
      `Brands talk. Future offers will remember this.`;

    return { penaltyPaid, message };
  }

  // ------------------------------------------------------------------
  // WEEKLY TICK \u2014 expire clauses and blacklist entries on real weeks
  // ------------------------------------------------------------------

  public static processWeek(currentWeek: number, currentYear: number): string[] {
    const st = this.getState();
    const now = absWeek(currentWeek, currentYear);
    const notes: string[] = [];

    const expired = st.clauses.filter(c => c.expiresAbsoluteWeek <= now);
    for (const c of expired) {
      notes.push(`\u2705 Exclusivity expired: ${c.description}`);
    }
    if (expired.length > 0) st.clauses = st.clauses.filter(c => c.expiresAbsoluteWeek > now);

    const freedBrands = st.blacklist.filter(b => b.untilAbsoluteWeek <= now);
    for (const b of freedBrands) {
      notes.push(`\u{1F91D} ${b.brandName} is willing to work with you again \u2014 blacklist expired.`);
    }
    if (freedBrands.length > 0) st.blacklist = st.blacklist.filter(b => b.untilAbsoluteWeek > now);

    if (expired.length > 0 || freedBrands.length > 0) this.save();
    return notes;
  }
}
