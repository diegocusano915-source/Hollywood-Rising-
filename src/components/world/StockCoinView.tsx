/**
 * HOLLYWOOD RISING - Stock Coin / Crypto Exchange View (Phase 3 Redesign)
 * Full Entertainment Crypto Exchange:
 * 1. Market (28+ coins, sparkline charts, detail modal, risk ratings)
 * 2. Investment Amount Based Buying & Percentage Selling (25%, 50%, 75%, 100%, custom $)
 * 3. Portfolio Tracking (Total Value, P/L $, P/L %, Allocation, Quick Sell)
 * 4. News System (Breaking events, market volatility)
 * 5. Whales Copy Trading (Satoshi Spielberg, Crypto Tarantino, Nolan Node, MemeCoin Margot, Whale DiCaprio)
 * 6. NFT Market (Oscar Speech, Movie Props, Walk of Fame Tile, Uncut Script - Weekly Royalties)
 * 7. My Coin (Celebrity Token - unlocked at Fame >= 100 or 1 Released Movie)
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
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface StockCoinViewProps {
  onBack: () => void;
}

export interface ExtendedCryptoCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  risk: 'Low' | 'Medium' | 'High' | 'Extreme Degen';
  holdings: number; // coin count
  avgBuyPrice: number;
  sparkline: number[];
  overview: string;
  news: string;
  isMyCoin?: boolean;
}

export interface CryptoTransaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  coinName: string;
  dollarAmount: number;
  coinAmount: number;
  priceAtTx: number;
  timestamp: string;
}

export interface WhaleProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  winRatePct: number;
  netWorth: number;
  topHoldings: string[];
  copyTradeActive: boolean;
  copyTradeProfit: number;
}

export interface HollywoodNFT {
  id: string;
  title: string;
  category: string;
  price: number;
  weeklyRoyalty: number;
  imageUrl: string;
  isOwned: boolean;
  totalRoyaltiesEarned: number;
}

const INITIAL_EXTENDED_COINS: ExtendedCryptoCoin[] = [
  {
    id: 'c_hollywood',
    name: 'HollywoodCoin',
    symbol: '$HOLLYWOOD',
    price: 14.50,
    change24h: 12.8,
    change7d: 24.5,
    marketCap: 850000000,
    volume24h: 42000000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [11.2, 11.8, 12.1, 13.0, 12.8, 13.9, 14.50],
    overview: 'The primary reserve cryptocurrency powering studio financing, box office ticketing and VIP Hollywood events.',
    news: 'Major studio announces film financing integration with $HOLLYWOOD.',
  },
  {
    id: 'c_gossip',
    name: 'Paparazzi Gossip',
    symbol: '$GOSSIP',
    price: 0.45,
    change24h: -15.2,
    change7d: -32.1,
    marketCap: 35000000,
    volume24h: 18000000,
    risk: 'Extreme Degen',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [0.95, 0.82, 0.70, 0.55, 0.62, 0.51, 0.45],
    overview: 'Hyper-volatile meme token driven by tabloid leaks, celebrity court cases & post-premiere scandal rumor mills.',
    news: 'Securities regulators investigate rumor behind recent $GOSSIP dumping.',
  },
  {
    id: 'c_boxoffice',
    name: 'Box Office Index',
    symbol: '$BOXOFFICE',
    price: 82.40,
    change24h: 6.1,
    change7d: 11.2,
    marketCap: 1200000000,
    volume24h: 95000000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [74.0, 75.2, 77.1, 78.0, 79.5, 80.8, 82.40],
    overview: 'Pegged directly to North American weekend theatrical gross figures. Rises during blockbuster summer releases.',
    news: 'Summer theatrical attendance exceeds tracking estimates, boosting $BOXOFFICE.',
  },
  {
    id: 'c_oscar',
    name: 'Oscar DAO',
    symbol: '$OSCAR',
    price: 28.90,
    change24h: 18.4,
    change7d: 45.0,
    marketCap: 410000000,
    volume24h: 62000000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [19.0, 20.5, 22.1, 24.0, 23.5, 26.2, 28.90],
    overview: 'Governance token for award season prediction markets & independent screener voting pools.',
    news: 'Award season predictions drive viral trading volume across $OSCAR liquidity pools.',
  },
  {
    id: 'c_cinema',
    name: 'Cinema Cash',
    symbol: '$CINEMA',
    price: 3.20,
    change24h: 2.1,
    change7d: -1.5,
    marketCap: 120000000,
    volume24h: 8500000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [3.30, 3.25, 3.18, 3.22, 3.15, 3.19, 3.20],
    overview: 'Utility token used across 4,000+ theater concession stands & premium IMAX ticket booking systems.',
    news: 'Major cinema chain expands $CINEMA loyalty program nationwide.',
  },
  {
    id: 'c_actor',
    name: 'Actor Guild Token',
    symbol: '$ACTOR',
    price: 1.85,
    change24h: 4.3,
    change7d: 8.2,
    marketCap: 95000000,
    volume24h: 6100000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [1.70, 1.72, 1.75, 1.79, 1.81, 1.82, 1.85],
    overview: 'Decentralized talent token allowing fans to stake in rising actors and earn residuals on film contracts.',
    news: 'Talent agencies test $ACTOR residual distribution smart contracts.',
  },
  {
    id: 'c_director',
    name: 'Auteur Director',
    symbol: '$DIRECTOR',
    price: 5.60,
    change24h: -3.8,
    change7d: 14.2,
    marketCap: 180000000,
    volume24h: 12000000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [4.90, 5.10, 5.40, 5.80, 5.95, 5.75, 5.60],
    overview: 'Crowdfunds director cut editions and festival premiere distribution rights.',
    news: 'Cannes winner announces next feature co-financed via $DIRECTOR DAO.',
  },
  {
    id: 'c_script',
    name: 'Screenplay Chain',
    symbol: '$SCRIPT',
    price: 0.92,
    change24h: 1.5,
    change7d: -4.2,
    marketCap: 48000000,
    volume24h: 3200000,
    risk: 'High',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [0.96, 0.95, 0.93, 0.91, 0.89, 0.90, 0.92],
    overview: 'Blockchain script registry securing intellectual property rights for screenwriters.',
    news: 'Screenwriters Guild adopts $SCRIPT for digital copyright timestamping.',
  },
  {
    id: 'c_nepotism',
    name: 'Hollywood Legacy',
    symbol: '$NEPOTISM',
    price: 0.12,
    change24h: -42.0,
    change7d: -78.0,
    marketCap: 12000000,
    volume24h: 22000000,
    risk: 'Extreme Degen',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [0.55, 0.48, 0.35, 0.28, 0.20, 0.15, 0.12],
    overview: 'Infamous meme token backed by celebrity offspring. Prone to massive rugpulls and sudden celebrity pumps.',
    news: 'A-List celebrity kid dumps 80% of $NEPOTISM holdings, triggering steep correction.',
  },
  {
    id: 'c_indie',
    name: 'Sundance Indie',
    symbol: '$INDIE',
    price: 2.40,
    change24h: 8.9,
    change7d: 19.4,
    marketCap: 88000000,
    volume24h: 7400000,
    risk: 'High',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [2.01, 2.05, 2.12, 2.20, 2.25, 2.32, 2.40],
    overview: 'Micro-budget film launchpad token powering independent cinema distribution & art-house theater runs.',
    news: 'Sundance Grand Jury prize winner acquired by streamer, boosting $INDIE value.',
  },
  {
    id: 'c_popcorn',
    name: 'Concession Token',
    symbol: '$POPCORN',
    price: 0.25,
    change24h: 0.5,
    change7d: 1.2,
    marketCap: 28000000,
    volume24h: 1100000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [0.24, 0.24, 0.25, 0.25, 0.24, 0.25, 0.25],
    overview: 'Stable consumer utility coin redeemed for snacks, merchandise & arcade passes at multiplexes.',
    news: 'Concession sales reach record high per patron at theater locations.',
  },
  {
    id: 'c_marvel',
    name: 'Hero Universe',
    symbol: '$MARVEL',
    price: 45.10,
    change24h: 5.2,
    change7d: 12.8,
    marketCap: 890000000,
    volume24h: 110000000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [40.0, 41.2, 42.5, 43.1, 44.0, 44.5, 45.10],
    overview: 'Superhero franchise fan token granting exclusive comic con pass access and early trailer teasers.',
    news: 'Comic-Con reveal trailer breaks 24-hour viewing records.',
  },
  {
    id: 'c_streaming',
    name: 'Netstar Vault',
    symbol: '$STREAMING',
    price: 18.30,
    change24h: -2.1,
    change7d: 4.8,
    marketCap: 540000000,
    volume24h: 38000000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [17.5, 17.8, 18.1, 18.9, 18.6, 18.5, 18.30],
    overview: 'Backed by global subscription revenues and digital video licensing pools.',
    news: 'Subscriber growth numbers meet quarterly targets ahead of series finale rollout.',
  },
  {
    id: 'c_paparazzi',
    name: 'Flash Photo',
    symbol: '$PAPARAZZI',
    price: 0.38,
    change24h: 22.4,
    change7d: 58.0,
    marketCap: 29000000,
    volume24h: 14000000,
    risk: 'Extreme Degen',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [0.24, 0.26, 0.28, 0.31, 0.33, 0.35, 0.38],
    overview: 'Exclusive photo marketplace token for red carpet paparazzi leaks and viral candid celebrity photos.',
    news: 'Exclusive red carpet photo auction sets record bid in $PAPARAZZI.',
  },
  {
    id: 'c_blockbuster',
    name: 'Big Screen',
    symbol: '$BLOCKBUSTER',
    price: 64.20,
    change24h: 7.8,
    change7d: 15.1,
    marketCap: 980000000,
    volume24h: 82000000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [55.8, 57.0, 59.1, 61.2, 62.0, 63.1, 64.20],
    overview: 'Tracks top 10 tentpole film grosses worldwide.',
    news: 'Global box office tracking updated upward for Q3 release slate.',
  },
  {
    id: 'c_cult',
    name: 'Cult Classic',
    symbol: '$CULT',
    price: 4.15,
    change24h: 11.3,
    change7d: 31.0,
    marketCap: 115000000,
    volume24h: 9800000,
    risk: 'High',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [3.18, 3.30, 3.55, 3.80, 3.92, 4.05, 4.15],
    overview: 'Community-run token preserving Midnight Movies, VHS nostalgia, & grindhouse horror cinema.',
    news: 'Midnight screening tour sells out across 50 cities nationwide.',
  },
  {
    id: 'c_stunt',
    name: 'Stuntman Risk',
    symbol: '$STUNT',
    price: 0.68,
    change24h: -8.4,
    change7d: 2.1,
    marketCap: 32000000,
    volume24h: 4500000,
    risk: 'Extreme Degen',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [0.66, 0.72, 0.78, 0.75, 0.71, 0.74, 0.68],
    overview: 'Micro-insurance pool for high-octane practical stunt work and viral set action clips.',
    news: 'Action film practical stunt video goes viral on social media.',
  },
  {
    id: 'c_vip',
    name: 'Afterparty Pass',
    symbol: '$VIP',
    price: 12.40,
    change24h: 14.2,
    change7d: 29.5,
    marketCap: 210000000,
    volume24h: 26000000,
    risk: 'High',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [9.58, 10.1, 10.8, 11.2, 11.9, 12.1, 12.40],
    overview: 'Gated access token for Chateau Marmont, Soho House & post-Oscars exclusive bashes.',
    news: 'Oscars afterparty list leaked, driving demand for $VIP tokens.',
  },
  {
    id: 'c_metacritic',
    name: 'Review Score',
    symbol: '$METACRITIC',
    price: 8.90,
    change24h: -1.8,
    change7d: 3.4,
    marketCap: 165000000,
    volume24h: 11000000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [8.60, 8.75, 8.90, 9.10, 9.05, 8.98, 8.90],
    overview: 'Predictive index tied to Rotten Tomatoes & Metacritic certified fresh ratings.',
    news: 'Fall film festival review scores push index toward fresh rating band.',
  },
  {
    id: 'c_redcarpet',
    name: 'Cannes Pass',
    symbol: '$REDCARPET',
    price: 3.80,
    change24h: 9.1,
    change7d: 18.3,
    marketCap: 105000000,
    volume24h: 8200000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [3.20, 3.35, 3.48, 3.60, 3.65, 3.72, 3.80],
    overview: 'Fashion, luxury designer outfit endorsements & premier festival step-and-repeat access.',
    news: 'Luxury fashion house signs red carpet sponsorship deal in $REDCARPET.',
  },
  {
    id: 'c_drama',
    name: 'Soap Opera',
    symbol: '$DRAMA',
    price: 1.15,
    change24h: -4.1,
    change7d: -9.5,
    marketCap: 42000000,
    volume24h: 2800000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [1.27, 1.25, 1.22, 1.19, 1.18, 1.17, 1.15],
    overview: 'Daytime drama television fan token tracking long-running broadcast series.',
    news: 'Daytime Emmy nominations announcement stabilizes $DRAMA trading.',
  },
  {
    id: 'c_comedy',
    name: 'Roast Token',
    symbol: '$COMEDY',
    price: 0.78,
    change24h: 16.8,
    change7d: 42.0,
    marketCap: 36000000,
    volume24h: 9100000,
    risk: 'High',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [0.55, 0.58, 0.62, 0.68, 0.71, 0.75, 0.78],
    overview: 'Stand-up comedy special rights & Netflix comedy club streaming pass.',
    news: 'Live celebrity roast special draws millions of viewers online.',
  },
  {
    id: 'c_anime',
    name: 'Japan Animation',
    symbol: '$ANIME',
    price: 11.20,
    change24h: 13.5,
    change7d: 38.2,
    marketCap: 310000000,
    volume24h: 28000000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [8.10, 8.50, 9.20, 9.80, 10.2, 10.8, 11.20],
    overview: 'Global theatrical anime distribution & dubbing rights vault token.',
    news: 'Anime feature film exceeds $100M global box office milestone.',
  },
  {
    id: 'c_festival',
    name: 'Film Fest',
    symbol: '$FESTIVAL',
    price: 2.95,
    change24h: 3.2,
    change7d: 7.1,
    marketCap: 74000000,
    volume24h: 5200000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [2.75, 2.78, 2.82, 2.88, 2.90, 2.92, 2.95],
    overview: 'Toronto, Venice, Berlin & Telluride international film festival premiere passes.',
    news: 'Venice Golden Lion winner sparks international bidding war.',
  },
  {
    id: 'c_soundtrack',
    name: 'Score Audio',
    symbol: '$SOUNDTRACK',
    price: 1.45,
    change24h: 0.8,
    change7d: 2.5,
    marketCap: 52000000,
    volume24h: 3100000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [1.41, 1.42, 1.43, 1.44, 1.44, 1.45, 1.45],
    overview: 'Film score royalties, Hans Zimmer Hans-style orchestral recordings & vinyl releases.',
    news: 'Soundtrack vinyl special edition pre-orders sell out globally.',
  },
  {
    id: 'c_btc',
    name: 'Bitcoin',
    symbol: '$BTC',
    price: 94500.00,
    change24h: 3.2,
    change7d: 8.5,
    marketCap: 1850000000000,
    volume24h: 38000000000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [87000, 89000, 91000, 90500, 92000, 93800, 94500],
    overview: 'The pioneer digital asset. Held by studio treasuries as inflation hedge.',
    news: 'Studio treasuries allocate 5% cash reserves to $BTC.',
  },
  {
    id: 'c_eth',
    name: 'Ethereum',
    symbol: '$ETH',
    price: 3620.00,
    change24h: 2.8,
    change7d: 6.1,
    marketCap: 435000000000,
    volume24h: 18000000000,
    risk: 'Low',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [3410, 3450, 3500, 3520, 3580, 3600, 3620],
    overview: 'Settlement layer for smart-contract film financing & NFT royalty distribution.',
    news: 'Layer 2 scaling solution lowers studio transaction gas fees.',
  },
  {
    id: 'c_sol',
    name: 'Solana',
    symbol: '$SOL',
    price: 192.50,
    change24h: 9.4,
    change7d: 22.1,
    marketCap: 91000000000,
    volume24h: 8500000000,
    risk: 'Medium',
    holdings: 0,
    avgBuyPrice: 0,
    sparkline: [157.0, 162.0, 171.0, 178.0, 182.0, 188.0, 192.50],
    overview: 'High-speed blockchain powering Hollywood micro-ticketing and instant fan collectibles.',
    news: 'Solana NFT ticketing dapps process 1M weekly movie passes.',
  },
];

const INITIAL_WHALES: WhaleProfile[] = [
  {
    id: 'wh_spielberg',
    name: 'Satoshi Spielberg',
    handle: '@satoshi_spielberg',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    winRatePct: 88,
    netWorth: 14500000,
    topHoldings: ['$BOXOFFICE', '$HOLLYWOOD', '$MARVEL'],
    copyTradeActive: false,
    copyTradeProfit: 0,
  },
  {
    id: 'wh_tarantino',
    name: 'Crypto Tarantino',
    handle: '@crypto_tarantino',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
    winRatePct: 82,
    netWorth: 9800000,
    topHoldings: ['$CULT', '$SCRIPT', '$INDIE'],
    copyTradeActive: false,
    copyTradeProfit: 0,
  },
  {
    id: 'wh_nolan',
    name: 'Nolan Node',
    handle: '@nolan_node',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
    winRatePct: 79,
    netWorth: 12100000,
    topHoldings: ['$CINEMA', '$BTC', '$DIRECTOR'],
    copyTradeActive: false,
    copyTradeProfit: 0,
  },
  {
    id: 'wh_margot',
    name: 'MemeCoin Margot',
    handle: '@memecoin_margot',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop',
    winRatePct: 71,
    netWorth: 6400000,
    topHoldings: ['$PAPARAZZI', '$VIP', '$REDCARPET'],
    copyTradeActive: false,
    copyTradeProfit: 0,
  },
  {
    id: 'wh_dicaprio',
    name: 'Whale DiCaprio',
    handle: '@whale_dicaprio',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
    winRatePct: 85,
    netWorth: 18200000,
    topHoldings: ['$OSCAR', '$MARVEL', '$HOLLYWOOD'],
    copyTradeActive: false,
    copyTradeProfit: 0,
  },
];

const INITIAL_NFTS: HollywoodNFT[] = [
  {
    id: 'nft_1',
    title: 'First Oscar Speech Audio NFT',
    category: 'Academy Historic Audio',
    price: 25000,
    weeklyRoyalty: 500,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop',
    isOwned: false,
    totalRoyaltiesEarned: 0,
  },
  {
    id: 'nft_2',
    title: 'Iconic Movie Prop 3D NFT',
    category: 'Digital Studio Memorabilia',
    price: 15000,
    weeklyRoyalty: 300,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop',
    isOwned: false,
    totalRoyaltiesEarned: 0,
  },
  {
    id: 'nft_3',
    title: 'Star Walk of Fame Tile NFT',
    category: 'Hollywood Boulevard Pass',
    price: 50000,
    weeklyRoyalty: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop',
    isOwned: false,
    totalRoyaltiesEarned: 0,
  },
  {
    id: 'nft_4',
    title: 'Uncut Script First Edition NFT',
    category: 'Screenplay Collector',
    price: 8000,
    weeklyRoyalty: 150,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop',
    isOwned: false,
    totalRoyaltiesEarned: 0,
  },
];

export const StockCoinView: React.FC<StockCoinViewProps> = ({ onBack }) => {
  const { player, releasedMovies, settings, saveData, manualSave } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // State Management
  const [activeSubTab, setActiveSubTab] = useState<'MARKET' | 'PORTFOLIO' | 'NEWS' | 'WHALES' | 'NFT' | 'MY_COIN'>('MARKET');
  const [coins, setCoins] = useState<ExtendedCryptoCoin[]>(() => {
    const saved = localStorage.getItem('CRYPTO_EXCHANGE_COINS');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_EXTENDED_COINS;
      }
    }
    return INITIAL_EXTENDED_COINS;
  });

  const [whales, setWhales] = useState<WhaleProfile[]>(INITIAL_WHALES);
  const [nfts, setNfts] = useState<HollywoodNFT[]>(INITIAL_NFTS);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<ExtendedCryptoCoin | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Buy/Sell Inputs
  const [buyDollarInput, setBuyDollarInput] = useState<string>('1000');
  const [customSellDollarInput, setCustomSellDollarInput] = useState<string>('500');

  // My Coin Launch State
  const [myCoinName, setMyCoinName] = useState<string>(`${player.firstName} Token`);
  const [myCoinTicker, setMyCoinTicker] = useState<string>(`$${player.lastName.toUpperCase().slice(0, 4)}`);
  const [myCoinLiquidity, setMyCoinLiquidity] = useState<number>(25000);
  const [myCoinRoyaltyPct, setMyCoinRoyaltyPct] = useState<number>(2.5);
  const [myCoinCreated, setMyCoinCreated] = useState<boolean>(() => {
    return localStorage.getItem('MY_CELEBRITY_COIN_CREATED') === 'true';
  });

  // Save coins state to localStorage
  useEffect(() => {
    localStorage.setItem('CRYPTO_EXCHANGE_COINS', JSON.stringify(coins));
  }, [coins]);

  // Derived Calculations
  const totalPortfolioValue = coins.reduce((acc, c) => acc + (c.holdings || 0) * c.price, 0);
  const totalPortfolioCost = coins.reduce((acc, c) => acc + (c.holdings || 0) * (c.avgBuyPrice || c.price), 0);
  const totalProfitLossDollar = totalPortfolioValue - totalPortfolioCost;
  const totalProfitLossPct = totalPortfolioCost > 0 ? (totalProfitLossDollar / totalPortfolioCost) * 100 : 0;

  // Celebrity Token Unlock Check
  const isMyCoinUnlocked = player.fameXp >= 100 || player.leadRolesCount > 0 || releasedMovies.length > 0;

  // Helper: Mini Sparkline SVG render
  const renderSparkline = (data: number[], isPositive: boolean) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    const color = isPositive ? '#10B981' : '#F43F5E';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

  // DOLLAR AMOUNT BUYING
  const handleBuyByDollar = (coinId: string, dollarAmount: number) => {
    const coin = coins.find((c) => c.id === coinId);
    if (!coin || dollarAmount <= 0) return;

    if (player.money < dollarAmount) {
      setFeedback(`Insufficient cash! You have $${player.money.toLocaleString()} available.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const coinsToReceive = dollarAmount / coin.price;
    const currentHoldings = coin.holdings || 0;
    const currentCost = currentHoldings * (coin.avgBuyPrice || coin.price);
    const newHoldings = currentHoldings + coinsToReceive;
    const newAvgBuyPrice = (currentCost + dollarAmount) / newHoldings;

    // Deduct player money
    player.money -= dollarAmount;
    manualSave();

    // Update coins state
    setCoins((prev) =>
      prev.map((c) => (c.id === coinId ? { ...c, holdings: newHoldings, avgBuyPrice: newAvgBuyPrice } : c))
    );

    // Update selected coin if modal open
    if (selectedCoin && selectedCoin.id === coinId) {
      setSelectedCoin((prev) => (prev ? { ...prev, holdings: newHoldings, avgBuyPrice: newAvgBuyPrice } : null));
    }

    // Add transaction log
    const newTx: CryptoTransaction = {
      id: `tx_${Date.now()}`,
      type: 'BUY',
      symbol: coin.symbol,
      coinName: coin.name,
      dollarAmount,
      coinAmount: coinsToReceive,
      priceAtTx: coin.price,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTransactions((prev) => [newTx, ...prev]);

    setFeedback(`PURCHASED ${coinsToReceive.toFixed(4)} ${coin.symbol} for $${dollarAmount.toLocaleString()}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // PERCENTAGE OR CUSTOM SELLING
  const handleSellByPercentage = (coinId: string, percent: number) => {
    const coin = coins.find((c) => c.id === coinId);
    if (!coin || (coin.holdings || 0) <= 0) return;

    const coinsToSell = coin.holdings * (percent / 100);
    const dollarProceeds = coinsToSell * coin.price;
    const remainingHoldings = coin.holdings - coinsToSell;

    // Add cash to player
    player.money += dollarProceeds;
    manualSave();

    // Update coin holdings
    setCoins((prev) =>
      prev.map((c) => (c.id === coinId ? { ...c, holdings: remainingHoldings > 0.000001 ? remainingHoldings : 0 } : c))
    );

    if (selectedCoin && selectedCoin.id === coinId) {
      setSelectedCoin((prev) => (prev ? { ...prev, holdings: remainingHoldings > 0.000001 ? remainingHoldings : 0 } : null));
    }

    const newTx: CryptoTransaction = {
      id: `tx_${Date.now()}`,
      type: 'SELL',
      symbol: coin.symbol,
      coinName: coin.name,
      dollarAmount: dollarProceeds,
      coinAmount: coinsToSell,
      priceAtTx: coin.price,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTransactions((prev) => [newTx, ...prev]);

    setFeedback(`SOLD ${percent}% (${coinsToSell.toFixed(4)} ${coin.symbol}) for $${dollarProceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Sell Custom Dollar Amount
  const handleSellCustomDollar = (coinId: string, customDollar: number) => {
    const coin = coins.find((c) => c.id === coinId);
    if (!coin || (coin.holdings || 0) <= 0 || customDollar <= 0) return;

    const maxDollarValue = coin.holdings * coin.price;
    const actualDollar = Math.min(customDollar, maxDollarValue);
    const coinsToSell = actualDollar / coin.price;
    const remainingHoldings = coin.holdings - coinsToSell;

    player.money += actualDollar;
    manualSave();

    setCoins((prev) =>
      prev.map((c) => (c.id === coinId ? { ...c, holdings: remainingHoldings > 0.000001 ? remainingHoldings : 0 } : c))
    );

    if (selectedCoin && selectedCoin.id === coinId) {
      setSelectedCoin((prev) => (prev ? { ...prev, holdings: remainingHoldings > 0.000001 ? remainingHoldings : 0 } : null));
    }

    const newTx: CryptoTransaction = {
      id: `tx_${Date.now()}`,
      type: 'SELL',
      symbol: coin.symbol,
      coinName: coin.name,
      dollarAmount: actualDollar,
      coinAmount: coinsToSell,
      priceAtTx: coin.price,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTransactions((prev) => [newTx, ...prev]);

    setFeedback(`SOLD $${actualDollar.toLocaleString()} OF ${coin.symbol}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Advance Market Cycle / End Week Update
  const handleAdvanceMarketCycle = () => {
    setCoins((prev) =>
      prev.map((c) => {
        const changeFactor = (Math.random() - 0.48) * 0.15; // -7% to +8%
        const newPrice = Math.max(0.01, c.price * (1 + changeFactor));
        const new24h = parseFloat((c.change24h + changeFactor * 100).toFixed(1));
        const newSparkline = [...c.sparkline.slice(1), parseFloat(newPrice.toFixed(2))];
        return {
          ...c,
          price: parseFloat(newPrice.toFixed(2)),
          change24h: new24h,
          sparkline: newSparkline,
        };
      })
    );

    // Copy trading payout processing
    let copyTradingEarnings = 0;
    whales.forEach((w) => {
      if (w.copyTradeActive) {
        const gain = Math.floor(Math.random() * 800) + 100;
        copyTradingEarnings += gain;
      }
    });

    if (copyTradingEarnings > 0) {
      player.money += copyTradingEarnings;
      manualSave();
      setFeedback(`MARKET UPDATED! Active Whales copy-trading deposited +$${copyTradingEarnings.toLocaleString()} into your account!`);
    } else {
      setFeedback('MARKET UPDATED! Prices updated across Hollywood Crypto Exchange.');
    }

    setTimeout(() => setFeedback(null), 4000);
  };

  // Toggle Whale Copy Trading
  const handleToggleCopyTrade = (whaleId: string) => {
    setWhales((prev) =>
      prev.map((w) => (w.id === whaleId ? { ...w, copyTradeActive: !w.copyTradeActive } : w))
    );
    setFeedback('Copy trading settings updated!');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Buy Hollywood NFT
  const handleBuyNFT = (nftId: string) => {
    const nft = nfts.find((n) => n.id === nftId);
    if (!nft || nft.isOwned) return;

    if (player.money < nft.price) {
      setFeedback(`Insufficient funds! Need $${nft.price.toLocaleString()} to purchase ${nft.title}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= nft.price;
    manualSave();

    setNfts((prev) =>
      prev.map((n) => (n.id === nftId ? { ...n, isOwned: true } : n))
    );

    setFeedback(`PURCHASED ${nft.title.toUpperCase()}! Earns $${nft.weeklyRoyalty}/week in royalties.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Collect Weekly NFT Royalties
  const handleCollectNFTRoyalties = () => {
    const totalWeekly = nfts.filter((n) => n.isOwned).reduce((acc, n) => acc + n.weeklyRoyalty, 0);
    if (totalWeekly <= 0) return;

    player.money += totalWeekly;
    manualSave();

    setNfts((prev) =>
      prev.map((n) => (n.isOwned ? { ...n, totalRoyaltiesEarned: n.totalRoyaltiesEarned + n.weeklyRoyalty } : n))
    );

    setFeedback(`COLLECTED +$${totalWeekly.toLocaleString()} IN WEEKLY NFT ROYALTIES!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Create Celebrity Token
  const handleLaunchCelebrityCoin = () => {
    if (player.money < myCoinLiquidity) {
      setFeedback(`Insufficient funds for initial liquidity pool ($${myCoinLiquidity.toLocaleString()} required).`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= myCoinLiquidity;
    manualSave();

    const customCoin: ExtendedCryptoCoin = {
      id: `c_celebrity_${Date.now()}`,
      name: myCoinName,
      symbol: myCoinTicker.startsWith('$') ? myCoinTicker : `$${myCoinTicker}`,
      price: 1.00 + (player.fameXp / 200),
      change24h: 15.4,
      change7d: 38.0,
      marketCap: myCoinLiquidity * 10,
      volume24h: myCoinLiquidity * 1.5,
      risk: 'Medium',
      holdings: myCoinLiquidity / 1.0,
      avgBuyPrice: 1.0,
      sparkline: [0.80, 0.85, 0.90, 0.95, 1.00, 1.10, 1.15],
      overview: `Official Celebrity Fan Token launched by ${player.firstName} ${player.lastName}. Grants fans private call passes & secondary market trade royalties.`,
      news: `${player.firstName} ${player.lastName} launches official celebrity fan token with $${myCoinLiquidity.toLocaleString()} initial liquidity pool.`,
      isMyCoin: true,
    };

    setCoins((prev) => [customCoin, ...prev]);
    setMyCoinCreated(true);
    localStorage.setItem('MY_CELEBRITY_COIN_CREATED', 'true');

    setFeedback(`LAUNCHED CELEBRITY TOKEN ${customCoin.symbol}! Initial liquidity pool created.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-24 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-amber-400" />
          Stock Coin & Web3 Exchange
        </span>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-3 relative overflow-hidden"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40">
              <Coins className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">STOCK COIN & CRYPTO EXCHANGE</h1>
              <p className="text-xs text-amber-300/80 font-medium">
                Trade 28+ entertainment cryptocurrencies, copy-trade Hollywood whales, or launch your custom Celebrity Token.
              </p>
            </div>
          </div>

          <button
            onClick={handleAdvanceMarketCycle}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 text-black hover:scale-105 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Update Market Week
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* PORTFOLIO OVERVIEW CARD */}
      <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-xl">
        <div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Portfolio Value</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Total Profit / Loss</span>
          <span
            className={`text-xl sm:text-2xl font-black flex items-center gap-1 ${
              totalProfitLossDollar >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalProfitLossDollar >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            ${Math.abs(totalProfitLossDollar).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Return Rate</span>
          <span
            className={`text-base sm:text-lg font-black ${
              totalProfitLossPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalProfitLossPct >= 0 ? '+' : ''}
            {totalProfitLossPct.toFixed(2)}%
          </span>
        </div>

        <div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Liquid Cash Balance</span>
          <span className="text-base sm:text-lg font-black text-amber-300">
            ${player.money.toLocaleString()}
          </span>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {(['MARKET', 'PORTFOLIO', 'NEWS', 'WHALES', 'NFT', 'MY_COIN'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeSubTab === tab
                ? 'bg-amber-400 text-black shadow-lg'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* 1. MARKET TAB */}
      {activeSubTab === 'MARKET' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase">
              Hollywood Entertainment Crypto Market ({coins.length} Coins)
            </span>
            <span className="text-[10px] text-gray-400 font-bold">
              Click 'View & Trade' to enter Dollar Amounts or Sell Holdings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {coins.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl border border-white/10 bg-black/40 hover:bg-black/70 transition-all flex flex-col justify-between space-y-3 shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{c.name}</span>
                        <span className="text-[10px] font-bold text-amber-400">{c.symbol}</span>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border mt-1 inline-block ${
                          c.risk === 'Extreme Degen'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : c.risk === 'High'
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {c.risk} Risk
                      </span>
                    </div>

                    {renderSparkline(c.sparkline, c.change24h >= 0)}
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Price</span>
                      <strong className="text-white text-sm">
                        ${c.price >= 100 ? c.price.toLocaleString() : c.price.toFixed(2)}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-gray-400 text-[10px] block">24H Change</span>
                      <span
                        className={`font-black text-xs ${
                          c.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {c.change24h >= 0 ? '+' : ''}
                        {c.change24h}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-gray-400 text-[10px] block">Market Cap</span>
                      <strong className="text-amber-300 text-xs">
                        ${(c.marketCap / 1000000).toFixed(0)}M
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-gray-400">
                    Holdings: <strong className="text-white">{c.holdings ? c.holdings.toFixed(2) : 0} {c.symbol}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedCoin(c)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-black hover:scale-105 transition-all cursor-pointer shadow-lg"
                  >
                    View & Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PORTFOLIO TAB */}
      {activeSubTab === 'PORTFOLIO' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-3">
            <h3 className="text-sm font-black text-amber-300 uppercase">Asset Allocation Breakdown</h3>
            <div className="w-full bg-black/80 h-4 rounded-full overflow-hidden flex border border-white/10">
              {coins.filter((c) => (c.holdings || 0) > 0).map((c, i) => {
                const coinValue = (c.holdings || 0) * c.price;
                const pct = totalPortfolioValue > 0 ? (coinValue / totalPortfolioValue) * 100 : 0;
                const colors = ['#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6'];
                return (
                  <div
                    key={c.id}
                    style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }}
                    className="h-full"
                    title={`${c.symbol}: ${pct.toFixed(1)}%`}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {coins.filter((c) => (c.holdings || 0) > 0).length === 0 ? (
              <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
                <Coins className="w-10 h-10 text-gray-600 mx-auto" />
                <h3 className="text-sm font-black text-white">No Crypto Assets Owned</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Head over to the Market tab to invest in entertainment cryptocurrencies.
                </p>
              </div>
            ) : (
              coins
                .filter((c) => (c.holdings || 0) > 0)
                .map((c) => {
                  const currentValue = (c.holdings || 0) * c.price;
                  const totalCost = (c.holdings || 0) * (c.avgBuyPrice || c.price);
                  const pnl = currentValue - totalCost;
                  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

                  return (
                    <div key={c.id} className="p-4 sm:p-5 rounded-3xl border border-white/10 bg-black/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-white">{c.name}</h3>
                          <span className="text-xs font-black text-amber-400">{c.symbol}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Holdings: <strong className="text-white">{(c.holdings || 0).toFixed(4)} {c.symbol}</strong> • Avg Buy: <strong className="text-amber-300">${(c.avgBuyPrice || c.price).toFixed(2)}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-base font-black text-white block">${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className={`text-xs font-black ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPct.toFixed(1)}%)
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSellByPercentage(c.id, 50)}
                            className="px-3 py-2 rounded-xl text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer"
                          >
                            Sell 50%
                          </button>
                          <button
                            onClick={() => handleSellByPercentage(c.id, 100)}
                            className="px-3 py-2 rounded-xl text-xs font-black bg-rose-500 text-white hover:bg-rose-600 transition-all cursor-pointer shadow-lg"
                          >
                            Sell 100%
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* 3. NEWS TAB */}
      {activeSubTab === 'NEWS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
            <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <Newspaper className="w-4 h-4 text-amber-400" />
              Breaking Entertainment Crypto Headlines
            </span>
            <p className="text-gray-300">
              News updates directly impact coin volatility, rugpulls & sudden market spikes.
            </p>
          </div>

          <div className="space-y-3">
            {coins.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-white/10 bg-black/40 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 shrink-0">
                  <Activity className="w-5 h-5 text-amber-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-400">{c.symbol}</span>
                    <span className="text-[10px] font-bold text-gray-400">• Market Alert</span>
                  </div>
                  <p className="text-xs text-white mt-1 leading-relaxed">{c.news}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. WHALES TAB (COPY TRADING) */}
      {activeSubTab === 'WHALES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-xs space-y-1">
            <span className="font-extrabold text-sky-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sky-400" />
              Hollywood Whales Copy Trading Engine
            </span>
            <p className="text-gray-300">
              Enable Copy Trading on elite whales to mirror their high-yield trades automatically every market week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whales.map((w) => (
              <div key={w.id} className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
                    <div>
                      <h3 className="text-base font-black text-white">{w.name}</h3>
                      <span className="text-xs text-gray-400">{w.handle}</span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-500/30">
                    {w.winRatePct}% Win Rate
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block font-bold uppercase">Net Worth</span>
                    <strong className="text-white">${w.netWorth.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block font-bold uppercase">Top Holdings</span>
                    <strong className="text-amber-300">{w.topHoldings.join(', ')}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleCopyTrade(w.id)}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-lg ${
                    w.copyTradeActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-400 text-black hover:scale-102'
                  }`}
                >
                  {w.copyTradeActive ? 'Active Copy Trading' : 'Enable Copy Trading'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. NFT MARKET TAB */}
      {activeSubTab === 'NFT' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase">
              Exclusive Hollywood NFTs & Royalty Pass Vault
            </span>

            {nfts.some((n) => n.isOwned) && (
              <button
                onClick={handleCollectNFTRoyalties}
                className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-400 text-black hover:scale-105 transition-all cursor-pointer shadow-lg"
              >
                Collect Weekly Royalties
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nfts.map((nft) => (
              <div key={nft.id} className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-4 shadow-xl">
                <img src={nft.imageUrl} alt={nft.title} className="w-full h-40 object-cover rounded-2xl border border-white/10" />

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-400">{nft.category}</span>
                  <h3 className="text-base font-black text-white">{nft.title}</h3>
                  <p className="text-xs text-gray-300">
                    Price: <strong className="text-white">${nft.price.toLocaleString()}</strong> • Weekly Royalty: <strong className="text-emerald-400">+${nft.weeklyRoyalty}/wk</strong>
                  </p>
                </div>

                {nft.isOwned ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black text-center">
                    OWNED • Total Earned: ${nft.totalRoyaltiesEarned.toLocaleString()}
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuyNFT(nft.id)}
                    className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg"
                  >
                    Buy NFT Pass (${nft.price.toLocaleString()})
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MY COIN TAB (CELEBRITY TOKEN) */}
      {activeSubTab === 'MY_COIN' && (
        <div>
          {!isMyCoinUnlocked ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/60 text-center space-y-4 max-w-lg mx-auto my-6 shadow-2xl backdrop-blur-md">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 w-fit mx-auto">
                <Zap className="w-12 h-12 text-amber-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase tracking-wide">Celebrity Token Locked</h2>
                <p className="text-xs text-amber-300 font-medium leading-relaxed">
                  Celebrity Token Unlocks at 100+ Fame XP or 1 Released Movie. Build your Hollywood career first!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/80 border border-white/10 text-xs text-gray-400 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span>Player Fame XP:</span>
                  <strong className={player.fameXp >= 100 ? 'text-emerald-400' : 'text-rose-400'}>
                    {player.fameXp} / 100 XP
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Released Movies:</span>
                  <strong className={releasedMovies.length > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {releasedMovies.length} / 1 Released
                  </strong>
                </div>
              </div>
            </div>
          ) : myCoinCreated ? (
            <div className="p-8 rounded-3xl border border-amber-400/40 bg-black/60 text-center space-y-4 max-w-lg mx-auto shadow-2xl">
              <Zap className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-2xl font-black text-white">{myCoinName} ({myCoinTicker})</h2>
              <p className="text-xs text-gray-300">
                Your Celebrity Fan Token is live on the Hollywood Crypto Exchange! Price fluctuates with your career fame and film releases.
              </p>
              <div className="p-4 rounded-2xl bg-black/80 border border-white/10 text-xs space-y-2 text-left">
                <div className="flex justify-between"><span>Token Price:</span><strong className="text-emerald-400">${(1.0 + player.fameXp / 200).toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>Royalty Fee:</span><strong className="text-amber-300">{myCoinRoyaltyPct}% on secondary trades</strong></div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl border border-amber-400/30 bg-black/50 max-w-xl mx-auto space-y-4 shadow-2xl">
              <div className="text-center space-y-1">
                <Zap className="w-10 h-10 text-amber-400 mx-auto" />
                <h2 className="text-xl font-black text-white uppercase">Launch Your Celebrity Fan Token</h2>
                <p className="text-xs text-gray-400">
                  Tokenize your star brand! Issue fan access passes and collect royalties on secondary trades.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Token Name</label>
                  <input
                    type="text"
                    value={myCoinName}
                    onChange={(e) => setMyCoinName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/80 border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Ticker Symbol</label>
                  <input
                    type="text"
                    value={myCoinTicker}
                    onChange={(e) => setMyCoinTicker(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/80 border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Initial Liquidity Pool ($ Cash)</label>
                  <select
                    value={myCoinLiquidity}
                    onChange={(e) => setMyCoinLiquidity(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-black/80 border border-white/20 text-white"
                  >
                    <option value={5000}>$5,000 Cash Pool</option>
                    <option value={25000}>$25,000 Cash Pool</option>
                    <option value={100000}>$100,000 Cash Pool</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Royalty Fee</label>
                  <select
                    value={myCoinRoyaltyPct}
                    onChange={(e) => setMyCoinRoyaltyPct(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-black/80 border border-white/20 text-white"
                  >
                    <option value={1.0}>1.0% Royalty</option>
                    <option value={2.5}>2.5% Royalty</option>
                    <option value={5.0}>5.0% Royalty</option>
                  </select>
                </div>

                <button
                  onClick={handleLaunchCelebrityCoin}
                  className="w-full py-4 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-2xl uppercase"
                >
                  Launch Token (${myCoinLiquidity.toLocaleString()})
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COIN DETAILS & TRADING MODAL */}
      {selectedCoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-2xl rounded-3xl border border-amber-400/40 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: theme.headers }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">{selectedCoin.name}</span>
                <span className="text-xs font-bold text-amber-400">{selectedCoin.symbol}</span>
              </div>
              <button
                onClick={() => setSelectedCoin(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{selectedCoin.overview}</p>

            {/* Price Header */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/80 border border-white/10 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] block">Current Price</span>
                <strong className="text-white text-base">${selectedCoin.price >= 100 ? selectedCoin.price.toLocaleString() : selectedCoin.price.toFixed(2)}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Your Holdings</span>
                <strong className="text-amber-300 text-base">{(selectedCoin.holdings || 0).toFixed(4)} {selectedCoin.symbol}</strong>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">Holdings Value</span>
                <strong className="text-emerald-400 text-base">${((selectedCoin.holdings || 0) * selectedCoin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
            </div>

            {/* INVESTMENT AMOUNT BASED BUYING */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <h4 className="text-xs font-black text-emerald-400 uppercase">Buy Coin (Enter Dollar Amount)</h4>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    value={buyDollarInput}
                    onChange={(e) => setBuyDollarInput(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-black/80 border border-white/20 text-white text-xs"
                    placeholder="Enter Dollar Investment"
                  />
                </div>
                <button
                  onClick={() => handleBuyByDollar(selectedCoin.id, Number(buyDollarInput))}
                  className="px-5 py-2 rounded-xl font-black text-xs bg-emerald-400 text-black hover:scale-105 transition-all cursor-pointer shadow-lg"
                >
                  Buy {((Number(buyDollarInput) || 0) / selectedCoin.price).toFixed(2)} {selectedCoin.symbol}
                </button>
              </div>
            </div>

            {/* PERCENTAGE & CUSTOM SELLING */}
            {selectedCoin.holdings && selectedCoin.holdings > 0 ? (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <h4 className="text-xs font-black text-rose-400 uppercase">Sell Coin Options</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleSellByPercentage(selectedCoin.id, pct)}
                      className="py-2 rounded-xl font-black text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/40 transition-all cursor-pointer"
                    >
                      Sell {pct}%
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <input
                    type="number"
                    value={customSellDollarInput}
                    onChange={(e) => setCustomSellDollarInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/20 text-white text-xs"
                    placeholder="Custom Dollar Amount to Sell"
                  />
                  <button
                    onClick={() => handleSellCustomDollar(selectedCoin.id, Number(customSellDollarInput))}
                    className="px-4 py-2 rounded-xl font-black text-xs bg-rose-500 text-white hover:bg-rose-600 cursor-pointer shadow-lg shrink-0"
                  >
                    Sell Custom $
                  </button>
                </div>
              </div>
            ) : null}

            {/* TRANSACTION HISTORY FOR THIS COIN */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase">Transaction History</h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {transactions.filter((t) => t.symbol === selectedCoin.symbol).length === 0 ? (
                  <span className="text-[11px] text-gray-500 italic block">No recent transactions for {selectedCoin.symbol}.</span>
                ) : (
                  transactions
                    .filter((t) => t.symbol === selectedCoin.symbol)
                    .map((t) => (
                      <div key={t.id} className="p-2 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between text-[11px]">
                        <span className={`font-black ${t.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.type} {t.coinAmount.toFixed(4)} {t.symbol}
                        </span>
                        <span className="text-white">${t.dollarAmount.toLocaleString()}</span>
                        <span className="text-gray-500">{t.timestamp}</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
