import { NextRequest, NextResponse } from 'next/server';
import {
  publishToInstagram,
  verifyInstagramAccount,
  autoDiscoverInstagramAccount,
} from '@/lib/instagramPublisher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, igUserId, accessToken, imageUrl, caption } = body;

    // Action: Auto-Discover Account from Access Token
    if (action === 'discover') {
      if (!accessToken) {
        return NextResponse.json(
          { error: 'Access Token is required to discover accounts.' },
          { status: 400 }
        );
      }
      const discovery = await autoDiscoverInstagramAccount(accessToken);
      return NextResponse.json(discovery);
    }

    // Action: Verify Account
    if (action === 'verify') {
      if (!igUserId || !accessToken) {
        return NextResponse.json(
          { error: 'Instagram Account ID and Access Token are required.' },
          { status: 400 }
        );
      }
      const verification = await verifyInstagramAccount(igUserId, accessToken);
      return NextResponse.json(verification);
    }

    // Action: Publish Post
    if (!igUserId || !accessToken || !imageUrl || !caption) {
      return NextResponse.json(
        { error: 'igUserId, accessToken, imageUrl, and caption are all required to publish.' },
        { status: 400 }
      );
    }

    const publishResult = await publishToInstagram({
      igUserId,
      accessToken,
      imageUrl,
      caption,
    });

    return NextResponse.json(publishResult);
  } catch (err: any) {
    console.error('API /api/instagram/publish error:', err);
    return NextResponse.json(
      { error: err.message || 'Instagram publishing service error.' },
      { status: 500 }
    );
  }
}
