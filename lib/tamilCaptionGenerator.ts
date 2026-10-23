import { TAMIL_PRESET_QUOTES, TAMIL_HASHTAG_BANK, TamilQuoteItem } from './tamilPresets';

export interface TamilCaptionResult {
  hook: string;
  explanation: string;
  actionChallenge: string;
  cta: string;
  captionHashtags: string[];
  firstCommentHashtags: string[];
  totalHashtagsCount: number;
  fullCaption: string;
  firstComment: string;
}

export function generateTamilViralCaption(quoteItem: TamilQuoteItem): TamilCaptionResult {
  const isKural = quoteItem.category === 'thirukkural' || quoteItem.categoryTamil.includes('திருக்குறள்') || quoteItem.author.includes('வள்ளுவர்');
  const authorName = isKural 
    ? 'திருவள்ளுவர்' 
    : (quoteItem.author && quoteItem.author.toLowerCase() !== 'spark within' ? quoteItem.author : 'வாழ்வியல் தத்துவம்');

  const hook = `🔥 இந்த ஒரு வரி உங்கள் பார்வையை மாற்றும் — முழுமையாகப் படியுங்கள்!`;

  const explanation = `உண்மை என்னவென்றால், பல மனிதர்கள் தங்கள் வாழ்க்கையில் ஒரு சிறிய தோல்வி வந்த உடனே அத்தோடு எல்லாவற்றையும் நிறுத்தி விடுகிறார்கள். ஆனால் வரலாறு படைத்த எவரும் முதல் முயற்சியிலேயே வென்றவர்கள் அல்ல.\n\n"${quoteItem.quote.replace(/\\n/g, ' ')}" என்று ${authorName} கூறியதன் ஆழமான அர்த்தம் இதுதான்:\n${quoteItem.explanationTamil}\n\nஉங்களுக்குள் இருக்கும் திறமையை நீங்கள் நம்பாத வரை இந்த உலகம் உங்களை ஒருபோதும் அங்கீகரிக்காது. உங்கள் திறமையை வெளிக்கொண்டு வாருங்கள்.`;

  const actionChallenge = `🎯 இன்றைய செயல் திட்டம்:\nஇன்று நீங்கள் செய்யத் தயங்கும் ஒரு முக்கியமான காரியத்தை பயமின்றி முதலடி எடுத்து வையுங்கள். தயக்கம் தான் உங்கள் முதல் எதிரி!`;

  const cta = `💬 இந்த வரிகள் உங்கள் மனதிற்கு ஊக்கமளித்ததா? கீழே ஒரு 🔥 இடுங்கள்.\n📌 உங்களின் எதிர்கால உத்வேகத்திற்காக இந்த பதிவை சேமித்து (Save) கொள்ளுங்கள்!\n👥 உங்கள் நண்பருக்கும் பயனுள்ளதாக இருக்க பகிருங்கள் (Share).`;

  const captionHashtags = TAMIL_HASHTAG_BANK.caption;
  const firstCommentHashtags = TAMIL_HASHTAG_BANK.firstComment;

  const fullCaption = `${hook}\n\n"${quoteItem.quote.replace(/\\n/g, ' ')}"\n— ஆசிரியர்: ${authorName}\nவழங்குபவர்: Spark Within (@_sparkwithin_hub_)\n\n📖 வாழ்வியல் தத்துவம்:\n${explanation}\n\n${actionChallenge}\n\n${cta}\n\n.\n.\n.\n${captionHashtags.join(' ')}`;

  const firstComment = `🚀 மேலும் தமிழ் தன்னம்பிக்கை வரிகளுக்கு பின்தொடருங்கள் @_sparkwithin_hub_\n\n${firstCommentHashtags.join(' ')}`;

  return {
    hook,
    explanation,
    actionChallenge,
    cta,
    captionHashtags,
    firstCommentHashtags,
    totalHashtagsCount: captionHashtags.length + firstCommentHashtags.length,
    fullCaption,
    firstComment,
  };
}
