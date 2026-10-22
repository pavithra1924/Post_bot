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
    <div className="space-y-3 p-4 rounded-2xl bg-[#121212] border border-[#262626] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QuoteIcon className="w-4 h-4 text-[#E1306C]" />
          <span className="text-xs font-bold text-[#FAFAFA] uppercase tracking-wider">Quote Content</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleQuote}
            className="flex items-center gap-1 text-xs text-[#0095F6] hover:text-[#1877F2] transition-colors font-semibold cursor-pointer"
            title="Pick a random non-repeating viral quote from library"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Shuffle Quote</span>
          </button>
          <span className="text-[#363636]">•</span>
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1 text-xs text-[#E1306C] hover:text-[#FD1D1D] transition-colors font-semibold cursor-pointer"
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
        className="w-full bg-[#000000] border border-[#262626] rounded-xl p-3 text-sm text-[#FAFAFA] placeholder-[#737373] focus:outline-none focus:border-[#0095F6] transition-colors resize-none"
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
              className="w-full bg-[#000000] border border-[#262626] rounded-xl px-3 py-2 text-xs text-[#FAFAFA] placeholder-[#737373] focus:outline-none focus:border-[#0095F6] transition-colors"
            />
          </div>

          {/* Toggle Author Visibility */}
          <button
            onClick={() => onToggleShowAuthor(!showAuthor)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showAuthor
                ? 'bg-[#0095F6]/15 border-[#0095F6]/40 text-[#0095F6]'
                : 'bg-[#1c1c1e] border-[#262626] text-[#A8A8A8] hover:text-white'
            }`}
            title={showAuthor ? 'Author line visible' : 'Author line hidden (Minimalist style)'}
          >
            {showAuthor ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAuthor ? 'Author: ON' : 'Minimal Clean'}</span>
          </button>

          {/* AI Auto-Style in Instagram Gradient */}
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || !quote.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#dc2743]/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Matching Mood...' : 'AI Auto-Style'}</span>
          </button>
        </div>

        {/* Quick Attribution Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] text-[#737373]">Quick Attribution:</span>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Spark Within');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-[10px] text-[#0095F6] font-medium cursor-pointer"
          >
            Spark Within
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Marcus Aurelius');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-[10px] text-[#A8A8A8] hover:text-white font-medium cursor-pointer"
          >
            Marcus Aurelius
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Seneca');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-[10px] text-[#A8A8A8] hover:text-white font-medium cursor-pointer"
          >
            Seneca
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeAuthor('Friedrich Nietzsche');
              onToggleShowAuthor(true);
            }}
            className="px-2 py-0.5 rounded bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-[10px] text-[#A8A8A8] hover:text-white font-medium cursor-pointer"
          >
            Nietzsche
          </button>
          <button
            type="button"
            onClick={() => {
              onToggleShowAuthor(false);
            }}
            className="px-2 py-0.5 rounded bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-[10px] text-[#ED4956] font-medium cursor-pointer"
          >
            None (Handle Only)
          </button>
        </div>
      </div>

      {detectedThemeBadge && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-[#737373]">Detected Mood:</span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1c1c1e] text-[#0095F6] border border-[#262626] font-bold">
            {detectedThemeBadge}
          </span>
        </div>
      )}
    </div>
  );
};
