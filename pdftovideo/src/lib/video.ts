import type { GenerationProgress, Segment } from './types'
import { MAX_VIDEO_SECONDS } from './types'
import { loadVoices, pickSpanishVoice, speak } from './tts'

const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080
const WORDS_PER_MINUTE = 150
const TRANSITION_MS = 500

export class NoAudioPermissionError extends Error {}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?;])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Trims each segment's narration so the whole book fits inside the 15
 * minute cap. This is a simple, fully client-side condensation: it keeps
 * each segment's opening (usually where the core idea is stated) rather
 * than the full raw text.
 */
export function condenseForNarration(segments: Segment[]): Segment[] {
  const wordBudget = Math.floor(
    (MAX_VIDEO_SECONDS / 60) * WORDS_PER_MINUTE * 0.92, // headroom for transitions
  )
  const totalWords = segments.reduce(
    (sum, s) => sum + s.text.split(/\s+/).filter(Boolean).length,
    0,
  )
  if (totalWords <= wordBudget) return segments

  const perSegmentBudget = Math.max(
    20,
    Math.floor(wordBudget / segments.length),
  )

  return segments.map((seg) => {
    const words = seg.text.split(/\s+/).filter(Boolean)
    if (words.length <= perSegmentBudget) return seg
    return {
      ...seg,
      text: words.slice(0, perSegmentBudget).join(' ') + '…',
    }
  })
}

function drawWrappedSubtitle(
  ctx: CanvasRenderingContext2D,
  text: string,
) {
  if (!text) return
  const maxWidth = CANVAS_WIDTH * 0.82
  const fontSize = 40
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const shownLines = lines.slice(0, 3)

  const lh = fontSize * 1.25
  const barHeight = shownLines.length * lh + 56
  const barY = CANVAS_HEIGHT - barHeight - 60

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.fillRect(0, barY, CANVAS_WIDTH, barHeight)

  ctx.fillStyle = '#ffffff'
  shownLines.forEach((l, idx) => {
    const y = barY + 28 + idx * lh + lh / 2
    ctx.fillText(l, CANVAS_WIDTH / 2, y)
  })
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  zoom: number,
) {
  ctx.fillStyle = '#0b0b12'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  if (!img) return

  const scale =
    Math.max(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height) * zoom
  const w = img.width * scale
  const h = img.height * scale
  const x = (CANVAS_WIDTH - w) / 2
  const y = (CANVAS_HEIGHT - h) / 2

  ctx.save()
  ctx.filter = 'blur(0px) brightness(0.85)'
  ctx.drawImage(img, x, y, w, h)
  ctx.restore()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function pickMimeType(): { mimeType: string; extension: string } {
  const candidates = [
    { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', extension: 'mp4' },
    { mimeType: 'video/mp4', extension: 'mp4' },
    { mimeType: 'video/webm;codecs=vp9,opus', extension: 'webm' },
    { mimeType: 'video/webm;codecs=vp8,opus', extension: 'webm' },
    { mimeType: 'video/webm', extension: 'webm' },
  ]
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mimeType)) return c
  }
  return { mimeType: '', extension: 'webm' }
}

export interface GeneratedVideo {
  url: string
  extension: string
}

/**
 * Renders the narrated video entirely in the browser: draws each segment's
 * page image on a canvas with animated subtitles while speech synthesis
 * narrates the (condensed) text, and records the result with MediaRecorder.
 *
 * Capturing the synthesized voice requires sharing this tab's audio — the
 * browser will prompt for it. There is no way around that prompt: the Web
 * Speech API does not expose its audio as a stream you can attach directly.
 */
