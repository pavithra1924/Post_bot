import { ThemeConfig } from './themes';
import { loadGoogleFont } from './fonts';

export type AspectRatio = '1:1' | '4:5' | '9:16';
export type LayoutStyle = 
  | 'pinterest-luxury' 
  | 'centered-hero' 
  | 'glass-card' 
  | 'editorial-frame' 
  | 'minimal-badge' 
  | 'atmospheric-glow';

export interface CanvasDimensions {
  width: number;
  height: number;
  label: string;
  sublabel: string;
}

export const ASPECT_DIMENSIONS: Record<AspectRatio, CanvasDimensions> = {
  '1:1': { width: 1080, height: 1080, label: '1:1', sublabel: 'Square Feed' },
  '4:5': { width: 1080, height: 1350, label: '4:5', sublabel: 'Instagram Portrait (Recommended)' },
  '9:16': { width: 1080, height: 1920, label: '9:16', sublabel: 'Story / Reel' },
};

export interface RenderQuoteOptions {
  quote: string;
  author: string;
  showAuthor?: boolean;
  isOriginalSpark?: boolean;
  theme: ThemeConfig;
  aspectRatio: AspectRatio;
  layoutStyle?: LayoutStyle;
  backgroundImageUrl?: string;
  loadedImage?: HTMLImageElement | null;
  fontFamily: string;
  fontSize: number;
  textAlign: 'center' | 'left';
  textColor: string;
  accentColor: string;
  overlayOpacity: number;
  overlayColor: string;
  showQuoteMarks: boolean;
  showBorder: boolean;
  showCategoryBadge: boolean;
  categoryBadgeText?: string;
  grainIntensity: number;
  vignette: boolean;
  handle: string;
  showHandle: boolean;
  handlePosition: 'bottom-center' | 'bottom-right' | 'bottom-left';
  showGlassCard?: boolean;
}

const imageCache = new Map<string, HTMLImageElement>();

export function preloadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn('Failed to load image:', url, err);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Ultra-Premium Pinterest & Canva Dark-Luxury HTML5 Canvas Engine.
 * Features:
 * - Ultimate background cover-up (zero letterboxing, intelligent center-crop across 1:1, 4:5, 9:16)
 * - Multi-layer cinematic lighting (central ambient radial backlight + top/bottom protection fades + edge vignette)
 * - Pinterest luxury typography with multi-stop drop shadows
 * - Verified author attribution & brand watermark formatting (@_sparkwithin_hub_)
 */
