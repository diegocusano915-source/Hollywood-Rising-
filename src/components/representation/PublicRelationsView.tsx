/**
 * HOLLYWOOD RISING - Public Relations Sub-View
 * Handles PR Agency hiring, Press Releases, Crisis Management, Public Statements, and Media Training.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NPC_CELEBRITY_POOL } from '../../database/representationDatabase';
import { RepresentationFullState, PRAgencyTier } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { Megaphone, ShieldAlert, Sparkles, Award, ArrowLeft, Plus, CheckCircle, AlertTriangle, Target } from 'lucide-react';

interface PublicRelationsViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

const PR_AGENCY_OPTIONS: { tier: PRAgencyTier; name: string; retainer: number; desc: string; perk: string }[] = [
  {
    tier: 'Specialist',
    name: 'Independent PR Specialist',
    retainer: 1500,
    desc: 'Dedicated publicist handling press releases and local interview pitching.',
    perk: '+10% Reputation gain from press releases.',
  },
  {
    tier: 'Boutique Agency',
    name: 'Beverly Hills PR Boutique',
    retainer: 5000,
    desc: 'Boutique agency with direct ties to Variety, Hollywood Reporter, and Deadline.',
    perk: 'Fast crisis management & +20% Public Trust boosts.',
  },
  {
    tier: 'A-List PR Firm',
    name: 'Rogers & Cowan PMK Elite',
    retainer: 15000,
    desc: 'The premiere global A-list crisis & publicity powerhouse.',
    perk: 'Automatic scandal suppression, Oscar campaign lobbying & global press immunity.',
  },
];

export const PublicRelationsView: React.FC<PublicRelationsViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player, saveData, updateSave , persistNow } = useGame();
  const pr = representationState.pr;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PRESS_RELEASE' | 'CRISIS' | 'TRAINING'>('OVERVIEW');
  const [statementTitle, setStatementTitle] = useState('');
  const [statementText, setStatementText] = useState('');

  // Handle Hire PR Agency
  const handleHireAgency = (tier: PRAgencyTier, retainer: number) => {
    if (player.money < retainer) {
      alert(`Insufficient cash! Retainer requires $${retainer.toLocaleString()}.`);
      return;
    }
    const state = RepresentationService.getState();
    state.pr.hiredAgencyTier = tier;
    state.pr.weeklyRetainerFee = retainer;
    RepresentationService.saveState(state);
    onRefresh();
  };

  // Handle Fire PR Agency
  const handleFireAgency = () => {
    const state = RepresentationService.getState();
    state.pr.hiredAgencyTier = 'None';
    state.pr.weeklyRetainerFee = 0;
    RepresentationService.saveState(state);
    onRefresh();
  };

  // Issue Press Release
  const handleIssueRelease = () => {
    if (!statementTitle.trim() || !statementText.trim()) {
      alert('Please enter a title and text for the press release.');
      return;
    }
    if (pr.hiredAgencyTier === 'None') {
      alert('You must hire a PR Specialist or Agency before issuing official press releases!');
      return;
    }

    const state = RepresentationService.getState();
    state.pr.pressReleasesIssued += 1;
    // REAL EFFECT: press releases boost public reputation + fans
    state.reputation.publicReputation = Math.min(100, (state.reputation.publicReputation || 0) + 4);
    state.reputation.publicTrust = Math.min(100, (state.reputation.publicTrust || 0) + 3);
    player.fans = (player.fans || 0) + Math.floor(50 + (player.fameXp || 0) * 0.5);
    state.reputation.publicReputation = Math.min(100, state.reputation.publicReputation + 5);
    state.mediaCenter.unshift({
      id: `press_rel_${Date.now()}`,
      type: 'Press Conference',
      title: `OFFICIAL STATEMENT: ${statementTitle}`,
      source: state.pr.hiredAgencyTier === 'A-List PR Firm' ? 'Rogers & Cowan PMK Wire' : 'PR Newswire',
      dateText: `Week ${player.dateWeek}, ${player.dateYear}`,
      snippet: statementText,
      fameGained: 5,
      reputationImpact: 5,
    });

    RepresentationService.saveState(state);
    setStatementTitle('');
    setStatementText('');
    alert('📰 Press release issued successfully to Hollywood trade journals!');
    onRefresh();
  };

  // Handle Media Training
  const handleMediaTraining = () => {
    const cost = 3000;
    if (player.money < cost) {
      alert('Insufficient funds for Media Training ($3,000 required).');
      return;
    }

    player.money -= cost;
    persistNow();
    const state = RepresentationService.getState();
    state.pr.mediaTrainingLevel = Math.min(100, state.pr.mediaTrainingLevel + 15);
    state.reputation.professionalism = Math.min(100, state.reputation.professionalism + 8);
    state.reputation.publicTrust = Math.min(100, state.reputation.publicTrust + 5);

    RepresentationService.saveState(state);
    alert('🎤 Media Training Session Completed! Professionalism & Public Trust boosted.');
    onRefresh();
  };

  // ---- SCANDAL SYSTEM (Issue 12) ----
  const [scandalFeedback, setScandalFeedback] = useState<string | null>(null);
  const [smearTarget, setSmearTarget] = useState<string>(NPC_CELEBRITY_POOL[0]?.name || 'A Rival Star');

  const handleResolveScandal = (scandalId: string, strategy: 'LAWYER' | 'PR' | 'APOLOGIZE' | 'DENY') => {
    const state = RepresentationService.getState();
    const scandal = state.pr.scandals.find((sc) => sc.id === scandalId);
    if (!scandal || scandal.resolved) return;

    const res = RepresentationService.resolveScandal(scandalId, strategy, player);
    // Persist player money/fans changes
    updateSave({ ...saveData, player: { ...player } });
    if (res.success) {
      setScandalFeedback(res.message);
      onRefresh();
    } else {
      setScandalFeedback(res.message);
    }
    setTimeout(() => setScandalFeedback(null), 6000);
  };

  const handleSmearCampaign = () => {
    const fame = player.fameXp || 0;
    const cost = Math.max(5000, Math.floor(5000 + fame * 8));
    if (player.money < cost) {
      setScandalFeedback(`Insufficient funds for a smear campaign ($${cost.toLocaleString()}).`);
      setTimeout(() => setScandalFeedback(null), 4000);
      return;
    }
    if (!window.confirm(`Hire bloggers to smear ${smearTarget}?

Cost: $${cost.toLocaleString()}
⚠️ RISK: If caught, you'll be sued for slander and your public trust will collapse.`)) {
      return;
    }
    const res = RepresentationService.launchSmearCampaign(smearTarget, cost, player);
    updateSave({ ...saveData, player: { ...player } });
    setScandalFeedback(res.message);
    setTimeout(() => setScandalFeedback(null), 7000);
    onRefresh();
  };

  return (
    <div className="space-y-6 text-white select-none pb-12">
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
          <Megaphone className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">PUBLIC RELATIONS</h2>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'OVERVIEW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          PR Agency & Status
        </button>
        <button
          onClick={() => setActiveTab('PRESS_RELEASE')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'PRESS_RELEASE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Press Releases ({pr.pressReleasesIssued})
        </button>
        <button
          onClick={() => setActiveTab('CRISIS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'CRISIS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Crisis Control ({pr.scandals.filter((s) => !s.resolved).length})
        </button>
        <button
          onClick={() => setActiveTab('TRAINING')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'TRAINING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Media Training ({pr.mediaTrainingLevel}%)
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Current Hired PR Agency Card */}
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-widest">Active Representation</span>
              <h3 className="text-xl font-black text-white">
                {pr.hiredAgencyTier === 'None' ? 'No PR Agency Hired' : pr.hiredAgencyTier}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {pr.hiredAgencyTier === 'None'
                  ? 'Hire an agency to issue press releases, manage crises, and pitch trade coverage.'
                  : `Weekly Retainer: $${pr.weeklyRetainerFee.toLocaleString()}/week.`}
              </p>
            </div>
            {pr.hiredAgencyTier !== 'None' && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                  RETAINED ACTIVE
                </span>
                <button
                  onClick={handleFireAgency}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" /> Fire PR Agency
                </button>
              </div>
            )}
          </div>

          {/* Agency Selection Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Available PR Agencies & Specialists</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PR_AGENCY_OPTIONS.map((opt) => {
                const isCurrent = pr.hiredAgencyTier === opt.tier;
                return (
                  <div
                    key={opt.tier}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-white/10 bg-black/40 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">{opt.tier}</span>
                        <span className="text-xs font-black text-white">${opt.retainer.toLocaleString()}/wk</span>
                      </div>
                      <h5 className="text-sm font-black text-white">{opt.name}</h5>
                      <p className="text-xs text-gray-400 leading-relaxed">{opt.desc}</p>
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 font-medium">
                        ✨ {opt.perk}
                      </div>
                    </div>

                    <button
                      disabled={isCurrent}
                      onClick={() => handleHireAgency(opt.tier, opt.retainer)}
                      className={`mt-4 w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-not-allowed'
                          : 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg hover:scale-[1.02]'
                      }`}
                    >
                      {isCurrent ? 'Currently Retained' : `Hire Agency ($${opt.retainer.toLocaleString()}/wk)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PRESS_RELEASE' && (
        <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Draft & Publish Official Press Release</span>
            </h3>
            <p className="text-xs text-gray-400">
              Publish official statements through trade networks (Variety, Deadline, Hollywood Reporter) to boost Public Reputation.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Headline / Subject</label>
              <input
                type="text"
                placeholder="e.g., Statement Regarding Summer Film Premiere & Philanthropic Drive"
                value={statementTitle}
                onChange={(e) => setStatementTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Official Press Release Body</label>
              <textarea
                rows={4}
                placeholder="Draft official statement on behalf of your publicity team..."
                value={statementText}
                onChange={(e) => setStatementText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleIssueRelease}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-lg hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>PUBLISH PRESS RELEASE</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'CRISIS' && (
        <div className="space-y-4">
          {scandalFeedback && (
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-bold text-center leading-relaxed">
              {scandalFeedback}
            </div>
          )}

          {/* Smear Campaign Launcher (competitive play) */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
            <h3 className="text-sm font-black uppercase text-gray-200 tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" /> Offensive Play — Hire Bloggers to Smear a Rival
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Pay gossip bloggers to run a defamation narrative against a rival celebrity. If you're caught,
              you face a SLANDER/DEFAMATION lawsuit and public trust damage. Your law firm reduces the risk.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={smearTarget}
                onChange={(e) => setSmearTarget(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none flex-1 min-w-40"
              >
                {NPC_CELEBRITY_POOL.map((npc) => (
                  <option key={npc.name} value={npc.name}>{npc.name}</option>
                ))}
              </select>
              <button
                onClick={handleSmearCampaign}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <Target className="w-4 h-4" /> Launch Smear (${Math.max(5000, Math.floor(5000 + (player.fameXp || 0) * 8)).toLocaleString()})
              </button>
            </div>
          </div>

          {/* Active Scandals with 4-choice resolution */}
          {pr.scandals.filter((sc) => !sc.resolved).length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-black text-white">NO ACTIVE SCANDALS OR CONTROVERSIES</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Your public image is currently pristine. Any gameplay controversies or tabloids will automatically route here for PR containment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pr.scandals.filter((sc) => !sc.resolved).map((s) => (
                <div key={s.id} className={`p-5 rounded-3xl border-2 bg-black/60 backdrop-blur-md space-y-3 ${
                  s.severity === 'CRITICAL' ? 'border-red-500/50' : s.severity === 'MODERATE' ? 'border-orange-500/40' : 'border-yellow-500/30'
                }`}>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <AlertTriangle className={`w-6 h-6 shrink-0 ${s.severity === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'}`} />
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-white">{s.title}</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">{s.story || s.cause}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0 ${
                      s.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : s.severity === 'MODERATE' ? 'bg-orange-500/20 text-orange-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {s.severity} SCANDAL
                    </span>
                  </div>

                  {s.source === 'NPC_ATTACK' && s.instigator && (
                    <p className="text-[10px] font-bold text-rose-300 bg-rose-500/10 border border-rose-500/30 p-2 rounded-xl">
                      🕵️ Competitive attack: {s.instigator} funded bloggers to defame you. Your law firm can fight this.
                    </p>
                  )}

                  {/* 4-choice resolution */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleResolveScandal(s.id, 'LAWYER')}
                      className="px-3 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white text-[10px] font-black uppercase transition-all cursor-pointer text-center"
                    >
                      ⚖️ Let Lawyers Handle It
                    </button>
                    <button
                      onClick={() => handleResolveScandal(s.id, 'PR')}
                      className="px-3 py-2.5 rounded-xl bg-sky-600/80 hover:bg-sky-500 text-white text-[10px] font-black uppercase transition-all cursor-pointer text-center"
                    >
                      📣 PR Statement / Campaign
                    </button>
                    <button
                      onClick={() => handleResolveScandal(s.id, 'APOLOGIZE')}
                      className="px-3 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] font-black uppercase transition-all cursor-pointer text-center"
                    >
                      🙏 Own It / Apologize
                    </button>
                    <button
                      onClick={() => handleResolveScandal(s.id, 'DENY')}
                      className="px-3 py-2.5 rounded-xl bg-black/60 border border-white/20 hover:border-white/40 text-gray-300 text-[10px] font-black uppercase transition-all cursor-pointer text-center"
                    >
                      🚫 Deny & Ride It Out
                    </button>
                  </div>

                  {/* Lawyer readiness */}
                  <p className="text-[10px] text-gray-500">
                    {representationState.lawFirm.hiredFirmTier === 'None'
                      ? '⚠️ No law firm retained — legal defense will be weak and expensive.'
                      : `⚖️ ${representationState.lawFirm.hiredFirmTier} retained — strong legal defense available.`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Resolved history */}
          {pr.scandals.filter((sc) => sc.resolved).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Resolved Incidents</h4>
              {pr.scandals.filter((sc) => sc.resolved).slice(0, 5).map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-300">{s.title}</p>
                    <span className="text-[9px] text-gray-500 uppercase font-bold">W{s.weekOccurred} {s.yearOccurred}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.resolutionNote}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'TRAINING' && (
        <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Executive Media Training Conservatory</h3>
              <p className="text-xs text-gray-400">
                Train with veteran Hollywood publicists to master red carpet interviews, press junkets, and live talk shows.
              </p>
            </div>
            <span className="text-xl font-black text-amber-300">{pr.mediaTrainingLevel}% Trained</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">A-List Media Prep Course</span>
              <span className="text-[11px] text-gray-400 block">Cost: $3,000 | +15% Media Training Level & +8 Professionalism</span>
            </div>
            <button
              onClick={handleMediaTraining}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-md cursor-pointer hover:scale-105"
            >
              ENROLL IN MEDIA PREP ($3,000)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
