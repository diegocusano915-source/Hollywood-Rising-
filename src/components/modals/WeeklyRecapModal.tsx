/**
 * HOLLYWOOD RISING - Weekly Recap Modal
 * Beautiful recap summary animation shown upon ending a week.
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Calendar, DollarSign, Zap, Star, Users, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GlowButton } from '../common/GlowButton';

export const WeeklyRecapModal: React.FC = () => {
  const { lastWeeklyRecap, setActiveModal } = useGame();

  useEffect(() => {
    // Trigger confetti burst on recap display
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFCC33', '#9955FF', '#33CC55', '#5599FF'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  if (!lastWeeklyRecap) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 30 }}
        className="w-full max-w-lg bg-[#111122] border border-[#FFCC33]/50 rounded-3xl p-6 text-[#F0F0F0] flex flex-col shadow-[0_0_60px_rgba(255,204,51,0.25)] relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCC33]/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222244] relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFCC33]/15 text-[#FFCC33]">
              <Calendar size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FFCC33] uppercase tracking-wider">Hollywood Weekly Times</span>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Week {lastWeeklyRecap.week}, {lastWeeklyRecap.year} Recap
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl bg-[#050510] border border-[#222244] text-[#999999] hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-4 relative z-10">
          <div className="bg-[#050510] border border-[#222244] rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-[#999999] uppercase font-semibold flex items-center gap-1">
              <Zap size={12} className="text-[#FF8C00]" /> Energy Restored
            </span>
            <span className="text-lg font-black text-[#FF8C00] mt-1">
              +{lastWeeklyRecap.energyRestored} Energy
            </span>
          </div>

          <div className="bg-[#050510] border border-[#222244] rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-[#999999] uppercase font-semibold flex items-center gap-1">
              <DollarSign size={12} className="text-[#33CC55]" /> Rent & Living Expenses
            </span>
            <span className="text-lg font-black text-[#FF3333] mt-1">
              -${lastWeeklyRecap.expensesPaid}
            </span>
          </div>

          <div className="bg-[#050510] border border-[#222244] rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-[#999999] uppercase font-semibold flex items-center gap-1">
              <Users size={12} className="text-[#5599FF]" /> Fans Gained
            </span>
            <span className="text-lg font-black text-[#5599FF] mt-1">
              +{lastWeeklyRecap.fansGained} Fans
            </span>
          </div>

          <div className="bg-[#050510] border border-[#222244] rounded-2xl p-3 flex flex-col">
            <span className="text-[10px] text-[#999999] uppercase font-semibold flex items-center gap-1">
              <Star size={12} className="text-[#FFCC33]" /> Fame Progress
            </span>
            <span className="text-lg font-black text-[#FFCC33] mt-1">
              +{lastWeeklyRecap.fameGained} Fame
            </span>
          </div>
        </div>

        {/* Summary Bullet Points */}
        <div className="space-y-2 relative z-10 mb-4 bg-[#050510]/80 p-3.5 rounded-2xl border border-[#222244]">
          <span className="text-xs font-bold text-[#FFCC33] uppercase tracking-wider block">
            Weekly Highlights:
          </span>
          <ul className="space-y-1.5 text-xs text-[#F0F0F0]">
            {lastWeeklyRecap.eventsSummary.map((event, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#33CC55] shrink-0 mt-0.5" />
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="relative z-10 pt-2">
          <GlowButton variant="gold" size="lg" fullWidth onClick={() => setActiveModal('none')}>
            CONTINUE TO NEXT WEEK
          </GlowButton>
        </div>
      </motion.div>
    </div>
  );
};
