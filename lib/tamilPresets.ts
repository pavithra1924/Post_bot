export interface TamilQuoteItem {
  id: string;
  quote: string;
  author: string;
  category: 'thirukkural' | 'bharathiyar' | 'kalam' | 'vivekananda' | 'wisdom' | 'cinema';
  categoryTamil: string;
  explanationTamil: string;
  bgKeyword: string;
}

export const TAMIL_PRESET_QUOTES: TamilQuoteItem[] = [
  // 1. திருக்குறள் (Thirukkural)
  {
    id: 'kural-1',
    quote: 'முயற்சி திருவினை ஆக்கும் முயற்றின்மை\nஇன்மை புகுத்தி விடும்.',
    author: 'திருவள்ளுவர் (திருக்குறள்)',
    category: 'thirukkural',
    categoryTamil: '📜 திருக்குறள்',
    explanationTamil: 'விடாமுயற்சி ஒருவருக்கு அளவற்ற செல்வத்தையும் வெற்றியையும் தரும்; முயற்சியற்ற சோம்பல் ஒருவனை வறுமையிலும் தோல்வியிலும் தள்ளிவிடும்.',
    bgKeyword: 'temple-stone',
  },
  {
    id: 'kural-2',
    quote: 'உள்ளுவதெல்லாம் உயர்வுள்ளல் மற்றது\nதள்ளினும் தள்ளாமை நீர்த்து.',
    author: 'திருவள்ளுவர் (திருக்குறள்)',
    category: 'thirukkural',
    categoryTamil: '📜 திருக்குறள்',
    explanationTamil: 'எப்போதும் உயர்ந்த லட்சியங்களையே எண்ணுங்கள்; ஒருவேளை அந்த லட்சியம் உடனடியாக கைகூடாவிட்டாலும் கூட, அந்த உயர்ந்த எண்ணமே உங்களை வெற்றியாளராக மாற்றும்.',
    bgKeyword: 'gold-mountain',
  },
  {
    id: 'kural-3',
    quote: 'வெள்ளத் தனைய மலர்நீட்டம் மாந்தர்தம்\nஉள்ளத் தனைய துயர்வு.',
    author: 'திருவள்ளுவர் (திருக்குறள்)',
    category: 'thirukkural',
    categoryTamil: '📜 திருக்குறள்',
    explanationTamil: 'நீரின் உயரத்திற்கு ஏற்பவே தாமரை மலர் உயர்ந்து நிற்கும்; அதுபோல ஒரு மனிதனின் மன உறுதியின் அளவிற்கு ஏற்பவே அவனது வாழ்க்கை உயரும்.',
    bgKeyword: 'lotus-water',
  },
  {
    id: 'kural-4',
    quote: 'தெய்வத்தான் ஆகா தெனினும் முயற்சிதன்\nமெய்வருத்தக் கூலி தரும்.',
    author: 'திருவள்ளுவர் (திருக்குறள்)',
    category: 'thirukkural',
    categoryTamil: '📜 திருக்குறள்',
    explanationTamil: 'விதியே உங்களை தடுத்தாலும் கூட, உங்கள் உடலை வருத்தி நீங்கள் செய்யும் உழைப்பு அதற்கான பலனை ஒருபோதும் கொடுக்காமல் போகாது.',
    bgKeyword: 'fire-forge',
  },
  {
    id: 'kural-5',
    quote: 'இடும்பைக்கு இடும்பை படுப்பர் இடும்பைக்கு\nஇடும்பை படாஅ தவர்.',
    author: 'திருவள்ளுவர் (திருக்குறள்)',
    category: 'thirukkural',
    categoryTamil: '📜 திருக்குறள்',
    explanationTamil: 'துன்பம் வரும் போது துவண்டு போகாத மன உறுதி கொண்டவர்கள், அந்த துன்பத்திற்கே துன்பத்தை உண்டாக்கி அதை வெற்றி கொள்வார்கள்.',
    bgKeyword: 'storm-cliff',
  },

  // 2. மகாகவி பாரதியார் (Bharathiyar)
  {
    id: 'bharathi-1',
    quote: 'வீழ்வேனென்று நினைத்தாயோ!\nபுதிதாய் பிறப்பெடுப்பேன்!',
    author: 'மகாகவி பாரதியார்',
    category: 'bharathiyar',
    categoryTamil: '🔥 பாரதியார் வரிகள்',
    explanationTamil: 'எத்தனை தோல்விகள் வந்தாலும், எத்தனை தடைகள் சூழ்ந்தாலும் சரி—என்னை வீழ்த்திவிட்டதாக உலகம் நினைத்தால், நான் சாம்பலில் இருந்து மீண்டும் எழும் பீனிக்ஸ் பறவை போல எழுவேன்!',
    bgKeyword: 'phoenix-fire',
  },
  {
    id: 'bharathi-2',
    quote: 'ரௌத்திரம் பழகு...\nஅச்சமில்லை அச்சமில்லை\nஅச்சமென்பதில்லையே!',
    author: 'மகாகவி பாரதியார்',
    category: 'bharathiyar',
    categoryTamil: '🔥 பாரதியார் வரிகள்',
    explanationTamil: 'அநீதியைக் கண்டும், உங்கள் முன்னேற்றத்தை தடுக்கும் சோம்பலைக் கண்டும் உங்கள் உள்ளத்தில் நியாயமான கோபத்தை மூட்டுங்கள். பயத்தை அறவே வேரறுத்து முன்னேறுங்கள்.',
    bgKeyword: 'warrior-sunset',
  },
  {
    id: 'bharathi-3',
    quote: 'நிமிர்ந்த நன்னடை நேர்கொண்ட பார்வையும்,\nநிலத்தில் யார்க்கும் அஞ்சாத நெறிகளும்!',
    author: 'மகாகவி பாரதியார்',
    category: 'bharathiyar',
    categoryTamil: '🔥 பாரதியார் வரிகள்',
    explanationTamil: 'தலைகுனியாத நிமிர்ந்த நடையும், தைரியமான பார்வையும், எவருக்கும் பயப்படாத சுயமரியாதையும் கொண்ட மனிதனே உண்மையான வெற்றிக்கு தகுதியானவன்.',
    bgKeyword: 'marble-statue',
  },
  {
    id: 'bharathi-4',
    quote: 'விடியும் வரை காத்திரு,\nவெளிச்சம் தானே வரும்!\nமுயற்சியை மட்டும் கைவிடாதே!',
    author: 'மகாகவி பாரதியார்',
    category: 'bharathiyar',
    categoryTamil: '🔥 பாரதியார் வரிகள்',
    explanationTamil: 'இரவின் காரிருள் எவ்வளவு அடர்த்தியாக இருந்தாலும் காலை விடியலை யாராலும் தடுக்க முடியாது. உங்கள் வாழ்க்கையின் வெற்றிக்கும் இதே விதி தான் பொருந்தும்.',
    bgKeyword: 'dawn-sun',
  },

  // 3. டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம் (APJ Abdul Kalam)
  {
    id: 'kalam-1',
    quote: 'கனவு என்பது நீங்கள் தூங்கும் போது காண்பதல்ல;\nஉங்களைத் தூங்க விடாமல் செய்வதே உண்மையான கனவு!',
    author: 'டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம்',
    category: 'kalam',
    categoryTamil: '🚀 அப்துல் கலாம் பொன்மொழிகள்',
    explanationTamil: 'ஒரு மனிதனின் இலக்கு உண்மையானதாக இருந்தால், அது அவனுக்குள் ஒரு நெருப்பை உண்டாக்கும்; சோம்பலையும் தூக்கத்தையும் விரட்டி உழைக்க வைக்கும்.',
    bgKeyword: 'space-stars',
  },
  {
    id: 'kalam-2',
    quote: 'உன் கைரேகையை பார்த்து எதிர்காலத்தை தீர்மானிக்காதே;\nஏனென்றால் கையே இல்லாதவனுக்கும் எதிர்காலம் உண்டு!',
    author: 'டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம்',
    category: 'kalam',
    categoryTamil: '🚀 அப்துல் கலாம் பொன்மொழிகள்',
    explanationTamil: 'ஜாதகமும் அதிர்ஷ்டமும் உங்கள் எதிர்காலத்தை எழுத முடியாது. உங்கள் கரங்களால் சிந்தப்படும் வியர்வையும், தளராத நம்பிக்கையுமே உங்கள் விதியை உருவாக்கும்.',
    bgKeyword: 'silhouette-peak',
  },
  {
    id: 'kalam-3',
    quote: 'முதல் வெற்றியை அடைந்தவுடன் ஓய்வெடுத்து விடாதீர்கள்;\nஇரண்டாவது முயற்சியில் தோற்றால், முதல் வெற்றி அதிர்ஷ்டம் என்பார்கள்!',
    author: 'டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம்',
    category: 'kalam',
    categoryTamil: '🚀 அப்துல் கலாம் பொன்மொழிகள்',
    explanationTamil: 'தொடர்ச்சியான நிலைத்தன்மை தான் ஒரு வெற்றியாளனை ஜாம்பவானாக மாற்றுகிறது. ஒருமுறை வெல்வது எளிது, தொடர்ந்து வெல்வதற்கே ஒழுக்கம் தேவை.',
    bgKeyword: 'golden-trophy',
  },
  {
    id: 'kalam-4',
    quote: 'சூரியனைப் போல பிரகாசிக்க விரும்பினால்,\nமுதலில் சூரியனைப் போல எரியக் கற்றுக்கொள்!',
    author: 'டாக்டர் ஏ.பி.ஜே. அப்துல் கலாம்',
    category: 'kalam',
    categoryTamil: '🚀 அப்துல் கலாம் பொன்மொழிகள்',
    explanationTamil: 'வெற்றி தரும் வெளிச்சம் எல்லோரையும் ஈர்க்கும், ஆனால் அந்த வெளிச்சத்திற்குப் பின்னால் இருக்கும் கஷ்டங்களையும் கடுமையான தியாகங்களையும் ஏற்றுக்கொள்ளத் தயாராக இருங்கள்.',
    bgKeyword: 'burning-sun',
  },

  // 4. சுவாமி விவேகானந்தர் (Swami Vivekananda)
  {
    id: 'viveka-1',
    quote: 'எழுமின், விழுமின்!\nஉங்கள் குறிக்கோளை எட்டும் வரை\nநில்லாது உழையுமின்!',
    author: 'சுவாமி விவேகானந்தர்',
    category: 'vivekananda',
    categoryTamil: '🧘 சுவாமி விவேகானந்தர்',
    explanationTamil: 'சோம்பலையும் தயக்கத்தையும் தூக்கி எறியுங்கள். நீங்கள் அடைய நினைத்த இலக்கு உங்கள் கைகளில் கிடைக்கும் வரை உங்கள் பயணத்தை எந்த காரணத்திற்காகவும் நிறுத்தாதீர்கள்.',
    bgKeyword: 'mountain-summit',
  },
  {
    id: 'viveka-2',
    quote: 'உன்னை நீயே பலவீனன் என்று நினைப்பதே\nஉலகத்தின் மிகப்பெரிய பாவம்!',
    author: 'சுவாமி விவேகானந்தர்',
    category: 'vivekananda',
    categoryTamil: '🧘 சுவாமி விவேகானந்தர்',
    explanationTamil: 'உங்கள் மனதிற்குள் இருக்கும் அளப்பரிய ஆற்றலை நீங்கள் உணராமல் சந்தேகப்படுவதே உங்களின் உண்மையான தோல்வி. உங்களுக்குள் எல்லையற்ற சக்தி உள்ளது.',
    bgKeyword: 'inner-light',
  },
  {
    id: 'viveka-3',
    quote: 'உன்னால் முடியும் என்றால் உலகம் உன்னை வணங்கும்;\nமுடியாது என்று தயங்கினால் உலகம் உன்னை தூக்கி எறியும்!',
    author: 'சுவாமி விவேகானந்தர்',
    category: 'vivekananda',
    categoryTamil: '🧘 சுவாமி விவேகானந்தர்',
    explanationTamil: 'துணிச்சலும் தன்னம்பிக்கையும் உள்ள மனிதனுக்கே காலம் தலைவணங்குகிறது. எப்போது நீங்கள் தைரியமாக அடியெடுத்து வைக்கிறீர்களோ, அப்போது தடைகள் விலகும்.',
    bgKeyword: 'ocean-wave',
  },

  // 5. வாழ்வியல் தத்துவங்கள் & உழைப்பு (Wisdom & Discipline)
  {
    id: 'wisdom-1',
    quote: 'தீயில் விழுந்த விதை கூட\nமுளைக்கும் வரை சாம்பலை சுமக்கத்தான் வேண்டும்!',
    author: 'Spark Within (உள் ஒளி)',
    category: 'wisdom',
    categoryTamil: '💎 வாழ்வியல் தத்துவங்கள்',
    explanationTamil: 'கஷ்டங்களும் அவமானங்களும் உங்களை அழிக்க வரவில்லை; அவை உங்களை செதுக்கி ஒரு வலிமையான விருட்சமாக மாற்றுவதற்காகவே வருகின்றன.',
    bgKeyword: 'ember-seed',
  },
  {
    id: 'wisdom-2',
    quote: 'இருளில் இருக்கும் போது தான் நாம் எந்த அளவிற்கு\nவெளிச்சமாக மாற முடியும் என்று புரியும்!',
    author: 'Spark Within (உள் ஒளி)',
    category: 'wisdom',
    categoryTamil: '💎 வாழ்வியல் தத்துவங்கள்',
    explanationTamil: 'வாழ்க்கையின் மிகக்கடினமான காலகட்டங்களே உங்கள் உண்மையான பலத்தை உங்களுக்குக் காட்டும் சிறந்த பாடசாலைகள். அமைதியாகப் போராடுங்கள்.',
    bgKeyword: 'dark-neon',
  },
  {
    id: 'wisdom-3',
    quote: 'அமைதியாக உழை...\nஉன் வெற்றி உலகத்தின் காதுகளில்\nபேரிடியாய் முழங்கட்டும்!',
    author: 'Spark Within (உள் ஒளி)',
    category: 'wisdom',
    categoryTamil: '💎 வாழ்வியல் தத்துவங்கள்',
    explanationTamil: 'உங்கள் திட்டங்களை யாரிடமும் விளக்கி நேரத்தை வீணடிக்காதீர்கள். எந்த சத்தமும் இல்லாமல் உங்கள் பாதையில் பயணியுங்கள்; உங்கள் வெற்றி பதில் சொல்லும்.',
    bgKeyword: 'silent-forest',
  },
  {
    id: 'wisdom-4',
    quote: 'காயம் பட்ட இடத்திலிருந்து தான்\nவலிமையான மனிதன் பிறக்கிறான்!',
    author: 'Spark Within (உள் ஒளி)',
    category: 'wisdom',
    categoryTamil: '💎 வாழ்வியல் தத்துவங்கள்',
    explanationTamil: 'வலி உங்களை பலவீனப்படுத்தாது; அந்த வலியை நீங்கள் எப்படி கடந்து வருகிறீர்கள் என்பதே உங்களை இந்த உலகத்தின் மாவீரனாக மாற்றும்.',
    bgKeyword: 'iron-shield',
  },

  // 6. சினிமா பஞ்ச் மோட்டிவேஷன் வரிகள் (Cinema Motivation)
  {
    id: 'cinema-1',
    quote: 'என் வழி தனி வழி!\nகஷ்டப்படாம எதுவும் கிடைக்காது,\nகஷ்டப்படாம கிடைக்கிறது என்னைக்குமே நிலைக்காது!',
    author: 'சூப்பர் ஸ்டார் ரஜினிகாந்த் (படையப்பா)',
    category: 'cinema',
    categoryTamil: '🎬 மாஸ் சினிமா வரிகள்',
    explanationTamil: 'பிறர் நடக்கும் பாதையில் கண்மூடித்தனமாக ஓடாதீர்கள். உங்கள் சொந்த உழைப்பால் உங்கள் பாதையை உருவாக்குங்கள். உழைத்து சம்பாதித்த வெற்றியே நிலையானது.',
    bgKeyword: 'lion-gold',
  },
  {
    id: 'cinema-2',
    quote: 'வெற்றி நிச்சயம், வேடிக்கை பாரு!\nநீ யாராக இருந்தாலும் சரி,\nஉன் உழைப்பு தான் உன் அடையாளம்!',
    author: 'தளபதி விஜய் (கில்லி / மாஸ்டர்)',
    category: 'cinema',
    categoryTamil: '🎬 மாஸ் சினிமா வரிகள்',
    explanationTamil: 'பின்னணி என்னவாக இருந்தாலும் உங்கள் உழைப்பும் தன்னம்பிக்கையும் உங்களை முதலிடத்தில் அமர வைக்கும். விமர்சனங்களை புறந்தள்ளி இலக்கில் நில்லுங்கள்.',
    bgKeyword: 'stadium-lights',
  },
  {
    id: 'cinema-3',
    quote: 'வாழு, வாழ விடு!\nதோல்வி என்பது முடிவல்ல,\nஅது அடுத்த வெற்றிக்கான பாடம்!',
    author: 'அஜித் குமார் (மங்காத்தா / விவேகம்)',
    category: 'cinema',
    categoryTamil: '🎬 மாஸ் சினிமா வரிகள்',
    explanationTamil: 'வீழ்ச்சிகளை கண்டு ஒருபோதும் மண்டியிடாதீர்கள். எழுந்து நில்லுங்கள், உங்களை வீழ்த்திய தடைகளையே உங்கள் அடுத்த வெற்றிக்கான படிக்கட்டுகளாக மாற்றுங்கள்.',
    bgKeyword: 'bullet-speed',
  },
];

