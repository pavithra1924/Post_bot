'use client';

import React, { useState } from 'react';
import { PRESET_QUOTES, QuotePreset } from '@/lib/presets';
import { X, BookOpen, ShieldCheck, Flame } from 'lucide-react';
import { THEMES, ThemeId } from '@/lib/themes';

interface QuickPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: QuotePreset) => void;
}

export const QuickPresetsModal: React.FC<QuickPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>('all');

  if (!isOpen) return null;

  const filteredQuotes = selectedThemeFilter === 'all'
    ? PRESET_QUOTES
    : PRESET_QUOTES.filter(q => q.theme === selectedThemeFilter);

  const filterOptions: { id: string; label: string }[] = [
    { id: 'all', label: 'All 35+ Quotes' },
    { id: 'fire_sunset', label: 'Sunset Fire' },
    { id: 'stoic_marble', label: 'Stoic Marble' },
    { id: 'emerald_forest', label: 'Emerald Forest' },
    { id: 'cosmic_galaxy', label: 'Cosmic Stars' },
    { id: 'minimal_linen', label: 'Minimalist Travertine' },
    { id: 'cyber_midnight', label: 'Cyber Rain' },
    { id: 'vintage_journal', label: 'Vintage 35mm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-studio-900 border border-white/15 rounded-3xl p-6 shadow-2xl relative max-h-[88vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">35+ Non-Repeating Mindset Quotes</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Attributions
              </span>
            </div>
            <p className="text-xs text-white/50">Curated exclusively for <strong className="text-white">@_sparkwithin_hub_</strong></p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 shrink-0 scrollbar-none">
          {filterOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedThemeFilter(opt.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedThemeFilter === opt.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Quotes List */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {filteredQuotes.map((preset) => {
            const theme = THEMES[preset.theme];
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="w-full p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all text-left group flex flex-col gap-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10">
                      {theme?.name || preset.badge}
                    </span>
                    {preset.isOriginalSpark ? (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" />
                        Spark Within Original
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Verified Thinker
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                    Use Quote →
                  </span>
                </div>
                <p className="text-sm font-medium text-white/95 group-hover:text-white italic leading-relaxed">
                  "{preset.quote}"
                </p>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-white/60 font-semibold">— {preset.author}</p>
                  <span className="text-[10px] text-white/30 font-mono">Layout: {preset.layoutStyle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
