'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CARTOON_CHARACTERS } from '@/lib/cartoonAvatars';
import { renderVideoFrame } from '@/lib/videoRenderer';
import {
  calculateWordTimings,
  playVoiceover,
  stopVoiceover,
  subscribeVoices,
  WARM_VOICE_PROFILES,
  VoiceProfile,
  findBestVoiceForProfile,
} from '@/lib/voiceoverTTS';
import {
  ambientSoundEngine,
  AMBIENT_SOUNDSCAPES,
  AmbientSoundscapeType,
} from '@/lib/ambientAudio';
import { exportReelVideo, downloadVideoBlob, ExportProgress } from '@/lib/videoExporter';
import { PRESET_QUOTES } from '@/lib/presets';
import { TAMIL_PRESET_QUOTES, TamilQuoteItem } from '@/lib/tamilPresets';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  Dices,
  Film,
  Zap,
  Heart,
  Music,
  Sliders,
  Check,
  Headphones,
} from 'lucide-react';

interface VideoStudioViewProps {
  initialQuote?: string;
  initialAuthor?: string;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({
  initialQuote,
  initialAuthor,
}) => {
  const isInitialTamil = initialQuote ? /[\u0B80-\u0BFF]/.test(initialQuote) : false;
  const [quoteLanguage, setQuoteLanguage] = useState<'ta' | 'en'>(isInitialTamil ? 'ta' : 'en');
  const [tamilCategory, setTamilCategory] = useState<string>('all');
  const [englishCategory, setEnglishCategory] = useState<string>('all');
  const [tamilQuoteIndex, setTamilQuoteIndex] = useState(0);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);
  const [quote, setQuote] = useState(initialQuote || (isInitialTamil ? TAMIL_PRESET_QUOTES[0].quote : PRESET_QUOTES[0].quote));
  const [author, setAuthor] = useState(initialAuthor || (isInitialTamil ? TAMIL_PRESET_QUOTES[0].author : PRESET_QUOTES[0].author));
  const [selectedCharacter, setSelectedCharacter] = useState<'anime-warrior' | 'minimalist-doodle' | 'stoic-monk' | 'cosmic-wanderer'>('anime-warrior');
  const [particleType, setParticleType] = useState<'sparks' | 'mist' | 'stars' | 'rain'>('sparks');
  const [handle, setHandle] = useState('@_sparkwithin_hub_');

