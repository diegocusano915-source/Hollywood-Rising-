/**
 * HOLLYWOOD RISING - THE BOOTH (Radio, Option B rebuild)
 * Podcast-studio aesthetic with live waveform recorder. Every status is
 * REAL: the agent books on stations you've unlocked, producer invitations
 * on locked stations stay visible ("held warm"), and notifications fire
 * only when a real recording slot exists — no ghost notices.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RadioStation } from '../../types/world';
import { INITIAL_RADIO_STATIONS } from '../../database/worldDatabase';
import { buildRadioQuestions, mergeRadioOffersIntoStations, completeRadioOffer } from '../../services/tvInterviewEngine';
import { RepresentationService } from '../../services/representationService';
import { TvInterviewModal } from '../modals/TvInterviewModal';
import { ArrowLeft } from 'lucide-react';

interface RadioStationsViewProps { onBack: () => void; }

const TYPE_COLOR: Record<string, string> = {
  HipHop: '#ff8fa3', Top40: '#cf9df0', Talk: '#f5b942', News: '#5fd6a4',
  International: '#a5b4fc', Morning: '#7ab3ec', Rock: '#f0abfc', Sports: '#5fd6a4',
};

export const RadioStationsView: React.FC<RadioStationsViewProps> = ({ onBack }) => {
  const { player, saveData, updateSave, releasedMovies } = useGame();

  const [stations, setStations] = useState<RadioStation[]>(() => mergeRadioOffersIntoStations(INITIAL_RADIO_STATIONS));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeInterview, setActiveInterview] = useState<RadioStation | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [askedIds, setAskedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('HR_RADIO_ASKED') || '[]'); } catch { return []; }
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
    try { localStorage.setItem('HR_RADIO_ASKED', JSON.stringify(ids)); } catch {}
  };

  const stationReady = (st: RadioStation) => !!st.activeInterviewOffer && st.activeInterviewOffer.status === 'READY';
  const stationLocked = (st: RadioStation) => fame < st.minFame || movies < st.minMovies;

  const launchInterview = (st: RadioStation) => {
    if (!stationReady(st)) return;
    const qs = buildRadioQuestions(playerCtx, st.stationType, askedIds);
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
    completeRadioOffer(activeInterview.id);
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
      `🎙️ Aired on ${result.stationName}: +$${result.cashEarned.toLocaleString()} · +${result.fansGained.toLocaleString()} fans · +${result.fameXpGained} XP` +
      (result.scandalTriggered ? ' · 📰 Soundbite scandal! Check Representation → PR' : '')
    );
    setActiveInterview(null);
    setTimeout(() => setFeedback(null), 6000);
  };

  const readyCount = stations.filter((s) => stationReady(s)).length;
  const pendingCount = stations.filter((s) => s.activeInterviewOffer?.status === 'PENDING').length;

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-3" style={{ backgroundColor: '#070a0d' }}>
      <style>{`@keyframes boothBlink { 50% { opacity: 0.25; } } @keyframes boothWave { from { height: 18%; } to { height: 95%; } }`}</style>

      {/* nav */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="px-4 py-2.5 rounded-xl bg-[#0d1420] border border-[#1c2833] text-gray-300 text-xs font-black flex items-center gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-[#3ddc97]" /> Back to World
        </button>
        <span className="text-[9px] font-black text-[#5b6b7a] tracking-[2px] hidden sm:block">{INITIAL_RADIO_STATIONS.length} STATIONS</span>
      </div>

      {feedback && <div className="p-3 rounded-xl bg-[#3ddc97]/10 border border-[#3ddc97]/40 text-[#5fd6a4] text-[11px] font-bold text-center">{feedback}</div>}

      {/* recorder card */}
      <div className="rounded-2xl border border-[#1c2833] bg-[#0a0f16] p-3.5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5b6e] block" style={{ boxShadow: '0 0 10px #ff5b6e', animation: 'boothBlink 1.1s infinite' }} />
            <b className="text-[11px] tracking-[2px] text-[#ff9daa]">REC QUEUE</b>
          </div>
          <div className="text-right font-mono text-[8px] text-[#6a7a89] leading-relaxed">
            {readyCount} LIVE{readyCount === 1 ? '' : 'S'} · {pendingCount} BOOKED<br />
            EVERY ALERT = REAL RECORDING SLOT
          </div>
        </div>
        {/* waveform */}
        <div className="flex items-center gap-[3px] h-9">
          {Array.from({ length: 36 }).map((_, i) => (
            <i key={i} className="flex-1 rounded-sm" style={{
              background: i % 4 === 0 ? '#2aa876' : '#3ddc97',
              animation: `boothWave 0.8s ease-in-out ${i * 0.05}s infinite alternate`,
              opacity: readyCount > 0 ? 1 : 0.25,
            }} />
          ))}
        </div>
      </div>

      {/* stations */}
      <div className="space-y-2">
        {stations.map((st) => {
          const locked = stationLocked(st);
          const ready = stationReady(st);
          const offer = st.activeInterviewOffer;
          const col = TYPE_COLOR[st.stationType] || '#6a7a89';
          return (
            <div key={st.id} className={`flex gap-2.5 items-center px-3 py-3 rounded-2xl border ${
              ready ? 'border-[#ff5b6e]/50 bg-[#140b0e]' : locked ? 'border-[#1c2833] bg-[#0a0f16] opacity-70' : 'border-[#1c2833] bg-[#0a0f16]'
            }`}>
              <div className="w-11 h-11 rounded-[13px] flex items-center justify-center text-lg shrink-0" style={{ background: '#101826', border: `1px solid ${col}33` }}>
                🎧
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <b className="text-[11.5px] text-gray-100 truncate">{st.name}</b>
                  <span className="text-[6.5px] font-black px-1.5 py-0.5 rounded shrink-0" style={{ background: `${col}18`, color: col }}>{(st.stationType as string).toUpperCase()}</span>
                </div>
                <span className="text-[7.5px] text-[#6a7a89] block truncate font-mono">
                  {st.host} · {st.listeners} · {st.minFame.toLocaleString()} FAME REQ
                </span>
                {locked && offer && offer.status !== 'DONE' && (
                  <span className="text-[6.5px] text-[#7ab3ec] block mt-0.5">
                    ✉ PRODUCER INVITE HELD — unlocks at {st.minFame.toLocaleString()} fame (countdown paused)
                  </span>
                )}
              </div>
              <div className="shrink-0 text-right">
                {ready ? (
                  <button onClick={() => launchInterview(st)}
                    className="text-[8.5px] font-black px-3.5 py-2.5 rounded-[10px] bg-[#ff5b6e] text-white cursor-pointer tracking-wide"
                    style={{ animation: 'boothBlink 1.6s infinite' }}>
                    🎙 RECORD
                  </button>
                ) : offer && offer.status === 'PENDING' ? (
                  <span className="text-[7px] font-black px-2.5 py-1.5 rounded-md bg-[#f5b942]/10 text-[#f5b942] border border-[#f5b942]/30 inline-block">
                    {locked ? 'HOLD' : 'BOOKED'} · {offer.scheduledInWeeks} WK
                  </span>
                ) : offer && offer.status === 'DONE' ? (
                  <span className="text-[7px] font-black px-2.5 py-1.5 rounded-md bg-white/5 text-[#6a7a89] border border-white/10 inline-block">AIRED ✓</span>
                ) : locked ? (
                  <span className="text-[7px] font-black px-2.5 py-1.5 rounded-md bg-white/5 text-[#5b6b7a] border border-dashed border-[#1f2b38] inline-block">🔒</span>
                ) : (
                  <span className="text-[6.5px] text-[#5b6b7a] block max-w-[80px] leading-tight">
                    {player.representation?.agent?.signed ? 'awaiting slot' : 'hire an agent'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-1">
        <p className="text-[7.5px] text-[#5b6b7a] font-mono leading-relaxed">
          AGENT BOOKS ON STATIONS YOU'VE UNLOCKED · PRODUCER INVITES ON LOCKED STATIONS ARE HELD WARM · RADIO ANSWERS USE THEIR OWN ARCHETYPES (DEADPAN / PLAYFUL / CANDID / BLUNT / SINCERE) — NEVER THE TV SET
        </p>
      </div>

      {activeInterview && (
        <TvInterviewModal
          station={activeInterview as any}
          questions={interviewQuestions}
          playerCtx={playerCtx}
          onComplete={handleComplete}
          onClose={() => setActiveInterview(null)}
          medium="RADIO"
        />
      )}
    </div>
  );
};
