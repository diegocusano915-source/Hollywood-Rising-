/**
 * HOLLYWOOD RISING - AUDITION ARENA (Option C rebuild)
 * Competitive casting board. Every listing gates behind REAL requirements
 * (completed acting courses, fame, skill, union, agent) — the invisible
 * checker in applyToCallboard declines unqualified submissions with
 * specific reasons. Odds are computed from the actual decision engine.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Film, Zap } from 'lucide-react';
import { CallboardProject, BookedProject, Player } from '../../types/game';
import { ContractNegotiationModal } from './ContractNegotiationModal';

const RIVAL_NAMES = ['Jonas Merek', 'Sasha Lane', 'Devon Cole', 'Mira Vasquez', 'Elliot Shaw', 'Priya Nandi', 'Cole Hartman', 'Ingrid Solis', 'Marcus Bell', 'Talia Reyes'];

/** Deterministic hash so a listing's rivals stay stable across renders */
const hashId = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const gateCheck = (proj: CallboardProject, player: Player) => {
  const coursesDone = Math.max(player.completedCourseIds?.length || 0, player.completedCourseRecords?.length || 0);
  const reqCourses = proj.requiredCourses ?? 0;
  const agentSigned = !!(player as any).representation?.agent?.signed;
  const gates: Array<{ label: string; pass: boolean; detail: string }> = [
    { label: `COURSES ${reqCourses}`, pass: coursesDone >= reqCourses, detail: `${coursesDone} done` },
  ];
  if (proj.requiredFameXp) {
    gates.push({ label: `FAME ${proj.requiredFameXp}`, pass: (player.fameXp || 0) >= proj.requiredFameXp, detail: `${(player.fameXp || 0).toLocaleString()} xp` });
  }
  if (proj.requiredActing) {
    gates.push({ label: `ACTING ${proj.requiredActing}`, pass: (player.talents?.acting || 0) >= proj.requiredActing, detail: `${player.talents?.acting || 0}` });
  }
  if (proj.budget > 50000000) {
    gates.push({ label: 'SAG-AFTRA', pass: !!player.isUnionMember, detail: player.isUnionMember ? 'member' : 'non-union' });
  }
  if (proj.budget > 120000000 && proj.roleType === 'Lead') {
    gates.push({ label: 'AGENT', pass: agentSigned, detail: agentSigned ? 'signed' : 'none' });
  }
  gates.push({ label: '20 ENERGY', pass: player.energy >= 20, detail: `${player.energy}⚡` });
  return { gates, allPass: gates.every((g) => g.pass), coursesDone };
};

/** Book-odds % mirroring the real decision engine formula */
const computeOdds = (proj: CallboardProject, player: Player): number => {
  const t = player.talents || ({} as any);
  const talents = [t.acting, t.voice, t.comedy, t.drama, t.action, t.dancing].map((v) => v || 0);
  const avgTalent = talents.reduce((a, b) => a + b, 0) / Math.max(1, talents.length);
  const coursesDone = Math.max(player.completedCourseIds?.length || 0, player.completedCourseRecords?.length || 0);
  const courseBonus = Math.min(25, coursesDone * 5);
  let score = (t.acting || 0) * 0.4 + avgTalent * 0.35 + (player.fameXp || 0) / 100 + courseBonus;
  if (player.isUnionMember) score += 15;
  score += (player.leadRolesCount || 0) * 5;
  if (!!(player as any).representation?.agent?.signed) score += 12;
  const required = proj.roleType === 'Lead' || proj.roleType === 'Principal' ? 27 : proj.roleType === 'Support' ? 20 : 15;
  // decision: score + rand(0..20) >= required
  return Math.max(4, Math.min(92, Math.round(((score + 20 - required) / 20) * 100)));
};

