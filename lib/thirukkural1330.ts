import rawKurals from '@/data/thirukkural1330.json';
import { THIRUKKURAL_LIBRARY, ThirukkuralItem } from './tamilWisdomLibrary';

export interface Thirukkural1330Item {
  id: string;
  number: number;
  line1: string;
  line2: string;
  verse: string;
  chapterNumber: number;
  chapter: string;
  chapterTranslation: string;
  section: string;
  simpleExplanation: string;
  deepMeaning: string;
  translation: string;
  englishExplanation: string;
  lifeExample: string;
  dailyThought: string;
  hookTitle: string;
  author: 'திருவள்ளுவர்';
  brand: 'Spark Within';
  handle: '@_sparkwithin_hub_';
  suggestedTheme: 'gold_luxury' | 'midnight_blue' | 'zen_emerald' | 'royal_crimson';
}

export interface ThirukkuralChapter {
  number: number;
  name: string;
  translation: string;
  section: string;
  startNumber: number;
  endNumber: number;
}

// Curated map for instant lookup of hand-crafted gems
const curatedMap = new Map<number, ThirukkuralItem>();
THIRUKKURAL_LIBRARY.forEach((item) => {
  curatedMap.set(item.number, item);
});

// Helper to construct life example based on section & chapter
function createLifeExample(section: string, chapter: string, simpleExplanation: string): string {
  if (section === 'அறத்துப்பால்') {
    return `அன்றாட வாழ்வில் நேர்மையோடும் அறவழியோடும் நடக்கும்போது பல சோதனைகள் வரலாம்; ஆயினும் இந்த குறள் காட்டும் நற்பண்புகளைக் கடைபிடிப்பதே நிலையான மன அமைதியையும் நற்பெயரையும் தரும்.`;
  }
  if (section === 'பொருட்பால்') {
    return `தொழில், வேலை மற்றும் சமூக வாழ்வில் தடைகள் வந்தாலும் சோர்ந்து போகாமல், இந்த குறளின் ஞானத்தை வழிகாட்டியாகக் கொண்டு திட்டமிட்டு உழைப்பதே சிறந்த வெற்றியைத் தரும்.`;
  }
  return `வாழ்க்கைத் துணையிடமும் அன்புக்குரியவர்களிடமும் பரிவும், பரஸ்பர மரியாதையும், விட்டுக்கொடுக்கும் மனமும் கொண்டு வாழ்வதே இல்லற வாழ்வின் உண்மையான இன்பமாகும்.`;
}

// Helper to construct daily actionable reflection
function createDailyThought(kuralNum: number, chapter: string): string {
  return `இன்றைய நாளில் குறள் #${kuralNum} காட்டும் நல்வழியை மனதில் நிறுத்தி, உங்கள் செயல்களில் உண்மையோடும் விடாமுயற்சியோடும் ஈடுபடுங்கள்.\n\nதினசரி வாழ்வியல் சிந்தனைகளுக்கு பின்தொடரவும்: @_sparkwithin_hub_`;
}

const themeRotation: ('gold_luxury' | 'midnight_blue' | 'zen_emerald' | 'royal_crimson')[] = [
  'gold_luxury',
  'midnight_blue',
  'zen_emerald',
  'royal_crimson',
];

// Complete 1,330 Kurals dataset with rich 5-slide fields
export const ALL_1330_KURALS: Thirukkural1330Item[] = (rawKurals as any[]).map((k, index) => {
  const num = k.number || index + 1;
  const curated = curatedMap.get(num);

  if (curated) {
    return {
      id: `kural-${num}`,
      number: num,
      line1: k.line1 || curated.verse.split('\n')[0] || '',
      line2: k.line2 || curated.verse.split('\n')[1] || '',
      verse: curated.verse,
      chapterNumber: k.chapterNumber || Math.floor((num - 1) / 10) + 1,
      chapter: curated.chapter || k.chapter,
      chapterTranslation: k.chapterTranslation || '',
      section: curated.section || k.section,
      simpleExplanation: curated.simpleExplanation,
      deepMeaning: curated.deepMeaning,
      translation: k.translation || '',
      englishExplanation: k.englishExplanation || '',
      lifeExample: curated.lifeExample,
      dailyThought: curated.dailyThought,
      hookTitle: curated.hookTitle,
      author: 'திருவள்ளுவர்',
      brand: 'Spark Within',
      handle: '@_sparkwithin_hub_',
      suggestedTheme: curated.suggestedTheme || 'gold_luxury',
    };
  }

  const chNum = k.chapterNumber || Math.floor((num - 1) / 10) + 1;
  const section = k.section || (chNum <= 38 ? 'அறத்துப்பால்' : chNum <= 108 ? 'பொருட்பால்' : 'காமத்துப்பால்');
  const simpleExp = (k.simpleExplanation || k.deepMeaning || '').trim();
  const deepExp = (k.deepMeaning || k.simpleExplanation || '').trim();

  return {
    id: `kural-${num}`,
    number: num,
    line1: k.line1,
    line2: k.line2,
    verse: k.verse || `${k.line1}\n${k.line2}`,
    chapterNumber: chNum,
    chapter: k.chapter,
    chapterTranslation: k.chapterTranslation,
    section,
    simpleExplanation: simpleExp,
    deepMeaning: deepExp,
    translation: k.translation,
    englishExplanation: k.englishExplanation,
    lifeExample: createLifeExample(section, k.chapter, simpleExp),
    dailyThought: createDailyThought(num, k.chapter),
    hookTitle: `${k.chapter} — குறள் #${num}`,
    author: 'திருவள்ளுவர்',
    brand: 'Spark Within',
    handle: '@_sparkwithin_hub_',
    suggestedTheme: themeRotation[(num - 1) % themeRotation.length],
  };
});

// Cache map by number for O(1) lookup
const kuralByNumberMap = new Map<number, Thirukkural1330Item>();
ALL_1330_KURALS.forEach((k) => kuralByNumberMap.set(k.number, k));

export function getKuralByNumber(num: number): Thirukkural1330Item {
  const clamped = Math.max(1, Math.min(1330, num));
  return kuralByNumberMap.get(clamped) || ALL_1330_KURALS[0];
}

// Generate the 133 chapters array for chapter filtering
export const ALL_133_CHAPTERS: ThirukkuralChapter[] = Array.from({ length: 133 }, (_, idx) => {
  const chNum = idx + 1;
  const startNum = (chNum - 1) * 10 + 1;
  const sampleKural = getKuralByNumber(startNum);
  return {
    number: chNum,
    name: sampleKural.chapter,
    translation: sampleKural.chapterTranslation,
    section: sampleKural.section,
    startNumber: startNum,
    endNumber: chNum * 10,
  };
});

export const THIRUKKURAL_SECTIONS = [
  { id: 'all', label: 'அனைத்தும் (All 1330)', count: 1330 },
  { id: 'அறத்துப்பால்', label: '1. அறத்துப்பால் (Virtue 1-380)', count: 380 },
  { id: 'பொருட்பால்', label: '2. பொருட்பால் (Wealth 381-1080)', count: 700 },
  { id: 'காமத்துப்பால்', label: '3. காமத்துப்பால் (Love 1081-1330)', count: 250 },
] as const;
