/**
 * Official Meta Instagram Graph API (v21.0) Client for Content Publishing.
 * Supports Instagram Professional (Business or Creator) accounts.
 */

export interface InstagramPublishParams {
  igUserId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
}

export interface InstagramPublishResult {
  success: boolean;
  creationId?: string;
  postId?: string;
  error?: string;
}

export interface InstagramAccountInfo {
  id: string;
  username: string;
  name?: string;
}

/**
 * Validates the user's Meta Graph API credentials and fetches the connected Instagram profile.
 * Intelligently handles Instagram IDs, Page IDs, User IDs, and Page Access Tokens.
 */
export async function verifyInstagramAccount(
  igUserId: string,
  accessToken: string
): Promise<{ valid: boolean; account?: InstagramAccountInfo; error?: string }> {
  try {
    // 1. First try querying directly as an Instagram Account (safe fields: id,username,name)
    const url = `https://graph.facebook.com/v21.0/${igUserId}?fields=id,username,name&access_token=${accessToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (res.ok && data.id && data.username) {
      return {
        valid: true,
        account: {
          id: data.id,
          username: data.username,
          name: data.name,
        },
      };
    }

    // 2. If it's a Page ID with connected instagram_business_account:
    const pageUrl = `https://graph.facebook.com/v21.0/${igUserId}?fields=id,name,instagram_business_account{id,username,name}&access_token=${accessToken}`;
    const pageRes = await fetch(pageUrl);
    const pageData = await pageRes.json();

    if (pageRes.ok && pageData.instagram_business_account) {
      const ig = pageData.instagram_business_account;
      return {
        valid: true,
        account: {
          id: ig.id,
          username: ig.username,
          name: ig.name || pageData.name,
        },
      };
    }

    // 3. Fallback: auto-discover from the token directly
    const auto = await autoDiscoverInstagramAccount(accessToken);
    if (auto.success && auto.account) {
      return {
        valid: true,
        account: auto.account,
      };
    }

    return {
      valid: false,
      error:
        auto.error ||
        data.error?.message ||
        'Could not verify Instagram Account ID. Please click "Auto-Detect My Instagram Account ID" above.',
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || 'Failed to connect to Meta Graph API.',
    };
  }
}

/**
 * Auto-discovers the Instagram Business/Creator account ID from the Access Token.
 * Supports:
 * - Page Access Tokens (/me has instagram_business_account)
 * - User Access Tokens (/me/accounts has pages with instagram_business_account)
 * - Meta Business Suite (/me/businesses has instagram_accounts)
 */
