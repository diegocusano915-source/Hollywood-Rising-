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
  fmtTokens,
} from '../../services/marketEngineService';
import { SocialsService } from '../../services/socialsService';
import { flagEmergencyCryptoAudit } from '../../services/taxEngine';

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

  // fan token deploy
  const [showDeploy, setShowDeploy] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenPrice, setTokenPrice] = useState(1.0);
  // tokenomics — allocation must total 100%
  const [tokenSupply, setTokenSupply] = useState(1000000000);
  const [founderPct, setFounderPct] = useState(70);
  const [airdropPct, setAirdropPct] = useState(15);
  const [liquidityPct, setLiquidityPct] = useState(15);
  const tokSum = founderPct + airdropPct + liquidityPct;

  const handleDeployToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName || !tokenSymbol) { showFb('❌ Token name and symbol required.'); return; }
    if (tokSum !== 100) { showFb(`❌ Tokenomics must total 100% — currently ${tokSum}%.`); return; }
    const res = MarketEngineService.launchPlayerCrypto(tokenName, tokenSymbol, tokenPrice, player.fameXp || 0, player.money, {
      totalSupply: tokenSupply, founderPct, airdropPct, liquidityPct,
    });
    if (res.success) {
      player.money -= 100000;
      persistNow();
      setShowDeploy(false);
      setTokenName(''); setTokenSymbol('');
    }
    showFb(res.message);
    refreshMarket();
  };

  const refreshMarket = () => setMarketState(MarketEngineService.getMarketState());
  useEffect(() => { refreshMarket(); }, []);

  const showFb = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4500);
  };

  const liveCoins = marketState.cryptoCoins.filter((c) => c.status === 'Active' || c.status === 'TopLeader');
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
  // founder-size sell preview: tokens being sold + live slippage estimate
  const sellTokens = orderSide === 'sell' ? (amountMode === 'usd' ? amtNum / (coin?.price || 1) : amtNum) : 0;
  const sellImpact = orderSide === 'sell' && coin?.isMyCoin
    ? MarketEngineService.estimateFounderSellImpact(coin.symbol, sellTokens)
    : null;

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
      const prePrice = coin.price;
      const preTrust = coin.communityStrength;
      const res = MarketEngineService.sellCrypto(coin.symbol, Math.min(coinAmt, coin.playerHoldings));
      if (res.success) {
        player.money += res.totalDollarRevenue;

        // ---- FOUNDER DUMP CONSEQUENCES (visible, real) ----
        if (res.dumpReport) {
          const d = res.dumpReport;
          // 1. crypto X turns on you: NPC posts + follower dip
          const chatterLines = SocialsService.spawnFounderDumpChatter({
            symbol: d.symbol, supplyPct: d.supplyPct, slipPct: d.slipPct, priceBefore: prePrice, priceAfter: d.priceAfter,
          });
          // 2. emergency tax audit — exchange reporting flags the LIQUIDATION:
          //    founder allocation was near-free, so at least 40% of proceeds
          //    is treated as gain even when slippage crushes spot PnL.
          const realizedGain = Math.max(0, Math.floor(d.proceeds - d.tokensSold * (coin.playerAvgBuyPrice || 0)));
          const audit = flagEmergencyCryptoAudit({
            week: player.dateWeek, year: player.dateYear,
            gainAmount: Math.max(realizedGain, Math.floor(d.proceeds * 0.4)),
            accountantTier: (player as any).empire?.taxState?.accountantTier,
            lawyerActive: !!(player as any).representation?.lawyer?.signed,
            symbol: d.symbol,
          });
          if (audit.penalty > 0) player.money = Math.max(0, player.money - audit.penalty);
          // 3. fan trust hit — followers watched you dump on them
          const fansHit = Math.floor(player.fans * Math.min(0.12, d.supplyPct / 400));
          player.fans = Math.max(0, player.fans - fansHit);

          // 4. inbox: the audit notice + community fallout report
          try {
            const dateText = `Week ${player.dateWeek}, ${player.dateYear}`;
            updateSave({
              ...saveData,
              player: { ...player },
              inbox: [
                {
                  id: `msg_dump_audit_${Date.now()}`,
                  category: 'LEGAL' as any,
                  sender: 'Internal Revenue Service — Crypto Compliance Desk',
                  senderRole: 'Emergency Audit Unit',
                  subject: audit.dismissed ? `⚖️ AUDIT DISMISSED: ${audit.subject.replace('🚨 EMERGENCY TAX AUDIT: ', '')}` : audit.subject,
                  body: audit.body,
                  date: dateText,
                  read: false,
                  dateWeek: player.dateWeek,
                  dateYear: player.dateYear,
                },
                {
                  id: `msg_dump_fallout_${Date.now()}`,
                  category: 'MEDIA' as any,
                  sender: `${d.coinName} Community Relations`,
                  senderRole: 'Holder Liaison Office',
                  subject: `🚨 FOUNDER DUMP FALLOUT: $${d.symbol} holders are in revolt`,
                  body: `COMMUNITY IMPACT REPORT — founder liquidation of ${d.supplyPct.toFixed(1)}% of supply\n\n• Tokens sold: ${fmtTokens(d.tokensSold)} ($${d.proceeds.toLocaleString()} gross after ${d.slipPct}% slippage)\n• Price: $${d.priceBefore < 1 ? d.priceBefore.toFixed(4) : d.priceBefore.toFixed(2)} → $${d.priceAfter < 1 ? d.priceAfter.toFixed(4) : d.priceAfter.toFixed(2)}\n• Community trust: ${d.trustBefore}/100 → ${d.trustAfter}/100\n• Fans lost: ${fansHit.toLocaleString()} (${(Math.min(12, d.supplyPct / 4)).toFixed(1)}% of your fanbase)\n• X followers: walking out — check your socials, the timeline is brutal.\n\nCrypto X is covered in whale alerts and dump accusations. Trust rebuilds slowly — or never, if you do it again.`,
                  date: dateText,
                  read: false,
                  dateWeek: player.dateWeek,
                  dateYear: player.dateYear,
                },
                ...saveData.inbox,
              ],
            });
          } catch (e) {
            persistNow();
          }
          showFb(`🚨 DUMP FALLOUT: ${chatterLines[0]} ${audit.dismissed ? '⚖️ Audit dismissed — your lawyer fought it off.' : `Penalty $${audit.penalty.toLocaleString()} deducted.`} Fans −${fansHit.toLocaleString()}, trust ${preTrust} → ${d.trustAfter}.`);
        } else {
          persistNow();
          showFb(res.message);
        }
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

  // ---- founder ops (your own fan token) ----
  const myStatus = coin?.isMyCoin ? MarketEngineService.getMyCoinStatus() : null;
  const [injectAmt, setInjectAmt] = useState('50000');
  const [rugStep, setRugStep] = useState(0);
  const [airdropAmt, setAirdropAmt] = useState('1000000');

  const handleAirdrop = () => {
    if (!coin) return;
    const amt = parseFloat(airdropAmt) || 0;
    const res = MarketEngineService.airdropToCommunity(coin.symbol, amt, player.dateWeek + (player.dateYear * 52));
    if (res.success) {
      // broadcast on social — reach converts to platform followers only
      // (game fans come exclusively from movie releases and awards)
      const post = SocialsService.postAirdropAnnouncement(player, {
        symbol: coin.symbol,
        coinName: coin.name,
        tokenAmount: amt,
        fmtAmount: fmtTokens(amt),
      });
      if (post.success) {
        // crypto NPC accounts react: claim posts now + weeks of hype chatter
        const afterCoin = MarketEngineService.getMarketState().cryptoCoins.find((c) => c.symbol === coin.symbol);
        SocialsService.igniteCoinHype({ symbol: coin.symbol, coinName: coin.name, holders: (afterCoin?.airdropHolders) || 0 });
      }
      persistNow();
      showFb(`${res.message}${post.success ? ` ${post.message}` : ''}`);
    } else {
      showFb(`❌ ${res.message}`);
    }
    refreshMarket();
    const fresh = MarketEngineService.getMarketState().cryptoCoins.find((c) => c.symbol === coin.symbol);
    if (fresh) setSelectedCoin(fresh);
  };

  const handleInject = () => {
    if (!coin) return;
    const amt = parseFloat(injectAmt) || 0;
    const res = MarketEngineService.injectCashIntoMyCoin(coin.symbol, amt, player.money);
    if (res.success) {
      player.money -= amt;
      persistNow();
    }
    showFb(res.message);
    refreshMarket();
    const fresh = MarketEngineService.getMarketState().cryptoCoins.find((c) => c.symbol === coin.symbol);
    if (fresh) setSelectedCoin(fresh);
  };

  const handleRug = () => {
    const res = MarketEngineService.rugPullMyCoin();
    if (res.success && res.consequences) {
      const c = res.consequences;
      const fansBefore = player.fans;
      player.fans = Math.floor(player.fans * (1 - c.fansLostPct / 100));
      player.fameXp = Math.max(0, Math.floor(player.fameXp * (1 - c.fameHitPct / 100)));
      player.publicReputation = Math.max(0, (player.publicReputation || 0) - c.reputationHit);
      player.industryRespect = Math.max(0, (player.industryRespect || 0) - c.industryRespectHit);
      player.money = Math.max(0, player.money + res.proceeds - c.fine);
      persistNow();
      showFb(`☠️ ${res.message} Fans −${(fansBefore - player.fans).toLocaleString()} (${c.fansLostPct}%), fame −${c.fameHitPct}%, regulators clawed back $${c.fine.toLocaleString()}. You are blacklisted from launching new tokens.`);
      setRugStep(0);
      setSelectedCoin(null);
    } else {
      showFb(res.message);
    }
    refreshMarket();
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

          {/* FOUNDER CONSOLE — your coin, your controls */}
          {coin.isMyCoin && myStatus && (
            <div className="mx-4 mb-3 rounded-xl border border-amber-400/30 bg-amber-500/5 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <b className="text-[10.5px] text-amber-300 tracking-widest">🎖 FOUNDER CONSOLE</b>
                <span className="text-[9px] font-mono text-amber-200/70">YOUR COIN · YOUR RULES</span>
              </div>

              {/* competition rank */}
              <div className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2 border border-white/5">
                <div>
                  <span className="text-[8.5px] text-[#6b7484] tracking-wider block">EXCHANGE RANK (BY MARKET CAP)</span>
                  <b className="text-sm text-white font-mono">#{myStatus.rank} <span className="text-[10px] text-[#6b7484]">of {myStatus.totalLive} live coins</span></b>
                </div>
                {myStatus.leader && (
                  <div className="text-right">
                    <span className="text-[8.5px] text-[#6b7484] tracking-wider block">RIVAL ABOVE</span>
                    <b className="text-[11px] text-gray-200 font-mono">${myStatus.leader.symbol} · {fmtCap(myStatus.leader.marketCap)}</b>
                  </div>
                )}
              </div>

              {/* community trust meter */}
              <div>
                <div className="flex justify-between text-[8.5px] font-black mb-1">
                  <span className="text-[#6b7484] tracking-wider">COMMUNITY TRUST</span>
                  <span className={coin.communityStrength < 30 ? 'text-[#ff5b6e]' : 'text-[#3ddc97]'}>{coin.communityStrength}/100{coin.communityStrength < 30 ? ' — FANS ARE TURNING' : ''}</span>
                </div>
                <div className="h-1.5 bg-[#0b0e14] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${coin.communityStrength < 30 ? 'bg-[#ff5b6e]' : 'bg-gradient-to-r from-[#3ddc97] to-[#f5b942]'}`} style={{ width: `${Math.min(100, coin.communityStrength)}%` }} />
                </div>
              </div>

              {/* liquidity injection */}
              <div className="bg-black/40 rounded-lg p-3 border border-white/5 space-y-2">
                <span className="text-[8.5px] text-[#6b7484] tracking-wider block">💰 PUMP WITH YOUR OWN CASH — liquidity injection</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={injectAmt}
                    onChange={(e) => setInjectAmt(e.target.value)}
                    min={10000}
                    step={10000}
                    className="flex-1 bg-[#0e1117] border border-[#1b212c] rounded-lg px-3 py-2 text-[11px] font-mono text-white outline-none focus:border-amber-400/50"
                    placeholder="USD (min $10,000)"
                  />
                  <button
                    onClick={handleInject}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#3ddc97] to-[#2aa876] text-[#06251a] text-[10px] font-black cursor-pointer whitespace-nowrap"
                  >
                    INJECT 💸
                  </button>
                </div>
                <p className="text-[8.5px] text-[#8b96a8] leading-relaxed">
                  Real cash, real impact: price pumps up to +60% scaled to injection vs market cap. Cash is spent — the market can still fade the pump.
                </p>
              </div>

              {/* community airdrop */}
              <div className="bg-black/40 rounded-lg p-3 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] text-[#3ddc97] tracking-wider">🪂 AIRDROP TO THE COMMUNITY — free tokens, real buzz</span>
                  <span className="text-[8px] font-mono text-[#8b96a8]">{fmtTokens(coin.communityAirdropped || 0)} dropped · {fmtTokens(coin.airdropHolders || 0)} holders</span>
                </div>
                <input
                  type="number"
                  value={airdropAmt}
                  onChange={(e) => setAirdropAmt(e.target.value)}
                  min={1000}
                  step={1000}
                  className="w-full bg-[#0e1117] border border-[#1b212c] rounded-lg px-3 py-2 text-[11px] font-mono text-white outline-none focus:border-[#3ddc97]/50"
                  placeholder="Tokens to airdrop (min 1,000)"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#3ddc97]">{fmtTokens(parseFloat(airdropAmt) || 0)} tokens</span>
                  <div className="flex gap-1.5">
                    {[
                      { label: '1K', v: 1000 }, { label: '100K', v: 100000 }, { label: '1M', v: 1000000 },
                      { label: '10M', v: 10000000 }, { label: 'MAX', v: Math.floor(coin.playerHoldings || 0) },
                    ].map((c) => (
                      <button key={c.label} type="button" onClick={() => setAirdropAmt(String(c.v))}
                        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-[9px] font-black cursor-pointer hover:border-[#3ddc97]/50 hover:text-[#3ddc97]">
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAirdrop}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-[#3ddc97] to-[#2aa876] text-[#06251a] text-[10px] font-black cursor-pointer"
                >
                  AIRDROP 🪂 (auto-posts to socials)
                </button>
                <p className="text-[8.5px] text-[#8b96a8] leading-relaxed">
                  Tokens leave your founder wallet permanently. New holders, trust and 3 weeks of buzz follow — announced on your X/Telegram where real followers see it. 2-week cooldown; back-to-back drops cause community fatigue.
                  {(coin.airdropStreak || 0) >= 2 && <span className="text-[#ff5b6e]"> Fatigue streak: {coin.airdropStreak} — diminishing returns active.</span>}
                  {(coin.buzzWeeksLeft || 0) > 0 && <span className="text-[#f5b942]"> Buzz live: {coin.buzzWeeksLeft} week{(coin.buzzWeeksLeft || 0) === 1 ? '' : 's'} left.</span>}
                </p>
              </div>

              {/* rug pull */}
              <div className={`rounded-lg p-3 border space-y-2 ${rugStep > 0 ? 'bg-rose-500/10 border-rose-400/50' : 'bg-black/40 border-white/5'}`}>
                <span className="text-[8.5px] text-[#ff5b6e] tracking-wider block">☠️ RUG PULL — dump your founder allocation and exit</span>
                {rugStep === 0 ? (
                  <>
                    <p className="text-[8.5px] text-[#8b96a8] leading-relaxed">
                      Sell everything at once through massive slippage (35%+ haircut). The coin dies −98%. You keep the cash — but fans (−30-45%), fame (−12-20%), reputation, industry respect and regulators (they claw back half) ALL come for you. One rug = permanent exchange blacklist.
                    </p>
                    <button onClick={() => setRugStep(1)} className="w-full py-2 rounded-lg bg-[#1b212c] text-[#ff5b6e] text-[10px] font-black cursor-pointer border border-rose-400/30">I KNOW THE CONSEQUENCES →</button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setRugStep(0)} className="flex-1 py-2 rounded-lg bg-[#1b212c] text-gray-300 text-[10px] font-black cursor-pointer">CANCEL</button>
                    <button onClick={handleRug} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#ff5b6e] to-[#c73548] text-white text-[10px] font-black cursor-pointer">CONFIRM RUG PULL ☠️</button>
                  </div>
                )}
              </div>
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

            {/* founder dump impact — live slippage estimate before you confirm */}
            {orderSide === 'sell' && coin.isMyCoin && sellImpact && sellImpact.slipPct > 0 && (
              <div className="mt-2 p-2.5 rounded-lg bg-[#ff5b6e]/10 border border-[#ff5b6e]/40">
                <div className="flex justify-between text-[9px] font-mono text-[#ff9aa6]">
                  <span>⚠ FOUNDER DUMP IMPACT</span>
                  <b>−{sellImpact.slipPct}% SLIPPAGE</b>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-[#ff9aa6] mt-1">
                  <span>REAL FILL ≈</span>
                  <b>${sellImpact.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({fmtTokens(sellTokens)} tokens)</b>
                </div>
                <p className="text-[8px] text-[#8b96a8] mt-1 leading-relaxed">
                  Dumping more than 2% of supply moves the market against you — the coin crashes after the sale and community trust takes damage.
                </p>
              </div>
            )}

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
              <button onClick={() => setShowDeploy(true)}
                className="px-3 py-2 rounded-xl bg-[#0b0e14] border border-[#f5b942]/40 text-[#f5b942] text-[9.5px] font-black flex items-center gap-1.5 cursor-pointer shrink-0">
                <Sparkles className="w-3.5 h-3.5" /> Deploy Token
              </button>
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

      {/* Deploy fan token modal */}
      {showDeploy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleDeployToken} className="p-5 rounded-2xl bg-[#0e1117] border border-[#f5b942]/40 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#f5b942] flex items-center gap-2"><Sparkles className="w-4 h-4" /> DEPLOY CELEBRITY FAN TOKEN</h3>
              <button type="button" onClick={() => setShowDeploy(false)} className="text-gray-400 font-black cursor-pointer">✕</button>
            </div>
            <p className="text-[10px] text-gray-400 font-bold">Smart contract fee: <span className="text-[#f5b942] font-black">$100,000</span>. Your fame ({(player.fameXp || 0).toLocaleString()} XP) sets the launch valuation.</p>
            <div>
              <label className="text-[9px] text-gray-400 block mb-1 font-black">TOKEN NAME</label>
              <input type="text" value={tokenName} onChange={(e) => setTokenName(e.target.value)} required
                className="w-full bg-[#0b0e14] text-white p-2.5 rounded-lg border border-[#1b212c] text-xs outline-none" placeholder="e.g. Vance Starlight Token" />
            </div>
            <div>
              <label className="text-[9px] text-gray-400 block mb-1 font-black">SYMBOL ($)</label>
              <input type="text" maxLength={8} value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())} required
                className="w-full bg-[#0b0e14] text-white p-2.5 rounded-lg border border-[#1b212c] text-xs outline-none uppercase" placeholder="e.g. VANCE" />
            </div>
            <div>
              <label className="text-[9px] text-gray-400 block mb-1 font-black">INITIAL PRICE ($)</label>
              <input type="number" step="0.1" min="0.1" max="100" value={tokenPrice} onChange={(e) => setTokenPrice(Number(e.target.value))}
                className="w-full bg-[#0b0e14] text-white p-2.5 rounded-lg border border-[#1b212c] text-xs outline-none" />
            </div>

            {/* TOKENOMICS — supply + allocation split */}
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#1b212c] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-[#f5b942] tracking-wider">TOKENOMICS</span>
                <span className={`text-[9px] font-black font-mono ${tokSum === 100 ? 'text-[#3ddc97]' : 'text-[#ff5b6e]'}`}>
                  {tokSum}% / 100%
                </span>
              </div>
              <div>
                <label className="text-[9px] text-gray-400 block mb-1 font-black">TOTAL SUPPLY — <span className="text-[#3ddc97] font-mono">{fmtTokens(tokenSupply)}</span></label>
                <input type="number" step={1000000} min={1000000} max={100000000000} value={tokenSupply} onChange={(e) => setTokenSupply(Math.max(1000000, Math.min(100000000000, Number(e.target.value) || 0)))}
                  className="w-full bg-[#0e1117] text-white p-2 rounded-lg border border-[#1b212c] text-xs font-mono outline-none" />
                <div className="flex gap-1.5 mt-1.5">
                  {[
                    { label: '1M', v: 1000000 }, { label: '100M', v: 100000000 }, { label: '1B', v: 1000000000 },
                    { label: '10B', v: 10000000000 }, { label: '100B', v: 100000000000 },
                  ].map((c) => (
                    <button key={c.label} type="button" onClick={() => setTokenSupply(c.v)}
                      className={`flex-1 py-1 rounded text-[9px] font-black cursor-pointer border ${tokenSupply === c.v ? 'bg-[#3ddc97]/20 border-[#3ddc97]/60 text-[#3ddc97]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[8.5px] text-gray-400 block mb-1 font-black">FOUNDER %</label>
                  <input type="number" min={10} max={95} value={founderPct} onChange={(e) => setFounderPct(Number(e.target.value) || 0)}
                    className="w-full bg-[#0e1117] text-white p-2 rounded-lg border border-[#1b212c] text-xs font-mono outline-none" />
                  <span className="text-[8px] text-[#f5b942] font-mono block mt-1">{fmtTokens(Math.floor(tokenSupply * founderPct / 100))}</span>
                </div>
                <div>
                  <label className="text-[8.5px] text-[#3ddc97] block mb-1 font-black">AIRDROP %</label>
                  <input type="number" min={0} max={80} value={airdropPct} onChange={(e) => setAirdropPct(Number(e.target.value) || 0)}
                    className="w-full bg-[#0e1117] text-white p-2 rounded-lg border border-[#1b212c] text-xs font-mono outline-none" />
                  <span className="text-[8px] text-[#3ddc97] font-mono block mt-1">{fmtTokens(Math.floor(tokenSupply * airdropPct / 100))}</span>
                </div>
                <div>
                  <label className="text-[8.5px] text-[#38bdf8] block mb-1 font-black">LIQUIDITY %</label>
                  <input type="number" min={0} max={80} value={liquidityPct} onChange={(e) => setLiquidityPct(Number(e.target.value) || 0)}
                    className="w-full bg-[#0e1117] text-white p-2 rounded-lg border border-[#1b212c] text-xs font-mono outline-none" />
                  <span className="text-[8px] text-[#38bdf8] font-mono block mt-1">{fmtTokens(Math.floor(tokenSupply * liquidityPct / 100))}</span>
                </div>
              </div>
              <p className="text-[8.5px] text-gray-500 leading-relaxed">
                Allocation must total exactly 100%. Airdropped tokens go free to the community at launch — more airdrop = more holders, trust and launch buzz, but less founder upside.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowDeploy(false)} className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-[10.5px] font-black cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-lg bg-[#f5b942] text-[#1a1206] text-[10.5px] font-black cursor-pointer">Deploy ($100K)</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
