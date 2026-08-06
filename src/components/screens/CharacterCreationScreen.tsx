/**
 * HOLLYWOOD RISING - Character Creation Screen
 * Full Custom Player Creation: First Name, Last Name, Gender, Avatar, Age, Country, Personality
 */

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Sparkles, User, Check } from 'lucide-react';
import { Gender, Personality } from '../../types/game';
import { THEMES } from '../../theme/colors';

const AVATAR_OPTIONS: Record<Gender, string[]> = {
  Male: [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
  ],
  Female: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  ],
  'Non-Binary': [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
  ],
};

export const CharacterCreationScreen: React.FC = () => {
  const { createNewCharacter, setCurrentScreen, settings } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS.Male[0]);
  const [age, setAge] = useState<number>(21);
  const [country, setCountry] = useState('United States');
  const [personality, setPersonality] = useState<Personality>('Confident');
  const [error, setError] = useState<string | null>(null);

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    setSelectedAvatar(AVATAR_OPTIONS[newGender][0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Please enter a First Name for your actor!');
      return;
    }
    if (!lastName.trim()) {
      setError('Please enter a Last Name for your actor!');
      return;
    }
    setError(null);
    createNewCharacter(
      firstName.trim(),
      lastName.trim(),
      gender,
      age,
      country,
      personality,
      selectedAvatar
    );
  };

  return (
    <div
      className="w-full min-h-full flex flex-col p-4 sm:p-6 select-none overflow-y-auto pb-16"
      style={{ backgroundColor: theme.background }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentScreen('main_menu')}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Actor Creation
        </span>
      </div>

      <div className="max-w-md mx-auto w-full space-y-5 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Create Your Actor
          </h2>
          <p className="text-xs text-gray-400">
            Define your Hollywood identity to begin your career on Sunset Boulevard.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/10 text-xs">
          {/* Avatar Selection */}
          <div>
            <label className="block text-gray-400 font-semibold mb-2">Select Portrait Headshot</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS[gender].map((url, idx) => {
                const isSelected = selectedAvatar === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-amber-400 scale-105 shadow-lg' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="Headshot" className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Leonardo"
                className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. DiCaprio"
                className="w-full p-3 rounded-xl bg-gray-900 border border-white/15 text-white font-medium focus:border-amber-400 outline-none placeholder-gray-500"
              />
            </div>
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => handleGenderChange(e.target.value as Gender)}
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
