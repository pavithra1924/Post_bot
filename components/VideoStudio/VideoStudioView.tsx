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
  findBestVoiceForLanguage,
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
  CURATED_PASSAGES,
  StoryPassageItem,
  generateInfinitePassage,
} from '@/lib/storyPassages';
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
  BookOpen,
  MessageSquare,
  Copy,
  Layers,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoStudioViewProps {
  initialQuote?: string;
  initialAuthor?: string;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({
  initialQuote,
  initialAuthor,
}) => {
  const isInitialTamil = initialQuote ? /[\u0B80-\u0BFF]/.test(initialQuote) : true;
  const [quoteLanguage, setQuoteLanguage] = useState<'ta' | 'en'>(isInitialTamil ? 'ta' : 'en');
  const [videoMode, setVideoMode] = useState<'passage' | 'quote'>('passage');

  // Story Passages State (6-8 Slides)
  const initialPassage = CURATED_PASSAGES.find((p) => p.language === (isInitialTamil ? 'ta' : 'en')) || CURATED_PASSAGES[0];
  const [currentPassage, setCurrentPassage] = useState<StoryPassageItem>(initialPassage);
  const [passageIndex, setPassageIndex] = useState(0);
  const [copiedStory, setCopiedStory] = useState(false);

  // Single Quote State
  const [tamilCategory, setTamilCategory] = useState<string>('all');
  const [englishCategory, setEnglishCategory] = useState<string>('all');
  const [tamilQuoteIndex, setTamilQuoteIndex] = useState(0);
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);
  const [quote, setQuote] = useState(initialQuote || initialPassage.slides[0]);
  const [author, setAuthor] = useState(initialAuthor || initialPassage.author);

  // Visuals & Characters
  const [selectedCharacter, setSelectedCharacter] = useState<'anime-warrior' | 'minimalist-doodle' | 'stoic-monk' | 'cosmic-wanderer'>('anime-warrior');
  const [particleType, setParticleType] = useState<'sparks' | 'mist' | 'stars' | 'rain'>('sparks');
  const [handle, setHandle] = useState('@_sparkwithin_hub_');

  // Voiceover & Warm Voice State
  const [voiceProfileId, setVoiceProfileId] = useState<'warm-sweet' | 'calm-storyteller' | 'sweet-angelic' | 'meditative-zen'>('warm-sweet');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speechRate, setSpeechRate] = useState(0.88);
  const [voicePitch, setVoicePitch] = useState(1.05);
  const [isVoiceoverActive, setIsVoiceoverActive] = useState(false); // Default to instrumental BGM for story passages
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // Ambient Music State (Default loud & rich Tamil / Piano BGM)
  const [ambientType, setAmbientType] = useState<AmbientSoundscapeType>(isInitialTamil ? 'tamil-melody-bgm' : 'warm-piano-pad');
  const [ambientVolume, setAmbientVolume] = useState(0.70);
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

  const currentProfile = WARM_VOICE_PROFILES.find((p) => p.id === voiceProfileId) || WARM_VOICE_PROFILES[0];

  // Subscribe to system voices
  useEffect(() => {
    const unsubscribe = subscribeVoices((voices) => {
      setAvailableVoices(voices);
      if (!selectedVoiceURI) {
        const best = findBestVoiceForLanguage(voices, quoteLanguage, voiceProfileId);
        if (best) setSelectedVoiceURI(best.voiceURI);
      }
    });
    return () => unsubscribe();
  }, [voiceProfileId, selectedVoiceURI, quoteLanguage]);

  // Update volume in ambient engine
  useEffect(() => {
    ambientSoundEngine.setVolume(isMusicActive ? ambientVolume : 0);
  }, [ambientVolume, isMusicActive]);

  // Sync external quote when passed from outside
  useEffect(() => {
    if (initialQuote) {
      const isTam = /[\u0B80-\u0BFF]/.test(initialQuote);
      setQuoteLanguage(isTam ? 'ta' : 'en');
      setQuote(initialQuote);
      if (initialAuthor) setAuthor(initialAuthor);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [initialQuote, initialAuthor]);

  // Calculate duration
  const { words: wordTimings, totalDuration: calculatedQuoteDuration } = calculateWordTimings(
    quote,
    speechRate,
    currentProfile.pauseMultiplier
  );

  // In Story Passage mode, give ~3.2s per slide
  const passageDuration = Math.max(16, currentPassage.slides.length * 3.2);
  const totalDuration = videoMode === 'passage' ? passageDuration : calculatedQuoteDuration;

  const currentSlideIndex = Math.min(
    currentPassage.slides.length - 1,
    Math.max(0, Math.floor(currentTime / (totalDuration / currentPassage.slides.length)))
  );

  // Filtered quotes pools
  const filteredTamilQuotes = tamilCategory === 'all'
    ? TAMIL_PRESET_QUOTES
    : TAMIL_PRESET_QUOTES.filter((q) => q.category === tamilCategory);

  const filteredEnglishQuotes = englishCategory === 'all'
    ? PRESET_QUOTES
    : PRESET_QUOTES.filter((q) => q.theme === englishCategory);

  const filteredPassages = CURATED_PASSAGES.filter((p) => p.language === quoteLanguage);

  // Switch between Story Passage mode and Single Quote mode
  const handleSwitchMode = (mode: 'passage' | 'quote') => {
    stopPlaybackAndAudio();
    setVideoMode(mode);
    if (mode === 'passage') {
      const match = CURATED_PASSAGES.find((p) => p.language === quoteLanguage) || CURATED_PASSAGES[0];
      setCurrentPassage(match);
      setQuote(match.slides[0]);
      setAuthor(match.author);
      setIsVoiceoverActive(false);
      setIsMusicActive(true);
    } else {
      if (quoteLanguage === 'ta') {
        setQuote(TAMIL_PRESET_QUOTES[0].quote);
        setAuthor(TAMIL_PRESET_QUOTES[0].author);
      } else {
        setQuote(PRESET_QUOTES[0].quote);
        setAuthor(PRESET_QUOTES[0].author);
      }
    }
  };

  // Switch Language
  const handleSwitchLanguage = (lang: 'ta' | 'en') => {
    setQuoteLanguage(lang);
    stopPlaybackAndAudio();

    if (videoMode === 'passage') {
      const pool = CURATED_PASSAGES.filter((p) => p.language === lang);
      const chosen = pool[0] || CURATED_PASSAGES[0];
      setCurrentPassage(chosen);
      setQuote(chosen.slides[0]);
      setAuthor(chosen.author);
      setAmbientType(lang === 'ta' ? 'tamil-melody-bgm' : 'warm-piano-pad');
      setIsMusicActive(true);
      setIsVoiceoverActive(false);
    } else {
      if (lang === 'ta') {
        const pool = tamilCategory === 'all' ? TAMIL_PRESET_QUOTES : TAMIL_PRESET_QUOTES.filter((q) => q.category === tamilCategory);
        setQuote(pool[0]?.quote || TAMIL_PRESET_QUOTES[0].quote);
        setAuthor(pool[0]?.author || TAMIL_PRESET_QUOTES[0].author);
        setAmbientType('tamil-melody-bgm');
      } else {
        const pool = englishCategory === 'all' ? PRESET_QUOTES : PRESET_QUOTES.filter((q) => q.theme === englishCategory);
        setQuote(pool[0]?.quote || PRESET_QUOTES[0].quote);
        setAuthor(pool[0]?.author || PRESET_QUOTES[0].author);
        setAmbientType('warm-piano-pad');
      }
    }
  };

  // Select a Curated Story Passage
  const handleSelectPassage = (item: StoryPassageItem, idx: number) => {
    setPassageIndex(idx);
    setCurrentPassage(item);
    setQuote(item.slides[0]);
    setAuthor(item.author);
    stopPlaybackAndAudio();
  };

  // Shuffle Curated Story Passages
  const handleShufflePassage = () => {
    const nextIdx = (passageIndex + 1) % filteredPassages.length;
    handleSelectPassage(filteredPassages[nextIdx], nextIdx);
  };

  // Generate Infinite Non-Repeating Story Passage (20-Year Guarantee)
  const handleGenerateInfiniteStory = () => {
    ambientSoundEngine.unlockAudio();
    stopPlaybackAndAudio();
    const newPassage = generateInfinitePassage(quoteLanguage);
    setCurrentPassage(newPassage);
    setQuote(newPassage.slides[0]);
    setAuthor(newPassage.author);
    setCurrentTime(0);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#F43F5E', '#10B981'],
    });

    setTimeout(() => {
      setIsPlaying(true);
      ambientSoundEngine.play(quoteLanguage === 'ta' ? 'tamil-melody-bgm' : 'warm-piano-pad');
    }, 100);
  };

  // 1-Click Tamil Story Reel
  const handleAutoCreateTamilReel = () => {
    ambientSoundEngine.unlockAudio();
    stopPlaybackAndAudio();
    setQuoteLanguage('ta');
    setVideoMode('passage');

    const tamilPool = CURATED_PASSAGES.filter((p) => p.language === 'ta');
    const chosen = tamilPool[Math.floor(Math.random() * tamilPool.length)] || tamilPool[0];
    setCurrentPassage(chosen);
    setQuote(chosen.slides[0]);
    setAuthor(chosen.author);

    const characters: ('anime-warrior' | 'stoic-monk' | 'minimalist-doodle' | 'cosmic-wanderer')[] = [
      'anime-warrior', 'stoic-monk', 'minimalist-doodle', 'cosmic-wanderer'
    ];
    setSelectedCharacter(characters[Math.floor(Math.random() * characters.length)]);
    setAmbientType('tamil-melody-bgm');
    setIsMusicActive(true);
    setIsVoiceoverActive(false);
    setCurrentTime(0);

    setTimeout(() => {
      setIsPlaying(true);
      ambientSoundEngine.play('tamil-melody-bgm');
    }, 120);
  };

  // 1-Click English Story Reel
  const handleAutoCreateEnglishReel = () => {
    ambientSoundEngine.unlockAudio();
    stopPlaybackAndAudio();
    setQuoteLanguage('en');
    setVideoMode('passage');

    const enPool = CURATED_PASSAGES.filter((p) => p.language === 'en');
    const chosen = enPool[Math.floor(Math.random() * enPool.length)] || enPool[0];
    setCurrentPassage(chosen);
    setQuote(chosen.slides[0]);
    setAuthor(chosen.author);

    const characters: ('anime-warrior' | 'stoic-monk' | 'minimalist-doodle' | 'cosmic-wanderer')[] = [
      'anime-warrior', 'stoic-monk', 'minimalist-doodle', 'cosmic-wanderer'
    ];
    setSelectedCharacter(characters[Math.floor(Math.random() * characters.length)]);
    setAmbientType('warm-piano-pad');
    setIsMusicActive(true);
    setIsVoiceoverActive(false);
    setCurrentTime(0);

    setTimeout(() => {
      setIsPlaying(true);
      ambientSoundEngine.play('warm-piano-pad');
    }, 120);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    ambientSoundEngine.unlockAudio();

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

      // Start voiceover if enabled
      if (isVoiceoverActive) {
        const textToSpeak = videoMode === 'passage' ? currentPassage.slides.join('. ') : quote;
        playVoiceover(
          textToSpeak,
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

  const stopPlaybackAndAudio = () => {
    setIsPlaying(false);
    setIsTestingVoice(false);
    stopVoiceover();
    ambientSoundEngine.stop();
    setCurrentTime(0);
  };

  // Jump directly to a slide time
  const handleJumpToSlide = (idx: number) => {
    const slideDuration = totalDuration / currentPassage.slides.length;
    setCurrentTime(idx * slideDuration + 0.1);
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
        slides: videoMode === 'passage' ? currentPassage.slides : undefined,
        passageCategory: videoMode === 'passage' ? currentPassage.categoryLabel : undefined,
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      localRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [
    isPlaying,
    quote,
    author,
    selectedCharacter,
    wordTimings,
    currentTime,
    totalDuration,
    particleType,
    handle,
    videoMode,
    currentPassage,
  ]);

  // Export 1080x1920 MP4 Video with synchronized Audio Track
  const handleExportReel = async () => {
    ambientSoundEngine.unlockAudio();
    stopPlaybackAndAudio();
    setIsExporting(true);
    setExportProgress({ percent: 0, currentFrame: 0, totalFrames: 100 });

    try {
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
          slides: videoMode === 'passage' ? currentPassage.slides : undefined,
          passageCategory: videoMode === 'passage' ? currentPassage.categoryLabel : undefined,
        },
        (progress) => {
          setExportProgress(progress);
        },
        audioTrack
      );

      ambientSoundEngine.stop();
      downloadVideoBlob(blob, `sparkwithin-${videoMode}-${quoteLanguage}-reel.mp4`);
    } catch (err) {
      console.error('Reel export error:', err);
      ambientSoundEngine.stop();
      alert('Video export error. Please check browser support for WebCodecs/MediaRecorder.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500/15 via-rose-500/15 to-amber-500/15 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold tracking-wider uppercase border border-purple-500/30 flex items-center gap-1">
              <Film className="w-3 h-3 text-purple-400" />
              Reels & Story Studio
            </span>
            <span className="text-xs text-white/50">• 9:16 Vertical (1080×1920)</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
              <Music className="w-2.5 h-2.5 text-rose-400" />
              Tamil Piano BGM & Ambient Audio
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              6-8 Slide Story Passages 🌱
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Viral Story Passage & Reel Creator</h2>
          <p className="text-xs text-white/60 mt-1 max-w-xl">
            Create emotional 6-8 slide POV & reality passage video reels with rich Tamil cinematic piano music, cartoon avatars, and progressive story animations.
          </p>
        </div>

        {/* Action Buttons: 1-Click English Reel, 1-Click Tamil Reel & Export */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={handleAutoCreateEnglishReel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Automatically generate an English POV Story Reel with warm piano music"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>⚡ 1-Click English Reel</span>
          </button>

          <button
            onClick={handleAutoCreateTamilReel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Automatically generate an aesthetic Tamil Story Reel with emotional piano BGM"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>⚡ 1-Click Tamil Reel (BGM)</span>
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
            <span>{isExporting ? `Rendering Reel (${exportProgress?.percent || 0}%)...` : 'Export 1080×1920 MP4'}</span>
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

              {/* Slide Counter Indicator */}
              {videoMode === 'passage' && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <span>Slide {currentSlideIndex + 1} / {currentPassage.slides.length}</span>
                </div>
              )}
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

              {/* Playback Buttons & Audio Toggles */}
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
                    onClick={() => {
                      ambientSoundEngine.unlockAudio();
                      setIsMusicActive(!isMusicActive);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      isMusicActive && ambientType !== 'none'
                        ? 'bg-purple-500/20 border-purple-400/40 text-purple-300'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>BGM Music</span>
                  </button>

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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="lg:w-[58%] w-full space-y-5">
          {/* Format Mode Switcher: 6-8 Slide Story vs Single Quote */}
          <div className="p-4 rounded-2xl bg-studio-900 border border-white/10 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">வடிவம் (Format):</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSwitchMode('passage')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  videoMode === 'passage'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-amber-400 shadow-md'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 6-8 Slide Story Passage (POV)</span>
              </button>

              <button
                onClick={() => handleSwitchMode('quote')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  videoMode === 'quote'
                    ? 'bg-gradient-to-r from-purple-500 to-rose-500 text-white border-purple-400 shadow-md'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>💬 Classic Single Quote</span>
              </button>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">மொழி (Language):</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSwitchLanguage('ta')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quoteLanguage === 'ta'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  🌾 தமிழ் (Tamil)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchLanguage('en')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quoteLanguage === 'en'
                      ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>

            {/* If in Story Passage Mode */}
            {videoMode === 'passage' && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {currentPassage.categoryLabel} ({currentPassage.slides.length} Slides)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Infinite Non-Repeating Story Generator */}
                    <button
                      onClick={handleGenerateInfiniteStory}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                      title="Generate an infinite, never-repeating 7-slide story (20-year guarantee)"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>🎲 புது கதை (Infinite Generator)</span>
                    </button>

                    <button
                      onClick={handleShufflePassage}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      <span>அடுத்த கதை (Shuffle)</span>
                    </button>
                  </div>
                </div>

                {/* Slides Interactive Card List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">ஸ்லைடுகள் (Click any slide to jump):</span>
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                    {currentPassage.slides.map((slide, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleJumpToSlide(idx)}
                        className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                          currentSlideIndex === idx
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                            : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                          currentSlideIndex === idx ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/50'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="line-clamp-2 leading-relaxed">{slide}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copy Full Story Caption */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/50">முழு கதை உரை (Full Passage Text):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentPassage.fullText);
                      setCopiedStory(true);
                      setTimeout(() => setCopiedStory(false), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                  >
                    {copiedStory ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedStory ? 'நகலெடுக்கப்பட்டது!' : 'முழு கதையை நகலெடு (Copy Text)'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* If in Single Quote Mode */}
            {videoMode === 'quote' && (
              <div className="space-y-3 pt-1">
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
                            setQuote(pool[0].quote);
                            setAuthor(pool[0].author);
                            stopPlaybackAndAudio();
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

                <textarea
                  rows={3}
                  value={quote}
                  onChange={(e) => {
                    setQuote(e.target.value);
                    stopPlaybackAndAudio();
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white resize-none leading-relaxed"
                />

                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            )}
          </div>

          {/* Section: BGM Music & Soundscapes */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  பின்னணி இசை (Background BGM Music)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-purple-300 font-bold">Volume: {Math.round(ambientVolume * 100)}%</span>
            </div>

            {/* Soundscape Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AMBIENT_SOUNDSCAPES.map((sound) => {
                const isSelected = ambientType === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => {
                      ambientSoundEngine.unlockAudio();
                      setAmbientType(sound.id);
                      if (isPlaying && sound.id !== 'none') {
                        ambientSoundEngine.play(sound.id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sound.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white/40'
                      }`}>
                        {sound.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 line-clamp-2">{sound.description}</span>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider */}
            <div className="pt-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>

          {/* Character Avatar Picker */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">கார்ட்டூன் அவதார் (Character Avatar)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CARTOON_CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedCharacter === char.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-base block mb-1">
                    {char.id === 'anime-warrior' ? '⚔️' : char.id === 'stoic-monk' ? '🧘' : char.id === 'minimalist-doodle' ? '✏️' : '🌌'}
                  </span>
                  <span className="text-[11px] font-bold block">{char.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
