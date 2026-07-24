/**
 * HOLLYWOOD RISING - Radio Stations View (World Ecosystem)
 * Radio & Podcast Interviews checked against player Fame, Movies Released & Lead Roles.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RadioStation } from '../../types/world';
import { INITIAL_RADIO_STATIONS } from '../../database/worldDatabase';
import {
  Radio,
  Mic,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  RadioTower,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface RadioStationsViewProps {
  onBack: () => void;
}

export const RadioStationsView: React.FC<RadioStationsViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [stations, setStations] = useState<RadioStation[]>(INITIAL_RADIO_STATIONS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fameScore = player.fameXp || 0;
  const moviesReleased = player.moviesCompleted || 0;
  const leadRolesCount = player.leadRolesCount || 0;

  const hasFame = fameScore > 0 || moviesReleased > 0 || leadRolesCount > 0;

  const handleAcceptInterview = (stationId: string) => {
    const st = stations.find((s) => s.id === stationId);
    if (!st || !st.activeInterviewOffer) return;

    setFeedback(`ACCEPTED RADIO INTERVIEW ON "${st.name}"! Gained +${st.activeInterviewOffer.fansReward} Fans!`);

    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, activeInterviewOffer: undefined } : s))
    );

    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeclineInterview = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, activeInterviewOffer: undefined } : s))
    );
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
          <Radio className="w-4 h-4 text-amber-400" />
          Hollywood Radio & Broadcast Network
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
            <Radio className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">RADIO STATIONS & MORNING SHOWS</h1>
            <p className="text-xs text-amber-300 font-medium">
              Accept morning radio interviews, syndrome talk shows & syndicate audio broadcasts.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* FAME CHECK */}
      {!hasFame ? (
        <div className="p-10 rounded-3xl border border-amber-500/30 bg-black/50 text-center space-y-4 shadow-2xl backdrop-blur-md max-w-xl mx-auto my-6">
          <div className="p-4 rounded-full bg-amber-500/20 border border-amber-500/40 w-16 h-16 mx-auto flex items-center justify-center">
            <RadioTower className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">No Interview Invitations Available</h2>
            <p className="text-sm font-bold text-amber-300">
              Continue building your acting career.
            </p>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Radio stations require actors to have fame, completed movies, or lead role credits before scheduling morning show interviews.
            </p>
          </div>
        </div>
      ) : (
        /* Large Image Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stations.map((st) => (
            <div
              key={st.id}
              className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl space-y-3 flex flex-col justify-between"
            >
              {/* Image Header */}
              <div className="h-36 w-full relative overflow-hidden bg-gray-900">
                <img src={st.imageUrl} alt={st.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {st.listeners}
                    </span>
                    <h2 className="text-lg font-black text-white mt-1">{st.name}</h2>
                    <p className="text-xs text-gray-300 font-medium">Host: {st.host}</p>
                  </div>
                </div>
              </div>

              {/* Offer Body */}
              <div className="p-4 pt-0 space-y-3">
                {st.activeInterviewOffer ? (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-amber-300 uppercase text-[10px]">
                        RADIO INTERVIEW INVITATION
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Expires in {st.activeInterviewOffer.expiresWeeks} Wks
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white">
                      Topic: "{st.activeInterviewOffer.topic}"
                    </p>

                    <div className="flex items-center gap-3 text-xs pt-1">
                      <span className="font-extrabold text-sky-400">
                        +{st.activeInterviewOffer.fansReward} Fan Expansion
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleAcceptInterview(st.id)}
                        className="py-2.5 rounded-xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept Interview
                      </button>
                      <button
                        onClick={() => handleDeclineInterview(st.id)}
                        className="py-2.5 rounded-xl font-bold text-xs bg-black/60 text-gray-400 hover:text-white border border-white/10 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-[10px] text-gray-500 text-center font-bold">
                    No active radio offers pending. Check back next week!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
