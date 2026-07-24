/**
 * HOLLYWOOD RISING - Screen 1: Animated Splash Screen
 * Features: Gold logo animation, particle stars, fade transition, 3-second auto load save.
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { StarfieldBackground } from '../common/StarfieldBackground';
import { soundService } from '../../services/soundService';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, saveData } = useGame();

  useEffect(() => {
    // Play subtle opening chime
    soundService.playGoldChime();

    const timer = setTimeout(() => {
      // Auto load save check
      if (saveData && saveData.player && saveData.player.firstName) {
        setCurrentScreen('main_menu');
      } else {
        setCurrentScreen('main_menu');
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, [setCurrentScreen, saveData]);

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#050510] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <StarfieldBackground />

      {/* Gold Radial Glow behind Logo */}
      <div className="absolute w-72 h-72 rounded-full bg-[#FFCC33]/15 blur-3xl animate-pulse pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Animated Gold Star Emblem */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="relative mb-6 p-4 rounded-full bg-gradient-to-tr from-[#FFCC33]/20 to-[#9955FF]/20 border border-[#FFCC33]/40 shadow-[0_0_30px_rgba(255,204,51,0.3)]"
        >
          <Star className="w-16 h-16 text-[#FFCC33] fill-[#FFCC33]" />
          <Sparkles className="w-6 h-6 text-[#9955FF] absolute top-1 right-1 animate-ping" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ letterSpacing: '0.1em' }}
          animate={{ letterSpacing: '0.25em' }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC33] via-[#FFE082] to-[#FF9900] drop-shadow-[0_4px_12px_rgba(255,204,51,0.5)]"
        >
          HOLLYWOOD RISING
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-3 text-sm sm:text-base font-semibold tracking-widest text-[#9955FF] uppercase"
        >
          Your Journey To Stardom
        </motion.p>

        {/* Animated Progress Loader Bar */}
        <div className="mt-12 w-48 h-1.5 bg-[#111122] rounded-full overflow-hidden border border-[#222244]">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#FFCC33] via-[#9955FF] to-[#33CC55]"
          />
        </div>

        <p className="mt-4 text-xs text-[#999999] tracking-wider animate-pulse">
          Loading Saved SaveData (Hive DB)...
        </p>
      </motion.div>

      {/* Footer copyright */}
      <div className="absolute bottom-6 text-[10px] text-[#999999]/60 tracking-wider uppercase">
        Hollywood Rising Studios • Phase 1
      </div>
    </div>
  );
};
