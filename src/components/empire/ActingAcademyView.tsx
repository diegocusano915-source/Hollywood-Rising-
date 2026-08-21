/**
 * HOLLYWOOD RISING - Acting Academy Sub-View
 * Phase 5 Empire Scene: Conservatory management, NPC actor training & graduate royalties.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { EmpireFullState, AcademyStudent } from '../../types/empire';
import { EmpireService } from '../../services/empireService';
import {
  GraduationCap,
  Award,
  Users,
  Plus,
  Building,
  DollarSign,
  CheckCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface Props {
  empireState: EmpireFullState;
  onUpdateState: (newState: EmpireFullState) => void;
  onBack: () => void;
}

export const ActingAcademyView: React.FC<Props> = ({ empireState, onUpdateState, onBack }) => {
  const { player , persistNow } = useGame();
  const academy = empireState.actingAcademy;
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openingCost = 150000;

  const handleOpenAcademy = () => {
    setErrorMsg(null);
    setNotification(null);
    if (player.money < openingCost) {
      setErrorMsg(`Insufficient funds! Opening the conservatory requires $${openingCost.toLocaleString()}.`);
      return;
    }

    player.money -= openingCost;
    persistNow();

    const initialStudents: AcademyStudent[] = [];

    const updated: EmpireFullState = {
      ...empireState,
      actingAcademy: {
        ...academy,
        isOpen: true,
        teachersCount: 2,
        campusLevel: 1,
        students: initialStudents,
        weeklyTuitionIncome: 0,
        weeklyOperationalCost: 2000,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification('🎓 ACADEMY OPENED: Hollywood Conservatory is officially open! Scout and recruit your first acting students.');
  };

  const handleHireTeacher = () => {
    setErrorMsg(null);
    setNotification(null);
    const cost = 25000;
    if (player.money < cost) {
      setErrorMsg(`Insufficient funds ($${cost.toLocaleString()} required to hire a Master Instructor).`);
      return;
    }

    player.money -= cost;
    persistNow();

    const updated: EmpireFullState = {
      ...empireState,
      actingAcademy: {
        ...academy,
        teachersCount: (Number(academy.teachersCount) || 0) + 1,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification('👨‍🏫 Hired Master Teacher! Training quality and student capacity increased.');
  };

  const handleExpandCampus = () => {
    setErrorMsg(null);
    setNotification(null);
    const currentLevel = Number(academy.campusLevel) || 1;
    const cost = 100000 * currentLevel;
    if (player.money < cost) {
      setErrorMsg(`Insufficient funds ($${cost.toLocaleString()} required for campus expansion).`);
      return;
    }

    player.money -= cost;
    persistNow();

    const updated: EmpireFullState = {
      ...empireState,
      actingAcademy: {
        ...academy,
        campusLevel: currentLevel + 1,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`🏗️ Expanded Soundstage Campus to Tier ${currentLevel + 1}!`);
  };

  const handleScoutStudent = () => {
    setErrorMsg(null);
    setNotification(null);
    const cost = 2000;
    if (player.money < cost) {
      setErrorMsg(`Insufficient funds ($${cost.toLocaleString()} required to scout and audition a student).`);
      return;
    }

    player.money -= cost;
    persistNow();

    const names = ['Ethan Huntley', 'Maya Lin', 'Caleb Ross', 'Serenity Vance', 'Liam Kincaid', 'Chloe Bennett', 'Dante Thorne', 'Elena Rostova', 'Marcus Brody', 'Sienna Cruz'];
    const talents = ['Method Acting', 'Classical Drama', 'Screen Comedy', 'Action Stunts', 'Musical Theatre', 'Voice Acting'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomTalent = talents[Math.floor(Math.random() * talents.length)];
    const randomSkill = Math.floor(Math.random() * 35) + 40;

    const newStudent: AcademyStudent = {
      id: `std_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: randomName,
      talentType: randomTalent,
      skillRating: randomSkill,
      tuitionPaid: 1500,
      status: 'Enrolled',
    };

    const currentStudents = academy.students || [];
    const updatedStudents = [...currentStudents, newStudent];

    const updated: EmpireFullState = {
      ...empireState,
      actingAcademy: {
        ...academy,
        students: updatedStudents,
        weeklyTuitionIncome: (academy.weeklyTuitionIncome || 0) + 1500,
      },
    };

    EmpireService.saveState(updated);
    onUpdateState(updated);
    setNotification(`🎓 Scouted & Enrolled new student: ${randomName} (${randomTalent}, Skill: ${randomSkill}/100)! +$1,500/wk Tuition.`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ← Back to Grid
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">Acting Academy</h2>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white font-black px-2">✕</button>
        </div>
      )}

      {!academy.isOpen ? (
        <div className="p-6 rounded-3xl border border-emerald-500/40 bg-black/60 backdrop-blur-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center mx-auto shadow-xl">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-black text-white">OPEN DRAMATIC ARTS CONSERVATORY</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Train the next generation of Hollywood actors. Hire veteran teachers, expand campus facilities, and earn weekly tuition & breakout royalties.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 max-w-xs mx-auto text-xs">
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Establishment Capital</span>
            <span className="font-black text-emerald-400">${openingCost.toLocaleString()}</span>
          </div>

          <button
            onClick={handleOpenAcademy}
            className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs transition-all shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>OPEN CONSERVATORY & ADMIT STUDENTS</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Academy Overview Banner — live weekly P&L first */}
          <div className="p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-black via-gray-900 to-black grid grid-cols-2 md:grid-cols-4 gap-3 text-xs shadow-2xl">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Weekly Tuition In</span>
              <span className="font-black text-emerald-400 text-sm font-mono">+${(academy.weeklyTuitionIncome || 0).toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Weekly Operating Cost</span>
              <span className="font-black text-red-400 text-sm font-mono">−${(academy.weeklyOperationalCost || 0).toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Weekly Net</span>
              <span className={`font-black text-sm font-mono ${(academy.weeklyTuitionIncome || 0) - (academy.weeklyOperationalCost || 0) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {((academy.weeklyTuitionIncome || 0) - (academy.weeklyOperationalCost || 0)) >= 0 ? '+' : '−'}${Math.abs((academy.weeklyTuitionIncome || 0) - (academy.weeklyOperationalCost || 0)).toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Tuition / Student</span>
              <span className="font-black text-white text-sm font-mono">${(1200 + (Number(academy.campusLevel) || 1) * 400).toLocaleString()}/wk</span>
            </div>
          </div>
          <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Campus Level</span>
              <span className="font-black text-amber-300 text-sm">Tier {academy.campusLevel} Facilities</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Faculty Teachers</span>
              <span className="font-black text-white text-sm">{academy.teachersCount} Master Instructors</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Enrolled Students</span>
              <span className="font-black text-emerald-400 text-sm">{academy.students.length} Students</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5">
              <span className="text-gray-400 text-[9px] uppercase font-bold block">Total Graduates</span>
              <span className="font-black text-purple-300 text-sm">{academy.totalGraduates} Alumni</span>
            </div>
          </div>

          {/* Upgrade Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleScoutStudent}
              className="px-4 py-2 rounded-2xl bg-indigo-500/20 text-indigo-300 font-black text-xs border border-indigo-500/30 hover:bg-indigo-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              + Scout & Recruit Student ($2k)
            </button>
            <button
              onClick={handleHireTeacher}
              className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              + Hire Master Teacher ($25k)
            </button>
            <button
              onClick={handleExpandCampus}
              className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30 hover:bg-amber-500/30 transition-all cursor-pointer"
            >
              + Expand Soundstage Campus (${(100000 * (Number(academy.campusLevel) || 1)).toLocaleString()})
            </button>
          </div>

          {/* Student Roster */}
          <div className="p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3">
            <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" /> Student & Alumni Roster
            </h4>

            {(!academy.students || academy.students.length === 0) ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-black/60 text-center space-y-3">
                <p className="text-xs text-gray-400">No students currently enrolled in the conservatory.</p>
                <button
                  onClick={handleScoutStudent}
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Search & Audition First Student ($2,000)
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {academy.students.map((std) => (
                  <div key={std.id} className="p-3.5 rounded-2xl border border-white/10 bg-black/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-emerald-400">{std.talentType}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          std.status === 'Star Actor'
                            ? 'bg-amber-500/20 text-amber-300'
                            : std.status === 'Graduated'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {std.status}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white">{std.name}</h5>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${std.skillRating}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 block text-right font-medium">
                      Skill Level: {std.skillRating}/100
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
