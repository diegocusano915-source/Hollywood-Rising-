/**
 * HOLLYWOOD RISING - Game Completion Tracker & Hidden Achievements
 * Comprehensive tracking across Career, Empire, Awards, Business, Relationships & Hollywood.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Award,
  Crown,
  Lock,
  CheckCircle2,
  PieChart,
  Briefcase,
  Building2,
  Users,
  Sparkles,
  Star,
  Film,
  TrendingUp,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface AchievementItem {
  id: string;
  category: 'Career' | 'Empire' | 'Awards' | 'Business' | 'Relationships' | 'Hollywood';
  title: string;
  description: string;
  isUnlocked: boolean;
  isHidden?: boolean;
}

export const CompletionTrackerModal: React.FC = () => {
  const { setActiveModal, player, saveData, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // Calculate percentage per domain
  const careerUnlocked = (player.isUnionMember ? 1 : 0) + (player.leadRolesCount >= 4 ? 1 : 0) + (player.fameXp >= 100 ? 1 : 0) + (player.fameXp >= 800 ? 1 : 0);
  const careerPct = Math.min(100, Math.round((careerUnlocked / 4) * 100));

  const empireUnlocked = (player.empire?.indieStudioOwned ? 2 : 0) + Math.min(3, player.empire?.realEstateUnits || 0);
  const empirePct = Math.min(100, Math.round((empireUnlocked / 5) * 100));

  const awardsUnlocked = Math.min(player.awardsWon || 0, 5);
  const awardsPct = Math.min(100, Math.round((awardsUnlocked / 5) * 100));

  const businessUnlocked = (player.representation?.agent ? 1 : 0) + (player.representation?.manager ? 1 : 0) + (player.money >= 500000 ? 1 : 0);
  const businessPct = Math.min(100, Math.round((businessUnlocked / 3) * 100));

  const relsCount = saveData.relationships?.filter((r) => r.relationshipLevel >= 50).length || 0;
  const relsPct = Math.min(100, Math.round((relsCount / 3) * 100));

  const hollywoodPct = Math.min(100, Math.round(((player.fans || 0) / 100000) * 100));

  const overallPct = Math.round(
    (careerPct + empirePct + awardsPct + businessPct + relsPct + hollywoodPct) / 6
  );

  const achievements: AchievementItem[] = [
    {
      id: 'ach_sag',
      category: 'Career',
      title: 'SAG-AFTRA Member',
      description: 'Joined the screen actors guild after 4 lead roles.',
      isUnlocked: player.isUnionMember,
    },
    {
      id: 'ach_alist',
      category: 'Career',
      title: 'A-List Superstar',
      description: 'Reached 800+ Fame XP and A-List actor tier.',
      isUnlocked: (player.fameXp || 0) >= 800,
    },
    {
      id: 'ach_studio',
      category: 'Empire',
      title: 'Mogul Studio Head',
      description: 'Purchased and founded your own film production lot.',
      isUnlocked: !!player.empire?.indieStudioOwned,
    },
    {
      id: 'ach_estate',
      category: 'Empire',
      title: 'Beverly Hills Landlord',
      description: 'Owned 3 or more luxury real estate properties.',
      isUnlocked: (player.empire?.realEstateUnits || 0) >= 3,
    },
    {
      id: 'ach_oscar',
      category: 'Awards',
      title: 'Academy Award Winner',
      description: 'Won an Oscar / Gold statuette at the annual gala.',
      isUnlocked: (player.awardsWon || 0) > 0,
    },
    {
      id: 'ach_millionaire',
      category: 'Business',
      title: 'Hollywood Millionaire',
      description: 'Accumulated over $1,000,000 in personal net worth.',
      isUnlocked: (player.money || 0) >= 1000000 || (player.netWorth || 0) >= 1000000,
    },
    {
      id: 'ach_hidden_1',
      category: 'Hollywood',
      title: 'Secret Oscar Sweep',
      description: 'Won Best Picture and Best Actor in the same awards season.',
      isUnlocked: (player.awardsWon || 0) >= 3,
      isHidden: true,
    },
    {
      id: 'ach_hidden_2',
      category: 'Relationships',
      title: 'Royal Wedding',
      description: 'Married an A-list celebrity co-star at a luxury estate.',
      isUnlocked: !!player.activeRelationshipId,
      isHidden: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-2xl rounded-3xl flex flex-col overflow-hidden border shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3 text-amber-400">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">GAME COMPLETION & ACHIEVEMENTS</h2>
              <p className="text-[11px] text-amber-300 font-medium">
                Track 100% completion across all Hollywood domains and hidden milestones.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Overall Completion Gauge Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 text-center space-y-2 shadow-xl relative overflow-hidden">
            <span className="text-[10px] text-amber-300 font-black uppercase tracking-widest block">
              Overall Game Completion
            </span>
            <div className="text-4xl font-black text-white flex items-center justify-center gap-1">
              <span>{overallPct}%</span>
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>

            <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-amber-500/30">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          {/* Domain Category Progress Bars */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-300 uppercase tracking-wider text-[11px]">
              Domain Progress Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-amber-400" /> Career Completion
                  </span>
                  <span className="font-black text-amber-300">{careerPct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${careerPct}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-400" /> Empire & Studios
                  </span>
                  <span className="font-black text-purple-300">{empirePct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full" style={{ width: `${empirePct}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-400" /> Academy & Awards
                  </span>
                  <span className="font-black text-yellow-300">{awardsPct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full" style={{ width: `${awardsPct}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-400" /> Business & Retainers
                  </span>
                  <span className="font-black text-emerald-400">{businessPct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${businessPct}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-rose-400" /> Relationships & Marriage
                  </span>
                  <span className="font-black text-rose-300">{relsPct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full" style={{ width: `${relsPct}%` }} />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-sky-400" /> Hollywood & Fame
                  </span>
                  <span className="font-black text-sky-400">{hollywoodPct}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full" style={{ width: `${hollywoodPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Key Achievements Grid */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px]">
              Trophies & Hidden Achievements
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((ach) => {
                if (ach.isHidden && !ach.isUnlocked) {
                  return (
                    <div
                      key={ach.id}
                      className="p-3.5 rounded-2xl bg-black/50 border border-dashed border-gray-700 opacity-60 flex items-center gap-3"
                    >
                      <div className="p-2 rounded-xl bg-gray-800 border border-gray-700">
                        <Lock className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-xs">??? Hidden Achievement</span>
                        <span className="text-[10px] text-gray-500 italic">Keep playing to discover secret milestone.</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                      ach.isUnlocked
                        ? 'bg-amber-500/10 border-amber-400/50 shadow-md'
                        : 'bg-black/40 border-white/10 opacity-70'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl border ${
                        ach.isUnlocked ? 'bg-amber-400 text-black border-amber-300' : 'bg-gray-800 text-gray-500 border-white/10'
                      }`}
                    >
                      {ach.isUnlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div>
                      <h5 className="font-black text-white text-xs">{ach.title}</h5>
                      <p className="text-[10px] text-gray-300">{ach.description}</p>
                      <span className="text-[9px] font-bold text-amber-300 uppercase">{ach.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
