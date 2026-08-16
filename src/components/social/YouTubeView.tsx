/**
 * HOLLYWOOD RISING - CREATOR HQ (YouTube rebuild, Option C)
 * Authority ladder (cold start → premium creator) with HARD weekly view caps
 * — 1M lifetime views takes 1-2 game years. Upload 6 video types, schedule
 * to audience slots, watch the Algorithm Machine grade each upload, and
 * bank ad revenue in the YT mini-bank: transfers deduct 20% tax and clear
 * to the wallet in 1-5 weeks with an inbox notice.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  SocialsService,
  SocialsState,
  YT_AUTHORITY_TIERS,
  YT_SLOTS,
  ytAuthorityTier,
  computeYtAlgoScore,
  YouTubeVideo,
} from '../../services/socialsService';

const THUMB_POOL = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop',
];

const VIDEO_TYPES: Array<{ cat: YouTubeVideo['category']; icon: string; name: string; meta: string; lockSubs?: number }> = [
  { cat: 'VLOG', icon: '📹', name: 'Vlog', meta: 'cheap · personal pull' },
  { cat: 'BEHIND_SCENES', icon: '🎬', name: 'BTS Film Special', meta: 'needs a movie in prod/theaters' },
  { cat: 'INTERVIEW', icon: '🎤', name: 'Fan Q&A', meta: 'comment-driven' },
  { cat: 'TRAILER', icon: '👁️', name: 'Reaction', meta: 'rides trending trailers' },
  { cat: 'AWARD_SPEECH', icon: '🏆', name: 'Award Moment', meta: 'needs trophy relevance' },
  { cat: 'LIVESTREAM', icon: '🎙️', name: 'Live Premiere', meta: 'super chats · steady niche', lockSubs: 25000 },
];

const gradeFor = (views: number): { g: string; cls: string } => {
  if (views >= 200000) return { g: 'S', cls: 'bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white' };
  if (views >= 50000) return { g: 'A', cls: 'bg-emerald-500 text-emerald-950' };
  if (views >= 5000) return { g: 'B', cls: 'bg-amber-400 text-amber-950' };
  if (views >= 500) return { g: 'C', cls: 'bg-sky-500 text-sky-950' };
  return { g: 'D', cls: 'bg-slate-500 text-white' };
};

export const YouTubeView: React.FC<{ onBack: () => void }> = () => {
  const { player, releasedMovies, saveData } = useGame();
  const [tab, setTab] = useState<'HOME' | 'STUDIO' | 'BANK' | 'CHANNEL'>('HOME');
  const [fb, setFb] = useState<string | null>(null);
  const [fbOk, setFbOk] = useState(true);
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());

  // composer state
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<YouTubeVideo['category']>('VLOG');
  const [slotId, setSlotId] = useState('sat_7pm');
  const [weeksOut, setWeeksOut] = useState(1);

  // bank state
  const [payoutAmt, setPayoutAmt] = useState('');

  const refresh = () => setState(SocialsService.getState());
  const xp = state.youtubeAuthorityXp || 0;
  const tier = ytAuthorityTier(xp);
  const nextTier = YT_AUTHORITY_TIERS.find((t) => t.minXp > xp);
  const pctToNext = nextTier ? Math.round(((xp - tier.minXp) / (nextTier.minXp - tier.minXp)) * 100) : 100;

  const subs = state.youtubeSubscribers || 0;
  const videos = (state.youtubeVideos || []) as YouTubeVideo[];
  const scheduled = state.youtubeScheduled || [];
  const pendingPayouts = state.youtubePendingPayouts || [];
  const balance = state.youtubeBalance || 0;
  const monetized = state.youtubeMonetizationStatus === 'APPROVED';
  const latestMovie = releasedMovies[0];
  const filming = (saveData.bookedProjects || []).some((b: any) => !b.isFilmingComplete);
  const hasActiveMovie = !!(latestMovie && ((latestMovie as any).inCinemas || filming));

  const showFb = (msg: string, ok = true) => { setFbOk(ok); setFb(msg); setTimeout(() => setFb(null), 4500); };

  // live algorithm machine
  const slot = YT_SLOTS.find((s) => s.id === slotId) || YT_SLOTS[0];
  const liveScore = computeYtAlgoScore({ title: title || 'Untitled', category: cat, slotBoost: slot.boost, authorityXp: xp, hasActiveMovie });

  const suggestedTitles = latestMovie
    ? [`${latestMovie.movieTitle} — 30 Days Behind The Scenes`, `My First Day on ${latestMovie.movieTitle}`, `${latestMovie.movieTitle} Q&A — you asked everything`]
    : ['Day in the Life of a Hollywood Actor', '5 Things I Learned in Acting Class', 'Training Week — the unglamorous truth'];

  const doSchedule = () => {
    const res = SocialsService.scheduleYouTubeVideo({
      title: title.trim() || suggestedTitles[0],
      category: cat,
      slotId,
      weeksFromNow: weeksOut,
      hasActiveMovie,
    });
    showFb(res.message, res.success);
    if (res.success) setTitle('');
    refresh();
  };

  const cancelScheduled = (id: string) => {
    state.youtubeScheduled = (state.youtubeScheduled || []).filter((s) => s.id !== id);
    SocialsService.saveState(state);
    refresh();
  };

  const doPayout = () => {
    const res = SocialsService.requestYouTubePayout(parseInt(payoutAmt) || 0);
    showFb(res.message, res.success);
    if (res.success) setPayoutAmt('');
    refresh();
  };

  return (
    <div className="flex flex-col gap-3 pb-6" style={{ background: 'linear-gradient(170deg,#120d1f,#0a0714)', minHeight: '100%' }}>
      <style>{`@keyframes hqShine { to { left: 130%; } }`}</style>

      {/* header + tier banner */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center text-lg shadow-lg shadow-fuchsia-500/30">▶️</div>
            <div>
              <b className="text-white text-sm block">Creator HQ</b>
              <span className="text-[8px] text-gray-400 tracking-[2px]">{subs.toLocaleString()} SUBS · {(state.youtubeTotalViews || 0).toLocaleString()} LIFETIME VIEWS</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(['HOME', 'STUDIO', 'BANK', 'CHANNEL'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-2.5 py-1.5 rounded-lg text-[8.5px] font-black cursor-pointer ${tab === t ? 'bg-fuchsia-500 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* authority ladder */}
        <div className="rounded-2xl border border-fuchsia-400/30 bg-gradient-to-r from-fuchsia-500/10 to-rose-500/5 p-3 relative overflow-hidden">
          <div className="absolute top-0 bottom-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12" style={{ animation: 'hqShine 4s 1s linear infinite' }} />
          <div className="flex justify-between items-center">
            <div>
              <b className="text-[11px] text-fuchsia-200 block">
                {tier.tier === 1 ? '🧊' : tier.tier === 5 ? '👑' : '📈'} TIER {tier.tier} — {tier.name.toUpperCase()}
              </b>
              <span className="text-[8px] text-gray-400">weekly push capped at {tier.weeklyViewCap.toLocaleString()} views · RPM {tier.rpm ? `$${tier.rpm.toFixed(1)}` : 'not monetized'}</span>
            </div>
            {nextTier ? (
              <div className="text-right">
                <b className="text-fuchsia-200 text-sm font-mono">{pctToNext}%</b>
                <span className="text-[6.5px] text-gray-400 block tracking-wider">TO TIER {nextTier.tier}</span>
              </div>
            ) : (
              <b className="text-fuchsia-300 text-[10px]">MAX TIER</b>
            )}
          </div>
          <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
            <i className="block h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500" style={{ width: `${pctToNext}%` }} />
          </div>
          <div className="flex justify-between text-[6.5px] text-gray-500 font-bold mt-1">
            <span>AUTHORITY {xp} XP · STREAK {state.youtubeUploadStreak || 0}W</span>
            {nextTier && <span>TIER {nextTier.tier} "{nextTier.name.toUpperCase()}" = {nextTier.tier >= 3 ? '3×+' : ''} BIGGER TEST AUDIENCES</span>}
          </div>
        </div>

        {fb && (
          <div className={`p-2.5 rounded-xl border text-[10px] font-bold ${fbOk ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300' : 'bg-rose-500/10 border-rose-400/30 text-rose-300'}`}>{fb}</div>
        )}
      </div>

      {/* ================= STUDIO ================= */}
      {tab === 'STUDIO' && (
        <div className="px-3 space-y-3">
          {/* Algorithm Machine (live) */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <div className="flex justify-between items-center mb-3">
              <b className="text-[11px] text-fuchsia-200">🤖 THE ALGORITHM MACHINE</b>
              <span className="text-[7.5px] text-gray-500 font-mono">LIVE PRE-FLIGHT</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-[84px] h-[84px] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-fuchsia-500/25"
                style={{ background: `conic-gradient(#d946ef 0deg ${Math.round((liveScore.score / 100) * 360)}deg, rgba(255,255,255,0.08) ${Math.round((liveScore.score / 100) * 360)}deg 360deg)` }}>
                <div className="w-[64px] h-[64px] rounded-full bg-[#0d0918] flex flex-col items-center justify-center">
                  <b className="text-xl font-mono text-fuchsia-200">{liveScore.score}</b>
                  <span className="text-[5.5px] text-gray-500 tracking-widest">PUSH SCORE</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {liveScore.factors.map((f) => (
                  <div key={f.label}>
                    <div className="flex justify-between text-[8px] mb-0.5">
                      <span className="text-gray-400 font-bold">{f.label}</span>
                      <b className="font-mono" style={{ color: f.value >= 70 ? '#4ade80' : f.value >= 40 ? '#fbbf24' : '#fb7185' }}>{f.value}</b>
                    </div>
                    <div className="h-[3.5px] rounded-full bg-white/10 overflow-hidden">
                      <i className="block h-full rounded-full" style={{ width: `${f.value}%`, background: f.value >= 70 ? '#4ade80' : f.value >= 40 ? '#fbbf24' : '#fb7185' }} />
                    </div>
                    <p className="text-[6.5px] text-gray-500 mt-0.5 leading-tight">{f.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* title */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
            <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block">TITLE — THE ALGORITHM SCANS THIS</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={suggestedTitles[0]}
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-[11px] text-white outline-none focus:border-fuchsia-400/50" />
            <div className="flex flex-wrap gap-1.5">
              {suggestedTitles.map((s) => (
                <button key={s} onClick={() => setTitle(s)} className="text-[7.5px] font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-gray-300 cursor-pointer">⚡ {s.slice(0, 32)}{s.length > 32 ? '…' : ''}</button>
              ))}
            </div>
          </div>

          {/* video types */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block mb-2">VIDEO TYPE — EACH FEEDS THE ALGORITHM DIFFERENTLY</label>
            <div className="grid grid-cols-3 gap-2">
              {VIDEO_TYPES.map((vt) => {
                const locked = vt.lockSubs ? subs < vt.lockSubs : false;
                const on = cat === vt.cat;
                return (
                  <button key={vt.cat} disabled={locked} onClick={() => setCat(vt.cat)}
                    className={`relative rounded-xl border-1.5 p-2 text-center cursor-pointer border ${on ? 'border-fuchsia-400 bg-fuchsia-500/10' : 'border-white/10 bg-white/[0.03]'} ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {locked && <span className="absolute top-1 right-1 text-[6px] font-black bg-black/70 rounded-full px-1.5 py-0.5">🔒 {((vt.lockSubs || 0) / 1000)}K</span>}
                    <span className="text-lg block">{vt.icon}</span>
                    <b className="text-[8px] block mt-0.5 text-gray-100">{vt.name}</b>
                    <span className="text-[6px] text-gray-500 block leading-tight">{vt.meta}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* schedule: week + slot */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-3">
            <div>
              <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block mb-2">PUBLISH IN</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((w) => (
                  <button key={w} onClick={() => setWeeksOut(w)}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black cursor-pointer border ${weeksOut === w ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                    {w} WK{w > 1 ? 'S' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block mb-2">TIME SLOT — YOUR AUDIENCE'S LIVE WINDOWS</label>
              <div className="space-y-1.5">
                {YT_SLOTS.map((s) => (
                  <button key={s.id} onClick={() => setSlotId(s.id)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 border cursor-pointer text-left ${slotId === s.id ? 'border-fuchsia-400 bg-fuchsia-500/10' : s.boost >= 1.15 ? 'border-emerald-400/40 bg-emerald-500/5' : 'border-white/10 bg-white/[0.03]'}`}>
                    <span className="text-sm">{s.boost >= 1.15 ? '🔥' : s.boost >= 1.08 ? '🌆' : '☀️'}</span>
                    <span className="flex-1 min-w-0">
                      <b className="text-[10px] block text-gray-100">{s.label}</b>
                      <span className="text-[7px] text-gray-500 block">{s.hint}</span>
                    </span>
                    <b className={`text-[9.5px] font-mono shrink-0 ${s.boost >= 1.15 ? 'text-emerald-300' : 'text-amber-300'}`}>+{Math.round((s.boost - 1) * 100)}%</b>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={doSchedule}
            className="w-full py-3 rounded-2xl text-[11px] font-black text-white cursor-pointer bg-gradient-to-r from-fuchsia-500 to-rose-500 shadow-lg shadow-fuchsia-500/30">
            SCHEDULE — {slot.label.toUpperCase()} · SCORE {liveScore.score}
          </button>

          {/* scheduled queue */}
          {scheduled.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
              <b className="text-[9px] font-black text-gray-400 tracking-[1.5px] block">🗓️ SCHEDULED QUEUE</b>
              {scheduled.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <b className="text-[10px] block truncate text-gray-100">{s.title}</b>
                    <span className="text-[7.5px] text-gray-500">WK {s.publishWeek} · {s.publishYear} · {s.slotLabel} · score {s.algoScore}</span>
                  </div>
                  <button onClick={() => cancelScheduled(s.id)} className="text-[9px] text-rose-400 font-black cursor-pointer shrink-0">CANCEL</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= BANK ================= */}
      {tab === 'BANK' && (
        <div className="px-3 space-y-3">
          {/* balance card */}
          <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-4">
            <span className="text-[8px] font-black text-emerald-300 tracking-[2px]">CREATOR BANK — YT MINI-BANK</span>
            <b className="text-3xl font-mono text-emerald-300 block mt-1">${balance.toLocaleString()}</b>
            <div className="flex justify-between text-[8px] text-gray-400 mt-2 font-mono">
              <span>+${(state.creatorStudio?.weeklyAdRevenue || 0).toLocaleString()} accrued this week</span>
              <span>RPM ${tier.rpm.toFixed(1)} / 1K views</span>
            </div>
          </div>

          {/* monetization status */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <div className="flex justify-between items-center mb-2">
              <b className="text-[10px] text-gray-200">Partner Program</b>
              <span className={`text-[8px] font-black px-2.5 py-1 rounded-full ${monetized ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/40' : 'bg-white/5 text-gray-400 border border-white/15'}`}>
                {state.youtubeMonetizationStatus}
              </span>
            </div>
            {!monetized && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px]"><span className="text-gray-400">Subscribers</span><b className="font-mono">{subs.toLocaleString()} / 1,000</b></div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><i className="block h-full bg-fuchsia-500" style={{ width: `${Math.min(100, (subs / 1000) * 100)}%` }} /></div>
                  <div className="flex justify-between text-[8px]"><span className="text-gray-400">Watch hours</span><b className="font-mono">{Math.round(state.youtubeWatchHours || 0).toLocaleString()} / 4,000</b></div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden"><i className="block h-full bg-fuchsia-500" style={{ width: `${Math.min(100, ((state.youtubeWatchHours || 0) / 4000) * 100)}%` }} /></div>
                </div>
                {state.youtubeMonetizationStatus === 'ELIGIBLE' && (
                  <p className="text-[8px] text-amber-300 mt-2 font-bold">You're ELIGIBLE — apply from the Studio monetization panel.</p>
                )}
              </>
            )}
          </div>

          {/* transfer */}
          {monetized && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2.5">
              <b className="text-[10px] text-gray-200 block">TRANSFER TO WALLET</b>
              <p className="text-[8px] text-gray-500 leading-relaxed">20% tax is withheld at request. Transfers clear in 1-5 weeks — you'll get an inbox notice the moment funds land.</p>
              <div className="flex gap-2">
                <input type="number" value={payoutAmt} onChange={(e) => setPayoutAmt(e.target.value)} placeholder="Amount"
                  className="flex-1 min-w-0 bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-[12px] font-mono text-white outline-none" />
                <button onClick={() => setPayoutAmt(String(balance))} className="px-3 rounded-xl bg-white/10 border border-white/15 text-[9px] font-black text-gray-200 cursor-pointer">MAX</button>
              </div>
              {payoutAmt && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-[8.5px] font-mono space-y-1">
                  <div className="flex justify-between text-gray-400"><span>Gross</span><b className="text-gray-200">${(parseInt(payoutAmt) || 0).toLocaleString()}</b></div>
                  <div className="flex justify-between text-gray-400"><span>Tax (20%)</span><b className="text-rose-300">−${Math.round((parseInt(payoutAmt) || 0) * 0.2).toLocaleString()}</b></div>
                  <div className="flex justify-between text-gray-400 border-t border-white/10 pt-1"><span>You receive (in 1-5 wks)</span><b className="text-emerald-300">${((parseInt(payoutAmt) || 0) - Math.round((parseInt(payoutAmt) || 0) * 0.2)).toLocaleString()}</b></div>
                </div>
              )}
              <button onClick={doPayout} className="w-full py-3 rounded-xl bg-emerald-500 text-emerald-950 text-[11px] font-black cursor-pointer">REQUEST TRANSFER</button>
            </div>
          )}

          {/* pending payouts */}
          {pendingPayouts.length > 0 && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/5 p-3.5 space-y-2">
              <b className="text-[9px] font-black text-amber-300 tracking-[1.5px] block">⏳ TRANSFERS IN FLIGHT</b>
              {pendingPayouts.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <div className="flex-1">
                    <div className="flex justify-between text-[8.5px] font-mono mb-1">
                      <span className="text-gray-300">${p.net.toLocaleString()} clearing</span>
                      <span className="text-amber-300">{p.weeksRemaining} wk{p.weeksRemaining > 1 ? 's' : ''} left</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <i className="block h-full rounded-full bg-amber-400" style={{ width: `${((p.totalWeeks - p.weeksRemaining) / p.totalWeeks) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= HOME (graded videos) ================= */}
      {tab === 'HOME' && (
        <div className="px-3 space-y-2.5">
          {videos.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-white/10 bg-black/30">
              <span className="text-3xl block">🎬</span>
              <p className="text-[11px] text-gray-300 font-bold mt-2">No videos yet.</p>
              <p className="text-[8.5px] text-gray-500 mt-1">Head to STUDIO — schedule your first upload and start the cold-start climb.</p>
            </div>
          ) : (
            videos.slice(0, 15).map((v, i) => {
              const { g, cls } = gradeFor(v.views || 0);
              return (
                <div key={v.id} className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex">
                  <div className="relative w-28 shrink-0">
                    <img src={THUMB_POOL[i % THUMB_POOL.length]} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 right-1.5 text-[8px] bg-black/80 px-1.5 py-0.5 rounded font-bold">{v.duration || '10:00'}</span>
                  </div>
                  <div className="p-2.5 flex-1 min-w-0 flex gap-2">
                    <div className="flex-1 min-w-0">
                      <b className="text-[10px] text-white block line-clamp-2 leading-tight">{v.title}</b>
                      <span className="text-[7.5px] text-gray-500 block mt-1">
                        {(v.views || 0).toLocaleString()} views · {v.likes?.toLocaleString()} likes · score {v.algoScore ?? '—'}
                      </span>
                      <span className="text-[7px] text-gray-600 block">WK {v.uploadWeek} · {v.uploadYear} · {v.category.replace('_', ' ')}</span>
                    </div>
                    <span className={`w-7 h-7 rounded-lg ${cls} text-[12px] font-black flex items-center justify-center shrink-0 self-center`}>{g}</span>
                  </div>
                </div>
              );
            })
          )}

          {/* NPC videos */}
          {(state.npcYouTubeChannels || []).length > 0 && (
            <div className="pt-1">
              <b className="text-[9px] font-black text-gray-400 tracking-[1.5px] block mb-2">🔥 TRENDING ON STARTUBE</b>
              {(state.npcYouTubeChannels || []).slice(0, 3).map((npc) => (
                <div key={npc.id} className="rounded-2xl border border-white/5 bg-black/30 overflow-hidden flex mb-2">
                  <div className="w-24 shrink-0 bg-white/5 flex items-center justify-center text-xl">{npc.category === 'MOVIE_REVIEWS' ? '🎞️' : '📺'}</div>
                  <div className="p-2.5 flex-1 min-w-0">
                    <b className="text-[9.5px] text-gray-200 block line-clamp-2 leading-tight">{npc.latestVideo?.title || `${npc.name} weekly upload`}</b>
                    <span className="text-[7.5px] text-gray-500 block mt-1">{npc.name} · {((npc.latestVideo?.views) || 0).toLocaleString()} views</span>
                    <span className="text-[7px] text-gray-600">{npc.subscribers.toLocaleString()} subs{npc.verified ? ' · ✓' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= CHANNEL ================= */}
      {tab === 'CHANNEL' && (
        <div className="px-3 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-center gap-3.5">
            <img src={player.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-fuchsia-400/50" />
            <div className="flex-1 min-w-0">
              <b className="text-white text-sm block truncate">{player.firstName} {player.lastName}</b>
              <span className="text-[8px] text-gray-400 block">{subs.toLocaleString()} subscribers · {(state.youtubeTotalViews || 0).toLocaleString()} views</span>
              <span className="text-[7.5px] text-fuchsia-300 font-black block mt-0.5">TIER {tier.tier} — {tier.name.toUpperCase()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['LIFETIME UPLOADS', (state.youtubeLifetimeUploads || 0).toString()],
              ['UPLOAD STREAK', `${state.youtubeUploadStreak || 0} weeks`],
              ['WATCH HOURS', Math.round(state.youtubeWatchHours || 0).toLocaleString()],
              ['AUTHORITY XP', `${xp} / ${nextTier ? nextTier.minXp : 'MAX'}`],
              ['WEEKLY VIEW CAP', tier.weeklyViewCap.toLocaleString()],
              ['MONETIZATION', state.youtubeMonetizationStatus],
            ].map(([c, v]) => (
              <div key={c} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5">
                <span className="text-[6.5px] text-gray-500 tracking-wider block">{c}</span>
                <b className="text-[11px] font-mono text-gray-100">{v}</b>
              </div>
            ))}
          </div>
          <p className="text-[8px] text-gray-500 leading-relaxed px-1">
            The climb: Tier 2 ≈ 3 months of consistent uploads. 1M lifetime views typically arrives at Tier 4 — about 1-2 years of weekly uploads. Skipped weeks bleed authority (−4 XP). The algorithm rewards nothing except showing up.
          </p>
        </div>
      )}
    </div>
  );
};
