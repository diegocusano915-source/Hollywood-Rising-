/**
 * HOLLYWOOD RISING - Comprehensive AAA Footer & Help Modals
 * Roadmap (5 Official Phases), Changelog, Help Center, Bug Report, Credits, Scrolling Credits, Legal.
 * Powered by ProPredict Analytics™.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Info,
  LifeBuoy,
  Mail,
  ShieldAlert,
  Award,
  Map,
  FileText,
  HelpCircle,
  Bug,
  Shield,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Send,
  Crown,
  ChevronRight,
  Briefcase,
  DollarSign,
  TrendingUp,
  Globe,
  Film,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

const SUPPORT_EMAIL = 'propredict.support@gmail.com';

const BaseFooterModal: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ title, icon, children, maxWidth = 'max-w-lg' }) => {
  const { setActiveModal, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full ${maxWidth} rounded-2xl flex flex-col overflow-hidden border shadow-2xl max-h-[85vh]`}
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        <div
          className="p-4 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-2.5 text-amber-400">
            {icon}
            <h2 className="text-base font-black text-white uppercase tracking-wider">{title}</h2>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-gray-300 leading-relaxed overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AboutModal: React.FC = () => (
  <BaseFooterModal title="About Hollywood Rising" icon={<Info className="w-5 h-5 text-amber-400" />}>
    <div className="space-y-3">
      <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 text-center">
        <Crown className="w-8 h-8 text-amber-400 mx-auto mb-1" />
        <h3 className="text-base font-black text-white">HOLLYWOOD RISING™</h3>
        <p className="text-[11px] text-amber-300 font-bold">A Film Industry Career & Entertainment Empire Simulation</p>
      </div>

      <p className="text-gray-300 leading-relaxed">
        Step into the high-stakes world of Los Angeles. Start as an aspiring actor doing extra work and commercial callbacks, navigate real SAG-AFTRA guild contracts, produce blockbuster motion pictures, hire agents and managers, build real estate empires, and compete for Academy Awards in a living Hollywood simulation.
      </p>

      <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-xl bg-white/5 border border-white/5">
        <div>
          <span className="text-gray-400 block uppercase font-bold">Version</span>
          <span className="text-white font-mono font-bold">1.4.0 (Final Polish)</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase font-bold">Build Identifier</span>
          <span className="text-white font-mono font-bold">Build #2026.07.29</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase font-bold">Developer</span>
          <span className="text-amber-300 font-bold">Hollywood Rising Studios</span>
        </div>
        <div>
          <span className="text-gray-400 block uppercase font-bold">Analytics Engine</span>
          <span className="text-amber-300 font-bold">ProPredict Analytics™</span>
        </div>
        <div className="col-span-2 pt-1 border-t border-white/5">
          <span className="text-gray-400 block uppercase font-bold">Official Support</span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-300 font-mono underline font-bold">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  </BaseFooterModal>
);

export const SupportModal: React.FC = () => {
  const { setActiveModal } = useGame();

  const handleOpenEmail = (subject: string) => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <BaseFooterModal title="Official Support" icon={<LifeBuoy className="w-5 h-5 text-purple-400" />}>
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs">
          <p className="font-bold mb-1">How can Hollywood Rising Studios assist you today?</p>
          <p className="text-[11px]">
            Our support team is dedicated to giving you the best Hollywood experience. Select an option below or email us directly at{' '}
            <strong className="text-amber-300 font-mono">{SUPPORT_EMAIL}</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleOpenEmail('Hollywood Rising - Contact Support')}
            className="w-full p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-amber-400/50 flex items-center justify-between text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-white block font-bold text-xs">Contact Support</strong>
                <span className="text-[10px] text-gray-400">Questions regarding saves, gameplay, or career features</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-amber-400" />
          </button>

          <button
            onClick={() => setActiveModal('bug_report')}
            className="w-full p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-rose-400/50 flex items-center justify-between text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Bug className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-white block font-bold text-xs">Report Bug</strong>
                <span className="text-[10px] text-gray-400">Submit issue details directly to our developers</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-rose-400" />
          </button>

          <button
            onClick={() => handleOpenEmail('Hollywood Rising - Feature Request')}
            className="w-full p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-sky-400/50 flex items-center justify-between text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-white block font-bold text-xs">Feature Request</strong>
                <span className="text-[10px] text-gray-400">Have an idea for a movie genre, career, or studio system?</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-sky-400" />
          </button>

          <button
            onClick={() => setActiveModal('help_center')}
            className="w-full p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-emerald-400/50 flex items-center justify-between text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-white block font-bold text-xs">FAQ & Help Center</strong>
                <span className="text-[10px] text-gray-400">Read career guides, SAG-AFTRA rules, and box office tips</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400" />
          </button>
        </div>

        <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-center">
          <span className="text-[10px] text-gray-400 block uppercase font-bold">Official Support Email</span>
          <span className="text-amber-300 font-mono font-bold text-sm">{SUPPORT_EMAIL}</span>
        </div>
      </div>
    </BaseFooterModal>
  );
};

export const ContactModal: React.FC = () => (
  <BaseFooterModal title="Contact Studio" icon={<Mail className="w-5 h-5 text-amber-400" />}>
    <div className="space-y-3">
      <p className="font-bold text-white text-xs">Hollywood Studio Relations</p>
      <p className="text-gray-300">
        Have press, media, sponsorship, or general inquiries? Send a message directly to our studio relations desk.
      </p>
      <div className="p-4 bg-black/50 rounded-xl border border-amber-500/30 text-center space-y-1">
        <span className="text-[10px] text-amber-400 font-bold uppercase block">Official Contact Email</span>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-white font-mono font-bold text-sm hover:underline">
          {SUPPORT_EMAIL}
        </a>
      </div>
    </div>
  </BaseFooterModal>
);

export const DisclaimerModal: React.FC = () => (
  <BaseFooterModal title="Legal Disclaimer" icon={<ShieldAlert className="w-5 h-5 text-amber-400" />}>
    <div className="space-y-3 text-xs">
      <p className="font-bold text-white">Simulation & Non-Affiliation Disclaimer</p>
      <p className="text-gray-300">
        Hollywood Rising is a work of fiction and video game simulation. All names, studios, films, award ceremonies, characters, and events depicted in this game are generated fictitiously or used in a purely fictional context.
      </p>
      <p className="text-gray-300">
        References to SAG-AFTRA, Oscars, Golden Globes, BAFTA, Emmy, or real production entities are designed solely to enrich the realism of the entertainment career gameplay simulation powered by ProPredict Analytics™.
      </p>
    </div>
  </BaseFooterModal>
);

export const CreditsModal: React.FC = () => {
  const { setActiveModal } = useGame();

  return (
    <BaseFooterModal title="Game Credits" icon={<Award className="w-5 h-5 text-amber-400" />} maxWidth="max-w-xl">
      <div className="space-y-4 text-xs">
        {/* Banner */}
        <div className="p-3 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 rounded-xl border border-amber-500/30 text-center flex items-center justify-between">
          <div>
            <h3 className="font-black text-white text-sm tracking-wider">HOLLYWOOD RISING™</h3>
            <span className="text-[10px] text-amber-300 font-bold uppercase">Official Studio Credits</span>
          </div>
          <button
            onClick={() => setActiveModal('scrolling_credits')}
            className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs flex items-center gap-1 hover:bg-amber-300 transition-all cursor-pointer shadow-lg"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Cinematic Credits</span>
          </button>
        </div>

        {/* Section Grid */}
        <div className="space-y-3">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">Created By</span>
            <strong className="text-white block font-bold text-sm">Hollywood Rising Studios</strong>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">Technology</span>
            <strong className="text-white block font-bold text-sm">ProPredict Analytics™</strong>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">Game Systems</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-white/5 font-bold text-white">Career Engine</div>
              <div className="p-2 rounded bg-white/5 font-bold text-white">Economy Engine</div>
              <div className="p-2 rounded bg-white/5 font-bold text-white">Hollywood Simulation</div>
              <div className="p-2 rounded bg-white/5 font-bold text-white">Awards System</div>
              <div className="p-2 rounded bg-white/5 font-bold text-white">Box Office Engine</div>
              <div className="p-2 rounded bg-white/5 font-bold text-white">Empire System</div>
            </div>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">Special Thanks</span>
            <p className="text-gray-200 font-medium text-[11px]">
              All actors, filmmakers, designers, and simulation enthusiasts who helped bring Hollywood Rising to life.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">Music</span>
            <p className="text-gray-200 font-medium text-[11px] leading-relaxed">
              Original soundtrack: "Guts and Bourbon", "Bama Country", "Carefree", "Dreamer" and more —
              Music by Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 3.0.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <span className="text-amber-400 font-bold block text-[10px] uppercase">Support</span>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-300 font-mono font-bold underline">
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </BaseFooterModal>
  );
};

