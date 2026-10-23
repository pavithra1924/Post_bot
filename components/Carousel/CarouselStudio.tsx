'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  THIRUKKURAL_LIBRARY,
  ThirukkuralItem,
  TAMIL_WISDOM_CATEGORIES,
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
  Palette,
  ExternalLink,
  BookOpen,
  Search,
  SlidersHorizontal,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CarouselStudioProps {
  initialKural?: ThirukkuralItem;
  onOpenPublishModal?: (imageUrl: string, caption: string) => void;
  onOpenLibraryModal?: () => void;
}

export type CarouselTheme = 'gold_luxury' | 'midnight_blue' | 'zen_emerald' | 'royal_crimson';

export interface FiveSlidePack {
  slide1_verse: {
    badge: string;
    kuralNumber: number;
    chapter: string;
    verse: string;
    author: string; // Strictly "திருவள்ளுவர்"
    brand: string;  // Strictly "Spark Within"
    handle: string; // Strictly "@_sparkwithin_hub_"
  };
  slide2_simpleMeaning: {
    badge: string;
    title: string; // "எளிய தமிழ் விளக்கம்"
    kuralRef: string;
    content: string;
    author: string;
    brand: string;
    handle: string;
  };
  slide3_deepMeaning: {
    badge: string;
    title: string; // "ஆழமான பொருள்"
    kuralRef: string;
    content: string;
    author: string;
    brand: string;
    handle: string;
  };
  slide4_lifeExample: {
    badge: string;
    title: string; // "வாழ்க்கையில் ஓர் உதாரணம்"
    kuralRef: string;
    content: string;
    author: string;
    brand: string;
    handle: string;
  };
  slide5_dailyThought: {
    badge: string;
    title: string; // "இன்றைய சிந்தனை"
    kuralRef: string;
    content: string;
    cta: string;
    author: string;
    brand: string;
    handle: string;
  };
}

