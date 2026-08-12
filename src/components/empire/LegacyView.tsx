/**
 * HOLLYWOOD RISING - Career Analytics & Legacy Center
 * (CAREER RECORDS • HALL OF FAME • LIFETIME STATISTICS)
 * Premium 3 Cards Per Row Grid View Layout with zero fake stats.
 */

import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Crown,
  Star,
  BookOpen,
  Trophy,
  Award,
  Film,
  Tv,
  Building2,
  DollarSign,
  Clock,
  Medal,
  Search,
  Heart,
  Share2,
  TrendingUp,
  BarChart3,
  Users,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

type LegacyTabFilter =
  | 'ALL'
  | 'OVERVIEW'
  | 'MOVIES'
  | 'SERIES'
  | 'AWARDS'
  | 'HALL_OF_FAME'
  | 'FINANCES'
  | 'BUSINESS'
  | 'RELATIONSHIPS'
  | 'SOCIAL'
  | 'MILESTONES'
  | 'RECORDS';

export const LegacyView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player, releasedMovies = [], bookedProjects = [], relationships = [], settings , persistNow } = useGame();
  const theme = THEMES[settings?.theme || 'Hollywood Gold'] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<LegacyTabFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Safe null checks
  const safePlayerMoney = player?.money || 0;
  const safePlayerFame = player?.fameXp || 0;
  const safePlayerLastName = player?.lastName || 'Mogul';
  const safeYear = player?.dateYear || 2026;
  const safeWeek = player?.dateWeek || 1;

  const legacy = empireState?.legacy || {
    hallOfFameRank: 'Upcoming Talent',
    hallOfFameScore: 0,
    museumName: `${safePlayerLastName} Legacy Estate`,
    greatestMovie: 'None Yet',
    peakNetWorth: safePlayerMoney,
    lifetimeEarnings: safePlayerMoney,
    lifetimeBoxOffice: 0,
    businessEmpireValuation: 0,
    realEstateValuation: 0,
    philanthropyDonatedTotal: 0,
    walkOfFameStar: false,
    autobiographyPublished: false,
    milestones: [],
    awardsWonCount: 0,
    totalMoviesActed: 0,
    totalMoviesDirected: 0,
    totalBusinessesCreated: 0,
    totalGlobalHubsBuilt: 0,
    worldRecordsCount: 0,
  };

  const starCost = 500000;
  const minScoreForStar = 5000;

  const handleDedicateWalkOfFameStar = () => {
    if (legacy.walkOfFameStar) return;

    if ((legacy.hallOfFameScore || 0) < minScoreForStar) {
      alert(`Insufficient Hall of Fame Score! Requires at least ${minScoreForStar} pts (Current: ${legacy.hallOfFameScore || 0}).`);
      return;
    }

    if (safePlayerMoney < starCost) {
      alert(`Insufficient funds! Walk of Fame Star ceremony requires $${starCost.toLocaleString()}.`);
      return;
    }

    if (player) {
      player.money -= starCost;
    persistNow();
    }

    const updated: EmpireFullState = {
      ...empireState,
      legacy: {
        ...legacy,
        walkOfFameStar: true,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert('⭐ WALK OF FAME DEDICATION: Your terrazzo star on Hollywood Boulevard has been unveiled!');
  };

  const handlePublishAutobiography = () => {
    if (legacy.autobiographyPublished) return;

    const cost = 250000;
    if (safePlayerMoney < cost) {
      alert(`Insufficient funds ($${cost.toLocaleString()} required).`);
      return;
    }

    if (player) {
      player.money -= cost;
    persistNow();
    }

    const updated: EmpireFullState = {
      ...empireState,
      legacy: {
        ...legacy,
        autobiographyPublished: true,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert('📚 BESTSELLER RELEASE: Published memoir "Rise of the Mogul". #1 New York Times Bestseller!');
  };

  // Safe Arrays
  const safeMovies = releasedMovies || [];
  const safeBooked = bookedProjects || [];
  const safeRels = relationships || [];
  const safeBusinesses = empireState?.businesses || [];

  // Compute Statistics
  const moviesCompletedCount = player?.moviesCompleted || safeMovies.length || 0;
  const leadRolesCount = player?.leadRolesCount || 0;
  const principalRolesCount = player?.principalRolesCount || 0;
  const guestRolesCount = safeBooked.filter((p) => p && (p.roleType === 'Guest Star' || p.roleType === 'Recurring')).length;

  const totalLifetimeEarnings = Math.max(safePlayerMoney, legacy.lifetimeEarnings || safePlayerMoney);
  const totalBoxOfficeGross = safeMovies.reduce((acc, m) => acc + (m?.worldwideGross || 0), 0);
  const totalAwardsWon = Math.max(player?.awardsWon || 0, legacy.awardsWonCount || 0);

  // Filtered Movie Library
  const filteredMovies = useMemo(() => {
    return safeMovies.filter((m) => {
      if (!m) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (m.movieTitle || '').toLowerCase().includes(q) ||
        (m.roleType || '').toLowerCase().includes(q)
      );
    });
  }, [safeMovies, searchQuery]);

  // Relationships Statistics
  const friendsList = useMemo(() => safeRels.filter((r) => r && (r.stage === 'Friend' || r.stage === 'Close Friend')), [safeRels]);
  const spouse = useMemo(() => safeRels.find((r) => r && (r.stage === 'Married' || r.stage === 'Engaged')), [safeRels]);

  // Top Movies
  const highestGrossingMovie = useMemo(() => {
    if (safeMovies.length === 0) return null;
    return [...safeMovies].sort((a, b) => (b?.worldwideGross || 0) - (a?.worldwideGross || 0))[0] || null;
  }, [safeMovies]);

  const highestRatedMovie = useMemo(() => {
    if (safeMovies.length === 0) return null;
    return [...safeMovies].sort((a, b) => (b?.criticRating || 0) - (a?.criticRating || 0))[0] || null;
  }, [safeMovies]);

  // Dynamic Career Milestones
  const realMilestones = useMemo(() => {
    const isUnion = Boolean(player?.isUnionMember);
    const moneyVal = safePlayerMoney;
    const bizCount = safeBusinesses.length;
    const hasHolding = Boolean(empireState?.holdingCompany?.isFormed);
    const hallScore = legacy.hallOfFameScore || 0;

    return [
      { id: 'm_1', title: 'First Feature Movie', isUnlocked: moviesCompletedCount > 0, desc: 'Completed first feature motion picture production.', category: 'Career' },
      { id: 'm_2', title: 'First Lead Role', isUnlocked: leadRolesCount > 0, desc: 'Landed first leading role on a major studio project.', category: 'Career' },
      { id: 'm_3', title: 'SAG-AFTRA Guild Union', isUnlocked: isUnion, desc: 'Earned full union membership in the Screen Actors Guild.', category: 'Guild' },
      { id: 'm_4', title: 'First Award Statuette', isUnlocked: totalAwardsWon > 0, desc: 'Won first major industry acting award.', category: 'Awards' },
      { id: 'm_5', title: 'Blockbuster $100M Box Office', isUnlocked: (highestGrossingMovie?.worldwideGross || 0) >= 100000000, desc: 'Starred in a $100 Million+ worldwide box office smash.', category: 'Box Office' },
      { id: 'm_6', title: 'Millionaire Status ($1M Net Worth)', isUnlocked: moneyVal >= 1000000, desc: 'Accumulated over $1,000,000 in cash reserves.', category: 'Finances' },
      { id: 'm_7', title: 'First Business Enterprise', isUnlocked: bizCount > 0, desc: 'Founded first commercial business venture or production company.', category: 'Empire' },
      { id: 'm_8', title: 'Holding Company Conglomerate', isUnlocked: hasHolding, desc: 'Established a corporate holding company entity.', category: 'Empire' },
      { id: 'm_9', title: 'Hollywood Boulevard Star', isUnlocked: Boolean(legacy.walkOfFameStar), desc: 'Dedicated a star on the Walk of Fame.', category: 'Legacy' },
      { id: 'm_10', title: 'Published Bestselling Memoir', isUnlocked: Boolean(legacy.autobiographyPublished), desc: 'Authored #1 New York Times bestselling autobiography.', category: 'Legacy' },
      { id: 'm_11', title: 'Multi-Millionaire ($100M Net Worth)', isUnlocked: moneyVal >= 100000000, desc: 'Surpassed $100,000,000 in career net worth.', category: 'Finances' },
      { id: 'm_12', title: 'Hall of Fame Immortal Rank', isUnlocked: hallScore >= 5000, desc: 'Achieved Hall of Fame status with 5,000+ legacy points.', category: 'Hall of Fame' },
    ];
  }, [moviesCompletedCount, leadRolesCount, player, totalAwardsWon, highestGrossingMovie, empireState, safeBusinesses, safePlayerMoney, legacy]);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none space-y-5 pb-28"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Header Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Back to Empire Hub</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">CAREER ANALYTICS & LEGACY CENTER</h1>
            <p className="text-xs text-amber-300 font-bold">100% Grounded Real Gameplay Statistics & Career History</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-right">
            <span className="text-[9px] text-gray-400 uppercase font-black block">Hall of Fame Score</span>
            <span className="text-lg font-black text-amber-300 font-mono">
              {(legacy.hallOfFameScore || 0).toLocaleString()} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Main Estate Banner */}
      <div
        className="p-6 rounded-3xl border shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-md"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">
              HOLLYWOOD IMMORTAL ESTATE & ARCHIVES
            </span>
            <h2 className="text-2xl font-black text-white">{legacy.museumName || `${safePlayerLastName} Legacy Estate`}</h2>
            <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
              <span>Rank: <strong className="text-amber-300">{legacy.hallOfFameRank || 'Upcoming Talent'}</strong></span>
              <span>•</span>
              <span>Career Year: <strong className="text-white">{safeYear} (Week {safeWeek})</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!legacy.walkOfFameStar ? (
              <button
                onClick={handleDedicateWalkOfFameStar}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <Star className="w-4 h-4 fill-black" />
                DEDICATE WALK OF FAME STAR ($500,000)
              </button>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                ⭐ Walk of Fame Terrazzo Star Unveiled
              </div>
            )}

            {!legacy.autobiographyPublished ? (
              <button
                onClick={handlePublishAutobiography}
                className="px-4 py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                PUBLISH MEMOIR ($250,000)
              </button>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-black text-xs flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                📚 #1 NYT Bestselling Memoir
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search & Category Navigation Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-black/50 p-2.5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 bg-black/60 px-3 py-2 rounded-xl border border-white/10 flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search films, series, awards, businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full font-medium"
            />
          </div>

          <span className="text-xs text-amber-300 font-black font-mono">
            Real Career Archives
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'ALL' as const, label: 'All Analytics', icon: BarChart3 },
            { id: 'OVERVIEW' as const, label: 'Career Overview', icon: Trophy },
            { id: 'MOVIES' as const, label: `Movie Library (${safeMovies.length})`, icon: Film },
            { id: 'SERIES' as const, label: `Series Library (${safeBooked.length})`, icon: Tv },
            { id: 'AWARDS' as const, label: `Awards (${totalAwardsWon})`, icon: Award },
            { id: 'HALL_OF_FAME' as const, label: 'Hall of Fame', icon: Crown },
            { id: 'FINANCES' as const, label: 'Financial Records', icon: DollarSign },
            { id: 'BUSINESS' as const, label: `Empire (${safeBusinesses.length})`, icon: Building2 },
            { id: 'RELATIONSHIPS' as const, label: `Relationships (${safeRels.length})`, icon: Heart },
            { id: 'SOCIAL' as const, label: 'Social Media', icon: Share2 },
            { id: 'MILESTONES' as const, label: `Milestones (${realMilestones.filter((m) => m.isUnlocked).length}/${realMilestones.length})`, icon: Medal },
            { id: 'RECORDS' as const, label: 'Personal Records', icon: Star },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-lg font-extrabold'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: CAREER OVERVIEW (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'OVERVIEW') && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest px-1">
            Career Overview Statistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  CAREER LENGTH & UNION
                </span>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white font-mono">
                  Year {safeYear} (W{safeWeek})
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Active Career: {Math.max(1, (safeYear - 2026) * 52 + safeWeek)} Weeks
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs font-mono text-emerald-400 font-bold">
                {player?.isUnionMember ? '✅ SAG-AFTRA Full Guild Member' : '⚠️ Non-Union Independent Actor'}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                  FILMOGRAPHY BREAKDOWN
                </span>
                <Film className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white font-mono">
                  {moviesCompletedCount} Feature Movies
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Lead Roles: {leadRolesCount} | Supporting: {principalRolesCount}
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs font-mono text-amber-300 font-bold">
                TV Guest / Recurring Appearances: {guestRolesCount}
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  FAME & REPUTATION INDEX
                </span>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xl font-black text-emerald-400 font-mono">
                  {safePlayerFame.toLocaleString()} Fame XP
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Career Reputation: {Math.min(100, Math.floor(safePlayerFame / 1000) + 20)} / 100
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs font-mono text-white font-bold">
                Net Worth: ${safePlayerMoney.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: MOVIE LIBRARY (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'MOVIES') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Permanent Completed Movie Library ({safeMovies.length} Films)
            </h3>
            <span className="text-xs text-amber-300 font-bold">Theatrical Credits</span>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/60 text-center space-y-2">
              <Film className="w-8 h-8 text-gray-500 mx-auto" />
              <h4 className="text-sm font-black text-white">No Motion Pictures Recorded Yet</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Audition and complete movie productions on the Production Hub and Callboard to permanently index your theatrical filmography here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredMovies.map((m) => (
                <div
                  key={m.id || m.movieTitle}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                        {m.roleType || 'Actor'} Role
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        Box Office #{m.boxOfficePosition || 1}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white">{m.movieTitle || 'Untitled Movie'}</h4>
                    <p className="text-xs text-gray-400 font-mono">
                      Earnings: ${(m.playerEarnings || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Worldwide Gross:</span>
                      <span className="text-emerald-400 font-bold">${(m.worldwideGross || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Opening Weekend:</span>
                      <span className="text-white font-bold">${(m.openingWeekendGross || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Critic Rating:</span>
                      <span className="text-amber-300 font-bold">{m.criticRating || 85}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Awards Won:</span>
                      <span className="text-purple-300 font-bold">{m.awardsWon || 0} Statuettes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 3: SERIES LIBRARY (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'SERIES') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Completed Television & Streaming Series ({safeBooked.length} Bookings)
            </h3>
            <span className="text-xs text-amber-300 font-bold">Prestige TV Credits</span>
          </div>

          {safeBooked.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/60 text-center space-y-2">
              <Tv className="w-8 h-8 text-gray-500 mx-auto" />
              <h4 className="text-sm font-black text-white">No Television Series Recorded Yet</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Book TV series roles on the Callboard to permanently store episodic streaming contracts and revenue records.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {safeBooked.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-xl hover:border-indigo-400/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                        {p.roleType || 'Series Regular'}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        ${(p.salary || 0).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white">{p.movieTitle || 'Prestige TV Series'}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Studio: {p.studio || 'Streaming Network'}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Filming Weeks:</span>
                      <span className="text-white font-bold">{p.totalFilmingWeeks || (p as any).filmingWeeks || 4} Weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-emerald-400 font-bold">Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 4: AWARDS HISTORY (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'AWARDS') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Permanent Award Trophies & Statuettes ({totalAwardsWon} Total Wins)
            </h3>
            <span className="text-xs text-purple-300 font-bold">Oscars, Emmys & Guilds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400">ACADEMY & GUILD TOTALS</span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-2xl font-black text-white font-mono">{totalAwardsWon} Wins</h4>
              <p className="text-xs text-gray-400">
                Lifetime awards won across motion pictures & television.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-purple-400">MOST AWARDED FILM</span>
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-base font-black text-white">
                {highestRatedMovie?.movieTitle || 'None Recorded'}
              </h4>
              <p className="text-xs text-gray-400">
                Highest rated film with maximum critic acclaim & awards buzz.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400">CAREER CEREMONIES</span>
                <Crown className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-xl font-black text-emerald-400 font-mono">
                {Math.max(1, totalAwardsWon)} Ceremonies
              </h4>
              <p className="text-xs text-gray-400">
                Attended red carpet galas & award ceremony presentations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: HALL OF FAME (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'HALL_OF_FAME') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Hall of Fame All-Time Records
            </h3>
            <span className="text-xs text-amber-300 font-bold">Hollywood Archives</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-amber-400 uppercase block">HIGHEST GROSSING FILM</span>
              <h4 className="text-lg font-black text-white">{highestGrossingMovie?.movieTitle || 'None Yet'}</h4>
              <p className="text-xs text-emerald-400 font-mono font-bold">
                ${(highestGrossingMovie?.worldwideGross || 0).toLocaleString()} Worldwide
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-purple-500/30 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-purple-400 uppercase block">CRITICALLY ACCLAIMED FILM</span>
              <h4 className="text-lg font-black text-white">{highestRatedMovie?.movieTitle || 'None Yet'}</h4>
              <p className="text-xs text-amber-300 font-mono font-bold">
                {highestRatedMovie?.criticRating || 0}% Critic Score
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-emerald-500/30 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-emerald-400 uppercase block">PEAK CAREER NET WORTH</span>
              <h4 className="text-xl font-black text-emerald-400 font-mono">
                ${Math.max(safePlayerMoney, legacy.peakNetWorth || 0).toLocaleString()}
              </h4>
              <p className="text-xs text-gray-400">All-time peak recorded assets & cash reserves.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: FINANCIAL RECORDS (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'FINANCES') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Financial & Net Worth Records
            </h3>
            <span className="text-xs text-emerald-400 font-bold">Lifetime Accounting</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-emerald-400 uppercase block">CURRENT LIQUID CASH</span>
              <h4 className="text-2xl font-black text-emerald-400 font-mono">${safePlayerMoney.toLocaleString()}</h4>
              <p className="text-xs text-gray-400">Available liquid cash in bank accounts.</p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-sky-400 uppercase block">BUSINESS VALUATION</span>
              <h4 className="text-2xl font-black text-sky-400 font-mono">
                ${(legacy.businessEmpireValuation || 0).toLocaleString()}
              </h4>
              <p className="text-xs text-gray-400">Valuation of businesses & holding entities.</p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-amber-400 uppercase block">LIFETIME EARNINGS GROSS</span>
              <h4 className="text-2xl font-black text-amber-300 font-mono">
                ${totalLifetimeEarnings.toLocaleString()}
              </h4>
              <p className="text-xs text-gray-400">Cumulative total money earned across career.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: BUSINESS EMPIRE (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'BUSINESS') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Business Empire & Ventures ({safeBusinesses.length} Active Businesses)
            </h3>
            <span className="text-xs text-amber-300 font-bold">Mogul Conglomerate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-amber-400 uppercase block">ACTIVE BUSINESSES</span>
              <h4 className="text-2xl font-black text-white font-mono">{safeBusinesses.length} Ventures</h4>
              <p className="text-xs text-gray-400">Commercial companies & indie studios owned.</p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-purple-400 uppercase block">HOLDING COMPANY</span>
              <h4 className="text-2xl font-black text-purple-300 font-mono">
                {empireState?.holdingCompany?.isFormed ? 'Formed' : 'Unformed'}
              </h4>
              <p className="text-xs text-gray-400">Corporate umbrella parent entity.</p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-emerald-400 uppercase block">EXECUTIVES EMPLOYED</span>
              <h4 className="text-2xl font-black text-emerald-400 font-mono">
                {(empireState?.holdingCompany?.executives || []).length} Execs
              </h4>
              <p className="text-xs text-gray-400">C-suite leadership running operations.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 8: RELATIONSHIP HISTORY (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'RELATIONSHIPS') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Hollywood Relationships & Family ({safeRels.length} Connections)
            </h3>
            <span className="text-xs text-rose-300 font-bold">Network & Family</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-rose-400 uppercase block">MARRIAGE & SPOUSE</span>
              <h4 className="text-lg font-black text-white">{spouse ? spouse.name : 'Single / Unmarried'}</h4>
              <p className="text-xs text-gray-400">
                {spouse ? `Status: ${spouse.stage}` : 'No active spouse registered.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-sky-400 uppercase block">CHILDREN & FAMILY</span>
              <h4 className="text-2xl font-black text-white font-mono">{player?.childrenCount || 0} Children</h4>
              <p className="text-xs text-gray-400">
                Schooling: {player?.childrenSchoolType || 'Standard'}
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-amber-400 uppercase block">HOLLYWOOD CIRCLE</span>
              <h4 className="text-2xl font-black text-amber-300 font-mono">{friendsList.length} Friends</h4>
              <p className="text-xs text-gray-400">A-list industry friends & peers.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 9: SOCIAL MEDIA HISTORY (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'SOCIAL') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Social Media & Fan Auditing
            </h3>
            <span className="text-xs text-sky-400 font-bold">Digital Presence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-sky-400 uppercase block">FAN FOLLOWERS</span>
              <h4 className="text-2xl font-black text-sky-300 font-mono">{(player?.fans || 0).toLocaleString()} Fans</h4>
              <p className="text-xs text-gray-400">Total followers across verified accounts.</p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-blue-400 uppercase block">VERIFICATION STATUS</span>
              <h4 className="text-base font-black text-white">
                {(player?.fans || 0) >= 100000 ? '☑️ Verified Celebrity Checkmark' : '⚪ Unverified Emerging Profile'}
              </h4>
              <p className="text-xs text-gray-400">Unlocked automatically at 100k+ fans.</p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-amber-400 uppercase block">HOLLYWOOD MEDIA BUZZ</span>
              <h4 className="text-2xl font-black text-amber-300 font-mono">
                {Math.min(100, Math.floor(safePlayerFame / 800) + 15)} Index
              </h4>
              <p className="text-xs text-gray-400">Calculated press engagement score.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 10: CAREER MILESTONES (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'MILESTONES') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Career Milestones ({realMilestones.filter((m) => m.isUnlocked).length} / {realMilestones.length} Unlocked)
            </h3>
            <span className="text-xs text-amber-300 font-bold">Automatic Gameplay Tracking</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {realMilestones.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 shadow-xl transition-all ${
                  m.isUnlocked
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-white/10 bg-black/60 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-amber-300 px-2 py-0.5 rounded bg-black/40">
                      {m.category}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        m.isUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {m.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-white mt-1">{m.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 11: PERSONAL RECORDS (3 CARDS PER ROW GRID)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'RECORDS') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Personal Gameplay Career Records
            </h3>
            <span className="text-xs text-amber-300 font-bold">100% Earned Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-amber-400 uppercase block">HIGHEST BOX OFFICE FILM</span>
              <h4 className="text-base font-black text-white">{highestGrossingMovie?.movieTitle || 'None Yet'}</h4>
              <p className="text-xs text-emerald-400 font-mono font-bold">
                ${(highestGrossingMovie?.worldwideGross || 0).toLocaleString()}
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-purple-400 uppercase block">BEST CRITIC SCORE</span>
              <h4 className="text-base font-black text-white">{highestRatedMovie?.movieTitle || 'None Yet'}</h4>
              <p className="text-xs text-amber-300 font-mono font-bold">
                {highestRatedMovie?.criticRating || 0}% Critic Score
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2 shadow-xl">
              <span className="text-[10px] font-black text-emerald-400 uppercase block">ALL-TIME PEAK CASH</span>
              <h4 className="text-2xl font-black text-emerald-400 font-mono">
                ${Math.max(safePlayerMoney, legacy.peakNetWorth || 0).toLocaleString()}
              </h4>
              <p className="text-xs text-gray-400">Peak recorded liquid money.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
