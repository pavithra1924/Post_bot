import { NextRequest, NextResponse } from 'next/server';
import {
  publishToInstagram,
  verifyInstagramAccount,
  autoDiscoverInstagramAccount,
  extendToLongLivedToken,
} from '@/lib/instagramPublisher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'publish';

    // Support payload or server environment variables
    const accessToken = (body.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN || 'EAAMbn2U9KD4BSyaOjKRm33WyCaosjodaa3BG4kvq74Lcy4zW4DcSBurGZCsKScwQ5ilwNygtAEYZBZA6FqN7DDbZAoBxCpFL4ZA1sixmDcAr8Nf4KP26wZBELxFFM6inqQWkcwkdfYLQ6EADCtYel1Tp8qUK4IXqN4ptH0OHxkZBc1bW860bFEOVegYA3ZBZATjDl').trim();
    let igUserId = (body.igUserId || process.env.INSTAGRAM_USER_ID || '17841412392890201').trim();
    const imageUrl = body.imageUrl || body.imageBase64 || '';
    const caption = body.caption || '';

    // Action: Convert to Permanent Long-Lived Token (Never Expires)
    if (action === 'extend') {
      const appId = (body.appId || '874796342388798').trim();
      const appSecret = (body.appSecret || '').trim();

      if (!accessToken) {
        return NextResponse.json(
          { error: 'Meta Access Token is required to extend.' },
          { status: 400 }
        );
      }
      if (!appSecret) {
        return NextResponse.json(
          { error: 'Meta App Secret is required. Find it in Meta Dashboard > App Settings > Basic.' },
          { status: 400 }
        );
      }

      const extendResult = await extendToLongLivedToken({ accessToken, appId, appSecret });
      return NextResponse.json(extendResult);
    }

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
      if (!accessToken) {
        return NextResponse.json(
          { error: 'Meta Access Token is required.' },
          { status: 400 }
        );
      }
      // If igUserId is missing, attempt auto-discovery first
      if (!igUserId) {
        const auto = await autoDiscoverInstagramAccount(accessToken);
        if (auto.success && auto.account?.id) {
          igUserId = auto.account.id;
        } else {
          return NextResponse.json(
            { error: auto.error || 'Instagram Account ID and Access Token are required.' },
            { status: 400 }
          );
        }
      }
      const verification = await verifyInstagramAccount(igUserId, accessToken);
      return NextResponse.json(verification);
    }

    // Action: Publish Post
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Meta Access Token is required to publish.' },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Generated post image is required to publish.' },
        { status: 400 }
      );
    }

    // If igUserId is not provided, automatically discover it from the Access Token!
    if (!igUserId) {
      const discovery = await autoDiscoverInstagramAccount(accessToken);
      if (discovery.success && discovery.account?.id) {
        igUserId = discovery.account.id;
      } else {
        return NextResponse.json(
          { error: discovery.error || 'Could not auto-detect connected Instagram page. Please verify your Facebook page link.' },
          { status: 400 }
        );
      }
    }

    const publishResult = await publishToInstagram({
      igUserId,
      accessToken,
      imageUrl,
      caption: caption || 'Spark Within',
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
