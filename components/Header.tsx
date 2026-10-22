'use client';

import React from 'react';
import { Sparkles, Key, RotateCcw, Send, Calendar, Globe } from 'lucide-react';

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
    <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand: Positive Elegant Studio */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-[2px] shadow-md shadow-rose-500/20 shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                InstaQuote <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 font-serif italic">Studio</span>
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Inspiring Aesthetic Quotes, Stories & Motivational 9:16 Reels
            </p>
          </div>
        </div>

        {/* Center: Bright Elegant Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 flex-wrap gap-1">
          <button
            onClick={() => onChangeTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'studio'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
            title="English Quotes Post Studio (Pinterest & Instagram Aesthetics)"
          >
            <span>📸</span>
            <span>Feed Post</span>
          </button>

          <button
            onClick={() => onChangeTab('tamil')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'tamil'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
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
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
            title="7-Day Content Auto-Pilot for both English and Tamil"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Auto-Pilot</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 font-bold">7 Days</span>
          </button>

          <button
            onClick={() => onChangeTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'video'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
            title="Instagram 9:16 Video Reels with synchronized voice and music"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>🎬 Reels Studio</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-700 font-bold">9:16 HD</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Post to Instagram (Positive Warm Gradient Button) */}
          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 cursor-pointer"
            title="Publish directly to Instagram"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post to IG</span>
          </button>

          {/* Share App Link Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Share app link with mobile devices & team"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              hasApiKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{hasApiKey ? 'Gemini Key' : 'Gemini Key'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset to defaults"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
