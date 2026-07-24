/**
 * HOLLYWOOD RISING - Empire System Screen
 * Phase 2 Revision: Cleared placeholder content for future development.
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import { Building2 } from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const EmpireScreen: React.FC = () => {
  const { settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 select-none overflow-y-auto pb-20"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header Bar / Page Title */}
      <div
        className="rounded-2xl p-4 border flex items-center gap-3 shadow-xl mb-5"
        style={{
          backgroundColor: theme.headers,
          borderColor: theme.borderDark,
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow">
          <Building2 className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-lg font-black text-white">EMPIRE</h1>
          <p className="text-xs text-amber-300 font-medium">
            Production Studios & Commercial Real Estate
          </p>
        </div>
      </div>
    </div>
  );
};
