'use client';

import React from 'react';
import { Sparkles, Key, RotateCcw, Send, LayoutTemplate, Calendar, Globe } from 'lucide-react';

interface HeaderProps {
  currentTab: 'studio' | 'autopilot' | 'video' | 'tamil' | 'avatar-demo';
  onChangeTab: (tab: 'studio' | 'autopilot' | 'video' | 'tamil' | 'avatar-demo') => void;
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
    <header className="border-b border-white/10 bg-studio-950/85 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">InstaQuote AI</h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-white/50 hidden sm:block">Aesthetic Canva-Grade Posts, Auto-Pilot & Video Reels</p>
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 flex-wrap gap-0.5">
          <button
            onClick={() => onChangeTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'studio'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/10'
                : 'text-white/60 hover:text-white'
            }`}
            title="English Quotes Post Studio (Canva & Pinterest Aesthetics)"
          >
            <span>🇺🇸</span>
            <span>English Studio</span>
          </button>

          <button
            onClick={() => onChangeTab('tamil')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'tamil'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-amber-500/20'
                : 'text-white/60 hover:text-white'
            }`}
            title="Tamil Quotes Post Studio (40+ Curated Quotes & 52 Hashtags)"
          >
            <span className="text-amber-400 font-bold">🌾</span>
            <span>தமிழ் Studio</span>
          </button>

          <button
            onClick={() => onChangeTab('autopilot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'autopilot'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/10'
                : 'text-white/60 hover:text-white'
            }`}
            title="7-Day Content Auto-Pilot for both English and Tamil"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Auto-Pilot</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/15 text-amber-300 font-mono">EN+தமிழ்</span>
          </button>

          <button
            onClick={() => onChangeTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'video'
                ? 'bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 text-white shadow-md shadow-purple-500/10'
                : 'text-white/60 hover:text-white'
            }`}
            title="Cartoon Motivational Reels Studio for both English and Tamil"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>🎬 Video Reels</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/15 text-purple-300 font-mono">EN+தமிழ்</span>
          </button>

          {/* Dedicated Lip-Sync Trial Tab */}
          <button
            onClick={() => onChangeTab('avatar-demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'avatar-demo'
                ? 'bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 text-white shadow-md shadow-rose-500/30'
                : 'text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20'
            }`}
            title="AI Photo Talking Avatar Lip-Sync Trial Demo (Aanya character)"
          >
            <span>👧✨</span>
            <span className="font-bold">Lip-Sync Demo</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 border border-rose-500/40 font-mono">
              TRIAL
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Share App Link / Multi-User Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Share app with mobile phones & team"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Share App</span>
          </button>

          {/* Post to Instagram Button */}
          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Publish directly to Instagram"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Post to Instagram</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{hasApiKey ? 'Gemini API Connected' : 'Gemini Key'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset to defaults"
            className="p-2 rounded-xl text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
