'use client';

import React, { useState } from 'react';
import { Dices, Sparkles, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';

interface ImagePickerProps {
  onShuffleImage: () => void;
  onGeneratePollinations: () => void;
  onCustomImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGenerating?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onShuffleImage,
  onGeneratePollinations,
  onCustomImageUpload,
  isGenerating,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
          Background Image
        </label>
        <span className="text-[10px] text-emerald-400 font-mono">$0 Free Engine</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Re-roll Background */}
        <button
          onClick={onShuffleImage}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white transition-all group"
          title="Swap photo from curated collection"
        >
          <Dices className="w-4 h-4 text-amber-400 mb-1 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold">Re-roll</span>
          <span className="text-[9px] text-white/40">Curated</span>
        </button>

        {/* AI Generative (Pollinations) */}
        <button
          onClick={onGeneratePollinations}
          disabled={isGenerating}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-all group disabled:opacity-50"
          title="Generate matching AI background with Pollinations"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 text-rose-400 mb-1 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-xs font-bold">AI Render</span>
          <span className="text-[9px] text-rose-300/60">Zero-Key AI</span>
        </button>

        {/* Upload Custom */}
        <label className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white transition-all cursor-pointer group">
          <Upload className="w-4 h-4 text-cyan-400 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-xs font-bold">Upload</span>
          <span className="text-[9px] text-white/40">Custom Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={onCustomImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
