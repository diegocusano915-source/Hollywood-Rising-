/**
 * HOLLYWOOD RISING - Contract Negotiation Modal
 * Negotiate Salary, Backend %, Profit Share %, and Box Office Bonuses using Player Leverage.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, DollarSign, TrendingUp, Award, Building2, CheckCircle2, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CallboardProject, BookedProject } from '../../types/game';
import { THEMES } from '../../theme/colors';
import { soundService } from '../../services/soundService';

interface ContractNegotiationModalProps {
  project: CallboardProject;
  onClose: () => void;
  onSuccess: (bookedProject: BookedProject) => void;
}

export const ContractNegotiationModal: React.FC<ContractNegotiationModalProps> = ({
  project,
  onClose,
  onSuccess,
}) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // Base terms
  const initialContract = project.proposedContract || {
    salary: project.salary,
    backendPercent: 1.0,
    profitSharePercent: 2.0,
    boxOfficeBonus: Math.floor(project.salary * 1.5),
  };

  const [salary, setSalary] = useState(initialContract.salary);
  const [backendPercent, setBackendPercent] = useState(initialContract.backendPercent);
  const [profitShare, setProfitShare] = useState(initialContract.profitSharePercent);
  const [boxOfficeBonus, setBoxOfficeBonus] = useState(initialContract.boxOfficeBonus);

  const [negotiationStatus, setNegotiationStatus] = useState<'IDLE' | 'ACCEPTED' | 'COUNTER' | 'REJECTED'>('IDLE');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Calculate Leverage
  const agentBonus = player.representation?.agent?.signed ? 20 : 0;
  const managerBonus = player.representation?.manager ? 15 : 0;
  const awardsBonus = (player.awardsWon || 0) * 10;
  const fameBonus = Math.floor(player.fameXp / 10);
  const actingBonus = Math.floor(player.talents.acting / 5);

  const totalLeverage = Math.min(100, Math.max(10, fameBonus + actingBonus + agentBonus + managerBonus + awardsBonus));

  // Studio tolerance calculation
  const salaryDemandRatio = salary / Math.max(1, initialContract.salary);
  const backendDemandRatio = (backendPercent + profitShare) / Math.max(0.5, initialContract.backendPercent + initialContract.profitSharePercent);
  const demandScore = Math.round((salaryDemandRatio * 40) + (backendDemandRatio * 40));

  const handleNegotiate = () => {
    soundService.playClick();

    if (demandScore <= totalLeverage + 20) {
      // ACCEPTED
      soundService.playSuccessSound();
      setNegotiationStatus('ACCEPTED');
      setFeedbackMessage(`DEAL SIGNED! Studio Executives accepted your contract terms ($${salary.toLocaleString()} base salary + ${backendPercent}% backend).`);

      const newBooked: BookedProject = {
        id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        projectId: (project as any).originalProjectId || (project as any).projectId || project.id,
        movieTitle: project.title,
        posterUrl: project.posterUrl,
        roleType: project.roleType,
        category: project.category || 'Feature Film',
        salary: salary,
        totalFilmingWeeks: project.filmingWeeks,
        weeksRemaining: project.filmingWeeks,
        isFilmingComplete: false,
        studio: project.studio,
        director: project.director,
        genre: project.genre,
        budget: project.budget,
        location: `${project.studio} Soundstages, Hollywood`,
        backendPercent,
        profitSharePercent: profitShare,
        boxOfficeBonus,
        status: 'Pre-Production',
        stageWeeksRemaining: 2, // 2 weeks pre-production
        totalStageWeeks: 2,
        hypeScore: 35 + Math.floor(player.fameXp / 20),
        socialBuzz: 2500,
        productionLog: [
          {
            week: player.dateWeek,
            year: player.dateYear,
            stage: 'Contract Signed',
            eventText: `Contract officially signed with ${project.studio} for $${salary.toLocaleString()} base salary.`,
            type: 'milestone',
          },
          {
            week: player.dateWeek,
            year: player.dateYear,
            stage: 'Pre-Production',
            eventText: 'Pre-production commenced: Table reads, costume fittings, and script walk-throughs.',
            type: 'info',
          }
        ],
      };

      setTimeout(() => {
        onSuccess(newBooked);
      }, 1500);

    } else if (demandScore <= totalLeverage + 50) {
      // COUNTER OFFER
      soundService.playGoldChime();
      const counterSal = Math.floor(initialContract.salary * (1 + (totalLeverage / 200)));
      const counterBackend = Number((initialContract.backendPercent * 1.2).toFixed(1));
      setSalary(counterSal);
      setBackendPercent(counterBackend);
      setNegotiationStatus('COUNTER');
      setFeedbackMessage(`STUDIO COUNTER OFFER: Studio refused your ambitious demand, but countered with $${counterSal.toLocaleString()} base salary and ${counterBackend}% backend points.`);
    } else {
      // REJECTED
      soundService.playClick();
      setNegotiationStatus('REJECTED');
      setFeedbackMessage('NEGOTIATIONS BROKE DOWN: Studio executives walked away due to unreasonable contract demands.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-[#0F1022] border-2 border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider">Contract Negotiations</h3>
              <p className="text-xs text-gray-400">{project.title} • {project.studio}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project & Leverage Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 p-4 rounded-2xl border border-white/10">
          <div className="flex gap-3 items-center">
            <img src={project.posterUrl} alt={project.title} className="w-16 h-22 object-cover rounded-xl border border-white/20" />
            <div className="text-xs space-y-1">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">{project.roleType} Role</span>
              <h4 className="font-extrabold text-white text-sm">{project.title}</h4>
              <p className="text-gray-400 text-[11px]">{project.genre} • Budget: ${(project.budget / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-black/60 p-3 rounded-xl border border-amber-500/20 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Negotiation Leverage:</span>
              <span className="text-amber-400 font-black">{totalLeverage} / 100</span>
            </div>
            <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: `${totalLeverage}%` }} />
            </div>
            <p className="text-[10px] text-gray-400">Boosted by Agent, Manager, Awards ({player.awardsWon}), and Fame ({player.fameXp} XP)</p>
          </div>
        </div>

        {/* Terms Adjuster */}
        <div className="space-y-4">
          {/* Base Salary Slider */}
          <div className="bg-black/30 p-3.5 rounded-xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300 font-bold flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-400" /> Base Contract Salary:</span>
              <span className="text-emerald-400 font-black text-sm">${salary.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={Math.floor(initialContract.salary * 0.8)}
              max={Math.floor(initialContract.salary * 3)}
              step={1000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              disabled={negotiationStatus !== 'IDLE' && negotiationStatus !== 'COUNTER'}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Backend Points & Profit Share */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-black/30 p-3.5 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-bold flex items-center gap-1"><TrendingUp className="w-4 h-4 text-cyan-400" /> Backend Points:</span>
                <span className="text-cyan-300 font-black">{backendPercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={backendPercent}
                onChange={(e) => setBackendPercent(Number(e.target.value))}
                disabled={negotiationStatus !== 'IDLE' && negotiationStatus !== 'COUNTER'}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="bg-black/30 p-3.5 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-bold flex items-center gap-1"><Sparkles className="w-4 h-4 text-purple-400" /> Profit Share:</span>
                <span className="text-purple-300 font-black">{profitShare}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={profitShare}
                onChange={(e) => setProfitShare(Number(e.target.value))}
                disabled={negotiationStatus !== 'IDLE' && negotiationStatus !== 'COUNTER'}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Status Feedback */}
        {feedbackMessage && (
          <div className={`p-3.5 rounded-xl text-xs font-bold leading-relaxed ${
            negotiationStatus === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
            negotiationStatus === 'COUNTER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
            'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {feedbackMessage}
          </div>
        )}

        {/* Action Button */}
        {negotiationStatus !== 'ACCEPTED' && (
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-5 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-xs hover:bg-gray-700 cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleNegotiate}
              className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-300 text-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {negotiationStatus === 'COUNTER' ? 'Accept Counter Terms' : 'Submit Contract Demand'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
