/**
 * HOLLYWOOD RISING - Future Expansion View (Phase 4 Network)
 */

import React from 'react';
import { ArrowLeft, Sparkles, Building2, Crown, Rocket } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { THEMES } from '../../theme/colors';

export const FutureExpansionView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Network</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
          Future Network Expansion
        </span>
      </div>

      <div className="p-8 rounded-3xl border border-white/10 bg-black/50 text-center space-y-4 shadow-2xl">
        <Rocket className="w-12 h-12 text-amber-400 mx-auto" />
        <h1 className="text-xl font-black text-white">NETWORK EMPIRE EXPANSION</h1>
        <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
          Reserved for future Hollywood Network capabilities including Venture Capital Angel Fund, Studio Majority Buyouts, and Global Talent Agency Acquisitions.
        </p>
      </div>
    </div>
  );
};
