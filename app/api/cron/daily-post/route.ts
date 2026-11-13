import { NextRequest, NextResponse } from 'next/server';
import { TAMIL_PRESET_QUOTES, TamilQuoteItem } from '@/lib/tamilPresets';
import { PRESET_QUOTES, QuotePreset } from '@/lib/presets';
import { ALL_1330_KURALS, Thirukkural1330Item } from '@/lib/thirukkural1330';
import { generateTamilViralCaption } from '@/lib/tamilCaptionGenerator';
import { generateViralCaption } from '@/lib/captionGenerator';
import { publishToInstagram, publishCarouselToInstagram } from '@/lib/instagramPublisher';
import { renderAndUploadCardGraphic } from '@/lib/cardRendererServer';
import { renderThirukkuralCarouselSlides } from '@/lib/carouselRendererServer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type CategoryType = 'carousel' | 'tamil' | 'english';

interface PublishCategoryResult {
  category: CategoryType;
  title: string;
  author: string;
  quote: string;
  imageUrl?: string;
  slideUrls?: string[];
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

interface RecentMediaItem {
  id: string;
  caption: string;
  timestamp: string;
}

async function fetchRecentInstagramMedia(igUserId: string, accessToken: string): Promise<RecentMediaItem[]> {
  try {
    const url = `https://graph.facebook.com/v21.0/${igUserId}/media?fields=id,caption,timestamp,media_type&limit=40&access_token=${accessToken}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
  } catch (e) {
    console.warn('Failed to fetch recent Instagram media for deduplication:', e);
  }
  return [];
}

/**
 * Publishes a category post to Instagram:
 * - 'carousel': 5-Slide Thirukkural Carousel Pack (Couplet + Explanation + Meaning + Example + Daily Thought)
 * - 'tamil': Single Post (Bharathiyar, Kalam, Avvaiyar, Vivekananda, Cinema)
 * - 'english': Single Post (Marcus Aurelius, Steve Jobs, Seneca, Bruce Lee)
 */
async function executeCategoryPost({
  category,
  igUserId,
  accessToken,
  searchParams,
  dayOfYear,
  recentMedia = [],
}: {
  category: CategoryType;
  igUserId: string;
  accessToken: string;
  searchParams: URLSearchParams;
  dayOfYear: number;
  recentMedia?: RecentMediaItem[];
}): Promise<PublishCategoryResult> {
  const recentCaptions = recentMedia.map((m) => (m.caption || '').toLowerCase());

  if (category === 'carousel') {
    // 1. Thirukkural 5-Slide Carousel Pack
    const requestedIndex = searchParams.get('index') || searchParams.get('kural');
    let kuralItem: Thirukkural1330Item = ALL_1330_KURALS[dayOfYear % ALL_1330_KURALS.length];

    if (requestedIndex) {
      const parsed = parseInt(requestedIndex, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= ALL_1330_KURALS.length) {
        kuralItem = ALL_1330_KURALS[parsed - 1];
      }
    } else if (recentCaptions.length > 0) {
      // Find the first Kural in rotation that hasn't been posted in the last 40 posts
      for (let offset = 0; offset < ALL_1330_KURALS.length; offset++) {
        const candidate = ALL_1330_KURALS[(dayOfYear + offset) % ALL_1330_KURALS.length];
        const kuralTag = `குறள் #${candidate.number}`.toLowerCase();
        const isDuplicate = recentCaptions.some((cap) => cap.includes(kuralTag));
        if (!isDuplicate) {
          kuralItem = candidate;
          break;
        }
      }
    }

    // Render all 5 high-resolution slides with HarfBuzz Tamil typography
    const slideUrls = await renderThirukkuralCarouselSlides(kuralItem);

    const cleanThought = kuralItem.dailyThought
      .replace(/தினசரி\s*வாழ்வியல்.*$/s, '')
      .replace(/பின்தொடரவும்.*$/s, '')
      .trim();

    const fullCaption = `💎 வாழ்வியல் தத்துவம் • குறள் #${kuralItem.number} (${kuralItem.chapter})\n\n"${kuralItem.verse.replace(/\n/g, ' ')}"\n— ஆசிரியர்: திருவள்ளுவர்\nவழங்குபவர்: Spark Within (@_sparkwithin_hub_)\n\n📌 5-ஸ்லைடு வழிகாட்டி:\n1️⃣ குறள் & அதிகாரம்\n2️⃣ எளிய விளக்கம்: ${kuralItem.simpleExplanation}\n3️⃣ ஆழமான தத்துவம்: ${kuralItem.deepMeaning}\n4️⃣ வாழ்வில் ஓர் உதாரணம்: ${kuralItem.lifeExample}\n5️⃣ இன்றைய சிந்தனை: ${cleanThought}\n\n💬 உங்கள் நண்பர்களுக்கும் பயனுள்ளதாக இருக்க பகிருங்கள் (Share).\n📌 எதிர்கால சிந்தனைக்கு சேமித்து (Save) கொள்ளுங்கள்!\n\n.\n.\n.\n#sparkwithin #thirukkural #thiruvalluvar #tamilquotes #kural #tamilnadu #dailyquotes #tamilliterature #mindset #tamillanguage #wisdom`;

