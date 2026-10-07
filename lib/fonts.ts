export interface FontOption {
  name: string;
  label: string;
  category: 'sans' | 'serif' | 'mono' | 'display';
  weights: number[];
  italic?: boolean;
}

export const FONT_OPTIONS: FontOption[] = [
  // Sans-Serif
  { name: 'Montserrat', label: 'Montserrat (Bold Impact)', category: 'sans', weights: [400, 700, 900] },
  { name: 'Inter', label: 'Inter (Modern & Clean)', category: 'sans', weights: [400, 600, 800] },
  { name: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Airy)', category: 'sans', weights: [400, 600, 700] },
  { name: 'Oswald', label: 'Oswald (Condensed Heavy)', category: 'sans', weights: [500, 700] },
  { name: 'Bebas Neue', label: 'Bebas Neue (Poster Bold)', category: 'sans', weights: [400] },

  // Serif
  { name: 'Playfair Display', label: 'Playfair Display (Editorial)', category: 'serif', weights: [400, 700, 900], italic: true },
  { name: 'Cinzel', label: 'Cinzel (Classical Roman)', category: 'serif', weights: [400, 700] },
  { name: 'Cormorant Garamond', label: 'Cormorant Garamond (Poetic)', category: 'serif', weights: [400, 600, 700], italic: true },
  { name: 'Libre Baskerville', label: 'Libre Baskerville (Timeless Book)', category: 'serif', weights: [400, 700], italic: true },
  { name: 'EB Garamond', label: 'EB Garamond (Literary Classic)', category: 'serif', weights: [400, 600, 700], italic: true },
  { name: 'Merriweather', label: 'Merriweather (Warm Serif)', category: 'serif', weights: [400, 700, 900] },

  // Monospace
  { name: 'Space Mono', label: 'Space Mono (Cyber Terminal)', category: 'mono', weights: [400, 700] },
  { name: 'JetBrains Mono', label: 'JetBrains Mono (Developer)', category: 'mono', weights: [400, 700] },
  { name: 'Fira Code', label: 'Fira Code (Code Aesthetic)', category: 'mono', weights: [400, 700] },

  // Display
  { name: 'Caveat', label: 'Caveat (Handwritten Signature)', category: 'display', weights: [400, 700] },
  { name: 'Abril Fatface', label: 'Abril Fatface (High Glamour)', category: 'display', weights: [400] },
];

const loadedFonts = new Set<string>();

/**
 * Dynamically loads a Google Font into the page and ensures the browser rasterizer is ready.
 */
export async function loadGoogleFont(fontName: string, weight = 700): Promise<void> {
  if (typeof window === 'undefined') return;

  const cacheKey = `${fontName}-${weight}`;
  if (loadedFonts.has(cacheKey)) return;

  const encodedName = fontName.replace(/ /g, '+');
  const linkId = `google-font-${encodedName}`;

  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodedName}:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap`;
    document.head.appendChild(link);
  }

  try {
    if ('fonts' in document) {
      await (document as any).fonts.load(`${weight} 16px "${fontName}"`);
    }
  } catch (err) {
    console.warn(`Font load warning for ${fontName}:`, err);
  }

  loadedFonts.add(cacheKey);
}
