/**
 * HOLLYWOOD RISING - Achievements Sub-View
 * Phase 5 Empire Scene: Expanded 70+ achievements, search filter, secret achievements & reward badges.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, EmpireAchievement } from '../../types/empire';
import { Award, Trophy, Lock, CheckCircle2, Sparkles, Star, Search, Filter } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

export const AchievementsView: React.FC<Props> = ({ empireState, onBack }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  const categories = ['ALL', 'Career', 'Business', 'Awards', 'Empire', 'Social Media', 'Money', 'Secret'];

  const allAchievements: EmpireAchievement[] = empireState.achievements || [];

  const filtered = allAchievements.filter((a) => {
    // Category check
    if (filterCategory !== 'ALL' && a.category !== filterCategory) return false;
    // Status check
    if (statusFilter === 'UNLOCKED' && !a.isUnlocked) return false;
    if (statusFilter === 'LOCKED' && a.isUnlocked) return false;
    // Search check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchDesc = a.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const unlockedCount = allAchievements.filter((a) => a.isUnlocked).length;
  const totalCount = allAchievements.length;
  const percentComplete = totalCount > 0 ? Math.floor((unlockedCount / totalCount) * 100) : 0;

  const totalCashEarned = allAchievements
    .filter((a) => a.isUnlocked)
    .reduce((acc, a) => acc + (a.rewardCash || 0), 0);

  const totalFameXpEarned = allAchievements
    .filter((a) => a.isUnlocked)
    .reduce((acc, a) => acc + (a.rewardFameXp || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Empire Achievements</h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Progress</span>
          <span className="text-base font-black text-amber-300 font-mono">
            {unlockedCount} / {totalCount} ({percentComplete}%)
          </span>
        </div>
      </div>

      {/* Overview Stats Banner */}
      <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-black via-gray-900 to-black grid grid-cols-1 md:grid-cols-3 gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">Completed Badges</span>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mt-1">
            <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${percentComplete}%` }} />
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Cash Rewards Claimed</span>
          <span className="text-sm font-black text-emerald-400 font-mono">
            +${totalCashEarned.toLocaleString()}
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Fame XP Claimed</span>
          <span className="text-sm font-black text-amber-300 font-mono">
            +{totalFameXpEarned.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-amber-400 text-black shadow-lg'
                  : 'bg-black/60 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter & Search Input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-bold cursor-pointer outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="UNLOCKED">Unlocked Only</option>
            <option value="LOCKED">Locked Only</option>
          </select>

          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400/50"
            />
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full p-8 rounded-3xl border border-white/10 bg-black/40 text-center text-xs text-gray-400">
            No achievements found matching your search and category filter.
          </div>
        ) : (
          filtered.map((ach) => {
            const isSecret = ach.category === 'Secret' && !ach.isUnlocked;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-3xl border transition-all ${
                  ach.isUnlocked
                    ? 'border-amber-400/50 bg-amber-500/10 shadow-xl'
                    : 'border-white/10 bg-black/50 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {ach.category}
                  </span>

                  {ach.isUnlocked ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked (W{ach.unlockedWeek || 1}, Y{ach.unlockedYear || 2026})
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-black text-white">
                  {isSecret ? '🔒 Secret Achievement' : ach.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  {isSecret ? 'Keep playing to discover this hidden Hollywood achievement.' : ach.description}
                </p>

                {/* Progress bar if numerical */}
                {!ach.isUnlocked && ach.maxProgress > 1 && !isSecret && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                      <span>Progress</span>
                      <span>
                        {(ach.progress || 0).toLocaleString()} / {ach.maxProgress.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.floor(((ach.progress || 0) / ach.maxProgress) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] font-bold text-amber-300 mt-3 pt-2 border-t border-white/5">
                  <span>Reward: +${ach.rewardCash.toLocaleString()}</span>
                  <span>+{ach.rewardFameXp} Fame XP</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
