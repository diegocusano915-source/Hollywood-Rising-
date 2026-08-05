/**
 * HOLLYWOOD RISING - Synthesized Web Audio Sound & Adaptive Music Engine
 * Provides Hollywood-style chimes, clicks, gold shimmers, level-up fanfares,
 * camera flashes, applause, crowd cheers, and adaptive procedural music tracks.
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
  | 'settings';

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;

  // Active Music Synthesis Nodes
  private currentTrackMode: MusicTrackMode | null = null;
  private musicInterval: number | null = null;
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
      this.ctx.resume();
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
    } else if (this.currentTrackMode) {
      this.playMusicTrack(this.currentTrackMode);
    }
  }

  public setMusicVolume(volPercent: number) {
    this.musicVolume = Math.max(0, Math.min(1, volPercent / 100));
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
    }
  }

  public setSfxVolume(volPercent: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volPercent / 100));
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
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
    } catch {
      // Audio fallback
    }
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
    } catch {
      // Audio fallback
    }
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
    } catch {
      // Audio fallback
    }
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
    } catch {
      // Audio fallback
    }
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
    } catch {
      // Audio fallback
    }
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
    } catch {
      // Audio fallback
    }
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
        // Simulating crowd clapping pulses
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
    } catch {
      // Audio fallback
    }
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
    } catch {
      // Audio fallback
    }
  }

  public playContractSigned() {
    this.playFanfare();
  }

  public playAwardWon() {
    this.playApplause();
    setTimeout(() => this.playFanfare(), 300);
  }

  // ==========================================
  // ADAPTIVE PROCEDURAL BACKGROUND MUSIC
  // ==========================================

  public playMusicTrack(mode: MusicTrackMode) {
    if (!this.musicEnabled) return;
    if (this.currentTrackMode === mode && this.isMusicPlaying) return;

    this.stopMusic();
    this.currentTrackMode = mode;
    this.isMusicPlaying = true;

    const ctx = this.getContext();
    if (!ctx) return;

    this.musicGainNode = ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    this.musicGainNode.gain.exponentialRampToValueAtTime(
      Math.max(0.001, this.musicVolume * 0.12),
      ctx.currentTime + 1.2
    );
    this.musicGainNode.connect(ctx.destination);

    // Set scale notes based on track mode
    let chordProgression: number[][] = [];
    let tempoMs = 2400;

    switch (mode) {
      case 'menu':
        // Warm Luxury Gold scale (Db Major 7)
        chordProgression = [
          [277.18, 349.23, 415.3, 523.25], // DbMaj7
          [311.13, 369.99, 466.16, 554.37], // Ebm7
          [220.0, 277.18, 329.63, 415.3], // Fm7
          [246.94, 311.13, 369.99, 466.16], // GbMaj7
        ];
        tempoMs = 2800;
        break;
      case 'awards':
      case 'premiere':
        // Grand Oscar Fanfare (D Major triumph)
        chordProgression = [
          [293.66, 369.99, 440.0, 587.33], // D Major
          [329.63, 392.0, 493.88, 659.25], // E minor
          [246.94, 311.13, 369.99, 493.88], // B minor
          [220.0, 277.18, 329.63, 440.0], // A Major
        ];
        tempoMs = 2000;
        break;
      case 'empire':
      case 'box_office':
        // High Stakes Business (A minor / C Major)
        chordProgression = [
          [220.0, 261.63, 329.63, 440.0], // Am
          [174.61, 220.0, 261.63, 349.23], // F
          [261.63, 329.63, 392.0, 523.25], // C
          [196.0, 246.94, 293.66, 392.0], // G
        ];
        tempoMs = 2200;
        break;
      case 'relationships':
        // Gentle Intimate Sunset (F Major 7)
        chordProgression = [
          [174.61, 220.0, 261.63, 329.63], // FMaj7
          [220.0, 261.63, 329.63, 440.0], // Am7
          [146.83, 174.61, 220.0, 293.66], // Dm7
          [196.0, 246.94, 293.66, 392.0], // C7
        ];
        tempoMs = 3000;
        break;
      case 'career':
      case 'production':
      case 'settings':
      default:
        // Inspirational Creative Vibe (E Major 7)
        chordProgression = [
          [164.81, 207.65, 246.94, 311.13], // EMaj7
          [185.0, 220.0, 277.18, 329.63], // F#m7
          [207.65, 246.94, 311.13, 369.99], // G#m7
          [220.0, 277.18, 329.63, 415.3], // AMaj7
        ];
        tempoMs = 2500;
        break;
    }

    let step = 0;
    const playChordStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;

      try {
        const now = this.ctx.currentTime;
        const currentChord = chordProgression[step % chordProgression.length];

        currentChord.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.001, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.04, now + idx * 0.08 + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (tempoMs / 1000) * 0.95);

          osc.connect(gain);
          gain.connect(this.musicGainNode!);

          osc.start(now + idx * 0.08);
          osc.stop(now + (tempoMs / 1000));
        });

        step++;
      } catch {
        // Fallback
      }
    };

    playChordStep();
    this.musicInterval = window.setInterval(playChordStep, tempoMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGainNode && this.ctx) {
      try {
        this.musicGainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {
        // Fallback
      }
    }
    this.currentTrackMode = null;
  }
}

export const soundService = new SoundService();
