/**
 * HOLLYWOOD RISING - Coming Soon Modal
 * Displays "Coming in Phase 2" for non-Phase 1 navigation tabs (TALENT, WORLD, NETWORK, EMPIRE, REP).
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, Lock, Sparkles, Film } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GlowButton } from '../common/GlowButton';

export const ComingSoonModal: React.FC = () => {
  const { setActiveModal } = useGame();
  const comingSoonFeatureName = 'MODULE';

  const featureDescriptions: Record<string, string> = {
    TALENT: 'Advanced acting class workshops, vocal coaching, stunt training, and multi-skill specialization trees.',
    WORLD: 'Hollywood map featuring Sunset Strip, Paramount Studios, Beverly Hills mansions, and red carpet galas.',
    NETWORK: 'Director lunches, studio executive pitching, co-star rivalries, and publicity PR stunts.',
    EMPIRE: 'Purchasing film production studios, hiring talent agents, financing indie films, and distribution deals.',
    REP: 'Public relations agency management, tabloid press leaks, paparazzi scandals, and image control.',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-[#111122] border border-[#9955FF]/50 rounded-3xl p-6 text-[#F0F0F0] flex flex-col items-center text-center shadow-[0_0_50px_rgba(153,85,255,0.25)] relative overflow-hidden"
      >
        <div className="p-4 rounded-2xl bg-[#9955FF]/15 text-[#9955FF] mb-3 border border-[#9955FF]/30">
          <Lock size={32} />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#9955FF]/20 text-[#9955FF] text-xs font-bold uppercase mb-2">
          <Sparkles size={14} /> Phase 2 Expansion
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
          {comingSoonFeatureName} MODULE
        </h3>

        <p className="text-sm font-bold text-[#FFCC33] mb-3">Coming in Phase 2</p>

        <p className="text-xs text-[#999999] leading-relaxed mb-6 px-2">
          {featureDescriptions[comingSoonFeatureName] || 'This major feature section is scheduled for release in Phase 2 of Hollywood Rising.'}
        </p>

        <GlowButton variant="purple" size="md" fullWidth onClick={() => setActiveModal('none')}>
          BACK TO HOME DASHBOARD
        </GlowButton>
      </motion.div>
    </div>
  );
};
