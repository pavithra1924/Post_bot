import { AmbientSoundscapeType } from './ambientAudio';
import { SlideTimingInfo } from './videoRenderer';

export interface DecodedSlideAudio {
  index: number;
  text: string;
  buffer: AudioBuffer | null;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface StudioAudioSession {
  slideAudios: DecodedSlideAudio[];
  totalDuration: number;
  lang: 'ta' | 'en';
}

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;

  // Active audio sources
  private activeVoiceSources: AudioBufferSourceNode[] = [];
  private activeMusicInterval: any = null;
  private activeMusicNodes: { stop: () => void }[] = [];

  // State
  private voiceVolume: number = 1.0;
  private musicVolume: number = 0.35;
  private isMusicPlaying: boolean = false;
  private currentMusicType: AmbientSoundscapeType = 'tamil-melody-bgm';

  // Cache of decoded audio buffers (key: `${lang}:${text}`)
  private bufferCache = new Map<string, AudioBuffer>();

  public initContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return false;
      this.ctx = new AudioCtxClass();

      // Studio-grade limiter & compressor for rich, punchy, distortion-free audio
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(20, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);

      // Routing:
      // voiceGain -> compressor
      // musicGain -> compressor
      // compressor -> masterGain
      // masterGain -> ctx.destination (speakers)
      // masterGain -> mediaStreamDest (video recorder)
      this.voiceGain.connect(this.compressor);
      this.musicGain.connect(this.compressor);
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  /**
   * Immediately unlocks audio on any user interaction (click/tap) to satisfy browser autoplay policies.
   */
  public unlockAudio(): void {
    if (!this.initContext() || !this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    try {
      const buf = this.ctx.createBuffer(1, 1, 22050);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.connect(this.ctx.destination);
      src.start(0);
    } catch (_) {}
  }

  public getAudioContext(): AudioContext | null {
    this.initContext();
    return this.ctx;
  }

  /**
   * Returns a live MediaStreamTrack containing BOTH Voiceover and Background Music mixed together.
   * This is passed directly to MediaRecorder for high-quality video exports!
   */
  public getMediaStreamTrack(): MediaStreamTrack | null {
    if (!this.initContext() || !this.ctx || !this.masterGain) return null;
    if (!this.mediaStreamDest) {
      this.mediaStreamDest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.mediaStreamDest);
    }
    const tracks = this.mediaStreamDest.stream.getAudioTracks();
    return tracks.length > 0 ? tracks[0] : null;
  }

