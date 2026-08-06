/**
 * HOLLYWOOD RISING - Talent System & Acting School Screen
 * Phase 2 Interactive Architecture:
 * - 6 Clickable Permanent Talents -> Opens Talent Details Page
 *   (Level 0-100, Progress Bar, Description, Courses that improve talent, Active Courses, Completed Courses, Training History)
 * - Acting School Catalogue with Clickable Course Cards -> Opens Course Details Page/Modal
 *   (Course Name, Teacher, Description, Cost, Weekly Energy Cost, Duration, Talent Reward, Enroll Button)
 * - Active Courses Section (Max 2 simultaneous, Weeks Remaining, Weekly Energy, Progress %, Reward)
 * - Completed Courses Section (Course Name, Completion Date, Talent Earned, Teacher)
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  GraduationCap,
  Sparkles,
  Zap,
  DollarSign,
  Award,
  BookOpen,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Film,
  Volume2,
  Smile,
  HeartHandshake,
  Swords,
  Music,
  ArrowLeft,
  X,
  History,
  Check,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';
import { TalentCategory, ActingCourse, ActiveCourse, CompletedCourseRecord } from '../../types/game';
import { ACTING_COURSES_POOL } from '../../database/actingSchoolDatabase';

export const TalentScreen: React.FC = () => {
  const { player, enrollInCourse, advanceWeek, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // Navigation State inside Talent Screen
  const [selectedTalentCategory, setSelectedTalentCategory] = useState<TalentCategory | null>(null);
  const [selectedCourseModal, setSelectedCourseModal] = useState<ActingCourse | null>(null);
  const [catalogueCategoryFilter, setCatalogueCategoryFilter] = useState<TalentCategory | 'all'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const talents = player.talents || {
    acting: 0,
    voice: 0,
    comedy: 0,
    drama: 0,
    action: 0,
    dancing: 0,
  };

  const activeCourses = player.activeCourses || [];
  const availableCourses = player.availableSchoolCourses || [];
  const completedRecords = player.completedCourseRecords || [];

  const handleEnroll = (courseId: string) => {
    const res = enrollInCourse(courseId);
    setFeedbackMessage({ text: res.message, isError: !res.success });
    setTimeout(() => setFeedbackMessage(null), 4000);

    if (res.success && selectedCourseModal?.id === courseId) {
      setSelectedCourseModal(null);
    }
  };

  const talentConfigs = [
    {
      id: 'acting' as const,
      name: 'Acting Skill',
      val: talents.acting,
      icon: Film,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      desc: 'Fundamental screen presence, character immersion, script breakdown, and audition callback performance.',
    },
    {
      id: 'voice' as const,
      name: 'Voice & Diction',
      val: talents.voice,
      icon: Volume2,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      desc: 'Vocal projection, accent mastery, voiceover dubbing, ADR lip-syncing, and animated feature casting.',
    },
    {
      id: 'comedy' as const,
      name: 'Comedy & Improv',
      val: talents.comedy,
      icon: Smile,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      desc: 'Timing, multi-cam sitcom delivery, physical slapstick, witty banter, and spontaneous on-set ad-libbing.',
    },
    {
      id: 'drama' as const,
      name: 'Dramatic Depth',
      val: talents.drama,
      icon: HeartHandshake,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      desc: 'Raw emotional access, tears on command, biopic authenticity, tragic monologue delivery, and Oscar contention.',
    },
    {
      id: 'action' as const,
      name: 'Action & Stunts',
      val: talents.action,
      icon: Swords,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      desc: 'Stage combat, tactical firearms, precision stunt driving, high falls, wirework, and blockbuster action execution.',
    },
    {
      id: 'dancing' as const,
      name: 'Dancing & Movement',
      val: talents.dancing,
      icon: Music,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      desc: 'Choreography, musical theater, ballroom poise, contemporary floorwork, and music video rhythm.',
    },
  ];

  const getRankBadge = (val: number) => {
    if (val >= 80) return { label: 'VIRTUOSO', bg: 'bg-amber-500 text-black font-black' };
    if (val >= 60) return { label: 'MASTER', bg: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' };
    if (val >= 40) return { label: 'SKILLED', bg: 'bg-sky-500/20 text-sky-300 border border-sky-500/40' };
    if (val >= 20) return { label: 'APPRENTICE', bg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' };
    return { label: 'NOVICE', bg: 'bg-gray-800 text-gray-400 border border-gray-700' };
  };

  const filteredCatalogue = catalogueCategoryFilter === 'all'
    ? availableCourses
    : availableCourses.filter(c => c.category === catalogueCategoryFilter);

  // =========================================================================
  // VIEW: TALENT DETAILS PAGE (When a Talent Card is Tapped)
  // =========================================================================
  if (selectedTalentCategory) {
    const config = talentConfigs.find(t => t.id === selectedTalentCategory)!;
    const Icon = config.icon;
    const rank = getRankBadge(config.val);

    // Courses that improve this talent (from full pool)
    const talentCoursesPool = ACTING_COURSES_POOL.filter(c => c.category === selectedTalentCategory);

    // Active courses for this talent
    const talentActiveCourses = activeCourses.filter(c => c.category === selectedTalentCategory);

    // Completed courses for this talent
    const talentCompletedRecords = completedRecords.filter(c => c.category === selectedTalentCategory);

    return (
      <div
        className="w-full min-h-full flex flex-col p-4 select-none pb-12"
        style={{ backgroundColor: theme.background }}
      >
        {/* Back Button & Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedTalentCategory(null)}
            className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to All Talents</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              ${player.money.toLocaleString()}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {player.energy} / {player.maxEnergy}
            </div>
          </div>
        </div>

        {/* Talent Hero Card */}
        <div className={`p-5 rounded-2xl border ${config.border} bg-black/50 backdrop-blur-md space-y-4 shadow-2xl mb-6 relative overflow-hidden`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${config.bg} border ${config.border}`}>
                <Icon className={`w-8 h-8 ${config.color}`} />
              </div>
              <div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase ${rank.bg}`}>
                  {rank.label}
                </span>
                <h1 className="text-xl font-black text-white mt-1">{config.name}</h1>
                <p className="text-xs text-amber-300/90 font-medium">Talent Management & Training History</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-3xl font-black text-white">{config.val}</span>
              <span className="text-xs text-gray-400 font-bold block">/ 100 Points</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400">Attribute Progress</span>
              <span className="text-amber-300">{config.val}%</span>
            </div>
            <div className="w-full bg-black/70 rounded-full h-3 p-0.5 border border-white/10">
              <div
                className="h-full rounded-full transition-all duration-500 shadow"
                style={{
                  width: `${config.val}%`,
                  backgroundColor: theme.primary,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 leading-relaxed">
            <strong className="text-white block mb-0.5">Attribute Overview:</strong>
            {config.desc}
          </div>
        </div>

        {/* Active Courses for this Talent */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Active Courses ({talentActiveCourses.length})
          </h2>

          {talentActiveCourses.length === 0 ? (
            <div className="p-4 rounded-xl border border-white/10 bg-black/30 text-center text-xs text-gray-400">
              No active courses currently enrolled for {config.name}.
            </div>
          ) : (
            <div className="space-y-2">
              {talentActiveCourses.map((c) => {
                const progressPct = Math.round((c.weeksCompleted / c.totalWeeks) * 100);
                const weeksRemaining = c.totalWeeks - c.weeksCompleted;

                return (
                  <div key={c.id} className="p-4 rounded-xl border border-sky-500/30 bg-black/50 space-y-2 shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">{c.name}</h3>
                        <p className="text-[10px] text-gray-400">Instructor: {c.teacher}</p>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">
                        +{c.talentReward.amount} {c.talentReward.talent.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-300">
                      <span>Weeks Remaining: <strong className="text-amber-300">{weeksRemaining} Weeks</strong></span>
                      <span>Weekly Energy: <strong className="text-amber-300">-{c.weeklyEnergyCost} Energy</strong></span>
                      <span>Progress: <strong className="text-sky-300">{progressPct}%</strong></span>
                    </div>

                    <div className="w-full bg-black/70 rounded-full h-2 border border-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%`, backgroundColor: theme.primary }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Courses for this Talent */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Completed Courses ({talentCompletedRecords.length})
          </h2>

          {talentCompletedRecords.length === 0 ? (
            <div className="p-4 rounded-xl border border-white/10 bg-black/30 text-center text-xs text-gray-400">
              No completed courses recorded for {config.name} yet.
            </div>
          ) : (
            <div className="space-y-2">
              {talentCompletedRecords.map((cr) => (
                <div key={cr.id} className="p-3.5 rounded-xl border border-emerald-500/30 bg-black/40 flex items-center justify-between gap-3 shadow">
                  <div>
                    <h4 className="text-xs font-bold text-white">{cr.name}</h4>
                    <p className="text-[10px] text-gray-400">Teacher: {cr.teacher}</p>
                    <span className="text-[9px] text-amber-300 font-semibold">
                      Completed Week {cr.completionWeek}, Year {cr.completionYear}
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0">
                    +{cr.talentReward.amount} {cr.category.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Training History */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" />
            Training History & Milestones
          </h2>

          <div className="p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Current Level</span>
              <span className="font-extrabold text-white">{config.val} / 100</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Rank Classification</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${rank.bg}`}>{rank.label}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-400">Total Courses Graduated</span>
              <span className="font-extrabold text-emerald-400">{talentCompletedRecords.length} Courses</span>
            </div>
          </div>
        </div>

        {/* Courses That Improve This Talent */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Courses That Improve {config.name} (Tap Course to View Details)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {talentCoursesPool.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourseModal(course)}
                className="p-4 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 hover:border-amber-400/50 transition-all cursor-pointer space-y-2 group shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {course.difficulty}
                    </span>
                    <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors mt-1">
                      {course.name}
                    </h3>
                    <p className="text-[10px] text-gray-400">Instructor: {course.teacher}</p>
                  </div>

                  <span className="text-xs font-black text-emerald-400 shrink-0">
                    ${course.cost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
                  <span>{course.durationWeeks} Wks • -{course.weeklyEnergyCost} Energy/Wk</span>
                  <span className="font-extrabold text-emerald-400">
                    +{course.talentReward.amount} {course.talentReward.talent.substring(0, 3).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Course Details */}
        {selectedCourseModal && (
          <CourseDetailsModal
            course={selectedCourseModal}
            onClose={() => setSelectedCourseModal(null)}
            onEnroll={handleEnroll}
            player={player}
            theme={theme}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // MAIN VIEW: ALL TALENTS + ACTIVE COURSES + COMPLETED COURSES + ACTING SCHOOL
  // =========================================================================
  return (
    <div
      className="w-full min-h-full flex flex-col p-4 select-none pb-12"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Header Card */}
      <div
        className="rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-3 shadow-xl mb-5"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              TALENT & ACTING SCHOOL
            </h1>
            <p className="text-xs text-amber-300 font-medium">
              Tap any talent attribute or acting course to manage & enroll
            </p>
          </div>
        </div>

        {/* Quick Counters */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">${player.money.toLocaleString()}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-xs font-bold text-amber-300">{player.energy} / {player.maxEnergy}</span>
          </div>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl mb-4 border flex items-center gap-2 text-xs font-bold shadow-lg animate-bounce ${
            feedbackMessage.isError
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {feedbackMessage.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* 6 Permanent Clickable Talents Grid */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Permanent Talent Attributes (Tap Card to View Details)
          </h2>
          <span className="text-[10px] text-amber-400/80 font-semibold">
            {Object.values(talents).reduce((a: number, b: number) => a + b, 0)} Total Talent Points
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {talentConfigs.map((t) => {
            const Icon = t.icon;
            const rank = getRankBadge(t.val);

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTalentCategory(t.id)}
                className={`p-4 rounded-2xl border ${t.border} bg-black/40 hover:bg-black/70 hover:border-amber-400/60 backdrop-blur-md space-y-3 shadow-lg relative overflow-hidden transition-all cursor-pointer group hover:scale-[1.01]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${t.bg}`}>
                      <Icon className={`w-5 h-5 ${t.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                        {t.name}
                      </h3>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${rank.bg}`}>
                        {rank.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white">{t.val}</span>
                    <span className="text-[10px] text-gray-500 font-bold block">/ 100</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${t.val}%`,
                      backgroundColor: theme.primary,
                    }}
                  />
                </div>

                <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">
                  {t.desc}
                </p>

                <div className="text-[10px] text-amber-400 font-extrabold text-right flex items-center justify-end gap-1">
                  <span>Manage Talent & History →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE COURSES SECTION (Max 2) */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Active Courses ({activeCourses.length} / 2 Max)
          </h2>
          <span className="text-[10px] text-gray-400">
            Deducts weekly energy on "END WEEK"
          </span>
        </div>

        {activeCourses.length === 0 ? (
          <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-center space-y-2">
            <GraduationCap className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-xs font-bold text-gray-300">No active course enrollments.</p>
            <p className="text-[10px] text-gray-500">
              Browse available courses in the Acting School below to begin studying!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCourses.map((c) => {
              const progressPct = Math.round((c.weeksCompleted / c.totalWeeks) * 100);
              const weeksRemaining = c.totalWeeks - c.weeksCompleted;

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border ${
                    c.isPaused ? 'border-rose-500/50 bg-rose-950/20' : 'border-sky-500/40 bg-black/50'
                  } space-y-3 shadow-xl relative`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {c.category.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-black text-white mt-1">{c.name}</h3>
                      <p className="text-[10px] text-gray-400">Instructor: {c.teacher}</p>
                    </div>

                    {c.isPaused ? (
                      <span className="text-[9px] font-black text-rose-300 bg-rose-500/30 px-2 py-1 rounded border border-rose-500/50 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        PAUSED
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                        IN PROGRESS
                      </span>
                    )}
                  </div>

                  {/* Course Details Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/60 border border-white/5 text-[10px]">
                    <div>
                      <span className="text-gray-500 block font-semibold text-[9px]">Weeks Left</span>
                      <span className="font-bold text-amber-300">{weeksRemaining} Wks</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block font-semibold text-[9px]">Weekly Cost</span>
                      <span className="font-bold text-amber-300">-{c.weeklyEnergyCost} Energy</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block font-semibold text-[9px]">Reward</span>
                      <span className="font-extrabold text-emerald-400">+{c.talentReward.amount} {c.talentReward.talent.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Week {c.weeksCompleted} of {c.totalWeeks}
                      </span>
                      <span className="text-amber-300">{progressPct}%</span>
                    </div>

                    <div className="w-full bg-black/70 rounded-full h-2 overflow-hidden border border-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progressPct}%`,
                          backgroundColor: theme.primary,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COMPLETED COURSES SECTION */}
      <div className="space-y-3 mb-6">
        <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Completed Courses ({completedRecords.length})
        </h2>

        {completedRecords.length === 0 ? (
          <div className="p-4 rounded-xl border border-white/10 bg-black/30 text-center text-xs text-gray-400">
            No completed courses yet. As you graduate from Acting School courses, completed certificates will be stored here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedRecords.map((cr) => (
              <div
                key={cr.id}
                className="p-3.5 rounded-2xl border border-emerald-500/30 bg-black/40 flex items-center justify-between gap-3 shadow"
              >
                <div>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {cr.category.toUpperCase()}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1">{cr.name}</h3>
                  <p className="text-[10px] text-gray-400">Teacher: {cr.teacher}</p>
                  <p className="text-[9px] text-amber-300 font-semibold mt-0.5">
                    Completed: Week {cr.completionWeek}, Year {cr.completionYear}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 block">
                    +{cr.talentReward.amount} {cr.talentReward.talent.substring(0, 3).toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTING SCHOOL SECTION */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              ACTING SCHOOL (Tap Any Course to View Details)
            </h2>
            <p className="text-[10px] text-gray-500">
              4 new courses generate every week. Click any course card to inspect details and enroll.
            </p>
          </div>

          <button
            onClick={advanceWeek}
            className="px-3 py-1.5 rounded-xl font-bold text-[10px] shadow transition-all flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ backgroundColor: theme.primary, color: '#000000' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Refresh Next Week
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(['all', 'acting', 'voice', 'comedy', 'drama', 'action', 'dancing'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCatalogueCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all shrink-0 cursor-pointer ${
                catalogueCategoryFilter === cat
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Available Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCatalogue.map((course) => {
            const isUnionLocked = course.requiresUnionMember && !player.isUnionMember;
            const cannotAfford = player.money < course.cost;
            const maxActiveReached = activeCourses.length >= 2;
            const isAlreadyEnrolled = activeCourses.some(a => a.courseId === course.id);

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourseModal(course)}
                className="p-4 rounded-2xl border border-white/10 bg-black/40 hover:bg-black/70 hover:border-amber-400/50 transition-all space-y-3 shadow-xl cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {course.category.toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                          {course.difficulty}
                        </span>
                        {course.requiresUnionMember && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            SAG Required
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors mt-1.5">
                        {course.name}
                      </h3>
                      <p className="text-[10px] text-amber-300 font-semibold">Teacher: {course.teacher}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-emerald-400 block">
                        ${course.cost.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold">Tuition</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-300 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/50 border border-white/5 text-[10px]">
                    <div>
                      <span className="text-gray-500 block font-semibold text-[9px]">Duration</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {course.durationWeeks} Wks
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 block font-semibold text-[9px]">Weekly Cost</span>
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        {course.weeklyEnergyCost} Energy
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 block font-semibold text-[9px]">Reward</span>
                      <span className="font-extrabold text-emerald-400">
                        +{course.talentReward.amount} {course.talentReward.talent.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] text-amber-400 font-bold flex items-center justify-between">
                  <span>Tap to inspect course details</span>
                  <span>View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Course Details */}
      {selectedCourseModal && (
        <CourseDetailsModal
          course={selectedCourseModal}
          onClose={() => setSelectedCourseModal(null)}
          onEnroll={handleEnroll}
          player={player}
          theme={theme}
        />
      )}
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: COURSE DETAILS MODAL
// =========================================================================
interface CourseDetailsModalProps {
  course: ActingCourse;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  player: any;
  theme: any;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  onClose,
  onEnroll,
  player,
  theme,
}) => {
  const activeCourses = player.activeCourses || [];
  const isUnionLocked = course.requiresUnionMember && !player.isUnionMember;
  const cannotAfford = player.money < course.cost;
  const maxActiveReached = activeCourses.length >= 2;
  const isAlreadyEnrolled = activeCourses.some((a: any) => a.courseId === course.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg rounded-3xl border border-amber-400/40 p-6 space-y-5 shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: theme.headers }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-gray-400 hover:text-white transition-all cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {course.category.toUpperCase()} COURSE
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700">
              {course.difficulty} Difficulty
            </span>
            {course.requiresUnionMember && (
              <span className="text-[10px] font-black px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                SAG-AFTRA Required
              </span>
            )}
          </div>

          <h2 className="text-xl font-black text-white">{course.name}</h2>
          <p className="text-xs text-amber-300 font-extrabold flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            Instructor: {course.teacher}
          </p>
        </div>

        {/* Course Description */}
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-300 leading-relaxed">
          <strong className="text-white block mb-1">Course Description:</strong>
          {course.description}
        </div>

        {/* Requirements & Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30">
            <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">Tuition Cost</span>
            <span className="text-sm font-black text-emerald-400">${course.cost.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
            <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">Weekly Cost</span>
            <span className="text-sm font-black text-amber-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {course.weeklyEnergyCost} Energy
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-sky-500/30">
            <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">Duration</span>
            <span className="text-sm font-black text-sky-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.durationWeeks} Weeks
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30">
            <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">Talent Reward</span>
            <span className="text-sm font-black text-purple-300">
              +{course.talentReward.amount} {course.talentReward.talent.substring(0, 3).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Enrollment Action Button */}
        <div className="pt-3 border-t border-white/10">
          {isAlreadyEnrolled ? (
            <button
              disabled
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              CURRENTLY ENROLLED IN THIS COURSE
            </button>
          ) : isUnionLocked ? (
            <button
              disabled
              className="w-full py-3.5 rounded-2xl font-bold text-xs bg-gray-800 text-gray-500 border border-gray-700 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-4 h-4 text-purple-400" />
              LOCKED (Requires SAG-AFTRA Membership)
            </button>
          ) : maxActiveReached ? (
            <button
              disabled
              className="w-full py-3.5 rounded-2xl font-bold text-xs bg-gray-800 text-gray-500 border border-gray-700 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              MAXIMUM 2 ACTIVE COURSES REACHED
            </button>
          ) : (
            <button
              onClick={() => onEnroll(course.id)}
              disabled={cannotAfford}
              className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                cannotAfford
                  ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
              style={{
                backgroundColor: cannotAfford ? undefined : theme.primary,
                color: cannotAfford ? undefined : '#000000',
              }}
            >
              <GraduationCap className="w-4 h-4" />
              {cannotAfford
                ? `INSUFFICIENT CASH (Need $${course.cost.toLocaleString()})`
                : `ENROLL & PAY TUITION ($${course.cost.toLocaleString()})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
