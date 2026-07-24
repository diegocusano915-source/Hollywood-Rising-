/**
 * HOLLYWOOD RISING - Booking / Filming Modal
 * Shows active filmed productions and Boost Production button.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Video, Zap, Calendar, DollarSign, Sparkles } from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const BookingModal: React.FC = () => {
  const { setActiveModal, bookedProjects, boostProduction, player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5" style={{ color: theme.primary }} />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Active Bookings & Filming</h2>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {bookedProjects.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Video className="w-12 h-12 mx-auto text-gray-600 animate-pulse" />
              <p className="text-gray-400 text-sm font-medium">No active filming contracts at this time.</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Apply for roles on the Callboard and await callback decisions in Auditions.
              </p>
            </div>
          ) : (
            bookedProjects.map((book) => {
              const progressPercent = Math.round(
                ((book.totalFilmingWeeks - book.weeksRemaining) / book.totalFilmingWeeks) * 100
              );

              return (
                <div
                  key={book.id}
                  className="rounded-xl border p-4 flex flex-col md:flex-row gap-4 transition-all"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderColor: theme.borderDark,
                  }}
                >
                  {/* Poster */}
                  <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0 bg-gray-900 border border-white/10">
                    <img src={book.posterUrl} alt={book.movieTitle} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">{book.movieTitle}</h3>
                          <p className="text-xs text-amber-400 font-semibold">{book.roleType} Role</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${book.salary.toLocaleString()} Contract
                        </span>
                      </div>

                      {/* Filming Progress Bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Filming Progress ({book.totalFilmingWeeks - book.weeksRemaining}/{book.totalFilmingWeeks} Weeks)</span>
                          <span className="font-bold text-white">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${progressPercent}%`,
                              backgroundColor: theme.primary,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Boost Action */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">
                        {book.weeksRemaining} Filming Weeks Remaining
                      </span>
                      <button
                        onClick={() => {
                          const res = boostProduction(book.id);
                          if (!res.success) {
                            alert(res.message);
                          }
                        }}
                        disabled={player.energy < 2 || book.weeksRemaining <= 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-purple-600 hover:bg-purple-500 text-white"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                        Boost Production (-2 Energy)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
