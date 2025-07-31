export const MemoSource = {
  Keyboard: 'keyboard',
  Speech: 'speech',
} as const

export interface Memo {
  id?: number
  title: string
  text: string
  createdAt: number
  updatedAt: number
  source: typeof MemoSource
}

export interface MemoSummary extends Omit<Memo, 'text'> {
  id: number
  hasAudio: boolean
}

export interface MemoAudio {
  id: number
  memoId: number
  blob: Blob
  mimeType: string
  durationMs: number
  createdAt: number
}
