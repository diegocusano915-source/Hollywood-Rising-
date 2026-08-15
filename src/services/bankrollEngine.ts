/**
 * HOLLYWOOD RISING - MANAGER BANKROLL DEAL-SOURCING ENGINE (REAL)
 * Your Personal Manager sources real bankroll offers every ~4 weeks.
 * Player picks the investment amount; the INVISIBLE stopper kills deals
 * when the offer is too aggressive; under-funding worsens the odds;
 * outcomes are real rolls with real money (you can lose). Payout lands
 * 2-3 weeks after the project releases. Producer Trust builds over time.
 */

export type BankrollDealType = 'Movie' | 'Series' | 'Streaming Original';
export type BankrollRisk = 'Low' | 'Medium' | 'High' | 'Extreme';
export type BankrollOutcome = 'Blockbuster' | 'Hit' | 'Average' | 'Flop';

export const BANKROLL_MIN_INVEST = 2000000; // $2M
export const BANKROLL_MAX_ASK = 1000000000; // $1B absolute cap (mega-deals are trust-gated)

export interface BankrollDeal {
  id: string;
  title: string;
  type: BankrollDealType;
  ask: number; // producer's requested budget
  stopperLimit: number; // INVISIBLE: offer above this instantly breaks the deal (ask * 1.4-1.8)
  expectedReturnPct: number;
  risk: BankrollRisk;
  productionWeeks: number;
  producer: string;
  sourceWeek: number;
  sourceYear: number;
  weeksLeft: number; // 6-week offer window
  status: 'PENDING' | 'EXPIRED' | 'BROKEN';
}

export interface BankrollInvestment {
  id: string;
  dealId: string;
  title: string;
  type: BankrollDealType;
  producer: string;
  ask: number;
  investedAmount: number;
  underfunded: boolean;
  risk: BankrollRisk;
  expectedReturnPct: number;
  productionWeeks: number;
  weeksRemaining: number;
  phase: 'PRODUCTION' | 'RELEASED' | 'PAID';
  outcome?: BankrollOutcome;
  multiplier?: number;
  payoutAmount?: number;
  netProfit?: number;
  payoutInWeeks?: number;
  releasedWeek?: number;
}

export interface BankrollHistoryEntry {
  id: string;
  title: string;
  week: number;
  year: number;
  type: 'PAYOUT' | 'BROKEN' | 'EXPIRED' | 'RELEASED' | 'SILENCE';
  amount?: number;
  outcome?: string;
  message: string;
}

export interface BankrollState {
  version: number;
  trust: number; // 0-100 Producer Trust
  deals: BankrollDeal[];
  investments: BankrollInvestment[];
  history: BankrollHistoryEntry[];
  nextSourceWeek: number;
  nextSourceYear?: number; // year-aware scheduling (survives year rollover)
}

const KEY = 'HR_BANKROLL_V1';

const DEAL_TITLES = {
  Movie: [
    'Neon City Heist', 'The Last Horizon', 'Crimson Tide Rising', 'Beneath the Static',
    'Midnight in Marrakech', 'Steel Tempest', 'The Forgotten Coast', 'Echoes of Empire',
    'Rogue Protocol', 'Ashes of Tomorrow', 'The Silent Signal', 'Vanishing Point',
  ],
  Series: [
    'Crown of Shadows', 'The Precinct', 'Glass Empire', 'Southern Cross',
    'The Cartel Diaries', 'Terminal City', 'Kingdom of Sand', 'Blackwater Bay',
  ],
  'Streaming Original': [
    'The Algorithm', 'Deep Field', 'Night Shift', 'Hollow Earth',
    'The Feedback Loop', 'Solar Drift', 'Zero Day Protocol', 'Static Bloom',
  ],
};

const PRODUCERS = [
  'Marcus Webb', 'Diana Okafor', 'Victor Hale', 'Renata Silva', 'Kenji Watanabe',
  'Sofia Marchetti', 'James Calloway', 'Amina Diallo', 'Lucas Moreau', 'Grace Oyelaran',
];

