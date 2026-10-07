export type AmbientSoundscapeType = 'warm-piano-pad' | 'cosmic-meditation' | 'solitude-rain' | 'none';

export interface AmbientTrackOption {
  id: AmbientSoundscapeType;
  name: string;
  badge: string;
  description: string;
}

export const AMBIENT_SOUNDSCAPES: AmbientTrackOption[] = [
  {
    id: 'warm-piano-pad',
    name: '🎹 Warm Ambient Piano Pad',
    badge: 'Soothing',
    description: 'Soft, gentle analog synth chords with low-pass warmth for a comforting, heartfelt mood.',
  },
  {
    id: 'cosmic-meditation',
    name: '🌌 432Hz Cosmic Solitude',
    badge: 'Meditative',
    description: 'Deep, resonant harmonic frequencies tuned for mindfulness and inner strength.',
  },
  {
    id: 'solitude-rain',
    name: '🌧️ Solitude Rain & Mist',
    badge: 'Relaxing',
    description: 'Acoustic gentle rain mist and subtle nocturnal atmosphere.',
  },
  {
    id: 'none',
    name: '🔇 No Music (Voice Only)',
    badge: 'Pure Voice',
    description: 'Speech voiceover with clean silence in the background.',
  },
];

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private currentType: AmbientSoundscapeType = 'warm-piano-pad';
  private volume: number = 0.22;
  private isPlaying: boolean = false;

  private initContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return false;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  public getMediaStreamTrack(): MediaStreamTrack | null {
    if (!this.initContext() || !this.ctx || !this.masterGain) return null;
    if (!this.mediaStreamDest) {
      this.mediaStreamDest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.mediaStreamDest);
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

  public play(type: AmbientSoundscapeType = 'warm-piano-pad') {
    this.stop();
    this.currentType = type;
    if (type === 'none') return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    const ctx = this.ctx;
    const master = this.masterGain;

    if (type === 'warm-piano-pad') {
      // Warm soothing chord frequencies: Db, F, Ab, Db
      const chords = [138.59, 174.61, 207.65, 277.18];

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, ctx.currentTime);
      filter.Q.setValueAtTime(1.1, ctx.currentTime);
      filter.connect(master);

      const chordGain = ctx.createGain();
      chordGain.gain.setValueAtTime(0.24, ctx.currentTime);
      chordGain.connect(filter);

      const chordOscs: OscillatorNode[] = [];
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1.5) * 5, ctx.currentTime);
        osc.connect(chordGain);
        osc.start();
        chordOscs.push(osc);
      });

      this.activeNodes.push({
        stop: () => {
          chordOscs.forEach((o) => {
            try { o.stop(); o.disconnect(); } catch (_) {}
          });
          try { chordGain.disconnect(); filter.disconnect(); } catch (_) {}
        },
      });
    } else if (type === 'cosmic-meditation') {
      const baseFreq = 108; // 432Hz harmonic sub-octave
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      const padGain = ctx.createGain();
      padGain.gain.setValueAtTime(0.32, ctx.currentTime);

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
    } else if (type === 'solitude-rain') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(750, ctx.currentTime);
      rainFilter.Q.setValueAtTime(0.7, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.16, ctx.currentTime);

      noise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(master);

      noise.start();

      this.activeNodes.push({
        stop: () => {
          try { noise.stop(); noise.disconnect(); } catch (_) {}
          try { rainFilter.disconnect(); rainGain.disconnect(); } catch (_) {}
        },
      });
    }
  }

  public stop() {
    this.isPlaying = false;
    this.activeNodes.forEach((node) => node.stop());
    this.activeNodes = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientSoundEngine = new AmbientSoundEngine();
