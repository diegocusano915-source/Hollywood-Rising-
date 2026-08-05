/**
 * HOLLYWOOD RISING - Investment Portfolio Sub-View
 * Phase 5 Empire Scene: Film Studios, Tech, Retail, Healthcare, Media, Hospitality, Real Estate, Sports.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, InvestmentOpportunity, InvestmentPortfolioItem, InvestmentSector } from '../../types/empire';
import { EmpireService, INITIAL_INVESTMENT_OPPORTUNITIES } from '../../services/empireService';
import { TrendingUp, DollarSign, PieChart, Briefcase, Film, Cpu, ShoppingBag, HeartPulse, Tv, Hotel, Building, Trophy } from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

const SECTOR_ICONS: Record<InvestmentSector, React.ComponentType<{ className?: string }>> = {
  'Film Studios': Film,
  'Technology': Cpu,
  'Retail': ShoppingBag,
  'Healthcare': HeartPulse,
  'Media': Tv,
  'Hospitality': Hotel,
  'Real Estate': Building,
  'Sports': Trophy,
};

export const InvestmentsView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player } = useGame();
  const invState = empireState.investments || {
    portfolio: [],
    totalInvested: 0,
    totalCurrentValue: 0,
    weeklyDividendYield: 0,
  };

  const handleBuyShares = (opp: InvestmentOpportunity, sharesToBuy: number) => {
    const totalCost = opp.sharePrice * sharesToBuy;
    if (player.money < totalCost) {
      alert(`Insufficient cash! Buying ${sharesToBuy} shares of ${opp.companyName} requires $${totalCost.toLocaleString()}.`);
      return;
    }

    player.money -= totalCost;

    const existingIndex = invState.portfolio.findIndex((p) => p.opportunityId === opp.id);
    let updatedPortfolio: InvestmentPortfolioItem[] = [...invState.portfolio];

    if (existingIndex >= 0) {
      const existing = updatedPortfolio[existingIndex];
      const newShares = existing.sharesOwned + sharesToBuy;
      const newInvested = existing.totalInvested + totalCost;
      const newAvgPrice = newInvested / newShares;

      updatedPortfolio[existingIndex] = {
        ...existing,
        sharesOwned: newShares,
        totalInvested: newInvested,
        averageBuyPrice: newAvgPrice,
        currentSharePrice: opp.sharePrice,
        currentValue: newShares * opp.sharePrice,
      };
    } else {
      updatedPortfolio.push({
        id: `inv_item_${Date.now()}`,
        opportunityId: opp.id,
        companyName: opp.companyName,
        sector: opp.sector,
        sharesOwned: sharesToBuy,
        averageBuyPrice: opp.sharePrice,
        currentSharePrice: opp.sharePrice,
        totalInvested: totalCost,
        currentValue: totalCost,
        totalDividendsEarned: 0,
      });
    }

    const newTotalInvested = updatedPortfolio.reduce((sum, p) => sum + p.totalInvested, 0);
    const newTotalVal = updatedPortfolio.reduce((sum, p) => sum + p.currentValue, 0);

    const updated: EmpireFullState = {
      ...empireState,
      investments: {
        ...invState,
        portfolio: updatedPortfolio,
        totalInvested: newTotalInvested,
        totalCurrentValue: newTotalVal,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
  };

  const portfolioMap = new Map(invState.portfolio.map((p) => [p.opportunityId, p]));

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
            <TrendingUp className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Investment Opportunities & Portfolio</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Portfolio Valuation</span>
            <span className="text-base font-black text-emerald-400 font-mono">
              ${invState.totalCurrentValue.toLocaleString()}
            </span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Capital Invested</span>
            <span className="text-base font-black text-sky-300 font-mono">
              ${invState.totalInvested.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid View: 3 Cards Per Row */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Investment Opportunities ({INITIAL_INVESTMENT_OPPORTUNITIES.length} Sectors)
          </span>
          <span className="text-xs text-amber-300 font-bold">Variable Gameplay Returns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INITIAL_INVESTMENT_OPPORTUNITIES.map((opp) => {
            const IconComp = SECTOR_ICONS[opp.sector] || Briefcase;
            const userHoldings = portfolioMap.get(opp.id);

            return (
              <div
                key={opp.id}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-sky-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                      <IconComp className="w-6 h-6 text-sky-400" />
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px] font-black uppercase tracking-wider">
                      {opp.sector}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{opp.companyName}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{opp.description}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Share Price:</span>
                    <span className="text-emerald-400 font-bold">${opp.sharePrice}/share</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dividend Yield:</span>
                    <span className="text-amber-300 font-bold">{opp.dividendYieldPercent}% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Your Shares:</span>
                    <span className="text-white font-bold">{(userHoldings as any)?.sharesOwned || 0} Shares</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleBuyShares(opp, 100)}
                    className="py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs transition-all cursor-pointer shadow-md"
                  >
                    BUY 100 SHARES
                  </button>
                  <button
                    onClick={() => handleBuyShares(opp, 1000)}
                    className="py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all cursor-pointer shadow-md"
                  >
                    BUY 1,000 SHARES
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
