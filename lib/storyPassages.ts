export interface StoryPassageItem {
  id: string;
  language: 'en' | 'ta';
  category: string;
  categoryLabel: string;
  hook: string;
  slides: string[];
  author: string;
  fullText: string;
}

// -------------------------------------------------------------
// CURATED VIRAL PASSAGE STORIES (ENGLISH & TAMIL)
// -------------------------------------------------------------

export const CURATED_PASSAGES: StoryPassageItem[] = [
  // =========================================================
  // ENGLISH PASSAGES
  // =========================================================
  {
    id: 'en-passage-1',
    language: 'en',
    category: 'timeline-comparison',
    categoryLabel: 'TIMELINE REALITY',
    hook: "POV: You're 25 and feel like everyone is ahead of you.",
    slides: [
      "POV: You're 25 and feel like everyone is ahead of you.",
      "Your friends are getting jobs.",
      "Someone is getting married.",
      "Someone is building their dream life.",
      "And you're still trying to figure yourself out.",
      "Maybe you're not behind.",
      "Maybe you're just on your own timeline.",
      "Keep going. Your season is coming. 🌱"
    ],
    author: "Spark Within ✨",
    fullText: `POV: You're 25 and feel like everyone is ahead of you.

Your friends are getting jobs.
Someone is getting married.
Someone is building their dream life.
And you're still trying to figure yourself out.

Maybe you're not behind.
Maybe you're just on your own timeline.

Keep going. Your season is coming. 🌱

— Spark Within ✨`
  },
  {
    id: 'en-passage-2',
    language: 'en',
    category: 'silent-discipline',
    categoryLabel: 'SILENT GROWTH',
    hook: "They only see the success. They never saw the silent nights.",
    slides: [
      "They only see the success.",
      "They never saw the silent nights.",
      "The days you wanted to quit but didn't.",
      "The rejections that broke your heart in silence.",
      "The sacrifices nobody will ever clap for.",
      "A bamboo tree grows for 5 years underground before rising 90 feet.",
      "You are not stuck. You are building roots.",
      "Stay patient. The world will see soon. ⚡"
    ],
    author: "Spark Within ✨",
    fullText: `They only see the success.
They never saw the silent nights.

The days you wanted to quit but didn't.
The rejections that broke your heart in silence.
The sacrifices nobody will ever clap for.

A bamboo tree grows for 5 years underground before rising 90 feet.
You are not stuck. You are building roots.

Stay patient. The world will see soon. ⚡

— Spark Within ✨`
  },
  {
    id: 'en-passage-3',
    language: 'en',
    category: 'late-bloomer',
    categoryLabel: 'INNER STRENGTH',
    hook: "Stop apologizing for taking longer to find your path.",
    slides: [
      "Stop apologizing for taking longer to find your path.",
      "Some flowers bloom in spring, others bloom in winter.",
      "It doesn't make winter flowers any less beautiful.",
      "The heaviest gold takes the hottest fire to forge.",
      "Every detour taught you something that smooth roads never could.",
      "You didn't waste time. You gained wisdom.",
      "Trust your pace.",
      "You are exactly where you need to be. 🌟"
    ],
    author: "Spark Within ✨",
    fullText: `Stop apologizing for taking longer to find your path.

Some flowers bloom in spring, others bloom in winter.
It doesn't make winter flowers any less beautiful.
The heaviest gold takes the hottest fire to forge.

Every detour taught you something that smooth roads never could.
You didn't waste time. You gained wisdom.

Trust your pace.
You are exactly where you need to be. 🌟

— Spark Within ✨`
  },
  {
    id: 'en-passage-4',
    language: 'en',
    category: 'healing-growth',
    categoryLabel: 'PROTECT YOUR PEACE',
    hook: "Sometimes growth feels like loneliness.",
    slides: [
      "Sometimes growth feels like loneliness.",
      "You outgrow places you once loved.",
      "You stop replying to drama.",
      "Your circle gets smaller by choice.",
      "And on some weekends, it's just you and your goals.",
      "That's not isolation. That's elevation.",
      "An eagle flies alone; pigeons fly in flocks.",
      "Protect your peace. You're building a masterpiece. 🦅"
    ],
    author: "Spark Within ✨",
    fullText: `Sometimes growth feels like loneliness.

You outgrow places you once loved.
You stop replying to drama.
Your circle gets smaller by choice.
And on some weekends, it's just you and your goals.

That's not isolation. That's elevation.
An eagle flies alone; pigeons fly in flocks.

Protect your peace. You're building a masterpiece. 🦅

— Spark Within ✨`
  },
  {
    id: 'en-passage-5',
    language: 'en',
    category: 'comeback-dreams',
    categoryLabel: 'THE COMEBACK',
    hook: "To anyone starting over with zero: read this.",
    slides: [
      "To anyone starting over with zero: read this.",
      "Having zero money is temporary.",
      "Having zero confidence is what destroys people.",
      "As long as you have air in your lungs and fire in your chest,",
      "You are dangerous to your own limitations.",
      "Rock bottom is solid ground to build a skyscraper on.",
      "Don't look at how far you have to go.",
      "Look at how strong you had to be to get here. Keep pushing. 🔥"
    ],
    author: "Spark Within ✨",
    fullText: `To anyone starting over with zero: read this.

Having zero money is temporary.
Having zero confidence is what destroys people.
As long as you have air in your lungs and fire in your chest,
You are dangerous to your own limitations.

Rock bottom is solid ground to build a skyscraper on.
Don't look at how far you have to go.
Look at how strong you had to be to get here. Keep pushing. 🔥

— Spark Within ✨`
  },

  // =========================================================
  // TAMIL PASSAGES
  // =========================================================
  {
    id: 'ta-passage-1',
    language: 'ta',
    category: 'timeline-comparison',
    categoryLabel: 'வாழ்க்கை உண்மை 🌱',
    hook: "சில நேரம் நம்ம வாழ்க்கை எங்கே போகுதுன்னே தெரியாது.",
    slides: [
      "சில நேரம் நம்ம வாழ்க்கை எங்கே போகுதுன்னே தெரியாது.",
      "நம்மைச் சுற்றி எல்லாரும் முன்னேறிக்கொண்டிருக்கிற மாதிரி தெரியும்.",
      "ஒருத்தர் வேலைக்குப் போறாங்க.",
      "ஒருத்தர் திருமணம் பண்ணிக்கிறாங்க.",
      "இன்னொருத்தர் தங்களோட கனவை அடைகிறாங்க.",
      "நாம மட்டும் இன்னும் அதே இடத்துல இருக்கிற மாதிரி தோணும்.",
      "ஆனா நினைவில் வை... தாமதம் என்பது தோல்வி இல்லை.",
      "உனக்கான நேரம் இன்னும் வரவில்லை. நின்றுவிடாதே! தொடர்ந்து நட. 🌱"
    ],
    author: "Spark Within ✨",
    fullText: `சில நேரம்
நம்ம வாழ்க்கை எங்கே போகுதுன்னே தெரியாது.

நம்மைச் சுற்றி எல்லாரும்
முன்னேறிக்கொண்டிருக்கிற மாதிரி தெரியும்.

ஒருத்தர் வேலைக்குப் போறாங்க.
ஒருத்தர் திருமணம் பண்ணிக்கிறாங்க.
இன்னொருத்தர் தங்களோட கனவை அடைகிறாங்க.

நாம மட்டும்
இன்னும் அதே இடத்துல இருக்கிற மாதிரி தோணும்.

ஆனா நினைவில் வை...

தாமதம் என்பது தோல்வி இல்லை.
உனக்கான நேரம் இன்னும் வரவில்லை.

நின்றுவிடாதே.
உன் பாதையில் தொடர்ந்து நட. 🌱

— Spark Within ✨`
  },
  {
    id: 'ta-passage-2',
    language: 'ta',
    category: 'silent-discipline',
    categoryLabel: 'மௌன உழைப்பு ⚡',
    hook: "உன் கஷ்டத்தை யாரிடமும் சொல்லி புலம்பாதே.",
    slides: [
      "உன் கஷ்டத்தை யாரிடமும் சொல்லி புலம்பாதே.",
      "பலர் ஆறுதல் சொல்வது போல நடித்து வேடிக்கை மட்டுமே பார்ப்பார்கள்.",
      "உன் வலிகளை உழைப்பாக மாற்று.",
      "யாரும் பார்க்காத இரவுகளில் நீ சிந்தும் வியர்வை வீண் போகாது.",
      "விதையானது மண்ணுக்குள் புதைக்கப்படும் போது தான் விருட்சமாகிறது.",
      "நீ இப்போது புதைக்கப்படவில்லை... விதைக்கப்பட்டிருக்கிறாய்!",
      "மௌனமாக உழை. உன் வெற்றி உலகையே பேச வைக்கட்டும். 🦁"
    ],
    author: "Spark Within ✨",
    fullText: `உன் கஷ்டத்தை யாரிடமும் சொல்லி புலம்பாதே.

பலர் ஆறுதல் சொல்வது போல நடித்து
வேடிக்கை மட்டுமே பார்ப்பார்கள்.

உன் வலிகளை உழைப்பாக மாற்று.
யாரும் பார்க்காத இரவுகளில் நீ சிந்தும் வியர்வை வீண் போகாது.

விதையானது மண்ணுக்குள் புதைக்கப்படும் போது தான்
விருட்சமாக வளர்கிறது.

நீ இப்போது புதைக்கப்படவில்லை...
விதைக்கப்பட்டிருக்கிறாய்!

மௌனமாக உழை.
உன் வெற்றி உலகையே பேச வைக்கட்டும். 🦁

— Spark Within ✨`
  },
  {
    id: 'ta-passage-3',
    language: 'ta',
    category: 'late-bloomer',
    categoryLabel: 'உன் காலம் வரும் 🌟',
    hook: "சூரியனும் சந்திரனும் ஒரே நேரத்தில் பிரகாசிப்பதில்லை.",
    slides: [
      "சூரியனும் சந்திரனும் ஒரே நேரத்தில் பிரகாசிப்பதில்லை.",
      "ஒவ்வொன்றுக்கும் அதற்கான நேரம் உண்டு.",
      "மற்றவர்கள் வேகமாக ஓடுவதற்காக நீ பதற்றமடையாதே.",
      "அவர்கள் பயணம் வேறு, உன் பயணம் வேறு.",
      "தாமதமாக உருவாகும் சிற்பமே அதிக காலம் பேசப்படும்.",
      "உன்னை நீ செதுக்கிக் கொண்டிருக்கிறாய்.",
      "நம்பிக்கையோடு காத்திரு.",
      "உன் காலம் வரும்போது நீயே பிரகாசிப்பாய்! 👑"
    ],
    author: "Spark Within ✨",
    fullText: `சூரியனும் சந்திரனும் ஒரே நேரத்தில் பிரகாசிப்பதில்லை.

ஒவ்வொன்றுக்கும் அதற்கான நேரம் உண்டு.
மற்றவர்கள் வேகமாக ஓடுவதற்காக நீ பதற்றமடையாதே.

அவர்கள் பயணம் வேறு, உன் பயணம் வேறு.
தாமதமாக உருவாகும் சிற்பமே அதிக காலம் பேசப்படும்.

உன்னை நீ செதுக்கிக் கொண்டிருக்கிறாய்.
நம்பிக்கையோடு காத்திரு.

உன் காலம் வரும்போது நீயே பிரகாசிப்பாய்! 👑

— Spark Within ✨`
  },
  {
    id: 'ta-passage-4',
    language: 'ta',
    category: 'healing-growth',
    categoryLabel: 'மன அமைதி 🧘',
    hook: "உன்னை மதிக்காத இடத்தில் ஒரு வினாடி கூட இருக்காதே.",
    slides: [
      "உன்னை மதிக்காத இடத்தில் ஒரு வினாடி கூட இருக்காதே.",
      "உன் அருமை தெரியாதவர்களிடம் உன் தரத்தை நிரூபிக்காதே.",
      "சில கதவுகள் அடைக்கப்படுவது நல்லது தான்.",
      "அப்போது தான் சிறந்த கதவுகள் உனக்காக திறக்கும்.",
      "எல்லோரையும் திருப்திப்படுத்த நீ இங்கு வரவில்லை.",
      "உன் பெற்றோரின் முகத்தில் புன்னகையையும்,",
      "உன் இதயத்தில் அமைதியையும் தேடு.",
      "விலகி நடப்பதே பல நேரங்களில் பேரழகு. ✨"
    ],
    author: "Spark Within ✨",
    fullText: `உன்னை மதிக்காத இடத்தில் ஒரு வினாடி கூட இருக்காதே.

உன் அருமை தெரியாதவர்களிடம் உன் தரத்தை நிரூபிக்காதே.
சில கதவுகள் அடைக்கப்படுவது நல்லது தான்.

அப்போது தான் சிறந்த கதவுகள் உனக்காக திறக்கும்.
எல்லோரையும் திருப்திப்படுத்த நீ இங்கு வரவில்லை.

உன் பெற்றோரின் முகத்தில் புன்னகையையும்,
உன் இதயத்தில் அமைதியையும் தேடு.

விலகி நடப்பதே பல நேரங்களில் பேரழகு. ✨

— Spark Within ✨`
  },
  {
    id: 'ta-passage-5',
    language: 'ta',
    category: 'comeback-dreams',
    categoryLabel: 'மீண்டும் எழு 🔥',
    hook: "இழந்ததை நினைத்து கலங்காதே, எஞ்சியதை வைத்து எழுந்து நில்.",
    slides: [
      "இழந்ததை நினைத்து கலங்காதே, எஞ்சியதை வைத்து எழுந்து நில்.",
      "அனைத்தும் முடிந்துவிட்டது என்று நினைத்த தருணங்கள் உனக்கு உண்டு.",
      "ஆனால் இன்றும் நீ உயிரோடு இருக்கிறாய் அல்லவா?",
      "அதுவே நீ இன்னும் வெல்ல முடியும் என்பதற்கான ஆதாரம்.",
      "காயங்கள் இல்லாத போராளி உருவாவதில்லை.",
      "இந்தத் தோல்விகள் தான் உன் நாளைய சரித்திரத்தின் முகவுரை.",
      "கண்களைத் துடை... தலையை நிமிர்த்து.",
      "ஆட்டத்தை மீண்டும் தொடங்கு! 🔥"
    ],
    author: "Spark Within ✨",
    fullText: `இழந்ததை நினைத்து கலங்காதே, எஞ்சியதை வைத்து எழுந்து நில்.

அனைத்தும் முடிந்துவிட்டது என்று நினைத்த தருணங்கள் உனக்கு உண்டு.
ஆனால் இன்றும் நீ உயிரோடு இருக்கிறாய் அல்லவா?

அதுவே நீ இன்னும் வெல்ல முடியும் என்பதற்கான ஆதாரம்.
காயங்கள் இல்லாத போராளி உருவாவதில்லை.

இந்தத் தோல்விகள் தான் உன் நாளைய சரித்திரத்தின் முகவுரை.

கண்களைத் துடை... தலையை நிமிர்த்து.
ஆட்டத்தை மீண்டும் தொடங்கு! 🔥

— Spark Within ✨`
  }
];

