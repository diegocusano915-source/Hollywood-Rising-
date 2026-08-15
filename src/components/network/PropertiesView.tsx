/**
 * HOLLYWOOD RISING - Properties View (Phase 4 Network)
 * 50 Real Estate Properties across 4 Tiers, Mortgages, Rental Yields, Primary Residences & Selling.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, PropertyItem, PropertyTier } from '../../types/network';
import { NetworkService } from '../../services/networkService';
import {
  Home,
  ArrowLeft,
  DollarSign,
  Building2,
  Key,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  Search,
  Bed,
  Bath,
  Maximize2,
  TrendingUp,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface PropertiesViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings, persistNow } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTierFilter, setActiveTierFilter] = useState<PropertyTier | 'ALL' | 'OWNED'>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  const properties = networkState.properties || [];

  const handleBuyCash = (property: PropertyItem) => {
    if (player.money < property.price) {
      setFeedback(`Insufficient Funds! Required: $${property.price.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const updatedProperties = properties.map((p) => {
      if (p.id === property.id) {
        return {
          ...p,
          isOwned: true,
          isMortgaged: false,
          mortgageRemaining: 0,
        };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      properties: updatedProperties,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    player.money -= property.price;
    persistNow();

    setFeedback(`CONGRATULATIONS! You bought ${property.name} cash for $${property.price.toLocaleString()}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleBuyMortgage = (property: PropertyItem) => {
    if (player.money < property.downPayment) {
      setFeedback(`Insufficient Down Payment! Required: $${property.downPayment.toLocaleString()}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const updatedProperties = properties.map((p) => {
      if (p.id === property.id) {
        return {
          ...p,
          isOwned: true,
          isMortgaged: true,
          mortgageRemaining: Math.round(property.price * 0.8),
        };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      properties: updatedProperties,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    player.money -= property.downPayment;
    persistNow();

    setFeedback(`MORTGAGE APPROVED! Down payment $${property.downPayment.toLocaleString()} paid for ${property.name}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleToggleRent = (property: PropertyItem) => {
    const updatedProperties = properties.map((p) => {
      if (p.id === property.id) {
        const nextRent = !p.isRentedOut;
        return {
          ...p,
          isRentedOut: nextRent,
          isPrimaryResidence: nextRent ? false : p.isPrimaryResidence,
        };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      properties: updatedProperties,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(property.isRentedOut ? 'Property removed from rental market.' : 'Property listed & rented out for passive income!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSetPrimary = (property: PropertyItem) => {
    const updatedProperties = properties.map((p) => {
      if (p.id === property.id) {
        return {
          ...p,
          isPrimaryResidence: true,
          isRentedOut: false,
        };
      }
      return {
        ...p,
        isPrimaryResidence: false,
      };
    });

    const nextState: NetworkFullState = {
      ...networkState,
      properties: updatedProperties,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`${property.name} set as your Primary Residence!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const [selectedDetailsProp, setSelectedDetailsProp] = useState<PropertyItem | null>(null);

  const handleSellProperty = (property: PropertyItem) => {
    const sellPrice = Math.round(property.price * 0.95);

    const updatedProperties = properties.map((p) => {
      if (p.id === property.id) {
        return {
          ...p,
          isOwned: false,
          isMortgaged: false,
          mortgageRemaining: 0,
          isPrimaryResidence: false,
          isRentedOut: false,
        };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      properties: updatedProperties,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    player.money += sellPrice;
    persistNow();

    setFeedback(`SOLD ${property.name} for $${sellPrice.toLocaleString()}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleRenovate = (property: PropertyItem) => {
    const cost = 25000;
    if (player.money < cost) {
      setFeedback(`Insufficient funds! Renovation requires $${cost.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const updatedProperties = properties.map((p) => {
      if (p.id === property.id) {
        return {
          ...p,
          price: p.price + 35000,
          weeklyRentIncome: p.weeklyRentIncome + 300,
        };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      properties: updatedProperties,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    player.money -= cost;
    persistNow();

    setFeedback(`RENOVATED ${property.name}! Value +$35,000, Rent +$300/wk.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleUpgrade = (property: PropertyItem) => {
    const cost = 50000;
    if (player.money < cost) {
      setFeedback(`Insufficient funds! Luxury Upgrade requires $${cost.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const updatedProperties = properties.map((p) => {
      if (p.id === property.id) {
        return {
          ...p,
          price: p.price + 70000,
          weeklyRentIncome: p.weeklyRentIncome + 600,
        };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      properties: updatedProperties,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    player.money -= cost;
    persistNow();

    setFeedback(`UPGRADED ${property.name}! Value +$70,000, Rent +$600/wk.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleMortgageAction = (property: PropertyItem) => {
    if (!property.isMortgaged) {
      // Mortgage it
      const cashOut = Math.round(property.price * 0.7);
      const updatedProperties = properties.map((p) => {
        if (p.id === property.id) {
          return {
            ...p,
            isMortgaged: true,
            mortgageRemaining: cashOut,
            weeklyMortgagePayment: Math.round(cashOut / 100),
          };
        }
        return p;
      });

      const nextState: NetworkFullState = {
        ...networkState,
        properties: updatedProperties,
      };

      NetworkService.saveState(nextState);
      onUpdateState(nextState);

      setFeedback(`MORTGAGED ${property.name}! Received $${cashOut.toLocaleString()} cash.`);
      setTimeout(() => setFeedback(null), 3500);
    } else {
      // Payoff mortgage
      if (player.money < property.mortgageRemaining) {
        setFeedback(`Insufficient funds to pay off mortgage ($${property.mortgageRemaining.toLocaleString()})!`);
        setTimeout(() => setFeedback(null), 3000);
        return;
      }

      const updatedProperties = properties.map((p) => {
        if (p.id === property.id) {
          return {
            ...p,
            isMortgaged: false,
            mortgageRemaining: 0,
            weeklyMortgagePayment: 0,
          };
        }
        return p;
      });

      const nextState: NetworkFullState = {
        ...networkState,
        properties: updatedProperties,
      };

      NetworkService.saveState(nextState);
      onUpdateState(nextState);

      setFeedback(`MORTGAGE PAID OFF for ${property.name}!`);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (activeTierFilter === 'OWNED') return p.isOwned;
    if (activeTierFilter === 'ALL') return true;
    return p.tier === activeTierFilter;
  });

  const ownedCount = properties.filter((p) => p.isOwned).length;
  const totalRealEstateVal = properties
    .filter((p) => p.isOwned)
    .reduce((sum, p) => sum + p.price, 0);

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
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
            <Home className="w-4 h-4 text-emerald-400" />
            Beverly Hills Real Estate Registry
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
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40">
              <Home className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                HOLLYWOOD REAL ESTATE
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">PROPERTIES PORTFOLIO</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Portfolio Value</span>
            <span className="text-lg font-black text-emerald-400">
              ${totalRealEstateVal.toLocaleString()} ({ownedCount} Owned)
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* TIER TABS */}
      <div className="p-2 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All (50)' },
          { id: 'OWNED', label: `My Owned (${ownedCount})` },
          { id: 'Small', label: 'Small' },
          { id: 'Medium', label: 'Medium' },
          { id: 'High', label: 'High' },
          { id: 'Elite', label: 'Elite Trophy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTierFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeTierFilter === tab.id
                ? 'bg-emerald-400 text-black shadow-lg scale-102'
                : 'bg-black/40 text-gray-300 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PROPERTY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            className="p-5 rounded-3xl border border-white/10 bg-black/50 hover:bg-black/70 transition-all space-y-4 shadow-xl overflow-hidden group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={prop.imageUrl}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black text-amber-300">
                  {prop.tier} Tier
                </div>

                {prop.isOwned && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-emerald-500 text-black font-black text-xs shadow-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>OWNED</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-white">{prop.name}</h3>
                <span className="text-xs text-gray-400 font-medium">{prop.location}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-extrabold bg-black/60 p-2.5 rounded-2xl border border-white/5 text-gray-300">
                <div className="flex items-center justify-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-amber-400" />
                  <span>{prop.bedrooms} Beds</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-sky-400" />
                  <span>{prop.bathrooms} Baths</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{prop.sqft.toLocaleString()} sqft</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">{prop.description}</p>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex justify-between font-extrabold">
                  <span className="text-gray-400">Market Price:</span>
                  <span className="text-emerald-400 font-black">${prop.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="text-gray-400">Mortgage Down (20%):</span>
                  <span className="text-amber-300">${prop.downPayment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="text-gray-400">Weekly Rent Yield:</span>
                  <span className="text-sky-300">+${prop.weeklyRentIncome.toLocaleString()}/wk</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-2">
              {!prop.isOwned ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuyCash(prop)}
                    className="py-3 rounded-2xl font-black text-xs bg-emerald-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg"
                  >
                    BUY CASH
                  </button>
                  <button
                    onClick={() => handleBuyMortgage(prop)}
                    className="py-3 rounded-2xl font-black text-xs bg-black/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/20 transition-all cursor-pointer"
                  >
                    MORTGAGE (20%)
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-[11px] font-black">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSetPrimary(prop)}
                      className={`py-2 rounded-xl transition-all cursor-pointer border ${
                        prop.isPrimaryResidence
                          ? 'bg-amber-400 text-black border-amber-400 font-black'
                          : 'bg-black/60 text-gray-300 border-white/10 hover:border-amber-400'
                      }`}
                    >
                      {prop.isPrimaryResidence ? 'RESIDING HERE' : 'MOVE IN'}
                    </button>

                    <button
                      onClick={() => handleToggleRent(prop)}
                      className={`py-2 rounded-xl transition-all cursor-pointer border ${
                        prop.isRentedOut
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-black/60 text-gray-300 border-white/10 hover:border-sky-400'
                      }`}
                    >
                      {prop.isRentedOut ? 'RENTED (EARNING)' : 'RENT OUT'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRenovate(prop)}
                      className="py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all cursor-pointer"
                    >
                      RENOVATE ($25K)
                    </button>

                    <button
                      onClick={() => handleUpgrade(prop)}
                      className="py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all cursor-pointer"
                    >
                      UPGRADE ($50K)
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleMortgageAction(prop)}
                      className="py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer text-[10px]"
                    >
                      {prop.isMortgaged ? 'PAY MORTGAGE' : 'MORTGAGE'}
                    </button>

                    <button
                      onClick={() => handleSellProperty(prop)}
                      className="py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer text-[10px]"
                    >
                      SELL (95%)
                    </button>

                    <button
                      onClick={() => setSelectedDetailsProp(prop)}
                      className="py-2 rounded-xl bg-black/80 text-white border border-white/20 hover:bg-white/10 transition-all cursor-pointer text-[10px]"
                    >
                      DETAILS
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PROPERTY DETAILS MODAL */}
      {selectedDetailsProp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/20 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white">{selectedDetailsProp.name} Details</h3>
              <button
                onClick={() => setSelectedDetailsProp(null)}
                className="text-gray-400 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-white/5">
                <span className="text-gray-400">Location:</span>
                <span className="text-white font-bold">{selectedDetailsProp.location}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white/5">
                <span className="text-gray-400">Specifications:</span>
                <span className="text-white font-bold">{selectedDetailsProp.bedrooms} Beds • {selectedDetailsProp.bathrooms} Baths • {selectedDetailsProp.sqft.toLocaleString()} sqft</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white/5">
                <span className="text-gray-400">Current Market Valuation:</span>
                <span className="text-emerald-400 font-black">${selectedDetailsProp.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white/5">
                <span className="text-gray-400">Mortgage Balance:</span>
                <span className="text-rose-400 font-bold">${selectedDetailsProp.mortgageRemaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-white/5">
                <span className="text-gray-400">Weekly Rent Revenue:</span>
                <span className="text-sky-300 font-bold">+${selectedDetailsProp.weeklyRentIncome.toLocaleString()}/wk</span>
              </div>
              <p className="text-gray-300 pt-2 leading-relaxed">{selectedDetailsProp.description}</p>
            </div>

            <button
              onClick={() => setSelectedDetailsProp(null)}
              className="w-full py-3 rounded-2xl bg-amber-400 text-black font-black text-xs hover:scale-102 transition-all cursor-pointer"
            >
              CLOSE DETAILS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
