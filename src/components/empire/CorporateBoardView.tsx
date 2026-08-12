/**
 * HOLLYWOOD RISING - Corporate Board & Acquisition Engine Sub-View
 * Phase 5 Empire Scene: Board Directorships, M&A Acquisitions, Board Voting Simulation.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, BoardSeatOption, AcquisitionTargetCompany, BusinessVenture } from '../../types/empire';
import { EmpireService, BOARD_SEAT_CATALOG } from '../../services/empireService';
import { Users, Building, ShieldCheck, DollarSign, Vote, CheckCircle2, AlertTriangle, Sparkles, Trophy } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

export const CorporateBoardView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player , persistNow } = useGame();
  const boardState = empireState?.boardSeats || [];
  const acqCatalog = empireState.acquisitionsCatalog || [];
  const [selectedAcquisition, setSelectedAcquisition] = useState<AcquisitionTargetCompany | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApplyBoardSeat = (seat: BoardSeatOption) => {
    setErrorMsg(null);
    setNotification(null);

    if (boardState.some((s) => s.companyName === seat.companyName)) {
      setErrorMsg(`You already sit on the Board of Directors of ${seat.companyName}.`);
      return;
    }

    if ((player.fameXp || 0) < seat.minFameRequired) {
      setErrorMsg(`Cannot Accept Board Seat: ${seat.companyName} requires at least ${seat.minFameRequired} Fame XP (Current: ${player.fameXp || 0}).`);
      return;
    }

    const newSeat = {
      id: `board_${Date.now()}`,
      companyName: seat.companyName,
      industry: seat.industry,
      annualCompensation: seat.annualCompensation,
      stockOptionsGrant: seat.stockOptionsGrant,
      votingPowerSharesPercent: 2.5,
      boardMeetingFrequency: 'Quarterly' as const,
      status: 'Active' as const,
      joinedWeek: player.dateWeek,
      joinedYear: player.dateYear,
    };

    const updated: EmpireFullState = {
      ...empireState,
      boardSeats: [...boardState, newSeat],
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`👔 BOARD APPOINTMENT: Elected to the Board of Directors of ${seat.companyName}! Retainer: $${seat.annualCompensation.toLocaleString()}/yr.`);
  };

  const handleAcquireTarget = (target: AcquisitionTargetCompany) => {
    const reqs = target.requirements;

    // 1. Check Cash
    if (player.money < target.askingPrice) {
      alert(`Acquisition Rejected: You need $${target.askingPrice.toLocaleString()} in liquid cash. Current: $${player.money.toLocaleString()}.`);
      return;
    }

    // 2. Check Player / Studio Stats
    const playerBizRep = Math.floor(player.fameXp / 100);
    const studioRep = Math.min(100, Math.floor(player.fameXp / 80));
    const investorConf = Math.min(100, Math.floor(player.fameXp / 10));

    if (playerBizRep < reqs.minBusinessRep) {
      alert(`Board Vote Failed: Business Reputation (${playerBizRep}) is below the required ${reqs.minBusinessRep}.`);
      return;
    }

    if (studioRep < reqs.minStudioRep) {
      alert(`Board Vote Failed: Studio Reputation (${studioRep}) is below the required ${reqs.minStudioRep}.`);
      return;
    }

    if (investorConf < reqs.minInvestorConfidence) {
      alert(`Board Vote Failed: Investor Confidence (${investorConf}%) is below the required ${reqs.minInvestorConfidence}%.`);
      return;
    }

    // Perform Board Voting Simulation
    const votesFor = 7 + Math.floor(Math.random() * 4);
    const votesAgainst = Math.floor(Math.random() * 2);

    // Deduct cash
    player.money -= target.askingPrice;
    persistNow();

    // Convert to Active Business Venture
    const newAcquiredVenture: BusinessVenture = {
      id: `biz_acq_${Date.now()}`,
      name: target.companyName,
      industry: target.industry,
      logo: 'Building2',
      cashPool: Math.floor(target.askingPrice * 0.15),
      weeklyRevenue: target.weeklyRevenue,
      weeklyExpenses: target.weeklyExpenses,
      netProfit: target.weeklyRevenue - target.weeklyExpenses,
      totalValuation: target.valuation,
      marketShare: 15,
      customerRating: 4.8,
      isPublic: false,
      totalShares: 1000000,
      sharePrice: Math.floor(target.valuation / 1000000),
      products: [],
      staff: [{ role: 'Support', count: 50, weeklyCostPerPerson: 1000 }],
      executives: [],
      competitors: [],
      status: 'Active',
      fundingRaised: target.askingPrice,
      foundedWeek: player.dateWeek,
      foundedYear: player.dateYear,
    };

    const updatedCatalog = acqCatalog.map((c) => (c.id === target.id ? { ...c, isAcquired: true } : c));

    const updated: EmpireFullState = {
      ...empireState,
      businesses: [...empireState.businesses, newAcquiredVenture],
      acquisitionsCatalog: updatedCatalog,
      empireLogs: [
        {
          id: `log_acq_${Date.now()}`,
          title: `Acquired ${target.companyName}`,
          description: `Board unanimously approved the $${target.askingPrice.toLocaleString()} M&A buyout of ${target.companyName}.`,
          week: player.dateWeek,
          year: player.dateYear,
        },
        ...empireState.empireLogs,
      ],
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🎉 BOARD VOTE UNANIMOUSLY PASSED (${votesFor} FOR / ${votesAgainst} AGAINST):\nAcquired ${target.companyName} for $${target.askingPrice.toLocaleString()}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Corporate Board & M&A Acquisitions</h2>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-right">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Liquid Buyout Reserve</span>
          <span className="text-base font-black text-emerald-400 font-mono">
            ${player.money.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Notification and Error Banners */}
      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}

      {/* Active Board Seats: 3 Cards Per Row Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Your Board Directorships ({boardState.length})
          </span>
          <span className="text-xs text-indigo-400 font-bold">Earns Annual Board Compensation & Equity</span>
        </div>

        {boardState.length === 0 ? (
          <div className="p-8 rounded-3xl border border-white/10 bg-black/60 text-center text-xs text-gray-400">
            You do not sit on any external corporate boards yet. Apply for board seats below!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {boardState.map((seat) => (
              <div
                key={seat.id}
                className="p-5 rounded-3xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                    {seat.industry}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Board Director
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{seat.companyName}</h4>
                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Retainer:</span>
                    <span className="text-emerald-400 font-bold">${seat.annualCompensation.toLocaleString()}/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock Grant:</span>
                    <span className="text-amber-300 font-bold">${seat.stockOptionsGrant.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* M&A Acquisition Opportunities: 3 Cards Per Row Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Corporate Acquisition Targets ({acqCatalog.length})
          </span>
          <span className="text-xs text-amber-300 font-bold">Requires Unanimous Board Approval</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {acqCatalog.map((target) => {
            const isAcquired = target.isAcquired;

            return (
              <div
                key={target.id}
                className={`p-5 rounded-3xl border backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                  isAcquired
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-white/10 bg-black/60 hover:border-amber-500/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                      {target.industry}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      Valuation: ${target.valuation.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{target.companyName}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{target.description}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asking Price:</span>
                    <span className="text-amber-300 font-bold">${target.askingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weekly Revenue:</span>
                    <span className="text-emerald-400 font-bold">${target.weeklyRevenue.toLocaleString()}/wk</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Growth Potential:</span>
                    <span className="text-sky-300 font-bold">{target.growthPotential}/100</span>
                  </div>
                </div>

                {!isAcquired ? (
                  <button
                    onClick={() => handleAcquireTarget(target)}
                    className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-lg"
                  >
                    SUBMIT TO BOARD FOR BUYOUT
                  </button>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs text-center">
                    ACQUIRED SUBSIDIARY
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* External Board Seat Opportunities: 3 Cards Per Row Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            External Board Seat Opportunities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BOARD_SEAT_CATALOG.map((seat, idx) => {
            const isSitting = boardState.some((s) => s.companyName === seat.companyName);

            return (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-indigo-400">{seat.industry}</span>
                  <h4 className="text-base font-black text-white">{seat.companyName}</h4>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Annual Compensation:</span>
                      <span className="text-emerald-400 font-bold">${seat.annualCompensation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Req. Fame XP:</span>
                      <span className={(player.fameXp || 0) >= seat.minFameRequired ? "text-emerald-300 font-bold" : "text-rose-400 font-bold"}>
                        {seat.minFameRequired.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>

                {!isSitting ? (
                  <button
                    onClick={() => handleApplyBoardSeat(seat)}
                    className="w-full py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
                  >
                    ACCEPT BOARD SEAT
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs text-center">
                    Active Director
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

