/**
 * HOLLYWOOD RISING - Global Expansion Sub-View
 * Phase 5 Empire Scene: International hubs in London, Tokyo, Paris, Dubai, Seoul & Beijing.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, GlobalHubOption } from '../../types/empire';
import { EmpireService, GLOBAL_HUB_CATALOG } from '../../services/empireService';
import { Globe, MapPin, Building, DollarSign, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

export const GlobalExpansionView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player , persistNow } = useGame();
  const hubs = empireState?.globalHubs || [];

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
    };

    const updated: EmpireFullState = {
      ...empireState,
      globalHubs: [...hubs, newHub],
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🌐 GLOBAL EXPANSION: Opened international headquarters in ${hub.cityName}, ${hub.country}!`);
  };

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
            <Globe className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Global Expansion</h2>
          </div>
        </div>
      </div>

      {/* Active Global Offices */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <MapPin className="w-5 h-5 text-sky-400" /> Active International Offices ({hubs.length})
        </h3>

        {hubs.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">
            You do not have any international offices established yet. Expand to global capitals below!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hubs.map((hub) => (
              <div key={hub.id} className="p-4 rounded-2xl border border-sky-500/30 bg-sky-500/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">
                    {hub.country}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Established
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{hub.cityName} Headquarters</h4>
                <p className="text-[10px] text-sky-200">{hub.regionalBonus}</p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-gray-300 font-bold">Staff: {hub.localStaffCount} Executives</span>
                  <span className="text-emerald-400 font-bold">
                    +${(hub.weeklyRegionalRevenue - hub.weeklyOperatingExpense).toLocaleString()}/wk
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Expansion Hubs */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
        <h3 className="text-sm font-black text-white uppercase">International Capital Opportunities</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GLOBAL_HUB_CATALOG.map((hub, idx) => {
            const isEstablished = hubs.some((h) => h.cityName === hub.cityName);
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-white/10 bg-black/60 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-sky-400">{hub.country}</span>
                  <h4 className="text-sm font-black text-white">{hub.cityName}</h4>
                  <p className="text-[11px] text-gray-300">{hub.regionalBonus}</p>
                  <p className="text-[10px] text-amber-300 font-bold mt-1">
                    Cost: ${hub.cost.toLocaleString()}
                  </p>
                </div>

                {!isEstablished ? (
                  <button
                    onClick={() => handleEstablishHub(hub)}
                    className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs transition-all cursor-pointer shadow-md mt-2"
                  >
                    ESTABLISH HEADQUARTERS
                  </button>
                ) : (
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] text-center mt-2">
                    Active Office
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
