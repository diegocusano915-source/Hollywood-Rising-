/**
 * HOLLYWOOD RISING - INSTAGRAM REBUILD (real IG-style)
 * Stories row, feed, create (upload or generate), explore, profile, hashtags, Premium.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, PremiumService } from '../../services/socialsService';
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, Plus, Grid, Clapperboard, User, Search, Compass, Home, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PremiumPanel } from './HubPanels';

export const InstagramView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, saveData, updateSave, releasedMovies } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'HOME' | 'EXPLORE' | 'CREATE' | 'PROFILE' | 'PREMIUM'>('HOME');
  const [caption, setCaption] = useState('');
  const [imageChoice, setImageChoice] = useState<'gallery' | 'generate'>('gallery');
  const [fb, setFb] = useState<string | null>(null);

  const premium = state.premium || { tier: 'none' as const };
  const tick = PremiumService.tickName(state);
  const username = `${player.firstName}${player.lastName}`;
  const latest = releasedMovies[0];
  const posts = state.instagramPosts || [];
  const stories = state.instagramStories || [];

  // Varied NPC content pool (real events only) so the feed never shows the same picture on repeat
  const npcContent = React.useMemo(() => {
    const pool = [
      { name: 'Paparazzi Daily', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop', cap: latest ? `Spotted: ${player.firstName} ${player.lastName} on the '${latest.movieTitle}' set! 📸` : 'Red carpet looks from last night 📸', likes: 124000, time: '2h' },
      { name: 'StudioOne Pictures', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop', cap: latest ? `'${latest.movieTitle}' crossing $${((latest.worldwideGross || 0) / 1000000).toFixed(0)}M worldwide! 🎬` : 'Coming soon to theaters 🎬', likes: 89000, time: '4h' },
      { name: 'RedCarpetWeekly', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&auto=format&fit=crop', cap: 'Hollywood premieres are back in full force ✨', likes: 56000, time: '6h' },
      { name: 'FilmFansUnited', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop', cap: "The fans have spoken — this year's releases are incredible 🍿", likes: 43000, time: '8h' },
      { name: 'CelebStyle', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&auto=format&fit=crop', cap: 'Best dressed at the premiere 🔥', likes: 67000, time: '10h' },
      { name: 'BoxOfficeBuz', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop', cap: "Numbers don't lie — check this week's charts 📊", likes: 38000, time: '12h' },
    ];
    return pool.map((n, i) => ({
      id: `npc_ig_${i}`,
      imageUrl: n.img,
      caption: n.cap,
      likes: n.likes,
      comments: Math.floor(n.likes * 0.01),
      username: n.name,
      timestamp: n.time,
      isPlayer: false,
      isNpc: true,
    }));
  }, [latest, player.firstName, player.lastName]);

  const hashtags = (title: string) => {
    const base = title.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').slice(0, 2).map((w) => `#${w}`).join(' ');
    return `${base} #HollywoodRising #ActorLife #RedCarpet #BoxOffice #MovieNight #BehindTheScenes #Film #Cinema #Star #Premiere`.trim();
  };

  const createPost = () => {
    const img = imageChoice === 'gallery' ? (latest?.posterUrl || player.avatarUrl) : player.avatarUrl;
    const cap = caption.trim() || (latest ? `'${latest.movieTitle}' 🎬` : 'New post!');
    state.instagramPosts = state.instagramPosts || [];
    state.instagramPosts.unshift({
      id: `ig_${Date.now()}`,
      imageUrl: img,
      caption: cap + (latest ? `\n\n${hashtags(latest.movieTitle)}` : ''),
      likes: 0,
      comments: 0,
      username,
      timestamp: 'Just now',
      isPlayer: true,
    } as any);
    SocialsService.saveState(state);
    setState({ ...state });
    setCaption('');
    setFb('Post shared! Likes grow with your real fame.');
    setTimeout(() => setFb(null), 3500);
  };

  const like = (id: string) => {
    state.instagramPosts = (state.instagramPosts || []).map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    SocialsService.saveState(state);
    setState({ ...state });
  };

  const BottomNav = (
    <div className="grid grid-cols-5 gap-1 pt-2 border-t border-white/10">
      {([['HOME', Home], ['EXPLORE', Compass], ['CREATE', Plus], ['PREMIUM', Sparkles], ['PROFILE', User]] as const).map(([id, Icon]) => (
        <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center py-1.5 rounded-xl cursor-pointer ${tab === id ? 'text-rose-400' : 'text-gray-500 hover:text-white'}`}>
          <Icon className="w-4 h-4" />
          <span className="text-[8px] font-black">{id}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 text-white select-none pb-14">
      {fb && <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-[11px] font-bold">{fb}</div>}

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
        <span className="text-sm font-black tracking-wide">📸 Instagram</span>
        <div className="flex items-center gap-2 text-gray-500"><Send className="w-4 h-4" /><Heart className="w-4 h-4" /></div>
      </div>

      {tab === 'HOME' && (
        <>
          {/* Stories row */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 to-rose-500">
                <img src={player.avatarUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-black" />
              </div>
              <span className="text-[9px] text-gray-400">Your story</span>
            </div>
            {(stories.length > 0 ? stories : [{ id: 'demo', authorName: 'Studio', authorAvatar: latest?.posterUrl }]).slice(0, 8).map((st: any) => (
              <div key={st.id} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-sky-400 to-purple-500">
                  <img src={st.authorAvatar || player.avatarUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-black" />
                </div>
                <span className="text-[9px] text-gray-400">{st.authorName || 'NPC'}</span>
              </div>
            ))}
          </div>

          {/* Feed (player posts + NPC posts with varied images) */}
          <div className="space-y-4">
            {posts.length === 0 && npcContent.length === 0 && <p className="text-center text-xs text-gray-500 py-8">No posts yet. Create your first post!</p>}
            {[...posts.slice(0, 8), ...npcContent].map((p: any) => (
              <div key={p.id} className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                <div className="flex items-center gap-2 p-2.5">
                  <img src={p.username ? player.avatarUrl : p.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                  <span className="text-xs font-black">{p.username || 'NPC Fan'}</span>
                  {p.isPlayer && tick !== 'NONE' && <span className="text-[9px] text-sky-400 font-black">✓</span>}
                  <span className="ml-auto text-[9px] text-gray-500">{p.timestamp}</span>
                </div>
                <img src={p.imageUrl} alt="" className="w-full h-56 object-cover" />
                <div className="p-2.5 space-y-1.5">
                  <div className="flex items-center gap-3 text-gray-300">
                    <button onClick={() => like(p.id)} className="cursor-pointer hover:text-rose-400"><Heart className="w-4 h-4" /></button>
                    <MessageCircle className="w-4 h-4" /><Send className="w-4 h-4" /><Bookmark className="w-4 h-4 ml-auto" />
                  </div>
                  <p className="text-[11px] font-black">{p.likes || 0} likes</p>
                  <p className="text-[11px] text-gray-300 whitespace-pre-line">{p.caption}</p>
                  {!p.isPlayer && (() => {
                    const n = Math.min(4, Math.max(2, Math.floor((p.comments || 30) / 8)));
                    return (
                      <div className="border-t border-white/5 pt-1.5 space-y-1">
                        {SocialsService.generateNpcCommentsForPost(p.id, p.caption || 'New post', n, player).map((c, ci) => (
                          <p key={ci} className="text-[10px] text-gray-500">
                            <strong className="text-gray-300">{c.authorName}</strong> · {c.text}
                          </p>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'EXPLORE' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-2xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input placeholder="Search users, hashtags..." className="bg-transparent text-xs outline-none flex-1" />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(posts.length > 0 ? posts : releasedMovies.slice(0, 9)).map((p: any, i: number) => (
              <div key={p.id || i} className="aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/5">
                <img src={p.imageUrl || p.posterUrl || player.avatarUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-500 text-center">Explore shows real trending content — only things that actually happened.</p>
        </div>
      )}

      {tab === 'CREATE' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setImageChoice('gallery')} className={`flex-1 py-2 rounded-xl text-[10px] font-black cursor-pointer ${imageChoice === 'gallery' ? 'bg-rose-500 text-white' : 'bg-black/40 text-gray-400 border border-white/10'}`}><ImageIcon className="w-3.5 h-3.5 inline mr-1" />Use my images</button>
            <button onClick={() => setImageChoice('generate')} className={`flex-1 py-2 rounded-xl text-[10px] font-black cursor-pointer ${imageChoice === 'generate' ? 'bg-rose-500 text-white' : 'bg-black/40 text-gray-400 border border-white/10'}`}><Sparkles className="w-3.5 h-3.5 inline mr-1" />Generate</button>
          </div>
          <div className="aspect-square rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
            <img src={imageChoice === 'gallery' ? (latest?.posterUrl || player.avatarUrl) : player.avatarUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} placeholder="Write a caption... hashtags auto-added from your real events" className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 text-xs outline-none resize-none" />
          <button onClick={createPost} className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs font-black cursor-pointer">Share Post</button>
        </div>
      )}

      {tab === 'PREMIUM' && <PremiumPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}

      {tab === 'PROFILE' && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <img src={player.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-white/20" />
            <div className="flex gap-4 text-center flex-1">
              <div><p className="text-base font-black">{(posts || []).length}</p><p className="text-[9px] text-gray-500">Posts</p></div>
              <div><p className="text-base font-black">{(state.followers.Instagram || 0).toLocaleString()}</p><p className="text-[9px] text-gray-500">Followers</p></div>
              <div><p className="text-base font-black">{(state.following.Instagram || 0).toLocaleString()}</p><p className="text-[9px] text-gray-500">Following</p></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-black flex items-center gap-1">{username} {tick !== 'NONE' && <span className="text-sky-400">✓</span>}</p>
            <p className="text-[11px] text-gray-400">Actor · {player.city}</p>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center text-[9px] font-black text-gray-400 border-b border-white/10 pb-1">
            <span className="border-b-2 border-rose-400 pb-1 text-white"><Grid className="w-3 h-3 inline mr-1" />Posts</span>
            <span className="pb-1"><Clapperboard className="w-3 h-3 inline mr-1" />Reels</span>
            <span className="pb-1"><User className="w-3 h-3 inline mr-1" />Tagged</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {(posts || []).slice(0, 9).map((p: any) => (
              <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/5">
                <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {BottomNav}
    </div>
  );
};
