/**
 * HOLLYWOOD RISING - Awards & Recognition Overhaul V1
 * Hardcore Competitive Awards System (Oscars, Emmys, Golden Globes, SAG, Cannes, BAFTA & 25+ Awards)
 * 3 Cards Per Row Grid View layout for all sections.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  AwardItem,
  AwardPrestige,
  AwardPrediction,
  AwardSeasonStage,
  AwardCampaignOption,
  CareerAwardHistory,
} from '../../types/world';
import {
  Award,
  Trophy,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Flame,
  Star,
  TrendingUp,
  AlertTriangle,
  Crown,
  Tv,
  Video,
  Users,
  BarChart3,
  Check,
  ChevronRight,
  Newspaper,
  Zap,
  DollarSign,
  Megaphone,
  Radio,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';
import { AwardCeremonyCinematicModal } from '../modals/AwardCeremonyCinematicModal';

interface AwardsViewProps {
  onBack: () => void;
}

const STORAGE_KEY_AWARDS = 'HOLLYWOOD_AWARDS_CAREER_V1';

// 26 Major Hollywood Awards Catalog
const ALL_AWARDS_CATALOG: {
  id: string;
  eventName: string;
  categoryName: string;
  prestige: AwardPrestige;
  description: string;
}[] = [
  { id: 'aw_osc_1', eventName: 'Academy Awards (Oscars)', categoryName: 'Best Actor', prestige: 'Legendary', description: 'The pinnacle of global cinematic achievement in a leading acting role.' },
  { id: 'aw_osc_2', eventName: 'Academy Awards (Oscars)', categoryName: 'Best Actress', prestige: 'Legendary', description: 'The highest acting honor for a female lead in a motion picture.' },
  { id: 'aw_osc_3', eventName: 'Academy Awards (Oscars)', categoryName: 'Best Supporting Actor', prestige: 'Global', description: 'Recognizing unforgettable supporting performance in a feature film.' },
  { id: 'aw_osc_4', eventName: 'Academy Awards (Oscars)', categoryName: 'Best Supporting Actress', prestige: 'Global', description: 'Excellence in a supporting motion picture performance.' },
  { id: 'aw_osc_5', eventName: 'Academy Awards (Oscars)', categoryName: 'Best Motion Picture', prestige: 'Legendary', description: 'Awarded to the most outstanding film production of the year.' },

  { id: 'aw_glob_1', eventName: 'Golden Globe Awards', categoryName: 'Best Performance in a Motion Picture - Drama', prestige: 'Global', description: 'Hollywood Foreign Press honor for dramatic cinematic excellence.' },
  { id: 'aw_glob_2', eventName: 'Golden Globe Awards', categoryName: 'Best Performance in a Motion Picture - Musical/Comedy', prestige: 'Global', description: 'Honoring comedic and musical acting talent on the big screen.' },
  { id: 'aw_glob_3', eventName: 'Golden Globe Awards', categoryName: 'Best Television Actor - Drama', prestige: 'Global', description: 'Premier award for leading performances in dramatic television.' },

  { id: 'aw_sag_1', eventName: 'SAG Awards', categoryName: 'Outstanding Performance by a Male Actor in a Leading Role', prestige: 'National', description: 'Voted on exclusively by fellow professional actor peers in the guild.' },
  { id: 'aw_sag_2', eventName: 'SAG Awards', categoryName: 'Outstanding Performance by a Female Actor in a Leading Role', prestige: 'National', description: 'Guild recognition for outstanding female leading performance.' },
  { id: 'aw_sag_3', eventName: 'SAG Awards', categoryName: 'Outstanding Stunt Ensemble in a Motion Picture', prestige: 'National', description: 'Celebrating extreme action choreography and stunt execution.' },

  { id: 'aw_can_1', eventName: 'Cannes Film Festival', categoryName: 'Palme d’Or Performance Prize', prestige: 'Legendary', description: 'The grand prize of international auteur cinema at the French Riviera.' },
  { id: 'aw_baft_1', eventName: 'BAFTA Film Awards', categoryName: 'Best Leading Actor', prestige: 'International', description: 'The British Academy’s highest film honor for dramatic acting.' },
  { id: 'aw_baft_2', eventName: 'BAFTA Film Awards', categoryName: 'Best Leading Actress', prestige: 'International', description: 'British Academy accolade for lead motion picture performance.' },

  { id: 'aw_emm_1', eventName: 'Primetime Emmy Awards', categoryName: 'Outstanding Lead Actor in a Drama Series', prestige: 'Global', description: 'Television Academy honor for peak television drama lead.' },
  { id: 'aw_emm_2', eventName: 'Primetime Emmy Awards', categoryName: 'Outstanding Drama Series', prestige: 'National', description: 'Recognizing the finest television drama series production.' },

  { id: 'aw_crit_1', eventName: 'Critics Choice Awards', categoryName: 'Best Action Performance', prestige: 'National', description: 'Critic association trophy for intense high-octane blockbusters.' },
  { id: 'aw_crit_2', eventName: 'Critics Choice Awards', categoryName: 'Best Thriller Performance', prestige: 'National', description: 'Honoring nerve-shredding suspense and psychological drama.' },

  { id: 'aw_ven_1', eventName: 'Venice Film Festival', categoryName: 'Best Breakthrough Performance', prestige: 'International', description: 'Volpi Cup recognition for game-changing breakout roles.' },

  { id: 'aw_mtv_1', eventName: 'MTV Movie & TV Awards', categoryName: 'Best Rising Star', prestige: 'Regional', description: 'Pop-culture audience vote for Hollywood’s hottest emerging talent.' },
  { id: 'aw_mtv_2', eventName: 'MTV Movie & TV Awards', categoryName: 'Audience Choice Award', prestige: 'Local', description: 'Voted by fans worldwide for fan-favorite entertainment.' },
  { id: 'aw_mtv_3', eventName: 'MTV Movie & TV Awards', categoryName: 'Fan Favorite Performance', prestige: 'Local', description: 'Viral sensation & crowd favorite acting award.' },

  { id: 'aw_sat_1', eventName: 'Saturn Awards', categoryName: 'Best Sci-Fi Performance', prestige: 'National', description: 'Academy of Science Fiction, Fantasy & Horror Films honor.' },
  { id: 'aw_sat_2', eventName: 'Saturn Awards', categoryName: 'Best Horror Performance', prestige: 'National', description: 'Recognizing chill-inducing performances in terror & horror.' },

  { id: 'aw_holl_1', eventName: 'Hollywood Critics Association', categoryName: 'Best Comedy Performance', prestige: 'Regional', description: 'Leading comedy acting performance recognized by film press.' },
  { id: 'aw_holl_2', eventName: 'Hollywood Critics Association', categoryName: 'Studio Achievement Award', prestige: 'Regional', description: 'Recognizing box office power & studio leadership.' },

  { id: 'aw_leg_1', eventName: 'Hollywood Walk of Fame', categoryName: 'Lifetime Achievement', prestige: 'Legendary', description: 'Career-capping star embedded on Hollywood Boulevard.' },
  { id: 'aw_leg_2', eventName: 'World Cinema Guild', categoryName: 'International Icon', prestige: 'Global', description: 'Honoring artists whose impact transcends worldwide box office.' },
  { id: 'aw_leg_3', eventName: 'Global Film Federation', categoryName: 'Global Superstar', prestige: 'Legendary', description: 'Supreme honor for dominant box office and worldwide acclaim.' },
  { id: 'aw_leg_4', eventName: 'Directors Guild Honors', categoryName: 'Industry Excellence', prestige: 'National', description: 'Directorial & production excellence in entertainment.' },
  { id: 'aw_leg_5', eventName: 'SAG Honors', categoryName: 'Career Legend', prestige: 'Legendary', description: 'Hall of Fame recognition for decades of cinematic mastery.' },
];

// Campaigning Options
const CAMPAIGN_OPTIONS: AwardCampaignOption[] = [
  {
    id: 'camp_int',
    name: 'Industry Magazine Interviews',
    type: 'Interviews',
    cost: 10000,
    votingScoreBoost: 3,
    fameXpBoost: 250,
    description: 'Targeted Q&A feature interviews in Variety and The Hollywood Reporter.',
  },
  {
    id: 'camp_mag',
    name: 'Vanity Fair Cover Story',
    type: 'Magazine Covers',
    cost: 25000,
    votingScoreBoost: 5,
    fameXpBoost: 600,
    description: 'Glamorous cover feature highlighting your career rise and acting dedication.',
  },
  {
    id: 'camp_prem',
    name: 'Academy Member Screening & Q&A',
    type: 'Premieres',
    cost: 50000,
    votingScoreBoost: 8,
    fameXpBoost: 1200,
    description: 'Private screening followed by cocktail reception with voting academy members.',
  },
  {
    id: 'camp_talk',
    name: 'Late Night Talk Show Tour',
    type: 'Talk Shows',
    cost: 75000,
    votingScoreBoost: 12,
    fameXpBoost: 2500,
    description: 'High-profile appearances on Jimmy Kimmel, Fallon & Stephen Colbert.',
  },
  {
    id: 'camp_dvd',
    name: 'Screener DVD Box Mailings',
    type: 'Special Screenings',
    cost: 150000,
    votingScoreBoost: 18,
    fameXpBoost: 4000,
    description: 'Deluxe leather-bound FYC screener boxes shipped directly to 10,000 guild voters.',
  },
  {
    id: 'camp_gala',
    name: 'Beverly Hills Gala Reception',
    type: 'Fan Events',
    cost: 300000,
    votingScoreBoost: 25,
    fameXpBoost: 8000,
    description: 'Star-studded $300k banquet honoring your performance with directors and press.',
  },
];

// NPC Competitors Catalog
const NPC_COMPETITORS = [
  { name: 'Leonardo DiCaprio', fame: 98, baseVote: 96, specialty: 'Dramatic Method Acting', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop' },
  { name: 'Meryl Streep', fame: 99, baseVote: 98, specialty: 'Master Character Transformations', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop' },
  { name: 'Cillian Murphy', fame: 94, baseVote: 94, specialty: 'Intense Historical Biopics', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' },
  { name: 'Zendaya Coleman', fame: 96, baseVote: 91, specialty: 'Youth Drama & Blockbusters', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop' },
  { name: 'Pedro Pascal', fame: 92, baseVote: 89, specialty: 'Prestige TV & Action Thrillers', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop' },
  { name: 'Margot Robbie', fame: 95, baseVote: 92, specialty: 'Blockbuster Character Power', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop' },
  { name: 'Timothée Chalamet', fame: 94, baseVote: 88, specialty: 'Sci-Fi Epics & Auteur Films', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop' },
  { name: 'Florence Pugh', fame: 89, baseVote: 87, specialty: 'Raw Emotional Intensity', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop' },
  { name: 'Austin Butler', fame: 88, baseVote: 86, specialty: 'Biopic Transformations', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop' },
  { name: 'Denzel Washington', fame: 97, baseVote: 95, specialty: 'Commanding Screen Presence', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop' },
];

type ViewMode = 'AWARDS_GRID' | 'SEASON_STAGE' | 'CAMPAIGNS' | 'PREDICTIONS' | 'HISTORY' | 'NPC_COMPETITORS';

export const AwardsView: React.FC<AwardsViewProps> = ({ onBack }) => {
  const { player, releasedMovies, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<ViewMode>('AWARDS_GRID');
  const [currentSeasonStage, setCurrentSeasonStage] = useState<AwardSeasonStage>('Eligibility');
  const [campaignSpentTotal, setCampaignSpentTotal] = useState<number>(0);
  const [campaignBonus, setCampaignBonus] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [cinematicData, setCinematicData] = useState<{
    eventName: string;
    categoryName: string;
    isWinner: boolean;
    movieTitle?: string;
    winnerName?: string;
  } | null>(null);

  // Load permanent career history from localStorage
  const [careerHistory, setCareerHistory] = useState<CareerAwardHistory>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AWARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read award state from storage', e);
    }
    return {
      totalWins: player.awardsWon || 0,
      totalNominations: Math.max(player.awardsWon || 0, 2),
      totalFinalists: Math.max(player.awardsWon || 0, 4),
      ceremoniesAttended: 3,
      currentStreak: 0,
      bestStreak: 1,
      recordsLog: [],
    };
  });

  // Save state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AWARDS, JSON.stringify(careerHistory));
    } catch (e) {
      console.warn('Failed to save award history', e);
    }
  }, [careerHistory]);

  // Compute Player's Hardcore Voting Power Score
  // Formula:
  // - Movies released count (up to 30 pts)
  // - Player Fame XP (up to 30 pts)
  // - Campaign bonus (up to 25 pts)
  // - Early Career Penalty (-35% if releasedMovies.length < 3 or fameXp < 15,000)
  const moviesCount = releasedMovies.length;
  const rawMovieScore = Math.min(30, moviesCount * 5);
  const rawFameScore = Math.min(30, Math.floor((player.fameXp || 0) / 1000));
  const baseVotingPower = rawMovieScore + rawFameScore + campaignBonus;

  // Early Career Penalty Check
  const isEarlyCareer = moviesCount < 3 || (player.fameXp || 0) < 15000;
  const playerVotingScore = isEarlyCareer
    ? Math.floor(baseVotingPower * 0.65) // 35% Hardcore penalty for beginners
    : Math.min(100, baseVotingPower);

  // Helper to determine media predictions
  const getPredictionForScore = (score: number): AwardPrediction => {
    if (score >= 90) return 'Current Favorite';
    if (score >= 80) return 'Strong Contender';
    if (score >= 70) return 'Dark Horse';
    if (score >= 55) return 'Outside Chance';
    return 'Long Shot';
  };

  // Helper to determine required voting score by prestige
  const getMinVotingScoreForPrestige = (prestige: AwardPrestige): number => {
    switch (prestige) {
      case 'Local':
        return 25;
      case 'Regional':
        return 40;
      case 'National':
        return 58;
      case 'International':
        return 72;
      case 'Global':
        return 84;
      case 'Legendary':
        return 92;
    }
  };

  // Launch Campaign Action
  const handleLaunchCampaignOption = (opt: AwardCampaignOption) => {
    if (releasedMovies.length === 0) {
      setFeedback('🎬 INELIGIBLE: You must release at least 1 feature film or TV project before running award campaigns!');
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    if (player.money < opt.cost) {
      setFeedback(`Insufficient funds! Need $${opt.cost.toLocaleString()} for ${opt.name}.`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    player.money -= opt.cost;
    setCampaignSpentTotal((prev) => prev + opt.cost);
    setCampaignBonus((prev) => Math.min(25, prev + opt.votingScoreBoost));
    player.fameXp += opt.fameXpBoost;

    setFeedback(
      `📣 CAMPAIGN LAUNCHED: ${opt.name}! Spent $${opt.cost.toLocaleString()}. Voting Score +${opt.votingScoreBoost} Boost (Total Campaign Bonus: +${Math.min(
        25,
        campaignBonus + opt.votingScoreBoost
      )}).`
    );
    setTimeout(() => setFeedback(null), 4000);
  };

  // Advance Season Stage Action & Simulate Award Voting Ceremony
  const handleAdvanceStage = () => {
    const stages: AwardSeasonStage[] = [
      'Eligibility',
      'Industry Predictions',
      'Official Nominees',
      'Media Campaign',
      'Red Carpet',
      'Award Ceremony',
      'Winner Announcement',
      'After Party',
      'Entertainment News',
    ];

    const currIdx = stages.indexOf(currentSeasonStage);
    const nextIdx = (currIdx + 1) % stages.length;
    const nextStage = stages[nextIdx];
    setCurrentSeasonStage(nextStage);

    if (nextStage === 'Award Ceremony' || nextStage === 'Winner Announcement') {
      if (releasedMovies.length === 0) {
        setFeedback('🎬 INELIGIBLE: You must release at least 1 feature film or TV project before competing in award ceremonies!');
        setTimeout(() => setFeedback(null), 4000);
        return;
      }

      // Simulate competitive voting for major awards!
      // Pick a random award from catalog
      const randomAward = ALL_AWARDS_CATALOG[Math.floor(Math.random() * ALL_AWARDS_CATALOG.length)];
      const requiredScore = getMinVotingScoreForPrestige(randomAward.prestige);

      // Select top NPC competitor
      const npcComp = NPC_COMPETITORS[Math.floor(Math.random() * NPC_COMPETITORS.length)];
      const npcScore = Math.min(99, npcComp.baseVote + Math.floor(Math.random() * 5));

      // Check if player beats NPC score AND meets required prestige threshold
      const playerWon = playerVotingScore >= requiredScore && playerVotingScore > npcScore;

      const activeMovie = releasedMovies[0];

      if (playerWon) {
        player.awardsWon = (player.awardsWon || 0) + 1;
        player.fameXp += 5000;

        const newLog = {
          id: `rec_${Date.now()}`,
          year: player.dateYear || 2026,
          eventName: randomAward.eventName,
          categoryName: randomAward.categoryName,
          workTitle: activeMovie.movieTitle,
          result: 'Won' as const,
          votingScore: playerVotingScore,
        };

        setCareerHistory((prev) => ({
          ...prev,
          totalWins: prev.totalWins + 1,
          totalNominations: prev.totalNominations + 1,
          totalFinalists: prev.totalFinalists + 1,
          ceremoniesAttended: prev.ceremoniesAttended + 1,
          currentStreak: prev.currentStreak + 1,
          bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
          recordsLog: [newLog, ...prev.recordsLog],
        }));

        setFeedback(
          `🏆 VICTORY! You won the ${randomAward.eventName}: ${randomAward.categoryName}! Defeated ${npcComp.name} (Your Score: ${playerVotingScore} vs NPC ${npcScore}). +5,000 Fame XP!`
        );

        setCinematicData({
          eventName: randomAward.eventName,
          categoryName: randomAward.categoryName,
          isWinner: true,
          movieTitle: activeMovie.movieTitle,
        });
      } else {
        const newLog = {
          id: `rec_${Date.now()}`,
          year: player.dateYear || 2026,
          eventName: randomAward.eventName,
          categoryName: randomAward.categoryName,
          workTitle: activeMovie.movieTitle,
          result: 'Lost' as const,
          votingScore: playerVotingScore,
        };

        setCareerHistory((prev) => ({
          ...prev,
          totalNominations: prev.totalNominations + 1,
          ceremoniesAttended: prev.ceremoniesAttended + 1,
          currentStreak: 0,
          recordsLog: [newLog, ...prev.recordsLog],
        }));

        const reason = isEarlyCareer
          ? 'Early Career Penalty (-35% vote modifier due to low movie count & fame).'
          : `High NPC Competition (${npcComp.name} scored ${npcScore}).`;

        setFeedback(
          `❌ HARDCORE LOSS: ${npcComp.name} won the ${randomAward.eventName} (${randomAward.categoryName}). Reason: ${reason}. Keep releasing films & running PR campaigns!`
        );

        setCinematicData({
          eventName: randomAward.eventName,
          categoryName: randomAward.categoryName,
          isWinner: false,
          movieTitle: activeMovie.movieTitle,
          winnerName: npcComp.name,
        });
      }
    } else {
      setFeedback(`🎬 AWARD SEASON STAGE UPDATED: Now at Stage "${nextStage}".`);
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Hardcore Competitive Awards Engine
          </span>
        </div>
      </div>

      {/* Main Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-md"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 shadow-inner">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                OSCARS • EMMYS • GOLDEN GLOBES • SAG • CANNES • BAFTA
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">ACADEMY & GUILD AWARDS PORTAL</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div className="bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Player Voting Score</span>
              <span
                className={`text-lg font-black font-mono ${
                  playerVotingScore >= 70 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {playerVotingScore} / 100 {isEarlyCareer && '(-35% Early)'}
              </span>
            </div>
            <div className="bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Career Trophies</span>
              <span className="text-lg font-black text-amber-300 font-mono">
                {careerHistory.totalWins} Wins / {careerHistory.totalNominations} Noms
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-white/10 no-scrollbar">
          {[
            { id: 'AWARDS_GRID' as const, label: 'All 26 Awards', icon: Crown },
            { id: 'SEASON_STAGE' as const, label: '9-Stage Season', icon: Calendar },
            { id: 'CAMPAIGNS' as const, label: 'PR Campaigns', icon: Megaphone },
            { id: 'PREDICTIONS' as const, label: 'Media Predictions', icon: BarChart3 },
            { id: 'HISTORY' as const, label: 'Trophy Room', icon: Award },
            { id: 'NPC_COMPETITORS' as const, label: 'NPC Competitors', icon: Users },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-lg font-extrabold'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-black shadow-xl text-center animate-fadeIn">
          {feedback}
        </div>
      )}

      {/* 1. ALL 26 MAJOR HOLLYWOOD AWARDS (3 CARDS PER ROW GRID) */}
      {activeTab === 'AWARDS_GRID' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              26 Major Academy, Guild & International Awards (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-amber-300 font-bold">
              Current Season Stage: <strong className="text-white">{currentSeasonStage}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ALL_AWARDS_CATALOG.map((aw) => {
              const minScore = getMinVotingScoreForPrestige(aw.prestige);
              const isEligibleScore = playerVotingScore >= minScore;
              const prediction = getPredictionForScore(playerVotingScore);

              return (
                <div
                  key={aw.id}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-400/40 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                        {aw.eventName}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                          aw.prestige === 'Legendary'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : aw.prestige === 'Global'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {aw.prestige} Prestige
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white">{aw.categoryName}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{aw.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Min Voting Score Needed:</span>
                      <span className="text-amber-300 font-bold">{minScore} PTS</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Your Prediction:</span>
                      <span
                        className={`font-bold ${
                          prediction === 'Current Favorite'
                            ? 'text-emerald-400'
                            : prediction === 'Strong Contender'
                            ? 'text-sky-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {prediction}
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl text-center text-xs font-black ${
                        isEligibleScore
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {isEligibleScore ? '✅ Competitive Status' : '⚠️ Below Min Threshold (Needs PR/Films)'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. 9-STAGE AWARD SEASON PIPELINE (3 CARDS PER ROW GRID) */}
      {activeTab === 'SEASON_STAGE' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
                9-Stage Award Season Pipeline (3 Cards Per Row Grid)
              </h3>
              <p className="text-xs text-amber-300 font-medium mt-0.5">
                Current Active Stage: <strong className="text-white uppercase">{currentSeasonStage}</strong>
              </p>
            </div>

            <button
              onClick={handleAdvanceStage}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-lg flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              <span>ADVANCE SEASON STAGE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { stage: 'Eligibility' as const, num: 1, title: '1. Film & Role Eligibility', desc: 'Screening and qualifying all theatrical & streaming film performances released during the eligibility year.' },
              { stage: 'Industry Predictions' as const, num: 2, title: '2. Press Predictions & Odds', desc: 'Variety, Hollywood Reporter & GoldDerby publish initial award season odds and frontrunner picks.' },
              { stage: 'Official Nominees' as const, num: 3, title: '3. Official Nominees Announcement', desc: 'Live morning press conference announcing the official 5 nominees in every award category.' },
              { stage: 'Media Campaign' as const, num: 4, title: '4. FYC Media & PR Blitz', desc: 'Studios spend millions on screener DVD boxes, billboard takeovers, and talk show appearances.' },
              { stage: 'Red Carpet' as const, num: 5, title: '5. Red Carpet Arrivals', desc: 'Star-studded arrival, fashion critique, high-profile interviews, and media photo calls.' },
              { stage: 'Award Ceremony' as const, num: 6, title: '6. Live Award Ceremony', desc: 'Live televised awards ceremony with celebrity hosts, tributes, and musical performances.' },
              { stage: 'Winner Announcement' as const, num: 7, title: '7. Sealed Envelope Reveal', desc: 'The iconic envelope is opened live on stage declaring the official winner of the category.' },
              { stage: 'After Party' as const, num: 8, title: '8. Governors Ball & Vanity Fair', desc: 'Exclusive midnight after-parties, trophy engraving, and elite producer networking.' },
              { stage: 'Entertainment News' as const, num: 9, title: '9. Worldwide News & Socials', desc: 'Post-ceremony box office surges, viral social media memes, and career reputation updates.' },
            ].map((s) => {
              const isActive = currentSeasonStage === s.stage;

              return (
                <div
                  key={s.num}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 shadow-xl ${
                    isActive
                      ? 'border-amber-400 bg-amber-400/15 shadow-2xl scale-[1.02]'
                      : 'border-white/10 bg-black/60 hover:bg-black/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase font-mono">
                        STAGE {s.num} / 9
                      </span>
                      {isActive && (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-black text-[10px] font-black uppercase flex items-center gap-1 font-mono">
                          <Flame className="w-3 h-3 text-black" /> ACTIVE NOW
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-white">{s.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setCurrentSeasonStage(s.stage);
                        setFeedback(`Stage manually set to ${s.stage}`);
                        setTimeout(() => setFeedback(null), 3000);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-black'
                          : 'bg-black/50 text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {isActive ? 'CURRENT ACTIVE STAGE' : 'JUMP TO THIS STAGE'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PR CAMPAIGNING OPTIONS (3 CARDS PER ROW GRID) */}
      {activeTab === 'CAMPAIGNS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              For Your Consideration (FYC) PR Campaigns (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-amber-300 font-bold">
              Spent This Season: ${campaignSpentTotal.toLocaleString()} (+{campaignBonus} Vote Bonus)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAMPAIGN_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-400/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                      {opt.type}
                    </span>
                    <span className="text-xs font-black text-emerald-400 font-mono">
                      +${opt.cost.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">{opt.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{opt.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Voting Score Boost:</span>
                    <span className="text-emerald-400 font-bold">+{opt.votingScoreBoost} PTS</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Fame XP Reward:</span>
                    <span className="text-amber-300 font-bold">+{opt.fameXpBoost} XP</span>
                  </div>

                  <button
                    onClick={() => handleLaunchCampaignOption(opt)}
                    className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-md mt-1"
                  >
                    LAUNCH THIS CAMPAIGN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MEDIA PREDICTIONS & ODDS (3 CARDS PER ROW GRID) */}
      {activeTab === 'PREDICTIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Industry Media Race Predictions (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-emerald-400 font-bold">Real-time Hollywood Odds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Current Favorites (90+ PTS)',
                badge: 'TOP CONTENDERS',
                color: 'text-emerald-400',
                borderColor: 'border-emerald-500/40',
                desc: 'Voters and film critics overwhelmingly favor these high-prestige roles for win statuettes.',
                actors: ['Meryl Streep (98 PTS)', 'Leonardo DiCaprio (96 PTS)', 'Denzel Washington (95 PTS)'],
              },
              {
                title: 'Strong Contenders (80-89 PTS)',
                badge: 'HIGH CHANCE',
                color: 'text-sky-400',
                borderColor: 'border-sky-500/40',
                desc: 'Strong nominations likely. Intensive FYC campaigns can elevate them to favorite status.',
                actors: ['Cillian Murphy (94 PTS)', 'Margot Robbie (92 PTS)', 'Pedro Pascal (89 PTS)'],
              },
              {
                title: 'Dark Horses & Outsiders (<80 PTS)',
                badge: 'CHALLENGERS',
                color: 'text-amber-400',
                borderColor: 'border-amber-500/40',
                desc: 'Underdog candidates. Needs massive media press, critic prizes, or viral fan buzz to win.',
                actors: ['Timothée Chalamet (88 PTS)', 'Florence Pugh (87 PTS)', 'Austin Butler (86 PTS)'],
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-3xl border bg-black/60 backdrop-blur-md space-y-4 shadow-xl ${p.borderColor}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-xl bg-white/5 text-[10px] font-black uppercase ${p.color}`}>
                    {p.badge}
                  </span>
                  <BarChart3 className={`w-5 h-5 ${p.color}`} />
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{p.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/10">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Frontrunner List:</span>
                  {p.actors.map((act, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-white bg-black/40 p-2 rounded-xl border border-white/5">
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CAREER TROPHY ROOM & HISTORY (3 CARDS PER ROW GRID) */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Permanent Award Trophy Room & Career Logs (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-amber-300 font-bold font-mono">
              Saved Permanently
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-400 uppercase">CAREER STATS</span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-black text-white">Lifetime Trophy Total</h3>
              <div className="p-3 rounded-2xl bg-black/80 border border-white/10 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Wins:</span>
                  <span className="text-amber-300 font-bold">{careerHistory.totalWins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Nominations:</span>
                  <span className="text-white font-bold">{careerHistory.totalNominations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Finalist Placements:</span>
                  <span className="text-sky-300 font-bold">{careerHistory.totalFinalists}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-purple-400 uppercase">CEREMONY ATTENDANCE</span>
                <Crown className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-base font-black text-white">Ceremonies & Streaks</h3>
              <div className="p-3 rounded-2xl bg-black/80 border border-white/10 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ceremonies Attended:</span>
                  <span className="text-purple-300 font-bold">{careerHistory.ceremoniesAttended}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Win Streak:</span>
                  <span className="text-emerald-400 font-bold">{careerHistory.currentStreak} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">All-Time Best Streak:</span>
                  <span className="text-amber-300 font-bold">{careerHistory.bestStreak} Years</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-400 uppercase">PRESTIGE MILESTONES</span>
                <Star className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-black text-white">Hollywood Milestones</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Win 10+ major awards to achieve Legend status and unlock exclusive studio executive invitations.
              </p>
            </div>
          </div>

          {/* Historical Ceremony Logs */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Recent Award Ceremony Results Log ({careerHistory.recordsLog.length} Saved)
            </h3>

            {careerHistory.recordsLog.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No ceremony logs recorded yet. Advance the award season stage to compete!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {careerHistory.recordsLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-black/80 border border-white/10 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-300">
                        {log.eventName} ({log.year})
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          log.result === 'Won'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {log.result}
                      </span>
                    </div>

                    <h4 className="font-black text-white">{log.categoryName}</h4>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Work: "{log.workTitle}" | Score: {log.votingScore} PTS
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. NPC COMPETITORS (3 CARDS PER ROW GRID) */}
      {activeTab === 'NPC_COMPETITORS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Elite Hollywood NPC Competitors (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-amber-300 font-bold">10 Active A-List Rivals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NPC_COMPETITORS.map((npc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-xl hover:border-amber-400/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={npc.avatar}
                    alt={npc.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-white/20 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-black text-white">{npc.name}</h3>
                    <span className="text-[10px] text-amber-300 font-bold uppercase block">
                      {npc.specialty}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Industry Fame:</span>
                    <span className="text-white font-bold">{npc.fame} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Voting Score:</span>
                    <span className="text-emerald-400 font-bold">{npc.baseVote} PTS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Award Ceremony Cinematic Modal */}
      {cinematicData && (
        <AwardCeremonyCinematicModal
          eventName={cinematicData.eventName}
          categoryName={cinematicData.categoryName}
          isWinner={cinematicData.isWinner}
          movieTitle={cinematicData.movieTitle}
          winnerName={cinematicData.winnerName}
          onClose={() => setCinematicData(null)}
        />
      )}
    </div>
  );
};
