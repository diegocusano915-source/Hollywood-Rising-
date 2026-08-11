/**
 * HOLLYWOOD RISING - Talent Agents OR Personal Managers (separate screens)
 * Rendered by section prop:
 *   - section="agents"   -> ONLY the Talent Agents marketplace
 *   - section="managers" -> ONLY the Personal Managers marketplace
 * No tabs, no mixing. Cards are locked until requirements are met.
 *   - Talent Agent    : 4 Principal Roles OR 4 Movies Released
 *   - Personal Manager: 8 Lead Roles OR 8 Movies Released + 3,000 Fame XP
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { AgentInfo, ManagerInfo } from '../../types/game';
import { RepresentationFullState } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { THEMES } from '../../theme/colors';
import {
  ArrowLeft,
  Star,
  Lock,
  Check,
  Crown,
  Zap,
  DollarSign,
  Calendar,
  UserCheck,
  X,
  Sparkles,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

interface AgentsManagersViewProps {
  section: 'agents' | 'managers';
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

const TIER_BADGES: Record<number, { label: string; cls: string }> = {
  1: { label: 'TIER 1 · BOUTIQUE', cls: 'bg-gray-500/20 text-gray-300 border-gray-500/40' },
  2: { label: 'TIER 2 · MID-MARKET', cls: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  3: { label: 'TIER 3 · MAJOR', cls: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  4: { label: 'TIER 4 · ELITE', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
};

export const AgentsManagersView: React.FC<AgentsManagersViewProps> = ({ section, representationState, onRefresh, onBack }) => {
  const { player, signAgentContract, hireManager, terminateRepresentation, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const isAgents = section === 'agents';
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [managers, setManagers] = useState<ManagerInfo[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Unlock requirements
  const principalCount = player.principalRolesCount || 0;
  const leadCount = player.leadRolesCount || 0;
  const moviesCount = player.moviesCompleted || 0;
  const fameXp = player.fameXp || 0;

  const agentUnlocked = principalCount + moviesCount >= 4;
  const managerUnlocked = leadCount + moviesCount >= 8 && fameXp >= 3000;
  const unlocked = isAgents ? agentUnlocked : managerUnlocked;

  const currentAgent = player.representation?.agent;
  const currentManager = player.representation?.manager;
  const current = isAgents ? currentAgent : currentManager;

  const refresh = () => {
    if (isAgents) setAgents(RepresentationService.getWeeklyAgents());
    else setManagers(RepresentationService.getWeeklyManagers());
    onRefresh();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleHireAgent = (agent: AgentInfo) => {
    const res = signAgentContract(agent);
    showFeedback(res.message);
    if (res.success) refresh();
  };

  const handleHireManager = (mgr: ManagerInfo) => {
    const totalCost = Math.floor(((mgr.yearlySalary || 0) * (mgr.contractLengthWeeks || 52)) / 52);
    if (!window.confirm(`Sign with ${mgr.name} (${mgr.company})?\n\n• Salary: $${(mgr.yearlySalary || 0).toLocaleString()}/yr\n• Total paid upfront: $${totalCost.toLocaleString()}\n• Contract: ${((mgr.contractLengthWeeks || 52) / 52).toFixed(1)} year(s)\n• Breach penalty: $${(mgr.breachPenalty || 0).toLocaleString()}`)) {
      return;
    }
    const res = hireManager(mgr);
    showFeedback(res.message);
    if (res.success) refresh();
  };

  const handleFire = () => {
    const kind = isAgents ? ('agent' as const) : ('manager' as const);
    const weeksLeft = current?.weeksRemaining || 0;
    const penalty = weeksLeft > 0 ? current?.breachPenalty || 0 : 0;
    if (!window.confirm(
      penalty > 0
        ? `Break your contract with ${current?.name}?\n\n⚠️ ${weeksLeft} weeks remaining → breach penalty: $${penalty.toLocaleString()}`
        : `Your contract with ${current?.name} has completed its term. Terminate with no penalty?`
    )) {
      return;
    }
    const res = terminateRepresentation(kind);
    showFeedback(res.message);
    if (res.success) refresh();
  };

  const agentInterested = (agent: AgentInfo) => fameXp >= (agent.minFameXp || 0);
  const managerInterested = (mgr: ManagerInfo) =>
    fameXp >= (mgr.tier === 4 ? 8000 : mgr.tier === 3 ? 3000 : 0);

  return (
    <div className="space-y-6 text-white select-none pb-12">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-black text-center shadow">
          {feedback}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Representation</span>
        </button>
        <div className="flex items-center gap-2">
          {isAgents ? (
            <Star className="w-5 h-5 text-amber-400" />
          ) : (
            <Crown className="w-5 h-5 text-purple-400" />
          )}
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            {isAgents ? 'TALENT AGENTS' : 'PERSONAL MANAGERS'}
          </h2>
        </div>
      </div>

      {isAgents ? (
        <div className="space-y-5">
          {/* LOCKED REQUIREMENT CARD (always visible) */}
          {!agentUnlocked && (
            <div className="p-6 rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-black/70 to-black/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40">
                  <Lock className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">Talent Agents — Locked</h2>
                  <p className="text-xs text-gray-400">Complete the requirements below to unlock the agent marketplace.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border ${principalCount >= 4 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Principal Roles</p>
                  <p className="text-xl font-black text-white">{principalCount} / 4</p>
                  {principalCount >= 4 && <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Satisfied</p>}
                </div>
                <div className={`p-4 rounded-2xl border ${moviesCount >= 4 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Movies Released</p>
                  <p className="text-xl font-black text-white">{moviesCount} / 4</p>
                  {moviesCount >= 4 && <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Satisfied</p>}
                </div>
                <div className="p-4 rounded-2xl border border-white/10 bg-black/40 flex items-center">
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Unlock: <strong className="text-white">4 Principal Roles OR 4 Movies Released</strong> — whichever you reach first.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CURRENT CONTRACT */}
          {currentAgent?.signed && (
            <div className="p-5 rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-950/40 via-black/70 to-black/70 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <img src={currentAgent.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400/50" />
                  <div>
                    <p className="text-sm font-black text-white">{currentAgent.name}</p>
                    <p className="text-[10px] text-amber-300 font-bold uppercase">{currentAgent.agencyName} · {currentAgent.specialty}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> YOUR AGENT
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Commission</span>
                  <span className="font-black text-white">{currentAgent.commissionPercent}%</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Contract Left</span>
                  <span className="font-black text-white">{currentAgent.weeksRemaining ?? 0} wks</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Lead Flow</span>
                  <span className="font-black text-white">1 / {currentAgent.leadFlowWeeks || 5} wks</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Deal Cap</span>
                  <span className="font-black text-white">${((currentAgent.dealCap || 0) / 1000000).toFixed(0)}M</span>
                </div>
              </div>
              <button
                onClick={handleFire}
                className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5" /> Terminate Contract
              </button>
            </div>
          )}

          {/* MARKETPLACE — only when unlocked */}
          {agentUnlocked && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Weekly Agent Pool
                </h3>
                <span className="text-[10px] text-gray-500 font-bold">10 shown · 28 total · refreshes weekly</span>
              </div>

              {agents.length === 0 && <p className="text-xs text-gray-500 text-center py-8">No agents available this week. Check back next week.</p>}

              {agents.map((agent) => {
                const badge = TIER_BADGES[agent.tier || 1];
                const interested = agentInterested(agent);
                return (
                  <div key={agent.id} className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <img src={agent.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20" />
                        <div>
                          <p className="text-sm font-black text-white">{agent.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{agent.agencyName} · {agent.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black ${badge.cls}`}>{badge.label}</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] font-black text-amber-300 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> {agent.rating}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Agent Cut</span>
                        <span className="font-black text-white">{agent.commissionPercent}%</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Budget Range</span>
                        <span className="font-black text-white">up to ${((agent.dealCap || 0) / 1000000).toFixed(0)}M</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Fan Bonus</span>
                        <span className="font-black text-emerald-300">+{agent.fanBonusPercent}%</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Negotiation</span>
                        <span className="font-black text-cyan-300">+{agent.negotiationBonus}%</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Residual Bonus</span>
                        <span className="font-black text-white">+{agent.residualBonusPercent}%</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Royalty Range</span>
                        <span className="font-black text-white">{agent.royaltyRangeText || '—'}</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Lead Flow</span>
                        <span className="font-black text-white">1 / {agent.leadFlowWeeks} wks</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Breach Penalty</span>
                        <span className="font-black text-rose-300">${(agent.breachPenalty || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Contract: {((agent.contractLengthWeeks || 52) / 52).toFixed(1)} yr(s) · {agent.perks}
                      </p>
                      {interested ? (
                        <button
                          onClick={() => handleHireAgent(agent)}
                          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" /> Hire Agent
                        </button>
                      ) : (
                        <span className="px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-[10px] font-black text-gray-400 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5" /> Not interested — reach {agent.minFameXp?.toLocaleString()} Fame XP
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* LOCKED REQUIREMENT CARD */}
          {!managerUnlocked && (
            <div className="p-6 rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-black/70 to-black/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40">
                  <Lock className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">Personal Managers — Locked</h2>
                  <p className="text-xs text-gray-400">Managers handle your money, franchises, sponsorships and interviews. Complete the requirements to unlock.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border ${leadCount >= 8 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Lead Roles</p>
                  <p className="text-xl font-black text-white">{leadCount} / 8</p>
                  {leadCount >= 8 && <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Satisfied</p>}
                </div>
                <div className={`p-4 rounded-2xl border ${moviesCount >= 8 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Movies Released</p>
                  <p className="text-xl font-black text-white">{moviesCount} / 8</p>
                  {moviesCount >= 8 && <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Satisfied</p>}
                </div>
                <div className={`p-4 rounded-2xl border ${fameXp >= 3000 ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Fame XP</p>
                  <p className="text-xl font-black text-white">{fameXp.toLocaleString()} / 3,000</p>
                  {fameXp >= 3000 && <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Satisfied</p>}
                </div>
              </div>
              <p className="text-[10px] text-gray-500">
                Unlock: <strong className="text-white">8 Lead Roles OR 8 Movies Released</strong> + <strong className="text-white">3,000 Fame XP</strong>.
              </p>
            </div>
          )}

          {/* CURRENT CONTRACT */}
          {currentManager?.signed && (
            <div className="p-5 rounded-3xl border-2 border-purple-400/60 bg-gradient-to-br from-purple-950/40 via-black/70 to-black/70 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <img src={currentManager.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-400/50" />
                  <div>
                    <p className="text-sm font-black text-white">{currentManager.name}</p>
                    <p className="text-[10px] text-purple-300 font-bold uppercase">{currentManager.company} · {currentManager.specialty}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> YOUR MANAGER
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Salary (upfront)</span>
                  <span className="font-black text-white">${(currentManager.yearlySalary || 0).toLocaleString()}/yr</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Contract Left</span>
                  <span className="font-black text-white">{currentManager.weeksRemaining ?? 0} wks</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Deal Cap</span>
                  <span className="font-black text-white">${((currentManager.dealCap || 0) / 1000000).toFixed(0)}M</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <span className="text-[9px] text-gray-500 uppercase font-bold block">Cut on sourced deals</span>
                  <span className="font-black text-white">{currentManager.commissionPercent}%</span>
                </div>
              </div>
              <button
                onClick={handleFire}
                className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5" /> Terminate Contract
              </button>
            </div>
          )}

          {/* MARKETPLACE — only when unlocked */}
          {managerUnlocked && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Weekly Manager Pool
                </h3>
                <span className="text-[10px] text-gray-500 font-bold">10 shown · 28 total · refreshes weekly</span>
              </div>

              {managers.length === 0 && <p className="text-xs text-gray-500 text-center py-8">No managers available this week. Check back next week.</p>}

              {managers.map((mgr) => {
                const badge = TIER_BADGES[mgr.tier || 1];
                const totalCost = Math.floor(((mgr.yearlySalary || 0) * (mgr.contractLengthWeeks || 52)) / 52);
                const interested = managerInterested(mgr);
                return (
                  <div key={mgr.id} className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <img src={mgr.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20" />
                        <div>
                          <p className="text-sm font-black text-white">{mgr.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{mgr.company} · {mgr.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg border text-[9px] font-black ${badge.cls}`}>{badge.label}</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] font-black text-purple-300 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> {mgr.rating}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Salary / Year</span>
                        <span className="font-black text-white">${(mgr.yearlySalary || 0).toLocaleString()}</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Paid Upfront</span>
                        <span className="font-black text-purple-300">${totalCost.toLocaleString()}</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Deal Cap</span>
                        <span className="font-black text-emerald-300">${((mgr.dealCap || 0) / 1000000).toFixed(0)}M</span>
                      </div>
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">Sourced Cut</span>
                        <span className="font-black text-white">{mgr.commissionPercent}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        Contract: {((mgr.contractLengthWeeks || 52) / 52).toFixed(1)} yr(s) · Breach: ${(mgr.breachPenalty || 0).toLocaleString()} · {mgr.perks}
                      </p>
                      {interested ? (
                        <button
                          onClick={() => handleHireManager(mgr)}
                          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <DollarSign className="w-4 h-4" /> Hire Manager
                        </button>
                      ) : (
                        <span className="px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-[10px] font-black text-gray-400 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5" /> Not interested yet — keep building your fame
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer explanation */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-[10px] text-gray-500 leading-relaxed space-y-1">
        <p className="font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
          {isAgents ? <Star className="w-3.5 h-3.5 text-amber-400" /> : <Crown className="w-3.5 h-3.5 text-purple-400" />}
          How {isAgents ? 'agents' : 'managers'} work
        </p>
        {isAgents ? (
          <>
            <p>• <strong className="text-gray-300">Agents</strong> auto-submit you to real Callboard roles (1 every few weeks by tier), take a % commission from your acting salaries, and unlock brand endorsements. Elite agents demand high Fame XP before they'll take you on.</p>
            <p>• Breaking a contract early = breach penalty. When contracts end at term, no penalty.</p>
          </>
        ) : (
          <>
            <p>• <strong className="text-gray-300">Managers</strong> negotiate your franchise/sequel deals with studios, source corporate sponsorships (Nike, Mercedes, Omega), and handle bankroll & interviews. Salary is paid <strong className="text-gray-300">upfront</strong> for the full contract term.</p>
            <p>• Breaking a contract early = breach penalty. When contracts end at term, no penalty.</p>
          </>
        )}
      </div>
    </div>
  );
};
