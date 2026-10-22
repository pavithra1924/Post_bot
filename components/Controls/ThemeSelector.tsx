'use client';

import React from 'react';
import { THEMES, ThemeId } from '@/lib/themes';
import { Flame, BookOpen, Trees, Sparkles, SunMedium, CloudRain, Film, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  fire_sunset: <Flame className="w-4 h-4 text-amber-500" />,
  stoic_marble: <BookOpen className="w-4 h-4 text-yellow-600" />,
  emerald_forest: <Trees className="w-4 h-4 text-emerald-600" />,
  cosmic_galaxy: <Sparkles className="w-4 h-4 text-indigo-500" />,
  minimal_linen: <SunMedium className="w-4 h-4 text-rose-500" />,
  cyber_midnight: <CloudRain className="w-4 h-4 text-blue-500" />,
  vintage_journal: <Film className="w-4 h-4 text-amber-700" />,
};

// Distinct 7 Environment Keys
const ENVIRONMENT_KEYS: ThemeId[] = [
  'fire_sunset',
  'stoic_marble',
  'emerald_forest',
  'cosmic_galaxy',
  'minimal_linen',
  'cyber_midnight',
  'vintage_journal',
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelectTheme }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold tracking-wider text-slate-800 uppercase">
          Visual Environment & Theme
        </label>
        <span className="text-[11px] text-amber-600 font-bold font-mono">7 Distinct Worlds</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ENVIRONMENT_KEYS.map((themeKey) => {
          const theme = THEMES[themeKey];
          if (!theme) return null;
          const isActive = currentTheme === themeKey;
          return (
            <button
              key={themeKey}
              onClick={() => onSelectTheme(themeKey)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                isActive
                  ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-1 ring-amber-300'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="mt-0.5 p-2 rounded-lg bg-white border border-slate-200/90 shadow-xs shrink-0">
                {THEME_ICONS[themeKey] || <Sparkles className="w-4 h-4 text-slate-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                    {theme.name}
                  </span>
                  {isActive && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{theme.tagline}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                    {theme.primaryFont}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-xs"
                    style={{ backgroundColor: theme.accentColor }}
                    title={`Accent: ${theme.accentColor}`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
