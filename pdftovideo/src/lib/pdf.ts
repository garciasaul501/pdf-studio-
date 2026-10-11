import {
  GlobalWorkerOptions,
  getDocument,
  PasswordResponses,
} from 'pdfjs-dist/legacy/build/pdf.mjs'
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'
import { MAX_PAGES } from './types'

// pdf.js's getTextContent() does `for await (const value of readableStream)`
// internally. Safari's ReadableStream does not implement the async iterator
// protocol (no Symbol.asyncIterator), so that throws there. Polyfill it.
if (
  typeof ReadableStream !== 'undefined' &&
  !(ReadableStream.prototype as any)[Symbol.asyncIterator]
) {
  ;(ReadableStream.prototype as any)[Symbol.asyncIterator] =
    async function* asyncIterator(this: ReadableStream) {
      const reader = this.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) return
          yield value
        }
      } finally {
        reader.releaseLock()
      }
    }
}

GlobalWorkerOptions.workerSrc = workerUrl

export class PdfPasswordError extends Error {}
export class PdfEmptyTextError extends Error {}
export class PdfTooManyPagesError extends Error {}

export interface PdfPage {
  pageNumber: number
  text: string
  /** JPEG data URL rendered from the page, used as video background. */
  image: string
}

export interface ParsedPdf {
  title: string
  totalPages: number
  pages: PdfPage[]
  fullText: string
}

/** Removes repeated headers/footers, excess blank lines and stray whitespace. */
function cleanText(raw: string): string {
  return raw
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !/^\d{1,4}$/.test(line))
    .join('\n')
    .trim()
}

/** Finds lines that repeat on many pages (running headers/footers) and strips them. */
function stripRepeatedLines(pageTexts: string[]): string[] {
  const counts = new Map<string, number>()
  for (const text of pageTexts) {
    const lines = new Set(
      text.split('\n').map((l) => l.trim()).filter((l) => l.length > 3),
    )
    for (const line of lines) counts.set(line, (counts.get(line) ?? 0) + 1)
  }
  const threshold = Math.max(3, Math.floor(pageTexts.length * 0.6))
  const repeated = new Set(
    [...counts.entries()].filter(([, c]) => c >= threshold).map(([l]) => l),
  )
  if (repeated.size === 0) return pageTexts
  return pageTexts.map((text) =>
    text
      .split('\n')
      .filter((l) => !repeated.has(l.trim()))
      .join('\n'),
  )
}

export async function parsePdf(
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<ParsedPdf> {
  const buffer = await file.arrayBuffer()

  let doc
  try {
    doc = await getDocument({
      data: buffer,
      password: undefined,
    }).promise
  } catch (err: any) {
    if (
      err?.name === 'PasswordException' ||
      err?.code === PasswordResponses?.NEED_PASSWORD
    ) {
      throw new PdfPasswordError('PDF protegido con contraseña')
    }
    throw err
  }

  const totalPages = doc.numPages
  if (totalPages > MAX_PAGES) {
    throw new PdfTooManyPagesError(
      `El PDF tiene ${totalPages} páginas. El máximo soportado es ${MAX_PAGES}.`,
    )
  }
  const rawPageTexts: string[] = []
  const pages: PdfPage[] = []

  for (let i = 1; i <= totalPages; i++) {
    const page = await doc.getPage(i)

    // --- Extract text ---
    const textContent = await page.getTextContent()
    const text = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+\n/g, '\n')
    rawPageTexts.push(text)

    // --- Render page image (used as video background) ---
    const viewport = page.getViewport({ scale: 1.2 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvas, canvasContext: ctx, viewport }).promise
    const image = canvas.toDataURL('image/jpeg', 0.82)

    pages.push({ pageNumber: i, text: '', image })

    onProgress?.(i / totalPages)
  }

  const cleanedPageTexts = stripRepeatedLines(rawPageTexts).map(cleanText)
  cleanedPageTexts.forEach((t, idx) => {
    pages[idx].text = t
  })

  const fullText = cleanedPageTexts.join('\n\n').trim()

  if (fullText.length < 100) {
    throw new PdfEmptyTextError(
      'No se pudo extraer texto. ¿Es un PDF escaneado? Prueba con otro archivo.',
    )
  }

  const title = (file.name || 'Libro').replace(/\.pdf$/i, '')

  return { title, totalPages, pages, fullText }
}
