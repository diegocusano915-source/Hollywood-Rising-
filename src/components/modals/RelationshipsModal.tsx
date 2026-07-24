/**
 * HOLLYWOOD RISING - Relationships & Dating System (Redesigned Phase 1 Update)
 * Premium Raya/Tinder style dating cards, large profile pictures, spacious bio, big action buttons.
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
} from 'lucide-react';
import { GIFT_ITEMS } from '../../database/storageService';
import { Gender, GiftItem } from '../../types/game';
import { THEMES } from '../../theme/colors';

export const RelationshipsModal: React.FC = () => {
  const {
    setActiveModal,
    player,
    relationships,
    setupDatingProfile,
    interactNpc,
    sendGiftToNpc,
    proposeMarriage,
    haveChild,
    settings,
  } = useGame();

  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<'MATCH' | 'DEX' | 'GIFTS' | 'WEDDING' | 'FAMILY'>('MATCH');

  // Dating Profile Form
  const [prefGender, setPrefGender] = useState<Gender>('Female');
  const [prefAge, setPrefAge] = useState<number>(24);
  const [prefCountry, setPrefCountry] = useState<string>('United States');
  const [prefType, setPrefType] = useState<'Men' | 'Women' | 'Everyone'>('Everyone');

  // Selected NPC for actions
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(
    relationships.length > 0 ? relationships[0].id : null
  );

  // Wedding form
  const [venue, setVenue] = useState<'Church' | 'Beach' | 'Luxury Hotel' | 'Private Estate'>('Luxury Hotel');
  const [ringCost, setRingCost] = useState<number>(10000);
  const [prenup, setPrenup] = useState<boolean>(true);

  // Child school form
  const [school, setSchool] = useState<'Public School' | 'Private School' | 'Boarding School' | 'University'>('Private School');

  const selectedNpc = relationships.find((r) => r.id === selectedNpcId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col overflow-hidden border-2 shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-5 md:p-6 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40">
              <Heart className="w-6 h-6 text-rose-400 fill-current" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                Hollywood Dating & Relationships
              </h2>
              <p className="text-xs text-gray-400">Raya-style elite networking & personal relationships</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dating Profile Setup Banner if not created */}
        {!player.datingProfile?.created ? (
          <div className="p-6 md:p-10 space-y-6 overflow-y-auto max-h-[80vh]">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center">
                <Heart className="w-10 h-10 text-rose-400 animate-bounce fill-current" />
              </div>
              <h3 className="text-2xl font-black text-white">Create Your Hollywood Dating Profile</h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                Join Hollywood's premiere singles network. Connect with directors, co-stars, models, and industry leaders.
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto bg-black/50 p-6 rounded-2xl border border-white/10 text-sm">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Your Gender Identity</label>
                <select
                  value={prefGender}
                  onChange={(e) => setPrefGender(e.target.value as Gender)}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-bold"
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
                  className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-bold"
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
                Launch Elite Dating Profile
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="p-3 bg-black/50 border-b border-white/10 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('MATCH')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer ${
                  activeTab === 'MATCH' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                Dating Singles
              </button>
              <button
                onClick={() => setActiveTab('DEX')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer ${
                  activeTab === 'DEX' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                My Rolodex ({relationships.filter((r) => r.stage !== 'Stranger').length})
              </button>
              <button
                onClick={() => setActiveTab('GIFTS')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer ${
                  activeTab === 'GIFTS' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                Gift Store
              </button>
              <button
                onClick={() => setActiveTab('WEDDING')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer ${
                  activeTab === 'WEDDING' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                Marriage
              </button>
              <button
                onClick={() => setActiveTab('FAMILY')}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all shrink-0 cursor-pointer ${
                  activeTab === 'FAMILY' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white bg-black/30'
                }`}
              >
                Children
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">
              {/* MATCH TAB */}
              {activeTab === 'MATCH' && (
                <div className="space-y-4">
                  {relationships.filter((r) => r.stage === 'Stranger').length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <Heart className="w-16 h-16 mx-auto text-gray-600 animate-pulse" />
                      <h3 className="text-lg font-bold text-gray-300">Reviewed All Profiles This Week</h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        Advance the week on your Game Home dashboard to generate fresh Hollywood dating candidates.
                      </p>
                    </div>
                  ) : (
                    relationships
                      .filter((r) => r.stage === 'Stranger')
                      .slice(0, 1)
                      .map((npc) => (
                        <div
                          key={npc.id}
                          className="rounded-3xl border-2 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start bg-black/50 shadow-2xl relative"
                          style={{ borderColor: theme.borderDark }}
                        >
                          {/* Profile Image Card */}
                          <div className="w-full md:w-64 h-72 md:h-96 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-2xl relative bg-gray-900">
                            <img src={npc.avatar} alt={npc.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow">
                                {npc.occupation}
                              </span>
                            </div>
                          </div>

                          {/* Profile Details */}
                          <div className="flex-1 space-y-4 w-full">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white">
                                  {npc.name}, <span className="text-rose-400">{npc.age}</span>
                                </h3>
                                <p className="text-sm text-gray-400 font-medium mt-0.5">{npc.country}</p>
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Biography</span>
                              <p className="text-sm text-gray-200 leading-relaxed italic font-medium">"{npc.biography}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs md:text-sm p-4 rounded-2xl bg-black/40 border border-white/5">
                              <div><span className="text-gray-400">Personality:</span> <strong className="text-white block mt-0.5">{npc.personality}</strong></div>
                              <div><span className="text-gray-400">Lifestyle:</span> <strong className="text-white block mt-0.5">{npc.lifestyle}</strong></div>
                              <div className="col-span-2"><span className="text-gray-400">Relationship Goal:</span> <strong className="text-amber-300 block mt-0.5">{npc.relationshipGoals}</strong></div>
                            </div>

                            {/* Interested vs Pass Action Buttons */}
                            <div className="pt-4 flex items-center gap-4">
                              <button
                                onClick={() => interactNpc(npc.id, 'Pass')}
                                className="flex-1 py-4 rounded-2xl font-black text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                              >
                                <XCircle className="w-5 h-5 text-gray-400" />
                                Pass
                              </button>
                              <button
                                onClick={() => interactNpc(npc.id, 'Interested')}
                                className="flex-1 py-4 rounded-2xl font-black text-sm bg-rose-500 hover:bg-rose-400 text-white shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                              >
                                <Heart className="w-5 h-5 fill-current" />
                                Interested (Match)
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* ROLODEX TAB */}
              {activeTab === 'DEX' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Rolodex Contacts</h4>
                  {relationships.filter((r) => r.stage !== 'Stranger').length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-12 bg-black/30 rounded-2xl border border-white/5">
                      No active matches or connections yet. Swipe on Dating Singles to match.
                    </p>
                  ) : (
                    relationships
                      .filter((r) => r.stage !== 'Stranger')
                      .map((npc) => (
                        <div
                          key={npc.id}
                          onClick={() => setSelectedNpcId(npc.id)}
                          className={`p-4 md:p-5 rounded-2xl border-2 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-xl ${
                            selectedNpcId === npc.id ? 'bg-rose-500/10 border-rose-500/80' : 'bg-black/40 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <img src={npc.avatar} alt={npc.name} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0" />
                            <div>
                              <h4 className="text-base md:text-lg font-black text-white">{npc.name}</h4>
                              <p className="text-xs text-gray-400 font-medium">{npc.occupation} • Stage: <strong className="text-rose-400 font-bold">{npc.stage}</strong></p>
                            </div>
                          </div>

                          <div className="text-right text-xs md:text-sm">
                            <span className="text-amber-300 font-extrabold block">{npc.relationshipLevel}% Affinity</span>
                            <span className="text-xs text-gray-400 block font-medium">{npc.weeksInCurrentStage} Weeks Together</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* GIFT STORE TAB */}
              {activeTab === 'GIFTS' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between bg-black/50 p-4 rounded-2xl border border-white/10 text-xs md:text-sm">
                    <span className="text-gray-300 font-medium">
                      Selected Partner: <strong className="text-amber-300 font-bold">{selectedNpc ? selectedNpc.name : 'None Selected (Pick in Rolodex)'}</strong>
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

              {/* MARRIAGE TAB */}
              {activeTab === 'WEDDING' && (
                <div className="space-y-5 max-w-xl mx-auto bg-black/50 p-6 md:p-8 rounded-3xl border-2 border-white/10 text-xs md:text-sm shadow-2xl">
                  <div className="text-center space-y-1">
                    <Crown className="w-8 h-8 mx-auto text-amber-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Hollywood Marriage Proposal</h3>
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
                      <option value="Church">Traditional Beverly Hills Church</option>
                      <option value="Beach">Malibu Sunset Beach Estate</option>
                      <option value="Luxury Hotel">The Ritz-Carlton Gala Hall</option>
                      <option value="Private Estate">Bel-Air Private Mansion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1.5">Engagement Ring Value ($10,000 - $100,000)</label>
                    <input
                      type="range"
                      min={10000}
                      max={100000}
                      step={5000}
                      value={ringCost}
                      onChange={(e) => setRingCost(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                    <span className="text-amber-300 font-black block mt-1.5 text-base">${ringCost.toLocaleString()} Diamond Ring</span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="prenupCheck"
                      checked={prenup}
                      onChange={(e) => setPrenup(e.target.checked)}
                      className="w-5 h-5 rounded bg-gray-900 accent-amber-400"
                    />
                    <label htmlFor="prenupCheck" className="text-gray-200 font-bold">Sign Hollywood Prenuptial Agreement</label>
                  </div>

                  <button
                    onClick={() => {
                      const res = proposeMarriage(venue, ringCost, prenup);
                      alert(res.message);
                    }}
                    className="w-full py-4 mt-3 rounded-2xl font-black text-base bg-amber-400 hover:bg-amber-300 text-black shadow-2xl cursor-pointer transition-all"
                  >
                    Propose Marriage (${ringCost.toLocaleString()})
                  </button>
                </div>
              )}

              {/* FAMILY TAB */}
              {activeTab === 'FAMILY' && (
                <div className="space-y-5 max-w-xl mx-auto bg-black/50 p-6 md:p-8 rounded-3xl border-2 border-white/10 text-xs md:text-sm shadow-2xl">
                  <div className="text-center space-y-1">
                    <Baby className="w-8 h-8 mx-auto text-rose-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Family & Children</h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-center">
                    <span className="text-gray-400 block text-xs uppercase font-bold">Children Count</span>
                    <span className="text-2xl font-black text-white">{player.childrenCount || 0}</span>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1.5">Schooling System</label>
                    <select
                      value={school}
                      onChange={(e) => setSchool(e.target.value as any)}
                      className="w-full p-3.5 rounded-xl bg-gray-900 border border-white/15 text-white font-bold"
                    >
                      <option value="Public School">Public School</option>
                      <option value="Private School">Beverly Hills Private School</option>
                      <option value="Boarding School">Swiss Boarding Academy</option>
                      <option value="University">USC / UCLA Film University</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      const res = haveChild(school);
                      alert(res.message);
                    }}
                    className="w-full py-4 rounded-2xl font-black text-base bg-rose-500 hover:bg-rose-400 text-white shadow-2xl cursor-pointer transition-all"
                  >
                    Welcome New Child
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
