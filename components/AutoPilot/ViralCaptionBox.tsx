'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Hash, MessageSquare, Flame } from 'lucide-react';
import { ViralCaptionResult } from '@/lib/captionGenerator';

interface ViralCaptionBoxProps {
  captionData: ViralCaptionResult | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const ViralCaptionBox: React.FC<ViralCaptionBoxProps> = ({
  captionData,
  isGenerating,
  onGenerate,
}) => {
  const [activeTab, setActiveTab] = useState<'caption' | 'firstComment'>('caption');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedComment, setCopiedComment] = useState(false);

  const handleCopyCaption = () => {
    if (!captionData?.fullCaption) return;
    navigator.clipboard.writeText(captionData.fullCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyComment = () => {
    if (!captionData?.firstComment) return;
    navigator.clipboard.writeText(captionData.firstComment);
    setCopiedComment(true);
    setTimeout(() => setCopiedComment(false), 2000);
  };

  if (!captionData) {
    return (
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-white/70 text-xs font-bold">
          <Hash className="w-4 h-4 text-amber-400" />
          <span>Deep Viral Caption & 50+ Hashtags Engine</span>
        </div>
        <p className="text-[11px] text-white/50 max-w-sm mx-auto">
          Generates a multi-paragraph psychological breakdown, actionable challenge, and 50+ hashtags (30 in caption + 22 in first comment).
        </p>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2 mx-auto"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Writing Deep Caption...' : 'Generate 50+ Hashtag Caption'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-studio-900 border border-white/10 space-y-3.5 shadow-xl">
      {/* Header with 50+ Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Viral Post Copy
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
            🔥 {captionData.totalHashtagsCount || 52} Total Hashtags
          </span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
        >
          <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
        </button>
      </div>

      {/* Dual Tabs: Main Caption (30 Tags) vs First Comment (22 Tags) */}
      <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('caption')}
          className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'caption'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Main Caption ({captionData.captionHashtags?.length || 30} Tags)</span>
        </button>

        <button
          onClick={() => setActiveTab('firstComment')}
          className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'firstComment'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>First Comment Booster ({captionData.firstCommentHashtags?.length || 22} Tags)</span>
        </button>
      </div>

      {/* Content Preview */}
      {activeTab === 'caption' ? (
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 max-h-56 overflow-y-auto text-xs text-white/80 whitespace-pre-line leading-relaxed font-sans scrollbar-thin">
            {captionData.fullCaption}
          </div>
          <button
            onClick={handleCopyCaption}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
            <span>{copiedCaption ? 'Copied Full Caption to Clipboard!' : 'Copy Caption (with 30 Hashtags)'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 max-h-56 overflow-y-auto text-xs text-white/80 whitespace-pre-line leading-relaxed font-sans scrollbar-thin">
            {captionData.firstComment}
          </div>
          <button
            onClick={handleCopyComment}
            className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedComment ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedComment ? 'Copied Comment Booster to Clipboard!' : 'Copy First Comment (with 22 Booster Tags)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
