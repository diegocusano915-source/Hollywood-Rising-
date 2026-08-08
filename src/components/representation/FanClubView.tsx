/**
 * HOLLYWOOD RISING - Official Fan Club Sub-View
 * Allows creating, managing, and monetizing the official global fan club.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { Heart, ArrowLeft, Users, Sparkles, Plus, Calendar, DollarSign, Send } from 'lucide-react';

interface FanClubViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const FanClubView: React.FC<FanClubViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player } = useGame();
  const fanClub = representationState.fanClub;

  const [clubNameInput, setClubNameInput] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Establish Official Fan Club
  const handleEstablishClub = () => {
    if (!clubNameInput.trim()) {
      setFeedback('Please enter a name for your official fan club.'); setTimeout(() => setFeedback(null), 3000);
      return;
    }
    const cost = 5000;
    if (player.money < cost) {
      setFeedback(`Insufficient funds! Establishing fan club requires $${cost.toLocaleString()}.`); setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= cost;
    const state = RepresentationService.getState();
    const initialMembers = Math.min(10, Math.max(2, player.fans || 5));
    const free = Math.max(1, initialMembers - 1);
    const silver = 1;
    const gold = 0;

    state.fanClub = {
      isCreated: true,
      name: clubNameInput.trim(),
      createdWeek: player.dateWeek,
      createdYear: player.dateYear,
      membersCount: initialMembers,
      freeMembers: free,
      silverMembers: silver,
      goldVipMembers: gold,
      weeklyDuesRevenue: silver * 2 + gold * 10,
      announcements: [
        {
          id: `ann_${Date.now()}`,
          title: `WELCOME TO THE OFFICIAL ${clubNameInput.trim().toUpperCase()} FAN CLUB!`,
          content: `Thank you for joining our official community! Stay tuned for exclusive behind-the-scenes content and VIP event invitations.`,
          date: `Week ${player.dateWeek}, ${player.dateYear}`,
        },
      ],
      hostedEventsCount: 0,
    };

    RepresentationService.saveState(state);
    setFeedback(`❤️ Official Fan Club "${clubNameInput.trim()}" established!`); setTimeout(() => setFeedback(null), 3000);
    onRefresh();
  };

  // Host Fan Event
  const handleHostEvent = (eventName: string, cost: number, fansGained: number) => {
    if (player.money < cost) {
      setFeedback(`Insufficient funds! Hosting ${eventName} requires $${cost.toLocaleString()}.`); setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= cost;
    player.fans = (player.fans || 0) + fansGained;

    const state = RepresentationService.getState();
    state.fanClub.membersCount += Math.floor(fansGained * 0.5);
    state.fanClub.hostedEventsCount += 1;
    state.reputation.publicReputation = Math.min(100, state.reputation.publicReputation + 5);

    RepresentationService.saveState(state);
    setFeedback(`🎉 Hosted ${eventName}! Gained +${fansGained} Fans and boosted Public Reputation.`); setTimeout(() => setFeedback(null), 3000);
    onRefresh();
  };

  // Post Announcement
  const handlePostAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      setFeedback('Please enter title and content.'); setTimeout(() => setFeedback(null), 3000);
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
    setFeedback('📢 Announcement posted to official fan club dashboard!'); setTimeout(() => setFeedback(null), 3000);
    onRefresh();
  };

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
              Establish a dedicated fan society to host meetups, send exclusive updates, and collect weekly membership dues.
            </p>
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
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Silver Members ($2/wk)</span>
              <span className="text-xl font-black text-gray-300">{fanClub.silverMembers.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Gold VIPs ($10/wk)</span>
              <span className="text-xl font-black text-amber-300">{fanClub.goldVipMembers.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Weekly Dues Revenue</span>
              <span className="text-xl font-black text-emerald-400">+${fanClub.weeklyDuesRevenue.toLocaleString()}/wk</span>
            </div>
          </div>

          {/* Host Fan Events */}
          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-300 tracking-wider">Host Official Fan Events</h3>
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
                <p className="text-xs text-gray-400">Host private interactive livestream for Gold VIP fans.</p>
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

          {/* Post Announcement */}
          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-black uppercase text-gray-300 tracking-wider">Post Fan Club Announcement</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Announcement Headline"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none"
              />
              <textarea
                rows={3}
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
          </div>
        </div>
      )}
    </div>
  );
};
