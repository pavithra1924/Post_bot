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
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-center space-y-3 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-slate-800 text-xs font-bold">
          <Hash className="w-4 h-4 text-amber-500" />
          <span>Deep Viral Caption & 50+ Hashtags Engine</span>
        </div>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
          Generates a multi-paragraph psychological breakdown, actionable challenge, and 50+ hashtags (30 in caption + 22 in first comment).
        </p>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-rose-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2 mx-auto"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Writing Deep Caption...' : 'Generate 50+ Hashtag Caption'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3.5 shadow-sm">
      {/* Header with 50+ Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            Viral Post Copy
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
            🔥 {captionData.totalHashtagsCount || 52} Total Hashtags
          </span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="text-[11px] text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer font-bold"
        >
          <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
        </button>
      </div>

      {/* Dual Tabs: Main Caption (30 Tags) vs First Comment (22 Tags) */}
      <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('caption')}
          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'caption'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Main Caption ({captionData.captionHashtags?.length || 30} Tags)</span>
        </button>

        <button
          onClick={() => setActiveTab('firstComment')}
          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'firstComment'
              ? 'bg-gradient-to-r from-rose-500 to-indigo-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>First Comment ({captionData.firstCommentHashtags?.length || 22} Tags)</span>
        </button>
      </div>

      {/* Content Preview */}
      {activeTab === 'caption' ? (
        <div className="space-y-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 max-h-56 overflow-y-auto text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans scrollbar-thin">
            {captionData.fullCaption}
          </div>
          <button
            onClick={handleCopyCaption}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-600" />}
            <span>{copiedCaption ? 'Copied Full Caption to Clipboard!' : 'Copy Caption (with 30 Hashtags)'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 max-h-56 overflow-y-auto text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans scrollbar-thin">
            {captionData.firstComment}
          </div>
          <button
            onClick={handleCopyComment}
            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {copiedComment ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-rose-500" />}
            <span>{copiedComment ? 'Copied Comment Booster to Clipboard!' : 'Copy First Comment (with 22 Booster Tags)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
