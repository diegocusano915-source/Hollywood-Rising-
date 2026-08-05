/**
 * HOLLYWOOD RISING - CRYPTOCURRENCY & WEB3 EXCHANGE V2
 * Connected to Invisible Market Engine.
 * Living Crypto Market, New Launches, Celebrity Fan Tokens, Whale Copy Trading, Portfolio.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Coins,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  DollarSign,
  TrendingDown,
  UserCheck,
  Zap,
  Newspaper,
  PieChart,
  CheckCircle2,
  Image as ImageIcon,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Wallet,
  RefreshCw,
  X,
  PlusCircle,
  HelpCircle,
  Crown,
  Search,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';
import {
  MarketEngineService,
  CryptoCoin,
  EconomyMarketState,
  NpcWhale,
} from '../../services/marketEngineService';

interface StockCoinViewProps {
  onBack: () => void;
}

export const StockCoinView: React.FC<StockCoinViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [marketState, setMarketState] = useState<EconomyMarketState>(() => MarketEngineService.getMarketState());
  const [activeTab, setActiveTab] = useState<'MARKET' | 'PORTFOLIO' | 'NEW_LAUNCHES' | 'CELEBRITY_TOKEN' | 'WHALES' | 'TX'>('MARKET');
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [buyDollarAmount, setBuyDollarAmount] = useState<number>(100);
  const [sellPercentage, setSellPercentage] = useState<number>(50);

  const [showDeployTokenModal, setShowDeployTokenModal] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenPrice, setTokenPrice] = useState(1.0);

  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshMarket = () => {
    setMarketState(MarketEngineService.getMarketState());
  };

  useEffect(() => {
    refreshMarket();
  }, []);

  const handleBuyCrypto = (symbol: string, amount: number) => {
    const res = MarketEngineService.buyCrypto(symbol, amount, player.money);
    if (res.success) {
      player.money -= amount;
      setFeedback(res.message);
      refreshMarket();
    } else {
      setFeedback(`❌ ${res.message}`);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSellCrypto = (symbol: string, coinAmount: number) => {
    const res = MarketEngineService.sellCrypto(symbol, coinAmount);
    if (res.success) {
      player.money += res.totalDollarRevenue;
      setFeedback(res.message);
      refreshMarket();
    } else {
      setFeedback(`❌ ${res.message}`);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeployTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName || !tokenSymbol) {
      setFeedback('❌ Please enter token name and symbol.');
      return;
    }

    const res = MarketEngineService.launchPlayerCrypto(
      tokenName,
      tokenSymbol,
      tokenPrice,
      player.fameXp || 0,
      player.money
    );

    if (res.success) {
      player.money -= 100000;
      setFeedback(res.message);
      setShowDeployTokenModal(false);
      setTokenName('');
      setTokenSymbol('');
      refreshMarket();
    } else {
      setFeedback(`❌ ${res.message}`);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter Coins
  const filteredCoins = marketState.cryptoCoins.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || c.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const sectors = Array.from(new Set(marketState.cryptoCoins.map((c) => c.sector)));
  const holdings = marketState.cryptoCoins.filter((c) => c.playerHoldings > 0);
  const totalCryptoValuation = holdings.reduce((sum, c) => sum + c.playerHoldings * c.price, 0);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            if (selectedCoin) setSelectedCoin(null);
            else onBack();
          }}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>{selectedCoin ? 'Back to Exchange' : 'Back to World'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Hollywood Web3 Crypto Exchange
          </span>
        </div>
      </div>

      {/* Main Exchange Header */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-3 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <Coins className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                WEB3 DECENTRALIZED EXCHANGE
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">HOLLYWOOD CRYPTO MARKET</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Crypto Portfolio</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                ${totalCryptoValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={() => setShowDeployTokenModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Deploy Fan Token</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-white/10">
          {[
            { id: 'MARKET', label: 'All Coins', icon: Coins, count: marketState.cryptoCoins.length },
            { id: 'PORTFOLIO', label: 'My Wallet & Holdings', icon: Wallet, count: holdings.length },
            { id: 'NEW_LAUNCHES', label: 'New Token Launches', icon: Zap, count: marketState.cryptoCoins.filter((c) => c.status === 'Active').length },
            { id: 'CELEBRITY_TOKEN', label: 'Celebrity Fan Token', icon: Crown, count: marketState.playerCustomCryptosCount },
            { id: 'WHALES', label: 'Whales & Copy Trade', icon: UserCheck, count: marketState.whales.length },
            { id: 'TX', label: 'Swap History', icon: Activity, count: marketState.transactions.filter((t) => t.assetType === 'CRYPTO').length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedCoin(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-lg scale-105'
                    : 'bg-black/40 hover:bg-black/70 text-gray-300 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                      isActive ? 'bg-black/30 text-black' : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-black shadow-lg animate-fade-in">
          {feedback}
        </div>
      )}

      {/* TAB 1: ALL COINS */}
      {activeTab === 'MARKET' && !selectedCoin && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="flex items-center gap-2 bg-black/80 border border-white/10 rounded-xl px-3 py-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search crypto token or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-xs outline-none w-full font-bold"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-[10px] font-black text-gray-400 uppercase">Sector:</span>
              <button
                onClick={() => setSelectedSector('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                  selectedSector === 'ALL' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-300'
                }`}
              >
                All
              </button>
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer whitespace-nowrap ${
                    selectedSector === sec ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-300'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoins.map((coin) => (
              <div
                key={coin.id}
                className="p-4 rounded-3xl bg-black/60 border border-white/10 hover:border-amber-400/50 transition-all space-y-3 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        ${coin.symbol}
                      </span>
                      <h3 className="text-sm font-black text-white mt-1">{coin.name}</h3>
                      <span className="text-[9px] text-gray-400 font-bold block">{coin.sector}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-white font-mono block">${coin.price.toFixed(coin.price < 1 ? 4 : 2)}</span>
                      <span className={`text-xs font-black ${coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-300 font-bold line-clamp-2 mt-2">{coin.techDescription}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] bg-white/5 p-2 rounded-xl">
                    <div>
                      <span className="text-gray-400 block font-bold">Market Cap</span>
                      <span className="text-white font-black font-mono">${(coin.marketCap / 1000000).toFixed(1)}M</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Risk</span>
                      <span className="text-amber-400 font-black">{coin.risk}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => setSelectedCoin(coin)}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black cursor-pointer"
                  >
                    Inspect
                  </button>

                  <button
                    onClick={() => handleBuyCrypto(coin.symbol, 100)}
                    className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black cursor-pointer"
                  >
                    Swap $100
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED COIN VIEW */}
      {selectedCoin && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-black/60 border border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{selectedCoin.name}</h2>
                <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
                  ${selectedCoin.symbol}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-bold">{selectedCoin.sector} • Risk: {selectedCoin.risk}</p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono block">${selectedCoin.price.toFixed(selectedCoin.price < 1 ? 4 : 2)}</span>
              <span className={`text-xs font-black ${selectedCoin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-xs font-black text-amber-400 uppercase">Swap Order Controls</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-gray-300">Amount ($):</span>
              {[25, 50, 100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBuyDollarAmount(amt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                    buyDollarAmount === amt ? 'bg-amber-500 text-black' : 'bg-black/60 text-gray-300'
                  }`}
                >
                  ${amt}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => handleBuyCrypto(selectedCoin.symbol, buyDollarAmount)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs cursor-pointer shadow-lg"
                >
                  Swap Buy (${buyDollarAmount.toLocaleString()})
                </button>

                {selectedCoin.playerHoldings > 0 && (
                  <button
                    onClick={() => handleSellCrypto(selectedCoin.symbol, selectedCoin.playerHoldings * (sellPercentage / 100))}
                    className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs cursor-pointer shadow-lg"
                  >
                    Sell {sellPercentage}% Holdings
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <h4 className="text-xs font-black text-amber-400 uppercase">Protocol Mechanics</h4>
            <p className="text-xs text-gray-300 leading-relaxed font-bold">{selectedCoin.techDescription}</p>
          </div>
        </div>
      )}

      {/* TAB 2: MY WALLET & HOLDINGS */}
      {activeTab === 'PORTFOLIO' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
            <span className="text-xs text-gray-400 font-extrabold uppercase">Total Crypto Wallet Valuation</span>
            <span className="text-2xl font-black text-emerald-400 font-mono block">
              ${totalCryptoValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4">
            <h3 className="text-sm font-black text-amber-400 uppercase">Token Balances</h3>

            {holdings.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center font-bold">Your Web3 wallet holds zero tokens.</p>
            ) : (
              <div className="space-y-3">
                {holdings.map((c) => {
                  const val = c.playerHoldings * c.price;
                  return (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-black text-white">{c.name} (${c.symbol})</h4>
                        <span className="text-xs text-gray-400 font-bold">{c.playerHoldings.toFixed(4)} Tokens @ ${c.price.toFixed(c.price < 1 ? 4 : 2)}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-emerald-400 font-mono block">${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>

                      <button
                        onClick={() => handleSellCrypto(c.symbol, c.playerHoldings)}
                        className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black cursor-pointer"
                      >
                        Sell All
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NEW TOKEN LAUNCHES */}
      {activeTab === 'NEW_LAUNCHES' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-2">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> NEW TOKEN LAUNCHES & INVISIBLE ENGINE DEX
            </h3>
            <p className="text-xs text-gray-400 font-bold">
              Freshly deployed AI, entertainment, and meme tokens created automatically by the Invisible Market Engine!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketState.cryptoCoins.slice(0, 6).map((c) => (
              <div key={c.id} className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      ${c.symbol}
                    </span>
                    <h4 className="text-base font-black text-white mt-1">{c.name}</h4>
                  </div>
                  <span className="text-base font-black text-emerald-400 font-mono">${c.price.toFixed(c.price < 1 ? 4 : 2)}</span>
                </div>

                <p className="text-xs text-gray-300 font-bold">{c.techDescription}</p>

                <button
                  onClick={() => handleBuyCrypto(c.symbol, 250)}
                  className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs cursor-pointer shadow-lg"
                >
                  Buy $250 Allocation
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: DEPLOY CUSTOM FAN TOKEN */}
      {showDeployTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-500/40 w-full max-w-lg space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> DEPLOY CELEBRITY FAN TOKEN
              </h3>
              <button onClick={() => setShowDeployTokenModal(false)} className="text-gray-400 hover:text-white font-black cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 font-bold">
              Deploy your official celebrity fan cryptocurrency on the Web3 Exchange! Smart Contract Fee: <span className="text-amber-400 font-black">$100,000</span>.
            </p>

            <form onSubmit={handleDeployTokenSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-gray-400 block mb-1">Token Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vance Starlight Token"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="w-full bg-black/80 text-white p-3 rounded-xl border border-white/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Token Symbol ($)</label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. VANCE"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  className="w-full bg-black/80 text-white p-3 rounded-xl border border-white/20 uppercase outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Initial Launch Price ($)</label>
                <input
                  type="number"
                  step={0.1}
                  min={0.1}
                  max={100}
                  value={tokenPrice}
                  onChange={(e) => setTokenPrice(Number(e.target.value))}
                  className="w-full bg-black/80 text-white p-3 rounded-xl border border-white/20 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDeployTokenModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black shadow-lg cursor-pointer"
                >
                  Deploy Smart Contract ($100K)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
