/**
 * HOLLYWOOD RISING - Studio Relationships View (World Ecosystem)
 * Relationships with major Hollywood studios & exclusive first-look deals.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { StudioRelationship } from '../../types/world';
import { INITIAL_STUDIO_RELATIONSHIPS } from '../../database/worldDatabase';
import {
  Building2,
  Sparkles,
  ArrowLeft,
  Heart,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface StudioRelationshipsViewProps {
  onBack: () => void;
}

export const StudioRelationshipsView: React.FC<StudioRelationshipsViewProps> = ({ onBack }) => {
  const { settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [studios] = useState<StudioRelationship[]>(INITIAL_STUDIO_RELATIONSHIPS);

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
          Major Studio Executives & Deals
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
            <Building2 className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">STUDIO EXECUTIVE RELATIONSHIPS</h1>
            <p className="text-xs text-amber-300 font-medium">
              Build rapport with Warner Bros, Universal, A24 & Marvel to unlock exclusive first-look deals and lead roles.
            </p>
          </div>
        </div>
      </div>

      {/* Studios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studios.map((std) => (
          <div
            key={std.id}
            className="p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md space-y-3 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={std.logoUrl} alt={std.studioName} className="w-12 h-12 rounded-2xl object-cover border border-amber-400/30 shrink-0" />
                  <div>
                    <h3 className="text-base font-black text-white">{std.studioName}</h3>
                    <span className="text-[10px] text-amber-300 font-bold block">
                      Reputation Points: {std.points}/100
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {std.relationshipLevel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full transition-all" style={{ width: `${std.points}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
