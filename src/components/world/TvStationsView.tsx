/**
 * HOLLYWOOD RISING - NETWORK BOOKING DESK (TV, Option A rebuild)
 * Terminal-style channel board. Every status is REAL: bookings happen only
 * via the engine on unlocked channels, invitations on locked channels stay
 * visible ("held warm"), and there are no ghost notifications — the ON AIR
 * queue reflects live offers only.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { TvStation } from '../../types/world';
import { INITIAL_TV_STATIONS } from '../../database/worldDatabase';
import { buildTvQuestions, mergeOffersIntoStations, completeTvOffer } from '../../services/tvInterviewEngine';
import { RepresentationService } from '../../services/representationService';
import { TvInterviewModal } from '../modals/TvInterviewModal';
import { ArrowLeft } from 'lucide-react';

interface TvStationsViewProps { onBack: () => void; }

const TYPE_COLOR: Record<string, string> = {
  Morning: '#f5b942', Entertainment: '#cf9df0', 'Late Night': '#7ab3ec',
  News: '#5fd6a4', Sports: '#ff8fa3', International: '#a5b4fc', Talk: '#f0abfc',
};

export const TvStationsView: React.FC<TvStationsViewProps> = ({ onBack }) => {
  const { player, saveData, updateSave, releasedMovies } = useGame();

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

  const launchInterview = (st: TvStation) => {
    if (!stationReady(st)) return;
    const qs = buildTvQuestions(playerCtx, st.stationType, askedIds);
    if (qs.length === 0) { setFeedback('No questions available right now — try again next week.'); return; }
    setInterviewQuestions(qs);
    setActiveInterview(st);
  };

  const handleComplete = (result: any) => {
    if (!activeInterview) return;
    const p = { ...player };
    p.money = (p.money || 0) + result.cashEarned;
    p.fans = (p.fans || 0) + result.fansGained;
    p.fameXp = (p.fameXp || 0) + result.fameXpGained;
    if (result.reputationChange) {
      try {
        const rep = (saveData as any).representation?.reputation;
        if (rep) rep.publicReputation = Math.max(0, Math.min(100, (rep.publicReputation || 0) + result.reputationChange));
      } catch {}
    }
    completeTvOffer(activeInterview.id);
    setStations((prev) =>
      prev.map((s) => s.id === activeInterview.id
        ? { ...s, activeInterviewOffer: s.activeInterviewOffer ? { ...s.activeInterviewOffer, status: 'DONE' } : undefined }
        : s)
    );
    const newAsked = [...askedIds, ...interviewQuestions.map((q: any) => q.id)].slice(-20);
    persistAsked(newAsked);
    if (result.scandalTriggered) {
      try { RepresentationService.addInterviewScandal(player, result.stationName); } catch {}
    }
    updateSave({ ...saveData, player: p });
    setFeedback(
      `🔴 Aired on ${result.stationName}: +$${result.cashEarned.toLocaleString()} · +${result.fansGained.toLocaleString()} fans · +${result.fameXpGained} XP` +
      (result.scandalTriggered ? ' · 📰 Soundbite scandal! Check Representation → PR' : '')
    );
    setActiveInterview(null);
    setTimeout(() => setFeedback(null), 6000);
  };

  const readyCount = stations.filter((s) => stationReady(s)).length;
  const pendingCount = stations.filter((s) => s.activeInterviewOffer?.status === 'PENDING').length;

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-3" style={{ backgroundColor: '#07080c' }}>
      <style>{`@keyframes deskBlink { 50% { opacity: 0.25; } }`}</style>

      {/* nav */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="px-4 py-2.5 rounded-xl bg-[#0b0d12] border border-[#1b212c] text-gray-300 text-xs font-black flex items-center gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-[#e0455e]" /> Back to World
        </button>
        <span className="text-[9px] font-black text-[#5c6470] tracking-[2px] hidden sm:block">{INITIAL_TV_STATIONS.length} NETWORKS</span>
      </div>

      {feedback && <div className="p-3 rounded-xl bg-[#e0455e]/10 border border-[#e0455e]/40 text-[#ff8296] text-[11px] font-bold text-center">{feedback}</div>}

      {/* booking desk */}
      <div className="rounded-2xl border border-[#1b212c] bg-[#0b0d12] overflow-hidden">
        <div className="flex justify-between items-center px-3.5 py-2.5 bg-[#0e1118] border-b border-[#1b212c]">
          <div className="flex gap-1.5">
            <i className="w-2 h-2 rounded-full bg-[#f6465d] block" />
            <i className="w-2 h-2 rounded-full bg-[#f0b90b] block" />
            <i className="w-2 h-2 rounded-full bg-[#2ecc8f] block" />
          </div>
          <span className="text-[9px] font-black tracking-[2.5px] text-[#e0455e]">NETWORK BOOKING DESK</span>
          <span className="text-[9px] font-mono text-[#5c6470]">WK {player.dateWeek} · {player.dateYear}</span>
        </div>

        {/* ON AIR queue strip */}
        <div className="flex justify-between items-center px-3.5 py-2.5 bg-[#14080c] border-b border-[#2a1218]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e0455e] block" style={{ boxShadow: '0 0 10px #e0455e', animation: 'deskBlink 1.2s infinite' }} />
            <b className="text-[10px] tracking-[2px] text-[#ff8296]">ON AIR QUEUE</b>
          </div>
          <div className="text-right font-mono text-[8px] text-[#8b96a8] leading-relaxed">
            {readyCount} LIVE{readyCount === 1 ? '' : 'S'} · {pendingCount} BOOKED<br />
            NO GHOST NOTICES — EVERY ALERT = REAL OFFER
          </div>
        </div>

        {/* channel rows */}
        <div className="p-2.5 space-y-1.5">
          {stations.map((st) => {
            const locked = stationLocked(st);
            const ready = stationReady(st);
            const offer = st.activeInterviewOffer;
            const col = TYPE_COLOR[st.stationType] || '#8b96a8';
            return (
              <div key={st.id} className={`flex gap-2.5 items-center px-3 py-2.5 rounded-xl border ${
                ready ? 'border-[#e0455e]/50 bg-[#1a0b10]' : locked ? 'border-[#1b212c] bg-[#0b0d12] opacity-70' : 'border-[#1b212c] bg-[#0e1117]'
              }`}>
                {/* logo */}
                <div className="w-10 h-10 rounded-[11px] flex items-center justify-center text-[13px] font-black shrink-0"
                  style={{ background: `linear-gradient(135deg, ${col}33, ${col}11)`, border: `1px solid ${col}44`, color: col }}>
                  {st.name.slice(0, 2).toUpperCase()}
                </div>

                {/* main */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <b className="text-[11px] text-gray-100 truncate">{st.name}</b>
                    <span className="text-[6.5px] font-black px-1.5 py-0.5 rounded shrink-0" style={{ background: `${col}18`, color: col }}>{st.stationType.toUpperCase()}</span>
                  </div>
                  <span className="text-[7.5px] text-[#6b7484] block truncate font-mono">
                    {st.showName} · {st.viewerReach} · {st.minFame.toLocaleString()} FAME REQ
                  </span>
                  {/* held invitation on a locked channel — VISIBLE, never hidden */}
                  {locked && offer && offer.status !== 'DONE' && (
                    <span className="text-[6.5px] text-[#7ab3ec] block mt-0.5">
                      ✉ INVITATION HELD — unlocks at {st.minFame.toLocaleString()} fame ({offer.scheduledInWeeks} wk countdown paused)
                    </span>
                  )}
                </div>

                {/* status */}
                <div className="shrink-0 text-right">
                  {ready ? (
                    <button onClick={() => launchInterview(st)}
                      className="text-[8px] font-black px-3 py-2 rounded-lg bg-[#e0455e] text-white cursor-pointer"
                      style={{ animation: 'deskBlink 1.6s infinite' }}>
                      🔴 GO LIVE
                    </button>
                  ) : offer && offer.status === 'PENDING' ? (
                    <span className="text-[7px] font-black px-2.5 py-1.5 rounded-md bg-[#f5b942]/10 text-[#f5b942] border border-[#f5b942]/30 inline-block">
                      {locked ? 'HOLD' : 'BOOKED'} · {offer.scheduledInWeeks} WK
                    </span>
                  ) : offer && offer.status === 'DONE' ? (
                    <span className="text-[7px] font-black px-2.5 py-1.5 rounded-md bg-white/5 text-[#6b7484] border border-white/10 inline-block">AIRED ✓</span>
                  ) : locked ? (
                    <span className="text-[7px] font-black px-2.5 py-1.5 rounded-md bg-white/5 text-[#556074] border border-dashed border-[#2a3038] inline-block">🔒 LOCKED</span>
                  ) : (
                    <span className="text-[6.5px] text-[#556074] block max-w-[80px] leading-tight">
                      {player.representation?.manager?.signed ? 'awaiting booking' : 'hire a manager'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-3.5 py-2 border-t border-[#1b212c]">
          <p className="text-[7.5px] text-[#5c6470] font-mono leading-relaxed">
            BOOKINGS LAND ON CHANNELS YOU'VE UNLOCKED · STATION INVITATIONS ON LOCKED CHANNELS ARE HELD WARM · NOTIFICATIONS FIRE ONLY WHEN A REAL OFFER EXISTS
          </p>
        </div>
      </div>

      {activeInterview && (
        <TvInterviewModal
          station={activeInterview}
          questions={interviewQuestions}
          playerCtx={playerCtx}
          onComplete={handleComplete}
          onClose={() => setActiveInterview(null)}
          medium="TV"
        />
      )}
    </div>
  );
};
