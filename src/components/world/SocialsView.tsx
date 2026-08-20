/**
 * HOLLYWOOD RISING - SOCIAL MEDIA HUB (V2)
 * World scene -> Socials hub -> grid of 7 platforms -> pick one -> opens its interface.
 * All platforms start at 0 followers. All content tied to real game events only.
 */
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService } from '../../services/socialsService';
import { THEMES } from '../../theme/colors';
import { ArrowLeft, X, Star, Instagram as InstaIcon, Youtube, Facebook, Briefcase, MessageSquare as RedditIcon, Send, Crown, Sparkles, Lock, UserPlus } from 'lucide-react';
import { TwitterXView } from '../social/TwitterXView';
import { InstagramView } from '../social/InstagramView';
import { YouTubeView } from '../social/YouTubeView';
import { FacebookView } from '../social/FacebookView';
import { MarqueeView } from '../social/MarqueeView';
import { RedditView } from '../social/RedditView';
import { TelegramView } from '../social/TelegramView';

interface SocialsViewProps {
  onBack: () => void;
}

type PlatformId = 'twitter' | 'instagram' | 'youtube' | 'facebook' | 'marquee' | 'reddit' | 'telegram';

export const SocialsView: React.FC<SocialsViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];
  const [selected, setSelected] = useState<PlatformId | null>(null);
  const [creating, setCreating] = useState<PlatformId | null>(null);
  const [handleInput, setHandleInput] = useState('');
  const [createMsg, setCreateMsg] = useState<string | null>(null);
  const [socialsState, setSocialsState] = useState(() => SocialsService.getState());

  // Refresh on mount + when player changes (weekly updates flow through)
  useEffect(() => {
    setSocialsState({ ...SocialsService.getState() });
  }, [player.dateWeek, player.fameXp, player.fans]);

  const defaultHandle = `@${player.firstName.toLowerCase()}${player.lastName.toLowerCase()}`;

  const platforms: { id: PlatformId; name: string; tagline: string; icon: React.ReactNode; color: string; followers: string }[] = [
    { id: 'twitter', name: 'Twitter / X', tagline: 'Real-time buzz', icon: <X className="w-8 h-8" />, color: 'from-sky-500/20 to-black border-sky-500/40', followers: 'Followers' },
    { id: 'instagram', name: 'Instagram', tagline: 'Photos & stories', icon: <InstaIcon className="w-8 h-8" />, color: 'from-rose-500/20 to-black border-rose-500/40', followers: 'Followers' },
    { id: 'youtube', name: 'YouTube', tagline: 'Videos & Shorts', icon: <Youtube className="w-8 h-8" />, color: 'from-red-500/20 to-black border-red-500/40', followers: 'Subscribers' },
    { id: 'facebook', name: 'Facebook', tagline: 'Friends & groups', icon: <Facebook className="w-8 h-8" />, color: 'from-sky-500/20 to-black border-sky-500/40', followers: 'Friends' },
    { id: 'marquee', name: 'The Marquee', tagline: 'Professional network', icon: <Briefcase className="w-8 h-8" />, color: 'from-indigo-500/20 to-black border-indigo-500/40', followers: 'Connections' },
    { id: 'reddit', name: 'Reddit', tagline: 'Communities & karma', icon: <RedditIcon className="w-8 h-8" />, color: 'from-orange-500/20 to-black border-orange-500/40', followers: 'Karma' },
    { id: 'telegram', name: 'Telegram', tagline: 'Channels & stories', icon: <Send className="w-8 h-8" />, color: 'from-sky-400/20 to-black border-sky-400/40', followers: 'Channel subs' },
  ];

  const counts: Record<PlatformId, string> = {
    twitter: (socialsState.followers.Twitter || 0).toLocaleString(),
    instagram: (socialsState.followers.Instagram || 0).toLocaleString(),
    youtube: (socialsState.youtubeSubscribers || 0).toLocaleString(),
    facebook: (socialsState.facebookFriends || 0).toLocaleString(),
    marquee: (socialsState.marqueeConnections || 0).toLocaleString(),
    reddit: (socialsState.redditKarma || 0).toLocaleString(),
    telegram: (socialsState.telegramChannelSubs || 0).toLocaleString(),
  };

  const premiumTier = socialsState.premium?.tier || 'none';

  const openPlatform = (pid: PlatformId) => {
    if (SocialsService.hasAccount(pid, player)) {
      setSelected(pid);
    } else {
      setCreating(pid);
      setHandleInput(defaultHandle);
      setCreateMsg(null);
    }
  };

  const confirmCreate = () => {
    if (!creating) return;
    const res = SocialsService.createAccount(creating, handleInput, player);
    setCreateMsg(res.message);
    if (res.success) {
      setSocialsState({ ...SocialsService.getState() });
      const opened = creating;
      setCreating(null);
      setSelected(opened);
    }
  };

  const platformViews: Record<PlatformId, React.ReactNode> = {
    twitter: <TwitterXView onBack={() => setSelected(null)} />,
    instagram: <InstagramView onBack={() => setSelected(null)} />,
    youtube: <YouTubeView onBack={() => setSelected(null)} />,
    facebook: <FacebookView onBack={() => setSelected(null)} />,
    marquee: <MarqueeView onBack={() => setSelected(null)} />,
    reddit: <RedditView onBack={() => setSelected(null)} />,
    telegram: <TelegramView onBack={() => setSelected(null)} />,
  };

  if (selected) return <>{platformViews[selected]}</>;

  // ---------- ACCOUNT CREATION SCREEN ----------
  if (creating) {
    const meta = platforms.find((p) => p.id === creating)!;
    return (
      <div className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-28 space-y-4" style={{ backgroundColor: theme.background }}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCreating(null)}
            className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to Hub</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Create Account</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className={`w-full max-w-sm p-6 rounded-3xl border bg-gradient-to-br ${meta.color} space-y-4 shadow-2xl backdrop-blur-md`}>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-amber-300">{meta.icon}</div>
              <h2 className="text-lg font-black text-white">{meta.name}</h2>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                You don't have a {meta.name} account yet. Choose your account name to open your profile — followers, posts and writers are tracked separately per platform.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account name</label>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder={defaultHandle}
                maxLength={24}
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-white text-sm font-bold outline-none focus:border-amber-400"
              />
              <p className="text-[9px] text-gray-500">3–24 characters. This is how fans will find you on {meta.name}.</p>
            </div>

            {createMsg && <p className="text-[11px] text-amber-200 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-center">{createMsg}</p>}

            <button
              onClick={confirmCreate}
              className="w-full py-3.5 rounded-2xl font-black text-sm bg-amber-400 text-black hover:scale-[1.01] active:scale-0.98 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              CREATE {meta.name.toUpperCase()} ACCOUNT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Social Media Hub</span>
        </div>
      </div>

      {/* Banner */}
      <div className="p-4 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-black/70 to-black/70 space-y-1">
        <h2 className="text-sm font-black uppercase tracking-wider text-amber-200">Your Social Empire</h2>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-white">Create a separate account</strong> on each platform — your own handle, your own
          followers, your own writer. Platforms grow only from their own activity; accounts you never open stay dark.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {premiumTier !== 'none' && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black flex items-center gap-1">
              <Crown className="w-3 h-3" /> PREMIUM ACTIVE
            </span>
          )}
          <span className="text-[9px] text-gray-500 font-bold">Tap a platform to open or create your account</span>
        </div>
      </div>

      {/* Platform Grid — 3 per row (locked until you create an account) */}
      <div className="grid grid-cols-3 gap-2.5">
        {platforms.map((p) => {
          const created = SocialsService.hasAccount(p.id, player);
          return (
            <button
              key={p.id}
              onClick={() => openPlatform(p.id)}
              className={`p-3 rounded-2xl border bg-gradient-to-br ${p.color} text-left transition-all cursor-pointer hover:scale-[1.03] aspect-square flex flex-col justify-between shadow-lg backdrop-blur-md ${created ? '' : 'opacity-80'}`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-amber-300">{p.icon}</div>
                {!created && (
                  <span className="text-[7px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                    <Lock className="w-2 h-2" /> SET UP
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-black text-white leading-tight">{p.name}</h3>
                <p className="text-[8px] text-gray-400">{created ? SocialsService.getHandle(p.id, player) : p.tagline}</p>
                <p className="text-[10px] font-black text-emerald-400">
                  {created ? counts[p.id] : '—'} <span className="text-[8px] text-gray-500 font-normal">{p.followers}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 8th slot: Premium overview card */}
      <button
        onClick={() => openPlatform('twitter')}
        className="p-3 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-black text-left transition-all cursor-pointer hover:scale-[1.02] flex items-center gap-3"
      >
        <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40"><Crown className="w-6 h-6 text-amber-400" /></div>
        <div className="flex-1">
          <h3 className="text-xs font-black text-white">Premium + Writers + Creator Studio</h3>
          <p className="text-[9px] text-gray-400">Inside every platform — boost posts, hire a separate writer per platform, earn ad revenue.</p>
        </div>
        <span className="text-[10px] text-amber-300 font-black">OPEN →</span>
      </button>
    </div>
  );
};
