/**
 * HOLLYWOOD RISING - Holding Company Sub-View
 * Phase 5 Empire Scene: Form and manage player holding conglomerate & C-Suite executive board.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, Executive, ExecutiveRole } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  Building2,
  Users,
  Briefcase,
  Award,
  DollarSign,
  Plus,
  Shield,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertCircle,
  Crown,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const HQ_LOCATIONS = [
  'Beverly Hills, Los Angeles',
  'Manhattan, New York',
  'Mayfair, London',
  'Ginza, Tokyo',
  'Eiffel Quarter, Paris',
  'Downtown, Dubai',
];

const EXECUTIVE_ROLES: ExecutiveRole[] = [
  'CEO',
  'COO',
  'CFO',
  'Legal Counsel',
  'Operations Director',
  'Marketing Director',
  'HR Director',
];

export const HoldingCompanyView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player , persistNow } = useGame();
  const holding = empireState.holdingCompany;

  // Form State
  const [companyName, setCompanyName] = useState(holding.name || `${player.lastName} Global Holdings`);
  const [hq, setHq] = useState(HQ_LOCATIONS[0]);
  const [industry, setIndustry] = useState('Media, Tech & Real Estate');
  const [selectedRoleToHire, setSelectedRoleToHire] = useState<ExecutiveRole>('COO');

  const formationCost = 250000;

  const handleFormCompany = () => {
    if (player.money < formationCost) {
      alert(`Insufficient cash! Forming a Holding Company requires $${formationCost.toLocaleString()}.`);
      return;
    }

    // Deduct cash from player
    player.money -= formationCost;
    persistNow();

    const updated: EmpireFullState = {
      ...empireState,
      holdingCompany: {
        ...holding,
        isFormed: true,
        name: companyName,
        headquarters: hq,
        industryFocus: industry,
        ceoName: `${player.firstName} ${player.lastName}`,
        totalValuation: 500000,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
  };

  const handleHireExecutive = (role: ExecutiveRole) => {
    const salary = 250000 + Math.floor(Math.random() * 250000);
    const hiringCost = Math.floor(salary * 0.2);

    if (player.money < hiringCost) {
      alert(`Insufficient cash to retain executive search firm ($${hiringCost.toLocaleString()} fee).`);
      return;
    }

    player.money -= hiringCost;
    persistNow();

    const names = [
      'Julian Sterling',
      'Evelyn Vance',
      'Dominic Cross',
      'Victoria Thorne',
      'Alistair Vance',
      'Sophia Montgomery',
      'Marcus Drake',
    ];
    const candidateName = names[Math.floor(Math.random() * names.length)];

    const newExec: Executive = {
      id: `exec_${Date.now()}`,
      name: candidateName,
      role,
      salary,
      bonus: Math.floor(salary * 0.15),
      efficiency: Math.floor(75 + Math.random() * 20),
      morale: Math.floor(80 + Math.random() * 15),
      leadership: Math.floor(70 + Math.random() * 25),
      experience: Math.floor(75 + Math.random() * 20),
      negotiation: Math.floor(70 + Math.random() * 25),
      creativity: Math.floor(65 + Math.random() * 30),
      loyalty: Math.floor(80 + Math.random() * 15),
      performance: Math.floor(75 + Math.random() * 20),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?auto=format&fit=crop&q=80&w=150`,
      background: 'Ex-Goldman Sachs / CAA Senior Managing Director',
      yearsEmployed: 1,
    };

    const updated: EmpireFullState = {
      ...empireState,
      holdingCompany: {
        ...holding,
        executives: [...holding.executives.filter((e) => e.role !== role), newExec],
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Holding Company</h2>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Holding Value</span>
          <span className="text-base font-black text-amber-400">
            ${holding.totalValuation.toLocaleString()}
          </span>
        </div>
      </div>

      {!holding.isFormed ? (
        /* FORMATION UNLOCKED STATE */
        empireState.businesses.length === 0 ? (
          <div className="p-10 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mx-auto shadow-xl">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">No Holding Company Established</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Incorporate your parent entity to consolidate ownership across all business ventures, production studios, and real estate assets.
              </p>
            </div>
            <button
              onClick={() => {
                if (empireState.businesses.length === 0) {
                  alert('💡 TIP: Launch your first Business Venture first, or incorporate your holding company directly now!');
                }
                setCompanyName(`${player.lastName} Global Holdings`);
              }}
              className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm transition-all cursor-pointer shadow-xl hover:scale-105 inline-flex items-center gap-2 mt-2"
            >
              <Crown className="w-5 h-5" />
              <span>Create Holding Company</span>
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Incorporate Your Holding Conglomerate</h3>
                <p className="text-xs text-gray-400">
                  Establish the parent entity to own all business ventures, production studios, commercial real estate, and global assets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-semibold focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Global Headquarters</label>
                <select
                  value={hq}
                  onChange={(e) => setHq(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-semibold focus:border-amber-400 outline-none"
                >
                  {HQ_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-gray-900 text-white">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Primary Industry Focus</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white font-semibold focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Founder & CEO</label>
                <input
                  type="text"
                  disabled
                  value={`${player.firstName} ${player.lastName}`}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-amber-300 font-bold outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Incorporation Fee: $250,000</span>
                  <span className="text-[10px] text-gray-400">Includes SEC filing, legal structure, and headquarters registration.</span>
                </div>
              </div>

              <button
                onClick={handleFormCompany}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                FORM HOLDING COMPANY
              </button>
            </div>
          </div>
        )
      ) : (
        /* FORMED HOLDING COMPANY DASHBOARD */
        <div className="space-y-6">
          {/* Company Overview Banner */}
          <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Parent Conglomerate
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {holding.headquarters}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{holding.name}</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Industry: <span className="text-white font-semibold">{holding.industryFocus}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Equity Share</span>
                  <span className="text-sm font-black text-emerald-400">{holding.equitySharePercent}% Owned</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Subsidiaries</span>
                  <span className="text-sm font-black text-amber-300">
                    {empireState.businesses.length + empireState.realEstate.length} Entities
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* C-Suite Executive Officers */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-black text-white uppercase">C-Suite Executive Leadership</h4>
              </div>
              <span className="text-xs text-gray-400">
                {holding.executives.length} / {EXECUTIVE_ROLES.length} Seats Filled
              </span>
            </div>

            {/* Executives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {EXECUTIVE_ROLES.map((role) => {
                const exec = holding.executives.find((e) => e.role === role);
                return (
                  <div
                    key={role}
                    className="p-3.5 rounded-2xl border border-white/10 bg-black/50 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {role}
                      </span>
                      {exec ? (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-semibold">Vacant</span>
                      )}
                    </div>

                    {exec ? (
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-white">{exec.name}</h5>
                        <p className="text-[10px] text-gray-400">{exec.background}</p>
                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                          <span className="text-gray-400">Salary: ${exec.salary.toLocaleString()}/yr</span>
                          <span className="text-amber-300 font-bold">Eff: {exec.efficiency}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center space-y-1">
                        <p className="text-[10px] text-gray-400">No {role} appointed.</p>
                        <button
                          onClick={() => handleHireExecutive(role)}
                          className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] border border-amber-500/30 transition-all cursor-pointer"
                        >
                          + Hire Candidate
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Owned Subsidiaries Directory */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-black text-white uppercase">Owned Subsidiaries Directory</h4>
            </div>

            {empireState.businesses.length === 0 && empireState.realEstate.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                No active businesses or commercial properties owned yet. Launch ventures in Business Ventures or Real Estate!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {empireState.businesses.map((biz) => (
                  <div
                    key={biz.id}
                    className="p-3 rounded-2xl border border-white/10 bg-black/60 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-purple-400 uppercase block">Business Venture</span>
                      <h5 className="text-xs font-bold text-white">{biz.name}</h5>
                      <p className="text-[10px] text-gray-400">{biz.industry}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-400">
                        ${biz.totalValuation.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-emerald-400 block font-semibold">
                        +${biz.weeklyRevenue.toLocaleString()}/wk
                      </span>
                    </div>
                  </div>
                ))}

                {empireState.realEstate.map((re) => (
                  <div
                    key={re.id}
                    className="p-3 rounded-2xl border border-white/10 bg-black/60 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-sky-400 uppercase block">Commercial Estate</span>
                      <h5 className="text-xs font-bold text-white">{re.name}</h5>
                      <p className="text-[10px] text-gray-400">{re.type} • {re.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-400">
                        ${re.currentValuation.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-emerald-400 block font-semibold">
                        +${re.weeklyRentalIncome.toLocaleString()}/wk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
