/**
 * HOLLYWOOD RISING - REDDIT REBUILD (real Reddit-style)
 * 50+ subreddits, upvotes/downvotes, karma (real), nested threads, AMA (fame-gated),
 * Gold premium (award coins, exclusive sub, ad-free).
 */
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, PremiumService } from '../../services/socialsService';
import { ArrowLeft, ArrowUp, ArrowDown, MessageCircle, Award, Search, Home, Compass, Crown, Share2 } from 'lucide-react';
import { PremiumPanel, WriterSheet } from './HubPanels';
import { SocialBankPanel } from './SocialBankPanel';

const SUBREDDITS: { name: string; members: number; verified: boolean }[] = [
  { name: 'r/HollywoodRising', members: 100000000, verified: true },
  { name: 'r/BoxOffice', members: 45000000, verified: true },
  { name: 'r/MovieCritics', members: 28000000, verified: true },
  { name: 'r/CelebrityGossip', members: 35000000, verified: true },
  { name: 'r/AwardsWatch', members: 12000000, verified: true },
  { name: 'r/CastingCalls', members: 9000000, verified: true },
  { name: 'r/ActionFilms', members: 60000000, verified: false },
  { name: 'r/SciFiCinema', members: 55000000, verified: false },
  { name: 'r/DramaMasters', members: 18000000, verified: false },
  { name: 'r/ComedyFilms', members: 25000000, verified: false },
  { name: 'r/IndieFilm', members: 14000000, verified: false },
  { name: 'r/RedCarpet', members: 16000000, verified: true },
  { name: 'r/FilmIndustry', members: 8000000, verified: true },
  { name: 'r/StudioNews', members: 7000000, verified: true },
  { name: 'r/ActorLife', members: 11000000, verified: false },
  { name: 'r/MovieMemes', members: 30000000, verified: false },
  { name: 'r/FanTheories', members: 22000000, verified: false },
  { name: 'r/OscarBuzz', members: 9500000, verified: false },
  { name: 'r/StreamingWars', members: 13000000, verified: false },
  { name: 'r/FilmFestivals', members: 6000000, verified: true },
  { name: 'r/Screenwriting', members: 10000000, verified: false },
  { name: 'r/DirectorsCut', members: 7500000, verified: false },
  { name: 'r/Cinematography', members: 8500000, verified: false },
  { name: 'r/VFXArt', members: 6800000, verified: false },
  { name: 'r/TrailerPark', members: 17000000, verified: false },
  { name: 'r/BoxOfficePredictions', members: 5200000, verified: false },
  { name: 'r/MovieLeaks', members: 9000000, verified: false },
  { name: 'r/FilmTrivia', members: 7200000, verified: false },
  { name: 'r/CultCinema', members: 4800000, verified: false },
  { name: 'r/MovieSoundtracks', members: 6600000, verified: false },
  { name: 'r/HorrorFilms', members: 42000000, verified: false },
  { name: 'r/RomComs', members: 20000000, verified: false },
  { name: 'r/ThrillerNights', members: 15000000, verified: false },
  { name: 'r/Westerns', members: 5800000, verified: false },
  { name: 'r/AnimatedFilms', members: 26000000, verified: false },
  { name: 'r/Documentaries', members: 11000000, verified: false },
  { name: 'r/BehindTheScenes', members: 9800000, verified: false },
  { name: 'r/StuntWork', members: 3600000, verified: true },
  { name: 'r/CastingDirector', members: 3100000, verified: true },
  { name: 'r/ActingCoach', members: 4300000, verified: false },
  { name: 'r/StarFans', members: 19000000, verified: false },
  { name: 'r/FanArt', members: 23000000, verified: false },
  { name: 'r/MovieMerch', members: 5400000, verified: false },
  { name: 'r/PremiereNight', members: 8200000, verified: false },
  { name: 'r/FilmCriticsCircle', members: 8900000, verified: true },
  { name: 'r/AudienceScores', members: 12000000, verified: false },
  { name: 'r/IMDbRating', members: 14000000, verified: false },
  { name: 'r/FameWatch', members: 6500000, verified: false },
  { name: 'r/NewHollywood', members: 7700000, verified: false },
  { name: 'r/TalentAgencies', members: 2900000, verified: true },
  { name: 'r/ProducersLounge', members: 3300000, verified: true },
  { name: 'r/StudioExecs', members: 2400000, verified: true },
  { name: 'r/FilmNerds', members: 16000000, verified: false },
  { name: 'r/MovieNight', members: 13000000, verified: false },
  { name: 'r/HollywoodHistory', members: 7000000, verified: true },
  { name: 'r/BoxOfficeBets', members: 4100000, verified: false },
  { name: 'r/FilmSpeedruns', members: 2800000, verified: false },
  { name: 'r/ClassicCinema', members: 6000000, verified: false },
  { name: 'r/ForeignFilms', members: 5000000, verified: false },
  { name: 'r/MovieProps', members: 3400000, verified: false },
];

