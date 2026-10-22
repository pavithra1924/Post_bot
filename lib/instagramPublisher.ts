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
  permalink?: string;
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

export interface ExtendTokenResult {
  success: boolean;
  permanentToken?: string;
  pageName?: string;
  expires?: string;
  error?: string;
}

/**
 * Exchanges a short-lived Meta User/Page Access Token for a permanent (never-expiring)
 * Page Access Token using Meta's fb_exchange_token endpoint and /me/accounts.
 */
export async function extendToLongLivedToken({
  accessToken,
  appId,
  appSecret,
}: {
  accessToken: string;
  appId: string;
  appSecret: string;
}): Promise<ExtendTokenResult> {
  try {
    const cleanToken = accessToken.trim();
    const cleanAppId = (appId || '874796342388798').trim();
    const cleanSecret = appSecret.trim();

    if (!cleanToken) {
      return { success: false, error: 'Current Access Token is required.' };
    }
    if (!cleanSecret) {
      return { success: false, error: 'Meta App Secret is required. Find it in Meta Dashboard > App Settings > Basic.' };
    }

    // 1. Exchange short-lived token for long-lived user token (valid 60 days)
    const exchangeUrl = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${cleanAppId}&client_secret=${cleanSecret}&fb_exchange_token=${cleanToken}`;
    const exchangeRes = await fetch(exchangeUrl);
    const exchangeData = await exchangeRes.json();

    if (!exchangeRes.ok || exchangeData.error) {
      const msg = exchangeData.error?.message || 'Meta rejected token exchange.';
      return {
        success: false,
        error: `Meta Token Exchange failed: ${msg}`,
      };
    }

    const longLivedUserToken = exchangeData.access_token;

    // 2. Query /me/accounts with the long-lived token to get NEVER-EXPIRING Page Access Tokens!
    const accountsUrl = `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${longLivedUserToken}`;
    const accountsRes = await fetch(accountsUrl);
    const accountsData = await accountsRes.json();

    if (accountsRes.ok && Array.isArray(accountsData.data) && accountsData.data.length > 0) {
      // Find the page linked to Instagram, or the first page
      const pageWithIg =
        accountsData.data.find((p: any) => p.instagram_business_account) ||
        accountsData.data[0];

      if (pageWithIg && pageWithIg.access_token) {
        return {
          success: true,
          permanentToken: pageWithIg.access_token,
          pageName: pageWithIg.name,
          expires: 'Never (Permanent Page Token)',
        };
      }
    }

    // Fallback: Return the 60-day long-lived token
    return {
      success: true,
      permanentToken: longLivedUserToken,
      expires: '60 Days (Long-Lived User Token)',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error exchanging token with Meta.',
    };
  }
}

/**
 * Ensures the image URL is a publicly accessible HTTPS link for Meta Graph API.
 * If a data URL or base64 string is provided, uploads it to get a direct public image URL.
 */
export async function ensurePublicImageUrl(imageUrl: string): Promise<string> {
  if (!imageUrl) throw new Error('Image URL is required for publishing.');

  // If it's already an external public HTTP/HTTPS URL (not localhost or data url), return it directly
  if (
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) &&
    !imageUrl.includes('localhost') &&
    !imageUrl.includes('127.0.0.1')
  ) {
    return imageUrl;
  }

  // If it is a data URL or base64, upload to Uguu (free, direct HTTPS image hosting)
  try {
    const base64Data = imageUrl.includes('base64,')
      ? imageUrl.split('base64,')[1]
      : imageUrl;

    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('files[]', blob, `sparkwithin-${Date.now()}.png`);

    const res = await fetch('https://uguu.se/upload.php', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data?.success && data?.files?.[0]?.url) {
      return data.files[0].url;
    }
    throw new Error(data?.errors?.[0] || 'Image hosting service failed to store graphic.');
  } catch (err: any) {
    console.error('ensurePublicImageUrl error:', err);
    throw new Error(`Could not prepare image for Instagram: ${err.message}`);
  }
}

/**
 * Publishes an image post to Instagram via Meta's 2-step Content Publishing API.
 * Uses official x-www-form-urlencoded payloads for reliable parameter parsing by Meta servers.
 */
export async function publishToInstagram({
  igUserId,
  accessToken,
  imageUrl,
  caption,
}: InstagramPublishParams): Promise<InstagramPublishResult> {
  try {
    // Step 0: Ensure the image is a direct public URL
    const publicImageUrl = await ensurePublicImageUrl(imageUrl);

    // Step 1: Create the media container using form-urlencoded parameters
    const createUrl = `https://graph.facebook.com/v21.0/${igUserId}/media`;
    const containerParams = new URLSearchParams();
    containerParams.append('image_url', publicImageUrl);
    containerParams.append('caption', caption);
    containerParams.append('access_token', accessToken);

    const containerRes = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: containerParams.toString(),
    });

    const containerData = await containerRes.json();
    if (!containerRes.ok || containerData.error) {
      const err = containerData.error || {};
      let msg = err.message || 'Failed to create Instagram media container.';
      if (err.error_user_msg) msg += ` — ${err.error_user_msg}`;
      if (err.error_subcode) msg += ` (Subcode: ${err.error_subcode})`;
      if (err.code) msg += ` (Code: ${err.code})`;

      if (msg.includes('unknown error') || err.code === 1) {
        msg += ' • Tip: Check that your token was generated under "Page Access Tokens" with instagram_content_publish enabled, and ensure @_sparkwithin_hub_ is added under Meta App Roles > Roles > Instagram Testers.';
      } else if (msg.includes('access token')) {
        msg = 'Your Meta Access Token is expired or invalid. Please refresh it in the Meta Developer Portal.';
      }

      return {
        success: false,
        error: msg,
      };
    }

    const creationId = containerData.id;

    // Step 1.5: Poll container status until ready (Meta image ingestion)
    let isReady = false;
    for (let attempt = 0; attempt < 8; attempt++) {
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
            error: 'Instagram rejected the media processing. Please check image aspect ratio (1:1, 4:5, or 9:16 recommended).',
          };
        }
      } catch (_) {}

      // Wait 1.5s before next check
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Step 2: Publish the media container
    const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish`;
    const publishParams = new URLSearchParams();
    publishParams.append('creation_id', creationId);
    publishParams.append('access_token', accessToken);

    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: publishParams.toString(),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || publishData.error) {
      const err = publishData.error || {};
      let msg = err.message || 'Media created, but failed to publish container.';
      if (err.error_user_msg) msg += ` — ${err.error_user_msg}`;
      if (err.error_subcode) msg += ` (Subcode: ${err.error_subcode})`;
      if (err.code) msg += ` (Code: ${err.code})`;

      return {
        success: false,
        creationId,
        error: msg,
      };
    }

    // Step 3: Fetch the direct public permalink so the user can immediately click and view it on Instagram
    let permalink: string | undefined;
    try {
      const infoUrl = `https://graph.facebook.com/v21.0/${publishData.id}?fields=permalink&access_token=${accessToken}`;
      const infoRes = await fetch(infoUrl);
      const infoData = await infoRes.json();
      if (infoData.permalink) {
        permalink = infoData.permalink;
      }
    } catch (_) {}

    return {
      success: true,
      creationId,
      postId: publishData.id,
      permalink,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unexpected network error publishing to Instagram.',
    };
  }
}
