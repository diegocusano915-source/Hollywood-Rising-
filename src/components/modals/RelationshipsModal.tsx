/**
 * HOLLYWOOD RISING - Relationships & Dating System (Overhaul V1)
 * Authentic relationship progression, NPC personalities, compatibility calculations,
 * activities, dynamic conversations, prenup agreement, marriage, family & history.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Heart,
  User,
  Gift,
  Crown,
  Baby,
  Sparkles,
  DollarSign,
  Check,
  Building,
  Calendar,
  MessageSquare,
  XCircle,
  Award,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Briefcase,
  FileText,
  Flame,
  Scale,
  Users,
  Compass,
  Smile,
  BookOpen,
  Coffee,
  ChevronRight,
  History,
  TrendingUp,
} from 'lucide-react';
import { GIFT_ITEMS } from '../../database/storageService';
import { Gender, GiftItem, NpcProfile, PrenupTerms, ChildRecord } from '../../types/game';
import { THEMES } from '../../theme/colors';
import {
  RelationshipEngine,
  RELATIONSHIP_ACTIVITIES,
  CONVERSATION_TOPICS,
  ALL_NPC_TRAITS,
  RelationshipActivityDef,
} from '../../services/relationshipService';

export const RelationshipsModal: React.FC = () => {
  const {
    setActiveModal,
    player,
    relationships,
    setupDatingProfile,
    interactNpc,
    sendGiftToNpc,
    updateSave,
    saveData,
    settings,
  } = useGame();

  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<'MATCH' | 'DEX' | 'GIFTS' | 'PRENUP' | 'WEDDING' | 'FAMILY'>('MATCH');

  // Dating Profile Form
  const [prefGender, setPrefGender] = useState<Gender>('Female');
  const [prefAge, setPrefAge] = useState<number>(24);
  const [prefCountry, setPrefCountry] = useState<string>('United States');
  const [prefType, setPrefType] = useState<'Men' | 'Women' | 'Everyone'>('Everyone');

  // Selected NPC
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(
    relationships.length > 0 ? relationships[0].id : null
  );

  // Sub-action views within Rolodex
  const [rolodexView, setRolodexView] = useState<'OVERVIEW' | 'ACTIVITIES' | 'TALK' | 'HISTORY'>('OVERVIEW');

  // Prenup state
  const [prenupTerms, setPrenupTerms] = useState<PrenupTerms>({
    protectCash: true,
    protectSavings: true,
    protectBusinesses: true,
    protectRealEstate: true,
    protectInvestments: true,
    protectRoyalties: true,
    protectLuxuryAssets: false,
    protectFutureEarnings: true,
    protectInheritance: true,
    protectDebtResponsibility: true,
    status: 'NOT_STARTED',
  });

  // Wedding form
  const [venue, setVenue] = useState<'Church' | 'Beach' | 'Luxury Hotel' | 'Private Estate'>('Luxury Hotel');
  const [ringCost, setRingCost] = useState<number>(25000);

  // Child school & Family form
  const [childSchool, setChildSchool] = useState<'Public School' | 'Private School' | 'Boarding School' | 'University'>('Private School');
  const [childName, setChildName] = useState<string>('');
  const [childGender, setChildGender] = useState<'Male' | 'Female' | 'Non-Binary'>('Female');

  // Active selected NPC
  const selectedNpc = relationships.find((r) => r.id === selectedNpcId);

  // Filter strangers & active contacts
  const matchCandidates = relationships.filter((r) => r.stage === 'Stranger');
  const activeContacts = relationships.filter((r) => r.stage !== 'Stranger');

  // Helper to update specific NPC profile
  const updateNpcProfile = (updatedNpc: NpcProfile, updatedPlayer?: any) => {
    const updatedRels = relationships.map((r) => (r.id === updatedNpc.id ? updatedNpc : r));
    updateSave({
      ...saveData,
      player: updatedPlayer ? { ...saveData.player, ...updatedPlayer } : saveData.player,
      relationships: updatedRels,
    });
  };

  // Helper for Match Action
  const handleMatchAttempt = (candidate: NpcProfile) => {
    const res = RelationshipEngine.processMatchAttempt(player, candidate);
    if (res.status === 'ACCEPTED') {
      alert(res.message);
    } else {
      alert(`Result: ${res.status.replace('_', ' ')}\n${res.message}`);
    }
    updateNpcProfile(res.updatedNpc);
  };

  // Helper for Activity
  const handlePerformActivity = (activity: RelationshipActivityDef) => {
    if (!selectedNpc) return;
    const res = RelationshipEngine.performActivity(player, selectedNpc, activity);
    if (!res.success) {
      alert(res.message);
      return;
    }
    alert(res.message);
    if (res.updatedNpc) {
      updateNpcProfile(res.updatedNpc, res.updatedPlayer);
    }
  };

  // Helper for Conversation
  const handleConversationChoice = (topicOption: any) => {
    if (!selectedNpc) return;
    const res = RelationshipEngine.handleConversationOption(player, selectedNpc, topicOption);
    alert(`${selectedNpc.name}: ${res.message}`);
    updateNpcProfile(res.updatedNpc);
  };

  // Helper for Stage Advancement
  const handleAdvanceStage = () => {
    if (!selectedNpc) return;
    const res = RelationshipEngine.advanceStage(player, selectedNpc);
    alert(res.message);
    if (res.success && res.updatedNpc) {
      updateNpcProfile(res.updatedNpc);
    }
  };

  // Helper for Breakup
  const handleBreakup = () => {
    if (!selectedNpc) return;
    if (!window.confirm(`Are you sure you want to end your relationship with ${selectedNpc.name}? This will have lasting consequences.`)) return;
    const res = RelationshipEngine.processBreakup(player, selectedNpc, 'Personal Differences & Busy Careers');
    alert(res.message);
    updateNpcProfile(res.updatedNpc);
  };

  // Helper for Prenup Evaluation
  const handleEvaluatePrenup = () => {
    if (!selectedNpc) {
      alert('Please select your partner in My Rolodex first!');
      return;
    }
    const res = RelationshipEngine.evaluatePrenupReaction(selectedNpc, prenupTerms);
    setPrenupTerms(res.updatedTerms);
    alert(`Prenup Status: ${res.status}\nPartner Feedback: ${res.npcFeedback}`);

    // Save prenup status on NPC
    const updatedNpc: NpcProfile = {
      ...selectedNpc,
      prenupTerms: res.updatedTerms,
      trustLevel: Math.max(0, Math.min(100, (selectedNpc.trustLevel || 50) + res.trustChange)),
    };
    updateNpcProfile(updatedNpc);
  };

  // Helper for Proposal
  const handlePropose = () => {
    if (!selectedNpc) {
      alert('Please select a partner in My Rolodex!');
      return;
    }
    if (player.money < ringCost) {
      alert(`Insufficient cash! Need $${ringCost.toLocaleString()} for the ring.`);
      return;
    }

    const proposalRes = RelationshipEngine.evaluateProposal(player, selectedNpc, ringCost);
    if (!proposalRes.accepted) {
      alert(`Proposal Status: ${proposalRes.status}\n${proposalRes.message}`);
      return;
    }

    alert(`CONGRATULATIONS!\n${proposalRes.message}`);

    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;
    const newHistory = [
      ...(selectedNpc.history || []),
      {
        id: `prop_${Date.now()}`,
        type: 'PROPOSAL' as const,
        title: 'Engagement Proposal Accepted!',
        description: `Proposed with a $${ringCost.toLocaleString()} diamond ring at ${venue}.`,
        timestamp,
      },
    ];

    const updatedNpc: NpcProfile = {
      ...selectedNpc,
      stage: 'Engaged',
      weeksInCurrentStage: 0,
      relationshipLevel: 100,
      trustLevel: Math.min(100, (selectedNpc.trustLevel || 80) + 10),
      history: newHistory,
    };

    updateNpcProfile(updatedNpc, { money: player.money - ringCost });
  };

  // Helper for Marriage
  const handleWedding = () => {
    if (!selectedNpc) {
      alert('Please select your partner in My Rolodex!');
      return;
    }
    if (selectedNpc.stage !== 'Engaged' && selectedNpc.stage !== 'Partner') {
      alert('You must be engaged or in a long-term partner relationship before hosting a wedding!');
      return;
    }

    const venueCost = venue === 'Church' ? 10000 : venue === 'Beach' ? 25000 : venue === 'Luxury Hotel' ? 50000 : 100000;
    if (player.money < venueCost) {
      alert(`Need $${venueCost.toLocaleString()} to host the wedding at ${venue}.`);
      return;
    }

    alert(`CONGRATULATIONS!\nYou and ${selectedNpc.name} are officially Married at ${venue}!`);

    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;
    const newHistory = [
      ...(selectedNpc.history || []),
      {
        id: `wed_${Date.now()}`,
        type: 'WEDDING' as const,
        title: 'Official Hollywood Wedding',
        description: `Married ${selectedNpc.name} in a grand ceremony at ${venue}.`,
        timestamp,
      },
    ];

    const updatedNpc: NpcProfile = {
      ...selectedNpc,
      stage: 'Married',
      weeksInCurrentStage: 0,
      relationshipLevel: 100,
      history: newHistory,
    };

    updateNpcProfile(updatedNpc, {
      money: player.money - venueCost,
      activeRelationshipId: selectedNpc.id,
      weddingVenue: venue,
    });
  };

  // Helper for Have Child
  const handleHaveChild = () => {
    if (!selectedNpc || selectedNpc.stage !== 'Married') {
      alert('Children and Family features unlock strictly after Marriage.');
      return;
    }

    const nameToUse = childName.trim() || (childGender === 'Male' ? 'Leo' : childGender === 'Female' ? 'Aria' : 'Taylor');
    const newChild: ChildRecord = {
      id: `child_${Date.now()}`,
      name: nameToUse,
      gender: childGender,
      age: 0,
      schoolType: childSchool,
      personality: 'Creative & Energetic',
      birthYear: player.dateYear || 2026,
      birthWeek: player.dateWeek || 1,
    };

    const existingChildren = selectedNpc.children || [];
    const timestamp = `Week ${player.dateWeek || 1}, Year ${player.dateYear || 1}`;
    const newHistory = [
      ...(selectedNpc.history || []),
      {
        id: `child_hist_${Date.now()}`,
        type: 'CHILD' as const,
        title: `Welcome Baby ${newChild.name}`,
        description: `Gave birth/welcomed newborn baby ${newChild.name}. Enrolled in ${childSchool}.`,
        timestamp,
      },
    ];

    const updatedNpc: NpcProfile = {
      ...selectedNpc,
      children: [...existingChildren, newChild],
      history: newHistory,
    };

    alert(`Congratulations! You and ${selectedNpc.name} welcomed baby ${newChild.name}!`);
    updateNpcProfile(updatedNpc, {
      childrenCount: (player.childrenCount || 0) + 1,
      childrenSchoolType: childSchool,
    });
    setChildName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-4 md:p-5 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40">
              <Heart className="w-6 h-6 text-rose-400 fill-current" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                Hollywood Love & Relationships
              </h2>
              <p className="text-xs text-gray-400">Authentic Progression • Dating • Marriage • Prenup • Family</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Setup Dating Profile if missing */}
        {!player.datingProfile?.created ? (
          <div className="p-6 md:p-10 space-y-6 overflow-y-auto max-h-[80vh]">
            <div className="text-center space-y-3 max-w-lg mx-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center">
                <Heart className="w-10 h-10 text-rose-400 animate-bounce fill-current" />
              </div>
              <h3 className="text-2xl font-black text-white">Create Your Elite Dating Profile</h3>
              <p className="text-sm text-gray-300">
                Enter Hollywood's premier singles network. No fake relationships—every bond is earned through chemistry, trust, and shared ambitions.
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto bg-black/50 p-6 rounded-2xl border border-white/10 text-sm">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Your Gender Identity</label>
                <select
                  value={prefGender}
                  onChange={(e) => setPrefGender(e.target.value as Gender)}
                  className="w-full p-3.5 rounded-xl bg-gray-900 border border-white/15 text-white font-bold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Dating Preference</label>
                <select
                  value={prefType}
                  onChange={(e) => setPrefType(e.target.value as any)}
                  className="w-full p-3.5 rounded-xl bg-gray-900 border border-white/15 text-white font-bold"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Everyone">Everyone</option>
                </select>
              </div>

              <button
                onClick={() => setupDatingProfile(prefGender, prefAge, prefCountry, prefType)}
                className="w-full py-4 mt-3 rounded-xl font-black text-sm bg-rose-500 hover:bg-rose-400 text-white shadow-2xl cursor-pointer transition-all"
              >
                Launch Elite Profile
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="p-3 bg-black/50 border-b border-white/10 flex gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('MATCH')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'MATCH' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                <Flame className="w-4 h-4" />
                Dating Singles
              </button>
              <button
                onClick={() => setActiveTab('DEX')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'DEX' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                <Users className="w-4 h-4" />
                My Rolodex ({activeContacts.length})
              </button>
              <button
                onClick={() => setActiveTab('GIFTS')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'GIFTS' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                <Gift className="w-4 h-4" />
                Gift Store
              </button>
              <button
                onClick={() => setActiveTab('PRENUP')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'PRENUP' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                <Scale className="w-4 h-4" />
                Prenup
              </button>
              <button
                onClick={() => setActiveTab('WEDDING')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'WEDDING' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                <Crown className="w-4 h-4" />
                Marriage
              </button>
              <button
                onClick={() => setActiveTab('FAMILY')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'FAMILY' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                <Baby className="w-4 h-4" />
                Family
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">
              {/* MATCH TAB */}
              {activeTab === 'MATCH' && (
                <div className="space-y-4">
                  {matchCandidates.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <Heart className="w-16 h-16 mx-auto text-gray-600 animate-pulse" />
                      <h3 className="text-lg font-bold text-gray-300">Reviewed All Dating Candidates</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        Advance the week on your Game Home dashboard to discover new Hollywood singles.
                      </p>
                    </div>
                  ) : (
                    matchCandidates.slice(0, 1).map((candidate) => {
                      const prepared = RelationshipEngine.ensureNpcTraits(candidate);
                      const compatibility = RelationshipEngine.calculateCompatibility(player, prepared);

                      return (
                        <div
                          key={prepared.id}
                          className="rounded-3xl border-2 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start bg-black/50 shadow-2xl relative"
                          style={{ borderColor: theme.borderDark }}
                        >
                          {/* Avatar */}
                          <div className="w-full md:w-64 h-72 md:h-96 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-2xl relative bg-gray-900">
                            <img src={prepared.avatar} alt={prepared.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black bg-black/80 text-rose-400 border border-rose-500/40 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              {compatibility}% Compatibility
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow">
                                {prepared.occupation}
                              </span>
                            </div>
                          </div>

                          {/* Profile Details */}
                          <div className="flex-1 space-y-4 w-full">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white">
                                  {prepared.name}, <span className="text-rose-400">{prepared.age}</span>
                                </h3>
                                <p className="text-sm text-gray-400 font-medium mt-0.5">{prepared.country}</p>
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Biography</span>
                              <p className="text-sm text-gray-200 leading-relaxed italic font-medium">"{prepared.biography}"</p>
                            </div>

                            {/* Traits & Details */}
                            <div className="space-y-2">
                              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Personality Traits</span>
                              <div className="flex flex-wrap gap-2">
                                {prepared.personalityTraits?.map((trait) => (
                                  <span key={trait} className="px-3 py-1 rounded-xl text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                    {trait}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs md:text-sm p-4 rounded-2xl bg-black/40 border border-white/5">
                              <div><span className="text-gray-400">Lifestyle:</span> <strong className="text-white block mt-0.5">{prepared.lifestyle}</strong></div>
                              <div><span className="text-gray-400">Goals:</span> <strong className="text-amber-300 block mt-0.5">{prepared.relationshipGoals}</strong></div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex items-center gap-4">
                              <button
                                onClick={() => interactNpc(prepared.id, 'Pass')}
                                className="flex-1 py-4 rounded-2xl font-black text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                              >
                                <XCircle className="w-5 h-5 text-gray-400" />
                                Pass
                              </button>
                              <button
                                onClick={() => handleMatchAttempt(prepared)}
                                className="flex-1 py-4 rounded-2xl font-black text-sm bg-rose-500 hover:bg-rose-400 text-white shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                              >
                                <Heart className="w-5 h-5 fill-current" />
                                Express Interest (Request Match)
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ROLODEX TAB */}
              {activeTab === 'DEX' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Contact List */}
                  <div className="space-y-3 md:col-span-1 border-r border-white/10 pr-0 md:pr-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Rolodex ({activeContacts.length})</h4>
                    {activeContacts.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-8 bg-black/30 rounded-2xl border border-white/5">
                        No active connections yet. Request matches in Dating Singles.
                      </p>
                    ) : (
                      activeContacts.map((npc) => (
                        <div
                          key={npc.id}
                          onClick={() => {
                            setSelectedNpcId(npc.id);
                            setRolodexView('OVERVIEW');
                          }}
                          className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-md ${
                            selectedNpcId === npc.id ? 'bg-rose-500/15 border-rose-500/80' : 'bg-black/40 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={npc.avatar} alt={npc.name} className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-white truncate">{npc.name}</h4>
                              <p className="text-[11px] text-rose-400 font-extrabold uppercase tracking-wider truncate">{npc.stage}</p>
                            </div>
                          </div>
                          <span className="text-xs text-amber-300 font-extrabold shrink-0">{npc.relationshipLevel}%</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right: Contact Detail & Sub-Action Dashboard */}
                  <div className="md:col-span-2 space-y-5">
                    {!selectedNpc ? (
                      <div className="text-center py-16 text-gray-500 text-sm">
                        Select a contact from your Rolodex on the left to view profile and interactions.
                      </div>
                    ) : (
                      (() => {
                        const prep = RelationshipEngine.ensureNpcTraits(selectedNpc);
                        const comp = RelationshipEngine.calculateCompatibility(player, prep);

                        return (
                          <div className="space-y-5">
                            {/* Contact Header Card */}
                            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <img src={prep.avatar} alt={prep.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg shrink-0" />
                                <div>
                                  <h3 className="text-xl font-black text-white">{prep.name}, {prep.age}</h3>
                                  <p className="text-xs text-gray-400 font-medium">{prep.occupation} • {prep.country}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                      Stage: {prep.stage}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                      {comp}% Compatibility
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={handleAdvanceStage}
                                className="px-4 py-2.5 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-black shadow-lg transition-all cursor-pointer shrink-0"
                              >
                                Advance Stage Requirement
                              </button>
                            </div>

                            {/* Relationship Metrics Bar */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
                                <span className="text-[10px] text-gray-400 uppercase font-black block">Affinity</span>
                                <span className="text-lg font-black text-rose-400">{prep.relationshipLevel}%</span>
                              </div>
                              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
                                <span className="text-[10px] text-gray-400 uppercase font-black block">Trust</span>
                                <span className="text-lg font-black text-emerald-400">{prep.trustLevel || 50}%</span>
                              </div>
                              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-center">
                                <span className="text-[10px] text-gray-400 uppercase font-black block">Weeks Together</span>
                                <span className="text-lg font-black text-white">{prep.weeksInCurrentStage || 0} wks</span>
                              </div>
                            </div>

                            {/* Sub-action Navigation */}
                            <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
                              <button
                                onClick={() => setRolodexView('OVERVIEW')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  rolodexView === 'OVERVIEW' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white bg-black/30'
                                }`}
                              >
                                Profile
                              </button>
                              <button
                                onClick={() => setRolodexView('ACTIVITIES')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  rolodexView === 'ACTIVITIES' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white bg-black/30'
                                }`}
                              >
                                Activities (15)
                              </button>
                              <button
                                onClick={() => setRolodexView('TALK')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  rolodexView === 'TALK' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white bg-black/30'
                                }`}
                              >
                                Conversation
                              </button>
                              <button
                                onClick={() => setRolodexView('HISTORY')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  rolodexView === 'HISTORY' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white bg-black/30'
                                }`}
                              >
                                History Log
                              </button>
                            </div>

                            {/* Sub-view Content */}
                            {rolodexView === 'OVERVIEW' && (
                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <span className="text-xs text-gray-400 font-bold uppercase">Personality Traits</span>
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {prep.personalityTraits?.map((trait) => (
                                      <span key={trait} className="px-3 py-1 rounded-xl text-xs font-bold bg-white/10 text-gray-200 border border-white/10">
                                        {trait}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                  <span className="text-[10px] text-gray-400 uppercase font-black block">Biography</span>
                                  <p className="text-xs text-gray-300 italic">"{prep.biography}"</p>
                                </div>

                                <div className="pt-2">
                                  <button
                                    onClick={handleBreakup}
                                    className="px-4 py-2.5 rounded-xl text-xs font-black bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                                  >
                                    End Relationship (Breakup)
                                  </button>
                                </div>
                              </div>
                            )}

                            {rolodexView === 'ACTIVITIES' && (
                              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                                <span className="text-xs text-gray-400 font-bold uppercase block">Choose Activity</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {RELATIONSHIP_ACTIVITIES.map((act) => (
                                    <div key={act.id} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                                      <div className="flex items-center justify-between font-black text-white">
                                        <span>{act.name}</span>
                                        <span className="text-emerald-400">${act.cost.toLocaleString()}</span>
                                      </div>
                                      <p className="text-[11px] text-gray-400 leading-tight">{act.description}</p>
                                      <div className="flex items-center justify-between text-[10px] text-gray-300 pt-1 border-t border-white/5">
                                        <span>+{act.affinityGain} Affinity, +{act.trustGain} Trust</span>
                                        <button
                                          onClick={() => handlePerformActivity(act)}
                                          className="px-2.5 py-1 rounded-lg font-bold bg-rose-500 hover:bg-rose-400 text-white cursor-pointer"
                                        >
                                          Go Date
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {rolodexView === 'TALK' && (
                              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                                <span className="text-xs text-gray-400 font-bold uppercase block">Interactive Dynamic Topics</span>
                                {CONVERSATION_TOPICS.map((topic) => (
                                  <div key={topic.id} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                                    <h5 className="font-black text-rose-300 text-sm">{topic.topic}</h5>
                                    <div className="space-y-2">
                                      {topic.options.map((opt, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => handleConversationChoice(opt)}
                                          className="w-full text-left p-2.5 rounded-lg bg-black/60 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/50 transition-all text-gray-200 cursor-pointer block"
                                        >
                                          <p className="font-medium text-xs">{opt.text}</p>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {rolodexView === 'HISTORY' && (
                              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                                <span className="text-xs text-gray-400 font-bold uppercase block">Permanent History Log</span>
                                {(!prep.history || prep.history.length === 0) ? (
                                  <p className="text-xs text-gray-500 text-center py-6">No historical events recorded yet.</p>
                                ) : (
                                  prep.history.map((ev) => (
                                    <div key={ev.id} className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1">
                                      <div className="flex items-center justify-between text-rose-300 font-bold">
                                        <span>{ev.title}</span>
                                        <span className="text-[10px] text-gray-400">{ev.timestamp}</span>
                                      </div>
                                      <p className="text-gray-300 text-[11px]">{ev.description}</p>
                                      {ev.impact && <p className="text-[10px] text-amber-300 font-bold">{ev.impact}</p>}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}

              {/* GIFT STORE TAB */}
              {activeTab === 'GIFTS' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between bg-black/50 p-4 rounded-2xl border border-white/10 text-xs md:text-sm">
                    <span className="text-gray-300 font-medium">
                      Recipient: <strong className="text-amber-300 font-bold">{selectedNpc ? selectedNpc.name : 'Select in My Rolodex'}</strong>
                    </span>
                    <span className="text-emerald-400 font-black">Cash: ${player.money.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GIFT_ITEMS.map((gift) => (
                      <div
                        key={gift.id}
                        className="p-4 rounded-2xl border-2 bg-black/40 border-white/10 flex items-center justify-between gap-3 text-xs md:text-sm shadow-xl"
                      >
                        <div className="space-y-1">
                          <h4 className="font-black text-white text-base">{gift.name}</h4>
                          <p className="text-xs text-gray-400">{gift.description}</p>
                          <span className="text-emerald-400 font-extrabold block">
                            ${gift.price.toLocaleString()} (+{gift.affinityBoost} Affinity)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (!selectedNpc) {
                              alert('Please select a contact from My Rolodex first!');
                              return;
                            }
                            const res = sendGiftToNpc(selectedNpc.id, gift);
                            alert(res.message);
                          }}
                          className="px-4 py-2.5 rounded-xl font-extrabold text-xs bg-rose-500 hover:bg-rose-400 text-white shrink-0 cursor-pointer shadow-lg transition-all"
                        >
                          Send Gift
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRENUP TAB */}
              {activeTab === 'PRENUP' && (
                <div className="space-y-5 max-w-2xl mx-auto bg-black/50 p-6 md:p-8 rounded-3xl border-2 border-white/10 text-xs md:text-sm shadow-2xl">
                  <div className="text-center space-y-1">
                    <Scale className="w-8 h-8 mx-auto text-amber-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Prenuptial Agreement Clause Builder</h3>
                    <p className="text-xs text-gray-400">Configure legally protected asset clauses before Hollywood marriage.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Partner</span>
                      <span className="text-amber-300 font-black text-sm">{selectedNpc ? selectedNpc.name : 'None Selected (Pick in Rolodex)'}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      Status: {prenupTerms.status}
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2.5 max-h-[35vh] overflow-y-auto pr-1">
                    {[
                      { key: 'protectCash', label: 'Protect Liquid Cash & Bank Deposits' },
                      { key: 'protectSavings', label: 'Protect High-Yield Savings Accounts' },
                      { key: 'protectBusinesses', label: 'Protect Studio Holdings & Business Equity' },
                      { key: 'protectRealEstate', label: 'Protect Bel-Air Mansions & Real Estate Units' },
                      { key: 'protectInvestments', label: 'Protect Stock Portfolios & Venture Investments' },
                      { key: 'protectRoyalties', label: 'Protect Film Royalties & Box Office Residuals' },
                      { key: 'protectLuxuryAssets', label: 'Protect Luxury Cars, Watches & Art Assets' },
                      { key: 'protectFutureEarnings', label: 'Protect Future Acting & Directing Contracts' },
                      { key: 'protectInheritance', label: 'Protect Family Inheritance Reserves' },
                      { key: 'protectDebtResponsibility', label: 'Individual Debt Responsibility Clause' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={(prenupTerms as any)[item.key]}
                          onChange={(e) => setPrenupTerms({ ...prenupTerms, [item.key]: e.target.checked })}
                          className="w-4 h-4 rounded bg-gray-900 accent-amber-400"
                        />
                        <span className="text-gray-200 font-bold text-xs">{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleEvaluatePrenup}
                    className="w-full py-4 rounded-2xl font-black text-sm bg-amber-400 hover:bg-amber-300 text-black shadow-2xl cursor-pointer transition-all"
                  >
                    Submit Prenup Terms to Partner & Lawyer
                  </button>
                </div>
              )}

              {/* WEDDING TAB */}
              {activeTab === 'WEDDING' && (
                <div className="space-y-5 max-w-xl mx-auto bg-black/50 p-6 md:p-8 rounded-3xl border-2 border-white/10 text-xs md:text-sm shadow-2xl">
                  <div className="text-center space-y-1">
                    <Crown className="w-8 h-8 mx-auto text-amber-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Marriage Proposal & Wedding</h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                    <label className="block text-gray-400 font-bold text-xs uppercase mb-1">Partner Selected</label>
                    <span className="text-amber-300 font-black text-base block">{selectedNpc ? selectedNpc.name : 'Select in Rolodex'}</span>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1.5">Wedding Venue</label>
                    <select
                      value={venue}
                      onChange={(e) => setVenue(e.target.value as any)}
                      className="w-full p-3.5 rounded-xl bg-gray-900 border border-white/15 text-white font-bold"
                    >
                      <option value="Church">Traditional Beverly Hills Church ($10,000)</option>
                      <option value="Beach">Malibu Sunset Beach Estate ($25,000)</option>
                      <option value="Luxury Hotel">The Ritz-Carlton Gala Hall ($50,000)</option>
                      <option value="Private Estate">Bel-Air Private Mansion ($100,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1.5">Engagement Ring Value ($10,000 - $250,000)</label>
                    <input
                      type="range"
                      min={10000}
                      max={250000}
                      step={5000}
                      value={ringCost}
                      onChange={(e) => setRingCost(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                    <span className="text-amber-300 font-black block mt-1.5 text-base">${ringCost.toLocaleString()} Diamond Ring</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handlePropose}
                      className="py-3.5 rounded-2xl font-black text-xs bg-rose-500 hover:bg-rose-400 text-white shadow-xl cursor-pointer transition-all"
                    >
                      Propose Engagement (${ringCost.toLocaleString()})
                    </button>
                    <button
                      onClick={handleWedding}
                      className="py-3.5 rounded-2xl font-black text-xs bg-amber-400 hover:bg-amber-300 text-black shadow-xl cursor-pointer transition-all"
                    >
                      Host Official Wedding Ceremony
                    </button>
                  </div>
                </div>
              )}

              {/* FAMILY TAB */}
              {activeTab === 'FAMILY' && (
                <div className="space-y-5 max-w-xl mx-auto bg-black/50 p-6 md:p-8 rounded-3xl border-2 border-white/10 text-xs md:text-sm shadow-2xl">
                  <div className="text-center space-y-1">
                    <Baby className="w-8 h-8 mx-auto text-rose-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Family & Children</h3>
                  </div>

                  {(!selectedNpc || selectedNpc.stage !== 'Married') ? (
                    <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                      <AlertTriangle className="w-8 h-8 mx-auto text-amber-400" />
                      <h4 className="font-bold text-amber-300">Family Feature Locked</h4>
                      <p className="text-xs text-gray-300">
                        Family and Children options strictly unlock after getting Married. Complete your engagement and host a wedding ceremony first.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-center">
                        <span className="text-gray-400 block text-xs uppercase font-bold">Children Count</span>
                        <span className="text-2xl font-black text-white">
                          {selectedNpc.children?.length || player.childrenCount || 0}
                        </span>
                      </div>

                      {/* Existing children list */}
                      {selectedNpc.children && selectedNpc.children.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs text-gray-400 font-bold uppercase block">Your Children</span>
                          {selectedNpc.children.map((child) => (
                            <div key={child.id} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                              <div>
                                <h5 className="font-bold text-white">{child.name} ({child.gender})</h5>
                                <p className="text-[11px] text-gray-400">{child.schoolType}</p>
                              </div>
                              <span className="text-rose-300 font-bold">{child.personality}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-white/10 pt-4 space-y-3">
                        <h4 className="font-bold text-white text-xs uppercase">Welcome New Child</h4>
                        <input
                          type="text"
                          placeholder="Child Name (Optional)"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white text-xs font-bold"
                        />

                        <select
                          value={childGender}
                          onChange={(e) => setChildGender(e.target.value as any)}
                          className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white text-xs font-bold"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Non-Binary">Non-Binary</option>
                        </select>

                        <select
                          value={childSchool}
                          onChange={(e) => setChildSchool(e.target.value as any)}
                          className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white text-xs font-bold"
                        >
                          <option value="Public School">Public School</option>
                          <option value="Private School">Beverly Hills Private School</option>
                          <option value="Boarding School">Swiss Boarding Academy</option>
                          <option value="University">USC / UCLA Film University</option>
                        </select>

                        <button
                          onClick={handleHaveChild}
                          className="w-full py-4 rounded-2xl font-black text-sm bg-rose-500 hover:bg-rose-400 text-white shadow-2xl cursor-pointer transition-all"
                        >
                          Welcome New Child to Family
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
