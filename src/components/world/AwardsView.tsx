/**
 * HOLLYWOOD RISING - Awards View (World Ecosystem)
 * Oscars, Emmys, Golden Globes, SAG Awards ceremonies & campaigning.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AwardItem } from '../../types/world';
import {
  Award,
  Sparkles,
  ArrowLeft,
  Trophy,
  Star,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface AwardsViewProps {
  onBack: () => void;
}

export const AwardsView: React.FC<AwardsViewProps> = ({ onBack }) => {
  const { player, releasedMovies, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const initialAwards: AwardItem[] = [
    {
      id: 'aw_1',
      eventName: 'Oscars',
      categoryName: 'Best Actor in a Leading Role',
      workTitle: releasedMovies[0]?.movieTitle || 'The Hollywood Horizon',
      nomineeName: `${player.firstName} ${player.lastName}`,
      status: 'Nominated',
      year: 2026,
    },
    {
      id: 'aw_2',
      eventName: 'Golden Globes',
      categoryName: 'Best Performance in a Motion Picture - Drama',
      workTitle: 'Avatar: Fire and Ash',
      nomineeName: 'Sam Worthington',
      status: 'Won',
      year: 2026,
    },
    {
      id: 'aw_3',
      eventName: 'SAG Awards',
      categoryName: 'Outstanding Performance by a Male Actor in a Drama Series',
      workTitle: 'The Last of Us',
      nomineeName: 'Pedro Pascal',
      status: 'Won',
      year: 2026,
    },
  ];

  const [awards, setAwards] = useState<AwardItem[]>(initialAwards);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLaunchCampaign = (awardId: string) => {
    setFeedback('AWARD CAMPAIGN LAUNCHED! Your Manager sent screener DVDs & PR ads to Academy voters.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-20 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          Academy & Guild Awards Portal
        </span>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">ACADEMY & GUILD AWARDS</h1>
            <p className="text-xs text-amber-300 font-medium">
              Oscars, Emmys, Golden Globes & SAG Awards nominations, winners & Manager PR campaigns.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* Eligibility Check: If Movies Released == 0, show error banner and hide campaign/nominations */}
      {releasedMovies.length === 0 ? (
        <div className="p-8 rounded-3xl border border-white/10 bg-black/60 text-center space-y-4 max-w-lg mx-auto my-8 shadow-2xl backdrop-blur-md">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 w-fit mx-auto">
            <Trophy className="w-12 h-12 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-wide">No Eligible Performances</h2>
            <p className="text-xs text-amber-300 font-medium leading-relaxed">
              No eligible performances. Release movies or TV series before becoming eligible.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/80 border border-white/10 text-xs text-gray-400 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span>Movies Released:</span>
              <strong className="text-rose-400">0 Released (Min. 1 Required)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Acting Credits:</span>
              <strong className="text-gray-300">{player.leadRolesCount + player.principalRolesCount} Roles</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Player Fame XP:</span>
              <strong className="text-amber-300">{player.fameXp} XP</strong>
            </div>
          </div>
        </div>
      ) : (
        /* Awards Cards & Campaigning (Visible only when releasedMovies > 0) */
        <div className="space-y-3">
          {awards.map((aw) => (
            <div
              key={aw.id}
              className="p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md space-y-3 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 shrink-0">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {aw.eventName} ({aw.year})
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                        aw.status === 'Won'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      {aw.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white mt-1">{aw.categoryName}</h3>
                  <p className="text-xs text-gray-400 font-medium">
                    Nominee: <strong className="text-white">{aw.nomineeName}</strong> for "{aw.workTitle}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleLaunchCampaign(aw.id)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-105 transition-all cursor-pointer shadow-lg shrink-0"
              >
                Launch Award PR Campaign
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
