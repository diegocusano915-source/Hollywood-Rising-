/**
 * HOLLYWOOD RISING - TV INTERVIEW SHOW MODAL (Award-Night style)
 * Intro -> up to 5 questions with 3 answer choices -> reactions -> results.
 * Autoplay + SKIP TO RESULTS. All buttons clickable.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Mic, SkipForward, Play, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { ParticleOverlay } from '../common/ParticleOverlay';
import { soundService } from '../../services/soundService';
import { TvQuestion, TvAnswerChoice, TvInterviewResult, TvStation } from '../../types/world';
import { computeInterviewResult } from '../../services/tvInterviewEngine';

interface TvInterviewModalProps {
  station: TvStation;
  questions: TvQuestion[];
  playerCtx: any;
  onComplete: (result: TvInterviewResult, chosen: TvAnswerChoice[]) => void;
  onClose: () => void;
}

type Phase = 'INTRO' | 'QUESTION' | 'REACTION' | 'RESULTS';

export const TvInterviewModal: React.FC<TvInterviewModalProps> = ({ station, questions, playerCtx, onComplete, onClose }) => {
  const [phase, setPhase] = useState<Phase>('INTRO');
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState<TvAnswerChoice[]>([]);
  const [lastReaction, setLastReaction] = useState('');
  const [autoplay, setAutoplay] = useState(true);
  const [result, setResult] = useState<TvInterviewResult | null>(null);
  const timerRef = useRef<number | null>(null);

  const currentQ = questions[qIdx];
  const isLast = qIdx >= questions.length - 1;

  const clearTimer = () => { if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    soundService.playMusicTrack('premiere');
    soundService.playFanfare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoplay driver
  useEffect(() => {
    clearTimer();
    if (!autoplay) return;
    if (phase === 'INTRO') {
      timerRef.current = window.setTimeout(() => { setPhase('QUESTION'); soundService.playClick(); }, 2600);
    } else if (phase === 'REACTION') {
      timerRef.current = window.setTimeout(() => {
        if (isLast) { finish(); } else { setQIdx((i) => i + 1); setPhase('QUESTION'); soundService.playClick(); }
      }, 2400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, autoplay, qIdx]);

  const pick = (ans: TvAnswerChoice) => {
    const newChosen = [...chosen, ans];
    setChosen(newChosen);
    setLastReaction(ans.crowdReaction);
    soundService.playApplause();
    setPhase('REACTION');
  };

  const finish = () => {
    const res = computeResult();
    setResult(res);
    setPhase('RESULTS');
    soundService.playAwardWon();
  };

  const computeResult = (): TvInterviewResult => {
    return computeInterviewResult(
      playerCtx,
      station,
      questions,
      chosen
    ) as TvInterviewResult;
  };

  const skipToResults = () => {
    clearTimer();
    setAutoplay(false);
    // Simulate choosing the humble answer for each unanswered question (safe, real rewards)
    const rest = questions.slice(chosen.length).map((q) => q.answers[0]);
    const fullChosen = [...chosen, ...rest];
    setChosen(fullChosen);
    const res = computeResult();
    setResult(res);
    setPhase('RESULTS');
    soundService.playFanfare();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none overflow-hidden">
      {/* Stage lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-[600px] bg-gradient-to-b from-sky-500/25 via-blue-500/5 to-transparent blur-3xl -rotate-12 animate-pulse" />
        <div className="absolute -top-32 right-1/4 w-96 h-[600px] bg-gradient-to-b from-sky-500/25 via-blue-500/5 to-transparent blur-3xl rotate-12 animate-pulse" />
      </div>
      {(phase === 'RESULTS') && <ParticleOverlay type="award_gold" active count={30} durationMs={0} />}

      {/* Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {autoplay && phase !== 'RESULTS' ? (
          <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-gray-400 flex items-center gap-1.5"><Play className="w-3 h-3 text-emerald-400" /> AUTO</span>
        ) : phase !== 'RESULTS' ? (
          <button onClick={() => { clearTimer(); if (phase === 'QUESTION') { /* wait for pick */ } }} className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-white cursor-pointer">▶ NEXT</button>
        ) : null}
        {phase !== 'RESULTS' && (
          <button onClick={skipToResults} className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-gray-300 hover:text-amber-300 cursor-pointer flex items-center gap-1.5">
            <SkipForward className="w-3 h-3" /> SKIP TO RESULTS
          </button>
        )}
      </div>

      <motion.div
        key={phase + qIdx}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#0A1628] via-[#0B0B14] to-[#000000] border-2 border-sky-400/60 rounded-3xl p-5 sm:p-7 text-white shadow-[0_0_100px_rgba(56,189,248,0.2)] relative z-10 flex flex-col items-center text-center overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500/30 via-blue-400/40 to-sky-500/30 border border-sky-400/50 mb-3 shadow-lg">
          <Tv className="w-4 h-4 text-sky-300" />
          <span className="text-xs font-black tracking-widest text-sky-200 uppercase">{station.showName || station.name}</span>
        </div>
        <p className="text-[10px] text-sky-300/80 font-semibold mb-4">Hosted by {station.host} · {station.viewerReach}</p>

        {/* INTRO */}
        {phase === 'INTRO' && (
          <div className="py-10 space-y-4 text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
              <Mic className="w-20 h-20 text-sky-400 mx-auto animate-pulse" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-300 to-sky-400">
              {station.name} Interview
            </h1>
            <p className="text-xs text-gray-300">"Welcome back to the show — tonight's guest is making waves in Hollywood!"</p>
            <p className="text-[10px] text-gray-500">Up to {questions.length} questions · 3 answers each · autoplay on</p>
          </div>
        )}

        {/* QUESTION */}
        {phase === 'QUESTION' && currentQ && (
          <div className="w-full space-y-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Question {qIdx + 1} of {questions.length}</p>
            <h2 className="text-lg sm:text-xl font-black text-sky-100 leading-snug">{currentQ.question}</h2>
            <div className="space-y-2.5">
              {currentQ.answers.map((ans, i) => (
                <button
                  key={i}
                  onClick={() => pick(ans)}
                  className="w-full text-left p-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-sky-500/20 hover:border-sky-400/60 transition-all cursor-pointer"
                >
                  <span className="text-[9px] font-black uppercase tracking-wider text-sky-300 block mb-0.5">
                    {ans.style === 'WITTY' ? '😏 Witty' : ans.style === 'HUMBLE' ? '🙏 Humble' : '🔥 Controversial'}
                  </span>
                  <span className="text-xs text-gray-100">{ans.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* REACTION */}
        {phase === 'REACTION' && (
          <div className="py-12 space-y-4 text-center">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm text-gray-200 italic">"{lastReaction}"</p>
            <p className="text-[10px] text-gray-500">{isLast ? 'That was the last question — wrapping up!' : 'Moving to the next question...'}</p>
          </div>
        )}

        {/* RESULTS */}
        {phase === 'RESULTS' && result && (
          <div className="w-full space-y-4">
            <h2 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-300 to-sky-300">
              Interview Complete
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
                <span className="text-[9px] text-gray-400 uppercase block font-bold">Appearance Fee</span>
                <span className="text-sm font-black text-emerald-400">${result.cashEarned.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
                <span className="text-[9px] text-gray-400 uppercase block font-bold">Fans Gained</span>
                <span className="text-sm font-black text-emerald-300">+{result.fansGained.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30">
                <span className="text-[9px] text-gray-400 uppercase block font-bold">Fame XP</span>
                <span className="text-sm font-black text-amber-300">+{result.fameXpGained}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[9px] text-gray-400 uppercase block font-bold">Reputation</span>
                <span className={`text-sm font-black ${result.reputationChange >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                  {result.reputationChange >= 0 ? '+' : ''}{result.reputationChange}
                </span>
              </div>
            </div>
            {result.scandalTriggered && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-[11px] font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> One of your answers sparked tabloid attention — check PR Crisis Control.
              </div>
            )}
            <div className="space-y-1.5 text-left">
              <p className="text-[10px] font-black uppercase text-gray-400">Crowd Reactions</p>
              {result.reactions.slice(0, 4).map((r, i) => (
                <p key={i} className="text-[10px] text-gray-400">• {r}</p>
              ))}
            </div>
            <button
              onClick={() => onComplete(result, chosen)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-black font-black text-xs uppercase tracking-wider shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 inline mr-1.5" /> CLAIM REWARDS & EXIT
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
