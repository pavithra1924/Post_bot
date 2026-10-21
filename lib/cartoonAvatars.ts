import { computeLipSyncState, drawTalkingGirlAvatar } from './lipSyncEngine';

export interface CartoonCharacter {
  id: 'anime-warrior' | 'minimalist-doodle' | 'stoic-monk' | 'cosmic-wanderer' | 'indian-girl';
  name: string;
  badge: string;
  description: string;
  accentColor: string;
  particleType: 'sparks' | 'mist' | 'stars' | 'rain';
  isPhotoAvatar?: boolean;
  avatarImagePath?: string;
}

let cachedGirlImg: HTMLImageElement | null = null;
function getGirlAvatarImage(): HTMLImageElement | null {
  if (typeof window === 'undefined') return null;
  if (!cachedGirlImg) {
    cachedGirlImg = new Image();
    cachedGirlImg.src = '/avatars/indian-girl.png';
  }
  return cachedGirlImg;
}

export const CARTOON_CHARACTERS: CartoonCharacter[] = [
  {
    id: 'indian-girl',
    name: 'Aanya (AI Talking Photo)',
    badge: 'AI PHOTO LIP-SYNC ✨',
    description: 'Realistic talking Indian girl photo avatar with real-time audio lip-sync, blinking & speech animation',
    accentColor: '#EC4899',
    particleType: 'sparks',
    isPhotoAvatar: true,
    avatarImagePath: '/avatars/indian-girl.png',
  },
  {
    id: 'anime-warrior',
    name: 'Anime Flame Warrior',
    badge: 'INNER FIRE',
    description: 'Chibi anime warrior with glowing eyes, bandana, and fiery aura',
    accentColor: '#F59E0B',
    particleType: 'sparks',
  },
  {
    id: 'minimalist-doodle',
    name: 'Minimalist Line-Art Thinker',
    badge: 'VIRAL DOODLE',
    description: 'Viral black & white animated doodle philosopher (Dan Koe / MinuteVideos style)',
    accentColor: '#10B981',
    particleType: 'mist',
  },
  {
    id: 'stoic-monk',
    name: 'Hooded Stoic Monk',
    badge: 'QUIET MASTERY',
    description: 'Meditating hooded monk with a golden pulsing halo of discipline',
    accentColor: '#D4AF37',
    particleType: 'mist',
  },
  {
    id: 'cosmic-wanderer',
    name: 'Cosmic Star Explorer',
    badge: 'INFINITE MIND',
    description: 'Chibi astronaut looking up at galaxies and boundless nebula dust',
    accentColor: '#C084FC',
    particleType: 'stars',
  },
];

/**
 * Draws the selected cartoon character with smooth breathing and floating physics.
 */
