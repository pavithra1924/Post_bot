import { LayoutStyle } from './canvasRenderer';

export type ThemeId = 
  | 'fire_sunset' 
  | 'stoic_marble' 
  | 'emerald_forest' 
  | 'cosmic_galaxy' 
  | 'minimal_linen' 
  | 'cyber_midnight' 
  | 'vintage_journal'
  // Compatibility aliases
  | 'bold_motivational' 
  | 'philosophical_timeless' 
  | 'calm_minimalist' 
  | 'cyber_tech' 
  | 'retro_vintage';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badge: string;
  tagline: string;
  environment: string;
  primaryFont: string;
  secondaryFont: string;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  defaultTextColor: string;
  accentColor: string;
  overlayColor: string;
  overlayOpacity: number;
  borderStyle: 'none' | 'corners' | 'brackets' | 'frame' | 'minimal-line';
  quoteMarkStyle: 'bold' | 'editorial' | 'none' | 'code' | 'minimal';
  defaultLayoutStyle: LayoutStyle;
  grainIntensity: number;
  vignette: boolean;
  defaultKeywords: string[];
  pollinationsPrompt: string;
  fallbackImages: string[];
}

export const THEMES: Record<string, ThemeConfig> = {
  fire_sunset: {
    id: 'fire_sunset',
    name: 'Golden Ember & Sunset Fire',
    badge: 'INNER FLAME',
    tagline: 'Fiery amber sunset & flying embers, igniting the spark within with bold luxury typography',
    environment: 'Golden Sunset & Fire',
    primaryFont: 'Montserrat',
    secondaryFont: 'Cinzel',
    fontWeight: 900,
    letterSpacing: 1.5,
    lineHeight: 1.25,
    defaultTextColor: '#FFFFFF',
    accentColor: '#F59E0B',
    overlayColor: '#0A0503',
    overlayOpacity: 0.58,
    borderStyle: 'brackets',
    quoteMarkStyle: 'editorial',
    defaultLayoutStyle: 'pinterest-luxury',
    grainIntensity: 0.15,
    vignette: true,
    defaultKeywords: ['dramatic golden sunset mountains', 'burning sparks embers dark', 'golden dawn clouds fire', 'intense orange horizon silhouette'],
    pollinationsPrompt: 'dramatic golden hour sunset over jagged mountain peaks flying sparks glowing embers warm dark cinematic 8k wallpaper pinterest aesthetic',
    fallbackImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&auto=format&fit=crop&q=85',
    ]
  },
  stoic_marble: {
    id: 'stoic_marble',
    name: 'Moody Stoic Marble',
    badge: 'STOIC WISDOM',
    tagline: 'Classical museum marble sculptures, Roman gold accents, and high-end editorial frame',
    environment: 'Moody Stoic Marble',
    primaryFont: 'Playfair Display',
    secondaryFont: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 0.8,
    lineHeight: 1.42,
    defaultTextColor: '#FDFBF7',
    accentColor: '#D4AF37',
    overlayColor: '#06080E',
    overlayOpacity: 0.62,
    borderStyle: 'frame',
    quoteMarkStyle: 'editorial',
    defaultLayoutStyle: 'editorial-frame',
    grainIntensity: 0.20,
    vignette: true,
    defaultKeywords: ['classical roman marble sculpture', 'chiaroscuro museum statue', 'ancient roman column arch', 'stoic dark architecture'],
    pollinationsPrompt: 'classical roman marble sculpture dramatic chiaroscuro museum lighting deep shadows fine art 8k canva editorial dark luxury',
    fallbackImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=1400&auto=format&fit=crop&q=85',
    ]
  },
  emerald_forest: {
    id: 'emerald_forest',
    name: 'Deep Emerald Pine Mist',
    badge: 'SILENT GROWTH',
    tagline: 'Misty evergreen pines, quiet forest stillness, and clean frosted glassmorphism card',
    environment: 'Deep Emerald Pine Mist',
    primaryFont: 'Cormorant Garamond',
    secondaryFont: 'Inter',
    fontWeight: 700,
    letterSpacing: 1.0,
    lineHeight: 1.48,
    defaultTextColor: '#FFFFFF',
    accentColor: '#10B981',
    overlayColor: '#041009',
    overlayOpacity: 0.58,
    borderStyle: 'minimal-line',
    quoteMarkStyle: 'minimal',
    defaultLayoutStyle: 'glass-card',
    grainIntensity: 0.12,
    vignette: true,
    defaultKeywords: ['foggy pine trees misty forest', 'deep green moody woodland', 'emerald mountain valley rain', 'pacific northwest foggy pines'],
    pollinationsPrompt: 'aerial view dense moody pine forest covered in atmospheric white fog emerald green dark luxury cinematic 8k photography',
    fallbackImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1400&auto=format&fit=crop&q=85',
    ]
  },
  cosmic_galaxy: {
    id: 'cosmic_galaxy',
    name: 'Infinite Cosmic Stars',
    badge: 'SPARK IN THE DARK',
    tagline: 'Deep obsidian night sky, glowing starry nebulae, and cinematic radial starlight glow',
    environment: 'Cosmic Galaxy & Aurora',
    primaryFont: 'Plus Jakarta Sans',
    secondaryFont: 'Space Mono',
    fontWeight: 700,
    letterSpacing: 1.0,
    lineHeight: 1.38,
    defaultTextColor: '#FFFFFF',
    accentColor: '#C084FC',
    overlayColor: '#040310',
    overlayOpacity: 0.65,
    borderStyle: 'brackets',
    quoteMarkStyle: 'editorial',
    defaultLayoutStyle: 'atmospheric-glow',
    grainIntensity: 0.18,
    vignette: true,
    defaultKeywords: ['deep space starry night sky', 'milky way galaxy nebula glowing', 'aurora borealis dark sky', 'infinite stars over mountain'],
    pollinationsPrompt: 'breathtaking night sky full of glowing stars milky way galaxy deep cosmic purple and obsidian nebula 8k wallpaper dark luxury',
    fallbackImages: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&auto=format&fit=crop&q=85',
    ]
  },
  minimal_linen: {
    id: 'minimal_linen',
    name: 'Dark Travertine & Minimalist Arches',
    badge: 'PEACE & CLARITY',
    tagline: 'Warm architectural travertine arches, cinematic deep shadows, and clean modern pill badge',
    environment: 'Minimalist Travertine Arches',
    primaryFont: 'Syne',
    secondaryFont: 'Inter',
    fontWeight: 700,
    letterSpacing: 1.2,
    lineHeight: 1.45,
    defaultTextColor: '#FDFBF7',
    accentColor: '#F59E0B',
    overlayColor: '#0E0B08',
    overlayOpacity: 0.62,
    borderStyle: 'minimal-line',
    quoteMarkStyle: 'minimal',
    defaultLayoutStyle: 'minimal-badge',
    grainIntensity: 0.12,
    vignette: true,
    defaultKeywords: ['minimalist architectural arches shadows', 'brutalist concrete sunbeam dramatic shadows', 'dark luxury stone texture', 'modern museum interior'],
    pollinationsPrompt: 'minimalist architectural arches dramatic sunlight shadows deep dark warm stone texture 8k canva editorial photography',
    fallbackImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400&auto=format&fit=crop&q=85',
    ]
  },
  cyber_midnight: {
    id: 'cyber_midnight',
    name: 'Cyber Midnight Rain',
    badge: 'RELENTLESS',
    tagline: 'Dark rainy asphalt, midnight supercar headlights, and high-contrast urban focus',
    environment: 'Cyber Midnight Rain',
    primaryFont: 'Montserrat',
    secondaryFont: 'Inter',
    fontWeight: 900,
    letterSpacing: 1.8,
    lineHeight: 1.25,
    defaultTextColor: '#FFFFFF',
    accentColor: '#06B6D4',
    overlayColor: '#020610',
    overlayOpacity: 0.65,
    borderStyle: 'brackets',
    quoteMarkStyle: 'bold',
    defaultLayoutStyle: 'centered-hero',
    grainIntensity: 0.22,
    vignette: true,
    defaultKeywords: ['dark rainy city neon reflections', 'cyberpunk wet street night', 'futuristic neon architecture', 'dark modern supercar rain'],
    pollinationsPrompt: 'dark rainy city street at midnight glowing puddles reflections cinematic dramatic headlights 8k wallpaper dark luxury',
    fallbackImages: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1515260268569-9271009adfdb?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=85',
    ]
  },
  vintage_journal: {
    id: 'vintage_journal',
    name: 'Vintage 35mm Analog Film',
    badge: 'TIMELESS SOUL',
    tagline: 'Warm sepia 35mm film grain, dark academia leather journals, and romantic literary serif',
    environment: 'Vintage 35mm Analog Film',
    primaryFont: 'Libre Baskerville',
    secondaryFont: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 0.5,
    lineHeight: 1.48,
    defaultTextColor: '#FDF6E2',
    accentColor: '#E29578',
    overlayColor: '#160E08',
    overlayOpacity: 0.64,
    borderStyle: 'frame',
    quoteMarkStyle: 'editorial',
    defaultLayoutStyle: 'pinterest-luxury',
    grainIntensity: 0.28,
    vignette: true,
    defaultKeywords: ['dark academia antique library books', 'vintage handwritten journal desk', '35mm analog film grain warm', 'candlelight on open vintage book'],
    pollinationsPrompt: 'dark academia antique library warm candlelight leather books antique wooden desk 35mm film grain 8k aesthetic editorial',
    fallbackImages: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=1400&auto=format&fit=crop&q=85',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400&auto=format&fit=crop&q=85',
    ]
  },
};

// Aliases for backward compatibility
THEMES.bold_motivational = THEMES.fire_sunset;
THEMES.philosophical_timeless = THEMES.stoic_marble;
THEMES.calm_minimalist = THEMES.emerald_forest;
THEMES.cyber_tech = THEMES.cosmic_galaxy;
THEMES.retro_vintage = THEMES.vintage_journal;
