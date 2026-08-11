/**
 * HOLLYWOOD RISING - Awards & Recognition (Ceremony History)
 * The old click-to-win sandbox (+5,000 XP exploit) is GONE.
 * This view now shows your REAL year-end awards history from the annual
 * Hollywood Rising Awards Night (Week 52) — nominations, winners, trophies.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Trophy, Sparkles, Crown, Calendar, Star } from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface AwardsViewProps {
  onBack: () => void;
}

export const AwardsView: React.FC<AwardsViewProps> = ({ onBack }) => {
  const { player, awardHistory, trophies, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const history = awardHistory || [];
  const trophyList = trophies || [];
  const totalWins = history.filter((r) => r.isPlayerWinner).length;
  const totalNoms = history.filter((r) => r.isPlayerNominated).length;

  // Group by year
  const years = Array.from(new Set(history.map((r) => r.year))).sort((a, b) => b - a);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Awards & Recognition</span>
        </div>
      </div>

      {/* Season explainer */}
      <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-black/70 to-black/70 space-y-2">
        <h2 className="text-sm font-black uppercase tracking-wider text-amber-200 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" /> The Hollywood Rising Awards
        </h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          One unified ceremony every year — <strong className="text-white">Week 52, the final week of the year</strong>.
          12-15 categories with <strong className="text-white">10 real nominees + you</strong> (when eligible), all drawn from
          movies that actually played in your box office that year. NPC stars genuinely compete — you win only when your
          film is truly the best.
        </p>
        <p className="text-[11px] text-amber-300/80">
          Nominations & wins grant Fame XP, trophies for your Trophy Room, Hollywood Insider press, and permanent records here.
        </p>
      </div>

      {/* Career summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Awards Won</span>
          <span className="text-2xl font-black text-amber-300">{player.awardsWon || 0}</span>
        </div>
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Career Wins (records)</span>
          <span className="text-2xl font-black text-white">{totalWins}</span>
        </div>
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Career Nominations</span>
          <span className="text-2xl font-black text-white">{totalNoms}</span>
        </div>
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Trophy Room Items</span>
          <span className="text-2xl font-black text-white">{trophyList.length}</span>
        </div>
      </div>

      {/* Trophy Room preview */}
      {trophyList.length > 0 && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
          <h3 className="text-sm font-black uppercase text-gray-200 tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Your Trophies ({trophyList.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {trophyList.slice(0, 8).map((t) => (
              <div key={t.id} className="p-3 rounded-2xl bg-black/40 border border-amber-500/20 text-center">
                <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] font-black text-white leading-tight">{t.category}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">{t.year} · {t.movieTitle}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ceremony History by year */}
      {years.length === 0 ? (
        <div className="p-10 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
          <Sparkles className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-black text-white">No Ceremony History Yet</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Finish Week 52 of the year and the Hollywood Rising Awards Night will fire automatically with your first
            ceremony. Release movies to compete!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {years.map((year) => {
            const yearRecords = history.filter((r) => r.year === year);
            const yearWins = yearRecords.filter((r) => r.isPlayerWinner);
            return (
              <div key={year} className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" /> {year} Ceremony
                  </h3>
                  <span className="text-[10px] font-black text-gray-400">
                    {yearWins.length} win(s) · {yearRecords.length} record(s)
                  </span>
                </div>
                <div className="space-y-2">
                  {yearRecords.map((rec, i) => (
                    <div
                      key={rec.id || i}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                        rec.isPlayerWinner
                          ? 'border-amber-500/50 bg-amber-500/10'
                          : rec.isPlayerNominated
                          ? 'border-white/10 bg-black/40'
                          : 'border-white/5 bg-black/30'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{rec.eventName} · {rec.category}</p>
                        <p className="text-xs font-black text-white truncate">
                          {rec.isPlayerWinner ? (
                            <>🏆 <span className="text-amber-300">{rec.winnerName}</span> — "{rec.winnerTitle}"</>
                          ) : (
                            <>🥈 {rec.winnerName} — "{rec.winnerTitle}"</>
                          )}
                        </p>
                        {rec.isPlayerNominated && rec.movieTitle && (
                          <p className="text-[10px] text-gray-500 truncate">Your film: "{rec.movieTitle}"</p>
                        )}
                      </div>
                      {rec.isPlayerWinner && <Trophy className="w-5 h-5 text-amber-400 shrink-0" />}
                      {rec.isPlayerNominated && !rec.isPlayerWinner && (
                        <span className="text-[9px] px-2 py-1 rounded-full bg-white/10 text-gray-400 font-bold uppercase shrink-0">Nominated</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
