/**
 * HOLLYWOOD RISING - Brand Partnerships Sub-View
 * Displays real brand deal offers, active contracts, negotiation tools, and history.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState, BrandDealOffer } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { Handshake, ArrowLeft, Check, X, Clock, DollarSign, Award, Tag } from 'lucide-react';

interface BrandPartnershipsViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const BrandPartnershipsView: React.FC<BrandPartnershipsViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player } = useGame();
  const offers = representationState.brandOffers;

  const [filter, setFilter] = useState<'PENDING' | 'ACTIVE' | 'HISTORY'>('PENDING');

  const pendingOffers = offers.filter((o) => o.status === 'OFFER_PENDING');
  const activeDeals = offers.filter((o) => o.status === 'ACTIVE');
  const historyDeals = offers.filter((o) => o.status === 'COMPLETED' || o.status === 'DECLINED');

  // Accept Brand Deal
  const handleAcceptOffer = (offerId: string) => {
    const state = RepresentationService.getState();
    const deal = state.brandOffers.find((o) => o.id === offerId);
    if (!deal) return;

    deal.status = 'ACTIVE';
    deal.dateSigned = `Week ${player.dateWeek}, ${player.dateYear}`;
    state.reputation.publicReputation = Math.min(100, state.reputation.publicReputation + 3);

    // Archive contract
    state.contractsArchive.unshift({
      id: `contract_brand_${deal.id}`,
      title: `Brand Partnership: ${deal.brandName}`,
      contractType: 'ENDORSEMENT',
      counterparty: deal.brandName,
      valueText: `$${deal.weeklyPayment.toLocaleString()}/wk ($${deal.totalValue.toLocaleString()} total)`,
      dateSigned: `Week ${player.dateWeek}, ${player.dateYear}`,
      status: 'ACTIVE',
      details: deal.deliverables,
    });

    RepresentationService.saveState(state);
    alert(`🤝 Signed Brand Partnership with ${deal.brandName}! Payouts: $${deal.weeklyPayment.toLocaleString()}/week.`);
    onRefresh();
  };

  // Decline Brand Deal
  const handleDeclineOffer = (offerId: string) => {
    const state = RepresentationService.getState();
    const deal = state.brandOffers.find((o) => o.id === offerId);
    if (!deal) return;

    deal.status = 'DECLINED';
    RepresentationService.saveState(state);
    onRefresh();
  };

  return (
    <div className="space-y-6 text-white select-none pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Representation</span>
        </button>
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">BRAND PARTNERSHIPS</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold">
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            filter === 'PENDING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Pending Offers ({pendingOffers.length})
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            filter === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Active Deals ({activeDeals.length})
        </button>
        <button
          onClick={() => setFilter('HISTORY')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            filter === 'HISTORY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Partnership History ({historyDeals.length})
        </button>
      </div>

      {/* CONTENT */}
      {filter === 'PENDING' && (
        <div className="space-y-4">
          {pendingOffers.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
              <Clock className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-black text-white">NO PENDING BRAND OFFERS</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Brands extend partnership offers based on your Fame and Reputation. Advance weeks and star in films to trigger new luxury offers!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOffers.map((deal) => (
                <div key={deal.id} className="p-5 rounded-2xl border border-emerald-500/30 bg-black/60 backdrop-blur-md space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                        {deal.brandCategory}
                      </span>
                      <span className="text-xs font-black text-amber-300">${deal.weeklyPayment.toLocaleString()}/wk</span>
                    </div>

                    <h4 className="text-base font-black text-white">{deal.brandName}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{deal.deliverables}</p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-400 pt-2 border-t border-white/10">
                      <div>Length: <span className="text-white font-bold">{deal.contractLengthWeeks} Weeks</span></div>
                      <div>Total Value: <span className="text-emerald-400 font-bold">${deal.totalValue.toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleAcceptOffer(deal.id)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Deal</span>
                    </button>
                    <button
                      onClick={() => handleDeclineOffer(deal.id)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {filter === 'ACTIVE' && (
        <div className="space-y-4">
          {activeDeals.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No active brand deals at present.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDeals.map((deal) => (
                <div key={deal.id} className="p-5 rounded-2xl border border-emerald-500/50 bg-emerald-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-white">{deal.brandName}</h4>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                      {deal.weeksRemaining} Wks Remaining
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{deal.deliverables}</p>
                  <div className="text-xs text-emerald-400 font-black">
                    Weekly Income: +${deal.weeklyPayment.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {filter === 'HISTORY' && (
        <div className="space-y-3">
          {historyDeals.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No brand deal history yet.</p>
          ) : (
            historyDeals.map((deal) => (
              <div key={deal.id} className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-black text-white">{deal.brandName}</h5>
                  <p className="text-xs text-gray-400">{deal.deliverables}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  deal.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {deal.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
