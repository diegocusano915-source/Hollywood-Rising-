/**
 * HOLLYWOOD RISING - Global Foundation (REAL PHILANTHROPY ENGINE)
 * The endowment compounds weekly (0.15% real returns recorded by the tick),
 * grants build goodwill, goodwill pays a REAL public-reputation dividend
 * once earned, and every donation banks real tax deductions.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, FoundationCauseOption, FoundationCause } from '../../types/empire';
import { EmpireService, FOUNDATION_CAUSES_CATALOG } from '../../services/empireService';
import { Heart, Gift, Award, FileText, TrendingUp } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const establishmentCost = 100000;
const donationAmount = 100000;

function EndowmentChart({ history }: { history: number[] }) {
  if (!history || history.length < 2) {
    return <div className="h-14 rounded-xl bg-white/5 flex items-center justify-center text-[9px] text-gray-600 font-mono">ENDOWMENT COMPOUNDING…</div>;
  }
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = Math.max(1, max - min);
  const pts = history.map((v, i) => `${(i / (history.length - 1)) * 100},${52 - ((v - min) / range) * 46 - 3}`).join(' ');
  return (
    <svg viewBox="0 0 100 52" preserveAspectRatio="none" className="w-full h-14">
      <defs>
        <linearGradient id="endowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,52 ${pts} 100,52`} fill="url(#endowGrad)" />
      <polyline points={pts} fill="none" stroke="#fb7185" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const fmtK = (n: number) => (Math.abs(n) >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`);

export const FoundationView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player, persistNow } = useGame();
  const foundation = empireState.foundation;
  const history = foundation.endowmentHistory || [];
  const growthThisWeek = history.length >= 2 ? history[history.length - 1] - history[history.length - 2] : 0;

  const handleEstablishFoundation = () => {
    if (player.money < establishmentCost) {
      alert(`Insufficient cash! Establishing foundation requires $${establishmentCost.toLocaleString()}.`);
      return;
    }
    player.money -= establishmentCost;
    persistNow();
    const updated: EmpireFullState = {
      ...empireState,
      foundation: {
        ...foundation,
        isEstablished: true,
        name: `${player.lastName} Global Philanthropic Foundation`,
        endowmentPool: 100000,
        goodwillScore: 50,
        endowmentHistory: [100000],
      },
    };
    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert('❤️ FOUNDATION CHARTERED: Non-Profit Philanthropic Foundation successfully chartered!');
  };

  const handleDonateToCause = (cause: FoundationCauseOption) => {
    if (player.money < donationAmount) {
      alert(`Insufficient funds for $${donationAmount.toLocaleString()} grant donation.`);
      return;
    }
    player.money -= donationAmount;
    persistNow();

    const existing: FoundationCause | undefined = (foundation.causes || []).find((c) => c.name === cause.name);
    const causes: FoundationCause[] = existing
      ? (foundation.causes || []).map((c) =>
          c.name === cause.name
            ? { ...c, totalDonated: c.totalDonated + donationAmount, impactRating: Math.min(100, c.impactRating + 4) }
            : c
        )
      : [
          ...(foundation.causes || []),
          {
            id: `cause_${Date.now()}`,
            name: cause.name,
            category: cause.category,
            totalDonated: donationAmount,
            impactRating: 10,
            publicGoodwillBonus: cause.goodwillBoost,
          },
        ];

    const updated: EmpireFullState = {
      ...empireState,
      foundation: {
        ...foundation,
        endowmentPool: foundation.endowmentPool + donationAmount,
        goodwillScore: Math.min(100, foundation.goodwillScore + cause.goodwillBoost),
        taxDeductionsClaimed: foundation.taxDeductionsClaimed + Math.floor(donationAmount * 0.4),
        causes,
      },
    };
    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🎁 GRANT AWARDED: $${donationAmount.toLocaleString()} to ${cause.name}!\n\n+${cause.goodwillBoost} goodwill \u00b7 +$${Math.floor(donationAmount * 0.4).toLocaleString()} tax deduction banked.`);
  };

  if (!foundation.isEstablished) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer">
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Global Foundation</h2>
          </div>
        </div>
        <div className="max-w-xl mx-auto p-6 rounded-3xl border border-rose-500/30 bg-black/70 text-center space-y-4">
          <Heart className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-black text-white">CHARTER YOUR FOUNDATION</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            A real philanthropy engine: the endowment compounds weekly at 0.15%, grants build goodwill, and
            goodwill at 70+ pays a genuine +1 public reputation every 4 weeks. Donations bank real tax deductions.
          </p>
          <button
            onClick={handleEstablishFoundation}
            className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs cursor-pointer shadow-lg"
          >
            CHARTER FOUNDATION — {fmtK(establishmentCost)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer">
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">{foundation.name}</h2>
          </div>
        </div>
      </div>

      {/* Endowment terminal */}
      <div className="p-5 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-black via-gray-900 to-black space-y-3 shadow-2xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block">Endowment Pool (compounds 0.15%/week)</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white font-mono">{fmtK(foundation.endowmentPool)}</span>
              {growthThisWeek > 0 && (
                <span className="text-xs font-mono font-black text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +{fmtK(growthThisWeek)} this week
                </span>
              )}
            </div>
          </div>
          <div className="text-right text-[10px] font-mono text-gray-400">
            <span className="block">Goodwill: <span className="text-rose-300 font-bold">{foundation.goodwillScore}/100</span></span>
            <span className="block">Tax deductions banked: <span className="text-emerald-300 font-bold">{fmtK(foundation.taxDeductionsClaimed)}</span></span>
            <span className="block">
              {foundation.goodwillScore >= 70
                ? 'REP DIVIDEND ACTIVE (+1 rep / 4 wks)'
                : `Needs ${70 - foundation.goodwillScore} more goodwill for rep dividend`}
            </span>
          </div>
        </div>
        <EndowmentChart history={history} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Total Granted</span>
            <span className="text-sm font-black text-rose-300 font-mono">{fmtK(foundation.totalDonated)}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Active Causes</span>
            <span className="text-sm font-black text-white font-mono">{(foundation.causes || []).length}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Est. Weekly Return</span>
            <span className="text-sm font-black text-emerald-300 font-mono">+{fmtK(Math.floor(foundation.endowmentPool * 0.0015))}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Avg Impact</span>
            <span className="text-sm font-black text-amber-300 font-mono">
              {(foundation.causes || []).length > 0
                ? Math.round((foundation.causes || []).reduce((a, c) => a + c.impactRating, 0) / (foundation.causes || []).length)
                : 0}/100
            </span>
          </div>
        </div>
      </div>

      {/* Grant history (real totals) */}
      {(foundation.causes || []).length > 0 && (
        <div className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-2">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-400" /> Your Grant History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {(foundation.causes || []).map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-[11px] font-black text-white block">{c.name}</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold">{c.category}</span>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-rose-300 font-bold">{fmtK(c.totalDonated)} granted</span>
                  <span className="text-amber-300">impact {c.impactRating}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-400" style={{ width: `${c.impactRating}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant catalog */}
      <div className="p-4 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
          <Gift className="w-4 h-4 text-rose-400" /> Award a Grant ({fmtK(donationAmount)} each)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FOUNDATION_CAUSES_CATALOG.map((cause) => (
            <div key={cause.name} className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-rose-300">{cause.category}</span>
                <h4 className="text-sm font-black text-white">{cause.name}</h4>
                <p className="text-[10px] text-gray-400 leading-snug">{cause.description}</p>
                <div className="flex items-center gap-3 text-[9px] font-mono font-bold pt-1">
                  <span className="text-rose-300">+{cause.goodwillBoost} GOODWILL</span>
                  <span className="text-emerald-300 flex items-center gap-1"><FileText className="w-3 h-3" /> 40% DEDUCTIBLE</span>
                </div>
              </div>
              <button
                onClick={() => handleDonateToCause(cause)}
                className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs cursor-pointer shadow-md"
              >
                AWARD GRANT
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
