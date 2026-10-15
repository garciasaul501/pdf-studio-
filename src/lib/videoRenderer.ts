import { VideoScene, PresenterAvatar, VisualStyle3D } from '../types/whop';

export interface RenderVideoOptions {
  aspectRatio: '16:9' | '9:16';
  fps?: number;
  presenter?: PresenterAvatar;
  includeAvatar?: boolean;
  visualStyle?: VisualStyle3D;
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

  // Preload presenter avatar if enabled
  let avatarImg: HTMLImageElement | null = null;
  let talkingAvatarImg: HTMLImageElement | null = null;

  if (options.includeAvatar && options.presenter) {
    avatarImg = await loadImage(options.presenter.avatarUrl);
    talkingAvatarImg = await loadImage(options.presenter.talkingAvatarUrl);
  }

  // Setup Web Audio synthesized tone track for real audio output
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  const stream = canvas.captureStream(fps);

  const sceneDurations = scenes.map((s) => s.duration || 6);
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);

  // Synthesize rich ambient background audio into the video
  startAmbientSoundtrack(audioCtx, dest, totalDuration);

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
    videoBitsPerSecond: 3500000 // 3.5 Mbps high definition
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
          fileName: `PDF-AI-Video-3D-${Date.now()}.${ext}`
        });
      };
      mediaRecorder.onerror = (e) => reject(e);
    }
  );

  mediaRecorder.start();

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

      // Render 3D Scene Frame with Talking Presenter
      draw3DSceneWithPresenter(
        ctx,
        width,
        height,
        isVertical,
        scene,
        img,
        sceneProgress,
        sIdx + 1,
        scenes.length,
        options.presenter,
        avatarImg,
        talkingAvatarImg,
        f
      );

      await new Promise((r) => setTimeout(r, 1000 / fps));
    }
  }

  options.onProgress?.(100, scenes.length, scenes.length);
  mediaRecorder.stop();
  audioCtx.close().catch(() => {});

  return recordingPromise;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const fallback = new Image();
      fallback.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
      resolve(fallback);
    };
    img.src = src;
  });
}

