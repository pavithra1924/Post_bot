export interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
}

export interface VoiceProfile {
  id: 'warm-sweet' | 'calm-storyteller' | 'sweet-angelic' | 'meditative-zen';
  name: string;
  badge: string;
  description: string;
  defaultPitch: number;
  defaultRate: number;
  pauseMultiplier: number;
  sampleQuote: string;
  preferredKeywords: string[];
}

export const WARM_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'warm-sweet',
    name: '🌸 Warm & Sweet Serenade',
    badge: 'Recommended',
    description: 'Gentle, soothing, sweet melodic female voice with calm breathing cadence and heartfelt warmth.',
    defaultPitch: 1.08,
    defaultRate: 0.88,
    pauseMultiplier: 1.3,
    sampleQuote: 'The flame inside you burns brighter than any storm around you. Breathe, trust, and shine.',
    preferredKeywords: [
      'jenny', 'aria', 'sara', 'michelle', 'zira',
      'samantha', 'ava', 'serena', 'karen', 'victoria',
      'google us english', 'female', 'natural', 'online'
    ],
  },
  {
    id: 'calm-storyteller',
    name: '🕯️ Calm Midnight Storyteller',
    badge: 'Reflective',
    description: 'Soft, intimate, warm fireside narration with thoughtful pauses and deep grounding presence.',
    defaultPitch: 0.98,
    defaultRate: 0.85,
    pauseMultiplier: 1.4,
    sampleQuote: 'In the quiet moments before dawn, your character is forged. Keep moving forward in silence.',
    preferredKeywords: [
      'aria', 'jenny', 'natural', 'guy', 'christopher', 'george', 'samantha', 'daniel'
    ],
  },
  {
    id: 'sweet-angelic',
    name: '✨ Soft Angelic Serenity',
    badge: 'Uplifting',
    description: 'Ethereal, crystalline, light and sweet tone for uplifting, emotional motivation.',
    defaultPitch: 1.15,
    defaultRate: 0.90,
    pauseMultiplier: 1.25,
    sampleQuote: 'Every single star shines because it dares to exist in the dark. You are meant to illuminate the world.',
    preferredKeywords: [
      'jenny', 'sara', 'zira', 'karen', 'ava', 'google uk english female', 'victoria', 'female'
    ],
  },
  {
    id: 'meditative-zen',
    name: '🧘 Deep Zen Mindfulness',
    badge: 'Meditative',
    description: 'Slow, peaceful, meditative breathing pace for deep stoic contemplation and inner peace.',
    defaultPitch: 0.95,
    defaultRate: 0.78,
    pauseMultiplier: 1.6,
    sampleQuote: 'Still your mind. The water only becomes clear when you allow the ripples to rest.',
    preferredKeywords: [
      'aria', 'serena', 'jenny', 'natural', 'samantha', 'moira'
    ],
  },
];

export interface VoiceoverOptions {
  rate: number; // 0.75 - 1.25
  pitch: number; // 0.85 - 1.25
  profileId?: 'warm-sweet' | 'calm-storyteller' | 'sweet-angelic' | 'meditative-zen';
  voiceURI?: string;
}

/**
 * Subscribes to browser voice changes (voices load asynchronously).
 */
export function subscribeVoices(callback: (voices: SpeechSynthesisVoice[]) => void): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return () => {};

  const handleUpdate = () => {
    const list = window.speechSynthesis.getVoices();
    if (list.length > 0) {
      callback(list);
    }
  };

  handleUpdate();
  window.speechSynthesis.addEventListener('voiceschanged', handleUpdate);
  return () => {
    window.speechSynthesis.removeEventListener('voiceschanged', handleUpdate);
  };
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Intelligently scores and ranks voices to find the best warm, calm, sweet voice.
 */
