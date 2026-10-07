import { GoogleGenAI } from '@google/genai';
import { THEMES, ThemeId } from './themes';

export interface AnalysisResult {
  theme: ThemeId;
  sentiment: string;
  searchKeywords: string[];
  pollinationsPrompt: string;
  accentColor: string;
  badgeText: string;
  suggestedFont: string;
  suggestedOverlayOpacity: number;
}

/**
 * Intelligent client/server heuristic fallback classifier for instant $0 zero-key operation.
 */
export function analyzeQuoteHeuristic(quote: string, author?: string): AnalysisResult {
  const lower = (quote + ' ' + (author || '')).toLowerCase();

  // 1. Cyber / Tech keywords
  if (/technology|future|code|coding|developer|program|computer|algorithm|machine|ai\b|digital|data|matrix|hack|cyber|science|engineer|logic/i.test(lower)) {
    const theme = THEMES.cyber_tech;
    return {
      theme: 'cyber_tech',
      sentiment: 'Futuristic, analytical & visionary',
      searchKeywords: ['cyber matrix', 'glowing neon tech', 'dark code abstract'],
      pollinationsPrompt: 'futuristic dark cybernetic grid glowing neon cyan violet lines abstract technology wallpaper 8k',
      accentColor: theme.accentColor,
      badgeText: 'TECH_HORIZON',
      suggestedFont: theme.primaryFont,
      suggestedOverlayOpacity: 0.72,
    };
  }

  // 2. Retro / Vintage Poetry keywords (Romance, literature, vintage memoirs)
  if (/love|heart|romance|beloved|darling|poetry|poet|literature|emily bronte|brontë|cummings|neruda|keats|byron|shakespeare|rumi|hemingway|vintage|analog|memoir|whisper|kiss|nostalgia|autumn|longing|tears|faded/i.test(lower)) {
    const theme = THEMES.retro_vintage;
    return {
      theme: 'retro_vintage',
      sentiment: 'Poetic, nostalgic & deeply romantic',
      searchKeywords: ['vintage 35mm film', 'antique book and coffee', 'warm golden hour'],
      pollinationsPrompt: 'warm nostalgic 35mm film photograph antique wooden desk vintage handwritten journal golden sunlight dust 8k',
      accentColor: theme.accentColor,
      badgeText: 'POETRY',
      suggestedFont: theme.primaryFont,
      suggestedOverlayOpacity: 0.60,
    };
  }

  // 3. Calm & Minimalist keywords
  if (/peace|quiet|calm|breathe|silence|stillness|gentle|simplicity|rest|harmony|zen|slow|nature|soft|content|solitude|meditation|relax|elegance/i.test(lower)) {
    const theme = THEMES.calm_minimalist;
    return {
      theme: 'calm_minimalist',
      sentiment: 'Peaceful, grounding & meditative',
      searchKeywords: ['minimalist beige architecture', 'calm lake morning ripples', 'soft shadows'],
      pollinationsPrompt: 'minimalist wabi sabi interior natural morning soft sunlight beige linen serene aesthetic 8k photography',
      accentColor: theme.accentColor,
      badgeText: 'MINDFULNESS',
      suggestedFont: theme.primaryFont,
      suggestedOverlayOpacity: 0.45,
    };
  }

  // 4. Philosophical & Timeless (Stoic wisdom, existential philosophy)
  if (/marcus aurelius|seneca|epictetus|nietzsche|plato|socrates|aristotle|confucius|kant|philosophy|stoic|wisdom|mind|virtue|destiny|fate|truth|existence|death|soul|reason|universe|immortal|consciousness|reflect/i.test(lower)) {
    const theme = THEMES.philosophical_timeless;
    return {
      theme: 'philosophical_timeless',
      sentiment: 'Reflective, existential & stoic wisdom',
      searchKeywords: ['classical marble statue', 'ancient roman architecture', 'misty pine forest'],
      pollinationsPrompt: 'classical roman marble sculpture dramatic museum lighting chiaroscuro moody aesthetic fine art 8k',
      accentColor: theme.accentColor,
      badgeText: 'STOIC WISDOM',
      suggestedFont: theme.primaryFont,
      suggestedOverlayOpacity: 0.58,
    };
  }

  // 5. Bold & Motivational keywords (Gym, grit, grind, victory, discipline)
  if (/discipline|fight|grind|hustle|endure|pain|power|champion|conquer|strength|training|win|effort|rise|courage|dare|achieve|beast|unstoppable|never quit|hard work/i.test(lower)) {
    const theme = THEMES.bold_motivational;
    return {
      theme: 'bold_motivational',
      sentiment: 'High-energy, relentless & gritty',
      searchKeywords: ['dramatic mountain storm', 'dark workout', 'intense night city lights'],
      pollinationsPrompt: 'dramatic stormy mountain peak with cinematic golden hour light dark moody high contrast 8k photography',
      accentColor: theme.accentColor,
      badgeText: 'DISCIPLINE',
      suggestedFont: theme.primaryFont,
      suggestedOverlayOpacity: 0.65,
    };
  }

  // Default fallback
  const theme = THEMES.bold_motivational;
  return {
    theme: 'bold_motivational',
    sentiment: 'Inspiring & impactful',
    searchKeywords: ['dramatic mountain storm', 'cinematic lighting'],
    pollinationsPrompt: 'cinematic dramatic mountain landscape golden hour 8k photography',
    accentColor: theme.accentColor,
    badgeText: 'MOTIVATION',
    suggestedFont: theme.primaryFont,
    suggestedOverlayOpacity: 0.65,
  };
}