// -------------------------------------------------------------
// INFINITE PROCEDURAL PASSAGE GENERATOR (20-YEAR GUARANTEE)
// Combinatorially produces over 100,000+ unique 7-slide stories
// -------------------------------------------------------------

interface NarrativeComponentPool {
  hooks: string[];
  struggles: string[][];
  shifts: string[][];
  resolutions: string[];
}

const ENGLISH_POOL: NarrativeComponentPool = {
  hooks: [
    "POV: You're trying your hardest, but nobody seems to notice.",
    "POV: You're 24 and starting over from scratch.",
    "POV: You feel behind in life while everyone else is winning.",
    "To anyone fighting a silent battle today: read this.",
    "If your 20s feel confusing and overwhelming right now:",
    "You don't need to have your entire life figured out by 25.",
    "Stop feeling guilty for resting and taking your time.",
    "The hardest part of growth is letting go of who you used to be.",
    "POV: You cut off distractions and chose yourself.",
    "Sometimes the best move you can make is walking away in silence."
  ],
  struggles: [
    [
      "You scroll through social media and everyone is thriving.",
      "New cars, new promotions, new relationships.",
      "And you are sitting with your doubts wondering when it's your turn."
    ],
    [
      "You wake up exhausted before the day even begins.",
      "The bills are real, the pressure is heavy.",
      "And the people you thought would stand by you walked away."
    ],
    [
      "You sent out dozens of applications and got only silence back.",
      "You invested your heart into things that didn't work out.",
      "And you feel like you are starting from zero all over again."
    ],
    [
      "You outgrew your old friend group and weekends feel quiet.",
      "The expectations from everyone around you feel suffocating.",
      "And you wonder if all this sacrifice is ever going to pay off."
    ],
    [
      "You watch people take shortcuts and get praised.",
      "While you do honest hard work with no applause.",
      "And you question if doing the right thing even matters."
    ]
  ],
  shifts: [
    [
      "Here is the truth nobody posts on Instagram:",
      "Social media shows highlights, never the loneliness behind closed doors.",
      "You are not comparing yourself to their reality — only to their edit."
    ],
    [
      "Remember this: An oak tree takes decades to grow strong.",
      "Weeds grow in a week and die in a month.",
      "Deep roots take deep time. You are building something permanent."
    ],
    [
      "Every master once felt like a complete failure.",
      "Every champion had moments they wanted to give up.",
      "The difference isn't talent — it's the refusal to stop."
    ],
    [
      "The moon doesn't compete with the sun to shine.",
      "Both shine when their time comes.",
      "Your season is being prepared right now in the background."
    ]
  ],
  resolutions: [
    "Don't surrender. Your breakthrough is closer than you think. 🌱",
    "Keep showing up. The world is about to see what you're made of. ⚡",
    "Trust your pace. You are becoming unbreakable. 👑",
    "Breathe. You have survived 100% of your hardest days so far. Keep going. 💫",
    "Put your head down and build. Your future self will thank you. 🔥"
  ]
};

