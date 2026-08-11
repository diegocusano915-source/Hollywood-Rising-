/**
 * HOLLYWOOD RISING - Retainer & Representation Manager
 * Full management for Lawyers, Talent Agents, Business Managers, Publicists, Financial Advisors, Security, & Marketing.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationService } from '../../services/representationService';
import {
  X,
  ShieldCheck,
  Award,
  DollarSign,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  Scale,
  Megaphone,
  UserCheck,
  PieChart,
  ShieldAlert,
  Target,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export interface RetainerItem {
  id: string;
  category: 'LAWYER' | 'AGENT' | 'MANAGER' | 'PUBLICIST' | 'ADVISOR' | 'SECURITY' | 'MARKETING';
  title: string;
  providerName: string;
  hiredDate: string;
  isHired: boolean;
  weeklyCost: number;
  contractWeeksRemaining: number;
  ratingScore: number; // 1-100
  benefitsList: string[];
  cancellationPenaltyFee: number;
}

export const RetainerManagementModal: React.FC = () => {
  const { setActiveModal, player, updatePlayer, settings, terminateRepresentation } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const repState = RepresentationService.getState();

  // Selected for dismissal modal
  const [selectedForCancel, setSelectedForCancel] = useState<RetainerItem | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Derive retainers state
  const retainersList: RetainerItem[] = [
    {
      id: 'ret_lawyer',
      category: 'LAWYER',
      title: 'Defamation & Contract Law Firm',
      providerName: repState.lawFirm.hiredFirmTier !== 'None' ? `${repState.lawFirm.hiredFirmTier} Legal Group` : 'Skadden & Arps Entertainment Law',
      hiredDate: 'Year 2026, Week 2',
      isHired: repState.lawFirm.hiredFirmTier !== 'None',
      weeklyCost: repState.lawFirm.weeklyRetainerFee || 2500,
      contractWeeksRemaining: 12,
      ratingScore: 94,
      benefitsList: [
        'Contract breach protection & lawsuit defense',
        'IP & trademark registration',
        'Eliminates studio exploitation penalties',
      ],
      cancellationPenaltyFee: 5000,
    },
    {
      id: 'ret_agent',
      category: 'AGENT',
      title: 'Talent Agency Representation',
      providerName: player.representation?.agent ? player.representation.agent.name : 'CAA / WME Talent Agency',
      hiredDate: 'Year 2026, Week 1',
      isHired: !!player.representation?.agent,
      weeklyCost: 3500,
      contractWeeksRemaining: 18,
      ratingScore: 98,
      benefitsList: [
        'Unlocks top-tier studio audition callboards',
        '+25% audition callback pass rate',
        'Negotiates higher upfront salary & backend',
      ],
      cancellationPenaltyFee: 10000,
    },
    {
      id: 'ret_manager',
      category: 'MANAGER',
      title: 'Personal Business Manager',
      providerName: player.representation?.manager ? player.representation.manager.name : 'Beverly Hills Wealth Management',
      hiredDate: 'Year 2026, Week 4',
      isHired: !!player.representation?.manager,
      weeklyCost: 1800,
      contractWeeksRemaining: 10,
      ratingScore: 91,
      benefitsList: [
        'Automated weekly financial tax deductions',
        'Personal career scheduling & logistics',
        'Sponsorship & endorsement deal sourcing',
      ],
      cancellationPenaltyFee: 3500,
    },
    {
      id: 'ret_publicist',
      category: 'PUBLICIST',
      title: 'Public Relations & PR Agency',
      providerName: repState.pr.hiredAgencyTier !== 'None' ? `${repState.pr.hiredAgencyTier} PR Firm` : 'Rogers & Cowan Crisis PR',
      hiredDate: 'Year 2026, Week 3',
      isHired: repState.pr.hiredAgencyTier !== 'None',
      weeklyCost: repState.pr.weeklyRetainerFee || 2000,
      contractWeeksRemaining: 14,
      ratingScore: 92,
      benefitsList: [
        'Crisis management scandal suppression',
        'Organizes trade interviews & magazine covers',
        '+15% public trust & fan loyalty boost',
      ],
      cancellationPenaltyFee: 4000,
    },
    {
      id: 'ret_advisor',
      category: 'ADVISOR',
      title: 'Financial Wealth Advisor',
      providerName: 'Morgan Stanley Private Wealth',
      hiredDate: 'Year 2026, Week 5',
      isHired: player.money >= 100000,
      weeklyCost: 1500,
      contractWeeksRemaining: 24,
      ratingScore: 89,
      benefitsList: [
        '+8% annual yield on savings & market stocks',
        'Tax shelter structuring for studio residuals',
        'Estate planning & offshore holding protection',
      ],
      cancellationPenaltyFee: 3000,
    },
    {
      id: 'ret_security',
      category: 'SECURITY',
      title: 'VIP Bodyguards & Estate Protection',
      providerName: 'G4S Executive Security Detail',
      hiredDate: 'Year 2026, Week 6',
      isHired: (player.fans || 0) >= 50000,
      weeklyCost: 2200,
      contractWeeksRemaining: 16,
      ratingScore: 96,
      benefitsList: [
        'Stalker & paparazzi harassment suppression',
        'Red carpet premiere escort & perimeter defense',
        'Reduces estate burglary risk to 0%',
      ],
      cancellationPenaltyFee: 4500,
    },
    {
      id: 'ret_marketing',
      category: 'MARKETING',
      title: 'Movie Marketing & Social Growth Firm',
      providerName: 'A24 Digital Growth Partners',
      hiredDate: 'Year 2026, Week 8',
      isHired: player.moviesCompleted >= 2,
      weeklyCost: 3000,
      contractWeeksRemaining: 8,
      ratingScore: 95,
      benefitsList: [
        '+20% opening weekend box office gross',
        'TikTok & Instagram viral campaign management',
        'Boosts RottenTomatoes audience hype scores',
      ],
      cancellationPenaltyFee: 6000,
    },
  ];

  const handleConfirmCancelContract = () => {
    if (!selectedForCancel) return;

    // Agents & Managers use the REAL contract system (breach penalties, terms)
    if (selectedForCancel.category === 'AGENT' || selectedForCancel.category === 'MANAGER') {
      const res = terminateRepresentation(selectedForCancel.category === 'AGENT' ? 'agent' : 'manager');
      setFeedback({ type: res.success ? 'success' : 'error', msg: res.message });
      setSelectedForCancel(null);
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    const penalty = selectedForCancel.cancellationPenaltyFee;

    if (player.money < penalty) {
      setFeedback({
        type: 'error',
        msg: `Insufficient funds to pay cancellation penalty ($${penalty.toLocaleString()}). Required: $${penalty.toLocaleString()}.`,
      });
      setSelectedForCancel(null);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    // Immediately cancel retainer and deduct penalty
    const updatedMoney = player.money - penalty;

    // Update player representation state (agents/managers are handled by the contract system above)
    let updatedRep = { ...player.representation };

    // Update RepresentationService state
    if (selectedForCancel.category === 'LAWYER') {
      repState.lawFirm.hiredFirmTier = 'None';
      repState.lawFirm.weeklyRetainerFee = 0;
    }
    if (selectedForCancel.category === 'PUBLICIST') {
      repState.pr.hiredAgencyTier = 'None';
      repState.pr.weeklyRetainerFee = 0;
    }
    RepresentationService.saveState(repState);

    updatePlayer({
      money: updatedMoney,
      representation: updatedRep,
    });

    setFeedback({
      type: 'success',
      msg: `Contract with ${selectedForCancel.providerName} terminated immediately. Cancellation fee ($${penalty.toLocaleString()}) paid. Weekly deductions stopped.`,
    });

    setSelectedForCancel(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleHireOrRenew = (item: RetainerItem) => {
    // Agents & Managers are hired ONLY through the marketplace (World → Talent Representation)
    if (item.category === 'AGENT' || item.category === 'MANAGER') {
      setActiveModal('none');
      alert('Hire talent agents and personal managers in World → Talent Representation. They pitch offers to your Inbox too!');
      return;
    }
    if (player.money < item.weeklyCost) {
      setFeedback({
        type: 'error',
        msg: `Insufficient funds to hire/renew ${item.providerName} ($${item.weeklyCost.toLocaleString()} required).`,
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Hire professional (agents/managers only via marketplace)
    let updatedRep = { ...player.representation };
    if (item.category === 'LAWYER') {
      repState.lawFirm.hiredFirmTier = 'Solo Attorney';
      repState.lawFirm.weeklyRetainerFee = item.weeklyCost || 2500;
      RepresentationService.saveState(repState);
    }
    if (item.category === 'PUBLICIST') {
      repState.pr.hiredAgencyTier = 'Boutique Agency';
      repState.pr.weeklyRetainerFee = item.weeklyCost || 1200;
      RepresentationService.saveState(repState);
    }

    updatePlayer({ representation: updatedRep });

    setFeedback({
      type: 'success',
      msg: `Contract successfully signed with ${item.providerName}! Weekly retainer active.`,
    });
    RepresentationService.saveState(repState);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-3xl rounded-3xl flex flex-col overflow-hidden border shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3 text-amber-400">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">RETAINER & REPRESENTATION HUB</h2>
              <p className="text-[11px] text-amber-300 font-medium">
                Manage 7 key professional retainers: Hire, renew, replace or cancel contracts immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 mx-5 mt-4 rounded-2xl border text-xs font-black shadow-lg flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Retainer Grid List */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {retainersList.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between space-y-3 transition-all ${
                  item.isHired
                    ? 'bg-amber-500/10 border-amber-400/50 shadow-lg'
                    : 'bg-black/40 border-white/10 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Top Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-xl bg-amber-400/20 text-amber-300 font-black text-[9px] uppercase border border-amber-400/30">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ${item.weeklyCost.toLocaleString()} / wk
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white">{item.title}</h3>
                  <p className="text-xs text-amber-300 font-bold">{item.providerName}</p>
                </div>

                {/* Benefits List */}
                <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5 space-y-1 text-[10px]">
                  <span className="text-gray-400 uppercase font-extrabold block text-[9px]">Contract Perks & Benefits:</span>
                  {item.benefitsList.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-gray-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Contract Meta & Actions */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-[9px] block">Contract Remaining:</span>
                    <span className="text-white font-mono font-bold text-xs">{item.contractWeeksRemaining} Weeks</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isHired ? (
                      <button
                        onClick={() => setSelectedForCancel(item)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-black text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        {item.category === 'LAWYER' ? 'Fire Lawyer' : 'Cancel Retainer'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleHireOrRenew(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer shadow"
                      >
                        {item.category === 'LAWYER' ? 'Hire Lawyer' : 'Retain Firm'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellation Confirmation Modal */}
        {selectedForCancel && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-3xl bg-gray-950 border-2 border-rose-500/50 shadow-2xl space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-black text-white uppercase">Terminate Representation Contract?</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Are you sure you want to dismiss <strong className="text-amber-300">{selectedForCancel.providerName}</strong>?
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs space-y-1 text-left">
                <div className="flex justify-between text-gray-300">
                  <span>Weekly Retainer Fee Saved:</span>
                  <strong className="text-emerald-400">${selectedForCancel.weeklyCost.toLocaleString()} / wk</strong>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Contract Termination Penalty:</span>
                  <strong className="text-rose-400">${selectedForCancel.cancellationPenaltyFee.toLocaleString()}</strong>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 italic">
                Immediate cancellation stops future weekly deductions instantly and clears associated perks.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedForCancel(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 text-white font-bold text-xs hover:bg-gray-700 cursor-pointer"
                >
                  Keep Contract
                </button>

                <button
                  onClick={handleConfirmCancelContract}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-black font-black text-xs hover:bg-rose-400 cursor-pointer shadow-lg"
                >
                  Confirm & Pay Penalty
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
