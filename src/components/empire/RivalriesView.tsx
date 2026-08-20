/**
 * HOLLYWOOD RISING — Rivalries "War Room"
 *
 * Rebuilt design: dossier list + live HEAD-TO-HEAD comparison of the player's
 * REAL career stats (fame XP, fans, social followers, best box office gross,
 * awards) against each rival's locked power block. Every action shows its
 * live win odds before you spend, has a real cooldown, and files real trade
 * coverage into the Hollywood Insider when it lands.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, RivalryNPC, RivalPower, RivalryLevel } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  RIVALRY_ACTIONS,
  RivalryActionType,
  computeActionOdds,
  ensureRivalPower,
  executeRivalryAction,
  getPlayerPower,
  getActionLock,
  spawnRival,
} from '../../services/rivalryService';
import {
  Swords,
  Flame,
  Newspaper,
  ShieldAlert,
  Award,
  Scale,
  TrendingUp,
  Share2,
  Clock,
  Film,
  Zap,
  CheckCircle2,
  PlusCircle,
  Users,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const HEAT_LEVEL_BADGES: Record<RivalryLevel, { color: string; label: string; bar: string }> = {
  Calm: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: '🌱 Calm', bar: 'bg-emerald-500' },
  Tension: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: '⚡ Tension', bar: 'bg-amber-500' },
  Rival: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', label: '⚔️ Rival', bar: 'bg-orange-500' },
  Feud: { color: 'bg-red-500/20 text-red-300 border-red-500/30', label: '🔥 Active Feud', bar: 'bg-red-500' },
  'Arch Rival': { color: 'bg-rose-600/30 text-rose-300 border-rose-500/50', label: '👑 Arch Rival', bar: 'bg-rose-600' },
  'Legendary Rival': { color: 'bg-purple-600/30 text-purple-300 border-purple-500/50', label: '🌌 Legendary', bar: 'bg-purple-500' },
};

function fmtN(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

function fmtMoney(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

const ACCENT_CLASSES: Record<string, string> = {
  sky: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30',
  red: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30',
  amber: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30',
  orange: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30',
  purple: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30',
  emerald: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30',
};

const ACCENT_TEXT: Record<string, string> = {
  sky: 'text-sky-300',
  red: 'text-red-300',
  amber: 'text-amber-300',
  orange: 'text-orange-300',
  purple: 'text-purple-300',
  emerald: 'text-emerald-300',
};

export const RivalriesView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player, releasedMovies, persistNow } = useGame();
  const [selectedRivalId, setSelectedRivalId] = useState<string | null>(
    empireState.rivalries.length > 0 ? empireState.rivalries[0].id : null
  );
  const [activeTab, setActiveTab] = useState<'BATTLE' | 'TIMELINE' | 'PRESS'>('BATTLE');

  // Real career numbers — the same ones the engine rolls against.
  const bestGross = useMemo(
    () => releasedMovies.reduce((mx, m) => Math.max(mx, m.worldwideGross || 0), 0),
    [releasedMovies]
  );
  const playerPower = useMemo(() => getPlayerPower(player, bestGross), [player, bestGross]);

  // Old-save migration: rivals from before the rebuild get a power block
  // snapshotted once from the live player, then saved back.
  useEffect(() => {
    const missing = empireState.rivalries.some((r) => !r.power);
    if (!missing) return;
    const next: EmpireFullState = {
      ...empireState,
      rivalries: empireState.rivalries.map((r) => {
        const copy = { ...r };
        ensureRivalPower(copy, player, bestGross);
        return copy;
      }),
    };
    EmpireService.saveState(next);
    onUpdateState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empireState.rivalries.length]);

  const rivals = empireState.rivalries || [];
  const activeRivals = rivals.filter((r) => !r.resolved);
  const selectedRival = rivals.find((r) => r.id === selectedRivalId) || rivals[0] || null;

  const totalWins = rivals.reduce((a, r) => a + (r.playerWins || 0), 0);
  const totalLosses = rivals.reduce((a, r) => a + (r.rivalWins || 0), 0);
  const totalDraws = rivals.reduce((a, r) => a + (r.draws || 0), 0);
  const avgHeat = activeRivals.length
    ? Math.round(activeRivals.reduce((a, r) => a + (r.rivalryScore || 0), 0) / activeRivals.length)
    : 0;

  const rivalPower: RivalPower | null = selectedRival
    ? ensureRivalPower(selectedRival, player, bestGross)
    : null;

  // ---- handlers ------------------------------------------------------------

  const handleProvokeNewRival = () => {
    const cost = 50000;
    if (player.money < cost) {
      alert('Insufficient funds ($50,000 required to launch a public challenge).');
      return;
    }
    player.money -= cost;
    persistNow();

    const newRival = spawnRival(player, rivals, bestGross, true);
    const updated: EmpireFullState = { ...empireState, rivalries: [newRival, ...rivals] };
    EmpireService.saveState(updated);
    onUpdateState(updated);
    setSelectedRivalId(newRival.id);
    setActiveTab('BATTLE');
    alert(
      `⚔️ CHALLENGE ACCEPTED: ${newRival.name} (${newRival.career})\n\n` +
        `Spark: ${newRival.cause}\n` +
        `Their following: ${fmtN(newRival.power?.followers || 0)} • Their fanbase: ${fmtN(newRival.fansCount)}\n\n` +
        `Open the Battle Plan to see your live odds.`
    );
  };

  const handleExecuteAction = (type: RivalryActionType) => {
    if (!selectedRival) return;
    const result = executeRivalryAction(empireState, player, selectedRival.id, type, bestGross);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    // Apply the real career effects, then persist both sides.
    if (result.fansDelta !== 0) player.fans = Math.max(0, (player.fans || 0) + result.fansDelta);
    if (result.fameXpDelta !== 0) player.fameXp = Math.max(0, (player.fameXp || 0) + result.fameXpDelta);
    if (result.repDelta !== 0) {
      player.publicReputation = Math.min(100, Math.max(0, (player.publicReputation ?? 50) + result.repDelta));
    }
    persistNow();
    EmpireService.saveState(result.state);
    onUpdateState(result.state);
    alert(result.message);
  };

  // ---- render helpers ------------------------------------------------------

  const renderVsRow = (
    label: string,
    icon: React.ReactNode,
    youVal: number,
    themVal: number,
    fmt: (n: number) => string
  ) => {
    const total = Math.max(youVal + themVal, 1);
    const youPct = Math.max(4, Math.round((youVal / total) * 100));
    const themPct = Math.max(4, 100 - youPct);
    const youLead = youVal >= themVal;
    return (
      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 tracking-wider">
            {icon} {label}
          </span>
          <span className={`text-[9px] font-black uppercase ${youLead ? 'text-emerald-400' : 'text-red-400'}`}>
            {youLead ? '▲ YOU LEAD' : '▼ THEY LEAD'}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-emerald-400 w-8 shrink-0">YOU</span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${youPct}%` }} />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-300 w-16 text-right shrink-0">{fmt(youVal)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-red-400 w-8 shrink-0">THEM</span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${themPct}%` }} />
            </div>
            <span className="text-[10px] font-mono font-bold text-red-300 w-16 text-right shrink-0">{fmt(themVal)}</span>
          </div>
        </div>
      </div>
    );
  };

  const scoreBandTicks = [15, 30, 50, 70, 90];

  // ---- render --------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* War Room Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Rivalries</h2>
            <span className="px-2 py-0.5 rounded-lg bg-red-500/20 border border-red-500/40 text-[9px] font-black text-red-300 uppercase tracking-widest">
              War Room
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-center">
            <span className="text-[8px] text-gray-500 uppercase font-black block leading-none">Active</span>
            <span className="text-sm font-black text-white font-mono">{activeRivals.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-center">
            <span className="text-[8px] text-gray-500 uppercase font-black block leading-none">Avg Heat</span>
            <span className="text-sm font-black text-red-300 font-mono">{avgHeat}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-center">
            <span className="text-[8px] text-gray-500 uppercase font-black block leading-none">Record</span>
            <span className="text-sm font-black text-white font-mono">
              {totalWins}W-{totalLosses}L-{totalDraws}D
            </span>
          </div>
          <button
            onClick={handleProvokeNewRival}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            PROVOKE RIVAL ($50K)
          </button>
        </div>
      </div>

      {rivals.length === 0 ? (
        <div className="p-10 rounded-3xl border border-white/10 bg-black/60 text-center space-y-4 shadow-2xl">
          <Flame className="w-16 h-16 text-red-400/60 mx-auto animate-pulse" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider">No Active Hollywood Feuds</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Your slate is clean. Once your Fame XP passes 300, rivals spawn naturally as your career
            threatens theirs — or light the fuse yourself. Rivals are always generated at your level:
            their fame, fans, followers, box office and awards are locked relative to your real
            career file at spawn.
          </p>
          <button
            onClick={handleProvokeNewRival}
            className="px-5 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-black text-xs transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Spark First Feud ($50,000)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Dossier List */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">
              Dossier List ({rivals.length})
            </h3>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {rivals.map((rival) => {
                const isSelected = rival.id === selectedRival?.id;
                const heatInfo = HEAT_LEVEL_BADGES[rival.heatLevel || 'Tension'];
                return (
                  <div
                    key={rival.id}
                    onClick={() => setSelectedRivalId(rival.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-red-500/60 bg-red-500/10 shadow-xl'
                        : rival.resolved
                          ? 'border-white/10 bg-black/40 opacity-60 hover:opacity-90'
                          : 'border-white/10 bg-black/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-red-500/40 bg-gray-900 shrink-0">
                          <img src={rival.avatarUrl} alt={rival.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-white truncate">{rival.name}</h4>
                          <p className="text-[10px] text-gray-400 font-medium truncate">{rival.role} • {rival.career}</p>
                        </div>
                      </div>
                      {rival.resolved ? (
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black border bg-white/10 text-gray-300 border-white/20 shrink-0">
                          ✓ RESOLVED
                        </span>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border shrink-0 ${heatInfo.color}`}>
                          {heatInfo.label}
                        </span>
                      )}
                    </div>
                    {!rival.resolved && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                          <span className="text-gray-500">HEAT SCORE</span>
                          <span className="text-red-300">{rival.rivalryScore}/100</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full ${heatInfo.bar}`} style={{ width: `${rival.rivalryScore}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-gray-500">
                            H2H {rival.playerWins || 0}-{rival.rivalWins || 0}-{rival.draws || 0}
                          </span>
                          <span className="text-gray-500">since W{rival.weekStarted} Y{rival.yearStarted}</span>
                        </div>
                      </div>
                    )}
                    {rival.resolved && (
                      <p className="text-[10px] text-gray-500 italic truncate">{rival.resolution || 'Feud concluded.'}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detail Dossier */}
          {selectedRival && rivalPower && (
            <div className="lg:col-span-2 space-y-4">
              {/* Profile Card */}
              <div className="p-6 rounded-3xl border border-red-500/30 bg-gradient-to-br from-black via-gray-900 to-black space-y-4 shadow-2xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-red-500/50 bg-gray-900 shrink-0 shadow-lg">
                      <img src={selectedRival.avatarUrl} alt={selectedRival.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{selectedRival.name}</h3>
                      <p className="text-xs text-gray-400 font-medium">
                        {selectedRival.role} • {selectedRival.career}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                        Feud since Week {selectedRival.weekStarted}, {selectedRival.yearStarted} • Root cause:{' '}
                        <span className="text-red-300 font-bold">{selectedRival.cause}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1.5">
                    <span className={`px-3 py-1 rounded-xl text-[11px] font-black border inline-block ${HEAT_LEVEL_BADGES[selectedRival.heatLevel || 'Tension'].color}`}>
                      {HEAT_LEVEL_BADGES[selectedRival.heatLevel || 'Tension'].label}
                    </span>
                    <p className="text-[9px] text-gray-500 uppercase font-black">
                      H2H {selectedRival.playerWins || 0}W-{selectedRival.rivalWins || 0}L-{selectedRival.draws || 0}D
                    </p>
                  </div>
                </div>

                {/* Heat gauge with real band ticks */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase text-gray-500">
                    <span>Feud Intensity — {selectedRival.rivalryScore}/100</span>
                    <span className="font-mono">
                      {selectedRival.resolved
                        ? 'RESOLVED'
                        : (selectedRival.cooldownUntilWeek || 0) > player.dateWeek
                          ? `ACTIONS LOCKED UNTIL W${selectedRival.cooldownUntilWeek}`
                          : 'ACTIONS READY'}
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full ${HEAT_LEVEL_BADGES[selectedRival.heatLevel || 'Tension'].bar} transition-all`}
                      style={{ width: `${selectedRival.rivalryScore}%` }}
                    />
                    {scoreBandTicks.map((t) => (
                      <div key={t} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${t}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-gray-600">
                    <span>CALM</span><span>TENSION</span><span>RIVAL</span><span>FEUD</span><span>ARCH</span><span>LEGEND</span>
                  </div>
                </div>

                {/* HEAD-TO-HEAD: live from the career file */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-red-400" /> Head-to-Head
                    </h4>
                    <span className="text-[8px] text-gray-600 font-mono uppercase">Live from your career file</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {renderVsRow('Fame XP', <Flame className="w-3 h-3 text-amber-400" />, playerPower.fame, rivalPower.fame, fmtN)}
                    {renderVsRow('Fans', <Users className="w-3 h-3 text-sky-400" />, playerPower.fans, rivalPower.fans, fmtN)}
                    {renderVsRow('Social Followers', <Share2 className="w-3 h-3 text-emerald-400" />, playerPower.followers, rivalPower.followers, fmtN)}
                    {renderVsRow('Best Box Office', <Film className="w-3 h-3 text-red-400" />, playerPower.boxOffice, rivalPower.boxOffice, fmtMoney)}
                    {renderVsRow('Awards Won', <Award className="w-3 h-3 text-purple-400" />, playerPower.awards, rivalPower.awards, fmtN)}
                    {renderVsRow(
                      'Last Move',
                      <Clock className="w-3 h-3 text-gray-400" />,
                      player.dateWeek - (selectedRival.lastEventWeek ?? selectedRival.weekStarted),
                      selectedRival.nextStrikeWeek ? selectedRival.nextStrikeWeek - player.dateWeek : 0,
                      (n) => `${Math.max(0, n)}w`
                    )}
                  </div>
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  {(['BATTLE', 'TIMELINE', 'PRESS'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        activeTab === tab ? 'bg-red-500 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab === 'BATTLE' ? '⚔️ Battle Plan' : tab === 'TIMELINE' ? `📜 Timeline (${selectedRival.timeline?.length || 0})` : '📱 Press'}
                    </button>
                  ))}
                </div>

                {/* Tab: Battle Plan — real odds, real locks */}
                {activeTab === 'BATTLE' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider">Strategic Actions</h4>
                      <span className="text-[9px] text-gray-500 font-mono">
                        Wallet: <span className="text-emerald-300 font-bold">{fmtMoney(player.money)}</span> • 2-week cooldown per rival
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {RIVALRY_ACTIONS.map((action) => {
                        const odds = computeActionOdds(playerPower, rivalPower, action.type, {
                          criticRep: player.criticReputation,
                          industryRespect: player.industryRespect,
                          netWorth: player.netWorth,
                        });
                        const lock = getActionLock(selectedRival, action.type, playerPower, player.dateWeek);
                        const noFunds = player.money < action.cost;
                        const disabled = !!lock || noFunds || selectedRival.resolved;
                        return (
                          <button
                            key={action.type}
                            onClick={() => !disabled && handleExecuteAction(action.type)}
                            className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all group ${
                              disabled
                                ? 'bg-black/40 border-white/5 opacity-50 cursor-not-allowed'
                                : `${ACCENT_CLASSES[action.accent]} cursor-pointer`
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-xs font-black ${ACCENT_TEXT[action.accent]}`}>
                                {action.emoji} {action.label}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono font-bold">{fmtMoney(action.cost)}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-snug">{action.blurb}</p>
                            <div className="flex items-center justify-between pt-0.5">
                              {action.type === 'TRUCE_SUMMIT' ? (
                                <span className="text-[10px] font-black text-emerald-300 font-mono">GUARANTEED COOL-DOWN</span>
                              ) : (
                                <span className="text-[10px] font-black font-mono text-gray-300">
                                  WIN ODDS:{' '}
                                  <span className={odds >= 0.55 ? 'text-emerald-300' : odds >= 0.4 ? 'text-amber-300' : 'text-red-300'}>
                                    {Math.round(odds * 100)}%
                                  </span>
                                </span>
                              )}
                              {lock ? (
                                <span className="text-[9px] font-bold text-amber-300/80 uppercase">🔒 {lock}</span>
                              ) : noFunds ? (
                                <span className="text-[9px] font-bold text-red-300/80 uppercase">🔒 Need {fmtMoney(action.cost)}</span>
                              ) : selectedRival.resolved ? (
                                <span className="text-[9px] font-bold text-gray-400 uppercase">🔒 Feud over</span>
                              ) : (
                                <span className="text-[9px] font-black text-gray-500 uppercase group-hover:text-white transition-colors">
                                  Execute →
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        Odds are computed live from your real fame, followers, box office gross, awards and reputation
                        against this rival's locked stats — nothing is hidden and nothing is faked. Wins pay fans,
                        Fame XP and reputation; losses hand the round to {selectedRival.name} and heat climbs.
                        Rivals at Feud heat or higher strike back on their own schedule between weeks.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab: Timeline */}
                {activeTab === 'TIMELINE' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider">Chronological Feud Timeline</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {selectedRival.timeline && selectedRival.timeline.length > 0 ? (
                        selectedRival.timeline.map((ev) => (
                          <div key={ev.id} className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-start gap-3 text-xs">
                            <span className="text-[10px] text-red-400 font-mono font-bold shrink-0 pt-0.5">W{ev.week}, Y{ev.year}</span>
                            <div>
                              <p className="text-white font-medium">{ev.eventText}</p>
                              <span className="text-[9px] text-gray-400 uppercase font-bold">{ev.category || 'General'} Event</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 italic">No timeline events recorded yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Press */}
                {activeTab === 'PRESS' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5 text-red-400" /> Industry Media & Social Sentiment
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                        <span className="text-[9px] text-gray-400 uppercase font-bold block">Trending Hashtag</span>
                        <span className="text-sm font-black text-sky-300">
                          {selectedRival.socialMediaActivity?.trendingHashtag || `#${selectedRival.name.replace(/\s+/g, '')}`}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                        <span className="text-[9px] text-gray-400 uppercase font-bold block">Public Sentiment</span>
                        <span className="text-sm font-black text-rose-300">{selectedRival.socialMediaActivity?.sentiment || 'Hostile'}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                        <span className="text-[9px] text-gray-400 uppercase font-bold block">Their Following</span>
                        <span className="text-sm font-black text-white font-mono">{fmtN(selectedRival.socialMediaActivity?.followersCount || 0)}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/5 space-y-1">
                        <span className="text-[9px] text-gray-400 uppercase font-bold block">Studio Reaction</span>
                        <span className="text-sm font-black text-white">{selectedRival.studioReaction || 'Monitoring'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                      <span className="text-[10px] text-red-400 font-black uppercase block">Latest Trade Headlines</span>
                      <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                        {selectedRival.mediaHeadlines && selectedRival.mediaHeadlines.length > 0 ? (
                          selectedRival.mediaHeadlines.map((hl, idx) => <li key={idx}>{hl}</li>)
                        ) : (
                          <li>Hollywood Reporter: "Studio executives closely monitoring public feud dynamics."</li>
                        )}
                      </ul>
                      <p className="text-[9px] text-gray-600 font-mono pt-1">
                        Big results also file full articles into the Hollywood Insider.
                      </p>
                    </div>

                    {(selectedRival.legalHistory?.length || 0) > 0 && (
                      <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/20 space-y-1.5">
                        <span className="text-[10px] text-purple-300 font-black uppercase flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5" /> Legal History
                        </span>
                        <ul className="space-y-1 text-xs text-gray-300 list-disc list-inside">
                          {selectedRival.legalHistory.map((lh, idx) => <li key={idx}>{lh}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Resolution banner */}
              {selectedRival.resolved && (
                <div className="p-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-emerald-300 uppercase">Feud Resolved</p>
                    <p className="text-xs text-gray-400">
                      {selectedRival.resolution || 'The press moved on.'} Final record:{' '}
                      {selectedRival.playerWins || 0}W-{selectedRival.rivalWins || 0}L-{selectedRival.draws || 0}D.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