  // Sync external quote when passed from TamilStudio, English Studio or AutoPilot
  useEffect(() => {
    if (initialQuote) {
      setQuote(initialQuote);
      if (initialAuthor) setAuthor(initialAuthor);
      const isTam = /[\u0B80-\u0BFF]/.test(initialQuote);
      if (isTam) {
        setQuoteLanguage('ta');
        setIsVoiceoverActive(false);
        setIsMusicActive(true);
      } else {
        setQuoteLanguage('en');
        setIsVoiceoverActive(true);
      }
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [initialQuote, initialAuthor]);

  // Voiceover & Warm Voice State
  const [voiceProfileId, setVoiceProfileId] = useState<'warm-sweet' | 'calm-storyteller' | 'sweet-angelic' | 'meditative-zen'>('warm-sweet');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speechRate, setSpeechRate] = useState(0.88);
  const [voicePitch, setVoicePitch] = useState(1.08);
  const [isVoiceoverActive, setIsVoiceoverActive] = useState(true);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // Ambient Music State
  const [ambientType, setAmbientType] = useState<AmbientSoundscapeType>('warm-piano-pad');
  const [ambientVolume, setAmbientVolume] = useState(0.22);
  const [isMusicActive, setIsMusicActive] = useState(true);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Current active profile
  const currentProfile = WARM_VOICE_PROFILES.find((p) => p.id === voiceProfileId) || WARM_VOICE_PROFILES[0];

  // Subscribe to system voices
  useEffect(() => {
    const unsubscribe = subscribeVoices((voices) => {
      setAvailableVoices(voices);
      if (!selectedVoiceURI) {
        const best = findBestVoiceForProfile(voices, voiceProfileId);
        if (best) setSelectedVoiceURI(best.voiceURI);
      }
    });
    return () => unsubscribe();
  }, [voiceProfileId, selectedVoiceURI]);

  // Update volume in ambient engine
  useEffect(() => {
    ambientSoundEngine.setVolume(isMusicActive ? ambientVolume : 0);
  }, [ambientVolume, isMusicActive]);

  // Calculate word timings using current profile settings
  const { words: wordTimings, totalDuration } = calculateWordTimings(
    quote,
    speechRate,
    currentProfile.pauseMultiplier
  );

  // Switch voice profile
  const handleSelectVoiceProfile = (profile: VoiceProfile) => {
    setVoiceProfileId(profile.id);
    setSpeechRate(profile.defaultRate);
    setVoicePitch(profile.defaultPitch);
    if (availableVoices.length > 0) {
      const best = findBestVoiceForProfile(availableVoices, profile.id);
      if (best) setSelectedVoiceURI(best.voiceURI);
    }
    stopPlaybackAndAudio();
  };

  // Filtered Tamil quotes pool
  const filteredTamilQuotes = tamilCategory === 'all'
    ? TAMIL_PRESET_QUOTES
    : TAMIL_PRESET_QUOTES.filter((q) => q.category === tamilCategory);

  // Filtered English quotes pool
  const filteredEnglishQuotes = englishCategory === 'all'
    ? PRESET_QUOTES
    : PRESET_QUOTES.filter((q) => q.theme === englishCategory);

  // Sync quote when preset index changes
  const handleSelectQuote = (index: number) => {
    setSelectedQuoteIndex(index);
    const item = filteredEnglishQuotes[index] || PRESET_QUOTES[0];
    setQuote(item.quote);
    setAuthor(item.author);
    stopPlaybackAndAudio();
  };

  const handleSelectTamilQuote = (item: TamilQuoteItem, idx: number) => {
    setTamilQuoteIndex(idx);
    setQuote(item.quote);
    setAuthor(item.author);
    stopPlaybackAndAudio();
  };

  const handleShuffleQuote = () => {
    if (quoteLanguage === 'ta') {
      const nextIdx = (tamilQuoteIndex + 1) % filteredTamilQuotes.length;
      handleSelectTamilQuote(filteredTamilQuotes[nextIdx], nextIdx);
    } else {
      const nextIdx = (selectedQuoteIndex + 1) % filteredEnglishQuotes.length;
      handleSelectQuote(nextIdx);
    }
  };

  const handleSwitchLanguage = (lang: 'ta' | 'en') => {
    setQuoteLanguage(lang);
    stopPlaybackAndAudio();
    if (lang === 'ta') {
      const targetPool = tamilCategory === 'all' ? TAMIL_PRESET_QUOTES : TAMIL_PRESET_QUOTES.filter((q) => q.category === tamilCategory);
      setQuote(targetPool[0]?.quote || TAMIL_PRESET_QUOTES[0].quote);
      setAuthor(targetPool[0]?.author || TAMIL_PRESET_QUOTES[0].author);
      setIsVoiceoverActive(false); // Default to cinematic ambient music for Tamil reels
      setIsMusicActive(true);
    } else {
      const targetPool = englishCategory === 'all' ? PRESET_QUOTES : PRESET_QUOTES.filter((q) => q.theme === englishCategory);
      setQuote(targetPool[0]?.quote || PRESET_QUOTES[0].quote);
      setAuthor(targetPool[0]?.author || PRESET_QUOTES[0].author);
      setIsVoiceoverActive(true);
      setIsMusicActive(true);
    }
  };

  const stopPlaybackAndAudio = () => {
    setIsPlaying(false);
    setIsTestingVoice(false);
    stopVoiceover();
    ambientSoundEngine.stop();
    setCurrentTime(0);
  };

  // Instant Warm Voice Test
  const handleTestWarmVoice = () => {
    if (isTestingVoice) {
      stopVoiceover();
      setIsTestingVoice(false);
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      ambientSoundEngine.stop();
    }

    setIsTestingVoice(true);
    playVoiceover(
      currentProfile.sampleQuote,
      {
        rate: speechRate,
        pitch: voicePitch,
        profileId: voiceProfileId,
        voiceURI: selectedVoiceURI || undefined,
      },
      () => {
        setIsTestingVoice(false);
      }
    );
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopVoiceover();
      ambientSoundEngine.stop();
    } else {
      if (isTestingVoice) {
        stopVoiceover();
        setIsTestingVoice(false);
      }

      if (currentTime >= totalDuration) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
      lastTimeRef.current = performance.now();

      // Start ambient music
      if (isMusicActive && ambientType !== 'none') {
        ambientSoundEngine.play(ambientType);
      }

      // Start voiceover
      if (isVoiceoverActive) {
        playVoiceover(
          quote,
          {
            rate: speechRate,
            pitch: voicePitch,
            profileId: voiceProfileId,
            voiceURI: selectedVoiceURI || undefined,
          },
          () => {
            setIsPlaying(false);
            ambientSoundEngine.stop();
          }
        );
      }
    }
  };

