/**
 * HOLLYWOOD RISING — Disclaimer Screen (every launch)
 * Fictional-simulation legal notice shown before the main menu. Auto-dismiss
 * countdown ~28 seconds; the "I UNDERSTAND" button unlocks after 5 seconds
 * so it can't be insta-skipped, but never forces a full wait.
 */
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Star, Scale } from 'lucide-react';

const TOTAL_SECONDS = 28;
const BUTTON_UNLOCK_SECONDS = 5;

export const DisclaimerScreen: React.FC = () => {
  const { setCurrentScreen } = useGame();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [leaving, setLeaving] = useState(false);

  const proceed = () => {
    if (secondsLeft > TOTAL_SECONDS - BUTTON_UNLOCK_SECONDS) return; // not unlocked yet
    setLeaving(true);
    setTimeout(() => setCurrentScreen('main_menu'), 250);
  };

  useEffect(() => {
    const iv = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    const auto = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => setCurrentScreen('main_menu'), 250);
    }, TOTAL_SECONDS * 1000);
    return () => { clearInterval(iv); clearTimeout(auto); };
  }, [setCurrentScreen]);

  const buttonUnlocked = secondsLeft <= TOTAL_SECONDS - BUTTON_UNLOCK_SECONDS;
  const pct = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 select-none overflow-hidden transition-all duration-300"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #14100a 0%, #050508 60%)',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* wordmark */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2.5">
          <Star className="w-6 h-6 text-[#FFCC33] fill-[#FFCC33]" />
          <h1 className="text-lg font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFCC33] via-[#FFE082] to-[#FF9900]">
            Hollywood Rising
          </h1>
          <Star className="w-6 h-6 text-[#FFCC33] fill-[#FFCC33]" />
        </div>
      </div>

      {/* the notice card */}
      <div className="w-full max-w-md rounded-2xl border border-[#FFCC33]/25 bg-black/50 backdrop-blur-sm p-6 space-y-4 shadow-2xl">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-[#FFCC33]/10 border border-[#FFCC33]/30">
            <Scale className="w-4.5 h-4.5 w-4 h-4 text-[#FFCC33]" />
          </div>
          <div>
            <b className="text-[11px] font-black uppercase tracking-[2px] text-[#FFCC33] block">Legal Disclaimer</b>
            <span className="text-[7.5px] text-gray-500 tracking-wider">PLEASE READ BEFORE PLAYING</span>
          </div>
        </div>

        <div className="space-y-3 text-[10.5px] leading-relaxed text-gray-300">
          <p>
            <b className="text-gray-100">Hollywood Rising is a work of fiction.</b> All characters, studios, networks,
            currencies, and events — including any resembling real people or companies — are entirely fictional and
            used for entertainment purposes only.
          </p>
          <p>
            This game simulates a Hollywood career for gameplay; <b className="text-gray-100">no real money,
            investments, or financial products are involved.</b> All in-game currencies (cash, StarCoins, stocks, bank
            balances) have no real-world value. Purchases, if any, cover game content only.
          </p>
          <p>
            By playing, you agree the developers are not liable for decisions inspired by in-game financial or career
            mechanics.
          </p>
        </div>

        {/* countdown + button */}
        <div className="pt-2 space-y-2.5">
          <div className="h-1 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FFCC33] to-[#FF9900] transition-all duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] text-gray-500 font-mono tracking-wider">
              {secondsLeft > 0 ? `AUTO-CONTINUE IN ${secondsLeft}s` : 'CONTINUING...'}
            </span>
            <button
              onClick={proceed}
              disabled={!buttonUnlocked}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] tracking-[2px] uppercase transition-all cursor-pointer ${
                buttonUnlocked
                  ? 'bg-gradient-to-r from-[#FFCC33] to-[#FF9900] text-black shadow-lg shadow-[#FFCC33]/25 hover:scale-105'
                  : 'bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed'
              }`}
            >
              {buttonUnlocked ? 'I Understand' : `Unlock in ${Math.max(0, secondsLeft - (TOTAL_SECONDS - BUTTON_UNLOCK_SECONDS))}s`}
            </button>
          </div>
        </div>
      </div>

      <p className="text-[7px] text-gray-600 mt-4 tracking-wider">
        FICTIONAL SIMULATION · NO REAL-WORLD VALUE · ENTERTAINMENT ONLY
      </p>
    </div>
  );
};
