/**
 * HOLLYWOOD RISING - Auditions Modal (Redesigned Phase 1 Update)
 * Large UI cards, spacious layout, clear poster, title, studio, genre, role badge, weeks remaining & status.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Clock, Clapperboard, CheckCircle2, Hourglass, Building, DollarSign } from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const AuditionsModal: React.FC = () => {
  const { setActiveModal, auditions, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

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
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <Clapperboard className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Pending Auditions</h2>
              <p className="text-xs text-gray-400">Track decision countdowns and callback statuses</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Auditions List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 flex-1">
          {auditions.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Hourglass className="w-16 h-16 mx-auto text-gray-600 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-300">No Pending Auditions</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                You haven't submitted any audition applications yet. Visit the Callboard to apply for film roles.
              </p>
            </div>
          ) : (
            auditions.map((aud) => (
              <div
                key={aud.id}
                className="rounded-2xl border-2 p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start md:items-center bg-black/40 shadow-xl transition-all hover:border-purple-400/50"
                style={{
                  borderColor: theme.borderDark,
                }}
              >
                {/* Poster Thumbnail */}
                <div className="w-28 md:w-36 h-40 md:h-52 rounded-xl overflow-hidden bg-gray-900 border border-white/15 shrink-0 shadow-2xl relative">
                  <img src={aud.posterUrl} alt={aud.movieTitle} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-400/30">
                    Applied Wk {aud.appliedWeek}
                  </div>
                </div>

                {/* Information */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-white">{aud.movieTitle}</h3>
                      <p className="text-xs md:text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-gray-500" />
                        <span>Hollywood Production Studio</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {aud.agentPitched && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow flex items-center gap-1">
                          🎯 Agent-Pitched
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow">
                        {aud.roleType} Role
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                    <span className="text-gray-400">Guaranteed Contract Salary:</span>
                    <strong className="text-emerald-400 font-extrabold flex items-center gap-0.5">
                      <DollarSign className="w-4 h-4" />
                      ${aud.salary.toLocaleString()}
                    </strong>
                  </div>

                  {/* Timer & Status Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs md:text-sm">
                    {/* Weeks Remaining */}
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 flex items-center gap-2.5">
                      <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Decision Countdown</span>
                        <span className="text-amber-300 font-extrabold">{aud.weeksRemaining} Weeks Remaining</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="p-3 rounded-xl bg-black/50 border border-sky-500/20 flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Current Casting Status</span>
                        <span className="text-white font-extrabold">{aud.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
