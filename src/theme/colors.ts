/**
 * HOLLYWOOD RISING - Dynamic Theme Configurations & Palettes
 */

import { ThemeOption } from '../types/game';

export interface ThemeColors {
  primary: string;
  primaryGlow: string;
  primaryDark: string;
  background: string;
  cards: string;
  headers: string;
  borderDark: string;
  borderPrimary: string;
  textPrimary: string;
  textSecondary: string;
  green: string;
  blue: string;
  purple: string;
  red: string;
}

export const THEMES: Record<ThemeOption, ThemeColors> = {
  'Hollywood Gold': {
    primary: '#FFCC33',
    primaryGlow: 'rgba(255, 204, 51, 0.35)',
    primaryDark: '#C79A00',
    background: '#050510',
    cards: '#111122',
    headers: '#1E1E3A',
    borderDark: '#222244',
    borderPrimary: 'rgba(255, 204, 51, 0.4)',
    textPrimary: '#F0F0F0',
    textSecondary: '#999999',
    green: '#33CC55',
    blue: '#5599FF',
    purple: '#9955FF',
    red: '#FF3333',
  },
  'Midnight Blue': {
    primary: '#38BDF8',
    primaryGlow: 'rgba(56, 189, 248, 0.35)',
    primaryDark: '#0284C7',
    background: '#030A1A',
    cards: '#0A192F',
    headers: '#112240',
    borderDark: '#1E293B',
    borderPrimary: 'rgba(56, 189, 248, 0.4)',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    green: '#10B981',
    blue: '#38BDF8',
    purple: '#818CF8',
    red: '#F43F5E',
  },
  'Royal Purple': {
    primary: '#C084FC',
    primaryGlow: 'rgba(192, 132, 252, 0.35)',
    primaryDark: '#9333EA',
    background: '#0C0518',
    cards: '#190A2E',
    headers: '#2B124C',
    borderDark: '#2E1065',
    borderPrimary: 'rgba(192, 132, 252, 0.4)',
    textPrimary: '#FAF5FF',
    textSecondary: '#A855F7',
    green: '#34D399',
    blue: '#60A5FA',
    purple: '#C084FC',
    red: '#FB7185',
  },
  'Emerald Green': {
    primary: '#34D399',
    primaryGlow: 'rgba(52, 211, 153, 0.35)',
    primaryDark: '#059669',
    background: '#03140C',
    cards: '#0A2619',
    headers: '#123D29',
    borderDark: '#064E3B',
    borderPrimary: 'rgba(52, 211, 153, 0.4)',
    textPrimary: '#ECFDF5',
    textSecondary: '#6EE7B7',
    green: '#34D399',
    blue: '#38BDF8',
    purple: '#A78BFA',
    red: '#F87171',
  },
  'Crimson Red': {
    primary: '#F87171',
    primaryGlow: 'rgba(248, 113, 113, 0.35)',
    primaryDark: '#DC2626',
    background: '#170505',
    cards: '#2A0A0A',
    headers: '#451010',
    borderDark: '#7F1D1D',
    borderPrimary: 'rgba(248, 113, 113, 0.4)',
    textPrimary: '#FEF2F2',
    textSecondary: '#FCA5A5',
    green: '#34D399',
    blue: '#60A5FA',
    purple: '#C084FC',
    red: '#F87171',
  },
  'Silver': {
    primary: '#E2E8F0',
    primaryGlow: 'rgba(226, 232, 240, 0.35)',
    primaryDark: '#94A3B8',
    background: '#0F172A',
    cards: '#1E293B',
    headers: '#334155',
    borderDark: '#475569',
    borderPrimary: 'rgba(226, 232, 240, 0.4)',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    green: '#34D399',
    blue: '#38BDF8',
    purple: '#A78BFA',
    red: '#F87171',
  },
};

export const HOLLYWOOD_COLORS = THEMES['Hollywood Gold'];
