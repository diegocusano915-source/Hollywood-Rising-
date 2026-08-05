/**
 * HOLLYWOOD RISING - Contract Archive Sub-View
 * Stores every signed contract across movies, brand deals, sponsorships, businesses, and legal retainers.
 */

import React, { useState } from 'react';
import { RepresentationFullState, ContractType } from '../../types/representation';
import { FileText, ArrowLeft, CheckCircle, ShieldCheck, Film, Briefcase, Handshake, Target } from 'lucide-react';

interface ContractArchiveViewProps {
  representationState: RepresentationFullState;
  onRefresh: () => void;
  onBack: () => void;
}

export const ContractArchiveView: React.FC<ContractArchiveViewProps> = ({
  representationState,
  onBack,
}) => {
  const contracts = representationState.contractsArchive;
  const [filter, setFilter] = useState<string>('ALL');

  const filteredContracts = filter === 'ALL' ? contracts : contracts.filter((c) => c.contractType === filter);

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
          <FileText className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-black text-white uppercase tracking-wider">CONTRACT ARCHIVE</h2>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold">
        {['ALL', 'MOVIE', 'ENDORSEMENT', 'SPONSORSHIP', 'BUSINESS', 'LEGAL'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === type ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-gray-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredContracts.length === 0 ? (
          <div className="p-8 rounded-3xl border border-white/10 bg-black/40 text-center space-y-2">
            <FileText className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-base font-black text-white">NO SIGNED CONTRACTS IN ARCHIVE</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Contracts are automatically archived whenever you book film roles, sign brand deals, accept corporate sponsorships, or retain legal counsel.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContracts.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                    {c.contractType}
                  </span>
                  <span className="text-[10px] text-gray-400">{c.dateSigned}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Party: {c.counterparty}</span>
                  <h4 className="text-base font-black text-white">{c.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{c.details}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                  <span className="font-black text-emerald-400">{c.valueText}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
