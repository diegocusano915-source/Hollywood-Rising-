/**
 * HOLLYWOOD RISING - FACEBOOK REBUILD (real FB-style)
 * Create post, 6 reactions, friends (auto from movies), 50+ groups (verified),
 * Marketplace (real merch), Memories (real career timeline), Events, Premium.
 */
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, PremiumService } from '../../services/socialsService';
import { RepresentationService } from '../../services/representationService';
import { ArrowLeft, ThumbsUp, Heart, Laugh, Frown, Angry, MessageCircle, Share, Users, ShoppingBag, Clock, Crown, Image as ImageIcon } from 'lucide-react';
import { PremiumPanel, WriterSheet } from './HubPanels';

const REACTIONS = [
  { id: 'like', icon: '👍', label: 'Like' },
  { id: 'love', icon: '❤️', label: 'Love' },
  { id: 'haha', icon: '😂', label: 'Haha' },
  { id: 'wow', icon: '😮', label: 'Wow' },
  { id: 'sad', icon: '😢', label: 'Sad' },
  { id: 'angry', icon: '😡', label: 'Angry' },
];

export const FacebookView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, saveData, updateSave, releasedMovies, careerTimeline } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'HOME' | 'GROUPS' | 'MARKET' | 'MEMORIES' | 'PREMIUM'>('HOME');
  const [draft, setDraft] = useState('');
  const [fb, setFb] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(
    () => new Set((state as any).joinedGroups || [])
  );
  const toggleJoin = (name: string) => {
    setJoinedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      (state as any).joinedGroups = Array.from(next);
      SocialsService.saveState(state);
      setFb(next.has(name) ? `Joined ${name}! Posts will appear in your feed.` : `Left ${name}.`);
      return next;
    });
    setTimeout(() => setFb(null), 2500);
  };

  const latest = releasedMovies[0];

  // STABLE joined-group feed: generated ONCE per session with fixed keys (no re-render crashes)
  const [groupFeed, setGroupFeed] = useState<any[]>(() => []);
  useEffect(() => {
    // (Re)build the group feed whenever the joined set changes — STABLE ids (gname-based, not Date.now)
    const feed = Array.from(joinedGroups).slice(0, 6).map((gname, i) => ({
      id: `grp_${gname.replace(/[^a-zA-Z0-9]/g, '')}_${i}`,
      authorName: gname,
      authorHandle: '',
      authorAvatar: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100&auto=format&fit=crop',
      platform: 'Facebook',
      tab: 'PLAYER_FEED',
      text: latest
        ? `[Group post] Members are discussing '${latest.movieTitle}' — ${["the box office run is incredible!", "who's seen it? Drop your review!", "the director's cut is even better 🎬"][i % 3]}`
        : `[Group post] New member discussion thread — introduce yourself!`,
      likes: Math.floor(500 + Math.random() * 5000),
      comments: Math.floor(50 + Math.random() * 400),
      retweets: 0,
      shares: Math.floor(20 + Math.random() * 200),
      timestamp: `${i + 1}h`,
      isPlayer: false,
      isNpc: true,
      sentiment: 'Positive',
    }));
    setGroupFeed(feed);
  }, [joinedGroups, latest?.movieTitle]);

  const premium = state.premium || { tier: 'none' as const };
  const tick = PremiumService.tickName(state);
  const friends = state.facebookFriends || 0;
  const posts = state.facebookPosts || [];

  const publish = () => {
    const text = draft.trim() || (latest ? `Just thinking about '${latest.movieTitle}' — what a ride! 🎬` : 'Another amazing day in Hollywood! ✨');
    state.facebookPosts = state.facebookPosts || [];
    state.facebookPosts.unshift({
      id: `fb_${Date.now()}`,
      authorName: `${player.firstName} ${player.lastName}`,
      authorHandle: '',
      authorAvatar: player.avatarUrl,
      platform: 'Facebook',
      tab: 'PLAYER_FEED',
      text,
      likes: 0,
      comments: 0,
      retweets: 0,
      shares: 0,
      timestamp: 'Just now',
      isPlayer: true,
      isNpc: false,
      sentiment: 'Positive',
    } as any);
    SocialsService.notePlayerPost('facebook');
    SocialsService.saveState(state);
    setState({ ...state });
    setDraft('');
    setFb('Posted to your timeline!');
    setTimeout(() => setFb(null), 3000);
  };

  const react = (id: string) => {
    state.facebookPosts = (state.facebookPosts || []).map((p) => (p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    SocialsService.saveState(state);
    setState({ ...state });
  };

  const memories = (careerTimeline || []).slice(0, 5);
  const groups = [
    // Fan groups (10) — scale with the player's real fans
    { name: `${player.lastName || 'Star'} Superfans`, members: Math.max(50, Math.floor((player.fans || 0) * 0.3)), verified: true },
    { name: `${player.firstName} ${player.lastName} Official Fan Club`, members: Math.max(30, Math.floor((player.fans || 0) * 0.15)), verified: true },
    { name: `${player.lastName} Filmography Watch`, members: Math.max(20, Math.floor((player.fans || 0) * 0.1)), verified: false },
    { name: `${player.firstName} Edit & Fan Art`, members: Math.max(15, Math.floor((player.fans || 0) * 0.08)), verified: false },
    { name: 'Rising Star Supporters', members: Math.max(25, Math.floor((player.fans || 0) * 0.12)), verified: false },
    { name: 'Premiere Night Crew', members: Math.max(18, Math.floor((player.fans || 0) * 0.06)), verified: false },
    { name: 'Behind The Scenes Lovers', members: Math.max(22, Math.floor((player.fans || 0) * 0.09)), verified: false },
    { name: `${player.lastName} Merch Collectors`, members: Math.max(12, Math.floor((player.fans || 0) * 0.05)), verified: false },
    { name: 'Fan Q&A Hangout', members: Math.max(16, Math.floor((player.fans || 0) * 0.07)), verified: false },
    { name: 'Movie Marathon Society', members: Math.max(20, Math.floor((player.fans || 0) * 0.1)), verified: false },
    // Industry groups (10) — verified
    { name: 'Hollywood Rising Official', members: 100000000, verified: true },
    { name: 'Box Office Analysts', members: 15000000, verified: true },
    { name: 'Awards Season Watch', members: 9000000, verified: true },
    { name: 'Studio Executives Lounge', members: 1200000, verified: true },
    { name: 'Casting Directors Network', members: 3500000, verified: true },
    { name: 'Film Critics Circle', members: 25000000, verified: true },
    { name: 'Talent Agencies Hub', members: 800000, verified: true },
    { name: 'Production Guild', members: 5200000, verified: true },
    { name: 'Streaming Execs Room', members: 600000, verified: true },
    { name: 'SAG-AFTRA Members Group', members: 40000000, verified: true },
    // Niche/community groups (10+) — verified mix
    { name: 'Indie Film Lovers', members: 8500000, verified: false },
    { name: 'Action Movie Fans', members: 60000000, verified: false },
    { name: 'Red Carpet Fashion', members: 22000000, verified: true },
    { name: 'Casting Call Central', members: 14000000, verified: false },
    { name: 'Cinema Critics Circle', members: 30000000, verified: false },
    { name: 'Sci-Fi Cinema Club', members: 45000000, verified: false },
    { name: 'Thriller Nights', members: 12000000, verified: false },
    { name: 'RomCom Reviewers', members: 9500000, verified: false },
    { name: 'Documentary Fans', members: 8000000, verified: false },
    { name: 'Horror Movie Lovers', members: 33000000, verified: false },
    { name: 'Movie Soundtracks', members: 11000000, verified: false },
    { name: 'Film Festival Circuit', members: 7000000, verified: true },
    { name: 'Cinematography Club', members: 6500000, verified: false },
    { name: 'Stunt Performers Guild', members: 4800000, verified: true },
    { name: 'Screenwriters Circle', members: 9800000, verified: false },
    { name: 'VFX Artists United', members: 8400000, verified: false },
    { name: 'Animated Films Fanbase', members: 28000000, verified: false },
    { name: 'Westerns Forever', members: 5400000, verified: false },
    { name: 'Musical Movie Fans', members: 8700000, verified: false },
    { name: 'IMDb Top 250 Club', members: 13000000, verified: false },
    { name: 'Streaming Wars Discussion', members: 10500000, verified: false },
    { name: 'Hollywood History Buffs', members: 6800000, verified: true },
    { name: 'Box Office Predictions', members: 5100000, verified: false },
    { name: 'Golden Age Cinema', members: 3900000, verified: false },
    { name: 'Film Noir Society', members: 4600000, verified: false },
  ];

  const BottomNav = (
    <div className="grid grid-cols-5 gap-1 pt-2 border-t border-white/10">
      {([['HOME', ThumbsUp], ['GROUPS', Users], ['MARKET', ShoppingBag], ['MEMORIES', Clock], ['PREMIUM', Crown]] as const).map(([id, Icon]) => (
        <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center py-1.5 rounded-xl cursor-pointer ${tab === id ? 'text-sky-400' : 'text-gray-500 hover:text-white'}`}>
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
        <span className="text-sm font-black tracking-wide">📘 Facebook</span>
        <WriterSheet state={state} platform="facebook" onRefresh={() => setState({ ...SocialsService.getState() })} />
      </div>

      {tab === 'HOME' && (
        <>
          {/* Create post */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <img src={player.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-xs font-black">{player.firstName} {player.lastName}</span>
              {tick !== 'NONE' && <span className="text-[10px] text-sky-400 font-black">✓</span>}
            </div>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="What's on your mind?" className="w-full bg-transparent text-xs outline-none placeholder-gray-500 resize-none" />
            <div className="flex items-center justify-between">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <button onClick={publish} className="px-4 py-1.5 rounded-xl bg-sky-600 text-white text-[10px] font-black cursor-pointer">Post</button>
            </div>
          </div>

          {/* Friends banner */}
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-gray-300"><strong className="text-white">{friends.toLocaleString()}</strong> friends — co-stars & directors auto-connect after movies</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>

          {/* Joined-group posts */}
          {groupFeed.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-gray-400">From groups you joined</h4>
              {groupFeed.map((gp: any) => (
                <div key={gp.id} className="rounded-2xl bg-black/50 border border-sky-500/20 overflow-hidden">
                  <div className="flex items-center gap-2 p-2.5">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xs">👥</div>
                    <div>
                      <p className="text-xs font-black">{gp.authorName}</p>
                      <p className="text-[9px] text-gray-500">Group · {gp.timestamp}</p>
                    </div>
                  </div>
                  <p className="px-3 pb-2 text-xs text-gray-200">{gp.text}</p>
                  <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {gp.likes.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {gp.comments.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Share className="w-3.5 h-3.5" /> {gp.shares.toLocaleString()}</span>
                  </div>
                  <div className="px-3 pb-2 space-y-1 border-t border-white/5">
                    <p className="text-[10px] text-gray-500"><strong className="text-gray-300">MikeReviews</strong> · Couldn't agree more — the group's buzzing about this! 🔥</p>
                    <p className="text-[10px] text-gray-500"><strong className="text-gray-300">FilmFan201</strong> · Count me in for the watch party! 🍿</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Feed */}
          <div className="space-y-3">
            {posts.length === 0 && groupFeed.length === 0 && <p className="text-center text-xs text-gray-500 py-8">No posts yet. Share something!</p>}
            {posts.slice(0, 20).map((p: any) => (
              <div key={p.id} className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                <div className="flex items-center gap-2 p-2.5">
                  <img src={p.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-black">{p.authorName}</p>
                    <p className="text-[9px] text-gray-500">{p.timestamp}</p>
                  </div>
                  {p.isPlayer && tick !== 'NONE' && <span className="text-[9px] text-sky-400 font-black ml-auto">✓</span>}
                </div>
                <p className="px-3 pb-2 text-xs text-gray-200">{p.text}</p>
                <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 text-[10px] text-gray-500">
                  <button onClick={() => react(p.id)} className="flex items-center gap-1 cursor-pointer hover:text-sky-400"><ThumbsUp className="w-3.5 h-3.5" /> {p.likes || 0}</button>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {p.comments || 0}</span>
                  <span className="flex items-center gap-1"><Share className="w-3.5 h-3.5" /> {p.shares || 0}</span>
                </div>
                <div className="flex justify-between px-3 pb-2 text-[10px] border-t border-white/5">
                  {REACTIONS.map((r) => <button key={r.id} onClick={() => react(p.id)} className="cursor-pointer hover:scale-125 transition-transform">{r.icon}</button>)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'GROUPS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-gray-300">Groups ({groups.length})</h3>
          {groups.map((g) => (
            <div key={g.name} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-black flex items-center gap-1.5">{g.name} {g.verified && <span className="text-[9px] text-sky-400 font-black">✓ Verified</span>}</p>
                <p className="text-[9px] text-gray-500">{g.members.toLocaleString()} members · NPCs discuss your real news here</p>
              </div>
              <button
                onClick={() => toggleJoin(g.name)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                  joinedGroups.has(g.name)
                    ? 'bg-white/10 text-gray-300 border border-white/20'
                    : 'bg-sky-600 text-white'
                }`}
              >
                {joinedGroups.has(g.name) ? '✓ Joined' : 'Join'}
              </button>
            </div>
          ))}
          {premium.tier !== 'none' && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-[11px] text-amber-200">👑 Premium: you can create your own group!</div>
          )}
        </div>
      )}

      {tab === 'MARKET' && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-gray-300">Marketplace (your real merch)</h3>
          <p className="text-[10px] text-gray-500">Items from your Merchandise system appear here — no fake listings.</p>
          {(() => { const merch = (RepresentationService.getState() as any)?.merchandise || []; return merch.length ? (
            <div className="grid grid-cols-2 gap-2">
              {merch.slice(0, 8).map((m: any) => (
                <div key={m.id || m.name} className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <p className="text-xs font-black">{m.name}</p>
                  <p className="text-[10px] text-emerald-400">${m.sellingPrice?.toLocaleString() || 0}</p>
                  <p className="text-[9px] text-gray-500">{m.totalSold || 0} sold</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 bg-black/40 border border-white/10 p-3 rounded-2xl">Create merchandise in Representation → Merchandise — it'll show up here.</p>
          ); })()}
        </div>
      )}

      {tab === 'MEMORIES' && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-gray-300 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> Memories — On This Day</h3>
          {memories.length === 0 && <p className="text-[11px] text-gray-500 bg-black/40 border border-white/10 p-3 rounded-2xl">Your career timeline is empty — memories appear as you play.</p>}
          {memories.map((m: any) => (
            <div key={m.id} className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <p className="text-[9px] text-gray-500 uppercase font-bold">{m.category} · W{m.week} {m.year}</p>
              <p className="text-xs font-black text-white mt-0.5">{m.title}</p>
              <p className="text-[10px] text-gray-400">{m.description}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'PREMIUM' && <PremiumPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}
      {BottomNav}
    </div>
  );
};
