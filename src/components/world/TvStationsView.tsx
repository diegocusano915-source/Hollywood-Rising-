/**
 * HOLLYWOOD RISING - TV STATIONS REBUILD (real interview show)
 * Manager/station books interviews with a countdown (inbox notification),
 * then the interview SHOW fires (up to 5 questions, 3 answers, autoplay + skip).
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { TvStation } from '../../types/world';
import { INITIAL_TV_STATIONS } from '../../database/worldDatabase';
import { buildQuestions, mergeOffersIntoStations, completeTvOffer } from '../../services/tvInterviewEngine';
import { RepresentationService } from '../../services/representationService';
import { TvInterviewModal } from '../modals/TvInterviewModal';
import {
  Tv,
  Mic,
  ArrowLeft,
  Sparkles,
  Clock,
  Lock,
  CheckCircle2,
  Calendar,
  Star,
  Film,
  Award,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface TvStationsViewProps {
  onBack: () => void;
}

const STATION_BADGE: Record<string, string> = {
  Morning: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Entertainment: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'Late Night': 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  News: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Sports: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  International: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
};

export const TvStationsView: React.FC<TvStationsViewProps> = ({ onBack }) => {
  const { player, saveData, updateSave, settings, releasedMovies } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [stations, setStations] = useState<TvStation[]>(() => mergeOffersIntoStations(INITIAL_TV_STATIONS));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeInterview, setActiveInterview] = useState<TvStation | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [askedIds, setAskedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('HR_TV_ASKED') || '[]'); } catch { return []; }
  });

  const fame = player.fameXp || 0;
  const movies = player.moviesCompleted || 0;
  const hasScandal = (saveData as any).representation?.pr?.scandals?.some((s: any) => !s.resolved) || false;

  const playerCtx = {
    player,
    latestMovie: releasedMovies[0],
    totalGross: releasedMovies[0]?.worldwideGross || 0,
    awardsWon: player.awardsWon || 0,
    hasScandal,
    fans: player.fans || 0,
    isUnionMember: !!player.isUnionMember,
  };

  const persistAsked = (ids: string[]) => {
    setAskedIds(ids);
    try { localStorage.setItem('HR_TV_ASKED', JSON.stringify(ids)); } catch {}
  };

  const stationReady = (st: TvStation) => !!st.activeInterviewOffer && st.activeInterviewOffer.status === 'READY';
  const stationLocked = (st: TvStation) => fame < st.minFame || movies < st.minMovies;

  // Launch the interview show
  const launchInterview = (st: TvStation) => {
    if (!stationReady(st)) return;
    const qs = buildQuestions(playerCtx, st.stationType, askedIds);
    if (qs.length === 0) { setFeedback('No questions available right now — try again next week.'); return; }
    setInterviewQuestions(qs);
    setActiveInterview(st);
  };

  const handleComplete = (result: any) => {
    if (!activeInterview) return;
    // Apply real rewards
    const p = { ...player };
    p.money = (p.money || 0) + result.cashEarned;
    p.fans = (p.fans || 0) + result.fansGained;
    p.fameXp = (p.fameXp || 0) + result.fameXpGained;
    if (result.reputationChange) {
      try {
        const rep = (saveData as any).representation?.reputation;
        if (rep) {
          rep.publicReputation = Math.max(0, Math.min(100, (rep.publicReputation || 0) + result.reputationChange));
        }
      } catch {}
    }

    // Mark offer DONE (persisted + local)
    completeTvOffer(activeInterview.id);
    setStations((prev) =>
      prev.map((s) =>
        s.id === activeInterview.id
          ? { ...s, activeInterviewOffer: s.activeInterviewOffer ? { ...s.activeInterviewOffer, status: 'DONE' } : undefined }
          : s
      )
    );

    // Rotate asked questions (persist rotation, max 20 stored)
    const newAsked = [...askedIds, ...interviewQuestions.map((q: any) => q.id)].slice(-20);
    persistAsked(newAsked);

    // REAL scandal: the clipped soundbite becomes a MINOR PR scandal to resolve
    if (result.scandalTriggered) {
      try { RepresentationService.addInterviewScandal(player, result.stationName); } catch {}
    }

    updateSave({ ...saveData, player: p });

    setFeedback(
      `🎙️ Interview complete on ${result.stationName}! +$${result.cashEarned.toLocaleString()} · +${result.fansGained.toLocaleString()} fans · +${result.fameXpGained} XP` +
      (result.scandalTriggered ? ' · 📰 Soundbite scandal! Check Representation → PR' : '')
    );
    setActiveInterview(null);
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={onBack} className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg">
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
          <Tv className="w-5 h-5 text-sky-400" />
          <span>TV Stations</span>
        </div>
      </div>

      {feedback && <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-black text-center">{feedback}</div>}

      {/* Banner */}
      <div className="p-4 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-950/30 via-black/70 to-black/70 space-y-1">
        <h2 className="text-sm font-black uppercase tracking-wider text-sky-200 flex items-center gap-2"><Mic className="w-4 h-4 text-sky-400" /> Live Interview Circuit</h2>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Your Manager books interviews — you'll get an <strong className="text-white">inbox notification</strong> with the countdown.
          When it airs, sit for up to <strong className="text-white">5 questions</strong> with 3 answers each. Bigger stations require more fame & movies.
        </p>
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stations.map((st) => {
          const locked = stationLocked(st);
          const ready = stationReady(st);
          const offer = st.activeInterviewOffer;
          const badge = STATION_BADGE[st.stationType] || STATION_BADGE.Entertainment;
          return (
            <div
              key={st.id}
              className={`p-4 rounded-3xl border backdrop-blur-md space-y-3 transition-all ${
                ready
                  ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 via-black/70 to-black/70 shadow-lg shadow-emerald-500/10'
                  : locked
                  ? 'border-white/10 bg-black/40 opacity-70'
                  : 'border-sky-500/30 bg-black/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={st.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{st.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{st.showName} · Hosted by {st.host}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg border text-[9px] font-black shrink-0 ${badge}`}>{st.stationType}</span>
              </div>

              {/* Reach + requirements */}
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><Tv className="w-3 h-3" /> {st.viewerReach}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {st.minFame.toLocaleString()} XP · <Film className="w-3 h-3" /> {st.minMovies} films</span>
              </div>

              {/* Status area */}
              {locked ? (
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-gray-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked — {st.minFame > fame ? `need ${(st.minFame - fame).toLocaleString()} more XP` : `need ${st.minMovies - movies} more film${st.minMovies - movies > 1 ? 's' : ''}`}</span>
                </div>
              ) : ready && offer ? (
                <button
                  onClick={() => launchInterview(st)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4" /> GO LIVE — INTERVIEW READY
                </button>
              ) : offer && offer.status === 'PENDING' ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Interview in <strong>{offer.scheduledInWeeks} week{offer.scheduledInWeeks > 1 ? 's' : ''}</strong> — check your inbox to prepare</span>
                </div>
              ) : offer && offer.status === 'DONE' ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Interview complete — the host will invite you back with new news</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[10px] text-gray-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{player.representation?.manager?.signed ? 'Your manager books interviews — expect a scheduling email soon' : 'Interviews are booked by your Personal Manager — hire one to get on air'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interview Modal */}
      {activeInterview && (
        <TvInterviewModal
          station={activeInterview}
          questions={interviewQuestions}
          playerCtx={playerCtx}
          onComplete={handleComplete}
          onClose={() => setActiveInterview(null)}
        />
      )}
    </div>
  );
};
