/**
 * HOLLYWOOD RISING - Security View (Phase 4 Network)
 * Personal Protection, Cyber Defense, Estate Security & Incident Monitoring.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState, SecurityPackage, SecurityPersonnelItem } from '../../types/network';
import { NetworkService } from '../../services/networkService';
import {
  ShieldCheck,
  ArrowLeft,
  DollarSign,
  ShieldAlert,
  UserCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface SecurityViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [feedback, setFeedback] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'PACKAGES' | 'PERSONNEL' | 'PROPERTY' | 'CYBER' | 'THREAT' | 'REPORTS'
  >('PERSONNEL');

  const securityPackages = networkState.securityPackages || [];
  const securityPersonnel = networkState.securityPersonnel || [];
  const securityLogs = networkState.securityLogs || [];

  const hiredPackages = securityPackages.filter((s) => s.isHired);
  const hiredPersonnel = securityPersonnel.filter((p) => p.isHired);

  const totalProtectionRating = Math.min(
    100,
    hiredPackages.reduce((sum, s) => sum + s.protectionRatingBonus, 0) +
      hiredPersonnel.reduce((sum, p) => sum + (p.trainingLevel === 'Special Forces' ? 12 : p.trainingLevel === 'Elite' ? 8 : 5), 0)
  );

  const handleTogglePackage = (pkg: SecurityPackage) => {
    const updatedPackages = securityPackages.map((s) => {
      if (s.id === pkg.id) {
        return { ...s, isHired: !s.isHired };
      }
      return s;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      securityPackages: updatedPackages,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(pkg.isHired ? `Terminated ${pkg.name} contract.` : `Hired ${pkg.name} ($${pkg.weeklyCost}/wk).`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleTogglePersonnel = (pers: SecurityPersonnelItem) => {
    const updatedPersonnel = securityPersonnel.map((p) => {
      if (p.id === pers.id) {
        return {
          ...p,
          isHired: !p.isHired,
          contractWeeksRemaining: !p.isHired ? 52 : 0,
        };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      securityPersonnel: updatedPersonnel,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(pers.isHired ? `Fired ${pers.name} (${pers.role}).` : `Hired ${pers.name} (${pers.role}) for $${pers.weeklySalary}/wk.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpgradeTraining = (pers: SecurityPersonnelItem) => {
    const cost = 5000;
    if (player.money < cost) {
      setFeedback(`Insufficient funds! Tactical training costs $${cost.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const updatedPersonnel = securityPersonnel.map((p) => {
      if (p.id === pers.id) {
        const nextLevel =
          p.trainingLevel === 'Standard'
            ? 'Tactical'
            : p.trainingLevel === 'Tactical'
            ? 'Elite'
            : 'Special Forces';
        return { ...p, trainingLevel: nextLevel as any, weeklySalary: Math.round(p.weeklySalary * 1.2) };
      }
      return p;
    });

    const nextState: NetworkFullState = {
      ...networkState,
      securityPersonnel: updatedPersonnel,
    };

    NetworkService.saveState(nextState);
    onUpdateState(nextState);

    setFeedback(`UPGRADED TRAINING for ${pers.name}! Higher protection efficiency.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Executive Protection Command
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                SAFETY & DEFENSE
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">SECURITY & PROTECTION</h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Protection Rating</span>
            <span className="text-lg font-black text-emerald-400">{totalProtectionRating}% COVERAGE</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg text-center">
          {feedback}
        </div>
      )}

      {/* SUB-TAB NAVIGATION */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-black">
        {[
          { id: 'PERSONNEL', label: `Personnel (${hiredPersonnel.length}/${securityPersonnel.length})` },
          { id: 'PACKAGES', label: `Packages (${hiredPackages.length}/${securityPackages.length})` },
          { id: 'PROPERTY', label: 'Property Security' },
          { id: 'CYBER', label: 'Cyber Defense' },
          { id: 'THREAT', label: 'Threat Center' },
          { id: 'REPORTS', label: `Intelligence Reports (${securityLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-black shadow-lg font-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PERSONNEL */}
      {activeTab === 'PERSONNEL' && (
        <div className="space-y-3">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Specialist Protection Roster
            </h2>
            <p className="text-[11px] text-gray-400">Hire individual bodyguards, drivers, vault guards, cyber specialists, & K9 units.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {securityPersonnel.map((pers) => (
              <div
                key={pers.id}
                className="p-5 rounded-3xl border border-white/10 bg-black/50 hover:bg-black/70 transition-all space-y-3 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white">{pers.name}</h3>
                      <span className="text-xs text-amber-300 font-bold">{pers.role} • {pers.trainingLevel}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      ${pers.weeklySalary.toLocaleString()}/wk
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {pers.equipment.map((eq, i) => (
                      <span key={i} className="text-[9px] font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-black">
                  <button
                    onClick={() => handleTogglePersonnel(pers)}
                    className={`py-2.5 rounded-2xl transition-all cursor-pointer shadow-lg ${
                      pers.isHired
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-emerald-400 text-black hover:scale-102'
                    }`}
                  >
                    {pers.isHired ? 'FIRE STAFF' : 'HIRE STAFF'}
                  </button>

                  <button
                    onClick={() => handleUpgradeTraining(pers)}
                    disabled={!pers.isHired || pers.trainingLevel === 'Special Forces'}
                    className={`py-2.5 rounded-2xl border transition-all cursor-pointer ${
                      pers.isHired && pers.trainingLevel !== 'Special Forces'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                        : 'bg-black/40 text-gray-600 border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {pers.trainingLevel === 'Special Forces' ? 'MAX TRAINING' : 'UPGRADE TRAINING ($5K)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PACKAGES */}
      {activeTab === 'PACKAGES' && (
        <div className="space-y-3">
          <h2 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Security Packages & Firms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {securityPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-5 rounded-3xl border border-white/10 bg-black/50 hover:bg-black/70 transition-all space-y-3 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white">{pkg.name}</h3>
                      <span className="text-xs text-amber-300 font-bold">{pkg.category}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      ${pkg.weeklyCost.toLocaleString()}/wk
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{pkg.description}</p>

                  <div className="text-[10px] font-black text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    +{pkg.protectionRatingBonus}% Defense Rating Bonus
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePackage(pkg)}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-lg mt-2 ${
                    pkg.isHired
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-emerald-400 text-black hover:scale-102'
                  }`}
                >
                  {pkg.isHired ? 'CANCEL CONTRACT' : 'HIRE PACKAGE'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROPERTY SECURITY */}
      {activeTab === 'PROPERTY' && (
        <div className="p-5 rounded-3xl border border-emerald-500/30 bg-black/50 space-y-3 shadow-xl">
          <h2 className="text-sm font-black text-emerald-400 uppercase">Estate & Home Defense Systems</h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Perimeter lasers, biometric gate entry, panic rooms, and residence guards safeguard owned estates from stalkers and unauthorized trespassing.
          </p>
        </div>
      )}

      {/* TAB 4: CYBER DEFENSE */}
      {activeTab === 'CYBER' && (
        <div className="p-5 rounded-3xl border border-sky-500/30 bg-black/50 space-y-3 shadow-xl">
          <h2 className="text-sm font-black text-sky-400 uppercase">Cyber Security & Anti-Leak Shield</h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Quantum encrypted mobile communications, dark web leak scanning, and wiretap sweepers protect confidential movie scripts, contracts, and private messages.
          </p>
        </div>
      )}

      {/* TAB 5: THREAT CENTER */}
      {activeTab === 'THREAT' && (
        <div className="p-5 rounded-3xl border border-amber-500/30 bg-black/50 space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-amber-400 uppercase">Global Threat Level Center</h2>
            <span className={`text-xs font-black px-3 py-1 rounded-xl border ${totalProtectionRating >= 50 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
              THREAT LEVEL: {totalProtectionRating >= 80 ? 'LOW (SECURE)' : totalProtectionRating >= 40 ? 'ELEVATED' : 'CRITICAL RISK'}
            </span>
          </div>
          <p className="text-xs text-gray-300">Active monitoring of paparazzi density, cyber stalkers, and estate risks.</p>
        </div>
      )}

      {/* TAB 6: INTELLIGENCE REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-3 shadow-xl">
          <h2 className="text-xs font-black text-amber-400 uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Weekly Intelligence & Incident Reports
          </h2>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {securityLogs.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No security incidents logged.</p>
            ) : (
              securityLogs.map((log, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-black/60 border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-white">{log.incidentName}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${log.status === 'THWARTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-300'}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