  public setVoiceVolume(vol: number): void {
    this.voiceVolume = Math.max(0, Math.min(1.5, vol));
    if (this.voiceGain && this.ctx) {
      this.voiceGain.gain.setTargetAtTime(this.voiceVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1.0, vol));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Helper to decode a base64 data URI into an AudioBuffer.
   */
  private async decodeBase64Audio(dataUri: string): Promise<AudioBuffer | null> {
    if (!this.initContext() || !this.ctx) return null;
    try {
      const base64Data = dataUri.split(',')[1] || dataUri;
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return await this.ctx.decodeAudioData(bytes.buffer.slice(0));
    } catch (err) {
      console.warn('Failed to decode audio data:', err);
      return null;
    }
  }

  /**
   * Fetches and decodes real speech audio buffers for all slides in a passage.
   * Returns precise slide durations and start/end timestamps.
   */
  public async loadPassageAudio(
    slides: string[],
    lang: 'ta' | 'en'
  ): Promise<StudioAudioSession> {
    this.initContext();

    // Check if we already have all slides in memory cache
    const uncachedSlides: { text: string; index: number }[] = [];
    const cachedBuffers: (AudioBuffer | null)[] = slides.map((text, idx) => {
      const key = `${lang}:${text.trim()}`;
      if (this.bufferCache.has(key)) {
        return this.bufferCache.get(key)!;
      }
      uncachedSlides.push({ text, index: idx });
      return null;
    });

    // If any slides are uncached, fetch from /api/tts
    if (uncachedSlides.length > 0) {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slides: slides,
            lang: lang,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.slides)) {
            for (const item of data.slides) {
              if (item.audioBase64) {
                const decoded = await this.decodeBase64Audio(item.audioBase64);
                if (decoded) {
                  cachedBuffers[item.index] = decoded;
                  this.bufferCache.set(`${lang}:${item.text.trim()}`, decoded);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching passage audio from TTS API:', err);
      }
    }

    // Build precise slide timeline
    let cumulativeTime = 0.2; // Gentle 200ms intro silence
    const slideAudios: DecodedSlideAudio[] = [];

    for (let i = 0; i < slides.length; i++) {
      const text = slides[i];
      const buffer = cachedBuffers[i];

      let rawDuration = 0;
      if (buffer) {
        rawDuration = buffer.duration;
      } else {
        // Fallback: intelligent word-timing calculation
        const wordCount = text.trim().split(/\s+/).length;
        rawDuration = Math.max(1.8, wordCount * 0.38 + 0.8);
      }

      // Breathing pause between slides (0.45s for emotional storytelling)
      const pause = 0.45;
      const totalSlideDuration = rawDuration + pause;

      const startTime = cumulativeTime;
      const endTime = cumulativeTime + totalSlideDuration;
      cumulativeTime = endTime;

      slideAudios.push({
        index: i,
        text,
        buffer,
        duration: totalSlideDuration,
        startTime,
        endTime,
      });
    }

    const totalDuration = cumulativeTime + 1.2; // Gentle 1.2s serene outro

    return {
      slideAudios,
      totalDuration,
      lang,
    };
  }

  /**
   * Fetches single quote audio for Classic Single Quote mode.
   */
  public async loadSingleQuoteAudio(
    quote: string,
    lang: 'ta' | 'en'
  ): Promise<{ buffer: AudioBuffer | null; duration: number }> {
    this.initContext();
    const key = `${lang}:${quote.trim()}`;
    if (this.bufferCache.has(key)) {
      const buf = this.bufferCache.get(key)!;
      return { buffer: buf, duration: buf.duration + 1.2 };
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: quote, lang }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const decoded = await this.decodeBase64Audio(data.audioBase64);
          if (decoded) {
            this.bufferCache.set(key, decoded);
            return { buffer: decoded, duration: decoded.duration + 1.2 };
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load single quote audio:', err);
    }

    const wordCount = quote.trim().split(/\s+/).length;
    return { buffer: null, duration: Math.max(4.0, wordCount * 0.4 + 1.5) };
  }

  /**
   * Starts synchronized audio playback for preview or export.
   */
  public startPlayback(params: {
    currentTime: number;
    slideAudios: DecodedSlideAudio[];
    isMusicActive: boolean;
    isVoiceActive: boolean;
    ambientType: AmbientSoundscapeType;
  }): void {
    this.stopPlayback();
    if (!this.initContext() || !this.ctx) return;

    const { currentTime, slideAudios, isMusicActive, isVoiceActive, ambientType } = params;

    // 1. Play Background Music if enabled
    if (isMusicActive && ambientType !== 'none') {
      // Auto-duck music slightly when voice is active for professional vocal clarity
      const targetMusicGain = isVoiceActive ? Math.min(0.28, this.musicVolume) : this.musicVolume;
      if (this.musicGain) {
        this.musicGain.gain.setValueAtTime(targetMusicGain, this.ctx.currentTime);
      }
      this.playBackgroundMusic(ambientType);
    }

    // 2. Schedule Voiceover Buffers in perfect synchronization
    if (isVoiceActive && this.voiceGain) {
      this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);

      slideAudios.forEach((item) => {
        if (!item.buffer) return;

        // Check if this slide audio has not yet finished at currentTime
        if (item.endTime > currentTime) {
          const startDelay = Math.max(0, item.startTime - currentTime);
          const bufferOffset = Math.max(0, currentTime - item.startTime);

          if (bufferOffset < item.buffer.duration) {
            try {
              const src = this.ctx!.createBufferSource();
              src.buffer = item.buffer;
              src.connect(this.voiceGain!);

              const when = this.ctx!.currentTime + startDelay;
              const durationRemaining = item.buffer.duration - bufferOffset;
              src.start(when, bufferOffset, durationRemaining);

              this.activeVoiceSources.push(src);
            } catch (err) {
              console.warn('Error scheduling slide audio buffer:', err);
            }
          }
        }
      });
    }
  }

  /**
   * Stops all active voice buffers and background music.
   */
  public stopPlayback(): void {
    // Stop all active voice buffers
    this.activeVoiceSources.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (_) {}
    });
    this.activeVoiceSources = [];

