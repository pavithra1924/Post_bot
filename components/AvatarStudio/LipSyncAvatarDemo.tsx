'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
  Check,
  Film,
  Zap,
  Music,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Eye,
  MessageCircle,
  Activity,
} from 'lucide-react';
import {
  computeLipSyncState,
  drawTalkingGirlAvatar,
  LipSyncState,
} from '@/lib/lipSyncEngine';
import { studioAudioEngine, DecodedSlideAudio } from '@/lib/studioAudioEngine';
import { exportReelVideo, downloadVideoBlob, ExportProgress } from '@/lib/videoExporter';
import { calculateWordTimings, WordTiming } from '@/lib/voiceoverTTS';
import confetti from 'canvas-confetti';

interface LipSyncAvatarDemoProps {
  onSelectForMainStudio?: () => void;
  onClose?: () => void;
}

interface DemoQuoteOption {
  lang: 'ta' | 'en';
  label: string;
  quote: string;
  author: string;
  category: string;
}

const DEMO_PRESETS: DemoQuoteOption[] = [
  {
    lang: 'ta',
    label: '🌾 தமிழ் உத்வேகம் (Tamil Spark)',
    quote: 'முயற்சி மட்டுமே வெற்றியை தரும். உன் கனவுகளை எக்காரணத்தை கொண்டும் கைவிடாதே! நீ நினைத்தால் முடியாதது எதுவுமில்லை.',
    author: 'Spark Within',
    category: 'தன்னம்பிக்கை 🌱',
  },
  {
    lang: 'ta',
    label: '🔥 எழுந்து நில் (Rise Again)',
    quote: 'தோல்வி என்பது முடிவு அல்ல, அது ஒரு புதிய தொடக்கம். நீ கடந்து வந்த வலிகள் அனைத்தும் நாளை உன் வெற்றியாக மாறும்.',
    author: 'Spark Within',
    category: 'வெற்றி நிச்சயம் 🏆',
  },
  {
    lang: 'en',
    label: '✨ Inner Fire (English Spark)',
    quote: 'Do not let anyone put out your spark. Even the smallest ember can ignite the greatest fire within you.',
    author: 'Spark Within',
    category: 'INNER POWER ⚡',
  },
  {
    lang: 'en',
    label: '🚀 Limitless Mind (English)',
    quote: 'The only limit to your impact is your imagination and commitment. Show up every day with unstoppable belief.',
    author: 'Spark Within',
    category: 'UNSTOPPABLE 🚀',
  },
];

