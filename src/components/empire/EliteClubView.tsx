/**
 * HOLLYWOOD RISING - Elite Club Sub-View
 * Phase 5 Empire Scene: Exclusive invite-only VIP society & billionaire events.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, EliteNPC, EliteEventOption, EliteEventLog } from '../../types/empire';
import { EmpireService, ELITE_EVENT_CATALOG } from '../../services/empireService';
import {
  Crown,
  Sparkles,
  Award,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  MapPin,
  Star,
  Globe,
  Wine,
  GlassWater,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

export const EliteClubView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player } = useGame();
  const eliteState = empireState.eliteClub;

  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'EVENTS' | 'LOGS'>('MEMBERS');

  const entryFee = 100000;
  const minFameToJoin = 500;

  const handleJoinClub = () => {
    if (player.fameXp < minFameToJoin) {
      alert(`Insufficient Fame XP! Entry requires at least ${minFameToJoin} Fame XP (Current: ${player.fameXp} XP).`);
      return;
    }

    if (player.money < entryFee) {
      alert(`Insufficient cash! Entry fee requires $${entryFee.toLocaleString()}.`);
      return;
    }

    player.money -= entryFee;

    const updated: EmpireFullState = {
      ...empireState,
      eliteClub: {
        ...eliteState,
        isMember: true,
        joinedWeek: player.dateWeek,
        joinedYear: player.dateYear,
        yearlyDuesPaid: true,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert('👑 WELCOME TO THE HOLLYWOOD ELITE CLUB: Induction accepted! You now hold lifetime access to VIP events and billionaire networking.');
  };

  const handleHostEvent = (evt: EliteEventOption) => {
    if (player.money < evt.cost) {
      alert(`Insufficient cash to host ${evt.title} ($${evt.cost.toLocaleString()} required).`);
      return;
    }

    player.money -= evt.cost;

    const attendeesCount = Math.floor(4 + Math.random() * 8);
    const outcomes = [
      'Signed $2,000,000 venture co-investment deal.',
      'Secured casting recommendation from A-List Director.',
      'Formed close friendship with European Royalty.',
      'Received exclusive invitation to private island retreat.',
    ];
    const chosenOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    const eventLog: EliteEventLog = {
      id: `evt_log_${Date.now()}`,
      eventTitle: evt.title,
      week: player.dateWeek,
      year: player.dateYear,
      attendeesCount,
      outcome: chosenOutcome,
      impactText: `Hosted ${evt.title} in Bel-Air. ${attendeesCount} VIPs attended. ${chosenOutcome}`,
    };

    // Boost relationship scores with Elite NPCs
    const updatedNpcs = eliteState.eliteNpcs.map((npc) => {
      if (Math.random() > 0.4) {
        return {
          ...npc,
          relationshipScore: Math.min(100, npc.relationshipScore + 15),
          status: (npc.relationshipScore + 15 > 40 ? 'Close VIP' : 'Member') as any,
        };
      }
      return npc;
    });

    const updated: EmpireFullState = {
      ...empireState,
      eliteClub: {
        ...eliteState,
        eliteNpcs: updatedNpcs,
        eventHistory: [eventLog, ...eliteState.eventHistory],
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🎉 EVENT SUCCESS: ${eventLog.impactText}`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Elite Club</h2>
          </div>
        </div>

        {eliteState.isMember && (
          <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/10">
            <button
              onClick={() => setActiveTab('MEMBERS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'MEMBERS' ? 'bg-amber-400 text-black shadow-lg' : 'text-gray-400'
              }`}
            >
              VIP Roster
            </button>
            <button
              onClick={() => setActiveTab('EVENTS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'EVENTS' ? 'bg-amber-400 text-black shadow-lg' : 'text-gray-400'
              }`}
            >
              Host Events
            </button>
            <button
              onClick={() => setActiveTab('LOGS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'LOGS' ? 'bg-amber-400 text-black shadow-lg' : 'text-gray-400'
              }`}
            >
              Event History
            </button>
          </div>
        )}
      </div>

      {!eliteState.isMember ? (
        /* MEMBERSHIP INDUCTION PANEL */
        <div className="p-8 rounded-3xl border border-amber-500/40 bg-black/60 backdrop-blur-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto shadow-xl">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
              Membership Locked
            </span>
            <h3 className="text-2xl font-black text-white mt-2">THE HOLLYWOOD ELITE CLUB</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              An invite-only private society uniting A-list actors, tech billionaires, pop superstars, European royalty, and studio heads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-xs text-left">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
              <span className="text-amber-400 font-bold block text-[10px] uppercase">Requirements</span>
              <span className="text-white font-black text-sm">{minFameToJoin} Fame XP</span>
              <span className="text-[10px] text-gray-400 block">Current Fame: {player.fameXp} XP</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold block text-[10px] uppercase">Membership Fee</span>
              <span className="text-white font-black text-sm">${entryFee.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 block">One-time induction dues</span>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="max-w-lg mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left text-xs space-y-2">
            <span className="text-amber-300 font-black uppercase text-[10px] tracking-wider block">
              Exclusive Member Benefits:
            </span>
            <ul className="space-y-1.5 text-gray-300 text-[11px]">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Host and attend private VIP galas, yachts, and Bel-Air summits.</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Co-invest directly with studio heads on blockbuster productions.</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Unlock high-stakes networking with verified industry titans.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleJoinClub}
            className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>PAY ENTRY FEE & UNLOCK ($100,000)</span>
          </button>
        </div>
      ) : (
        /* MEMBER DASHBOARD */
        <div>
          {activeTab === 'MEMBERS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eliteState.eliteNpcs.map((npc) => (
                <div
                  key={npc.id}
                  className="p-4 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/40 bg-gray-900 shrink-0">
                      <img src={npc.avatarUrl} alt={npc.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{npc.name}</h4>
                      <p className="text-[10px] text-amber-300 font-bold">{npc.title}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Net Worth:</span>
                      <span className="font-bold text-emerald-400">${npc.netWorth.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Affiliation:</span>
                      <span className="font-semibold text-white">{npc.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Social:</span>
                      <span className="font-semibold text-amber-300">{npc.socialHandle}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                    <span className="text-gray-400 font-medium">Status: {npc.status}</span>
                    <span className="font-black text-amber-400">Score: {npc.relationshipScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'EVENTS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ELITE_EVENT_CATALOG.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {evt.category}
                    </span>
                    <span className="text-xs font-black text-emerald-400">${evt.cost.toLocaleString()}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">{evt.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{evt.description}</p>
                  </div>

                  <button
                    onClick={() => handleHostEvent(evt)}
                    className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-lg"
                  >
                    HOST VIP EVENT
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'LOGS' && (
            <div className="space-y-3">
              {eliteState.eventHistory.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">
                  No VIP events hosted yet. Select "Host Events" to invite elite NPCs!
                </p>
              ) : (
                eliteState.eventHistory.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-300">{log.eventTitle}</span>
                      <span className="text-gray-400 text-[10px]">
                        Week {log.week}, {log.year}
                      </span>
                    </div>
                    <p className="text-gray-300">{log.impactText}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
