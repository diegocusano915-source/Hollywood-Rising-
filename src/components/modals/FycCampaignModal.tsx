/**
 * HOLLYWOOD RISING - For Your Consideration (FYC) Award Campaign Modal
 * Allows players to invest money into official FYC campaigns for released movies to boost nomination & win chances.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Award,
  DollarSign,
  TrendingUp,
  Megaphone,
  Tv,
  Users,
  Sparkles,
  CheckCircle2,
  Film,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ReleasedMovie } from '../../types/game';
import { THEMES } from '../../theme/colors';
import { soundService } from '../../services/soundService';

interface FycOption {
  level: 'Ads' | 'Screenings' | 'Dinners' | 'Blitz';
  title: string;
  cost: number;
  boostText: string;
  description: string;
  icon: React.ReactNode;
}

const FYC_OPTIONS: FycOption[] = [
  {
    level: 'Ads',
    title: 'Trade Magazine FYC Print Ads',
    cost: 15000,
    boostText: '+15% Nomination Chance',
    description: 'Full-page "For Your Consideration" ads in Variety, The Hollywood Reporter, and Deadline.',
    icon: <Megaphone className="w-5 h-5 text-amber-400" />,
  },
  {
    level: 'Screenings',
    title: 'Private Critic & Guild Screenings',
    cost: 35000,
    boostText: '+30% Nomination Chance',
    description: 'Host Q&A screenings with voters at the DGA Theater in Los Angeles and London.',
    icon: <Film className="w-5 h-5 text-sky-400" />,
  },
  {
    level: 'Dinners',
    title: 'Academy Receptions & Dinners',
    cost: 75000,
    boostText: '+50% Nomination & Win Chance',
    description: 'Exclusive private dinners at Chateau Marmont for voting branch members.',
    icon: <Users className="w-5 h-5 text-purple-400" />,
  },
  {
    level: 'Blitz',
    title: 'Full Academy Blitz Campaign',
    cost: 150000,
    boostText: '+80% Frontrunner Status',
    description: 'Comprehensive media blitz, podcast circuit, festival pushes, and voter gift boxes.',
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
  },
];

interface FycCampaignModalProps {
  movie: ReleasedMovie;
  onClose: () => void;
}

export const FycCampaignModal: React.FC<FycCampaignModalProps> = ({ movie, onClose }) => {
  const { player, launchFycCampaign, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLaunch = (option: FycOption) => {
    if (player.money < option.cost) {
      soundService.playClick();
      setFeedback(`Insufficient funds! You need $${option.cost.toLocaleString()} to launch this campaign.`);
      return;
    }

    const res = launchFycCampaign(movie.id, option.level, option.cost);
    if (res.success) {
      soundService.playGoldChime();
      setFeedback(res.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      soundService.playClick();
      setFeedback(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl rounded-3xl p-6 border-2 shadow-2xl flex flex-col gap-5"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                For Your Consideration (FYC)
              </h3>
              <p className="text-xs text-amber-300 font-semibold">{movie.movieTitle} • Awards Season Campaign</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Current Campaign Info */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-gray-400">Current Status</span>
            <h4 className="text-sm font-black text-white">
              {movie.fycCampaignLevel ? `${movie.fycCampaignLevel} Campaign Active` : 'No Campaign Launched'}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-gray-400">Player Available Cash</span>
            <p className="text-sm font-black text-emerald-400">${player.money.toLocaleString()}</p>
          </div>
        </div>

        {/* FYC Tiers */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {FYC_OPTIONS.map((opt) => {
            const canAfford = player.money >= opt.cost;
            const isCurrent = movie.fycCampaignLevel === opt.level;

            return (
              <div
                key={opt.level}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-400'
                    : 'bg-black/40 border-white/10 hover:border-amber-400/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                      <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                        {opt.boostText}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
                  <span className="text-sm font-black text-emerald-400">${opt.cost.toLocaleString()}</span>

                  <button
                    disabled={!canAfford || isCurrent}
                    onClick={() => handleLaunch(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-amber-400 text-black font-extrabold cursor-default'
                        : canAfford
                        ? 'bg-amber-400 text-black hover:scale-105 active:scale-95'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isCurrent ? 'Active' : 'Launch'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
