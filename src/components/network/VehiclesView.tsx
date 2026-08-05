/**
 * HOLLYWOOD RISING - Vehicles View (Phase 4 Network)
 * 35 Luxury Automobiles & Supercars, Garage System, Social Clout Boosts, Insurance & Upkeep.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, VehicleItem, VehicleTier } from '../../types/network';
import { NetworkService } from '../../services/networkService';
import {
  Car,
  ArrowLeft,
  DollarSign,
  Zap,
  Sparkles,
  CheckCircle2,
  Gauge,
  Flame,
  ShieldAlert,
  Star,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface VehiclesViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTierFilter, setActiveTierFilter] = useState<VehicleTier | 'ALL' | 'GARAGE'>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  const vehicles = networkState.vehicles || [];

  const handleBuyVehicle = (vehicle: VehicleItem) => {
    if (player.money < vehicle.price) {
      setFeedback(`Insufficient Funds! Required: $${vehicle.price.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const updatedVehicles = vehicles.map((v) => {
      if (v.id === vehicle.id) {
        return {
          ...v,
          isOwned: true,
          isPrimaryDrive: true,
        };
      }
      return {
        ...v,
        isPrimaryDrive: v.id === vehicle.id ? true : false,
      };
    });

    const nextState: NetworkFullState = {
      ...networkState,
      vehicles: updatedVehicles,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`PURCHASED ${vehicle.name} for $${vehicle.price.toLocaleString()}! Delivered to your garage.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSetPrimaryDrive = (vehicle: VehicleItem) => {
    const updatedVehicles = vehicles.map((v) => ({
      ...v,
      isPrimaryDrive: v.id === vehicle.id,
    }));

    const nextState: NetworkFullState = {
      ...networkState,
      vehicles: updatedVehicles,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`Keys selected! You are now driving the ${vehicle.name}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSellVehicle = (vehicle: VehicleItem) => {
    const sellPrice = Math.round(vehicle.price * 0.85);

    const updatedVehicles = vehicles.map((v) => {
      if (v.id === vehicle.id) {
        return {
          ...v,
          isOwned: false,
          isPrimaryDrive: false,
        };
      }
      return v;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      vehicles: updatedVehicles,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`SOLD ${vehicle.name} for $${sellPrice.toLocaleString()}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const ownedCount = vehicles.filter((v) => v.isOwned).length;
  const activeVehicle = vehicles.find((v) => v.isOwned && v.isPrimaryDrive);

  const filteredVehicles = vehicles.filter((v) => {
    if (activeTierFilter === 'GARAGE') return v.isOwned;
    if (activeTierFilter === 'ALL') return true;
    return v.tier === activeTierFilter;
  });

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
            <Car className="w-4 h-4 text-amber-400" />
            Beverly Hills Luxury Dealership
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
              <Car className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                HOLLYWOOD GARAGE & DEALS
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">LUXURY AUTOMOBILES</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Garage Vehicles</span>
            <span className="text-lg font-black text-amber-400">{ownedCount} Owned</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* ACTIVE PRIMARY DRIVE DISPLAY */}
      {activeVehicle && (
        <div className="p-4 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-black to-black flex items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <img src={activeVehicle.imageUrl} alt={activeVehicle.name} className="w-16 h-12 rounded-2xl object-cover border border-white/10" />
            <div>
              <span className="text-[9px] font-black text-amber-400 uppercase">ACTIVE DAILY DRIVE</span>
              <h3 className="text-sm font-black text-white">{activeVehicle.name}</h3>
              <span className="text-xs text-emerald-400 font-bold">+{activeVehicle.cloutBonus} Social Clout Bonus</span>
            </div>
          </div>

          <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30">
            {activeVehicle.topSpeed}
          </span>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="p-2 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Showroom' },
          { id: 'GARAGE', label: `My Garage (${ownedCount})` },
          { id: 'Small', label: 'Standard' },
          { id: 'Medium', label: 'Executive' },
          { id: 'High', label: 'Supercars' },
          { id: 'Elite', label: 'Hypercars & Vintage' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTierFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeTierFilter === tab.id
                ? 'bg-amber-400 text-black shadow-lg scale-102'
                : 'bg-black/40 text-gray-300 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VEHICLES SHOWROOM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVehicles.map((veh) => (
          <div
            key={veh.id}
            className="p-5 rounded-3xl border border-white/10 bg-black/50 hover:bg-black/70 transition-all space-y-4 shadow-xl overflow-hidden group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={veh.imageUrl}
                  alt={veh.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black text-amber-300">
                  {veh.brand} • {veh.tier}
                </div>

                {veh.isOwned && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-emerald-500 text-black font-black text-xs shadow-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>IN GARAGE</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-white">{veh.name}</h3>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">{veh.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-extrabold bg-black/60 p-2.5 rounded-2xl border border-white/5 text-gray-300">
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Price</span>
                  <span className="text-amber-300 font-black">${veh.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Top Speed</span>
                  <span className="text-sky-300 font-black">{veh.topSpeed}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block uppercase">Clout Boost</span>
                  <span className="text-pink-400 font-black">+{veh.cloutBonus} Clout</span>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="pt-2">
              {!veh.isOwned ? (
                <button
                  onClick={() => handleBuyVehicle(veh)}
                  className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg"
                >
                  BUY AUTOMOBILE (${veh.price.toLocaleString()})
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleSetPrimaryDrive(veh)}
                    className={`w-full py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer border ${
                      veh.isPrimaryDrive
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-black/60 text-gray-300 border-white/10 hover:border-amber-400'
                    }`}
                  >
                    {veh.isPrimaryDrive ? 'CURRENT DAILY DRIVE' : 'SELECT AS DAILY DRIVE'}
                  </button>

                  <button
                    onClick={() => handleSellVehicle(veh)}
                    className="w-full py-2 rounded-2xl font-black text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer"
                  >
                    SELL VEHICLE (85% VALUE)
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
