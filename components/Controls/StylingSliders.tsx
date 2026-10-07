'use client';

import React from 'react';
import { Eye, Film, Sparkles, Layers } from 'lucide-react';

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
      <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
        Atmosphere & Canva-Grade Effects
      </label>

      {/* Overlay Darkness */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/50 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-white/40" />
            Overlay Darkness
          </span>
          <span className="text-[11px] text-white/70 font-mono">
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
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
      </div>

      {/* Grain Intensity */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/50 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-white/40" />
            35mm Film Grain
          </span>
          <span className="text-[11px] text-white/70 font-mono">
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
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
      </div>

      {/* Toggles Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Canva Glassmorphism Card */}
        <button
          onClick={onToggleGlassCard}
          className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors col-span-2 ${
            showGlassCard
              ? 'bg-rose-500/15 border-rose-500/50 text-white font-semibold'
              : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            Frosted Glass Card (Canva Style)
          </span>
          <div className={`w-2 h-2 rounded-full ${showGlassCard ? 'bg-rose-500' : 'bg-white/20'}`} />
        </button>

        <button
          onClick={onToggleBorder}
          className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
            showBorder
              ? 'bg-rose-500/10 border-rose-500/40 text-white'
              : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/[0.05]'
          }`}
        >
          <span>Decorative Border</span>
          <div className={`w-2 h-2 rounded-full ${showBorder ? 'bg-rose-500' : 'bg-white/20'}`} />
        </button>

        <button
          onClick={onToggleQuoteMarks}
          className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
            showQuoteMarks
              ? 'bg-rose-500/10 border-rose-500/40 text-white'
              : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/[0.05]'
          }`}
        >
          <span>Quote Marks</span>
          <div className={`w-2 h-2 rounded-full ${showQuoteMarks ? 'bg-rose-500' : 'bg-white/20'}`} />
        </button>

        <button
          onClick={onToggleCategoryBadge}
          className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
            showCategoryBadge
              ? 'bg-rose-500/10 border-rose-500/40 text-white'
              : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/[0.05]'
          }`}
        >
          <span>Theme Badge</span>
          <div className={`w-2 h-2 rounded-full ${showCategoryBadge ? 'bg-rose-500' : 'bg-white/20'}`} />
        </button>

        <button
          onClick={onToggleVignette}
          className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
            vignette
              ? 'bg-rose-500/10 border-rose-500/40 text-white'
              : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/[0.05]'
          }`}
        >
          <span>Dark Vignette</span>
          <div className={`w-2 h-2 rounded-full ${vignette ? 'bg-rose-500' : 'bg-white/20'}`} />
        </button>
      </div>
    </div>
  );
};
