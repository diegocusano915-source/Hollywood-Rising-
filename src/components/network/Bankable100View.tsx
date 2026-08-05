/**
 * HOLLYWOOD RISING - Bankable 100 View (Phase 4 Network)
 * Hollywood's 100 Most Profitable & Reliable Stars Ranking used by Studio Execs & Directors.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { GENERATE_BANKABLE_100 } from '../../services/networkService';
import {
  Award,
  ArrowLeft,
  Star,
  Film,
  TrendingUp,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface Bankable100ViewProps {
  onBack: () => void;
}

export const Bankable100View: React.FC<Bankable100ViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const bankableList = GENERATE_BANKABLE_100(player);
  const playerStar = bankableList.find((s) => s.isPlayer) || bankableList[bankableList.length - 1];

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
            <Award className="w-4 h-4 text-amber-400" />
            Studio Executive Industry Ranking
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
              <Award className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                BOX OFFICE RELIABILITY INDEX
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">THE BANKABLE 100</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Your Ranking</span>
            <span className="text-lg font-black text-amber-400">#{playerStar.rank} IN HOLLYWOOD</span>
          </div>
        </div>
      </div>

      {/* PLAYER STATS CARD */}
      <div className="p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-black to-black space-y-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase">YOUR BANKABLE PROFILE</span>
            <h2 className="text-lg font-black text-white">{playerStar.name}</h2>
          </div>
          <span className="text-2xl font-black text-amber-300">#{playerStar.rank}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-extrabold bg-black/60 p-3 rounded-2xl border border-white/10">
          <div>
            <span className="text-gray-400 text-[10px] block">Star Rating</span>
            <span className="text-amber-300 font-black">{playerStar.starRating}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">Box Office Gross</span>
            <span className="text-emerald-400 font-black">{playerStar.avgBoxOfficeGross}</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block">Quote Per Film</span>
            <span className="text-sky-300 font-black">{playerStar.quotePerFilm}</span>
          </div>
        </div>
      </div>

      {/* BANKABLE 100 LIST */}
      <div className="space-y-2">
        <h2 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          Top 100 Most Bankable Actors
        </h2>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {bankableList.map((star) => (
            <div
              key={star.rank}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                star.isPlayer
                  ? 'border-amber-400 bg-amber-500/20 shadow-lg'
                  : 'border-white/10 bg-black/50 hover:bg-black/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs shrink-0 ${
                    star.rank <= 3
                      ? 'bg-amber-400 text-black'
                      : star.isPlayer
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  #{star.rank}
                </span>

                <div>
                  <h3 className="font-black text-white flex items-center gap-1">
                    {star.name}
                    {star.isPlayer && (
                      <span className="text-[9px] bg-amber-400 text-black font-black px-1.5 rounded">YOU</span>
                    )}
                  </h3>
                  <span className="text-[10px] text-gray-400">
                    {star.primaryGenre} • Quote: {star.quotePerFilm}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-amber-300 font-black block">{star.starRating}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{star.avgBoxOfficeGross}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
