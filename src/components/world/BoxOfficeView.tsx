/**
 * HOLLYWOOD RISING - Box Office View (World Ecosystem)
 * Displays Top 50 Movies & Top TV Series, Gross, Viewership, Sequels & Renewals.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BoxOfficeItem } from '../../types/world';
import { INITIAL_BOX_OFFICE } from '../../database/worldDatabase';
import {
  TrendingUp,
  Film,
  Tv,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Eye,
  Award,
  Layers,
  Repeat,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface BoxOfficeViewProps {
  onBack: () => void;
}

export const BoxOfficeView: React.FC<BoxOfficeViewProps> = ({ onBack }) => {
  const { player, releasedMovies, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [filterType, setFilterType] = useState<'ALL' | 'MOVIES' | 'SERIES'>('ALL');

  // Merge player released movies with top box office rankings
  const allItems: BoxOfficeItem[] = [
    ...releasedMovies.map((rm, idx) => ({
      id: `player_bo_${rm.id}`,
      title: rm.movieTitle,
      type: 'Movie' as const,
      grossWorldwide: rm.worldwideGross || 150000000,
      grossDomestic: rm.domesticGross || 60000000,
      grossInternational: (rm.worldwideGross || 150000000) - (rm.domesticGross || 60000000),
      weeksInRelease: rm.weeksInCinemas || 4,
      trend: 'UP' as const,
      studio: 'Player Independent Production',
      genres: ['Drama', 'Blockbuster'],
      posterUrl: rm.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop',
      isPlayerMovie: true,
      sequelPart: 1,
    })),
    ...INITIAL_BOX_OFFICE,
  ];

  const filtered = allItems.filter((i) => {
    if (filterType === 'MOVIES') return i.type === 'Movie';
    if (filterType === 'SERIES') return i.type === 'Series';
    return true;
  });

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-20 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          IMDb Box Office Live Rankings
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
            <Film className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">WORLDWIDE BOX OFFICE & TV RANKINGS</h1>
            <p className="text-xs text-amber-300 font-medium">
              Tracking top 50 theatrical releases, streaming hits, sequels & TV series renewals.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {(['ALL', 'MOVIES', 'SERIES'] as const).map((ft) => (
          <button
            key={ft}
            onClick={() => setFilterType(ft)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === ft
                ? 'bg-amber-400 text-black shadow-lg'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {ft}
          </button>
        ))}
      </div>

      {/* Box Office Items Cards */}
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border ${
              item.isPlayerMovie
                ? 'border-amber-400/80 bg-amber-950/20 shadow-amber-500/10'
                : 'border-white/10 bg-black/40'
            } backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
          >
            {/* Rank Number & Poster */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-amber-400 w-8 text-center shrink-0">
                #{idx + 1}
              </span>

              <div className="w-16 h-20 rounded-xl overflow-hidden border border-white/20 bg-gray-900 shrink-0 relative">
                <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                {item.isPlayerMovie && (
                  <span className="absolute top-1 left-1 bg-amber-500 text-black font-black text-[8px] px-1 py-0.5 rounded shadow">
                    YOUR FILM
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">{item.studio}</span>
                  {item.sequelPart && (
                    <span className="text-[10px] font-extrabold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30">
                      Part {item.sequelPart}
                    </span>
                  )}
                  {item.seriesSeason && (
                    <span className="text-[10px] font-extrabold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                      Season {item.seriesSeason}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-white mt-1">{item.title}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                  <span>Genres: {item.genres.join(', ')}</span>
                  <span>•</span>
                  <span>{item.weeksInRelease} Weeks in Release</span>
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-right w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
              {item.type === 'Movie' ? (
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Worldwide Gross</span>
                  <span className="text-lg font-black text-emerald-400">
                    ${(item.grossWorldwide / 1000000).toFixed(1)} Million
                  </span>
                  <div className="text-[10px] text-gray-500 font-semibold">
                    Dom: ${(item.grossDomestic / 1000000).toFixed(1)}M | Intl: ${(item.grossInternational / 1000000).toFixed(1)}M
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Global Viewership</span>
                  <span className="text-lg font-black text-sky-400">
                    {((item.viewership || 0) / 1000000).toFixed(1)} Million Views
                  </span>
                  <div className="text-[10px] text-purple-300 font-semibold">
                    Renewed for Season {(item.seriesSeason || 1) + 1}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
