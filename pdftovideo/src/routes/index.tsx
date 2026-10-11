import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useRef, useState } from 'react'

import { Dropzone } from '#/components/Dropzone'
import { ProgressBar } from '#/components/ProgressBar'
import { GeneratingSteps } from '#/components/GeneratingSteps'
import {
  PdfEmptyTextError,
  PdfPasswordError,
  PdfTooManyPagesError,
  parsePdf,
} from '#/lib/pdf'
import { segmentPages } from '#/lib/segment'
import { NoAudioPermissionError, generateVideo } from '#/lib/video'
import { requirePurchase } from '#/lib/session'
import {
  INITIAL_SESSION,
  MAX_FILE_SIZE_BYTES,
  MAX_PAGES,
  type GenerationProgress,
  type SessionState,
} from '#/lib/types'

// The product this site's subscription plan is attached to — gates the
// video-generation flow to visitors with an active membership (including
// their 7-day free trial).
const PRODUCT_ID = 'prod_Vw3rAPtLT51EF'

const checkAccess = createServerFn({ method: 'GET' }).handler(() =>
  requirePurchase(PRODUCT_ID),
)

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'PDFtoVideo — Convierte libros PDF en videos narrados',
      },
      {
        name: 'description',
        content:
          'Sube un libro en PDF y obtén un video narrado con voz sintética, listo para descargar. Todo se procesa en tu navegador, sin subir tu archivo a ningún servidor.',
      },
    ],
  }),
  loader: () => checkAccess(),
  component: Home,
})

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Home() {
  const access = Route.useLoaderData()
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION)
  const [uploadPercent, setUploadPercent] = useState(0)
  const [extractPercent, setExtractPercent] = useState(0)
  const [genProgress, setGenProgress] = useState<GenerationProgress>({
    step: 'images',
    percent: 0,
  })
  const [subtitlesOn, setSubtitlesOn] = useState(true)
  const [errorContext, setErrorContext] = useState<'extract' | 'generate'>(
    'extract',
  )
  const [isEmbedded, setIsEmbedded] = useState(false)
  const [supportsCapture, setSupportsCapture] = useState(true)
  const videoUrlRef = useRef<string | null>(null)

  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top)
    } catch {
      setIsEmbedded(true)
    }
    // Tab/screen capture (used to record the narration audio) only exists
    // on desktop browsers — no mobile browser implements it, regardless of
    // whether the page is embedded.
    setSupportsCapture(!!navigator.mediaDevices?.getDisplayMedia)
  }, [])

  const canGenerate = access.ok && !isEmbedded && supportsCapture

  function fail(message: string, context: 'extract' | 'generate') {
    setErrorContext(context)
    setSession((s) => ({ ...s, status: 'error', errorMessage: message }))
  }

  async function handleFile(file: File) {
    const looksLikePdf = /\.pdf$/i.test(file.name)
    // Some OSes/browsers hand back an empty or non-standard MIME type for
    // valid PDFs (Android, Drive exports, etc.) — trust the extension unless
    // the browser explicitly reports a different, non-PDF type.
    const mimeLooksOk = !file.type || file.type.toLowerCase().includes('pdf')
    if (!looksLikePdf || !mimeLooksOk) {
      fail('Archivo no soportado. Solo se aceptan archivos .pdf.', 'extract')
      return
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      fail(
        `Supera el límite de ${formatBytes(MAX_FILE_SIZE_BYTES)}.`,
        'extract',
      )
      return
    }

    setUploadPercent(0)
    setSession({ ...INITIAL_SESSION, pdfName: file.name, status: 'uploading' })

    // Brief, honest "uploading" step — the file is being handed to the
    // in-browser parser, nothing leaves the device.
    for (const p of [30, 65, 100]) {
      await new Promise((r) => setTimeout(r, 120))
      setUploadPercent(p)
    }

    setSession((s) => ({ ...s, status: 'extracting' }))
    setExtractPercent(0)

    try {
      const parsed = await parsePdf(file, (fraction) =>
        setExtractPercent(Math.round(fraction * 100)),
      )
      const segments = segmentPages(parsed.pages)
      setSession({
        pdfName: parsed.title,
        totalPages: parsed.totalPages,
        extractedText: parsed.fullText,
        segments,
        videoUrl: null,
        videoExtension: 'webm',
        status: 'ready',
        errorMessage: null,
      })
    } catch (err) {
      if (err instanceof PdfPasswordError) {
        fail('PDF protegido. Desbloquéalo antes de subirlo.', 'extract')
      } else if (err instanceof PdfTooManyPagesError) {
        fail(err.message, 'extract')
      } else if (err instanceof PdfEmptyTextError) {
        fail(err.message, 'extract')
      } else {
        console.error(err)
        fail(
          'No se pudo procesar el PDF. Prueba con otro archivo.',
          'extract',
        )
      }
    }
  }

  async function handleGenerate() {
    setSession((s) => ({ ...s, status: 'generating' }))
    setGenProgress({ step: 'images', percent: 0 })
    try {
      const { url, extension } = await generateVideo(
        session.segments,
        { subtitles: subtitlesOn },
        setGenProgress,
      )
      videoUrlRef.current = url
      setSession((s) => ({
        ...s,
        status: 'completed',
        videoUrl: url,
        videoExtension: extension,
      }))
    } catch (err) {
      if (err instanceof NoAudioPermissionError) {
        fail(err.message, 'generate')
      } else {
        console.error(err)
        fail(
          'Ocurrió un error generando el video. Puedes reintentarlo.',
          'generate',
        )
      }
    }
  }

  function reset() {
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
    videoUrlRef.current = null
    setSession(INITIAL_SESSION)
  }

  function retry() {
    if (errorContext === 'generate' && session.segments.length > 0) {
      setSession((s) => ({ ...s, status: 'ready', errorMessage: null }))
    } else {
      reset()
    }
  }

  return (
    <div className="bg-aurora relative min-h-screen overflow-x-hidden text-slate-100">
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 font-black text-white shadow-[0_0_20px_rgba(139,92,246,0.45)]">
            PV
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-none tracking-tight">
              <span className="text-gradient">PDFtoVideo</span>
            </h1>
            <p className="mt-1 truncate text-sm text-slate-400">
              Convierte libros PDF en videos narrados
            </p>
          </div>
          <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 sm:inline-flex">
            🔒 100% en tu navegador
          </span>
          {access.user ? (
            <a
              href="/api/oauth/signout"
              className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Cerrar sesión
            </a>
          ) : (
            <a
              href={`/api/oauth/login?redirect_to=${encodeURIComponent('/')}`}
              className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
            >
              Iniciar sesión
            </a>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        {session.status === 'idle' && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tu libro, convertido en{' '}
              <span className="text-gradient">video narrado</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Sube un PDF y obtén un video con voz sintética en minutos. Sin
              subir tu archivo a ningún servidor.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                ⚡ Rápido
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                🎙️ Voz por IA
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                🔒 Privado
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                📝 Subtítulos
              </span>
            </div>
          </div>
        )}

        {session.status === 'idle' && access.ok && (
          <Dropzone onFile={handleFile} />
        )}

        {session.status === 'idle' && !access.ok && (
          <div className="glass-card rounded-3xl p-8 text-center sm:p-12">
            <div className="mb-4 text-4xl">🔒</div>
            {access.reason === 'signed_out' ? (
              <>
                <h3 className="text-xl font-semibold">
                  Inicia sesión para generar tu video
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                  Inicia sesión con tu cuenta de Whop y activa 7 días de
                  prueba gratis para convertir tu primer libro.
                </p>
                <a
                  href={`/api/oauth/login?redirect_to=${encodeURIComponent('/')}`}
                  className="btn-gradient mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-white"
                >
                  Iniciar sesión
                </a>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">
                  Activa tu prueba gratis de 7 días
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                  Necesitas una suscripción activa a PDFtoVideo Pro para
                  generar videos. Prueba gratis 7 días, luego $9.99/mes.
                </p>
                <a
                  href="https://whop.com/checkout/plan_KNlkintf2hTmg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gradient mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-white"
                >
                  Empezar prueba gratis
                </a>
              </>
            )}
          </div>
        )}

        {session.status === 'uploading' && (
          <div className="glass-card rounded-3xl p-6 sm:p-10">
            <p className="mb-4 truncate text-sm text-slate-300">
              {session.pdfName}
            </p>
            <ProgressBar percent={uploadPercent} label="Subiendo" />
          </div>
        )}

        {session.status === 'extracting' && (
          <div className="glass-card flex flex-col items-center gap-4 rounded-3xl p-8 text-center sm:p-16">
            <div className="text-4xl">🔍📄</div>
            <p className="text-lg font-medium">Analizando libro…</p>
            <div className="w-full max-w-sm">
              <ProgressBar percent={extractPercent} />
            </div>
          </div>
        )}

        {session.status === 'ready' && (
          <div className="glass-card rounded-3xl p-5 sm:p-8">
            <h2 className="break-words text-xl font-semibold sm:text-2xl">
              {session.pdfName}
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
              <span>{session.totalPages} páginas</span>
              <span>·</span>
              <span>{session.segments.length} segmentos detectados</span>
            </div>

            <label className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-200">
                Incluir subtítulos visibles
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={subtitlesOn}
                onClick={() => setSubtitlesOn((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  subtitlesOn
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-400'
                    : 'bg-white/15'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    subtitlesOn ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>

            {isEmbedded ? (
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                Esta vista está incrustada (preview/iframe) — el navegador no
                permite capturar audio ahí.{' '}
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  Ábrela en una pestaña nueva
                </a>{' '}
                para generar el video.
              </div>
            ) : !supportsCapture ? (
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                Tu navegador no soporta la captura de pestaña necesaria para
                generar el video (común en móviles). Usa Chrome, Edge o
                Firefox en una computadora de escritorio.
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Al generar, tu navegador pedirá permiso para compartir esta
                pestaña (con audio) — así capturamos la narración. Marca
                "Compartir audio de la pestaña" en el diálogo.
              </p>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="btn-gradient mt-6 w-full rounded-xl py-3 text-base font-semibold text-white transition-shadow disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/10 disabled:text-slate-500 disabled:shadow-none"
            >
              Generar video
            </button>
          </div>
        )}

        {session.status === 'generating' && (
          <div className="glass-card rounded-3xl p-6 sm:p-10">
            <h2 className="mb-6 text-lg font-medium">Generando tu video…</h2>
            <GeneratingSteps progress={genProgress} />
          </div>
        )}

        {session.status === 'completed' && session.videoUrl && (
          <div className="glass-card rounded-3xl p-4 sm:p-6">
            <video
              src={session.videoUrl}
              controls
              className="w-full rounded-2xl bg-black"
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={session.videoUrl}
                download={`${session.pdfName || 'video'}.${session.videoExtension}`}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-center font-semibold text-white shadow-[0_10px_30px_-8px_rgba(16,185,129,0.55)] transition-shadow hover:shadow-[0_14px_36px_-8px_rgba(16,185,129,0.75)]"
              >
                Descargar video ({session.videoExtension.toUpperCase()})
              </a>
              <button
                type="button"
                onClick={reset}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-100 hover:bg-white/10"
              >
                Convertir otro PDF
              </button>
            </div>
          </div>
        )}

        {session.status === 'error' && (
          <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-6 text-center backdrop-blur-xl sm:p-8">
            <div className="mb-3 text-3xl">⚠️</div>
            <p className="mb-6 break-words text-red-200">
              {session.errorMessage}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {errorContext === 'generate' && (
                <button
                  type="button"
                  onClick={retry}
                  className="btn-gradient rounded-xl px-6 py-2.5 font-semibold text-white"
                >
                  Reintentar
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-semibold text-slate-100 hover:bg-white/10"
              >
                Subir otro archivo
              </button>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-slate-500">
          Máximo {MAX_PAGES} páginas · 50 MB · video hasta 15 minutos. Todo se
          procesa en tu navegador — tu PDF nunca se sube a un servidor.
        </p>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PDFtoVideo · Hecho con ❤️ en Whop
      </footer>
    </div>
  )
}