// 52 Curated Tamil Viral Hashtags
export const TAMIL_HASHTAG_BANK = {
  caption: [
    '#தமிழ்', '#தமிழ்வரிகள்', '#தன்னம்பிக்கை', '#வெற்றி', '#முயற்சி',
    '#வாழ்வியல்', '#பாரதியார்', '#திருக்குறள்', '#அப்துல்கலாம்', '#விவேகானந்தர்',
    '#தமிழ்வாழ்க்கை', '#sparkwithin', '#tamilquotes', '#tamilmotivation', '#tamilstatus',
    '#tamilmotivationalquotes', '#chennai', '#tamilnadu', '#tamillove', '#motivationalquotes',
    '#innerfire', '#discipline', '#positivevibes', '#tamilsongs', '#tamilcinema',
    '#tamilbgm', '#tamillyrics', '#tamilan', '#kavithai', '#tamilkavithai'
  ],
  firstComment: [
    '#tamilinspiration', '#tamilwriters', '#tamilquotespage', '#tamillines', '#tamilliterature',
    '#tamildialogue', '#tamilpoetry', '#tamilspeech', '#tamilstatusvideos', '#tamilreels',
    '#tamilcreator', '#tamilvideo', '#tamilmusic', '#tamilwhatsappstatus', '#tamiltrends',
    '#tamilgoals', '#vetri', '#valkai', '#thannambikkai', '#sparkwithinhub',
    '#tamilpositivity', '#tamilmindset'
  ]
};

