/**
 * HOLLYWOOD RISING - IMDb Profile & Movie Releases Modal
 * Authentic IMDb actor profile view with dynamic biography generation, comprehensive career statistics, and filmography.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Award,
  DollarSign,
  Star,
  TrendingUp,
  Film,
  User,
  Crown,
  ShieldCheck,
  Globe,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { generateImdbBiography, getCareerStatusTier } from '../../utils/imdbBioGenerator';
import { THEMES } from '../../theme/colors';

export const ReleasesModal: React.FC = () => {
  const {
    setActiveModal,
    player,
    releasedMovies,
    settings,
    setSelectedFycMovieId,
    bookedProjects,
    auditions,
    careerTimeline,
    awardHistory,
  } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const bioText = generateImdbBiography(player, releasedMovies, {
    bookedProjects,
    auditions,
    careerTimeline,
    awardHistory,
  });
  const careerTier = getCareerStatusTier(player, releasedMovies.length);

  // Stats calculation
  const totalFilms = releasedMovies.length;
  const leadRoles = player.leadRolesCount;
  const principalRoles = player.principalRolesCount;
  const supportingRoles = Math.max(0, totalFilms - leadRoles - principalRoles);
  const cameoRoles = 0;
  const awardsWon = player.awardsWon;
  const awardNominations = awardsWon * 2;
  const careerFame = player.fameXp;
  const fanCount = player.fans;
  const yearsActive = Math.max(1, player.dateYear - 2026 + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 md:p-6 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-black text-sm tracking-wider uppercase">
              IMDb
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                Official IMDb Star Profile
              </h2>
              <p className="text-xs text-gray-400">Actor Bio, Career Analytics & Filmography</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Profile Hero Card */}
          <div className="p-5 md:p-6 rounded-2xl bg-black/50 border border-white/10 flex flex-col md:flex-row gap-6 items-start shadow-xl">
            {/* Actor Avatar */}
            <div className="w-28 md:w-36 h-28 md:h-36 rounded-2xl overflow-hidden border-2 border-amber-400/60 shrink-0 shadow-2xl bg-gray-900">
              <img src={player.avatarUrl} alt={player.firstName} className="w-full h-full object-cover" />
            </div>

            {/* Actor Details */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                    {player.firstName} {player.lastName}
                    {player.isUnionMember && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                  </h3>
                  <p className="text-xs md:text-sm text-amber-400 font-semibold mt-0.5">
                    {player.country} • {player.gender}, {player.age} Years Old
                  </p>
                </div>

                <div className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase border tracking-wider shadow ${careerTier.badgeColor}`}>
                  {careerTier.title}
                </div>
              </div>

              {/* Biography Section */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Biography & Career Narrative
                </h4>
                <p className="text-xs md:text-sm text-gray-200 leading-relaxed whitespace-pre-line font-medium">
                  {bioText}
                </p>
              </div>
            </div>
          </div>

          {/* Comprehensive Career Statistics Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              <span>IMDb Career Statistics</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Films</span>
                <span className="text-xl font-black text-white">{totalFilms}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Lead Roles</span>
                <span className="text-xl font-black text-amber-400">{leadRoles}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Principal Roles</span>
                <span className="text-xl font-black text-sky-400">{principalRoles}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Supporting Roles</span>
                <span className="text-xl font-black text-purple-300">{supportingRoles}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Cameo Roles</span>
                <span className="text-xl font-black text-gray-300">{cameoRoles}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Awards Won</span>
                <span className="text-xl font-black text-yellow-400">{awardsWon}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Award Nominations</span>
                <span className="text-xl font-black text-amber-200">{awardNominations}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Career Fame</span>
                <span className="text-xl font-black text-purple-400">{careerFame} XP</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Fan Count</span>
                <span className="text-xl font-black text-emerald-400">{fanCount.toLocaleString()}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Years Active</span>
                <span className="text-xl font-black text-white">{yearsActive} Yrs</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1 col-span-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Status Tier</span>
                <span className="text-sm font-black text-amber-300">{careerTier.title}</span>
              </div>
            </div>
          </div>

          {/* Filmography & Movie Releases */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>IMDb Feature Filmography</span>
            </h4>

            {releasedMovies.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-black/30 rounded-2xl border border-white/5">
                <Film className="w-12 h-12 mx-auto text-gray-600 animate-pulse" />
                <p className="text-gray-400 text-sm font-medium">No theatrical releases credited on IMDb yet.</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Complete filming contracts in Production Hub to premiere your movies in theaters worldwide.
                </p>
              </div>
            ) : (
              releasedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="rounded-2xl border-2 p-5 md:p-6 flex flex-col md:flex-row gap-5 bg-black/40 shadow-xl transition-all hover:border-amber-400/50"
                  style={{
                    borderColor: theme.borderDark,
                  }}
                >
                  {/* Poster */}
                  <div className="w-28 md:w-36 h-40 md:h-52 rounded-xl overflow-hidden shrink-0 bg-gray-900 border border-white/15 relative shadow-2xl">
                    <img src={movie.posterUrl} alt={movie.movieTitle} className="w-full h-full object-cover" />
                    {movie.inCinemas && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500 text-black font-extrabold text-[10px] uppercase tracking-wider shadow">
                        In Cinemas
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg md:text-xl font-black text-white">{movie.movieTitle}</h3>
                        <p className="text-xs md:text-sm text-amber-400 font-bold">{movie.roleType} Role</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-emerald-400 flex items-center justify-end gap-0.5">
                          <DollarSign className="w-4 h-4" />
                          ${movie.playerEarnings.toLocaleString()} Paid
                        </span>
                        <span className="text-xs text-gray-400 block font-medium">
                          Week {movie.weeksInCinemas} in Theaters
                        </span>
                      </div>
                    </div>

                    {/* Gross Box Office Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-black/50 border border-white/10 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Opening Wknd</span>
                        <span className="text-white font-extrabold">${((movie.openingWeekendGross || 0) / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Domestic</span>
                        <span className="text-white font-extrabold">${((movie.domesticGross || 0) / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">International</span>
                        <span className="text-white font-extrabold">${((movie.internationalGross || (movie.worldwideGross - movie.domesticGross)) / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Worldwide</span>
                        <span className="text-amber-300 font-black">${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>

                    {/* Secondary Metrics: Budget, Awards, Streaming, Royalties */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-white/5 text-xs text-gray-300">
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold uppercase">Budget</span>
                        <span className="font-extrabold text-white">${((movie.budget || 25000000) / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold uppercase">Awards (Won/Nom)</span>
                        <span className="font-extrabold text-amber-300">{movie.awardsWon || 0} / {movie.awardsNominated || 0}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold uppercase">Streaming Rev</span>
                        <span className="font-extrabold text-sky-300">${((movie.streamingRevenue || 1200000) / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold uppercase">Lifetime Royalties</span>
                        <span className="font-extrabold text-emerald-400">${(movie.lifetimeRoyalties || (movie.playerEarnings * 0.05)).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Ratings, Rank & FYC Campaign Action */}
                    <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-white/5 gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>Audience: {movie.audienceRating}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                          <Award className="w-4 h-4" />
                          <span>Critics: {movie.criticRating}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedFycMovieId(movie.id);
                            setActiveModal('fyc_campaign');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{movie.fycCampaignLevel ? `FYC: ${movie.fycCampaignLevel}` : 'Launch FYC Campaign'}</span>
                        </button>
                        <span className="text-xs font-bold text-gray-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                          Rank: <strong className="text-amber-400">#{movie.boxOfficePosition}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
