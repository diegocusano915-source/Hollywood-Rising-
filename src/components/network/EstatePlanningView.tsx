/**
 * HOLLYWOOD RISING - Estate Planning & Will Management View (Phase 4 Network)
 * Legal Wills, Real Beneficiary Allocations, Conditions, Lawyer Review, History & Philanthropy.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, EstatePlan, HeirItem } from '../../types/network';
import { NetworkService } from '../../services/networkService';
import {
  FileText,
  ArrowLeft,
  Users,
  Percent,
  ShieldCheck,
  History,
  Award,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface EstatePlanningViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

// Available Estate Lawyers
const ESTATE_LAWYERS = [
  {
    id: 'lawyer_01',
    name: 'Arthur Sterling, Esq.',
    firm: 'Century City Probate Partners',
    fee: 5000,
    experience: '15 Years',
    reputation: 'High',
    specialization: 'Standard Living Trusts',
    successRate: '92%',
  },
  {
    id: 'lawyer_02',
    name: 'Eleanor Vance, Senior Counsel',
    firm: 'Beverly Hills Family & Estate Law',
    fee: 15000,
    experience: '25 Years',
    reputation: 'Elite',
    specialization: 'High-Net-Worth Celebrity Wills',
    successRate: '98%',
  },
  {
    id: 'lawyer_03',
    name: 'Baron & Rothschild Legal Group',
    firm: 'Rodeo Drive Estate Counsel',
    fee: 35000,
    experience: '40 Years',
    reputation: 'Premier',
    specialization: 'Offshore Wealth & Contest Protection',
    successRate: '99.9%',
  },
];

export const EstatePlanningView: React.FC<EstatePlanningViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'HEIRS' | 'ALLOCATIONS' | 'CONDITIONS' | 'LEGAL_REVIEW' | 'HISTORY'
  >('OVERVIEW');

  const [feedback, setFeedback] = useState<string | null>(null);

  const finSummary = NetworkService.calculateFinancialSummary(networkState, player.money);
  const estatePlan: EstatePlan = networkState.estatePlan || {
    willCreated: false,
    status: 'NOT_STARTED',
    spousePct: 0,
    childrenPct: 0,
    charityPct: 0,
    trustFundBalance: 0,
    foundationName: `${player.lastName} Family Foundation`,
    foundationBalance: 0,
    foundationImpactScore: 0,
    heirAllocations: [],
    willHistory: [],
  };

  const heirsList: HeirItem[] = estatePlan.heirAllocations || [];
  const historyList = estatePlan.willHistory || [];

  // Generate real potential heirs from player's actual context
  const getPotentialHeirOptions = () => {
    const options: { id: string; name: string; relation: string }[] = [];

    if ((player as any).partnerName) {
      options.push({ id: 'heir_partner', name: (player as any).partnerName, relation: 'Spouse' });
    }
    if ((player as any).childrenNames && (player as any).childrenNames.length > 0) {
      ((player as any).childrenNames as string[]).forEach((childName, idx) => {
        options.push({ id: `heir_child_${idx}`, name: childName, relation: 'Child' });
      });
    }
    if (player.representation?.manager?.name) {
      options.push({ id: 'heir_manager', name: player.representation.manager.name, relation: 'Manager' });
    }

    // Standard options always accessible
    options.push(
      { id: 'heir_charity', name: 'Motion Picture & Television Fund Charity', relation: 'Charity' },
      { id: 'heir_foundation', name: estatePlan.foundationName || 'Family Foundation', relation: 'Foundation' },
      { id: 'heir_studio', name: `${player.lastName} Independent Studio LLC`, relation: 'Studio' }
    );

    return options;
  };

  const potentialHeirOptions = getPotentialHeirOptions();

  // Allocation math
  const totalAllocatedPct = heirsList.reduce((sum, h) => sum + (h.percentage || 0), 0);
  const remainingAllocationPct = 100 - totalAllocatedPct;

  const logWillEvent = (eventText: string, updatedPlan: EstatePlan) => {
    const newHistory = [
      { week: player.dateWeek || 1, event: eventText },
      ...(updatedPlan.willHistory || []),
    ];

    const nextState: NetworkFullState = {
      ...networkState,
      estatePlan: {
        ...updatedPlan,
        willHistory: newHistory,
        lastUpdatedWeek: player.dateWeek || 1,
      },
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
  };

  const handleAddHeir = (option: { id: string; name: string; relation: string }) => {
    if (heirsList.some((h) => h.id === option.id)) {
      setFeedback(`${option.name} is already added as an heir!`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const newHeir: HeirItem = {
      id: option.id,
      name: option.name,
      relation: option.relation,
      percentage: 0,
      condition: 'None',
    };

    const nextPlan = {
      ...estatePlan,
      heirAllocations: [...heirsList, newHeir],
      status: estatePlan.status === 'NOT_STARTED' ? ('WRITTEN_DRAFT' as const) : estatePlan.status,
    };

    logWillEvent(`Added ${option.name} (${option.relation}) to Will heirs list.`, nextPlan);
    setFeedback(`ADDED HEIR: ${option.name} (${option.relation}).`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRemoveHeir = (heirId: string) => {
    const target = heirsList.find((h) => h.id === heirId);
    const updatedHeirs = heirsList.filter((h) => h.id !== heirId);

    const nextPlan = {
      ...estatePlan,
      heirAllocations: updatedHeirs,
    };

    logWillEvent(`Removed ${target?.name || 'Heir'} from Will allocations.`, nextPlan);
    setFeedback(`REMOVED HEIR from estate plan.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpdatePercentage = (heirId: string, pct: number) => {
    const updatedHeirs = heirsList.map((h) => {
      if (h.id === heirId) {
        return { ...h, percentage: Math.max(0, Math.min(100, pct)) };
      }
      return h;
    });

    const nextPlan = {
      ...estatePlan,
      heirAllocations: updatedHeirs,
      status: 'WRITTEN_DRAFT' as const,
    };

    const nextState: NetworkFullState = {
      ...networkState,
      estatePlan: nextPlan,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
  };

  const handleUpdateCondition = (heirId: string, cond: string) => {
    const updatedHeirs = heirsList.map((h) => {
      if (h.id === heirId) {
        return { ...h, condition: cond };
      }
      return h;
    });

    const nextPlan = {
      ...estatePlan,
      heirAllocations: updatedHeirs,
    };

    logWillEvent(`Updated inheritance conditions for heir.`, nextPlan);
    setFeedback(`Updated inheritance condition.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleSelectLawyer = (lawyer: typeof ESTATE_LAWYERS[0]) => {
    if (player.money < lawyer.fee) {
      setFeedback(`Insufficient funds! Legal fee is $${lawyer.fee.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    if (totalAllocatedPct !== 100) {
      setFeedback(`Cannot submit to lawyer: Beneficiary allocations must equal exactly 100% (Currently: ${totalAllocatedPct}%).`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    const nextPlan: EstatePlan = {
      ...estatePlan,
      selectedLawyerId: lawyer.id,
      status: 'SENT_TO_LAWYER',
      lawyerReviewNotes: `Reviewed by ${lawyer.name} (${lawyer.firm}). Tax shelters & probate compliance verified with ${lawyer.successRate} defense rating.`,
    };

    logWillEvent(`Submitted Will to ${lawyer.name} for legal review ($${lawyer.fee.toLocaleString()} retainer).`, nextPlan);
    setFeedback(`SUBMITTED TO ${lawyer.name.toUpperCase()} FOR LEGAL REVIEW!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleFinalizeAndRegister = () => {
    if (totalAllocatedPct !== 100) {
      setFeedback(`Allocations must equal 100% to officially register!`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const nextPlan: EstatePlan = {
      ...estatePlan,
      willCreated: true,
      status: 'OFFICIALLY_REGISTERED',
    };

    logWillEvent(`Will officially registered with California Probate Court & Beverly Hills Bar Association.`, nextPlan);
    setFeedback(`WILL OFFICIALLY REGISTERED & SEALED! Legally binding estate protection active.`);
    setTimeout(() => setFeedback(null), 3500);
  };

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

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            Beverly Hills Estate Counsel
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <FileText className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                LEGAL WILL & ESTATE PLANNING
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">ESTATE & INHERITANCE</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Legal Status</span>
            <span className="text-xs font-black text-emerald-400 uppercase">
              {estatePlan.status || 'NOT_STARTED'}
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* SUB-TABS */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-black">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'HEIRS', label: `Heirs (${heirsList.length})` },
          { id: 'ALLOCATIONS', label: `Allocations (${totalAllocatedPct}%)` },
          { id: 'CONDITIONS', label: 'Conditions' },
          { id: 'LEGAL_REVIEW', label: 'Legal Review' },
          { id: 'HISTORY', label: 'History Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-400 text-black font-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-4 shadow-xl">
            <h2 className="text-xs font-black text-amber-400 uppercase">Estate Summary Overview</h2>

            {!estatePlan.willCreated && estatePlan.status === 'NOT_STARTED' ? (
              <div className="p-6 rounded-2xl bg-black/70 border border-white/10 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                <h3 className="text-sm font-black text-white">No Will Has Been Created.</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Protect your career assets, real estate, and fortune against probate court disputes by drafting a legal will.
                </p>
                <button
                  onClick={() => setActiveTab('HEIRS')}
                  className="px-5 py-2.5 rounded-2xl bg-amber-400 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer shadow-lg mt-2 inline-block"
                >
                  START DRAFTING WILL & ASSIGN HEIRS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Estate Value</span>
                  <span className="text-base font-black text-emerald-400">${finSummary.totalAssets.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Current Net Worth</span>
                  <span className="text-base font-black text-amber-300">${finSummary.netWorth.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Number of Heirs</span>
                  <span className="text-base font-black text-sky-300">{heirsList.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Legal Status</span>
                  <span className="text-xs font-black text-emerald-400 uppercase">{estatePlan.status}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Review Status</span>
                  <span className="text-xs font-black text-sky-300">
                    {estatePlan.selectedLawyerId ? 'Lawyer Reviewed' : 'Pending Review'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Last Updated</span>
                  <span className="text-xs font-black text-gray-300">
                    {estatePlan.lastUpdatedWeek ? `Week ${estatePlan.lastUpdatedWeek}` : 'Not Saved'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HEIRS */}
      {activeTab === 'HEIRS' && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-amber-400 uppercase">Select Real Estate Beneficiaries</h2>
            <p className="text-xs text-gray-400">Only real contacts, relatives, managers, and charities in your life are eligible.</p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-black text-white uppercase block">Available Contacts & Entities</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {potentialHeirOptions.map((opt) => {
                const isAlreadyAdded = heirsList.some((h) => h.id === opt.id);
                return (
                  <div
                    key={opt.id}
                    className="p-3 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-black text-white">{opt.name}</h4>
                      <span className="text-[10px] text-amber-400 font-bold block">{opt.relation}</span>
                    </div>
                    <button
                      onClick={() => handleAddHeir(opt)}
                      disabled={isAlreadyAdded}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        isAlreadyAdded
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-amber-400 text-black hover:scale-102'
                      }`}
                    >
                      {isAlreadyAdded ? 'ADDED' : '+ ADD HEIR'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {heirsList.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase block">Current Designated Heirs</span>
              {heirsList.map((heir) => (
                <div key={heir.id} className="p-3 rounded-2xl bg-black/80 border border-emerald-500/30 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-black text-white">{heir.name}</h4>
                    <span className="text-[10px] text-gray-400">{heir.relation}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveHeir(heir.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black hover:bg-rose-500/30 cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALLOCATIONS */}
      {activeTab === 'ALLOCATIONS' && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm font-black text-amber-400 uppercase">Manual Inheritance Allocations</h2>
              <p className="text-xs text-gray-400">Total allocations must equal exactly 100%.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">Remaining</span>
              <span className={`text-base font-black ${remainingAllocationPct === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {remainingAllocationPct}%
              </span>
            </div>
          </div>

          {heirsList.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No heirs added yet. Add heirs in the Heirs tab first.</p>
          ) : (
            <div className="space-y-3">
              {heirsList.map((heir) => (
                <div key={heir.id} className="p-3.5 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-black text-white">{heir.name}</h4>
                    <span className="text-[10px] text-amber-400 font-bold">{heir.relation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={heir.percentage || 0}
                      onChange={(e) => handleUpdatePercentage(heir.id, Number(e.target.value))}
                      className="w-20 bg-black/90 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-black text-amber-300 outline-none text-right"
                    />
                    <span className="text-xs font-black text-gray-400">%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONDITIONS */}
      {activeTab === 'CONDITIONS' && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-amber-400 uppercase">Inheritance Legal Conditions</h2>
            <p className="text-xs text-gray-400">Set optional requirements before funds are disbursed to beneficiaries.</p>
          </div>

          <div className="space-y-3">
            {heirsList.map((heir) => (
              <div key={heir.id} className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-white">{heir.name} ({heir.relation})</h4>
                  <span className="text-emerald-400 font-black">{heir.percentage}% Allocation</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Condition Clause</span>
                  <select
                    value={heir.condition || 'None'}
                    onChange={(e) => handleUpdateCondition(heir.id, e.target.value)}
                    className="w-full bg-black/90 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                  >
                    <option value="None">None (Immediate Inheritance)</option>
                    <option value="Reach Age 25">Reach Age 25</option>
                    <option value="Graduate University">Graduate University</option>
                    <option value="Remain Married">Remain Married</option>
                    <option value="Maintain Studio Ownership">Maintain Studio Ownership</option>
                    <option value="Achieve Career Requirement">Achieve Career Requirement</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: LEGAL REVIEW */}
      {activeTab === 'LEGAL_REVIEW' && (
        <div className="p-5 rounded-3xl border border-amber-500/30 bg-black/50 space-y-4 shadow-xl">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-amber-400 uppercase">Beverly Hills Estate Attorneys</h2>
            <p className="text-xs text-gray-400">Choose a specialized law firm to review, certify, and protect your estate against disputes.</p>
          </div>

          <div className="space-y-3">
            {ESTATE_LAWYERS.map((lawyer) => (
              <div key={lawyer.id} className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-white text-sm">{lawyer.name}</h3>
                    <span className="text-[10px] text-sky-400 font-bold block">{lawyer.firm}</span>
                  </div>
                  <span className="text-emerald-400 font-black text-sm">${lawyer.fee.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-300 font-bold bg-black/60 p-2 rounded-xl border border-white/5">
                  <div>Exp: {lawyer.experience}</div>
                  <div>Defense: {lawyer.successRate}</div>
                  <div>Rep: {lawyer.reputation}</div>
                </div>

                <button
                  onClick={() => handleSelectLawyer(lawyer)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer shadow-lg"
                >
                  HIRE & SUBMIT FOR REVIEW (${lawyer.fee.toLocaleString()})
                </button>
              </div>
            ))}
          </div>

          {estatePlan.status === 'SENT_TO_LAWYER' && (
            <button
              onClick={handleFinalizeAndRegister}
              className="w-full py-3 rounded-2xl bg-emerald-400 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer shadow-lg mt-3"
            >
              OFFICIALLY REGISTER WITH STATE PROBATE COURT
            </button>
          )}
        </div>
      )}

      {/* TAB 6: HISTORY */}
      {activeTab === 'HISTORY' && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-3 shadow-xl">
          <h2 className="text-xs font-black text-amber-400 uppercase flex items-center gap-2">
            <History className="w-4 h-4" />
            Will & Estate Permanence Log
          </h2>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {historyList.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No edits recorded yet.</p>
            ) : (
              historyList.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-black/60 border border-white/5 text-xs text-gray-300 font-bold flex justify-between items-center">
                  <span>{item.event}</span>
                  <span className="text-[10px] text-amber-400 font-black">Week {item.week}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
