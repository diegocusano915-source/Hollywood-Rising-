/**
 * HOLLYWOOD RISING - True Soulful Ambient & Cinematic Soundscape Engine (No Beats)
 * Pure, lush, continuous atmospheric soundscapes featuring:
 * - Continuous warm detuned string pads and resonant lowpass acoustic filtering
 * - Gentle soulful piano melodies floating over deep orchestral drones
 * - Seamless 15-track playlist with smooth continuous cross-fades and track auto-advance
 * - 100% Offline Web Audio API synthesis (Zero external downloads, works offline on Android)
 */

export type MusicTrackMode =
  | 'menu'
  | 'career'
  | 'empire'
  | 'relationships'
  | 'awards'
  | 'premiere'
  | 'production'
  | 'box_office'
  | 'settings'
  | string;

export interface SoundtrackTrackInfo {
  id: number;
  title: string;
  mood: string;
  durationSeconds: number;
  baseFrequencies: number[];
  melodyNotes: number[];
  filterCutoff: number;
}

export const HOLLYWOOD_SOUNDTRACK_PLAYLIST: SoundtrackTrackInfo[] = [
  {
    id: 1,
    title: 'Golden Hour Symphony',
    mood: 'Soulful Warm Strings & Acoustic Golden Light',
    durationSeconds: 48,
    baseFrequencies: [138.59, 174.61, 207.65, 277.18, 349.23], // Db Major 9
    melodyNotes: [415.30, 523.25, 622.25, 554.37, 415.30, 349.23, 523.25, 698.46],
    filterCutoff: 450,
  },
  {
    id: 2,
    title: 'Sunset Boulevard Velvet',
    mood: 'Lush Smooth Ambient Rhodes & Evening Glow',
    durationSeconds: 50,
    baseFrequencies: [174.61, 220.00, 261.63, 329.63, 392.00], // F Major 9
    melodyNotes: [329.63, 440.00, 523.25, 440.00, 392.00, 329.63, 261.63, 440.00],
    filterCutoff: 520,
  },
  {
    id: 3,
    title: 'Bel-Air Moonlight',
    mood: 'Peaceful Ethereal Midnight Piano & Atmosphere',
    durationSeconds: 46,
    baseFrequencies: [103.83, 155.56, 207.65, 261.63, 311.13], // Ab Major 7
    melodyNotes: [392.00, 466.16, 523.25, 622.25, 523.25, 392.00, 466.16, 311.13],
    filterCutoff: 400,
  },
  {
    id: 4,
    title: 'Oscar Prestige Gala',
    mood: 'Emotional Cinematic Orchestral Strings',
    durationSeconds: 52,
    baseFrequencies: [146.83, 220.00, 293.66, 369.99, 440.00], // D Major 9
    melodyNotes: [440.00, 554.37, 587.33, 739.99, 587.33, 440.00, 369.99, 554.37],
    filterCutoff: 600,
  },
  {
    id: 5,
    title: 'Century City Horizon',
    mood: 'Deep Soothing Ambient Pads & Calming Drone',
    durationSeconds: 45,
    baseFrequencies: [110.00, 164.81, 220.00, 261.63, 329.63], // A Minor 9
    melodyNotes: [329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 261.63],
    filterCutoff: 380,
  },
  {
    id: 6,
    title: 'Chateau Marmont Serenade',
    mood: 'Gentle Soulful Piano & Warm Acoustic Cello',
    durationSeconds: 48,
    baseFrequencies: [130.81, 196.00, 261.63, 311.13, 392.00], // C Minor 9
    melodyNotes: [392.00, 466.16, 523.25, 587.33, 466.16, 392.00, 311.13, 466.16],
    filterCutoff: 420,
  },
  {
    id: 7,
    title: 'Malibu Ocean Breeze',
    mood: 'Calm Pacific Coast Wave Swells & Harmonic Resonance',
    durationSeconds: 54,
    baseFrequencies: [123.47, 185.00, 246.94, 311.13, 369.99], // B Major 9
    melodyNotes: [369.99, 466.16, 493.88, 622.25, 493.88, 369.99, 311.13, 466.16],
    filterCutoff: 480,
  },
  {
    id: 8,
    title: 'Hollywood Hills Twilight',
    mood: 'Warm Golden Hour Acoustic Reflection',
    durationSeconds: 47,
    baseFrequencies: [164.81, 246.94, 329.63, 392.00, 493.88], // E Minor 9
    melodyNotes: [493.88, 587.33, 659.25, 783.99, 659.25, 493.88, 392.00, 587.33],
    filterCutoff: 500,
  },
  {
    id: 9,
    title: 'Starlight Sanctuary',
    mood: 'Dreamy Cinematic Harp & Celestial Shimmer',
    durationSeconds: 50,
    baseFrequencies: [146.83, 196.00, 293.66, 349.23, 440.00], // G Major 9
    melodyNotes: [440.00, 523.25, 587.33, 698.46, 587.33, 440.00, 349.23, 523.25],
    filterCutoff: 550,
  },
  {
    id: 10,
    title: 'Velvet Dynasty',
    mood: 'Lush Vintage Golden Era Hollywood Strings',
    durationSeconds: 46,
    baseFrequencies: [155.56, 233.08, 311.13, 392.00, 466.16], // Eb Major 9
    melodyNotes: [466.16, 587.33, 622.25, 783.99, 622.25, 466.16, 392.00, 587.33],
    filterCutoff: 460,
  },
  {
    id: 11,
    title: 'Cannes Croisette Sunset',
    mood: 'Warm Mediterranean Film Festival Ambiance',
    durationSeconds: 52,
    baseFrequencies: [174.61, 261.63, 349.23, 415.30, 523.25], // F Minor 9
    melodyNotes: [523.25, 622.25, 698.46, 830.61, 698.46, 523.25, 415.30, 622.25],
    filterCutoff: 440,
  },
  {
    id: 12,
    title: 'Studio Lot Memories',
    mood: 'Nostalgic Acoustic Piano & Slow Ambient Cello',
    durationSeconds: 49,
    baseFrequencies: [130.81, 196.00, 261.63, 329.63, 392.00], // C Major 9
    melodyNotes: [392.00, 493.88, 523.25, 659.25, 523.25, 392.00, 329.63, 493.88],
    filterCutoff: 470,
  },
  {
    id: 13,
    title: 'Walk of Fame Dream',
    mood: 'Inspiring Ethereal Golden String Swells',
    durationSeconds: 51,
    baseFrequencies: [110.00, 146.83, 220.00, 293.66, 369.99], // D Major 7
    melodyNotes: [369.99, 440.00, 554.37, 659.25, 554.37, 369.99, 293.66, 440.00],
    filterCutoff: 530,
  },
  {
    id: 14,
    title: 'Midnight Reflection',
    mood: 'Deep Soulful Atmospheric Meditation',
    durationSeconds: 46,
    baseFrequencies: [116.54, 174.61, 233.08, 277.18, 349.23], // Bb Minor 9
    melodyNotes: [349.23, 415.30, 466.16, 554.37, 466.16, 349.23, 277.18, 415.30],
    filterCutoff: 390,
  },
  {
    id: 15,
    title: 'The Star Journey',
    mood: 'Epic Emotional Ambient Climax & Cinematic Radiance',
    durationSeconds: 55,
    baseFrequencies: [138.59, 207.65, 277.18, 349.23, 415.30], // Db Major 7
    melodyNotes: [415.30, 523.25, 554.37, 698.46, 830.61, 698.46, 554.37, 523.25],
    filterCutoff: 580,
  },
];

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.8;

  // Active Soundscape Nodes
  private currentTrackIndex: number = 0;
  private activeDrones: { osc: OscillatorNode; gain: GainNode }[] = [];
  private masterMusicGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private melodyInterval: number | null = null;
  private trackTimer: number | null = null;
  private isMusicPlaying: boolean = false;
  private onTrackChangeCallbacks: ((track: SoundtrackTrackInfo) => void)[] = [];

  public getContext(): AudioContext | null {
    if (!this.ctx) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch {}
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlockAudioContext() {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (this.musicEnabled && !this.isMusicPlaying) {
          this.startContinuousSoundtrack();
        }
      }).catch(() => {});
    } else if (this.musicEnabled && !this.isMusicPlaying) {
      this.startContinuousSoundtrack();
    }
  }

  public onTrackChange(cb: (track: SoundtrackTrackInfo) => void) {
    this.onTrackChangeCallbacks.push(cb);
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else {
      this.startContinuousSoundtrack();
    }
  }

  public setMusicVolume(volPercent: number) {
    this.musicVolume = Math.max(0, Math.min(1, volPercent / 100));
    if (this.masterMusicGain && this.ctx) {
      try {
        this.masterMusicGain.gain.setValueAtTime(this.musicVolume * 0.35, this.ctx.currentTime);
      } catch {}
    }
  }

  public setSfxVolume(volPercent: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volPercent / 100));
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public isMusicOn(): boolean {
    return this.musicEnabled;
  }

  public getCurrentTrack(): SoundtrackTrackInfo {
    return HOLLYWOOD_SOUNDTRACK_PLAYLIST[this.currentTrackIndex];
  }

  // ==========================================
  // CONTINUOUS 15-TRACK SOULFUL AMBIENT ENGINE
  // ==========================================

  public playMusicTrack(mode?: MusicTrackMode) {
    if (!this.musicEnabled) return;

    let trackIdx = this.currentTrackIndex;
    if (mode === 'menu') trackIdx = 0;
    else if (mode === 'relationships') trackIdx = 1;
    else if (mode === 'empire' || mode === 'box_office') trackIdx = 4;
    else if (mode === 'awards' || mode === 'premiere') trackIdx = 3;
    else if (mode === 'production') trackIdx = 5;

    this.playTrackAtIndex(trackIdx);
  }

  public startContinuousSoundtrack() {
    if (!this.musicEnabled) return;
    if (this.isMusicPlaying) return;
    this.playTrackAtIndex(this.currentTrackIndex);
  }

  public playNextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % HOLLYWOOD_SOUNDTRACK_PLAYLIST.length;
    this.playTrackAtIndex(nextIdx);
  }

  public playPrevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + HOLLYWOOD_SOUNDTRACK_PLAYLIST.length) % HOLLYWOOD_SOUNDTRACK_PLAYLIST.length;
    this.playTrackAtIndex(prevIdx);
  }

  public playTrackAtIndex(index: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopActiveDrones();
    this.currentTrackIndex = index % HOLLYWOOD_SOUNDTRACK_PLAYLIST.length;
    this.isMusicPlaying = true;

    const track = HOLLYWOOD_SOUNDTRACK_PLAYLIST[this.currentTrackIndex];

    // Notify listeners of track title change
    this.onTrackChangeCallbacks.forEach((cb) => {
      try { cb(track); } catch {}
    });

    try {
      const now = ctx.currentTime;

      // Master gain node with smooth slow attack
      if (!this.masterMusicGain) {
        this.masterMusicGain = ctx.createGain();
        this.masterMusicGain.connect(ctx.destination);
      }
      this.masterMusicGain.gain.setValueAtTime(0.001, now);
      this.masterMusicGain.gain.linearRampToValueAtTime(
        Math.max(0.001, this.musicVolume * 0.35),
        now + 3.0 // 3-second gentle swelling attack
      );

      // Lowpass resonant filter for velvety warmth
      this.ambientFilter = ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(track.filterCutoff, now);
      this.ambientFilter.Q.setValueAtTime(1.8, now);
      this.ambientFilter.connect(this.masterMusicGain);

      // Create warm, detuned multi-layer string drone bed (Continuous, NO BEATS)
      this.activeDrones = [];
      track.baseFrequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternating warm waveforms for rich orchestral warmth
        osc.type = i === 0 ? 'sine' : i % 2 === 0 ? 'triangle' : 'sawtooth';
        // Subtle micro-detuning for chorus depth
        const detuneCents = (i % 2 === 0 ? 1 : -1) * (i * 3 + 2);
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detuneCents, now);

        const droneVol = i === 0 ? 0.28 : 0.12 / Math.sqrt(i + 1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(droneVol, now + 4.0);

        osc.connect(gain);
        gain.connect(this.ambientFilter!);

        osc.start(now);
        this.activeDrones.push({ osc, gain });
      });

      // Soulful acoustic piano/harp melody drops (Gentle, spaced, floating)
      let melodyStep = 0;
      const playMelodyNote = () => {
        if (!this.isMusicPlaying || !this.ctx || !this.ambientFilter) return;

        try {
          const tNow = this.ctx.currentTime;
          const noteFreq = track.melodyNotes[melodyStep % track.melodyNotes.length];

          const mOsc = this.ctx.createOscillator();
          const mGain = this.ctx.createGain();

          mOsc.type = 'triangle'; // Pure soulful acoustic bell/rhodes tone
          mOsc.frequency.setValueAtTime(noteFreq, tNow);

          // Soft bell-like envelope with long gentle decay
          mGain.gain.setValueAtTime(0.001, tNow);
          mGain.gain.linearRampToValueAtTime(0.18, tNow + 0.15);
          mGain.gain.exponentialRampToValueAtTime(0.0001, tNow + 3.8);

          mOsc.connect(mGain);
          mGain.connect(this.ambientFilter);

          mOsc.start(tNow);
          mOsc.stop(tNow + 4.0);

          melodyStep++;
        } catch {}
      };

      // Play soulful notes every 3.5 to 5.5 seconds organically
      playMelodyNote();
      this.melodyInterval = window.setInterval(playMelodyNote, 4200);

      // Auto-advance to next track when duration concludes
      this.trackTimer = window.setTimeout(() => {
        this.playNextTrack();
      }, track.durationSeconds * 1000);

    } catch {}
  }

  private stopActiveDrones() {
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    if (this.trackTimer) {
      clearTimeout(this.trackTimer);
      this.trackTimer = null;
    }

    if (this.ctx && this.activeDrones.length > 0) {
      const now = this.ctx.currentTime;
      this.activeDrones.forEach(({ osc, gain }) => {
        try {
          gain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
          setTimeout(() => {
            try { osc.stop(); osc.disconnect(); } catch {}
          }, 1600);
        } catch {}
      });
      this.activeDrones = [];
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    this.stopActiveDrones();
    if (this.masterMusicGain && this.ctx) {
      try {
        this.masterMusicGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
      } catch {}
    }
  }

  // ==========================================
  // SOUND EFFECTS (SFX)
  // ==========================================

  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  public playHover() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.05 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  public playSuccessSound() {
    this.playGoldChime();
  }

  public playGoldChime() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    } catch {}
  }

  public playFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.24 * this.sfxVolume, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch {}
  }

  public playLevelUp() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const chord = [392, 493.88, 587.33, 783.99];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.16 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.8);
      });
    } catch {}
  }

  public playCameraFlash() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {}
  }

  public playApplause() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const duration = 2.2;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        const clapPulse = Math.random() > 0.8 ? 1 : 0.2;
        data[i] = (Math.random() * 2 - 1) * env * clapPulse;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
      gain.gain.linearRampToValueAtTime(0.3 * this.sfxVolume, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {}
  }

  public playMoneyReceived() {
    this.playGoldChime();
  }

  public playMoneySpent() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playContractSigned() {
    this.playFanfare();
  }

  public playAwardWon() {
    this.playApplause();
    setTimeout(() => this.playFanfare(), 300);
  }
}

export const soundService = new SoundService();

// Global gesture unlocker for modern mobile browsers & WebViews
if (typeof window !== 'undefined') {
  const unlock = () => {
    soundService.unlockAudioContext();
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('click', unlock, { passive: true });
}
