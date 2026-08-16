/**
 * HOLLYWOOD RISING — STAR MATCH (Relationships rebuild, Option A)
 * Swipe deck with FIXED traits + real compatibility, dual-meter rolodex,
 * energy-priced conversations (no free spam), the full stage ladder with
 * live gate checklists, prenup clause builder, weeks-gated proposal &
 * wedding, and real pregnancy — conceive, carry 36-40 weeks, give birth
 * to a named child. Stages advance ONLY through the engine's gates.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Heart, XCircle, Gift, Scale, Crown, Baby, ChevronLeft } from 'lucide-react';
import { GIFT_ITEMS } from '../../database/storageService';
import { Gender, GiftItem, NpcProfile, PrenupTerms } from '../../types/game';
import { RelationshipEngine, RELATIONSHIP_ACTIVITIES, CONVERSATION_TOPICS } from '../../services/relationshipService';

const STAGE_LADDER = ['Acquaintance', 'Friend', 'Close Friend', 'Dating', 'Exclusive', 'Partner', 'Engaged', 'Married'] as const;

const STAGE_GATES: Record<string, { aff: number; tru: number; wks: number; comp?: number }> = {
  Acquaintance: { aff: 30, tru: 25, wks: 2 },
  Friend: { aff: 50, tru: 40, wks: 4 },
  'Close Friend': { aff: 65, tru: 55, wks: 4, comp: 45 },
  Dating: { aff: 75, tru: 70, wks: 6 },
  Exclusive: { aff: 85, tru: 80, wks: 8 },
};

const TOPIC_COST_ENERGY = 5;

export const RelationshipsModal: React.FC = () => {
  const game = useGame();
  const { setActiveModal, player, relationships, setupDatingProfile, interactNpc, sendGiftToNpc, updateSave, saveData } = game;

  const [tab, setTab] = useState<'DISCOVER' | 'PEOPLE' | 'TALK' | 'GIFTS' | 'MARRIAGE' | 'FAMILY'>('DISCOVER');
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(relationships.find((r) => r.stage !== 'Stranger')?.id || null);
  const [fb, setFb] = useState<string | null>(null);
  const [fbOk, setFbOk] = useState(true);
  const [view, setView] = useState<'PROFILE' | 'DATES' | 'HISTORY'>('PROFILE');

  // dating profile form
  const [prefGender, setPrefGender] = useState<Gender>('Male');
  const [prefType, setPrefType] = useState<'Men' | 'Women' | 'Everyone'>('Everyone');
  const [prefCountry, setPrefCountry] = useState('United States');

  // marriage form
  const [venue, setVenue] = useState<'Church' | 'Beach' | 'Luxury Hotel' | 'Private Estate'>('Luxury Hotel');
  const [ringCost, setRingCost] = useState(50000);
  const [prenup, setPrenup] = useState<PrenupTerms>({
    protectCash: true, protectSavings: true, protectBusinesses: true, protectRealEstate: true,
    protectInvestments: true, protectRoyalties: true, protectLuxuryAssets: false,
    protectFutureEarnings: true, protectInheritance: true, protectDebtResponsibility: true,
    status: 'NOT_STARTED',
  });

  // pregnancy form
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState<'Male' | 'Female' | 'Non-Binary'>('Female');

  const showFb = (msg: string, ok = true) => { setFbOk(ok); setFb(msg); setTimeout(() => setFb(null), 5000); };

  const selectedNpc = relationships.find((r) => r.id === selectedNpcId);
  const candidates = relationships.filter((r) => r.stage === 'Stranger');
  const activeContacts = relationships.filter((r) => r.stage !== 'Stranger');
  const partner = relationships.find((r) => r.stage === 'Married') || selectedNpc;

  const updateNpc = (updated: NpcProfile, updatedPlayer?: any) => {
    updateSave({
      ...saveData,
      player: updatedPlayer ? { ...saveData.player, ...updatedPlayer } : saveData.player,
      relationships: relationships.map((r) => (r.id === updated.id ? updated : r)),
    });
  };

  // ---------- actions ----------
  const handleMatch = (c: NpcProfile) => {
    const res = RelationshipEngine.processMatchAttempt(player, c);
    updateNpc(res.updatedNpc);
    showFb(res.message, res.status === 'ACCEPTED');
  };

  const handlePass = (c: NpcProfile) => {
    interactNpc(c.id, 'Pass');
    showFb(`Passed on ${c.name}. A new candidate arrives next week.`);
  };

  const handleActivity = (act: typeof RELATIONSHIP_ACTIVITIES[0]) => {
    if (!selectedNpc) return;
    const res = RelationshipEngine.performActivity(player, selectedNpc, act);
    if (!res.success) { showFb(res.message, false); return; }
    if (res.updatedNpc) updateNpc(res.updatedNpc, res.updatedPlayer);
    showFb(res.message);
  };

  const handleTopic = (opt: any) => {
    if (!selectedNpc) return;
    if ((player.energy || 0) < TOPIC_COST_ENERGY) {
      showFb(`Conversations cost ${TOPIC_COST_ENERGY}⚡ — rest first (you have ${player.energy || 0}).`, false);
      return;
    }
    const res = RelationshipEngine.handleConversationOption(player, selectedNpc, opt);
    updateNpc(res.updatedNpc, { energy: (player.energy || 0) - TOPIC_COST_ENERGY });
    showFb(`${selectedNpc.name}: ${res.message}`);
  };

  const handleAdvance = () => {
    if (!selectedNpc) return;
    const res = RelationshipEngine.advanceStage(player, selectedNpc);
    showFb(res.message, res.success);
    if (res.success && res.updatedNpc) updateNpc(res.updatedNpc);
  };

  const handleGift = (gift: GiftItem) => {
    if (!selectedNpc) { showFb('Select a person first.', false); return; }
    const res: any = sendGiftToNpc(selectedNpc.id, gift);
    showFb(res.message, res.success);
  };

  const handlePrenup = () => {
    if (!selectedNpc) return;
    const res = RelationshipEngine.evaluatePrenupReaction(selectedNpc, prenup);
    setPrenup(res.updatedTerms);
    updateNpc({ ...selectedNpc, prenupTerms: res.updatedTerms, trustLevel: Math.max(0, Math.min(100, (selectedNpc.trustLevel || 50) + res.trustChange)) });
    showFb(`Prenup ${res.status}: ${res.npcFeedback} (trust ${res.trustChange >= 0 ? '+' : ''}${res.trustChange})`, res.status === 'AGREED');
  };

  const handlePropose = () => {
    if (!selectedNpc) return;
    if ((selectedNpc.prenupTerms?.status || 'NOT_STARTED') !== 'AGREED') {
      showFb('Your partner must AGREE to a prenup first — visit the prenup builder below.', false);
      return;
    }
    if (player.money < ringCost) { showFb(`Ring costs $${ringCost.toLocaleString()}.`, false); return; }
    const res = RelationshipEngine.evaluateProposal(player, selectedNpc, ringCost);
    if (!res.accepted) { showFb(res.message, false); return; }
    updateNpc({
      ...selectedNpc,
      stage: 'Engaged',
      weeksInCurrentStage: 0,
      relationshipLevel: 100,
      trustLevel: Math.min(100, (selectedNpc.trustLevel || 80) + 10),
      history: [...(selectedNpc.history || []), {
        id: `prop_${Date.now()}`, type: 'PROPOSAL' as any, title: 'Engagement Proposal Accepted!',
        description: `Proposed with a $${ringCost.toLocaleString()} ring.`, timestamp: `Week ${player.dateWeek}, ${player.dateYear}`,
      }],
    }, { money: player.money - ringCost });
    showFb(`💍 ${res.message}`);
  };

  const handleWedding = () => {
    if (!selectedNpc) return;
    if (selectedNpc.stage !== 'Engaged') { showFb('Propose first — the wedding follows the engagement.', false); return; }
    if ((selectedNpc.weeksInCurrentStage || 0) < 4) {
      showFb(`Weddings need planning time — ${4 - (selectedNpc.weeksInCurrentStage || 0)} more week(s) engaged first.`, false);
      return;
    }
    const venueCost = venue === 'Church' ? 10000 : venue === 'Beach' ? 25000 : venue === 'Luxury Hotel' ? 50000 : 100000;
    if (player.money < venueCost) { showFb(`Venue costs $${venueCost.toLocaleString()}.`, false); return; }
    updateNpc({
      ...selectedNpc,
      stage: 'Married',
      weeksInCurrentStage: 0,
      relationshipLevel: 100,
      history: [...(selectedNpc.history || []), {
        id: `wed_${Date.now()}`, type: 'WEDDING' as any, title: 'Official Hollywood Wedding',
        description: `Married at the ${venue}.`, timestamp: `Week ${player.dateWeek}, ${player.dateYear}`,
      }],
    }, { money: player.money - venueCost, activeRelationshipId: selectedNpc.id, weddingVenue: venue });
    showFb(`💒 You and ${selectedNpc.name} are officially married! Family unlocks now.`);
  };

  const handleConceive = () => {
    if (!partner) { showFb('No spouse selected.', false); return; }
    const res = RelationshipEngine.tryConceive(player, partner, babyName, babyGender);
    showFb(res.message, res.success);
    if (res.updatedNpc) updateNpc(res.updatedNpc);
  };

  // ---------- setup gate ----------
  if (!player.datingProfile?.created) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md">
        <div className="w-full max-w-sm rounded-3xl border border-rose-500/30 p-6 text-center space-y-4" style={{ background: 'linear-gradient(170deg,#1a0f18,#0d0710)' }}>
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/15 border-2 border-rose-500/40 flex items-center justify-center">
            <Heart className="w-8 h-8 text-rose-400 fill-current animate-bounce" />
          </div>
          <h3 className="text-xl font-black text-white">Create Your Star Match Profile</h3>
          <p className="text-[10px] text-gray-400 leading-relaxed">Hollywood's premier singles network. Every bond earned — traits are fixed, matches can decline, stages are gated.</p>
          <div className="space-y-2 text-left">
            <select value={prefGender} onChange={(e) => setPrefGender(e.target.value as Gender)} className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-bold">
              <option value="Male">I am: Male</option><option value="Female">Female</option><option value="Non-Binary">Non-Binary</option>
            </select>
            <select value={prefType} onChange={(e) => setPrefType(e.target.value as any)} className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-bold">
              <option value="Women">Seeking: Women</option><option value="Men">Men</option><option value="Everyone">Everyone</option>
            </select>
          </div>
          <button onClick={() => setupDatingProfile(prefGender, 26, prefCountry, prefType)} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-700 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-500/30">
            LAUNCH PROFILE
          </button>
          <button onClick={() => setActiveModal('none')} className="text-[10px] text-gray-500 cursor-pointer">cancel</button>
        </div>
      </div>
    );
  }

  // ---------- gate checklist renderer ----------
  const GateCheck = ({ npc }: { npc: NpcProfile }) => {
    const stage = npc.stage;
    if (stage === 'Partner' || stage === 'Engaged' || stage === 'Married') {
      return <p className="text-[8px] text-gray-500 leading-relaxed px-1">{stage === 'Partner' ? 'Propose in the Marriage tab (prenup + weeks gates apply).' : stage === 'Engaged' ? 'Host the wedding in the Marriage tab (4+ wks engaged).' : 'Family tab unlocked — pregnancy & children.'}</p>;
    }
    const gate = STAGE_GATES[stage];
    if (!gate) return null;
    const aff = npc.relationshipLevel || 0;
    const tru = npc.trustLevel || 0;
    const wks = npc.weeksInCurrentStage || 0;
    const comp = npc.compatibilityScore || 50;
    const lines = [
      { label: `Affinity ${gate.aff}`, ok: aff >= gate.aff, val: `${aff}/${gate.aff}` },
      { label: `Trust ${gate.tru}`, ok: tru >= gate.tru, val: `${tru}/${gate.tru}` },
      ...(gate.comp ? [{ label: `Compatibility ${gate.comp}`, ok: comp >= gate.comp, val: `${comp}/${gate.comp}` }] : []),
      { label: `Weeks as ${stage} (${gate.wks}+)`, ok: wks >= gate.wks, val: `${wks}/${gate.wks}` },
    ];
    return (
      <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-2.5 space-y-1">
        <b className="text-[8px] font-black text-rose-300 tracking-wider block">ADVANCE TO NEXT STAGE — GATES</b>
        {lines.map((l) => (
          <div key={l.label} className="flex justify-between text-[8.5px]">
            <span className="text-gray-400">{l.label}</span>
            <b className={`font-mono ${l.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{l.ok ? '✓' : '✕'} {l.val}</b>
          </div>
        ))}
        <button onClick={handleAdvance} className="w-full mt-1.5 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 text-white text-[9px] font-black cursor-pointer">
          {lines.every((l) => l.ok) ? '♥ ADVANCE STAGE' : 'REQUIREMENTS NOT MET'}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md max-h-[94vh] rounded-3xl overflow-hidden flex flex-col border border-rose-500/25" style={{ background: 'linear-gradient(170deg,#1a0f18,#0d0710)' }}>
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-800 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Heart className="w-4.5 h-4.5 w-4 h-4 text-white fill-current" />
            </div>
            <div>
              <b className="text-white text-sm block">Star Match</b>
              <span className="text-[7px] text-gray-500 tracking-[2px]">HOLLYWOOD LOVE · EARNED, NEVER FAKED</span>
            </div>
          </div>
          <button onClick={() => setActiveModal('none')} className="p-2 rounded-xl text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {/* tabs */}
        <div className="flex gap-1 px-2.5 py-2 border-b border-white/10 bg-black/30">
          {([['DISCOVER', '🔥'], ['PEOPLE', '👥'], ['TALK', '💬'], ['GIFTS', '🎁'], ['MARRIAGE', '💍'], ['FAMILY', '👶']] as const).map(([t, ic]) => (
            <button key={t} onClick={() => setTab(t as any)}
              className={`flex-1 py-2 rounded-lg text-[7.5px] font-black cursor-pointer ${tab === t ? 'bg-gradient-to-b from-rose-500 to-rose-700 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
              <span className="block text-[13px] leading-none mb-0.5">{ic}</span>{t}
            </button>
          ))}
        </div>

        {fb && <div className={`mx-3 mt-2 p-2.5 rounded-xl border text-[10px] font-bold ${fbOk ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300' : 'bg-rose-500/10 border-rose-400/30 text-rose-300'}`}>{fb}</div>}

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* ================= DISCOVER ================= */}
          {tab === 'DISCOVER' && (
            candidates.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-10 h-10 mx-auto text-gray-700 animate-pulse" />
                <p className="text-[11px] text-gray-400 font-bold mt-3">Reviewed everyone for now.</p>
                <p className="text-[8.5px] text-gray-600 mt-1">New singles arrive as you advance weeks (and when you pass).</p>
              </div>
            ) : (
              (() => {
                const prep = RelationshipEngine.ensureNpcTraits(candidates[0]);
                const comp = RelationshipEngine.calculateCompatibility(player, prep);
                return (
                  <div className="rounded-2xl overflow-hidden border border-white/12">
                    <div className="h-64 relative" style={{ background: 'linear-gradient(150deg,#2d1a26,#140a10)' }}>
                      <img src={prep.avatar} alt="" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-3 right-3 w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#f43f5e 0deg ${Math.round((comp / 100) * 360)}deg, rgba(255,255,255,0.15) ${Math.round((comp / 100) * 360)}deg 360deg)` }}>
                        <span className="w-11 h-11 rounded-full bg-[#1a0f18] flex flex-col items-center justify-center">
                          <b className="text-[13px] text-rose-400">{comp}</b>
                          <span className="text-[5px] text-gray-500">FIT</span>
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#0d0710] to-transparent">
                        <h3 className="text-lg font-black text-white">{prep.name}, <span className="text-rose-400">{prep.age}</span></h3>
                        <p className="text-[8.5px] text-gray-300">{prep.occupation} · {prep.country}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-black/40 space-y-2">
                      <div className="flex gap-1.5 flex-wrap">
                        {(prep.personalityTraits || []).map((t) => (
                          <span key={t} className="text-[7px] font-black px-2.5 py-1 rounded-full bg-rose-500/12 text-rose-300 border border-rose-500/30">{t}</span>
                        ))}
                        <span className="text-[7px] font-black px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">{prep.relationshipGoals}</span>
                      </div>
                      <p className="text-[9px] text-gray-400 italic leading-relaxed">"{prep.biography}"</p>
                      <div className="flex gap-4 justify-center pt-1">
                        <button onClick={() => handlePass(prep)} className="w-12 h-12 rounded-full bg-white/8 border border-white/15 flex items-center justify-center cursor-pointer hover:bg-white/15">
                          <XCircle className="w-5 h-5 text-gray-400" />
                        </button>
                        <button onClick={() => handleMatch(prep)} className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-rose-500 to-rose-700 shadow-lg shadow-rose-500/40 hover:scale-105 transition-transform">
                          <Heart className="w-7 h-7 text-white fill-current" />
                        </button>
                      </div>
                      <p className="text-[6.5px] text-gray-600 text-center">TRAITS + FIT FIXED PER PERSON — SAME VALUES INSIDE THE MATCH ROLL · DECLINES ARE REAL</p>
                    </div>
                  </div>
                );
              })()
            )
          )}

          {/* ================= PEOPLE ================= */}
          {tab === 'PEOPLE' && (
            <>
              <div className="flex gap-1.5">
                {(['PROFILE', 'DATES', 'HISTORY'] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)} className={`flex-1 py-1.5 rounded-lg text-[8px] font-black cursor-pointer ${view === v ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>{v}</button>
                ))}
              </div>
              {activeContacts.length === 0 ? (
                <p className="text-center text-[10px] text-gray-500 py-10">No connections yet — match someone in Discover.</p>
              ) : (
                <div className="space-y-1.5">
                  {activeContacts.map((npc) => {
                    const sel = npc.id === selectedNpcId;
                    return (
                      <button key={npc.id} onClick={() => { setSelectedNpcId(npc.id); setView('PROFILE'); }}
                        className={`w-full flex gap-2.5 items-center rounded-2xl border px-3 py-2.5 cursor-pointer text-left ${sel ? 'border-rose-500/60 bg-rose-500/10' : 'border-white/10 bg-black/40 hover:border-white/20'}`}>
                        <img src={npc.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/15" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <b className="text-[10.5px] text-white truncate">{npc.name}</b>
                            {npc.pregnancy && <span className="text-[6px] font-black bg-amber-400/15 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full shrink-0">🤰 {npc.pregnancy.weeksUntilBirth}WK</span>}
                          </div>
                          <span className="text-[6.5px] font-black uppercase tracking-wider block" style={{ color: npc.stage === 'Married' ? '#f5b942' : '#fb7185' }}>
                            {npc.stage} · {npc.weeksInCurrentStage || 0} WKS{npc.children?.length ? ` · ${npc.children.length} kid${npc.children.length > 1 ? 's' : ''}` : ''}
                          </span>
                          <div className="flex gap-2 mt-1">
                            <span className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden"><i className="block h-full bg-rose-500" style={{ width: `${npc.relationshipLevel || 0}%` }} /></span>
                            <span className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden"><i className="block h-full bg-emerald-400" style={{ width: `${npc.trustLevel || 0}%` }} /></span>
                          </div>
                        </div>
                        <b className="text-[9px] text-rose-400 font-mono shrink-0">{npc.relationshipLevel || 0}%</b>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ladder + gates for the selected person */}
              {selectedNpc && (
                <>
                  <div className="flex gap-1">
                    {STAGE_LADDER.map((s) => {
                      const idx = STAGE_LADDER.indexOf(selectedNpc.stage as any);
                      const my = STAGE_LADDER.indexOf(s);
                      return <span key={s} className={`flex-1 text-center text-[5.5px] font-black py-1.5 rounded ${my === idx ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : my < idx ? 'bg-rose-500/15 text-rose-300' : 'bg-white/5 text-gray-600'}`}>{s.split(' ')[0].toUpperCase()}</span>;
                    })}
                  </div>
                  <GateCheck npc={selectedNpc} />
                </>
              )}

              {selectedNpc && view === 'PROFILE' && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3 space-y-2">
                  <b className="text-[10px] text-white block">{selectedNpc.name}, {selectedNpc.age}</b>
                  <p className="text-[8.5px] text-gray-400 italic">"{selectedNpc.biography}"</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {(selectedNpc.personalityTraits || []).map((t) => <span key={t} className="text-[7px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10">{t}</span>)}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-black/40 rounded-lg p-2"><span className="text-[6px] text-gray-500 block">AFFINITY</span><b className="text-[12px] text-rose-400">{selectedNpc.relationshipLevel || 0}%</b></div>
                    <div className="bg-black/40 rounded-lg p-2"><span className="text-[6px] text-gray-500 block">TRUST</span><b className="text-[12px] text-emerald-400">{selectedNpc.trustLevel || 0}%</b></div>
                    <div className="bg-black/40 rounded-lg p-2"><span className="text-[6px] text-gray-500 block">COMPAT</span><b className="text-[12px] text-sky-400">{selectedNpc.compatibilityScore || 50}%</b></div>
                  </div>
                  <button onClick={() => { if (window.confirm(`End things with ${selectedNpc.name}? Lasting consequences.`)) { const res = RelationshipEngine.processBreakup(player, selectedNpc, 'Personal Differences'); updateNpc(res.updatedNpc); showFb(res.message); } }}
                    className="w-full py-2 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/25 text-[8.5px] font-black cursor-pointer">
                    END RELATIONSHIP
                  </button>
                </div>
              )}

              {selectedNpc && view === 'DATES' && (
                <div className="space-y-1.5">
                  {RELATIONSHIP_ACTIVITIES.map((act) => (
                    <div key={act.id} className="flex gap-2 items-center rounded-xl bg-black/40 border border-white/10 px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <b className="text-[9.5px] text-white block">{act.name}</b>
                        <span className="text-[7px] text-gray-500">+{act.affinityGain} AFF · +{act.trustGain} TRU</span>
                      </div>
                      <span className="text-[8px] font-mono text-amber-300 shrink-0">${act.cost.toLocaleString()}</span>
                      <span className="text-[8px] font-mono text-sky-300 shrink-0">{act.energyCost}⚡</span>
                      <button onClick={() => handleActivity(act)} className="px-2.5 py-1.5 rounded-lg bg-rose-500 text-white text-[8px] font-black cursor-pointer shrink-0">GO</button>
                    </div>
                  ))}
                </div>
              )}

              {selectedNpc && view === 'HISTORY' && (
                <div className="space-y-1.5">
                  {(selectedNpc.history || []).length === 0 ? <p className="text-[9px] text-gray-600 text-center py-6">No history yet.</p> :
                    (selectedNpc.history || []).slice().reverse().map((ev) => (
                      <div key={ev.id} className="rounded-xl bg-black/40 border border-white/10 px-3 py-2">
                        <div className="flex justify-between"><b className="text-[8.5px] text-rose-300">{ev.title}</b><span className="text-[6.5px] text-gray-600">{ev.timestamp}</span></div>
                        <p className="text-[7.5px] text-gray-400">{ev.description}</p>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}

          {/* ================= TALK ================= */}
          {tab === 'TALK' && (
            !selectedNpc ? <p className="text-center text-[10px] text-gray-500 py-10">Select a person in My People first.</p> : (
              <div className="space-y-2">
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <b className="text-[10px] text-rose-300">💬 TALKING TO {selectedNpc.name.toUpperCase()}</b>
                    <span className="text-[7px] text-gray-500 font-mono">{TOPIC_COST_ENERGY}⚡ PER TOPIC · YOU: {player.energy || 0}⚡</span>
                  </div>
                  <p className="text-[7.5px] text-gray-500 leading-relaxed">Trait matches are shown BEFORE you pick — pick topics that match {selectedNpc.name.split(' ')[0]}'s traits for bonuses. No free spam: every topic costs energy.</p>
                </div>
                {CONVERSATION_TOPICS.map((topic) => (
                  <div key={topic.id} className="rounded-xl bg-black/40 border border-white/10 p-2.5">
                    <b className="text-[9px] text-rose-300 block mb-1.5">{topic.topic}</b>
                    {topic.options.map((opt, i) => {
                      const npcTraits = selectedNpc.personalityTraits || [];
                      const matches = opt.traitPreference.filter((t) => npcTraits.includes(t));
                      return (
                        <button key={i} onClick={() => handleTopic(opt)} className="w-full flex gap-2 items-center text-left rounded-lg bg-black/50 border border-white/10 hover:border-rose-500/40 px-2.5 py-2 mb-1 cursor-pointer">
                          <p className="flex-1 text-[8.5px] text-gray-200 leading-snug">{opt.text}</p>
                          {matches.length > 0 && <span className="text-[6px] font-black text-emerald-300 bg-emerald-400/10 border border-emerald-400/25 px-1.5 py-0.5 rounded shrink-0">⚡ TRAIT ×{matches.length}</span>}
                          <span className="text-[6.5px] font-mono text-gray-500 shrink-0">{opt.affinityDelta >= 0 ? '+' : ''}{opt.affinityDelta} AFF</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )
          )}

          {/* ================= GIFTS ================= */}
          {tab === 'GIFTS' && (
            <div className="space-y-1.5">
              <p className="text-[8px] text-gray-500 px-1">To: <b className="text-rose-300">{selectedNpc?.name || 'select in My People'}</b> — gifts raise AFFINITY ONLY; stages advance via the gates.</p>
              {GIFT_ITEMS.map((gift) => (
                <div key={gift.id} className="flex gap-2 items-center rounded-xl bg-black/40 border border-white/10 px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <b className="text-[9.5px] text-white block">{gift.name}</b>
                    <span className="text-[7px] text-gray-500">+{gift.affinityBoost} affinity</span>
                  </div>
                  <span className="text-[8.5px] font-mono text-amber-300 shrink-0">${gift.price.toLocaleString()}</span>
                  <button onClick={() => handleGift(gift)} className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-[8px] font-black cursor-pointer shrink-0">SEND</button>
                </div>
              ))}
            </div>
          )}

          {/* ================= MARRIAGE ================= */}
          {tab === 'MARRIAGE' && (
            !selectedNpc ? <p className="text-center text-[10px] text-gray-500 py-10">Select your partner in My People first.</p> : (
              <div className="space-y-2.5">
                {/* prenup */}
                <div className="rounded-2xl border border-amber-400/25 bg-amber-400/4 p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <b className="text-[10px] text-amber-300 flex items-center gap-1.5"><Scale className="w-3.5 h-3.5" /> PRENUP — REQUIRED BEFORE PROPOSING</b>
                    <span className={`text-[6.5px] font-black px-2 py-1 rounded ${prenup.status === 'AGREED' || selectedNpc.prenupTerms?.status === 'AGREED' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/5 text-gray-400'}`}>
                      {(selectedNpc.prenupTerms?.status) || prenup.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      ['protectCash', 'Cash'], ['protectSavings', 'Savings'], ['protectBusinesses', 'Businesses'],
                      ['protectRealEstate', 'Real Estate'], ['protectInvestments', 'Investments'], ['protectRoyalties', 'Royalties'],
                      ['protectLuxuryAssets', 'Luxury Assets'], ['protectFutureEarnings', 'Future Earnings'],
                      ['protectInheritance', 'Inheritance'], ['protectDebtResponsibility', 'Debt Split'],
                    ].map(([k, label]) => (
                      <label key={k} className="flex items-center gap-1.5 text-[7.5px] text-gray-300 cursor-pointer">
                        <input type="checkbox" checked={(prenup as any)[k]} onChange={(e) => setPrenup({ ...prenup, [k]: e.target.checked })} className="accent-amber-400 w-3 h-3" />
                        {label}
                      </label>
                    ))}
                  </div>
                  <button onClick={handlePrenup} className="w-full py-2 rounded-lg bg-amber-400 text-black text-[8.5px] font-black cursor-pointer">SUBMIT TERMS TO PARTNER</button>
                  {selectedNpc.prenupTerms?.npcNotes && <p className="text-[7.5px] text-gray-400 italic">{selectedNpc.prenupTerms.npcNotes}</p>}
                </div>

                {/* proposal gates */}
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-3 space-y-1.5">
                  <b className="text-[10px] text-rose-300 block">💍 PROPOSAL — {selectedNpc.name}</b>
                  {[
                    { label: 'Stage Partner/Exclusive', ok: ['Partner', 'Exclusive'].includes(selectedNpc.stage) },
                    { label: `Weeks together (8+ as Partner / 12+ as Exclusive)`, ok: (selectedNpc.weeksInCurrentStage || 0) >= (selectedNpc.stage === 'Partner' ? 8 : 12), val: `${selectedNpc.weeksInCurrentStage || 0}` },
                    { label: 'Affinity 80+', ok: (selectedNpc.relationshipLevel || 0) >= 80, val: `${selectedNpc.relationshipLevel || 0}` },
                    { label: 'Trust 75+', ok: (selectedNpc.trustLevel || 0) >= 75, val: `${selectedNpc.trustLevel || 0}` },
                    { label: 'Prenup agreed', ok: selectedNpc.prenupTerms?.status === 'AGREED' },
                  ].map((g) => (
                    <div key={g.label} className="flex justify-between text-[8.5px]">
                      <span className="text-gray-400">{g.label}</span>
                      <b className={`font-mono ${g.ok ? 'text-emerald-400' : 'text-rose-400'}`}>{g.ok ? '✓' : '✕'} {g.val || ''}</b>
                    </div>
                  ))}
                  <div>
                    <input type="range" min={10000} max={250000} step={5000} value={ringCost} onChange={(e) => setRingCost(Number(e.target.value))} className="w-full accent-rose-400" />
                    <p className="text-[8px] text-amber-300 font-black text-center">💍 ${ringCost.toLocaleString()} ring</p>
                  </div>
                  <button onClick={handlePropose} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 text-white text-[9px] font-black cursor-pointer">PROPOSE</button>
                </div>

                {/* wedding */}
                <div className="rounded-2xl border border-amber-400/25 bg-black/40 p-3 space-y-1.5">
                  <b className="text-[10px] text-amber-300 block">💒 WEDDING — 4+ WEEKS ENGAGED</b>
                  <div className="flex justify-between text-[8.5px]">
                    <span className="text-gray-400">Stage engaged</span>
                    <b className={`font-mono ${selectedNpc.stage === 'Engaged' ? 'text-emerald-400' : 'text-rose-400'}`}>{selectedNpc.stage === 'Engaged' ? '✓' : '✕'} {selectedNpc.stage}</b>
                  </div>
                  <div className="flex justify-between text-[8.5px]">
                    <span className="text-gray-400">Weeks engaged (4+)</span>
                    <b className={`font-mono ${(selectedNpc.weeksInCurrentStage || 0) >= 4 && selectedNpc.stage === 'Engaged' ? 'text-emerald-400' : 'text-rose-400'}`}>{selectedNpc.stage === 'Engaged' ? `${selectedNpc.weeksInCurrentStage || 0}/4` : '—'}</b>
                  </div>
                  <select value={venue} onChange={(e) => setVenue(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-[9px] font-bold">
                    <option value="Church">Church ($10,000)</option>
                    <option value="Beach">Malibu Beach ($25,000)</option>
                    <option value="Luxury Hotel">Ritz-Carlton Gala ($50,000)</option>
                    <option value="Private Estate">Bel-Air Mansion ($100,000)</option>
                  </select>
                  <button onClick={handleWedding} className="w-full py-2.5 rounded-lg bg-amber-400 text-black text-[9px] font-black cursor-pointer">HOST WEDDING</button>
                </div>
              </div>
            )
          )}

          {/* ================= FAMILY ================= */}
          {tab === 'FAMILY' && (
            !partner || partner.stage !== 'Married' ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center space-y-2">
                <Baby className="w-8 h-8 mx-auto text-gray-600" />
                <p className="text-[10px] text-gray-400 font-bold">Family unlocks after marriage.</p>
                <p className="text-[8px] text-gray-600">Meet someone → match → date → propose (prenup + weeks gates) → wed → grow the family.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* pregnancy status / conception */}
                {partner.pregnancy ? (
                  <div className="rounded-2xl border border-amber-400/35 bg-amber-400/8 p-4 text-center space-y-2">
                    <span className="text-3xl block">🤰</span>
                    <b className="text-[11px] text-amber-300 block">{partner.name} is expecting!</b>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <i className="block h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400" style={{ width: `${((partner.pregnancy.totalWeeks - partner.pregnancy.weeksUntilBirth) / partner.pregnancy.totalWeeks) * 100}%` }} />
                    </div>
                    <p className="text-[9px] text-gray-300 font-mono">{partner.pregnancy.weeksUntilBirth} week{partner.pregnancy.weeksUntilBirth === 1 ? '' : 's'} until delivery</p>
                    <p className="text-[8px] text-gray-500">Baby {partner.pregnancy.childName} ({partner.pregnancy.childGender}) — conceived WK {partner.pregnancy.conceivedWeek}, {partner.pregnancy.conceivedYear} · carrying {partner.pregnancy.totalWeeks} weeks. The birth fires automatically with an inbox announcement.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-3 space-y-2">
                    <b className="text-[10px] text-rose-300 block">🍼 TRY FOR A BABY — {partner.name}</b>
                    <p className="text-[7.5px] text-gray-500 leading-relaxed">Conception is a real roll (higher affinity = higher odds). Pregnancy lasts 36-40 weeks, then the birth happens automatically.</p>
                    <input value={babyName} onChange={(e) => setBabyName(e.target.value)} placeholder="Baby name (optional — auto-named if blank)"
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-[9px] outline-none" />
                    <select value={babyGender} onChange={(e) => setBabyGender(e.target.value as any)} className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-[9px] font-bold">
                      <option value="Female">Girl</option><option value="Male">Boy</option><option value="Non-Binary">Non-Binary</option>
                    </select>
                    <button onClick={handleConceive} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-500 to-rose-700 text-white text-[9px] font-black cursor-pointer">TRY TO CONCEIVE</button>
                  </div>
                )}

                {/* children list */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-3 space-y-1.5">
                  <b className="text-[9px] font-black text-gray-400 tracking-wider block">YOUR CHILDREN ({partner.children?.length || 0})</b>
                  {(partner.children || []).length === 0 ? <p className="text-[8px] text-gray-600">No children yet.</p> :
                    (partner.children || []).map((child) => (
                      <div key={child.id} className="flex justify-between items-center rounded-lg bg-white/[0.03] border border-white/8 px-2.5 py-2">
                        <div>
                          <b className="text-[9px] text-white block">{child.name}</b>
                          <span className="text-[6.5px] text-gray-500">{child.gender} · born WK {child.birthWeek}, {child.birthYear}</span>
                        </div>
                        <span className="text-[7px] text-rose-300 font-bold">{child.personality}</span>
                      </div>
                    ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
