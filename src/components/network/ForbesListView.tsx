/**
 * HOLLYWOOD RISING - Forbes List View (Living World Edition)
 * 120 real-named NPC fortunes drift weekly; rankings reshuffle; the #1 crown
 * changes hands. The player's entry is their REAL in-game net worth with a
 * full transparent breakdown — no invented numbers anywhere.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  NetworkService,
  buildForbesLeaderboard,
  getWealthBreakdown,
} from '../../services/networkService';
import type { ForbesCelebrity } from '../../types/network';
import {
  Trophy,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Target,
  Flame,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface ForbesListViewProps {
  onBack: () => void;
}

const fmtWorth = (v: number): string =>
  v >= 1000000000 ? `$${(v / 1000000000).toFixed(1)}B`
  : v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M`
  : `$${Math.round(v / 1000)}K`;

const Movement: React.FC<{ entry: ForbesCelebrity }> = ({ entry }) => {
  if (entry.prevNetWorth === undefined || entry.prevNetWorth === entry.netWorth) {
    return <span className="flex items-center gap-0.5 text-[9px] font-black text-gray-500"><Minus className="w-3 h-3" />0</span>;
  }
  const delta = entry.netWorth - entry.prevNetWorth;
  const up = delta > 0;
  return (
    <span className={`flex items-center gap-0.5 text-[9px] font-black ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {fmtWorth(Math.abs(delta))}
    </span>
  );
};

export const ForbesListView: React.FC<ForbesListViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // Real leaderboard from the persisted living world + player's real net worth
  const state = NetworkService.loadState(player);
  const breakdown = getWealthBreakdown(state, player.money);
  const board = buildForbesLeaderboard(state, `${player.firstName} ${player.lastName}`, Math.max(0, breakdown.total));

  const playerDelta = board.playerEntry.netWorth - board.playerPrevNet;
  const onList = board.playerWorldRank <= 100;

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
        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          Forbes Global Wealth Index
        </span>
      </div>

      {/* THE #1 RACE — competitive crown banner */}
      <div className="p-4 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-black/60 to-black/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">The Race for #1</span>
          </div>
          <span className="text-[9px] font-black text-amber-200/80 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            Crown changed {board.leaderChanges}× this year
          </span>
        </div>
        <div className="flex items-center justify-between bg-black/50 rounded-2xl px-3 py-2 border border-white/10">
          <div>
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Current World #1</span>
            <span className="text-sm font-black text-white">{board.no1Name}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Your World Rank</span>
            <span className="text-lg font-black text-amber-400">#{board.playerWorldRank} / {121}</span>
          </div>
        </div>
        {board.gapToNext ? (
          <p className="text-[10px] text-gray-300 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            Pass <b className="text-white">{board.gapToNext.name}</b> with <b className="text-emerald-400">+{fmtWorth(board.gapToNext.amount)}</b> more net worth.
          </p>
        ) : (
          <p className="text-[10px] text-amber-300 font-black flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" /> You are the richest person in the world.
          </p>
        )}
      </div>

      {/* PLAYER CARD — REAL net worth with full transparent breakdown */}
      <div className="p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-black to-black space-y-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase">Your Forbes Wealth Profile {onList ? '' : '(Outside Top 100)'}</span>
            <h2 className="text-lg font-black text-white">{player.firstName} {player.lastName}</h2>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-300">#{board.playerWorldRank}</span>
            <div className="flex justify-end mt-0.5">
              {playerDelta > 0 ? (
                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{fmtWorth(playerDelta)} this week</span>
              ) : playerDelta < 0 ? (
                <span className="text-[10px] font-black text-red-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" />{fmtWorth(-playerDelta)} this week</span>
              ) : (
                <span className="text-[10px] font-black text-gray-500">No change this week</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-black/60 p-3 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex justify-between text-[10px] font-extrabold border-b border-white/10 pb-1.5">
            <span className="text-gray-400 uppercase tracking-wider">Verified Net Worth Breakdown</span>
            <span className="text-emerald-400 font-black">{fmtWorth(breakdown.total)}</span>
          </div>
          {([
            ['Liquid Cash', breakdown.cash],
            ['Bank, Savings & Investments', breakdown.bank],
            ['Real Estate', breakdown.properties],
            ['Vehicles', breakdown.vehicles],
            ['Vault Collectibles', breakdown.vault],
            ['Business Empire', breakdown.empire],
            ['Debt & Mortgages', -breakdown.debt],
          ] as [string, number][]).filter(([, v]) => v !== 0).map(([label, v]) => (
            <div key={label} className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-500">{label}</span>
              <span className={v < 0 ? 'text-red-400 font-mono' : 'text-gray-200 font-mono'}>{v < 0 ? '−' : ''}{fmtWorth(Math.abs(v))}</span>
            </div>
          ))}
          <p className="text-[8.5px] text-gray-600 pt-1">Every dollar is pulled live from your game accounts and assets — nothing is estimated or simulated.</p>
        </div>
      </div>

      {/* RANK PROGRESSION MILESTONES */}
      <div className="p-4 rounded-3xl border border-amber-500/30 bg-black/60 space-y-2.5">
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
          Forbes Milestone Rank Progression
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center text-[10px] font-black">
          {[
            { label: 'Debut', target: 121 },
            { label: 'Top 100', target: 100 },
            { label: 'Top 50', target: 50 },
            { label: 'Top 25', target: 25 },
            { label: 'Top 10', target: 10 },
            { label: 'Top 5', target: 5 },
            { label: '#1 World', target: 1 },
          ].map((milestone) => {
            const isAchieved = board.playerWorldRank <= milestone.target;
            return (
              <div
                key={milestone.label}
                className={`p-2 rounded-xl border transition-all ${
                  isAchieved
                    ? 'bg-amber-400 text-black border-amber-400 font-black shadow-md'
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

      {/* THE LIVING LIST */}
      <div className="space-y-2">
        <h2 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Top 100 Richest — Live Rankings
        </h2>

        {/* If player is outside the top 100, pin their row at the top of the list */}
        {!onList && (
          <div className="p-3.5 rounded-2xl border border-emerald-400/60 bg-emerald-500/10 flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-400 text-black font-black flex items-center justify-center text-xs shrink-0">#{board.playerWorldRank}</span>
              <div>
                <h3 className="font-black text-white flex items-center gap-1">
                  {player.firstName} {player.lastName}
                  <span className="text-[9px] bg-emerald-400 text-black font-black px-1.5 rounded">YOU</span>
                </h3>
                <span className="text-[10px] text-gray-400">Actor • Climb into the Top 100 to appear on the official list</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-black text-sm block">{fmtWorth(board.playerEntry.netWorth)}</span>
              <Movement entry={board.playerEntry} />
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {board.list.map((celeb) => {
            const moved = celeb.prevNetWorth !== undefined && celeb.prevNetWorth !== celeb.netWorth;
            return (
              <div
                key={`${celeb.rank}_${celeb.name}`}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                  celeb.isPlayer
                    ? 'border-emerald-400 bg-emerald-500/15 shadow-lg'
                    : celeb.event
                    ? 'border-amber-400/30 bg-black/50'
                    : 'border-white/10 bg-black/50 hover:bg-black/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs shrink-0 ${
                      celeb.rank === 1
                        ? 'bg-amber-400 text-black'
                        : celeb.rank <= 3
                        ? 'bg-amber-200 text-black'
                        : celeb.isPlayer
                        ? 'bg-emerald-400 text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    #{celeb.rank}
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-black text-white flex items-center gap-1 truncate">
                      {celeb.rank === 1 && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                      {celeb.name}
                      {celeb.isPlayer && (
                        <span className="text-[9px] bg-emerald-400 text-black font-black px-1.5 rounded shrink-0">YOU</span>
                      )}
                    </h3>
                    <span className="text-[10px] text-gray-400 truncate block">{celeb.category} • {celeb.topAsset}</span>
                    {celeb.event && (
                      <span className={`text-[9px] font-bold block truncate ${moved && celeb.netWorth > (celeb.prevNetWorth || 0) ? 'text-emerald-300' : 'text-red-300'}`}>
                        ⚡ {celeb.event}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-emerald-400 font-black text-sm block">{fmtWorth(celeb.netWorth)}</span>
                  <Movement entry={celeb} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
