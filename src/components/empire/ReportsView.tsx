/**
 * HOLLYWOOD RISING - Financial & Performance Reports Sub-View
 * Phase 5 Empire Scene: Weekly, Monthly, Quarterly, Annual Financial Statements.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, ReportPeriod, BusinessReport } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, CheckCircle2, Award } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

export const ReportsView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player } = useGame();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('Weekly');

  const totalBizRevenue = empireState.businesses.reduce((sum, b) => sum + b.weeklyRevenue, 0);
  const totalBizExpenses = empireState.businesses.reduce((sum, b) => sum + b.weeklyExpenses, 0);
  const totalNetProfit = totalBizRevenue - totalBizExpenses;

  const totalRERent = empireState.realEstate.reduce((sum, r) => sum + r.weeklyRentalIncome, 0);
  const totalREExpense = empireState.realEstate.reduce((sum, r) => sum + r.weeklyMaintenanceCost, 0);

  const activeBizCount = empireState.businesses.filter((b) => b.status === 'Active' || b.status === 'Distressed').length;
  const topBiz = empireState.businesses.length > 0
    ? [...empireState.businesses].sort((a, b) => b.netProfit - a.netProfit)[0]?.name || 'None'
    : 'None';

  // Generate actual report entries for preview
  const generatedReports: BusinessReport[] = [
    {
      id: 'rep_w',
      period: 'Weekly',
      week: player.dateWeek,
      year: player.dateYear,
      totalRevenue: totalBizRevenue + totalRERent,
      totalExpenses: totalBizExpenses + totalREExpense,
      netProfit: totalNetProfit + (totalRERent - totalREExpense),
      activeBusinessesCount: activeBizCount,
      topPerformingBusiness: topBiz,
      executiveSummary: `Weekly operations summary for Week ${player.dateWeek}, ${player.dateYear}. Cash yield from commercial ventures and properties.`,
      growthRatePercent: 4.2,
    },
    {
      id: 'rep_m',
      period: 'Monthly',
      week: player.dateWeek,
      year: player.dateYear,
      totalRevenue: (totalBizRevenue + totalRERent) * 4,
      totalExpenses: (totalBizExpenses + totalREExpense) * 4,
      netProfit: (totalNetProfit + (totalRERent - totalREExpense)) * 4,
      activeBusinessesCount: activeBizCount,
      topPerformingBusiness: topBiz,
      executiveSummary: `Consolidated monthly financial statement across all subsidiary ventures and real estate holdings.`,
      growthRatePercent: 8.5,
    },
    {
      id: 'rep_q',
      period: 'Quarterly',
      week: player.dateWeek,
      year: player.dateYear,
      totalRevenue: (totalBizRevenue + totalRERent) * 12,
      totalExpenses: (totalBizExpenses + totalREExpense) * 12,
      netProfit: (totalNetProfit + (totalRERent - totalREExpense)) * 12,
      activeBusinessesCount: activeBizCount,
      topPerformingBusiness: topBiz,
      executiveSummary: `Q1-Q4 Board performance review including executive salaries, product margins, and tax liability estimates.`,
      growthRatePercent: 14.1,
    },
    {
      id: 'rep_a',
      period: 'Annual',
      week: player.dateWeek,
      year: player.dateYear,
      totalRevenue: (totalBizRevenue + totalRERent) * 52,
      totalExpenses: (totalBizExpenses + totalREExpense) * 52,
      netProfit: (totalNetProfit + (totalRERent - totalREExpense)) * 52,
      activeBusinessesCount: activeBizCount,
      topPerformingBusiness: topBiz,
      executiveSummary: `Annual shareholder report detailing gross revenues, EBITDA, holding valuation, and asset allocation.`,
      growthRatePercent: 22.8,
    },
  ];

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
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Enterprise Financial Reports</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['Weekly', 'Monthly', 'Quarterly', 'Annual'] as ReportPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-amber-400 text-black shadow-lg font-black'
                  : 'bg-black/60 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View: 3 Cards Per Row */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            {selectedPeriod} Performance Statements
          </span>
          <span className="text-xs text-amber-300 font-bold">Generated from Actual Gameplay Data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generatedReports.map((report) => (
            <div
              key={report.id}
              className={`p-5 rounded-3xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl ${
                report.period === selectedPeriod
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-white/10 bg-black/60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <FileText className={`w-6 h-6 ${report.period === selectedPeriod ? 'text-amber-400' : 'text-gray-400'}`} />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-black text-amber-300 uppercase tracking-wider">
                    {report.period} Statement
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">
                    {report.period} Ledger (W{report.week}, {report.year})
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{report.executiveSummary}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gross Revenue:</span>
                  <span className="text-emerald-400 font-bold">${report.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Operating Cost:</span>
                  <span className="text-red-400 font-bold">${report.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/10">
                  <span className="text-gray-300 font-bold">Net Profit:</span>
                  <span className={`font-black ${report.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${report.netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-gray-400">Top Subsidiary:</span>
                  <span className="text-amber-300 font-bold">{report.topPerformingBusiness}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
