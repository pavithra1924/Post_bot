import React from 'react';
import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export interface RenderServerCardParams {
  quote: string;
  author: string;
  badge: string;
  backgroundImageUrl: string;
  language?: 'ta' | 'en';
}

// In-memory font cache so fonts are only read from disk once
let cachedTamilFont: Buffer | null = null;
let cachedEnglishFont: Buffer | null = null;

function getFonts(): { tamilFont: Buffer; englishFont: Buffer } {
  if (!cachedTamilFont) {
    const tamilPath = path.join(process.cwd(), 'public', 'NotoSansTamil-Bold.ttf');
    cachedTamilFont = fs.readFileSync(tamilPath);
  }
  if (!cachedEnglishFont) {
    const englishPath = path.join(process.cwd(), 'public', 'NotoSans-Bold.ttf');
    cachedEnglishFont = fs.readFileSync(englishPath);
  }
  return { tamilFont: cachedTamilFont, englishFont: cachedEnglishFont };
}

/**
 * Renders a full 1080x1350 Canva/Pinterest style quote card with typography burned into the image.
 * Returns the public direct image URL ready for Meta Instagram ingestion.
 */
export async function renderAndUploadCardGraphic({
  quote,
  author,
  badge,
  backgroundImageUrl,
  language = 'en',
}: RenderServerCardParams): Promise<string> {
  const { tamilFont, englishFont } = getFonts();
  const isTamil = language === 'ta' || /[\u0B80-\u0BFF]/.test(quote);

  // Generate 1080x1350 (4:5) Instagram graphic via ImageResponse
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1350px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '80px 60px',
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          fontFamily: isTamil ? 'Noto Sans Tamil' : 'Noto Sans',
        }}
      >
        {/* Dark Vignette Overlay for maximum typography readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(7, 5, 10, 0.72)',
            display: 'flex',
          }}
        />

        {/* Top Decorative Border Corner Accents */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            borderTop: '3px solid #F59E0B',
            borderLeft: '3px solid #F59E0B',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '60px',
            height: '60px',
            borderTop: '3px solid #F59E0B',
            borderRight: '3px solid #F59E0B',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '60px',
            height: '60px',
            borderBottom: '3px solid #F59E0B',
            borderLeft: '3px solid #F59E0B',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            width: '60px',
            height: '60px',
            borderBottom: '3px solid #F59E0B',
            borderRight: '3px solid #F59E0B',
            display: 'flex',
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 28px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            color: '#FBBF24',
            fontSize: isTamil ? '22px' : '20px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            zIndex: 10,
          }}
        >
          {badge}
        </div>

        {/* Center Quote Typography Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px 40px',
            maxWidth: '960px',
            zIndex: 10,
          }}
        >
          {/* Quote Mark */}
          <div
            style={{
              fontSize: '80px',
              color: 'rgba(245, 158, 11, 0.6)',
              lineHeight: 0.8,
              marginBottom: '20px',
              display: 'flex',
            }}
          >
            “
          </div>

          {/* Quote Text */}
          <div
            style={{
              fontSize: isTamil ? (quote.length > 80 ? '42px' : '48px') : (quote.length > 100 ? '44px' : '52px'),
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.48,
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.95)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {quote}
          </div>

          {/* Author Attribution */}
          {author && (
            <div
              style={{
                marginTop: '45px',
                fontSize: isTamil ? '28px' : '26px',
                fontWeight: 700,
                color: '#FBBF24',
                letterSpacing: '1.5px',
                display: 'flex',
                alignItems: 'center',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              — {author}
            </div>
          )}
        </div>

        {/* Bottom Brand Handle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 32px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#E2E8F0',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '1px',
            zIndex: 10,
          }}
        >
          <span>✨ 𝕊𝕡𝕒𝕣𝕜 𝕎𝕚𝕥𝕙𝕚𝕟 • @_sparkwithin_hub_</span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        {
          name: 'Noto Sans Tamil',
          data: tamilFont,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Noto Sans',
          data: englishFont,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  // Convert ImageResponse to Buffer and upload to Uguu for direct public HTTPS URL
  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
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

  throw new Error('Failed to upload rendered quote card image to public CDN.');
}
