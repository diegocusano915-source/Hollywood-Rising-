/**
 * HOLLYWOOD RISING - YOUTUBE REBUILD (real YouTube-style with invisible algorithm)
 * Home/Subscriptions, channel profile, Shorts, LIVE, Creator Studio, Premium.
 * Algorithm: new channels 0-100 views; after ~55 videos the algorithm pushes you out.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, youtubeAlgorithmViews, PremiumService } from '../../services/socialsService';
import { ArrowLeft, Home, Compass, PlaySquare, Clock, ThumbsUp, ThumbsDown, MessageCircle, Share, MoreVertical, Clapperboard, Crown, BarChart3, Radio } from 'lucide-react';
import { PremiumPanel, CreatorStudioPanel } from './HubPanels';

export const YouTubeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, releasedMovies } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'HOME' | 'SHORTS' | 'CHANNEL' | 'CREATOR' | 'PREMIUM'>('HOME');
  const [playing, setPlaying] = useState<any>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [fb, setFb] = useState<string | null>(null);

  const premium = state.premium || { tier: 'none' as const };
  const algo = state.youtubeAlgorithm || { lifetimeVideos: 0, discovered: false };
  const latest = releasedMovies[0];
  const videos = state.youtubeVideos || [];
  const subs = state.youtubeSubscribers || 0;

  // Algorithm is INVISIBLE — never shown to the player.

  const publish = () => {
    const title = videoTitle.trim() || (latest ? `'${latest.movieTitle}' — Official Trailer & Behind the Scenes` : `My New Video #${(state.youtubeVideos?.length || 0) + 1}`);
    const views = youtubeAlgorithmViews(algo.lifetimeVideos, player.fameXp || 0, algo.discovered);
    state.youtubeVideos = state.youtubeVideos || [];
    state.youtubeVideos.unshift({
      id: `yt_${Date.now()}`,
      title,
      views,
      likes: Math.floor(views * 0.04),
      comments: Math.floor(views * 0.005),
      thumbnailUrl: latest?.posterUrl || player.avatarUrl,
      channelName: `${player.firstName} ${player.lastName}`,
      duration: '2:15',
      isPlayer: true,
      isLive: false,
    } as any);
    state.youtubeAlgorithm = { lifetimeVideos: algo.lifetimeVideos + 1, discovered: algo.discovered };
    if (state.youtubeAlgorithm.lifetimeVideos >= 55) state.youtubeAlgorithm.discovered = true;
    SocialsService.saveState(state);
    setState({ ...state });
    setVideoTitle('');
    setFb('🎬 Video published to your channel!');
    setTimeout(() => setFb(null), 3000);
  };

  const VideoCard: React.FC<{ v: any }> = ({ v }) => (
    <div className="rounded-2xl bg-black/50 border border-white/10 overflow-hidden cursor-pointer" onClick={() => setPlaying(v)}>
      <div className="relative">
        <img src={v.thumbnailUrl} alt="" className="w-full h-32 object-cover" />
        <span className="absolute bottom-1.5 right-1.5 text-[9px] bg-black/80 px-1.5 py-0.5 rounded font-bold">{v.duration}</span>
        {v.isLive && <span className="absolute top-1.5 left-1.5 text-[9px] bg-red-600 px-1.5 py-0.5 rounded font-black flex items-center gap-1"><Radio className="w-2.5 h-2.5" /> LIVE</span>}
      </div>
      <div className="p-2.5 flex gap-2">
        <img src={player.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="text-[11px] font-black line-clamp-2">{v.title}</p>
          <p className="text-[9px] text-gray-500">{v.channelName} · {v.views?.toLocaleString()} views</p>
        </div>
      </div>
    </div>
  );

  const BottomNav = (
    <div className="grid grid-cols-5 gap-1 pt-2 border-t border-white/10">
      {([['HOME', Home], ['SHORTS', Clapperboard], ['CHANNEL', PlaySquare], ['CREATOR', BarChart3], ['PREMIUM', Crown]] as const).map(([id, Icon]) => (
        <button key={id} onClick={() => setTab(id)} className={`flex flex-col items-center py-1.5 rounded-xl cursor-pointer ${tab === id ? 'text-rose-500' : 'text-gray-500 hover:text-white'}`}>
          <Icon className="w-4 h-4" />
          <span className="text-[8px] font-black">{id}</span>
        </button>
      ))}
    </div>
  );

  if (playing) {
    return (
      <div className="space-y-3 text-white select-none">
        <button onClick={() => setPlaying(null)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/10">
          <img src={playing.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute w-14 h-14 rounded-full bg-black/60 flex items-center justify-center"><span className="text-white text-xl">▶</span></div>
        </div>
        <h3 className="text-sm font-black">{playing.title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="font-black text-white">{playing.views?.toLocaleString()} views</span>
          <button className="flex items-center gap-1 cursor-pointer"><ThumbsUp className="w-3.5 h-3.5" /> {playing.likes || 0}</button>
          <button className="flex items-center gap-1 cursor-pointer"><ThumbsDown className="w-3.5 h-3.5" /></button>
          <button className="flex items-center gap-1 cursor-pointer"><Share className="w-3.5 h-3.5" /> Share</button>
          <MoreVertical className="w-4 h-4" />
        </div>
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
          <p className="text-[10px] font-black text-gray-300">💬 {playing.comments || 0} comments</p>
          {(() => {
            const n = Math.min(10, Math.max(4, Math.floor((playing.comments || 30) / 5)));
            return SocialsService.generateNpcCommentsForPost(playing.id, playing.title || 'This video', n, player).map((c, ci) => (
              <div key={ci} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] shrink-0">{c.authorName ? c.authorName[0] : '👤'}</div>
                <p className="text-[10px] text-gray-400"><strong className="text-white">{c.authorName}</strong> · {c.text}</p>
              </div>
            ));
          })()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-white select-none pb-14">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
        <span className="text-sm font-black tracking-wide">▶ YouTube</span>
        <div className="flex items-center gap-2 text-gray-500"><Compass className="w-4 h-4" /><Clock className="w-4 h-4" /></div>
      </div>



      {tab === 'HOME' && (
        <div className="space-y-3">
          {fb && <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-[11px] font-bold">{fb}</div>}
          <div className="flex gap-2">
            <input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder={latest ? `Video title (e.g. '${latest.movieTitle}' trailer)...` : 'Video title...'}
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none"
            />
            <button onClick={publish} className="px-4 py-2 rounded-2xl bg-red-600 text-white text-[10px] font-black cursor-pointer">Upload</button>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase text-gray-300">Recommended for you</h3>
          </div>
          {videos.length === 0 && <p className="text-center text-xs text-gray-500 py-8">No videos yet. Publish your first one! (New channels get 0-100 views — the algorithm learns from consistent posting.)</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{videos.slice(0, 12).map((v: any) => <VideoCard key={v.id} v={v} />)}</div>
        </div>
      )}

      {tab === 'SHORTS' && (
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-gray-300">Shorts</h3>
          <div className="grid grid-cols-3 gap-1">
            {videos.slice(0, 9).map((v: any) => (
              <div key={v.id} className="aspect-[9/16] rounded-xl overflow-hidden bg-black/40 border border-white/5 cursor-pointer" onClick={() => setPlaying(v)}>
                <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {videos.length === 0 && <p className="col-span-3 text-center text-xs text-gray-500 py-8">No shorts yet.</p>}
          </div>
        </div>
      )}

      {tab === 'CHANNEL' && (
        <div className="space-y-3">
          <div className="h-24 rounded-2xl bg-gradient-to-r from-red-500/30 via-purple-500/30 to-sky-500/30 border border-white/10" />
          <div className="flex items-center gap-3 -mt-8 px-3">
            <img src={player.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-black" />
            <div>
              <p className="text-sm font-black">{player.firstName} {player.lastName}</p>
              <p className="text-[10px] text-gray-500">{subs.toLocaleString()} subscribers · {videos.length} videos</p>
              <p className="text-[10px] text-gray-400">Actor · {player.city}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[9px] font-black text-gray-400 border-b border-white/10 pb-1">
            <span className="text-center border-b-2 border-red-500 pb-1 text-white">Videos</span>
            <span className="text-center pb-1">Shorts</span>
            <span className="text-center pb-1">Live</span>
          </div>
          <div className="space-y-2">{videos.slice(0, 10).map((v: any) => <VideoCard key={v.id} v={v} />)}</div>
        </div>
      )}

      {tab === 'CREATOR' && <CreatorStudioPanel state={state} />}
      {tab === 'PREMIUM' && <PremiumPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}
      {BottomNav}
    </div>
  );
};
