'use client';

import React, { useRef, useEffect } from 'react';
import { renderQuoteToCanvas, RenderQuoteOptions, AspectRatio } from '@/lib/canvasRenderer';
import { THEMES } from '@/lib/themes';
import { ScheduledDayPost } from './BatchScheduler';

interface BatchCardCanvasProps {
  post: ScheduledDayPost;
  aspectRatio?: AspectRatio;
  showAuthor?: boolean;
}

export const BatchCardCanvas: React.FC<BatchCardCanvasProps> = ({ 
  post, 
  aspectRatio = '4:5',
  showAuthor = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;
    const theme = THEMES[post.theme];

    const isTamil = (post as any).language === 'ta' || /[\u0B80-\u0BFF]/.test(post.quote);
    const isKural = post.badge?.includes('திருக்குறள்') || (post as any).category === 'thirukkural' || post.author?.includes('வள்ளுவர்');
    const authorClean = isKural ? 'திருவள்ளுவர்' : (post.author || 'Spark Within').replace(/\(?உள்\s*ஒளி\)?/g, '').trim();
    const badgeClean = isKural ? '💎 வாழ்வியல் தத்துவம்' : post.badge;
    const effectiveAlign = isKural ? 'left' : (post.layoutStyle === 'minimal-badge' ? 'left' : 'center');

    const renderOpts: RenderQuoteOptions = {
      quote: post.quote,
      author: authorClean,
      showAuthor: showAuthor,
      isOriginalSpark: post.isOriginalSpark,
      theme,
      aspectRatio: aspectRatio,
      layoutStyle: post.layoutStyle,
      backgroundImageUrl: post.backgroundImage,
      fontFamily: isTamil ? 'Mukta Malar' : theme.primaryFont,
      fontSize: aspectRatio === '4:5' ? (isTamil ? 44 : 52) : (isTamil ? 46 : 56),
      textAlign: effectiveAlign,
      textColor: theme.defaultTextColor,
      accentColor: theme.accentColor,
      overlayOpacity: theme.overlayOpacity,
      overlayColor: theme.overlayColor,
      showQuoteMarks: true,
      showBorder: true,
      showCategoryBadge: true,
      categoryBadgeText: badgeClean,
      grainIntensity: theme.grainIntensity,
      vignette: theme.vignette,
      handle: '@_sparkwithin_hub_',
      showHandle: true,
      handlePosition: 'bottom-center',
      showGlassCard: post.layoutStyle === 'glass-card',
    };

    if (canvasRef.current) {
      renderQuoteToCanvas(canvasRef.current, renderOpts).catch((err) => {
        console.warn('Batch canvas render failed:', err);
      });
    }

    return () => {
      active = false;
    };
  }, [post, aspectRatio, showAuthor]);

  return (
    <div className={`w-full ${aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'} relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md group-hover:scale-[1.01] transition-transform`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none select-none"
      />
    </div>
  );
};
