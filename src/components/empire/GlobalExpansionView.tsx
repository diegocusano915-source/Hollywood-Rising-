/**
 * HOLLYWOOD RISING - Global Expansion (LIVING MARKETS)
 * International offices with REAL regional demand that drifts weekly and
 * drives revenue, regional market shifts in the world log, per-office net
 * trend sparklines. Regions compete - demand tiers move, competitors move.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, GlobalHubOption } from '../../types/empire';
import { EmpireService, GLOBAL_HUB_CATALOG } from '../../services/empireService';
import { Globe, MapPin, DollarSign, CheckCircle, Users } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const DEMAND_TONE: Record<string, string> = {
  Explosive: 'bg-red-500',
  High: 'bg-amber-500',
  Moderate: 'bg-sky-500',
  Emerging: 'bg-purple-500',
};

function MiniSpark({ history }: { history: number[] }) {
  if (!history || history.length < 2) {
    return <div className="h-7 rounded-lg bg-white/5 flex items-center justify-center text-[8px] text-gray-600 font-mono">TRACKING…</div>;
  }
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = Math.max(1, max - min);
  const pts = history.map((v, i) => `${(i / (history.length - 1)) * 100},${26 - ((v - min) / range) * 22 - 2}`).join(' ');
  const up = history[history.length - 1] >= history[0];
  return (
    <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="w-full h-7">
      <polyline points={pts} fill="none" stroke={up ? '#34d399' : '#f87171'} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const fmtK = (n: number) => (Math.abs(n) >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`);

export const GlobalExpansionView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player, persistNow } = useGame();
  const hubs = empireState?.globalHubs || [];
  const regions = empireState?.globalRegions || [];

  const totalNet = hubs.reduce((a, h) => a + h.weeklyRegionalRevenue - h.weeklyOperatingExpense, 0);
  const totalStaff = hubs.reduce((a, h) => a + h.localStaffCount, 0);

  const handleEstablishHub = (hub: GlobalHubOption) => {
    if (hubs.some((h) => h.cityName === hub.cityName)) {
      alert(`You already have an active global office in ${hub.cityName}.`);
      return;
    }
    if (player.money < hub.cost) {
      alert(`Insufficient cash! Establishing ${hub.cityName} hub requires $${hub.cost.toLocaleString()}.`);
      return;
    }
    player.money -= hub.cost;
    persistNow();

    const newHub = {
      id: `hub_${Date.now()}`,
      cityName: hub.cityName,
      country: hub.country,
      regionalBonus: hub.regionalBonus,
      establishmentCost: hub.cost,
      weeklyOperatingExpense: hub.weeklyExpense,
      weeklyRegionalRevenue: Math.floor(hub.weeklyExpense * 2.5),
      localStaffCount: 12,
      establishedWeek: player.dateWeek,
      establishedYear: player.dateYear,
      regionDemandPct: 85 + Math.floor(Math.random() * 25),
      revenueHistory: [],
    };

    const updated: EmpireFullState = { ...empireState, globalHubs: [...hubs, newHub] };
    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🌐 GLOBAL EXPANSION: Opened international headquarters in ${hub.cityName}, ${hub.country}!\n\nRevenue follows that region's live demand - it drifts every week.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer">
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Global Expansion</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-center">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Offices</span>
            <span className="text-sm font-black text-white font-mono">{hubs.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-center">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Weekly Net</span>
            <span className={`text-sm font-black font-mono ${totalNet >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
              {totalNet >= 0 ? '+' : '−'}{fmtK(Math.abs(totalNet))}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-center">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Staff</span>
            <span className="text-sm font-black text-sky-300 font-mono">{totalStaff}</span>
          </div>
        </div>
      </div>

      {/* Active offices */}
      {hubs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hubs.map((hub) => {
            const net = hub.weeklyRegionalRevenue - hub.weeklyOperatingExpense;
            const demand = hub.regionDemandPct || 100;
            const demandLabel = demand >= 125 ? 'BOOMING' : demand >= 100 ? 'STRONG' : demand >= 80 ? 'STEADY' : 'SOFT';
            return (
              <div key={hub.id} className="p-4 rounded-3xl border border-sky-500/30 bg-black/60 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">{hub.country}</span>
                    <span className="text-[9px] font-black text-gray-500 font-mono">EST. W{hub.establishedWeek}, {hub.establishedYear}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{hub.cityName} HQ</h4>
                <p className="text-[10px] text-sky-200">{hub.regionalBonus}</p>

                <MiniSpark history={hub.revenueHistory || []} />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase">
                    <span className="text-gray-400">Regional Demand · {demandLabel}</span>
                    <span className="text-sky-300 font-mono">{demand}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-600 to-cyan-400" style={{ width: `${Math.min(100, (demand / 150) * 100)}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-500 text-[8px] uppercase font-black block">Revenue</span>
                    <span className="text-emerald-300 font-bold">+{fmtK(hub.weeklyRegionalRevenue)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-500 text-[8px] uppercase font-black block">Operating</span>
                    <span className="text-red-300 font-bold">−{fmtK(hub.weeklyOperatingExpense)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-gray-500 text-[8px] uppercase font-black block">Net / Week</span>
                    <span className={net >= 0 ? 'text-emerald-300 font-bold' : 'text-red-300 font-bold'}>{net >= 0 ? '+' : '−'}{fmtK(Math.abs(net))}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Regional markets — live demand tiers */}
      {regions.length > 0 && (
        <div className="p-4 rounded-3xl border border-white/10 bg-black/60 space-y-2.5">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" /> Regional Markets (live demand)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {regions.map((r) => (
              <div key={r.id} className="p-2.5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white">{r.flagEmoji} {r.name}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                    r.marketDemand === 'Explosive' ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : r.marketDemand === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : r.marketDemand === 'Moderate' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  }`}>{r.marketDemand.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.localCompetitorsCount} rivals</span>
                  <span>tax {r.taxRate}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${DEMAND_TONE[r.marketDemand] || 'bg-sky-500'}`} style={{ width: `${r.officesBuilt > 0 ? 70 : 30}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available hubs */}
      <div className="p-4 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">International Capital Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GLOBAL_HUB_CATALOG.map((hub, idx) => {
            const isEstablished = hubs.some((h) => h.cityName === hub.cityName);
            const canAfford = player.money >= hub.cost;
            return (
              <div key={idx} className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-sky-400">{hub.country}</span>
                  <h4 className="text-sm font-black text-white">{hub.cityName}</h4>
                  <p className="text-[11px] text-gray-300">{hub.regionalBonus}</p>
                  <p className="text-[10px] text-amber-300 font-bold mt-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> {fmtK(hub.cost)} · {fmtK(hub.weeklyExpense)}/wk operating
                  </p>
                </div>
                {!isEstablished ? (
                  <button
                    onClick={() => handleEstablishHub(hub)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-black transition-all ${
                      canAfford ? 'bg-sky-500 hover:bg-sky-400 text-white cursor-pointer shadow-md' : 'bg-gray-800 text-gray-500 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'ESTABLISH HEADQUARTERS' : `NEEDS ${fmtK(hub.cost - player.money)} MORE`}
                  </button>
                ) : (
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] text-center">Active Office</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
