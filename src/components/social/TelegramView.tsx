/**
 * HOLLYWOOD RISING - TELEGRAM REBUILD (real Telegram-style)
 * Channels (subs start 0, player + writer post), stories 24h/48h Premium,
 * NPC stories, real-event DMs, groups, polls, Premium monthly/yearly.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { SocialsService, SocialsState, PremiumService } from '../../services/socialsService';
import { ArrowLeft, Send, MessageCircle, Users, Megaphone, Camera, Check, Crown, Radio, Search } from 'lucide-react';
import { PremiumPanel, WriterSheet } from './HubPanels';

export const TelegramView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { player, releasedMovies, saveData, updateSave } = useGame();
  const [state, setState] = useState<SocialsState>(() => SocialsService.getState());
  const [tab, setTab] = useState<'CHATS' | 'CHANNEL' | 'STORIES' | 'PREMIUM'>('CHATS');
  const [channelDraft, setChannelDraft] = useState('');
  const [storyDraft, setStoryDraft] = useState('');
  const [openChat, setOpenChat] = useState<any>(null);
  const [chatMsg, setChatMsg] = useState('');
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
    SocialsService.notePlayerPost('telegram');
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

  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(
    () => new Set((state as any).joinedGroups || [])
  );
  const persistJoined = (next: Set<string>) => {
    (state as any).joinedGroups = Array.from(next);
    SocialsService.saveState(state);
  };
  const toggleJoinGroup = (name: string) => {
    setJoinedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      persistJoined(next);
      setFb(next.has(name) ? `Joined ${name}! Group activity now appears in your chats.` : `Left ${name}.`);
      return next;
    });
    setTimeout(() => setFb(null), 3000);
  };

  const groups = [
    // Fan groups (8) — distinct from FB/Reddit
    { name: `${player.lastName || 'Star'} Fan Group`, members: Math.max(200000, Math.floor((player.fans || 0) * 0.05) + 200000), online: 12000 },
    { name: `${player.firstName}'s VIP Circle`, members: Math.max(50000, Math.floor((player.fans || 0) * 0.01) + 50000), online: 3400 },
    { name: `${player.lastName} Merch Squad`, members: Math.max(30000, Math.floor((player.fans || 0) * 0.008) + 30000), online: 2100 },
    { name: 'Movie Night Community', members: 15000000, online: 450000 },
    { name: 'Hollywood Rising Community', members: 25000000, online: 800000 },
    { name: 'Cast & Crew — Latest Film', members: 500000, online: 18000 },
    { name: 'Awards Watch Party', members: 8000000, online: 240000 },
    { name: 'Premiere Livestream Chat', members: 3000000, online: 90000 },
    // Industry groups (8)
    { name: 'Directors & Actors Exchange', members: 1200000, online: 15000 },
    { name: 'Studio Insider Group', members: 4500000, online: 60000 },
    { name: 'Casting Network', members: 3800000, online: 45000 },
    { name: 'Film Producers Circle', members: 900000, online: 8000 },
    { name: 'Cinema Critics Chat', members: 6000000, online: 70000 },
    { name: 'Screenwriters Room', members: 1500000, online: 20000 },
    { name: 'Stunt & Action Crew', members: 700000, online: 6000 },
    { name: 'Film Festival Organizers', members: 400000, online: 3500 },
    // Interest groups (8)
    { name: 'Sci-Fi & Fantasy Fans', members: 20000000, online: 600000 },
    { name: 'Horror Movie Lovers', members: 18000000, online: 500000 },
    { name: 'Comedy Central Chat', members: 12000000, online: 350000 },
    { name: 'Thriller & Mystery Fans', members: 9500000, online: 280000 },
    { name: 'Documentary Discussion', members: 4200000, online: 90000 },
    { name: 'Anime & Animation Hub', members: 16000000, online: 450000 },
    { name: 'Westerns Appreciation', members: 2500000, online: 40000 },
    { name: 'Musical Theatre Fans', members: 3500000, online: 55000 },
  ];

  // Joined groups -> live chats (stable keys, no re-render crash)
  const joinedGroupChats = Array.from(joinedGroups).slice(0, 4).map((gname, i) => ({
    name: gname,
    members: groups.find((g) => g.name === gname)?.members || 1000000,
    online: Math.floor(Math.random() * 50000) + 500,
    msg: latest
      ? `${['The group is discussing', 'Someone shared the trailer for', 'Live discussion happening about'][i % 3]} '${latest.movieTitle}' — join in!`
      : 'New messages from the group!',
  }));

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

      {openChat && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <button onClick={() => setOpenChat(null)} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer">← Back</button>
            <span className="text-xs font-black">{openChat.name}</span>
            <span className="text-[9px] text-emerald-400 font-bold">{openChat.members?.toLocaleString()} members</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="max-w-[80%] bg-sky-600/20 border border-sky-500/30 rounded-2xl rounded-tl-sm p-3 text-xs text-gray-200 self-start">
              <p className="text-[9px] text-sky-300 font-bold mb-1">JaneDoe_99</p>
              {latest ? `Did everyone see '${latest.movieTitle}'?? The box office numbers are unreal 🍿` : 'Welcome to the group!'}
            </div>
            <div className="max-w-[80%] bg-sky-600/20 border border-sky-500/30 rounded-2xl rounded-tl-sm p-3 text-xs text-gray-200 self-start">
              <p className="text-[9px] text-sky-300 font-bold mb-1">CineLover88</p>
              {latest ? `That opening scene though... 🔥 Absolute cinema.` : 'Glad to be here!'}
            </div>
            <div className="max-w-[80%] bg-sky-600/20 border border-sky-500/30 rounded-2xl rounded-tl-sm p-3 text-xs text-gray-200 self-start">
              <p className="text-[9px] text-sky-300 font-bold mb-1">MovieBuff</p>
              {latest ? `I've seen it 3 times already. Worth every dollar.` : 'The community is growing fast!'}
            </div>
          </div>
          <div className="flex gap-2 p-3 border-t border-white/10">
            <input
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              placeholder="Message the group..."
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-3 py-2.5 text-xs outline-none"
            />
            <button
              onClick={() => { if (chatMsg.trim()) { setChatMsg(''); setFb('Message sent to the group!'); setTimeout(() => setFb(null), 2500); } }}
              className="px-4 py-2 rounded-2xl bg-sky-600 text-white text-[10px] font-black cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
        <span className="text-sm font-black tracking-wide">✈️ Telegram</span>
        <WriterSheet state={state} platform="telegram" onRefresh={() => setState({ ...SocialsService.getState() })} />
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
          {joinedGroupChats.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-gray-300 pt-1">Joined groups</h3>
              {joinedGroupChats.map((g) => (
                <div key={g.name} className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xs font-black shrink-0"><Users className="w-4 h-4 text-sky-300" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black">{g.name} <span className="text-[9px] text-sky-300 font-bold">● live</span></p>
                    <p className="text-[10px] text-gray-400">{g.members.toLocaleString()} members · {g.online.toLocaleString()} online · {g.msg}</p>
                  </div>
                  <button onClick={() => setOpenChat(g)} className="px-2.5 py-1.5 rounded-lg bg-sky-600 text-white text-[9px] font-black cursor-pointer">Open</button>
                </div>
              ))}
            </div>
          )}
          <h3 className="text-xs font-black uppercase text-gray-300 pt-2">Groups</h3>
          {groups.map((g) => (
            <div key={g.name} className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xs font-black shrink-0"><Users className="w-4 h-4 text-purple-300" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black">{g.name}</p>
                <p className="text-[10px] text-gray-400">{g.members.toLocaleString()} members · {g.online.toLocaleString()} online</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => toggleJoinGroup(g.name)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                    joinedGroups.has(g.name) ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-sky-600 text-white'
                  }`}
                >
                  {joinedGroups.has(g.name) ? '✓ Joined' : 'Join'}
                </button>
                <button onClick={() => setOpenChat(g)} className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-black cursor-pointer">Open</button>
              </div>
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
