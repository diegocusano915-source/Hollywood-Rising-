/**
 * HOLLYWOOD RISING - Award Ceremony Cinematic Modal
 * Golden Stage Lights, Applause, Spotlights, Confetti Particles, Acceptance Speech & Trophy Presentation.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Trophy, Sparkles, Camera, Heart, CheckCircle2, Volume2, Mic, Crown, X } from 'lucide-react';
import { ParticleOverlay } from '../common/ParticleOverlay';
import { soundService } from '../../services/soundService';

interface AwardCeremonyCinematicModalProps {
  eventName: string;
  categoryName: string;
  isWinner: boolean;
  movieTitle?: string;
  nominees?: string[];
  winnerName?: string;
  onClose: () => void;
}

export const AwardCeremonyCinematicModal: React.FC<AwardCeremonyCinematicModalProps> = ({
  eventName,
  categoryName,
  isWinner,
  movieTitle = 'Blockbuster Feature',
  nominees = ['Leonardo DiCaprio', 'Zendaya', 'Timothée Chalamet', 'Margot Robbie'],
  winnerName,
  onClose,
}) => {
  const [phase, setPhase] = useState<'NOMINEES' | 'ENVELOPE' | 'WINNER_ANNOUNCED' | 'SPEECH'>('NOMINEES');
  const [speechText, setSpeechText] = useState('');

  useEffect(() => {
    // Play camera flashes & applause sound on mount
    soundService.playMusicTrack('awards');
    soundService.playCameraFlash();
    soundService.playApplause();
  }, []);

  const handleOpenEnvelope = () => {
    soundService.playGoldChime();
    setPhase('ENVELOPE');
    setTimeout(() => {
      if (isWinner) {
        soundService.playAwardWon();
      } else {
        soundService.playApplause();
      }
      setPhase('WINNER_ANNOUNCED');
    }, 1800);
  };

  const handleSpeechFinish = () => {
    soundService.playGoldChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none overflow-hidden">
      {/* Background Stage Light Sweeps */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-96 h-[600px] bg-gradient-to-b from-amber-400/20 via-yellow-500/5 to-transparent blur-3xl transform -rotate-12 animate-pulse" />
        <div className="absolute -top-32 right-1/4 w-96 h-[600px] bg-gradient-to-b from-amber-400/20 via-yellow-500/5 to-transparent blur-3xl transform rotate-12 animate-pulse" />
      </div>

      {/* Particle Effects (Camera Flashes & Gold Particles) */}
      <ParticleOverlay type={isWinner ? 'award_gold' : 'flashes'} active count={30} durationMs={0} />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-2xl bg-gradient-to-b from-[#1C1608] via-[#0D0B05] to-[#000000] border-2 border-amber-400/60 rounded-3xl p-7 text-white shadow-[0_0_100px_rgba(251,191,36,0.25)] relative z-10 flex flex-col items-center text-center overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-500/30 border border-amber-400/50 mb-3 shadow-lg">
          <Crown className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-black tracking-widest text-amber-200 uppercase">
            {eventName}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 tracking-wider mb-1">
          {categoryName}
        </h2>
        <p className="text-xs text-amber-300/80 font-semibold mb-6">Live From The Dolby Theatre, Hollywood</p>

        {/* NOMINEES PHASE */}
        {phase === 'NOMINEES' && (
          <div className="w-full space-y-5">
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-left">
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest block mb-2">
                OFFICIAL NOMINEES
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {nominees.map((nom, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-gray-200 truncate">{nom}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleOpenEnvelope}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-black font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>And The Winner Is... (Open Envelope)</span>
            </button>
          </div>
        )}

        {/* ENVELOPE OPENING PHASE */}
        {phase === 'ENVELOPE' && (
          <div className="py-12 space-y-4">
            <motion.div
              animate={{ rotateY: [0, 180, 360], scale: [0.9, 1.1, 1] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.6)]"
            >
              <Award className="w-12 h-12 text-black" />
            </motion.div>
            <p className="text-sm font-black text-amber-300 uppercase tracking-widest animate-pulse">
              Unsealing Golden Envelope...
            </p>
          </div>
        )}

        {/* WINNER ANNOUNCED PHASE */}
        {phase === 'WINNER_ANNOUNCED' && (
          <div className="w-full space-y-6">
            {isWinner ? (
              <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/20 via-black/80 to-amber-500/10 border-2 border-amber-400 space-y-3 relative overflow-hidden shadow-2xl">
                <div className="w-20 h-20 rounded-2xl bg-amber-400 text-black mx-auto flex items-center justify-center shadow-2xl border-2 border-white">
                  <Trophy className="w-12 h-12 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                  🏆 YOU WON THE {eventName.toUpperCase()}!
                </h3>
                <p className="text-sm text-amber-200 font-bold">
                  For Your Outstanding Performance in <span className="text-white underline">{movieTitle}</span>!
                </p>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>+5,000 Fame XP • +100 Industry Prestige</span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-black/80 border border-white/20 space-y-3">
                <Award className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-xl font-black text-white">Winner Announced</h3>
                <p className="text-sm text-gray-300">
                  <strong className="text-amber-300">{winnerName || nominees[0]}</strong> accepts the {eventName} for Best Lead Performance.
                </p>
                <p className="text-xs text-gray-400 italic">"Being nominated among such incredible artists is a triumph in itself."</p>
              </div>
            )}

            <div className="flex justify-center gap-3">
              {isWinner ? (
                <button
                  onClick={() => setPhase('SPEECH')}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Deliver Acceptance Speech</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close Ceremony
                </button>
              )}
            </div>
          </div>
        )}

        {/* SPEECH PHASE */}
        {phase === 'SPEECH' && (
          <div className="w-full space-y-4">
            <div className="p-4 rounded-2xl bg-black/80 border border-amber-400/40 text-left space-y-2">
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                <Mic className="w-4 h-4" /> Acceptance Speech at the Podium
              </span>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Thank the Academy, director, cast, fans, and studio..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <button
              onClick={handleSpeechFinish}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-300 text-black font-black text-xs uppercase tracking-wider shadow-xl hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Step Down with Trophy (Standing Ovation)</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
