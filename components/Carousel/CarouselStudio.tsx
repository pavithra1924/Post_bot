'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  THIRUKKURAL_LIBRARY,
  ThirukkuralItem,
} from '@/lib/tamilWisdomLibrary';
import {
  Download,
  Send,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Palette,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CarouselStudioProps {
  initialKural?: ThirukkuralItem;
  onOpenPublishModal?: (imageUrl: string, caption: string) => void;
}

interface CarouselSlide {
  id: number;
  type: 'hook' | 'verse' | 'meaning' | 'cta';
  badge: string;
  title: string;
  content: string;
  author: string;
  footerText: string;
}

export const CarouselStudio: React.FC<CarouselStudioProps> = ({
  initialKural = THIRUKKURAL_LIBRARY[0],
  onOpenPublishModal,
}) => {
  const [activeKural, setActiveKural] = useState<ThirukkuralItem>(initialKural);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [themeStyle, setThemeStyle] = useState<'gold' | 'midnight' | 'emerald' | 'crimson'>('gold');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);

  // Generate 4 cohesive slides from the active Kural
  const [slides, setSlides] = useState<CarouselSlide[]>(() => [
    {
      id: 1,
      type: 'hook',
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: activeKural.hookTitle,
      content: 'திருக்குறள் காட்டும் வெற்றி மற்றும் மன அமைதிக்கான நித்திய வாழ்க்கை ரகசியம்.',
      author: 'Spark Within',
      footerText: 'தொடர்ந்து வாசிக்க ஸ்வைப் செய்யவும் 👉 (Swipe)',
    },
    {
      id: 2,
      type: 'verse',
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
      content: activeKural.verse,
      author: 'Spark Within',
      footerText: '@_sparkwithin_hub_',
    },
    {
      id: 3,
      type: 'meaning',
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: 'வாழ்வியல் எளிய உரை:',
      content: activeKural.explanation,
      author: 'Spark Within',
      footerText: '@_sparkwithin_hub_',
    },
    {
      id: 4,
      type: 'cta',
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: 'உங்கள் சிந்தனைக்கு:',
      content: 'இந்த வாழ்வியல் தத்துவம் உங்கள் இன்றைய வாழ்க்கைக்கு எவ்வாறு உதவுகிறது? உங்கள் கருத்தை கீழே பகிருங்கள் 💬',
      author: 'Spark Within',
      footerText: 'Follow @_sparkwithin_hub_ for Daily Wisdom',
    },
  ]);

  // Update slides when active Kural changes
  useEffect(() => {
    setSlides([
      {
        id: 1,
        type: 'hook',
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: activeKural.hookTitle,
        content: 'திருக்குறள் காட்டும் வெற்றி மற்றும் மன அமைதிக்கான நித்திய வாழ்க்கை ரகசியம்.',
        author: 'Spark Within',
        footerText: 'தொடர்ந்து வாசிக்க ஸ்வைப் செய்யவும் 👉 (Swipe)',
      },
      {
        id: 2,
        type: 'verse',
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
        content: activeKural.verse,
        author: 'Spark Within',
        footerText: '@_sparkwithin_hub_',
      },
      {
        id: 3,
        type: 'meaning',
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: 'வாழ்வியல் எளிய உரை:',
        content: activeKural.explanation,
        author: 'Spark Within',
        footerText: '@_sparkwithin_hub_',
      },
      {
        id: 4,
        type: 'cta',
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: 'உங்கள் சிந்தனைக்கு:',
        content: 'இந்த வாழ்வியல் தத்துவம் உங்கள் இன்றைய வாழ்க்கைக்கு எவ்வாறு உதவுகிறது? உங்கள் கருத்தை கீழே பகிருங்கள் 💬',
        author: 'Spark Within',
        footerText: 'Follow @_sparkwithin_hub_ for Daily Wisdom',
      },
    ]);
  }, [activeKural]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render a specific slide to a canvas context
  const renderSlideToContext = useCallback(
    (canvas: HTMLCanvasElement, slide: CarouselSlide, index: number, total: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1350; // 4:5 Instagram Portrait
      canvas.width = width;
      canvas.height = height;

      // 1. Background gradient based on themeStyle
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (themeStyle === 'gold') {
        bgGrad.addColorStop(0, '#1E1B18');
        bgGrad.addColorStop(0.5, '#121110');
        bgGrad.addColorStop(1, '#0A0A09');
      } else if (themeStyle === 'midnight') {
        bgGrad.addColorStop(0, '#0F172A');
        bgGrad.addColorStop(0.5, '#020617');
        bgGrad.addColorStop(1, '#000000');
      } else if (themeStyle === 'emerald') {
        bgGrad.addColorStop(0, '#064E3B');
        bgGrad.addColorStop(0.5, '#022C22');
        bgGrad.addColorStop(1, '#021812');
      } else {
        bgGrad.addColorStop(0, '#4C0519');
        bgGrad.addColorStop(0.5, '#1F040C');
        bgGrad.addColorStop(1, '#0F0206');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle luxury border
      ctx.strokeStyle = themeStyle === 'gold' ? 'rgba(217, 119, 6, 0.35)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, width - 100, height - 100);

      // Inner thin border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.strokeRect(62, 62, width - 124, height - 124);

      // 3. Top Slide Indicator: e.g. "SLIDE 1 OF 4"
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${index + 1} / ${total}`, width - 90, 115);

      // 4. Category Badge Heading: "💎 வாழ்வியல் தத்துவம்"
      ctx.textAlign = 'left';
      ctx.fillStyle = themeStyle === 'gold' ? '#F59E0B' : '#FB7185';
      ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('💎 வாழ்வியல் தத்துவம்', 90, 115);

      // Subtle horizontal divider below badge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(90, 145);
      ctx.lineTo(width - 90, 145);
      ctx.stroke();

      // 5. Main Card Content rendering by slide type
      if (slide.type === 'hook') {
        // Hook Slide
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 58px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';

        // Wrap Title Hook
        const words = slide.title.split(' ');
        let line = '';
        let y = 420;
        for (const w of words) {
          const testLine = line + w + ' ';
          if (ctx.measureText(testLine).width > width - 180 && line !== '') {
            ctx.fillText(line.trim(), 90, y);
            line = w + ' ';
            y += 85;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), 90, y);

        // Subtitle content
        y += 70;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = '500 36px "Mukta Malar", -apple-system, sans-serif';
        const subWords = slide.content.split(' ');
        let sLine = '';
        for (const sw of subWords) {
          const test = sLine + sw + ' ';
          if (ctx.measureText(test).width > width - 180 && sLine !== '') {
            ctx.fillText(sLine.trim(), 90, y);
            sLine = sw + ' ';
            y += 56;
          } else {
            sLine = test;
          }
        }
        ctx.fillText(sLine.trim(), 90, y);

        // Spark Within Brand Emblem
        y += 120;
        ctx.fillStyle = themeStyle === 'gold' ? '#F59E0B' : '#E2E8F0';
        ctx.font = 'bold 30px -apple-system, sans-serif';
        ctx.fillText('— Spark Within', 90, y);
      } else if (slide.type === 'verse') {
        // Thirukkural Verse Slide (STRICTLY LEFT ALIGNED)
        ctx.fillStyle = themeStyle === 'gold' ? '#FDE68A' : '#93C5FD';
        ctx.font = '600 30px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(slide.title, 90, 360);

        // The 2-Line Couplet
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 50px "Mukta Malar", -apple-system, sans-serif';
        const lines = slide.content.split('\n');
        let y = 490;
        for (const l of lines) {
          ctx.fillText(l.trim(), 90, y);
          y += 95;
        }

        // Author Attribution (STRICTLY Spark Within)
        y += 80;
        ctx.fillStyle = themeStyle === 'gold' ? '#F59E0B' : '#F43F5E';
        ctx.font = 'bold 34px -apple-system, sans-serif';
        ctx.fillText('— Spark Within', 90, y);
      } else if (slide.type === 'meaning') {
        // Meaning Slide
        ctx.fillStyle = themeStyle === 'gold' ? '#FDE68A' : '#A7F3D0';
        ctx.font = 'bold 36px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(slide.title, 90, 380);

        // Body Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '500 40px "Mukta Malar", -apple-system, sans-serif';
        const mWords = slide.content.split(' ');
        let mLine = '';
        let y = 480;
        for (const mw of mWords) {
          const test = mLine + mw + ' ';
          if (ctx.measureText(test).width > width - 180 && mLine !== '') {
            ctx.fillText(mLine.trim(), 90, y);
            mLine = mw + ' ';
            y += 72;
          } else {
            mLine = test;
          }
        }
        ctx.fillText(mLine.trim(), 90, y);

        // Author Attribution
        y += 90;
        ctx.fillStyle = themeStyle === 'gold' ? '#F59E0B' : '#F43F5E';
        ctx.font = 'bold 32px -apple-system, sans-serif';
        ctx.fillText('— Spark Within', 90, y);
      } else {
        // CTA / Question Slide
        ctx.fillStyle = themeStyle === 'gold' ? '#FDE68A' : '#FDA4AF';
        ctx.font = 'bold 44px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(slide.title, 90, 420);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '500 38px "Mukta Malar", -apple-system, sans-serif';
        const cWords = slide.content.split(' ');
        let cLine = '';
        let y = 520;
        for (const cw of cWords) {
          const test = cLine + cw + ' ';
          if (ctx.measureText(test).width > width - 180 && cLine !== '') {
            ctx.fillText(cLine.trim(), 90, y);
            cLine = cw + ' ';
            y += 68;
          } else {
            cLine = test;
          }
        }
        ctx.fillText(cLine.trim(), 90, y);

        // Brand Signature Box
        y += 100;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(90, y, width - 180, 110);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeRect(90, y, width - 180, 110);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px -apple-system, sans-serif';
        ctx.fillText('Spark Within • @_sparkwithin_hub_', 120, y + 68);
      }

      // 6. Footer Swipe Callout
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '600 24px -apple-system, sans-serif';
      ctx.fillText(slide.footerText, width / 2, height - 90);

      // Slide Progress Dots
      const dotCount = total;
      const dotRadius = 6;
      const dotSpacing = 24;
      const totalDotWidth = (dotCount - 1) * dotSpacing;
      const startX = width / 2 - totalDotWidth / 2;

      for (let i = 0; i < dotCount; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * dotSpacing, height - 130, dotRadius, 0, Math.PI * 2);
        if (i === index) {
          ctx.fillStyle = themeStyle === 'gold' ? '#F59E0B' : '#FB7185';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        }
        ctx.fill();
      }
    },
    [themeStyle]
  );

  // Redraw canvas whenever currentSlideIndex or slides change
  useEffect(() => {
    if (!canvasRef.current) return;
    const currentSlide = slides[currentSlideIndex];
    if (currentSlide) {
      renderSlideToContext(canvasRef.current, currentSlide, currentSlideIndex, slides.length);
    }
  }, [currentSlideIndex, slides, renderSlideToContext]);

  // Download Current Slide as PNG
  const handleDownloadCurrentSlide = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.download = `sparkwithin-carousel-slide-${currentSlideIndex + 1}.png`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
  };

  // Batch Export All 4 Slides Sequentially
  const handleExportAllSlides = async () => {
    setIsExportingAll(true);
    try {
      const offscreen = document.createElement('canvas');
      for (let i = 0; i < slides.length; i++) {
        renderSlideToContext(offscreen, slides[i], i, slides.length);
        const dataUrl = offscreen.toDataURL('image/png');
        const a = document.createElement('a');
        a.download = `sparkwithin-slide-${i + 1}-of-${slides.length}.png`;
        a.href = dataUrl;
        a.click();
        await new Promise((r) => setTimeout(r, 400));
      }
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F43F5E', '#8B5CF6'],
      });
    } finally {
      setIsExportingAll(false);
    }
  };

  // Open Direct Publish Modal with the current slide
  const handlePublishCurrent = () => {
    if (!canvasRef.current || !onOpenPublishModal) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const caption = `💎 வாழ்வியல் தத்துவம் • குறள் #${activeKural.number}\n\n${activeKural.verse}\n\n— Spark Within\n\n📌 விளக்கம்:\n${activeKural.explanation}\n\n#sparkwithin #thirukkural #tamilquotes #tamilmotivation #wisdom #dailyquotes #kural`;
    onOpenPublishModal(dataUrl, caption);
  };

  const handleCopyCaption = () => {
    const caption = `💎 வாழ்வியல் தத்துவம் • குறள் #${activeKural.number}\n\n${activeKural.verse}\n\n— Spark Within\n\n📌 விளக்கம்:\n${activeKural.explanation}\n\n#sparkwithin #thirukkural #tamilquotes #tamilmotivation #wisdom #dailyquotes #kural`;
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Instagram Carousel Creator (Multi-Slide Pack)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                3x Engagement
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Creates 4 swipeable slides: Hook → Verse (Left Aligned) → Meaning → Call To Action.
            </p>
          </div>
        </div>

        {/* Quick Kural Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={activeKural.id}
            onChange={(e) => {
              const k = THIRUKKURAL_LIBRARY.find((item) => item.id === e.target.value);
              if (k) setActiveKural(k);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-400 shadow-xs cursor-pointer"
          >
            {THIRUKKURAL_LIBRARY.map((item) => (
              <option key={item.id} value={item.id}>
                குறள் #{item.number} • {item.hookTitle.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Interactive Carousel Preview */}
        <section className="lg:w-[50%] flex flex-col items-center gap-4">
          <div className="w-full max-w-[440px] rounded-3xl bg-slate-950 p-2 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Live Canvas */}
            <div className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </div>

            {/* Navigation Controls over slide */}
            <div className="p-3 bg-slate-900/90 rounded-2xl mt-2 flex items-center justify-between text-white text-xs">
              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="p-1.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>முந்தைய (Prev)</span>
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlideIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      i === currentSlideIndex
                        ? 'bg-amber-400 w-6'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                    title={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlideIndex === slides.length - 1}
                className="p-1.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <span>அடுத்த (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="w-full max-w-[440px] flex items-center gap-2">
            <button
              onClick={handleDownloadCurrentSlide}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download Slide {currentSlideIndex + 1}</span>
            </button>

            <button
              onClick={handleExportAllSlides}
              disabled={isExportingAll}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExportingAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span>{isExportingAll ? 'Exporting All...' : 'Download All 4 Slides'}</span>
            </button>
          </div>

          {onOpenPublishModal && (
            <button
              onClick={handlePublishCurrent}
              className="w-full max-w-[440px] py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:opacity-95 text-white font-bold text-xs shadow-md transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish This Slide to Instagram Now</span>
            </button>
          )}
        </section>

        {/* Right: Slide Customizer & Theme */}
        <section className="lg:w-[50%] space-y-5">
          {/* Theme Palette */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>Carousel Visual Style (தீம் வடிவம்):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gold', label: 'Luxury Gold', color: 'bg-amber-600' },
                { id: 'midnight', label: 'Midnight Blue', color: 'bg-slate-900' },
                { id: 'emerald', label: 'Zen Emerald', color: 'bg-emerald-700' },
                { id: 'crimson', label: 'Royal Crimson', color: 'bg-rose-800' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeStyle(t.id as any)}
                  className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    themeStyle === t.id
                      ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slide Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Slide Details & Customization:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    currentSlideIndex === idx
                      ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">SLIDE {idx + 1}</span>
                    <span className="text-rose-600 uppercase">{s.type}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate mt-1">{s.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Slide Editor */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Editing Slide {currentSlideIndex + 1} of {slides.length} ({slides[currentSlideIndex].type.toUpperCase()})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                Auto-saved
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">Heading / Title:</label>
              <input
                type="text"
                value={slides[currentSlideIndex].title}
                onChange={(e) => {
                  const updated = [...slides];
                  updated[currentSlideIndex].title = e.target.value;
                  setSlides(updated);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">Slide Main Content:</label>
              <textarea
                rows={4}
                value={slides[currentSlideIndex].content}
                onChange={(e) => {
                  const updated = [...slides];
                  updated[currentSlideIndex].content = e.target.value;
                  setSlides(updated);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 leading-relaxed font-sans focus:outline-none focus:border-rose-400 resize-none text-left"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Author Attribution:</label>
                <input
                  type="text"
                  readOnly
                  value="Spark Within"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold cursor-not-allowed select-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Category Tag:</label>
                <input
                  type="text"
                  readOnly
                  value="💎 வாழ்வியல் தத்துவம்"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>

          {/* Viral Caption Ready to Copy */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Instagram Carousel Caption:</span>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed font-mono">
              💎 வாழ்வியல் தத்துவம் • குறள் #{activeKural.number}
              <br />
              {activeKural.verse}
              <br />— Spark Within
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
