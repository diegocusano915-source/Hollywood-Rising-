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
} from '../types/game';
import {
  StorageService,
  DEFAULT_PLAYER,
  generateCallboardProjects,
  generateNpcProfiles,
  GIFT_ITEMS,
} from '../database/storageService';
import { generateWeeklyCourses, ACTING_COURSES_POOL } from '../database/actingSchoolDatabase';
import { soundService } from '../services/soundService';

type MainTab = 'HOME' | 'TALENT' | 'WORLD' | 'NETWORK' | 'EMPIRE' | 'REPRESENTATION';

type ModalType =
  | 'none'
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
  | 'gift_store'
  | 'marriage_planner';

interface GameContextType {
  // Navigation & Main Tabs
  currentScreen: 'splash' | 'main_menu' | 'character_creation' | 'game_home';
  setCurrentScreen: (screen: 'splash' | 'main_menu' | 'character_creation' | 'game_home') => void;
  activeMainTab: MainTab;
  setActiveMainTab: (tab: MainTab) => void;

  // Active Modal
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;

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

  // Phase 2 Acting School & Representation Actions
  enrollInCourse: (courseId: string) => { success: boolean; message: string };
  signAgentContract: (agent: AgentInfo) => { success: boolean; message: string };

  // Core Actions
  createNewCharacter: (
    firstName: string,
    lastName: string,
    gender: Gender,
    age: number,
    country: string,
    personality: Personality
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

  // Settings & Slots
  switchSaveSlot: (slot: 1 | 2 | 3) => void;
  changeTheme: (theme: ThemeOption) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetGame: () => void;
  manualSave: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSlot, setActiveSlot] = useState<1 | 2 | 3>(1);
  const [saveData, setSaveData] = useState<SaveData>(() => StorageService.loadSaveData(1));
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'main_menu' | 'character_creation' | 'game_home'>('splash');
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('HOME');
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);

  // Auto-save helper
  const updateSave = useCallback((newSaveData: SaveData) => {
    setSaveData(newSaveData);
    StorageService.saveGameData(newSaveData, newSaveData.slotNumber);
  }, []);

  // Update sound settings
  useEffect(() => {
    soundService.setSoundEnabled(saveData.settings.soundEnabled);
  }, [saveData.settings.soundEnabled]);

  // Switch Save Slot
  const switchSaveSlot = (slot: 1 | 2 | 3) => {
    soundService.playClick();
    setActiveSlot(slot);
    const loaded = StorageService.loadSaveData(slot);
    setSaveData(loaded);
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
    personality: Personality
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
    };

    const updatedAuditions = [newAudition, ...saveData.auditions];

    updateSave({
      ...saveData,
      player: updatedPlayer,
      callboard: updatedCallboard,
      auditions: updatedAuditions,
    });

    return {
      success: true,
      message: `Applied for ${proj.roleType} role in "${proj.title}"! Moved to Auditions.`,
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

    const updatedPlayer: Player = {
      ...saveData.player,
      representation: {
        ...saveData.player.representation,
        agent: {
          ...agent,
          signed: true,
        },
      },
    };

    const newInboxMsg: InboxMessage = {
      id: `msg_agent_signed_${Date.now()}`,
      category: 'BUSINESS',
      sender: agent.name,
      senderRole: `${agent.agencyName} Senior Partner`,
      senderAvatar: agent.avatarUrl,
      subject: `WELCOME TO ${agent.agencyName.toUpperCase()}!`,
      body: `It is an honor to represent you in Hollywood. We take a ${agent.commissionPercent}% commission on booked contracts and will pitch you for high-profile film auditions.`,
      date: `Week ${saveData.player.dateWeek}, ${saveData.player.dateYear}`,
      read: false,
    };

    updateSave({
      ...saveData,
      player: updatedPlayer,
      inbox: [newInboxMsg, ...saveData.inbox],
    });

    return {
      success: true,
      message: `Signed exclusive representation contract with ${agent.name} at ${agent.agencyName}!`,
    };
  };

  // ADVANCE WEEK - Core Loop Progression
  const advanceWeek = () => {
    soundService.playGoldChime();

    let p = { ...saveData.player };

    // Ensure talents object exists
    if (!p.talents) {
      p.talents = { acting: 0, voice: 0, comedy: 0, drama: 0, action: 0, dancing: 0 };
    } else {
      p.talents = { ...p.talents };
    }

    // 1. Advance date
    let newWeek = p.dateWeek + 1;
    let newYear = p.dateYear;
    if (newWeek > 52) {
      newWeek = 1;
      newYear += 1;
    }

    // 2. Recharge Energy to 100
    let currentEnergy = p.maxEnergy;

    // 3. Rent & Living Expenses ($150 per week)
    const livingExpense = 150;
    let newMoney = Math.max(0, p.money - livingExpense);

    const newInboxMessages: InboxMessage[] = [];

    // 4. Process Active Acting School Courses (Weekly Energy Deduction & Completion)
    const activeCourses = p.activeCourses || [];
    const remainingActiveCourses: ActiveCourse[] = [];
    const completedCourseIds = p.completedCourseIds ? [...p.completedCourseIds] : [];
    const completedCourseRecords = p.completedCourseRecords ? [...p.completedCourseRecords] : [];

    activeCourses.forEach(course => {
      // Check if player has energy for this course's weekly energy cost
      if (currentEnergy >= course.weeklyEnergyCost) {
        currentEnergy -= course.weeklyEnergyCost;
        const updatedWeeks = course.weeksCompleted + 1;

        if (updatedWeeks >= course.totalWeeks) {
          // COURSE GRADUATION!
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

          newInboxMessages.unshift({
            id: `msg_course_done_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'TUTORIAL',
            sender: 'Acting Conservatory',
            senderRole: 'Dean of Studies',
            senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
            subject: `COURSE GRADUATION: ${course.name}`,
            body: `Congratulations! You have completed "${course.name}" taught by ${course.teacher}.\n\nYour ${talentCategory.toUpperCase()} talent increased by +${course.talentReward.amount}! Current level: ${newTalentVal}/100.`,
            date: `Week ${newWeek}, ${newYear}`,
            read: false,
          });
        } else {
          remainingActiveCourses.push({
            ...course,
            weeksCompleted: updatedWeeks,
            isPaused: false,
          });
        }
      } else {
        // Insufficient weekly energy -> Pause course for this week
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
          date: `Week ${newWeek}, ${newYear}`,
          read: false,
        });
      }
    });

    p = {
      ...p,
      dateWeek: newWeek,
      dateYear: newYear,
      money: newMoney,
      energy: currentEnergy,
      activeCourses: remainingActiveCourses,
      completedCourseIds,
      completedCourseRecords,
      availableSchoolCourses: generateWeeklyCourses(completedCourseIds),
    };

    // 5. Process Audition Countdown with Talent-based Evaluation
    const remainingAuditions: AuditionApplication[] = [];
    const newBookings: BookedProject[] = [...saveData.bookedProjects];

    saveData.auditions.forEach(aud => {
      const nextWeeks = aud.weeksRemaining - 1;
      if (nextWeeks <= 0) {
        // Decision Time! Evaluate based on player's 6 Talents & attributes
        const avgTalent = (p.talents.acting + p.talents.voice + p.talents.comedy + p.talents.drama + p.talents.action + p.talents.dancing) / 6;
        let score = p.talents.acting * 0.4 + avgTalent * 0.35 + (p.fameXp / 100);
        if (p.isUnionMember) score += 15;
        score += p.leadRolesCount * 5;
        if (p.representation?.agent?.signed) score += 12;

        let requiredScore = 15;
        if (aud.roleType === 'Lead') requiredScore = 40;
        else if (aud.roleType === 'Principal') requiredScore = 28;
        else if (aud.roleType === 'Support') requiredScore = 20;

        const isAccepted = (score + Math.random() * 20) >= requiredScore;

        if (isAccepted) {
          // ACCEPTANCE MESSAGE
          newInboxMessages.unshift({
            id: `msg_cast_acc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'CASTING',
            sender: 'Casting Director',
            senderRole: 'Production Department',
            senderAvatar: aud.posterUrl,
            subject: `AUDITION ACCEPTED: ${aud.movieTitle}`,
            body: `Congratulations!\n\nYour talent evaluation passed casting checks. You have officially been cast as the ${aud.roleType} in "${aud.movieTitle}".\n\nProduction begins next week.`,
            date: `Week ${newWeek}, ${newYear}`,
            read: false,
          });

          // Move to Booking
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
          });
        } else {
          // REJECTION MESSAGE
          newInboxMessages.unshift({
            id: `msg_cast_rej_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            category: 'CASTING',
            sender: 'Casting Office',
            senderRole: 'Casting Department',
            senderAvatar: aud.posterUrl,
            subject: `Audition Update: ${aud.movieTitle}`,
            body: `We appreciate your interest in ${aud.movieTitle}.\n\nAfter reviewing all auditions and skill requirements, another actor has been selected for this project.\n\nKeep building your talents at Acting School and re-apply!`,
            date: `Week ${newWeek}, ${newYear}`,
            read: false,
          });
        }
      } else {
        // Still pending
        let status = aud.status;
        if (nextWeeks <= 2) status = 'Decision Pending';
        else if (nextWeeks <= 5) status = 'Callback';
        else if (nextWeeks <= 10) status = 'Casting';

        remainingAuditions.push({
          ...aud,
          weeksRemaining: nextWeeks,
          status,
        });
      }
    });

    // 5. Process Booked Projects (Filming Progress)
    const updatedBookedProjects: BookedProject[] = [];
    const newReleasedMovies: ReleasedMovie[] = [...saveData.releasedMovies];

    newBookings.forEach(book => {
      if (book.isFilmingComplete) {
        updatedBookedProjects.push(book);
        return;
      }

      const nextWeeks = book.weeksRemaining - 1;
      if (nextWeeks <= 0) {
        // Filming Complete! Pay player & record role counters
        p.money += book.salary;
        p.moviesCompleted += 1;

        if (book.roleType === 'Lead') {
          p.leadRolesCount += 1;
        } else if (book.roleType === 'Principal') {
          p.principalRolesCount += 1;
        }

        // Notify in Inbox
        newInboxMessages.unshift({
          id: `msg_film_done_${Date.now()}`,
          category: 'CASTING',
          sender: 'Studio Executive',
          senderRole: 'Production Producer',
          senderAvatar: book.posterUrl,
          subject: `Filming Complete: ${book.movieTitle}`,
          body: `Production on "${book.movieTitle}" is officially wrapped! Your contract salary of $${book.salary.toLocaleString()} has been deposited. The film is entering theatrical release preparation.`,
          date: `Week ${newWeek}, ${newYear}`,
          read: false,
        });

        // Add to Released Movies
        const opening = Math.floor(book.salary * (1.5 + Math.random() * 3));
        newReleasedMovies.unshift({
          id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          movieTitle: book.movieTitle,
          posterUrl: book.posterUrl,
          roleType: book.roleType,
          playerEarnings: book.salary,
          openingWeekendGross: opening,
          domesticGross: opening * 3,
          worldwideGross: opening * 6,
          audienceRating: Math.floor(65 + Math.random() * 30),
          criticRating: Math.floor(60 + Math.random() * 35),
          boxOfficePosition: Math.floor(1 + Math.random() * 5),
          weeksInCinemas: 1,
          awardsWon: 0,
          inCinemas: true,
        });
      } else {
        updatedBookedProjects.push({
          ...book,
          weeksRemaining: nextWeeks,
          boostedThisTurn: false,
        });
      }
    });

    // 6. Update Box Office for Released Movies in Cinemas
    const updatedReleasedMovies = newReleasedMovies.map(movie => {
      if (!movie.inCinemas) return movie;
      const nextWeeks = movie.weeksInCinemas + 1;
      const addedGross = Math.floor(movie.openingWeekendGross * (0.8 / nextWeeks));
      return {
        ...movie,
        weeksInCinemas: nextWeeks,
        domesticGross: movie.domesticGross + addedGross,
        worldwideGross: movie.worldwideGross + addedGross * 2,
        boxOfficePosition: Math.min(10, movie.boxOfficePosition + (Math.random() > 0.5 ? 1 : 0)),
        inCinemas: nextWeeks < 8, // Leaves cinemas after 8 weeks -> moves to IMDb history
      };
    });

    // 7. Refill Callboard if < 4 projects
    let updatedCallboard = [...saveData.callboard];
    if (updatedCallboard.length < 4) {
      const needed = 5 - updatedCallboard.length;
      updatedCallboard = [...updatedCallboard, ...generateCallboardProjects(needed)];
    }

    // 8. Track Relationship time
    const updatedRelationships = saveData.relationships.map(rel => {
      if (rel.stage !== 'Stranger') {
        return {
          ...rel,
          weeksInCurrentStage: rel.weeksInCurrentStage + 1,
        };
      }
      return rel;
    });

    // Combine Inbox
    const updatedInbox = [...newInboxMessages, ...saveData.inbox];

    updateSave({
      ...saveData,
      player: p,
      callboard: updatedCallboard,
      auditions: remainingAuditions,
      bookedProjects: updatedBookedProjects,
      releasedMovies: updatedReleasedMovies,
      inbox: updatedInbox,
      relationships: updatedRelationships,
    });
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

    if (saveData.player.leadRolesCount < 4) {
      return { success: false, message: `Requirements not met: You need 4 Lead Roles (Current: ${saveData.player.leadRolesCount}/4). Principal or Support roles do NOT count.` };
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

    updateSave({
      ...saveData,
      player: updatedPlayer,
      inbox: [newInboxMsg, ...saveData.inbox],
    });

    return { success: true, message: 'SAG-AFTRA Membership unlocked successfully!' };
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

  // Inbox mark read
  const markMessageRead = (messageId: string) => {
    const updatedInbox = saveData.inbox.map(m => (m.id === messageId ? { ...m, read: true } : m));
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
        enrollInCourse,
        signAgentContract,
        createNewCharacter,
        applyToCallboard,
        advanceWeek,
        boostProduction,
        joinSAGMembership,
        setupDatingProfile,
        interactNpc,
        sendGiftToNpc,
        proposeMarriage,
        haveChild,
        markMessageRead,
        switchSaveSlot,
        changeTheme,
        updateSettings,
        resetGame,
        manualSave,
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
