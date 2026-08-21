/**
 * HOLLYWOOD RISING - GRAM CREATOR HQ (Instagram rebuild, Option C)
 * Reach-tier ladder (test audience → explore batches → gram elite) with HARD
 * weekly reach caps. NO fake followers: reach converts at a small real rate
 * into the account's true follower count. Bonus revenue accrues to the IG
 * mini-bank (unlocks at 10K real followers); transfers deduct 20% tax and
 * clear in 1-5 weeks with an inbox notice.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialBankPanel } from './SocialBankPanel';
import {
  SocialsService,
  SocialsState,
  IG_AUTHORITY_TIERS,
  IG_SLOTS,
  igAuthorityTier,
  computeIgAlgoScore,
  InstagramCreatorPost,
  PremiumService,
} from '../../services/socialsService';

const POST_TYPES: Array<{ t: InstagramCreatorPost['postType']; icon: string; name: string; meta: string; lockFollowers?: number }> = [
  { t: 'BTS', icon: '🎠', name: 'BTS Carousel', meta: 'needs movie live' },
  { t: 'REEL', icon: '🎬', name: 'Reel', meta: 'the Explore ticket' },
  { t: 'CAROUSEL', icon: '🖼️', name: 'Carousel', meta: 'swipe depth · saves' },
  { t: 'PHOTO', icon: '📷', name: 'Photo', meta: 'single · safe' },
  { t: 'STORY', icon: '⭕', name: 'Story Poll', meta: '24h engagement' },
  { t: 'COLLAB', icon: '🤝', name: 'Brand Collab', meta: 'paid partnership', lockFollowers: 10000 },
];

const gradeFor = (reach: number): { g: string; cls: string } => {
  if (reach >= 500000) return { g: 'S', cls: 'bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white' };
  if (reach >= 100000) return { g: 'A', cls: 'bg-emerald-500 text-emerald-950' };
  if (reach >= 10000) return { g: 'B', cls: 'bg-amber-400 text-amber-950' };
  if (reach >= 1000) return { g: 'C', cls: 'bg-sky-500 text-sky-950' };
  return { g: 'D', cls: 'bg-slate-500 text-white' };
};

export const InstagramView: React.FC<{ onBack: () => void }> = () => {
  const { player, releasedMovies, saveData } = useGame();
  const [tab, setTab] = useState<'HOME' | 'STUDIO' | 'BANK' | 'PROFILE'>('HOME');
  const [fb, setFb] = useState<string | null>(null);
  const [fbOk, setFbOk] = useState(true);
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());

  // composer
  const [caption, setCaption] = useState('');
  const [ptype, setPtype] = useState<InstagramCreatorPost['postType']>('BTS');
  const [slotId, setSlotId] = useState('sat_7pm');
  const [weeksOut, setWeeksOut] = useState(1);

  // bank
  const [payoutAmt, setPayoutAmt] = useState('');

  const refresh = () => setState(SocialsService.getState());

  const xp = state.instagramAuthorityXp || 0;
  const tier = igAuthorityTier(xp);
  const nextTier = IG_AUTHORITY_TIERS.find((t) => t.minXp > xp);
  const pctToNext = nextTier ? Math.round(((xp - tier.minXp) / (nextTier.minXp - tier.minXp)) * 100) : 100;

  const followers = state.followers.Instagram || 0; // the account's TRUE follower count
  const creatorPosts = state.instagramCreatorPosts || [];
  const scheduled = state.instagramScheduled || [];
  const pendingPayouts = state.instagramPendingPayouts || [];
  const balance = state.instagramBalance || 0;
  const bonusActive = PremiumService.getActive(state);

  const latestMovie = releasedMovies[0];
  const filming = (saveData.bookedProjects || []).some((b: any) => !b.isFilmingComplete);
  const hasActiveMovie = !!(latestMovie && ((latestMovie as any).inCinemas || filming));

  const showFb = (msg: string, ok = true) => { setFbOk(ok); setFb(msg); setTimeout(() => setFb(null), 4500); };

  const slot = IG_SLOTS.find((s) => s.id === slotId) || IG_SLOTS[0];
  const liveScore = computeIgAlgoScore({ caption: caption || 'Untitled', postType: ptype, slotBoost: slot.boost, authorityXp: xp, hasActiveMovie });

  const suggestedCaptions = latestMovie
    ? [`30 days on the set of ${latestMovie.movieTitle}`, `One frame from ${latestMovie.movieTitle} that made me cry`, `First look — ${latestMovie.movieTitle} BTS`]
    : ['Day 47 of chasing this dream', '5 things acting school never taught me', 'The audition that changed everything'];

  const doSchedule = () => {
    const res = SocialsService.scheduleInstagramPost({
      caption: caption.trim() || suggestedCaptions[0],
      postType: ptype,
      slotId,
      weeksFromNow: weeksOut,
      hasActiveMovie,
    });
    showFb(res.message, res.success);
    if (res.success) setCaption('');
    refresh();
  };

  const cancelScheduled = (id: string) => {
    state.instagramScheduled = (state.instagramScheduled || []).filter((s) => s.id !== id);
    SocialsService.saveState(state);
    refresh();
  };

  const doPayout = () => {
    const res = SocialsService.requestInstagramPayout(parseInt(payoutAmt) || 0);
    showFb(res.message, res.success);
    if (res.success) setPayoutAmt('');
    refresh();
  };

  return (
    <div className="flex flex-col gap-3 pb-6" style={{ background: 'linear-gradient(170deg,#170e24,#0a0612)', minHeight: '100%' }}>
      <style>{`@keyframes igShine { to { left: 130%; } }`}</style>

      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-lg shadow-pink-500/30" style={{ background: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)' }}>📸</div>
            <div>
              <b className="text-white text-sm block">Gram HQ</b>
              <span className="text-[8px] text-gray-400 tracking-[2px]">{followers.toLocaleString()} FOLLOWERS · REAL COUNT</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(['HOME', 'STUDIO', 'BANK', 'PROFILE'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-2.5 py-1.5 rounded-lg text-[8.5px] font-black cursor-pointer ${tab === t ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* reach-tier ladder */}
        <div className="rounded-2xl border border-pink-400/30 relative overflow-hidden p-3" style={{ background: 'linear-gradient(90deg,rgba(221,42,123,0.12),rgba(129,52,175,0.05))' }}>
          <div className="absolute top-0 bottom-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12" style={{ animation: 'igShine 4s 1s linear infinite' }} />
          <div className="flex justify-between items-center">
            <div>
              <b className="text-[11px] text-pink-200 block">
                {tier.tier === 1 ? '🧊' : tier.tier === 5 ? '👑' : '📈'} TIER {tier.tier} — {tier.name.toUpperCase()}
              </b>
              <span className="text-[8px] text-gray-400">weekly reach capped at {tier.weeklyReachCap.toLocaleString()} · bonus RPM {tier.rpm ? `$${tier.rpm.toFixed(1)}` : 'locked'}</span>
            </div>
            {nextTier ? (
              <div className="text-right">
                <b className="text-pink-200 text-sm font-mono">{pctToNext}%</b>
                <span className="text-[6.5px] text-gray-400 block tracking-wider">TO TIER {nextTier.tier}</span>
              </div>
            ) : <b className="text-pink-300 text-[10px]">MAX TIER</b>}
          </div>
          <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
            <i className="block h-full rounded-full" style={{ width: `${pctToNext}%`, background: 'linear-gradient(90deg,#8134af,#dd2a7b)' }} />
          </div>
          <div className="flex justify-between text-[6.5px] text-gray-500 font-bold mt-1">
            <span>AUTHORITY {xp} XP · STREAK {state.instagramPostStreak || 0}W</span>
            {nextTier && <span>TIER {nextTier.tier} "{nextTier.name.toUpperCase()}" = BIGGER REACH CEILING</span>}
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
              <b className="text-[11px] text-pink-200">🤖 THE ALGORITHM MACHINE</b>
              <span className="text-[7.5px] text-gray-500 font-mono">LIVE PRE-FLIGHT</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-[84px] h-[84px] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/25"
                style={{ background: `conic-gradient(#dd2a7b 0deg ${Math.round((liveScore.score / 100) * 360)}deg, rgba(255,255,255,0.08) ${Math.round((liveScore.score / 100) * 360)}deg 360deg)` }}>
                <div className="w-[64px] h-[64px] rounded-full bg-[#120a1c] flex flex-col items-center justify-center">
                  <b className="text-xl font-mono text-pink-200">{liveScore.score}</b>
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

          {/* caption */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
            <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block">CAPTION — THE ALGORITHM SCANS LINE ONE</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={suggestedCaptions[0]}
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-[11px] text-white outline-none focus:border-pink-400/50" />
            <div className="flex flex-wrap gap-1.5">
              {suggestedCaptions.map((s) => (
                <button key={s} onClick={() => setCaption(s)} className="text-[7.5px] font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-gray-300 cursor-pointer">⚡ {s.slice(0, 30)}{s.length > 30 ? '…' : ''}</button>
              ))}
            </div>
          </div>

          {/* post types */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block mb-2">POST TYPE — EACH FEEDS THE ALGORITHM DIFFERENTLY</label>
            <div className="grid grid-cols-3 gap-2">
              {POST_TYPES.map((vt) => {
                const locked = vt.lockFollowers ? followers < vt.lockFollowers : false;
                const on = ptype === vt.t;
                return (
                  <button key={vt.t} disabled={locked} onClick={() => setPtype(vt.t)}
                    className={`relative rounded-xl border p-2 text-center cursor-pointer ${on ? 'border-pink-400 bg-pink-500/10' : 'border-white/10 bg-white/[0.03]'} ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {locked && <span className="absolute top-1 right-1 text-[6px] font-black bg-black/70 rounded-full px-1.5 py-0.5">🔒 10K</span>}
                    <span className="text-lg block">{vt.icon}</span>
                    <b className="text-[8px] block mt-0.5 text-gray-100">{vt.name}</b>
                    <span className="text-[6px] text-gray-500 block leading-tight">{vt.meta}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* schedule */}
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
              <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block mb-2">TIME SLOT — YOUR FOLLOWERS' SCROLL WINDOWS</label>
              <div className="space-y-1.5">
                {IG_SLOTS.map((s) => (
                  <button key={s.id} onClick={() => setSlotId(s.id)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 border cursor-pointer text-left ${slotId === s.id ? 'border-pink-400 bg-pink-500/10' : s.boost >= 1.13 ? 'border-emerald-400/40 bg-emerald-500/5' : 'border-white/10 bg-white/[0.03]'}`}>
                    <span className="text-sm">{s.boost >= 1.13 ? '🔥' : s.boost >= 1.09 ? '🌆' : '☀️'}</span>
                    <span className="flex-1 min-w-0">
                      <b className="text-[10px] block text-gray-100">{s.label}</b>
                      <span className="text-[7px] text-gray-500 block">{s.hint}</span>
                    </span>
                    <b className={`text-[9.5px] font-mono shrink-0 ${s.boost >= 1.13 ? 'text-emerald-300' : 'text-amber-300'}`}>+{Math.round((s.boost - 1) * 100)}%</b>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={doSchedule}
            className="w-full py-3 rounded-2xl text-[11px] font-black text-white cursor-pointer shadow-lg shadow-pink-500/30"
            style={{ background: 'linear-gradient(90deg,#8134af,#dd2a7b)' }}>
            SCHEDULE — {slot.label.toUpperCase()} · SCORE {liveScore.score}
          </button>

          {scheduled.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
              <b className="text-[9px] font-black text-gray-400 tracking-[1.5px] block">🗓️ SCHEDULED QUEUE</b>
              {scheduled.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <b className="text-[10px] block truncate text-gray-100">{s.caption}</b>
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
          <div className="rounded-2xl border border-emerald-400/30 p-4" style={{ background: 'linear-gradient(140deg,rgba(74,222,128,0.1),transparent)' }}>
            <span className="text-[8px] font-black text-emerald-300 tracking-[2px]">GRAM CREATOR BANK — INSTAGRAM EARNINGS</span>
            <b className="text-3xl font-mono text-emerald-300 block mt-1">${balance.toLocaleString()}</b>
            <div className="flex justify-between text-[8px] text-gray-400 mt-2 font-mono">
              <span>+${(state.instagramAccruedLastWeek || 0).toLocaleString()} accrued last week</span>
              <span>Bonus RPM {tier.rpm ? `$${tier.rpm.toFixed(1)}` : '—'} / 1K reach</span>
            </div>
          </div>

          {/* monthly envelope */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <b className="text-[10px] text-gray-200">This Month (all platforms)</b>
              <span className="text-[8px] font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-full">CAP $25,000</span>
            </div>
            <div className="flex justify-between text-[9px]"><span className="text-gray-400">Accrued so far</span><b className="font-mono text-gray-100">${(state.socialMonthlyEarnings?.accrued || 0).toLocaleString()}</b></div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <i className="block h-full bg-emerald-500" style={{ width: `${Math.min(100, ((state.socialMonthlyEarnings?.accrued || 0) / 25000) * 100)}%` }} />
            </div>
            <p className="text-[8px] text-gray-500 leading-relaxed">PAYOUTS ARE AUTOMATIC — the bank pays out on the last week of every month (no withdrawals before then). Active creators earn between the $5,000 floor and the $25,000 cap depending on reach. Instagram payouts are <b className="text-emerald-300">TAX-FREE</b> — only YouTube is taxed.</p>
          </div>

          {/* premium gate — the revenue requirement */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <div className="flex justify-between items-center mb-2">
              <b className="text-[10px] text-gray-200">Creator Bonuses</b>
              <span className={`text-[8px] font-black px-2.5 py-1 rounded-full ${bonusActive ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/40' : 'bg-white/5 text-gray-400 border border-white/15'}`}>
                {bonusActive ? 'EARNING' : 'PREMIUM REQUIRED'}
              </span>
            </div>
            {!bonusActive && <p className="text-[8px] text-gray-500 leading-relaxed">Posts only generate revenue with an ACTIVE PREMIUM subscription. Subscribe from the Premium panel — followers alone don't pay anymore.</p>}
            {bonusActive && <p className="text-[8px] text-emerald-300/80 leading-relaxed">Premium active — every creator post earns Creator Bonus revenue into this bank.</p>}
          </div>

          {/* pending payouts */}
          {pendingPayouts.length > 0 && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/5 p-3.5 space-y-2">
              <b className="text-[9px] font-black text-amber-300 tracking-[1.5px] block">⏳ MONTH-END PAYOUTS CLEARING</b>
              {pendingPayouts.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-[8.5px] font-mono mb-1">
                    <span className="text-gray-300">${p.net.toLocaleString()} clearing (no tax)</span>
                    <span className="text-amber-300">{p.weeksRemaining} wk{p.weeksRemaining > 1 ? 's' : ''} left</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <i className="block h-full rounded-full bg-amber-400" style={{ width: `${((p.totalWeeks - p.weeksRemaining) / p.totalWeeks) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= HOME (graded creator posts) ================= */}
      {tab === 'HOME' && (
        <div className="px-3 space-y-2.5">
          {creatorPosts.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-white/10 bg-black/30">
              <span className="text-3xl block">📸</span>
              <p className="text-[11px] text-gray-300 font-bold mt-2">No creator posts yet.</p>
              <p className="text-[8.5px] text-gray-500 mt-1">Head to STUDIO — schedule your first post and start the test-audience climb.</p>
            </div>
          ) : (
            creatorPosts.slice(0, 15).map((p) => {
              const { g, cls } = gradeFor(p.reach || 0);
              return (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-black/40 p-3 flex gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${cls} text-[14px] font-black flex items-center justify-center shrink-0 self-center`}>{g}</div>
                  <div className="flex-1 min-w-0">
                    <b className="text-[10.5px] text-white block line-clamp-2 leading-tight">{p.caption}</b>
                    <span className="text-[7.5px] text-gray-500 block mt-1">
                      {(p.reach || 0).toLocaleString()} reach · {(p.likes || 0).toLocaleString()} likes · {(p.saves || 0).toLocaleString()} saves · +{(p.followersGained || 0).toLocaleString()} followers
                    </span>
                    <span className="text-[7px] text-gray-600 block">WK {p.publishWeek} · {p.publishYear} · {p.postType} · {p.slotLabel} · score {p.algoScore}</span>
                  </div>
                  {bonusActive && (p.revenue || 0) > 0 && (
                    <span className="text-[8.5px] font-mono text-emerald-300 shrink-0 self-center">${(p.revenue || 0).toLocaleString()}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================= PROFILE ================= */}
      {tab === 'PROFILE' && (
        <div className="px-3 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-center gap-3.5">
            <img src={player.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-pink-400/50" />
            <div className="flex-1 min-w-0">
              <b className="text-white text-sm block truncate">{player.firstName} {player.lastName}</b>
              <span className="text-[8px] text-gray-400 block">{followers.toLocaleString()} followers · REAL COUNT</span>
              <span className="text-[7.5px] text-pink-300 font-black block mt-0.5">TIER {tier.tier} — {tier.name.toUpperCase()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['LIFETIME CREATOR POSTS', (state.instagramLifetimePosts || 0).toString()],
              ['POST STREAK', `${state.instagramPostStreak || 0} weeks`],
              ['AUTHORITY XP', `${xp} / ${nextTier ? nextTier.minXp : 'MAX'}`],
              ['WEEKLY REACH CAP', tier.weeklyReachCap.toLocaleString()],
              ['BONUS STATUS', followers >= 10000 ? 'ACTIVE' : `${(10000 - followers).toLocaleString()} TO GO`],
              ['BANK BALANCE', `$${balance.toLocaleString()}`],
            ].map(([c, v]) => (
              <div key={c} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5">
                <span className="text-[6.5px] text-gray-500 tracking-wider block">{c}</span>
                <b className="text-[11px] font-mono text-gray-100">{v}</b>
              </div>
            ))}
          <SocialBankPanel platform="instagram" accent="emerald" />
          </div>
          <p className="text-[8px] text-gray-500 leading-relaxed px-1">
            The climb: Tier 2 ≈ 3 months of consistent posting. Follower growth comes ONLY from real reach conversion (0.6-1.2% per post) — nothing is faked, ever. Skipped weeks bleed authority (−4 XP). Bonuses and the bank unlock at 10,000 real followers.
          </p>
        </div>
      )}
    </div>
  );
};
