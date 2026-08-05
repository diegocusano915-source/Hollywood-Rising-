/**
 * HOLLYWOOD RISING - Law Firm Sub-View
 * Entertainment Lawyers, Contracts Review, Copyright, Trademark, Lawsuits, and Wills.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RepresentationFullState, LawFirmTier } from '../../types/representation';
import { RepresentationService } from '../../services/representationService';
import { Scale, ShieldCheck, ArrowLeft, Plus, CheckCircle, FileText, Gavel, AlertCircle, UserMinus } from 'lucide-react';

interface LawFirmViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

const LAW_FIRM_OPTIONS: { tier: LawFirmTier; name: string; retainer: number; desc: string }[] = [
  {
    tier: 'Solo Attorney',
    name: 'Marcus Vance, Esq.',
    retainer: 2000,
    desc: 'Veteran solo entertainment attorney specializing in guild contracts and copyright filings.',
  },
  {
    tier: 'Entertainment Law Boutique',
    name: 'Gersh & Ziffren Law Partners',
    retainer: 7500,
    desc: 'Century City boutique film firm protecting back-end profit shares and intellectual property.',
  },
  {
    tier: 'Beverly Hills Elite Legal',
    name: 'Glaser Weil & Howard LLP',
    retainer: 20000,
    desc: 'The premiere powerhouse law firm representing studio heads and A-list legends.',
  },
];

export const LawFirmView: React.FC<LawFirmViewProps> = ({
  representationState,
  onRefresh,
  onBack,
}) => {
  const { player } = useGame();
  const law = representationState.lawFirm;

  const [activeTab, setActiveTab] = useState<'FIRM' | 'TRADEMARKS' | 'LAWSUITS' | 'WILL'>('FIRM');
  const [trademarkName, setTrademarkName] = useState('');
  const [trademarkCat, setTrademarkCat] = useState<'FILM_TITLE' | 'BRAND_NAME' | 'CHARACTER_NAME' | 'MERCH_LINE'>('FILM_TITLE');

  // Hire Law Firm
  const handleHireFirm = (tier: LawFirmTier, retainer: number) => {
    if (player.money < retainer) {
      alert(`Insufficient funds! Retainer requires $${retainer.toLocaleString()}.`);
      return;
    }
    const state = RepresentationService.getState();
    state.lawFirm.hiredFirmTier = tier;
    state.lawFirm.weeklyRetainerFee = retainer;
    RepresentationService.saveState(state);
    onRefresh();
  };

  // Fire / Cancel Law Firm Retainer
  const handleFireFirm = () => {
    if (confirm('Are you sure you want to fire your Legal Counsel and terminate the retainer contract? Weekly legal fees will stop immediately.')) {
      const state = RepresentationService.getState();
      state.lawFirm.hiredFirmTier = 'None';
      state.lawFirm.weeklyRetainerFee = 0;
      RepresentationService.saveState(state);
      onRefresh();
    }
  };

  // Register Trademark
  const handleRegisterTrademark = () => {
    if (!trademarkName.trim()) {
      alert('Please enter a trademark name.');
      return;
    }
    if (law.hiredFirmTier === 'None') {
      alert('You must retain a Law Firm before registering official federal trademarks!');
      return;
    }

    const cost = 2500;
    if (player.money < cost) {
      alert('Insufficient funds for federal trademark filing ($2,500 required).');
      return;
    }

    player.money -= cost;
    const state = RepresentationService.getState();
    state.lawFirm.trademarks.unshift({
      id: `tm_${Date.now()}`,
      name: trademarkName.trim(),
      category: trademarkCat,
      registeredDate: `Week ${player.dateWeek}, ${player.dateYear}`,
      registrationCost: cost,
    });

    RepresentationService.saveState(state);
    setTrademarkName('');
    alert(`⚖ Trademark "${trademarkName}" successfully registered with the US Patent & Trademark Office!`);
    onRefresh();
  };

  // Review Will / Estate Plan
  const handleReviewWill = () => {
    const cost = 5000;
    if (player.money < cost) {
      alert('Insufficient funds for estate plan & will review ($5,000 required).');
      return;
    }
    player.money -= cost;
    const state = RepresentationService.getState();
    state.lawFirm.willsReviewed = true;
    state.reputation.professionalism = Math.min(100, state.reputation.professionalism + 10);
    RepresentationService.saveState(state);
    alert('📜 Executive Will & Estate Trust plan finalized with senior partners.');
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
          <Scale className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">LAW FIRM & COUNSEL</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('FIRM')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'FIRM' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Legal Counsel & Retainer
        </button>
        <button
          onClick={() => setActiveTab('TRADEMARKS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'TRADEMARKS' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Trademarks & Copyrights ({law.trademarks.length})
        </button>
        <button
          onClick={() => setActiveTab('LAWSUITS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'LAWSUITS' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Lawsuits ({law.lawsuits.filter((l) => l.status === 'ACTIVE').length})
        </button>
        <button
          onClick={() => setActiveTab('WILL')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'WILL' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Estate & Will
        </button>
      </div>

      {activeTab === 'FIRM' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-indigo-500/30 bg-black/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-widest">Active Retainer</span>
              <h3 className="text-xl font-black text-white">
                {law.hiredFirmTier === 'None' ? 'No Law Firm Retained' : law.hiredFirmTier}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {law.hiredFirmTier === 'None'
                  ? 'Retain an entertainment law firm to review studio contracts and protect IP.'
                  : `Weekly Retainer Fee: $${law.weeklyRetainerFee.toLocaleString()}/week.`}
              </p>
            </div>
            {law.hiredFirmTier !== 'None' && (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black">
                  LEGAL COUNSEL ACTIVE
                </span>
                <button
                  onClick={handleFireFirm}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 shadow"
                >
                  <UserMinus className="w-4 h-4 text-rose-400" />
                  <span>Fire Lawyer</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LAW_FIRM_OPTIONS.map((opt) => {
              const isCurrent = law.hiredFirmTier === opt.tier || law.hiredFirmTier === opt.name;
              return (
                <div
                  key={opt.tier}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/10 bg-black/40 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300">{opt.tier}</span>
                      <span className="text-xs font-black text-white">${opt.retainer.toLocaleString()}/wk</span>
                    </div>
                    <h5 className="text-sm font-black text-white">{opt.name}</h5>
                    <p className="text-xs text-gray-400 leading-relaxed">{opt.desc}</p>
                  </div>

                  {isCurrent ? (
                    <button
                      onClick={handleFireFirm}
                      className="mt-4 w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 shadow-lg hover:scale-[1.02] flex items-center justify-center gap-1.5"
                    >
                      <UserMinus className="w-4 h-4 text-rose-400" />
                      <span>Fire Lawyer</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleHireFirm(opt.tier, opt.retainer)}
                      className="mt-4 w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer bg-indigo-400 hover:bg-indigo-300 text-black shadow-lg hover:scale-[1.02]"
                    >
                      Retain Law Firm (${opt.retainer.toLocaleString()}/wk)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'TRADEMARKS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Register Federal Trademark or Copyright</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Trademark Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Starburst Pictures, Iconic Catchphrase, Character Brand"
                  value={trademarkName}
                  onChange={(e) => setTrademarkName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Category</label>
                <select
                  value={trademarkCat}
                  onChange={(e) => setTrademarkCat(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white outline-none focus:border-indigo-400"
                >
                  <option value="FILM_TITLE">Film Title</option>
                  <option value="BRAND_NAME">Brand Name</option>
                  <option value="CHARACTER_NAME">Character Name</option>
                  <option value="MERCH_LINE">Merch Line</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRegisterTrademark}
              className="px-6 py-2.5 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-black font-black text-xs transition-all shadow-lg hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>FILE TRADEMARK REGISTRATION ($2,500)</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Registered Federal Trademarks</h4>
            {law.trademarks.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No trademarks filed yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {law.trademarks.map((tm) => (
                  <div key={tm.id} className="p-4 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-black text-white">{tm.name}</h5>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase">{tm.category}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{tm.registeredDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'LAWSUITS' && (
        <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
          <Gavel className="w-10 h-10 text-indigo-400 mx-auto" />
          <h3 className="text-base font-black text-white">NO PENDING LITIGATION</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Your legal standing is completely clear. Contract or studio copyright disputes will automatically route here for litigation.
          </p>
        </div>
      )}

      {activeTab === 'WILL' && (
        <div className="p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Executive Estate Plan & Living Will</h3>
              <p className="text-xs text-gray-400">
                Structure family trusts, intellectual property rights, and asset protection with senior partners.
              </p>
            </div>
            {law.willsReviewed && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                ESTATE TRUST FINALIZED
              </span>
            )}
          </div>

          <button
            onClick={handleReviewWill}
            className="px-6 py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-black font-black text-xs transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            {law.willsReviewed ? 'UPDATE ESTATE TRUST PLAN ($5,000)' : 'FINALIZE ESTATE WILL ($5,000)'}
          </button>
        </div>
      )}
    </div>
  );
};
