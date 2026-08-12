/**
 * HOLLYWOOD RISING - Official Fan Club Sub-View (Rebuilt)
 * 5 membership tiers with YEARLY dues paid in weekly installments:
 *   Backstage $100 | Front Row $350 | Red Carpet $1,000 | Director's Suite $5,000 | Legend Circle $8,000
 * Own member feed with real NPC fan comments reacting to your real movies.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState, FanClubTierId } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import {
  Heart,
  ArrowLeft,
  Users,
  Sparkles,
  Send,
  Crown,
  Star,
  Film,
  Rocket,
  MessageCircle,
  Ticket,
  Megaphone,
} from 'lucide-react';

interface FanClubViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

const TIER_META: { id: FanClubTierId; name: string; yearly: number; color: string; icon: string; perks: string }[] = [
  { id: 'backstage', name: 'Backstage Pass', yearly: 100, color: 'text-gray-300 border-gray-500/40', icon: '🎟️', perks: 'Fan feed access, member polls, early news' },
  { id: 'frontRow', name: 'Front Row', yearly: 350, color: 'text-sky-300 border-sky-500/40', icon: '🪑', perks: '+ merch discount, member Q&A sessions' },
  { id: 'redCarpet', name: 'Red Carpet', yearly: 1000, color: 'text-rose-300 border-rose-500/40', icon: '🎬', perks: '+ early screening posts, behind-the-scenes' },
  { id: 'directorSuite', name: "Director's Suite", yearly: 5000, color: 'text-amber-300 border-amber-500/40', icon: '🌆', perks: '+ private events, priority premiere access' },
  { id: 'legendCircle', name: 'Legend Circle', yearly: 8000, color: 'text-yellow-300 border-yellow-500/40', icon: '👑', perks: '+ named in your credits, private livestreams, top 1% only' },
];

export const FanClubView: React.FC<FanClubViewProps> = ({ representationState, onRefresh, onBack }) => {
  const { player, saveData, updateSave , persistNow } = useGame();
  const fanClub = representationState.fanClub;

  const [clubNameInput, setClubNameInput] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [feedPost, setFeedPost] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Establish Official Fan Club
  const handleEstablishClub = () => {
    if (!clubNameInput.trim()) {
      showFeedback('Please enter a name for your official fan club.');
      return;
    }
    const cost = 5000;
    if (player.money < cost) {
      showFeedback(`Insufficient funds! Establishing fan club requires $${cost.toLocaleString()}.`);
      return;
    }

    player.money -= cost;
    persistNow();
    const state = RepresentationService.getState();
    const initialMembers = Math.min(10, Math.max(2, player.fans || 5));

    state.fanClub = {
      isCreated: true,
      name: clubNameInput.trim(),
      createdWeek: player.dateWeek,
      createdYear: player.dateYear,
      membersCount: initialMembers,
      freeMembers: Math.floor(initialMembers * 0.76),
      silverMembers: Math.floor(initialMembers * 0.14),
      goldVipMembers: Math.max(1, initialMembers - Math.floor(initialMembers * 0.9)),
      weeklyDuesRevenue: 2,
      announcements: [
        {
          id: `ann_${Date.now()}`,
          title: `WELCOME TO THE OFFICIAL ${clubNameInput.trim().toUpperCase()} FAN CLUB!`,
          content: `Thank you for joining our official community! Stay tuned for exclusive behind-the-scenes content and VIP event invitations.`,
          date: `Week ${player.dateWeek}, ${player.dateYear}`,
        },
      ],
      hostedEventsCount: 0,
      tierCounts: {
        backstage: Math.max(1, Math.floor(initialMembers * 0.5)),
        frontRow: Math.max(1, Math.floor(initialMembers * 0.26)),
        redCarpet: Math.floor(initialMembers * 0.14),
        directorSuite: Math.floor(initialMembers * 0.07),
        legendCircle: Math.max(0, initialMembers - Math.floor(initialMembers * 0.97)),
      },
      feed: [
        {
          id: `fc_welcome_${Date.now()}`,
          author: 'Club Staff',
          tier: 'Staff',
          text: `Welcome to the official ${clubNameInput.trim()} Fan Club! 🎉 Memberships from $100/year (Backstage Pass) to $8,000/year (Legend Circle).`,
          likes: 250,
          week: player.dateWeek,
          year: player.dateYear,
        },
      ],
    };

    RepresentationService.saveState(state);
    updateSave({ ...saveData, player: { ...player } });
    showFeedback(`❤️ Official Fan Club "${clubNameInput.trim()}" established!`);
    onRefresh();
  };

  // Host Fan Event
  const handleHostEvent = (eventName: string, cost: number, fansGained: number) => {
    if (player.money < cost) {
      showFeedback(`Insufficient funds! Hosting ${eventName} requires $${cost.toLocaleString()}.`);
      return;
    }

    player.money -= cost;
    persistNow();
    player.fans = (player.fans || 0) + fansGained;

    const state = RepresentationService.getState();
    state.fanClub.membersCount += Math.floor(fansGained * 0.5);
    state.fanClub.hostedEventsCount += 1;
    state.reputation.publicReputation = Math.min(100, state.reputation.publicReputation + 5);
    state.fanClub.feed.unshift({
      id: `fc_event_${Date.now()}`,
      author: 'Club Staff',
      tier: 'Staff',
      text: `📅 Official event hosted: ${eventName}! Members who attended can't stop talking about it. 🎉`,
      likes: Math.floor(Math.random() * 500) + 100,
      week: player.dateWeek,
      year: player.dateYear,
    });
    state.fanClub.feed = state.fanClub.feed.slice(0, 60);

    RepresentationService.saveState(state);
    updateSave({ ...saveData, player: { ...player } });
    showFeedback(`🎉 Hosted ${eventName}! Gained +${fansGained} Fans and boosted Public Reputation.`);
    onRefresh();
  };

  // Post Announcement
  const handlePostAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      showFeedback('Please enter title and content.');
      return;
    }
    const state = RepresentationService.getState();
    state.fanClub.announcements.unshift({
      id: `ann_${Date.now()}`,
      title: announcementTitle.trim(),
      content: announcementContent.trim(),
      date: `Week ${player.dateWeek}, ${player.dateYear}`,
    });
    RepresentationService.saveState(state);
    setAnnouncementTitle('');
    setAnnouncementContent('');
    showFeedback('📢 Announcement posted to official fan club dashboard!');
    onRefresh();
  };

  // Post to the member feed
  const handlePostFeed = () => {
    if (!feedPost.trim()) return;
    const res = RepresentationService.postFanClubFeed(feedPost.trim(), player);
    if (res.success) {
      setFeedPost('');
      showFeedback(res.message);
      onRefresh();
    } else {
      showFeedback(res.message);
    }
  };

  const tierCounts = fanClub.tierCounts || { backstage: 0, frontRow: 0, redCarpet: 0, directorSuite: 0, legendCircle: 0 };
  const yearlyTotal =
    tierCounts.backstage * 100 +
    tierCounts.frontRow * 350 +
    tierCounts.redCarpet * 1000 +
    tierCounts.directorSuite * 5000 +
    tierCounts.legendCircle * 8000;
  const activeFeed = fanClub.feed || [];

  return (
    <div className="space-y-6 text-white select-none pb-12">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-black text-center shadow">
          {feedback}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Representation</span>
        </button>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">OFFICIAL FAN CLUB</h2>
        </div>
      </div>

      {!fanClub.isCreated ? (
        /* ESTABLISH FAN CLUB CARD */
        <div className="p-8 rounded-3xl border border-rose-500/30 bg-black/60 backdrop-blur-md text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400/50 flex items-center justify-center mx-auto shadow-xl">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Incorporate Official Fan Club</h3>
            <p className="text-xs text-gray-400">
              Establish a dedicated fan society with 5 membership tiers — from $100/year Backstage Passes to $8,000/year
              Legend Circle. Members get an exclusive feed, and your club earns weekly dues.
            </p>
          </div>

          {/* Tier preview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
            {TIER_META.map((t) => (
              <div key={t.id} className={`p-2.5 rounded-xl bg-black/40 border ${t.color.split(' ')[1]} bg-black/40`}>
                <span className="text-lg">{t.icon}</span>
                <p className="text-[10px] font-black mt-1">{t.name}</p>
                <p className="text-[10px] text-emerald-400 font-bold">${t.yearly.toLocaleString()}/yr</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Fan Club Name</label>
              <input
                type="text"
                placeholder={`e.g., ${player.lastName} Army, The ${player.firstName} Society`}
                value={clubNameInput}
                onChange={(e) => setClubNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-rose-400"
              />
            </div>
            <button
              onClick={handleEstablishClub}
              className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all shadow-xl hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>LAUNCH FAN CLUB ($5,000)</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE FAN CLUB DASHBOARD */
        <div className="space-y-6">
          {/* Top Fan Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/30">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Members</span>
              <span className="text-xl font-black text-white">{fanClub.membersCount.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Yearly Dues Revenue</span>
              <span className="text-xl font-black text-emerald-400">${yearlyTotal.toLocaleString()}/yr</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Weekly Dues Income</span>
              <span className="text-xl font-black text-amber-300">+${fanClub.weeklyDuesRevenue.toLocaleString()}/wk</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Events Hosted</span>
              <span className="text-xl font-black text-gray-200">{fanClub.hostedEventsCount}</span>
            </div>
          </div>

          {/* 5 Membership Tiers */}
          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-300 tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" /> Membership Tiers (yearly dues, paid weekly)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {TIER_META.map((t) => (
                <div key={t.id} className={`p-4 rounded-2xl border bg-black/40 ${t.color.split(' ')[1]} space-y-2`}>
                  <div className="text-2xl">{t.icon}</div>
                  <h4 className="text-xs font-black text-white leading-tight">{t.name}</h4>
                  <p className="text-[10px] text-gray-400 leading-snug">{t.perks}</p>
                  <div className="pt-1">
                    <p className="text-sm font-black text-emerald-400">${t.yearly.toLocaleString()}/yr</p>
                    <p className="text-[9px] text-gray-500">≈ ${Math.round((t.yearly / 52) * 100) / 100}/wk</p>
                  </div>
                  <div className="pt-1 border-t border-white/10">
                    <p className="text-lg font-black text-white">{tierCounts[t.id].toLocaleString()}</p>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Feed */}
          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-300 tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-rose-400" /> Member Feed
            </h3>

            {/* Post to feed */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Post an update for your members (release dates, award wins, merch drops)..."
                value={feedPost}
                onChange={(e) => setFeedPost(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-rose-400"
              />
              <button
                onClick={handlePostFeed}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>POST</span>
              </button>
            </div>

            {/* Feed items */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {activeFeed.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-8">No feed posts yet. Your members are waiting!</p>
              )}
              {activeFeed.slice(0, 30).map((item) => {
                const tierMeta = item.tier === 'Staff' ? null : TIER_META.find((t) => t.id === item.tier);
                return (
                  <div key={item.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-xs">
                          {item.isPlayer ? '⭐' : tierMeta ? tierMeta.icon : '🎙️'}
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-white">{item.author}</p>
                          <p className="text-[9px] text-gray-500 uppercase font-bold">
                            {item.isPlayer ? 'Club Owner' : tierMeta ? `${tierMeta.name} Member` : 'Club Staff'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-500">W{item.week}, {item.year}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{item.text}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                      <Heart className="w-3 h-3 text-rose-400" /> {item.likes.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Host Fan Events */}
          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-300 tracking-wider flex items-center gap-2">
              <Rocket className="w-4 h-4 text-amber-400" /> Host Official Fan Events
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2">
                <h4 className="text-sm font-black text-white">Hollywood Autograph Session</h4>
                <p className="text-xs text-gray-400">Sign posters & headshots at TCL Chinese Theatre.</p>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-rose-400 font-bold">+100 Fans</span>
                  <button
                    onClick={() => handleHostEvent('Autograph Session', 1500, 100)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer"
                  >
                    Host ($1,500)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2">
                <h4 className="text-sm font-black text-white">Exclusive VIP Q&A Livestream</h4>
                <p className="text-xs text-gray-400">Host private interactive livestream for top-tier members.</p>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-rose-400 font-bold">+300 Fans</span>
                  <button
                    onClick={() => handleHostEvent('VIP Livestream', 3000, 300)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer"
                  >
                    Host ($3,000)
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2">
                <h4 className="text-sm font-black text-white">Bel-Air Fan Gala & Concert</h4>
                <p className="text-xs text-gray-400">Host luxury red carpet celebration for top supporters.</p>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-rose-400 font-bold">+1,000 Fans</span>
                  <button
                    onClick={() => handleHostEvent('Bel-Air Fan Gala', 10000, 1000)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer"
                  >
                    Host ($10,000)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-300 tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-400" /> Announcements
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Announcement Headline"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none"
              />
              <textarea
                rows={2}
                placeholder="Message to fan club members..."
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none"
              />
              <button
                onClick={handlePostAnnouncement}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>POST ANNOUNCEMENT</span>
              </button>
            </div>

            {/* Announcement list */}
            {fanClub.announcements.length > 0 && (
              <div className="space-y-2">
                {fanClub.announcements.slice(0, 5).map((ann) => (
                  <div key={ann.id} className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <p className="text-xs font-black text-white">{ann.title}</p>
                    <p className="text-[10px] text-gray-500">{ann.date}</p>
                    <p className="text-xs text-gray-300 mt-1">{ann.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
