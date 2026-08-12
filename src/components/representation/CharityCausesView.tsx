/**
 * HOLLYWOOD RISING - Charity & Public Causes Sub-View
 * Support hospitals, schools, foundations, scholarships, disaster relief, and film education.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { HeartHandshake, ArrowLeft, Plus, Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface CharityCausesViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

const CHARITY_CATEGORIES: {
  category: 'Hospitals' | 'Schools' | 'Foundations' | 'Scholarships' | 'Disaster Relief' | 'Film Education' | 'Community Projects';
  title: string;
  desc: string;
  minDonation: number;
}[] = [
  { category: 'Hospitals', title: "Children's Hospital Medical Pavilion", desc: 'Fund pediatric wing equipment and specialized oncology care.', minDonation: 10000 },
  { category: 'Film Education', title: 'Young Filmmakers Conservatory', desc: 'Provide cameras, editing suites, and mentorship for underprivileged youth.', minDonation: 5000 },
  { category: 'Scholarships', title: 'Arts & Acting Diversity Endowment', desc: 'Full four-year university tuition scholarships for aspiring actors.', minDonation: 15000 },
  { category: 'Disaster Relief', title: 'Global Emergency Relief Reserve', desc: 'Immediate medical aid and shelter support for disaster regions.', minDonation: 25000 },
  { category: 'Foundations', title: 'Named Philanthropic Family Foundation', desc: 'Establish your permanent tax-exempt charitable endowment trust.', minDonation: 100000 },
];

export const CharityCausesView: React.FC<CharityCausesViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player } = useGame();
  const charities = representationState.charities;

  const [donationAmount, setDonationAmount] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleMakeDonation = (cause: typeof CHARITY_CATEGORIES[0]) => {
    const amount = donationAmount[cause.category] || cause.minDonation;
    if (amount < cause.minDonation) {
      setFeedback(`Minimum donation for ${cause.title} is $${cause.minDonation.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 4000);
      return;
    }
    if (player.money < amount) {
      setFeedback('Insufficient funds for this donation.');
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    player.money -= amount;
    const state = RepresentationService.getState();

    let existing = state.charities.find((c) => c.category === cause.category);
    if (!existing) {
      existing = {
        id: `charity_${Date.now()}`,
        name: cause.title,
        category: cause.category,
        description: cause.desc,
        totalDonated: 0,
        isFoundationEstablished: cause.category === 'Foundations',
        foundationName: cause.category === 'Foundations' ? `${player.lastName} Philanthropic Foundation` : undefined,
        reputationBonus: 10,
        trustBonus: 12,
        legacyScoreBonus: 25,
      };
      state.charities.unshift(existing);
    }

    existing.totalDonated += amount;

    // SCALED EFFECTS (real, per $1M): rep +1, trust +1.5, fans +100 per $1M
    const perM = amount / 1000000;
    const repGain = Math.min(15, Math.round(perM * 1));
    const trustGain = Math.min(20, Math.round(perM * 1.5));
    const fanGain = Math.min(200000, Math.round(perM * 100));
    state.reputation.publicTrust = Math.min(100, (state.reputation.publicTrust || 0) + trustGain);
    state.reputation.publicReputation = Math.min(100, (state.reputation.publicReputation || 0) + repGain);
    player.fans = (player.fans || 0) + fanGain;

    // Cause-specific bonus
    if (cause.category === 'Film Education') state.reputation.industryReputation = Math.min(100, (state.reputation.industryReputation || 0) + 3);
    if (cause.category === 'Disaster Relief') state.reputation.publicTrust = Math.min(100, (state.reputation.publicTrust || 0) + 3);

    RepresentationService.saveState(state);

    setFeedback(
      `🎗 Donated $${amount.toLocaleString()} to ${cause.title}! +${trustGain} Trust, +${repGain} Rep, +${fanGain.toLocaleString()} fans.` +
      (amount >= 10000000 ? ' 📰 Press coverage! Hollywood Insider is reporting your generosity.' : '')
    );
    setTimeout(() => setFeedback(null), 6000);
    onRefresh();
  };

  // Charity events: real-triggered, cost + rewards
  const handleHostEvent = (cause: typeof CHARITY_CATEGORIES[0]) => {
    const cost = Math.max(250000, Math.floor((donationAmount[cause.category] || 500000) * 0.2));
    if (player.money < cost) { setFeedback(`Charity event needs $${cost.toLocaleString()}.`); setTimeout(() => setFeedback(null), 4000); return; }
    player.money -= cost;
    const state = RepresentationService.getState();
    state.reputation.publicReputation = Math.min(100, (state.reputation.publicReputation || 0) + 5);
    state.reputation.publicTrust = Math.min(100, (state.reputation.publicTrust || 0) + 5);
    player.fans = (player.fans || 0) + Math.floor(5000 + (player.fameXp || 0) * 0.5);
    RepresentationService.saveState(state);
    setFeedback(`🌟 Charity Gala hosted for ${cause.title}! +5 Rep, +5 Trust, +fans.`);
    setTimeout(() => setFeedback(null), 5000);
    onRefresh();
  };

  // Foundation passive growth (real, weekly in processEndWeek — shown here as status)
  const foundationTotal = charities.find((c) => c.isFoundationEstablished)?.totalDonated || 0;
  const totalGiven = charities.reduce((a, c) => a + c.totalDonated, 0);

  return (
    <div className="space-y-6 text-white select-none pb-12">
      {/* Header Bar */}
      {feedback && <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-black text-center">{feedback}</div>}

      <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Representation</span>
        </button>
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">CHARITY & PUBLIC CAUSES</h2>
        </div>
      </div>

      {/* Available Causes Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Philanthropic Initiatives & Foundations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHARITY_CATEGORIES.map((cause) => {
            const active = charities.find((c) => c.category === cause.category);
            const amt = donationAmount[cause.category] || cause.minDonation;
            return (
              <div key={cause.category} className="p-5 rounded-3xl border border-emerald-500/30 bg-black/60 backdrop-blur-md space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                      {cause.category}
                    </span>
                    {active && (
                      <span className="text-xs font-black text-emerald-400">
                        Donated: ${active.totalDonated.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-white">{cause.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{cause.desc}</p>
                  <p className="text-[9px] text-gray-500">Min ${cause.minDonation.toLocaleString()} · Effects scale per $1M (rep/trust/fans)</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="number"
                    min={cause.minDonation}
                    value={amt}
                    onChange={(e) => setDonationAmount((d) => ({ ...d, [cause.category]: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white text-xs outline-none"
                    placeholder={`Amount (min $${cause.minDonation.toLocaleString()})`}
                  />
                  <button
                    onClick={() => handleMakeDonation(cause)}
                    className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs transition-all shadow-md cursor-pointer hover:scale-105"
                  >
                    🎗 DONATE ${(amt || cause.minDonation).toLocaleString()}
                  </button>
                  <button
                    onClick={() => handleHostEvent(cause)}
                    className="w-full py-2 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-300 text-[10px] font-black cursor-pointer hover:border-emerald-400"
                  >
                    🌟 HOST CHARITY GALA (${Math.max(250000, Math.floor((amt || 500000) * 0.2)).toLocaleString()})
                  </button>
                </div>
              </div>
            );
          })}

          {/* GIVING SUMMARY */}
          <div className="p-4 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-black/70 to-black/70 space-y-2">
            <h4 className="text-sm font-black text-white flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-emerald-400" /> Your Giving Legacy</h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <p className="text-[9px] text-gray-400 uppercase font-bold">Total Donated</p>
                <p className="text-lg font-black text-emerald-400">${totalGiven.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <p className="text-[9px] text-gray-400 uppercase font-bold">Foundation</p>
                <p className="text-lg font-black text-white">{foundationTotal > 0 ? `${player.lastName} Philanthropic Foundation` : 'Not established'}</p>
              </div>
            </div>
            {/* MILESTONES (real, earned only) */}
            <div className="flex gap-1.5 flex-wrap pt-1">
              {[{ v: 1000000, l: '$1M' }, { v: 10000000, l: '$10M' }, { v: 100000000, l: '$100M' }, { v: 1000000000, l: '$1B' }].map((m) => (
                <span key={m.v} className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${totalGiven >= m.v ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-black/40 text-gray-600 border border-white/10'}`}>
                  {totalGiven >= m.v ? '✓' : '🔒'} {m.l} Donor
                </span>
              ))}
            </div>
            <p className="text-[9px] text-gray-500">Your foundation earns passive reputation weekly. Big donations get press coverage — all real, tied to your actual giving.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