export async function autoDiscoverInstagramAccount(
  accessToken: string
): Promise<{ success: boolean; account?: InstagramAccountInfo; error?: string }> {
  try {
    // Check 1: Is this a Page Access Token? (/me IS the Page directly!)
    const meUrl = `https://graph.facebook.com/v21.0/me?fields=id,name,instagram_business_account{id,username,name}&access_token=${accessToken}`;
    const meRes = await fetch(meUrl);
    const meData = await meRes.json();

    if (meRes.ok && meData.instagram_business_account) {
      const ig = meData.instagram_business_account;
      return {
        success: true,
        account: {
          id: ig.id,
          username: ig.username,
          name: ig.name || meData.name,
        },
      };
    }

    // Check 2: Is this a User Access Token? (/me/accounts lists the user's Pages)
    const accUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${accessToken}`;
    const accRes = await fetch(accUrl);
    const accData = await accRes.json();

    if (accRes.ok && Array.isArray(accData.data) && accData.data.length > 0) {
      for (const page of accData.data) {
        if (page.instagram_business_account) {
          const ig = page.instagram_business_account;
          return {
            success: true,
            account: {
              id: ig.id,
              username: ig.username,
              name: ig.name || page.name,
            },
          };
        }
      }
    }

    // Check 3: Is it linked via Meta Business Suite?
    try {
      const bizUrl = `https://graph.facebook.com/v21.0/me/businesses?fields=id,name,instagram_accounts{id,username,name}&access_token=${accessToken}`;
      const bizRes = await fetch(bizUrl);
      const bizData = await bizRes.json();
      if (bizRes.ok && Array.isArray(bizData.data)) {
        for (const biz of bizData.data) {
          if (biz.instagram_accounts?.data?.[0]) {
            const ig = biz.instagram_accounts.data[0];
            return {
              success: true,
              account: {
                id: ig.id,
                username: ig.username,
                name: ig.name || biz.name,
              },
            };
          }
        }
      }
    } catch (_) {}

    // Detailed diagnostic feedback
    let diagnostic = '';
    if (meData?.name) {
      diagnostic += `Account: "${meData.name}". `;
    }
    if (Array.isArray(accData?.data)) {
      if (accData.data.length > 0) {
        const pNames = accData.data.map((p: any) => p.name).join(', ');
        diagnostic += `Found Page(s): "${pNames}", but Instagram is not linked. `;
      } else {
        diagnostic += `0 Pages returned by Meta for this token. `;
      }
    }
    if (accData?.error) {
      diagnostic += `Meta note: ${accData.error.message}. `;
    }

    return {
      success: false,
      error: `Could not detect connected Instagram. ${diagnostic}Ensure @_sparkwithin_hub_ is linked to your Facebook Page.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Auto-discovery network error.',
    };
  }
}

/**
 * Ensures the image URL is a publicly accessible HTTPS link for Meta Graph API.
 * If a data URL or base64 string is provided, uploads it to get a direct public image URL.
 */
export async function ensurePublicImageUrl(imageUrl: string): Promise<string> {
  if (!imageUrl) throw new Error('Image URL is required for publishing.');

  // If it's already an external public HTTP/HTTPS URL (not localhost), return it directly
  if (
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
    !imageUrl.includes('localhost') &&
    !imageUrl.includes('127.0.0.1')
  ) {
    return imageUrl;
  }

  // If it is a data URL or base64, upload to freeimage.host
  try {
    const base64Data = imageUrl.includes('base64,')
      ? imageUrl.split('base64,')[1]
      : imageUrl;

    const body = new URLSearchParams();
    body.append('key', '6d207e02198a847aa98d0a2a901485a5');
    body.append('action', 'upload');
    body.append('format', 'json');
    body.append('source', base64Data);

    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await res.json();
    if (res.ok && data?.image?.url) {
      return data.image.url;
    }
    throw new Error(data?.error?.message || 'Image host service returned an error.');
  } catch (err: any) {
    console.error('ensurePublicImageUrl error:', err);
    throw new Error(`Could not prepare image for Instagram: ${err.message}`);
  }
}

/**
 * Publishes an image post to Instagram via Meta's 2-step Content Publishing API.
 * Handles automatic image hosting, container readiness polling, and direct publishing.
 */
export async function publishToInstagram({
  igUserId,
  accessToken,
  imageUrl,
  caption,
}: InstagramPublishParams): Promise<InstagramPublishResult> {
  try {
    // Step 0: Ensure the image is a publicly accessible URL on the internet
    const publicImageUrl = await ensurePublicImageUrl(imageUrl);

    // Step 1: Create the media container
    const createUrl = `https://graph.facebook.com/v21.0/${igUserId}/media`;
    const containerRes = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: publicImageUrl,
        caption: caption,
        access_token: accessToken,
      }),
    });

    const containerData = await containerRes.json();
    if (!containerRes.ok || containerData.error) {
      const msg = containerData.error?.message || 'Failed to create Instagram media container.';
      return {
        success: false,
        error: msg.includes('access token')
          ? 'Your Meta Access Token is expired or invalid. Please refresh it in the Meta Developer Portal.'
          : msg,
      };
    }

    const creationId = containerData.id;

    // Step 1.5: Poll container status until ready (Meta image ingestion)
    let isReady = false;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const statusUrl = `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`;
        const statusRes = await fetch(statusUrl);
        const statusData = await statusRes.json();

        if (statusData.status_code === 'FINISHED') {
          isReady = true;
          break;
        } else if (statusData.status_code === 'ERROR') {
          return {
            success: false,
            creationId,
            error: 'Instagram rejected the media processing. Please verify the image dimensions.',
          };
        }
      } catch (_) {}

      // Wait 1.2s before next check
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Step 2: Publish the media container
    const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || publishData.error) {
      return {
        success: false,
        creationId,
        error: publishData.error?.message || 'Media created, but failed to publish container.',
      };
    }

    return {
      success: true,
      creationId,
      postId: publishData.id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unexpected network error publishing to Instagram.',
    };
  }
}
