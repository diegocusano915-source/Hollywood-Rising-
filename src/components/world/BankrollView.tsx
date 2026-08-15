/**
 * HOLLYWOOD RISING - Bankroll View (World Ecosystem)
 * Film & Series Investment Engine managed by Personal Manager.
 * Requires a Personal Manager to discover opportunities.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BankrollOpportunity } from '../../types/world';
import { INITIAL_BANKROLL_OPPORTUNITIES } from '../../database/worldDatabase';
import {
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Clock,
  Film,
  Tv,
  Video,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Lock,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface BankrollViewProps {
  onBack: () => void;
}

export const BankrollView: React.FC<BankrollViewProps> = ({ onBack }) => {
  const { player, settings, persistNow } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [opportunities, setOpportunities] = useState<BankrollOpportunity[]>(INITIAL_BANKROLL_OPPORTUNITIES);
  const [feedback, setFeedback] = useState<string | null>(null);

  const hasManager = !!player.representation?.manager?.signed;

  const handleInvest = (oppId: string) => {
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp) return;

    if (player.money < opp.budget) {
      setFeedback(`Insufficient funds! Need $${opp.budget.toLocaleString()} to bankroll this project.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id === oppId) {
          return {
            ...o,
            isInvested: true,
            investedAmount: o.budget,
          };
        }
        return o;
      })
    );

    player.money -= opp.budget;
    persistNow();
    setFeedback(`SUCCESSFULLY BANKROLLED "${opp.title}" for $${opp.budget.toLocaleString()}! Production underway.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-24 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-amber-400" />
          Manager Film Financing Vault
        </span>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">BANKROLL & PRODUCTION FUNDING</h1>
            <p className="text-xs text-amber-300 font-medium">
              Co-finance high-yield indie movies, streaming originals & blockbuster releases sourced by your Personal Manager.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* MANAGER CHECK */}
      {!hasManager ? (
        <div className="p-10 rounded-3xl border border-amber-500/30 bg-black/50 text-center space-y-4 shadow-2xl backdrop-blur-md max-w-xl mx-auto my-6">
          <div className="p-4 rounded-full bg-amber-500/20 border border-amber-500/40 w-16 h-16 mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">No Investment Opportunities</h2>
            <p className="text-sm font-bold text-amber-300">
              Hire a Manager to discover opportunities.
            </p>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Film co-financing and production bankrolling packages are sourced exclusively through top personal management firms.
            </p>
          </div>
        </div>
      ) : (
        /* Opportunities List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className={`p-5 rounded-3xl border ${
                opp.isInvested
                  ? 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-500/10'
                  : 'border-white/10 bg-black/40 hover:bg-black/70'
              } backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {opp.type}
                  </span>

                  <span
                    className={`text-[9px] font-black px-2.5 py-1 rounded-lg border ${
                      opp.risk === 'Low'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : opp.risk === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {opp.risk.toUpperCase()} RISK
                  </span>
                </div>

                <h2 className="text-lg font-black text-white">{opp.title}</h2>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px]">
                  <div>
                    <span className="text-gray-400 block font-bold">Investment</span>
                    <span className="font-black text-emerald-400">${opp.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold">Duration</span>
                    <span className="font-black text-amber-300">{opp.weeksRemaining} Wks</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold">Exp. Return</span>
                    <span className="font-black text-sky-300">+{opp.expectedReturnPct}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold">Progress</span>
                    <span className="font-black text-purple-300">{opp.productionProgress}%</span>
                  </div>
                </div>
              </div>

              {opp.isInvested ? (
                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl font-black text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  BANKROLLED & PRODUCING (${opp.budget.toLocaleString()})
                </button>
              ) : (
                <button
                  onClick={() => handleInvest(opp.id)}
                  className="w-full py-3.5 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Fund Project (${opp.budget.toLocaleString()})
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
