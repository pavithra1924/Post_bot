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
    const renderOpts: RenderQuoteOptions = {
      quote: post.quote,
      author: post.author,
      showAuthor: showAuthor,
      isOriginalSpark: post.isOriginalSpark,
      theme,
      aspectRatio: aspectRatio,
      layoutStyle: post.layoutStyle,
      backgroundImageUrl: post.backgroundImage,
      fontFamily: isTamil ? 'Mukta Malar' : theme.primaryFont,
      fontSize: aspectRatio === '4:5' ? (isTamil ? 44 : 52) : (isTamil ? 46 : 56),
      textAlign: post.layoutStyle === 'minimal-badge' ? 'left' : 'center',
      textColor: theme.defaultTextColor,
      accentColor: theme.accentColor,
      overlayOpacity: theme.overlayOpacity,
      overlayColor: theme.overlayColor,
      showQuoteMarks: true,
      showBorder: true,
      showCategoryBadge: true,
      categoryBadgeText: post.badge,
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
    <div className={`w-full ${aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'} relative rounded-xl overflow-hidden bg-black border border-white/10 shadow-xl group-hover:scale-[1.01] transition-transform`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none select-none"
      />
    </div>
  );
};
