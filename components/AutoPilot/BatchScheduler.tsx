'use client';

import React, { useState } from 'react';
import { getNonRepeatingWeek, PRESET_QUOTES } from '@/lib/presets';
import { getNonRepeatingTamilWeek, TAMIL_PRESET_QUOTES } from '@/lib/tamilPresets';
import { generateTamilViralCaption, TamilCaptionResult } from '@/lib/tamilCaptionGenerator';
import { THEMES, ThemeId } from '@/lib/themes';
import { LayoutStyle, AspectRatio, renderQuoteToCanvas } from '@/lib/canvasRenderer';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Dices,
  Send,
  RefreshCw,
  Flame,
  Check,
  ShieldCheck,
  Film,
  Clock,
  Radio,
  ExternalLink,
  Zap,
  Globe,
  BookOpen,
  Copy
} from 'lucide-react';
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
  kuralNumber?: number;
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

  // Instant Cloud Test Posting state
  const [isTestingCron, setIsTestingCron] = useState(false);
  const [cronStatusMsg, setCronStatusMsg] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    details?: string;
  } | null>(null);

  // Webhook copy feedback
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Helper to build schedule for Tamil Quotes or English Mindset
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

        const authorClean = item.author === 'Spark Within' ? 'பொன்மொழி' : item.author.replace(/\(?உள்\s*ஒளி\)?/g, '').trim();
        const badgeClean = item.categoryTamil;

        return {
          day: item.day,
          quote: item.quote,
          author: authorClean,
          isOriginalSpark: false,
          theme: tId,
          badge: badgeClean,
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

  // Switch category mode
  const handleSwitchCategory = (newCat: 'ta' | 'en') => {
    setScheduleLang(newCat);
    setSchedule(buildSchedule(newCat, seedOffset));
  };

  // Shuffle entire week
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
        const pool = TAMIL_PRESET_QUOTES.filter(
          (q) => q.quote !== current.quote && q.category !== 'thirukkural' && !q.categoryTamil.includes('திருக்குறள்')
        );
        const chosen = pool[Math.floor(Math.random() * pool.length)] || pool[0];
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

  const handlePublishDayPost = async (item: ScheduledDayPost) => {
    try {
      const offscreen = document.createElement('canvas');
      const theme = THEMES[item.theme];
      const isTamil = item.language === 'ta' || /[\u0B80-\u0BFF]/.test(item.quote);
      const isKural = item.kuralNumber || item.badge?.includes('குறள்') || item.badge?.includes('வாழ்வியல்');
      const authorClean = isKural 
        ? 'திருவள்ளுவர்' 
        : (item.author && item.author !== 'Spark Within' ? item.author.replace(/\(?உள்\s*ஒளி\)?/g, '').trim() : '');
      const badgeClean = isKural ? `💎 குறள் #${item.kuralNumber || ''}` : item.badge;

      await renderQuoteToCanvas(offscreen, {
        quote: item.quote,
        author: authorClean,
        showAuthor: showAuthorAttribution,
        isOriginalSpark: item.isOriginalSpark,
        theme,
        aspectRatio: aspectRatio,
        layoutStyle: item.layoutStyle,
        backgroundImageUrl: item.backgroundImage,
        fontFamily: isTamil ? 'Mukta Malar' : theme.primaryFont,
        fontSize: aspectRatio === '4:5' ? (isTamil ? 44 : 52) : (isTamil ? 46 : 56),
        textAlign: isKural ? 'left' : (item.layoutStyle === 'minimal-badge' ? 'left' : 'center'),
        textColor: theme.defaultTextColor,
        accentColor: theme.accentColor,
        overlayOpacity: theme.overlayOpacity,
        overlayColor: theme.overlayColor,
        showQuoteMarks: true,
        showBorder: true,
        showCategoryBadge: true,
        categoryBadgeText: badgeClean,
        grainIntensity: theme.grainIntensity,
        vignette: theme.vignette,
        handle: '@_sparkwithin_hub_',
        showHandle: true,
        handlePosition: 'bottom-center',
        showGlassCard: item.layoutStyle === 'glass-card',
      });
      const dataUrl = offscreen.toDataURL('image/png');
      onOpenPublishModal(dataUrl, item.caption?.fullCaption || `"${item.quote}" — ${authorClean}`);
    } catch {
      onOpenPublishModal(item.backgroundImage, item.caption?.fullCaption || item.quote);
    }
  };

  // Instant Cloud Test Trigger for Thirukkural, Tamil Quotes, or English Mindset
  const handleTriggerCloudPost = async (type: 'kural' | 'tamil' | 'english' | 'all') => {
    setIsTestingCron(true);
    setCronStatusMsg({
      type: 'info',
      text: `Connecting to Meta Graph API for @_sparkwithin_hub_ (${type.toUpperCase()})...`,
    });

    try {
      const res = await fetch(`/api/cron/daily-post?type=${type}`, { method: 'GET' });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        const info = data.mode === 'all_categories'
          ? `Successfully published all 3 categories (Thirukkural, Tamil Wisdom, and English Mindset) to @_sparkwithin_hub_!`
          : `Successfully published ${data.title} (${data.author}) to @_sparkwithin_hub_!`;
        setCronStatusMsg({
          type: 'success',
          text: '🎉 Instagram Auto-Publish Successful!',
          details: info,
        });
      } else {
        setCronStatusMsg({
          type: 'error',
          text: '⚠️ Automated Publishing Notice',
          details: data.error || data.message || 'Check connected account credentials.',
        });
      }
    } catch (err: any) {
      setCronStatusMsg({
        type: 'error',
        text: 'Connection Error',
        details: err.message || 'Failed to ping automated publisher.',
      });
    } finally {
      setIsTestingCron(false);
    }
  };

  const handleCopyWebhook = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/api/cron/daily-post`;
      navigator.clipboard.writeText(url);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🚀 Spark Within Autonomous Automation Status & Schedule Hub */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Automation Active
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-medium border border-indigo-500/30 flex items-center gap-1">
                @_sparkwithin_hub_
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: 17841412392890201
              </span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>⚡ Spark Within Daily Automation Engine</span>
            </h2>
            <p className="text-xs text-indigo-200/80 mt-1.5 max-w-2xl leading-relaxed">
              Fully hands-free autonomous posting schedule for <strong>தமிழ் பொன்மொழிகள் (Tamil Quotes)</strong> மற்றும் <strong>English Mindset</strong> directly to your Instagram account.
            </p>

            {/* 2 Scheduled Daily Slots for Single Posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>☀️ 09:00 AM IST</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  <span>🔥 தமிழ் பொன்மொழிகள் (Single Post)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">பாரதியார், கலாம், ஔவையார், விவேகானந்தர், சினிமா வரிகள்</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>🌙 07:00 PM IST</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  <span>🌍 English Mindset Quotes (Single Post)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Marcus Aurelius, Steve Jobs, Seneca, Bruce Lee</p>
              </div>
            </div>

            {/* Carousel Clarification Note */}
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>திருக்குறள் (5-Slide Carousels)</strong>: திருக்குறள் ஸ்லைடுகள் 5-Slide Carousel Studio பக்கத்தில் மட்டுமே உருவாக்கப்பட்டு பகிரப்படும்.
              </span>
            </div>
          </div>

          {/* Instant Test Buttons */}
          <div className="flex flex-col gap-2.5 shrink-0 w-full lg:w-auto">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Instant 1-Click Trigger:
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleTriggerCloudPost('tamil')}
                disabled={isTestingCron}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                🔥 Post Tamil Quote Now
              </button>
              <button
                onClick={() => handleTriggerCloudPost('english')}
                disabled={isTestingCron}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                🌍 Post English Mindset Now
              </button>
              <button
                onClick={() => handleTriggerCloudPost('all')}
                disabled={isTestingCron}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md"
              >
                🚀 Post Both Categories
              </button>
            </div>

            {/* Webhook URL Copy */}
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={handleCopyWebhook}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-slate-300 font-mono transition-colors cursor-pointer border border-white/10"
                title="Copy Webhook endpoint URL for cron-job.org / GitHub Actions"
              >
                <Copy className="w-3 h-3 text-slate-400" />
                <span>{copiedWebhook ? 'Copied Webhook URL!' : 'Copy Automated Cron Webhook URL'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Feedback Toast Banner */}
        {cronStatusMsg && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 border ${
              cronStatusMsg.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40'
                : cronStatusMsg.type === 'error'
                ? 'bg-rose-950/80 text-rose-200 border-rose-500/40'
                : 'bg-indigo-950/80 text-indigo-200 border-indigo-500/40'
            }`}
          >
            {isTestingCron ? (
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 mt-0.5 text-amber-400" />
            ) : cronStatusMsg.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Zap className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{cronStatusMsg.text}</p>
              {cronStatusMsg.details && (
                <p className="text-[11px] opacity-90 mt-0.5">{cronStatusMsg.details}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Header Banner & Mode Selector */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold tracking-wider uppercase border border-rose-200 flex items-center gap-1 shadow-xs">
              <Flame className="w-3 h-3 text-rose-500" />
              {scheduleLang === 'ta'
                ? '🔥 தமிழ் பொன்மொழிகள் ஆட்டோ-பைலட்'
                : '🇺🇸 English Mindset Auto-Pilot'}
            </span>
            <span className="text-xs text-slate-500">
              {scheduleLang === 'ta'
                ? '• பாரதியார், கலாம், ஔவையார், விவேகானந்தர், சினிமா வரிகள்'
                : '• Stoic & Success Masterpieces'}
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Non-Repeating Guarantee
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {scheduleLang === 'ta'
              ? '7-நாள் தமிழ் பொன்மொழிகள் வரிசை'
              : '7-Day English Mindset Queue'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            {scheduleLang === 'ta'
              ? 'மகாகவி பாரதியார், டாக்டர் அப்துல் கலாம், ஔவையார், விவேகானந்தர், மற்றும் தன்னம்பிக்கை வரிகள்.'
              : 'High-leverage stoic, philosophical, and leadership quotes for daily execution.'}
          </p>

          {/* Category Toggle Pills */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => handleSwitchCategory('ta')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                scheduleLang === 'ta'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>🔥 தமிழ் பொன்மொழிகள் (Tamil Single Quotes)</span>
            </button>
            <button
              onClick={() => handleSwitchCategory('en')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                scheduleLang === 'en'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🇺🇸 English Mindset</span>
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
            <span>Shuffle Week (No Repeats)</span>
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
                : '✨ 1-Click Write All 7 Captions'}
            </span>
          </button>
        </div>
      </div>

      {/* Control Bar: Aspect Ratio & Attribution Style */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Display Ratio:</span>
          {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aspectRatio === ratio
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {ratio === '4:5' ? '4:5 (Instagram Feed)' : ratio === '9:16' ? '9:16 (Story/Reel)' : '1:1 (Square)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
            <input
              type="checkbox"
              checked={showAuthorAttribution}
              onChange={(e) => setShowAuthorAttribution(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <span>Show Author Attribution</span>
          </label>
        </div>
      </div>

      {/* 7-Day Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {schedule.map((item, idx) => {
          const theme = THEMES[item.theme];
          const isKural = item.kuralNumber || item.badge?.includes('குறள்');
          const authorClean = isKural ? 'திருவள்ளுவர்' : item.author;

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Day Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                    {item.day}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                    {theme.environment}
                  </span>
                </div>

                {/* Real Dynamic Canvas Thumbnail Preview */}
                <div className="relative mb-3">
                  <BatchCardCanvas
                    post={item}
                    aspectRatio={aspectRatio}
                    showAuthor={showAuthorAttribution}
                  />

                  {/* Re-roll Day Button */}
                  <button
                    onClick={() => handleRerollDay(idx)}
                    title="Swap to another non-repeating quote in this category"
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
                    <p className="text-slate-500 text-[10px] line-clamp-2 leading-relaxed">
                      {item.caption.insight || (item.caption as any).story || item.explanationTamil}
                    </p>
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
                  title="Open in Studio"
                >
                  <span>{item.language === 'ta' ? '🌾 தமிழ் Studio' : '🇺🇸 English Studio'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {onSendToVideoStudio && (
                  <button
                    onClick={() => onSendToVideoStudio(item.quote, authorClean)}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-colors cursor-pointer shadow-xs"
                    title="Convert this quote into an animated 9:16 Video Reel"
                  >
                    <Film className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => handlePublishDayPost(item)}
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
