/**
 * HOLLYWOOD RISING - WALL STREET WEST (Option A rebuild)
 * Terminal-style studio exchange. Studios are REAL production engines:
 * live slates progress weekly, casting stages ship NPC roles to the
 * Callboard, releases roll box office and move the stock, and new studios
 * list every 10-12 weeks. Player can buy/sell shares in all of them.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Search } from 'lucide-react';
import {
  MarketEngineService,
  StockCompany,
  EconomyMarketState,
  IpoCompany,
} from '../../services/marketEngineService';

interface StarStocksViewProps {
  onBack: () => void;
}

const fmtPrice = (v: number) => (v < 1 ? v.toFixed(3) : v.toFixed(2));
const fmtCap = (v: number) => (v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T` : v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(0)}M` : `$${(v / 1e3).toFixed(0)}K`);

const STAGE_META: Record<string, { icon: string; label: string; cls: string }> = {
  DEVELOPMENT: { icon: '📝', label: 'DEVELOPMENT', cls: 'text-sky-300 bg-sky-500/10' },
  CASTING: { icon: '🎯', label: 'CASTING', cls: 'text-amber-300 bg-amber-500/10' },
  FILMING: { icon: '🎥', label: 'FILMING', cls: 'text-amber-300 bg-amber-500/10' },
  POST: { icon: '🎛️', label: 'POST', cls: 'text-fuchsia-300 bg-fuchsia-500/10' },
  RELEASED: { icon: '🌟', label: 'RELEASED', cls: 'text-emerald-300 bg-emerald-500/10' },
};

const Spark = ({ data, up, w = 56, h = 24 }: { data: number[]; up: boolean; w?: number; h?: number }) => {
  const pts = data && data.length > 1 ? data : [1, 1];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const step = w / (pts.length - 1 || 1);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - 2 - ((p - min) / range) * (h - 4)).toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <path d={path} fill="none" stroke={up ? '#2ecc8f' : '#f6465d'} strokeWidth="1.5" />
    </svg>
  );
};

/** Big chart with gradient fill from real 12-week chartData */
const ChartBig: React.FC<{ data: number[]; up: boolean }> = ({ data, up }) => {
  const pts = data && data.length > 1 ? data : [1, 1];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const W = 320, H = 90;
  const step = W / (pts.length - 1 || 1);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(H - 6 - ((p - min) / range) * (H - 14)).toFixed(1)}`).join(' ');
  const col = up ? '#2ecc8f' : '#f6465d';
  const gid = `wsg_${Math.abs(Math.round(pts[0] * 1000))}_${pts.length}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.35" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} stroke="#12161e" strokeWidth="1" />)}
      <path d={`${path} L${W},${H} L0,${H} Z`} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={col} strokeWidth="2" />
    </svg>
  );
};

