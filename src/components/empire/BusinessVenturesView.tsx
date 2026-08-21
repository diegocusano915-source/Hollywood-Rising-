/**
 * HOLLYWOOD RISING - Business Ventures Sub-View
 * Phase 5 Empire Scene: 30+ Industry business creator, product launcher, branches, bonuses & M&A engine.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, BusinessVenture, BusinessBranch, BusinessPerformanceTrend } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import { ExecutiveManagementView } from './ExecutiveManagementView';
import {
  Briefcase,
  Plus,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Award,
  AlertTriangle,
  Globe,
  Rocket,
  Building,
  ShieldAlert,
  BarChart3,
  Layers,
  ChevronRight,
  UserCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const INDUSTRIES_CATALOG = [
  { name: 'Fashion & Apparel', cost: 100000, logo: 'Shirt' },
  { name: 'Gourmet Restaurant Chain', cost: 150000, logo: 'Utensils' },
  { name: 'Specialty Coffee Roasters', cost: 75000, logo: 'Coffee' },
  { name: 'Technology & Cloud AI', cost: 500000, logo: 'Cpu' },
  { name: 'Video Game Studio', cost: 300000, logo: 'Gamepad2' },
  { name: 'Luxury Hotel & Resorts', cost: 1200000, logo: 'Hotel' },
  { name: 'Independent Music Record Label', cost: 200000, logo: 'Music' },
  { name: 'Global Film Streaming Service', cost: 1000000, logo: 'Tv' },
  { name: 'Cosmetics & Beauty Brand', cost: 120000, logo: 'Sparkles' },
  { name: 'High-End Fine Jewelry', cost: 350000, logo: 'Gem' },
  { name: 'Energy Drink & Beverage', cost: 90000, logo: 'Zap' },
  { name: 'Publishing & Media House', cost: 180000, logo: 'BookOpen' },
  { name: 'Hollywood Camera & Film Gear', cost: 400000, logo: 'Camera' },
  { name: '3D Animation Studio', cost: 350000, logo: 'Film' },
  { name: 'SaaS Enterprise Software', cost: 250000, logo: 'Code' },
  { name: 'Next-Gen Smartphone Brand', cost: 2000000, logo: 'Smartphone' },
  { name: 'Luxury Electric Vehicle Co.', cost: 5000000, logo: 'Car' },
  { name: 'Haute Couture Fashion House', cost: 800000, logo: 'Crown' },
  { name: 'Private Jet Aviation Fleet', cost: 4000000, logo: 'Plane' },
  { name: 'VIP Nightlife & Clubs', cost: 250000, logo: 'GlassWater' },
  { name: 'Fitness & Gym Franchise', cost: 180000, logo: 'Dumbbell' },
  { name: 'Designer Eyewear', cost: 140000, logo: 'Glasses' },
  { name: 'Vintage Wine & Spirits', cost: 300000, logo: 'Wine' },
  { name: 'Gourmet Artisanal Foods', cost: 85000, logo: 'ShoppingBag' },
  { name: 'Cybersecurity Firm', cost: 450000, logo: 'Shield' },
  { name: 'Robotics & Automation', cost: 1500000, logo: 'Bot' },
  { name: 'Global Esports Franchise', cost: 350000, logo: 'Trophy' },
  { name: 'Elite Modeling Agency', cost: 220000, logo: 'UserCheck' },
  { name: 'Interactive Theme Park', cost: 8000000, logo: 'FerrisWheel' },
  { name: 'Private Executive Security', cost: 300000, logo: 'Lock' },
];

function RevSpark({ history }: { history: number[] }) {
  if (!history || history.length < 2) {
    return <div className="h-8 rounded-lg bg-white/5 flex items-center justify-center text-[8px] text-gray-600 font-mono">COLLECTING SALES DATA…</div>;
  }
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = Math.max(1, max - min);
  const pts = history.map((v, i) => `${(i / (history.length - 1)) * 100},${28 - ((v - min) / range) * 24 - 2}`).join(' ');
  const up = history[history.length - 1] >= history[0];
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="w-full h-8">
      <polyline points={pts} fill="none" stroke={up ? '#34d399' : '#f87171'} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export const BusinessVenturesView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player , persistNow } = useGame();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedExecBiz, setSelectedExecBiz] = useState<BusinessVenture | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Business Form State
  const [newBizName, setNewBizName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES_CATALOG[0]);

  const handleLaunchBusiness = () => {
    setErrorMsg(null);
    setNotification(null);
    if (!newBizName.trim()) {
      setErrorMsg('Please enter a business name.');
      return;
    }

    if (player.money < selectedIndustry.cost) {
      setErrorMsg(`Insufficient funds! Launching ${selectedIndustry.name} requires $${selectedIndustry.cost.toLocaleString()} seed capital.`);
      return;
    }

    player.money -= selectedIndustry.cost;
    persistNow();

    const newBiz: BusinessVenture = {
      id: `biz_${Date.now()}`,
      name: newBizName.trim(),
      industry: selectedIndustry.name,
      logo: selectedIndustry.logo,
      cashPool: selectedIndustry.cost,
      weeklyRevenue: 25000,
      weeklyExpenses: 12000,
      netProfit: 13000,
      totalValuation: selectedIndustry.cost * 2,
      marketShare: 3.5,
      customerRating: 4.5,
      isPublic: false,
      totalShares: 1000000,
      sharePrice: (selectedIndustry.cost * 2) / 1000000,
      performanceTrend: 'Growing',
      branchesCount: 1,
      employeeBonusPercent: 5,
      branches: [
        { id: 'br_1', locationName: 'Los Angeles Flagship', staffCount: 12, weeklyRevenue: 25000, weeklyRent: 4000, status: 'Active' },
      ],
      products: [
        {
          id: `prod_${Date.now()}`,
          name: `${newBizName} Flagship Line`,
          price: 150,
          productionCost: 40,
          weeklySales: 200,
          rating: 4.8,
          reviewsCount: 50,
          weeklyRevenue: 30000,
          launchWeek: player.dateWeek,
          launchYear: player.dateYear,
        },
      ],
      staff: [
        { role: 'Manager', count: 2, weeklyCostPerPerson: 1200 },
        { role: 'Marketing', count: 3, weeklyCostPerPerson: 1000 },
        { role: 'Support', count: 8, weeklyCostPerPerson: 700 },
      ],
      executives: [],
      competitors: [],
      status: 'Active',
      fundingRaised: selectedIndustry.cost,
      foundedWeek: player.dateWeek,
      foundedYear: player.dateYear,
    };

    const updated: EmpireFullState = {
      ...empireState,
      businesses: [...empireState.businesses, newBiz],
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setIsCreatingNew(false);
    setNewBizName('');
    setNotification(`🚀 LAUNCHED: Founded ${newBiz.name}!`);
  };

  const handleOpenBranch = (biz: BusinessVenture) => {
    setErrorMsg(null);
    setNotification(null);
    const cost = 50000;
    if (player.money < cost) {
      setErrorMsg(`Insufficient funds ($${cost.toLocaleString()} required to open new branch).`);
      return;
    }

    player.money -= cost;
    persistNow();

    const newBranch: BusinessBranch = {
      id: `br_${Date.now()}`,
      locationName: `Branch #${(biz.branches?.length || 0) + 1} (New York / London)`,
      staffCount: 8,
      weeklyRevenue: 15000,
      weeklyRent: 3000,
      status: 'Active',
    };

    const updatedBusinesses = empireState.businesses.map((b) => {
      if (b.id === biz.id) {
        const branches = b.branches || [];
        return {
          ...b,
          branches: [...branches, newBranch],
          branchesCount: branches.length + 1,
          weeklyRevenue: b.weeklyRevenue + 15000,
          totalValuation: b.totalValuation + 75000,
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
    setNotification(`🏢 EXPANSION: Opened new retail branch for ${biz.name}! +$15,000/wk revenue.`);
  };

  const handleHireStaff = (biz: BusinessVenture) => {
    setErrorMsg(null);
    setNotification(null);
    const cost = 5000;
    if (player.money < cost) {
      setErrorMsg(`Insufficient funds! Hiring 10 staff workers requires $${cost.toLocaleString()}.`);
      return;
    }

    player.money -= cost;
    persistNow();

    const updatedBusinesses = empireState.businesses.map((b) => {
      if (b.id === biz.id) {
        const staffList = b.staff || [];
        const supportIndex = staffList.findIndex((s) => s.role === 'Support');
        const updatedStaff = [...staffList];
        if (supportIndex >= 0) {
          updatedStaff[supportIndex] = {
            ...updatedStaff[supportIndex],
            count: updatedStaff[supportIndex].count + 10,
          };
        } else {
          updatedStaff.push({ role: 'Support', count: 10, weeklyCostPerPerson: 700 });
        }

        return {
          ...b,
          staff: updatedStaff,
          weeklyRevenue: b.weeklyRevenue + 2500,
          totalValuation: b.totalValuation + 15000,
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
    setNotification(`👥 Hired 10 Staff Members for ${biz.name}! +$2,500/wk Revenue & +$15,000 Valuation.`);
  };

  const handleAdjustBonus = (biz: BusinessVenture, bonusPercent: number) => {
    const updatedBusinesses = empireState.businesses.map((b) => {
      if (b.id === biz.id) {
        return {
          ...b,
          employeeBonusPercent: bonusPercent,
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
  };

  if (selectedExecBiz) {
    return (
      <ExecutiveManagementView
        business={selectedExecBiz}
        empireState={empireState}
        onUpdateState={onUpdateState}
        onBack={() => setSelectedExecBiz(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Commercial Business Ventures</h2>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="px-4 py-2 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Venture</span>
        </button>
      </div>

      {/* PORTFOLIO KPIs — all real, all moving weekly */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {(() => {
          const active = empireState.businesses.filter((b) => b.status === 'Active' || b.status === 'Distressed');
          const rev = active.reduce((a, b) => a + b.weeklyRevenue, 0);
          const exp = active.reduce((a, b) => a + b.weeklyExpenses, 0);
          const net = active.reduce((a, b) => a + b.netProfit, 0);
          const val = active.reduce((a, b) => a + b.totalValuation, 0);
          const staff = active.reduce((a, b) => a + (b.staff || []).reduce((x, g) => x + g.count, 0), 0);
          const cells: Array<[string, string, string]> = [
            ['Portfolio Value', `$${(val / 1_000_000).toFixed(2)}M`, 'text-white'],
            ['Weekly Revenue', `+$${Math.round(rev / 1000)}K`, 'text-emerald-300'],
            ['Weekly Expenses', `−$${Math.round(exp / 1000)}K`, 'text-red-300'],
            ['Weekly Net', `${net >= 0 ? '+' : '−'}$${Math.abs(Math.round(net / 1000))}K`, net >= 0 ? 'text-emerald-300' : 'text-red-300'],
            ['Employees', `${staff}`, 'text-sky-300'],
          ];
          return cells.map(([label, v, tone]) => (
            <div key={label} className="p-2.5 rounded-2xl bg-black/60 border border-white/10">
              <span className="text-[8px] text-gray-500 uppercase font-black block">{label}</span>
              <span className={`text-sm font-black font-mono ${tone}`}>{v}</span>
            </div>
          ));
        })()}
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

      {/* CREATE NEW VENTURE PANEL */}
      {isCreatingNew && (
        <div className="p-6 rounded-3xl border border-purple-500/40 bg-black/80 backdrop-blur-md space-y-5 animate-fadeIn">
          <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-400" />
            Launch Commercial Business (30+ Industry Catalog)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Business Venture Name</label>
              <input
                type="text"
                placeholder="e.g. Sterling Fashion, Apex AI, Vance Coffee"
                value={newBizName}
                onChange={(e) => setNewBizName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-semibold focus:border-purple-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Select Industry Sector</label>
              <select
                value={selectedIndustry.name}
                onChange={(e) => {
                  const found = INDUSTRIES_CATALOG.find((i) => i.name === e.target.value);
                  if (found) setSelectedIndustry(found);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-semibold focus:border-purple-400 outline-none"
              >
                {INDUSTRIES_CATALOG.map((ind) => (
                  <option key={ind.name} value={ind.name} className="bg-gray-900 text-white">
                    {ind.name} (${ind.cost.toLocaleString()} Capital)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Initial Seed Capital Required:</span>
              <span className="text-sm font-black text-purple-300">${selectedIndustry.cost.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchBusiness}
                className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all cursor-pointer shadow-lg"
              >
                START BUSINESS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid View: 3 Cards Per Row */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Active Subsidiaries & Businesses ({empireState.businesses.length})
          </span>
          <span className="text-xs text-purple-300 font-bold">Real Non-Passive Operations</span>
        </div>

        {empireState.businesses.length === 0 ? (
          <div className="p-10 rounded-3xl border border-white/10 bg-black/60 text-center text-xs text-gray-400 space-y-3">
            <p>You do not own any business ventures yet. Launch a venture from the 30+ industry catalog above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {empireState.businesses.map((biz) => {
              const execCount = (biz.executives || []).length;
              const branchCount = (biz.branches || []).length || 1;

              return (
                <div
                  key={biz.id}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-purple-500/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider">
                        {biz.industry}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                        {biz.performanceTrend || 'Growing'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white">{biz.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Valuation: <span className="text-amber-300 font-bold">${biz.totalValuation.toLocaleString()}</span>
                        {(() => {
                          const h = biz.revenueHistory || [];
                          if (h.length < 2) return null;
                          const d = h[h.length - 1] - h[h.length - 2];
                          return (
                            <span className={`ml-1.5 font-mono font-black ${d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {d >= 0 ? '\u25B2' : '\u25BC'} ${Math.abs(d).toLocaleString()}/wk
                            </span>
                          );
                        })()}
                      </p>
                      <RevSpark history={biz.revenueHistory || [biz.weeklyRevenue]} />
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weekly Revenue:</span>
                      <span className="text-emerald-400 font-bold">+${biz.weeklyRevenue.toLocaleString()}/wk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Net Weekly Profit:</span>
                      <span className="text-purple-300 font-bold">${biz.netProfit.toLocaleString()}/wk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Retail Branches:</span>
                      <span className="text-white font-bold">{branchCount} Active Locations</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">C-Suite Execs:</span>
                      <span className="text-amber-300 font-bold">{execCount} Officers Hired</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gray-400">Staff Bonus Rate:</span>
                      <div className="flex items-center gap-1">
                        {[0, 5, 10, 20].map((bonus) => (
                          <button
                            key={bonus}
                            onClick={() => handleAdjustBonus(biz, bonus)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              (biz.employeeBonusPercent || 0) === bonus
                                ? 'bg-amber-400 text-black font-black'
                                : 'bg-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            {bonus}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleHireStaff(biz)}
                        className="py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" /> + HIRE STAFF
                      </button>
                      <button
                        onClick={() => setSelectedExecBiz(biz)}
                        className="py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> C-SUITE TEAM
                      </button>
                      <button
                        onClick={() => handleOpenBranch(biz)}
                        className="py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                      >
                        <Building2 className="w-3.5 h-3.5" /> + BRANCH
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

