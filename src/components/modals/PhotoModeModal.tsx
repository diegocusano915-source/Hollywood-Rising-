/**
 * HOLLYWOOD RISING - Photo Mode & Press Card Studio
 * Capture Movie Premieres, Award Galas, Studio Executive Portraits & Download Cards.
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  X,
  Camera,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  Film,
  Award,
  Building2,
  Crown,
  Palette,
  Share2,
  Check,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const PhotoModeModal: React.FC = () => {
  const { setActiveModal, player, saveData, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [preset, setPreset] = useState<'PREMIERE' | 'AWARD' | 'STUDIO' | 'MANSION'>('PREMIERE');
  const [filter, setFilter] = useState<'GOLD' | 'NOIR' | 'CYBER' | 'GLOW' | 'VINTAGE'>('GOLD');
  const [caption, setCaption] = useState('World Premiere Red Carpet Walk in Beverly Hills');
  const [hideUi, setHideUi] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const presets = [
    {
      id: 'PREMIERE',
      label: 'Red Carpet Premiere',
      bgUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
      title: 'World Premiere Night',
      icon: <Film className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'AWARD',
      label: 'Academy Award Gala',
      bgUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
      title: 'Academy Awards Ceremony',
      icon: <Award className="w-4 h-4 text-yellow-400" />,
    },
    {
      id: 'STUDIO',
      label: 'Studio Lot Executive',
      bgUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
      title: 'Paramount Pictures Executive Suite',
      icon: <Building2 className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'MANSION',
      label: 'Beverly Hills Estate',
      bgUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
      title: 'Bel Air Private Residence',
      icon: <Crown className="w-4 h-4 text-purple-400" />,
    },
  ];

  const filterStyles = {
    GOLD: 'sepia-[0.25] contrast-105 saturate-125 brightness-105 border-amber-400/50 shadow-amber-500/20',
    NOIR: 'grayscale contrast-125 brightness-90 border-white/40 shadow-black',
    CYBER: 'hue-rotate-90 saturate-200 contrast-110 border-cyan-400/50 shadow-cyan-500/20',
    GLOW: 'brightness-110 saturate-150 blur-[0.2px] border-purple-400/50 shadow-purple-500/20',
    VINTAGE: 'sepia-[0.5] contrast-90 brightness-95 border-amber-600/40 shadow-amber-900/30',
  };

  const activePreset = presets.find((p) => p.id === preset) || presets[0];

  const handleDownloadSnapshot = () => {
    // Generate simple html canvas image snapshot download or mockup feedback
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="w-full max-w-3xl rounded-3xl flex flex-col overflow-hidden border shadow-2xl max-h-[92vh]"
        style={{
          backgroundColor: theme.cards,
          borderColor: theme.borderPrimary,
        }}
      >
        {/* Header */}
        {!hideUi && (
          <div
            className="p-4 flex items-center justify-between border-b shrink-0"
            style={{ backgroundColor: theme.headers, borderColor: theme.borderDark }}
          >
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider">PHOTO MODE & PRESS CAPTURE</h2>
                <p className="text-[10px] text-amber-300 font-medium">
                  Capture high-resolution press photos & red carpet moments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideUi(true)}
                className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Hide UI</span>
              </button>

              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Unhide Floating Button */}
        {hideUi && (
          <button
            onClick={() => setHideUi(false)}
            className="absolute top-6 right-6 z-50 px-4 py-2 rounded-2xl bg-black/80 hover:bg-black border border-amber-400 text-amber-300 font-black text-xs flex items-center gap-2 shadow-2xl cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Show UI Controls</span>
          </button>
        )}

        {/* Photo View Stage */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div
            className={`relative rounded-3xl overflow-hidden border-2 shadow-2xl min-h-[320px] md:min-h-[380px] flex flex-col justify-between p-6 transition-all ${
              filterStyles[filter]
            }`}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(${activePreset.bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Top Watermark / Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-400/40">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-white tracking-wider uppercase">HOLLYWOOD RISING™ PRESS</span>
              </div>

              <span className="text-[10px] font-mono font-bold text-amber-300 px-3 py-1 rounded-xl bg-black/70 border border-white/10">
                {player.dateYear || 2026} • Wk {player.dateWeek || 1}
              </span>
            </div>

            {/* Center Actor Portrait Mockup */}
            <div className="flex items-center justify-center my-4">
              <div className="relative group">
                <img
                  src={player.avatarUrl}
                  alt={player.firstName}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-amber-400 shadow-2xl ring-4 ring-black/50"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase shadow-lg border border-yellow-200">
                  {player.firstName} {player.lastName}
                </div>
              </div>
            </div>

            {/* Bottom Caption Bar */}
            <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 space-y-1 text-center">
              <h3 className="text-sm md:text-base font-black text-white tracking-wide uppercase">
                {activePreset.title}
              </h3>
              <p className="text-xs text-amber-300 font-medium italic">"{caption}"</p>
            </div>
          </div>

          {/* Controls Bar */}
          {!hideUi && (
            <div className="space-y-4 pt-2">
              {/* Presets Row */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block">
                  Select Location & Scene Preset:
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPreset(p.id as any);
                        setCaption(`${p.title} - ${player.firstName} ${player.lastName}`);
                      }}
                      className={`p-2.5 rounded-2xl border text-left font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        preset === p.id
                          ? 'bg-amber-400 text-black border-amber-300 shadow-md scale-102'
                          : 'bg-black/40 text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {p.icon}
                      <span className="text-xs font-black truncate">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters Row */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" /> Color Filter:
                </span>
                <div className="flex gap-2">
                  {(['GOLD', 'NOIR', 'CYBER', 'GLOW', 'VINTAGE'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        filter === f
                          ? 'bg-amber-400 text-black border-amber-300 shadow'
                          : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Text Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Press Caption Note:</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-black/60 text-white border border-white/10 rounded-2xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Download / Save Button */}
              <button
                onClick={handleDownloadSnapshot}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-black font-black text-xs uppercase tracking-wider hover:scale-101 transition-all cursor-pointer shadow-2xl flex items-center justify-center gap-2"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    <span>Press Photo Saved to Device Gallery!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Press Snapshot Card</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