const OddsRing: React.FC<{ pct: number }> = ({ pct }) => {
  const deg = Math.round((pct / 100) * 360);
  const col = pct >= 55 ? '#4ade80' : pct >= 30 ? '#fbbf24' : '#fb7185';
  return (
    <div className="text-center shrink-0">
      <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${col} 0deg ${deg}deg, rgba(255,255,255,0.08) ${deg}deg 360deg)` }}>
        <div className="w-[47px] h-[47px] rounded-full bg-[#0d0d18] flex flex-col items-center justify-center">
          <b className="text-[15px] font-mono" style={{ color: col }}>{pct}%</b>
          <span className="text-[5.5px] text-gray-500 tracking-widest">ODDS</span>
        </div>
      </div>
    </div>
  );
};

export const CallboardModal: React.FC = () => {
  const { setActiveModal, callboard, applyToCallboard, player, saveData, updateSave } = useGame();

  const [activeTab, setActiveTab] = useState<'ARENA' | 'FOR_YOU' | 'LOCKED' | 'IN_ROOM'>('ARENA');
  const [negotiatingProject, setNegotiatingProject] = useState<CallboardProject | null>(null);
  const [decline, setDecline] = useState<{ title: string; reasons: string[] } | null>(null);

  const coursesDone = Math.max(player.completedCourseIds?.length || 0, player.completedCourseRecords?.length || 0);
  const agentSigned = !!(player as any).representation?.agent?.signed;
  const totalSubmissions = saveData.auditions?.length || 0;
  const rolesBooked = saveData.bookedProjects?.length || 0;
  const waitingAuditions = (saveData.auditions || []).slice(0, 12);

  const evaluated = callboard.map((proj) => {
    const { gates, allPass } = gateCheck(proj, player);
    return { proj, gates, allPass, odds: computeOdds(proj, player) };
  });

  const filtered =
    activeTab === 'FOR_YOU' ? evaluated.filter((e) => e.allPass)
    : activeTab === 'LOCKED' ? evaluated.filter((e) => !e.allPass)
    : evaluated;

  const handleApply = (proj: CallboardProject) => {
    const res: any = applyToCallboard(proj.id);
    if (!res.success) {
      setDecline({ title: proj.title, reasons: res.reasons || [res.message] });
    }
  };

  const handleContractSigned = (newBooked: BookedProject) => {
    const updatedCallboard = callboard.filter((p) => p.id !== newBooked.projectId);
    updateSave({
      ...saveData,
      callboard: updatedCallboard,
      bookedProjects: [newBooked, ...saveData.bookedProjects],
    });
    setNegotiatingProject(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      {negotiatingProject && (
        <ContractNegotiationModal project={negotiatingProject} onClose={() => setNegotiatingProject(null)} onSuccess={handleContractSigned} />
      )}

      <div className="w-full max-w-lg max-h-[94vh] rounded-3xl flex flex-col overflow-hidden border shadow-2xl bg-[#0b0b14] border-purple-500/25">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-purple-500/15 via-[#0d0d18] to-[#0d0d18]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider">Audition Arena</h2>
              <p className="text-[8.5px] text-gray-400 tracking-[2px]">COMPETITIVE CASTING · NO HANDOUTS</p>
            </div>
          </div>
          <button onClick={() => setActiveModal('none')} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Standing banner */}
        <div className="mx-3 mt-3 rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/5 px-3.5 py-2.5">
          <div className="flex justify-between items-center mb-1.5">
            <b className="text-[10px] text-purple-200 tracking-wider">YOUR STANDING</b>
            <span className="text-[8px] text-gray-400 font-mono">WK {player.dateWeek} · {player.dateYear}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {[
              ['FAME', `${(player.fameXp || 0).toLocaleString()}`, '#e8e8f4'],
              ['ACTING', `${player.talents?.acting || 0}`, '#e8e8f4'],
              ['COURSES', `${coursesDone}`, '#c084fc'],
              ['UNION', player.isUnionMember ? 'SAG ✓' : 'NON-SAG', player.isUnionMember ? '#4ade80' : '#fb7185'],
              ['BOOK RATE', totalSubmissions > 0 ? `${Math.round((rolesBooked / totalSubmissions) * 100)}%` : '—', '#fbbf24'],
            ].map(([cap, val, color]) => (
              <div key={cap}>
                <span className="text-[6.5px] text-gray-500 tracking-wider block">{cap}</span>
                <b className="text-[11px] font-mono block" style={{ color: color as string }}>{val}</b>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-3 py-2.5 flex gap-1.5 overflow-x-auto border-b border-white/10">
          {([
            ['ARENA', `Arena ${callboard.length}`],
            ['FOR_YOU', `For You ${evaluated.filter((e) => e.allPass).length}`],
            ['LOCKED', `Locked ${evaluated.filter((e) => !e.allPass).length}`],
            ['IN_ROOM', `In Room ${waitingAuditions.length}`],
          ] as const).map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-3 py-1.5 rounded-full text-[9.5px] font-black whitespace-nowrap cursor-pointer ${activeTab === id ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Decline panel — the invisible checker's reasons */}
        {decline && (
          <div className="mx-3 mt-3 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <b className="text-[10.5px] text-rose-300">🚫 SUBMISSION DECLINED — "{decline.title}"</b>
              <button onClick={() => setDecline(null)} className="text-rose-300 font-black text-xs cursor-pointer">✕</button>
            </div>
            <p className="text-[8.5px] text-rose-200/70">The casting director's office returned your headshot. Fix every item below and the door reopens:</p>
            {decline.reasons.map((r, i) => (
              <p key={i} className="text-[9.5px] text-rose-100 bg-black/30 rounded-lg px-2.5 py-2 leading-relaxed">✕ {r}</p>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* IN THE ROOM — submitted auditions */}
          {activeTab === 'IN_ROOM' ? (
            waitingAuditions.length === 0 ? (
              <div className="text-center py-10">
                <Film className="w-10 h-10 mx-auto text-gray-600" />
                <p className="text-[11px] text-gray-400 mt-3 font-bold">You're not in any rooms right now.</p>
                <p className="text-[9px] text-gray-600">Submit from the Arena — decisions take 2-5 weeks.</p>
              </div>
            ) : (
              waitingAuditions.map((a) => (
                <div key={a.id} className="rounded-2xl border border-amber-400/30 bg-white/[0.03] p-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <b className="text-[12px] text-white block truncate">{a.movieTitle}</b>
                      <span className="text-[8.5px] text-gray-400 block">{a.roleType} · {a.studio} · ${a.salary.toLocaleString()}</span>
                      <span className="text-[7.5px] font-black text-amber-300 mt-1.5 inline-block bg-amber-400/10 border border-amber-400/30 rounded-full px-2.5 py-1">
                        ⏳ {a.status.toUpperCase()} · WK {Math.max(0, a.weeksRemaining)} TO DECISION
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <Film className="w-10 h-10 mx-auto text-gray-600" />
              <p className="text-[11px] text-gray-400 mt-3 font-bold">
                {activeTab === 'FOR_YOU' ? 'No rooms you qualify for yet.' : activeTab === 'LOCKED' ? 'Nothing is locked — impressive.' : 'No listings this week.'}
              </p>
              <p className="text-[9px] text-gray-600 mt-1">
                {activeTab === 'FOR_YOU' ? 'Graduate acting courses and build fame to unlock bigger rooms.' : 'The board refreshes every week.'}
              </p>
            </div>
          ) : (
            filtered.map(({ proj, gates, allPass, odds }) => {
              // Deterministic display rivals (competitive context for the real decision)
              const h = hashId(proj.id);
              const rivals = [0, 1].map((i) => {
                const name = RIVAL_NAMES[(h + i * 3) % RIVAL_NAMES.length];
                const rivalFame = Math.round(proj.requiredFameXp * (0.9 + ((h >> (i + 2)) % 40) / 100) + 40);
                const stronger = rivalFame > (player.fameXp || 0) + 30;
                return { name, fame: rivalFame, stronger };
              });
              return (
                <div key={proj.id} className={`rounded-2xl border p-3.5 ${allPass ? 'border-white/10 bg-white/[0.04]' : 'border-white/10 border-dashed bg-white/[0.02] opacity-80'}`}>
                  <div className="flex justify-between items-start gap-2.5">
                    <div className="flex-1 min-w-0">
                      <b className="text-[12.5px] text-white block truncate">{proj.title}</b>
                      <span className="text-[8.5px] text-gray-400 block truncate">
                        {proj.roleType} · {proj.genre} · ${(proj.budget / 1000000).toFixed(1)}M · {proj.studio} · <span className="text-emerald-300 font-bold">${proj.salary.toLocaleString()}</span>
                      </span>
                      {proj.studioTicker ? (
                        <span className="text-[7px] font-black text-emerald-300 bg-emerald-400/10 border border-emerald-400/35 rounded-full px-2 py-0.5 mt-1.5 inline-block">
                          ◉ REAL STUDIO FILM · {proj.studioTicker}
                        </span>
                      ) : null}
                    </div>
                    {allPass ? <OddsRing pct={odds} /> : (
                      <span className="text-[9px] font-black text-rose-300 bg-rose-400/10 border border-rose-400/35 rounded-lg px-2.5 py-2 shrink-0">🔒 LOCKED</span>
                    )}
                  </div>

                  {/* rivals */}
                  {allPass && (
                    <div className="mt-2.5">
                      <div className="text-[7px] font-black text-gray-500 tracking-[1.5px] mb-1.5 flex justify-between">
                        <span>YOU'RE UP AGAINST {8 + (h % 30)} ACTORS — TOP RIVALS:</span>
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                        <span className="flex items-center gap-1.5 bg-purple-500/15 border border-purple-400/35 rounded-full pr-2.5 pl-0.5 py-0.5 shrink-0">
                          <i className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center not-italic text-[6px] font-black text-white">YOU</i>
                          <span className="text-[8px] text-purple-100 font-bold">{(player.fameXp || 0).toLocaleString()} XP · ACT {player.talents?.acting || 0}</span>
                        </span>
                        {rivals.map((r) => (
                          <span key={r.name} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full pr-2.5 pl-0.5 py-0.5 shrink-0">
                            <i className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center not-italic text-[7px] font-black text-gray-300">{r.name.split(' ').map((w) => w[0]).join('')}</i>
                            <span className="text-[8px] text-gray-300 font-bold">{r.name} {r.stronger ? <b className="text-amber-300">★</b> : null} · {r.fame} XP</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* requirement gates */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {gates.map((g) => (
                      <span key={g.label} className={`text-[7.5px] font-black px-2.5 py-1 rounded-md border ${g.pass ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30' : 'text-rose-300 bg-rose-400/10 border-rose-400/30'}`}>
                        {g.pass ? '✓' : '✕'} {g.label} <span className="opacity-60">({g.detail})</span>
                      </span>
                    ))}
                  </div>

                  {/* actions */}
                  <div className="flex gap-2 mt-3">
                    {!allPass ? (
                      <div className="flex-1 text-center py-2.5 rounded-xl bg-rose-400/5 border border-rose-400/25 text-rose-300 text-[9px] font-black">
                        🔒 {gates.filter((g) => !g.pass).length} GATE{gates.filter((g) => !g.pass).length > 1 ? 'S' : ''} FAILED — NOT WALKING IN
                      </div>
                    ) : (
                      <>
                        <button onClick={() => setNegotiatingProject(proj)} className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-gray-200 text-[9.5px] font-black cursor-pointer">NEGOTIATE</button>
                        <button onClick={() => handleApply(proj)} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-[10px] font-black cursor-pointer shadow-lg shadow-purple-500/30">
                          ENTER THE ROOM (−20⚡)
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer energy */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-black/50 flex items-center justify-between">
          <span className="text-[9px] text-gray-400 font-bold">EVERY ROOM IS COMPETITIVE — SUBMITTING ≠ BOOKING</span>
          <span className="flex items-center gap-1.5 text-[10px] font-black" style={{ color: player.energy >= 20 ? '#c084fc' : '#fb7185' }}>
            <Zap className="w-3.5 h-3.5 fill-current" /> {player.energy}/{player.maxEnergy}
          </span>
        </div>
      </div>
    </div>
  );
};
