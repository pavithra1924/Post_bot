'use client';

import React from 'react';
import { Eye, Film, Layers } from 'lucide-react';

interface StylingSlidersProps {
  overlayOpacity: number;
  onChangeOverlayOpacity: (val: number) => void;
  grainIntensity: number;
  onChangeGrainIntensity: (val: number) => void;
  vignette: boolean;
  onToggleVignette: () => void;
  showBorder: boolean;
  onToggleBorder: () => void;
  showQuoteMarks: boolean;
  onToggleQuoteMarks: () => void;
  showCategoryBadge: boolean;
  onToggleCategoryBadge: () => void;
  showGlassCard: boolean;
  onToggleGlassCard: () => void;
}

export const StylingSliders: React.FC<StylingSlidersProps> = ({
  overlayOpacity,
  onChangeOverlayOpacity,
  grainIntensity,
  onChangeGrainIntensity,
  vignette,
  onToggleVignette,
  showBorder,
  onToggleBorder,
  showQuoteMarks,
  onToggleQuoteMarks,
  showCategoryBadge,
  onToggleCategoryBadge,
  showGlassCard,
  onToggleGlassCard,
}) => {
  return (
    <div className="space-y-3.5">
      <label className="text-xs font-bold tracking-wider text-slate-800 uppercase">
        Atmosphere & Visual Effects
      </label>

      {/* Overlay Darkness */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            Overlay Darkness
          </span>
          <span className="text-[11px] text-slate-800 font-mono font-bold">
            {Math.round(overlayOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="0.9"
          step="0.05"
          value={overlayOpacity}
          onChange={(e) => onChangeOverlayOpacity(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      {/* Grain Intensity */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-slate-400" />
            35mm Film Grain
          </span>
          <span className="text-[11px] text-slate-800 font-mono font-bold">
            {Math.round(grainIntensity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="0.6"
          step="0.05"
          value={grainIntensity}
          onChange={(e) => onChangeGrainIntensity(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Canva Glassmorphism Card */}
        <button
          onClick={onToggleGlassCard}
          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all col-span-2 cursor-pointer ${
            showGlassCard
              ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold shadow-xs'
              : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Frosted Glass Card (Canva Style)
          </span>
          <div className={`w-2.5 h-2.5 rounded-full ${showGlassCard ? 'bg-amber-500' : 'bg-slate-300'}`} />
        </button>

        <button
          onClick={onToggleBorder}
          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
            showBorder
              ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold shadow-xs'
              : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Decorative Border</span>
          <div className={`w-2.5 h-2.5 rounded-full ${showBorder ? 'bg-amber-500' : 'bg-slate-300'}`} />
        </button>

        <button
          onClick={onToggleQuoteMarks}
          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
            showQuoteMarks
              ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold shadow-xs'
              : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Quote Marks</span>
          <div className={`w-2.5 h-2.5 rounded-full ${showQuoteMarks ? 'bg-amber-500' : 'bg-slate-300'}`} />
        </button>

        <button
          onClick={onToggleCategoryBadge}
          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
            showCategoryBadge
              ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold shadow-xs'
              : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Theme Badge</span>
          <div className={`w-2.5 h-2.5 rounded-full ${showCategoryBadge ? 'bg-amber-500' : 'bg-slate-300'}`} />
        </button>

        <button
          onClick={onToggleVignette}
          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
            vignette
              ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold shadow-xs'
              : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Dark Vignette</span>
          <div className={`w-2.5 h-2.5 rounded-full ${vignette ? 'bg-amber-500' : 'bg-slate-300'}`} />
        </button>
      </div>
    </div>
  );
};
