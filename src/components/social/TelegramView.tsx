/**
 * HOLLYWOOD RISING - TELEGRAM REBUILD (real Telegram-style)
 * Channels (subs start 0, player + writer post), stories 24h/48h Premium,
 * NPC stories, real-event DMs, groups, polls, Premium monthly/yearly.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, PremiumService } from '../../services/socialsService';
import { ArrowLeft, Send, MessageCircle, Users, Megaphone, Camera, Check, Crown, Radio, Search } from 'lucide-react';
import { PremiumPanel } from './HubPanels';

export const TelegramView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, releasedMovies, saveData, updateSave } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'CHATS' | 'CHANNEL' | 'STORIES' | 'PREMIUM'>('CHATS');
  const [channelDraft, setChannelDraft] = useState('');
  const [storyDraft, setStoryDraft] = useState('');
  const [fb, setFb] = useState<string | null>(null);

  const premium = state.premium || { tier: 'none' as const };
  const subs = state.telegramChannelSubs || 0;
  const stories = state.telegramStories || [];
  const latest = releasedMovies[0];
  const username = `@${(player.firstName || 'actor').toLowerCase()}${(player.lastName || '').toLowerCase()}`;

  const postChannel = () => {
    const text = channelDraft.trim() || (latest ? `📣 '${latest.movieTitle}' update — stay tuned!` : '📣 Channel announcement');
    state.telegramStories = state.telegramStories || [];
    state.telegramStories.unshift({
      id: `tg_${Date.now()}`,
      author: `${player.firstName} ${player.lastName}`,
      text,
      hoursLeft: premium.tier !== 'none' ? 48 : 24,
      isPlayer: true,
      week: player.dateWeek || 1,
      year: player.dateYear || 2026,
    });
    const growth = Math.floor(1 + (player.fameXp || 0) * 0.15);
    state.telegramChannelSubs = subs + growth;
    SocialsService.saveState(state);
    setState({ ...state });
    setChannelDraft('');
    setFb(`📢 Posted to your channel! +${growth} subscribers.`);
    setTimeout(() => setFb(null), 3500);
  };

  const postStory = () => {
    if (!storyDraft.trim()) return;
    state.telegramStories = state.telegramStories || [];
    state.telegramStories.unshift({
      id: `tg_st_${Date.now()}`,
      author: `${player.firstName} ${player.lastName}`,
      text: storyDraft.trim(),
      hoursLeft: premium.tier !== 'none' ? 48 : 24,
      isPlayer: true,
      week: player.dateWeek || 1,
      year: player.dateYear || 2026,
    });
    SocialsService.saveState(state);
    setState({ ...state });
    setStoryDraft('');
    setFb(`Story posted — visible for ${premium.tier !== 'none' ? '48' : '24'} hours.`);
    setTimeout(() => setFb(null), 3000);
  };

  const dms = [
    { name: 'Agent', avatar: player.representation?.agent?.avatarUrl, msg: latest ? `Congrats on '${latest.movieTitle}'! Let's talk next steps. 🤝` : 'Checking in on your career plan.' },
    { name: 'Director', avatar: '', msg: latest ? `Great work on '${latest.movieTitle}' — audiences love it.` : 'Looking forward to our next project.' },
    { name: 'Fan Club HQ', avatar: '', msg: `Members are asking about your next release! 💛` },
  ];

  const groups = [
    { name: `${player.lastName || 'Star'} Fan Group`, members: Math.max(20, Math.floor((player.fans || 0) * 0.1)), online: Math.floor(Math.random() * 40) + 5 },
    { name: 'Cast & Crew — Latest Film', members: 48, online: 12 },
    { name: 'Hollywood Rising Community', members: 5000, online: 340 },
    { name: 'Awards Watch Party', members: 1200, online: 87 },
  ];

  const BottomNav = (
    <div className="grid grid-cols-4 gap-1 pt-2 border-t border-white/10">
      {([['CHATS', MessageCircle], ['CHANNEL', Megaphone], ['STORIES', Camera], ['PREMIUM', Crown]] as const).map(([id, Icon]) => (
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
        <span className="text-sm font-black tracking-wide">✈️ Telegram</span>
        <Search className="w-4 h-4 text-gray-500" />
      </div>

      {tab === 'CHATS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-gray-300">Chats</h3>
          {dms.map((d) => (
            <div key={d.name} className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xs font-black shrink-0">
                {d.avatar ? <img src={d.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : d.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black">{d.name} <span className="text-sky-400">✓</span></p>
                <p className="text-[10px] text-gray-400 truncate">{d.msg}</p>
              </div>
              <span className="text-[9px] text-gray-500">Now</span>
            </div>
          ))}
          <h3 className="text-xs font-black uppercase text-gray-300 pt-2">Groups</h3>
          {groups.map((g) => (
            <div key={g.name} className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xs font-black shrink-0"><Users className="w-4 h-4 text-purple-300" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black">{g.name}</p>
                <p className="text-[10px] text-gray-400">{g.members.toLocaleString()} members · {g.online} online</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-[10px] font-black cursor-pointer">Open</button>
            </div>
          ))}
          <p className="text-[9px] text-gray-500">DMs are real-event based — NPCs message you about actual things that happen.</p>
        </div>
      )}

      {tab === 'CHANNEL' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-black/50 border border-sky-500/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-black">{username} <span className="text-sky-400 text-xs">✓</span></p>
              <p className="text-[10px] text-gray-400">{subs.toLocaleString()} channel subscribers</p>
            </div>
            <Megaphone className="w-6 h-6 text-sky-400" />
          </div>
          <textarea value={channelDraft} onChange={(e) => setChannelDraft(e.target.value)} rows={2} placeholder="Broadcast to your channel subscribers..." className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 text-xs outline-none resize-none" />
          <button onClick={postChannel} className="w-full py-2.5 rounded-2xl bg-sky-600 text-white text-[10px] font-black cursor-pointer">📣 Broadcast</button>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-gray-400">Channel History (you + writer)</h4>
            {stories.filter((s) => s.isPlayer).slice(0, 10).map((s) => (
              <div key={s.id} className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <p className="text-[9px] text-gray-500">{s.author} · {s.hoursLeft}h left</p>
                <p className="text-xs text-gray-200">{s.text}</p>
              </div>
            ))}
            {stories.filter((s) => s.isPlayer).length === 0 && <p className="text-[10px] text-gray-500">No broadcasts yet.</p>}
          </div>
        </div>
      )}

      {tab === 'STORIES' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input value={storyDraft} onChange={(e) => setStoryDraft(e.target.value)} placeholder="Post a story (24h / 48h Premium)..." className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none" />
            <button onClick={postStory} className="px-4 py-2 rounded-2xl bg-sky-600 text-white text-[10px] font-black cursor-pointer">Post</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {stories.map((s) => (
              <div key={s.id} className="p-3 rounded-2xl bg-black/50 border border-white/10 text-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-purple-500 mx-auto flex items-center justify-center text-sm">📸</div>
                <p className="text-[9px] font-black mt-1 truncate">{s.author}</p>
                <p className="text-[8px] text-gray-500">{s.hoursLeft}h left</p>
              </div>
            ))}
            {stories.length === 0 && <p className="col-span-3 text-center text-xs text-gray-500 py-6">No stories — all NPCs post their stories here too.</p>}
          </div>
        </div>
      )}

      {tab === 'PREMIUM' && <PremiumPanel state={state} onRefresh={() => setState({ ...SocialsService.getState() })} />}
      {BottomNav}
    </div>
  );
};
