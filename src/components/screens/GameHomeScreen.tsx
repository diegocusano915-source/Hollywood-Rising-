/**
 * HOLLYWOOD RISING - Game Home Screen
 * Pure Grounded Dashboard with no fake stats or fake notifications.
 * Renders main screen tabs: HOME, TALENT, WORLD, NETWORK, EMPIRE, REPRESENTATION
 * Persistent Bottom Navigation Bar across all scenes.
 */

import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Film,
  Clapperboard,
  Video,
  TrendingUp,
  Mail,
  ShieldCheck,
  Heart,
  Settings,
  HelpCircle,
  Zap,
  DollarSign,
  Calendar,
  Sparkles,
  Award,
  History,
  Cake,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';
import { FameService } from '../../services/fameService';
import { BottomNavigation } from '../common/BottomNavigation';
import { TalentScreen } from './TalentScreen';
import { WorldScreen } from './WorldScreen';
import { NetworkScreen } from './NetworkScreen';
import { EmpireScreen } from './EmpireScreen';
import { RepresentationScreen } from './RepresentationScreen';
import { AnimatedCounter } from '../common/AnimatedCounter';

export const GameHomeScreen: React.FC = () => {
  const {
    player,
    activeMainTab,
    setActiveModal,
    advanceWeek,
    inbox,
    auditions,
    bookedProjects,
    relationships,
    settings,
    saveData,
  } = useGame();

  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // Notification Center badge: unread "while you were away" + unseen live alerts

  const unreadInboxCount = inbox.filter((m) => !m.read).length;
  const activeBookingsCount = bookedProjects.length;
  const pendingAuditionsCount = auditions.length;

  // Calculate real net worth from cash
  const realNetWorth = player.money + (player.engagementRingValue || 0);

  // Compute Fame Level details
  const fameDetails = FameService.getFameLevelDetails(player.fameXp || 0);

  const renderActiveScreen = () => {
    switch (activeMainTab) {
      case 'TALENT':
        return <TalentScreen />;
      case 'WORLD':
        return <WorldScreen />;
      case 'NETWORK':
        return <NetworkScreen />;
      case 'EMPIRE':
        return <EmpireScreen />;
      case 'REPRESENTATION':
        return <RepresentationScreen />;
      case 'HOME':
      default:
        return (
          <div
            className="w-full min-h-full flex flex-col p-4 select-none pb-10"
            style={{ backgroundColor: theme.background }}
          >
            {/* Top Status Header Bar */}
            <div
              className="rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-3 shadow-xl mb-4"
              style={{
                backgroundColor: theme.headers,
                borderColor: theme.borderDark,
              }}
            >
              {/* Profile Identity */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/60 bg-gray-900 shrink-0 shadow">
                  <img src={player.avatarUrl} alt={player.firstName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                    {player.firstName} {player.lastName}
                    {player.isUnionMember && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </h2>
                  <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Week {player.dateWeek}, Year {player.dateYear}
                    <span className="text-gray-400">·</span>
                    <Cake className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-pink-300 font-bold">{player.age || 21} yrs</span>
                  </p>
                </div>
              </div>

              {/* Energy & Cash Counters */}
              <div className="flex items-center gap-3">
                {/* Cash */}
                <div className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-emerald-500/30 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 uppercase block font-semibold">Cash</span>
                    <AnimatedCounter value={player.money} formatting="currency" className="text-xs font-bold text-emerald-400" />
                  </div>
                </div>

                {/* Energy */}
                <div className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-current" />
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 uppercase block font-semibold">Energy</span>
                    <span className="text-xs font-bold text-amber-300">
                      {player.energy} / {player.maxEnergy}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Bar (End Week) */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-semibold">Status:</span>
                <span className="font-extrabold text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {player.isUnionMember ? 'SAG-AFTRA Member' : 'Non-Union Actor'}
                </span>
              </div>

              {/* END WEEK Action Button */}
              <button
                onClick={advanceWeek}
                className="px-5 py-2.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: theme.primary,
                  color: '#000000',
                }}
              >
                <Zap className="w-4 h-4 fill-current text-black" />
                <span>END WEEK</span>
              </button>
            </div>

            {/* Grounded Career Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {/* Real Net Worth */}
              <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-black/40 backdrop-blur-md">
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">Net Worth</span>
                <AnimatedCounter value={realNetWorth} formatting="currency" className="text-base font-black text-emerald-400" />
              </div>

              {/* Verified Fans */}
              <div className="p-3.5 rounded-2xl border border-sky-500/30 bg-black/40 backdrop-blur-md">
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">Verified Fans</span>
                <AnimatedCounter value={player.fans} formatting="number" className="text-base font-black text-sky-400" />
              </div>

              {/* Filmography */}
              <div className="p-3.5 rounded-2xl border border-purple-500/30 bg-black/40 backdrop-blur-md">
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">Movies Completed</span>
                <span className="text-base font-black text-purple-400">{player.moviesCompleted} Films</span>
              </div>

              {/* Fame XP & Level Bar */}
              <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-black/40 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">
                    Lvl {fameDetails.level} • {fameDetails.title}
                  </span>
                  <AnimatedCounter value={player.fameXp || 0} suffix=" XP" className="text-sm font-black text-amber-300" />
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2 border border-amber-500/20">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, fameDetails.progressPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Core Navigation Grid */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clapperboard className="w-4 h-4 text-amber-400" />
                Core Career Systems
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Career Stats Hub */}
                <button
                  onClick={() => setActiveModal('career_stats')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-emerald-500/30 hover:border-emerald-400 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Analytics
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Career Stats Hub</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Box office, salaries & hit records</p>
                </button>

                {/* Retainer & Representation Hub */}
                <button
                  onClick={() => setActiveModal('retainer_management')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-amber-500/30 hover:border-amber-400 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                      7 Retainers
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Retainer Hub</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Lawyers, agents, managers & security</p>
                </button>

                {/* Photo Mode */}
                <button
                  onClick={() => setActiveModal('photo_mode')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-sky-500/30 hover:border-sky-400 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded">
                      Press Card
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Photo Mode</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Red carpet & press snapshots</p>
                </button>

                {/* Completion 100% Tracker */}
                <button
                  onClick={() => setActiveModal('completion_tracker')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-yellow-500/30 hover:border-yellow-400 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded">
                      Completion
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">100% Completion</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Trophies & hidden milestones</p>
                </button>

                {/* Career Timeline */}
                <button
                  onClick={() => setActiveModal('career_timeline')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-purple-500/30 hover:border-purple-400 cursor-pointer col-span-2 md:col-span-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <History className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                      Timeline
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Career History</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Permanent career events & milestones</p>
                </button>

                {/* Callboard */}
                <button
                  onClick={() => setActiveModal('callboard')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-white/10 hover:border-amber-400/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Film className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                      Audition Offers
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Callboard</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Browse available movie scripts</p>
                </button>

                {/* Auditions */}
                <button
                  onClick={() => setActiveModal('auditions')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-white/10 hover:border-sky-400/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Video className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                    {pendingAuditionsCount > 0 && (
                      <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">
                        {pendingAuditionsCount} Pending
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">Auditions</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Track casting callback progress</p>
                </button>

                {/* Production Hub */}
                <button
                  onClick={() => setActiveModal('booking')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-white/10 hover:border-purple-400/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clapperboard className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    {bookedProjects.some((b) => b.status === 'Pending Negotiation') ? (
                      <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/50 animate-pulse">
                        {bookedProjects.filter((b) => b.status === 'Pending Negotiation').length} Greenlit Sequel
                      </span>
                    ) : activeBookingsCount > 0 ? (
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                        {activeBookingsCount} Active
                      </span>
                    ) : null}
                  </div>
                  <h4 className="text-sm font-bold text-white">Production Hub</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Active film & series productions</p>
                </button>

                {/* Releases / Box Office */}
                <button
                  onClick={() => setActiveModal('releases')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-white/10 hover:border-emerald-400/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      IMDb Career
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Movie Releases</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Box office & theater rankings</p>
                </button>

                {/* SAG-AFTRA Membership */}
                <button
                  onClick={() => setActiveModal('membership')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-white/10 hover:border-amber-400/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-amber-300">
                      {player.leadRolesCount}/4 Leads
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">SAG Membership</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Guild status ($2,000 + 4 Leads)</p>
                </button>

                {/* Relationships & Dating */}
                <button
                  onClick={() => setActiveModal('relationships')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-white/10 hover:border-rose-400/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-rose-300">
                      {relationships.filter((r) => r.stage !== 'Stranger').length} Contacts
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Relationships</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Dating, gifts & marriage</p>
                </button>

                {/* Inbox */}
                <button
                  onClick={() => setActiveModal('inbox')}
                  className="p-4 rounded-xl border text-left bg-black/40 hover:bg-black/60 transition-all group border-white/10 hover:border-indigo-400/50 cursor-pointer col-span-2 md:col-span-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Mail className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    {unreadInboxCount > 0 && (
                      <span className="text-[10px] font-extrabold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                        {unreadInboxCount} New
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">Inbox</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Casting, Dating & Finance</p>
                </button>
              </div>
            </div>

            {/* Quick Settings & Help Row */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <button
                onClick={() => setActiveModal('how_to_play')}
                className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Interactive Tutorial</span>
              </button>

              <button
                onClick={() => setActiveModal('settings')}
                className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Settings & Theme Options</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full min-h-screen w-full flex flex-col justify-between overflow-hidden" style={{ backgroundColor: theme.background }}>
      {/* Active Tab Screen Content */}
      <div className="flex-1 w-full overflow-y-auto min-h-0">
        {renderActiveScreen()}
      </div>

      {/* Persistent Bottom Navigation Bar across all major scenes */}
      <BottomNavigation />
    </div>
  );
};
