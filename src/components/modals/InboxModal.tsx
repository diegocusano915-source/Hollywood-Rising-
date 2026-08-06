/**
 * HOLLYWOOD RISING - Redesigned Hollywood Inbox Screen
 * Full-width & full-height optimized layout designed specifically for Android mobile devices.
 * 10-Tab Categorized Messaging Center (All, Career, Business, Social, Media, Finance, Legal, Awards, Personal, System)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Check,
  CheckCheck,
  Trash2,
  Archive,
  Search,
  Inbox,
  Calendar,
  Sparkles,
  Clapperboard,
  Briefcase,
  Users,
  Tv,
  DollarSign,
  Scale,
  Trophy,
  Heart,
  Info,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { InboxCategory, InboxMessage } from '../../types/game';
import { THEMES } from '../../theme/colors';

type TabType =
  | 'ALL'
  | 'CAREER'
  | 'BUSINESS'
  | 'SOCIAL'
  | 'MEDIA'
  | 'FINANCE'
  | 'LEGAL'
  | 'AWARDS'
  | 'PERSONAL'
  | 'SYSTEM';

const TABS: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'ALL', label: 'All', icon: Mail },
  { id: 'CAREER', label: 'Career', icon: Clapperboard },
  { id: 'BUSINESS', label: 'Business', icon: Briefcase },
  { id: 'SOCIAL', label: 'Social', icon: Users },
  { id: 'MEDIA', label: 'Media', icon: Tv },
  { id: 'FINANCE', label: 'Finance', icon: DollarSign },
  { id: 'LEGAL', label: 'Legal', icon: Scale },
  { id: 'AWARDS', label: 'Awards', icon: Trophy },
  { id: 'PERSONAL', label: 'Personal', icon: Heart },
  { id: 'SYSTEM', label: 'System', icon: Info },
];

export const InboxModal: React.FC = () => {
  const {
    setActiveModal,
    inbox,
    markMessageRead,
    markAllMessagesRead,
    deleteMessage,
    archiveMessage,
    settings,
  } = useGame();

  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<InboxMessage | null>(null);

  // Map legacy categories to modern tabs
  const getEffectiveCategory = (cat: InboxCategory): TabType => {
    switch (cat) {
      case 'CASTING':
        return 'CAREER';
      case 'RELATIONSHIPS':
        return 'SOCIAL';
      case 'TUTORIAL':
        return 'SYSTEM';
      case 'CAREER':
      case 'BUSINESS':
      case 'SOCIAL':
      case 'MEDIA':
      case 'FINANCE':
      case 'LEGAL':
      case 'AWARDS':
      case 'PERSONAL':
      case 'SYSTEM':
        return cat;
      default:
        return 'SYSTEM';
    }
  };

  // Badge Color Mapper
  const getCategoryBadgeStyle = (cat: InboxCategory) => {
    const effective = getEffectiveCategory(cat);
    switch (effective) {
      case 'CAREER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'BUSINESS':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'SOCIAL':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      case 'MEDIA':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'FINANCE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'LEGAL':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'AWARDS':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'PERSONAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'SYSTEM':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  // Compute unread counts per tab
  const unreadCounts = useMemo(() => {
    const counts: Record<TabType, number> = {
      ALL: 0,
      CAREER: 0,
      BUSINESS: 0,
      SOCIAL: 0,
      MEDIA: 0,
      FINANCE: 0,
      LEGAL: 0,
      AWARDS: 0,
      PERSONAL: 0,
      SYSTEM: 0,
    };

    inbox.forEach((msg) => {
      if (!msg.read && !msg.archived) {
        counts.ALL += 1;
        const eff = getEffectiveCategory(msg.category);
        counts[eff] = (counts[eff] || 0) + 1;
      }
    });

    return counts;
  }, [inbox]);

  // Filter messages based on Active Tab, Search Query, and Archive state
  const filteredMessages = useMemo(() => {
    return inbox.filter((msg) => {
      // Archive filter
      if (showArchived && !msg.archived) return false;
      if (!showArchived && msg.archived) return false;

      // Category filter
      if (activeTab !== 'ALL') {
        const eff = getEffectiveCategory(msg.category);
        if (eff !== activeTab) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSubject = msg.subject.toLowerCase().includes(query);
        const matchesSender = msg.sender.toLowerCase().includes(query);
        const matchesRole = msg.senderRole.toLowerCase().includes(query);
        const matchesBody = msg.body.toLowerCase().includes(query);
        if (!matchesSubject && !matchesSender && !matchesRole && !matchesBody) {
          return false;
        }
      }

      return true;
    });
  }, [inbox, activeTab, searchQuery, showArchived]);

  const handleSelectMessage = (msg: InboxMessage) => {
    if (!msg.read) {
      markMessageRead(msg.id);
    }
    setSelectedMsg(msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070712] text-white select-none overflow-hidden">
      {/* Top Header Bar */}
      <div
        className="px-4 py-3.5 flex items-center justify-between border-b shrink-0 shadow-lg"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wider">
                Hollywood Inbox
              </h2>
              {unreadCounts.ALL > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black shadow">
                  {unreadCounts.ALL} NEW
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-300/80 font-medium">
              Casting decisions, contracts, PR alerts & notices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mark All Read */}
          <button
            onClick={() => markAllMessagesRead(activeTab)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-gray-200 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Mark All Read"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Mark Read</span>
          </button>

          {/* Archive Toggle */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              showArchived
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/10 border-white/10 text-gray-200 hover:text-white'
            }`}
            title={showArchived ? 'View Inbox' : 'View Archive'}
          >
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">{showArchived ? 'Archived' : 'Archive'}</span>
          </button>

          {/* Close */}
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="px-4 py-2.5 bg-black/40 border-b border-white/10 shrink-0">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by sender, movie, or subject..."
            className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-8 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tab Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 bg-black/60 border-b border-white/10 no-scrollbar shrink-0">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const count = unreadCounts[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    isActive ? 'bg-black text-amber-300' : 'bg-amber-400 text-black'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Message Cards List - Full Screen Scroll Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 pb-24">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500 space-y-3">
            <div className="p-4 rounded-3xl bg-black/40 border border-white/10">
              <Inbox className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-base font-black text-white">No Messages Found</h3>
            <p className="text-xs text-gray-400 max-w-xs">
              {showArchived
                ? 'No archived messages found in this folder.'
                : 'Your inbox is clear. New casting callbacks and contract offers will appear here.'}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isUnread = !msg.read && !msg.archived;
            const badgeStyle = getCategoryBadgeStyle(msg.category);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleSelectMessage(msg)}
                className={`rounded-2xl border p-4 transition-all bg-black/40 hover:bg-black/60 shadow-lg cursor-pointer relative overflow-hidden flex flex-col gap-2.5 ${
                  isUnread
                    ? 'border-amber-400/80 bg-amber-950/20 shadow-[0_0_25px_rgba(251,191,36,0.1)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Unread Accent Bar */}
                {isUnread && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-400" />}

                <div className="flex items-start gap-3">
                  {/* Sender Avatar */}
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-900 border border-white/20 shrink-0 shadow-md relative">
                    <img src={msg.senderAvatar} alt={msg.sender} className="w-full h-full object-cover" />
                    {isUnread && (
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-black animate-ping" />
                    )}
                  </div>

                  {/* Sender Info & Date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-black text-white truncate">{msg.sender}</h3>
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-lg border border-white/5 shrink-0">
                        <Calendar className="w-3 h-3" />
                        {msg.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">{msg.senderRole}</p>
                    <h4 className="text-xs font-black text-amber-300 mt-1 truncate">{msg.subject}</h4>
                  </div>
                </div>

                {/* Body Snippet */}
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                  {msg.body.replace(/\n+/g, ' ')}
                </p>

                {/* Card Action Controls */}
                <div
                  className="flex items-center justify-between pt-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${badgeStyle}`}
                  >
                    {getEffectiveCategory(msg.category)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markMessageRead(msg.id)}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                      title={msg.read ? 'Mark Unread' : 'Mark Read'}
                    >
                      <Check className={`w-3.5 h-3.5 ${msg.read ? 'text-gray-500' : 'text-amber-400'}`} />
                    </button>

                    <button
                      onClick={() => archiveMessage(msg.id)}
                      className={`p-2 rounded-xl bg-black/60 border border-white/10 transition-colors cursor-pointer ${
                        msg.archived ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                      }`}
                      title={msg.archived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Message Reader Modal */}
      <AnimatePresence>
        {selectedMsg && (
          <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col select-none overflow-hidden">
            {/* Reader Header */}
            <div className="px-4 py-3.5 border-b border-white/10 bg-[#0C0D18] flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setSelectedMsg(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    archiveMessage(selectedMsg.id);
                    setSelectedMsg({ ...selectedMsg, archived: !selectedMsg.archived });
                  }}
                  className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedMsg.archived
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-black/50 border-white/10 text-gray-300'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  <span className="hidden sm:inline">{selectedMsg.archived ? 'Archived' : 'Archive'}</span>
                </button>

                <button
                  onClick={() => {
                    deleteMessage(selectedMsg.id);
                    setSelectedMsg(null);
                  }}
                  className="p-2 rounded-xl bg-black/50 border border-white/10 text-rose-400 hover:text-rose-300 hover:border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            {/* Message Details */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 pb-20">
              <div className="flex items-center gap-3.5 pb-3 border-b border-white/10">
                <img
                  src={selectedMsg.senderAvatar}
                  alt={selectedMsg.sender}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/20 shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getCategoryBadgeStyle(
                        selectedMsg.category
                      )}`}
                    >
                      {getEffectiveCategory(selectedMsg.category)}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">{selectedMsg.date}</span>
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5">{selectedMsg.sender}</h3>
                  <p className="text-xs text-gray-400">{selectedMsg.senderRole}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-amber-300 leading-snug">
                  {selectedMsg.subject}
                </h2>
              </div>

              <div className="bg-black/60 p-4 sm:p-5 rounded-2xl border border-white/10 text-xs sm:text-sm leading-relaxed text-gray-200 font-sans whitespace-pre-line shadow-inner">
                {selectedMsg.body}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
