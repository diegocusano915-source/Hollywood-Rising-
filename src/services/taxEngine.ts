/**
 * HOLLYWOOD RISING - REAL TAX ENGINE (V1)
 * Real weekly withholding from ALL real income, progressive brackets,
 * real deductions (charity, studio expenses, business losses, retainers),
 * year-end filing at Week 52 with refund/balance-due, audits with penalties
 * (lawyers can fight them) and corporate rate on business income when
 * incorporated. Every number derives from real player data.
 */

export type TaxIncomeCategory =
  | 'acting' | 'royalties' | 'business' | 'property' | 'sponsorship'
  | 'endorsement' | 'social' | 'interest' | 'fanClub' | 'merch'
  | 'streaming' | 'studio' | 'media';

export const TAX_CATEGORY_LABELS: Record<TaxIncomeCategory, string> = {
  acting: 'Acting Salary',
  royalties: 'Backend & Residuals',
  business: 'Business Ventures',
  property: 'Property Rent',
  sponsorship: 'Sponsorships',
  endorsement: 'Endorsements',
  social: 'Social / YouTube',
  interest: 'Savings Interest',
  fanClub: 'Fan Club Dues',
  merch: 'Merchandise',
  streaming: 'Streaming Royalties',
  studio: 'Personal Studio',
  media: 'Interviews & Media',
};

export interface TaxDeductionDetail {
  label: string;
  amount: number;
}

export interface TaxWeeklyEntry {
  week: number;
  income: number;
  withheld: number;
}

export interface TaxYearRecord {
  year: number;
  income: number;
  incomeByCategory: Partial<Record<TaxIncomeCategory, number>>;
  deductions: number;
  deductionDetails: TaxDeductionDetail[];
  withheld: number;
  taxable: number;
  liability: number;
  effectiveRate: number; // %
  filingStatus: 'IN_PROGRESS' | 'FILED';
  refund?: number;
  balanceDue?: number;
  audited?: boolean;
  auditPenalty?: number;
  auditNote?: string;
  filedWeek?: number;
  weekly: TaxWeeklyEntry[];
}

export interface TaxState {
  version: number;
  years: Record<number, TaxYearRecord>;
  lastProcessedWeek: number;
  lastProcessedYear: number;
  lastCharityTotal: number;
  lastStudioCostTotal: number;
}

const KEY = 'HR_TAX_V1';

export function loadTaxState(): TaxState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.years) return parsed;
    }
  } catch {}
  const fresh: TaxState = {
    version: 1,
    years: {},
    lastProcessedWeek: 0,
    lastProcessedYear: 0,
    lastCharityTotal: 0,
    lastStudioCostTotal: 0,
  };
  saveTaxState(fresh);
  return fresh;
}

export function saveTaxState(state: TaxState) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function getTaxRecord(state: TaxState, year: number): TaxYearRecord {
  if (!state.years[year]) {
    state.years[year] = {
      year,
      income: 0,
      incomeByCategory: {},
      deductions: 0,
      deductionDetails: [],
      withheld: 0,
      taxable: 0,
      liability: 0,
      effectiveRate: 0,
      filingStatus: 'IN_PROGRESS',
      weekly: [],
    };
  }
  return state.years[year];
}

// PROGRESSIVE BRACKETS (approved spec): 10% <$100K · 22% $100K-$1M · 35% $1M-$10M · 37% >
export function taxOnIncome(income: number): number {
  if (income <= 0) return 0;
  let tax = 0;
  let rest = income;
  if (rest > 10000000) { tax += (rest - 10000000) * 0.37; rest = 10000000; }
  if (rest > 1000000) { tax += (rest - 1000000) * 0.35; rest = 1000000; }
  if (rest > 100000) { tax += (rest - 100000) * 0.22; rest = 100000; }
  tax += rest * 0.10;
  return Math.floor(tax);
}

const ACCOUNTANT_DEDUCTION_PCT: Record<string, number> = {
  'None': 0,
  'Standard CPA': 0.15,
  'Boutique Firm': 0.35,
  'Elite Offshore Tax Attorneys': 0.60,
};

