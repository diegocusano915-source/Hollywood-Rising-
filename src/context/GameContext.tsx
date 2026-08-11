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
import { formatCalendarDate } from '../utils/calendar';
import {
  StorageService,
  DEFAULT_PLAYER,
  generateCallboardProjects,
  validateAndEnforceCallboardRoster,
  generateNpcProfiles,
  GIFT_ITEMS,
} from '../database/storageService';
import { generateWeeklyCourses, ACTING_COURSES_POOL } from '../database/actingSchoolDatabase';
import { soundService } from '../services/soundService';
import { EmpireService } from '../services/empireService';
import { getAgentById, getManagerById } from '../database/representationDatabase';
import { scheduleTvInterview, processTvOffersWeekly, scheduleRadioInterview, processRadioOffersWeekly } from '../services/tvInterviewEngine';
import { RepresentationService } from '../services/representationService';
import { LivingWorldService } from '../services/livingWorldService';
import { SocialsService, processSocialHubWeek } from '../services/socialsService';
import { ToastMessage, ToastCategory } from '../components/common/ToastContainer';
import { MarketEngineService } from '../services/marketEngineService';
import { NetworkService } from '../services/networkService';
import { BoxOfficeEngineService } from '../services/boxOfficeEngineService';
import { RoyaltyEngineService } from '../services/royaltyService';
import { AwardsService } from '../services/awardsService';
import { AwardCeremonyResult } from '../types/game';
import { FameService } from '../services/fameService';
import { HollywoodInsiderService } from '../services/hollywoodInsiderService';
import { notificationService } from '../services/notificationService';
import { ActiveJob, TransactionRecord } from '../types/network';


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
  | 'award_ceremony';

interface GameContextType {
  // Navigation & Main Tabs
  currentScreen: 'splash' | 'main_menu' | 'character_creation' | 'game_home';
  setCurrentScreen: (screen: 'splash' | 'main_menu' | 'character_creation' | 'game_home') => void;
  activeMainTab: MainTab;
  setActiveMainTab: (tab: MainTab) => void;

  // Active Modal & Processing
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
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
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'main_menu' | 'character_creation' | 'game_home'>('splash');
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('HOME');
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [isProcessingWeek, setIsProcessingWeek] = useState<boolean>(false);
  const [lastWeeklyRecap, setLastWeeklyRecap] = useState<WeeklyRecapData | null>(null);
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const [selectedFycMovieId, setSelectedFycMovieId] = useState<string | null>(null);
  const [awardCeremonyData, setAwardCeremonyData] = useState<AwardCeremonyResult | null>(null);

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