const STORAGE_KEY_TAMIL = 'sparkwithin_used_tamil_quotes_v1';

export function getUsedTamilQuoteHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TAMIL);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function markTamilQuoteAsUsed(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getUsedTamilQuoteHistory();
    if (!history.includes(id)) {
      history.push(id);
      localStorage.setItem(STORAGE_KEY_TAMIL, JSON.stringify(history));
    }
  } catch (_) {}
}

export function clearTamilQuoteHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_TAMIL);
  } catch (_) {}
}

export const TAMIL_WEEK_DAYS = [
  'திங்கள் (Monday)',
  'செவ்வாய் (Tuesday)',
  'புதன் (Wednesday)',
  'வியாழன் (Thursday)',
  'வெள்ளி (Friday)',
  'சனி (Saturday)',
  'ஞாயிறு (Sunday)'
];

export function getNonRepeatingTamilWeek(offset: number = 0): (TamilQuoteItem & { day: string; layoutStyle: 'luxury-gold' | 'frosted-glass' | 'magazine-frame' | 'minimal-dark' })[] {
  const layouts: ('luxury-gold' | 'frosted-glass' | 'magazine-frame' | 'minimal-dark')[] = [
    'luxury-gold',
    'frosted-glass',
    'magazine-frame',
    'minimal-dark',
    'luxury-gold',
    'frosted-glass',
    'magazine-frame'
  ];

  const categories: TamilQuoteItem['category'][] = [
    'thirukkural',
    'bharathiyar',
    'kalam',
    'vivekananda',
    'wisdom',
    'cinema',
    'thirukkural'
  ];

  return TAMIL_WEEK_DAYS.map((day, idx) => {
    const targetCat = categories[idx];
    const pool = TAMIL_PRESET_QUOTES.filter(q => q.category === targetCat);
    const chosenIndex = (offset + idx) % (pool.length || 1);
    const item = pool[chosenIndex] || TAMIL_PRESET_QUOTES[(offset + idx) % TAMIL_PRESET_QUOTES.length];
    return {
      ...item,
      day,
      layoutStyle: layouts[idx]
    };
  });
}
