/**
 * HOLLYWOOD RISING - Charity & Public Causes Sub-View
 * Support hospitals, schools, foundations, scholarships, disaster relief, and film education.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { HeartHandshake, ArrowLeft, Plus, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface CharityCausesViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

const CHARITY_CATEGORIES: {
  category: 'Hospitals' | 'Schools' | 'Foundations' | 'Scholarships' | 'Disaster Relief' | 'Film Education' | 'Community Projects';
  title: string;
  desc: string;
  minDonation: number;
}[] = [
  { category: 'Hospitals', title: "Children's Hospital Medical Pavilion", desc: 'Fund pediatric wing equipment and specialized oncology care.', minDonation: 10000 },
  { category: 'Film Education', title: 'Young Filmmakers Conservatory', desc: 'Provide cameras, editing suites, and mentorship for underprivileged youth.', minDonation: 5000 },
  { category: 'Scholarships', title: 'Arts & Acting Diversity Endowment', desc: 'Full four-year university tuition scholarships for aspiring actors.', minDonation: 15000 },
  { category: 'Disaster Relief', title: 'Global Emergency Relief Reserve', desc: 'Immediate medical aid and shelter support for disaster regions.', minDonation: 25000 },
  { category: 'Foundations', title: 'Named Philanthropic Family Foundation', desc: 'Establish your permanent tax-exempt charitable endowment trust.', minDonation: 100000 },
];

export const CharityCausesView: React.FC<CharityCausesViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player } = useGame();
  const charities = representationState.charities;

  const handleMakeDonation = (cause: typeof CHARITY_CATEGORIES[0]) => {
    if (player.money < cause.minDonation) {
      alert(`Insufficient funds! Minimum donation requires $${cause.minDonation.toLocaleString()}.`);
      return;
    }

    player.money -= cause.minDonation;
    const state = RepresentationService.getState();

    let existing = state.charities.find((c) => c.category === cause.category);
    if (!existing) {
      existing = {
        id: `charity_${Date.now()}`,
        name: cause.title,
        category: cause.category,
        description: cause.desc,
        totalDonated: 0,
        isFoundationEstablished: cause.category === 'Foundations',
        foundationName: cause.category === 'Foundations' ? `${player.lastName} Philanthropic Foundation` : undefined,
        reputationBonus: 10,
        trustBonus: 12,
        legacyScoreBonus: 25,
      };
      state.charities.unshift(existing);
    }

    existing.totalDonated += cause.minDonation;
    state.reputation.publicTrust = Math.min(100, state.reputation.publicTrust + 8);
    state.reputation.publicReputation = Math.min(100, state.reputation.publicReputation + 5);

    RepresentationService.saveState(state);
    alert(`🎗 Donated $${cause.minDonation.toLocaleString()} to ${cause.title}! Boosted Public Trust & Reputation.`);
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
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">CHARITY & PUBLIC CAUSES</h2>
        </div>
      </div>

      {/* Available Causes Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Philanthropic Initiatives & Foundations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHARITY_CATEGORIES.map((cause) => {
            const active = charities.find((c) => c.category === cause.category);
            return (
              <div key={cause.category} className="p-5 rounded-3xl border border-emerald-500/30 bg-black/60 backdrop-blur-md space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                      {cause.category}
                    </span>
                    {active && (
                      <span className="text-xs font-black text-emerald-400">
                        Donated: ${active.totalDonated.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-white">{cause.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{cause.desc}</p>
                </div>

                <button
                  onClick={() => handleMakeDonation(cause)}
                  className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  DONATE ${cause.minDonation.toLocaleString()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
