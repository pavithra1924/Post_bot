import { NextRequest, NextResponse } from 'next/server';
import { TAMIL_PRESET_QUOTES, TamilQuoteItem } from '@/lib/tamilPresets';
import { PRESET_QUOTES, QuotePreset } from '@/lib/presets';
import { generateTamilViralCaption } from '@/lib/tamilCaptionGenerator';
import { generateViralCaption } from '@/lib/captionGenerator';
import { publishToInstagram } from '@/lib/instagramPublisher';
import { renderAndUploadCardGraphic } from '@/lib/cardRendererServer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type CategoryType = 'tamil' | 'english';

interface PublishCategoryResult {
  category: CategoryType;
  title: string;
  author: string;
  quote: string;
  imageUrl: string;
  caption: string;
  publishResult: any;
}

const TAMIL_IMAGES = [
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=85',
];

const ENGLISH_IMAGES = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1080&auto=format&fit=crop&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080&auto=format&fit=crop&q=85',
];

/**
 * Publishes a single category post (Tamil Quotes or English Mindset) to Instagram
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
  if (category === 'tamil') {
    // 1. Tamil Quotes (Bharathiyar, Kalam, Avvaiyar, Vivekananda, Leaders, Cinema motivation)
    // Filter to ensure NO Thirukkural appears in single posts!
    const singleTamilPool = TAMIL_PRESET_QUOTES.filter(
      (q) => q.category !== 'thirukkural' && !q.categoryTamil.includes('திருக்குறள்')
    );

    const requestedIndex = searchParams.get('index');
    let quoteItem: TamilQuoteItem = singleTamilPool[0];

    if (requestedIndex) {
      const parsed = parseInt(requestedIndex, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < singleTamilPool.length) {
        quoteItem = singleTamilPool[parsed];
      }
    } else {
      quoteItem = singleTamilPool[dayOfYear % singleTamilPool.length];
    }

    const bgUrl = TAMIL_IMAGES[dayOfYear % TAMIL_IMAGES.length];
    let imageUrl = bgUrl;
    try {
      imageUrl = await renderAndUploadCardGraphic({
        quote: quoteItem.quote,
        author: quoteItem.author,
        badge: quoteItem.categoryTamil,
        backgroundImageUrl: bgUrl,
        language: 'ta',
      });
    } catch (e) {
      console.warn('Tamil card render fallback:', e);
    }

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
    // 2. English Mindset & Stoic Quotes (Marcus Aurelius, Steve Jobs, Seneca, Bruce Lee)
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

    const bgUrl = ENGLISH_IMAGES[dayOfYear % ENGLISH_IMAGES.length];
    let imageUrl = bgUrl;
    try {
      imageUrl = await renderAndUploadCardGraphic({
        quote: quoteItem.quote,
        author: quoteItem.author,
        badge: quoteItem.badge,
        backgroundImageUrl: bgUrl,
        language: 'en',
      });
    } catch (e) {
      console.warn('English card render fallback:', e);
    }

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
 * Single Posts:
 * - 🔥 Tamil Quotes (Bharathiyar, Kalam, Avvaiyar, Vivekananda, Cinema)
 * - 🌍 English Mindset (Stoic & Leadership Quotes)
 * Note: Thirukkural is reserved exclusively for Multi-Slide Carousel Studio!
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

    let category: CategoryType = 'tamil';
    const isMultiAll = requestedType === 'all';

    if (requestedType === 'tamil' || requestedType === 'tamil_quote' || requestedType === 'kural' || requestedType === 'thirukkural') {
      // Per user rule: Single posts only post Tamil quotes (Bharathiyar, Kalam, Avvaiyar, Vivekananda)
      category = 'tamil';
    } else if (requestedType === 'english' || requestedType === 'english_quote') {
      category = 'english';
    } else if (!isMultiAll) {
      // Intelligent Auto-Schedule based on IST time:
      // - Morning & Afternoon (5:00 - 15:59 IST): Tamil Wisdom
      // - Evening (16:00 - 23:59 IST): English Mindset
      if (hourIst < 16) {
        category = 'tamil';
      } else {
        category = 'english';
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

    if (isMultiAll) {
      const categoriesToPublish: CategoryType[] = ['tamil', 'english'];
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
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      return NextResponse.json({
        status: 'success',
        mode: 'all_single_categories',
        count: results.length,
        results,
        brand: 'Spark Within (@_sparkwithin_hub_)',
      });
    }

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
