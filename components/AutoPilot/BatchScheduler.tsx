'use client';

import React, { useState } from 'react';
import { getNonRepeatingWeek, PRESET_QUOTES } from '@/lib/presets';
import { getNonRepeatingTamilWeek, TAMIL_PRESET_QUOTES } from '@/lib/tamilPresets';
import { generateTamilViralCaption, TamilCaptionResult } from '@/lib/tamilCaptionGenerator';
import { THEMES, ThemeId } from '@/lib/themes';
import { LayoutStyle, AspectRatio } from '@/lib/canvasRenderer';
import { Calendar, Sparkles, ArrowRight, Dices, Send, RefreshCw, Flame, Check, ShieldCheck, UserCheck, Film } from 'lucide-react';
import { generateViralCaption, ViralCaptionResult } from '@/lib/captionGenerator';
import { BatchCardCanvas } from './BatchCardCanvas';

export interface ScheduledDayPost {
  day: string;
  quote: string;
  author: string;
  isOriginalSpark?: boolean;
  theme: ThemeId;
  badge: string;
  layoutStyle: LayoutStyle;
  backgroundImage: string;
  caption: ViralCaptionResult | null;
  tamilCaption?: TamilCaptionResult | null;
  language?: 'en' | 'ta';
  explanationTamil?: string;
}

interface BatchSchedulerProps {
  onLoadPostToStudio: (post: ScheduledDayPost) => void;
  onOpenPublishModal: (imageUrl: string, caption: string) => void;
  onSendToVideoStudio?: (quote: string, author: string) => void;
}

