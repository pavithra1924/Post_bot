import { NextRequest, NextResponse } from 'next/server';
import { ALL_1330_KURALS } from '@/lib/thirukkural1330';
import { buildPollinationsUrl } from '@/lib/imageFetcher';
import { publishToInstagram } from '@/lib/instagramPublisher';

/**
 * Autonomous daily cron job that triggers every morning at 7:00 AM IST (01:30 UTC).
 * Selects the sequential Thirukkural of the day from the 1,330 Kurals dataset,
 * generates a majestic Tamil temple / spiritual golden dawn background,
 * crafts a viral Tamil wisdom caption with hashtags, and publishes automatically to Instagram.
 */
export async function GET(req: NextRequest) {
  try {
    const igUserId = (process.env.INSTAGRAM_USER_ID || '').trim();
    const accessToken = (process.env.INSTAGRAM_ACCESS_TOKEN || '').trim();

    // Check query params for custom kural number or test mode
    const searchParams = req.nextUrl.searchParams;
    const requestedKural = searchParams.get('kural');

    // Pick Kural: either requested, or sequential rotating based on day of year
    let kural = ALL_1330_KURALS[0];
    if (requestedKural) {
      const parsed = parseInt(requestedKural, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 1330) {
        kural = ALL_1330_KURALS[parsed - 1] || ALL_1330_KURALS[0];
      }
    } else {
      const startOfYear = new Date(new Date().getFullYear(), 0, 0).getTime();
      const dayOfYear = Math.floor((Date.now() - startOfYear) / 86400000);
      kural = ALL_1330_KURALS[dayOfYear % ALL_1330_KURALS.length];
    }

    if (!igUserId || !accessToken) {
      return NextResponse.json({
        status: 'skipped',
        message: 'Daily cron triggered. INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN not yet configured in Vercel environment variables.',
        kuralNumber: kural.number,
        kuralVerse: kural.verse,
        suggestedCaption: `💎 வாழ்வியல் தத்துவம் • குறள் #${kural.number}\n\n${kural.verse}\n\n— ஆசிரியர்: திருவள்ளுவர்\n\n📌 எளிய விளக்கம்:\n${kural.simpleExplanation}\n\n💡 வாழ்க்கையில் ஓர் உதாரணம்:\n${kural.lifeExample}\n\n#sparkwithin #thirukkural #thiruvalluvar #tamilquotes #tamilmotivation #wisdom #dailyquotes #kural #tamilnadu #inspiration`,
      });
    }

    // High quality public image URL for Meta Graph API ingestion
    const backgroundPrompts = [
      'ancient Tamil granite temple pillars golden morning sunrise dramatic god rays cinematic luxury aesthetic 8k',
      'golden dawn breaking over mountain mist serene spiritual peaceful aesthetic 8k wallpaper',
      'ancient palm leaf manuscript sacred temple stone carved lamp glowing warm light 8k',
      'minimalist onyx marble luxury podium warm golden ambient glow dark moody aesthetic 8k',
    ];
    const prompt = backgroundPrompts[kural.number % backgroundPrompts.length];
    const imageUrl = buildPollinationsUrl(prompt, '4:5', Date.now());

    // Viral Tamil Caption
    const fullCaption = `💎 வாழ்வியல் தத்துவம் • குறள் #${kural.number}

${kural.verse}

— ஆசிரியர்: திருவள்ளுவர்

📌 எளிய விளக்கம்:
${kural.simpleExplanation}

💡 வாழ்க்கையில் ஓர் உதாரணம்:
${kural.lifeExample}

✨ இன்றைய சிந்தனை:
${kural.dailyThought}

#sparkwithin #thirukkural #thiruvalluvar #tamilquotes #tamilmotivation #wisdom #dailyquotes #kural #tamilnadu #inspiration #tamilstatus #mindset #motivation`;

    // Publish to Instagram via Meta Graph API
    const publishResult = await publishToInstagram({
      igUserId,
      accessToken,
      imageUrl,
      caption: fullCaption,
    });

    return NextResponse.json({
      status: 'success',
      kuralNumber: kural.number,
      kuralVerse: kural.verse,
      author: 'திருவள்ளுவர்',
      brand: 'Spark Within (@_sparkwithin_hub_)',
      imageUrl,
      publishResult,
    });
  } catch (err: any) {
    console.error('Daily cron error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal cron error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