function draw3DSceneWithPresenter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isVertical: boolean,
  scene: VideoScene,
  img: HTMLImageElement,
  progress: number,
  sceneNumber: number,
  totalScenes: number,
  presenter?: PresenterAvatar,
  avatarImg?: HTMLImageElement | null,
  talkingAvatarImg?: HTMLImageElement | null,
  frameIdx: number = 0
) {
  ctx.save();

  // 1. Clear background
  ctx.fillStyle = '#090B10';
  ctx.fillRect(0, 0, width, height);

  // 2. 3D Modern Visual Backdrop with Ken Burns Camera Zoom
  const scale = 1.0 + progress * 0.14;
  const panX = Math.sin(progress * Math.PI) * 24;
  const panY = Math.cos(progress * Math.PI) * 12;

  ctx.save();
  ctx.translate(width / 2 + panX, height / 2 + panY);
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

  // 3. 3D Volumetric Lighting & Dark Glassmorphism Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(9, 11, 16, 0.72)');
  gradient.addColorStop(0.45, 'rgba(9, 11, 16, 0.84)');
  gradient.addColorStop(1, 'rgba(9, 11, 16, 0.97)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 4. Accent Glow Aura
  const radialGlow = ctx.createRadialGradient(
    width * 0.75,
    height * 0.25,
    60,
    width * 0.75,
    height * 0.25,
    width * 0.7
  );
  radialGlow.addColorStop(0, `${scene.accentColor || '#FF6243'}44`);
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // 5. Top Timeline Bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(0, 0, width, 6);
  ctx.fillStyle = scene.accentColor || '#FF6243';
  ctx.fillRect(0, 0, width * ((sceneNumber - 1 + progress) / totalScenes), 6);

  // 6. Header Tag: Category & 3D Badge
  ctx.font = 'bold 15px -apple-system, sans-serif';
  ctx.fillStyle = scene.accentColor || '#FF6243';
  ctx.fillText('✦ 3D AI STUDIO · ESCENA ' + sceneNumber + ' DE ' + totalScenes, 40, isVertical ? 65 : 48);

  // 7. Slide Title
  ctx.font = isVertical ? 'bold 36px -apple-system, sans-serif' : 'bold 42px -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 14;
  wrapText(ctx, scene.title, 40, isVertical ? 120 : 105, isVertical ? width - 80 : width - 260, isVertical ? 46 : 50);
  ctx.shadowBlur = 0;

  // 8. 3D Glassmorphic Bullet Cards
  const startY = isVertical ? 300 : 230;
  const lineSpacing = isVertical ? 86 : 76;
  const cardWidth = isVertical ? width - 80 : width - 360;

  scene.bulletPoints.forEach((point, pIdx) => {
    const pointThreshold = (pIdx + 1) * 0.2;
    if (progress >= pointThreshold * 0.5) {
      const currentY = startY + pIdx * lineSpacing;

      // Card glass background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      roundRect(ctx, 40, currentY - 26, cardWidth, isVertical ? 70 : 62, 14);
      ctx.fill();

      // Glowing edge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Check bullet
      ctx.fillStyle = scene.accentColor || '#FF6243';
      ctx.beginPath();
      ctx.arc(66, currentY + (isVertical ? 8 : 4), 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('✓', 62, currentY + (isVertical ? 12 : 8));

      // Bullet text
      ctx.font = isVertical ? '500 19px -apple-system, sans-serif' : '500 21px -apple-system, sans-serif';
      ctx.fillStyle = '#F1F5F9';
      wrapText(ctx, point, 90, currentY + (isVertical ? 14 : 10), cardWidth - 70, 24);
    }
  });

  // 9. TALKING AI AVATAR PRESENTER IN CORNER
  if (presenter && avatarImg) {
    const avatarRadius = isVertical ? 65 : 75;
    const avatarCenterX = isVertical ? width - 90 : width - 130;
    const avatarCenterY = isVertical ? height - 310 : height - 210;

    // Is talking mouth cycle (simulated lip sync by frame modulation)
    const isMouthOpen = Math.sin(frameIdx * 0.6) > 0.1;
    const activeAvatar = isMouthOpen && talkingAvatarImg ? talkingAvatarImg : avatarImg;

    // Glowing audio aura ring
    ctx.save();
    const auraRadius = avatarRadius + (isMouthOpen ? 8 : 4);
    const auraGlow = ctx.createRadialGradient(
      avatarCenterX,
      avatarCenterY,
      avatarRadius - 5,
      avatarCenterX,
      avatarCenterY,
      auraRadius + 14
    );
    auraGlow.addColorStop(0, `${scene.accentColor || '#FF6243'}88`);
    auraGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGlow;
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, auraRadius + 12, 0, Math.PI * 2);
    ctx.fill();

    // Clip circular avatar
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      activeAvatar,
      avatarCenterX - avatarRadius,
      avatarCenterY - avatarRadius,
      avatarRadius * 2,
      avatarRadius * 2
    );
    ctx.restore();

    // Ring border
    ctx.strokeStyle = isMouthOpen ? (scene.accentColor || '#FF6243') : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Presenter Name Tag
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    roundRect(ctx, avatarCenterX - 75, avatarCenterY + avatarRadius + 6, 150, 26, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎙️ ${presenter.name.split(' ')[0]} (IA)`, avatarCenterX, avatarCenterY + avatarRadius + 23);
    ctx.textAlign = 'left';
  }

  // 10. Modern Karaoke Subtitles Bar at Bottom
  const subtitleBoxY = height - (isVertical ? 190 : 130);
  const subtitleWidth = isVertical ? width - 60 : width - 80;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
  roundRect(ctx, 30, subtitleBoxY, subtitleWidth, isVertical ? 140 : 95, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Subtitle header
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.fillStyle = scene.accentColor || '#F59E0B';
  ctx.fillText('✨ LOCUCIÓN NEURONAL EN VIVO', 50, subtitleBoxY + 26);

  // Subtitle speech text (Hormozi / Viral high-contrast yellow)
  ctx.font = isVertical ? 'bold 21px -apple-system, sans-serif' : 'bold 23px -apple-system, sans-serif';
  ctx.fillStyle = '#FDE047';
  wrapText(ctx, `"${scene.narration}"`, 50, subtitleBoxY + (isVertical ? 62 : 60), subtitleWidth - 40, 30);

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

function startAmbientSoundtrack(
  audioCtx: AudioContext,
  dest: MediaStreamAudioDestinationNode,
  durationSec: number
) {
  try {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.09, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationSec);

    // Harmonic chord progression: A minor 7 / C major 7 frequencies
    const chordFrequencies = [220.0, 261.63, 329.63, 392.0];
    chordFrequencies.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.connect(filter);
      osc.start();
      osc.stop(audioCtx.currentTime + durationSec);
    });

    filter.connect(masterGain);
    masterGain.connect(dest);
  } catch (err) {
    console.warn('Audio synthesis fallback:', err);
  }
}

