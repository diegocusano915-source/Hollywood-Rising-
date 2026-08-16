/**
 * HOLLYWOOD RISING - X CREATOR HQ (Twitter/X rebuild)
 * Impressions-tier ladder (testing you → X elite) with HARD weekly caps.
 * NO fake followers: impressions convert at a small real rate into the
 * account's TRUE follower count. Ads revenue accrues to the X mini-bank
 * (unlocks at 5,000 real followers); transfers withhold 20% tax and clear
 * in 1-5 weeks with an inbox notice.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  SocialsService,
  SocialsState,
  TW_AUTHORITY_TIERS,
  TW_SLOTS,
  TW_PAYOUT_FOLLOWER_GATE,
  twAuthorityTier,
  computeTwAlgoScore,
  TwitterCreatorPost,
} from '../../services/socialsService';

const TWEET_TYPES: Array<{ t: TwitterCreatorPost['tweetType']; icon: string; name: string; meta: string }> = [
  { t: 'BTS_CLIP', icon: '🎬', name: 'BTS Clip', meta: 'needs movie live' },
  { t: 'HOT_TAKE', icon: '🔥', name: 'Hot Take', meta: '1.4× impressions · risky' },
  { t: 'THREAD', icon: '🧵', name: 'Thread', meta: 'depth · steady' },
  { t: 'TRENDING_REACT', icon: '📈', name: 'Trending React', meta: 'ride the wave' },
  { t: 'POLL', icon: '📊', name: 'Poll', meta: 'engagement driver' },
  { t: 'MEDIA_DROP', icon: '🖼️', name: 'Media Drop', meta: 'photos · safe' },
];

const gradeFor = (imps: number): { g: string; cls: string } => {
  if (imps >= 1000000) return { g: 'S', cls: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white' };
  if (imps >= 200000) return { g: 'A', cls: 'bg-emerald-500 text-emerald-950' };
  if (imps >= 20000) return { g: 'B', cls: 'bg-amber-400 text-amber-950' };
  if (imps >= 2000) return { g: 'C', cls: 'bg-sky-500 text-sky-950' };
  return { g: 'D', cls: 'bg-slate-500 text-white' };
};

export const TwitterXView: React.FC<{ onBack: () => void }> = () => {
  const { player, releasedMovies, saveData } = useGame();
  const [tab, setTab] = useState<'HOME' | 'STUDIO' | 'BANK' | 'PROFILE'>('HOME');
  const [fb, setFb] = useState<string | null>(null);
  const [fbOk, setFbOk] = useState(true);
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());

  // composer
  const [text, setText] = useState('');
  const [ttype, setTtype] = useState<TwitterCreatorPost['tweetType']>('BTS_CLIP');
  const [slotId, setSlotId] = useState('sat_9pm');
  const [weeksOut, setWeeksOut] = useState(1);

  // bank
  const [payoutAmt, setPayoutAmt] = useState('');

  const refresh = () => setState(SocialsService.getState());

  const xp = state.twitterAuthorityXp || 0;
  const tier = twAuthorityTier(xp);
  const nextTier = TW_AUTHORITY_TIERS.find((t) => t.minXp > xp);
  const pctToNext = nextTier ? Math.round(((xp - tier.minXp) / (nextTier.minXp - tier.minXp)) * 100) : 100;

  const followers = state.followers.Twitter || 0; // the account's TRUE follower count
  const creatorPosts = state.twitterCreatorPosts || [];
  const scheduled = state.twitterScheduled || [];
  const pendingPayouts = state.twitterPendingPayouts || [];
  const balance = state.twitterBalance || 0;
  const payoutsActive = followers >= TW_PAYOUT_FOLLOWER_GATE;

  const latestMovie = releasedMovies[0];
  const filming = (saveData.bookedProjects || []).some((b: any) => !b.isFilmingComplete);
  const hasActiveMovie = !!(latestMovie && ((latestMovie as any).inCinemas || filming));

  const showFb = (msg: string, ok = true) => { setFbOk(ok); setFb(msg); setTimeout(() => setFb(null), 4500); };

  const slot = TW_SLOTS.find((s) => s.id === slotId) || TW_SLOTS[0];
  const liveScore = computeTwAlgoScore({ text: text || 'Untitled', tweetType: ttype, slotBoost: slot.boost, authorityXp: xp, hasActiveMovie });

  const suggestedTweets = latestMovie
    ? [`Nobody understands what ${latestMovie.movieTitle} took out of me. Thread:`, `Day 30 on ${latestMovie.movieTitle}. I'm not the same person.`, `The ${latestMovie.movieTitle} trailer hid the best scene. Here it is:`]
    : ['Unpopular opinion: acting school is 90% learning how to fail loudly.', 'Day 47 of chasing this dream. Thread on what broke me:', 'Everyone wants the premiere. Nobody wants the 4AM call time.'];

  const doSchedule = () => {
    const res = SocialsService.scheduleTwitterPost({
      text: text.trim() || suggestedTweets[0],
      tweetType: ttype,
      slotId,
      weeksFromNow: weeksOut,
      hasActiveMovie,
    });
    showFb(res.message, res.success);
    if (res.success) setText('');
    refresh();
  };

  const cancelScheduled = (id: string) => {
    state.twitterScheduled = (state.twitterScheduled || []).filter((s) => s.id !== id);
    SocialsService.saveState(state);
    refresh();
  };

  const doPayout = () => {
    const res = SocialsService.requestTwitterPayout(parseInt(payoutAmt) || 0);
    showFb(res.message, res.success);
    if (res.success) setPayoutAmt('');
    refresh();
  };

  return (
    <div className="flex flex-col gap-3 pb-6" style={{ background: 'linear-gradient(170deg,#0b0f14,#050708)', minHeight: '100%' }}>
      <style>{`@keyframes xShine { to { left: 130%; } }`}</style>

      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black shadow-lg shadow-sky-500/25" style={{ background: 'linear-gradient(135deg,#1d9bf0,#0f4c75)', color: '#fff' }}>𝕏</div>
            <div>
              <b className="text-white text-sm block">X Creator HQ</b>
              <span className="text-[8px] text-gray-400 tracking-[2px]">{followers.toLocaleString()} FOLLOWERS · REAL COUNT</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(['HOME', 'STUDIO', 'BANK', 'PROFILE'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-2.5 py-1.5 rounded-lg text-[8.5px] font-black cursor-pointer ${tab === t ? 'bg-sky-500 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* impressions-tier ladder */}
        <div className="rounded-2xl border border-sky-400/30 relative overflow-hidden p-3" style={{ background: 'linear-gradient(90deg,rgba(29,155,240,0.12),rgba(15,76,117,0.06))' }}>
          <div className="absolute top-0 bottom-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12" style={{ animation: 'xShine 4s 1s linear infinite' }} />
          <div className="flex justify-between items-center">
            <div>
              <b className="text-[11px] text-sky-200 block">
                {tier.tier === 1 ? '🧊' : tier.tier === 5 ? '👑' : '📈'} TIER {tier.tier} — {tier.name.toUpperCase()}
              </b>
              <span className="text-[8px] text-gray-400">weekly impressions capped at {tier.weeklyImpressionCap.toLocaleString()} · ads RPM {tier.rpm ? `$${tier.rpm.toFixed(1)}` : 'locked'}</span>
            </div>
            {nextTier ? (
              <div className="text-right">
                <b className="text-sky-200 text-sm font-mono">{pctToNext}%</b>
                <span className="text-[6.5px] text-gray-400 block tracking-wider">TO TIER {nextTier.tier}</span>
              </div>
            ) : <b className="text-sky-300 text-[10px]">MAX TIER</b>}
          </div>
          <div className="h-1.5 rounded-full bg-white/10 mt-2 overflow-hidden">
            <i className="block h-full rounded-full" style={{ width: `${pctToNext}%`, background: 'linear-gradient(90deg,#0f4c75,#1d9bf0)' }} />
          </div>
          <div className="flex justify-between text-[6.5px] text-gray-500 font-bold mt-1">
            <span>AUTHORITY {xp} XP · STREAK {state.twitterPostStreak || 0}W</span>
            {nextTier && <span>TIER {nextTier.tier} "{nextTier.name.toUpperCase()}" = BIGGER IMPRESSION CEILING</span>}
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
              <b className="text-[11px] text-sky-200">🤖 THE ALGORITHM MACHINE</b>
              <span className="text-[7.5px] text-gray-500 font-mono">LIVE PRE-FLIGHT</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-[84px] h-[84px] rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/25"
                style={{ background: `conic-gradient(#1d9bf0 0deg ${Math.round((liveScore.score / 100) * 360)}deg, rgba(255,255,255,0.08) ${Math.round((liveScore.score / 100) * 360)}deg 360deg)` }}>
                <div className="w-[64px] h-[64px] rounded-full bg-[#050708] flex flex-col items-center justify-center">
                  <b className="text-xl font-mono text-sky-200">{liveScore.score}</b>
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

          {/* tweet composer */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
            <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block">TWEET — THE HOOK IS EVERYTHING</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={suggestedTweets[0]} rows={3} maxLength={280}
              className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-[11px] text-white outline-none focus:border-sky-400/50 resize-none" />
            <div className="flex justify-between text-[7px] text-gray-500">
              <span>{text.length}/280</span>
              <span>strong hooks: number + "Nobody/Everyone/Truth" + ?!</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTweets.map((s) => (
                <button key={s} onClick={() => setText(s)} className="text-[7.5px] font-bold bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-gray-300 cursor-pointer">⚡ {s.slice(0, 30)}{s.length > 30 ? '…' : ''}</button>
              ))}
            </div>
          </div>

          {/* tweet types */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <label className="text-[8px] font-black text-gray-400 tracking-[1.5px] block mb-2">TWEET TYPE — EACH FEEDS THE ALGORITHM DIFFERENTLY</label>
            <div className="grid grid-cols-3 gap-2">
              {TWEET_TYPES.map((vt) => {
                const on = ttype === vt.t;
                return (
                  <button key={vt.t} onClick={() => setTtype(vt.t)}
                    className={`rounded-xl border p-2 text-center cursor-pointer ${on ? 'border-sky-400 bg-sky-500/10' : 'border-white/10 bg-white/[0.03]'}`}>
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
                {TW_SLOTS.map((s) => (
                  <button key={s.id} onClick={() => setSlotId(s.id)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 border cursor-pointer text-left ${slotId === s.id ? 'border-sky-400 bg-sky-500/10' : s.boost >= 1.14 ? 'border-emerald-400/40 bg-emerald-500/5' : 'border-white/10 bg-white/[0.03]'}`}>
                    <span className="text-sm">{s.boost >= 1.14 ? '🔥' : s.boost >= 1.1 ? '🌆' : '☕'}</span>
                    <span className="flex-1 min-w-0">
                      <b className="text-[10px] block text-gray-100">{s.label}</b>
                      <span className="text-[7px] text-gray-500 block">{s.hint}</span>
                    </span>
                    <b className={`text-[9.5px] font-mono shrink-0 ${s.boost >= 1.14 ? 'text-emerald-300' : 'text-amber-300'}`}>+{Math.round((s.boost - 1) * 100)}%</b>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={doSchedule}
            className="w-full py-3 rounded-2xl text-[11px] font-black text-white cursor-pointer shadow-lg shadow-sky-500/30"
            style={{ background: 'linear-gradient(90deg,#0f4c75,#1d9bf0)' }}>
            SCHEDULE — {slot.label.toUpperCase()} · SCORE {liveScore.score}
          </button>

          {scheduled.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2">
              <b className="text-[9px] font-black text-gray-400 tracking-[1.5px] block">🗓️ SCHEDULED QUEUE</b>
              {scheduled.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <b className="text-[10px] block truncate text-gray-100">{s.text}</b>
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
            <span className="text-[8px] font-black text-emerald-300 tracking-[2px]">X CREATOR BANK — ADS REVENUE</span>
            <b className="text-3xl font-mono text-emerald-300 block mt-1">${balance.toLocaleString()}</b>
            <div className="flex justify-between text-[8px] text-gray-400 mt-2 font-mono">
              <span>+${(state.twitterAccruedLastWeek || 0).toLocaleString()} accrued last week</span>
              <span>Ads RPM {tier.rpm ? `$${tier.rpm.toFixed(1)}` : '—'} / 1K impressions</span>
            </div>
          </div>

          {/* payout gate — REAL follower count */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5">
            <div className="flex justify-between items-center mb-2">
              <b className="text-[10px] text-gray-200">Ads Revenue Payouts</b>
              <span className={`text-[8px] font-black px-2.5 py-1 rounded-full ${payoutsActive ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/40' : 'bg-white/5 text-gray-400 border border-white/15'}`}>
                {payoutsActive ? 'ACTIVE' : 'LOCKED'}
              </span>
            </div>
            <div className="flex justify-between text-[8px]"><span className="text-gray-400">Real followers</span><b className="font-mono">{followers.toLocaleString()} / {TW_PAYOUT_FOLLOWER_GATE.toLocaleString()}</b></div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1.5">
              <i className="block h-full bg-sky-500" style={{ width: `${Math.min(100, (followers / TW_PAYOUT_FOLLOWER_GATE) * 100)}%` }} />
            </div>
            {!payoutsActive && <p className="text-[8px] text-gray-500 mt-2">Payouts unlock at {TW_PAYOUT_FOLLOWER_GATE.toLocaleString()} REAL followers — impressions convert at 0.4-0.9% per tweet.</p>}
          </div>

          {payoutsActive && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2.5">
              <b className="text-[10px] text-gray-200 block">TRANSFER TO WALLET</b>
              <p className="text-[8px] text-gray-500 leading-relaxed">20% tax withheld at request. Clears in 1-5 weeks — inbox notice when funds land.</p>
              <div className="flex gap-2">
                <input type="number" value={payoutAmt} onChange={(e) => setPayoutAmt(e.target.value)} placeholder="Amount"
                  className="flex-1 min-w-0 bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-[12px] font-mono text-white outline-none" />
                <button onClick={() => setPayoutAmt(String(balance))} className="px-3 rounded-xl bg-white/10 border border-white/15 text-[9px] font-black text-gray-200 cursor-pointer">MAX</button>
              </div>
              {payoutAmt && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-[8.5px] font-mono space-y-1">
                  <div className="flex justify-between text-gray-400"><span>Gross</span><b className="text-gray-200">${(parseInt(payoutAmt) || 0).toLocaleString()}</b></div>
                  <div className="flex justify-between text-gray-400"><span>Tax (20%)</span><b className="text-rose-300">−${Math.round((parseInt(payoutAmt) || 0) * 0.2).toLocaleString()}</b></div>
                  <div className="flex justify-between text-gray-400 border-t border-white/10 pt-1"><span>You receive (1-5 wks)</span><b className="text-emerald-300">${((parseInt(payoutAmt) || 0) - Math.round((parseInt(payoutAmt) || 0) * 0.2)).toLocaleString()}</b></div>
                </div>
              )}
              <button onClick={doPayout} className="w-full py-3 rounded-xl bg-emerald-500 text-emerald-950 text-[11px] font-black cursor-pointer">REQUEST TRANSFER</button>
            </div>
          )}

          {pendingPayouts.length > 0 && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-500/5 p-3.5 space-y-2">
              <b className="text-[9px] font-black text-amber-300 tracking-[1.5px] block">⏳ TRANSFERS IN FLIGHT</b>
              {pendingPayouts.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-[8.5px] font-mono mb-1">
                    <span className="text-gray-300">${p.net.toLocaleString()} clearing</span>
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

      {/* ================= HOME (graded tweets) ================= */}
      {tab === 'HOME' && (
        <div className="px-3 space-y-2.5">
          {creatorPosts.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-white/10 bg-black/30">
              <span className="text-3xl block">𝕏</span>
              <p className="text-[11px] text-gray-300 font-bold mt-2">No creator tweets yet.</p>
              <p className="text-[8.5px] text-gray-500 mt-1">Head to STUDIO — schedule your first tweet and start the testing climb.</p>
            </div>
          ) : (
            creatorPosts.slice(0, 15).map((p) => {
              const { g, cls } = gradeFor(p.impressions || 0);
              return (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-black/40 p-3 flex gap-2.5">
                  <img src={player.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <b className="text-[10px] text-white">{player.firstName} {player.lastName}</b>
                      <span className="text-[7px] text-sky-400">✔</span>
                      <span className="text-[7px] text-gray-500">· WK {p.publishWeek} · {p.tweetType.replace('_', ' ')}</span>
                    </div>
                    <b className="text-[10.5px] text-gray-100 block leading-snug mt-0.5 line-clamp-2">{p.text}</b>
                    <span className="text-[7.5px] text-gray-500 block mt-1">
                      {(p.impressions || 0).toLocaleString()} impressions · {(p.likes || 0).toLocaleString()} likes · {(p.reposts || 0).toLocaleString()} reposts · +{(p.followersGained || 0).toLocaleString()} followers
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0 self-center">
                    <span className={`w-7 h-7 rounded-lg ${cls} text-[12px] font-black flex items-center justify-center`}>{g}</span>
                    {payoutsActive && (p.revenue || 0) > 0 && <span className="text-[7px] font-mono text-emerald-300">${(p.revenue || 0).toLocaleString()}</span>}
                  </div>
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
            <img src={player.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-sky-400/50" />
            <div className="flex-1 min-w-0">
              <b className="text-white text-sm block truncate">{player.firstName} {player.lastName} <span className="text-sky-400">✔</span></b>
              <span className="text-[8px] text-gray-400 block">{followers.toLocaleString()} followers · REAL COUNT</span>
              <span className="text-[7.5px] text-sky-300 font-black block mt-0.5">TIER {tier.tier} — {tier.name.toUpperCase()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['LIFETIME TWEETS', (state.twitterLifetimePosts || 0).toString()],
              ['POST STREAK', `${state.twitterPostStreak || 0} weeks`],
              ['AUTHORITY XP', `${xp} / ${nextTier ? nextTier.minXp : 'MAX'}`],
              ['WEEKLY IMPRESSION CAP', tier.weeklyImpressionCap.toLocaleString()],
              ['PAYOUT STATUS', payoutsActive ? 'ACTIVE' : `${(TW_PAYOUT_FOLLOWER_GATE - followers).toLocaleString()} TO GO`],
              ['BANK BALANCE', `$${balance.toLocaleString()}`],
            ].map(([c, v]) => (
              <div key={c} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5">
                <span className="text-[6.5px] text-gray-500 tracking-wider block">{c}</span>
                <b className="text-[11px] font-mono text-gray-100">{v}</b>
              </div>
            ))}
          </div>
          <p className="text-[8px] text-gray-500 leading-relaxed px-1">
            The climb: Tier 2 ≈ 3 months of consistent tweeting. Follower growth comes ONLY from real impression conversion (0.4-0.9% per tweet) — nothing is faked, ever. Skipped weeks bleed authority (−4 XP). Ads payouts and the bank unlock at {TW_PAYOUT_FOLLOWER_GATE.toLocaleString()} real followers.
          </p>
        </div>
      )}
    </div>
  );
};
