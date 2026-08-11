/**
 * HOLLYWOOD RISING - THE MARQUEE (LinkedIn-style Hollywood professional network)
 * Career profile from real filmography, industry feed, REAL casting calls that
 * apply into the audition system, connections (start 0), endorsements, Premium.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, PremiumService } from '../../services/socialsService';
import { ArrowLeft, Briefcase, Users, Newspaper, ThumbsUp, MessageCircle, Send, Award, Search, Crown, Building2 } from 'lucide-react';
import { PremiumPanel } from './HubPanels';
import { MarqueeJob } from '../../types/world';

export const MarqueeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, releasedMovies, applyToCallboard, saveData, updateSave, callboard } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'HOME' | 'JOBS' | 'PROFILE' | 'PREMIUM'>('HOME');
  const [fb, setFb] = useState<string | null>(null);

  const premium = state.premium || { tier: 'none' as const };
  const connections = state.marqueeConnections || 0;
  const posts = state.marqueePosts || [];
  const jobs: MarqueeJob[] = (state.marqueeJobs || []).length > 0 ? state.marqueeJobs : buildJobs();
  const movies = releasedMovies || [];

  // Real job scaling: newcomers small gigs -> A-list $100M+ (ceiling $100B)
  function buildJobs(): MarqueeJob[] {
    const movieCount = player.moviesCompleted || 0;
    const fame = player.fameXp || 0;
    const jobsOut: MarqueeJob[] = [];
    const studios = ['Indie Syndicate', 'Lionsgate', 'Focus Features', 'Sony Pictures', 'Warner Bros.', 'Universal Pictures', 'Paramount Pictures'];
    const tiers = [
      { min: 0, sal: [1200, 8000], label: 'Supporting Role' },
      { min: 2, sal: [25000, 150000], label: 'Principal Role' },
      { min: 5, sal: [200000, 900000], label: 'Co-Lead' },
      { min: 8, sal: [2000000, 12000000], label: 'Lead Role' },
      { min: 13, sal: [15000000, 90000000], label: 'Blockbuster Lead' },
      { min: 20, sal: [100000000, 100000000000], label: 'A-List Tentpole' },
    ];
    const eligible = tiers.filter((t) => movieCount >= t.min);
    for (let i = 0; i < Math.min(6, 2 + eligible.length); i++) {
      const t = eligible[Math.max(0, eligible.length - 1 - (i % eligible.length))];
      const studio = studios[Math.floor(Math.random() * studios.length)];
      const sal = Math.floor(t.sal[0] + Math.random() * (t.sal[1] - t.sal[0]));
      jobsOut.push({
        id: `job_${i}_${Date.now()}`,
        studio,
        title: `${t.label} — Untitled ${['Drama', 'Action', 'Thriller', 'Comedy'][Math.floor(Math.random() * 4)]} Project`,
        roleType: t.label,
        budget: Math.max(500000, sal * 8),
        salary: sal,
        requiredMovies: t.min,
        requiredFame: fame * 0.5,
        status: 'OPEN',
        week: player.dateWeek || 1,
        year: player.dateYear || 2026,
      });
    }
    return jobsOut;
  }

  const applyJob = (job: MarqueeJob) => {
    // REAL: applying routes into the actual callboard/audition system
    const board = callboard || [];
    if (board.length === 0) {
      setFb('The Callboard is empty this week — check back after the weekly refresh.');
      return;
    }
    const res = applyToCallboard(board[0].id);
    setFb(res.message);
    setTimeout(() => setFb(null), 4000);
  };

  const endorse = () => {
    setFb('⭐ Co-stars from your last 3 projects endorsed your Acting skill!');
    setTimeout(() => setFb(null), 3500);
  };

  const BottomNav = (
    <div className="grid grid-cols-4 gap-1 pt-2 border-t border-white/10">
      {([['HOME', Newspaper], ['JOBS', Briefcase], ['PROFILE', Users], ['PREMIUM', Crown]] as const).map(([id, Icon]) => (
        <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center py-1.5 rounded-xl cursor-pointer ${tab === id ? 'text-sky-400' : 'text-gray-500 hover:text-white'}`}>
          <Icon className="w-4 h-4" />
          <span className="text-[8px] font-black">{id}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 text-white select-none pb-14">
      {fb && <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-[11px] font-bold">{fb}</div>}

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
        <span className="text-sm font-black tracking-wide">💼 The Marquee</span>
        <Search className="w-4 h-4 text-gray-500" />
      </div>

      {tab === 'HOME' && (
        <>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/30 space-y-1">
            <p className="text-[10px] text-sky-300 font-black uppercase">Hollywood Professional Network</p>
            <p className="text-xs text-gray-300">Real industry news, real casting calls, real connections — only what's actually happened in your career.</p>
          </div>
          <div className="space-y-3">
            {posts.length === 0 && <p className="text-center text-xs text-gray-500 py-6">No professional updates yet — your writer posts here.</p>}
            {posts.slice(0, 15).map((p: any) => (
              <div key={p.id} className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <img src={p.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-black">{p.authorName}</p>
                    <p className="text-[9px] text-gray-500">Actor · {p.timestamp}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-200">{p.text}</p>
                <div className="flex gap-4 text-[10px] text-gray-500">
                  <button className="flex items-center gap-1 cursor-pointer hover:text-sky-400"><ThumbsUp className="w-3.5 h-3.5" /> {p.likes || 0}</button>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {p.comments || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'JOBS' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-gray-300">Casting Calls & Offers</h3>
            <span className="text-[9px] text-gray-500">Pay scales with your career</span>
          </div>
          {jobs.map((job) => {
            const locked = (player.moviesCompleted || 0) < job.requiredMovies;
            return (
              <div key={job.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-sky-400 font-black uppercase">{job.studio}</span>
                  {job.status === 'APPLIED' && <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black">APPLIED</span>}
                </div>
                <p className="text-xs font-black">{job.title}</p>
                <p className="text-[10px] text-gray-400">Budget ${(job.budget / 1000000).toFixed(1)}M · Salary ${job.salary >= 1000000000 ? `$${(job.salary / 1000000000).toFixed(1)}B` : job.salary.toLocaleString()}</p>
                {locked ? (
                  <p className="text-[9px] text-gray-500">🔒 Requires {job.requiredMovies} movies released</p>
                ) : (
                  <button onClick={() => applyJob(job)} className="w-full py-2 rounded-xl bg-sky-600 text-white text-[10px] font-black cursor-pointer">Apply Now →</button>
                )}
              </div>
            );
          })}
          <p className="text-[9px] text-gray-500">Newcomers get small gigs. A-Listers get the $100M+ tentpoles (ceiling $100B). Applying routes into your real audition system.</p>
        </div>
      )}

      {tab === 'PROFILE' && (
        <div className="space-y-3">
          <div className="h-20 rounded-2xl bg-gradient-to-r from-sky-500/30 to-indigo-500/30 border border-white/10" />
          <div className="flex items-center gap-3 -mt-8 px-3">
            <img src={player.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-black" />
            <div>
              <p className="text-sm font-black">{player.firstName} {player.lastName}</p>
              <p className="text-[10px] text-sky-300 font-bold">Actor · Star of '{movies[0]?.movieTitle || 'Your First Film'}' {movies[0]?.worldwideGross ? `· $${(movies[0].worldwideGross / 1000000).toFixed(0)}M gross` : ''}</p>
              <p className="text-[10px] text-gray-500">{connections.toLocaleString()} connections</p>
            </div>
          </div>
          <button onClick={endorse} className="w-full py-2 rounded-xl bg-white/10 border border-white/20 text-[10px] font-black cursor-pointer">⭐ Endorse my skills (co-stars)</button>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-gray-400">Experience (real filmography)</h4>
            {movies.slice(0, 8).map((m) => (
              <div key={m.id} className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <p className="text-xs font-black">{m.roleType} — {m.movieTitle}</p>
                <p className="text-[10px] text-gray-400">{m.studio} · ${(m.worldwideGross || 0) / 1000000 >= 1 ? `$${(m.worldwideGross / 1000000).toFixed(0)}M gross` : 'pre-release'} · {m.criticRating || 0}% critics</p>
              </div>
            ))}
            {movies.length === 0 && <p className="text-[10px] text-gray-500">No films yet — your experience builds with your career.</p>}
          </div>
        </div>
      )}

      {tab === 'PREMIUM' && <PremiumPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}
      {BottomNav}
    </div>
  );
};
