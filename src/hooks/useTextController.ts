import { type MutableRefObject, type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MemoPageMode } from '@/constants.ts'
import { getMemoById } from '@/db/dbApi.ts'

interface TextControllerOptions {
  draftKey: string
  mode: MemoPageMode
  memoId?: string
}

interface TextController {
  title: string
  setTitle: (value: string) => void
  text: string
  setText: (value: string) => void
  insertAtCursor: (snippet: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
  loadedUpdatedAt: MutableRefObject<number | undefined>
}

export function useTextController(options: TextControllerOptions): TextController {
  const { draftKey, mode, memoId: id } = options
  const navigate = useNavigate()

  // For create mode, read localStorage synchronously during initialization so
  // we avoid setting state inside the effect (which causes cascading renders).
  const initialDraft = mode === MemoPageMode.Create ? (localStorage.getItem(draftKey) ?? '') : ''
  const initialDraftTitle =
    mode === MemoPageMode.Create ? (localStorage.getItem(`${draftKey}-title`) ?? '') : ''

  const [text, setText] = useState(initialDraft)
  const [title, setTitle] = useState(initialDraftTitle)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const initialText = useRef(initialDraft)
  const initialTitle = useRef(initialDraftTitle)
  const loadedUpdatedAt = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (mode !== MemoPageMode.Edit) return

    const memoId = Number(id)
    if (!id || isNaN(memoId)) {
      void navigate('/memos', { replace: true })
      return
    }

    void getMemoById(memoId).then((memo) => {
      if (!memo) {
        void navigate('/memos', { replace: true })
        return
      }
      setText(memo.text)
      setTitle(memo.title)
      initialText.current = memo.text
      initialTitle.current = memo.title
      loadedUpdatedAt.current = memo.updatedAt
    })
  }, [draftKey, id, mode, navigate])

  useEffect(() => {
    if (mode === MemoPageMode.Edit) {
      return
    }
    const hasChanged = text !== initialText.current || title !== initialTitle.current

    const timeoutId = setTimeout(() => {
      if (hasChanged) {
        localStorage.setItem(draftKey, text)
        localStorage.setItem(`${draftKey}-title`, title)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [text, title, draftKey, mode])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const hasChanged = text !== initialText.current || title !== initialTitle.current
      if (hasChanged && mode !== MemoPageMode.Edit) {
        localStorage.setItem(draftKey, text)
        localStorage.setItem(`${draftKey}-title`, title)
      }
      if (hasChanged) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [text, title, draftKey, mode])

  const insertAtCursor = useCallback((snippet: string) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const newValue = el.value.slice(0, start) + snippet + el.value.slice(end)
    setText(newValue)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + snippet.length
      el.setSelectionRange(pos, pos)
    })
  }, [])

  return {
    title,
    setTitle,
    text,
    setText,
    insertAtCursor,
    textareaRef,
    loadedUpdatedAt,
  }
}
