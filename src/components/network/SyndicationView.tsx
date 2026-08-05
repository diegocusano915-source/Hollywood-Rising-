/**
 * HOLLYWOOD RISING - Syndication View (Phase 4 Network)
 * Movies & TV Series Syndication, Cable & Streaming Royalties, Passive Film Revenues.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState } from '../../types/network';
import {
  Tv,
  ArrowLeft,
  DollarSign,
  Film,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Radio,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface SyndicationViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
}

export const SyndicationView: React.FC<SyndicationViewProps> = ({ onBack, networkState }) => {
  const { player, releasedMovies, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const sources = networkState.syndicationSources || [];

  const totalWeeklyRoyalties = sources.reduce((sum, s) => sum + s.weeklyRoyaltyAmount, 0);
  const totalLifetimeRoyalties = sources.reduce((sum, s) => sum + s.totalRoyaltiesEarned, 0);

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
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/30 flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-sky-400" />
            Media Licensing & Syndication
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
            <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/40">
              <Tv className="w-7 h-7 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block">
                ROYALTIES & BROADCAST LICENSING
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">SYNDICATION PORTFOLIO</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Weekly Royalties</span>
            <span className="text-lg font-black text-emerald-400">
              +${totalWeeklyRoyalties.toLocaleString()}/wk
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl border border-sky-500/30 bg-sky-500/10 space-y-1">
          <span className="text-[10px] font-black text-sky-400 uppercase block">Active Licensed Films</span>
          <span className="text-xl font-black text-white">{sources.length} Projects</span>
        </div>

        <div className="p-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <span className="text-[10px] font-black text-emerald-400 uppercase block">Total Lifetime Royalties</span>
          <span className="text-xl font-black text-emerald-300">${totalLifetimeRoyalties.toLocaleString()}</span>
        </div>
      </div>

      {/* SYNDICATED PROJECTS LIST */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Film className="w-4 h-4" />
          Syndicated Film & Series Catalog
        </h2>

        {sources.length === 0 ? (
          <div className="p-6 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
            <Film className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-sm font-black text-white">No Released Projects Yet</h3>
            <p className="text-xs text-gray-400">
              Complete film bookings and release movies to generate recurring weekly broadcast royalties!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">{src.title}</h3>
                    <span className="text-xs text-sky-300 font-bold">{src.syndicationTier}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                    +${src.weeklyRoyaltyAmount.toLocaleString()}/wk
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/60 border border-white/5 flex justify-between text-xs">
                  <span className="text-gray-400">Total Lifetime Earned:</span>
                  <span className="text-white font-black">${src.totalRoyaltiesEarned.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
