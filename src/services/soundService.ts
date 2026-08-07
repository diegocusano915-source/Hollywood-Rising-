/**
 * HOLLYWOOD RISING - Offline Soundtrack & Adaptive Music Engine
 * Plays actual recorded audio tracks stored locally in /public/audio/ in an endless playlist.
 * Features: Continuous playback, auto-track advance, smooth cross-fading, volume control, track title metadata.
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
  filename: string;
  durationSeconds: number;
}

export const HOLLYWOOD_SOUNDTRACK_PLAYLIST: SoundtrackTrackInfo[] = [
  { id: 1, title: 'Sunset Boulevard Soul', genre: 'Soulful Neo-Soul', filename: 'track_1.mp3', durationSeconds: 45 },
  { id: 2, title: 'Bel-Air Chillhop', genre: 'Smooth Chillhop Lofi', filename: 'track_2.mp3', durationSeconds: 48 },
  { id: 3, title: 'Hollywood Golden Hour', genre: 'Warm Soulful Piano', filename: 'track_3.mp3', durationSeconds: 45 },
  { id: 4, title: 'Midnight Penthouse', genre: 'Ambient Jazz & Rhodes', filename: 'track_4.mp3', durationSeconds: 52 },
  { id: 5, title: 'Malibu Ocean Breeze', genre: 'Smooth California Soul', filename: 'track_5.mp3', durationSeconds: 50 },
  { id: 6, title: 'Chateau Marmont Noir', genre: 'Late-Night Velvet Soul', filename: 'track_6.mp3', durationSeconds: 48 },
  { id: 7, title: 'Oscar Prestige Gala', genre: 'Cinematic Orchestral Soul', filename: 'track_7.mp3', durationSeconds: 55 },
  { id: 8, title: 'Century City Horizon', genre: 'Mellow Lounge Ambient', filename: 'track_8.mp3', durationSeconds: 50 },
  { id: 9, title: 'Rodeo Drive Velvet', genre: 'Lush Acoustic Harmonies', filename: 'track_9.mp3', durationSeconds: 52 },
  { id: 10, title: 'Pacific Coast Twilight', genre: 'Chill Acoustic Vibe', filename: 'track_10.mp3', durationSeconds: 50 },
  { id: 11, title: 'Starlight Studio Vibes', genre: 'Hip-Hop Soul & Rhodes', filename: 'track_11.mp3', durationSeconds: 55 },
  { id: 12, title: 'The Star Journey', genre: 'Triumphant Emotional Anthem', filename: 'track_12.mp3', durationSeconds: 50 },
];

class SoundService {
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicVolume: number = 0.7;
  private sfxVolume: number = 0.8;

  // Active HTML5 Audio Player
  private currentTrackIndex: number = 0;
  private audioPlayer: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private onTrackChangeCallbacks: ((track: SoundtrackTrackInfo) => void)[] = [];

  // Web Audio Context for SFX
  private ctx: AudioContext | null = null;

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
      ctx.resume().catch(() => {});
    }
    if (this.musicEnabled && !this.isMusicPlaying) {
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
    if (this.audioPlayer) {
      this.audioPlayer.volume = this.musicVolume;
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
  // PLAYLIST AUDIO ENGINE (ACTUAL AUDIO FILES)
  // ==========================================

  public playMusicTrack(mode?: MusicTrackMode) {
    if (!this.musicEnabled) return;

    let trackIdx = this.currentTrackIndex;
    if (mode === 'menu') trackIdx = 0;
    else if (mode === 'relationships') trackIdx = 1;
    else if (mode === 'empire' || mode === 'box_office') trackIdx = 4;
    else if (mode === 'awards' || mode === 'premiere') trackIdx = 6;
    else if (mode === 'production') trackIdx = 10;

    this.playTrackAtIndex(trackIdx);
  }

  public startContinuousSoundtrack() {
    if (!this.musicEnabled) return;
    if (this.isMusicPlaying && this.audioPlayer && !this.audioPlayer.paused) return;

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
    if (typeof window === 'undefined') return;

    this.currentTrackIndex = index % HOLLYWOOD_SOUNDTRACK_PLAYLIST.length;
    const track = HOLLYWOOD_SOUNDTRACK_PLAYLIST[this.currentTrackIndex];

    // Notify listeners of track change
    this.onTrackChangeCallbacks.forEach((cb) => {
      try { cb(track); } catch {}
    });

    try {
      if (!this.audioPlayer) {
        this.audioPlayer = new Audio();
        this.audioPlayer.addEventListener('ended', () => {
          this.playNextTrack();
        });
      }

      const audioSrc = `/audio/${track.filename}`;
      this.audioPlayer.src = audioSrc;
      this.audioPlayer.volume = this.musicVolume;
      this.audioPlayer.currentTime = 0;

      const playPromise = this.audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
          })
          .catch(() => {
            // Autoplay blocked prior to user gesture; will unlock on first tap
            this.isMusicPlaying = false;
          });
      }
    } catch {}
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.audioPlayer) {
      try {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
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
