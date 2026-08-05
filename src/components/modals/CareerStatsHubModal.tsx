/**
 * HOLLYWOOD RISING - Player Career Statistics Hub
 * Comprehensive metrics: Filmography, Box Office, Financials, Awards, Businesses, IPOs & Career Timeline.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import {
  X,
  TrendingUp,
  Film,
  DollarSign,
  Award,
  Building2,
  Users,
  Calendar,
  Star,
  CheckCircle2,
  PieChart,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Flame,
  Crown,
  Briefcase,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';
import { NetworkService } from '../../services/networkService';

export const CareerStatsHubModal: React.FC = () => {
  const { setActiveModal, saveData, player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<'METRICS' | 'TIMELINE' | 'BREAKDOWN'>('METRICS');

  // Calculations
  const startYear = 2026;
  const currentYear = player.dateYear || 2026;
  const currentWeek = player.dateWeek || 1;
  const totalWeeksPlayed = (currentYear - startYear) * 52 + currentWeek;
  const yearsInIndustry = Math.floor(totalWeeksPlayed / 52);
  const weeksRemainder = totalWeeksPlayed % 52;

  const releasedMovies = saveData.releasedMovies || [];
  const bookedProjects = saveData.bookedProjects || [];
  const moviesCompletedCount = player.moviesCompleted || releasedMovies.length;
  const totalProduced = releasedMovies.filter((m) => m.coStarNames?.includes('Producer') || m.studio?.includes('Indie')).length;

  // Average Scores
  const totalCritic = releasedMovies.reduce((acc, m) => acc + (m.criticScore || 70), 0);
  const avgCriticScore = releasedMovies.length > 0 ? Math.round(totalCritic / releasedMovies.length) : 75;

  const totalAudience = releasedMovies.reduce((acc, m) => acc + (m.audienceScore || 72), 0);
  const avgAudienceScore = releasedMovies.length > 0 ? Math.round(totalAudience / releasedMovies.length) : 78;

  // Box Office Hits & Flops
  let biggestHit = releasedMovies.length > 0
    ? [...releasedMovies].sort((a, b) => ((b.worldwideGross || b.boxOfficeGross || 0) - (a.worldwideGross || a.boxOfficeGross || 0)))[0]
    : null;

  let biggestFlop = releasedMovies.length > 0
    ? [...releasedMovies].sort((a, b) => ((a.worldwideGross || a.boxOfficeGross || 0) - (b.worldwideGross || b.boxOfficeGross || 0)))[0]
    : null;

  // Financial Stats
  const salaries = bookedProjects.map((p) => p.salary || 0);
  const highestSalary = salaries.length > 0 ? Math.max(...salaries) : 15000;
  const totalSalaryLifetime = salaries.reduce((a, b) => a + b, 0) + (moviesCompletedCount * 25000);
  const netState = NetworkService.getState();
  const finSummary = NetworkService.calculateFinancialSummary(netState, player.money);
  const totalRoyalties = (netState.syndicationSources || []).reduce((sum, s) => sum + ((s as any).totalEarnedToDate || (s.weeklyRoyaltyAmount || 0) * 12), 0);
  const totalInvestments = finSummary.investmentBalance + finSummary.savingsBalance;

  const companiesOwned = player.empire?.indieStudioOwned ? 1 : 0;
  const studiosOwned = player.empire?.indieStudioOwned ? 1 : 0;
  const awardsWon = player.awardsWon || 0;
  const awardsNominated = awardsWon + 3;

  const followers = player.fans || 12500;
  const fanClubMembers = Math.floor(followers * 0.15);
  const relationshipsCount = saveData.relationships?.filter((r) => r.relationshipLevel > 20).length || 0;
  const businessesCount = (player.empire?.realEstateUnits || 0) + (player.empire?.indieStudioOwned ? 1 : 0);

  const ipoSuccesses = player.empire?.indieStudioOwned ? 1 : 0;
  const acquisitionsCount = player.empire?.realEstateUnits || 0;

  const careerTimeline = saveData.careerTimeline || [
    { year: 2026, week: 1, title: 'Began Hollywood Career', category: 'General', description: 'Arrived in Los Angeles with $2,500 and a dream.' },
    { year: 2026, week: 12, title: 'First Callback Audition', category: 'Film', description: 'Auditioned for indie dramatic feature role.' },
    { year: 2026, week: 24, title: 'SAG-AFTRA Eligibility', category: 'Milestone', description: 'Completed lead performance requirements for guild membership.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-3xl rounded-3xl flex flex-col overflow-hidden border shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3 text-amber-400">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">CAREER STATISTICS & ANALYTICS</h2>
              <p className="text-[11px] text-amber-300 font-medium">
                Comprehensive performance metrics, box office records, and career timeline.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-3 bg-black/40 border-b border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('METRICS')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'METRICS'
                ? 'bg-amber-400 text-black shadow-lg'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            FILM & FINANCIAL METRICS
          </button>

          <button
            onClick={() => setActiveTab('TIMELINE')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'TIMELINE'
                ? 'bg-amber-400 text-black shadow-lg'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            CAREER TIMELINE ({careerTimeline.length})
          </button>

          <button
            onClick={() => setActiveTab('BREAKDOWN')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'BREAKDOWN'
                ? 'bg-amber-400 text-black shadow-lg'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            EMPIRE & ASSETS SUMMARY
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {activeTab === 'METRICS' && (
            <div className="space-y-5">
              {/* Primary Summary Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Career Length</span>
                  <span className="text-base font-black text-amber-300">
                    {yearsInIndustry} Yrs {weeksRemainder} Wks
                  </span>
                  <span className="text-[9px] text-gray-500 block">Total {totalWeeksPlayed} Weeks</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-sky-500/30">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Movies Released / Produced</span>
                  <span className="text-base font-black text-sky-400">
                    {moviesCompletedCount} / {totalProduced}
                  </span>
                  <span className="text-[9px] text-gray-500 block">Theatrical & Streaming</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Avg Critic Score</span>
                  <span className="text-base font-black text-emerald-400">{avgCriticScore}% Certified</span>
                  <span className="text-[9px] text-gray-500 block">Metacritic & RottenTomatoes</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Avg Audience Score</span>
                  <span className="text-base font-black text-purple-300">{avgAudienceScore}% Verified</span>
                  <span className="text-[9px] text-gray-500 block">CinemaScore A Average</span>
                </div>
              </div>

              {/* Box Office Hits & Flops */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Flame className="w-4 h-4" />
                    <strong className="text-xs uppercase font-extrabold">Biggest Box Office Hit</strong>
                  </div>

                  {biggestHit ? (
                    <div>
                      <h4 className="text-sm font-black text-white">{biggestHit.movieTitle}</h4>
                      <div className="flex justify-between items-center mt-1 text-[11px]">
                        <span className="text-gray-400">{biggestHit.studio}</span>
                        <AnimatedCounter value={biggestHit.boxOfficeGross || 150000000} formatting="currency" className="font-black text-emerald-400" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-[11px]">Release your first blockbuster to track hits!</p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    <strong className="text-xs uppercase font-extrabold">Lowest Grossing Title</strong>
                  </div>

                  {biggestFlop ? (
                    <div>
                      <h4 className="text-sm font-black text-white">{biggestFlop.movieTitle}</h4>
                      <div className="flex justify-between items-center mt-1 text-[11px]">
                        <span className="text-gray-400">{biggestFlop.studio}</span>
                        <AnimatedCounter value={biggestFlop.boxOfficeGross || 12000000} formatting="currency" className="font-black text-rose-400" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-[11px]">No theatrical flops recorded.</p>
                  )}
                </div>
              </div>

              {/* Detailed Financial & Compensation Breakdown */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <h4 className="font-black text-amber-300 uppercase tracking-wider text-xs flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Lifetime Salary & Royalties Compensation
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 block font-bold">Highest Single Salary</span>
                    <AnimatedCounter value={highestSalary} formatting="currency" className="font-black text-white" />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 block font-bold">Total Acting Salary</span>
                    <AnimatedCounter value={totalSalaryLifetime} formatting="currency" className="font-black text-emerald-400" />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 block font-bold">Total Royalties Earned</span>
                    <AnimatedCounter value={totalRoyalties} formatting="currency" className="font-black text-amber-300" />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-gray-400 block font-bold">Total Empire Investments</span>
                    <AnimatedCounter value={totalInvestments} formatting="currency" className="font-black text-purple-300" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TIMELINE' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Chronological Career Timeline
              </h4>

              <div className="space-y-3 relative pl-4 border-l-2 border-amber-500/30">
                {careerTimeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-black" />
                    <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{item.title}</span>
                        <span className="text-[10px] font-mono font-bold text-amber-300">
                          Yr {item.year} • Wk {item.week}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300">{item.description}</p>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-white/10 text-gray-400 inline-block font-bold">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'BREAKDOWN' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">Companies Owned</span>
                  <span className="text-base font-black text-white">{companiesOwned} Active Corporate Entities</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">Studios Owned</span>
                  <span className="text-base font-black text-amber-300">{studiosOwned} Major / Indie Lot</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">Awards & Nominations</span>
                  <span className="text-base font-black text-amber-400">
                    {awardsWon} Wins / {awardsNominated} Noms
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">Global Followers</span>
                  <AnimatedCounter value={followers} formatting="number" className="text-base font-black text-sky-400" />
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">Fan Club Members</span>
                  <AnimatedCounter value={fanClubMembers} formatting="number" className="text-base font-black text-purple-300" />
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">Relationships & Allies</span>
                  <span className="text-base font-black text-rose-300">{relationshipsCount} Inner Circle</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">IPO Successes</span>
                  <span className="text-base font-black text-emerald-400">{ipoSuccesses} Public Listings</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 col-span-2">
                  <span className="text-gray-400 block font-bold text-[10px] uppercase">Acquisitions & Real Estate</span>
                  <span className="text-base font-black text-amber-300">{acquisitionsCount} Commercial Units & Mansions</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
