/**
 * HOLLYWOOD RISING - STAR STOCKS & IPO EXCHANGE V2
 * Connected to Invisible Market Engine.
 * Living Stock Market, Pre-IPO Subscriptions, M&A, Corporate Board Seats, Custom IPO Launch.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  BarChart3,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Building2,
  TrendingUp,
  TrendingDown,
  Newspaper,
  Film,
  Tv,
  CheckCircle2,
  PieChart,
  Star,
  PlusCircle,
  Briefcase,
  Flame,
  Search,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
  Lock,
  Layers,
  Globe,
  RefreshCw,
  Crown,
  Info,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';
import {
  MarketEngineService,
  StockCompany,
  IpoCompany,
  EconomyMarketState,
  MarketTransaction,
} from '../../services/marketEngineService';

interface StarStocksViewProps {
  onBack: () => void;
}

export const StarStocksView: React.FC<StarStocksViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [marketState, setMarketState] = useState<EconomyMarketState>(() => MarketEngineService.getMarketState());
  const [activeTab, setActiveTab] = useState<'MARKET' | 'IPO' | 'PORTFOLIO' | 'BOARD' | 'MACRO' | 'TX'>('MARKET');
  const [selectedCompany, setSelectedCompany] = useState<StockCompany | null>(null);
  const [selectedIpo, setSelectedIpo] = useState<IpoCompany | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);
  const [ipoSubscribeQuantity, setIpoSubscribeQuantity] = useState<number>(100);

  const [showLaunchIpoModal, setShowLaunchIpoModal] = useState(false);
  const [customIpoName, setCustomIpoName] = useState('');
  const [customIpoTicker, setCustomIpoTicker] = useState('');
  const [customIpoIndustry, setCustomIpoIndustry] = useState('Entertainment Conglomerate');
  const [customIpoPrice, setCustomIpoPrice] = useState(25);
  const [customIpoValuation, setCustomIpoValuation] = useState(50000000);

  const [feedback, setFeedback] = useState<string | null>(null);

  // Refresh market state
  const refreshMarket = () => {
    setMarketState(MarketEngineService.getMarketState());
  };

  useEffect(() => {
    refreshMarket();
  }, []);

  const handleBuy = (ticker: string, qty: number) => {
    const res = MarketEngineService.buyStock(ticker, qty, player.money);
    if (res.success) {
      player.money -= res.totalCost;
      setFeedback(res.message);
      refreshMarket();
    } else {
      setFeedback(`❌ ${res.message}`);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSell = (ticker: string, qty: number) => {
    const res = MarketEngineService.sellStock(ticker, qty);
    if (res.success) {
      player.money += res.totalRevenue;
      setFeedback(res.message);
      refreshMarket();
    } else {
      setFeedback(`❌ ${res.message}`);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSubscribeIpo = (ipoId: string, shares: number) => {
    const res = MarketEngineService.subscribeIpo(ipoId, shares, player.money);
    if (res.success) {
      player.money -= res.totalCost;
      setFeedback(res.message);
      refreshMarket();
    } else {
      setFeedback(`❌ ${res.message}`);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLaunchIpoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIpoName || !customIpoTicker) {
      setFeedback('❌ Please enter company name and ticker symbol.');
      return;
    }

    const res = MarketEngineService.launchPlayerIpo(
      customIpoName,
      customIpoTicker,
      customIpoIndustry,
      customIpoPrice,
      customIpoValuation,
      player.money
    );

    if (res.success) {
      player.money -= 500000;
      setFeedback(res.message);
      setShowLaunchIpoModal(false);
      setCustomIpoName('');
      setCustomIpoTicker('');
      refreshMarket();
    } else {
      setFeedback(`❌ ${res.message}`);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter stocks
  const filteredStocks = marketState.stocks.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'ALL' || s.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // Unique industries
  const industries = Array.from(new Set(marketState.stocks.map((s) => s.industry)));

  // Portfolio calculations
  const portfolioHoldings = marketState.stocks.filter((s) => s.playerSharesOwned > 0);
  const totalPortfolioValuation = portfolioHoldings.reduce((sum, s) => sum + s.playerSharesOwned * s.sharePrice, 0);
  const totalCostBasis = portfolioHoldings.reduce((sum, s) => sum + s.playerSharesOwned * s.playerAvgBuyPrice, 0);
  const unrealizedPnL = totalPortfolioValuation - totalCostBasis;
  const boardSeatCompanies = marketState.stocks.filter((s) => s.playerBoardMember);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation Top Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            if (selectedCompany) setSelectedCompany(null);
            else if (selectedIpo) setSelectedIpo(null);
            else onBack();
          }}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>{selectedCompany || selectedIpo ? 'Back to Market' : 'Back to World'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Hollywood Wall Street Exchange
          </span>
        </div>
      </div>

      {/* Main Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-3 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  HOLLYWOOD WALL STREET
                </span>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {marketState.cycle.toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">EQUITIES & IPO BROKERAGE</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Portfolio Value</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                ${totalPortfolioValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={() => setShowLaunchIpoModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Launch IPO</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-white/10">
          {[
            { id: 'MARKET', label: 'Stock Market', icon: BarChart3, count: marketState.stocks.length },
            { id: 'IPO', label: 'IPO Market', icon: RocketIcon, count: marketState.ipos.filter((i) => i.status === 'Upcoming').length },
            { id: 'PORTFOLIO', label: 'My Portfolio', icon: PieChart, count: portfolioHoldings.length },
            { id: 'BOARD', label: 'Board Seats & M&A', icon: Crown, count: boardSeatCompanies.length },
            { id: 'MACRO', label: 'Macro Economy & News', icon: Newspaper, count: marketState.news.length },
            { id: 'TX', label: 'Orders & History', icon: Activity, count: marketState.transactions.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedCompany(null);
                  setSelectedIpo(null);
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

      {/* TAB 1: STOCK MARKET */}
      {activeTab === 'MARKET' && !selectedCompany && (
        <div className="space-y-4">
          {/* Search & Industry Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/60 border border-white/10">
            <div className="flex items-center gap-2 bg-black/80 border border-white/10 rounded-xl px-3 py-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stock ticker or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-xs outline-none w-full font-bold"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-[10px] font-black text-gray-400 uppercase">Sector:</span>
              <button
                onClick={() => setSelectedIndustry('ALL')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  selectedIndustry === 'ALL' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                All Sectors
              </button>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer whitespace-nowrap ${
                    selectedIndustry === ind ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Table Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-3xl bg-black/60 border border-white/10 hover:border-amber-400/50 transition-all space-y-3 relative group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
                        {s.logo}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white">{s.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {s.ticker}
                          </span>
                          <span className="text-[9px] text-gray-400 font-extrabold truncate max-w-[120px]">
                            {s.industry}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-white font-mono block">
                        ${s.sharePrice.toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-extrabold flex items-center justify-end gap-0.5 ${
                          s.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {s.changePct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {s.changePct >= 0 ? '+' : ''}
                        {s.changePct.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Fundamentals Summary */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5 text-[10px]">
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-gray-400 block font-extrabold">Market Cap</span>
                      <span className="text-white font-black font-mono">
                        ${(s.marketCap / 1000000000).toFixed(1)}B
                      </span>
                    </div>

                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-gray-400 block font-extrabold">Rating</span>
                      <span className="text-amber-400 font-black">{s.rating}</span>
                    </div>

                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-gray-400 block font-extrabold">Holdings</span>
                      <span className="text-emerald-400 font-black font-mono">{s.playerSharesOwned}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => setSelectedCompany(s)}
                    className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => handleBuy(s.ticker, 10)}
                    className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all cursor-pointer"
                  >
                    Buy 10
                  </button>

                  {s.playerSharesOwned > 0 && (
                    <button
                      onClick={() => handleSell(s.ticker, 10)}
                      className="flex-1 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-black transition-all cursor-pointer"
                    >
                      Sell 10
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED COMPANY MODAL VIEW */}
      {selectedCompany && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl space-y-6 shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/60 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl">
                {selectedCompany.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{selectedCompany.name}</h2>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
                    {selectedCompany.ticker}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-extrabold">{selectedCompany.industry} • CEO: {selectedCompany.ceo}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono block">${selectedCompany.sharePrice.toFixed(2)}</span>
              <span className={`text-xs font-black ${selectedCompany.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedCompany.changePct >= 0 ? '+' : ''}{selectedCompany.changePct.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Quick Trade Controls */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">Trade Shares</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-gray-300">Quantity:</span>
              {[1, 5, 10, 50, 100, 500].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setTradeQuantity(qty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    tradeQuantity === qty ? 'bg-amber-500 text-black' : 'bg-black/60 text-gray-300 hover:bg-black'
                  }`}
                >
                  {qty}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => handleBuy(selectedCompany.ticker, tradeQuantity)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-lg transition-all cursor-pointer"
                >
                  Buy {tradeQuantity} Shares (${(selectedCompany.sharePrice * tradeQuantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                </button>

                {selectedCompany.playerSharesOwned > 0 && (
                  <button
                    onClick={() => handleSell(selectedCompany.ticker, tradeQuantity)}
                    className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
                  >
                    Sell {tradeQuantity} Shares
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Fundamentals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Market Capitalization</span>
              <span className="text-base font-black text-amber-400 font-mono">${(selectedCompany.marketCap / 1000000000).toFixed(2)} Billion</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Annual Revenue</span>
              <span className="text-base font-black text-white font-mono">${(selectedCompany.revenue / 1000000000).toFixed(2)} Billion</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Net Profit</span>
              <span className="text-base font-black text-emerald-400 font-mono">${(selectedCompany.profit / 1000000).toFixed(0)} Million</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase block">Total Debt</span>
              <span className="text-base font-black text-rose-400 font-mono">${(selectedCompany.debt / 1000000000).toFixed(2)} Billion</span>
            </div>
          </div>

          {/* Company Bio & Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <h4 className="text-xs font-black text-amber-400 uppercase">Company Overview</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-bold">{selectedCompany.history}</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <h4 className="text-xs font-black text-amber-400 uppercase">Major Franchise & Upcoming Slate</h4>
              <div className="flex flex-wrap gap-1.5">
                {[...selectedCompany.movies, ...selectedCompany.series, ...selectedCompany.upcomingProjects].map((proj, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] font-extrabold text-amber-200">
                    🎬 {proj}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IPO MARKET */}
      {activeTab === 'IPO' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <RocketIcon className="w-5 h-5 text-amber-400" />
                PRE-IPO SUBSCRIPTION WINDOW
              </h2>
              <p className="text-xs text-gray-400 font-bold">
                Reserve pre-market shares in emerging entertainment, AI, and media companies before Wall Street trading opens.
              </p>
            </div>

            <button
              onClick={() => setShowLaunchIpoModal(true)}
              className="px-4 py-2 rounded-2xl bg-amber-500 text-black font-black text-xs flex items-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              File Custom IPO ($500K)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketState.ipos
              .filter((i) => i.status === 'Upcoming')
              .map((ipo) => (
                <div key={ipo.id} className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                        {ipo.industry}
                      </span>
                      <h3 className="text-lg font-black text-white mt-1">{ipo.companyName}</h3>
                      <span className="text-xs font-mono text-gray-400 font-bold">${ipo.ticker}</span>
                    </div>

                    <div className="text-right bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                      <span className="text-[9px] text-amber-400 font-extrabold block">IPO Price</span>
                      <span className="text-lg font-black text-amber-300 font-mono">${ipo.ipoPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 font-bold leading-relaxed">{ipo.description}</p>

                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-gray-400 block">Valuation</span>
                      <span className="text-white font-black font-mono">${(ipo.initialMarketCap / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-gray-400 block">Investor Demand</span>
                      <span className="text-emerald-400 font-black">{ipo.investorInterest}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <span className="text-gray-400 block">Launch In</span>
                      <span className="text-amber-400 font-black">{ipo.weeksUntilLaunch} Week(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      value={ipoSubscribeQuantity}
                      onChange={(e) => setIpoSubscribeQuantity(Math.max(1, Number(e.target.value)))}
                      className="bg-black/80 text-white font-mono font-black text-xs px-3 py-2 rounded-xl border border-white/20 w-28 outline-none"
                    />

                    <button
                      onClick={() => handleSubscribeIpo(ipo.id, ipoSubscribeQuantity)}
                      className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all cursor-pointer shadow-lg"
                    >
                      Pre-Subscribe {ipoSubscribeQuantity} Shares (${(ipo.ipoPrice * ipoSubscribeQuantity).toLocaleString()})
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: MY PORTFOLIO */}
      {activeTab === 'PORTFOLIO' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400 font-extrabold uppercase">Total Equity Portfolio Value</span>
              <span className="text-2xl font-black text-emerald-400 font-mono block">
                ${totalPortfolioValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400 font-extrabold uppercase">Cost Basis</span>
              <span className="text-2xl font-black text-white font-mono block">
                ${totalCostBasis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-xs text-gray-400 font-extrabold uppercase">Unrealized P/L</span>
              <span className={`text-2xl font-black font-mono block ${unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4">
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Active Stock Holdings</h3>

            {portfolioHoldings.length === 0 ? (
              <p className="text-xs text-gray-400 font-bold py-8 text-center">You currently hold no public stock equities.</p>
            ) : (
              <div className="space-y-3">
                {portfolioHoldings.map((st) => {
                  const currentVal = st.playerSharesOwned * st.sharePrice;
                  const cost = st.playerSharesOwned * st.playerAvgBuyPrice;
                  const pnl = currentVal - cost;

                  return (
                    <div key={st.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{st.logo}</span>
                        <div>
                          <h4 className="text-sm font-black text-white">{st.name} ({st.ticker})</h4>
                          <span className="text-xs text-gray-400 font-bold">{st.playerSharesOwned} Shares @ Avg ${st.playerAvgBuyPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-white font-mono block">${currentVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className={`text-xs font-black ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSell(st.ticker, st.playerSharesOwned)}
                        className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 text-xs font-black cursor-pointer"
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

      {/* TAB 4: BOARD SEATS & M&A */}
      {activeTab === 'BOARD' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-2">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              CORPORATE BOARD SEATS & MAJOR SHAREHOLDER RIGHTS
            </h3>
            <p className="text-xs text-gray-400 font-bold">
              Acquiring more than 5% of outstanding shares grants a Board Seat on Wall Street public corporations, unlocking executive voting rights!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketState.stocks.map((st) => {
              const ownedPct = ((st.playerSharesOwned / st.sharesOutstanding) * 100).toFixed(2);
              const isBoard = st.playerBoardMember;

              return (
                <div key={st.id} className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{st.logo}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{st.name} ({st.ticker})</h4>
                        <span className="text-xs text-amber-400 font-bold">{ownedPct}% Ownership Stake</span>
                      </div>
                    </div>

                    {isBoard ? (
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" /> Board Member
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-white/5 text-gray-400 text-xs font-bold">
                        Need &gt;5.0% for Board Seat
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: MACRO ECONOMY & NEWS */}
      {activeTab === 'MACRO' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Market Cycle</span>
              <span className="text-base font-black text-amber-400">{marketState.cycle}</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Investor Confidence</span>
              <span className="text-base font-black text-emerald-400">{marketState.investorConfidenceIndex}/100</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Interest Rate</span>
              <span className="text-base font-black text-white">{marketState.interestRate}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">GDP Growth Rate</span>
              <span className="text-base font-black text-sky-400">+{marketState.gdpGrowthRate}%</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4">
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4" /> Live Market Ticker & Headlines
            </h3>

            <div className="space-y-2">
              {marketState.news.map((n) => (
                <div key={n.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
                    <span>WEEK {n.week}, {n.year}</span>
                    <span className="uppercase">{n.category}</span>
                  </div>
                  <h4 className="text-xs font-black text-white">{n.title}</h4>
                  <p className="text-xs text-gray-300 font-bold">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TRANSACTIONS */}
      {activeTab === 'TX' && (
        <div className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4">
          <h3 className="text-sm font-black text-amber-400 uppercase">Brokerage Order History</h3>

          {marketState.transactions.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center font-bold">No transactions logged yet.</p>
          ) : (
            <div className="space-y-2">
              {marketState.transactions.map((tx) => (
                <div key={tx.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-bold">
                  <div>
                    <span className={`font-black ${tx.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      [{tx.type}] {tx.name} ({tx.symbol})
                    </span>
                    <span className="text-gray-400 block text-[10px]">Units: {tx.units.toFixed(2)} @ ${tx.pricePerUnit.toFixed(2)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-white font-black font-mono block">${tx.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-gray-400 text-[10px]">{tx.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: LAUNCH CUSTOM IPO */}
      {showLaunchIpoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-500/40 w-full max-w-lg space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                <Crown className="w-5 h-5" /> FILE WALL STREET IPO
              </h3>
              <button onClick={() => setShowLaunchIpoModal(false)} className="text-gray-400 hover:text-white font-black cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 font-bold">
              List your holding company or production studio on Wall Street! SEC Filing Fee: <span className="text-amber-400 font-black">$500,000</span>.
            </p>

            <form onSubmit={handleLaunchIpoSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-gray-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vance Entertainment Holdings"
                  value={customIpoName}
                  onChange={(e) => setCustomIpoName(e.target.value)}
                  className="w-full bg-black/80 text-white p-3 rounded-xl border border-white/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Ticker Symbol (Max 5 letters)</label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="e.g. VANCE"
                  value={customIpoTicker}
                  onChange={(e) => setCustomIpoTicker(e.target.value)}
                  className="w-full bg-black/80 text-white p-3 rounded-xl border border-white/20 uppercase outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">IPO Share Price ($)</label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={customIpoPrice}
                    onChange={(e) => setCustomIpoPrice(Number(e.target.value))}
                    className="w-full bg-black/80 text-white p-3 rounded-xl border border-white/20 outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Initial Valuation ($)</label>
                  <input
                    type="number"
                    step={10000000}
                    min={10000000}
                    value={customIpoValuation}
                    onChange={(e) => setCustomIpoValuation(Number(e.target.value))}
                    className="w-full bg-black/80 text-white p-3 rounded-xl border border-white/20 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLaunchIpoModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black shadow-lg cursor-pointer"
                >
                  File SEC IPO ($500K)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Rocket Icon component
const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 4.5l-15 15M19.5 4.5L15 19.5l-4.5-4.5M19.5 4.5L4.5 9l4.5 4.5" />
  </svg>
);