export const RedditView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, releasedMovies } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'HOME' | 'SUBS' | 'PREMIUM'>('HOME');
  const [sort, setSort] = useState<'hot' | 'new' | 'top'>('hot');
  const [postDraft, setPostDraft] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [fb, setFb] = useState<string | null>(null);
  const [joinedSubs, setJoinedSubs] = useState<Set<string>>(
    () => new Set((state as any).joinedSubreddits || [])
  );
  const persistJoined = (next: Set<string>) => {
    (state as any).joinedSubreddits = Array.from(next);
    SocialsService.saveState(state);
  };
  const toggleJoinSub = (name: string) => {
    setJoinedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      persistJoined(next);
      setFb(next.has(name) ? `Joined ${name}! Posts will appear in your feed.` : `Left ${name}.`);
      return next;
    });
    setTimeout(() => setFb(null), 3000);
  };

  const premium = state.premium || { tier: 'none' as const };
  const karma = state.redditKarma || 0;
  const latest = releasedMovies[0];
  const posts = state.redditPosts || [];
  const canAMA = (player.fameXp || 0) >= 1500;

  // Joined subreddits contribute real posts to the home feed - STABLE ids (no re-render crash)
  const joinedSubPosts = Array.from(joinedSubs).slice(0, 5).map((sub, i) => ({
    id: `jsub_${sub.replace(/[^a-zA-Z0-9]/g, '')}_${i}`,
    subreddit: sub,
    author: `u/${['cinephile_la', 'moviebuff88', 'hollywoodwatcher', 'screenfanatic', 'reelcritic'][i % 5]}`,
    title: latest
      ? `${['The box office numbers for ', 'Why everyone is talking about ', 'Unpopular opinion: ', 'Discussion thread: '][i % 4]}'${latest.movieTitle}'`
      : `${['What are we watching this week?', 'Best performances of the year so far?', 'Hot take: the industry is changing'][i % 3]}`,
    text: 'Members are discussing this — join the thread!',
    upvotes: Math.floor(2000 + Math.random() * 50000),
    commentCount: Math.floor(100 + Math.random() * 3000),
    isPlayer: false,
    isNpc: true,
    flair: ['Discussion', 'News', 'Hot Take', 'Review'][i % 4],
    timeText: `${i + 1}h`,
    week: player.dateWeek || 1,
    year: player.dateYear || 2026,
  }));

  // WEEKLY ROTATION: when the game week advances, joined-sub posts regenerate (new titles, upvotes)
  const currentWeek = player.dateWeek || 1;
  const weekKey = `${currentWeek}-${player.dateYear || 2026}-${joinedSubs.size}`;
  const [joinedFeedVersion, setJoinedFeedVersion] = useState(weekKey);
  useEffect(() => {
    if (joinedFeedVersion !== weekKey) setJoinedFeedVersion(weekKey);
  }, [weekKey, joinedFeedVersion]);

  const sorted = [...joinedSubPosts, ...posts].sort((a, b) =>
    sort === 'hot' ? b.upvotes - a.upvotes : sort === 'top' ? b.upvotes - a.upvotes : (b.week || 0) - (a.week || 0)
  );

  const vote = (id: string, dir: 1 | -1) => {
    state.redditPosts = (state.redditPosts || []).map((p) =>
      p.id === id ? { ...p, upvotes: Math.max(0, p.upvotes + dir) } : p
    );
    if (dir > 0) state.redditKarma = (state.redditKarma || 0) + 1;
    SocialsService.saveState(state);
    setState({ ...state });
  };

  const submit = () => {
    if (!titleDraft.trim()) return;
    if (SocialsService.playerPostsLeft('reddit') <= 0) {
      setFb("You've already posted twice on Reddit this week — END WEEK to post again.");
      setTimeout(() => setFb(null), 3500);
      return;
    }
    state.redditPosts = state.redditPosts || [];
    state.redditPosts.unshift({
      id: `rd_${Date.now()}`,
      subreddit: 'r/HollywoodRising',
      author: `u/${(player.firstName || 'actor').toLowerCase()}${(player.lastName || '').toLowerCase()}`,
      title: titleDraft.trim(),
      text: postDraft.trim(),
      upvotes: 0,
      commentCount: 0,
      isPlayer: true,
      isNpc: false,
      flair: 'Discussion',
      timeText: 'Just now',
      week: player.dateWeek || 1,
      year: player.dateYear || 2026,
    });
    SocialsService.notePlayerPost('reddit');
    SocialsService.saveState(state);
    setState({ ...state });
    setTitleDraft('');
    setPostDraft('');
    setFb('Posted! Karma grows with real upvotes.');
    setTimeout(() => setFb(null), 3500);
  };

  const hostAMA = () => {
    if (!canAMA || !latest) return;
    if (SocialsService.playerPostsLeft('reddit') <= 0) {
      setFb("You've already posted twice on Reddit this week — END WEEK to post again.");
      setTimeout(() => setFb(null), 3500);
      return;
    }
    state.redditPosts = state.redditPosts || [];
    state.redditPosts.unshift({
      id: `ama_${Date.now()}`,
      subreddit: 'r/HollywoodRising',
      author: `u/${(player.firstName || 'actor').toLowerCase()}${(player.lastName || '').toLowerCase()}`,
      title: `I'm ${player.firstName} ${player.lastName}, star of '${latest.movieTitle}' — AMA! 🎬`,
      text: 'Ask me anything about the movie, my career, or Hollywood.',
      upvotes: Math.floor(50 + (player.fameXp || 0) * 0.2),
      commentCount: Math.floor(10 + (player.fameXp || 0) * 0.05),
      isPlayer: true,
      isNpc: false,
      flair: 'AMA',
      timeText: 'Just now',
      week: player.dateWeek || 1,
      year: player.dateYear || 2026,
    });
    SocialsService.notePlayerPost('reddit');
    SocialsService.saveState(state);
    setState({ ...state });
    setFb('🎙️ AMA posted — fans are asking questions! (+fans)');
    setTimeout(() => setFb(null), 4000);
  };

  const BottomNav = (
    <div className="grid grid-cols-4 gap-1 pt-2 border-t border-white/10">
      {([['HOME', Home], ['SUBS', Compass], ['PREMIUM', Crown]] as const).map(([id, Icon]) => (
        <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center py-1.5 rounded-xl cursor-pointer ${tab === id ? 'text-orange-400' : 'text-gray-500 hover:text-white'}`}>
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
        <span className="text-sm font-black tracking-wide">🔴 Reddit</span>
        <WriterSheet state={state} platform="reddit" onRefresh={() => setState({ ...SocialsService.getState() })} />
      </div>

      {tab === 'HOME' && (
        <>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-2xl px-3 py-2 flex-1">
              <input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} placeholder="Post title..." className="bg-transparent text-xs outline-none flex-1" />
            </div>
            <button onClick={submit} className="px-3 py-2 rounded-xl bg-orange-500 text-white text-[10px] font-black cursor-pointer">Post</button>
          </div>
          {canAMA && latest && (
            <button onClick={hostAMA} className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black cursor-pointer">🎙️ Host an AMA (Ask Me Anything)</button>
          )}
          <div className="flex gap-2">
            {(['hot', 'new', 'top'] as const).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${sort === s ? 'bg-orange-500 text-white' : 'bg-black/40 text-gray-400 border border-white/10'}`}>{s.toUpperCase()}</button>
            ))}
            <button onClick={() => setFb('New = newest posts · Top = highest upvotes · AMA = Q&A threads with celebs')} className="px-3 py-1 rounded-full bg-black/40 text-gray-400 border border-white/10 text-[10px] font-black cursor-pointer">❓</button>
            <span className="ml-auto text-[9px] text-gray-500 font-bold">⬆️ {karma.toLocaleString()} karma</span>
          </div>
          <p className="text-[9px] text-gray-500 text-center">Hot = trending · New = latest · Top = most upvoted · AMA threads appear when you host one</p>
          {joinedSubPosts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1.5">
                <ArrowUp className="w-3 h-3 text-orange-400" /> From your joined subreddits
              </h4>
              {joinedSubPosts.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex gap-2">
                  <div className="flex flex-col items-center text-[10px] text-gray-400 shrink-0">
                    <ArrowUp className="w-4 h-4 text-orange-400" />
                    <span className="font-black text-orange-300">{p.upvotes.toLocaleString()}</span>
                    <ArrowDown className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-gray-500">{p.subreddit} · Posted by {p.author}</p>
                    <p className="text-xs font-black leading-snug mt-0.5">{p.title} <span className="text-[8px] px-1 py-0.5 rounded bg-orange-500/20 text-orange-300 font-black">{p.flair}</span></p>
                    <p className="text-[10px] text-gray-400 mt-1">{p.text}</p>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {p.commentCount.toLocaleString()} comments</p>
                    <p className="text-[9px] text-gray-600 mt-1 border-t border-white/5 pt-1">💬 <strong className="text-gray-400">top comment</strong> · {p.subreddit} members are loving this thread</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {sorted.length === 0 && joinedSubPosts.length === 0 && <p className="text-center text-xs text-gray-500 py-6">No posts yet — join the conversation!</p>}
            {sorted.slice(0, 25).map((p) => (
              <div key={p.id} className="p-3 rounded-2xl bg-black/50 border border-white/10 flex gap-2">
                <div className="flex flex-col items-center text-[10px] text-gray-400 shrink-0">
                  <button onClick={() => vote(p.id, 1)} className="cursor-pointer hover:text-orange-400"><ArrowUp className="w-4 h-4" /></button>
                  <span className="font-black text-orange-300">{p.upvotes}</span>
                  <button onClick={() => vote(p.id, -1)} className="cursor-pointer hover:text-sky-400"><ArrowDown className="w-4 h-4" /></button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] text-gray-500">{p.subreddit} · Posted by {p.author} {p.isPlayer && <span className="text-orange-400 font-black">(you)</span>}</p>
                  <p className="text-xs font-black leading-snug mt-0.5">{p.title} {p.flair && <span className="text-[8px] px-1 py-0.5 rounded bg-orange-500/20 text-orange-300 font-black">{p.flair}</span>}</p>
                  {p.text && <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{p.text}</p>}
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {p.commentCount} comments <Share2 className="w-3 h-3 ml-2" /></p>
                  <p className="text-[9px] text-gray-600 mt-1 border-t border-white/5 pt-1">
                    💬 <strong className="text-gray-400">top comment</strong> · {p.subreddit} members are loving this thread
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'SUBS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-gray-300">Subreddits ({SUBREDDITS.length})</h3>
          <div className="grid grid-cols-2 gap-2">
            {SUBREDDITS.map((sub) => (
              <div key={sub.name} className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <p className="text-[11px] font-black text-orange-300">{sub.name} {sub.verified && <span className="text-[9px] text-sky-400 font-black">✓</span>}</p>
                <p className="text-[9px] text-gray-500">{sub.members.toLocaleString()} members</p>
                <button
                  onClick={() => toggleJoinSub(sub.name)}
                  className={`mt-1 px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all ${
                    joinedSubs.has(sub.name) ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'bg-white/10 text-gray-300'
                  }`}
                >
                  {joinedSubs.has(sub.name) ? '✓ Joined' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 sm:px-4 pb-2"><SocialBankPanel platform="reddit" accent="orange" /></div>
      {tab === 'PREMIUM' && <PremiumPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}
      {BottomNav}
    </div>
  );
};
