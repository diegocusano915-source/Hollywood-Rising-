/**
 * HOLLYWOOD RISING - World Screen (Phase 3 Premium Grid Redesign)
 * Modern 3-Cards-Per-Row Grid Layout with Glassmorphism, Scale & Glow Tap Animations,
 * Top Bar Controls & Full Interconnected Hollywood Business Ecosystem.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WorldFeatureId } from '../../types/world';
import {
  TrendingUp,
  Briefcase,
  Video,
  DollarSign,
  Tv,
  Radio,
  Film,
  MessageSquare,
  Award,
  Scale,
  Coins,
  BarChart3,
  Globe,
  Building2,
  ChevronRight,
  Sparkles,
  Trophy,
  Bell,
  Settings,
  X,
  Clapperboard,
  Handshake,
  Share2,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

// Import World Feature Views
import { BoxOfficeView } from '../world/BoxOfficeView';
import { RepresentationView } from '../world/RepresentationView';
import { StreamingView } from '../world/StreamingView';
import { BankrollView } from '../world/BankrollView';
import { TvStationsView } from '../world/TvStationsView';
import { RadioStationsView } from '../world/RadioStationsView';
import { PersonalStudioView } from '../world/PersonalStudioView';
import { SocialsView } from '../world/SocialsView';
import { AwardsView } from '../world/AwardsView';
import { LawyersView } from '../world/LawyersView';
import { StockCoinView } from '../world/StockCoinView';
import { StarStocksView } from '../world/StarStocksView';
import { FilmingLocationsView } from '../world/FilmingLocationsView';
import { EndorsementsView } from '../world/EndorsementsView';
import { StudioRelationshipsView } from '../world/StudioRelationshipsView';

export const WorldScreen: React.FC = () => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeFeature, setActiveFeature] = useState<WorldFeatureId | 'MORE' | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSettingsToast, setShowSettingsToast] = useState(false);

  // Card click trigger with animation: Scale Down -> Glow -> Scale Up -> Open
  const handleCardClick = (id: WorldFeatureId | 'MORE') => {
    setAnimatingId(id);
    setTimeout(() => {
      setActiveFeature(id);
      setAnimatingId(null);
    }, 320);
  };

  // Render full-page feature views when selected
  if (activeFeature === 'BOX_OFFICE') return <BoxOfficeView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'REPRESENTATION') return <RepresentationView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'STREAMING') return <StreamingView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'BANKROLL') return <BankrollView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'TV_STATIONS') return <TvStationsView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'RADIO_STATIONS') return <RadioStationsView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'PERSONAL_STUDIO') return <PersonalStudioView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'SOCIALS') return <SocialsView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'AWARDS') return <AwardsView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'LAWYERS') return <LawyersView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'STOCK_COIN') return <StockCoinView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'STAR_STOCKS') return <StarStocksView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'FILMING_LOCATIONS') return <FilmingLocationsView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'ENDORSEMENTS') return <EndorsementsView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'STUDIO_RELATIONSHIPS') return <StudioRelationshipsView onBack={() => setActiveFeature(null)} />;

  // 15 Cards grouped strictly in 5 Rows (3 per row)
  const gridRows = [
    // ROW 1
    [
      {
        id: 'BOX_OFFICE' as const,
        name: 'BOX OFFICE',
        desc: 'Global Charts',
        icon: TrendingUp,
        badge: 'Top 50',
        color: 'from-amber-500/20 via-amber-950/40 to-black',
        border: 'border-amber-400/40',
        glowColor: 'shadow-amber-500/30',
        iconColor: 'text-amber-400',
      },
      {
        id: 'STREAMING' as const,
        name: 'STREAMING',
        desc: '13 Platforms',
        icon: Video,
        badge: 'Netflix & HBO',
        color: 'from-purple-500/20 via-purple-950/40 to-black',
        border: 'border-purple-400/40',
        glowColor: 'shadow-purple-500/30',
        iconColor: 'text-purple-400',
      },
      {
        id: 'RADIO_STATIONS' as const,
        name: 'RADIO',
        desc: 'Airwave Media',
        icon: Radio,
        badge: 'BBC & KIIS',
        color: 'from-indigo-500/20 via-indigo-950/40 to-black',
        border: 'border-indigo-400/40',
        glowColor: 'shadow-indigo-500/30',
        iconColor: 'text-indigo-400',
      },
    ],
    // ROW 2
    [
      {
        id: 'TV_STATIONS' as const,
        name: 'TV STATIONS',
        desc: 'Talk Shows',
        icon: Tv,
        badge: 'Live Air',
        color: 'from-sky-500/20 via-sky-950/40 to-black',
        border: 'border-sky-400/40',
        glowColor: 'shadow-sky-500/30',
        iconColor: 'text-sky-400',
      },
      {
        id: 'AWARDS' as const,
        name: 'AWARDS',
        desc: 'Oscars & Emmys',
        icon: Trophy,
        badge: 'Guilds',
        color: 'from-yellow-500/20 via-yellow-950/40 to-black',
        border: 'border-yellow-400/40',
        glowColor: 'shadow-yellow-500/30',
        iconColor: 'text-yellow-400',
      },
      {
        id: 'LAWYERS' as const,
        name: 'LAWYERS',
        desc: 'Beverly Firms',
        icon: Scale,
        badge: '7 Defense',
        color: 'from-stone-500/20 via-stone-950/40 to-black',
        border: 'border-stone-400/40',
        glowColor: 'shadow-stone-500/30',
        iconColor: 'text-stone-300',
      },
    ],
    // ROW 3
    [
      {
        id: 'SOCIALS' as const,
        name: 'SOCIALS',
        desc: '6 Platforms',
        icon: Share2,
        badge: 'X / IG',
        color: 'from-pink-500/20 via-pink-950/40 to-black',
        border: 'border-pink-400/40',
        glowColor: 'shadow-pink-500/30',
        iconColor: 'text-pink-400',
      },
      {
        id: 'STAR_STOCKS' as const,
        name: 'STAR STOCKS',
        desc: 'Wall Street',
        icon: BarChart3,
        badge: 'Equities',
        color: 'from-emerald-500/20 via-emerald-950/40 to-black',
        border: 'border-emerald-400/40',
        glowColor: 'shadow-emerald-500/30',
        iconColor: 'text-emerald-400',
      },
      {
        id: 'STOCK_COIN' as const,
        name: 'STAR COIN',
        desc: 'Crypto Market',
        icon: Coins,
        badge: 'Exchange',
        color: 'from-cyan-500/20 via-cyan-950/40 to-black',
        border: 'border-cyan-400/40',
        glowColor: 'shadow-cyan-500/30',
        iconColor: 'text-cyan-400',
      },
    ],
    // ROW 4
    [
      {
        id: 'PERSONAL_STUDIO' as const,
        name: 'PERSONAL STUDIO',
        desc: 'Produce Slate',
        icon: Clapperboard,
        badge: 'Studio',
        color: 'from-rose-500/20 via-rose-950/40 to-black',
        border: 'border-rose-400/40',
        glowColor: 'shadow-rose-500/30',
        iconColor: 'text-rose-400',
      },
      {
        id: 'BANKROLL' as const,
        name: 'BANKROLL',
        desc: 'Manager Deals',
        icon: DollarSign,
        badge: player.representation?.manager?.signed ? 'Financing' : 'Locked',
        color: 'from-emerald-600/20 via-emerald-950/40 to-black',
        border: 'border-emerald-500/40',
        glowColor: 'shadow-emerald-600/30',
        iconColor: 'text-emerald-300',
      },
      {
        id: 'ENDORSEMENTS' as const,
        name: 'ENDORSEMENTS',
        desc: 'Luxury Brands',
        icon: Handshake,
        badge: 'Deals',
        color: 'from-amber-600/20 via-amber-950/40 to-black',
        border: 'border-amber-500/40',
        glowColor: 'shadow-amber-600/30',
        iconColor: 'text-amber-300',
      },
    ],
    // ROW 5
    [
      {
        id: 'STUDIO_RELATIONSHIPS' as const,
        name: 'STUDIO RELATIONS',
        desc: '25 Studios',
        icon: Building2,
        badge: 'Rapport',
        color: 'from-violet-500/20 via-violet-950/40 to-black',
        border: 'border-violet-400/40',
        glowColor: 'shadow-violet-500/30',
        iconColor: 'text-violet-400',
      },
      {
        id: 'FILMING_LOCATIONS' as const,
        name: 'LOCATIONS',
        desc: '50 Cities',
        icon: Globe,
        badge: 'Rebates',
        color: 'from-teal-500/20 via-teal-950/40 to-black',
        border: 'border-teal-400/40',
        glowColor: 'shadow-teal-500/30',
        iconColor: 'text-teal-400',
      },
      {
        id: 'MORE' as const,
        name: 'MORE',
        desc: 'Future Empire',
        icon: Sparkles,
        badge: 'Expansion',
        color: 'from-fuchsia-500/20 via-fuchsia-950/40 to-black',
        border: 'border-fuchsia-400/40',
        glowColor: 'shadow-fuchsia-500/30',
        iconColor: 'text-fuchsia-300',
      },
    ],
  ];

  return (
    <div
      className="w-full min-h-full flex flex-col p-3 sm:p-5 select-none pb-12 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* GLASSMORPHISM TOP HEADER */}
      <div className="p-4 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl font-black tracking-wider text-white flex items-center gap-2">
            WORLD
            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
              BEAST MODE
            </span>
          </h1>
          <p className="text-xs text-amber-300/90 font-bold mt-0.5">Build Your Hollywood Empire</p>
        </div>

        {/* Top Right Controls & Status */}
        <div className="flex items-center gap-2">
          {/* Money Badge */}
          <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-black text-xs flex items-center gap-1 shadow-md">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>${player.money.toLocaleString()}</span>
          </div>

          {/* Notification Button */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="p-2.5 rounded-2xl bg-black/50 border border-white/10 text-amber-400 hover:text-white hover:border-amber-400/50 transition-all cursor-pointer relative shadow-md"
            title="Industry Bulletins"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings Shortcut */}
          <button
            onClick={() => {
              setShowSettingsToast(true);
              setTimeout(() => setShowSettingsToast(false), 2500);
            }}
            className="p-2.5 rounded-2xl bg-black/50 border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-md"
            title="Settings Shortcut"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettingsToast && (
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black shadow-xl text-center">
          ⚡ Settings & Customizations accessible from the Main Game Home.
        </div>
      )}

      {/* MORE EXPANSION MODAL */}
      {activeFeature === 'MORE' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl border border-fuchsia-500/40 bg-black/90 max-w-md w-full space-y-4 shadow-2xl text-center relative">
            <button
              onClick={() => setActiveFeature(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-gray-400 hover:text-white border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/40 flex items-center justify-center mx-auto text-fuchsia-400">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase">Empire Future Expansions</h2>
              <p className="text-xs text-fuchsia-300 font-medium leading-relaxed">
                Unlock future Hollywood modules as your personal wealth exceeds $10M: Hollywood Real Estate Holdings,
                Venture Capital Fund, Global Concert Tours, and Theme Park Licensing.
              </p>
            </div>

            <button
              onClick={() => setActiveFeature(null)}
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-fuchsia-400 text-black hover:scale-102 cursor-pointer transition-all shadow-xl"
            >
              CLOSE PREVIEW
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl border border-amber-500/40 bg-black/90 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Industry Intelligence Bulletins
              </h2>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="p-2 rounded-xl bg-black/60 text-gray-400 hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                • <strong>Box Office Update:</strong> Theatrical attendance up 14% this weekend across major multiplexes.
              </div>
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-200">
                • <strong>Streaming Intelligence:</strong> Netstar and HBO Max competing for upcoming sci-fi streaming rights.
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                • <strong>Wall Street Alert:</strong> Entertainment equities show positive momentum ahead of Q3 earnings.
              </div>
            </div>

            <button
              onClick={() => setShowNotificationsModal(false)}
              className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 cursor-pointer transition-all shadow-xl"
            >
              DISMISS BULLETINS
            </button>
          </div>
        </div>
      )}

      {/* PREMIUM GRID VIEW - 3 CARDS PER ROW IN PORTRAIT */}
      <div className="space-y-3">
        {gridRows.map((row, rowIdx) => (
          <div key={`row_${rowIdx}`} className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {row.map((feat) => {
              const Icon = feat.icon;
              const isAnimating = animatingId === feat.id;

              return (
                <button
                  key={feat.id}
                  onClick={() => handleCardClick(feat.id as any)}
                  className={`relative p-3 sm:p-4 rounded-3xl border ${feat.border} bg-gradient-to-b ${
                    feat.color
                  } backdrop-blur-md shadow-xl flex flex-col justify-between items-center text-center space-y-2 cursor-pointer group transition-all duration-300 ${
                    isAnimating
                      ? 'scale-90 ring-4 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.9)]'
                      : 'hover:scale-104 hover:brightness-125'
                  }`}
                  style={{ minHeight: '135px' }}
                >
                  {/* Top Badge */}
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full bg-black/70 text-amber-300 border border-white/10 w-full truncate">
                    {feat.badge}
                  </span>

                  {/* Large Center Icon */}
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-black/60 border border-white/10 group-hover:border-amber-400/60 group-hover:scale-110 transition-all shadow-lg">
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${feat.iconColor}`} />
                  </div>

                  {/* Card Title & Description */}
                  <div className="w-full">
                    <h2 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                      {feat.name}
                    </h2>
                    <p className="text-[9px] sm:text-[10px] text-gray-300/80 font-bold truncate mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
