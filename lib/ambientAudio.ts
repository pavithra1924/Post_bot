export type AmbientSoundscapeType =
  | 'tamil-melody-bgm'
  | 'warm-piano-pad'
  | 'motivational-calm'
  | '432hz-meditation'
  | 'none';

export interface AmbientTrackOption {
  id: AmbientSoundscapeType;
  name: string;
  badge: string;
  description: string;
}

export const AMBIENT_SOUNDSCAPES: AmbientTrackOption[] = [
  {
    id: 'tamil-melody-bgm',
    name: '🎵 Tamil Emotional Piano BGM',
    badge: 'Popular',
    description: 'Iconic Tamil cinema style emotional minor chord progression (Am-F-C-G) with warm piano and soft flute harmonics.',
  },
  {
    id: 'warm-piano-pad',
    name: '🎹 Warm Soothing Piano Chords',
    badge: 'Calm',
    description: 'Warm acoustic piano progressions and analog pads for deep, comforting reflections.',
  },
  {
    id: 'motivational-calm',
    name: '✨ Uplifting Cinematic Strings',
    badge: 'Inspirational',
    description: 'Gentle swelling orchestral pads and strings for quiet perseverance and self-belief.',
  },
  {
    id: '432hz-meditation',
    name: '🌌 432Hz Zen Solitude',
    badge: 'Meditative',
    description: 'Deep resonant ambient drone tuned to 432Hz for peace, grounding, and relief from overthinking.',
  },
  {
    id: 'none',
    name: '🔇 Mute Music',
    badge: 'Silent',
    description: 'No background music.',
  },
];

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private activeInterval: any = null;
  private activeNodes: { stop: () => void }[] = [];
  private currentType: AmbientSoundscapeType = 'tamil-melody-bgm';
  private volume: number = 0.65;
  private isPlaying: boolean = false;

  private initContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return false;
      this.ctx = new AudioCtxClass();

      // Soft limiter / compressor to prevent clipping and ensure clear, loud audio
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(25, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  /**
   * Unlock AudioContext immediately upon user click/tap.
   * Plays a 1ms inaudible buffer so browser autoplay restrictions are lifted.
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

  public getMediaStreamTrack(): MediaStreamTrack | null {
    if (!this.initContext() || !this.ctx || !this.compressor) return null;
    if (!this.mediaStreamDest) {
      this.mediaStreamDest = this.ctx.createMediaStreamDestination();
      this.compressor.connect(this.mediaStreamDest);
    }
    const tracks = this.mediaStreamDest.stream.getAudioTracks();
    return tracks.length > 0 ? tracks[0] : null;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public play(type: AmbientSoundscapeType = 'tamil-melody-bgm') {
    this.stop();
    this.currentType = type;
    if (type === 'none') return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    const ctx = this.ctx;
    const master = this.masterGain;

    if (type === 'tamil-melody-bgm') {
      // Emotional minor progression: Am -> F -> C -> G
      // Chord frequencies in Hz
      const chordProgressions = [
        [220.00, 261.63, 329.63, 440.00], // Am (A3, C4, E4, A4)
        [174.61, 220.00, 261.63, 349.23], // F (F3, A3, C4, F4)
        [261.63, 329.63, 392.00, 523.25], // C (C4, E4, G4, C5)
        [196.00, 246.94, 293.66, 392.00], // G (G3, B3, D4, G4)
      ];

      let chordIndex = 0;

      const playChord = () => {
        if (!this.isPlaying) return;
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
        chordGain.gain.linearRampToValueAtTime(0.42, now + 0.8);
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

        // Add high subtle flute/bell overtone
        const leadOsc = ctx.createOscillator();
        leadOsc.type = 'sine';
        leadOsc.frequency.setValueAtTime(currentChord[2] * 2, now + 0.5);
        const leadGain = ctx.createGain();
        leadGain.gain.setValueAtTime(0.001, now);
        leadGain.gain.linearRampToValueAtTime(0.08, now + 1.2);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6);
        leadOsc.connect(leadGain);
        leadGain.connect(filter);
        leadOsc.start(now + 0.5);
        leadOsc.stop(now + 3.8);
        oscs.push(leadOsc);

        this.activeNodes.push({
          stop: () => {
            oscs.forEach(o => {
              try { o.stop(); o.disconnect(); } catch (_) {}
            });
            try { chordGain.disconnect(); filter.disconnect(); leadGain.disconnect(); } catch (_) {}
          }
        });
      };

      playChord();
      this.activeInterval = setInterval(playChord, 3800);

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
        if (!this.isPlaying) return;
        const notes = chords[idx % chords.length];
        idx++;

        const now = ctx.currentTime;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now);
        filter.connect(master);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.48, now + 0.6);
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

        this.activeNodes.push({
          stop: () => {
            oscs.forEach(o => {
              try { o.stop(); o.disconnect(); } catch (_) {}
            });
            try { gain.disconnect(); filter.disconnect(); } catch (_) {}
          }
        });
      };

      playWarmChord();
      this.activeInterval = setInterval(playWarmChord, 3900);

    } else if (type === 'motivational-calm') {
      // Cinematic uplifting swelling pad
      const chords = [
        [130.81, 196.00, 261.63, 329.63, 392.00], // C maj9
        [110.00, 164.81, 220.00, 261.63, 329.63], // Am9
        [174.61, 220.00, 261.63, 329.63, 392.00], // F maj7#11
        [196.00, 246.94, 293.66, 392.00, 493.88], // G add9
      ];

      let pIdx = 0;
      const playPad = () => {
        if (!this.isPlaying) return;
        const notes = chords[pIdx % chords.length];
        pIdx++;

        const now = ctx.currentTime;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, now);
        filter.connect(master);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.45, now + 1.2);
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

        this.activeNodes.push({
          stop: () => {
            oscs.forEach(o => {
              try { o.stop(); o.disconnect(); } catch (_) {}
            });
            try { gain.disconnect(); filter.disconnect(); } catch (_) {}
          }
        });
      };

      playPad();
      this.activeInterval = setInterval(playPad, 4400);

    } else if (type === '432hz-meditation') {
      const baseFreq = 108; // 432Hz harmonic sub-octave
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
      padGain.gain.setValueAtTime(0.45, now);

      osc1.connect(padGain);
      osc2.connect(padGain);
      osc3.connect(padGain);
      padGain.connect(filter);
      filter.connect(master);

      osc1.start();
      osc2.start();
      osc3.start();

      this.activeNodes.push({
        stop: () => {
          [osc1, osc2, osc3].forEach((o) => {
            try { o.stop(); o.disconnect(); } catch (_) {}
          });
          try { padGain.disconnect(); filter.disconnect(); } catch (_) {}
        },
      });
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
    this.activeNodes.forEach((node) => {
      try { node.stop(); } catch (_) {}
    });
    this.activeNodes = [];
  }
}

export const ambientSoundEngine = new AmbientSoundEngine();
