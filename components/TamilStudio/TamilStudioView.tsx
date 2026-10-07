'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  TAMIL_PRESET_QUOTES,
  TamilQuoteItem,
  markTamilQuoteAsUsed,
} from '@/lib/tamilPresets';
import { generateTamilViralCaption, TamilCaptionResult } from '@/lib/tamilCaptionGenerator';
import {
  Download,
  Dices,
  Zap,
  Copy,
  Check,
  Flame,
  FileText,
  Sparkles,
  Layers,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Sliders,
  Film,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TamilStudioViewProps {
  onSendToVideoStudio?: (quote: string, author: string) => void;
  onOpenPublishModal?: (imageUrl: string, caption: string) => void;
  initialQuote?: string;
  initialAuthor?: string;
}

export const TamilStudioView: React.FC<TamilStudioViewProps> = ({
  onSendToVideoStudio,
  onOpenPublishModal,
  initialQuote,
  initialAuthor,
}) => {
  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Active Quote & Customization
  const [activeQuoteItem, setActiveQuoteItem] = useState<TamilQuoteItem>(TAMIL_PRESET_QUOTES[0]);
  const [customQuote, setCustomQuote] = useState<string>(initialQuote || TAMIL_PRESET_QUOTES[0].quote);
  const [customAuthor, setCustomAuthor] = useState<string>(initialAuthor || TAMIL_PRESET_QUOTES[0].author);
  const [handle, setHandle] = useState<string>('@_sparkwithin_hub_');

  // Format & Aesthetics
  const [postFormat, setPostFormat] = useState<'4:5' | '1:1'>('4:5');
  const [layoutStyle, setLayoutStyle] = useState<'luxury-gold' | 'frosted-glass' | 'magazine-frame' | 'minimal-dark'>('luxury-gold');
  const [showWatermark, setShowWatermark] = useState<boolean>(true);

  // Typography & Text Alignment
  const [textAlign, setTextAlign] = useState<'center' | 'left' | 'right'>('center');
  const [fontSize, setFontSize] = useState<number>(42);
  const [fontFamily, setFontFamily] = useState<string>('Mukta Malar');
  const [lineSpacing, setLineSpacing] = useState<number>(1.55);

  // Clipboard status
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [copiedBooster, setCopiedBooster] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);

  // Sync external quote when passed from AutoPilot
  useEffect(() => {
    if (initialQuote) {
      setCustomQuote(initialQuote);
      if (initialAuthor) setCustomAuthor(initialAuthor);
    }
  }, [initialQuote, initialAuthor]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filtered quote pool
  const filteredQuotes = selectedCategory === 'all'
    ? TAMIL_PRESET_QUOTES
    : TAMIL_PRESET_QUOTES.filter((q) => q.category === selectedCategory);

  // Caption Result
  const captionData: TamilCaptionResult = generateTamilViralCaption({
    ...activeQuoteItem,
    quote: customQuote,
    author: customAuthor,
  });

  const handleSelectQuote = (item: TamilQuoteItem) => {
    setActiveQuoteItem(item);
    setCustomQuote(item.quote);
    setCustomAuthor(item.author);
    markTamilQuoteAsUsed(item.id);
  };

  const handleShuffleQuote = () => {
    const nextIndex = (quoteIndex + 1) % filteredQuotes.length;
    setQuoteIndex(nextIndex);
    handleSelectQuote(filteredQuotes[nextIndex]);
  };

  // Render Static Post Canvas (4:5 or 1:1)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 1080;
    const height = postFormat === '4:5' ? 1350 : 1080;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Base Dark Luxury Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (layoutStyle === 'luxury-gold') {
      bgGrad.addColorStop(0, '#0A0711');
      bgGrad.addColorStop(0.5, '#140D24');
      bgGrad.addColorStop(1, '#050309');
    } else if (layoutStyle === 'frosted-glass') {
      bgGrad.addColorStop(0, '#060B18');
      bgGrad.addColorStop(0.5, '#0B1528');
      bgGrad.addColorStop(1, '#04070F');
    } else if (layoutStyle === 'magazine-frame') {
      bgGrad.addColorStop(0, '#0D0D0D');
      bgGrad.addColorStop(0.5, '#171717');
      bgGrad.addColorStop(1, '#080808');
    } else {
      bgGrad.addColorStop(0, '#050505');
      bgGrad.addColorStop(1, '#000000');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Central Ambient Radial Glow
    const glow = ctx.createRadialGradient(width / 2, height / 2, 60, width / 2, height / 2, 580);
    if (layoutStyle === 'luxury-gold') {
      glow.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      glow.addColorStop(0.7, 'rgba(225, 29, 72, 0.08)');
    } else if (layoutStyle === 'frosted-glass') {
      glow.addColorStop(0, 'rgba(59, 130, 246, 0.18)');
      glow.addColorStop(0.7, 'rgba(147, 51, 234, 0.08)');
    } else {
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.10)');
      glow.addColorStop(0.7, 'rgba(255, 255, 255, 0.02)');
    }
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 3. Layout Specific Borders & Cards
    if (layoutStyle === 'luxury-gold') {
      // Classical Gold Double Frame
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      const cornerSize = 30;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      // Top Left
      ctx.beginPath(); ctx.moveTo(50, 50 + cornerSize); ctx.lineTo(50, 50); ctx.lineTo(50 + cornerSize, 50); ctx.stroke();
      // Top Right
      ctx.beginPath(); ctx.moveTo(width - 50 - cornerSize, 50); ctx.lineTo(width - 50, 50); ctx.lineTo(width - 50, 50 + cornerSize); ctx.stroke();
      // Bottom Left
      ctx.beginPath(); ctx.moveTo(50, height - 50 - cornerSize); ctx.lineTo(50, height - 50); ctx.lineTo(50 + cornerSize, height - 50); ctx.stroke();
      // Bottom Right
      ctx.beginPath(); ctx.moveTo(width - 50 - cornerSize, height - 50); ctx.lineTo(width - 50, height - 50); ctx.lineTo(width - 50, height - 50 - cornerSize); ctx.stroke();
    } else if (layoutStyle === 'frosted-glass') {
      // Frosted Glass Center Card
      const cardMargin = 80;
      const cardW = width - cardMargin * 2;
      const cardH = height - cardMargin * 2;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardMargin, cardMargin, cardW, cardH, 32);
      ctx.fill();
      ctx.stroke();
    } else if (layoutStyle === 'magazine-frame') {
      // Editorial Magazine Dual Hairline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(45, 45, width - 90, height - 90);
      ctx.strokeRect(55, 55, width - 110, height - 110);
    }

    // 4. Top Category Tag
    ctx.fillStyle = layoutStyle === 'luxury-gold' ? '#FBBF24' : '#E2E8F0';
    ctx.font = 'bold 22px "Noto Sans Tamil", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(activeQuoteItem.categoryTamil, width / 2, 135);

    // 5. Decorative Quote Mark
    ctx.fillStyle = layoutStyle === 'luxury-gold' ? 'rgba(251, 191, 36, 0.22)' : 'rgba(255, 255, 255, 0.15)';
    ctx.font = 'italic 110px "Cinzel", serif';
    ctx.fillText('“', width / 2, 230);

    // 6. Robust Tamil Line Wrapping, Alignment & Sizing Engine
    const maxContentWidth = layoutStyle === 'frosted-glass' ? width - 280 : width - 220;

    // Split on actual line breaks \r\n, \n, or escaped \n
    const rawParagraphs = customQuote.split(/\r?\n|\\n/);

    // Dynamic text measuring and wrapping function
    function computeWrappedLines(sz: number): string[] {
      if (!ctx) return [];
      ctx.font = `bold ${sz}px "${fontFamily}", "Mukta Malar", "Noto Sans Tamil", sans-serif`;
      const result: string[] = [];

      for (const para of rawParagraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;

        const words = trimmed.split(/\s+/);
        let curLine = '';

        for (let i = 0; i < words.length; i++) {
          const testLine = curLine ? `${curLine} ${words[i]}` : words[i];
          const testW = ctx.measureText(testLine).width;
          if (testW > maxContentWidth && curLine) {
            result.push(curLine);
            curLine = words[i];
          } else {
            curLine = testLine;
          }
        }
        if (curLine) result.push(curLine);
      }
      return result;
    }

    // Auto-fit check: if lines don't fit or too many, decrease font size gracefully
    let effectiveFontSize = fontSize;
    let wrappedLines = computeWrappedLines(effectiveFontSize);
    const maxAllowedLines = postFormat === '4:5' ? 10 : 7;

    while (ctx && (wrappedLines.length > maxAllowedLines || wrappedLines.some(l => ctx.measureText(l).width > maxContentWidth)) && effectiveFontSize > 26) {
      effectiveFontSize -= 2;
      wrappedLines = computeWrappedLines(effectiveFontSize);
    }

    const lineHeight = Math.round(effectiveFontSize * lineSpacing);
    const quoteBlockHeight = wrappedLines.length * lineHeight;
    const authorGap = 46;
    const authorFontSize = Math.max(22, Math.min(30, Math.round(effectiveFontSize * 0.65)));
    const totalBlockHeight = quoteBlockHeight + authorGap + authorFontSize;

    // Center vertically within available space
    const startY = Math.max(235, (height - totalBlockHeight) / 2 + (postFormat === '4:5' ? 15 : 0));

    // Render each wrapped line according to textAlign
    ctx.font = `bold ${effectiveFontSize}px "${fontFamily}", "Mukta Malar", "Noto Sans Tamil", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.92)';
    ctx.shadowBlur = 18;
    ctx.textBaseline = 'middle';

    let textX = width / 2;
    if (textAlign === 'center') {
      ctx.textAlign = 'center';
      textX = width / 2;
    } else if (textAlign === 'left') {
      ctx.textAlign = 'left';
      textX = (width - maxContentWidth) / 2 + (layoutStyle === 'frosted-glass' ? 36 : 20);
    } else if (textAlign === 'right') {
      ctx.textAlign = 'right';
      textX = width - ((width - maxContentWidth) / 2 + (layoutStyle === 'frosted-glass' ? 36 : 20));
    }

    wrappedLines.forEach((line, idx) => {
      const lineY = startY + (idx * lineHeight) + (lineHeight / 2);
      ctx.fillText(line, textX, lineY);
    });

    ctx.shadowBlur = 0;

    // 7. Author Line
    ctx.fillStyle = layoutStyle === 'luxury-gold' ? '#F59E0B' : '#94A3B8';
    ctx.font = `600 ${authorFontSize}px "${fontFamily}", "Noto Sans Tamil", sans-serif`;
    ctx.textAlign = textAlign;
    const authorY = startY + (wrappedLines.length * lineHeight) + authorGap;
    ctx.fillText(`— ${customAuthor}`, textX, authorY);

    // 8. Watermark
    if (showWatermark) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '4px';
      ctx.textAlign = 'center';
      ctx.fillText(`◆ ${handle}`, width / 2, height - 90);
    }
  }, [postFormat, layoutStyle, customQuote, customAuthor, activeQuoteItem, handle, showWatermark, textAlign, fontSize, fontFamily, lineSpacing]);

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparkwithin-tamil-${postFormat.replace(':', 'x')}.png`;
    a.click();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#F43F5E', '#10B981'],
    });
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#F59E0B', '#10B981'],
        });
      }
    } catch (e) {
      console.error('Copy image error:', e);
    }
  };

  const handlePostToInstagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    if (onOpenPublishModal) {
      onOpenPublishModal(url, captionData.fullCaption);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-purple-600/20 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              தமிழ் ஸ்டுடியோ (Tamil Quotes Hub)
            </span>
            <span className="text-xs text-white/50">• Canva & Pinterest Dark Luxury Aesthetics</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
              40+ Curated Quotes + 52 Tags
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">தமிழ் மோட்டிவேஷன் போஸ்ட் ஸ்டுடியோ</h2>
          <p className="text-xs text-white/60 mt-1 max-w-xl">
            திருக்குறள், பாரதியார், அப்துல் கலாம் மற்றும் மாஸ் சினிமா வரிகளுடன் பிரமிக்க வைக்கும் உயர்தர இன்ஸ்டாகிராம் போஸ்ட்களை (4:5 Portrait / 1:1 Square) நொடியில் உருவாக்குங்கள்.
          </p>
        </div>

        {/* Action Buttons: Instagram, Video Reel & PNG Download */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {onOpenPublishModal && (
            <button
              onClick={handlePostToInstagram}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
              title="Publish directly to Instagram via Meta Graph API"
            >
              <Send className="w-4 h-4 text-rose-400" />
              <span>🚀 Post to Instagram</span>
            </button>
          )}

          {onSendToVideoStudio && (
            <button
              onClick={() => onSendToVideoStudio(customQuote, customAuthor)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
              title="Convert this Tamil quote into an animated 9:16 Video Reel"
            >
              <Film className="w-4 h-4 text-rose-400" />
              <span>🎥 Create Video Reel</span>
            </button>
          )}

          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-xl shadow-amber-500/20 cursor-pointer shrink-0 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download 1080p PNG</span>
          </button>
        </div>
      </div>

      {/* Quote Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: '🌟 அனைத்தும் (All 40+)' },
          { id: 'thirukkural', label: '📜 திருக்குறள்' },
          { id: 'bharathiyar', label: '🔥 பாரதியார்' },
          { id: 'kalam', label: '🚀 அப்துல் கலாம்' },
          { id: 'vivekananda', label: '🧘 விவேகானந்தர்' },
          { id: 'wisdom', label: '💎 வாழ்வியல் தத்துவம்' },
          { id: 'cinema', label: '🎬 மாஸ் சினிமா வரிகள்' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              const pool = cat.id === 'all'
                ? TAMIL_PRESET_QUOTES
                : TAMIL_PRESET_QUOTES.filter((q) => q.category === cat.id);
              if (pool.length > 0) {
                handleSelectQuote(pool[0]);
              }
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left (Canvas) + Right (Controls & 52 Hashtags) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Live Canvas Preview */}
        <div className="lg:w-[48%] w-full flex flex-col items-center">
          <div className="sticky top-20 w-full max-w-[430px] flex flex-col items-center gap-4">
            <div className="w-full rounded-3xl overflow-hidden bg-black border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10">
              <canvas ref={canvasRef} className="w-full h-auto object-contain select-none" />
            </div>

            {/* Format & Download Controls */}
            <div className="w-full p-4 rounded-2xl bg-studio-900 border border-white/10 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPostFormat('4:5')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    postFormat === '4:5'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  4:5 போர்ட்ரெய்ட் (Feed)
                </button>
                <button
                  onClick={() => setPostFormat('1:1')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    postFormat === '1:1'
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  1:1 சதுரம் (Square)
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={handleCopyImage}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold cursor-pointer transition-all"
                  title="Copy post image to clipboard"
                >
                  {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedImage ? 'Copied!' : 'Copy'}</span>
                </button>

                {onOpenPublishModal && (
                  <button
                    onClick={handlePostToInstagram}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold shadow-sm cursor-pointer transition-all"
                    title="Publish directly to Instagram"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                )}

                {onSendToVideoStudio && (
                  <button
                    onClick={() => onSendToVideoStudio(customQuote, customAuthor)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-bold shadow-md cursor-pointer transition-all"
                    title="Convert this quote into an animated 9:16 Video Reel"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Reel</span>
                  </button>
                )}

                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Customization & 52 Hashtags */}
        <div className="lg:w-[52%] w-full space-y-5">
          {/* Quote & Author Editor */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">போஸ்ட் வாசகம் & ஆசிரியர்</h3>
              </div>
              <button
                onClick={handleShuffleQuote}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>அடுத்த வரி (Shuffle 40+)</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed font-sans"
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={customAuthor}
                onChange={(e) => setCustomAuthor(e.target.value)}
                placeholder="ஆசிரியர் பெயர் (எ.கா. திருவள்ளுவர், பாரதியார்)"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Alignment, Font Size & Typography Studio Controls */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">எழுத்து சீரமைப்பு & வடிவமைப்பு (Alignment & Fonts)</h3>
              </div>
              <button
                onClick={() => { setTextAlign('center'); setFontSize(42); setFontFamily('Mukta Malar'); setLineSpacing(1.55); }}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                இயல்புநிலை (Reset)
              </button>
            </div>

            {/* 1. Alignment Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-white/70 font-semibold">உரை சீரமைப்பு (Text Alignment)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTextAlign('left')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    textAlign === 'left'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06]'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>இடது (Left)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('center')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    textAlign === 'center'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06]'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                  <span>மையம் (Center)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('right')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    textAlign === 'right'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06]'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>வலது (Right)</span>
                </button>
              </div>
            </div>

            {/* 2. Font Size Slider & Quick Step Buttons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/70 font-semibold">எழுத்து அளவு (Font Size)</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {fontSize}px
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFontSize(Math.max(28, fontSize - 2))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-xs font-bold border border-white/10 cursor-pointer"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="28"
                  max="56"
                  step="2"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1 accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setFontSize(Math.min(56, fontSize + 2))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-xs font-bold border border-white/10 cursor-pointer"
                >
                  A+
                </button>
              </div>
            </div>

            {/* 3. Tamil Font Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-white/70 font-semibold">தமிழ் எழுத்துரு ஸ்டைல் (Tamil Fonts)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Mukta Malar', name: '👑 முக்தா மலர் (Mukta Malar)', note: 'ராயல் செரிஃப்' },
                  { id: 'Noto Sans Tamil', name: '💎 நோட்டோ சான்ஸ் (Noto Sans)', note: 'நவீன ஸ்டைல்' },
                  { id: 'Hind Madurai', name: '🔥 ஹிந்த் மதுரை (Hind Madurai)', note: 'மாஸ் தடிமன்' },
                  { id: 'Catamaran', name: '⚡ கடமரான் (Catamaran)', note: 'கெத்தாக எடிட்டோரியல்' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontFamily(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col ${
                      fontFamily === f.id
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="text-xs font-bold text-white">{f.name}</span>
                    <span className="text-[10px] text-white/40">{f.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canva & Pinterest Layout Style Switcher */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">வடிவமைப்பு ஸ்டைல் (Canva Layouts)</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'luxury-gold', name: '👑 Dark Gold Luxury', desc: 'தங்க நிற மூலை அலங்காரமும் செழுமையான பின்னணியும்' },
                { id: 'frosted-glass', name: '🧊 Frosted Glass Card', desc: 'மங்கலான கண்ணாடி அட்டை வடிவமைப்பு' },
                { id: 'magazine-frame', name: '📰 Editorial Magazine', desc: 'இரட்டை மெல்லிய கோட்டுடன் நேர்த்தியான வடிவம்' },
                { id: 'minimal-dark', name: '🖤 Obsidian Minimalist', desc: 'தூய கருமை மற்றும் எளிமையான தோற்றம்' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setLayoutStyle(style.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                    layoutStyle === style.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/10'
                      : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-xs font-bold text-white">{style.name}</span>
                  <span className="text-[10px] text-white/40 leading-snug">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Watermark & Signature */}
          <div className="p-5 rounded-2xl bg-studio-900 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider">இன்ஸ்டாகிராம் கைப்பிடி (Watermark)</label>
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                {showWatermark ? 'மறைக்க (Hide)' : 'காண்பிக்க (Show)'}
              </button>
            </div>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@_sparkwithin_hub_"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 52 Tamil Viral Hashtags & Caption Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-rose-500/5 border border-amber-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  52 தமிழ் வைரல் ஹேஷ்டேக்குகள் & விளக்கம்
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                🔥 52 Total Tags
              </span>
            </div>

            {/* Main Caption Box (30 Tags) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>முதன்மை கேப்ஷன் (Main Caption — 30 Tags)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(captionData.fullCaption);
                    setCopiedCaption(true);
                    setTimeout(() => setCopiedCaption(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                >
                  {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCaption ? 'நகலெடுக்கப்பட்டது!' : 'முழு கேப்ஷனை நகலெடு'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white/75 max-h-[150px] overflow-y-auto whitespace-pre-line leading-relaxed font-sans">
                {captionData.fullCaption}
              </div>
            </div>

            {/* First Comment Booster (22 Tags) */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>முதல் பின்னூட்ட பூஸ்டர் (First Comment Booster — 22 Tags)</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(captionData.firstComment);
                    setCopiedBooster(true);
                    setTimeout(() => setCopiedBooster(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                >
                  {copiedBooster ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBooster ? 'நகலெடுக்கப்பட்டது!' : 'பூஸ்டர் நகலெடு'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white/60 max-h-[85px] overflow-y-auto whitespace-pre-line">
                {captionData.firstComment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
