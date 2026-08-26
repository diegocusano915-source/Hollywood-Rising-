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
import { ReportsView } from '../empire/ReportsView';
import { CommandDeckStyles, CommandDeckCard, CommandDeckHeader, DeckAccent } from '../common/CommandDeck';

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

  // ---- COMMAND DECK: real status / accent / meter per feature ----
  const pct = (v: number, max: number) => Math.max(0, Math.min(100, Math.round((v / Math.max(1, max)) * 100)));
  const kfmt = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${Math.round(n)}`);

  const getDeckInfo = (id: EmpireFeatureId): {
    status: string; tag?: string; accent: DeckAccent;
    meter: { label: string; pct: number; text: string }; foot: string;
  } => {
    switch (id) {
      case 'HOLDING_COMPANY': {
        const hc = empireState?.holdingCompany;
        const formed = !!hc?.isFormed;
        return {
          status: formed ? 'ACTIVE' : 'INACTIVE',
          tag: formed ? 'FORMED' : 'PENDING',
          accent: formed ? 'warn' : 'crit',
          meter: { label: 'VALUATION SCALE', pct: formed ? pct(hc!.totalValuation || 0, 25000000) : 0, text: formed ? kfmt(hc!.totalValuation || 0) : 'NOT FORMED' },
          foot: formed ? 'PARENT CONGLOMERATE' : 'REQUIRES EMPIRE SCALE',
        };
      }
      case 'BUSINESS_VENTURES': {
        const profit = businessesList.reduce((s, b) => s + (b?.weeklyRevenue || 0), 0);
        return {
          status: `${businessesList.length} UNIT${businessesList.length === 1 ? '' : 'S'}`,
          tag: 'PROFIT',
          accent: businessesList.length > 0 ? 'ok' : 'crit',
          meter: { label: 'WEEKLY PROFIT', pct: pct(profit, 150000), text: profit > 0 ? `${kfmt(profit)}/WK` : 'NO REVENUE' },
          foot: businessesList.length > 0 ? 'COMMERCIAL BRANDS' : 'NO VENTURES YET',
        };
      }
      case 'REAL_ESTATE': {
        const rent = realEstateList.reduce((s, r) => s + (r?.weeklyRentalIncome || 0), 0);
        return {
          status: `${realEstateList.length} PROP${realEstateList.length === 1 ? '' : 'S'}`,
          tag: 'MARKET',
          accent: realEstateList.length > 0 ? 'info' : 'crit',
          meter: { label: 'RENT INCOME', pct: pct(rent, 100000), text: rent > 0 ? `${kfmt(rent)}/WK` : 'NONE RENTED' },
          foot: realEstateList.length > 0 ? 'PORTFOLIO LIVE · 4WK CYCLE' : 'NO HOLDINGS',
        };
      }
      case 'CORPORATE_BOARD': {
        const gates =
          (player.moviesCompleted >= 8 ? 1 : 0) +
          (player.fameXp >= 2000 ? 1 : 0) +
          (player.awardsWon >= 1 ? 1 : 0) +
          ((player.industryRespect || 0) >= 55 ? 1 : 0) +
          (player.money >= 10000000 ? 1 : 0);
        const readiness = pct(gates, 5);
        return {
          status: gates >= 5 ? 'UNLOCKED' : 'LOCKED',
          tag: `${gates}/5 GATES`,
          accent: gates >= 5 ? 'ok' : 'crit',
          meter: { label: 'BUYOUT READINESS', pct: readiness, text: `${readiness}%` },
          foot: gates >= 5 ? 'TAKEOVER DESK OPEN' : 'GATES SEALED UNTIL ESTABLISHED',
        };
      }
      case 'GLOBAL_EXPANSION': {
        const hubs = (empireState?.globalHubs || []).length;
        return {
          status: hubs > 0 ? 'ACTIVE' : 'LOCKED',
          tag: `${hubs} HUB${hubs === 1 ? '' : 'S'}`,
          accent: hubs > 0 ? 'ok' : 'crit',
          meter: { label: 'GLOBAL REACH', pct: pct(hubs, 6), text: `${hubs}/6 REGIONS` },
          foot: hubs > 0 ? 'INTERNATIONAL OFFICES' : 'NO INTERNATIONAL PRESENCE',
        };
      }
      case 'ELITE_CLUB': {
        const member = !!empireState?.eliteClub?.isMember;
        return {
          status: member ? 'MEMBER' : 'LOCKED',
          tag: 'VIP',
          accent: member ? 'warn' : 'crit',
          meter: { label: 'SOCIETY ACCESS', pct: member ? 100 : 0, text: member ? 'ACTIVE' : 'INQUIRE WITHIN' },
          foot: member ? 'BILLIONAIRE SOCIETY' : 'INVITATION REQUIRED',
        };
      }
      case 'RIVALRIES': {
        const feuds = (empireState?.rivalries || []).length;
        return {
          status: feuds > 0 ? 'ENGAGED' : 'CLEAR',
          tag: `${feuds} FEUD${feuds === 1 ? '' : 'S'}`,
          accent: feuds > 0 ? 'crit' : 'ok',
          meter: { label: 'WAR ROOM PRESSURE', pct: pct(feuds, 5), text: feuds > 0 ? `${feuds} ACTIVE` : 'NO FEUDS' },
          foot: feuds > 0 ? 'PRESS BATTLES LIVE' : 'NO ACTIVE FEUDS',
        };
      }
      case 'ACTING_ACADEMY': {
        const ac = empireState?.actingAcademy;
        const open = !!ac?.isOpen;
        const students = (ac?.students || []).length;
        return {
          status: open ? 'OPEN' : 'CLOSED',
          tag: `LVL ${ac?.campusLevel || 0}`,
          accent: open ? 'warn' : 'crit',
          meter: { label: 'ENROLLMENT', pct: pct(students, 250), text: open ? `${students} ENROLLED` : 'CAMPUS SHUT' },
          foot: open ? `${kfmt(ac?.weeklyTuitionIncome || 0)}/WK TUITION` : 'CAMPUS NOT OPENED',
        };
      }
      case 'TAX_REVENUE': {
        const tier = empireState?.taxState?.accountantTier || 'None';
        const tierPct = tier === 'Elite Offshore Tax Attorneys' ? 100 : tier === 'Boutique Firm' ? 70 : tier === 'Standard CPA' ? 40 : 0;
        return {
          status: tierPct > 0 ? 'RETAINED' : 'STANDARD',
          tag: tierPct > 0 ? 'CPA' : 'DIY',
          accent: tierPct > 0 ? 'warn' : 'info',
          meter: { label: 'TAX STRATEGY', pct: tierPct, text: tier.toUpperCase() },
          foot: tierPct > 0 ? `${tier} ACTIVE` : 'NO ACCOUNTANT RETAINED',
        };
      }
      case 'ACHIEVEMENTS': {
        const all = empireState?.achievements || [];
        const unlocked = all.filter((a) => a?.isUnlocked).length;
        return {
          status: 'SYNCED',
          tag: `${unlocked}/${all.length}`,
          accent: 'ok',
          meter: { label: 'MOGUL TRACK', pct: pct(unlocked, Math.max(1, all.length)), text: `${pct(unlocked, Math.max(1, all.length))}%` },
          foot: 'MILESTONES & REWARDS',
        };
      }
      case 'LEGACY': {
        const score = empireState?.legacy?.hallOfFameScore || 0;
        return {
          status: score > 0 ? 'TRACKING' : 'PENDING',
          tag: score >= 800 ? 'LEGEND' : score >= 500 ? 'ICON' : 'RISING',
          accent: 'info',
          meter: { label: 'HALL OF FAME', pct: pct(score, 800), text: `${score}/800` },
          foot: empireState?.legacy?.walkOfFameStar ? '★ WALK OF FAME STAR' : 'STAR PENDING',
        };
      }
      case 'FOUNDATION': {
        const f = empireState?.foundation;
        const est = !!f?.isEstablished;
        return {
          status: est ? 'RUNNING' : 'PENDING',
          tag: est ? 'LIVE' : 'N/A',
          accent: est ? 'ok' : 'crit',
          meter: { label: 'ENDOWMENT POOL', pct: est ? pct(f!.endowmentPool || 0, 10000000) : 0, text: est ? kfmt(f!.endowmentPool || 0) : 'NOT ESTABLISHED' },
          foot: est ? `GOODWILL ${f!.goodwillScore || 0}/100` : 'ESTABLISH TO BEGIN',
        };
      }
      case 'REPORTS': {
        const assets = businessesList.length + realEstateList.length;
        return {
          status: assets > 0 ? 'READY' : 'EMPTY',
          tag: 'AUDIT',
          accent: assets > 0 ? 'info' : 'crit',
          meter: { label: 'STATEMENTS FILED', pct: pct(assets, 12), text: assets > 0 ? `${assets} ENTITIES` : 'NO STATEMENTS' },
          foot: assets > 0 ? 'P&L + VALUATION AUDITS' : 'NEED ASSETS FIRST',
        };
      }
      case 'EMPIRE_DASHBOARD': {
        return {
          status: 'TRACKING',
          tag: 'ALL SYSTEMS',
          accent: 'warn',
          meter: { label: 'MOGUL NET WORTH', pct: pct(totalEmpireVal, 100000000), text: kfmt(totalEmpireVal) },
          foot: `CONSOLIDATED · WK ${player.dateWeek} Y${player.dateYear}`,
        };
      }
      default:
        return { status: 'ONLINE', accent: 'ok', meter: { label: 'STATUS', pct: 100, text: 'OK' }, foot: 'SYSTEM' };
    }
  };

  return (
    <div className="w-full min-h-full cmdk-bg text-white p-3 sm:p-4 select-none pb-12">
      <CommandDeckStyles />
      {activeFeature ? (
        renderSubView()
      ) : (
        <div className="max-w-6xl mx-auto space-y-5">
          {/* HUD Header — command deck language */}
          <CommandDeckHeader
            title="HOLLYWOOD EMPIRE"
            metaLeft={<>NET WORTH <b className="text-[#3ddc97]">${totalEmpireVal.toLocaleString()}</b></>}
            metaRight={<>ENTITIES <b className="text-[#3ddc97]">{businessesList.length + realEstateList.length}</b> · WK {player.dateWeek} Y{player.dateYear}</>}
          />

          {/* Grid Layout: Exactly 3 Cards Per Row on Medium/Large screens */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-black uppercase text-[#6fae8f] tracking-[3px] font-mono">
                MOGUL OPERATIONS GRID
              </span>
              <span className="text-[10px] text-[#3ddc97]/80 font-bold font-mono tracking-widest">16 ENTERPRISE SYSTEMS</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {EMPIRE_FEATURE_CARDS.map((card) => {
                const IconComponent = card.icon;
                const deck = getDeckInfo(card.id);

                return (
                  <CommandDeckCard
                    key={card.id}
                    icon={IconComponent}
                    title={card.title}
                    subtitle={card.subtitle}
                    status={deck.status}
                    tag={deck.tag}
                    accent={deck.accent}
                    meter={deck.meter}
                    foot={deck.foot}
                    onClick={() => setActiveFeature(card.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

