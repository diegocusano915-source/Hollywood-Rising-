/**
 * HOLLYWOOD RISING - AAA Settings Modal
 * 3 Save Slots, Audio Controls, Graphics, Animation Speed, Notifications, Accessibility, Support & Version.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Save,
  Trash2,
  Palette,
  Database,
  Sliders,
  Cloud,
  Map,
  Award,
  Bug,
  LifeBuoy,
  Bell,
  Eye,
  Zap,
  Info,
  Check,
} from 'lucide-react';
import { ThemeOption } from '../../types/game';
import { THEMES } from '../../theme/colors';
import { notificationService } from '../../services/notificationService';

const SUPPORT_EMAIL = 'propredict.support@gmail.com';

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

  const [musicVol, setMusicVol] = useState(80);
  const [sfxVol, setSfxVol] = useState(100);
  const [graphics, setGraphics] = useState<'Performance' | 'High' | 'Ultra'>('High');
  const [animSpeed, setAnimSpeed] = useState<'Normal' | 'Fast' | 'Instant'>('Normal');
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [autosave, setAutosave] = useState(true);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-xl rounded-2xl flex flex-col overflow-hidden border shadow-2xl max-h-[90vh]"
        style={{
          backgroundColor: activeTheme.cards,
          borderColor: activeTheme.borderPrimary,
        }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: activeTheme.headers, borderColor: activeTheme.borderDark }}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white uppercase tracking-wider">GAME SETTINGS</h2>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Save Slots & Save Manager Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <Database className="w-4 h-4 text-amber-400" />
                Save Slots & Active Storage
              </h4>
              <button
                onClick={() => setActiveModal('save_manager')}
                className="px-2.5 py-1 rounded-lg bg-amber-400 text-black font-black text-[10px] hover:scale-102 transition-all cursor-pointer shadow"
              >
                Open Save Manager
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((slotNum) => {
                const isActive = settings.activeSlot === slotNum;
                return (
                  <button
                    key={slotNum}
                    onClick={() => switchSaveSlot(slotNum)}
                    className={`py-2 rounded-xl font-bold border text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-black border-amber-300 shadow-lg scale-102 font-black'
                        : 'bg-black/40 text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    Slot {slotNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Themes Palette */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Palette className="w-4 h-4 text-amber-400" />
              Aesthetic Theme Palette
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

          {/* Audio Preferences */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Sliders className="w-4 h-4 text-amber-400" />
              Audio Controls (Music & SFX)
            </h4>

            <div className="space-y-2.5 p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                  Enable Game Sound Effects
                </span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>SFX Volume</span>
                  <span className="font-mono font-bold text-amber-300">{sfxVol}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVol}
                  onChange={(e) => setSfxVol(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-gray-800"
                />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Music Volume</span>
                  <span className="font-mono font-bold text-amber-300">{musicVol}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVol}
                  onChange={(e) => setMusicVol(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 rounded-lg bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Offline Notifications (real events only) */}
          <div className="space-y-2.5 p-3 rounded-xl bg-black/40 border border-amber-500/15">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-white font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Offline Notifications
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                  Real alerts on your phone every ~47 minutes while you're away — bids, offers, deadlines, stats. Nothing simulated.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.offlineNotifications !== false}
                onChange={(e) => {
                  const on = e.target.checked;
                  updateSettings({ offlineNotifications: on });
                  if (on) {
                    notificationService.requestPermissions();
                  } else {
                    notificationService.cancelPendingNotifications();
                  }
                }}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer shrink-0"
              />
            </div>
            <button
              onClick={async () => {
                const granted = await notificationService.requestPermissions();
                const sent = await notificationService.sendTestNotification();
                if (sent) alert('Test notification sent — check your phone in a few seconds.');
                else if (!granted && !notificationService.isNativeAvailable())
                  alert('Phone notifications run on your Android build (Android Studio). This web preview shows the Notification Center only.');
                else alert('Notification permission is off in your phone settings — enable it to receive alerts.');
              }}
              className="w-full py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition cursor-pointer"
              style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <Zap className="w-3.5 h-3.5 inline mr-1" /> Send Test Notification
            </button>
          </div>

          {/* Graphics & Animation Speed */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Zap className="w-4 h-4 text-amber-400" />
              Graphics & Performance
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Graphics Quality</span>
                <div className="flex gap-1">
                  {(['Performance', 'High', 'Ultra'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGraphics(g)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        graphics === g
                          ? 'bg-amber-400 text-black border-amber-300'
                          : 'bg-white/5 text-gray-400 border-white/5'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Animation Speed</span>
                <div className="flex gap-1">
                  {(['Normal', 'Fast', 'Instant'] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAnimSpeed(a)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                        animSpeed === a
                          ? 'bg-amber-400 text-black border-amber-300'
                          : 'bg-white/5 text-gray-400 border-white/5'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications & Accessibility */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Eye className="w-4 h-4 text-amber-400" />
              Notifications & Accessibility
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white block font-bold text-[11px]">Notifications</strong>
                  <span className="text-[9px] text-gray-400">Toasts & Alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white block font-bold text-[11px]">High Contrast</strong>
                  <span className="text-[9px] text-gray-400">Legibility</span>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white block font-bold text-[11px]">Reduce Motion</strong>
                  <span className="text-[9px] text-gray-400">No Fades</span>
                </div>
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Support & Information Links */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
              Hubs, Guides & Game Tools
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setActiveModal('career_stats')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Career Stats Hub</span>
              </button>

              <button
                onClick={() => setActiveModal('completion_tracker')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>Completion 100%</span>
              </button>

              <button
                onClick={() => setActiveModal('photo_mode')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>Photo Mode</span>
              </button>

              <button
                onClick={() => setActiveModal('notification_history')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-purple-400" />
                <span>Notify Log</span>
              </button>

              <button
                onClick={() => setActiveModal('help_center')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Career Handbook</span>
              </button>

              <button
                onClick={() => setActiveModal('retainer_management')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>Retainer Hub</span>
              </button>

              <button
                onClick={() => setActiveModal('roadmap')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 text-amber-400" />
                <span>Roadmap</span>
              </button>

              <button
                onClick={() => setActiveModal('credits')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 flex items-center justify-center gap-1.5 text-[11px] font-bold cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>Credits</span>
              </button>
            </div>
          </div>

          {/* Version Footer */}
          <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between text-[11px]">
            <div>
              <span className="text-gray-400 block font-bold">Hollywood Rising™</span>
              <span className="text-amber-300 font-mono font-bold">Version 1.4.0 (Build #2026.07.29)</span>
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-gray-400 hover:text-amber-300 underline font-mono text-[10px]"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          {/* Save & Reset Actions */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                manualSave();
                alert(`Game progress saved successfully to Slot ${settings.activeSlot}!`);
              }}
              className="w-full py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Save className="w-4 h-4" />
              Manual Save Progress (Slot {settings.activeSlot})
            </button>

            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete save data and reset Slot ${settings.activeSlot}?`)) {
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
