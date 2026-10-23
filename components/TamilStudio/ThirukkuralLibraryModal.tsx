'use client';

import React, { useState, useMemo } from 'react';
import {
  THIRUKKURAL_LIBRARY,
  TAMIL_WISDOM_CATEGORIES,
  ThirukkuralItem,
} from '@/lib/tamilWisdomLibrary';
import {
  X,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  Check,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ThirukkuralLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKural: (kural: ThirukkuralItem) => void;
  onOpenCarouselWithKural?: (kural: ThirukkuralItem) => void;
}

export const ThirukkuralLibraryModal: React.FC<ThirukkuralLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectKural,
  onOpenCarouselWithKural,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedKuralId, setSelectedKuralId] = useState<string | null>(null);

  const filteredKurals = useMemo(() => {
    return THIRUKKURAL_LIBRARY.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesText =
        item.verse.toLowerCase().includes(q) ||
        item.simpleExplanation.toLowerCase().includes(q) ||
        item.chapter.toLowerCase().includes(q) ||
        item.number.toString().includes(q) ||
        item.hookTitle.toLowerCase().includes(q);

      return matchesCategory && matchesText;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleApply = (kural: ThirukkuralItem) => {
    setSelectedKuralId(kural.id);
    onSelectKural(kural);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl relative max-h-[92vh] flex flex-col text-slate-900 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-50/50 via-rose-50/30 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  திருக்குறள் வாழ்வியல் நூலகம்
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {THIRUKKURAL_LIBRARY.length} தேர்ந்தெடுக்கப்பட்ட குறள்கள்
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ஆசிரியர்: <strong>திருவள்ளுவர்</strong> • தொகுப்பு: <strong>Spark Within</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-white">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="குறள் எண், சொல், அதிகாரம் அல்லது விளக்கம் தேடுக... (எ.கா: 619, முயற்சி, நட்பு)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-500/10 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {TAMIL_WISDOM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kural Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {filteredKurals.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm font-semibold text-slate-700">பொருத்தமான குறள் கிடைக்கவில்லை</p>
              <p className="text-xs text-slate-500">வேறு சொற்களைக் கொண்டு தேடவும் அல்லது அனைத்து வகைகளையும் பார்க்கவும்.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                வடிகட்டியை மீட்டமை (Reset Filter)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKurals.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Badge & Chapter */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center gap-1">
                        <span>💎</span>
                        <span>வாழ்வியல் தத்துவம்</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        குறள் #{item.number} • {item.chapter}
                      </span>
                    </div>

                    {/* Hook Title */}
                    <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {item.hookTitle}
                    </p>

                    {/* The 2-Line Couplet (Left Aligned) */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-left">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 whitespace-pre-line leading-relaxed font-sans text-left">
                        {item.verse}
                      </p>
                      <div className="pt-2 text-left">
                        <span className="text-[11px] font-semibold text-amber-700">
                          — {item.author}
                        </span>
                      </div>
                    </div>

                    {/* Simple Practical Meaning */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        வாழ்வியல் உரை:
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed text-left">
                        {item.simpleExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleApply(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white font-bold text-xs shadow-xs transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>இந்த குறளைப் பயன்படுத்து (Use in Studio)</span>
                    </button>

                    {onOpenCarouselWithKural && (
                      <button
                        onClick={() => {
                          onOpenCarouselWithKural(item);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Create 5-Slide Instagram Carousel Pack"
                      >
                        <Layers className="w-4 h-4 text-indigo-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
