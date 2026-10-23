'use client';

import React from 'react';
import { Wand2, BookOpen, Quote as QuoteIcon, Dices, Eye, EyeOff } from 'lucide-react';
import { PRESET_QUOTES } from '@/lib/presets';

interface QuoteInputProps {
  quote: string;
  onChangeQuote: (quote: string) => void;
  author: string;
  onChangeAuthor: (author: string) => void;
  showAuthor: boolean;
  onToggleShowAuthor: (show: boolean) => void;
  onAnalyze: () => void;
  onOpenPresets: () => void;
  isAnalyzing: boolean;
  detectedThemeBadge?: string;
}

export const QuoteInput: React.FC<QuoteInputProps> = ({
  quote,
  onChangeQuote,
  author,
  onChangeAuthor,
  showAuthor,
  onToggleShowAuthor,
  onAnalyze,
  onOpenPresets,
  isAnalyzing,
  detectedThemeBadge,
}) => {
  // Quick shuffle from 35+ non-repeating quotes
  const handleShuffleQuote = () => {
    const available = PRESET_QUOTES.filter(q => q.quote !== quote);
    if (available.length > 0) {
      const chosen = available[Math.floor(Math.random() * available.length)];
      onChangeQuote(chosen.quote);
      onChangeAuthor(chosen.author);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
            <QuoteIcon className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quote Content</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleQuote}
            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 transition-colors font-semibold cursor-pointer"
            title="Pick a random non-repeating quote from library"
          >
            <Dices className="w-3.5 h-3.5 text-amber-500" />
            <span>Shuffle Quote</span>
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 transition-colors font-semibold cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-500" />
            <span>35+ Library</span>
          </button>
        </div>
      </div>

      {/* Quote Textarea */}
      <textarea
        rows={3}
        value={quote}
        onChange={(e) => onChangeQuote(e.target.value)}
        placeholder="Enter quote text here..."
        className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none leading-relaxed"
      />

      {/* Author & Attribution Controls */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={author}
              onChange={(e) => onChangeAuthor(e.target.value)}
              placeholder="Author name (e.g. திருவள்ளுவர், Marcus Aurelius, பாரதியார்)"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
            />
          </div>

          {/* Toggle Author Visibility */}
          <button
            onClick={() => onToggleShowAuthor(!showAuthor)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showAuthor
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/70'
            }`}
            title={showAuthor ? 'Author line visible' : 'Author line hidden (Minimalist style)'}
          >
            {showAuthor ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showAuthor ? 'Author: ON' : 'Minimal Clean'}</span>
          </button>

          {/* AI Auto-Style in Positive Radiant Gradient */}
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !quote.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-rose-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Matching Mood...' : 'AI Auto-Style'}</span>
          </button>
        </div>

        {/* Quick Attribution Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] text-slate-400 font-medium">Quick Authors:</span>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('திருவள்ளுவர்');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-[10px] text-amber-800 font-semibold cursor-pointer transition-colors"
          >
            திருவள்ளுவர்
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('மகாகவி பாரதியார்');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] text-slate-700 font-medium cursor-pointer transition-colors"
          >
            பாரதியார்
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Marcus Aurelius');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] text-slate-700 font-medium cursor-pointer transition-colors"
          >
            Marcus Aurelius
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Seneca');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] text-slate-700 font-medium cursor-pointer transition-colors"
          >
            Seneca
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Friedrich Nietzsche');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] text-slate-700 font-medium cursor-pointer transition-colors"
          >
            Nietzsche
          </button>
          <button
            type="button"
            onClick={() => {
              onToggleShowAuthor(false);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] text-rose-600 font-semibold cursor-pointer transition-colors"
          >
            None (Handle Only)
          </button>
        </div>
      </div>

      {detectedThemeBadge && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400 font-medium">Detected Mood:</span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
            {detectedThemeBadge}
          </span>
        </div>
      )}
    </div>
  );
};
