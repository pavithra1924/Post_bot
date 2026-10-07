import { NextResponse } from 'next/server';
import { generateViralCaption } from '@/lib/captionGenerator';
import { ThemeId } from '@/lib/themes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quote, author = 'Spark Within', themeId = 'fire_sunset', apiKey } = body;

    if (!quote || typeof quote !== 'string') {
      return NextResponse.json({ error: 'Quote text is required' }, { status: 400 });
    }

    const keyToUse = apiKey || process.env.GEMINI_API_KEY;
    const result = await generateViralCaption(quote, author, themeId as ThemeId, keyToUse);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Caption API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
