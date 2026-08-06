/**
 * HOLLYWOOD RISING - Screen 1: Animated Splash Screen
 * Features: Gold logo animation, particle stars, fade transition, dynamic engaging Hollywood quotes.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Film, Clapperboard } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { StarfieldBackground } from '../common/StarfieldBackground';
import { soundService } from '../../services/soundService';

const ENGAGING_HOLLYWOOD_QUOTES = [
  'Rolling sound, camera speed... and ACTION!',
  'Setting up 70mm IMAX camera rigs on the studio lot...',
  'Pitching high-stakes franchise packages in Burbank...',
  'Securing Sunset Boulevard billboard placements...',
  'Polishing the Oscar statuettes in Hollywood...',
  'Rehearsing dramatic lines with visionary directors...',
  'Preparing the red carpet world premiere in Cannes...',
  'Negotiating A-list backend profit share contracts...',
  'Tuning the Hollywood Box Office Engine...',
  'Assembling the star-studded ensemble cast...',
  'Auditioning on Paramount & Universal soundstages...',
  'Syncing SAG-AFTRA guild residual accounts...',
  'Scouting luxury filming locations in Malibu & London...',
  'Crafting your Hollywood legacy...',
  'Your journey to the Walk of Fame begins now...',
];

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, saveData } = useGame();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    soundService.playGoldChime();

    // Rotate through engaging Hollywood words every 800ms
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ENGAGING_HOLLYWOOD_QUOTES.length);
    }, 800);

    const timer = setTimeout(() => {
      setCurrentScreen('main_menu');
    }, 3400);

    return () => {
      clearInterval(quoteInterval);
      clearTimeout(timer);
    };
  }, [setCurrentScreen]);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-center overflow-hidden select-none">
      <StarfieldBackground />

      {/* Gold Radial Glow behind Logo */}
      <div className="absolute w-80 h-80 rounded-full bg-[#FFCC33]/15 blur-3xl animate-pulse pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center max-w-sm w-full"
      >
        {/* Animated Gold Star Emblem */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="relative mb-6 p-4 rounded-full bg-gradient-to-tr from-[#FFCC33]/20 to-[#9955FF]/20 border border-[#FFCC33]/40 shadow-[0_0_35px_rgba(255,204,51,0.35)]"
        >
          <Star className="w-16 h-16 text-[#FFCC33] fill-[#FFCC33]" />
          <Sparkles className="w-6 h-6 text-[#9955FF] absolute top-1 right-1 animate-ping" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ letterSpacing: '0.1em' }}
          animate={{ letterSpacing: '0.22em' }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="text-3xl sm:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC33] via-[#FFE082] to-[#FF9900] drop-shadow-[0_4px_16px_rgba(255,204,51,0.5)] leading-tight"
        >
          HOLLYWOOD RISING
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-2 text-xs sm:text-sm font-black tracking-widest text-[#9955FF] uppercase"
        >
          Your Journey To Stardom
        </motion.p>

        {/* Animated Progress Loader Bar */}
        <div className="mt-10 w-56 h-1.5 bg-[#111122] rounded-full overflow-hidden border border-[#222244]">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3.0, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#FFCC33] via-[#9955FF] to-[#33CC55]"
          />
        </div>

        {/* Engaging Dynamic Hollywood Text */}
        <div className="mt-4 h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-amber-300/90 font-medium tracking-wide flex items-center gap-1.5"
            >
              <Clapperboard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{ENGAGING_HOLLYWOOD_QUOTES[quoteIndex]}</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-[10px] text-gray-500 font-bold tracking-wider uppercase">
        Hollywood Rising Studios • Phase 1
      </div>
    </div>
  );
};