const AUDIT_CHANCE: Record<string, number> = {
  'None': 0.45,
  'Standard CPA': 0.3,
  'Boutique Firm': 0.18,
  'Elite Offshore Tax Attorneys': 0.08,
};

export interface TaxWeekInput {
  year: number;
  week: number;
  nextYear: number;
  incomeByCategory: Partial<Record<TaxIncomeCategory, number>>;
  charityDonatedThisWeek: number;
  studioExpensesThisWeek: number;
  businessLossesThisWeek: number;
  retainersThisWeek: number;
  accountantTier: string;
  incorporated: boolean;
  lawyerActive: boolean;
}

export interface TaxWeekResult {
  withheld: number;
  taxesPaid: number;
  filing?: {
    refund?: number;
    balanceDue?: number;
    penalty?: number;
    audited: boolean;
    auditNote?: string;
    subject: string;
    body: string;
  };
}

export function processTaxWeek(input: TaxWeekInput): TaxWeekResult {
  const state = loadTaxState();
  const record = getTaxRecord(state, input.year);

  // ============ REAL INCOME ============
  const totalIncome = Math.max(0, Math.floor(
    Object.values(input.incomeByCategory).reduce((a: number, b) => a + (b || 0), 0)
  ));
  if (totalIncome > 0) {
    record.income += totalIncome;
    Object.entries(input.incomeByCategory).forEach(([cat, amt]) => {
      if (!amt || amt <= 0) return;
      record.incomeByCategory[cat as TaxIncomeCategory] =
        (record.incomeByCategory[cat as TaxIncomeCategory] || 0) + Math.floor(amt);
    });
  }

  // ============ REAL DEDUCTIONS ============
  // Charity donations: 100% deductible (dollar for dollar)
  let charityDeduction = Math.max(0, Math.floor(input.charityDonatedThisWeek));
  // Studio expenses + retainers + business losses: deductible at accountant rate
  const accountantPct = ACCOUNTANT_DEDUCTION_PCT[input.accountantTier] ?? 0;
  const businessDeduction = Math.floor(
    (input.studioExpensesThisWeek + input.retainersThisWeek + input.businessLossesThisWeek) * accountantPct
  );
  const details: TaxDeductionDetail[] = [];
  if (charityDeduction > 0) details.push({ label: 'Charity donations', amount: charityDeduction });
  if (businessDeduction > 0) {
    details.push({
      label: `Business/studio expenses (${input.accountantTier || 'None'} ${Math.round(accountantPct * 100)}%)`,
      amount: businessDeduction,
    });
  }
  record.deductions += charityDeduction + businessDeduction;
  if (details.length > 0) record.deductionDetails.push(...details);

  // ============ TAXABLE INCOME + LIABILITY ============
  const taxable = Math.max(0, record.income - record.deductions);
  record.taxable = taxable;

  // Incorporated: business income at flat corporate 21%; rest at individual brackets
  let liability: number;
  if (input.incorporated) {
    const bizIncome = (record.incomeByCategory.business || 0) + (record.incomeByCategory.studio || 0);
    const individual = Math.max(0, taxable - bizIncome);
    liability = taxOnIncome(individual) + Math.floor(bizIncome * 0.21);
  } else {
    liability = taxOnIncome(taxable);
  }
  record.liability = liability;

  // ============ WEEKLY WITHHOLDING (annualized estimate) ============
  const weeksElapsed = Math.max(1, Math.min(52, input.week));
  const annualized = (taxable / weeksElapsed) * 52;
  const annualizedLiability = input.incorporated
    ? taxOnIncome(Math.max(0, annualized - ((record.incomeByCategory.business || 0) + (record.incomeByCategory.studio || 0)) * (52 / weeksElapsed))) + Math.floor(((record.incomeByCategory.business || 0) + (record.incomeByCategory.studio || 0)) * (52 / weeksElapsed) * 0.21)
    : taxOnIncome(annualized);
  const weeklyWithhold = Math.max(0, Math.floor(annualizedLiability / 52));
  const withheld = totalIncome > 0 ? Math.min(weeklyWithhold, Math.floor(totalIncome * 0.5)) : 0;
  record.withheld += withheld;
  record.weekly.push({ week: input.week, income: totalIncome, withheld });
  record.effectiveRate = taxable > 0 ? Math.round((liability / taxable) * 1000) / 10 : 0;

  state.lastProcessedWeek = input.week;
  state.lastProcessedYear = input.year;
  state.lastCharityTotal += charityDeduction;
  state.lastStudioCostTotal += Math.floor(input.studioExpensesThisWeek);
  saveTaxState(state);

  // ============ YEAR-END FILING (Week 52 -> new year) ============
  let filing: TaxWeekResult['filing'];
  if (input.nextYear > input.year && record.filingStatus !== 'FILED') {
    const diff = record.withheld - liability;
    let refund: number | undefined;
    let balanceDue: number | undefined;
    if (diff >= 0) refund = diff;
    else balanceDue = -diff;

    // AUDIT: only triggered by REAL underpayment (owed >20% of liability and >$50K)
    let audited = false;
    let penalty = 0;
    let auditNote = 'No audit — your filings were within tolerance.';
    if (balanceDue && balanceDue > 0 && balanceDue > liability * 0.2 && liability > 50000) {
      const chance = AUDIT_CHANCE[input.accountantTier] ?? 0.45;
      if (Math.random() < chance) {
        audited = true;
        penalty = Math.floor(balanceDue * 0.15);
        if (input.lawyerActive && Math.random() < 0.7) {
          penalty = 0;
          auditNote = '⚠️ You were audited for underpayment — your lawyer fought it and the penalty was dismissed.';
        } else {
          auditNote = `⚠️ AUDITED for underpayment — penalty of $${penalty.toLocaleString()} assessed (15% of balance due).`;
        }
      }
    }

    record.filingStatus = 'FILED';
    record.filedWeek = input.week;
    record.refund = refund;
    record.balanceDue = balanceDue;
    record.audited = audited;
    record.auditPenalty = penalty;
    record.auditNote = auditNote;

    filing = {
      refund,
      balanceDue,
      penalty,
      audited,
      auditNote,
      subject: refund && refund > 0
        ? `🧾 TAX REFUND ${input.year}: $${refund.toLocaleString()} returned`
        : `🧾 TAX FILING ${input.year}: $${(balanceDue || 0).toLocaleString()} balance due`,
      body: `YOUR ${input.year} TAX RETURN IS COMPLETE\n\n• Gross income: $${record.income.toLocaleString()}\n• Deductions: $${record.deductions.toLocaleString()}\n• Taxable income: $${taxable.toLocaleString()}\n• Tax withheld during year: $${record.withheld.toLocaleString()}\n• Final liability: $${liability.toLocaleString()} (${record.effectiveRate}% effective rate)\n\n${
        refund && refund > 0
          ? `✅ OVERPAID — REFUND of $${refund.toLocaleString()} has been deposited into your account.`
          : `⚠️ UNDERPAID — balance due of $${(balanceDue || 0).toLocaleString()} was collected.`
      }\n\n${auditNote}`,
    };
    saveTaxState(state);
  }

  return { withheld, taxesPaid: withheld, filing };
}

/** Weekly charity donation delta (real, from Representation charity state) */
export function charityDeltaThisWeek(charities: { totalDonated?: number }[]): number {
  const state = loadTaxState();
  const current = (charities || []).reduce((a, c) => a + (c?.totalDonated || 0), 0);
  const delta = Math.max(0, current - state.lastCharityTotal);
  return delta;
}

/** Weekly studio expense delta (real, from Personal Studio financials) */
export function studioExpenseDeltaThisWeek(financials: { type: string; amount: number }[]): number {
  const state = loadTaxState();
  const current = (financials || [])
    .filter((f) => f?.type === 'COST')
    .reduce((a, f) => a + Math.abs(f?.amount || 0), 0);
  const delta = Math.max(0, current - state.lastStudioCostTotal);
  return delta;
}

/** Audit-risk display score: real ratio of underpayment vs liability */
export function auditRiskScore(record: TaxYearRecord | undefined): number {
  if (!record || record.filingStatus !== 'FILED' || !record.balanceDue || record.liability <= 0) return 0;
  return Math.min(100, Math.round((record.balanceDue / record.liability) * 100));
}
