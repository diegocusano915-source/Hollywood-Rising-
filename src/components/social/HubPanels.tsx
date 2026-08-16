/**
 * HOLLYWOOD RISING - Social Hub Shared Panels
 * Premium purchase, Writer management, Creator Studio analytics.
 * All real data, no fake simulation.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  SocialsService,
  SocialsState,
  PREMIUM_TIERS,
  SOCIAL_WRITER_POOL,
  PremiumService,
  pitchSocialWriter,
  fireSocialWriter,
  WRITER_CONTRACT_CHOICES,
  WRITER_MIN_CONTRACT_WEEKS,
  WRITER_MAX_CONTRACT_WEEKS,
} from '../../services/socialsService';
import type { InboxMessage } from '../../types/game';
import { Check, Crown, Sparkles, X, Star, DollarSign, BarChart3, PenTool } from 'lucide-react';

const TICK_STYLE: Record<string, string> = {
  BLUE: 'bg-sky-500 text-white',
  GOLD: 'bg-amber-400 text-black',
  GRAY: 'bg-gray-300 text-black',
};

export const PremiumPanel: React.FC<{ state: SocialsState; onRefresh: () => void }> = ({ state, onRefresh }) => {
  const { player, saveData, updateSave } = useGame();
  const [fb, setFb] = useState<string | null>(null);
  const premium = state.premium || { tier: 'none', plan: 'none', expiresWeek: 0, expiresYear: 0 };

  const buy = (tier: 'premium' | 'plus' | 'pro', plan: 'monthly' | 'yearly') => {
    const cfg = PREMIUM_TIERS[tier];
    const cost = plan === 'monthly' ? cfg.monthly : cfg.yearly;
    if (!window.confirm(`Purchase ${cfg.name} (${plan}) for $${cost}?`)) return;
    const res = PremiumService.purchase(state, tier, plan, player.money || 0, player.dateWeek || 1, player.dateYear || 2026);
    if (res.success) {
      updateSave({ ...saveData, player: { ...player, money: res.newMoney } });
      SocialsService.saveState(state);
      setFb(res.message);
    } else setFb(res.message);
    setTimeout(() => setFb(null), 4000);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Crown className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-black uppercase tracking-wider text-amber-200">Platform Premium</h3>
        {premium.tier !== 'none' && (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${TICK_STYLE[PREMIUM_TIERS[premium.tier].tick]}`}>
            ACTIVE · {PREMIUM_TIERS[premium.tier].name}
          </span>
        )}
      </div>
      {fb && <p className="text-[11px] text-amber-200 bg-amber-500/10 border border-amber-500/30 p-2 rounded-xl">{fb}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(['premium', 'plus', 'pro'] as const).map((tier) => {
          const cfg = PREMIUM_TIERS[tier];
          const isActive = premium.tier === tier;
          return (
            <div key={tier} className={`p-3 rounded-2xl border ${isActive ? 'border-amber-400/60 bg-amber-500/10' : 'border-white/10 bg-black/40'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">{cfg.name}</span>
                <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${TICK_STYLE[cfg.tick]}`}>✓</span>
              </div>
              <div className="mt-2 space-y-1 text-[10px] text-gray-400">
                <p>🟦 {cfg.tick} verified tick</p>
                <p>✏️ Edit posts · 500-word posts</p>
                <p>🚀 Boosted reach</p>
                <p>📊 Creator Studio access</p>
              </div>
              <div className="mt-2 flex gap-1.5">
                <button onClick={() => buy(tier, 'monthly')} disabled={isActive} className="flex-1 px-2 py-1.5 rounded-lg bg-amber-500 text-black text-[10px] font-black disabled:opacity-40 cursor-pointer">${cfg.monthly}/mo</button>
                <button onClick={() => buy(tier, 'yearly')} disabled={isActive} className="flex-1 px-2 py-1.5 rounded-lg bg-amber-500/80 text-black text-[10px] font-black disabled:opacity-40 cursor-pointer">${cfg.yearly}/yr</button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-gray-500">Monthly = 4 weeks · Yearly = 52 weeks (2 months free). Paid with game cash. Expires automatically.</p>
    </div>
  );
};

export const WritersPanel: React.FC<{ state: SocialsState; onRefresh: () => void; platform?: string }> = ({ state, onRefresh, platform = 'twitter' }) => {
  const { player, saveData, updateSave } = useGame();
  const [fb, setFb] = useState<string | null>(null);
  const [fbOk, setFbOk] = useState(true);
  const [selectedWriter, setSelectedWriter] = useState<string | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState(10);
  const platformLabel = SocialsService.PLATFORM_LABEL[platform] || platform;
  const hired = state.writers.find((w) => w.hired && (w.platform || 'twitter') === platform);

  const apply = (id: string) => {
    const res = pitchSocialWriter(
      state,
      id,
      player.money || 0,
      {
        fameXp: player.fameXp || 0,
        moviesCompleted: player.moviesCompleted || 0,
        fans: player.fans || 0,
        firstName: player.firstName,
        lastName: player.lastName,
        dateWeek: player.dateWeek,
        dateYear: player.dateYear,
      },
      platform,
      selectedWeeks
    );
    // Every application produces an inbox message (accept or decline)
    const inboxMsg: InboxMessage = res.inboxMsg;
    updateSave({
      ...saveData,
      player: { ...player, money: res.newMoney },
      inbox: [inboxMsg, ...saveData.inbox],
    });
    SocialsService.saveState(state);
    setFbOk(res.hired);
    setFb(res.message);
    setTimeout(() => setFb(null), 5000);
    if (res.hired) setSelectedWriter(null);
    onRefresh();
  };
  const fire = () => {
    const res = fireSocialWriter(state, player.money || 0, platform);
    if (res.success) updateSave({ ...saveData, player: { ...player, money: res.newMoney } });
    SocialsService.saveState(state);
    setFbOk(res.success);
    setFb(res.message);
    setTimeout(() => setFb(null), 4000);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <PenTool className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-black uppercase tracking-wider text-purple-200">{platformLabel} Writer (1 max · {WRITER_MIN_CONTRACT_WEEKS}-{WRITER_MAX_CONTRACT_WEEKS} wks)</h3>
      </div>
      <p className="text-[9px] text-gray-500">Separate writer per platform — posts ONLY on {platformLabel}. Writers audit your career before accepting. Their reply lands in your Inbox.</p>
      {fb && <p className={`text-[11px] p-2 rounded-xl border ${fbOk ? 'text-emerald-200 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-200 bg-amber-500/10 border-amber-500/30'}`}>{fb}</p>}
      {hired ? (
        <div className="p-3 rounded-2xl border border-purple-400/40 bg-purple-500/10 space-y-1">
          <p className="text-xs font-black text-white">{hired.name} <span className="text-purple-300">✍️ HIRED · {platformLabel}</span></p>
          <p className="text-[10px] text-gray-400">{hired.agencyName} · ${hired.weeklyCost.toLocaleString()}/wk · {hired.contractWeeksRemaining} wks left</p>
          <p className="text-[10px] text-gray-400">Auto-posts 2×/week on {platformLabel} — detailed posts about your real events.</p>
          <button onClick={fire} className="mt-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[10px] font-black cursor-pointer">✕ Cancel Contract</button>
        </div>
      ) : (
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {SOCIAL_WRITER_POOL.map((w) => {
            const locked = (player.fameXp || 0) < w.minFame;
            const busy = state.writers.find((h) => h.hired && h.id === w.id && (h.platform || 'twitter') !== platform);
            const shortMovies = (player.moviesCompleted || 0) < w.minMovies;
            const shortFans = (player.fans || 0) < w.minFans;
            const expanded = selectedWriter === w.id;
            const reqWarnings: string[] = [];
            if (shortMovies && w.minMovies > 0) reqWarnings.push(`${w.minMovies} movies (you: ${player.moviesCompleted || 0})`);
            if (shortFans && w.minFans > 0) reqWarnings.push(`${w.minFans.toLocaleString()} fans (you: ${(player.fans || 0).toLocaleString()})`);
            return (
              <div key={w.id} className={`p-3 rounded-2xl border bg-black/40 ${expanded ? 'border-purple-400/50' : 'border-white/10'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{w.name}</p>
                    <p className="text-[9px] text-gray-400 truncate">{w.tierLabel} · {w.specialty}</p>
                    <p className="text-[9px] text-gray-500 truncate">{w.agencyName} · ${w.weeklyCost}/wk · quality +{w.qualityBoost}%</p>
                    {reqWarnings.length > 0 && (
                      <p className="text-[9px] text-amber-300/80 truncate">⚠ Portfolio audit: needs {reqWarnings.join(' · ')}</p>
                    )}
                  </div>
                  {busy ? (
                    <span className="text-[9px] text-sky-300 shrink-0">On {SocialsService.PLATFORM_LABEL[busy.platform || 'twitter'] || 'other'}</span>
                  ) : locked ? (
                    <span className="text-[9px] text-gray-500 shrink-0">🔒 {w.minFame.toLocaleString()} XP</span>
                  ) : expanded ? (
                    <button onClick={() => setSelectedWriter(null)} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-black shrink-0 cursor-pointer">Close</button>
                  ) : (
                    <button onClick={() => { setSelectedWriter(w.id); setSelectedWeeks(10); }} className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-black shrink-0 cursor-pointer">Apply</button>
                  )}
                </div>
                {expanded && (
                  <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
                    <p className="text-[9px] text-gray-400">Contract length ({WRITER_MIN_CONTRACT_WEEKS}-{WRITER_MAX_CONTRACT_WEEKS} wks) — paid weekly:</p>
                    <div className="grid grid-cols-4 gap-1">
                      {WRITER_CONTRACT_CHOICES.map((wk) => (
                        <button
                          key={wk}
                          onClick={() => setSelectedWeeks(wk)}
                          className={`px-1 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${selectedWeeks === wk ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300'}`}
                        >
                          {wk}w
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[9px] text-gray-500">${w.weeklyCost.toLocaleString()}/wk · ${ (w.weeklyCost * selectedWeeks).toLocaleString()} total</p>
                      <button onClick={() => apply(w.id)} className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-black cursor-pointer shrink-0">
                        Send Offer · {selectedWeeks} wks
                      </button>
                    </div>
                    {reqWarnings.length > 0 && (
                      <p className="text-[9px] text-amber-300/70">Low accept odds — {w.name.split(' ')[0]} may decline. Their evaluation arrives in your Inbox either way.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** Drop-in writer section for platform views: ✍️ button + bottom-sheet panel */
