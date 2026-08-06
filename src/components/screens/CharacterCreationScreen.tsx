/**
 * HOLLYWOOD RISING - Character Creation Screen
 * Options: First Name, Last Name, Gender, Age, Country, Personality
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Sparkles, User, ShieldAlert, Check } from 'lucide-react';
import { Gender, Personality } from '../../types/game';
import { THEMES } from '../../theme/colors';

export const CharacterCreationScreen: React.FC = () => {
  const { createNewCharacter, setCurrentScreen, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [firstName, setFirstName] = useState('Jordan');
  const [lastName, setLastName] = useState('Vance');
  const [gender, setGender] = useState<Gender>('Male');
  const [age, setAge] = useState<number>(21);
  const [country, setCountry] = useState('United States');
  const [personality, setPersonality] = useState<Personality>('Confident');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    createNewCharacter(firstName.trim(), lastName.trim(), gender, age, country, personality);
  };

  return (
    <div
      className="w-full min-h-full flex flex-col p-6 select-none overflow-y-auto pb-12"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentScreen('main_menu')}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Hollywood Star Creation
        </span>
      </div>

      <div className="max-w-md mx-auto w-full space-y-6 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Create Your Actor
          </h2>
          <p className="text-xs text-gray-400">
            Define your Hollywood identity to begin your journey on Sunset Boulevard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-black/40 p-6 rounded-2xl border border-white/10 text-xs">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Age ({age} yrs)</label>
              <input
                type="number"
                min={18}
                max={60}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Country of Origin</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none"
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="Japan">Japan</option>
              <option value="Brazil">Brazil</option>
            </select>
          </div>

          {/* Personality */}
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Personality Archetype</label>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value as Personality)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none"
            >
              <option value="Confident">Confident (Reputation Boost)</option>
              <option value="Charming">Charming (Dating Boost)</option>
              <option value="Funny">Funny (Comedy Roles)</option>
              <option value="Calm">Calm (Drama Roles)</option>
              <option value="Aggressive">Aggressive (Action Roles)</option>
              <option value="Mysterious">Mysterious (Indie Roles)</option>
            </select>
          </div>

          {/* Starting Stats Summary */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-1.5 text-[11px] text-gray-400">
            <span className="font-bold text-amber-400 block uppercase">Starting Foundation</span>
            <div className="grid grid-cols-2 gap-1 text-white">
              <span>Cash: <strong>$2,500</strong></span>
              <span>Energy: <strong>100 / 100</strong></span>
              <span>Fans: <strong>0</strong></span>
              <span>Fame: <strong>0 XP</strong></span>
              <span>Movies: <strong>0</strong></span>
              <span>Guild Status: <strong>Locked</strong></span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            style={{
              backgroundColor: theme.primary,
              color: '#000000',
            }}
          >
            <Sparkles className="w-4 h-4" />
            BEGIN HOLLYWOOD CAREER
          </button>
        </form>
      </div>
    </div>
  );
};
