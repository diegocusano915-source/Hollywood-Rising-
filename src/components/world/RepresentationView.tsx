/**
 * HOLLYWOOD RISING - Representation View (World Ecosystem)
 * Comprehensive page for Talent Agents & Personal Managers with SAG + 4 Lead Roles progression locking.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AgentInfo } from '../../types/game';
import {
  Briefcase,
  UserCheck,
  Building2,
  DollarSign,
  ArrowLeft,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  XCircle,
  UserPlus,
  UserMinus,
  Star,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface RepresentationViewProps {
  onBack: () => void;
}

export interface LocalAgent extends AgentInfo {
  id: string;
  name: string;
  agencyName: string;
  avatarUrl: string;
  commissionPercent: number;
  minTalentAverage: number;
  minLeadRoles: number;
  minFameXp: number;
  perks: string;
  signed: boolean;
}

export interface LocalManager {
  id: string;
  name: string;
  company: string;
  avatarUrl: string;
  commissionPercent: number;
  weeklyCost: number;
  rating: number;
  benefits: string;
  contractWeeksRemaining: number;
  signed: boolean;
}

const AVAILABLE_AGENTS: LocalAgent[] = [
  {
    id: 'ag_caa_1',
    name: 'Ari Gold',
    agencyName: 'CAA Talent Agency',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop',
    commissionPercent: 10,
    minTalentAverage: 0,
    minLeadRoles: 4,
    minFameXp: 100,
    perks: 'Top-tier studio submissions & +15% salary negotiation',
    signed: false,
  },
  {
    id: 'ag_wme_1',
    name: 'Michael Ovitz',
    agencyName: 'WME Agency',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    commissionPercent: 12,
    minTalentAverage: 0,
    minLeadRoles: 4,
    minFameXp: 150,
    perks: 'Global blockbuster franchise packaging & +20% salary negotiation',
    signed: false,
  },
  {
    id: 'ag_uta_1',
    name: 'Bryan Lourd',
    agencyName: 'UTA (United Talent Agency)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    commissionPercent: 10,
    minTalentAverage: 0,
    minLeadRoles: 4,
    minFameXp: 120,
    perks: 'Prestige indie studio relationships & festival premier priority',
    signed: false,
  },
];

const AVAILABLE_MANAGERS: LocalManager[] = [
  {
    id: 'mgr_sterling_1',
    name: 'Sterling Management',
    company: 'Sterling Global',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    commissionPercent: 15,
    weeklyCost: 1500,
    rating: 4.8,
    benefits: 'Schedules TV/Radio interviews, Bankroll financing discovery & Press campaigns',
    contractWeeksRemaining: 52,
    signed: false,
  },
  {
    id: 'mgr_beverly_1',
    name: 'Beverly Hills Personal Management',
    company: 'Beverly Talent Group',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop',
    commissionPercent: 15,
    weeklyCost: 2500,
    rating: 4.9,
    benefits: 'Elite PR crises control, A-list award campaigns & studio co-finance opportunities',
    contractWeeksRemaining: 52,
    signed: false,
  },
];

import { HollywoodInsiderView } from '../representation/HollywoodInsiderView';
import { Newspaper } from 'lucide-react';

export const RepresentationView: React.FC<RepresentationViewProps> = ({ onBack }) => {
  const { player, signAgentContract, updatePlayer, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<'AGENT' | 'MANAGER'>('AGENT');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showInsider, setShowInsider] = useState(false);

  const currentAgent = player.representation?.agent;
  const currentManager = player.representation?.manager;

  // Progression Checks
  const isUnionMember = player.isUnionMember;
  const leadRolesCount = (player.principalRolesCount || 0) + (player.leadRolesCount || 0);
  const isUnlocked = isUnionMember && leadRolesCount >= 4;

  const handleHireAgent = (agent: LocalAgent) => {
    const res = signAgentContract(agent);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleHireManager = (mgr: LocalManager) => {
    player.representation = {
      ...player.representation,
      manager: {
        id: mgr.id,
        name: mgr.name,
        company: mgr.company,
        commissionPercent: mgr.commissionPercent,
        signed: true,
      },
    };
    setFeedback(`SIGNED CONTRACT WITH MANAGER ${mgr.name.toUpperCase()}! (15% Commission)`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleFireAgent = () => {
    const penalty = 5000;
    if (player.money < penalty) {
      setFeedback(`Insufficient funds to terminate agent contract. Cancellation Penalty: $${penalty.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    if (confirm(`Are you sure you want to dismiss your Talent Agent? Cancellation penalty is $${penalty.toLocaleString()}. Commission deductions will stop immediately.`)) {
      if (player.representation) {
        player.representation.agent = undefined;
      }
      updatePlayer({
        money: player.money - penalty,
        representation: player.representation,
      });
      setFeedback(`Talent Agent contract terminated! Paid $${penalty.toLocaleString()} cancellation penalty. Weekly commission stopped.`);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleFireManager = () => {
    const penalty = 3500;
    if (player.money < penalty) {
      setFeedback(`Insufficient funds to terminate manager contract. Cancellation Penalty: $${penalty.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    if (confirm(`Are you sure you want to dismiss your Personal Manager? Cancellation penalty is $${penalty.toLocaleString()}. Weekly fee deductions will stop immediately.`)) {
      if (player.representation) {
        player.representation.manager = undefined;
      }
      updatePlayer({
        money: player.money - penalty,
        representation: player.representation,
      });
      setFeedback(`Manager contract terminated! Paid $${penalty.toLocaleString()} cancellation penalty. Weekly fees stopped.`);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  if (showInsider) {
    return <HollywoodInsiderView onBack={() => setShowInsider(false)} />;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-24 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInsider(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-black text-xs transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <Newspaper className="w-4 h-4" />
            <span>Hollywood Insider News</span>
          </button>

          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-amber-400" />
            Hollywood Representation Portal
          </span>
        </div>
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
            <Briefcase className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">REPRESENTATION & AGENCY SUITE</h1>
            <p className="text-xs text-amber-300 font-medium">
              Hire CAA / WME talent agents and personal managers to unlock auditions, bankroll deals, and press tours.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('AGENT')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'AGENT'
              ? 'bg-amber-400 text-black shadow-lg'
              : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          TALENT AGENT {currentAgent ? '(SIGNED)' : ''}
        </button>

        <button
          onClick={() => setActiveTab('MANAGER')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'MANAGER'
              ? 'bg-amber-400 text-black shadow-lg'
              : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          PERSONAL MANAGER {currentManager ? '(SIGNED)' : ''}
        </button>
      </div>

      {/* AGENT VIEW */}
      {activeTab === 'AGENT' && (
        <div className="space-y-4">
          {!isUnlocked ? (
            /* LOCKED SCREEN FOR AGENT */
            <div className="p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 text-center space-y-4 shadow-2xl backdrop-blur-md max-w-xl mx-auto">
              <div className="p-4 rounded-full bg-rose-500/20 border border-rose-500/40 w-16 h-16 mx-auto flex items-center justify-center">
                <Lock className="w-8 h-8 text-rose-400" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black text-rose-400 uppercase tracking-widest">
                  TALENT AGENTS LOCKED
                </span>
                <h2 className="text-2xl font-black text-white">Career Requirements Not Met</h2>
                <p className="text-xs text-gray-300">
                  Top Hollywood agencies (CAA, WME, UTA) will only represent established union actors with proven lead experience.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2 text-xs">
                <span className="font-extrabold text-amber-300 uppercase block text-[10px]">
                  UNLOCK REQUIREMENTS:
                </span>

                <div className="flex items-center gap-2">
                  {isUnionMember ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className={isUnionMember ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                    SAG-AFTRA Union Membership Unlocked {isUnionMember ? '(COMPLETED)' : '(LOCKED)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {leadRolesCount >= 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className={leadRolesCount >= 4 ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                    Completed 4 Principal Roles ({leadRolesCount} / 4)
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 italic">
                No Hire button or contract available until requirements are satisfied.
              </p>
            </div>
          ) : currentAgent ? (
            /* ACTIVE AGENT SIGNED */
            <div className="p-6 rounded-3xl border border-amber-400/40 bg-black/50 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={currentAgent.avatarUrl}
                    alt={currentAgent.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      EXCLUSIVE TALENT AGENT
                    </span>
                    <h2 className="text-xl font-black text-white mt-1">{currentAgent.name}</h2>
                    <p className="text-xs text-amber-300 font-bold">{currentAgent.agencyName}</p>
                  </div>
                </div>

                <button
                  onClick={handleFireAgent}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-black cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <UserMinus className="w-4 h-4 text-rose-400" />
                  Dismiss Agent ($5,000 Fee)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs p-3 rounded-2xl bg-black/60 border border-white/10">
                <div>
                  <span className="text-gray-400 block text-[10px]">Commission</span>
                  <span className="font-extrabold text-amber-400">{currentAgent.commissionPercent}%</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Agency Perks</span>
                  <span className="font-extrabold text-white">{currentAgent.perks}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Status</span>
                  <span className="font-extrabold text-emerald-400">ACTIVE & SUBMITTING</span>
                </div>
              </div>
            </div>
          ) : (
            /* UNLOCKED: SHOW AVAILABLE AGENTS TO HIRE */
            <div className="space-y-3">
              <h2 className="text-base font-black text-white">Select a Talent Agency Contract</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AVAILABLE_AGENTS.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={ag.avatarUrl} alt={ag.name} className="w-12 h-12 rounded-xl object-cover border border-amber-400/40" />
                        <div>
                          <h3 className="text-base font-black text-white">{ag.name}</h3>
                          <p className="text-xs text-amber-300 font-bold">{ag.agencyName}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300">{ag.perks}</p>

                      <div className="p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px] space-y-1">
                        <div>Commission Rate: <strong className="text-amber-400">{ag.commissionPercent}%</strong></div>
                        <div>Role Requirement: <strong className="text-emerald-400">4 Principal Roles (Satisfied)</strong></div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleHireAgent(ag)}
                      className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Representation Contract ({ag.commissionPercent}% Fee)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MANAGER VIEW */}
      {activeTab === 'MANAGER' && (
        <div className="space-y-4">
          {!isUnlocked ? (
            /* LOCKED SCREEN FOR MANAGER */
            <div className="p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 text-center space-y-4 shadow-2xl backdrop-blur-md max-w-xl mx-auto">
              <div className="p-4 rounded-full bg-rose-500/20 border border-rose-500/40 w-16 h-16 mx-auto flex items-center justify-center">
                <Lock className="w-8 h-8 text-rose-400" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black text-rose-400 uppercase tracking-widest">
                  PERSONAL MANAGERS LOCKED
                </span>
                <h2 className="text-2xl font-black text-white">Career Requirements Not Met</h2>
                <p className="text-xs text-gray-300">
                  Personal managers will only represent established actors with union status and significant principal credits.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2 text-xs">
                <span className="font-extrabold text-amber-300 uppercase block text-[10px]">
                  UNLOCK REQUIREMENTS:
                </span>

                <div className="flex items-center gap-2">
                  {isUnionMember ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className={isUnionMember ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                    SAG-AFTRA Union Membership Unlocked {isUnionMember ? '(COMPLETED)' : '(LOCKED)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {leadRolesCount >= 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className={leadRolesCount >= 4 ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                    Completed 4 Principal Roles ({leadRolesCount} / 4)
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 italic">
                No Hire button or contract available until requirements are satisfied.
              </p>
            </div>
          ) : currentManager ? (
            /* ACTIVE MANAGER SIGNED */
            <div className="p-6 rounded-3xl border border-purple-400/40 bg-black/50 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center font-black text-purple-300 text-xl">
                    {currentManager.name.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      PERSONAL MANAGER
                    </span>
                    <h2 className="text-xl font-black text-white mt-1">{currentManager.name}</h2>
                    <p className="text-xs text-amber-300 font-bold">{currentManager.company}</p>
                  </div>
                </div>

                <button
                  onClick={handleFireManager}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-black cursor-pointer transition-all"
                >
                  Fire Manager
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs p-3.5 rounded-2xl bg-black/60 border border-white/10">
                <div>
                  <span className="text-gray-400 block text-[10px]">Commission</span>
                  <span className="font-extrabold text-amber-400">{currentManager.commissionPercent}%</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Company</span>
                  <span className="font-extrabold text-purple-300">{currentManager.company}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Status</span>
                  <span className="font-extrabold text-emerald-400">ACTIVE CONTRACT</span>
                </div>
              </div>
            </div>
          ) : (
            /* UNLOCKED: SHOW AVAILABLE MANAGERS TO HIRE */
            <div className="space-y-3">
              <h2 className="text-base font-black text-white">Select Personal Manager</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_MANAGERS.map((mgr) => (
                  <div
                    key={mgr.id}
                    className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={mgr.avatarUrl} alt={mgr.name} className="w-12 h-12 rounded-xl object-cover border border-purple-400/40" />
                        <div>
                          <h3 className="text-base font-black text-white">{mgr.name}</h3>
                          <span className="text-[10px] text-amber-300 font-extrabold flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {mgr.rating} Rating
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300">{mgr.benefits}</p>

                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px]">
                        <div>
                          <span className="text-gray-400 block font-bold">Commission</span>
                          <span className="font-black text-amber-400">{mgr.commissionPercent}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-bold">Weekly Fee</span>
                          <span className="font-black text-emerald-400">${mgr.weeklyCost}/wk</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-bold">Contract</span>
                          <span className="font-black text-sky-300">{mgr.contractWeeksRemaining} Wks</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleHireManager(mgr)}
                      className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      Hire Manager (${mgr.weeklyCost}/wk + {mgr.commissionPercent}%)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
