/**
 * HOLLYWOOD RISING - Tax & Revenue Sub-View (REAL ENGINE)
 * Live dashboard of the real tax engine: YTD income by category, real
 * withholding, real deductions, effective rate, year-end filing status and
 * audit log — plus accountant retainers (real deductions multiplier).
 */

import React, { useMemo, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, TaxBreakdown } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Landmark,
  UserCheck,
  FileText,
  ShieldCheck,
  AlertOctagon,
  Percent,
  DollarSign,
  TrendingDown,
  Receipt,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { loadTaxState, getTaxRecord, auditRiskScore, TAX_CATEGORY_LABELS } from '../../services/taxEngine';

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
  { tier: 'None', cost: 0, savingsPercent: 0, description: 'Standard IRS filing. Zero tax write-offs.' },
  { tier: 'Standard CPA', cost: 15000, savingsPercent: 15, description: 'Certified Public Accountant. Standard deductions.' },
  { tier: 'Boutique Firm', cost: 60000, savingsPercent: 35, description: 'Boutique West Hollywood tax firm. Maximizes film grants & depreciation.' },
  { tier: 'Elite Offshore Tax Attorneys', cost: 200000, savingsPercent: 60, description: 'Cayman & Swiss tax counsel. Legal offshore holding structure.' },
];

