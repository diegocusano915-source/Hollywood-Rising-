/**
 * HOLLYWOOD RISING - Phase 5 Empire Scene
 * Master Empire Hub featuring a 3-cards-per-row grid layout for all empire features.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, EmpireFeatureId } from '../../types/empire';
import { EmpireService } from '../../services/empireService';

// Sub-View Components
import { HoldingCompanyView } from '../empire/HoldingCompanyView';
import { BusinessVenturesView } from '../empire/BusinessVenturesView';
import { RealEstateEmpireView } from '../empire/RealEstateEmpireView';
import { RivalriesView } from '../empire/RivalriesView';
import { EliteClubView } from '../empire/EliteClubView';
import { ActingAcademyView } from '../empire/ActingAcademyView';
import { TaxRevenueView } from '../empire/TaxRevenueView';
import { AchievementsView } from '../empire/AchievementsView';
import { LegacyView } from '../empire/LegacyView';
import { CorporateBoardView } from '../empire/CorporateBoardView';
import { GlobalExpansionView } from '../empire/GlobalExpansionView';
import { FoundationView } from '../empire/FoundationView';
import { EmpireDashboardView } from '../empire/EmpireDashboardView';
import { InvestmentsView } from '../empire/InvestmentsView';
import { SecurityView } from '../empire/SecurityView';
import { ReportsView } from '../empire/ReportsView';

import {
  Building2,
  Briefcase,
  Building,
  Swords,
  Crown,
  GraduationCap,
  Landmark,
  Trophy,
  Star,
  Users,
  Globe,
  Heart,
  LayoutDashboard,
  TrendingUp,
  Shield,
  FileText,
} from 'lucide-react';

interface FeatureCardConfig {
  id: EmpireFeatureId;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeText?: string;
}

const EMPIRE_FEATURE_CARDS: FeatureCardConfig[] = [
  // Row 1
  {
    id: 'HOLDING_COMPANY',
    title: 'Holding Company',
    subtitle: 'Parent Conglomerate & C-Suite',
    icon: Building2,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:border-amber-400',
  },
  {
    id: 'BUSINESS_VENTURES',
    title: 'Business Ventures',
    subtitle: 'Commercial Brands & Ventures',
    icon: Briefcase,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:border-purple-400',
  },
  {
    id: 'REAL_ESTATE',
    title: 'Real Estate Empire',
    subtitle: 'Hotels, Film Lots & Towers',
    icon: Building,
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10 hover:border-sky-400',
  },

  // Row 2
  {
    id: 'INVESTMENTS',
    title: 'Investments & Equity',
    subtitle: 'Stock Portfolio & Venture Funds',
    icon: TrendingUp,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-400',
  },
  {
    id: 'CORPORATE_BOARD',
    title: 'Corporate Board',
    subtitle: 'Executive Board Directorships',
    icon: Users,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 hover:border-indigo-400',
  },
  {
    id: 'GLOBAL_EXPANSION',
    title: 'Global Expansion',
    subtitle: 'International Offices & Hubs',
    icon: Globe,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-400',
  },

  // Row 3
  {
    id: 'SECURITY',
    title: 'Security & Protection',
    subtitle: 'Bodyguards & Cyber Security',
    icon: Shield,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:border-blue-400',
  },
  {
    id: 'ELITE_CLUB',
    title: 'Elite Club',
    subtitle: 'Billionaire Society & VIPs',
    icon: Crown,
    color: 'text-amber-300 border-amber-400/30 bg-amber-400/10 hover:border-amber-300',
  },
  {
    id: 'RIVALRIES',
    title: 'Rivalries & Feuds',
    subtitle: 'Public Feuds & Press Battles',
    icon: Swords,
    color: 'text-red-400 border-red-500/30 bg-red-500/10 hover:border-red-400',
  },

  // Row 4
  {
    id: 'ACTING_ACADEMY',
    title: 'Acting Academy',
    subtitle: 'Dramatic Arts Conservatory',
    icon: GraduationCap,
    color: 'text-teal-400 border-teal-500/30 bg-teal-500/10 hover:border-teal-400',
  },
  {
    id: 'TAX_REVENUE',
    title: 'Tax & Deductions',
    subtitle: 'CPA Counsel & Tax Planning',
    icon: Landmark,
    color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-400',
  },
  {
    id: 'ACHIEVEMENTS',
    title: 'Mogul Achievements',
    subtitle: 'Badges & Milestone Rewards',
    icon: Trophy,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:border-amber-400',
  },

  // Row 5
  {
    id: 'LEGACY',
    title: 'Legacy & Hall of Fame',
    subtitle: 'Walk of Fame & Memoirs',
    icon: Star,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:border-rose-400',
  },
  {
    id: 'FOUNDATION',
    title: 'Global Foundation',
    subtitle: 'Charity & Philanthropy',
    icon: Heart,
    color: 'text-pink-400 border-pink-500/30 bg-pink-500/10 hover:border-pink-400',
  },
  {
    id: 'REPORTS',
    title: 'Financial Reports',
    subtitle: 'Performance Audits & P&L',
    icon: FileText,
    color: 'text-violet-400 border-violet-500/30 bg-violet-500/10 hover:border-violet-400',
  },

  // Row 6
  {
    id: 'EMPIRE_DASHBOARD',
    title: 'Empire Statistics',
    subtitle: 'Mogul Valuation & Financials',
    icon: LayoutDashboard,
    color: 'text-amber-300 border-amber-400/40 bg-amber-500/20 hover:border-amber-300',
  },
];

export const EmpireScreen: React.FC = () => {
  const { player } = useGame();
  const [empireState, setEmpireState] = useState<EmpireFullState>(() => EmpireService.loadState(player));
  const [activeFeature, setActiveFeature] = useState<EmpireFeatureId | null>(null);

  useEffect(() => {
    // Reload state when screen mounts
    setEmpireState(EmpireService.loadState(player));
  }, [player]);

  const handleUpdateState = (newState: EmpireFullState) => {
    setEmpireState(newState);
  };

  // Render Sub-Views
  const renderSubView = () => {
    switch (activeFeature) {
      case 'HOLDING_COMPANY':
        return (
          <HoldingCompanyView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'BUSINESS_VENTURES':
        return (
          <BusinessVenturesView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'REAL_ESTATE':
        return (
          <RealEstateEmpireView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'INVESTMENTS':
        return (
          <InvestmentsView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'RIVALRIES':
        return (
          <RivalriesView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'ELITE_CLUB':
        return (
          <EliteClubView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'ACTING_ACADEMY':
        return (
          <ActingAcademyView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'TAX_REVENUE':
        return (
          <TaxRevenueView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'ACHIEVEMENTS':
        return (
          <AchievementsView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'LEGACY':
        return (
          <LegacyView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'CORPORATE_BOARD':
        return (
          <CorporateBoardView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'GLOBAL_EXPANSION':
        return (
          <GlobalExpansionView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'FOUNDATION':
        return (
          <FoundationView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'SECURITY':
        return (
          <SecurityView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'REPORTS':
        return (
          <ReportsView
            empireState={empireState}
            onUpdateState={handleUpdateState}
            onBack={() => setActiveFeature(null)}
          />
        );
      case 'EMPIRE_DASHBOARD':
        return <EmpireDashboardView empireState={empireState} onBack={() => setActiveFeature(null)} />;
      default:
        return null;
    }
  };

  // Calculate Net Worth & Weekly Passive Income
  const businessesList = empireState?.businesses || [];
  const realEstateList = empireState?.realEstate || [];
  const totalBizVal = businessesList.reduce((sum, b) => sum + (b?.totalValuation || 0), 0);
  const totalREVal = realEstateList.reduce((sum, r) => sum + (r?.currentValuation || 0), 0);
  const totalEmpireVal = (player?.money || 0) + totalBizVal + totalREVal;

  const getRealCardBadge = (id: EmpireFeatureId): string => {
    switch (id) {
      case 'HOLDING_COMPANY':
        return empireState?.holdingCompany?.isFormed
          ? `$${(empireState.holdingCompany.totalValuation || 0).toLocaleString()} Valuation`
          : 'Not Formed';
      case 'BUSINESS_VENTURES':
        return `Businesses: ${businessesList.length}`;
      case 'REAL_ESTATE':
        return `Properties: ${realEstateList.length}`;
      case 'INVESTMENTS':
        return empireState?.investments && (empireState.investments.portfolio || []).length > 0
          ? `${empireState.investments.portfolio.length} Holdings`
          : 'No Holdings';
      case 'ELITE_CLUB':
        return empireState?.eliteClub?.isMember ? 'Active Member' : 'Locked';
      case 'RIVALRIES':
        return `Active: ${(empireState?.rivalries || []).length}`;
      case 'ACTING_ACADEMY':
        return empireState?.actingAcademy?.isOpen ? 'Open' : 'Closed';
      case 'TAX_REVENUE':
        return empireState?.taxState?.accountantTier && empireState.taxState.accountantTier !== 'None'
          ? `${empireState.taxState.accountantTier} CPA`
          : 'Standard Tier';
      case 'ACHIEVEMENTS': {
        const unlocked = (empireState?.achievements || []).filter((a) => a?.isUnlocked).length;
        return `Unlocked: ${unlocked}/${(empireState?.achievements || []).length}`;
      }
      case 'LEGACY':
        return empireState?.legacy && (empireState.legacy.walkOfFameStar || (empireState.legacy.hallOfFameScore || 0) > 0)
          ? `${empireState.legacy.hallOfFameRank}`
          : 'Upcoming Talent';
      case 'FOUNDATION':
        return empireState?.foundation && empireState.foundation.isEstablished ? 'Established' : 'Not Established';
      case 'CORPORATE_BOARD':
        return `${(empireState?.boardSeats || []).length} Seats`;
      case 'GLOBAL_EXPANSION':
        return `${(empireState?.globalHubs || []).length} Offices`;
      case 'SECURITY':
        return empireState?.security && (empireState.security.activePackages || []).length > 0
          ? `${empireState.security.activePackages.length} Active`
          : 'Standard';
      case 'REPORTS':
        return businessesList.length > 0 || realEstateList.length > 0 ? 'Audits Ready' : 'No Statements';
      case 'EMPIRE_DASHBOARD':
        return `Valuation: $${totalEmpireVal.toLocaleString()}`;
      default:
        return '';
    }
  };

  return (
    <div className="w-full min-h-full bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white p-3 sm:p-4 select-none pb-12">
      {activeFeature ? (
        renderSubView()
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-black to-amber-500/10 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg">
                <Crown className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wide uppercase text-white">HOLLYWOOD EMPIRE</h1>
                <p className="text-xs text-amber-300 font-medium">
                  Holding Conglomerate, Commercial Real Estate, Global Hubs & Media Mogul Network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Consolidated Valuation</span>
                <span className="text-sm font-black text-amber-400">${totalEmpireVal.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Portfolio Entities</span>
                <span className="text-sm font-black text-emerald-400">
                  {businessesList.length + realEstateList.length} Assets
                </span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Exactly 3 Cards Per Row on Medium/Large screens */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
                Mogul Operations Grid
              </span>
              <span className="text-xs text-amber-300/80 font-bold">16 Enterprise Systems</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {EMPIRE_FEATURE_CARDS.map((card) => {
                const IconComponent = card.icon;
                const realBadge = getRealCardBadge(card.id);

                return (
                  <button
                    key={card.id}
                    onClick={() => setActiveFeature(card.id)}
                    className={`relative p-3 sm:p-4 rounded-3xl border backdrop-blur-md shadow-xl flex flex-col justify-between items-center text-center space-y-2 cursor-pointer group transition-all duration-300 hover:scale-104 hover:brightness-125 ${card.color}`}
                    style={{ minHeight: '135px' }}
                  >
                    {/* Top Badge */}
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full bg-black/70 text-amber-300 border border-white/10 w-full truncate">
                      {realBadge || 'ACTIVE'}
                    </span>

                    {/* Large Center Icon */}
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-black/60 border border-white/10 group-hover:border-amber-400/60 group-hover:scale-110 transition-all shadow-lg">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    {/* Card Title & Description */}
                    <div className="w-full">
                      <h3 className="text-[10px] sm:text-xs font-black text-white group-hover:text-amber-300 tracking-tight leading-tight truncate">
                        {card.title}
                      </h3>
                      <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold truncate mt-0.5">
                        {card.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

