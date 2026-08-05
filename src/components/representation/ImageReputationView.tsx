/**
 * HOLLYWOOD RISING - Image & Reputation Sub-View
 * Tracks 6 core reputation pillars driven purely by actual gameplay actions.
 */

import React from 'react';
import { RepresentationFullState } from '../../types/representation';
import { Star, ArrowLeft, ShieldCheck, Award, AlertTriangle, Eye, Heart, Info, Sparkles } from 'lucide-react';

interface ImageReputationViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const ImageReputationView: React.FC<ImageReputationViewProps> = ({
  representationState,
  onBack,
}) => {
  const rep = representationState.reputation;

  // Calculate Overall Image Score
  const totalPositivePillars =
    rep.publicReputation +
    rep.industryReputation +
    rep.professionalism +
    rep.publicTrust +
    rep.worldwidePopularity;

  const overallScore = Math.max(
    0,
    Math.min(100, Math.round(totalPositivePillars / 5) - Math.round(rep.controversyIndex / 2))
  );

  const hasEstablishedImage =
    rep.publicReputation > 0 ||
    rep.industryReputation > 0 ||
    rep.professionalism > 0 ||
    rep.publicTrust > 0 ||
    rep.worldwidePopularity > 0 ||
    rep.controversyIndex > 0;

  const statusText = !hasEstablishedImage
    ? 'Unknown'
    : overallScore < 25
    ? 'Up & Coming'
    : overallScore < 50
    ? 'Rising Talent'
    : overallScore < 75
    ? 'Established Star'
    : 'Hollywood Elite';

  const METRICS = [
    {
      label: 'Public Reputation',
      value: rep.publicReputation,
      icon: Star,
      color: 'text-amber-400',
      desc: 'General public admiration, fanbase sentiment, and fan loyalty.',
    },
    {
      label: 'Industry Reputation',
      value: rep.industryReputation,
      icon: Award,
      color: 'text-indigo-400',
      desc: 'Standing among Hollywood directors, studio chiefs, and academy voters.',
    },
    {
      label: 'Professionalism',
      value: rep.professionalism,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      desc: 'Punctuality, course completion, and onset work ethic.',
    },
    {
      label: 'Public Trust',
      value: rep.publicTrust,
      icon: Heart,
      color: 'text-sky-400',
      desc: 'Consumer trust for luxury brand partnerships and public causes.',
    },
    {
      label: 'Popularity',
      value: rep.worldwidePopularity,
      icon: Eye,
      color: 'text-purple-400',
      desc: 'International box office draw and global press recognition.',
    },
    {
      label: 'Controversy',
      value: rep.controversyIndex,
      icon: AlertTriangle,
      color: 'text-red-400',
      desc: 'Tabloid scandals, public disputes, and press controversy index.',
    },
  ];

  return (
    <div className="space-y-6 text-white select-none pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Representation</span>
        </button>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">IMAGE & REPUTATION</h2>
        </div>
      </div>

      {/* Summary Score Card */}
      <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Public Image Overview</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white">Status:</span>
            <span className={`text-2xl font-black ${!hasEstablishedImage ? 'text-gray-400' : 'text-amber-400'}`}>
              {statusText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-black/40 px-6 py-3 rounded-2xl border border-white/10">
          <div className="text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overall Image Score</div>
            <div className="text-2xl font-black text-amber-400">{overallScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Empty State Banner when no reputation has been earned */}
      {!hasEstablishedImage && (
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md flex items-start gap-4">
          <Info className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">Image Not Established</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Your public image has not been established yet. Complete acting projects, interact with fans, attend events, and build your career to develop your reputation.
            </p>
          </div>
        </div>
      )}

      {/* 6 Pillars Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${m.color}`} />
                  <span className="text-xs font-black text-white">{m.label}</span>
                </div>
                <span className={`text-lg font-black ${m.value === 0 ? 'text-gray-400' : m.color}`}>
                  {m.value}/100
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden border border-white/10">
                <div
                  className={`h-full transition-all duration-500 ${
                    m.label === 'Controversy' ? 'bg-red-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">{m.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

