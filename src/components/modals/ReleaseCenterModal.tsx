import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BookedProject, ReleaseConfig } from '../../types/game';
import { THEMES } from '../../theme/colors';
import {
  Film,
  X,
  DollarSign,
  Sparkles,
  Calendar,
  Globe,
  Tv,
  Megaphone,
  Clapperboard,
  CheckCircle2,
  AlertCircle,
  Award,
  Flame,
} from 'lucide-react';
import { RedCarpetPremiereModal } from './RedCarpetPremiereModal';

interface ReleaseCenterModalProps {
  project: BookedProject;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReleaseCenterModal: React.FC<ReleaseCenterModalProps> = ({
  project,
  onClose,
  onSuccess,
}) => {
  const { player, settings, releaseMovie } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [showRedCarpet, setShowRedCarpet] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form selections
  const [releaseWeekIndex, setReleaseWeekIndex] = useState(0); // 0 = Immediate, 1 = Next Week, 2 = Summer, 3 = Awards
  const [marketingIndex, setMarketingIndex] = useState(1); // Standard default
  const [screenIndex, setScreenIndex] = useState(2); // Nationwide Wide default
  const [premiereIndex, setPremiereIndex] = useState(0); // No Premiere default ($0)

  // 1. Release Week Options
  const releaseWeekOptions = [
    {
      text: `Immediate Release (W${player.dateWeek}, ${player.dateYear})`,
      offset: 0,
      badge: 'Immediate',
    },
    {
      text: `Next Week (W${player.dateWeek + 1}, ${player.dateYear})`,
      offset: 1,
      badge: '+1 Week',
    },
    {
      text: `Summer Blockbuster Window (W24, ${player.dateYear})`,
      offset: Math.max(0, 24 - player.dateWeek),
      badge: 'Summer Peak',
    },
    {
      text: `Awards Season Window (W44, ${player.dateYear})`,
      offset: Math.max(0, 44 - player.dateWeek),
      badge: 'Oscar Buzz',
    },
  ];

  // 2. Marketing Options
  const marketingOptions = [
    { name: 'Organic / No Campaign', cost: 0, hypeBonus: 0, desc: 'Zero marketing spend. Relies entirely on word of mouth.' },
    { name: 'Indie Grassroots ($10,000)', cost: 10000, hypeBonus: 15, desc: 'Targeted social ads & indie film blogs.' },
    { name: 'Standard Studio Campaign ($50,000)', cost: 50000, hypeBonus: 40, desc: 'TV teasers, online trailers, & city posters.' },
    { name: 'Aggressive Major Push ($200,000)', cost: 200000, hypeBonus: 90, desc: 'Super Bowl teasers, press junkets, & billboards.' },
    { name: 'Global Blitz Tentpole ($750,000)', cost: 750000, hypeBonus: 200, desc: 'Worldwide blitz, brand sponsorships, & digital dominance.' },
  ];

  // 3. Screen Options
  const screenOptions = [
    { name: 'Limited Art-House (500 Screens)', screens: 500, cost: 0, multiplier: 0.4, desc: 'Exclusive release in key metropolitan art-houses.' },
    { name: 'Regional Wide (1,500 Screens)', screens: 1500, cost: 20000, multiplier: 0.8, desc: 'Balanced mid-tier theatrical distribution.' },
    { name: 'Nationwide Wide (3,500 Screens)', screens: 3500, cost: 75000, multiplier: 1.2, desc: 'Major theatrical wide release across all chains.' },
    { name: 'Ultra-Wide Tentpole (4,500 Screens)', screens: 4500, cost: 200000, multiplier: 1.6, desc: 'Maximum screen saturated release with IMAX & Dolby.' },
  ];

  // 4. Premiere Options (Red Carpet optionality)
  const premiereOptions = [
    {
      type: 'No Premiere' as const,
      cost: 0,
      hypeBonus: 0,
      desc: 'Skip the premiere completely. Saves money for indie productions with zero event overhead.',
    },
    {
      type: 'Local Premiere' as const,
      cost: 5000,
      hypeBonus: 15,
      desc: 'Small screening for cast, crew, and local film critics.',
    },
    {
      type: 'Standard Premiere' as const,
      cost: 25000,
      hypeBonus: 35,
      desc: 'Red carpet screening at a regional flagship theater with press coverage.',
    },
    {
      type: 'Hollywood Red Carpet' as const,
      cost: 100000,
      hypeBonus: 80,
      desc: 'Glamorous Chinese Theatre Hollywood red carpet event with A-list celebrity guests.',
    },
    {
      type: 'World Premiere' as const,
      cost: 500000,
      hypeBonus: 180,
      desc: 'Extravagant global gala premiere broadcast live with international paparazzi and VIPs.',
    },
  ];

  const selWeek = releaseWeekOptions[releaseWeekIndex];
  const selMarketing = marketingOptions[marketingIndex];
  const selScreen = screenOptions[screenIndex];
  const selPremiere = premiereOptions[premiereIndex];

  const totalCost = selMarketing.cost + selScreen.cost + selPremiere.cost;
  const currentHype = project.hypeScore || 40;
  const totalHype = currentHype + selMarketing.hypeBonus + selPremiere.hypeBonus;

  // Estimated Opening Range
  const baseBudget = project.budget || 25000000;
  const estMin = Math.floor(((baseBudget * 0.14) + (totalHype * 250000)) * selScreen.multiplier);
  const estMax = Math.floor(((baseBudget * 0.22) + (totalHype * 400000) + ((player.fameXp || 0) * 3000)) * selScreen.multiplier);

  const canAfford = player.money >= totalCost;

  const handleConfirmRelease = () => {
    if (!canAfford) {
      setErrorMsg(`Insufficient funds! You need $${totalCost.toLocaleString()} to launch this package.`);
      return;
    }

    const config: ReleaseConfig = {
      releaseWeekOffset: selWeek.offset,
      releaseWeekText: selWeek.text,
      marketingBudget: selMarketing.cost,
      marketingName: selMarketing.name,
      marketingHypeBonus: selMarketing.hypeBonus,
      screens: selScreen.screens,
      screenOptionName: selScreen.name,
      screenCost: selScreen.cost,
      screenMultiplier: selScreen.multiplier,
      premiereType: selPremiere.type,
      premiereCost: selPremiere.cost,
      premiereHypeBonus: selPremiere.hypeBonus,
    };

    const res = releaseMovie(project.id, config);
    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl text-white"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 md:p-6 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-black shadow-lg">
              <Clapperboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                  Ready for Release
                </span>
                <span className="text-xs text-gray-400 font-bold hidden sm:inline">
                  • Official Distribution Center
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mt-0.5">
                {project.movieTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Movie Hero Banner */}
          <div className="p-4 md:p-5 rounded-2xl bg-black/50 border border-amber-400/30 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src={project.posterUrl}
                alt={project.movieTitle}
                className="w-16 h-24 object-cover rounded-xl border border-white/20 shrink-0 shadow-lg"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">{project.movieTitle}</h3>
                <p className="text-xs text-amber-300 font-bold">{project.roleType} Role • {project.studio}</p>
                <p className="text-xs text-gray-400">Dir: {project.director} • Budget: ${((project.budget || 25000000) / 1000000).toFixed(1)}M</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-purple-400" /> Current Hype: {currentHype}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-black/80 p-3.5 rounded-2xl border border-white/10 text-right w-full md:w-auto">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Player Cash Balance</span>
              <span className="text-xl font-black text-emerald-400">${player.money.toLocaleString()}</span>
            </div>
          </div>

          {/* Error Message Toast */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: RELEASE WEEK SELECTION */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>1. Choose Release Week / Window</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {releaseWeekOptions.map((opt, i) => {
                const isSelected = releaseWeekIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setReleaseWeekIndex(i);
                      setErrorMsg(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">{opt.text}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-white/10 text-amber-300 w-fit">
                      {opt.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: MARKETING BUDGET */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>2. Select Marketing Campaign Budget</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {marketingOptions.map((opt, i) => {
                const isSelected = marketingIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setMarketingIndex(i);
                      setErrorMsg(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-200">{opt.name}</span>
                      {opt.hypeBonus > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          +{opt.hypeBonus} Hype
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">{opt.desc}</p>
                    <div className="text-xs font-black text-emerald-400 pt-1">
                      {opt.cost === 0 ? 'FREE ($0)' : `$${opt.cost.toLocaleString()}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: NUMBER OF SCREENS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>3. Choose Theatrical Screen Distribution</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {screenOptions.map((opt, i) => {
                const isSelected = screenIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setScreenIndex(i);
                      setErrorMsg(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="text-xs font-extrabold text-white">{opt.name}</div>
                    <p className="text-[11px] text-gray-400 leading-snug">{opt.desc}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                      <span className="text-emerald-400 font-bold">{opt.cost === 0 ? '$0 Cost' : `$${opt.cost.toLocaleString()}`}</span>
                      <span className="text-amber-300 font-bold">{opt.multiplier}x Reach</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: PREMIERE TYPE & RED CARPET */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>4. Premiere & Red Carpet Event Package</span>
              </h4>
              <span className="text-[10px] text-gray-400 font-bold">
                (Red Carpet is completely optional)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
              💡 <strong>Indie vs. Blockbuster Strategy:</strong> Small independent films can select <strong>"No Premiere"</strong> ($0) to skip the event completely and save money. Large studio tentpoles benefit greatly from lavish Hollywood or World premieres to maximize buzz and opening gross.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {premiereOptions.map((opt, i) => {
                const isSelected = premiereIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setPremiereIndex(i);
                      setErrorMsg(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-200">{opt.type}</span>
                      {opt.hypeBonus > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          +{opt.hypeBonus} Hype
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          Save $
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">{opt.desc}</p>
                    <div className="text-xs font-black text-emerald-400 pt-1">
                      {opt.cost === 0 ? 'FREE ($0)' : `$${opt.cost.toLocaleString()}`}
                    </div>
                  </button>
                );
              })}
            </div>

            {selPremiere.cost > 0 && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowRedCarpet(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Preview Red Carpet Event Experience</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 5: FINAL LAUNCH SUMMARY */}
          <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-black via-gray-900 to-amber-950/60 border-2 border-amber-400/50 space-y-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                  Release Package Summary
                </span>
                <h3 className="text-lg font-black text-white">
                  "{project.movieTitle}" Ready for Theatrical Launch
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                  Total Upfront Cost
                </span>
                <span className={`text-2xl font-black ${canAfford ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10">
                <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Target Release</span>
                <span className="font-extrabold text-amber-300">{selWeek.badge}</span>
              </div>

              <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10">
                <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Projected Hype</span>
                <span className="font-extrabold text-purple-300">{totalHype} Hype Points</span>
              </div>

              <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10">
                <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Screens</span>
                <span className="font-extrabold text-cyan-300">{selScreen.screens.toLocaleString()} Theaters</span>
              </div>

              <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10">
                <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-0.5">Est. Opening Weekend</span>
                <span className="font-extrabold text-emerald-400">
                  ${(estMin / 1000000).toFixed(1)}M - ${(estMax / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-gray-400">
                Confirming release will immediately launch "{project.movieTitle}" into theaters and box office tracking.
              </p>

              <button
                onClick={handleConfirmRelease}
                disabled={!canAfford}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 shrink-0 ${
                  canAfford
                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black hover:scale-105 active:scale-95'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                <Clapperboard className="w-4 h-4" />
                <span>CONFIRM RELEASE & LAUNCH TO BOX OFFICE</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRedCarpet && (
        <RedCarpetPremiereModal
          project={project}
          onClose={() => setShowRedCarpet(false)}
          onCompletePremiere={() => setShowRedCarpet(false)}
        />
      )}
    </div>
  );
};
