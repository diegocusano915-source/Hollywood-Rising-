/**
 * HOLLYWOOD RISING - Bankroll View (REAL MANAGER DEAL-SOURCING ENGINE)
 * Your Personal Manager sources real bankroll offers every ~4 weeks.
 * You pick the amount; the invisible stopper kills over-aggressive offers;
 * outcomes are real (you can lose money); payouts land 2-3 weeks after
 * release. Producer Trust drives deal quality.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  loadBankrollState,
  saveBankrollState,
  investInDeal,
  bankrollTrustLabel,
  BANKROLL_MIN_INVEST,
  BankrollDeal,
  BankrollInvestment,
} from '../../services/bankrollEngine';
import {
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Clock,
  Film,
  Tv,
  Video,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Lock,
  Handshake,
  History,
  ShieldAlert,
  Trophy,
  Flame,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface BankrollViewProps {
  onBack: () => void;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  Movie: <Film className="w-4 h-4" />,
  Series: <Tv className="w-4 h-4" />,
  'Streaming Original': <Video className="w-4 h-4" />,
};

const RISK_STYLE: Record<string, { cls: string; color: string }> = {
  Low: { cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', color: '#34d399' },
  Medium: { cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30', color: '#fbbf24' },
  High: { cls: 'bg-orange-500/20 text-orange-300 border-orange-500/30', color: '#fb923c' },
  Extreme: { cls: 'bg-rose-500/20 text-rose-300 border-rose-500/30', color: '#f87171' },
};

const OUTCOME_STYLE: Record<string, { label: string; cls: string }> = {
  Blockbuster: { label: '🎬 BLOCKBUSTER', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  Hit: { label: '👍 HIT', cls: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  Average: { label: '😐 AVERAGE', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  Flop: { label: '💀 FLOP', cls: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
};

export const BankrollView: React.FC<BankrollViewProps> = ({ onBack }) => {
  const { player, settings, persistNow } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [state, setState] = useState(() => loadBankrollState());
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const hasManager = !!player.representation?.manager?.signed;
  const mgr = player.representation?.manager;
  const trust = bankrollTrustLabel(state.trust);
  const pendingDeals = state.deals.filter((d) => d.status === 'PENDING');
  const activeInv = state.investments.filter((i) => i.phase !== 'PAID');
  const pastInv = state.investments.filter((i) => i.phase === 'PAID');
  const recentHistory = state.history.slice(0, 8);

  const refresh = () => {
    setState(loadBankrollState());
    persistNow();
  };

  const handleInvest = (deal: BankrollDeal) => {
    const amt = amounts[deal.id] || deal.ask;
    const res = investInDeal(state, deal.id, amt, player.money || 0);
    if (res.success && res.newMoney !== undefined) {
      player.money = res.newMoney;
    }
    setFeedback({ text: res.message, isError: !res.success });
    setTimeout(() => setFeedback(null), 6000);
    refresh();
  };

  const showFb = (text: string, isError = false) => {
    setFeedback({ text, isError });
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-24 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-amber-400" />
          Manager Film Financing Vault
        </span>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 border shadow-2xl space-y-3 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">BANKROLL & PRODUCTION FUNDING</h1>
            <p className="text-[11px] text-amber-300 font-medium">
              Co-finance real projects sourced by {hasManager ? mgr?.name : 'your Personal Manager'} — you pick the amount, the producer picks the terms.
            </p>
          </div>
        </div>

        {/* PRODUCER TRUST METER */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 uppercase font-black flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5 text-amber-400" /> Producer Trust
            </span>
            <span className="text-[11px] font-black" style={{ color: trust.color }}>{trust.label} · {state.trust}/100</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${state.trust}%`, backgroundColor: trust.color }}
            />
          </div>
          <p className="text-[9px] text-gray-500 mt-1.5">
            Payouts build trust · flops and broken deals burn it. High trust = bigger, better deals
            {state.trust >= 95 ? ' · LEGENDARY trust unlocks $1B mega-deals' : state.trust >= 80 ? ' · TREASURED trust unlocks $750M mega-deals + a 3rd investment slot' : ' · TREASURED trust (80+) unlocks mega-deals & a 3rd slot'}.
          </p>
        </div>

        {/* Manager sourcing status */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {hasManager ? (
            state.trust < 25 ? (
              <span className="text-rose-300 font-bold">Producers are hesitant — trust rebuilds +1/week ({state.trust}/25 needed for offers).</span>
            ) : (
              <span>
                {mgr?.name} sources a new opportunity every {state.trust >= 80 ? '~3' : '~4'} weeks · offers expire after 6 weeks.
              </span>
            )
          ) : (
            <span>Hire a Personal Manager to access bankroll deals.</span>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-black shadow-lg ${
            feedback.isError
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* MANAGER CHECK */}
      {!hasManager ? (
        <div className="p-10 rounded-3xl border border-amber-500/30 bg-black/50 text-center space-y-4 shadow-2xl backdrop-blur-md max-w-xl mx-auto my-6">
          <div className="p-4 rounded-full bg-amber-500/20 border border-amber-500/40 w-16 h-16 mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Locked — No Manager</h2>
            <p className="text-sm font-bold text-amber-300">Hire a Manager to source bankroll opportunities.</p>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Bankroll deals come from your Personal Manager's producer network. Sign one in Representation → Managers.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ============ PENDING DEALS ============ */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Live Offers ({pendingDeals.length})
            </h3>
            {pendingDeals.length === 0 ? (
              <div className="p-5 rounded-2xl border border-white/10 bg-black/30 text-center">
                <p className="text-[11px] text-gray-400">
                  No offers on the table right now. {mgr?.name} sources a new one every ~4 weeks — keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDeals.map((deal) => {
                  const riskStyle = RISK_STYLE[deal.risk] || RISK_STYLE.Medium;
                  const amt = amounts[deal.id] || deal.ask;
                  // Honest projections from the advertised Expected Return %
                  const E = 1 + deal.expectedReturnPct / 100;
                  const bestMult = Math.min(3.0, E * 1.45);
                  const likelyMult = E * 1.1;
                  const worstMult = 0.4;
                  return (
                    <div key={deal.id} className="p-4 rounded-3xl border border-amber-500/25 bg-black/50 backdrop-blur-md space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          {TYPE_ICON[deal.type]} {deal.type}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg border ${riskStyle.cls}`}>
                          {deal.risk.toUpperCase()} RISK
                        </span>
                      </div>

                      <div>
                        <h2 className="text-base font-black text-white">{deal.title}</h2>
                        <p className="text-[10px] text-gray-400">Producer: {deal.producer}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-2xl bg-black/60 border border-white/5 text-[10px]">
                        <div>
                          <span className="text-gray-500 block font-bold">Ask</span>
                          <span className="font-black text-emerald-400">${(deal.ask / 1000000).toFixed(0)}M</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block font-bold">Prod.</span>
                          <span className="font-black text-amber-300 flex items-center gap-1"><Clock className="w-3 h-3" />{deal.productionWeeks}w</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block font-bold">Exp. Ret.</span>
                          <span className="font-black text-sky-300">+{deal.expectedReturnPct}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block font-bold">Expires</span>
                          <span className="font-black text-rose-300">{deal.weeksLeft}w</span>
                        </div>
                      </div>

                      {/* INVESTMENT INPUT */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-400 font-bold">Your investment</span>
                          <span className="text-gray-500">Min ${(BANKROLL_MIN_INVEST / 1000000).toFixed(0)}M · best odds at 90–130% of ask</span>
                        </div>
                        <input
                          type="number"
                          min={BANKROLL_MIN_INVEST}
                          step={1000000}
                          value={amt}
                          onChange={(e) => setAmounts((a) => ({ ...a, [deal.id]: Number(e.target.value) }))}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none focus:border-amber-400"
                        />
                        <div className="flex gap-1.5">
                          {[1, 1.25, 1.5].map((m) => (
                            <button
                              key={m}
                              onClick={() => setAmounts((a) => ({ ...a, [deal.id]: Math.round(deal.ask * m / 100000) * 100000 }))}
                              className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-gray-300 hover:bg-amber-500/20 hover:text-amber-300 transition cursor-pointer"
                            >
                              {m}x ASK
                            </button>
                          ))}
                        </div>
                      </div>

                  <button
                    onClick={() => handleInvest(deal)}
                    className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-[1.01] active:scale-0.98 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    INVEST ${(amt / 1000000).toFixed(0)}M
                  </button>

                  {/* Soft stopper warning — keeps the exact limit invisible */}
                  {amt > deal.ask * 1.5 && (
                    <p className="text-[9px] text-rose-300 font-bold text-center animate-pulse">
                      ⚠ This offer is well above the ask — the producer may walk away.
                    </p>
                  )}

                  {/* Honest projections from the advertised return */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[8px] text-emerald-300/80 font-bold block">BEST</span>
                      <span className="text-[10px] font-black text-emerald-300">{bestMult.toFixed(2)}×</span>
                      <span className="text-[8px] text-gray-500 block">${((amt * bestMult) / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                      <span className="text-[8px] text-sky-300/80 font-bold block">LIKELY</span>
                      <span className="text-[10px] font-black text-sky-300">{likelyMult.toFixed(2)}×</span>
                      <span className="text-[8px] text-gray-500 block">${((amt * likelyMult) / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <span className="text-[8px] text-rose-300/80 font-bold block">WORST</span>
                      <span className="text-[10px] font-black text-rose-300">{worstMult.toFixed(2)}×</span>
                      <span className="text-[8px] text-gray-500 block">${((amt * worstMult) / 1000000).toFixed(0)}M</span>
                    </div>
                  </div>

                  <p className="text-[8px] text-gray-500 text-center">
                    Producers dislike over-aggressive offers — and under-funding hurts your odds.
                  </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ============ ACTIVE INVESTMENTS ============ */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
              <Film className="w-4 h-4 text-sky-400" /> Active Investments ({activeInv.length}/{state.trust >= 80 ? 3 : 2})
            </h3>
            {activeInv.length === 0 ? (
              <div className="p-5 rounded-2xl border border-white/10 bg-black/30 text-center">
                <p className="text-[11px] text-gray-400">No active bankrolls. Invest in an offer above to start producing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeInv.map((inv: BankrollInvestment) => (
                  <div key={inv.id} className="p-4 rounded-3xl border border-sky-500/25 bg-black/50 backdrop-blur-md space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                        {TYPE_ICON[inv.type]} {inv.type}
                      </span>
                      {inv.phase === 'PRODUCTION' ? (
                        <span className="text-[9px] font-black text-sky-300 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/30">IN PRODUCTION</span>
                      ) : (
                        <span className="text-[9px] font-black text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">RELEASED — PAYOUT SOON</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white">{inv.title}</h2>
                      <p className="text-[10px] text-gray-400">{inv.producer} · Invested ${(inv.investedAmount / 1000000).toFixed(0)}M{inv.underfunded ? ' · ⚠️ under-funded' : ''}</p>
                    </div>

                    {inv.phase === 'PRODUCTION' ? (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-gray-400">Production countdown</span>
                            <span className="text-amber-300">{inv.weeksRemaining} / {inv.productionWeeks} weeks</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all duration-500"
                              style={{ width: `${Math.round(((inv.productionWeeks - inv.weeksRemaining) / inv.productionWeeks) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" /> Releases in {inv.weeksRemaining} week{inv.weeksRemaining === 1 ? '' : 's'} — payout 2–3 weeks after.
                        </p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg border ${OUTCOME_STYLE[inv.outcome || 'Average'].cls}`}>
                          {OUTCOME_STYLE[inv.outcome || 'Average'].label} · {inv.multiplier}x return
                        </span>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" /> Payout lands in {inv.payoutInWeeks} week{inv.payoutInWeeks === 1 ? '' : 's'}.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ============ PAYOUT HISTORY ============ */}
          {pastInv.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" /> Completed Investments ({pastInv.length})
              </h3>
              <div className="space-y-2">
                {pastInv.map((inv) => (
                  <div key={inv.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="font-black text-white truncate">{inv.title}</p>
                      <p className="text-[10px] text-gray-400">{inv.outcome} · ${(inv.investedAmount / 1000000).toFixed(0)}M invested</p>
                    </div>
                    <span className={`font-black shrink-0 ${(inv.netProfit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {(inv.netProfit || 0) >= 0 ? '+' : ''}{(inv.netProfit || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============ HISTORY ============ */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
              <History className="w-4 h-4 text-purple-400" /> Recent Activity
            </h3>
            {recentHistory.length === 0 ? (
              <p className="text-[11px] text-gray-500 text-center py-4">No bankroll activity yet.</p>
            ) : (
              <div className="space-y-1.5">
                {recentHistory.map((h) => (
                  <div key={h.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[10px] text-gray-300 flex items-start gap-2">
                    {h.type === 'PAYOUT' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      : h.type === 'BROKEN' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      : h.type === 'SILENCE' ? <ShieldAlert className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      : h.type === 'RELEASED' ? <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      : <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />}
                    <span>
                      <strong className="text-white">{h.title}</strong> — {h.message}{' '}
                      <span className="text-gray-500">(Wk {h.week}, {h.year})</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locked cap notice */}
          <p className="text-[9px] text-gray-500 text-center">
            Max 2 active bankrolls · min ${(BANKROLL_MIN_INVEST / 1000000).toFixed(0)}M · all outcomes real — you can lose money on a flop.
          </p>
        </>
      )}
    </div>
  );
};
