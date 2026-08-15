/**
 * HOLLYWOOD RISING - Box Office View (Phase 5)
 * Comprehensive Top 200 Box Office, Release Simulation, Records & Studio Market Share.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { BoxOfficeItem, BoxOfficeRecordItem, StudioPerformance } from '../../types/world';
import { BoxOfficeEngineService } from '../../services/boxOfficeEngineService';
import {
  TrendingUp,
  Film,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Award,
  Search,
  Building2,
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
  BarChart3,
  Flame,
  Star,
  Users,
  Percent,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface BoxOfficeViewProps {
  onBack: () => void;
}

export const BoxOfficeView: React.FC<BoxOfficeViewProps> = ({ onBack }) => {
  const { player, releasedMovies, settings, updatePlayer } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [mainTab, setMainTab] = useState<'CHART' | 'IN_THEATERS' | 'PLAYER_FILMS' | 'RECORDS' | 'STUDIOS'>('CHART');
  const [filterType, setFilterType] = useState<'ALL' | 'MOVIES' | 'SERIES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [boxOfficeState, setBoxOfficeState] = useState(() => BoxOfficeEngineService.getState());

  useEffect(() => {
    // Refresh box office state on mount
    setBoxOfficeState(BoxOfficeEngineService.getState());
  }, [releasedMovies]);

  const items = boxOfficeState.items || [];
  const records = boxOfficeState.records || [];
  const studios = boxOfficeState.studios || [];

  // Filter items based on active tab and filter criteria
  const filteredItems = items.filter((item) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchStudio = item.studio.toLowerCase().includes(q);
      const matchGenre = item.genres.some((g) => g.toLowerCase().includes(q));
      if (!matchTitle && !matchStudio && !matchGenre) return false;
    }

    // Type filter
    if (filterType === 'MOVIES' && item.type !== 'Movie') return false;
    if (filterType === 'SERIES' && item.type !== 'Series') return false;

    // Tab filter
    if (mainTab === 'IN_THEATERS') return item.inTheaters && item.type === 'Movie' && (item.weeklyGross || 0) >= 1250000;
    if (mainTab === 'PLAYER_FILMS') return item.isPlayerMovie;

    // REALISTIC CHART FLOOR: movies below the theater floor never chart (no $0.62M junk)
    if ((item.weeklyGross || 0) < 1250000 && !item.isPlayerMovie) return false;

    return true;
  });

  const activeInTheatersCount = items.filter((i) => i.inTheaters && i.type === 'Movie').length;
  const playerFilmsCount = items.filter((i) => i.isPlayerMovie).length;

  const renderMovementBadge = (item: BoxOfficeItem) => {
    if (item.movement === 'NEW') {
      return (
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          NEW
        </span>
      );
    }
    if (item.movement === 'OUT' || (!item.inTheaters && item.weeklyGross === 0)) {
      return (
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-white/10">
          OUT
        </span>
      );
    }

    const rankDiff = (item.previousRank || item.currentRank) - item.currentRank;

    if (item.movement === 'UP' || rankDiff > 0) {
      return (
        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
          <ArrowUp className="w-3 h-3 text-emerald-400" />
          +{Math.abs(rankDiff)}
        </span>
      );
    }

    if (item.movement === 'DOWN' || rankDiff < 0) {
      return (
        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-0.5">
          <ArrowDown className="w-3 h-3 text-rose-400" />
          -{Math.abs(rankDiff)}
        </span>
      );
    }

    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800/80 text-gray-400 border border-white/10 flex items-center gap-0.5">
        <Minus className="w-3 h-3 text-gray-400" />
        SAME
      </span>
    );
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-24 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 shadow">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          IMDb Variety Box Office Analytics
        </span>
      </div>

      {/* Main Banner */}
      <div
        className="rounded-3xl p-6 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 shrink-0">
              <Film className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                TOP 200 BOX OFFICE & RELEASE SIMULATION
              </h1>
              <p className="text-xs text-amber-300/90 font-medium">
                Live weekly gross rankings, theatrical decay tracking, all-time records & studio market share.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto bg-black/40 p-2.5 rounded-2xl border border-white/10">
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Active In Cinemas</span>
              <span className="text-lg font-black text-emerald-400">{activeInTheatersCount} Films</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Your Releases</span>
              <span className="text-lg font-black text-amber-400">{playerFilmsCount} Movies</span>
            </div>
          </div>
        </div>

        {/* Hollywood Accounting Note */}
        <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
          <DollarSign className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-bold block mb-0.5">💡 How Box Office Earnings Work vs Personal Cash:</strong>
            Theatrical Box Office gross (e.g. $100M+ theatrical revenue) is collected by Film Studios and Theater Chains. As an actor/producer, your personal liquid cash inflow comes from your <strong>Contract Salary</strong> (paid during filming), <strong>SAG-AFTRA Residuals</strong> (weekly performance checks), <strong>Backend Profit Share</strong> (negotiated contract %), and <strong>Streaming Royalties</strong>.
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'CHART', label: 'Top 200 Chart', icon: TrendingUp, count: items.length },
          { id: 'IN_THEATERS', label: 'In Theaters Now', icon: Flame, count: activeInTheatersCount },
          { id: 'PLAYER_FILMS', label: 'Your Motion Pictures', icon: Star, count: playerFilmsCount },
          { id: 'RECORDS', label: 'Box Office Records', icon: Trophy, count: records.length },
          { id: 'STUDIOS', label: 'Studio Market Share', icon: Building2, count: studios.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Sub-Filter Bar (For Chart & In Theaters Tabs) */}
      {(mainTab === 'CHART' || mainTab === 'IN_THEATERS' || mainTab === 'PLAYER_FILMS') && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movie, studio, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {(['ALL', 'MOVIES', 'SERIES'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === ft
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 1, 2, 3: CHART, IN THEATERS, PLAYER FILMS */}
      {(mainTab === 'CHART' || mainTab === 'IN_THEATERS' || mainTab === 'PLAYER_FILMS') && (
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-black/30 rounded-3xl border border-white/10 space-y-3">
              <Film className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="text-sm text-gray-400 font-bold">No motion pictures match the selected filters.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const weekly = item.weeklyGross || 0;
              const ww = item.worldwideGross || item.grossWorldwide || 0;
              const dom = item.domesticGross || item.grossDomestic || Math.round(ww * 0.4);
              const intl = item.internationalGross || item.grossInternational || Math.max(0, ww - dom);
              const budget = item.budget || 25000000;
              const marketing = item.marketing || 15000000;
              const totalCost = budget + marketing;
              const roi = ww > 0 ? (ww / totalCost).toFixed(1) : '0.0';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.isPlayerMovie
                      ? 'border-amber-400/80 bg-gradient-to-r from-amber-950/40 via-black/80 to-black/80 shadow-lg shadow-amber-500/10'
                      : 'border-white/10 bg-black/40 hover:bg-black/60'
                  } backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
                >
                  {/* Left: Rank, Poster & Movie Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex flex-col items-center justify-center shrink-0 w-12 text-center">
                      <span className="text-2xl font-black text-amber-400 tracking-tight">
                        #{item.currentRank || idx + 1}
                      </span>
                      {renderMovementBadge(item)}
                    </div>

                    <div className="w-16 h-22 rounded-xl overflow-hidden border border-white/20 bg-gray-900 shrink-0 relative shadow-lg">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute(
                            'src',
                            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop'
                          );
                        }}
                      />
                      {item.isPlayerMovie && (
                        <span className="absolute top-1 left-1 bg-amber-500 text-black font-black text-[7px] px-1 py-0.5 rounded shadow uppercase">
                          YOUR FILM
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">{item.studio}</span>
                        {item.director && (
                          <span className="text-[10px] text-gray-500 font-medium">Dir: {item.director}</span>
                        )}
                        {item.inTheaters && (
                          <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            In Cinemas
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-white truncate">{item.title}</h3>

                      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                        <span>Genres: {item.genres.join(', ')}</span>
                        <span>•</span>
                        <span>{item.weeksReleased || item.weeksInRelease || 1} Wks in Release</span>
                        {item.openingWeekendGross && (
                          <>
                            <span>•</span>
                            <span className="text-amber-300/90 font-semibold">
                              OW: ${(item.openingWeekendGross / 1000000).toFixed(1)}M
                            </span>
                          </>
                        )}
                      </div>

                      {/* Ratings & Scores */}
                      <div className="flex items-center gap-3 pt-1">
                        {item.criticRating !== undefined && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-300">
                            <span className="text-rose-400 font-extrabold">🍅 {item.criticRating}%</span>
                            <span className="text-[9px] text-gray-500">Critics</span>
                          </div>
                        )}
                        {item.audienceRating !== undefined && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-300">
                            <span className="text-amber-400 font-extrabold">🍿 {item.audienceRating}%</span>
                            <span className="text-[9px] text-gray-500">Audience</span>
                          </div>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400 font-extrabold">
                          ROI: {roi}x
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Gross Metrics */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.isPlayerMovie && item.inTheaters && (
                    <button
                      onClick={() => {
                        const cost = Math.max(250000, Math.floor((budget || 30000000) * 0.05));
                        if (player.money < cost) {
                          alert(`Insufficient funds for theater expansion ($${cost.toLocaleString()}).`);
                          return;
                        }
                        if (!window.confirm(`Launch theater expansion for "${item.title}"?\n\nCost: $${cost.toLocaleString()}\nEffect: weekly drop HALVED for 2 weeks (4-week cooldown).`)) return;
                        const res = BoxOfficeEngineService.launchTheaterExpansion(
                          (item as any).playerMovieId || item.id,
                          player.dateWeek,
                          cost
                        );
                        if (res.success) {
                          updatePlayer({ money: Math.max(0, player.money - cost) });
                          setBoxOfficeState(BoxOfficeEngineService.getState());
                        }
                        alert(res.message);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow"
                    >
                      📈 Expand Theaters ${(item as any).expansionWeeksLeft ? '(Active)' : `$${Math.max(250000, Math.floor((budget || 30000000) * 0.05)).toLocaleString()}`}
                    </button>
                  )}
                  <div className="flex items-center gap-4 text-right w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                    {item.type === 'Movie' ? (
                      <div className="space-y-1">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">
                            {item.inTheaters ? 'This Week Gross' : 'Final Box Office'}
                          </span>
                          <span className="text-lg font-black text-emerald-400">
                            {item.inTheaters && weekly > 0
                              ? `$${(weekly / 1000000).toFixed(2)}M`
                              : `$${(ww / 1000000).toFixed(1)}M`}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold">
                          Total: <span className="text-white font-bold">${(ww / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="text-[9px] text-gray-500">
                          Dom: ${(dom / 1000000).toFixed(1)}M | Intl: ${(intl / 1000000).toFixed(1)}M
                        </div>
                        {item.isPlayerMovie && item.inTheaters && (() => {
                          const runMax = 15;
                          const runWeek = item.weeksReleased || 1;
                          return (
                            <div className="text-[9px] text-amber-300/80 font-bold">
                              Run: W{runWeek}/{runMax} {(item as any).awardBoostWeeks ? '🏆 Boost' : ''}
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Global Viewership</span>
                        <span className="text-lg font-black text-sky-400">
                          {((item.viewership || 0) / 1000000).toFixed(1)}M Views
                        </span>
                        <div className="text-[10px] text-purple-300 font-semibold">
                          Renewed for Season {(item.seriesSeason || 1) + 1}
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB CONTENT 4: ALL-TIME BOX OFFICE RECORDS */}
      {mainTab === 'RECORDS' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200 font-medium">
              Official Hollywood Records tracked across all historical blockbusters, studio releases, and player motion pictures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-black/50 border border-amber-400/30 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-amber-400/70 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      {rec.recordType}
                    </span>
                    <h3 className="text-lg font-black text-white mt-2 group-hover:text-amber-300 transition-colors">
                      {rec.movieTitle}
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold">{rec.studio} ({rec.year})</p>
                  </div>

                  {rec.posterUrl && (
                    <div className="w-14 h-18 rounded-lg overflow-hidden border border-white/20 bg-gray-900 shrink-0">
                      <img src={rec.posterUrl} alt={rec.movieTitle} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Record Value</span>
                  <span className="text-2xl font-black text-amber-300 tracking-tight">{rec.valueFormatted}</span>
                </div>

                {rec.description && (
                  <p className="text-xs text-gray-400 italic font-medium leading-relaxed">{rec.description}</p>
                )}

                {rec.isPlayerMovie && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-black font-black text-[8px] px-2 py-0.5 rounded shadow uppercase">
                    PLAYER RECORD
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: STUDIO MARKET SHARE & PERFORMANCE */}
      {mainTab === 'STUDIOS' && (
        <div className="space-y-4">
          <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl flex items-center gap-3">
            <Building2 className="w-6 h-6 text-sky-400 shrink-0" />
            <p className="text-xs text-sky-200 font-medium">
              Comprehensive studio leaderboard analyzing market share %, hit ratios (3x+ ROI), flops (&lt;0.8x ROI), and studio reputation.
            </p>
          </div>

          <div className="space-y-3">
            {studios.map((st, idx) => (
              <div
                key={st.id}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-2xl font-black text-amber-400 w-8 text-center shrink-0">
                    #{idx + 1}
                  </span>

                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 bg-gray-900 shrink-0 p-1 bg-white/5">
                    <img src={st.logoUrl} alt={st.studioName} className="w-full h-full object-cover rounded-xl" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="text-base font-black text-white">{st.studioName}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      <span>{st.totalReleases} Releases</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-extrabold">{st.hitsCount} Hits (3x+ ROI)</span>
                      <span>•</span>
                      <span className="text-rose-400 font-bold">{st.flopsCount} Flops</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Market Share</span>
                    <span className="text-lg font-black text-sky-400">{st.marketSharePct}%</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Gross</span>
                    <span className="text-lg font-black text-emerald-400">
                      ${(st.totalWorldwideGross / 1000000000).toFixed(2)}B
                    </span>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Reputation</span>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-sm font-black text-amber-300">{st.reputationScore}/100</span>
                    </div>
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1 ml-auto">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300"
                        style={{ width: `${st.reputationScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
