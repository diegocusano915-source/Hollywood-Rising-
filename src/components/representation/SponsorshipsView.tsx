/**
 * HOLLYWOOD RISING - Sponsorships Sub-View
 * Handles major long-term corporate sponsorships (Sports, Luxury, Tech, Fashion, Cars, Streaming, Food).
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { Target, ArrowLeft, Check, Award, Sparkles, Clock } from 'lucide-react';

interface SponsorshipsViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const SponsorshipsView: React.FC<SponsorshipsViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player } = useGame();
  const sponsorships = representationState.sponsorships;

  const handleAcceptSponsorship = (sponsId: string) => {
    const state = RepresentationService.getState();
    const item = state.sponsorships.find((s) => s.id === sponsId);
    if (!item) return;

    item.status = 'ACTIVE';
    state.reputation.worldwidePopularity = Math.min(100, state.reputation.worldwidePopularity + 10);

    state.contractsArchive.unshift({
      id: `contract_spons_${item.id}`,
      title: `Major Sponsorship Deal: ${item.sponsorName}`,
      contractType: 'SPONSORSHIP',
      counterparty: item.sponsorName,
      valueText: `$${item.annualValue.toLocaleString()}/year`,
      dateSigned: `Week ${player.dateWeek}, ${player.dateYear}`,
      status: 'ACTIVE',
      details: item.perksDescription,
    });

    RepresentationService.saveState(state);
    alert(`🎯 Signed Major Corporate Sponsorship with ${item.sponsorName}!`);
    onRefresh();
  };

  return (
    <div className="space-y-6 text-white select-none pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Representation</span>
        </button>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">MAJOR SPONSORSHIPS</h2>
        </div>
      </div>

      <div className="space-y-4">
        {sponsorships.length === 0 ? (
          <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
            <Clock className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-base font-black text-white">NO SPONSORSHIP OFFERS YET</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Major corporate sponsors (Nike, Mercedes, Leica, Omega) only extend deals to A-List celebrities with high Fame XP and blockbuster film credits.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsorships.map((spons) => (
              <div
                key={spons.id}
                className={`p-5 rounded-2xl border backdrop-blur-md space-y-3 flex flex-col justify-between ${
                  spons.status === 'ACTIVE'
                    ? 'border-amber-500/50 bg-amber-950/20'
                    : 'border-white/10 bg-black/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                      {spons.category}
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      ${spons.annualValue.toLocaleString()}/yr
                    </span>
                  </div>

                  <h4 className="text-base font-black text-white">{spons.sponsorName}</h4>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    🎁 Perk: {spons.perksDescription}
                  </div>
                </div>

                {spons.status === 'OFFER' ? (
                  <button
                    onClick={() => handleAcceptSponsorship(spons.id)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>SIGN SPONSORSHIP DEAL</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center block">
                    ACTIVE SPONSORSHIP
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
