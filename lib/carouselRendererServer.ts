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
 * Creates the base luxury canvas with pixel-perfect alignment:
 * - Centered top category pill badge
 * - Top-right slide counter pill
 * - Gold framing & corner brackets
 * - Bottom watermark
 */
function createBaseSlideCanvas(slideNumber: number, categoryBadge: string): { canvas: any; ctx: any; width: number; height: number } {
  registerFonts();
  const width = 1080;
  const height = 1350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Dark Luxury Gradient Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#070A12');
  grad.addColorStop(0.5, '#0E1726');
  grad.addColorStop(1, '#04060C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle radial glow in upper center
  const radial = ctx.createRadialGradient(width / 2, 400, 60, width / 2, 400, 550);
  radial.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // 2. Gold Outer Border Frame
  const pad = 42;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.32)';
  ctx.lineWidth = 2;
  ctx.strokeRect(pad, pad, width - (pad * 2), height - (pad * 2));

  // Gold Corner Accents
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  const cSize = 40;

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

  // 3. Top Header Row: Category Badge (Centered)
  ctx.font = 'bold 24px NotoSansTamil';
  const badgeText = categoryBadge;
  const badgeTextW = ctx.measureText(badgeText).width;
  const badgeW = Math.max(badgeTextW + 56, 260);
  const badgeH = 50;
  const badgeY = 115;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
  ctx.beginPath();
  ctx.roundRect((width - badgeW) / 2, badgeY - (badgeH / 2), badgeW, badgeH, badgeH / 2);
  ctx.fill();

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, width / 2, badgeY);

  // 4. Slide Counter Pill (Top-Right)
  const slideText = `${slideNumber} / 5`;
  ctx.font = 'bold 20px NotoSans';
  const slidePillW = 86;
  const slidePillH = 42;
  const slidePillX = width - pad - 20 - slidePillW;
  const slidePillY = 115;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(slidePillX, slidePillY - (slidePillH / 2), slidePillW, slidePillH, slidePillH / 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#FBBF24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(slideText, slidePillX + (slidePillW / 2), slidePillY);

  // 5. Bottom Brand Watermark
  const brandText = 'Spark Within • @_sparkwithin_hub_';
  ctx.font = 'bold 20px NotoSans';
  const brandTextW = ctx.measureText(brandText).width;
  const brandW = brandTextW + 48;
  const brandH = 42;
  const brandY = height - pad - 28;

  ctx.fillStyle = 'rgba(11, 17, 33, 0.9)';
  ctx.beginPath();
  ctx.roundRect((width - brandW) / 2, brandY - (brandH / 2), brandW, brandH, brandH / 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(brandText, width / 2, brandY);

  return { canvas, ctx, width, height };
}

/**
 * Slide 1: Cover Slide with Kural Couplet
 */
function renderSlide1(kural: Thirukkural1330Item): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(1, 'திருக்குறள் கருவூலம்');

  // Chapter & Kural Number Subheading
  ctx.font = 'bold 32px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const subheadY = 250;
  ctx.fillText(`அதிகாரம்: ${kural.chapter} • குறள் #${kural.number}`, width / 2, subheadY);

  // Decorative Golden Divider Line
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 130, subheadY + 36);
  ctx.lineTo(width / 2 + 130, subheadY + 36);
  ctx.stroke();

  // Central Card Framing the Couplet (Y: 340 to 860)
  const cardX = 80;
  const cardY = 340;
  const cardW = width - (cardX * 2);
  const cardH = 530;
  const cardRadius = 28;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.32)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw Corner Accents on Card
  const innerCorner = 24;
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(cardX + 16, cardY + 16 + innerCorner);
  ctx.lineTo(cardX + 16, cardY + 16);
  ctx.lineTo(cardX + 16 + innerCorner, cardY + 16);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cardX + cardW - 16 - innerCorner, cardY + 16);
  ctx.lineTo(cardX + cardW - 16, cardY + 16);
  ctx.lineTo(cardX + cardW - 16, cardY + 16 + innerCorner);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cardX + 16, cardY + cardH - 16 - innerCorner);
  ctx.lineTo(cardX + 16, cardY + cardH - 16);
  ctx.lineTo(cardX + 16 + innerCorner, cardY + cardH - 16);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cardX + cardW - 16 - innerCorner, cardY + cardH - 16);
  ctx.lineTo(cardX + cardW - 16, cardY + cardH - 16);
  ctx.lineTo(cardX + cardW - 16, cardY + cardH - 16 - innerCorner);
  ctx.stroke();

  // Main Kural Verse (Centered inside card)
  ctx.font = 'bold 50px NotoSansTamil';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 18;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText(ctx, kural.verse, 800);
  const lineHeight = 88;
  const totalH = lines.length * lineHeight;
  const verseStartY = cardY + ((cardH - totalH) / 2) + (lineHeight / 2);

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, verseStartY + (idx * lineHeight));
  });

  ctx.shadowColor = 'transparent';

  // Author Attribution
  const authorY = cardY + cardH + 75;
  ctx.font = 'bold 36px NotoSansTamil';
  ctx.fillStyle = '#F59E0B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('— ஆசிரியர்: திருவள்ளுவர்', width / 2, authorY);

  // Swipe Navigation Prompt (clean text with >> to avoid missing glyphs)
  const swipeY = height - 150;
  ctx.font = 'bold 22px NotoSansTamil';
  ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('விளக்கத்திற்கு அடுத்த பக்கம் செல்லவும் »', width / 2, swipeY);

  return canvas;
}

