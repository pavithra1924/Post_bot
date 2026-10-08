import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache for ultra-fast instant responses on repeated slides
const audioCache = new Map<string, string>();

async function fetchAudioForText(text: string, lang: string): Promise<string> {
  const cacheKey = `${lang}:${text.trim()}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  // Clean text: strip emojis and symbols that interfere with TTS pronunciation
  const cleanText = text
    .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .trim()
    .slice(0, 500);

  if (!cleanText) {
    throw new Error('Empty text after emoji cleanup');
  }

  // Split text into chunks if it exceeds 120 chars for Google TTS reliability
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
  const audioChunks: Buffer[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
    });

    if (!res.ok) {
      throw new Error(`TTS upstream error: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    audioChunks.push(Buffer.from(arrayBuffer));
  }

  if (audioChunks.length === 0) {
    throw new Error('No audio chunks received');
  }

  const combinedBuffer = Buffer.concat(audioChunks);
  const base64Audio = `data:audio/mpeg;base64,${combinedBuffer.toString('base64')}`;
  audioCache.set(cacheKey, base64Audio);
  return base64Audio;
}

/**
 * High-fidelity zero-key Neural Text-to-Speech API route.
 * Supports single text string or multi-slide string array for stories.
 * Supports Tamil ('ta') and English ('en', 'en-US', 'en-IN').
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, slides, lang = 'ta' } = body;

    // Multi-Slide passage mode for Story Reels
    if (Array.isArray(slides) && slides.length > 0) {
      const slideResults = await Promise.all(
        slides.map(async (slideText: string, idx: number) => {
          try {
            const audioBase64 = await fetchAudioForText(slideText, lang);
            return {
              index: idx,
              text: slideText,
              audioBase64,
              success: true,
            };
          } catch (err: any) {
            console.warn(`Failed TTS for slide ${idx}:`, err.message);
            return {
              index: idx,
              text: slideText,
              audioBase64: null,
              success: false,
            };
          }
        })
      );

      return NextResponse.json({
        success: true,
        mode: 'slides',
        slides: slideResults,
        lang,
      });
    }

    // Single text mode for single quotes
    if (text && typeof text === 'string') {
      const audioBase64 = await fetchAudioForText(text, lang);
      return NextResponse.json({
        success: true,
        mode: 'single',
        audioBase64,
        mimeType: 'audio/mpeg',
        lang,
      });
    }

    return NextResponse.json({ error: 'Either text or slides array is required' }, { status: 400 });
  } catch (error: any) {
    console.error('TTS Route Error:', error);
    return NextResponse.json({ error: error.message || 'TTS generation failed' }, { status: 500 });
  }
}
