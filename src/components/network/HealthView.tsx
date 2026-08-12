/**
 * HOLLYWOOD RISING - Health & Wellness System Overhaul V1
 * Premium 3 Cards Per Row Grid View System
 * Physical, Mental, Insurance, Fitness, Nutrition, Sleep, Recovery, Medical Center, Medical Records & Annual Health Report.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  NetworkFullState,
  PlayerHealthState,
  HealthInsurancePlan,
  MedicalRecordEntry,
  AnnualHealthReportData,
} from '../../types/network';
import {
  HEALTH_INSURANCE_PLANS,
  DIET_OPTIONS,
  HEALTH_SERVICES,
  NetworkService,
} from '../../services/networkService';
import {
  Heart,
  ArrowLeft,
  Zap,
  Activity,
  Smile,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Award,
  Dumbbell,
  Apple,
  Moon,
  FileText,
  Stethoscope,
  Flame,
  Sun,
  DollarSign,
  Plus,
  RefreshCw,
  Bed,
  Check,
  TrendingUp,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface HealthViewProps {
  onBack: () => void;
  networkState: NetworkFullState;
  onUpdateState: (next: NetworkFullState) => void;
}

type HealthTab =
  | 'OVERVIEW'
  | 'DASHBOARD'
  | 'INSURANCE'
  | 'MEDICAL_CENTER'
  | 'FITNESS'
  | 'MENTAL'
  | 'NUTRITION'
  | 'SLEEP'
  | 'RECOVERY'
  | 'RECORDS'
  | 'ANNUAL_REPORT';

export const HealthView: React.FC<HealthViewProps> = ({
  onBack,
  networkState,
  onUpdateState,
}) => {
  const { player, settings , persistNow } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [activeTab, setActiveTab] = useState<HealthTab>('OVERVIEW');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Safe guaranteed healthState defaults
  const rawHealth = networkState.healthState || ({} as Partial<PlayerHealthState>);
  const health: PlayerHealthState = {
    healthScore: rawHealth.healthScore ?? 92,
    physicalHealth: rawHealth.physicalHealth ?? 90,
    mentalHealth: rawHealth.mentalHealth ?? 88,
    energy: rawHealth.energy ?? 95,
    stress: rawHealth.stress ?? 20,
    happiness: rawHealth.happiness ?? 85,
    burnoutRisk: rawHealth.burnoutRisk ?? 15,
    fitnessLevel: rawHealth.fitnessLevel ?? 80,
    sleepQuality: rawHealth.sleepQuality ?? 88,
    nutritionLevel: rawHealth.nutritionLevel ?? 85,
    sleepHours: rawHealth.sleepHours ?? 8.0,
    fatigueLevel: rawHealth.fatigueLevel ?? 10,
    activeInsurancePlanId: rawHealth.activeInsurancePlanId ?? 'plan_standard',
    activeDietId: rawHealth.activeDietId ?? 'diet_balanced',
    weeklyDietCost: rawHealth.weeklyDietCost ?? 150,
    activeGymId: rawHealth.activeGymId ?? null,
    weeklyHealthExpense: rawHealth.weeklyHealthExpense ?? 0,
    energyMaxBonus: rawHealth.energyMaxBonus ?? 0,
    cosmeticAppealBonus: rawHealth.cosmeticAppealBonus ?? 0,
    treatmentHistory: rawHealth.treatmentHistory || [],
    medicalRecords: rawHealth.medicalRecords || [
      {
        id: 'med_init',
        week: player.dateWeek || 1,
        year: player.dateYear || 2026,
        type: 'Checkup',
        title: 'Initial Hollywood Physical Exam',
        doctorNotes: 'Patient in excellent physical condition. Approved for all stunt & acting roles.',
        cost: 300,
        insuranceCoveredAmount: 150,
        outOfPocket: 150,
      },
    ],
    annualReports: rawHealth.annualReports || [
      {
        year: (player.dateYear || 2026) - 1,
        overallScore: 92,
        physicalScore: 90,
        mentalScore: 88,
        fitnessScore: 82,
        sleepScore: 88,
        stressScore: 20,
        lifestyleRating: 'Optimal Mogul',
        doctorRecommendations: [
          'Maintain regular cardiovascular fitness routine',
          'Continue balanced Mediterranean diet',
          'Ensure adequate rest between film productions',
        ],
      },
    ],
    activeHealthEvents: rawHealth.activeHealthEvents || [],
  };

  const currentInsurance =
    HEALTH_INSURANCE_PLANS.find((p) => p.id === health.activeInsurancePlanId) ||
    HEALTH_INSURANCE_PLANS[1];

  const currentDiet =
    DIET_OPTIONS.find((d) => d.id === health.activeDietId) || DIET_OPTIONS[0];

  // Helper to persist updated health state
  const saveHealthUpdate = (updatedHealth: PlayerHealthState, message: string) => {
    const nextState: NetworkFullState = {
      ...networkState,
      healthState: updatedHealth,
    };
    NetworkService.saveState(nextState);
    onUpdateState(nextState);
    setFeedback(message);
    setTimeout(() => setFeedback(null), 4000);
  };

  // --- ACTIONS ---

  // 1. Insurance Management
  const handleSelectInsurance = (plan: HealthInsurancePlan) => {
    if (plan.id === health.activeInsurancePlanId) return;

    const nextHealth: PlayerHealthState = {
      ...health,
      activeInsurancePlanId: plan.id,
    };

    saveHealthUpdate(
      nextHealth,
      `🏥 INSURANCE UPDATED: Switched to ${plan.providerName} (${plan.tier} Plan). Premium: $${plan.weeklyCost}/wk.`
    );
  };

  const handleCancelInsurance = () => {
    const nextHealth: PlayerHealthState = {
      ...health,
      activeInsurancePlanId: null,
    };
    saveHealthUpdate(
      nextHealth,
      '⚠️ INSURANCE CANCELLED: You no longer have health insurance coverage. Medical costs will be 100% out-of-pocket.'
    );
  };

  // 2. Medical Center Treatments
  const medicalCenterTreatments = [
    {
      type: 'Checkup' as const,
      title: 'Routine Checkup',
      baseCost: 300,
      notes: 'Comprehensive baseline physical exam & biometric vital check.',
      healthBoost: 5,
    },
    {
      type: 'Consultation' as const,
      title: 'General Consultation',
      baseCost: 500,
      notes: 'Direct consultation with Beverly Hills physician regarding stress & energy.',
      healthBoost: 8,
    },
    {
      type: 'Specialist' as const,
      title: 'Specialist Visit',
      baseCost: 1200,
      notes: 'Consultation with top sports medicine orthopedist & longevity physician.',
      healthBoost: 12,
    },
    {
      type: 'Emergency' as const,
      title: 'Emergency Care',
      baseCost: 3500,
      notes: 'Urgent ER care for acute exhaustion, dehydration, or injury.',
      healthBoost: 25,
    },
    {
      type: 'Therapy' as const,
      title: 'Physical Therapy',
      baseCost: 800,
      notes: 'Targeted physical rehabilitation for muscle strain and joint recovery.',
      healthBoost: 15,
    },
    {
      type: 'Dental' as const,
      title: 'Dental Care',
      baseCost: 600,
      notes: 'Hollywood smile checkup, whitening, and preventive oral health.',
      healthBoost: 6,
    },
    {
      type: 'Vision' as const,
      title: 'Vision Care',
      baseCost: 400,
      notes: 'Laser eye checkup & prescription lens adjustment for script reading.',
      healthBoost: 5,
    },
    {
      type: 'Vaccination' as const,
      title: 'Vaccinations & Boosters',
      baseCost: 250,
      notes: 'International filming location immunity boosters & flu defense.',
      healthBoost: 5,
    },
    {
      type: 'Screening' as const,
      title: 'Full Body Health Screening',
      baseCost: 1500,
      notes: 'Advanced MRI & biomarker panel to detect latent fatigue or organ strain.',
      healthBoost: 18,
    },
  ];

  const handleReceiveTreatment = (treatment: typeof medicalCenterTreatments[0]) => {
    const coverage = currentInsurance ? currentInsurance.coveragePercent : 0;
    const coveredAmount = Math.floor((treatment.baseCost * coverage) / 100);
    const outOfPocket = treatment.baseCost - coveredAmount;

    if (player.money < outOfPocket) {
      setFeedback(`Insufficient funds! Need $${outOfPocket.toLocaleString()} out-of-pocket.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= outOfPocket;
    persistNow();

    const newRecord: MedicalRecordEntry = {
      id: `med_${Date.now()}`,
      week: player.dateWeek || 1,
      year: player.dateYear || 2026,
      type: treatment.type,
      title: treatment.title,
      doctorNotes: treatment.notes,
      cost: treatment.baseCost,
      insuranceCoveredAmount: coveredAmount,
      outOfPocket,
    };

    const nextHealth: PlayerHealthState = {
      ...health,
      healthScore: Math.min(100, health.healthScore + treatment.healthBoost),
      physicalHealth: Math.min(100, health.physicalHealth + treatment.healthBoost),
      stress: Math.max(0, health.stress - 10),
      burnoutRisk: Math.max(0, health.burnoutRisk - 10),
      medicalRecords: [newRecord, ...health.medicalRecords],
    };

    saveHealthUpdate(
      nextHealth,
      `🩺 MEDICAL TREATMENT COMPLETED: ${treatment.title}. Out-of-pocket: $${outOfPocket.toLocaleString()} (Covered $${coveredAmount.toLocaleString()} by ${currentInsurance ? currentInsurance.providerName : 'No Insurance'}). +${treatment.healthBoost} Health!`
    );
  };

  // 3. Fitness Activities
  const fitnessActivities = [
    { name: 'Gym Workout', cost: 50, energyCost: 10, fitnessBoost: 5, energyMaxBoost: 2, icon: Dumbbell, desc: 'Standard weightlifting & stamina routine.' },
    { name: 'Running Routine', cost: 0, energyCost: 15, fitnessBoost: 4, energyMaxBoost: 1, icon: Activity, desc: 'Outdoor cardio jog through Santa Monica.' },
    { name: 'Swimming Laps', cost: 100, energyCost: 12, fitnessBoost: 6, energyMaxBoost: 3, icon: Sparkles, desc: 'Low-impact full-body swimming workout.' },
    { name: 'Yoga Session', cost: 80, energyCost: 8, fitnessBoost: 4, energyMaxBoost: 2, icon: Sun, desc: 'Flexibility, core balance & breathing control.' },
    { name: 'Pilates Class', cost: 120, energyCost: 10, fitnessBoost: 5, energyMaxBoost: 2, icon: Sparkles, desc: 'Core alignment & posture refinement.' },
    { name: 'Boxing Sparring', cost: 150, energyCost: 20, fitnessBoost: 8, energyMaxBoost: 4, icon: Flame, desc: 'High-intensity conditioning for action stunt roles.' },
    { name: 'Martial Arts Training', cost: 200, energyCost: 22, fitnessBoost: 9, energyMaxBoost: 5, icon: Award, desc: 'Kung Fu & Jiu-Jitsu combat choreo preparation.' },
    { name: 'Personal Trainer', cost: 500, energyCost: 15, fitnessBoost: 12, energyMaxBoost: 6, icon: Dumbbell, desc: '1-on-1 celebrity trainer customization.' },
    { name: 'Strength Training', cost: 100, energyCost: 18, fitnessBoost: 7, energyMaxBoost: 3, icon: Dumbbell, desc: 'Heavy hypertrophy for physique transformation.' },
    { name: 'Cardio Blast', cost: 60, energyCost: 14, fitnessBoost: 5, energyMaxBoost: 2, icon: Activity, desc: 'High-intensity interval cardiovascular training.' },
  ];

  const handlePerformFitness = (act: typeof fitnessActivities[0]) => {
    if (player.money < act.cost) {
      setFeedback(`Insufficient funds! Need $${act.cost}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= act.cost;
    persistNow();

    const nextHealth: PlayerHealthState = {
      ...health,
      fitnessLevel: Math.min(100, health.fitnessLevel + act.fitnessBoost),
      physicalHealth: Math.min(100, health.physicalHealth + Math.floor(act.fitnessBoost / 2)),
      energyMaxBonus: Math.min(50, health.energyMaxBonus + act.energyMaxBoost),
      energy: Math.min(100, Math.max(0, health.energy - act.energyCost + 15)),
      burnoutRisk: Math.max(0, health.burnoutRisk - 3),
    };

    saveHealthUpdate(
      nextHealth,
      `💪 FITNESS WORKOUT COMPLETED: ${act.name}! Fitness +${act.fitnessBoost}, Max Energy Bonus +${act.energyMaxBoost}.`
    );
  };

  // 4. Mental Wellness Activities
  const mentalActivities = [
    { name: 'Meditate', cost: 0, mentalBoost: 8, stressReduce: 15, happinessBoost: 5, desc: '30-minute mindfulness & deep breath control.' },
    { name: 'Take Vacation', cost: 5000, mentalBoost: 25, stressReduce: 40, happinessBoost: 20, desc: '1-week tropical resort getaway to fully recharge.' },
    { name: 'Attend Therapy', cost: 400, mentalBoost: 15, stressReduce: 25, happinessBoost: 10, desc: 'Private consultation with top Hollywood psychologist.' },
    { name: 'Reduce Work Load', cost: 0, mentalBoost: 10, stressReduce: 20, happinessBoost: 8, desc: 'Delegate non-essential studio meetings & tasks.' },
    { name: 'Take a Break', cost: 0, mentalBoost: 6, stressReduce: 12, happinessBoost: 5, desc: 'Unplug phone & disconnect from industry gossip for a day.' },
    { name: 'Spend Time With Family', cost: 200, mentalBoost: 12, stressReduce: 20, happinessBoost: 15, desc: 'Quality dinner and quality time with loved ones.' },
    { name: 'Rest & Relaxation', cost: 0, mentalBoost: 8, stressReduce: 14, happinessBoost: 6, desc: 'Relax at home reading scripts and listening to music.' },
  ];

  const handlePerformMental = (act: typeof mentalActivities[0]) => {
    if (player.money < act.cost) {
      setFeedback(`Insufficient funds! Need $${act.cost.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= act.cost;
    persistNow();

    const nextHealth: PlayerHealthState = {
      ...health,
      mentalHealth: Math.min(100, health.mentalHealth + act.mentalBoost),
      stress: Math.max(0, health.stress - act.stressReduce),
      happiness: Math.min(100, health.happiness + act.happinessBoost),
      burnoutRisk: Math.max(0, health.burnoutRisk - Math.floor(act.stressReduce / 2)),
    };

    saveHealthUpdate(
      nextHealth,
      `🧘 MENTAL WELLNESS: ${act.name}! Mental Health +${act.mentalBoost}, Stress -${act.stressReduce}, Burnout Risk Reduced!`
    );
  };

  // 5. Nutrition Diet Selection
  const handleSelectDiet = (diet: typeof DIET_OPTIONS[0]) => {
    const nextHealth: PlayerHealthState = {
      ...health,
      activeDietId: diet.id,
      weeklyDietCost: diet.cost,
      nutritionLevel: Math.min(100, health.nutritionLevel + 10),
      physicalHealth: Math.min(100, health.physicalHealth + diet.physicalBonus),
    };

    saveHealthUpdate(
      nextHealth,
      `🥗 DIET PLAN ACTIVATED: ${diet.name}! Weekly cost: $${diet.cost}/wk. Physical vitality +${diet.physicalBonus}.`
    );
  };

  // 6. Sleep Actions
  const sleepActions = [
    { name: 'Sleep Early (9 Hours)', hours: 9, energyRestore: 30, fatigueReduce: 25, qualityBoost: 8, desc: 'Go to bed early for full deep sleep cycle recovery.' },
    { name: 'Take Power Nap (1 Hour)', hours: 1, energyRestore: 12, fatigueReduce: 10, qualityBoost: 4, desc: 'Quick mid-afternoon nap between script read-throughs.' },
    { name: 'Weekend Full Rest', hours: 12, energyRestore: 45, fatigueReduce: 35, qualityBoost: 15, desc: 'Clear calendar for entire weekend sleep restoration.' },
    { name: 'Vacation Sleep Recovery', hours: 10, energyRestore: 60, fatigueReduce: 50, qualityBoost: 25, desc: 'Deep circadian rhythm reset during hiatus.' },
  ];

  const handlePerformSleep = (act: typeof sleepActions[0]) => {
    const nextHealth: PlayerHealthState = {
      ...health,
      sleepHours: act.hours,
      sleepQuality: Math.min(100, health.sleepQuality + act.qualityBoost),
      fatigueLevel: Math.max(0, health.fatigueLevel - act.fatigueReduce),
      energy: Math.min(100, health.energy + act.energyRestore),
      stress: Math.max(0, health.stress - 5),
    };

    saveHealthUpdate(
      nextHealth,
      `😴 SLEEP RESTORATION: ${act.name}! Fatigue -${act.fatigueReduce}, Sleep Quality +${act.qualityBoost}%, Energy Restored!`
    );
  };

  // 7. Recovery Methods
  const recoveryMethods = [
    { name: 'Beverly Hills Spa Day', cost: 1200, energyBoost: 25, stressReduce: 30, mentalBoost: 15, desc: 'Mineral baths, sauna & essential oil treatment.' },
    { name: 'Deep Tissue Massage', cost: 400, energyBoost: 15, stressReduce: 20, mentalBoost: 10, desc: 'Targeted muscle knot release & tension relief.' },
    { name: 'Luxury Malibu Vacation', cost: 8000, energyBoost: 50, stressReduce: 50, mentalBoost: 30, desc: 'Oceanfront estate rest & private beach relaxation.' },
    { name: 'Ojai Wellness Retreat', cost: 5000, energyBoost: 35, stressReduce: 40, mentalBoost: 25, desc: 'Detox, sound baths & holistic mental reset.' },
    { name: 'Cryo Recovery Center', cost: 1500, energyBoost: 20, stressReduce: 15, mentalBoost: 8, desc: 'Whole-body cryotherapy for rapid muscle inflammation reduction.' },
    { name: 'Relaxation & Mind Rest', cost: 200, energyBoost: 12, stressReduce: 15, mentalBoost: 10, desc: 'Aromatherapy & peaceful outdoor garden time.' },
    { name: 'Family Quality Time', cost: 0, energyBoost: 18, stressReduce: 22, mentalBoost: 18, desc: 'Quality bonding with spouse, children & close friends.' },
  ];

  const handlePerformRecovery = (method: typeof recoveryMethods[0]) => {
    if (player.money < method.cost) {
      setFeedback(`Insufficient funds! Need $${method.cost.toLocaleString()}.`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    player.money -= method.cost;
    persistNow();

    const nextHealth: PlayerHealthState = {
      ...health,
      energy: Math.min(100, health.energy + method.energyBoost),
      stress: Math.max(0, health.stress - method.stressReduce),
      mentalHealth: Math.min(100, health.mentalHealth + method.mentalBoost),
      burnoutRisk: Math.max(0, health.burnoutRisk - Math.floor(method.stressReduce / 2)),
    };

    saveHealthUpdate(
      nextHealth,
      `🌿 RECOVERY TREATMENT: ${method.name}! Energy +${method.energyBoost}, Stress -${method.stressReduce}, Mental Health +${method.mentalBoost}.`
    );
  };

  // 8. Generate Annual Health Report
  const handleGenerateAnnualReport = () => {
    const newReport: AnnualHealthReportData = {
      year: player.dateYear || 2026,
      overallScore: health.healthScore,
      physicalScore: health.physicalHealth,
      mentalScore: health.mentalHealth,
      fitnessScore: health.fitnessLevel,
      sleepScore: health.sleepQuality,
      stressScore: health.stress,
      lifestyleRating:
        health.healthScore >= 90
          ? 'Optimal Mogul'
          : health.healthScore >= 75
          ? 'Healthy'
          : health.healthScore >= 50
          ? 'Moderate Risk'
          : 'Critical Burnout',
      doctorRecommendations: [
        health.fitnessLevel < 70
          ? 'Increase weekly fitness activities to maintain stamina.'
          : 'Fitness level is excellent; maintain current regimen.',
        health.stress > 40
          ? 'High stress detected. Schedule meditation or therapy sessions.'
          : 'Stress levels are well managed.',
        health.sleepQuality < 70
          ? 'Improve sleep hygiene and avoid late-night script reviews.'
          : 'Sleep quality is optimal.',
      ],
    };

    const nextHealth: PlayerHealthState = {
      ...health,
      annualReports: [
        newReport,
        ...health.annualReports.filter((r) => r.year !== newReport.year),
      ],
    };

    saveHealthUpdate(
      nextHealth,
      `📋 ANNUAL HEALTH REPORT GENERATED FOR YEAR ${newReport.year}: Overall Score ${newReport.overallScore}/100 (${newReport.lifestyleRating})!`
    );
  };

  // Render helper for 10 Dashboard Progress Bars in 3 Cards Per Row Grid
  const dashboardMetrics = [
    { label: 'Overall Health', value: health.healthScore, color: 'bg-emerald-500', text: 'text-emerald-400', icon: Heart },
    { label: 'Physical Health', value: health.physicalHealth, color: 'bg-rose-500', text: 'text-rose-400', icon: Stethoscope },
    { label: 'Mental Health', value: health.mentalHealth, color: 'bg-sky-500', text: 'text-sky-400', icon: Smile },
    { label: 'Current Energy', value: health.energy, color: 'bg-amber-500', text: 'text-amber-400', icon: Zap },
    { label: 'Stress Level', value: health.stress, color: 'bg-red-500', text: 'text-red-400', icon: Flame, isNegative: true },
    { label: 'Happiness', value: health.happiness, color: 'bg-pink-500', text: 'text-pink-400', icon: Sparkles },
    { label: 'Burnout Risk', value: health.burnoutRisk, color: 'bg-orange-500', text: 'text-orange-400', icon: AlertTriangle, isNegative: true },
    { label: 'Fitness Level', value: health.fitnessLevel, color: 'bg-purple-500', text: 'text-purple-400', icon: Dumbbell },
    { label: 'Sleep Quality', value: health.sleepQuality, color: 'bg-indigo-500', text: 'text-indigo-400', icon: Moon },
    { label: 'Nutrition Level', value: health.nutritionLevel, color: 'bg-teal-500', text: 'text-teal-400', icon: Apple },
  ];

  const tabList: { id: HealthTab; label: string; icon: any }[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: Heart },
    { id: 'DASHBOARD', label: 'Dashboard', icon: Activity },
    { id: 'INSURANCE', label: 'Insurance', icon: ShieldCheck },
    { id: 'MEDICAL_CENTER', label: 'Medical Center', icon: Stethoscope },
    { id: 'FITNESS', label: 'Fitness', icon: Dumbbell },
    { id: 'MENTAL', label: 'Mental Wellness', icon: Smile },
    { id: 'NUTRITION', label: 'Nutrition', icon: Apple },
    { id: 'SLEEP', label: 'Sleep', icon: Moon },
    { id: 'RECOVERY', label: 'Recovery', icon: Sun },
    { id: 'RECORDS', label: 'Medical Records', icon: FileText },
    { id: 'ANNUAL_REPORT', label: 'Annual Report', icon: Award },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col p-3 sm:p-5 select-none overflow-y-auto pb-28 space-y-4"
      style={{ backgroundColor: theme.background }}
    >
      {/* Navigation Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400" />
          <span>Back to Network</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-400" />
            Beverly Hills Health & Wellness Protocol
          </span>
        </div>
      </div>

      {/* Main Banner */}
      <div
        className="rounded-3xl p-5 border shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-md"
        style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-400/40 shadow-inner">
              <Heart className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">
                PHYSICAL • MENTAL • INSURANCE • FITNESS
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">HEALTH & WELLNESS SUITE</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div className="bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Vitality Index</span>
              <span className="text-lg font-black text-emerald-400">{health.healthScore} / 100</span>
            </div>
            <div className="bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase block">Active Insurance</span>
              <span className="text-xs font-black text-rose-300">{currentInsurance.tier} Plan</span>
            </div>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-white/10 no-scrollbar">
          {tabList.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-lg'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-black shadow-xl text-center animate-fadeIn">
          {feedback}
        </div>
      )}

      {/* OVERVIEW MODE: ALL 10 MODULES IN 3 CARDS PER ROW GRID */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Health System Modules (3 Cards Per Row Grid)
            </span>
            <span className="text-xs text-rose-300 font-bold">100% Real Gameplay Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1: DASHBOARD */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase font-mono">
                    {health.healthScore}/100 Overall
                  </span>
                </div>
                <h3 className="text-base font-black text-white">1. Health Dashboard</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Real-time biometrics for Physical, Mental, Energy, Stress, Burnout & Fitness levels.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                OPEN DASHBOARD
              </button>
            </div>

            {/* CARD 2: MEDICAL CENTER */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase font-mono">
                    9 Treatments
                  </span>
                </div>
                <h3 className="text-base font-black text-white">2. Medical Center</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Checkups, ER care, specialist visits, physical therapy, dental, vision & vaccinations.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('MEDICAL_CENTER')}
                className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                VISIT MEDICAL CENTER
              </button>
            </div>

            {/* CARD 3: HEALTH INSURANCE */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase font-mono">
                    {currentInsurance.coveragePercent}% Coverage
                  </span>
                </div>
                <h3 className="text-base font-black text-white">3. Health Insurance</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  5 Insurance provider tiers (Basic to Executive). Discount hospital bills & speed recovery.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('INSURANCE')}
                className="w-full py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                MANAGE INSURANCE
              </button>
            </div>

            {/* CARD 4: FITNESS */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase font-mono">
                    {health.fitnessLevel}/100 Fitness
                  </span>
                </div>
                <h3 className="text-base font-black text-white">4. Fitness Protocol</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  10 Activities: Gym, Running, Swimming, Yoga, Pilates, Boxing, Martial Arts & Trainers.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('FITNESS')}
                className="w-full py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                TRAIN FITNESS
              </button>
            </div>

            {/* CARD 5: MENTAL WELLNESS */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    <Smile className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase font-mono">
                    {health.mentalHealth}/100 Mental
                  </span>
                </div>
                <h3 className="text-base font-black text-white">5. Mental Wellness</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Therapy, meditation, vacations, reducing workload & family time to prevent burnout.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('MENTAL')}
                className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                WELLNESS & THERAPY
              </button>
            </div>

            {/* CARD 6: NUTRITION */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <Apple className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase font-mono">
                    {currentDiet.name.split(' ')[0]}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">6. Nutrition & Diet</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Balanced, High Protein, Weight Loss, Muscle Gain, Luxury Dining & Healthy Lifestyle diets.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('NUTRITION')}
                className="w-full py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                CHOOSE DIET
              </button>
            </div>

            {/* CARD 7: SLEEP */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Moon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase font-mono">
                    {health.sleepHours} hrs / {health.sleepQuality}%
                  </span>
                </div>
                <h3 className="text-base font-black text-white">7. Sleep & Circadian</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Track sleep quality and fatigue. Sleep early, take power naps, or take weekend rest.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('SLEEP')}
                className="w-full py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                SLEEP RESTORATION
              </button>
            </div>

            {/* CARD 8: RECOVERY */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sun className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase font-mono">
                    7 Spa & Retreats
                  </span>
                </div>
                <h3 className="text-base font-black text-white">8. Recovery & Spa</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Beverly Hills spas, deep tissue massages, Malibu vacations, cryo recovery & family time.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('RECOVERY')}
                className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all cursor-pointer shadow-md"
              >
                RECOVERY SERVICES
              </button>
            </div>

            {/* CARD 9: MEDICAL RECORDS */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-500/20 text-slate-300 border border-slate-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-500/20 text-slate-300 text-[10px] font-black uppercase font-mono">
                    {health.medicalRecords.length} Saved Records
                  </span>
                </div>
                <h3 className="text-base font-black text-white">9. Medical Records</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Permanent medical archive of checkups, ER visits, therapy sessions & insurance claims.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('RECORDS')}
                className="w-full py-2.5 rounded-2xl bg-slate-600 hover:bg-slate-500 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                VIEW MEDICAL LOGS
              </button>
            </div>

            {/* CARD 10: ANNUAL HEALTH REPORT */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all col-span-1 md:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">10. Annual Health Report</h3>
                    <p className="text-xs text-gray-400">
                      Doctor evaluation & lifestyle score generated for Year {player.dateYear || 2026}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('ANNUAL_REPORT')}
                  className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all cursor-pointer shadow-lg"
                >
                  VIEW ANNUAL REPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. HEALTH DASHBOARD (3 CARDS PER ROW GRID) */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Biometric Health Dashboard (10 Core Metrics in 3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-emerald-400 font-bold">Live Updates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardMetrics.map((m, idx) => {
              const IconComp = m.icon;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <IconComp className={`w-5 h-5 ${m.text}`} />
                      </div>
                      <span className="text-xs font-black text-white uppercase">{m.label}</span>
                    </div>
                    <span className={`text-sm font-black font-mono ${m.text}`}>{m.value} / 100</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-black/60 rounded-full border border-white/10 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${m.color}`}
                      style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-gray-400">
                    {m.isNegative
                      ? m.value > 50
                        ? '⚠️ High risk! Requires immediate rest/therapy.'
                        : 'Optimal low risk level.'
                      : m.value > 80
                      ? 'Optimal peak vitality performance.'
                      : m.value > 50
                      ? 'Moderate status. Room for improvement.'
                      : '⚠️ Critical low status! Needs attention.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MEDICAL CENTER (3 CARDS PER ROW GRID) */}
      {activeTab === 'MEDICAL_CENTER' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Beverly Hills Medical Center Treatments (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-rose-300 font-bold">
              Insurance Discount: {currentInsurance ? `${currentInsurance.coveragePercent}%` : '0%'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {medicalCenterTreatments.map((tr, idx) => {
              const coverage = currentInsurance ? currentInsurance.coveragePercent : 0;
              const coveredAmt = Math.floor((tr.baseCost * coverage) / 100);
              const outOfPocket = tr.baseCost - coveredAmt;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-rose-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                        {tr.type}
                      </span>
                      <span className="text-xs font-black text-emerald-400 font-mono">
                        ${outOfPocket.toLocaleString()} Out-of-Pocket
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white">{tr.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{tr.notes}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-[11px] font-mono text-gray-400">
                      <span>Full Base Cost:</span>
                      <span>${tr.baseCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-emerald-400">
                      <span>Insurance Covered ({coverage}%):</span>
                      <span>-${coveredAmt.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleReceiveTreatment(tr)}
                      className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all cursor-pointer shadow-md mt-1"
                    >
                      SCHEDULE TREATMENT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. HEALTH INSURANCE (3 CARDS PER ROW GRID) */}
      {activeTab === 'INSURANCE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Health Insurance Providers & Tiers (3 Cards Per Row Grid)
            </h3>
            {health.activeInsurancePlanId && (
              <button
                onClick={handleCancelInsurance}
                className="text-xs font-bold text-red-400 hover:underline cursor-pointer"
              >
                Cancel Insurance Policy
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HEALTH_INSURANCE_PLANS.map((plan) => {
              const isActive = health.activeInsurancePlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500/15 shadow-2xl'
                      : 'border-white/10 bg-black/60 hover:bg-black/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                        {plan.tier} PLAN
                      </span>
                      {isActive && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white">{plan.providerName}</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{plan.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Hospital Coverage:</span>
                      <span className="text-emerald-400 font-bold">{plan.coveragePercent}% Covered</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Recovery Speed:</span>
                      <span className="text-indigo-300 font-bold">+{plan.recoverySpeedBonusPercent}%</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Weekly Premium:</span>
                      <span className="text-amber-300 font-bold">${plan.weeklyCost.toLocaleString()}/wk</span>
                    </div>

                    <button
                      disabled={isActive}
                      onClick={() => handleSelectInsurance(plan)}
                      className={`w-full py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-md mt-2 ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                          : 'bg-indigo-500 hover:bg-indigo-400 text-white'
                      }`}
                    >
                      {isActive ? 'CURRENT PROVIDER' : 'SWITCH TO THIS PLAN'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. FITNESS PROTOCOL (3 CARDS PER ROW GRID) */}
      {activeTab === 'FITNESS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Fitness & Conditioning Activities (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-purple-300 font-bold">Fitness Level: {health.fitnessLevel}/100</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fitnessActivities.map((act, idx) => {
              const IconComp = act.icon;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-purple-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-purple-300 font-mono">
                        {act.cost === 0 ? 'FREE' : `$${act.cost}`}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white">{act.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{act.desc}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Fitness Boost:</span>
                      <span className="text-purple-300 font-bold">+{act.fitnessBoost}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Max Energy Bonus:</span>
                      <span className="text-amber-300 font-bold">+{act.energyMaxBoost}</span>
                    </div>

                    <button
                      onClick={() => handlePerformFitness(act)}
                      className="w-full py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition-all cursor-pointer shadow-md mt-1"
                    >
                      TRAIN NOW
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. MENTAL WELLNESS (3 CARDS PER ROW GRID) */}
      {activeTab === 'MENTAL' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Mental Wellness & Therapy (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-sky-300 font-bold">Mental: {health.mentalHealth}/100 • Stress: {health.stress}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mentalActivities.map((act, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-sky-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase">
                      MENTAL RESET
                    </span>
                    <span className="text-xs font-black text-sky-300 font-mono">
                      {act.cost === 0 ? 'FREE' : `$${act.cost.toLocaleString()}`}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">{act.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{act.desc}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Mental Health:</span>
                    <span className="text-sky-300 font-bold">+{act.mentalBoost}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Stress Reduced:</span>
                    <span className="text-emerald-400 font-bold">-{act.stressReduce}%</span>
                  </div>

                  <button
                    onClick={() => handlePerformMental(act)}
                    className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs transition-all cursor-pointer shadow-md mt-1"
                  >
                    START SESSION
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. NUTRITION (3 CARDS PER ROW GRID) */}
      {activeTab === 'NUTRITION' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Nutrition Diets & Lifestyle Plans (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-teal-300 font-bold">Active Diet: {currentDiet.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIET_OPTIONS.map((diet) => {
              const isActive = health.activeDietId === diet.id;

              return (
                <div
                  key={diet.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                    isActive
                      ? 'border-teal-500 bg-teal-500/15 shadow-2xl'
                      : 'border-white/10 bg-black/60 hover:bg-black/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase">
                        DIET PLAN
                      </span>
                      {isActive && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-white">{diet.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{diet.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Physical Vitality Boost:</span>
                      <span className="text-teal-300 font-bold">+{diet.physicalBonus}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">Weekly Expense:</span>
                      <span className="text-amber-300 font-bold">${diet.cost}/wk</span>
                    </div>

                    <button
                      disabled={isActive}
                      onClick={() => handleSelectDiet(diet)}
                      className={`w-full py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-md mt-2 ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                          : 'bg-teal-500 hover:bg-teal-400 text-white'
                      }`}
                    >
                      {isActive ? 'CURRENT DIET' : 'ADOPT DIET PLAN'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. SLEEP & CIRCADIAN (3 CARDS PER ROW GRID) */}
      {activeTab === 'SLEEP' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Sleep Restoration Actions (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-blue-300 font-bold">Sleep Quality: {health.sleepQuality}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sleepActions.map((act, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-blue-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase">
                      SLEEP RESTORATION
                    </span>
                    <span className="text-xs font-black text-blue-300 font-mono">{act.hours} Hours</span>
                  </div>

                  <h3 className="text-base font-black text-white">{act.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{act.desc}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Energy Restored:</span>
                    <span className="text-amber-300 font-bold">+{act.energyRestore}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Sleep Quality Boost:</span>
                    <span className="text-blue-300 font-bold">+{act.qualityBoost}%</span>
                  </div>

                  <button
                    onClick={() => handlePerformSleep(act)}
                    className="w-full py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs transition-all cursor-pointer shadow-md mt-1"
                  >
                    SLEEP NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. RECOVERY & SPA (3 CARDS PER ROW GRID) */}
      {activeTab === 'RECOVERY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Recovery Centers & Spas (3 Cards Per Row Grid)
            </h3>
            <span className="text-xs text-amber-300 font-bold">Stress Level: {health.stress}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recoveryMethods.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                      RECOVERY
                    </span>
                    <span className="text-xs font-black text-amber-300 font-mono">
                      {m.cost === 0 ? 'FREE' : `$${m.cost.toLocaleString()}`}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">{m.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Energy Restored:</span>
                    <span className="text-amber-300 font-bold">+{m.energyBoost}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Stress Reduced:</span>
                    <span className="text-emerald-400 font-bold">-{m.stressReduce}%</span>
                  </div>

                  <button
                    onClick={() => handlePerformRecovery(m)}
                    className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all cursor-pointer shadow-md mt-1"
                  >
                    BOOK RECOVERY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. MEDICAL RECORDS (3 CARDS PER ROW GRID) */}
      {activeTab === 'RECORDS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Permanent Medical Archive ({health.medicalRecords.length} Saved Logs)
            </h3>
            <span className="text-xs text-slate-300 font-bold">100% Permanently Preserved</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {health.medicalRecords.length === 0 ? (
              <div className="p-8 rounded-3xl border border-white/10 bg-black/60 text-center text-xs text-gray-400 col-span-3">
                No medical records saved yet. Complete checkups or treatments at the Medical Center!
              </div>
            ) : (
              health.medicalRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase">
                        {rec.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Week {rec.week}, {rec.year}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white">{rec.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed italic">"{rec.doctorNotes}"</p>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-white/10 text-[11px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Total Cost:</span>
                      <span>${rec.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Insurance Paid:</span>
                      <span>${rec.insuranceCoveredAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold">
                      <span>Out of Pocket:</span>
                      <span>${rec.outOfPocket.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 10. ANNUAL HEALTH REPORT (3 CARDS PER ROW GRID) */}
      {activeTab === 'ANNUAL_REPORT' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Annual Doctor Health Reports (3 Cards Per Row Grid)
            </h3>
            <button
              onClick={handleGenerateAnnualReport}
              className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> GENERATE REPORT FOR YEAR {player.dateYear || 2026}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {health.annualReports.map((rep, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase font-mono">
                      YEAR {rep.year} EVALUATION
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                      {rep.lifestyleRating}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Overall Health Score</span>
                    <span className="text-2xl font-black text-white font-mono">{rep.overallScore} / 100</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Physical Score:</span>
                      <span className="text-rose-400 font-bold">{rep.physicalScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mental Score:</span>
                      <span className="text-sky-300 font-bold">{rep.mentalScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fitness Score:</span>
                      <span className="text-purple-300 font-bold">{rep.fitnessScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sleep Score:</span>
                      <span className="text-indigo-300 font-bold">{rep.sleepScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-white/10">
                  <span className="text-[10px] font-black text-rose-300 uppercase block">Doctor Recommendations</span>
                  <ul className="text-[11px] text-gray-300 space-y-1 list-disc list-inside">
                    {rep.doctorRecommendations.map((rec, rIdx) => (
                      <li key={rIdx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
