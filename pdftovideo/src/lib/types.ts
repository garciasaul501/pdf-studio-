export type SessionStatus =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'ready'
  | 'generating'
  | 'completed'
  | 'error'

export interface Segment {
  id: number
  title: string
  text: string
  /** Data URL (image/jpeg) of a representative page for this segment. */
  pageImage: string
}

export interface GenerationProgress {
  step: 'images' | 'audio' | 'composing' | 'done'
  percent: number
}

export interface SessionState {
  pdfName: string
  totalPages: number
  extractedText: string
  segments: Segment[]
  videoUrl: string | null
  videoExtension: string
  status: SessionStatus
  errorMessage: string | null
}

export const INITIAL_SESSION: SessionState = {
  pdfName: '',
  totalPages: 0,
  extractedText: '',
  segments: [],
  videoUrl: null,
  videoExtension: 'webm',
  status: 'idle',
  errorMessage: null,
}

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024
export const MAX_PAGES = 300
export const MAX_SEGMENTS = 20
export const MAX_VIDEO_SECONDS = 15 * 60
