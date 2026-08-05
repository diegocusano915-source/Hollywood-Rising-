/**
 * HOLLYWOOD RISING - AAA Red Carpet Premiere Modal
 * Interactive World Premiere Event with Lights Dimming, Camera Flashes, Crowd Cheering, Media Ticker, and Fan Reactions.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Users, Award, Film, MessageSquare, Star, CheckCircle2, ChevronRight, X, Volume2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BookedProject } from '../../types/game';
import { THEMES } from '../../theme/colors';
import { soundService } from '../../services/soundService';
import { ParticleOverlay } from '../common/ParticleOverlay';

interface RedCarpetPremiereModalProps {
  project: BookedProject;
  onClose: () => void;
  onCompletePremiere: () => void;
}

export const RedCarpetPremiereModal: React.FC<RedCarpetPremiereModalProps> = ({
  project,
  onClose,
  onCompletePremiere,
}) => {
  const { player, settings, addTimelineEvent, addFameXp } = useGame();
  const theme = THEMES[settings.theme] || THEMES['Hollywood Gold'];

  const [step, setStep] = useState<'VENUE' | 'INTERVIEW' | 'GUESTS' | 'CRITIC_REACTIONS'>('VENUE');
  const [selectedVenue, setSelectedVenue] = useState<number | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);

  useEffect(() => {
    soundService.playMusicTrack('premiere');
    soundService.playCameraFlash();
    soundService.playApplause();
  }, []);

  const premiereVenues = [
    {
      name: 'Sunset Boulevard World Premiere',
      location: 'TLC Chinese Theatre, Sunset & Hollywood Blvd',
      cost: 10000,
      hype: 35,
      desc: 'Iconic red carpet arrival on Sunset Boulevard with 500+ fans, paparazzi flashbulbs, and press junkets.',
    },
    {
      name: 'Hollywood Boulevard Gala',
      location: 'Dolby Theatre, Hollywood',
      cost: 15000,
      hype: 45,
      desc: 'High-profile gala event featuring live broadcast cameras, executive cocktail lounges, and A-list guests.',
    },
    {
      name: 'Beverly Hills Luxury Screening',
      location: 'Regent Beverly Wilshire Hotel',
      cost: 8000,
      hype: 25,
      desc: 'Exclusive private screening for academy members, top industry critics, and studio executives.',
    },
  ];

  const interviewQuestions = [
    {
      reporter: 'Variety Senior Reporter',
      question: `What was it like stepping onto set for ${project.movieTitle} under Director ${project.director || 'Denis Villeneuve'}?`,
      options: [
        { label: 'Humble & Dedicated', text: 'An absolute dream come true. Every cast member brought 110% to every single take.', hype: 15 },
        { label: 'Bold & Charismatic', text: 'We knew from day one we were building a masterpiece that will shatter box office records!', hype: 30 },
        { label: 'Artistic & Thoughtful', text: 'It forced me to tap into raw, unvarnished emotional depths I have never explored before.', hype: 20 },
      ],
    }
  ];

  const venueHype = selectedVenue !== null ? premiereVenues[selectedVenue].hype : 0;
  const interviewHype = selectedResponse !== null ? interviewQuestions[0].options[selectedResponse].hype : 0;
  const hypeBonus = venueHype + interviewHype;

  const handleSelectVenue = (index: number) => {
    setSelectedVenue(index);
    try {
      soundService.playGoldChime();
      soundService.playCameraFlash();
    } catch {
      // Audio fallback
    }
  };

  const handleSelectOption = (index: number) => {
    setSelectedResponse(index);
    try {
      soundService.playGoldChime();
      soundService.playCameraFlash();
    } catch {
      // Audio fallback
    }
  };

  const handleFinishPremiere = () => {
    try {
      soundService.playGoldChime();
      soundService.playApplause();
    } catch {
      // Audio fallback
    }

    // Log to Career History
    if (addTimelineEvent) {
      addTimelineEvent({
        year: player.dateYear,
        week: player.dateWeek,
        category: 'RELEASE',
        title: `Red Carpet Premiere: ${project.movieTitle}`,
        description: `Attended the ${premiereVenues[selectedVenue ?? 0]?.name || 'World Premiere'} for "${project.movieTitle}". Final Hype Score boosted to ${(project.hypeScore || 50) + hypeBonus}.`,
      });
    }

    if (addFameXp) {
      addFameXp(200 + hypeBonus, `Red Carpet Premiere: ${project.movieTitle}`);
    }

    onCompletePremiere();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/92 backdrop-blur-md animate-fadeIn overflow-y-auto">
      {/* Red Carpet Camera Flashes */}
      <ParticleOverlay type="flashes" active count={20} durationMs={0} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl max-h-[88vh] bg-gradient-to-b from-[#181132] to-[#0A071A] border-2 border-purple-500/50 rounded-3xl p-5 md:p-6 text-white shadow-2xl flex flex-col gap-4 relative z-10 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-amber-200 to-amber-400">
                World Premiere Red Carpet
              </h3>
              <p className="text-xs text-gray-400">{project.movieTitle} • {premiereVenues[selectedVenue ?? 0]?.location || 'TLC Chinese Theatre, Sunset Boulevard'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative h-36 rounded-2xl overflow-hidden border border-purple-500/30 flex items-end p-4 shrink-0">
          <img src={project.posterUrl} alt={project.movieTitle} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A071A] via-black/50 to-transparent" />

          <div className="relative z-10 flex gap-4 items-center">
            <img src={project.posterUrl} alt={project.movieTitle} className="w-14 h-20 object-cover rounded-xl border-2 border-amber-400 shadow-xl shrink-0" />
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/40 text-purple-200 font-bold text-[10px] uppercase border border-purple-400/40">
                Red Carpet Premiere Event
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white">{project.movieTitle}</h2>
              <p className="text-xs text-amber-300 font-semibold">{project.studio} • Directed by {project.director || 'Denis Villeneuve'}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'VENUE' && (
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Film className="w-4 h-4 text-amber-400" /> Select Premiere Venue & Red Carpet
              </span>
              <p className="text-xs text-gray-300">
                Tap a flagship venue location for your film's official Hollywood premiere.
              </p>
            </div>

            <div className="space-y-2.5">
              {premiereVenues.map((venue, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectVenue(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedVenue === idx
                      ? 'bg-gradient-to-r from-purple-900/60 to-purple-800/40 border-amber-400 text-white shadow-xl ring-2 ring-amber-400/30'
                      : 'bg-black/40 border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-amber-300 uppercase">{venue.name}</span>
                      {selectedVenue === idx && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300">{venue.desc}</p>
                    <span className="text-[10px] text-purple-300 font-mono block">{venue.location}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-400 block">+{venue.hype} Hype</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedVenue !== null && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-purple-950/50 p-3.5 rounded-2xl border border-purple-500/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-gray-200">
                    Selected: <strong className="text-amber-300">{premiereVenues[selectedVenue].name}</strong> (+{premiereVenues[selectedVenue].hype} Hype)
                  </span>
                </div>
                <button
                  onClick={() => setStep('INTERVIEW')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-purple-400 text-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Confirm Selection & Proceed</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'INTERVIEW' && (
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-purple-400" /> Press Junket Interview
              </span>
              <p className="text-sm font-semibold italic text-gray-200">
                "{interviewQuestions[0].question}"
              </p>
            </div>

            <div className="space-y-2">
              {interviewQuestions[0].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedResponse === idx
                      ? 'bg-purple-600/30 border-purple-400 text-white'
                      : 'bg-black/30 border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wide">{opt.label}</span>
                    <p className="text-xs text-gray-200">"{opt.text}"</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">+{opt.hype} Hype</span>
                </button>
              ))}
            </div>

            {selectedResponse !== null && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep('GUESTS')}
                  className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-purple-500 to-amber-400 text-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  Next: Celebrity Red Carpet <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'GUESTS' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" /> Celebrity Guests & Co-Stars Attending
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {(project.coStars || ['Leonardo DiCaprio', 'Zendaya', 'Timothée Chalamet']).map((guest, i) => {
                const nameStr = typeof guest === 'string' ? guest : (guest as any)?.name || 'Hollywood Star';
                const initials = nameStr.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'HS';
                return (
                  <div key={i} className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 font-black text-xs uppercase">
                      {initials}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">{nameStr}</h5>
                      <p className="text-[10px] text-gray-400">Attended & Posed with You</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep('CRITIC_REACTIONS')}
                className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-purple-500 to-amber-400 text-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                View First Reactions <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'CRITIC_REACTIONS' && (
          <div className="space-y-4">
            <div className="bg-purple-900/30 p-4 rounded-2xl border border-purple-500/40 space-y-3 text-center">
              <Star className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-amber-300">Standing Ovation at Chinese Theatre!</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Critics from Variety, The Hollywood Reporter, and IndieWire praise the stellar cast chemistry and visual scale. Hype Score boosted to <span className="text-amber-400 font-bold">{(project.hypeScore || 50) + hypeBonus}</span>!
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleFinishPremiere}
                className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 to-emerald-400 text-black shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                Launch Wide Release into Box Office! <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
