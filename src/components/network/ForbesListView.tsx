/**
 * HOLLYWOOD RISING - Forbes List View (Phase 4 Network)
 * Top 100 Richest Celebrities in Hollywood & Global Entertainment.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { GENERATE_FORBES_100 } from '../../services/networkService';
import {
  Trophy,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Sparkles,
  Users,
  Award,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface ForbesListViewProps {
  onBack: () => void;
}

export const ForbesListView: React.FC<ForbesListViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const forbesList = GENERATE_FORBES_100(player);
  const playerForbes = forbesList.find((c) => c.isPlayer) || forbesList[forbesList.length - 1];

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
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Forbes Global Wealth Index
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
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                GLOBAL CELEBRITY WEALTH
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">FORBES 100 RICHEST</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Forbes Rank</span>
            <span className="text-lg font-black text-amber-400">#{playerForbes.rank} WORLDWIDE</span>
          </div>
        </div>
      </div>

      {/* FORBES RANKING PROGRESSION TRACKER */}
      <div className="p-4 rounded-3xl border border-amber-500/30 bg-black/60 space-y-2.5">
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
          FORBES MILESTONE RANK PROGRESSION
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center text-[10px] font-black">
          {[
            { label: 'Top 200', target: '200' },
            { label: 'Top 100', target: '100' },
            { label: 'Top 50', target: '50' },
            { label: 'Top 25', target: '25' },
            { label: 'Top 10', target: '10' },
            { label: 'Top 5', target: '5' },
            { label: '#1 World', target: '1' },
          ].map((milestone) => {
            const targetNum = parseInt(milestone.target);
            const isAchieved = playerForbes.rank <= targetNum;
            return (
              <div
                key={milestone.label}
                className={`p-2 rounded-xl border transition-all ${
                  isAchieved
                    ? 'bg-amber-400 text-black border-amber-400 font-black shadow-md scale-102'
                    : 'bg-black/40 text-gray-400 border-white/10'
                }`}
              >
                <div>{milestone.label}</div>
                <div className="text-[9px] opacity-80">{isAchieved ? 'UNLOCKED' : `Rank ≤${milestone.target}`}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PLAYER FORBES CARD */}
      <div className="p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-black to-black space-y-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase">YOUR FORBES WEALTH PROFILE</span>
            <h2 className="text-lg font-black text-white">{playerForbes.name}</h2>
          </div>
          <span className="text-2xl font-black text-amber-300">#{playerForbes.rank}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs font-extrabold bg-black/60 p-3 rounded-2xl border border-white/10">
          <div>
            <span className="text-gray-400 text-[10px] block">Estimated Net Worth</span>
            <span className="text-emerald-400 font-black">${playerForbes.netWorth.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">Top Asset Enterprise</span>
            <span className="text-amber-300 font-black truncate block">{playerForbes.topAsset}</span>
          </div>
        </div>
      </div>

      {/* FORBES 100 CELEBRITIES LIST */}
      <div className="space-y-2">
        <h2 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Top 100 Richest Celebrities
        </h2>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {forbesList.map((celeb) => (
            <div
              key={celeb.rank}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                celeb.isPlayer
                  ? 'border-amber-400 bg-amber-500/20 shadow-lg'
                  : 'border-white/10 bg-black/50 hover:bg-black/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs shrink-0 ${
                    celeb.rank <= 3
                      ? 'bg-amber-400 text-black'
                      : celeb.isPlayer
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  #{celeb.rank}
                </span>

                <div>
                  <h3 className="font-black text-white flex items-center gap-1">
                    {celeb.name}
                    {celeb.isPlayer && (
                      <span className="text-[9px] bg-amber-400 text-black font-black px-1.5 rounded">YOU</span>
                    )}
                  </h3>
                  <span className="text-[10px] text-gray-400">
                    {celeb.category} • Top Asset: {celeb.topAsset}
                  </span>
                </div>
              </div>

              <span className="text-emerald-400 font-black text-sm">
                ${celeb.netWorth >= 1000000000 ? `${(celeb.netWorth / 1000000000).toFixed(1)}B` : `${(celeb.netWorth / 1000000).toFixed(0)}M`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
