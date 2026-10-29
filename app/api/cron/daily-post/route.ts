import { NextRequest, NextResponse } from 'next/server';
import { ALL_1330_KURALS, Thirukkural1330Item } from '@/lib/thirukkural1330';
import { TAMIL_PRESET_QUOTES, TamilQuoteItem } from '@/lib/tamilPresets';
import { PRESET_QUOTES, QuotePreset } from '@/lib/presets';
import { generateTamilViralCaption } from '@/lib/tamilCaptionGenerator';
import { generateViralCaption } from '@/lib/captionGenerator';
import { buildPollinationsUrl } from '@/lib/imageFetcher';
import { publishToInstagram } from '@/lib/instagramPublisher';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type CategoryType = 'kural' | 'tamil' | 'english';

interface PublishCategoryResult {
  category: CategoryType;
  title: string;
  author: string;
  quote: string;
  imageUrl: string;
  caption: string;
  publishResult: any;
}

const KURAL_IMAGES = [
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=85',
];

const TAMIL_IMAGES = [
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=85',
];

const ENGLISH_IMAGES = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&auto=format&fit=crop&q=85',
];

/**
 * Publishes a single category post to Instagram
 */
async function executeCategoryPost({
  category,
  igUserId,
  accessToken,
  searchParams,
  dayOfYear,
}: {
  category: CategoryType;
  igUserId: string;
  accessToken: string;
  searchParams: URLSearchParams;
  dayOfYear: number;
}): Promise<PublishCategoryResult> {
  const seed = Date.now();

  if (category === 'kural') {
    // 1. Thirukkural
    const requestedKural = searchParams.get('kural');
    let kural: Thirukkural1330Item = ALL_1330_KURALS[0];

    if (requestedKural) {
      const parsed = parseInt(requestedKural, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 1330) {
        kural = ALL_1330_KURALS[parsed - 1] || ALL_1330_KURALS[0];
      }
    } else {
      kural = ALL_1330_KURALS[dayOfYear % ALL_1330_KURALS.length];
    }

    const imageUrl = KURAL_IMAGES[kural.number % KURAL_IMAGES.length];

    const fullCaption = `💎 வாழ்வியல் தத்துவம் • குறள் #${kural.number}

${kural.verse}

— ஆசிரியர்: திருவள்ளுவர்
வழங்குபவர்: Spark Within (@_sparkwithin_hub_)

📌 எளிய விளக்கம்:
${kural.simpleExplanation}

💡 வாழ்க்கையில் ஓர் உதாரணம்:
${kural.lifeExample}

✨ இன்றைய சிந்தனை:
${kural.dailyThought}

#sparkwithin #thirukkural #thiruvalluvar #tamilquotes #tamilmotivation #wisdom #dailyquotes #kural #tamilnadu #inspiration #tamilstatus #mindset #motivation #tamilliterature`;

    const publishResult = await publishToInstagram({
      igUserId,
      accessToken,
      imageUrl,
      caption: fullCaption,
    });

    return {
      category: 'kural',
      title: `திருக்குறள் #${kural.number}`,
      author: 'திருவள்ளுவர்',
      quote: kural.verse,
      imageUrl,
      caption: fullCaption,
      publishResult,
    };
  } else if (category === 'tamil') {
    // 2. Tamil Wisdom / Quotes (Bharathiyar, Kalam, Avvaiyar, Vivekananda, etc.)
    const requestedIndex = searchParams.get('index');
    let quoteItem: TamilQuoteItem = TAMIL_PRESET_QUOTES[0];

    if (requestedIndex) {
      const parsed = parseInt(requestedIndex, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < TAMIL_PRESET_QUOTES.length) {
        quoteItem = TAMIL_PRESET_QUOTES[parsed];
      }
    } else {
      quoteItem = TAMIL_PRESET_QUOTES[dayOfYear % TAMIL_PRESET_QUOTES.length];
    }

    const imageUrl = TAMIL_IMAGES[dayOfYear % TAMIL_IMAGES.length];
    const captionResult = generateTamilViralCaption(quoteItem);

    const publishResult = await publishToInstagram({
      igUserId,
      accessToken,
      imageUrl,
      caption: captionResult.fullCaption,
    });

    return {
      category: 'tamil',
      title: quoteItem.categoryTamil,
      author: quoteItem.author,
      quote: quoteItem.quote,
      imageUrl,
      caption: captionResult.fullCaption,
      publishResult,
    };
  } else {
    // 3. English Mindset & Stoic Quotes
    const requestedIndex = searchParams.get('index');
    let quoteItem: QuotePreset = PRESET_QUOTES[0];

    if (requestedIndex) {
      const parsed = parseInt(requestedIndex, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < PRESET_QUOTES.length) {
        quoteItem = PRESET_QUOTES[parsed];
      }
    } else {
      quoteItem = PRESET_QUOTES[dayOfYear % PRESET_QUOTES.length];
    }

    const imageUrl = ENGLISH_IMAGES[dayOfYear % ENGLISH_IMAGES.length];
    const captionResult = await generateViralCaption(quoteItem.quote, quoteItem.author, quoteItem.theme);

    const publishResult = await publishToInstagram({
      igUserId,
      accessToken,
      imageUrl,
      caption: captionResult.fullCaption,
    });

    return {
      category: 'english',
      title: quoteItem.badge,
      author: quoteItem.author,
      quote: quoteItem.quote,
      imageUrl,
      caption: captionResult.fullCaption,
      publishResult,
    };
  }
}

