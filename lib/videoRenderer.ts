import { drawCartoonCharacter, CARTOON_CHARACTERS } from './cartoonAvatars';
import { WordTiming } from './voiceoverTTS';

export interface VideoRenderConfig {
  quote: string;
  author: string;
  characterId: 'anime-warrior' | 'minimalist-doodle' | 'stoic-monk' | 'cosmic-wanderer';
  wordTimings: WordTiming[];
  currentTime: number;
  totalDuration: number;
  particleType: 'sparks' | 'mist' | 'stars' | 'rain';
  handle: string;
}

/**
 * 9:16 High-Impact Vertical Reels Canvas Engine (1080x1920)
 * Renders:
 * - Animated dark luxury background
 * - Procedural particles (sparks, stars, mist)
 * - Animated breathing cartoon character
 * - Kinetic Alex Hormozi-style glowing subtitles
 * - Watermark and audio wave bars
 */
export function renderVideoFrame(
  canvas: HTMLCanvasElement,
  config: VideoRenderConfig
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;

  const t = config.currentTime;

  // 1. Dark Luxury Background with Animated Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (config.characterId === 'anime-warrior') {
    bgGrad.addColorStop(0, '#0F0906');
    bgGrad.addColorStop(0.5, '#1A0C08');
    bgGrad.addColorStop(1, '#050201');
  } else if (config.characterId === 'cosmic-wanderer') {
    bgGrad.addColorStop(0, '#0B0716');
    bgGrad.addColorStop(0.5, '#150E28');
    bgGrad.addColorStop(1, '#04020A');
  } else if (config.characterId === 'stoic-monk') {
    bgGrad.addColorStop(0, '#0A0C14');
    bgGrad.addColorStop(0.5, '#101420');
    bgGrad.addColorStop(1, '#040508');
  } else {
    bgGrad.addColorStop(0, '#080E0B');
    bgGrad.addColorStop(0.5, '#0E1712');
    bgGrad.addColorStop(1, '#030504');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Animated Floating Particles
  ctx.save();
  const particleCount = 45;
  for (let i = 0; i < particleCount; i++) {
    const pSeed = (i * 137.5) % 1000;
    const px = ((pSeed * 17.3 + t * 40) % (width + 100)) - 50;
    const py = height - (((pSeed * 31.7 + t * (config.particleType === 'rain' ? 300 : 80)) % (height + 100)) - 50);
    const pSize = (pSeed % 5) + 2;
    const pAlpha = 0.2 + (Math.sin(t * 3 + i) + 1) * 0.3;

    if (config.particleType === 'sparks') {
      ctx.fillStyle = `rgba(245, 158, 11, ${pAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    } else if (config.particleType === 'stars') {
      ctx.fillStyle = `rgba(192, 132, 252, ${pAlpha})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(px, py, pSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 3. Central Ambient Spotlight
  ctx.save();
  const spotGrad = ctx.createRadialGradient(width / 2, height * 0.42, 60, width / 2, height * 0.42, 500);
  spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 4. Draw Animated Cartoon Character
  const charX = width / 2;
  const charY = height * 0.42;
  drawCartoonCharacter(ctx, config.characterId, charX, charY, t, 1.85);

  // 5. Category Header Badge
  ctx.save();
  const charDef = CARTOON_CHARACTERS.find(c => c.id === config.characterId);
  const badgeText = charDef?.badge || 'SPARK WITHIN';
  ctx.font = '700 24px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const bMetrics = ctx.measureText(badgeText);
  const bW = bMetrics.width + 48;
  const bH = 46;
  const bX = (width - bW) / 2;
  const bY = 160;

  ctx.fillStyle = 'rgba(6, 10, 18, 0.75)';
  ctx.beginPath();
  ctx.roundRect(bX, bY, bW, bH, 12);
  ctx.fill();
  ctx.strokeStyle = charDef?.accentColor || '#F59E0B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = charDef?.accentColor || '#F59E0B';
  ctx.fillText(badgeText, width / 2, bY + bH / 2);
  ctx.restore();

  // 6. Kinetic Hormozi-Style Animated Subtitles
  ctx.save();
  const subtitleY = height * 0.70;
  const isTamil = /[\u0B80-\u0BFF]/.test(config.quote);
  const chunkSize = isTamil ? 3 : 5;
  const baseFontSize = isTamil ? 48 : 58;
  const popFontSize = isTamil ? 56 : 66;
  const fontFamilies = isTamil
    ? '"Mukta Malar", "Noto Sans Tamil", "Montserrat", sans-serif'
    : '"Montserrat", "Mukta Malar", sans-serif';

  ctx.font = `900 ${baseFontSize}px ${fontFamilies}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Find currently active word
  const activeWordIndex = config.wordTimings.findIndex(
    w => t >= w.startTime && t <= w.endTime
  );

  // Group words into readable chunk (e.g. 3 words for Tamil, 5 for English)
  let windowStart = 0;
  if (activeWordIndex !== -1) {
    windowStart = Math.max(0, Math.floor(activeWordIndex / chunkSize) * chunkSize);
  }
  const currentChunk = config.wordTimings.slice(windowStart, windowStart + chunkSize);

  // Render chunk with active word pop
  const wordsToDraw = currentChunk;

  // Measure word widths to position each word precisely
  const spaceWidth = ctx.measureText(' ').width;
  const wordWidths = wordsToDraw.map(w => ctx.measureText(w.word).width);
  const totalChunkWidth = wordWidths.reduce((sum, w) => sum + w, 0) + Math.max(0, wordsToDraw.length - 1) * spaceWidth;

  let currentDrawX = (width - totalChunkWidth) / 2;

  wordsToDraw.forEach((wt, idx) => {
    const globalIdx = windowStart + idx;
    const isCurrentActive = globalIdx === activeWordIndex;
    const isPast = globalIdx < activeWordIndex;

    ctx.save();
    if (isCurrentActive) {
      // POP & GLOW
      ctx.fillStyle = charDef?.accentColor || '#F59E0B';
      ctx.shadowColor = charDef?.accentColor || '#F59E0B';
      ctx.shadowBlur = 24;
      ctx.font = `900 ${popFontSize}px ${fontFamilies}`; // Scale pop
    } else if (isPast) {
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 12;
      ctx.font = `900 ${baseFontSize}px ${fontFamilies}`;
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = `900 ${baseFontSize}px ${fontFamilies}`;
    }

    ctx.textAlign = 'left';
    ctx.fillText(wt.word, currentDrawX, subtitleY);
    ctx.restore();

    currentDrawX += wordWidths[idx] + spaceWidth;
  });
  ctx.restore();

  // 7. Author Attribution
  ctx.save();
  ctx.font = isTamil ? '700 30px "Noto Sans Tamil", sans-serif' : '700 32px "Cinzel", serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`— ${config.author}`, width / 2, subtitleY + 90);
  ctx.restore();

  // 8. Bottom Brand Signature & Watermark
  ctx.save();
  const watermarkY = height - 120;
  ctx.font = '700 28px "Inter", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 10;
  ctx.fillText(`◆  ${config.handle}`, width / 2, watermarkY);

  // Audio Waveform Visualizer simulation at the very bottom
  const waveY = height - 60;
  const barCount = 28;
  const barW = 12;
  const barGap = 10;
  const waveTotalW = barCount * barW + (barCount - 1) * barGap;
  let waveStartX = (width - waveTotalW) / 2;

  for (let b = 0; b < barCount; b++) {
    const waveH = 8 + Math.abs(Math.sin(t * 6 + b * 0.4)) * 32;
    ctx.fillStyle = charDef?.accentColor || '#F59E0B';
    ctx.globalAlpha = 0.75;
    ctx.fillRect(waveStartX, waveY - waveH / 2, barW, waveH);
    waveStartX += barW + barGap;
  }
  ctx.restore();
}
