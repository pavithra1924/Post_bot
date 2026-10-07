import { NextRequest, NextResponse } from 'next/server';
import { analyzeQuoteWithGemini } from '@/lib/aiAnalyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quote, author, apiKey } = body;

    if (!quote || typeof quote !== 'string') {
      return NextResponse.json(
        { error: 'Quote text is required' },
        { status: 400 }
      );
    }

    const result = await analyzeQuoteWithGemini(quote, author, apiKey);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('API /api/analyze error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
