'use client';

import React from 'react';
import { Wand2, BookOpen, Quote as QuoteIcon, Dices, UserCheck, Eye, EyeOff } from 'lucide-react';
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
    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QuoteIcon className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Quote Content</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleQuote}
            className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 transition-colors font-medium cursor-pointer"
            title="Pick a random non-repeating viral quote from library"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Shuffle Quote</span>
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
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
        className="w-full bg-studio-900/80 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500 transition-colors resize-none"
      />

      {/* Author & Attribution Controls */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={author}
              onChange={(e) => onChangeAuthor(e.target.value)}
              placeholder="Author name (e.g. Marcus Aurelius, Spark Within)"
              className="w-full bg-studio-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Toggle Author Visibility (Pinterest clean signature vs Author Line) */}
          <button
            onClick={() => onToggleShowAuthor(!showAuthor)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showAuthor
                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
            }`}
            title={showAuthor ? 'Author line visible' : 'Author line hidden (Pinterest minimalist style)'}
          >
            {showAuthor ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAuthor ? 'Author: ON' : 'Pinterest Clean'}</span>
          </button>

          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !quote.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Matching Mood...' : 'AI Auto-Style'}</span>
          </button>
        </div>

        {/* Quick Attribution Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] text-white/40">Quick Attribution:</span>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Spark Within');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-amber-300 font-medium cursor-pointer"
          >
            Spark Within
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Marcus Aurelius');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/70 font-medium cursor-pointer"
          >
            Marcus Aurelius
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Seneca');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/70 font-medium cursor-pointer"
          >
            Seneca
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Friedrich Nietzsche');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-white/70 font-medium cursor-pointer"
          >
            Nietzsche
          </button>
          <button
            type="button"
            onClick={() => {
              onToggleShowAuthor(false);
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-rose-400 font-medium cursor-pointer"
          >
            None (Handle Only)
          </button>
        </div>
      </div>

      {detectedThemeBadge && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-white/40">Detected Mood:</span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
            {detectedThemeBadge}
          </span>
        </div>
      )}
    </div>
  );
};
