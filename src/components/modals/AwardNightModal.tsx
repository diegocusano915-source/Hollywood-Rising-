/**
 * HOLLYWOOD RISING - Year-End Awards Night: LIVE BROADCAST
 * A live-TV ceremony experience: blinking LIVE badge, climbing viewer counter,
 * FAN PULSE meter, scrolling fan-reaction chat, broadcast lower-thirds, and a
 * silhouetted crowd that sways through the show and ERUPTS on every win —
 * wildest when YOU win. The finale pays out REAL fans (fame-tier scaled).
 * All names, nominees, winners and payouts come from the real ceremony data.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, SkipForward, Play, Sparkles } from 'lucide-react';
import { ParticleOverlay } from '../common/ParticleOverlay';
import { soundService } from '../../services/soundService';
import { AwardCeremonyResult, AwardCategoryResult } from '../../types/game';

interface AwardNightModalProps {
  data: AwardCeremonyResult;
  onClose: () => void;
}

type Phase = 'WELCOME' | 'CATEGORY' | 'NOMINEES' | 'ENVELOPE' | 'WINNER' | 'FINALE';

const AUTO_DELAY = 3400; // autoplay pacing

interface ChatMsg { id: number; handle: string; text: string; gold?: boolean; }
interface FanBubble { id: number; text: string; left: number; bottom: number; }

const REACTION_POOL = ['BRAVO! 👏', '👑 ROYALTY', 'ENCORE!', '😍 😍 😍', 'DESERVED!!', 'LEGEND!!', 'WE 🖤 YOU', '🔥🔥🔥', 'STANDING OVATION', 'CRYING RN 😭'];
const CHAT_FILLERS = ['who else is watching live??', 'the crowd is SO loud tonight', 'this category is stacked', 'my stream lagged nooo', 'best night in tv this year', 'champagne at the ready 🥂'];

let msgSeq = 1;

export const AwardNightModal: React.FC<AwardNightModalProps> = ({ data, onClose }) => {
  const [phase, setPhase] = useState<Phase>('WELCOME');
  const [catIdx, setCatIdx] = useState(0);
  const [litNominees, setLitNominees] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [hype, setHype] = useState(false);
  const [viewers, setViewers] = useState<number>(data.viewersBase || 2400000);
  const [fanPulse, setFanPulse] = useState(10);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [bubbles, setBubbles] = useState<FanBubble[]>([]);
  const timerRef = useRef<number | null>(null);

  const categories: AwardCategoryResult[] = data.categories || [];
  const current = categories[catIdx];
  const fanPayout = data.fanGained || 0;

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    soundService.playFanfare();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushChat = (text: string, gold = false) => {
    setChat((c) => [
      { id: msgSeq++, handle: `@fan_${Math.floor(1000 + Math.random() * 9000)}`, text, gold },
      ...c.slice(0, 8),
    ]);
  };

  // Silhouetted crowd — two rows of fans with random sway timing
  const crowdFans = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: (i % 11) * 9 + (i > 10 ? 4.5 : 0) + Math.random() * 3,
        bottom: i > 10 ? 42 : 8 + Math.random() * 8,
        scale: i > 10 ? 0.78 : 1,
        delay: Math.random() * 1.4,
        z: i > 10 ? 3 : 5,
      })),
    []
  );

  const spawnBubbles = (count: number) => {
    const spawned: FanBubble[] = Array.from({ length: count }, (_, i) => ({
      id: msgSeq + i + Math.random(),
      text: REACTION_POOL[Math.floor(Math.random() * REACTION_POOL.length)],
      left: 8 + Math.random() * 74,
      bottom: 100 + Math.random() * 46,
    }));
    setBubbles((b) => [...b, ...spawned]);
    window.setTimeout(() => {
      setBubbles((b) => b.filter((x) => !spawned.includes(x)));
    }, 2700);
  };

  // Autoplay driver (phases + sounds) — same show logic as before
  useEffect(() => {
    clearTimer();
    if (!autoplay) return;

    if (phase === 'WELCOME') {
      timerRef.current = window.setTimeout(() => {
        setPhase('CATEGORY');
        soundService.playGoldChime();
      }, 2800);
    } else if (phase === 'CATEGORY') {
      timerRef.current = window.setTimeout(() => {
        setPhase('NOMINEES');
        setLitNominees(0);
        soundService.playCameraFlash();
      }, 2000);
    } else if (phase === 'NOMINEES') {
      if (litNominees < (current?.nominees.length || 0)) {
        timerRef.current = window.setTimeout(() => {
          setLitNominees((n) => n + 1);
          soundService.playClick();
          if (litNominees + 1 >= (current?.nominees.length || 0)) soundService.playCameraFlash();
        }, 300);
      } else {
        timerRef.current = window.setTimeout(() => {
          setPhase('ENVELOPE');
          soundService.playGoldChime();
        }, 1600);
      }
    } else if (phase === 'ENVELOPE') {
      timerRef.current = window.setTimeout(() => {
        setPhase('WINNER');
        setRevealed(true);
        if (current?.playerWon) soundService.playAwardWon();
        else soundService.playApplause();
      }, 2200);
    } else if (phase === 'WINNER') {
      timerRef.current = window.setTimeout(() => {
        setRevealed(false);
        setHype(false);
        if (catIdx + 1 < categories.length) {
          setCatIdx((i) => i + 1);
          setPhase('CATEGORY');
          soundService.playGoldChime();
        } else {
          setPhase('FINALE');
          setHype(true);
          soundService.playFanfare();
        }
      }, AUTO_DELAY);
    } else if (phase === 'FINALE') {
      timerRef.current = window.setTimeout(() => {
        setAutoplay(false);
      }, 20000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, litNominees, autoplay, catIdx]);

  // Crowd + pulse + viewers react to the REAL results
  useEffect(() => {
    if (phase === 'CATEGORY') {
      setFanPulse(12 + catIdx * 5);
      pushChat(`${current?.category ?? 'Next category'} — here we go`);
    } else if (phase === 'NOMINEES') {
      pushChat('nominee cards lighting up…');
    } else if (phase === 'ENVELOPE') {
      pushChat('envelope time 😰');
    } else if (phase === 'WINNER' && current) {
      setHype(true);
      if (current.playerWon) {
        setFanPulse(88 + Math.floor(Math.random() * 10));
        setViewers((v) => Math.floor(v * (1.1 + Math.random() * 0.06)));
        pushChat(`🏆 ${current.winner.name} WON!!! THE ROOM IS ON ITS FEET`, true);
        pushChat('crowd is losing it right now');
        spawnBubbles(8);
      } else {
        setFanPulse(42 + Math.floor(Math.random() * 18));
        setViewers((v) => Math.floor(v * (1.005 + Math.random() * 0.006)));
        pushChat(`${current.winner.name} takes it — "${current.winner.movieTitle}"`);
        pushChat(current.playerNominated ? 'our nominee was SO close 😭' : 'deserved honestly');
        spawnBubbles(4);
      }
    } else if (phase === 'FINALE') {
      setFanPulse(100);
      setViewers((v) => Math.floor(v * 1.08));
      pushChat('GOODNIGHT HOLLYWOOD 🌙', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, catIdx]);

  // Ambient chatter between beats
  useEffect(() => {
    if (phase === 'FINALE') return;
    const iv = window.setInterval(() => pushChat(CHAT_FILLERS[Math.floor(Math.random() * CHAT_FILLERS.length)]), 3400);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === 'FINALE']);

  // Viewers trickle in all night
  useEffect(() => {
    const iv = window.setInterval(() => {
      setViewers((v) => Math.floor(v * (1.002 + Math.random() * 0.004)));
    }, 1300);
    return () => window.clearInterval(iv);
  }, []);

  const skipToResults = () => {
    clearTimer();
    setAutoplay(false);
    setPhase('FINALE');
    setHype(true);
    soundService.playFanfare();
  };

  const nextManual = () => {
    clearTimer();
    setAutoplay(false);
    if (phase === 'WELCOME') setPhase('CATEGORY');
    else if (phase === 'CATEGORY') {
      setPhase('NOMINEES');
      setLitNominees(current?.nominees.length || 0);
    } else if (phase === 'NOMINEES') {
      setLitNominees(current?.nominees.length || 0);
    } else if (phase === 'ENVELOPE') {
      setPhase('WINNER');
      setRevealed(true);
      if (current?.playerWon) soundService.playAwardWon();
      else soundService.playApplause();
    } else if (phase === 'WINNER') {
      setRevealed(false);
      setHype(false);
      if (catIdx + 1 < categories.length) {
        setCatIdx((i) => i + 1);
        setPhase('CATEGORY');
      } else {
        setPhase('FINALE');
        setHype(true);
        soundService.playFanfare();
      }
    }
  };

  if (!current && phase !== 'WELCOME' && phase !== 'FINALE') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
        <div className="text-white text-center space-y-4">
          <Crown className="w-14 h-14 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-black uppercase">Broadcast Ended</h2>
          <button onClick={onClose} className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-black cursor-pointer">
            Close
          </button>
        </div>
      </div>
    );
  }

  const viewersM = (viewers / 1000000).toFixed(1);

  const lowerThird = () => {
    if (phase === 'WELCOME') return { tag: 'ON AIR', title: `${data.year} ${data.eventName}`, sub: `Live from ${data.venue}` };
    if (phase === 'CATEGORY' || phase === 'NOMINEES')
      return { tag: `AWARD ${catIdx + 1} OF ${categories.length}`, title: current?.category || '', sub: 'And the nominees are…' };
    if (phase === 'ENVELOPE') return { tag: `AWARD ${catIdx + 1} OF ${categories.length}`, title: current?.category || '', sub: 'Opening the envelope…' };
    if (phase === 'WINNER' && current)
      return {
        tag: `AWARD ${catIdx + 1} OF ${categories.length}`,
        title: current.winner.name + (current.playerWon ? ' — YOU' : ''),
        sub: `"${current.winner.movieTitle}"${current.playerWon ? ' · THE ROOM IS ON ITS FEET' : ''}`,
      };
    return { tag: 'FINALE', title: 'Goodnight Hollywood', sub: 'Fans are joining by the minute…' };
  };
  const l3 = lowerThird();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none overflow-hidden">
      {/* ============ THE BROADCAST FRAME ============ */}
      <div className="relative w-full max-w-3xl h-[94vh] max-h-[880px] rounded-3xl overflow-hidden border border-white/15 bg-[#0a080f] shadow-[0_0_120px_rgba(255,200,60,0.18)]">
        {/* Stage backdrop */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 28%, #241a33 0%, #0d0a14 62%, #050408 100%)' }} />
        <div className="absolute top-[-160px] left-[12%] w-72 h-[480px] bg-gradient-to-b from-amber-400/20 to-transparent blur-3xl -rotate-12 animate-pulse pointer-events-none" />
        <div className="absolute top-[-160px] right-[12%] w-72 h-[480px] bg-gradient-to-b from-fuchsia-400/15 to-transparent blur-3xl rotate-12 animate-pulse pointer-events-none" />

        {/* TOPBAR: LIVE badge + climbing viewer counter */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/90 text-[9px] font-black tracking-[2px] text-white">
              <span className={`w-2 h-2 rounded-full bg-white ${phase !== 'FINALE' ? 'animate-pulse' : ''}`} />
              LIVE
            </span>
            <span className="text-[9px] font-black tracking-[2px] text-amber-200/90 uppercase hidden sm:inline">
              {data.year} {data.eventName}
            </span>
          </div>
          <div className="text-[10px] text-gray-300 font-bold">
            <span className="text-emerald-400 font-black">{viewersM}M</span> watching
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-12 right-3 z-30 flex items-center gap-1.5">
          {autoplay ? (
            <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[9px] font-black text-gray-400 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 text-emerald-400" /> AUTO
            </span>
          ) : (
            <button
              onClick={nextManual}
              className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[9px] font-black text-white hover:bg-white/10 cursor-pointer"
            >
              ▶ NEXT
            </button>
          )}
          <button
            onClick={skipToResults}
            className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[9px] font-black text-gray-300 hover:text-amber-300 cursor-pointer flex items-center gap-1"
          >
            <SkipForward className="w-2.5 h-2.5" /> SKIP
          </button>
        </div>

        {/* FAN PULSE meter */}
        <div className="absolute left-3 top-16 z-20 w-20">
          <p className="text-[7px] font-black tracking-[2px] text-gray-400 mb-1">FAN PULSE</p>
          <div className="h-2 rounded-full bg-white/10 border border-white/15 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${fanPulse}%`, background: 'linear-gradient(90deg,#ff5d47,#ffd700)' }}
            />
          </div>
          <p className="text-[8px] font-black text-amber-300 mt-0.5">{fanPulse}%</p>
        </div>

        {/* LIVE FAN CHAT — dims while nominees are on screen */}
        <div
          className={`absolute right-2 top-24 bottom-44 z-20 w-32 sm:w-36 flex flex-col gap-1 overflow-hidden transition-opacity duration-300 ${
            phase === 'NOMINEES' ? 'opacity-30' : 'opacity-100'
          }`}
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <AnimatePresence initial={false}>
            {chat.map((m) => (
              <motion.div
                key={m.id}
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`rounded-xl px-2 py-1.5 text-left border ${
                  m.gold ? 'bg-amber-500/20 border-amber-400/50' : 'bg-black/60 border-white/10'
                }`}
              >
                <p className={`text-[8px] font-black ${m.gold ? 'text-amber-300' : 'text-gray-500'}`}>{m.handle}</p>
                <p className="text-[9px] leading-tight text-gray-200 line-clamp-2">{m.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating crowd reactions */}
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.span
              key={b.id}
              initial={{ y: 0, opacity: 0, scale: 0.7 }}
              animate={{ y: -180, opacity: [0, 1, 1, 0], scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.6, ease: 'easeOut' }}
              className="absolute z-20 text-[10px] font-black px-2 py-1 rounded-full bg-black/70 border border-amber-400/40 text-amber-100 whitespace-nowrap pointer-events-none"
              style={{ left: `${b.left}%`, bottom: `${b.bottom}px` }}
            >
              {b.text}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Confetti / camera flashes */}
        {(phase === 'WINNER' && current?.playerWon) || phase === 'FINALE' ? (
          <ParticleOverlay type="award_gold" active count={40} durationMs={0} />
        ) : phase === 'NOMINEES' ? (
          <ParticleOverlay type="flashes" active count={18} durationMs={0} />
        ) : null}

        {/* ============ STAGE CONTENT ============ */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pb-44 pt-20 overflow-y-auto">
          {/* WELCOME */}
          {phase === 'WELCOME' && (
            <div className="space-y-4">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
                <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
                Live from {data.venue}
              </h1>
              <p className="text-[11px] text-gray-300">
                Hosted by {data.host} · {categories.length} categories tonight
              </p>
              <p className="text-[11px] text-amber-200/90 font-bold">
                {data.playerEligible
                  ? data.playerNominations > 0
                    ? `You're nominated in ${data.playerNominations} categor${data.playerNominations === 1 ? 'y' : 'ies'} — the crowd knows your name.`
                    : "Your films are in contention tonight — the academy is watching."
                  : "You're watching from the audience this year — release a movie to compete next season."}
              </p>
              <p className="text-[9px] text-gray-500">Autoplay is on. Enjoy the broadcast, or skip to results.</p>
            </div>
          )}

          {/* CATEGORY */}
          {phase === 'CATEGORY' && current && (
            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-400">
                Award {catIdx + 1} of {categories.length}
              </p>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
                {current.category}
              </h2>
              <p className="text-[11px] text-amber-300/70">And the nominees are…</p>
            </div>
          )}

          {/* NOMINEES */}
          {phase === 'NOMINEES' && current && (
            <div className="w-full max-w-md space-y-2">
              <h2 className="text-sm font-black text-amber-200 tracking-wide">{current.category}</h2>
              <div className="grid grid-cols-1 gap-1.5 pr-0 sm:pr-20">
                {current.nominees.slice(0, 11).map((nom, idx) => {
                  const lit = idx < litNominees;
                  const isWinnerNom = revealed && nom.isPlayer === current.winner.isPlayer && nom.movieTitle === current.winner.movieTitle;
                  return (
                    <motion.div
                      key={`${nom.name}_${idx}`}
                      initial={{ opacity: 0.15, y: 8 }}
                      animate={lit ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-2 rounded-xl border flex items-center gap-2.5 text-left ${
                        isWinnerNom
                          ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20'
                          : nom.isPlayer
                          ? 'bg-amber-500/10 border-amber-400/60'
                          : lit
                          ? 'bg-white/5 border-white/15'
                          : 'bg-black/40 border-white/5'
                      }`}
                    >
                      <img src={nom.avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className={`text-[11px] font-black truncate ${nom.isPlayer ? 'text-amber-300' : 'text-gray-200'}`}>
                          {nom.name}
                          {nom.isPlayer && <span className="text-[7px] px-1 py-0.5 rounded bg-amber-500 text-black ml-1 align-middle">YOU</span>}
                        </p>
                        <p className="text-[9px] text-gray-400 truncate">"{nom.movieTitle}" · {nom.score}/100</p>
                      </div>
                      {lit && nom.isPlayer && <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                      {isWinnerNom && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ENVELOPE */}
          {phase === 'ENVELOPE' && current && (
            <div className="space-y-4">
              <motion.div
                animate={{ rotateY: [0, 180, 360], scale: [0.9, 1.1, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="mx-auto w-24 h-16 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border-2 border-amber-200/70 shadow-2xl flex items-center justify-center"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-red-900 border-2 border-amber-200 flex items-center justify-center text-[12px]">🏆</span>
              </motion.div>
              <h2 className="text-lg font-black uppercase tracking-[3px] text-amber-200 animate-pulse">And the winner is…</h2>
            </div>
          )}

          {/* WINNER */}
          {phase === 'WINNER' && current && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="space-y-3"
            >
              <Trophy className={`w-14 h-14 mx-auto ${current.playerWon ? 'text-amber-300' : 'text-gray-400'}`} />
              <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-400">{current.category}</p>
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
                {current.winner.name}
              </h2>
              <p className="text-xs text-gray-300">
                for <span className="text-amber-200 font-bold">"{current.winner.movieTitle}"</span>
              </p>
              {current.playerWon ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[11px] font-black uppercase tracking-wider">
                  🏆 You win — standing ovation!
                </div>
              ) : (
                <p className="text-[10px] text-gray-500">
                  {current.playerNominated ? 'You were nominated — the competition was fierce this year.' : 'An unforgettable performance by the winner.'}
                </p>
              )}
            </motion.div>
          )}

          {/* FINALE */}
          {phase === 'FINALE' && (
            <div className="w-full max-w-md space-y-3">
              <h2 className="text-lg font-black uppercase tracking-[2px] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
                Tonight's Winners
              </h2>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-left">
                {categories.map((c, i) => (
                  <div key={i} className="p-2 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[8px] text-gray-400 uppercase font-bold truncate">{c.category}</p>
                      <p className={`text-[11px] font-black truncate ${c.playerWon ? 'text-amber-300' : 'text-gray-200'}`}>
                        {c.winner.name} {c.playerWon && <span className="text-[7px] px-1 py-0.5 rounded bg-amber-500 text-black ml-1">YOU</span>}
                      </p>
                    </div>
                    {c.playerWon && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
                  </div>
                ))}
              </div>

              {data.playerEligible && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 space-y-0.5 text-left">
                  <p className="font-black uppercase tracking-wider text-[10px]">Your night</p>
                  <p>🏆 {data.playerWins} win(s) · ✨ {data.playerNominations} nomination(s) · +{data.fameGained.toLocaleString()} Fame XP</p>
                </div>
              )}

              {/* REAL fan payout — computed by the awards engine from your fame tier */}
              {fanPayout > 0 && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/50"
                  style={{ animation: 'pulse 1.6s infinite' }}
                >
                  <span className="text-2xl">🎉</span>
                  <div className="text-left">
                    <p className="text-lg font-black text-emerald-300 leading-tight">+{fanPayout.toLocaleString()} FANS</p>
                    <p className="text-[9px] text-emerald-200/80">
                      joined overnight · {data.playerWins} win{data.playerWins === 1 ? '' : 's'} + {data.playerNominations} nomination{data.playerNominations === 1 ? '' : 's'}
                    </p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-black font-black text-[11px] uppercase tracking-wider shadow-2xl hover:scale-105 transition-all cursor-pointer"
              >
                Close Broadcast
              </button>
            </div>
          )}
        </div>

        {/* LOWER THIRD — broadcast graphics */}
        <div className="absolute left-3 right-3 bottom-[124px] z-20 text-left pointer-events-none">
          <span className="inline-block bg-amber-400 text-black text-[8px] font-black tracking-[2px] px-2 py-0.5 rounded-t-md">
            {l3.tag}
          </span>
          <div className="bg-black/80 backdrop-blur-sm border-l-4 border-amber-400 rounded-r-xl rounded-bl-xl px-3 py-1.5 max-w-[75%]">
            <p className="text-[12px] font-black text-white truncate">{l3.title}</p>
            <p className="text-[9px] text-gray-400 truncate">{l3.sub}</p>
          </div>
        </div>

        {/* Crowd glow + silhouetted audience */}
        <div
          className="absolute left-0 right-0 bottom-0 h-32 pointer-events-none transition-opacity duration-500 z-[11]"
          style={{ background: 'linear-gradient(to top, rgba(255,190,50,0.30), transparent)', opacity: hype ? 1 : 0.45 }}
        />
        <div className="absolute left-0 right-0 bottom-0 h-[118px] z-[12] pointer-events-none overflow-hidden">
          {crowdFans.map((f) => (
            <motion.div
              key={f.id}
              className="absolute"
              style={{ left: `${f.left}%`, bottom: `${f.bottom}px`, zIndex: f.z, transform: `scale(${f.scale})` }}
              animate={{ y: hype ? [0, -15, 0] : [0, -5, 0], scale: hype ? [1, 1.07, 1] : 1 }}
              transition={{ duration: hype ? 0.5 : 1.7, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}
            >
              <div className="w-[15px] h-[15px] rounded-full bg-[#05050a] mx-auto" />
              <div className="w-[28px] h-[32px] rounded-t-[13px] rounded-b-none bg-[#05050a] mx-auto -mt-0.5" />
            </motion.div>
          ))}
        </div>

        {/* Broadcast scanlines */}
        <div
          className="absolute inset-0 z-[25] pointer-events-none opacity-[0.13]"
          style={{ background: 'repeating-linear-gradient(to bottom, transparent 0 3px, #000 3px 4px)' }}
        />
      </div>
    </div>
  );
};
