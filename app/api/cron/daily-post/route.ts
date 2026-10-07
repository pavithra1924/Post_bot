import { NextRequest, NextResponse } from 'next/server';
import { PRESET_QUOTES } from '@/lib/presets';
import { buildPollinationsUrl } from '@/lib/imageFetcher';
import { generateViralCaption } from '@/lib/captionGenerator';
import { publishToInstagram } from '@/lib/instagramPublisher';
import { THEMES } from '@/lib/themes';

/**
 * Autonomous daily cron job that triggers every morning.
 * Generates a fresh motivational quote, Pollinations background, viral caption, and publishes to Instagram.
 */
export async function GET(req: NextRequest) {
  try {
    const igUserId = process.env.INSTAGRAM_USER_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!igUserId || !accessToken) {
      return NextResponse.json({
        status: 'skipped',
        message: 'Daily cron triggered successfully. INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN not set in environment.',
      });
    }

    // Pick a rotating daily quote based on the day of the year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const quotePreset = PRESET_QUOTES[dayOfYear % PRESET_QUOTES.length];
    const theme = THEMES[quotePreset.theme];

    // Generate Pollinations generative AI image URL (publicly accessible URL for Instagram Graph API)
    const imageUrl = buildPollinationsUrl(
      `${quotePreset.quote.slice(0, 40)} ${theme.pollinationsPrompt}`,
      '4:5',
      Date.now()
    );

    // Generate Viral Caption & Hashtags
    const captionResult = await generateViralCaption(
      quotePreset.quote,
      quotePreset.author,
      quotePreset.theme
    );

    // Publish to Instagram
    const publishResult = await publishToInstagram({
      igUserId,
      accessToken,
      imageUrl,
      caption: captionResult.fullCaption,
    });

    return NextResponse.json({
      status: 'success',
      quote: quotePreset.quote,
      author: quotePreset.author,
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
