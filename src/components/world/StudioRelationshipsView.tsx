/**
 * HOLLYWOOD RISING - Studio Ecosystem & Acquisition View (Phase 5)
 * Comprehensive Studio Ecosystem:
 * - Major & NPC Studio Rankings & Market Share
 * - Executive Relationships & First-Look Deals
 * - Studio Valuation, IPO Status & Cash Reserves
 * - Studio Acquisitions (Player buyout of NPC studios)
 */

import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { LivingWorldService, StudioInfo } from '../../services/livingWorldService';
import { Building2, ArrowLeft, CheckCircle2, DollarSign, TrendingUp, TrendingDown, Minus, Sparkles, ShoppingCart, Award } from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface StudioRelationshipsViewProps {
  onBack: () => void;
}

export const StudioRelationshipsView: React.FC<StudioRelationshipsViewProps> = ({ onBack }) => {
  const { player, updateSave, saveData, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [worldState, setWorldState] = useState(() => LivingWorldService.getState());
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  // Living market: re-read every game week - shares, valuations and your
  // relationships with each studio all move in the weekly tick.
  useEffect(() => {
    setWorldState({ ...LivingWorldService.getState() });
  }, [player.dateWeek, player.dateYear]);

  const rankedStudios = [...worldState.studios].sort((a, b) => (b.marketSharePct || 0) - (a.marketSharePct || 0));

  const handleBuyStudio = (studio: StudioInfo) => {
    const res = LivingWorldService.buyStudio(studio.id, player.money);
    setPurchaseMessage(res.message);

    if (res.success && res.cost) {
      updateSave({
        ...saveData,
        player: {
          ...player,
          money: player.money - res.cost,
        },
      });
      setWorldState({ ...LivingWorldService.getState() });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-20 space-y-5"
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
          <Building2 className="w-4 h-4 text-amber-400" />
          Hollywood Studio Market Share & Acquisitions
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">HOLLYWOOD STUDIOS & ACQUISITIONS</h1>
              <p className="text-xs text-amber-300 font-medium">
                Track studio market share, corporate IPOs, and purchase independent NPC studios for your media empire.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30 text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Your Empire Cash</span>
            <span className="text-base font-black text-emerald-400">${player.money.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {purchaseMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-bold flex items-center justify-between">
          <span>{purchaseMessage}</span>
          <button
            onClick={() => setPurchaseMessage(null)}
            className="text-xs font-black uppercase text-amber-400 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Studios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankedStudios.map((std, rankIdx) => {
          const buyPrice = std.purchasePrice || Math.round(std.valuation * 0.35);
          const canAfford = player.money >= buyPrice;

          return (
            <div
              key={std.id}
              className={`p-5 rounded-3xl border backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between transition-all ${
                std.isPlayerOwned
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : std.status === 'Public (IPO)'
                  ? 'border-amber-500/30 bg-black/50'
                  : 'border-white/10 bg-black/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center font-black text-amber-400 text-lg uppercase">
                      {std.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{std.name}</h3>
                      <span className="text-[10px] text-gray-400 font-bold block">
                        CEO: {std.headExecutive}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-xl border ${
                      std.isPlayerOwned
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : std.status === 'Public (IPO)'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {std.isPlayerOwned ? 'Player Owned' : std.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/10">
                  <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-400 uppercase font-bold block">Cash Reserves</span>
                    <span className="text-xs font-bold text-emerald-400">${std.cashReserve.toLocaleString()}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-400 uppercase font-bold block">Market Share (#{rankIdx + 1})</span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      {std.marketSharePct}%
                      {(() => {
                        const delta = Math.round(((std.marketSharePct || 0) - (std.prevMarketSharePct ?? (std.marketSharePct || 0))) * 10) / 10;
                        if (delta > 0.05) return <span className="text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{delta.toFixed(1)}</span>;
                        if (delta < -0.05) return <span className="text-red-400 flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{delta.toFixed(1)}</span>;
                        return <span className="text-gray-500 flex items-center gap-0.5"><Minus className="w-3 h-3" />0.0</span>;
                      })()}
                    </span>
                  </div>
                </div>

                {/* Player relationship - moves on real credits, drifts when idle */}
                <div className="space-y-1 pt-1">
                  {(() => {
                    const rel = Math.round(std.relationshipPct ?? 50);
                    const label = rel >= 75 ? 'ALLIED' : rel >= 55 ? 'WARM' : rel >= 35 ? 'NEUTRAL' : 'COLD';
                    const tone = rel >= 75 ? 'bg-emerald-500' : rel >= 55 ? 'bg-lime-500' : rel >= 35 ? 'bg-amber-500' : 'bg-red-500';
                    const toneText = rel >= 75 ? 'text-emerald-300' : rel >= 55 ? 'text-lime-300' : rel >= 35 ? 'text-amber-300' : 'text-red-300';
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase">
                          <span className="text-gray-400">Your Relationship</span>
                          <span className={toneText}>{label} · {rel}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full ${tone}`} style={{ width: `${rel}%` }} />
                        </div>
                        <p className="text-[9px] text-gray-500 italic">{std.relationshipNote || 'No recent work together'}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {std.isPlayerOwned ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Subsidiary Asset</span>
                  </div>
                ) : std.isNpcCreated || std.purchasePrice ? (
                  <button
                    onClick={() => handleBuyStudio(std)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-500/20'
                        : 'bg-gray-800 text-gray-500 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Acquire for ${buyPrice.toLocaleString()}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-400 text-[11px] font-bold text-center">
                    Public Major (Market Cap: ${(std.valuation / 1000000000).toFixed(1)}B)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
