/**
 * HOLLYWOOD RISING - Filming Locations View (World Ecosystem)
 * LIVING catalogue: incentives drift weekly, weather shifts, and destinations
 * rotate in and out of the roster every few weeks (no static list).
 */

import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FilmingLocation } from '../../types/world';
import { getFilmingLocations } from '../../services/livingWorldService';
import {
  Globe,
  MapPin,
  ArrowLeft,
  Sun,
  RefreshCw,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface FilmingLocationsViewProps {
  onBack: () => void;
}

export const FilmingLocationsView: React.FC<FilmingLocationsViewProps> = ({ onBack }) => {
  const { settings, player } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [locations, setLocations] = useState<FilmingLocation[]>(() => getFilmingLocations());

  // Re-read the living roster every game week — drift + rotation happen in
  // the weekly tick, so the catalogue moves with the world.
  useEffect(() => {
    setLocations(getFilmingLocations());
  }, [player.dateWeek, player.dateYear]);

  const currentAbsolute = player.dateYear * 52 + player.dateWeek;
  const freshCount = locations.filter(
    (l) => (l as any).addedAbsoluteWeek && currentAbsolute - (l as any).addedAbsoluteWeek <= 6
  ).length;

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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <Globe className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">GLOBAL FILMING DESTINATIONS & TAX INCENTIVES</h1>
              <p className="text-xs text-amber-300 font-medium">
                Living catalogue — incentives drift weekly and destinations rotate in and out as rebate programs open and close.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {freshCount > 0 && (
              <span className="text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" /> {freshCount} NEW THIS SEASON
              </span>
            )}
            <span className="text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {locations.length} ACTIVE HUBS
            </span>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => {
          const addedWeek = (loc as any).addedAbsoluteWeek as number | undefined;
          const isNew = !!addedWeek && currentAbsolute - addedWeek <= 6 && addedWeek > 0;
          return (
            <div
              key={loc.id}
              className={`p-5 rounded-3xl border backdrop-blur-md space-y-3 shadow-xl flex flex-col justify-between transition-all ${
                isNew ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-white/10 bg-black/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{loc.flagUrl}</span>
                  <div className="flex items-center gap-1.5">
                    {isNew && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        NEW HUB
                      </span>
                    )}
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      +{loc.taxIncentivePct}% TAX REBATE
                    </span>
                  </div>
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
                    <span className="font-black text-sky-300 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> {loc.weatherRating}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-bold">Travel Cost</span>
                    <span className="font-black text-purple-300">${loc.travelCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
