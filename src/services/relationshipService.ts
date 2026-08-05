/**
 * HOLLYWOOD RISING - RELATIONSHIP SYSTEM OVERHAUL V1
 * Core relationship engine: Love, Dating, Compatibility, Match System, Activities,
 * Dynamic Conversations, Events, Arguments, Breakups, Engagement, Prenup, Marriage, Family & History.
 */

import { NpcProfile, NpcTrait, RelationshipStage, RelationshipHistoryEvent, PrenupTerms, ChildRecord, Player } from '../types/game';

export const ALL_NPC_TRAITS: NpcTrait[] = [
  'Romantic',
  'Ambitious',
  'Funny',
  'Private',
  'Family-Oriented',
  'Career-Focused',
  'Introverted',
  'Extroverted',
  'Confident',
  'Jealous',
  'Kind',
  'Serious',
  'Independent',
];

export const RELATIONSHIP_STAGES_ORDER: RelationshipStage[] = [
  'Stranger',
  'Acquaintance',
  'Friend',
  'Close Friend',
  'Dating',
  'Exclusive',
  'Partner',
  'Engaged',
  'Married',
  'Family',
];

export interface RelationshipActivityDef {
  id: string;
  name: string;
  category: 'CASUAL' | 'ROMANTIC' | 'LUXURY' | 'FAMILY';
  cost: number;
  energyCost: number;
  affinityGain: number;
  trustGain: number;
  timeHours: number;
  description: string;
}

export const RELATIONSHIP_ACTIVITIES: RelationshipActivityDef[] = [
  { id: 'coffee', name: 'Coffee Date', category: 'CASUAL', cost: 25, energyCost: 5, affinityGain: 5, trustGain: 3, timeHours: 1, description: 'Relaxed artisan coffee chat at a quiet West Hollywood café.' },
  { id: 'dinner', name: 'Dinner at Chateau Marmont', category: 'ROMANTIC', cost: 250, energyCost: 10, affinityGain: 12, trustGain: 6, timeHours: 2, description: 'Candlelight fine dining under the Beverly Hills stars.' },
  { id: 'movie', name: 'Movie Night Premiere', category: 'CASUAL', cost: 150, energyCost: 10, affinityGain: 9, trustGain: 4, timeHours: 2, description: 'Private screening room movie date with gourmet popcorn.' },
  { id: 'beach', name: 'Malibu Beach Day', category: 'CASUAL', cost: 50, energyCost: 15, affinityGain: 12, trustGain: 7, timeHours: 3, description: 'Sunbathing, ocean walks, and seaside tacos in Malibu.' },
  { id: 'concert', name: 'Hollywood Bowl Concert', category: 'ROMANTIC', cost: 400, energyCost: 15, affinityGain: 16, trustGain: 9, timeHours: 3, description: 'VIP box seats for live orchestra performance under moonlight.' },
  { id: 'museum', name: 'Getty Museum Tour', category: 'CASUAL', cost: 80, energyCost: 10, affinityGain: 8, trustGain: 6, timeHours: 2, description: 'Strolling scenic art gardens and classical galleries.' },
  { id: 'themepark', name: 'Universal Theme Park', category: 'CASUAL', cost: 300, energyCost: 20, affinityGain: 15, trustGain: 8, timeHours: 4, description: 'VIP fast-pass thrill rides and behind-the-scenes movie studio tour.' },
  { id: 'vacation', name: 'Cabo San Lucas Vacation', category: 'LUXURY', cost: 3500, energyCost: 30, affinityGain: 28, trustGain: 20, timeHours: 12, description: 'Weekend luxury yacht getaway with private ocean villa.' },
  { id: 'party', name: 'Bel-Air Private Party', category: 'LUXURY', cost: 1000, energyCost: 15, affinityGain: 18, trustGain: 10, timeHours: 4, description: 'Exclusive celebrity mansion mixer with top Hollywood stars.' },
  { id: 'gala', name: 'Charity Gala', category: 'LUXURY', cost: 2000, energyCost: 15, affinityGain: 22, trustGain: 15, timeHours: 4, description: 'Red carpet black-tie benefit event boosting mutual prestige.' },
  { id: 'birthday', name: 'Birthday Celebration', category: 'ROMANTIC', cost: 800, energyCost: 15, affinityGain: 25, trustGain: 18, timeHours: 3, description: 'Special customized birthday feast with champagne and gifts.' },
  { id: 'shopping', name: 'Rodeo Drive Shopping', category: 'LUXURY', cost: 2500, energyCost: 15, affinityGain: 20, trustGain: 10, timeHours: 3, description: 'Haute couture fashion spree through designer boutiques.' },
  { id: 'walk', name: 'Runyon Canyon Walk', category: 'CASUAL', cost: 0, energyCost: 10, affinityGain: 7, trustGain: 5, timeHours: 1, description: 'Scenic morning hike over looking panoramic views of Los Angeles.' },
  { id: 'cooking', name: 'Cooking Together', category: 'CASUAL', cost: 60, energyCost: 10, affinityGain: 11, trustGain: 12, timeHours: 2, description: 'Preparing homemade pasta and dessert in cozy kitchen.' },
  { id: 'workout', name: 'Workout Together', category: 'CASUAL', cost: 100, energyCost: 15, affinityGain: 8, trustGain: 6, timeHours: 1.5, description: 'Private partner personal training session at Equinox.' },
];

