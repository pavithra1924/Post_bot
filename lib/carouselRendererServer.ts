import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import { Thirukkural1330Item } from './thirukkural1330';

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

function cleanTextForCanvas(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '')
    .trim();
}

function wrapText(ctx: any, text: string, maxWidth: number): string[] {
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

async function uploadCanvasToHost(canvas: any): Promise<string> {
  const pngBuffer = canvas.toBuffer('image/png');
  const blob = new Blob([new Uint8Array(pngBuffer)], { type: 'image/png' });
  const formData = new FormData();
  formData.append('files[]', blob, `kural-slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.png`);

  const res = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (res.ok && data?.success && data?.files?.[0]?.url) {
    return data.files[0].url;
  }

  throw new Error('Failed to upload carousel slide image to host.');
}

/**
 * Renders base card canvas with luxury gold borders, slide indicator and watermark
 */
function createBaseSlideCanvas(slideNumber: number): { canvas: any; ctx: any; width: number; height: number } {
  registerFonts();
  const width = 1080;
  const height = 1350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Dark Luxury Gradient Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#090D16');
  grad.addColorStop(0.5, '#0F172A');
  grad.addColorStop(1, '#050811');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle radial glow in center
  const radial = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 600);
  radial.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // Gold Outer Border
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Gold Corner Accents
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  const cSize = 45;
  const pad = 40;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(pad, pad + cSize);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + cSize, pad);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(width - pad - cSize, pad);
  ctx.lineTo(width - pad, pad);
  ctx.lineTo(width - pad, pad + cSize);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(pad, height - pad - cSize);
  ctx.lineTo(pad, height - pad);
  ctx.lineTo(pad + cSize, height - pad);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(width - pad - cSize, height - pad);
  ctx.lineTo(width - pad, height - pad);
  ctx.lineTo(width - pad, height - pad - cSize);
  ctx.stroke();

  // Slide Counter (Top Right)
  const slideText = `${slideNumber} / 5`;
  ctx.font = 'bold 22px NotoSans';
  ctx.fillStyle = '#FBBF24';
  ctx.textAlign = 'right';
  ctx.fillText(slideText, width - 80, 115);

  // Bottom Brand Watermark
  const brandText = 'Spark Within • @_sparkwithin_hub_';
  ctx.font = 'bold 20px NotoSans';
  ctx.textAlign = 'center';
  const brandWidth = ctx.measureText(brandText).width + 50;
  const brandY = height - 90;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect((width - brandWidth) / 2, brandY - 22, brandWidth, 44, 22);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#F8FAFC';
  ctx.fillText(brandText, width / 2, brandY + 2);

  return { canvas, ctx, width, height };
}

/**
 * Slide 1: Cover Slide with Kural Couplet
 */
function renderSlide1(kural: Thirukkural1330Item): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(1);

  // Header Badge Pill
  const badgeText = `குறள் #${kural.number} • ${kural.chapter}`;
  ctx.font = 'bold 24px NotoSansTamil';
  ctx.textAlign = 'center';
  const badgeW = ctx.measureText(badgeText).width + 60;
  const badgeY = 160;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
  ctx.beginPath();
  ctx.roundRect((width - badgeW) / 2, badgeY - 24, badgeW, 48, 24);
  ctx.fill();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.fillText(badgeText, width / 2, badgeY);

  // Main Kural Verse
  ctx.font = 'bold 50px NotoSansTamil';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 20;

  const lines = wrapText(ctx, kural.verse, 880);
  const lineHeight = 80;
  const startY = 520 - ((lines.length - 2) * 35);

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startY + (idx * lineHeight));
  });

  // Author Attribution
  ctx.shadowColor = 'transparent';
  ctx.font = 'bold 34px NotoSansTamil';
  ctx.fillStyle = '#F59E0B';
  ctx.fillText('— திருவள்ளுவர்', width / 2, startY + (lines.length * lineHeight) + 65);

  // Swipe prompt
  ctx.font = 'bold 22px NotoSansTamil';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('விளக்கத்திற்கு அடுத்த பக்கம் செல்லவும் ➔', width / 2, height - 160);

  return canvas;
}