    // Stop background music
    this.stopBackgroundMusic();
  }

  /**
   * Synthesizes and plays ambient background chord progressions.
   */
  public playBackgroundMusic(type: AmbientSoundscapeType): void {
    this.stopBackgroundMusic();
    if (type === 'none' || !this.initContext() || !this.ctx || !this.musicGain) return;

    this.isMusicPlaying = true;
    this.currentMusicType = type;
    const ctx = this.ctx;
    const master = this.musicGain;

    if (type === 'tamil-melody-bgm') {
      // Emotional Tamil cinema minor progression: Am -> F -> C -> G
      const chordProgressions = [
        [220.00, 261.63, 329.63, 440.00], // Am
        [174.61, 220.00, 261.63, 349.23], // F
        [261.63, 329.63, 392.00, 523.25], // C
        [196.00, 246.94, 293.66, 392.00], // G
      ];

      let chordIndex = 0;
      const playChord = () => {
        if (!this.isMusicPlaying) return;
        const currentChord = chordProgressions[chordIndex % chordProgressions.length];
        chordIndex++;

        const now = ctx.currentTime;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(680, now);
        filter.Q.setValueAtTime(1.2, now);
        filter.connect(master);

        const chordGain = ctx.createGain();
        chordGain.gain.setValueAtTime(0.01, now);
        chordGain.gain.linearRampToValueAtTime(0.40, now + 0.8);
        chordGain.gain.exponentialRampToValueAtTime(0.01, now + 3.8);
        chordGain.connect(filter);

        const oscs: OscillatorNode[] = [];
        currentChord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime((idx - 1.5) * 4, now);
          osc.connect(chordGain);
          osc.start(now);
          osc.stop(now + 4.0);
          oscs.push(osc);
        });

        // Soft flute overtone
        const leadOsc = ctx.createOscillator();
        leadOsc.type = 'sine';
        leadOsc.frequency.setValueAtTime(currentChord[2] * 2, now + 0.5);
        const leadGain = ctx.createGain();
        leadGain.gain.setValueAtTime(0.001, now);
        leadGain.gain.linearRampToValueAtTime(0.07, now + 1.2);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6);
        leadOsc.connect(leadGain);
        leadGain.connect(filter);
        leadOsc.start(now + 0.5);
        leadOsc.stop(now + 3.8);
        oscs.push(leadOsc);

        this.activeMusicNodes.push({
          stop: () => {
            oscs.forEach((o) => {
              try { o.stop(); o.disconnect(); } catch (_) {}
            });
            try { chordGain.disconnect(); filter.disconnect(); leadGain.disconnect(); } catch (_) {}
          },
        });
      };

      playChord();
      this.activeMusicInterval = setInterval(playChord, 3800);

    } else if (type === 'warm-piano-pad') {
      // Warm piano chord progression: Dm -> Bb -> F -> C
      const chords = [
        [146.83, 220.00, 261.63, 349.23], // Dm
        [116.54, 174.61, 233.08, 293.66], // Bb
        [174.61, 220.00, 261.63, 349.23], // F
        [130.81, 196.00, 261.63, 329.63], // C
      ];

      let idx = 0;
      const playWarmChord = () => {
        if (!this.isMusicPlaying) return;
        const notes = chords[idx % chords.length];
        idx++;

        const now = ctx.currentTime;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now);
        filter.connect(master);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.42, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 3.9);
        gain.connect(filter);

        const oscs: OscillatorNode[] = [];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 4.0);
          oscs.push(osc);
        });

        this.activeMusicNodes.push({
          stop: () => {
            oscs.forEach((o) => {
              try { o.stop(); o.disconnect(); } catch (_) {}
            });
            try { gain.disconnect(); filter.disconnect(); } catch (_) {}
          },
        });
      };

      playWarmChord();
      this.activeMusicInterval = setInterval(playWarmChord, 3900);

    } else if (type === 'motivational-calm') {
      const chords = [
        [130.81, 196.00, 261.63, 329.63, 392.00], // C maj9
        [110.00, 164.81, 220.00, 261.63, 329.63], // Am9
        [174.61, 220.00, 261.63, 329.63, 392.00], // F maj7#11
        [196.00, 246.94, 293.66, 392.00, 493.88], // G add9
      ];

      let pIdx = 0;
      const playPad = () => {
        if (!this.isMusicPlaying) return;
        const notes = chords[pIdx % chords.length];
        pIdx++;

        const now = ctx.currentTime;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, now);
        filter.connect(master);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.40, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 4.3);
        gain.connect(filter);

        const oscs: OscillatorNode[] = [];
        notes.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.connect(gain);
          osc.start(now);
          osc.stop(now + 4.5);
          oscs.push(osc);
        });

        this.activeMusicNodes.push({
          stop: () => {
            oscs.forEach((o) => {
              try { o.stop(); o.disconnect(); } catch (_) {}
            });
            try { gain.disconnect(); filter.disconnect(); } catch (_) {}
          },
        });
      };

      playPad();
      this.activeMusicInterval = setInterval(playPad, 4400);

    } else if (type === '432hz-meditation') {
      const baseFreq = 108;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(baseFreq * 2, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);

      const padGain = ctx.createGain();
      padGain.gain.setValueAtTime(0.40, now);

      osc1.connect(padGain);
      osc2.connect(padGain);
      osc3.connect(padGain);
      padGain.connect(filter);
      filter.connect(master);

      osc1.start();
      osc2.start();
      osc3.start();

      this.activeMusicNodes.push({
        stop: () => {
          [osc1, osc2, osc3].forEach((o) => {
            try { o.stop(); o.disconnect(); } catch (_) {}
          });
          try { padGain.disconnect(); filter.disconnect(); } catch (_) {}
        },
      });
    }
  }

  public stopBackgroundMusic(): void {
    this.isMusicPlaying = false;
    if (this.activeMusicInterval) {
      clearInterval(this.activeMusicInterval);
      this.activeMusicInterval = null;
    }
    this.activeMusicNodes.forEach((node) => {
      try { node.stop(); } catch (_) {}
    });
    this.activeMusicNodes = [];
  }
}

export const studioAudioEngine = new StudioAudioEngine();
