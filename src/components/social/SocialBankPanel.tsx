/**
 * HOLLYWOOD RISING — Universal Social Bank Panel
 * Mounted on EVERY social page (YouTube, Instagram, X, hub). Shows the real
 * bank balance, this week's accrued revenue, the 20% creator tax, the $20
 * transfer minimum, pending payouts, and the transfer-to-account action.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SOCIAL_BANK_MIN_TRANSFER } from '../../services/socialsService';
import { Landmark, ArrowDownToLine, Clock, Receipt } from 'lucide-react';

interface Props {
  platform: 'youtube' | 'instagram' | 'twitter';
  accent?: string; // e.g. 'red' | 'emerald' | 'sky'
}

const ACCENTS: Record<string, { border: string; text: string; chip: string; btn: string }> = {
  red: { border: 'border-red-500/40', text: 'text-red-300', chip: 'bg-red-500/10 text-red-300 border-red-500/30', btn: 'bg-red-500 hover:bg-red-400' },
  emerald: { border: 'border-emerald-500/40', text: 'text-emerald-300', chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', btn: 'bg-emerald-500 hover:bg-emerald-400' },
  sky: { border: 'border-sky-500/40', text: 'text-sky-300', chip: 'bg-sky-500/10 text-sky-300 border-sky-500/30', btn: 'bg-sky-500 hover:bg-sky-400' },
};

const LABELS: Record<string, string> = {
  youtube: 'YouTube Creator Bank',
  instagram: 'Gram Bank (Instagram)',
  twitter: 'X Bank',
};

export const SocialBankPanel: React.FC<Props> = ({ platform, accent = 'red' }) => {
  const { player, persistNow } = useGame();
  const [msg, setMsg] = useState<string | null>(null);
  const a = ACCENTS[accent] || ACCENTS.red;

  const state = SocialsService.getState();
  const balance =
    platform === 'youtube' ? state.youtubeBalance || 0
    : platform === 'instagram' ? state.instagramBalance || 0
    : state.twitterBalance || 0;
  const pending =
    platform === 'youtube' ? state.youtubePendingPayouts || []
    : platform === 'instagram' ? state.instagramPendingPayouts || []
    : state.twitterPendingPayouts || [];
  const accrued = state.socialWeeklyAccrued?.[platform] || 0;
  const canTransfer = balance >= SOCIAL_BANK_MIN_TRANSFER;
  const taxOnTransfer = Math.round(balance * 0.2);
  const netOnTransfer = balance - taxOnTransfer;

  const handleTransfer = () => {
    const res = SocialsService.transferSocialBankToAccount(platform, player);
    setMsg(res.message);
    if (res.success) persistNow();
  };

  return (
    <div className={`p-4 rounded-3xl border ${a.border} bg-black/60 backdrop-blur-md space-y-3 shadow-xl`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className={`w-4 h-4 ${a.text}`} />
          <h3 className={`text-xs font-black uppercase tracking-wider ${a.text}`}>{LABELS[platform]}</h3>
        </div>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${a.chip}`}>
          20% creator tax
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-[8px] text-gray-500 uppercase font-black block">Balance</span>
          <span className="text-sm font-black text-emerald-300 font-mono">${balance.toLocaleString()}</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-[8px] text-gray-500 uppercase font-black block">Accrued W{state.socialWeeklyAccrued?.week ?? player.dateWeek}</span>
          <span className="text-sm font-black text-amber-300 font-mono">${accrued.toLocaleString()}</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
          <span className="text-[8px] text-gray-500 uppercase font-black block">In Transit</span>
          <span className="text-sm font-black text-sky-300 font-mono">${pending.reduce((s, p) => s + (p.net || 0), 0).toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handleTransfer}
        disabled={!canTransfer}
        className={`w-full py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
          canTransfer ? `${a.btn} text-white cursor-pointer shadow-lg` : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
        }`}
      >
        <ArrowDownToLine className="w-4 h-4" />
        {canTransfer
          ? `TRANSFER $${balance.toLocaleString()} TO ACCOUNT (net $${netOnTransfer.toLocaleString()} after $${taxOnTransfer.toLocaleString()} tax)`
          : `NEEDS $${SOCIAL_BANK_MIN_TRANSFER} MINIMUM (holds $${balance.toLocaleString()})`}
      </button>

      {pending.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[9px] text-gray-500 uppercase font-black flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending payouts (clear in 1-5 weeks)
          </span>
          {pending.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/5 text-[10px] font-mono">
              <span className="text-gray-300">${(p.gross || 0).toLocaleString()} gross</span>
              <span className="text-red-300 flex items-center gap-1"><Receipt className="w-3 h-3" />-${(p.taxWithheld || 0).toLocaleString()}</span>
              <span className="text-emerald-300">${(p.net || 0).toLocaleString()} in {p.weeksRemaining || p.totalWeeks}w</span>
            </div>
          ))}
        </div>
      )}

      {msg && (
        <p className="text-[10px] text-gray-300 leading-snug px-2.5 py-2 rounded-xl bg-white/5 border border-white/10">
          {msg}
        </p>
      )}

      <p className="text-[9px] text-gray-600 font-mono leading-relaxed">
        Earnings accrue to this bank every week (updates land before payout). All creator income is
        taxed 20% on every exit — transfers and month-end payouts alike. Month-end auto-pays any
        remaining balance.
      </p>
    </div>
  );
};