export interface ConversationTopic {
  id: string;
  topic: string;
  options: {
    text: string;
    traitPreference: NpcTrait[];
    affinityDelta: number;
    trustDelta: number;
    npcReaction: string;
  }[];
}

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: 'career',
    topic: 'Career & Ambition',
    options: [
      {
        text: 'Discuss your upcoming movie projects and long-term Hollywood directorial vision.',
        traitPreference: ['Ambitious', 'Career-Focused', 'Confident'],
        affinityDelta: 8,
        trustDelta: 6,
        npcReaction: '"I love seeing someone who knows exactly what they want in this industry. Drive is so attractive."',
      },
      {
        text: 'Ask about their passion projects and artistic inspirations.',
        traitPreference: ['Kind', 'Romantic', 'Introverted'],
        affinityDelta: 10,
        trustDelta: 8,
        npcReaction: '"Thank you for asking! Most people here only care about box office numbers, not true art."',
      },
      {
        text: 'Make a witty joke about studio executives and Hollywood bureaucracy.',
        traitPreference: ['Funny', 'Independent', 'Extroverted'],
        affinityDelta: 7,
        trustDelta: 5,
        npcReaction: '"Haha, that is painfully accurate! Studio notes are the bane of my existence."',
      },
    ],
  },
  {
    id: 'family',
    topic: 'Family & Childhood',
    options: [
      {
        text: 'Share fond memories of growing up and the importance of family support.',
        traitPreference: ['Family-Oriented', 'Kind', 'Romantic'],
        affinityDelta: 12,
        trustDelta: 10,
        npcReaction: '"It means so much that you value family. In Hollywood, it\'s hard to find grounded people."',
      },
      {
        text: 'Keep it light and mention keeping personal life private from tabloids.',
        traitPreference: ['Private', 'Serious', 'Independent'],
        affinityDelta: 9,
        trustDelta: 8,
        npcReaction: '"I completely agree. Protecting private boundaries is essential when living in the spotlight."',
      },
    ],
  },
  {
    id: 'goals',
    topic: 'Life Goals & Values',
    options: [
      {
        text: 'Talk about building an empire, launching studios, and accumulating assets.',
        traitPreference: ['Ambitious', 'Career-Focused', 'Independent'],
        affinityDelta: 8,
        trustDelta: 5,
        npcReaction: '"Building something lasting is the true dream. You think big!"',
      },
      {
        text: 'Talk about finding peace, authentic love, and meaningful human connection.',
        traitPreference: ['Romantic', 'Kind', 'Family-Oriented'],
        affinityDelta: 12,
        trustDelta: 10,
        npcReaction: '"That\'s beautiful. Genuine connection is rare here, and I treasure it above fame."',
      },
    ],
  },
  {
    id: 'travel',
    topic: 'Travel & Escapes',
    options: [
      {
        text: 'Propose an exotic getaway to the Amalfi Coast or Tokyo.',
        traitPreference: ['Extroverted', 'Romantic', 'Independent'],
        affinityDelta: 10,
        trustDelta: 6,
        npcReaction: '"Count me in! I\'ve been dreaming of escaping the Los Angeles hustle for weeks."',
      },
      {
        text: 'Talk about cozy cabin retreats away from crowd noise.',
        traitPreference: ['Introverted', 'Private', 'Kind'],
        affinityDelta: 9,
        trustDelta: 8,
        npcReaction: '"A quiet sanctuary in nature sounds absolutely heaven to me right now."',
      },
    ],
  },
];

