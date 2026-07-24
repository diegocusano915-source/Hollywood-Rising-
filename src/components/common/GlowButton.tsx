/**
 * HOLLYWOOD RISING - GlowButton Component
 * Luxury glowing buttons with sound effects and hover/tap animations.
 */

import React from 'react';
import { motion } from 'motion/react';
import { soundService } from '../../services/soundService';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'gold' | 'purple' | 'green' | 'red' | 'blue' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  glow?: boolean;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  variant = 'gold',
  fullWidth = false,
  size = 'md',
  disabled = false,
  className = '',
  icon,
  glow = true,
}) => {
  const handleClick = () => {
    if (disabled) return;
    soundService.playClick();
    if (onClick) onClick();
  };

  // Variants styling
  const variantStyles = {
    gold: 'bg-gradient-to-r from-[#FFCC33] via-[#FFE082] to-[#FFB300] text-[#050510] font-bold border-b-2 border-[#B78103] hover:brightness-110 active:brightness-95',
    purple: 'bg-gradient-to-r from-[#9955FF] via-[#B388FF] to-[#7C4DFF] text-white font-bold border-b-2 border-[#512DA8] hover:brightness-110',
    green: 'bg-gradient-to-r from-[#33CC55] via-[#66BB6A] to-[#2E7D32] text-white font-bold border-b-2 border-[#1B5E20] hover:brightness-110',
    blue: 'bg-gradient-to-r from-[#5599FF] via-[#64B5F6] to-[#1E88E5] text-white font-bold border-b-2 border-[#1565C0] hover:brightness-110',
    red: 'bg-gradient-to-r from-[#FF3333] via-[#EF5350] to-[#C62828] text-white font-bold border-b-2 border-[#8E0000] hover:brightness-110',
    outline: 'bg-[#111122]/80 text-[#FFCC33] border border-[#FFCC33]/50 font-semibold hover:bg-[#FFCC33]/15 hover:border-[#FFCC33]',
  };

  const glowShadows = {
    gold: 'shadow-[0_0_20px_rgba(255,204,51,0.4)]',
    purple: 'shadow-[0_0_20px_rgba(153,85,255,0.4)]',
    green: 'shadow-[0_0_20px_rgba(51,204,85,0.4)]',
    blue: 'shadow-[0_0_20px_rgba(85,153,255,0.4)]',
    red: 'shadow-[0_0_20px_rgba(255,51,51,0.4)]',
    outline: 'shadow-[0_0_12px_rgba(255,204,51,0.2)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 tracking-wide',
    lg: 'px-7 py-3.5 text-base rounded-2xl gap-3 uppercase tracking-wider',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-all duration-200 select-none ${
        variantStyles[variant]
      } ${glow && !disabled ? glowShadows[variant] : ''} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : ''} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
