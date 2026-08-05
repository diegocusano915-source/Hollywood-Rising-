/**
 * HOLLYWOOD RISING - Trophy Room Modal (Phase 6)
 * Dedicated trophy showcase for all 9 major award categories:
 * Academy Awards, Golden Globes, BAFTA, SAG Awards, Emmys, Critics Choice, Independent Spirit, Festival Awards, Lifetime Achievement.
 * Displays locked vs unlocked state, Year, Movie, Category, Speech, Photo, Studio, and Director.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trophy,
  Award,
  Sparkles,
  Crown,
  Lock,
  CheckCircle2,
  Calendar,
  Building2,
  Clapperboard,
  Film,
  Quote,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { TrophyItem } from '../../types/game';
import { THEMES } from '../../theme/colors';

interface AwardCategoryMeta {
  type: TrophyItem['awardType'];
  title: string;
  organizer: string;
  color: string;
  iconBg: string;
  borderColor: string;
  requirementText: string;
}

const CATEGORIES: AwardCategoryMeta[] = [
  {
    type: 'Academy Award',
    title: 'Academy Awards (Oscars)',
    organizer: 'Academy of Motion Picture Arts and Sciences',
    color: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    borderColor: 'border-amber-400/50',
    requirementText: 'Win Best Actor or Supporting Actor in a Feature Film at the Oscars (Week 10).',
  },
  {
    type: 'Golden Globe',
    title: 'Golden Globe Awards',
    organizer: 'Hollywood Foreign Press Association',
    color: 'text-amber-300',
    iconBg: 'bg-amber-400/20',
    borderColor: 'border-amber-300/40',
    requirementText: 'Win a Golden Globe for Drama or Comedy Performance (Week 2).',
  },
  {
    type: 'BAFTA',
    title: 'BAFTA Film Awards',
    organizer: 'British Academy of Film and Television Arts',
    color: 'text-yellow-200',
    iconBg: 'bg-yellow-500/20',
    borderColor: 'border-yellow-300/40',
    requirementText: 'Win a BAFTA Award in London for Lead or Supporting Performance (Week 8).',
  },
  {
    type: 'SAG Award',
    title: 'SAG Awards',
    organizer: 'Screen Actors Guild - AFTRA',
    color: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    borderColor: 'border-emerald-400/40',
    requirementText: 'Win Outstanding Actor in a Leading or Supporting Role (Week 6).',
  },
  {
    type: 'Emmy',
    title: 'Primetime Emmy Awards',
    organizer: 'Academy of Television Arts & Sciences',
    color: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    borderColor: 'border-purple-400/40',
    requirementText: 'Win Outstanding Actor in a Drama, Comedy, or Limited Series.',
  },
  {
    type: 'Critics Choice',
    title: 'Critics Choice Awards',
    organizer: 'Critics Choice Association',
    color: 'text-sky-400',
    iconBg: 'bg-sky-500/20',
    borderColor: 'border-sky-400/40',
    requirementText: 'Win Best Actor at the Critics Choice Movie Awards.',
  },
  {
    type: 'Independent Spirit',
    title: 'Independent Spirit Awards',
    organizer: 'Film Independent',
    color: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
    borderColor: 'border-rose-400/40',
    requirementText: 'Win Best Lead Performance in an Indie Film (Week 9).',
  },
  {
    type: 'Festival Award',
    title: 'Cannes & Venice Festival Awards',
    organizer: 'International Film Festival Board',
    color: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20',
    borderColor: 'border-indigo-400/40',
    requirementText: 'Win Best Actor or Palme d\'Or at Cannes or Venice Film Festival.',
  },
  {
    type: 'Lifetime Achievement',
    title: 'Academy Lifetime Achievement',
    organizer: 'Academy Board of Governors',
    color: 'text-amber-500',
    iconBg: 'bg-amber-600/20',
    borderColor: 'border-amber-500/50',
    requirementText: 'Reach Living Legend Fame Level (12,000+ Fame XP) and 10+ Completed Lead Movies.',
  },
];

export const TrophyRoomModal: React.FC = () => {
  const { setActiveModal, trophies = [], player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [selectedCategory, setSelectedCategory] = useState<TrophyItem['awardType']>('Academy Award');
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyItem | null>(null);

  const activeMeta = CATEGORIES.find((c) => c.type === selectedCategory) || CATEGORIES[0];
  const unlockedForCategory = trophies.filter((t) => t.awardType === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl"
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
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Trophy className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                Hollywood Trophy Room
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs border border-amber-400/40">
                  {trophies.length} Trophies Unlocked
                </span>
              </h2>
              <p className="text-xs text-gray-400">Official Career Awards Showcase & Acceptance Archive</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* Left Award Categories Sidebar */}
          <div className="w-full md:w-80 shrink-0 space-y-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 mb-3">
              Award Bodies ({CATEGORIES.length})
            </h3>

            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const count = trophies.filter((t) => t.awardType === cat.type).length;
                const isSelected = selectedCategory === cat.type;

                return (
                  <button
                    key={cat.type}
                    onClick={() => {
                      setSelectedCategory(cat.type);
                      setSelectedTrophy(null);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg'
                        : 'bg-black/40 border-white/5 text-gray-400 hover:text-white hover:bg-black/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${cat.iconBg} ${cat.color}`}>
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight text-white">{cat.title}</h4>
                        <p className="text-[10px] text-gray-400">{cat.organizer}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {count > 0 ? (
                        <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                          {count}
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-600" />
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Trophy Showcase Container */}
          <div className="flex-1 space-y-5">
            {/* Category Hero Banner */}
            <div className={`p-5 rounded-2xl border ${activeMeta.borderColor} bg-black/50 backdrop-blur-md relative overflow-hidden`}>
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${activeMeta.iconBg} ${activeMeta.color}`}>
                    {activeMeta.organizer}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-1">{activeMeta.title}</h3>
                  <p className="text-xs text-gray-300 mt-1 max-w-xl">{activeMeta.requirementText}</p>
                </div>

                <div className="hidden sm:flex shrink-0 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-300">
                  <Trophy className="w-10 h-10" />
                </div>
              </div>
            </div>

            {/* Unlocked Trophies Grid or Locked State */}
            {unlockedForCategory.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Unlocked Statuettes ({unlockedForCategory.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {unlockedForCategory.map((trophy) => (
                    <div
                      key={trophy.id}
                      onClick={() => setSelectedTrophy(trophy)}
                      className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-black border-2 border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group shadow-xl flex gap-4 items-center"
                    >
                      {/* Photo or Poster */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden border border-amber-400/50 bg-gray-900 shrink-0 shadow">
                        <img
                          src={trophy.photoUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80'}
                          alt={trophy.movieTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Meta */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                          Year {trophy.year} Winner
                        </span>
                        <h5 className="text-sm font-black text-white truncate">{trophy.movieTitle}</h5>
                        <p className="text-[11px] text-amber-200/80 truncate font-semibold">{trophy.category}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clapperboard className="w-3 h-3 text-amber-400" />
                          {trophy.studio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Locked Category Display */
              <div className="p-8 rounded-3xl bg-black/40 border-2 border-dashed border-white/10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-300">No {activeMeta.title} Unlocked Yet</h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                    Keep starring in high-quality feature films, launch FYC award campaigns, and build director trust to win this trophy.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
