'use client';

import React from 'react';
import { ThemeId } from '@/lib/themes';
import { Plus, Sparkles, Film } from 'lucide-react';

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
    <div className="w-full bg-[#000000] border-b border-[#262626] py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {/* User's Profile Story with Plus Icon */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="w-16 h-16 sm:w-17 sm:h-17 rounded-full p-[2.5px] bg-[#262626] group-hover:bg-[#363636] transition-colors">
              <div className="w-full h-full rounded-full bg-[#141414] border-2 border-black flex items-center justify-center text-xs font-black text-white">
                SW
              </div>
            </div>
            {/* Blue Plus Badge */}
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0095F6] border-2 border-black flex items-center justify-center text-white shadow-md">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#A8A8A8] group-hover:text-white transition-colors truncate max-w-[70px]">
            Your Story
          </span>
        </div>

        {/* Stories Highlight Carousel with iconic Instagram Gradient Ring */}
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
                className={`w-16 h-16 sm:w-17 sm:h-17 rounded-full p-[2.5px] transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-[#dc2743]/20 ring-2 ring-white/20'
                    : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-90 group-hover:opacity-100 group-hover:scale-105'
                }`}
              >
                <div className="w-full h-full rounded-full bg-[#121212] border-2 border-black flex items-center justify-center text-xl shadow-inner group-hover:bg-[#1a1a1a] transition-colors">
                  <span>{story.emoji}</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-medium transition-colors truncate max-w-[75px] ${
                  isActive ? 'text-white font-bold' : 'text-[#A8A8A8] group-hover:text-white'
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
