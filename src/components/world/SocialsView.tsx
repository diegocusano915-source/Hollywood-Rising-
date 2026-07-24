/**
 * HOLLYWOOD RISING - Social Media Applications Suite (Phase 3 Revision)
 * Multi-Platform Social Media Applications Engine: Twitter, Facebook, Instagram, Reddit, YouTube, Telegram.
 * Strict Progression:
 * 1. Requires account creation per platform before showing feed/profile.
 * 2. Starts at 0 Followers / 0 Following.
 * 3. Endless NPC Feed (20 initial, endless generation).
 * 4. Writers tab hidden until first writer hired.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialPost, HiredWriter } from '../../types/world';
import {
  MessageSquare,
  Repeat,
  Heart,
  Send,
  UserPlus,
  ArrowLeft,
  PenTool,
  Check,
  BadgeCheck,
  Edit3,
  MessageCircle,
  Lock,
  PlusCircle,
  Sparkles,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface SocialsViewProps {
  onBack: () => void;
}

export type PlatformType = 'Twitter' | 'Facebook' | 'Instagram' | 'Reddit' | 'YouTube' | 'Telegram';

const PLATFORM_CONFIGS: Record<PlatformType, {
  name: string;
  color: string;
  bgGradient: string;
  cardBg: string;
  handlePrefix: string;
  postActionLabel: string;
  likeLabel: string;
  shareLabel: string;
  commentLabel: string;
}> = {
  Twitter: {
    name: 'X / Twitter',
    color: '#1DA1F2',
    bgGradient: 'from-sky-950/40 via-black to-black',
    cardBg: 'bg-sky-950/20 border-sky-500/20',
    handlePrefix: '@',
    postActionLabel: 'Post Tweet',
    likeLabel: 'Like',
    shareLabel: 'Repost',
    commentLabel: 'Reply',
  },
  Facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bgGradient: 'from-blue-950/40 via-black to-black',
    cardBg: 'bg-blue-950/20 border-blue-500/20',
    handlePrefix: 'fb/',
    postActionLabel: 'Share Status',
    likeLabel: 'Like',
    shareLabel: 'Share',
    commentLabel: 'Comment',
  },
  Instagram: {
    name: 'Instagram',
    color: '#E1306C',
    bgGradient: 'from-fuchsia-950/40 via-purple-950/30 to-black',
    cardBg: 'bg-fuchsia-950/20 border-fuchsia-500/20',
    handlePrefix: '@',
    postActionLabel: 'Share Reel / Post',
    likeLabel: 'Heart',
    shareLabel: 'Send',
    commentLabel: 'Comment',
  },
  Reddit: {
    name: 'Reddit',
    color: '#FF4500',
    bgGradient: 'from-orange-950/40 via-black to-black',
    cardBg: 'bg-orange-950/20 border-orange-500/20',
    handlePrefix: 'u/',
    postActionLabel: 'Create Thread',
    likeLabel: 'Upvote',
    shareLabel: 'Crosspost',
    commentLabel: 'Thread',
  },
  YouTube: {
    name: 'YouTube',
    color: '#FF0000',
    bgGradient: 'from-red-950/40 via-black to-black',
    cardBg: 'bg-red-950/20 border-red-500/20',
    handlePrefix: 'c/',
    postActionLabel: 'Upload Video / Post',
    likeLabel: 'Thumbs Up',
    shareLabel: 'Share Link',
    commentLabel: 'Discussion',
  },
  Telegram: {
    name: 'Telegram',
    color: '#229ED9',
    bgGradient: 'from-cyan-950/40 via-black to-black',
    cardBg: 'bg-cyan-950/20 border-cyan-500/20',
    handlePrefix: 't.me/',
    postActionLabel: 'Broadcast Message',
    likeLabel: 'Reaction',
    shareLabel: 'Forward',
    commentLabel: 'Chat',
  },
};

const NPC_SOURCES = [
  { name: 'Hollywood Pulse', handle: '@hollywoodpulse', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop' },
  { name: 'The Velvet Rope', handle: '@velvetrope', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop' },
  { name: 'ScreenWire', handle: '@screenwire', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop' },
  { name: 'Fame Insider', handle: '@fameinsider', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop' },
  { name: 'StarScope', handle: '@starscope', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop' },
  { name: 'Spotlight Daily', handle: '@spotlightdaily', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop' },
  { name: 'Celebrity Chronicle', handle: '@celebchronicle', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop' },
  { name: 'Red Carpet Report', handle: '@redcarpetrpt', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop' },
  { name: 'Silver Screen Journal', handle: '@silverscreenjrnl', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop' },
  { name: 'Backstage Buzz', handle: '@backstagebuzz', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop' },
  { name: 'The Hollywood Ledger', handle: '@hollywoodledger', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop' },
  { name: 'FlashPop Entertainment', handle: '@flashpopent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop' },
  { name: 'The Reel Observer', handle: '@reelobserver', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop' },
  { name: 'Marcus Cole (A-List Star)', handle: '@marcuscole_real', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop' },
  { name: 'Jessica Lin (Director)', handle: '@jessicalindirector', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop' },
  { name: 'Warner Bros Studios', handle: '@warnerbros', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop' },
  { name: 'Netstar Streaming', handle: '@netstarapp', avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop' },
  { name: 'Sterling & Associates Law', handle: '@sterlinglegal', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop' },
];

const TEMPLATE_HEADLINES = [
  'BREAKING: Summer box office figures shatter 5-year records as theater attendance spikes!',
  'RUMOR: Major studio in secret bidding war for upcoming superhero trilogy script.',
  'SAG-AFTRA casting directors issue urgent callboard for fresh action-thriller leads.',
  'Streaming giant Netstar announces $50M investment in original international drama series.',
  'Top Hollywood talent agency signs three breakout indie festival actors this week.',
  'Behind the scenes: Directors discuss the shift toward physical stunts over green screen.',
  'Red Carpet Preview: Award season predictions hint at major snubs and surprise frontrunners.',
  'Leaked memos reveal upcoming sci-fi blockbuster budget expanded to $180M.',
  'Industry insider reveals new tax incentives attracting major studio shoots to Atlanta.',
  'Box Office Tracking: Opening weekend projections for new franchise release updated to $95M.',
  'Exclusive interview: Leading directors share what they look for during chemistry reads.',
  'Gossip Roundup: Chateau Marmont post-premiere party draws Hollywood royalty.',
  'Legal Briefing: Studio copyright dispute settled out of court for undisclosed millions.',
  'Fan Poll: Who is the most promising breakout lead actor of the current television season?',
  'PR Strategy: How celebrity endorsement deals are evolving in the digital streaming era.',
];

const generateRandomNpcPost = (platform: PlatformType, index: number): SocialPost => {
  const source = NPC_SOURCES[Math.floor(Math.random() * NPC_SOURCES.length)];
  const headline = TEMPLATE_HEADLINES[Math.floor(Math.random() * TEMPLATE_HEADLINES.length)];
  const sentiments: Array<'Positive' | 'Neutral' | 'Viral' | 'Criticism'> = ['Positive', 'Neutral', 'Viral', 'Positive'];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

  return {
    id: `npc_post_${platform}_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
    authorName: source.name,
    authorHandle: source.handle,
    authorAvatar: source.avatar,
    platform,
    tab: 'NPC_FEED',
    text: headline,
    likes: Math.floor(Math.random() * 18000) + 500,
    comments: Math.floor(Math.random() * 1200) + 40,
    retweets: Math.floor(Math.random() * 3200) + 80,
    shares: Math.floor(Math.random() * 950) + 20,
    timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
    isPlayer: false,
    isNpc: true,
    sentiment,
  };
};

const generateBatchNpcPosts = (platform: PlatformType, count: number): SocialPost[] => {
  return Array.from({ length: count }, (_, i) => generateRandomNpcPost(platform, i));
};

export const SocialsView: React.FC<SocialsViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activePlatform, setActivePlatform] = useState<PlatformType>('Twitter');

  // Account creation state per platform (Persisted in localStorage)
  const [createdPlatforms, setCreatedPlatforms] = useState<Record<PlatformType, boolean>>(() => ({
    Twitter: localStorage.getItem('TWITTER_ACCOUNT_CREATED') === 'true',
    Facebook: localStorage.getItem('FACEBOOK_ACCOUNT_CREATED') === 'true',
    Instagram: localStorage.getItem('INSTAGRAM_ACCOUNT_CREATED') === 'true',
    Reddit: localStorage.getItem('REDDIT_ACCOUNT_CREATED') === 'true',
    YouTube: localStorage.getItem('YOUTUBE_ACCOUNT_CREATED') === 'true',
    Telegram: localStorage.getItem('TELEGRAM_ACCOUNT_CREATED') === 'true',
  }));

  // Followers / Following per platform (Persisted in localStorage, default 0)
  const [platformFollowers, setPlatformFollowers] = useState<Record<PlatformType, number>>(() => ({
    Twitter: parseInt(localStorage.getItem('TWITTER_FOLLOWERS') || '0', 10),
    Facebook: parseInt(localStorage.getItem('FACEBOOK_FOLLOWERS') || '0', 10),
    Instagram: parseInt(localStorage.getItem('INSTAGRAM_FOLLOWERS') || '0', 10),
    Reddit: parseInt(localStorage.getItem('REDDIT_FOLLOWERS') || '0', 10),
    YouTube: parseInt(localStorage.getItem('YOUTUBE_FOLLOWERS') || '0', 10),
    Telegram: parseInt(localStorage.getItem('TELEGRAM_FOLLOWERS') || '0', 10),
  }));

  const [platformFollowing, setPlatformFollowing] = useState<Record<PlatformType, number>>(() => ({
    Twitter: parseInt(localStorage.getItem('TWITTER_FOLLOWING') || '0', 10),
    Facebook: parseInt(localStorage.getItem('FACEBOOK_FOLLOWING') || '0', 10),
    Instagram: parseInt(localStorage.getItem('INSTAGRAM_FOLLOWING') || '0', 10),
    Reddit: parseInt(localStorage.getItem('REDDIT_FOLLOWING') || '0', 10),
    YouTube: parseInt(localStorage.getItem('YOUTUBE_FOLLOWING') || '0', 10),
    Telegram: parseInt(localStorage.getItem('TELEGRAM_FOLLOWING') || '0', 10),
  }));

  // Navigation tab after account creation
  const [activeTab, setActiveTab] = useState<'PLAYER_FEED' | 'NPC_FEED' | 'WRITERS'>('PLAYER_FEED');

  // Player posts per platform
  const [playerPosts, setPlayerPosts] = useState<Record<PlatformType, SocialPost[]>>({
    Twitter: [],
    Facebook: [],
    Instagram: [],
    Reddit: [],
    YouTube: [],
    Telegram: [],
  });

  // Endless NPC Posts per platform (20 initial)
  const [npcPosts, setNpcPosts] = useState<Record<PlatformType, SocialPost[]>>(() => ({
    Twitter: generateBatchNpcPosts('Twitter', 20),
    Facebook: generateBatchNpcPosts('Facebook', 20),
    Instagram: generateBatchNpcPosts('Instagram', 20),
    Reddit: generateBatchNpcPosts('Reddit', 20),
    YouTube: generateBatchNpcPosts('YouTube', 20),
    Telegram: generateBatchNpcPosts('Telegram', 20),
  }));

  // Writers State
  const [writers, setWriters] = useState<HiredWriter[]>([
    {
      id: 'w_1',
      name: 'Liam Vance (Junior Blogger)',
      tier: 'Low',
      weeklyCost: 250,
      postsPerWeek: 3,
      contractWeeksRemaining: 4,
      postsThisWeek: 0,
      qualityBoost: 5,
      hired: false,
    },
    {
      id: 'w_2',
      name: 'Sophia Sterling (PR Specialist)',
      tier: 'Medium',
      weeklyCost: 750,
      postsPerWeek: 5,
      contractWeeksRemaining: 4,
      postsThisWeek: 0,
      qualityBoost: 15,
      hired: false,
    },
    {
      id: 'w_3',
      name: 'Marcus Sterling (Veteran Ghostwriter)',
      tier: 'Elite',
      weeklyCost: 2500,
      postsPerWeek: 10,
      contractWeeksRemaining: 4,
      postsThisWeek: 0,
      qualityBoost: 35,
      hired: false,
    },
  ]);

  const [postsRemainingThisWeek, setPostsRemainingThisWeek] = useState(2);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showHireWriterModal, setShowHireWriterModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const config = PLATFORM_CONFIGS[activePlatform];
  const isAccountCreated = createdPlatforms[activePlatform];
  const hasHiredWriter = writers.some((w) => w.hired);

  // Helper: Calculate Follower Gain per Post based on career stage
  const calculateFollowerGain = (currentFollowers: number): number => {
    if (currentFollowers < 500) {
      if (player.fameXp === 0 && (player.moviesCompleted || 0) === 0) {
        // Brand New Player (0 Fame, 0 movies released): 0 - 3 followers
        return Math.floor(Math.random() * 4);
      }
      // Small Actor (1 - 500 followers): 0 - 10 followers
      return Math.floor(Math.random() * 11);
    } else if (currentFollowers < 10000) {
      // Supporting Actor (500 - 10,000 followers): 2 - 40 followers
      return Math.floor(Math.random() * 39) + 2;
    } else if (currentFollowers < 500000) {
      // Lead Actor (10,000 - 500,000 followers): 20 - 300 followers
      return Math.floor(Math.random() * 281) + 20;
    } else if (currentFollowers < 5000000) {
      // Recognized Celebrity (500,000 - 5,000,000 followers): 100 - 2,500 followers
      return Math.floor(Math.random() * 2401) + 100;
    } else if (currentFollowers < 50000000) {
      // National Superstar (5M - 50M followers): 500 - 20,000 followers
      return Math.floor(Math.random() * 19501) + 500;
    } else if (currentFollowers < 250000000) {
      // Global Superstar (50M - 250M followers): 2,000 - 100,000 followers
      return Math.floor(Math.random() * 98001) + 2000;
    } else {
      // Hollywood Legend (250M+ followers): 10,000 - 1,000,000+ followers
      return Math.floor(Math.random() * 990001) + 10000;
    }
  };

  // Handle Account Creation
  const handleCreateAccount = (platform: PlatformType) => {
    const platKey = platform.toUpperCase();
    localStorage.setItem(`${platKey}_ACCOUNT_CREATED`, 'true');
    localStorage.setItem(`${platKey}_FOLLOWERS`, '0');
    localStorage.setItem(`${platKey}_FOLLOWING`, '0');

    setCreatedPlatforms((prev) => ({ ...prev, [platform]: true }));
    setPlatformFollowers((prev) => ({ ...prev, [platform]: 0 }));
    setPlatformFollowing((prev) => ({ ...prev, [platform]: 0 }));
    setFeedback(`ACCOUNT CREATED FOR ${platform.toUpperCase()}! (0 Followers)`);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Handle Manual Player Post
  const handleCreatePost = () => {
    if (!newPostText.trim()) return;

    if (postsRemainingThisWeek <= 0) {
      setFeedback('Weekly limit reached! Max 2 manual posts per week.');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const currentCount = platformFollowers[activePlatform] || 0;
    const earnedFans = calculateFollowerGain(currentCount);
    const newCount = currentCount + earnedFans;

    localStorage.setItem(`${activePlatform.toUpperCase()}_FOLLOWERS`, newCount.toString());

    const post: SocialPost = {
      id: `post_pl_${Date.now()}`,
      authorName: `${player.firstName} ${player.lastName}`,
      authorHandle: `${config.handlePrefix}${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`,
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      platform: activePlatform,
      tab: 'PLAYER_FEED',
      text: newPostText,
      likes: Math.floor(Math.random() * 450) + 30,
      comments: Math.floor(Math.random() * 50) + 5,
      retweets: Math.floor(Math.random() * 80) + 10,
      shares: Math.floor(Math.random() * 30) + 2,
      timestamp: 'Just now',
      isPlayer: true,
      isNpc: false,
      sentiment: 'Viral',
    };

    setPlayerPosts((prev) => ({
      ...prev,
      [activePlatform]: [post, ...(prev[activePlatform] || [])],
    }));

    // Update followers naturally
    setPlatformFollowers((prev) => ({
      ...prev,
      [activePlatform]: newCount,
    }));

    setPostsRemainingThisWeek((prev) => prev - 1);
    setNewPostText('');
    setShowPostModal(false);
    setFeedback(`PUBLISHED ON ${activePlatform.toUpperCase()}! (+${earnedFans} Earned Followers)`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Infinite Scroll / Load 20 More NPC Posts
  const handleLoadMoreNpcPosts = () => {
    const additional = generateBatchNpcPosts(activePlatform, 20);
    setNpcPosts((prev) => ({
      ...prev,
      [activePlatform]: [...(prev[activePlatform] || []), ...additional],
    }));
  };

  // Toggle Hire Writer
  const handleToggleHireWriter = (writerId: string) => {
    setWriters((prev) =>
      prev.map((w) => {
        if (w.id === writerId) {
          const nextHired = !w.hired;
          return {
            ...w,
            hired: nextHired,
            contractWeeksRemaining: nextHired ? 4 : 0,
          };
        }
        return w;
      })
    );
    setShowHireWriterModal(false);
    setFeedback('Writer contract updated! PR Ghostwriter feature active.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-24 space-y-4"
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
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Hollywood Social Network Portal
        </span>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* PLATFORM SELECTOR BAR */}
      <div className="p-2 rounded-3xl bg-black/60 border border-white/10 flex items-center gap-2 overflow-x-auto">
        {(Object.keys(PLATFORM_CONFIGS) as PlatformType[]).map((plat) => {
          const platConf = PLATFORM_CONFIGS[plat];
          const isActive = activePlatform === plat;
          const created = createdPlatforms[plat];

          return (
            <button
              key={plat}
              onClick={() => setActivePlatform(plat)}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black shadow-lg scale-102'
                  : 'bg-black/40 text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: platConf.color }} />
              {platConf.name} {created ? '(Active)' : '(Not Created)'}
            </button>
          );
        })}
      </div>

      {/* ACTIVE PLATFORM CONTAINER */}
      <div
        className={`rounded-3xl border p-4 sm:p-6 space-y-6 shadow-2xl bg-gradient-to-b ${config.bgGradient}`}
        style={{ borderColor: theme.borderDark }}
      >
        {/* CONDITION 1: ACCOUNT NOT CREATED -> DISPLAY STRICTLY CREATE ACCOUNT CARD ONLY */}
        {!isAccountCreated ? (
          <div className="p-8 rounded-3xl border border-white/10 bg-black/70 text-center space-y-6 max-w-md mx-auto my-6 shadow-2xl backdrop-blur-md">
            <div
              className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-2xl font-black shadow-lg"
              style={{
                backgroundColor: `${config.color}20`,
                color: config.color,
                border: `1px solid ${config.color}40`,
              }}
            >
              {activePlatform.toUpperCase().slice(0, 2)}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">{activePlatform.toUpperCase()}</h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Create your {activePlatform} account to begin building your fanbase.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/80 border border-white/10 text-xs">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Followers</span>
                <span className="text-xl font-black text-white">0</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Following</span>
                <span className="text-xl font-black text-white">0</span>
              </div>
            </div>

            <button
              onClick={() => handleCreateAccount(activePlatform)}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-98"
              style={{ backgroundColor: config.color, color: '#000' }}
            >
              CREATE ACCOUNT
            </button>
          </div>
        ) : (
          /* CONDITION 2: ACCOUNT CREATED -> DISPLAY FULL PROFILE & FEEDS */
          <div className="space-y-6">
            {/* PROFILE HEADER */}
            <div className={`p-5 rounded-3xl border ${config.cardBg} space-y-4 backdrop-blur-md`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'}
                      alt={`${player.firstName} ${player.lastName}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 shadow-xl"
                      style={{ borderColor: config.color }}
                    />
                    {player.fameXp >= 100 && (
                      <BadgeCheck className="w-6 h-6 text-sky-400 fill-sky-400/20 absolute -bottom-1 -right-1 bg-black rounded-full" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black text-white">
                        {player.firstName} {player.lastName}
                      </h1>
                    </div>

                    <p className="text-xs font-bold text-gray-400 mt-0.5">
                      {config.handlePrefix}{player.firstName.toLowerCase()}{player.lastName.toLowerCase()}
                    </p>

                    <p className="text-[11px] text-amber-300/80 font-medium mt-1">
                      Hollywood Talent • {player.isUnionMember ? 'SAG-AFTRA Actor' : 'Rising Actor'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFeedback('Profile bio synchronized with your character record!');
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all self-stretch sm:self-auto justify-center"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              </div>

              {/* STATS: FOLLOWERS & FOLLOWING */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-black/60 border border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] font-bold block">Followers</span>
                  <span className="text-base font-black text-emerald-400">
                    {platformFollowers[activePlatform].toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] font-bold block">Following</span>
                  <span className="text-base font-black text-amber-300">
                    {platformFollowing[activePlatform].toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] font-bold block">Weekly Posts</span>
                  <span className="text-base font-black text-amber-400">{postsRemainingThisWeek} / 2</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] font-bold block">Account Status</span>
                  <span className="text-xs font-extrabold text-sky-400">Active Fanbase</span>
                </div>
              </div>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('PLAYER_FEED')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'PLAYER_FEED'
                    ? 'bg-amber-400 text-black shadow-lg'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                PLAYER FEED ({playerPosts[activePlatform].length})
              </button>

              <button
                onClick={() => setActiveTab('NPC_FEED')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'NPC_FEED'
                    ? 'bg-amber-400 text-black shadow-lg'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                NPC FEED ({npcPosts[activePlatform].length})
              </button>

              {/* WRITERS TAB: REMAIN HIDDEN UNTIL PLAYER HIRES FIRST WRITER */}
              {hasHiredWriter && (
                <button
                  onClick={() => setActiveTab('WRITERS')}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'WRITERS'
                      ? 'bg-amber-400 text-black shadow-lg'
                      : 'bg-black/40 text-purple-300 hover:text-white border border-purple-500/30'
                  }`}
                >
                  WRITERS ({writers.filter((w) => w.hired).length} Active)
                </button>
              )}
            </div>

            {/* TAB 1: PLAYER FEED */}
            {activeTab === 'PLAYER_FEED' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-black text-amber-300 uppercase">
                    {config.name} Player Feed
                  </span>

                  <div className="flex items-center gap-2">
                    {!hasHiredWriter && (
                      <button
                        onClick={() => setShowHireWriterModal(true)}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <PenTool className="w-3.5 h-3.5 text-purple-400" />
                        Hire PR Writer
                      </button>
                    )}

                    <button
                      onClick={() => setShowPostModal(true)}
                      disabled={postsRemainingThisWeek <= 0}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                        postsRemainingThisWeek > 0
                          ? 'bg-amber-400 text-black hover:scale-105 cursor-pointer shadow-lg'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {config.postActionLabel} ({postsRemainingThisWeek}/2)
                    </button>
                  </div>
                </div>

                {playerPosts[activePlatform].length === 0 ? (
                  <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
                    <MessageSquare className="w-10 h-10 text-gray-600 mx-auto" />
                    <h3 className="text-sm font-black text-white">No Player Posts Yet on {config.name}</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Click '{config.postActionLabel}' to create your first post and earn fans!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {playerPosts[activePlatform].map((post) => (
                      <div key={post.id} className="p-4.5 rounded-2xl border border-white/10 bg-black/50 space-y-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-amber-400/40" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{post.authorName}</span>
                              <span className="text-[10px] text-gray-400">{post.authorHandle}</span>
                            </div>
                            <span className="text-[9px] text-gray-500">{post.timestamp}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-200 leading-relaxed">{post.text}</p>

                        <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 pt-1 border-t border-white/5">
                          <span className="flex items-center gap-1 hover:text-amber-400 transition-all cursor-pointer">
                            <Heart className="w-3.5 h-3.5" /> {post.likes.toLocaleString()} {config.likeLabel}
                          </span>
                          <span className="flex items-center gap-1 hover:text-amber-400 transition-all cursor-pointer">
                            <MessageCircle className="w-3.5 h-3.5" /> {post.comments.toLocaleString()} {config.commentLabel}
                          </span>
                          <span className="flex items-center gap-1 hover:text-amber-400 transition-all cursor-pointer">
                            <Repeat className="w-3.5 h-3.5" /> {post.shares.toLocaleString()} {config.shareLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ENDLESS NPC FEED */}
            {activeTab === 'NPC_FEED' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 uppercase">
                    Endless Hollywood NPC Feed ({config.name})
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {npcPosts[activePlatform].length} Posts Loaded
                  </span>
                </div>

                <div className="space-y-3">
                  {npcPosts[activePlatform].map((post) => (
                    <div key={post.id} className="p-4.5 rounded-2xl border border-white/10 bg-black/50 space-y-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-amber-400/40" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{post.authorName}</span>
                            <span className="text-[10px] text-gray-400">{post.authorHandle}</span>
                          </div>
                          <span className="text-[9px] text-gray-500">{post.timestamp}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-200 leading-relaxed">{post.text}</p>

                      <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1 hover:text-amber-400 transition-all cursor-pointer">
                          <Heart className="w-3.5 h-3.5" /> {post.likes.toLocaleString()} {config.likeLabel}
                        </span>
                        <span className="flex items-center gap-1 hover:text-amber-400 transition-all cursor-pointer">
                          <MessageCircle className="w-3.5 h-3.5" /> {post.comments.toLocaleString()} {config.commentLabel}
                        </span>
                        <span className="flex items-center gap-1 hover:text-amber-400 transition-all cursor-pointer">
                          <Repeat className="w-3.5 h-3.5" /> {post.shares.toLocaleString()} {config.shareLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ENDLESS GENERATION BUTTON */}
                <button
                  onClick={handleLoadMoreNpcPosts}
                  className="w-full py-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-amber-300 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  Load 20 More NPC Posts (Endless Feed)
                </button>
              </div>
            )}

            {/* TAB 3: WRITERS (VISIBLE ONLY WHEN AT LEAST ONE WRITER IS HIRED) */}
            {activeTab === 'WRITERS' && hasHiredWriter && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-1">
                  <span className="font-extrabold text-purple-300 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-purple-400" />
                    PR Ghostwriters & Content Agency
                  </span>
                  <p className="text-gray-300">
                    Active writers automatically produce high-engagement weekly posts on your social accounts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {writers.map((w) => (
                    <div
                      key={w.id}
                      className={`p-5 rounded-3xl border ${
                        w.hired
                          ? 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-500/10'
                          : 'border-white/10 bg-black/50'
                      } space-y-3 shadow-xl flex flex-col justify-between`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {w.tier} Tier Writer
                          </span>
                          <span className="text-xs font-black text-emerald-400">${w.weeklyCost}/wk</span>
                        </div>

                        <h3 className="text-base font-black text-white">{w.name}</h3>

                        <div className="p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px] space-y-1 text-gray-300">
                          <div>Auto Posts: <strong className="text-amber-300">{w.postsPerWeek} / week</strong></div>
                          <div>Contract Weeks: <strong className="text-white">{w.contractWeeksRemaining} Wks</strong></div>
                          <div>Engagement Boost: <strong className="text-emerald-400">+{w.qualityBoost}% Chance</strong></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleHireWriter(w.id)}
                        className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          w.hired
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-400 text-black hover:scale-102 shadow-lg'
                        }`}
                      >
                        {w.hired ? (
                          <>
                            <Check className="w-4 h-4" /> Active Writer (Cancel Contract)
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" /> Hire Writer (${w.weeklyCost}/wk)
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-lg rounded-3xl border border-amber-400/40 p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: theme.headers }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black text-amber-400 uppercase">
                Publish Post to {config.name}
              </span>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <textarea
              rows={4}
              placeholder={`Write something to your ${config.name} followers...`}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-gray-400 font-bold">
                Posts left this week: <strong className="text-amber-400">{postsRemainingThisWeek} / 2</strong>
              </span>

              <button
                onClick={handleCreatePost}
                className="px-6 py-2.5 rounded-xl font-black text-xs bg-amber-400 text-black hover:scale-105 transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIRE WRITER MODAL (FOR UNLOCKING WRITERS TAB) */}
      {showHireWriterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-xl rounded-3xl border border-purple-400/40 p-6 space-y-4 shadow-2xl relative overflow-y-auto max-h-[85vh]"
            style={{ backgroundColor: theme.headers }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-black text-white uppercase">Hire PR Ghostwriter</span>
              </div>
              <button
                onClick={() => setShowHireWriterModal(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Select a PR Ghostwriter to handle social media updates, auto-generate engagement, and build your fan base.
            </p>

            <div className="space-y-3">
              {writers.map((w) => (
                <div key={w.id} className="p-4 rounded-2xl border border-white/10 bg-black/50 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{w.name}</h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {w.tier} Tier
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {w.postsPerWeek} posts/week • +{w.qualityBoost}% Viral Boost
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleHireWriter(w.id)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-black hover:scale-105 transition-all cursor-pointer shadow-lg"
                  >
                    Hire (${w.weeklyCost}/wk)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
