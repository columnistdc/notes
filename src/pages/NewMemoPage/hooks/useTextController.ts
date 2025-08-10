import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

export type TextControllerOptions = {
  draftKey: string
}

export type TextController = {
  title: string
  setTitle: (value: string) => void
  text: string
  setText: (value: string) => void
  dirty: boolean
  setDirty: (value: boolean) => void
  markClean: () => void
  insertAtCursor: (snippet: string) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
}

export default function useTextController(options: TextControllerOptions): TextController {
  const { draftKey } = options
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [dirty, setDirty] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const initialDraftRef = useRef<string>('')
  const initialTitleRef = useRef<string>('')

  useEffect(() => {
    const draft = localStorage.getItem(draftKey) || ''
    const titleDraft = localStorage.getItem(`${draftKey}-title`) || ''
    initialDraftRef.current = draft
    initialTitleRef.current = titleDraft
    setText(draft)
    setTitle(titleDraft)
  }, [draftKey])

  useEffect(() => {
    setDirty(text !== initialDraftRef.current || title !== initialTitleRef.current)

    const timeoutId = setTimeout(() => {
      localStorage.setItem(draftKey, text)
      localStorage.setItem(`${draftKey}-title`, title)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [text, title, draftKey])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      localStorage.setItem(draftKey, text)
      localStorage.setItem(`${draftKey}-title`, title)
      if (!dirty || (!text.trim() && !title.trim())) return
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty, text, title, draftKey])

  const markClean = useCallback(() => {
    localStorage.setItem(draftKey, text)
    localStorage.setItem(`${draftKey}-title`, title)
    initialDraftRef.current = text
    initialTitleRef.current = title
    setDirty(false)
  }, [text, title, draftKey])

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
    dirty,
    setDirty,
    markClean,
    insertAtCursor,
    textareaRef,
  }
}
