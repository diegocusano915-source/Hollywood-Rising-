/**
 * HOLLYWOOD RISING - STAR EXCHANGE (Option A rebuild)
 * Living crypto market: regime cycles (bull/bear/pump/crash), endless coin
 * pool with weekly listings every 10-12 weeks, delist reviews, per-coin
 * pumps/dumps/hacks, crypto trading tax, custom-amount orders. Every number
 * comes from the MarketEngineService — nothing static, nothing fake.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';
import {
  MarketEngineService,
  CryptoCoin,
  EconomyMarketState,
} from '../../services/marketEngineService';

interface StockCoinViewProps {
  onBack: () => void;
}

const fmtPrice = (v: number) => (v < 0.01 ? v.toFixed(6) : v < 1 ? v.toFixed(4) : v.toFixed(2));
const fmtCap = (v: number) => (v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`);
const iconBg = ['from-amber-500 to-yellow-700', 'from-violet-500 to-purple-800', 'from-sky-500 to-blue-800', 'from-rose-500 to-red-800', 'from-emerald-500 to-green-800', 'from-orange-500 to-amber-800', 'from-fuchsia-500 to-pink-800', 'from-cyan-500 to-teal-800', 'from-indigo-500 to-blue-900', 'from-lime-500 to-green-800'];
const bgFor = (id: string) => iconBg[Math.abs(id.charCodeAt(id.length - 1)) % iconBg.length];

const Spark = ({ data, up, w = 64, h = 26 }: { data: number[]; up: boolean; w?: number; h?: number }) => {
  const pts = data && data.length > 1 ? data : [1, 1];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const step = w / (pts.length - 1 || 1);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - 2 - ((p - min) / range) * (h - 4)).toFixed(1)}`).join(' ');
  const col = up ? '#3ddc97' : '#ff5b6e';
  const gid = `sg_${Math.abs(hashStr(String(pts[0]) + pts.length + w))}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.35" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w},${h} L0,${h} Z`} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={col} strokeWidth="1.5" />
    </svg>
  );
};
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

type SortMode = 'HOT' | 'NEW' | 'GAINERS' | 'LOSERS' | 'MCAP' | 'DEGEN';

export const StockCoinView: React.FC<StockCoinViewProps> = ({ onBack }) => {
  const { player, persistNow, saveData, updateSave } = useGame();

  const [marketState, setMarketState] = useState<EconomyMarketState>(() => MarketEngineService.getMarketState());
  const [activeTab, setActiveTab] = useState<'MARKET' | 'PORTFOLIO' | 'WHALES' | 'TX'>('MARKET');
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('HOT');

  // order panel
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amountMode, setAmountMode] = useState<'usd' | 'coin'>('usd');
  const [amount, setAmount] = useState('1000');

  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshMarket = () => setMarketState(MarketEngineService.getMarketState());
  useEffect(() => { refreshMarket(); }, []);

  const showFb = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4500);
  };

  const liveCoins = marketState.cryptoCoins.filter((c) => (c.status === 'Active' || c.status === 'TopLeader') && !c.isMyCoin);
  const holdings = marketState.cryptoCoins.filter((c) => c.playerHoldings > 0);
  const totalCryptoValuation = holdings.reduce((sum, c) => sum + c.playerHoldings * c.price, 0);
  const totalCap = liveCoins.reduce((a, c) => a + c.marketCap, 0);
  const totalVol = liveCoins.reduce((a, c) => a + c.volume24h, 0);
  const topCapCoin = [...liveCoins].sort((a, b) => b.marketCap - a.marketCap)[0];
  const dominance = topCapCoin && totalCap > 0 ? (topCapCoin.marketCap / totalCap) * 100 : 0;

  // Fear & Greed from the live regime
  const regime = marketState.cryptoRegime;
  const fearGreed = !regime ? 50
    : regime.type === 'PUMP' ? Math.min(95, 82 + regime.strength * 10)
    : regime.type === 'BULL' ? Math.min(80, 62 + regime.strength * 14)
    : regime.type === 'RECOVERY' ? 58
    : regime.type === 'NEUTRAL' ? 50
    : regime.type === 'BEAR' ? Math.max(18, 36 - regime.strength * 10)
    : Math.max(5, 14 - regime.strength * 6);
  const regimeLabel: Record<string, { icon: string; label: string; cls: string }> = {
    BULL: { icon: '🐂', label: 'BULL RUN', cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/40' },
    BEAR: { icon: '🐻', label: 'BEAR MARKET', cls: 'text-rose-300 bg-rose-500/10 border-rose-400/40' },
    PUMP: { icon: '🚀', label: 'PUMP CYCLE', cls: 'text-amber-300 bg-amber-500/10 border-amber-400/40' },
    CRASH: { icon: '💥', label: 'MARKET CRASH', cls: 'text-red-300 bg-red-500/15 border-red-400/50' },
    RECOVERY: { icon: '🌱', label: 'RECOVERY', cls: 'text-lime-300 bg-lime-500/10 border-lime-400/40' },
    NEUTRAL: { icon: '➖', label: 'NEUTRAL MARKET', cls: 'text-gray-300 bg-white/5 border-white/15' },
  };
  const rl = regimeLabel[regime?.type || 'NEUTRAL'];

  // ---- orders ----
  const coin = selectedCoin;
  const amtNum = parseFloat(amount) || 0;
  const fee = orderSide === 'buy'
    ? (amountMode === 'usd' ? amtNum * 0.001 : (amtNum * (coin?.price || 0)) * 0.001)
    : 0; // sell fee baked into price for simplicity
  const estReceive = orderSide === 'buy'
    ? (amountMode === 'usd' ? amtNum / (coin?.price || 1) : amtNum)
    : (amountMode === 'usd' ? amtNum : amtNum * (coin?.price || 0));

  const executeOrder = () => {
    if (!coin) return;
    if (orderSide === 'buy') {
      const usd = amountMode === 'usd' ? amtNum : amtNum * coin.price;
      if (usd <= 0) { showFb('❌ Enter an amount first.'); return; }
      if (usd > player.money) { showFb(`❌ Insufficient cash — need $${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`); return; }
      const res = MarketEngineService.buyCrypto(coin.symbol, usd, player.money);
      if (res.success) {
        player.money -= usd;
        persistNow();
        showFb(res.message);
      } else showFb(`❌ ${res.message}`);
    } else {
      const coinAmt = amountMode === 'usd' ? amtNum / coin.price : amtNum;
      if (coinAmt <= 0) { showFb('❌ Enter an amount first.'); return; }
      if (coinAmt > (coin.playerHoldings || 0) + 1e-9) { showFb(`❌ You only hold ${coin.playerHoldings.toFixed(4)} ${coin.symbol}.`); return; }
      const res = MarketEngineService.sellCrypto(coin.symbol, Math.min(coinAmt, coin.playerHoldings));
      if (res.success) {
        player.money += res.totalDollarRevenue;
        persistNow();
        showFb(res.message);
      } else showFb(`❌ ${res.message}`);
    }
    refreshMarket();
    const fresh = MarketEngineService.getMarketState().cryptoCoins.find((c) => c.symbol === coin.symbol);
    if (fresh) setSelectedCoin(fresh);
  };

  const setPctOfBalance = (pct: number) => {
    if (!coin) return;
    if (orderSide === 'buy') {
      const usd = (player.money * pct) / 100;
      setAmountMode('usd');
      setAmount(Math.floor(usd).toString());
    } else {
      const cAmt = ((coin.playerHoldings || 0) * pct) / 100;
      setAmountMode('coin');
      setAmount(cAmt.toFixed(4));
    }
  };


  // ---- filters ----
  const filtered = liveCoins
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      const matches = !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q);
      return matches;
    })
    .sort((a, b) => {
      switch (sortMode) {
        case 'NEW': return (a.weeksSinceListing || 99) - (b.weeksSinceListing || 99);
        case 'GAINERS': return b.change24h - a.change24h;
        case 'LOSERS': return a.change24h - b.change24h;
        case 'MCAP': return b.marketCap - a.marketCap;
        case 'DEGEN': return (b.risk === 'Extreme Degen' ? 1 : 0) - (a.risk === 'Extreme Degen' ? 1 : 0) || b.change24h - a.change24h;
        default: return b.popularity - a.popularity;
      }
    })
    .slice(0, 80);

  const tickerCoins = [...liveCoins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 8);
  // TRUE market-cap rank per coin — the single source the recap and founder
  // console both use. List position ≠ rank (HOT sorts by popularity).
  const mcapRankById: Record<string, number> = {};
  [...liveCoins].sort((a, b) => b.marketCap - a.marketCap).forEach((c, i) => { mcapRankById[c.id] = i + 1; });
  const wire = (marketState.cryptoWire || []).slice(0, 8);
  const cryptoTxs = marketState.transactions.filter((t) => t.assetType === 'CRYPTO').slice(0, 30);

  const sortChips: Array<{ id: SortMode; label: string }> = [
    { id: 'HOT', label: '🔥 Hot' },
    { id: 'NEW', label: '🆕 New' },
    { id: 'GAINERS', label: '📈 Gainers' },
    { id: 'LOSERS', label: '📉 Losers' },
    { id: 'MCAP', label: '💎 MCap' },
    { id: 'DEGEN', label: '🎲 Degen' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-3" style={{ backgroundColor: '#0a0c10' }}>
      <style>{`@keyframes starTicker { to { transform: translateX(-50%); } }`}</style>

      {/* Top nav */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => { if (selectedCoin) setSelectedCoin(null); else onBack(); }}
          className="px-4 py-2.5 rounded-xl bg-[#0e1117] border border-[#1b212c] text-gray-300 text-xs font-black flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#3ddc97]" />
          <span>{selectedCoin ? 'Back to Market' : 'Back to World'}</span>
        </button>
        <span className="text-[9px] font-black text-[#6b7484] tracking-[2px] hidden sm:block">STAR EXCHANGE · {liveCoins.length} COINS LIVE</span>
      </div>

      {/* ============ COIN DETAIL ============ */}
      {selectedCoin && coin ? (
        <div className="rounded-2xl border border-[#1b212c] bg-[#0e1117] overflow-hidden">
          {/* header */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${bgFor(coin.id)} flex items-center justify-center text-xl`}>{coin.icon || '🪙'}</div>
              <div>
                <b className="text-base text-white block">{coin.name}</b>
                <span className="text-[9px] text-[#6b7484]">{coin.symbol} · {coin.sector} · {coin.risk}</span>
              </div>
            </div>
            <div className="text-right">
              <b className={`text-2xl font-mono ${coin.change24h >= 0 ? 'text-[#3ddc97]' : 'text-[#ff5b6e]'}`}>${fmtPrice(coin.price)}</b>
              <span className={`text-[11px] font-black block font-mono ${coin.change24h >= 0 ? 'text-[#3ddc97]' : 'text-[#ff5b6e]'}`}>
                {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}% wk
              </span>
            </div>
          </div>

          {/* chart */}
          <div className="mx-4 mb-3 bg-[#0b0e14] border border-[#1b212c] rounded-xl p-3">
            <div className="flex gap-3 text-[8.5px] font-black text-[#6b7484] mb-2">
              <span className="text-[#f5b942]">SPARK · 12W</span>
              <span>ATH ${fmtPrice(coin.athPrice || coin.price)}</span>
              <span>{(coin.weeksSinceListing || 0)}w on exchange</span>
            </div>
            <Spark data={coin.sparkline?.length > 1 ? coin.sparkline : [coin.price * 0.95, coin.price]} up={coin.change24h >= 0} w={320} h={90} />
          </div>

          {/* delist warning */}
          {coin.delistWarning && (
            <div className="mx-4 mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-400/40 text-rose-300 text-[10px] font-bold leading-relaxed">
              ⚠️ UNDER DELIST REVIEW — {coin.delistStreak || 0} consecutive weak weeks. If removed, holdings are force-liquidated at a 40% discount. You hold {coin.playerHoldings.toFixed(4)} {coin.symbol}.
            </div>
          )}

          {/* stats */}
          <div className="grid grid-cols-3 gap-1.5 px-4">
            {[
              ['MARKET CAP', fmtCap(coin.marketCap)],
              ['24H VOLUME', fmtCap(coin.volume24h)],
              ['SUPPLY', `${(coin.circulatingSupply / 1e6).toFixed(1)}M`],
              ['7D CHANGE', `${coin.change7d >= 0 ? '+' : ''}${(coin.change7d || 0).toFixed(1)}%`],
              ['COMMUNITY', `${coin.communityStrength}/100`],
              ['VOLATILITY', coin.volatility],
            ].map(([cap2, v], i) => (
              <div key={cap2} className="bg-[#0b0e14] border border-[#1b212c] rounded-lg px-2 py-2">
                <span className="text-[7.5px] text-[#6b7484] tracking-wider block">{cap2}</span>
                <b className={`text-[11px] font-mono ${i === 3 && (coin.change7d || 0) < 0 ? 'text-[#ff5b6e]' : 'text-gray-200'}`}>{v}</b>
              </div>
            ))}
          </div>

          {/* protocol */}
          <div className="m-4 p-3 rounded-xl bg-[#0b0e14] border border-[#1b212c]">
            <p className="text-[9px] font-black text-[#f5b942] tracking-wider mb-1">PROTOCOL</p>
            <p className="text-[10.5px] text-gray-300 leading-relaxed">{coin.techDescription}</p>
            {coin.news && <p className="text-[9.5px] text-[#8b96a8] mt-2 italic">📰 {coin.news}</p>}
          </div>

          {/* order panel */}
          <div className="m-4 mt-0 bg-[#0b0e14] border border-[#1b212c] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <b className="text-[11px] text-[#f5b942] tracking-wider">ORDER PANEL</b>
              <span className="text-[9px] font-mono text-[#6b7484]">CASH ${player.money.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="flex bg-[#0e1117] rounded-lg p-1 mb-3">
              <button onClick={() => setOrderSide('buy')} className={`flex-1 py-2 rounded-md text-[10.5px] font-black cursor-pointer ${orderSide === 'buy' ? 'bg-[#3ddc97] text-[#06251a]' : 'text-[#6b7484]'}`}>BUY {coin.symbol}</button>
              <button onClick={() => setOrderSide('sell')} className={`flex-1 py-2 rounded-md text-[10.5px] font-black cursor-pointer ${orderSide === 'sell' ? 'bg-[#ff5b6e] text-white' : 'text-[#6b7484]'}`}>SELL {coin.symbol}</button>
            </div>

            <div className="flex items-center bg-[#0e1117] border border-[#1b212c] rounded-lg overflow-hidden">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-lg font-black font-mono px-3 py-2.5"
                placeholder="0.00"
              />
              <button
                onClick={() => setAmountMode(amountMode === 'usd' ? 'coin' : 'usd')}
                className="px-3 py-2.5 text-[10px] font-black text-[#8b96a8] border-l border-[#1b212c] cursor-pointer"
              >
                {amountMode === 'usd' ? 'USD ⇄' : coin.symbol.replace('$', '') + ' ⇄'}
              </button>
            </div>

            <div className="flex justify-between text-[9.5px] font-mono text-[#8b96a8] mt-2">
              <span>{orderSide === 'buy' ? 'YOU RECEIVE ≈' : 'YOU GET ≈'}</span>
              <b className="text-gray-200">
                {orderSide === 'buy'
                  ? `${estReceive.toFixed(4)} ${coin.symbol}`
                  : `$${estReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              </b>
            </div>


            <div className="flex gap-1.5 mt-3">
              {[10, 25, 50, 75, 100].map((p) => (
                <button key={p} onClick={() => setPctOfBalance(p)} className="flex-1 py-1.5 rounded-lg bg-[#0e1117] border border-[#1b212c] text-[#8b96a8] text-[9px] font-black cursor-pointer">
                  {p === 100 ? 'MAX' : `${p}%`}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-[9px] font-mono text-[#6b7484] mt-3">
              <span>EST. FEE 0.1%</span>
              <span>${fee.toFixed(2)}</span>
              <span>SELLS ARE TAXED ON GAIN</span>
            </div>

            <button
              onClick={executeOrder}
              className={`w-full mt-3 py-3 rounded-xl text-[12px] font-black cursor-pointer ${
                orderSide === 'buy' ? 'bg-gradient-to-r from-[#3ddc97] to-[#2aa876] text-[#06251a]' : 'bg-gradient-to-r from-[#ff5b6e] to-[#c73548] text-white'
              }`}
            >
              {orderSide === 'buy'
                ? `BUY ${amountMode === 'usd' ? `$${(parseFloat(amount) || 0).toLocaleString()}` : `${parseFloat(amount) || 0} ${coin.symbol.replace('$', '')}`}`
                : `SELL ${amountMode === 'usd' ? `$${parseFloat(amount) || 0}` : `${parseFloat(amount) || 0} ${coin.symbol.replace('$', '')}`}`}
            </button>

            {coin.playerHoldings > 0 && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#0e1117] border border-[#1b212c] flex justify-between items-center text-[9.5px] font-mono">
                <span className="text-[#8b96a8]">POSITION: {coin.playerHoldings.toFixed(4)} {coin.symbol} @ avg ${fmtPrice(coin.playerAvgBuyPrice)}</span>
                <b className={(coin.price - coin.playerAvgBuyPrice) >= 0 ? 'text-[#3ddc97]' : 'text-[#ff5b6e]'}>
                  {((coin.price - coin.playerAvgBuyPrice) / Math.max(0.000001, coin.playerAvgBuyPrice) * 100).toFixed(1)}%
                </b>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ============ LIVE TICKER ============ */}
          <div className="rounded-2xl border border-[#1b212c] bg-[#0e1117] overflow-hidden">
            <div className="overflow-hidden py-2">
              <div className="flex gap-5 whitespace-nowrap w-max" style={{ animation: 'starTicker 24s linear infinite' }}>
                {[...tickerCoins, ...tickerCoins].map((c, i) => (
                  <span key={i} className="text-[10px] font-mono font-bold">
                    <b className="text-[#8b96a8] mr-1.5">{c.symbol}</b>
                    <span className="text-gray-200">${fmtPrice(c.price)}</span>
                    <i className={`not-italic ml-1.5 font-black ${c.change24h >= 0 ? 'text-[#3ddc97]' : 'text-[#ff5b6e]'}`}>
                      {c.change24h >= 0 ? '+' : ''}{c.change24h.toFixed(1)}%
                    </i>
                  </span>
                ))}
              </div>
            </div>

            {/* header + global stats */}
            <div className="px-4 pb-1 flex justify-between items-center">
              <div>
                <h2 className="text-[15px] font-black text-white">⚡ STAR EXCHANGE</h2>
                <div className="text-[8.5px] text-[#6b7484] tracking-[2px] font-extrabold mt-0.5">LIVING CRYPTO MARKET · {liveCoins.length} COINS · NEW LISTINGS EVERY 10-12 WKS</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 px-3 py-2 m-3 mt-2 bg-[#0b0e14] rounded-xl border border-[#1b212c] text-center">
              <div><span className="text-[7.5px] text-[#6b7484] tracking-wider block">TOTAL CAP</span><b className="text-[11px] font-mono text-[#3ddc97]">{fmtCap(totalCap)}</b></div>
              <div><span className="text-[7.5px] text-[#6b7484] tracking-wider block">WEEK VOLUME</span><b className="text-[11px] font-mono text-gray-200">{fmtCap(totalVol)}</b></div>
              <div><span className="text-[7.5px] text-[#6b7484] tracking-wider block">{topCapCoin?.symbol || '—'} DOM</span><b className="text-[11px] font-mono text-gray-200">{dominance.toFixed(0)}%</b></div>
              <div><span className="text-[7.5px] text-[#6b7484] tracking-wider block">FEAR & GREED</span><b className={`text-[11px] font-mono ${fearGreed >= 60 ? 'text-[#3ddc97]' : fearGreed <= 35 ? 'text-[#ff5b6e]' : 'text-[#f5b942]'}`}>{fearGreed.toFixed(0)}</b></div>
            </div>

            {/* regime banner */}
            {regime && (
              <div className={`mx-3 mb-3 px-3.5 py-2.5 rounded-xl border flex justify-between items-center ${rl.cls}`}>
                <span className="text-[11px] font-black flex items-center gap-2">{rl.icon} {rl.label}</span>
                <span className="text-[8.5px] font-mono font-bold opacity-80">
                  WK {regime.weeksTotal - regime.weeksRemaining + 1} OF ~{regime.weeksTotal} · STRENGTH {(regime.strength * 100).toFixed(0)}%
                </span>
              </div>
            )}

            {/* tabs */}
            <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto">
              {([
                ['MARKET', 'Market', liveCoins.length],
                ['PORTFOLIO', 'Portfolio', holdings.length],
                ['WHALES', 'Whales', marketState.whales.length],
                ['TX', 'History', cryptoTxs.length],
              ] as const).map(([id, label, count]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-3.5 py-2 rounded-lg text-[10px] font-black whitespace-nowrap cursor-pointer ${activeTab === id ? 'bg-[#f5b942] text-[#1a1206]' : 'bg-[#0b0e14] text-[#8b96a8] border border-[#1b212c]'}`}>
                  {label} {count > 0 && `(${count})`}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className="p-3 rounded-xl bg-[#3ddc97]/10 border border-[#3ddc97]/30 text-[#3ddc97] text-[11px] font-bold text-center">{feedback}</div>
          )}

          {/* ============ MARKET TAB ============ */}
          {activeTab === 'MARKET' && (
            <>
              <div className="mx-0.5 flex items-center gap-2 bg-[#0e1117] border border-[#1b212c] rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-[#6b7484]" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${liveCoins.length} coins, sectors, symbols...`}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-[11px] text-gray-200 placeholder:text-[#556074]" />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {sortChips.map((c) => (
                  <button key={c.id} onClick={() => setSortMode(c.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[9.5px] font-black whitespace-nowrap cursor-pointer border ${sortMode === c.id ? 'bg-[#f5b942] text-[#1a1206] border-[#f5b942]' : 'bg-[#0e1117] text-[#8b96a8] border-[#1b212c]'}`}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* coin rows — index is LIST ORDER, 🏙 chip is the TRUE market-cap rank */}
              <div className="rounded-2xl border border-[#1b212c] bg-[#0e1117] overflow-hidden">
                {filtered.map((c, idx) => (
                  <button key={c.id} onClick={() => { setSelectedCoin(c); setAmount('1000'); setOrderSide('buy'); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-3 border-b border-[#141924] last:border-b-0 hover:bg-[#131824] cursor-pointer text-left">
                    <span className="w-5 text-[9px] text-[#556074] font-extrabold text-center">{idx + 1}</span>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${bgFor(c.id)} flex items-center justify-center text-sm shrink-0`}>{c.icon || '🪙'}</div>
                    <div className="flex-1 min-w-0">
                      <b className="text-[11.5px] text-gray-100 block truncate">
                        {c.name}
                        {mcapRankById[c.id] === 1 && <span className="ml-1.5 text-[7px] font-black bg-[#f5b942] text-[#1a1206] px-1.5 py-0.5 rounded align-middle">👑 #1 MCAP</span>}
                        {c.isMyCoin && mcapRankById[c.id] !== undefined && mcapRankById[c.id] > 1 && <span className="ml-1.5 text-[7px] font-black bg-sky-400/20 text-sky-300 px-1.5 py-0.5 rounded border border-sky-400/40 align-middle">RANK #{mcapRankById[c.id]}</span>}
                        {(c.weeksSinceListing || 0) <= 6 && <span className="ml-1.5 text-[7px] font-black bg-[#3ddc97] text-[#06251a] px-1.5 py-0.5 rounded align-middle">NEW</span>}
                        {c.delistWarning && <span className="ml-1.5 text-[7px] font-black bg-[#ff5b6e]/20 text-[#ff5b6e] px-1.5 py-0.5 rounded border border-[#ff5b6e]/40 align-middle">RISK</span>}
                      </b>
                      <span className="text-[8.5px] text-[#6b7484] block truncate">{c.symbol} · {c.sector}</span>
                    </div>
                    <Spark data={c.sparkline?.length > 1 ? c.sparkline : [c.price, c.price]} up={(c.change24h || 0) >= 0} />
                    <div className="w-[72px] text-right shrink-0">
                      <b className="text-[11px] font-mono text-gray-100 block">${fmtPrice(c.price)}</b>
                      <span className={`text-[9.5px] font-black font-mono ${(c.change24h || 0) >= 0 ? 'text-[#3ddc97]' : 'text-[#ff5b6e]'}`}>
                        {(c.change24h || 0) >= 0 ? '+' : ''}{(c.change24h || 0).toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* exchange wire */}
              <div className="rounded-2xl border border-[#1b212c] bg-[#0e1117] p-4">
                <b className="text-[10px] font-black text-[#f5b942] tracking-[1.5px] block mb-2">📡 EXCHANGE WIRE</b>
                {wire.length === 0 ? (
                  <p className="text-[10px] text-[#6b7484] font-mono">No wire events yet — listings, delists and pumps will appear here.</p>
                ) : (
                  wire.map((w) => (
                    <div key={w.id} className="flex gap-2.5 items-center py-2 border-b border-[#141924] last:border-b-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[13px] shrink-0 ${
                        w.kind === 'LISTING' ? 'bg-[#3ddc97]/15' : w.kind === 'DELISTED' || w.kind === 'DELIST_VOTE' ? 'bg-[#ff5b6e]/15' : w.kind === 'PUMP' ? 'bg-[#f5b942]/15' : w.kind === 'REGIME' ? 'bg-violet-500/15' : 'bg-white/5'
                      }`}>
                        {w.kind === 'LISTING' ? '🆕' : w.kind === 'DELISTED' ? '❌' : w.kind === 'DELIST_VOTE' ? '⚠️' : w.kind === 'PUMP' ? '🚀' : w.kind === 'DUMP' ? '📉' : w.kind === 'REGIME' ? '🌍' : '🐋'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <b className="text-[10.5px] text-gray-100 block truncate">{w.title}</b>
                        <span className="text-[8.5px] text-[#6b7484] block truncate">{w.sub}</span>
                      </div>
                      <span className="text-[8px] text-[#556074] font-mono shrink-0">W{w.week}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ============ PORTFOLIO TAB ============ */}
          {activeTab === 'PORTFOLIO' && (
            <div className="rounded-2xl border border-[#1b212c] bg-[#0e1117] p-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-[#6b7484] font-extrabold tracking-wider">WALLET VALUATION</span>
                <b className="text-xl font-mono text-[#3ddc97]">${totalCryptoValuation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</b>
              </div>
              {holdings.length === 0 ? (
                <p className="text-[11px] text-[#6b7484] font-mono py-6 text-center">No tokens held. Open a position from the Market.</p>
              ) : (
                holdings.map((c) => {
                  const pnlPct = ((c.price - c.playerAvgBuyPrice) / Math.max(0.000001, c.playerAvgBuyPrice)) * 100;
                  return (
                    <button key={c.id} onClick={() => { setSelectedCoin(c); setOrderSide('sell'); setAmount(c.playerHoldings.toFixed(4)); setAmountMode('coin'); }}
                      className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-[#0b0e14] border border-[#1b212c] text-left cursor-pointer">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${bgFor(c.id)} flex items-center justify-center text-sm shrink-0`}>{c.icon || '🪙'}</div>
                      <div className="flex-1 min-w-0">
                        <b className="text-[11px] text-gray-100 block truncate">{c.name} <span className="text-[#6b7484]">{c.symbol}</span></b>
                        <span className="text-[8.5px] text-[#6b7484] font-mono">{c.playerHoldings.toFixed(4)} @ avg ${fmtPrice(c.playerAvgBuyPrice)}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <b className="text-[11.5px] font-mono text-gray-100 block">${(c.playerHoldings * c.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}</b>
                        <span className={`text-[9.5px] font-mono font-black ${pnlPct >= 0 ? 'text-[#3ddc97]' : 'text-[#ff5b6e]'}`}>{pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%</span>
                      </div>
                    </button>
                  );
                })
              )}
              <p className="text-[8.5px] text-[#556074] font-mono pt-1">◈ Realized gains are taxed weekly as crypto income. Losses offset gains.</p>
            </div>
          )}

          {/* ============ WHALES TAB — 47 whales, copy-trade connected ============ */}
          {activeTab === 'WHALES' && (() => {
            const [whaleSearch, setWhaleSearch] = useState('');
            const filtered = marketState.whales.filter((w) => !whaleSearch || w.name.toLowerCase().includes(whaleSearch.toLowerCase()) || w.strategy.toLowerCase().includes(whaleSearch.toLowerCase()));
            const copied = marketState.whales.filter((w) => w.copyTradeActive);
            const copyWhale = (id: string) => {
              const s = MarketEngineService.getMarketState();
              const w = s.whales.find((x) => x.id === id);
              if (!w) return;
              // Real cost check: the copy-trade fee hits your cash monthly via the market
              if (w.copyTradeActive) { w.copyTradeActive = false; MarketEngineService.saveMarketState(s); setMarketState({ ...MarketEngineService.getMarketState() }); return; }
              w.copyTradeActive = true;
              MarketEngineService.saveMarketState(s);
              setMarketState({ ...MarketEngineService.getMarketState() });
            };
            return (
              <>
                <div className="flex gap-1.5 items-center">
                  <input value={whaleSearch} onChange={(e) => setWhaleSearch(e.target.value)} placeholder={`Search ${marketState.whales.length} whales...`}
                    className="flex-1 bg-[#0e1117] border border-[#1b212c] rounded-xl px-3 py-2 text-[10px] text-gray-200 outline-none" />
                  {copied.length > 0 && <span className="text-[8px] font-black text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 px-2 py-1.5 rounded-lg shrink-0">COPYING {copied.length}</span>}
                </div>
                <div className="rounded-2xl border border-[#1b212c] bg-[#0e1117] overflow-hidden">
                  {filtered.map((w) => (
                    <div key={w.id} className={`flex items-center gap-3 px-4 py-3 border-b border-[#141924] last:border-b-0 ${w.copyTradeActive ? 'bg-emerald-500/5' : ''}`}>
                      <img src={w.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <b className="text-[11px] text-gray-100 block truncate">{w.name} {w.copyTradeActive && <span className="text-[7px] text-emerald-300">● COPYING</span>}</b>
                        <span className="text-[8.5px] text-[#6b7484] block truncate">{w.strategy} · {w.topPositions.slice(0, 3).join(' · ')}</span>
                        <span className="text-[7.5px] text-[#6b7484] block font-mono">fee {w.copyTradeFeePct}%/mo of copied profits · lifetime profit {fmtCap(w.totalProfit)}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <b className="text-[10.5px] font-mono text-[#f5b942] block">{fmtCap(w.capital)}</b>
                        <span className="text-[8.5px] text-[#6b7484] font-mono">{w.winRatePct}% WR</span>
                        <button onClick={() => copyWhale(w.id)}
                          className={`mt-1 px-2.5 py-1 rounded-lg text-[8px] font-black cursor-pointer block ml-auto ${w.copyTradeActive ? 'bg-emerald-500 text-emerald-950' : 'bg-white/10 text-gray-300 border border-white/15'}`}>
                          {w.copyTradeActive ? 'STOP' : 'COPY'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[7.5px] text-[#5c6470] font-mono leading-relaxed px-1">
                  COPY-TRADE: the whale's coin positions mirror into your portfolio weekly (same buys/sells, sized to your cash) · fee % applies to copied profits only · wins and losses are REAL
                </p>
              </>
            );
          })()}

          {/* ============ TX TAB ============ */}
          {activeTab === 'TX' && (
            <div className="rounded-2xl border border-[#1b212c] bg-[#0e1117] overflow-hidden">
              {cryptoTxs.length === 0 ? (
                <p className="text-[10.5px] text-[#6b7484] font-mono p-4 text-center">No swap history yet.</p>
              ) : (
                cryptoTxs.map((t) => (
                  <div key={t.id} className="flex justify-between items-center px-4 py-2.5 border-b border-[#141924] last:border-b-0">
                    <div className="min-w-0">
                      <b className="text-[10.5px] text-gray-100 block truncate">{t.type} {t.units.toFixed(4)} {t.symbol}</b>
                      <span className="text-[8.5px] text-[#6b7484] font-mono">@ ${fmtPrice(t.pricePerUnit)} · {t.timestamp}</span>
                    </div>
                    <b className={`text-[10.5px] font-mono shrink-0 ${t.type === 'BUY' ? 'text-[#ff5b6e]' : 'text-[#3ddc97]'}`}>
                      {t.type === 'BUY' ? '−' : '+'}${t.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </b>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {feedback && selectedCoin && (
        <div className="p-3 rounded-xl bg-[#3ddc97]/10 border border-[#3ddc97]/30 text-[#3ddc97] text-[11px] font-bold text-center">{feedback}</div>
      )}

    </div>
  );
};
