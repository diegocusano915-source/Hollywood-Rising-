/**
 * HOLLYWOOD RISING - Talent Agency Representation Modal
 * Sign with boutique, mid-range, or elite Hollywood talent agencies across global regions.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Building2, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GlowButton } from '../common/GlowButton';
import { RepresentationService } from '../../services/representationService';

export const RepresentationModal: React.FC = () => {
  const { player, setActiveModal, persistNow } = useGame();
  const [repState, setRepState] = useState(() => RepresentationService.getState());
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSign = (regionId: string, agencyName: string, fee: number) => {
    if (player.money < fee) {
      setFeedback({ success: false, message: `Insufficient funds. Required: $${fee.toLocaleString()}.` });
      return;
    }

    const currentState = RepresentationService.getState();
    const updatedAgencies = currentState.regionalAgencies.map((agency) =>
      agency.id === regionId ? { ...agency, isUnlocked: true, signedAgencyName: agencyName } : agency
    );

    RepresentationService.saveState({
      ...currentState,
      regionalAgencies: updatedAgencies,
    });
    player.money -= fee;
    persistNow();

    setRepState(RepresentationService.getState());
    setFeedback({ success: true, message: `Successfully signed with ${agencyName}!` });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-xl max-h-[85vh] bg-[#111122] border border-[#FF8C00]/40 rounded-3xl p-5 text-[#F0F0F0] flex flex-col shadow-[0_0_50px_rgba(255,140,0,0.2)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222244]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FF8C00]/10 text-[#FF8C00]">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Talent Agencies Roster</h3>
              <p className="text-xs text-[#999999]">Secure official Hollywood & global representation</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-xl bg-[#050510] border border-[#222244] text-[#999999] hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {feedback && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-semibold ${feedback.success ? 'bg-[#33CC55]/20 text-[#33CC55]' : 'bg-[#FF3333]/20 text-[#FF4060]'}`}>
            {feedback.message}
          </div>
        )}

        {/* Agency Cards */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
          {repState.regionalAgencies.map((agency) => {
            const isSigned = !!agency.signedAgencyName;
            const meetsFame = player.fameXp >= agency.minFameXpRequired;
            const agencyFee = 25000;

            return (
              <div
                key={agency.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                  isSigned
                    ? 'bg-[#1E1E3A] border-[#FFCC33]'
                    : 'bg-[#050510] border-[#222244]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF8C00]/20 text-[#FF8C00]">
                      {agency.regionName}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {agency.signedAgencyName || `${agency.regionName} Major Talent Agency`}
                    </h4>
                  </div>
                  {isSigned && (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#FFCC33]">
                      <CheckCircle2 size={16} /> Signed
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#999999]">{agency.perks}</p>

                <div className="grid grid-cols-3 gap-2 bg-[#111122] p-2.5 rounded-xl border border-[#222244] text-[11px]">
                  <div>
                    <span className="text-[#999999] block text-[10px]">Commission</span>
                    <span className="font-bold text-white">{agency.commissionPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[#999999] block text-[10px]">Headquarters</span>
                    <span className="font-bold text-[#33CC55]">{agency.headquarters}</span>
                  </div>
                  <div>
                    <span className="text-[#999999] block text-[10px]">Min. Fame XP</span>
                    <span className="font-bold text-[#5599FF]">{agency.minFameXpRequired} XP</span>
                  </div>
                </div>

                {!isSigned && (
                  <GlowButton
                    variant="gold"
                    size="sm"
                    disabled={!meetsFame || player.money < agencyFee}
                    onClick={() => handleSign(agency.id, `${agency.regionName} Global Agency`, agencyFee)}
                  >
                    SIGN CONTRACT (${agencyFee.toLocaleString()})
                  </GlowButton>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
