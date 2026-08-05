/**
 * HOLLYWOOD RISING - Processing Week Overlay & Loading Experience
 * Premium animated overlay with Hollywood quotes, movie trivia, career tips & ProPredict Analytics™.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Film, Award, TrendingUp, Lightbulb, Quote } from 'lucide-react';

const MESSAGES = [
  'Processing Calendar Week...',
  'Updating ProPredict Analytics™...',
  'Calculating Global Box Office...',
  'Processing SAG-AFTRA Residuals...',
  'Simulating Rival NPC Careers...',
  'Preparing Weekly Hollywood Recap...',
];

const TRIVIA_AND_QUOTES = [
  {
    type: 'Hollywood Quote',
    icon: Quote,
    color: 'text-amber-400',
    content: '"To make a great film you need three things – the script, the script and the script." – Alfred Hitchcock',
  },
  {
    type: 'Movie Trivia',
    icon: Film,
    color: 'text-sky-400',
    content: 'The Oscar statuette weighs 8.5 pounds and is electroplated in 24-karat gold.',
  },
  {
    type: 'Career Tip',
    icon: Lightbulb,
    color: 'text-emerald-400',
    content: 'Joining SAG-AFTRA requires 3 union-eligible roles or a Taft-Hartley waiver, unlocking studio feature films.',
  },
  {
    type: 'Industry Fact',
    icon: TrendingUp,
    color: 'text-purple-400',
    content: 'Opening weekend accounts for up to 40% of a studio blockbuster\'s total domestic theatrical revenue.',
  },
  {
    type: 'Hollywood Quote',
    icon: Quote,
    color: 'text-amber-400',
    content: '"Act well your part; there all the honor lies." – Alexander Pope',
  },
  {
    type: 'Career Tip',
    icon: Lightbulb,
    color: 'text-emerald-400',
    content: 'Signing with A-list talent agencies lowers commission rates and grants early access to priority auditions.',
  },
  {
    type: 'Movie Trivia',
    icon: Film,
    color: 'text-sky-400',
    content: 'The Cannes Film Festival Palme d\'Or is crafted by hand in Geneva out of 118 grams of ethical yellow gold.',
  },
  {
    type: 'Industry Fact',
    icon: Award,
    color: 'text-yellow-400',
    content: 'For Your Consideration (FYC) trade advertising campaigns significantly boost Academy voter visibility.',
  },
];

export const ProcessingWeekOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);

  useEffect(() => {
    // Select random trivia on mount
    setTriviaIndex(Math.floor(Math.random() * TRIVIA_AND_QUOTES.length));

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, 320);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / MESSAGES.length) * 100));
  const currentTrivia = TRIVIA_AND_QUOTES[triviaIndex];
  const TriviaIcon = currentTrivia.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-xl flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0D0D18] border border-amber-400/40 rounded-3xl p-7 text-center flex flex-col items-center shadow-[0_0_90px_rgba(251,191,36,0.25)] relative overflow-hidden"
      >
        {/* Glow Background Accents */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Gold Logo Ring */}
        <div className="relative mb-5">
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="absolute -inset-4 rounded-2xl bg-amber-400/25 blur-lg"
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-500 p-0.5 shadow-2xl relative z-10 flex items-center justify-center">
            <div className="w-full h-full bg-[#0D0D18] rounded-[14px] flex items-center justify-center text-amber-400">
              <Film className="w-8 h-8 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>HOLLYWOOD RISING</span>
        </h2>
        <p className="text-[11px] text-amber-300 font-bold uppercase tracking-widest mb-4">
          ADVANCING CALENDAR (+7 DAYS)
        </p>

        {/* Trivia / Tip / Quote Card */}
        <div className="w-full p-3.5 mb-5 rounded-2xl bg-black/60 border border-white/10 text-left relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <TriviaIcon className={`w-4 h-4 ${currentTrivia.color}`} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${currentTrivia.color}`}>
              {currentTrivia.type}
            </span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed font-medium italic">
            {currentTrivia.content}
          </p>
        </div>

        {/* Dynamic Step Message */}
        <div className="h-6 flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs font-bold text-amber-200 tracking-wide flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              {MESSAGES[currentStep]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/80 h-2.5 rounded-full border border-white/10 overflow-hidden relative mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-emerald-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between w-full text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span>ProPredict Analytics™</span>
          <span className="text-amber-400 font-mono font-black">{progressPercent}%</span>
        </div>
      </motion.div>
    </div>
  );
};