export async function renderQuoteToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderQuoteOptions
): Promise<void> {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;
  const ctx: CanvasRenderingContext2D = context;

  const { width, height } = ASPECT_DIMENSIONS[options.aspectRatio];
  canvas.width = width;
  canvas.height = height;

  const layout: LayoutStyle = options.layoutStyle || options.theme.defaultLayoutStyle || 'pinterest-luxury';
  const isGlassCard = options.showGlassCard || layout === 'glass-card';

  // 1. Ensure fonts are loaded before drawing
  await Promise.all([
    loadGoogleFont(options.fontFamily, options.theme.fontWeight),
    loadGoogleFont(options.theme.secondaryFont, 400),
    loadGoogleFont('Cinzel', 700),
    loadGoogleFont('Inter', 600),
  ]);

  // 2. Clear canvas
  ctx.clearRect(0, 0, width, height);

  // 3. Draw background image with ULTIMATE COVER-UP center crop
  let img = options.loadedImage;
  if (!img && options.backgroundImageUrl) {
    try {
      img = await preloadImage(options.backgroundImageUrl);
    } catch {
      img = null;
    }
  }

  if (img && img.complete && img.naturalWidth > 0) {
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const offsetX = (width - drawW) / 2;
    const offsetY = (height - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  } else {
    // Rich obsidian luxury gradient fallback
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#06080E');
    grad.addColorStop(0.5, '#0E1424');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 4. MULTI-LAYER CINEMATIC LIGHTING OVERLAYS

  // Layer 4a: Base Dark Luxury Tint
  ctx.save();
  ctx.fillStyle = options.overlayColor || '#06080E';
  ctx.globalAlpha = Math.max(0.2, Math.min(0.95, options.overlayOpacity));
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer 4b: Top & Bottom Protection Fades
  // Ensures header badges and watermark are 100% readable regardless of photo
  ctx.save();
  const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.28);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.70)');
  topGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, height * 0.28);

  const botGrad = ctx.createLinearGradient(0, height * 0.72, 0, height);
  botGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  botGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
  botGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, height * 0.72, width, height * 0.28);
  ctx.restore();

  // Layer 4c: Central Ambient Radial Backlight
  // Creates that Pinterest 3D depth where the quote glows out from the dark background
  const centerY = height / 2 + (options.showCategoryBadge ? 14 : 0);
  ctx.save();
  const radialRadius = Math.max(width, height) * 0.55;
  const backLight = ctx.createRadialGradient(
    width / 2, centerY, 40,
    width / 2, centerY, radialRadius
  );
  backLight.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  backLight.addColorStop(0.4, 'rgba(212, 175, 55, 0.05)');
  backLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = backLight;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer 4d: Edge-to-Edge Cinematic Vignette
  if (options.vignette || layout === 'atmospheric-glow' || layout === 'pinterest-luxury') {
    ctx.save();
    const vRadius = Math.max(width, height) * 0.72;
    const vigGrad = ctx.createRadialGradient(
      width / 2, height / 2, vRadius * 0.35,
      width / 2, height / 2, vRadius
    );
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
    vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 5. Film Grain / 35mm Analog Texture
  if (options.grainIntensity > 0.02) {
    ctx.save();
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 256;
    grainCanvas.height = 256;
    const gCtx = grainCanvas.getContext('2d');
    if (gCtx) {
      const gImgData = gCtx.createImageData(256, 256);
      const data = gImgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.floor(options.grainIntensity * 28);
      }
      gCtx.putImageData(gImgData, 0, 0);
      ctx.globalCompositeOperation = 'overlay';
      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }
    ctx.restore();
  }

  const safeMargin = options.aspectRatio === '9:16' ? 84 : 72;

  // 6. Luxury Frames & Architectural Accents
  if (options.showBorder) {
    ctx.save();
    ctx.strokeStyle = options.accentColor || '#D4AF37';
    ctx.lineWidth = 2.0;

    if (layout === 'editorial-frame' || options.theme.borderStyle === 'frame') {
      // Double Hairline Luxury Frame
      ctx.strokeRect(safeMargin, safeMargin, width - safeMargin * 2, height - safeMargin * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1.0;
      ctx.strokeRect(safeMargin + 14, safeMargin + 14, width - (safeMargin + 14) * 2, height - (safeMargin + 14) * 2);
    } else if (layout === 'pinterest-luxury') {
      // Subtle top and bottom gold luxury brackets
      const bracketW = 90;
      ctx.beginPath();
      // Top center accent bar
      ctx.moveTo(width / 2 - bracketW / 2, safeMargin + 18);
      ctx.lineTo(width / 2 + bracketW / 2, safeMargin + 18);
      // Bottom center accent bar
      ctx.moveTo(width / 2 - bracketW / 2, height - safeMargin - 52);
      ctx.lineTo(width / 2 + bracketW / 2, height - safeMargin - 52);
      ctx.stroke();
    } else if (layout === 'atmospheric-glow' || options.theme.borderStyle === 'brackets') {
      const bracketLen = 56;
      ctx.beginPath();
      // Top Left
      ctx.moveTo(safeMargin, safeMargin + bracketLen);
      ctx.lineTo(safeMargin, safeMargin);
      ctx.lineTo(safeMargin + bracketLen, safeMargin);
      // Top Right
      ctx.moveTo(width - safeMargin - bracketLen, safeMargin);
      ctx.lineTo(width - safeMargin, safeMargin);
      ctx.lineTo(width - safeMargin, safeMargin + bracketLen);
      // Bottom Left
      ctx.moveTo(safeMargin, height - safeMargin - bracketLen);
      ctx.lineTo(safeMargin, height - safeMargin);
      ctx.lineTo(safeMargin + bracketLen, height - safeMargin);
      // Bottom Right
      ctx.moveTo(width - safeMargin - bracketLen, height - safeMargin);
      ctx.lineTo(width - safeMargin, height - safeMargin);
      ctx.lineTo(width - safeMargin, height - safeMargin - bracketLen);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 7. Category Badge / Header Tag
  const badgeY = safeMargin + 54;
  if (options.showCategoryBadge) {
    ctx.save();
    const badgeText = (options.categoryBadgeText || options.theme.badge).toUpperCase();
    ctx.font = `700 20px "${options.theme.secondaryFont}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const metrics = ctx.measureText(badgeText);
    const pillPaddingX = 22;
    const pillW = metrics.width + pillPaddingX * 2;
    const pillH = 34;
    const pillX = (width - pillW) / 2;
    const pillY = badgeY - pillH / 2;

    // Dark glass pill backdrop
    ctx.fillStyle = 'rgba(6, 10, 18, 0.72)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 8);
    ctx.fill();

    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = options.accentColor;
    ctx.fillText(badgeText, width / 2, badgeY);
    ctx.restore();
  }

  // 8. Brand Watermark (@_sparkwithin_hub_)
  if (options.showHandle && options.handle) {
    ctx.save();
    const handleY = height - safeMargin - 26;
    ctx.font = `600 20px "${options.theme.secondaryFont}", sans-serif`;
    ctx.fillStyle = options.textColor;
    ctx.globalAlpha = 0.88;

    let handleX = width / 2;
    let align: CanvasTextAlign = 'center';
    if (options.handlePosition === 'bottom-left') {
      handleX = safeMargin + 24;
      align = 'left';
    } else if (options.handlePosition === 'bottom-right') {
      handleX = width - safeMargin - 24;
      align = 'right';
    }
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';

    // Format with luxury diamond prefix
    const brandedHandle = options.handle.startsWith('@') ? `◆  ${options.handle}` : options.handle;
    ctx.fillText(brandedHandle, handleX, handleY);
    ctx.restore();
  }

  // 9. Quote Text Calculations
  const maxQuoteWidth = layout === 'minimal-badge' ? width - safeMargin * 2 - 160 : width - safeMargin * 2 - 120;
  
  function wrapText(text: string, fontSz: number): string[] {
    const isTamilText = /[\u0B80-\u0BFF]/.test(text);
    const fontStack = isTamilText
      ? `"${options.fontFamily}", "Mukta Malar", "Noto Sans Tamil", sans-serif`
      : `"${options.fontFamily}", "Mukta Malar", sans-serif`;
    ctx.font = `${options.theme.fontWeight} ${fontSz}px ${fontStack}`;

    const paragraphs = text.split(/\r?\n|\\n/);
    const lines: string[] = [];

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;
      const words = trimmed.split(/\s+/);
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxQuoteWidth && currentLine) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
    }
    return lines;
  }

  let effectiveFontSize = options.fontSize;
  let lines = wrapText(options.quote, effectiveFontSize);
  const maxAllowedLines = options.aspectRatio === '9:16' ? 14 : options.aspectRatio === '4:5' ? 11 : 8;

  while (lines.length > maxAllowedLines && effectiveFontSize > 28) {
    effectiveFontSize -= 4;
    lines = wrapText(options.quote, effectiveFontSize);
  }

  const isTamilQuote = /[\u0B80-\u0BFF]/.test(options.quote);
  const effectiveLineHeight = isTamilQuote ? Math.max(1.52, options.theme.lineHeight) : options.theme.lineHeight;
  const lineHeightPx = effectiveFontSize * effectiveLineHeight;
  const quoteBlockHeight = lines.length * lineHeightPx;
  const authorGap = 44;
  const authorFontSize = Math.max(24, Math.min(34, Math.round(effectiveFontSize * 0.46)));
  
  const hasAuthorToRender = options.showAuthor !== false && Boolean(options.author);
  const totalContentHeight = quoteBlockHeight + (hasAuthorToRender ? authorGap + authorFontSize : 0);

  let startY = centerY - totalContentHeight / 2 + effectiveFontSize / 2;

  // 10. Canva Frosted Glassmorphism Card Backdrop
  if (isGlassCard) {
    ctx.save();
    const cardPaddingX = 48;
    const cardPaddingY = 56;
    const cardW = maxQuoteWidth + cardPaddingX * 2;
    const cardH = totalContentHeight + cardPaddingY * 2;
    const cardX = (width - cardW) / 2;
    const cardY = centerY - totalContentHeight / 2 - cardPaddingY + effectiveFontSize / 2;

    // Translucent dark glass fill
    ctx.fillStyle = 'rgba(6, 10, 20, 0.65)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();

    // Subtle frosted glass border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
  }

  // 11. Subtle Quotation Marks in Background
  if (options.showQuoteMarks && options.theme.quoteMarkStyle !== 'none' && layout !== 'minimal-badge') {
    ctx.save();
    ctx.font = `900 240px "${options.theme.primaryFont}", serif`;
    ctx.fillStyle = options.accentColor;
    ctx.globalAlpha = 0.12;
    ctx.textAlign = options.textAlign === 'center' ? 'center' : 'left';
    ctx.textBaseline = 'top';
    const qX = options.textAlign === 'center' ? width / 2 : safeMargin + 50;
    ctx.fillText('“', qX, centerY - totalContentHeight / 2 - 80);
    ctx.restore();
  }

  // 12. Render Quote Text Lines with Dual High-End Drop Shadows
  ctx.save();
  ctx.font = `${options.theme.fontWeight} ${effectiveFontSize}px "${options.fontFamily}", sans-serif`;
  ctx.fillStyle = options.textColor || '#FFFFFF';
  ctx.textAlign = options.textAlign;
  ctx.textBaseline = 'middle';

  // Multi-stop crisp drop shadow for editorial contrast
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  const quoteX = options.textAlign === 'center' ? width / 2 : safeMargin + 60;

  // Minimal Badge vertical accent line
  if (layout === 'minimal-badge') {
    ctx.save();
    ctx.strokeStyle = options.accentColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(safeMargin + 30, startY - effectiveFontSize / 2);
    ctx.lineTo(safeMargin + 30, startY + (lines.length - 1) * lineHeightPx + effectiveFontSize / 2);
    ctx.stroke();
    ctx.restore();
  }

  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeightPx;
    ctx.fillText(line, quoteX, lineY);
  });
  ctx.restore();

  // 13. Render Author Attribution (Clean, verified, and consistent)
  if (hasAuthorToRender) {
    ctx.save();
    const authorY = startY + lines.length * lineHeightPx + authorGap;
    ctx.font = `600 ${authorFontSize}px "${options.theme.secondaryFont}", sans-serif`;
    ctx.fillStyle = options.accentColor;
    ctx.textAlign = options.textAlign;
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 2;

    const authorClean = options.author.trim();
    let authorText = `— ${authorClean}`;
    if (options.theme.id === 'cyber_midnight') {
      authorText = `// SOURCE: ${authorClean.toUpperCase()}`;
    }

    ctx.fillText(authorText, quoteX, authorY);
    ctx.restore();
  }
}

export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename?: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `sparkwithin-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    return await new Promise<boolean>((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob || !navigator.clipboard) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}
