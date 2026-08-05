/**
 * HOLLYWOOD RISING - Particle Effects Component
 * Supports: Gold Sparkles, Confetti, Camera Flashes, Fireworks, Premium Glow, Success Burst, Achievement Shine.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type ParticleType =
  | 'sparkles'
  | 'confetti'
  | 'flashes'
  | 'fireworks'
  | 'glow'
  | 'burst'
  | 'award_gold';

interface ParticleOverlayProps {
  type: ParticleType;
  active?: boolean;
  count?: number;
  durationMs?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotation: number;
  velocityX?: number;
  velocityY?: number;
}

const GOLD_COLORS = ['#FBBF24', '#F59E0B', '#D97706', '#FEF08A', '#FFFFFF'];
const CONFETTI_COLORS = ['#FBBF24', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#F43F5E'];

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({
  type,
  active = true,
  count = 24,
  durationMs = 3000,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const newParticles: Particle[] = [];
    const colors = type === 'confetti' ? CONFETTI_COLORS : GOLD_COLORS;

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // %
        y: type === 'confetti' ? -10 : Math.random() * 100, // %
        size: type === 'award_gold' ? Math.random() * 12 + 6 : Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 0.8,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 40,
        velocityY: Math.random() * 50 + 30,
      });
    }

    setParticles(newParticles);

    if (durationMs > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [active, type, count, durationMs]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <AnimatePresence>
        {/* Camera Flashes Effect */}
        {type === 'flashes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0, 0.7, 0, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-white/10 backdrop-brightness-125"
          />
        )}

        {/* Ambient Glow */}
        {(type === 'glow' || type === 'award_gold') && (
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-10 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-yellow-500/15 blur-2xl rounded-full"
          />
        )}

        {/* Dynamic Flying Particle Items */}
        {particles.map((p) => {
          if (type === 'confetti') {
            return (
              <motion.div
                key={p.id}
                initial={{
                  top: `${p.y}%`,
                  left: `${p.x}%`,
                  opacity: 1,
                  rotate: p.rotation,
                }}
                animate={{
                  top: '110%',
                  left: `${p.x + (p.velocityX || 0)}%`,
                  rotate: p.rotation + 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: 'easeOut',
                  repeat: durationMs === 0 ? Infinity : 0,
                }}
                style={{
                  position: 'absolute',
                  width: `${p.size}px`,
                  height: `${p.size * 1.5}px`,
                  backgroundColor: p.color,
                  borderRadius: p.id % 2 === 0 ? '2px' : '50%',
                }}
              />
            );
          }

          // Sparkles or Award Gold Stars
          return (
            <motion.div
              key={p.id}
              initial={{
                top: `${p.y}%`,
                left: `${p.x}%`,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.9, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: durationMs === 0 ? Infinity : 0,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                borderRadius: '50%',
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
