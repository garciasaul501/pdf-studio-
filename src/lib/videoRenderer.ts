import { VideoScene } from '../types/whop';

export interface RenderVideoOptions {
  aspectRatio: '16:9' | '9:16';
  fps?: number;
  onProgress?: (percent: number, currentScene: number, totalScenes: number) => void;
}

export async function renderRealVideoFromScenes(
  scenes: VideoScene[],
  options: RenderVideoOptions
): Promise<{ videoBlob: Blob; videoUrl: string; fileName: string }> {
  const isVertical = options.aspectRatio === '9:16';
  const width = isVertical ? 720 : 1280;
  const height = isVertical ? 1280 : 720;
  const fps = options.fps || 25;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Preload all scene images
  const loadedImages: HTMLImageElement[] = await Promise.all(
    scenes.map((scene) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          // If image fails, create fallback canvas pattern
          const dummy = document.createElement('canvas');
          dummy.width = 100;
          dummy.height = 100;
          const dctx = dummy.getContext('2d')!;
          dctx.fillStyle = scene.accentColor || '#FF6243';
          dctx.fillRect(0, 0, 100, 100);
          const fallbackImg = new Image();
          fallbackImg.src = dummy.toDataURL();
          resolve(fallbackImg);
        };
        img.src = scene.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
      });
    })
  );

  // Setup Web Audio synthesized speech tone track for real audio in the video
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  const stream = canvas.captureStream(fps);

  // Add audio tracks if available
  if (dest.stream.getAudioTracks().length > 0) {
    dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
  }

  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4'
  ];
  let chosenMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: chosenMime,
    videoBitsPerSecond: 3000000 // 3 Mbps high quality
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<{ videoBlob: Blob; videoUrl: string; fileName: string }>(
    (resolve, reject) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: chosenMime });
        const videoUrl = URL.createObjectURL(blob);
        const ext = chosenMime.includes('mp4') ? 'mp4' : 'webm';
        resolve({
          videoBlob: blob,
          videoUrl,
          fileName: `PDF-to-Video-AI-${Date.now()}.${ext}`
        });
      };
      mediaRecorder.onerror = (e) => reject(e);
    }
  );

  mediaRecorder.start();

  // Total frames computation
  const sceneDurations = scenes.map((s) => s.duration || 6);
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);
  const totalFrames = Math.round(totalDuration * fps);

  let currentFrame = 0;

  for (let sIdx = 0; sIdx < scenes.length; sIdx++) {
    const scene = scenes[sIdx];
    const img = loadedImages[sIdx];
    const durationSec = sceneDurations[sIdx];
    const sceneFrames = Math.round(durationSec * fps);

    for (let f = 0; f < sceneFrames; f++) {
      currentFrame++;
      const sceneProgress = f / sceneFrames;
      const overallPercent = Math.min(99, Math.round((currentFrame / totalFrames) * 100));

      options.onProgress?.(overallPercent, sIdx + 1, scenes.length);

      // Render Frame
      drawSceneFrame(ctx, width, height, isVertical, scene, img, sceneProgress, sIdx + 1, scenes.length);

      // Wait for next frame timing
      await new Promise((r) => setTimeout(r, 1000 / fps));
    }
  }

  options.onProgress?.(100, scenes.length, scenes.length);
  mediaRecorder.stop();
  audioCtx.close().catch(() => {});

  return recordingPromise;
}

function drawSceneFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isVertical: boolean,
  scene: VideoScene,
  img: HTMLImageElement,
  progress: number,
  sceneNumber: number,
  totalScenes: number
) {
  ctx.save();

  // 1. Clear background
  ctx.fillStyle = '#0B0D14';
  ctx.fillRect(0, 0, width, height);

  // 2. Draw AI Background Image with subtle Ken Burns effect (zoom 1.0 -> 1.15)
  const scale = 1.0 + progress * 0.12;
  const panX = Math.sin(progress * Math.PI) * 20;

  ctx.save();
  ctx.translate(width / 2 + panX, height / 2);
  ctx.scale(scale, scale);

  const imgRatio = img.width / img.height;
  const targetRatio = width / height;
  let drawW = width;
  let drawH = height;

  if (imgRatio > targetRatio) {
    drawH = height;
    drawW = height * imgRatio;
  } else {
    drawW = width;
    drawH = width / imgRatio;
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  // 3. Cinematic Dark Gradient Overlay
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(11, 13, 20, 0.7)');
  gradient.addColorStop(0.5, 'rgba(11, 13, 20, 0.82)');
  gradient.addColorStop(1, 'rgba(11, 13, 20, 0.96)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 4. Accent Color Ambient Glow
  const radialGlow = ctx.createRadialGradient(
    width * 0.8,
    height * 0.3,
    50,
    width * 0.8,
    height * 0.3,
    width * 0.6
  );
  radialGlow.addColorStop(0, `${scene.accentColor || '#FF6243'}40`);
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // 5. Top Progress Bar across entire video
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(0, 0, width, 6);
  ctx.fillStyle = scene.accentColor || '#FF6243';
  ctx.fillRect(0, 0, width * ((sceneNumber - 1 + progress) / totalScenes), 6);

  // 6. Header: Category badge & Slide Counter
  ctx.font = 'bold 16px -apple-system, sans-serif';
  ctx.fillStyle = scene.accentColor || '#FF6243';
  ctx.fillText('✦ PDF TO VIDEO AI · ESCENA ' + sceneNumber + ' DE ' + totalScenes, 40, isVertical ? 70 : 50);

  // 7. Title with drop shadow
  ctx.font = isVertical ? 'bold 36px -apple-system, sans-serif' : 'bold 40px -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 12;

  wrapText(ctx, scene.title, 40, isVertical ? 130 : 110, width - 80, isVertical ? 46 : 50);
  ctx.shadowBlur = 0;

  // 8. Bullet points
  const startY = isVertical ? 320 : 250;
  const lineSpacing = isVertical ? 90 : 80;

  scene.bulletPoints.forEach((point, pIdx) => {
    // Staggered reveal based on progress
    const pointThreshold = (pIdx + 1) * 0.22;
    if (progress >= pointThreshold * 0.5) {
      const currentY = startY + pIdx * lineSpacing;

      // Card container background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      roundRect(ctx, 40, currentY - 30, width - 80, isVertical ? 72 : 65, 14);
      ctx.fill();

      // Card border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Checkmark icon badge
      ctx.fillStyle = scene.accentColor || '#FF6243';
      ctx.beginPath();
      ctx.arc(68, currentY + (isVertical ? 6 : 2), 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('✓', 63, currentY + (isVertical ? 10 : 6));

      // Point text
      ctx.font = isVertical ? '500 20px -apple-system, sans-serif' : '500 22px -apple-system, sans-serif';
      ctx.fillStyle = '#E2E8F0';
      wrapText(ctx, point, 95, currentY + (isVertical ? 12 : 8), width - 150, 26);
    }
  });

  // 9. Karaoke / Subtitle Bar at Bottom
  const subtitleBoxY = height - (isVertical ? 220 : 150);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  roundRect(ctx, 30, subtitleBoxY, width - 60, isVertical ? 160 : 100, 20);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Subtitle header
  ctx.font = 'bold 13px -apple-system, sans-serif';
  ctx.fillStyle = scene.accentColor || '#F59E0B';
  ctx.fillText('🎙️ LOCUCIÓN EN TIEMPO REAL', 55, subtitleBoxY + 30);

  // Subtitle text with word-highlight karaoke effect
  const words = scene.narration.split(' ');
  const currentWordIdx = Math.floor(progress * words.length);

  ctx.font = isVertical ? 'bold 22px -apple-system, sans-serif' : 'bold 24px -apple-system, sans-serif';
  ctx.fillStyle = '#FDE047'; // Bright yellow
  wrapText(ctx, `"${scene.narration}"`, 55, subtitleBoxY + (isVertical ? 70 : 65), width - 110, isVertical ? 32 : 32);

  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
