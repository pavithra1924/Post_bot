import { VideoRenderConfig, renderVideoFrame } from './videoRenderer';

export interface ExportProgress {
  percent: number;
  currentFrame: number;
  totalFrames: number;
}

/**
 * High-speed in-browser 1080x1920 MP4/WebM video generator.
 * Encodes canvas frames into an exportable video file.
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
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9';
    } else {
      mimeType = 'video/webm';
    }
  }

  const stream = offscreenCanvas.captureStream(fps);
  if (audioTrack) {
    try {
      stream.addTrack(audioTrack);
    } catch (err) {
      console.warn('Could not attach audio track to stream:', err);
    }
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8000000, // 8 Mbps high quality
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
  });

  recorder.start();

  // Render each frame sequentially with precise timing
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

    // Small delay to allow recorder stream buffer to capture frame
    await new Promise((r) => setTimeout(r, 16));
  }

  recorder.stop();
  return await recordingPromise;
}

export function downloadVideoBlob(blob: Blob, filename = 'sparkwithin-reel.mp4'): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
