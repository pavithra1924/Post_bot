'use client';

import React, { useRef, useEffect, useState } from 'react';
import { renderQuoteToCanvas, downloadCanvasAsPng, copyCanvasToClipboard, RenderQuoteOptions } from '@/lib/canvasRenderer';
import {
  Download,
  Copy,
  Check,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Music2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CanvasPreviewProps {
  renderOptions: RenderQuoteOptions;
  isGeneratingBg?: boolean;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  renderOptions,
  isGeneratingBg,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(4821);

  useEffect(() => {
    let active = true;
    const draw = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderQuoteToCanvas(canvasRef.current, renderOptions);
      } catch (err) {
        console.error('Canvas render error:', err);
      } finally {
        if (active) setIsRendering(false);
      }
    };

    draw();
    return () => {
      active = false;
    };
  }, [renderOptions]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsPng(canvasRef.current, `sparkwithin-${renderOptions.theme.id}-${Date.now()}.png`);
    
    // Celebration confetti with positive theme colors
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#F43F5E', '#8B5CF6', '#10B981'],
    });
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const success = await copyCanvasToClipboard(canvasRef.current);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (!isLiked) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#F43F5E', '#FB7185', '#F59E0B'],
      });
    }
  };

  // Aspect ratio container styles
  const aspectClass =
    renderOptions.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[680px]'
      : renderOptions.aspectRatio === '4:5'
      ? 'aspect-[4/5] max-h-[620px]'
      : 'aspect-square max-h-[520px]';

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Bright & Elegant Instagram Feed Post Card */}
      <div className="w-full max-w-[480px] rounded-2xl bg-white border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] overflow-hidden">
        {/* Post Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            {/* Profile Avatar with Positive Radiant Ring */}
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 shrink-0 shadow-sm">
              <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center text-[10px] font-extrabold text-slate-800 border-2 border-white">
                SW
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  {renderOptions.handle.replace('@', '') || '_sparkwithin_hub_'}
                </span>
                {/* Verified Blue Badge */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#0095F6] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Music2 className="w-2.5 h-2.5 text-rose-500" />
                <span>Original audio • Spark Within</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
              {renderOptions.aspectRatio}
            </span>
            <button className="p-1 hover:text-slate-800 transition-colors cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Canvas Area */}
        <div className="relative w-full flex items-center justify-center bg-slate-950">
          {/* Loading Indicator for Generative AI background */}
          {isGeneratingBg && (
            <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-800">Generating AI Background with Pollinations...</p>
            </div>
          )}

          <div className={`w-full ${aspectClass} relative flex items-center justify-center overflow-hidden bg-slate-950`}>
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>
        </div>

        {/* Instagram Post Action Row */}
        <div className="px-4 pt-3 pb-3 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-slate-700">
              {/* Like Button */}
              <button
                onClick={handleToggleLike}
                className="hover:opacity-80 transition-transform active:scale-125 cursor-pointer"
                title="Like"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? 'fill-[#F43F5E] text-[#F43F5E]' : 'text-slate-700 hover:text-slate-900'
                  }`}
                />
              </button>

              {/* Comment Button */}
              <button className="hover:text-slate-900 transition-colors cursor-pointer" title="Comment">
                <MessageCircle className="w-6 h-6 -rotate-90 text-slate-700" />
              </button>

              {/* Share Paperplane */}
              <button className="hover:text-slate-900 transition-colors cursor-pointer" title="Share">
                <Send className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Bookmark / Save */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="hover:text-slate-900 transition-transform active:scale-110 cursor-pointer"
              title="Save"
            >
              <Bookmark
                className={`w-5 h-5 transition-colors ${
                  isSaved ? 'fill-slate-900 text-slate-900' : 'text-slate-700 hover:text-slate-900'
                }`}
              />
            </button>
          </div>

          {/* Likes Count */}
          <div className="text-xs font-extrabold text-slate-900 tracking-tight">
            {likeCount.toLocaleString()} likes
          </div>

          {/* Post Caption Line */}
          <div className="text-xs text-slate-800 leading-relaxed line-clamp-2">
            <span className="font-extrabold mr-1.5 text-slate-900">{renderOptions.handle.replace('@', '') || '_sparkwithin_hub_'}</span>
            <span className="text-slate-600 font-medium">"{renderOptions.quote}"</span>
          </div>

          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider pt-0.5">
            2 HOURS AGO • MOTIVATION FEED
          </div>
        </div>
      </div>

      {/* Export Action Bar (Positive Uplifting Gradients) */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-[480px]">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res PNG</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          title="Copy Image to Clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