export class RelationshipEngine {
  /**
   * Ensure NPC has traits assigned
   */
  public static ensureNpcTraits(npc: NpcProfile): NpcProfile {
    if (npc.personalityTraits && npc.personalityTraits.length > 0) {
      return npc;
    }
    const traits: NpcTrait[] = [];
    const available = [...ALL_NPC_TRAITS];
    const traitCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < traitCount; i++) {
      const idx = Math.floor(Math.random() * available.length);
      traits.push(available[idx]);
      available.splice(idx, 1);
    }
    return {
      ...npc,
      personalityTraits: traits,
      trustLevel: npc.trustLevel ?? 50,
      compatibilityScore: npc.compatibilityScore ?? Math.floor(50 + Math.random() * 40),
      history: npc.history || [],
      weeksInCurrentStage: npc.weeksInCurrentStage || 0,
    };
  }

  /**
   * Calculate compatibility between player & NPC (0-100)
   */
  public static calculateCompatibility(player: Player, npc: NpcProfile): number {
    let score = 50;

    // Fame/Reputation impact
    const fame = player.fameXp || 0;
    if (npc.personalityTraits?.includes('Ambitious') || npc.personalityTraits?.includes('Career-Focused')) {
      if (fame > 1000) score += 15;
    }

    // Trait matching
    if (npc.personalityTraits?.includes('Romantic')) score += 10;
    if (npc.personalityTraits?.includes('Family-Oriented')) score += 5;
    if (npc.personalityTraits?.includes('Jealous') && fame > 5000) score -= 10;

    // Age difference penalty if huge
    const playerAge = player.age || 26;
    const ageDiff = Math.abs(playerAge - npc.age);
    if (ageDiff > 15) score -= 15;

    return Math.max(10, Math.min(100, Math.round(score)));
  }

  /**
   * Handle Match request (Does NOT guarantee success)
   */
  public static processMatchAttempt(player: Player, npc: NpcProfile): {
    updatedNpc: NpcProfile;
    status: 'ACCEPTED' | 'DECLINED' | 'IGNORED' | 'BUSY' | 'ALREADY_DATING' | 'CAREER_FOCUSED' | 'NOT_INTERESTED' | 'LOW_COMPATIBILITY';
    message: string;
  } {
    const preparedNpc = this.ensureNpcTraits(npc);
    const compatibility = this.calculateCompatibility(player, preparedNpc);

    // Roll result based on compatibility & traits
    const roll = Math.random() * 100;

    let status: 'ACCEPTED' | 'DECLINED' | 'IGNORED' | 'BUSY' | 'ALREADY_DATING' | 'CAREER_FOCUSED' | 'NOT_INTERESTED' | 'LOW_COMPATIBILITY';
    let message = '';

    if (compatibility < 35) {
      status = 'LOW_COMPATIBILITY';
      message = `${preparedNpc.name} passed on matching. "Felt our personalities and lifestyle directions were too different."`;
    } else if (preparedNpc.personalityTraits?.includes('Career-Focused') && roll < 30) {
      status = 'CAREER_FOCUSED';
      message = `${preparedNpc.name} is currently focused on directing their next project and not looking to date.`;
    } else if (roll < 12) {
      status = 'BUSY';
      message = `${preparedNpc.name} is wrapped on a 16-week international film shoot in London and unavailable.`;
    } else if (roll < 22) {
      status = 'ALREADY_DATING';
      message = `${preparedNpc.name} is currently in an exclusive relationship and declined.`;
    } else if (roll < 32 && preparedNpc.personalityTraits?.includes('Private')) {
      status = 'IGNORED';
      message = `${preparedNpc.name} did not respond to your profile.`;
    } else if (compatibility >= 50 && roll < 85) {
      status = 'ACCEPTED';
      message = `It's a Match! ${preparedNpc.name} accepted your profile request! Added to your Acquaintances.`;
    } else {
      status = 'NOT_INTERESTED';
      message = `${preparedNpc.name} politely passed on your profile.`;
    }

    const history = preparedNpc.history || [];
    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;

    let stage = preparedNpc.stage;
    if (status === 'ACCEPTED') {
      stage = 'Acquaintance';
      history.push({
        id: `hist_${Date.now()}`,
        type: 'MEETING',
        title: 'Matched & Met',
        description: `Matched on Hollywood singles network and became acquaintances.`,
        timestamp,
      });
    }

    const updatedNpc: NpcProfile = {
      ...preparedNpc,
      matchStatus: status,
      stage,
      compatibilityScore: compatibility,
      relationshipLevel: status === 'ACCEPTED' ? 25 : preparedNpc.relationshipLevel,
      trustLevel: status === 'ACCEPTED' ? 30 : preparedNpc.trustLevel,
      history,
    };

    return { updatedNpc, status, message };
  }

  /**
   * Perform Activity
   */
  public static performActivity(
    player: Player,
    npc: NpcProfile,
    activity: RelationshipActivityDef
  ): { success: boolean; message: string; updatedPlayer?: Player; updatedNpc?: NpcProfile } {
    if (player.money < activity.cost) {
      return { success: false, message: `Insufficient cash! Need $${activity.cost.toLocaleString()}.` };
    }
    if ((player.energy || 100) < activity.energyCost) {
      return { success: false, message: `Not enough energy! Need ${activity.energyCost} energy.` };
    }

    const preparedNpc = this.ensureNpcTraits(npc);
    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;

    const newAffinity = Math.min(100, (preparedNpc.relationshipLevel || 0) + activity.affinityGain);
    const newTrust = Math.min(100, (preparedNpc.trustLevel || 50) + activity.trustGain);

    const newHistory: RelationshipHistoryEvent[] = [
      ...(preparedNpc.history || []),
      {
        id: `act_${Date.now()}`,
        type: 'ACTIVITY',
        title: activity.name,
        description: `Went on ${activity.name.toLowerCase()}. ${activity.description}`,
        timestamp,
        impact: `+${activity.affinityGain} Affinity, +${activity.trustGain} Trust`,
      },
    ];

    const updatedNpc: NpcProfile = {
      ...preparedNpc,
      relationshipLevel: newAffinity,
      trustLevel: newTrust,
      history: newHistory,
      lastInteractionWeek: player.dateWeek,
    };

    const updatedPlayer: Player = {
      ...player,
      money: player.money - activity.cost,
      energy: Math.max(0, (player.energy || 100) - activity.energyCost),
    };

    return {
      success: true,
      message: `Completed ${activity.name} with ${npc.name}! (+${activity.affinityGain} Affinity, +${activity.trustGain} Trust)`,
      updatedPlayer,
      updatedNpc,
    };
  }

  /**
   * Process Conversation Choice
   */
  public static handleConversationOption(
    player: Player,
    npc: NpcProfile,
    option: ConversationTopic['options'][0]
  ): { updatedNpc: NpcProfile; message: string } {
    const preparedNpc = this.ensureNpcTraits(npc);
    let affinityDelta = option.affinityDelta;
    let trustDelta = option.trustDelta;

    // Trait multiplier
    const npcTraits = preparedNpc.personalityTraits || [];
    const matchingTraits = option.traitPreference.filter((t) => npcTraits.includes(t));
    if (matchingTraits.length > 0) {
      affinityDelta += matchingTraits.length * 4;
      trustDelta += matchingTraits.length * 3;
    }

    const newAffinity = Math.max(0, Math.min(100, (preparedNpc.relationshipLevel || 0) + affinityDelta));
    const newTrust = Math.max(0, Math.min(100, (preparedNpc.trustLevel || 50) + trustDelta));

    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;
    const newHistory: RelationshipHistoryEvent[] = [
      ...(preparedNpc.history || []),
      {
        id: `conv_${Date.now()}`,
        type: 'DATE',
        title: 'Deep Conversation',
        description: `Discussed topic with ${npc.name}.`,
        timestamp,
        impact: `${option.npcReaction}`,
      },
    ];

    const updatedNpc: NpcProfile = {
      ...preparedNpc,
      relationshipLevel: newAffinity,
      trustLevel: newTrust,
      history: newHistory,
    };

    return {
      updatedNpc,
      message: option.npcReaction,
    };
  }

  /**
   * Stage Progression Check & Advancement
   */
  public static advanceStage(
    player: Player,
    npc: NpcProfile
  ): { success: boolean; message: string; updatedNpc?: NpcProfile } {
    const prep = this.ensureNpcTraits(npc);
    const currStage = prep.stage;
    const level = prep.relationshipLevel || 0;
    const trust = prep.trustLevel || 0;
    const weeks = prep.weeksInCurrentStage || 0;
    const comp = prep.compatibilityScore || 50;

    let nextStage: RelationshipStage | null = null;
    let reqMessage = '';

    switch (currStage) {
      case 'Stranger':
        return { success: false, message: 'You must first swipe/match with this person.' };
      case 'Acquaintance':
        if (level >= 30 && trust >= 25 && weeks >= 2) {
          nextStage = 'Friend';
        } else {
          reqMessage = 'Requires: 30+ Affinity, 25+ Trust, and 2+ weeks as Acquaintances.';
        }
        break;
      case 'Friend':
        if (level >= 50 && trust >= 40 && weeks >= 4) {
          nextStage = 'Close Friend';
        } else {
          reqMessage = 'Requires: 50+ Affinity, 40+ Trust, and 4+ weeks as Friends.';
        }
        break;
      case 'Close Friend':
        if (level >= 65 && trust >= 55 && comp >= 45 && weeks >= 4) {
          nextStage = 'Dating';
        } else {
          reqMessage = 'Requires: 65+ Affinity, 55+ Trust, 45+ Compatibility, and 4+ weeks as Close Friends.';
        }
        break;
      case 'Dating':
        if (level >= 75 && trust >= 70 && weeks >= 6) {
          nextStage = 'Exclusive';
        } else {
          reqMessage = 'Requires: 75+ Affinity, 70+ Trust, and 6+ weeks of Dating.';
        }
        break;
      case 'Exclusive':
        if (level >= 85 && trust >= 80 && weeks >= 8) {
          nextStage = 'Partner';
        } else {
          reqMessage = 'Requires: 85+ Affinity, 80+ Trust, and 8+ weeks as Exclusive.';
        }
        break;
      case 'Partner':
        return { success: false, message: 'To advance from Partner to Engaged, propose marriage in the Marriage tab.' };
      case 'Engaged':
        return { success: false, message: 'To advance from Engaged to Married, finalize your Prenup and host your wedding in the Marriage tab.' };
      case 'Married':
        return { success: false, message: 'Already happily married! Access Family options in the Family tab.' };
      default:
        nextStage = 'Friend';
    }

    if (!nextStage) {
      return { success: false, message: `Cannot advance stage yet. ${reqMessage}` };
    }

    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;
    const newHistory: RelationshipHistoryEvent[] = [
      ...(prep.history || []),
      {
        id: `stage_${Date.now()}`,
        type: 'STAGE_CHANGE',
        title: `Relationship Stage: ${nextStage}`,
        description: `Advanced relationship stage from ${currStage} to ${nextStage}.`,
        timestamp,
      },
    ];

    const updatedNpc: NpcProfile = {
      ...prep,
      stage: nextStage,
      weeksInCurrentStage: 0,
      history: newHistory,
    };

    return {
      success: true,
      message: `Relationship with ${npc.name} advanced to ${nextStage}!`,
      updatedNpc,
    };
  }

  /**
   * Evaluate Prenup Terms Reaction from NPC
   */
  public static evaluatePrenupReaction(
    npc: NpcProfile,
    terms: PrenupTerms
  ): {
    status: 'AGREED' | 'REJECTED' | 'LAWYER_REVIEW' | 'DRAFTED';
    npcFeedback: string;
    trustChange: number;
    updatedTerms: PrenupTerms;
  } {
    const prep = this.ensureNpcTraits(npc);
    const traits = prep.personalityTraits || [];

    let countProtected = 0;
    if (terms.protectCash) countProtected++;
    if (terms.protectSavings) countProtected++;
    if (terms.protectBusinesses) countProtected++;
    if (terms.protectRealEstate) countProtected++;
    if (terms.protectInvestments) countProtected++;
    if (terms.protectRoyalties) countProtected++;
    if (terms.protectLuxuryAssets) countProtected++;
    if (terms.protectFutureEarnings) countProtected++;
    if (terms.protectInheritance) countProtected++;
    if (terms.protectDebtResponsibility) countProtected++;

    let status: 'AGREED' | 'REJECTED' | 'LAWYER_REVIEW' | 'DRAFTED' = 'AGREED';
    let npcFeedback = '';
    let trustChange = 0;

    if (traits.includes('Ambitious') || traits.includes('Independent') || traits.includes('Serious')) {
      status = 'AGREED';
      npcFeedback = '"This is a professional and wise agreement. Protecting both our financial futures makes complete sense."';
      trustChange = 5;
    } else if (traits.includes('Romantic') || traits.includes('Kind')) {
      if (countProtected > 7 && !terms.lawyerReviewed) {
        status = 'LAWYER_REVIEW';
        npcFeedback = '"This seems very restrictive. I want my family lawyer to review these clauses before I sign."';
        trustChange = -5;
      } else {
        status = 'AGREED';
        npcFeedback = '"I understand you want security for your estate. As long as we love each other, I am happy to sign."';
        trustChange = 0;
      }
    } else if (traits.includes('Jealous') || traits.includes('Private')) {
      if (!terms.lawyerReviewed) {
        status = 'LAWYER_REVIEW';
        npcFeedback = '"My legal team needs to examine every single clause in detail."';
        trustChange = -2;
      } else {
        status = 'AGREED';
        npcFeedback = '"My lawyer reviewed the terms and confirmed it is balanced. I will sign."';
        trustChange = 2;
      }
    } else {
      status = 'AGREED';
      npcFeedback = '"Agreement looks reasonable. I sign willingly."';
      trustChange = 2;
    }

    const updatedTerms: PrenupTerms = {
      ...terms,
      status,
      npcNotes: npcFeedback,
      lawyerReviewed: terms.lawyerReviewed || status === 'LAWYER_REVIEW',
    };

    return {
      status,
      npcFeedback,
      trustChange,
      updatedTerms,
    };
  }

  /**
   * Evaluate Proposal
   */
  public static evaluateProposal(
    player: Player,
    npc: NpcProfile,
    ringCost: number
  ): {
    accepted: boolean;
    status: 'ACCEPTED' | 'DELAYED' | 'REJECTED';
    message: string;
  } {
    const prep = this.ensureNpcTraits(npc);
    const level = prep.relationshipLevel || 0;
    const trust = prep.trustLevel || 0;
    const weeks = prep.weeksInCurrentStage || 0;

    if (prep.stage !== 'Partner' && prep.stage !== 'Exclusive') {
      return {
        accepted: false,
        status: 'REJECTED',
        message: `${prep.name} rejected the proposal: "We need to be long-term partners before considering marriage!"`,
      };
    }

    if (level < 80 || trust < 75) {
      return {
        accepted: false,
        status: 'DELAYED',
        message: `${prep.name} asked to wait: "I love you, but we need deeper trust and time together first."`,
      };
    }

    if (ringCost < 25000 && prep.personalityTraits?.includes('Ambitious')) {
      return {
        accepted: false,
        status: 'DELAYED',
        message: `${prep.name} hesitated: "An A-list engagement deserves a more significant commitment symbol."`,
      };
    }

    return {
      accepted: true,
      status: 'ACCEPTED',
      message: `${prep.name} said YES! "I can't wait to spend the rest of my life with you!"`,
    };
  }

  /**
   * Trigger Breakup / Arguments
   */
  public static processBreakup(
    player: Player,
    npc: NpcProfile,
    reason: string
  ): { updatedNpc: NpcProfile; message: string } {
    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;
    const history = prepHistory(npc.history);

    history.push({
      id: `breakup_${Date.now()}`,
      type: 'BREAKUP',
      title: 'Relationship Ended',
      description: `Broke up due to: ${reason}`,
      timestamp,
    });

    const updatedNpc: NpcProfile = {
      ...npc,
      stage: 'Stranger',
      relationshipLevel: 10,
      trustLevel: 10,
      weeksInCurrentStage: 0,
      history,
    };

    return {
      updatedNpc,
      message: `You and ${npc.name} have officially broken up. Reason: ${reason}`,
    };
  }
}

function prepHistory(hist?: RelationshipHistoryEvent[]): RelationshipHistoryEvent[] {
  return hist ? [...hist] : [];
}
