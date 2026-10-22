'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CARTOON_CHARACTERS } from '@/lib/cartoonAvatars';
import { renderVideoFrame, SlideTimingInfo } from '@/lib/videoRenderer';
import { calculateWordTimings } from '@/lib/voiceoverTTS';
import { AMBIENT_SOUNDSCAPES, AmbientSoundscapeType } from '@/lib/ambientAudio';
import { exportReelVideo, downloadVideoBlob, ExportProgress } from '@/lib/videoExporter';
import { PRESET_QUOTES } from '@/lib/presets';
import { TAMIL_PRESET_QUOTES } from '@/lib/tamilPresets';
import {
  CURATED_PASSAGES,
  StoryPassageItem,
  generateInfinitePassage,
} from '@/lib/storyPassages';
import {
  studioAudioEngine,
  DecodedSlideAudio,
} from '@/lib/studioAudioEngine';
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
  Music,
  Sliders,
  Check,
  Headphones,
  BookOpen,
  MessageSquare,
  Copy,
  Clock,
  Layers,
  Radio,
  CheckCircle2,
  Loader2,
  Send,
  Share2,
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
  const initialPassage =
    CURATED_PASSAGES.find((p) => p.language === (isInitialTamil ? 'ta' : 'en')) || CURATED_PASSAGES[0];
  const [currentPassage, setCurrentPassage] = useState<StoryPassageItem>(initialPassage);
  const [passageIndex, setPassageIndex] = useState(0);
  const [copiedStory, setCopiedStory] = useState(false);

  // Single Quote State
  const [tamilCategory, setTamilCategory] = useState<string>('all');
  const [englishCategory, setEnglishCategory] = useState<string>('all');
  const [quote, setQuote] = useState(initialQuote || initialPassage.slides[0]);
  const [author, setAuthor] = useState(initialAuthor || initialPassage.author);

  // Visuals & Characters
  const [selectedCharacter, setSelectedCharacter] = useState<
    'anime-warrior' | 'minimalist-doodle' | 'stoic-monk' | 'cosmic-wanderer'
  >('anime-warrior');
  const [particleType, setParticleType] = useState<'sparks' | 'mist' | 'stars' | 'rain'>('sparks');
  const [handle, setHandle] = useState('@_sparkwithin_hub_');

  // Audio Engine State: Synchronized Voice + Ambient Music
  const [isVoiceoverActive, setIsVoiceoverActive] = useState(true); // Voice ON by default
  const [isMusicActive, setIsMusicActive] = useState(true); // BGM ON by default
  const [ambientType, setAmbientType] = useState<AmbientSoundscapeType>(
    isInitialTamil ? 'tamil-melody-bgm' : 'warm-piano-pad'
  );
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [musicVolume, setMusicVolume] = useState(0.35); // Ducked BGM so voice is crisp
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [slideAudios, setSlideAudios] = useState<DecodedSlideAudio[]>([]);
  const [passageDuration, setPassageDuration] = useState<number>(24);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Sync volume with studio audio engine
  useEffect(() => {
    studioAudioEngine.setVoiceVolume(isVoiceoverActive ? voiceVolume : 0);
  }, [voiceVolume, isVoiceoverActive]);

  useEffect(() => {
    studioAudioEngine.setMusicVolume(isMusicActive ? musicVolume : 0);
  }, [musicVolume, isMusicActive]);

  // Load Audio & Synchronized Slide Timings for Passages
  const loadPassageAudioData = useCallback(async (passage: StoryPassageItem, lang: 'ta' | 'en') => {
    setIsLoadingAudio(true);
    try {
      const session = await studioAudioEngine.loadPassageAudio(passage.slides, lang);
      setSlideAudios(session.slideAudios);
      setPassageDuration(session.totalDuration);
    } catch (err) {
      console.warn('Error loading passage audio session:', err);
    } finally {
      setIsLoadingAudio(false);
    }
  }, []);

  // Initial load of audio for passage
  useEffect(() => {
    if (videoMode === 'passage') {
      loadPassageAudioData(currentPassage, quoteLanguage);
    }
  }, [currentPassage, quoteLanguage, videoMode, loadPassageAudioData]);

  // Handle external quote updates
  useEffect(() => {
    if (initialQuote) {
      const isTam = /[\u0B80-\u0BFF]/.test(initialQuote);
      setQuoteLanguage(isTam ? 'ta' : 'en');
      setQuote(initialQuote);
      if (initialAuthor) setAuthor(initialAuthor);
      setIsPlaying(false);
      studioAudioEngine.stopPlayback();
      setCurrentTime(0);
    }
  }, [initialQuote, initialAuthor]);

  // Derive exact SlideTimingInfo array for renderer
  const slideTimings: SlideTimingInfo[] = slideAudios.map((sa) => ({
    index: sa.index,
    startTime: sa.startTime,
    endTime: sa.endTime,
    duration: sa.duration,
  }));

  // Estimate single quote duration
  const { words: wordTimings, totalDuration: calculatedQuoteDuration } = calculateWordTimings(
    quote,
    0.9,
    1.3
  );

  const totalDuration = videoMode === 'passage' ? passageDuration : calculatedQuoteDuration;

  // Determine current active slide based on currentTime and slideTimings
  let currentSlideIndex = 0;
  if (videoMode === 'passage' && slideTimings.length > 0) {
    const foundIdx = slideTimings.findIndex(
      (st) => currentTime >= st.startTime && currentTime < st.endTime
    );
    if (foundIdx !== -1) {
      currentSlideIndex = foundIdx;
    } else if (currentTime >= (slideTimings[slideTimings.length - 1]?.endTime || 0)) {
      currentSlideIndex = slideTimings.length - 1;
    }
  }

  // Stop all playback and audio
  const stopPlaybackAndAudio = useCallback(() => {
    setIsPlaying(false);
    studioAudioEngine.stopPlayback();
    setCurrentTime(0);
  }, []);

  // Mode Switcher (Story Passage vs Single Quote)
  const handleSwitchMode = (mode: 'passage' | 'quote') => {
    stopPlaybackAndAudio();
    setVideoMode(mode);
    if (mode === 'passage') {
      const match =
        CURATED_PASSAGES.find((p) => p.language === quoteLanguage) || CURATED_PASSAGES[0];
      setCurrentPassage(match);
      setQuote(match.slides[0]);
      setAuthor(match.author);
      loadPassageAudioData(match, quoteLanguage);
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

  // Language Switcher
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
      loadPassageAudioData(chosen, lang);
    } else {
      if (lang === 'ta') {
        const pool =
          tamilCategory === 'all'
            ? TAMIL_PRESET_QUOTES
            : TAMIL_PRESET_QUOTES.filter((q) => q.category === tamilCategory);
        setQuote(pool[0]?.quote || TAMIL_PRESET_QUOTES[0].quote);
        setAuthor(pool[0]?.author || TAMIL_PRESET_QUOTES[0].author);
        setAmbientType('tamil-melody-bgm');
      } else {
        const pool =
          englishCategory === 'all'
            ? PRESET_QUOTES
            : PRESET_QUOTES.filter((q) => q.theme === englishCategory);
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
    loadPassageAudioData(item, quoteLanguage);
  };

  // Shuffle Curated Story Passages
  const handleShufflePassage = () => {
    const filtered = CURATED_PASSAGES.filter((p) => p.language === quoteLanguage);
    const nextIdx = (passageIndex + 1) % filtered.length;
    handleSelectPassage(filtered[nextIdx], nextIdx);
  };

  // Generate Infinite Non-Repeating Story Passage (20-Year Guarantee)
  const handleGenerateInfiniteStory = () => {
    studioAudioEngine.unlockAudio();
    stopPlaybackAndAudio();
    const newPassage = generateInfinitePassage(quoteLanguage);
    setCurrentPassage(newPassage);
    setQuote(newPassage.slides[0]);
    setAuthor(newPassage.author);
    loadPassageAudioData(newPassage, quoteLanguage);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#F43F5E', '#10B981'],
    });
  };

  // 1-Click Tamil Story Reel (Synchronized Voice + BGM)
  const handleAutoCreateTamilReel = () => {
    studioAudioEngine.unlockAudio();
    stopPlaybackAndAudio();
    setQuoteLanguage('ta');
    setVideoMode('passage');

    const tamilPool = CURATED_PASSAGES.filter((p) => p.language === 'ta');
    const chosen = tamilPool[Math.floor(Math.random() * tamilPool.length)] || tamilPool[0];
    setCurrentPassage(chosen);
    setQuote(chosen.slides[0]);
    setAuthor(chosen.author);

    const characters: ('anime-warrior' | 'stoic-monk' | 'minimalist-doodle' | 'cosmic-wanderer')[] = [
      'anime-warrior',
      'stoic-monk',
      'minimalist-doodle',
      'cosmic-wanderer',
    ];
    setSelectedCharacter(characters[Math.floor(Math.random() * characters.length)]);
    setAmbientType('tamil-melody-bgm');
    setIsMusicActive(true);
    setIsVoiceoverActive(true);

    loadPassageAudioData(chosen, 'ta');
  };

  // 1-Click English Story Reel (Synchronized Voice + BGM)
  const handleAutoCreateEnglishReel = () => {
    studioAudioEngine.unlockAudio();
    stopPlaybackAndAudio();
    setQuoteLanguage('en');
    setVideoMode('passage');

    const enPool = CURATED_PASSAGES.filter((p) => p.language === 'en');
    const chosen = enPool[Math.floor(Math.random() * enPool.length)] || enPool[0];
    setCurrentPassage(chosen);
    setQuote(chosen.slides[0]);
    setAuthor(chosen.author);

    const characters: ('anime-warrior' | 'stoic-monk' | 'minimalist-doodle' | 'cosmic-wanderer')[] = [
      'anime-warrior',
      'stoic-monk',
      'minimalist-doodle',
      'cosmic-wanderer',
    ];
    setSelectedCharacter(characters[Math.floor(Math.random() * characters.length)]);
    setAmbientType('warm-piano-pad');
    setIsMusicActive(true);
    setIsVoiceoverActive(true);

    loadPassageAudioData(chosen, 'en');
  };

  // Jump directly to a slide's timestamp
  const handleJumpToSlide = (idx: number) => {
    studioAudioEngine.unlockAudio();
    studioAudioEngine.stopPlayback();
    setIsPlaying(false);

    if (slideTimings[idx]) {
      setCurrentTime(slideTimings[idx].startTime);
    } else {
      const slideDuration = totalDuration / currentPassage.slides.length;
      setCurrentTime(idx * slideDuration);
    }
  };

  // Play / Pause toggle with 100% audio-visual synchronization
  const togglePlay = () => {
    studioAudioEngine.unlockAudio();

    if (isPlaying) {
      setIsPlaying(false);
      studioAudioEngine.stopPlayback();
    } else {
      let startTime = currentTime;
      if (startTime >= totalDuration) {
        startTime = 0;
        setCurrentTime(0);
      }

      setIsPlaying(true);
      lastTimeRef.current = performance.now();

      // Start synchronized voiceover and BGM from exact currentTime
      studioAudioEngine.startPlayback({
        currentTime: startTime,
        slideAudios,
        isMusicActive,
        isVoiceActive: isVoiceoverActive,
        ambientType,
      });
    }
  };

  const handleReset = () => {
    stopPlaybackAndAudio();
  };

  // Animation Loop (Runs synchronized with currentTime)
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
            studioAudioEngine.stopPlayback();
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
        slideTimings: videoMode === 'passage' ? slideTimings : undefined,
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
    slideTimings,
  ]);

  // Export 1080x1920 MP4 Video with synchronized Voiceover + Background Music
  const handleExportReel = async () => {
    studioAudioEngine.unlockAudio();
    stopPlaybackAndAudio();
    setIsExporting(true);
    setExportProgress({ percent: 0, currentFrame: 0, totalFrames: 100 });

    try {
      // 1. Start audio playback from t = 0 through the studio audio engine
      studioAudioEngine.startPlayback({
        currentTime: 0,
        slideAudios,
        isMusicActive,
        isVoiceActive: isVoiceoverActive,
        ambientType,
      });

      // 2. Capture the combined audio track containing BOTH voice and music
      const audioTrack = studioAudioEngine.getMediaStreamTrack();

      // 3. Render 1080x1920 video frames and mux synchronized audio
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
          slideTimings: videoMode === 'passage' ? slideTimings : undefined,
        },
        (progress) => {
          setExportProgress(progress);
        },
        audioTrack
      );

      studioAudioEngine.stopPlayback();
      downloadVideoBlob(blob, `sparkwithin-${videoMode}-${quoteLanguage}-reel.mp4`);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#10B981'],
      });
    } catch (err) {
      console.error('Reel export error:', err);
      studioAudioEngine.stopPlayback();
      alert('Video export error. Please check browser support for WebCodecs/MediaRecorder.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  // Direct 1-Click Post to Instagram
  const handlePostDirectToInstagram = async () => {
    try {
      await navigator.clipboard.writeText(currentPassage.fullText);
      setCopiedStory(true);
      setTimeout(() => setCopiedStory(false), 3000);
    } catch (_) {}

    window.open('https://www.instagram.com/', '_blank');
    await handleExportReel();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Studio Command Center */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-rose-500/10 to-amber-500/10 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold tracking-wider uppercase border border-indigo-200 flex items-center gap-1.5 shadow-xs">
              <Film className="w-3.5 h-3.5 text-indigo-500" />
              Reels & Story Studio
            </span>
            <span className="text-xs text-slate-500">• 9:16 Vertical HD (1080×1920)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1 shadow-xs">
              <Music className="w-3 h-3 text-rose-500" />
              Cinema Piano BGM
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1 shadow-xs">
              <Headphones className="w-3 h-3 text-emerald-600" />
              Neural Synchronized Voiceover
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Viral Story Passage & Reel Studio
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            Create high-engagement 6–8 slide POV stories with frame-by-frame synchronized voiceover,
            emotional Tamil piano chords, breathing anime characters, and Instagram story progress bars.
          </p>
        </div>

        {/* Action Buttons: 1-Click English Reel, 1-Click Tamil Reel & Export */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={handleAutoCreateTamilReel}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Generate an aesthetic Tamil Story Reel with synchronized voice & emotional piano BGM"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>⚡ 1-Click Tamil Reel</span>
          </button>

          <button
            onClick={handleAutoCreateEnglishReel}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 text-indigo-800 text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Generate an English POV Story Reel with synchronized voice & warm piano music"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>⚡ 1-Click English Reel</span>
          </button>

          <button
            onClick={handlePostDirectToInstagram}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="Copy caption, download reel with voice & BGM, and open Instagram"
          >
            <Send className="w-4 h-4 text-rose-500" />
            <span>📱 Post to Instagram</span>
          </button>

          <button
            onClick={handleExportReel}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-xl shadow-purple-500/25 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
            <span>
              {isExporting
                ? `Recording (${exportProgress?.percent || 0}%)...`
                : 'Export MP4'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player (Left) + Controls (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: 9:16 Reel Player Canvas */}
        <div className="lg:w-[42%] w-full flex flex-col items-center">
          <div className="sticky top-20 w-full max-w-[380px] flex flex-col items-center gap-4">
            {/* Player Container (Phone Aspect Ratio) */}
            <div className="w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-white/15 shadow-2xl shadow-purple-500/15 relative group">
              <canvas ref={canvasRef} className="w-full h-full object-contain select-none" />

              {/* Play Overlay when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-2xl shadow-rose-500/40 hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 ml-1" />
                  </div>
                </div>
              )}

              {/* Live Status Badge */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5 shadow-md">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span>{isPlaying ? 'PLAYING PREVIEW' : '9:16 REEL PREVIEW'}</span>
              </div>

              {/* Slide Counter Indicator */}
              {videoMode === 'passage' && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 flex items-center gap-1 shadow-md">
                  <span>
                    Slide {currentSlideIndex + 1} / {currentPassage.slides.length}
                  </span>
                </div>
              )}

              {/* Audio Sync Status Indicator */}
              <div className="absolute bottom-4 left-4 right-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-[11px] text-white/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isLoadingAudio ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span className="text-amber-300 font-mono text-[10px]">Syncing Speech Audio...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-mono text-[10px]">Voice & BGM 100% Synced</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
                  <span>{isVoiceoverActive ? '🎙️ Voice ON' : '🎙️ Voice OFF'}</span>
                  <span>•</span>
                  <span>{isMusicActive ? '🎵 BGM ON' : '🔇 Mute'}</span>
                </div>
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="w-full p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3 shadow-sm">
              {/* Scrub Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-600 font-bold">
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
                    studioAudioEngine.stopPlayback();
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Playback Buttons & Quick Toggles */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-bold transition-all shadow-md shadow-rose-500/20 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
                    title="Reset to beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Audio Toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      studioAudioEngine.unlockAudio();
                      setIsVoiceoverActive(!isVoiceoverActive);
                      if (isPlaying) {
                        studioAudioEngine.startPlayback({
                          currentTime,
                          slideAudios,
                          isMusicActive,
                          isVoiceActive: !isVoiceoverActive,
                          ambientType,
                        });
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      isVoiceoverActive
                        ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Voiceover</span>
                  </button>

                  <button
                    onClick={() => {
                      studioAudioEngine.unlockAudio();
                      setIsMusicActive(!isMusicActive);
                      if (isPlaying) {
                        studioAudioEngine.startPlayback({
                          currentTime,
                          slideAudios,
                          isMusicActive: !isMusicActive,
                          isVoiceActive: isVoiceoverActive,
                          ambientType,
                        });
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      isMusicActive && ambientType !== 'none'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>BGM Music</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization & Story Controls */}
        <div className="lg:w-[58%] w-full space-y-5">
          {/* Format Mode Switcher: 6-8 Slide Story vs Single Quote */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between gap-3 flex-wrap shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">வடிவம் (Format):</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSwitchMode('passage')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  videoMode === 'passage'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 6-8 Slide Story Passage (POV)</span>
              </button>

              <button
                onClick={() => handleSwitchMode('quote')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  videoMode === 'quote'
                    ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white border-transparent shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>💬 Classic Single Quote</span>
              </button>
            </div>
          </div>

          {/* Language Switcher & Story Passages Container */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">மொழி (Language):</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSwitchLanguage('ta')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quoteLanguage === 'ta'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🌾 தமிழ் (Tamil)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchLanguage('en')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    quoteLanguage === 'en'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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

                {/* Slides Interactive Card List with Precise Audio Timings */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
                      ஸ்லைடுகள் (Click any slide to jump & preview):
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      Total: {totalDuration.toFixed(1)}s
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {currentPassage.slides.map((slide, idx) => {
                      const timing = slideTimings[idx];
                      const isCurrent = currentSlideIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleJumpToSlide(idx)}
                          className={`p-3 rounded-2xl border text-xs transition-all cursor-pointer flex items-start gap-3 ${
                            isCurrent
                              ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/30'
                              : 'bg-black/30 border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                                isCurrent ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/60'
                              }`}
                            >
                              Slide {idx + 1}
                            </span>
                            {timing && (
                              <span className="text-[9px] font-mono text-white/40 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {timing.duration.toFixed(1)}s
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="leading-relaxed">{slide}</p>
                            {timing && (
                              <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-white/40">
                                <span>{timing.startTime.toFixed(1)}s - {timing.endTime.toFixed(1)}s</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Copy Full Story Caption */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/50">முழு கதை உரை (Full Caption):</span>
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
                          const pool =
                            cat.id === 'all'
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
                          const pool =
                            cat.id === 'all'
                              ? PRESET_QUOTES
                              : PRESET_QUOTES.filter((q) => q.theme === cat.id);
                          if (pool.length > 0) {
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

          {/* Section: Audio Mixing Console (Voiceover + BGM Control) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  ஸ்டுடியோ ஆடியோ மிக்ஸர் (Audio Console)
                </h3>
              </div>
              <span className="text-[10px] text-indigo-600 font-mono font-bold">
                Auto-Ducking: BGM dips smoothly during speech
              </span>
            </div>

            {/* Voiceover Volume Control */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                  குரல் ஒலி அளவு (Voiceover Volume)
                </span>
                <span className="font-mono text-rose-600 font-bold">{Math.round(voiceVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.05}
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Background BGM Volume Control */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-indigo-500" />
                  பின்னணி இசை ஒலி அளவு (BGM Music Volume)
                </span>
                <span className="font-mono text-indigo-600 font-bold">{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* BGM Track Selector */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                பின்னணி இசை தேர்வு (Select BGM Track):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AMBIENT_SOUNDSCAPES.map((sound) => {
                  const isSelected = ambientType === sound.id;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => {
                        studioAudioEngine.unlockAudio();
                        setAmbientType(sound.id);
                        if (isPlaying) {
                          studioAudioEngine.startPlayback({
                            currentTime,
                            slideAudios,
                            isMusicActive,
                            isVoiceActive: isVoiceoverActive,
                            ambientType: sound.id,
                          });
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 text-slate-900 shadow-xs ring-1 ring-indigo-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{sound.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {sound.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-2">{sound.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Character Avatar Picker */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              கார்ட்டூன் அவதார் (Character Avatar)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CARTOON_CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedCharacter === char.id
                      ? 'bg-amber-50 border-amber-300 text-slate-900 shadow-xs ring-1 ring-amber-300 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base block mb-1">
                    {char.id === 'anime-warrior'
                      ? '⚔️'
                      : char.id === 'stoic-monk'
                      ? '🧘'
                      : char.id === 'minimalist-doodle'
                      ? '✏️'
                      : '🌌'}
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
