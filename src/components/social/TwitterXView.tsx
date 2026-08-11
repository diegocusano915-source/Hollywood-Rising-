/**
 * HOLLYWOOD RISING - TWITTER/X REBUILD (real X-style)
 * For You = player feed + writer posts · The Scene = NPC feed
 * Real post cards, profile, trends (real events), search, Premium, Creator Studio, Writers.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, PremiumService } from '../../services/socialsService';
import {
  ArrowLeft, Home, Search, Bell, Mail, PenTool, Heart, Repeat2, MessageCircle, BarChart2, Bookmark,
  Share, MoreHorizontal, Image as ImageIcon, Star, TrendingUp, BadgeCheck, Crown,
} from 'lucide-react';
import { PremiumPanel, WritersPanel, CreatorStudioPanel } from './HubPanels';

const TICK_STYLE: Record<string, string> = {
  BLUE: 'bg-sky-500',
  GOLD: 'bg-amber-400',
  GRAY: 'bg-gray-300',
  NONE: 'bg-transparent',
};

export const TwitterXView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, settings, saveData, updateSave, releasedMovies } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'FOR_YOU' | 'SCENE'>('FOR_YOU');
  const [subView, setSubView] = useState<'HOME' | 'PROFILE' | 'TRENDS' | 'SEARCH' | 'PREMIUM' | 'CREATOR' | 'WRITERS'>('HOME');
  const [draft, setDraft] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [fb, setFb] = useState<string | null>(null);

  const theme = settings.theme || 'Hollywood Gold';
  const handle = `@${(player.firstName || 'actor').toLowerCase()}${(player.lastName || '').toLowerCase()}`;
  const playerName = `${player.firstName} ${player.lastName}`;
  const premium = state.premium || { tier: 'none' as const };
  const tick = PremiumService.tickName(state);

  const playerPosts = state.playerPosts.Twitter || [];
  const [npcFeed, setNpcFeed] = useState<any[]>(() =>
    SocialsService.generateNpcPostsBatch('Twitter', 20, {
      playerName: `${player.firstName} ${player.lastName}`,
      releasedMovies,
      fans: player.fans,
      fameXp: player.fameXp,
    })
  );
  const npcPosts = npcFeed;
  const boost = PremiumService.boostFor(state);

  const publish = () => {
    if (!draft.trim()) return;
    const maxLen = premium.tier !== 'none' ? 500 : 280;
    const text = draft.trim().slice(0, maxLen);
    const handleClean = handle;
    const post = {
      id: `tw_${Date.now()}`,
      authorName: playerName,
      authorHandle: handleClean,
      authorAvatar: player.avatarUrl,
      platform: 'Twitter' as const,
      tab: 'PLAYER_FEED' as const,
      text,
      likes: 0,
      comments: 0,
      retweets: 0,
      shares: 0,
      timestamp: 'Just now',
      isPlayer: true,
      isNpc: false,
      sentiment: 'Positive' as const,
    };
    state.playerPosts.Twitter = [post, ...playerPosts];
    SocialsService.saveState(state);
    setState({ ...state });
    setDraft('');
    setFb('Tweet posted! (+0 likes — new accounts start small, keep posting)');
    setTimeout(() => setFb(null), 3500);
  };

  const engage = (id: string, kind: 'like' | 'repost' | 'bookmark') => {
    const arr = state.playerPosts.Twitter.map((p) => {
      if (p.id !== id) return p;
      if (kind === 'like') return { ...p, likes: (p.likes || 0) + 1 };
      if (kind === 'repost') return { ...p, retweets: (p.retweets || 0) + 1 };
      return p;
    });
    state.playerPosts.Twitter = arr;
    SocialsService.saveState(state);
    setState({ ...state });
  };

  const feedPosts = tab === 'FOR_YOU' ? playerPosts : npcPosts;
  const trends = (state.trendingTopics || []).slice(0, 8);

  const PostCard: React.FC<{ post: any }> = ({ post }) => {
    const isPlayer = !!post.isPlayer;
    return (
      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
        <div className="flex items-center gap-2.5">
          <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover border border-white/20" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white truncate">{post.authorName}</span>
              {isPlayer && tick !== 'NONE' && (
                <span className={`w-4 h-4 rounded-full flex items-center justify-center ${TICK_STYLE[tick]}`}>
                  <BadgeCheck className="w-3 h-3 text-white" />
                </span>
              )}
              {post.generatedByWriter && <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 font-black">✍️ WRITER</span>}
            </div>
            <p className="text-[10px] text-gray-500">{post.authorHandle} · {post.timestamp}</p>
          </div>
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </div>
        <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">{post.text}</p>
        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-gray-500 max-w-md">
          <button onClick={() => { setExpandedPost(expandedPost === post.id ? null : post.id); }} className="flex items-center gap-1 cursor-pointer hover:text-sky-400">
            <MessageCircle className="w-3.5 h-3.5" /> {post.comments || 0}
          </button>
          <button onClick={() => engage(post.id, 'repost')} className="flex items-center gap-1 cursor-pointer hover:text-emerald-400">
            <Repeat2 className="w-3.5 h-3.5" /> {post.retweets || 0}
          </button>
          <button onClick={() => engage(post.id, 'like')} className="flex items-center gap-1 cursor-pointer hover:text-rose-400">
            <Heart className="w-3.5 h-3.5" /> {post.likes || 0}
          </button>
          <span className="flex items-center gap-1"><BarChart2 className="w-3.5 h-3.5" /> {Math.max(10, Math.floor((post.likes || 0) * 3))}</span>
          <button onClick={() => engage(post.id, 'bookmark')} className="cursor-pointer hover:text-amber-400"><Bookmark className="w-3.5 h-3.5" /></button>
          <button className="cursor-pointer hover:text-sky-400"><Share className="w-3.5 h-3.5" /></button>
        </div>
        {expandedPost === post.id && (
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-gray-400">
            💬 Comments (real NPCs react to your posts based on your fame)
          </div>
        )}
      </div>
    );
  };

  const BottomNav = (
    <div className="grid grid-cols-5 gap-1 pt-2 border-t border-white/10">
      {([['HOME', Home], ['SEARCH', Search], ['CREATOR', BarChart2], ['PREMIUM', Crown], ['PROFILE', Star]] as const).map(([id, Icon]) => (
        <button key={id} onClick={() => setSubView(id)} className={`flex flex-col items-center py-1.5 rounded-xl cursor-pointer ${subView === id ? 'text-amber-400' : 'text-gray-500 hover:text-white'}`}>
          <Icon className="w-4 h-4" />
          <span className="text-[8px] font-black">{id === 'CREATOR' ? 'STUDIO' : id}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 text-white select-none pb-14">
      {fb && <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-[11px] font-bold">{fb}</div>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black tracking-widest">𝕏 TWITTER</span>
          {tick !== 'NONE' && <span className={`w-5 h-5 rounded-full flex items-center justify-center ${TICK_STYLE[tick]}`}><BadgeCheck className="w-3.5 h-3.5 text-white" /></span>}
        </div>
        <Bell className="w-5 h-5 text-gray-500" />
      </div>

      {subView === 'HOME' && (
        <>
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setTab('FOR_YOU')} className={`py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer ${tab === 'FOR_YOU' ? 'bg-amber-500 text-black' : 'bg-black/40 text-gray-400 border border-white/10'}`}>For You</button>
            <button onClick={() => setTab('SCENE')} className={`py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer ${tab === 'SCENE' ? 'bg-amber-500 text-black' : 'bg-black/40 text-gray-400 border border-white/10'}`}>The Scene</button>
          </div>
          <p className="text-[9px] text-gray-500 text-center">
            {tab === 'FOR_YOU' ? 'For You = your posts + writer posts' : 'The Scene = all NPC posts (actors, studios, bloggers, fans)'}
          </p>

          {/* Composer */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="What's happening?" className="w-full bg-transparent text-xs text-white outline-none placeholder-gray-500 resize-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <ImageIcon className="w-4 h-4" />
                <span className="text-[9px]">{premium.tier !== 'none' ? '500' : '280'} char max</span>
              </div>
              <button onClick={publish} className="px-4 py-1.5 rounded-full bg-sky-500 text-white text-[10px] font-black cursor-pointer">Post</button>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-3">
            {feedPosts.length === 0 && <p className="text-center text-xs text-gray-500 py-6">Nothing here yet. {tab === 'FOR_YOU' ? 'Post something!' : 'NPCs are quiet this week.'}</p>}
            {feedPosts.slice(0, 30).map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </>
      )}

      {subView === 'SEARCH' && (
        <div className="space-y-3">
          <input placeholder="Search posts, people, studios..." className="w-full px-4 py-2.5 rounded-2xl bg-black/50 border border-white/20 text-xs outline-none" />
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <h4 className="text-xs font-black text-gray-200 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Trends (real events only)</h4>
            {trends.map((t, i) => <p key={i} className="text-[11px] text-gray-300 font-bold">{t}</p>)}
            {trends.length === 0 && <p className="text-[10px] text-gray-500">No trends yet — release a movie, win an award, or get famous!</p>}
          </div>
        </div>
      )}

      {subView === 'PROFILE' && (
        <div className="space-y-3">
          {/* Banner */}
          <div className="h-24 rounded-2xl bg-gradient-to-r from-amber-500/40 via-purple-500/40 to-sky-500/40 border border-white/10 relative">
            <img src={player.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-black absolute -bottom-8 left-4" />
          </div>
          <div className="pt-8 space-y-2">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black">{playerName}</h3>
              {tick !== 'NONE' && <span className={`w-5 h-5 rounded-full flex items-center justify-center ${TICK_STYLE[tick]}`}><BadgeCheck className="w-3.5 h-3.5 text-white" /></span>}
            </div>
            <p className="text-[11px] text-gray-500">{handle}</p>
            <p className="text-[11px] text-gray-300">Actor · {player.city}, {player.country} · Joined W{player.dateWeek}, {player.dateYear}</p>
            <div className="flex gap-4 text-[11px] font-bold">
              <span className="text-gray-300">{playerPosts.length} <span className="text-gray-500 font-normal">Posts</span></span>
              <span className="text-gray-300">{(state.followers.Twitter || 0).toLocaleString()} <span className="text-gray-500 font-normal">Followers</span></span>
              <span className="text-gray-300">{(state.following.Twitter || 0).toLocaleString()} <span className="text-gray-500 font-normal">Following</span></span>
            </div>
          </div>
          {/* Profile tabs */}
          <div className="grid grid-cols-4 gap-1 text-[9px] font-black text-gray-400 border-b border-white/10 pb-1">
            {['Posts', 'Replies', 'Media', 'Likes'].map((t) => <span key={t} className="text-center pb-1 border-b-2 border-transparent">{t}</span>)}
          </div>
          <div className="space-y-2">{playerPosts.slice(0, 15).map((p) => <PostCard key={p.id} post={p} />)}</div>
        </div>
      )}

      {subView === 'PREMIUM' && <PremiumPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}
      {subView === 'CREATOR' && <CreatorStudioPanel state={state} />}
      {subView === 'WRITERS' && <WritersPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}

      {BottomNav}
    </div>
  );
};
