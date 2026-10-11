import type { PdfPage } from './pdf'
import type { Segment } from './types'
import { MAX_SEGMENTS } from './types'

const CHAPTER_PATTERN =
  /^(cap[ií]tulo|chapter|parte|part|secci[oó]n|section)\b/i

function firstNonEmptyLine(text: string): string {
  return text.split('\n').map((l) => l.trim()).find((l) => l.length > 0) ?? ''
}

/** Looks for pages whose first line reads like a chapter/section heading. */
function findChapterBreaks(pages: PdfPage[]): number[] {
  const breaks: number[] = []
  pages.forEach((page, idx) => {
    const line = firstNonEmptyLine(page.text)
    if (line.length > 0 && line.length <= 70 && CHAPTER_PATTERN.test(line)) {
      breaks.push(idx)
    }
  })
  return breaks
}

function titleFromText(text: string, fallback: string): string {
  const line = firstNonEmptyLine(text)
  if (line.length > 0 && line.length <= 70) return line
  const words = text.trim().split(/\s+/).slice(0, 8).join(' ')
  return words.length > 0 ? `${words}…` : fallback
}

function buildSegment(id: number, pages: PdfPage[]): Segment {
  const text = pages
    .map((p) => p.text)
    .filter(Boolean)
    .join('\n\n')
    .trim()
  return {
    id,
    title: titleFromText(text, `Sección ${id + 1}`),
    text,
    pageImage: pages[0]?.image ?? '',
  }
}

/** Splits pages into `count` contiguous, roughly even groups. */
function evenGroups<T>(items: T[], count: number): T[][] {
  const groups: T[][] = []
  const size = Math.ceil(items.length / count)
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size))
  }
  return groups
}

/**
 * Segments the book into at most MAX_SEGMENTS logical blocks, preferring
 * detected chapter boundaries and falling back to even page grouping.
 */
export function segmentPages(pages: PdfPage[]): Segment[] {
  const nonEmptyPages = pages.filter((p) => p.text.trim().length > 0)
  const usablePages = nonEmptyPages.length > 0 ? nonEmptyPages : pages

  const breaks = findChapterBreaks(usablePages)
  let groups: PdfPage[][]

  if (breaks.length >= 2 && breaks.length <= MAX_SEGMENTS) {
    groups = []
    for (let i = 0; i < breaks.length; i++) {
      const start = breaks[i]
      const end = i + 1 < breaks.length ? breaks[i + 1] : usablePages.length
      groups.push(usablePages.slice(start, end))
    }
    if (breaks[0] > 0) {
      groups.unshift(usablePages.slice(0, breaks[0]))
    }
  } else {
    const targetCount = Math.min(MAX_SEGMENTS, Math.max(1, usablePages.length))
    groups = evenGroups(usablePages, targetCount)
  }

  // Merge tiny/empty groups into their neighbor so we don't waste a scene on
  // a title page or a stray heading.
  const merged: PdfPage[][] = []
  for (const group of groups) {
    const wordCount = group.reduce(
      (sum, p) => sum + p.text.split(/\s+/).filter(Boolean).length,
      0,
    )
    if (wordCount < 25 && merged.length > 0) {
      merged[merged.length - 1] = merged[merged.length - 1].concat(group)
    } else {
      merged.push(group)
    }
  }

  // Enforce the hard cap of MAX_SEGMENTS by merging the smallest neighbors.
  while (merged.length > MAX_SEGMENTS) {
    let smallestIdx = 0
    let smallestLen = Infinity
    for (let i = 0; i < merged.length; i++) {
      const len = merged[i].reduce((s, p) => s + p.text.length, 0)
      if (len < smallestLen) {
        smallestLen = len
        smallestIdx = i
      }
    }
    const mergeInto = smallestIdx === 0 ? 1 : smallestIdx - 1
    const lower = Math.min(smallestIdx, mergeInto)
    const upper = Math.max(smallestIdx, mergeInto)
    merged[lower] = merged[lower].concat(merged[upper])
    merged.splice(upper, 1)
  }

  return merged
    .filter((g) => g.length > 0)
    .map((group, idx) => buildSegment(idx, group))
}