export const BatchScheduler: React.FC<BatchSchedulerProps> = ({
  onLoadPostToStudio,
  onOpenPublishModal,
  onSendToVideoStudio,
}) => {
  const [scheduleLang, setScheduleLang] = useState<'ta' | 'en'>('ta');
  const [seedOffset, setSeedOffset] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [showAuthorAttribution, setShowAuthorAttribution] = useState(true);

  // Helper to build schedule for either Tamil or English
  const buildSchedule = (lang: 'ta' | 'en', offset: number): ScheduledDayPost[] => {
    if (lang === 'ta') {
      const tamilWeek = getNonRepeatingTamilWeek(offset);
      const themeSequence: ThemeId[] = [
        'fire_sunset',
        'stoic_marble',
        'minimal_linen',
        'cyber_midnight',
        'vintage_journal',
        'fire_sunset',
        'stoic_marble'
      ];
      return tamilWeek.map((item, idx) => {
        const tId = themeSequence[idx % themeSequence.length];
        const theme = THEMES[tId];
        const bg = theme.fallbackImages[(offset + idx) % theme.fallbackImages.length] || theme.fallbackImages[0];
        const layout: LayoutStyle = (item.layoutStyle === 'luxury-gold' ? 'pinterest-luxury' :
          item.layoutStyle === 'frosted-glass' ? 'glass-card' :
          item.layoutStyle === 'magazine-frame' ? 'editorial-frame' : 'centered-hero') as LayoutStyle;

        return {
          day: item.day,
          quote: item.quote,
          author: item.author,
          isOriginalSpark: false,
          theme: tId,
          badge: item.categoryTamil,
          layoutStyle: layout,
          backgroundImage: bg,
          caption: null,
          language: 'ta',
          explanationTamil: item.explanationTamil,
        };
      });
    } else {
      const baseWeek = getNonRepeatingWeek(offset);
      return baseWeek.map((item, idx) => {
        const theme = THEMES[item.theme];
        const bg = theme.fallbackImages[idx % theme.fallbackImages.length];
        return {
          ...item,
          backgroundImage: bg,
          caption: null,
          language: 'en',
        };
      });
    }
  };

  // Initialize schedule with Tamil as default
  const [schedule, setSchedule] = useState<ScheduledDayPost[]>(() => buildSchedule('ta', 0));
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Switch language mode
  const handleSwitchLanguage = (newLang: 'ta' | 'en') => {
    setScheduleLang(newLang);
    setSchedule(buildSchedule(newLang, seedOffset));
  };

  // Shuffle entire week: advances seed offset and picks 7 completely fresh non-repeating quotes
  const handleShuffleEntireWeek = () => {
    const nextOffset = seedOffset + 1;
    setSeedOffset(nextOffset);
    setSchedule(buildSchedule(scheduleLang, nextOffset));
  };

  // Auto-generate viral captions for all 7 days
  const handleGenerateAllCaptions = async () => {
    setIsGeneratingAll(true);
    try {
      const updated = await Promise.all(
        schedule.map(async (item) => {
          if (item.language === 'ta') {
            const tamResult = generateTamilViralCaption({
              id: `sched-${item.day}`,
              quote: item.quote,
              author: item.author,
              category: 'wisdom',
              categoryTamil: item.badge,
              explanationTamil: item.explanationTamil || 'தன்னம்பிக்கை மற்றும் விடாமுயற்சிக்கான வாழ்வியல் தத்துவம்.',
              bgKeyword: 'gold'
            });
            const viralCap: ViralCaptionResult = {
              hook: tamResult.hook,
              explanation: tamResult.explanation,
              insight: tamResult.explanation,
              actionChallenge: tamResult.actionChallenge,
              cta: tamResult.cta,
              captionHashtags: tamResult.captionHashtags,
              hashtags: tamResult.captionHashtags,
              firstCommentHashtags: tamResult.firstCommentHashtags,
              totalHashtagsCount: tamResult.totalHashtagsCount,
              fullCaption: tamResult.fullCaption,
              firstComment: tamResult.firstComment,
            };
            return { ...item, caption: viralCap, tamilCaption: tamResult };
          } else {
            const caption = await generateViralCaption(item.quote, item.author, item.theme);
            return { ...item, caption };
          }
        })
      );
      setSchedule(updated);
    } catch (err) {
      console.error('Batch caption generation error:', err);
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // Re-roll a single day's quote
  const handleRerollDay = (index: number) => {
    setSchedule((prev) => {
      const copy = [...prev];
      const current = copy[index];

      if (current.language === 'ta') {
        const pool = TAMIL_PRESET_QUOTES.filter((q) => q.quote !== current.quote);
        const chosen = pool[Math.floor(Math.random() * pool.length)] || TAMIL_PRESET_QUOTES[0];
        const theme = THEMES[current.theme];
        const otherBgs = theme.fallbackImages.filter((bg) => bg !== current.backgroundImage);
        const chosenBg = otherBgs.length > 0 ? otherBgs[Math.floor(Math.random() * otherBgs.length)] : theme.fallbackImages[0];

        copy[index] = {
          ...current,
          quote: chosen.quote,
          author: chosen.author,
          badge: chosen.categoryTamil,
          explanationTamil: chosen.explanationTamil,
          backgroundImage: chosenBg,
          caption: null,
          tamilCaption: null,
        };
      } else {
        const themeQuotes = PRESET_QUOTES.filter((q) => q.theme === current.theme);
        const nextQuotes = themeQuotes.filter((q) => q.quote !== current.quote);
        const chosenQuote = nextQuotes.length > 0
          ? nextQuotes[Math.floor(Math.random() * nextQuotes.length)]
          : themeQuotes[0];

        const theme = THEMES[current.theme];
        const otherBgs = theme.fallbackImages.filter((bg) => bg !== current.backgroundImage);
        const chosenBg = otherBgs.length > 0
          ? otherBgs[Math.floor(Math.random() * otherBgs.length)]
          : theme.fallbackImages[0];

        copy[index] = {
          ...current,
          quote: chosenQuote.quote,
          author: chosenQuote.author,
          isOriginalSpark: chosenQuote.isOriginalSpark,
          badge: chosenQuote.badge,
          layoutStyle: chosenQuote.layoutStyle,
          backgroundImage: chosenBg,
          caption: null,
        };
      }
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold tracking-wider uppercase border border-rose-200 flex items-center gap-1 shadow-xs">
              <Flame className="w-3 h-3 text-rose-500" />
              {scheduleLang === 'ta' ? 'தமிழ் ஆட்டோ-பைலட்' : 'Spark Within Auto-Pilot'}
            </span>
            <span className="text-xs text-slate-500">
              {scheduleLang === 'ta' ? '• 40+ திருக்குறள், பாரதியார், கலாம் வரிகள்' : '• 35+ Curated Quotes'}
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {scheduleLang === 'ta' ? '100% மீண்டும் வராத உத்தரவாதம்' : '100% Non-Repeating Guarantee'}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {scheduleLang === 'ta' ? '7-நாள் தமிழ் மோட்டிவேஷன் ஆட்டோ-பைலட்' : '7-Day Inspiring Content Queue'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            {scheduleLang === 'ta'
              ? 'திங்கள் முதல் ஞாயிறு வரை 7 தனித்துவமான Canva/Pinterest போஸ்ட்கள், 52 வைரல் ஹேஷ்டேக்குகள் மற்றும் ஆட்டோ-போஸ்டிங் @_sparkwithin_hub_ க்காக.'
              : '7 distinct visual environments, Canva & Pinterest layouts, and verified attributions engineered for @_sparkwithin_hub_.'}
          </p>

          {/* Language Toggle Pills */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => handleSwitchLanguage('ta')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                scheduleLang === 'ta'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              🌾 தமிழ் ஆட்டோ-பைலட் (Tamil)
            </button>
            <button
              onClick={() => handleSwitchLanguage('en')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                scheduleLang === 'en'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              🇺🇸 English Auto-Pilot
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Shuffle Entire Week Button */}
          <button
            onClick={handleShuffleEntireWeek}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Rotate to 7 completely fresh, non-repeating quotes and photos"
          >
            <Dices className="w-4 h-4 text-amber-500" />
            <span>{scheduleLang === 'ta' ? 'வாரத்தை கலக்கு (Shuffle)' : 'Shuffle Week (No Repeats)'}</span>
          </button>

          {/* Auto-generate all captions */}
          <button
            onClick={handleGenerateAllCaptions}
            disabled={isGeneratingAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-xl shadow-rose-500/20 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            {isGeneratingAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>
              {isGeneratingAll
                ? 'Generating Captions...'
                : scheduleLang === 'ta'
                ? '✨ 7 கேப்ஷன்களையும் உருவாக்கு (52 Tags)'
                : '1-Click Write All 7 Captions'}
            </span>
          </button>
        </div>
      </div>

      {/* Control Bar: Aspect Ratio & Attribution Style */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Feed Format:</span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setAspectRatio('4:5')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                aspectRatio === '4:5' ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4:5 Portrait (Recommended for IG)
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                aspectRatio === '1:1' ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1:1 Square
            </button>
          </div>
        </div>

        {/* Attribution Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Attribution Style:</span>
          <button
            onClick={() => setShowAuthorAttribution(!showAuthorAttribution)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
              showAuthorAttribution
                ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle between verified author attribution line and clean Pinterest page signature only"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{showAuthorAttribution ? 'Author Line: ON (Verified Thinkers)' : 'Pinterest Clean: Page Signature Only'}</span>
          </button>
        </div>
      </div>

      {/* 7 Days Grid with Real Canva Canvas Rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {schedule.map((item, idx) => {
          const theme = THEMES[item.theme];

          return (
            <div
              key={item.day}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md relative overflow-hidden"
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    {item.day}
                  </span>
                  <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {theme.environment}
                  </span>
                </div>

                {/* Real Dynamic Canva Canvas Thumbnail Preview */}
                <div className="relative mb-3">
                  <BatchCardCanvas 
                    post={item} 
                    aspectRatio={aspectRatio}
                    showAuthor={showAuthorAttribution}
                  />

                  {/* Re-roll Day Button */}
                  <button
                    onClick={() => handleRerollDay(idx)}
                    title="Swap to another non-repeating quote & photo in this theme"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/85 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer z-10 flex items-center gap-1 text-[10px] font-bold shadow-xs"
                  >
                    <Dices className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden group-hover:inline pr-1">Swap</span>
                  </button>
                </div>

                {/* Caption Snippet */}
                {item.caption ? (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 mb-3 space-y-1">
                    <p className="font-bold text-amber-800 line-clamp-1">{item.caption.hook}</p>
                    <p className="text-slate-500 text-[10px] line-clamp-2 leading-relaxed">{item.caption.insight || (item.caption as any).story || item.explanationTamil}</p>
                    <p className="text-[9px] text-rose-600 font-mono font-bold line-clamp-1 mt-1">
                      {item.caption.hashtags.slice(0, 4).join(' ')}
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-[10px] text-slate-400 font-medium text-center mb-3">
                    Click "Write All 7 Captions" above
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onLoadPostToStudio(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer shadow-xs"
                  title={item.language === 'ta' ? 'Open in Tamil Studio' : 'Open in English Studio'}
                >
                  <span>{item.language === 'ta' ? '🌾 தமிழ் Studio' : '🇺🇸 English Studio'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {onSendToVideoStudio && (
                  <button
                    onClick={() => onSendToVideoStudio(item.quote, item.author)}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-colors cursor-pointer shadow-xs"
                    title="Convert this quote into an animated 9:16 Video Reel"
                  >
                    <Film className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onOpenPublishModal(item.backgroundImage, item.caption?.fullCaption || item.quote)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer shadow-xs"
                  title="Direct Post to Instagram"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
