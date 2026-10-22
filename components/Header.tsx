'use client';

import React from 'react';
import { Sparkles, Key, RotateCcw, Send, LayoutTemplate, Calendar, Globe } from 'lucide-react';

interface HeaderProps {
  currentTab: 'studio' | 'autopilot' | 'video' | 'tamil';
  onChangeTab: (tab: 'studio' | 'autopilot' | 'video' | 'tamil') => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenPublishModal: () => void;
  onOpenShareModal: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onChangeTab,
  hasApiKey,
  onOpenApiKeyModal,
  onOpenPublishModal,
  onOpenShareModal,
  onReset,
}) => {
  return (
    <header className="border-b border-[#262626] bg-[#000000]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand: Instagram Studio */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] shadow-lg shadow-[#dc2743]/20 shrink-0">
            <div className="w-full h-full bg-[#000000] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight font-serif italic">
                InstaQuote
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
                INSTAGRAM
              </span>
            </div>
            <p className="text-[11px] text-[#A8A8A8] hidden sm:block">Aesthetic Posts, Story Passages & 9:16 Video Reels</p>
          </div>
        </div>

        {/* Center: Mode Switcher (Instagram App Navigation) */}
        <div className="flex items-center p-1 rounded-2xl bg-[#121212] border border-[#262626] flex-wrap gap-1">
          <button
            onClick={() => onChangeTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'studio'
                ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/20 font-bold'
                : 'text-[#A8A8A8] hover:text-white hover:bg-[#1c1c1e]'
            }`}
            title="English Quotes Post Studio (Instagram & Pinterest Aesthetics)"
          >
            <span>📸</span>
            <span>Feed Post</span>
          </button>

          <button
            onClick={() => onChangeTab('tamil')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'tamil'
                ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/20 font-bold'
                : 'text-[#A8A8A8] hover:text-white hover:bg-[#1c1c1e]'
            }`}
            title="Tamil Quotes Post Studio (40+ Curated Quotes & 52 Hashtags)"
          >
            <span>🌾</span>
            <span>தமிழ் Post</span>
          </button>

          <button
            onClick={() => onChangeTab('autopilot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'autopilot'
                ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/20 font-bold'
                : 'text-[#A8A8A8] hover:text-white hover:bg-[#1c1c1e]'
            }`}
            title="7-Day Content Auto-Pilot for both English and Tamil"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Auto-Pilot</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/15 text-amber-300 font-mono">EN+தமிழ்</span>
          </button>

          <button
            onClick={() => onChangeTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'video'
                ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/20 font-bold'
                : 'text-[#A8A8A8] hover:text-white hover:bg-[#1c1c1e]'
            }`}
            title="Instagram 9:16 Video Reels with synchronized voice and music"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>🎬 Reels Studio</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/15 text-purple-300 font-mono">9:16 HD</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Post to Instagram (Official Instagram Blue Button) */}
          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold transition-all shadow-md shadow-[#0095F6]/25 cursor-pointer"
            title="Publish directly to Instagram"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post to IG</span>
          </button>

          {/* Share App Link Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-[#A8A8A8] hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="Share app with mobile phones & team"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-[#1c1c1e] text-[#A8A8A8] border-[#262626] hover:bg-[#262626] hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{hasApiKey ? 'Gemini Key' : 'Gemini Key'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset to defaults"
            className="p-2 rounded-xl text-[#A8A8A8] hover:text-white bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
