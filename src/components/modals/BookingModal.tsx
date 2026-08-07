/**
 * HOLLYWOOD RISING - PRODUCTION HUB (REPLACES BOOKING)
 * The central place for every Movie and TV Series production after signing a contract.
 * Features: Studio Confidence Meter + 3-Card-Per-Row Grid Layout (15 Premium Feature Cards)
 * Production, Cast, Director, Activities, Contract, Promotion, Performance, Reviews,
 * Awards, Schedule, Finance, Risks, Box Office, Social Buzz, Wrap-Up
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clapperboard,
  Users,
  UserCheck,
  Zap,
  FileText,
  Megaphone,
  BarChart3,
  Star,
  Trophy,
  Calendar,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Building2,
  MapPin,
  Heart,
  Smile,
  Frown,
  AlertOctagon,
  ShieldAlert,
  Flame,
  Award,
  Film,
  Sparkles,
  Tv,
  Radio,
  Share2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BookedProject, CallboardProject } from '../../types/game';
import { THEMES } from '../../theme/colors';
import { soundService } from '../../services/soundService';
import { RedCarpetPremiereModal } from './RedCarpetPremiereModal';
import { ContractNegotiationModal } from './ContractNegotiationModal';
import { ReleaseCenterModal } from './ReleaseCenterModal';

export const BookingModal: React.FC = () => {
  const {
    setActiveModal,
    advanceWeek,
    isProcessingWeek,
    bookedProjects,
    releasedMovies,
    boostProduction,
    player,
    settings,
    saveData,
    updateSave,
  } = useGame();

  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // Selected project state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    bookedProjects.length > 0 ? bookedProjects[0].id : ''
  );

  // Active project data or fallback default
  const currentProject = bookedProjects.find((b) => b.id === selectedProjectId) || bookedProjects[0];

  // Local state per project session for interactive features
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);
  const [showRedCarpet, setShowRedCarpet] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showReleaseCenter, setShowReleaseCenter] = useState(false);

  // Dynamic project properties (derived from actual project data or realistic calculations)
  const studioName = currentProject?.studio || 'Paramount Pictures';
  const directorName = currentProject?.director || 'Denis Villeneuve';
  const genre = currentProject?.genre || 'Sci-Fi Epic';
  const budget = currentProject?.budget || 65000000;
  const location = currentProject?.location || 'Stage 4 - Hollywood Soundstages';
  const backendPercent = currentProject?.backendPercent || 2.5;

  // Status
  const currentWeek = currentProject
    ? currentProject.totalFilmingWeeks - currentProject.weeksRemaining + 1
    : 1;
  const progressPercent = currentProject
    ? Math.min(100, Math.round(((currentProject.totalFilmingWeeks - currentProject.weeksRemaining) / currentProject.totalFilmingWeeks) * 100))
    : 0;

  let statusText = currentProject?.status || 'Filming';
  if (!currentProject?.status) {
    if (progressPercent === 0) statusText = 'Pre-Production';
    else if (progressPercent >= 100) statusText = 'Post Production';
  }

  // Studio Confidence Meter (0-100)
  const studioConfidence = Math.min(
    100,
    Math.max(20, Math.round(50 + (player.talents.acting / 2) + (player.leadRolesCount * 5) - (player.energy < 20 ? 10 : 0)))
  );

  // Cast Co-stars list
  const [castMembers, setCastMembers] = useState([
    {
      id: 'cast_1',
      name: 'Timothée Chalamet',
      role: 'Co-Lead',
      fame: 'A-List Legend',
      reputation: 92,
      relationship: 78,
      chemistry: 85,
      mood: 'Enthusiastic',
    },
    {
      id: 'cast_2',
      name: 'Zendaya Coleman',
      role: 'Supporting Lead',
      fame: 'Global Icon',
      reputation: 95,
      relationship: 82,
      chemistry: 88,
      mood: 'Focused',
    },
  ]);

  // Director Relationship & Satisfaction System
  const [directorSatisfaction, setDirectorSatisfaction] = useState<
    'Excellent' | 'Good' | 'Neutral' | 'Concerned' | 'Disappointed' | 'Furious'
  >('Good');
  const [directorTrust, setDirectorTrust] = useState(78);
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  // Weekly Schedule State
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Monday', activity: 'Script Rehearsal & Table Read', energyCost: 1 },
    { day: 'Tuesday', activity: 'Principal Camera Filming', energyCost: 2 },
    { day: 'Wednesday', activity: 'TV Press Interview & Promo', energyCost: 1 },
    { day: 'Thursday', activity: 'Director One-on-One Meeting', energyCost: 1 },
    { day: 'Friday', activity: 'Stunt & Action Choreography', energyCost: 2 },
    { day: 'Saturday', activity: 'Rest & Mental Recovery', energyCost: 0 },
    { day: 'Sunday', activity: 'Social Media Hype Campaign', energyCost: 1 },
  ]);

  // Performance breakdown rating
  const overallPerformance = Math.min(
    100,
    Math.round(player.talents.acting * 0.4 + player.talents.drama * 0.3 + player.talents.action * 0.3)
  );

  // Show Feedback Toast Helper
  const triggerFeedback = (msg: string) => {
    setLocalFeedback(msg);
    setTimeout(() => setLocalFeedback(null), 4000);
  };

  // Cast Actions
  const handleCastAction = (castName: string, actionName: string) => {
    if (player.energy < 1) {
      triggerFeedback('Insufficient energy remaining for cast activity.');
      return;
    }
    setCastMembers((prev) =>
      prev.map((c) =>
        c.name === castName
          ? {
              ...c,
              chemistry: Math.min(100, c.chemistry + 5),
              relationship: Math.min(100, c.relationship + 4),
              mood: 'Inspired',
            }
          : c
      )
    );
    triggerFeedback(`Completed ${actionName} with ${castName}. Cast chemistry & relationship increased!`);
  };

  // Director Actions
  const handleDirectorAction = (actionType: string) => {
    if (player.energy < 1) {
      triggerFeedback('Insufficient energy to meet with Director.');
      return;
    }
    switch (actionType) {
      case 'meeting':
        setDirectorTrust((t) => Math.min(100, t + 4));
        triggerFeedback(`Held a constructive vision meeting with Director ${directorName}. Trust increased!`);
        break;
      case 'script':
        setDirectorTrust((t) => Math.min(100, t + 6));
        triggerFeedback(`Discussed character motivation and script arcs with ${directorName}.`);
        break;
      case 'pitch':
        if (player.talents.acting >= 45) {
          setDirectorSatisfaction('Excellent');
          triggerFeedback(`Director ${directorName} loved your creative scene pitch! Satisfaction: Excellent.`);
        } else {
          triggerFeedback(`Director ${directorName} listened to your pitch and gave constructive guidance.`);
        }
        break;
      case 'apologize':
        if (directorSatisfaction === 'Concerned' || directorSatisfaction === 'Disappointed') {
          setDirectorSatisfaction('Good');
          triggerFeedback(`Apologized professionally to ${directorName}. Satisfaction restored to Good.`);
        } else {
          triggerFeedback(`Exchanged professional courtesies with Director ${directorName}.`);
        }
        break;
      case 'accept_feedback':
        setDirectorTrust((t) => Math.min(100, t + 5));
        setDirectorSatisfaction('Excellent');
        triggerFeedback(`Accepted director notes on set. Director satisfaction increased to Excellent!`);
        break;
      default:
        break;
    }
  };

  // Weekly Activity Run
  const handleRunActivity = (actName: string) => {
    if (player.energy < 1) {
      triggerFeedback('Not enough energy to perform this production activity.');
      return;
    }
    triggerFeedback(`Completed ${actName}! Production quality & studio confidence boosted.`);
  };

  // Mandatory Promotion
  const handlePromote = (promoType: string) => {
    if (player.energy < 1) {
      triggerFeedback('Not enough energy for press promotion.');
      return;
    }
    setDirectorTrust((t) => Math.min(100, t + 3));
    triggerFeedback(`Completed ${promoType}! Movie popularity & Studio Confidence increased.`);
  };

  // Negotiation Adapter & Actions for Greenlit Sequels / Pending Deals
  const negotiationProjectAdapter: CallboardProject = currentProject
    ? {
        id: currentProject.projectId || currentProject.id,
        title: currentProject.movieTitle,
        posterUrl: currentProject.posterUrl,
        genre: currentProject.genre || 'Action',
        roleType: currentProject.roleType,
        category: currentProject.category,
        productionCompany: `${currentProject.studio || 'Studio'} Pictures`,
        studio: currentProject.studio || 'Paramount Pictures',
        director: currentProject.director || 'Denis Villeneuve',
        producer: 'Franchise Producers',
        budget: currentProject.budget || 50000000,
        filmingWeeks: currentProject.totalFilmingWeeks,
        estimatedReleaseWindow: 'Upcoming Season',
        salary: currentProject.salary,
        description: `Greenlit sequel to ${currentProject.parentMovieTitle || 'the hit sensation'}. Demands a major return performance!`,
        decisionTimeWeeks: 1,
        isSequel: true,
        parentMovieTitle: currentProject.parentMovieTitle,
        proposedContract: {
          salary: currentProject.salary,
          backendPercent: currentProject.backendPercent || 3.5,
          profitSharePercent: currentProject.profitSharePercent || 5.0,
          boxOfficeBonus: currentProject.boxOfficeBonus || Math.floor(currentProject.salary * 3),
        },
      }
    : ({} as CallboardProject);

  const handleAcceptDirectTerms = () => {
    if (!currentProject) return;
    soundService.playSuccessSound();

    const updatedBookedList = saveData.bookedProjects.map((b) => {
      if (b.id === currentProject.id) {
        return {
          ...b,
          status: 'Pre-Production' as const,
          stageWeeksRemaining: 1,
          totalStageWeeks: 1,
          productionLog: [
            ...(b.productionLog || []),
            {
              week: player.dateWeek,
              year: player.dateYear,
              stage: 'Contract Signed',
              eventText: `Contract officially signed with ${b.studio || 'Studio'} for $${b.salary.toLocaleString()} base salary and ${b.backendPercent || 3.5}% backend points. Pre-production commenced!`,
              type: 'milestone' as const,
            },
            {
              week: player.dateWeek,
              year: player.dateYear,
              stage: 'Pre-Production',
              eventText: 'Pre-production commenced: Table reads, costume fittings, and script walk-throughs.',
              type: 'info' as const,
            },
          ],
        };
      }
      return b;
    });

    updateSave({
      ...saveData,
      bookedProjects: updatedBookedList,
    });

    triggerFeedback(`🎉 Contract Accepted! "${currentProject.movieTitle}" pre-production has officially launched!`);
  };

  const handleNegotiationSuccess = (negotiatedBooked: BookedProject) => {
    if (!currentProject) return;
    soundService.playSuccessSound();

    const updatedBookedList = saveData.bookedProjects.map((b) => {
      if (b.id === currentProject.id) {
        return {
          ...b,
          salary: negotiatedBooked.salary,
          backendPercent: negotiatedBooked.backendPercent,
          profitSharePercent: negotiatedBooked.profitSharePercent,
          boxOfficeBonus: negotiatedBooked.boxOfficeBonus,
          status: 'Pre-Production' as const,
          stageWeeksRemaining: 1,
          totalStageWeeks: 1,
          productionLog: [
            ...(b.productionLog || []),
            {
              week: player.dateWeek,
              year: player.dateYear,
              stage: 'Contract Signed',
              eventText: `Contract officially signed with ${b.studio || 'Studio'} for $${negotiatedBooked.salary.toLocaleString()} base salary and ${negotiatedBooked.backendPercent}% backend points. Pre-production commenced!`,
              type: 'milestone' as const,
            },
            {
              week: player.dateWeek,
              year: player.dateYear,
              stage: 'Pre-Production',
              eventText: 'Pre-production commenced: Table reads, costume fittings, and script walk-throughs.',
              type: 'info' as const,
            },
          ],
        };
      }
      return b;
    });

    updateSave({
      ...saveData,
      bookedProjects: updatedBookedList,
    });

    setShowNegotiationModal(false);
    triggerFeedback(`🎉 Negotiated Deal Signed! "${currentProject.movieTitle}" pre-production has officially launched!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-6xl h-[94vh] max-h-[94vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl relative"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header Bar */}
        <div
          className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b shrink-0"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <Clapperboard className="w-6 h-6" style={{ color: theme.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-wider">
                  Production Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black">
                  OFFICIAL FILMING CENTER
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                Central command for active movie & series contracts, cast chemistry, director trust, and box office tracking
              </p>
            </div>
          </div>

          {/* Studio Confidence Badge Header */}
          <div className="flex items-center gap-4">
            <div className="bg-black/60 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl flex items-center gap-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                  Studio Confidence
                </div>
                <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <span>{studioConfidence}%</span>
                  <span className="text-[10px] text-gray-400">
                    ({studioConfidence >= 75 ? 'Trusted Talent' : 'Standard'})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('none')}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Project Switcher Bar */}
        {bookedProjects.length > 0 && (
          <div className="p-3 bg-black/60 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2 pr-1">
              Active Filmings:
            </span>
            {bookedProjects.map((proj) => {
              const isSelected = proj.id === (currentProject?.id || '');
              const isPending = proj.status === 'Pending Negotiation';
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md font-black'
                      : isPending
                      ? 'bg-purple-950/80 text-amber-300 border-amber-400/60 hover:border-amber-400 animate-pulse'
                      : 'bg-black/40 text-gray-300 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{proj.movieTitle}</span>
                  {isPending ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-black font-black uppercase">
                      GREENLIT OFFER
                    </span>
                  ) : (
                    <span className="text-[10px] opacity-80">({proj.roleType})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Local Action Feedback Toast */}
        <AnimatePresence>
          {localFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-bold flex items-center gap-2 shadow-lg shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{localFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {!currentProject ? (
            <div className="text-center py-24 space-y-4">
              <Clapperboard className="w-20 h-20 mx-auto text-gray-600 animate-pulse" />
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                No Active Production Contracts
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                You currently have no active movie or TV series productions booked. Visit the Callboard to apply for auditions and secure your next role.
              </p>
              <button
                onClick={() => setActiveModal('callboard')}
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-black font-black text-xs hover:bg-amber-300 transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
              >
                <Clapperboard className="w-4 h-4" />
                <span>OPEN CALLBOARD</span>
              </button>
            </div>
          ) : currentProject.status === 'Pending Negotiation' ? (
            /* GREENLIT SEQUEL / PENDING CONTRACT OFFER VIEW */
            <div className="bg-gradient-to-br from-purple-950/90 via-black to-amber-950/90 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl relative overflow-hidden my-auto">
              <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                <Clapperboard className="w-80 h-80 text-amber-400" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={currentProject.posterUrl}
                    alt={currentProject.movieTitle}
                    className="w-20 h-28 object-cover rounded-2xl border-2 border-amber-400/60 shadow-xl shrink-0"
                  />
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> OFFICIAL STUDIO GREENLIGHT
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white mt-1.5">
                      {currentProject.movieTitle}
                    </h3>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Blockbuster Sequel to <strong className="text-amber-300">"{currentProject.parentMovieTitle || 'Original Hit'}"</strong> • {currentProject.studio}
                    </p>
                  </div>
                </div>

                <div className="bg-black/80 border border-amber-400/40 px-5 py-3 rounded-2xl text-right shadow-inner">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Proposed Base Salary</div>
                  <div className="text-2xl font-black text-emerald-400">${currentProject.salary.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/60 p-4 rounded-2xl border border-white/10">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-1">Role Type</span>
                  <span className="font-extrabold text-amber-300 text-sm">{currentProject.roleType} Role</span>
                </div>
                <div className="bg-black/60 p-4 rounded-2xl border border-white/10">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-1">Production Budget</span>
                  <span className="font-extrabold text-white text-sm">${((currentProject.budget || 50000000) / 1000000).toFixed(1)}M</span>
                </div>
                <div className="bg-black/60 p-4 rounded-2xl border border-white/10">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-1">Offered Backend Points</span>
                  <span className="font-extrabold text-cyan-300 text-sm">{currentProject.backendPercent || 3.5}% Box Office Gross</span>
                </div>
                <div className="bg-black/60 p-4 rounded-2xl border border-white/10">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase tracking-wider mb-1">Filming Duration</span>
                  <span className="font-extrabold text-purple-300 text-sm">{currentProject.totalFilmingWeeks} Weeks</span>
                </div>
              </div>

              <div className="bg-black/60 p-5 rounded-2xl border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl text-left">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" /> Contract Offer Ready for Acceptance or Negotiation
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    The studio has officially greenlit production for <strong className="text-white">{currentProject.movieTitle}</strong>. You can accept the studio's initial contract offer immediately or leverage your Star Power & Representation to negotiate higher salary, backend gross, and box office bonuses before filming begins!
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleAcceptDirectTerms}
                    className="flex-1 md:flex-none px-5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACCEPT TERMS (${currentProject.salary.toLocaleString()})</span>
                  </button>

                  <button
                    onClick={() => setShowNegotiationModal(true)}
                    className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>NEGOTIATE CONTRACT WITH LEVERAGE</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 3-COLUMN GRID VIEW LAYOUT (5 ROWS = 15 CARDS) */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pb-6">
              {/* ==================== ROW 1 ==================== */}

              {/* CARD 1: PRODUCTION */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">1. Production</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {statusText}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={currentProject.posterUrl}
                    alt={currentProject.movieTitle}
                    className="w-16 h-22 rounded-xl object-cover border border-white/20 shrink-0 shadow"
                  />
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate">{currentProject.movieTitle}</h4>
                    <p className="text-xs text-amber-300 font-bold">{currentProject.roleType} Role</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-gray-500" /> {studioName}
                    </p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-gray-500" /> Dir: {directorName}
                    </p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" /> {location}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>Filming Progress ({currentWeek}/{currentProject.totalFilmingWeeks} Wks)</span>
                    <span className="text-amber-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                    <span>Budget: ${budget.toLocaleString()}</span>
                    <span>Salary: ${currentProject.salary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: CAST */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">2. Cast Ensemble</h3>
                  </div>
                  <span className="text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                    High Synergy
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {castMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-black text-white">{member.name}</div>
                          <div className="text-[10px] text-gray-400">
                            {member.role} • {member.fame}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Chem: {member.chemistry}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-1">
                        <button
                          onClick={() => handleCastAction(member.name, 'Rehearse Lines')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 cursor-pointer"
                        >
                          Rehearse
                        </button>
                        <button
                          onClick={() => handleCastAction(member.name, 'Dinner Outing')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 border border-pink-500/40 cursor-pointer"
                        >
                          Dinner
                        </button>
                        <button
                          onClick={() => handleCastAction(member.name, 'Support & Praise')}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 cursor-pointer"
                        >
                          Support
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 italic">
                  Good cast chemistry elevates movie quality and award potential.
                </p>
              </div>

              {/* CARD 3: DIRECTOR */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">3. Director Relations</h3>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      directorSatisfaction === 'Excellent'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : directorSatisfaction === 'Furious'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}
                  >
                    {directorSatisfaction}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-300 font-medium">
                    <span>Director:</span>
                    <span className="font-bold text-white">{directorName}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 font-medium">
                    <span>Director Trust:</span>
                    <span className="font-bold text-sky-300">{directorTrust}/100</span>
                  </div>
                  <div className="flex justify-between text-gray-300 font-medium">
                    <span>Working Style:</span>
                    <span className="font-bold text-gray-200">Visionary & Methodical</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2">
                  <button
                    onClick={() => handleDirectorAction('meeting')}
                    className="p-1.5 rounded-xl text-[10px] font-bold bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 cursor-pointer"
                  >
                    Vision Meeting
                  </button>
                  <button
                    onClick={() => handleDirectorAction('script')}
                    className="p-1.5 rounded-xl text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 cursor-pointer"
                  >
                    Discuss Script
                  </button>
                  <button
                    onClick={() => handleDirectorAction('pitch')}
                    className="p-1.5 rounded-xl text-[10px] font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 cursor-pointer"
                  >
                    Pitch Ideas
                  </button>
                  <button
                    onClick={() => handleDirectorAction('accept_feedback')}
                    className="p-1.5 rounded-xl text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer"
                  >
                    Accept Feedback
                  </button>
                </div>
              </div>

              {/* ==================== ROW 2 ==================== */}

              {/* CARD 4: ACTIVITIES */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">4. Weekly Activities</h3>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    Energy: {player.energy}/100
                  </span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                  {[
                    { name: 'Script Rehearsal', category: 'Acting (+2)' },
                    { name: 'Fight & Stunt Training', category: 'Action (+2)' },
                    { name: 'Voice & Accent Coaching', category: 'Drama (+2)' },
                    { name: 'Director One-on-One', category: 'Trust (+5)' },
                    { name: 'Improvisation Practice', category: 'Comedy (+2)' },
                  ].map((act, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{act.name}</div>
                        <div className="text-[10px] text-gray-400">{act.category}</div>
                      </div>
                      <button
                        onClick={() => handleRunActivity(act.name)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-black cursor-pointer shadow"
                      >
                        Train (-1 E)
                      </button>
                    </div>
                  ))}
                </div>

                <div className="w-full py-2.5 px-3 rounded-xl text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center gap-2 text-center">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>▶ Use CONTINUE FILMING below or END WEEK to advance 1 week</span>
                </div>
              </div>

              {/* CARD 5: CONTRACT */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">5. Contract Terms</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    Signed & Binding
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Base Salary:</span>
                    <span className="font-bold text-white">${currentProject.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backend Gross:</span>
                    <span className="font-bold text-emerald-400">{backendPercent}% Box Office</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Streaming Residuals:</span>
                    <span className="font-bold text-emerald-400">1.2% Worldwide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Award Bonus:</span>
                    <span className="font-bold text-amber-300">$50,000 Nomination</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sequel Option:</span>
                    <span className="font-bold text-purple-300">$100,000 First Look</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance & Exclusivity:</span>
                    <span className="font-bold text-sky-300">Full SAG Coverage</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-black/60 border border-white/5 text-[10px] text-gray-400">
                  Termination clauses active. Skips or contract breaches will trigger studio legal action.
                </div>
              </div>

              {/* CARD 6: PROMOTION */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-pink-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">6. Promotion Hub</h3>
                  </div>
                  <span className="text-[10px] font-bold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded border border-pink-500/30">
                    Mandatory
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 leading-snug">
                  Execute mandatory press junkets and media events to maintain studio satisfaction and hype.
                </p>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => handlePromote('TV Interview')}
                    className="p-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-[10px] font-bold cursor-pointer"
                  >
                    TV Junket
                  </button>
                  <button
                    onClick={() => handlePromote('Magazine Cover Shoot')}
                    className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[10px] font-bold cursor-pointer"
                  >
                    Cover Shoot
                  </button>
                  <button
                    onClick={() => handlePromote('Live Stream Fan Q&A')}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold cursor-pointer"
                  >
                    Fan Live Stream
                  </button>
                  <button
                    onClick={() => handlePromote('Press Conference')}
                    className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold cursor-pointer"
                  >
                    Press Conf.
                  </button>
                </div>

                <div className="text-[10px] text-gray-400 italic">
                  Ignoring promotion lowers Studio Confidence & audience hype.
                </div>
              </div>

              {/* ==================== ROW 3 ==================== */}

              {/* CARD 7: PERFORMANCE */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">7. Weekly Performance</h3>
                  </div>
                  <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    {overallPerformance}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-gray-300">
                      <span>Overall Acting</span>
                      <span className="font-bold text-white">{player.talents.acting}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${player.talents.acting}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-gray-300">
                      <span>Emotional & Drama</span>
                      <span className="font-bold text-white">{player.talents.drama}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full bg-sky-400" style={{ width: `${player.talents.drama}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-gray-300">
                      <span>Action & Stunts</span>
                      <span className="font-bold text-white">{player.talents.action}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full bg-red-400" style={{ width: `${player.talents.action}%` }} />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400">
                  Performance updates automatically each week based on training and energy levels.
                </div>
              </div>

              {/* CARD 8: REVIEWS */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">8. Industry Predictions</h3>
                  </div>
                  <span className="text-[10px] font-bold text-yellow-300 bg-yellow-500/20 px-2 py-0.5 rounded border border-yellow-500/30">
                    Oscar Contender
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-2 text-xs">
                  <p className="italic text-gray-200">
                    &quot;Early test screening reports praise the breathtaking emotional intensity of the lead performance.&quot;
                  </p>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>Variety Critic Buzz</span>
                    <span className="text-emerald-400">92% Positive</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400">
                  Actual critic review scores & Metacritic quotes unlock after theatrical release.
                </p>
              </div>

              {/* CARD 9: AWARDS */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">9. Awards & Buzz</h3>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    Frontrunner
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Academy Awards:</span>
                    <span className="font-bold text-amber-300">Best Lead Actor Buzz</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Golden Globes:</span>
                    <span className="font-bold text-amber-300">Drama Category Frontrunner</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Campaign Status:</span>
                    <span className="font-bold text-emerald-400">Active FYC Campaign</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guild Interest:</span>
                    <span className="font-bold text-purple-300">SAG Nominations Likely</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200 font-bold">
                  High award campaign buzz increases your reputation and future salary leverage.
                </div>
              </div>

              {/* ==================== ROW 4 ==================== */}

              {/* CARD 10: SCHEDULE */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">10. Weekly Schedule</h3>
                  </div>
                  <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30">
                    Calendar Set
                  </span>
                </div>

                <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-[11px]">
                  {weeklySchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-lg bg-black/60 border border-white/5 flex items-center justify-between"
                    >
                      <span className="font-bold text-sky-300 w-20">{item.day}</span>
                      <span className="text-gray-200 truncate flex-1">{item.activity}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400">
                  Select activities to customize your weekly schedule focus.
                </p>
              </div>

              {/* CARD 11: FINANCE */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">11. Financial Earnings</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    Bank Connected
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Salary Earned:</span>
                    <span className="font-bold text-white">${currentProject.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Contract:</span>
                    <span className="font-bold text-emerald-400">$0 Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agency Commission (10%):</span>
                    <span className="font-bold text-rose-300">-${(currentProject.salary * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Royalties:</span>
                    <span className="font-bold text-amber-300">+$25,000/yr</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400">
                  All income deposits directly into your Century Bank account upon completion.
                </div>
              </div>

              {/* CARD 12: RISKS */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">12. Production Risks</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    Risk: Low
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>Fatigue Level:</span>
                    <span className="font-bold text-emerald-400">{100 - player.energy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Director Tension:</span>
                    <span className="font-bold text-emerald-400">Minimal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stunt Injury Hazard:</span>
                    <span className="font-bold text-amber-300">Low</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Publicist Coverage:</span>
                    <span className="font-bold text-sky-300">Active</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400">
                  Maintain high energy and positive director relations to avoid filming delays or injuries.
                </div>
              </div>

              {/* ==================== ROW 5 ==================== */}

              {/* CARD 13: BOX OFFICE */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">13. Box Office</h3>
                  </div>
                  <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30">
                    In Production
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Projected Opening Weekend:</span>
                    <span className="font-bold text-emerald-400">$45,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domestic Projection:</span>
                    <span className="font-bold text-white">$120,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worldwide Total Est.:</span>
                    <span className="font-bold text-amber-300">$320,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sequel Interest:</span>
                    <span className="font-bold text-purple-300">High Studio Interest</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal('releases')}
                  className="w-full py-1.5 rounded-xl text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 cursor-pointer"
                >
                  View Released Filmography & Box Office
                </button>
              </div>

              {/* CARD 14: SOCIAL BUZZ */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">14. Social Buzz</h3>
                  </div>
                  <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30">
                    Trending #1
                  </span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
                  <div className="p-2 rounded-xl bg-black/60 border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-sky-300">@{studioName.replace(/\s+/g, '')}</span>
                      <span className="text-gray-500">2h ago</span>
                    </div>
                    <p className="text-gray-200 text-[11px]">
                      &quot;Behind the scenes on set of #{currentProject.movieTitle.replace(/\s+/g, '')}! Production is officially underway.&quot;
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-black/60 border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-purple-300">@HollywoodReporter</span>
                      <span className="text-gray-500">5h ago</span>
                    </div>
                    <p className="text-gray-200 text-[11px]">
                      &quot;Early reaction to casting on #{currentProject.movieTitle.replace(/\s+/g, '')} is overwhelmingly positive among fans.&quot;
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400">
                  Posts update in real-time based on production milestones and media interviews.
                </div>
              </div>

              {/* CARD 15: WRAP-UP */}
              <div className="bg-black/40 border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">15. Wrap-Up Summary</h3>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    Ready
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Director Assessment:</span>
                    <span className="font-bold text-emerald-400">&quot;Outstanding Work&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Producer Review:</span>
                    <span className="font-bold text-white">&quot;Highly Professional&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Salary Deposited:</span>
                    <span className="font-bold text-emerald-400">${currentProject.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fame XP Gained:</span>
                    <span className="font-bold text-amber-300">+250 Fame XP</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-[11px] text-gray-300 leading-relaxed space-y-1.5">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Automatic Theatrical Box Office Debut</span>
                  </div>
                  <p className="text-gray-400 text-[10px]">
                    Once all {currentProject.totalFilmingWeeks} filming weeks conclude (progressed by clicking END WEEK), this feature will automatically premiere in theaters worldwide, calculate opening gross, and appear on IMDb Box Office charts!
                  </p>
                </div>

                <button
                  onClick={() => setActiveModal('releases')}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-black" />
                  <span>VIEW BOX OFFICE RELEASES</span>
                </button>
              </div>
            </div>
          )}
        </div>
        {/* PRODUCTION CONTINUE FOOTER - Tier 1 Fix: Direct Production Progression */}
        <div className="p-4 bg-black/80 border-t-2 border-amber-400/60 shrink-0 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5" />
                <span>Production Control</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px]">1-WEEK PRE-PROD</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {currentProject?.status === 'Pre-Production' ? 'Pre-production (1 week) — Filming starts next End Week!' : `Filming ${currentWeek}/${currentProject?.totalFilmingWeeks} — Progress ${progressPercent}%`}
              </div>
            </div>
            <button
              onClick={() => {
                soundService.playClick();
                setActiveModal('none');
                setTimeout(() => advanceWeek(), 150);
              }}
              disabled={isProcessingWeek}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingWeek ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>PROCESSING WEEK...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>▶ CONTINUE FILMING — ADVANCE 1 WEEK</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 text-center sm:text-right">
            Click to advance calendar + push production 1 week • Pre-production now 1 week (was 2)
          </div>
        </div>
      </div>

      {showReleaseCenter && currentProject && (
        <ReleaseCenterModal
          project={currentProject}
          onClose={() => setShowReleaseCenter(false)}
          onSuccess={() => setShowReleaseCenter(false)}
        />
      )}

      {showRedCarpet && currentProject && (
        <RedCarpetPremiereModal
          project={currentProject}
          onClose={() => setShowRedCarpet(false)}
          onCompletePremiere={() => setShowRedCarpet(false)}
        />
      )}

      {showNegotiationModal && currentProject && (
        <ContractNegotiationModal
          project={negotiationProjectAdapter}
          onClose={() => setShowNegotiationModal(false)}
          onSuccess={handleNegotiationSuccess}
        />
      )}
    </div>
  );
};
