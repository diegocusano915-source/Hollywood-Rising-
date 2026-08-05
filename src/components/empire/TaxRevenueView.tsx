/**
 * HOLLYWOOD RISING - Tax & Revenue Sub-View
 * Phase 5 Empire Scene: Income, Corporate, Property Tax optimization & Accountant firm hiring.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, TaxBreakdown } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Landmark,
  ShieldCheck,
  Percent,
  DollarSign,
  AlertOctagon,
  FileText,
  UserCheck,
  Sparkles,
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
    description: 'Certified Public Accountant. Standard corporate deductions.',
  },
  {
    tier: 'Boutique Firm',
    cost: 60000,
    savingsPercent: 35,
    description: 'Boutique West Hollywood tax firm. Maximizes film grants & depreciation.',
  },
  {
    tier: 'Elite Offshore Tax Attorneys',
    cost: 200000,
    savingsPercent: 60,
    description: 'Cayman & Swiss tax counsel. Legal offshore holding structure.',
  },
];

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
        auditRiskPercent: acc.tier === 'Elite Offshore Tax Attorneys' ? 12 : 5,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`💼 RETAINED ACCOUNTANT: Retained ${acc.tier}. Tax deduction efficiency increased!`);
  };

  const handleFireAccountant = () => {
    setErrorMsg(null);
    setNotification(null);
    const updated: EmpireFullState = {
      ...empireState,
      taxState: {
        ...tax,
        accountantTier: 'None',
        auditRiskPercent: 15,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification('🗑️ Fired Accountant. Reverted to standard IRS filing.');
  };

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

      {/* Tax Summary Grid */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-gray-400 text-[9px] uppercase font-bold block">Income Tax</span>
          <span className="font-black text-red-400 text-sm">${tax.incomeTax.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-gray-400 text-[9px] uppercase font-bold block">Corporate Tax</span>
          <span className="font-black text-red-400 text-sm">${tax.corporateTax.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-gray-400 text-[9px] uppercase font-bold block">Property Tax</span>
          <span className="font-black text-red-400 text-sm">${tax.propertyTax.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-gray-400 text-[9px] uppercase font-bold block">Tax Saved (Deductions)</span>
          <span className="font-black text-emerald-400 text-sm">${tax.taxSaved.toLocaleString()}</span>
        </div>
      </div>

      {/* Accountant & Legal Firm Retainers */}
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

      {/* IRS Audit History */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-400" /> IRS Audit History Log
        </h4>

        {tax.auditHistory.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No IRS audits conducted yet.</p>
        ) : (
          tax.auditHistory.map((record, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-black/60 border border-white/10 text-xs">
              <span className="font-bold text-gray-300">
                Week {record.week}, {record.year}:
              </span>{' '}
              <span className={record.passed ? 'text-emerald-400' : 'text-red-400'}>{record.note}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
