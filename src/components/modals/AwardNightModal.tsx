/**
 * HOLLYWOOD RISING - Year-End Awards Night Cinematic Modal
 * The show: Welcome → Category → 11 nominees light up → Envelope → Winner → next… → Finale.
 * Full autoplay mode + Skip-to-results. Real nominees, real winners, real rewards.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Trophy, Crown, SkipForward, Play, Sparkles, X } from 'lucide-react';
import { ParticleOverlay } from '../common/ParticleOverlay';
import { soundService } from '../../services/soundService';
import { AwardCeremonyResult, AwardCategoryResult } from '../../types/game';

interface AwardNightModalProps {
  data: AwardCeremonyResult;
  onClose: () => void;
}

type Phase = 'WELCOME' | 'CATEGORY' | 'NOMINEES' | 'ENVELOPE' | 'WINNER' | 'FINALE';

const AUTO_DELAY = 3200; // autoplay pacing

export const AwardNightModal: React.FC<AwardNightModalProps> = ({ data, onClose }) => {
  const [phase, setPhase] = useState<Phase>('WELCOME');
  const [catIdx, setCatIdx] = useState(0);
  const [litNominees, setLitNominees] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<number | null>(null);

  const categories: AwardCategoryResult[] = data.categories || [];
  const current = categories[catIdx];

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    soundService.playMusicTrack('awards');
    soundService.playFanfare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Autoplay driver
  useEffect(() => {
    clearTimer();
    if (!autoplay) return;

    if (phase === 'WELCOME') {
      timerRef.current = window.setTimeout(() => {
        setPhase('CATEGORY');
        soundService.playGoldChime();
      }, 2600);
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
        }, 320);
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
        if (catIdx + 1 < categories.length) {
          setCatIdx((i) => i + 1);
          setPhase('CATEGORY');
          soundService.playGoldChime();
        } else {
          setPhase('FINALE');
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

  const skipToResults = () => {
    clearTimer();
    setAutoplay(false);
    setPhase('FINALE');
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
      if (catIdx + 1 < categories.length) {
        setCatIdx((i) => i + 1);
        setPhase('CATEGORY');
      } else {
        setPhase('FINALE');
        soundService.playFanfare();
      }
    }
  };

  if (!current && phase !== 'WELCOME' && phase !== 'FINALE') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
        <div className="text-white text-center space-y-4">
          <Crown className="w-14 h-14 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-black uppercase">Ceremony Complete</h2>
          <button onClick={onClose} className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-black cursor-pointer">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none overflow-hidden">
      {/* Background Stage Light Sweeps */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-[600px] bg-gradient-to-b from-amber-400/25 via-yellow-500/5 to-transparent blur-3xl transform -rotate-12 animate-pulse" />
        <div className="absolute -top-32 right-1/4 w-96 h-[600px] bg-gradient-to-b from-amber-400/25 via-yellow-500/5 to-transparent blur-3xl transform rotate-12 animate-pulse" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-amber-500/10 to-transparent blur-2xl" />
      </div>

      {/* Confetti for player wins / finale */}
      {(phase === 'WINNER' && current?.playerWon) || phase === 'FINALE' ? (
        <ParticleOverlay type="award_gold" active count={40} durationMs={0} />
      ) : phase === 'NOMINEES' ? (
        <ParticleOverlay type="flashes" active count={20} durationMs={0} />
      ) : null}

      {/* Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {autoplay ? (
          <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-gray-400 flex items-center gap-1.5">
            <Play className="w-3 h-3 text-emerald-400" /> AUTO
          </span>
        ) : (
          <button
            onClick={nextManual}
            className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-white hover:bg-white/10 cursor-pointer"
          >
            ▶ NEXT
          </button>
        )}
        <button
          onClick={skipToResults}
          className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-gray-300 hover:text-amber-300 cursor-pointer flex items-center gap-1.5"
        >
          <SkipForward className="w-3 h-3" /> SKIP TO RESULTS
        </button>
      </div>

      <motion.div
        key={phase + catIdx}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#1C1608] via-[#0D0B05] to-[#000000] border-2 border-amber-400/60 rounded-3xl p-5 sm:p-7 text-white shadow-[0_0_100px_rgba(251,191,36,0.25)] relative z-10 flex flex-col items-center text-center overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Header Ribbon */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-500/30 border border-amber-400/50 mb-3 shadow-lg">
          <Crown className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-black tracking-widest text-amber-200 uppercase">
            {data.year} {data.eventName}
          </span>
        </div>
        <p className="text-[10px] text-amber-300/80 font-semibold mb-4">
          Live from {data.venue} · Hosted by {data.host}
        </p>

        {/* WELCOME */}
        {phase === 'WELCOME' && (
          <div className="py-10 space-y-5 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Trophy className="w-20 h-20 text-amber-400 mx-auto animate-pulse" />
            </motion.div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
              Welcome to the {data.year} {data.eventName}!
            </h1>
            <p className="text-xs text-gray-300">
              {data.playerEligible
                ? `${data.categories.length} categories. ${data.playerWins} win(s) and ${data.playerNominations} nomination(s) for you tonight.`
                : `You're watching from the audience this year — ${data.categories.length} categories of Hollywood's finest.`}
            </p>
            <p className="text-[10px] text-gray-500">Autoplay is on. Sit back and enjoy the show, or skip to results.</p>
          </div>
        )}

        {/* CATEGORY */}
        {phase === 'CATEGORY' && current && (
          <div className="py-12 space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Category {catIdx + 1} of {categories.length}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 tracking-wider">
              {current.category}
            </h2>
            <p className="text-xs text-amber-300/70">And the nominees are…</p>
          </div>
        )}

        {/* NOMINEES */}
        {phase === 'NOMINEES' && current && (
          <div className="w-full space-y-5">
            <h2 className="text-lg sm:text-2xl font-black text-amber-200 tracking-wide">{current.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {current.nominees.slice(0, 11).map((nom, idx) => {
                const lit = idx < litNominees;
                const isWinnerNom = revealed && nom.isPlayer === current.winner.isPlayer && nom.movieTitle === current.winner.movieTitle;
                return (
                  <motion.div
                    key={`${nom.name}_${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={lit ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-2xl border flex items-center gap-3 ${
                      nom.isPlayer
                        ? 'bg-amber-500/15 border-amber-400/60 shadow-lg shadow-amber-500/10'
                        : lit
                        ? 'bg-white/5 border-white/15'
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <img src={nom.avatarUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className={`font-black truncate ${nom.isPlayer ? 'text-amber-300' : 'text-gray-200'}`}>
                        {nom.name} {nom.isPlayer && <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500 text-black ml-1">YOU</span>}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">"{nom.movieTitle}" · {nom.score}/100</p>
                    </div>
                    {lit && nom.isPlayer && <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />}
                    {revealed && isWinnerNom && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
                  </motion.div>
                );
              })}
            </div>
            {!revealed && (
              <p className="text-[10px] text-gray-500 animate-pulse">Lighting up the nominee cards…</p>
            )}
          </div>
        )}

        {/* ENVELOPE */}
        {phase === 'ENVELOPE' && current && (
          <div className="py-14 space-y-4">
            <motion.div
              animate={{ rotateY: [0, 180, 360], scale: [0.9, 1.1, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="mx-auto w-24 h-16 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border-2 border-amber-200/70 shadow-2xl flex items-center justify-center"
            >
              <Award className="w-8 h-8 text-black" />
            </motion.div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-amber-200 animate-pulse">And the winner is…</h2>
          </div>
        )}

        {/* WINNER */}
        {phase === 'WINNER' && current && (
          <div className="py-10 space-y-5">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="space-y-3"
            >
              <Trophy className={`w-16 h-16 mx-auto ${current.playerWon ? 'text-amber-300' : 'text-gray-400'}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{current.category}</p>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
                {current.winner.name}
              </h2>
              <p className="text-sm text-gray-300">
                for <span className="text-amber-200 font-bold">"{current.winner.movieTitle}"</span>
              </p>
              {current.playerWon ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-black uppercase">
                  🏆 You win! Trophy added to your Trophy Room
                </div>
              ) : (
                <p className="text-[10px] text-gray-500">
                  {current.playerNominated ? 'You were nominated — the competition was fierce this year.' : 'An unforgettable performance by the winner.'}
                </p>
              )}
            </motion.div>
          </div>
        )}

        {/* FINALE */}
        {phase === 'FINALE' && (
          <div className="py-8 space-y-6 w-full">
            <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
              Tonight's Winners
            </h2>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-left">
              {categories.map((c, i) => (
                <div key={i} className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase font-bold truncate">{c.category}</p>
                    <p className={`text-xs font-black truncate ${c.playerWon ? 'text-amber-300' : 'text-gray-200'}`}>
                      {c.winner.name} {c.playerWon && <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500 text-black ml-1">YOU</span>}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">"{c.winner.movieTitle}"</p>
                  </div>
                  {c.playerWon && <Trophy className="w-5 h-5 text-amber-400 shrink-0" />}
                </div>
              ))}
            </div>

            {data.playerEligible ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <p className="font-black uppercase tracking-wider">YOUR NIGHT</p>
                <p>🏆 {data.playerWins} win(s) · ✨ {data.playerNominations} nomination(s) · +{data.fameGained.toLocaleString()} Fame XP</p>
                <p className="text-[10px] text-amber-300/70">
                  {data.playerWins > 0 ? 'Trophies added to your Trophy Room. Hollywood is talking about you!' : 'The press mentions your nomination in every recap. Keep pushing!'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">You watched from the audience — release a movie this year to compete next season.</p>
            )}

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              Close Ceremony
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
