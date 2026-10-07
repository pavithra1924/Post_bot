import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * High-fidelity zero-key Neural Text-to-Speech API route.
 * Supports Tamil ('ta'), English ('en', 'en-US', 'en-IN'), Hindi ('hi'), etc.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, lang = 'ta' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text string is required' }, { status: 400 });
    }

    const cleanText = text.trim().slice(0, 500); // Safety limit

    // Split text into chunks if it exceeds 150 chars for Google TTS
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    const audioChunks: Buffer[] = [];

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://translate.google.com/',
        },
      });

      if (!res.ok) {
        throw new Error(`TTS upstream service error: ${res.status}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      audioChunks.push(Buffer.from(arrayBuffer));
    }

    if (audioChunks.length === 0) {
      return NextResponse.json({ error: 'No audio generated' }, { status: 400 });
    }

    const combinedBuffer = Buffer.concat(audioChunks);
    const audioBase64 = `data:audio/mpeg;base64,${combinedBuffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      audioBase64,
      mimeType: 'audio/mpeg',
      bytes: combinedBuffer.length,
      lang,
    });
  } catch (error: any) {
    console.error('TTS Route Error:', error);
    return NextResponse.json({ error: error.message || 'TTS generation failed' }, { status: 500 });
  }
}