    const publishResult = await publishCarouselToInstagram({
      igUserId,
      accessToken,
      imageUrls: slideUrls,
      caption: fullCaption,
    });

    return {
      category: 'carousel',
      title: `💎 திருக்குறள் #${kuralItem.number} • ${kuralItem.chapter}`,
      author: 'திருவள்ளுவர்',
      quote: kuralItem.verse,
      slideUrls,
      imageUrl: slideUrls[0],
      caption: fullCaption,
      publishResult,
    };
  } else if (category === 'tamil') {
    // 2. Tamil Single Post (Bharathiyar, Kalam, Avvaiyar, Vivekananda, Leaders, Cinema motivation)
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
    } else if (recentCaptions.length > 0) {
      // Find the first candidate whose quote snippet has NOT appeared in recent posts
      for (let offset = 0; offset < singleTamilPool.length; offset++) {
        const candidate = singleTamilPool[(dayOfYear + offset) % singleTamilPool.length];
        const snippet = candidate.quote.slice(0, 18).toLowerCase();
        const isDuplicate = recentCaptions.some((cap) => cap.includes(snippet));
        if (!isDuplicate) {
          quoteItem = candidate;
          break;
        }
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
    // 3. English Mindset & Stoic Quotes (Marcus Aurelius, Steve Jobs, Seneca, Bruce Lee)
    const requestedIndex = searchParams.get('index');
    let quoteItem: QuotePreset = PRESET_QUOTES[0];

    if (requestedIndex) {
      const parsed = parseInt(requestedIndex, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < PRESET_QUOTES.length) {
        quoteItem = PRESET_QUOTES[parsed];
      }
    } else if (recentCaptions.length > 0) {
      // Find the first candidate whose quote has NOT appeared in recent Instagram posts
      for (let offset = 0; offset < PRESET_QUOTES.length; offset++) {
        const candidate = PRESET_QUOTES[(dayOfYear + offset) % PRESET_QUOTES.length];
        const snippet = candidate.quote.slice(0, 25).toLowerCase();
        const isDuplicate = recentCaptions.some((cap) => cap.includes(snippet));
        if (!isDuplicate) {
          quoteItem = candidate;
          break;
        }
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
    const requestedType = (searchParams.get('type') || searchParams.get('category'))?.toLowerCase();

    // Indian Standard Time (IST = UTC + 5:30)
    const nowUtc = Date.now();
    const istDate = new Date(nowUtc + 5.5 * 3600 * 1000);
    const startOfYear = new Date(istDate.getFullYear(), 0, 0).getTime();
    const dayOfYear = Math.floor((istDate.getTime() - startOfYear) / 86400000);
    const dayOfWeek = istDate.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hourIst = istDate.getUTCHours(); // 0 to 23

    let category: CategoryType = 'carousel';
    const isMultiAll = requestedType === 'all';

    if (requestedType === 'carousel' || requestedType === 'kural' || requestedType === 'thirukkural') {
      // 5-Slide Thirukkural Carousel
      category = 'carousel';
    } else if (requestedType === 'tamil' || requestedType === 'tamil_quote') {
      // Tamil Single Post (Bharathiyar, Kalam, Avvaiyar, Vivekananda)
      category = 'tamil';
    } else if (requestedType === 'english' || requestedType === 'english_quote') {
      // English Single Post (Marcus Aurelius, Steve Jobs, Seneca)
      category = 'english';
    } else if (!isMultiAll) {
      // Intelligent Auto-Schedule based on IST time:
      // - 🌅 Morning (05:00 - 09:59 IST): 5-Slide Thirukkural Carousel
      // - ☀️ Afternoon (10:00 - 15:59 IST): Tamil Quotes Single Post
      // - 🌙 Evening (16:00 - 23:59 IST): English Mindset Single Post
      if (hourIst < 10) {
        category = 'carousel';
      } else if (hourIst < 16) {
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

    // Fetch recent 40 media items directly from Instagram for live deduplication
    const recentMedia = await fetchRecentInstagramMedia(igUserId, accessToken);

    // Spam / Cooldown Protection:
    // If a post was published less than 45 minutes ago, prevent accidental double-triggers
    const isForce = searchParams.get('force') === 'true';
    const isManualIndex = Boolean(searchParams.get('index') || searchParams.get('kural'));

    if (!isForce && !isManualIndex && !isMultiAll && recentMedia.length > 0) {
      const latestPostTime = new Date(recentMedia[0].timestamp).getTime();
      const minsSinceLastPost = (Date.now() - latestPostTime) / (1000 * 60);

      if (minsSinceLastPost < 45) {
        return NextResponse.json({
          status: 'skipped',
          message: `A post was already published ${Math.round(minsSinceLastPost)} minutes ago. Skipping to prevent duplicates. Pass ?force=true to override.`,
          latestPost: recentMedia[0].timestamp,
          resolvedCategory: category,
        });
      }
    }

    if (isMultiAll) {
      const categoriesToPublish: CategoryType[] = ['carousel', 'tamil', 'english'];
      const results: PublishCategoryResult[] = [];

      for (const cat of categoriesToPublish) {
        const res = await executeCategoryPost({
          category: cat,
          igUserId,
          accessToken,
          searchParams,
          dayOfYear,
          recentMedia,
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
      recentMedia,
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
