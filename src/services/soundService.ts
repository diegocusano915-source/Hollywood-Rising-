/**
 * HOLLYWOOD RISING - Offline Soundtrack & Adaptive Music Engine
 * Includes 15 distinct procedural Hollywood soundtrack tracks that play continuously in an offline loop.
 * Features: Auto-track advance, cross-fading, volume control, track title metadata, and SFX suite.
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
  genre: string;
  durationSeconds: number;
  chords: number[][];
  tempoMs: number;
}

export const HOLLYWOOD_SOUNDTRACK_PLAYLIST: SoundtrackTrackInfo[] = [
  {
    id: 1,
    title: 'Hollywood Gold (Main Theme)',
    genre: 'Cinematic Luxury Orchestral',
    durationSeconds: 45,
    chords: [
      [277.18, 349.23, 415.3, 523.25], // DbMaj7
      [311.13, 369.99, 466.16, 554.37], // Ebm7
      [220.0, 277.18, 329.63, 415.3], // Fm7
      [246.94, 311.13, 369.99, 466.16], // GbMaj7
    ],
    tempoMs: 2600,
  },
  {
    id: 2,
    title: 'Sunset Boulevard Neo-Soul',
    genre: 'California Lounge',
    durationSeconds: 48,
    chords: [
      [174.61, 220.0, 261.63, 329.63], // FMaj7
      [220.0, 261.63, 329.63, 440.0], // Am7
      [146.83, 174.61, 220.0, 293.66], // Dm7
      [196.0, 246.94, 293.66, 392.0], // C7
    ],
    tempoMs: 2800,
  },
  {
    id: 3,
    title: 'Bel-Air Penthouse Jazz',
    genre: 'Late-Night Rhodes & Vibraphone',
    durationSeconds: 44,
    chords: [
      [207.65, 261.63, 311.13, 392.0], // AbMaj7
      [261.63, 311.13, 392.0, 466.16], // Cm7
      [233.08, 277.18, 349.23, 415.3], // Bbm7
      [155.56, 196.0, 233.08, 293.66], // Eb7
    ],
    tempoMs: 2400,
  },
  {
    id: 4,
    title: 'Oscar Red Carpet Gala',
    genre: 'Triumphant Strings & Fanfare',
    durationSeconds: 42,
    chords: [
      [293.66, 369.99, 440.0, 587.33], // D Major
      [329.63, 392.0, 493.88, 659.25], // E minor
      [246.94, 311.13, 369.99, 493.88], // B minor
      [220.0, 277.18, 329.63, 440.0], // A Major
    ],
    tempoMs: 2000,
  },
  {
    id: 5,
    title: 'Century City Mogul Suite',
    genre: 'High-Stakes Corporate Drama',
    durationSeconds: 46,
    chords: [
      [220.0, 261.63, 329.63, 440.0], // Am
      [174.61, 220.0, 261.63, 349.23], // F
      [261.63, 329.63, 392.0, 523.25], // C
      [196.0, 246.94, 293.66, 392.0], // G
    ],
    tempoMs: 2200,
  },
  {
    id: 6,
    title: 'Paramount Soundstage 4',
    genre: 'Cinematic Production Groove',
    durationSeconds: 45,
    chords: [
      [164.81, 207.65, 246.94, 311.13], // EMaj7
      [185.0, 220.0, 277.18, 329.63], // F#m7
      [207.65, 246.94, 311.13, 369.99], // G#m7
      [220.0, 277.18, 329.63, 415.3], // AMaj7
    ],
    tempoMs: 2500,
  },
  {
    id: 7,
    title: 'Cannes Croisette Waltz',
    genre: 'European Art-House Prestige',
    durationSeconds: 50,
    chords: [
      [196.0, 246.94, 293.66, 369.99], // GMaj7
      [246.94, 293.66, 369.99, 440.0], // Bm7
      [277.18, 329.63, 415.3, 493.88], // C#m7
      [146.83, 185.0, 220.0, 261.63], // D7
    ],
    tempoMs: 2700,
  },
  {
    id: 8,
    title: 'Chinatown Film Noir',
    genre: 'Smoky Detective Brass',
    durationSeconds: 48,
    chords: [
      [146.83, 174.61, 220.0, 261.63], // Dm
      [196.0, 233.08, 293.66, 349.23], // Gm
      [220.0, 277.18, 329.63, 392.0], // A7
      [233.08, 293.66, 349.23, 466.16], // Bb
    ],
    tempoMs: 2900,
  },
  {
    id: 9,
    title: 'Box Office Blockbuster',
    genre: 'Action Tentpole Drive',
    durationSeconds: 40,
    chords: [
      [164.81, 196.0, 246.94, 329.63], // Em
      [261.63, 329.63, 392.0, 523.25], // C
      [196.0, 246.94, 293.66, 392.0], // G
      [146.83, 185.0, 220.0, 293.66], // D
    ],
    tempoMs: 1900,
  },
  {
    id: 10,
    title: 'Malibu Coast Highway',
    genre: 'Chilled Pacific Sunset',
    durationSeconds: 52,
    chords: [
      [246.94, 311.13, 369.99, 466.16], // BMaj7
      [164.81, 207.65, 246.94, 311.13], // EMaj7
      [207.65, 246.94, 311.13, 369.99], // G#m7
      [185.0, 233.08, 277.18, 369.99], // F#
    ],
    tempoMs: 3000,
  },
  {
    id: 11,
    title: 'Chateau Marmont Secrets',
    genre: 'Dramatic Celebrity Intrigue',
    durationSeconds: 45,
    chords: [
      [261.63, 311.13, 392.0, 493.88], // Cm
      [207.65, 261.63, 311.13, 415.3], // Ab
      [174.61, 207.65, 261.63, 349.23], // Fm
      [196.0, 246.94, 293.66, 392.0], // G7
    ],
    tempoMs: 2400,
  },
  {
    id: 12,
    title: 'Broadway Callback Triumph',
    genre: 'Showtime Fanfare',
    durationSeconds: 42,
    chords: [
      [174.61, 220.0, 261.63, 349.23], // F
      [233.08, 293.66, 349.23, 466.16], // Bb
      [261.63, 329.63, 392.0, 523.25], // C
      [146.83, 174.61, 220.0, 293.66], // Dm
    ],
    tempoMs: 2100,
  },
  {
    id: 13,
    title: 'Beverly Hills Red Velvet',
    genre: 'Luxury Cocktail Lounge',
    durationSeconds: 46,
    chords: [
      [155.56, 196.0, 233.08, 293.66], // EbMaj7
      [196.0, 233.08, 293.66, 392.0], // Gm7
      [174.61, 207.65, 261.63, 349.23], // Fm7
      [233.08, 293.66, 349.23, 466.16], // Bb7
    ],
    tempoMs: 2600,
  },
  {
    id: 14,
    title: 'Walk of Fame Induction',
    genre: 'Golden Brass & Strings Anthem',
    durationSeconds: 44,
    chords: [
      [261.63, 329.63, 392.0, 523.25], // C
      [174.61, 220.0, 261.63, 349.23], // F
      [196.0, 246.94, 293.66, 392.0], // G
      [220.0, 261.63, 329.63, 440.0], // Am
    ],
    tempoMs: 2200,
  },
  {
    id: 15,
    title: 'Midnight Premiere Afterparty',
    genre: 'Deep Neon Club Pulse',
    durationSeconds: 48,
    chords: [
      [233.08, 277.18, 349.23, 466.16], // Bbm
      [185.0, 233.08, 277.18, 369.99], // Gb
      [277.18, 349.23, 415.3, 554.37], // Db
      [207.65, 261.63, 311.13, 415.3], // Ab
    ],
    tempoMs: 2300,
  },
];

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;

  // Active Music Engine
  private currentTrackIndex: number = 0;
  private musicInterval: number | null = null;
  private trackTimer: number | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (!this.soundEnabled && !this.musicEnabled) return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
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
    if (this.musicGainNode && this.ctx) {
      try {
        this.musicGainNode.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
      } catch {}
    }
  }

  public setSfxVolume(volPercent: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volPercent / 100));
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public getCurrentTrack(): SoundtrackTrackInfo {
    return HOLLYWOOD_SOUNDTRACK_PLAYLIST[this.currentTrackIndex];
  }

  // ==========================================
  // CONTINUOUS 15-TRACK OFFLINE SOUNDTRACK ENGINE
  // ==========================================

  public playMusicTrack(mode?: MusicTrackMode) {
    if (!this.musicEnabled) return;

    let trackIdx = 0;
    switch (mode) {
      case 'menu':
        trackIdx = 0;
        break;
      case 'relationships':
        trackIdx = 1;
        break;
      case 'empire':
      case 'box_office':
        trackIdx = 4;
        break;
      case 'awards':
      case 'premiere':
        trackIdx = 3;
        break;
      case 'production':
        trackIdx = 5;
        break;
      case 'career':
      default:
        trackIdx = this.currentTrackIndex % HOLLYWOOD_SOUNDTRACK_PLAYLIST.length;
        break;
    }

    this.playTrackAtIndex(trackIdx);
  }

  public startContinuousSoundtrack() {
    if (!this.musicEnabled) return;
    if (this.isMusicPlaying) return;

    this.playTrackAtIndex(this.currentTrackIndex);
  }

  public playNextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % HOLLYWOOD_SOUNDTRACK_PLAYLIST.length;
    this.playTrackAtIndex(this.currentTrackIndex);
  }

  public playTrackAtIndex(index: number) {
    this.stopMusic();
    this.currentTrackIndex = index % HOLLYWOOD_SOUNDTRACK_PLAYLIST.length;
    this.isMusicPlaying = true;

    const track = HOLLYWOOD_SOUNDTRACK_PLAYLIST[this.currentTrackIndex];
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.musicGainNode = ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      this.musicGainNode.gain.exponentialRampToValueAtTime(
        Math.max(0.001, this.musicVolume * 0.14),
        ctx.currentTime + 1.5
      );
      this.musicGainNode.connect(ctx.destination);

      let step = 0;
      const playChordStep = () => {
        if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;

        try {
          const now = this.ctx.currentTime;
          const currentChord = track.chords[step % track.chords.length];

          currentChord.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.001, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.035, now + idx * 0.08 + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + (track.tempoMs / 1000) * 0.95);

            osc.connect(gain);
            gain.connect(this.musicGainNode!);

            osc.start(now + idx * 0.08);
            osc.stop(now + (track.tempoMs / 1000));
          });

          step++;
        } catch {}
      };

      playChordStep();
      this.musicInterval = window.setInterval(playChordStep, track.tempoMs);

      this.trackTimer = window.setTimeout(() => {
        this.playNextTrack();
      }, track.durationSeconds * 1000);
    } catch {}
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.trackTimer) {
      clearTimeout(this.trackTimer);
      this.trackTimer = null;
    }
    if (this.musicGainNode && this.ctx) {
      try {
        this.musicGainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
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

      gain.gain.setValueAtTime(0.12 * this.sfxVolume, ctx.currentTime);
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

      gain.gain.setValueAtTime(0.03 * this.sfxVolume, ctx.currentTime);
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

        gain.gain.setValueAtTime(0.1 * this.sfxVolume, now + idx * 0.05);
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

        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now + i * 0.08);
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

        gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
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
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
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
      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
      gain.gain.linearRampToValueAtTime(0.25 * this.sfxVolume, now + 0.5);
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

      gain.gain.setValueAtTime(0.1 * this.sfxVolume, now);
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