export function drawCartoonCharacter(
  ctx: CanvasRenderingContext2D,
  characterId: string,
  cx: number,
  cy: number,
  time: number,
  scale = 1.0,
  amplitude = 0
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  const breath = Math.sin(time * 2.5) * 6;
  const float = Math.sin(time * 1.5) * 8;

  if (characterId === 'indian-girl') {
    const img = getGirlAvatarImage();
    if (img && img.complete && img.naturalWidth > 0) {
      const state = computeLipSyncState(amplitude, time);
      drawTalkingGirlAvatar(
        ctx,
        img,
        state,
        0,
        float * 0.2,
        340,
        435,
        {
          enableBlink: true,
          enableBreathing: true,
          enableHeadMotion: true,
          shadowGlow: 'rgba(236, 72, 153, 0.32)',
        }
      );
    } else {
      ctx.fillStyle = '#1B101A';
      ctx.beginPath();
      ctx.arc(0, float, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  if (characterId === 'anime-warrior') {
    // 1. Fiery Back Aura
    const auraPulse = Math.sin(time * 4) * 12;
    const auraGrad = ctx.createRadialGradient(0, float, 40, 0, float, 140 + auraPulse);
    auraGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
    auraGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.20)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, float, 140 + auraPulse, 0, Math.PI * 2);
    ctx.fill();

    // Body (Cloak)
    ctx.fillStyle = '#1A1829';
    ctx.beginPath();
    ctx.moveTo(-50, 60 + float);
    ctx.lineTo(50, 60 + float);
    ctx.lineTo(70, 150 + float);
    ctx.lineTo(-70, 150 + float);
    ctx.closePath();
    ctx.fill();

    // Red Scarf / Cape trailing
    const capeWave = Math.sin(time * 3) * 14;
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(35, 60 + float);
    ctx.quadraticCurveTo(80 + capeWave, 90 + float, 100 + capeWave * 1.5, 160 + float);
    ctx.lineTo(60 + capeWave, 165 + float);
    ctx.quadraticCurveTo(50, 100 + float, 20, 70 + float);
    ctx.fill();

    // Head
    ctx.fillStyle = '#FFE0BD';
    ctx.beginPath();
    ctx.arc(0, float + breath, 52, 0, Math.PI * 2);
    ctx.fill();

    // Spiky Hair (Dark Navy with Golden highlights)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(-56, float - 10 + breath);
    ctx.lineTo(-75, float - 60 + breath);
    ctx.lineTo(-30, float - 45 + breath);
    ctx.lineTo(0, float - 85 + breath);
    ctx.lineTo(30, float - 45 + breath);
    ctx.lineTo(75, float - 60 + breath);
    ctx.lineTo(56, float - 10 + breath);
    ctx.closePath();
    ctx.fill();

    // Bandana with Spark Symbol
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-52, float - 8 + breath, 104, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, float + 2 + breath, 5, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Eyes
    const eyeBlink = Math.sin(time * 0.8) > 0.96 ? 2 : 12;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-18, float + 18 + breath, 10, eyeBlink, 0, 0, Math.PI * 2);
    ctx.ellipse(18, float + 18 + breath, 10, eyeBlink, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris (Amber Fire Glow)
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(-18, float + 18 + breath, 5, 0, Math.PI * 2);
    ctx.arc(18, float + 18 + breath, 5, 0, Math.PI * 2);
    ctx.fill();

  } else if (characterId === 'minimalist-doodle') {
    // 2. Viral Black & White Line-Art Doodle (Dan Koe / MinuteVideos style)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Glowing Platform / Boulder
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(0, 130, 90, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Stick Body (Sitting / Thinking Pose)
    const dHeadY = -20 + float + breath;
    
    // Head (Circle)
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(0, dHeadY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lightbulb / Spark inside head
    const sparkGlow = Math.abs(Math.sin(time * 3));
    ctx.fillStyle = `rgba(16, 185, 129, ${0.7 + sparkGlow * 0.3})`;
    ctx.beginPath();
    ctx.arc(0, dHeadY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Spine
    ctx.beginPath();
    ctx.moveTo(0, dHeadY + 32);
    ctx.lineTo(-5, 60 + float);
    ctx.stroke();

    // Thinking Arm (Hand on chin)
    ctx.beginPath();
    ctx.moveTo(0, dHeadY + 45);
    ctx.lineTo(25, dHeadY + 35);
    ctx.lineTo(15, dHeadY + 10);
    ctx.stroke();

    // Other Arm resting on knee
    ctx.beginPath();
    ctx.moveTo(-2, dHeadY + 45);
    ctx.lineTo(-30, 45 + float);
    ctx.lineTo(-20, 90 + float);
    ctx.stroke();

    // Bent Legs
    ctx.beginPath();
    ctx.moveTo(-5, 60 + float);
    ctx.lineTo(-40, 75 + float);
    ctx.lineTo(-30, 125);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5, 60 + float);
    ctx.lineTo(35, 75 + float);
    ctx.lineTo(25, 125);
    ctx.stroke();

  } else if (characterId === 'stoic-monk') {
    // 3. Hooded Stoic Monk
    // Golden Halo / Ring of Discipline
    const ringPulse = Math.sin(time * 2) * 8;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.75)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, float - 10, 85 + ringPulse, 0, Math.PI * 2);
    ctx.stroke();

    // Robes (Deep Charcoal with Gold trim)
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.moveTo(-60, 40 + float);
    ctx.lineTo(60, 40 + float);
    ctx.lineTo(95, 145 + float);
    ctx.lineTo(-95, 145 + float);
    ctx.closePath();
    ctx.fill();

    // Hood
    ctx.fillStyle = '#131A29';
    ctx.beginPath();
    ctx.moveTo(0, float - 60 + breath);
    ctx.quadraticCurveTo(55, float - 50 + breath, 50, float + 35 + breath);
    ctx.lineTo(-50, float + 35 + breath);
    ctx.quadraticCurveTo(-55, float - 50 + breath, 0, float - 60 + breath);
    ctx.fill();

    // Shadowed Face Void
    ctx.fillStyle = '#020408';
    ctx.beginPath();
    ctx.ellipse(0, float - 5 + breath, 34, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Calm glowing monk eyes
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.ellipse(-14, float - 2 + breath, 8, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(14, float - 2 + breath, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Meditating Folded Hands
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(0, 65 + float, 14, 0, Math.PI * 2);
    ctx.fill();

  } else {
    // 4. Cosmic Star Explorer (Chibi Astronaut)
    // Starfield Halo
    ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
    ctx.beginPath();
    ctx.arc(0, float, 95, 0, Math.PI * 2);
    ctx.fill();

    // Spacesuit Body
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(-45, 40 + float, 90, 85, 24);
    ctx.fill();

    // Chest control panel
    ctx.fillStyle = '#C084FC';
    ctx.fillRect(-18, 55 + float, 36, 16);

    // Big Helmet
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, float - 10 + breath, 62, 0, Math.PI * 2);
    ctx.fill();

    // Shiny Visor (Reflecting purple stars)
    const visorGrad = ctx.createLinearGradient(-35, float - 30, 35, float + 10);
    visorGrad.addColorStop(0, '#381A5F');
    visorGrad.addColorStop(0.5, '#581C87');
    visorGrad.addColorStop(1, '#0F0728');
    ctx.fillStyle = visorGrad;
    ctx.beginPath();
    ctx.ellipse(0, float - 10 + breath, 44, 34, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor Star Reflection
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-16, float - 20 + breath, 4, 0, Math.PI * 2);
    ctx.arc(20, float - 8 + breath, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
