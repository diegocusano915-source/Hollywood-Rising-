/**
 * HOLLYWOOD RISING - Streaming Platforms View (World Ecosystem)
 * 13 Real Streaming Platforms, Exclusive Deals, Pitching Projects & Licensing.
 * Requires Personal Production Studio in Empire to pitch projects.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { StreamingPlatform } from '../../types/world';
import { INITIAL_STREAMING_PLATFORMS } from '../../database/worldDatabase';
import {
  Video,
  Tv,
  ArrowLeft,
  Sparkles,
  DollarSign,
  CheckCircle2,
  Lock,
  Film,
  Send,
  X,
  Award,
  Globe,
  Building2,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface StreamingViewProps {
  onBack: () => void;
}

export const StreamingView: React.FC<StreamingViewProps> = ({ onBack }) => {
  const { player, settings, releasedMovies, updatePlayer } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [platforms, setPlatforms] = useState<StreamingPlatform[]>(INITIAL_STREAMING_PLATFORMS);
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatform | null>(null);
  const [pitchTitle, setPitchTitle] = useState('');
  const [pitchType, setPitchType] = useState<'Movie' | 'Series'>('Movie');
  const [pitchFeedback, setPitchFeedback] = useState<string | null>(null);

  const hasStudio = !!player.empire?.indieStudioOwned;

  const handlePitchProject = (platformId: string) => {
    if (!pitchTitle.trim()) {
      setPitchFeedback('Please enter a project title to pitch.');
      return;
    }

    // REALISTIC PAYOUT: based on your real career stats, not a random roll
    const latestMovie = releasedMovies && releasedMovies.length > 0 ? releasedMovies[0] : null;
    const trackRecord = Math.floor((player.fameXp || 0) * 220 + (player.fans || 0) * 0.4 + (player.moviesCompleted || 0) * 60000);
    const lastHit = latestMovie && latestMovie.worldwideGross ? Math.floor(latestMovie.worldwideGross * 0.03) : 0;
    const upfrontPayout = Math.max(15000, Math.floor((trackRecord + lastHit) * (0.85 + Math.random() * 0.35)));
    const capped = Math.min(upfrontPayout, Math.floor(200000000));

    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === platformId) {
          return {
            ...p,
            status: 'Partner',
            exclusiveDealsCount: p.exclusiveDealsCount + 1,
            moviesLicensed: pitchType === 'Movie' ? p.moviesLicensed + 1 : p.moviesLicensed,
            seriesLicensed: pitchType === 'Series' ? p.seriesLicensed + 1 : p.seriesLicensed,
            moneyEarned: p.moneyEarned + capped,
          };
        }
        return p;
      })
    );

    // Player ACTUALLY receives the money (real income)
    updatePlayer({ money: (player.money || 0) + capped });

    setPitchFeedback(`PITCH ACCEPTED! ${selectedPlatform?.name} signed "${pitchTitle}" for an upfront licensing payout of $${capped.toLocaleString()} — deposited to your account!`);
    setPitchTitle('');
    setTimeout(() => {
      setSelectedPlatform(null);
      setPitchFeedback(null);
    }, 3500);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-24 space-y-5"
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
          <Video className="w-4 h-4 text-amber-400" />
          Real Streaming Networks Suite
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
            <Video className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">STREAMING NETWORKS & PLATFORMS</h1>
            <p className="text-xs text-amber-300 font-medium">
              Pitch original movies & series, negotiate exclusive overall deals, and track global licensing royalties.
            </p>
          </div>
        </div>
      </div>

      {!hasStudio && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-extrabold text-amber-300 block uppercase text-[10px]">
              Studio Pitch Requirement
            </span>
            <p className="text-gray-300">
              You can browse global streaming platforms. To pitch original film/series titles, unlock a Personal Production Studio in Empire.
            </p>
          </div>
        </div>
      )}

      {/* Streaming Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((plat) => (
          <div
            key={plat.id}
            className="p-5 rounded-3xl border border-white/10 bg-black/40 hover:bg-black/70 hover:border-amber-400/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg overflow-hidden shrink-0 border border-white/20"
                    style={{ backgroundColor: plat.color }}
                  >
                    <img src={plat.logoUrl} alt={plat.name} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{plat.name}</h3>
                    <span className="text-[10px] text-gray-400 font-bold block">
                      {plat.subscribers} Global Subscribers
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                    plat.status === 'Exclusive'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : plat.status === 'Partner'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  {plat.status}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px]">
                <div>
                  <span className="text-gray-500 block font-bold">Exclusive Deals</span>
                  <span className="font-black text-amber-300">{plat.exclusiveDealsCount} Deals</span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">Licensed Titles</span>
                  <span className="font-black text-sky-300">
                    {plat.moviesLicensed + plat.seriesLicensed} Works
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block font-bold">Money Earned</span>
                  <span className="font-black text-emerald-400">${plat.moneyEarned.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Pitch Action */}
            {hasStudio ? (
              <button
                onClick={() => setSelectedPlatform(plat)}
                className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Pitch Project to {plat.name}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-2xl font-black text-xs bg-gray-800 text-gray-400 border border-white/10 flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                Personal Studio Required
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pitch Modal */}
      {selectedPlatform && hasStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-md rounded-3xl border border-amber-400/40 p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: theme.headers }}
          >
            <button
              onClick={() => setSelectedPlatform(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-400 uppercase">STREAMING PITCH SUITE</span>
              <h2 className="text-xl font-black text-white">Pitch to {selectedPlatform.name}</h2>
              <p className="text-xs text-gray-300">
                Submit an original film or series project directly to executives for upfront licensing & royalties.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Neon Horizon, Cyber Chronicles..."
                  value={pitchTitle}
                  onChange={(e) => setPitchTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Format Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPitchType('Movie')}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      pitchType === 'Movie'
                        ? 'bg-amber-400 text-black'
                        : 'bg-black/50 text-gray-400 border border-white/10'
                    }`}
                  >
                    Feature Film
                  </button>
                  <button
                    onClick={() => setPitchType('Series')}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      pitchType === 'Series'
                        ? 'bg-amber-400 text-black'
                        : 'bg-black/50 text-gray-400 border border-white/10'
                    }`}
                  >
                    TV Series
                  </button>
                </div>
              </div>
            </div>

            {pitchFeedback && (
              <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                {pitchFeedback}
              </p>
            )}

            <button
              onClick={() => handlePitchProject(selectedPlatform.id)}
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Pitch Proposal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
