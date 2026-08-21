/**
 * HOLLYWOOD RISING - Financial & Performance Reports (REAL BOOKS)
 * Every statement is aggregated from recorded WEEKLY SNAPSHOTS written by the
 * empire tick - actual business, property, global-office and academy P&L.
 * Monthly = last 4 recorded weeks, Quarterly = 13, Annual = 52. No fake
 * multipliers, no invented growth percentages.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, ReportPeriod } from '../../types/empire';
import { BarChart3, FileText, Layers } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const PERIOD_WEEKS: Record<ReportPeriod, number> = { Weekly: 1, Monthly: 4, Quarterly: 13, Annual: 52 };

function Spark({ values, tone = '#fbbf24' }: { values: number[]; tone?: string }) {
  if (values.length < 2) return <div className="h-10" />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${34 - ((v - min) / range) * 30 - 2}`).join(' ');
  return (
    <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="w-full h-10">
      <polyline points={pts} fill="none" stroke={tone} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const fmtM = (n: number) => (Math.abs(n) >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`);

export const ReportsView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('Weekly');
  void onUpdateState;

  const history = empireState.reports?.reportsHistory || [];
  const weeksForPeriod = PERIOD_WEEKS[selectedPeriod];
  const window_ = history.slice(0, weeksForPeriod);
  const prevWindow = history.slice(weeksForPeriod, weeksForPeriod * 2);

  const sum = (arr: typeof history, key: 'totalRevenue' | 'totalExpenses') => arr.reduce((a, r) => a + (r[key] || 0), 0);
  const revenue = sum(window_, 'totalRevenue');
  const expenses = sum(window_, 'totalExpenses');
  const net = revenue - expenses;
  const prevNet = sum(prevWindow, 'totalRevenue') - sum(prevWindow, 'totalExpenses');
  const growth = prevNet !== 0 ? Math.round(((net - prevNet) / Math.abs(prevNet)) * 1000) / 10 : 0;

  // Real segment aggregation across the window
  const seg = window_.reduce(
    (acc, r) => ({
      business: acc.business + (r.segments?.business ?? 0),
      realEstate: acc.realEstate + (r.segments?.realEstate ?? 0),
      hubs: acc.hubs + (r.segments?.hubs ?? 0),
      academy: acc.academy + (r.segments?.academy ?? 0),
    }),
    { business: 0, realEstate: 0, hubs: 0, academy: 0 }
  );
  const segTotal = Math.max(1, Math.abs(seg.business) + Math.abs(seg.realEstate) + Math.abs(seg.hubs) + Math.abs(seg.academy));
  const netTrend = [...window_].reverse().map((r) => r.netProfit);
  const topBiz = window_[0]?.topPerformingBusiness || 'None';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer">
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Financial Reports</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(['Weekly', 'Monthly', 'Quarterly', 'Annual'] as ReportPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === p ? 'bg-amber-400 text-black shadow-lg font-black' : 'bg-black/60 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="p-10 rounded-3xl border border-white/10 bg-black/60 text-center space-y-3">
          <FileText className="w-12 h-12 text-amber-400/60 mx-auto" />
          <h3 className="text-base font-black text-white">THE BOOKS START NEXT WEEK</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Every week, the empire tick records a real consolidated income statement - businesses, properties,
            global offices and the academy. Advance a week and your first statement files here.
          </p>
        </div>
      ) : (
        <>
          {/* Consolidated statement */}
          <div className="p-5 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-black via-gray-900 to-black space-y-3 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest block">
                  {selectedPeriod} Consolidated Statement · {window_.length} recorded week{window_.length === 1 ? '' : 's'}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className={`text-3xl font-black font-mono ${net >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {net >= 0 ? '+' : '−'}{fmtM(Math.abs(net))}
                  </span>
                  {prevWindow.length > 0 && (
                    <span className={`text-xs font-mono font-black ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {growth >= 0 ? '▲' : '▼'} {Math.abs(growth)}% vs prior {selectedPeriod.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-gray-400">
                <span className="block">Latest books: Week {history[0].week}, {history[0].year}</span>
                <span className="block">Top subsidiary: <span className="text-amber-300 font-bold">{topBiz}</span></span>
                <span className="block">{history.length} weekly statements on file</span>
              </div>
            </div>
            <Spark values={netTrend} tone={net >= 0 ? '#34d399' : '#f87171'} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block">Gross Revenue</span>
                <span className="text-sm font-black text-emerald-300 font-mono">+{fmtM(revenue)}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block">Operating Costs</span>
                <span className="text-sm font-black text-red-300 font-mono">−{fmtM(expenses)}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block">Margin</span>
                <span className="text-sm font-black text-white font-mono">{revenue > 0 ? Math.round((net / revenue) * 100) : 0}%</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/50 border border-white/5">
                <span className="text-[8px] text-gray-500 uppercase font-black block">Avg Weekly Net</span>
                <span className="text-sm font-black text-amber-300 font-mono">{fmtM(net / Math.max(1, window_.length))}</span>
              </div>
            </div>
          </div>

          {/* Segment breakdown — real P&L by division */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/60 space-y-3">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Division Breakdown ({selectedPeriod})
            </h3>
            <div className="space-y-2.5">
              {([
                ['Business Ventures', seg.business, 'bg-purple-500'],
                ['Real Estate', seg.realEstate, 'bg-sky-500'],
                ['Global Offices', seg.hubs, 'bg-cyan-500'],
                ['Acting Academy', seg.academy, 'bg-amber-500'],
              ] as const).map(([label, value, tone]) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 font-bold">{label}</span>
                    <span className={`font-mono font-black ${value >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                      {value >= 0 ? '+' : '−'}{fmtM(Math.abs(value))}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full ${tone}`} style={{ width: `${(Math.abs(value) / segTotal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly ledger rows (newest first) */}
          <div className="rounded-3xl border border-white/10 bg-black/60 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-white/5 text-[9px] font-black uppercase text-gray-500 tracking-wider">
              <span className="col-span-3">Week</span>
              <span className="col-span-3">Revenue</span>
              <span className="col-span-3">Costs</span>
              <span className="col-span-3 text-right">Net</span>
            </div>
            {history.slice(0, 12).map((r) => (
              <div key={r.id} className="grid grid-cols-12 gap-2 px-4 py-2 border-t border-white/5 text-[11px] font-mono hover:bg-white/5">
                <span className="col-span-3 text-gray-300">W{r.week}, {r.year}</span>
                <span className="col-span-3 text-emerald-400">+{fmtM(r.totalRevenue)}</span>
                <span className="col-span-3 text-red-400">−{fmtM(r.totalExpenses)}</span>
                <span className={`col-span-3 text-right font-bold ${r.netProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {r.netProfit >= 0 ? '+' : '−'}{fmtM(Math.abs(r.netProfit))}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
