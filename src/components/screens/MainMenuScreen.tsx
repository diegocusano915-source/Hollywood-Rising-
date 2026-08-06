/**
 * HOLLYWOOD RISING - Main Menu Screen
 * Clean luxury aesthetic with AAA footer component.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, UserPlus, Settings, HelpCircle, Crown, Map, FileText } from 'lucide-react';
import { THEMES } from '../../theme/colors';
import { Footer } from '../common/Footer';

export const MainMenuScreen: React.FC = () => {
  const { setCurrentScreen, setActiveModal, player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  return (
    <div
      className="relative w-full min-h-full flex flex-col justify-between select-none overflow-y-auto"
      style={{ backgroundColor: theme.background }}
    >
      {/* Background Graphic Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header / Title */}
      <div className="pt-10 p-6 text-center z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase shadow-lg">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Hollywood Actor Simulator</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 tracking-tight drop-shadow-2xl">
          HOLLYWOOD RISING
        </h1>
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">
          A Film Industry Career & Entertainment Empire Simulation
        </p>
      </div>

      {/* Main Actions */}
      <div className="w-full max-w-sm mx-auto space-y-3 z-10 my-auto px-6">
        <button
          onClick={() => setCurrentScreen('character_creation')}
          className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: theme.primary,
            color: '#000000',
          }}
        >
          <UserPlus className="w-5 h-5" />
          NEW GAME
        </button>

        {player && player.firstName && (
          <button
            onClick={() => setCurrentScreen('game_home')}
            className="w-full py-3.5 rounded-2xl font-bold text-xs tracking-wide bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Play className="w-4 h-4 fill-current text-amber-400" />
            CONTINUE ({player.firstName} {player.lastName})
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveModal('how_to_play')}
            className="py-3 rounded-xl font-bold text-xs bg-black/40 hover:bg-black/60 text-gray-300 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>HOW TO PLAY</span>
          </button>

          <button
            onClick={() => setActiveModal('settings')}
            className="py-3 rounded-xl font-bold text-xs bg-black/40 hover:bg-black/60 text-gray-300 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>SETTINGS</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveModal('roadmap')}
            className="py-2.5 rounded-xl font-bold text-[11px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>ROADMAP</span>
          </button>

          <button
            onClick={() => setActiveModal('changelog')}
            className="py-2.5 rounded-xl font-bold text-[11px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>PATCH NOTES</span>
          </button>
        </div>
      </div>

      {/* AAA Footer Component */}
      <Footer className="z-10 mt-8" />
    </div>
  );
};
