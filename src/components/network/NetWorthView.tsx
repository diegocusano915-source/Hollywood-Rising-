/**
 * HOLLYWOOD RISING - Net Worth View (Phase 4 Network)
 * Financial Dashboard, Assets, Liabilities, Income vs Expenses & Career High Records.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { NetworkFullState } from '../../types/network';
import { NetworkService } from '../../services/networkService';
import {
  DollarSign,
  ArrowLeft,
  PieChart,
  TrendingUp,
  TrendingDown,
  Building,
  Car,
  Lock,
  Wallet,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface NetWorthViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
}

export const NetWorthView: React.FC<NetWorthViewProps> = ({ onBack, networkState }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const summary = NetworkService.calculateFinancialSummary(networkState, player.money);

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
            <PieChart className="w-4 h-4 text-emerald-400" />
            Financial Intelligence
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
              <DollarSign className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                TOTAL NET WORTH DASHBOARD
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                ${summary.netWorth.toLocaleString()}
              </h1>
            </div>
          </div>

          <div className="text-right bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Career High</span>
            <span className="text-lg font-black text-amber-400">
              ${summary.careerHighNetWorth.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* WEEKLY CASH FLOW SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase">Weekly Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-black text-white">+${summary.weeklyIncome.toLocaleString()}/wk</span>
        </div>

        <div className="p-4 rounded-3xl border border-rose-500/30 bg-rose-500/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-400 uppercase">Weekly Expenses</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-xl font-black text-white">-${summary.weeklyExpenses.toLocaleString()}/wk</span>
        </div>

        <div className="p-4 rounded-3xl border border-amber-500/30 bg-amber-500/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-400 uppercase">Net Weekly Change</span>
            <PieChart className="w-4 h-4 text-amber-400" />
          </div>
          <span className={`text-xl font-black ${summary.weeklyNetChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.weeklyNetChange >= 0 ? '+' : ''}${summary.weeklyNetChange.toLocaleString()}/wk
          </span>
        </div>
      </div>

      {/* ASSETS VS LIABILITIES DETAILED BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ASSETS */}
        <div className="p-5 rounded-3xl border border-emerald-500/30 bg-black/50 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-emerald-400 uppercase flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Total Assets
            </h2>
            <span className="text-base font-black text-white">${summary.totalAssets.toLocaleString()}</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Liquid Cash
              </span>
              <span className="font-black text-white">${summary.cash.toLocaleString()}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-sky-400" /> Real Estate Properties
              </span>
              <span className="font-black text-white">${summary.propertyValue.toLocaleString()}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <Car className="w-3.5 h-3.5 text-amber-400" /> Luxury Automobiles
              </span>
              <span className="font-black text-white">${summary.vehicleValue.toLocaleString()}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-purple-400" /> Vault Collectibles & Fine Art
              </span>
              <span className="font-black text-white">${summary.vaultValue.toLocaleString()}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-pink-400" /> Savings & Interest Accounts
              </span>
              <span className="font-black text-white">${summary.savingsBalance.toLocaleString()}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Business & Investment Equity
              </span>
              <span className="font-black text-white">${((summary.investmentBalance || 0) + (summary.businessBalance || 0)).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* LIABILITIES */}
        <div className="p-5 rounded-3xl border border-rose-500/30 bg-black/50 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-black text-rose-400 uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Total Liabilities
            </h2>
            <span className="text-base font-black text-white">${summary.totalLiabilities.toLocaleString()}</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-rose-400" /> Property Mortgages
              </span>
              <span className="font-black text-rose-300">${summary.propertyDebt.toLocaleString()}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-gray-300 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-rose-400" /> Active Bank Loans
              </span>
              <span className="font-black text-rose-300">${summary.bankLoans.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold">
              💡 Maintaining low debt-to-asset ratios elevates your Financial Reputation score (AAA Rating) and unlocks lower loan interest rates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
