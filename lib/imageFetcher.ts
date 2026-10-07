import { THEMES, ThemeId } from './themes';

export interface GeneratedImageOption {
  url: string;
  source: 'pollinations' | 'stock' | 'custom';
  prompt?: string;
  photographer?: string;
}

/**
 * Builds a zero-key generative AI background URL via Pollinations.ai.
 */
export function buildPollinationsUrl(
  prompt: string,
  aspectRatio: '1:1' | '4:5' | '9:16',
  seed?: number
): string {
  const currentSeed = seed ?? Math.floor(Math.random() * 999999);
  
  let width = 1080;
  let height = 1080;
  if (aspectRatio === '4:5') height = 1350;
  if (aspectRatio === '9:16') height = 1920;

  // Pollinations handles 1024x1024 / 768x1024 / 768x1344 well and scales smoothly
  const pollWidth = aspectRatio === '9:16' ? 768 : aspectRatio === '4:5' ? 864 : 1024;
  const pollHeight = aspectRatio === '9:16' ? 1360 : aspectRatio === '4:5' ? 1080 : 1024;

  const cleanPrompt = encodeURIComponent(prompt.trim());
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${pollWidth}&height=${pollHeight}&nologo=true&seed=${currentSeed}&model=flux`;
}

/**
 * Returns a random fallback stock photo from the theme collection.
 */
export function getRandomThemeFallback(themeId: ThemeId, seed = 0): string {
  const theme = THEMES[themeId];
  if (!theme || !theme.fallbackImages.length) {
    return 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80';
  }
  const index = Math.abs(seed) % theme.fallbackImages.length;
  return theme.fallbackImages[index];
}