/**
 * Slide 2: Simple Meaning (எளிய தமிழ் விளக்கம்)
 */
function renderSlide2(kural: Thirukkural1330Item): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(2);

  // Header Pill
  const badgeText = 'எளிய தமிழ் விளக்கம்';
  ctx.font = 'bold 24px NotoSansTamil';
  ctx.textAlign = 'center';
  const badgeW = 320;
  const badgeY = 160;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
  ctx.beginPath();
  ctx.roundRect((width - badgeW) / 2, badgeY - 24, badgeW, 48, 24);
  ctx.fill();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.fillText(badgeText, width / 2, badgeY);

  // Section Subheading
  ctx.font = 'bold 38px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.fillText(`குறள் #${kural.number} என்ன கூறுகிறது?`, width / 2, 280);

  // Decorative divider
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, 320);
  ctx.lineTo(width / 2 + 120, 320);
  ctx.stroke();

  // Body Content Card
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(100, 380, width - 200, 600, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Explanation Text
  ctx.font = 'bold 36px NotoSansTamil';
  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'center';
  const lines = wrapText(ctx, kural.simpleExplanation, 780);
  const lineHeight = 64;
  const startY = 460 + Math.max(0, (500 - (lines.length * lineHeight)) / 2);

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startY + (idx * lineHeight));
  });

  // Swipe prompt
  ctx.font = 'bold 22px NotoSansTamil';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('ஆழமான தத்துவத்திற்கு செல்லவும் ➔', width / 2, height - 160);

  return canvas;
}

/**
 * Slide 3: Deep Meaning (ஆழமான வாழ்வியல் தத்துவம்)
 */
function renderSlide3(kural: Thirukkural1330Item): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(3);

  // Header Pill
  const badgeText = 'ஆழமான வாழ்வியல் தத்துவம்';
  ctx.font = 'bold 24px NotoSansTamil';
  ctx.textAlign = 'center';
  const badgeW = 380;
  const badgeY = 160;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
  ctx.beginPath();
  ctx.roundRect((width - badgeW) / 2, badgeY - 24, badgeW, 48, 24);
  ctx.fill();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.fillText(badgeText, width / 2, badgeY);

  // Section Subheading
  ctx.font = 'bold 38px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.fillText('இதன் உள்ளார்ந்த நோக்கம்', width / 2, 280);

  // Divider
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, 320);
  ctx.lineTo(width / 2 + 120, 320);
  ctx.stroke();

  // Card
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(100, 380, width - 200, 600, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Deep Meaning Text
  ctx.font = 'bold 36px NotoSansTamil';
  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'center';
  const lines = wrapText(ctx, kural.deepMeaning, 780);
  const lineHeight = 64;
  const startY = 460 + Math.max(0, (500 - (lines.length * lineHeight)) / 2);

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startY + (idx * lineHeight));
  });

  // Swipe prompt
  ctx.font = 'bold 22px NotoSansTamil';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('நடைமுறை உதாரணத்திற்கு செல்லவும் ➔', width / 2, height - 160);

  return canvas;
}

/**
 * Slide 4: Real-Life Example (வாழ்க்கையில் ஓர் உதாரணம்)
 */
function renderSlide4(kural: Thirukkural1330Item): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(4);

  // Header Pill
  const badgeText = 'வாழ்க்கையில் ஓர் உதாரணம்';
  ctx.font = 'bold 24px NotoSansTamil';
  ctx.textAlign = 'center';
  const badgeW = 380;
  const badgeY = 160;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
  ctx.beginPath();
  ctx.roundRect((width - badgeW) / 2, badgeY - 24, badgeW, 48, 24);
  ctx.fill();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.fillText(badgeText, width / 2, badgeY);

  // Section Subheading
  ctx.font = 'bold 38px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.fillText('இன்றைய வாழ்வில் எப்படி?', width / 2, 280);

  // Divider
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, 320);
  ctx.lineTo(width / 2 + 120, 320);
  ctx.stroke();

  // Card
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(100, 380, width - 200, 600, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Life Example Text
  ctx.font = 'bold 34px NotoSansTamil';
  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'center';
  const lines = wrapText(ctx, kural.lifeExample, 780);
  const lineHeight = 62;
  const startY = 460 + Math.max(0, (500 - (lines.length * lineHeight)) / 2);

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startY + (idx * lineHeight));
  });

  // Swipe prompt
  ctx.font = 'bold 22px NotoSansTamil';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('இன்றைய சிந்தனை & முடிவுக்கு செல்லவும் ➔', width / 2, height - 160);

  return canvas;
}