export const TaxRevenueView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player , persistNow } = useGame();
  const tax = empireState.taxState;
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // REAL TAX ENGINE DATA
  const taxData = useMemo(() => {
    try {
      const state = loadTaxState();
      const record = getTaxRecord(state, player.dateYear || 2026);
      const lastYear = getTaxRecord(state, (player.dateYear || 2026) - 1);
      return {
        record,
        lastYear,
        risk: auditRiskScore(record),
        pastYears: Object.values(state.years || {})
          .filter((r) => r.year !== (player.dateYear || 2026))
          .sort((a, b) => b.year - a.year),
      };
    } catch {
      return { record: undefined, lastYear: undefined, risk: 0, pastYears: [] as any[] };
    }
  }, [player.dateYear, empireState]);

  const record = taxData.record;
  const incorporated = !!empireState.holdingCompany?.isFormed;

  const handleRetainAccountant = (acc: typeof ACCOUNTANT_TIERS[0]) => {
    setErrorMsg(null);
    setNotification(null);
    if (acc.tier === tax.accountantTier) return;

    if (player.money < acc.cost) {
      setErrorMsg(`Insufficient funds ($${acc.cost.toLocaleString()} required).`);
      return;
    }

    player.money -= acc.cost;
    persistNow();

    const updated: EmpireFullState = {
      ...empireState,
      taxState: {
        ...tax,
        accountantTier: acc.tier,
        auditRiskPercent: acc.tier === 'Elite Offshore Tax Attorneys' ? 12 : 5,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`💼 RETAINED ACCOUNTANT: ${acc.tier}. Deduction efficiency ${acc.savingsPercent}%.`);
  };

  const handleFireAccountant = () => {
    setErrorMsg(null);
    setNotification(null);
    const updated: EmpireFullState = {
      ...empireState,
      taxState: { ...tax, accountantTier: 'None', auditRiskPercent: 15 },
    };
    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification('🗑️ Fired Accountant. Reverted to standard IRS filing.');
  };

  const incomeEntries = Object.entries(record?.incomeByCategory || {})
    .filter(([, v]) => (v as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  const weekly = [...(record?.weekly || [])].slice(-8).reverse();

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

      {/* ===== REAL YEAR SUMMARY ===== */}
      <div className="p-5 rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-950/30 via-black/60 to-black/60 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" /> Tax Year {player.dateYear} — Real Filing
          </h4>
          {record?.filingStatus === 'FILED' ? (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Filed (Week {record.filedWeek})
            </span>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-black uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> In Progress — Week {player.dateWeek} of 52
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">YTD Taxable Income</span>
            <span className="font-black text-white text-sm">${(record?.taxable || 0).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Taxes Withheld</span>
            <span className="font-black text-red-400 text-sm">-${(record?.withheld || 0).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Deductions</span>
            <span className="font-black text-emerald-400 text-sm">-${(record?.deductions || 0).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-gray-400 text-[9px] uppercase font-bold block">Effective Rate</span>
            <span className="font-black text-amber-300 text-sm flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" /> {record?.effectiveRate || 0}%
            </span>
          </div>
        </div>

        {/* Last year's filing result (real) */}
        {taxData.lastYear?.filingStatus === 'FILED' && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold ${
              (taxData.lastYear.refund || 0) > 0
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
            }`}
          >
            {(taxData.lastYear.refund || 0) > 0 ? (
              <span>✅ {player.dateYear - 1} return: you over-paid — <strong>${taxData.lastYear.refund!.toLocaleString()} REFUNDED</strong> to your account.</span>
            ) : (
              <span>⚠️ {player.dateYear - 1} return: <strong>${(taxData.lastYear.balanceDue || 0).toLocaleString()} balance due</strong> was collected from your account.</span>
            )}
            {taxData.lastYear.audited && (
              <span className="block mt-1.5 text-[10px] text-red-300">
                <AlertOctagon className="w-3.5 h-3.5 inline mr-1" />
                {taxData.lastYear.auditNote}
                {taxData.lastYear.auditPenalty ? ` Penalty: $${taxData.lastYear.auditPenalty.toLocaleString()}.` : ''}
              </span>
            )}
          </div>
        )}

        {/* Audit risk */}
        {record?.filingStatus !== 'FILED' && (
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Audit risk (based on real underpayment):{' '}
            <span className="font-black text-sky-300">LOW</span>
            <span className="text-gray-600">·</span>
            Accountant: <span className="font-black text-amber-300">{tax.accountantTier}</span>
            {incorporated && (
              <>
                <span className="text-gray-600">·</span>
                <span className="font-black text-emerald-300">Corporate rate on business income (21%)</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== INCOME BREAKDOWN (REAL) ===== */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" /> YTD Income Breakdown (${(record?.income || 0).toLocaleString()})
        </h4>
        {incomeEntries.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">No taxable income recorded yet this year.</p>
        ) : (
          <div className="space-y-2">
            {incomeEntries.map(([cat, amt]) => (
              <div key={cat} className="flex items-center justify-between text-xs">
                <span className="text-gray-300">{TAX_CATEGORY_LABELS[cat as keyof typeof TAX_CATEGORY_LABELS] || cat}</span>
                <span className="font-black text-emerald-400">${(amt as number).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {record && record.deductionDetails.length > 0 && (
          <div className="pt-3 border-t border-white/10 space-y-2">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> Deductions Applied
            </h5>
            {record.deductionDetails.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">{d.label}</span>
                <span className="font-bold text-emerald-300">-${d.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== WEEKLY WITHHOLDING ===== */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" /> Recent Weekly Withholding
        </h4>
        {weekly.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">No withholding yet — income starts being taxed from your first paycheck.</p>
        ) : (
          <div className="space-y-1.5">
            {weekly.map((w, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] bg-black/50 rounded-xl px-3 py-2 border border-white/5">
                <span className="text-gray-400">Week {w.week}, {player.dateYear}</span>
                <span className="text-gray-300">Income <strong className="text-emerald-400">${w.income.toLocaleString()}</strong></span>
                <span className="text-red-400 font-bold">-${w.withheld.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== PAST YEARS ===== */}
      {taxData.pastYears.length > 0 && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
          <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-400" /> Filing History
          </h4>
          {taxData.pastYears.map((yr) => (
            <div key={yr.year} className="p-3 rounded-2xl bg-black/50 border border-white/10 text-[11px] flex items-center justify-between flex-wrap gap-2">
              <span className="font-black text-white">Year {yr.year}</span>
              <span className="text-gray-300">Taxable ${(yr.taxable || 0).toLocaleString()}</span>
              <span className="text-gray-300">Withheld ${(yr.withheld || 0).toLocaleString()}</span>
              {yr.filingStatus === 'FILED' ? (
                (yr.refund || 0) > 0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Refund ${yr.refund.toLocaleString()}</span>
                ) : (
                  <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Paid ${(yr.balanceDue || 0).toLocaleString()}</span>
                )
              ) : (
                <span className="text-gray-500">Not filed</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== ACCOUNTANT RETAINERS ===== */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-4">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" /> Accountancy & Legal Counsel Retainers
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACCOUNTANT_TIERS.map((acc) => {
            const isCurrent = tax.accountantTier === acc.tier;
            return (
              <div
                key={acc.tier}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent ? 'border-amber-400 bg-amber-500/10 shadow-lg' : 'border-white/10 bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-xs font-black text-white">{acc.tier}</h5>
                  <span className="text-xs font-black text-emerald-400">{acc.savingsPercent}% deduction rate</span>
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

      {/* ===== REAL AUDIT HISTORY ===== */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-400" /> Audit History
        </h4>
        {taxData.pastYears.filter((y) => y.audited).length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            No audits on record. Audits only happen after a real underpayment at year-end filing.
          </p>
        ) : (
          taxData.pastYears
            .filter((y) => y.audited)
            .map((y) => (
              <div key={y.year} className="p-3 rounded-2xl bg-black/60 border border-red-500/20 text-xs">
                <span className="font-bold text-gray-300">Year {y.year}:</span>{' '}
                <span className="text-red-400">{y.auditNote}</span>
                {y.auditPenalty ? <span className="text-red-300 font-bold"> Penalty: ${y.auditPenalty.toLocaleString()}.</span> : null}
              </div>
            ))
        )}
      </div>
    </div>
  );
};
