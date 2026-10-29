import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import path from 'path';

export interface RenderServerCardParams {
  quote: string;
  author: string;
  badge: string;
  backgroundImageUrl: string;
  language?: 'ta' | 'en';
}

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  try {
    const tamilPath = path.join(process.cwd(), 'public', 'NotoSansTamil-Bold.ttf');
    const englishPath = path.join(process.cwd(), 'public', 'NotoSans-Bold.ttf');
    GlobalFonts.registerFromPath(tamilPath, 'NotoSansTamil');
    GlobalFonts.registerFromPath(englishPath, 'NotoSans');
    fontsRegistered = true;
  } catch (err) {
    console.warn('Font registration warning:', err);
  }
}

/**
 * Strips emoji characters that might render as missing glyph boxes in bitmap canvas fonts
 */
function cleanTextForCanvas(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .trim();
}

/**
 * Intelligent text-wrapping for multi-line quotes
 */
function wrapQuoteText(ctx: any, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
}

/**
 * Renders a full 1080x1350 Canva/Pinterest style graphic with native HarfBuzz Tamil/English font shaping.
 * Uploads the PNG graphic and returns a direct public image URL.
 */
export async function renderAndUploadCardGraphic({
  quote,
  author,
  badge,
  backgroundImageUrl,
  language = 'en',
}: RenderServerCardParams): Promise<string> {
  registerFonts();

  const isTamil = language === 'ta' || /[\u0B80-\u0BFF]/.test(quote);
  const width = 1080;
  const height = 1350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Draw Background Image
  try {
    const bgImage = await loadImage(backgroundImageUrl);
    ctx.drawImage(bgImage, 0, 0, width, height);
  } catch (_) {
    // Elegant fallback dark gradient if remote image fails
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Dark Vignette Overlay for maximum readability
  ctx.fillStyle = 'rgba(7, 5, 12, 0.74)';
  ctx.fillRect(0, 0, width, height);

  // 3. Gold Corner Accents
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  const cornerSize = 50;
  const pad = 50;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(pad, pad + cornerSize);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + cornerSize, pad);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - pad - cornerSize, pad);
  ctx.lineTo(width - pad, pad);
  ctx.lineTo(width - pad, pad + cornerSize);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(pad, height - pad - cornerSize);
  ctx.lineTo(pad, height - pad);
  ctx.lineTo(pad + cornerSize, height - pad);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - pad - cornerSize, height - pad);
  ctx.lineTo(width - pad, height - pad);
  ctx.lineTo(width - pad, height - pad - cornerSize);
  ctx.stroke();

  // 4. Category Badge Pill at Top
  const cleanBadge = cleanTextForCanvas(badge) || (isTamil ? 'பொன்மொழி' : 'DAILY WISDOM');
  const badgeFont = isTamil ? 'bold 24px NotoSansTamil' : 'bold 22px NotoSans';
  ctx.font = badgeFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const badgeTextWidth = ctx.measureText(cleanBadge).width;
  const badgePillWidth = Math.max(badgeTextWidth + 60, 240);
  const badgeY = 150;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
  ctx.beginPath();
  ctx.roundRect((width - badgePillWidth) / 2, badgeY - 24, badgePillWidth, 48, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.fillText(cleanBadge, width / 2, badgeY);

  // 5. Quote Text Rendering with HarfBuzz Font Shaping
  const primaryFont = isTamil ? 'NotoSansTamil' : 'NotoSans';
  const fontSize = isTamil ? (quote.length > 80 ? 44 : 52) : (quote.length > 100 ? 44 : 52);
  ctx.font = `bold ${fontSize}px ${primaryFont}`;

  const wrappedLines = wrapQuoteText(ctx, quote, 900);
  const lineHeight = fontSize * 1.5;
  const totalQuoteHeight = wrappedLines.length * lineHeight;

  const quoteStartY = Math.max(480, (height - totalQuoteHeight) / 2 - 30);

  // Drop shadow for crisp white text
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';

  wrappedLines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, quoteStartY + (idx * lineHeight));
  });

  // 6. Author Attribution
  const cleanAuthor = cleanTextForCanvas(author);
  if (cleanAuthor) {
    const authorY = quoteStartY + (wrappedLines.length * lineHeight) + 65;
    ctx.font = `bold ${isTamil ? 32 : 28}px ${primaryFont}`;
    ctx.fillStyle = '#FBBF24';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 12;
    ctx.fillText(`— ${cleanAuthor}`, width / 2, authorY);
  }

  // Reset shadows
  ctx.shadowColor = 'transparent';

  // 7. Bottom Brand Watermark
  const brandText = 'Spark Within • @_sparkwithin_hub_';
  ctx.font = 'bold 20px NotoSans';
  const brandTextWidth = ctx.measureText(brandText).width;
  const brandPillWidth = brandTextWidth + 50;
  const brandY = height - 130;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
  ctx.beginPath();
  ctx.roundRect((width - brandPillWidth) / 2, brandY - 22, brandPillWidth, 44, 22);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.fillText(brandText, width / 2, brandY);

  // 8. Export to PNG Buffer & Upload
  const pngBuffer = canvas.toBuffer('image/png');
  const blob = new Blob([new Uint8Array(pngBuffer)], { type: 'image/png' });
  const formData = new FormData();
  formData.append('files[]', blob, `sparkwithin-${Date.now()}.png`);

  const uploadRes = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: formData,
  });

  const uploadData = await uploadRes.json();
  if (uploadRes.ok && uploadData?.success && uploadData?.files?.[0]?.url) {
    return uploadData.files[0].url;
  }

  throw new Error('Failed to upload rendered graphic card.');
}
