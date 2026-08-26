/**
 * HOLLYWOOD RISING - World Screen (Phase 3 Premium Grid Redesign)
 * Modern 3-Cards-Per-Row Grid Layout with Glassmorphism, & Glow Tap Animations,
 * Top Bar Controls & Full Interconnected Hollywood Business Ecosystem.
 */

import React, { useMemo, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WorldFeatureId } from '../../types/world';
import { loadStreamingState } from '../../services/streamingEngine';
import { MarketEngineService } from '../../services/marketEngineService';
import { EmpireService } from '../../services/empireService';
import { CommandDeckStyles, CommandDeckCard, DeckAccent } from '../common/CommandDeck';
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
import { StockCoinView } from '../world/StockCoinView';
import { StarStocksView } from '../world/StarStocksView';
import { FilmingLocationsView } from '../world/FilmingLocationsView';
import { EndorsementsView } from '../world/EndorsementsView';
import { StudioRelationshipsView } from '../world/StudioRelationshipsView';

// ---------------------------------------------------------------------------
// INDUSTRY BULLETINS — derived from live game state only (no static filler).
// Each bulletin references a real theatrical run, streaming bid, market move
// or active feud. Refreshes naturally every week.
// ---------------------------------------------------------------------------

const BULLETINS_SEEN_KEY = 'HR_WORLD_BULLETINS_SEEN';

interface WorldBulletin {
  tone: 'emerald' | 'sky' | 'amber' | 'red';
  label: string;
  text: string;
}

const BULLETIN_TONES: Record<WorldBulletin['tone'], string> = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
  sky: 'bg-sky-500/10 border-sky-500/20 text-sky-200',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
  red: 'bg-red-500/10 border-red-500/20 text-red-200',
};

function buildWorldBulletins(player: any, saveData: any): WorldBulletin[] {
  const out: WorldBulletin[] = [];
  try {
    const running = (saveData?.releasedMovies || []).filter((m: any) => m.inCinemas);
    if (running.length > 0) {
      const top = [...running].sort(
        (a: any, b: any) => (b.worldwideGross || 0) - (a.worldwideGross || 0)
      )[0];
      out.push({
        tone: 'emerald',
        label: 'Box Office',
        text: `"${top.movieTitle}" is still in theaters — $${((top.worldwideGross || 0) / 1000000).toFixed(1)}M worldwide after ${top.weeksInCinemas || 1} week${(top.weeksInCinemas || 1) === 1 ? '' : 's'}.`,
      });
    }
  } catch {}
  try {
    const bids = loadStreamingState().pendingBids.filter((b: any) => b.status === 'PENDING');
    if (bids.length > 0) {
      out.push({
        tone: 'sky',
        label: 'Streaming',
        text: `${bids.length} platform bid${bids.length === 1 ? '' : 's'} pending for "${bids[0].projectTitle}" — the first window closes in ${bids[0].weeksLeft ?? 3} week${(bids[0].weeksLeft ?? 3) === 1 ? '' : 's'}.`,
      });
    }
  } catch {}
  try {
    const mk: any = MarketEngineService.getMarketState();
    const hotCoin = [...(mk.cryptoCoins || [])].sort(
      (a: any, b: any) => Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0)
    )[0];
    const hotStock = [...(mk.stocks || [])].sort(
      (a: any, b: any) => Math.abs(b.changePct || 0) - Math.abs(a.changePct || 0)
    )[0];
    if (hotCoin && Math.abs(hotCoin.change24h || 0) >= 4) {
      const dir = (hotCoin.change24h || 0) > 0 ? 'up' : 'down';
      out.push({
        tone: 'amber',
        label: 'Markets',
        text: `${hotCoin.name} (${hotCoin.symbol}) is ${dir} ${Math.abs(hotCoin.change24h).toFixed(1)}% this week${hotStock && Math.abs(hotStock.changePct || 0) >= 3 ? `; ${hotStock.ticker} ${((hotStock.changePct || 0) > 0 ? 'rallying' : 'sliding')} ${Math.abs(hotStock.changePct).toFixed(1)}%` : ''}.`,
      });
    }
  } catch {}
  try {
    const feuds = (EmpireService.loadState(player).rivalries || []).filter(
      (r: any) => !r.resolved && ['Feud', 'Arch Rival', 'Legendary Rival'].includes(r.heatLevel || '')
    );
    if (feuds.length > 0) {
      out.push({
        tone: 'red',
        label: 'Rivalries',
        text: `${feuds[0].name} feud at ${feuds[0].rivalryScore}/100 heat (${feuds[0].heatLevel}) — the War Room is watching.`,
      });
    }
  } catch {}
  return out.slice(0, 5);
}