/**
 * Autonomous Cron Endpoint for Spark Within (@_sparkwithin_hub_)
 * Handles:
 * - 💎 Thirukkural (Daily morning sacred wisdom)
 * - 🔥 Tamil Quotes (Bharathiyar, Kalam, Avvaiyar, Vivekananda)
 * - 🌍 English Mindset (Stoic & Success Quotes)
 * 
 * Supports:
 * - ?type=kural | ?type=tamil | ?type=english | ?type=all | ?type=auto
 */
export async function GET(req: NextRequest) {
  try {
    const igUserId = (process.env.INSTAGRAM_USER_ID || '17841412392890201').trim();
    const accessToken = (process.env.INSTAGRAM_ACCESS_TOKEN || 'EAAMbn2U9KD4BSyaOjKRm33WyCaosjodaa3BG4kvq74Lcy4zW4DcSBurGZCsKScwQ5ilwNygtAEYZBZA6FqN7DDbZAoBxCpFL4ZA1sixmDcAr8Nf4KP26wZBELxFFM6inqQWkcwkdfYLQ6EADCtYel1Tp8qUK4IXqN4ptH0OHxkZBc1bW860bFEOVegYA3ZBZATjDl').trim();

    const searchParams = req.nextUrl.searchParams;
    const requestedType = searchParams.get('type')?.toLowerCase();

    // Indian Standard Time (IST = UTC + 5:30)
    const nowUtc = Date.now();
    const istDate = new Date(nowUtc + 5.5 * 3600 * 1000);
    const startOfYear = new Date(istDate.getFullYear(), 0, 0).getTime();
    const dayOfYear = Math.floor((istDate.getTime() - startOfYear) / 86400000);
    const dayOfWeek = istDate.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hourIst = istDate.getUTCHours(); // 0 to 23

    // Determine category:
    // If explicitly set via query param:
    let category: CategoryType = 'kural';
    const isMultiAll = requestedType === 'all';

    if (requestedType === 'kural' || requestedType === 'thirukkural') {
      category = 'kural';
    } else if (requestedType === 'tamil' || requestedType === 'tamil_quote') {
      category = 'tamil';
    } else if (requestedType === 'english' || requestedType === 'english_quote') {
      category = 'english';
    } else if (!isMultiAll) {
      // Intelligent Auto-Schedule based on IST time:
      // When triggered across the 3 daily slots:
      // - Morning (5:00 - 9:59 IST): Thirukkural
      // - Afternoon (11:00 - 15:59 IST): Tamil Wisdom
      // - Evening (17:00 - 23:59 IST): English Mindset
      if (hourIst >= 5 && hourIst < 10) {
        category = 'kural';
      } else if (hourIst >= 11 && hourIst < 16) {
        category = 'tamil';
      } else if (hourIst >= 17 && hourIst < 23) {
        category = 'english';
      } else {
        // Fallback: 7-day rotation for single daily cron run:
        // Sunday (0): Thirukkural
        // Monday (1): English Mindset
        // Tuesday (2): Tamil Wisdom (Bharathiyar/Kalam)
        // Wednesday (3): Thirukkural
        // Thursday (4): Tamil Wisdom (Avvaiyar/Vivekananda)
        // Friday (5): Thirukkural
        // Saturday (6): English Mindset
        const rotation: CategoryType[] = ['kural', 'english', 'tamil', 'kural', 'tamil', 'kural', 'english'];
        category = rotation[dayOfWeek] || 'kural';
      }
    }

    if (!igUserId || !accessToken) {
      return NextResponse.json({
        status: 'skipped',
        message: 'Daily cron triggered. INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN not configured.',
        resolvedCategory: category,
        istHour: hourIst,
        istDayOfWeek: dayOfWeek,
      });
    }

    // Handle "all" mode: publish kural, tamil, and english in sequence
    if (isMultiAll) {
      const categoriesToPublish: CategoryType[] = ['kural', 'tamil', 'english'];
      const results: PublishCategoryResult[] = [];

      for (const cat of categoriesToPublish) {
        const res = await executeCategoryPost({
          category: cat,
          igUserId,
          accessToken,
          searchParams,
          dayOfYear,
        });
        results.push(res);
        // Small delay between Meta container creation requests
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      return NextResponse.json({
        status: 'success',
        mode: 'all_categories',
        count: results.length,
        results,
        brand: 'Spark Within (@_sparkwithin_hub_)',
      });
    }

    // Single category execution
    const singleResult = await executeCategoryPost({
      category,
      igUserId,
      accessToken,
      searchParams,
      dayOfYear,
    });

    return NextResponse.json({
      status: 'success',
      brand: 'Spark Within (@_sparkwithin_hub_)',
      istTime: `${hourIst}:${istDate.getUTCMinutes()} IST`,
      ...singleResult,
    });
  } catch (err: any) {
    console.error('Spark Within Cron Error:', err);
    return NextResponse.json(
      { error: err.message || 'Cron execution failed.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