  const handleReset = () => {
    stopPlaybackAndAudio();
  };

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let localRunning = true;

    const loop = (now: number) => {
      if (!localRunning) return;

      if (isPlaying) {
        if (!lastTimeRef.current) lastTimeRef.current = now;
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            stopVoiceover();
            ambientSoundEngine.stop();
            return totalDuration;
          }
          return next;
        });
      } else {
        lastTimeRef.current = now;
      }

      renderVideoFrame(canvas, {
        quote,
        author,
        characterId: selectedCharacter,
        wordTimings,
        currentTime,
        totalDuration,
        particleType,
        handle,
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      localRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, quote, author, selectedCharacter, wordTimings, currentTime, totalDuration, particleType, handle]);

  // 1-Click Auto-Create Tamil Reel
  const handleAutoCreateTamilReel = () => {
    stopPlaybackAndAudio();
    const characters: ('anime-warrior' | 'stoic-monk' | 'minimalist-doodle' | 'cosmic-wanderer')[] = [
      'anime-warrior', 'stoic-monk', 'minimalist-doodle', 'cosmic-wanderer'
    ];
    const soundscapes: AmbientSoundscapeType[] = ['warm-piano-pad', 'cosmic-meditation', 'solitude-rain'];
    const particles: ('sparks' | 'mist' | 'stars' | 'rain')[] = ['sparks', 'stars', 'mist'];

    const chosenChar = characters[Math.floor(Math.random() * characters.length)];
    const chosenSound = soundscapes[Math.floor(Math.random() * soundscapes.length)];
    const chosenParticle = particles[Math.floor(Math.random() * particles.length)];
    const chosenQuote = TAMIL_PRESET_QUOTES[Math.floor(Math.random() * TAMIL_PRESET_QUOTES.length)];

    setQuoteLanguage('ta');
    setSelectedCharacter(chosenChar);
    setAmbientType(chosenSound);
    setParticleType(chosenParticle);
    setQuote(chosenQuote.quote);
    setAuthor(chosenQuote.author);
    setIsVoiceoverActive(false);
    setIsMusicActive(true);
    setCurrentTime(0);

    setTimeout(() => {
      setIsPlaying(true);
      ambientSoundEngine.play(chosenSound);
    }, 150);
  };

  // 1-Click Auto-Create English Reel
  const handleAutoCreateEnglishReel = () => {
    stopPlaybackAndAudio();
    const characters: ('anime-warrior' | 'stoic-monk' | 'minimalist-doodle' | 'cosmic-wanderer')[] = [
      'anime-warrior', 'stoic-monk', 'minimalist-doodle', 'cosmic-wanderer'
    ];
    const soundscapes: AmbientSoundscapeType[] = ['warm-piano-pad', 'cosmic-meditation', 'solitude-rain'];
    const particles: ('sparks' | 'mist' | 'stars' | 'rain')[] = ['sparks', 'stars', 'mist'];
    const voiceProfiles: ('warm-sweet' | 'calm-storyteller' | 'sweet-angelic' | 'meditative-zen')[] = [
      'warm-sweet', 'calm-storyteller', 'sweet-angelic', 'meditative-zen'
    ];

    const chosenChar = characters[Math.floor(Math.random() * characters.length)];
    const chosenSound = soundscapes[Math.floor(Math.random() * soundscapes.length)];
    const chosenParticle = particles[Math.floor(Math.random() * particles.length)];
    const chosenProfileId = voiceProfiles[Math.floor(Math.random() * voiceProfiles.length)];
    const targetPool = englishCategory === 'all' ? PRESET_QUOTES : PRESET_QUOTES.filter((q) => q.theme === englishCategory);
    const chosenQuote = targetPool[Math.floor(Math.random() * targetPool.length)] || PRESET_QUOTES[0];

    setQuoteLanguage('en');
    setSelectedCharacter(chosenChar);
    setAmbientType(chosenSound);
    setParticleType(chosenParticle);
    setVoiceProfileId(chosenProfileId);
    setQuote(chosenQuote.quote);
    setAuthor(chosenQuote.author);
    setIsVoiceoverActive(true);
    setIsMusicActive(true);
    setCurrentTime(0);

    const profileObj = WARM_VOICE_PROFILES.find((p) => p.id === chosenProfileId) || WARM_VOICE_PROFILES[0];
    setSpeechRate(profileObj.defaultRate);
    setVoicePitch(profileObj.defaultPitch);

    setTimeout(() => {
      setIsPlaying(true);
      ambientSoundEngine.play(chosenSound);
      playVoiceover(
        chosenQuote.quote,
        {
          rate: profileObj.defaultRate,
          pitch: profileObj.defaultPitch,
          profileId: chosenProfileId,
          voiceURI: selectedVoiceURI || undefined,
        },
        () => {
          setIsPlaying(false);
          ambientSoundEngine.stop();
        }
      );
    }, 150);
  };

  // Export 1080x1920 MP4 Video
  const handleExportReel = async () => {
    stopPlaybackAndAudio();
    setIsExporting(true);
    setExportProgress({ percent: 0, currentFrame: 0, totalFrames: 100 });

    try {
      // Optional audio track from ambient engine
      let audioTrack: MediaStreamTrack | null = null;
      if (isMusicActive && ambientType !== 'none') {
        ambientSoundEngine.play(ambientType);
        audioTrack = ambientSoundEngine.getMediaStreamTrack();
      }

      const blob = await exportReelVideo(
        {
          quote,
          author,
          characterId: selectedCharacter,
          wordTimings,
          totalDuration,
          particleType,
          handle,
        },
        (progress) => {
          setExportProgress(progress);
        },
        audioTrack
      );

      ambientSoundEngine.stop();
      downloadVideoBlob(blob, `sparkwithin-${selectedCharacter}-reel.mp4`);
    } catch (err) {
      console.error('Reel export error:', err);
      ambientSoundEngine.stop();
      alert('Video export error. Please check browser support for WebCodecs/MediaRecorder.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  // Find currently selected voice object for display
  const activeVoiceObj = availableVoices.find((v) => v.voiceURI === selectedVoiceURI) ||
    findBestVoiceForProfile(availableVoices, voiceProfileId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500/15 via-rose-500/15 to-amber-500/15 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold tracking-wider uppercase border border-purple-500/30 flex items-center gap-1">
              <Film className="w-3 h-3 text-purple-400" />
              Reels & Animated Studio
            </span>
            <span className="text-xs text-white/50">• 9:16 Vertical (1080×1920)</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
              Warm Voiceover & Ambient Music
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              🇺🇸 English + 🌾 தமிழ்
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Animated Cartoon Motivational Reels</h2>
          <p className="text-xs text-white/60 mt-1 max-w-xl">
            Create high-engagement vertical Reels in both English and Tamil with soothing warm voiceovers, procedural cartoon avatars, glowing kinetic typography, and 1-click MP4 export.
          </p>
        </div>

        {/* Action Buttons: 1-Click English Reel, 1-Click Tamil Reel & Export */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={handleAutoCreateEnglishReel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Automatically generate an English video reel with warm soothing voiceover, cartoon avatar, and music"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>⚡ 1-Click English Reel</span>
          </button>

          <button
            onClick={handleAutoCreateTamilReel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Automatically generate an aesthetic Tamil video reel with cartoon avatar and ambient music"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>⚡ 1-Click Tamil Reel (ஆட்டோ)</span>
          </button>

          <button
            onClick={handleExportReel}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-xl shadow-purple-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isExporting ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? `Rendering Reel (${exportProgress?.percent || 0}%)...` : 'Export 1080×1920 MP4 Reel'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player (Left) + Controls (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: 9:16 Reel Player Canvas */}
        <div className="lg:w-[42%] w-full flex flex-col items-center">
          <div className="sticky top-20 w-full max-w-[370px] flex flex-col items-center gap-4">
            {/* Player Container (Phone Aspect Ratio) */}
            <div className="w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-white/15 shadow-2xl shadow-purple-500/10 relative group">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain select-none"
              />

              {/* Play Overlay when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-2xl shadow-rose-500/40 hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 ml-1" />
                  </div>
                </div>
              )}

              {/* Live Status Badge */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span>{isPlaying ? 'PLAYING PREVIEW' : '9:16 REEL PREVIEW'}</span>
              </div>

              {/* Voice Indicator Badge */}
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-medium text-rose-300 flex items-center gap-1">
                <span>{currentProfile.name.split(' ')[0]} {currentProfile.badge}</span>
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="w-full p-4 rounded-2xl bg-studio-900 border border-white/10 space-y-3 shadow-lg">
              {/* Scrub Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-white/50">
                  <span>{currentTime.toFixed(1)}s</span>
                  <span>{totalDuration.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    const t = parseFloat(e.target.value);
                    setCurrentTime(t);
                    setIsPlaying(false);
                    stopVoiceover();
                    ambientSoundEngine.stop();
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Playback Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white font-bold transition-all shadow-md shadow-rose-500/20 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                    title="Reset to beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Audio Toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsVoiceoverActive(!isVoiceoverActive)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      isVoiceoverActive
                        ? 'bg-rose-500/20 border-rose-400/40 text-rose-300'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    {isVoiceoverActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>Voice</span>
                  </button>

                  <button
                    onClick={() => setIsMusicActive(!isMusicActive)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      isMusicActive && ambientType !== 'none'
                        ? 'bg-purple-500/20 border-purple-400/40 text-purple-300'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Music</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Customization Panel */}
        <div className="lg:w-[58%] w-full space-y-5">
          {/* Quote & Author Input */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            {/* Language Switcher */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">மொழி (Language):</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSwitchLanguage('ta')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quoteLanguage === 'ta'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  🌾 தமிழ் ரீல்ஸ் (Tamil)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchLanguage('en')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quoteLanguage === 'en'
                      ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>

            {/* Tamil Category Filter Pills */}
            {quoteLanguage === 'ta' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: '🌟 அனைத்தும்' },
                  { id: 'thirukkural', label: '📜 திருக்குறள்' },
                  { id: 'bharathiyar', label: '🔥 பாரதியார்' },
                  { id: 'kalam', label: '🚀 கலாம்' },
                  { id: 'vivekananda', label: '🧘 விவேகானந்தர்' },
                  { id: 'wisdom', label: '💎 தத்துவம்' },
                  { id: 'cinema', label: '🎬 சினிமா' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setTamilCategory(cat.id);
                      const pool = cat.id === 'all'
                        ? TAMIL_PRESET_QUOTES
                        : TAMIL_PRESET_QUOTES.filter((q) => q.category === cat.id);
                      if (pool.length > 0) {
                        handleSelectTamilQuote(pool[0], 0);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      tamilCategory === cat.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* English Category Filter Pills */}
            {quoteLanguage === 'en' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: '🌟 All (35+)' },
                  { id: 'fire_sunset', label: '🔥 Inner Flame' },
                  { id: 'stoic_marble', label: '🏛️ Stoic Mindset' },
                  { id: 'minimal_linen', label: '🧘 Calm Confidence' },
                  { id: 'cyber_midnight', label: '🚀 Vision & Hustle' },
                  { id: 'vintage_journal', label: '📜 Timeless Wisdom' },
                  { id: 'emerald_wealth', label: '💎 Abundance' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setEnglishCategory(cat.id);
                      const pool = cat.id === 'all'
                        ? PRESET_QUOTES
                        : PRESET_QUOTES.filter((q) => q.theme === cat.id);
                      if (pool.length > 0) {
                        setSelectedQuoteIndex(0);
                        setQuote(pool[0].quote);
                        setAuthor(pool[0].author);
                        stopPlaybackAndAudio();
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                      englishCategory === cat.id
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {quoteLanguage === 'ta' ? 'வாசகம் & வரிகள்' : 'Quote Text & Subtitles'}
                </h3>
              </div>
              <button
                onClick={handleShuffleQuote}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>
                  {quoteLanguage === 'ta' ? 'அடுத்த தமிழ் வரி (Shuffle 40+)' : 'Shuffle from 35+ Library'}
                </span>
              </button>
            </div>

            <textarea
              rows={3}
              value={quote}
              onChange={(e) => {
                setQuote(e.target.value);
                stopPlaybackAndAudio();
              }}
              placeholder={quoteLanguage === 'ta' ? 'ரீல்ஸ்கான தமிழ் வரிகளை உள்ளிடவும்...' : 'Enter quote text for the reel...'}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors resize-none leading-relaxed"
            />

            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={quoteLanguage === 'ta' ? 'ஆசிரியர் பெயர் (எ.கா. திருவள்ளுவர், அப்துல் கலாம்)' : 'Author name (e.g. Spark Within, Marcus Aurelius)'}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Section: Warm, Calm & Sweet Voiceover Studio */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-500/10 to-purple-500/5 border border-rose-500/20 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Warm, Calm & Sweet Voice Profiles
                </h3>
              </div>
              {/* Test Voice Button */}
              <button
                onClick={handleTestWarmVoice}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isTestingVoice
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                    : 'bg-rose-500/20 border border-rose-400/40 text-rose-300 hover:bg-rose-500/30'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{isTestingVoice ? 'Listening to Warm Voice...' : '🎧 Test Warm Voice'}</span>
              </button>
            </div>

            {quoteLanguage === 'ta' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>தமிழ் ரீல்ஸ்க்கு அமைதியான மற்றும் தியான பின்னணி இசை (Ambient Music) தானாக இயக்கப்படும். கீழுள்ள இசையை விருப்பத்திற்கேற்ப மாற்றலாம்.</span>
              </div>
            )}

            {/* 4 Voice Profile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WARM_VOICE_PROFILES.map((profile) => {
                const isSelected = voiceProfileId === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectVoiceProfile(profile)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 relative ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-400/90 shadow-lg shadow-rose-500/15 ring-1 ring-rose-400/50'
                        : 'bg-black/30 border-white/10 hover:bg-white/[0.04] text-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                        {profile.name}
                      </span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isSelected ? 'bg-rose-500/40 text-rose-200' : 'bg-white/10 text-white/60'
                      }`}>
                        {profile.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed">{profile.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Fine Tuning Controls: Pitch & Speaking Pace */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* Sweetness & Pitch Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70 font-medium">Sweetness & Pitch</span>
                  <span className="font-mono text-rose-300 text-[11px] font-bold">{voicePitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.85}
                  max={1.25}
                  step={0.02}
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[9px] text-white/40">
                  <span>Deeper Warmth</span>
                  <span>Sweet & Melodic</span>
                </div>
              </div>

              {/* Calm Speaking Pace */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70 font-medium">Calm Speaking Pace</span>
                  <span className="font-mono text-amber-300 text-[11px] font-bold">{speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.75}
                  max={1.20}
                  step={0.02}
                  value={speechRate}
                  onChange={(e) => {
                    setSpeechRate(parseFloat(e.target.value));
                    stopPlaybackAndAudio();
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-white/40">
                  <span>Slow & Zen</span>
                  <span>Conversational</span>
                </div>
              </div>
            </div>

            {/* System Voice Match Status / Override */}
            {availableVoices.length > 0 && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Matched Natural Voice: <strong className="text-white">{activeVoiceObj?.name || 'Default Natural'}</strong></span>
                </span>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-rose-500 cursor-pointer max-w-[180px]"
                >
                  <option value="">Auto-Match Best Warm Voice</option>
                  {availableVoices
                    .filter((v) => v.lang.startsWith('en'))
                    .map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Section: Ambient Soothing Background Soundscapes */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Ambient Background Soundscape (Included in MP4)
                </h3>
              </div>
              <span className="text-[10px] text-purple-300 font-mono">Web Audio $0 Engine</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AMBIENT_SOUNDSCAPES.map((track) => {
                const isSelected = ambientType === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      setAmbientType(track.id);
                      if (isPlaying && isMusicActive) {
                        ambientSoundEngine.play(track.id);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400/80 text-white shadow-md shadow-purple-500/10'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{track.name.split(' ')[0]} {track.badge}</span>
                    <span className="text-[9px] text-white/40 truncate">{track.name.split(' ').slice(1).join(' ')}</span>
                  </button>
                );
              })}
            </div>

            {/* Music Volume Slider */}
            {ambientType !== 'none' && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-white/60 shrink-0">Music Volume:</span>
                <input
                  type="range"
                  min={0.05}
                  max={0.5}
                  step={0.02}
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-[11px] font-mono text-purple-300 font-bold shrink-0">
                  {Math.round(ambientVolume * 200)}%
                </span>
              </div>
            )}
          </div>

          {/* Cartoon Character Switcher */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Cartoon Character Avatar
              </label>
              <span className="text-[10px] text-amber-400 font-mono">4 Vector Animated Styles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CARTOON_CHARACTERS.map((char) => {
                const isSelected = selectedCharacter === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => {
                      setSelectedCharacter(char.id);
                      setParticleType(char.particleType);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 relative overflow-hidden ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/10'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20 text-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white tracking-tight">{char.name}</span>
                      <span
                        className="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold"
                        style={{ color: char.accentColor, backgroundColor: `${char.accentColor}20` }}
                      >
                        {char.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed">{char.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Particle Effects Switcher */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              Atmospheric Particle Simulation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['sparks', 'mist', 'stars', 'rain'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setParticleType(p)}
                  className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all cursor-pointer ${
                    particleType === p
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                      : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {p === 'sparks' ? '🔥 Flying Sparks' : p === 'mist' ? '🌲 Misty Fog' : p === 'stars' ? '🌌 Starfield' : '🌧️ Night Rain'}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark Branding */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              Reels Watermark / Handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@_sparkwithin_hub_"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
