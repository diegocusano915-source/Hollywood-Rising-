/**
 * HOLLYWOOD RISING - Representation Screen
 * 3 Cards Per Row Grid View displaying 13 distinct, grounded Representation features.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState, RepresentationFeatureId } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { THEMES } from '../../theme/colors';

// Sub-View Components
import { PublicRelationsView } from '../representation/PublicRelationsView';
import { LawFirmView } from '../representation/LawFirmView';
import { BrandPartnershipsView } from '../representation/BrandPartnershipsView';
import { SponsorshipsView } from '../representation/SponsorshipsView';
import { MediaCenterView } from '../representation/MediaCenterView';
import { FanClubView } from '../representation/FanClubView';
import { MerchandiseView } from '../representation/MerchandiseView';
import { ImageReputationView } from '../representation/ImageReputationView';
import { ContractArchiveView } from '../representation/ContractArchiveView';
import { InternationalRepView } from '../representation/InternationalRepView';
import { OfficialWebsiteView } from '../representation/OfficialWebsiteView';
import { MediaGalleryView } from '../representation/MediaGalleryView';
import { CharityCausesView } from '../representation/CharityCausesView';

import { HollywoodInsiderView } from '../representation/HollywoodInsiderView';
import { AgentsManagersView } from '../representation/AgentsManagersView';
import { HollywoodInsiderService } from '../../services/hollywoodInsiderService';

import {
  Megaphone,
  Scale,
  Handshake,
  Target,
  Newspaper,
  Heart,
  ShoppingBag,
  Star,
  FileText,
  Globe,
  Camera,
  HeartHandshake,
  Briefcase,
  UserRound,
  ChevronRight,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';

interface RepresentationCardConfig {
  id: RepresentationFeatureId;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeText?: (state: RepresentationFullState, player: any) => string | undefined;
}

const REPRESENTATION_CARDS: RepresentationCardConfig[] = [
  // FEATURED TOP ROW: TALENT AGENTS & PERSONAL MANAGERS (separate sections, always visible)
  {
    id: 'TALENT_AGENTS',
    title: 'Talent Agents',
    subtitle: 'Auditions, Commissions & Contracts',
    icon: Star,
    color: 'text-amber-400 border-amber-500/50 bg-gradient-to-br from-amber-500/20 via-yellow-950/40 to-black hover:border-amber-400',
    badgeText: (_s, p) => {
      if (p?.representation?.agent?.signed) return 'YOUR AGENT';
      const principal = p?.principalRolesCount || 0;
      const movies = p?.moviesCompleted || 0;
      return principal + movies >= 4 ? 'UNLOCKED' : `Locked ${Math.min(principal + movies, 4)}/4`;
    },
  },
  {
    id: 'PERSONAL_MANAGERS',
    title: 'Personal Managers',
    subtitle: 'Franchises, Sponsorships & Money',
    icon: UserRound,
    color: 'text-purple-400 border-purple-500/50 bg-gradient-to-br from-purple-500/20 via-purple-950/40 to-black hover:border-purple-400',
    badgeText: (_s, p) => {
      if (p?.representation?.manager?.signed) return 'YOUR MANAGER';
      const lead = p?.leadRolesCount || 0;
      const movies = p?.moviesCompleted || 0;
      const fame = p?.fameXp || 0;
      const met = lead + movies >= 8 && fame >= 3000;
      return met ? 'UNLOCKED' : `Locked ${Math.min(lead + movies, 8)}/8`;
    },
  },

  // FEATURED TOP ROW: HOLLYWOOD INSIDER
  {
    id: 'HOLLYWOOD_INSIDER',
    title: 'Hollywood Insider',
    subtitle: 'Variety & Trade Breaking News',
    icon: Newspaper,
    color: 'text-amber-300 border-amber-500/50 bg-gradient-to-br from-amber-500/20 via-red-950/40 to-black hover:border-amber-400',
    badgeText: () => {
      const state = HollywoodInsiderService.getState();
      const count = state.articles.length;
      return count > 0 ? `${count} Trade Stories` : 'LIVE';
    },
  },

  // ROW 1
  {
    id: 'PUBLIC_RELATIONS',
    title: 'Public Relations',
    subtitle: 'Press & Crisis Control',
    icon: Megaphone,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:border-amber-400',
    badgeText: (s) => (s.pr.hiredAgencyTier !== 'None' ? s.pr.hiredAgencyTier : undefined),
  },
  {
    id: 'LAW_FIRM',
    title: 'Law Firm',
    subtitle: 'Legal & Contracts',
    icon: Scale,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 hover:border-indigo-400',
    badgeText: (s) => (s.lawFirm.hiredFirmTier !== 'None' ? s.lawFirm.hiredFirmTier : undefined),
  },
  {
    id: 'BRAND_PARTNERSHIPS',
    title: 'Brand Partnerships',
    subtitle: 'Luxury Endorsements',
    icon: Handshake,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-400',
    badgeText: (s) => {
      const pending = s.brandOffers.filter((b) => b.status === 'OFFER_PENDING').length;
      return pending > 0 ? `${pending} Offers` : undefined;
    },
  },

  // ROW 2
  {
    id: 'SPONSORSHIPS',
    title: 'Sponsorships',
    subtitle: 'Major Corporate Deals',
    icon: Target,
    color: 'text-amber-300 border-amber-500/30 bg-amber-500/10 hover:border-amber-400',
    badgeText: (s) => {
      const active = s.sponsorships.filter((sp) => sp.status === 'ACTIVE').length;
      return active > 0 ? `${active} Active` : undefined;
    },
  },
  {
    id: 'MEDIA_CENTER',
    title: 'Media Center',
    subtitle: 'Trades & Press Archives',
    icon: Newspaper,
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10 hover:border-sky-400',
    badgeText: (s) => (s.mediaCenter.length > 0 ? `${s.mediaCenter.length} Items` : undefined),
  },
  {
    id: 'FAN_CLUB',
    title: 'Fan Club',
    subtitle: 'Official Fan Society',
    icon: Heart,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:border-rose-400',
    badgeText: (s) => (s.fanClub.isCreated ? `${s.fanClub.membersCount} Fans` : 'Locked'),
  },

  // ROW 3
  {
    id: 'MERCHANDISE',
    title: 'Merchandise',
    subtitle: 'Apparel & Collectibles',
    icon: ShoppingBag,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:border-purple-400',
    badgeText: (s) => (s.merchandise.length > 0 ? `${s.merchandise.length} Items` : undefined),
  },
  {
    id: 'IMAGE_REPUTATION',
    title: 'Image & Reputation',
    subtitle: '6 Reputation Pillars',
    icon: Star,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:border-amber-400',
    badgeText: (s) => `${s.reputation.publicReputation}/100`,
  },
  {
    id: 'CONTRACT_ARCHIVE',
    title: 'Contract Archive',
    subtitle: 'All Signed Agreements',
    icon: FileText,
    color: 'text-gray-300 border-white/20 bg-white/5 hover:border-white/40',
    badgeText: (s) => (s.contractsArchive.length > 0 ? `${s.contractsArchive.length} Signed` : undefined),
  },

  // ROW 4
  {
    id: 'INTERNATIONAL_REP',
    title: 'International Rep',
    subtitle: 'Global Region Agencies',
    icon: Globe,
    color: 'text-teal-400 border-teal-500/30 bg-teal-500/10 hover:border-teal-400',
    badgeText: (s) => `${s.regionalAgencies.filter((a) => a.isUnlocked).length}/6 Unlocked`,
  },
  {
    id: 'OFFICIAL_WEBSITE',
    title: 'Official Website',
    subtitle: 'Digital Web Portal',
    icon: Globe,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:border-blue-400',
    badgeText: (s) => (s.website.isLaunched ? 'Live' : 'Off-line'),
  },
  {
    id: 'MEDIA_GALLERY',
    title: 'Media Gallery',
    subtitle: 'Earned Photos & Posters',
    icon: Camera,
    color: 'text-rose-300 border-rose-500/30 bg-rose-500/10 hover:border-rose-400',
    badgeText: (s) => (s.mediaGallery.length > 0 ? `${s.mediaGallery.length} Photos` : undefined),
  },

  // ROW 5
  {
    id: 'CHARITY_CAUSES',
    title: 'Charity & Causes',
    subtitle: 'Philanthropy & Trusts',
    icon: HeartHandshake,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-400',
    badgeText: (s) => (s.charities.length > 0 ? `${s.charities.length} Causes` : undefined),
  },
];

export const RepresentationScreen: React.FC = () => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [repState, setRepState] = useState<RepresentationFullState>(() => RepresentationService.getState());
  const [selectedFeature, setSelectedFeature] = useState<RepresentationFeatureId | null>(null);

  const refreshState = () => {
    setRepState({ ...RepresentationService.getState() });
  };

  useEffect(() => {
    refreshState();
  }, [player]);

  // SUB-VIEW ROUTER
  if (selectedFeature) {
    switch (selectedFeature) {
      case 'TALENT_AGENTS':
        return <AgentsManagersView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'PERSONAL_MANAGERS':
        return <AgentsManagersView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'HOLLYWOOD_INSIDER':
        return <HollywoodInsiderView onBack={() => setSelectedFeature(null)} />;
      case 'PUBLIC_RELATIONS':
        return <PublicRelationsView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'LAW_FIRM':
        return <LawFirmView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'BRAND_PARTNERSHIPS':
        return <BrandPartnershipsView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'SPONSORSHIPS':
        return <SponsorshipsView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'MEDIA_CENTER':
        return <MediaCenterView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'FAN_CLUB':
        return <FanClubView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'MERCHANDISE':
        return <MerchandiseView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'IMAGE_REPUTATION':
        return <ImageReputationView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'CONTRACT_ARCHIVE':
        return <ContractArchiveView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'INTERNATIONAL_REP':
        return <InternationalRepView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'OFFICIAL_WEBSITE':
        return <OfficialWebsiteView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'MEDIA_GALLERY':
        return <MediaGalleryView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      case 'CHARITY_CAUSES':
        return <CharityCausesView representationState={repState} onRefresh={refreshState} onBack={() => setSelectedFeature(null)} />;
      default:
        break;
    }
  }

  return (
    <div
      className="w-full min-h-full flex flex-col p-3 sm:p-4 select-none pb-12"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header Bar */}
      <div
        className="rounded-2xl p-4 border flex items-center justify-between shadow-xl mb-5"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow">
            <Briefcase className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">REPRESENTATION</h1>
            <p className="text-xs text-amber-300 font-medium">
              Publicity, Legal, Brand Deals, & Global Image
            </p>
          </div>
        </div>
      </div>

      {/* 3 CARDS PER ROW GRID VIEW */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {REPRESENTATION_CARDS.map((card) => {
          const Icon = card.icon;
          const badge = card.badgeText ? card.badgeText(repState, player) : undefined;

          return (
            <button
              key={card.id}
              onClick={() => setSelectedFeature(card.id)}
              className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-md text-left transition-all cursor-pointer flex flex-col justify-between aspect-square group shadow-lg hover:scale-[1.03] ${card.color}`}
            >
              {/* Card Header & Badge */}
              <div className="flex items-start justify-between w-full">
                <div className="p-2 sm:p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-black/60 border border-white/10 text-[9px] sm:text-[10px] font-black tracking-tight text-white line-clamp-1">
                    {badge}
                  </span>
                )}
              </div>

              {/* Card Titles */}
              <div className="mt-2 space-y-0.5">
                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {card.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] text-gray-300 line-clamp-1 font-medium">
                  {card.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
