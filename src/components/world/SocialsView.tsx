/**
 * HOLLYWOOD RISING - Global Social Media System (Phase 2 Master Ecosystem)
 * Complete overhaul connecting Twitter/X, Instagram, YouTube, Official Website, Fan Club, Sponsorships, PR Writers & Analytics.
 * All social events originate from actual gameplay. Zero fake events.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialPost, HiredWriter } from '../../types/world';
import {
  SocialsService,
  PlatformType,
  VerificationType,
  SocialsState,
  PostComment,
  DirectMessage,
  InstagramPost,
  InstagramStory,
  InstagramReel,
  YouTubeVideo,
  SponsorshipDeal,
  FanFeedItem,
  GOVERNMENT_ACCOUNTS,
} from '../../services/socialsService';
import { RepresentationService } from '../../services/representationService';
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
  Sparkles,
  RefreshCw,
  TrendingUp,
  Bookmark,
  Eye,
  ShieldCheck,
  Landmark,
  Bell,
  CheckCircle2,
  AlertCircle,
  Building2,
  Film,
  Flame,
  X,
  Share2,
  Globe,
  Tv,
  Video,
  Play,
  BarChart3,
  DollarSign,
  Users,
  Award,
  Briefcase,
  Camera,
  Handshake,
  Grid,
  ChevronRight,
  Plus,
  Compass,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface SocialsViewProps {
  onBack: () => void;
}

export type MainNavTab =
  | 'X_TWITTER'
  | 'INSTAGRAM'
  | 'YOUTUBE'
  | 'OFFICIAL_WEBSITE'
  | 'FAN_CLUB'
  | 'SPONSORSHIPS'
  | 'PR_WRITERS'
  | 'ANALYTICS'
  | 'MESSAGES';

export const SocialsView: React.FC<SocialsViewProps> = ({ onBack }) => {
  const { player, settings, saveData, updateSave, releasedMovies, bookedProjects } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeNavTab, setActiveNavTab] = useState<MainNavTab>('X_TWITTER');

  // Load persistent socials state
  const [socialsState, setSocialsState] = useState<SocialsState>(() => SocialsService.getState());
  const [repState, setRepState] = useState(() => RepresentationService.getState());

  // X/Twitter Specific Sub-Tabs
  const [xSubTab, setXSubTab] = useState<'PLAYER_FEED' | 'NPC_FEED' | 'TRENDING' | 'GOVERNMENT'>('PLAYER_FEED');

  // Instagram Sub-Tabs
  const [instaSubTab, setInstaSubTab] = useState<'FEED' | 'REELS' | 'GRID' | 'HIGHLIGHTS' | 'TAGGED' | 'EXPLORE'>('FEED');

  // YouTube Sub-Tabs
  const [ytSubTab, setYtSubTab] = useState<'MY_VIDEOS' | 'MONETIZATION' | 'NPC_CHANNELS' | 'ANALYTICS'>('MY_VIDEOS');

  // Fan Club Sub-Tabs
  const [fanClubSubTab, setFanClubSubTab] = useState<'FAN_FEED' | 'ANNOUNCEMENTS' | 'EVENTS'>('FAN_FEED');

  // Infinite Scroll state for X NPC Feed
  const [npcPosts, setNpcPosts] = useState<SocialPost[]>(() =>
    SocialsService.generateNpcPostsBatch('Twitter', 20, {
      playerName: `${player.firstName} ${player.lastName}`,
      releasedMovies,
      fans: player.fans,
      fameXp: player.fameXp,
    })
  );
  const [isLoadingMoreNpc, setIsLoadingMoreNpc] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Modals state
  const [showTweetModal, setShowTweetModal] = useState(false);
  const [showInstaUploadModal, setShowInstaUploadModal] = useState(false);
  const [showYtUploadModal, setShowYtUploadModal] = useState(false);
  const [showFanPostModal, setShowFanPostModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeStory, setActiveStory] = useState<InstagramStory | null>(null);
  const [activePostForComments, setActivePostForComments] = useState<SocialPost | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // NPC Profile Modal State
  interface NpcProfileData {
    name: string;
    handle: string;
    avatar: string;
    bio: string;
    category: string;
    followers: number;
    following: number;
    isFollowing: boolean;
    posts: SocialPost[];
  }
  const [selectedNpcProfile, setSelectedNpcProfile] = useState<NpcProfileData | null>(null);

  const openNpcProfile = (name: string, handle: string, avatar: string, category?: string) => {
    const handleClean = handle.startsWith('@') ? handle : `@${handle}`;
    const generatedPosts = SocialsService.generateNpcPostsBatch('Twitter', 6, {
      playerName: `${player.firstName} ${player.lastName}`,
      releasedMovies,
      fans: player.fans,
      fameXp: player.fameXp,
    }).map((p) => ({
      ...p,
      authorName: name,
      authorHandle: handleClean,
      authorAvatar: avatar,
    }));

    setSelectedNpcProfile({
      name,
      handle: handleClean,
      avatar,
      bio: `Official ${category || 'Hollywood Film & Industry'} account • Critical reviews, box office tracking, BTS filming & celebrity news. Los Angeles, CA 🎬✨`,
      category: category || 'Hollywood Insider & Critic',
      followers: Math.floor(25000 + Math.random() * 850000),
      following: Math.floor(200 + Math.random() * 1200),
      isFollowing: false,
      posts: generatedPosts,
    });
  };

  // Inputs
  const [tweetInput, setTweetInput] = useState('');
  const [instaCaption, setInstaCaption] = useState('');
  const [instaCategory, setInstaCategory] = useState<InstagramPost['category']>('MOVIE_PREMIERE');
  const [ytTitle, setYtTitle] = useState('');
  const [ytCategory, setYtCategory] = useState<YouTubeVideo['category']>('TRAILER');
  const [fanPostTitle, setFanPostTitle] = useState('');
  const [fanPostContent, setFanPostContent] = useState('');

  const [feedback, setFeedback] = useState<string | null>(null);

  // Synchronize state changes to persistence
  const updateSocialsState = (updater: (prev: SocialsState) => SocialsState) => {
    setSocialsState((prev) => {
      const updated = updater(prev);
      SocialsService.saveState(updated);
      return updated;
    });
  };

  const refreshRepState = () => {
    setRepState({ ...RepresentationService.getState() });
  };

  // Infinite Scroll Listener for X NPC Feed (True infinite scroll with NO static loading messages)
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || activeNavTab !== 'X_TWITTER' || xSubTab !== 'NPC_FEED' || isLoadingMoreNpc) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        setIsLoadingMoreNpc(true);
        setTimeout(() => {
          const newBatch = SocialsService.generateNpcPostsBatch('Twitter', 12, {
            playerName: `${player.firstName} ${player.lastName}`,
            releasedMovies,
            fans: player.fans,
            fameXp: player.fameXp,
          });
          setNpcPosts((prev) => [...prev, ...newBatch]);
          setIsLoadingMoreNpc(false);
        }, 500);
      }
    };

    const el = scrollContainerRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [activeNavTab, xSubTab, isLoadingMoreNpc]);

  // Account creation toggle
  const handleCreateAccount = (platform: PlatformType) => {
    updateSocialsState((prev) => ({
      ...prev,
      createdPlatforms: { ...prev.createdPlatforms, [platform]: true },
      followers: { ...prev.followers, [platform]: 0 },
    })); // FIXED: No fake followers - starts at 0 as requested
    setFeedback(`Account created on ${platform}! Started building your organic fanbase.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Submit Tweet
  const handlePostTweet = () => {
    if (!tweetInput.trim()) return;
    if (socialsState.postsRemainingThisWeek <= 0) {
      alert('You have reached your posting limit for this week. Advance week to post again or hire a PR Writer!');
      return;
    }

    const followers = socialsState.followers['Twitter'] || 100;
    const verification = socialsState.verification['Twitter'] || 'NONE';
    const hasPR = socialsState.writers.some((w) => w.hired);
    const eng = SocialsService.calculatePostEngagement(followers, verification, player, hasPR);

    const dummyPostId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const npcComments = SocialsService.generateNpcCommentsForPost(dummyPostId, tweetInput.trim(), Math.floor(Math.random() * 81) + 20, player);

    const newPost: SocialPost = {
      id: dummyPostId,
      authorName: `${player.firstName} ${player.lastName}`,
      authorHandle: `@${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`,
      authorAvatar: player.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      platform: 'Twitter',
      tab: 'PLAYER_FEED',
      text: tweetInput.trim(),
      likes: eng.likes,
      comments: npcComments.length,
      retweets: eng.shares,
      shares: eng.shares,
      timestamp: 'Just now',
      isPlayer: true,
      isNpc: false,
      sentiment: 'Positive',
    };

    updateSocialsState((prev) => {
      const updatedPlayerPosts = [newPost, ...(prev.playerPosts['Twitter'] || [])];
      const updatedFollowers = (prev.followers['Twitter'] || 0) + eng.followerGain;
      return {
        ...prev,
        postsRemainingThisWeek: Math.max(0, prev.postsRemainingThisWeek - 1),
        playerPosts: { ...prev.playerPosts, Twitter: updatedPlayerPosts },
        postComments: { ...prev.postComments, [newPost.id]: npcComments },
        followers: { ...prev.followers, Twitter: updatedFollowers },
      };
    });

    setTweetInput('');
    setShowTweetModal(false);
    setFeedback(`Tweet published! Engagement: ${eng.likes.toLocaleString()} Likes, ${npcComments.length} Comments, +${eng.followerGain} Followers.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Upload Instagram Photo
  const handleUploadInstaPhoto = () => {
    if (!instaCaption.trim()) return;

    const sampleImages: Record<InstagramPost['category'], string> = {
      MOVIE_PREMIERE: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
      BEHIND_SCENES: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop',
      RED_CARPET: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
      AWARD_NIGHT: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop',
      LUXURY_LIFESTYLE: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop',
      DAILY_VLOG: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    };

    const followers = socialsState.followers['Instagram'] || 100;
    const eng = SocialsService.calculatePostEngagement(followers, socialsState.verification['Instagram'] || 'NONE', player, false);

    const dummyInstaId = `insta_${Date.now()}`;
    const npcComments = SocialsService.generateNpcCommentsForPost(dummyInstaId, instaCaption.trim(), Math.floor(Math.random() * 81) + 20, player);

    const newInstaPost: InstagramPost = {
      id: dummyInstaId,
      imageUrl: sampleImages[instaCategory],
      caption: instaCaption.trim(),
      category: instaCategory,
      likes: eng.likes,
      commentsCount: npcComments.length,
      timestamp: 'Just now',
      location: 'Los Angeles, California',
    };

    // Also increase total player fans
    player.fans = (player.fans || 0) + eng.followerGain;

    updateSocialsState((prev) => ({
      ...prev,
      instagramPosts: [newInstaPost, ...prev.instagramPosts],
      postComments: { ...prev.postComments, [newInstaPost.id]: npcComments },
      followers: { ...prev.followers, Instagram: (prev.followers.Instagram || 0) + eng.followerGain },
    }));

    setInstaCaption('');
    setShowInstaUploadModal(false);
    setFeedback(`Photo published to Instagram! Gained +${eng.followerGain} new followers.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Apply for YouTube Monetization
  const handleApplyMonetization = () => {
    const res = SocialsService.applyForYouTubeMonetization();
    setSocialsState(SocialsService.getState());
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Upload YouTube Video
  const handleUploadYtVideo = () => {
    if (!ytTitle.trim()) return;

    const thumbnails: Record<YouTubeVideo['category'], string> = {
      TRAILER: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
      VLOG: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
      INTERVIEW: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop',
      BEHIND_SCENES: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
      LIVESTREAM: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
      AWARD_SPEECH: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop',
      ANNOUNCEMENT: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    };

    let initialViews = 0;
    if ((socialsState.youtubeSubscribers || 0) < 100) {
      const lowViewList = [5, 18, 47, 82, 120, 165];
      initialViews = lowViewList[Math.floor(Math.random() * lowViewList.length)];
    } else {
      initialViews = Math.floor((socialsState.youtubeSubscribers || 0) * (0.05 + Math.random() * 0.15)) + 25;
    }

    if (ytCategory === 'TRAILER') {
      initialViews += (player.fameXp * 3) + 60;
    }

    const durationSec = Math.floor(Math.random() * 600) + 300;
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const retention = Math.floor(Math.random() * 30) + 45;
    const ctr = parseFloat((Math.random() * 4.5 + 4.0).toFixed(1));
    const watchTime = parseFloat(((initialViews * durationSec * (retention / 100)) / 3600).toFixed(1));
    const subGain = Math.floor(initialViews * 0.02);

    const isMonetized = socialsState.youtubeMonetizationStatus === 'APPROVED';
    const estRev = isMonetized ? Math.floor((initialViews / 1000) * 4.5) : 0;

    const dummyVidId = `yt_${Date.now()}`;
    const npcComments = SocialsService.generateNpcCommentsForPost(dummyVidId, ytTitle.trim(), Math.floor(Math.random() * 81) + 20, player);

    const newVid: YouTubeVideo = {
      id: dummyVidId,
      title: ytTitle.trim(),
      thumbnailUrl: thumbnails[ytCategory],
      category: ytCategory,
      views: initialViews,
      likes: Math.floor(initialViews * 0.08),
      commentsCount: npcComments.length,
      watchTimeHours: watchTime,
      retentionPercent: retention,
      ctrPercent: ctr,
      shares: Math.floor(initialViews * 0.01),
      subscribersGained: subGain,
      estimatedRevenue: estRev,
      uploadWeek: player.dateWeek,
      uploadYear: player.dateYear,
      duration: durationStr,
      durationSec,
      isEvergreen: Math.random() < 0.35,
    };

    // Increase player total fans
    player.fans = (player.fans || 0) + subGain;

    updateSocialsState((prev) => ({
      ...prev,
      youtubeVideos: [newVid, ...prev.youtubeVideos],
      postComments: { ...prev.postComments, [newVid.id]: npcComments },
      youtubeTotalViews: (prev.youtubeTotalViews || 0) + initialViews,
      youtubeWatchHours: parseFloat(((prev.youtubeWatchHours || 0) + watchTime).toFixed(1)),
      youtubeSubscribers: (prev.youtubeSubscribers || 0) + subGain,
      followers: { ...prev.followers, YouTube: (prev.followers.YouTube || 0) + subGain },
    }));

    setYtTitle('');
    setShowYtUploadModal(false);
    setFeedback(`Video "${ytTitle}" uploaded to YouTube Studio! Initial Views: ${initialViews.toLocaleString()}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Accept Sponsorship Contract
  const handleAcceptSponsorship = (deal: SponsorshipDeal) => {
    player.money += deal.lumpSumPayout;

    updateSocialsState((prev) => ({
      ...prev,
      sponsorshipDeals: prev.sponsorshipDeals.map((d) =>
        d.id === deal.id ? { ...d, status: 'ACTIVE' } : d
      ),
    }));

    setFeedback(`🎉 Sponsorship contract signed with ${deal.brandName}! Collected upfront payout of $${deal.lumpSumPayout.toLocaleString()}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Pitch / Hire PR Writer
  const handlePitchWriter = (writer: HiredWriter) => {
    try {
      const res = SocialsService.pitchWriter(writer.id, player);

      // Refresh local state from service
      setSocialsState(SocialsService.getState());

      // Send outcome inbox message to global save data
      if (res.inboxMsg) {
        updateSave({
          ...saveData,
          inbox: [res.inboxMsg, ...(saveData.inbox || [])],
        });
      }

      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 4500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit retainer proposal.');
    }
  };

  const totalFollowersAll = (Object.values(socialsState.followers) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white select-none flex flex-col font-sans">
      {/* TOP HEADER */}
      <div className="bg-black/80 border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>HOLLYWOOD SOCIAL ECOSYSTEM</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] border border-amber-400/30">
                PHASE 2 MASTER
              </span>
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">
              Global Organic Followers: <strong className="text-emerald-400 font-bold">{totalFollowersAll.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Messages Drawer Icon */}
          <button
            onClick={() => setActiveNavTab('MESSAGES')}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-sky-400" />
            {socialsState.messages.some((m) => !m.read) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Followers Stats Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-gray-300">Total Reach:</span>
            <span className="font-black text-emerald-400">{totalFollowersAll.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedback && (
        <div className="bg-emerald-500 text-black px-4 py-2 text-center text-xs font-black uppercase tracking-wider shadow-xl animate-pulse">
          {feedback}
        </div>
      )}

      {/* MAIN PLATFORM NAVIGATION RIBBON */}
      <div className="bg-black/60 border-b border-white/10 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'X_TWITTER', label: '𝕏 / Twitter', icon: Repeat, color: 'text-sky-400' },
          { id: 'INSTAGRAM', label: 'Instagram', icon: Camera, color: 'text-fuchsia-400' },
          { id: 'YOUTUBE', label: 'YouTube', icon: Play, color: 'text-red-400' },
          { id: 'OFFICIAL_WEBSITE', label: 'Official Website', icon: Globe, color: 'text-blue-400' },
          { id: 'FAN_CLUB', label: 'Official Fan Club', icon: Heart, color: 'text-rose-400' },
          { id: 'SPONSORSHIPS', label: 'Sponsorships', icon: Handshake, color: 'text-emerald-400' },
          { id: 'PR_WRITERS', label: 'PR Writers', icon: PenTool, color: 'text-amber-400' },
          { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3, color: 'text-indigo-400' },
        ].map((tab) => {
          const isActive = activeNavTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id as MainNavTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-black shadow-lg font-black scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollContainerRef}>
        {/* ============================================================ */}
        {/* 1. X / TWITTER TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'X_TWITTER' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Account Status Banner */}
            {!socialsState.createdPlatforms.Twitter ? (
              <div className="p-6 rounded-3xl bg-sky-950/30 border border-sky-500/30 text-center space-y-3">
                <Repeat className="w-10 h-10 text-sky-400 mx-auto" />
                <h2 className="text-lg font-black text-white">Create Official 𝕏 / Twitter Handle</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Build your primary broadcast channel for breaking film news, trailer drops, and fan interactions.
                </p>
                <button
                  onClick={() => handleCreateAccount('Twitter')}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs transition-all shadow-lg cursor-pointer"
                >
                  CREATE HANDLE (@{player.firstName.toLowerCase()}{player.lastName.toLowerCase()})
                </button>
              </div>
            ) : (
              <>
                {/* Posting Limits & Action Bar */}
                <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-sky-500/20">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatarUrl}
                      alt={player.firstName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-sky-400"
                    />
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{player.firstName} {player.lastName}</span>
                        {socialsState.verification['Twitter'] === 'GOLD' && <BadgeCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />}
                        {socialsState.verification['Twitter'] === 'BLUE' && <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />}
                      </h3>
                      <p className="text-xs text-sky-400 font-bold">
                        @{player.firstName.toLowerCase()}{player.lastName.toLowerCase()} • {(socialsState.followers['Twitter'] || 0).toLocaleString()} Followers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Weekly Posts</span>
                      <span className="text-xs font-black text-amber-400">{socialsState.postsRemainingThisWeek} / 2 Left</span>
                    </div>
                    <button
                      onClick={() => setShowTweetModal(true)}
                      disabled={socialsState.postsRemainingThisWeek <= 0}
                      className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        socialsState.postsRemainingThisWeek > 0
                          ? 'bg-sky-500 hover:bg-sky-400 text-black shadow-lg hover:scale-105'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <PenTool className="w-4 h-4" />
                      <span>POST TWEET</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Nav Tabs for X */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  {[
                    { id: 'PLAYER_FEED', label: `My Feed (${(socialsState.playerPosts['Twitter'] || []).length})` },
                    { id: 'NPC_FEED', label: 'Live Industry Feed' },
                    { id: 'TRENDING', label: '🔥 Hollywood Trending' },
                    { id: 'GOVERNMENT', label: '🏛️ Gov Film Commission' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setXSubTab(sub.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        xSubTab === sub.id
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* PLAYER FEED */}
                {xSubTab === 'PLAYER_FEED' && (
                  <div className="space-y-3">
                    {(socialsState.playerPosts['Twitter'] || []).length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-xs bg-black/40 rounded-2xl border border-white/5">
                        No tweets posted yet. Click 'Post Tweet' to share updates with fans!
                      </div>
                    ) : (
                      (socialsState.playerPosts['Twitter'] || []).map((post) => (
                        <div key={post.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={post.authorAvatar} alt={post.authorName} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <span className="font-bold text-xs text-white block">{post.authorName}</span>
                                <span className="text-[10px] text-gray-400">{post.authorHandle} • {post.timestamp}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              post.generatedByWriter ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300'
                            }`}>
                              {post.generatedByWriter ? '✍️ PR WRITER' : 'PLAYER TWEET'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-200 leading-relaxed">{post.text}</p>
                          <div className="flex items-center gap-6 text-[11px] text-gray-400 pt-2 border-t border-white/5">
                            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {post.likes.toLocaleString()}</span>
                            <span className="flex items-center gap-1"><Repeat className="w-3.5 h-3.5 text-emerald-400" /> {post.shares.toLocaleString()}</span>
                            <button
                              onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                              className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{post.comments.toLocaleString()} Comments</span>
                            </button>
                          </div>

                          {/* EXPANDABLE COMMENTS DRAWER */}
                          {expandedPostId === post.id && (
                            <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 bg-black/40 p-3 rounded-xl">
                              <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-black uppercase text-sky-400 tracking-wider">
                                  NPC Fan & Industry Comments
                                </h4>
                                <span className="text-[10px] text-gray-400">Detailed Feedback</span>
                              </div>
                              {((socialsState.postComments[post.id] && socialsState.postComments[post.id].length > 0)
                                ? socialsState.postComments[post.id]
                                : SocialsService.generateNpcCommentsForPost(post.id, post.text, 35, player)
                              ).map((comment) => (
                                <div key={comment.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                                  <img src={comment.authorAvatar} alt={comment.authorName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-xs text-white">{comment.authorName}</span>
                                      <span className="text-[10px] text-gray-400">{comment.authorHandle}</span>
                                      {comment.badge === 'GOLD' && <BadgeCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />}
                                      {comment.badge === 'BLUE' && <BadgeCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />}
                                      <span className="text-[10px] text-gray-500 ml-auto">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{comment.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* NPC INDUSTRY FEED (True Smooth Infinite Scroll) */}
                {xSubTab === 'NPC_FEED' && (
                  <div className="space-y-3">
                    {npcPosts.map((post) => (
                      <div key={post.id} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 hover:border-sky-500/30 transition-all">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => openNpcProfile(post.authorName, post.authorHandle, post.authorAvatar)}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
                          >
                            <img src={post.authorAvatar} alt={post.authorName} className="w-8 h-8 rounded-full object-cover border border-sky-400/40" />
                            <div>
                              <span className="font-bold text-xs text-white flex items-center gap-1 hover:text-sky-300">
                                {post.authorName}
                                <BadgeCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                              </span>
                              <span className="text-[10px] text-gray-400">{post.authorHandle} • {post.timestamp}</span>
                            </div>
                          </button>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Eye className="w-3 h-3 text-sky-400" />
                            {(post.likes * 14).toLocaleString()} Views
                          </span>
                        </div>
                        <p className="text-xs text-gray-200 leading-relaxed">{post.text}</p>
                        <div className="flex items-center gap-6 text-[11px] text-gray-400 pt-2 border-t border-white/5">
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {post.likes.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Repeat className="w-3.5 h-3.5 text-emerald-400" /> {post.shares.toLocaleString()}</span>
                          <button
                            onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{post.comments.toLocaleString()} Comments</span>
                          </button>
                        </div>

                        {/* EXPANDABLE COMMENTS DRAWER FOR NPC POSTS */}
                        {expandedPostId === post.id && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 bg-black/40 p-3 rounded-xl">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-black uppercase text-sky-400 tracking-wider">
                                Industry Comments & Reactions
                              </h4>
                              <span className="text-[10px] text-gray-400">Verified Discussions</span>
                            </div>
                            {SocialsService.generateNpcCommentsForPost(post.id, post.text, 25, player).map((comment) => (
                              <div key={comment.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                                <button
                                  onClick={() => openNpcProfile(comment.authorName, comment.authorHandle, comment.authorAvatar)}
                                  className="shrink-0 cursor-pointer hover:opacity-80"
                                >
                                  <img src={comment.authorAvatar} alt={comment.authorName} className="w-7 h-7 rounded-full object-cover" />
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <button
                                      onClick={() => openNpcProfile(comment.authorName, comment.authorHandle, comment.authorAvatar)}
                                      className="font-bold text-xs text-white hover:text-sky-300 cursor-pointer"
                                    >
                                      {comment.authorName}
                                    </button>
                                    <span className="text-[10px] text-gray-400">{comment.authorHandle}</span>
                                    {comment.badge === 'GOLD' && <BadgeCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />}
                                    {comment.badge === 'BLUE' && <BadgeCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />}
                                    <span className="text-[10px] text-gray-500 ml-auto">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoadingMoreNpc && (
                      <div className="text-center py-4 text-xs text-sky-400 animate-pulse font-bold">
                        Loading new Hollywood posts...
                      </div>
                    )}
                  </div>
                )}

                {/* TRENDING TOPICS */}
                {xSubTab === 'TRENDING' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/20">
                      <h3 className="text-xs font-black uppercase text-amber-400 flex items-center gap-2 mb-3">
                        <Flame className="w-4 h-4" />
                        <span>LIVE GAMEPLAY TRENDING TAGS</span>
                      </h3>
                      <div className="space-y-2">
                        {socialsState.trendingTopics.map((tag, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-gray-400 block font-mono">#{idx + 1} Trending Worldwide</span>
                              <span className="text-sm font-black text-white">{tag}</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-400">{(150000 - idx * 22000).toLocaleString()} Tweets</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* GOVERNMENT ACCOUNTS */}
                {xSubTab === 'GOVERNMENT' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {GOVERNMENT_ACCOUNTS.map((gov, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-black/60 border border-amber-500/20 flex items-start gap-3">
                        <img src={gov.avatar} alt={gov.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-400" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white flex items-center gap-1">
                            {gov.name}
                            <BadgeCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                          </h4>
                          <span className="text-[10px] text-amber-400 font-mono block">{gov.handle}</span>
                          <p className="text-[11px] text-gray-300">{gov.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. INSTAGRAM REDESIGN TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'INSTAGRAM' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {!socialsState.createdPlatforms.Instagram ? (
              <div className="p-6 rounded-3xl bg-fuchsia-950/30 border border-fuchsia-500/30 text-center space-y-3">
                <Camera className="w-10 h-10 text-fuchsia-400 mx-auto" />
                <h2 className="text-lg font-black text-white">Create Official Instagram Profile</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Build your visual brand with red carpet photos, behind-the-scenes reels, and lifestyle stories.
                </p>
                <button
                  onClick={() => handleCreateAccount('Instagram')}
                  className="px-6 py-2.5 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-black text-xs transition-all shadow-lg cursor-pointer"
                >
                  CREATE INSTAGRAM (@{player.firstName.toLowerCase()}{player.lastName.toLowerCase()})
                </button>
              </div>
            ) : (
              <>
            {/* INSTAGRAM STORIES BAR */}
            <div className="bg-black/60 border border-fuchsia-500/20 p-3 rounded-2xl flex items-center gap-4 overflow-x-auto no-scrollbar">
              {/* Player Story Bubble */}
              <div
                onClick={() => setShowInstaUploadModal(true)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-purple-600 flex items-center justify-center relative">
                  <img src={player.avatarUrl} alt={player.firstName} className="w-full h-full rounded-full object-cover border-2 border-black" />
                  <div className="absolute bottom-0 right-0 bg-fuchsia-500 text-black rounded-full p-0.5 shadow">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-300">Your Story</span>
              </div>

              {/* VIP NPC Stories */}
              {socialsState.instagramStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-purple-600 flex items-center justify-center">
                    <img src={story.authorAvatar} alt={story.authorName} className="w-full h-full rounded-full object-cover border-2 border-black" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 truncate w-14 text-center">{story.authorName}</span>
                </div>
              ))}
            </div>

            {/* INSTAGRAM SUB-NAVS */}
            <div className="flex items-center justify-between bg-black/60 p-3 rounded-2xl border border-fuchsia-500/20">
              <div className="flex items-center gap-2">
                {[
                  { id: 'FEED', label: 'Feed' },
                  { id: 'REELS', label: 'Reels' },
                  { id: 'GRID', label: 'Profile Grid' },
                  { id: 'EXPLORE', label: 'Explore' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setInstaSubTab(s.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      instaSubTab === s.id
                        ? 'bg-fuchsia-500 text-black font-black shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowInstaUploadModal(true)}
                className="px-4 py-2 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>UPLOAD PHOTO</span>
              </button>
            </div>

            {/* FEED SUB-TAB */}
            {instaSubTab === 'FEED' && (
              <div className="space-y-6 max-w-xl mx-auto">
                {socialsState.instagramPosts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs bg-black/40 rounded-3xl border border-white/5">
                    No Instagram photos posted yet. Click 'Upload Photo' to publish red carpet & lifestyle photos!
                  </div>
                ) : (
                  socialsState.instagramPosts.map((post) => (
                    <div key={post.id} className="rounded-3xl bg-black/80 border border-fuchsia-500/20 overflow-hidden space-y-3 shadow-2xl">
                      <div className="p-3 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <img src={player.avatarUrl} alt={player.firstName} className="w-8 h-8 rounded-full object-cover border border-fuchsia-400" />
                          <div>
                            <span className="text-xs font-black text-white block">{player.firstName} {player.lastName}</span>
                            <span className="text-[10px] text-fuchsia-300 font-bold">{post.location}</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 font-bold">
                          {post.category.replace('_', ' ')}
                        </span>
                      </div>
                      <img src={post.imageUrl} alt={post.caption} className="w-full h-80 object-cover" />
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-4 text-gray-300">
                          <Heart className="w-5 h-5 text-rose-500 cursor-pointer hover:scale-110 transition-all" />
                          <MessageCircle className="w-5 h-5 text-sky-400 cursor-pointer hover:scale-110 transition-all" />
                          <Send className="w-5 h-5 text-emerald-400 cursor-pointer hover:scale-110 transition-all" />
                        </div>
                        <span className="text-xs font-black text-white block">{post.likes.toLocaleString()} likes</span>
                        <p className="text-xs text-gray-300">
                          <strong className="text-white mr-2">{player.firstName.toLowerCase()}{player.lastName.toLowerCase()}</strong>
                          {post.caption}
                        </p>
                        <button
                          onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                          className="text-xs text-fuchsia-400 hover:underline font-bold cursor-pointer block pt-1"
                        >
                          View all {post.commentsCount.toLocaleString()} comments
                        </button>

                        {/* INSTAGRAM COMMENTS DRAWER */}
                        {expandedPostId === post.id && (
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2 bg-black/60 p-3 rounded-2xl">
                            <h5 className="text-[10px] font-black uppercase text-fuchsia-400 tracking-wider">
                              Instagram Comments
                            </h5>
                            {((socialsState.postComments[post.id] && socialsState.postComments[post.id].length > 0)
                              ? socialsState.postComments[post.id]
                              : SocialsService.generateNpcCommentsForPost(post.id, post.caption, 35, player)
                            ).map((comment) => (
                              <div key={comment.id} className="p-2 rounded-xl bg-white/5 flex items-start gap-2">
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                <div className="flex-1 min-w-0 text-xs">
                                  <span className="font-bold text-white mr-1.5">{comment.authorHandle}</span>
                                  <span className="text-gray-300">{comment.text}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* REELS SUB-TAB */}
            {instaSubTab === 'REELS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialsState.instagramReels.map((reel) => (
                  <div key={reel.id} className="rounded-3xl bg-black/80 border border-fuchsia-500/20 overflow-hidden relative group">
                    <img src={reel.videoThumbnail} alt={reel.title} className="w-full h-80 object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <span className="px-2 py-1 rounded-full bg-black/60 text-fuchsia-300 text-[10px] font-bold flex items-center gap-1">
                          <Play className="w-3 h-3 fill-fuchsia-300" /> {reel.durationSec}s
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white">{reel.title}</h4>
                        <p className="text-[10px] text-fuchsia-300 font-bold">{reel.audioTag}</p>
                        <div className="flex items-center gap-4 text-[11px] text-gray-300 pt-1">
                          <span>❤️ {reel.likes.toLocaleString()}</span>
                          <span>💬 {reel.commentsCount.toLocaleString()}</span>
                          <span>👁️ {reel.views.toLocaleString()} Views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROFILE GRID */}
            {instaSubTab === 'GRID' && (
              <div className="grid grid-cols-3 gap-2">
                {socialsState.instagramPosts.map((post) => (
                  <div key={post.id} className="aspect-square bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer">
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 text-white text-xs font-bold transition-all">
                      <span>❤️ {post.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. YOUTUBE STUDIO OVERHAUL TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'YOUTUBE' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {!socialsState.createdPlatforms.YouTube ? (
              <div className="p-6 rounded-3xl bg-red-950/30 border border-red-500/30 text-center space-y-3">
                <Play className="w-10 h-10 text-red-400 mx-auto" />
                <h2 className="text-lg font-black text-white">Create Official YouTube Channel</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Launch your video hub for trailers, vlogs, and behind-the-scenes content to build watch hours and subscribers.
                </p>
                <button
                  onClick={() => handleCreateAccount('YouTube')}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer"
                >
                  CREATE YOUTUBE CHANNEL (@{player.firstName.toLowerCase()}{player.lastName.toLowerCase()})
                </button>
              </div>
            ) : (
              <>
            {/* Header & Studio Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/60 via-red-900/20 to-black border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={player.avatarUrl} alt={player.firstName} className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shadow-2xl" />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-red-600 rounded-full text-white">
                    <Tv className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{player.firstName} {player.lastName}</h2>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/30">
                      YouTube Creator Studio
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Algorithm Status: <span className="text-red-400 font-bold">{socialsState.youtubeAlgorithmStatus || 'Observing New Creator'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowYtUploadModal(true)}
                  className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-2xl hover:scale-105 transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>UPLOAD NEW VIDEO</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs Bar */}
            <div className="flex border-b border-white/10 gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setYtSubTab('MY_VIDEOS')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  ytSubTab === 'MY_VIDEOS' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Uploaded Videos ({socialsState.youtubeVideos.length})</span>
              </button>

              <button
                onClick={() => setYtSubTab('MONETIZATION')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  ytSubTab === 'MONETIZATION' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Monetization & Partner Program</span>
                {socialsState.youtubeMonetizationStatus === 'APPROVED' ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ) : socialsState.youtubeMonetizationStatus === 'ELIGIBLE' ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : null}
              </button>

              <button
                onClick={() => setYtSubTab('NPC_CHANNELS')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  ytSubTab === 'NPC_CHANNELS' ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Hollywood Creator Ecosystem</span>
              </button>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-red-400" /> Subscribers
                </span>
                <p className="text-lg font-black text-white">{(socialsState.youtubeSubscribers || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">Goal: 1,000 Subs</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-amber-400" /> Watch Time
                </span>
                <p className="text-lg font-black text-amber-400">{(socialsState.youtubeWatchHours || 0).toLocaleString()} hrs</p>
                <p className="text-[10px] text-gray-500">Goal: 4,000 Watch Hours</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-blue-400" /> Total Views
                </span>
                <p className="text-lg font-black text-white">{(socialsState.youtubeTotalViews || 0).toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">Across all uploads</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" /> AdSense Status
                </span>
                <p className="text-sm font-black text-emerald-400">
                  {socialsState.youtubeMonetizationStatus === 'APPROVED' ? 'MONETIZED ($4.50 CPM)' : 'UNMONETIZED ($0)'}
                </p>
                <p className="text-[10px] text-gray-500">
                  {socialsState.youtubeMonetizationStatus === 'APPROVED' ? 'Active Partner' : 'Requirements Pending'}
                </p>
              </div>
            </div>

            {/* CHANNEL HEALTH & ALGORITHM BANNER */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 font-bold">Channel Health:</span>
                <span className="text-emerald-400 font-black">{socialsState.youtubeChannelHealth || 'Good Standing'}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 font-bold">Copyright Violations:</span>
                <span className="text-white font-bold">{socialsState.youtubeCopyrightStrikes || 0} Strikes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 font-bold">Community Guidelines:</span>
                <span className="text-emerald-400 font-bold">Clean</span>
              </div>
            </div>

            {/* ================= SUB-TAB 1: MY VIDEOS ================= */}
            {ytSubTab === 'MY_VIDEOS' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Uploaded Videos & Performance</h3>

                {socialsState.youtubeVideos.length === 0 ? (
                  <div className="p-10 text-center space-y-3 bg-black/40 rounded-3xl border border-white/10">
                    <Video className="w-8 h-8 text-red-500 mx-auto" />
                    <p className="text-sm font-bold text-white">No YouTube videos published yet.</p>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                      Publish official movie trailers, behind-the-scenes footage, vlogs, or red carpet interviews to build subscribers and reach 4,000 Watch Hours!
                    </p>
                    <button
                      onClick={() => setShowYtUploadModal(true)}
                      className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Upload First Video
                    </button>
                  </div>
                ) : (
                  socialsState.youtubeVideos.map((vid) => (
                    <div key={vid.id} className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-4 hover:border-red-500/30 transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-36 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                            <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 bg-black/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold">
                              {vid.duration}
                            </span>
                            {vid.isEvergreen && (
                              <span className="absolute top-1 left-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                <Flame className="w-2.5 h-2.5 fill-black" /> EVERGREEN
                              </span>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-black text-white">{vid.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold uppercase border border-red-500/20">
                                {vid.category}
                              </span>
                              <span className="text-[11px] text-gray-400">Week {vid.uploadWeek}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-gray-400 uppercase font-bold block">AdSense Earnings</span>
                          <span className={`text-base font-black ${vid.estimatedRevenue > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {vid.estimatedRevenue > 0 ? `+$${vid.estimatedRevenue.toLocaleString()}` : '$0 (Unmonetized)'}
                          </span>
                        </div>
                      </div>

                      {/* Extended Metrics Row */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-white/5 text-center text-xs">
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-[9px] text-gray-400 block font-bold">Views</span>
                          <span className="font-black text-white">{vid.views.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-[9px] text-gray-400 block font-bold">Watch Time</span>
                          <span className="font-black text-amber-400">{(vid.watchTimeHours || 0).toLocaleString()} hrs</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-[9px] text-gray-400 block font-bold">Retention</span>
                          <span className="font-black text-emerald-400">{vid.retentionPercent || 50}%</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-[9px] text-gray-400 block font-bold">CTR</span>
                          <span className="font-black text-blue-400">{vid.ctrPercent || 5.0}%</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-[9px] text-gray-400 block font-bold">Likes</span>
                          <span className="font-black text-rose-400">{vid.likes.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl">
                          <span className="text-[9px] text-gray-400 block font-bold">Subs Gained</span>
                          <span className="font-black text-purple-400">+{vid.subscribersGained || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ================= SUB-TAB 2: MONETIZATION ================= */}
            {ytSubTab === 'MONETIZATION' && (
              <div className="space-y-6">
                {/* Monetization Overview Card */}
                <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white">YouTube Partner Program</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Earn revenue from video advertisements and YouTube Premium subscriptions.
                      </p>
                    </div>

                    <div className="shrink-0">
                      {socialsState.youtubeMonetizationStatus === 'APPROVED' && (
                        <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> APPROVED & MONETIZED
                        </span>
                      )}
                      {socialsState.youtubeMonetizationStatus === 'UNDER_REVIEW' && (
                        <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black flex items-center gap-2">
                          <Sparkles className="w-4 h-4 animate-spin" /> APPLICATION UNDER REVIEW
                        </span>
                      )}
                      {socialsState.youtubeMonetizationStatus === 'ELIGIBLE' && (
                        <span className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-black flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> ELIGIBLE TO APPLY!
                        </span>
                      )}
                      {(socialsState.youtubeMonetizationStatus === 'NOT_ELIGIBLE' || socialsState.youtubeMonetizationStatus === 'REJECTED') && (
                        <span className="px-3 py-1.5 rounded-full bg-gray-800 text-gray-400 border border-white/10 text-xs font-black">
                          REQUIREMENTS NOT MET
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requirements Progress Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                    {/* Subs Requirement */}
                    <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-300">Subscribers Requirement</span>
                        <span className="text-white">
                          {(socialsState.youtubeSubscribers || 0).toLocaleString()} / 1,000
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100, ((socialsState.youtubeSubscribers || 0) / 1000) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {(socialsState.youtubeSubscribers || 0) >= 1000 ? '✅ Requirement Completed!' : `${(1000 - (socialsState.youtubeSubscribers || 0)).toLocaleString()} more subscribers needed`}
                      </p>
                    </div>

                    {/* Watch Hours Requirement */}
                    <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-300">Public Watch Hours (Last 365 Days)</span>
                        <span className="text-amber-400">
                          {(socialsState.youtubeWatchHours || 0).toLocaleString()} / 4,000 hrs
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100, ((socialsState.youtubeWatchHours || 0) / 4000) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {(socialsState.youtubeWatchHours || 0) >= 4000 ? '✅ Requirement Completed!' : `${(4000 - (socialsState.youtubeWatchHours || 0)).toLocaleString()} watch hours remaining`}
                      </p>
                    </div>
                  </div>

                  {/* Application Action Button */}
                  <div className="pt-4 border-t border-white/10 text-center">
                    {socialsState.youtubeMonetizationStatus === 'APPROVED' ? (
                      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        🎉 Monetization Active! All future video uploads automatically generate AdSense revenue based on audience view counts.
                      </div>
                    ) : socialsState.youtubeMonetizationStatus === 'UNDER_REVIEW' ? (
                      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        ⏳ Partner Program review in progress! Est. completion: {socialsState.youtubeReviewWeeksLeft || 2} in-game week(s).
                      </div>
                    ) : (
                      <button
                        onClick={handleApplyMonetization}
                        disabled={(socialsState.youtubeSubscribers || 0) < 1000 || (socialsState.youtubeWatchHours || 0) < 4000}
                        className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${
                          (socialsState.youtubeSubscribers || 0) >= 1000 && (socialsState.youtubeWatchHours || 0) >= 4000
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-2xl'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        APPLY FOR YOUTUBE MONETIZATION
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUB-TAB 3: NPC CHANNELS ================= */}
            {ytSubTab === 'NPC_CHANNELS' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Top Hollywood YouTube Creators & Media Outlets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(socialsState.npcYouTubeChannels || []).map((npc) => (
                    <div key={npc.id} className="p-4 rounded-3xl bg-black/60 border border-white/10 flex items-start gap-4">
                      <img src={npc.avatar} alt={npc.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-white">{npc.name}</h4>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-bold">
                            {npc.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {npc.subscribers.toLocaleString()} Subscribers
                        </p>
                        {npc.latestVideo && (
                          <div className="p-2.5 rounded-xl bg-white/5 mt-2 space-y-1">
                            <p className="text-[11px] font-bold text-gray-200 line-clamp-1">
                              {npc.latestVideo.title}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {npc.latestVideo.views.toLocaleString()} views • {npc.latestVideo.timeAgo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
              </>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. OFFICIAL WEBSITE PORTAL TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'OFFICIAL_WEBSITE' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Live Web Portal Preview */}
            <div className="p-6 rounded-3xl border border-blue-500/40 bg-black/80 backdrop-blur-md space-y-4 shadow-2xl">
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-blue-300 font-mono text-[11px] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>www.{player.firstName.toLowerCase()}{player.lastName.toLowerCase()}.com</span>
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <strong className="text-white">
                    {((player.fans || 50) * 8 + player.fameXp * 120 + releasedMovies.length * 350).toLocaleString()}
                  </strong> Visitors/Wk
                </span>
              </div>

              {/* Website Content */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <img src={player.avatarUrl} alt={player.firstName} className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow-lg" />
                  <div>
                    <h3 className="text-xl font-black text-white">{player.firstName} {player.lastName}</h3>
                    <p className="text-xs text-blue-300 font-bold uppercase">{player.country} • {player.personality} Actor</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Official Hollywood Web Portal (Custom Modern Domain)</p>
                  </div>
                </div>

                {/* Sections Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Film className="w-3 h-3 text-blue-400" /> Released Filmography
                    </span>
                    <span className="text-sm font-black text-white block">{releasedMovies.length} Feature Films</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Booked Productions
                    </span>
                    <span className="text-sm font-black text-white block">{bookedProjects.length} Active Contracts</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-300" /> Honors & Awards
                    </span>
                    <span className="text-sm font-black text-white block">{player.awardsWon} Trophies Won</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. OFFICIAL FAN CLUB TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'FAN_CLUB' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Fan Club Banner */}
            <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-10 h-10 text-rose-400 fill-rose-400/20" />
                  <div>
                    <h2 className="text-lg font-black text-white">
                      {repState.fanClub.isCreated ? repState.fanClub.name : 'Official Global Fan Society'}
                    </h2>
                    <p className="text-xs text-rose-300 font-bold">
                      {repState.fanClub.membersCount} Official Members • ${repState.fanClub.weeklyDuesRevenue.toLocaleString()}/wk Dues Income
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowFanPostModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>POST TO FAN CLUB</span>
                </button>
              </div>
            </div>

            {/* Fan Feed */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Fan Community Feed</h3>
              {socialsState.fanFeed.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={item.authorAvatar} alt={item.authorName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="text-xs font-black text-white block">{item.authorName}</span>
                        <span className="text-[10px] text-rose-400 font-mono font-bold">{item.membershipTier} MEMBER</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. SPONSORSHIPS & BRAND DEALS TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'SPONSORSHIPS' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-sm font-black uppercase text-emerald-400 tracking-wider flex items-center gap-2">
              <Handshake className="w-5 h-5" />
              <span>LUXURY SPONSORSHIP CONTRACTS</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialsState.sponsorshipDeals.map((deal) => (
                <div key={deal.id} className="p-5 rounded-3xl bg-black/70 border border-emerald-500/30 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={deal.brandLogo} alt={deal.brandName} className="w-10 h-10 rounded-xl object-cover border border-white/20" />
                      <div>
                        <h3 className="text-sm font-black text-white">{deal.brandName}</h3>
                        <span className="text-[10px] text-emerald-400 font-bold block">{deal.brandCategory}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                      deal.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {deal.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300">{deal.deliverable}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">Upfront Payout</span>
                      <span className="font-black text-emerald-400">${deal.lumpSumPayout.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">Weekly Royalties</span>
                      <span className="font-black text-emerald-400">${deal.weeklyPayout.toLocaleString()}/wk</span>
                    </div>
                  </div>

                  {deal.status === 'OFFER' && (
                    <button
                      onClick={() => handleAcceptSponsorship(deal)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all cursor-pointer shadow-lg hover:scale-105"
                    >
                      ACCEPT CONTRACT
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. PR WRITERS POOL TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'PR_WRITERS' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-sm font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
              <PenTool className="w-5 h-5" />
              <span>GHOSTWRITER & PR TEAMS</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialsState.writers.map((w) => {
                const meetsFame = (player.fameXp || 0) >= (w.minFame || 0);
                const meetsRoles = ((player.principalRolesCount || 0) + (player.leadRolesCount || 0)) >= (w.minLeadRoles || 0);
                const meetsCash = (player.money || 0) >= (w.weeklyCost || 250) * 2;
                const meetsAll = meetsFame && meetsRoles && meetsCash;

                return (
                  <div key={w.id} className={`p-5 rounded-3xl bg-black/70 border space-y-3 shadow-xl ${
                    w.hired ? 'border-amber-400 bg-amber-950/30' : 'border-white/10 hover:border-amber-500/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <img
                        src={w.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop'}
                        alt={w.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-amber-400/40 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-white truncate">{w.name}</h3>
                          {w.hired && <span className="text-[9px] px-2 py-0.5 rounded bg-amber-400 text-black font-black uppercase">ACTIVE RETAINER</span>}
                        </div>
                        <span className="text-[10px] text-amber-400 font-bold block">{w.agencyName || 'PR Media Agency'} • {w.tier} Tier</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">{w.bio}</p>

                    <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-2xl bg-white/5 border border-white/5 text-[11px]">
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold">Weekly Retainer</span>
                        <span className="font-black text-emerald-400">${w.weeklyCost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold">Auto Posts/Wk</span>
                        <span className="font-black text-white">{w.postsPerWeek}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block font-bold">Quality Boost</span>
                        <span className="font-black text-amber-400">+{w.qualityBoost}%</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px] text-gray-400 border-t border-white/5 pt-2">
                      <span className="font-bold text-gray-300 block uppercase tracking-wider">Client Requirements:</span>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={meetsFame ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          • Fame XP: {(w.minFame || 0).toLocaleString()}
                        </span>
                        <span className={meetsRoles ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          • Principal Roles: {w.minLeadRoles || 0}
                        </span>
                        <span className={meetsCash ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          • Liquid Cash: ${((w.weeklyCost || 250) * 2).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {!w.hired && (
                      <button
                        onClick={() => handlePitchWriter(w)}
                        className={`w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-lg ${
                          meetsAll
                            ? 'bg-amber-400 hover:bg-amber-300 text-black hover:scale-[1.02]'
                            : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        SUBMIT RETAINER PROPOSAL
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 8. ANALYTICS DASHBOARD TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'ANALYTICS' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-sm font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>SOCIAL MEDIA ANALYTICS DASHBOARD</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-indigo-500/20">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Followers</span>
                <span className="text-lg font-black text-emerald-400">{totalFollowersAll.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-indigo-500/20">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Weekly Impressions</span>
                <span className="text-lg font-black text-sky-400">{(totalFollowersAll * 14 + 2500).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-indigo-500/20">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Engagement Rate</span>
                <span className="text-lg font-black text-amber-400">4.8%</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-indigo-500/20">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Top Platform</span>
                <span className="text-lg font-black text-fuchsia-400">𝕏 / Twitter</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 9. MESSAGES & DIRECT NOTICES TAB */}
        {/* ============================================================ */}
        {activeNavTab === 'MESSAGES' && (
          <div className="space-y-3 max-w-4xl mx-auto">
            <h2 className="text-sm font-black uppercase text-sky-400 tracking-wider flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5" />
              <span>DIRECT MESSAGES & BRAND NOTICES</span>
            </h2>

            {socialsState.messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-start gap-3">
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-10 h-10 rounded-full object-cover" />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{msg.senderName} ({msg.senderHandle})</span>
                    <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-300">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POST TWEET MODAL */}
      {showTweetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">COMPOSE TWEET</h3>
              <button onClick={() => setShowTweetModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <textarea
              rows={4}
              placeholder="What's happening on set today?"
              value={tweetInput}
              onChange={(e) => setTweetInput(e.target.value)}
              className="w-full p-3 rounded-2xl bg-black/60 border border-white/20 text-xs text-white outline-none focus:border-sky-400"
            />
            <button
              onClick={handlePostTweet}
              className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs transition-all cursor-pointer"
            >
              PUBLISH TWEET
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD INSTAGRAM PHOTO MODAL */}
      {showInstaUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-fuchsia-500/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">UPLOAD INSTAGRAM PHOTO</h3>
              <button onClick={() => setShowInstaUploadModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Category</label>
                <select
                  value={instaCategory}
                  onChange={(e) => setInstaCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white outline-none"
                >
                  <option value="MOVIE_PREMIERE">Movie Premiere</option>
                  <option value="BEHIND_SCENES">Behind The Scenes</option>
                  <option value="RED_CARPET">Red Carpet Gala</option>
                  <option value="AWARD_NIGHT">Award Night</option>
                  <option value="LUXURY_LIFESTYLE">Luxury Lifestyle</option>
                  <option value="DAILY_VLOG">Daily Vlog</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Caption</label>
                <textarea
                  rows={3}
                  placeholder="Write a caption..."
                  value={instaCaption}
                  onChange={(e) => setInstaCaption(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-black/60 border border-white/20 text-xs text-white outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleUploadInstaPhoto}
              className="w-full py-3 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-black text-xs transition-all cursor-pointer"
            >
              SHARE PHOTO
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD YOUTUBE VIDEO MODAL */}
      {showYtUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">UPLOAD YOUTUBE VIDEO</h3>
              <button onClick={() => setShowYtUploadModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Video Title</label>
                <input
                  type="text"
                  placeholder="e.g. Official Movie Teaser Trailer"
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-bold mb-1">Category</label>
                <select
                  value={ytCategory}
                  onChange={(e) => setYtCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white outline-none"
                >
                  <option value="TRAILER">Teaser / Trailer</option>
                  <option value="VLOG">Daily Vlog</option>
                  <option value="INTERVIEW">Press Interview</option>
                  <option value="BEHIND_SCENES">Behind The Scenes</option>
                  <option value="LIVESTREAM">Fan Livestream</option>
                  <option value="AWARD_SPEECH">Award Acceptance Speech</option>
                  <option value="ANNOUNCEMENT">Studio Announcement</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleUploadYtVideo}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all cursor-pointer"
            >
              PUBLISH VIDEO
            </button>
          </div>
        </div>
      )}

      {/* STORY MODAL */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-fuchsia-500/40 p-4 rounded-3xl max-w-sm w-full space-y-3 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <img src={activeStory.authorAvatar} alt={activeStory.authorName} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-xs font-bold text-white">{activeStory.authorName}</span>
              </div>
              <button onClick={() => setActiveStory(null)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <img src={activeStory.mediaUrl} alt={activeStory.caption} className="w-full h-80 object-cover rounded-2xl" />
            <p className="text-xs text-gray-200 text-center font-medium">{activeStory.caption}</p>
          </div>
        </div>
      )}

      {/* NPC PROFILE MODAL */}
      {selectedNpcProfile && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 animate-fadeIn">
          <div className="bg-gradient-to-b from-slate-900 via-[#0B0F19] to-black border-2 border-sky-500/40 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Header Banner */}
            <div className="h-28 bg-gradient-to-r from-sky-600 via-purple-600 to-indigo-800 relative p-4 flex items-start justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 text-sky-200 px-3 py-1 rounded-full border border-white/20">
                {selectedNpcProfile.category}
              </span>
              <button
                onClick={() => setSelectedNpcProfile(null)}
                className="p-1.5 rounded-full bg-black/60 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-4 pt-0 relative flex-1 overflow-y-auto space-y-4">
              <div className="flex justify-between items-end -mt-10">
                <img
                  src={selectedNpcProfile.avatar}
                  alt={selectedNpcProfile.name}
                  className="w-20 h-20 rounded-full border-4 border-slate-900 object-cover shadow-2xl"
                />
                <button
                  onClick={() =>
                    setSelectedNpcProfile((prev) =>
                      prev ? { ...prev, isFollowing: !prev.isFollowing } : null
                    )
                  }
                  className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedNpcProfile.isFollowing
                      ? 'bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:text-red-300'
                      : 'bg-sky-500 hover:bg-sky-400 text-black shadow-lg shadow-sky-500/20'
                  }`}
                >
                  {selectedNpcProfile.isFollowing ? (
                    <>
                      <Check className="w-4 h-4" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Follow
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-1.5">
                  {selectedNpcProfile.name}
                  <BadgeCheck className="w-5 h-5 text-sky-400 fill-sky-400/20" />
                </h3>
                <span className="text-xs text-gray-400 font-mono">{selectedNpcProfile.handle}</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
                {selectedNpcProfile.bio}
              </p>

              <div className="flex gap-6 text-xs text-gray-300 py-1 border-y border-white/10">
                <div>
                  <span className="font-black text-white">{selectedNpcProfile.followers.toLocaleString()}</span>{' '}
                  <span className="text-gray-400">Followers</span>
                </div>
                <div>
                  <span className="font-black text-white">{selectedNpcProfile.following.toLocaleString()}</span>{' '}
                  <span className="text-gray-400">Following</span>
                </div>
              </div>

              {/* Recent NPC Feed Posts */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-sky-400" /> Recent Posts & Reviews ({selectedNpcProfile.posts.length})
                </h4>

                <div className="space-y-2.5">
                  {selectedNpcProfile.posts.map((post) => (
                    <div key={post.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="font-bold text-sky-300">{post.authorHandle}</span>
                        <span>{post.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed">{post.text}</p>
                      <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400" /> {post.likes.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Repeat className="w-3 h-3 text-emerald-400" /> {post.shares.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-sky-400" /> {post.comments.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