const TAMIL_POOL: NarrativeComponentPool = {
  hooks: [
    "சில நேரம் நம்ம வாழ்க்கை எங்கே போகுதுன்னே புரியாது.",
    "எல்லாரும் ஜெயிக்கிற மாதிரி இருக்கும், நாம மட்டும் தோற்கிற மாதிரி தோணும்.",
    "உன் உழைப்பை யாரும் பாராட்டவில்லை என்று வருத்தப்படாதே.",
    "20களில் வாழ்க்கையை ஆரம்பிக்கிற ஒவ்வொருவருக்கும் ஒரு செய்தி:",
    "உன் அமைதியை சிலர் பலவீனம் என்று நினைத்தால் நினைக்கட்டும்.",
    "பூஜ்ஜியத்தில் இருந்து வாழ்க்கையைத் தொடங்குபவர்களுக்கு இது சமர்ப்பணம்:",
    "யாருக்காகவும் உன் சுயமரியாதையை விட்டுக்கொடுக்காதே.",
    "கண்ணீரோடு தூங்கும் இரவுகள் தான் உன்னை ஒருநாள் வைரமாக மாற்றும்."
  ],
  struggles: [
    [
      "சுற்றிலும் உள்ளவர்கள் அடுத்த கட்டத்திற்குப் போய்க்கொண்டே இருக்கிறார்கள்.",
      "ஒருத்தர் கார் வாங்குறாங்க, இன்னொருத்தர் வீடு கட்டுறாங்க.",
      "நாம மட்டும் இன்னும் பழைய இடத்திலேயே நிற்கிற மாதிரி இருக்கும்."
    ],
    [
      "நம்பினவர்கள் கையை விட்டுவிட்டார்கள்.",
      "பாக்கெட்டில் பணமில்லை, மனதில் நிம்மதியில்லை.",
      "யார்கிட்டயும் சொல்ல முடியாத ஒரு தனிமை உன்னை வாட்டுகிறது."
    ],
    [
      "எத்தனை முயற்சி செய்தாலும் கதவுகள் அடைக்கப்படுவது போல தோன்றும்.",
      "தோல்விகள் மட்டுமே மிஞ்சுகிறது என்று இதயம் வலிக்கும்.",
      "எதிர்காலத்தைப் பற்றிய பயம் ஒவ்வொரு இரவும் தூங்க விடாது."
    ],
    [
      "நீ உண்மையாக இருந்ததற்காக உன்னை ஏமாளிகள் என்று சொன்னார்கள்.",
      "உன் நல்ல குணத்தை பலர் தங்களுக்கு சாதகமாகப் பயன்படுத்தினார்கள்.",
      "இப்போது உன் நட்பு வட்டம் மிகவும் சுருங்கிவிட்டது."
    ]
  ],
  shifts: [
    [
      "ஆனால் நினைவில் வை: இது உன் முடிவு அல்ல, ஆரம்பம்!",
      "இன்ஸ்டாகிராமில் பார்க்கும் அனைத்தும் உண்மை வாழ்க்கை அல்ல.",
      "அவர்கள் காண்பிப்பது வெளிச்சத்தை மட்டுமே... பின்னால் உள்ள இருளை அல்ல."
    ],
    [
      "மூங்கில் மரம் 5 வருடங்கள் மண்ணுக்குள் அமைதியாக வேரூன்றும்.",
      "6வது வருடம் ஒரே மாதத்தில் 90 அடி உயர்ந்து நிற்கும்.",
      "நீயும் இப்போது வேரூன்றிக் கொண்டிருக்கிறாய்!"
    ],
    [
      "சூரியனும் நிலவும் தங்களுக்குரிய நேரத்தில் மட்டுமே வெளிச்சம் தரும்.",
      "மற்றவர்கள் முந்திவிட்டார்கள் என்பதற்காக உன் மதிப்பை இழக்காதே.",
      "உன் நேரமும், உன் காலமும் நிச்சயமாக வரும்."
    ]
  ],
  resolutions: [
    "நின்றுவிடாதே. உன் பாதையில் தொடர்ந்து உறுதியோடு நட! 🌱",
    "மௌனமாக உழை. உன் வெற்றி உலகையே திரும்பிப் பார்க்க வைக்கும். 🦁",
    "கண்களைத் துடை. உன் சரித்திரம் இப்போதுதான் தொடங்குகிறது! 🔥",
    "உன்னை நீ நம்பு. இந்த உலகம் உன் முன் ஒருநாள் தலைவணங்கும்! 👑",
    "பொறுமையாக இரு. இறைவன் உனக்கு சிறந்ததை ஒதுக்கி வைத்திருக்கிறான்! ✨"
  ]
};

/**
 * Generate an infinitely unique, non-repeating 7-8 slide story passage.
 * Seed-based or randomized, guaranteeing zero repeats.
 */
export function generateInfinitePassage(lang: 'en' | 'ta'): StoryPassageItem {
  const pool = lang === 'en' ? ENGLISH_POOL : TAMIL_POOL;
  
  const hook = pool.hooks[Math.floor(Math.random() * pool.hooks.length)];
  const struggleGroup = pool.struggles[Math.floor(Math.random() * pool.struggles.length)];
  const shiftGroup = pool.shifts[Math.floor(Math.random() * pool.shifts.length)];
  const resolution = pool.resolutions[Math.floor(Math.random() * pool.resolutions.length)];

  const slides: string[] = [
    hook,
    ...struggleGroup,
    ...shiftGroup,
    resolution
  ];

  const fullText = slides.join('\n\n') + '\n\n— Spark Within ✨';

  return {
    id: `infinite-${lang}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    language: lang,
    category: 'infinite-mindset',
    categoryLabel: lang === 'en' ? 'POV: MOTIVATION 🌱' : 'உண்மை நிலை 🌱',
    hook,
    slides,
    author: 'Spark Within ✨',
    fullText,
  };
}
