/**
 * HOLLYWOOD RISING - Inbox Modal (Redesigned Phase 1 Update)
 * Large UI cards, spacious text layout, clear sender avatars, category badges & dates.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Mail, Check, Inbox, Tag, Calendar, User } from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const InboxModal: React.FC = () => {
  const { setActiveModal, inbox, markMessageRead, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'CASTING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'RELATIONSHIPS':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      case 'FINANCE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'TUTORIAL':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 md:p-6 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Mail className="w-6 h-6" style={{ color: theme.primary }} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Hollywood Inbox</h2>
              <p className="text-xs text-gray-400">Casting notifications, contracts, and personal messages</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 flex-1">
          {inbox.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Inbox className="w-16 h-16 mx-auto text-gray-600 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-300">Your Inbox is Empty</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                No notifications or studio messages yet. Apply for roles on the Callboard to receive casting decisions.
              </p>
            </div>
          ) : (
            inbox.map((msg) => (
              <div
                key={msg.id}
                onClick={() => !msg.read && markMessageRead(msg.id)}
                className={`rounded-2xl border-2 p-5 md:p-6 flex flex-col sm:flex-row gap-5 transition-all bg-black/40 shadow-xl cursor-pointer ${
                  !msg.read ? 'border-amber-400/80 bg-amber-950/20' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Avatar / Poster Thumbnail */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-900 border-2 border-white/20 shrink-0 shadow-lg relative">
                  <img src={msg.senderAvatar} alt={msg.sender} className="w-full h-full object-cover" />
                  {!msg.read && (
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-black" />
                  )}
                </div>

                {/* Body Details */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base md:text-lg font-black text-white">{msg.sender}</h3>
                        <span className="text-xs text-gray-400 font-medium">({msg.senderRole})</span>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-amber-300 mt-0.5">{msg.subject}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow ${getCategoryBadgeStyle(msg.category)}`}>
                        {msg.category}
                      </span>
                      <span className="text-xs text-gray-400 font-bold flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-lg border border-white/5">
                        <Calendar className="w-3.5 h-3.5" />
                        {msg.date}
                      </span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-line bg-black/40 p-4 rounded-xl border border-white/5">
                    {msg.body}
                  </p>

                  {!msg.read && (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Check className="w-4 h-4" />
                        Click to mark as read
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
