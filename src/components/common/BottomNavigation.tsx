/**
 * HOLLYWOOD RISING - Bottom Navigation Bar & Soundtrack Control Bar
 * Persistent 6-button navigation across all major gameplay scenes:
 * HOME | TALENT | WORLD | NETWORK | EMPIRE | REPRESENTATION
 * Includes live floating ambient soundtrack player with skip, pause & track info.
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Home,
  GraduationCap,
  Globe,
  Users,
  Building2,
  Briefcase,
  Music,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';
import { soundService, SoundtrackTrackInfo } from '../../services/soundService';

export const BottomNavigation: React.FC = () => {
  const { activeMainTab, setActiveMainTab, settings, updateSettings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [currentTrack, setCurrentTrack] = useState<SoundtrackTrackInfo>(() => soundService.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    soundService.onTrackChange((track) => {
      setCurrentTrack(track);
      setIsPlaying(true);
    });
  }, []);

  const navItems = [
    { id: 'HOME' as const, label: 'HOME', icon: Home },
    { id: 'TALENT' as const, label: 'TALENT', icon: GraduationCap },
    { id: 'WORLD' as const, label: 'WORLD', icon: Globe },
    { id: 'NETWORK' as const, label: 'NETWORK', icon: Users },
    { id: 'EMPIRE' as const, label: 'EMPIRE', icon: Building2 },
    { id: 'REPRESENTATION' as const, label: 'REP', icon: Briefcase },
  ];

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundService.stopMusic();
      setIsPlaying(false);
    } else {
      soundService.startContinuousSoundtrack();
      setIsPlaying(true);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.playNextTrack();
    setIsPlaying(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.playPrevTrack();
    setIsPlaying(true);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMute = !settings.musicEnabled;
    updateSettings({ musicEnabled: newMute });
    soundService.setMusicEnabled(newMute);
  };

  return (
    <div className="sticky bottom-0 z-40 w-full flex flex-col shrink-0 shadow-2xl">
      {/* Floating Offline Soundtrack Bar */}
      <div
        className="w-full border-t border-b border-white/10 px-3 py-1.5 flex items-center justify-between gap-2 backdrop-blur-xl select-none"
        style={{ backgroundColor: 'rgba(5, 5, 16, 0.95)' }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer" onClick={handleTogglePlay}>
          <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Music className={`w-3 h-3 text-amber-400 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`} />
          </div>
          <div className="min-w-0 truncate">
            <span className="text-[10px] font-black text-amber-300 truncate block leading-tight">
              {currentTrack?.title || 'Sunset Boulevard Soul'}
            </span>
            <span className="text-[8px] text-gray-400 font-semibold truncate block">
              {currentTrack?.genre || 'Soulful Chillhop'}
            </span>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Previous Track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="p-1.5 rounded-lg bg-amber-400 text-black hover:bg-amber-300 font-bold transition-all cursor-pointer shadow"
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          </button>

          <button
            onClick={handleNext}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleToggleMute}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer ml-1"
            title={settings.musicEnabled ? 'Mute Music' : 'Unmute Music'}
          >
            {settings.musicEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main 6-Tab Navigation Bar */}
      <nav
        className="w-full px-1 py-1"
        style={{
          backgroundColor: `${theme.headers}FA`,
          borderColor: theme.borderDark,
        }}
      >
        <div className="grid grid-cols-6 gap-1 max-w-4xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMainTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveMainTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 font-extrabold shadow-sm scale-[1.02]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 font-semibold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-400 stroke-[2.5]' : 'stroke-[1.75]'
                  }`}
                />
                <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <div
                    className="w-3 h-0.5 mt-0.5 rounded-full animate-pulse"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
