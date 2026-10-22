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
      <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626] text-center space-y-3 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-[#FAFAFA] text-xs font-bold">
          <Hash className="w-4 h-4 text-[#0095F6]" />
          <span>Deep Viral Caption & 50+ Hashtags Engine</span>
        </div>
        <p className="text-[11px] text-[#A8A8A8] max-w-sm mx-auto">
          Generates a multi-paragraph psychological breakdown, actionable challenge, and 50+ hashtags (30 in caption + 22 in first comment).
        </p>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#dc2743]/20 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2 mx-auto"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Writing Deep Caption...' : 'Generate 50+ Hashtag Caption'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-[#121212] border border-[#262626] space-y-3.5 shadow-xl">
      {/* Header with 50+ Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#E1306C]" />
            Viral Post Copy
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#0095F6]/15 border border-[#0095F6]/30 text-[10px] font-bold text-[#0095F6]">
            🔥 {captionData.totalHashtagsCount || 52} Total Hashtags
          </span>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="text-[11px] text-[#0095F6] hover:text-[#1877F2] transition-colors flex items-center gap-1 cursor-pointer font-semibold"
        >
          <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
        </button>
      </div>

      {/* Dual Tabs: Main Caption (30 Tags) vs First Comment (22 Tags) */}
      <div className="flex items-center p-1 rounded-xl bg-[#000000] border border-[#262626] gap-1 text-xs">
        <button
          onClick={() => setActiveTab('caption')}
          className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'caption'
              ? 'bg-[#0095F6] text-white shadow-md'
              : 'text-[#A8A8A8] hover:text-white'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Main Caption ({captionData.captionHashtags?.length || 30} Tags)</span>
        </button>

        <button
          onClick={() => setActiveTab('firstComment')}
          className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'firstComment'
              ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md'
              : 'text-[#A8A8A8] hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>First Comment Booster ({captionData.firstCommentHashtags?.length || 22} Tags)</span>
        </button>
      </div>

      {/* Content Preview */}
      {activeTab === 'caption' ? (
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-[#000000] border border-[#262626] max-h-56 overflow-y-auto text-xs text-[#FAFAFA] whitespace-pre-line leading-relaxed font-sans scrollbar-thin">
            {captionData.fullCaption}
          </div>
          <button
            onClick={handleCopyCaption}
            className="w-full py-2.5 rounded-xl bg-[#1c1c1e] hover:bg-[#262626] border border-[#262626] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#0095F6]" />}
            <span>{copiedCaption ? 'Copied Full Caption to Clipboard!' : 'Copy Caption (with 30 Hashtags)'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-[#000000] border border-[#262626] max-h-56 overflow-y-auto text-xs text-[#FAFAFA] whitespace-pre-line leading-relaxed font-sans scrollbar-thin">
            {captionData.firstComment}
          </div>
          <button
            onClick={handleCopyComment}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 hover:from-[#f09433]/30 hover:via-[#dc2743]/30 hover:to-[#bc1888]/30 border border-[#dc2743]/40 text-[#FAFAFA] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedComment ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E1306C]" />}
            <span>{copiedComment ? 'Copied Comment Booster to Clipboard!' : 'Copy First Comment (with 22 Booster Tags)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
