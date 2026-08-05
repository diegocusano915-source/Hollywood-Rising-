/**
 * HOLLYWOOD RISING - AAA Luxury Footer Component
 * Displayed across Main Menu and Game Screens.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Map,
  FileText,
  HelpCircle,
  LifeBuoy,
  Bug,
  Award,
  Shield,
  Mail,
  Crown,
  Sparkles,
  Film,
} from 'lucide-react';

export const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { setActiveModal } = useGame();

  const handleEmailSupport = (subject: string) => {
    window.location.href = `mailto:propredict.support@gmail.com?subject=${encodeURIComponent(
      subject
    )}`;
  };

  return (
    <footer
      className={`w-full bg-black/70 backdrop-blur-md border-t border-amber-500/20 text-gray-400 py-6 px-4 transition-all ${className}`}
    >
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Top Brand Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400">
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              <span className="text-base font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                HOLLYWOOD RISING™
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                v1.4.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              Hollywood Career, Film Production & Entertainment Empire Simulation
            </p>
          </div>

          {/* Quick Email Support Pill */}
          <div className="flex items-center gap-2 bg-black/60 border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-lg">
            <Mail className="w-4 h-4 text-amber-400" />
            <div className="text-left text-[10px]">
              <span className="text-gray-400 uppercase font-bold block leading-none">Official Support</span>
              <a
                href="mailto:propredict.support@gmail.com"
                className="text-amber-300 font-mono font-bold hover:underline"
              >
                propredict.support@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveModal('roadmap')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => setActiveModal('changelog')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Patch Notes</span>
          </button>

          <button
            onClick={() => setActiveModal('help_center')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Help Center</span>
          </button>

          <button
            onClick={() => setActiveModal('support')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-purple-400" />
            <span>Support</span>
          </button>

          <button
            onClick={() => setActiveModal('bug_report')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>Report Bug</span>
          </button>

          <button
            onClick={() => setActiveModal('credits')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span>Credits</span>
          </button>
        </div>

        {/* Legal & Version Sub-footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-400 border-t border-white/5 pt-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveModal('about')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              About
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('privacy_policy')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('terms_of_service')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('disclaimer')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Legal Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('licenses')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Licenses
            </button>
          </div>

          <div className="text-center sm:text-right font-medium">
            <span>© 2026 Hollywood Rising Studios. All Rights Reserved.</span>
            <span className="block text-[9px] text-gray-400">Build #2026.07.29 • Awards & Empire Season</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
