/**
 * HOLLYWOOD RISING - Career Timeline Modal (Phase 6)
 * Chronological timeline tracking major milestones: Booked Roles, Wraps, Releases, Awards, Empire, Relationships.
 */

import React from 'react';
import {
  X,
  Clock,
  Clapperboard,
  Trophy,
  Building2,
  Heart,
  Star,
  Film,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { TimelineEvent } from '../../types/game';
import { THEMES } from '../../theme/colors';

export const CareerTimelineModal: React.FC = () => {
  const { setActiveModal, careerTimeline = [], player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const getCategoryBadge = (cat: TimelineEvent['category']) => {
    switch (cat) {
      case 'AWARD':
        return { icon: <Trophy className="w-4 h-4 text-amber-300" />, bg: 'bg-amber-500/20 border-amber-400/40 text-amber-300' };
      case 'RELEASE':
        return { icon: <Film className="w-4 h-4 text-emerald-300" />, bg: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' };
      case 'ROLE':
        return { icon: <Clapperboard className="w-4 h-4 text-purple-300" />, bg: 'bg-purple-500/20 border-purple-400/40 text-purple-300' };
      case 'EMPIRE':
        return { icon: <Building2 className="w-4 h-4 text-sky-300" />, bg: 'bg-sky-500/20 border-sky-400/40 text-sky-300' };
      case 'RELATIONSHIP':
        return { icon: <Heart className="w-4 h-4 text-rose-300" />, bg: 'bg-rose-500/20 border-rose-400/40 text-rose-300' };
      default:
        return { icon: <Sparkles className="w-4 h-4 text-gray-300" />, bg: 'bg-gray-500/20 border-gray-400/40 text-gray-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl"
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
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                Official Career Timeline
              </h2>
              <p className="text-xs text-gray-400">Chronological Record of Milestones & Breakthroughs</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-8 overflow-y-auto space-y-6 flex-1">
          {careerTimeline.length > 0 ? (
            <div className="relative border-l-2 border-purple-500/30 ml-4 pl-6 space-y-6">
              {careerTimeline.map((item) => {
                const badge = getCategoryBadge(item.category);

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-black border-2 border-purple-400 flex items-center justify-center text-xs">
                      {badge.icon}
                    </div>

                    <div className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-purple-400/40 transition-all shadow-lg space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                          {item.category}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          Week {item.week}, Year {item.year}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white pt-1">{item.title}</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 space-y-3">
              <Clock className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-base font-bold text-gray-300">No Career Timeline Events Recorded Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Audition for roles, release movies, win awards, and build your Hollywood legacy to populate your timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
