/**
 * HOLLYWOOD RISING - Device Frame Wrapper
 * Allows toggling between Android Phone, Android Tablet, Foldable, or Fullscreen layouts.
 */

import React from 'react';
import { Smartphone, Tablet, FoldHorizontal, Maximize2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useGame();
  const mode = settings.deviceFrameMode || 'responsive';

  const modeWidths = {
    phone: 'max-w-[420px] h-[860px] rounded-[36px] border-[10px] border-[#1e1e38] shadow-[0_0_50px_rgba(0,0,0,0.8)] my-6',
    tablet: 'max-w-[820px] h-[920px] rounded-[32px] border-[12px] border-[#1e1e38] shadow-[0_0_60px_rgba(0,0,0,0.8)] my-6',
    foldable: 'max-w-[680px] h-[840px] rounded-[28px] border-[10px] border-[#1e1e38] shadow-[0_0_50px_rgba(0,0,0,0.8)] my-6',
    responsive: 'w-full h-full min-h-screen',
  };

  return (
    <div className="w-full min-h-screen bg-[#050510] text-[#F0F0F0] flex flex-col items-center justify-start overflow-x-hidden font-sans select-none">
      {/* Top Device Preview Bar */}
      <div className="w-full bg-[#111122] border-b border-[#222244] px-4 py-2 flex items-center justify-between text-xs text-[#999999] z-50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#33CC55] animate-pulse"></span>
          <span className="font-semibold text-white tracking-wider">HOLLYWOOD RISING</span>
          <span className="text-[#FFCC33] hidden sm:inline">| Phase 1 Android Build</span>
        </div>

        <div className="flex items-center gap-1 bg-[#050510] p-1 rounded-lg border border-[#222244]">
          <button
            onClick={() => updateSettings({ deviceFrameMode: 'responsive' })}
            className={`p-1.5 rounded flex items-center gap-1 transition-all ${
              mode === 'responsive' ? 'bg-[#FFCC33] text-[#050510] font-bold' : 'hover:text-white'
            }`}
            title="Fullscreen Responsive"
          >
            <Maximize2 size={13} />
            <span className="hidden md:inline text-[10px]">Full</span>
          </button>
          <button
            onClick={() => updateSettings({ deviceFrameMode: 'phone' })}
            className={`p-1.5 rounded flex items-center gap-1 transition-all ${
              mode === 'phone' ? 'bg-[#FFCC33] text-[#050510] font-bold' : 'hover:text-white'
            }`}
            title="Android Phone Frame"
          >
            <Smartphone size={13} />
            <span className="hidden md:inline text-[10px]">Phone</span>
          </button>
          <button
            onClick={() => updateSettings({ deviceFrameMode: 'tablet' })}
            className={`p-1.5 rounded flex items-center gap-1 transition-all ${
              mode === 'tablet' ? 'bg-[#FFCC33] text-[#050510] font-bold' : 'hover:text-white'
            }`}
            title="Android Tablet Frame"
          >
            <Tablet size={13} />
            <span className="hidden md:inline text-[10px]">Tablet</span>
          </button>
          <button
            onClick={() => updateSettings({ deviceFrameMode: 'foldable' })}
            className={`p-1.5 rounded flex items-center gap-1 transition-all ${
              mode === 'foldable' ? 'bg-[#FFCC33] text-[#050510] font-bold' : 'hover:text-white'
            }`}
            title="Foldable Frame"
          >
            <FoldHorizontal size={13} />
            <span className="hidden md:inline text-[10px]">Foldable</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full flex-1 flex justify-center items-center overflow-hidden bg-[#050510]">
        <div
          className={`relative bg-[#050510] flex flex-col overflow-hidden transition-all duration-300 ${
            modeWidths[mode]
          }`}
        >
          {/* Virtual Device Camera Notch for Phone/Tablet frame mode */}
          {mode !== 'responsive' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#050510] rounded-full z-50 flex items-center justify-center gap-2 border border-[#222244]/40">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111122]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#33CC55]/80"></div>
            </div>
          )}

          <div className="w-full h-full flex flex-col overflow-hidden relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