export const StarStocksView: React.FC<StarStocksViewProps> = ({ onBack }) => {
  const { player, persistNow } = useGame();

  const [marketState, setMarketState] = useState<EconomyMarketState>(() => MarketEngineService.getMarketState());
  const [activeTab, setActiveTab] = useState<'MARKET' | 'LAUNCHES' | 'PORTFOLIO' | 'TX'>('MARKET');
  const [selected, setSelected] = useState<StockCompany | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'SLATE' | 'GAINERS' | 'LOSERS' | 'CAP' | 'NEW'>('SLATE');

  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [shareCount, setShareCount] = useState('10');
  const [feedback, setFeedback] = useState<string | null>(null);

  const refresh = () => setMarketState(MarketEngineService.getMarketState());
  useEffect(() => { refresh(); }, []);

  const showFb = (msg: string) => { setFeedback(msg); setTimeout(() => setFeedback(null), 4500); };

  const stocks = marketState.stocks.filter((st) => st.status === 'Public');
  const studios = stocks.filter((st) => st.isFilmStudio);
  const positions = stocks.filter((st) => st.playerSharesOwned > 0);

  const openProductions = studios.reduce((a, st) => a + (st.slate || []).filter((p) => p.stage !== 'RELEASED').length, 0);
  const liveCastingJobs = studios.reduce((a, st) => a + (st.slate || []).filter((p) => p.stage === 'CASTING').length, 0);
  const avgSlateHealth = studios.length ? studios.reduce((a, st) => a + (st.slateHealth || 60), 0) / studios.length : 0;
  const avgChange = stocks.length ? stocks.reduce((a, st) => a + st.changePct, 0) / stocks.length : 0;

  const sel = selected;
  const selProd = sel?.slate || [];
  const selSlateValue = selProd.reduce((a, p) => a + (p.stage === 'RELEASED' ? 0 : p.budget), 0);
  const count = parseInt(shareCount) || 0;
  const orderTotal = count * (sel?.sharePrice || 0);

  const executeOrder = () => {
    if (!sel) return;
    if (count <= 0) { showFb('❌ Enter a share count.'); return; }
    if (orderSide === 'buy') {
      const res = MarketEngineService.buyStock(sel.ticker, count, player.money);
      if (res.success) { player.money -= res.totalCost; persistNow(); }
      showFb(res.message);
    } else {
      if (count > (sel.playerSharesOwned || 0)) { showFb(`❌ You only hold ${sel.playerSharesOwned} shares.`); return; }
      const res = MarketEngineService.sellStock(sel.ticker, count);
      if (res.success) { player.money += (res as any).totalRevenue ?? (res as any).revenue ?? count * sel.sharePrice; persistNow(); }
      showFb(res.message);
    }
    refresh();
    const fresh = MarketEngineService.getMarketState().stocks.find((st) => st.ticker === sel.ticker);
    if (fresh) setSelected(fresh);
  };

  const setPct = (pct: number) => {
    if (!sel) return;
    if (orderSide === 'buy') {
      setShareCount(String(Math.max(1, Math.floor((player.money * pct) / 100 / sel.sharePrice))));
    } else {
      setShareCount(String(Math.max(1, Math.floor(((sel.playerSharesOwned || 0) * pct) / 100))));
    }
  };

  const filtered = stocks
    .filter((st) => {
      const q = searchQuery.toLowerCase();
      return !q || st.name.toLowerCase().includes(q) || st.ticker.toLowerCase().includes(q) || st.industry.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      switch (sortMode) {
        case 'GAINERS': return b.changePct - a.changePct;
        case 'LOSERS': return a.changePct - b.changePct;
        case 'CAP': return b.marketCap - a.marketCap;
        case 'NEW': return (a.weeksSinceListing || 999) - (b.weeksSinceListing || 999);
        default: return ((b.isFilmStudio ? 1 : 0) - (a.isFilmStudio ? 1 : 0)) || b.changePct - a.changePct;
      }
    })
    .slice(0, 40);

  const tickerList = [...stocks].sort((a, b) => b.marketCap - a.marketCap).slice(0, 9);
  const upcomingIpos = marketState.ipos.filter((i: IpoCompany) => i.status === 'Upcoming');
  const recentListings = [...stocks]
    .filter((st) => (st.weeksSinceListing ?? 99) <= 12)
    .sort((a, b) => (a.weeksSinceListing || 0) - (b.weeksSinceListing || 0))
    .slice(0, 5);
  const stockTxs = marketState.transactions.filter((t) => t.assetType === 'STOCK' || t.assetType === 'IPO').slice(0, 30);

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-3" style={{ backgroundColor: '#050608' }}>
      <style>{`@keyframes wsTicker { to { transform: translateX(-50%); } } @keyframes wsPulse { 50% { opacity: 0.55; } }`}</style>

      {/* Top nav */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => { if (selected) setSelected(null); else onBack(); }}
          className="px-4 py-2.5 rounded-xl bg-[#0b0d12] border border-[#161b24] text-gray-300 text-xs font-black flex items-center gap-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-[#2ecc8f]" />
          <span>{selected ? 'Back to Exchange' : 'Back to World'}</span>
        </button>
        <span className="text-[9px] font-black text-[#59616e] tracking-[2px] hidden sm:block">WALL STREET WEST · {stocks.length} LISTED · {studios.length} STUDIOS</span>
      </div>

      {/* ============ STUDIO DETAIL ============ */}
      {sel ? (
        <div className="rounded-2xl border border-[#161b24] bg-[#0b0d12] overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-[#161b24]">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-xl bg-[#0e1118] border border-[#1b212c] flex items-center justify-center text-2xl">{sel.logo}</div>
              <div>
                <b className="text-base text-white block">{sel.name}</b>
                <span className="text-[9px] text-[#59616e] font-mono">{sel.ticker} · {sel.industry}{sel.isFilmStudio ? ` · SLATE HEALTH ${sel.slateHealth || 60}/100` : ''}</span>
              </div>
            </div>
            <div className="text-right">
              <b className={`text-2xl font-mono ${sel.changePct >= 0 ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}`}>${fmtPrice(sel.sharePrice)}</b>
              <span className={`text-[11px] font-black block font-mono ${sel.changePct >= 0 ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}`}>
                {sel.changePct >= 0 ? '▲' : '▼'} {Math.abs(sel.changePct).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* chart */}
          <div className="mx-4 mt-3 bg-[#080a0e] border border-[#161b24] rounded-xl p-3">
            <div className="flex gap-3 text-[8.5px] font-black text-[#59616e] mb-2">
              <span className="text-[#f0b90b]">12-WEEK</span>
              <span>CEO {sel.ceo}</span>
              <span>RATING {sel.rating}</span>
            </div>
            <ChartBig data={sel.chartData || [sel.sharePrice, sel.sharePrice]} up={sel.changePct >= 0} />
          </div>

          {/* production pipeline — real films feeding the callboard */}
          {sel.isFilmStudio && (
            <div className="p-4 border-b border-[#161b24] space-y-2">
              <div className="flex justify-between items-center">
                <b className="text-[10px] tracking-[1.5px] text-[#8b96a8]">🎞️ PRODUCTION PIPELINE</b>
                <span className="text-[8px] text-[#59616e] font-mono">REAL MOVIES → YOUR CALLBOARD</span>
              </div>
              {selProd.length === 0 ? (
                <p className="text-[10px] text-[#59616e] font-mono py-3 text-center">No active productions.</p>
              ) : (
                selProd.map((p) => {
                  const meta = STAGE_META[p.stage];
                  const casting = p.stage === 'CASTING';
                  return (
                    <div key={p.id} className="flex gap-2.5 items-center bg-[#0e1118] border border-[#161b24] rounded-lg px-3 py-2.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${meta.cls}`}>{meta.icon}</div>
                      <div className="flex-1 min-w-0">
                        <b className="text-[11px] text-gray-100 block truncate">"{p.title}"</b>
                        <span className="text-[8.5px] text-[#59616e] block truncate">
                          {p.genre} · ${(p.budget / 1e6).toFixed(0)}M · {meta.label} · wk {p.weeksInStage}/{p.stageWeeksTotal}
                          {p.stage === 'RELEASED' && p.gross ? ` · GROSS $${(p.gross / 1e6).toFixed(1)}M ${p.wasHit ? 'HIT ✔' : p.gross < p.budget * 0.8 ? 'FLOP ✖' : 'SOFT'}` : ''}
                        </span>
                      </div>
                      {casting ? (
                        <span className="text-[8px] font-black text-[#2ecc8f] bg-[#2ecc8f]/10 border border-[#2ecc8f]/40 rounded-md px-2 py-1.5 shrink-0" style={{ animation: 'wsPulse 1.8s infinite' }}>
                          ● ON CALLBOARD
                        </span>
                      ) : p.stage === 'RELEASED' && p.wasHit != null ? (
                        <span className={`text-[8px] font-black rounded-md px-2 py-1.5 shrink-0 border ${p.wasHit ? 'text-[#2ecc8f] bg-[#2ecc8f]/10 border-[#2ecc8f]/40' : 'text-[#f6465d] bg-[#f6465d]/10 border-[#f6465d]/40'}`}>
                          {p.wasHit ? 'HIT +STOCK' : 'FLOP −STOCK'}
                        </span>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* fundamentals */}
          <div className="grid grid-cols-4 gap-1.5 px-4 py-3 border-b border-[#161b24]">
            {[
              ['MARKET CAP', fmtCap(sel.marketCap)],
              ['SLATE VALUE', sel.isFilmStudio ? fmtCap(selSlateValue) : '—'],
              ['SLATE HEALTH', sel.isFilmStudio ? `${sel.slateHealth || 60}/100` : '—'],
              ['BOARD SEAT', sel.playerBoardMember ? 'YES ✓' : '5% NEEDED'],
            ].map(([c, v]) => (
              <div key={c} className="bg-[#0e1118] border border-[#161b24] rounded-lg px-2 py-2 text-center">
                <span className="text-[7px] text-[#59616e] tracking-wider block">{c}</span>
                <b className="text-[10.5px] font-mono text-gray-200">{v}</b>
              </div>
            ))}
          </div>

          {/* studio news */}
          {(sel.news || []).length > 0 && (
            <div className="px-4 py-3 border-b border-[#161b24] space-y-1">
              <b className="text-[9px] tracking-[1.5px] text-[#8b96a8] block mb-1">📰 DESK NOTES</b>
              {sel.news.slice(0, 3).map((n, i) => (
                <p key={i} className="text-[9.5px] text-[#8b96a8] font-mono truncate">• {n}</p>
              ))}
            </div>
          )}

          {/* position + order */}
          <div className="p-4 space-y-3">
            {(sel.playerSharesOwned || 0) > 0 && (
              <div className="flex justify-between items-center bg-[#0e1118] border border-[#161b24] rounded-lg px-3 py-2.5 text-[10px] font-mono">
                <span className="text-[#8b96a8]">POSITION: {sel.playerSharesOwned.toLocaleString()} sh @ ${fmtPrice(sel.playerAvgBuyPrice)}</span>
                <b className={sel.sharePrice >= sel.playerAvgBuyPrice ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}>
                  {(((sel.sharePrice - sel.playerAvgBuyPrice) / Math.max(0.01, sel.playerAvgBuyPrice)) * 100).toFixed(1)}%
                </b>
              </div>
            )}
            <div className="flex bg-[#080a0e] rounded-lg p-1">
              <button onClick={() => setOrderSide('buy')} className={`flex-1 py-2 rounded-md text-[10.5px] font-black cursor-pointer ${orderSide === 'buy' ? 'bg-[#2ecc8f] text-[#04231a]' : 'text-[#59616e]'}`}>BUY {sel.ticker}</button>
              <button onClick={() => setOrderSide('sell')} className={`flex-1 py-2 rounded-md text-[10.5px] font-black cursor-pointer ${orderSide === 'sell' ? 'bg-[#f6465d] text-white' : 'text-[#59616e]'}`}>SELL {sel.ticker}</button>
            </div>
            <div className="flex items-center bg-[#080a0e] border border-[#161b24] rounded-lg overflow-hidden">
              <input type="number" value={shareCount} onChange={(e) => setShareCount(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-lg font-black font-mono px-3 py-2.5" placeholder="Shares" />
              <span className="px-3 py-2.5 text-[10px] font-black text-[#8b96a8] border-l border-[#161b24]">
                @ ${fmtPrice(sel.sharePrice)} = ${orderTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[10, 25, 50, 100].map((p) => (
                <button key={p} onClick={() => setPct(p)} className="flex-1 py-1.5 rounded-lg bg-[#080a0e] border border-[#161b24] text-[#8b96a8] text-[9px] font-black cursor-pointer">
                  {p === 100 ? (orderSide === 'buy' ? 'MAX CASH' : 'ALL SHARES') : `${p}%`}
                </button>
              ))}
            </div>
            <button onClick={executeOrder}
              className={`w-full py-3 rounded-xl text-[12px] font-black cursor-pointer ${orderSide === 'buy' ? 'bg-gradient-to-r from-[#2ecc8f] to-[#1d9e6c] text-[#04231a]' : 'bg-gradient-to-r from-[#f6465d] to-[#c73548] text-white'}`}>
              {orderSide === 'buy'
                ? `BUY ${count.toLocaleString()} ${sel.ticker} — $${orderTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : `SELL ${count.toLocaleString()} ${sel.ticker} — $${orderTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            </button>
          </div>

          {feedback && <div className="mx-4 mb-4 p-3 rounded-xl bg-[#2ecc8f]/10 border border-[#2ecc8f]/30 text-[#2ecc8f] text-[11px] font-bold text-center">{feedback}</div>}
        </div>
      ) : (
        <>
          {/* ============ MARKET TERMINAL ============ */}
          <div className="rounded-2xl border border-[#161b24] bg-[#0b0d12] overflow-hidden">
            <div className="flex justify-between items-center px-3.5 py-2.5 bg-[#0e1118] border-b border-[#161b24]">
              <div className="flex gap-1.5">
                <i className="w-2 h-2 rounded-full bg-[#f6465d] block" />
                <i className="w-2 h-2 rounded-full bg-[#f0b90b] block" />
                <i className="w-2 h-2 rounded-full bg-[#2ecc8f] block" />
              </div>
              <span className="text-[9px] font-black tracking-[2.5px] text-[#2ecc8f]">WALL STREET WEST · STUDIO EXCHANGE</span>
              <span className="text-[9px] font-mono text-[#59616e]">WK {player.dateWeek || 1} · {player.dateYear || 2026}</span>
            </div>

            {/* ticker */}
            <div className="overflow-hidden border-b border-[#161b24] py-1.5">
              <div className="flex gap-4 whitespace-nowrap w-max" style={{ animation: 'wsTicker 22s linear infinite' }}>
                {[...tickerList, ...tickerList].map((st, i) => (
                  <span key={i} className="text-[10px] font-mono font-bold">
                    <b className="text-[#8b96a8] mr-1.5">{st.ticker}</b>
                    <span className="text-gray-200">${fmtPrice(st.sharePrice)}</span>
                    <i className={`not-italic ml-1.5 font-black ${st.changePct >= 0 ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}`}>{st.changePct >= 0 ? '+' : ''}{st.changePct.toFixed(1)}%</i>
                  </span>
                ))}
              </div>
            </div>

            {/* index bar */}
            <div className="grid grid-cols-4 gap-1 px-3 py-2.5 m-3 my-2 bg-[#080a0e] rounded-xl border border-[#161b24] text-center">
              <div><span className="text-[7.5px] text-[#59616e] tracking-wider block">STUDIO INDEX</span><b className={`text-[11px] font-mono ${avgChange >= 0 ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}`}>{avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%</b></div>
              <div><span className="text-[7.5px] text-[#59616e] tracking-wider block">SLATE HEALTH</span><b className="text-[11px] font-mono text-gray-200">{avgSlateHealth.toFixed(0)}/100</b></div>
              <div><span className="text-[7.5px] text-[#59616e] tracking-wider block">PRODUCTIONS</span><b className="text-[11px] font-mono text-gray-200">{openProductions} FILMS</b></div>
              <div><span className="text-[7.5px] text-[#59616e] tracking-wider block">CASTING NOW</span><b className="text-[11px] font-mono text-[#f0b90b]">{liveCastingJobs} LIVE</b></div>
            </div>

            {/* tabs */}
            <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto">
              {([['MARKET', 'Market', stocks.length], ['LAUNCHES', 'Launches', upcomingIpos.length + recentListings.length], ['PORTFOLIO', 'Portfolio', positions.length], ['TX', 'History', stockTxs.length]] as const).map(([id, label, n]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-3.5 py-2 rounded-lg text-[10px] font-black whitespace-nowrap cursor-pointer ${activeTab === id ? 'bg-[#f0b90b] text-[#1a1206]' : 'bg-[#080a0e] text-[#8b96a8] border border-[#161b24]'}`}>
                  {label}{n > 0 ? ` (${n})` : ''}
                </button>
              ))}
            </div>
          </div>

          {feedback && <div className="p-3 rounded-xl bg-[#2ecc8f]/10 border border-[#2ecc8f]/30 text-[#2ecc8f] text-[11px] font-bold text-center">{feedback}</div>}

          {/* MARKET TAB */}
          {activeTab === 'MARKET' && (
            <>
              <div className="flex items-center gap-2 bg-[#0b0d12] border border-[#161b24] rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-[#59616e]" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Search ${stocks.length} companies & studios...`}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] text-gray-200 placeholder:text-[#3a4150]" />
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {([['SLATE', '🎬 Studios'], ['GAINERS', '📈 Gainers'], ['LOSERS', '📉 Losers'], ['CAP', '💎 Market Cap'], ['NEW', '🆕 New']] as const).map(([id, label]) => (
                  <button key={id} onClick={() => setSortMode(id)}
                    className={`px-3.5 py-1.5 rounded-full text-[9.5px] font-black whitespace-nowrap cursor-pointer border ${sortMode === id ? 'bg-[#f0b90b] text-[#1a1206] border-[#f0b90b]' : 'bg-[#0b0d12] text-[#8b96a8] border-[#161b24]'}`}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-[#161b24] bg-[#0b0d12] overflow-hidden">
                {filtered.map((st) => {
                  const casting = (st.slate || []).filter((p) => p.stage === 'CASTING').length;
                  const pipeline = (st.slate || []).filter((p) => p.stage !== 'RELEASED').length;
                  return (
                    <button key={st.id} onClick={() => { setSelected(st); setShareCount('10'); setOrderSide('buy'); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-3 border-b border-[#12161e] last:border-b-0 hover:bg-[#0e1118] cursor-pointer text-left">
                      <div className="w-9 h-9 rounded-lg bg-[#0e1118] border border-[#1b212c] flex items-center justify-center text-lg shrink-0">{st.logo}</div>
                      <div className="flex-1 min-w-0">
                        <b className="text-[11.5px] text-gray-100 block truncate">
                          {st.name}
                          {(st.weeksSinceListing ?? 99) <= 6 && <span className="ml-1.5 text-[7px] font-black bg-[#2ecc8f] text-[#04231a] px-1.5 py-0.5 rounded align-middle">NEW</span>}
                        </b>
                        <span className="text-[8px] text-[#59616e] font-mono block truncate">
                          {st.ticker} · {st.isFilmStudio ? `${pipeline} FILMS IN PIPELINE` : st.industry}
                        </span>
                        {casting > 0 && (
                          <span className="text-[7px] font-black text-[#f0b90b] bg-[#f0b90b]/15 border border-[#f0b90b]/35 rounded-full px-2 py-0.5 mt-1 inline-block">
                            ● {casting} CALLBOARD JOB{casting > 1 ? 'S' : ''} LIVE
                          </span>
                        )}
                      </div>
                      <Spark data={st.chartData || [st.sharePrice, st.sharePrice]} up={st.changePct >= 0} />
                      <div className="w-[74px] text-right shrink-0">
                        <b className="text-[11px] font-mono text-gray-100 block">${fmtPrice(st.sharePrice)}</b>
                        <span className={`text-[9.5px] font-black font-mono ${st.changePct >= 0 ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}`}>{st.changePct >= 0 ? '+' : ''}{st.changePct.toFixed(2)}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* LAUNCHES TAB */}
          {activeTab === 'LAUNCHES' && (
            <div className="rounded-2xl border border-[#161b24] bg-[#0b0d12] p-4 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <b className="text-[10px] tracking-[1.5px] text-[#8b96a8]">🚀 IPO RUNWAY</b>
                  <span className="text-[8px] text-[#59616e] font-mono">NEW STUDIOS EVERY 10-12 WKS</span>
                </div>
                {upcomingIpos.length === 0 ? (
                  <p className="text-[10px] text-[#59616e] font-mono py-2">No IPOs filed. New companies file regularly.</p>
                ) : (
                  upcomingIpos.map((ipo) => (
                    <div key={ipo.id} className="flex items-center gap-2.5 bg-[#0e1118] border border-dashed border-[#2a3038] rounded-lg px-3 py-2.5 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-[#080a0e] border border-[#1b212c] flex items-center justify-center text-base shrink-0">🗂️</div>
                      <div className="flex-1 min-w-0">
                        <b className="text-[11px] text-gray-100 block truncate">{ipo.companyName} <span className="text-[#59616e]">{ipo.ticker}</span></b>
                        <span className="text-[8.5px] text-[#59616e] block truncate">{ipo.industry} · IPO ${fmtPrice(ipo.ipoPrice)} · interest {ipo.investorInterest}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <b className="text-[14px] font-mono text-[#f0b90b] block">{ipo.weeksUntilLaunch}</b>
                        <span className="text-[7px] text-[#59616e]">WKS TO LIST</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div>
                <b className="text-[10px] tracking-[1.5px] text-[#8b96a8] block mb-2">🆕 RECENT LISTINGS</b>
                {recentListings.length === 0 ? (
                  <p className="text-[10px] text-[#59616e] font-mono py-2">No recent listings yet — the first new studio lands within 12 weeks.</p>
                ) : (
                  recentListings.map((st) => (
                    <button key={st.id} onClick={() => { setSelected(st); setOrderSide('buy'); setShareCount('10'); }}
                      className="w-full flex items-center gap-2.5 bg-[#0e1118] border border-[#161b24] rounded-lg px-3 py-2.5 mb-2 cursor-pointer text-left">
                      <div className="w-9 h-9 rounded-lg bg-[#080a0e] border border-[#1b212c] flex items-center justify-center text-base shrink-0">{st.logo}</div>
                      <div className="flex-1 min-w-0">
                        <b className="text-[11px] text-gray-100 block truncate">{st.name} <span className="text-[#59616e]">{st.ticker}</span></b>
                        <span className="text-[8.5px] text-[#59616e] block truncate">Listed {st.weeksSinceListing} wks ago · {fmtCap(st.marketCap)} cap{st.isFilmStudio ? ' · studio' : ''}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <b className="text-[11px] font-mono text-gray-100 block">${fmtPrice(st.sharePrice)}</b>
                        <span className={`text-[9px] font-mono font-black ${st.changePct >= 0 ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}`}>{st.changePct >= 0 ? '+' : ''}{st.changePct.toFixed(1)}%</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === 'PORTFOLIO' && (
            <div className="rounded-2xl border border-[#161b24] bg-[#0b0d12] p-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-[#59616e] font-extrabold tracking-wider">EQUITY PORTFOLIO</span>
                <b className="text-lg font-mono text-[#2ecc8f]">
                  ${positions.reduce((a, st) => a + st.playerSharesOwned * st.sharePrice, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </b>
              </div>
              {positions.length === 0 ? (
                <p className="text-[11px] text-[#59616e] font-mono py-5 text-center">No shares held. Open a position from the Market.</p>
              ) : (
                positions.map((st) => {
                  const pnl = ((st.sharePrice - st.playerAvgBuyPrice) / Math.max(0.01, st.playerAvgBuyPrice)) * 100;
                  return (
                    <button key={st.id} onClick={() => { setSelected(st); setOrderSide('sell'); setShareCount(String(st.playerSharesOwned)); }}
                      className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-[#0e1118] border border-[#161b24] cursor-pointer text-left">
                      <div className="w-9 h-9 rounded-lg bg-[#080a0e] border border-[#1b212c] flex items-center justify-center text-base shrink-0">{st.logo}</div>
                      <div className="flex-1 min-w-0">
                        <b className="text-[11px] text-gray-100 block truncate">{st.name} <span className="text-[#59616e]">{st.ticker}</span></b>
                        <span className="text-[8.5px] text-[#59616e] font-mono">{st.playerSharesOwned.toLocaleString()} sh @ ${fmtPrice(st.playerAvgBuyPrice)}{st.playerBoardMember ? ' · BOARD SEAT ✓' : ''}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <b className="text-[11.5px] font-mono text-gray-100 block">${(st.playerSharesOwned * st.sharePrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}</b>
                        <span className={`text-[9.5px] font-mono font-black ${pnl >= 0 ? 'text-[#2ecc8f]' : 'text-[#f6465d]'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* TX TAB */}
          {activeTab === 'TX' && (
            <div className="rounded-2xl border border-[#161b24] bg-[#0b0d12] overflow-hidden">
              {stockTxs.length === 0 ? (
                <p className="text-[10.5px] text-[#59616e] font-mono p-4 text-center">No trade history yet.</p>
              ) : (
                stockTxs.map((t) => (
                  <div key={t.id} className="flex justify-between items-center px-4 py-2.5 border-b border-[#12161e] last:border-b-0">
                    <div className="min-w-0">
                      <b className="text-[10.5px] text-gray-100 block truncate">{t.type} {t.units.toLocaleString()} {t.symbol}</b>
                      <span className="text-[8.5px] text-[#59616e] font-mono">@ ${fmtPrice(t.pricePerUnit)} · {t.timestamp}</span>
                    </div>
                    <b className={`text-[10.5px] font-mono shrink-0 ${t.type === 'BUY' || t.type === 'SUBSCRIBE' ? 'text-[#f6465d]' : 'text-[#2ecc8f]'}`}>
                      {t.type === 'BUY' || t.type === 'SUBSCRIBE' ? '−' : '+'}${t.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </b>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