export const ScrollingCreditsModal: React.FC = () => {
  const { setActiveModal } = useGame();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  return (
    <div className="fixed inset-0 z-50 bg-black text-amber-200 flex flex-col justify-between p-6 overflow-hidden animate-fadeIn select-none">
      {/* Background Starfield */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-black to-black pointer-events-none" />

      {/* Header Controls */}
      <div className="z-10 flex items-center justify-between border-b border-amber-500/20 pb-4 bg-black/80 backdrop-blur-md px-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-black tracking-widest text-amber-400 uppercase">
            CINEMATIC CREDITS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer"
          >
            {speed}x Speed
          </button>

          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrolling Text Container */}
      <div className="relative flex-1 overflow-hidden my-6">
        <div
          className={`absolute w-full space-y-12 text-center transition-all ${
            isPlaying ? 'animate-marqueeVertical' : ''
          }`}
          style={{
            animationDuration: `${30 / speed}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          <div className="space-y-3 pt-12">
            <Crown className="w-12 h-12 text-amber-400 mx-auto" />
            <h1 className="text-3xl font-black text-amber-300 tracking-widest uppercase">
              HOLLYWOOD RISING™
            </h1>
            <p className="text-xs text-amber-400/80 font-mono">A Film Industry Career Simulation</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              — CREATED BY —
            </h3>
            <p className="text-xl font-bold text-white">Hollywood Rising Studios</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              — TECHNOLOGY —
            </h3>
            <p className="text-xl font-bold text-white">ProPredict Analytics™</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              — GAME SYSTEMS —
            </h3>
            <p className="text-base font-bold text-white">Career Engine</p>
            <p className="text-base font-bold text-white">Economy Engine</p>
            <p className="text-base font-bold text-white">Hollywood Simulation</p>
            <p className="text-base font-bold text-white">Awards System</p>
            <p className="text-base font-bold text-white">Box Office Engine</p>
            <p className="text-base font-bold text-white">Empire System</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              — SPECIAL THANKS —
            </h3>
            <p className="text-base font-bold text-white">All Players & Future Hollywood Legends</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              — SUPPORT —
            </h3>
            <p className="text-sm font-bold text-amber-300 font-mono">{SUPPORT_EMAIL}</p>
          </div>

          <div className="pt-12 pb-24 space-y-2">
            <p className="text-xs text-amber-300 font-bold uppercase">
              © 2026 HOLLYWOOD RISING STUDIOS. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[10px] text-gray-500 font-mono">Thank you for playing!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoadmapModal: React.FC = () => (
  <BaseFooterModal title="Official Roadmap" icon={<Map className="w-5 h-5 text-amber-400" />} maxWidth="max-w-2xl">
    <div className="p-4 space-y-4 overflow-y-auto">
      {/* HEADER */}
      <div
        className="p-4 rounded-2xl text-center border relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(168,85,247,0.10), rgba(14,165,233,0.10))',
          borderColor: 'rgba(251,191,36,0.35)',
          boxShadow: '0 0 40px rgba(251,191,36,0.15), inset 0 0 30px rgba(251,191,36,0.05)',
        }}
      >
        <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase tracking-widest">
          ★ HOLLYWOOD RISING — 8-PHASE MASTER ROADMAP ★
        </h3>
        <p className="text-[11px] text-gray-300 mt-1">
          From unknown actor to immortal legend. Every phase ships real, playable systems — no vaporware.
        </p>

        {/* OVERALL PROGRESS */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-purple-400 transition-all duration-1000"
              style={{ width: '75%', boxShadow: '0 0 12px rgba(52,211,153,0.8)' }}
            />
          </div>
          <span className="text-[11px] font-black text-emerald-300" style={{ textShadow: '0 0 10px rgba(52,211,153,0.8)' }}>
            6 / 8 SHIPPED
          </span>
        </div>
        <div className="flex justify-center gap-3 mt-2 text-[9px] font-bold">
          <span className="text-emerald-300">● 6 Completed</span>
          <span className="text-sky-300">● 2 In Development</span>
        </div>
      </div>

      {/* ============ PHASE 1 — COMPLETED ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 0 24px rgba(16,185,129,0.12)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40" style={{ boxShadow: '0 0 14px rgba(16,185,129,0.4)' }}>
              <Film className="w-4 h-4 text-emerald-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 1 — THE RISING STAR</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/50" style={{ textShadow: '0 0 8px rgba(52,211,153,0.9)' }}>
            ✓ Shipped
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Your first steps in Hollywood: audition, book roles, build your craft and break into the guild.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-emerald-200">
          {['Weekly Callboard (20-25 roles)', 'Multi-stage Auditions', 'Production Hub Filming', 'Acting Conservatory Courses', '6 Talent Attributes', 'SAG-AFTRA Membership'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-emerald-500/25 text-center">{f}</div>
          ))}
        </div>
      </div>

      {/* ============ PHASE 2 — COMPLETED ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 0 24px rgba(16,185,129,0.12)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40" style={{ boxShadow: '0 0 14px rgba(16,185,129,0.4)' }}>
              <Briefcase className="w-4 h-4 text-emerald-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 2 — INDUSTRY POWER</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/50" style={{ textShadow: '0 0 8px rgba(52,211,153,0.9)' }}>
            ✓ Shipped
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Agents & managers fight for you. Your face hits every screen — TV, radio, red carpets and headlines.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-emerald-200">
          {['28 Agents + 28 Managers', '15 TV Stations (live interviews)', '12 Radio Stations', 'Red Carpet Premieres', 'PR & Scandal System', 'Fan Club (5 tiers)', 'Endorsements & Sponsorships', 'Media Gallery', 'Official Website'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-emerald-500/25 text-center">{f}</div>
          ))}
        </div>
      </div>

      {/* ============ PHASE 3 — COMPLETED ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 0 24px rgba(16,185,129,0.12)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40" style={{ boxShadow: '0 0 14px rgba(16,185,129,0.4)' }}>
              <TrendingUp className="w-4 h-4 text-emerald-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 3 — BOX OFFICE DYNASTY</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/50" style={{ textShadow: '0 0 8px rgba(52,211,153,0.9)' }}>
            ✓ Shipped
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Your movies battle for the top of the charts. Sequels, streaming wars and the biggest night of the year.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-emerald-200">
          {['Living Box Office (up to $500B)', 'Sequel & Franchise Tracker', '12 Real Streaming Platforms', 'Streaming Bids & Negotiation', 'Year-End Awards Night', 'FYC Award Campaigns', 'Box Office Records Hall', 'Star-Power Fame Multipliers', 'Theater Expansion'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-emerald-500/25 text-center">{f}</div>
          ))}
        </div>
      </div>

      {/* ============ PHASE 4 — COMPLETED ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 0 24px rgba(16,185,129,0.12)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40" style={{ boxShadow: '0 0 14px rgba(16,185,129,0.4)' }}>
              <DollarSign className="w-4 h-4 text-emerald-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 4 — MOGUL ECONOMY</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/50" style={{ textShadow: '0 0 8px rgba(52,211,153,0.9)' }}>
            ✓ Shipped
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Money makes movies. Build businesses, play the markets, bankroll films and outsmart the IRS.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-emerald-200">
          {['Business Ventures', 'Real Estate Empire', 'Stock Market + Crypto', 'Investments & Dividends', 'Manager Bankroll Deals', 'Real Tax System + Audits', 'Charity & Foundations', 'Achievements (70+)', 'Endless Market Engine'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-emerald-500/25 text-center">{f}</div>
          ))}
        </div>
      </div>

      {/* ============ PHASE 5 — COMPLETED ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 0 24px rgba(16,185,129,0.12)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40" style={{ boxShadow: '0 0 14px rgba(16,185,129,0.4)' }}>
              <Award className="w-4 h-4 text-emerald-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 5 — PERSONAL STUDIO</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/50" style={{ textShadow: '0 0 8px rgba(52,211,153,0.9)' }}>
            ✓ Shipped
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Stop acting in other people's movies. Greenlight your own — from script to worldwide release.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-emerald-200">
          {['4-Stage Pipeline (Dev → Release)', '52 Actor Casting Pool', '70+ Global Locations', 'Budget Allocation (100% rule)', '12-Platform Bidding', 'Movie Renewals (Part 7)', 'Series Renewals (20 Seasons)', 'Studio Equipment Upgrades', 'Real Studio Financials'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-emerald-500/25 text-center">{f}</div>
          ))}
        </div>
      </div>

      {/* ============ PHASE 6 — COMPLETED ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(16,185,129,0.4)', boxShadow: '0 0 24px rgba(16,185,129,0.12)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40" style={{ boxShadow: '0 0 14px rgba(16,185,129,0.4)' }}>
              <Globe className="w-4 h-4 text-emerald-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 6 — DIGITAL SUPERSTAR</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 uppercase border border-emerald-500/50" style={{ textShadow: '0 0 8px rgba(52,211,153,0.9)' }}>
            ✓ Shipped
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Rule the internet. Seven real social platforms, premium blue ticks and a ghostwriting army.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-emerald-200">
          {['7 Social Platforms', 'Real NPC Feeds & Trends', 'Premium Subscriptions', '24 Hired Writers', 'Creator Studio Earnings', 'Real-Event Posts Only', 'Fan Growth Algorithm', 'Offline Notifications', 'Notification Center'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-emerald-500/25 text-center">{f}</div>
          ))}
        </div>
      </div>

      {/* ============ PHASE 7 — IN DEVELOPMENT ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2 animate-pulse"
        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(14,165,233,0.5)', boxShadow: '0 0 28px rgba(14,165,233,0.2)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-500/40" style={{ boxShadow: '0 0 14px rgba(14,165,233,0.5)' }}>
              <Crown className="w-4 h-4 text-sky-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 7 — GLOBAL ICON</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-sky-500/20 text-sky-300 uppercase border border-sky-500/50">
            ⚡ In Development
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          The world knows your name. Festivals, foreign markets, a star on the boulevard — and the director's chair.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-sky-200">
          {['Film Festival Circuit (Cannes/Venice/TIFF)', 'Hollywood Walk of Fame Star', 'Direct Your Own Films', 'Soundtrack & Music Career', 'Foreign Market Box Office', 'TIME Magazine Cover', 'International Press Tours', 'Biopic Rights Bidding Wars', 'Award Season Calendar'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-sky-500/30 text-center">🔮 {f}</div>
          ))}
        </div>
      </div>

      {/* ============ PHASE 8 — IN DEVELOPMENT ============ */}
      <div
        className="p-3.5 rounded-2xl border space-y-2 animate-pulse"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(0,0,0,0.4))', borderColor: 'rgba(168,85,247,0.5)', boxShadow: '0 0 28px rgba(168,85,247,0.2)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40" style={{ boxShadow: '0 0 14px rgba(168,85,247,0.5)' }}>
              <Sparkles className="w-4 h-4 text-purple-300" />
            </span>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">PHASE 8 — LEGEND & LEGACY</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 uppercase border border-purple-500/50">
            ⚡ In Development
          </span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          They build museums about you. Your memoir, your biopic, your dynasty — and the walk into forever.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] font-bold text-purple-200">
          {['Lifetime Achievement Award', 'Autobiography & Book Deal', 'Your Own Biopic', 'Hollywood Museum Wing', 'Family Dynasty (Heirs in Film)', 'Hall of Fame Induction', 'Career Retrospective Doc', 'Prestige New Game+ Mode', 'Legacy Score Leaderboards'].map((f) => (
            <div key={f} className="p-1.5 rounded-lg bg-black/40 border border-purple-500/30 text-center">🔮 {f}</div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <p className="text-[9px] text-gray-500 text-center pt-1">
        Every shipped phase above is live and playable right now — no placeholder features. Future phases ship one real system at a time.
      </p>
    </div>
  </BaseFooterModal>
);

export const ChangelogModal: React.FC = () => (
  <BaseFooterModal title="Patch Notes & Version History" icon={<FileText className="w-5 h-5 text-sky-400" />} maxWidth="max-w-xl">
    <div className="space-y-4 text-xs">
      {/* Version 1.4.0 */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
        <div className="flex items-center justify-between">
          <strong className="text-amber-300 font-black text-sm">Version 1.4.0 — Final Polish & ProPredict Analytics™</strong>
          <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded font-bold">CURRENT</span>
        </div>
        <ul className="list-disc list-inside text-gray-300 space-y-0.5 text-[11px] pt-1">
          <li>Integrated official ProPredict Analytics™ forecasting engine.</li>
          <li>Rebuilt Credits and Roadmap with official 5-phase structure.</li>
          <li>Enhanced Settings with audio, graphics, animation speed & accessibility controls.</li>
          <li>Updated official support channels: propredict.support@gmail.com.</li>
        </ul>
      </div>

      {/* Version 1.3.0 */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
        <strong className="text-white font-bold text-xs">Version 1.3.0 — Living Hollywood Update</strong>
        <ul className="list-disc list-inside text-gray-400 space-y-0.5 text-[11px]">
          <li>Introduced Living World with rival actors, director relationships, and studio acquisitions.</li>
          <li>Added Network tab with viral publicist jobs, red carpet events, and brand deals.</li>
        </ul>
      </div>

      {/* Version 1.2.0 */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
        <strong className="text-white font-bold text-xs">Version 1.2.0 — Hollywood Economy Update</strong>
        <ul className="list-disc list-inside text-gray-400 space-y-0.5 text-[11px]">
          <li>Added SAG-AFTRA guild dues, weekly royalties, streaming payouts, and agent commissions.</li>
          <li>Added Real Estate properties and passive business investments.</li>
        </ul>
      </div>
    </div>
  </BaseFooterModal>
);

export const HelpCenterModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'getting_started' | 'career' | 'economy' | 'awards'>('getting_started');

  return (
    <BaseFooterModal title="Help Center & Guides" icon={<HelpCircle className="w-5 h-5 text-emerald-400" />} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-1.5 border-b border-white/10 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('getting_started')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'getting_started'
                ? 'bg-emerald-500 text-black shadow'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            Getting Started
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'career'
                ? 'bg-emerald-500 text-black shadow'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            Career Guide
          </button>
          <button
            onClick={() => setActiveTab('economy')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'economy'
                ? 'bg-emerald-500 text-black shadow'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            Economy & Empire
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'awards'
                ? 'bg-emerald-500 text-black shadow'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            Awards Guide
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'getting_started' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <strong className="text-white block font-bold">1. Energy & Weekly Progress</strong>
              <p className="text-gray-300">
                You receive 100 Energy every week. Spend energy on auditions, acting courses, or side jobs, then press <strong>End Week</strong> to process the calendar.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <strong className="text-white block font-bold">2. Auditions & Callboard</strong>
              <p className="text-gray-300">
                Check the Callboard for open auditions. Match role requirements (Drama, Action, Comedy) for higher booking success rates.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'career' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <strong className="text-white block font-bold">SAG-AFTRA Membership</strong>
              <p className="text-gray-300">
                Complete 3 union-eligible roles to earn SAG-AFTRA eligibility. Joining unlocks studio feature film auditions, higher baseline scale pay, and residuals!
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <strong className="text-white block font-bold">Agents & Managers</strong>
              <p className="text-gray-300">
                Sign with top agencies like CAA or WME to receive exclusive script offers and lower commission rates.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'economy' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <strong className="text-white block font-bold">Weekly Royalties & Residuals</strong>
              <p className="text-gray-300">
                Released films generate continuous weekly streaming royalties and SAG-AFTRA residuals deposited directly into your bank account every week.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <strong className="text-white block font-bold">Oscars & FYC Campaigns</strong>
              <p className="text-gray-300">
                High-quality lead roles in major studio films earn Oscar nominations. Launch For Your Consideration (FYC) campaigns to boost your voting odds!
              </p>
            </div>
          </div>
        )}
      </div>
    </BaseFooterModal>
  );
};

export const BugReportModal: React.FC = () => {
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const subject = 'Hollywood Rising - Bug Report';
    const body = `Bug Description:\n${description}\n\nSystem Info:\nHollywood Rising v1.4.0`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <BaseFooterModal title="Report a Bug" icon={<Bug className="w-5 h-5 text-rose-400" />}>
      <div className="space-y-3">
        <p className="text-gray-300 text-xs">
          Help us improve Hollywood Rising! Describe what happened below and click submit to email our development team directly at <strong className="text-amber-300 font-mono">{SUPPORT_EMAIL}</strong>.
        </p>

        {!submitted ? (
          <div className="space-y-3">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue or error you encountered..."
              rows={4}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-rose-400 outline-none"
            />

            <button
              onClick={handleSubmit}
              disabled={!description.trim()}
              className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Submit Bug Report via Email</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <strong className="text-white block font-bold text-sm">Thank You!</strong>
            <p className="text-[11px] text-emerald-200">
              Your bug report action was launched in your mail client.
            </p>
          </div>
        )}
      </div>
    </BaseFooterModal>
  );
};

export const PrivacyPolicyModal: React.FC = () => (
  <BaseFooterModal title="Privacy Policy" icon={<Shield className="w-5 h-5 text-emerald-400" />}>
    <div className="space-y-3 text-xs leading-relaxed text-gray-300">
      <strong className="text-white block font-bold">Local Data Storage & Privacy</strong>
      <p>
        Hollywood Rising stores all save files, character progress, and game state locally within your web browser. No personal gameplay telemetry or private user data is collected or transmitted to external tracking servers.
      </p>
      <strong className="text-white block font-bold">Contact Support</strong>
      <p>
        If you have privacy inquiries, contact us directly at <span className="text-amber-300 font-mono">{SUPPORT_EMAIL}</span>.
      </p>
    </div>
  </BaseFooterModal>
);

export const TermsOfServiceModal: React.FC = () => (
  <BaseFooterModal title="Terms of Service" icon={<FileText className="w-5 h-5 text-sky-400" />}>
    <div className="space-y-3 text-xs leading-relaxed text-gray-300">
      <strong className="text-white block font-bold">Usage Agreement</strong>
      <p>
        By playing Hollywood Rising, you agree to enjoy the simulation as an entertainment experience powered by ProPredict Analytics™. All virtual currencies, properties, and movie grosses exist solely within the game's simulation engine and hold no real-world financial value.
      </p>
    </div>
  </BaseFooterModal>
);

export const LicensesModal: React.FC = () => (
  <BaseFooterModal title="Open Source Licenses" icon={<Award className="w-5 h-5 text-yellow-400" />}>
    <div className="space-y-3 text-xs leading-relaxed text-gray-300">
      <strong className="text-white block font-bold">Open Source Attributions</strong>
      <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-400">
        <li>React 18 — MIT License</li>
        <li>Lucide Icons — ISC License</li>
        <li>Tailwind CSS — MIT License</li>
        <li>Vite — MIT License</li>
      </ul>
    </div>
  </BaseFooterModal>
);
