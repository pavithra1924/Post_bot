export type TamilBgmCategory = 'mild-bgm' | 'anirudh-hype' | 'arr-legends' | 'yuvan-cult' | 'ilaiyaraaja-classic' | 'famous-lines';

export interface TamilAudioTrack {
  id: string;
  name: string;
  subtitle: string;
  category: TamilBgmCategory;
  categoryLabel: string;
  composerOrSpeaker: string;
  famousLineTamil?: string;
  type: 'synth-procedural' | 'audio-url' | 'custom-upload';
  audioUrl?: string;
}

export const TAMIL_AUDIO_LIBRARY: TamilAudioTrack[] = [
  // 1. Mild Acoustic & Flute Loops (Perfect for calm quotes)
  {
    id: 'carnatic-flute',
    name: 'புல்லாங்குழல் தியானம் (Carnatic Flute Peace)',
    subtitle: 'Soulful bamboo flute meditation in Mohanam raga',
    category: 'mild-bgm',
    categoryLabel: '🌿 அமைதியான BGM (Mild BGM)',
    composerOrSpeaker: 'Classical Instrumentals',
    type: 'synth-procedural',
  },
  {
    id: 'acoustic-morning',
    name: 'விடியலின் கீதம் (Acoustic Morning Strings)',
    subtitle: 'Warm morning fingerstyle acoustic guitar chords',
    category: 'mild-bgm',
    categoryLabel: '🌿 அமைதியான BGM (Mild BGM)',
    composerOrSpeaker: 'Acoustic Harmonies',
    type: 'synth-procedural',
  },
  {
    id: 'veena-peace',
    name: 'வீணை நாதம் (Sacred Veena Serenity)',
    subtitle: 'Gentle temple veena resonance & ambient bells',
    category: 'mild-bgm',
    categoryLabel: '🌿 அமைதியான BGM (Mild BGM)',
    composerOrSpeaker: 'Traditional Strings',
    type: 'synth-procedural',
  },

  // 2. Anirudh High-Energy Themes
  {
    id: 'anirudh-master',
    name: 'Master — JD Intro Theme',
    subtitle: 'Iconic swagger whistling & motivational beat',
    category: 'anirudh-hype',
    categoryLabel: '🔥 அனிருத் வெறித்தனம் (Anirudh BGM)',
    composerOrSpeaker: 'அனிருத் (Anirudh Ravichander)',
    famousLineTamil: 'நம்ம காலம் வரும் போது வேடிக்கை பாருடா!',
    type: 'synth-procedural',
  },
  {
    id: 'anirudh-vikram',
    name: 'Vikram — Rolex & Once Upon a Time',
    subtitle: 'Dark adrenaline orchestral surge',
    category: 'anirudh-hype',
    categoryLabel: '🔥 அனிருத் வெறித்தனம் (Anirudh BGM)',
    composerOrSpeaker: 'அனிருத் (Anirudh Ravichander)',
    famousLineTamil: 'ஆரம்பிக்கலாங்களா!',
    type: 'synth-procedural',
  },
  {
    id: 'anirudh-vip',
    name: 'VIP — Velaiilla Pattadhari Theme',
    subtitle: 'The ultimate youth hustle & fire anthem',
    category: 'anirudh-hype',
    categoryLabel: '🔥 அனிருத் வெறித்தனம் (Anirudh BGM)',
    composerOrSpeaker: 'அனிருத் (Anirudh Ravichander)',
    famousLineTamil: 'வாழ்க்கையில ஜெயிக்கிறதுக்கு ஆயிரம் வழி இருக்கு!',
    type: 'synth-procedural',
  },
  {
    id: 'anirudh-jersey',
    name: 'Jersey — Spirit of Jersey',
    subtitle: 'Heart-wrenching emotional triumph theme',
    category: 'anirudh-hype',
    categoryLabel: '🔥 அனிருத் வெறித்தனம் (Anirudh BGM)',
    composerOrSpeaker: 'அனிருத் (Anirudh Ravichander)',
    type: 'synth-procedural',
  },

  // 3. A.R. Rahman Soulful Legends
  {
    id: 'arr-roja-bombay',
    name: 'Roja & Bombay Soulful Flute',
    subtitle: 'Ethereal strings & legendary Oscar melody',
    category: 'arr-legends',
    categoryLabel: '✨ ஏ.ஆர். ரஹ்மான் காவியங்கள் (ARR Legends)',
    composerOrSpeaker: 'ஏ.ஆர். ரஹ்மான் (A.R. Rahman)',
    type: 'synth-procedural',
  },
  {
    id: 'arr-padayappa',
    name: 'Padayappa — Singa Nadai Theme',
    subtitle: 'Unstoppable majestic lion walk BGM',
    category: 'arr-legends',
    categoryLabel: '✨ ஏ.ஆர். ரஹ்மான் காவியங்கள் (ARR Legends)',
    composerOrSpeaker: 'ஏ.ஆர். ரஹ்மான் (A.R. Rahman)',
    famousLineTamil: 'என் வழி தனி வழி!',
    type: 'synth-procedural',
  },
  {
    id: 'arr-sivaji',
    name: 'Sivaji — The Boss Style',
    subtitle: 'Supreme billionaire mass swagger',
    category: 'arr-legends',
    categoryLabel: '✨ ஏ.ஆர். ரஹ்மான் காவியங்கள் (ARR Legends)',
    composerOrSpeaker: 'ஏ.ஆர். ரஹ்மான் (A.R. Rahman)',
    famousLineTamil: 'சிங்கம் சிங்கிளா தான் வரும்!',
    type: 'synth-procedural',
  },
  {
    id: 'arr-vande-mataram',
    name: 'Vande Mataram — Revival Anthem',
    subtitle: 'Pure goosebumps patriotic fire',
    category: 'arr-legends',
    categoryLabel: '✨ ஏ.ஆர். ரஹ்மான் காவியங்கள் (ARR Legends)',
    composerOrSpeaker: 'ஏ.ஆர். ரஹ்மான் (A.R. Rahman)',
    type: 'synth-procedural',
  },

  // 4. Yuvan Shankar Raja Cult Melodies
  {
    id: 'yuvan-7g',
    name: '7G Rainbow Colony Flute Theme',
    subtitle: 'Cult melancholy & unforgettable emotional depth',
    category: 'yuvan-cult',
    categoryLabel: '🖤 யுவன் டிரக்ஸ் (Yuvan Cult Hits)',
    composerOrSpeaker: 'யுவன் சங்கர் ராஜா (Yuvan Shankar Raja)',
    type: 'synth-procedural',
  },
  {
    id: 'yuvan-pudhupettai',
    name: 'Pudhupettai — Kokki Kumar Survival',
    subtitle: 'Raw street survival & relentless climb to power',
    category: 'yuvan-cult',
    categoryLabel: '🖤 யுவன் டிரக்ஸ் (Yuvan Cult Hits)',
    composerOrSpeaker: 'யுவன் சங்கர் ராஜா (Yuvan Shankar Raja)',
    famousLineTamil: 'ஒருத்தன் மேல வரணும்னா அவன் எதையும் தாங்கணும்!',
    type: 'synth-procedural',
  },
  {
    id: 'yuvan-mankatha',
    name: 'Mankatha — Vinayak Mahadev Swagger',
    subtitle: 'Ruthless swagger & unapologetic attitude',
    category: 'yuvan-cult',
    categoryLabel: '🖤 யுவன் டிரக்ஸ் (Yuvan Cult Hits)',
    composerOrSpeaker: 'யுவன் சங்கர் ராஜா (Yuvan Shankar Raja)',
    type: 'synth-procedural',
  },

  // 5. Ilaiyaraaja Timeless Classics
  {
    id: 'raaja-thalapathi',
    name: 'Thalapathi — Friendship Theme',
    subtitle: 'The timeless bond of Surya and Deva',
    category: 'ilaiyaraaja-classic',
    categoryLabel: '🎻 இளையராஜா இசை (Ilaiyaraaja Classics)',
    composerOrSpeaker: 'இளையராஜா (Ilaiyaraaja)',
    type: 'synth-procedural',
  },
  {
    id: 'raaja-nayakan',
    name: 'Nayakan — Thenpandi Cheemayile',
    subtitle: 'Timeless soul masterpiece',
    category: 'ilaiyaraaja-classic',
    categoryLabel: '🎻 இளையராஜா இசை (Ilaiyaraaja Classics)',
    composerOrSpeaker: 'இளையராஜா (Ilaiyaraaja)',
    famousLineTamil: 'நல்லவரா கெட்டவரான்னு தெரியலப்பா...',
    type: 'synth-procedural',
  },

  // 6. Iconic Tamil Motivational Dialogue Lines
  {
    id: 'quote-kalam',
    name: 'ஏ.பி.ஜே. அப்துல் கலாம் — கனவு காணுங்கள்',
    subtitle: 'கனவு என்பது நீங்கள் தூங்கும் போது காண்பதல்ல, உங்களைத் தூங்க விடாமல் செய்வதே கனவு!',
    category: 'famous-lines',
    categoryLabel: '🎙️ வைரல் வசனங்கள் (Famous Lines)',
    composerOrSpeaker: 'டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம்',
    famousLineTamil: 'கனவு காணுங்கள்! வானமே நமக்கு எல்லை!',
    type: 'synth-procedural',
  },
  {
    id: 'quote-bharathiyar',
    name: 'மகாகவி பாரதியார் — ரௌத்திரம் பழகு',
    subtitle: 'அச்சமில்லை அச்சமில்லை அச்சமென்பதில்லையே! நிமிர்ந்த நன்னடை நேர்கொண்ட பார்வை!',
    category: 'famous-lines',
    categoryLabel: '🎙️ வைரல் வசனங்கள் (Famous Lines)',
    composerOrSpeaker: 'மகாகவி பாரதியார்',
    famousLineTamil: 'ரௌத்திரம் பழகு! வீழ்வேனென்று நினைத்தாயோ!',
    type: 'synth-procedural',
  },
  {
    id: 'quote-rajini',
    name: 'ரஜினிகாந்த் — கஷ்டப்படாம எதுவும் கிடைக்காது',
    subtitle: 'கஷ்டப்படாம எதுவும் கிடைக்காது, கஷ்டப்படாம கிடைக்கிறது என்னைக்குமே நிலைக்காது!',
    category: 'famous-lines',
    categoryLabel: '🎙️ வைரல் வசனங்கள் (Famous Lines)',
    composerOrSpeaker: 'சூப்பர் ஸ்டார் ரஜினிகாந்த்',
    famousLineTamil: 'உன் வாழ்க்கையை நீ தான் உருவாக்கணும்!',
    type: 'synth-procedural',
  },
  {
    id: 'quote-vijay',
    name: 'விஜய் — வெற்றி நிச்சயம், வேடிக்கை பாரு',
    subtitle: 'நீ யாராக இருந்தாலும் சரி, உன் உழைப்பும் தன்னம்பிக்கையும் தான் உன் அடையாளம்!',
    category: 'famous-lines',
    categoryLabel: '🎙️ வைரல் வசனங்கள் (Famous Lines)',
    composerOrSpeaker: 'தளபதி விஜய்',
    famousLineTamil: 'வெற்றி நிச்சயம், வேடிக்கை பாரு!',
    type: 'synth-procedural',
  },
];

class TamilAudioPlayerEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private activeSynthNodes: { stop: () => void }[] = [];
  private volume: number = 0.24; // Mild BGM default
  private currentTrackId: string = 'carnatic-flute';
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
    if (this.currentAudioElement) {
      this.currentAudioElement.volume = this.volume;
    }
  }

  public playTrack(trackId: string, customAudioUrl?: string) {
    this.stop();
    this.currentTrackId = trackId;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    const ctx = this.ctx;
    const master = this.masterGain;

    if (customAudioUrl) {
      // Play custom user MP3 file or URL
      const audio = new Audio(customAudioUrl);
      audio.loop = true;
      audio.volume = this.volume;
      audio.play().catch((err) => console.warn('Custom audio play error:', err));
      this.currentAudioElement = audio;
      return;
    }

    // Procedural synthesis for Tamil tracks
    if (trackId === 'carnatic-flute' || trackId === 'arr-roja-bombay' || trackId === 'yuvan-7g') {
      // Mohanam / Yaman Kalyani Raga pentatonic frequencies (C4, D4, E4, G4, A4, C5)
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      filter.connect(master);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.connect(filter);

      const oscs: OscillatorNode[] = [];
      // Rich breathy flute tone with subtle vibrato
      [notes[0], notes[2], notes[4]].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((i - 1) * 6, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        oscs.push(osc);
      });

      this.activeSynthNodes.push({
        stop: () => {
          oscs.forEach((o) => {
            try { o.stop(); o.disconnect(); } catch (_) {}
          });
          try { gain.disconnect(); filter.disconnect(); } catch (_) {}
        },
      });
    } else if (trackId.includes('anirudh') || trackId.includes('sivaji') || trackId.includes('mankatha')) {
      // High-energy pulse & synth bass theme
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.connect(master);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.26, ctx.currentTime);
      gain.connect(filter);

      // Bass notes
      const bassFreqs = [73.42, 110.00, 146.83]; // D2, A2, D3
      const oscs: OscillatorNode[] = [];
      bassFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        oscs.push(osc);
      });

      this.activeSynthNodes.push({
        stop: () => {
          oscs.forEach((o) => {
            try { o.stop(); o.disconnect(); } catch (_) {}
          });
          try { gain.disconnect(); filter.disconnect(); } catch (_) {}
        },
      });
    } else {
      // Gentle acoustic warm chords (G major -> Em -> C -> D)
      const chordFreqs = [196.00, 246.94, 293.66, 392.00]; // G3, B3, D4, G4
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.connect(master);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.20, ctx.currentTime);
      gain.connect(filter);

      const oscs: OscillatorNode[] = [];
      chordFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        oscs.push(osc);
      });

      this.activeSynthNodes.push({
        stop: () => {
          oscs.forEach((o) => {
            try { o.stop(); o.disconnect(); } catch (_) {}
          });
          try { gain.disconnect(); filter.disconnect(); } catch (_) {}
        },
      });
    }
  }

  public stop() {
    this.isPlaying = false;
    this.activeSynthNodes.forEach((n) => n.stop());
    this.activeSynthNodes = [];
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (_) {}
      this.currentAudioElement = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const tamilAudioPlayer = new TamilAudioPlayerEngine();
