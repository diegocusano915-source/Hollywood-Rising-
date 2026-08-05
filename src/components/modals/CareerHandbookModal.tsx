/**
 * HOLLYWOOD RISING - Official Career Handbook & Help Center
 * Professional guides: Career Progression, Empire, Movie Production, Relationships, Awards, Business & FAQ.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  HelpCircle,
  Film,
  Building2,
  Award,
  Users,
  DollarSign,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const CareerHandbookModal: React.FC = () => {
  const { setActiveModal, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTopic, setActiveTopic] = useState<'CAREER' | 'EMPIRE' | 'PRODUCTION' | 'RELATIONSHIPS' | 'AWARDS' | 'BUSINESS' | 'INVESTMENTS' | 'FAQ'>('CAREER');

  const handbookTopics = [
    { id: 'CAREER', label: '1. Career Guide', icon: <Film className="w-4 h-4 text-amber-400" /> },
    { id: 'EMPIRE', label: '2. Empire Guide', icon: <Building2 className="w-4 h-4 text-purple-400" /> },
    { id: 'PRODUCTION', label: '3. Movie Production', icon: <Film className="w-4 h-4 text-sky-400" /> },
    { id: 'RELATIONSHIPS', label: '4. Relationships', icon: <Users className="w-4 h-4 text-rose-400" /> },
    { id: 'AWARDS', label: '5. Awards & Academy', icon: <Award className="w-4 h-4 text-yellow-400" /> },
    { id: 'BUSINESS', label: '6. Business & Retainers', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
    { id: 'INVESTMENTS', label: '7. Investments', icon: <TrendingUp className="w-4 h-4 text-amber-300" /> },
    { id: 'FAQ', label: '8. Frequently Asked Questions', icon: <HelpCircle className="w-4 h-4 text-blue-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-3xl rounded-3xl flex flex-col overflow-hidden border shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3 text-amber-400">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">CAREER HANDBOOK & HELP CENTER</h2>
              <p className="text-[11px] text-amber-300 font-medium">
                Official Hollywood Rising strategy handbook & gameplay guides.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Menu */}
          <div className="w-full md:w-56 p-3 bg-black/40 border-r border-white/10 space-y-1 shrink-0 overflow-y-auto">
            {handbookTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id as any)}
                className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTopic === t.id
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {t.icon}
                  <span className="truncate">{t.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>

          {/* Main Topic Body */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs text-gray-200 leading-relaxed flex-1">
            {activeTopic === 'CAREER' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-amber-300 uppercase">1. Career Progression & SAG-AFTRA Membership</h3>
                <p>
                  Your Hollywood journey begins as a newcomer in Los Angeles. To unlock top-tier studio auditions, CAA/WME representation, and A-list roles, you must progress through actor tiers:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[11px]">
                  <li><strong>Beginner (0 XP):</strong> Open Callboard auditions, commercial callbacks, and indie short films.</li>
                  <li><strong>Rising Actor (100+ XP):</strong> Studio supporting roles, TV series recurring guest spots, and agent representation.</li>
                  <li><strong>Established Star (300+ XP):</strong> Studio co-leads, major film festival premieres, and brand ambassadorships.</li>
                  <li><strong>A-List Superstar (800+ XP):</strong> Tentpole franchise leads, $1M+ upfront salary, profit share backends, and Academy Award campaigns.</li>
                </ul>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                  <strong className="block font-bold mb-0.5">Guild Requirement:</strong> To join SAG-AFTRA, you must complete at least <strong>4 Lead / Principal Roles</strong>.
                </div>
              </div>
            )}

            {activeTopic === 'EMPIRE' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-purple-300 uppercase">2. Film Empire & Real Estate Development</h3>
                <p>
                  Transition from talent for hire to studio owner and real estate mogul:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[11px]">
                  <li><strong>Indie Film Studio:</strong> Purchase your own lot to finance, package, and distribute your own films without studio executive interference.</li>
                  <li><strong>Beverly Hills Real Estate:</strong> Invest in residential and commercial properties to collect weekly rental yield.</li>
                  <li><strong>Corporate Acquisitions:</strong> Acquire tech and entertainment holding companies to build your net worth.</li>
                </ul>
              </div>
            )}

            {activeTopic === 'PRODUCTION' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-sky-300 uppercase">3. Movie Production & Box Office Mechanics</h3>
                <p>
                  Every film undergoes casting, filming weeks, post-production, and nationwide theatrical release:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300 text-[11px]">
                  <li><strong>Critical Reception:</strong> Determined by your acting talent score, director caliber, and script quality.</li>
                  <li><strong>Box Office Revenue:</strong> Influenced by genre trends, marketing expenditure, and red carpet premieres.</li>
                  <li><strong>Backend Profits & Royalties:</strong> Earn backend percentages on box office gross and lifetime streaming residuals.</li>
                </ul>
              </div>
            )}

            {activeTopic === 'RELATIONSHIPS' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-rose-300 uppercase">4. Hollywood Relationships & Marriage</h3>
                <p>
                  Build bonds with directors, co-stars, producers, and romantic partners. Higher relationship levels unlock co-star opportunities, wedding proposals, and prenup agreements.
                </p>
              </div>
            )}

            {activeTopic === 'AWARDS' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-yellow-300 uppercase">5. Academy Awards & FYC PR Campaigns</h3>
                <p>
                  Run For Your Consideration (FYC) trade campaigns, attend awards galas, and collect gold statuettes to boost your Fame XP and industry respect.
                </p>
              </div>
            )}

            {activeTopic === 'BUSINESS' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-emerald-300 uppercase">6. Representation & Retainer Management</h3>
                <p>
                  Hire and manage 7 key professionals: Lawyers, Talent Agents, Business Managers, Publicists, Financial Advisors, Security Firms, and Marketing Firms. You can renew, replace, or cancel retainer contracts at any time. Immediate cancellation stops future weekly fees immediately.
                </p>
              </div>
            )}

            {activeTopic === 'INVESTMENTS' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-amber-300 uppercase">7. Market Engine & Investments</h3>
                <p>
                  Diversify your earnings into tech stocks, studio equity, private equity funds, and venture rounds to grow your net worth towards the Forbes Hollywood List.
                </p>
              </div>
            )}

            {activeTopic === 'FAQ' && (
              <div className="space-y-3">
                <h3 className="text-base font-black text-blue-300 uppercase">8. Frequently Asked Questions</h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-white block">Q: How do I advance to the next week?</strong>
                    <p className="text-[11px] text-gray-300">Click the "Advance to Next Week" button at the bottom of the home dashboard.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <strong className="text-white block">Q: Can I dismiss retained lawyers or agents?</strong>
                    <p className="text-[11px] text-gray-300">Yes! Open Representation or Legal view to terminate any contract immediately.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
