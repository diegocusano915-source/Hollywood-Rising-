/**
 * HOLLYWOOD RISING — BLACK CARD SOCIETY ENGINE
 * DM conversations with archetype replies (SUAVE / BRASS TACKS / SWAGGER /
 * CAGEY — different from TV & radio pools), relationship-gated REAL deal
 * rolls (brand contracts, co-investments, favors), concierge events whose
 * outcomes hit the actual ledger (fame, fans, relationship, tax deduction,
 * poker pot, tabloid risk, realm unlocks), and yearly dues.
 * Nothing is fake: every number returned is applied by the caller.
 */

import { EmpireFullState, SocietyDeal, EliteEventLog } from '../types/empire';
import {
  SocietyContact, EliteRealm, SOCIETY_CONTACTS, REALM_META,
  REALM_OPENERS, REALM_RESPONSES,
} from '../database/eliteClubDatabase';

export const SOCIETY_ENTRY_FEE = 100000;
export const SOCIETY_MIN_FAME = 500;
export const SOCIETY_ANNUAL_DUES = 250000;
export const BLACK_CARD_TIERS = [
  { minRel: 75, label: 'INNER CIRCLE' },
  { minRel: 50, label: 'TRUSTED' },
  { minRel: 25, label: 'WARM' },
  { minRel: 0, label: 'COLD' },
];

export type ReplyArchetype = 'SUAVE' | 'BRASS TACKS' | 'SWAGGER' | 'CAGEY';

export interface ReplyOption {
  archetype: ReplyArchetype;
  text: string;
  relChange: number;
  /** Optional negotiation effect: scales a pending deal's cash */
  dealScale?: number;
}

const relOf = (state: EmpireFullState, contactId: string): number =>
  (state.eliteClub.relationships || {})[contactId] ?? 10;

const setRel = (state: EmpireFullState, contactId: string, val: number) => {
  state.eliteClub.relationships = state.eliteClub.relationships || {};
  state.eliteClub.relationships[contactId] = Math.max(0, Math.min(100, val));
};

export const tierFor = (rel: number): string =>
  BLACK_CARD_TIERS.find((t) => rel >= t.minRel)?.label || 'COLD';

/** Realms the player can see right now (-1 = explicit unlock only) */
export function unlockedRealms(state: EmpireFullState, fameXp: number): EliteRealm[] {
  const explicit = new Set<string>(state.eliteClub.unlockedRealms || []);
  const out: EliteRealm[] = [];
  for (const realm of Object.keys(REALM_META) as EliteRealm[]) {
    const meta = REALM_META[realm];
    if (meta.unlockFame === 0 || (meta.unlockFame > 0 && fameXp >= meta.unlockFame) || explicit.has(realm)) {
      out.push(realm);
    }
  }
  return out;
}

export function forceUnlockRealm(state: EmpireFullState, realm: EliteRealm) {
  state.eliteClub.unlockedRealms = state.eliteClub.unlockedRealms || [];
  if (!state.eliteClub.unlockedRealms.includes(realm)) {
    state.eliteClub.unlockedRealms.push(realm);
  }
}

export function findContact(id: string): SocietyContact | undefined {
  return SOCIETY_CONTACTS.find((c) => c.id === id);
}

// ============================================================
// DM ENGINE
// ============================================================
type Msg = { who: 'them' | 'me' | 'system'; text: string; dealId?: string };