/**
 * Slide 5: Daily Action Thought & Follow CTA
 */
function renderSlide5(kural: Thirukkural1330Item): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(5);

  // Header Pill
  const badgeText = 'இன்றைய சிந்தனை';
  ctx.font = 'bold 24px NotoSansTamil';
  ctx.textAlign = 'center';
  const badgeW = 280;
  const badgeY = 160;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
  ctx.beginPath();
  ctx.roundRect((width - badgeW) / 2, badgeY - 24, badgeW, 48, 24);
  ctx.fill();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.fillText(badgeText, width / 2, badgeY);

  // Daily Thought Card
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(100, 260, width - 200, 360, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 34px NotoSansTamil';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  const thoughtLines = wrapText(ctx, cleanTextForCanvas(kural.dailyThought), 780);
  const lineHeight = 56;
  const startY = 320 + Math.max(0, (260 - (thoughtLines.length * lineHeight)) / 2);

  thoughtLines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, startY + (idx * lineHeight));
  });

  // Call to Action Box
  const ctaBoxY = 680;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
  ctx.beginPath();
  ctx.roundRect(100, ctaBoxY, width - 200, 380, 28);
  ctx.fill();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 34px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.fillText('பயனுள்ளதாக இருந்ததா?', width / 2, ctaBoxY + 80);

  ctx.font = 'bold 26px NotoSansTamil';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText('இந்த பதிவை உங்கள் நண்பர்களுடன் பகிருங்கள் (Share)', width / 2, ctaBoxY + 140);
  ctx.fillText('மற்றும் எதிர்கால சிந்தனைக்கு சேமித்து வைக்கவும் (Save)', width / 2, ctaBoxY + 185);

  // Follow Button
  ctx.fillStyle = 'linear-gradient(to right, #F59E0B, #E11D48)';
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 240, ctaBoxY + 240, 480, 68, 34);
  ctx.fill();

  ctx.font = 'bold 26px NotoSansTamil';
  ctx.fillStyle = '#090D16';
  ctx.fillText('பின்தொடருங்கள்: @_sparkwithin_hub_', width / 2, ctaBoxY + 283);

  return canvas;
}

/**
 * Renders all 5 slides of a Thirukkural, uploads them to public hosting, and returns 5 direct image URLs.
 */
export async function renderThirukkuralCarouselSlides(kural: Thirukkural1330Item): Promise<string[]> {
  console.log(`Rendering 5-Slide Carousel for Thirukkural #${kural.number} (${kural.chapter})...`);

  const s1 = renderSlide1(kural);
  const s2 = renderSlide2(kural);
  const s3 = renderSlide3(kural);
  const s4 = renderSlide4(kural);
  const s5 = renderSlide5(kural);

  console.log('Uploading 5 slides to public image CDN...');
  const [url1, url2, url3, url4, url5] = await Promise.all([
    uploadCanvasToHost(s1),
    uploadCanvasToHost(s2),
    uploadCanvasToHost(s3),
    uploadCanvasToHost(s4),
    uploadCanvasToHost(s5),
  ]);

  console.log('Successfully uploaded all 5 slides:');
  console.log('Slide 1:', url1);
  console.log('Slide 2:', url2);
  console.log('Slide 3:', url3);
  console.log('Slide 4:', url4);
  console.log('Slide 5:', url5);

  return [url1, url2, url3, url4, url5];
}