export function findBestVoiceForProfile(
  voices: SpeechSynthesisVoice[],
  profileId: 'warm-sweet' | 'calm-storyteller' | 'sweet-angelic' | 'meditative-zen' = 'warm-sweet'
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const profile = WARM_VOICE_PROFILES.find((p) => p.id === profileId) || WARM_VOICE_PROFILES[0];
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
  const candidatePool = englishVoices.length > 0 ? englishVoices : voices;

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -9999;

  for (const voice of candidatePool) {
    const name = voice.name.toLowerCase();
    let score = 0;

    // Heavily penalize harsh or robotic voices
    if (
      name.includes('david') ||
      name.includes('mark') ||
      name.includes('george') ||
      name.includes('desktop') ||
      name.includes('robot')
    ) {
      score -= 80;
    }

    // Natural or online neural voices (Edge / Chrome) are highest fidelity
    if (name.includes('natural') || name.includes('online')) {
      score += 35;
    }

    // Check preferred keywords
    profile.preferredKeywords.forEach((kw, index) => {
      if (name.includes(kw.toLowerCase())) {
        score += 60 - index * 3;
      }
    });

    // For sweet / angelic profiles, give strong bonus to female-sounding voices
    if (profileId === 'warm-sweet' || profileId === 'sweet-angelic') {
      if (
        name.includes('female') ||
        name.includes('jenny') ||
        name.includes('aria') ||
        name.includes('zira') ||
        name.includes('sara') ||
        name.includes('samantha') ||
        name.includes('ava')
      ) {
        score += 30;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }

  return bestVoice || candidatePool[0] || null;
}

/**
 * Finds the best voice taking language into account (supports Tamil and English).
 */
export function findBestVoiceForLanguage(
  voices: SpeechSynthesisVoice[],
  lang: 'en' | 'ta',
  profileId: 'warm-sweet' | 'calm-storyteller' | 'sweet-angelic' | 'meditative-zen' = 'warm-sweet'
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  if (lang === 'ta') {
    const tamilVoices = voices.filter(
      (v) => v.lang.startsWith('ta') || v.lang.toLowerCase().includes('tamil') || v.lang.includes('ta-IN')
    );
    if (tamilVoices.length > 0) return tamilVoices[0];
  }
  return findBestVoiceForProfile(voices, profileId);
}

/**
 * Injects subtle punctuation breathing pauses to make speech synthesis sound human, calm, and warm.
 */
export function formatTextForNaturalCadence(text: string): string {
  return text
    .replace(/—|–/g, ' ... ')
    .replace(/\.\s+/g, '. ... ')
    .replace(/:\s+/g, ': ... ')
    .replace(/;\s+/g, '; ... ')
    .trim();
}

/**
 * Calculates estimated word timings for kinetic subtitles based on speech rate and calm pause multipliers.
 */
export function calculateWordTimings(
  text: string,
  rate = 0.9,
  pauseMultiplier = 1.3
): { words: WordTiming[]; totalDuration: number } {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return { words: [], totalDuration: 0 };

  const msPerWord = 340 / rate; // Relaxed speaking rate
  let currentTime = 0.6; // Gentle initial silence

  const wordTimings: WordTiming[] = words.map((word) => {
    let extraPause = 0;
    if (/[.!?]$/.test(word)) {
      extraPause = 360 * pauseMultiplier;
    } else if (/[,;:]$/.test(word)) {
      extraPause = 200 * pauseMultiplier;
    } else if (/—|–|\.\.\./.test(word)) {
      extraPause = 300 * pauseMultiplier;
    }

    const duration = (msPerWord + extraPause) / 1000;
    const start = currentTime;
    const end = currentTime + duration;
    currentTime = end;
    return {
      word,
      startTime: start,
      endTime: end,
    };
  });

  return {
    words: wordTimings,
    totalDuration: currentTime + 1.4, // Serene outro pause
  };
}

/**
 * Plays the quote via Web Speech Synthesis with warm, calm, sweet acoustics.
 */
export function playVoiceover(
  text: string,
  options: VoiceoverOptions = { rate: 0.88, pitch: 1.08, profileId: 'warm-sweet' },
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  window.speechSynthesis.cancel();

  // Natural cadence formatted text
  const cadenceText = formatTextForNaturalCadence(text);
  const utterance = new SpeechSynthesisUtterance(cadenceText);

  utterance.rate = options.rate;
  utterance.pitch = options.pitch;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (options.voiceURI) {
      const explicitVoice = voices.find((v) => v.voiceURI === options.voiceURI);
      if (explicitVoice) utterance.voice = explicitVoice;
    }

    if (!utterance.voice) {
      const bestWarmVoice = findBestVoiceForProfile(voices, options.profileId || 'warm-sweet');
      if (bestWarmVoice) {
        utterance.voice = bestWarmVoice;
      }
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  // Speak with gentle delay to avoid speech-synthesis clipping
  setTimeout(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.speak(utterance);
    }
  }, 120);

  return utterance;
}

export function stopVoiceover(): void {
  if (typeof window === 'undefined') return;
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if ((window as any).__activeAudioElement) {
    try {
      (window as any).__activeAudioElement.pause();
      (window as any).__activeAudioElement.currentTime = 0;
    } catch (_) {}
    (window as any).__activeAudioElement = null;
  }
}

/**
 * Fetches ultra-realistic studio speech from /api/tts.
 * Supports Tamil ('ta') and English ('en').
 */
export async function fetchRealisticVoiceAudio(
  text: string,
  lang: string = 'ta'
): Promise<{ audioBase64: string } | null> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang }),
    });

    if (!res.ok) {
      throw new Error(`TTS API failed with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch realistic voice:', err);
    return null;
  }
}

/**
 * Plays ultra-realistic voice audio via HTML5 Audio with onEnd callback.
 */
export function playRealisticVoiceAudio(
  audioBase64: string,
  onEnd?: () => void
): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  stopVoiceover();

  const audio = new Audio(audioBase64);
  (window as any).__activeAudioElement = audio;

  if (onEnd) {
    audio.onended = () => {
      (window as any).__activeAudioElement = null;
      onEnd();
    };
  }

  audio.play().catch((err) => {
    console.warn('Playback error (browser autoplay policy):', err);
  });

  return audio;
}
