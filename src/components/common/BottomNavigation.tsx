/**
 * HOLLYWOOD RISING - Bottom Navigation Bar
 * Persistent 6-button navigation across all major gameplay scenes:
 * HOME | TALENT | WORLD | NETWORK | EMPIRE | REPRESENTATION
 */

import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Home,
  GraduationCap,
  Globe,
  Users,
  Building2,
  Briefcase,
} from 'lucide-react';
import { THEMES } from '../../theme/colors';

export const BottomNavigation: React.FC = () => {
  const { activeMainTab, setActiveMainTab, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const navItems = [
    { id: 'HOME' as const, label: 'HOME', icon: Home },
    { id: 'TALENT' as const, label: 'TALENT', icon: GraduationCap },
    { id: 'WORLD' as const, label: 'WORLD', icon: Globe },
    { id: 'NETWORK' as const, label: 'NETWORK', icon: Users },
    { id: 'EMPIRE' as const, label: 'EMPIRE', icon: Building2 },
    { id: 'REPRESENTATION' as const, label: 'REP', icon: Briefcase },
  ];

  return (
    <nav
      className="sticky bottom-0 z-40 w-full border-t border-white/10 shadow-2xl backdrop-blur-xl px-1 py-1.5"
      style={{
        backgroundColor: `${theme.headers}FA`, // 98% opaque headers color
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
              className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-amber-400/15 text-amber-300 font-extrabold shadow-sm scale-[1.02]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 font-semibold'
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-amber-400 stroke-[2.5]' : 'stroke-[1.75]'
                }`}
              />
              <span className="text-[9px] tracking-tight truncate w-full text-center leading-none">
                {item.label}
              </span>
              {isActive && (
                <div
                  className="w-4 h-0.5 mt-1 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.primary }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