export const LipSyncAvatarDemo: React.FC<LipSyncAvatarDemoProps> = ({
  onSelectForMainStudio,
  onClose,
}) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const activePreset = DEMO_PRESETS[selectedPresetIndex];

  const [quoteText, setQuoteText] = useState(activePreset.quote);
  const [authorText, setAuthorText] = useState(activePreset.author);
  const [lang, setLang] = useState<'ta' | 'en'>(activePreset.lang);

  // Audio & Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(14);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [wordTimings, setWordTimings] = useState<WordTiming[]>([]);
  const [slideAudios, setSlideAudios] = useState<DecodedSlideAudio[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [isMusicActive, setIsMusicActive] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.3);

  // Live telemetry for visual feedback
  const [liveAmplitude, setLiveAmplitude] = useState(0);
  const [liveLipState, setLiveLipState] = useState<LipSyncState>({
    mouthOpen: 0,
    jawDrop: 0,
    mouthWidth: 0,
    isSpeaking: false,
    blinkProgress: 0,
    headTilt: 0,
    breathOffset: 0,
    vocalNod: 0,
  });

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);

  // Canvas and animation refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const avatarImageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload Indian Girl Avatar Image
  useEffect(() => {
    const img = new Image();
    img.src = '/avatars/indian-girl.png';
    img.onload = () => {
      avatarImageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  // Sync music volume
  useEffect(() => {
    studioAudioEngine.setMusicVolume(isMusicActive ? musicVolume : 0);
  }, [musicVolume, isMusicActive]);

  // Load Speech Audio for current text
  const loadSpeechAudio = useCallback(async (textToSpeak: string, language: 'ta' | 'en') => {
    setIsLoadingAudio(true);
    try {
      const timingsResult = calculateWordTimings(textToSpeak, 0.88, 1.25);
      setWordTimings(timingsResult.words);

      const session = await studioAudioEngine.loadPassageAudio([textToSpeak], language);
      setSlideAudios(session.slideAudios);
      setDuration(Math.max(6, session.totalDuration));
    } catch (err) {
      console.warn('Error loading speech audio:', err);
    } finally {
      setIsLoadingAudio(false);
    }
  }, []);

  // Update speech when preset or text changes
  useEffect(() => {
    loadSpeechAudio(quoteText, lang);
  }, [quoteText, lang, loadSpeechAudio]);

  // Switch preset
  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    const p = DEMO_PRESETS[idx];
    setLang(p.lang);
    setQuoteText(p.quote);
    setAuthorText(p.author);
    if (isPlaying) {
      handleStop();
    }
  };

  // Playback handlers
  const handlePlay = () => {
    studioAudioEngine.unlockAudio();
    setIsPlaying(true);
    lastTimeRef.current = performance.now();

    studioAudioEngine.startPlayback({
      currentTime,
      slideAudios,
      isMusicActive,
      isVoiceActive,
      ambientType: 'tamil-melody-bgm',
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    studioAudioEngine.stopPlayback();
    setLiveAmplitude(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    studioAudioEngine.stopPlayback();
    setLiveAmplitude(0);
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(duration, time));
    setCurrentTime(clamped);
    if (isPlaying) {
      studioAudioEngine.startPlayback({
        currentTime: clamped,
        slideAudios,
        isMusicActive,
        isVoiceActive,
        ambientType: 'tamil-melody-bgm',
      });
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localRunning = true;

    const loop = (now: number) => {
      if (!localRunning) return;

      let currentAmp = 0;
      if (isPlaying) {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= duration) {
            setIsPlaying(false);
            studioAudioEngine.stopPlayback();
            return duration;
          }
          return next;
        });

        // Sample real audio amplitude from engine
        currentAmp = isVoiceActive ? studioAudioEngine.getVoiceAmplitude() : 0;
        // Fallback simulation if browser blocks live audio nodes
        if (currentAmp < 0.05 && wordTimings.length > 0) {
          const isWordActive = wordTimings.some((w) => currentTime >= w.startTime && currentTime <= w.endTime);
          if (isWordActive) {
            currentAmp = 0.55 + 0.35 * Math.sin(currentTime * 24);
          }
        }
      } else {
        lastTimeRef.current = now;
        currentAmp = 0;
      }

      setLiveAmplitude(currentAmp);

      // Compute lip-sync & blinking state
      const state = computeLipSyncState(currentAmp, currentTime, liveLipState);
      setLiveLipState(state);

      // Render vertical 9:16 frame (1080 x 1920 logical canvas resolution)
      const w = 1080;
      const h = 1920;
      canvas.width = w;
      canvas.height = h;

      // 1. Dark Velvet Aesthetic Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#150614');
      bgGrad.addColorStop(0.5, '#240C21');
      bgGrad.addColorStop(1, '#090208');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Animated Floating Golden & Rose Sparks
      const t = currentTime;
      const particleCount = 40;
      for (let i = 0; i < particleCount; i++) {
        const pSeed = (i * 137.5) % 1000;
        const px = ((pSeed * 17.3 + t * 45) % (w + 100)) - 50;
        const py = h - (((pSeed * 31.7 + t * 85) % (h + 100)) - 50);
        const pSize = (pSeed % 4) + 2;
        const pAlpha = 0.25 + (Math.sin(t * 3.5 + i) + 1) * 0.35;

        ctx.fillStyle = i % 2 === 0 ? `rgba(236, 72, 153, ${pAlpha})` : `rgba(245, 158, 11, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Central Ambient Spotlight
      const spotGrad = ctx.createRadialGradient(w / 2, h * 0.38, 80, w / 2, h * 0.38, 550);
      spotGrad.addColorStop(0, 'rgba(236, 72, 153, 0.12)');
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, w, h);

      // 4. Header Badge
      ctx.save();
      const badgeText = activePreset.category;
      ctx.font = '700 24px "Montserrat", "Noto Sans Tamil", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const bMetrics = ctx.measureText(badgeText);
      const bW = bMetrics.width + 50;
      const bH = 46;
      const bX = (w - bW) / 2;
      const bY = 140;

      ctx.fillStyle = 'rgba(20, 10, 25, 0.85)';
      ctx.beginPath();
      ctx.roundRect(bX, bY, bW, bH, 23);
      ctx.fill();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#F472B6';
      ctx.fillText(badgeText, w / 2, bY + bH / 2);
      ctx.restore();

      // 5. Draw Photo Talking Avatar (The Girl's Portrait)
      if (avatarImageRef.current && avatarImageRef.current.complete) {
        const charX = w / 2;
        const charY = h * 0.40;
        // Draw with scale ~1.55 so she fills the upper-middle frame majestically
        drawTalkingGirlAvatar(
          ctx,
          avatarImageRef.current,
          state,
          charX,
          charY,
          480,
          615,
          {
            enableBlink: true,
            enableBreathing: true,
            enableHeadMotion: true,
            shadowGlow: 'rgba(236, 72, 153, 0.35)',
          }
        );
      }

      // 6. Frosted Glass Quote Card
      const cardMargin = 60;
      const cardTop = h * 0.60;
      const cardWidth = w - cardMargin * 2;
      const cardHeight = h * 0.28;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 8, 20, 0.82)';
      ctx.beginPath();
      ctx.roundRect(cardMargin, cardTop, cardWidth, cardHeight, 32);
      ctx.fill();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top corner pink accent glow
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(cardMargin, cardTop, 90, 90, [32, 0, 0, 0]);
      ctx.stroke();

      // Subtitles & Quote Text inside card
      const isTamil = lang === 'ta';
      const fontFamilies = isTamil
        ? '"Mukta Malar", "Noto Sans Tamil", sans-serif'
        : '"Montserrat", "Plus Jakarta Sans", sans-serif';

      ctx.font = `800 ${isTamil ? 46 : 50}px ${fontFamilies}`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(236, 72, 153, 0.5)';
      ctx.shadowBlur = 18;

      // Wrap text
      const maxTextWidth = cardWidth - 80;
      const words = quoteText.split(' ');
      const lines: string[] = [];
      let curLine = '';
      for (const word of words) {
        const testLine = curLine ? `${curLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxTextWidth && curLine) {
          lines.push(curLine);
          curLine = word;
        } else {
          curLine = testLine;
        }
      }
      if (curLine) lines.push(curLine);

      const lineHeight = isTamil ? 66 : 70;
      const totalTextH = lines.length * lineHeight;
      const startY = cardTop + cardHeight / 2 - totalTextH / 2 + lineHeight / 2;

      lines.forEach((l, idx) => {
        ctx.fillText(l, w / 2, startY + idx * lineHeight);
      });
      ctx.restore();

      // 7. Author Attribution
      ctx.save();
      const authorY = h * 0.91;
      ctx.font = isTamil ? '700 30px "Noto Sans Tamil", sans-serif' : '700 32px "Cinzel", serif';
      ctx.fillStyle = '#F472B6';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`— ${authorText}`, w / 2, authorY);
      ctx.restore();

      // 8. Watermark
      ctx.save();
      const watermarkY = h - 75;
      ctx.font = '700 28px "Inter", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 10;
      ctx.fillText(`◆ @_sparkwithin_hub_`, w / 2, watermarkY);

      // 9. Audio Waveform Visualizer bars at bottom
      const waveY = h - 35;
      const barCount = 30;
      const barW = 12;
      const barGap = 10;
      const waveTotalW = barCount * barW + (barCount - 1) * barGap;
      let waveStartX = (w - waveTotalW) / 2;

      for (let b = 0; b < barCount; b++) {
        const barH = 6 + (currentAmp * 35 + Math.abs(Math.sin(t * 7 + b * 0.4)) * 18);
        ctx.fillStyle = '#EC4899';
        ctx.globalAlpha = 0.85;
        ctx.fillRect(waveStartX, waveY - barH / 2, barW, barH);
        waveStartX += barW + barGap;
      }
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      localRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [
    isPlaying,
    currentTime,
    duration,
    quoteText,
    authorText,
    lang,
    isVoiceActive,
    isMusicActive,
    activePreset,
    wordTimings,
    liveLipState,
  ]);

  // Direct Video Export Handler
  const handleExportTrialVideo = async () => {
    setIsExporting(true);
    setExportProgress({ percent: 0, currentFrame: 0, totalFrames: 1 });

    try {
      studioAudioEngine.unlockAudio();
      studioAudioEngine.startPlayback({
        currentTime: 0,
        slideAudios,
        isMusicActive,
        isVoiceActive,
        ambientType: 'tamil-melody-bgm',
      });

      const audioTrack = studioAudioEngine.getMediaStreamTrack();

      const blob = await exportReelVideo(
        {
          quote: quoteText,
          author: authorText,
          characterId: 'indian-girl',
          wordTimings,
          totalDuration: duration,
          particleType: 'sparks',
          handle: '@_sparkwithin_hub_',
        },
        (progress) => {
          setExportProgress(progress);
        },
        audioTrack
      );

      downloadVideoBlob(blob, `aanya-talking-avatar-trial-${lang}.mp4`);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Trial video export failed:', err);
      alert('Video export error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
      setExportProgress(null);
      studioAudioEngine.stopPlayback();
    }
  };

  // Approval handler
  const handleApprove = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
    });
    if (onSelectForMainStudio) {
      onSelectForMainStudio();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-rose-950/70 to-amber-950/80 border border-rose-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
              <span>AI Photo Talking Avatar • Lip-Sync Trial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Aanya — Photo Lip-Sync Video Demo
            </h2>
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Experience the uploaded Indian girl portrait speaking motivational quotes in{' '}
              <span className="text-amber-300 font-semibold">Tamil & English</span>. Fully synchronized with
              audio-driven jaw movements, mouth visemes, and natural eye blinking.
            </p>
          </div>

          {/* Action to approve & use in main studio */}
          <div className="flex items-center gap-3 shrink-0">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Back to Studio
              </button>
            )}
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-lg shadow-rose-500/25 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Approve & Set as Main Video Character</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Canvas Phone Preview | Right Controls & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Video Canvas Stage (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-rose-500/40 shadow-2xl shadow-rose-950/60 bg-black">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover block"
            />

            {/* Top Live Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? 'bg-rose-500 animate-pulse' : 'bg-white/40'
                }`}
              />
              <span className="text-[11px] font-bold text-white tracking-wide">
                {isPlaying ? 'SPEAKING' : 'IDLE PREVIEW'}
              </span>
            </div>

            {/* Audio Loaded Indicator */}
            {isLoadingAudio && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
                <span className="text-xs text-white/80 font-bold">Synthesizing Voice Audio...</span>
              </div>
            )}
          </div>

          {/* Quick Play & Scrubber Under Canvas */}
          <div className="w-full max-w-[360px] mt-4 p-4 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/60 font-mono">
              <span>{currentTime.toFixed(1)}s</span>
              <span className="text-rose-400 font-bold">
                {lang === 'ta' ? '🌾 தமிழ் குரல்' : '🇺🇸 English Voice'}
              </span>
              <span>{duration.toFixed(1)}s</span>
            </div>

            {/* Scrubber slider */}
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />

            {/* Playback action buttons */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={handleStop}
                title="Reset to 0s"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={isLoadingAudio}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                title={isVoiceActive ? 'Mute Speech' : 'Unmute Speech'}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isVoiceActive
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsMusicActive(!isMusicActive)}
                title={isMusicActive ? 'Mute Piano BGM' : 'Unmute Piano BGM'}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isMusicActive
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                <Music className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Test Bench, Telemetry & Export (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Lip-Sync Telemetry Box */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-rose-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Lip-Sync Engine Telemetry
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
                60 FPS REALTIME
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {/* Mouth Openness */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/50 block mb-1">Mouth Openness</span>
                <span className="text-base font-extrabold text-rose-400 font-mono">
                  {(liveLipState.mouthOpen * 100).toFixed(0)}%
                </span>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-75"
                    style={{ width: `${Math.min(100, liveLipState.mouthOpen * 100)}%` }}
                  />
                </div>
              </div>

              {/* Speech Energy */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/50 block mb-1">Speech Energy</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {(liveAmplitude * 100).toFixed(0)}%
                </span>
                <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-75"
                    style={{ width: `${Math.min(100, liveAmplitude * 100)}%` }}
                  />
                </div>
              </div>

              {/* Active Viseme Shape */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/50 block mb-1">Active Viseme</span>
                <span className="text-xs font-bold text-purple-300 font-mono block truncate">
                  {!liveLipState.isSpeaking
                    ? 'Resting 😊'
                    : liveLipState.mouthOpen > 0.55
                    ? 'Open [AA/ஆ]'
                    : liveLipState.mouthWidth > 0.1
                    ? 'Spread [EE/ஈ]'
                    : 'Vowel [EH/எ]'}
                </span>
                <span className="text-[9px] text-white/40 block mt-1">Phoneme Shape</span>
              </div>

              {/* Eye Blink Status */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/50 block mb-1">Blink Cycle</span>
                <span className="text-xs font-bold text-emerald-400 font-mono block">
                  {liveLipState.blinkProgress > 0.4 ? 'Blinking ✨' : 'Eyes Open 👁️'}
                </span>
                <span className="text-[9px] text-white/40 block mt-1">Every ~3.6s</span>
              </div>
            </div>
          </div>

          {/* Test Presets Selection */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>1-Click Test Quotes (Tamil & English)</span>
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLang('ta')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    lang === 'ta'
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  🌾 தமிழ்
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-rose-500 text-white shadow'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                    selectedPresetIndex === idx
                      ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-[11px] font-extrabold text-white block">{p.label}</span>
                  <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">"{p.quote}"</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Quote Input */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Custom Quote or Message (Live Pronunciation)
            </h3>
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              rows={3}
              placeholder="Type any quote in Tamil or English..."
              className="w-full p-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm focus:border-rose-500 focus:outline-none transition-colors"
            />
            <div className="flex items-center justify-between gap-3 pt-1">
              <input
                type="text"
                value={authorText}
                onChange={(e) => setAuthorText(e.target.value)}
                placeholder="Author Attribution"
                className="w-48 p-2 rounded-lg bg-black/30 border border-white/10 text-white text-xs focus:border-rose-500 focus:outline-none"
              />
              <button
                onClick={() => loadSpeechAudio(quoteText, lang)}
                disabled={isLoadingAudio}
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isLoadingAudio ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
                <span>Refresh Voice</span>
              </button>
            </div>
          </div>

          {/* Export Trial Video Button */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-purple-950/40 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 justify-center sm:justify-start">
                <Film className="w-4 h-4 text-rose-400" />
                <span>Export 1080x1920 Trial MP4 Reel</span>
              </h4>
              <p className="text-[11px] text-white/60">
                Downloads high-resolution Instagram 9:16 video with synchronized lip-sync speech & Tamil piano BGM.
              </p>
            </div>

            <button
              onClick={handleExportTrialVideo}
              disabled={isExporting || isLoadingAudio}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Recording {exportProgress?.percent || 0}%...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Trial Reel MP4</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