export async function generateVideo(
  rawSegments: Segment[],
  options: { subtitles: boolean },
  onProgress: (p: GenerationProgress) => void,
): Promise<GeneratedVideo> {
  onProgress({ step: 'images', percent: 2 })
  const segments = condenseForNarration(rawSegments)

  const images = await Promise.all(
    segments.map((s) => (s.pageImage ? loadImage(s.pageImage) : null)),
  )
  onProgress({ step: 'images', percent: 20 })

  onProgress({ step: 'audio', percent: 25 })
  const voices = await loadVoices()
  const voice = pickSpanishVoice(voices)
  onProgress({ step: 'audio', percent: 40 })

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')!

  // Screen/tab capture is blocked by the browser for any page running
  // inside an iframe (e.g. an embedded preview) — no permission dialog
  // will ever appear there, by design, regardless of what the parent site
  // allows. It only works when this page is the top-level tab.
  const isEmbedded = (() => {
    try {
      return window.self !== window.top
    } catch {
      return true
    }
  })()
  if (isEmbedded) {
    throw new NoAudioPermissionError(
      'No se puede generar el video dentro de una vista incrustada (iframe/preview). Abre esta página en una pestaña nueva del navegador y vuelve a intentarlo.',
    )
  }
  // getDisplayMedia is desktop-only — no mobile browser (iOS Safari, Chrome
  // Android, etc.) implements tab/screen capture, regardless of how the
  // page was opened. This is a separate cause from being embedded, so it
  // needs its own message rather than the (misleading) iframe one.
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new NoAudioPermissionError(
      'Tu navegador no soporta la captura de pestaña necesaria para generar el video. Usa Chrome, Edge o Firefox en una computadora de escritorio.',
    )
  }

  let displayStream: MediaStream
  try {
    displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
      // Chrome-only hints — keep the picker on this tab so audio capture works.
      // @ts-expect-error non-standard but widely supported hints
      preferCurrentTab: true,
      selfBrowserSurface: 'include',
    })
  } catch (err: any) {
    if (err?.name === 'NotAllowedError') {
      throw new NoAudioPermissionError(
        'Permiso denegado. Vuelve a intentarlo y acepta compartir la pestaña con audio.',
      )
    }
    throw new NoAudioPermissionError(
      'No se pudo iniciar la captura de audio/video de esta pestaña. Prueba en Chrome o Edge, en una pestaña nueva (no incrustada).',
    )
  }

  const audioTracks = displayStream.getAudioTracks()
  if (audioTracks.length === 0) {
    displayStream.getTracks().forEach((t) => t.stop())
    throw new NoAudioPermissionError(
      'No se detectó audio compartido. Vuelve a intentarlo y marca la casilla "Compartir audio de la pestaña".',
    )
  }

  const canvasStream = canvas.captureStream(30)
  const combined = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioTracks,
  ])

  const { mimeType, extension } = pickMimeType()
  const recorder = new MediaRecorder(
    combined,
    mimeType ? { mimeType } : undefined,
  )
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  let stopDrawing = false
  let currentImage: HTMLImageElement | null = null
  let previousImage: HTMLImageElement | null = null
  let transitionStart = 0
  let subtitle = ''
  let segmentStart = performance.now()

  function draw(now: number) {
    if (stopDrawing) return
    const elapsed = (now - segmentStart) / 1000
    const zoom = 1 + Math.min(elapsed / 20, 0.12)

    const inTransition = now - transitionStart < TRANSITION_MS
    if (inTransition && previousImage) {
      const alpha = (now - transitionStart) / TRANSITION_MS
      drawBackground(ctx, previousImage, 1.05)
      ctx.save()
      ctx.globalAlpha = alpha
      drawBackground(ctx, currentImage, zoom)
      ctx.restore()
    } else {
      drawBackground(ctx, currentImage, zoom)
    }

    if (options.subtitles) drawWrappedSubtitle(ctx, subtitle)
    requestAnimationFrame(draw)
  }
  requestAnimationFrame(draw)

  const recordingDone = new Promise<Blob>((resolve) => {
    recorder.onstop = () =>
      resolve(new Blob(chunks, { type: mimeType || 'video/webm' }))
  })
  recorder.start(250)

  for (let i = 0; i < segments.length; i++) {
    previousImage = currentImage
    currentImage = images[i]
    transitionStart = performance.now()
    segmentStart = performance.now()

    const sentences = splitSentences(segments[i].text)
    const list = sentences.length > 0 ? sentences : [segments[i].title]
    for (const sentence of list) {
      subtitle = sentence
      await speak(sentence, voice)
    }

    onProgress({
      step: 'composing',
      percent: 40 + Math.round(((i + 1) / segments.length) * 50),
    })
  }

  // Small tail so the last subtitle/frame isn't cut off abruptly.
  await new Promise((r) => setTimeout(r, 400))
  stopDrawing = true
  recorder.stop()
  displayStream.getTracks().forEach((t) => t.stop())
  canvasStream.getTracks().forEach((t) => t.stop())

  const blob = await recordingDone
  onProgress({ step: 'done', percent: 100 })

  return { url: URL.createObjectURL(blob), extension }
}
