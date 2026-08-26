/**
 * HOLLYWOOD RISING - Game Context Provider
 * Phase 1 Grounded Architecture & Core Gameplay Loop State Management
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SaveData,
  Player,
  CallboardProject,
  AuditionApplication,
  BookedProject,
  ReleasedMovie,
  InboxMessage,
  NpcProfile,
  GiftItem,
  GameSettings,
  Gender,
  Personality,
  RoleType,
  ThemeOption,
  InboxCategory,
  ActingCourse,
  ActiveCourse,
  AgentInfo,
  ManagerInfo,
  WeeklyRecapData,
  TrophyItem,
  AwardRecord,
  TimelineEvent,
  ReleaseConfig,
} from '../types/game';
import { formatCalendarDate, monthOfWeek, closingMonthOfWeek } from '../utils/calendar';
import {
  StorageService,
  DEFAULT_PLAYER,
  generateCallboardProjects,
  validateAndEnforceCallboardRoster,
  generateNpcProfiles,
  GIFT_ITEMS,
  coursesRequiredFor,
} from '../database/storageService';
import { generateWeeklyCourses, ACTING_COURSES_POOL } from '../database/actingSchoolDatabase';
import { soundService } from '../services/soundService';
import { EmpireService } from '../services/empireService';
import { getAgentById, getManagerById } from '../database/representationDatabase';
import { scheduleTvInterview, processTvOffersWeekly, scheduleRadioInterview, processRadioOffersWeekly } from '../services/tvInterviewEngine';
import { ensureSocietyState, processSocietyWeek } from '../services/societyEngine';
import { processStudioWeek, loadStudioState, saveStudioState } from '../services/personalStudioEngine';
import { loadStreamingState, saveStreamingState, processStreamingRoyaltiesWeek, processBidsWeekly, processNpcLicensingWeek, drainNpcSigningBonuses } from '../services/streamingEngine';
import { RepresentationService } from '../services/representationService';
import { ExclusivityService } from '../services/exclusivityService';
import { LockCategory } from '../types/exclusivity';
import { LivingWorldService, processFilmingLocationsWeek } from '../services/livingWorldService';
import { SocialsService, processSocialHubWeek } from '../services/socialsService';
import { ToastMessage, ToastCategory } from '../components/common/ToastContainer';
import { MarketEngineService } from '../services/marketEngineService';
import { NetworkService } from '../services/networkService';
import { BoxOfficeEngineService, PLAYER_MAX_WEEKS } from '../services/boxOfficeEngineService';
import { RoyaltyEngineService } from '../services/royaltyService';
import { AwardsService } from '../services/awardsService';
import { AwardCeremonyResult } from '../types/game';
import { FameService, FAME_XP_MULTIPLIER } from '../services/fameService';
import { HollywoodInsiderService } from '../services/hollywoodInsiderService';
import { notificationService } from '../services/notificationService';
import { collectNotificationItems } from '../services/notificationEngine';
import { processTaxWeek, charityDeltaThisWeek, studioExpenseDeltaThisWeek, ensureTaxBaselines, loadTaxState, getTaxRecord } from '../services/taxEngine';
import { loadBankrollState, saveBankrollState, processBankrollWeek, ensureBankrollInit } from '../services/bankrollEngine';
import { RelationshipEngine } from '../services/relationshipService';
import { ActiveJob, TransactionRecord } from '../types/network';
import { ScandalItem } from '../types/representation';


type MainTab = 'HOME' | 'TALENT' | 'WORLD' | 'NETWORK' | 'EMPIRE' | 'REPRESENTATION';

type ModalType =
  | 'none'
  | 'weekly_recap'
  | 'callboard'
  | 'auditions'
  | 'booking'
  | 'releases'
  | 'inbox'
  | 'membership'
  | 'relationships'
  | 'settings'
  | 'how_to_play'
  | 'about'
  | 'support'
  | 'contact'
  | 'disclaimer'
  | 'credits'
  | 'scrolling_credits'
  | 'roadmap'
  | 'changelog'
  | 'help_center'
  | 'bug_report'
  | 'privacy_policy'
  | 'terms_of_service'
  | 'licenses'
  | 'gift_store'
  | 'marriage_planner'
  | 'trophy_room'
  | 'career_timeline'
  | 'fyc_campaign'
  | 'save_manager'
  | 'career_stats'
  | 'completion_tracker'
  | 'photo_mode'
  | 'notification_history'
  | 'retainer_management'
  | 'award_ceremony'
  | 'notification_center';

interface GameContextType {
  // Navigation & Main Tabs
  currentScreen: 'splash' | 'disclaimer' | 'main_menu' | 'character_creation' | 'game_home';
  setCurrentScreen: (screen: 'splash' | 'disclaimer' | 'main_menu' | 'character_creation' | 'game_home') => void;
  activeMainTab: MainTab;
  setActiveMainTab: (tab: MainTab) => void;

  // Active Modal & Processing
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  openNotificationCenter: () => void;
  isProcessingWeek: boolean;
  lastWeeklyRecap: WeeklyRecapData | null;

  // Selected NPC for Dating / Gift modal
  selectedNpcId: string | null;
  setSelectedNpcId: (id: string | null) => void;

  // Game Data
  saveData: SaveData;
  player: Player;
  callboard: CallboardProject[];
  auditions: AuditionApplication[];
  bookedProjects: BookedProject[];
  releasedMovies: ReleasedMovie[];
  inbox: InboxMessage[];
  relationships: NpcProfile[];
  settings: GameSettings;
  trophies: TrophyItem[];
  awardHistory: AwardRecord[];
  careerTimeline: TimelineEvent[];

  // Phase 6 Awards & Campaign
  selectedFycMovieId: string | null;
  setSelectedFycMovieId: (id: string | null) => void;
  awardCeremonyData: AwardCeremonyResult | null;
  taxStatementData: import('../components/modals/TaxStatementModal').TaxStatementData | null;
  setTaxStatementData: (data: import('../components/modals/TaxStatementModal').TaxStatementData | null) => void;
  setAwardCeremonyData: (data: AwardCeremonyResult | null) => void;
  launchFycCampaign: (
    movieId: string,
    level: 'Ads' | 'Screenings' | 'Dinners' | 'Blitz',
    cost: number
  ) => { success: boolean; message: string };
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;

  // Phase 2 Acting School & Representation Actions
  updatePlayer: (updates: Partial<Player>) => void;
  enrollInCourse: (courseId: string) => { success: boolean; message: string };
  signAgentContract: (agent: AgentInfo) => { success: boolean; message: string };
  hireManager: (manager: ManagerInfo) => { success: boolean; message: string };
  terminateRepresentation: (kind: 'agent' | 'manager') => { success: boolean; message: string };

  // Core Actions
  createNewCharacter: (
    firstName: string,
    lastName: string,
    gender: Gender,
    age: number,
    country: string,
    personality: Personality,
    avatarUrl?: string
  ) => void;

  applyToCallboard: (projectId: string) => { success: boolean; message: string };
  advanceWeek: () => void;
  boostProduction: (bookingId: string) => { success: boolean; message: string };
  joinSAGMembership: () => { success: boolean; message: string };

  // Dating & Relationships
  setupDatingProfile: (gender: Gender, age: number, country: string, preference: 'Men' | 'Women' | 'Everyone') => void;
  interactNpc: (npcId: string, action: 'Interested' | 'Pass') => void;
  sendGiftToNpc: (npcId: string, gift: GiftItem) => { success: boolean; message: string };
  proposeMarriage: (venue: 'Church' | 'Beach' | 'Luxury Hotel' | 'Private Estate', ringValue: number, hasPrenup: boolean) => { success: boolean; message: string };
  haveChild: (schoolType: 'Public School' | 'Private School' | 'Boarding School' | 'University') => { success: boolean; message: string };

  // Inbox
  markMessageRead: (messageId: string) => void;
  markAllMessagesRead: (category?: string) => void;
  deleteMessage: (messageId: string) => void;
  archiveMessage: (messageId: string) => void;

  // Settings & Slots
  switchSaveSlot: (slot: number) => void;
  changeTheme: (theme: ThemeOption) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  updateSave: (newSave: SaveData) => void;
  persistNow: () => void;
  resetGame: () => void;
  manualSave: () => void;

  // Centralized Fame XP System
  addFameXp: (amount: number, reason: string) => void;

  // Movie Release Pipeline
  releaseMovie: (projectId: string, config: ReleaseConfig) => { success: boolean; message: string };

  // Notification Toast System
  toasts: ToastMessage[];
  addToast: (category: ToastCategory, title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSlot, setActiveSlot] = useState<number>(1);
  const [saveData, setSaveData] = useState<SaveData>(() => StorageService.loadSaveData(1));
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'disclaimer' | 'main_menu' | 'character_creation' | 'game_home'>('splash');
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('HOME');
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [isProcessingWeek, setIsProcessingWeek] = useState<boolean>(false);
  const [lastWeeklyRecap, setLastWeeklyRecap] = useState<WeeklyRecapData | null>(null);
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const [selectedFycMovieId, setSelectedFycMovieId] = useState<string | null>(null);
  const [awardCeremonyData, setAwardCeremonyData] = useState<AwardCeremonyResult | null>(null);
  const [taxStatementData, setTaxStatementData] = useState<import('../components/modals/TaxStatementModal').TaxStatementData | null>(null);

  // Notification Toast System State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((category: ToastCategory, title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev.slice(-4), { id, category, title, message, durationMs: 4000 }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // FYC Campaign Launch
  const launchFycCampaign = (
    movieId: string,
    level: 'Ads' | 'Screenings' | 'Dinners' | 'Blitz',
    cost: number
  ): { success: boolean; message: string } => {
    if (saveData.player.money < cost) {
      return { success: false, message: `Insufficient funds! Need $${cost.toLocaleString()}.` };
    }

    const updatedPlayer = { ...saveData.player, money: saveData.player.money - cost };
    const updatedMovies = saveData.releasedMovies.map((m) => {
      if (m.id === movieId) {
        return {
          ...m,
          fycCampaignLevel: level,
          fycCampaignSpent: (m.fycCampaignSpent || 0) + cost,
        };
      }
      return m;
    });

    const updatedTimeline: TimelineEvent[] = [
      {
        id: `tl_fyc_${Date.now()}`,
        year: saveData.player.dateYear,
        week: saveData.player.dateWeek,
        category: 'AWARD',
        title: `FYC Award Campaign Launched`,
        description: `Invested $${cost.toLocaleString()} into a ${level} "For Your Consideration" campaign.`,
      },
      ...(saveData.careerTimeline || []),
    ];

    updateSave({
      ...saveData,
      player: updatedPlayer,
      releasedMovies: updatedMovies,
      careerTimeline: updatedTimeline,
    });

    return { success: true, message: `Successfully launched ${level} FYC campaign for $${cost.toLocaleString()}!` };
  };

  // Centralized XP & Level Progression Engine
  const addFameXp = useCallback((amount: number, reason: string) => {
    if (!amount || amount <= 0) return;
    // SLOW BURN: ALL instant XP (releases, red carpet, level-ups, signings)
    // pays the same global fraction — no source bypasses the rule
    const scaledAmount = Math.max(1, Math.floor(amount * FAME_XP_MULTIPLIER));

    setSaveData((prevSave) => {
      const currentXp = prevSave.player.fameXp || 0;
      const oldLevelInfo = FameService.getFameLevelDetails(currentXp);
      const newXp = currentXp + scaledAmount;
      const newLevelInfo = FameService.getFameLevelDetails(newXp);

      const updatedPlayer: Player = {
        ...prevSave.player,
        fameXp: newXp,
      };

      try {
        const netState = NetworkService.getState();
        const finSummary = NetworkService.calculateFinancialSummary(netState, updatedPlayer.money || 0);
        updatedPlayer.netWorth = finSummary.netWorth;
      } catch (e) {
        // safe fallback
      }

      let updatedInbox = [...prevSave.inbox];
      let updatedTimeline = [...(prevSave.careerTimeline || [])];

      // Auto Level Up check
      if (newLevelInfo.level > oldLevelInfo.level) {
        try {
          soundService.playFanfare();
        } catch {
          // audio fallback
        }
        const rewardCash = 2500 * newLevelInfo.level;
        updatedPlayer.money = (updatedPlayer.money || 0) + rewardCash;
        updatedPlayer.energy = Math.min(updatedPlayer.maxEnergy || 100, (updatedPlayer.energy || 0) + 50);

        const unlocksText = newLevelInfo.reward?.unlocks ? newLevelInfo.reward.unlocks.join(', ') : 'New Career Opportunities';

        // Add Level Up Inbox Message
        updatedInbox.unshift({
          id: `msg_lvl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'CAREER',
          sender: 'Hollywood Talent Guild',
          senderRole: 'Career Board',
          senderAvatar: updatedPlayer.avatarUrl,
          subject: `LEVEL UP! Level ${newLevelInfo.level}: ${newLevelInfo.title}`,
          body: `CONGRATULATIONS!\n\nYour Fame & Career Standing has elevated to Level ${newLevelInfo.level} - "${newLevelInfo.title}"!\n\nLEVEL UP REWARDS UNLOCKED:\n• +$${rewardCash.toLocaleString()} Cash Level Bonus\n• +50 Energy Restored\n• Unlocks: ${unlocksText}\n\nExcess XP has been automatically carried forward into Level ${newLevelInfo.level}. Keep building your Hollywood legacy!`,
          date: formatCalendarDate(updatedPlayer.dateYear, updatedPlayer.dateWeek).fullDateText,
          read: false,
        });

        // Add Career Timeline Event
        updatedTimeline.unshift({
          id: `tl_lvl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          year: updatedPlayer.dateYear,
          week: updatedPlayer.dateWeek,
          category: 'MILESTONE',
          title: `Career Level Up: Lvl ${newLevelInfo.level}`,
          description: `Reached Career Level ${newLevelInfo.level} ("${newLevelInfo.title}"). Cash bonus of $${rewardCash.toLocaleString()} awarded.`,
        });

        addToast('Success', `LEVEL UP! Lvl ${newLevelInfo.level}`, `Reached ${newLevelInfo.title}! +$${rewardCash.toLocaleString()} Bonus Cash!`);
      } else {
        addToast('Information', `+${scaledAmount} Fame XP`, reason);
      }

      const updatedSave: SaveData = {
        ...prevSave,
        player: updatedPlayer,
        inbox: updatedInbox,
        careerTimeline: updatedTimeline,
      };

      StorageService.saveGameData(updatedSave, prevSave.slotNumber || 1);
      return updatedSave;
    });
  }, [addToast]);

  // Add Timeline Event Helper
  const addTimelineEvent = (evt: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...evt,
      id: `tl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    updateSave({
      ...saveData,
      careerTimeline: [newEvent, ...(saveData.careerTimeline || [])],
    });
  };

  // Auto-save helper
  const updateSave = useCallback((newSaveData: SaveData) => {
    try {
      const netState = NetworkService.getState();
      const finSummary = NetworkService.calculateFinancialSummary(netState, newSaveData.player?.money || 0);
      if (newSaveData.player) {
        newSaveData.player.netWorth = finSummary.netWorth;
      }
    } catch (e) {
      // safe fallback
    }
    setSaveData(newSaveData);
    StorageService.saveGameData(newSaveData, newSaveData.slotNumber);
  }, []);

  const updatePlayer = useCallback((updates: Partial<Player>) => {
    setSaveData((prev) => {
      const updatedPlayer = { ...prev.player, ...updates };
      try {
        const netState = NetworkService.getState();
        const finSummary = NetworkService.calculateFinancialSummary(netState, updatedPlayer.money || 0);
        updatedPlayer.netWorth = finSummary.netWorth;
      } catch (e) {
        // safe fallback
      }
      const newSave = { ...prev, player: updatedPlayer };
      StorageService.saveGameData(newSave, newSave.slotNumber);
      return newSave;
    });
  }, []);

  // Views that mutate saveData.player in place (stocks, crypto, investments,
  // donations, upgrades...) call this to persist the CURRENT latest state.
  const persistNow = useCallback(() => {
    setSaveData((prev) => {
      try { StorageService.saveGameData(prev, prev.slotNumber || 1); } catch (e) { console.error('persistNow failed', e); }
      return prev;
    });
  }, []);

  // Update sound & music settings and keep the offline-notification service
  // fed with the latest save (scheduling itself happens when the app hides)
  useEffect(() => {
    soundService.setSoundEnabled(saveData.settings.soundEnabled !== false);
    soundService.setMusicEnabled(saveData.settings.musicEnabled !== false);
    notificationService.refreshContext(saveData);
  }, [saveData.settings.soundEnabled, saveData.settings.musicEnabled, saveData]);

  // OFFLINE = PHONE ONLY. The in-game "while you were away" digest was
  // removed by design: while the app is closed, alerts go exclusively to the
  // phone (first ping 40-60 min after leaving, then hourly, all real events).
  // In-app, the Notification Center only shows LIVE alerts while playing.

  // Open the Notification Center and mark everything as seen
  const openNotificationCenter = useCallback(() => {
    setActiveModal('notification_center');
    try {
      setSaveData((prev) => {
        const tags = collectNotificationItems(prev).map((i) => i.tag);
        const nc = prev.notificationCenter || { digest: [], seenTags: [] };
        const next = {
          ...prev,
          notificationCenter: {
            ...nc,
            seenTags: Array.from(new Set([...nc.seenTags, ...tags])),
            digest: (nc.digest || []).map((d) => ({ ...d, read: true })),
            lastSeenAt: Date.now(),
          },
        };
        StorageService.saveGameData(next, next.slotNumber || 1);
        return next;
      });
    } catch {}
  }, []);

  useEffect(() => {
    // MUSIC IS CONTINUOUS: the soundtrack plays on without restarting when the
    // player navigates between tabs/sections. Tracks play fully before advancing.
    if (currentScreen === 'game_home' || currentScreen === 'main_menu') {
      soundService.startContinuousSoundtrack();
    }
  }, [activeMainTab, currentScreen]);

  // Switch Save Slot
  const switchSaveSlot = (slot: number) => {
    soundService.playClick();
    setActiveSlot(slot);
    const loaded = StorageService.loadSaveData(slot);
    setSaveData(loaded);
    addToast('Information', `Switched to Slot ${slot}`, `Active save profile set to Slot ${slot}.`);
  };

  // Change Theme
  const changeTheme = (theme: ThemeOption) => {
    soundService.playClick();
    const updated = {
      ...saveData,
      settings: { ...saveData.settings, theme },
    };
    updateSave(updated);
  };

  // Create New Character
  const createNewCharacter = (
    firstName: string,
    lastName: string,
    gender: Gender,
    age: number,
    country: string,
    personality: Personality,
    avatarUrl?: string
  ) => {
    soundService.playFanfare();

    const newPlayer: Player = {
      ...DEFAULT_PLAYER,
      id: `player_${Date.now()}`,
      firstName,
      lastName,
      gender,
      age,
      country,
      personality,
      avatarUrl: avatarUrl || DEFAULT_PLAYER.avatarUrl,
      money: 2500,
      energy: 100,
      fans: 0,
      fameXp: 0,
      moviesCompleted: 0,
      awardsWon: 0,
      leadRolesCount: 0,
      principalRolesCount: 0,
      isUnionMember: false,
    };

    const newSave = StorageService.createNewSaveData(newPlayer, activeSlot);
    updateSave(newSave);
    setCurrentScreen('game_home');

    // Show tutorial modal if not seen
    if (!newSave.settings.hasSeenTutorial) {
      setActiveModal('how_to_play');
    }
  };

  // Helper to append timeline event
  const createTimelineEvent = (
    year: number,
    week: number,
    category: TimelineEvent['category'],
    title: string,
    description: string
  ): TimelineEvent => ({
    id: `tl_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    year,
    week,
    category,
    title,
    description,
  });

  // Apply to Callboard Project
  const applyToCallboard = (projectId: string) => {
    const proj = saveData.callboard.find(p => p.id === projectId);
    if (!proj) return { success: false, message: 'Project not found.', reasons: [] as string[] };

    // ============================================================
    // INVISIBLE CASTING CHECKER — audits the player's REAL career
    // before the door opens. Every failed gate produces a specific
    // decline reason. Applying is no longer enough: talent (completed
    // acting courses), fame, skill, union status and representation
    // are all checked against the listing's real requirements.
    // ============================================================
    const p = saveData.player;
    const declineReasons: string[] = [];

    if (p.energy < 20) {
      declineReasons.push(`ENERGY: 20 required to self-tape and attend callbacks — you have ${p.energy}. Rest and come back.`);
    }

    const coursesDone = Math.max(p.completedCourseIds?.length || 0, p.completedCourseRecords?.length || 0);
    const reqCourses = proj.requiredCourses ?? 0;
    if (coursesDone < reqCourses) {
      declineReasons.push(`TRAINING: ${reqCourses} completed acting course${reqCourses > 1 ? 's' : ''} required for a ${proj.roleType} role on a $${(proj.budget / 1000000).toFixed(1)}M production — you have ${coursesDone}. Graduate courses at Acting School.`);
    }

    if (proj.requiredFameXp && (p.fameXp || 0) < proj.requiredFameXp) {
      declineReasons.push(`NAME RECOGNITION: ${proj.requiredFameXp} Fame XP required — you have ${(p.fameXp || 0).toLocaleString()}. CDs at this level won't read unknowns.`);
    }

    if (proj.requiredActing && (p.talents?.acting || 0) < proj.requiredActing) {
      declineReasons.push(`CRAFT: Acting skill ${proj.requiredActing} required — yours is ${p.talents?.acting || 0}. Train the specific skill.`);
    }

    if (proj.budget > 50000000 && !p.isUnionMember) {
      declineReasons.push(`UNION: SAG-AFTRA membership required on productions over $50M (you need 4 completed lead roles to join).`);
    }

    if (proj.budget > 120000000 && proj.roleType === 'Lead' && !(p as any).representation?.agent?.signed) {
      declineReasons.push(`REPRESENTATION: A signed agent must submit you for Lead roles on $120M+ productions. Agents start pitching at Fame 250.`);
    }

    if (declineReasons.length > 0) {
      return {
        success: false,
        message: `CASTING DIRECTOR DECLINED YOUR SUBMISSION — ${proj.roleType} role in "${proj.title}" (${proj.studio}). The door stays closed until requirements are met.`,
        reasons: declineReasons,
      };
    }

    // PRODUCTION SLATE CAP: max 3 active productions at once (movies OR series,
    // sequels included). Casting directors won't hold a slot for a full slate.
    const activeSlate = saveData.bookedProjects.filter(
      (b) => !b.isFilmingComplete && (b.status || '') !== 'Pending Negotiation'
    );
    if (activeSlate.length >= 3) {
      return {
        success: false,
        message: 'Production slate FULL (3/3) — you cannot commit to another movie or series until one wraps. Sequels count toward the limit.',
        reasons: [] as string[],
      };
    }

    soundService.playClick();

    // Deduct 20 Energy
    const updatedPlayer: Player = {
      ...saveData.player,
      energy: saveData.player.energy - 20,
    };

    // Remove from callboard
    const updatedCallboard = saveData.callboard.filter(p => p.id !== projectId);

    // Add to Auditions (locked application with timer)
    const newAudition: AuditionApplication = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      projectId: proj.id,
      movieTitle: proj.title,
      posterUrl: proj.posterUrl,
      roleType: proj.roleType,
      salary: proj.salary,
      filmingWeeks: proj.filmingWeeks,
      weeksRemaining: proj.decisionTimeWeeks,
      status: 'Waiting',
      appliedWeek: saveData.player.dateWeek,
      appliedYear: saveData.player.dateYear,
      studio: proj.studio,
      director: proj.director,
      category: proj.category,
      isTvSeries: (proj as any).isTvSeries,
    };

    const updatedAuditions = [newAudition, ...saveData.auditions];

    // Log event into Career History
    const auditionEvent = createTimelineEvent(
      saveData.player.dateYear,
      saveData.player.dateWeek,
      'ROLE',
      `Audition Attended: ${proj.title}`,
      `Submitted official audition tape for ${proj.roleType} role in "${proj.title}" under ${proj.studio || 'Hollywood Studio'}.`
    );

    const updatedTimeline = [auditionEvent, ...(saveData.careerTimeline || [])];



    updateSave({
      ...saveData,
      player: updatedPlayer,
      callboard: updatedCallboard,
      auditions: updatedAuditions,
      careerTimeline: updatedTimeline,
    });

    return {
      success: true,
      message: `Applied for ${proj.roleType} role in "${proj.title}"! Moved to Auditions and recorded in Career History.`,
      reasons: [] as string[],
    };
  };

  // Enroll in Acting School Course
  const enrollInCourse = (courseId: string) => {
    const currentActive = saveData.player.activeCourses || [];
    if (currentActive.length >= 2) {
      return {
        success: false,
        message: 'You are already enrolled in 2 active courses! You can only study 2 courses at the same time.',
      };
    }

    // Find course in available or catalog pool
    const available = saveData.player.availableSchoolCourses || [];
    let course = available.find(c => c.id === courseId);
    if (!course) {
      course = ACTING_COURSES_POOL.find(c => c.id === courseId);
    }

    if (!course) {
      return { success: false, message: 'Course not found in catalogue.' };
    }

    // GRADUATED courses are closed forever — the school never re-offers them
    if ((saveData.player.completedCourseIds || []).includes(courseId) ||
        (saveData.player.completedCourseRecords || []).some((r: any) => r.courseId === courseId)) {
      return { success: false, message: `You already graduated from "${course.name}" — courses can only be taken once.` };
    }

    // Can't double-enroll a course you're currently attending
    if (currentActive.some((c: any) => c.courseId === courseId)) {
      return { success: false, message: `You're already enrolled in "${course.name}".` };
    }

    if (course.requiresUnionMember && !saveData.player.isUnionMember) {
      return {
        success: false,
        message: 'This elite course requires official SAG-AFTRA Membership. Join the Guild to enroll!',
      };
    }

    if (saveData.player.money < course.cost) {
      return {
        success: false,
        message: `Insufficient funds! Tuition costs $${course.cost.toLocaleString()} (Current Cash: $${saveData.player.money.toLocaleString()}).`,
      };
    }

    soundService.playFanfare();

    // Deduct money immediately
    const updatedPlayer: Player = {
      ...saveData.player,
      money: saveData.player.money - course.cost,
      activeCourses: [
        ...currentActive,
        {
          id: `actc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          courseId: course.id,
          name: course.name,
          teacher: course.teacher,
          category: course.category,
          talentReward: course.talentReward,
          totalWeeks: course.durationWeeks,
          weeksCompleted: 0,
          weeklyEnergyCost: course.weeklyEnergyCost,
          isPaused: false,
          enrolledWeek: saveData.player.dateWeek,
          enrolledYear: saveData.player.dateYear,
        },
      ],
    };

    // Record real transaction
    const netState = NetworkService.loadState(updatedPlayer);
    if (!netState.bankAccount) {
      netState.bankAccount = { checkingBalance: updatedPlayer.money, transactionHistory: [] } as any;
    }
    if (!netState.bankAccount.transactionHistory) netState.bankAccount.transactionHistory = [];
    netState.bankAccount.transactionHistory.unshift({
      id: `tx_course_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      description: `Acting Class Tuition: ${course.name}`,
      amount: -course.cost,
      type: 'EXPENSE',
      category: 'EDUCATION',
      week: saveData.player.dateWeek || 1,
    });
    NetworkService.saveState(netState);

    updateSave({
      ...saveData,
      player: updatedPlayer,
    });



    return {
      success: true,
      message: `Enrolled in "${course.name}"! Paid $${course.cost.toLocaleString()} tuition.`,
    };
  };

  // Sign Agent Contract
  const signAgentContract = (agent: AgentInfo) => {
    soundService.playFanfare();

    if (saveData.player.representation?.agent?.signed) {
      return { success: false, message: 'You already have a signed talent agent. Terminate that contract first.' };
    }

    const contractWeeks = agent.contractLengthWeeks || 52;
    const signedAgent: AgentInfo = {
      ...agent,
      signed: true,
      weeksRemaining: contractWeeks,
      signedWeek: saveData.player.dateWeek,
      signedYear: saveData.player.dateYear,
      lastPitchWeek: 0,
    };

    const updatedPlayer: Player = {
      ...saveData.player,
      representation: {
        ...saveData.player.representation,
        agent: signedAgent,
      },
    };

    const newInboxMsg: InboxMessage = {
      id: `msg_agent_signed_${Date.now()}`,
      category: 'BUSINESS',
      sender: agent.name,
      senderRole: `${agent.agencyName} Senior Partner`,
      senderAvatar: agent.avatarUrl,
      subject: `WELCOME TO ${agent.agencyName.toUpperCase()}!`,
      body: `It is an honor to represent you in Hollywood. We take a ${agent.commissionPercent}% commission on booked contracts and will pitch you for high-profile film auditions.\n\nCONTRACT TERMS:\n• Length: ${(contractWeeks / 52).toFixed(1)} year(s) (${contractWeeks} weeks)\n• Lead Flow: 1 pitch every ${agent.leadFlowWeeks || 5} week(s)\n• Breach Penalty: $${(agent.breachPenalty || 0).toLocaleString()}`,
      date: `Week ${saveData.player.dateWeek}, ${saveData.player.dateYear}`,
      read: false,
    };

    const agentTimelineEvent = createTimelineEvent(
      saveData.player.dateYear,
      saveData.player.dateWeek,
      'EMPIRE',
      `Contract Signed: ${agent.name}`,
      `Signed exclusive talent representation contract with ${agent.agencyName} (${agent.commissionPercent}% commission, ${(contractWeeks / 52).toFixed(1)} yr contract).`
    );

    addFameXp(15, `Signed with Agent ${agent.name}`);

    updateSave({
      ...saveData,
      player: updatedPlayer,
      inbox: [newInboxMsg, ...saveData.inbox],
      careerTimeline: [agentTimelineEvent, ...(saveData.careerTimeline || [])],
    });

    return {
      success: true,
      message: `Signed exclusive representation contract with ${agent.name} at ${agent.agencyName}!`,
    };
  };

  // Hire a Personal Manager — yearly salary paid UPFRONT for the full contract term
  const hireManager = (manager: ManagerInfo) => {
    soundService.playFanfare();

    if (saveData.player.representation?.manager?.signed) {
      return { success: false, message: 'You already have a signed personal manager. Terminate that contract first.' };
    }

    const contractWeeks = manager.contractLengthWeeks || 52;
    const yearly = manager.yearlySalary || 0;
    const totalCost = Math.floor((yearly * contractWeeks) / 52);

    if (saveData.player.money < totalCost) {
      return {
        success: false,
        message: `Insufficient funds! ${manager.name} (${manager.company}) requires $${totalCost.toLocaleString()} paid upfront (${(contractWeeks / 52).toFixed(1)} yrs x $${yearly.toLocaleString()}/yr).`,
      };
    }

    const updatedPlayer: Player = {
      ...saveData.player,
      money: saveData.player.money - totalCost,
      representation: {
        ...saveData.player.representation,
        manager: {
          ...manager,
          signed: true,
          weeksRemaining: contractWeeks,
          signedWeek: saveData.player.dateWeek,
          signedYear: saveData.player.dateYear,
        },
      },
    };

    const newInboxMsg: InboxMessage = {
      id: `msg_manager_signed_${Date.now()}`,
      category: 'BUSINESS',
      sender: manager.name,
      senderRole: `${manager.company} Managing Partner`,
      senderAvatar: manager.avatarUrl,
      subject: `WELCOME TO ${manager.company.toUpperCase()}!`,
      body: `It is an honor to manage your career finances. I negotiated directly with studios on your behalf and will source bankroll, franchise, sponsorship and investing opportunities.\n\nCONTRACT TERMS:\n• Length: ${(contractWeeks / 52).toFixed(1)} year(s) (${contractWeeks} weeks)\n• Salary: $${yearly.toLocaleString()}/yr — PAID UPFRONT: $${totalCost.toLocaleString()}\n• Deal Cap: up to $${((manager.dealCap || 0) / 1000000).toFixed(0)}M in sourced deals\n• Breach Penalty: $${(manager.breachPenalty || 0).toLocaleString()}`,
      date: `Week ${saveData.player.dateWeek}, ${saveData.player.dateYear}`,
      read: false,
    };

    const managerTimelineEvent = createTimelineEvent(
      saveData.player.dateYear,
      saveData.player.dateWeek,
      'EMPIRE',
      `Contract Signed: ${manager.name}`,
      `Signed personal management contract with ${manager.company} ($${yearly.toLocaleString()}/yr paid upfront, ${(contractWeeks / 52).toFixed(1)} yr term).`
    );

    addFameXp(12, `Signed with Manager ${manager.name}`);

    updateSave({
      ...saveData,
      player: updatedPlayer,
      inbox: [newInboxMsg, ...saveData.inbox],
      careerTimeline: [managerTimelineEvent, ...(saveData.careerTimeline || [])],
    });

    return {
      success: true,
      message: `Signed with ${manager.name} (${manager.company})! Paid $${totalCost.toLocaleString()} upfront for ${(contractWeeks / 52).toFixed(1)} years.`,
    };
  };

  // Terminate agent or manager — breach fine applies when contract has weeks remaining
  const terminateRepresentation = (kind: 'agent' | 'manager') => {
    const rep = saveData.player.representation || {};
    const current = kind === 'agent' ? rep.agent : rep.manager;
    if (!current?.signed) {
      return { success: false, message: 'No active contract to terminate.' };
    }
    const weeksLeft = current.weeksRemaining || 0;
    const penalty = weeksLeft > 0 ? current.breachPenalty || 0 : 0;

    if (saveData.player.money < penalty) {
      return {
        success: false,
        message: `Insufficient funds to break the contract! Breach penalty: $${penalty.toLocaleString()} (${weeksLeft} weeks remaining).`,
      };
    }

    const updatedPlayer: Player = {
      ...saveData.player,
      money: saveData.player.money - penalty,
      representation: {
        ...saveData.player.representation,
        [kind]: undefined,
      },
    };

    const terminationEvent = createTimelineEvent(
      saveData.player.dateYear,
      saveData.player.dateWeek,
      'EMPIRE',
      `Contract Terminated: ${current.name}`,
      penalty > 0
        ? `Terminated ${kind === 'agent' ? 'agent' : 'manager'} contract with ${current.name} early. Paid $${penalty.toLocaleString()} breach penalty (${weeksLeft} weeks remaining).`
        : `Contract with ${current.name} ended at term. No penalty.`
    );

    updateSave({
      ...saveData,
      player: updatedPlayer,
      careerTimeline: [terminationEvent, ...(saveData.careerTimeline || [])],
    });

    return {
      success: true,
      message:
        penalty > 0
          ? `Contract terminated. Paid $${penalty.toLocaleString()} breach penalty.`
          : 'Contract ended cleanly at term. No penalty.',
    };
  };

  // ADVANCE WEEK - Core Loop Progression (End Week System)
  const advanceWeek = () => {
    soundService.playGoldChime();
    setIsProcessingWeek(true);
    let awardNightPending = false;

    try {
      let p = { ...saveData.player };
      // Snapshot for the fan-token price engine (fame momentum this week)
      const fameXpAtWeekStart = p.fameXp;

    // Ensure talents object exists
    if (!p.talents) {
      p.talents = { acting: 0, voice: 0, comedy: 0, drama: 0, action: 0, dancing: 0 };
    } else {
      p.talents = { ...p.talents };
    }

    // 1. Advance Calendar Date by 7 Calendar Days
    const nextWeekRaw = p.dateWeek + 1;
    const dateInfo = formatCalendarDate(nextWeekRaw, p.dateYear);
    const newWeek = dateInfo.week;
    const newYear = dateInfo.year;

    p.dateWeek = newWeek;
    p.dateYear = newYear;

    // 2. Recharge Energy
    const energyRestored = Math.max(0, p.maxEnergy - p.energy);
    let currentEnergy = p.maxEnergy;

    // 3. Centralized Financial & Progression Ledger (Single Source of Truth)
    const startMoney = p.money;
    const startFans = p.fans || 0;
    const startFame = p.fameXp || 0;

    const livingExpense = 0;
    let propertyExpensesThisWeek = 0;
    let vehicleExpensesThisWeek = 0;
    let securityExpensesThisWeek = 0;
    let prRetainerExpensesThisWeek = 0;
    let legalRetainerExpensesThisWeek = 0;
    let writerExpensesThisWeek = 0;
    let advisorExpensesThisWeek = 0;
    let healthExpensesThisWeek = 0;
    let loanRepaymentExpensesThisWeek = 0;

    // Track Weekly Recap Data
    const careerMovies: string[] = [];
    const careerSeries: string[] = [];
    const careerAuditions: string[] = [];
    const careerCastingResults: string[] = [];
    const careerFilmingProgress: string[] = [];
    const careerTraining: string[] = [];

    let salaryEarnedThisWeek = 0;
    let royaltiesEarnedThisWeek = 0;
    let residualsEarnedThisWeek = 0;
    let backendEarnedThisWeek = 0;
    let streamingEarnedThisWeek = 0;
    let merchEarnedThisWeek = 0;
    let syndicationEarnedThisWeek = 0;
    let internationalEarnedThisWeek = 0;
    let businessIncomeThisWeek = 0;
    let propertyIncomeThisWeek = 0;
    let sponsorshipIncomeThisWeek = 0;
    let endorsementIncomeThisWeek = 0;
    let socialYoutubeIncomeThisWeek = 0;
    let savingsInterestThisWeek = 0;
    let boxOfficeWeeklyGrossThisWeek = 0;
    // Real income buckets that land through the weekly reconciliation
    let streamingIncomeThisWeek = 0;
    let studioIncomeThisWeek = 0;
    let hubIncomeThisWeek = 0;
    let interviewFeeIncomeThisWeek = 0;
    let bankrollIncomeThisWeek = 0;
    let taxesPaidThisWeek = 0;
    let taxFilingAdjustment = 0;

    let fameGainedThisWeek = 0;

    const socialPosts: string[] = [];
    const socialTrending: string[] = [];
    const socialReputation: string[] = [];
    let fansGainedThisWeek = 0;

    const worldNews: string[] = [];
    const worldTv: string[] = [];
    const worldRadio: string[] = [];
    const worldStreaming: string[] = [];
    const worldAwards: string[] = [];
    const worldEvents: string[] = [];

    const networkBank: string[] = [];
    const networkSavings: string[] = [];
    const networkProperties: string[] = [];
    const networkVehicles: string[] = [];
    const networkSecurity: string[] = [];
    const networkVault: string[] = [];
    const networkForbes: string[] = [];

    const empireBusinesses: string[] = [];
    const empireHolding: string[] = [];
    const empireElite: string[] = [];
    const empireRealEstate: string[] = [];
    const empireBoard: string[] = [];
    const empireExpansion: string[] = [];

    const repPr: string[] = [];
    const repContracts: string[] = [];
    const repMedia: string[] = [];
    const repBrandDeals: string[] = [];
    const repSponsorships: string[] = [];
    const repLawFirm: string[] = [];

    const nextAuditions: string[] = [];
    const nextPremieres: string[] = [];
    const nextAwardShows: string[] = [];
    const nextDeadlines: string[] = [];
    const nextLaunches: string[] = [];
    const nextPayments: string[] = [];

    const newInboxMessages: InboxMessage[] = [];

    // ------------------------------------------------------------------
    // REPRESENTATION CONTRACT CLOCK (Agents & Managers tick down weekly)
    // ------------------------------------------------------------------
    if (p.representation?.agent?.signed && (p.representation.agent.weeksRemaining ?? 0) > 0) {
      const newWeeks = (p.representation.agent.weeksRemaining || 1) - 1;
      if (newWeeks <= 0) {
        const expiringAgent = p.representation.agent;
        p.representation = { ...p.representation, agent: undefined };
        newInboxMessages.unshift({
          id: `msg_agent_end_${Date.now()}`,
          category: 'BUSINESS',
          sender: expiringAgent.name,
          senderRole: expiringAgent.agencyName,
          senderAvatar: expiringAgent.avatarUrl,
          subject: `CONTRACT COMPLETED: ${expiringAgent.agencyName.toUpperCase()}`,
          body: `Your ${((expiringAgent.contractLengthWeeks || 52) / 52).toFixed(1)}-year contract with ${expiringAgent.name} has reached its term. No penalty. If you want to continue, find a new offer in the Representation hub.`,
          date: dateInfo.fullDateText,
          read: false,
        });
      } else {
        p.representation = {
          ...p.representation,
          agent: { ...p.representation.agent, weeksRemaining: newWeeks },
        };
      }
    }
    if (p.representation?.manager?.signed && (p.representation.manager.weeksRemaining ?? 0) > 0) {
      const newWeeks = (p.representation.manager.weeksRemaining || 1) - 1;
      if (newWeeks <= 0) {
        const expiringMgr = p.representation.manager;
        p.representation = { ...p.representation, manager: undefined };
        newInboxMessages.unshift({
          id: `msg_manager_end_${Date.now()}`,
          category: 'BUSINESS',
          sender: expiringMgr.name,
          senderRole: expiringMgr.company,
          senderAvatar: expiringMgr.avatarUrl,
          subject: `CONTRACT COMPLETED: ${expiringMgr.company.toUpperCase()}`,
          body: `Your management contract with ${expiringMgr.name} has reached its term. No penalty. Visit the Representation hub to sign a new manager if you wish.`,
          date: dateInfo.fullDateText,
          read: false,
        });
      } else {
        p.representation = {
          ...p.representation,
          manager: { ...p.representation.manager, weeksRemaining: newWeeks },
        };
      }
    }

    // ------------------------------------------------------------------
    // PROCESS ACTIVE JOBS (JOB PAYROLL SYSTEM)
    // ------------------------------------------------------------------
    const networkState = NetworkService.loadState(p);
    const activeJobs = networkState.activeJobs || [];

    if (activeJobs.length > 0) {
      const remainingActiveJobs: ActiveJob[] = [];

      activeJobs.forEach((job) => {
        if (job.weeksRemaining > 0) {
          const weeklySalary = job.weeklySalary || 0;
          salaryEarnedThisWeek += weeklySalary;

          if (job.energyCost && job.energyCost > 0) {
            currentEnergy = Math.max(0, currentEnergy - job.energyCost);
          }

          const newWeeksRemaining = job.weeksRemaining - 1;
          const updatedTotalEarned = (job.totalEarned || 0) + weeklySalary;

          const txRecord: TransactionRecord = {
            id: `tx_job_payroll_${job.id}_w${newWeek}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            description: `Weekly Salary: ${job.title}`,
            amount: weeklySalary,
            type: 'INCOME',
            category: 'Salary',
            week: newWeek,
          };

          if (!networkState.bankAccount) {
            networkState.bankAccount = {
              checkingBalance: startMoney,
              savingsBalance: 0,
              savingsApy: 0.025,
              businessBalance: 0,
              investmentBalance: 0,
              offshoreBalance: 0,
              offshoreApy: 0.04,
              activeLoans: [],
              loanHistory: [],
              preGeneratedOffers: [],
              creditScore: 320,
              bankReputation: 50,
              reputationRating: 'CCC',
              transactionHistory: [],
            };
          }
          networkState.bankAccount.transactionHistory = [
            txRecord,
            ...(networkState.bankAccount.transactionHistory || []),
          ];

          newInboxMessages.unshift({
            id: `msg_payroll_${job.id}_w${newWeek}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            category: 'BUSINESS',
            sender: 'Hollywood Payroll Services',
            senderRole: 'HR & Payroll Operations',
            senderAvatar: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80',
            subject: `Weekly Salary Received: $${weeklySalary.toLocaleString()} (${job.title})`,
            body: `Weekly Salary Received! Your salary payment of $${weeklySalary.toLocaleString()} for your position as ${job.title} has been processed and deposited. Total earned to date: $${updatedTotalEarned.toLocaleString()}.`,
            date: dateInfo.fullDateText,
            read: false,
          });

          networkBank.push(`💼 Salary Deposited: $${weeklySalary.toLocaleString()} from ${job.title}`);

          if (newWeeksRemaining > 0) {
            remainingActiveJobs.push({
              ...job,
              weeksRemaining: newWeeksRemaining,
              totalEarned: updatedTotalEarned,
            });
          } else {
            newInboxMessages.unshift({
              id: `msg_job_ended_${job.id}_w${newWeek}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              category: 'BUSINESS',
              sender: 'Hollywood Payroll Services',
              senderRole: 'HR & Payroll Operations',
              senderAvatar: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80',
              subject: `Job Contract Concluded: ${job.title}`,
              body: `Your employment contract for ${job.title} has concluded. Total earned: $${updatedTotalEarned.toLocaleString()}.`,
              date: dateInfo.fullDateText,
              read: false,
            });
          }
        }
      });

      networkState.activeJobs = remainingActiveJobs;
    }

    // Itemized Property Upkeep & Rent Income
    (networkState.properties || []).forEach((prop) => {
      if (prop.isOwned) {
        if (prop.weeklyUpkeep) {
          propertyExpensesThisWeek += prop.weeklyUpkeep;
          networkProperties.push(`Property Upkeep: -$${prop.weeklyUpkeep.toLocaleString()} (${prop.name})`);
        }
        if (prop.isMortgaged && prop.weeklyMortgage) {
          propertyExpensesThisWeek += prop.weeklyMortgage;
          prop.mortgageRemaining = Math.max(0, (prop.mortgageRemaining || prop.price * 0.8) - prop.weeklyMortgage * 0.7);
          networkProperties.push(`Mortgage Payment: -$${prop.weeklyMortgage.toLocaleString()} (${prop.name})`);
        }
        if (prop.isRentedOut && prop.weeklyRentIncome) {
          propertyIncomeThisWeek += prop.weeklyRentIncome;
          networkProperties.push(`Collected $${prop.weeklyRentIncome.toLocaleString()} rent from ${prop.name}`);
        }
        prop.price = Math.round(prop.price * 1.001);
      }
    });

    // Itemized Vehicle Maintenance
    (networkState.vehicles || []).forEach((v) => {
      if (v.isOwned && v.weeklyUpkeep) {
        vehicleExpensesThisWeek += v.weeklyUpkeep;
        networkVehicles.push(`Vehicle Upkeep: -$${v.weeklyUpkeep.toLocaleString()} (${v.name})`);
      }
    });

    // Itemized Security Packages Detail
    (networkState.securityPackages || []).forEach((sec) => {
      if (sec.isHired && sec.weeklyCost) {
        securityExpensesThisWeek += sec.weeklyCost;
        networkSecurity.push(`Security Detail: -$${sec.weeklyCost.toLocaleString()} (${sec.name})`);
      }
    });

    // Security personnel salaries (real weekly cost, matches UI "$/wk")
    (networkState.securityPersonnel || []).forEach((pers) => {
      if (pers.isHired && pers.weeklySalary) {
        securityExpensesThisWeek += pers.weeklySalary;
        networkSecurity.push(`Security Team: -$${pers.weeklySalary.toLocaleString()} (${pers.name})`);
      }
    });

    // Itemized Bank Loans Repayment & Savings Interest
    if (networkState.bankAccount) {
      if (networkState.bankAccount.savingsBalance > 0) {
        savingsInterestThisWeek = Math.round(networkState.bankAccount.savingsBalance * (networkState.bankAccount.savingsApy / 52));
        if (savingsInterestThisWeek > 0) {
          networkState.bankAccount.savingsBalance += savingsInterestThisWeek;
          networkSavings.push(`Earned $${savingsInterestThisWeek.toLocaleString()} interest on savings balance`);
        }
      }
      const loanProcResult = NetworkService.processWeeklyLoansAndCredit(networkState, p.money);
      Object.assign(networkState.bankAccount, loanProcResult.nextState.bankAccount);
      loanRepaymentExpensesThisWeek += loanProcResult.cashDeducted;
      networkBank.push(...loanProcResult.logMessages);
    }

    networkState.lastProcessedWeek = newWeek;
    networkState.lastProcessedYear = newYear;

    NetworkService.saveState(networkState);

    // Process Services (Empire, Representation, Socials, Living World)
    // bestBoxOfficeGross feeds the rivalry War Room: showdown odds compare
    // against the player's best REAL worldwide gross, never a fake number.
    const bestGrossSoFar = saveData.releasedMovies.reduce((mx, m) => Math.max(mx, m.worldwideGross || 0), 0);
    const lifetimeGrossSoFar = saveData.releasedMovies.reduce((sum, m) => sum + (m.worldwideGross || 0), 0);
    const empireResult = EmpireService.processEndWeek(p, undefined, { bestBoxOfficeGross: bestGrossSoFar, lifetimeBoxOfficeGross: lifetimeGrossSoFar });

    // BLACK CARD SOCIETY weekly tick — annual dues + co-investment payouts.
    // All amounts are real and hit the wallet immediately.
    try {
      const societyState = EmpireService.getState();
      ensureSocietyState(societyState);
      const socTick = processSocietyWeek(societyState, newWeek, newYear);
      if (socTick.duesCharged > 0) {
        p.money = Math.max(0, p.money - socTick.duesCharged);
        newInboxMessages.unshift({
          id: `msg_society_dues_${Date.now()}`,
          category: 'FINANCE',
          sender: 'Black Card Society',
          senderRole: 'Memberships Office',
          subject: `🖤 Annual dues charged — $${socTick.duesCharged.toLocaleString()}`,
          body: `Your Black Card Society annual dues have been charged.\n\n• Amount: $${socTick.duesCharged.toLocaleString()}\n• Membership remains active — 140 contacts, the concierge desk and the contracts floor stay open.\n\nSee you at the next event.`,
          date: dateInfo.fullDateText,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
      if (socTick.investPayout > 0) {
        p.money += socTick.investPayout;
        socialPosts.push(`🖤 Society investments paid $${socTick.investPayout.toLocaleString()} this week.`);
      }
      for (const expired of socTick.expiredDeals) {
        newInboxMessages.unshift({
          id: `msg_society_mature_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'FINANCE',
          sender: 'Black Card Society',
          senderRole: 'Contracts Desk',
          subject: `Investment matured: ${expired}`,
          body: `"${expired}" has run its full term and paid out its final weekly return. The contract is now closed.\n\nGrow more relationships in the Network to unlock fresh co-investment seats.`,
          date: dateInfo.fullDateText,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
      EmpireService.saveState(societyState);
    } catch (e) {
      console.error('Society weekly tick error:', e);
    }

    const repResult = RepresentationService.processEndWeek(p, saveData.bookedProjects, saveData.releasedMovies);
    const socialsResult = SocialsService.processEndWeek(p, saveData);

    // SOCIAL MEDIA HUB WEEKLY PROCESSING (premium, writers, algorithm, creator studio)
    try {
      const hubState = SocialsService.getState();
      const hubResult = processSocialHubWeek(hubState, p, saveData);
      if (hubResult.moneyDelta > 0) hubIncomeThisWeek += hubResult.moneyDelta;
      if (hubResult.messages.length > 0) {
        socialReputation.push(...hubResult.messages);
      }
      SocialsService.saveState(hubState);
    } catch (e) {
      console.error('Error processing social hub week:', e);
    }
    // LIVING WORLD: studios fight for market share weekly, relationships move
    // on your REAL credits (studios you actually work with), and the filming
    // locations catalogue drifts + rotates destinations in and out.
    const playerStudioNames = Array.from(new Set([
      ...(saveData.bookedProjects || []).map((b) => b.studio).filter(Boolean),
      ...(saveData.releasedMovies || []).map((m) => m.studio).filter(Boolean),
    ])) as string[];
    try {
      const exclNotes = ExclusivityService.processWeek(newWeek, newYear);
      if (exclNotes.length > 0) worldNews.push(...exclNotes);
    } catch (e) {
      console.warn('Exclusivity weekly tick error:', e);
    }
    const livingWorldResult = LivingWorldService.advanceWorldWeek(newWeek, newYear, p, playerStudioNames);
    try {
      const locationNews = processFilmingLocationsWeek(newWeek, newYear);
      if (locationNews.length > 0) worldNews.push(...locationNews);
    } catch (e) {
      console.warn('Filming locations weekly tick error:', e);
    }

    if (socialsResult.socialPosts) socialPosts.push(...socialsResult.socialPosts);
    if (socialsResult.socialTrending) socialTrending.push(...socialsResult.socialTrending);
    if (socialsResult.socialReputation) socialReputation.push(...socialsResult.socialReputation);

    // YT mini-bank payouts that CLEARED this week — credit wallet + inbox.
    // (Tax was already withheld at transfer time; the net is post-tax.)
    if ((socialsResult as any).ytPayoutArrivals && (socialsResult as any).ytPayoutArrivals.length > 0) {
      for (const arrival of (socialsResult as any).ytPayoutArrivals) {
        p.money += arrival.net;
        newInboxMessages.unshift({
          id: `msg_yt_payout_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'FINANCE',
          sender: 'YouTube Creator Payments',
          senderRole: 'AdSense Payout Desk',
          subject: `💰 YouTube monthly payout cleared — $${arrival.net.toLocaleString()} added to your wallet`,
          body: `Your month-end YouTube payout has cleared.\n\n• Payout: $${arrival.gross.toLocaleString()}\n• Tax withheld (20% — YouTube is the only taxed platform): −$${arrival.tax.toLocaleString()}\n• NET CREDITED: $${arrival.net.toLocaleString()}\n• Clearing time: ${arrival.weeks} week${arrival.weeks > 1 ? 's' : ''} from month-end\n\nNext month's ad revenue keeps accruing in your Creator Bank — it pays out automatically at the end of every month.`,
          date: dateInfo.fullDateText,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
    }

    // IG mini-bank payouts that CLEARED this week — credit wallet + inbox.
    if ((socialsResult as any).igPayoutArrivals && (socialsResult as any).igPayoutArrivals.length > 0) {
      for (const arrival of (socialsResult as any).igPayoutArrivals) {
        p.money += arrival.net;
        newInboxMessages.unshift({
          id: `msg_ig_payout_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'FINANCE',
          sender: 'Instagram Creator Payouts',
          senderRole: 'Creator Bonus Desk',
          subject: `💰 Instagram monthly payout cleared — $${arrival.net.toLocaleString()} added to your wallet`,
          body: `Your month-end Instagram payout has cleared.\n\n• Payout: $${arrival.net.toLocaleString()}\n• Tax withheld: $0 — Instagram payouts are TAX-FREE (Premium benefit; only YouTube is taxed)\n• Clearing time: ${arrival.weeks} week${arrival.weeks > 1 ? 's' : ''} from month-end\n\nNext month's Creator Bonus revenue keeps accruing in your Gram Bank — it pays out automatically at the end of every month.`,
          date: dateInfo.fullDateText,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
    }

    // X mini-bank payouts that CLEARED this week — credit wallet + inbox.
    if ((socialsResult as any).twPayoutArrivals && (socialsResult as any).twPayoutArrivals.length > 0) {
      for (const arrival of (socialsResult as any).twPayoutArrivals) {
        p.money += arrival.net;
        newInboxMessages.unshift({
          id: `msg_tw_payout_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'FINANCE',
          sender: 'X Creator Payouts',
          senderRole: 'Ads Revenue Sharing Desk',
          subject: `💰 X monthly payout cleared — $${arrival.net.toLocaleString()} added to your wallet`,
          body: `Your month-end X payout has cleared.\n\n• Payout: $${arrival.net.toLocaleString()}\n• Tax withheld: $0 — X payouts are TAX-FREE (Premium benefit; only YouTube is taxed)\n• Clearing time: ${arrival.weeks} week${arrival.weeks > 1 ? 's' : ''} from month-end\n\nNext month's ads revenue keeps accruing in your X Bank — it pays out automatically at the end of every month.`,
          date: dateInfo.fullDateText,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
    }

    // Writer contracts that ran out this week — send formal goodbye to Inbox
    if (socialsResult.expiredWriters && socialsResult.expiredWriters.length > 0) {
      for (const ex of socialsResult.expiredWriters) {
        const platLabel = SocialsService.PLATFORM_LABEL[ex.platform || 'twitter'] || 'social';
        newInboxMessages.unshift({
          id: `msg_writer_expired_${ex.name.replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          category: 'SOCIAL',
          sender: ex.name,
          senderRole: ex.agencyName || 'PR & Ghostwriting Agency',
          senderAvatar: ex.avatar,
          subject: `CONTRACT COMPLETE — ${ex.name} signs off from ${platLabel}`,
          body: `Dear ${p.firstName},\n\nOur ${platLabel} retainer has reached its final week, and per the terms of our agreement, my services for your account conclude today.\n\nIt has been a genuine pleasure shaping your voice on ${platLabel}. The growth we built together doesn't stop here — the audience we activated keeps listening.\n\nIf you'd like to renew, you know where to find me. My calendar fills fast, but former clients always get the first call.\n\nWith respect,\n${ex.name}\n${ex.agencyName || 'Hollywood PR Media Group'}`,
          date: `Week ${newWeek}, ${newYear}`,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
    }

    // FOLLOWERS ARE NOT GAME FANS. player.fans grows ONLY from movie
    // releases and award wins; social followers stay on the platforms.
    prRetainerExpensesThisWeek = repResult.prWeeklyCost || 0;
    legalRetainerExpensesThisWeek = repResult.lawWeeklyCost || 0;
    writerExpensesThisWeek = socialsResult.writerWeeklyCost || 0;
    sponsorshipIncomeThisWeek = socialsResult.weeklySponsorshipIncome || 0;
    endorsementIncomeThisWeek = repResult.weeklyEarnings || 0;
    // YT ad revenue now accrues to the Creator Bank (mini-bank inside YouTube)
    // — it reaches the wallet only via transfers that clear in 1-5 weeks.
    socialYoutubeIncomeThisWeek = 0;

    if (prRetainerExpensesThisWeek > 0) repPr.push(`PR Agency Retainer: -$${prRetainerExpensesThisWeek.toLocaleString()}`);
    if (legalRetainerExpensesThisWeek > 0) repLawFirm.push(`Law Firm Retainer: -$${legalRetainerExpensesThisWeek.toLocaleString()}`);
    if (writerExpensesThisWeek > 0) repPr.push(`PR Content Writer: -$${writerExpensesThisWeek.toLocaleString()}`);

    if (livingWorldResult.worldNews && livingWorldResult.worldNews.length > 0) {
      worldNews.push(...livingWorldResult.worldNews);
    }

    // AGENT & MANAGER INBOX PITCHES (they pitch themselves when you're doing well)
    try {
      const repStateNow = RepresentationService.getState();
      if (repStateNow.pendingAgentPitches && repStateNow.pendingAgentPitches.length > 0) {
        repStateNow.pendingAgentPitches.forEach((agentId) => {
          const ag = getAgentById(agentId);
          if (!ag) return;
          newInboxMessages.unshift({
            id: `msg_agent_pitch_offer_${agentId}_${Date.now()}`,
            category: 'BUSINESS',
            sender: ag.name,
            senderRole: `${ag.specialty || 'Talent Agent'} — ${ag.agencyName}`,
            senderAvatar: ag.avatarUrl,
            subject: `${ag.name} (${ag.agencyName}) wants to represent you`,
            body: `${ag.pitchMessage || `Your performance has been turning heads. ${ag.name} at ${ag.agencyName} wants to partner with you.`}\n\nOFFER HIGHLIGHTS:\n• Agent Cut: ${ag.commissionPercent}%\n• Budget Range: up to $${((ag.dealCap || 15000000) / 1000000).toFixed(0)}M\n• Fan Bonus: +${ag.fanBonusPercent || 0}% | Negotiation: +${ag.negotiationBonus || 0}%\n• Residual Bonus: +${ag.residualBonusPercent || 0}% | Royalty Range: ${ag.royaltyRangeText || '—'}\n• Lead Flow: 1 lead every ${ag.leadFlowWeeks || 5} weeks\n• Contract: ${((ag.contractLengthWeeks || 52) / 52).toFixed(1)} year(s) | Breach Penalty: $${(ag.breachPenalty || 0).toLocaleString()}\n\nAccept to sign the contract, or reject this offer.`,
            date: dateInfo.fullDateText,
            read: false,
            offerType: 'AGENT',
            offerRefId: ag.id,
            handled: false,
          });
        });
        repStateNow.pendingAgentPitches = [];
        RepresentationService.saveState(repStateNow);
      }
      if (repStateNow.pendingManagerPitches && repStateNow.pendingManagerPitches.length > 0) {
        repStateNow.pendingManagerPitches.forEach((managerId) => {
          const mgr = getManagerById(managerId);
          if (!mgr) return;
          newInboxMessages.unshift({
            id: `msg_manager_pitch_offer_${managerId}_${Date.now()}`,
            category: 'BUSINESS',
            sender: mgr.name,
            senderRole: `${mgr.company}`,
            senderAvatar: mgr.avatarUrl,
            subject: `${mgr.name} (${mgr.company}) wants to manage your career`,
            body: `${mgr.pitchMessage || `${mgr.name} wants to handle your finances and opportunities.`}\n\nOFFER HIGHLIGHTS:\n• Salary: $${(mgr.yearlySalary || 0).toLocaleString()}/yr (paid upfront)\n• Deal Cap: up to $${((mgr.dealCap || 0) / 1000000).toFixed(0)}M sourced\n• Commission on sourced deals: ${mgr.commissionPercent}%\n• Specialty: ${mgr.specialty || 'Financial management'}\n• Contract: ${((mgr.contractLengthWeeks || 52) / 52).toFixed(1)} year(s) | Breach Penalty: $${(mgr.breachPenalty || 0).toLocaleString()}\n\nAccept to sign the contract (salary paid upfront), or reject this offer.`,
            date: dateInfo.fullDateText,
            read: false,
            offerType: 'MANAGER',
            offerRefId: mgr.id,
            handled: false,
          });
        });
        repStateNow.pendingManagerPitches = [];
        RepresentationService.saveState(repStateNow);
      }
    } catch (e) {
      console.error('Error draining representation pitches:', e);
    }

    // ACHIEVEMENT REWARDS: cash + XP captured here, paid out at the end of the
    // week AFTER the single-source-of-truth assignment (so nothing gets swallowed)
    let achievementRewardCash = 0;
    let achievementRewardXp = 0;
    if ((empireResult as any).achievementsCash > 0) {
      achievementRewardCash = (empireResult as any).achievementsCash || 0;
      achievementRewardXp = (empireResult as any).achievementsXp || 0;
      empireBusinesses.push(`🏆 ACHIEVEMENT REWARDS: +$${Math.floor(achievementRewardCash * 0.5).toLocaleString()} cash & +${Math.max(1, Math.floor(achievementRewardXp * FAME_XP_MULTIPLIER))} Fame XP`);
    }
    // Empire weekly yield is ONE real number covering businesses + commercial
    // real estate + acting academy net. It always counts — owning only a film
    // lot or academy must still pay (previously gated on having an active business).
    businessIncomeThisWeek = empireResult.weeklyCashYield || 0;
    if (empireResult.logMessages && empireResult.logMessages.length > 0) {
      empireBusinesses.push(...empireResult.logMessages);
    }

    if (repResult.notifications && repResult.notifications.length > 0) {
      repPr.push(...repResult.notifications);
    }

    // SCANDAL BREAKING NEWS: a fresh scandal gets a full inbox story so the
    // player always SEES it — not just a cryptic fan-loss line in the recap
    const newScandal = (repResult as any).newScandal as ScandalItem | null | undefined;
    if (newScandal) {
      const sevColor = newScandal.severity === 'CRITICAL' ? '🚨 CRITICAL' : newScandal.severity === 'MODERATE' ? '⚠️ MODERATE' : 'MINOR';
      newInboxMessages.unshift({
        id: `msg_scandal_${newScandal.id}`,
        category: 'CRISIS',
        sender: 'Hollywood Tabloid Circuit',
        senderRole: 'Breaking News Desk',
        senderAvatar: p.avatarUrl,
        subject: `📰 ${sevColor} SCANDAL: ${newScandal.title}`,
        body: `BREAKING COVERAGE\n\n${newScandal.story || newScandal.cause}\n\nSEVERITY: ${newScandal.severity}\nIMMEDIATE REPUTATION DAMAGE: -${newScandal.reputationDamage}\n\nWHILE UNRESOLVED (every week):\n• Fans unfollow (0.6% weekly, 1.5% for CRITICAL)\n• Public Reputation & Trust drain\n${newScandal.severity === 'CRITICAL' ? '• Sponsor payouts PAUSED + casting scores hurt\n' : ''}• Unhandled coverage fades on its own in ${newScandal.severity === 'CRITICAL' ? 6 : newScandal.severity === 'MODERATE' ? 5 : 4} weeks (with a lingering scar)\n\nHOW TO RESPOND:\nOpen Representation → Public Relations and choose a strategy: Lawyers, PR Offensive, Apologize, or Deny & Ride It Out.`,
        date: dateInfo.fullDateText,
        read: false,
      });
    }

    // 4. Process Active Acting School Courses
    const activeCourses = p.activeCourses || [];
    const remainingActiveCourses: ActiveCourse[] = [];
    const completedCourseIds = p.completedCourseIds ? [...p.completedCourseIds] : [];
    const completedCourseRecords = p.completedCourseRecords ? [...p.completedCourseRecords] : [];

    activeCourses.forEach(course => {
      if (currentEnergy >= course.weeklyEnergyCost) {
        currentEnergy -= course.weeklyEnergyCost;
        const updatedWeeks = course.weeksCompleted + 1;

        if (updatedWeeks >= course.totalWeeks) {
          const talentCategory = course.talentReward.talent;
          const currentTalentVal = p.talents[talentCategory] || 0;
          const newTalentVal = Math.min(100, currentTalentVal + course.talentReward.amount);
          p.talents[talentCategory] = newTalentVal;

          // REAL GRADUATION XP: halved course payouts — fame XP scales by
          // talent gain + course length, capped at 60 then cut 50%
          const courseXp = Math.floor(Math.min(60, Math.floor((course.talentReward?.amount || 5) * 3 + (course.totalWeeks || 2) * 5)) * 0.5);
          const courseXpApplied = Math.max(1, Math.floor(courseXp * FAME_XP_MULTIPLIER));
          fameGainedThisWeek += courseXp;

          completedCourseIds.push(course.courseId);
          completedCourseRecords.unshift({
            id: `cmpl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            courseId: course.courseId,
            name: course.name,
            teacher: course.teacher,
            category: course.category,
            talentReward: course.talentReward,
            completionWeek: newWeek,
            completionYear: newYear,
          });

          careerTraining.push(`GRADUATED: ${course.name} (+${course.talentReward.amount} ${talentCategory.toUpperCase()}, +${courseXpApplied} Fame XP)`);

          newInboxMessages.unshift({
            id: `msg_course_done_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'TUTORIAL',
            sender: 'Acting Conservatory',
            senderRole: 'Dean of Studies',
            senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
            subject: `COURSE GRADUATION: ${course.name}`,
            body: `Congratulations! You have completed "${course.name}" taught by ${course.teacher}.\n\nYour ${talentCategory.toUpperCase()} talent increased by +${course.talentReward.amount}! Current level: ${newTalentVal}/100.\n\nFame XP earned: +${courseXpApplied}`,
            date: dateInfo.fullDateText,
            read: false,
          });
        } else {
          careerTraining.push(`PROGRESS: ${course.name} - Week ${updatedWeeks}/${course.totalWeeks}`);
          remainingActiveCourses.push({
            ...course,
            weeksCompleted: updatedWeeks,
            isPaused: false,
          });
        }
      } else {
        careerTraining.push(`PAUSED: ${course.name} (Requires ${course.weeklyEnergyCost} Energy)`);
        remainingActiveCourses.push({
          ...course,
          isPaused: true,
        });

        newInboxMessages.unshift({
          id: `msg_course_pause_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'TUTORIAL',
          sender: 'School Registrar',
          senderRole: 'Academic Office',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
          subject: `COURSE PAUSED: ${course.name}`,
          body: `Due to insufficient energy this week (${course.weeklyEnergyCost} Energy required), progress on "${course.name}" has been paused. Course will resume when energy is available.`,
          date: dateInfo.fullDateText,
          read: false,
        });
      }
    });

    p = {
      ...p,
      dateWeek: newWeek,
      dateYear: newYear,
      energy: currentEnergy,
      activeCourses: remainingActiveCourses,
      completedCourseIds,
      completedCourseRecords,
      availableSchoolCourses: generateWeeklyCourses(
        completedCourseIds,
        (p.activeCourses || []).map((c: any) => c.courseId)
      ),
    };

    // 5. Process Auditions
    const remainingAuditions: AuditionApplication[] = [];
    const newBookings: BookedProject[] = [...saveData.bookedProjects];
    const newTimelineEvents: TimelineEvent[] = [];

    saveData.auditions.forEach(aud => {
      const nextWeeks = aud.weeksRemaining - 1;
      if (nextWeeks <= 0) {
        const avgTalent = (p.talents.acting + p.talents.voice + p.talents.comedy + p.talents.drama + p.talents.action + p.talents.dancing) / 6;
        // HIDDEN COURSE TRACKER: every completed course at the Acting Conservatory
        // raises your casting chances. No training = roles are genuinely hard
        // (medium difficulty). The more courses you complete, the more roles open up.
        const coursesAttended = Math.max(
          p.completedCourseRecords?.length || 0,
          p.completedCourseIds?.length || 0
        );
        const courseBonus = Math.min(25, coursesAttended * 5);
        let score = p.talents.acting * 0.4 + avgTalent * 0.35 + (p.fameXp / 100) + courseBonus;
        if (p.isUnionMember) score += 15;
        score += p.leadRolesCount * 5;
        if (p.representation?.agent?.signed) score += 12;
        if (aud.agentPitched) score += 15; // Agent-submitted auditions carry agency weight
        if (RepresentationService.hasActiveCriticalScandal()) score -= 25; // Active CRITICAL scandal hurts casting

        let requiredScore = 15;
        // MEDIUM-HARD: new players with no training mostly book Support/Minor.
        // Courses unlock Principal AND Lead equally (same requirement) — leads
        // carry no extra gate since they're not needed for membership/unlocks.
        if (aud.roleType === 'Lead') requiredScore = 27;
        else if (aud.roleType === 'Principal') requiredScore = 27;
        else if (aud.roleType === 'Support') requiredScore = 20;

        const isAccepted = (score + Math.random() * 20) >= requiredScore;
        // PRODUCTION HUB CAP: max 3 active productions (3 movies, or 2 movies + 1 series),
        // and only ONE series at a time. If the hub is full, the studio moves on.
        const activeProds = newBookings.filter(
          (b) => !b.isFilmingComplete && (b.status || '') !== 'Pending Negotiation'
        );
        const isSeriesRole = aud.category === 'TV Series' || (aud as any).isTvSeries === true;
        const seriesInProd = activeProds.some((b) => b.isTvSeries || b.category === 'TV Series');
        const hubFull = activeProds.length >= 3;
        const blockedReason = hubFull
          ? `Your Production Hub is full (${activeProds.length}/3) \u2014 you can't start another project until one wraps.`
          : isSeriesRole && seriesInProd
            ? 'A series is already in production \u2014 only one series can film at a time.'
            : null;
        const studioName = aud.studio || 'Paramount Pictures';
        const directorName = aud.director || 'Denis Villeneuve';

        if (isAccepted) {
          if (blockedReason) {
            careerCastingResults.push(`REJECTED: '${aud.movieTitle}' (${aud.roleType}) \u2014 ${blockedReason}`);
            newInboxMessages.unshift({
              id: `msg_hub_full_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              category: 'CAREER',
              sender: `${studioName} Casting`,
              senderRole: 'Production Scheduling Office',
              senderAvatar: aud.posterUrl,
              subject: `PRODUCTION HUB FULL: ${aud.movieTitle} (${aud.roleType})`,
              body: `Your audition impressed us \u2014 but your production schedule is at capacity.\n\n${blockedReason}\n\nFinish an active project and we'll keep you in mind for future roles.`,
              date: dateInfo.fullDateText,
              read: false,
            });
          } else {
          // 39 DIFFERENT ACCEPTANCE REASONS - not repetitive
          const acceptancePool = [
            `• Outstanding acting performance during audition screen tests (Acting score: ${p.talents.acting}/100)`,
            `• Strong agency endorsement from ${p.representation?.agent?.agencyName || p.representation?.agent?.name || 'Agent'}`,
            `• Verified SAG-AFTRA union member in good standing`,
            `• Proven lead performance track record (${p.leadRolesCount} lead film(s) completed)`,
            `• High public popularity and fan engagement (${p.fameXp} Fame XP)`,
            `• Director ${directorName} specifically selected your tape for the character profile`,
            `• Excellent cast chemistry demonstrated during table reads`,
            `• Exceptional emotional range displayed in the dramatic monologue`,
            `• Natural charisma and screen presence captivated the casting panel`,
            `• Precise comedic timing that elevated the entire scene`,
            `• Authentic accent work that brought the character to life`,
            `• Powerful physical transformation that embodied the role completely`,
            `• Improvisational brilliance that added unexpected depth`,
            `• Previous collaboration with Director ${directorName} proved invaluable`,
            `• Method approach that deeply resonated with the script's themes`,
            `• Versatility shown across multiple genres in your portfolio`,
            `• Strong social media following that guarantees audience draw (${p.fans.toLocaleString()} fans)`,
            `• Critical acclaim from your last feature (Critic score: ${p.talents.drama}/100)`,
            `• Action sequence mastery that secured the stunt-heavy role`,
            `• Voice modulation and diction that perfectly suited the character`,
            `• Collaborative spirit that impressed the entire production team`,
            `• Professionalism and punctuality noted during callback sessions`,
            `• Unique interpretation that offered a fresh take on the character`,
            `• Chemistry with co-star ${aud.studio} ensemble was undeniable`,
            `• Box office track record that de-risked the studio's investment`,
            `• Award buzz from previous festival circuit performances`,
            `• Dedicated preparation - 6 weeks of dialect coaching paid off`,
            `• Risk-taking performance that dared to be vulnerable`,
            `• Technical precision in hitting marks while staying emotionally present`,
            `• Generational talent that reminded the panel of classic Hollywood`,
            `• Cultural authenticity that honored the character's background`,
            `• Dynamic range from subtle intimacy to explosive intensity`,
            `• Leadership on set that elevated the entire cast's performance`,
            `• Innovative character choices that surprised even the writer`,
            `• Consistent excellence across all three audition rounds`,
            `• Raw vulnerability that made the casting director tear up`,
            `• Magnetic energy that filled the audition room instantly`,
            `• Storytelling instinct that connected deeply with the narrative`,
            `• Fearless commitment to the character's most challenging scenes`,
          ];
          const selectionReasons: string[] = [];
          // Pick 2-3 unique reasons from pool based on player stats
          const poolForPlayer = [...acceptancePool];
          // Prioritize stat-based reasons first
          if (p.talents.acting >= 50) selectionReasons.push(poolForPlayer[0]);
          if (p.representation?.agent?.signed) selectionReasons.push(poolForPlayer[1]);
          if (p.isUnionMember) selectionReasons.push(poolForPlayer[2]);
          if (p.leadRolesCount > 0) selectionReasons.push(poolForPlayer[3]);
          if (p.fameXp >= 100) selectionReasons.push(poolForPlayer[4]);
          // Fill up to 3 unique reasons from remaining pool
          while (selectionReasons.length < 3) {
            const idx = Math.floor(Math.random() * poolForPlayer.length);
            const reason = poolForPlayer[idx];
            if (!selectionReasons.includes(reason)) {
              selectionReasons.push(reason);
            }
            poolForPlayer.splice(idx, 1);
            if (poolForPlayer.length === 0) break;
          }
          // Ensure 2-3 reasons, trim to 3 max for readability
          if (selectionReasons.length > 3) selectionReasons.splice(3);

          const acceptedBody = `OFFICIAL CASTING ACCEPTANCE NOTICE\n\nMovie: ${aud.movieTitle}\nRole: ${aud.roleType}\nStudio: ${studioName}\nDirector: ${directorName}\nSalary: $${aud.salary.toLocaleString()}\nFilming Date: Starts Next Week (Duration: ${aud.filmingWeeks} weeks)\n\nSELECTION REASONS:\n${selectionReasons.join('\n')}\n\nCongratulations! Production starts next week. View your Booking tab to prepare for filming.`;

          careerCastingResults.push(`ACCEPTED: Cast as ${aud.roleType} in '${aud.movieTitle}' ($${aud.salary.toLocaleString()})`);

          newInboxMessages.unshift({
            id: `msg_cast_acc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'CAREER',
            sender: `${studioName} Casting`,
            senderRole: 'Executive Casting Director',
            senderAvatar: aud.posterUrl,
            subject: `AUDITION ACCEPTED: ${aud.movieTitle} (${aud.roleType})`,
            body: acceptedBody,
            date: dateInfo.fullDateText,
            read: false,
          });

          // ---- EXCLUSIVITY: brand partners, streaming locks, breach penalties ----
          // Deterministic partner from the project id (no random fake data):
          // some films carry a brand integration deal that locks the category.
          const PARTNER_BRANDS: Array<{ brandName: string; category: LockCategory }> = [
            { brandName: 'Nike', category: 'Athletics' },
            { brandName: 'Adidas', category: 'Athletics' },
            { brandName: 'Coca-Cola', category: 'Beverage' },
            { brandName: 'Pepsi', category: 'Beverage' },
            { brandName: 'Apple', category: 'Tech' },
            { brandName: 'Samsung', category: 'Tech' },
            { brandName: 'BMW', category: 'Automotive' },
            { brandName: 'Mercedes-Benz', category: 'Automotive' },
            { brandName: 'LVMH', category: 'Fashion' },
            { brandName: 'Chanel', category: 'Fashion' },
            { brandName: 'Rolex', category: 'Luxury Watch' },
            { brandName: "L'Oreal", category: 'Beauty' },
          ];
          const idHash = String(aud.projectId || aud.movieTitle).split('').reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
          const hasPartner = idHash % 100 < 35; // ~35% of projects carry a partner
          const partner = hasPartner ? PARTNER_BRANDS[idHash % PARTNER_BRANDS.length] : null;
          const isSeriesBooking = aud.category === 'TV Series' || (aud as any).isTvSeries === true;

          // BREACH CHECK: taking conflicting work breaks active clauses - real penalties
          const activeClauses = ExclusivityService.activeClauses(newWeek, newYear);
          const terminateLinked = (dealId: string) => {
            try {
              const repState = RepresentationService.getState();
              const idx = repState.brandOffers.findIndex((o) => o.id === dealId);
              if (idx >= 0) {
                repState.brandOffers[idx] = { ...repState.brandOffers[idx], status: 'TERMINATED' as any, weeksRemaining: 0 };
                RepresentationService.saveState(repState);
              }
            } catch {}
          };
          for (const clause of activeClauses) {
            const streamingBreach = isSeriesBooking && clause.source === 'STREAMING_SERIES';
            const partnerBreach = !!partner && clause.category === partner.category && clause.brandName !== partner.brandName;
            if (streamingBreach || partnerBreach) {
              const res = ExclusivityService.applyBreach(
                clause,
                `${isSeriesBooking ? 'another streaming series' : 'a rival-partnered film'}: "${aud.movieTitle}"`,
                p,
                terminateLinked
              );
              newInboxMessages.unshift({
                id: `msg_breach_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                category: 'LEGAL',
                sender: `${clause.brandName} Legal Department`,
                senderRole: 'Contracts & Litigation',
                senderAvatar: aud.posterUrl,
                subject: `CONTRACT BREACH: Exclusivity violation — $${res.penaltyPaid.toLocaleString()} penalty`,
                body: res.message,
                date: dateInfo.fullDateText,
                read: false,
              });
              careerCastingResults.push(`EXCLUSIVITY BREACH: broke ${clause.brandName} clause by booking "${aud.movieTitle}" — $${res.penaltyPaid.toLocaleString()} penalty, reputation hit.`);
            }
          }

          // RECORD NEW CLAUSES for this booking
          if (isSeriesBooking) {
            ExclusivityService.recordClause({
              source: 'STREAMING_SERIES',
              brandName: (aud as any).networkName || 'The Streamer',
              category: 'Streaming',
              startWeek: newWeek,
              startYear: newYear,
              durationWeeks: aud.filmingWeeks + 12, // season lock: filming + first-run window
              dealFee: aud.salary,
              description: `Streaming series lock: "${aud.movieTitle}" (season exclusivity, no other streaming series)`,
            });
          }
          if (partner) {
            ExclusivityService.recordClause({
              source: 'MOVIE_PARTNER',
              brandName: partner.brandName,
              category: partner.category,
              startWeek: newWeek,
              startYear: newYear,
              durationWeeks: aud.filmingWeeks + 15, // filming + theatrical run
              dealFee: Math.floor(aud.salary / 2),
              description: `Brand integration: ${partner.brandName} (${partner.category}) partnered on "${aud.movieTitle}"`,
            });
          }

          newBookings.push({
            id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            projectId: aud.projectId,
            movieTitle: aud.movieTitle,
            brandPartner: partner || undefined,
            posterUrl: aud.posterUrl,
            roleType: aud.roleType,
            salary: aud.salary,
            totalFilmingWeeks: aud.filmingWeeks,
            weeksRemaining: aud.filmingWeeks,
            isFilmingComplete: false,
            studio: studioName,
            director: directorName,
            agentPitched: aud.agentPitched,
            category: aud.category,
            isTvSeries: (aud as any).isTvSeries,
          });

          newTimelineEvents.push({
            id: `tl_role_acc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            year: newYear,
            week: newWeek,
            category: 'ROLE',
            title: `Role Accepted: ${aud.movieTitle}`,
            description: `Cast as ${aud.roleType} in "${aud.movieTitle}" under ${studioName}. Contract value: $${aud.salary.toLocaleString()}.`,
          });
          }
        } else {
          // 39 DIFFERENT REJECTION REASONS - not repetitive
          const rejectionPool = [
            `• Another actor demonstrated higher technical acting precision and emotional depth.`,
            `• Studio executives required higher Fame visibility (${p.fameXp} Fame XP) for foreign pre-sales.`,
            `• The production prioritized SAG-AFTRA union members for principal lead contracts.`,
            `• The director preferred a candidate with more completed feature film experience.`,
            `• Another candidate showed stronger chemistry with the lead ensemble during screen tests.`,
            `• Casting directors adjusted the character profile to fit an older performer.`,
            `• Production underwent script revisions altering the age bracket for this character.`,
            `• Competition was exceptionally fierce with over 200 talent submissions.`,
            `• Another actor previously worked with Director ${directorName} on an acclaimed project.`,
            `• Vocal projection did not carry the required authority for the role's key monologue.`,
            `• Physicality and movement work felt less grounded than the selected actor's.`,
            `• Emotional recall in the climactic scene lacked the necessary vulnerability.`,
            `• The studio's international distribution partner requested a more recognizable international profile.`,
            `• Your interpretation, while strong, diverged from the director's core vision for the character.`,
            `• Another performer had an existing chemistry with the already-cast lead.`,
            `• The role required fluency in a dialect that the selected actor possessed natively.`,
            `• Age range was narrowed by two years during final casting calibration.`,
            `• Height and on-camera pairing with the co-lead favored a different physicality.`,
            `• The producers opted for an actor with a larger social media footprint for marketing.`,
            `• Your recent project created a scheduling conflict with the film's revised shoot dates.`,
            `• The selected actor's previous box office draw de-risked the financing.`,
            `• The casting panel felt another actor's comedic timing was more precise for the material.`,
            `• The director sought a more understated, internalized approach to the role.`,
            `• Another candidate's chemistry read with the female lead was described as electric.`,
            `• The studio's sensitivity reader flagged a different lived experience as a better fit.`,
            `• Your audition, while compelling, was felt to be slightly too theatrical for the naturalistic tone.`,
            `• The role's stunt requirements favored an actor with a martial arts background.`,
            `• The writers' room re-centered the character's arc around a different age and background.`,
            `• The selected actor's agent leveraged a package deal that included a sought-after director.`,
            `• The panel noted another actor's eye-line and camera awareness was more precise.`,
            `• The film's financiers requested an actor with pre-existing brand endorsement ties.`,
            `• Your strong performance was ultimately deemed too similar to your last released role.`,
            `• The director wanted a performer who could play the character's 10-year age span more convincingly.`,
            `• Another actor's improvisation in the final round added a memorable moment that secured the role.`,
            `• The studio's test screening of your chemistry read scored lower than the selected actor's.`,
            `• The role's musical performance element favored a trained vocalist.`,
            `• The selected actor's previous collaboration with the cinematographer created instant visual rapport.`,
            `• Your availability for the extensive rehearsal period was more limited than the chosen actor's.`,
            `• The casting associate noted the selected actor's subtle micro-expressions were more cinematic.`,
          ];
          const guidancePool = [
            `• Improve Acting: Enroll in Acting Conservatory courses to raise your Acting score.`,
            `• Increase Fame: Focus on social media, public appearances, and media interviews.`,
            `• Strengthen Reputation: Complete more principal roles to qualify for SAG-AFTRA membership.`,
            `• Complete More Movies: Build your portfolio with Callboard indie and supporting roles.`,
            `• Build Your Portfolio: Continue applying to roles that match your current talent level.`,
            `• Improve Acting: Take specialized voice, comedy, or drama classes to stand out.`,
            `• Expand Range: Audition for diverse genres to showcase versatility.`,
            `• Network Actively: Attend industry mixers and secure a strong agent.`,
            `• Refine Craft: Hire a dialect coach for accent-heavy roles.`,
            `• Physical Training: Take action and stunt workshops for physically demanding parts.`,
            `• Study Film: Analyze award-winning performances in similar roles.`,
            `• Seek Feedback: Request detailed notes from casting directors after rejections.`,
            `• Build Credits: Start with commercial and web series to gain on-set experience.`,
            `• Develop Persona: Cultivate a distinct public image that casting remembers.`,
            `• Master Audition Technique: Practice cold reads and self-tape quality.`,
          ];
          const rejectionFeedback: string[] = [];
          const playerGuidance: string[] = [];
          // THE TRAINING KEY: when the course tracker is low, the rejection
          // tells the player exactly what unlocks bigger roles (real data).
          if (coursesAttended < 4 && (aud.roleType === 'Principal' || aud.roleType === 'Lead')) {
            playerGuidance.unshift(
              `• TRAINING KEY: You've completed ${coursesAttended} course${coursesAttended === 1 ? '' : 's'} so far. Principal & Lead roles need more Conservatory training — every completed course directly boosts your casting chances.`
            );
          }
          // Pick 2-3 unique rejection reasons from pool
          const tempPool = [...rejectionPool];
          // Prioritize stat-based first
          if (p.talents.acting < 50) {
            rejectionFeedback.push(tempPool[0]);
            playerGuidance.push(guidancePool[0]);
          }
          if (p.fameXp < 150 && aud.roleType === 'Lead') {
            rejectionFeedback.push(tempPool[1]);
            playerGuidance.push(guidancePool[1]);
          }
          if (!p.isUnionMember && aud.roleType === 'Lead') {
            rejectionFeedback.push(tempPool[2]);
            playerGuidance.push(guidancePool[2]);
          }
          if (p.moviesCompleted < 2) {
            rejectionFeedback.push(tempPool[3]);
            playerGuidance.push(guidancePool[3]);
          }
          while (rejectionFeedback.length < 2) {
            const idx = Math.floor(Math.random() * tempPool.length);
            const reason = tempPool[idx];
            if (!rejectionFeedback.includes(reason)) {
              rejectionFeedback.push(reason);
            }
          }
          if (rejectionFeedback.length > 3) rejectionFeedback.splice(3);
          while (playerGuidance.length < 2) {
            const idx = Math.floor(Math.random() * guidancePool.length);
            const g = guidancePool[idx];
            if (!playerGuidance.includes(g)) playerGuidance.push(g);
          }
          if (playerGuidance.length > 3) playerGuidance.splice(3);

          const rejectedBody = `CASTING DIRECTOR FEEDBACK\n\nMovie: ${aud.movieTitle}\nRole: ${aud.roleType}\nStudio: ${studioName}\n\nDECISION: REJECTED\n\nCasting Director Feedback:\n${rejectionFeedback.join('\n')}\n\nPLAYER GUIDANCE:\n${playerGuidance.join('\n')}\n\nThank you for auditioning. Keep honing your craft!`;

          careerCastingResults.push(`REJECTED: Audition for '${aud.movieTitle}' (${aud.roleType})`);

          newInboxMessages.unshift({
            id: `msg_cast_rej_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'CAREER',
            sender: `${studioName} Casting`,
            senderRole: 'Casting Office',
            senderAvatar: aud.posterUrl,
            subject: `Casting Feedback: ${aud.movieTitle}`,
            body: rejectedBody,
            date: dateInfo.fullDateText,
            read: false,
          });

          newTimelineEvents.push({
            id: `tl_role_rej_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            year: newYear,
            week: newWeek,
            category: 'ROLE',
            title: `Audition Decision: ${aud.movieTitle}`,
            description: `Passed over for the ${aud.roleType} role in "${aud.movieTitle}". Casting feedback delivered to Inbox.`,
          });
        }
      } else {
        let status = aud.status;
        if (nextWeeks <= 2) status = 'Decision Pending';
        else if (nextWeeks <= 5) status = 'Callback';
        else if (nextWeeks <= 10) status = 'Casting';

        careerAuditions.push(`PENDING AUDITION: '${aud.movieTitle}' (${aud.roleType}) - ${nextWeeks} weeks until decision (still in progress, not rejected)`);
        if (nextWeeks === 1) {
          nextAuditions.push(`Decision due next week for '${aud.movieTitle}' (${aud.roleType})`);
        }

        remainingAuditions.push({
          ...aud,
          weeksRemaining: nextWeeks,
          status,
        });
      }
    });


    // 5b. AGENT AUTO-SUBMIT — invisible talent engine. Your signed agent pitches you
    // real Callboard roles on a cadence (leadFlowWeeks). No energy cost, no fake listings.
    const signedAgent = p.representation?.agent;
    if (signedAgent?.signed && (signedAgent.weeksRemaining ?? 0) > 0) {
      // AGENT PITCHES: 2 auditions every 4 weeks (any role acceptable)
      const flowWeeks = 4;
      const weeksSincePitch = p.dateWeek - (signedAgent.lastPitchWeek || 0);
      if (weeksSincePitch >= flowWeeks) {
        const tier = signedAgent.tier || 1;
        const pitchCount = 2;
        const dealCap = signedAgent.dealCap || 15000000;
        // AGENTS PITCH ANY GOOD ROLE (principals, supporting, recurring) — Lead roles are
        // NOT the priority; they only appear if nothing else is available in the deal cap.
        const withinCap = saveData.callboard.filter((c) => (c.salary || 0) <= dealCap);
        const goodRoles = withinCap
          .filter((c) => c.roleType !== 'Lead')
          .sort((a, b) => (b.salary || 0) - (a.salary || 0));
        const eligible = goodRoles.length >= pitchCount
          ? goodRoles
          : withinCap.sort((a, b) => (b.salary || 0) - (a.salary || 0));
        const picked = eligible.slice(0, pitchCount);

        picked.forEach((proj) => {
          const agentAudition: AuditionApplication = {
            id: `aud_agent_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            projectId: proj.id,
            movieTitle: proj.title,
            posterUrl: proj.posterUrl,
            roleType: proj.roleType,
            salary: proj.salary,
            filmingWeeks: proj.filmingWeeks,
            weeksRemaining: proj.decisionTimeWeeks,
            status: 'Waiting',
            appliedWeek: p.dateWeek,
            appliedYear: p.dateYear,
            studio: proj.studio,
            director: proj.director,
            agentPitched: true,
          };
          remainingAuditions.unshift(agentAudition);
          newInboxMessages.unshift({
            id: `msg_agent_pitch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'CAREER',
            sender: signedAgent.name,
            senderRole: signedAgent.specialty || 'Talent Agent',
            senderAvatar: signedAgent.avatarUrl,
            subject: `🎯 AGENT PITCH: ${proj.title} (${proj.roleType})`,
            body: `Your agent ${signedAgent.name} (${signedAgent.agencyName}) submitted you for the ${proj.roleType} role in "${proj.title}" (${proj.studio || 'Studio'}) — ${signedAgent.specialty || 'talent agent'}.\n\nNo energy spent: your agent handled the submission. The audition is waiting in your Auditions tab with boosted odds.`,
            date: dateInfo.fullDateText,
            read: false,
          });
          careerAuditions.push(`🎯 AGENT PITCH: ${signedAgent.name} submitted you for '${proj.title}' (${proj.roleType})`);
        });

        if (picked.length > 0) {
          p.representation = {
            ...p.representation,
            agent: { ...signedAgent, lastPitchWeek: p.dateWeek },
          };
        }
      }

      // AGENT BOOKS RADIO INTERVIEWS every 4 weeks (separate from auditions)
      if (p.dateWeek % 4 === 0) {
        const radioMsgs = scheduleRadioInterview(p);
        radioMsgs.forEach((m) => newInboxMessages.unshift({
          ...m,
          id: `msg_rad_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'MEDIA',
          sender: signedAgent.name,
          senderRole: signedAgent.agencyName,
          senderAvatar: signedAgent.avatarUrl,
        }));
      }
    }

    // 6. Process Booked Projects Through Multi-Stage Pipeline
    const updatedBookedProjects: BookedProject[] = [];
    const newReleasedMovies: ReleasedMovie[] = [...saveData.releasedMovies];

    newBookings.forEach(book => {
      let stage = book.status || 'Pre-Production';
      let stageWeeks = book.stageWeeksRemaining !== undefined ? book.stageWeeksRemaining : 1;
      let filmingWeeks = book.weeksRemaining;
      let logs = book.productionLog ? [...book.productionLog] : [];
      let hype = book.hypeScore || 40;

      if (stage === 'Completed' || stage === 'Released') {
        // Movie is already released/completed, remove from active production hub!
        return;
      }

      if (stage === 'Pending Negotiation') {
        // Greenlit sequel or direct offer pending player contract negotiation & acceptance
        updatedBookedProjects.push(book);
        return;
      }

      // 1. PRE-PRODUCTION STAGE
      if (stage === 'Contract Signed' || stage === 'Pre-Production') {
        stageWeeks -= 1;
        if (stageWeeks <= 0) {
          stage = 'Filming';
          stageWeeks = book.totalFilmingWeeks;
          filmingWeeks = book.totalFilmingWeeks;
          logs.unshift({
            week: newWeek,
            year: newYear,
            stage: 'Filming',
            eventText: `Pre-production wrapped! Principal photography officially commenced at ${book.location || 'Stage 4 Soundstages'}.`,
            type: 'milestone',
          });
          careerFilmingProgress.push(`STARTED FILMING: '${book.movieTitle}' (${book.roleType})`);
        } else {
          logs.unshift({
            week: newWeek,
            year: newYear,
            stage: 'Pre-Production',
            eventText: `Table reads, camera tests, and costume fittings ongoing (${stageWeeks} weeks remaining in pre-prod).`,
            type: 'info',
          });
        }
      }

      // 2. FILMING STAGE
      else if (stage === 'Filming') {
        filmingWeeks -= 1;
        // Random Filming Event (35% probability per week)
        if (Math.random() < 0.35) {
          const events = [
            { text: `Actor Injury on set! Production delayed by +1 week.`, delay: 1, type: 'delay' as const },
            { text: `Weather delay at filming location! +1 week added to shooting schedule.`, delay: 1, type: 'delay' as const },
            { text: `Director approved additional $5M budget for visual effects!`, delay: 0, type: 'success' as const },
            { text: `Exceptional cast chemistry during climax scene! Quality & hype boosted.`, delay: 0, type: 'success' as const, hypeBoost: 15 },
            { text: `Efficient production crew wrapped schedule 1 week early!`, delay: -1, type: 'milestone' as const },
            { text: `Studio requested pick-up shots for key dialogue sequence (+1 week).`, delay: 1, type: 'warning' as const },
          ];
          const ev = events[Math.floor(Math.random() * events.length)];
          filmingWeeks = Math.max(1, filmingWeeks + ev.delay);
          if (ev.hypeBoost) hype += ev.hypeBoost;

          logs.unshift({
            week: newWeek,
            year: newYear,
            stage: 'Filming',
            eventText: ev.text,
            type: ev.type,
          });
        }

        if (filmingWeeks <= 0) {
          // Wrapped filming! Automatic Immediate Theatrical Box Office Debut
          // REAL COMMISSIONS: agent takes % of acting salaries; manager takes % of franchise/sequel deals he packaged
          const grossSalary = book.salary;
          let agentCommission = 0;
          if (p.representation?.agent?.signed) {
            agentCommission = Math.floor(grossSalary * ((p.representation.agent.commissionPercent || 0) / 100));
          }
          let managerCommission = 0;
          if ((book.isFranchise || book.isSequel) && p.representation?.manager?.signed) {
            managerCommission = Math.floor(grossSalary * ((p.representation.manager.commissionPercent || 0) / 100));
          }
          const netPay = grossSalary - agentCommission - managerCommission;
          salaryEarnedThisWeek += netPay;
          // INBOX SALARY DEPOSIT NOTIFICATION - so player sees payment clearly (user request: "get paid but don't see it")
          const commissionLines = [
            agentCommission > 0 ? `\n• Agent Commission (${p.representation?.agent?.name}, ${p.representation?.agent?.commissionPercent}%): -$${agentCommission.toLocaleString()}` : '',
            managerCommission > 0 ? `\n• Manager Packaging Fee (${p.representation?.manager?.name}, ${p.representation?.manager?.commissionPercent}%): -$${managerCommission.toLocaleString()}` : '',
          ].filter(Boolean).join('');
          newInboxMessages.unshift({
            id: `msg_salary_deposit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'FINANCE',
            sender: `${book.studio || 'Studio'} Payroll`,
            senderRole: 'Production Finance Dept',
            senderAvatar: book.posterUrl,
            subject: `💰 SALARY DEPOSITED: $${netPay.toLocaleString()} for "${book.movieTitle}"`,
            body: `PAYROLL CONFIRMATION\n\nMovie: "${book.movieTitle}"\nRole: ${book.roleType}\nStudio: ${book.studio || 'Studio'}\n\nGross Contract Salary: $${grossSalary.toLocaleString()}${commissionLines}\n\nNET DEPOSIT: $${netPay.toLocaleString()} has been deposited directly to your Century Bank checking account.\n\nThis payment is reflected in your Weekly Recap → FINANCE tab as "Film/TV Salary".\n\nNext: Box office residuals and backend will accrue weekly while the film is in theaters!`,
            date: dateInfo.fullDateText,
            read: false,
          });
          // Also push to WeeklyRecap finance visibility
          careerMovies.push(`💰 SALARY PAID: $${netPay.toLocaleString()} (net of commissions) for '${book.movieTitle}' (${book.roleType})`);
          p.moviesCompleted += 1;
          if (book.roleType === 'Lead') p.leadRolesCount += 1;
          else if (book.roleType === 'Principal') p.principalRolesCount += 1;

          const baseBudget = book.budget || 1500000;
          const actingTalent = p.talents?.acting || 10;
          const dramaTalent = p.talents?.drama || 10;
          const fameBonus = (p.fameXp || 0) * 1200;

          // Star Rating % (0% to 100%) based on real player stats & guild status
          const starRatingPct = Math.min(100, Math.max(10, Math.round(
            (actingTalent * 0.35) + (dramaTalent * 0.30) + ((p.fameXp || 0) / 10) + (p.isUnionMember ? 15 : 0) + (p.leadRolesCount * 4)
          )));

          // Realistic scaling: low rating (<50%) -> low multiplier, high rating (70%+) -> high multiplier
          const performanceMultiplier = starRatingPct >= 70
            ? (1.2 + (starRatingPct - 70) * 0.04)
            : (0.35 + (starRatingPct / 100) * 0.65);

          // STAR-POWER SCALING (SLOW BURN): sub-linear — fame's draw grows at
          // square-root pace (4x fame = 2x power, not 4x). Deterministic curve.
          const fameVal = p.fameXp || 0;
          const fameMult = Math.min(25, 1 + Math.sqrt(fameVal / 1000) * 0.5);
          const baseOpening = Math.max(1500000, Math.floor(
            (baseBudget * 0.16 * performanceMultiplier) + (hype * 8000 * (starRatingPct / 100)) + (Math.sqrt(fameVal) * 100000)
          ));
          const MAX_PLAYER_GROSS = 500000000000; // up to $500B for legends
          const worldwideGross = Math.min(MAX_PLAYER_GROSS, Math.floor(baseOpening * (2.5 + Math.random() * 2) * fameMult * (0.7 + performanceMultiplier)));
          const domesticGross = Math.floor(worldwideGross * (0.4 + Math.random() * 0.12));
          const openingGross = Math.floor(worldwideGross * (0.18 + Math.random() * 0.1));

          const audienceRating = Math.min(100, Math.max(25, Math.floor(35 + (actingTalent * 0.4) + (starRatingPct * 0.25) + Math.random() * 10)));
          const criticRating = Math.min(100, Math.max(20, Math.floor(30 + (dramaTalent * 0.45) + (starRatingPct * 0.25) + Math.random() * 12)));

          // RELEASE FAME HALVED (user request): raw pool value, still subject
          // to the global slow-burn multiplier at the end of the week
          const releaseFame = book.roleType === 'Lead' ? 22 : book.roleType === 'Principal' ? 16 : 10;
          fameGainedThisWeek += releaseFame;

          const currentPart = book.franchisePart || 1;
          const currentSeason = book.tvSeason || 1;
          const isTv = book.isTvSeries || book.category === 'TV Series';

          const newReleasedMovie: ReleasedMovie = {
            id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            movieTitle: book.movieTitle,
            posterUrl: book.posterUrl,
            roleType: book.roleType,
            category: book.category,
            playerEarnings: book.salary,
            openingWeekendGross: openingGross,
            domesticGross,
            worldwideGross,
            audienceRating,
            criticRating,
            boxOfficePosition: 1,
            weeksInCinemas: 1,
            awardsWon: 0,
            awardsNominated: 0,
            inCinemas: true,
            studio: book.studio || 'Universal Pictures',
            director: book.director || 'Denis Villeneuve',
            genre: book.genre || 'Drama',
            sequelCheckWeeks: 0,
            // Studios don't rush franchise calls: 12–20 weeks of watching the run
            sequelEligibleAfter: 12 + Math.floor(Math.random() * 9),
            sequelOffered: false,
            sequelTarget: Math.floor(baseBudget * 1.8),
            budget: book.budget || baseBudget,
            releaseWeek: newWeek,
            releaseYear: newYear,
            isFranchise: book.isFranchise || currentPart > 1,
            franchisePart: currentPart,
            isTvSeries: isTv,
            tvSeason: currentSeason,
            isSequel: currentPart > 1 || currentSeason > 1,
            parentMovieTitle: book.parentMovieTitle || book.movieTitle,
          };

          newReleasedMovies.unshift(newReleasedMovie);

          careerMovies.push(`THEATRICAL DEBUT: '${book.movieTitle}' opened at $${(openingGross / 1000000).toFixed(1)}M Box Office! (Star Rating: ${starRatingPct}%)`);
          careerTraining.push(`🌟 +${Math.max(1, Math.floor(releaseFame * FAME_XP_MULTIPLIER))} Fame XP - Theatrical Release of '${book.movieTitle}'`);

          newTimelineEvents.push({
            id: `tl_rel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            year: newYear,
            week: newWeek,
            category: 'RELEASE',
            title: `Theatrical Debut: ${book.movieTitle}`,
            description: `"${book.movieTitle}" completed production and debuted in theaters with an opening gross of $${(openingGross / 1000000).toFixed(1)}M. Star Rating: ${starRatingPct}%. Contract salary: $${book.salary.toLocaleString()}.`,
          });

          newInboxMessages.unshift({
            id: `msg_theatrical_debut_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'CAREER',
            sender: `${book.studio || 'Studio'} Distribution`,
            senderRole: 'VP Theatrical Distribution',
            senderAvatar: book.posterUrl,
            subject: `THEATRICAL DEBUT: "${book.movieTitle}" Opens at $${(openingGross / 1000000).toFixed(1)}M!`,
            body: `THEATRICAL DEBUT REPORT\n\nMovie: "${book.movieTitle}"\nRole: ${book.roleType}\nStudio: ${book.studio || 'Studio'}\nDirector: ${book.director || 'Director'}\n\nBOX OFFICE OPENING RESULTS:\n• Star Track Record: ${starRatingPct}%\n• Opening Weekend Gross: $${openingGross.toLocaleString()}\n• Domestic Projection: $${domesticGross.toLocaleString()}\n• Worldwide Projection: $${worldwideGross.toLocaleString()}\n• Rotten Tomatoes Audience: ${audienceRating}%\n• Rotten Tomatoes Critics: ${criticRating}%\n\nYour salary of $${book.salary.toLocaleString()} has been fully paid. Residuals will accrue weekly in your IMDb Releases tab!`,
            date: dateInfo.fullDateText,
            read: false,
          });

          // Trigger Breaking Hollywood Insider Article
          try {
            HollywoodInsiderService.onMovieReleased(newReleasedMovie.movieTitle, newReleasedMovie.studio || 'The studio', newReleasedMovie.budget || 0, newWeek, newYear);
          } catch (e) {
            console.error('Error triggering Hollywood Insider release article:', e);
          }

          // Greenlight decisions now happen in the WEEKLY SEQUEL TRACKER below
          // (target must be met over weeks in the box office — no instant greenlights).

          // Movie is completed & released — do not push back into updatedBookedProjects
          return;
        } else {
          logs.unshift({
            week: newWeek,
            year: newYear,
            stage: 'Filming',
            eventText: `Shooting week completed (${filmingWeeks} filming weeks remaining).`,
            type: 'info',
          });
          careerFilmingProgress.push(`FILMING: '${book.movieTitle}' - ${filmingWeeks} weeks left`);
        }
      }

      updatedBookedProjects.push({
        ...book,
        status: stage,
        stageWeeksRemaining: stageWeeks,
        weeksRemaining: filmingWeeks,
        hypeScore: hype,
        productionLog: logs,
        boostedThisTurn: false,
        // INVISIBLE PRODUCTION TICKER: +1 real week per END WEEK, no manual clicks needed
        productionWeeksCompleted: (book.productionWeeksCompleted || 0) + 1,
      });
    });

    // 7. Box Office Engine Weekly Processing
    const boState = BoxOfficeEngineService.processEndWeek(newWeek, newYear, newReleasedMovies);

    // Trigger Hollywood Insider weekly box office trade report
    if (boState.items && boState.items.length > 0) {
      const topItem = boState.items[0];
      if (topItem && topItem.weeklyGross > 0) {
        try {
          HollywoodInsiderService.onBoxOfficeWeeklyResults(
            topItem.title,
            topItem.weeklyGross,
            topItem.studio || 'Hollywood Major',
            newWeek,
            newYear
          );
        } catch (e) {
          console.error('Error generating Hollywood Insider box office report:', e);
        }
      }
    }

    // Trigger Hollywood Insider weekly trade news tick — REAL events only
    try {
      HollywoodInsiderService.processWeeklyNewsTick(newWeek, newYear, p, {
        releasedMovies: newReleasedMovies,
        bookedProjects: updatedBookedProjects,
        relationships: saveData.relationships,
      });
    } catch (e) {
      console.error('Error processing Hollywood Insider weekly news tick:', e);
    }

    // 7b. YEAR-END AWARDS NIGHT — one unified ceremony per year, fired at Week 52.
    // No more scattered mini ceremonies at weeks 1-4.
    let awardsTrophies: any[] = [];
    let awardsRecords: any[] = [];
    let awardsInbox: any[] = [];
    try {
      const awardsResult = AwardsService.processEndWeekCeremony(newWeek, newYear, p, newReleasedMovies, saveData.trophies || [], saveData.awardHistory || []);
      if (awardsResult.newTrophies.length > 0 || awardsResult.newRecords.length > 0) {
        awardsTrophies = awardsResult.newTrophies;
        awardsRecords = awardsResult.newRecords;
        awardsInbox = awardsResult.newInboxMessages;
        // Apply fame, awards, and REAL award-night fans to player
        p.fameXp = awardsResult.updatedPlayer.fameXp;
        p.awardsWon = awardsResult.updatedPlayer.awardsWon;
        fameGainedThisWeek += awardsResult.fameGained;
        if (awardsResult.fanGained > 0) fansGainedThisWeek += awardsResult.fanGained;
        // Queue inbox and world logs
        awardsInbox.forEach(msg => newInboxMessages.unshift(msg));
        awardsRecords.forEach(rec => {
          worldAwards.push(`🏆 ${rec.eventName}: ${rec.isPlayerWinner ? 'WON' : 'Nominated'} for "${rec.movieTitle}"`);
          if (rec.isPlayerWinner) {
            worldAwards.push(`Award Winner: ${rec.winnerName} for ${rec.movieTitle}`);
          }
        });
        if (awardsResult.ceremonyEvent) {
          nextAwardShows.push(`${awardsResult.ceremonyEvent.eventName} Ceremony - Week ${newWeek}`);
        }
      }
      if (awardsResult.ceremonyData) {
        setAwardCeremonyData(awardsResult.ceremonyData);
        awardNightPending = true;
      }
    } catch (e) {
      console.error('Error processing awards ceremony:', e);
    }
    const updatedReleasedMovies = newReleasedMovies.map((movie) => {
      // Find matching item in Box Office simulation chart or active releases
      const chartItem = boState.items.find(
        (i) => i.playerMovieId === movie.id || i.id === `player_bo_${movie.id}` || i.title === movie.movieTitle
      );

      if (chartItem) {
        const addedGross = chartItem.weeklyGross || 0;

        // Calculate Realistic Hollywood Royalty Model
        const royaltyBreakdown = RoyaltyEngineService.calculateWeeklyRoyalty(movie, chartItem);

        residualsEarnedThisWeek += royaltyBreakdown.residuals;
        backendEarnedThisWeek += royaltyBreakdown.backend;
        streamingEarnedThisWeek += royaltyBreakdown.streamingRoyalties;
        merchEarnedThisWeek += royaltyBreakdown.merchandiseRoyalties;
        syndicationEarnedThisWeek += royaltyBreakdown.syndicationRoyalties;
        internationalEarnedThisWeek += royaltyBreakdown.internationalRoyalties;

        royaltiesEarnedThisWeek += royaltyBreakdown.totalGrossRoyalties;

        if (movie.inCinemas && addedGross > 0) {
          boxOfficeWeeklyGrossThisWeek += addedGross;

          // Rebalanced Realistic Weekly Fan Growth
          let newFans = 0;
          if (addedGross > 100000000) {
            newFans = Math.floor(8000 + Math.random() * 15000); // Record-breaking phenomenon
          } else if (addedGross > 35000000) {
            newFans = Math.floor(2500 + Math.random() * 4500); // Blockbuster
          } else if (addedGross > 12000000) {
            newFans = Math.floor(600 + Math.random() * 1200); // Hit
          } else if (addedGross > 2000000) {
            newFans = Math.floor(150 + Math.random() * 350); // Average
          } else {
            newFans = Math.floor(20 + Math.random() * 80); // Flop / Niche
          }
          if (newFans > 0) fansGainedThisWeek += newFans;

          careerMovies.push(
            `BOX OFFICE: '${movie.movieTitle}' grossed +$${addedGross.toLocaleString()} (Rank #${chartItem.currentRank})`
          );
        }

        const nextWeeks = chartItem.weeksReleased || movie.weeksInCinemas + 1;
        const nextInCinemas = nextWeeks >= PLAYER_MAX_WEEKS ? false : (chartItem.inTheaters ?? movie.inCinemas);

        const currentWorldwide = movie.worldwideGross || movie.boxOfficeGross || 0;
        const currentDomestic = movie.domesticGross || 0;
        const chartWorldwide = chartItem.worldwideGross || 0;
        const chartDomestic = chartItem.domesticGross || 0;

        // Cap movie lifetime gross at $5 Billion
        const MAX_CAP = 5000000000;
        const finalWorldwide = Math.min(MAX_CAP, Math.max(currentWorldwide, chartWorldwide));
        const finalDomestic = Math.min(MAX_CAP * 0.45, Math.max(currentDomestic, chartDomestic));
        const finalInternational = Math.max(0, finalWorldwide - finalDomestic);

        // Theatrical conclusion report fires the week the movie ACTUALLY leaves
        // theaters — floor death or the 15-week cap, whichever comes first
        if (movie.inCinemas && !nextInCinemas) {
          newInboxMessages.unshift({
            id: `msg_theatrical_end_${movie.id}_${Date.now()}`,
            category: 'CAREER',
            sender: `${movie.studio || 'Studio'} Distribution`,
            senderRole: 'VP Theatrical Distribution',
            senderAvatar: movie.posterUrl,
            subject: `THEATRICAL RUN CONCLUDED: "${movie.movieTitle}"`,
            body: `THEATRICAL RUN CONCLUSION REPORT\n\nMovie: "${movie.movieTitle}"\nRole: ${movie.roleType}\n\nAfter a run of ${nextWeeks} weeks in cinemas, "${movie.movieTitle}" has officially concluded its theatrical exhibition run!\n\nFINAL BOX OFFICE TOTALS:\n• Lifetime Worldwide Gross: $${(finalWorldwide / 1000000).toFixed(1)}M\n• Domestic Box Office: $${(finalDomestic / 1000000).toFixed(1)}M\n• International Box Office: $${(finalInternational / 1000000).toFixed(1)}M\n• Final Rotten Tomatoes Rating: ${movie.audienceRating}%\n\nThe feature has now transitioned into permanent home streaming, digital licensing, and syndication catalogs. Weekly residuals and streaming royalties will continue to accrue automatically in your IMDb Releases tab!`,
            date: dateInfo.fullDateText,
            read: false,
          });
        }

        return {
          ...movie,
          weeksInCinemas: nextWeeks,
          weeklyGross: chartItem.weeklyGross || 0,
          domesticGross: finalDomestic,
          internationalGross: finalInternational,
          worldwideGross: finalWorldwide,
          boxOfficeGross: finalWorldwide,
          boxOfficePosition: chartItem.currentRank || movie.boxOfficePosition,
          inCinemas: nextInCinemas,
        };
      }

      // Movie not on the active chart anymore — keep totals, but kill stale
      // weekly numbers so the Releases tab matches the weekly recap exactly
      const fallbackWeeks = movie.weeksInCinemas + 1;
      const fallbackGross = movie.worldwideGross || movie.boxOfficeGross || 0;
      const fallbackStillRunning = fallbackWeeks < PLAYER_MAX_WEEKS && movie.inCinemas;
      return {
        ...movie,
        weeksInCinemas: fallbackWeeks,
        inCinemas: fallbackStillRunning,
        weeklyGross: fallbackStillRunning ? ((movie as any).weeklyGross || 0) : 0,
        worldwideGross: fallbackGross,
        boxOfficeGross: fallbackGross,
        sequelCheckWeeks: movie.sequelCheckWeeks,
      };
    });

    // 7c. SEQUEL & RENEWAL GREENLIGHT TRACKER — weekly check while the movie is in the box
    // office AND up to 40 weeks after (even after it leaves theaters). No instant greenlight:
    // every release secretly rolls a 12–20 week studio watch period before any sequel or
    // season offer can arrive. Studio offers when the target is met after that week.
    // If a Manager is signed, the Manager negotiates better terms with the studio
    // and sends the full offer to your Inbox.
    const finalReleasedMovies = updatedReleasedMovies.map((movie) => {
      const isTv = movie.isTvSeries || movie.category === 'TV Series';
      const currentPart = movie.franchisePart || 1;
      const currentSeason = movie.tvSeason || 1;
      // ANY film can start a franchise: Part 1 earns Part 2 at the box office,
      // and the chain is hard-capped at Part 5 (currentPart >= 5 ends it)
      const maxPart = 5;
      const maxSeason = (movie as any).maxTvSeason || 15;
      if (movie.sequelOffered) return movie;
      if (!isTv && movie.roleType !== 'Lead' && movie.roleType !== 'Principal') return movie;
      if (!isTv && currentPart >= maxPart) return movie;
      if (isTv && currentSeason >= maxSeason) return movie;

      const checks = (movie.sequelCheckWeeks || 0) + 1;
      if (checks > 40) return movie; // greenlight decision window closed

      // Releases from old saves roll their studio watch period here (12–20 weeks)
      const eligibleAfter = movie.sequelEligibleAfter || 12 + Math.floor(Math.random() * 9);
      const baseBudget = movie.budget || 1500000;
      // FILMS: purely money-driven — the studio watches the full theatrical run
      // for the rolled 12–20 weeks, then greenlights Part N+1 when worldwide
      // gross clears 1.8x the budget. SERIES: same watch period plus the
      // original rating + gross target.
      const targetMet = isTv
        ? checks >= eligibleAfter && (movie.audienceRating || 0) >= 60 && (movie.worldwideGross || 0) > baseBudget * 1.8
        : checks >= eligibleAfter && (movie.worldwideGross || 0) > baseBudget * 1.8;
      if (!targetMet) return { ...movie, sequelCheckWeeks: checks, sequelEligibleAfter: eligibleAfter };

      // TARGET MET — GREENLIGHT TIME (studio offer, or manager-negotiated offer)
      const managerSigned = !!p.representation?.manager?.signed;
      const managerName = p.representation?.manager?.name || 'Your Manager';
      const managerCompany = p.representation?.manager?.company || '';

      if (isTv) {
        const nextSeason = currentSeason + 1;
        // Renewal pay scales with the SHOW's budget, not just the old paycheck:
        // 35% raise over last season, floored at 2% of the production budget
        const studioSalary = Math.max(Math.floor((movie.playerEarnings || 2500000) * 1.35), Math.floor(baseBudget * 0.02));
        const salary = managerSigned ? Math.floor(studioSalary * 1.2) : studioSalary;
        const shootWeeks = 6 + Math.floor(Math.random() * 3);
        const renewedProject: BookedProject = {
          id: `tv_season_${nextSeason}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          projectId: `proj_tv_${nextSeason}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          movieTitle: `${movie.parentMovieTitle || movie.movieTitle}: Season ${nextSeason}`,
          posterUrl: movie.posterUrl,
          roleType: movie.roleType,
          category: 'TV Series',
          salary,
          totalFilmingWeeks: shootWeeks,
          weeksRemaining: shootWeeks,
          isFilmingComplete: false,
          studio: movie.studio,
          director: movie.director,
          status: 'Pending Negotiation',
          isTvSeries: true,
          tvSeason: nextSeason,
          parentMovieTitle: movie.parentMovieTitle || movie.movieTitle,
          backendPercent: managerSigned ? 3.5 : 2.5,
          profitSharePercent: managerSigned ? 5.5 : 4.0,
          sourcedByManager: managerSigned,
        };
        updatedBookedProjects.push(renewedProject);
        newInboxMessages.unshift({
          id: `msg_renew_${nextSeason}_${Date.now()}`,
          category: 'CAREER',
          sender: managerSigned ? managerName : `${movie.studio || 'Network'} Television`,
          senderRole: managerSigned ? 'Personal Manager' : 'President of Scripted Programming',
          senderAvatar: movie.posterUrl,
          subject: managerSigned
            ? `🤝 MANAGER NEGOTIATED: "${movie.parentMovieTitle || movie.movieTitle}" Season ${nextSeason}`
            : `SERIES RENEWED! "${movie.movieTitle}" Greenlit for Season ${nextSeason}!`,
          body: managerSigned
            ? `YOUR MANAGER CLOSED THE DEAL\n\nAfter ${checks} weeks on air, "${movie.movieTitle}" met its renewal target (${movie.audienceRating}% audience rating, $${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M gross), ${managerName} (${managerCompany}) negotiated directly with ${movie.studio || 'the network'}.\n\nNEGOTIATED RENEWAL TERMS:\n• Next Season Salary: $${salary.toLocaleString()}\n• Backend: ${renewedProject.backendPercent}% | Profit Share: ${renewedProject.profitSharePercent}%\n\nReview the full agreement in your Production Hub — accept, reject, or negotiate further.`
            : `CONGRATULATIONS!\n\nAfter ${checks} weeks of stellar viewership (${movie.audienceRating}% audience rating), the network has officially renewed "${movie.parentMovieTitle || movie.movieTitle}" for Season ${nextSeason}!\n\nRENEWAL CONTRACT OFFER:\n• Next Season Salary: $${salary.toLocaleString()} (+35% raise or better)\n• Residual Payouts & Syndication bonus included.\n\nOpen your Production Hub to review and accept the renewal contract!`,
          date: dateInfo.fullDateText,
          read: false,
        });
        newTimelineEvents.push({
          id: `tl_renew_${Date.now()}`,
          year: newYear,
          week: newWeek,
          category: 'RELEASE',
          title: `${movie.movieTitle} renewed for Season ${nextSeason}`,
          description: `After ${checks} weeks, ${movie.movieTitle} met its renewal target and was greenlit for Season ${nextSeason}.${managerSigned ? ` Negotiated by ${managerName}.` : ''}`,
        });
        return { ...movie, sequelOffered: true, sequelOfferedPart: nextSeason, sequelCheckWeeks: checks };
      }

      // MOVIE FRANCHISE SEQUEL
      const nextPart = currentPart + 1;
      const subtitle = nextPart === 2 ? 'The Sequel' : nextPart === 3 ? 'Trilogy Climax' : nextPart === 4 ? 'Resurgence' : 'The Grand Finale';
      const nextFranchiseTitle = `${movie.parentMovieTitle || movie.movieTitle} (Part ${nextPart}: ${subtitle})`;
      const nextBudget = Math.floor(baseBudget * 1.4);
      // Sequel pay scales with the FRANCHISE's budget, not just the old paycheck:
      // 50% raise over the original, floored at 3% of the (bigger) sequel budget
      const studioSalary = Math.max(Math.floor((movie.playerEarnings || 2000000) * 1.5), Math.floor(nextBudget * 0.03));
      const salary = managerSigned ? Math.floor(studioSalary * 1.25) : studioSalary;
      const shootWeeks = 6 + Math.floor(Math.random() * 4);
      const backend = managerSigned ? 5.0 : 3.5;
      const sequelProject: BookedProject = {
        id: `franchise_part_${nextPart}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        projectId: `proj_franchise_${nextPart}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        movieTitle: nextFranchiseTitle,
        posterUrl: movie.posterUrl,
        roleType: 'Lead',
        category: 'Feature Film',
        salary,
        budget: nextBudget,
        totalFilmingWeeks: shootWeeks,
        weeksRemaining: shootWeeks,
        isFilmingComplete: false,
        studio: movie.studio,
        director: movie.director,
        status: 'Pending Negotiation',
        isFranchise: true,
        franchisePart: nextPart,
        parentMovieTitle: movie.parentMovieTitle || movie.movieTitle,
        backendPercent: backend,
        profitSharePercent: backend + 1.5,
        boxOfficeBonus: Math.floor(salary * 2.5),
        sourcedByManager: managerSigned,
      };
      updatedBookedProjects.push(sequelProject);
      newInboxMessages.unshift({
        id: `msg_franchise_greenlight_${nextPart}_${Date.now()}`,
        category: 'CAREER',
        sender: managerSigned ? managerName : `${movie.studio || 'Studio'} Theatrical`,
        senderRole: managerSigned ? 'Personal Manager' : 'Head of Franchise Development',
        senderAvatar: movie.posterUrl,
        subject: managerSigned
          ? `🤝 MANAGER NEGOTIATED: "${nextFranchiseTitle}" deal ready for review`
          : `FRANCHISE SEQUEL GREENLIT: "${nextFranchiseTitle}"!`,
          body: managerSigned
            ? `YOUR MANAGER CLOSED THE DEAL\n\nAfter ${checks} weeks at the box office, "${movie.movieTitle}" met its greenlight target ($${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M gross vs $${(baseBudget * 1.8 / 1000000).toFixed(1)}M target), ${managerName} (${managerCompany}) negotiated directly with ${movie.studio || 'the studio'}.\n\nNEGOTIATED TERMS:\n• Production Budget: $${(nextBudget / 1000000).toFixed(1)}M\n• Salary: $${salary.toLocaleString()} (+25% over standard studio offer)\n• Backend: ${sequelProject.backendPercent}% | Profit Share: ${sequelProject.profitSharePercent}%\n• Box Office Bonus: $${sequelProject.boxOfficeBonus.toLocaleString()}\n\nReview the full agreement in your Production Hub — accept, reject, or negotiate further.`
            : `BREAKING STUDIO GREENLIGHT!\n\nAfter ${checks} weeks at the box office, "${movie.movieTitle}" met its greenlight target ($${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M worldwide gross, ${movie.audienceRating}% audience rating), ${movie.studio || 'the studio'} has officially greenlit Part ${nextPart} of the franchise!\n\nSEQUEL DEAL OFFER:\n• Production Budget: $${(nextBudget / 1000000).toFixed(1)}M\n• Upfront Lead Salary: $${salary.toLocaleString()} (+50% raise or better)\n• Backend Profit Share: ${sequelProject.profitSharePercent}%\n\nVisit your Production Hub to review and accept the sequel agreement!`,
        date: dateInfo.fullDateText,
        read: false,
      });
      newTimelineEvents.push({
        id: `tl_sequel_${Date.now()}`,
        year: newYear,
        week: newWeek,
        category: 'RELEASE',
        title: `Sequel Greenlit: ${nextFranchiseTitle}`,
        description: `After ${checks} weeks, "${movie.movieTitle}" met its greenlight target ($${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M gross) and Part ${nextPart} was greenlit.${managerSigned ? ` Negotiated by ${managerName}.` : ''}`,
      });
      return { ...movie, sequelOffered: true, sequelOfferedPart: nextPart, sequelCheckWeeks: checks };
    });

    // 7d. MANAGER WEEKLY ACTIVITY & VISIBILITY — real reports, visible actions
    const signedMgr = p.representation?.manager;
    if (signedMgr?.signed) {
      const mgrActivity: string[] = [];

      // Sponsorship managed this week (real payouts)
      if ((sponsorshipIncomeThisWeek || 0) > 0) {
        mgrActivity.push(`💼 Managing corporate sponsorship payouts (+$${sponsorshipIncomeThisWeek.toLocaleString()} this week)`);
      }

      // Franchise/sequel deal negotiated this week (real)
      const dealThisWeek = updatedBookedProjects.some((b) => b.sourcedByManager && b.status === 'Pending Negotiation');
      if (dealThisWeek) {
        mgrActivity.push('🤝 Negotiated a franchise/sequel offer with the studio — check Production Hub');
        signedMgr.totalDealsSourced = (signedMgr.totalDealsSourced || 0) + 1;
      }

      // TV interview booked every 6 weeks — booked ONLY via the engine on a
      // station the player has unlocked; the engine's message fires iff a
      // real offer was created (no more ghost notifications, no fake fees).
      if (p.dateWeek % 6 === 0) {
        const tvMsgs = scheduleTvInterview(p);
        tvMsgs.forEach((m) => newInboxMessages.unshift({
          ...m,
          id: `msg_tv_mgr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'MEDIA',
          sender: p.representation?.manager?.name || 'Your Manager',
          senderRole: p.representation?.manager?.company || 'Management',
          senderAvatar: p.representation?.manager?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        }));
        if (tvMsgs.length > 0) {
          mgrActivity.push('🎙️ Booked a real TV interview — check TV Stations for the countdown');
        }
      }

      // Always show baseline activity
      if (mgrActivity.length === 0) {
        mgrActivity.push('📋 Reviewing your contracts and pitching studios on your behalf');
      }
      signedMgr.activity = mgrActivity;
      signedMgr.totalCommissionEarned = signedMgr.totalCommissionEarned || 0;
      p.representation = { ...p.representation, manager: signedMgr };
    }

    // 7e. TV + RADIO INTERVIEW WEEKLY PROCESSING (countdown, ready notifications)
    try {
      const tvMsgs = processTvOffersWeekly(p, newWeek, newYear);
      tvMsgs.forEach((m) => newInboxMessages.unshift({
        ...m,
        id: `msg_tv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: 'MEDIA',
        sender: 'TV Programming Desk',
        senderRole: 'Booking Coordinator',
        senderAvatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100',
      }));
      const radioMsgs = processRadioOffersWeekly(p, newWeek, newYear);
      radioMsgs.forEach((m) => newInboxMessages.unshift({
        ...m,
        id: `msg_rad_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: 'MEDIA',
        sender: 'Radio Programming Desk',
        senderRole: 'Booking Coordinator',
        senderAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100',
      }));
    } catch (e) {
      console.error('TV/Radio interview weekly processing error:', e);
    }

    // 7f2. STREAMING PLATFORM WEEKLY ROYALTIES (real viewership-based) + BID WINDOWS
    try {
      const streamState = loadStreamingState();
      const studioFin = loadStudioState();
      const royaltyResult = processStreamingRoyaltiesWeek(streamState, p, studioFin.financials, newWeek, newYear);
      if (royaltyResult.moneyDelta > 0) {
        streamingIncomeThisWeek += royaltyResult.moneyDelta; // lands via weekly reconciliation (real)
        socialReputation.push(...royaltyResult.messages);
      }
      // NPC LICENSING: for movies the player starred in, the studio and the
      // platforms negotiate streaming rights themselves — the player gets an
      // inbox report with their exact backend percentage + a real signing bonus.
      const npcLicensing = processNpcLicensingWeek(streamState, p, saveData.releasedMovies || [], newWeek, newYear);
      npcLicensing.messages.forEach((m) => {
        newInboxMessages.unshift({
          ...m,
          id: `msg_npc_stream_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'MEDIA',
          sender: 'Streaming Rights Desk',
          senderRole: 'Studio Licensing Coordinator',
          senderAvatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100',
          dateWeek: newWeek,
          dateYear: newYear,
        });
      });
      const npcBonus = drainNpcSigningBonuses();
      if (npcBonus > 0) {
        p.money += npcBonus;
        streamingIncomeThisWeek += npcBonus;
      }
      // Real offer windows: platforms hold bids 3 weeks, then withdraw them
      const bidResult = processBidsWeekly(streamState, newWeek, newYear);
      bidResult.messages.forEach((m) => {
        newInboxMessages.unshift({
          ...m,
          id: `msg_bid_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'MEDIA',
          sender: 'Streaming Rights Desk',
          senderRole: 'Licensing Coordinator',
          senderAvatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100',
        });
      });
      saveStreamingState(streamState);
      saveStudioState(studioFin);
    } catch (e) {
      console.error('Streaming royalty processing error:', e);
    }

    // 7f. PERSONAL STUDIO WEEKLY PROCESSING (energy drain, cast decisions, distribution/release)
    try {
      const studioState = loadStudioState();
      if (studioState.unlocked && studioState.active) {
        const studioResult = processStudioWeek(studioState, p);
        if (studioResult.moneyDelta > 0) {
          studioIncomeThisWeek += studioResult.moneyDelta; // lands via weekly reconciliation (real)
          empireBusinesses.push(`🏢 Personal Studio income: +$${studioResult.moneyDelta.toLocaleString()}`);
        }
        studioResult.messages.forEach((m) => {
          empireBusinesses.push(m);
          newInboxMessages.unshift({
            id: `msg_studio_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'BUSINESS',
            sender: studioState.name || 'Personal Studio',
            senderRole: 'Studio Operations',
            senderAvatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100',
            subject: m.length > 50 ? m.slice(0, 50) + '…' : m,
            body: m,
            date: dateInfo.fullDateText,
            read: false,
          });
        });
      }
      saveStudioState(studioState);
    } catch (e) {
      console.error('Personal studio weekly processing error:', e);
    }

    // 7f3. MANAGER BANKROLL ENGINE (real deal sourcing, production countdowns, payouts)
    try {
      const bankState = loadBankrollState();
      ensureBankrollInit(bankState, p);
      const bankResult = processBankrollWeek(bankState, p, newWeek, newYear);
      bankrollIncomeThisWeek = bankResult.moneyDelta || 0;
      bankResult.messages.forEach((m) => {
        newInboxMessages.unshift({
          ...m,
          id: `msg_bank_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'BUSINESS',
          sender: m.sender,
          senderRole: 'Bankroll & Financing',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          date: dateInfo.fullDateText,
          read: false,
        });
      });
      saveBankrollState(bankState);
    } catch (e) {
      console.error('Bankroll weekly processing error:', e);
    }

    // 8. Refill & Age Callboard (NPC Actor Competition & Mandatory Failsafe Role Guarantee)
    const remainingCallboard: CallboardProject[] = [];
    saveData.callboard.forEach(project => {
      const remainingWeeks = (project.decisionTimeWeeks || 3) - 1;
      // 15% chance per week for older projects to be filled by competing NPC actors
      const npcClaimed = remainingWeeks <= 0 || (Math.random() < 0.15 && remainingWeeks <= 2);
      if (npcClaimed) {
        // ONLY notify when the player MANUALLY applied to THIS EXACT listing (strict projectId match).
        // Title matching is BANNED (recycled titles would spam). Agent auto-pitches are
        // silent until resolved — no expiry spam for submissions the player never chose.
        const playerAppliedToThisListing =
          saveData.auditions.some(a => a.projectId === project.id && !a.agentPitched);

        if (playerAppliedToThisListing) {
          newInboxMessages.unshift({
            id: `msg_npc_fill_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'CASTING',
            sender: `${project.studio || 'Studio'} Casting`,
            senderRole: 'Casting Director',
            senderAvatar: project.posterUrl,
            subject: `Callboard Expired: ${project.title}`,
            body: `Heads up: The ${project.roleType} role in "${project.title}" on the Callboard has expired and was filled by another actor. Your active Auditions are still pending and will be decided separately. Keep checking the Callboard for fresh opportunities!`,
            date: dateInfo.fullDateText,
            read: false,
          });
        }
      } else {
        remainingCallboard.push({
          ...project,
          decisionTimeWeeks: remainingWeeks,
        });
      }
    });

    let updatedCallboard = [...remainingCallboard];
    if (updatedCallboard.length < 10) {
      const targetCount = 10 + Math.floor(Math.random() * 16); // 10-25 endless pool, no fake simulation
      const freshBatch = generateCallboardProjects(targetCount, p.fameXp);
      updatedCallboard = [...updatedCallboard, ...freshBatch];
    }

    // MANDATORY FAILSAFE: Guarantee Minimum 2 Principal Roles, 2 Supporting Roles, 1 Minor Role EVERY WEEK
    updatedCallboard = validateAndEnforceCallboardRoster(updatedCallboard, p.fameXp);

    // 9. Relationships — weeks tick, pregnancies advance, births fire
    const birthsThisWeek: Array<{ motherName: string; child: any }> = [];
    const updatedRelationships = saveData.relationships.map(rel => {
      if (rel.stage === 'Stranger') return rel;
      let next = { ...rel, weeksInCurrentStage: rel.weeksInCurrentStage + 1 };
      // Pregnancy countdown → birth (real ChildRecord with the chosen name)
      if (next.pregnancy) {
        const res = RelationshipEngine.advancePregnancy(p, next);
        next = res.updatedNpc;
        if (res.bornChild) {
          birthsThisWeek.push({ motherName: next.name, child: res.bornChild });
          p.childrenCount = (p.childrenCount || 0) + 1;
        }
      }
      return next;
    });

    for (const birth of birthsThisWeek) {
      newInboxMessages.unshift({
        id: `msg_birth_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: 'RELATIONSHIPS',
        sender: `${birth.motherName}`,
        senderRole: 'Family',
        subject: `👶 IT'S A ${birth.child.gender === 'Male' ? 'BOY' : birth.child.gender === 'Female' ? 'GIRL' : 'BABY'}! Welcome ${birth.child.name}`,
        body: `${birth.motherName} gave birth this week!\n\n• Name: ${birth.child.name}\n• Gender: ${birth.child.gender}\n• Born: Week ${newWeek}, ${newYear}\n\nCongratulations — your family just grew. Visit Relationships → Family to watch ${birth.child.name} grow.`,
        date: dateInfo.fullDateText,
        read: false,
        dateWeek: newWeek,
        dateYear: newYear,
      });
      worldNews.push(`👶 ${p.firstName} ${p.lastName} and ${birth.motherName} welcomed baby ${birth.child.name}!`);
    }

    // Invisible Market Engine Weekly Processing
    // The player's fan token prices off REAL career state: fame momentum,
    // this week's box office performance, and fanbase scale.
    const thisWeekReleases = newReleasedMovies.filter((m) => m.releaseWeek === newWeek && m.releaseYear === newYear);
    const lastReleasePerformance = thisWeekReleases.length > 0
      ? Math.max(-1, Math.min(1, Math.max(...thisWeekReleases.map((m) => {
          const budget = Math.max(1000000, m.budget || 25000000);
          return ((m.worldwideGross || 0) - budget) / (budget * 2);
        }))))
      : 0;
    const hasLiveFanToken = MarketEngineService.getMarketState().cryptoCoins.some((c) => c.isMyCoin && (c.status === 'Active' || c.status === 'TopLeader'));
    const marketResult = MarketEngineService.processEndWeek(newWeek, newYear, p.money, hasLiveFanToken ? {
      fameXp: p.fameXp,
      fameDeltaPct: fameXpAtWeekStart > 0 ? ((p.fameXp - fameXpAtWeekStart) / fameXpAtWeekStart) * 100 : 0,
      lastReleasePerformance,
      fanCount: p.fans,
    } : undefined);
    if (marketResult && marketResult.headlineNews && marketResult.headlineNews.length > 0) {
      worldNews.push(...marketResult.headlineNews);
    }

    // ============ STUDIO MARKET BRIDGE ============
    // Real Wall Street West studios cast real NPC films — roles ship directly
    // onto the player's Callboard, tagged with the studio + ticker.
    if (marketResult?.studioCastingCalls && marketResult.studioCastingCalls.length > 0) {
      const STUDIO_BRIDGE_POSTERS = [
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1518173946687-a4c8a383392d?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a0?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400',
      ];
      const STUDIO_BRIDGE_DIRECTORS = ['Christopher Nolan', 'Greta Gerwig', 'Denis Villeneuve', 'Ava DuVernay', 'Guillermo del Toro', 'Kathryn Bigelow', 'Jordan Peele', 'Chloé Zhao'];
      const pickB = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

      const studioListings: CallboardProject[] = marketResult.studioCastingCalls
        .filter((cc) => !updatedCallboard.some((p2) => p2.productionRef === cc.productionRef && p2.roleType === cc.role.roleType))
        .map((cc) => ({
          id: `cb_studio_${cc.productionRef}_${cc.role.roleType}`,
          posterUrl: pickB(STUDIO_BRIDGE_POSTERS),
          title: cc.title,
          genre: cc.genre,
          category: cc.budget >= 80000000 ? 'Feature Film' : cc.budget >= 20000000 ? 'Feature Film' : 'Independent Film',
          productionCompany: cc.studioName,
          studio: cc.studioName,
          studioTicker: cc.studioTicker,
          productionRef: cc.productionRef,
          director: pickB(STUDIO_BRIDGE_DIRECTORS),
          producer: cc.studioName,
          budget: cc.budget,
          filmingWeeks: cc.role.filmingWeeks,
          estimatedReleaseWindow: `${['Spring', 'Summer', 'Fall', 'Holiday'][Math.floor(Math.random() * 4)]} ${newYear + (Math.random() < 0.4 ? 1 : 0)}`,
          roleType: cc.role.roleType,
          salary: cc.role.salary,
          description: `A REAL ${cc.studioName} production (${cc.studioTicker}) straight off the studio lot — "${cc.title}" is a ${cc.genre.toLowerCase()} with a $${(cc.budget / 1000000).toFixed(0)}M budget now casting its ${cc.role.roleType.toLowerCase()} role. Book it and you're working for a studio you can actually own shares in — the film's box office will move the stock.`,
          decisionTimeWeeks: 2 + Math.floor(Math.random() * 3),
          requiredFameXp: cc.role.requiredFameXp,
          requiredCourses: coursesRequiredFor(cc.budget, cc.role.roleType),
        }));
      if (studioListings.length > 0) {
        updatedCallboard = [...studioListings, ...updatedCallboard].slice(0, 35);
      }
    }

    // Studio events (new studio listings, milestone releases) → Inbox
    if (marketResult?.studioEvents && marketResult.studioEvents.length > 0) {
      for (const se of marketResult.studioEvents) {
        newInboxMessages.unshift({
          id: `msg_studio_${se.kind}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'BUSINESS',
          sender: 'Wall Street West',
          senderRole: se.kind === 'STUDIO_LISTING' ? 'New Listings Desk' : 'Studio Desk',
          subject: se.subject,
          body: se.body,
          date: dateInfo.fullDateText,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
    }

    // Crypto living market — listings, delist reviews, regime shifts → Inbox.
    // Forced-liquidation proceeds from delistings are credited for real.
    if (marketResult?.cryptoEvents && marketResult.cryptoEvents.length > 0) {
      for (const ce of marketResult.cryptoEvents) {
        newInboxMessages.unshift({
          id: `msg_crypto_${ce.kind}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: ce.kind === 'REGIME' ? 'FINANCE' : ce.kind === 'COPY' ? 'FINANCE' : 'BUSINESS',
          sender: 'Star Exchange',
          senderRole: ce.kind === 'LISTING' ? 'New Listings Desk' : ce.kind === 'COPY' ? 'Whale Copy-Trade Desk' : ce.kind === 'DELISTED' || ce.kind === 'DELIST_VOTE' ? 'Delisting Committee' : 'Market Surveillance',
          subject: ce.subject,
          body: ce.body,
          date: dateInfo.fullDateText,
          read: false,
          dateWeek: newWeek,
          dateYear: newYear,
        });
      }
    }
    if (marketResult?.delistPayouts && marketResult.delistPayouts > 0) {
      const payout = marketResult.delistPayouts;
      p.money += payout;
      bankrollIncomeThisWeek += 0; // delist payout is return of capital, not income
      newInboxMessages.unshift({
        id: `msg_crypto_payout_${Date.now()}`,
        category: 'FINANCE',
        sender: 'Star Exchange Settlements',
        senderRole: 'Forced Liquidation Desk',
        subject: `Settlement complete — $${payout.toLocaleString()} credited from delist liquidation`,
        body: `Your delisted token positions were liquidated at the contractual 40% delist discount.\n\nNet proceeds credited to your cash balance: $${payout.toLocaleString()}.\n\nThe exchange is sorry for the loss — delist reviews are announced in advance precisely so holders can exit before this happens.`,
        date: dateInfo.fullDateText,
        read: false,
        dateWeek: newWeek,
        dateYear: newYear,
      });
    }

    // Whale copy-trade P&L — real cash from mirrored positions
    if (marketResult?.whaleCopyPnl && marketResult.whaleCopyPnl !== 0) {
      p.money = Math.max(0, p.money + marketResult.whaleCopyPnl);
    }

    const updatedInbox = [...newInboxMessages, ...saveData.inbox];

    // ------------------------------------------------------------------
    // FINAL CENTRALIZED LEDGER SUMMATION & SINGLE SOURCE OF TRUTH UPDATES
    // ------------------------------------------------------------------
    const fanClubDuesIncomeThisWeek = (repResult as any).fanClubDues || 0;
    const merchProfitIncomeThisWeek = (repResult as any).merchProfit || 0;

    const posBusinessIncome = businessIncomeThisWeek > 0 ? businessIncomeThisWeek : 0;
    const negBusinessLoss = businessIncomeThisWeek < 0 ? Math.abs(businessIncomeThisWeek) : 0;

    // SINGLE-SOURCE OF TRUTH: repResult.weeklyEarnings ALREADY includes
    // endorsements + sponsorships + fan club dues + merch profit. Adding
    // dues/merch again here would DOUBLE-PAY them — so they are excluded from
    // the money flow (kept only for recap/transaction display).
    const totalWeeklyIncome =
      salaryEarnedThisWeek +
      royaltiesEarnedThisWeek +
      posBusinessIncome +
      propertyIncomeThisWeek +
      sponsorshipIncomeThisWeek +
      endorsementIncomeThisWeek +
      socialYoutubeIncomeThisWeek +
      streamingIncomeThisWeek +
      studioIncomeThisWeek +
      hubIncomeThisWeek +
      interviewFeeIncomeThisWeek +
      bankrollIncomeThisWeek;

    // Calculate real mid-week expenses incurred from transaction history during current week
    const midWeekExpensesThisWeek = (networkState.bankAccount?.transactionHistory || [])
      .filter((tx) => tx.type === 'EXPENSE' && tx.week === p.dateWeek)
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

    let endOfWeekExpensesThisWeek =
      livingExpense +
      propertyExpensesThisWeek +
      vehicleExpensesThisWeek +
      securityExpensesThisWeek +
      prRetainerExpensesThisWeek +
      legalRetainerExpensesThisWeek +
      writerExpensesThisWeek +
      advisorExpensesThisWeek +
      healthExpensesThisWeek +
      loanRepaymentExpensesThisWeek +
      negBusinessLoss;

    const totalWeeklyExpenses = midWeekExpensesThisWeek + endOfWeekExpensesThisWeek;

    // ============ REAL TAX ENGINE — weekly withholding + year-end filing ============
    try {
      const taxIncomeByCategory = {
        acting: salaryEarnedThisWeek,
        royalties: royaltiesEarnedThisWeek,
        business: posBusinessIncome,
        property: propertyIncomeThisWeek,
        sponsorship: sponsorshipIncomeThisWeek,
        // endorsement already includes fan club dues + merch profit (single source)
        endorsement: endorsementIncomeThisWeek,
        social: socialYoutubeIncomeThisWeek,
        streaming: streamingIncomeThisWeek,
        studio: studioIncomeThisWeek,
        media: hubIncomeThisWeek + interviewFeeIncomeThisWeek,
        investment: bankrollIncomeThisWeek,
        // Net realized crypto gains this week (losses offset) — taxable
        crypto: MarketEngineService.consumePendingCryptoTax(),
      };
      const empireNow = empireResult?.updatedState;
      const repNow = RepresentationService.getState();
      const studioFinTax = loadStudioState();
      // Seed deduction baselines once so historical totals never count as one-week deductions
      ensureTaxBaselines(repNow?.charities || [], studioFinTax?.financials || []);
      const taxResult = processTaxWeek({
        year: p.dateYear,
        week: p.dateWeek,
        nextYear: newYear,
        incomeByCategory: taxIncomeByCategory,
        charityDonatedThisWeek: charityDeltaThisWeek(repNow?.charities || []),
        studioExpensesThisWeek: studioExpenseDeltaThisWeek(studioFinTax?.financials || []),
        businessLossesThisWeek: negBusinessLoss,
        retainersThisWeek: legalRetainerExpensesThisWeek + prRetainerExpensesThisWeek,
        accountantTier: empireNow?.taxState?.accountantTier || 'None',
        incorporated: !!empireNow?.holdingCompany?.isFormed,
        lawyerActive: (repNow?.lawFirm?.hiredFirmTier || 'None') !== 'None',
        currentMonth: monthOfWeek(p.dateWeek),
        monthEnd: closingMonthOfWeek(p.dateWeek, newYear > p.dateYear),
      });
      taxesPaidThisWeek = taxResult.withheld || 0;
      endOfWeekExpensesThisWeek += taxesPaidThisWeek;

      // Year-end filing: real refund / balance due / audit penalty
      if (taxResult.filing) {
        const f = taxResult.filing;
        if (f.refund && f.refund > 0) taxFilingAdjustment += f.refund;
        if (f.balanceDue && f.balanceDue > 0) taxFilingAdjustment -= f.balanceDue;
        if (f.penalty && f.penalty > 0) taxFilingAdjustment -= f.penalty;
        newInboxMessages.unshift({
          id: `msg_tax_filing_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'FINANCE',
          sender: 'Tax Authority',
          senderRole: 'Year-End Filing Office',
          senderAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100',
          subject: f.subject,
          body: f.body,
          date: dateInfo.fullDateText,
          read: false,
        });
        empireBusinesses.push(`🏛️ ${f.subject} — ${f.auditNote}`);
        // Live dashboard popup — driven entirely by the real year-end filing
        const fileRec = getTaxRecord(loadTaxState(), p.dateYear);
        setTaxStatementData({
          type: 'filing',
          year: p.dateYear,
          week: p.dateWeek,
          refund: f.refund,
          balanceDue: f.balanceDue,
          totalIncome: fileRec.income,
          deductions: fileRec.deductions,
          taxable: fileRec.taxable,
          liability: fileRec.liability,
          effectiveRate: fileRec.effectiveRate,
          ytdWithheld: fileRec.withheld,
          audited: f.audited,
          penalty: f.penalty,
          auditNote: f.auditNote,
          monthlyHistory: (fileRec.monthly || []).map((b) => ({ month: b.month, income: b.income, withheld: b.withheld, closed: b.closed, audited: b.audited })),
          accountantTier: empireNow?.taxState?.accountantTier || 'None',
        });
      }

      // Month-end statement: real monthly close + possible field audit penalty
      if (taxResult.monthly) {
        const m = taxResult.monthly;
        if (m.penalty && m.penalty > 0) taxFilingAdjustment -= m.penalty;
        newInboxMessages.unshift({
          id: `msg_tax_month_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          category: 'FINANCE',
          sender: 'Tax Authority',
          senderRole: 'Monthly Compliance Office',
          senderAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100',
          subject: m.subject,
          body: m.body,
          date: dateInfo.fullDateText,
          read: false,
        });
        empireBusinesses.push(`📜 ${m.month} closed: $${m.monthIncome.toLocaleString()} income / $${m.monthWithheld.toLocaleString()} withheld — ${m.auditNote}`);
        // Live dashboard popup — driven entirely by the real monthly close
        const monthRec = getTaxRecord(loadTaxState(), p.dateYear);
        setTaxStatementData({
          type: 'monthly',
          year: p.dateYear,
          week: p.dateWeek,
          month: m.month,
          monthIncome: m.monthIncome,
          monthWithheld: m.monthWithheld,
          ytdIncome: m.ytdIncome,
          ytdWithheld: m.ytdWithheld,
          ytdLiability: m.ytdLiability,
          audited: m.audited,
          penalty: m.penalty,
          auditNote: m.auditNote,
          monthlyHistory: (monthRec.monthly || []).map((b) => ({ month: b.month, income: b.income, withheld: b.withheld, closed: b.closed, audited: b.audited })),
          accountantTier: empireNow?.taxState?.accountantTier || 'None',
        });
      }

      // Keep empire taxState in sync with the REAL engine (dashboard + achievements)
      if (empireNow) {
        const taxRec = getTaxRecord(loadTaxState(), p.dateYear);
        empireNow.taxState = empireNow.taxState || ({} as any);
        empireNow.taxState.taxSaved = taxRec.deductions;
        empireNow.taxState.totalTaxDue = taxRec.liability;
        empireNow.taxState.incomeTax = Math.floor(taxRec.taxable * 0.1);
        EmpireService.saveState(empireNow);
      }
    } catch (e) {
      console.error('Tax engine error:', e);
    }

    const netWeeklyChange = totalWeeklyIncome - endOfWeekExpensesThisWeek;

    // SLOW BURN: ALL weekly fame sources (courses, releases, interviews,
    // awards, appearances) pay the same global fraction, floor 1 XP.
    const rawWeeklyFame = fameGainedThisWeek || 0;
    fameGainedThisWeek = rawWeeklyFame > 0 ? Math.max(1, Math.floor(rawWeeklyFame * FAME_XP_MULTIPLIER)) : 0;

    // Apply exact single-source-of-truth values to Player
    p.money = Math.max(0, startMoney + netWeeklyChange);
    p.fans = startFans + fansGainedThisWeek;
    p.fameXp = startFame + fameGainedThisWeek;

    // Achievement rewards are REAL income — paid on top of the weekly total,
    // at reduced rates: fame at the global slow-burn fraction, cash at half
    if (achievementRewardCash > 0) p.money = (p.money || 0) + Math.floor(achievementRewardCash * 0.5);
    if (achievementRewardXp > 0) p.fameXp = (p.fameXp || 0) + Math.max(1, Math.floor(achievementRewardXp * FAME_XP_MULTIPLIER));

    // Year-end tax filing settles (refund deposited / balance due + audit penalty collected)
    if (taxFilingAdjustment !== 0) {
      p.money = Math.max(0, (p.money || 0) + taxFilingAdjustment);
    }

    // Synchronize Network Banking & Record Itemized Bank Transactions
    if (!networkState.bankAccount) {
      networkState.bankAccount = {
        checkingBalance: p.money,
        savingsBalance: 0,
        savingsApy: 0.025,
        businessBalance: 0,
        investmentBalance: 0,
        offshoreBalance: 0,
        offshoreApy: 0.04,
        activeLoans: [],
        loanHistory: [],
        preGeneratedOffers: [],
        creditScore: 320,
        bankReputation: 50,
        reputationRating: 'CCC',
        transactionHistory: [],
      };
    }
    networkState.bankAccount.checkingBalance = p.money;

    const weeklyTxList: any[] = [];
    if (salaryEarnedThisWeek > 0) {
      weeklyTxList.push({ id: `tx_sal_${Date.now()}_1`, title: 'Studio Salary Deposit', amount: salaryEarnedThisWeek, type: 'INCOME', category: 'SALARY', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (royaltiesEarnedThisWeek > 0) {
      weeklyTxList.push({ id: `tx_roy_${Date.now()}_2`, title: 'SAG Residuals & Royalties', amount: royaltiesEarnedThisWeek, type: 'INCOME', category: 'ROYALTIES', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (fanClubDuesIncomeThisWeek > 0) {
      weeklyTxList.push({ id: `tx_fan_${Date.now()}_3`, title: 'Fan Club Weekly Dues', amount: fanClubDuesIncomeThisWeek, type: 'INCOME', category: 'FAN_CLUB', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (merchProfitIncomeThisWeek > 0) {
      weeklyTxList.push({ id: `tx_mch_${Date.now()}_4`, title: 'Merchandise Net Revenue', amount: merchProfitIncomeThisWeek, type: 'INCOME', category: 'MERCHANDISE', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (propertyIncomeThisWeek > 0) {
      weeklyTxList.push({ id: `tx_prp_${Date.now()}_5`, title: 'Real Estate Rental Income', amount: propertyIncomeThisWeek, type: 'INCOME', category: 'REAL_ESTATE', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (livingExpense > 0) {
      weeklyTxList.push({ id: `tx_liv_${Date.now()}_6`, title: 'Personal Living Expenses', amount: -livingExpense, type: 'EXPENSE', category: 'LIVING', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (prRetainerExpensesThisWeek > 0) {
      weeklyTxList.push({ id: `tx_prr_${Date.now()}_7`, title: 'PR Agency Retainer', amount: -prRetainerExpensesThisWeek, type: 'EXPENSE', category: 'REPRESENTATION', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (legalRetainerExpensesThisWeek > 0) {
      weeklyTxList.push({ id: `tx_lgl_${Date.now()}_8`, title: 'Law Firm Legal Retainer', amount: -legalRetainerExpensesThisWeek, type: 'EXPENSE', category: 'REPRESENTATION', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (propertyExpensesThisWeek > 0) {
      weeklyTxList.push({ id: `tx_prpexp_${Date.now()}_9`, title: 'Property Upkeep & Mortgage', amount: -propertyExpensesThisWeek, type: 'EXPENSE', category: 'RENT_MORTGAGE', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (vehicleExpensesThisWeek > 0) {
      weeklyTxList.push({ id: `tx_vehexp_${Date.now()}_10`, title: 'Vehicle Upkeep & Maintenance', amount: -vehicleExpensesThisWeek, type: 'EXPENSE', category: 'VEHICLE', dateText: dateInfo.fullDateText, week: newWeek });
    }
    if (securityExpensesThisWeek > 0) {
      weeklyTxList.push({ id: `tx_secexp_${Date.now()}_11`, title: 'Personal Security Detail', amount: -securityExpensesThisWeek, type: 'EXPENSE', category: 'SECURITY', dateText: dateInfo.fullDateText, week: newWeek });
    }

    if (weeklyTxList.length > 0) {
      networkState.bankAccount.transactionHistory = [...weeklyTxList, ...(networkState.bankAccount.transactionHistory || [])].slice(0, 100);
    }

    const summary = NetworkService.calculateFinancialSummary(networkState, p.money);
    p.netWorth = summary.netWorth;

    NetworkService.saveState(networkState);
    NetworkService.updateForbesAndBankableRankings(p);

    // Construct Beast Mode Weekly Recap Data
    const recapData: WeeklyRecapData = {
      week: newWeek,
      year: newYear,
      dateRangeText: dateInfo.dateRangeText,
      energyRestored,
      expensesPaid: totalWeeklyExpenses,
      career: {
        movies: careerMovies,
        series: careerSeries,
        auditions: careerAuditions,
        castingResults: careerCastingResults,
        filmingProgress: careerFilmingProgress,
        training: careerTraining,
      },
      finance: {
        income: totalWeeklyIncome,
        expenses: totalWeeklyExpenses,
        salary: salaryEarnedThisWeek,
        royalties: royaltiesEarnedThisWeek,
        residuals: residualsEarnedThisWeek,
        backend: backendEarnedThisWeek,
        streamingRoyalties: streamingEarnedThisWeek,
        merchandiseRoyalties: merchEarnedThisWeek,
        syndicationRoyalties: syndicationEarnedThisWeek,
        internationalRoyalties: internationalEarnedThisWeek,
        businessIncome: businessIncomeThisWeek,
        propertyIncome: propertyIncomeThisWeek,
        boxOfficeWeeklyGross: boxOfficeWeeklyGrossThisWeek,
        endorsementIncome: endorsementIncomeThisWeek + sponsorshipIncomeThisWeek,
        taxes: taxesPaidThisWeek,
        netWeeklyChange,
      },
      social: {
        followersGained: socialsResult.fanGrowth || 0,
        following: updatedRelationships.filter(r => r.relationshipLevel > 30).length,
        posts: socialPosts,
        trending: socialTrending,
        fanGrowth: fansGainedThisWeek,
        reputationChanges: socialReputation,
      },
      world: {
        news: worldNews,
        tv: worldTv,
        radio: worldRadio,
        streaming: worldStreaming,
        awards: worldAwards,
        industryEvents: worldEvents,
      },
      network: {
        bank: networkBank,
        savings: networkSavings,
        properties: networkProperties,
        vehicles: networkVehicles,
        security: networkSecurity,
        vault: networkVault,
        forbes: networkForbes,
      },
      empire: {
        businesses: empireBusinesses,
        holdingCompany: empireHolding,
        eliteClub: empireElite,
        realEstate: empireRealEstate,
        board: empireBoard,
        expansion: empireExpansion,
      },
      representation: {
        pr: repPr,
        contracts: repContracts,
        media: repMedia,
        brandDeals: repBrandDeals,
        sponsorships: repSponsorships,
        lawFirm: repLawFirm,
      },
      comingNextWeek: {
        upcomingAuditions: nextAuditions,
        moviePremieres: nextPremieres,
        awardShows: nextAwardShows,
        contractDeadlines: nextDeadlines,
        businessLaunches: nextLaunches,
        propertyPayments: nextPayments,
      },
    };

    setLastWeeklyRecap(recapData);

    p.energy = currentEnergy;

    const updatedSaveData: SaveData = {
      ...saveData,
      player: p,
      callboard: updatedCallboard,
      auditions: remainingAuditions,
      bookedProjects: updatedBookedProjects,
      releasedMovies: finalReleasedMovies,
      inbox: updatedInbox,
      relationships: updatedRelationships,
      careerTimeline: [...newTimelineEvents, ...(saveData.careerTimeline || [])],
    };

    updateSave(updatedSaveData);
    } catch (err) {
      console.error('Error during advanceWeek processing:', err);
    } finally {
      // After brief delay, show the Year-End Awards Night (Week 52) or the Weekly Recap
      setTimeout(() => {
        setIsProcessingWeek(false);
        if (awardNightPending) {
          setActiveModal('award_ceremony');
        } else {
          setActiveModal('weekly_recap');
        }
      }, 1400);
    }
  };

  // Boost Production in Booking
  const boostProduction = (bookingId: string) => {
    const proj = saveData.bookedProjects.find(b => b.id === bookingId);
    if (!proj) return { success: false, message: 'Project not found.' };

    if (saveData.player.energy < 2) {
      return { success: false, message: 'Not enough Energy! Boosting costs 2 Energy.' };
    }

    if (proj.weeksRemaining <= 1) {
      return { success: false, message: 'Filming is already in its final week!' };
    }

    soundService.playClick();

    const updatedBookings = saveData.bookedProjects.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          weeksRemaining: b.weeksRemaining - 1,
          boostedThisTurn: true,
        };
      }
      return b;
    });

    const updatedPlayer = {
      ...saveData.player,
      energy: saveData.player.energy - 2,
    };

    updateSave({
      ...saveData,
      player: updatedPlayer,
      bookedProjects: updatedBookings,
    });

    return { success: true, message: 'Spent 2 Energy to boost production progress by 1 week!' };
  };

  // Join SAG-AFTRA Membership
  const joinSAGMembership = () => {
    if (saveData.player.isUnionMember) {
      return { success: false, message: 'You are already an official SAG-AFTRA member!' };
    }

    if (saveData.player.money < 2000) {
      return { success: false, message: 'Requirements not met: You need at least $2,000 in cash.' };
    }

    const totalPrincipal = (saveData.player.principalRolesCount || 0) + (saveData.player.leadRolesCount || 0);
    if (totalPrincipal < 4) {
      return { success: false, message: `Requirements not met: You need 4 Principal or Lead Roles (Current: ${totalPrincipal}/4).` };
    }

    soundService.playFanfare();

    const updatedPlayer: Player = {
      ...saveData.player,
      money: saveData.player.money - 2000,
      isUnionMember: true,
    };

    const newInboxMsg: InboxMessage = {
      id: `msg_sag_unlocked_${Date.now()}`,
      category: 'FINANCE',
      sender: 'SAG-AFTRA Guild',
      senderRole: 'Guild President',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      subject: 'WELCOME TO SAG-AFTRA!',
      body: 'Congratulations! You are officially an active member of SAG-AFTRA. You now have access to Professional Auditions, Major Studio deals, Residual Payments, and Award eligibility.',
      date: `Week ${saveData.player.dateWeek}, ${saveData.player.dateYear}`,
      read: false,
    };

    const sagTimelineEvent = createTimelineEvent(
      saveData.player.dateYear,
      saveData.player.dateWeek,
      'EMPIRE',
      'Joined SAG-AFTRA Guild',
      'Earned official union membership card in SAG-AFTRA, unlocking major studio audition privileges and residual rights.'
    );

    // Record SAG membership fee transaction
    const netState = NetworkService.loadState(updatedPlayer);
    if (!netState.bankAccount) {
      netState.bankAccount = { checkingBalance: updatedPlayer.money, transactionHistory: [] } as any;
    }
    if (!netState.bankAccount.transactionHistory) netState.bankAccount.transactionHistory = [];
    netState.bankAccount.transactionHistory.unshift({
      id: `tx_sag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      description: `SAG-AFTRA Guild Membership Fee`,
      amount: -2000,
      type: 'EXPENSE',
      category: 'REPRESENTATION',
      week: saveData.player.dateWeek || 1,
    });
    NetworkService.saveState(netState);

    updateSave({
      ...saveData,
      player: updatedPlayer,
      inbox: [newInboxMsg, ...saveData.inbox],
      careerTimeline: [sagTimelineEvent, ...(saveData.careerTimeline || [])],
    });

    addFameXp(35, 'Joined SAG-AFTRA Union');

    return { success: true, message: 'SAG-AFTRA Membership unlocked successfully!' };
  };

  // Movie Release Pipeline Implementation
  const releaseMovie = (projectId: string, config: ReleaseConfig): { success: boolean; message: string } => {
    let result = { success: false, message: 'Project not found or not ready for release.' };

    const proj = saveData.bookedProjects.find((b) => b.id === projectId);
    if (!proj) return result;

    const totalUpfrontCost = (config.marketingBudget || 0) + (config.screenCost || 0) + (config.premiereCost || 0);
    const playerMoney = saveData.player.money || 0;

    if (playerMoney < totalUpfrontCost) {
      return {
        success: false,
        message: `Insufficient funds! You need $${totalUpfrontCost.toLocaleString()} to launch this release package (Current balance: $${playerMoney.toLocaleString()}).`,
      };
    }

    soundService.playClick();

    // Deduct release costs from player money
    const updatedPlayer: Player = {
      ...saveData.player,
      money: playerMoney - totalUpfrontCost,
    };

    if (totalUpfrontCost > 0) {
      const netState = NetworkService.loadState(updatedPlayer);
      if (!netState.bankAccount) {
        netState.bankAccount = { checkingBalance: updatedPlayer.money, transactionHistory: [] } as any;
      }
      if (!netState.bankAccount.transactionHistory) netState.bankAccount.transactionHistory = [];
      netState.bankAccount.transactionHistory.unshift({
        id: `tx_rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        description: `Theatrical Release Package: ${proj.movieTitle}`,
        amount: -totalUpfrontCost,
        type: 'EXPENSE',
        category: 'PRODUCTION',
        week: saveData.player.dateWeek || 1,
      });
      NetworkService.saveState(netState);
    }

    // Calculate final accumulated Hype Score
    const baseHype = proj.hypeScore || 40;
    const finalHype = baseHype + (config.marketingHypeBonus || 0) + (config.premiereHypeBonus || 0);

    // Calculate Box Office stats
    const baseBudget = proj.budget || 25000000;
    const screenMult = config.screenMultiplier || 1.0;
    const fameBonus = (updatedPlayer.fameXp || 0) * 3000;
    const actingTalent = updatedPlayer.talents?.acting || 50;
    const dramaTalent = updatedPlayer.talents?.drama || 50;

    const openingGross = Math.floor(
      ((baseBudget * 0.16) + (finalHype * 320000) + fameBonus) * screenMult
    );
    const domesticGross = Math.floor(openingGross * (2.2 + Math.random() * 0.8));
    const worldwideGross = Math.floor(domesticGross * (1.8 + Math.random() * 1.2));

    const audienceRating = Math.min(100, Math.max(35, Math.floor(65 + (actingTalent * 0.25) + Math.random() * 15)));
    const criticRating = Math.min(100, Math.max(30, Math.floor(60 + (dramaTalent * 0.25) + Math.random() * 20)));

    const newReleasedMovie: ReleasedMovie = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      movieTitle: proj.movieTitle,
      posterUrl: proj.posterUrl,
      roleType: proj.roleType,
      category: proj.category,
      playerEarnings: proj.salary,
      openingWeekendGross: openingGross,
      domesticGross,
      worldwideGross,
      audienceRating,
      criticRating,
      boxOfficePosition: 1,
      weeksInCinemas: 1,
      awardsWon: 0,
      awardsNominated: 0,
      inCinemas: true,
      studio: proj.studio,
      director: proj.director,
      genre: proj.genre,
      budget: proj.budget,
      sequelCheckWeeks: 0,
      sequelEligibleAfter: 12 + Math.floor(Math.random() * 9),
      sequelOffered: false,
      sequelTarget: Math.floor(baseBudget * 1.8),
      releaseWeek: saveData.player.dateWeek + (config.releaseWeekOffset || 0),
      releaseYear: saveData.player.dateYear,
    };

    // Remove from active bookedProjects
    const updatedBooked = saveData.bookedProjects.filter((b) => b.id !== projectId);

    // Add to releasedMovies
    const updatedReleased = [newReleasedMovie, ...(saveData.releasedMovies || [])];

    // Award Fame XP - unified base values with the weekly auto-release path
    // (Lead 22 / Principal 16 / Supporting 10, then global slow-burn applies)
    const releaseFame = proj.roleType === 'Lead' ? 22 : proj.roleType === 'Principal' ? 16 : 10;

    // Timeline event & inbox message
    const dateInfo = formatCalendarDate(saveData.player.dateYear, saveData.player.dateWeek);
    const releaseTimelineEvent: TimelineEvent = {
      id: `tl_rel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      year: saveData.player.dateYear,
      week: saveData.player.dateWeek,
      category: 'RELEASE',
      title: `Theatrical Release: ${proj.movieTitle}`,
      description: `"${proj.movieTitle}" opened in ${config.screens.toLocaleString()} theaters with $${(openingGross / 1000000).toFixed(1)}M opening weekend! Premiere: ${config.premiereType}.`,
    };

    const releaseInboxMessage: InboxMessage = {
      id: `msg_rel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      category: 'CAREER',
      sender: `${proj.studio || 'Studio'} Box Office Reporting`,
      senderRole: 'Box Office Analyst',
      senderAvatar: proj.posterUrl,
      subject: `BOX OFFICE REPORT: "${proj.movieTitle}" Opens at $${(openingGross / 1000000).toFixed(1)}M!`,
      body: `CONGRATULATIONS!\n\n"${proj.movieTitle}" has officially debuted in ${config.screens.toLocaleString()} theaters worldwide!\n\nOPENING WEEKEND SUMMARY:\n• Opening Weekend Gross: $${openingGross.toLocaleString()}\n• Premiere Package: ${config.premiereType}\n• Total Screens: ${config.screens.toLocaleString()} theaters\n• Critic Rating: ${criticRating}%\n• Audience Score: ${audienceRating}%\n\nView full box office performance in your IMDb Releases tab!`,
      date: dateInfo.fullDateText,
      read: false,
    };

    const updatedTimeline = [releaseTimelineEvent, ...(saveData.careerTimeline || [])];
    const updatedInbox = [releaseInboxMessage, ...saveData.inbox];

    addFameXp(releaseFame, `Theatrical Release: ${proj.movieTitle}`);
    addToast(
      'Success',
      `THEATRICAL RELEASE: ${proj.movieTitle}`,
      `Opened at $${(openingGross / 1000000).toFixed(1)}M across ${config.screens.toLocaleString()} screens! (${config.premiereType})`
    );

    // Publish Hollywood Insider Trade Article
    try {
      HollywoodInsiderService.onMovieReleased(newReleasedMovie.movieTitle, newReleasedMovie.studio || 'The studio', newReleasedMovie.budget || 0, saveData.player.dateWeek || 1, saveData.player.dateYear || 2026);
    } catch (e) {
      console.error('Error publishing Hollywood Insider release article:', e);
    }

    updateSave({
      ...saveData,
      player: updatedPlayer,
      bookedProjects: updatedBooked,
      releasedMovies: updatedReleased,
      careerTimeline: updatedTimeline,
      inbox: updatedInbox,
    });

    return {
      success: true,
      message: `Successfully released "${proj.movieTitle}"! Opening Weekend Gross: $${openingGross.toLocaleString()}.`,
    };
  };

  // Dating Profile Setup
  const setupDatingProfile = (gender: Gender, age: number, country: string, preference: 'Men' | 'Women' | 'Everyone') => {
    soundService.playClick();
    const updatedPlayer: Player = {
      ...saveData.player,
      datingProfile: {
        gender,
        age,
        country,
        preference,
        created: true,
      },
    };
    updateSave({
      ...saveData,
      player: updatedPlayer,
    });
  };

  // Interact with NPC (Interested or Pass)
  const interactNpc = (npcId: string, action: 'Interested' | 'Pass') => {
    soundService.playClick();

    if (action === 'Pass') {
      // Remove passed NPC and add new candidate
      const filtered = saveData.relationships.filter(n => n.id !== npcId);
      const newCandidate = generateNpcProfiles(1)[0];
      updateSave({
        ...saveData,
        relationships: [...filtered, newCandidate],
      });
      return;
    }

    // Interested -> Match attempt!
    const target = saveData.relationships.find(n => n.id === npcId);
    if (!target) return;

    const updatedRels = saveData.relationships.map(n => {
      if (n.id === npcId) {
        return {
          ...n,
          stage: 'Match' as const,
          relationshipLevel: 25,
        };
      }
      return n;
    });

    // Send match message to inbox
    const newInboxMsg: InboxMessage = {
      id: `msg_match_${Date.now()}`,
      category: 'RELATIONSHIPS',
      sender: target.name,
      senderRole: target.occupation,
      senderAvatar: target.avatar,
      subject: `It's a Match with ${target.name}!`,
      body: `Hey there! I saw your profile on Hollywood Dating and loved your passion for cinema. Let's get to know each other!`,
      date: `Week ${saveData.player.dateWeek}, ${saveData.player.dateYear}`,
      read: false,
    };

    updateSave({
      ...saveData,
      relationships: updatedRels,
      inbox: [newInboxMsg, ...saveData.inbox],
    });
  };

  // Send Gift to NPC
  const sendGiftToNpc = (npcId: string, gift: GiftItem) => {
    if (saveData.player.money < gift.price) {
      return { success: false, message: `You need $${gift.price.toLocaleString()} to purchase ${gift.name}.` };
    }

    soundService.playGoldChime();

    const updatedPlayer = {
      ...saveData.player,
      money: saveData.player.money - gift.price,
    };

    const updatedRels = saveData.relationships.map(rel => {
      if (rel.id === npcId) {
        const newLevel = Math.min(100, rel.relationshipLevel + gift.affinityBoost);
        // Gifts raise affinity ONLY — stage advancement goes exclusively
        // through RelationshipEngine.advanceStage (its gates check affinity,
        // trust, compatibility AND weeks). No more fake 'Match'/'Chatting'
        // stages corrupting the ladder.
        return {
          ...rel,
          relationshipLevel: newLevel,
        };
      }
      return rel;
    });

    const netState = NetworkService.loadState(updatedPlayer);
    if (!netState.bankAccount) {
      netState.bankAccount = { checkingBalance: updatedPlayer.money, transactionHistory: [] } as any;
    }
    if (!netState.bankAccount.transactionHistory) netState.bankAccount.transactionHistory = [];
    netState.bankAccount.transactionHistory.unshift({
      id: `tx_gift_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      description: `Gift: ${gift.name}`,
      amount: -gift.price,
      type: 'EXPENSE',
      category: 'PERSONAL',
      week: saveData.player.dateWeek || 1,
    });
    NetworkService.saveState(netState);

    updateSave({
      ...saveData,
      player: updatedPlayer,
      relationships: updatedRels,
    });

    return { success: true, message: `Sent ${gift.name}! Relationship boosted (+${gift.affinityBoost}).` };
  };

  // Propose Marriage
  const proposeMarriage = (
    venue: 'Church' | 'Beach' | 'Luxury Hotel' | 'Private Estate',
    ringValue: number,
    hasPrenup: boolean
  ) => {
    if (saveData.player.money < ringValue) {
      return { success: false, message: 'Not enough cash to purchase this engagement ring!' };
    }

    const partner = saveData.relationships.find(r => r.id === selectedNpcId);
    if (!partner) return { success: false, message: 'No partner selected.' };

    // Rules: Must have dated min 104 weeks (2 in-game years) or high affinity
    if (partner.weeksInCurrentStage < 50 && partner.relationshipLevel < 85) {
      return { success: false, message: 'You need to build a stronger relationship foundation before proposing!' };
    }

    soundService.playFanfare();

    const updatedPlayer: Player = {
      ...saveData.player,
      money: saveData.player.money - ringValue,
      activeRelationshipId: partner.id,
      weddingVenue: venue,
      engagementRingValue: ringValue,
      hasPrenup,
    };

    const updatedRels = saveData.relationships.map(r => {
      if (r.id === partner.id) {
        return {
          ...r,
          stage: 'Married' as const,
          relationshipLevel: 100,
        };
      }
      return r;
    });

    const newInboxMsg: InboxMessage = {
      id: `msg_wedding_${Date.now()}`,
      category: 'RELATIONSHIPS',
      sender: partner.name,
      senderRole: 'Spouse',
      senderAvatar: partner.avatar,
      subject: `MARRIED AT ${venue.toUpperCase()}!`,
      body: `Today we officially tied the knot at the ${venue}! Thank you for making our wedding day unforgettable.`,
      date: `Week ${saveData.player.dateWeek}, ${saveData.player.dateYear}`,
      read: false,
    };

    const netState = NetworkService.loadState(updatedPlayer);
    if (!netState.bankAccount) {
      netState.bankAccount = { checkingBalance: updatedPlayer.money, transactionHistory: [] } as any;
    }
    if (!netState.bankAccount.transactionHistory) netState.bankAccount.transactionHistory = [];
    netState.bankAccount.transactionHistory.unshift({
      id: `tx_ring_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      description: `Engagement Ring Purchase`,
      amount: -ringValue,
      type: 'EXPENSE',
      category: 'PERSONAL',
      week: saveData.player.dateWeek || 1,
    });
    NetworkService.saveState(netState);

    updateSave({
      ...saveData,
      player: updatedPlayer,
      relationships: updatedRels,
      inbox: [newInboxMsg, ...saveData.inbox],
    });

    return { success: true, message: `Congratulations! You are officially married to ${partner.name}!` };
  };

  // Have Child
  const haveChild = (schoolType: 'Public School' | 'Private School' | 'Boarding School' | 'University') => {
    soundService.playFanfare();

    const currentChildCount = saveData.player.childrenCount || 0;
    const updatedPlayer: Player = {
      ...saveData.player,
      childrenCount: currentChildCount + 1,
      childrenSchoolType: schoolType,
    };

    const newInboxMsg: InboxMessage = {
      id: `msg_child_${Date.now()}`,
      category: 'RELATIONSHIPS',
      sender: 'Hollywood Family Hospital',
      senderRole: 'Family Department',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      subject: 'WELCOME TO THE FAMILY!',
      body: `Congratulations on the birth of your child! Enrolled in ${schoolType}.`,
      date: `Week ${saveData.player.dateWeek}, ${saveData.player.dateYear}`,
      read: false,
    };

    updateSave({
      ...saveData,
      player: updatedPlayer,
      inbox: [newInboxMsg, ...saveData.inbox],
    });

    return { success: true, message: `Congratulations! Welcomed a new child into your Hollywood family!` };
  };

  // Inbox management
  const markMessageRead = (messageId: string) => {
    const updatedInbox = saveData.inbox.map(m => (m.id === messageId ? { ...m, read: true } : m));
    updateSave({ ...saveData, inbox: updatedInbox });
  };

  const markAllMessagesRead = (category?: string) => {
    soundService.playClick();
    const updatedInbox = saveData.inbox.map(m => {
      if (!category || category === 'ALL' || m.category === category) {
        return { ...m, read: true };
      }
      return m;
    });
    updateSave({ ...saveData, inbox: updatedInbox });
  };

  const deleteMessage = (messageId: string) => {
    soundService.playClick();
    const updatedInbox = saveData.inbox.filter(m => m.id !== messageId);
    updateSave({ ...saveData, inbox: updatedInbox });
  };

  const archiveMessage = (messageId: string) => {
    soundService.playClick();
    const updatedInbox = saveData.inbox.map(m => (m.id === messageId ? { ...m, archived: !m.archived } : m));
    updateSave({ ...saveData, inbox: updatedInbox });
  };

  // Settings updates
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    soundService.playClick();
    const updated = { ...saveData.settings, ...newSettings };
    updateSave({ ...saveData, settings: updated });
  };

  // Manual save
  const manualSave = () => {
    soundService.playGoldChime();
    StorageService.saveGameData(saveData, activeSlot);
    addToast('Information', 'Game Saved', 'Your Hollywood career progress has been saved.');
  };

  // Reset current slot
  const resetGame = () => {
    soundService.playClick();
    const fresh = StorageService.resetSaveData(activeSlot);
    setSaveData(fresh);
    setCurrentScreen('main_menu');
    setActiveModal('none');
  };

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        activeMainTab,
        setActiveMainTab,
        activeModal,
        setActiveModal,
        openNotificationCenter,
        isProcessingWeek,
        lastWeeklyRecap,
        selectedNpcId,
        setSelectedNpcId,
        saveData,
        player: saveData.player,
        callboard: saveData.callboard,
        auditions: saveData.auditions,
        bookedProjects: saveData.bookedProjects,
        releasedMovies: saveData.releasedMovies,
        inbox: saveData.inbox,
        relationships: saveData.relationships,
        settings: saveData.settings,
        trophies: saveData.trophies || [],
        awardHistory: saveData.awardHistory || [],
        careerTimeline: saveData.careerTimeline || [],
        selectedFycMovieId,
        setSelectedFycMovieId,
        awardCeremonyData,
        setAwardCeremonyData,
        taxStatementData,
        setTaxStatementData,
        launchFycCampaign,
        addTimelineEvent,
        enrollInCourse,
        updatePlayer,
        signAgentContract,
        hireManager,
        terminateRepresentation,
        createNewCharacter,
        applyToCallboard,
        advanceWeek,
        boostProduction,
        joinSAGMembership,
        releaseMovie,
        setupDatingProfile,
        interactNpc,
        sendGiftToNpc,
        proposeMarriage,
        haveChild,
        markMessageRead,
        markAllMessagesRead,
        deleteMessage,
        archiveMessage,
        switchSaveSlot,
        changeTheme,
        updateSettings,
        updateSave,
        persistNow,
        resetGame,
        manualSave,
        addFameXp,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