/**
 * Analyzes the quote using Google Gemini 3.8 Flash if an API key is available,
 * falling back seamlessly to the heuristic analyzer if no key or error.
 */
export async function analyzeQuoteWithGemini(
  quote: string, 
  author?: string, 
  apiKey?: string
): Promise<AnalysisResult> {
  const resolvedKey = apiKey || process.env.GEMINI_API_KEY;

  if (!resolvedKey) {
    return analyzeQuoteHeuristic(quote, author);
  }

  try {
    const client = new GoogleGenAI({ apiKey: resolvedKey });
    
    const systemPrompt = `
You are an expert Instagram aesthetic art director and typography designer.
Analyze the following quote and author to classify it into exactly ONE of these 5 aesthetic themes:
1. "bold_motivational": High energy, discipline, conquering challenges, workout, gritty ambition.
2. "philosophical_timeless": Stoic wisdom, deep reflection, classical philosophy, history, existential insight.
3. "calm_minimalist": Peace, zen, mindfulness, gentle nature, simplicity, self-care.
4. "cyber_tech": Coding, AI, algorithms, future, cyberpunk, technology, logic.
5. "retro_vintage": Romantic poetry, classic literature, nostalgia, analog warmth, memoirs.

Return ONLY a strict JSON object with this exact shape:
{
  "theme": "bold_motivational" | "philosophical_timeless" | "calm_minimalist" | "cyber_tech" | "retro_vintage",
  "sentiment": "Short 3-5 word sentiment description",
  "searchKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "pollinationsPrompt": "A vivid 15-20 word text-to-image prompt tailored for the quote, specifying lighting, atmosphere, aesthetic style (e.g. 8k photography or fine art), without any text in image",
  "accentColor": "Hex color code for accent highlight",
  "badgeText": "UPPERCASE 1-2 WORD CATEGORY (e.g. DISCIPLINE, STOIC WISDOM, SYS.QUOTE, MINDFULNESS, POETRY)",
  "suggestedFont": "One of Montserrat, Playfair Display, Plus Jakarta Sans, Space Mono, Libre Baskerville",
  "suggestedOverlayOpacity": 0.55
}
`;

    const interaction = await client.interactions.create({
      model: 'gemini-3.8-flash',
      input: `Quote: "${quote}"\nAuthor: ${author || 'Unknown'}\n\n${systemPrompt}`,
    });

    const outputText = interaction.output_text?.trim() || '';
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (THEMES[parsed.theme as ThemeId]) {
        return {
          theme: parsed.theme as ThemeId,
          sentiment: parsed.sentiment || 'Inspiring',
          searchKeywords: Array.isArray(parsed.searchKeywords) ? parsed.searchKeywords : ['aesthetic background'],
          pollinationsPrompt: parsed.pollinationsPrompt || THEMES[parsed.theme as ThemeId].pollinationsPrompt,
          accentColor: parsed.accentColor || THEMES[parsed.theme as ThemeId].accentColor,
          badgeText: parsed.badgeText || THEMES[parsed.theme as ThemeId].badge,
          suggestedFont: parsed.suggestedFont || THEMES[parsed.theme as ThemeId].primaryFont,
          suggestedOverlayOpacity: typeof parsed.suggestedOverlayOpacity === 'number' ? parsed.suggestedOverlayOpacity : 0.6,
        };
      }
    }
  } catch (err) {
    console.warn('Gemini API analysis failed or rate-limited; utilizing heuristic engine:', err);
  }

  return analyzeQuoteHeuristic(quote, author);
}
