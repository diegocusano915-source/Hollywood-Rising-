/**
 * HOLLYWOOD RISING - Beast Mode Weekly Recap Modal
 * Comprehensive 8-Section Weekly Recap displaying real gameplay events.
 * Always finishes by returning the player directly to GameHome.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  DollarSign,
  Zap,
  Users,
  CheckCircle2,
  Clapperboard,
  Briefcase,
  Globe,
  Building2,
  Crown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  X,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { WeeklyRecapData } from '../../types/game';

type RecapCategoryTab =
  | 'ALL'
  | 'CAREER'
  | 'FINANCE'
  | 'SOCIAL'
  | 'WORLD'
  | 'NETWORK'
  | 'EMPIRE'
  | 'REPRESENTATION'
  | 'NEXT_WEEK';

export const WeeklyRecapModal: React.FC = () => {
  const { lastWeeklyRecap, setActiveModal, setActiveMainTab } = useGame();
  const [activeTab, setActiveTab] = useState<RecapCategoryTab>('ALL');

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#FBBF24', '#818CF8', '#34D399', '#38BDF8'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!lastWeeklyRecap) return null;

  const recap: WeeklyRecapData = lastWeeklyRecap;

  const handleContinue = () => {
    setActiveModal('none');
  };

  const renderBulletList = (items: string[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-xs text-gray-500 italic py-2 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-gray-600" />
          <span>No Updates This Week</span>
        </div>
      );
    }

    return (
      <ul className="space-y-1.5 text-xs text-gray-200">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  const isPositiveNet = recap.finance.netWeeklyChange >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-3 sm:p-5 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#0C0D18] border border-amber-400/40 rounded-3xl p-5 sm:p-6 text-white flex flex-col max-h-[92vh] shadow-[0_0_80px_rgba(251,191,36,0.2)] relative overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calendar size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  WEEK COMPLETE
                </span>
                <span className="text-xs font-bold text-gray-400">Week {recap.week}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider mt-0.5">
                {recap.dateRangeText}
              </h2>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Top Key Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 relative z-10">
          {/* Net Weekly Change */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
              <DollarSign size={12} className={isPositiveNet ? 'text-emerald-400' : 'text-rose-400'} />
              Net Change
            </span>
            <span className={`text-base font-black mt-0.5 ${isPositiveNet ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositiveNet ? '+' : ''}${recap.finance.netWeeklyChange.toLocaleString()}
            </span>
          </div>

          {/* Energy Restored */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              Energy
            </span>
            <span className="text-base font-black text-amber-300 mt-0.5">
              +{recap.energyRestored} Recharged
            </span>
          </div>

          {/* Living Expenses */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
              <TrendingUp size={12} className="text-rose-400" />
              Expenses Paid
            </span>
            <span className="text-base font-black text-rose-400 mt-0.5">
              {recap.expensesPaid > 0 ? `-$${recap.expensesPaid.toLocaleString()}` : '$0'}
            </span>
          </div>

          {/* Fan Growth */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
              <Users size={12} className="text-sky-400" />
              Fan Growth
            </span>
            <span className="text-base font-black text-sky-400 mt-0.5">
              +{recap.social.fanGrowth.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-white/10 no-scrollbar relative z-10 shrink-0">
          {(
            [
              'ALL',
              'CAREER',
              'FINANCE',
              'SOCIAL',
              'WORLD',
              'NETWORK',
              'EMPIRE',
              'REPRESENTATION',
              'NEXT_WEEK',
            ] as RecapCategoryTab[]
          ).map((tab) => {
            const label = tab === 'NEXT_WEEK' ? 'NEXT WEEK' : tab;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-lg font-black'
                    : 'bg-black/40 text-gray-400 border border-white/5 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Recap Content Sections */}
        <div className="overflow-y-auto space-y-4 pr-1 relative z-10 flex-1">
          {/* 1. CAREER SECTION */}
          {(activeTab === 'ALL' || activeTab === 'CAREER') && (
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  <Clapperboard className="w-4 h-4" />
                  <span>CAREER</span>
                </div>
              </div>
              <div className="space-y-3">
                {renderBulletList([
                  ...recap.career.movies,
                  ...recap.career.series,
                  ...recap.career.auditions,
                  ...recap.career.castingResults,
                  ...recap.career.filmingProgress,
                  ...recap.career.training,
                ])}
              </div>
            </div>
          )}

          {/* 2. FINANCE SECTION */}
          {(activeTab === 'ALL' || activeTab === 'FINANCE') && (
            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  <span>FINANCE & CASH FLOW AUDIT</span>
                </div>
              </div>

              {/* Box Office vs Liquid Earnings Note */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
                <strong className="text-amber-400 block font-bold mb-0.5">🎬 Hollywood Accounting Breakdown:</strong>
                Theatrical Box Office gross (e.g. $100M+) is collected by Film Studios and Theater Chains. Your personal liquid cash inflow comes from: <strong>Contract Salary</strong> (paid during filming), <strong>SAG-AFTRA Residuals</strong> (weekly performance payouts), <strong>Backend Profit Share</strong>, <strong>Sponsorships</strong>, and <strong>Real Estate / Business Dividends</strong>.
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-300">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Film/TV Salary</span>
                    <span className="text-xs font-bold text-emerald-400">${recap.finance.salary.toLocaleString()}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">SAG Residuals</span>
                    <span className="text-xs font-bold text-emerald-400">${((recap.finance as any).residuals || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Backend Profit Share</span>
                    <span className="text-xs font-bold text-emerald-400">${((recap.finance as any).backend || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Streaming Royalties</span>
                    <span className="text-xs font-bold text-emerald-400">${((recap.finance as any).streamingRoyalties || 0).toLocaleString()}</span>
                  </div>
                  {((recap.finance.boxOfficeWeeklyGross || 0) > 0) && (
                    <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/30">
                      <span className="text-[10px] text-amber-300 uppercase font-bold block">Box Office Gross</span>
                      <span className="text-xs font-bold text-amber-400">${(recap.finance.boxOfficeWeeklyGross || 0).toLocaleString()}</span>
                    </div>
                  )}
                  {((recap.finance.endorsementIncome || 0) > 0) && (
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Endorsements</span>
                      <span className="text-xs font-bold text-emerald-400">${(recap.finance.endorsementIncome || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Business Dividends</span>
                    <span className="text-xs font-bold text-emerald-400">${(recap.finance.businessIncome || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Rental Yields</span>
                    <span className="text-xs font-bold text-emerald-400">${(recap.finance.propertyIncome || 0).toLocaleString()}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Expenses</span>
                    <span className="text-xs font-bold text-rose-400">{recap.finance.expenses > 0 ? `-$${recap.finance.expenses.toLocaleString()}` : '$0'}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Net Cash Flow</span>
                    <span className={`text-xs font-black ${recap.finance.netWeeklyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {recap.finance.netWeeklyChange >= 0 ? '+' : ''}${recap.finance.netWeeklyChange.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. SOCIAL SECTION */}
          {(activeTab === 'ALL' || activeTab === 'SOCIAL') && (
            <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sky-400 font-extrabold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>SOCIAL</span>
                </div>
              </div>
              {renderBulletList([
                `Fan Growth: +${recap.social.fanGrowth.toLocaleString()} new fans`,
                ...recap.social.posts,
                ...recap.social.trending,
                ...recap.social.reputationChanges,
              ])}
            </div>
          )}

          {/* 4. WORLD SECTION */}
          {(activeTab === 'ALL' || activeTab === 'WORLD') && (
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  <span>WORLD</span>
                </div>
              </div>
              {renderBulletList([
                ...recap.world.news,
                ...recap.world.tv,
                ...recap.world.radio,
                ...recap.world.streaming,
                ...recap.world.awards,
                ...recap.world.industryEvents,
              ])}
            </div>
          )}

          {/* 5. NETWORK SECTION */}
          {(activeTab === 'ALL' || activeTab === 'NETWORK') && (
            <div className="p-4 rounded-2xl bg-black/40 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>NETWORK</span>
                </div>
              </div>
              {renderBulletList([
                ...recap.network.bank,
                ...recap.network.savings,
                ...recap.network.properties,
                ...recap.network.vehicles,
                ...recap.network.security,
                ...recap.network.vault,
                ...recap.network.forbes,
              ])}
            </div>
          )}

          {/* 6. EMPIRE SECTION */}
          {(activeTab === 'ALL' || activeTab === 'EMPIRE') && (
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                  <Crown className="w-4 h-4" />
                  <span>EMPIRE</span>
                </div>
              </div>
              {renderBulletList([
                ...recap.empire.businesses,
                ...recap.empire.holdingCompany,
                ...recap.empire.eliteClub,
                ...recap.empire.realEstate,
                ...recap.empire.board,
                ...recap.empire.expansion,
              ])}
            </div>
          )}

          {/* 7. REPRESENTATION SECTION */}
          {(activeTab === 'ALL' || activeTab === 'REPRESENTATION') && (
            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>REPRESENTATION</span>
                </div>
              </div>
              {renderBulletList([
                ...recap.representation.pr,
                ...recap.representation.contracts,
                ...recap.representation.media,
                ...recap.representation.brandDeals,
                ...recap.representation.sponsorships,
                ...recap.representation.lawFirm,
              ])}
            </div>
          )}

          {/* 8. COMING NEXT WEEK SECTION */}
          {(activeTab === 'ALL' || activeTab === 'NEXT_WEEK') && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>COMING NEXT WEEK</span>
                </div>
              </div>
              {renderBulletList([
                ...recap.comingNextWeek.upcomingAuditions,
                ...recap.comingNextWeek.moviePremieres,
                ...recap.comingNextWeek.awardShows,
                ...recap.comingNextWeek.contractDeadlines,
                ...recap.comingNextWeek.businessLaunches,
                ...recap.comingNextWeek.propertyPayments,
              ])}
            </div>
          )}
        </div>

        {/* Modal Footer / Continue Action Button */}
        <div className="pt-4 border-t border-white/10 relative z-10 shrink-0">
          <button
            onClick={handleContinue}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONTINUE TO GAMEHOME</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
