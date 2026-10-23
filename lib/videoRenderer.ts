import { drawCartoonCharacter, CARTOON_CHARACTERS } from './cartoonAvatars';
import { WordTiming } from './voiceoverTTS';

export interface SlideTimingInfo {
  index: number;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface VideoRenderConfig {
  quote: string;
  author: string;
  characterId: 'anime-warrior' | 'minimalist-doodle' | 'stoic-monk' | 'cosmic-wanderer';
  wordTimings: WordTiming[];
  currentTime: number;
  totalDuration: number;
  particleType: 'sparks' | 'mist' | 'stars' | 'rain';
  handle: string;
  slides?: string[];
  passageCategory?: string;
  slideTimings?: SlideTimingInfo[];
}

/**
 * 9:16 High-Impact Vertical Reels Canvas Engine (1080x1920)
 * Renders:
 * - Animated dark luxury background
 * - Procedural particles (sparks, stars, mist)
 * - Animated breathing cartoon character
 * - 6-8 Slide Progressive Story Passage Display (Instagram Story / Carousel Reel format)
 * - Kinetic Alex Hormozi-style glowing subtitles (Quote format)
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
  const isTamil = /[\u0B80-\u0BFF]/.test(config.quote);
  const charDef = CARTOON_CHARACTERS.find(c => c.id === config.characterId);
  const accent = charDef?.accentColor || '#F59E0B';

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
  const spotGrad = ctx.createRadialGradient(width / 2, height * 0.38, 60, width / 2, height * 0.38, 550);
  spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Check if this is a Multi-Slide Story Passage Reel
  const hasSlides = config.slides && config.slides.length > 0;
  const slides = config.slides || [];
  const slideCount = slides.length;

  if (hasSlides) {
    // =========================================================
    // MULTI-SLIDE PASSAGE REEL RENDERING (6-8 SLIDES)
    // =========================================================
    let activeSlideIndex = 0;
    let slideStartTime = 0;
    let slideEndTime = config.totalDuration / slideCount;

    if (config.slideTimings && config.slideTimings.length === slideCount) {
      const foundIdx = config.slideTimings.findIndex((st) => t >= st.startTime && t < st.endTime);
      if (foundIdx !== -1) {
        activeSlideIndex = foundIdx;
        slideStartTime = config.slideTimings[foundIdx].startTime;
        slideEndTime = config.slideTimings[foundIdx].endTime;
      } else if (t >= config.slideTimings[slideCount - 1].endTime) {
        activeSlideIndex = slideCount - 1;
        slideStartTime = config.slideTimings[slideCount - 1].startTime;
        slideEndTime = config.slideTimings[slideCount - 1].endTime;
      }
    } else {
      const slideDuration = config.totalDuration / slideCount;
      activeSlideIndex = Math.min(slideCount - 1, Math.max(0, Math.floor(t / slideDuration)));
      slideStartTime = activeSlideIndex * slideDuration;
      slideEndTime = slideStartTime + slideDuration;
    }

    const currentSlideDuration = Math.max(0.1, slideEndTime - slideStartTime);
    const slideTime = Math.max(0, t - slideStartTime);
    const slideProgress = Math.min(1, Math.max(0, slideTime / currentSlideDuration));

    // A. Top Instagram Story Progress Bars
    const barTopY = 90;
    const barGap = 8;
    const totalBarsWidth = width - 120;
    const barW = (totalBarsWidth - (slideCount - 1) * barGap) / slideCount;
    const barH = 5;

    for (let s = 0; s < slideCount; s++) {
      const bx = 60 + s * (barW + barGap);
      // Background unfilled bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.roundRect(bx, barTopY, barW, barH, 3);
      ctx.fill();

      // Foreground filled bar
      if (s < activeSlideIndex) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(bx, barTopY, barW, barH, 3);
        ctx.fill();
      } else if (s === activeSlideIndex) {
        const fillW = Math.max(4, barW * slideProgress);
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.roundRect(bx, barTopY, fillW, barH, 3);
        ctx.fill();
      }
    }

    // B. Category Header Badge
    ctx.save();
    const badgeText = config.passageCategory || (isTamil ? `பகுதி ${activeSlideIndex + 1} / ${slideCount} 🌱` : `SLIDE ${activeSlideIndex + 1} OF ${slideCount} ✨`);
    ctx.font = '700 24px "Montserrat", "Noto Sans Tamil", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bMetrics = ctx.measureText(badgeText);
    const bW = bMetrics.width + 48;
    const bH = 46;
    const bX = (width - bW) / 2;
    const bY = 135;

    ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
    ctx.beginPath();
    ctx.roundRect(bX, bY, bW, bH, 23);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.fillText(badgeText, width / 2, bY + bH / 2);
    ctx.restore();

    // C. Draw Animated Cartoon Avatar Character in Center Upper
    const charX = width / 2;
    const charY = height * 0.36;
    drawCartoonCharacter(ctx, config.characterId, charX, charY, t, 1.45);

    // D. Frosted Glass Passage Narrative Card
    const cardMargin = 60;
    const cardTop = height * 0.54;
    const cardWidth = width - (cardMargin * 2);
    const cardHeight = height * 0.33;

    ctx.save();
    ctx.fillStyle = 'rgba(12, 18, 30, 0.78)';
    ctx.beginPath();
    ctx.roundRect(cardMargin, cardTop, cardWidth, cardHeight, 32);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Subtle corner glow
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cardMargin, cardTop, 80, 80, [32, 0, 0, 0]);
    ctx.stroke();
    ctx.restore();

    // E. Render Narrative Passage Text
    ctx.save();
    const activeText = slides[activeSlideIndex] || config.quote;
    const prevText = activeSlideIndex > 0 ? slides[activeSlideIndex - 1] : null;

    // Fade-in animation for active slide
    const slideOpacity = Math.min(1, slideTime * 4); // Quick 0.25s smooth fade
    const slideSlideY = Math.max(0, (1 - Math.min(1, slideTime * 3)) * 25); // Slight 25px slide-up

    // Font stack
    const fontFamilies = isTamil
      ? '"Mukta Malar", "Noto Sans Tamil", sans-serif'
      : '"Montserrat", "Plus Jakarta Sans", sans-serif';

    // Measure & wrap active text
    ctx.font = `800 ${isTamil ? 46 : 52}px ${fontFamilies}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxTextWidth = cardWidth - 80;
    const wrappedActiveLines = wrapText(ctx, activeText, maxTextWidth);

    // Previous slide dimmed text (context)
    if (prevText) {
      ctx.save();
      ctx.font = `600 ${isTamil ? 32 : 36}px ${fontFamilies}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
      const prevLines = wrapText(ctx, prevText, maxTextWidth);
      const prevY = cardTop + 75;
      prevLines.slice(0, 2).forEach((line, idx) => {
        ctx.fillText(line, width / 2, prevY + (idx * 44));
      });
      ctx.restore();
    }

    // Active Slide text
    ctx.save();
    ctx.font = `800 ${isTamil ? 46 : 52}px ${fontFamilies}`;
    ctx.fillStyle = `rgba(255, 255, 255, ${slideOpacity})`;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 24 * slideOpacity;

    const lineHeight = isTamil ? 68 : 72;
    const totalTextH = wrappedActiveLines.length * lineHeight;
    const activeCenterY = cardTop + (cardHeight / 2) + (prevText ? 40 : 0) + slideSlideY;
    const startY = activeCenterY - (totalTextH / 2) + (lineHeight / 2);

    wrappedActiveLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startY + (idx * lineHeight));
    });
    ctx.restore();
    ctx.restore();

  } else {
    // =========================================================
    // STANDARD KINETIC HORMOZI SUBTITLES MODE
    // =========================================================
    const charX = width / 2;
    const charY = height * 0.42;
    drawCartoonCharacter(ctx, config.characterId, charX, charY, t, 1.85);

    // Category Header Badge
    ctx.save();
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
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.fillText(badgeText, width / 2, bY + bH / 2);
    ctx.restore();

    // Kinetic Hormozi-Style Animated Subtitles
    ctx.save();
    const subtitleY = height * 0.70;
    const chunkSize = isTamil ? 3 : 5;
    const baseFontSize = isTamil ? 48 : 58;
    const popFontSize = isTamil ? 56 : 66;
    const fontFamilies = isTamil
      ? '"Mukta Malar", "Noto Sans Tamil", "Montserrat", sans-serif'
      : '"Montserrat", "Mukta Malar", sans-serif';

    ctx.font = `900 ${baseFontSize}px ${fontFamilies}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const activeWordIndex = config.wordTimings.findIndex(
      w => t >= w.startTime && t <= w.endTime
    );

    let windowStart = 0;
    if (activeWordIndex !== -1) {
      windowStart = Math.max(0, Math.floor(activeWordIndex / chunkSize) * chunkSize);
    }
    const currentChunk = config.wordTimings.slice(windowStart, windowStart + chunkSize);
    const wordsToDraw = currentChunk;

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
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 24;
        ctx.font = `900 ${popFontSize}px ${fontFamilies}`;
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
  }

  // Author Attribution (Never render Spark Within as author; Spark Within is the brand)
  const isSparkBrand = config.author.toLowerCase().includes('spark within');
  const isKural = config.author.includes('வள்ளுவர்') || config.quote.includes('முயற்சி') || config.quote.includes('உள்ளுவதெல்லாம்');
  const cleanAuthor = isKural ? 'திருவள்ளுவர்' : (isSparkBrand ? '' : config.author.replace(/\(?உள்\s*ஒளி\)?/g, '').trim());

  if (cleanAuthor) {
    ctx.save();
    const authorY = height * 0.89;
    ctx.font = isTamil ? '700 30px "Noto Sans Tamil", sans-serif' : '700 32px "Cinzel", serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`— ${cleanAuthor}`, width / 2, authorY);
    ctx.restore();
  }

  // Bottom Brand Signature & Watermark
  ctx.save();
  const watermarkY = height - 90;
  ctx.font = '700 28px "Inter", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 10;
  ctx.fillText(`◆  ${config.handle}`, width / 2, watermarkY);

  // Audio Waveform Visualizer simulation at the very bottom
  const waveY = height - 40;
  const barCount = 30;
  const barW = 12;
  const barGap = 10;
  const waveTotalW = barCount * barW + (barCount - 1) * barGap;
  let waveStartX = (width - waveTotalW) / 2;

  for (let b = 0; b < barCount; b++) {
    const waveH = 8 + Math.abs(Math.sin(t * 6 + b * 0.4)) * 32;
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(waveStartX, waveY - waveH / 2, barW, waveH);
    waveStartX += barW + barGap;
  }
  ctx.restore();
}

/**
 * Text wrapping helper function for canvas
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
