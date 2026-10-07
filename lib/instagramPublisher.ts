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
  profilePictureUrl?: string;
}

/**
 * Validates the user's Meta Graph API credentials and fetches the connected Instagram profile.
 */
export async function verifyInstagramAccount(
  igUserId: string,
  accessToken: string
): Promise<{ valid: boolean; account?: InstagramAccountInfo; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v21.0/${igUserId}?fields=id,username,name,profile_picture_url&access_token=${accessToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        valid: false,
        error: data.error?.message || 'Invalid Instagram credentials or token expired.',
      };
    }

    return {
      valid: true,
      account: {
        id: data.id,
        username: data.username,
        name: data.name,
        profilePictureUrl: data.profile_picture_url,
      },
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
 * Queries /me/accounts?fields=name,instagram_business_account{id,username,name,profile_picture_url}
 */
export async function autoDiscoverInstagramAccount(
  accessToken: string
): Promise<{ success: boolean; account?: InstagramAccountInfo; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v21.0/me/accounts?fields=name,instagram_business_account{id,username,name,profile_picture_url}&access_token=${accessToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        error: data.error?.message || 'Failed to query Facebook accounts for Instagram links.',
      };
    }

    const pages = data.data || [];
    for (const page of pages) {
      if (page.instagram_business_account) {
        const ig = page.instagram_business_account;
        return {
          success: true,
          account: {
            id: ig.id,
            username: ig.username,
            name: ig.name || page.name,
            profilePictureUrl: ig.profile_picture_url,
          },
        };
      }
    }

    return {
      success: false,
      error: 'No connected Instagram Creator or Business account found on your linked Facebook pages. Ensure your Instagram account is linked to a Facebook page.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Auto-discovery network error.',
    };
  }
}

/**
 * Publishes an image post to Instagram via Meta's 2-step Content Publishing API.
 */
export async function publishToInstagram({
  igUserId,
  accessToken,
  imageUrl,
  caption,
}: InstagramPublishParams): Promise<InstagramPublishResult> {
  try {
    // Step 1: Create the media container
    const createUrl = `https://graph.facebook.com/v21.0/${igUserId}/media`;
    const containerRes = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }),
    });

    const containerData = await containerRes.json();
    if (!containerRes.ok || containerData.error) {
      return {
        success: false,
        error: containerData.error?.message || 'Failed to create Instagram media container.',
      };
    }

    const creationId = containerData.id;

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
