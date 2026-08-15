/**
 * HOLLYWOOD RISING - PERSONAL STUDIO V2 (REBUILT)
 * Overview (name, description, level) -> Content (Development/Production/Distribution/Release)
 * -> Launch Content (scripts + renewals) -> Financials -> Equipment (8 depts, lvl 1-20).
 * Unlock: 20 Principal Roles, 5,000 Fame, 15 Movies, $50M. 25% energy drain weekly.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  PersonalStudioState,
  StudioProject,
  StudioScript,
  StudioBudgetAlloc,
} from '../../types/game';
import {
  loadStudioState,
  saveStudioState,
  canUnlockStudio,
  unlockStudio,
  buyScript,
  startDevelopment,
  setBudgetAndToProduction,
  submitCastOffer,
  upgradeEquipment,
  sellStudio,
  closeStudio,
  ACTOR_POOL,
  LOCATION_POOL,
  SCRIPT_POOL,
  castOfferStatus,
  MIN_BUDGET,
  MAX_BUDGET,
  MIN_CAST_FEE,
  MAX_CAST_FEE,
  EQUIPMENT_DEFS,
  toggleLocation,
  startFilming,
  checkRenewalEligibility,
  acceptRenewal,
  computeProjectRatings,
  computeOverallRating,
} from '../../services/personalStudioEngine';
import { Player } from '../../types/game';
import { INITIAL_STREAMING_PLATFORMS } from '../../database/worldDatabase';
import {
  ArrowLeft, Building2, Film, Rocket, DollarSign, Settings2, Lock, Check, Crown,
  X, Plus, Minus, Star, MapPin, Clapperboard, Send, TrendingUp, Sparkles, ShieldCheck,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface PersonalStudioViewProps {
  onBack: () => void;
}

type StudioTab = 'OVERVIEW' | 'CONTENT' | 'LAUNCH' | 'FINANCIALS' | 'EQUIPMENT';
type StageTab = 'Development' | 'Production' | 'Distribution' | 'Release';

export const PersonalStudioView: React.FC<PersonalStudioViewProps> = ({ onBack }) => {
  const { player, saveData, updateSave, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];
  const [studio, setStudio] = useState<PersonalStudioState>(() => loadStudioState());
  const [tab, setTab] = useState<StudioTab>('OVERVIEW');
  const [stageTab, setStageTab] = useState<StageTab>('Development');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [director, setDirector] = useState('');
  const [budget, setBudget] = useState<number>(10000000);
  const [alloc, setAlloc] = useState<StudioBudgetAlloc>({ principalCast: 25, distributionMarketing: 25, postProduction: 25, locationSet: 25 });
  const [devProject, setDevProject] = useState<StudioProject | null>(null);
  const [prodProject, setProdProject] = useState<StudioProject | null>(null);
  const [selectedActor, setSelectedActor] = useState<any>(null);
  const [cashOffer, setCashOffer] = useState(1000000);
  const [royaltyPct, setRoyaltyPct] = useState(0);
  const [role, setRole] = useState<any>('Lead');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [distProject, setDistProject] = useState<StudioProject | null>(null);
  const [distWeeks, setDistWeeks] = useState(10);
  const [boost, setBoost] = useState(4);
  const [relProject, setRelProject] = useState<StudioProject | null>(null);
  const [relWeeks, setRelWeeks] = useState(20);
  const [mktBudget, setMktBudget] = useState(5000000);
  const [pitchPcts, setPitchPcts] = useState<Record<string, number>>({});
  // 12 REAL streaming platforms (Netflix, Prime, Disney+...) with real logos
  const networks = INITIAL_STREAMING_PLATFORMS.map((p) => ({ id: p.id, name: p.name, logoUrl: p.logoUrl, subscribers: p.subscribers }));

  const showFb = (m: string) => { setFeedback(m); setTimeout(() => setFeedback(null), 5000); };
  const refresh = () => setStudio({ ...loadStudioState() });

  // ================= OVERVIEW =================
  const eligible = canUnlockStudio(player);
  const totalSpent = studio.financials.filter((f) => f.type === 'COST').reduce((a, f) => a + f.amount, 0);
  const totalIncome = studio.financials.filter((f) => f.type === 'INCOME').reduce((a, f) => a + f.amount, 0);
  const netPosition = totalIncome - totalSpent;

  const handleUnlock = () => {
    if (!eligible || !newName.trim()) { showFb('Enter a studio name and meet all requirements.'); return; }
    const desc = newDesc.trim() || `${newName.trim()} — a studio built on talent, vision and box office gold.`;
    unlockStudio(studio, newName.trim(), desc);
    updateSave({ ...saveData, player: { ...player, empire: { ...player.empire, indieStudioOwned: true, studioName: newName.trim() } } });
    refresh();
    showFb('🏢 Personal Studio UNLOCKED! It drains 25% energy weekly while active.');
  };

  // ================= CONTENT =================
  const ownedScripts = studio.scripts;
  const devProjects = studio.projects.filter((p) => p.stage === 'Development');
  const prodProjects = studio.projects.filter((p) => p.stage === 'Production');
  const distProjects = studio.projects.filter((p) => p.stage === 'Distribution');
  const relProjects = studio.projects.filter((p) => p.stage === 'Release');

  const openDevelopment = (proj: StudioProject) => {
    setDevProject(proj);
    setBudget(proj.totalBudget || 10000000);
    setAlloc({ ...proj.allocations });
  };
  const handleSetBudget = () => {
    if (!devProject) return;
    const res = setBudgetAndToProduction(studio, devProject.id, budget, alloc);
    showFb(res.message);
    if (res.success) { setDevProject(null); refresh(); }
  };

  const [prodSubTab, setProdSubTab] = useState<'CAST' | 'LOCATIONS'>('CAST');
  const [locPct, setLocPct] = useState(5);
  const [showFilmingDisclaimer, setShowFilmingDisclaimer] = useState(false);
  const openProduction = (proj: StudioProject) => { setProdProject(proj); setSelectedActor(null); setProdSubTab('CAST'); };

  // ================= DISTRIBUTION =================
  const openDistribution = (proj: StudioProject) => {
    setDistProject(proj);
    setDistWeeks(proj.distributionWeeks || 10);
    setBoost(proj.boost || 4);
  };
  const handleStartDistribution = () => {
    if (!distProject) return;
    if (distWeeks < 5 || distWeeks > 20) { showFb('Distribution window must be 5-20 weeks.'); return; }
    if (boost < 4 || boost > 40) { showFb('Boost must be 4-40.'); return; }
    const p = studio.projects.find((x) => x.id === distProject.id);
    if (p) { p.stage = 'Distribution'; p.distributionWeeks = distWeeks; p.boost = boost; p.stage = 'Distribution'; }
    saveStudioState(studio);
    setDistProject(null); refresh();
    showFb('📦 Distribution started! Release in ' + distWeeks + ' weeks.');
  };

  // ================= RELEASE =================
  const openRelease = (proj: StudioProject) => {
    setRelProject(proj);
    setRelWeeks(proj.releaseWeeks || 20);
    setMktBudget(proj.marketingBudget || 5000000);
    setPitchPcts(proj.networkPitchPcts || {});
  };
  const handlePitchNetworks = () => {
    if (!relProject) return;
    const total = Object.values(pitchPcts).reduce((a, b) => a + (b || 0), 0);
    if (Math.abs(total - 100) > 0.01) { showFb(`Pitch allocation must total 100% (currently ${total}%).`); return; }
    // REAL bidding: each of the 12 platforms bids based on rating + allocation
    const bids = networks.map((n) => ({
      network: n.name,
      logoUrl: n.logoUrl,
      amount: Math.floor(relProject.totalBudget * (0.1 + (relProject.overallRating / 100) * 0.5) * ((pitchPcts[n.id] || 10) / 100)),
    }));
    const p = studio.projects.find((x) => x.id === relProject.id);
    if (p) {
      p.bids = bids;
      p.networkPitchPcts = { ...pitchPcts };
      p.marketingBudget = mktBudget;
      const winner = bids.reduce((a, b) => (b.amount > a.amount ? b : a), bids[0]);
      p.winningNetwork = winner.network;
      p.releaseWeeks = relWeeks;
      if (relWeeks < 10 || relWeeks > 40) { showFb('Release window must be 10-40 weeks.'); return; }
      const totalBid = bids.reduce((a, b) => a + b.amount, 0);
      p.stage = 'Release';
      studio.financials.unshift({ id: `fin_${Date.now()}`, projectId: p.id, projectTitle: p.title, type: 'INCOME', category: 'Bid', amount: totalBid, week: 1, year: 2026 });
    }
    saveStudioState(studio);
    setRelProject(null); refresh();
    showFb('💰 ' + networks.length + ' platforms bid! Funds added. Release in ' + relWeeks + ' weeks.');
  };

  // ================= FINANCIALS =================
  const projectRows = studio.projects.map((p) => {
    const costs = studio.financials.filter((f) => f.projectId === p.id && f.type === 'COST').reduce((a, f) => a + f.amount, 0);
    const income = studio.financials.filter((f) => f.projectId === p.id && f.type === 'INCOME').reduce((a, f) => a + f.amount, 0);
    return { p, costs, income, net: income - costs };
  });

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={onBack} className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg">
          <ArrowLeft className="w-4 h-4 text-amber-400" /> <span>Back to World</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
          <Building2 className="w-5 h-5 text-amber-400" /> <span>Personal Studio</span>
        </div>
      </div>

      {feedback && <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-black text-center">{feedback}</div>}

      {/* ============ UNLOCK / OVERVIEW ============ */}
      {!studio.unlocked ? (
        <div className="p-6 rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-black/70 to-black/70 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40"><Lock className="w-6 h-6 text-rose-400" /></div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Personal Studio — Locked</h2>
              <p className="text-xs text-gray-400">Build your own Hollywood studio. Meet all requirements to unlock.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Principal Roles', cur: player.principalRolesCount || 0, need: 20 },
              { label: 'Fame XP', cur: player.fameXp || 0, need: 5000 },
              { label: 'Movies Released', cur: player.moviesCompleted || 0, need: 15 },
              { label: 'Cash', cur: player.money || 0, need: 50000000 },
            ].map((r) => (
              <div key={r.label} className={`p-3 rounded-2xl border ${r.cur >= r.need ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                <p className="text-[9px] text-gray-400 uppercase font-bold">{r.label}</p>
                <p className="text-sm font-black text-white">{r.cur >= r.need ? '✓' : `${r.cur.toLocaleString()} / ${r.need.toLocaleString()}`}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Studio name (e.g. Rising Pictures)" className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none" />
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} placeholder="Studio description (50-70 words — your studio's story, mission, vibe)..." className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none resize-none" />
            <button onClick={handleUnlock} disabled={!eligible} className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-40 cursor-pointer">
              {eligible ? '🔓 UNLOCK STUDIO ($50M + requirements)' : 'Complete requirements to unlock'}
            </button>
          </div>
          <p className="text-[10px] text-gray-500">⚠️ Once unlocked, the studio drains 25% energy every week while active. You can sell or close it anytime.</p>
        </div>
      ) : (
        <>
          {/* Overview */}
          {tab === 'OVERVIEW' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-black/70 to-black/70 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-xl font-black text-white">🏢 {studio.name}</h2>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">Level {studio.level} · {studio.level >= 5 ? 'Major' : studio.level >= 3 ? 'Boutique' : 'Indie'}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{studio.description}</p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-gray-400">
                  <span className={`px-2 py-1 rounded-lg font-black ${studio.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-gray-500/20 text-gray-400 border border-white/10'}`}>
                    {studio.active ? '⚡ ACTIVE — drains 25% energy/wk' : '⏸ INACTIVE — no energy drain'}
                  </span>
                  <span>Studio Value: <strong className="text-amber-300">${studio.studioValue.toLocaleString()}</strong></span>
                  <span>Level: <strong className="text-white">{studio.level}</strong></span>
                </div>
              </div>

              {/* 4 cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'CONTENT' as StudioTab, icon: Film, label: 'Content', sub: 'Dev → Prod → Dist → Release', color: 'from-sky-500/20 to-black border-sky-500/40' },
                  { id: 'LAUNCH' as StudioTab, icon: Rocket, label: 'Launch Content', sub: 'Scripts + Renewals', color: 'from-purple-500/20 to-black border-purple-500/40' },
                  { id: 'FINANCIALS' as StudioTab, icon: DollarSign, label: 'Financials', sub: 'Projects & performance', color: 'from-emerald-500/20 to-black border-emerald-500/40' },
                  { id: 'EQUIPMENT' as StudioTab, icon: Settings2, label: 'Equipment', sub: '8 departments · Lv 1-20', color: 'from-amber-500/20 to-black border-amber-500/40' },
                ].map((c) => (
                  <button key={c.id} onClick={() => setTab(c.id)} className={`p-4 rounded-3xl border bg-gradient-to-br ${c.color} text-left transition-all cursor-pointer hover:scale-[1.02] backdrop-blur-md`}>
                    <c.icon className="w-6 h-6 text-amber-300" />
                    <h3 className="text-sm font-black text-white mt-2">{c.label}</h3>
                    <p className="text-[10px] text-gray-400">{c.sub}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => { if (confirm('Sell your studio for 80% of its value?')) { const payout = sellStudio(studio); updateSave({ ...saveData, player: { ...player, money: (player.money || 0) + payout } }); refresh(); showFb(`Studio sold for $${payout.toLocaleString()}!`); } }} className="flex-1 py-2.5 rounded-2xl bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-black cursor-pointer">SELL STUDIO</button>
                <button onClick={() => { closeStudio(studio); refresh(); showFb('Studio closed — energy drain stopped. It stays in your collection.'); }} className="flex-1 py-2.5 rounded-2xl bg-black/60 border border-white/20 text-gray-300 text-[10px] font-black cursor-pointer">CLOSE STUDIO</button>
              </div>
              <p className="text-[9px] text-gray-500 text-center">Studio active: {studio.active ? 'YES' : 'NO'} · Energy drained weekly while active</p>
            </div>
          )}

          {/* ============ CONTENT (4 stages) ============ */}
          {tab === 'CONTENT' && (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {(['Development', 'Production', 'Distribution', 'Release'] as StageTab[]).map((s) => (
                  <button key={s} onClick={() => setStageTab(s)} className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer ${stageTab === s ? 'bg-amber-500 text-black' : 'bg-black/40 text-gray-400 border border-white/10'}`}>
                    {s} ({studio.projects.filter((p) => p.stage === s).length})
                  </button>
                ))}
              </div>

              {/* DEVELOPMENT */}
              {stageTab === 'Development' && (
                <div className="space-y-3">
                  {/* PRODUCTION CAPACITY BANNER */}
                  {(() => {
                    const inProd = studio.projects.filter((p) => p.stage === 'Production');
                    const seriesInProd = inProd.some((p) => p.type === 'Series');
                    const full = inProd.length >= 3;
                    return (
                      <div className={`p-3 rounded-2xl border ${full ? 'border-rose-500/40 bg-rose-500/10' : 'border-sky-500/30 bg-sky-500/5'}`}>
                        <p className="text-[11px] font-black text-white">
                          Production Hub: <span className={full ? 'text-rose-400' : 'text-sky-300'}>{inProd.length} / 3</span> slots
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5">
                          {full
                            ? 'Hub is full — finish or move a project out before starting another.'
                            : seriesInProd
                              ? 'A series is already in production — only one series at a time (movies still allowed).'
                              : 'Max 3 projects in production · only one series at a time.'}
                        </p>
                      </div>
                    );
                  })()}
                  {ownedScripts.length === 0 && <p className="text-center text-xs text-gray-500 py-8">No scripts owned. Buy one in Launch Content → Scripts first.</p>}
                  {ownedScripts.map((sc: StudioScript) => {
                    const existing = studio.projects.find((p) => p.scriptId === sc.id && p.status === 'ACTIVE');
                    return (
                      <div key={sc.id} className="p-4 rounded-3xl border border-white/10 bg-black/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-white">{sc.title} <span className="text-[9px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-black">{sc.type}</span></p>
                            <p className="text-[10px] text-gray-400">{sc.genre} · Quality {sc.qualityRating}/100 · Est. budget ${(sc.estimatedBudget / 1000000).toFixed(0)}M · Audience {sc.potentialAudience}</p>
                          </div>
                          {existing ? (
                            <span className="text-[9px] text-amber-300 font-black">IN PIPELINE</span>
                          ) : (
                            <button onClick={() => { const r = startDevelopment(studio, sc.id, director || `${player.firstName} ${player.lastName}`); if (r.success && r.project) { openDevelopment(r.project); } else showFb(r.message); refresh(); }} className="px-3 py-1.5 rounded-xl bg-amber-500 text-black text-[10px] font-black cursor-pointer">Start Development</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {devProjects.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-gray-400">In Development</h4>
                      {devProjects.map((p) => (
                        <button key={p.id} onClick={() => openDevelopment(p)} className="w-full p-3 rounded-2xl bg-black/40 border border-amber-500/30 text-left cursor-pointer hover:border-amber-400">
                          <p className="text-xs font-black text-white">{p.title}</p>
                          <p className="text-[10px] text-gray-400">Set budget to move to Production →</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCTION */}
              {stageTab === 'Production' && (
                <div className="space-y-2">
                  {prodProjects.length === 0 && <p className="text-center text-xs text-gray-500 py-8">No projects in production yet.</p>}
                  {prodProjects.map((p) => (
                    <button key={p.id} onClick={() => openProduction(p)} className="w-full p-4 rounded-3xl bg-black/50 border border-white/10 text-left cursor-pointer hover:border-sky-400 space-y-1">
                      <p className="text-sm font-black text-white">{p.title}</p>
                      <p className="text-[10px] text-gray-400">Cast: {p.cast.length} · Budget ${(p.totalBudget / 1000000).toFixed(0)}M</p>
                      <p className="text-[10px] text-amber-300 font-bold">Open → Casting & Locations</p>
                    </button>
                  ))}
                </div>
              )}

              {/* DISTRIBUTION */}
              {stageTab === 'Distribution' && (
                <div className="space-y-2">
                  {distProjects.length === 0 && <p className="text-center text-xs text-gray-500 py-8">No projects in distribution.</p>}
                  {distProjects.map((p) => (
                    <button key={p.id} onClick={() => openDistribution(p)} className="w-full p-4 rounded-3xl bg-black/50 border border-white/10 text-left cursor-pointer hover:border-emerald-400 space-y-1">
                      <p className="text-sm font-black text-white">{p.title}</p>
                      <p className="text-[10px] text-gray-400">Week {p.distributionWeeksElapsed}/{p.distributionWeeks} · Boost {p.boost} · Rating {p.overallRating}</p>
                      <p className="text-[10px] text-emerald-300 font-bold">Configure window & boost →</p>
                    </button>
                  ))}
                </div>
              )}

              {/* RELEASE */}
              {stageTab === 'Release' && (
                <div className="space-y-2">
                  {relProjects.length === 0 && <p className="text-center text-xs text-gray-500 py-8">No projects in release.</p>}
                  {relProjects.map((p) => (
                    <button key={p.id} onClick={() => openRelease(p)} className="w-full p-4 rounded-3xl bg-black/50 border border-white/10 text-left cursor-pointer hover:border-purple-400 space-y-1">
                      <p className="text-sm font-black text-white">{p.title}</p>
                      <p className="text-[10px] text-gray-400">Week {p.releaseWeeksElapsed}/{p.releaseWeeks} · {p.winningNetwork ? `Won by ${p.winningNetwork}` : 'Not pitched yet'}</p>
                      <p className="text-[10px] text-purple-300 font-bold">Pitch to networks →</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ LAUNCH CONTENT ============ */}
          {tab === 'LAUNCH' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl border border-purple-500/30 bg-black/50 space-y-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2"><Clapperboard className="w-4 h-4 text-purple-400" /> Script Marketplace</h3>
                <p className="text-[10px] text-gray-500">Buy a script — it enters your Content → Development. Movies & series with prices and ratings.</p>
                <div className="space-y-2">
                  {SCRIPT_POOL.map((sc) => {
                    const owned = studio.scripts.some((s) => s.id === sc.id);
                    return (
                      <div key={sc.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white truncate">{sc.title} <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-black">{sc.type}</span></p>
                          <p className="text-[9px] text-gray-500 truncate">{sc.genre} · Quality {sc.qualityRating}/100 · Est ${(sc.estimatedBudget / 1000000).toFixed(0)}M · {sc.potentialAudience} aud</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-black text-amber-300">${(sc.askingPrice / 1000000).toFixed(1)}M</span>
                          <button disabled={owned} onClick={() => { const r = buyScript(studio, sc.id, player.money || 0); if (r.success) updateSave({ ...saveData, player: { ...player, money: r.newMoney } }); showFb(r.message); refresh(); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer ${owned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500 text-white'}`}>{owned ? '✓ Owned' : 'Buy'}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-3xl border border-emerald-500/30 bg-black/50 space-y-2">
                <h3 className="text-sm font-black text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Renewals</h3>
                <p className="text-[10px] text-gray-500">Movies hitting ×2 target and series hitting ×3 target can be renewed (movies up to Part 7, series up to 20 seasons).</p>
                {(() => {
                  const elig = checkRenewalEligibility(studio, player);
                  const last = studio.projects.find((p) => p.status === 'COMPLETED');
                  return (
                    <div className={`p-3 rounded-2xl border ${elig.eligible ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-black/40'}`}>
                      {last ? (
                        <>
                          <p className="text-xs font-black text-white">{last.title} <span className="text-[9px] text-gray-400">(Part {last.renewalCount + 1} / {last.type === 'Series' ? 'Season ' + (last.renewalCount + 1) : 'Part 7'})</span></p>
                          <p className={`text-[10px] mt-1 ${elig.eligible ? 'text-emerald-300' : 'text-gray-400'}`}>{elig.reason}</p>
                          {elig.eligible && (
                            <button onClick={() => { const r = acceptRenewal(studio, player.money || 0); if (r.success) updateSave({ ...saveData, player: { ...player, money: r.newMoney } }); showFb(r.message); refresh(); }} className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-[10px] font-black cursor-pointer">
                              ACCEPT RENEWAL FUNDING → DEVELOP NEXT PART
                            </button>
                          )}
                        </>
                      ) : (
                        <p className="text-[10px] text-gray-500">Release a movie/series first — renewals unlock when it hits ×2 (movie) or ×3 (series) target.</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ============ FINANCIALS ============ */}
          {tab === 'FINANCIALS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-black/50 border border-rose-500/30">
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Total Invested</p>
                  <p className="text-lg font-black text-rose-300">${totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/30">
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Total Income</p>
                  <p className="text-lg font-black text-emerald-300">${totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Net Position</p>
                  <p className={`text-lg font-black ${netPosition >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{netPosition >= 0 ? '+' : ''}{netPosition.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400">Your Projects</h4>
                {projectRows.map(({ p, costs, income, net }) => (
                  <div key={p.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white truncate">{p.title}</p>
                      <p className="text-[9px] text-gray-500">{p.stage} · Invested ${costs.toLocaleString()} · Earned ${income.toLocaleString()}</p>
                    </div>
                    <span className={`text-[10px] font-black shrink-0 ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{net >= 0 ? '+' : ''}{net.toLocaleString()}</span>
                  </div>
                ))}
                {projectRows.length === 0 && <p className="text-[10px] text-gray-600 text-center py-6">No projects yet.</p>}
              </div>
            </div>
          )}

          {/* ============ EQUIPMENT ============ */}
          {tab === 'EQUIPMENT' && (
            <div className="space-y-3">
              <p className="text-[10px] text-gray-500">Upgrade your studio departments (max Level 20, paid with cash). Every level boosts your projects' quality and ratings.</p>
              {studio.equipment.map((eq) => {
                const def = EQUIPMENT_DEFS.find((d) => d.id === eq.id);
                const cost = Math.floor(50000 * Math.pow(1.6, eq.level - 1));
                return (
                  <div key={eq.id} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white">{eq.name}</p>
                      <p className="text-[9px] text-gray-500">Boosts {def?.stat || eq.stat} · Level <strong className="text-amber-300">{eq.level}</strong>/20</p>
                    </div>
                    <button disabled={eq.level >= 20} onClick={() => { const r = upgradeEquipment(studio, eq.id, player.money || 0); if (r.success) updateSave({ ...saveData, player: { ...player, money: r.newMoney } }); showFb(r.message); refresh(); }} className="px-3 py-1.5 rounded-xl bg-amber-500 text-black text-[10px] font-black cursor-pointer disabled:opacity-40">
                      {eq.level >= 20 ? 'MAX' : `Upgrade $${(cost / 1000000).toFixed(1)}M`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ============ DEVELOPMENT MODAL ============ */}
      {devProject && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <button onClick={() => setDevProject(null)} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer">← Back</button>
            <span className="text-xs font-black">Development</span>
            <span className="text-[10px] text-gray-500">Top Right</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <p className="text-lg font-black text-white">{devProject.title}</p>
              <p className="text-[10px] text-gray-400">{devProject.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-amber-400 flex items-center justify-center font-black text-sm">{devProject.totalBudget ? '✓' : '0%'}</div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Total Budget (100%)</p>
                <p className="text-lg font-black text-emerald-400">${(budget / 1000000).toFixed(0)}M</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {([
                ['principalCast', 'Principal Cast'],
                ['distributionMarketing', 'Distribution & Marketing'],
                ['postProduction', 'Editing, Sound & Visual'],
                ['locationSet', 'Location & Set Design'],
              ] as [keyof StudioBudgetAlloc, string][]).map(([key, label]) => (
                <div key={key} className="p-3 rounded-2xl bg-black/50 border border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="font-black text-white">{label}</span>
                    <span className="font-black text-amber-300">{alloc[key]}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={alloc[key]} onChange={(e) => setAlloc((a) => ({ ...a, [key]: Number(e.target.value) }))} className="w-full accent-amber-400" />
                </div>
              ))}
            </div>
            <div className={`p-3 rounded-2xl border ${Math.abs((alloc.principalCast + alloc.distributionMarketing + alloc.postProduction + alloc.locationSet) - 100) <= 0.01 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'}`}>
              <p className="text-xs font-black">Total: {alloc.principalCast + alloc.distributionMarketing + alloc.postProduction + alloc.locationSet}% {Math.abs((alloc.principalCast + alloc.distributionMarketing + alloc.postProduction + alloc.locationSet) - 100) <= 0.01 ? '✓ Ready' : '— must be 100%'}</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Total Budget ($2M min · $10B max)</p>
              <input type="number" min={MIN_BUDGET} max={MAX_BUDGET} step={1000000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none" />
            </div>
            {(() => {
              const inProdCount = studio.projects.filter((p) => p.stage === 'Production').length;
              const prodFull = inProdCount >= 3;
              const seriesConflict = devProject?.type === 'Series' && studio.projects.some((p) => p.stage === 'Production' && p.type === 'Series');
              const blockReason = prodFull
                ? `Production hub is full (${inProdCount}/3) — finish a project first.`
                : seriesConflict
                  ? 'A series is already in production — only one series at a time.'
                  : null;
              if (blockReason) {
                return (
                  <div className="p-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-center">
                    <p className="text-[11px] font-black text-rose-300">{blockReason}</p>
                  </div>
                );
              }
              return (
                <button onClick={handleSetBudget} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-black font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer">SET BUDGET → PRODUCTION</button>
              );
            })()}
          </div>
        </div>
      )}

      {/* ============ PRODUCTION MODAL (casting) ============ */}
      {prodProject && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <button onClick={() => setProdProject(null)} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer">← Back</button>
            <span className="text-xs font-black">Production · {prodProject.title}</span>
            <span className="text-[10px] text-gray-500">{Math.round((prodProject.cast.filter((c) => c.status === 'ACCEPTED').length / Math.max(1, prodProject.cast.length)) * 100)}% cast</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-2">
              <button onClick={() => setProdSubTab('CAST')} className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer ${prodSubTab === 'CAST' ? 'bg-sky-500 text-black' : 'bg-white/10 text-gray-300'}`}>Principal Cast</button>
              <button onClick={() => setProdSubTab('LOCATIONS')} className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer ${prodSubTab === 'LOCATIONS' ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-300'}`}>Film Locations</button>
            </div>

            {/* LOCATIONS TAB */}
            {prodSubTab === 'LOCATIONS' && (
              <div className="space-y-3">
                <p className="text-[10px] text-gray-400">Choose filming locations — each adds to your allocation (total must be 100%).</p>
                <div className="flex items-center gap-2">
                  <input type="range" min={5} max={50} step={5} value={locPct} onChange={(e) => setLocPct(Number(e.target.value))} className="flex-1 accent-emerald-400" />
                  <span className="text-xs font-black text-emerald-300 w-12 text-right">{locPct}%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                  {LOCATION_POOL.map((loc) => {
                    const added = prodProject.locations.some((l) => l.name === loc);
                    return (
                      <button key={loc} onClick={() => { const r = toggleLocation(prodProject, loc, locPct); showFb(r.message); refresh(); }} className={`p-2 rounded-xl border text-left text-[10px] cursor-pointer ${added ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-black/40 border-white/10 text-gray-300'}`}>
                        <MapPin className="w-3 h-3 inline mr-1" />{loc}
                        {added && <span className="block text-[8px] text-emerald-300 font-black">{prodProject.locations.find((l) => l.name === loc)?.allocationPct}%</span>}
                      </button>
                    );
                  })}
                </div>
                <div className={`p-2.5 rounded-xl border text-[10px] font-black ${prodProject.locations.reduce((a, l) => a + l.allocationPct, 0) === 100 ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' : 'text-amber-300 border-amber-500/30 bg-black/40'}`}>
                  Location allocation: {prodProject.locations.reduce((a, l) => a + l.allocationPct, 0)}% {prodProject.locations.reduce((a, l) => a + l.allocationPct, 0) === 100 ? '✓' : '(100% needed)'}
                </div>
              </div>
            )}

            {/* Cast list */}
            {prodSubTab === 'CAST' && !selectedActor && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ACTOR_POOL.filter((a) => !prodProject.cast.some((c) => c.actorId === a.id)).slice(0, 30).map((a) => (
                  <button key={a.id} onClick={() => { setSelectedActor(a); setCashOffer(a.baseFee); setRoyaltyPct(0); setRole('Lead'); }} className="p-3 rounded-2xl bg-black/40 border border-white/10 text-left cursor-pointer hover:border-sky-400">
                    <div className="flex items-center gap-2">
                      <img src={a.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-black text-white">{a.name}</p>
                        <p className="text-[9px] text-gray-500">Rating <strong className="text-amber-300">{a.rating}</strong>/100</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-emerald-400 font-bold mt-1">Ask: ${a.baseFee.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Actor detail / offer */}
            {selectedActor && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-3">
                  <img src={selectedActor.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-black text-white">{selectedActor.name}</p>
                    <p className="text-[10px] text-gray-400">Rating {selectedActor.rating}/100 · Asking ${selectedActor.baseFee.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Cash Offer</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCashOffer((c) => Math.max(75000, c - 100000))} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-black text-white flex-1 text-center">${cashOffer.toLocaleString()}</span>
                      <button onClick={() => setCashOffer((c) => Math.min(40000000, c + 100000))} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Royalty %</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setRoyaltyPct((r) => Math.max(0, r - 1))} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-black text-white flex-1 text-center">{royaltyPct}%</span>
                      <button onClick={() => setRoyaltyPct((r) => Math.min(25, r + 1))} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Role</p>
                  <div className="flex gap-2 flex-wrap mt-1.5">
                    {['Lead', 'Principal', 'Support', 'Cameo', 'Recurring'].map((r) => (
                      <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${role === r ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-300'}`}>{r}</button>
                    ))}
                  </div>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${castOfferStatus(selectedActor.baseFee, cashOffer, royaltyPct) === 'GREEN' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : castOfferStatus(selectedActor.baseFee, cashOffer, royaltyPct) === 'GRAY' ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-rose-500/50 bg-rose-500/10 text-rose-300'}`}>
                  <p className="text-xs font-black">
                    {castOfferStatus(selectedActor.baseFee, cashOffer, royaltyPct) === 'GREEN' ? '🟢 GREEN — likely to accept' : castOfferStatus(selectedActor.baseFee, cashOffer, royaltyPct) === 'GRAY' ? '⚪ GRAY — will negotiate' : '🔴 RED — too low, will decline'}
                  </p>
                </div>
                <button onClick={() => { const r = submitCastOffer(studio, prodProject.id, selectedActor.id, role, cashOffer, royaltyPct); showFb(r.message); refresh(); setSelectedActor(null); }} className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-purple-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer">SUBMIT OFFER</button>
              </div>
            )}

            {/* Accepted/declined cast */}
            {prodProject.cast.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400">Offers Sent ({prodProject.cast.length})</h4>
                {prodProject.cast.map((c) => (
                  <div key={c.actorId} className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[10px]">
                    <span className="font-black text-white">{c.name} · {c.role} · ${c.cashOffer.toLocaleString()} + {c.royaltyPct}%</span>
                    <span className={c.status === 'ACCEPTED' ? 'text-emerald-300 font-black' : c.status === 'DECLINED' ? 'text-rose-300 font-black' : 'text-amber-300 font-black'}>
                      {c.status} {c.status === 'PENDING' ? `(${c.weeksRemaining}w)` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Crew budget summary */}
            <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/30">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Crew Budget</p>
              <p className="text-sm font-black text-amber-300">${prodProject.cast.filter((c) => c.status === 'ACCEPTED').reduce((a, c) => a + c.cashOffer, 0).toLocaleString()} committed</p>
            </div>

            {/* START FILMING */}
            <button onClick={() => setShowFilmingDisclaimer(true)} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer">
              🎬 START FILMING
            </button>
            <p className="text-[9px] text-gray-500 text-center">Requires: ≥1 cast accepted · locations 100% · all cast responded</p>
          </div>
        </div>
      )}

      {/* FILMING DISCLAIMER MODAL */}
      {showFilmingDisclaimer && prodProject && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-gray-950 border-2 border-amber-500/50 shadow-2xl space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400"><Clapperboard className="w-6 h-6" /></div>
            <h3 className="text-base font-black text-white uppercase">Start Filming?</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              ⚠️ <strong className="text-amber-300">Once you start filming, you can't change anything — the cast, locations and budget are locked.</strong> The project will move to Distribution with its real calculated rating.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowFilmingDisclaimer(false)} className="px-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-gray-300 text-xs font-black cursor-pointer">No</button>
              <button onClick={() => { const r = startFilming(studio, prodProject.id); showFb(r.message); setShowFilmingDisclaimer(false); setProdProject(null); refresh(); }} className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-black cursor-pointer">Yes — Start Filming</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ DISTRIBUTION MODAL ============ */}
      {distProject && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <button onClick={() => setDistProject(null)} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer">← Back</button>
            <span className="text-xs font-black">Distribution · {distProject.title}</span>
            <span className="text-[10px] text-gray-500">Top</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
              <p className="text-xs font-black text-white">{distProject.title}</p>
              <p className="text-[10px] text-gray-400">Director: {distProject.director} · Budget ${(distProject.totalBudget / 1000000).toFixed(0)}M</p>
              <p className="text-[10px] text-gray-400">{distProject.description}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                ['Cast & Crew', distProject.ratings.castCrew],
                ['Directing & Production', distProject.ratings.directing],
                ['Editing Sound & VFX', distProject.ratings.editingSoundVfx],
                ['Equipment', distProject.ratings.equipment],
                ['Location Set & Design', distProject.ratings.locationSet],
                ['Screenplay', distProject.ratings.screenplay],
              ].map(([label, val]) => (
                <div key={label as string} className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">{label}</p>
                  <p className="text-sm font-black text-amber-300">{val as number}</p>
                </div>
              ))}
              <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/40 col-span-2 sm:col-span-3">
                <p className="text-[9px] text-gray-400 uppercase font-bold">Overall Rating (real, from your choices)</p>
                <p className="text-lg font-black text-emerald-400">{distProject.overallRating}/100</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Release Window (5-20 weeks)</p>
              <input type="range" min={5} max={20} value={distWeeks} onChange={(e) => setDistWeeks(Number(e.target.value))} className="w-full accent-emerald-400" />
              <p className="text-xs font-black text-white text-center">{distWeeks} weeks</p>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Boost Distribution (4-40)</p>
              <input type="range" min={4} max={40} value={boost} onChange={(e) => setBoost(Number(e.target.value))} className="w-full accent-amber-400" />
              <p className="text-xs font-black text-amber-300 text-center">+{boost}</p>
            </div>
            <button onClick={handleStartDistribution} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer">START DISTRIBUTION</button>
          </div>
        </div>
      )}

      {/* ============ RELEASE MODAL ============ */}
      {relProject && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <button onClick={() => setRelProject(null)} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer">← Back</button>
            <span className="text-xs font-black">Release · {relProject.title}</span>
            <span className="text-[10px] text-gray-500">Top</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Marketing Budget</p>
              <input type="number" min={0} step={1000000} value={mktBudget} onChange={(e) => setMktBudget(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none" />
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-purple-500/30">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Network Release — Pitch % (total must be 100%)</p>
              <div className="space-y-2 mt-2">
                {networks.map((n) => (
                  <div key={n.id} className="flex items-center gap-2">
                    <img src={n.logoUrl} alt={n.name} className="w-6 h-6 rounded object-cover border border-white/20 shrink-0" />
                    <span className="text-[10px] font-black text-white w-28 truncate">{n.name}</span>
                    <input type="range" min={0} max={100} value={pitchPcts[n.id] || 0} onChange={(e) => setPitchPcts((p) => ({ ...p, [n.id]: Number(e.target.value) }))} className="flex-1 accent-purple-400" />
                    <span className="text-[10px] font-black text-purple-300 w-10 text-right">{pitchPcts[n.id] || 0}%</span>
                  </div>
                ))}
              </div>
              <p className={`text-[10px] font-black mt-2 ${Math.abs(Object.values(pitchPcts).reduce((a, b) => a + (b || 0), 0) - 100) <= 0.01 ? 'text-emerald-300' : 'text-rose-300'}`}>
                Total: {Object.values(pitchPcts).reduce((a, b) => a + (b || 0), 0)}% {Math.abs(Object.values(pitchPcts).reduce((a, b) => a + (b || 0), 0) - 100) <= 0.01 ? '✓' : '(must be 100%)'}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Release Window (10-40 weeks)</p>
              <input type="range" min={10} max={40} value={relWeeks} onChange={(e) => setRelWeeks(Number(e.target.value))} className="w-full accent-purple-400" />
              <p className="text-xs font-black text-white text-center">{relWeeks} weeks</p>
            </div>
            <button onClick={handlePitchNetworks} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-sky-500 text-black font-black text-xs uppercase tracking-wider shadow-xl cursor-pointer">PITCH TO NETWORKS</button>

            {/* BIDS DISPLAY — after pitching, show each platform's bid */}
            {relProject.bids && relProject.bids.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400">Platform Bids ({relProject.bids.length})</h4>
                {[...relProject.bids].sort((a, b) => b.amount - a.amount).map((bid, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border flex items-center gap-2 ${i === 0 ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/10 bg-black/40'}`}>
                    <img src={bid.logoUrl} alt="" className="w-7 h-7 rounded object-cover border border-white/20" />
                    <span className="text-[10px] font-black text-white flex-1">{bid.network} {i === 0 && <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black ml-1">TOP BID</span>}</span>
                    <span className="text-[11px] font-black text-emerald-400">${bid.amount.toLocaleString()}</span>
                  </div>
                ))}
                {relProject.winningNetwork && (
                  <p className="text-[10px] text-amber-300 font-bold text-center">🏆 {relProject.winningNetwork} won — they'll promote on socials!</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
