/**
 * HOLLYWOOD RISING - Animated Counter & Floating Stat Badge
 * Animates numbers smoothly upward or downward (Money, Followers, Fame, Box Office).
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  formatting?: 'currency' | 'number' | 'compact';
  durationMs?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  formatting = 'number',
  durationMs = 600,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [diff, setDiff] = useState<number | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev !== value) {
      const delta = value - prev;
      setDiff(delta);

      const startTime = performance.now();
      const startValue = displayValue;
      const targetValue = value;

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        // Ease out quad
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        const current = Math.round(startValue + (targetValue - startValue) * easedProgress);

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(targetValue);
          prevValueRef.current = targetValue;
          // Hide floating badge after 2 seconds
          setTimeout(() => setDiff(null), 1800);
        }
      };

      requestAnimationFrame(updateCounter);
    }
  }, [value, durationMs]);

  const formatNumber = (num: number) => {
    if (formatting === 'currency') {
      return `$${num.toLocaleString('en-US')}`;
    }
    if (formatting === 'compact') {
      if (Math.abs(num) >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
      if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
      if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toLocaleString('en-US');
  };

  return (
    <div className="relative inline-flex items-center">
      <span className={className}>
        {prefix}
        {formatNumber(displayValue)}
        {suffix}
      </span>

      {/* Floating Delta Badge */}
      <AnimatePresence>
        {diff !== null && diff !== 0 && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -18, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`absolute right-0 -top-1 px-1.5 py-0.5 rounded-md font-mono font-black text-[10px] pointer-events-none shadow-lg z-20 ${
              diff > 0
                ? 'bg-emerald-500 text-black border border-emerald-300'
                : 'bg-rose-500 text-white border border-rose-300'
            }`}
          >
            {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
