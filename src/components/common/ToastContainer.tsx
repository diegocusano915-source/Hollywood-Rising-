/**
 * HOLLYWOOD RISING - AAA Toast Notification System
 * Categories: Success, Warning, Error, Information, Achievement, Award, Movie Released, Box Office Record.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Trophy,
  Award,
  Film,
  TrendingUp,
  X,
} from 'lucide-react';

export type ToastCategory =
  | 'Success'
  | 'Warning'
  | 'Error'
  | 'Information'
  | 'Achievement'
  | 'Award'
  | 'Movie Released'
  | 'Box Office Record';

export interface ToastMessage {
  id: string;
  category: ToastCategory;
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  const getCategoryConfig = (category: ToastCategory) => {
    switch (category) {
      case 'Success':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
          iconColor: 'text-emerald-400',
          badge: 'SUCCESS',
        };
      case 'Warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
          iconColor: 'text-amber-400',
          badge: 'WARNING',
        };
      case 'Error':
        return {
          icon: XCircle,
          bgColor: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
          iconColor: 'text-rose-400',
          badge: 'ERROR',
        };
      case 'Achievement':
        return {
          icon: Trophy,
          bgColor: 'bg-yellow-950/90 border-yellow-400/60 text-yellow-100 shadow-[0_0_30px_rgba(234,179,8,0.3)]',
          iconColor: 'text-yellow-400 animate-bounce',
          badge: 'ACHIEVEMENT UNLOCKED',
        };
      case 'Award':
        return {
          icon: Award,
          bgColor: 'bg-amber-950/90 border-amber-400/80 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.4)]',
          iconColor: 'text-amber-300',
          badge: 'ACADEMY AWARD',
        };
      case 'Movie Released':
        return {
          icon: Film,
          bgColor: 'bg-purple-950/90 border-purple-500/50 text-purple-200',
          iconColor: 'text-purple-400',
          badge: 'THEATRICAL RELEASE',
        };
      case 'Box Office Record':
        return {
          icon: TrendingUp,
          bgColor: 'bg-emerald-950/90 border-amber-400/70 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)]',
          iconColor: 'text-emerald-400',
          badge: 'BOX OFFICE RECORD',
        };
      case 'Information':
      default:
        return {
          icon: Info,
          bgColor: 'bg-slate-900/90 border-sky-500/50 text-sky-200',
          iconColor: 'text-sky-400',
          badge: 'NOTICE',
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[150] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = getCategoryConfig(toast.category);
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 pointer-events-auto relative overflow-hidden ${config.bgColor}`}
            >
              <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[9px] font-black tracking-widest uppercase opacity-80">
                    {config.badge}
                  </span>
                  <button
                    onClick={() => onDismiss(toast.id)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-black text-white truncate leading-tight">{toast.title}</h4>
                <p className="text-[11px] leading-snug opacity-90 font-medium mt-0.5">{toast.message}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
