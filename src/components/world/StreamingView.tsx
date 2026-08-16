/**
 * HOLLYWOOD RISING - STREAMING PLATFORMS (REWIRED)
 * Real platforms with logos (Netflix, Prime, Disney+...), personality tiers,
 * pitch -> bid -> accept/counter/reject negotiation, exclusive/non-exclusive,
 * weekly royalties, social promotion for the winning platform.
 */
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  StreamingPlatform,
} from '../../types/world';
import {
  loadStreamingState,
  saveStreamingState,
  submitPitch,
  acceptBid,
  counterBid,
  rejectBid,
  platformPersonality,
} from '../../services/streamingEngine';
import { loadStudioState, saveStudioState } from '../../services/personalStudioEngine';
import {
  ArrowLeft,
  Video,
  Building2,
  Handshake,
  X,
  Check,
  Send,
  TrendingUp,
  Crown,
  Film,
  Tv,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface StreamingViewProps {
  onBack: () => void;
}

/** Real brand identities — official colors + wordmark styling per platform */
const BRAND: Record<string, { bg: string; text: string; label: string; sub?: string; cls?: string }> = {
  stream_netflix:   { bg: '#E50914', text: '#fff', label: 'N', sub: 'NETFLIX', cls: 'font-black tracking-tight' },
  stream_prime:    { bg: '#0F171E', text: '#00A8E1', label: 'prime video', cls: 'font-black lowercase tracking-tight' },
  stream_apple:     { bg: '#000000', text: '#fff', label: 'tv+', sub: 'Apple', cls: 'font-semibold tracking-tight' },
  stream_disney:    { bg: '#0C1C3C', text: '#fff', label: 'Disney+', cls: 'font-semibold tracking-wide' },
  stream_hbomax:   { bg: '#5822D4', text: '#fff', label: 'HBO', sub: 'max', cls: 'font-black tracking-tight' },
  stream_hulu:      { bg: '#1CE783', text: '#0B0C0F', label: 'hulu', cls: 'font-black lowercase tracking-tighter' },
  stream_paramount: { bg: '#0064FF', text: '#fff', label: 'P+', sub: 'Paramount+', cls: 'font-black tracking-tight' },
  stream_peacock:   { bg: '#000000', text: '#fff', label: 'Peacock', cls: 'font-black tracking-tight' },
  stream_youtube:   { bg: '#FF0000', text: '#fff', label: '▶', sub: 'YouTube', cls: 'font-black' },
  stream_crunchyroll: { bg: '#F47521', text: '#fff', label: 'CR', sub: 'Crunchyroll', cls: 'font-black tracking-tight' },
  stream_mubi:      { bg: '#000000', text: '#fff', label: 'MUBI', cls: 'font-medium tracking-[0.2em]' },
  stream_roku:      { bg: '#662D91', text: '#fff', label: 'Roku', cls: 'font-semibold' },
};

const BrandLogo: React.FC<{ platformId: string; name: string; logoUrl: string; size?: 'sm' | 'md' | 'lg' }> = ({ platformId, name, logoUrl, size = 'md' }) => {
  const brand = BRAND[platformId];
  const dims = size === 'sm' ? 'w-6 h-6 text-[7px]' : size === 'lg' ? 'w-14 h-14 text-[13px]' : 'w-9 h-9 text-[10px]';
  if (!brand) {
    // fallback: first-letter tile from the platform's own name
    return (
      <div className={`${dims} rounded-lg object-cover border border-white/20 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black text-white font-black shrink-0`}>
        {name.charAt(0)}
      </div>
    );
  }
  return (
    <div
      className={`${dims} rounded-lg flex flex-col items-center justify-center shrink-0 border border-white/10 overflow-hidden`}
      style={{ background: brand.bg, color: brand.text }}
      title={name}
    >
      <span className={`${brand.cls} leading-none`}>{brand.label}</span>
      {brand.sub && <span className="text-[5.5px] leading-none mt-[1px] opacity-90 tracking-wide">{brand.sub}</span>}
    </div>
  );
};

const TIER_STYLE: Record<string, string> = {
  Mega: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Major: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Mid: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  Indie: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
};

export const StreamingView: React.FC<StreamingViewProps> = ({ onBack }) => {
  const { player, settings, releasedMovies, updateSave, saveData, updateSave: updateSaveData } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];
  const [state, setState] = useState(() => loadStreamingState());
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatform | null>(null);
  const [pitchProject, setPitchProject] = useState<any>(null);
  const [exclusive, setExclusive] = useState(false);
  const [counterPct, setCounterPct] = useState(10);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFb = (m: string) => { setFeedback(m); setTimeout(() => setFeedback(null), 5000); };
  const refresh = () => setState({ ...loadStreamingState() });

  const studio = loadStudioState();
  const studioProjects = studio.projects.filter((p) => p.status === 'ACTIVE' || p.status === 'COMPLETED');
  const pickable = [...(releasedMovies || []).slice(0, 5), ...studioProjects];

  // Pitch the selected project to the selected platform
  const doPitch = () => {
    if (!selectedPlatform || !pitchProject) return;
    const isStudio = pitchProject && pitchProject.id && pitchProject.id.startsWith('proj_');
    const rating = isStudio ? (pitchProject.overallRating || 70) : (pitchProject.criticRating || 70);
    const budget = isStudio ? (pitchProject.totalBudget || 10000000) : (pitchProject.budget || 30000000);
    const gross = isStudio ? 0 : (pitchProject.worldwideGross || 0);
    const type = isStudio ? (pitchProject.type === 'Series' ? 'Series' : 'Movie') : (pitchProject.category === 'TV Series' ? 'Series' : 'Movie');
    const res = submitPitch(state, selectedPlatform.id, pitchProject.movieTitle || pitchProject.title, type, rating, budget, gross, exclusive, pitchProject.id);
    showFb(res.message);
    setPitchProject(null);
    refresh();
  };

  // Handle a pending bid on this platform
  const pendingBid = state.pendingBids.find((b) => b.platformId === selectedPlatform?.id && b.status === 'PENDING');

  return (
    <div className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4" style={{ backgroundColor: theme.background }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button onClick={onBack} className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg">
          <ArrowLeft className="w-4 h-4 text-amber-400" /> <span>Back to World</span>
        </button>
        <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
          <Video className="w-5 h-5 text-red-400" /> <span>Streaming Platforms</span>
        </div>
      </div>

      {feedback && <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-black text-center">{feedback}</div>}

      <div className="p-4 rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-black/70 to-black/70 space-y-1">
        <h2 className="text-sm font-black uppercase tracking-wider text-red-200 flex items-center gap-2"><Building2 className="w-4 h-4 text-red-400" /> Network Bidding & Licensing</h2>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Pitch your movies/series to real platforms — they <strong className="text-white">bid</strong>, you <strong className="text-white">negotiate</strong> (accept / counter / reject).
          Exclusive deals pay more and they promote you on socials. Active deals earn <strong className="text-white">weekly streaming royalties</strong>.
        </p>
      </div>

      {/* Platform grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {state.platforms.map((p) => {
          const pers = platformPersonality(p);
          const deals = p.activeDeals?.length || 0;
          return (
            <button key={p.id} onClick={() => setSelectedPlatform(p)} className="p-3 rounded-2xl border border-white/10 bg-black/50 text-left cursor-pointer hover:border-red-400 transition-all">
              <div className="flex items-center gap-2">
                <BrandLogo platformId={p.id} name={p.name} logoUrl={p.logoUrl} size="lg" />
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white truncate">{p.name}</p>
                  <p className="text-[8px] text-gray-500">{p.subscribers}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`px-1.5 py-0.5 rounded border text-[8px] font-black ${TIER_STYLE[p.budgetTier] || TIER_STYLE.Mid}`}>{p.budgetTier}</span>
                <span className={`text-[8px] font-black ${p.status === 'Exclusive' ? 'text-emerald-300' : p.status === 'Partner' ? 'text-sky-300' : 'text-gray-500'}`}>{p.status}</span>
                {deals > 0 && <span className="text-[8px] text-amber-300 font-black ml-auto">{deals} deal{deals > 1 ? 's' : ''}</span>}
              </div>
              <p className="text-[8px] text-gray-600 mt-1 truncate">{pers.tierLabel} · Rep {p.reputation}</p>
            </button>
          );
        })}
      </div>

      {/* Selected platform detail */}
      {selectedPlatform && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <button onClick={() => setSelectedPlatform(null)} className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold cursor-pointer">← Back</button>
            <div className="flex items-center gap-2">
              <BrandLogo platformId={selectedPlatform.id} name={selectedPlatform.name} logoUrl={selectedPlatform.logoUrl} size="sm" />
              <span className="text-xs font-black">{selectedPlatform.name}</span>
            </div>
            <span className="text-[10px] text-gray-500">{selectedPlatform.subscribers}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Platform info */}
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-3">
                <BrandLogo platformId={selectedPlatform.id} name={selectedPlatform.name} logoUrl={selectedPlatform.logoUrl} size="lg" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-white">{selectedPlatform.name}</p>
                  <p className="text-[10px] text-gray-400">{platformPersonality(selectedPlatform).tierLabel} · Reputation {selectedPlatform.reputation}/100</p>
                  <p className="text-[9px] text-gray-500">Genres: {selectedPlatform.genrePrefs?.join(', ') || 'All'}</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500">Status: <strong className={selectedPlatform.status === 'Exclusive' ? 'text-emerald-300' : selectedPlatform.status === 'Partner' ? 'text-sky-300' : 'text-gray-400'}>{selectedPlatform.status}</strong> · {selectedPlatform.moviesLicensed + selectedPlatform.seriesLicensed} works licensed</p>
            </div>

            {/* Active deals */}
            {selectedPlatform.activeDeals && selectedPlatform.activeDeals.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-gray-400">Active Deals ({selectedPlatform.activeDeals.length})</h4>
                {selectedPlatform.activeDeals.slice(0, 5).map((d) => (
                  <div key={d.id} className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[10px]">
                    <p className="font-black text-white">{d.projectTitle} <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${d.exclusive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'}`}>{d.exclusive ? 'EXCLUSIVE' : 'NON-EXCL'}</span></p>
                    <p className="text-gray-500">${d.upfront.toLocaleString()} upfront · {d.royaltyRate}% royalty · {d.weeksRemaining}w left · ${d.weeklyRoyalty.toLocaleString()}/wk</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pending bid on this platform */}
            {pendingBid && (
              <div className="p-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-2">
                <p className="text-xs font-black text-amber-200 flex items-center gap-1.5"><Handshake className="w-4 h-4" /> Offer from {selectedPlatform.name}</p>
                <p className="text-[10px] text-gray-300">{pendingBid.projectTitle} · {pendingBid.projectType} · {pendingBid.exclusive ? 'EXCLUSIVE' : 'Non-exclusive'}</p>
                <p className="text-sm font-black text-emerald-400">${pendingBid.upfront.toLocaleString()} upfront · {pendingBid.royaltyRate}% royalty</p>
                <div className="flex gap-2">
                  <button onClick={() => { const r = acceptBid(state, pendingBid.id); if (r.success) updateSave({ ...saveData, player: { ...player, money: (player.money || 0) + r.upfront } }); showFb(r.message); refresh(); setSelectedPlatform(null); }} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black text-[10px] font-black cursor-pointer">✓ ACCEPT</button>
                  <button onClick={() => { const r = counterBid(state, pendingBid.id, counterPct); showFb(r.message); if (r.success) updateSave({ ...saveData, player: { ...player, money: (player.money || 0) + r.newUpfront } }); refresh(); if (r.success) setSelectedPlatform(null); }} className="flex-1 py-2.5 rounded-xl bg-sky-500 text-black text-[10px] font-black cursor-pointer">↔ COUNTER (+{counterPct}%)</button>
                  <button onClick={() => { rejectBid(state, pendingBid.id); showFb('Offer rejected.'); refresh(); }} className="px-3 py-2.5 rounded-xl bg-rose-600 text-white text-[10px] font-black cursor-pointer">✕</button>
                </div>
                <input type="range" min={5} max={50} step={5} value={counterPct} onChange={(e) => setCounterPct(Number(e.target.value))} className="w-full accent-sky-400" />
                <p className="text-[8px] text-gray-500 text-center">Counter amount: +{counterPct}% (60% chance they accept)</p>
              </div>
            )}

            {/* Pitch a project */}
            {!pendingBid && (
              <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400">Pitch a project to {selectedPlatform.name}</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {pickable.length === 0 && <p className="text-[10px] text-gray-500">Release movies or produce studio projects first.</p>}
                  {pickable.map((proj: any) => (
                    <button key={proj.id || proj.movieTitle} onClick={() => setPitchProject(proj)} className={`w-full p-2 rounded-xl border text-left text-[10px] cursor-pointer ${pitchProject?.id === proj.id || pitchProject?.movieTitle === proj.movieTitle ? 'bg-red-500/20 border-red-400/50 text-white' : 'bg-black/40 border-white/10 text-gray-300'}`}>
                      {proj.movieTitle || proj.title} · {proj.type || proj.category || 'Movie'}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setExclusive(false)} className={`flex-1 py-2 rounded-xl text-[9px] font-black cursor-pointer ${!exclusive ? 'bg-sky-500 text-black' : 'bg-white/10 text-gray-300'}`}>Non-Exclusive (smaller, keep rights)</button>
                  <button onClick={() => setExclusive(true)} className={`flex-1 py-2 rounded-xl text-[9px] font-black cursor-pointer ${exclusive ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-300'}`}>Exclusive (bigger + promo)</button>
                </div>
                <button disabled={!pitchProject} onClick={doPitch} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-black text-[10px] font-black cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> PITCH TO {selectedPlatform.name.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
