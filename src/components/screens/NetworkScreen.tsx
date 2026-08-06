/**
 * HOLLYWOOD RISING - Network System Screen (Phase 4 Revision)
 * Completely redesigned Network Scene featuring a 3 Cards Per Row Grid layout matching World scene design language.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { THEMES } from '../../theme/colors';
import { NetworkFullState, NetworkFeatureId } from '../../types/network';
import { NetworkService } from '../../services/networkService';

// Sub-Views
import { JobBoardView } from '../network/JobBoardView';
import { HealthView } from '../network/HealthView';
import { PropertiesView } from '../network/PropertiesView';
import { VehiclesView } from '../network/VehiclesView';
import { NetWorthView } from '../network/NetWorthView';
import { BankView } from '../network/BankView';
import { VaultView } from '../network/VaultView';
import { SecurityView } from '../network/SecurityView';
import { SyndicationView } from '../network/SyndicationView';
import { Bankable100View } from '../network/Bankable100View';
import { ForbesListView } from '../network/ForbesListView';
import { FinancialAdvisorView } from '../network/FinancialAdvisorView';
import { EstatePlanningView } from '../network/EstatePlanningView';
import { FutureExpansionView } from '../network/FutureExpansionView';

import {
  Briefcase,
  Heart,
  Home,
  Car,
  DollarSign,
  Landmark,
  Lock,
  ShieldCheck,
  Tv,
  Award,
  Trophy,
  TrendingUp,
  FileText,
  Star,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const NetworkScreen: React.FC = () => {
  const { player, releasedMovies, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeView, setActiveView] = useState<NetworkFeatureId | null>(null);
  const [networkState, setNetworkState] = useState<NetworkFullState>(() =>
    NetworkService.loadState(player)
  );

  // AUTOMATIC END-WEEK TICK EVALUATION
  useEffect(() => {
    if (
      player.dateWeek > networkState.lastProcessedWeek ||
      player.dateYear > networkState.lastProcessedYear
    ) {
      const { nextState } = NetworkService.processWeeklyNetworkTick(
        networkState,
        player,
        releasedMovies
      );
      setNetworkState(nextState);
    }
  }, [player.dateWeek, player.dateYear]);

  const summary = NetworkService.calculateFinancialSummary(networkState, player.money);

  // RENDER DEDICATED SUB-PAGE IF A CARD IS OPEN
  if (activeView === 'JOB_BOARD') {
    return (
      <JobBoardView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'HEALTH') {
    return (
      <HealthView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'PROPERTIES') {
    return (
      <PropertiesView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'VEHICLES') {
    return (
      <VehiclesView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'NET_WORTH') {
    return <NetWorthView onBack={() => setActiveView(null)} networkState={networkState} />;
  }
  if (activeView === 'BANK' || activeView === 'FINANCIAL_REPUTATION') {
    return (
      <BankView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'VAULT') {
    return (
      <VaultView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'SECURITY') {
    return (
      <SecurityView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'SYNDICATION') {
    return <SyndicationView onBack={() => setActiveView(null)} networkState={networkState} />;
  }
  if (activeView === 'BANKABLE_100') {
    return <Bankable100View onBack={() => setActiveView(null)} />;
  }
  if (activeView === 'FORBES_LIST') {
    return <ForbesListView onBack={() => setActiveView(null)} />;
  }
  if (activeView === 'FINANCIAL_ADVISOR') {
    return (
      <FinancialAdvisorView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'ESTATE_PLANNING') {
    return (
      <EstatePlanningView
        onBack={() => setActiveView(null)}
        networkState={networkState}
        onUpdateState={setNetworkState}
      />
    );
  }
  if (activeView === 'FUTURE_EXPANSION') {
    return <FutureExpansionView onBack={() => setActiveView(null)} />;
  }

  // 15 GRID CARDS SPECIFICATION (5 ROWS X 3 CARDS PER ROW)
  const gridCards = [
    // ROW 1
    {
      id: 'JOB_BOARD' as NetworkFeatureId,
      title: 'JOB BOARD',
      emoji: '💼',
      icon: Briefcase,
      badge: `${networkState.activeJobs?.length || 0} / 2 Jobs Active`,
      highlightColor: 'from-amber-500/20 to-amber-950/40 border-amber-500/40 text-amber-300',
    },
    {
      id: 'HEALTH' as NetworkFeatureId,
      title: 'HEALTH',
      emoji: '❤️',
      icon: Heart,
      badge: `${networkState.healthState?.healthScore || 92}/100 Vitality`,
      highlightColor: 'from-rose-500/20 to-rose-950/40 border-rose-500/40 text-rose-300',
    },
    {
      id: 'PROPERTIES' as NetworkFeatureId,
      title: 'PROPERTIES',
      emoji: '🏡',
      icon: Home,
      badge: `${networkState.properties?.filter((p) => p.isOwned).length || 0} Owned`,
      highlightColor: 'from-emerald-500/20 to-emerald-950/40 border-emerald-500/40 text-emerald-300',
    },

    // ROW 2
    {
      id: 'VEHICLES' as NetworkFeatureId,
      title: 'VEHICLES',
      emoji: '🚗',
      icon: Car,
      badge: `${networkState.vehicles?.filter((v) => v.isOwned).length || 0} In Garage`,
      highlightColor: 'from-amber-500/20 to-yellow-950/40 border-amber-500/40 text-amber-300',
    },
    {
      id: 'NET_WORTH' as NetworkFeatureId,
      title: 'NET WORTH',
      emoji: '💰',
      icon: DollarSign,
      badge: `$${summary.netWorth >= 1000000 ? `${(summary.netWorth / 1000000).toFixed(1)}M` : `${(summary.netWorth / 1000).toFixed(0)}K`}`,
      highlightColor: 'from-emerald-500/20 to-teal-950/40 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'BANK' as NetworkFeatureId,
      title: 'BANK',
      emoji: '🏦',
      icon: Landmark,
      badge: `${networkState.bankAccount?.reputationRating || 'A'} Rating`,
      highlightColor: 'from-sky-500/20 to-blue-950/40 border-sky-500/40 text-sky-300',
    },

    // ROW 3
    {
      id: 'VAULT' as NetworkFeatureId,
      title: 'VAULT',
      emoji: '🔐',
      icon: Lock,
      badge: `${networkState.vaultItems?.length || 0} Collectibles`,
      highlightColor: 'from-purple-500/20 to-indigo-950/40 border-purple-500/40 text-purple-300',
    },
    {
      id: 'SECURITY' as NetworkFeatureId,
      title: 'SECURITY',
      emoji: '🛡',
      icon: ShieldCheck,
      badge: `${Math.min(100, networkState.securityPackages?.filter((s) => s.isHired).reduce((sum, s) => sum + s.protectionRatingBonus, 20) || 20)}% Defense`,
      highlightColor: 'from-emerald-500/20 to-green-950/40 border-emerald-500/40 text-emerald-300',
    },
    {
      id: 'SYNDICATION' as NetworkFeatureId,
      title: 'SYNDICATION',
      emoji: '📺',
      icon: Tv,
      badge: `${networkState.syndicationSources?.length || 0} Royalties`,
      highlightColor: 'from-sky-500/20 to-cyan-950/40 border-sky-500/40 text-sky-300',
    },

    // ROW 4
    {
      id: 'BANKABLE_100' as NetworkFeatureId,
      title: 'BANKABLE 100',
      emoji: '💯',
      icon: Award,
      badge: 'Star Power Ranking',
      highlightColor: 'from-amber-500/20 to-yellow-950/40 border-amber-500/40 text-amber-300',
    },
    {
      id: 'FORBES_LIST' as NetworkFeatureId,
      title: 'FORBES LIST',
      emoji: '🏆',
      icon: Trophy,
      badge: 'Top 100 Richest',
      highlightColor: 'from-amber-500/20 to-amber-950/40 border-amber-500/40 text-amber-300',
    },
    {
      id: 'FINANCIAL_ADVISOR' as NetworkFeatureId,
      title: 'FINANCIAL ADVISOR',
      emoji: '📈',
      icon: TrendingUp,
      badge: networkState.hiredAdvisorId ? 'Retained' : 'Select Advisor',
      highlightColor: 'from-emerald-500/20 to-emerald-950/40 border-emerald-500/40 text-emerald-300',
    },

    // ROW 5
    {
      id: 'ESTATE_PLANNING' as NetworkFeatureId,
      title: 'ESTATE PLANNING',
      emoji: '📜',
      icon: FileText,
      badge: networkState.estatePlan?.willCreated ? 'Will Executed' : 'Setup Will',
      highlightColor: 'from-amber-500/20 to-yellow-950/40 border-amber-500/40 text-amber-300',
    },
    {
      id: 'FINANCIAL_REPUTATION' as NetworkFeatureId,
      title: 'FINANCIAL REPUTATION',
      emoji: '⭐',
      icon: Star,
      badge: `${networkState.bankAccount?.reputationRating || 'A'} Credit Tier`,
      highlightColor: 'from-sky-500/20 to-blue-950/40 border-sky-500/40 text-sky-300',
    },
    {
      id: 'FUTURE_EXPANSION' as NetworkFeatureId,
      title: 'FUTURE EXPANSION',
      emoji: '⬜',
      icon: Sparkles,
      badge: 'Network Empire',
      highlightColor: 'from-white/10 to-black/60 border-white/20 text-gray-400',
    },
  ];

  return (
    <div
      className="w-full min-h-full flex flex-col p-3 sm:p-5 select-none pb-12 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* HEADER BANNER */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-2 relative overflow-hidden backdrop-blur-md"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-2xl">🌐</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                HOLLYWOOD INDUSTRY ROLODEX
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">THE NETWORK</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Net Worth</span>
            <span className="text-sm sm:text-base font-black text-emerald-400">
              ${summary.netWorth >= 1000000 ? `${(summary.netWorth / 1000000).toFixed(2)}M` : `${(summary.netWorth / 1000).toFixed(0)}K`}
            </span>
          </div>
        </div>
      </div>

      {/* NETWORK GRID: 3 CARDS PER ROW */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {gridCards.map((card) => {
          const IconComp = card.icon;

          return (
            <button
              key={card.id}
              onClick={() => setActiveView(card.id)}
              className={`p-3.5 sm:p-5 rounded-3xl border bg-gradient-to-b ${card.highlightColor} hover:scale-103 hover:shadow-2xl transition-all cursor-pointer flex flex-col items-center justify-between text-center space-y-2.5 relative overflow-hidden group shadow-xl`}
            >
              {/* Top Emoji / Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-3xl">{card.emoji}</span>
              </div>

              {/* Title & Badge */}
              <div className="space-y-1 w-full">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight leading-tight">
                  {card.title}
                </h3>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-gray-300 block bg-black/50 py-1 px-2 rounded-xl border border-white/5 truncate">
                  {card.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
