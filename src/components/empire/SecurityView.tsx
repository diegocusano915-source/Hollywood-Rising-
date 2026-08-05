/**
 * HOLLYWOOD RISING - Security & Protection Sub-View
 * Phase 5 Empire Scene: Personal Bodyguards, Exec Protection, Cyber, Travel, Family Security.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, SecurityPackage, SecurityCategory } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import { Shield, ShieldAlert, ShieldCheck, Lock, UserCheck, Smartphone, Plane, Users, Home, Building2 } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const CATEGORY_ICONS: Record<SecurityCategory, React.ComponentType<{ className?: string }>> = {
  'Personal Bodyguards': UserCheck,
  'Executive Protection': ShieldCheck,
  'Home Security': Home,
  'Office Security': Building2,
  'Cyber Security': Smartphone,
  'Travel Security': Plane,
  'Family Security': Users,
  'Event Security': Shield,
};

export const SecurityView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player } = useGame();
  const secState = empireState.security || { activePackages: [], incidents: [], overallSecurityScore: 20 };

  const handleTogglePackage = (pkg: SecurityPackage) => {
    const isCurrentlyHired = pkg.isHired;

    if (!isCurrentlyHired && player.money < pkg.weeklyCost * 2) {
      alert(`Insufficient funds! Retaining ${pkg.name} requires $${pkg.weeklyCost.toLocaleString()}/week.`);
      return;
    }

    const updatedPackages = secState.activePackages.map((p) => {
      if (p.id === pkg.id) {
        return { ...p, isHired: !p.isHired };
      }
      return p;
    });

    const activeCount = updatedPackages.filter((p) => p.isHired).length;
    const totalScore = updatedPackages
      .filter((p) => p.isHired)
      .reduce((sum, p) => sum + p.protectionRating, 20);

    const updated: EmpireFullState = {
      ...empireState,
      security: {
        ...secState,
        activePackages: updatedPackages,
        overallSecurityScore: Math.min(100, totalScore),
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
  };

  const hiredPackages = secState.activePackages.filter((p) => p.isHired);
  const totalWeeklyCost = hiredPackages.reduce((sum, p) => sum + p.weeklyCost, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Executive Security & Protection</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Security Score</span>
            <span className="text-base font-black text-emerald-400 font-mono">
              {secState.overallSecurityScore}/100
            </span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Weekly Retainer</span>
            <span className="text-base font-black text-amber-300 font-mono">
              ${totalWeeklyCost.toLocaleString()}/wk
            </span>
          </div>
        </div>
      </div>

      {/* Grid View: 3 Cards Per Row */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Security & Defense Packages ({secState.activePackages.length})
          </span>
          <span className="text-xs text-emerald-400 font-bold">
            {hiredPackages.length} Active Protections
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secState.activePackages.map((pkg) => {
            const IconComp = CATEGORY_ICONS[pkg.category] || Shield;

            return (
              <div
                key={pkg.id}
                className={`p-5 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl ${
                  pkg.isHired
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-white/10 bg-black/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                      <IconComp className={`w-6 h-6 ${pkg.isHired ? 'text-emerald-400' : 'text-gray-400'}`} />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        pkg.isHired
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      {pkg.isHired ? 'HIRED & ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                      {pkg.category}
                    </span>
                    <h3 className="text-base font-black text-white mt-0.5">{pkg.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">{pkg.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">Weekly Cost:</span>
                    <span className="text-amber-300 font-bold">${pkg.weeklyCost.toLocaleString()}/wk</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400">Protection Rating:</span>
                    <span className="text-emerald-400 font-bold">+{pkg.protectionRating} Pts</span>
                  </div>

                  <button
                    onClick={() => handleTogglePackage(pkg)}
                    className={`w-full py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-lg ${
                      pkg.isHired
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40'
                        : 'bg-emerald-400 text-black hover:bg-emerald-300'
                    }`}
                  >
                    {pkg.isHired ? 'CANCEL RETAINER' : `RETAIN PACKAGE ($${pkg.weeklyCost.toLocaleString()}/WK)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
