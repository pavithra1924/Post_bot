'use client';

import React, { useRef, useEffect, useState } from 'react';
import { AspectRatio, renderQuoteToCanvas, downloadCanvasAsPng, copyCanvasToClipboard, RenderQuoteOptions } from '@/lib/canvasRenderer';
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
  CheckCircle2,
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
    downloadCanvasAsPng(canvasRef.current, `instaquote-${renderOptions.theme.id}-${Date.now()}.png`);
    
    // Celebration confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f09433', '#dc2743', '#bc1888', '#0095F6'],
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
        colors: ['#ED4956', '#FD1D1D', '#E1306C'],
      });
    }
  };

  // Aspect ratio container styles
  const aspectClass =
    renderOptions.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[700px]'
      : renderOptions.aspectRatio === '4:5'
      ? 'aspect-[4/5] max-h-[640px]'
      : 'aspect-square max-h-[540px]';

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Instagram Post Feed Frame */}
      <div className="w-full max-w-[480px] rounded-2xl bg-[#000000] border border-[#262626] shadow-2xl overflow-hidden">
        {/* Instagram Post Header */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#262626]/70 bg-[#000000]">
          <div className="flex items-center gap-2.5">
            {/* Profile Avatar with Instagram Gradient Story Ring */}
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0">
              <div className="w-full h-full bg-[#121212] rounded-full flex items-center justify-center text-[10px] font-extrabold text-white border-2 border-black">
                SW
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-tight">
                  {renderOptions.handle.replace('@', '') || '_sparkwithin_hub_'}
                </span>
                {/* Instagram Verified Blue Badge */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#0095F6] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#A8A8A8]">
                <Music2 className="w-2.5 h-2.5" />
                <span>Original audio • Spark Within</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#A8A8A8]">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1c1c1e] text-[#A8A8A8] border border-[#262626]">
              {renderOptions.aspectRatio}
            </span>
            <button className="p-1 hover:text-white transition-colors cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Canvas Area */}
        <div className="relative w-full flex items-center justify-center bg-black">
          {/* Loading Indicator for Generative AI background */}
          {isGeneratingBg && (
            <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-2 border-[#E1306C] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-white/95">Generating AI Background via Pollinations...</p>
            </div>
          )}

          <div className={`w-full ${aspectClass} relative flex items-center justify-center overflow-hidden bg-black`}>
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>
        </div>

        {/* Instagram Post Action Row */}
        <div className="px-3.5 pt-3 pb-2 bg-[#000000] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              {/* Like Button */}
              <button
                onClick={handleToggleLike}
                className="hover:opacity-75 transition-transform active:scale-125 cursor-pointer"
                title="Like"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? 'fill-[#ED4956] text-[#ED4956]' : 'text-white'
                  }`}
                />
              </button>

              {/* Comment Button */}
              <button className="hover:opacity-75 transition-colors cursor-pointer" title="Comment">
                <MessageCircle className="w-6 h-6 -rotate-90 text-white" />
              </button>

              {/* Share Paperplane */}
              <button className="hover:opacity-75 transition-colors cursor-pointer" title="Share">
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Bookmark / Save */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="hover:opacity-75 transition-transform active:scale-110 cursor-pointer"
              title="Save"
            >
              <Bookmark
                className={`w-5 h-5 transition-colors ${
                  isSaved ? 'fill-white text-white' : 'text-white'
                }`}
              />
            </button>
          </div>

          {/* Likes Count */}
          <div className="text-xs font-bold text-white tracking-tight">
            {likeCount.toLocaleString()} likes
          </div>

          {/* Instagram Post Caption Line */}
          <div className="text-xs text-[#FAFAFA] leading-relaxed line-clamp-2">
            <span className="font-bold mr-1.5">{renderOptions.handle.replace('@', '') || '_sparkwithin_hub_'}</span>
            <span className="text-[#E0E0E0]">"{renderOptions.quote}"</span>
          </div>

          <div className="text-[10px] text-[#737373] uppercase tracking-wider pt-0.5">
            2 HOURS AGO • INSTAGRAM FEED
          </div>
        </div>
      </div>

      {/* Export Action Bar (Instagram Styled) */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-[480px]">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-extrabold text-xs shadow-xl shadow-[#dc2743]/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res PNG</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-white font-medium text-xs transition-colors cursor-pointer"
          title="Copy Image to Clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
