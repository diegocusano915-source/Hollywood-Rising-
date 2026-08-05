/**
 * HOLLYWOOD RISING - Job Board View (Phase 4 Network)
 * Part-Time & Entertainment Employment, Max 2 Active Jobs, Weekly Salary & Networking Boost.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, JobItem } from '../../types/network';
import { JOBS_CATALOG, NetworkService } from '../../services/networkService';
import {
  Briefcase,
  ArrowLeft,
  DollarSign,
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Building2,
  TrendingUp,
  Award,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface JobBoardViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

export const JobBoardView: React.FC<JobBoardViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [feedback, setFeedback] = useState<string | null>(null);

  const activeJobs = networkState.activeJobs || [];

  const handleApplyJob = (job: JobItem) => {
    if (activeJobs.length >= 2) {
      setFeedback('Maximum 2 Active Jobs Allowed simultaneously!');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    if (activeJobs.some((j) => j.id === job.id)) {
      setFeedback('You are already employed in this position!');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const newActiveJob = {
      ...job,
      weeksRemaining: job.maxWeeks,
      totalEarned: 0,
    };

    const nextState: NetworkFullState = {
      ...networkState,
      activeJobs: [...activeJobs, newActiveJob],
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`HIRED! You are now employed as ${job.title} ($${job.weeklySalary}/wk).`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleQuitJob = (jobId: string) => {
    const nextState: NetworkFullState = {
      ...networkState,
      activeJobs: activeJobs.filter((j) => j.id !== jobId),
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback('Resigned from job position.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-amber-400" />
            Hollywood Employment Bureau
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <Briefcase className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                HOLLYWOOD JOB BOARD
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">ACTIVE EMPLOYMENT</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Active Jobs</span>
            <span className="text-lg font-black text-amber-400">{activeJobs.length} / 2 MAX</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* SECTION 1: ACTIVE EMPLOYMENT POSITIONS */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Your Current Positions ({activeJobs.length}/2)
        </h2>

        {activeJobs.length === 0 ? (
          <div className="p-6 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
            <Briefcase className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-sm font-black text-white">No Active Employment</h3>
            <p className="text-xs text-gray-400">
              Apply for jobs below to earn steady weekly income and boost entertainment networking.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-black space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">{job.title}</h3>
                    <span className="text-xs text-amber-300 font-bold">{job.company}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                    ${job.weeklySalary}/wk
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-gray-300 bg-black/50 p-2.5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>-{job.energyCost} Energy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{job.weeksRemaining} wks left</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>+${job.totalEarned.toLocaleString()} Total</span>
                  </div>
                </div>

                <button
                  onClick={() => handleQuitJob(job.id)}
                  className="w-full py-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-black transition-all cursor-pointer"
                >
                  RESIGN FROM POSITION
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: AVAILABLE JOBS CATALOG */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-400" />
          Available Hollywood Positions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {JOBS_CATALOG.map((job) => {
            const isEmployed = activeJobs.some((j) => j.id === job.id);

            return (
              <div
                key={job.id}
                className="p-5 rounded-3xl border border-white/10 bg-black/50 hover:bg-black/70 transition-all space-y-3 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white">{job.title}</h3>
                      <span className="text-xs text-gray-400 font-medium">{job.company}</span>
                    </div>
                    <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/30">
                      {job.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{job.description}</p>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-extrabold text-gray-300 bg-black/60 p-2 rounded-xl border border-white/5">
                    <span className="text-emerald-400">${job.weeklySalary}/week</span>
                    <span className="text-amber-400">-{job.energyCost} Energy/wk</span>
                    <span className="text-sky-300">{job.maxWeeks} Wks Contract</span>
                  </div>

                  {job.isEntertainment && (
                    <div className="text-[10px] font-black text-purple-300 bg-purple-500/10 p-2 rounded-xl border border-purple-500/20 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Entertainment Perk: Boosts weekly networking & fame contacts.</span>
                    </div>
                  )}
                </div>

                <button
                  disabled={isEmployed || activeJobs.length >= 2}
                  onClick={() => handleApplyJob(job)}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-lg mt-2 ${
                    isEmployed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : activeJobs.length >= 2
                      ? 'bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed'
                      : 'bg-amber-400 text-black hover:scale-102'
                  }`}
                >
                  {isEmployed ? 'CURRENTLY EMPLOYED' : activeJobs.length >= 2 ? 'JOB SLOTS FULL (2/2)' : 'APPLY & ACCEPT POSITION'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
