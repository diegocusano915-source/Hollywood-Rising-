/**
 * HOLLYWOOD RISING - How To Play & Tutorial Modal
 * Interactive tutorial explaining the complete core gameplay loop.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  BookOpen,
  User,
  Zap,
  Film,
  Clock,
  Video,
  TrendingUp,
  ShieldCheck,
  Heart,
  Mail,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const HowToPlayModal: React.FC = () => {
  const { setActiveModal, updateSettings, settings } = useGame();
  const [step, setStep] = useState<number>(0);
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const tutorialSteps = [
    {
      title: '1. Character Creation',
      icon: <User className="w-8 h-8 text-amber-400" />,
      description: 'Choose your actor name, age, gender, country, and personality. You start in Hollywood with $2,500 savings, 100 Energy, 0 Fans, and 0 Fame.',
    },
    {
      title: '2. Energy & Weekly Loop',
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      description: 'Applying for movie roles costs 20 Energy. Each week when you click "End Week", your Energy recharges to 100, living expenses are paid, and audition countdowns advance.',
    },
    {
      title: '3. Callboard & Auditions',
      icon: <Film className="w-8 h-8 text-amber-400" />,
      description: 'Browse 4-6 weekly movie projects on the Callboard. Apply to move scripts into pending Auditions. No fake success percentages are shown—decisions take 3 to 40 weeks to process.',
    },
    {
      title: '4. Decision Results & Inbox',
      icon: <Clock className="w-8 h-8 text-amber-400" />,
      description: 'When an audition timer reaches zero, you receive an official Acceptance or Rejection letter in your Inbox under CASTING. Accepted roles automatically enter Production Hub.',
    },
    {
      title: '5. Production Hub & Cast Management',
      icon: <Video className="w-8 h-8 text-amber-400" />,
      description: 'Filming takes multiple weeks. Manage cast chemistry, director relations, schedule activities, press promotion, and contract terms directly in Production Hub.',
    },
    {
      title: '6. Movie Releases & Box Office',
      icon: <TrendingUp className="w-8 h-8 text-amber-400" />,
      description: 'Completed films hit theaters worldwide! Track opening weekend, domestic/worldwide gross, audience/critic ratings, and box office rank.',
    },
    {
      title: '7. SAG-AFTRA Guild Membership',
      icon: <ShieldCheck className="w-8 h-8 text-amber-400" />,
      description: 'Membership requires $2,000 AND 4 completed Principal or Lead Roles. Unlocks professional auditions and major studio contracts.',
    },
    {
      title: '8. Dating & Relationships',
      icon: <Heart className="w-8 h-8 text-rose-400" />,
      description: 'Create a dating profile, review singles with Interested/Pass, send luxury gifts, progress from Dating to Marriage and start a family.',
    },
    {
      title: '9. Organized Inbox',
      icon: <Mail className="w-8 h-8 text-amber-400" />,
      description: 'Stay updated across 5 strictly defined categories: CASTING, RELATIONSHIPS, FINANCE, TUTORIAL, and BUSINESS.',
    },
  ];

  const current = tutorialSteps[step];

  const handleFinish = () => {
    updateSettings({ hasSeenTutorial: true });
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between border-b"
          style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">How To Play Guide</h2>
          </div>
          <button
            onClick={handleFinish}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            {current.icon}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">{current.title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
              {current.description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 pt-2">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === idx ? 'bg-amber-400 w-5' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/30">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 hover:bg-white/10 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < tutorialSteps.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(tutorialSteps.length - 1, s + 1))}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black flex items-center gap-1 cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer"
            >
              Start Playing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
