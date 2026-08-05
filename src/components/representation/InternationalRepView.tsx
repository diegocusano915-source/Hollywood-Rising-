/**
 * HOLLYWOOD RISING - International Representation Sub-View
 * Regional agency representation across North America, Europe, Asia, Africa, South America, and Australia.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState } from '../../types/representation';
import { Globe, ArrowLeft, ShieldCheck, Lock, CheckCircle, Sparkles } from 'lucide-react';

interface InternationalRepViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const InternationalRepView: React.FC<InternationalRepViewProps> = ({
  representationState,
  onBack,
}) => {
  const { player } = useGame();
  const agencies = representationState.regionalAgencies;

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
          <Globe className="w-5 h-5 text-teal-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">INTERNATIONAL REPRESENTATION</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agencies.map((agency) => (
          <div
            key={agency.id}
            className={`p-5 rounded-3xl border backdrop-blur-md space-y-3 flex flex-col justify-between ${
              agency.isUnlocked
                ? 'border-teal-500/40 bg-black/60'
                : 'border-white/10 bg-black/30 opacity-75'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-teal-300 uppercase tracking-wider">{agency.regionName}</span>
                {agency.isUnlocked ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>UNLOCKED</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Req. {agency.minFameXpRequired} Fame XP</span>
                  </span>
                )}
              </div>

              <h4 className="text-base font-black text-white">{agency.headquarters}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{agency.perks}</p>

              {agency.signedAgencyName && (
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200 font-bold">
                  Represented by: {agency.signedAgencyName} ({agency.commissionPercent}% Commission)
                </div>
              )}
            </div>

            {!agency.isUnlocked && (
              <p className="text-[10px] text-gray-400 italic">
                Current Fame: {player.fameXp} XP / {agency.minFameXpRequired} XP needed to unlock regional representation.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
