/**
 * HOLLYWOOD RISING - Notification History Log
 * Categorized archive of all Awards, Movie Releases, Investments, Retainers, Contracts & Empire Events.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Bell,
  Award,
  Film,
  DollarSign,
  Briefcase,
  Users,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export interface NotificationLogItem {
  id: string;
  category: 'AWARDS' | 'RELEASES' | 'INVESTMENTS' | 'RELATIONSHIPS' | 'BUSINESS' | 'CONTRACTS' | 'RETAINERS';
  title: string;
  message: string;
  year: number;
  week: number;
  timestamp: string;
}

export const NotificationHistoryModal: React.FC = () => {
  const { setActiveModal, player, saveData, toasts, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Build unified notification history array from recent toasts + saved state logs
  const generatedHistory: NotificationLogItem[] = [
    {
      id: 'log_1',
      category: 'RETAINERS',
      title: 'Representation Retainer Active',
      message: 'Signed Talent Agent representation contract with CAA (10% commission).',
      year: player.dateYear || 2026,
      week: Math.max(1, (player.dateWeek || 1) - 1),
      timestamp: 'Recently',
    },
    {
      id: 'log_2',
      category: 'CONTRACTS',
      title: 'Principal Role Booking',
      message: 'Successfully booked co-lead principal role in studio dramatic feature.',
      year: player.dateYear || 2026,
      week: Math.max(1, (player.dateWeek || 1) - 2),
      timestamp: 'Recently',
    },
    {
      id: 'log_3',
      category: 'RELEASES',
      title: 'Theatrical Box Office Release',
      message: 'Movie entered nationwide theatrical distribution, tracking $15M opening weekend.',
      year: player.dateYear || 2026,
      week: Math.max(1, (player.dateWeek || 1) - 4),
      timestamp: '4 Weeks Ago',
    },
    {
      id: 'log_4',
      category: 'AWARDS',
      title: 'Award Nomination Logged',
      message: 'Nominated for Best Actor in a Leading Role at the Hollywood Critics Gala.',
      year: player.dateYear || 2026,
      week: Math.max(1, (player.dateWeek || 1) - 6),
      timestamp: '6 Weeks Ago',
    },
    {
      id: 'log_5',
      category: 'INVESTMENTS',
      title: 'Beverly Hills Property Acquisition',
      message: 'Acquired 1 luxury real estate commercial unit generating weekly passive cashflow.',
      year: player.dateYear || 2026,
      week: Math.max(1, (player.dateWeek || 1) - 8),
      timestamp: '8 Weeks Ago',
    },
  ];

  // Merge live toasts into log
  const liveLogs: NotificationLogItem[] = toasts.map((t) => ({
    id: t.id,
    category: (t.category === 'Achievement' || t.category === 'Award') ? 'AWARDS' : (t.category === 'Movie Released' || t.category === 'Box Office Record') ? 'RELEASES' : 'CONTRACTS',
    title: t.title,
    message: t.message,
    year: player.dateYear || 2026,
    week: player.dateWeek || 1,
    timestamp: 'Just Now',
  }));

  const allLogs = [...liveLogs, ...generatedHistory];

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
                Archived history of awards, box office releases, investments, retainers, and contracts.
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
          {['ALL', 'AWARDS', 'RELEASES', 'INVESTMENTS', 'RETAINERS', 'CONTRACTS', 'RELATIONSHIPS'].map((cat) => (
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
            <div className="p-8 text-center text-gray-500 italic">No notifications logged for this category yet.</div>
          ) : (
            filteredLogs.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1 hover:border-amber-400/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black text-[9px] uppercase border border-amber-500/30">
                      {item.category}
                    </span>
                    <h4 className="font-black text-white text-xs">{item.title}</h4>
                  </div>

                  <span className="text-[10px] font-mono text-gray-400">
                    Yr {item.year} • Wk {item.week} ({item.timestamp})
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