/**
 * Standard Content Slide Renderer (Used for Slides 2, 3, 4)
 * Combines Card, Title, Divider, and Vertically Centered Body Text
 */
function renderContentSlide({
  slideNumber,
  categoryBadge,
  title,
  content,
  swipePrompt,
}: {
  slideNumber: number;
  categoryBadge: string;
  title: string;
  content: string;
  swipePrompt: string;
}): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(slideNumber, categoryBadge);

  // Big Elegant Card
  const cardX = 80;
  const cardY = 210;
  const cardW = width - (cardX * 2);
  const cardH = 880;
  const cardRadius = 28;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Card Top Title (Inside the Card)
  const titleY = cardY + 75;
  ctx.font = 'bold 38px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, width / 2, titleY);

  // Decorative Divider Line
  const lineY = cardY + 128;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 130, lineY);
  ctx.lineTo(width / 2 + 130, lineY);
  ctx.stroke();

  // Body Content Text (Vertically Centered in remaining card space)
  const availableTop = lineY + 30;
  const availableBottom = cardY + cardH - 80;
  const availableHeight = availableBottom - availableTop;

  const fontSize = content.length > 220 ? 32 : 36;
  const lineHeight = Math.round(fontSize * 1.7);
  ctx.font = `bold ${fontSize}px NotoSansTamil`;
  ctx.fillStyle = '#F8FAFC';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText(ctx, cleanTextForCanvas(content), 780);
  const textTotalHeight = lines.length * lineHeight;
  const textStartY = availableTop + Math.max(0, (availableHeight - textTotalHeight) / 2) + (lineHeight / 2);

  lines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, textStartY + (idx * lineHeight));
  });

  // Swipe Navigation Prompt at bottom of card
  const swipeY = cardY + cardH - 42;
  ctx.font = 'bold 20px NotoSansTamil';
  ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(swipePrompt, width / 2, swipeY);

  return canvas;
}

/**
 * Slide 2: Simple Meaning (எளிய தமிழ் விளக்கம்)
 */
function renderSlide2(kural: Thirukkural1330Item): any {
  return renderContentSlide({
    slideNumber: 2,
    categoryBadge: 'எளிய விளக்கம்',
    title: `குறள் #${kural.number} விளக்கம்`,
    content: kural.simpleExplanation,
    swipePrompt: 'ஆழமான தத்துவத்திற்கு செல்லவும் »',
  });
}

/**
 * Slide 3: Deep Meaning (ஆழமான வாழ்வியல் தத்துவம்)
 */
function renderSlide3(kural: Thirukkural1330Item): any {
  return renderContentSlide({
    slideNumber: 3,
    categoryBadge: 'ஆழமான தத்துவம்',
    title: 'வாழ்வியல் வழிகாட்டல்',
    content: kural.deepMeaning,
    swipePrompt: 'நடைமுறை உதாரணத்திற்கு செல்லவும் »',
  });
}

