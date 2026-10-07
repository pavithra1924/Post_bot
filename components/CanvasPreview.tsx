'use client';

import React, { useRef, useEffect, useState } from 'react';
import { AspectRatio, renderQuoteToCanvas, downloadCanvasAsPng, copyCanvasToClipboard, RenderQuoteOptions } from '@/lib/canvasRenderer';
import { Download, Copy, Check, Sparkles, Maximize2 } from 'lucide-react';
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
      colors: ['#F59E0B', '#F43F5E', '#10B981', '#06B6D4'],
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

  // Aspect ratio container styles
  const aspectClass =
    renderOptions.aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[720px]'
      : renderOptions.aspectRatio === '4:5'
      ? 'aspect-[4/5] max-h-[660px]'
      : 'aspect-square max-h-[580px]';

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Canvas Card Container */}
      <div className="relative w-full max-w-[480px] flex items-center justify-center p-3 rounded-2xl bg-studio-900/90 border border-white/10 shadow-2xl shadow-black/50">
        
        {/* Loading Indicator for Generative AI background */}
        {isGeneratingBg && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-white/90">Generating AI Background via Pollinations...</p>
          </div>
        )}

        {/* Live Canvas Element */}
        <div className={`w-full ${aspectClass} relative flex items-center justify-center overflow-hidden rounded-xl bg-black shadow-inner`}>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>

        {/* Badge in corner */}
        <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white/90">
          {renderOptions.aspectRatio} • {renderOptions.aspectRatio === '9:16' ? '1080×1920' : renderOptions.aspectRatio === '4:5' ? '1080×1350' : '1080×1080'}
        </div>
      </div>

      {/* Export Action Bar */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-[480px]">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-rose-500/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res PNG</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-xs transition-colors"
          title="Copy Image to Clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
