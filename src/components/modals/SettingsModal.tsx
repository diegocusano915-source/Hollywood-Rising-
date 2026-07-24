/**
 * HOLLYWOOD RISING - Settings Modal
 * 3 Save Slots, Delete Save Data, Reset Game, Sound Toggles, Theme Palette Chooser.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { X, Settings, Volume2, VolumeX, Save, Trash2, Palette, Database } from 'lucide-react';
import { ThemeOption } from '../../types/game';
import { THEMES } from '../../theme/colors';

export const SettingsModal: React.FC = () => {
  const {
    setActiveModal,
    settings,
    updateSettings,
    switchSaveSlot,
    changeTheme,
    resetGame,
    manualSave,
  } = useGame();

  const activeTheme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const themes: ThemeOption[] = [
    'Hollywood Gold',
    'Midnight Blue',
    'Royal Purple',
    'Emerald Green',
    'Crimson Red',
    'Silver',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: activeTheme.cards,
          borderColor: activeTheme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between border-b"
          style={{ backgroundColor: activeTheme.headers, borderColor: activeTheme.borderDark }}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Game Settings</h2>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Save Slots */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-amber-400" />
              Save File Slots (3 Slots Available)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((slotNum) => {
                const isActive = settings.activeSlot === slotNum;
                return (
                  <button
                    key={slotNum}
                    onClick={() => switchSaveSlot(slotNum as 1 | 2 | 3)}
                    className={`py-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-black border-amber-300 shadow-lg scale-105'
                        : 'bg-black/30 text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    Save Slot {slotNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Themes */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-400" />
              Aesthetic Color Themes
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {themes.map((t) => {
                const isSelected = settings.theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => changeTheme(t)}
                    className={`p-2.5 rounded-xl font-bold border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 text-white border-amber-400 shadow'
                        : 'bg-black/30 text-gray-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: THEMES[t].primary }}
                      />
                      <span>{t}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Controls */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider">Audio Preferences</h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-white font-medium flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                Sound Effects & Jingles
              </span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded"
              />
            </div>
          </div>

          {/* Save & Reset Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                manualSave();
                alert('Game progress saved successfully!');
              }}
              className="w-full py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Manual Save to Slot {settings.activeSlot}
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete save data and reset this slot?')) {
                  resetGame();
                }
              }}
              className="w-full py-2.5 rounded-xl font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Save Data & Reset Slot {settings.activeSlot}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
