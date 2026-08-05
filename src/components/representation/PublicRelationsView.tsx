/**
 * HOLLYWOOD RISING - Public Relations Sub-View
 * Handles PR Agency hiring, Press Releases, Crisis Management, Public Statements, and Media Training.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState, PRAgencyTier } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { Megaphone, ShieldAlert, Sparkles, Award, ArrowLeft, Plus, CheckCircle, AlertTriangle } from 'lucide-react';

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
  const { player } = useGame();
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
    const state = RepresentationService.getState();
    state.pr.mediaTrainingLevel = Math.min(100, state.pr.mediaTrainingLevel + 15);
    state.reputation.professionalism = Math.min(100, state.reputation.professionalism + 8);
    state.reputation.publicTrust = Math.min(100, state.reputation.publicTrust + 5);

    RepresentationService.saveState(state);
    alert('🎤 Media Training Session Completed! Professionalism & Public Trust boosted.');
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
          {pr.scandals.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-black text-white">NO ACTIVE SCANDALS OR CONTROVERSIES</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Your public image is currently pristine. Any gameplay controversies or tabloids will automatically route here for PR containment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pr.scandals.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl border border-red-500/30 bg-red-950/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-white">{s.title}</h4>
                      <p className="text-xs text-gray-400">{s.cause}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold uppercase">
                    {s.severity} SCANDAL
                  </span>
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
