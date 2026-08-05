/**
 * HOLLYWOOD RISING - Rivalries & Feuds Hotfix
 * Living Hollywood rivalry system with heat levels, timelines, social media activity & situational actions.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, RivalryNPC, RivalryLevel } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Swords,
  Flame,
  Newspaper,
  ShieldAlert,
  MessageSquare,
  Award,
  Radio,
  Tv,
  Scale,
  Sparkles,
  TrendingUp,
  Share2,
  Clock,
  User,
  Film,
  Zap,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const HEAT_LEVEL_BADGES: Record<RivalryLevel, { color: string; label: string }> = {
  Calm: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: '🌱 Calm' },
  Tension: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: '⚡ Tension' },
  Rival: { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', label: '⚔️ Rival' },
  Feud: { color: 'bg-red-500/20 text-red-300 border-red-500/30', label: '🔥 Active Feud' },
  'Arch Rival': { color: 'bg-rose-600/30 text-rose-300 border-rose-500/50', label: '👑 Arch Rival' },
  'Legendary Rival': { color: 'bg-purple-600/30 text-purple-300 border-purple-500/50', label: '🌌 Legendary' },
};

export const RivalriesView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player } = useGame();
  const [selectedRivalId, setSelectedRivalId] = useState<string | null>(
    empireState.rivalries.length > 0 ? empireState.rivalries[0].id : null
  );
  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'TIMELINE' | 'SOCIAL'>('ACTIONS');

  const selectedRival = empireState.rivalries.find((r) => r.id === selectedRivalId);

  // Provoke / Trigger a new rival naturally or on demand
  const handleProvokeNewRival = () => {
    const cost = 50000;
    if (player.money < cost) {
      alert('Insufficient funds ($50,000 required to launch publicity challenge).');
      return;
    }

    const rivalPool = [
      { name: 'Xavier Vance', role: 'Actor' as const, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', career: 'Oscar Winner', cause: 'Losing lead role in $200M sci-fi blockbuster' },
      { name: 'Sienna Sterling', role: 'Director' as const, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', career: 'Palme d’Or Winner', cause: 'Harsh criticism during Cannes press conference' },
      { name: 'Devon Kincaid', role: 'Studio Executive' as const, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', career: 'Warner Bros Senior VP', cause: 'Hostile studio distribution contract dispute' },
      { name: 'Camila Laurent', role: 'Pop Star' as const, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', career: 'Billboard #1 Artist', cause: 'Red carpet brand endorsement clash' },
      { name: 'Maximilian Thorne', role: 'Tech Billionaire' as const, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', career: 'Streaming Empire Founder', cause: 'Aggressive studio lot bidding war' },
    ];

    const unadded = rivalPool.filter((r) => !(empireState?.rivalries || []).some((existing) => existing?.name === r.name));
    if (unadded.length === 0) {
      alert('You are already entangled in feuds with all top Hollywood figures!');
      return;
    }

    player.money -= cost;
    const selected = unadded[Math.floor(Math.random() * unadded.length)];

    const newRival: RivalryNPC = {
      id: `rival_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: selected.name,
      role: selected.role,
      avatarUrl: selected.avatarUrl,
      relationshipLevel: 'Tension',
      heatLevel: 'Tension',
      rivalryScore: 40,
      cause: selected.cause,
      weekStarted: player.dateWeek,
      yearStarted: player.dateYear,
      career: selected.career,
      moviesTogether: [],
      awardsCompared: { playerWon: 0, rivalWon: 0 },
      socialMediaActivity: {
        followersCount: Math.floor(Math.random() * 8000000) + 1000000,
        sentiment: 'Aggressive',
        trendingHashtag: `#${selected.name.replace(/\s+/g, '')}Vs${player.lastName || 'Player'}`,
      },
      timeline: [
        {
          id: `tl_${Date.now()}`,
          week: player.dateWeek,
          year: player.dateYear,
          eventText: `Feud sparked over: ${selected.cause}`,
          category: 'General',
        },
      ],
      fansCount: Math.floor(Math.random() * 3000000) + 200000,
      legalHistory: [],
      businessHistory: [],
      lastEventDescription: `Publicity spark! ${selected.name} issued a challenge on Variety magazine cover story.`,
      mediaHeadlines: [`Variety Exclusive: ${selected.name} calls out ${player.firstName} ${player.lastName}!`],
      directorSupport: 'Divided studio executives',
      studioReaction: 'High public interest',
    };

    const updated: EmpireFullState = {
      ...empireState,
      rivalries: [newRival, ...empireState.rivalries],
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setSelectedRivalId(newRival.id);
    alert(`⚔️ NEW HOLLYWOOD RIVALRY: ${selected.name} accepted your publicity challenge!`);
  };

  // Perform situational actions against the selected rival
  const handleExecuteAction = (
    actionType: 'TRUCE_SUMMIT' | 'BOX_OFFICE_CHALLENGE' | 'SOCIAL_CLAPBACK' | 'LEAKED_SCOOP' | 'CEASE_DESIST'
  ) => {
    if (!selectedRival) return;

    let cost = 0;
    let heatChange: RivalryLevel = selectedRival.heatLevel;
    let scoreDelta = 0;
    let eventText = '';
    let headline = '';

    if (actionType === 'TRUCE_SUMMIT') {
      cost = 50000;
      if (player.money < cost) {
        alert('Insufficient funds ($50,000 required for Chateau Marmont Peace Summit).');
        return;
      }
      player.money -= cost;
      scoreDelta = -20;
      if (selectedRival.heatLevel === 'Arch Rival') heatChange = 'Feud';
      else if (selectedRival.heatLevel === 'Feud') heatChange = 'Tension';
      else heatChange = 'Calm';

      eventText = `Hosted private peace summit at Chateau Marmont with ${selectedRival.name}. Public truce declared.`;
      headline = `TMZ: ${player.firstName} ${player.lastName} and ${selectedRival.name} spotted sharing a peace toast at Chateau Marmont!`;
    } else if (actionType === 'BOX_OFFICE_CHALLENGE') {
      cost = 100000;
      if (player.money < cost) {
        alert('Insufficient funds ($100,000 required for Box Office campaign).');
        return;
      }
      player.money -= cost;
      scoreDelta = +25;
      heatChange = 'Arch Rival';
      eventText = `Challenged ${selectedRival.name} to a direct opening weekend Box Office showdown!`;
      headline = `Hollywood Reporter: Box Office War! ${player.lastName} vs ${selectedRival.name} head-to-head release!`;
    } else if (actionType === 'SOCIAL_CLAPBACK') {
      cost = 15000;
      if (player.money < cost) {
        alert('Insufficient funds ($15,000 required for viral PR boost).');
        return;
      }
      player.money -= cost;
      scoreDelta = +10;
      if (selectedRival.heatLevel === 'Tension') heatChange = 'Feud';
      eventText = `Posted viral social media clapback targeting ${selectedRival.name}. Trended #1 globally!`;
      headline = `PopCrave: ${player.firstName} ${player.lastName}'s savage tweet response to ${selectedRival.name} goes viral!`;
    } else if (actionType === 'LEAKED_SCOOP') {
      cost = 30000;
      if (player.money < cost) {
        alert('Insufficient funds ($30,000 required for investigative publicist).');
        return;
      }
      player.money -= cost;
      scoreDelta = +15;
      heatChange = 'Feud';
      eventText = `Leaked internal studio audio memo critiquing ${selectedRival.name}'s onset demeanor.`;
      headline = `Deadline Exclusive: Leaked memo reveals studio friction involving ${selectedRival.name}!`;
    } else if (actionType === 'CEASE_DESIST') {
      cost = 75000;
      if (player.money < cost) {
        alert('Insufficient funds ($75,000 required for legal retainer).');
        return;
      }
      player.money -= cost;
      scoreDelta = +30;
      heatChange = 'Arch Rival';
      eventText = `Served ${selectedRival.name} with formal defamation cease & desist legal notice!`;
      headline = `Variety: ${player.firstName} ${player.lastName} issues cease and desist legal order against ${selectedRival.name}!`;
    }

    const updatedRival: RivalryNPC = {
      ...selectedRival,
      heatLevel: heatChange,
      relationshipLevel: heatChange,
      rivalryScore: Math.min(100, Math.max(0, selectedRival.rivalryScore + scoreDelta)),
      lastEventDescription: eventText,
      mediaHeadlines: [headline, ...selectedRival.mediaHeadlines].slice(0, 5),
      timeline: [
        {
          id: `tl_${Date.now()}`,
          week: player.dateWeek,
          year: player.dateYear,
          eventText,
          category: actionType === 'TRUCE_SUMMIT' ? 'Peace' : actionType === 'SOCIAL_CLAPBACK' ? 'Social Media' : 'General',
        },
        ...selectedRival.timeline,
      ],
    };

    const updated: EmpireFullState = {
      ...empireState,
      rivalries: empireState.rivalries.map((r) => (r.id === selectedRival.id ? updatedRival : r)),
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`⚔️ ACTION EXECUTED: ${eventText}`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
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
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Hollywood Rivalries</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleProvokeNewRival}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            PROVOKE INDUSTRY RIVAL ($50K)
          </button>
        </div>
      </div>

      {empireState.rivalries.length === 0 ? (
        <div className="p-10 rounded-3xl border border-white/10 bg-black/60 text-center space-y-4 shadow-2xl">
          <Flame className="w-16 h-16 text-red-400/60 mx-auto animate-pulse" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider">NO ACTIVE HOLLYWOOD FEUDS</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Your career is currently peaceful. As your fame and empire grow, studio auditions, award snubs, and box office battles will naturally spawn living rivalries!
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
          {/* Left Column: Rivals List */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">
              Active Rivals ({empireState.rivalries.length})
            </h3>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {empireState.rivalries.map((rival) => {
                const isSelected = rival.id === selectedRivalId;
                const heatInfo = HEAT_LEVEL_BADGES[rival.heatLevel || 'Tension'];

                return (
                  <div
                    key={rival.id}
                    onClick={() => setSelectedRivalId(rival.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-red-500/60 bg-red-500/10 shadow-xl'
                        : 'border-white/10 bg-black/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-red-500/40 bg-gray-900 shrink-0">
                        <img src={rival.avatarUrl} alt={rival.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{rival.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{rival.role} • {rival.career}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${heatInfo.color}`}>
                        {heatInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Rival Details & Actions */}
          {selectedRival && (
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
                        {selectedRival.role} • Root Cause: <span className="text-red-300 font-bold">{selectedRival.cause}</span>
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                        Feud Active Since: Week {selectedRival.weekStarted}, {selectedRival.yearStarted}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 uppercase font-black block">Feud Intensity</span>
                    <span className="text-xl font-black text-red-400 font-mono">
                      {selectedRival.rivalryScore}/100
                    </span>
                  </div>
                </div>

                {/* Sub-Tab Switcher */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <button
                    onClick={() => setActiveTab('ACTIONS')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'ACTIONS'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    ⚔️ Action Hub
                  </button>
                  <button
                    onClick={() => setActiveTab('TIMELINE')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'TIMELINE'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    📜 Feud Timeline ({selectedRival.timeline?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('SOCIAL')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'SOCIAL'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    📱 Social & Media
                  </button>
                </div>

                {/* Tab 1: Situational Action Hub */}
                {activeTab === 'ACTIONS' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider">
                      Strategic Actions
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleExecuteAction('TRUCE_SUMMIT')}
                        className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left space-y-1 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-300 group-hover:text-emerald-200">
                            🤝 Chateau Marmont Truce
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">$50,000</span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Host a confidential dinner to de-escalate feud and lower public heat level.
                        </p>
                      </button>

                      <button
                        onClick={() => handleExecuteAction('BOX_OFFICE_CHALLENGE')}
                        className="p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left space-y-1 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-red-300 group-hover:text-red-200">
                            🍿 Box Office Face-Off
                          </span>
                          <span className="text-[10px] text-red-400 font-mono font-bold">$100,000</span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Challenge rival to a direct box office opening weekend release battle.
                        </p>
                      </button>

                      <button
                        onClick={() => handleExecuteAction('SOCIAL_CLAPBACK')}
                        className="p-3.5 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-left space-y-1 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-sky-300 group-hover:text-sky-200">
                            📱 Viral Social Clapback
                          </span>
                          <span className="text-[10px] text-sky-400 font-mono font-bold">$15,000</span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Launch targeted social post response to command trending media headlines.
                        </p>
                      </button>

                      <button
                        onClick={() => handleExecuteAction('LEAKED_SCOOP')}
                        className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left space-y-1 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-300 group-hover:text-amber-200">
                            📰 Leaked Studio Memo
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">$30,000</span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Leak insider studio reports regarding rival's onset friction to trade press.
                        </p>
                      </button>

                      <button
                        onClick={() => handleExecuteAction('CEASE_DESIST')}
                        className="p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left space-y-1 transition-all cursor-pointer group md:col-span-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-300 group-hover:text-purple-200">
                            ⚖️ Defamation Cease & Desist
                          </span>
                          <span className="text-[10px] text-purple-400 font-mono font-bold">$75,000</span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Retain elite entertainment trial attorneys to file formal legal notice in LA Superior Court.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Living Timeline */}
                {activeTab === 'TIMELINE' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider">
                      Chronological Feud Timeline
                    </h4>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {selectedRival.timeline && selectedRival.timeline.length > 0 ? (
                        selectedRival.timeline.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-start gap-3 text-xs"
                          >
                            <span className="text-[10px] text-red-400 font-mono font-bold shrink-0 pt-0.5">
                              W{ev.week}, Y{ev.year}
                            </span>
                            <div>
                              <p className="text-white font-medium">{ev.eventText}</p>
                              <span className="text-[9px] text-gray-400 uppercase font-bold">{ev.category} Event</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 italic">No timeline events recorded yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 3: Social & Media */}
                {activeTab === 'SOCIAL' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-gray-300 tracking-wider">
                      Industry Media & Social Sentiment
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
                        <span className="text-sm font-black text-rose-300">
                          {selectedRival.socialMediaActivity?.sentiment || 'Hostile'}
                        </span>
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