export const WorldScreen: React.FC = () => {
  const { player, settings, saveData } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeFeature, setActiveFeature] = useState<WorldFeatureId | 'MORE' | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSettingsToast, setShowSettingsToast] = useState(false);

  // Real bulletins, rebuilt from live state whenever the modal opens or the
  // week advances. Dismissing marks the CURRENT week as seen; the badge only
  // returns when a new week brings fresh bulletins.
  const bulletins = useMemo(
    () => buildWorldBulletins(player, saveData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player.dateWeek, player.dateYear, showNotificationsModal, saveData.releasedMovies]
  );
  const seenWeekKey = `${player.dateWeek}_${player.dateYear}`;
  const [bulletinsSeenKey, setBulletinsSeenKey] = useState<string>(() => {
    try { return localStorage.getItem(BULLETINS_SEEN_KEY) || ''; } catch { return ''; }
  });
  const hasUnseenBulletins = bulletinsSeenKey !== seenWeekKey && bulletins.length > 0;

  const dismissBulletins = () => {
    try { localStorage.setItem(BULLETINS_SEEN_KEY, seenWeekKey); } catch {}
    setBulletinsSeenKey(seenWeekKey);
    setShowNotificationsModal(false);
  };

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
  if (activeFeature === 'STOCK_COIN') return <StockCoinView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'STAR_STOCKS') return <StarStocksView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'FILMING_LOCATIONS') return <FilmingLocationsView onBack={() => setActiveFeature(null)} />;
  if (activeFeature === 'ENDORSEMENTS') return <EndorsementsView onBack={() => setActiveFeature(null)} />;
// COMMAND DECK accents per World feature — blue = media, green = money, red = competitive
const WORLD_DECK_ACCENT: Record<string, DeckAccent> = {
  BOX_OFFICE: 'warn',
  STREAMING: 'info',
  RADIO_STATIONS: 'info',
  TV_STATIONS: 'info',
  AWARDS: 'warn',
  SOCIALS: 'ok',
  STAR_STOCKS: 'ok',
  STOCK_COIN: 'warn',
  PERSONAL_STUDIO: 'warn',
  BANKROLL: 'ok',
  ENDORSEMENTS: 'ok',
  STUDIO_RELATIONSHIPS: 'info',
  FILMING_LOCATIONS: 'info',
  MORE: 'crit',
};

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
      className="w-full min-h-full cmdk-bg flex flex-col p-3 sm:p-5 select-none pb-12 space-y-4"
    >
      <CommandDeckStyles />
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
            {hasUnseenBulletins && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center">
                {bulletins.length}
              </span>
            )}
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
              {bulletins.length > 0 ? (
                bulletins.map((b, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl border ${BULLETIN_TONES[b.tone]}`}>
                    • <strong>{b.label}:</strong> {b.text}
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-center">
                  No industry bulletins this week — advance a week and check back. Bulletins only
                  appear when something real is happening: theatrical runs, streaming bids, market
                  moves or active feuds.
                </div>
              )}
            </div>

            <button
              onClick={dismissBulletins}
              className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 cursor-pointer transition-all shadow-xl"
            >
              DISMISS BULLETINS
            </button>
          </div>
        </div>
      )}

      {/* COMMAND DECK GRID VIEW - 3 CARDS PER ROW IN PORTRAIT */}
      <div className="space-y-3">
        {gridRows.map((row, rowIdx) => (
          <div key={`row_${rowIdx}`} className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {row.map((feat) => (
              <CommandDeckCard
                key={feat.id}
                icon={feat.icon}
                title={feat.name}
                subtitle={feat.desc}
                status={feat.badge}
                accent={WORLD_DECK_ACCENT[feat.id] || 'ok'}
                foot="WORLD FEED"
                animating={animatingId === feat.id}
                onClick={() => handleCardClick(feat.id as any)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
