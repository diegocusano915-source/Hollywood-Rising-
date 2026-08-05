/**
 * HOLLYWOOD RISING - Executive Management Sub-View
 * C-Suite Executive hiring & management: CEO, COO, CFO, Marketing, Creative, Legal, HR, Studio President.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Executive, ExecutiveRole, EmpireFullState, BusinessVenture } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import { Users, UserPlus, UserX, Award, ShieldCheck, DollarSign, Sparkles, Briefcase } from 'lucide-react';

interface Props {
  business: BusinessVenture;
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const CANDIDATE_POOL: Omit<Executive, 'id' | 'yearsEmployed'>[] = [
  {
    name: 'Eleanor Vance',
    role: 'CEO',
    salary: 520000,
    bonus: 100000,
    efficiency: 92,
    morale: 88,
    leadership: 95,
    experience: 90,
    negotiation: 88,
    creativity: 82,
    loyalty: 85,
    performance: 92,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    background: 'Former COO at Disney Motion Pictures & Wall Street Managing Director.',
  },
  {
    name: 'Marcus Sterling',
    role: 'COO',
    salary: 420000,
    bonus: 75000,
    efficiency: 88,
    morale: 90,
    leadership: 85,
    experience: 86,
    negotiation: 82,
    creativity: 78,
    loyalty: 90,
    performance: 88,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    background: 'Operations logistics veteran across Silicon Valley & Universal Studios.',
  },
  {
    name: 'Victoria Rothschild',
    role: 'CFO',
    salary: 480000,
    bonus: 90000,
    efficiency: 95,
    morale: 85,
    leadership: 88,
    experience: 94,
    negotiation: 92,
    creativity: 70,
    loyalty: 88,
    performance: 94,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    background: 'Ex-Goldman Sachs Partner & Corporate Restructuring Specialist.',
  },
  {
    name: 'Julian Thorne',
    role: 'Marketing Director',
    salary: 350000,
    bonus: 50000,
    efficiency: 86,
    morale: 92,
    leadership: 82,
    experience: 80,
    negotiation: 84,
    creativity: 96,
    loyalty: 80,
    performance: 89,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    background: 'Global viral marketing genius credited with $1B blockbuster rollouts.',
  },
  {
    name: 'Seraphina Dupré',
    role: 'Creative Director',
    salary: 380000,
    bonus: 60000,
    efficiency: 84,
    morale: 95,
    leadership: 80,
    experience: 82,
    negotiation: 75,
    creativity: 98,
    loyalty: 82,
    performance: 90,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    background: 'Palme d’Or winning producer & high-fashion creative strategist.',
  },
  {
    name: 'Harrison Blake, Esq.',
    role: 'Legal Counsel',
    salary: 450000,
    bonus: 80000,
    efficiency: 96,
    morale: 88,
    leadership: 86,
    experience: 95,
    negotiation: 98,
    creativity: 72,
    loyalty: 92,
    performance: 95,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    background: 'Senior M&A Litigation Partner at Latham & Watkins Hollywood.',
  },
  {
    name: 'Chloe Laurent',
    role: 'HR Director',
    salary: 280000,
    bonus: 40000,
    efficiency: 90,
    morale: 96,
    leadership: 88,
    experience: 84,
    negotiation: 85,
    creativity: 80,
    loyalty: 94,
    performance: 91,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    background: 'Executive recruiter & talent retention expert for Fortune 500 CEOs.',
  },
  {
    name: 'Arthur Pendelton',
    role: 'Studio President',
    salary: 600000,
    bonus: 150000,
    efficiency: 94,
    morale: 90,
    leadership: 96,
    experience: 98,
    negotiation: 94,
    creativity: 90,
    loyalty: 88,
    performance: 95,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    background: '30-year veteran Warner Bros & Sony Pictures Studio Chief.',
  },
];

export const ExecutiveManagementView: React.FC<Props> = ({
  business,
  empireState,
  onUpdateState,
  onBack,
}) => {
  const { player } = useGame();
  const currentExecs = business.executives || [];
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleHireExecutive = (cand: Omit<Executive, 'id' | 'yearsEmployed'>) => {
    setErrorMsg(null);
    setNotification(null);
    if (currentExecs.some((e) => e.role === cand.role)) {
      setErrorMsg(`There is already an active ${cand.role} hired at ${business.name}. Fire the existing executive first to replace.`);
      return;
    }

    const signingFee = Math.floor(cand.salary / 2);
    if (player.money < signingFee) {
      setErrorMsg(`Insufficient funds! Hiring ${cand.name} requires a $${signingFee.toLocaleString()} signing bonus.`);
      return;
    }

    player.money -= signingFee;

    const newExec: Executive = {
      ...cand,
      id: `exec_${Date.now()}`,
      yearsEmployed: 1,
    };

    const updatedBusinesses = empireState.businesses.map((b) => {
      if (b.id === business.id) {
        return {
          ...b,
          executives: [...(b.executives || []), newExec],
        };
      }
      return b;
    });

    const updated: EmpireFullState = {
      ...empireState,
      businesses: updatedBusinesses,
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`👔 EXECUTIVE APPOINTMENT: Hired ${newExec.name} as ${newExec.role} at ${business.name}!`);
  };

  const handleFireExecutive = (execId: string, roleName: string) => {
    setErrorMsg(null);
    setNotification(null);
    const updatedBusinesses = empireState.businesses.map((b) => {
      if (b.id === business.id) {
        return {
          ...b,
          executives: (b.executives || []).filter((e) => e.id !== execId),
        };
      }
      return b;
    });

    const updated: EmpireFullState = {
      ...empireState,
      businesses: updatedBusinesses,
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`🔥 EXECUTIVE TERMINATION: Fired the ${roleName} from ${business.name}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Business
          </button>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 block">{business.name}</span>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">C-Suite Executive Management</h2>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}

      {/* Current Executive Team Grid: 3 Cards Per Row */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Appointed Executive Officers ({currentExecs.length})
          </span>
          <span className="text-xs text-amber-300 font-bold">Directly Affects Growth & Profit Margins</span>
        </div>

        {currentExecs.length === 0 ? (
          <div className="p-8 rounded-3xl border border-white/10 bg-black/60 text-center text-xs text-gray-400">
            No executives hired yet for {business.name}. Hire C-Suite officers from the candidate pool below!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentExecs.map((exec) => (
              <div
                key={exec.id}
                className="p-5 rounded-3xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={exec.avatarUrl}
                      alt={exec.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-amber-400/40"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400 px-2 py-0.5 rounded bg-amber-500/20">
                        {exec.role}
                      </span>
                      <h3 className="text-base font-black text-white mt-1">{exec.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{exec.background}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Leadership:</span>
                    <span className="text-amber-300 font-bold">{exec.leadership}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-emerald-400 font-bold">{exec.experience}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Negotiation:</span>
                    <span className="text-sky-300 font-bold">{exec.negotiation}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creativity:</span>
                    <span className="text-purple-300 font-bold">{exec.creativity}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Loyalty:</span>
                    <span className="text-pink-300 font-bold">{exec.loyalty}/100</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10">
                    <span className="text-gray-400">Salary:</span>
                    <span className="text-white font-bold">${exec.salary.toLocaleString()}/yr</span>
                  </div>
                </div>

                <button
                  onClick={() => handleFireExecutive(exec.id, exec.role)}
                  className="w-full py-2.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-black text-xs transition-all cursor-pointer shadow-lg"
                >
                  FIRE {exec.role.toUpperCase()}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Executive Candidate Pool: 3 Cards Per Row */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Executive Candidate Talent Pool
          </span>
          <span className="text-xs text-emerald-400 font-bold">50% Signing Bonus Required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CANDIDATE_POOL.map((cand, idx) => {
            const isHired = currentExecs.some((e) => e.role === cand.role);

            return (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.avatarUrl}
                      alt={cand.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/20">
                        {cand.role}
                      </span>
                      <h3 className="text-base font-black text-white mt-1">{cand.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">{cand.background}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Leadership:</span>
                    <span className="text-amber-300 font-bold">{cand.leadership}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-emerald-400 font-bold">{cand.experience}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Negotiation:</span>
                    <span className="text-sky-300 font-bold">{cand.negotiation}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creativity:</span>
                    <span className="text-purple-300 font-bold">{cand.creativity}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Loyalty:</span>
                    <span className="text-pink-300 font-bold">{cand.loyalty}/100</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10">
                    <span className="text-gray-400">Annual Salary:</span>
                    <span className="text-emerald-400 font-bold">${cand.salary.toLocaleString()}/yr</span>
                  </div>
                </div>

                {!isHired ? (
                  <button
                    onClick={() => handleHireExecutive(cand)}
                    className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-lg"
                  >
                    HIRE {cand.role.toUpperCase()} (${Math.floor(cand.salary / 2).toLocaleString()} BONUS)
                  </button>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black text-center">
                    POSITION FILLED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
