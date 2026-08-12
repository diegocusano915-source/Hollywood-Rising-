/**
 * HOLLYWOOD RISING - Notification History Log (REAL EVENTS ONLY)
 * Archival log built entirely from the player's actual game history:
 * career timeline, released movies, award records, bookings, signed
 * representation and empire holdings. Nothing is static or invented.
 */

import React, { useMemo, useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Bell,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export interface NotificationLogItem {
  id: string;
  category: 'AWARDS' | 'RELEASES' | 'CONTRACTS' | 'RELATIONSHIPS' | 'BUSINESS' | 'RETAINERS';
  icon: string;
  title: string;
  message: string;
  year: number;
  week: number;
}

const ICONS: Record<NotificationLogItem['category'], string> = {
  AWARDS: '🏆',
  RELEASES: '🎥',
  CONTRACTS: '📝',
  RELATIONSHIPS: '💞',
  BUSINESS: '🏢',
  RETAINERS: '🤝',
};

export const NotificationHistoryModal: React.FC = () => {
  const { setActiveModal, player, saveData, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // ============ BUILD THE LOG FROM REAL GAME HISTORY ONLY ============
  const allLogs: NotificationLogItem[] = useMemo(() => {
    const logs: NotificationLogItem[] = [];
    const p = player;
    const year = p.dateYear || 2026;
    const week = p.dateWeek || 1;

    // 1. REAL CAREER TIMELINE (persisted events with real week/year)
    (saveData.careerTimeline || []).forEach((ev) => {
      const map: Record<string, NotificationLogItem['category']> = {
        ROLE: 'CONTRACTS',
        RELEASE: 'RELEASES',
        AWARD: 'AWARDS',
        EMPIRE: 'BUSINESS',
        RELATIONSHIP: 'RELATIONSHIPS',
        MILESTONE: 'BUSINESS',
      };
      logs.push({
        id: `tl_${ev.id}`,
        category: map[ev.category] || 'BUSINESS',
        icon: ev.iconType === 'award' ? '🏆' : ev.iconType === 'movie' ? '🎥' : ICONS[map[ev.category] || 'BUSINESS'],
        title: ev.title,
        message: ev.description,
        year: ev.year || year,
        week: ev.week || 1,
      });
    });

    // 2. REAL MOVIE RELEASES (box office records)
    (saveData.releasedMovies || []).forEach((m) => {
      logs.push({
        id: `rel_${m.id}`,
        category: 'RELEASES',
        icon: m.isTvSeries ? '📺' : '🎥',
        title: m.isTvSeries ? `"${m.movieTitle}" — TV series ${m.tvSeason ? `S${m.tvSeason} ` : ''}release` : `"${m.movieTitle}" theatrical release`,
        message: `Lifetime ${m.isTvSeries ? 'viewership' : 'gross'}: $${(m.worldwideGross || m.boxOfficeGross || 0).toLocaleString()} · Critics ${Math.round(m.criticRating || m.criticScore || 0)}% · Audience ${Math.round(m.audienceRating || m.audienceScore || 0)}%${m.isSequel ? ` · Sequel Part ${m.franchisePart || ''}` : ''}`,
        year: m.releaseYear || year,
        week: m.releaseWeek || 1,
      });
    });

    // 3. REAL AWARD RECORDS
    (saveData.awardHistory || []).forEach((a) => {
      logs.push({
        id: `aw_${a.id}`,
        category: 'AWARDS',
        icon: a.isPlayerWinner ? '🏆' : '⭐',
        title: a.isPlayerWinner ? `WON ${a.eventName} — ${a.category}` : `Nominated: ${a.eventName} — ${a.category}`,
        message: a.movieTitle
          ? `${a.category} for "${a.movieTitle}"${a.isPlayerWinner ? ' — the trophy is yours.' : ' — no win this time.'}`
          : a.winnerTitle,
        year: a.year || year,
        week: 52,
      });
    });

    // 4. REAL BOOKED CONTRACTS (current + in production)
    (saveData.bookedProjects || []).forEach((b) => {
      logs.push({
        id: `bk_${b.id}`,
        category: 'CONTRACTS',
        icon: '📝',
        title: `${b.roleType} role — "${b.movieTitle}"`,
        message: `Salary $${(b.salary || 0).toLocaleString()} · ${b.totalFilmingWeeks || 0}-week shoot · ${b.isFilmingComplete ? 'Filming complete' : `Filming ${b.productionWeeksCompleted ?? 0}/${b.totalFilmingWeeks || 0} weeks`}${b.status ? ` · ${b.status}` : ''}`,
        year: year,
        week: week,
      });
    });

    // 5. REAL SIGNED REPRESENTATION (only if actually signed)
    const agent = p.representation?.agent;
    const manager = p.representation?.manager;
    if (agent && agent.signed) {
      logs.push({
        id: `ag_${agent.id}`,
        category: 'RETAINERS',
        icon: '🤝',
        title: `Talent agent — ${agent.agencyName}`,
        message: `${agent.name} (${agent.tierName || 'Agent'}) · ${agent.commissionPercent}% commission · ${agent.contractLengthWeeks || 0}-week contract${agent.weeksRemaining !== undefined ? ` · ${agent.weeksRemaining} weeks left` : ''} · Signed ${agent.signedWeek ? `Week ${agent.signedWeek}, ${agent.signedYear || year}` : ''}`,
        year: agent.signedYear || year,
        week: agent.signedWeek || 1,
      });
    }
    if (manager && manager.signed) {
      logs.push({
        id: `mg_${manager.id}`,
        category: 'RETAINERS',
        icon: '🎩',
        title: `Manager — ${manager.company}`,
        message: `${manager.name} (${manager.tierName || 'Manager'}) · ${manager.commissionPercent}% commission · ${manager.contractLengthWeeks || 0}-week contract${manager.weeksRemaining !== undefined ? ` · ${manager.weeksRemaining} weeks left` : ''} · Signed ${manager.signedWeek ? `Week ${manager.signedWeek}, ${manager.signedYear || year}` : ''}`,
        year: manager.signedYear || year,
        week: manager.signedWeek || 1,
      });
    }

    // 6. REAL EMPIRE HOLDINGS (only what the player actually owns)
    const empire = p.empire;
    if (empire) {
      if (empire.realEstateUnits > 0) {
        logs.push({
          id: 'emp_re',
          category: 'BUSINESS',
          icon: '🏢',
          title: 'Real estate holdings',
          message: `${empire.realEstateUnits} unit${empire.realEstateUnits === 1 ? '' : 's'} owned · generating weekly income through your empire.`,
          year: year,
          week: week,
        });
      }
      if (empire.indieStudioOwned && empire.studioName) {
        logs.push({
          id: 'emp_studio',
          category: 'BUSINESS',
          icon: '🎬',
          title: `Indie studio — ${empire.studioName}`,
          message: 'Your independent studio is active in your empire portfolio.',
          year: year,
          week: week,
        });
      }
      if (empire.weeklyBusinessIncome > 0) {
        logs.push({
          id: 'emp_inc',
          category: 'BUSINESS',
          icon: '💼',
          title: 'Business ventures income',
          message: `Active ventures generating $${empire.weeklyBusinessIncome.toLocaleString()}/week in real income.`,
          year: year,
          week: week,
        });
      }
    }

    // 7. REAL MISSED ALERTS (while-you-were-away digest, only if it exists)
    (saveData.notificationCenter?.digest || []).forEach((d) => {
      logs.push({
        id: `dig_${d.id}`,
        category: 'CONTRACTS',
        icon: d.icon || '📬',
        title: d.title,
        message: d.body,
        year: year,
        week: d.refWeek || week,
      });
    });

    // Sort by real time: newest first (year, then week)
    return logs.sort((a, b) => (b.year - a.year) || (b.week - a.week));
  }, [saveData, player]);

  const filteredLogs = activeCategory === 'ALL'
    ? allLogs
    : allLogs.filter((l) => l.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-2xl rounded-3xl flex flex-col overflow-hidden border shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3 text-amber-400">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">NOTIFICATION HISTORY & AUDIT LOG</h2>
              <p className="text-[11px] text-amber-300 font-medium">
                Real history only — timeline, releases, awards, contracts, retainers & empire.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="p-3 bg-black/40 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {['ALL', 'AWARDS', 'RELEASES', 'CONTRACTS', 'RELATIONSHIPS', 'BUSINESS', 'RETAINERS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Log Feed */}
        <div className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              {activeCategory === 'ALL'
                ? 'No history yet — book roles, release movies, win awards and your real log will build itself.'
                : `Nothing recorded for ${activeCategory} yet — this category fills up as you actually do things.`}
            </div>
          ) : (
            filteredLogs.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1 hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black text-[9px] uppercase border border-amber-500/30">
                      {item.category}
                    </span>
                    <h4 className="font-black text-white text-xs">{item.title}</h4>
                  </div>

                  <span className="text-[10px] font-mono text-gray-400">
                    Yr {item.year} • Wk {item.week}
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 leading-snug">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
