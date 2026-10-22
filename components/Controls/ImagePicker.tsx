'use client';

import React from 'react';
import { Dices, Sparkles, Upload, RefreshCw } from 'lucide-react';

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
        <label className="text-xs font-bold tracking-wider text-slate-800 uppercase">
          Background Image
        </label>
        <span className="text-[10px] text-emerald-600 font-bold font-mono">$0 Free Engine</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Re-roll Background */}
        <button
          onClick={onShuffleImage}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700 transition-all group cursor-pointer shadow-xs"
          title="Swap photo from curated collection"
        >
          <Dices className="w-4 h-4 text-amber-500 mb-1 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-slate-900">Re-roll</span>
          <span className="text-[9px] text-slate-500">Curated</span>
        </button>

        {/* AI Generative (Pollinations) */}
        <button
          onClick={onGeneratePollinations}
          disabled={isGenerating}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 transition-all group disabled:opacity-50 cursor-pointer shadow-xs"
          title="Generate matching AI background with Pollinations"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 text-amber-600 mb-1 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-xs font-bold">AI Render</span>
          <span className="text-[9px] text-amber-700 font-medium">Zero-Key AI</span>
        </button>

        {/* Upload Custom */}
        <label className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer group shadow-xs">
          <Upload className="w-4 h-4 text-indigo-500 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-xs font-bold text-slate-900">Upload</span>
          <span className="text-[9px] text-slate-500">Custom Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onCustomImageUpload}
          />
        </label>
      </div>
    </div>
  );
};
