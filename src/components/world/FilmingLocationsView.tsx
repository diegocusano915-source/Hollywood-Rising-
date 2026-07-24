/**
 * HOLLYWOOD RISING - Filming Locations View (World Ecosystem)
 * Global Filming Destinations, Tax Rebates & Permits.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FilmingLocation } from '../../types/world';
import { INITIAL_FILMING_LOCATIONS } from '../../database/worldDatabase';
import {
  Globe,
  MapPin,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Sun,
  ShieldAlert,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface FilmingLocationsViewProps {
  onBack: () => void;
}

export const FilmingLocationsView: React.FC<FilmingLocationsViewProps> = ({ onBack }) => {
  const { settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [locations] = useState<FilmingLocation[]>(INITIAL_FILMING_LOCATIONS);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-20 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-amber-400" />
          Global Production Locations Catalogue
        </span>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
            <Globe className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">GLOBAL FILMING DESTINATIONS & TAX INCENTIVES</h1>
            <p className="text-xs text-amber-300 font-medium">
              Explore 50 production destinations worldwide. Save on budget with tax rebates up to 40%!
            </p>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md space-y-3 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{loc.flagUrl}</span>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +{loc.taxIncentivePct}% TAX REBATE
                </span>
              </div>

              <h2 className="text-lg font-black text-white">{loc.city}</h2>
              <p className="text-xs text-amber-300 font-bold">{loc.country}</p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px]">
                <div>
                  <span className="text-gray-400 block font-bold">Permit Cost</span>
                  <span className="font-black text-amber-300">${loc.permitCost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Weather Rating</span>
                  <span className="font-black text-sky-300">{loc.weatherRating}/100</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Travel Cost</span>
                  <span className="font-black text-purple-300">${loc.travelCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
