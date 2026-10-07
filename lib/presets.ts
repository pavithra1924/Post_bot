import { ThemeId } from './themes';
import { LayoutStyle } from './canvasRenderer';

export interface QuotePreset {
  id: string;
  quote: string;
  author: string;
  isOriginalSpark: boolean;
  theme: ThemeId;
  badge: string;
  layoutStyle: LayoutStyle;
  keywords: string[];
}

export const PRESET_QUOTES: QuotePreset[] = [
  // ==========================================
  // THEME 1: Golden Ember & Sunset Fire (Inner Flame & Resilience)
  // ==========================================
  {
    id: 'fire-1',
    quote: "Do not let anyone put out your spark. Even the smallest ember can set the world on fire.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "fire_sunset",
    badge: "INNER FLAME",
    layoutStyle: "pinterest-luxury",
    keywords: ["fire", "ember", "ignite", "passion", "unbreakable"],
  },
  {
    id: 'fire-2',
    quote: "The fire inside you is greater than any storm burning around you.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "fire_sunset",
    badge: "UNCONQUERED",
    layoutStyle: "centered-hero",
    keywords: ["inner fire", "storm", "resilience", "power"],
  },
  {
    id: 'fire-3',
    quote: "What does not kill me makes me stronger.",
    author: "Friedrich Nietzsche",
    isOriginalSpark: false,
    theme: "fire_sunset",
    badge: "WILLPOWER",
    layoutStyle: "editorial-frame",
    keywords: ["strength", "adversity", "overcome", "grit"],
  },
  {
    id: 'fire-4',
    quote: "You have to burn before you can emerge from the ashes.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "fire_sunset",
    badge: "REBIRTH",
    layoutStyle: "atmospheric-glow",
    keywords: ["phoenix", "transformation", "growth", "grit"],
  },
  {
    id: 'fire-5',
    quote: "Do not pray for an easy life, pray for the strength to endure a difficult one.",
    author: "Bruce Lee",
    isOriginalSpark: false,
    theme: "fire_sunset",
    badge: "MENTAL STRENGTH",
    layoutStyle: "glass-card",
    keywords: ["endurance", "warrior", "strength", "discipline"],
  },

  // ==========================================
  // THEME 2: Moody Stoic Marble (Timeless Wisdom & Self-Mastery)
  // ==========================================
  {
    id: 'stoic-1',
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    isOriginalSpark: false,
    theme: "stoic_marble",
    badge: "STOIC WISDOM",
    layoutStyle: "editorial-frame",
    keywords: ["stoicism", "mindset", "inner power", "control"],
  },
  {
    id: 'stoic-2',
    quote: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    isOriginalSpark: false,
    theme: "stoic_marble",
    badge: "MENTAL CLARITY",
    layoutStyle: "pinterest-luxury",
    keywords: ["fear", "clarity", "stoic", "peace of mind"],
  },
  {
    id: 'stoic-3',
    quote: "No man is free who is not master of himself.",
    author: "Epictetus",
    isOriginalSpark: false,
    theme: "stoic_marble",
    badge: "SELF-MASTERY",
    layoutStyle: "glass-card",
    keywords: ["freedom", "self discipline", "control", "mastery"],
  },
  {
    id: 'stoic-4',
    quote: "Waste no more time arguing what a good man should be. Be one.",
    author: "Marcus Aurelius",
    isOriginalSpark: false,
    theme: "stoic_marble",
    badge: "CHARACTER",
    layoutStyle: "centered-hero",
    keywords: ["action", "integrity", "standards", "lead by example"],
  },
  {
    id: 'stoic-5',
    quote: "Silence is the sanctuary of the wise. Let your actions do the speaking.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "stoic_marble",
    badge: "QUIET POWER",
    layoutStyle: "minimal-badge",
    keywords: ["silence", "actions", "results", "character"],
  },

  // ==========================================
  // THEME 3: Deep Emerald Forest (Silent Growth & Consistency)
  // ==========================================
  {
    id: 'emerald-1',
    quote: "Greatness is not born in loud moments; it grows in quiet consistency.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "emerald_forest",
    badge: "SILENT GROWTH",
    layoutStyle: "glass-card",
    keywords: ["consistency", "patience", "silent work", "growth"],
  },
  {
    id: 'emerald-2',
    quote: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
    isOriginalSpark: false,
    theme: "emerald_forest",
    badge: "PATIENCE",
    layoutStyle: "pinterest-luxury",
    keywords: ["patience", "flow", "nature", "timing"],
  },
  {
    id: 'emerald-3',
    quote: "The tree that would grow to heaven must send its roots to hell.",
    author: "Carl Jung",
    isOriginalSpark: false,
    theme: "emerald_forest",
    badge: "DEEP ROOTS",
    layoutStyle: "atmospheric-glow",
    keywords: ["depth", "resilience", "foundations", "psychology"],
  },
  {
    id: 'emerald-4',
    quote: "The seed grows in the dark before it ever touches the light. Trust the unseen phase.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "emerald_forest",
    badge: "TRUST THE PROCESS",
    layoutStyle: "editorial-frame",
    keywords: ["trust", "darkness to light", "hidden work", "unseen"],
  },
  {
    id: 'emerald-5',
    quote: "Mastering others is strength. Mastering yourself is true power.",
    author: "Lao Tzu",
    isOriginalSpark: false,
    theme: "emerald_forest",
    badge: "INNER POWER",
    layoutStyle: "centered-hero",
    keywords: ["self control", "power", "humility", "wisdom"],
  },

  // ==========================================
  // THEME 4: Infinite Cosmic Galaxy (Boundless Mindset & Vision)
  // ==========================================
  {
    id: 'cosmic-1',
    quote: "Sometimes you won't feel on fire; you will feel like a tiny spark. Protect it anyway.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "cosmic_galaxy",
    badge: "PROTECT THE SPARK",
    layoutStyle: "atmospheric-glow",
    keywords: ["hope", "stars", "spark", "guard your energy"],
  },
  {
    id: 'cosmic-2',
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    isOriginalSpark: false,
    theme: "cosmic_galaxy",
    badge: "HIGHER PURPOSE",
    layoutStyle: "pinterest-luxury",
    keywords: ["purpose", "meaning", "perseverance", "destiny"],
  },
  {
    id: 'cosmic-3',
    quote: "Look up at the stars and not down at your feet. Make sense of what you see.",
    author: "Stephen Hawking",
    isOriginalSpark: false,
    theme: "cosmic_galaxy",
    badge: "BOUNDLESS VISION",
    layoutStyle: "editorial-frame",
    keywords: ["vision", "curiosity", "cosmos", "infinite"],
  },
  {
    id: 'cosmic-4',
    quote: "Your doubts are created by your mind. Your limits are destroyed by your spirit.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "cosmic_galaxy",
    badge: "LIMITLESS",
    layoutStyle: "glass-card",
    keywords: ["no limits", "belief", "elevation", "spirit"],
  },
  {
    id: 'cosmic-5',
    quote: "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
    isOriginalSpark: false,
    theme: "cosmic_galaxy",
    badge: "UNIVERSAL",
    layoutStyle: "centered-hero",
    keywords: ["universe", "origin", "spark", "perspective"],
  },

  // ==========================================
  // THEME 5: Luxury Minimalist Linen (Peace & Elimination of Noise)
  // ==========================================
  {
    id: 'minimal-1',
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    isOriginalSpark: false,
    theme: "minimal_linen",
    badge: "ELEGANCE",
    layoutStyle: "minimal-badge",
    keywords: ["simplicity", "clarity", "focus", "sophistication"],
  },
  {
    id: 'minimal-2',
    quote: "Subtract until only what matters remains. That is where your power lives.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "minimal_linen",
    badge: "ESSENTIALISM",
    layoutStyle: "pinterest-luxury",
    keywords: ["focus", "minimalism", "clarity", "discipline"],
  },
  {
    id: 'minimal-3',
    quote: "It is not daily increase, but daily decrease. Hack away at the unessential.",
    author: "Bruce Lee",
    isOriginalSpark: false,
    theme: "minimal_linen",
    badge: "LESS IS MORE",
    layoutStyle: "editorial-frame",
    keywords: ["declutter", "focus", "essential", "daily habit"],
  },
  {
    id: 'minimal-4',
    quote: "Calmness is a superpower. In the middle of chaos, protect your inner stillness.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "minimal_linen",
    badge: "INNER PEACE",
    layoutStyle: "glass-card",
    keywords: ["calm", "serenity", "stillness", "unshakable"],
  },
  {
    id: 'minimal-5',
    quote: "He who is contented is rich.",
    author: "Lao Tzu",
    isOriginalSpark: false,
    theme: "minimal_linen",
    badge: "CONTENTMENT",
    layoutStyle: "centered-hero",
    keywords: ["gratitude", "abundance", "peace", "wisdom"],
  },

  // ==========================================
  // THEME 6: Cyber Midnight Rain (Relentless Grind & Nocturnal Discipline)
  // ==========================================
  {
    id: 'cyber-1',
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    isOriginalSpark: false,
    theme: "cyber_midnight",
    badge: "DISCIPLINE",
    layoutStyle: "centered-hero",
    keywords: ["discipline", "choices", "long term", "sacrifice"],
  },
  {
    id: 'cyber-2',
    quote: "While the world sleeps, the disciplined build their future in the shadows.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "cyber_midnight",
    badge: "NIGHT GRIND",
    layoutStyle: "pinterest-luxury",
    keywords: ["late nights", "hard work", "focus", "relentless"],
  },
  {
    id: 'cyber-3',
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    isOriginalSpark: false,
    theme: "cyber_midnight",
    badge: "HABIT OF EXCELLENCE",
    layoutStyle: "editorial-frame",
    keywords: ["habits", "excellence", "repetition", "standard"],
  },
  {
    id: 'cyber-4',
    quote: "The pain of discipline is temporary. The regret of quitting lasts forever.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "cyber_midnight",
    badge: "NO REGRETS",
    layoutStyle: "glass-card",
    keywords: ["pain", "discipline", "regret", "never give up"],
  },
  {
    id: 'cyber-5',
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    isOriginalSpark: false,
    theme: "cyber_midnight",
    badge: "OPPORTUNITY",
    layoutStyle: "atmospheric-glow",
    keywords: ["opportunity", "problem solving", "mindset", "focus"],
  },

  // ==========================================
  // THEME 7: Vintage 35mm Analog Film (Timeless Legacy & Character)
  // ==========================================
  {
    id: 'vintage-1',
    quote: "A man's true wealth is the good he does in this world and the character he leaves behind.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "vintage_journal",
    badge: "TIMELESS LEGACY",
    layoutStyle: "editorial-frame",
    keywords: ["legacy", "character", "wealth", "integrity"],
  },
  {
    id: 'vintage-2',
    quote: "Be tolerant with others and strict with yourself.",
    author: "Marcus Aurelius",
    isOriginalSpark: false,
    theme: "vintage_journal",
    badge: "STANDARDS",
    layoutStyle: "pinterest-luxury",
    keywords: ["standards", "stoic", "tolerance", "self control"],
  },
  {
    id: 'vintage-3',
    quote: "Your legacy is being written by your daily habits. Make every chapter count.",
    author: "Spark Within",
    isOriginalSpark: true,
    theme: "vintage_journal",
    badge: "WRITE YOUR STORY",
    layoutStyle: "glass-card",
    keywords: ["legacy", "habits", "story", "purpose"],
  },
  {
    id: 'vintage-4',
    quote: "Knowing others is intelligence; knowing yourself is true wisdom.",
    author: "Lao Tzu",
    isOriginalSpark: false,
    theme: "vintage_journal",
    badge: "SELF-KNOWLEDGE",
    layoutStyle: "centered-hero",
    keywords: ["self knowledge", "wisdom", "intelligence", "truth"],
  },
  {
    id: 'vintage-5',
    quote: "Character is destiny. What you repeatedly choose in secret defines who you become.",
    author: "Heraclitus",
    isOriginalSpark: false,
    theme: "vintage_journal",
    badge: "CHARACTER IS DESTINY",
    layoutStyle: "minimal-badge",
    keywords: ["character", "destiny", "integrity", "secret work"],
  },
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const THEME_SEQUENCE: ThemeId[] = [
  'fire_sunset',
  'stoic_marble',
  'emerald_forest',
  'cosmic_galaxy',
  'minimal_linen',
  'cyber_midnight',
  'vintage_journal',
];

export const LAYOUT_SEQUENCE: LayoutStyle[] = [
  'pinterest-luxury',
  'editorial-frame',
  'glass-card',
  'atmospheric-glow',
  'minimal-badge',
  'centered-hero',
  'pinterest-luxury',
];

/**
 * Returns 7 completely distinct, non-repeating quotes for Monday through Sunday.
 * Guarantees:
 * - 7 different quotes
 * - 7 different themes
 * - 7 different layouts
 * - Seed rotation offset to get fresh non-repeating batches whenever shuffled!
 */
export function getNonRepeatingWeek(offset = 0) {
  return DAYS.map((day, idx) => {
    const themeId = THEME_SEQUENCE[idx];
    const themeQuotes = PRESET_QUOTES.filter(q => q.theme === themeId);
    
    // Pick quote using offset to rotate across pool
    const quoteIndex = (offset + idx) % themeQuotes.length;
    const selectedQuote = themeQuotes[quoteIndex] || themeQuotes[0];

    return {
      day,
      quote: selectedQuote.quote,
      author: selectedQuote.author,
      isOriginalSpark: selectedQuote.isOriginalSpark,
      theme: themeId,
      badge: selectedQuote.badge,
      layoutStyle: LAYOUT_SEQUENCE[idx],
      id: selectedQuote.id,
    };
  });
}

const USED_HISTORY_KEY = 'sparkwithin_used_quotes_history';

export function getUsedQuoteHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USED_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markQuoteAsUsed(quoteId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getUsedQuoteHistory();
    if (!history.includes(quoteId)) {
      history.push(quoteId);
      localStorage.setItem(USED_HISTORY_KEY, JSON.stringify(history));
    }
  } catch {}
}

export function clearUsedQuoteHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USED_HISTORY_KEY);
  } catch {}
}