export const WriterSheet: React.FC<{ state: SocialsState; platform: string; onRefresh: () => void }> = ({ state, platform, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const hired = state.writers.find((w) => w.hired && (w.platform || 'twitter') === platform);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${hired ? 'bg-purple-500/20 border-purple-400/50 text-purple-200' : 'bg-white/10 border-white/10 text-white'}`}
      >
        <PenTool className="w-4 h-4" /> WRITER{hired ? ' ✓' : ''}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto p-4 rounded-t-3xl bg-[#12121a] border-t border-purple-400/30 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between sticky top-0">
              <span className="text-xs font-black uppercase tracking-wider text-purple-200">Hire a writer</span>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg bg-white/10 cursor-pointer"><X className="w-4 h-4 text-white" /></button>
            </div>
            <WritersPanel state={state} platform={platform} onRefresh={onRefresh} />
          </div>
        </div>
      )}
    </>
  );
};

export const CreatorStudioPanel: React.FC<{ state: SocialsState }> = ({ state }) => {  const premium = state.premium || { tier: 'none' as const };
  const totalPosts = Object.values(state.playerPosts || {}).reduce((a: number, arr: any[]) => a + (arr?.length || 0), 0);
  const impressions = state.creatorStudio?.totalImpressions || 0;
  const bankTotal = (state.youtubeBalance || 0) + (state.instagramBalance || 0) + (state.twitterBalance || 0);
  const weekly = (state.instagramAccruedLastWeek || 0) + (state.twitterAccruedLastWeek || 0) + (state.creatorStudio?.weeklyAdRevenue || 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-black uppercase tracking-wider text-emerald-200">Creator Studio</h3>
        {premium.tier === 'none' && (
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black">PREMIUM ONLY</span>
        )}
      </div>
      {premium.tier === 'none' ? (
        <p className="text-[11px] text-gray-400 bg-black/40 border border-white/10 p-3 rounded-2xl">
          Unlock Creator Studio with any Premium tier — real post analytics and ad-revenue share from your impressions.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[9px] text-gray-400 uppercase block font-bold">Your Posts</span>
            <span className="text-lg font-black text-white">{totalPosts.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[9px] text-gray-400 uppercase block font-bold">Impressions</span>
            <span className="text-lg font-black text-white">{impressions.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
            <span className="text-[9px] text-gray-400 uppercase block font-bold">Creator Banks</span>
            <span className="text-lg font-black text-emerald-400">${bankTotal.toLocaleString()}</span>
            <span className="text-[7px] text-gray-500 block">YT + IG + X balances — pays out monthly</span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
            <span className="text-[9px] text-gray-400 uppercase block font-bold">Accrued Last Week</span>
            <span className="text-lg font-black text-emerald-300">+${weekly.toLocaleString()}</span>
          </div>
        </div>
      )}
      <p className="text-[9px] text-gray-500">Impressions are real — from your actual posts across all platforms. Revenue accrues in your platform Banks (YouTube / Instagram / X) and pays out automatically at month-end. YouTube is the only taxed platform.</p>
    </div>
  );
};
