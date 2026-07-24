/**
 * HOLLYWOOD RISING - Lawyers View (World Ecosystem)
 * 7 Named Law Firms, Contract Arbitration, Retainers & Legal Defense.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { LawFirm } from '../../types/world';
import { INITIAL_LAWYERS } from '../../database/worldDatabase';
import {
  Scale,
  Shield,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Award,
  FileText,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface LawyersViewProps {
  onBack: () => void;
}

export const LawyersView: React.FC<LawyersViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [firms, setFirms] = useState<LawFirm[]>(INITIAL_LAWYERS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleHireLawyer = (firmId: string) => {
    const firm = firms.find((f) => f.id === firmId);
    if (!firm) return;

    if (player.money < firm.retainerFee) {
      setFeedback(`Insufficient funds! Need $${firm.retainerFee.toLocaleString()} retainer fee.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setFirms((prev) =>
      prev.map((f) => ({
        ...f,
        isHired: f.id === firmId,
      }))
    );

    setFeedback(`RETAINED ${firm.name.toUpperCase()}! Full legal protection activated.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-20 space-y-5"
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
          <Scale className="w-4 h-4 text-amber-400" />
          Hollywood Legal Defense Counsel
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
            <Scale className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">HOLLYWOOD LAW FIRMS & LITIGATION</h1>
            <p className="text-xs text-amber-300 font-medium">
              Hire Beverly Hills litigators to defend against defamation, studio contract breaches & IP theft.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* Firms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {firms.map((firm) => (
          <div
            key={firm.id}
            className={`p-5 rounded-3xl border ${
              firm.isHired
                ? 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-500/10'
                : 'border-white/10 bg-black/40 hover:bg-black/70'
            } backdrop-blur-md space-y-4 shadow-xl flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={firm.logoUrl} alt={firm.name} className="w-12 h-12 rounded-2xl object-cover border border-amber-400/30 shrink-0" />
                  <div>
                    <h3 className="text-base font-black text-white">{firm.name}</h3>
                    <span className="text-[10px] text-amber-300 font-bold block">{firm.specialty}</span>
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {firm.tier}
                </span>
              </div>

              <p className="text-xs text-gray-300">{firm.bio}</p>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px]">
                <div>
                  <span className="text-gray-400 block font-bold">Win Rate</span>
                  <span className="font-black text-emerald-400">{firm.winRate}% Success</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-bold">Retainer Fee</span>
                  <span className="font-black text-amber-300">${firm.retainerFee.toLocaleString()} / Year</span>
                </div>
              </div>
            </div>

            {firm.isHired ? (
              <button
                disabled
                className="w-full py-3.5 rounded-2xl font-black text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ACTIVE LEGAL COUNSEL ON RETAINER
              </button>
            ) : (
              <button
                onClick={() => handleHireLawyer(firm.id)}
                className="w-full py-3.5 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Retain Law Firm (${firm.retainerFee.toLocaleString()})
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
