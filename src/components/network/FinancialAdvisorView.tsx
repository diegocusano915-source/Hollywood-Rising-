/**
 * HOLLYWOOD RISING - Financial Advisor View (Phase 4 Network)
 * 4 Tiers of Wealth Management, Tax Optimization, Retainers, Interest Discounts & Weekly Reports.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, FinancialAdvisor } from '../../types/network';
import { FINANCIAL_ADVISORS, NetworkService } from '../../services/networkService';
import {
  TrendingUp,
  ArrowLeft,
  DollarSign,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface FinancialAdvisorViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

export const FinancialAdvisorView: React.FC<FinancialAdvisorViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [feedback, setFeedback] = useState<string | null>(null);

  const hiredAdvisorId = networkState.hiredAdvisorId;
  const reports = networkState.advisorReports || [];

  const handleHireAdvisor = (advisor: FinancialAdvisor) => {
    const nextState: NetworkFullState = {
      ...networkState,
      hiredAdvisorId: advisor.id,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`HIRED ${advisor.name} (${advisor.firm}) as your Financial Advisor! Retainer: $${advisor.weeklyRetainer}/wk.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleTerminateAdvisor = () => {
    const nextState: NetworkFullState = {
      ...networkState,
      hiredAdvisorId: null,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback('Terminated Financial Advisor retainer.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const currentAdvisor = FINANCIAL_ADVISORS.find((a) => a.id === hiredAdvisorId);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Beverly Hills Wealth Management
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                WEALTH & TAX OPTIMIZATION
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">FINANCIAL ADVISOR</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Advisor Retained</span>
            <span className="text-lg font-black text-amber-400">
              {currentAdvisor ? currentAdvisor.name : 'None Retained'}
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* ACTIVE ADVISOR CARD */}
      {currentAdvisor && (
        <div className="p-5 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/20 via-black to-black space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentAdvisor.avatar}</span>
              <div>
                <h3 className="text-base font-black text-white">{currentAdvisor.name}</h3>
                <span className="text-xs text-emerald-300 font-bold">{currentAdvisor.firm} ({currentAdvisor.tier} Tier)</span>
              </div>
            </div>

            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
              ${currentAdvisor.weeklyRetainer.toLocaleString()}/wk
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-extrabold bg-black/60 p-3 rounded-2xl border border-white/10">
            <div className="text-emerald-400 font-black">-{currentAdvisor.taxReductionPct}% Tax Expense Cut</div>
            <div className="text-amber-300 font-black">-{currentAdvisor.loanDiscountPct}% Loan Rate Discount</div>
          </div>

          <button
            onClick={handleTerminateAdvisor}
            className="w-full py-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-black transition-all cursor-pointer"
          >
            TERMINATE ADVISOR RETAINER
          </button>
        </div>
      )}

      {/* ADVISOR TIERS CATALOG */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Select Wealth Management Firm
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FINANCIAL_ADVISORS.map((adv) => {
            const isHired = hiredAdvisorId === adv.id;

            return (
              <div
                key={adv.id}
                className="p-5 rounded-3xl border border-white/10 bg-black/50 hover:bg-black/70 transition-all space-y-3 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{adv.avatar}</span>
                      <div>
                        <h3 className="text-sm font-black text-white">{adv.name}</h3>
                        <span className="text-xs text-gray-400 font-medium">{adv.firm}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      ${adv.weeklyRetainer.toLocaleString()}/wk
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{adv.description}</p>

                  <div className="flex justify-between text-[10px] font-extrabold text-gray-300 bg-black/60 p-2 rounded-xl border border-white/5">
                    <span className="text-emerald-400">Tax Cut: -{adv.taxReductionPct}%</span>
                    <span className="text-amber-300">Loan Discount: -{adv.loanDiscountPct}%</span>
                  </div>
                </div>

                <button
                  disabled={isHired}
                  onClick={() => handleHireAdvisor(adv)}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-lg mt-2 ${
                    isHired
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : 'bg-emerald-400 text-black hover:scale-102'
                  }`}
                >
                  {isHired ? 'RETAINED FIRM' : 'RETAIN FINANCIAL ADVISOR'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* WEEKLY REPORTS LOG */}
      {reports.length > 0 && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-3 shadow-xl">
          <h2 className="text-xs font-black text-amber-400 uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Weekly Advisor Intelligence Reports
          </h2>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {reports.map((rep, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-black/60 border border-white/5 space-y-1 text-xs">
                <span className="font-black text-white block">{rep.summary}</span>
                <p className="text-[11px] text-gray-300">{rep.recommendations[0]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
