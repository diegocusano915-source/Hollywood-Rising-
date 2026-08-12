/**
 * HOLLYWOOD RISING - Tax & Revenue Dashboard (REAL ENGINE)
 * Shows real weekly withholding from actual income, real deductions,
 * year-end filing status (refund / balance due), audit status and history.
 * Accountant retainers reduce your tax bill — real money, real effect.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, TaxBreakdown } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Landmark,
  Percent,
  DollarSign,
  FileText,
  UserCheck,
  TrendingDown,
  AlertOctagon,
  CheckCircle2,
  Scale,
  Building2,
  Receipt,
  History,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const ACCOUNTANT_TIERS: {
  tier: TaxBreakdown['accountantTier'];
  cost: number;
  savingsPercent: number;
  description: string;
}[] = [
  {
    tier: 'None',
    cost: 0,
    savingsPercent: 0,
    description: 'Standard IRS filing. Zero tax write-offs or offshore protection.',
  },
  {
    tier: 'Standard CPA',
    cost: 15000,
    savingsPercent: 15,
    description: 'Certified Public Accountant. Deducts 15% of eligible expenses.',
  },
  {
    tier: 'Boutique Firm',
    cost: 60000,
    savingsPercent: 35,
    description: 'Boutique West Hollywood tax firm. Deducts 35% of eligible expenses.',
  },
  {
    tier: 'Elite Offshore Tax Attorneys',
    cost: 200000,
    savingsPercent: 60,
    description: 'Cayman & Swiss tax counsel. Deducts 60% of eligible expenses.',
  },
];

const fmt = (n: number) => '$' + Math.round(n || 0).toLocaleString('en-US');

export const TaxRevenueView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player } = useGame();
  const tax = empireState.taxState;
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRetainAccountant = (acc: typeof ACCOUNTANT_TIERS[0]) => {
    setErrorMsg(null);
    setNotification(null);
    if (acc.tier === tax.accountantTier) return;

    if (player.money < acc.cost) {
      setErrorMsg(`Insufficient funds ($${acc.cost.toLocaleString()} required).`);
      return;
    }

    player.money -= acc.cost;

    const updated: EmpireFullState = {
      ...empireState,
      taxState: {
        ...tax,
        accountantTier: acc.tier,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`💼 RETAINED ACCOUNTANT: ${acc.tier}. Tax deduction efficiency increased!`);
  };

  const handleFireAccountant = () => {
    setErrorMsg(null);
    setNotification(null);
    const updated: EmpireFullState = {
      ...empireState,
      taxState: {
        ...tax,
        accountantTier: 'None',
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification('🗑️ Fired Accountant. Reverted to standard IRS filing.');
  };

  const ytdIncome = tax.ytdTaxableIncome || 0;
  const ytdWithheld = tax.ytdWithheld || 0;
  const effectiveRate = ytdIncome > 0 ? ((ytdWithheld / ytdIncome) * 100).toFixed(1) : '0.0';
  const isCorp = !!(empireState.holdingCompany && empireState.holdingCompany.isFormed);
  const hasFiling = tax.lastFilingYear !== undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Tax & Revenue</h2>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}

      {/* REAL YEAR-TO-DATE SUMMARY */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <Receipt className="w-5 h-5 text-amber-400" /> Real Year-To-Date (Week {player.dateWeek}, {player.dateYear})
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">YTD Taxable Income</span>
            <span className="font-black text-white text-sm">{fmt(ytdIncome)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">YTD Tax Withheld</span>
            <span className="font-black text-red-400 text-sm">{fmt(ytdWithheld)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Effective Rate</span>
            <span className="font-black text-amber-300 text-sm">{effectiveRate}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Deductions Claimed</span>
            <span className="font-black text-emerald-400 text-sm">{fmt(tax.ytdDeductions)}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Withholding is taken from your real weekly income (salary, royalties, endorsements, business, property,
          fan club, merch) at progressive rates: 10% under $100K · 22% to $1M · 35% to $10M · 37% above.
          {isCorp ? (
            <span className="text-emerald-400 font-bold"> Your Holding Company is formed — business income is taxed at the 21% corporate rate.</span>
          ) : (
            <span> Form a Holding Company (Empire) to switch business income to the 21% corporate rate.</span>
          )}
        </p>
      </div>

      {/* FILING STATUS */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" /> Year-End Filing (Week 52)
        </h4>
        {!hasFiling ? (
          <p className="text-xs text-gray-400">
            No filing yet. At Week 52 your year is settled automatically: over-withholding comes back as a
            <span className="text-emerald-400 font-bold"> REFUND</span>, under-withholding is paid as a
            <span className="text-rose-400 font-bold"> BALANCE DUE</span>. You'll get an IRS inbox letter either way.
          </p>
        ) : (
          <div className={`p-4 rounded-2xl border ${tax.lastFilingResult === 'REFUND' ? 'border-emerald-500/40 bg-emerald-500/10' : tax.lastFilingResult === 'BALANCE_DUE' ? 'border-rose-500/40 bg-rose-500/10' : 'border-white/10 bg-black/50'}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs font-black text-white flex items-center gap-1.5">
                  {tax.lastFilingResult === 'REFUND' ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {tax.lastFilingYear} FILING: REFUND RECEIVED</>
                  ) : tax.lastFilingResult === 'BALANCE_DUE' ? (
                    <><AlertOctagon className="w-4 h-4 text-rose-400" /> {tax.lastFilingYear} FILING: BALANCE DUE PAID</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 text-sky-400" /> {tax.lastFilingYear} FILING: BROKE EVEN</>
                  )}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {tax.lastFilingResult === 'REFUND'
                    ? `You over-withheld $${(tax.lastFilingAmount || 0).toLocaleString()} — refunded to your account.`
                    : tax.lastFilingResult === 'BALANCE_DUE'
                      ? `You owed $${(tax.lastFilingAmount || 0).toLocaleString()} at filing — paid from your cash.`
                      : 'Exactly what was withheld was owed. No refund, no balance.'}
                </p>
              </div>
              <span className={`text-sm font-black ${tax.lastFilingResult === 'REFUND' ? 'text-emerald-400' : tax.lastFilingResult === 'BALANCE_DUE' ? 'text-rose-400' : 'text-sky-300'}`}>
                {tax.lastFilingResult === 'REFUND' ? '+' : tax.lastFilingResult === 'BALANCE_DUE' ? '−' : '±'}${(tax.lastFilingAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* REAL DEDUCTIONS BREAKDOWN */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-emerald-400" /> Real Deductions (eligible expenses × accountant %)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Charity Donations</span>
            <span className="font-black text-white text-sm">{fmt(tax.ytdCharityDonations)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Studio Expenses</span>
            <span className="font-black text-white text-sm">{fmt(tax.ytdStudioExpenses)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Business Losses</span>
            <span className="font-black text-white text-sm">{fmt(tax.ytdBusinessLosses)}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">PR + Legal Retainers</span>
            <span className="font-black text-white text-sm">{fmt(tax.ytdRetainers)}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500">
          Only a portion of eligible expenses is deductible, set by your accountant tier: 0% (none) · 15% (CPA) · 35% (Boutique) · 60% (Elite).
        </p>
      </div>

      {/* ACCOUNTANT RETAINERS */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-4">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" /> Accountancy Retainers
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACCOUNTANT_TIERS.map((acc) => {
            const isCurrent = tax.accountantTier === acc.tier;
            return (
              <div
                key={acc.tier}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg'
                    : 'border-white/10 bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-black text-white">{acc.tier}</h5>
                  <span className="text-xs font-black text-emerald-400">-{acc.savingsPercent}% Tax Saved</span>
                </div>
                <p className="text-[10px] text-gray-400 mb-3">{acc.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-300 font-bold">
                    {acc.cost === 0 ? 'Free' : `$${acc.cost.toLocaleString()}/yr`}
                  </span>
                  {!isCurrent ? (
                    <button
                      onClick={() => handleRetainAccountant(acc)}
                      className="px-3 py-1 rounded-xl bg-amber-400 text-black font-black text-[10px] hover:bg-amber-300 cursor-pointer"
                    >
                      Retain Counsel
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400">Current Retainer</span>
                      {acc.tier !== 'None' && (
                        <button
                          onClick={handleFireAccountant}
                          className="px-2.5 py-1 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-[10px] cursor-pointer"
                        >
                          FIRE
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUDIT STATUS — only ever triggered by a real underpaid filing */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <Scale className="w-5 h-5 text-red-400" /> IRS Audit Status
        </h4>
        {tax.auditPending ? (
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-bold flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            AUDIT IN PROGRESS — triggered by your underpaid {tax.lastFilingYear} filing. A retained law firm
            (Representation → Law Firm) gives you a much better chance of clearing it. Resolves within a few weeks.
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            No audit pending. Audits only happen if you underpay at year-end filing (balance due) — never randomly.
          </p>
        )}

        <h5 className="text-[11px] font-black text-gray-300 uppercase tracking-wider flex items-center gap-1.5 pt-1">
          <History className="w-3.5 h-3.5" /> Audit History
        </h5>
        {tax.auditHistory.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-2">No IRS audits conducted yet.</p>
        ) : (
          <div className="space-y-2">
            {tax.auditHistory.map((record, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-black/60 border border-white/10 text-xs">
                <span className="font-bold text-gray-300">Week {record.week}, {record.year}:</span>{' '}
                <span className={record.passed ? 'text-emerald-400' : 'text-red-400'}>{record.note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WEEKLY WITHHOLDING HISTORY */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" /> Weekly Withholding History
        </h4>
        {(tax.weeklyWithheldHistory || []).length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-2">
            No withholding yet this year — it starts as soon as you earn real income.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {(tax.weeklyWithheldHistory || []).slice(0, 26).map((h, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] bg-black/40 rounded-lg px-3 py-1.5 border border-white/5">
                <span className="text-gray-400 font-semibold">Week {h.week}, {h.year}</span>
                <span className="text-gray-300">Income: <span className="text-white font-bold">{fmt(h.income)}</span></span>
                <span className="text-red-400 font-bold">-{fmt(h.withheld)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