const RISK_WEIGHTS: { risk: BankrollRisk; w: number; returnRange: [number, number] }[] = [
  { risk: 'Low', w: 20, returnRange: [25, 45] },
  { risk: 'Medium', w: 40, returnRange: [35, 65] },
  { risk: 'High', w: 30, returnRange: [55, 85] },
  { risk: 'Extreme', w: 10, returnRange: [75, 110] },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
}

export function loadBankrollState(): BankrollState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return parsed;
    }
  } catch {}
  const fresh: BankrollState = {
    version: 1,
    trust: 50,
    deals: [],
    investments: [],
    history: [],
    nextSourceWeek: 0,
  };
  saveBankrollState(fresh);
  return fresh;
}

export function saveBankrollState(state: BankrollState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

/**
 * Year-aware scheduling: week is week-of-year (1..52) and resets every year,
 * so a naive "week + N" comparison dies permanently once it crosses 52.
 * Store the due week AND year, computed on an absolute 52-week timeline.
 */
function setNextSource(state: BankrollState, week: number, year: number, delayWeeks: number) {
  const abs = year * 52 + (week - 1) + delayWeeks;
  state.nextSourceWeek = (abs % 52) + 1;
  state.nextSourceYear = Math.floor(abs / 52);
}

function sourceDue(state: BankrollState, week: number, year: number): boolean {
  const dueYear = state.nextSourceYear ?? year;
  return year > dueYear || (year === dueYear && week >= state.nextSourceWeek);
}

/** First activation: manager sources the first deal 3 weeks after signing. */
export function ensureBankrollInit(state: BankrollState, player: any) {
  if (!player?.representation?.manager?.signed) return;
  if (state.nextSourceWeek === 0) {
    setNextSource(state, player.dateWeek || 1, player.dateYear || 2026, 3);
    saveBankrollState(state);
  }
}

// Deal size scales with the manager's real tier + dealCap; TREASURED trust
// unlocks mega-deals above the tier ceiling (up to the $1B absolute cap)
function managerDealCeiling(mgr: any, trust: number): number {
  const cap = mgr?.dealCap || 250000000;
  const tier = mgr?.tier || 2;
  const tierMax = tier === 1 ? 10000000 : tier === 2 ? 60000000 : tier === 3 ? 200000000 : 500000000;
  let ceiling = Math.max(BANKROLL_MIN_INVEST, Math.min(cap, tierMax));
  if (trust >= 95) ceiling = Math.max(ceiling, 1000000000);
  else if (trust >= 80) ceiling = Math.max(ceiling, 750000000);
  return Math.min(ceiling, BANKROLL_MAX_ASK);
}

function generateDeal(state: BankrollState, player: any): BankrollDeal {
  const mgr = player?.representation?.manager;
  const ceiling = managerDealCeiling(mgr, state.trust);
  const trustBoost = 1 + (state.trust - 50) / 200; // trust 0 -> 0.75x, 100 -> 1.25x
  const ask = Math.max(
    BANKROLL_MIN_INVEST,
    Math.min(ceiling, Math.floor((BANKROLL_MIN_INVEST + Math.random() * (ceiling - BANKROLL_MIN_INVEST) * 0.7) * trustBoost / 100000) * 100000)
  );

  // Risk roll
  let risk: BankrollRisk = 'Medium';
  const r = Math.random() * 100;
  let acc = 0;
  for (const rw of RISK_WEIGHTS) {
    acc += rw.w;
    if (r <= acc) { risk = rw.risk; break; }
  }
  const rr = RISK_WEIGHTS.find((x) => x.risk === risk)!;
  const expectedReturnPct = Math.floor(rr.returnRange[0] + Math.random() * (rr.returnRange[1] - rr.returnRange[0]));

  const type = pick(['Movie', 'Movie', 'Movie', 'Series', 'Series', 'Streaming Original'] as BankrollDealType[]);
  const title = pick(DEAL_TITLES[type]);
  const productionWeeks = type === 'Series' ? 8 + Math.floor(Math.random() * 6) : 4 + Math.floor(Math.random() * 9);

  return {
    id: uid('bk'),
    title,
    type,
    ask,
    stopperLimit: Math.floor(ask * (1.4 + Math.random() * 0.4)), // 1.4x-1.8x, INVISIBLE
    expectedReturnPct,
    risk,
    productionWeeks,
    producer: pick(PRODUCERS),
    sourceWeek: player?.dateWeek || 1,
    sourceYear: player?.dateYear || 2026,
    weeksLeft: 6,
    status: 'PENDING',
  };
}

// ============ WEEKLY PROCESSING ============
export function processBankrollWeek(
  state: BankrollState,
  player: any,
  week: number,
  year: number
): { moneyDelta: number; messages: { subject: string; body: string; sender: string }[] } {
  const messages: { subject: string; body: string; sender: string }[] = [];
  let moneyDelta = 0;
  const mgr = player?.representation?.manager;

  // Legacy-save migration: old states stored a bare nextSourceWeek (1..56).
  // Anything above 52 could NEVER fire again after a year rollover — revive
  // those dead schedulers with a fresh 3-week countdown.
  if (state.nextSourceYear === undefined) {
    if (!state.nextSourceWeek || state.nextSourceWeek > 52) {
      setNextSource(state, week, year, 3);
    } else {
      state.nextSourceYear = year;
    }
  }

  // FROSTY trust slowly rebuilds (+1/week up to 25) so low trust is a drought,
  // never a permanent lock-out
  if (state.trust < 25) state.trust = Math.min(25, state.trust + 1);

  // 1. DEAL EXPIRY COUNTDOWN
  state.deals.forEach((d) => {
    if (d.status !== 'PENDING') return;
    d.weeksLeft -= 1;
    if (d.weeksLeft <= 0) {
      d.status = 'EXPIRED';
      state.history.unshift({
        id: uid('hx'), title: d.title, week, year, type: 'EXPIRED',
        message: `The "${d.title}" offer from ${d.producer} expired — the producer moved on.`,
      });
      messages.push({
        subject: `❌ Bankroll offer expired: ${d.title}`,
        body: `The ${d.ask.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} offer on "${d.title}" (${d.producer}) sat too long and the producer moved on. Trust intact — a new opportunity will surface soon.`,
        sender: mgr?.name || 'Your Manager',
      });
    }
  });
  state.deals = state.deals.filter((d) => d.status === 'PENDING');

  // 2. INVESTMENT PRODUCTION COUNTDOWN
  state.investments.forEach((inv) => {
    if (inv.phase === 'PAID') return;

    if (inv.phase === 'PRODUCTION') {
      inv.weeksRemaining -= 1;
      if (inv.weeksRemaining <= 0) {
        inv.phase = 'RELEASED';
        inv.releasedWeek = week;
        // REAL OUTCOME ROLL — you can lose money
        const base =
          inv.underfunded
            ? { Blockbuster: 0.08, Hit: 0.28, Average: 0.34, Flop: 0.30 }
            : { Blockbuster: 0.18, Hit: 0.42, Average: 0.28, Flop: 0.12 };
        if (state.trust >= 70) {
          base.Blockbuster += 0.05;
          base.Flop = Math.max(0.05, base.Flop - 0.05);
        }
        const roll = Math.random();
        let outcome: BankrollOutcome = 'Flop';
        let cursor = 0;
        for (const o of ['Blockbuster', 'Hit', 'Average', 'Flop'] as BankrollOutcome[]) {
          cursor += base[o];
          if (roll <= cursor) { outcome = o; break; }
        }

        // HONEST PAYOUT: the multiplier scales with the deal's advertised
        // Expected Return %, so the offer sheet tells the truth. EV across the
        // outcome ladder ≈ the advertised return; flops still lose real money.
        const E = 1 + (inv.expectedReturnPct || 50) / 100;
        const mult =
          outcome === 'Blockbuster' ? Math.min(3.0, E * 1.45)
          : outcome === 'Hit' ? E * 1.1
          : outcome === 'Average' ? E * 0.85
          : 0.4;
        inv.outcome = outcome;
        inv.multiplier = Math.round(mult * 100) / 100;
        inv.payoutInWeeks = 2 + Math.floor(Math.random() * 2); // 2-3 weeks

        // Trust moves with the outcome
        const trustDelta = outcome === 'Blockbuster' ? 12 : outcome === 'Hit' ? 6 : outcome === 'Average' ? 2 : -15;
        state.trust = Math.max(0, Math.min(100, state.trust + trustDelta));

        state.history.unshift({
          id: uid('hx'), title: inv.title, week, year, type: 'RELEASED',
          outcome, message: `"${inv.title}" released — ${outcome}. Payout in ${inv.payoutInWeeks} week(s).`,
        });
        messages.push({
          subject: `🎬 RELEASED: "${inv.title}" — ${outcome}`,
          body: `The ${inv.type} you bankrolled wrapped production and hit its release window.\n\n• Outcome: ${outcome}${inv.underfunded ? ' (project was under-funded — odds were worse)' : ''}\n• Your investment: ${inv.investedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}\n• Return multiplier: ${inv.multiplier}x\n\nPayout lands in ${inv.payoutInWeeks} week(s). Producer trust: ${state.trust}/100.`,
          sender: inv.producer,
        });
      }
    } else if (inv.phase === 'RELEASED') {
      inv.payoutInWeeks = (inv.payoutInWeeks || 2) - 1;
      if ((inv.payoutInWeeks || 0) <= 0) {
        inv.phase = 'PAID';
        inv.payoutAmount = Math.floor(inv.investedAmount * (inv.multiplier || 1));
        inv.netProfit = inv.payoutAmount - inv.investedAmount;
        moneyDelta += inv.payoutAmount;
        state.history.unshift({
          id: uid('hx'), title: inv.title, week, year, type: 'PAYOUT',
          amount: inv.netProfit, outcome: inv.outcome,
          message: `${inv.outcome}: paid ${inv.payoutAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} (net ${inv.netProfit >= 0 ? '+' : ''}${inv.netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}).`,
        });
        messages.push({
          subject: `💰 Bankroll payout received: ${inv.title}`,
          body: `${inv.producer} wired the backend payout.\n\n• Payout: ${inv.payoutAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}\n• Net ${inv.netProfit >= 0 ? 'PROFIT' : 'LOSS'}: ${inv.netProfit >= 0 ? '+' : '-'}${Math.abs(inv.netProfit).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}\n\nDeposited into your account.`,
          sender: inv.producer,
        });
      }
    }
  });

  // 3. MANAGER SOURCING (every ~4 weeks, faster at high trust; silence while
  // trust rebuilds) — year-aware due check survives every year rollover
  if (mgr?.signed && sourceDue(state, week, year)) {
    if (state.trust < 25) {
      setNextSource(state, week, year, 3);
      state.history.unshift({
        id: uid('hx'), title: 'Producer trust low', week, year, type: 'SILENCE',
        message: 'Producers went quiet — trust is rebuilding.',
      });
      messages.push({
        subject: `🤝 ${mgr.name}: producers are hesitant`,
        body: `Your bankroll track record has hurt your standing (Producer Trust ${state.trust}/100). Producers aren't returning calls yet, but your reputation is rebuilding every week (+1/week). New offers return automatically once trust reaches 25.`,
        sender: mgr.name,
      });
    } else {
      const deal = generateDeal(state, player);
      state.deals.unshift(deal);
      setNextSource(state, week, year, state.trust >= 80 ? 3 : 4);
      messages.push({
        subject: `🤝 BANKROLL OPPORTUNITY: "${deal.title}"`,
        body: `${mgr.name} (${mgr.company}) sourced a co-financing deal.\n\n• Project: "${deal.title}" (${deal.type})\n• Producer: ${deal.producer}\n• Ask: ${deal.ask.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}\n• Expected return: +${deal.expectedReturnPct}% (${deal.risk} risk)\n• Production: ${deal.productionWeeks} weeks\n\nOpen World → Bankroll to review the offer sheet and invest. You choose the amount — the offer expires in 6 weeks.`,
        sender: mgr.name,
      });
    }
  }

  saveBankrollState(state);
  return { moneyDelta, messages };
}

// ============ PLAYER ACTIONS ============
export function investInDeal(
  state: BankrollState,
  dealId: string,
  amount: number,
  playerMoney: number
): { success: boolean; message: string; brokeDeal?: boolean; newMoney?: number } {
  const deal = state.deals.find((d) => d.id === dealId && d.status === 'PENDING');
  if (!deal) return { success: false, message: 'Deal not found or expired.' };
  if (amount < BANKROLL_MIN_INVEST) {
    return { success: false, message: `Minimum bankroll investment is ${BANKROLL_MIN_INVEST.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}.` };
  }
  if (playerMoney < amount) {
    return { success: false, message: `Insufficient funds — you have ${playerMoney.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}.` };
  }
  const maxActive = state.trust >= 80 ? 3 : 2; // TREASURED trust funds a 3rd concurrent project
  const activeCount = state.investments.filter((i) => i.phase !== 'PAID').length;
  if (activeCount >= maxActive) {
    return { success: false, message: `You already have ${maxActive} active bankroll investments — wait for one to pay out.` };
  }

  // INVISIBLE STOPPER: too-aggressive offers kill the deal instantly
  if (amount > deal.stopperLimit) {
    deal.status = 'BROKEN';
    state.trust = Math.max(0, state.trust - 20);
    state.history.unshift({
      id: uid('hx'), title: deal.title, week: deal.sourceWeek, year: deal.sourceYear, type: 'BROKEN',
      message: `Over-offered on "${deal.title}" — ${deal.producer} pulled the deal. Trust -20.`,
    });
    saveBankrollState(state);
    return {
      success: false,
      brokeDeal: true,
      message: `🚨 ${deal.producer} GOT COLD FEET — the deal is dead. Your offer was too aggressive for the project and the producer walked. Producer trust dropped.`,
    };
  }

  const underfunded = amount < deal.ask * 0.7;
  state.investments.unshift({
    id: uid('inv'),
    dealId: deal.id,
    title: deal.title,
    type: deal.type,
    producer: deal.producer,
    ask: deal.ask,
    investedAmount: amount,
    underfunded,
    risk: deal.risk,
    expectedReturnPct: deal.expectedReturnPct,
    productionWeeks: deal.productionWeeks,
    weeksRemaining: deal.productionWeeks,
    phase: 'PRODUCTION',
  });
  state.deals = state.deals.filter((d) => d.id !== deal.id);
  state.trust = Math.min(100, state.trust + 2);
  saveBankrollState(state);
  return {
    success: true,
    message: `✅ You bankrolled "${deal.title}" with ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}. Production runs ${deal.productionWeeks} weeks.`,
    newMoney: playerMoney - amount,
  };
}

export function bankrollTrustLabel(trust: number): { label: string; color: string } {
  if (trust >= 80) return { label: 'TREASURED', color: '#34d399' };
  if (trust >= 60) return { label: 'RESPECTED', color: '#a3e635' };
  if (trust >= 40) return { label: 'ESTABLISHED', color: '#fbbf24' };
  if (trust >= 25) return { label: 'WATCHED', color: '#fb923c' };
  return { label: 'FROSTY', color: '#f87171' };
}
