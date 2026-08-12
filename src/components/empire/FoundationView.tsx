/**
 * HOLLYWOOD RISING - Foundation & Philanthropy Sub-View
 * Phase 5 Empire Scene: Non-profit charity foundation, grants, galas & tax write-offs.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, FoundationCauseOption } from '../../types/empire';
import { EmpireService, FOUNDATION_CAUSES_CATALOG } from '../../services/empireService';
import { Heart, Sparkles, DollarSign, Award, Gift, CheckCircle } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

export const FoundationView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player , persistNow } = useGame();
  const foundation = empireState.foundation;

  const establishmentCost = 100000;

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
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert('❤️ FOUNDATION CHARTERED: Non-Profit Philanthropic Foundation successfully chartered!');
  };

  const handleDonateToCause = (cause: FoundationCauseOption) => {
    const donationAmount = 100000;
    if (player.money < donationAmount) {
      alert(`Insufficient funds for $100,000 grant donation.`);
      return;
    }

    player.money -= donationAmount;
    persistNow();

    const updated: EmpireFullState = {
      ...empireState,
      foundation: {
        ...foundation,
        totalDonated: foundation.totalDonated + donationAmount,
        endowmentPool: foundation.endowmentPool + donationAmount,
        goodwillScore: Math.min(100, foundation.goodwillScore + cause.goodwillBoost),
        taxDeductionsClaimed: foundation.taxDeductionsClaimed + Math.floor(donationAmount * 0.4),
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🎁 GRANT AWARDED: Granted $100,000 to ${cause.name}! Reputation and goodwill increased.`);
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
            <Heart className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Foundation & Philanthropy</h2>
          </div>
        </div>
      </div>

      {!foundation.isEstablished ? (
        <div className="p-6 rounded-3xl border border-rose-500/40 bg-black/60 backdrop-blur-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400/50 flex items-center justify-center mx-auto shadow-xl">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-black text-white">CHARTER NON-PROFIT FOUNDATION</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Donate grants to film preservation, medical research, and education. Generate massive public goodwill, award nominations & corporate tax write-offs.
            </p>
          </div>

          <button
            onClick={handleEstablishFoundation}
            className="px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>CHARTER FOUNDATION ($100,000)</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Foundation Overview */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Total Donated</span>
              <span className="font-black text-emerald-400 text-sm">
                ${foundation.totalDonated.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Goodwill Score</span>
              <span className="font-black text-rose-300 text-sm">{foundation.goodwillScore}/100</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Endowment Pool</span>
              <span className="font-black text-amber-300 text-sm">
                ${foundation.endowmentPool.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Tax Deductions Claimed</span>
              <span className="font-black text-purple-300 text-sm">
                ${foundation.taxDeductionsClaimed.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Causes Directory */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
            <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-400" /> Philanthropic Grant Initiatives
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FOUNDATION_CAUSES_CATALOG.map((cause, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-2">
                  <span className="text-[9px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {cause.category}
                  </span>
                  <h5 className="text-xs font-bold text-white">{cause.name}</h5>
                  <p className="text-[10px] text-gray-400">{cause.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-emerald-400 font-bold">
                      +{cause.goodwillBoost} Goodwill Pts
                    </span>
                    <button
                      onClick={() => handleDonateToCause(cause)}
                      className="px-3 py-1 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-[10px] transition-all cursor-pointer"
                    >
                      Grant $100,000
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