const threadOf = (state: EmpireFullState, contactId: string): Msg[] => {
  state.eliteClub.threads = state.eliteClub.threads || {};
  if (!state.eliteClub.threads[contactId]) state.eliteClub.threads[contactId] = [];
  return state.eliteClub.threads[contactId];
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Open (or return) a DM thread — sends the contact's opener if new */
export function openThread(state: EmpireFullState, contact: SocietyContact): Msg[] {
  const t = threadOf(state, contact.id);
  if (t.length === 0) {
    t.push({ who: 'them', text: pick(REALM_OPENERS[contact.realm]) });
    t.push({ who: 'system', text: `Conversation started — replies shape this relationship. Real deals unlock as it grows.` });
  }
  state.eliteClub.unread = state.eliteClub.unread || {};
  state.eliteClub.unread[contact.id] = false;
  return t;
}

/** Generate the player's 4 reply options for the current beat */
export function buildReplyOptions(state: EmpireFullState, contact: SocietyContact): ReplyOption[] {
  const rel = relOf(state, contact.id);
  const highRoll = rel >= 50;
  return [
    {
      archetype: 'SUAVE',
      text: pick([
        'For you? I\'d answer this at 3AM.',
        'Flattery works on me. Keep going.',
        'I like the way you do business. Let\'s keep talking.',
        'You clearly have taste — you DMed me.',
      ]),
      relChange: highRoll ? 6 : 4,
    },
    {
      archetype: 'BRASS TACKS',
      text: pick([
        'Numbers first. What are we actually talking about?',
        'Send terms. I read what I sign.',
        'Cut the charm — what\'s the structure?',
        'Interesting. What do you need from me, exactly?',
      ]),
      relChange: 3,
      dealScale: 1.15, // negotiators get +15% on pending deals
    },
    {
      archetype: 'SWAGGER',
      text: pick([
        'I\'m the best thing that\'ll happen to your portfolio.',
        'My name prints money. You know this.',
        'Slow down — I haven\'t even said yes yet.',
        'Everyone in this town wants a piece. Get in line.',
      ]),
      relChange: Math.random() < 0.6 ? 5 : -3, // charisma roll
    },
    {
      archetype: 'CAGEY',
      text: pick([
        'Have my people look at it first.',
        'I\'ve been burned by "friends-only" before.',
        'Let me think about it. Don\'t wait up.',
        'Who else is in on this?',
      ]),
      relChange: 2,
    },
  ];
}

/** Send a reply: apply REL, get the contact's response, maybe roll a deal */
export function sendReply(
  state: EmpireFullState,
  contact: SocietyContact,
  opt: ReplyOption
): { response: Msg; newDeal?: SocietyDeal } {
  const t = threadOf(state, contact.id);
  const before = relOf(state, contact.id);
  const delta = opt.archetype === 'SWAGGER' ? opt.relChange : opt.relChange;
  const after = Math.max(0, Math.min(100, before + delta));
  setRel(state, contact.id, after);
  t.push({ who: 'me', text: opt.text });

  // Deal roll at relationship milestones (25/50/75 crossings) or 18% chance
  const crossed = [25, 50, 75].some((gate) => before < gate && after >= gate);
  let newDeal: SocietyDeal | undefined;
  const wantDeal = crossed || (after >= 25 && Math.random() < 0.18);
  if (wantDeal && (state.eliteClub.deals || []).filter((d) => d.contactId === contact.id && d.status === 'PENDING').length === 0) {
    newDeal = rollDeal(state, contact, after, opt.dealScale || 1);
    if (newDeal) {
      state.eliteClub.deals = state.eliteClub.deals || [];
      state.eliteClub.deals.push(newDeal);
      t.push({
        who: 'them',
        text: `${dealOfferLine(newDeal)} — ${dealTermsLine(newDeal)}`,
        dealId: newDeal.id,
      });
    }
  }

  const response: Msg = { who: 'them', text: pick(REALM_RESPONSES[contact.realm]) };
  t.push(response);
  return { response, newDeal };
}

function dealOfferLine(d: SocietyDeal): string {
  if (d.kind === 'BRAND') return `Brand campaign: "${d.title}". Real contract, real money.`;
  if (d.kind === 'INVEST') return `Co-investment seat: "${d.title}". Cash in, quarterly payouts.`;
  return `A favor, called in: "${d.title}". Government speed, no charge.`;
}

function dealTermsLine(d: SocietyDeal): string {
  if (d.kind === 'BRAND') return `$${(d.cashOut || 0).toLocaleString()} flat + ${(d.fansBonus || 0).toLocaleString()} fans`;
  if (d.kind === 'INVEST') return `invest $${(d.cashIn || 0).toLocaleString}, payouts $${(d.weeklyPayout || 0).toLocaleString()}/wk`;
  return `effect: +${d.fameXp || 0} fame XP, permits fast-tracked`;
}

/** Roll a realm-appropriate deal */
function rollDeal(state: EmpireFullState, contact: SocietyContact, rel: number, scale: number): SocietyDeal | undefined {
  const now = Date.now();
  const base = {
    id: `deal_${now}_${Math.random().toString(36).slice(2, 6)}`,
    contactId: contact.id,
    contactName: contact.name,
    status: 'PENDING' as const,
    createdWeek: 0,
    createdYear: 0,
  };
  const relMult = 0.6 + rel / 100; // deeper ties = richer deals

  if (contact.realm === 'Billionaires' || contact.realm === 'Entrepreneurs') {
    const cashIn = Math.round((100000 + Math.random() * 900000) * relMult);
    const weekly = Math.round(cashIn * (0.012 + Math.random() * 0.02)); // ~1.2-3.2%/wk
    return { ...base, kind: 'INVEST', title: `${contact.affiliation} Private Fund`, cashIn, weeklyPayout: weekly, weeksRemaining: 52 };
  }
  if (contact.realm === 'Musicians' || contact.realm === 'Footballers' || contact.realm === 'Athletes') {
    const cash = Math.round((150000 + Math.random() * 850000) * relMult * scale);
    return { ...base, kind: 'BRAND', title: `${contact.name.split(' ')[0]} Brand Campaign`, cashOut: cash, fansBonus: Math.round(8000 + Math.random() * 30000), fameXp: Math.max(1, Math.round(rel / 12)) };
  }
  if (contact.realm === 'Government' || contact.realm === 'Politicians') {
    return { ...base, kind: 'FAVOR', title: `City Hall Favor — ${contact.name}`, fameXp: Math.max(1, Math.round(rel / 15)) };
  }
  // Actors / Directors / Media Moguls — brand or investment
  if (Math.random() < 0.5) {
    const cash = Math.round((100000 + Math.random() * 600000) * relMult * scale);
    return { ...base, kind: 'BRAND', title: `${contact.affiliation} Collab`, cashOut: cash, fansBonus: Math.round(5000 + Math.random() * 20000), fameXp: Math.max(1, Math.round(rel / 14)) };
  }
  const cashIn = Math.round((80000 + Math.random() * 520000) * relMult);
  return { ...base, kind: 'INVEST', title: `${contact.affiliation} Media Seat`, cashIn, weeklyPayout: Math.round(cashIn * (0.01 + Math.random() * 0.018)), weeksRemaining: 52 };
}

/** Accept a pending deal — returns real money/fan effects for the caller to apply */
export function acceptDeal(state: EmpireFullState, dealId: string): {
  success: boolean; message: string;
  cashOut: number; cashIn: number; fansBonus: number; fameXp: number;
} {
  const deal = (state.eliteClub.deals || []).find((d) => d.id === dealId);
  if (!deal || deal.status !== 'PENDING') {
    return { success: false, message: 'Deal not available.', cashOut: 0, cashIn: 0, fansBonus: 0, fameXp: 0 };
  }
  deal.status = 'ACCEPTED';
  const t = threadOf(state, deal.contactId);
  t.push({ who: 'system', text: `✔ DEAL SIGNED: ${deal.title} — contract confirmed, terms active.` });
  return {
    success: true,
    message: deal.kind === 'INVEST'
      ? `Invested $${(deal.cashIn || 0).toLocaleString()} in ${deal.title} — paying $${(deal.weeklyPayout || 0).toLocaleString()}/week for ${deal.weeksRemaining} weeks.`
      : `Signed ${deal.title}: +$${(deal.cashOut || 0).toLocaleString()} (tax applies) · +${(deal.fansBonus || 0).toLocaleString()} fans.`,
    cashOut: deal.cashOut || 0,
    cashIn: deal.cashIn || 0,
    fansBonus: deal.fansBonus || 0,
    fameXp: deal.fameXp || 0,
  };
}

export function declineDeal(state: EmpireFullState, dealId: string): boolean {
  const deal = (state.eliteClub.deals || []).find((d) => d.id === dealId);
  if (!deal || deal.status !== 'PENDING') return false;
  deal.status = 'DECLINED';
  return true;
}

// ============================================================
// CONCIERGE EVENTS — every outcome is real
// ============================================================
export interface SocietyEventOutcome {
  log: EliteEventLog;
  relGains: number;          // relationship added to each attendee
  attendeeIds: string[];     // contacts who attended (ids)
  fameXp: number;
  fans: number;
  pokerNet: number;          // casino events: net pot (can be negative)
  tabloidRisk: number;       // 0-1 chance of a PR scandal (caller rolls)
  taxDeductible: number;     // cost portion deductible this tax year
  unlockedRealm?: EliteRealm;
}

export function hostSocietyEvent(
  state: EmpireFullState,
  evt: { id: string; title: string; category: string; cost: number; minFameRequired: number },
  fameXp: number
): { success: boolean; message: string; outcome?: SocietyEventOutcome } {
  if (fameXp < evt.minFameRequired) {
    return { success: false, message: `Requires ${evt.minFameRequired.toLocaleString()} fame.` };
  }

  // Attendees: 8-14 contacts from themed realms
  const themes: Record<string, EliteRealm[]> = {
    'Charity Gala': ['Billionaires', 'Actors', 'Government', 'Politicians'],
    'Movie Premiere': ['Actors', 'Directors', 'Media Moguls'],
    'Casino Night': ['Billionaires', 'Footballers', 'Athletes'],
    'Tech Summit': ['Entrepreneurs', 'Billionaires', 'Media Moguls'],
    'Yacht Weekend': ['Billionaires', 'Entrepreneurs', 'Athletes'],
    'Island Retreat': ['Billionaires', 'Media Moguls', 'Directors'],
  };
  const realms = themes[evt.category] || ['Actors', 'Billionaires'];
  const pool = SOCIETY_CONTACTS.filter((c) => realms.includes(c.realm));
  const count = 8 + Math.floor(Math.random() * 7);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const attendees = shuffled.slice(0, count);

  const relGains = { 'Charity Gala': 6, 'Movie Premiere': 5, 'Casino Night': 8, 'Tech Summit': 7, 'Yacht Weekend': 9, 'Island Retreat': 12 }[evt.category] || 5;
  const fameXpGain = { 'Charity Gala': 6, 'Movie Premiere': 4, 'Casino Night': 8, 'Tech Summit': 9, 'Yacht Weekend': 12, 'Island Retreat': 15 }[evt.category] || 5;
  const fansGain = evt.category === 'Movie Premiere' ? 8000 : evt.category === 'Yacht Weekend' ? 9000 : 0;
  const deductible = evt.category === 'Charity Gala' || evt.category === 'Tech Summit' || evt.category === 'Island Retreat' ? evt.cost : 0;
  const pokerNet = evt.category === 'Casino Night' ? Math.round((Math.random() - 0.45) * 160000) : 0; // house edge
  const tabloidRisk = evt.category === 'Casino Night' ? 0.15 : evt.category === 'Yacht Weekend' ? 0.08 : 0;

  for (const att of attendees) setRel(state, att.id, relOf(state, att.id) + relGains);

  // Realm unlock: Charity Gala brings Government through the door
  let unlockedRealm: EliteRealm | undefined;
  if (evt.category === 'Charity Gala') {
    const before = unlockedRealms(state, fameXp).includes('Government');
    forceUnlockRealm(state, 'Government');
    if (!before) unlockedRealm = 'Government';
  }

  const outcome: SocietyEventOutcome = {
    log: {
      id: `evt_log_${Date.now()}`,
      eventTitle: evt.title,
      week: 0, year: 0, // caller stamps
      attendeesCount: attendees.length,
      outcome: `${attendees.length} VIPs · +${relGains} REL each · +${fameXpGain} fame${pokerNet !== 0 ? ` · poker ${pokerNet > 0 ? '+' : '−'}$${Math.abs(pokerNet).toLocaleString()}` : ''}`,
      impactText: `Hosted ${evt.title}. ${attendees.length} contacts attended (+${relGains} relationship each).`,
    },
    relGains, attendeeIds: attendees.map((a) => a.id), fameXp: fameXpGain,
    fans: fansGain, pokerNet, tabloidRisk, taxDeductible: deductible, unlockedRealm,
  };

  return {
    success: true,
    message: `${evt.title} hosted — ${attendees.length} contacts attended. All outcomes applied.`,
    outcome,
  };
}

// ============================================================
// WEEKLY TICK — dues + investment payouts (real money, called from
// GameContext every week; returns effects to apply)
// ============================================================
export function processSocietyWeek(
  state: EmpireFullState,
  week: number,
  year: number
): { duesCharged: number; investPayout: number; expiredDeals: string[] } {
  let duesCharged = 0;
  let investPayout = 0;
  const expiredDeals: string[] = [];

  if (state.eliteClub.isMember) {
    // Annual dues: charge every 52 weeks since last charge
    const abs = year * 52 + week;
    const last = state.eliteClub.duesLastChargedWeek ?? (state.eliteClub.joinedYear || 2026) * 52 + (state.eliteClub.joinedWeek || 1);
    if (abs - last >= 52) {
      duesCharged = SOCIETY_ANNUAL_DUES;
      state.eliteClub.duesLastChargedWeek = abs;
      state.eliteClub.yearlyDuesPaid = true;
    }
  }

  // Investment payouts tick down
  for (const d of state.eliteClub.deals || []) {
    if (d.status === 'ACCEPTED' && d.kind === 'INVEST' && (d.weeksRemaining || 0) > 0) {
      investPayout += d.weeklyPayout || 0;
      d.weeksRemaining = (d.weeksRemaining || 0) - 1;
      if ((d.weeksRemaining || 0) <= 0) expiredDeals.push(d.title);
    }
  }

  return { duesCharged, investPayout, expiredDeals };
}

/** Migration: seed the society state on first load after v2 */
export function ensureSocietyState(state: EmpireFullState) {
  const ec = state.eliteClub;
  if (!ec.unlockedRealms) ec.unlockedRealms = [];
  if (!ec.relationships) {
    ec.relationships = {};
    // Seed the old 8 elite NPCs' scores into matching contacts where possible
    for (const old of ec.eliteNpcs || []) {
      const match = SOCIETY_CONTACTS.find((c) => c.name === old.name || c.affiliation === old.companyName);
      if (match) ec.relationships[match.id] = Math.max(0, old.relationshipScore || 0);
    }
  }
  if (!ec.threads) ec.threads = {};
  if (!ec.unread) ec.unread = {};
  if (!ec.deals) ec.deals = [];
}
