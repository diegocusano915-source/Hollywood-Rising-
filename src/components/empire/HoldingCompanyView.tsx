/**
 * HOLLYWOOD RISING - Holding Company (Terminal Redesign)
 * A live conglomerate ledger in the Star Stocks visual language: real
 * valuation from every owned business + property, a 26-week valuation trend,
 * per-asset ledger rows, the C-Suite roster and the real dividend math.
 * Nothing here is static — every number moves with the weekly tick.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, Executive, ExecutiveRole } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Building2,
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MapPin,
  Crown,
  UserPlus,
  Landmark,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const HQ_LOCATIONS = [
  'Beverly Hills, Los Angeles',
  'Manhattan, New York',
  'Mayfair, London',
  'Ginza, Tokyo',
  'Eiffel Quarter, Paris',
  'Downtown, Dubai',
];

const EXECUTIVE_ROLES: ExecutiveRole[] = [
  'CEO',
  'COO',
  'CFO',
  'Legal Counsel',
  'Operations Director',
  'Marketing Director',
  'HR Director',
];

const fmtM = (n: number) =>
  n >= 1_000_000_000 ? `$${(n / 1_000_000_000).toFixed(2)}B` : n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`;

function Trend({ history }: { history: number[] }) {
  if (!history || history.length < 2) {
    return <div className="h-16 rounded-xl bg-white/5 flex items-center justify-center text-[9px] text-gray-600 font-mono">BUILDING 26-WEEK TREND…</div>;
  }
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = Math.max(1, max - min);
  const pts = history.map((v, i) => `${(i / (history.length - 1)) * 100},${56 - ((v - min) / range) * 50 - 3}`).join(' ');
  const up = history[history.length - 1] >= history[0];
  return (
    <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="w-full h-16">
      <defs>
        <linearGradient id="holdGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? '#34d399' : '#f87171'} stopOpacity="0.35" />
          <stop offset="100%" stopColor={up ? '#34d399' : '#f87171'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,56 ${pts} 100,56`} fill="url(#holdGrad)" />
      <polyline points={pts} fill="none" stroke={up ? '#34d399' : '#f87171'} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export const HoldingCompanyView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player, persistNow } = useGame();
  const holding = empireState.holdingCompany;

  const [companyName, setCompanyName] = useState(holding.name || `${player.lastName} Global Holdings`);
  const [hq, setHq] = useState(HQ_LOCATIONS[0]);
  const [industry, setIndustry] = useState('Media, Tech & Real Estate');
  const [selectedRoleToHire, setSelectedRoleToHire] = useState<ExecutiveRole>('COO');

  const formationCost = 250000;

  // ---- REAL DATA: every number derived from owned assets ----
  const liveBusinesses = empireState.businesses.filter((b) => b.status !== 'Bankrupt' && b.status !== 'Sold');
  const bizVal = liveBusinesses.reduce((a, b) => a + b.totalValuation, 0);
  const reVal = empireState.realEstate.reduce((a, r) => a + r.currentValuation, 0);
  const liveValuation = bizVal + reVal;
  const bizWeeklyNet = liveBusinesses.reduce((a, b) => a + (b.netProfit || 0), 0);
  const reWeeklyNet = empireState.realEstate.reduce((a, r) => a + r.weeklyRentalIncome - r.weeklyMaintenanceCost, 0);
  const weeklyNet = bizWeeklyNet + reWeeklyNet;
  const history = holding.valuationHistory || [];
  const weekDelta = history.length >= 2 ? liveValuation - history[history.length - 1] : 0;

  const handleFormCompany = () => {
    if (player.money < formationCost) {
      alert(`Insufficient cash! Forming a Holding Company requires $${formationCost.toLocaleString()}.`);
      return;
    }
    player.money -= formationCost;
    persistNow();
    const updated: EmpireFullState = {
      ...empireState,
      holdingCompany: {
        ...holding,
        isFormed: true,
        name: companyName,
        headquarters: hq,
        industryFocus: industry,
        ceoName: `${player.firstName} ${player.lastName}`,
        totalValuation: 500000,
      },
    };
    EmpireService.saveState(updated);
    onUpdateState(updated);
  };

  const handleHireExecutive = (role: ExecutiveRole) => {
    const salary = 250000 + Math.floor(Math.random() * 250000);
    const hiringCost = Math.floor(salary * 0.2);
    if (player.money < hiringCost) {
      alert(`Insufficient cash to retain executive search firm ($${hiringCost.toLocaleString()} fee).`);
      return;
    }
    player.money -= hiringCost;
    persistNow();
    const names = ['Julian Sterling', 'Evelyn Vance', 'Dominic Cross', 'Victoria Thorne', 'Alistair Vance', 'Sophia Montgomery', 'Marcus Drake'];
    const candidateName = names[Math.floor(Math.random() * names.length)];
    const newExec: Executive = {
      id: `exec_${Date.now()}`,
      name: candidateName,
      role,
      salary,
      bonus: Math.floor(salary * 0.15),
      efficiency: Math.floor(75 + Math.random() * 20),
      morale: Math.floor(80 + Math.random() * 15),
      leadership: Math.floor(70 + Math.random() * 25),
      experience: Math.floor(75 + Math.random() * 20),
      negotiation: Math.floor(70 + Math.random() * 25),
      creativity: Math.floor(65 + Math.random() * 30),
      loyalty: Math.floor(80 + Math.random() * 15),
      performance: Math.floor(75 + Math.random() * 20),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&q=80&w=150`,
      background: 'Ex-Goldman Sachs / CAA Senior Managing Director',
      yearsEmployed: 1,
    };
    const updated: EmpireFullState = {
      ...empireState,
      holdingCompany: {
        ...holding,
        executives: [...holding.executives.filter((e) => e.role !== role), newExec],
      },
    };
    EmpireService.saveState(updated);
    onUpdateState(updated);
  };

  // ---- PRE-FORMATION: setup flow ----
  if (!holding.isFormed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer">
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Holding Company</h2>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-black via-gray-900 to-black space-y-5 shadow-2xl">
          <div className="text-center space-y-1">
            <Landmark className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-lg font-black text-white">FORM YOUR CONGLOMERATE</h3>
            <p className="text-[11px] text-gray-400">
              One parent company over every business and property you own. Its valuation is the LIVE sum of your
              assets — it breathes with the market every single week.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-white text-sm font-bold focus:border-amber-400/60 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Headquarters</label>
              <div className="grid grid-cols-2 gap-2">
                {HQ_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setHq(loc)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer border ${
                      hq === loc ? 'bg-amber-400 text-black border-amber-300' : 'bg-black/50 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Industry Focus</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-white text-sm font-bold focus:border-amber-400/60 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleFormCompany}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-sm hover:scale-[1.01] transition-all cursor-pointer shadow-xl"
          >
            FILE INCORPORATION — {fmtM(formationCost)}
          </button>
          <p className="text-[9px] text-gray-600 font-mono text-center">
            Current holdings that will roll up: {liveBusinesses.length} businesses ({fmtM(bizVal)}) · {empireState.realEstate.length} properties ({fmtM(reVal)})
          </p>
        </div>
      </div>
    );
  }

  // ---- FORMED: live terminal ----
  const execSalaryWeekly = holding.executives.reduce((a, e) => a + Math.floor(e.salary / 52), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer">
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">{holding.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-gray-300 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" /> {holding.headquarters}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">{holding.industryFocus}</span>
        </div>
      </div>

      {/* Valuation terminal header */}
      <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-black via-gray-900 to-black space-y-3 shadow-2xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block">Holding Valuation (live sum of all assets)</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white font-mono">{fmtM(liveValuation)}</span>
              <span className={`text-xs font-mono font-black flex items-center gap-1 ${weekDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {weekDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {weekDelta >= 0 ? '+' : '−'}{fmtM(Math.abs(weekDelta))} this week
              </span>
            </div>
          </div>
          <div className="text-right text-[9px] font-mono text-gray-500">
            <span className="block">CHAIRMAN & CEO: <span className="text-amber-300 font-bold">{holding.ceoName}</span></span>
            <span className="block">YOUR EQUITY: <span className="text-white font-bold">{holding.equitySharePercent}%</span> · DIVIDEND RATE: <span className="text-white font-bold">{holding.dividendPayoutRate}%</span></span>
            <span className="block">WEEKLY C-SUITE PAYROLL: <span className="text-red-300 font-bold">−{fmtM(execSalaryWeekly)}</span></span>
          </div>
        </div>
        <Trend history={history.length > 1 ? history : [liveValuation, liveValuation]} />

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Weekly Net (all assets)</span>
            <span className={`text-sm font-black font-mono ${weeklyNet >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>{weeklyNet >= 0 ? '+' : '−'}{fmtM(Math.abs(weeklyNet))}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Business Division</span>
            <span className="text-sm font-black text-white font-mono">{fmtM(bizVal)} · {liveBusinesses.length} units</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Property Division</span>
            <span className="text-sm font-black text-white font-mono">{fmtM(reVal)} · {empireState.realEstate.length} deeds</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Est. Weekly Dividend</span>
            <span className="text-sm font-black text-amber-300 font-mono">
              {weeklyNet > 0 ? fmtM(Math.floor((weeklyNet * (holding.dividendPayoutRate / 100) * (holding.equitySharePercent / 100)) / 1)) : '$0'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Asset ledger */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Consolidated Asset Ledger
          </h3>
          <div className="rounded-3xl border border-white/10 bg-black/60 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-white/5 text-[9px] font-black uppercase text-gray-500 tracking-wider">
              <span className="col-span-5">Asset</span>
              <span className="col-span-2">Valuation</span>
              <span className="col-span-2">Weekly</span>
              <span className="col-span-3 text-right">Status</span>
            </div>
            {liveBusinesses.length === 0 && empireState.realEstate.length === 0 ? (
              <p className="px-4 py-6 text-xs text-gray-500 text-center">
                No assets under the holding yet — launch a Business Venture or acquire property and it rolls up here automatically.
              </p>
            ) : (
              <>
                {liveBusinesses.map((b) => (
                  <div key={b.id} className="grid grid-cols-12 gap-2 px-4 py-2.5 border-t border-white/5 items-center text-[11px] hover:bg-white/5">
                    <span className="col-span-5 font-bold text-white flex items-center gap-1.5 min-w-0">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" /> <span className="truncate">{b.name}</span>
                    </span>
                    <span className="col-span-2 font-mono text-gray-200">{fmtM(b.totalValuation)}</span>
                    <span className={`col-span-2 font-mono font-bold ${(b.netProfit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(b.netProfit || 0) >= 0 ? '+' : '−'}{fmtM(Math.abs(b.netProfit || 0))}
                    </span>
                    <span className="col-span-3 text-right">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${
                        b.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : b.status === 'Distressed' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                      }`}>{b.status.toUpperCase()}</span>
                    </span>
                  </div>
                ))}
                {empireState.realEstate.map((r) => (
                  <div key={r.id} className="grid grid-cols-12 gap-2 px-4 py-2.5 border-t border-white/5 items-center text-[11px] hover:bg-white/5">
                    <span className="col-span-5 font-bold text-white flex items-center gap-1.5 min-w-0">
                      <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" /> <span className="truncate">{r.name}</span>
                    </span>
                    <span className="col-span-2 font-mono text-gray-200">{fmtM(r.currentValuation)}</span>
                    <span className={`col-span-2 font-mono font-bold ${r.weeklyRentalIncome - r.weeklyMaintenanceCost >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      +{fmtM(r.weeklyRentalIncome)}
                    </span>
                    <span className="col-span-3 text-right">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${r.isLeased ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {r.isLeased ? `RENTED T${r.tierLevel}` : 'VACANT'}
                      </span>
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* C-Suite */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" /> C-Suite ({holding.executives.length}/7)
          </h3>
          <div className="space-y-2">
            {holding.executives.map((e) => (
              <div key={e.id} className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-white truncate">{e.name}</span>
                  <span className="text-[9px] font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg shrink-0">{e.role}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {([['EFF', e.efficiency], ['LDR', e.leadership], ['LOY', e.loyalty], ['PERF', e.performance]] as const).map(([l, v]) => (
                    <div key={l} className="rounded-lg bg-black/40 border border-white/5 py-1">
                      <span className="text-[7px] text-gray-500 font-black block">{l}</span>
                      <span className="text-[10px] font-mono font-black text-white">{v}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[9px] text-gray-500 font-mono block">Salary {fmtM(e.salary)}/yr · {e.yearsEmployed}yr tenure</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <span className="text-[10px] font-black uppercase text-gray-400 block">Retain an executive</span>
            <select
              value={selectedRoleToHire}
              onChange={(e) => setSelectedRoleToHire(e.target.value as ExecutiveRole)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-bold outline-none"
            >
              {EXECUTIVE_ROLES.filter((r) => !holding.executives.some((e) => e.role === r)).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={() => handleHireExecutive(selectedRoleToHire)}
              disabled={holding.executives.length >= 7}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-black text-[11px] font-black hover:bg-amber-300 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-3.5 h-3.5" /> RUN EXEC SEARCH
            </button>
            <p className="text-[8px] text-gray-600 font-mono">Search firm costs 20% of the salary package. Salaries hit weekly payroll automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