export const CarouselStudio: React.FC<CarouselStudioProps> = ({
  initialKural = THIRUKKURAL_LIBRARY[0],
  onOpenPublishModal,
  onOpenLibraryModal,
}) => {
  const [activeKural, setActiveKural] = useState<ThirukkuralItem>(initialKural);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '1:1'>('4:5');
  const [themeStyle, setThemeStyle] = useState<CarouselTheme>('gold_luxury');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sync when initialKural changes externally
  useEffect(() => {
    if (initialKural) {
      setActiveKural(initialKural);
    }
  }, [initialKural]);

  // Maintain editable 5-slide data pack for the active Kural
  const [slidePack, setSlidePack] = useState<FiveSlidePack>(() => ({
    slide1_verse: {
      badge: '💎 வாழ்வியல் தத்துவம்',
      kuralNumber: activeKural.number,
      chapter: activeKural.chapter,
      verse: activeKural.verse,
      author: 'திருவள்ளுவர்',
      brand: 'Spark Within',
      handle: '@_sparkwithin_hub_',
    },
    slide2_simpleMeaning: {
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: 'எளிய தமிழ் விளக்கம்',
      kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
      content: activeKural.simpleExplanation,
      author: 'திருவள்ளுவர்',
      brand: 'Spark Within',
      handle: '@_sparkwithin_hub_',
    },
    slide3_deepMeaning: {
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: 'ஆழமான பொருள்',
      kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
      content: activeKural.deepMeaning,
      author: 'திருவள்ளுவர்',
      brand: 'Spark Within',
      handle: '@_sparkwithin_hub_',
    },
    slide4_lifeExample: {
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: 'வாழ்க்கையில் ஓர் உதாரணம்',
      kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
      content: activeKural.lifeExample,
      author: 'திருவள்ளுவர்',
      brand: 'Spark Within',
      handle: '@_sparkwithin_hub_',
    },
    slide5_dailyThought: {
      badge: '💎 வாழ்வியல் தத்துவம்',
      title: 'இன்றைய சிந்தனை',
      kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
      content: activeKural.dailyThought,
      cta: 'Follow @_sparkwithin_hub_ for daily wisdom & inspiration',
      author: 'திருவள்ளுவர்',
      brand: 'Spark Within',
      handle: '@_sparkwithin_hub_',
    },
  }));

  // Re-initialize slide pack when active Kural changes
  useEffect(() => {
    setSlidePack({
      slide1_verse: {
        badge: '💎 வாழ்வியல் தத்துவம்',
        kuralNumber: activeKural.number,
        chapter: activeKural.chapter,
        verse: activeKural.verse,
        author: 'திருவள்ளுவர்',
        brand: 'Spark Within',
        handle: '@_sparkwithin_hub_',
      },
      slide2_simpleMeaning: {
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: 'எளிய தமிழ் விளக்கம்',
        kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
        content: activeKural.simpleExplanation,
        author: 'திருவள்ளுவர்',
        brand: 'Spark Within',
        handle: '@_sparkwithin_hub_',
      },
      slide3_deepMeaning: {
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: 'ஆழமான பொருள்',
        kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
        content: activeKural.deepMeaning,
        author: 'திருவள்ளுவர்',
        brand: 'Spark Within',
        handle: '@_sparkwithin_hub_',
      },
      slide4_lifeExample: {
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: 'வாழ்க்கையில் ஓர் உதாரணம்',
        kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
        content: activeKural.lifeExample,
        author: 'திருவள்ளுவர்',
        brand: 'Spark Within',
        handle: '@_sparkwithin_hub_',
      },
      slide5_dailyThought: {
        badge: '💎 வாழ்வியல் தத்துவம்',
        title: 'இன்றைய சிந்தனை',
        kuralRef: `குறள் #${activeKural.number} • ${activeKural.chapter}`,
        content: activeKural.dailyThought,
        cta: 'Follow @_sparkwithin_hub_ for daily wisdom & inspiration',
        author: 'திருவள்ளுவர்',
        brand: 'Spark Within',
        handle: '@_sparkwithin_hub_',
      },
    });
  }, [activeKural]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Theme palettes configuration
  const themeConfig = useMemo(() => {
    switch (themeStyle) {
      case 'gold_luxury':
        return {
          bgTop: '#161311',
          bgMid: '#0F0D0C',
          bgBottom: '#070605',
          borderOuter: 'rgba(217, 119, 6, 0.4)',
          borderInner: 'rgba(255, 255, 255, 0.07)',
          accentBadge: '#F59E0B',
          accentSub: '#FDE68A',
          textColor: '#FFFFFF',
          textMuted: 'rgba(255, 255, 255, 0.72)',
          authorColor: '#F59E0B',
          brandColor: 'rgba(255, 255, 255, 0.65)',
        };
      case 'midnight_blue':
        return {
          bgTop: '#0B132B',
          bgMid: '#060B1A',
          bgBottom: '#02040A',
          borderOuter: 'rgba(56, 189, 248, 0.35)',
          borderInner: 'rgba(255, 255, 255, 0.08)',
          accentBadge: '#38BDF8',
          accentSub: '#BAE6FD',
          textColor: '#FFFFFF',
          textMuted: 'rgba(255, 255, 255, 0.75)',
          authorColor: '#38BDF8',
          brandColor: 'rgba(255, 255, 255, 0.65)',
        };
      case 'zen_emerald':
        return {
          bgTop: '#062B21',
          bgMid: '#031C15',
          bgBottom: '#010F0B',
          borderOuter: 'rgba(16, 185, 129, 0.35)',
          borderInner: 'rgba(255, 255, 255, 0.08)',
          accentBadge: '#10B981',
          accentSub: '#A7F3D0',
          textColor: '#FFFFFF',
          textMuted: 'rgba(255, 255, 255, 0.75)',
          authorColor: '#34D399',
          brandColor: 'rgba(255, 255, 255, 0.65)',
        };
      case 'royal_crimson':
      default:
        return {
          bgTop: '#2C0A14',
          bgMid: '#1A040B',
          bgBottom: '#0B0104',
          borderOuter: 'rgba(244, 63, 94, 0.35)',
          borderInner: 'rgba(255, 255, 255, 0.08)',
          accentBadge: '#FB7185',
          accentSub: '#FECDD3',
          textColor: '#FFFFFF',
          textMuted: 'rgba(255, 255, 255, 0.75)',
          authorColor: '#F43F5E',
          brandColor: 'rgba(255, 255, 255, 0.65)',
        };
    }
  }, [themeStyle]);

  // Master Render Function for any of the 5 slides
  const renderSlideToContext = useCallback(
    (canvas: HTMLCanvasElement, slideIndex: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = aspectRatio === '4:5' ? 1350 : 1080;
      canvas.width = width;
      canvas.height = height;

      const tc = themeConfig;

      // 1. Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, tc.bgTop);
      grad.addColorStop(0.55, tc.bgMid);
      grad.addColorStop(1, tc.bgBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Refined Luxury Dual Borders
      ctx.strokeStyle = tc.borderOuter;
      ctx.lineWidth = 3;
      ctx.strokeRect(52, 52, width - 104, height - 104);

      ctx.strokeStyle = tc.borderInner;
      ctx.lineWidth = 1;
      ctx.strokeRect(66, 66, width - 132, height - 132);

      // 3. Top Header Bar: Slide Indicator (e.g. "SLIDE 1 OF 5") & Category Badge
      const headerY = 120;

      // Category Badge (💎 வாழ்வியல் தத்துவம்)
      ctx.textAlign = 'left';
      ctx.fillStyle = tc.accentBadge;
      ctx.font = '700 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('💎 வாழ்வியல் தத்துவம்', 96, headerY);

      // Slide Indicator (1 / 5, 2 / 5, etc.)
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`${slideIndex + 1} / 5`, width - 96, headerY);

      // Top Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(96, headerY + 28);
      ctx.lineTo(width - 96, headerY + 28);
      ctx.stroke();

      // Safe content boundaries
      const contentLeft = 96;
      const contentRight = width - 96;
      const contentWidth = contentRight - contentLeft;

      // Helper function to wrap text cleanly
      const wrapText = (
        text: string,
        x: number,
        startY: number,
        maxW: number,
        lineH: number,
        align: CanvasTextAlign = 'left'
      ): number => {
        ctx.textAlign = align;
        const paragraphs = text.split('\n');
        let curY = startY;

        for (const para of paragraphs) {
          if (!para.trim()) {
            curY += lineH * 0.6;
            continue;
          }
          const words = para.split(' ');
          let line = '';
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxW && n > 0) {
              ctx.fillText(line.trim(), x, curY);
              line = words[n] + ' ';
              curY += lineH;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line.trim(), x, curY);
          curY += lineH;
        }
        return curY;
      };

      // 4. Slide Specific Rendering (Slides 1 to 5)
      if (slideIndex === 0) {
        // ==========================================
        // SLIDE 1 — திருக்குறள் (Original Couplet)
        // ==========================================
        const data = slidePack.slide1_verse;

        // Subheader: Chapter & Kural Number
        ctx.fillStyle = tc.accentSub;
        ctx.font = '600 32px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`குறள் #${data.kuralNumber} • அதிகாரம்: ${data.chapter}`, contentLeft, 320);

        // Decorative horizontal accent
        ctx.fillStyle = tc.accentBadge;
        ctx.fillRect(contentLeft, 345, 80, 4);

        // The Authentic Two-Line Couplet (Left-aligned, prominent typography)
        ctx.fillStyle = tc.textColor;
        ctx.font = 'bold 50px "Mukta Malar", -apple-system, sans-serif';
        const lines = data.verse.split('\n');
        let verseY = 460;
        ctx.textAlign = 'left';
        for (const l of lines) {
          ctx.fillText(l.trim(), contentLeft, verseY);
          verseY += 92;
        }

        // Mandatory Author Attribution: திருவள்ளுவர் (Strictly Thiruvalluvar!)
        verseY += 60;
        ctx.fillStyle = tc.authorColor;
        ctx.font = 'bold 36px "Mukta Malar", -apple-system, sans-serif';
        ctx.fillText(`— ஆசிரியர்: ${data.author}`, contentLeft, verseY);

        // Creator Brand Attribution: Spark Within (Separated clearly!)
        verseY += 50;
        ctx.fillStyle = tc.brandColor;
        ctx.font = '500 24px -apple-system, sans-serif';
        ctx.fillText(`வழங்குபவர்: ${data.brand} (${data.handle})`, contentLeft, verseY);

      } else if (slideIndex === 1) {
        // ==========================================
        // SLIDE 2 — எளிய தமிழ் விளக்கம்
        // ==========================================
        const data = slidePack.slide2_simpleMeaning;

        // Title Header
        ctx.fillStyle = tc.accentSub;
        ctx.font = 'bold 42px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(data.title, contentLeft, 320);

        // Kural reference tag
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '500 24px "Mukta Malar", -apple-system, sans-serif';
        ctx.fillText(data.kuralRef, contentLeft, 365);

        ctx.fillStyle = tc.accentBadge;
        ctx.fillRect(contentLeft, 385, 80, 4);

        // Explanation Body (Short, clean, easily understandable sentences)
        ctx.fillStyle = tc.textColor;
        ctx.font = '500 42px "Mukta Malar", -apple-system, sans-serif';
        const nextY = wrapText(data.content, contentLeft, 470, contentWidth, 76, 'left');

        // Attribution
        ctx.fillStyle = tc.authorColor;
        ctx.font = '600 30px "Mukta Malar", -apple-system, sans-serif';
        ctx.fillText(`— ஆசிரியர்: ${data.author} • தொகுப்பு: ${data.brand}`, contentLeft, nextY + 60);

      } else if (slideIndex === 2) {
        // ==========================================
        // SLIDE 3 — ஆழமான பொருள்
        // ==========================================
        const data = slidePack.slide3_deepMeaning;

        // Title Header
        ctx.fillStyle = tc.accentSub;
        ctx.font = 'bold 42px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(data.title, contentLeft, 320);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '500 24px "Mukta Malar", -apple-system, sans-serif';
        ctx.fillText('தத்துவ மற்றும் வாழ்வியல் உள்நோக்கம்', contentLeft, 365);

        ctx.fillStyle = tc.accentBadge;
        ctx.fillRect(contentLeft, 385, 80, 4);

        // Deep Meaning Content
        ctx.fillStyle = tc.textColor;
        ctx.font = '500 40px "Mukta Malar", -apple-system, sans-serif';
        const nextY = wrapText(data.content, contentLeft, 470, contentWidth, 74, 'left');

        // Wisdom Note
        ctx.fillStyle = tc.authorColor;
        ctx.font = '600 30px "Mukta Malar", -apple-system, sans-serif';
        ctx.fillText(`— ஆசிரியர்: ${data.author} • வாழ்வியல் தொகுப்பு: ${data.brand}`, contentLeft, nextY + 60);

      } else if (slideIndex === 3) {
        // ==========================================
        // SLIDE 4 — வாழ்க்கையில் ஓர் உதாரணம்
        // ==========================================
        const data = slidePack.slide4_lifeExample;

        // Title Header
        ctx.fillStyle = tc.accentSub;
        ctx.font = 'bold 42px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(data.title, contentLeft, 320);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '500 24px "Mukta Malar", -apple-system, sans-serif';
        ctx.fillText('அன்றாட வாழ்க்கையில் நடைமுறை பயன்பாடு', contentLeft, 365);

        ctx.fillStyle = tc.accentBadge;
        ctx.fillRect(contentLeft, 385, 80, 4);

        // Relatable Example Text
        ctx.fillStyle = tc.textColor;
        ctx.font = '500 40px "Mukta Malar", -apple-system, sans-serif';
        const nextY = wrapText(data.content, contentLeft, 470, contentWidth, 74, 'left');

        // Context Footer
        ctx.fillStyle = tc.authorColor;
        ctx.font = '600 30px "Mukta Malar", -apple-system, sans-serif';
        ctx.fillText(`— ஆசிரியர்: ${data.author} • நடைமுறை விளக்கம்: ${data.brand}`, contentLeft, nextY + 60);

      } else {
        // ==========================================
        // SLIDE 5 — இன்றைய சிந்தனை & சமூகப் பகிர்வு
        // ==========================================
        const data = slidePack.slide5_dailyThought;

        // Title Header
        ctx.fillStyle = tc.accentSub;
        ctx.font = 'bold 42px "Mukta Malar", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(data.title, contentLeft, 300);

        ctx.fillStyle = tc.accentBadge;
        ctx.fillRect(contentLeft, 335, 80, 4);

        // Daily Takeaway Content
        ctx.fillStyle = tc.textColor;
        ctx.font = '500 38px "Mukta Malar", -apple-system, sans-serif';
        const nextY = wrapText(data.content, contentLeft, 410, contentWidth, 70, 'left');

        // Brand CTA Box
        const boxY = Math.min(nextY + 40, height - 280);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(contentLeft, boxY, contentWidth, 120);
        ctx.strokeStyle = tc.borderOuter;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(contentLeft, boxY, contentWidth, 120);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Spark Within • @_sparkwithin_hub_', width / 2, boxY + 52);

        ctx.fillStyle = tc.accentBadge;
        ctx.font = '600 22px -apple-system, sans-serif';
        ctx.fillText('Follow for Daily Tamil Wisdom & Inspiration', width / 2, boxY + 92);
      }

      // 5. Bottom Brand & Swipe Prompt
      const footerY = height - 90;

      // Brand signature in bottom-left
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '600 22px -apple-system, sans-serif';
      ctx.fillText('Spark Within', contentLeft, footerY);

      // Slide Progress Dots in bottom-center
      const dotCount = 5;
      const dotRadius = 5;
      const dotGap = 20;
      const totalDotsWidth = (dotCount - 1) * dotGap;
      const dotStartX = width / 2 - totalDotsWidth / 2;

      for (let i = 0; i < dotCount; i++) {
        ctx.beginPath();
        ctx.arc(dotStartX + i * dotGap, footerY - 5, dotRadius, 0, Math.PI * 2);
        if (i === slideIndex) {
          ctx.fillStyle = tc.accentBadge;
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        }
        ctx.fill();
      }

      // Swipe indicator in bottom-right (except last slide)
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '600 22px -apple-system, sans-serif';
      if (slideIndex < 4) {
        ctx.fillText('Swipe 👉', contentRight, footerY);
      } else {
        ctx.fillText('Save & Share 🔖', contentRight, footerY);
      }
    },
    [slidePack, aspectRatio, themeConfig]
  );

  // Redraw preview whenever state changes
  useEffect(() => {
    if (!canvasRef.current) return;
    renderSlideToContext(canvasRef.current, activeSlideIndex);
  }, [activeSlideIndex, renderSlideToContext]);

  // Download Current Slide as PNG
  const handleDownloadSingleSlide = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `kural-${activeKural.number}-slide-${activeSlideIndex + 1}-of-5.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  };

  // Batch Export All 5 Slides Sequentially
  const handleExportAllSlides = async () => {
    setIsExportingAll(true);
    try {
      const offscreen = document.createElement('canvas');
      const slideNames = [
        '1-thirukkural-verse',
        '2-simple-explanation',
        '3-deep-meaning',
        '4-life-example',
        '5-daily-thought',
      ];

      for (let i = 0; i < 5; i++) {
        renderSlideToContext(offscreen, i);
        const dataUrl = offscreen.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `sparkwithin-kural-${activeKural.number}-${slideNames[i]}.png`;
        link.href = dataUrl;
        link.click();
        await new Promise((r) => setTimeout(r, 450));
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F43F5E', '#10B981', '#38BDF8'],
      });
    } finally {
      setIsExportingAll(false);
    }
  };

  // Publish Current Slide Directly to Instagram
  const handlePublishToInstagram = () => {
    if (!canvasRef.current || !onOpenPublishModal) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const caption = `💎 வாழ்வியல் தத்துவம் • குறள் #${activeKural.number} (${activeKural.chapter})\n\n${activeKural.verse}\n\n— ஆசிரியர்: திருவள்ளுவர்\nவழங்குபவர்: Spark Within (@_sparkwithin_hub_)\n\n📌 எளிய விளக்கம்:\n${activeKural.simpleExplanation}\n\n💡 வாழ்க்கையில் ஓர் உதாரணம்:\n${activeKural.lifeExample}\n\n#sparkwithin #thirukkural #thiruvalluvar #tamilquotes #tamilmotivation #wisdom #dailyquotes #kural #tamilnadu #inspiration`;
    onOpenPublishModal(dataUrl, caption);
  };

  // Copy Viral Caption to Clipboard
  const handleCopyCaption = () => {
    const caption = `💎 வாழ்வியல் தத்துவம் • குறள் #${activeKural.number} (${activeKural.chapter})\n\n${activeKural.verse}\n\n— ஆசிரியர்: திருவள்ளுவர்\nவழங்குபவர்: Spark Within (@_sparkwithin_hub_)\n\n📌 எளிய விளக்கம்:\n${activeKural.simpleExplanation}\n\n💡 வாழ்க்கையில் ஓர் உதாரணம்:\n${activeKural.lifeExample}\n\n#sparkwithin #thirukkural #thiruvalluvar #tamilquotes #tamilmotivation #wisdom #dailyquotes #kural #tamilnadu #inspiration`;
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  // Filtered Kurals for Search
  const filteredKurals = useMemo(() => {
    return THIRUKKURAL_LIBRARY.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;
      return (
        matchesCategory &&
        (item.verse.toLowerCase().includes(q) ||
          item.simpleExplanation.toLowerCase().includes(q) ||
          item.number.toString().includes(q) ||
          item.chapter.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const slideTabs = [
    { idx: 0, title: '1. குறள் (Verse)', desc: 'திருக்குறள் & ஆசிரியர் திருவள்ளுவர்' },
    { idx: 1, title: '2. எளிய உரை', desc: 'எளிய தமிழ் விளக்கம்' },
    { idx: 2, title: '3. ஆழமான பொருள்', desc: 'தத்துவ உள்நோக்கம்' },
    { idx: 3, title: '4. உதாரணம்', desc: 'வாழ்க்கையில் ஓர் உதாரணம்' },
    { idx: 4, title: '5. சிந்தனை', desc: 'இன்றைய சிந்தனை & பகிர்வு' },
  ];

  return (
    <div className="space-y-6">
      {/* SaaS Studio Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold tracking-wider uppercase border border-amber-200 shadow-xs">
              💎 வாழ்வியல் தத்துவம் • 5-Slide Carousel
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ஆசிரியர்: <strong>திருவள்ளுவர்</strong> • Brand: <strong>Spark Within</strong>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            திருக்குறள் கேரோசல் ஸ்டுடியோ (5-Slide Instagram Pack)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            திருக்குறள், எளிய விளக்கம், ஆழமான பொருள், நடைமுறை உதாரணம் மற்றும் சிந்தனை என 5 ஸ்லைடுகளாக வடிவமைத்து இன்ஸ்டாகிராமில் நேரடியாகப் பகிருங்கள்.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onOpenLibraryModal && (
            <button
              onClick={onOpenLibraryModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span>நூலகம் (Library)</span>
            </button>
          )}

          <button
            onClick={handleExportAllSlides}
            disabled={isExportingAll}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-opacity cursor-pointer disabled:opacity-50"
          >
            {isExportingAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isExportingAll ? 'Exporting...' : 'Download All 5 Slides'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left (Canvas Preview) + Right (Slide Navigation & Customizer) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Live 5-Slide Canvas Preview */}
        <div className="lg:w-[48%] w-full flex flex-col items-center">
          <div className="sticky top-20 w-full max-w-[440px] flex flex-col items-center gap-4">
            {/* The Screen Canvas */}
            <div className="w-full rounded-3xl overflow-hidden bg-slate-950 p-2.5 border border-slate-800 shadow-2xl relative">
              <div
                className={`w-full ${
                  aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'
                } relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center`}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </div>

              {/* In-Canvas Slide Navigation Bar */}
              <div className="p-3 bg-slate-900/95 rounded-2xl mt-2 flex items-center justify-between text-white text-xs">
                <button
                  onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeSlideIndex === 0}
                  className="p-1.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-25 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>முந்தைய (Prev)</span>
                </button>

                {/* 5 Dots Indicator */}
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === activeSlideIndex
                          ? 'bg-amber-400 w-7'
                          : 'bg-slate-600 hover:bg-slate-500 w-2.5'
                      }`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveSlideIndex((prev) => Math.min(4, prev + 1))}
                  disabled={activeSlideIndex === 4}
                  className="p-1.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-25 cursor-pointer flex items-center gap-1"
                >
                  <span>அடுத்த (Next)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Slide Action Bar */}
            <div className="w-full p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAspectRatio('4:5')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    aspectRatio === '4:5'
                      ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  4:5 Portrait
                </button>
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    aspectRatio === '1:1'
                      ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  1:1 Square
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDownloadSingleSlide}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Download Current Slide PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Slide {activeSlideIndex + 1} PNG</span>
                </button>

                {onOpenPublishModal && (
                  <button
                    onClick={handlePublishToInstagram}
                    className="px-4 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Publish current slide to Instagram"
                  >
                    <Send className="w-3.5 h-3.5 text-rose-500" />
                    <span>Post</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Slide Content Editor & Theme Configuration */}
        <div className="lg:w-[52%] w-full space-y-5">
          {/* 1. Kural Quick Search & Selector */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>திருக்குறள் தேர்வு (Select Kural)</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {THIRUKKURAL_LIBRARY.length} தேர்ந்தெடுக்கப்பட்ட குறள்கள்
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="குறள் எண் அல்லது சொல் தேடுக..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={activeKural.id}
                onChange={(e) => {
                  const found = THIRUKKURAL_LIBRARY.find((k) => k.id === e.target.value);
                  if (found) setActiveKural(found);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {filteredKurals.map((k) => (
                  <option key={k.id} value={k.id}>
                    குறள் #{k.number}: {k.chapter}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Visual Theme Palette */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>வடிவமைப்பு தீம் (Visual Theme Palette)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gold_luxury', label: 'Gold & Onyx', color: 'bg-amber-500' },
                { id: 'midnight_blue', label: 'Midnight Blue', color: 'bg-sky-500' },
                { id: 'zen_emerald', label: 'Zen Emerald', color: 'bg-emerald-500' },
                { id: 'royal_crimson', label: 'Royal Crimson', color: 'bg-rose-500' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setThemeStyle(theme.id as CarouselTheme)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    themeStyle === theme.id
                      ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${theme.color} shrink-0`} />
                  <span className="truncate">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. The 5 Slides Selector Strip */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>5 ஸ்லைடு தேர்வு & திருத்தம் (Slide 1 to 5):</span>
              <span className="text-[11px] font-normal text-slate-500">
                ஸ்லைடைக் கிளிக் செய்து உள்ளடக்கத்தை மாற்றலாம்
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {slideTabs.map((tab) => (
                <button
                  key={tab.idx}
                  onClick={() => setActiveSlideIndex(tab.idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeSlideIndex === tab.idx
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-900 truncate">{tab.title}</p>
                  <p className="text-[9px] text-slate-500 truncate mt-0.5">{tab.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Active Slide Editor Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  {slideTabs[activeSlideIndex].title} — உள்ளடக்கம் (Edit Slide {activeSlideIndex + 1})
                </span>
                <p className="text-[11px] text-slate-500">
                  {slideTabs[activeSlideIndex].desc}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                Slide {activeSlideIndex + 1} of 5
              </span>
            </div>

            {/* Slide 1 Editor (Verse) */}
            {activeSlideIndex === 0 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">திருக்குறள் (2 வரிகள்):</label>
                  <textarea
                    rows={3}
                    value={slidePack.slide1_verse.verse}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide1_verse: { ...prev.slide1_verse, verse: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">குறள் எண்:</label>
                    <input
                      type="number"
                      value={slidePack.slide1_verse.kuralNumber}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setSlidePack((prev) => ({
                          ...prev,
                          slide1_verse: { ...prev.slide1_verse, kuralNumber: val },
                        }));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">அதிகாரம் (Chapter):</label>
                    <input
                      type="text"
                      value={slidePack.slide1_verse.chapter}
                      onChange={(e) => {
                        setSlidePack((prev) => ({
                          ...prev,
                          slide1_verse: { ...prev.slide1_verse, chapter: e.target.value },
                        }));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">ஆசிரியர் (Author):</span>
                    <span className="text-xs font-bold text-amber-950">திருவள்ளுவர் (Thiruvalluvar)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Brand Attribution:</span>
                    <span className="text-xs font-bold text-slate-900">Spark Within (@_sparkwithin_hub_)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2 Editor (Simple Explanation) */}
            {activeSlideIndex === 1 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">ஸ்லைடு தலைப்பு:</label>
                  <input
                    type="text"
                    value={slidePack.slide2_simpleMeaning.title}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide2_simpleMeaning: { ...prev.slide2_simpleMeaning, title: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">எளிய தமிழ் உரை (Simple Tamil Meaning):</label>
                  <textarea
                    rows={4}
                    value={slidePack.slide2_simpleMeaning.content}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide2_simpleMeaning: { ...prev.slide2_simpleMeaning, content: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Slide 3 Editor (Deep Meaning) */}
            {activeSlideIndex === 2 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">ஸ்லைடு தலைப்பு:</label>
                  <input
                    type="text"
                    value={slidePack.slide3_deepMeaning.title}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide3_deepMeaning: { ...prev.slide3_deepMeaning, title: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">ஆழமான பொருள் (Deep Philosophical Meaning):</label>
                  <textarea
                    rows={4}
                    value={slidePack.slide3_deepMeaning.content}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide3_deepMeaning: { ...prev.slide3_deepMeaning, content: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Slide 4 Editor (Life Example) */}
            {activeSlideIndex === 3 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">ஸ்லைடு தலைப்பு:</label>
                  <input
                    type="text"
                    value={slidePack.slide4_lifeExample.title}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide4_lifeExample: { ...prev.slide4_lifeExample, title: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">நடைமுறை வாழ்க்கை உதாரணம் (Practical Life Scenario):</label>
                  <textarea
                    rows={4}
                    value={slidePack.slide4_lifeExample.content}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide4_lifeExample: { ...prev.slide4_lifeExample, content: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Slide 5 Editor (Daily Thought & CTA) */}
            {activeSlideIndex === 4 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">ஸ்லைடு தலைப்பு:</label>
                  <input
                    type="text"
                    value={slidePack.slide5_dailyThought.title}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide5_dailyThought: { ...prev.slide5_dailyThought, title: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">இன்றைய சிந்தனை & கேள்வி (Takeaway & Discussion):</label>
                  <textarea
                    rows={4}
                    value={slidePack.slide5_dailyThought.content}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide5_dailyThought: { ...prev.slide5_dailyThought, content: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">Call to Action (CTA):</label>
                  <input
                    type="text"
                    value={slidePack.slide5_dailyThought.cta}
                    onChange={(e) => {
                      setSlidePack((prev) => ({
                        ...prev,
                        slide5_dailyThought: { ...prev.slide5_dailyThought, cta: e.target.value },
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Instagram Viral Caption & Hashtags */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Instagram Carousel Caption (தயாரான கேப்ஷன்):</span>
              </span>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-h-[110px] overflow-y-auto whitespace-pre-line leading-relaxed font-sans">
              💎 வாழ்வியல் தத்துவம் • குறள் #{activeKural.number} ({activeKural.chapter})
              {'\n\n'}
              {activeKural.verse}
              {'\n\n'}— ஆசிரியர்: திருவள்ளுவர்
              {'\n'}வழங்குபவர்: Spark Within (@_sparkwithin_hub_)
              {'\n\n'}📌 எளிய விளக்கம்:
              {'\n'}{activeKural.simpleExplanation}
              {'\n\n'}💡 வாழ்க்கையில் ஓர் உதாரணம்:
              {'\n'}{activeKural.lifeExample}
              {'\n\n'}#sparkwithin #thirukkural #thiruvalluvar #tamilquotes #tamilmotivation #wisdom
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
