'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { THEMES, ThemeId } from '@/lib/themes';
import {
  RenderQuoteOptions,
  preloadImage,
  AspectRatio,
  LayoutStyle,
} from '@/lib/canvasRenderer';
import { QuotePreset } from '@/lib/presets';
import { buildPollinationsUrl } from '@/lib/imageFetcher';
import { generateViralCaption, ViralCaptionResult } from '@/lib/captionGenerator';

// Components
import { Header } from '@/components/Header';
import { CanvasPreview } from '@/components/CanvasPreview';
import { QuoteInput } from '@/components/QuoteInput';
import { ThemeSelector } from '@/components/Controls/ThemeSelector';
import { AspectRatioPicker } from '@/components/Controls/AspectRatioPicker';
import { LayoutPicker } from '@/components/Controls/LayoutPicker';
import { TypographyPicker } from '@/components/Controls/TypographyPicker';
import { ImagePicker } from '@/components/Controls/ImagePicker';
import { StylingSliders } from '@/components/Controls/StylingSliders';
import { WatermarkControl } from '@/components/Controls/WatermarkControl';
import { QuickPresetsModal } from '@/components/QuickPresetsModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ViralCaptionBox } from '@/components/AutoPilot/ViralCaptionBox';
import { BatchScheduler, ScheduledDayPost } from '@/components/AutoPilot/BatchScheduler';
import { InstagramPublishModal } from '@/components/AutoPilot/InstagramPublishModal';
import { VideoStudioView } from '@/components/VideoStudio/VideoStudioView';
import { TamilStudioView } from '@/components/TamilStudio/TamilStudioView';
import { ShareModal } from '@/components/ShareModal';

