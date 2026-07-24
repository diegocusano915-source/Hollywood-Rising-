/**
 * HOLLYWOOD RISING - Star Stocks View (Brokerage Exchange)
 * Full Entertainment Stock Market, Studio Shares, IPOs, M&A, Portfolio & Detailed Company Pages.
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
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface StarStocksViewProps {
  onBack: () => void;
}

export interface StockCompany {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  ceo: string;
  logo: string;
  price: number;
  changePct: number;
  marketCap: string;
  risk: 'Low' | 'Moderate' | 'High' | 'Volatile';
  rating: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  dividendYield: string;
  ownershipBreakdown: { institutional: number; insider: number; public: number };
  history: string;
  movies: string[];
  series: string[];
  streamingDeals: string;
  upcomingProjects: string[];
  news: string[];
  chartData: number[];
}

const INITIAL_COMPANIES: StockCompany[] = [
  {
    id: 'disney',
    name: 'Walt Disney Co',
    ticker: 'DIS',
    sector: 'Entertainment Conglomerate',
    ceo: 'Bob Iger',
    logo: '🎬',
    price: 112.45,
    changePct: 2.85,
    marketCap: '$205.8 B',
    risk: 'Low',
    rating: 'A+',
    dividendYield: '1.2%',
    ownershipBreakdown: { institutional: 68, insider: 2, public: 30 },
    history: 'Founded in 1923, Disney is the premier global entertainment engine controlling Lucasfilm, Marvel, Pixar, and Disney+.',
    movies: ['Avengers: Secret Wars', 'Frozen 3', 'Avatar: Fire and Ash'],
    series: ['The Mandalorian S4', 'Daredevil: Born Again'],
    streamingDeals: 'Disney+ & Hulu Bundle Exclusive Distribution',
    upcomingProjects: ['Pirates of the Caribbean Reboot', 'Star Wars: New Jedi Order'],
    news: [
      'Disney+ reports 4.2M new quarterly subscribers boosting media division revenue.',
      'Box office projections for upcoming Marvel slate revised upward following comic-con teaser.',
    ],
    chartData: [102, 104, 103, 106, 108, 110, 112.45],
  },
  {
    id: 'netflix',
    name: 'Netflix Inc',
    ticker: 'NFLX',
    sector: 'Streaming Giant',
    ceo: 'Ted Sarandos & Greg Peters',
    logo: '🔴',
    price: 685.10,
    changePct: -1.20,
    marketCap: '$295.4 B',
    risk: 'Moderate',
    rating: 'A',
    dividendYield: '0.0%',
    ownershipBreakdown: { institutional: 82, insider: 3, public: 15 },
    history: 'Pioneer of digital video streaming, operating globally in 190+ countries with over 270M paid subscribers.',
    movies: ['Red Notice 2', 'Glass Onion 3', 'The Irishman 2'],
    series: ['Stranger Things S5', 'Wednesday S2', 'Squid Game S3'],
    streamingDeals: 'Global Direct-to-Consumer Digital Subscription Standard',
    upcomingProjects: ['Bioshock Feature Film', 'Gears of War Animated Series'],
    news: [
      'Netflix expands live sports broadcasts after licensing WWE Raw rights.',
      'Ad-tier subscriber growth jumps 34% year-over-year in international markets.',
    ],
    chartData: [670, 675, 690, 688, 692, 680, 685.10],
  },
  {
    id: 'warner',
    name: 'Warner Bros Discovery',
    ticker: 'WBD',
    sector: 'Film & TV Studio',
    ceo: 'David Zaslav',
    logo: '🛡️',
    price: 8.92,
    changePct: 4.15,
    marketCap: '$21.8 B',
    risk: 'High',
    rating: 'B',
    dividendYield: '0.0%',
    ownershipBreakdown: { institutional: 61, insider: 5, public: 34 },
    history: 'Centennial film studio home to DC Studios, HBO, Max, Turner Broadcasting, and Harry Potter.',
    movies: ['Superman (2025)', 'The Batman Part II', 'Dune: Messiah'],
    series: ['House of the Dragon S3', 'Harry Potter TV Series', 'The Penguin'],
    streamingDeals: 'Max Platform & Global Syndication Deals',
    upcomingProjects: ['Minecraft Movie', 'Mortal Kombat 2'],
    news: [
      'Warner Bros reports strong box office momentum for theatrical superhero reboot.',
      'Debt reduction strategy accelerates following international Max rollout.',
    ],
    chartData: [7.80, 8.10, 8.25, 8.40, 8.65, 8.70, 8.92],
  },
  {
    id: 'universal',
    name: 'Comcast Universal',
    ticker: 'CMCSA',
    sector: 'Broadcasting & Theme Parks',
    ceo: 'Brian L. Roberts',
    logo: '🌐',
    price: 41.30,
    changePct: 0.85,
    marketCap: '$162.1 B',
    risk: 'Low',
    rating: 'A',
    dividendYield: '2.9%',
    ownershipBreakdown: { institutional: 84, insider: 1, public: 15 },
    history: 'Parent of Universal Pictures, Peacock, Illumination Entertainment, DreamWorks, and Universal Theme Parks.',
    movies: ['Despicable Me 4', 'Wicked Part 1', 'Jurassic World Rebirth'],
    series: ['Oppenheimer Series', 'Peacock Originals'],
    streamingDeals: 'Peacock SVOD & Universal Theatrical Pay-1 Window',
    upcomingProjects: ['Fast X Part 2', 'Epic Universe Orlando Theme Park Opening'],
    news: [
      'Universal Pictures crosses $3B global box office milestone for third consecutive year.',
      'Epic Universe theme park pre-ticket sales surpass internal company forecasts.',
    ],
    chartData: [39.5, 40.1, 40.3, 40.8, 41.0, 41.1, 41.30],
  },
  {
    id: 'paramount',
    name: 'Paramount Global',
    ticker: 'PARA',
    sector: 'Legacy Studio & Broadcast',
    ceo: 'David Ellison (Skydance Merger)',
    logo: '🏔️',
    price: 11.80,
    changePct: 6.40,
    marketCap: '$8.2 B',
    risk: 'High',
    rating: 'B+',
    dividendYield: '1.5%',
    ownershipBreakdown: { institutional: 74, insider: 12, public: 14 },
    history: 'Iconic studio behind Top Gun, Mission: Impossible, CBS Network, Nickelodeon, and Paramount+.',
    movies: ['Gladiator II', 'Sonic the Hedgehog 3', 'Mission: Impossible 8'],
    series: ['Yellowstone Franchise', 'Tulsa King', 'Star Trek: Starfleet Academy'],
    streamingDeals: 'Paramount+ & Showtime Combined Streaming Hub',
    upcomingProjects: ['Transformers x G.I. Joe Crossover', 'Teenage Mutant Ninja Turtles Sequel'],
    news: [
      'Skydance Media merger deal approved by regulatory authorities.',
      'Yellowstone franchise spinoff series achieves record cable premiere viewership.',
    ],
    chartData: [10.2, 10.5, 10.8, 11.1, 11.3, 11.5, 11.80],
  },
  {
    id: 'sony',
    name: 'Sony Pictures (Sony Group)',
    ticker: 'SONY',
    sector: 'Entertainment & Gaming',
    ceo: 'Kenichiro Yoshida',
    logo: '🎮',
    price: 88.60,
    changePct: 1.45,
    marketCap: '$108.5 B',
    risk: 'Low',
    rating: 'A+',
    dividendYield: '0.8%',
    ownershipBreakdown: { institutional: 58, insider: 1, public: 41 },
    history: 'Japanese conglomerate operating Sony Pictures, Spider-Man Universe, PlayStation Studios, and Sony Music.',
    movies: ['Spider-Man: Beyond the Spider-Verse', 'Venom: The Last Dance', 'Uncharted 2'],
    series: ['The Last of Us S2', 'The Boys S5', 'Twisted Metal S2'],
    streamingDeals: 'Pay-1 Streaming Output Licensing Deal with Netflix & Disney',
    upcomingProjects: ['God of War Live-Action Series', 'Horizon Zero Dawn Film'],
    news: [
      'Sony Pictures announces multi-picture co-production agreement with leading indie creators.',
      'PlayStation Productions film adaptations generate over $1.5B in theatrical box office.',
    ],
    chartData: [84.0, 85.2, 86.1, 86.8, 87.5, 88.0, 88.60],
  },
  {
    id: 'a24',
    name: 'A24 Indie Films Inc',
    ticker: 'A24',
    sector: 'Independent Studio',
    ceo: 'Daniel Katz & David Fenkel',
    logo: '🎨',
    price: 34.20,
    changePct: 8.90,
    marketCap: '$3.5 B',
    risk: 'Volatile',
    rating: 'A',
    dividendYield: '0.0%',
    ownershipBreakdown: { institutional: 45, insider: 30, public: 25 },
    history: 'Academy Award-winning indie powerhouse behind Everything Everywhere All at Once, Civil War, and Euphoria.',
    movies: ['Civil War', 'Heretic', 'The Smashing Machine'],
    series: ['Euphoria S3', 'Hazbin Hotel'],
    streamingDeals: 'Max Output Licensing Agreement',
    upcomingProjects: ['Death of a Unicorn', 'Eddington by Ari Aster'],
    news: [
      'A24 expands theatrical distribution network to 45 international territories.',
      'Indie studio secures 12 Academy Award nominations across major categories.',
    ],
    chartData: [28.0, 29.5, 30.2, 31.8, 32.5, 33.1, 34.20],
  },
  {
    id: 'amc',
    name: 'AMC Entertainment',
    ticker: 'AMC',
    sector: 'Theatrical Exhibition',
    ceo: 'Adam Aron',
    logo: '🍿',
    price: 4.85,
    changePct: -3.20,
    marketCap: '$1.8 B',
    risk: 'Volatile',
    rating: 'C',
    dividendYield: '0.0%',
    ownershipBreakdown: { institutional: 28, insider: 2, public: 70 },
    history: 'Largest movie theater exhibition chain in the world with over 900 locations and 10,000 screens.',
    movies: ['Taylor Swift The Eras Tour Film', 'Beyoncé Renaissance Film'],
    series: ['IMAX Large Format Theatrical Run Specials'],
    streamingDeals: 'Direct Concert Film Distribution Deals',
    upcomingProjects: ['ScreenX Expansion', 'Concert Film Distribution Label'],
    news: [
      'AMC announces expansion of premium large-format Laser at AMC auditoriums.',
      'Q3 concession sales revenue hits record average spend per patron.',
    ],
    chartData: [5.4, 5.2, 5.1, 5.0, 4.9, 4.95, 4.85],
  },
];

export const StarStocksView: React.FC<StarStocksViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [companies, setCompanies] = useState<StockCompany[]>(INITIAL_COMPANIES);
  const [activeTab, setActiveTab] = useState<'MARKET' | 'PORTFOLIO' | 'ORDERS' | 'IPO' | 'M_A' | 'WATCHLIST' | 'NEWS'>('MARKET');
  const [selectedCompany, setSelectedCompany] = useState<StockCompany | null>(null);

  // User holdings & watchlist stored in localStorage
  const [userHoldings, setUserHoldings] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('STAR_STOCKS_HOLDINGS') || '{}');
    } catch {
      return {};
    }
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('STAR_STOCKS_WATCHLIST') || '["disney", "netflix", "a24"]');
    } catch {
      return ['disney', 'netflix', 'a24'];
    }
  });

  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('STAR_STOCKS_HOLDINGS', JSON.stringify(userHoldings));
  }, [userHoldings]);

  useEffect(() => {
    localStorage.setItem('STAR_STOCKS_WATCHLIST', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        setFeedback('Removed from Watchlist');
        setTimeout(() => setFeedback(null), 2000);
        return prev.filter((item) => item !== id);
      } else {
        setFeedback('Added to Watchlist');
        setTimeout(() => setFeedback(null), 2000);
        return [...prev, id];
      }
    });
  };

  const handleBuy = (company: StockCompany, count: number) => {
    const totalCost = company.price * count;
    if (player.money < totalCost) {
      setFeedback(`Insufficient Funds! Required: $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Update holding
    setUserHoldings((prev) => ({
      ...prev,
      [company.id]: (prev[company.id] || 0) + count,
    }));

    setFeedback(`PURCHASED ${count} Share(s) of ${company.name} (${company.ticker}) for $${totalCost.toFixed(2)}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSell = (company: StockCompany, count: number) => {
    const currentOwned = userHoldings[company.id] || 0;
    if (currentOwned < count) {
      setFeedback(`You only own ${currentOwned} share(s) of ${company.ticker}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const totalRevenue = company.price * count;
    setUserHoldings((prev) => {
      const nextCount = (prev[company.id] || 0) - count;
      const updated = { ...prev };
      if (nextCount <= 0) {
        delete updated[company.id];
      } else {
        updated[company.id] = nextCount;
      }
      return updated;
    });

    setFeedback(`SOLD ${count} Share(s) of ${company.name} (${company.ticker}) for $${totalRevenue.toFixed(2)}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Calculations
  const totalPortfolioValue = Object.entries(userHoldings).reduce((acc, [id, count]) => {
    const comp = companies.find((c) => c.id === id);
    const shares = typeof count === 'number' ? count : Number(count) || 0;
    return acc + (comp ? comp.price * shares : 0);
  }, 0);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => {
            if (selectedCompany) {
              setSelectedCompany(null);
            } else {
              onBack();
            }
          }}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>{selectedCompany ? 'Back to Market' : 'Back to World'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Hollywood Wall Street Exchange
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <BarChart3 className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                STAR STOCKS BROKERAGE
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">ENTERTAINMENT EQUITIES</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Portfolio Value</span>
            <span className="text-lg font-black text-emerald-400">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* DETAILED COMPANY PAGE OVERLAY */}
      {selectedCompany ? (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl space-y-6 shadow-2xl">
          {/* Top Company Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-black/60 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
                {selectedCompany.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white">{selectedCompany.name}</h2>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {selectedCompany.ticker}
                  </span>
                  <button
                    onClick={() => toggleWatchlist(selectedCompany.id)}
                    className="p-1.5 rounded-lg bg-black/60 border border-white/10 hover:border-amber-400 transition-all cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        watchlist.includes(selectedCompany.id) ? 'text-amber-400 fill-amber-400' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  CEO: <strong className="text-white">{selectedCompany.ceo}</strong> • Sector: <strong className="text-amber-300">{selectedCompany.sector}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-white">${selectedCompany.price.toFixed(2)}</div>
              <div
                className={`text-xs font-black flex items-center justify-end gap-1 ${
                  selectedCompany.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {selectedCompany.changePct >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {selectedCompany.changePct >= 0 ? '+' : ''}
                {selectedCompany.changePct}% Today
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/50 border border-white/10 text-xs">
            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Market Cap</span>
              <span className="font-black text-amber-300 text-sm">{selectedCompany.marketCap}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Financial Rating</span>
              <span className="font-black text-emerald-400 text-sm">{selectedCompany.rating}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Risk Assessment</span>
              <span className="font-black text-sky-300 text-sm">{selectedCompany.risk}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block text-[10px] uppercase">Dividend Yield</span>
              <span className="font-black text-purple-300 text-sm">{selectedCompany.dividendYield}</span>
            </div>
          </div>

          {/* Interactive Trade Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black to-black border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Trade {selectedCompany.ticker} Shares
              </h3>
              <span className="text-xs text-gray-300 font-bold">
                Owned: <strong className="text-amber-400">{userHoldings[selectedCompany.id] || 0} Shares</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 bg-black/80 px-3 py-2 rounded-xl border border-white/10 w-full sm:w-auto">
                <span className="text-xs text-gray-400 font-bold">Shares:</span>
                <input
                  type="number"
                  min="1"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 bg-transparent font-black text-amber-300 text-sm text-center outline-none"
                />
              </div>

              <div className="text-xs font-bold text-gray-300">
                Total: <strong className="text-emerald-400 text-sm">${(selectedCompany.price * tradeAmount).toFixed(2)}</strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
                <button
                  onClick={() => handleBuy(selectedCompany, tradeAmount)}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg"
                >
                  BUY {tradeAmount} SHARE(S)
                </button>

                {(userHoldings[selectedCompany.id] || 0) > 0 && (
                  <button
                    onClick={() => handleSell(selectedCompany, tradeAmount)}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-black text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer"
                  >
                    SELL {tradeAmount} SHARE(S)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Company Details Tabs / Accordion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-4 h-4" /> Theatrical & Production Slate
              </h4>
              <div className="space-y-1.5 text-xs text-gray-300">
                <p>
                  <strong>Active Movies:</strong> {selectedCompany.movies.join(', ')}
                </p>
                <p>
                  <strong>Streaming Series:</strong> {selectedCompany.series.join(', ')}
                </p>
                <p>
                  <strong>Upcoming Slate:</strong> {selectedCompany.upcomingProjects.join(', ')}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-4 h-4" /> Market Intelligence & News
              </h4>
              <div className="space-y-2 text-xs text-gray-300">
                {selectedCompany.news.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    • {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs text-gray-300">
            <h4 className="font-black text-amber-400 uppercase text-xs">Studio History & Overview</h4>
            <p className="leading-relaxed">{selectedCompany.history}</p>
          </div>
        </div>
      ) : (
        /* MAIN BROKERAGE TABS VIEW */
        <div className="space-y-4">
          {/* TOP BROKERAGE TABS */}
          <div className="p-2 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-1.5 overflow-x-auto">
            {(
              [
                { id: 'MARKET', label: 'Market', icon: Globe },
                { id: 'PORTFOLIO', label: 'Portfolio', icon: PieChart },
                { id: 'ORDERS', label: 'Orders', icon: Layers },
                { id: 'IPO', label: 'IPO', icon: Sparkles },
                { id: 'M_A', label: 'M&A Deals', icon: Building2 },
                { id: 'WATCHLIST', label: 'Watchlist', icon: Star },
                { id: 'NEWS', label: 'News', icon: Newspaper },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-lg scale-102'
                      : 'bg-black/40 text-gray-300 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: MARKET */}
          {activeTab === 'MARKET' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companies.map((comp) => (
                <div
                  key={comp.id}
                  className="p-4 rounded-3xl border border-white/10 bg-black/40 hover:bg-black/70 transition-all flex items-center justify-between gap-3 shadow-xl group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-2xl shrink-0">
                      {comp.logo}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-white">{comp.name}</h3>
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                          {comp.ticker}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        Cap: <strong className="text-amber-300">{comp.marketCap}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-black text-white block">${comp.price.toFixed(2)}</span>
                      <span
                        className={`text-[10px] font-black flex items-center justify-end gap-0.5 ${
                          comp.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {comp.changePct >= 0 ? '+' : ''}
                        {comp.changePct}%
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedCompany(comp)}
                      className="px-3 py-2 rounded-xl bg-amber-400 text-black font-black text-xs hover:scale-105 transition-all cursor-pointer shadow-md flex items-center gap-1"
                    >
                      <span>VIEW</span>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PORTFOLIO */}
          {activeTab === 'PORTFOLIO' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                  ACTIVE HOLDINGS SUMMARY
                </span>
                <div className="text-3xl font-black text-white">
                  ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-300">
                  Total positions in {Object.keys(userHoldings).length} entertainment stock(s).
                </p>
              </div>

              {Object.keys(userHoldings).length === 0 ? (
                <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
                  <PieChart className="w-8 h-8 text-amber-400 mx-auto" />
                  <h3 className="text-sm font-black text-white">No Shares Owned Yet</h3>
                  <p className="text-xs text-gray-400">Browse the Market tab to invest in Hollywood studio equities.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(userHoldings).map(([id, rawCount]) => {
                    const comp = companies.find((c) => c.id === id);
                    if (!comp) return null;
                    const count = typeof rawCount === 'number' ? rawCount : Number(rawCount) || 0;
                    return (
                      <div
                        key={id}
                        className="p-4 rounded-2xl border border-white/10 bg-black/50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{comp.logo}</span>
                          <div>
                            <h4 className="text-sm font-black text-white">{comp.name}</h4>
                            <span className="text-xs text-amber-300 font-bold">{count} Shares Owned</span>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div>
                            <span className="text-sm font-black text-emerald-400 block">
                              ${(comp.price * count).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-gray-400">@ ${comp.price.toFixed(2)}/sh</span>
                          </div>

                          <button
                            onClick={() => setSelectedCompany(comp)}
                            className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-black text-xs cursor-pointer"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'ORDERS' && (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
              <Layers className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-sm font-black text-white">All Orders Settled</h3>
              <p className="text-xs text-gray-400">Your equity market limit and market orders are processed instantly.</p>
            </div>
          )}

          {/* TAB 4: IPO */}
          {activeTab === 'IPO' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-bold">
                Upcoming Hollywood Initial Public Offerings (IPOs)
              </div>

              {[
                { name: 'Blumhouse Productions', ticker: 'BLUM', estPrice: '$18.50 - $22.00', date: 'Next Month' },
                { name: 'Skydance Media Holdings', ticker: 'SKYD', estPrice: '$35.00 - $40.00', date: 'In 2 Weeks' },
                { name: 'A24 Expanded Offering', ticker: 'A24X', estPrice: '$42.00 - $45.00', date: 'In 3 Weeks' },
              ].map((ipo, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">{ipo.name}</h4>
                    <span className="text-xs text-amber-400 font-bold">{ipo.ticker} • Target: {ipo.estPrice}</span>
                  </div>

                  <span className="text-xs font-black text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    {ipo.date}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: M&A */}
          {activeTab === 'M_A' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 font-bold">
                Hollywood Studio Mergers & Acquisitions Tracker
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                <h4 className="font-black text-white text-sm">Paramount Global + Skydance Media Merger</h4>
                <p className="text-gray-300 leading-relaxed">
                  Skydance Media completes $8.0 billion transaction acquiring Paramount Global, establishing a revitalized independent tech-focused Hollywood studio.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: WATCHLIST */}
          {activeTab === 'WATCHLIST' && (
            <div className="space-y-2">
              {companies
                .filter((c) => watchlist.includes(c.id))
                .map((comp) => (
                  <div
                    key={comp.id}
                    className="p-4 rounded-2xl border border-white/10 bg-black/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{comp.logo}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{comp.name}</h4>
                        <span className="text-xs text-amber-300 font-bold">{comp.ticker} • ${comp.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCompany(comp)}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 text-black font-black text-xs cursor-pointer"
                    >
                      VIEW
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 7: NEWS */}
          {activeTab === 'NEWS' && (
            <div className="space-y-2 text-xs">
              {companies.flatMap((c) =>
                c.news.map((n, idx) => (
                  <div key={`${c.id}_${idx}`} className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                    <span className="text-[10px] font-black text-amber-400 uppercase">{c.name} ({c.ticker})</span>
                    <p className="text-gray-200">{n}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
