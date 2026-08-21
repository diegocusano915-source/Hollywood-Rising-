/**
 * HOLLYWOOD RISING - Real Estate Empire (Living Market)
 * Commercial property portfolio on a REAL market: phase shifts every 3-4
 * weeks (Hot / Stable / Cooling / Slump), valuations rise AND fall, rent is
 * earned only when the player leases a property out, renovations raise tier,
 * value and yield. Nothing is static.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, CommercialRealEstate, RealEstateType, RealEstatePhase } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Building,
  Plus,
  DollarSign,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Hammer,
  KeyRound,
  Ban,
  Activity,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const AVAILABLE_COMMERCIAL_LISTINGS: {
  type: RealEstateType;
  name: string;
  location: string;
  price: number;
  weeklyRent: number;
  weeklyMaint: number;
  imageUrl: string;
}[] = [
  {
    type: 'Film Lot',
    name: 'Sunset Soundstages & Backlot',
    location: 'West Hollywood, CA',
    price: 3500000,
    weeklyRent: 45000,
    weeklyMaint: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1518676599625-583008082980?auto=format&fit=crop&q=80&w=400',
  },
  {
    type: 'Hotel',
    name: 'The Beverly Grand Luxury Hotel',
    location: 'Rodeo Drive, Beverly Hills',
    price: 8500000,
    weeklyRent: 110000,
    weeklyMaint: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400',
  },
  {
    type: 'Office Tower',
    name: 'Century City Corporate Tower',
    location: 'Century City, LA',
    price: 12000000,
    weeklyRent: 160000,
    weeklyMaint: 40000,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
  },
  {
    type: 'Shopping Mall',
    name: 'Melrose Promenade High-End Mall',
    location: 'Melrose Ave, Hollywood',
    price: 6000000,
    weeklyRent: 78000,
    weeklyMaint: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
  },
  {
    type: 'Resort',
    name: 'Malibu Oceanfront Private Resort',
    location: 'Malibu Coast, CA',
    price: 15000000,
    weeklyRent: 210000,
    weeklyMaint: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400',
  },
  {
    type: 'Industrial Building',
    name: 'Burbank Media Production Logistics Hub',
    location: 'Burbank, CA',
    price: 2800000,
    weeklyRent: 32000,
    weeklyMaint: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
  },
];

const PHASE_META: Record<RealEstatePhase, { label: string; chip: string; bar: string; drift: string; blurb: string }> = {
  Hot: { label: '🔥 HOT MARKET', chip: 'bg-red-500/20 text-red-300 border-red-500/40', bar: 'bg-red-500', drift: '+0.8% to +1.6% / week', blurb: 'Rate cuts and relocations — values climbing fast.' },
  Stable: { label: '🏠 STABLE MARKET', chip: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', bar: 'bg-emerald-500', drift: '+0.05% to +0.3% / week', blurb: 'Steady hands — valuations hold a gentle drift.' },
  Cooling: { label: '🌧️ COOLING MARKET', chip: 'bg-sky-500/20 text-sky-300 border-sky-500/40', bar: 'bg-sky-500', drift: '−0.2% to −0.5% / week', blurb: 'Financing costs bite — values easing down.' },
  Slump: { label: '📉 MARKET SLUMP', chip: 'bg-purple-500/20 text-purple-300 border-purple-500/40', bar: 'bg-purple-500', drift: '−0.6% to −1.2% / week', blurb: 'Credit squeeze — values sliding week over week.' },
};

function Sparkline({ history }: { history: number[] }) {
  if (!history || history.length < 2) {
    return <div className="h-8 rounded-lg bg-white/5 flex items-center justify-center text-[8px] text-gray-600 font-mono">GATHERING MARKET DATA…</div>;
  }
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = Math.max(1, max - min);
  const pts = history
    .map((v, i) => `${(i / (history.length - 1)) * 100},${28 - ((v - min) / range) * 24 - 2}`)
    .join(' ');
  const up = history[history.length - 1] >= history[0];
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="w-full h-8">
      <polyline points={pts} fill="none" stroke={up ? '#34d399' : '#f87171'} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const fmtM = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`);

export const RealEstateEmpireView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player, persistNow } = useGame();
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'MARKET'>('PORTFOLIO');

  const market = empireState.realEstateMarket || { phase: 'Stable' as RealEstatePhase, weeksUntilShift: 4 };
  const phaseMeta = PHASE_META[market.phase];
  const portfolioValue = empireState.realEstate.reduce((a, r) => a + r.currentValuation, 0);
  const weeklyRent = empireState.realEstate.reduce((a, r) => a + r.weeklyRentalIncome, 0);
  const weeklyMaint = empireState.realEstate.reduce((a, r) => a + r.weeklyMaintenanceCost, 0);
  const leasedCount = empireState.realEstate.filter((r) => r.isLeased).length;

  const handleAcquireProperty = (listing: typeof AVAILABLE_COMMERCIAL_LISTINGS[0]) => {
    if (player.money < listing.price) {
      alert(`Insufficient cash! Acquiring ${listing.name} requires $${listing.price.toLocaleString()}.`);
      return;
    }
    player.money -= listing.price;
    persistNow();

    // New acquisitions arrive VACANT — renting out is the player's decision.
    const newEstate: CommercialRealEstate = {
      id: `estate_${Date.now()}`,
      name: listing.name,
      type: listing.type,
      location: listing.location,
      purchasePrice: listing.price,
      currentValuation: listing.price,
      weeklyRentalIncome: 0,
      weeklyMaintenanceCost: listing.weeklyMaint,
      occupancyRate: 0,
      occupancyStatus: 'Vacant',
      tierLevel: 1,
      isLeased: false,
      imageUrl: listing.imageUrl,
      valuationHistory: [listing.price],
      upgradesDone: 0,
    };

    const updated: EmpireFullState = { ...empireState, realEstate: [...empireState.realEstate, newEstate] };
    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🏢 ACQUIRED: ${listing.name}\n\nArrives vacant — open the card and RENT IT OUT to start earning (rent is priced off live valuation).`);
  };

  const handleRentToggle = (id: string) => {
    const estate = empireState.realEstate.find((r) => r.id === id);
    if (!estate) return;
    const res = estate.isLeased
      ? EmpireService.stopRentingProperty(empireState, id)
      : EmpireService.rentOutProperty(empireState, id);
    if (res.ok) onUpdateState(res.state);
    alert(res.message);
  };

  const handleUpgradeProperty = (id: string) => {
    const res = EmpireService.upgradeRealEstate(empireState, id, player.money);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    player.money -= res.cost;
    persistNow();
    onUpdateState(res.state);
    alert(`🔨 ${res.message}`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Real Estate Empire</h2>
          </div>
        </div>

        <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/10">
          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'PORTFOLIO' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Portfolio ({empireState.realEstate.length})
          </button>
          <button
            onClick={() => setActiveTab('MARKET')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'MARKET' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Commercial Market
          </button>
        </div>
      </div>

      {/* LIVING MARKET BANNER */}
      <div className={`p-4 rounded-3xl border ${phaseMeta.chip.replace('text-', 'border-').includes('border-') ? '' : ''} bg-black/60 border-white/10 space-y-2`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-wide">{phaseMeta.label}</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-gray-400">
            PHASE SHIFT IN {market.weeksUntilShift} WEEK{market.weeksUntilShift === 1 ? '' : 'S'} · DRIFT {phaseMeta.drift}
          </span>
        </div>
        <p className="text-[11px] text-gray-400">{phaseMeta.blurb} Valuations re-price every weekly tick — buy the Slump, sell never, rent everything.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Portfolio Value</span>
            <span className="text-sm font-black text-white font-mono">{fmtM(portfolioValue)}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Weekly Rent In</span>
            <span className="text-sm font-black text-emerald-300 font-mono">+{fmtM(weeklyRent)}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Weekly Upkeep</span>
            <span className="text-sm font-black text-red-300 font-mono">−{fmtM(weeklyMaint)}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
            <span className="text-[8px] text-gray-500 uppercase font-black block">Leased Out</span>
            <span className="text-sm font-black text-sky-300 font-mono">{leasedCount}/{empireState.realEstate.length}</span>
          </div>
        </div>
      </div>

      {activeTab === 'PORTFOLIO' ? (
        <div>
          {empireState.realEstate.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-3">
              <Building className="w-12 h-12 text-sky-400/60 mx-auto" />
              <h3 className="text-base font-black text-white">NO COMMERCIAL PROPERTIES OWNED</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Acquire soundstage backlots, hotel towers and corporate offices. Every property can be rented
                out for weekly income and renovated up to Tier 5 — while the market phase moves your valuations
                every single week.
              </p>
              <button
                onClick={() => setActiveTab('MARKET')}
                className="px-5 py-2.5 rounded-2xl bg-sky-500 text-white font-black text-xs hover:scale-105 transition-all cursor-pointer shadow-lg inline-flex items-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Browse Commercial Listings</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {empireState.realEstate.map((estate) => {
                const history = estate.valuationHistory || [estate.purchasePrice, estate.currentValuation];
                const weekDelta = history.length >= 2 ? estate.currentValuation - history[history.length - 2] : 0;
                const totalDelta = estate.currentValuation - estate.purchasePrice;
                const upgradeCost = Math.floor(estate.currentValuation * 0.25);
                const maxTier = estate.tierLevel >= 5;
                return (
                  <div key={estate.id} className="rounded-3xl border border-white/10 bg-black/60 overflow-hidden shadow-xl space-y-3">
                    <div className="h-36 w-full relative overflow-hidden">
                      <img src={estate.imageUrl} alt={estate.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-sky-500 text-white">
                        {estate.type} · TIER {estate.tierLevel}/5
                      </span>
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                          estate.isLeased ? 'bg-emerald-500/80 text-white border-emerald-300' : 'bg-black/70 text-gray-300 border-white/20'
                        }`}
                      >
                        {estate.isLeased ? `RENTED · ${estate.occupancyRate}% OCC` : 'VACANT'}
                      </span>
                      <span className="absolute bottom-3 left-3 text-sm font-black text-white">{estate.name}</span>
                    </div>

                    <div className="p-4 space-y-3 pt-0">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{estate.location}</span>
                      </div>

                      {/* Valuation + live sparkline */}
                      <div className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-gray-500 uppercase font-black">Valuation (26-week trend)</span>
                          <span className={`text-[10px] font-mono font-black flex items-center gap-1 ${weekDelta >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {weekDelta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {weekDelta >= 0 ? '+' : '−'}{fmtM(Math.abs(weekDelta))} this week
                          </span>
                        </div>
                        <span className="text-lg font-black text-white font-mono block">{fmtM(estate.currentValuation)}</span>
                        <Sparkline history={history} />
                        <span className="text-[9px] text-gray-500 font-mono">
                          Bought {fmtM(estate.purchasePrice)} · {totalDelta >= 0 ? 'up' : 'down'} {fmtM(Math.abs(totalDelta))} all-time
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Rent / Week</span>
                          <span className="font-black text-emerald-300 font-mono">{estate.isLeased ? `+$${estate.weeklyRentalIncome.toLocaleString()}` : '—'}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Upkeep / Week</span>
                          <span className="font-black text-red-300 font-mono">−${estate.weeklyMaintenanceCost.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Renovations</span>
                          <span className="font-black text-amber-300 font-mono">{estate.upgradesDone || 0}×</span>
                        </div>
                      </div>

                      {/* Actions: rent-out + upgrade */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleRentToggle(estate.id)}
                          className={`py-2.5 rounded-2xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            estate.isLeased
                              ? 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                              : 'bg-emerald-500 text-white shadow-lg hover:bg-emerald-400'
                          }`}
                        >
                          {estate.isLeased ? <Ban className="w-3.5 h-3.5" /> : <KeyRound className="w-3.5 h-3.5" />}
                          {estate.isLeased ? 'STOP RENTING' : 'RENT IT OUT'}
                        </button>
                        <button
                          onClick={() => !maxTier && handleUpgradeProperty(estate.id)}
                          disabled={maxTier}
                          className={`py-2.5 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 ${
                            maxTier
                              ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                              : 'bg-amber-400 text-black shadow-lg hover:bg-amber-300 cursor-pointer'
                          }`}
                        >
                          {maxTier ? <Minus className="w-3.5 h-3.5" /> : <Hammer className="w-3.5 h-3.5" />}
                          {maxTier ? 'MAX TIER' : `UPGRADE ${fmtM(upgradeCost)}`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* MARKET TAB */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_COMMERCIAL_LISTINGS.map((listing) => {
            const canAfford = player.money >= listing.price;
            return (
              <div key={listing.name} className="rounded-3xl border border-white/10 bg-black/60 overflow-hidden shadow-xl">
                <div className="h-36 w-full relative">
                  <img src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase bg-sky-500 text-white">{listing.type}</span>
                  <span className="absolute bottom-3 left-3 text-sm font-black text-white">{listing.name}</span>
                </div>
                <div className="p-4 space-y-3 pt-2">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[9px] text-gray-400 uppercase font-bold block">Price</span>
                      <span className="font-black text-white font-mono">{fmtM(listing.price)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[9px] text-gray-400 uppercase font-bold block">Est. Yield</span>
                      <span className="font-black text-emerald-300 font-mono">{fmtM(listing.weeklyRent)}/wk*</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[9px] text-gray-400 uppercase font-bold block">Upkeep</span>
                      <span className="font-black text-red-300 font-mono">{fmtM(listing.weeklyMaint)}/wk</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-500 font-mono">*At full occupancy once you rent it out — actual rent re-prices off live valuation every week.</p>
                  <button
                    onClick={() => handleAcquireProperty(listing)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                      canAfford ? 'bg-sky-500 text-white hover:bg-sky-400 cursor-pointer shadow-lg' : 'bg-gray-800 text-gray-500 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    {canAfford ? `ACQUIRE FOR ${fmtM(listing.price)}` : `NEEDS ${fmtM(listing.price - player.money)} MORE`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
