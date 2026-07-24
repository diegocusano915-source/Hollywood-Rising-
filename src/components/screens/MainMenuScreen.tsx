/**
 * HOLLYWOOD RISING - Main Menu Screen
 * Clean luxury aesthetic with footer buttons: About, How To Play, Support, Contact, Disclaimer, Credits, Settings.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, UserPlus, Settings, HelpCircle, Film, Crown, Info, LifeBuoy, Mail, ShieldAlert, Award } from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const MainMenuScreen: React.FC = () => {
  const { setCurrentScreen, setActiveModal, player, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between p-6 select-none overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      {/* Background Graphic Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Header / Title */}
      <div className="pt-8 text-center z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase">
          <Crown className="w-3.5 h-3.5" />
          <span>Hollywood Actor Simulator</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 tracking-tight drop-shadow">
          HOLLYWOOD RISING
        </h1>
        <p className="text-xs text-gray-400 tracking-widest uppercase font-medium">
          Phase 1 Core Gameplay Foundation
        </p>
      </div>

      {/* Main Actions */}
      <div className="w-full max-w-sm mx-auto space-y-3 z-10 my-auto">
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
            className="w-full py-3.5 rounded-2xl font-bold text-xs tracking-wide bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-amber-400" />
            CONTINUE ({player.firstName} {player.lastName})
          </button>
        )}

        <button
          onClick={() => setActiveModal('how_to_play')}
          className="w-full py-3 rounded-xl font-bold text-xs bg-black/40 hover:bg-black/60 text-gray-300 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          HOW TO PLAY
        </button>

        <button
          onClick={() => setActiveModal('settings')}
          className="w-full py-3 rounded-xl font-bold text-xs bg-black/40 hover:bg-black/60 text-gray-300 border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-purple-400" />
          SETTINGS & SLOTS
        </button>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="z-10 pt-6 border-t border-white/10 max-w-md mx-auto w-full">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-gray-400">
          <button
            onClick={() => setActiveModal('about')}
            className="hover:text-amber-300 transition-colors cursor-pointer px-2 py-1"
          >
            About
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('how_to_play')}
            className="hover:text-amber-300 transition-colors cursor-pointer px-2 py-1"
          >
            How To Play
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('support')}
            className="hover:text-amber-300 transition-colors cursor-pointer px-2 py-1"
          >
            Support
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('contact')}
            className="hover:text-amber-300 transition-colors cursor-pointer px-2 py-1"
          >
            Contact
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('disclaimer')}
            className="hover:text-amber-300 transition-colors cursor-pointer px-2 py-1"
          >
            Disclaimer
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('credits')}
            className="hover:text-amber-300 transition-colors cursor-pointer px-2 py-1"
          >
            Credits
          </button>
        </div>
      </div>
    </div>
  );
};