    setSaveData((prevSave) => {
      const currentXp = prevSave.player.fameXp || 0;
      const oldLevelInfo = FameService.getFameLevelDetails(currentXp);
      const newXp = currentXp + amount;
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
        addToast('Information', `+${amount} Fame XP`, reason);
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

  // Update sound & music settings and schedule re-engagement notifications
  useEffect(() => {
    soundService.setSoundEnabled(saveData.settings.soundEnabled !== false);
    soundService.setMusicEnabled(saveData.settings.musicEnabled !== false);
    notificationService.scheduleAwayNotifications(saveData.player);
  }, [saveData.settings.soundEnabled, saveData.settings.musicEnabled, saveData.player]);

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
    if (!proj) return { success: false, message: 'Project not found.' };

    if (saveData.player.energy < 20) {
      return { success: false, message: 'Not enough energy! You need 20 Energy to apply.' };
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
    const empireResult = EmpireService.processEndWeek(p);
    const repResult = RepresentationService.processEndWeek(p, saveData.bookedProjects, saveData.releasedMovies);
    const socialsResult = SocialsService.processEndWeek(p, saveData);

    // SOCIAL MEDIA HUB WEEKLY PROCESSING (premium, writers, algorithm, creator studio)
    try {
      const hubState = SocialsService.getState();
      const hubResult = processSocialHubWeek(hubState, p, saveData);
      if (hubResult.moneyDelta > 0) p.money = (p.money || 0) + hubResult.moneyDelta;
      if (hubResult.messages.length > 0) {
        socialReputation.push(...hubResult.messages);
      }
      SocialsService.saveState(hubState);
    } catch (e) {
      console.error('Error processing social hub week:', e);
    }
    const livingWorldResult = LivingWorldService.advanceWorldWeek(newWeek, newYear, p);

    if (socialsResult.socialPosts) socialPosts.push(...socialsResult.socialPosts);
    if (socialsResult.socialTrending) socialTrending.push(...socialsResult.socialTrending);
    if (socialsResult.socialReputation) socialReputation.push(...socialsResult.socialReputation);

    fansGainedThisWeek = socialsResult.fanGrowth || 0;
    prRetainerExpensesThisWeek = repResult.prWeeklyCost || 0;
    legalRetainerExpensesThisWeek = repResult.lawWeeklyCost || 0;
    writerExpensesThisWeek = socialsResult.writerWeeklyCost || 0;
    sponsorshipIncomeThisWeek = socialsResult.weeklySponsorshipIncome || 0;
    endorsementIncomeThisWeek = repResult.weeklyEarnings || 0;
    socialYoutubeIncomeThisWeek = socialsResult.youtubeRevenue || 0;

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

    // ACHIEVEMENT REWARDS: cash + XP paid directly (no more swallowed rewards)
    if ((empireResult as any).achievementsCash > 0) {
      p.money = (p.money || 0) + (empireResult as any).achievementsCash;
      empireBusinesses.push(`🏆 ACHIEVEMENT REWARDS: +$${(empireResult as any).achievementsCash.toLocaleString()} cash & +${(empireResult as any).achievementsXp} Fame XP`);
    }
    const activeBusinesses = (empireResult.updatedState?.businesses || []).filter(b => b.status === 'Active' || b.status === 'Distressed');
    if (activeBusinesses.length > 0) {
      businessIncomeThisWeek = empireResult.weeklyCashYield || 0;
    } else {
      businessIncomeThisWeek = 0;
    }
    if (empireResult.logMessages && empireResult.logMessages.length > 0) {
      empireBusinesses.push(...empireResult.logMessages);
    }

    if (repResult.notifications && repResult.notifications.length > 0) {
      repPr.push(...repResult.notifications);
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

          careerTraining.push(`GRADUATED: ${course.name} (+${course.talentReward.amount} ${talentCategory.toUpperCase()})`);

          newInboxMessages.unshift({
            id: `msg_course_done_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'TUTORIAL',
            sender: 'Acting Conservatory',
            senderRole: 'Dean of Studies',
            senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
            subject: `COURSE GRADUATION: ${course.name}`,
            body: `Congratulations! You have completed "${course.name}" taught by ${course.teacher}.\n\nYour ${talentCategory.toUpperCase()} talent increased by +${course.talentReward.amount}! Current level: ${newTalentVal}/100.`,
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
      availableSchoolCourses: generateWeeklyCourses(completedCourseIds),
    };

    // 5. Process Auditions
    const remainingAuditions: AuditionApplication[] = [];
    const newBookings: BookedProject[] = [...saveData.bookedProjects];
    const newTimelineEvents: TimelineEvent[] = [];

    saveData.auditions.forEach(aud => {
      const nextWeeks = aud.weeksRemaining - 1;
      if (nextWeeks <= 0) {
        const avgTalent = (p.talents.acting + p.talents.voice + p.talents.comedy + p.talents.drama + p.talents.action + p.talents.dancing) / 6;
        let score = p.talents.acting * 0.4 + avgTalent * 0.35 + (p.fameXp / 100);
        if (p.isUnionMember) score += 15;
        score += p.leadRolesCount * 5;
        if (p.representation?.agent?.signed) score += 12;
        if (aud.agentPitched) score += 15; // Agent-submitted auditions carry agency weight
        if (RepresentationService.hasActiveCriticalScandal()) score -= 25; // Active CRITICAL scandal hurts casting

        let requiredScore = 15;
        if (aud.roleType === 'Lead') requiredScore = 40;
        else if (aud.roleType === 'Principal') requiredScore = 28;
        else if (aud.roleType === 'Support') requiredScore = 20;

        const isAccepted = (score + Math.random() * 20) >= requiredScore;
        const studioName = aud.studio || 'Paramount Pictures';
        const directorName = aud.director || 'Denis Villeneuve';

        if (isAccepted) {
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

          newBookings.push({
            id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            projectId: aud.projectId,
            movieTitle: aud.movieTitle,
            posterUrl: aud.posterUrl,
            roleType: aud.roleType,
            salary: aud.salary,
            totalFilmingWeeks: aud.filmingWeeks,
            weeksRemaining: aud.filmingWeeks,
            isFilmingComplete: false,
            studio: studioName,
            director: directorName,
            agentPitched: aud.agentPitched,
          });

          newTimelineEvents.push({
            id: `tl_role_acc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            year: newYear,
            week: newWeek,
            category: 'ROLE',
            title: `Role Accepted: ${aud.movieTitle}`,
            description: `Cast as ${aud.roleType} in "${aud.movieTitle}" under ${studioName}. Contract value: $${aud.salary.toLocaleString()}.`,
          });
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

          const openingGross = Math.max(1500000, Math.floor(
            (baseBudget * 0.16 * performanceMultiplier) + (hype * 8000 * (starRatingPct / 100)) + fameBonus
          ));
          const domesticGross = Math.floor(openingGross * (2.1 + Math.random() * 0.6));
          const worldwideGross = Math.floor(domesticGross * (1.7 + Math.random() * 0.9));

          const audienceRating = Math.min(100, Math.max(25, Math.floor(35 + (actingTalent * 0.4) + (starRatingPct * 0.25) + Math.random() * 10)));
          const criticRating = Math.min(100, Math.max(20, Math.floor(30 + (dramaTalent * 0.45) + (starRatingPct * 0.25) + Math.random() * 12)));

          const releaseFame = book.roleType === 'Lead' ? 45 : book.roleType === 'Principal' ? 32 : 20;
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
            sequelOffered: false,
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
          careerTraining.push(`🌟 +${releaseFame} Fame XP - Theatrical Release of '${book.movieTitle}'`);

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
            HollywoodInsiderService.onMovieReleased(newReleasedMovie, p, true);
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

    // Trigger Hollywood Insider weekly trade news tick
    try {
      HollywoodInsiderService.processWeeklyNewsTick(newWeek, newYear, p);
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
        // Apply fame and awards to player
        p.fameXp = awardsResult.updatedPlayer.fameXp;
        p.awardsWon = awardsResult.updatedPlayer.awardsWon;
        fameGainedThisWeek += awardsResult.fameGained;
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
        const nextInCinemas = nextWeeks >= 20 ? false : (chartItem.inTheaters ?? movie.inCinemas);

        const currentWorldwide = movie.worldwideGross || movie.boxOfficeGross || 0;
        const currentDomestic = movie.domesticGross || 0;
        const chartWorldwide = chartItem.worldwideGross || 0;
        const chartDomestic = chartItem.domesticGross || 0;

        // Cap movie lifetime gross at $5 Billion
        const MAX_CAP = 5000000000;
        const finalWorldwide = Math.min(MAX_CAP, Math.max(currentWorldwide, chartWorldwide));
        const finalDomestic = Math.min(MAX_CAP * 0.45, Math.max(currentDomestic, chartDomestic));
        const finalInternational = Math.max(0, finalWorldwide - finalDomestic);

        // If movie completes its 15th week in cinemas, send official theatrical conclusion report to Inbox!
        if (nextWeeks >= 15 && movie.inCinemas) {
          newInboxMessages.unshift({
            id: `msg_theatrical_end_${movie.id}_${Date.now()}`,
            category: 'CAREER',
            sender: `${movie.studio || 'Studio'} Distribution`,
            senderRole: 'VP Theatrical Distribution',
            senderAvatar: movie.posterUrl,
            subject: `THEATRICAL RUN CONCLUDED: "${movie.movieTitle}"`,
            body: `THEATRICAL RUN CONCLUSION REPORT\n\nMovie: "${movie.movieTitle}"\nRole: ${movie.roleType}\n\nAfter a long run of 15 weeks in cinemas, "${movie.movieTitle}" has officially concluded its theatrical exhibition run!\n\nFINAL BOX OFFICE TOTALS:\n• Lifetime Worldwide Gross: $${(finalWorldwide / 1000000).toFixed(1)}M\n• Domestic Box Office: $${(finalDomestic / 1000000).toFixed(1)}M\n• International Box Office: $${(finalInternational / 1000000).toFixed(1)}M\n• Final Rotten Tomatoes Rating: ${movie.audienceRating}%\n\nThe feature has now transitioned into permanent home streaming, digital licensing, and syndication catalogs. Weekly residuals and streaming royalties will continue to accrue automatically in your IMDb Releases tab!`,
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

      const fallbackWeeks = movie.weeksInCinemas + 1;
      const fallbackGross = movie.worldwideGross || movie.boxOfficeGross || 0;
      return {
        ...movie,
        weeksInCinemas: fallbackWeeks,
        inCinemas: fallbackWeeks >= 20 ? false : movie.inCinemas,
        worldwideGross: fallbackGross,
        boxOfficeGross: fallbackGross,
        sequelCheckWeeks: movie.sequelCheckWeeks,
      };
    });

    // 7c. SEQUEL & RENEWAL GREENLIGHT TRACKER — weekly check while the movie is in the box
    // office AND up to 20 weeks after (even after it leaves theaters). No instant greenlight.
    // Studio offers when the target is met. If a Manager is signed, the Manager negotiates
    // better terms with the studio and sends the full offer to your Inbox.
    const finalReleasedMovies = updatedReleasedMovies.map((movie) => {
      const isTv = movie.isTvSeries || movie.category === 'TV Series';
      const currentPart = movie.franchisePart || 1;
      const currentSeason = movie.tvSeason || 1;
      const maxPart = movie.isFranchise ? 5 : 1;
      const maxSeason = (movie as any).maxTvSeason || 15;
      if (movie.sequelOffered) return movie;
      if (!isTv && movie.roleType !== 'Lead' && movie.roleType !== 'Principal') return movie;
      if (!isTv && currentPart >= maxPart) return movie;
      if (isTv && currentSeason >= maxSeason) return movie;

      const checks = (movie.sequelCheckWeeks || 0) + 1;
      if (checks > 20) return movie; // greenlight decision window closed

      const baseBudget = movie.budget || 1500000;
      const targetMet =
        (movie.audienceRating || 0) >= 60 && (movie.worldwideGross || 0) > baseBudget * 1.8;
      if (!targetMet) return { ...movie, sequelCheckWeeks: checks };

      // TARGET MET — GREENLIGHT TIME (studio offer, or manager-negotiated offer)
      const managerSigned = !!p.representation?.manager?.signed;
      const managerName = p.representation?.manager?.name || 'Your Manager';
      const managerCompany = p.representation?.manager?.company || '';

      if (isTv) {
        const nextSeason = currentSeason + 1;
        const studioSalary = Math.floor((movie.playerEarnings || 2500000) * 1.35);
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
            ? `YOUR MANAGER CLOSED THE DEAL\n\nAfter "${movie.movieTitle}" met its renewal target (${movie.audienceRating}% audience rating, $${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M gross), ${managerName} (${managerCompany}) negotiated directly with ${movie.studio || 'the network'}.\n\nNEGOTIATED RENEWAL TERMS:\n• Next Season Salary: $${salary.toLocaleString()}\n• Backend: ${renewedProject.backendPercent}% | Profit Share: ${renewedProject.profitSharePercent}%\n\nReview the full agreement in your Production Hub — accept, reject, or negotiate further.`
            : `CONGRATULATIONS!\n\nDue to stellar viewership (${movie.audienceRating}% audience rating), the network has officially renewed "${movie.parentMovieTitle || movie.movieTitle}" for Season ${nextSeason}!\n\nRENEWAL CONTRACT OFFER:\n• Next Season Salary: $${salary.toLocaleString()} (+35% pay raise)\n• Residual Payouts & Syndication bonus included.\n\nOpen your Production Hub to review and accept the renewal contract!`,
          date: dateInfo.fullDateText,
          read: false,
        });
        newTimelineEvents.push({
          id: `tl_renew_${Date.now()}`,
          year: newYear,
          week: newWeek,
          category: 'RELEASE',
          title: `${movie.movieTitle} renewed for Season ${nextSeason}`,
          description: `${movie.movieTitle} met its renewal target and was greenlit for Season ${nextSeason}.${managerSigned ? ` Negotiated by ${managerName}.` : ''}`,
        });
        return { ...movie, sequelOffered: true, sequelOfferedPart: nextSeason, sequelCheckWeeks: checks };
      }

      // MOVIE FRANCHISE SEQUEL
      const nextPart = currentPart + 1;
      const subtitle = nextPart === 2 ? 'The Sequel' : nextPart === 3 ? 'Trilogy Climax' : nextPart === 4 ? 'Resurgence' : 'The Grand Finale';
      const nextFranchiseTitle = `${movie.parentMovieTitle || movie.movieTitle} (Part ${nextPart}: ${subtitle})`;
      const nextBudget = Math.floor(baseBudget * 1.4);
      const studioSalary = Math.floor((movie.playerEarnings || 2000000) * 1.5);
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
          ? `YOUR MANAGER CLOSED THE DEAL\n\nAfter "${movie.movieTitle}" met its greenlight target ($${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M gross vs $${(baseBudget * 1.8 / 1000000).toFixed(1)}M target), ${managerName} (${managerCompany}) negotiated directly with ${movie.studio || 'the studio'}.\n\nNEGOTIATED TERMS:\n• Production Budget: $${(nextBudget / 1000000).toFixed(1)}M\n• Salary: $${salary.toLocaleString()} (+25% over standard studio offer)\n• Backend: ${sequelProject.backendPercent}% | Profit Share: ${sequelProject.profitSharePercent}%\n• Box Office Bonus: $${sequelProject.boxOfficeBonus.toLocaleString()}\n\nReview the full agreement in your Production Hub — accept, reject, or negotiate further.`
          : `BREAKING STUDIO GREENLIGHT!\n\nAfter "${movie.movieTitle}" met its greenlight target ($${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M worldwide gross, ${movie.audienceRating}% audience rating), ${movie.studio || 'the studio'} has officially greenlit Part ${nextPart} of the franchise!\n\nSEQUEL DEAL OFFER:\n• Production Budget: $${(nextBudget / 1000000).toFixed(1)}M\n• Upfront Lead Salary: $${salary.toLocaleString()} (+50% raise)\n• Backend Profit Share: ${sequelProject.profitSharePercent}%\n\nVisit your Production Hub to review and accept the sequel agreement!`,
        date: dateInfo.fullDateText,
        read: false,
      });
      newTimelineEvents.push({
        id: `tl_sequel_${Date.now()}`,
        year: newYear,
        week: newWeek,
        category: 'RELEASE',
        title: `Sequel Greenlit: ${nextFranchiseTitle}`,
        description: `"${movie.movieTitle}" met its greenlight target ($${((movie.worldwideGross || 0) / 1000000).toFixed(1)}M gross) and Part ${nextPart} was greenlit.${managerSigned ? ` Negotiated by ${managerName}.` : ''}`,
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

      // TV/Radio interview booked every 6 weeks — now SCHEDULED via engine (countdown + inbox prep)
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
        const fee = Math.floor(2000 + (p.fameXp || 0) * 2);
        const fameGain = Math.floor(15 + (p.fameXp || 0) * 0.02);
        const fanGain = Math.floor(200 + (p.fans || 0) * 0.002);
        mgrActivity.push(`🎙️ Booked a TV/Radio interview — fee $${fee.toLocaleString()} paid, +${fameGain} XP, +${fanGain.toLocaleString()} fans`);
        p.money = (p.money || 0) + fee;
        p.fameXp = (p.fameXp || 0) + fameGain;
        p.fans = (p.fans || 0) + fanGain;
        fameGainedThisWeek += fameGain;
        newInboxMessages.unshift({
          id: `msg_mgr_interview_${Date.now()}`,
          category: 'CAREER',
          sender: signedMgr.name,
          senderRole: signedMgr.company,
          senderAvatar: signedMgr.avatarUrl,
          subject: '🎙️ INTERVIEW BOOKED BY YOUR MANAGER',
          body: `Your manager ${signedMgr.name} (${signedMgr.company}) booked you on a major TV/Radio interview this week.\n\n• Appearance Fee: $${fee.toLocaleString()} (deposited)\n• Fame: +${fameGain} XP\n• Fans: +${fanGain.toLocaleString()}\n\n${signedMgr.name} continues to build your public profile.`,
          date: dateInfo.fullDateText,
          read: false,
        });
        newTimelineEvents.push({
          id: `tl_mgr_interview_${Date.now()}`,
          year: newYear,
          week: newWeek,
          category: 'MILESTONE',
          title: `Interview Booked: ${signedMgr.name}`,
          description: `Your manager booked a TV/Radio interview (+$${fee.toLocaleString()} fee, +${fanGain.toLocaleString()} fans).`,
        });
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

    // 8. Refill & Age Callboard (NPC Actor Competition & Mandatory Failsafe Role Guarantee)
    const remainingCallboard: CallboardProject[] = [];
    saveData.callboard.forEach(project => {
      const remainingWeeks = (project.decisionTimeWeeks || 3) - 1;
      // 15% chance per week for older projects to be filled by competing NPC actors
      const npcClaimed = remainingWeeks <= 0 || (Math.random() < 0.15 && remainingWeeks <= 2);
      if (npcClaimed) {
        // ONLY notify when the player ACTUALLY APPLIED to THIS EXACT listing (strict projectId match).
        // Title matching is banned: recycled titles from the endless pool would spam fake messages.
        const playerAppliedToThisListing =
          saveData.auditions.some(a => a.projectId === project.id) ||
          saveData.bookedProjects.some(b => b.projectId === project.id);

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

    // 9. Relationships
    const updatedRelationships = saveData.relationships.map(rel => {
      if (rel.stage !== 'Stranger') {
        return {
          ...rel,
          weeksInCurrentStage: rel.weeksInCurrentStage + 1,
        };
      }
      return rel;
    });

    // Invisible Market Engine Weekly Processing
    const marketResult = MarketEngineService.processEndWeek(newWeek, newYear, p.money);
    if (marketResult && marketResult.headlineNews && marketResult.headlineNews.length > 0) {
      worldNews.push(...marketResult.headlineNews);
    }

    const updatedInbox = [...newInboxMessages, ...saveData.inbox];

    // ------------------------------------------------------------------
    // FINAL CENTRALIZED LEDGER SUMMATION & SINGLE SOURCE OF TRUTH UPDATES
    // ------------------------------------------------------------------
    const fanClubDuesIncomeThisWeek = (repResult as any).fanClubDues || 0;
    const merchProfitIncomeThisWeek = (repResult as any).merchProfit || 0;

    const posBusinessIncome = businessIncomeThisWeek > 0 ? businessIncomeThisWeek : 0;
    const negBusinessLoss = businessIncomeThisWeek < 0 ? Math.abs(businessIncomeThisWeek) : 0;

    const totalWeeklyIncome =
      salaryEarnedThisWeek +
      royaltiesEarnedThisWeek +
      posBusinessIncome +
      propertyIncomeThisWeek +
      sponsorshipIncomeThisWeek +
      endorsementIncomeThisWeek +
      socialYoutubeIncomeThisWeek +
      savingsInterestThisWeek +
      fanClubDuesIncomeThisWeek +
      merchProfitIncomeThisWeek;

    // Calculate real mid-week expenses incurred from transaction history during current week
    const midWeekExpensesThisWeek = (networkState.bankAccount?.transactionHistory || [])
      .filter((tx) => tx.type === 'EXPENSE' && tx.week === p.dateWeek)
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

    const endOfWeekExpensesThisWeek =
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

    const netWeeklyChange = totalWeeklyIncome - endOfWeekExpensesThisWeek;

    // Apply exact single-source-of-truth values to Player
    p.money = Math.max(0, startMoney + netWeeklyChange);
    p.fans = startFans + fansGainedThisWeek;
    p.fameXp = startFame + fameGainedThisWeek;

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
        taxes: 0,
        netWeeklyChange,
      },
      social: {
        followersGained: fansGainedThisWeek,
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
      releaseWeek: saveData.player.dateWeek + (config.releaseWeekOffset || 0),
      releaseYear: saveData.player.dateYear,
    };

    // Remove from active bookedProjects
    const updatedBooked = saveData.bookedProjects.filter((b) => b.id !== projectId);

    // Add to releasedMovies
    const updatedReleased = [newReleasedMovie, ...(saveData.releasedMovies || [])];

    // Award Fame XP - balanced (halved)
    const releaseFame = proj.roleType === 'Lead' ? 35 : proj.roleType === 'Principal' ? 28 : 18;

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
      HollywoodInsiderService.onMovieReleased(newReleasedMovie, saveData.player, true);
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
        let newStage = rel.stage;

        // Stage progression rules:
        // Match -> Chatting (level >= 30)
        // Chatting -> Dating (level >= 50)
        // Dating -> Exclusive (level >= 75)
        if (rel.stage === 'Match' && newLevel >= 30) newStage = 'Chatting';
        else if (rel.stage === 'Chatting' && newLevel >= 50) newStage = 'Dating';
        else if (rel.stage === 'Dating' && newLevel >= 75) newStage = 'Exclusive';

        return {
          ...rel,
          relationshipLevel: newLevel,
          stage: newStage,
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
