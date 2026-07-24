/**
 * HOLLYWOOD RISING - Callboard Modal (Redesigned Phase 1 Update)
 * Large UI Cards, spacious Android portrait mobile design, big posters, clear role badges & apply button.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Film, Zap, DollarSign, Calendar, Building, UserCheck, Sparkles } from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const CallboardModal: React.FC = () => {
  const { setActiveModal, callboard, applyToCallboard, player, settings } = useGame();
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
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Film className="w-6 h-6" style={{ color: theme.primary }} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Hollywood Callboard</h2>
              <p className="text-xs text-gray-400">Weekly available film casting calls</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Energy bar status */}
        <div className="px-6 py-3.5 bg-black/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm">
          <span className="text-gray-300 font-medium">
            Application Cost: <strong className="text-amber-400 font-bold">20 Energy</strong> per casting application
          </span>
          <div className="flex items-center gap-2 font-bold px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10" style={{ color: player.energy >= 20 ? theme.primary : '#FF4444' }}>
            <Zap className="w-4 h-4 fill-current" />
            <span>Energy: {player.energy} / {player.maxEnergy}</span>
          </div>
        </div>

        {/* Callboard Projects List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">
          {callboard.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Film className="w-16 h-16 mx-auto text-gray-600 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-300">No New Scripts On Callboard</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                All scripts for this week have been reviewed or applied for. Click "End Week" on your dashboard to advance to new casting calls.
              </p>
            </div>
          ) : (
            callboard.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border-2 p-5 md:p-6 flex flex-col md:flex-row gap-6 transition-all hover:border-amber-400/60 bg-black/40 shadow-xl"
                style={{
                  borderColor: theme.borderDark,
                }}
              >
                {/* Poster */}
                <div className="w-full md:w-44 h-64 md:h-72 rounded-xl overflow-hidden shrink-0 relative bg-gray-900 border border-white/15 shadow-2xl">
                  <img
                    src={project.posterUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md text-xs font-bold text-amber-300 border border-amber-400/40 shadow">
                    {project.genre}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white">{project.title}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span>{project.productionCompany} ({project.studio})</span>
                        </p>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 text-purple-200 border border-purple-500/40 shadow">
                        {project.roleType} Role
                      </span>
                    </div>

                    <p className="text-sm text-gray-200 mt-3 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-3.5 rounded-xl bg-black/50 border border-white/5 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Director / Producer</span>
                        <span className="text-white font-bold text-xs">{project.director}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Filming Duration</span>
                        <span className="text-white font-bold text-xs flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          {project.filmingWeeks} Weeks
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Budget</span>
                        <span className="text-white font-bold text-xs">${(project.budget / 1000000).toFixed(1)}M</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Contract Salary</span>
                        <span className="text-emerald-400 font-extrabold text-xs flex items-center gap-0.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${project.salary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Action */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-gray-400 font-medium">
                      Estimated Casting Decision: <strong className="text-amber-300">~{project.decisionTimeWeeks} Weeks</strong>
                    </span>
                    <button
                      onClick={() => {
                        const res = applyToCallboard(project.id);
                        if (!res.success) {
                          alert(res.message);
                        }
                      }}
                      disabled={player.energy < 20}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        backgroundColor: theme.primary,
                        color: '#000000',
                      }}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>Apply for Role (-20 Energy)</span>
                    </button>
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
