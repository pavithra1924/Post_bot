'use client';

import React from 'react';
import { THEMES, ThemeId } from '@/lib/themes';
import { Flame, BookOpen, Trees, Sparkles, SunMedium, CloudRain, Film, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  fire_sunset: <Flame className="w-4 h-4 text-amber-400" />,
  stoic_marble: <BookOpen className="w-4 h-4 text-yellow-500" />,
  emerald_forest: <Trees className="w-4 h-4 text-emerald-400" />,
  cosmic_galaxy: <Sparkles className="w-4 h-4 text-cyan-400" />,
  minimal_linen: <SunMedium className="w-4 h-4 text-rose-400" />,
  cyber_midnight: <CloudRain className="w-4 h-4 text-blue-400" />,
  vintage_journal: <Film className="w-4 h-4 text-orange-400" />,
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
        <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
          Visual Environment & Theme
        </label>
        <span className="text-[11px] text-amber-400 font-mono">7 Distinct Worlds</span>
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
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-[#1c1c1e] border-[#0095F6] shadow-md shadow-[#0095F6]/10'
                  : 'bg-[#000000] border-[#262626] hover:bg-[#181818]'
              }`}
            >
              <div className="mt-0.5 p-2 rounded-lg bg-[#121212] border border-[#262626] shrink-0">
                {THEME_ICONS[themeKey] || <Sparkles className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight truncate">
                    {theme.name}
                  </span>
                  {isActive && (
                    <span className="w-4 h-4 rounded-full bg-[#0095F6] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-white/50 mt-1 line-clamp-1">{theme.tagline}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-white/60 font-mono">
                    {theme.primaryFont}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
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
