/**
 * HOLLYWOOD RISING - Endorsements View (World Ecosystem)
 * Brand Deals & Commercial Sponsorships discovered by Talent Agent.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EndorsementOffer } from '../../types/world';
import { INITIAL_ENDORSEMENT_OFFERS } from '../../database/worldDatabase';
import { RepresentationService } from '../../services/representationService';
import {
  Award,
  DollarSign,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Building2,
  Briefcase,
  Lock,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface EndorsementsViewProps {
  onBack: () => void;
}

export const EndorsementsView: React.FC<EndorsementsViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [offers, setOffers] = useState<EndorsementOffer[]>(INITIAL_ENDORSEMENT_OFFERS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const hasAgent = !!player.representation?.agent?.signed;

  const handleSignDeal = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    if (offer.requirements.includes('Fans') && (player.fans || 0) < 5000 && offer.category !== 'Local') {
      setFeedback('Requires more Fans & Star Power to sign this brand endorsement!');
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, isSigned: true } : o))
    );

    const repState = RepresentationService.getState();
    const weeklyPayout = Math.max(50, Math.round(offer.payPerYear / 52));
    repState.brandOffers.unshift({
      id: `end_deal_${offer.id}_${Date.now()}`,
      brandName: offer.brandName,
      brandCategory: offer.category === 'Luxury' ? 'Luxury Watch' : 'Fashion',
      brandLogoUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150',
      contractLengthWeeks: offer.durationYears * 52,
      weeklyPayment: weeklyPayout,
      totalValue: offer.payPerYear * offer.durationYears,
      requiredFame: 0,
      requiredReputation: 0,
      status: 'ACTIVE',
      weeksRemaining: offer.durationYears * 52,
      deliverables: offer.requirements,
      dateSigned: `Week ${player.dateWeek}, ${player.dateYear}`,
    });
    RepresentationService.saveState(repState);

    setFeedback(`SIGNED ${offer.category.toUpperCase()} ENDORSEMENT WITH ${offer.brandName}! Earning $${weeklyPayout.toLocaleString()}/wk ($${offer.payPerYear.toLocaleString()}/yr).`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-24 space-y-5"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to World Ecosystem</span>
        </button>

        <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          Agent Endorsement Portal
        </span>
      </div>

      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 border shadow-2xl space-y-2 relative overflow-hidden"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
            <Award className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">BRAND ENDORSEMENTS & COMMERCIALS</h1>
            <p className="text-xs text-amber-300 font-medium">
              Sponsorships, luxury watch ambassadorships & fashion campaigns sourced by your Talent Agent.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* AGENT LOCK CHECK */}
      {!hasAgent ? (
        <div className="p-10 rounded-3xl border border-amber-500/30 bg-black/50 text-center space-y-4 shadow-2xl backdrop-blur-md max-w-xl mx-auto my-6">
          <div className="p-4 rounded-full bg-amber-500/20 border border-amber-500/40 w-16 h-16 mx-auto flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">No Endorsement Deals Available</h2>
            <p className="text-sm font-bold text-amber-300">
              Hire a Talent Agent to discover brand endorsement opportunities.
            </p>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Luxury brands (Rolex, Apple, Nike) only negotiate endorsement packages through licensed SAG talent agents.
            </p>
          </div>
        </div>
      ) : (
        /* Endorsements List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((off) => (
            <div
              key={off.id}
              className={`p-5 rounded-3xl border ${
                off.isSigned
                  ? 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-500/10'
                  : 'border-white/10 bg-black/40 hover:bg-black/70'
              } space-y-3 shadow-xl flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {off.category} Brand
                  </span>
                  <span className="text-xs font-black text-emerald-400">${off.payPerYear.toLocaleString()}/yr</span>
                </div>

                <h2 className="text-lg font-black text-white">{off.brandName}</h2>

                <p className="text-xs text-gray-300 font-medium">
                  Requirements: <strong className="text-amber-300">{off.requirements}</strong>
                </p>

                <div className="p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px] flex justify-between">
                  <span>Contract Term: <strong className="text-white">{off.durationYears} Years</strong></span>
                  <span>Agent Sourced: <strong className="text-emerald-400">Yes</strong></span>
                </div>
              </div>

              {off.isSigned ? (
                <button
                  disabled
                  className="w-full py-3 rounded-2xl font-black text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ACTIVE ENDORSEMENT CONTRACT
                </button>
              ) : (
                <button
                  onClick={() => handleSignDeal(off.id)}
                  className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  Sign Endorsement Deal (${off.payPerYear.toLocaleString()}/yr)
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