export default function Home() {
  // Navigation: 'studio' vs 'autopilot' vs 'video' vs 'tamil'
  const [currentTab, setCurrentTab] = useState<'studio' | 'autopilot' | 'video' | 'tamil'>('studio');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 1. Core Quote State
  const [quote, setQuote] = useState('Do not let anyone put out your spark. Even the smallest ember can set the world on fire.');
  const [author, setAuthor] = useState('Spark Within');
  const [showAuthor, setShowAuthor] = useState(true);
  const [isOriginalSpark, setIsOriginalSpark] = useState(true);
  const [themeId, setThemeId] = useState<ThemeId>('fire_sunset');

  // 2. Canvas & Layout State
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>('pinterest-luxury');
  const [fontFamily, setFontFamily] = useState(THEMES.fire_sunset.primaryFont);
  const [fontSize, setFontSize] = useState(58);
  const [textAlign, setTextAlign] = useState<'center' | 'left'>('center');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [accentColor, setAccentColor] = useState('#F59E0B');
  const [overlayOpacity, setOverlayOpacity] = useState(0.58);
  const [overlayColor, setOverlayColor] = useState('#0A0503');
  const [showQuoteMarks, setShowQuoteMarks] = useState(true);
  const [showBorder, setShowBorder] = useState(true);
  const [showCategoryBadge, setShowCategoryBadge] = useState(true);
  const [categoryBadgeText, setCategoryBadgeText] = useState('INNER FLAME');
  const [grainIntensity, setGrainIntensity] = useState(0.15);
  const [vignette, setVignette] = useState(true);
  const [showGlassCard, setShowGlassCard] = useState(false);

  // 3. Watermark (Defaulted to user's page: @_sparkwithin_hub_)
  const [handle, setHandle] = useState('@_sparkwithin_hub_');
  const [showHandle, setShowHandle] = useState(true);
  const [handlePosition, setHandlePosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left'>('bottom-center');

  // 4. Background Image
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(THEMES.fire_sunset.fallbackImages[0]);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  // 5. Modals & AI State
  const [apiKey, setApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [publishImageUrl, setPublishImageUrl] = useState('');
  const [publishCaption, setPublishCaption] = useState('');
  const [videoInitialQuote, setVideoInitialQuote] = useState('');
  const [videoInitialAuthor, setVideoInitialAuthor] = useState('');
  const [tamilInitialQuote, setTamilInitialQuote] = useState('');
  const [tamilInitialAuthor, setTamilInitialAuthor] = useState('');

  const handleSendToVideoStudio = (q: string, a: string) => {
    setVideoInitialQuote(q);
    setVideoInitialAuthor(a);
    setCurrentTab('video');
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const [captionData, setCaptionData] = useState<ViralCaptionResult | null>(null);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  // Load API Key from localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) setApiKey(savedKey);
    } catch {}
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      if (key) localStorage.setItem('gemini_api_key', key);
      else localStorage.removeItem('gemini_api_key');
    } catch {}
  };

  // Preload background image
  useEffect(() => {
    let active = true;
    if (backgroundImageUrl) {
      preloadImage(backgroundImageUrl)
        .then((img) => {
          if (active) setLoadedImage(img);
        })
        .catch(() => {
          if (active) setLoadedImage(null);
        });
    }
    return () => {
      active = false;
    };
  }, [backgroundImageUrl]);

  // Apply Theme configuration
  const applyTheme = useCallback((id: ThemeId, keepImage = false) => {
    const theme = THEMES[id] || THEMES.fire_sunset;
    setThemeId(id);
    setFontFamily(theme.primaryFont);
    setAccentColor(theme.accentColor);
    setTextColor(theme.defaultTextColor);
    setOverlayColor(theme.overlayColor);
    setOverlayOpacity(theme.overlayOpacity);
    setCategoryBadgeText(theme.badge);
    setGrainIntensity(theme.grainIntensity);
    setVignette(theme.vignette);
    setLayoutStyle(theme.defaultLayoutStyle || 'pinterest-luxury');
    setShowGlassCard(theme.defaultLayoutStyle === 'glass-card');

    if (!keepImage) {
      const bg = theme.fallbackImages[0];
      setBackgroundImageUrl(bg);
      setImageIndex(0);
    }
  }, []);

  // AI Sentiment & Theme Analyzer
  const handleAnalyze = async () => {
    if (!quote.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote, author, apiKey }),
      });

      if (!res.ok) throw new Error('Analysis request failed');
      const data = await res.json();

      if (data.themeId && THEMES[data.themeId]) {
        applyTheme(data.themeId as ThemeId);
      }
      if (data.accentColor) setAccentColor(data.accentColor);
      if (data.badge) setCategoryBadgeText(data.badge);
    } catch (err) {
      console.warn('API analysis error, falling back to heuristic matching:', err);
      const qLower = quote.toLowerCase();
      if (qLower.includes('fire') || qLower.includes('burn') || qLower.includes('storm')) {
        applyTheme('fire_sunset');
      } else if (qLower.includes('mind') || qLower.includes('strength') || qLower.includes('suffer')) {
        applyTheme('stoic_marble');
      } else if (qLower.includes('nature') || qLower.includes('grow') || qLower.includes('quiet')) {
        applyTheme('emerald_forest');
      } else if (qLower.includes('stars') || qLower.includes('space') || qLower.includes('cosmos')) {
        applyTheme('cosmic_galaxy');
      } else if (qLower.includes('simple') || qLower.includes('peace') || qLower.includes('calm')) {
        applyTheme('minimal_linen');
      } else if (qLower.includes('grind') || qLower.includes('sleep') || qLower.includes('discipline')) {
        applyTheme('cyber_midnight');
      } else {
        applyTheme('vintage_journal');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate Viral Instagram Caption
  const handleGenerateCaption = async () => {
    if (!quote.trim()) return;
    setIsGeneratingCaption(true);
    try {
      const res = await fetch('/api/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote, author, themeId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCaptionData(data);
      } else {
        const local = await generateViralCaption(quote, author, themeId);
        setCaptionData(local);
      }
    } catch (err) {
      console.error('Caption generation error:', err);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  // Re-roll / Shuffle Background
  const handleShuffleImage = () => {
    const theme = THEMES[themeId] || THEMES.fire_sunset;
    const nextIdx = (imageIndex + 1) % theme.fallbackImages.length;
    setImageIndex(nextIdx);
    setBackgroundImageUrl(theme.fallbackImages[nextIdx]);
  };

  // Generate Pollinations Generative Background
  const handleGeneratePollinations = async () => {
    setIsGeneratingBg(true);
    const theme = THEMES[themeId] || THEMES.fire_sunset;
    const prompt = `${quote.slice(0, 40)} ${theme.pollinationsPrompt}`;
    const newBgUrl = buildPollinationsUrl(prompt, aspectRatio, Math.floor(Math.random() * 999999));

    try {
      const img = await preloadImage(newBgUrl);
      setBackgroundImageUrl(newBgUrl);
      setLoadedImage(img);
    } catch (err) {
      console.warn('Pollinations load error, using theme fallback:', err);
      handleShuffleImage();
    } finally {
      setIsGeneratingBg(false);
    }
  };

  // Custom User Image Upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBackgroundImageUrl(result);
        const img = new Image();
        img.onload = () => setLoadedImage(img);
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset Selection
  const handleSelectPreset = (preset: QuotePreset) => {
    setQuote(preset.quote);
    setAuthor(preset.author);
    setIsOriginalSpark(preset.isOriginalSpark ?? false);
    setShowAuthor(true);
    applyTheme(preset.theme);
    setCategoryBadgeText(preset.badge);
    if (preset.layoutStyle) {
      setLayoutStyle(preset.layoutStyle);
      setShowGlassCard(preset.layoutStyle === 'glass-card');
    }
  };

  // Load Post from 7-Day Scheduler into Studio (English or Tamil)
  const handleLoadPostToStudio = (post: ScheduledDayPost) => {
    if (post.language === 'ta') {
      setTamilInitialQuote(post.quote);
      setTamilInitialAuthor(post.author);
      setCurrentTab('tamil');
    } else {
      setQuote(post.quote);
      setAuthor(post.author);
      setIsOriginalSpark(post.isOriginalSpark ?? false);
      setShowAuthor(true);
      applyTheme(post.theme, true);
      setCategoryBadgeText(post.badge);
      setBackgroundImageUrl(post.backgroundImage);
      setLayoutStyle(post.layoutStyle);
      setShowGlassCard(post.layoutStyle === 'glass-card');
      if (post.caption) {
        setCaptionData(post.caption);
      }
      setCurrentTab('studio');
    }
  };

  // Open Direct Publish Modal
  const handleOpenPublishModal = (imageUrl?: string, caption?: string) => {
    setPublishImageUrl(imageUrl || backgroundImageUrl);
    setPublishCaption(caption || captionData?.fullCaption || `"${quote}" — ${author}`);
    setIsInstagramModalOpen(true);
  };

  // Reset Studio
  const handleReset = () => {
    setQuote('Do not let anyone put out your spark. Even the smallest ember can set the world on fire.');
    setAuthor('Spark Within');
    setShowAuthor(true);
    setIsOriginalSpark(true);
    applyTheme('fire_sunset');
    setAspectRatio('4:5');
    setLayoutStyle('pinterest-luxury');
    setFontSize(58);
    setTextAlign('center');
    setShowBorder(true);
    setShowQuoteMarks(true);
    setShowCategoryBadge(true);
    setShowGlassCard(false);
    setShowHandle(true);
    setHandle('@_sparkwithin_hub_');
    setCaptionData(null);
  };

  // Memoized Render Options
  const renderOptions: RenderQuoteOptions = useMemo(() => {
    return {
      quote,
      author,
      showAuthor,
      isOriginalSpark,
      theme: THEMES[themeId] || THEMES.fire_sunset,
      aspectRatio,
      layoutStyle,
      backgroundImageUrl,
      loadedImage,
      fontFamily,
      fontSize,
      textAlign,
      textColor,
      accentColor,
      overlayOpacity,
      overlayColor,
      showQuoteMarks,
      showBorder,
      showCategoryBadge,
      categoryBadgeText,
      grainIntensity,
      vignette,
      handle,
      showHandle,
      handlePosition,
      showGlassCard,
    };
  }, [
    quote,
    author,
    showAuthor,
    isOriginalSpark,
    themeId,
    aspectRatio,
    layoutStyle,
    backgroundImageUrl,
    loadedImage,
    fontFamily,
    fontSize,
    textAlign,
    textColor,
    accentColor,
    overlayOpacity,
    overlayColor,
    showQuoteMarks,
    showBorder,
    showCategoryBadge,
    categoryBadgeText,
    grainIntensity,
    vignette,
    handle,
    showHandle,
    handlePosition,
    showGlassCard,
  ]);

  return (
    <div className="min-h-screen bg-studio-950 text-white flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        onReset={handleReset}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        onOpenPublishModal={() => handleOpenPublishModal()}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'autopilot' ? (
          /* 7-Day Auto-Pilot Viral Scheduler */
          <BatchScheduler
            onLoadPostToStudio={handleLoadPostToStudio}
            onOpenPublishModal={handleOpenPublishModal}
            onSendToVideoStudio={handleSendToVideoStudio}
          />
        ) : currentTab === 'video' ? (
          /* Animated Cartoon Motivational Reels Studio */
          <VideoStudioView
            initialQuote={videoInitialQuote}
            initialAuthor={videoInitialAuthor}
          />
        ) : currentTab === 'tamil' ? (
          /* Dedicated தமிழ் Studio (Tamil Hub) */
          <TamilStudioView
            initialQuote={tamilInitialQuote}
            initialAuthor={tamilInitialAuthor}
            onSendToVideoStudio={handleSendToVideoStudio}
            onOpenPublishModal={handleOpenPublishModal}
          />
        ) : (
          /* Live Studio Editor */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Sticky Live Canvas Preview + Viral Caption */}
            <section className="lg:w-[50%] flex flex-col items-center gap-6">
              <div className="sticky top-20 w-full flex flex-col items-center gap-4">
                <CanvasPreview
                  renderOptions={renderOptions}
                  isGeneratingBg={isGeneratingBg}
                />

                {/* Viral Caption & Trending Hashtags Box */}
                <div className="w-full max-w-[480px]">
                  <ViralCaptionBox
                    captionData={captionData}
                    isGenerating={isGeneratingCaption}
                    onGenerate={handleGenerateCaption}
                  />
                </div>
              </div>
            </section>

            {/* Right: Studio Controls Panel */}
            <section className="lg:w-[50%] flex flex-col gap-5">
              {/* Quote & Author Input */}
              <QuoteInput
                quote={quote}
                onChangeQuote={setQuote}
                author={author}
                onChangeAuthor={setAuthor}
                showAuthor={showAuthor}
                onToggleShowAuthor={setShowAuthor}
                onAnalyze={handleAnalyze}
                onOpenPresets={() => setIsPresetsModalOpen(true)}
                isAnalyzing={isAnalyzing}
                detectedThemeBadge={categoryBadgeText}
              />

              {/* Canva & Pinterest Layout Style Switcher */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <LayoutPicker
                  currentLayout={layoutStyle}
                  onChangeLayout={(lay) => {
                    setLayoutStyle(lay);
                    setShowGlassCard(lay === 'glass-card');
                  }}
                />
              </div>

              {/* Aspect Ratio Switcher (4:5 Portrait Feed vs 1:1 Square vs 9:16 Story) */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <AspectRatioPicker
                  value={aspectRatio}
                  onChange={setAspectRatio}
                />
              </div>

              {/* Aesthetic Environment Theme Selector (7 Distinct Worlds) */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <ThemeSelector
                  currentTheme={themeId}
                  onSelectTheme={(id) => applyTheme(id)}
                />
              </div>

              {/* Background Image Controls */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <ImagePicker
                  onShuffleImage={handleShuffleImage}
                  onGeneratePollinations={handleGeneratePollinations}
                  onCustomImageUpload={handleCustomImageUpload}
                  isGenerating={isGeneratingBg}
                />
              </div>

              {/* Typography & Color Customizer */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <TypographyPicker
                  fontFamily={fontFamily}
                  onChangeFont={setFontFamily}
                  fontSize={fontSize}
                  onChangeFontSize={setFontSize}
                  textAlign={textAlign}
                  onChangeTextAlign={setTextAlign}
                  textColor={textColor}
                  onChangeTextColor={setTextColor}
                  accentColor={accentColor}
                  onChangeAccentColor={setAccentColor}
                />
              </div>

              {/* Atmosphere, Overlays & Canva-Grade Glass Card */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <StylingSliders
                  overlayOpacity={overlayOpacity}
                  onChangeOverlayOpacity={setOverlayOpacity}
                  grainIntensity={grainIntensity}
                  onChangeGrainIntensity={setGrainIntensity}
                  vignette={vignette}
                  onToggleVignette={() => setVignette(!vignette)}
                  showBorder={showBorder}
                  onToggleBorder={() => setShowBorder(!showBorder)}
                  showQuoteMarks={showQuoteMarks}
                  onToggleQuoteMarks={() => setShowQuoteMarks(!showQuoteMarks)}
                  showCategoryBadge={showCategoryBadge}
                  onToggleCategoryBadge={() => setShowCategoryBadge(!showCategoryBadge)}
                  showGlassCard={showGlassCard}
                  onToggleGlassCard={() => setShowGlassCard(!showGlassCard)}
                />
              </div>

              {/* Brand Watermark & Signature Handle */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <WatermarkControl
                  handle={handle}
                  onChangeHandle={setHandle}
                  showHandle={showHandle}
                  onToggleShowHandle={() => setShowHandle(!showHandle)}
                  handlePosition={handlePosition}
                  onChangePosition={setHandlePosition}
                />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Modals */}
      <QuickPresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <InstagramPublishModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        currentImageUrl={publishImageUrl}
        currentCaption={publishCaption}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
