'use client';

import React from 'react';
import { ThemeId } from '@/lib/themes';
import { Plus } from 'lucide-react';

interface InstagramStoriesBarProps {
  currentThemeId: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
  onOpenVideoTab: () => void;
  onOpenTamilTab: () => void;
  handle: string;
}

interface StoryItem {
  id: string;
  name: string;
  emoji: string;
  themeId?: ThemeId;
  action?: 'video' | 'tamil' | 'theme';
}

const STORIES: StoryItem[] = [
  {
    id: 'tamil',
    name: 'தமிழ் Spark',
    emoji: '🌾',
    action: 'tamil',
  },
  {
    id: 'reels',
    name: 'Story Reels',
    emoji: '🎬',
    action: 'video',
  },
  {
    id: 'fire_sunset',
    name: 'Inner Fire',
    emoji: '🔥',
    themeId: 'fire_sunset',
    action: 'theme',
  },
  {
    id: 'stoic_marble',
    name: 'Stoic Mind',
    emoji: '🧘',
    themeId: 'stoic_marble',
    action: 'theme',
  },
  {
    id: 'cosmic_galaxy',
    name: 'Cosmic Sky',
    emoji: '🌌',
    themeId: 'cosmic_galaxy',
    action: 'theme',
  },
  {
    id: 'emerald_forest',
    name: 'Emerald Zen',
    emoji: '🌿',
    themeId: 'emerald_forest',
    action: 'theme',
  },
  {
    id: 'vintage_journal',
    name: 'Vintage Tale',
    emoji: '📜',
    themeId: 'vintage_journal',
    action: 'theme',
  },
  {
    id: 'minimal_linen',
    name: 'Minimalist',
    emoji: '✨',
    themeId: 'minimal_linen',
    action: 'theme',
  },
];

export const InstagramStoriesBar: React.FC<InstagramStoriesBarProps> = ({
  currentThemeId,
  onSelectTheme,
  onOpenVideoTab,
  onOpenTamilTab,
  handle,
}) => {
  return (
    <div className="w-full bg-white/70 backdrop-blur-md border-b border-slate-200/80 py-3 px-4 sm:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {/* User's Profile Story with Positive Plus Icon */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="w-16 h-16 sm:w-17 sm:h-17 rounded-full p-[2.5px] bg-slate-200 group-hover:bg-slate-300 transition-colors shadow-sm">
              <div className="w-full h-full rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-xs font-black text-slate-800">
                SW
              </div>
            </div>
            {/* Positive Radiant Plus Badge */}
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors truncate max-w-[70px]">
            Your Story
          </span>
        </div>

        {/* Stories Highlight Carousel with Radiant Positive Gradient Rings */}
        {STORIES.map((story) => {
          const isActive = story.themeId === currentThemeId;

          const handleClick = () => {
            if (story.action === 'video') {
              onOpenVideoTab();
            } else if (story.action === 'tamil') {
              onOpenTamilTab();
            } else if (story.themeId) {
              onSelectTheme(story.themeId);
            }
          };

          return (
            <button
              key={story.id}
              onClick={handleClick}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group transition-transform active:scale-95"
            >
              <div
                className={`w-16 h-16 sm:w-17 sm:h-17 rounded-full p-[2.5px] transition-all shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 ring-2 ring-rose-400/40 shadow-md shadow-rose-500/15'
                    : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 opacity-90 group-hover:opacity-100 group-hover:scale-105'
                }`}
              >
                <div className="w-full h-full rounded-full bg-white border-2 border-white flex items-center justify-center text-xl shadow-xs group-hover:bg-amber-50/50 transition-colors">
                  <span>{story.emoji}</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-semibold transition-colors truncate max-w-[75px] ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
                }`}
              >
                {story.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
