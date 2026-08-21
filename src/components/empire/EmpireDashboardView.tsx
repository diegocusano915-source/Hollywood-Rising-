/**
 * HOLLYWOOD RISING - Empire Dashboard Sub-View
 * Phase 5 Empire Scene: Consolidated Mogul Analytics, asset distribution & empire activity ticker.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState } from '../../types/empire';
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  DollarSign,
  Building2,
  Briefcase,
  Building,
  Crown,
  Activity,
  Layers,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onBack: () => void;
}

export const EmpireDashboardView: React.FC<Props> = ({ empireState, onBack }) => {
  const { player } = useGame();

  const businessValuation = empireState.businesses.reduce((acc, b) => acc + b.totalValuation, 0);
  const realEstateValuation = empireState.realEstate.reduce((acc, r) => acc + r.currentValuation, 0);
  const holdingValuation = empireState.holdingCompany.isFormed ? empireState.holdingCompany.totalValuation : 0;

  // NO DOUBLE COUNT: when the holding exists, its valuation already IS the
  // sum of businesses + properties
  const assetValuation = empireState.holdingCompany.isFormed
    ? (empireState.holdingCompany.totalValuation || 0)
    : businessValuation + realEstateValuation;
  const totalEmpireValuation = player.money + assetValuation;
  void holdingValuation;

  // Real weekly numbers straight off the latest recorded report snapshot
  const latestReport = (empireState.reports?.reportsHistory || [])[0];
  const weeklyBizRev = empireState.businesses.reduce((acc, b) => acc + b.weeklyRevenue, 0);
  const weeklyRERent = empireState.realEstate.reduce((acc, r) => acc + r.weeklyRentalIncome, 0);
  const weeklyRECost = empireState.realEstate.reduce((acc, r) => acc + r.weeklyMaintenanceCost, 0);
  const hubsNet = (empireState.globalHubs || []).reduce((acc, h) => acc + h.weeklyRegionalRevenue - h.weeklyOperatingExpense, 0);
  const academyNet = empireState.actingAcademy.isOpen
    ? (empireState.actingAcademy.weeklyTuitionIncome || 0) - (empireState.actingAcademy.weeklyOperationalCost || 0)
    : 0;
  const weeklyNetCashFlow = latestReport?.segments
    ? latestReport.segments.business + latestReport.segments.realEstate + latestReport.segments.hubs + latestReport.segments.academy
    : weeklyBizRev + weeklyRERent - weeklyRECost + hubsNet + academyNet;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Empire Dashboard & Analytics</h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Empire Net Worth</span>
          <span className="text-lg font-black text-amber-300">${totalEmpireValuation.toLocaleString()}</span>
        </div>
      </div>

      {/* Mogul Tier Banner */}
      <div className="p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-black to-amber-500/20 shadow-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
            Current Empire Rank
          </span>
          <Crown className="w-6 h-6 text-amber-400" />
        </div>
        <h3 className="text-2xl font-black text-white">
          {totalEmpireValuation > 100000000
            ? 'GLOBAL ENTERPRISE MOGUL'
            : totalEmpireValuation > 25000000
            ? 'HOLLYWOOD MEDIA TYCOON'
            : totalEmpireValuation > 5000000
            ? 'MULTI-SECTOR INDUSTRIALIST'
            : 'EMERGING VENTURE MOGUL'}
        </h3>
        <p className="text-xs text-gray-300">
          Consolidated portfolio includes {empireState.businesses.length} commercial businesses, {empireState.realEstate.length} real estate holdings, {empireState.globalHubs.length} international offices, {empireState.actingAcademy.isOpen ? `an academy with ${empireState.actingAcademy.students.length} students` : 'no academy'} and {(empireState.rivalries || []).filter((r) => !r.resolved).length} active feuds.
        </p>
      </div>

      {/* Division strip — every engine, live */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {([
          ['Businesses', empireState.businesses.filter((b) => b.status === 'Active').length, 'text-purple-300'],
          ['Properties', empireState.realEstate.length, 'text-sky-300'],
          ['Global Offices', (empireState.globalHubs || []).length, 'text-cyan-300'],
          ['Academy Alumni', empireState.actingAcademy.totalGraduates || 0, 'text-emerald-300'],
          ['Active Feuds', (empireState.rivalries || []).filter((r) => !r.resolved).length, 'text-red-300'],
        ] as const).map(([label, n, tone]) => (
          <div key={label} className="p-2.5 rounded-2xl bg-black/60 border border-white/10">
            <span className="text-[8px] text-gray-500 uppercase font-black block">{label}</span>
            <span className={`text-sm font-black font-mono ${tone}`}>{n}</span>
          </div>
        ))}
      </div>

      {/* Asset Allocation Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-1">
          <span className="text-[9px] text-gray-400 uppercase font-bold block">Liquid Cash</span>
          <span className="text-base font-black text-emerald-400">${player.money.toLocaleString()}</span>
          <p className="text-[10px] text-gray-400">Available Capital</p>
        </div>

        <div className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-1">
          <span className="text-[9px] text-gray-400 uppercase font-bold block">Business Portfolio</span>
          <span className="text-base font-black text-purple-300">${businessValuation.toLocaleString()}</span>
          <p className="text-[10px] text-gray-400">{empireState.businesses.length} Active Ventures</p>
        </div>

        <div className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-1">
          <span className="text-[9px] text-gray-400 uppercase font-bold block">Commercial Real Estate</span>
          <span className="text-base font-black text-sky-300">${realEstateValuation.toLocaleString()}</span>
          <p className="text-[10px] text-gray-400">{empireState.realEstate.length} Properties</p>
        </div>

        <div className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-1">
          <span className="text-[9px] text-gray-400 uppercase font-bold block">Net Weekly Yield</span>
          <span className="text-base font-black text-amber-300">+${weeklyNetCashFlow.toLocaleString()}/wk</span>
          <p className="text-[10px] text-gray-400">Passive Income</p>
        </div>
      </div>

      {/* Empire End Week Event Log Ticker */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" /> Recent Empire Event Log
        </h4>

        {empireState.empireLogs.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">
            No empire events recorded yet. Advance the week to trigger weekly revenue and market updates!
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {empireState.empireLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-black/60 border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 block">{log.title}</span>
                  <p className="text-gray-300 text-[11px]">{log.description}</p>
                </div>
                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-3">
                  W{log.week}, Y{log.year}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
