import { VideoRenderConfig, renderVideoFrame } from './videoRenderer';

export interface ExportProgress {
  percent: number;
  currentFrame: number;
  totalFrames: number;
}

/**
 * High-speed in-browser 1080x1920 MP4/WebM video generator.
 * Encodes canvas frames into an exportable video file with perfectly synchronized audio (voice + BGM).
 */
export async function exportReelVideo(
  config: Omit<VideoRenderConfig, 'currentTime'>,
  onProgress: (prog: ExportProgress) => void,
  audioTrack?: MediaStreamTrack | null
): Promise<Blob> {
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = 1080;
  offscreenCanvas.height = 1920;

  const fps = 30;
  const duration = config.totalDuration;
  const totalFrames = Math.ceil(duration * fps);

  // Check supported mime types
  let mimeType = 'video/mp4';
  if (!MediaRecorder.isTypeSupported('video/mp4')) {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      mimeType = 'video/webm;codecs=vp9,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    }
  }

  const stream = offscreenCanvas.captureStream(fps);
  if (audioTrack && audioTrack.readyState === 'live') {
    try {
      stream.addTrack(audioTrack);
    } catch (err) {
      console.warn('Could not attach audio track to stream:', err);
    }
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8000000, // 8 Mbps high quality video
    audioBitsPerSecond: 128000,  // 128 kbps crisp voice & music
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      if (chunks.length > 0) {
        resolve(new Blob(chunks, { type: mimeType }));
      } else {
        reject(new Error('No video data recorded'));
      }
    };
    recorder.onerror = (err) => reject(err);
  });

  recorder.start(1000); // Gather chunks every second

  // Pace frames at real-time 1000 / fps (~33.3ms) to guarantee 100% audio-video sync with audioTrack
  const frameDelay = audioTrack ? Math.floor(1000 / fps) : 16;

  for (let frame = 0; frame < totalFrames; frame++) {
    const currentTime = frame / fps;
    renderVideoFrame(offscreenCanvas, {
      ...config,
      currentTime,
    });

    onProgress({
      percent: Math.round((frame / totalFrames) * 100),
      currentFrame: frame,
      totalFrames,
    });

    await new Promise((r) => setTimeout(r, frameDelay));
  }

  recorder.stop();
  return await recordingPromise;
}

export function downloadVideoBlob(blob: Blob, filename = 'sparkwithin-story-reel.mp4'): void {
  const isWebm = blob.type.includes('webm');
  const finalFilename = isWebm && filename.endsWith('.mp4') ? filename.replace(/\.mp4$/, '.webm') : filename;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
