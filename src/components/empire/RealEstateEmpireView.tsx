/**
 * HOLLYWOOD RISING - Commercial Real Estate Sub-View
 * Phase 5 Empire Scene: Hotels, Office Towers, Film Lots, Resorts commercial portfolio.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, CommercialRealEstate, RealEstateType } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Building,
  Plus,
  DollarSign,
  MapPin,
  TrendingUp,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Film,
  Hotel,
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

export const RealEstateEmpireView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player } = useGame();
  const [activeTab, setActiveTab] = useState<'PORTFOLIO' | 'MARKET'>('PORTFOLIO');

  const handleAcquireProperty = (listing: typeof AVAILABLE_COMMERCIAL_LISTINGS[0]) => {
    if (player.money < listing.price) {
      alert(`Insufficient cash! Acquiring ${listing.name} requires $${listing.price.toLocaleString()}.`);
      return;
    }

    player.money -= listing.price;

    const newEstate: CommercialRealEstate = {
      id: `estate_${Date.now()}`,
      name: listing.name,
      type: listing.type,
      location: listing.location,
      purchasePrice: listing.price,
      currentValuation: listing.price,
      weeklyRentalIncome: listing.weeklyRent,
      weeklyMaintenanceCost: listing.weeklyMaint,
      occupancyRate: 92,
      tierLevel: 1,
      isLeased: true,
      imageUrl: listing.imageUrl,
    };

    const updated: EmpireFullState = {
      ...empireState,
      realEstate: [...empireState.realEstate, newEstate],
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`🏢 ACQUISITION SUCCESS: Successfully acquired ${listing.name}! Added to commercial empire.`);
  };

  const handleUpgradeProperty = (estateId: string) => {
    const estate = empireState.realEstate.find((r) => r.id === estateId);
    if (!estate) return;

    const upgradeCost = Math.floor(estate.purchasePrice * 0.2);
    if (player.money < upgradeCost) {
      alert(`Insufficient cash for renovation ($${upgradeCost.toLocaleString()}).`);
      return;
    }

    player.money -= upgradeCost;

    const updatedEstate: CommercialRealEstate = {
      ...estate,
      tierLevel: estate.tierLevel + 1,
      currentValuation: Math.floor(estate.currentValuation * 1.3),
      weeklyRentalIncome: Math.floor(estate.weeklyRentalIncome * 1.25),
    };

    const updated: EmpireFullState = {
      ...empireState,
      realEstate: empireState.realEstate.map((r) => (r.id === estateId ? updatedEstate : r)),
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    alert(`✨ RENOVATION COMPLETE: Upgraded ${estate.name} to Tier ${updatedEstate.tierLevel}! Rental yield increased.`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
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

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/10">
          <button
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'PORTFOLIO'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Owned Properties ({empireState.realEstate.length})
          </button>
          <button
            onClick={() => setActiveTab('MARKET')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'MARKET'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Commercial Market
          </button>
        </div>
      </div>

      {activeTab === 'PORTFOLIO' ? (
        /* PORTFOLIO TAB */
        <div>
          {empireState.realEstate.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-3">
              <Building className="w-12 h-12 text-sky-400/60 mx-auto" />
              <h3 className="text-base font-black text-white">NO COMMERCIAL PROPERTIES OWNED</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Acquire film soundstage backlots, luxury hotel towers, or Century City corporate offices to generate passive weekly rental yield.
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
              {empireState.realEstate.map((estate) => (
                <div
                  key={estate.id}
                  className="rounded-3xl border border-white/10 bg-black/60 overflow-hidden shadow-xl space-y-3"
                >
                  <div className="h-36 w-full relative overflow-hidden">
                    <img src={estate.imageUrl} alt={estate.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-sky-500 text-white">
                      {estate.type}
                    </span>
                    <span className="absolute bottom-3 left-3 text-sm font-black text-white">
                      {estate.name}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 pt-0">
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>{estate.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                        <span className="text-[9px] text-gray-400 uppercase font-bold block">Current Valuation</span>
                        <span className="font-black text-amber-300">
                          ${estate.currentValuation.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                        <span className="text-[9px] text-gray-400 uppercase font-bold block">Net Weekly Yield</span>
                        <span className="font-black text-emerald-400">
                          +${(estate.weeklyRentalIncome - estate.weeklyMaintenanceCost).toLocaleString()}/wk
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs font-bold text-gray-300">Tier {estate.tierLevel} Luxury Facility</span>
                      <button
                        onClick={() => handleUpgradeProperty(estate.id)}
                        className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/30 transition-all cursor-pointer"
                      >
                        + Renovation Upgrade
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* MARKET TAB */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_COMMERCIAL_LISTINGS.map((listing, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/10 bg-black/60 overflow-hidden shadow-xl space-y-3"
            >
              <div className="h-40 w-full relative overflow-hidden">
                <img src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-sky-500 text-white">
                  {listing.type}
                </span>
              </div>

              <div className="p-4 space-y-3 pt-0">
                <div>
                  <h4 className="text-sm font-black text-white">{listing.name}</h4>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {listing.location}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Asking Price:</span>
                    <span className="font-black text-amber-300">${listing.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gross Weekly Rent:</span>
                    <span className="font-bold text-emerald-400">+${listing.weeklyRent.toLocaleString()}/wk</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAcquireProperty(listing)}
                  className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs transition-all cursor-pointer shadow-lg"
                >
                  ACQUIRE PROPERTY
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
