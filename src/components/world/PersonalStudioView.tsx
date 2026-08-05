/**
 * HOLLYWOOD RISING - Personal Studio View (Phase 3 Revision)
 * Strict Unlocking & Step-by-Step Production Pipeline:
 * 1. Checks PERSONAL_STUDIO_UNLOCKED (Career Level, Net Worth, Manager, Lead Roles).
 * 2. Unlocked view has Tabs: Development, Production, Release, History.
 * 3. Step-by-Step Launch Studio Pipeline:
 *    Type -> Buy Script -> Genre -> Budget -> Development -> Hire Actors -> Location -> Studio -> Production -> Release Strategy.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { PersonalStudioProject } from '../../types/world';
import {
  Film,
  Plus,
  ArrowLeft,
  DollarSign,
  MapPin,
  Users,
  Building2,
  Globe,
  CheckCircle2,
  XCircle,
  Lock,
  Clock,
  Sparkles,
  ChevronRight,
  Tv,
  Award,
  Clapperboard,
  Play,
  Check,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

interface PersonalStudioViewProps {
  onBack: () => void;
}

export type StudioTab = 'DEVELOPMENT' | 'PRODUCTION' | 'RELEASE' | 'HISTORY';

export interface DetailedStudioProject extends PersonalStudioProject {
  scriptTier?: 'Spec Script ($25k)' | 'Bestseller Adaptation ($100k)' | 'Studio Franchise ($300k)';
  genre?: string;
  leadActor?: string;
  coStar?: string;
  soundstage?: string;
  boxOfficeGross?: number;
  developmentWeeksDone: number;
  developmentWeeksTotal: number;
  productionWeeksDone: number;
  productionWeeksTotal: number;
}

export const PersonalStudioView: React.FC<PersonalStudioViewProps> = ({ onBack }) => {
  const { player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  // UNLOCKING REQUIREMENTS CHECK
  const hasCareerLevel = player.fameXp >= 100 || ((player as any).level && (player as any).level >= 5);
  const hasNetWorth = (player.money || 0) >= 1000000;
  const hasManager = !!player.representation?.manager;
  const totalPrincipalRoles = (player.principalRolesCount || 0) + (player.leadRolesCount || 0);
  const hasLeadRoles = totalPrincipalRoles >= 4;

  const isPersonalStudioUnlocked = hasCareerLevel && hasNetWorth && hasManager && hasLeadRoles;

  // Tabs State
  const [activeTab, setActiveTab] = useState<StudioTab>('DEVELOPMENT');

  // Projects State
  const [projects, setProjects] = useState<DetailedStudioProject[]>([]);

  // Modals & Wizard State
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [showLaunchWizard, setShowLaunchWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1); // Step 1: Type & Title, Step 2: Script, Genre, Budget

  // Launch Wizard Form Data
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Movie' | 'Series'>('Movie');
  const [scriptTier, setScriptTier] = useState<'Spec Script ($25k)' | 'Bestseller Adaptation ($100k)' | 'Studio Franchise ($300k)'>('Spec Script ($25k)');
  const [genre, setGenre] = useState('Action');
  const [budget, setBudget] = useState(1000000);

  // Production Setup Modal State (for moving Dev -> Prod)
  const [setupProject, setSetupProject] = useState<DetailedStudioProject | null>(null);
  const [leadActor, setLeadActor] = useState('Player (Lead Actor)');
  const [coStar, setCoStar] = useState('A-List Co-Star ($250,000)');
  const [location, setLocation] = useState('Los Angeles, California');
  const [soundstage, setSoundstage] = useState('Warner Bros Soundstage ($100,000)');

  // Release Setup Modal State (for moving Prod -> Release)
  const [releaseProject, setReleaseProject] = useState<DetailedStudioProject | null>(null);
  const [releaseStrategy, setReleaseStrategy] = useState<'Theatrical' | 'Streaming' | 'Worldwide'>('Worldwide');

  const [feedback, setFeedback] = useState<string | null>(null);

  // STEP 1 & 2: LAUNCH STUDIO INTO DEVELOPMENT
  const handleStartDevelopment = () => {
    if (!title.trim()) {
      setFeedback('Please enter a production title.');
      return;
    }

    const scriptCost = scriptTier.includes('300k') ? 300000 : scriptTier.includes('100k') ? 100000 : 25000;
    const totalDevCost = scriptCost + budget;

    if ((player.money || 0) < totalDevCost) {
      setFeedback(`Insufficient funds! Need $${totalDevCost.toLocaleString()} for script purchase & development budget.`);
      return;
    }

    const newProject: DetailedStudioProject = {
      id: `proj_${Date.now()}`,
      title,
      type,
      budget,
      scriptTier,
      genre,
      cast: ['Player (Lead)'],
      location: 'TBD',
      studioName: `${player.firstName} ${player.lastName} Productions`,
      phase: 'Development',
      releaseStrategy: 'Worldwide',
      progressWeeks: 0,
      totalWeeks: 4,
      developmentWeeksDone: 0,
      developmentWeeksTotal: 4,
      productionWeeksDone: 0,
      productionWeeksTotal: 6,
    };

    setProjects([newProject, ...projects]);
    setShowLaunchWizard(false);
    setWizardStep(1);
    setTitle('');
    setFeedback(`DEVELOPMENT BEGUN: "${title}" is now in Script Development!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // ADVANCE DEVELOPMENT WEEK
  const handleAdvanceDevelopment = (projId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projId) {
          const nextWeeks = p.developmentWeeksDone + 1;
          return {
            ...p,
            developmentWeeksDone: nextWeeks,
            progressWeeks: nextWeeks,
          };
        }
        return p;
      })
    );
  };

  // COMMENCE PRODUCTION (Hiring Actors, Location, Studio)
  const handleCommenceProduction = () => {
    if (!setupProject) return;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === setupProject.id) {
          return {
            ...p,
            phase: 'Production',
            leadActor,
            coStar,
            location,
            soundstage,
            cast: ['Player (Lead)', coStar],
            progressWeeks: 0,
            totalWeeks: 6,
          };
        }
        return p;
      })
    );

    setSetupProject(null);
    setActiveTab('PRODUCTION');
    setFeedback(`FILMING COMMENCED: "${setupProject.title}" is now shooting on location!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // ADVANCE PRODUCTION WEEK
  const handleAdvanceProduction = (projId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projId) {
          const nextWeeks = p.productionWeeksDone + 1;
          return {
            ...p,
            productionWeeksDone: nextWeeks,
            progressWeeks: nextWeeks,
          };
        }
        return p;
      })
    );
  };

  // COMMENCE GLOBAL RELEASE
  const handleExecuteRelease = () => {
    if (!releaseProject) return;

    const multiplier = releaseStrategy === 'Worldwide' ? 3.5 : releaseStrategy === 'Theatrical' ? 2.8 : 2.0;
    const gross = Math.floor(releaseProject.budget * multiplier + Math.random() * 2000000);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === releaseProject.id) {
          return {
            ...p,
            phase: 'Released',
            releaseStrategy,
            boxOfficeGross: gross,
          };
        }
        return p;
      })
    );

    setReleaseProject(null);
    setActiveTab('HISTORY');
    setFeedback(`PREMIERE SUCCESS: "${releaseProject.title}" released globally! Generated $${gross.toLocaleString()} Box Office!`);
    setTimeout(() => setFeedback(null), 5000);
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
          <Film className="w-4 h-4 text-amber-400" />
          Personal Movie & TV Studio
        </span>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
          {feedback}
        </div>
      )}

      {/* STRICT CHECK: IF PERSONAL STUDIO IS LOCKED -> RENDER ONLY LOCKED VIEW */}
      {!isPersonalStudioUnlocked ? (
        <div className="p-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 text-center space-y-5 max-w-xl mx-auto shadow-2xl backdrop-blur-md my-8">
          <div className="p-4 rounded-full bg-rose-500/20 border border-rose-500/40 w-16 h-16 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8 text-rose-400" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black text-rose-400 uppercase tracking-widest">PERSONAL STUDIO</span>
            <h2 className="text-3xl font-black text-white">LOCKED</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Operating an independent Hollywood production studio requires established star status, capital, personal manager representation, and proven lead role credits.
            </p>
          </div>

          <div className="p-4.5 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2.5 text-xs">
            <span className="font-extrabold text-amber-300 uppercase block text-[10px]">Requirements to Launch Studio:</span>

            <div className="flex items-center gap-2">
              {hasCareerLevel ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className={hasCareerLevel ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                Reach Career Level 5 / A-List Star {hasCareerLevel ? '(COMPLETED)' : '(LOCKED)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasNetWorth ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className={hasNetWorth ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                Earn $1,000,000 Net Worth (${(player.money || 0).toLocaleString()} / $1,000,000)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasManager ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className={hasManager ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                Hire a Personal Manager {hasManager ? '(COMPLETED)' : '(LOCKED)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasLeadRoles ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className={hasLeadRoles ? 'text-emerald-300 font-bold' : 'text-gray-400'}>
                Complete 4 Principal / Lead Roles ({totalPrincipalRoles} / 4)
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowRequirementsModal(true)}
            className="px-6 py-3.5 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-105 transition-all cursor-pointer shadow-xl uppercase tracking-wider"
          >
            VIEW REQUIREMENTS
          </button>
        </div>
      ) : (
        /* UNLOCKED: MAIN STUDIO DASHBOARD */
        <div className="space-y-5">
          {/* Header Banner */}
          <div
            className="rounded-3xl p-6 border shadow-2xl space-y-2 relative overflow-hidden"
            style={{
              backgroundColor: theme.headers,
              borderColor: theme.borderDark,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40">
                  <Film className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">
                    {player.firstName} {player.lastName} Productions
                  </h1>
                  <p className="text-xs text-amber-300 font-medium">
                    Manage studio development, hire cast, choose filming locations, and release global feature films & TV series.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLaunchWizard(true)}
                className="px-5 py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-105 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Launch Studio
              </button>
            </div>
          </div>

          {/* MAIN MENU TABS */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
            {(['DEVELOPMENT', 'PRODUCTION', 'RELEASE', 'HISTORY'] as StudioTab[]).map((tab) => {
              const count = projects.filter((p) => {
                if (tab === 'DEVELOPMENT') return p.phase === 'Development';
                if (tab === 'PRODUCTION') return p.phase === 'Production';
                if (tab === 'RELEASE') return p.phase === 'Post-Production';
                if (tab === 'HISTORY') return p.phase === 'Released';
                return false;
              }).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-amber-400 text-black shadow-lg'
                      : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {/* TAB 1: DEVELOPMENT */}
          {activeTab === 'DEVELOPMENT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 uppercase">
                  Script Development Phase
                </span>
                <span className="text-[10px] text-gray-400">Buying script, genre selection & development progress</span>
              </div>

              {projects.filter((p) => p.phase === 'Development').length === 0 ? (
                <div className="p-10 rounded-3xl border border-white/10 bg-black/40 text-center space-y-3">
                  <Film className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-base font-black text-white">No Projects in Development</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Click "Launch Studio" above to buy a script and begin developing your first movie or TV series!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => p.phase === 'Development')
                    .map((p) => {
                      const isDevComplete = p.developmentWeeksDone >= p.developmentWeeksTotal;
                      return (
                        <div key={p.id} className="p-5 rounded-3xl border border-amber-400/30 bg-black/50 space-y-4 shadow-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300">
                              {p.type} • {p.genre}
                            </span>
                            <span className="text-[10px] font-black text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded">
                              DEVELOPMENT PHASE
                            </span>
                          </div>

                          <h2 className="text-xl font-black text-white">{p.title}</h2>

                          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-xs space-y-1">
                            <div>Script Tier: <strong className="text-amber-300">{p.scriptTier}</strong></div>
                            <div>Development Budget: <strong className="text-emerald-400">${p.budget.toLocaleString()}</strong></div>
                            <div>Development Weeks: <strong className="text-sky-300">{p.developmentWeeksDone} / {p.developmentWeeksTotal} Wks</strong></div>
                          </div>

                          {!isDevComplete ? (
                            <button
                              onClick={() => handleAdvanceDevelopment(p.id)}
                              className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                            >
                              <Clock className="w-4 h-4" />
                              Advance Development Week ({p.developmentWeeksDone + 1}/{p.developmentWeeksTotal})
                            </button>
                          ) : (
                            <button
                              onClick={() => setSetupProject(p)}
                              className="w-full py-3 rounded-2xl font-black text-xs bg-emerald-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Development Complete! Move to Production Phase
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTION */}
          {activeTab === 'PRODUCTION' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 uppercase">
                  Filming & Production Phase
                </span>
                <span className="text-[10px] text-gray-400">Hire actors, select filming locations & soundstages</span>
              </div>

              {projects.filter((p) => p.phase === 'Production').length === 0 ? (
                <div className="p-10 rounded-3xl border border-white/10 bg-black/40 text-center space-y-3">
                  <Clapperboard className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-base font-black text-white">No Active Productions Shooting</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Projects in Development must complete script development before entering Production phase.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => p.phase === 'Production')
                    .map((p) => {
                      const isProdComplete = p.productionWeeksDone >= p.productionWeeksTotal;
                      return (
                        <div key={p.id} className="p-5 rounded-3xl border border-purple-400/30 bg-black/50 space-y-4 shadow-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-purple-500/20 text-purple-300">
                              {p.type} • SHOOTING
                            </span>
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded">
                              PRODUCTION PHASE
                            </span>
                          </div>

                          <h2 className="text-xl font-black text-white">{p.title}</h2>

                          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/60 border border-white/10 text-[10px]">
                            <div>
                              <span className="text-gray-400 block font-bold">Lead Actor</span>
                              <span className="font-black text-amber-300">{p.leadActor}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block font-bold">Co-Star</span>
                              <span className="font-black text-sky-300">{p.coStar}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block font-bold">Location</span>
                              <span className="font-black text-emerald-400">{p.location}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block font-bold">Studio Stage</span>
                              <span className="font-black text-purple-300">{p.soundstage}</span>
                            </div>
                          </div>

                          {!isProdComplete ? (
                            <button
                              onClick={() => handleAdvanceProduction(p.id)}
                              className="w-full py-3 rounded-2xl font-black text-xs bg-purple-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                            >
                              <Clapperboard className="w-4 h-4" />
                              Advance Filming Shooting Week ({p.productionWeeksDone + 1}/{p.productionWeeksTotal})
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                // Move to Post-Production / Release Setup
                                setProjects((prev) =>
                                  prev.map((proj) =>
                                    proj.id === p.id ? { ...proj, phase: 'Post-Production' } : proj
                                  )
                                );
                                setReleaseProject(p);
                                setActiveTab('RELEASE');
                              }}
                              className="w-full py-3 rounded-2xl font-black text-xs bg-emerald-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Production Complete! Move to Release Phase
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RELEASE */}
          {activeTab === 'RELEASE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 uppercase">
                  Global Release Strategy
                </span>
                <span className="text-[10px] text-gray-400">Select distribution: Theatrical, Streaming or Worldwide</span>
              </div>

              {projects.filter((p) => p.phase === 'Post-Production').length === 0 ? (
                <div className="p-10 rounded-3xl border border-white/10 bg-black/40 text-center space-y-3">
                  <Globe className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-base font-black text-white">No Productions Ready for Release</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Projects must finish Production filming before global release strategies can be executed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => p.phase === 'Post-Production')
                    .map((p) => (
                      <div key={p.id} className="p-5 rounded-3xl border border-emerald-400/30 bg-black/50 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300">
                            READY FOR PREMIERE
                          </span>
                        </div>

                        <h2 className="text-xl font-black text-white">{p.title}</h2>

                        <p className="text-xs text-gray-300">
                          Filming complete! Select global distribution strategy to launch box office distribution.
                        </p>

                        <button
                          onClick={() => setReleaseProject(p)}
                          className="w-full py-3 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                        >
                          <Globe className="w-4 h-4" />
                          Set Release Strategy & Launch Premiere
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTORY / PROJECTS */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 uppercase">
                  Completed Studio Catalog
                </span>
              </div>

              {projects.filter((p) => p.phase === 'Released').length === 0 ? (
                <div className="p-10 rounded-3xl border border-white/10 bg-black/40 text-center space-y-3">
                  <Award className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-base font-black text-white">No Released Studio Movies Yet</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Completed productions and box office revenue reports will appear here after premiere.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => p.phase === 'Released')
                    .map((p) => (
                      <div key={p.id} className="p-5 rounded-3xl border border-white/10 bg-black/50 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300">
                            {p.type} • RELEASED
                          </span>
                          <span className="text-[10px] font-black text-emerald-400">
                            {p.releaseStrategy}
                          </span>
                        </div>

                        <h2 className="text-xl font-black text-white">{p.title}</h2>

                        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/60 border border-white/5 text-[10px]">
                          <div>
                            <span className="text-gray-400 block font-bold">Budget</span>
                            <span className="font-black text-white">${p.budget.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-bold">Box Office / Earnings</span>
                            <span className="font-black text-emerald-400">${(p.boxOfficeGross || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* REQUIREMENTS MODAL */}
      {showRequirementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-md rounded-3xl border border-amber-400/40 p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: theme.headers }}
          >
            <h2 className="text-xl font-black text-white">Personal Studio Requirements</h2>
            <p className="text-xs text-gray-300">
              To operate a full-scale movie studio, you must establish your Hollywood credentials across all core milestones.
            </p>

            <div className="space-y-2 text-xs p-4 rounded-2xl bg-black/60 border border-white/10">
              <div className="flex items-center justify-between">
                <span>Career Level 5 / A-List Status</span>
                <span className={hasCareerLevel ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {hasCareerLevel ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>$1,000,000 Net Worth</span>
                <span className={hasNetWorth ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {hasNetWorth ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Personal Manager Signed</span>
                <span className={hasManager ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {hasManager ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>4 Lead Roles Completed</span>
                <span className={hasLeadRoles ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {hasLeadRoles ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowRequirementsModal(false)}
              className="w-full py-3 rounded-xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* LAUNCH STUDIO STEP WIZARD (STEP 1: TYPE/TITLE -> STEP 2: SCRIPT/GENRE/BUDGET) */}
      {showLaunchWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-lg rounded-3xl border border-amber-400/40 p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: theme.headers }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black text-amber-400 uppercase">
                Launch Studio • Step {wizardStep} of 2
              </span>
              <button
                onClick={() => {
                  setShowLaunchWizard(false);
                  setWizardStep(1);
                }}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Production Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Paramount Echoes, Sunset Blvd Reborn..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Production Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Movie', 'Series'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`py-3 rounded-xl text-xs font-black cursor-pointer transition-all ${
                          type === t ? 'bg-amber-400 text-black shadow-lg' : 'bg-black/50 text-gray-400 border border-white/10'
                        }`}
                      >
                        Feature {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!title.trim()) {
                      setFeedback('Please enter a title to proceed.');
                      return;
                    }
                    setWizardStep(2);
                  }}
                  className="w-full py-3.5 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-1.5"
                >
                  Proceed to Script & Development <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Buy Script</label>
                  <select
                    value={scriptTier}
                    onChange={(e) => setScriptTier(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs"
                  >
                    <option value="Spec Script ($25k)">Original Spec Script ($25,000)</option>
                    <option value="Bestseller Adaptation ($100k)">Bestseller Adaptation ($100,000)</option>
                    <option value="Studio Franchise ($300k)">Studio Franchise Script ($300,000)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs"
                  >
                    <option value="Action">Action / Thriller</option>
                    <option value="Drama">Prestige Drama</option>
                    <option value="Sci-Fi">Sci-Fi Epic</option>
                    <option value="Comedy">Hollywood Comedy</option>
                    <option value="Horror">Supernatural Horror</option>
                    <option value="Romance">Romantic Feature</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Development Budget ($)</label>
                  <input
                    type="number"
                    step={100000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-3.5 rounded-2xl font-bold text-xs bg-black/60 text-gray-400 border border-white/10"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartDevelopment}
                    className="flex-1 py-3.5 rounded-2xl font-black text-xs bg-amber-400 text-black hover:scale-102 transition-all cursor-pointer shadow-xl"
                  >
                    Commence Script Development
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PRODUCTION SETUP MODAL (HIRING ACTORS, LOCATIONS, SOUNDSTAGES) */}
      {setupProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-lg rounded-3xl border border-purple-400/40 p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: theme.headers }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black text-purple-300 uppercase">
                Production Phase Setup: {setupProject.title}
              </span>
              <button
                onClick={() => setSetupProject(null)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1">Hire Co-Star</label>
                <select
                  value={coStar}
                  onChange={(e) => setCoStar(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white"
                >
                  <option value="A-List Co-Star ($250,000)">A-List Co-Star ($250,000)</option>
                  <option value="Veteran Character Actor ($100,000)">Veteran Character Actor ($100,000)</option>
                  <option value="Rising Breakout Talent ($35,000)">Rising Breakout Talent ($35,000)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Choose Filming Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white"
                >
                  <option value="Los Angeles, California">Los Angeles, California (USA)</option>
                  <option value="Atlanta, Georgia">Atlanta, Georgia (USA)</option>
                  <option value="London, England">London, England (UK)</option>
                  <option value="Vancouver, BC">Vancouver, BC (Canada)</option>
                  <option value="Tokyo, Japan">Tokyo, Japan</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Choose Studio Soundstage</label>
                <select
                  value={soundstage}
                  onChange={(e) => setSoundstage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white"
                >
                  <option value="Warner Bros Soundstage ($100,000)">Warner Bros Soundstage ($100,000)</option>
                  <option value="Universal Backlot ($85,000)">Universal Backlot ($85,000)</option>
                  <option value="Pinewood Studios ($120,000)">Pinewood Studios ($120,000)</option>
                  <option value="Sunset Gower Stages ($60,000)">Sunset Gower Stages ($60,000)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCommenceProduction}
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-purple-400 text-black hover:scale-102 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <Clapperboard className="w-4 h-4" />
              Commence Shooting & Production
            </button>
          </div>
        </div>
      )}

      {/* RELEASE SETUP MODAL */}
      {releaseProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className="w-full max-w-lg rounded-3xl border border-emerald-400/40 p-6 space-y-4 shadow-2xl relative"
            style={{ backgroundColor: theme.headers }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black text-emerald-300 uppercase">
                Release Strategy: {releaseProject.title}
              </span>
              <button
                onClick={() => setReleaseProject(null)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Select your global release strategy to launch distribution and generate box office revenue.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(['Theatrical', 'Streaming', 'Worldwide'] as const).map((rs) => (
                <button
                  key={rs}
                  type="button"
                  onClick={() => setReleaseStrategy(rs)}
                  className={`py-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    releaseStrategy === rs ? 'bg-amber-400 text-black shadow-lg' : 'bg-black/50 text-gray-400 border border-white/10'
                  }`}
                >
                  {rs}
                </button>
              ))}
            </div>

            <button
              onClick={handleExecuteRelease}
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-emerald-400 text-black hover:scale-102 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Execute Premiere & Release
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
