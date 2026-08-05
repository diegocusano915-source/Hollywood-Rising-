/**
 * HOLLYWOOD RISING - Redesigned Hollywood Inbox Modal
 * Premium 10-Tab Categorized Messaging Center
 * All, Career, Business, Social, Media, Finance, Legal, Awards, Personal, System
 * Features: Unread counters, Search, Mark Read/All Read, Delete, Archive, Rich Feedback Viewer
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
  Filter,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-5xl h-[92vh] max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl relative"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header Bar */}
        <div
          className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <Mail className="w-6 h-6" style={{ color: theme.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-wider">
                  Hollywood Inbox
                </h2>
                {unreadCounts.ALL > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-xs font-black shadow">
                    {unreadCounts.ALL} NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                Connected Hollywood updates, casting decisions, legal notices, and media alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mark All Read */}
            <button
              onClick={() => markAllMessagesRead(activeTab)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Mark All Read"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Mark All Read</span>
            </button>

            {/* Archive Filter Toggle */}
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                showArchived
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span className="hidden md:inline">{showArchived ? 'Showing Archived' : 'Archive'}</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={() => setActiveModal('none')}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 bg-black/40 border-b border-white/10 shrink-0 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sender, movie title, subject, or keywords..."
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
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

        {/* Premium Tab Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 bg-black/60 border-b border-white/10 no-scrollbar shrink-0">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const count = unreadCounts[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-lg font-extrabold'
                    : 'bg-black/40 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                      isActive ? 'bg-black text-amber-400' : 'bg-amber-400 text-black'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Inbox className="w-16 h-16 mx-auto text-gray-600 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold text-gray-300">
                {searchQuery
                  ? 'No Messages Found'
                  : showArchived
                  ? 'No Archived Messages'
                  : 'No Updates in This Category'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                {searchQuery
                  ? `No messages matched "${searchQuery}". Try a different search keyword.`
                  : 'Notifications arrive after actual gameplay events occur (e.g. Callboard decisions, course graduations, business earnings).'}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isUnread = !msg.read;
              const badgeStyle = getCategoryBadgeStyle(msg.category);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleSelectMessage(msg)}
                  className={`group rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 transition-all bg-black/40 hover:bg-black/60 shadow-lg cursor-pointer relative overflow-hidden ${
                    isUnread
                      ? 'border-amber-400/80 bg-amber-950/20 shadow-[0_0_25px_rgba(251,191,36,0.1)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Unread Accent Bar */}
                  {isUnread && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-400" />}

                  {/* Sender Avatar */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-gray-900 border border-white/20 shrink-0 shadow-md relative">
                    <img src={msg.senderAvatar} alt={msg.sender} className="w-full h-full object-cover" />
                    {isUnread && (
                      <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-black animate-ping" />
                    )}
                  </div>

                  {/* Message Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-black text-white truncate">{msg.sender}</h3>
                          <span className="text-[11px] text-gray-400 font-medium truncate">({msg.senderRole})</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5 truncate">{msg.subject}</h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${badgeStyle}`}
                        >
                          {getEffectiveCategory(msg.category)}
                        </span>
                        <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-lg border border-white/5">
                          <Calendar className="w-3 h-3" />
                          {msg.date}
                        </span>
                      </div>
                    </div>

                    {/* Preview Snippet */}
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                      {msg.body.replace(/\n+/g, ' ')}
                    </p>
                  </div>

                  {/* Quick Action Overlay Buttons */}
                  <div
                    className="flex sm:flex-col items-center justify-end gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Read / Unread toggle */}
                    <button
                      onClick={() => markMessageRead(msg.id)}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer"
                      title={msg.read ? 'Mark Unread' : 'Mark Read'}
                    >
                      <Check className={`w-4 h-4 ${msg.read ? 'text-gray-500' : 'text-amber-400'}`} />
                    </button>

                    {/* Archive toggle */}
                    <button
                      onClick={() => archiveMessage(msg.id)}
                      className={`p-2 rounded-xl bg-black/60 border border-white/10 transition-colors cursor-pointer ${
                        msg.archived ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                      }`}
                      title={msg.archived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Message Reader Modal / Popup */}
      <AnimatePresence>
        {selectedMsg && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-[#0F111D] border border-amber-400/40 rounded-3xl p-5 sm:p-7 text-white flex flex-col max-h-[90vh] shadow-[0_0_80px_rgba(251,191,36,0.15)] relative overflow-hidden"
            >
              {/* Modal Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Reader Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10 relative z-10 gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedMsg.senderAvatar}
                    alt={selectedMsg.sender}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
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
                    <h3 className="text-base sm:text-lg font-black text-white mt-0.5">{selectedMsg.sender}</h3>
                    <p className="text-xs text-gray-400">{selectedMsg.senderRole}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMsg(null)}
                  className="p-2 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subject */}
              <div className="py-3 border-b border-white/10 relative z-10">
                <h2 className="text-base sm:text-xl font-black text-amber-300 leading-tight">
                  {selectedMsg.subject}
                </h2>
              </div>

              {/* Formatted Message Body */}
              <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-line relative z-10 pr-1">
                <div className="bg-black/50 p-4 sm:p-5 rounded-2xl border border-white/10 font-mono text-xs sm:text-sm leading-relaxed text-gray-200">
                  {selectedMsg.body}
                </div>
              </div>

              {/* Reader Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      archiveMessage(selectedMsg.id);
                      setSelectedMsg({ ...selectedMsg, archived: !selectedMsg.archived });
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedMsg.archived
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-black/50 border-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Archive className="w-4 h-4" />
                    <span>{selectedMsg.archived ? 'Archived' : 'Archive'}</span>
                  </button>

                  <button
                    onClick={() => {
                      deleteMessage(selectedMsg.id);
                      setSelectedMsg(null);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-black/50 border border-white/10 text-rose-400 hover:text-rose-300 hover:border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedMsg(null)}
                  className="px-5 py-2 rounded-xl font-black text-xs bg-amber-400 text-black hover:bg-amber-300 transition-all cursor-pointer shadow-lg"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