/**
 * Slide 4: Real-Life Example (வாழ்க்கையில் ஓர் உதாரணம்)
 */
function renderSlide4(kural: Thirukkural1330Item): any {
  return renderContentSlide({
    slideNumber: 4,
    categoryBadge: 'நடைமுறை உதாரணம்',
    title: 'இன்றைய வாழ்வில் எப்படி?',
    content: kural.lifeExample,
    swipePrompt: 'இன்றைய சிந்தனைக்கு செல்லவும் »',
  });
}

/**
 * Slide 5: Daily Action Thought & Follow Community CTA
 */
function renderSlide5(kural: Thirukkural1330Item): any {
  const { canvas, ctx, width, height } = createBaseSlideCanvas(5, 'இன்றைய சிந்தனை');

  // Clean daily thought so duplicate handle / hashtags are not included in thought card
  const pureThought = kural.dailyThought
    .replace(/தினசரி\s*வாழ்வியல்.*$/s, '')
    .replace(/பின்தொடரவும்.*$/s, '')
    .trim();

  // 1. Upper Card: Inspirational Takeaway Card (Y: 210 to 600)
  const card1X = 80;
  const card1Y = 210;
  const card1W = width - (card1X * 2);
  const card1H = 390;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.beginPath();
  ctx.roundRect(card1X, card1Y, card1W, card1H, 26);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Upper Card Header
  const title1Y = card1Y + 58;
  ctx.font = 'bold 36px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('நாளைய வெற்றிக்கு ஒரு பாடம்', width / 2, title1Y);

  // Upper Card Divider
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, title1Y + 40);
  ctx.lineTo(width / 2 + 120, title1Y + 40);
  ctx.stroke();

  // Thought Text (Centered in Card 1)
  ctx.font = 'bold 34px NotoSansTamil';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const thoughtLines = wrapText(ctx, cleanTextForCanvas(pureThought), 760);
  const tLineHeight = 58;
  const tTotalH = thoughtLines.length * tLineHeight;
  const thoughtStartY = (title1Y + 55) + Math.max(0, (card1H - 120 - tTotalH) / 2) + (tLineHeight / 2);

  thoughtLines.forEach((line, idx) => {
    ctx.fillText(line, width / 2, thoughtStartY + (idx * tLineHeight));
  });

  // 2. Lower Card: Call To Action & Community Box (Y: 640 to 1130)
  const card2X = 80;
  const card2Y = 640;
  const card2W = width - (card2X * 2);
  const card2H = 490;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.beginPath();
  ctx.roundRect(card2X, card2Y, card2W, card2H, 26);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // CTA Card Title
  const ctaTitleY = card2Y + 68;
  ctx.font = 'bold 38px NotoSansTamil';
  ctx.fillStyle = '#FBBF24';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('பயனுள்ளதாக இருந்ததா?', width / 2, ctaTitleY);

  // Action instructions
  ctx.font = 'bold 26px NotoSansTamil';
  ctx.fillStyle = '#E2E8F0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('இந்த பதிவை உங்கள் நண்பர்களுடன் பகிருங்கள் (Share)', width / 2, ctaTitleY + 65);
  ctx.fillText('எதிர்கால சிந்தனைக்கு சேமித்து வைக்கவும் (Save)', width / 2, ctaTitleY + 110);

  // Follow Button (Centered, balanced dimensions)
  const btnW = 560;
  const btnH = 74;
  const btnY = card2Y + 285;
  const btnX = (width - btnW) / 2;

  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.roundRect(btnX, btnY - (btnH / 2), btnW, btnH, btnH / 2);
  ctx.fill();

  ctx.font = 'bold 28px NotoSansTamil';
  ctx.fillStyle = '#070A12';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('பின்தொடருங்கள்: @_sparkwithin_hub_', width / 2, btnY);

  // Hint line below button
  const hintY = card2Y + 410;
  ctx.font = 'bold 22px NotoSansTamil';
  ctx.fillStyle = '#FDE68A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('தினசரி திருக்குறள் சிந்தனைகளுக்கு இணைந்திருங்கள்', width / 2, hintY);

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
